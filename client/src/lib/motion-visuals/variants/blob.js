// blob — a single smooth, slowly breathing liquid form. Inside it, soft pools of
// colour flow like a living gradient mesh: the ground colour melts in at one
// edge, the accent fills the body and a red glow sits at the opposite edge. A
// soft specular sheen gives it volume; a diffuse glow/shadow lifts it off the ground.
//
// Performance: the outline is a smooth quadratic spline through a fixed number of
// samples held in a preallocated Float32Array; colour pools are cached sprites;
// gradients are cached in blob-local space and rebuilt only when the slot resizes.

const TAU = Math.PI * 2;
const N = 48; // outline samples

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

export default {
  name: 'blob',
  staticT: 4.0,

  init(state) {
    const { rng, hero, night, palette: P } = state;
    const ground = parseColor(P.ground, night ? { r: 12, g: 23, b: 25, a: 1 } : { r: 244, g: 243, b: 239, a: 1 });
    const ground2 = parseColor(P.ground2, ground);
    const accent = parseColor(P.accent, { r: 17, g: 119, b: 128, a: 1 });
    const red = parseColor(P.red, { r: 239, g: 68, b: 68, a: 1 });
    const ink = parseColor(P.ink, { r: 12, g: 23, b: 25, a: 1 });
    const white = { r: 255, g: 255, b: 255, a: 1 };

    // Shape harmonics: low orders dominate so the form stays calm and liquid
    // (never a rounded square).
    const amps = hero ? [0.12, 0.085, 0.026, 0.012] : [0.12, 0.08, 0.022];
    const harm = amps.map((a, i) => ({
      k: i + 2,
      amp: a * (0.8 + rng() * 0.4),
      ph: rng() * TAU,
      sp: (0.07 + rng() * 0.09) * (rng() < 0.5 ? -1 : 1) * (i === 0 ? 0.6 : 1),
    }));

    // Internal colour pools (blob-local polar position; radius in R units).
    const deep = night ? mix(accent, ink, 0.55) : mix(accent, ink, 0.3);
    const pale = night ? mix(accent, white, 0.25) : mix(accent, white, 0.55);
    const pools = [
      { sprite: glowSprite(pale), a: night ? 0.62 : 0.8, ang: -2.3, d: 0.42, r: 1.0, sp: 0.21, ph: rng() * TAU },
      { sprite: glowSprite(deep), a: night ? 0.85 : 0.55, ang: 0.9, d: 0.35, r: 0.9, sp: 0.17, ph: rng() * TAU },
      { sprite: glowSprite(accent), a: 0.8, ang: -0.4, d: 0.2, r: 0.85, sp: 0.13, ph: rng() * TAU },
    ];

    return {
      hero, night, ground, ground2, accent, red, ink, white,
      base: night ? mix(accent, ink, 0.48) : accent,
      cxF: hero ? 0.66 + rng() * 0.06 : 0.56 + (rng() - 0.5) * 0.06,
      cyF: hero ? 0.5 + (rng() - 0.5) * 0.06 : 0.52,
      rot0: 0.45 + rng() * 0.4, // the red edge sits bottom-right-ish
      harm, pools,
      redSprite: glowSprite(red),
      specSprite: glowSprite(white),
      pts: new Float32Array(N * 2),
      cosT: Float32Array.from({ length: N }, (_, i) => Math.cos((i / N) * TAU)),
      sinT: Float32Array.from({ length: N }, (_, i) => Math.sin((i / N) * TAU)),
      glow: glowSprite(night ? accent : mix(accent, ground, 0.35)),
      shade: glowSprite(night ? { r: 0, g: 0, b: 0, a: 1 } : ink),
      grain: grainTile(rng, night),
      cache: null,
    };
  },

  frame(ctx, state, data, t) {
    const { w, h, pointer, scroll = 0.5 } = state;
    const px = pointer ? pointer.x * (pointer.active ?? 1) : 0;
    const py = pointer ? pointer.y * (pointer.active ?? 1) : 0;
    const devW = ctx.canvas.width, devH = ctx.canvas.height;
    const night = data.night;

    const R = data.hero ? Math.min(h * 0.34, w * 0.2) : Math.min(h * 0.34, w * 0.26);

    // ---- cached, size-dependent styles ----
    let c = data.cache;
    if (!c || c.w !== w || c.h !== h || c.devW !== devW || c.devH !== devH) {
      const bg = ctx.createLinearGradient(0, 0, w * 0.3, h);
      bg.addColorStop(0, css(data.ground));
      bg.addColorStop(1, css(mix(data.ground, data.ground2, 0.9)));
      // fresnel-ish edge: the body deepens toward its rim
      const edge = ctx.createRadialGradient(0, 0, R * 0.55, 0, 0, R * 1.2);
      edge.addColorStop(0, css(data.ink, 0));
      edge.addColorStop(1, css(data.ink, night ? 0.32 : 0.12));
      // rim light only along the lit (upper-left) edge
      const rim = ctx.createLinearGradient(-R, -R, R * 0.2, R * 0.2);
      rim.addColorStop(0, css(data.white, night ? 0.32 : 0.7));
      rim.addColorStop(1, css(data.white, 0));
      // the ground colour melting in at the -x edge
      const melt = ctx.createLinearGradient(-R * 1.2, 0, -R * 0.05, 0);
      melt.addColorStop(0, css(data.ground, night ? 0.92 : 0.85));
      melt.addColorStop(0.45, css(data.ground, night ? 0.45 : 0.35));
      melt.addColorStop(1, css(data.ground, 0));
      const grainPat = ctx.createPattern(data.grain, 'repeat');
      c = data.cache = { w, h, devW, devH, bg, edge, rim, melt, grainPat };
    }

    // ---- ground ----
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);

    const breathe = Math.sin(t * 0.55);
    const cx = data.cxF * w + px * w * 0.012;
    const cy = data.cyF * h + py * h * 0.02 + Math.sin(t * 0.33) * h * 0.012 - (scroll - 0.5) * h * 0.05;
    const rot = data.rot0 + 0.16 * Math.sin(t * 0.11) + (scroll - 0.5) * 0.25 + px * 0.06;
    const scale = 1 + 0.03 * breathe;

    // ---- glow (night) / soft lift + contact shadow (day) ----
    {
      const gr = R * (night ? 2.5 : 2.1);
      ctx.globalAlpha = night ? 0.3 + 0.05 * breathe : 0.3;
      ctx.drawImage(data.glow, cx - gr, cy - gr * 0.85, gr * 2, gr * 1.7);
      if (!night) {
        const sr = R * 1.15;
        ctx.globalAlpha = 0.1;
        ctx.drawImage(data.shade, cx - sr, cy + R * 0.86 - sr * 0.18, sr * 2, sr * 0.36);
      }
      ctx.globalAlpha = 1;
    }

    // ---- outline (blob-local, rotated space) ----
    const pts = data.pts, cosT = data.cosT, sinT = data.sinT, harm = data.harm;
    for (let i = 0; i < N; i++) {
      const th = (i / N) * TAU;
      let r = 1;
      for (let j = 0; j < harm.length; j++) {
        const H = harm[j];
        r += H.amp * Math.sin(H.k * th + H.ph + t * H.sp);
      }
      r *= R * scale;
      pts[i * 2] = cosT[i] * r * 1.12; // a touch wider than tall
      pts[i * 2 + 1] = sinT[i] * r * 0.92;
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    let mx = (pts[(N - 1) * 2] + pts[0]) / 2, my = (pts[(N - 1) * 2 + 1] + pts[1]) / 2;
    ctx.moveTo(mx, my);
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      const x1 = pts[i * 2], y1 = pts[i * 2 + 1];
      mx = (x1 + pts[j * 2]) / 2; my = (y1 + pts[j * 2 + 1]) / 2;
      ctx.quadraticCurveTo(x1, y1, mx, my);
    }
    ctx.closePath();

    // body + flowing internal pools, clipped to the outline
    ctx.save();
    ctx.fillStyle = data.baseCss || (data.baseCss = css(data.base));
    ctx.fill();
    ctx.clip();
    const pools = data.pools;
    for (let i = 0; i < pools.length; i++) {
      const p = pools[i];
      const a = p.ang + 0.35 * Math.sin(t * p.sp + p.ph);
      const d = p.d * R * (1 + 0.12 * Math.sin(t * p.sp * 1.3 + p.ph * 2));
      const pr = p.r * R * 1.25;
      ctx.globalAlpha = p.a;
      ctx.drawImage(p.sprite, Math.cos(a) * d - pr, Math.sin(a) * d - pr, pr * 2, pr * 2);
    }
    // the red edge (local +x side, i.e. bottom-right after rotation)
    {
      // centred outside the outline, so only its soft inner falloff enters the
      // body: a red crescent hugging the edge rather than a spot.
      const a = 0.14 * Math.sin(t * 0.19);
      const d = R * 1.42;
      const pr = R * 0.95 * (1 + 0.04 * breathe);
      ctx.globalAlpha = 1;
      ctx.drawImage(data.redSprite, Math.cos(a) * d - pr, Math.sin(a) * d - pr * 1.1, pr * 2, pr * 2.2);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.melt;
    ctx.fillRect(-R * 1.6, -R * 1.6, R * 1.6, R * 3.2);
    ctx.fillStyle = c.edge;
    ctx.fillRect(-R * 1.6, -R * 1.6, R * 3.2, R * 3.2);
    // specular sheen: light from the upper left in screen space; the pointer nudges it
    ctx.rotate(-rot);
    const sxp = -R * 0.36 - px * R * 0.1, syp = -R * 0.4 - py * R * 0.1;
    ctx.globalAlpha = night ? 0.22 : 0.4;
    ctx.drawImage(data.specSprite, sxp - R * 0.75, syp - R * 0.5, R * 1.5, R * 1.0);
    ctx.globalAlpha = night ? 0.2 : 0.32;
    ctx.drawImage(data.specSprite, sxp - R * 0.34, syp - R * 0.14, R * 0.68, R * 0.28);
    ctx.globalAlpha = 1;
    ctx.restore();

    // rim light (lit edge only)
    ctx.rotate(-rot);
    ctx.lineWidth = data.hero ? 1.25 : 1;
    ctx.strokeStyle = c.rim;
    ctx.stroke();
    ctx.restore();

    // ---- film grain (device pixels) ----
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = night ? 0.045 : 0.04;
    ctx.fillStyle = c.grainPat;
    ctx.fillRect(0, 0, devW, devH);
    ctx.restore();
  },
};
