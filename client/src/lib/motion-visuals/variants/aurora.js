// aurora — soft, blurred gradient light drifting over the ground colour, a whisper
// of film grain, and one crisp red point where the light converges.
//
// Performance: the light field is painted into a small offscreen canvas (1/4–1/3
// resolution) from cached radial sprites and upscaled once per frame. Grain is a
// cached device-pixel pattern. No per-frame allocations.

const TAU = Math.PI * 2;

/* ---------- colour helpers (self-contained) ---------- */
function parseColor(c, fallback) {
  if (typeof c !== 'string') return fallback || { r: 0, g: 0, b: 0, a: 1 };
  const s = c.trim();
  let m = s.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map((x) => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a };
  }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    const num = (v, k) => (v.endsWith('%') ? (parseFloat(v) / 100) * k : parseFloat(v));
    return {
      r: num(p[0], 255), g: num(p[1], 255), b: num(p[2], 255),
      a: p[3] != null ? num(p[3], 1) : 1,
    };
  }
  return fallback || { r: 0, g: 0, b: 0, a: 1 };
}
const css = (c, a = 1) =>
  `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${+(a * (c.a ?? 1)).toFixed(4)})`;
const mix = (a, b, k) => ({ r: a.r + (b.r - a.r) * k, g: a.g + (b.g - a.g) * k, b: a.b + (b.b - a.b) * k, a: 1 });
function toHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return { h: 0, s: 0, l };
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
}
function fromHsl(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  s = Math.min(1, Math.max(0, s)); l = Math.min(1, Math.max(0, l));
  const f = (n) => {
    const k = (n + h * 12) % 12;
    return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255, a: 1 };
}
// Shift a hue for an analogous companion, never drifting into the red family
// (the composition keeps exactly one red point).
function companionHue(h, d) {
  let n = ((h + d) % 360 + 360) % 360;
  if (n < 22 || n > 335) n = ((h - d) % 360 + 360) % 360;
  if (n < 22 || n > 335) n = h;
  return n;
}

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// Gaussian-ish radial sprite in one colour.
function lightSprite(col, size = 128) {
  const cv = makeCanvas(size, size);
  const g = cv.getContext('2d');
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  const stops = [[0, 1], [0.15, 0.9], [0.3, 0.667], [0.45, 0.402], [0.6, 0.198], [0.75, 0.08], [0.9, 0.022], [1, 0]];
  for (const [o, a] of stops) grad.addColorStop(o, css(col, a));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return cv;
}

function grainTile(rng, night, size = 144) {
  const cv = makeCanvas(size, size);
  const g = cv.getContext('2d');
  const img = g.createImageData(size, size);
  const d = img.data;
  const v = night ? 255 : 0;
  for (let i = 0; i < d.length; i += 4) {
    const n = rng();
    d[i] = d[i + 1] = d[i + 2] = n > 0.5 ? v : 255 - v;
    d[i + 3] = Math.round(Math.abs(n - 0.5) * 2 * 255 * 0.55);
  }
  g.putImageData(img, 0, 0);
  return cv;
}

/* ---------- variant ---------- */
function build(state) {
  const { rng, hero, night, palette: P } = state;
  const ground = parseColor(P.ground, night ? { r: 12, g: 23, b: 25, a: 1 } : { r: 244, g: 243, b: 239, a: 1 });
  const ground2 = parseColor(P.ground2, ground);
  const accent = parseColor(P.accent, { r: 17, g: 119, b: 128, a: 1 });
  const glow = parseColor(P.glow, mix(accent, night ? { r: 255, g: 255, b: 255 } : ground, 0.5));
  const red = parseColor(P.red, { r: 239, g: 68, b: 68, a: 1 });

  // Light colours: an analogous family around the accent (deep pool, mid tone,
  // companion hues either side, pale core). On a dark ground the light is
  // additive (screen) and deep/saturated; on a light ground it is a pastel wash
  // laid down with multiply so overlaps deepen instead of greying.
  const A = toHsl(accent);
  const sat = Math.max(0.42, Math.min(0.9, A.s + 0.12));
  // warm hues go brown when dark: lift their night lightness a touch
  const warm = A.h > 15 && A.h < 75 ? 0.06 : 0;
  const hA = companionHue(A.h, 28);
  const hB = companionHue(A.h, -24);
  const lights = night
    ? [
        { col: fromHsl(A.h, sat, 0.46 + warm), w: 0.5 - warm, size: 0.5, sx: 1.7, sy: 0.62 },
        { col: fromHsl(hA, sat * 0.95, 0.44 + warm), w: 0.4 - warm, size: 0.4, sx: 1.9, sy: 0.5 },
        { col: fromHsl(A.h, sat, 0.62), w: 0.34, size: 0.24, sx: 1.6, sy: 0.6 },
        { col: fromHsl(hB, sat * 0.9, 0.42 + warm), w: 0.36 - warm, size: 0.36, sx: 1.5, sy: 0.6 },
        { col: mix(glow, { r: 255, g: 255, b: 255 }, 0.15), w: 0.16, size: 0.2, sx: 2.2, sy: 0.45 },
      ]
    : [
        { col: fromHsl(A.h, sat * 0.85, 0.78), w: 0.7, size: 0.5, sx: 1.7, sy: 0.62 },
        { col: fromHsl(hA, sat * 0.8, 0.82), w: 0.6, size: 0.4, sx: 1.9, sy: 0.5 },
        { col: fromHsl(A.h, sat * 0.9, 0.72), w: 0.42, size: 0.24, sx: 1.6, sy: 0.6 },
        { col: fromHsl(hB, sat * 0.75, 0.83), w: 0.55, size: 0.36, sx: 1.5, sy: 0.6 },
        { col: fromHsl(hA, sat * 0.6, 0.9), w: 0.3, size: 0.2, sx: 2.0, sy: 0.5 },
      ];
  const count = hero ? 5 : 3;

  const fx = hero ? 0.6 + rng() * 0.14 : 0.48 + rng() * 0.14;
  const fy = hero ? 0.4 + rng() * 0.12 : 0.42 + rng() * 0.12;

  const orbs = [];
  for (let i = 0; i < count; i++) {
    const L = lights[i];
    orbs.push({
      sprite: lightSprite(L.col),
      weight: L.w,
      size: L.size * (0.9 + rng() * 0.2),
      sx: L.sx, sy: L.sy,
      rot: (rng() - 0.5) * 0.5,
      w3: (0.015 + rng() * 0.02) * TAU,
      ang: (i / count) * TAU + rng() * 0.9,
      dist: 0.22 + rng() * 0.2, // fraction of min(w,h)… scaled below
      w1: (0.035 + rng() * 0.03) * TAU, // radial breathing
      w2: (0.02 + rng() * 0.025) * TAU * (rng() < 0.5 ? -1 : 1), // slow orbit
      p1: rng() * TAU,
      p2: rng() * TAU,
      par: 0.6 + rng() * 0.8, // pointer parallax
    });
  }

  const redCol = red;
  return {
    night, hero, ground, ground2, orbs, fx, fy, redCol, glow, accent,
    haloSprite: lightSprite(redCol, 64),
    coreSprite: lightSprite(night ? mix(glow, { r: 255, g: 255, b: 255 }, 0.35) : fromHsl(toHsl(accent).h, 0.5, 0.86), 64),
    streakSprite: lightSprite(night ? mix(glow, { r: 255, g: 255, b: 255 }, 0.55) : { r: 255, g: 255, b: 255, a: 1 }, 64),
    grain: grainTile(rng, night),
    cache: null,
  };
}

function ensureCache(ctx, state, data) {
  const { w, h } = state;
  const devW = ctx.canvas.width, devH = ctx.canvas.height;
  const c = data.cache;
  if (c && c.w === w && c.h === h && c.devW === devW && c.devH === devH) return c;
  const s = data.hero ? 0.25 : 0.34;
  const pad = 2; // margin so upscaling never samples a hard edge
  const sw = Math.max(8, Math.ceil(w * s) + pad * 2);
  const sh = Math.max(8, Math.ceil(h * s) + pad * 2);
  const small = c && c.small ? c.small : makeCanvas(sw, sh);
  small.width = sw; small.height = sh;
  const sctx = small.getContext('2d');
  const bg = sctx.createLinearGradient(0, 0, sw * 0.4, sh);
  bg.addColorStop(0, css(data.ground));
  bg.addColorStop(1, css(mix(data.ground, data.ground2, 0.9)));
  const grainPat = ctx.createPattern(data.grain, 'repeat');
  data.cache = { w, h, devW, devH, s, pad, sw, sh, small, sctx, bg, grainPat };
  return data.cache;
}

export default {
  name: 'aurora',
  staticT: 9.5,

  init(state) {
    return build(state);
  },

  frame(ctx, state, data, t) {
    const { w, h, pointer, scroll = 0.5 } = state;
    const c = ensureCache(ctx, state, data);
    const { sctx, s, pad, sw, sh } = c;
    const px = pointer ? pointer.x * (pointer.active ?? 1) : 0;
    const py = pointer ? pointer.y * (pointer.active ?? 1) : 0;
    const m = Math.min(w, h);
    const big = Math.max(w, h);
    const sc = (scroll - 0.5);

    // Focal point (where the light converges) — tiny pointer & scroll drift.
    const fX = data.fx * w + px * w * 0.012;
    const fY = data.fy * h + py * h * 0.02 - sc * h * 0.06;

    /* ---- light field, low resolution ---- */
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.globalCompositeOperation = 'source-over';
    sctx.globalAlpha = 1;
    sctx.fillStyle = c.bg;
    sctx.fillRect(0, 0, sw, sh);
    sctx.setTransform(s, 0, 0, s, pad, pad);
    sctx.globalCompositeOperation = data.night ? 'screen' : 'multiply';

    const orbs = data.orbs;
    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i];
      const breathe = 0.55 + 0.45 * Math.sin(t * o.w1 + o.p1);
      const a = o.ang + t * o.w2 + 0.25 * Math.sin(t * o.w1 * 0.7 + o.p2);
      const d = (0.1 + o.dist * breathe) * m * (data.hero ? 1.0 : 0.85) * (1 + sc * 0.25);
      const x = fX + Math.cos(a) * d * 1.35 + px * o.par * w * 0.03;
      const y = fY + Math.sin(a) * d * 0.62 + py * o.par * h * 0.04;
      const r = o.size * big * (0.92 + 0.08 * breathe);
      sctx.globalAlpha = o.weight * (0.85 + 0.15 * breathe);
      const rot = o.rot + 0.22 * Math.sin(t * o.w3 + o.p2);
      const cs = Math.cos(rot), sn = Math.sin(rot);
      // translate → rotate → anisotropic scale: soft elongated aurora light
      sctx.setTransform(s * cs * o.sx, s * sn * o.sx, -s * sn * o.sy, s * cs * o.sy, pad + x * s, pad + y * s);
      sctx.drawImage(o.sprite, -r, -r, r * 2, r * 2);
    }
    sctx.setTransform(s, 0, 0, s, pad, pad);
    // A soft core of light gathering at the focal point.
    const coreR = m * (data.hero ? 0.32 : 0.36);
    sctx.globalAlpha = data.night ? 0.32 : 0.24;
    sctx.drawImage(data.coreSprite, fX - coreR, fY - coreR, coreR * 2, coreR * 2);
    sctx.globalCompositeOperation = 'source-over';
    sctx.globalAlpha = 1;

    /* ---- composite to the visible canvas ---- */
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(c.small, pad, pad, sw - pad * 2, sh - pad * 2, 0, 0, w, h);

    // Film grain at device-pixel resolution.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = data.night ? 0.05 : 0.045;
    ctx.fillStyle = c.grainPat;
    ctx.fillRect(0, 0, c.devW, c.devH);
    ctx.restore();

    /* ---- anamorphic light streak through the focal point ---- */
    ctx.globalCompositeOperation = data.night ? 'screen' : 'source-over';
    const sw2 = w * (data.hero ? 0.34 : 0.42);
    ctx.globalAlpha = data.night ? 0.5 : 0.55;
    ctx.drawImage(data.streakSprite, fX - sw2, fY - 1.5, sw2 * 2, 3);
    ctx.globalAlpha = data.night ? 0.22 : 0.25;
    ctx.drawImage(data.streakSprite, fX - sw2 * 0.6, fY - 9, sw2 * 1.2, 18);
    ctx.globalCompositeOperation = 'source-over';

    /* ---- the one red point ---- */
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.9);
    const haloR = (data.hero ? 26 : 16) * (0.9 + 0.2 * pulse);
    ctx.globalAlpha = data.night ? 0.42 : 0.3;
    ctx.drawImage(data.haloSprite, fX - haloR, fY - haloR, haloR * 2, haloR * 2);
    ctx.globalAlpha = 1;
    const dotR = data.hero ? 4 : 3;
    if (!data.night) {
      // hairline paper ring keeps the dot crisp on a busy wash
      ctx.fillStyle = data.ringCss || (data.ringCss = css(data.ground, 0.9));
      ctx.beginPath();
      ctx.arc(fX, fY, dotR + 1.5, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = data.redCss || (data.redCss = css(data.redCol));
    ctx.beginPath();
    ctx.arc(fX, fY, dotR, 0, TAU);
    ctx.fill();
  },
};
