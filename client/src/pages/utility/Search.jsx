import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, MessageCircle, X } from 'lucide-react';
import { Seo, Section, Button, Badge, Tabs, ProgrammeCard, Skeleton, Breadcrumbs, Dot } from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import { ACCEPTING_URL, acceptingCalls } from '../new/callsMeta.js';
import './Search.css';
import { isPlaceholderText } from '../../components/_placeholders.js';

// T14 search results (Book 1 Part B §3.6, §6.2). /search?q=  →  GET /api/search?q=
const TYPE_ORDER = ['programme', 'event', 'report', 'insight', 'story', 'page', 'person'];
// [plural EN, singular EN, plural TA, singular TA]
const TYPE_LABEL = {
  programme: ['Programmes', 'Programme', 'திட்டங்கள்', 'திட்டம்'],
  event: ['Events', 'Event', 'நிகழ்வுகள்', 'நிகழ்வு'],
  report: ['Insights', 'Report', 'நுண்ணறிவுகள்', 'அறிக்கை'],
  insight: ['Insights', 'Insight', 'நுண்ணறிவுகள்', 'நுண்ணறிவு'],
  story: ['Stories', 'Story', 'கதைகள்', 'கதை'],
  page: ['Pages', 'Page', 'பக்கங்கள்', 'பக்கம்'],
  person: ['People', 'Person', 'நபர்கள்', 'நபர்'],
};
const BRAND_KEYS = ['research', 'vibe', 'connect', 'women', 'x'];

const QUICK = [
  { label: 'Vibathon', to: '/vibe/vibathon' },
  { label: 'Open calls', labelTa: 'திறந்த அழைப்புகள்', to: '/programmes/open-calls' },
  { label: 'Founder Ledger', to: '/insights/founder-ledger' },
  { label: 'Join StartNet', labelTa: 'StartNet-இல் இணையுங்கள்', to: '/join' },
];

const PLURALS = { programmes: 'programme', events: 'event', reports: 'report', insights: 'insight', stories: 'story', pages: 'page', people: 'person', ledger: 'report', index: 'report' };
const normType = (type) => {
  const raw = String(type || 'page').toLowerCase();
  const t = PLURALS[raw] || raw;
  return TYPE_LABEL[t] ? t : 'page';
};
// Group "report" and "insight" under one Insights tab.
const tabKey = (type) => (type === 'insight' ? 'report' : type);

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function Highlight({ text, terms }) {
  if (!text) return null;
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'gi');
  return String(text).split(re).map((part, i) =>
    i % 2 === 1 ? <mark key={i} className="search-mark">{part}</mark> : part
  );
}

export default function Search() {
  const { t, localePath, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const [value, setValue] = useState(q);
  const inputRef = useRef(null);

  useEffect(() => { setValue(q); }, [q]);

  const { data, loading, error } = useApi(q ? `/api/search?q=${encodeURIComponent(q)}&lang=${lang}` : null);
  // Results whose title is still only a placeholder (seeded founder stories, unnamed people) are not listed.
  const results = Array.isArray(data?.results) ? data.results.filter((r) => r && !r.placeholder && !isPlaceholderText(r.title)) : [];
  const terms = useMemo(() => q.split(/\s+/).filter((w) => w.length > 1), [q]);

  const groups = useMemo(() => {
    const m = new Map();
    results.forEach((r) => {
      const k = tabKey(normType(r.type));
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(r);
    });
    return TYPE_ORDER.filter((k) => m.has(k)).map((k) => [k, m.get(k)]);
  }, [results]);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = value.trim();
    setParams(next ? { q: next } : {});
  };
  const clear = () => { setValue(''); setParams({}); inputRef.current?.focus(); };

  const list = (items) => (
    <ol className="search-results" role="list">
      {items.map((r, i) => {
        const type = normType(r.type);
        const brand = BRAND_KEYS.includes(r.brand) ? r.brand : null;
        const internal = typeof r.url === 'string' && r.url.startsWith('/');
        const titleNode = <Highlight text={r.title} terms={terms} />;
        return (
          <li key={`${r.url}-${i}`} className="search-result">
            <div className="search-result__chips">
              <Badge kind="type">{t(TYPE_LABEL[type][1], TYPE_LABEL[type][3])}</Badge>
              {brand && <Badge kind="brand" brand={brand} />}
            </div>
            <h3 className="h5 search-result__title">
              {internal ? (
                <Link to={localePath(r.url)} className="search-result__link">{titleNode}</Link>
              ) : (
                <a href={r.url} className="search-result__link">{titleNode}</a>
              )}
            </h3>
            {r.snippet && <p className="search-result__snippet"><Highlight text={r.snippet} terms={terms} /></p>}
            <p className="search-result__url" lang="en">startnet.in{internal ? localePath(r.url) : ''}</p>
          </li>
        );
      })}
    </ol>
  );

  const tabs = groups.length
    ? [
        { id: 'all', label: `${t('All', 'அனைத்தும்')} (${results.length})`, content: list(results) },
        ...groups.map(([k, items]) => ({ id: k, label: `${t(TYPE_LABEL[k][0], TYPE_LABEL[k][2])} (${items.length})`, content: list(items) })),
      ]
    : [];

  return (
    <>
      {/* noindex, follow: internal search results are not indexed (Google search guidelines); links stay followable. */}
      <Seo
        noindex
        title={q ? `${t('Search', 'தேடல்')}: ${q}` : t('Search', 'தேடல்')}
        description={t(
          'Search StartNet programmes, events, Founder Ledger insights, founder stories and every other page on startnet.in.',
          'startnet.in-இல் திட்டங்கள், நிகழ்வுகள், நுண்ணறிவுகள், கதைகள், பக்கங்களைத் தேடுங்கள்.'
        )}
      />

      {/* The head is part of the ink band (AngelList family); results / popular links sit on the sheet below it. */}
      <section className="search-head" data-surface="night" aria-labelledby="search-title">
        <div className="container">
          <Breadcrumbs items={[{ label: t('Search', 'தேடல்') }]} />
          <h1 id="search-title" className="h1 search-head__title">
            {q
              ? (lang === 'ta'
                ? <><span className="search-head__q">“{q}”</span> தேடல் முடிவுகள்</>
                : <>Results for <span className="search-head__q">“{q}”</span></>)
              : <>{t('Search startnet.in', 'startnet.in-இல் தேடுங்கள்')}<Dot /></>}
          </h1>
          <form className="search-form" role="search" onSubmit={onSubmit}>
            <label htmlFor="search-q" className="visually-hidden">{t('Search startnet.in', 'startnet.in-இல் தேடுங்கள்')}</label>
            <div className="search-form__field">
              <SearchIcon aria-hidden="true" size={22} className="search-form__icon" />
              <input
                ref={inputRef}
                id="search-q"
                type="search"
                name="q"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t('Search programmes, events…', 'திட்டங்கள், நிகழ்வுகள்…')}
                autoComplete="off"
                enterKeyHint="search"
                autoFocus={!q}
              />
              {value && (
                <button type="button" className="search-form__clear" onClick={clear} aria-label={t('Clear search', 'தேடலை அழி')}>
                  <X aria-hidden="true" size={18} />
                </button>
              )}
              {/* Below 480px the submit collapses to a 44x44 icon button so the input keeps the width. */}
              <Button type="submit" className="search-form__submit" aria-label={t('Search', 'தேடு')}>
                <span className="search-form__submit-text">{t('Search', 'தேடு')}</span>
                <SearchIcon aria-hidden="true" size={20} className="search-form__submit-icon" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {!q && (
        <Section surface="white" pad="sm" className="search-sheet">
          <div className="search-quick">
            <p className="search-quick__label">{t('Popular:', 'பிரபலமானவை:')}</p>
            <ul role="list" className="search-quick__list">
              {QUICK.map((l) => (
                <li key={l.to}>
                  <Link to={localePath(l.to)} className="search-quick__chip">
                    {l.labelTa ? t(l.label, l.labelTa) : l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {q && (
        <Section surface="white" pad="sm" className="search-sheet">
          <p className="visually-hidden" role="status" aria-live="polite">
            {loading
              ? t('Searching', 'தேடுகிறது')
              : t(
                  `${results.length} ${results.length === 1 ? 'result' : 'results'} for ${q}`,
                  `“${q}”: ${results.length} முடிவுகள்`
                )}
          </p>

          {loading && <Skeleton height="5.5rem" count={4} />}

          {!loading && error && (
            <div className="search-error" role="alert">
              <p>{t('Something went wrong on our side, not yours. Please try again in a minute.', 'எங்கள் பக்கத்தில் ஏதோ தவறு நடந்தது, உங்களுடையதில் அல்ல. ஒரு நிமிடத்தில் மீண்டும் முயலவும்.')}</p>
              <Button onClick={() => window.location.reload()} variant="secondary">{t('Try again', 'மீண்டும் முயலவும்')}</Button>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="search-tabs">
              <Tabs key={q} tabs={tabs} defaultTab="all" label={t('Search results by type', 'வகை வாரியாகத் தேடல் முடிவுகள்')} />
            </div>
          )}

          {!loading && !error && results.length === 0 && <ZeroResults q={q} lang={lang} />}
        </Section>
      )}
    </>
  );
}

function ZeroResults({ q, lang }) {
  const { t, localePath } = useLang();
  // Accepting = open, closing or rolling (status=open alone returns nothing while every call is rolling).
  const { data, loading } = useApi(ACCEPTING_URL);
  const top = acceptingCalls(data).slice(0, 3);
  return (
    <div className="search-zero">
      <div className="search-zero__head">
        <h2 className="h3">
          {lang === 'ta' ? <>“{q}” என்பதற்கு முடிவுகள் இல்லை.</> : <>No results for “{q}”.</>}
        </h2>
        <p className="body-lg text-2">{t('Try a shorter word, or start from one of these.', 'சிறிய சொல்லை முயலவும், அல்லது இவற்றில் ஒன்றிலிருந்து தொடங்கவும்.')}</p>
      </div>
      <div className="search-zero__routes">
        <Link to={localePath('/join')} className="search-zero__route">
          <span className="h5">{t('Not sure where to start? Answer two questions', 'எங்கே தொடங்குவது என்று தெரியவில்லையா? இரண்டு கேள்விகளுக்குப் பதிலளிக்கவும்')}</span>
          <ArrowRight aria-hidden="true" size={20} />
        </Link>
        <a
          href={waLink(`Hi StartNet, I searched for "${q}" and could not find it`, `search, ${lang}`)}
          className="search-zero__route"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="h5">{t('Ask us on WhatsApp', 'WhatsApp-இல் எங்களிடம் கேளுங்கள்')}</span>
          <span className="visually-hidden">{t(' (opens WhatsApp in a new tab)', ' (WhatsApp புதிய தாவலில் திறக்கும்)')}</span>
          <MessageCircle aria-hidden="true" size={20} />
        </a>
      </div>
      {(loading || top.length > 0) && (
        <div className="search-zero__programmes">
          <h3 className="h5">{t('Open programmes', 'திறந்த திட்டங்கள்')}</h3>
          {loading ? (
            <Skeleton height="12rem" />
          ) : (
            <div className="grid grid-3">
              {top.map((p) => <ProgrammeCard key={p.slug} programme={p} />)}
            </div>
          )}
          <Button to="/programmes" variant="tertiary">{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>
        </div>
      )}
    </div>
  );
}
