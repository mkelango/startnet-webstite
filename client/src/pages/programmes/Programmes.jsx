// /programmes — Programmes hub (finder). Copy: Book 2 §4. Template: Book 1 Part B T15 + §10 facets.
// Components: Book 3 C23 (ProgrammeCard), C35 (filters), C37 (load more), C46 (empty/error). Motion: Book 4 IX-19.
// Tamil: every string is t('English', 'தமிழ்') — drafts in the Book 2 §14 register, native review pending
// (Book 2 Appendix A #14). Brand and programme names stay in Latin script.
import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import {
  Seo, Section, SectionHeader, KineticHeadline, Breadcrumbs, ProgrammeCard, Button, EmptyState,
  Skeleton, Scroller, CTABand, TagChip, Reveal, Accordion,
} from '../../components';
import { webPageLd, itemListLd } from '../../lib/seo.js';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import { useApi } from '../../hooks/useApi.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { BRANDS } from '../../data/brands.js';
import FacetBar from './parts/FacetBar.jsx';
import { useFacetParams, matchesAll, facetCount, usePaged } from './parts/facets.js';
import {
  PERSONAS, STAGES, NEEDS, STATUS, FORMATS, LANGUAGES, PRICES, BRAND_LABELS, ACCEPTING,
  PROGRAMME_PREDS, PROGRAMME_KEYS, PROGRAMME_VOCAB, PROGRAMME_INDEX, sortProgrammes, sortCalls, labelIn, levelName, brandLabel,
} from './parts/programmeMeta.js';
import './Programmes.css';

// [English, Tamil draft]
const KEY_LABELS = {
  pool: ['I am', 'நான்'],
  stage: ['Right now I', 'இப்போது நான்'],
  need: ['Need', 'தேவை'],
  brand: ['Brand', 'பிராண்ட்'],
  status: ['Status', 'நிலை'],
  format: ['Format', 'வடிவம்'],
  language: ['Language', 'மொழி'],
  price: ['Price', 'கட்டணம்'],
};
const BRAND_ORDER = ['research', 'vibe', 'connect', 'women', 'x', 'startnet'];
const SPRING = { type: 'spring', bounce: 0, duration: 0.32 };
const tamilCount = (n) => (n === 1 ? 'திட்டம்' : 'திட்டங்கள்');

function FinderQuestion({ id, num, label, children }) {
  return (
    <div className="programmes-finder__q">
      <p className="programmes-finder__label" id={id}>
        <span className="programmes-finder__num tnum" aria-hidden="true">{num}</span>
        {label}
      </p>
      <div className="programmes-finder__opts" role="group" aria-labelledby={id}>
        {children}
      </div>
    </div>
  );
}

function NeedLadder({ from, to }) {
  return (
    <span className="programmes-need__ladder" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <span key={n} className={`programmes-need__rung${n >= from && n <= to ? ' is-on' : ''}${n === to ? ' is-top' : ''}`} style={{ '--rung': n }} />
      ))}
    </span>
  );
}

function ResultsGrid({ items, gridRef, reduced }) {
  return (
    <motion.ul ref={gridRef} className="programmes-results__grid" role="list">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((p, i) => (
          <motion.li
            key={p.slug}
            layout={reduced ? false : 'position'}
            data-result-index={i}
            className="programmes-results__item"
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.97 }}
            transition={reduced ? { duration: 0 } : SPRING}
          >
            <ProgrammeCard programme={p} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default function Programmes() {
  const { t, lang, localePath } = useLang();
  const reduced = useReducedMotion();
  const resultsTitle = useRef(null);
  const [retry, setRetry] = useState(0);
  const { data, loading, error } = useApi(`/api/programmes${retry ? `?r=${retry}` : ''}`);
  const all = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const kl = (k) => t(KEY_LABELS[k][0], KEY_LABELS[k][1]);
  const opts = (list) => list.map((o) => ({ value: o.value, label: labelIn(o, lang) }));

  // Unknown or mis-cased URL values (?brand=Vibe, ?when=bogus) are normalised or dropped, and the URL rewritten.
  const f = useFacetParams(PROGRAMME_KEYS, PROGRAMME_VOCAB);
  const { values } = f;
  const count = useCallback((k, v) => facetCount(all, values, PROGRAMME_PREDS, k, v), [all, values]);

  const results = useMemo(
    () => all.filter((p) => matchesAll(p, values, PROGRAMME_PREDS)).sort(sortProgrammes),
    [all, values]
  );
  const paged = usePaged(results, f.signature, 24);

  // Closest match for the empty state: drop the one filter that brings back the most programmes.
  const closest = useMemo(() => {
    if (results.length || !all.length) return null;
    let best = null;
    PROGRAMME_KEYS.forEach((k) => {
      if (!values[k]?.length) return;
      const items = all.filter((p) => matchesAll(p, values, PROGRAMME_PREDS, k)).sort(sortProgrammes);
      if (items.length && (!best || items.length > best.items.length)) best = { key: k, items };
    });
    return best;
  }, [results.length, all, values]);

  // Shared "accepting" definition and order (closing > open > rolling, then date) with Home, Search and OpenCalls.
  const openCalls = useMemo(() => all.filter((p) => ACCEPTING.includes(p.status)).sort(sortCalls).slice(0, 10), [all]);

  const brandOptions = useMemo(() => {
    const present = new Set(all.map((p) => p.brand).filter(Boolean));
    const keys = BRAND_ORDER.filter((b) => present.has(b) || ['research', 'vibe', 'connect', 'women'].includes(b));
    present.forEach((b) => !keys.includes(b) && keys.push(b));
    return keys.map((b) => ({ value: b, label: BRAND_LABELS[b] ? brandLabel(b, lang) : BRANDS[b]?.descriptor || b }));
  }, [all, lang]);

  const facets = [
    { key: 'brand', label: kl('brand'), options: brandOptions },
    { key: 'status', label: kl('status'), options: opts(STATUS) },
    { key: 'format', label: kl('format'), options: opts(FORMATS) },
    { key: 'language', label: kl('language'), options: opts(LANGUAGES) },
    { key: 'price', label: kl('price'), options: opts(PRICES) },
  ];
  // The finder's answers are set outside the bar; they still get labelled, removable active chips.
  const chipFacets = [
    { key: 'pool', label: kl('pool'), options: opts(PERSONAS), single: true },
    { key: 'stage', label: kl('stage'), options: opts(STAGES), single: true },
    { key: 'need', label: kl('need'), options: opts(NEEDS), single: true },
  ];
  const quick = [
    { key: 'price', value: 'free', label: t('Free', 'இலவசம்') },
    { key: 'format', value: 'online', label: t('Online', 'ஆன்லைன்') },
    { key: 'language', value: 'ta', label: t('Tamil', 'தமிழ்') },
  ];

  const showOpenOnly = () => {
    f.setFacet('status', ACCEPTING);
    document.getElementById('programmes-results')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    // Move focus with the view, so keyboard and screen-reader users land on the filtered results.
    resultsTitle.current?.focus({ preventScroll: true });
  };

  const n = results.length;
  const filtered = f.activeCount > 0;
  const countLine = loading
    ? t('Loading programmes…', 'திட்டங்கள் ஏற்றப்படுகின்றன…')
    : filtered
      ? t(
        `${n} ${n === 1 ? 'programme fits' : 'programmes fit'} you. Free ones first.`,
        `உங்களுக்குப் பொருந்தும் ${tamilCount(n)}: ${n}. இலவசமானவை முதலில்.`
      )
      : t(`All ${n} ${n === 1 ? 'programme' : 'programmes'}. Free ones first.`, `மொத்தம் ${n} ${tamilCount(n)}. இலவசமானவை முதலில்.`);

  const COLS = {
    name: t('Programme', 'திட்டம்'),
    brand: t('Brand', 'பிராண்ட்'),
    for: t('For', 'யாருக்கு'),
    length: t('Length', 'காலம்'),
    cost: t('Cost', 'கட்டணம்'),
  };

  const indexLink = (row) => {
    const hit = all.find((p) => String(p.title).toLowerCase() === row.name.toLowerCase());
    return localePath(hit ? `/programmes/${hit.slug}` : row.fallback);
  };

  return (
    <div className="programmes">
      {/* Primary keyword: "startup programmes in Tamil Nadu" (Book 1 §9.2). SEO-TA: pending native review. */}
      <Seo
        title={t('Startup programmes in Tamil Nadu: find yours', 'தமிழ்நாட்டில் ஸ்டார்ட்அப் திட்டங்கள்')}
        description={t(
          'Startup programmes in Tamil Nadu for students, scholars, professionals and women founders: courses, fellowships, circles and pre-incubation. Free first.',
          'மாணவர்கள், ஆய்வாளர்கள், பணியாளர்கள், பெண் நிறுவனர்களுக்கான StartNet திட்டங்கள்: பாடநெறிகள், ஃபெல்லோஷிப்கள், வட்டங்கள், முன்-இன்குபேஷன். இலவசமானவை முதலில்.'
        )}
        jsonLd={[
          webPageLd({
            path: lang === 'ta' ? '/ta/programmes' : '/programmes',
            type: 'CollectionPage',
            lang,
            name: t('Startup programmes in Tamil Nadu', 'தமிழ்நாட்டில் ஸ்டார்ட்அப் திட்டங்கள்'),
          }),
          itemListLd({
            name: t('StartNet programmes', 'StartNet திட்டங்கள்'),
            lang,
            items: [...all].sort(sortProgrammes).map((p) => ({ name: lang === 'ta' && p.titleTa ? p.titleTa : p.title, path: `/programmes/${p.slug}` })),
          }),
        ]}
      />

      {/* Hero: no image. The finder is the hero (Book 2 §4 image direction). The hero is the ink band
          (data-surface="night"); the results sheet slides over it (Programmes.css). */}
      <section className="programmes-hero" data-surface="night">
        <div className="container">
          <Breadcrumbs items={[{ label: t('Programmes', 'திட்டங்கள்') }]} />
          <div className="programmes-hero__grid">
            <div className="programmes-hero__copy">
              <p className="eyebrow">{t('Programmes', 'திட்டங்கள்')}</p>
              <KineticHeadline
                text={t('Find your next step.', 'உங்கள் அடுத்த படியைக் கண்டறியுங்கள்.')}
                as="h1"
                className="display-xl programmes-hero__title"
              />
              {/* LCP: the lede paints on first render (transform-only entrance, M-11). */}
              <p className="body-lg programmes-hero__lede hero-rise">
                {t(
                  "Tell us who you are and where you are with your idea. We'll show the programmes that fit, starting with the free ones.",
                  'நீங்கள் யார், உங்கள் யோசனை எந்த நிலையில் உள்ளது என்று சொல்லுங்கள். உங்களுக்குப் பொருந்தும் திட்டங்களை, இலவசமானவற்றிலிருந்து தொடங்கிக் காட்டுகிறோம்.'
                )}
              </p>
            </div>

            <Reveal className="programmes-finder" delay={0.1}>
              <FinderQuestion id="finder-q1" num="1" label={t('I am…', 'நான்…')}>
                {PERSONAS.map((p) => {
                  const on = values.pool.includes(p.value);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      className={`programmes-finder__opt${on ? ' is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => f.toggle('pool', p.value, true)}
                    >
                      {labelIn(p, lang)}
                    </button>
                  );
                })}
                <Link to={localePath('/contact')} className="programmes-finder__opt programmes-finder__opt--link">
                  {t('Something else', 'வேறு ஏதாவது')} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </FinderQuestion>

              <FinderQuestion id="finder-q2" num="2" label={t('Right now I…', 'இப்போது நான்…')}>
                {STAGES.map((s) => {
                  const on = values.stage.includes(s.value);
                  return (
                    <button
                      key={s.value}
                      type="button"
                      className={`programmes-finder__opt${on ? ' is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => f.toggle('stage', s.value, true)}
                    >
                      <span className="programmes-finder__opt-text">{labelIn(s, lang)}</span>
                      <span className="programmes-finder__hint tnum">{s.hint}</span>
                    </button>
                  );
                })}
              </FinderQuestion>

              <div className="programmes-finder__foot">
                <p className="programmes-finder__count" aria-hidden="true">
                  <strong className="tnum">{loading ? '…' : n}</strong> {t(n === 1 ? 'programme' : 'programmes', tamilCount(n))}
                </p>
                <Button href="#programmes-results" variant="primary" icon={ArrowRight} className="programmes-finder__submit">
                  {t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Needs + facet bar + results */}
      <Section surface="paper" id="programmes-results" labelledBy="programmes-results-title" className="programmes-results">
        <div className="programmes-needs">
          <h2 id="programmes-results-title" className="h3 programmes-needs__title" tabIndex={-1} ref={resultsTitle}>
            {t('What do you need next?', 'அடுத்து உங்களுக்கு என்ன தேவை?')}
          </h2>
          <ul className="programmes-needs__grid" role="list">
            {NEEDS.map((nd) => {
              const on = values.need.includes(nd.value);
              const c = count('need', nd.value);
              // aria-disabled (not disabled) keeps focus on the card if its count drops to zero while focused.
              const off = !on && c === 0 && !loading;
              return (
                <li key={nd.value}>
                  <button
                    type="button"
                    className={`programmes-need${on ? ' is-on' : ''}`}
                    aria-pressed={on}
                    aria-disabled={off || undefined}
                    onClick={() => { if (!off) f.toggle('need', nd.value, true); }}
                  >
                    <span className="programmes-need__label h5">{labelIn(nd, lang)}</span>
                    <NeedLadder from={nd.from} to={nd.to} />
                    <span className="programmes-need__levels">
                      <span className="tnum">L{nd.from} → L{nd.to}</span> ·{' '}
                      {t(
                        `${levelName(nd.from)} to ${levelName(nd.to)}`,
                        `${levelName(nd.from, 'ta')} முதல் ${levelName(nd.to, 'ta')} வரை`
                      )}
                    </span>
                    <span className="programmes-need__count">
                      <span className="tnum">{loading ? '…' : c}</span> {t(c === 1 ? 'programme' : 'programmes', tamilCount(c))}
                      <ArrowRight size={16} aria-hidden="true" className="programmes-need__arrow" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <FacetBar
          className="programmes-results__bar"
          label={t('Filter programmes', 'திட்டங்களை வடிகட்டுங்கள்')}
          facets={facets}
          chipFacets={chipFacets}
          values={values}
          count={count}
          onToggle={f.toggle}
          onClear={f.clear}
          total={n}
          quick={quick}
          noun="results"
          clearable={f.activeCount > 0}
        />

        <div className="programmes-results__head">
          <p className="programmes-results__count" role="status" aria-live="polite">
            {countLine}
          </p>
        </div>

        <div aria-busy={loading ? 'true' : 'false'}>
          {loading && !data && (
            <div className="programmes-results__grid programmes-results__grid--skeleton" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} height="20rem" radius="var(--radius-lg)" />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="programmes-error" role="alert">
              <p className="h4">{t("We couldn't load programmes just now.", 'இப்போது திட்டங்களை ஏற்ற முடியவில்லை.')}</p>
              <p className="text-2">
                {t(
                  'Something went wrong on our side, not yours. Please try again in a minute.',
                  'பிழை எங்கள் பக்கம், உங்கள் பக்கம் அல்ல. ஒரு நிமிடம் கழித்து மீண்டும் முயலுங்கள்.'
                )}
              </p>
              <div className="cluster">
                <Button variant="secondary" onClick={() => setRetry((r) => r + 1)}>
                  {t('Try again', 'மீண்டும் முயலுங்கள்')}
                </Button>
                <Button
                  variant="whatsapp"
                  href={waLink(t('Hi StartNet, I am looking for a programme', 'வணக்கம் StartNet, நான் ஒரு திட்டத்தைத் தேடுகிறேன்'), 'programmes-error')}
                  icon={MessageCircle}
                >
                  {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && n > 0 && <ResultsGrid items={paged.visible} gridRef={paged.gridRef} reduced={reduced} />}

          {!loading && !error && n > 0 && (
            <div className="programmes-loadmore">
              <p className="programmes-loadmore__status caption tnum">
                {t(`Showing ${paged.shown} of ${paged.total}`, `${paged.total}-இல் ${paged.shown} காட்டப்படுகின்றன`)}
              </p>
              {paged.shown < paged.total && (
                <Button variant="secondary" onClick={paged.more}>
                  {t('Load more', 'மேலும் காட்டுங்கள்')}
                </Button>
              )}
            </div>
          )}

          {!loading && !error && n === 0 && (
            <div className="programmes-empty">
              <EmptyState
                title={t(
                  'Nothing open for this combination right now. Get an alert when something opens.',
                  'இந்தத் தேர்வுக்கு இப்போது எதுவும் திறந்திருக்கவில்லை. ஏதாவது திறக்கும்போது அறிவிப்பைப் பெறுங்கள்.'
                )}
                action={
                  <div className="cluster">
                    <Button
                      variant="whatsapp"
                      href={waLink(
                        t('Hi StartNet, please alert me when a programme opens', 'வணக்கம் StartNet, ஒரு திட்டம் திறக்கும்போது எனக்குத் தெரிவியுங்கள்'),
                        'programmes-alerts'
                      )}
                    >
                      {t('Get alerts', 'அறிவிப்புகளைப் பெறுங்கள்')}
                    </Button>
                    <Button variant="tertiary" onClick={f.clear}>
                      {t('Clear all filters', 'எல்லா வடிகட்டிகளையும் நீக்குங்கள்')}
                    </Button>
                  </div>
                }
              />
              {closest && (
                <div className="programmes-empty__closest">
                  <div className="programmes-empty__closest-head">
                    <h3 className="h5">{t('Closest match', 'நெருக்கமான பொருத்தம்')}</h3>
                    <Button variant="tertiary" onClick={() => f.setFacet(closest.key, [])}>
                      {t(
                        `Remove "${KEY_LABELS[closest.key][0]}" and see ${closest.items.length}`,
                        `"${KEY_LABELS[closest.key][1]}" வடிகட்டியை நீக்கி ${closest.items.length} ${tamilCount(closest.items.length)} பாருங்கள்`
                      )}
                    </Button>
                  </div>
                  <ul className="programmes-results__grid" role="list">
                    {closest.items.slice(0, 3).map((p) => (
                      <li key={p.slug}>
                        <ProgrammeCard programme={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Open calls strip — the page's one Night band */}
      {openCalls.length > 0 && (
        <Section surface="night" className="programmes-open">
          <SectionHeader
            eyebrow={t('Open calls', 'திறந்த அழைப்புகள்')}
            title={t('Applications open now', 'இப்போது விண்ணப்பங்கள் திறந்துள்ளன')}
            lede={t(
              'Closing soonest first, then rolling calls you can join any time.',
              'விரைவில் முடிவடைபவை முதலில், பிறகு எப்போது வேண்டுமானாலும் சேரக்கூடிய தொடர்ச்சியான அழைப்புகள்.'
            )}
            action={
              <Button variant="inverse" onClick={showOpenOnly}>
                {t('Show only open calls', 'திறந்த அழைப்புகளை மட்டும் காட்டுங்கள்')}
              </Button>
            }
          />
          <Scroller label={t('Open calls', 'திறந்த அழைப்புகள்')} itemWidth="min(22rem, 85vw)">
            {openCalls.map((p) => (
              <ProgrammeCard key={p.slug} programme={p} />
            ))}
          </Scroller>
        </Section>
      )}

      {/* Programme index (crawlable, Book 2 §4) */}
      <Section surface="white" labelledBy="programmes-index-title" className="programmes-index">
        <div className="programmes-index__head">
          <h2 id="programmes-index-title" className="h2">
            {t('Programme index', 'திட்டப் பட்டியல்')}
          </h2>
          <p className="text-2 programmes-index__lede">
            {t('Every StartNet programme on one page, by brand.', 'எல்லா StartNet திட்டங்களும் ஒரே பக்கத்தில், பிராண்ட் வாரியாக.')}
          </p>
        </div>
        <div className="programmes-index__table-wrap">
          <table className="programmes-index__table">
            <thead>
              <tr>
                <th scope="col">{COLS.name}</th>
                <th scope="col">{COLS.brand}</th>
                <th scope="col">{COLS.for}</th>
                <th scope="col">{COLS.length}</th>
                <th scope="col">{COLS.cost}</th>
              </tr>
            </thead>
            <tbody>
              {PROGRAMME_INDEX.map((row) => (
                <tr key={row.name} data-brand={row.brand}>
                  <th scope="row" data-label={COLS.name}>
                    <Link to={indexLink(row)} className="programmes-index__name">
                      <span className="programmes-index__bar" aria-hidden="true" />
                      {row.name}
                    </Link>
                  </th>
                  <td data-label={COLS.brand}>
                    <span className="programmes-index__brand">{brandLabel(row.brand, lang)}</span>
                  </td>
                  <td data-label={COLS.for}>{t(row.for, row.forTa)}</td>
                  <td data-label={COLS.length}>{t(row.length, row.lengthTa)}</td>
                  <td data-label={COLS.cost}>
                    <span className="programmes-index__cost">
                      {row.cost.text && <span>{t(row.cost.text, row.cost.textTa)}</span>}
                      {row.cost.tag && <TagChip tag={row.cost.tag} />}
                      {/* The cost placeholder note is not shown; with no published cost the cell is a dash. */}
                      {!row.cost.text && !row.cost.tag && '–'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="caption programmes-index__note">
          {t(
            'Prices exclude GST. Indicative prices are tagged C until the published rate card replaces them.',
            'விலைகள் GST நீங்கலாக. வெளியிடப்படும் கட்டண அட்டவணை வரும்வரை தோராயமான விலைகள் C எனக் குறிக்கப்பட்டுள்ளன.'
          )}
        </p>
      </Section>

      {/* AEO FAQ: drafted from Book 2 §4 (finder, programme index, price note) and §13.4 (Join) — StartNet review */}
      <Section surface="paper" labelledBy="programmes-faq-title" className="programmes-faq">
        <div className="grid-12 programmes-faq__grid">
        <div className="col-5 programmes-faq__head">
        <SectionHeader
          id="programmes-faq-title"
          eyebrow={t('Questions', 'கேள்விகள்')}
          title={t('Common questions', 'பொதுவான கேள்விகள்')}
        />
        </div>
        <div className="col-6 programmes-faq__list">
        <Accordion
          faq
          items={[
            {
              id: 'programmes-faq-find',
              question: t('How do I find a StartNet programme that fits me?', 'எனக்குப் பொருந்தும் StartNet திட்டத்தை எப்படிக் கண்டறிவது?'),
              answer: t(
                'Answer two questions at the top of this page: who you are, and where you are with your idea. The finder then shows the programmes that fit, starting with the free ones.',
                'இந்தப் பக்கத்தின் மேலே உள்ள இரண்டு கேள்விகளுக்குப் பதில் சொல்லுங்கள்: நீங்கள் யார், உங்கள் யோசனை எந்த நிலையில் உள்ளது. பொருந்தும் திட்டங்களை, இலவசமானவற்றிலிருந்து தொடங்கி, finder காட்டும்.'
              ),
            },
            {
              id: 'programmes-faq-open',
              question: t('Which programmes are open for applications now?', 'எந்தத் திட்டங்களுக்கு இப்போது விண்ணப்பிக்கலாம்?'),
              answer: t(
                'The open calls list shows every programme accepting applications, closing soonest first, then rolling calls you can join any time. Use "Show only open calls" on this page, or see Open calls under Programmes.',
                'விண்ணப்பங்களை ஏற்கும் எல்லாத் திட்டங்களையும் திறந்த அழைப்புகள் பட்டியல் காட்டும்: விரைவில் முடிவடைபவை முதலில், பிறகு எப்போது வேண்டுமானாலும் சேரக்கூடியவை. இந்தப் பக்கத்தில் "திறந்த அழைப்புகளை மட்டும் காட்டுங்கள்" என்பதைப் பயன்படுத்துங்கள்.'
              ),
            },
            {
              id: 'programmes-faq-cost',
              question: t('Are StartNet programmes free?', 'StartNet திட்டங்கள் இலவசமா?'),
              answer: t(
                'Some are. Vibe Campus and Vibe Clubs are free, and Vibe Academy has free starter courses. Others are paid, sponsored or by selection: the programme index on this page lists the cost of each. Prices exclude GST, and indicative prices are tagged C until the published rate card replaces them.',
                'சில இலவசம். Vibe Campus, Vibe Clubs இலவசம்; Vibe Academy-இல் இலவசத் தொடக்கப் பாடநெறிகள் உள்ளன. மற்றவை கட்டணம், ஸ்பான்சர் இடங்கள் அல்லது தேர்வு மூலம்: ஒவ்வொன்றின் கட்டணத்தையும் இந்தப் பக்கத்தின் திட்டப் பட்டியல் காட்டும். விலைகள் GST நீங்கலாக; வெளியிடப்படும் கட்டண அட்டவணை வரும்வரை தோராயமான விலைகள் C எனக் குறிக்கப்பட்டுள்ளன.'
              ),
            },
            {
              id: 'programmes-faq-profile',
              question: t('Do I need a StartNet profile to apply?', 'விண்ணப்பிக்க StartNet சுயவிவரம் தேவையா?'),
              answer: t(
                'Yes. You apply on StartNet X, and one profile works for every StartNet programme. Joining is free for individuals.',
                'ஆம். StartNet X-இல் விண்ணப்பிக்கிறீர்கள்; எல்லா StartNet திட்டங்களுக்கும் ஒரே சுயவிவரம். தனிநபர்களுக்கு இணைவது இலவசம்.'
              ),
            },
          ]}
        />
        </div>
        </div>
      </Section>

      <CTABand
        surface="paper"
        title={t('Join StartNet', 'StartNet-இல் இணையுங்கள்')}
        body={t('Free for individuals. One profile for every StartNet programme.', 'தனிநபர்களுக்கு இலவசம். எல்லா StartNet திட்டங்களுக்கும் ஒரே சுயவிவரம்.')}
        actions={
          <>
            <Button to="/join">{t('Join StartNet', 'StartNet-இல் இணையுங்கள்')}</Button>
            <Button
              variant="whatsapp"
              href={waLink(t('Hi StartNet, help me find a programme', 'வணக்கம் StartNet, எனக்குப் பொருந்தும் திட்டத்தைக் கண்டறிய உதவுங்கள்'), 'programmes-cta')}
            >
              {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
            </Button>
          </>
        }
      />
    </div>
  );
}
