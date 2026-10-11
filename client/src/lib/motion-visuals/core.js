import {
  fallbackAlphas,
  fallbackGeometry,
  fallbackGlow2,
  hashSeed,
  resolvePalette,
  rgba,
} from './palette.js';
import { loadVariant } from './registry.js';

/*
 * Motion-visual core: one Canvas 2D scene per slot, driven by a single shared requestAnimationFrame ticker.
 *
 *   const scene = createScene(canvas, { kind: 'aurora', seed: 3, brand: 'vibe', night: true, hero: false,
 *                                       onReady, onError });
 *   scene.setPointer(x, y, active)  // manual pointer (-1..1); setPointer(null) returns to automatic tracking
 *   scene.destroy()
 *
 * Handles: sizing (ResizeObserver) + devicePixelRatio (capped at 2, dropped to 1 when frames get slow), lazy init on
 * first intersection, pause when offscreen (IntersectionObserver) or the tab is hidden, reduced motion (OS setting
 * or <html data-motion="reduced">; data-motion="full" overrides the OS) → one frame at variant.staticT and no loop,
 * fine-pointer smoothing, scroll progress of the slot through the viewport. Nothing here runs at import time, so the
 * module is SSR-safe; createScene must only be called in the browser (after mount).
 *
 * Variant contract (variants/<name>.js):
 *   export default { name, init(state) → data, frame(ctx, state, data, t, dt), staticT }
 *   state = { w, h, dpr, seed, rng, hero, night, palette, pointer: { x, y, active }, scroll, reduced, kind }
 *   ctx is pre-scaled for dpr: draw in CSS pixels (w × h). frame() must paint the whole canvas.
 */

const MAX_DT = 1 / 15; // clamp long gaps (tab switch, GC) so motion never jumps
const POINTER_EASE = 6; // 1/s, exponential smoothing rate
const SLOW_FRAME_MS = 9; // EMA of frame() CPU time above which a dpr>1 scene drops to dpr 1
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
// Frames right after a scene starts, and while the live app renders behind the prerendered snapshot, are not a
// fair sample (first-load jank): quality is never lowered on them.
const WARMUP_MS = 2500;
const handoverPending = () => !!document.getElementById('root')?.classList.contains('is-prerender-pending');
// Phones and small screens: the shared ticker paints at 30 fps (the motion is slow by design) and card visuals start
// at dpr 1. Data Saver, or a touch device with 4 or fewer cores: the static frame only, as under reduced motion.
// Decided once per page.
let envCache = null;
function env() {
  if (envCache) return envCache;
  const coarse = !!window.matchMedia?.('(pointer: coarse)').matches;
  const small = !!window.matchMedia?.('(max-width: 767.98px)').matches;
  const saveData = !!navigator.connection?.saveData;
  const cores = navigator.hardwareConcurrency || 8;
  envCache = { halfRate: coarse || small, cardDpr: coarse ? 1 : 2, staticOnly: saveData || (coarse && cores <= 4) };
  return envCache;
}

/* ------------------------------------------------------------------------------------------------ rng */

/** Seeded PRNG → () => [0, 1). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------------------------- reduced motion */

const RM_QUERY = '(prefers-reduced-motion: reduce)';

/** Same rule as hooks/useReducedMotion: data-motion="reduced" → true, "full" → false, else the OS setting. */
export function readReducedMotion() {
  if (!isBrowser) return true;
  const pref = document.documentElement.dataset.motion;
  if (pref === 'reduced') return true;
  if (pref === 'full') return false;
  return !!window.matchMedia?.(RM_QUERY).matches;
}

const rmListeners = new Set();
let rmTeardown = null;
function subscribeReduced(fn) {
  rmListeners.add(fn);
  if (!rmTeardown) {
    const notify = () => rmListeners.forEach((l) => l());
    const mq = window.matchMedia?.(RM_QUERY);
    mq?.addEventListener?.('change', notify);
    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(notify) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    rmTeardown = () => {
      mq?.removeEventListener?.('change', notify);
      mo?.disconnect();
    };
  }
  return () => {
    rmListeners.delete(fn);
    if (!rmListeners.size && rmTeardown) {
      rmTeardown();
      rmTeardown = null;
    }
  };
}

/* ------------------------------------------------------------------------------------- shared ticker */

const running = new Set();
let rafId = 0;
let tick = 0;
// While the page is being scrolled and several scenes are on screen, each scene paints every other frame
// (alternating, so the GPU load per frame halves). The visuals move slowly; 30 fps during a scroll is invisible,
// a dropped page-scroll frame is not.
const SCROLL_SHARE_MIN = 3; // scenes running before sharing kicks in
const SCROLL_IDLE_MS = 140;
let lastScroll = -1e9;
let scrollHooked = false;
function hookScroll() {
  if (scrollHooked || !isBrowser) return;
  scrollHooked = true;
  window.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true, capture: true });
}
// GPU back-pressure guard: frame() CPU time (autoQuality) misses raster cost on weak GPUs. When the shared rAF
// interval stays above ~22 ms (under 45 fps) for ~1.5 s while scenes run, lower one scene's resolution by a step
// (2 → 1.5 → 1 dpr; cards before heroes). Repeats until frames recover or every scene is at dpr 1.
// Recovery: once frames have been fast (under ~18 ms) for ~5 s, raise one lowered scene a step again (heroes first),
// so a busy moment during load does not leave the canvases soft for the rest of the visit.
const degraders = new Set(); // { hero, dpr(): number, lower(): boolean, canRaise(): boolean, raise(): boolean }
let frameEma = 0;
let slowFrames = 0;
let fastFrames = 0;
let lastNow = 0;
let warmUntil = 0; // performance.now() before which frames are not sampled
function upgradeOne() {
  let pick = null;
  for (const d of degraders) {
    if (!d.canRaise()) continue;
    if (!pick || (d.hero && !pick.hero)) pick = d;
  }
  return pick ? pick.raise() : false;
}
function degradeOne() {
  let pick = null;
  for (const d of degraders) {
    const r = d.dpr();
    if (r <= 1) continue;
    if (!pick || (pick.hero && !d.hero) || (pick.hero === d.hero && r > pick.dpr())) pick = d;
  }
  return pick ? pick.lower() : false;
}
function watchFrames(now, interval) {
  if (now < warmUntil || handoverPending()) {
    lastNow = 0;
    slowFrames = 0;
    fastFrames = 0;
    return;
  }
  if (lastNow) {
    const d = (now - lastNow) / interval; // per display frame, also when the ticker paints every other frame
    if (d < 250) frameEma = frameEma ? frameEma * 0.9 + d * 0.1 : d; // ignore tab switches / long pauses
  }
  lastNow = now;
  if (frameEma > 22) {
    slowFrames++;
    fastFrames = 0;
  } else {
    slowFrames = 0;
    if (frameEma && frameEma < 18) fastFrames++;
    else fastFrames = 0;
  }
  if (slowFrames > 60 / interval) {
    slowFrames = 0;
    frameEma = 0;
    degradeOne();
  } else if (fastFrames > 300 / interval) {
    fastFrames = 0;
    upgradeOne();
  }
}
function loop(now) {
  rafId = 0;
  tick++;
  const half = env().halfRate;
  if (half && tick % 2) {
    // 30 fps on phones: skip this frame (each scene's dt spans both frames, so the motion keeps its speed)
    if (running.size) rafId = requestAnimationFrame(loop);
    return;
  }
  watchFrames(now, half ? 2 : 1);
  const share = running.size >= SCROLL_SHARE_MIN && now - lastScroll < SCROLL_IDLE_MS;
  let i = 0;
  for (const s of running) {
    if (!share || (i + tick) % 2 === 0) s(now);
    i++;
  }
  if (running.size) rafId = requestAnimationFrame(loop);
}

/* Scene inits (geometry, sprites, offscreen layers + the first paint) are queued and run one per frame, heroes
   first, so several slots entering the init margin together never stack into one long frame. */
const initQueue = [];
let initRaf = 0;
function runInitQueue() {
  initRaf = 0;
  const t0 = performance.now();
  // at least one init per frame; more only while the frame stays under ~3 ms. A slot can unmount (dequeueInit)
  // between scheduling and this frame and leave the queue empty, so check before every shift.
  try {
    while (initQueue.length) {
      initQueue.shift().fn();
      if (performance.now() - t0 >= 3) break;
    }
  } finally {
    if (initQueue.length && !initRaf) initRaf = requestAnimationFrame(runInitQueue);
  }
}
function queueInit(job) {
  if (initQueue.includes(job)) return;
  if (job.hero) initQueue.unshift(job);
  else initQueue.push(job);
  if (!initRaf) initRaf = requestAnimationFrame(runInitQueue);
}
function dequeueInit(job) {
  const k = initQueue.indexOf(job);
  if (k >= 0) initQueue.splice(k, 1);
  if (!initQueue.length && initRaf) {
    cancelAnimationFrame(initRaf);
    initRaf = 0;
  }
}
function startTicking(step) {
  hookScroll();
  warmUntil = Math.max(warmUntil, performance.now() + WARMUP_MS);
  running.add(step);
  if (!rafId) rafId = requestAnimationFrame(loop);
}
function stopTicking(step) {
  running.delete(step);
  if (!running.size && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (!running.size) {
    lastNow = 0;
    frameEma = 0;
    slowFrames = 0;
    fastFrames = 0;
  }
}

/* ------------------------------------------------------------------------------------- shared pointer */

const ptr = { x: 0, y: 0, has: false };
let ptrUsers = 0;
const onPtrMove = (e) => {
  if (e.pointerType === 'touch') return;
  ptr.x = e.clientX;
  ptr.y = e.clientY;
  ptr.has = true;
};
const onPtrOut = (e) => {
  if (!e.relatedTarget) ptr.has = false;
};
const onBlur = () => {
  ptr.has = false;
};
function finePointer() {
  return !!window.matchMedia?.('(any-pointer: fine)').matches;
}
function acquirePointer() {
  if (ptrUsers++ === 0) {
    window.addEventListener('pointermove', onPtrMove, { passive: true });
    document.addEventListener('pointerout', onPtrOut, { passive: true });
    window.addEventListener('blur', onBlur);
  }
}
function releasePointer() {
  if (--ptrUsers === 0) {
    window.removeEventListener('pointermove', onPtrMove);
    document.removeEventListener('pointerout', onPtrOut);
    window.removeEventListener('blur', onBlur);
    ptr.has = false;
  }
}

/* ------------------------------------------------------------------------------- static gradient frame */

/** Canvas version of the CSS fallback (used when no variant could be loaded). */
export function drawStaticGradient(ctx, state) {
  const { w, h, palette: p, night, seed } = state;
  const g = fallbackGeometry(seed);
  const a = fallbackAlphas(night);
  ctx.fillStyle = p.ground;
  ctx.fillRect(0, 0, w, h);
  const lin = ctx.createLinearGradient(0, 0, w * 0.34, h);
  lin.addColorStop(0, p.ground2);
  lin.addColorStop(1, p.ground);
  ctx.fillStyle = lin;
  ctx.fillRect(0, 0, w, h);
  const blob = (cx, cy, rx, ry, color) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx, ry);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    rg.addColorStop(0, color);
    rg.addColorStop(1, rgba(p.ground, 0));
    ctx.fillStyle = rg;
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  };
  blob((g.hx / 100) * w, (g.hy / 100) * h, w * 0.5, h * 0.6, rgba(fallbackGlow2(p, night), a.glow2));
  blob((g.gx / 100) * w, (g.gy / 100) * h, w * 0.6, h * 0.7, rgba(p.glow, a.glow));
}

/* ------------------------------------------------------------------------------------------- scene */

/**
 * @param {HTMLCanvasElement} canvas  sized by CSS (the core reads its CSS box; it never sets canvas.style size)
 * @param {object} opts
 *   kind      variant name from the registry (falls back to 'aurora', then to the static gradient)
 *   variant   a variant object to use directly (skips the registry; for tests)
 *   seed      number | string (deterministic geometry)
 *   brand     'research' | 'vibe' | 'connect' | 'women' | 'x' | undefined (masterbrand)
 *   night     Ink ground
 *   hero      hero slot (variants may draw richer / larger)
 *   palette   partial palette override, merged over resolvePalette({ brand, night })
 *   maxDpr    devicePixelRatio cap (default 2)
 *   reduced   true/false forces reduced motion; undefined follows the OS / data-motion
 *   pointer   false disables pointer tracking (default true; fine pointers only)
 *   autoQuality  drop dpr to 1 when frames are slow (default true)
 *   rootMargin   IntersectionObserver margin for running (default '160px')
 *   initMargin   margin at which the scene is built and its first (static) frame painted, queued one per frame
 *                (default '600px'), so it is ready before it scrolls into view
 *   onReady(info)  after the first frame is painted: { kind, requested, fallback }
 *   onError(err)   init/frame threw; the scene stops (the CSS fallback stays)
 */
export function createScene(canvas, opts = {}) {
  if (!isBrowser || !canvas) throw new Error('createScene: browser + canvas required');
  const {
    kind,
    variant: directVariant,
    seed = 1,
    brand,
    night = false,
    hero = false,
    palette: paletteOverride,
    maxDpr = hero ? 2 : env().cardDpr,
    reduced: forcedReduced,
    pointer: usePointer = true,
    autoQuality = true,
    rootMargin = '160px',
    initMargin = '600px',
    onReady,
    onError,
  } = opts;

  const ctx = canvas.getContext('2d');
  const seedNum = hashSeed(seed);
  const state = {
    w: 0,
    h: 0,
    dpr: 1,
    seed: seedNum,
    rng: mulberry32(seedNum),
    hero: !!hero,
    night: !!night,
    palette: { ...resolvePalette({ brand, night }), ...(paletteOverride || {}) },
    pointer: { x: 0, y: 0, active: 0 },
    scroll: 0.5,
    reduced: false,
    kind: kind || null,
  };

  let variant = null; // resolved module
  let variantInfo = null; // { kind, requested, fallback }
  let staticOnly = false; // no variant: static gradient
  let data = null;
  let inited = false;
  let loaded = false;
  let destroyed = false;
  let failed = false;
  let readyFired = false;
  let inView = typeof IntersectionObserver === 'undefined';
  let near = inView; // within initMargin
  const initJob = { hero: !!hero, fn: () => doInit() };
  const degrader = {
    hero: !!hero,
    dpr: () => (isRunning ? state.dpr : 1),
    lower() {
      if (!autoQuality || destroyed || state.dpr <= 1) return false;
      dprCap = Math.max(1, Math.round((state.dpr - 0.5) * 2) / 2);
      if (applySize(state.w, state.h)) {
        measure(0);
        paint(t, 0);
      }
      return true;
    },
    canRaise: () =>
      autoQuality && isRunning && !destroyed && dprCap < maxCap && state.dpr < Math.min(window.devicePixelRatio || 1, maxCap),
    raise() {
      if (!degrader.canRaise()) return false;
      dprCap = Math.min(maxCap, dprCap + 0.5);
      emaMs = 0;
      frames = Math.min(frames, 1);
      holdUntil = performance.now() + WARMUP_MS;
      if (applySize(state.w, state.h)) {
        measure(0);
        paint(t, 0);
      }
      return true;
    },
  };
  degraders.add(degrader);
  let docHidden = document.visibilityState === 'hidden';
  let override = forcedReduced; // undefined → follow environment
  const lowPower = env().staticOnly; // Data Saver / low-end touch device: the static frame only
  let reduced = override ?? (readReducedMotion() || lowPower);
  const maxCap = Math.max(1, maxDpr);
  let dprCap = maxCap;
  let holdUntil = 0; // no per-scene quality drop before this (warm-up after a start or a raise)
  let t = 0;
  let prev = null;
  let frames = 0;
  let emaMs = 0;
  let manual = null; // { x, y, active } from setPointer
  let isRunning = false;
  const ptrOn = usePointer && finePointer();
  if (ptrOn) acquirePointer();

  let resolveReady;
  const readyPromise = new Promise((r) => {
    resolveReady = r;
  });

  /* ---------- sizing */

  function cssSize() {
    // clientWidth/Height are integers; the bounding rect keeps fractional CSS px.
    const r = canvas.getBoundingClientRect();
    return [r.width || canvas.clientWidth, r.height || canvas.clientHeight];
  }

  /** Apply a CSS size; returns true when the backing store changed. */
  function applySize(w, h) {
    if (!(w >= 2 && h >= 2)) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    if (bw === canvas.width && bh === canvas.height && w === state.w && h === state.h && dpr === state.dpr) return false;
    canvas.width = bw;
    canvas.height = bh;
    state.w = w;
    state.h = h;
    state.dpr = dpr;
    if (inited) initData(); // geometry depends on w/h: rebuild, deterministically
    return true;
  }

  function initData() {
    state.rng = mulberry32(seedNum);
    data = null;
    if (!variant) return;
    try {
      data = typeof variant.init === 'function' ? variant.init(state) : null;
    } catch (err) {
      fail(err);
    }
  }

  /* ---------- drawing */

  function staticT() {
    const s = variant && Number(variant.staticT);
    return Number.isFinite(s) ? s : 0;
  }

  function paint(time, dt) {
    if (destroyed || failed || !inited || state.w < 2) return;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    const t0 = performance.now();
    try {
      if (staticOnly) drawStaticGradient(ctx, state);
      else variant.frame(ctx, state, data, time, dt);
    } catch (err) {
      fail(err);
      return;
    }
    frames++;
    const cost = performance.now() - t0;
    emaMs = frames === 1 ? cost : emaMs * 0.92 + cost * 0.08;
    if (autoQuality && isRunning && frames > 45 && emaMs > SLOW_FRAME_MS && dprCap > 1 && state.dpr > 1 && t0 > holdUntil && !handoverPending()) {
      dprCap = 1;
      emaMs = 0;
      applySize(state.w, state.h);
    }
    if (!readyFired) {
      readyFired = true;
      resolveReady(variantInfo);
      try {
        onReady?.(variantInfo);
      } catch {
        /* consumer error must not stop the scene */
      }
    }
  }

  /** The reduced-motion / static frame: staticT, centred pointer, mid scroll. */
  function paintStatic() {
    state.pointer.x = 0;
    state.pointer.y = 0;
    state.pointer.active = 0;
    state.scroll = 0.5;
    t = staticT();
    paint(t, 0);
  }

  function measure(dt) {
    const r = canvas.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 1;
    state.scroll = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height || 1)));
    let tx = 0;
    let ty = 0;
    let ta = 0;
    if (manual) {
      tx = manual.x;
      ty = manual.y;
      ta = manual.active;
    } else if (ptrOn && ptr.has && r.width > 0 && r.height > 0) {
      const nx = ((ptr.x - r.left) / r.width) * 2 - 1;
      const ny = ((ptr.y - r.top) / r.height) * 2 - 1;
      if (nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1) {
        tx = nx;
        ty = ny;
        ta = 1;
      }
    }
    const k = dt > 0 ? 1 - Math.exp(-dt * POINTER_EASE) : 0;
    const p = state.pointer;
    p.x += (tx - p.x) * k;
    p.y += (ty - p.y) * k;
    p.active += (ta - p.active) * k;
  }

  function step(now) {
    if (prev === null) prev = now;
    const dt = Math.min(Math.max((now - prev) / 1000, 0), MAX_DT);
    prev = now;
    // devicePixelRatio can change (browser zoom, moving between monitors)
    const wantDpr = Math.min(window.devicePixelRatio || 1, dprCap);
    if (wantDpr !== state.dpr) applySize(state.w, state.h);
    t += dt;
    measure(dt);
    paint(t, dt);
  }

  /* ---------- lifecycle */

  function updateRunning() {
    const should = !destroyed && !failed && inited && !staticOnly && !reduced && inView && !docHidden;
    if (should && !isRunning) {
      isRunning = true;
      prev = null;
      holdUntil = performance.now() + WARMUP_MS;
      startTicking(step);
    } else if (!should && isRunning) {
      isRunning = false;
      stopTicking(step);
    }
  }

  function tryInit() {
    if (inited || destroyed || failed || !loaded || !(near || inView)) return;
    queueInit(initJob);
  }

  function doInit() {
    if (inited || destroyed || failed || !loaded) return;
    const [w, h] = cssSize();
    if (!(w >= 2 && h >= 2)) return; // not laid out yet: the ResizeObserver will call again
    inited = true;
    applySize(w, h);
    initData();
    if (failed) return;
    state.reduced = reduced;
    if (reduced || staticOnly) paintStatic();
    else {
      t = staticT();
      measure(0);
      paint(t, 0); // first frame = the static frame, then the loop continues from it
    }
    updateRunning();
  }

  function fail(err) {
    if (failed) return;
    failed = true;
    if (isRunning) {
      isRunning = false;
      stopTicking(step);
    }
    if (import.meta.env?.DEV) console.error(`[motion-visuals] scene "${variantInfo?.kind || kind}" failed`, err);
    try {
      onError?.(err);
    } catch {
      /* ignore */
    }
  }

  function onReducedChange() {
    const next = override ?? (readReducedMotion() || lowPower);
    if (next === reduced) return;
    reduced = next;
    state.reduced = reduced;
    if (!inited) return;
    if (reduced) {
      updateRunning();
      paintStatic();
    } else {
      t = staticT();
      updateRunning();
    }
  }

  const unsubReduced = subscribeReduced(onReducedChange);

  const onVisibility = () => {
    docHidden = document.visibilityState === 'hidden';
    updateRunning();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const ro =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver((entries) => {
          if (destroyed) return;
          const e = entries[entries.length - 1];
          const box = e.contentBoxSize?.[0];
          const w = box ? box.inlineSize : e.contentRect.width;
          const h = box ? box.blockSize : e.contentRect.height;
          if (!inited) {
            tryInit();
            return;
          }
          if (applySize(w, h)) {
            // setting canvas.width cleared it: repaint now (before the browser paints) so there is no blank frame
            if (reduced || staticOnly) paintStatic();
            else {
              measure(0);
              paint(t, 0);
            }
          }
        })
      : null;
  ro?.observe(canvas);

  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            const e = entries[entries.length - 1];
            inView = e.isIntersecting;
            if (inView) ensureLoad();
            if (!inited) tryInit();
            updateRunning();
          },
          { rootMargin }
        )
      : null;
  io?.observe(canvas);
  const nearIo =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            near = entries[entries.length - 1].isIntersecting;
            if (near) ensureLoad();
            if (near && !inited) tryInit();
          },
          { rootMargin: initMargin }
        )
      : null;
  nearIo?.observe(canvas);

  // Resolve the variant (async) once the slot is near the viewport (initMargin), then init on the first
  // intersection. Until then the CSS gradient fallback shows and no variant chunk is fetched.
  let loadStarted = false;
  function ensureLoad() {
    if (loadStarted || destroyed) return;
    loadStarted = true;
    const source = directVariant
      ? Promise.resolve({ name: directVariant.name || kind || 'custom', variant: directVariant, fallback: false })
      : loadVariant(kind);
    source
      .then((res) => {
        if (destroyed) return;
        if (res && res.variant) {
          variant = res.variant;
          variantInfo = { kind: res.name, requested: kind || res.name, fallback: res.fallback };
        } else {
          staticOnly = true;
          variantInfo = { kind: null, requested: kind || null, fallback: 'static' };
        }
        state.kind = variantInfo.kind;
        loaded = true;
        tryInit();
      })
      .catch(fail);
  }
  if (near || inView) ensureLoad();

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (isRunning) stopTicking(step);
      isRunning = false;
      ro?.disconnect();
      io?.disconnect();
      nearIo?.disconnect();
      dequeueInit(initJob);
      degraders.delete(degrader);
      unsubReduced();
      document.removeEventListener('visibilitychange', onVisibility);
      if (ptrOn) releasePointer();
    },
    /** Manual pointer in -1..1 (active 0..1); setPointer(null) returns to automatic fine-pointer tracking. */
    setPointer(x, y, active = 1) {
      if (x === null || x === undefined) {
        manual = null;
        return;
      }
      const c = (v) => Math.max(-1, Math.min(1, Number(v) || 0));
      manual = { x: c(x), y: c(y), active: Math.max(0, Math.min(1, Number(active) || 0)) };
    },
    /** Force reduced motion on/off (true/false) or follow the environment again (undefined). */
    setReduced(v) {
      override = v === undefined || v === null ? undefined : !!v;
      onReducedChange();
    },
    /** Repaint the current frame (e.g. after a palette change). */
    redraw() {
      if (!inited) return;
      if (reduced || staticOnly) paintStatic();
      else paint(t, 0);
    },
    /** Resolves after the first frame is painted, with { kind, requested, fallback }. */
    ready: readyPromise,
    get stats() {
      return {
        kind: variantInfo?.kind ?? null,
        requested: kind ?? null,
        fallback: variantInfo?.fallback ?? null,
        loaded,
        inited,
        running: isRunning,
        inView,
        hidden: docHidden,
        reduced,
        failed,
        frames,
        t,
        w: state.w,
        h: state.h,
        dpr: state.dpr,
        backing: [canvas.width, canvas.height],
        frameMs: Math.round(emaMs * 100) / 100,
        pointer: { ...state.pointer },
        scroll: state.scroll,
      };
    },
    state,
  };
}

/** Number of scenes currently animating (for tests / diagnostics). */
export function runningSceneCount() {
  return running.size;
}

export { resolvePalette } from './palette.js';
export { ALL_KINDS, CARD_KINDS, HERO_KINDS, VARIANTS, loadVariant, availableKinds } from './registry.js';
