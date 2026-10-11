/*
 * Motion-visual registry.
 *
 * Variants live in ./variants/<name>.js (default export { name, init, frame, staticT }). They are discovered with
 * import.meta.glob (lazy: one chunk per variant, loaded on demand), so a variant file that does not exist yet simply
 * is not in the map: it never breaks the dev server or the build. loadVariant() falls back to 'aurora', and resolves
 * null when even that is missing (the core then paints only the static gradient).
 */

const MODULES = import.meta.glob('./variants/*.js');

export const ALL_KINDS = ['aurora', 'ripples', 'blob', 'flow', 'sphere', 'terrain', 'orbits', 'trajectory', 'panels'];
// Kinds picked automatically for decorative slots (components/ArtImage.jsx). 'sphere' is a stippled globe: it stays
// available by explicit `kind`, but is left out of the automatic rotation (user feedback: no dot-field visuals).
// 'trajectory' redraws itself in a loop (part of each cycle is nearly empty), so it serves cards, not heroes.
export const HERO_KINDS = ['aurora', 'flow', 'orbits', 'terrain', 'blob', 'panels'];
export const CARD_KINDS = ['aurora', 'flow', 'orbits', 'ripples', 'trajectory', 'panels', 'blob', 'terrain'];
export const FALLBACK_KIND = 'aurora';

const cache = new Map();

function isVariant(v) {
  return !!v && typeof v === 'object' && typeof v.frame === 'function';
}

function importVariant(name) {
  if (cache.has(name)) return cache.get(name);
  const loader = MODULES[`./variants/${name}.js`];
  const p = loader
    ? loader()
        .then((m) => (isVariant(m?.default) ? m.default : null))
        .catch((err) => {
          if (import.meta.env?.DEV) console.warn(`[motion-visuals] variant "${name}" failed to load`, err);
          cache.delete(name); // allow a retry after an HMR fix
          return null;
        })
    : Promise.resolve(null);
  cache.set(name, p);
  return p;
}

/** name → () => Promise<variant | null>, for every known kind (lazy dynamic import). */
export const VARIANTS = Object.freeze(Object.fromEntries(ALL_KINDS.map((n) => [n, () => importVariant(n)])));

/** True when a variant file for `name` exists in this build. */
export function hasVariant(name) {
  return !!MODULES[`./variants/${name}.js`];
}

/** Names whose files exist in this build. */
export function availableKinds() {
  return Object.keys(MODULES)
    .map((k) => k.replace('./variants/', '').replace(/\.js$/, ''))
    .filter((n) => !n.startsWith('_'));
}

/**
 * Resolve a variant with fallback: requested → 'aurora' → null.
 * @returns {Promise<{ name: string, variant: object, fallback: boolean } | null>}
 */
export async function loadVariant(name) {
  const want = name || FALLBACK_KIND;
  const v = await importVariant(want);
  if (v) return { name: want, variant: v, fallback: false };
  if (want !== FALLBACK_KIND) {
    const f = await importVariant(FALLBACK_KIND);
    if (f) return { name: FALLBACK_KIND, variant: f, fallback: true };
  }
  return null;
}

/** Start fetching a variant chunk early (e.g. on hover/idle). */
export function preloadVariant(name) {
  importVariant(name);
}
