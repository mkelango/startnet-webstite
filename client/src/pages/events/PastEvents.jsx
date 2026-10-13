// /events/past — Past events archive, by year. Copy: Book 2 §5.1 "Past events (archive)". SEO: Book 1 Part A §9.5.
import { useMemo, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Seo, Section, PageHero, EventCard, Button, EmptyState, Skeleton, CTABand, RevealGroup, EventVideos } from '../../components';
import { featuredVideos } from '../../data/videos.js';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import { useApi } from '../../hooks/useApi.js';
import { webPageLd, itemListLd } from '../../lib/seo.js';
import { eventPath } from '../../components/_utils.js';
import { useFacetParams } from '../programmes/parts/facets.js';
import { brandLabel } from './parts/eventMeta.js';
import { yearOf } from './parts/eventTime.js';
import EventRow from './parts/EventRow.jsx';
import { useMediaQuery } from '../../layout/shell.jsx';
import './parts/eventList.css';
import './PastEvents.css';

const BRAND_ORDER = ['research', 'vibe', 'connect', 'women', 'startnet', 'x'];
const UNDATED = 'undated';
const ts = (e) => {
  const t = Date.parse(e.date);
  return Number.isNaN(t) ? -Infinity : t;
};
/** Newest first; undated archive entries last. */
const newestFirst = (a, b) => (ts(a) === ts(b) ? 0 : ts(b) - ts(a));

export default function PastEvents() {
  const { t, lang } = useLang();
  const yearLabel = (y) => (y === UNDATED ? t('Year to be confirmed', 'ஆண்டு உறுதியாகவில்லை') : y);
  const [retry, setRetry] = useState(0);
  const { data, loading, error } = useApi(`/api/events?when=past${retry ? `&r=${retry}` : ''}`);
  const f = useFacetParams(['brand']);
  const brand = f.values.brand[0];
  // >= 1024px: hairline rows with muted dates (EventRow); below: the shared EventCard grid (DESIGN-v2 6.3).
  const rows = useMediaQuery('(min-width: 1024px)');

  const all = useMemo(
    () => (Array.isArray(data) ? [...data].filter((e) => e.status !== 'upcoming').sort(newestFirst) : []),
    [data]
  );
  const brands = useMemo(() => BRAND_ORDER.filter((b) => all.some((e) => e.brand === b)), [all]);
  const shown = useMemo(() => (brand ? all.filter((e) => e.brand === brand) : all), [all, brand]);

  const years = useMemo(() => {
    const map = new Map();
    shown.forEach((e) => {
      const y = (e.date && yearOf(e.date)) || UNDATED;
      if (!map.has(y)) map.set(y, []);
      map.get(y).push(e);
    });
    return [...map.entries()];
  }, [shown]);

  return (
    <div className="past-events">
      {/* SEO-TA: pending native review */}
      <Seo
        title="Past startup events in Tamil Nadu: event archive"
        titleTa="கடந்த ஸ்டார்ட்அப் நிகழ்வுகள்: நிகழ்வுக் காப்பகம்"
        description="StartNet events since 2023, by year: GenAI Connect 2024, the NIRF Higher Ed Summits, D2C Connect, SaaS Connect, Vibathon 2025 and more. Filter by brand."
        descriptionTa="2023 முதல் ஆண்டு வாரியான StartNet நிகழ்வுகள்: GenAI Connect 2024, NIRF Higher Ed Summit, D2C Connect, SaaS Connect, Vibathon 2025 மற்றும் பல. பிராண்ட் வாரியாக வடிகட்டலாம்."
        jsonLd={[
          webPageLd({
            path: lang === 'ta' ? '/ta/events/past' : '/events/past',
            type: 'CollectionPage',
            lang,
            name: t('Past startup events in Tamil Nadu', 'கடந்த ஸ்டார்ட்அப் நிகழ்வுகள்'),
          }),
          itemListLd({
            name: t('Past StartNet events', 'கடந்த StartNet நிகழ்வுகள்'),
            lang,
            items: all.map((e) => ({ name: (lang === 'ta' && e.titleTa) || e.title, path: eventPath(e) })),
          }),
        ]}
      />

      <PageHero
        eyebrow={t('Past events', 'கடந்த நிகழ்வுகள்')}
        // Public record starts in 2023; edition facts and sources: server/data/events.json. SEO-TA: pending native review
        title={t('Rooms since 2023.', '2023 முதல் அரங்குகள்.')}
        lede={t(
          "StartNet has run rooms since 2023. The archive lists each edition with its date, venue and sources: the 2023 network meetings, GenAI Connect 2024, the NIRF Higher Ed Summits in Salem and Coimbatore, D2C Connect 2024 and SaaS Connect 2025, the Vibe Coding and Vibe Marketing Summits, Vibathon 2025 in Tiruchengode. Investors Summit details and attendance are added once they are verified.",
          '2023 முதல் StartNet நிகழ்வுகளை நடத்தி வருகிறது. காப்பகம் ஒவ்வொரு பதிப்பையும் அதன் தேதி, இடம், ஆதாரங்களுடன் பட்டியலிடுகிறது: 2023 வலையமைப்புச் சந்திப்புகள், GenAI Connect 2024, சேலம், கோயம்புத்தூரில் NIRF Higher Ed Summit, D2C Connect 2024, SaaS Connect 2025, Vibe Coding, Vibe Marketing உச்சி மாநாடுகள், திருச்செங்கோட்டில் Vibathon 2025. Investors Summit விவரங்களும் வருகை எண்ணிக்கையும் சரிபார்க்கப்பட்ட பின் சேர்க்கப்படும்.'
        )}
        breadcrumbs={[{ label: t('Events', 'நிகழ்வுகள்'), to: '/events' }, { label: t('Past events', 'கடந்த நிகழ்வுகள்') }]}
        actions={
          <Button variant="secondary" to="/events" icon={ArrowRight}>
            {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
          </Button>
        }
        // AIWO split hero: copy left, media right. Past events keep the art (PHOTOS.md), unless StartNet supplies
        // this page's own hero photo.
        art={{ variant: 'grid', ratio: '4/5', seed: 23, alt: '' }}
      />

      <Section surface="paper" className="past-events__body" pad="sm">
        {(brands.length > 0 || years.length > 1) && (
          <div className="past-events__nav">
            {brands.length > 0 && (
              <div className="past-events__brands" role="group" aria-label={t('Filter by brand', 'பிராண்ட் வாரியாக வடிகட்டுங்கள்')}>
                <button type="button" className={`chip past-events__chip${!brand ? ' is-on' : ''}`} aria-pressed={!brand} onClick={() => f.setFacet('brand', [])}>
                  {t('All', 'அனைத்தும்')}
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    data-brand={b}
                    className={`chip past-events__chip${brand === b ? ' is-on' : ''}`}
                    aria-pressed={brand === b}
                    onClick={() => f.setFacet('brand', brand === b ? [] : [b])}
                  >
                    <span className="past-events__chip-dot" aria-hidden="true" />
                    {brandLabel(t, b)}
                  </button>
                ))}
              </div>
            )}
            {years.length > 1 && (
              <nav className="past-events__years" aria-label={t('Jump to year', 'ஆண்டுக்குச் செல்லுங்கள்')}>
                {years.map(([y]) => (
                  <a key={y} href={`#year-${y}`} className="past-events__year-link tnum">
                    {y === UNDATED ? t('Undated', 'தேதியில்லை') : y}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        <p className="visually-hidden" role="status" aria-live="polite">
          {loading
            ? t('Loading past events', 'கடந்த நிகழ்வுகள் ஏற்றப்படுகின்றன')
            : t(`${shown.length} past ${shown.length === 1 ? 'event' : 'events'}`, `கடந்த நிகழ்வுகள்: ${shown.length}`)}
        </p>

        <div aria-busy={loading ? 'true' : 'false'}>
          {loading && !data && (
            <div className="past-events__grid" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} height="20rem" radius="var(--radius-lg)" />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="past-events__error" role="alert">
              <p className="h4">{t("We couldn't load the archive just now.", 'காப்பகத்தை இப்போது ஏற்ற முடியவில்லை.')}</p>
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
                <Button variant="whatsapp" href={waLink('Hi StartNet, I am looking for a past event', 'events-past-error')} icon={MessageCircle}>
                  {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && shown.length === 0 && (
            <EmptyState
              title={t('The archive is being rebuilt.', 'காப்பகம் மீண்டும் உருவாக்கப்படுகிறது.')}
              body={t(
                'Entries will list the date, co-hosts, attendance and what happened next.',
                'பதிவுகளில் தேதி, இணை ஏற்பாட்டாளர்கள், வருகை, அதன் பிறகு நடந்தவை இடம்பெறும்.'
              )}
              action={
                <Button to="/events" icon={ArrowRight}>
                  {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
                </Button>
              }
            />
          )}

          {!loading &&
            !error &&
            years.map(([y, items]) => (
              <section key={y} id={`year-${y}`} className="past-events__year" aria-labelledby={`year-h-${y}`}>
                <header className="past-events__year-head">
                  <h2 id={`year-h-${y}`} className={`past-events__year-title tnum${y === UNDATED ? ' is-undated' : ''}`}>
                    {yearLabel(y)}
                  </h2>
                  <p className="caption tnum">
                    {t(`${items.length} ${items.length === 1 ? 'event' : 'events'}`, `${items.length} ${items.length === 1 ? 'நிகழ்வு' : 'நிகழ்வுகள்'}`)}
                  </p>
                </header>
                <RevealGroup as="ul" className={`past-events__grid ev-rows ${rows ? 'ev-rows--rows' : 'ev-rows--cards'}`}>
                  {items.map((e) => (
                    <li key={e.slug}>
                      {rows ? <EventRow event={e} muted /> : <EventCard event={e} />}
                    </li>
                  ))}
                </RevealGroup>
              </section>
            ))}
        </div>
      </Section>

      {/* Films from past editions (data/videos.js, docs/VIDEOS.md) */}
      <Section surface="white" className="past-events__films">
        <EventVideos
          videos={featuredVideos()}
          title={t('Past rooms, on film', 'கடந்த அரங்குகள், காணொளியில்')}
        />
      </Section>

      <CTABand
        surface="night"
        title={t('Want StartNet in your district or college?', 'உங்கள் மாவட்டத்திலோ கல்லூரியிலோ StartNet வேண்டுமா?')}
        actions={
          <Button to="/events#host" icon={ArrowRight}>
            {t('Host an event', 'நிகழ்வை நடத்துங்கள்')}
          </Button>
        }
      />
    </div>
  );
}
