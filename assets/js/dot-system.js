/* ============================================================================
   THE DOT SYSTEM
   ----------------------------------------------------------------------------
   StartNet's logo ends in a dot. This module treats that dot as the atomic
   unit of the whole visual identity and gives it six states. A ring is never
   drawn as six different graphics — it is one set of marks that morphs.

     mark     one dot                     → identity
     path     evenly spaced dots          → a journey
     signal   dots fading in opacity      → momentum, decay
     measure  dots stretched into ticks   → evidence, the numbers
     orbit    marks fused into one stroke → infrastructure
     network  concentric lanes            → one system on more than one level

   Every state is expressed as N rounded rectangles laid along an arc, each
   described by four numbers:

     w   tangential width   (along the arc)
     h   radial height      (across the arc)
     dr  radial offset      (which concentric lane it sits in)
     op  opacity

   A dot is w = h. A tick is h >> w. A solid arc is w = the segment length.
   A hairline lane is w = segment length, h ≈ 1.5, dr ≠ 0. Because all six
   states share one description, morphing between any two is a straight
   interpolation of four numbers — which is why it stays smooth on a phone.
   ========================================================================== */

const VIEW = 400;
const CENTRE = VIEW / 2;
const RADIUS = 150;
const TAU = Math.PI * 2;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;

/* House easing curve, matching --ease-out-expo. */
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------------------------------------------------------------------------
   STATE DESCRIPTORS
   Each returns { w, h, dr, op } for mark i of n, where t = i / (n - 1).
   `seg` is the arc length one mark occupies — the width at which marks touch.
   ------------------------------------------------------------------------ */
const STATES = {
  mark: (t, seg, i, n) => ({
    w: i === n - 1 ? 21 : 0,
    h: i === n - 1 ? 21 : 0,
    dr: 0,
    op: i === n - 1 ? 1 : 0,
  }),

  path: () => ({ w: 8, h: 8, dr: 0, op: 1 }),

  /* Signal used to grade dot SIZE large-to-small — any size gradient sitting
     next to the ring's constant-width solid tail reads as one continuous
     line tapering to a point, at rest or mid-morph, no matter how gentle
     the floor. Size now stays constant (matching `path`, so morphing
     between the two barely reads as a size change at all) and the
     "signal weakening with distance" idea is carried by opacity alone —
     which cannot produce a geometric point, only a fade. */
  signal: (t) => ({ w: 9, h: 9, dr: 0, op: lerp(1, 0.32, easeInOut(t)) }),

  measure: (t) => ({
    w: 2.6,
    h: lerp(26, 12, easeInOut(t)),
    dr: 0,
    op: lerp(1, 0.6, t),
  }),

  /* Marks must overlap by at least their own cap radius, or the rounded ends
     pinch and the arc reads as beads instead of one stroke. */
  orbit: (t, seg) => ({ w: seg + 15, h: 14, dr: 0, op: 1 }),

  /* Two concentric lanes. Alternate marks take alternate lanes, so each mark
     spans two segments to keep its own lane continuous. Two rather than four:
     a mark is a straight chord, and past roughly two segments the flattening
     against the true arc becomes visible. */
  network: (t, seg, i) => ({
    w: seg * 2.15,
    h: 1.8,
    dr: (i % 2 === 0 ? -1 : 1) * 7,
    op: lerp(1, 0.5, t),
  }),
};

const STATE_NAMES = Object.keys(STATES);

/* ---------------------------------------------------------------------------
   Describe an SVG arc path — used for the solid tail and the ghost lanes.
   ------------------------------------------------------------------------ */
function arcPath(fromDeg, sweepDeg, r) {
  const a0 = (fromDeg * Math.PI) / 180;
  const a1 = ((fromDeg + sweepDeg) * Math.PI) / 180;
  const x0 = CENTRE + r * Math.cos(a0);
  const y0 = CENTRE + r * Math.sin(a0);
  const x1 = CENTRE + r * Math.cos(a1);
  const y1 = CENTRE + r * Math.sin(a1);
  const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
  const sweep = sweepDeg >= 0 ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} ${sweep} ${x1.toFixed(
    2
  )} ${y1.toFixed(2)}`;
}

const svgEl = (name, attrs = {}) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

/* ==========================================================================
   RING
   ========================================================================== */
class Ring {
  constructor(root) {
    this.root = root;
    this.svg = root.querySelector('.ring__svg');
    this.ghost = root.querySelector('.ring__ghost');
    this.marksGroup = root.querySelector('.ring__marks');

    this.states = (root.dataset.states || 'path,signal,measure,orbit,network')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => STATE_NAMES.includes(s));
    if (!this.states.length) this.states = ['path'];

    this.arc = Number(root.dataset.arc ?? 300);
    this.from = Number(root.dataset.from ?? 118);
    this.solid = Number(root.dataset.solid ?? 0);
    this.count = Math.max(6, Number(root.dataset.count ?? 34));

    this.index = 0;
    this.next = this.states.length > 1 ? 1 : 0;
    this.progress = 1;
    this.running = false;
    this.lastFrame = 0;
    this.holdUntil = 0;

    this.build();
    this.apply(1);
  }

  build() {
    const rotor = svgEl('g', { class: 'ring__rotor' });
    this.rotor = rotor;

    /* Ghost lanes — the faint circles that imply the rest of the system. */
    [RADIUS, RADIUS * 0.72, RADIUS * 1.24].forEach((r, i) => {
      this.ghost.appendChild(
        svgEl('circle', {
          cx: CENTRE,
          cy: CENTRE,
          r: r.toFixed(1),
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 1,
          opacity: (0.1 - i * 0.03).toFixed(3),
        })
      );
    });

    /* The solid tail — the part of the ring that never dissolves. It is the
       constant the morphing half is measured against. */
    if (this.solid > 0) {
      this.tail = svgEl('path', {
        d: arcPath(this.from + this.arc, this.solid, RADIUS),
        'stroke-width': 14,
        'stroke-linecap': 'round',
      });
      rotor.appendChild(this.tail);
    }

    /* The morphing marks. */
    this.marks = [];
    const n = this.count;
    const step = this.arc / (n - 1);
    for (let i = 0; i < n; i += 1) {
      const angle = this.from + step * i;
      /* Marks are authored at 12 o'clock and rotated into place. arcPath()
         measures from 3 o'clock, so the +90 keeps both conventions aligned. */
      const g = svgEl('g', {
        transform: `rotate(${(angle + 90).toFixed(3)} ${CENTRE} ${CENTRE})`,
      });
      const rect = svgEl('rect', { x: 0, y: 0, width: 0, height: 0, rx: 0 });
      g.appendChild(rect);
      rotor.appendChild(g);
      this.marks.push({ g, rect, angle });
    }

    this.marksGroup.appendChild(rotor);

    /* Arc length one mark occupies — the width at which marks fuse. */
    this.seg = (Math.abs(this.arc) / 360) * TAU * RADIUS / (n - 1);
  }

  /** Interpolate between the current and next state and write the DOM. */
  apply(p) {
    const n = this.count;
    const a = STATES[this.states[this.index]];
    const b = STATES[this.states[this.next]];
    const e = easeOutExpo(clamp01(p));

    for (let i = 0; i < n; i += 1) {
      const t = n === 1 ? 0 : i / (n - 1);
      const A = a(t, this.seg, i, n);
      const B = b(t, this.seg, i, n);

      /* A short per-mark stagger makes the morph read as a wave travelling
         around the ring rather than every dot changing at once. */
      const local = clamp01((e - t * 0.22) / 0.78);
      const w = lerp(A.w, B.w, local);
      const h = lerp(A.h, B.h, local);
      const dr = lerp(A.dr, B.dr, local);
      const op = lerp(A.op, B.op, local);

      const { rect, g, angle } = this.marks[i];
      const y = CENTRE - RADIUS - dr;
      rect.setAttribute('x', (CENTRE - w / 2).toFixed(2));
      rect.setAttribute('y', (y - h / 2).toFixed(2));
      rect.setAttribute('width', Math.max(0, w).toFixed(2));
      rect.setAttribute('height', Math.max(0, h).toFixed(2));
      rect.setAttribute('rx', (Math.min(w, h) / 2).toFixed(2));
      rect.setAttribute('opacity', op.toFixed(3));
      g.setAttribute('transform', `rotate(${(angle + 90).toFixed(3)} ${CENTRE} ${CENTRE})`);
    }
  }

  advance() {
    this.index = this.next;
    this.next = (this.next + 1) % this.states.length;
    this.progress = 0;
  }

  frame(now) {
    if (!this.running) return;
    const dt = this.lastFrame ? now - this.lastFrame : 16;
    this.lastFrame = now;

    if (now < this.holdUntil) {
      this.raf = requestAnimationFrame(this.frame.bind(this));
      return;
    }

    this.progress += dt / this.morphMs;
    if (this.progress >= 1) {
      this.progress = 1;
      this.apply(1);
      this.advance();
      this.holdUntil = now + this.holdMs;
    } else {
      this.apply(this.progress);
    }
    this.raf = requestAnimationFrame(this.frame.bind(this));
  }

  start() {
    if (this.running || this.states.length < 2) return;
    this.running = true;
    this.lastFrame = 0;
    this.raf = requestAnimationFrame(this.frame.bind(this));
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  /** Jump straight to a named state — used by scroll-linked sections. */
  setState(name, { instant = false } = {}) {
    const i = this.states.indexOf(name);
    if (i < 0) return;
    this.stop();
    this.index = this.next = i;
    this.apply(1);
    if (!instant) this.start();
  }
}

/* ==========================================================================
   BOOT
   Rings only animate while they are on screen. A page with four rings should
   not be paying for four animation loops it cannot see.
   ========================================================================== */
export function initDotSystem(scope = document) {
  const nodes = scope.querySelectorAll('[data-dot-ring]');
  if (!nodes.length) return [];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cycleMs = 3600;

  const rings = [...nodes].map((node) => {
    const ring = new Ring(node);
    ring.morphMs = 1250;
    ring.holdMs = Math.max(300, cycleMs - 1250);
    node.__snRing = ring;
    return ring;
  });

  if (reduced) {
    /* Motion is decoration, never information — settle on the state that
       says "infrastructure" and stop there. */
    rings.forEach((r) => r.setState(r.states.includes('orbit') ? 'orbit' : r.states[0], {
      instant: true,
    }));
    return rings;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const ring = entry.target.__snRing;
        if (!ring) return;
        if (entry.isIntersecting) ring.start();
        else ring.stop();
      });
    },
    { rootMargin: '15% 0px 15% 0px', threshold: 0 }
  );

  rings.forEach((r) => io.observe(r.root));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) rings.forEach((r) => r.stop());
    else rings.forEach((r) => r.root.__snVisible !== false && r.start());
  });

  return rings;
}

export { Ring, STATE_NAMES };
