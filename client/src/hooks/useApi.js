import { useEffect, useState } from 'react';

// Resolved responses, keyed by path.
const cache = new Map();
// In-flight requests, keyed by path, so concurrent callers share one fetch.
const inflight = new Map();

function load(path) {
  if (inflight.has(path)) return inflight.get(path);
  const p = fetch(path, { headers: { Accept: 'application/json' } })
    // Read the body of an error response too: an unread 404 body keeps the connection busy, so the page never
    // reaches network idle (audit tools time out on /events/<unknown> and /programmes/<unknown>).
    .then((r) => {
      if (r.ok) return r.json();
      const err = new Error(`${r.status} ${r.statusText}`);
      return r.text().then(() => Promise.reject(err), () => Promise.reject(err));
    })
    .then((data) => {
      cache.set(path, data);
      return data;
    })
    .finally(() => {
      inflight.delete(path);
    });
  inflight.set(path, p);
  return p;
}

const initial = (path) =>
  path && cache.has(path)
    ? { path, data: cache.get(path), loading: false, error: null }
    : { path, data: null, loading: !!path, error: null };

/** GET /api/... with an in-memory cache. Returns { data, loading, error }. */
export function useApi(path) {
  const [state, setState] = useState(() => initial(path));

  useEffect(() => {
    // Each set below keeps the current state object when it already says the same thing, so the first mount
    // (whose initial state is already right) does not re-render the whole page once more for nothing (F-14).
    if (!path) {
      setState((s) => (s.path === path && !s.loading && s.data === null && s.error === null ? s : { path, data: null, loading: false, error: null }));
      return undefined;
    }
    if (cache.has(path)) {
      const data = cache.get(path);
      setState((s) => (s.path === path && s.data === data && !s.loading && s.error === null ? s : { path, data, loading: false, error: null }));
      return undefined;
    }
    let alive = true;
    setState((s) => (s.path === path && s.loading && s.data === null && s.error === null ? s : { path, data: null, loading: true, error: null }));
    load(path)
      .then((data) => {
        if (alive) setState({ path, data, loading: false, error: null });
      })
      .catch((error) => {
        if (alive) setState({ path, data: null, loading: false, error });
      });
    return () => {
      alive = false;
    };
  }, [path]);

  // Never show the previous record for a frame after the path changes.
  if (state.path !== path) {
    if (!path) return { data: null, loading: false, error: null };
    if (cache.has(path)) return { data: cache.get(path), loading: false, error: null };
    return { data: null, loading: true, error: null };
  }
  return { data: state.data, loading: state.loading, error: state.error };
}

/**
 * POST JSON to /api/forms/:type. Resolves to the server's JSON, or throws an Error carrying
 * .fieldErrors, .status (HTTP status) and .body (parsed response body).
 */
export async function postForm(type, payload) {
  const r = await fetch(`/api/forms/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(body.message || 'Something went wrong');
    e.fieldErrors = body.fieldErrors;
    e.status = r.status;
    e.body = body;
    throw e;
  }
  return body;
}
