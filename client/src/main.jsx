import React, { startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/pointerFx.css';
import './styles/theme.css';
import './styles/interactions.css';
import App from './App.jsx';
import notoTamilUrl from './styles/fonts/noto-sans-tamil-tamil-wght-normal.woff2?url';
import anekTamilUrl from './styles/fonts/anek-tamil-tamil-wght-normal.woff2?url';

// Set the page language before the first render. LangProvider also sets it (in an effect, after paint), but
// by then /ta has painted with the English font stacks and the Tamil stacks would reflow it (CLS).
const IS_TA = /^\/ta(\/|$)/.test(window.location.pathname);
document.documentElement.lang = IS_TA ? 'ta' : 'en';

// Preload the Tamil fonts on /ta, so they are requested now rather than after React's first commit. Anek Tamil is
// font-display: optional (it is never swapped in late, so it cannot shift the layout); preloading it is what lets it
// arrive in time to be used at all. (Inter latin is preloaded from index.html by the vite.config.js plugin; the
// production CSP allows no inline script, which is why this lives here.) English pages request no Tamil web font.
if (IS_TA) {
  for (const href of [notoTamilUrl, anekTamilUrl]) {
    if (document.querySelector('link[rel="preload"][href="' + href + '"]')) continue;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = href;
    document.head.appendChild(link);
  }
}

// A route chunk that 404s (typically a stale tab after a redeploy) would otherwise leave a blank page.
// Reload once to pick up the new build; if it still fails, the route error boundary in App.jsx takes over.
const RELOAD_FLAG = 'sn-reloaded';
const store = {
  get() { try { return sessionStorage.getItem(RELOAD_FLAG); } catch { return '1'; } },
  set() { try { sessionStorage.setItem(RELOAD_FLAG, '1'); return true; } catch { return false; } },
  clear() { try { sessionStorage.removeItem(RELOAD_FLAG); } catch {} },
};
window.addEventListener('vite:preloadError', (event) => {
  if (!store.get() && store.set()) {
    event.preventDefault();
    window.location.reload();
  }
});
// Clear the flag once the page has been up for a while, so a later redeploy can self-heal again
// without letting a persistently missing chunk cause a reload loop.
window.addEventListener('load', () => { setTimeout(() => store.clear(), 10000); });

// The first render runs as a transition (F-14): React then renders it in ~5 ms slices, yielding to the browser in
// between, instead of one long task of rendering the shell and the page (Home's first render was 600 ms+ on a
// 4x-throttled phone profile). Nothing is on screen before this render commits, so nothing is visibly deferred.
// Prerendered page (tools/seo/prerender.mjs): the server sent the finished HTML in #sn-prerender, so crawlers and the
// first paint see the real page. The live app renders into #root, held invisible on top of the same spot
// (.is-prerender-pending in base.css), and replaces the snapshot once it has rendered the page: an <h1> and about as
// much text. That avoids a blank or loading flash between the static copy and the app. 4 s is the upper bound.
const rootEl = document.getElementById('root');
const snapshot = document.getElementById('sn-prerender');
if (snapshot) {
  rootEl.classList.add('is-prerender-pending');
  const target = snapshot.textContent.replace(/\s+/g, '').length * 0.9;
  let observer;
  let timer;
  let frame = 0;
  // Keyboard focus inside the snapshot would be lost when it is removed (focus falls to <body>). Find the same
  // control in the live copy: by id, then by href / name, then by its position among the focusable elements.
  const FOCUSABLE = 'a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';
  const liveTwin = (el) => {
    if (el.id) { const byId = rootEl.querySelector('#' + CSS.escape(el.id)); if (byId) return byId; }
    const text = (n) => (n.getAttribute('aria-label') || n.textContent || '').replace(/\s+/g, ' ').trim();
    const list = [...rootEl.querySelectorAll(FOCUSABLE)];
    const href = el.getAttribute('href');
    const same = list.filter((n) => n.tagName === el.tagName && n.getAttribute('href') === href && text(n) === text(el));
    if (same.length) {
      const before = [...snapshot.querySelectorAll(FOCUSABLE)].filter((n) => n.tagName === el.tagName
        && n.getAttribute('href') === href && text(n) === text(el)).indexOf(el);
      return same[Math.max(0, Math.min(before, same.length - 1))];
    }
    const idx = [...snapshot.querySelectorAll(FOCUSABLE)].indexOf(el);
    return idx >= 0 ? list[idx] || null : null;
  };
  const swap = () => {
    if (!snapshot.isConnected) return;
    observer.disconnect();
    clearTimeout(timer);
    const y = window.scrollY;
    const active = document.activeElement;
    const twin = active && active !== document.body && snapshot.contains(active) ? liveTwin(active) : null;
    snapshot.remove();
    rootEl.classList.remove('is-prerender-pending');
    if (window.scrollY !== y) window.scrollTo(0, y);
    // Scroll-linked effects measured positions while the page was stacked; let them re-measure.
    window.dispatchEvent(new Event('resize'));
    if (twin) { try { twin.focus({ preventScroll: true }); } catch {} }
  };
  const check = () => {
    frame = 0;
    if (rootEl.querySelector('h1') && rootEl.textContent.replace(/\s+/g, '').length >= target) swap();
  };
  observer = new MutationObserver(() => {
    if (!frame) frame = requestAnimationFrame(check);
  });
  observer.observe(rootEl, { childList: true, subtree: true, characterData: true });
  // Safety net: after 4 s swap once the live copy has its <h1> and most of the text (a slow CPU can still be
  // rendering the lazy page chunk; removing the snapshot then would show a blank loader). From 10 s an <h1> alone is
  // enough (the live text can differ from the snapshot: an error screen, changed data); from 30 s swap regardless.
  const started = performance.now();
  const late = () => {
    const waited = performance.now() - started;
    const h1 = rootEl.querySelector('h1');
    const ready = h1 && (waited > 10000 || rootEl.textContent.replace(/\s+/g, '').length >= target * 0.8);
    if (ready || waited > 30000) swap();
    else timer = setTimeout(late, 250);
  };
  timer = setTimeout(late, 4000);
}

// Smooth wheel scrolling and pointer effects load after first paint (they never gate content), and only take
// effect for mouse / trackpad users without reduced motion (see lib/smoothScroll.js, lib/pointerFx.js).
const bootMotion = () =>
  import('./lib/motionBoot.js').then((m) => m.bootMotion()).catch(() => {});
if ('requestIdleCallback' in window) window.requestIdleCallback(bootMotion, { timeout: 2500 });
else window.setTimeout(bootMotion, 1200);

const root = ReactDOM.createRoot(rootEl);
startTransition(() => {
  root.render(
    <React.StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
