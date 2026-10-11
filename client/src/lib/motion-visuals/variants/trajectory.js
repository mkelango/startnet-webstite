// Trajectory: a smooth growth curve that draws itself left to right over a soft gradient area,
// led by a single glowing red head. Faint horizontal guides only; no labels or numbers.
// The cycle is draw -> hold -> retract -> redraw, so it loops without a jump.
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
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const smooth = (a, b, x) => {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};

function makeCanvas(w, h) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
}

function glowSprite(rgb, size = 128) {
  const c = makeCanvas(size, size);
  if (!c) return null;
  const g = c.getContext('2d');
  const r = size / 2;
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0, rgba(rgb, 1));
  grd.addColorStop(0.2, rgba(rgb, 0.5));
  grd.addColorStop(0.5, rgba(rgb, 0.14));
  grd.addColorStop(1, rgba(rgb, 0));
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
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

// Uniform Catmull-Rom through control points, sampled at M uniform x positions.
function sampleCurve(ctrl, M) {
  const n = ctrl.length;
  const out = new Float32Array(M);
  for (let i = 0; i < M; i++) {
    const x = (i / (M - 1)) * (n - 1);
    const k = Math.min(n - 2, Math.floor(x));
    const u = x - k;
    const p0 = ctrl[Math.max(0, k - 1)], p1 = ctrl[k], p2 = ctrl[k + 1], p3 = ctrl[Math.min(n - 1, k + 2)];
    const u2 = u * u, u3 = u2 * u;
    out[i] = 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
  }
  return out;
}

// Cycle timing (seconds)
const DRAW = 5.6, HOLD = 2.6, RETRACT = 1.6, GAP = 0.5;
const CYCLE = DRAW + HOLD + RETRACT + GAP;

export default {
  name: 'trajectory',
  staticT: 6.9,

  init(state) {
    const rng = state.rng || Math.random;
    const hero = !!state.hero;
    const n = hero ? 11 : 7;
    const ctrl = [];
    const bend = 1.35 + rng() * 0.5;
    for (let i = 0; i < n; i++) {
      const x = i / (n - 1);
      const base = 0.06 + 0.8 * Math.pow(x, bend);
      const wob = (rng() - 0.5) * (hero ? 0.13 : 0.1) * (0.4 + 0.6 * Math.sin(x * Math.PI));
      ctrl.push(base + wob);
    }
    ctrl[0] = 0.06 + rng() * 0.05;
    ctrl[n - 1] = 0.86 + rng() * 0.05;
    const M = hero ? 220 : 110;
    const ys = sampleCurve(ctrl, M);
    // Ghost (earlier run) for depth, hero only.
    let ghost = null;
    if (hero) {
      const g = [];
      for (let i = 0; i < n; i++) {
        const x = i / (n - 1);
        g.push(0.04 + 0.55 * Math.pow(x, bend + 0.4) + (rng() - 0.5) * 0.06 * Math.sin(x * Math.PI));
      }
      ghost = sampleCurve(g, M);
    }
    const nSparks = hero ? 16 : 0;
    const sparks = new Float32Array(nSparks * 3);
    for (let i = 0; i < nSparks; i++) {
      sparks[i * 3] = rng(); // phase
      sparks[i * 3 + 1] = (rng() - 0.3) * 1; // drift x
      sparks[i * 3 + 2] = 0.6 + rng() * 0.8; // size
    }
    // 2-3 milestone nodes on the curve (indices into the sampled curve)
    const nodes = [];
    const nN = hero ? 3 : 2;
    for (let i = 0; i < nN; i++) nodes.push(Math.round(((i + 0.55 + (rng() - 0.5) * 0.4) / (nN + 0.3)) * (M - 1)));
    return {
      M, ys, ghost, sparks, nodes,
      px: new Float32Array(M), py: new Float32Array(M),
      key: '', sizeKey: '', C: null, bg: null, sp: null,
    };
  },

  frame(ctx, state, data, t, dt) {
    const { w, h } = state;
    const hero = !!state.hero;
    const dpr = state.dpr || 1;
    const pk = paletteKey(state);
    if (pk !== data.key) {
      data.key = pk;
      data.sizeKey = '';
      const C = (data.C = buildColors(state));
      const lineRgb = C.accent;
      data.sp = {
        glowRed: glowSprite(C.red, 128),
        glowLine: glowSprite(lineRgb, 64),
        redCss: rgba(C.red, 1),
        redSoft: rgba(C.red, C.night ? 0.5 : 0.4),
        lineCss: rgba(lineRgb, 1),
        fgCss: rgba(C.fg, 1),
        coreCss: rgba(C.night ? mix(C.red, [255, 255, 255], 0.55) : mix(C.red, [255, 255, 255], 0.75), 1),
        lineRgb,
        // line runs from the house lagoon into the page accent, brightening toward the head
        lineA: rgba(mix(C.lagoon, lineRgb, 0.2), 0.3),
        lineB: rgba(mix(C.lagoon, lineRgb, 0.6), 0.85),
        lineC: rgba(lineRgb, 1),
        nodeFill: rgba(C.ground, 1),
        beam: null,
      };
      const beam = ctx.createLinearGradient(-1, 0, 1, 0);
      beam.addColorStop(0, rgba(C.glow, 0));
      beam.addColorStop(0.5, rgba(C.glow, C.night ? 0.12 : 0.07));
      beam.addColorStop(1, rgba(C.glow, 0));
      data.sp.beam = beam;
      // Unit-space gradients reused with transforms.
      const drop = ctx.createLinearGradient(0, 0, 0, 1);
      drop.addColorStop(0, rgba(C.red, C.night ? 0.45 : 0.35));
      drop.addColorStop(1, rgba(C.red, 0));
      data.sp.drop = drop;
    }
    const C = data.C;
    const sp = data.sp;

    // Plot geometry
    const padX = hero ? w * 0.07 : w * 0.08;
    const x0 = -2, x1 = w - padX * (hero ? 1.25 : 1.15);
    const top = h * (hero ? 0.17 : 0.18), bottom = h * (hero ? 0.86 : 0.84);

    const sk = `${w}x${h}@${dpr}`;
    if (sk !== data.sizeKey) {
      data.sizeKey = sk;
      const bg = makeCanvas(w * dpr, h * dpr);
      if (bg) {
        const g = bg.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const lin = g.createLinearGradient(0, 0, 0, h);
        lin.addColorStop(0, rgba(C.ground, 1));
        lin.addColorStop(1, rgba(mix(C.ground, C.ground2, 0.75), 1));
        g.fillStyle = lin;
        g.fillRect(0, 0, w, h);
        // light source near the curve's destination (upper right) and a cooler wash lower left
        const lx = x1, ly = top + (bottom - top) * 0.1;
        const R1 = Math.max(w, h) * 0.6;
        const r1 = g.createRadialGradient(lx, ly, 0, lx, ly, R1);
        r1.addColorStop(0, rgba(C.glow, C.night ? 0.2 : 0.1));
        r1.addColorStop(0.45, rgba(C.glow, C.night ? 0.06 : 0.03));
        r1.addColorStop(1, rgba(C.glow, 0));
        g.fillStyle = r1;
        g.fillRect(0, 0, w, h);
        const r2 = g.createRadialGradient(w * 0.1, h * 1.05, 0, w * 0.1, h * 1.05, Math.max(w, h) * 0.5);
        r2.addColorStop(0, rgba(C.lagoon, C.night ? 0.1 : 0.05));
        r2.addColorStop(1, rgba(C.lagoon, 0));
        g.fillStyle = r2;
        g.fillRect(0, 0, w, h);
        // horizontal guides (fade at both ends)
        const nG = hero ? 5 : 4;
        const gl = g.createLinearGradient(0, 0, w, 0);
        const ga = C.night ? 0.1 : 0.09;
        gl.addColorStop(0, rgba(C.fg, 0));
        gl.addColorStop(0.12, rgba(C.fg, ga));
        gl.addColorStop(0.88, rgba(C.fg, ga));
        gl.addColorStop(1, rgba(C.fg, 0));
        g.fillStyle = gl;
        for (let i = 0; i < nG; i++) {
          const y = Math.round(top + ((bottom - top) * i) / (nG - 1)) + 0.5;
          g.fillRect(0, y - 0.5, w, i === nG - 1 ? 1 : 1);
        }
      }
      data.bg = bg;
      // vertical area gradient
      const ag = ctx.createLinearGradient(0, top, 0, bottom);
      const lr = sp.lineRgb;
      ag.addColorStop(0, rgba(lr, C.night ? 0.26 : 0.16));
      ag.addColorStop(0.55, rgba(lr, C.night ? 0.08 : 0.05));
      ag.addColorStop(1, rgba(lr, 0));
      data.areaGrad = ag;
    }

    // ---- ground ----
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    if (data.bg) ctx.drawImage(data.bg, 0, 0, w, h);
    else {
      ctx.fillStyle = rgba(C.ground, 1);
      ctx.fillRect(0, 0, w, h);
    }

    // ---- timeline ----
    const ct = ((t % CYCLE) + CYCLE) % CYCLE;
    let head = 1, tail = 0, headA = 1, fade = 1;
    if (ct < DRAW) {
      head = easeInOut(ct / DRAW);
      headA = smooth(0, 0.35, ct);
    } else if (ct < DRAW + HOLD) {
      head = 1;
    } else if (ct < DRAW + HOLD + RETRACT) {
      const k = (ct - DRAW - HOLD) / RETRACT;
      fade = 1 - easeInOut(k);
      headA = fade;
    } else {
      head = 0;
      headA = 0;
      tail = 0;
    }
    if (ct >= DRAW + HOLD + RETRACT) return; // gap: ground and guides only

    const pointer = state.pointer || { x: 0, y: 0, active: 0 };
    const scroll = state.scroll == null ? 0.5 : state.scroll;
    const ox = pointer.x * (hero ? 8 : 4);
    const oy = pointer.y * (hero ? 6 : 3) + (0.5 - scroll) * (hero ? 14 : 6);

    // ---- project curve ----
    const M = data.M, ys = data.ys, PX = data.px, PY = data.py;
    const H = bottom - top;
    for (let i = 0; i < M; i++) {
      PX[i] = x0 + ((x1 - x0) * i) / (M - 1) + ox;
      PY[i] = bottom - ys[i] * H + oy;
    }
    const fh = head * (M - 1);
    const ih = Math.floor(fh);
    const fr = fh - ih;
    const hx = ih < M - 1 ? PX[ih] + (PX[ih + 1] - PX[ih]) * fr : PX[M - 1];
    const hy = ih < M - 1 ? PY[ih] + (PY[ih + 1] - PY[ih]) * fr : PY[M - 1];
    const ft = tail * (M - 1);
    const it = Math.floor(ft);
    const tr = ft - it;
    const tx = it < M - 1 ? PX[it] + (PX[it + 1] - PX[it]) * tr : PX[M - 1];
    const ty = it < M - 1 ? PY[it] + (PY[it + 1] - PY[it]) * tr : PY[M - 1];

    // ---- ghost curve (hero) ----
    if (data.ghost) {
      const gys = data.ghost;
      ctx.beginPath();
      for (let i = 0; i < M; i++) {
        const y = bottom - gys[i] * H + oy * 0.6;
        const x = x0 + ((x1 - x0) * i) / (M - 1) + ox * 0.6;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = sp.fgCss;
      ctx.lineWidth = 1;
      ctx.globalAlpha = C.night ? 0.14 : 0.13;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    const visible = fh - ft > 0.5;
    const tracePath = () => {
      ctx.moveTo(tx, ty);
      for (let i = it + 1; i <= ih && i < M; i++) ctx.lineTo(PX[i], PY[i]);
      ctx.lineTo(hx, hy);
    };

    if (visible) {
      // ---- area ----
      ctx.beginPath();
      tracePath();
      ctx.lineTo(hx, bottom + oy);
      ctx.lineTo(tx, bottom + oy);
      ctx.closePath();
      ctx.fillStyle = data.areaGrad;
      ctx.globalAlpha = fade;
      ctx.fill();

      // ---- line glow + line ----
      ctx.beginPath();
      tracePath();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = sp.lineCss;
      ctx.globalAlpha = (C.night ? 0.13 : 0.09) * fade;
      ctx.lineWidth = hero ? 9 : 6;
      ctx.stroke();
      // main line: gradient brightening toward the head
      const lg = ctx.createLinearGradient(tx, 0, hx, 0);
      lg.addColorStop(0, sp.lineA);
      lg.addColorStop(0.55, sp.lineB);
      lg.addColorStop(1, sp.lineC);
      ctx.strokeStyle = lg;
      ctx.globalAlpha = fade;
      ctx.lineWidth = hero ? 2.2 : 1.7;
      ctx.stroke();
    }

    // milestone nodes that light up as the head passes them
    const nodes = data.nodes;
    for (let j = 0; j < nodes.length; j++) {
      const ni = nodes[j];
      if (ni > fh) continue;
      const age = (fh - ni) / (M - 1) * DRAW * 1.4; // approx seconds since passed
      const pop = age > 0.6 ? 1 : 1 + 0.6 * Math.sin(Math.min(1, age / 0.6) * Math.PI) ;
      const a = smooth(0, 0.25, age) * fade;
      if (a <= 0.01) continue;
      const r = (hero ? 3.6 : 2.8) * pop;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(PX[ni], PY[ni], r, 0, TAU);
      ctx.fillStyle = sp.nodeFill;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = sp.lineCss;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    if (headA > 0.01) {
      // soft vertical light column following the head
      ctx.save();
      ctx.globalAlpha = headA;
      ctx.translate(hx, 0);
      ctx.scale(hero ? 70 : 40, 1);
      ctx.fillStyle = sp.beam;
      ctx.fillRect(-1, 0, 2, h);
      ctx.restore();
      // drop line from head to baseline
      ctx.save();
      ctx.globalAlpha = headA;
      ctx.translate(hx, hy);
      ctx.scale(1, Math.max(1, bottom + oy - hy));
      ctx.fillStyle = sp.drop;
      ctx.fillRect(-0.5, 0, 1, 1);
      ctx.restore();
      // faint marker to the right edge of the plot
      ctx.beginPath();
      ctx.moveTo(hx + 10, hy);
      ctx.lineTo(x1 + padX * 0.6 + ox, hy);
      ctx.strokeStyle = sp.redCss;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3 * headA * smooth(0.92, 1, head);
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // sparks drifting off the head while it travels
      const sparks = data.sparks;
      if (sparks.length) {
        ctx.fillStyle = sp.lineCss;
        const life = 1.6;
        for (let i = 0; i < sparks.length; i += 3) {
          const age = (((ct + sparks[i] * life) % life) + life) % life;
          const born = ct - age;
          if (born < 0 || born > DRAW) continue;
          const hb = easeInOut(born / DRAW) * (M - 1);
          const ib = Math.min(M - 1, Math.floor(hb));
          if (ib < ft) continue;
          const k = age / life;
          const sx = PX[ib] - 6 * k + sparks[i + 1] * 22 * k;
          const sy = PY[ib] - 26 * easeOut(k);
          const sz = sparks[i + 2] * (1 - k) * 1.8;
          ctx.globalAlpha = (1 - k) * 0.6 * headA;
          ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
        }
      }

      // pulse ring
      const pr = (t % 2.4) / 2.4;
      ctx.beginPath();
      ctx.arc(hx, hy, (hero ? 6 : 4.5) + pr * (hero ? 22 : 14), 0, TAU);
      ctx.strokeStyle = sp.redCss;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = (1 - pr) * (1 - pr) * 0.5 * headA;
      ctx.stroke();
      // glow + head
      const gr = hero ? 34 : 22;
      if (sp.glowRed) {
        ctx.globalAlpha = (C.night ? 0.55 : 0.32) * headA;
        ctx.drawImage(sp.glowRed, hx - gr, hy - gr, gr * 2, gr * 2);
      }
      ctx.globalAlpha = headA;
      ctx.fillStyle = sp.redCss;
      ctx.beginPath();
      ctx.arc(hx, hy, hero ? 5.2 : 4, 0, TAU);
      ctx.fill();
      ctx.fillStyle = sp.coreCss;
      ctx.beginPath();
      ctx.arc(hx - 0.8, hy - 0.8, hero ? 1.9 : 1.4, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
  },
};
