// C02 · Header (Book 1 Part B §3.1, Book 4 IX-01/IX-02).
// Fixed header: utility bar (desktop) + 72 px main bar with 7 disclosure triggers and search.
// Past 120 px the utility bar slides away and the bar compacts to 56 px (glass); scrolling down (8 px delta) hides
// it, scrolling up 40 px (or focusing inside) brings it back; every change is broadcast as the 'sn:header' event
// ({ detail: { hidden } }) for the brand sub-nav and in-page navs (hide: 280 ms --ease-header-exit, AIWO P1).
// One 2px Paper underline flush with the bar's bottom edge glides between the triggers: it rests on the open item
// (else the current section) and follows hover / focus. A scroll-progress hairline shows on long pages. Reduced motion: never hides. While a pinned scroll story is active
// (html[data-pin-active]) the header keeps its current state, so GSAP snap-backs do not flash it in.
// Tamil labels are longer: the drawer layout is kept up to 1279 px (desktopNavQuery).
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { PRIMARY_NAV, sectionFor } from '../data/nav.js';
import { Logo } from '../components';
import { glideTo, useSlidingIndicator } from '../components/_indicator.js';
import UtilityBar from './UtilityBar.jsx';
import LanguageSwitch from './LanguageSwitch.jsx';
import MegaMenu from './MegaMenu.jsx';
import { desktopNavQuery, pathOf, useMediaQuery, useShell, focusablesIn, preloadSearch } from './shell.jsx';
import './Header.css';

const SCROLL_COMPACT = 120;
const HIDE_AFTER = 120;
const DELTA = 8;
// Hysteresis (touch has no smoothing): hide after 8px of continuous downward travel, but reveal only after 40px of
// continuous upward travel, so small finger corrections do not flick the header in and out.
const REVEAL_DELTA = 40;
const HOVER_INTENT = 150; // --hover-intent
const HOVER_EXIT = 300; // --hover-exit
const HOVER_SWITCH = 120; // while a panel is open, dwell this long on another trigger before swapping
const EASE_SNAP = [0.2, 0, 0, 1];
// Long reads get the header scroll-progress hairline
const LONG_READ = /^\/(insights\/stories\/[^/]+|insights\/reports\/[^/]+|about)\/?$/;

function useSmartHeader({ locked, reduced, wide, headerRef }) {
  const coarse = useMediaQuery('(pointer: coarse)');
  const [state, setState] = useState({ scrolled: false, hidden: false });
  const lockedRef = useRef(locked);
  lockedRef.current = locked || reduced;

  useEffect(() => {
    let prevY = Math.max(0, window.scrollY);
    let travel = 0; // distance moved in the current direction (+ down, - up), reset when the direction flips
    let maxY = Infinity; // cached max scroll, so rubber-band overscroll past the end is ignored without layout reads
    let ticking = false;
    const measureMax = () => { maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight); };
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      const step = y - prevY;
      prevY = y;
      if (y > maxY + 1) return; // iOS overscroll bounce at the bottom: not a direction change
      if (step !== 0) travel = Math.sign(step) === Math.sign(travel) ? travel + step : step;
      setState((s) => {
        const scrolled = y > SCROLL_COMPACT;
        let hidden = s.hidden;
        if (lockedRef.current || y < HIDE_AFTER) hidden = false;
        else if (document.documentElement.dataset.pinActive === '1') hidden = s.hidden;
        else if (travel > DELTA) hidden = !headerRef.current?.contains(document.activeElement);
        else if (travel < -REVEAL_DELTA) hidden = false;
        return scrolled === s.scrolled && hidden === s.hidden ? s : { scrolled, hidden };
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    let measureTimer = 0;
    const onResize = () => { clearTimeout(measureTimer); measureTimer = window.setTimeout(measureMax, 200); };
    update();
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(document.body);
    return () => {
      clearTimeout(measureTimer);
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [headerRef]);

  useEffect(() => { if (locked || reduced) setState((s) => (s.hidden ? { ...s, hidden: false } : s)); }, [locked, reduced]);

  // Focus inside (e.g. tabbing back up the page) always reveals the header.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const reveal = () => setState((s) => (s.hidden ? { ...s, hidden: false } : s));
    el.addEventListener('focusin', reveal);
    return () => el.removeEventListener('focusin', reveal);
  }, [headerRef]);

  // Expose the visible header height so the brand sub-nav can dock beneath it.
  useEffect(() => {
    // Sizes follow the CSS breakpoint (1024), not the nav mode: Tamil keeps the utility bar from 1024 too.
    const utility = wide ? (coarse ? 40 : 36) : 0; // UtilityBar.css grows the bar to 40 px for touch
    const bar = wide ? (state.scrolled ? 56 : 72) : 56;
    const visible = state.hidden ? 0 : bar + (state.scrolled ? 0 : utility);
    // Only write when the value changes: an inherited custom property on <html> restyles the whole document.
    const root = document.documentElement;
    if (root.style.getPropertyValue('--shell-offset') !== `${visible}px`) root.style.setProperty('--shell-offset', `${visible}px`);
  }, [state, wide, coarse]);

  // Broadcast hide / show so the brand sub-nav (and any in-page nav) can follow (DESIGN-v2 3.1 / 3.4).
  useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', state.hidden);
    window.dispatchEvent(new CustomEvent('sn:header', { detail: { hidden: state.hidden } }));
  }, [state.hidden]);

  return state;
}

/**
 * Scroll-progress hairline under the main bar (aria-hidden; off under reduced motion). Long reads always show it;
 * any other page shows it once the document is at least LONG_PAGE viewports tall (data-on), re-checked on resize
 * and as content arrives (ResizeObserver on <body>).
 */
const LONG_PAGE = 3;
function useScrollProgress(ref, enabled, always) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    let raf = 0;
    let on = null;
    let max = -1; // scrollHeight - innerHeight, cached: the scroll path never reads layout (perf)
    let vh = window.innerHeight;
    let measureTimer = 0;
    const pending = () => document.getElementById('root')?.classList.contains('is-prerender-pending');
    const measure = () => {
      measureTimer = 0;
      // While the live app renders invisibly over the prerendered snapshot the document is doubled and changes on
      // every render slice: measuring then would force a full layout each time. Re-check once it has settled.
      if (pending()) { measureTimer = window.setTimeout(measure, 250); return; }
      vh = window.innerHeight;
      max = document.documentElement.scrollHeight - vh;
      const long = always || max >= vh * (LONG_PAGE - 1);
      if (long !== on) { on = long; el.toggleAttribute('data-on', long); }
      paint();
    };
    const scheduleMeasure = () => {
      if (measureTimer) clearTimeout(measureTimer);
      measureTimer = window.setTimeout(measure, 200);
    };
    const paint = () => {
      raf = 0;
      if (!on || max < 0) return;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : 0})`;
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
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [ref, enabled, always]);
}

export default function Header() {
  const { t, lang, localePath, basePath } = useLang();
  const { pathname } = useLocation();
  const { openSearch, openDrawer, drawerOpen, menuOpen, setMenuOpen } = useShell();
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery(desktopNavQuery(lang));
  const wide = useMediaQuery('(min-width: 1024px)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const headerRef = useRef(null);
  const triggers = useRef({});
  const openTimer = useRef(0);
  const closeTimer = useRef(0);
  const switchTimer = useRef(0);
  const hoverOpenedAt = useRef(0);
  const current = sectionFor(basePath);
  const { scrolled, hidden } = useSmartHeader({ locked: !!menuOpen || drawerOpen, reduced, wide, headerRef });
  const listRef = useRef(null);
  const progressRef = useRef(null);
  const longRead = LONG_READ.test(basePath || '');
  useScrollProgress(progressRef, !reduced, longRead);
  // Glide highlight: rests on the current section (or the open trigger) and follows hover / focus.
  const restSelector = menuOpen ? '[aria-expanded="true"]' : '[data-current]';
  useSlidingIndicator(listRef, restSelector, [restSelector, current, isDesktop, lang]);
  const glide = (el) => glideTo(listRef.current, el);
  const glideHome = () => glideTo(listRef.current, listRef.current?.querySelector(restSelector) || null);

  const clearTimers = () => { clearTimeout(openTimer.current); clearTimeout(closeTimer.current); clearTimeout(switchTimer.current); };
  const close = useCallback((focusTrigger = false) => {
    clearTimers();
    setMenuOpen((id) => {
      if (focusTrigger && id) requestAnimationFrame(() => triggers.current[id]?.focus());
      return null;
    });
  }, [setMenuOpen]);

  // Close on route change and when leaving desktop.
  useEffect(() => { close(false); }, [pathname, close]);
  useEffect(() => { if (!isDesktop) close(false); }, [isDesktop, close]);
  useEffect(() => () => clearTimers(), []);

  // Esc closes and returns focus to the trigger; outside click closes.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(true); } };
    const onDown = (e) => { if (!headerRef.current?.contains(e.target)) close(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [menuOpen, close]);

  const onTriggerClick = (id) => {
    clearTimers();
    // A click right after a hover-open should not slam the panel shut.
    if (menuOpen === id && Date.now() - hoverOpenedAt.current < 700) return;
    setMenuOpen((cur) => (cur === id ? null : id));
  };

  const onTriggerEnter = (id, e) => {
    if (e.pointerType !== 'mouse' || !finePointer) return;
    clearTimers();
    const openIt = () => { setMenuOpen(id); hoverOpenedAt.current = Date.now(); };
    // A panel is open: swap only after a short dwell, so a diagonal move towards the open panel does not swap it.
    if (menuOpen) { if (menuOpen !== id) switchTimer.current = window.setTimeout(openIt, HOVER_SWITCH); return; }
    openTimer.current = window.setTimeout(openIt, HOVER_INTENT);
  };
  const onTriggerLeave = () => { clearTimeout(openTimer.current); clearTimeout(switchTimer.current); };

  const onHeaderEnter = (e) => { if (e.pointerType === 'mouse') clearTimeout(closeTimer.current); };
  // The scrim is inside <header>, so moving onto the page never fires pointerleave: treat the scrim as "outside".
  const onHeaderOver = (e) => {
    if (e.pointerType !== 'mouse' || !menuOpen) return;
    clearTimeout(closeTimer.current);
    if (e.target.closest?.('.site-header__scrim')) {
      clearTimeout(switchTimer.current);
      closeTimer.current = window.setTimeout(() => close(false), HOVER_EXIT);
    }
  };
  const onPanelEnter = () => { clearTimeout(switchTimer.current); clearTimeout(closeTimer.current); };

  // Choosing a link to the page you are on closes the panel and returns focus to its trigger (no focus loss to <body>).
  const onNavigate = (e) => {
    const href = e?.target?.closest?.('a')?.getAttribute('href') || '';
    const samePage = href.startsWith('/') && !href.includes('#') && pathOf(href) === pathname;
    close(samePage);
  };
  const onHeaderLeave = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(openTimer.current);
    if (menuOpen) closeTimer.current = window.setTimeout(() => close(false), HOVER_EXIT);
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
      // Disclosure: Tab from an open trigger enters its panel first.
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
  const dur = reduced ? 0.1 : 0.16; // exit: opacity only, 160ms

  return (
    <header
      ref={headerRef}
      className="site-header"
      data-scrolled={scrolled || undefined}
      data-hidden={hidden || undefined}
      data-open={menuOpen ? 'true' : undefined}
      onPointerEnter={onHeaderEnter}
      onPointerOver={onHeaderOver}
      onPointerLeave={onHeaderLeave}
      onBlur={onHeaderBlur}
    >
      <UtilityBar />
      <div className="site-header__bar">
        <div className="container site-header__inner">
          <Link to={localePath('/')} className="site-header__logo" aria-label={t('StartNet home', 'StartNet முகப்பு')}>
            <Logo />
          </Link>

          <nav aria-label={t('Main', 'முதன்மை')} className="site-header__nav">
            <ul className="site-header__list" ref={listRef} onPointerLeave={glideHome}>
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
                    onPointerEnter={(e) => { onTriggerEnter(n.id, e); glide(e.currentTarget); }}
                    onPointerLeave={onTriggerLeave}
                    onFocus={(e) => glide(e.currentTarget)}
                    onBlur={glideHome}
                    onKeyDown={(e) => onTriggerKey(e, i, n.id)}
                  >
                    <span className={n.id === 'snx' ? 'nowrap' : undefined}>{t(n.label, n.shortLabelTa || n.labelTa)}</span>
                    <ChevronDown size={16} aria-hidden="true" className="site-header__chev" />
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
              <Search size={20} aria-hidden="true" />
            </button>
            <LanguageSwitch variant="compact" className="site-header__lang" />
            <button
              type="button"
              className="site-header__menu"
              onClick={openDrawer}
              aria-expanded={drawerOpen}
              aria-controls={drawerOpen ? 'mobile-drawer' : undefined}
              aria-haspopup="dialog"
            >
              <Menu size={22} aria-hidden="true" />
              <span className="site-header__menu-label">{t('Menu', 'பட்டியல்')}</span>
            </button>
          </div>
        </div>
        {!reduced && <span ref={progressRef} className="site-header__progress" aria-hidden="true" />}
      </div>

      <AnimatePresence>
        {item && isDesktop && (
          <m.div
            key="scrim"
            className="site-header__scrim"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduced ? 0.1 : 0.24, ease: 'linear' } }}
            exit={{ opacity: 0, transition: { duration: dur } }}
            onClick={() => close(false)}
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
            onPointerEnter={onPanelEnter}
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0.1 : 0.24, ease: EASE_SNAP } }}
            exit={{ opacity: 0, transition: { duration: dur, ease: EASE_SNAP } }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: reduced ? 0.08 : 0.16 } }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
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
