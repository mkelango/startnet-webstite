// Page-local facet helpers shared by /programmes and /events (Book 1 Part B §10, Book 3 C35).
// Filter state lives in the URL: short, stable params, multiple values comma-separated.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Normalise one facet's raw URL values (F-68). `allowed` is the vocabulary for that key:
 *  - an array of canonical values: matched case-insensitively ("Vibe" -> "vibe"), anything else is dropped;
 *  - a function (value) => canonical value | falsy: lets a page accept open sets (e.g. any non-empty district);
 *  - undefined/null: values are kept as typed (trimmed).
 * Duplicates are removed.
 */
function normalise(list, allowed) {
  let out = list;
  if (Array.isArray(allowed)) {
    out = list.map((v) => allowed.find((a) => String(a).toLowerCase() === v.toLowerCase())).filter(Boolean);
  } else if (typeof allowed === 'function') {
    out = list.map((v) => allowed(v)).filter(Boolean);
  }
  return [...new Set(out)];
}

/**
 * Read/write a fixed set of facet params from the URL.
 * @param keys  facet param names
 * @param vocab optional { key: string[] | (value) => canonical | null } — values outside it are dropped and the
 *              URL is rewritten (replace: true) so the address bar matches what is applied.
 */
export function useFacetParams(keys, vocab) {
  const [params, setParams] = useSearchParams();
  const sig = keys.join('|');
  const vocabRef = useRef(vocab);
  vocabRef.current = vocab;
  const values = useMemo(() => {
    const out = {};
    keys.forEach((k) => {
      const raw = params.get(k);
      const list = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
      out[k] = normalise(list, vocabRef.current?.[k]);
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, sig]);

  // Keep the URL in step with what is applied: lower-cased, unknown values removed.
  useEffect(() => {
    if (!vocabRef.current) return;
    let dirty = false;
    keys.forEach((k) => {
      const raw = params.get(k);
      if (raw == null) return;
      const want = values[k].join(',');
      if (raw !== want) dirty = true;
    });
    if (!dirty) return;
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        keys.forEach((k) => {
          if (next.get(k) == null) return;
          if (values[k].length) next.set(k, values[k].join(','));
          else next.delete(k);
        });
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const update = useCallback(
    (mutate) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          return next;
        },
        { replace: true, preventScrollReset: true }
      ),
    [setParams]
  );

  const setFacet = useCallback(
    (key, arr) => update((n) => (arr && arr.length ? n.set(key, arr.join(',')) : n.delete(key))),
    [update]
  );

  const toggle = useCallback(
    (key, value, single = false) => {
      const cur = values[key] || [];
      const on = cur.includes(value);
      const next = single ? (on ? [] : [value]) : on ? cur.filter((v) => v !== value) : [...cur, value];
      setFacet(key, next);
    },
    [values, setFacet]
  );

  const clear = useCallback(() => update((n) => keys.forEach((k) => n.delete(k))), [update, sig]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Replace every facet at once: setMany({ format: ['online'] }) clears the rest. */
  const setMany = useCallback(
    (obj) =>
      update((n) => {
        keys.forEach((k) => n.delete(k));
        Object.entries(obj).forEach(([k, arr]) => arr && arr.length && n.set(k, arr.join(',')));
      }),
    [update, sig] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setParam = useCallback((key, val) => update((n) => (val ? n.set(key, val) : n.delete(key))), [update]);

  const activeCount = keys.reduce((n, k) => n + (values[k]?.length || 0), 0);
  // A stable key that changes whenever any facet changes (used to reset paging).
  const signature = keys.map((k) => `${k}=${(values[k] || []).join(',')}`).join('&');

  return { values, params, setFacet, setMany, toggle, clear, setParam, activeCount, signature };
}

/** Does an item pass every active facet (optionally skipping one, for faceted counts)? */
export function matchesAll(item, values, preds, skip) {
  return Object.keys(preds).every(
    (k) => k === skip || !values[k] || !values[k].length || values[k].some((v) => preds[k](item, v))
  );
}

/** How many items would match if `value` were the selection for `key`, given the other active facets. */
export function facetCount(items, values, preds, key, value) {
  let n = 0;
  for (const it of items) if (matchesAll(it, values, preds, key) && preds[key](it, value)) n += 1;
  return n;
}

/** Client-side paging with "Load more"; moves focus to the first new item (Book 3 C37). */
export function usePaged(items, resetKey, size = 24) {
  const [limit, setLimit] = useState(size);
  const gridRef = useRef(null);
  const pendingFocus = useRef(null);
  useEffect(() => setLimit(size), [resetKey, size]);
  const visible = useMemo(() => items.slice(0, limit), [items, limit]);
  useEffect(() => {
    if (pendingFocus.current == null || !gridRef.current) return;
    const idx = pendingFocus.current;
    pendingFocus.current = null;
    const el = gridRef.current.querySelector(`[data-result-index="${idx}"]`);
    const target = el && (el.querySelector('a, button') || el);
    if (target) {
      if (target === el) el.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: false });
    }
  }, [visible.length]);
  const more = () => {
    pendingFocus.current = limit;
    setLimit((l) => l + size);
  };
  return { visible, shown: visible.length, total: items.length, more, gridRef };
}

/** "madurai" / "kanniyakumari-district" → "Madurai" / "Kanniyakumari District" (leaves proper-case strings alone). */
const WORDS = { genai: 'GenAI', saas: 'SaaS', d2c: 'D2C', ai: 'AI', gcc: 'GCC', to: 'to', of: 'of', and: 'and' };
export function labelize(s) {
  if (!s || typeof s !== 'string') return s;
  if (/[A-Z]/.test(s) || /\s/.test(s)) return s;
  return s
    .split('-')
    .map((w, i) => (WORDS[w] && (i > 0 || WORDS[w] !== w) ? WORDS[w] : w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** True for seeded placeholder values such as "To be confirmed" or "[placeholder — …]". */
export const isPlaceholderValue = (s) => typeof s === 'string' && (/\[[^\]]*\]/.test(s) || /to be confirmed/i.test(s));

/** Unique, sorted values for a field across items. */
export function uniqueValues(items, get) {
  const set = new Set();
  items.forEach((it) => {
    const v = get(it);
    (Array.isArray(v) ? v : [v]).forEach((x) => x && set.add(x));
  });
  return [...set].sort((a, b) => String(a).localeCompare(String(b)));
}
