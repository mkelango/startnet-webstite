// C36 · Search overlay (Book 1 Part B §3.6): opened by the header icon, "/" or Ctrl/⌘+K.
// Dialog + combobox/listbox. Quick links before typing; results from GET /api/search?q= grouped into
// tabs (Programmes · Events · Insights · Stories · Pages · People) with type and brand chips;
// zero results → persona selector, top three programmes and "Ask us on WhatsApp".
// Code-split: SiteLayout mounts this on the first open (shell.jsx loadSearch); the "/" and Ctrl/⌘+K shortcuts
// live in the shell (useSearchShortcuts) so they work before this chunk loads.
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { useApi } from '../hooks/useApi.js';
import { waLink } from '../lib/links.js';
import { BRANDS } from '../data/brands.js';
import { SEARCH_QUICK_LINKS } from '../data/nav.js';
import { useModal, useShell } from './shell.jsx';
import './SearchOverlay.css';

// Tamil strings are drafts pending native review (Book 2 §14).
const GROUPS = [
  { id: 'all', label: 'All', labelTa: 'அனைத்தும்' },
  { id: 'programmes', label: 'Programmes', labelTa: 'திட்டங்கள்', types: ['programme', 'programmes'] },
  { id: 'events', label: 'Events', labelTa: 'நிகழ்வுகள்', types: ['event', 'events'] },
  { id: 'insights', label: 'Insights', labelTa: 'நுண்ணறிவுகள்', types: ['report', 'reports', 'ledger', 'insight', 'insights', 'index'] },
  { id: 'stories', label: 'Stories', labelTa: 'கதைகள்', types: ['story', 'stories'] },
  { id: 'pages', label: 'Pages', labelTa: 'பக்கங்கள்', types: ['page', 'pages'] },
  { id: 'people', label: 'People', labelTa: 'நபர்கள்', types: ['person', 'people'] },
];
const TYPE_LABEL = {
  programmes: ['Programme', 'திட்டம்'],
  events: ['Event', 'நிகழ்வு'],
  insights: ['Insight', 'நுண்ணறிவு'],
  stories: ['Story', 'கதை'],
  pages: ['Page', 'பக்கம்'],
  people: ['Person', 'நபர்'],
};
const STATUS_TA = {
  open: 'திறந்துள்ளது',
  closing: 'விரைவில் முடிகிறது',
  rolling: 'தொடர்ந்து ஏற்கப்படுகிறது',
  upcoming: 'வரவிருக்கிறது',
  closed: 'முடிந்தது',
  past: 'கடந்தது',
};

const groupOf = (type = '') => {
  const t = String(type).toLowerCase();
  return GROUPS.find((g) => g.types?.includes(t))?.id || 'pages';
};

function ZeroResults({ q, onNavigate }) {
  const { t, localePath } = useLang();
  const { data } = useApi('/api/programmes');
  const rank = { open: 0, closing: 1, rolling: 2, upcoming: 3, closed: 4 };
  const top = Array.isArray(data) ? [...data].sort((a, b) => (rank[a.status] ?? 5) - (rank[b.status] ?? 5)).slice(0, 3) : [];
  return (
    <div className="search-overlay__zero">
      <p className="search-overlay__zero-title">{t(`No results for “${q}”.`, `“${q}” என்பதற்கு முடிவுகள் இல்லை.`)}</p>
      <p className="search-overlay__zero-body">
        {t('Try a shorter word, or start from one of these.', 'சிறிய சொல்லை முயலுங்கள், அல்லது இவற்றில் ஒன்றிலிருந்து தொடங்குங்கள்.')}
      </p>
      <ul className="search-overlay__zero-list">
        <li>
          <Link to={localePath('/join')} onClick={onNavigate} className="search-overlay__zero-link">
            {t('Not sure where to start? Answer two questions', 'எங்கு தொடங்குவது எனத் தெரியவில்லையா? இரண்டு கேள்விகளுக்குப் பதிலளியுங்கள்')}{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </li>
        {top.map((p) => (
          <li key={p.slug}>
            <Link to={localePath(`/programmes/${p.slug}`)} onClick={onNavigate} className="search-overlay__zero-link" data-brand={p.brand}>
              <span className="search-overlay__chip search-overlay__chip--brand"><span className="search-overlay__brand-dot" aria-hidden="true" />{BRANDS[p.brand]?.name || 'StartNet'}</span>
              {t(p.title, p.titleTa)} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
        <li>
          <a
            href={waLink(
              t(`Hi StartNet, I searched the website for "${q}" and could not find it`, `வணக்கம் StartNet, இணையதளத்தில் "${q}" எனத் தேடினேன், கிடைக்கவில்லை`),
              'search'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="search-overlay__zero-link"
          >
            {t('Ask us on WhatsApp', 'WhatsApp-இல் எங்களைக் கேளுங்கள்')} <ArrowRight size={16} aria-hidden="true" />
            <span className="visually-hidden">{t(' (opens WhatsApp)', ' (WhatsApp-இல் திறக்கும்)')}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default function SearchOverlay() {
  const { searchOpen, closeSearch, returnFocus } = useShell();
  const { t, lang, localePath } = useLang();
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const ids = useId();
  const listId = `${ids}-list`;
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [q, setQ] = useState('');
  const [state, setState] = useState({ status: 'idle', results: [], q: '' });
  const [group, setGroup] = useState('all');
  const [active, setActive] = useState(-1);

  useModal(dialogRef, searchOpen, { onClose: closeSearch, initialFocus: inputRef, returnTo: returnFocus });

  useEffect(() => { if (!searchOpen) { setQ(''); setState({ status: 'idle', results: [], q: '' }); setGroup('all'); setActive(-1); } }, [searchOpen]);

  // Debounced fetch with abort.
  useEffect(() => {
    const term = q.trim();
    if (!searchOpen || term.length < 2) { setState((s) => (s.status === 'idle' ? s : { status: 'idle', results: [], q: '' })); return undefined; }
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      setState((s) => ({ ...s, status: 'loading' }));
      fetch(`/api/search?q=${encodeURIComponent(term)}&lang=${lang}`, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((data) => setState({ status: 'done', results: Array.isArray(data?.results) ? data.results : [], q: term }))
        .catch((err) => { if (err.name !== 'AbortError') setState({ status: 'error', results: [], q: term }); });
    }, 200);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [q, searchOpen, lang]);

  const counts = useMemo(() => {
    const c = { all: state.results.length };
    state.results.forEach((r) => { const g = groupOf(r.type); c[g] = (c[g] || 0) + 1; });
    return c;
  }, [state.results]);
  const shown = useMemo(
    () => (group === 'all' ? state.results : state.results.filter((r) => groupOf(r.type) === group)),
    [state.results, group]
  );
  useEffect(() => { setActive(-1); }, [shown]);
  useEffect(() => { if (group !== 'all' && !counts[group]) setGroup('all'); }, [counts, group]);

  const go = (url) => {
    closeSearch();
    if (/^https?:\/\//.test(url)) { window.location.assign(url); return; }
    navigate(localePath(url));
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' && shown.length) { e.preventDefault(); setActive((i) => (i + 1) % shown.length); }
    else if (e.key === 'ArrowUp' && shown.length) { e.preventDefault(); setActive((i) => (i <= 0 ? shown.length - 1 : i - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && shown[active]) go(shown[active].url);
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${ids}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, ids]);

  const term = q.trim();
  const hasResults = state.status === 'done' && state.results.length > 0;
  const unavailable = t('Search is unavailable right now.', 'தேடல் இப்போது கிடைக்கவில்லை.');
  const searching = t('Searching…', 'தேடுகிறது…');
  const announce =
    state.status === 'loading' ? searching
      : state.status === 'done'
        ? (state.results.length
          ? t(`${state.results.length} results for ${state.q}`, `${state.q}: ${state.results.length} முடிவுகள்`)
          : t(`No results for ${state.q}`, `${state.q}: முடிவுகள் இல்லை`))
        : state.status === 'error' ? unavailable : '';

  const fade = { duration: reduced ? 0.1 : 0.24 };
  const searchLabel = t('Search StartNet', 'StartNet-இல் தேடுங்கள்');

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <m.div
          key="search"
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: fade }}
          exit={{ opacity: 0, transition: { duration: reduced ? 0.08 : 0.16 } }}
        >
          <m.div
            ref={dialogRef}
            className="search-overlay__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={searchLabel}
            initial={{ y: reduced ? 0 : -12 }}
            animate={{ y: 0, transition: { duration: reduced ? 0 : 0.32, ease: [0, 0, 0.3, 1] } }}
          >
            <div className="search-overlay__bar">
              <div className="container search-overlay__bar-inner">
                <Search size={24} aria-hidden="true" className="search-overlay__icon" />
                <input
                  ref={inputRef}
                  type="search"
                  className="search-overlay__input"
                  placeholder={searchLabel}
                  aria-label={t('Search', 'தேடல்')}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={hasResults}
                  aria-controls={listId}
                  aria-activedescendant={active >= 0 ? `${ids}-opt-${active}` : undefined}
                  autoComplete="off"
                  spellCheck="false"
                  enterKeyHint="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                {/* Named at every width: below 768 px only the X shows (its label is visually hidden). */}
                <button type="button" className="search-overlay__close" onClick={closeSearch} aria-label={t('Close search', 'தேடலை மூடு')}>
                  <span className="search-overlay__close-label">{t('Close', 'மூடு')}</span>
                  <kbd className="search-overlay__kbd" aria-hidden="true">Esc</kbd>
                  <X size={20} aria-hidden="true" className="search-overlay__close-x" />
                </button>
              </div>
            </div>

            <div className="search-overlay__body">
              <div className="container search-overlay__body-inner">
                <p className="visually-hidden" role="status" aria-live="polite">{announce}</p>

                {term.length < 2 && (
                  <section className="search-overlay__quick" aria-labelledby={`${ids}-quick`}>
                    <h2 id={`${ids}-quick`} className="search-overlay__heading">{t('Quick links', 'விரைவு இணைப்புகள்')}</h2>
                    <ul className="search-overlay__quick-list">
                      {SEARCH_QUICK_LINKS.map((l) => (
                        <li key={l.to}>
                          <Link to={localePath(l.to)} className="search-overlay__quick-link" onClick={closeSearch}>
                            <span className="search-overlay__quick-label">{t(l.label, l.labelTa)}</span>
                            <span className="search-overlay__quick-hint">{t(l.hint, l.hintTa)}</span>
                            <ArrowRight size={18} aria-hidden="true" className="search-overlay__quick-arrow" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="search-overlay__tip">
                      {lang === 'ta'
                        ? <>குறிப்பு: எங்கிருந்தும் தேட <kbd>/</kbd> அல்லது <kbd>Ctrl</kbd> + <kbd>K</kbd> அழுத்துங்கள்.</>
                        : <>Tip: press <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> anywhere to search.</>}
                    </p>
                  </section>
                )}

                {term.length >= 2 && state.status === 'error' && (
                  <p className="search-overlay__msg">
                    {unavailable}{' '}
                    <Link to={localePath(`/search?q=${encodeURIComponent(term)}`)} onClick={closeSearch}>
                      {t('Try the search page', 'தேடல் பக்கத்தை முயலுங்கள்')}
                    </Link>.
                  </p>
                )}

                {term.length >= 2 && state.status === 'loading' && state.results.length === 0 && (
                  <p className="search-overlay__msg" aria-hidden="true">{searching}</p>
                )}

                {state.status === 'done' && state.results.length === 0 && term.length >= 2 && (
                  <ZeroResults q={state.q} onNavigate={closeSearch} />
                )}

                {hasResults && (
                  <>
                    <div className="search-overlay__tabs" role="group" aria-label={t('Filter results by type', 'வகைப்படி முடிவுகளை வடிகட்டுங்கள்')}>
                      {GROUPS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          className="search-overlay__tab"
                          aria-pressed={group === g.id}
                          disabled={!counts[g.id]}
                          onClick={() => { setGroup(g.id); inputRef.current?.focus(); }}
                        >
                          {t(g.label, g.labelTa)}
                          <span className="search-overlay__tab-count">{counts[g.id] || 0}</span>
                        </button>
                      ))}
                    </div>
                    <ul id={listId} role="listbox" aria-label={t('Search results', 'தேடல் முடிவுகள்')} className="search-overlay__results">
                      {shown.map((r, i) => {
                        const g = groupOf(r.type);
                        const status = r.status ? String(r.status) : '';
                        return (
                          <li
                            key={`${r.url}-${i}`}
                            id={`${ids}-opt-${i}`}
                            role="option"
                            aria-selected={active === i}
                            className="search-overlay__result"
                            data-brand={r.brand || undefined}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => go(r.url)}
                          >
                            <span className="search-overlay__chips">
                              <span className="search-overlay__chip">{t(...TYPE_LABEL[g])}</span>
                              {r.brand && BRANDS[r.brand] && (
                                <span className="search-overlay__chip search-overlay__chip--brand">
                                  <span className="search-overlay__brand-dot" aria-hidden="true" />{BRANDS[r.brand].name}
                                </span>
                              )}
                              {status && <span className="search-overlay__chip search-overlay__chip--status">{t(status, STATUS_TA[status.toLowerCase()])}</span>}
                            </span>
                            <span className="search-overlay__result-title">{t(r.title, r.titleTa)}</span>
                            {r.snippet && <span className="search-overlay__result-snippet">{t(r.snippet, r.snippetTa)}</span>}
                            <CornerDownLeft size={16} aria-hidden="true" className="search-overlay__enter" />
                          </li>
                        );
                      })}
                    </ul>
                    <Link to={localePath(`/search?q=${encodeURIComponent(state.q)}`)} className="search-overlay__all" onClick={closeSearch}>
                      {t(`See all results for “${state.q}”`, `“${state.q}”: அனைத்து முடிவுகளையும் பாருங்கள்`)} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
