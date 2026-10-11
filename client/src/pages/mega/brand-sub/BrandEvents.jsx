// /research/events · /vibe/events · /connect/events · /women/events — brand filtered view of /events.
// Template: Book 1 Part B T15. Facets (§10, /events): when · district · format · language · price (brand is fixed).
// §7.4: canonicalises to itself with unique intro copy; event pages stay canonical at /events/<slug>.
// Copy for the host band and empty states: Book 2 §5.1. Renders inside BrandLayout for the brand in the path.
import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, SectionHeader, EventCard, Card, RevealGroup, EmptyState, Skeleton, Button,
  CTABand,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { waLink } from '../../../lib/links.js';
import { BRANDS } from '../../../data/brands.js';
import NotFound from '../../utility/NotFound.jsx';
import { BRAND_EVENTS, EVENT_FORMATS, EVENT_LANGS, EVENT_PRICES } from './brandSubData.js';
import { FacetChips, useBrandKey, useTp, isPh, districtOption } from './BrandSubParts.jsx';
import '../../brands/brandPage.css';
import './BrandSubParts.css';
import './BrandEvents.css';
import { itemListLd } from '../../../lib/seo.js';
import { eventPath } from '../../../components/_utils.js';
import { pageLd } from '../../brands/seoBits.js';
import { useSlidingIndicator } from '../../../components/_indicator.js';
import { seriesPhoto } from '../../../data/photos.js';

const PAGE = 12;
const ts = (e) => (e && e.date ? Date.parse(e.date) : NaN);
const byDateAsc = (a, b) => (Number.isNaN(ts(a)) ? 1 : Number.isNaN(ts(b)) ? -1 : ts(a) - ts(b));
const byDateDesc = (a, b) => (Number.isNaN(ts(a)) ? 1 : Number.isNaN(ts(b)) ? -1 : ts(b) - ts(a));

export default function BrandEvents({ brand: brandProp }) {
  const brand = useBrandKey(brandProp);
  if (!brand) return <NotFound />;
  return <EventsView key={brand} brand={brand} />;
}

function EventsView({ brand }) {
  const { t, lang } = useLang();
  const tp = useTp();
  const b = BRANDS[brand];
  const copy = BRAND_EVENTS[brand];
  const [params, setParams] = useSearchParams();
  const when = params.get('when') === 'past' ? 'past' : 'upcoming';
  const format = params.get('format') || '';
  const language = params.get('lang') || '';
  const price = params.get('price') || '';
  const district = params.get('district') || '';
  const [shown, setShown] = useState(PAGE);

  const { data, loading, error } = useApi(`/api/events?brand=${brand}`);
  const whenRef = useRef(null);
  useSlidingIndicator(whenRef, '[aria-pressed="true"]', [when, loading, lang]);
  const events = useMemo(() => (Array.isArray(data) ? data.filter((e) => e && e.brand === brand) : []), [data, brand]);
  const upcoming = useMemo(() => events.filter((e) => e.status !== 'past').sort(byDateAsc), [events]);
  const past = useMemo(() => events.filter((e) => e.status === 'past').sort(byDateDesc), [events]);
  const pool = when === 'past' ? past : upcoming;

  const preds = {
    format: (e, v) => e.format === v,
    lang: (e, v) => e.language === v,
    price: (e, v) => e.price === v,
    district: (e, v) => e.district === v,
  };
  const values = { format, lang: language, price, district };
  const matches = (e, skip) => Object.entries(values).every(([k, v]) => k === skip || !v || preds[k](e, v));
  const count = (key) => (v) => pool.filter((e) => matches(e, key) && preds[key](e, v)).length;
  const results = pool.filter((e) => matches(e));
  const visible = results.slice(0, shown);
  const filtered = !!(format || language || price || district);
  const districts = [...new Set(pool.map((e) => e.district).filter((d) => d && !isPh(d)))].sort().map(districtOption);

  // Closest match (Book 1 §10): when this brand has nothing upcoming, point to what is open across StartNet.
  const needGlobal = !loading && !error && when === 'upcoming' && upcoming.length === 0;
  const global = useApi(needGlobal ? '/api/events?when=upcoming' : null);
  const globalCount = Array.isArray(global.data) ? global.data.filter((e) => e && e.status !== 'past').length : 0;

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
    setShown(PAGE);
  };
  const setWhen = (v) => {
    const next = new URLSearchParams();
    if (v === 'past') next.set('when', 'past');
    setParams(next, { replace: true });
    setShown(PAGE);
  };
  const clearFilters = () => setWhen(when);

  const brandName = b.name;
  const alertsHref = waLink(
    t(
      `Hi StartNet ${b.descriptor}, please alert me about new ${b.descriptor} events.`,
      `வணக்கம் StartNet ${b.descriptor}, புதிய ${b.descriptor} நிகழ்வுகள் பற்றி எனக்குத் தெரிவியுங்கள்.`
    ),
    `${brand}-events, ${lang}`
  );

  return (
    <div className="brand-events">
      <Seo
        title={t(copy.seo, copy.seoTa || `${b.descriptor} நிகழ்வுகள் · ${b.name}`)}
        titleTa={copy.seoTa}
        description={t(copy.meta, copy.metaTa)}
        descriptionTa={copy.metaTa}
        jsonLd={[
          pageLd({ path: `${b.base}/events`, lang, type: 'CollectionPage', name: t(copy.seo, copy.seoTa), description: t(copy.meta, copy.metaTa) }),
          // Event pages stay canonical at /events/<slug> and carry the Event markup; this lists them.
          itemListLd({ name: t(copy.seo, copy.seoTa), items: [...upcoming, ...past].filter((e) => e.slug && !isPh(e.title)).map((e) => ({ name: t(e.title, e.titleTa), path: eventPath(e) })), lang }),
        ]}
      />

      <div className="bp-crumbs" data-surface="night">
        <div className="container bsub-crumbs">
          <Breadcrumbs items={[{ label: brandName, to: b.base }, { label: t('Events', 'நிகழ்வுகள்') }]} />
        </div>
      </div>

      <BrandHero
        brand={brand}
        compact
        title={tp(copy.title)}
        lede={tp(copy.lede)}
        actions={
          <>
            <Button variant="brand" href="#brand-events-list">{t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}</Button>
            <Button variant="tertiary" to={`/events?brand=${brand}`} icon={ArrowRight}>{t('All StartNet events', 'அனைத்து StartNet நிகழ்வுகள்')}</Button>
          </>
        }
      />

      {/* Series strip: the brand's evergreen series pages */}
      <Section surface="paper" pad="sm" labelledBy="brand-events-series">
        <SectionHeader
          id="brand-events-series"
          eyebrow={t('Series', 'தொடர்கள்')}
          title={t(`${b.descriptor} series and flagships`, `${b.descriptor} தொடர்களும் முதன்மை நிகழ்வுகளும்`)}
        />
        <RevealGroup as="ul" className="brand-events__series" role="list">
          {copy.series.map((s, i) => (
            <li key={s.to}>
              <Card
                to={s.to}
                brand={brand}
                title={tp(s.label)}
                body={tp(s.body)}
                art={{ variant: ['network', 'grid', 'dot', 'kolam'][i % 4], seed: 60 + i, ratio: '21/9', brand, photo: seriesPhoto(s.to) }}
              />
            </li>
          ))}
        </RevealGroup>
      </Section>

      <Section surface="white" id="brand-events-list" labelledBy="brand-events-heading">
        <div className="brand-events__head">
          <h2 id="brand-events-heading" className="h3">
            {when === 'past'
              ? t(`Past ${b.descriptor} events`, `கடந்த ${b.descriptor} நிகழ்வுகள்`)
              : t(`Upcoming ${b.descriptor} events`, `வரவிருக்கும் ${b.descriptor} நிகழ்வுகள்`)}
          </h2>
          <div ref={whenRef} className="segmented brand-events__when" role="group" aria-label={t('When', 'எப்போது')}>
            <span className="ind ind--pill" aria-hidden="true" />
            <button type="button" className="segmented__item brand-events__when-btn" aria-pressed={when === 'upcoming'} onClick={() => setWhen('upcoming')}>
              {t('Upcoming', 'வரவிருப்பவை')} {!loading && !error && <span className="brand-events__n">{upcoming.length}</span>}
            </button>
            <button type="button" className="segmented__item brand-events__when-btn" aria-pressed={when === 'past'} onClick={() => setWhen('past')}>
              {t('Past', 'கடந்தவை')} {!loading && !error && <span className="brand-events__n">{past.length}</span>}
            </button>
          </div>
        </div>

        {pool.length > 0 && (
          <div className="brand-events__filters" role="group" aria-label={t('Filter events', 'நிகழ்வுகளை வடிகட்டு')}>
            {districts.length > 1 && (
              <FacetChips id="bev-district" label={t('District', 'மாவட்டம்')} options={districts} value={district} onChange={(v) => set('district', v)} counts={count('district')} />
            )}
            <FacetChips id="bev-format" label={t('Format', 'வடிவம்')} options={EVENT_FORMATS} value={format} onChange={(v) => set('format', v)} counts={count('format')} />
            <FacetChips id="bev-lang" label={t('Language', 'மொழி')} options={EVENT_LANGS} value={language} onChange={(v) => set('lang', v)} counts={count('lang')} />
            <FacetChips id="bev-price" label={t('Price', 'கட்டணம்')} options={EVENT_PRICES} value={price} onChange={(v) => set('price', v)} counts={count('price')} />
          </div>
        )}

        {pool.length > 0 && !loading && (
          <p className="brand-events__count" aria-live="polite">
            <span>
              {t(
                `Showing ${visible.length} of ${results.length} ${results.length === 1 ? 'event' : 'events'}`,
                `${results.length} நிகழ்வுகளில் ${visible.length} காட்டப்படுகின்றன`
              )}
            </span>
            {filtered && (
              <button type="button" className="brand-events__clear" onClick={clearFilters}>{t('Clear all', 'அனைத்தையும் அழி')}</button>
            )}
          </p>
        )}

        {loading ? (
          <div className="brand-events__grid" aria-hidden="true"><Skeleton height="22rem" count={3} /></div>
        ) : error ? (
          <EmptyState
            title={t("We couldn't load events just now.", 'இப்போது நிகழ்வுகளை ஏற்ற முடியவில்லை.')}
            body={t('Check your connection and try again.', 'இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும்.')}
            action={
              <div className="cluster brand-events__actions">
                <Button variant="secondary" onClick={() => window.location.reload()}>{t('Try again', 'மீண்டும் முயலவும்')}</Button>
                <Button variant="tertiary" to="/events">{t('All events', 'அனைத்து நிகழ்வுகள்')}</Button>
              </div>
            }
          />
        ) : results.length ? (
          <>
            <RevealGroup as="ul" className="brand-events__grid brand-events__grid--rows" role="list" key={`${when}-${format}-${language}-${price}-${district}`}>
              {visible.map((e) => (
                <li key={e.slug}><EventCard event={e} /></li>
              ))}
            </RevealGroup>
            {shown < results.length && (
              <div className="brand-events__more">
                <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>{t('Load more', 'மேலும் காட்டு')}</Button>
              </div>
            )}
            {when === 'past' && (
              <p className="brand-events__note">
                {t(
                  'We’re rebuilding our event archive. Each entry will list the date, co-hosts, attendance and what happened next.',
                  'எங்கள் நிகழ்வுக் காப்பகத்தை மீண்டும் உருவாக்குகிறோம். ஒவ்வொரு பதிவிலும் தேதி, இணை நடத்துநர்கள், வருகை, அடுத்து நடந்தவை இடம்பெறும்.'
                )}
              </p>
            )}
          </>
        ) : filtered ? (
          <EmptyState
            title={t('No events match.', 'பொருந்தும் நிகழ்வுகள் இல்லை.')}
            body={t(
              `Try another filter, or see all ${pool.length} ${when === 'past' ? 'past' : 'upcoming'} ${b.descriptor} events.`,
              `வேறு வடிகட்டியை முயலவும், அல்லது ${b.descriptor}-இன் ${pool.length} நிகழ்வுகளையும் பாருங்கள்.`
            )}
            action={<Button variant="secondary" onClick={clearFilters}>{t('Clear filters', 'வடிகட்டிகளை அழி')}</Button>}
          />
        ) : when === 'past' ? (
          <EmptyState
            title={t(`No past ${b.descriptor} events are listed yet.`, `கடந்த ${b.descriptor} நிகழ்வுகள் இன்னும் பட்டியலிடப்படவில்லை.`)}
            body={
              <>
                <p>
                  {t(
                    'We’re rebuilding our event archive. Each entry will list the date, co-hosts, attendance and what happened next.',
                    'எங்கள் நிகழ்வுக் காப்பகத்தை மீண்டும் உருவாக்குகிறோம். ஒவ்வொரு பதிவிலும் தேதி, இணை நடத்துநர்கள், வருகை, அடுத்து நடந்தவை இடம்பெறும்.'
                  )}
                </p>
              </>
            }
            action={<Button variant="secondary" to="/events/past">{t('Past events & outcomes', 'கடந்த நிகழ்வுகளும் விளைவுகளும்')}</Button>}
          />
        ) : (
          <EmptyState
            title={t(`No ${b.descriptor} events are open right now.`, `இப்போது ${b.descriptor} நிகழ்வுகள் எதுவும் திறந்திருக்கவில்லை.`)}
            body={
              globalCount > 0
                ? t(
                  `${globalCount} ${globalCount === 1 ? 'event is' : 'events are'} open across StartNet. Or get an alert when the next ${b.descriptor} event opens.`,
                  `StartNet முழுவதும் ${globalCount} நிகழ்வுகள் திறந்துள்ளன. அல்லது அடுத்த ${b.descriptor} நிகழ்வு திறக்கும்போது அறிவிப்பைப் பெறுங்கள்.`
                )
                : t(`Get an alert when the next ${b.descriptor} event opens.`, `அடுத்த ${b.descriptor} நிகழ்வு திறக்கும்போது அறிவிப்பைப் பெறுங்கள்.`)
            }
            action={
              <div className="cluster brand-events__actions">
                <Button variant="secondary" to="/events">{t('See all events', 'அனைத்து நிகழ்வுகளையும் பாருங்கள்')}</Button>
                <Button variant="whatsapp" icon={MessageCircle} href={alertsHref}>{t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')}</Button>
              </div>
            }
          />
        )}

        {results.length > 0 && when === 'upcoming' && (
          <div className="brand-events__foot">
            <p className="small muted">{t('Register on WhatsApp in under a minute.', 'ஒரு நிமிடத்திற்குள் WhatsApp-இல் பதிவு செய்யுங்கள்.')}</p>
            <Button variant="whatsapp" icon={MessageCircle} href={alertsHref}>{t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')}</Button>
          </div>
        )}
      </Section>

      <CTABand
        surface="paper"
        className="brand-close"
        brand={brand}
        title={t('Want StartNet in your district or college?', 'உங்கள் மாவட்டத்தில் அல்லது கல்லூரியில் StartNet வேண்டுமா?')}
        body={t(
          'Colleges, districts and partners host editions with us. Tell us where, and we’ll plan it together.',
          'கல்லூரிகள், மாவட்டங்கள், கூட்டாளர்கள் எங்களுடன் நிகழ்வுகளை நடத்துகிறார்கள். எங்கே என்று சொல்லுங்கள்; சேர்ந்து திட்டமிடுவோம்.'
        )}
        actions={
          <>
            <Button variant="brand" to="/events#host">{t('Host an event', 'ஒரு நிகழ்வை நடத்துங்கள்')}</Button>
            <Button variant="tertiary" to="/events/speak" icon={ArrowRight}>{t('Speak or mentor', 'பேசுங்கள் அல்லது வழிகாட்டுங்கள்')}</Button>
          </>
        }
      />
    </div>
  );
}
