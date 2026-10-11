/*
 * Motion-visual palette (DESIGN-v2 brand colours). Pure data + colour helpers, safe in SSR / prerender.
 *
 *   resolvePalette({ brand, night }) → { ground, ground2, line, ink, paper, red, accent, marigold, lagoon, glow }
 *
 * - night = Ink ground (Ink → Ink-800); day = Paper ground (Paper → Bone).
 * - accent = the brand accent on its own brand pages (light step on Ink); Lagoon for the masterbrand and StartNet X.
 * - glow  = a soft light derived from the accent, meant to be painted at low alpha (gradient light, halos).
 * - red   = SNX Red for the ONE red point of a composition (Red-400 on Ink).
 * All values are #RRGGBB strings; use rgba(hex, a) / mix(a, b, t) below for alpha and blends.
 */

export const BRAND_ACCENTS = {
  research: { day: '#4A3AA7', night: '#9894FF' },
  vibe: { day: '#E2581F', night: '#F37C52' },
  connect: { day: '#0E8F63', night: '#5DB88F' },
  women: { day: '#C2386F', night: '#F0749E' },
  // StartNet X's accent is SNX Red itself; in a motion visual red is reserved for the ONE red point, so X's decorative
  // light uses the masterbrand's Lagoon (the red point still carries the X identity).
  x: { day: '#117780', night: '#88C7CE' },
};

// Masterbrand decorative light: Lagoon (not the red family), so `accent` can be used freely by every variant and
// red stays one point per composition (user review, Oct 2026: red glows and several red planets read as noise).
const MASTER = { day: '#117780', night: '#88C7CE' };

const DAY = {
  ground: '#F4F3EF', // Paper
  ground2: '#EBEAE5', // Bone
  line: '#ABBBBE', // Ink-300 (decorative lines; draw at partial alpha)
  ink: '#0C1719', // Ink
  paper: '#F4F3EF',
  red: '#EF4444',
  marigold: '#FBA62A',
  lagoon: '#117780',
};

const NIGHT = {
  ground: '#0C1719', // Ink
  ground2: '#1B292C', // Ink-800
  line: '#39504D', // night-line-strong
  ink: '#F4F3EF', // marks are Paper on Ink
  paper: '#F4F3EF',
  red: '#F87171', // Red-400 on Ink
  marigold: '#FBA62A',
  lagoon: '#88C7CE', // Lagoon-300 on Ink
};

export function hexToRgb(hex) {
  let h = String(hex || '').trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');

/** '#RRGGBB' + alpha → 'rgba(r,g,b,a)' */
export function rgba(hex, a = 1) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

/** Linear sRGB blend of two hex colours (t = 0 → a, 1 → b), returns '#RRGGBB'. */
export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `#${toHex(A[0] + (B[0] - A[0]) * t)}${toHex(A[1] + (B[1] - A[1]) * t)}${toHex(A[2] + (B[2] - A[2]) * t)}`;
}

export function resolvePalette({ brand, night } = {}) {
  const base = night ? NIGHT : DAY;
  const tone = night ? 'night' : 'day';
  const acc = (brand && BRAND_ACCENTS[brand]) || MASTER;
  const accent = acc[tone];
  // Day: a pastel of the accent (soft light on Paper). Night: the accent's light step, lifted slightly toward Paper.
  const glow = night ? mix(accent, '#F4F3EF', 0.12) : mix(accent, '#FFFFFF', 0.45);
  return { ...base, accent, glow };
}

/** CSS custom properties for the static (SSR / no-JS) fallback background. Deterministic per props. */
/**
 * Geometry of the static gradient (shared by the CSS fallback and the canvas "no variant" frame), in percent.
 * g = the soft accent light, h = the secondary (cool) light. Deterministic per seed.
 */
export function fallbackGeometry(seed = 1) {
  const s = hashSeed(seed) % 100000;
  const fx = (k) => (((Math.sin(s * 12.9898 + k * 78.233) * 43758.5453) % 1) + 1) % 1;
  const gx = 18 + Math.round(fx(1) * 64);
  const gy = 14 + Math.round(fx(2) * 52);
  const clamp = (v) => Math.max(8, Math.min(92, v));
  const hx = clamp(100 - gx + Math.round((fx(3) - 0.5) * 20));
  const hy = clamp(100 - gy + Math.round((fx(4) - 0.5) * 20));
  return { gx, gy, hx, hy };
}

/** Alphas of the static gradient lights (shared by CSS and canvas). */
export function fallbackAlphas(night) {
  return night ? { glow: 0.22, glow2: 0.14 } : { glow: 0.42, glow2: 0.9 };
}

/** The secondary light colour of the static gradient. */
export function fallbackGlow2(palette, night) {
  return night ? palette.lagoon : palette.ground2;
}

/** CSS custom properties for the static (SSR / no-JS) fallback background. Deterministic per props. */
export function fallbackVars(palette, seed = 1, night = false) {
  const { gx, gy, hx, hy } = fallbackGeometry(seed);
  const a = fallbackAlphas(night);
  return {
    '--mv-ground': palette.ground,
    '--mv-ground2': palette.ground2,
    '--mv-glow': rgba(palette.glow, a.glow),
    '--mv-glow2': rgba(fallbackGlow2(palette, night), a.glow2),
    '--mv-gx': `${gx}%`,
    '--mv-gy': `${gy}%`,
    '--mv-hx': `${hx}%`,
    '--mv-hy': `${hy}%`,
  };
}

/** FNV-1a 32-bit hash for string seeds. */
export function hashSeed(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v >>> 0;
  const str = String(v ?? '');
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
