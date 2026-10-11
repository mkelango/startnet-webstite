// terrain — a perspective wireframe landscape made only of horizontal wave
// lines (like a slow sound wave seen in 3D), flowing gently towards the viewer
// under a soft horizon light. Lines are hidden-line correct (a floating horizon
// hides whatever a nearer crest covers), so the surface reads as a solid, calm
// landscape. A single
// red point rides the crest. Pointer shifts the camera slightly; scroll lifts
// the horizon a touch.
//
// Performance: rows are sampled uniformly in screen x (so detail is constant on
// screen), projected into preallocated arrays, and drawn near → far as one
// device-hairline stroke per row (no polygon fills — those leave the GPU fast
// path). Ground and haze are baked into offscreen layers once per size.

const TAU = Math.PI * 2;
const STATIC_T = 7;

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

function colours(p, night) {
  const red = parse(p.red);
  const acc = parse(p.accent || p.lagoon);
  const lagoon = parse(p.lagoon);
  // the masterbrand accent is the red family: keep decorative light in Lagoon
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

function makeLayer(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

// where a row crosses the floating horizon between two samples (0..1)
const crossing = (d0, d1) => {
  const dd = d0 - d1;
  if (Math.abs(dd) < 1e-3) return 0.5;
  const q = d0 / dd;
  return q < 0 ? 0 : q > 1 ? 1 : q;
};

const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/* ---------- variant ---------- */
export default {
  name: 'terrain',
  staticT: STATIC_T,

  init(state) {
    const { w, h, hero, rng } = state;
    const rows = hero ? Math.max(34, Math.min(56, Math.round(h / 11))) : Math.max(18, Math.min(26, Math.round(h / 9)));
    const cols = Math.max(32, Math.min(110, Math.round(w / 14)));
    const s = [];
    for (let i = 0; i < 8; i++) s.push(rng() * TAU);
    // wave directions: a broad swell, a cross swell and a fine ripple
    const k = [
      [0.42 + rng() * 0.1, 0.3 + rng() * 0.1],
      [0.9 + rng() * 0.2, -0.62 - rng() * 0.15],
      [1.9 + rng() * 0.4, 1.3 + rng() * 0.3],
    ];
    return {
      rows,
      cols,
      s,
      k,
      sx: new Float32Array(cols + 1),
      ys: new Float32Array(cols + 1),
      upper: new Float32Array(cols + 1),
      vf: new Uint8Array(cols + 1),
      rx: new Float32Array(cols + 4),
      ry: new Float32Array(cols + 4),
      cacheKey: '',
      C: null,
      redX: 0.16 + rng() * 0.12, // world x offset of the red point (right of centre)
    };
  },

  frame(ctx, state, data, t) {
    const { w, h, hero, night, palette, pointer, dpr } = state;
    const scroll = state.scroll || 0;
    const key = `${w}x${h}|${dpr}|${night ? 1 : 0}|${palette.ground}|${palette.accent}`;
    if (data.cacheKey !== key) {
      data.C = buildCache(state, ctx);
      data.cacheKey = key;
    }
    const C = data.C;
    const { rows, cols, s, k, sx, ys } = data;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(C.layer, 0, 0, w, h);

    // camera
    const pxn = pointer ? pointer.x * (pointer.active ?? 1) : 0;
    const pyn = pointer ? pointer.y * (pointer.active ?? 1) : 0;
    const camX = pxn * 0.55;
    const camY = 1.05 - pyn * 0.12;
    const horizon = h * (C.horizon - (scroll - 0.5) * 0.05);
    const f = h * 0.95; // focal length in px
    const cx = w * 0.5;
    const zNear = 0.9;
    const zFar = 16;
    const span = zFar - zNear;
    const dz = span / rows;
    const travel = t * 0.42 + scroll * 1.5;
    const A = hero ? 0.62 : 0.56; // amplitude (world units)
    const tt = t * 0.12;

    const k0x = k[0][0], k0z = k[0][1], k1x = k[1][0], k1z = k[1][1], k2x = k[2][0], k2z = k[2][1];
    const height = (x, Z) => {
      // a valley the camera glides through, with swells rising to the sides
      const side = x * 0.16;
      return A * (
        0.55 * Math.sin(k0x * x + k0z * Z + s[0] + tt) * (0.75 + 0.25 * Math.cos(0.21 * Z + s[3]))
        + 0.3 * Math.sin(k1x * x + k1z * Z + s[1] - tt * 0.7)
        + 0.12 * Math.sin(k2x * x + k2z * Z + s[2] + tt * 1.3)
      ) + side * side * 0.75 - 0.2;
    };

    for (let i = 0; i <= cols; i++) sx[i] = -2 + (i / cols) * (w + 4);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1 / (dpr || 1); // device hairline: the GPU fast path (wider strokes fall to slow mask rasterisation)

    // Hidden lines via a floating horizon: rows are walked near → far, and a
    // sample is drawn only where it rises above everything nearer to the
    // viewer (upper[] holds the highest screen y drawn so far per column).
    // No polygon fills at all — strokes only, which keeps the GPU on its
    // fast hairline path.
    const upper = data.upper;
    for (let i = 0; i <= cols; i++) upper[i] = h + 50;
    ctx.strokeStyle = C.stroke;
    const first = Math.floor(travel / dz);
    const redZ = 5.2; // relative depth of the red point
    let red = null;
    for (let r = 0; r <= rows + 1; r++) {
      const Zw = (first + r) * dz; // world Z of this row
      const z = Zw - travel + zNear; // depth relative to camera
      if (z <= zNear * 0.55) continue;
      if (z > zFar) break;
      // red point: test it against the rows nearer than itself
      if (!red && z > redZ) red = placeRed(data, height, camX, camY, horizon, f, cx, redZ, travel, w);
      const inv = f / z;
      for (let i = 0; i <= cols; i++) {
        const x = camX + ((sx[i] - cx) * z) / f;
        ys[i] = horizon + (camY - height(x, Zw)) * inv;
      }
      const d = (z - zNear) / span; // 0 near … 1 far
      const a = smooth(1, 0.5, d) * smooth(-0.03, 0.08, d);
      if (a > 0.01) {
        ctx.globalAlpha = a * C.lineA;
        ctx.beginPath();
        // visibility with a 1px margin; isolated single visible samples are
        // dropped so grazing rows don't leave fragments on the crests
        const vf = data.vf;
        for (let i = 0; i <= cols; i++) vf[i] = ys[i] < upper[i] - 1 ? 1 : 0;
        for (let i = 0; i <= cols; i++) {
          if (vf[i] === 1 && (i === 0 || vf[i - 1] === 0) && (i === cols || vf[i + 1] === 0)) vf[i] = 0;
        }
        // collect each visible run (with exact entry/exit crossings) and draw it
        const o = (((first + r) * 0.618034) % 1 + 1) % 1;
        const rx = data.rx;
        const ry = data.ry;
        let m = 0;
        for (let i = 0; i <= cols; i++) {
          const y = ys[i];
          if (vf[i] === 1) {
            if (m === 0 && i > 0) {
              const q = crossing(ys[i - 1] - upper[i - 1], y - upper[i]);
              rx[0] = sx[i - 1] + (sx[i] - sx[i - 1]) * q;
              ry[0] = ys[i - 1] + (y - ys[i - 1]) * q;
              m = 1;
            }
            rx[m] = sx[i];
            ry[m] = y;
            m++;
            if (i === cols) {
              run(ctx, rx, ry, m, o);
              m = 0;
            }
          } else if (m > 0) {
            const q = crossing(ys[i - 1] - upper[i - 1], y - upper[i]);
            rx[m] = sx[i - 1] + (sx[i] - sx[i - 1]) * q;
            ry[m] = ys[i - 1] + (y - ys[i - 1]) * q;
            run(ctx, rx, ry, m + 1, o);
            m = 0;
          }
        }
        ctx.stroke();
      }
      for (let i = 0; i <= cols; i++) if (ys[i] < upper[i]) upper[i] = ys[i];
    }
    if (red) drawRed(ctx, C, red, hero, t);

    // horizon haze over everything (light, not mask)
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = night ? 'lighter' : 'source-over';
    ctx.drawImage(C.haze, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  },
};

// polyline through the run's points. Interior vertices are slid along their
// segment by a per-row fraction `o`: the same curve, but hairline joints (which
// the GPU blends twice) never line up into vertical columns across rows.
function run(ctx, rx, ry, m, o) {
  if (m < 2) return;
  ctx.moveTo(rx[0], ry[0]);
  for (let k = 1; k < m - 1; k++) {
    ctx.lineTo(rx[k] + (rx[k + 1] - rx[k]) * o, ry[k] + (ry[k + 1] - ry[k]) * o);
  }
  ctx.lineTo(rx[m - 1], ry[m - 1]);
}

function placeRed(data, height, camX, camY, horizon, f, cx, redZ, travel, w) {
  const x = camX * 0.6 + data.redX * 2.2;
  const Zw = travel + redZ - 0.9;
  const X = cx + ((x - camX) * f) / redZ;
  const Y = horizon + (camY - height(x, Zw)) * (f / redZ);
  // visibility against the nearer rows (upper[] at this moment)
  const cols = data.cols;
  const i = Math.max(0, Math.min(cols, Math.round(((X + 2) / (w + 4)) * cols)));
  const vis = smooth(-1, 6, data.upper[i] - Y);
  return { X, Y, vis };
}

function drawRed(ctx, C, red, hero, t) {
  const { X, Y, vis } = red;
  if (vis < 0.02) return;
  const r = hero ? 3 : 2.4;
  const br = 0.5 + 0.5 * Math.sin(((t - STATIC_T) / 3.4) * TAU);
  const hr = (hero ? 14 : 9) + br * (hero ? 6 : 4);
  ctx.globalAlpha = vis;
  ctx.save();
  ctx.translate(X, Y);
  ctx.scale(hr, hr);
  ctx.fillStyle = C.redHalo;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, TAU);
  ctx.fill();
  ctx.restore(); // never leave float drift in the shared transform
  ctx.fillStyle = C.red;
  ctx.beginPath();
  ctx.arc(X, Y, r, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function buildCache(state, ctx) {
  const { w, h, dpr = 1, night, palette, hero } = state;
  const col = colours(palette, night);
  const W = Math.max(1, Math.round(w * dpr));
  const H = Math.max(1, Math.round(h * dpr));
  const horizon = hero ? 0.4 : 0.36;

  const layer = makeLayer(W, H);
  const g = layer.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  // sky → ground: a lifted tone at the horizon, ground towards the viewer
  const sky = night ? mixc(col.ground, col.ground2, 0.6) : mixc(col.ground, [255, 255, 255], 0.35);
  const hz = night ? mixc(col.ground2, col.tint, 0.1) : mixc(col.ground, col.tint, 0.08);
  const groundGrad = (c) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, rgba(sky, 1));
    gr.addColorStop(Math.max(0.01, horizon - 0.02), rgba(hz, 1));
    gr.addColorStop(Math.min(0.99, horizon + 0.25), rgba(col.ground, 1));
    gr.addColorStop(1, rgba(night ? col.ground : col.ground2, 1));
    return gr;
  };
  const grad = groundGrad(g);
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  // haze: a horizon light band + a soft vignette, painted over the terrain
  const haze = makeLayer(W, H);
  const hg = haze.getContext('2d');
  hg.setTransform(dpr, 0, 0, dpr, 0, 0);
  const hy = h * horizon;
  hg.save();
  hg.translate(w * 0.5, hy);
  hg.scale(w * 0.62, h * 0.2);
  const rad = hg.createRadialGradient(0, 0, 0, 0, 0, 1);
  rad.addColorStop(0, rgba(col.tint, night ? 0.2 : 0.14));
  rad.addColorStop(0.5, rgba(col.tint, night ? 0.06 : 0.05));
  rad.addColorStop(1, rgba(col.tint, 0));
  hg.fillStyle = rad;
  hg.beginPath();
  hg.arc(0, 0, 1, 0, TAU);
  hg.fill();
  hg.restore();
  if (!night) {
    // day: a whisper of vignette so the edges settle into the page
    const vg = hg.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.4, w / 2, h * 0.45, Math.hypot(w, h) * 0.62);
    vg.addColorStop(0, rgba(col.ground, 0));
    vg.addColorStop(1, rgba(col.ground2, 0.5));
    hg.fillStyle = vg;
    hg.fillRect(0, 0, w, h);
  }

  // line colour: a vertical gradient — tint near the horizon, mark colour in front
  const hy2 = h * horizon;
  const stroke = ctx.createLinearGradient(0, hy2 - h * 0.05, 0, h);
  stroke.addColorStop(0, rgba(col.tint, 1));
  stroke.addColorStop(0.35, rgba(mixc(col.tint, col.mark, 0.45), 1));
  stroke.addColorStop(1, rgba(mixc(col.tint, col.mark, night ? 0.8 : 0.7), 1));

  const redHalo = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  redHalo.addColorStop(0, rgba(col.red, night ? 0.5 : 0.34));
  redHalo.addColorStop(0.4, rgba(col.red, night ? 0.16 : 0.1));
  redHalo.addColorStop(1, rgba(col.red, 0));

  return {
    layer,
    haze,
    horizon,
    stroke,
    lineA: (night ? 0.62 : 0.5) * (dpr > 1.25 ? 1.35 : 1),
    red: rgba(col.red, 1),
    redHalo,
  };
}
