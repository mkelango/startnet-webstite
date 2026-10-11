/*
 * DEV-ONLY test harness for motion visuals. Not imported by the app (so never bundled); load it from puppeteer or the
 * console on the Vite dev server:
 *
 *   const h = await import('/src/lib/motion-visuals/dev-harness.js');
 *   const m = await h.mount({ kind: 'aurora', w: 640, h: 360, seed: 3, night: true, brand: 'vibe' });
 *   await m.scene.ready;  m.scene.stats;  h.snapshot(m);  m.unmount();
 *   await h.gallery({ night: true });  // every kind in a grid
 *   h.fps(1000) → measured RAF fps
 *
 * Containers are injected into a fixed overlay (#mv-harness) on top of the page.
 */
import { createScene, runningSceneCount } from './core.js';
import { ALL_KINDS, availableKinds } from './registry.js';
import { resolvePalette } from './palette.js';

if (!import.meta.env?.DEV) throw new Error('motion-visuals dev harness is dev-only');

const mounted = new Set();

function root() {
  let el = document.getElementById('mv-harness');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mv-harness';
    el.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;overflow:auto;background:#808080;display:flex;flex-wrap:wrap;' +
      'align-content:flex-start;gap:12px;padding:12px;box-sizing:border-box';
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Mount one scene into an injected canvas.
 * opts: createScene options + { w, h (CSS px), label, parent, position: 'flow' | 'offscreen' }
 */
export async function mount(opts = {}) {
  const { w = 480, h = 300, label, parent, position = 'flow', ...sceneOpts } = opts;
  const box = document.createElement('div');
  box.className = 'mv-harness__box';
  box.style.cssText = `position:relative;width:${w}px;height:${h}px;flex:none;border-radius:12px;overflow:hidden;`;
  if (position === 'offscreen') box.style.cssText += 'position:absolute;top:10000px;left:0;';
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  box.appendChild(canvas);
  if (label) {
    const tag = document.createElement('span');
    tag.textContent = label;
    tag.style.cssText =
      'position:absolute;left:8px;top:8px;font:12px/1 monospace;background:#000a;color:#fff;padding:3px 5px;border-radius:3px';
    box.appendChild(tag);
  }
  (parent || root()).appendChild(box);
  const scene = createScene(canvas, sceneOpts);
  const handle = {
    box,
    canvas,
    scene,
    resize(nw, nh) {
      box.style.width = `${nw}px`;
      box.style.height = `${nh}px`;
    },
    unmount() {
      scene.destroy();
      box.remove();
      mounted.delete(handle);
    },
  };
  mounted.add(handle);
  return handle;
}

/** Mount every known kind (or `kinds`) in a grid; resolves when all painted (or timed out). */
export async function gallery({ kinds = ALL_KINDS, w = 360, h = 240, timeout = 4000, ...rest } = {}) {
  const list = await Promise.all(kinds.map((k, i) => mount({ kind: k, seed: i + 1, w, h, label: k, ...rest })));
  await Promise.race([Promise.all(list.map((m) => m.scene.ready)), new Promise((r) => setTimeout(r, timeout))]);
  return list.map((m) => ({ requested: m.scene.stats.requested, ...m.scene.stats }));
}

export function unmountAll() {
  [...mounted].forEach((m) => m.unmount());
  document.getElementById('mv-harness')?.remove();
}

/** PNG data URL of a mounted scene's canvas. */
export function snapshot(m) {
  return m.canvas.toDataURL('image/png');
}

/** Average luminance + a cheap hash of the canvas pixels (detects change between frames). */
export function pixelSignature(m) {
  const c = m.canvas;
  const ctx = c.getContext('2d');
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  let sum = 0;
  let hash = 0;
  const stride = 4 * 97;
  for (let i = 0; i < data.length; i += stride) {
    sum += data[i] + data[i + 1] + data[i + 2];
    hash = (hash * 31 + data[i] * 7 + data[i + 1] * 3 + data[i + 2]) >>> 0;
  }
  return { lum: sum / ((data.length / stride) * 3), hash };
}

/** Measure RAF frames per second over `ms`. */
export function fps(ms = 1000) {
  return new Promise((resolve) => {
    let n = 0;
    const t0 = performance.now();
    const f = (now) => {
      n++;
      if (now - t0 < ms) requestAnimationFrame(f);
      else resolve(Math.round((n * 1000) / (now - t0)));
    };
    requestAnimationFrame(f);
  });
}

/** Render <MotionVisual {...props}/> into an injected box of width `w` (React client root). */
export async function mountComponent(props = {}, { w = 480 } = {}) {
  const [React, { createRoot }, { MotionVisual }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('../../components/MotionVisual.jsx'),
  ]);
  const box = document.createElement('div');
  box.style.cssText = `width:${w}px;flex:none;border-radius:12px;overflow:hidden`;
  root().appendChild(box);
  const r = createRoot(box);
  r.render(React.createElement(MotionVisual, props));
  return {
    box,
    get el() {
      return box.firstElementChild;
    },
    rerender(next) {
      r.render(React.createElement(MotionVisual, next));
    },
    unmount() {
      r.unmount();
      box.remove();
    },
  };
}

export const info = () => ({ available: availableKinds(), all: ALL_KINDS, running: runningSceneCount() });
export { resolvePalette, runningSceneCount };

if (typeof window !== 'undefined') window.__mvHarness = { mount, gallery, unmountAll, snapshot, pixelSignature, fps, info };
