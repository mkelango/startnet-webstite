// flow — silk threads. Dozens of fine, low-opacity curves ride an evolving flow
// field: a slowly twisting ribbon whose threads converge and fan apart like silk
// catching light. One thread is traced in red (a short comet with a soft head —
// the composition's single red point). The pointer bends the field like a lens;
// scroll advances the phase.
//
// Performance: threads are evaluated into one preallocated Float32Array per
// frame (no allocations), stroked in a handful of depth-shaded chunks with a
// single cached horizontal gradient. Background gradients are cached per size.

const TAU = Math.PI * 2;
const STATIC_T = 9.5;

/* ---------- colour helpers (self-contained, hex or rgb[a]) ---------- */
function parse(c) {
  if (typeof c !== 'string') return [0, 0, 0];
  const s = c.trim();
  let m = s.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length < 6) h = h.split('').map((x) => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    return [p[0] || 0, p[1] || 0, p[2] || 0];
  }
  return [0, 0, 0];
}
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const mixc = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const same = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 6;

// The masterbrand accent is the SNX Red family; never let it tint decorative
// lines (one red point per composition) — fall back to Lagoon.
function colours(p, night) {
  const red = parse(p.red);
  const acc = parse(p.accent || p.lagoon);
  const lagoon = parse(p.lagoon);
  const tint = same(acc, red) || same(acc, parse(night ? '#F87171' : '#EF4444')) ? lagoon : acc;
  return {
    ground: parse(p.ground),
    ground2: parse(p.ground2 || p.ground),
    mark: parse(night ? p.paper || p.ink : p.ink),
    tint,
    lagoon,
    red,
  };
}

/* ---------- variant ---------- */
export default {
  name: 'flow',
  staticT: STATIC_T,

  init(state) {
    const { w, h, hero, rng } = state;
    const area = w * h;
    const count = hero
      ? Math.max(30, Math.min(64, Math.round(area / 15000)))
      : Math.max(14, Math.min(26, Math.round(area / 5200)));
    const steps = Math.max(44, Math.min(132, Math.round(w / 10)));
    // Cross-section of the ribbon: a = across the width, b = thickness. Slight
    // jitter keeps it organic; a sorted `a` keeps it reading as one silk sheet.
    const a = new Float32Array(count);
    const b = new Float32Array(count);
    const wob = new Float32Array(count);
    const vo = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      vo[i] = (i * 0.618034) % 1;
      const u = count === 1 ? 0.5 : i / (count - 1);
      a[i] = (u - 0.5) + (rng() - 0.5) * (0.6 / count);
      b[i] = (rng() - 0.5) * 0.22;
      wob[i] = rng() * TAU;
    }
    const s = [];
    for (let i = 0; i < 8; i++) s.push(rng() * TAU);
    return {
      count,
      steps,
      a,
      b,
      wob,
      vo,
      s,
      redIndex: Math.round(count * (0.6 + rng() * 0.12)) % count,
      redPhase: rng(),
      xs: new Float32Array(steps + 1),
      ys: new Float32Array((steps + 1) * count),
      ds: new Float32Array((steps + 1) * count),
      cache: null,
      cacheKey: '',
    };
  },

  frame(ctx, state, data, t, dt) {
    const { w, h, hero, night, palette, pointer } = state;
    const scroll = state.scroll || 0;
    const key = `${w}x${h}|${state.dpr}|${night ? 1 : 0}|${palette.ground}|${palette.accent}|${palette.glow}`;
    if (data.cacheKey !== key) {
      data.cache = buildCache(ctx, state);
      data.cacheKey = key;
    }
    const C = data.cache;

    /* ground + soft gradient light */
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(C.layer, 0, 0, w, h);

    /* evaluate field */
    const { count, steps, a, b, wob, s, xs, ys, ds } = data;
    const tt = t * 0.55 + scroll * 2.2;
    const px = (pointer ? pointer.x : 0) * 0.5 + 0.5;
    const py = (pointer ? pointer.y : 0) * 0.5 + 0.5;
    const pa = pointer ? pointer.active || 0 : 0;
    const aspect = w / h;
    const amp = hero ? 1 : 0.92;
    for (let k = 0; k <= steps; k++) xs[k] = -0.04 + (k / steps) * 1.08;

    for (let k = 0; k <= steps; k++) {
      const x = xs[k];
      const X = x * aspect; // keep wavelengths proportional to height
      // centre line, width, twist — all slowly evolving
      const c = 0.5
        + 0.17 * Math.sin(0.95 * X + 0.11 * tt + s[0])
        + 0.07 * Math.sin(2.1 * X - 0.17 * tt + s[1]);
      const W = (0.34 + 0.1 * Math.sin(1.3 * X + 0.07 * tt + s[2])) * amp;
      const th = 1.25 * X + 0.21 * tt + s[3] + 0.7 * Math.sin(0.6 * X - 0.09 * tt + s[4]);
      const ct = Math.cos(th);
      const st = Math.sin(th);
      const ripple = 0.010 * Math.sin(3.4 * X + 0.31 * tt + s[5]);
      // pointer lens: horizontal falloff
      const dxp = (x - px) * aspect;
      const lensX = pa * Math.exp(-dxp * dxp * 3.2);
      for (let i = 0; i < count; i++) {
        const ai = a[i];
        const bi = b[i];
        let y = c + W * (ai * ct - bi * st) + ripple
          + 0.006 * Math.sin(5.1 * X + 0.4 * tt + wob[i]);
        if (lensX > 0.001) {
          const dy = y - py;
          y += 0.11 * lensX * dy * Math.exp(-dy * dy * 14) * 4;
        }
        const j = k * count + i;
        ys[j] = y * h;
        ds[j] = ai * st + bi * ct; // depth −0.6..0.6 (front > 0)
      }
    }

    /* threads — one continuous stroke each; depth shading lives in a per-thread
       gradient built from a precomputed colour LUT (no string work per frame) */
    ctx.globalCompositeOperation = night ? 'lighter' : 'source-over';
    ctx.globalAlpha = 1;
    // exactly one device pixel: GPU hairline path (wider AA strokes over long
    // paths fall back to slow mask rasterisation at dpr 2)
    ctx.lineWidth = 1 / (state.dpr || 1);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const vo = data.vo;
    const NS = C.stops;
    const LV = C.levels;
    const x0 = xs[0] * w;
    const x1 = xs[steps] * w;
    for (let i = 0; i < count; i++) {
      if (i === data.redIndex) continue;
      const g = ctx.createLinearGradient(x0, 0, x1, 0);
      for (let q = 0; q < NS; q++) {
        const k = Math.round((q / (NS - 1)) * steps);
        const d = ds[k * count + i];
        let lv = Math.round((d * 1.1 + 0.55) * (LV - 1));
        lv = lv < 0 ? 0 : lv >= LV ? LV - 1 : lv;
        g.addColorStop(q / (NS - 1), C.lut[q * LV + lv]);
      }
      ctx.strokeStyle = g;
      ctx.beginPath();
      // vertices are slid along each segment by a per-thread fraction: same
      // curve, but hairline joints never line up into vertical columns
      const o = vo[i];
      let j = i;
      ctx.moveTo(x0, ys[j]);
      for (let k = 0; k < steps; k++) {
        const ya = ys[j];
        j += count;
        ctx.lineTo((xs[k] + (xs[k + 1] - xs[k]) * o) * w, ya + (ys[j] - ya) * o);
      }
      ctx.lineTo(x1, ys[j]);
      ctx.stroke();
    }

    /* the red thread: a faint full line + a travelling comet, one soft head */
    const ri = data.redIndex;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = night ? 0.16 : 0.12;
    ctx.strokeStyle = C.redLine;
    ctx.lineWidth = 1 / (state.dpr || 1);
    ctx.beginPath();
    ctx.moveTo(xs[0] * w, ys[ri]);
    for (let k = 1; k <= steps; k++) ctx.lineTo(xs[k] * w, ys[k * count + ri]);
    ctx.stroke();

    const cyc = 26; // seconds per pass
    // phase anchored so the static frame shows the comet two-thirds across
    const ph = (t - STATIC_T) / cyc + 0.573 + (data.redPhase - 0.5) * 0.12;
    const head = (ph - Math.floor(ph)) * 1.5 - 0.2; // −0.2 → 1.3
    const tail = 0.34;
    const kh = Math.round(((head + 0.04) / 1.08) * steps);
    const kt = Math.round(((head - tail + 0.04) / 1.08) * steps);
    const k0 = Math.max(0, kt);
    const k1 = Math.min(steps, kh);
    if (k1 > k0) {
      const gx0 = Math.max(0, (head - tail) * w);
      const gx1 = Math.max(gx0 + 1, head * w);
      const g = ctx.createLinearGradient(gx0, 0, gx1, 0);
      g.addColorStop(0, C.redA0);
      g.addColorStop(1, C.redA1);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = g;
      ctx.lineWidth = hero ? 1.6 : 1.3;
      ctx.beginPath();
      ctx.moveTo(xs[k0] * w, ys[k0 * count + ri]);
      for (let k = k0 + 1; k <= k1; k++) ctx.lineTo(xs[k] * w, ys[k * count + ri]);
      ctx.stroke();
    }
    if (kh >= 0 && kh <= steps) {
      const hx = xs[kh] * w;
      const hy = ys[kh * count + ri];
      const r = hero ? 3 : 2.4;
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.fillStyle = C.redHalo;
      ctx.beginPath();
      ctx.arc(0, 0, r * 6, 0, TAU);
      ctx.fill();
      ctx.fillStyle = C.red;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

  },
};

function makeLayer(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function buildCache(ctx, state) {
  const { w, h, night, palette } = state;
  const dpr = state.dpr || 1;
  const col = colours(palette, night);
  const layer = makeLayer(Math.max(1, Math.round(w * dpr)), Math.max(1, Math.round(h * dpr)));
  const lg = layer.getContext('2d');
  lg.setTransform(dpr, 0, 0, dpr, 0, 0);
  const bg = ctx.createLinearGradient(0, 0, w * 0.4, h);
  bg.addColorStop(0, rgba(col.ground2, 1));
  bg.addColorStop(0.55, rgba(col.ground, 1));
  bg.addColorStop(1, rgba(col.ground, 1));

  const R = Math.max(w, h);
  const glowA = ctx.createRadialGradient(w * 0.72, h * 0.3, 0, w * 0.72, h * 0.3, R * 0.62);
  glowA.addColorStop(0, rgba(col.tint, night ? 0.16 : 0.12));
  glowA.addColorStop(0.5, rgba(col.tint, night ? 0.05 : 0.04));
  glowA.addColorStop(1, rgba(col.tint, 0));
  const glowB = ctx.createRadialGradient(w * 0.18, h * 0.85, 0, w * 0.18, h * 0.85, R * 0.5);
  const other = same(col.tint, col.lagoon) ? mixc(col.lagoon, col.mark, 0.5) : col.lagoon;
  glowB.addColorStop(0, rgba(other, night ? 0.08 : 0.06));
  glowB.addColorStop(1, rgba(other, 0));

  const mid = mixc(col.mark, col.tint, night ? 0.25 : 0.35);

  // colour LUT: NS stops across x (tint → mid → tint, faded edges) × LV depth levels
  const NS = 11;
  const LV = 16;
  // hairlines are 1 device px; lift alpha on dense screens so the weight reads the same
  const base = (night ? 0.30 : 0.26) * (state.dpr > 1.25 ? 1.45 : 1);
  const lut = [];
  for (let q = 0; q < NS; q++) {
    const u = q / (NS - 1);
    const centre = 1 - Math.abs(u - 0.5) * 2; // 0 at edges, 1 mid
    const c = mixc(col.tint, mid, Math.min(1, centre * 1.4));
    const edge = Math.min(1, Math.min(u, 1 - u) / 0.1);
    for (let l = 0; l < LV; l++) {
      const depth = l / (LV - 1);
      lut.push(rgba(c, base * edge * (0.2 + 0.8 * depth)));
    }
  }

  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) * 0.62);
  vignette.addColorStop(0, rgba(col.ground, 0));
  vignette.addColorStop(1, rgba(col.ground, night ? 0.55 : 0.45));
  // bake the ground, light and vignette once; one drawImage per frame
  for (const f of [bg, glowA, glowB, vignette]) {
    lg.fillStyle = f;
    lg.fillRect(0, 0, w, h);
  }

  return {
    layer,
    stops: NS,
    levels: LV,
    lut,
    red: rgba(col.red, 1),
    redLine: rgba(col.red, 1),
    redA0: rgba(col.red, 0),
    redA1: rgba(col.red, 0.95),
    redHalo: (() => {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, (state.hero ? 3 : 2.4) * 6);
      g.addColorStop(0, rgba(col.red, night ? 0.38 : 0.26));
      g.addColorStop(1, rgba(col.red, 0));
      return g;
    })(),
  };
}
