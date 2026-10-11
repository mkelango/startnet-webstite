// /events — Events hub. Copy: Book 2 §5.1. Template: Book 1 Part B T15 (+ §10 facets), Book 3 C24/C35/C37/C46, Book 4 IX-22.
// Tamil: template copy via t() (Book 2 §14 drafts; native review pending). Event titles come from the API.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarDays, LayoutGrid, MessageCircle } from 'lucide-react';
import {
  Seo, Section, SectionHeader, PageHero, EventCard, Button, Badge, EmptyState, Skeleton, CTABand, SmartForm,
  ArtImage, Dot, Reveal, RevealGroup, Accordion,
} from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import { webPageLd, itemListLd } from '../../lib/seo.js';
import { useApi } from '../../hooks/useApi.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useMediaQuery } from '../../layout/shell.jsx';
import FacetBar from '../programmes/parts/FacetBar.jsx';
import { useFacetParams, matchesAll, facetCount, usePaged, labelize, uniqueValues, isPlaceholderValue } from '../programmes/parts/facets.js';
import {
  WHEN, EVENT_FORMATS, EVENT_LANGS, EVENT_PRICES, EVENT_PREDS, EVENT_KEYS, FLAGSHIPS, byDate, seriesLabel,
  flagshipEdition, isConfirmed, dateTextFor, loc, langLabel, brandLabel, nbDots, pickLang,
} from './parts/eventMeta.js';
import { monthKey, monthLabel, eventDay } from './parts/eventTime.js';
import EventCalendar from './parts/EventCalendar.jsx';
import EventRow from './parts/EventRow.jsx';
import { useSlidingIndicator } from '../../components/_indicator.js';
import { DISTRICTS, findDistrict } from '../mega/about-districts/districtsData.js';
import './parts/eventList.css';
import './Events.css';
import { eventPath } from '../../components/_utils.js';
import { seriesPhoto, PHOTO_SIZES } from '../../data/photos.js';

const SPRING = { type: 'spring', bounce: 0, duration: 0.36 };
const BRAND_ORDER = ['research', 'vibe', 'connect', 'women', 'startnet', 'x'];
// URL vocabulary (F-68, as /programmes): mis-cased values are matched ("Vibe" -> "vibe"), unknown ones dropped.
const lowerTrim = (v) => String(v || '').trim().toLowerCase();
const EVENT_VOCAB = {
  when: WHEN.map((o) => o.value),
  format: EVENT_FORMATS.map((o) => o.value),
  brand: BRAND_ORDER,
  series: lowerTrim,
  language: Object.keys(EVENT_LANGS),
  price: EVENT_PRICES.map((o) => o.value),
  // Districts arrive as display names from /districts ("Chennai"); the predicate is case-insensitive, so keep the case.
  district: (v) => String(v || '').trim(),
};

/** List / Calendar: a pill segmented control; one Ink thumb glides to the chosen view (DESIGN-v2 3.12). */
function ViewToggle({ view, onChange }) {
  const { t } = useLang();
  const ref = useRef(null);
  useSlidingIndicator(ref, '[aria-pressed="true"]', [view]);
  return (
    <div className="segmented events-view" role="group" aria-label={t('View', 'காட்சி')} ref={ref}>
      <span className="ind ind--pill" aria-hidden="true" />
      <button type="button" className={`segmented__item events-view__btn${view === 'list' ? ' is-on' : ''}`} aria-pressed={view === 'list'} onClick={() => onChange('list')}>
        <LayoutGrid size={16} aria-hidden="true" />
        <span className="events-view__label">{t('List', 'பட்டியல்')}</span>
      </button>
      <button
        type="button"
        className={`segmented__item events-view__btn${view === 'calendar' ? ' is-on' : ''}`}
        aria-pressed={view === 'calendar'}
        onClick={() => onChange('calendar')}
      >
        <CalendarDays size={16} aria-hidden="true" />
        <span className="events-view__label">{t('Calendar', 'நாள்காட்டி')}</span>
      </button>
    </div>
  );
}

/** "Chennai" / "online" → display label (URL values may be names or slugs). */
/** A district filter value (official English name, or a slug): the official name in each language, else the value made readable. */
function districtLabel(t, d) {
  if (d === 'online') return t('Online', 'ஆன்லைன்');
  const key = String(d || '').trim().toLowerCase();
  const hit = findDistrict(key) || DISTRICTS.find((x) => x.en.toLowerCase() === key);
  return hit ? t(hit.en, hit.ta) : labelize(d);
}

export default function Events() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const [retry, setRetry] = useState(0);
  const [hostOpen, setHostOpen] = useState(false);
  const hostRef = useRef(null);
  const focusHost = useRef(false);
  // 1024–1279: the facet chips fill the bar, so the List/Calendar toggle sits beside the heading instead.
  const toggleInHead = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  // >= 1024px: hairline event rows (EventRow); below: the shared EventCard grid (DESIGN-v2 6.3). Same data and order.
  const rows = useMediaQuery('(min-width: 1024px)');
  const { data, loading, error } = useApi(`/api/events?when=upcoming${retry ? `&r=${retry}` : ''}`);

  const all = useMemo(
    () => (Array.isArray(data) ? data.filter((e) => e.status !== 'past').sort(byDate) : []),
    [data]
  );

  const f = useFacetParams(EVENT_KEYS, EVENT_VOCAB);
  const { values } = f;
  const view = f.params.get('view') === 'calendar' ? 'calendar' : 'list';
  const count = useCallback((k, v) => facetCount(all, values, EVENT_PREDS, k, v), [all, values]);
  const results = useMemo(() => all.filter((e) => matchesAll(e, values, EVENT_PREDS)), [all, values]);
  const paged = usePaged(results, f.signature, 24);

  const groups = useMemo(() => {
    const out = [];
    paged.visible.forEach((e, i) => {
      const k = monthKey(e.date) || 'tbc';
      let g = out[out.length - 1];
      if (!g || g.key !== k) {
        g = { key: k, items: [] };
        out.push(g);
      }
      g.items.push({ e, i });
    });
    return out;
  }, [paged.visible]);

  const urlDistricts = values.district;
  const urlDistrictKey = urlDistricts.join(',');
  const urlLangs = values.language;
  const urlLangKey = urlLangs.join(',');
  const facets = useMemo(() => {
    const districts = uniqueValues(all.filter((e) => e.format !== 'online'), (e) => e.district)
      .filter((d) => !isPlaceholderValue(d))
      .map((d) => ({ value: d, label: labelize(d) }));
    if (all.some((e) => e.format === 'online')) districts.push({ value: 'online', label: t('Online', 'ஆன்லைன்') });
    // A district arriving from the URL (e.g. /districts → /events?district=Chennai) always gets an option,
    // with a 0 count when no event is there yet, so the filter is visible and removable.
    urlDistricts.forEach((d) => {
      if (!districts.some((o) => o.value.toLowerCase() === d.toLowerCase())) districts.push({ value: d, label: districtLabel(t, d) });
    });
    const brandsPresent = new Set(all.map((e) => e.brand));
    const brands = BRAND_ORDER.filter((b) => brandsPresent.has(b) || ['research', 'vibe', 'connect', 'women'].includes(b)).map((b) => ({
      value: b,
      label: brandLabel(t, b),
    }));
    const series = uniqueValues(all, (e) => e.series).map((s) => ({ value: s, label: seriesLabel(s) }));
    const langs = uniqueValues(all, (e) => e.language);
    // A language picked in the URL keeps its option (e.g. ?language=ta when no event is Tamil-only), so its chip is labelled.
    const langList = langs.length ? langs : ['en', 'ta'];
    urlLangs.forEach((l) => { if (!langList.includes(l)) langList.push(l); });
    const languages = langList.map((l) => ({ value: l, label: langLabel(t, l) }));
    return [
      { key: 'when', label: t('When', 'எப்போது'), options: WHEN.map((o) => ({ ...o, label: loc(t, o) })), single: true },
      { key: 'district', label: t('District', 'மாவட்டம்'), options: districts },
      { key: 'format', label: t('Format', 'வடிவம்'), options: EVENT_FORMATS.map((o) => ({ value: o.value, label: loc(t, o) })) },
      { key: 'brand', label: t('Brand', 'பிராண்ட்'), options: brands },
      { key: 'series', label: t('Series', 'தொடர்'), options: series },
      { key: 'language', label: t('Language', 'மொழி'), options: languages },
      { key: 'price', label: t('Price', 'கட்டணம்'), options: EVENT_PRICES.map((o) => ({ value: o.value, label: loc(t, o) })) },
    ].filter((fc) => fc.options.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, t, urlDistrictKey, urlLangKey]);

  const n = results.length;
  const countLine = loading
    ? t('Loading events…', 'நிகழ்வுகள் ஏற்றப்படுகின்றன…')
    : f.activeCount
      ? t(`${n} ${n === 1 ? 'event matches' : 'events match'}`, `${n} நிகழ்வுகள் பொருந்துகின்றன`)
      : t(`${n} upcoming ${n === 1 ? 'event' : 'events'}`, `வரவிருக்கும் நிகழ்வுகள்: ${n}`);

  const district = values.district.find((d) => d !== 'online');
  const districtName = district ? districtLabel(t, district) : '';
  const onlineCount = all.filter((e) => e.format === 'online').length;

  const openHost = ({ behavior } = {}) => {
    setHostOpen(true);
    focusHost.current = true;
    // Two frames: the first commits the opened host section, the second scrolls once its layout is final,
    // then focus moves to the form heading (without a second scroll) so keyboard users land on the form.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        hostRef.current?.scrollIntoView({ behavior: behavior || (reduced ? 'auto' : 'smooth'), block: 'start' });
        const h = document.getElementById('events-host-title');
        if (h && focusHost.current) {
          focusHost.current = false;
          h.setAttribute('tabindex', '-1');
          h.focus({ preventScroll: true });
        }
      })
    );
  };

  // Deep link from elsewhere (e.g. /events#host) opens the host form. Wait until the event list has loaded
  // (or failed), otherwise the list renders afterwards and pushes the form thousands of pixels down.
  const { hash, key: locationKey } = useLocation();
  const handledHash = useRef(null);
  useEffect(() => {
    if (hash !== '#host' || loading || handledHash.current === locationKey) return;
    handledHash.current = locationKey;
    openHost({ behavior: 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, loading, locationKey]);

  /** The flagship's current edition: its date (or date label / "Month YYYY · TBC") and link. */
  const flagshipDate = (fl) => {
    const hit = flagshipEdition(all, fl.series);
    if (!hit) return null;
    let date;
    if (isConfirmed(hit)) date = dateTextFor(hit, t, lang);
    else if (pickLang(hit, 'dateLabel', lang)) date = nbDots(pickLang(hit, 'dateLabel', lang));
    else if (hit.date) date = `${eventDay(hit.date, { month: 'long', year: 'numeric' }, lang)} · ${t('TBC', 'உறுதியாகவில்லை')}`;
    else date = t('Dates soon', 'தேதிகள் விரைவில்');
    return { date, slug: hit.slug, to: eventPath(hit) };
  };

  const toggle = <ViewToggle view={view} onChange={(v) => f.setParam('view', v === 'list' ? null : v)} />;

  return (
    <div className="events">
      {/* Primary keyword: "startup events in Tamil Nadu" (Book 1 §9.2 Events theme). SEO-TA: pending native review. */}
      <Seo
        title="Startup events in Tamil Nadu: find one near you"
        titleTa="தமிழ்நாட்டில் ஸ்டார்ட்அப் நிகழ்வுகள்"
        description="Startup events across Tamil Nadu: Vibathon, GenAI, SaaS and D2C Connects, founder summits and campus build nights. Most first events are free."
        descriptionTa="தமிழ்நாடு முழுவதும் ஸ்டார்ட்அப் நிகழ்வுகள்: Vibathon, GenAI, SaaS, D2C Connect, உச்சி மாநாடுகள், கல்லூரி build nights. பெரும்பாலான முதல் நிகழ்வுகள் இலவசம்."
        jsonLd={[
          webPageLd({
            path: lang === 'ta' ? '/ta/events' : '/events',
            type: 'CollectionPage',
            lang,
            name: t('Startup events in Tamil Nadu', 'தமிழ்நாட்டில் ஸ்டார்ட்அப் நிகழ்வுகள்'),
          }),
          itemListLd({
            name: t('Upcoming StartNet events', 'வரவிருக்கும் StartNet நிகழ்வுகள்'),
            lang,
            items: all.map((e) => ({ name: pickLang(e, 'title', lang), path: eventPath(e) })),
          }),
        ]}
      />

      <PageHero
        eyebrow={t('Events', 'நிகழ்வுகள்')}
        title={t('Find a room full of builders near you.', 'உங்கள் அருகில் உருவாக்குநர்கள் நிறைந்த ஓர் அரங்கைக் கண்டறியுங்கள்.')}
        lede={t(
          'Summits, sector Connects, campus build nights and district editions across Tamil Nadu. Most first events are free.',
          'தமிழ்நாடு முழுவதும் உச்சி மாநாடுகள், துறைசார் Connect நிகழ்வுகள், கல்லூரி build nights, மாவட்டப் பதிப்புகள். பெரும்பாலான முதல் நிகழ்வுகள் இலவசம்.'
        )}
        breadcrumbs={[{ label: t('Events', 'நிகழ்வுகள்') }]}
        actions={
          <>
            <Button href="#events-list" icon={ArrowRight}>
              {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
            </Button>
            <Button variant="secondary" onClick={() => openHost()}>
              {t('Host an event', 'நிகழ்வை நடத்துங்கள்')}
            </Button>
          </>
        }
        art={{ variant: 'network', ratio: '4/5', seed: 11, alt: '', animate: true }}
      />

      {/* Listing */}
      <Section surface="paper" id="events-list" labelledBy="events-list-title" className="events-list">
        <div className="events-list__head">
          <h2 id="events-list-title" className="h2">
            {t('Upcoming events', 'வரவிருக்கும் நிகழ்வுகள்')}
          </h2>
          <p className="events-list__count" role="status" aria-live="polite">
            {countLine}
          </p>
          {toggleInHead && <div className="events-list__head-toggle">{toggle}</div>}
        </div>

        <FacetBar
          className="events-list__bar"
          label={t('Filter events', 'நிகழ்வுகளை வடிகட்டுங்கள்')}
          facets={facets}
          values={values}
          count={count}
          onToggle={f.toggle}
          onClear={f.clear}
          total={n}
          quick={[{ key: 'price', value: 'free', label: t('Free only', 'இலவசம்') }]}
          noun="events"
          clearable={f.activeCount > 0}
          extra={toggleInHead ? undefined : toggle}
        />

        <div className="events-list__results" aria-busy={loading ? 'true' : 'false'}>
          {loading && !data && (
            <div className="events-list__grid" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} height="22rem" radius="var(--radius-lg)" />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="events-error" role="alert">
              <p className="h4">{t("We couldn't load events just now.", 'நிகழ்வுகளை இப்போது ஏற்ற முடியவில்லை.')}</p>
              <p className="text-2">
                {t(
                  'Something went wrong on our side, not yours. Please try again in a minute.',
                  'பிழை எங்கள் பக்கம், உங்களுடையது அல்ல. ஒரு நிமிடம் கழித்து மீண்டும் முயலுங்கள்.'
                )}
              </p>
              <div className="cluster">
                <Button variant="secondary" onClick={() => setRetry((r) => r + 1)}>
                  {t('Try again', 'மீண்டும் முயலுங்கள்')}
                </Button>
                <Button variant="whatsapp" href={waLink('Hi StartNet, which events are coming up near me?', 'events-error')} icon={MessageCircle}>
                  {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && n > 0 && view === 'calendar' && <EventCalendar events={results} />}

          {!loading && !error && n > 0 && view === 'list' && (
            <div ref={paged.gridRef} className="events-list__months">
              {groups.map((g) => (
                <section key={g.key} className="events-month" aria-labelledby={`events-month-${g.key}`}>
                  <h3 id={`events-month-${g.key}`} className="events-month__title">
                    <span>{g.key === 'tbc' ? t('Dates to be confirmed', 'தேதிகள் உறுதியாகவில்லை') : monthLabel(g.key, lang)}</span>
                    <span className="events-month__count tnum">
                      {t(`${g.items.length} ${g.items.length === 1 ? 'event' : 'events'}`, `${g.items.length} ${g.items.length === 1 ? 'நிகழ்வு' : 'நிகழ்வுகள்'}`)}
                    </span>
                  </h3>
                  <motion.ul className={`events-list__grid ev-rows ${rows ? 'ev-rows--rows' : 'ev-rows--cards'}`} role="list">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {g.items.map(({ e, i }) => (
                        <motion.li
                          key={e.slug}
                          layout={reduced ? false : 'position'}
                          data-result-index={i}
                          className="events-list__item"
                          initial={reduced ? false : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8, transition: { duration: 0.16 } }}
                          transition={reduced ? { duration: 0 } : SPRING}
                        >
                          {rows ? <EventRow event={e} headingLevel={4} /> : <EventCard event={e} headingLevel={4} />}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </section>
              ))}
            </div>
          )}

          {!loading && !error && n > 0 && view === 'list' && (
            <div className="events-loadmore">
              <p className="caption tnum">
                {t(`Showing ${paged.shown} of ${paged.total}`, `${paged.total} இல் ${paged.shown} காட்டப்படுகின்றன`)}
              </p>
              {paged.shown < paged.total && (
                <Button variant="secondary" onClick={paged.more}>
                  {t('Load more', 'மேலும் காட்டு')}
                </Button>
              )}
            </div>
          )}

          {!loading && !error && n === 0 && (
            <div className="events-empty">
              <EmptyState
                title={
                  all.length === 0
                    ? t(
                        'New dates are being confirmed. Get them first on WhatsApp or by email.',
                        'புதிய தேதிகள் உறுதிசெய்யப்படுகின்றன. WhatsApp அல்லது மின்னஞ்சல் வழியாக முதலில் பெறுங்கள்.'
                      )
                    : district
                      ? t(`No events in ${districtName} yet.`, `${districtName} மாவட்டத்தில் இன்னும் நிகழ்வுகள் இல்லை.`)
                      : t('No events match. Try fewer filters, or get alerts.', 'பொருந்தும் நிகழ்வுகள் இல்லை. குறைவான வடிகட்டிகளை முயலுங்கள், அல்லது அறிவிப்புகளைப் பெறுங்கள்.')
                }
                body={
                  district && all.length > 0
                    ? t('Try another district, or get alerts for this one.', 'வேறு மாவட்டத்தை முயலுங்கள், அல்லது இந்த மாவட்டத்துக்கான அறிவிப்புகளைப் பெறுங்கள்.')
                    : undefined
                }
                action={
                  <div className="cluster">
                    <Button
                      variant="whatsapp"
                      href={waLink(
                        district ? `Hi StartNet, alert me about events in ${labelize(district)}` : 'Hi StartNet, alert me about new events',
                        'events-alerts'
                      )}
                    >
                      {district
                        ? t(`Get alerts for ${districtName}`, `${districtName} அறிவிப்புகளைப் பெறுங்கள்`)
                        : t('Get event alerts', 'நிகழ்வு அறிவிப்புகளைப் பெறுங்கள்')}
                    </Button>
                    {onlineCount > 0 && !values.format.includes('online') && (
                      <Button variant="tertiary" onClick={() => f.setMany({ format: ['online'] })}>
                        {t(
                          `${onlineCount} online ${onlineCount === 1 ? 'event is' : 'events are'} open to everyone`,
                          `${onlineCount} ஆன்லைன் நிகழ்வுகள் அனைவருக்கும் திறந்துள்ளன`
                        )}
                      </Button>
                    )}
                    {f.activeCount > 0 && (
                      <Button variant="tertiary" onClick={f.clear}>
                        {t('Clear all filters', 'அனைத்து வடிகட்டிகளையும் நீக்கு')}
                      </Button>
                    )}
                  </div>
                }
              />
              {district && (
                <p className="events-empty__host text-2">
                  {t(`No room in ${districtName} yet?`, `${districtName}-இல் இன்னும் அரங்கு இல்லையா?`)}{' '}
                  <button type="button" className="events-link-btn" onClick={() => openHost()}>
                    {t(`Host one in ${districtName}`, `${districtName}-இல் ஒன்றை நடத்துங்கள்`)} →
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Flagships strip (Book 2 §5.1) */}
      <Section surface="white" className="events-flagships">
        <SectionHeader eyebrow={t('Events', 'நிகழ்வுகள்')} title={t('Flagships', 'முதன்மை நிகழ்வுகள்')} />
        <RevealGroup as="ul" className="events-flagships__grid">
          {FLAGSHIPS.map((fl, i) => {
            const hit = flagshipDate(fl);
            return (
              <li key={fl.key} className="events-flagship" data-brand={fl.brand || undefined}>
                {/* AIWO portfolio card: a 4:3 media slot over the label, title, date and arrow link. Event cards show
                    only that series' own photo (PHOTOS.md "event pages are strict"); otherwise the slot keeps its art. */}
                <div className="events-flagship__media">
                  <ArtImage
                    variant={['network', 'grid', 'dot', 'map'][i % 4]}
                    ratio="4/3"
                    seed={41 + i}
                    brand={fl.brand || undefined}
                    photo={seriesPhoto(fl.series)}
                    sizes={PHOTO_SIZES.card}
                    alt=""
                  />
                </div>
                <div className="events-flagship__top">
                  <p className="eyebrow">{fl.brand ? `StartNet ${brandLabel(t, fl.brand)}` : t('All brands', 'அனைத்து பிராண்டுகளும்')}</p>
                  {fl.proposed && <Badge kind="type">{t('[proposed]', '[முன்மொழிவு]')}</Badge>}
                </div>
                <h3 className="h4 events-flagship__name">{fl.name}</h3>
                {fl.note && <p className="caption">{t(fl.note, fl.noteTa)}</p>}
                <p className="events-flagship__date">
                  <CalendarDays size={16} aria-hidden="true" />
                  <span>{hit ? hit.date : t('Dates soon', 'தேதிகள் விரைவில்')}</span>
                </p>
                <div className="events-flagship__cta">
                  {fl.to ? (
                    <Button variant="tertiary" to={hit ? hit.to : fl.to}>
                      {t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
                    </Button>
                  ) : (
                    <Button variant="tertiary" href={waLink(`Hi StartNet, register my interest in ${fl.name}`, `flagship:${fl.key}`)}>
                      {t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Past events archive teaser */}
      <Section surface="paper" className="events-past">
        <div className="events-past__grid">
          <Reveal className="events-past__copy">
            <p className="eyebrow">{t('Past events', 'கடந்த நிகழ்வுகள்')}</p>
            <h2 className="display-xl events-past__title">
              {/* Public record starts in 2023; edition facts and sources: server/data/events.json. SEO-TA: pending native review */}
              {t('Rooms since 2023', '2023 முதல் அரங்குகள்')}<Dot />
            </h2>
            <p className="body-lg text-2">
              {t(
                "StartNet has run rooms since 2023. The archive lists each edition with its date and venue: GenAI Connect 2024 in Salem, D2C Connect 2024 and SaaS Connect 2025 in Coimbatore, Vibathon 2025 in Tiruchengode, the Vibe Marketing Summit in Salem. Investors Summit details and attendance are added once they are verified.",
                '2023 முதல் StartNet நிகழ்வுகளை நடத்தி வருகிறது. காப்பகம் ஒவ்வொரு பதிப்பையும் அதன் தேதி, இடத்துடன் பட்டியலிடுகிறது: சேலத்தில் GenAI Connect 2024, கோயம்புத்தூரில் D2C Connect 2024, SaaS Connect 2025, திருச்செங்கோட்டில் Vibathon 2025, சேலத்தில் Vibe Marketing Summit. Investors Summit விவரங்களும் வருகை எண்ணிக்கையும் சரிபார்க்கப்பட்ட பின் சேர்க்கப்படும்.'
              )}
            </p>
            <Button variant="tertiary" to="/events/past">
              {t('Browse past events', 'கடந்த நிகழ்வுகளைப் பாருங்கள்')}
            </Button>
          </Reveal>
          <Reveal className="events-past__art" delay={0.1} variant="clip">
            <ArtImage variant="grid" ratio="4/3" seed={27} alt="" />
          </Reveal>
        </div>
      </Section>

      {/* AEO FAQ: drafted from Book 2 §5.1 (sub-head, filters, card microcopy, archive, host band) — StartNet review */}
      <Section surface="white" labelledBy="events-faq-title" className="events-faq">
        <div className="grid-12 events-faq__grid">
        <div className="col-5 events-faq__head">
          <SectionHeader id="events-faq-title" eyebrow={t('Questions', 'கேள்விகள்')} title={t('Common questions', 'பொதுவான கேள்விகள்')} />
        </div>
        <div className="col-6 events-faq__list">
        <Accordion
          faq
          items={[
            {
              id: 'events-faq-near',
              question: t('How do I find a startup event near me in Tamil Nadu?', 'தமிழ்நாட்டில் என் அருகில் உள்ள ஸ்டார்ட்அப் நிகழ்வை எப்படிக் கண்டறிவது?'),
              answer: t(
                'Filter the list on this page by district, brand, series, format, language or price, or switch to the calendar view. Each event shows its date, venue or "Online", language and price.',
                'இந்தப் பக்கத்தின் பட்டியலை மாவட்டம், பிராண்ட், தொடர், வடிவம், மொழி அல்லது கட்டணம் வாரியாக வடிகட்டுங்கள், அல்லது நாட்காட்டிக் காட்சிக்கு மாறுங்கள். ஒவ்வொரு நிகழ்விலும் தேதி, இடம் அல்லது "ஆன்லைன்", மொழி, கட்டணம் இருக்கும்.'
              ),
            },
            {
              id: 'events-faq-free',
              question: t('Are StartNet events free?', 'StartNet நிகழ்வுகள் இலவசமா?'),
              answer: t(
                'Most first events are free. Each event shows its price: free, a ticket price or invite only.',
                'பெரும்பாலான முதல் நிகழ்வுகள் இலவசம். ஒவ்வொரு நிகழ்விலும் கட்டணம் காட்டப்படும்: இலவசம், டிக்கெட் விலை அல்லது அழைப்பின் பேரில் மட்டும்.'
              ),
            },
            {
              id: 'events-faq-register',
              question: t('How do I register for an event?', 'ஒரு நிகழ்வுக்கு எப்படிப் பதிவு செய்வது?'),
              answer: t(
                'Open the event and choose Register. You can register on WhatsApp in under a minute. For flagships without dates yet, choose Register interest to hear when registration opens.',
                'நிகழ்வைத் திறந்து "பதிவு செய்யுங்கள்" என்பதைத் தேர்ந்தெடுங்கள். WhatsApp-இல் ஒரு நிமிடத்துக்குள் பதிவு செய்யலாம். இன்னும் தேதி அறிவிக்கப்படாத முதன்மை நிகழ்வுகளுக்கு, "ஆர்வத்தைப் பதிவு செய்யுங்கள்" என்பதைத் தேர்ந்தெடுங்கள்.'
              ),
            },
            {
              id: 'events-faq-past',
              question: t('Where can I see past StartNet events?', 'கடந்த StartNet நிகழ்வுகளை எங்கே பார்க்கலாம்?'),
              answer: t(
                // SEO-TA: pending native review
                'On Past events, by year: GenAI Connect 2024 (Salem), D2C Connect 2024 and SaaS Connect 2025 (Coimbatore), Vibathon 2025 (Tiruchengode) and the Vibe Marketing Summit (Salem), each with its date and venue. Investors Summit details and attendance are added once they are verified.',
                'கடந்த நிகழ்வுகள் பக்கத்தில், ஆண்டு வாரியாக: GenAI Connect 2024 (சேலம்), D2C Connect 2024, SaaS Connect 2025 (கோயம்புத்தூர்), Vibathon 2025 (திருச்செங்கோடு), Vibe Marketing Summit (சேலம்); ஒவ்வொன்றும் அதன் தேதி, இடத்துடன். Investors Summit விவரங்களும் வருகை எண்ணிக்கையும் சரிபார்க்கப்பட்ட பின் சேர்க்கப்படும்.'
              ),
            },
            {
              id: 'events-faq-host',
              question: t('Can StartNet run an event in my college or district?', 'என் கல்லூரியிலோ மாவட்டத்திலோ StartNet நிகழ்வு நடத்த முடியுமா?'),
              answer: t(
                'Yes. Choose Host an event on this page and tell us about your district or college, the kind of event and roughly when.',
                'ஆம். இந்தப் பக்கத்தில் "நிகழ்வை நடத்துங்கள்" என்பதைத் தேர்ந்தெடுத்து, உங்கள் மாவட்டம் அல்லது கல்லூரி, நிகழ்வின் வகை, தோராயமான நேரம் பற்றிச் சொல்லுங்கள்.'
              ),
            },
          ]}
        />
        </div>
        </div>
      </Section>

      {/* Host band — the page's one Night band */}
      <CTABand
        surface="night"
        title={t('Want StartNet in your district or college?', 'உங்கள் மாவட்டத்திலோ கல்லூரியிலோ StartNet வேண்டுமா?')}
        actions={
          <Button variant="primary" onClick={() => openHost()} icon={ArrowRight}>
            {t('Host an event', 'நிகழ்வை நடத்துங்கள்')}
          </Button>
        }
      />

      <div ref={hostRef} id="host" className="events-host-anchor" />
      {hostOpen && (
        <Section surface="white" width="narrow" className="events-host">
          <SectionHeader
            id="events-host-title"
            eyebrow={t('Host an event', 'நிகழ்வை நடத்துங்கள்')}
            title={t('Tell us about your district or college', 'உங்கள் மாவட்டம் அல்லது கல்லூரி பற்றிச் சொல்லுங்கள்')}
          />
          <div className="form-card events-host__card">
          <SmartForm
            type="host"
            className="events-host__form"
            fields={[
              { name: 'name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
              { name: 'email', type: 'email', label: t('Email', 'மின்னஞ்சல்'), required: true, autoComplete: 'email' },
              { name: 'phone', type: 'tel', label: t('Mobile (optional)', 'கைபேசி (விருப்பத்தேர்வு)'), autoComplete: 'tel-national' },
              { name: 'organisation', label: t('College or organisation', 'கல்லூரி அல்லது நிறுவனம்'), required: true, autoComplete: 'organization' },
              { name: 'district', label: t('District', 'மாவட்டம்'), required: true, defaultValue: district ? labelize(district) : undefined },
              {
                name: 'message',
                type: 'textarea',
                label: t('Your message', 'உங்கள் செய்தி'),
                hint: t('What kind of event, and roughly when?', 'எந்த வகை நிகழ்வு, தோராயமாக எப்போது?'),
              },
            ]}
            consents={[
              {
                purpose: 'contact',
                label: t('StartNet may use these details to reply to this enquiry.', 'இந்த விசாரணைக்குப் பதிலளிக்க StartNet இந்த விவரங்களைப் பயன்படுத்தலாம்.'),
                required: true,
              },
            ]}
            submitLabel={t('Send message', 'செய்தியை அனுப்புங்கள்')}
            successTitle={t("Thanks. We've received your request.", 'நன்றி. உங்கள் கோரிக்கை கிடைத்தது.')}
            successBody={t(
              // Response time confirmed by StartNet, Oct 2026. SEO-TA: pending native review
              'We reply within two working days.',
              'இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.'
            )}
            hidden={{ source: 'events-host' }}
          />
          </div>
        </Section>
      )}
    </div>
  );
}
