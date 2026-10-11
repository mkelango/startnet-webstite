// Panels: floating abstract UI glass cards on a gently tilted plane.
// Skeleton bars, a sparkline, a progress ring, a toggle and a sliding list highlight; no text, numbers or icons.
// One red element: the small live dot on the main card. Pointer adds parallax and tilt; scroll lifts the plane.
// Canvas 2D only. All colours come from state.palette.

const TAU = Math.PI * 2;

function rgbOf(c, fb) {
  if (!c || typeof c !== 'string') return fb || [128, 128, 128];
  const s = c.trim();
  if (s[0] === '#') {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split('').map((x) => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    if (Number.isNaN(n)) return fb || [128, 128, 128];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = s.match(/-?[\d.]+/g);
  return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : fb || [128, 128, 128];
}
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutBack = (x) => {
  const c1 = 1.4, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function makeCanvas(w, h) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
}

function rrect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function buildColors(state) {
  const p = state.palette || {};
  const night = !!state.night;
  const ground = rgbOf(p.ground, night ? [12, 23, 25] : [244, 243, 239]);
  const ground2 = rgbOf(p.ground2, night ? [27, 41, 44] : [235, 234, 229]);
  const ink = rgbOf(p.ink, [12, 23, 25]);
  const paper = rgbOf(p.paper, [244, 243, 239]);
  const red = rgbOf(p.red, night ? [248, 113, 113] : [239, 68, 68]);
  const accent = rgbOf(p.accent, night ? [136, 199, 206] : [17, 119, 128]);
  const marigold = rgbOf(p.marigold, [251, 166, 42]);
  const lagoon = rgbOf(p.lagoon, night ? [136, 199, 206] : [17, 119, 128]);
  const glow = rgbOf(p.glow, accent);
  const fg = night ? paper : ink;
  return { night, ground, ground2, ink, paper, red, accent, marigold, lagoon, glow, fg };
}
function paletteKey(state) {
  const p = state.palette || {};
  return [state.night ? 1 : 0, p.ground, p.ground2, p.accent, p.red, p.marigold, p.lagoon, p.glow, p.paper, p.ink].join('|');
}

// Layouts in design units. Hero designed at 1280x560, card at 400x225. (cx, cy) relative to plane centre.
const HERO_CARDS = [
  { kind: 'list', cx: 285, cy: 112, w: 250, h: 158, z: -0.35 },
  { kind: 'main', cx: -40, cy: -18, w: 390, h: 258, z: 0 },
  { kind: 'toggles', cx: 318, cy: -112, w: 220, h: 104, z: 0.35 },
  { kind: 'ring', cx: -322, cy: 118, w: 212, h: 118, z: 0.65 },
];
const CARD_CARDS = [
  { kind: 'main', cx: -38, cy: -8, w: 232, h: 150, z: 0 },
  { kind: 'ringToggle', cx: 98, cy: 48, w: 128, h: 76, z: 0.6 },
];

export default {
  name: 'panels',
  staticT: 4.2,

  init(state) {
    const rng = state.rng || Math.random;
    const mk = (list, big) => list.map((c) => ({
      ...c,
      cx: c.cx + (rng() - 0.5) * (big ? 18 : 8),
      cy: c.cy + (rng() - 0.5) * (big ? 12 : 6),
      phase: rng() * TAU,
      speed: 0.45 + rng() * 0.25,
      shadow: null,
      fillGrad: null,
      borderGrad: null,
    }));
    // Both layouts are built deterministically; the frame picks one by slot width.
    const layoutHero = mk(HERO_CARDS, true);
    const layoutCard = mk(CARD_CARDS, false);
    // Sparkline: sum of a few seeded waves, sampled per frame (scrolling)
    const waves = [];
    for (let i = 0; i < 3; i++) waves.push([0.6 + rng() * 1.6 + i * 1.3, rng() * TAU, (0.5 / (i + 1)) * (0.7 + rng() * 0.6)]);
    const NS = 44;
    // Skeleton widths (fractions)
    const bars = new Float32Array(16);
    for (let i = 0; i < bars.length; i++) bars[i] = 0.35 + rng() * 0.5;
    return {
      layoutHero, layoutCard, waves, NS, bars,
      sx: new Float32Array(NS), sy: new Float32Array(NS),
      ringBase: 0.58 + rng() * 0.12,
      togglePhase: rng() * 3,
      listPhase: rng() * 3,
      blobSeed: [rng() * TAU, rng() * TAU, rng() * TAU],
      key: '', sizeKey: '', C: null, cs: null, bgc: null,
    };
  },

  frame(ctx, state, data, t, dt) {
    const { w, h } = state;
    // Wide hero slots get the four-card composition; narrow ones use the compact two-card one.
    const hero = !!state.hero && w >= 720;
    const dpr = state.dpr || 1;
    const pk = paletteKey(state);
    if (pk !== data.key) {
      data.key = pk;
      data.sizeKey = '';
      const C = (data.C = buildColors(state));
      const N = C.night;
      data.cs = {
        bar: rgba(C.fg, 1),
        barA: N ? 0.13 : 0.09,
        barStrongA: N ? 0.3 : 0.22,
        border: rgba(N ? C.paper : C.ink, 1),
        borderA: N ? 0.13 : 0.07,
        hiA: N ? 0.22 : 0.9,
        hi: rgba(N ? C.paper : [255, 255, 255], 1),
        sheen0: rgba(N ? C.paper : [255, 255, 255], N ? 0.07 : 0.45),
        sheen1: rgba(N ? C.paper : [255, 255, 255], 0),
        bTop: rgba(N ? C.paper : [255, 255, 255], N ? 0.26 : 1),
        bBot: rgba(N ? C.paper : C.ink, N ? 0.05 : 0.07),
        accent: rgba(C.accent, 1),
        accentSoft: rgba(C.accent, N ? 0.34 : 0.2),
        accent0: rgba(C.accent, 0),
        lagoon: rgba(C.lagoon, 1),
        marigold: rgba(C.marigold, 1),
        red: rgba(C.red, 1),
        knob: rgba(N ? C.paper : [255, 255, 255], 1),
        track: rgba(C.fg, N ? 0.16 : 0.12),
        ground: rgba(C.ground, 1),
        glassTop: rgba(N ? C.paper : [255, 255, 255], N ? 0.085 : 0.82),
        glassBot: rgba(N ? C.paper : [255, 255, 255], N ? 0.035 : 0.6),
        shadow: rgba(N ? [0, 0, 0] : C.ink, N ? 0.5 : 0.14),
        listHi: rgba(C.fg, N ? 0.07 : 0.05),
        dots: [rgba(C.lagoon, 1), rgba(C.marigold, 1), rgba(C.accent, 1)],
      };
      for (const c of data.layoutHero.concat(data.layoutCard)) {
        c.shadow = null;
        c.fillGrad = null;
        c.borderGrad = null;
        c.areaGrad = null;
        c.sheen = null;
      }
    }
    const C = data.C;
    const cs = data.cs;

    // Design scale
    const DW = hero ? 1280 : 400, DH = hero ? 560 : 225;
    const s = Math.min(w / DW, h / DH) * (hero ? 1 : 1);

    // ---- background: low-res light field (ground + drifting colour light), upscaled ----
    const bw = Math.max(8, Math.round(w / 10)), bh = Math.max(6, Math.round(h / 10));
    const sk = `${bw}x${bh}`;
    if (sk !== data.sizeKey) {
      data.sizeKey = sk;
      data.bgc = makeCanvas(bw, bh);
    }
    const bgc = data.bgc;
    // The light field drifts slowly, so the low-res layer is only repainted ~10x a second.
    const repaint = data.bgT == null || Math.abs(t - data.bgT) > 0.1 || data.bgKey !== sk + pk;
    if (bgc && repaint) {
      data.bgT = t;
      data.bgKey = sk + pk;
      const g = bgc.getContext('2d');
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = cs.ground;
      g.fillRect(0, 0, bw, bh);
      const b = data.blobSeed;
      const blob = (x, y, r, rgb, a) => {
        const grd = g.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, rgba(rgb, a));
        grd.addColorStop(1, rgba(rgb, 0));
        g.fillStyle = grd;
        g.fillRect(0, 0, bw, bh);
      };
      const N = C.night;
      blob(bw * (0.62 + 0.08 * Math.sin(t * 0.11 + b[0])), bh * (0.35 + 0.1 * Math.cos(t * 0.09 + b[1])), Math.max(bw, bh) * 0.62, C.glow, N ? 0.2 : 0.14);
      blob(bw * (0.22 + 0.07 * Math.cos(t * 0.08 + b[2])), bh * (0.85 + 0.08 * Math.sin(t * 0.1 + b[0])), Math.max(bw, bh) * 0.5, C.lagoon, N ? 0.16 : 0.09);
      if (!N) blob(bw * (0.9 + 0.05 * Math.sin(t * 0.07 + b[1])), bh * 0.95, Math.max(bw, bh) * 0.35, C.marigold, 0.06);
      if (!N) blob(bw * 0.5, bh * 0.1, Math.max(bw, bh) * 0.7, C.ground2, 0.6);
    }
    if (bgc) {
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bgc, 0, 0, w, h);
    } else {
      ctx.fillStyle = cs.ground;
      ctx.fillRect(0, 0, w, h);
    }

    const pointer = state.pointer || { x: 0, y: 0, active: 0 };
    const scroll = state.scroll == null ? 0.5 : state.scroll;

    // ---- plane transform (affine tilt) ----
    const ax = -0.1 + pointer.x * 0.03 + pointer.y * 0.01; // x-axis slope
    const ay = 0.2 + pointer.x * 0.05; // y-axis lean
    const sqy = 0.94 - pointer.y * 0.025;
    const pcx = w * 0.5 + pointer.x * 6 * s;
    const pcy = h * 0.5 + (0.5 - scroll) * 18 * s + pointer.y * 4 * s;
    const ea = Math.cos(ax) * s, eb = Math.sin(ax) * s;
    const ec = Math.sin(ay) * s * sqy, ed = Math.cos(ay) * s * sqy;

    const cards = hero ? data.layoutHero : data.layoutCard;
    for (let ci = 0; ci < cards.length; ci++) {
      const c = cards[ci];
      const fl = Math.sin(t * c.speed + c.phase);
      const px = pointer.x * (c.z + 0.4) * (hero ? 16 : 7);
      const py = pointer.y * (c.z + 0.4) * (hero ? 10 : 5);
      const lift = (hero ? 6 : 3) * fl * (0.6 + c.z * 0.5);
      const zs = 1 + c.z * 0.035;
      ctx.save();
      ctx.translate(pcx, pcy);
      ctx.transform(ea, eb, ec, ed, 0, 0);
      ctx.translate(c.cx + px / s, c.cy + py / s);
      // shadow (under the card, offset further for higher cards)
      if (!c.shadow) c.shadow = buildShadow(c, cs);
      if (c.shadow) {
        const off = 10 + (c.z + 0.4) * 10 - fl * 3;
        const blur = c.shadow.pad;
        ctx.globalAlpha = 1 - fl * 0.08;
        ctx.drawImage(c.shadow.cv, -c.w / 2 - blur, -c.h / 2 - blur + off, c.w + blur * 2, c.h + blur * 2);
      }
      ctx.translate(0, -lift);
      ctx.scale(zs, zs);
      drawCard(ctx, c, data, cs, C, t, hero);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  },
};

function buildShadow(c, cs) {
  const pad = 28;
  const cv = makeCanvas(c.w + pad * 2, c.h + pad * 2);
  if (!cv) return null;
  const g = cv.getContext('2d');
  // Draw far off-canvas so only the shadow lands.
  g.shadowColor = cs.shadow;
  g.shadowBlur = 22;
  g.shadowOffsetX = 10000;
  g.fillStyle = '#000';
  g.beginPath();
  rrect(g, pad - 10000, pad, c.w, c.h, 14);
  g.fill();
  return { cv, pad };
}

function bar(ctx, x, y, w, h) {
  ctx.beginPath();
  rrect(ctx, x, y, w, h, h / 2);
  ctx.fill();
}

function drawCard(ctx, c, data, cs, C, t, hero) {
  const W = c.w, H = c.h, x = -W / 2, y = -H / 2;
  const R = hero ? 14 : 10;
  // glass body
  if (!c.fillGrad) {
    const gr = ctx.createLinearGradient(0, y, 0, y + H);
    gr.addColorStop(0, cs.glassTop);
    gr.addColorStop(1, cs.glassBot);
    c.fillGrad = gr;
  }
  ctx.globalAlpha = 1;
  ctx.beginPath();
  rrect(ctx, x, y, W, H, R);
  ctx.fillStyle = C.night ? cs.ground : cs.ground; // opaque base so overlapping cards read as layers
  ctx.globalAlpha = C.night ? 0.72 : 0.0;
  if (C.night) ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = c.fillGrad;
  ctx.fill();
  // soft sheen from the top-left, like light on glass
  if (!c.sheen) {
    const sh = ctx.createRadialGradient(x + W * 0.15, y, 0, x + W * 0.15, y, Math.max(W, H) * 0.9);
    sh.addColorStop(0, cs.sheen0);
    sh.addColorStop(1, cs.sheen1);
    c.sheen = sh;
  }
  ctx.fillStyle = c.sheen;
  ctx.fill();
  // light-catching edge: bright top-left fading to a quiet bottom-right
  if (!c.borderGrad) {
    const bg = ctx.createLinearGradient(x, y, x + W * 0.6, y + H);
    bg.addColorStop(0, cs.bTop);
    bg.addColorStop(1, cs.bBot);
    c.borderGrad = bg;
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = c.borderGrad;
  ctx.globalAlpha = 1;
  ctx.stroke();

  const pad = hero ? 20 : 13;
  const k = c.kind;
  ctx.fillStyle = cs.bar;
  if (k === 'main') drawMain(ctx, c, data, cs, C, t, hero, x, y, W, H, pad);
  else if (k === 'ring') drawRingCard(ctx, c, data, cs, C, t, hero, x, y, W, H, pad);
  else if (k === 'toggles') drawToggles(ctx, c, data, cs, C, t, hero, x, y, W, H, pad);
  else if (k === 'list') drawList(ctx, c, data, cs, C, t, hero, x, y, W, H, pad);
  else if (k === 'ringToggle') drawRingToggle(ctx, c, data, cs, C, t, hero, x, y, W, H, pad);
  ctx.globalAlpha = 1;
}

function drawMain(ctx, c, data, cs, C, t, hero, x, y, W, H, pad) {
  const bh = hero ? 8 : 6;
  // header: avatar, title bar, sub bar, live dot (the one red element)
  const av = hero ? 13 : 9;
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = cs.lagoon;
  ctx.beginPath();
  ctx.arc(x + pad + av, y + pad + av, av, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = cs.hi;
  ctx.beginPath();
  ctx.arc(x + pad + av - av * 0.3, y + pad + av - av * 0.35, av * 0.45, 0, TAU);
  ctx.fill();
  ctx.fillStyle = cs.bar;
  const tx = x + pad + av * 2 + (hero ? 12 : 8);
  ctx.globalAlpha = cs.barStrongA;
  bar(ctx, tx, y + pad + av - bh - 1, (W * 0.34) * data.bars[0] + W * 0.1, bh);
  ctx.globalAlpha = cs.barA;
  bar(ctx, tx, y + pad + av + 3, (W * 0.22) * data.bars[1] + W * 0.06, bh * 0.8);
  // live dot
  const lx = x + W - pad - 4, ly = y + pad + av;
  const pr = (t % 2.2) / 2.2;
  ctx.globalAlpha = (1 - pr) * (1 - pr) * 0.55;
  ctx.strokeStyle = cs.red;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(lx, ly, (hero ? 4 : 3) + pr * (hero ? 9 : 6), 0, TAU);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = cs.red;
  ctx.beginPath();
  ctx.arc(lx, ly, hero ? 4 : 3, 0, TAU);
  ctx.fill();

  // sparkline area
  const top = y + pad + av * 2 + (hero ? 22 : 12);
  const footH = hero ? 34 : 18;
  const bottom = y + H - pad - footH;
  const left = x + pad, right = x + W - pad;
  const NS = data.NS, SX = data.sx, SY = data.sy, waves = data.waves;
  const amp = (bottom - top) * 0.42, mid = (top + bottom) * 0.56;
  const sp = t * 0.35;
  for (let i = 0; i < NS; i++) {
    const u = i / (NS - 1);
    let v = 0;
    for (let j = 0; j < waves.length; j++) v += Math.sin((u * waves[j][0] + sp * (0.6 + j * 0.25)) * Math.PI + waves[j][1]) * waves[j][2];
    v += (u - 0.5) * 0.7; // gentle upward drift
    SX[i] = left + (right - left) * u;
    SY[i] = mid - v * amp;
  }
  // faint baseline guides (two hairlines)
  ctx.globalAlpha = C.night ? 0.07 : 0.07;
  ctx.fillStyle = cs.bar;
  ctx.fillRect(left, Math.round(bottom) + 0.5, right - left, 1);
  ctx.fillRect(left, Math.round((top + bottom) / 2) + 0.5, right - left, 1);
  // area
  if (!c.areaGrad) {
    const ag = ctx.createLinearGradient(0, top, 0, bottom);
    ag.addColorStop(0, cs.accentSoft);
    ag.addColorStop(1, cs.accent0);
    c.areaGrad = ag;
  }
  ctx.beginPath();
  ctx.moveTo(SX[0], bottom);
  for (let i = 0; i < NS; i++) ctx.lineTo(SX[i], SY[i]);
  ctx.lineTo(SX[NS - 1], bottom);
  ctx.closePath();
  ctx.globalAlpha = 1;
  ctx.fillStyle = c.areaGrad;
  ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < NS; i++) (i ? ctx.lineTo(SX[i], SY[i]) : ctx.moveTo(SX[i], SY[i]));
  ctx.strokeStyle = cs.accent;
  ctx.lineWidth = hero ? 2 : 1.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // end marker
  ctx.fillStyle = cs.knob;
  ctx.beginPath();
  ctx.arc(SX[NS - 1], SY[NS - 1], hero ? 4 : 3, 0, TAU);
  ctx.fill();
  ctx.lineWidth = hero ? 2 : 1.5;
  ctx.stroke();
  // footer skeleton row
  ctx.fillStyle = cs.bar;
  const fy = y + H - pad - bh;
  const cw = (right - left - (hero ? 24 : 12)) / 3;
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = i === 0 ? cs.barStrongA * 0.8 : cs.barA;
    bar(ctx, left + i * (cw + (hero ? 12 : 6)), fy, cw * (0.55 + data.bars[2 + i] * 0.4), bh);
  }
  if (hero) {
    ctx.globalAlpha = cs.barA * 0.8;
    for (let i = 0; i < 3; i++) bar(ctx, left + i * (cw + 12), fy - 14, cw * 0.32, 6);
  }
}

function ring(ctx, cx, cy, r, lw, val, cs, C) {
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.strokeStyle = cs.track;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = cs.accent;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * val);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function ringValue(data, t) {
  // eases between a few seeded levels
  const period = 3.6;
  const i = Math.floor(t / period);
  const f = easeInOut(clamp01(((t % period) / period - 0.55) / 0.4));
  const lv = (n) => data.ringBase + 0.22 * Math.sin(n * 2.399);
  return lv(i) + (lv(i + 1) - lv(i)) * f;
}

function drawRingCard(ctx, c, data, cs, C, t, hero, x, y, W, H, pad) {
  const r = (H - pad * 2) / 2 - 4;
  const cx = x + pad + r + 4, cy = y + H / 2;
  ring(ctx, cx, cy, r, hero ? 7 : 5, ringValue(data, t), cs, C);
  ctx.fillStyle = cs.bar;
  const bx = cx + r + (hero ? 24 : 14);
  const bw = x + W - pad - bx;
  ctx.globalAlpha = cs.barStrongA;
  bar(ctx, bx, cy - 18, bw * (0.55 + data.bars[6] * 0.4), 8);
  ctx.globalAlpha = cs.barA;
  bar(ctx, bx, cy - 2, bw * (0.4 + data.bars[7] * 0.4), 7);
  bar(ctx, bx, cy + 12, bw * (0.3 + data.bars[8] * 0.3), 7);
}

function toggle(ctx, x, y, w, h, on, cs, C) {
  // on: 0..1 eased
  ctx.beginPath();
  rrect(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = cs.track;
  ctx.globalAlpha = 1;
  ctx.fill();
  if (on > 0.001) {
    ctx.fillStyle = cs.accent;
    ctx.globalAlpha = on;
    ctx.fill();
  }
  const kr = h / 2 - 2;
  const kx = x + h / 2 + (w - h) * on;
  ctx.globalAlpha = 1;
  ctx.fillStyle = cs.knob;
  ctx.beginPath();
  ctx.arc(kx, y + h / 2, kr, 0, TAU);
  ctx.fill();
}

function toggleState(data, t, offset) {
  const period = 3.4;
  const tt = t + data.togglePhase + offset;
  const i = Math.floor(tt / period);
  const f = (tt % period) / period;
  const from = i % 2, to = (i + 1) % 2;
  const k = easeInOut(clamp01((f - 0.8) / 0.2));
  return from + (to - from) * k;
}

function drawToggles(ctx, c, data, cs, C, t, hero, x, y, W, H, pad) {
  const rowH = (H - pad * 2) / 2;
  for (let r = 0; r < 2; r++) {
    const cy = y + pad + rowH * r + rowH / 2;
    ctx.fillStyle = cs.bar;
    ctx.globalAlpha = r === 0 ? cs.barStrongA : cs.barA;
    bar(ctx, x + pad, cy - 4, (W - pad * 2 - 60) * (0.5 + data.bars[9 + r] * 0.45), 8);
    toggle(ctx, x + W - pad - 38, cy - 11, 38, 22, r === 0 ? toggleState(data, t, 0) : 1 - toggleState(data, t, 1.7), cs, C);
  }
  ctx.globalAlpha = C.night ? 0.08 : 0.07;
  ctx.fillStyle = cs.bar;
  ctx.fillRect(x + pad, y + pad + rowH, W - pad * 2, 1);
}

function drawList(ctx, c, data, cs, C, t, hero, x, y, W, H, pad) {
  const n = 3;
  const rowH = (H - pad * 2) / n;
  // sliding highlight
  const period = 2.8;
  const tt = t + data.listPhase;
  const i = Math.floor(tt / period);
  const f = easeInOut(clamp01(((tt % period) / period - 0.7) / 0.3));
  const from = i % n, to = (i + 1) % n;
  const hy = y + pad + rowH * (from + (to - from) * f);
  ctx.fillStyle = cs.listHi;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  rrect(ctx, x + pad * 0.5, hy + 2, W - pad, rowH - 4, 9);
  ctx.fill();
  for (let r = 0; r < n; r++) {
    const cy = y + pad + rowH * r + rowH / 2;
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = cs.dots[r % 3];
    ctx.beginPath();
    ctx.arc(x + pad + 10, cy, 9, 0, TAU);
    ctx.fill();
    ctx.fillStyle = cs.bar;
    ctx.globalAlpha = cs.barStrongA * 0.9;
    bar(ctx, x + pad + 30, cy - 8, (W - pad * 2 - 80) * (0.45 + data.bars[11 + r] * 0.5), 7);
    ctx.globalAlpha = cs.barA;
    bar(ctx, x + pad + 30, cy + 3, (W - pad * 2 - 80) * (0.3 + data.bars[12 + r] * 0.35), 6);
    ctx.globalAlpha = cs.barA;
    bar(ctx, x + W - pad - 30, cy - 3, 26, 6);
  }
}

function drawRingToggle(ctx, c, data, cs, C, t, hero, x, y, W, H, pad) {
  const r = (H - pad * 2) / 2 - 3;
  const cx = x + pad + r + 2, cy = y + H / 2;
  ring(ctx, cx, cy, r, 4.5, ringValue(data, t), cs, C);
  const bx = cx + r + 12;
  ctx.fillStyle = cs.bar;
  ctx.globalAlpha = cs.barStrongA;
  bar(ctx, bx, cy - 14, (x + W - pad - bx) * 0.8, 6);
  toggle(ctx, bx, cy + 1, 28, 16, toggleState(data, t, 0), cs, C);
}
