// Global shell (Book 1 Part B §3, Book 3 C01–C09, C36, C43). Pages render only their own content.
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LazyMotion, MotionConfig } from 'framer-motion';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { PageLoader } from '../components';
import { ShellProvider, isMinimalPath, loadSearch, useSearchShortcuts, useShell } from './shell.jsx';
import Header from './Header.jsx';
import MinimalHeader from './MinimalHeader.jsx';
import Footer from './Footer.jsx';
import MobileDrawer from './MobileDrawer.jsx';
import BottomCtaBar from './BottomCtaBar.jsx';
import BackToTop from './BackToTop.jsx';
import ConsentBanner from './ConsentBanner.jsx';
import ScrollManager from './ScrollManager.jsx';
import { PhotoGradeFilter } from '../components/PhotoGradeFilter.jsx';
import AutoContentLang from './AutoContentLang.jsx';
import { TamilSuggestBanner } from './LanguageSwitch.jsx';
import './MotionSwitch.jsx'; // applies the stored "Reduce motion" choice on load
import { endSnapshotEntrance } from '../lib/handover.js';
import './SiteLayout.css';

// Animation features load as their own chunk; layout files use the light `m` component (F-31).
const loadMotionFeatures = () => import('./motionFeatures.js').then((mod) => mod.default);

// Search loads on first open ("/", Ctrl/⌘+K or the header button), Book 1 Part B §3.6.
const SearchOverlay = lazy(loadSearch);

function SearchMount() {
  const { searchOpen, openSearch } = useShell();
  const [armed, setArmed] = useState(false);
  useSearchShortcuts(openSearch);
  useEffect(() => { if (searchOpen) setArmed(true); }, [searchOpen]);
  if (!armed && !searchOpen) return null;
  return (
    <Suspense fallback={null}>
      <SearchOverlay />
    </Suspense>
  );
}

/**
 * Route-change enter (DESIGN-v2 3.22): <main> gets data-route-enter on a pathname change (not on hash-only changes),
 * which runs a 240ms opacity + 6px rise (CSS, off under reduced motion); the attribute is removed on animationend.
 * Also publishes --sbw (the classic scrollbar width) so --page-margin lines bleeds up with the container edge.
 */
function useShellEffects() {
  const { pathname } = useLocation();
  const first = useRef(true);
  // Leaving the first (prerendered) page: later page heroes animate in as usual (lib/handover.js). Compared with the
  // first pathname rather than a first-run flag, so StrictMode's double effects do not end it early.
  const initialPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== initialPath.current) endSnapshotEntrance();
  }, [pathname]);
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    const main = document.getElementById('main');
    if (!main) return undefined;
    main.removeAttribute('data-route-enter');
    // Restart the keyframe on consecutive navigations
    void main.offsetWidth; // eslint-disable-line no-void
    main.setAttribute('data-route-enter', '');
    const done = (e) => { if (!e || e.target === main) main.removeAttribute('data-route-enter'); };
    main.addEventListener('animationend', done);
    const timer = window.setTimeout(() => done(), 700);
    return () => { clearTimeout(timer); main.removeEventListener('animationend', done); };
  }, [pathname]);
  useEffect(() => {
    const root = document.documentElement;
    // Written only when it changes: an inherited custom property on <html> restyles the whole document (perf).
    const set = () => {
      const v = `${Math.max(0, window.innerWidth - root.clientWidth)}px`;
      if (root.style.getPropertyValue('--sbw') !== v) root.style.setProperty('--sbw', v);
    };
    set();
    window.addEventListener('resize', set, { passive: true });
    return () => window.removeEventListener('resize', set);
  }, []);
}

function ShellEffects() {
  useShellEffects();
  return null;
}

export default function SiteLayout() {
  const reduced = useReducedMotion();
  const { t, basePath } = useLang();
  // Campaign landings and the SNX hand-offs get the minimal header (logo + language only).
  const minimal = isMinimalPath(basePath);
  return (
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
        <ShellProvider>
          <div className="site-shell">
            {/* Everything that goes inert while a modal (drawer, search, sheet) is open */}
            <div className="site-shell__page" data-shell-page>
              <a href="#main" className="skip-link">{t('Skip to content', 'உள்ளடக்கத்திற்குச் செல்லுங்கள்')}</a>
              <ConsentBanner />
              {minimal ? <MinimalHeader /> : <Header />}
              <div className={`site-shell__spacer${minimal ? ' site-shell__spacer--minimal' : ''}`} aria-hidden="true" />
              <TamilSuggestBanner />
              <main id="main" tabIndex={-1} className="site-shell__main">
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
              </main>
              <Footer />
              <BottomCtaBar />
              <BackToTop />
            </div>
            <MobileDrawer />
            <SearchMount />
            <ScrollManager />
            <PhotoGradeFilter />
            <ShellEffects />
            <AutoContentLang />
          </div>
        </ShellProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
