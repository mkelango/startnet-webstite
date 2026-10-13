// Route-change housekeeping (Book 4 IX-05 a11y): scroll to top (or to the #hash target),
// move focus to the page <h1> (tabIndex -1) and announce the new title in a polite live region.
// Back/Forward (POP) restores the scroll position saved for that history entry instead, and leaves focus alone.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { stopSmoothScroll, jumpTo, syncSmoothScroll, hashGlideActive, hashGlideOrigin } from '../lib/smoothScroll.js';

const WAIT_MS = 2500; // lazy pages may take a moment to mount
const RESTORE_MS = 1000; // keep retrying a restore while the page grows
const SETTLE_MS = 1000; // keep a #hash target docked while sections above it mount
const STORE_KEY = 'sn-scroll';

function waitFor(find, cb) {
  const start = performance.now();
  let raf = 0;
  let timer = 0;
  const tick = () => {
    const el = find();
    if (el) { cb(el); return; }
    if (performance.now() - start > WAIT_MS) { cb(null); return; }
    timer = window.setTimeout(() => { raf = requestAnimationFrame(tick); }, 50);
  };
  raf = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
}

// Suspense keeps the previous page mounted but hidden while the next one loads: skip hidden h1s.
const visibleH1 = () => [...document.querySelectorAll('main h1')].find((h) => h.getClientRects().length > 0);

function readPositions() {
  try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}') || {}; } catch { return {}; }
}
function savePosition(key, y) {
  if (!key) return;
  try {
    const all = readPositions();
    all[key] = Math.round(y);
    const keys = Object.keys(all);
    if (keys.length > 60) keys.slice(0, keys.length - 60).forEach((k) => { delete all[k]; });
    sessionStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch { /* storage blocked: Back lands at the top */ }
}

/** Scroll to y once the document is tall enough, retrying for up to RESTORE_MS while lazy content mounts. */
function restoreTo(y) {
  const start = performance.now();
  let raf = 0;
  let cancelled = false;
  const stop = () => { cancelled = true; cancelAnimationFrame(raf); window.removeEventListener('wheel', stop); window.removeEventListener('touchstart', stop); window.removeEventListener('keydown', stop); };
  // The user taking over (wheel, touch, keys) ends the restore.
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop);
  const tick = () => {
    if (cancelled) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    jumpTo(Math.min(y, Math.max(0, max)));
    const done = Math.abs(window.scrollY - y) < 2 || performance.now() - start > RESTORE_MS;
    if (done) { stop(); return; }
    raf = requestAnimationFrame(tick);
  };
  tick();
  return stop;
}

/** decodeURIComponent that never throws: a malformed hash (#100%, #%E0%A4) is used as typed. */
function safeDecode(raw) {
  try { return decodeURIComponent(raw); } catch { return raw; }
}

/** Where scrollIntoView({ block: 'start' }) puts an element: the root's scroll-padding-top. */
function dockOffset() {
  const v = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(v) ? v : 0;
}

/**
 * After a hash jump, re-check the target every frame for SETTLE_MS and re-dock it when content above it
 * mounts or resizes (drift > 4 px). The user taking over (wheel, touch, keys) ends it.
 */
function settleOn(el) {
  const start = performance.now();
  let raf = 0;
  let stopped = false;
  const stop = () => {
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchstart', stop);
    window.removeEventListener('keydown', stop);
  };
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop);
  const tick = () => {
    if (stopped) return;
    if (!el.isConnected || performance.now() - start > SETTLE_MS) { stop(); return; }
    const drift = el.getBoundingClientRect().top - dockOffset();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // Re-dock unless the page simply cannot scroll further (target near the end).
    if (Math.abs(drift) > 4 && !(drift > 0 && window.scrollY >= max - 1)) {
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      syncSmoothScroll();
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return stop;
}

export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  // True until the first navigation inside this document. A ref flipped only when the history key changes, so
  // StrictMode's double-run of the effects in development still sees the initial load (a `first` flag cleared by
  // the first run made the re-run treat the load as Back/Forward and restore a stale position over the #hash).
  const navigated = useRef(false);
  const keyRef = useRef(key);
  const lastY = useRef(0);
  const prevPath = useRef(pathname);
  const [message, setMessage] = useState('');

  // Let the browser keep its own restoration off: we manage it.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  // Remember the scroll position of the current history entry (throttled, and on page hide).
  useEffect(() => {
    let timer = 0;
    lastY.current = window.scrollY;
    const onScroll = () => {
      lastY.current = window.scrollY;
      if (timer) return;
      timer = window.setTimeout(() => { timer = 0; savePosition(keyRef.current, window.scrollY); }, 150);
    };
    const onHide = () => savePosition(keyRef.current, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', onHide);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); window.removeEventListener('pagehide', onHide); };
  }, []);

  // At commit of the next entry (before any scroll reset), store the leaving entry's last position. A new page (a
  // link, not Back/Forward, no #target) then starts at the top in this same commit, before the browser paints it, so it
  // never shows for a frame at the old page's scroll position.
  useLayoutEffect(() => {
    if (keyRef.current !== key) {
      // A #glide has already moved the page by the time this commits: Back should return to where it started.
      savePosition(keyRef.current, hashGlideActive(hash) ? hashGlideOrigin() : lastY.current);
      keyRef.current = key;
      navigated.current = true;
      if (navType !== 'POP' && !hash && prevPath.current !== pathname) {
        stopSmoothScroll();
        jumpTo(0);
        lastY.current = 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Hash targets (also on first load and same-page hash links). Back/Forward restores instead.
  useEffect(() => {
    if (!hash || (navType === 'POP' && navigated.current && readPositions()[key] != null)) return undefined;
    // A same-page #link click is already gliding there (lib/smoothScrollBoot.js) and moves focus when it lands.
    if (hashGlideActive(hash)) return undefined;
    const id = safeDecode(hash.slice(1));
    if (!id) return undefined;
    let stopSettle = null;
    const stopWait = waitFor(() => document.getElementById(id), (el) => {
      if (!el) return;
      stopSmoothScroll();
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      syncSmoothScroll();
      if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
      // Sections above the target may still be mounting (lazy pages, images, fonts): keep it docked for ~1 s.
      stopSettle = settleOn(el);
    });
    return () => { stopWait(); stopSettle?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, key]);

  // Path changes: top of page, focus the h1, announce the title. Back/Forward: restore the saved position.
  // (Query/hash-only changes on the same path keep the position; the hash effect handles #targets.)
  useEffect(() => {
    if (!navigated.current) { prevPath.current = pathname; return undefined; }
    const pathChanged = prevPath.current !== pathname;
    prevPath.current = pathname;
    if (!pathChanged && hashGlideActive(hash)) return undefined;
    const saved = navType === 'POP' ? readPositions()[key] : undefined;
    let stopRestore = null;
    stopSmoothScroll();
    if (saved != null) stopRestore = restoreTo(saved);
    else if (!hash && pathChanged) jumpTo(0);
    if (!pathChanged) return () => stopRestore?.();
    const stopWait = waitFor(visibleH1, (h1) => {
      if (h1 && !hash && saved == null) {
        if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
        h1.classList.add('shell-focus-target');
        h1.focus({ preventScroll: true });
      }
      // Seo sets document.title in an effect; read it on the next frame.
      requestAnimationFrame(() => {
        const title = document.title || h1?.textContent || '';
        setMessage('');
        window.setTimeout(() => setMessage(title), 60);
      });
    });
    return () => { stopWait(); stopRestore?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
