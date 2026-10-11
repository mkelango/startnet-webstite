// Orbits: a 3D-tilted orbital system around a single red core.
// Elliptical orbit paths with depth shading, planets travelling at Kepler-like speeds with fading trails,
// a slow particle belt (hero only) and a soft light field. Pointer tilts the system; scroll eases the inclination.
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

function makeCanvas(w, h) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
}

// Soft radial glow sprite.
function glowSprite(rgb, size = 128, falloff = 1) {
  const c = makeCanvas(size, size);
  if (!c) return null;
  const g = c.getContext('2d');
  const r = size / 2;
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0, rgba(rgb, 1));
  grd.addColorStop(0.18 * falloff, rgba(rgb, 0.55));
  grd.addColorStop(0.45, rgba(rgb, 0.16));
  grd.addColorStop(1, rgba(rgb, 0));
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
}

// Lit sphere sprite (highlight top-left, rim darker).
function sphereSprite(rgb, size = 96, lightRgb = [255, 255, 255], darkRgb = [0, 0, 0]) {
  const c = makeCanvas(size, size);
  if (!c) return null;
  const g = c.getContext('2d');
  const r = size / 2;
  const grd = g.createRadialGradient(r * 0.7, r * 0.62, r * 0.05, r, r, r);
  grd.addColorStop(0, rgba(mix(rgb, lightRgb, 0.65), 1));
  grd.addColorStop(0.35, rgba(mix(rgb, lightRgb, 0.12), 1));
  grd.addColorStop(0.85, rgba(rgb, 1));
  grd.addColorStop(1, rgba(mix(rgb, darkRgb, 0.35), 1));
  g.fillStyle = grd;
  g.beginPath();
  g.arc(r, r, r - 0.5, 0, TAU);
  g.fill();
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

const SEG = 128;

export default {
  name: 'orbits',
  staticT: 7.4,

  init(state) {
    const rng = state.rng || Math.random;
    const hero = !!state.hero;
    const nRings = hero ? 5 : 3;
    const rings = [];
    for (let i = 0; i < nRings; i++) {
      const k = nRings === 1 ? 1 : i / (nRings - 1);
      const r = 0.3 + k * 0.7 + (rng() - 0.5) * 0.04; // normalised radius
      // Small individual inclination so the rings feel like a real 3D system, not concentric ellipses.
      const incl = (rng() - 0.5) * (hero ? 0.2 : 0.16);
      const node = rng() * TAU;
      const ci = Math.cos(incl), si = Math.sin(incl), cn = Math.cos(node), sn = Math.sin(node);
      // M = Rz(node) * Rx(incl): maps plane point (c, s, 0)
      // Rx(incl): (x, y cos, y sin) ; Rz(node) rotates x,y
      const m = [cn, -sn * ci, sn, cn * ci, 0, si]; // columns for (c, s): x = m0 c + m1 s, y = m2 c + m3 s, z = m4 c + m5 s
      rings.push({ r, m, proj: new Float32Array((SEG + 1) * 3), C: new Float64Array(6) });
    }
    // Planets: one per ring, an extra on the outer ring in hero.
    const planets = [];
    const colorKeys = ['accent', 'lagoon', 'marigold', 'fg', 'accent', 'lagoon'];
    for (let i = 0; i < nRings; i++) {
      const ring = rings[i];
      const omega = 0.42 * Math.pow(0.3 / ring.r, 1.5) * (0.9 + rng() * 0.2);
      planets.push({
        ring: i,
        phase: rng() * TAU,
        omega,
        size: (hero ? 4.2 : 2.8) + rng() * (hero ? 2.6 : 1.2) + (i === nRings - 1 ? 0.8 : 0),
        color: colorKeys[i % colorKeys.length],
        trail: hero ? 1.25 : 1.0,
      });
    }
    if (hero) {
      planets.push({ ring: nRings - 2, phase: planets[nRings - 2].phase + Math.PI * (0.8 + rng() * 0.3), omega: planets[nRings - 2].omega, size: 2.8, color: 'fg', trail: 0.9 });
    }
    // Particle belt between the two outer rings (hero) or sparse halo (card).
    const area = state.w * state.h;
    const beltN = hero ? Math.min(180, Math.round(area / 4000)) : 0;
    const belt = new Float32Array(beltN * 4); // radius, angle, speed, size
    const r0 = hero ? (rings[nRings - 2].r + rings[nRings - 3].r) / 2 : rings[nRings - 1].r * 1.08;
    for (let i = 0; i < beltN; i++) {
      const j = i * 4;
      const g = (rng() + rng() + rng() - 1.5) / 1.5; // ~gaussian
      belt[j] = r0 + g * 0.06;
      belt[j + 1] = rng() * TAU;
      belt[j + 2] = 0.06 * Math.pow(0.5 / belt[j], 1.5) * (0.85 + rng() * 0.3);
      belt[j + 3] = 0.5 + rng() * rng() * 1.3;
    }
    // Far dust (night only, drawn behind everything).
    const dustN = Math.min(hero ? 48 : 12, Math.round(area / 16000));
    const dust = new Float32Array(dustN * 4);
    for (let i = 0; i < dustN; i++) {
      dust[i * 4] = rng();
      dust[i * 4 + 1] = rng();
      dust[i * 4 + 2] = 0.2 + rng() * 0.8; // depth
      dust[i * 4 + 3] = rng() * TAU;
    }
    const pulse = new Float32Array(49 * 2);
    for (let i = 0; i <= 48; i++) {
      pulse[i * 2] = Math.cos((i / 48) * TAU);
      pulse[i * 2 + 1] = Math.sin((i / 48) * TAU);
    }
    const cs = new Float32Array((SEG + 1) * 2);
    for (let i = 0; i <= SEG; i++) {
      cs[i * 2] = Math.cos((i / SEG) * TAU);
      cs[i * 2 + 1] = Math.sin((i / SEG) * TAU);
    }
    return {
      rings, planets, belt, dust, pulse, cs,
      spin0: rng() * TAU,
      key: '', sizeKey: '',
      G: new Float64Array(9),
      pp: new Float32Array(3),
      bb: new Float32Array(beltN * 4),
      tb: new Float32Array(64 * 3),
      tn: new Float32Array(64 * 2),
      colors: null, sprites: null, bg: null,
      paths: null,
    };
  },

  frame(ctx, state, data, t, dt) {
    const { w, h } = state;
    const hero = !!state.hero;
    const dpr = state.dpr || 1;
    // --- caches (palette / size) ---
    const pk = paletteKey(state);
    if (pk !== data.key) {
      data.key = pk;
      data.sizeKey = '';
      const C = (data.colors = buildColors(state));
      const lightRgb = C.night ? [255, 255, 255] : [255, 255, 255];
      data.sprites = {
        glowRed: glowSprite(C.red, 256),
        coreRed: sphereSprite(C.red, 128, [255, 236, 230], [80, 0, 0]),
        glow: {},
        sphere: {},
        css: {},
        trail: {},
      };
      for (const k of ['accent', 'lagoon', 'marigold', 'fg']) {
        let rgb = C[k];
        if (k === 'fg' && !C.night) rgb = mix(C.ink, C.lagoon, 0.25);
        data.sprites.glow[k] = glowSprite(rgb, 96);
        data.sprites.sphere[k] = sphereSprite(rgb, 64, lightRgb, [0, 0, 0]);
        data.sprites.css[k] = rgba(rgb, 1);
        data.sprites.trail[k] = [rgba(rgb, 0.9), rgba(rgb, 0.32), rgba(rgb, 0)];
      }
      // Orbital-plane sheen: a soft disc of light lying in the plane of the orbits.
      const disc = makeCanvas(256, 256);
      if (disc) {
        const g = disc.getContext('2d');
        const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        grd.addColorStop(0, rgba(C.glow, 0.9));
        grd.addColorStop(0.25, rgba(C.glow, 0.45));
        grd.addColorStop(0.6, rgba(C.glow, 0.14));
        grd.addColorStop(0.85, rgba(C.glow, 0.04));
        grd.addColorStop(1, rgba(C.glow, 0));
        g.fillStyle = grd;
        g.fillRect(0, 0, 256, 256);
      }
      data.sprites.disc = disc;
      data.ringCss = rgba(C.fg, 1);
      data.redCss = rgba(C.red, 1);
    }
    const C = data.colors;
    const sk = `${w}x${h}@${dpr}`;
    if (sk !== data.sizeKey) {
      data.sizeKey = sk;
      // Background: ground, vertical wash, central light, soft vignette.
      const bg = makeCanvas(w * dpr, h * dpr);
      if (bg) {
        const g = bg.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const lin = g.createLinearGradient(0, 0, 0, h);
        lin.addColorStop(0, rgba(C.ground, 1));
        lin.addColorStop(1, rgba(mix(C.ground, C.ground2, 0.7), 1));
        g.fillStyle = lin;
        g.fillRect(0, 0, w, h);
        const cx = w * 0.5, cy = h * 0.47;
        const R = Math.max(w, h) * 0.62;
        const rad = g.createRadialGradient(cx, cy, 0, cx, cy, R);
        const ga = C.night ? 0.2 : 0.1;
        rad.addColorStop(0, rgba(C.glow, ga));
        rad.addColorStop(0.35, rgba(C.glow, ga * 0.4));
        rad.addColorStop(1, rgba(C.glow, 0));
        g.fillStyle = rad;
        g.fillRect(0, 0, w, h);
        // a faint warm counter-light from the red core
        const rr = Math.min(w, h) * 0.55;
        const rad2 = g.createRadialGradient(cx, cy, 0, cx, cy, rr);
        rad2.addColorStop(0, rgba(C.red, C.night ? 0.09 : 0.025));
        rad2.addColorStop(1, rgba(C.red, 0));
        g.fillStyle = rad2;
        g.fillRect(0, 0, w, h);
        // Orbital-plane sheen baked at the rest orientation (it is soft, so pointer tilt need not move it).
        if (data.sprites.disc) {
          const Rb = Math.min(w * (hero ? 0.4 : 0.42), h * (hero ? 0.86 : 0.84));
          const Rd = Rb * data.rings[data.rings.length - 1].r * 1.12;
          const tl = 1.2, rl = -0.12 + (hero ? 0 : 0.02);
          const cT = Math.cos(tl), cR = Math.cos(rl), sR = Math.sin(rl);
          g.save();
          g.transform(cR * Rd, sR * Rd, -sR * cT * Rd, cR * cT * Rd, cx, cy);
          g.globalAlpha = C.night ? 0.16 : 0.1;
          g.drawImage(data.sprites.disc, -1, -1, 2, 2);
          g.restore();
        }
        if (C.night) {
          const vig = g.createRadialGradient(cx, cy, Math.min(w, h) * 0.35, cx, cy, Math.max(w, h) * 0.75);
          vig.addColorStop(0, rgba(C.ground, 0));
          vig.addColorStop(1, rgba(C.ground, 0.55));
          g.fillStyle = vig;
          g.fillRect(0, 0, w, h);
        }
      }
      data.bg = bg;
    }

    // --- background ---
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    if (data.bg) ctx.drawImage(data.bg, 0, 0, w, h);
    else {
      ctx.fillStyle = rgba(C.ground, 1);
      ctx.fillRect(0, 0, w, h);
    }

    const pointer = state.pointer || { x: 0, y: 0, active: 0 };
    const scroll = state.scroll == null ? 0.5 : state.scroll;
    const cx = w * 0.5 + pointer.x * (hero ? 10 : 4);
    const cy = h * 0.47 + pointer.y * (hero ? 6 : 3);
    // System radius in px: wide but the tilted ellipse must fit the height.
    const R = Math.min(w * (hero ? 0.4 : 0.42), h * (hero ? 0.86 : 0.84));
    const F = R * 4.2;

    // --- far dust (night) ---
    if (C.night && data.dust.length) {
      // batched into three alpha levels (one fill each) to keep draw calls low
      ctx.fillStyle = data.ringCss;
      const d = data.dust;
      for (let b = 0; b < 3; b++) {
        ctx.beginPath();
        for (let i = 0; i < d.length; i += 4) {
          const depth = d[i + 2];
          const tw = 0.5 + 0.5 * Math.sin(t * (0.5 + depth * 0.6) + d[i + 3] * 3);
          if (Math.min(2, (tw * 3) | 0) !== b) continue;
          const x = d[i] * w - pointer.x * 14 * depth + Math.sin(t * 0.05 + d[i + 3]) * 6 * depth;
          const y = d[i + 1] * h - pointer.y * 10 * depth;
          const sz = 0.7 + depth * 0.9;
          ctx.rect(x, y, sz, sz);
        }
        ctx.globalAlpha = 0.07 + b * 0.07;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // --- global rotation ---
    const tilt = 1.2 + pointer.y * 0.1 + (scroll - 0.5) * 0.16; // inclination from face-on
    const yaw = pointer.x * 0.16;
    const roll = -0.12 + (hero ? 0.0 : 0.02);
    const spin = data.spin0 + t * 0.018;
    // G = Rz(roll) * Ry(yaw) * Rx(tilt) * Rz(spin)
    const cS = Math.cos(spin), sS = Math.sin(spin);
    const cT = Math.cos(tilt), sT = Math.sin(tilt);
    const cY = Math.cos(yaw), sY = Math.sin(yaw);
    const cR = Math.cos(roll), sR = Math.sin(roll);
    // A = Rx(tilt) * Rz(spin)
    const a00 = cS, a01 = -sS, a02 = 0;
    const a10 = cT * sS, a11 = cT * cS, a12 = -sT;
    const a20 = sT * sS, a21 = sT * cS, a22 = cT;
    // B = Ry(yaw) * A ; Ry: [cY 0 sY; 0 1 0; -sY 0 cY]
    const b00 = cY * a00 + sY * a20, b01 = cY * a01 + sY * a21, b02 = cY * a02 + sY * a22;
    const b10 = a10, b11 = a11, b12 = a12;
    const b20 = -sY * a00 + cY * a20, b21 = -sY * a01 + cY * a21, b22 = -sY * a02 + cY * a22;
    // G = Rz(roll) * B
    const G = data.G;
    G[0] = cR * b00 - sR * b10; G[1] = cR * b01 - sR * b11; G[2] = cR * b02 - sR * b12;
    G[3] = sR * b00 + cR * b10; G[4] = sR * b01 + cR * b11; G[5] = sR * b02 + cR * b12;
    G[6] = b20; G[7] = b21; G[8] = b22;

    // --- project rings ---
    const rings = data.rings;
    const cs = data.cs;
    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
      const m = ring.m;
      const Cm = ring.C;
      // Combined 3x2: rows of G times columns (m0,m2,m4) and (m1,m3,m5)
      Cm[0] = G[0] * m[0] + G[1] * m[2] + G[2] * m[4];
      Cm[1] = G[0] * m[1] + G[1] * m[3] + G[2] * m[5];
      Cm[2] = G[3] * m[0] + G[4] * m[2] + G[5] * m[4];
      Cm[3] = G[3] * m[1] + G[4] * m[3] + G[5] * m[5];
      Cm[4] = G[6] * m[0] + G[7] * m[2] + G[8] * m[4];
      Cm[5] = G[6] * m[1] + G[7] * m[3] + G[8] * m[5];
      const rr = ring.r * R;
      const P = ring.proj;
      for (let k = 0; k <= SEG; k++) {
        const c = cs[k * 2], s = cs[k * 2 + 1];
        const x = rr * (Cm[0] * c + Cm[1] * s);
        const y = rr * (Cm[2] * c + Cm[3] * s);
        const z = rr * (Cm[4] * c + Cm[5] * s);
        const p = F / (F - z);
        P[k * 3] = cx + x * p;
        P[k * 3 + 1] = cy + y * p;
        P[k * 3 + 2] = z / R; // -1..1 depth (+ = near)
      }
    }

    const fgAlpha = C.night ? 1 : 0.85;
    const lw = hero ? 1.1 : 0.9;
    // depth buckets: back (z<0) and front (z>=0), 3 each
    const drawRings = (front) => {
      ctx.lineWidth = lw;
      ctx.strokeStyle = data.ringCss;
      for (let b = 0; b < 3; b++) {
        ctx.beginPath();
        for (let i = 0; i < rings.length; i++) {
          const P = rings[i].proj;
          let pen = false;
          for (let k = 0; k < SEG; k++) {
            const zm = (P[k * 3 + 2] + P[k * 3 + 5]) * 0.5;
            const isFront = zm >= 0;
            let bucket = Math.min(2, Math.floor(Math.abs(zm) * 3.2));
            if (!front) bucket = 2 - bucket; // far end of back half is bucket 0 (dimmest)
            if (isFront === front && bucket === b) {
              if (!pen) ctx.moveTo(P[k * 3], P[k * 3 + 1]);
              ctx.lineTo(P[k * 3 + 3], P[k * 3 + 4]);
              pen = true;
            } else pen = false;
          }
        }
        // alpha: back 0.07..0.14, front 0.17..0.30 (night); day slightly lower
        const a = front ? 0.17 + b * 0.065 : 0.06 + b * 0.04;
        ctx.globalAlpha = a * fgAlpha * (C.night ? 1 : 0.8);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    // --- belt particles (projected with global matrix only) ---
    const belt = data.belt;
    const bb = data.bb;
    let beltReady = false;
    const drawBelt = (front) => {
      if (!belt.length) return;
      if (!beltReady) {
        // project once per frame: x, y, size, bucket (0..2 back, 3..5 front)
        for (let i = 0, j = 0; i < belt.length; i += 4, j += 4) {
          const r = belt[i] * R;
          const ang = belt[i + 1] + t * belt[i + 2];
          const c = Math.cos(ang), s = Math.sin(ang);
          const z = r * (G[6] * c + G[7] * s);
          const p = F / (F - z);
          bb[j] = cx + r * (G[0] * c + G[1] * s) * p;
          bb[j + 1] = cy + r * (G[3] * c + G[4] * s) * p;
          bb[j + 2] = belt[i + 3] * p * (hero ? 1 : 0.85);
          const zn = (z / (r || 1) + 1) * 0.5; // 0 far .. 1 near
          bb[j + 3] = Math.min(5, (zn * 6) | 0);
        }
        beltReady = true;
      }
      ctx.fillStyle = C.night ? data.ringCss : data.sprites.css.accent;
      const b0 = front ? 3 : 0;
      for (let b = b0; b < b0 + 3; b++) {
        ctx.beginPath();
        for (let j = 0; j < bb.length; j += 4) {
          if (bb[j + 3] !== b) continue;
          const sz = bb[j + 2];
          ctx.rect(bb[j] - sz / 2, bb[j + 1] - sz / 2, sz, sz);
        }
        const zn = (b + 0.5) / 6;
        ctx.globalAlpha = C.night ? 0.16 + 0.36 * zn : 0.07 + 0.2 * zn;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // --- planets ---
    const planets = data.planets;
    const pp = data.pp;
    const projAt = (ring, ang) => {
      const Cm = ring.C;
      const rr = ring.r * R;
      const c = Math.cos(ang), s = Math.sin(ang);
      const x = rr * (Cm[0] * c + Cm[1] * s);
      const y = rr * (Cm[2] * c + Cm[3] * s);
      const z = rr * (Cm[4] * c + Cm[5] * s);
      const p = F / (F - z);
      pp[0] = cx + x * p;
      pp[1] = cy + y * p;
      pp[2] = z / R;
      return p;
    };
    const TRAIL = hero ? 24 : 16;
    const drawPlanets = (front) => {
      for (let i = 0; i < planets.length; i++) {
        const pl = planets[i];
        const ring = rings[pl.ring];
        const ang = pl.phase + t * pl.omega;
        const p = projAt(ring, ang);
        const px = pp[0], py = pp[1], pz = pp[2];
        if ((pz >= 0) !== front) continue;
        const depthK = 0.55 + 0.45 * (pz + 1) * 0.5; // far planets dimmer
        // trail: a tapered ribbon along the orbit, fading from the planet backwards
        const tb = data.tb;
        const span = pl.trail;
        tb[0] = px; tb[1] = py; tb[2] = p;
        for (let k = 1; k <= TRAIL; k++) {
          const pk2 = projAt(ring, ang - (k / TRAIL) * span);
          tb[k * 3] = pp[0]; tb[k * 3 + 1] = pp[1]; tb[k * 3 + 2] = pk2;
        }
        const w0 = pl.size * p * 0.62;
        ctx.beginPath();
        for (let k = 0; k <= TRAIL; k++) {
          const k0 = k === 0 ? 0 : k - 1, k1 = k === TRAIL ? TRAIL : k + 1;
          let nx = -(tb[k1 * 3 + 1] - tb[k0 * 3 + 1]), ny = tb[k1 * 3] - tb[k0 * 3];
          const nl = Math.hypot(nx, ny) || 1;
          const f = k / TRAIL;
          const hw = w0 * Math.pow(1 - f, 0.9) + 0.15;
          nx = (nx / nl) * hw; ny = (ny / nl) * hw;
          if (k === 0) ctx.moveTo(tb[0] + nx, tb[1] + ny);
          else ctx.lineTo(tb[k * 3] + nx, tb[k * 3 + 1] + ny);
          data.tn[k * 2] = nx; data.tn[k * 2 + 1] = ny;
        }
        for (let k = TRAIL; k >= 0; k--) ctx.lineTo(tb[k * 3] - data.tn[k * 2], tb[k * 3 + 1] - data.tn[k * 2 + 1]);
        ctx.closePath();
        const ex = tb[TRAIL * 3], ey = tb[TRAIL * 3 + 1];
        const mx = tb[(TRAIL >> 1) * 3], my = tb[(TRAIL >> 1) * 3 + 1];
        // gradient axis: head -> point beyond the arc's mid towards its end (approximates arc length fade)
        const grd = ctx.createLinearGradient(px, py, ex + (ex - mx) * 0.2, ey + (ey - my) * 0.2);
        const cc = data.sprites.trail[pl.color];
        grd.addColorStop(0, cc[0]);
        grd.addColorStop(0.35, cc[1]);
        grd.addColorStop(1, cc[2]);
        ctx.fillStyle = grd;
        ctx.globalAlpha = (C.night ? 0.75 : 0.65) * depthK;
        ctx.fill();
        const r = pl.size * p;
        const gs = data.sprites.glow[pl.color];
        if (gs) {
          ctx.globalAlpha = (C.night ? 0.42 : 0.22) * depthK;
          const gr = r * 5;
          ctx.drawImage(gs, px - gr, py - gr, gr * 2, gr * 2);
        }
        const ss = data.sprites.sphere[pl.color];
        ctx.globalAlpha = 0.65 + 0.35 * depthK;
        if (ss) ctx.drawImage(ss, px - r, py - r, r * 2, r * 2);
        else {
          ctx.fillStyle = css;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // --- core ---
    const drawCore = () => {
      const coreR = hero ? 12 : 7;
      const breathe = 1 + 0.06 * Math.sin(t * 1.1);
      const gr = coreR * (hero ? 7.5 : 6.5) * breathe;
      const gsp = data.sprites.glowRed;
      if (gsp) {
        ctx.globalAlpha = C.night ? 0.45 : 0.16;
        ctx.drawImage(gsp, cx - gr, cy - gr, gr * 2, gr * 2);
        ctx.globalAlpha = C.night ? 0.55 : 0.3;
        const g2 = coreR * 2.4;
        ctx.drawImage(gsp, cx - g2, cy - g2, g2 * 2, g2 * 2);
      }
      // pulse ring in the orbital plane
      const period = 4.2;
      const ph = (t % period) / period;
      const pr = (coreR * 1.4 + ph * R * 0.22);
      const pa = (1 - ph) * (1 - ph) * (C.night ? 0.38 : 0.3);
      if (pa > 0.01) {
        const pu = data.pulse;
        ctx.beginPath();
        for (let i = 0; i <= 48; i++) {
          const c = pu[i * 2], s = pu[i * 2 + 1];
          const x = pr * (G[0] * c + G[1] * s);
          const y = pr * (G[3] * c + G[4] * s);
          const z = pr * (G[6] * c + G[7] * s);
          const p = F / (F - z);
          if (i === 0) ctx.moveTo(cx + x * p, cy + y * p);
          else ctx.lineTo(cx + x * p, cy + y * p);
        }
        ctx.strokeStyle = data.redCss;
        ctx.lineWidth = hero ? 1.2 : 1;
        ctx.globalAlpha = pa;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const cr = data.sprites.coreRed;
      if (cr) ctx.drawImage(cr, cx - coreR, cy - coreR, coreR * 2, coreR * 2);
      else {
        ctx.fillStyle = data.redCss;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, TAU);
        ctx.fill();
      }
    };

    drawRings(false);
    drawBelt(false);
    drawPlanets(false);
    drawCore();
    drawRings(true);
    drawBelt(true);
    drawPlanets(true);
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  },
};
