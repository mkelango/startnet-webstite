// C02 · Header (docs/redesign/SPEC.md §3.1–3.2): the Plug and Play floating nav card.
// A fixed, transparent wrapper holds the Bone utility tab (≥1024) and a 72px Card-coloured nav card (56px below 1024)
// that floats 8px under the tab over the Ink spacer / hero band.
// ≥1024 the card never hides: past 120px the wrapper slides up by the tab's height, docking the card 8px from the top.
// <1024 the card hides on scroll down (after 160px) and comes back after 40px of scroll up or on focus inside; every
// change is broadcast as the 'sn:header' event ({ detail: { hidden } }) and html[data-header-hidden].
// --shell-offset (the visible header's bottom edge) is written on <html> for sticky page chrome; html[data-header-scrolled]
// marks the card being over Paper (it then gets --shadow-header); html[data-hero-under] marks a mounted .home-hero
// (the Home hero runs under the card, read by pages/Home.css).
// Mega menus open on click (Enter / Space), never on hover. Escape or a scrim click closes and returns focus to the
// trigger. The current section carries a 16px Ink underline that slides between triggers (_indicator.js).
// Tamil labels are longer: the drawer layout is kept up to 1279px (desktopNavQuery).
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { PRIMARY_NAV, JOIN, sectionFor } from '../data/nav.js';
import { Button, Logo } from '../components';
import { useSlidingIndicator } from '../components/_indicator.js';
import UtilityBar from './UtilityBar.jsx';
import MegaMenu from './MegaMenu.jsx';
import { desktopNavQuery, pathOf, useMediaQuery, useShell, focusablesIn, preloadSearch } from './shell.jsx';
import './Header.css';

// Mirrors tokens.css (--utility-h, --header-inset, --header-h, --sheet-radius) — SPEC §3.1.
const UTILITY_H = 32;
const GAP = 8;
const BAR_WIDE = 72;
const BAR_NARROW = 56;
const SHEET_RADIUS = 32;
const DOCK_AFTER = 120; // ≥1024: the utility tab slides away
const HIDE_AFTER = 160; // <1024: the card may hide
const DELTA = 8;
// Hysteresis (touch has no smoothing): hide after 8px of continuous downward travel, but reveal only after 40px of
// continuous upward travel, so small finger corrections do not flick the header in and out.
const REVEAL_DELTA = 40;
const EASE_ENTER = [0, 0, 0.3, 1];
// Long reads (article templates) get the 2px Ink scroll-progress bar on the card's bottom edge.
const LONG_READ = /^\/(insights\/stories\/[^/]+|insights\/reports\/[^/]+|about)\/?$/;
// The page's top Ink band: the shared heroes, plus any custom "*-hero" block at the top of <main>.
const HERO_SELECTOR = '#main :is(.home-hero, .page-hero, .brand-hero, [class*="-hero "], [class$="-hero"])';

/** Bottom of the top hero band in document coordinates, or 0 when the page opens straight onto Paper. */
function heroBottom() {
  const hero = document.querySelector(HERO_SELECTOR);
  if (!hero) return 0;
  const r = hero.getBoundingClientRect();
  const y = window.scrollY;
  // Only a band that starts at the top of the page (under the spacer and an optional brand sub-nav) counts.
  if (r.top + y > 240) return 0;
  return r.bottom + y;
}

function useSmartHeader({ locked, reduced, wide, headerRef, pathname }) {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  const lockedRef = useRef(locked);
  lockedRef.current = locked || reduced;
  const wideRef = useRef(wide);
  wideRef.current = wide;
  const remeasure = useRef(() => {});

  useEffect(() => {
    let prevY = Math.max(0, window.scrollY);
    let travel = 0; // distance moved in the current direction (+ down, - up), reset when the direction flips
    let maxY = Infinity; // cached max scroll, so rubber-band overscroll past the end is ignored without layout reads
    let paperAt = GAP; // scrollY from which the card sits over Paper (cached; the scroll path never reads layout)
    let overPaper = null;
    let ticking = false;
    const root = document.documentElement;
    const measure = () => {
      maxY = Math.max(0, root.scrollHeight - window.innerHeight);
      const bottom = heroBottom();
      const card = wideRef.current ? GAP + BAR_WIDE : GAP + BAR_NARROW;
      paperAt = bottom ? Math.max(GAP, bottom - SHEET_RADIUS - card) : GAP;
      root.toggleAttribute('data-hero-under', !!document.querySelector('#main .home-hero'));
      update();
    };
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      const step = y - prevY;
      prevY = y;
      const paper = y > paperAt;
      if (paper !== overPaper) { overPaper = paper; root.toggleAttribute('data-header-scrolled', paper); }
      if (y > maxY + 1) return; // iOS overscroll bounce at the bottom: not a direction change
      if (step !== 0) travel = Math.sign(step) === Math.sign(travel) ? travel + step : step;
      setState((s) => {
        const scrolled = y > DOCK_AFTER;
        let hidden = s.hidden;
        // ≥1024 the card never hides (SPEC §3.1, §7 rule 10).
        if (wideRef.current || lockedRef.current || y < HIDE_AFTER) hidden = false;
        else if (root.dataset.pinActive === '1') hidden = s.hidden;
        else if (travel > DELTA) hidden = !headerRef.current?.contains(document.activeElement);
        else if (travel < -REVEAL_DELTA) hidden = false;
        return scrolled === s.scrolled && hidden === s.hidden ? s : { scrolled, hidden };
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    let measureTimer = 0;
    const schedule = () => { clearTimeout(measureTimer); measureTimer = window.setTimeout(measure, 200); };
    remeasure.current = schedule;
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(document.body);
    return () => {
      clearTimeout(measureTimer);
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      root.removeAttribute('data-header-scrolled');
      root.removeAttribute('data-hero-under');
    };
  }, [headerRef]);

  // A new page: find its hero again (the body may keep its height between two pages).
  useEffect(() => { remeasure.current(); }, [pathname, wide]);

  useEffect(() => { if (locked || reduced || wide) setState((s) => (s.hidden ? { ...s, hidden: false } : s)); }, [locked, reduced, wide]);

  // Focus inside (e.g. tabbing back up the page) always reveals the header.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const reveal = () => setState((s) => (s.hidden ? { ...s, hidden: false } : s));
    el.addEventListener('focusin', reveal);
    return () => el.removeEventListener('focusin', reveal);
  }, [headerRef]);

  // Expose the visible header's bottom edge so sticky chrome (brand sub-nav, pill sub-navs) docks beneath it.
  // Sizes follow the CSS breakpoint (1024), not the nav mode: Tamil keeps the utility tab from 1024 too.
  useEffect(() => {
    const utility = wide ? UTILITY_H : 0;
    const bar = wide ? BAR_WIDE : BAR_NARROW;
    let visible = state.scrolled && wide ? GAP + bar : utility + GAP + bar;
    if (state.hidden) visible = 0;
    // Only write when the value changes: an inherited custom property on <html> restyles the whole document.
    const root = document.documentElement;
    if (root.style.getPropertyValue('--shell-offset') !== `${visible}px`) root.style.setProperty('--shell-offset', `${visible}px`);
  }, [state, wide]);

  // Broadcast hide / show so the brand sub-nav (and any in-page nav) can follow.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', state.hidden);
    window.dispatchEvent(new CustomEvent('sn:header', { detail: { hidden: state.hidden } }));
  }, [state.hidden]);

  return state;
}

/** 2px Ink scroll-progress bar on the card's bottom edge (aria-hidden; article templates only; off under reduced motion). */
function useScrollProgress(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    let raf = 0;
    let max = -1; // scrollHeight - innerHeight, cached: the scroll path never reads layout (perf)
    let measureTimer = 0;
    const pending = () => document.getElementById('root')?.classList.contains('is-prerender-pending');
    const paint = () => {
      raf = 0;
      if (max < 0) return;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : 0})`;
    };
    const measure = () => {
      measureTimer = 0;
      // While the live app renders invisibly over the prerendered snapshot the document is doubled: re-check later.
      if (pending()) { measureTimer = window.setTimeout(measure, 250); return; }
      max = document.documentElement.scrollHeight - window.innerHeight;
      el.setAttribute('data-on', '');
      paint();
    };
    const scheduleMeasure = () => {
      if (measureTimer) clearTimeout(measureTimer);
      measureTimer = window.setTimeout(measure, 200);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleMeasure) : null;
    ro?.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(measureTimer);
      ro?.disconnect();
      el.removeAttribute('data-on');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [ref, enabled]);
}

export default function Header() {
  const { t, localePath, basePath, lang } = useLang();
  const { pathname } = useLocation();
  const { openSearch, openDrawer, drawerOpen, menuOpen, setMenuOpen } = useShell();
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery(desktopNavQuery(lang));
  const wide = useMediaQuery('(min-width: 1024px)');
  const headerRef = useRef(null);
  const triggers = useRef({});
  const current = sectionFor(basePath);
  const { scrolled, hidden } = useSmartHeader({ locked: !!menuOpen || drawerOpen, reduced, wide, headerRef, pathname });
  const listRef = useRef(null);
  const progressRef = useRef(null);
  const longRead = LONG_READ.test(basePath || '');
  useScrollProgress(progressRef, !reduced && longRead);
  // Current-section underline: rests on the current trigger and slides when the section changes.
  useSlidingIndicator(listRef, '[data-current]', [current, isDesktop, lang]);

  const close = useCallback((focusTrigger = false) => {
    setMenuOpen((id) => {
      if (focusTrigger && id) requestAnimationFrame(() => triggers.current[id]?.focus());
      return null;
    });
  }, [setMenuOpen]);

  // Close on route change and when leaving desktop.
  useEffect(() => { close(false); }, [pathname, close]);
  useEffect(() => { if (!isDesktop) close(false); }, [isDesktop, close]);

  // Esc closes and returns focus to the trigger; a click outside the header closes (focus returns to the trigger
  // only when it was inside the menu, so a click on a page control keeps its own focus).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(true); } };
    const onDown = (e) => {
      if (headerRef.current?.contains(e.target)) return;
      close(!!headerRef.current?.contains(document.activeElement));
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [menuOpen, close]);

  // Click (and Enter / Space, which fire click on a button) toggles; another trigger switches panels.
  const onTriggerClick = (id) => setMenuOpen((cur) => (cur === id ? null : id));

  // Choosing a link to the page you are on closes the panel and returns focus to its trigger (no focus loss to <body>).
  const onNavigate = (e) => {
    const href = e?.target?.closest?.('a')?.getAttribute('href') || '';
    const samePage = href.startsWith('/') && !href.includes('#') && pathOf(href) === pathname;
    close(samePage);
  };

  const onHeaderBlur = (e) => {
    if (menuOpen && e.relatedTarget && !headerRef.current?.contains(e.relatedTarget)) close(false);
  };

  const onTriggerKey = (e, index, id) => {
    const ids = PRIMARY_NAV.map((n) => n.id);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = ids[(index + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length];
      triggers.current[next]?.focus();
      if (menuOpen) setMenuOpen(next);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMenuOpen(id);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const panel = document.getElementById(`mega-${id}`);
        focusablesIn(panel)[0]?.focus();
      }));
    } else if (e.key === 'Tab' && !e.shiftKey && menuOpen === id) {
      // Disclosure: Tab from an open trigger enters its panel first (the panel follows the card in the DOM).
      const first = focusablesIn(document.getElementById(`mega-${id}`))[0];
      if (first) { e.preventDefault(); first.focus(); }
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      triggers.current[ids[e.key === 'Home' ? 0 : ids.length - 1]]?.focus();
    }
  };

  // Tab past the panel's last link moves on to the next trigger; Shift+Tab from its first link returns to its trigger.
  const onPanelKey = (e) => {
    if (e.key !== 'Tab' || !menuOpen) return;
    const items = focusablesIn(e.currentTarget);
    const ids = PRIMARY_NAV.map((n) => n.id);
    if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
      e.preventDefault();
      const next = ids[ids.indexOf(menuOpen) + 1];
      setMenuOpen(null);
      (next ? triggers.current[next] : headerRef.current?.querySelector('.site-header__icon'))?.focus();
    } else if (e.shiftKey && document.activeElement === items[0]) {
      e.preventDefault();
      triggers.current[menuOpen]?.focus();
    }
  };

  const item = PRIMARY_NAV.find((n) => n.id === menuOpen);
  const dur = reduced ? 0.1 : 0.16; // exit: opacity only

  return (
    <header
      ref={headerRef}
      className="site-header"
      data-scrolled={scrolled || undefined}
      data-hidden={hidden || undefined}
      data-open={menuOpen ? 'true' : undefined}
      onBlur={onHeaderBlur}
    >
      <UtilityBar />
      <div className="site-header__bar">
        <div className="site-header__inner">
          <Link to={localePath('/')} className="site-header__logo" aria-label={t('StartNet home', 'StartNet முகப்பு')}>
            <Logo />
          </Link>

          <nav aria-label={t('Main', 'முதன்மை')} className="site-header__nav">
            <ul className="site-header__list" ref={listRef}>
              <li className="site-nav__glide-wrap" aria-hidden="true">
                <span className="ind site-nav__glide" />
              </li>
              {PRIMARY_NAV.map((n, i) => (
                <li key={n.id}>
                  <button
                    type="button"
                    ref={(el) => { triggers.current[n.id] = el; }}
                    className="site-header__trigger"
                    aria-expanded={menuOpen === n.id}
                    aria-controls={menuOpen === n.id ? `mega-${n.id}` : undefined}
                    data-current={current === n.id || undefined}
                    onClick={() => onTriggerClick(n.id)}
                    onKeyDown={(e) => onTriggerKey(e, i, n.id)}
                  >
                    <span className={n.id === 'snx' ? 'nowrap' : undefined}>{t(n.label, n.shortLabelTa || n.labelTa)}</span>
                    <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" className="site-header__chev" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__tools">
            <button
              type="button"
              className="site-header__icon"
              onClick={openSearch}
              onPointerEnter={preloadSearch}
              onFocus={preloadSearch}
              aria-label={t('Search', 'தேடல்')}
              aria-keyshortcuts="/ Control+K Meta+K"
              title={t('Search ( / or Ctrl+K )', 'தேடல் ( / அல்லது Ctrl+K )')}
            >
              <Search size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            {/* The chrome's single red point (brand book §05.8 pin 4). Tamil uses the short label to fit the card. */}
            <Button to={JOIN.to} variant="point" size="md" className="site-header__join">
              {t(JOIN.label, JOIN.shortLabelTa || JOIN.labelTa)}
            </Button>
            <button
              type="button"
              className="site-header__menu"
              onClick={openDrawer}
              aria-expanded={drawerOpen}
              aria-controls={drawerOpen ? 'mobile-drawer' : undefined}
              aria-haspopup="dialog"
            >
              <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
              <span className="visually-hidden">{t('Menu', 'பட்டியல்')}</span>
            </button>
          </div>
        </div>
        {!reduced && longRead && <span ref={progressRef} className="site-header__progress" aria-hidden="true" />}
      </div>

      <AnimatePresence>
        {item && isDesktop && (
          <m.div
            key="scrim"
            className="site-header__scrim"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduced ? 0.1 : 0.2, ease: 'linear' } }}
            exit={{ opacity: 0, transition: { duration: dur } }}
            onClick={() => close(true)}
          />
        )}
        {item && isDesktop && (
          <m.div
            key="panel"
            id={`mega-${item.id}`}
            className={`mega-menu mega-menu--${item.variant || 'columns'}`}
            role="region"
            aria-label={t(item.label, item.labelTa)}
            onKeyDown={onPanelKey}
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0.1 : 0.2, ease: EASE_ENTER } }}
            exit={{ opacity: 0, transition: { duration: dur, ease: EASE_ENTER } }}
          >
            {/* Switching menus: a 120ms crossfade (60ms out, 60ms in) */}
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={item.id}
                className="mega-menu__fade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.06 } }}
                exit={{ opacity: 0, transition: { duration: 0.06 } }}
              >
                <MegaMenu item={item} reduced={reduced} onNavigate={onNavigate} />
              </m.div>
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
