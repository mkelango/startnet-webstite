// "Accepting applications" helpers shared by /programmes/open-calls and the search zero-results state.
// The source of truth is programmeMeta (ACCEPTING, sortCalls). A namespace import keeps this module
// working before those exports exist: the inline fallbacks below mirror the same rules.
import * as programmeMeta from '../programmes/parts/programmeMeta.js';

const FALLBACK_ACCEPTING = ['closing', 'open', 'rolling'];
const FALLBACK_ORDER = { closing: 0, open: 1, rolling: 2 };

function fallbackSort(list) {
  return [...list].sort((a, b) => {
    const s = (FALLBACK_ORDER[a.status] ?? 9) - (FALLBACK_ORDER[b.status] ?? 9);
    if (s) return s;
    // Soonest apply-by first; programmes without a date go last within their status.
    const da = a.applyBy ? Date.parse(a.applyBy) : Infinity;
    const db = b.applyBy ? Date.parse(b.applyBy) : Infinity;
    if (da !== db) return (Number.isNaN(da) ? Infinity : da) - (Number.isNaN(db) ? Infinity : db);
    return String(a.title || '').localeCompare(String(b.title || ''));
  });
}

/** Statuses that count as "accepting applications". */
export const ACCEPTING = Array.isArray(programmeMeta.ACCEPTING) && programmeMeta.ACCEPTING.length
  ? programmeMeta.ACCEPTING
  : FALLBACK_ACCEPTING;

/** Closing soon first, then open, then rolling; soonest apply-by first within a status. Returns a new array. */
export function sortCalls(list) {
  const arr = Array.isArray(list) ? list : [];
  if (typeof programmeMeta.sortCalls === 'function') {
    try {
      const out = programmeMeta.sortCalls(arr);
      if (Array.isArray(out)) return out;
    } catch { /* fall through */ }
  }
  return fallbackSort(arr);
}

/** Accepting programmes from an API list, sorted. */
export const acceptingCalls = (data) =>
  sortCalls((Array.isArray(data) ? data : []).filter((p) => p && ACCEPTING.includes(p.status)));

/** API path that returns every accepting programme (the server also accepts a comma list). */
export const ACCEPTING_URL = `/api/programmes?status=${ACCEPTING.join(',')}`;
