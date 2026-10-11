// sphere — a slowly turning globe of evenly spread points (Fibonacci sphere,
// never a grid), depth-shaded so the near side is crisp and the far side
// recedes into haze. A few great-circle arcs lift off the surface, travel
// between nodes and light them up. One red node pulses (the composition's
// single red point). A faint orbit ring with a small satellite adds depth on
// hero sizes. Pointer tilts the globe; scroll turns it a little further.
//
// Performance: the ground, glow, limb light and rim are baked once per size
// into an offscreen layer (one drawImage per frame). Points are projected into
// preallocated typed arrays and drawn in a handful of depth buckets (one path
// + one fill per bucket). No per-frame allocations beyond a few gradients.

const TAU = Math.PI * 2;
const STATIC_T = 4.2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const BUCKETS = 14;

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

const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function makeLayer(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function layout(w, h, hero) {
  const R = hero ? Math.min(h * 0.4, w * 0.3) : Math.min(h * 0.36, w * 0.3);
  return { cx: w * 0.5, cy: h * (hero ? 0.5 : 0.52), R };
}

/* ---------- variant ---------- */
export default {
  name: 'sphere',
  staticT: STATIC_T,

  init(state) {
    const { w, h, hero, rng } = state;
    const { R } = layout(w, h, hero);
    const total = hero
      ? Math.max(2200, Math.min(4000, Math.round((R * R) / 16)))
      : Math.max(900, Math.min(1800, Math.round((R * R) / 4.5)));
    // smooth field on the sphere → organic brighter "land" masses over a dimmer
    // shell, so the globe never reads as an even pattern.
    const waves = [];
    for (let j = 0; j < 5; j++) {
      const u = rng() * 2 - 1;
      const th = rng() * TAU;
      const r0 = Math.sqrt(1 - u * u);
      waves.push([r0 * Math.cos(th), u, r0 * Math.sin(th), 2.2 + rng() * 3, rng() * TAU, j < 2 ? 1 : 0.6]);
    }
    const field = (x, y, z) => {
      let v = 0;
      for (let j = 0; j < waves.length; j++) {
        const q = waves[j];
        v += q[5] * Math.sin((x * q[0] + y * q[1] + z * q[2]) * q[3] + q[4]);
      }
      return v;
    };
    const P = [];
    // generous jitter: Fibonacci-even density, but blue-noise texture (no lattice)
    const jitter = 2.2 / Math.sqrt(total);
    for (let i = 0; i < total; i++) {
      const y = 1 - (2 * (i + 0.5)) / total;
      const r = Math.sqrt(1 - y * y);
      const a = i * GOLDEN;
      const x = Math.cos(a) * r + (rng() - 0.5) * jitter;
      const z = Math.sin(a) * r + (rng() - 0.5) * jitter;
      const yy = y + (rng() - 0.5) * jitter;
      const l = Math.hypot(x, yy, z) || 1;
      const f = field(x / l, yy / l, z / l);
      const land = f > 0.15;
      // fade the coastline a little so masses have soft edges
      const wgt = land ? 0.78 + 0.22 * Math.min(1, (f - 0.15) / 0.9) : 0.4 + 0.2 * Math.max(0, 1 + (f - 0.15) / 1.2);
      P.push(x / l, yy / l, z / l, wgt);
    }
    const n = P.length / 4;
    const px = new Float32Array(n);
    const py = new Float32Array(n);
    const pz = new Float32Array(n);
    const pw = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      px[i] = P[i * 4];
      py[i] = P[i * 4 + 1];
      pz[i] = P[i * 4 + 2];
      pw[i] = P[i * 4 + 3];
    }
    const L = [rng() - 0.5, rng() - 0.5, rng() - 0.5];
    const ll = Math.hypot(L[0], L[1], L[2]) || 1;

    const yaw0 = rng() * TAU;
    const spin = 0.07;

    // arcs between nodes
    const arcCount = hero ? 6 : 3;
    const S = hero ? 44 : 30;
    const arcs = [];
    let guard = 0;
    while (arcs.length < arcCount && guard++ < 400) {
      const ia = Math.floor(rng() * n);
      const ib = Math.floor(rng() * n);
      // keep arcs to the temperate band so they read well with the tilt
      if (Math.abs(py[ia]) > 0.75 || Math.abs(py[ib]) > 0.75) continue;
      if (pw[ia] < 0.75 || pw[ib] < 0.75) continue;
      const dot = px[ia] * px[ib] + py[ia] * py[ib] + pz[ia] * pz[ib];
      const om = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (om < 0.55 || om > 1.6) continue;
      const pts = new Float32Array((S + 1) * 3);
      const so = Math.sin(om);
      const lift = 0.06 + 0.16 * (om / Math.PI);
      for (let k = 0; k <= S; k++) {
        const s = k / S;
        const A = Math.sin((1 - s) * om) / so;
        const B = Math.sin(s * om) / so;
        const L = 1 + lift * Math.sin(Math.PI * s);
        pts[k * 3] = (A * px[ia] + B * px[ib]) * L;
        pts[k * 3 + 1] = (A * py[ia] + B * py[ib]) * L;
        pts[k * 3 + 2] = (A * pz[ia] + B * pz[ib]) * L;
      }
      arcs.push({
        a: ia,
        b: ib,
        pts,
        sx: new Float32Array(S + 1),
        sy: new Float32Array(S + 1),
        sz: new Float32Array(S + 1),
        period: 6.5 + rng() * 3.5,
        // stagger so the static frame shows arcs in different phases
        offset: (arcs.length / arcCount) * 9 + rng() * 1.5,
      });
    }

    // the red node: placed so the static frame shows it front-right, upper half
    const lat = 0.42 + rng() * 0.18;
    const yawStatic = yaw0 + STATIC_T * spin;
    const lon = yawStatic + 0.55 + rng() * 0.2;
    const red = [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];

    // orbit ring (hero only): a tilted circle around the globe
    const ringN = 96;
    const ring = new Float32Array((ringN + 1) * 3);
    const tiltA = 0.35 + rng() * 0.2;
    const tiltB = (rng() - 0.5) * 0.6;
    for (let k = 0; k <= ringN; k++) {
      const a = (k / ringN) * TAU;
      let x = Math.cos(a) * 1.42;
      let y = 0;
      let z = Math.sin(a) * 1.42;
      // tilt about x then z
      const y1 = y * Math.cos(tiltA) - z * Math.sin(tiltA);
      const z1 = y * Math.sin(tiltA) + z * Math.cos(tiltA);
      const x2 = x * Math.cos(tiltB) - y1 * Math.sin(tiltB);
      const y2 = x * Math.sin(tiltB) + y1 * Math.cos(tiltB);
      ring[k * 3] = x2;
      ring[k * 3 + 1] = y2;
      ring[k * 3 + 2] = z1;
    }

    return {
      n,
      px,
      py,
      pz,
      pw,
      L: [L[0] / ll, L[1] / ll, L[2] / ll],
      qx: new Float32Array(n),
      qy: new Float32Array(n),
      lev: new Uint8Array(n),
      cnt: new Int32Array(BUCKETS + 2),
      ord: new Int32Array(n),
      yaw0,
      spin,
      arcs,
      S,
      red,
      ring,
      ringN,
      rx: new Float32Array(ringN + 1),
      ry: new Float32Array(ringN + 1),
      rz: new Float32Array(ringN + 1),
      satPhase: rng(),
      layer: null,
      cacheKey: '',
      C: null,
    };
  },

  frame(ctx, state, data, t) {
    const { w, h, hero, night, palette, pointer, dpr } = state;
    const scroll = state.scroll || 0;
    const key = `${w}x${h}|${dpr}|${night ? 1 : 0}|${palette.ground}|${palette.accent}`;
    if (data.cacheKey !== key) {
      buildCache(data, state);
      data.cacheKey = key;
    }
    const C = data.C;
    data.dpr = dpr;
    const { cx, cy, R } = layout(w, h, hero);

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(data.layer, 0, 0, w, h);

    const pxn = pointer ? pointer.x * (pointer.active ?? 1) : 0;
    const pyn = pointer ? pointer.y * (pointer.active ?? 1) : 0;
    const yaw = data.yaw0 + t * data.spin + pxn * 0.35 + scroll * 0.6;
    const pitch = 0.36 + pyn * 0.16 + (scroll - 0.5) * 0.12;
    const cyw = Math.cos(yaw);
    const syw = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const D = 4.2;

    const { n, px, py, pz, pw, qx, qy, lev } = data;
    const [lx, ly, lz] = data.L;
    const sh = t * 0.55;
    for (let i = 0; i < n; i++) {
      const x = px[i];
      const y = py[i];
      const z = pz[i];
      const x1 = x * cyw - z * syw;
      const z1 = x * syw + z * cyw;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const s = D / (D - z2);
      if (z2 < -0.3) {
        // far hemisphere: hidden behind the lit body anyway — skip the draw
        lev[i] = 0;
        continue;
      }
      qx[i] = cx + x1 * R * s;
      qy[i] = cy - y2 * R * s;
      // depth (near side crisp, far side haze) × land weight × a slow shimmer
      const dz = (z2 + 1) * 0.5;
      const depth = 0.07 + 0.93 * Math.pow(dz, 2.2);
      const shimmer = 0.8 + 0.2 * Math.sin((x * lx + y * ly + z * lz) * 4.2 - sh);
      // key light from the upper left, in view space
      const lit = 0.55 + 0.45 * Math.max(0, -0.45 * x1 + 0.5 * y2 + 0.74 * z2);
      let b = Math.floor(Math.pow(depth * pw[i] * shimmer * lit, 0.5) * BUCKETS);
      lev[i] = b < 0 ? 0 : b >= BUCKETS ? BUCKETS - 1 : b;
    }

    /* orbit ring — back half (behind the globe) */
    if (hero) projectRing(data, cx, cy, R, cp, sp, D, t);
    if (hero) drawRing(ctx, data, C, false);

    /* points, faint to bright. Indices are bucketed with a counting sort (no
       allocations); small points are plain fillRects (cheap, batched on the
       GPU), only the brightest buckets get round dots. */
    const { cnt, ord } = data;
    cnt.fill(0);
    for (let i = 0; i < n; i++) cnt[lev[i] + 1]++;
    for (let b = 1; b <= BUCKETS; b++) cnt[b] += cnt[b - 1];
    for (let i = 0; i < n; i++) ord[cnt[lev[i]]++] = i;
    // cnt[b] is now the end of bucket b; bucket b starts at cnt[b-1] (0 for b = 0)
    for (let b = 1; b < BUCKETS; b++) {
      const start = cnt[b - 1];
      const end = cnt[b];
      if (end <= start) continue;
      const r = C.size[b];
      ctx.fillStyle = C.dot[b];
      if (r > 0.9) {
        ctx.beginPath();
        for (let j = start; j < end; j++) {
          const i = ord[j];
          ctx.moveTo(qx[i] + r, qy[i]);
          ctx.arc(qx[i], qy[i], r, 0, TAU);
        }
        ctx.fill();
      } else {
        const d = r * 2;
        for (let j = start; j < end; j++) {
          const i = ord[j];
          ctx.fillRect(qx[i] - r, qy[i] - r, d, d);
        }
      }
    }

    /* arcs */
    const arcs = data.arcs;
    const S = data.S;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let a = 0; a < arcs.length; a++) {
      const arc = arcs[a];
      const u = (((t + arc.offset) / arc.period) % 1 + 1) % 1;
      // 0–.42 draw in, .42–.62 hold, .62–.86 retract, then rest
      const head = easeInOut(Math.min(1, u / 0.42));
      const tail = u < 0.62 ? 0 : easeInOut(Math.min(1, (u - 0.62) / 0.24));
      const fade = u < 0.86 ? 1 : 0;
      const { pts, sx, sy, sz } = arc;
      for (let k = 0; k <= S; k++) {
        const x = pts[k * 3];
        const y = pts[k * 3 + 1];
        const z = pts[k * 3 + 2];
        const x1 = x * cyw - z * syw;
        const z1 = x * syw + z * cyw;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const s = D / (D - z2);
        sx[k] = cx + x1 * R * s;
        sy[k] = cy - y2 * R * s;
        sz[k] = z2;
      }
      const k0 = Math.floor(tail * S);
      const k1 = Math.ceil(head * S);
      if (fade && k1 > k0) {
        // visibility: hide the part that runs behind the globe
        const g = ctx.createLinearGradient(sx[k0], sy[k0], sx[k1], sy[k1]);
        g.addColorStop(0, C.arc0);
        g.addColorStop(1, C.arc1);
        ctx.strokeStyle = g;
        ctx.lineWidth = hero ? 1.3 : 1;
        ctx.beginPath();
        let pen = false;
        for (let k = k0; k <= k1; k++) {
          const vis = sz[k] > -0.12 || (sx[k] - cx) ** 2 + (sy[k] - cy) ** 2 > R * R * 1.02;
          if (!vis) {
            pen = false;
            continue;
          }
          if (!pen) {
            ctx.moveTo(sx[k], sy[k]);
            pen = true;
          } else ctx.lineTo(sx[k], sy[k]);
        }
        ctx.stroke();
        // travelling head
        if (u < 0.42 && sz[k1] > -0.12) dot(ctx, sx[k1], sy[k1], hero ? 1.8 : 1.4, C.tintSolid, C.tintHalo, hero ? 9 : 6);
      }
      // nodes light up: start while drawing, end on arrival
      const ia = arc.a;
      const ib = arc.b;
      const la = u < 0.86 ? 1 - smooth(0.6, 0.86, u) : 0;
      const lb = u >= 0.4 && u < 0.86 ? smooth(0.4, 0.46, u) * (1 - smooth(0.62, 0.86, u)) : 0;
      if (la > 0.02 && lev[ia] > BUCKETS * 0.3) dot(ctx, qx[ia], qy[ia], (hero ? 2.2 : 1.7), C.tintSolid, C.tintHalo, (hero ? 10 : 7) * la, la);
      if (lb > 0.02 && lev[ib] > BUCKETS * 0.3) {
        dot(ctx, qx[ib], qy[ib], (hero ? 2.2 : 1.7), C.tintSolid, C.tintHalo, (hero ? 12 : 8) * lb, lb);
      }
    }

    /* orbit ring — front half + satellite */
    if (hero) drawRing(ctx, data, C, true);

    /* the red node */
    {
      const [x, y, z] = data.red;
      const x1 = x * cyw - z * syw;
      const z1 = x * syw + z * cyw;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const s = D / (D - z2);
      const X = cx + x1 * R * s;
      const Y = cy - y2 * R * s;
      const vis = smooth(-0.15, 0.25, z2);
      if (vis > 0.01) {
        // a slow breath of light — no outline rings
        const br = 0.5 + 0.5 * Math.sin(((t - STATIC_T) / 3.2) * TAU + 1.2);
        const rr = hero ? 2.6 : 2.1;
        dot(ctx, X, Y, rr, C.red, C.redHalo, (hero ? 13 : 9) + br * (hero ? 11 : 6), vis);
      }
    }
    ctx.globalAlpha = 1;
  },
};

function easeOut(x) {
  return 1 - (1 - x) * (1 - x) * (1 - x);
}

// soft glow + crisp core; halo is a cached unit radial gradient scaled by transform
function dot(ctx, x, y, r, core, halo, hr, alpha = 1) {
  ctx.globalAlpha = alpha;
  if (hr > 0.5) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(hr, hr);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function projectRing(data, cx, cy, R, cp, sp, D, t) {
  // the ring keeps its own slow precession, independent of the globe spin
  const { ring, ringN, rx, ry, rz } = data;
  const ringYaw = t * 0.03;
  const c = Math.cos(ringYaw);
  const s0 = Math.sin(ringYaw);
  for (let k = 0; k <= ringN; k++) {
    const x = ring[k * 3];
    const y = ring[k * 3 + 1];
    const z = ring[k * 3 + 2];
    const x1 = x * c - z * s0;
    const z1 = x * s0 + z * c;
    const y2 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    const s = D / (D - z2);
    rx[k] = cx + x1 * R * s;
    ry[k] = cy - y2 * R * s;
    rz[k] = z2;
  }
  data.ringT = t;
}

function drawRing(ctx, data, C, front) {
  const { ringN, rx, ry, rz } = data;
  ctx.strokeStyle = C.ring;
  ctx.lineWidth = 1 / (data.dpr || 1); // device hairline (GPU fast path)
  ctx.globalAlpha = front ? 1 : 0.45;
  ctx.beginPath();
  let pen = false;
  for (let k = 0; k <= ringN; k++) {
    const isFront = rz[k] >= 0;
    if (isFront !== front) {
      pen = false;
      continue;
    }
    if (!pen) {
      ctx.moveTo(rx[k], ry[k]);
      pen = true;
    } else ctx.lineTo(rx[k], ry[k]);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
  // satellite rides the ring
  const f = (((data.ringT || 0) / 38 + data.satPhase) % 1) * ringN;
  const k = Math.floor(f);
  if ((rz[k] >= 0) === front) {
    dot(ctx, rx[k], ry[k], 1.6, C.tintSolid, C.tintHalo, 8, front ? 0.9 : 0.3);
  }
}

function buildCache(data, state) {
  const { w, h, dpr, night, palette, hero } = state;
  const col = colours(palette, night);
  const { cx, cy, R } = layout(w, h, hero);
  const W = Math.max(1, Math.round(w * dpr));
  const H = Math.max(1, Math.round(h * dpr));
  const layer = data.layer && data.layer.width === W && data.layer.height === H ? data.layer : makeLayer(W, H);
  const g = layer.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.globalCompositeOperation = 'source-over';

  // ground
  const bg = g.createLinearGradient(0, 0, w * 0.35, h);
  bg.addColorStop(0, rgba(col.ground2, 1));
  bg.addColorStop(0.6, rgba(col.ground, 1));
  bg.addColorStop(1, rgba(col.ground, 1));
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);

  // atmosphere behind the globe
  const at = g.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 2.1);
  at.addColorStop(0, rgba(col.tint, night ? 0.16 : 0.1));
  at.addColorStop(0.35, rgba(col.tint, night ? 0.07 : 0.05));
  at.addColorStop(1, rgba(col.tint, 0));
  g.fillStyle = at;
  g.fillRect(0, 0, w, h);

  // the globe body: a soft lit disc (light from upper left), so it reads as a volume
  const body = g.createRadialGradient(cx - R * 0.4, cy - R * 0.45, R * 0.05, cx, cy, R * 1.02);
  if (night) {
    body.addColorStop(0, rgba(mixc(col.ground2, col.tint, 0.12), 0.9));
    body.addColorStop(0.75, rgba(col.ground2, 0.55));
    body.addColorStop(1, rgba(col.ground, 0.6));
  } else {
    body.addColorStop(0, rgba([255, 255, 255], 0.7));
    body.addColorStop(0.75, rgba(mixc(col.ground, col.tint, 0.03), 0.45));
    body.addColorStop(1, rgba(mixc(col.ground2, col.tint, 0.06), 0.55));
  }
  g.fillStyle = body;
  g.beginPath();
  g.arc(cx, cy, R, 0, TAU);
  g.fill();

  // rim light
  const rim = g.createRadialGradient(cx, cy, R * 0.86, cx, cy, R * 1.04);
  rim.addColorStop(0, rgba(col.tint, 0));
  rim.addColorStop(0.88, rgba(col.tint, night ? 0.12 : 0.1));
  rim.addColorStop(1, rgba(col.tint, 0));
  g.fillStyle = rim;
  g.beginPath();
  g.arc(cx, cy, R * 1.05, 0, TAU);
  g.fill();

  // vignette
  const vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.hypot(w, h) * 0.6);
  vg.addColorStop(0, rgba(col.ground, 0));
  vg.addColorStop(1, rgba(col.ground, night ? 0.5 : 0.35));
  g.fillStyle = vg;
  g.fillRect(0, 0, w, h);

  // dot colours per depth bucket: far = haze, near = crisp mark with a hint of tint
  const dotc = [];
  const size = [];
  const r0 = hero ? 0.42 : 0.36;
  const r1 = hero ? 1.05 : 0.8;
  for (let b = 0; b < BUCKETS; b++) {
    const k = b / (BUCKETS - 1);
    const c = mixc(col.tint, col.mark, 0.25 + 0.6 * k);
    const a = night ? 0.08 + 0.9 * Math.pow(k, 1.5) : 0.08 + 0.8 * Math.pow(k, 1.5);
    dotc.push(rgba(c, a));
    size.push(r0 + (r1 - r0) * k * k);
  }

  const halo = (c, a) => {
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, rgba(c, a));
    gr.addColorStop(0.4, rgba(c, a * 0.35));
    gr.addColorStop(1, rgba(c, 0));
    return gr;
  };
  const tintStrong = night ? col.tint : mixc(col.tint, [0, 0, 0], 0.08);

  data.layer = layer;
  data.C = {
    dot: dotc,
    size,
    arc0: rgba(tintStrong, 0),
    arc1: rgba(tintStrong, night ? 0.95 : 0.85),
    tintSolid: rgba(tintStrong, 1),
    tintHalo: halo(col.tint, night ? 0.45 : 0.3),
    ring: rgba(col.mark, night ? 0.16 : 0.14),
    mark: rgba(col.mark, 1),
    markHalo: halo(col.mark, night ? 0.25 : 0.12),
    red: rgba(col.red, 1),
    redHalo: halo(col.red, night ? 0.5 : 0.35),
  };
}
