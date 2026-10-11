// C05 · Bottom sticky CTA bar (Book 1 Part B §3.4, Book 4 IX-03). < 1024 px only.
// One context-aware primary button + a WhatsApp icon button. Hidden while the drawer or search is open,
// while a form field has focus, while the consent banner is up, and while an on-page primary CTA
// (any element marked [data-primary-cta], or a hero action row) is in view, so the CTA is never shown twice.
// A hero CTA still below the fold also holds the bar back: it appears once the hero's actions have scrolled away.
// CTA choice: the page's own CTA (setPageCta / usePageCta in shell.jsx), else the mega-page CTA (megaCtas.js), else the section CTA (brand CTA with its
// per-path `byPath` override from data/brands.js), else Join StartNet. A candidate that links to the page you are on
// is skipped in favour of the next one, so brand conversion pages (e.g. /vibe/vibathon) still get a bar.
// The bar is not shown on form pages (/join, /partner/enquire, /contact: Book 3 T13).
// Icon follows the target: ArrowUpRight for off-site links (StartNet X, WhatsApp…), ArrowRight for on-site links;
// a CTA may name its own icon with `icon: 'whatsapp' | 'external' | 'arrow' | 'download'` (strings survive usePageCta).
// When the CTA itself is a wa.me link, the separate WhatsApp bubble is not repeated.
// English labels that would truncate fall back to the CTA's shortLabel at any width (useLabelOverflow).
// Small screens (≤ 360 × 700): while scrolling down past a stuck page-level sticky bar, the bar tucks away; it
// returns on scroll up and near the end of the page. Its measured height is published as --bottom-cta-h.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Download, MessageCircle } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { brandCtaFor } from '../data/brands.js';
import { megaCtaFor } from './megaCtas.js';
import { JOIN } from '../data/nav.js';
import { Button, WhatsAppButton } from '../components';
import { brandCtaHref, brandForPath, pathOf, useMediaQuery, useShell, waRef } from './shell.jsx';
import './BottomCtaBar.css';

const FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, select, [contenteditable="true"]';

const FORM_PAGES = ['/join', '/partner/enquire', '/contact', '/events/speak'];
const isFormPage = (basePath) => FORM_PAGES.some((p) => basePath === p || basePath.startsWith(`${p}/`));
// The SNX sign-in/sign-up hand-offs (minimal shell) have one CTA of their own ("Continue to sign in"): no bar there.
const HANDOFF_PAGES = ['/signin', '/signup'];

const ICONS = { whatsapp: MessageCircle, external: ArrowUpRight, arrow: ArrowRight, download: Download };
const isWhatsApp = (href = '') => /^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(href);
const isOffSite = (href = '') => /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?startnet\.in(\/|$|\?|#)/i.test(href);

/** Section CTA for a (language-stripped) path, before the self-link check. */
function sectionCta(basePath) {
  const brand = brandForPath(basePath);
  if (brand) return { ...brandCtaFor(brand, basePath), brand };
  if (basePath === '/partner' || basePath.startsWith('/partner/')) {
    return { label: 'Start an enquiry', labelTa: 'விசாரணையைத் தொடங்குங்கள்', shortLabel: 'Enquire', shortLabelTa: 'விசாரிக்க', to: '/partner/enquire' };
  }
  if (basePath === '/insights/founder-ledger/corrections') {
    return { label: 'Report a correction', labelTa: 'திருத்தத்தைத் தெரிவியுங்கள்', shortLabel: 'Report a correction', shortLabelTa: 'திருத்தம் தெரிவி', to: '/contact?topic=correction' };
  }
  if (basePath.startsWith('/insights/founder-ledger')) {
    return { label: 'Report a correction', labelTa: 'திருத்தத்தைத் தெரிவியுங்கள்', shortLabel: 'Report a correction', shortLabelTa: 'திருத்தம் தெரிவி', to: '/insights/founder-ledger/corrections' };
  }
  return null;
}

/** Final CTA for this page, or null when the bar should not show. */
function resolveCta(basePath, pageCta, lang) {
  if (isFormPage(basePath) || HANDOFF_PAGES.includes(basePath)) return null;
  const candidates = [pageCta, megaCtaFor(basePath), sectionCta(basePath), JOIN].filter(Boolean);
  for (const cta of candidates) {
    const href = cta.snx ? brandCtaHref(cta, cta.brand, lang, 'bottom-bar') : cta.href;
    const to = href ? undefined : cta.to;
    if (!href && !to) continue;
    // Never link to the page you are on: fall through to the next candidate.
    if (to && pathOf(to) === basePath && !to.includes('#')) continue;
    return { ...cta, to, href };
  }
  return null;
}

/** Publishes the bar's height as --bottom-cta-h on :root while it is shown. */
function useBarHeight(ref, shown) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    // Keep the last measured value while the bar is briefly hidden, so the page padding does not jump.
    if (!shown || !el) return undefined;
    const set = () => root.style.setProperty('--bottom-cta-h', `${Math.ceil(el.getBoundingClientRect().height)}px`);
    // ResizeObserver reports the size in its first callback; measuring here as well would force a synchronous
    // layout during the first render (F-14). Measure directly only where ResizeObserver is missing.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(set) : null;
    if (ro) ro.observe(el);
    else set();
    return () => { ro?.disconnect(); };
  }, [ref, shown]);
}

/**
 * English labels stay on one line, so a long label can truncate ("Get the report when it's …") on phones wider than
 * the 360 px short-label breakpoint. True while the full label overflows the button; the bar then shows shortLabel.
 * Re-checked whenever the label or the bar width changes (the full label is rendered again first, then measured).
 */
function useLabelOverflow(ref, labelKey, active) {
  const [width, setWidth] = useState(0);
  const [overflowKey, setOverflowKey] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!active || !el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, active]);
  const key = `${labelKey}|${width}`;
  useLayoutEffect(() => {
    if (!active || overflowKey === key) return;
    const label = ref.current?.querySelector('.button__label');
    if (label && label.scrollWidth > label.clientWidth + 1) setOverflowKey(key);
  });
  return active && overflowKey === key;
}

function useFieldFocus() {
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const onIn = (e) => setFocused(!!e.target.closest?.(FIELD));
    const onOut = () => setFocused(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => { document.removeEventListener('focusin', onIn); document.removeEventListener('focusout', onOut); };
  }, []);
  return focused;
}

// On-page primary CTAs: anything marked [data-primary-cta], plus hero action rows that predate the marker.
const PRIMARY_CTA = 'main [data-primary-cta], main [class*="hero__actions"], main [class*="hero-actions"]';

/**
 * True while an on-page primary CTA makes the bar redundant: any primary CTA in view, or a hero CTA that the
 * reader has not scrolled past yet (still below the fold on a tall Tamil hero at 320 px). So the bar first appears
 * once the hero's own actions have scrolled away, and never flashes in and out above them on first view.
 */
function usePrimaryCtaInView(pathname) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    setInView(false);
    // Measured from the live rects on scroll/resize (not from IntersectionObserver crossings), so a jump straight
    // from the page end to the top (scroll restoration, "back to top", anchors) can never leave a stale state.
    let tracked = [];
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      setInView(tracked.some(({ el, hero }) => {
        if (!el.isConnected) return false;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return false;
        return (r.bottom > 0 && r.top < vh) || (hero && r.top >= vh);
      }));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };
    const collect = () => {
      tracked = [...document.querySelectorAll(PRIMARY_CTA)]
        // Nested matches (a marked button inside a hero action row) are covered by their container.
        .filter((el) => !el.parentElement?.closest(PRIMARY_CTA))
        .map((el) => ({ el, hero: !!el.closest('[class*="hero"]') }));
      schedule();
    };
    collect();
    // Pages are lazy: pick up CTAs that mount (or leave) after the route change.
    const main = document.getElementById('main');
    const mo = main ? new MutationObserver(collect) : null;
    mo?.observe(main, { childList: true, subtree: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      mo?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);
  return inView;
}

/**
 * Small screens only: true while the user scrolls down with a page-level sticky bar stuck at the top
 * (brand sub-nav, filter bars, section tabs…), so three stacked bars never eat the screen. False on scroll up,
 * near the end of the page, and whenever `enabled` is false.
 */
function useTuckWhileScrolling(enabled, pathname) {
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    setTucked(false);
    if (!enabled) return undefined;
    const main = document.getElementById('main');
    if (!main) return undefined;
    let stickies = [];
    let scanTimer = 0;
    const scan = () => {
      scanTimer = 0;
      const found = [];
      main.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.position === 'sticky' && cs.top !== 'auto') found.push({ el, top: parseFloat(cs.top) || 0 });
      });
      stickies = found;
    };
    const scheduleScan = () => { if (!scanTimer) scanTimer = window.setTimeout(scan, 400); };
    scheduleScan();
    const mo = new MutationObserver(scheduleScan);
    mo.observe(main, { childList: true, subtree: true });

    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < 8) return;
      lastY = y;
      const nearEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 160;
      if (dy < 0 || nearEnd) { setTucked(false); return; }
      const stuck = stickies.some(({ el, top }) => {
        if (!el.isConnected) return false;
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.bottom > 0 && r.top <= top + 1;
      });
      setTucked(stuck);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(scanTimer);
      mo.disconnect();
    };
  }, [enabled, pathname]);
  return enabled && tucked;
}

/** True while the site footer is on screen: the bar steps aside over the footer (DESIGN-v2 3.17). */
function useFooterInView(pathname) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = document.querySelector('.site-footer');
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);
  return inView;
}

export default function BottomCtaBar() {
  const { t, lang, basePath } = useLang();
  const { pathname } = useLocation();
  const { drawerOpen, searchOpen, consentVisible, pageCta } = useShell();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const narrow = useMediaQuery('(max-width: 359px)');
  const small = useMediaQuery('(max-width: 360px) and (max-height: 700px)');
  const reduced = useReducedMotion();
  const fieldFocus = useFieldFocus();
  const ctaInView = usePrimaryCtaInView(pathname);
  const footerInView = useFooterInView(pathname);
  const barRef = useRef(null);
  const cta = resolveCta(basePath, pageCta, lang);
  // The bar is part of the page on phones/tablets unless this is a form page.
  const enabled = isMobile && !!cta;
  const tucked = useTuckWhileScrolling(enabled && small, pathname);
  const show = enabled && !drawerOpen && !searchOpen && !fieldFocus && !ctaInView && !consentVisible && !tucked && !footerInView;
  useBarHeight(barRef, show);
  // Back-to-top glides above the bar from the moment it starts to show or hide (styles/interactions.css).
  useEffect(() => {
    const root = document.documentElement;
    if (show) root.setAttribute('data-bottom-cta-shown', '');
    else root.removeAttribute('data-bottom-cta-shown');
    return () => root.removeAttribute('data-bottom-cta-shown');
  }, [show]);
  const overflow = useLabelOverflow(barRef, cta ? cta.label : '', show && lang !== 'ta' && !!cta?.shortLabel && cta.shortLabel !== cta.label);
  useEffect(() => {
    const root = document.documentElement;
    if (enabled) delete root.dataset.noBottomCta; else root.dataset.noBottomCta = '';
    return () => { delete root.dataset.noBottomCta; };
  }, [enabled]);

  // Tamil: the short label when there is one (Tamil runs 30–60% longer), else the full label on two lines.
  let label = '';
  if (cta) {
    if (lang === 'ta') label = cta.shortLabelTa || cta.labelTa || (narrow && cta.shortLabel) || cta.label;
    else label = (narrow || overflow) && cta.shortLabel ? cta.shortLabel : cta.label;
  }
  const brand = cta?.brand;
  const wa = !!cta?.href && isWhatsApp(cta.href);
  const icon = cta
    ? (typeof cta.icon === 'string' && ICONS[cta.icon]) || (wa ? MessageCircle : cta.href && isOffSite(cta.href) ? ArrowUpRight : ArrowRight)
    : undefined;

  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.12 } }, exit: { opacity: 0, transition: { duration: 0.1 } } }
    : {
        // transform only: in 240ms --ease-snap, out 280ms --ease-header-exit
        initial: { y: '100%' },
        animate: { y: 0, transition: { duration: 0.24, ease: [0.2, 0, 0, 1] } },
        exit: { y: '100%', transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
      };

  return (
    <AnimatePresence>
      {show && (
        <m.div
          key="cta-bar"
          ref={barRef}
          className="bottom-cta"
          data-surface="night"
          role="region"
          aria-label={t('Quick actions', 'விரைவுச் செயல்கள்')}
          data-brand={brand}
          {...motionProps}
        >
          <div className="bottom-cta__inner">
            <div className="bottom-cta__primary">
              <Button
                to={cta.to}
                href={cta.href}
                variant={brand && brand !== 'x' ? 'brand' : 'primary'}
                full
                icon={icon}
              >
                {label}
              </Button>
            </div>
            {!wa && (
              <WhatsAppButton
                iconOnly
                text={t('Hi StartNet', 'வணக்கம் StartNet')}
                refCode={waRef(basePath, lang)}
                label={t('Chat with StartNet on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
              />
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
