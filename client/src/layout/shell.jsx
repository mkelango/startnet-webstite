// Shared shell state + small helpers used only inside client/src/layout/.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BRANDS } from '../data/brands.js';
import { snxLink, SIGNIN_URL } from '../lib/links.js';

const ShellContext = createContext(null);

export function ShellProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [consentRequest, setConsentRequest] = useState(0); // bump to reopen the banner
  const [consentVisible, setConsentVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null); // id of the open mega menu
  // Page-published primary CTA for the bottom bar: { label, labelTa?, shortLabel?, shortLabelTa?, to?, href?, brand? }.
  // Pages call setPageCta(cta) in an effect and setPageCta(null) on unmount.
  const [pageCta, setPageCta] = useState(null);
  const returnFocus = useRef(null);

  const openSearch = useCallback(() => {
    returnFocus.current = document.activeElement;
    setDrawerOpen(false);
    setMenuOpen(null);
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openDrawer = useCallback(() => {
    returnFocus.current = document.activeElement;
    setDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openConsent = useCallback(() => setConsentRequest((n) => n + 1), []);

  const value = useMemo(
    () => ({
      drawerOpen, openDrawer, closeDrawer,
      searchOpen, openSearch, closeSearch,
      consentRequest, openConsent, consentVisible, setConsentVisible,
      menuOpen, setMenuOpen,
      pageCta, setPageCta,
      returnFocus,
    }),
    [drawerOpen, openDrawer, closeDrawer, searchOpen, openSearch, closeSearch, consentRequest, openConsent, consentVisible, menuOpen, pageCta]
  );
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export const useShell = () => useContext(ShellContext);

/**
 * Pages publish their own primary CTA to the bottom bar (e.g. Apply / Register on a programme or event page).
 * Pass a stable object (or null); it is cleared on unmount.
 */
export function usePageCta(cta) {
  const shell = useContext(ShellContext);
  const set = shell?.setPageCta;
  const json = cta ? JSON.stringify(cta) : '';
  useEffect(() => {
    if (!set) return undefined;
    set(json ? JSON.parse(json) : null);
    return () => set(null);
  }, [set, json]);
}

/**
 * The search overlay is code-split (Book 1 Part B §3.6: search loads on open). Hover/focus on the search button
 * warms the chunk; SiteLayout mounts it on the first open. Repeated calls share one promise.
 */
let searchChunk = null;
export const loadSearch = () => {
  if (!searchChunk) searchChunk = import('./SearchOverlay.jsx').catch((err) => { searchChunk = null; throw err; });
  return searchChunk;
};
export const preloadSearch = () => { loadSearch().catch(() => {}); };

/** Global search shortcuts: "/" (outside text fields) and Ctrl/⌘+K. Lives in the shell so they work before the overlay loads. */
export function useSearchShortcuts(open) {
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target;
      const typing = el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); open(); return; }
      if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); open(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
}

/** Width at which the desktop nav (triggers + mega menus) replaces the drawer. Tamil labels need more room. */
export const desktopNavQuery = (lang) => (lang === 'ta' ? '(min-width: 1280px)' : '(min-width: 1024px)');

/** matchMedia hook (SSR-safe). */
export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [query]);
  return match;
}

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const focusablesIn = (root) =>
  root ? [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement) : [];

/**
 * Modal focus management: traps Tab inside `ref`, closes on Esc, makes `inertTargets` inert,
 * locks page scroll, and returns focus to `returnTo` when deactivated.
 */
export function useModal(ref, active, { onClose, initialFocus, returnTo, inertSelector = '[data-shell-page]' } = {}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!active) return undefined;
    const root = ref.current;
    const previous = returnTo?.current || document.activeElement;
    const page = document.querySelector(inertSelector);
    page?.setAttribute('inert', '');
    page?.setAttribute('aria-hidden', 'true');
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    // Lets fixed chrome (bottom CTA bar) step aside while any modal sheet is open.
    const modalDepth = Number(html.dataset.modalOpen || 0) + 1;
    html.dataset.modalOpen = String(modalDepth);

    const focusFirst = () => {
      const target = (initialFocus?.current) || focusablesIn(root)[0] || root;
      target?.focus?.({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCloseRef.current?.(); return; }
      if (e.key !== 'Tab' || !root) return;
      const items = focusablesIn(root);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey, true);
      page?.removeAttribute('inert');
      page?.removeAttribute('aria-hidden');
      html.style.overflow = prevOverflow;
      const depth = Number(html.dataset.modalOpen || 1) - 1;
      if (depth > 0) html.dataset.modalOpen = String(depth); else delete html.dataset.modalOpen;
      if (previous && document.contains(previous)) previous.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

/** The brand whose folder the (language-stripped) path sits in, or null. */
export function brandForPath(basePath) {
  const hit = Object.values(BRANDS).find((b) => basePath === b.base || basePath.startsWith(`${b.base}/`));
  return hit ? hit.key : null;
}

/**
 * Pages shown with the minimal header (Book 3 C02 `minimal`): campaign landings and the SNX sign-in/sign-up
 * hand-offs (Book 1 Part B §3.7, §6.4). `basePath` is the language-stripped path.
 */
export function isMinimalPath(basePath = '') {
  return basePath === '/signin' || basePath === '/signup' || basePath.startsWith('/go/');
}

/** Strip the query/hash from a nav target. */
export const pathOf = (to = '') => to.split(/[?#]/)[0];

/** Header sign-in: the StartNet platform (SIGNIN_URL). Arguments are kept so call sites stay unchanged. */
// eslint-disable-next-line no-unused-vars
export function signInHref(lang = 'en', src) {
  return SIGNIN_URL;
}

/** href for a brand CTA stored as { snx: '/signup' } (StartNet X) — carries src, brand and lang. */
export function brandCtaHref(cta, brandKey, lang, src = 'subnav-x') {
  if (!cta?.snx) return cta?.href;
  return snxLink(cta.snx, { src, brand: brandKey, lang });
}

/** Pick the first metric whose key or label matches any pattern. */
export function findMetric(list, patterns) {
  if (!Array.isArray(list)) return null;
  for (const re of patterns) {
    const hit = list.find((m) => re.test(m.key || '') || re.test(m.id || ''));
    if (hit) return hit;
  }
  for (const re of patterns) {
    const hit = list.find((m) => re.test(m.label || ''));
    if (hit) return hit;
  }
  return null;
}

/** Page-context ref for WhatsApp prefill, e.g. "vibe-vibathon, ta" (Book 1 Part B §3.4). */
export function waRef(basePath, lang) {
  const slug = basePath.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';
  return `${slug}, ${lang}`;
}
