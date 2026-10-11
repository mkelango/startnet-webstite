// WCAG 3.1.2 (Language of Parts) safety net for /ta pages (M-12, F-30).
// Some copy is still English-only on /ta. Kit components mark their own English strings
// (contentLang / contentLangFor); this pass covers the rest: any text block, and any leaf <div>/<span>, whose text
// has Latin words and no Tamil script, and that sits under the Tamil page language, gets lang="en" so screen
// readers switch voice. It covers the whole shell: <main>, header, mega panels, drawer, footer, bottom bar, and
// portalled dialogs (search, filter sheets, tag popovers), which mount outside <main>. It never touches an element
// that already carries a lang attribute set by React, and it re-checks its own marks when text changes.
import { useEffect } from 'react';
import { useLang } from '../lib/i18n.jsx';

const BLOCKS = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,th,td,caption,figcaption,blockquote,label,legend,summary,button,a,[role="tab"],[role="option"]';
const LEAVES = 'div,span';
const SKIP = 'script,style,noscript,template,svg';
const TAMIL = /[஀-௿]/;
const LATIN_WORD = /[A-Za-z]{3}/;
const MARK = 'data-auto-lang';

function mark(el) {
  if (el.hasAttribute('lang') || el.closest(SKIP)) return;
  const scope = el.parentElement?.closest('[lang]');
  if (scope && scope.getAttribute('lang') !== 'ta') return; // already inside an English (or other) part
  const text = el.textContent;
  if (!text || TAMIL.test(text) || !LATIN_WORD.test(text)) return;
  el.setAttribute('lang', 'en');
  el.setAttribute(MARK, '');
}

function sweep(root) {
  // Undo marks whose text has since become Tamil (same element re-used with new text).
  root.querySelectorAll(`[${MARK}]`).forEach((el) => {
    if (TAMIL.test(el.textContent)) { el.removeAttribute('lang'); el.removeAttribute(MARK); }
  });
  root.querySelectorAll(BLOCKS).forEach(mark);
  // Leaf containers (no element children) hold bare text too: chips, captions, counters, labels.
  root.querySelectorAll(LEAVES).forEach((el) => { if (el.childElementCount === 0) mark(el); });
}

export default function AutoContentLang() {
  const { lang } = useLang();
  useEffect(() => {
    if (lang !== 'ta') return undefined;
    // document.body: the app root plus every portal (search overlay, sheets, popovers) mounted beside it.
    const root = document.body;
    let timer = 0;
    const run = () => { timer = 0; sweep(root); };
    const schedule = () => { if (!timer) timer = window.setTimeout(run, 120); };
    run();
    const mo = new MutationObserver((records) => {
      // Ignore our own attribute writes; react to new nodes and text changes only.
      if (records.some((r) => r.type === 'childList' || r.type === 'characterData')) schedule();
    });
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    return () => {
      mo.disconnect();
      if (timer) window.clearTimeout(timer);
      // Leaving Tamil: drop our marks so nothing stale survives into the English page.
      root.querySelectorAll(`[${MARK}]`).forEach((el) => { el.removeAttribute('lang'); el.removeAttribute(MARK); });
    };
  }, [lang]);
  return null;
}
