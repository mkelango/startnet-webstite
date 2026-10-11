// ripples — thin rings spreading from a single red point across a surface seen
// in gentle perspective. Each ring decelerates and fades like a real ripple; the
// far side of every ring is fainter and thinner than the near side.
//
// Performance: one cached unit-space gradient strokes every ring (the ring is
// drawn under a translate/scale so the gradient follows it); glows are cached
// sprites. Nothing is allocated per frame.

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
    return { r: num(p[0], 255), g: num(p[1], 255), b: num(p[2], 255), a: p[3] != null ? num(p[3], 1) : 1 };
  }
  return fallback || { r: 0, g: 0, b: 0, a: 1 };
}
const css = (c, a = 1) =>
  `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${+(a * (c.a ?? 1)).toFixed(4)})`;
const mix = (a, b, k) => ({ r: a.r + (b.r - a.r) * k, g: a.g + (b.g - a.g) * k, b: a.b + (b.b - a.b) * k, a: 1 });

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
function glowSprite(col, size = 128) {
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

const smooth = (e0, e1, x) => {
  const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return k * k * (3 - 2 * k);
};

export default {
  name: 'ripples',
  staticT: 6.2,

  init(state) {
    const { rng, hero, night, palette: P } = state;
    const ground = parseColor(P.ground, night ? { r: 12, g: 23, b: 25, a: 1 } : { r: 244, g: 243, b: 239, a: 1 });
    const ground2 = parseColor(P.ground2, ground);
    const accent = parseColor(P.accent, { r: 17, g: 119, b: 128, a: 1 });
    const glow = parseColor(P.glow, accent);
    const red = parseColor(P.red, { r: 239, g: 68, b: 68, a: 1 });
    const white = { r: 255, g: 255, b: 255, a: 1 };
    const ink = parseColor(P.ink, { r: 12, g: 23, b: 25, a: 1 });

    // Ring colour: the accent, lifted toward white on ink, deepened toward ink on paper.
    const ringCol = night ? mix(accent, white, 0.12) : mix(accent, ink, 0.2);
    const count = hero ? 7 : 5;
    const rings = [];
    for (let i = 0; i < count; i++) {
      rings.push({ off: i / count + (rng() - 0.5) * (0.35 / count), wob: rng() * TAU });
    }

    return {
      hero, night, ground, ground2, ringCol, red,
      sx: hero ? 0.64 + rng() * 0.08 : 0.5 + (rng() - 0.5) * 0.08,
      sy: hero ? 0.56 + rng() * 0.06 : 0.56 + (rng() - 0.5) * 0.06,
      period: hero ? 10 : 9,
      rings,
      surfaceSprite: glowSprite(night ? mix(glow, accent, 0.5) : mix(accent, ground, 0.55)),
      haloSprite: glowSprite(red, 64),
      grads: null,
      gw: 0, gh: 0,
    };
  },

  frame(ctx, state, data, t) {
    const { w, h, pointer, scroll = 0.5 } = state;
    const px = pointer ? pointer.x * (pointer.active ?? 1) : 0;
    const py = pointer ? pointer.y * (pointer.active ?? 1) : 0;

    // Cached gradients (rebuilt only when the size changes).
    if (!data.grads || data.gw !== w || data.gh !== h) {
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, css(data.ground));
      bg.addColorStop(1, css(mix(data.ground, data.ground2, 0.85)));
      // Unit-space ring gradient: y=-1 is the far side, y=+1 the near side.
      const ring = ctx.createLinearGradient(0, -1, 0, 1);
      const rc = data.ringCol;
      ring.addColorStop(0, css(rc, 0.18));
      ring.addColorStop(0.45, css(rc, 0.55));
      ring.addColorStop(1, css(rc, 1));
      data.grads = { bg, ring };
      data.gw = w; data.gh = h;
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = data.grads.bg;
    ctx.fillRect(0, 0, w, h);

    const cx = data.sx * w + px * w * 0.018;
    const cy = data.sy * h + py * h * 0.025;
    // Perspective: how flat the surface reads. Scroll tilts it a little.
    const k = (data.hero ? 0.34 : 0.4) + (scroll - 0.5) * 0.08 + py * 0.02;
    const span = data.hero ? Math.max(w * 0.62, h * 1.2) : Math.max(w * 0.66, h * 1.1);
    const r0 = data.hero ? 7 : 5;
    const lw = (data.hero ? 1.5 : 1.2) * (data.night ? 1 : 1.1);

    // Soft light on the surface around the source.
    const gR = span * 0.55;
    ctx.globalAlpha = data.night ? 0.32 : 0.45;
    ctx.drawImage(data.surfaceSprite, cx - gR, cy - gR * k * 1.2, gR * 2, gR * 2 * k * 1.2);
    ctx.globalAlpha = 1;

    // Rings.
    let birth = 0;
    const P = data.period;
    ctx.strokeStyle = data.grads.ring;
    const rings = data.rings;
    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
      let ph = t / P + ring.off;
      ph -= Math.floor(ph);
      birth += Math.exp(-ph * 40);
      const e = 1 - Math.pow(1 - ph, 1.7); // decelerating spread
      const R = r0 + e * span;
      const a = smooth(0, 0.06, ph) * Math.pow(1 - ph, 1.6);
      if (a < 0.004) continue;
      const tilt = 0.02 * Math.sin(t * 0.25 + ring.wob);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.scale(R, R * k);
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, TAU);
      // a soft luminous bloom under each ring, then the crisp hairline
      ctx.lineWidth = (lw * (data.hero ? 6 : 4.5)) / R;
      ctx.globalAlpha = a * (data.night ? 0.07 : 0.05);
      ctx.stroke();
      ctx.lineWidth = lw / R;
      ctx.globalAlpha = a * (data.night ? 0.9 : 0.95);
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // The one red point, brightening briefly as each ring is born.
    const glowK = Math.min(1, birth);
    const hR = (data.hero ? 22 : 15) * (1 + 0.35 * glowK);
    ctx.globalAlpha = (data.night ? 0.38 : 0.28) + 0.25 * glowK;
    ctx.drawImage(data.haloSprite, cx - hR, cy - hR * 0.8, hR * 2, hR * 1.6);
    ctx.globalAlpha = 1;
    const dotR = data.hero ? 4 : 3;
    if (!data.night) {
      ctx.fillStyle = data.ringCss || (data.ringCss = css(data.ground, 0.9));
      ctx.beginPath();
      ctx.arc(cx, cy, dotR + 1.5, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = data.redCss || (data.redCss = css(data.red));
    ctx.beginPath();
    ctx.arc(cx, cy, dotR, 0, TAU);
    ctx.fill();
  },
};
