// Prerendered snapshot hand-over (see main.jsx and tools/seo/prerender.mjs). The server sends the finished page in
// #sn-prerender; the live app renders invisibly into #root (.is-prerender-pending) and then replaces it. The live
// copy is new DOM, so anything that animates on mount would play a second time at the swap. These helpers let the
// live copy start at the state the snapshot already shows.
//
// FROM_SNAPSHOT is decided when this module is first evaluated, before React renders (the snapshot is in the HTML).
// It also marks <html data-from-snapshot>; CSS uses that to drop the hero entrance animations in #root for the
// first page, and SiteLayout removes it on the first client-side navigation so later page heroes still animate.
const doc = typeof document !== 'undefined' ? document : null;

export const FROM_SNAPSHOT = !!doc?.getElementById('sn-prerender');
if (FROM_SNAPSHOT) doc.documentElement.setAttribute('data-from-snapshot', '');

/** True while the live app is still rendering behind the snapshot (nothing it paints is visible yet). */
export function snapshotPending() {
  return !!doc?.getElementById('root')?.classList.contains('is-prerender-pending');
}

/** First client-side route change: entrances animate normally from here on. */
export function endSnapshotEntrance() {
  doc?.documentElement.removeAttribute('data-from-snapshot');
}
