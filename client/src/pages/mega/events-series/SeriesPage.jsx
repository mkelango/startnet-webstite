// /events/<series> — Event series (Book 1 Part B §2.2 P1, template T04; §6: series hero with endorsement → about the
// series → upcoming editions → past editions with outcomes → series figures → partnership tiers summary → next
// edition CTA). Canonical record of a series' editions; the brand page (e.g. /vibe/vibathon) is the evergreen view
// and the two cross-link (Book 1 Part B §2.2 note, §7.4).
// Data: GET /api/events?series=<key> (editions), GET /api/metrics?key=… (series figures). Copy: seriesData.js.
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Handshake, Building2 } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Badge, Button, CTABand, FactBand, Stat, TagChip, InlineMarks,
  Skeleton, RevealGroup, Reveal, SmartForm, EmptyState, EventVideos, Scroller,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import { useApi } from '../../../hooks/useApi.js';
import { usePageCta } from '../../../layout/shell.jsx';
import { BRANDS } from '../../../data/brands.js';
import { byDate } from '../../events/parts/eventMeta.js';
import NotFound from '../../utility/NotFound.jsx';
import { isPlaceholderMetric } from '../../../components/_placeholders.js';
import {
  SERIES, CONNECT_ABOUT, CONNECT_PILLARS, isKnownSeries, seriesConfig, nextEdition, editionPath, ART_FOR, seedOf, localizeEvent, enIf,
  SERIES_SEO,
} from './seriesData.js';
import { webPageLd, itemListLd, langPath } from '../../../lib/seo.js';
import { fitTitle, fitDescription } from '../../programmes/parts/seoFit.js';
import { useEventText, EditionCard } from './seriesParts.jsx';
import { recordFigures } from '../../events/parts/EventRecord.jsx';
import './SeriesPage.css';

const KIND_LABEL = {
  flagship: ['Flagship', 'முதன்மை நிகழ்வு'],
  connect: ['Sector Connect', 'துறை Connect'],
  campus: ['Campus series', 'கல்லூரித் தொடர்'],
  research: ['Research series', 'ஆய்வுத் தொடர்'],
  archive: ['From the archive', 'காப்பகத்திலிருந்து'],
  series: ['Event series', 'நிகழ்வுத் தொடர்'],
};
const STATUS = {
  running: ['open', 'Running', 'நடைபெறுகிறது'],
  proposed: ['upcoming', 'Proposed', 'முன்மொழியப்பட்டது'],
  archive: ['closed', 'Archive', 'காப்பகம்'],
};

const pastSort = (a, b) => {
  const x = Date.parse(a.date);
  const y = Date.parse(b.date);
  if (Number.isNaN(x) && Number.isNaN(y)) return 0;
  if (Number.isNaN(x)) return 1;
  if (Number.isNaN(y)) return -1;
  return y - x;
};

/** Past edition row inside the Night band: what happened, tagged outcomes, links to the edition and recap. */
function PastEdition({ e: event }) {
  const x = useEventText();
  const e = localizeEvent(event, x.lang);
  const { localePath } = useLang();
  // Server outcomes plus the edition's own sourced figures (events.json `figures`, each with tag, as-at and source).
  const outcomes = [...(Array.isArray(e.outcomes) ? e.outcomes : []), ...recordFigures(e)];
  return (
    <li className="series-past__item">
      <div className="series-past__head">
        <p className="series-past__when caption" lang={x.whenLang(e)}>{x.when(e)}</p>
        <h3 className="h4 series-past__title">
          <Link to={localePath(editionPath(e))} className="series-past__link" lang={enIf(x.lang, e.title)}>
            {e.title}
          </Link>
        </h3>
        <p className="series-past__summary" lang={enIf(x.lang, e.summary)}>
          <InlineMarks text={e.summary} />
        </p>
      </div>
      {/* No verified outcomes yet: no outcome line (rather than a placeholder). */}
      {outcomes.length > 0 && (
        <dl className="series-past__stats">
          {outcomes.slice(0, 4).map((m) => (
            <Stat key={m.id || m.key} metric={m} dl variant="compact" />
          ))}
        </dl>
      )}
      <div className="cluster series-past__actions">
        <Button variant="tertiary" to={editionPath(e)} icon={ArrowRight}>
          {x.t('See this edition', 'இந்தப் பதிப்பைப் பாருங்கள்')}
        </Button>
        {e.recapSlug && (
          <Button variant="tertiary" to={`/insights/stories/${e.recapSlug}`} icon={ArrowRight}>
            {x.t('Read the recap', 'சுருக்கத்தைப் படியுங்கள்')}
          </Button>
        )}
      </div>
    </li>
  );
}

export default function SeriesPage({ series: seriesProp }) {
  const params = useParams();
  const key = seriesProp || params.series || params.slug || '';
  const { t, lang, localePath } = useLang();
  const x = useEventText();
  const known = isKnownSeries(key);

  const { data, loading, error } = useApi(key ? `/api/events?series=${encodeURIComponent(key)}` : null);
  const events = useMemo(() => (Array.isArray(data) ? data.filter((e) => e.series === key) : []), [data, key]);
  const cfg = useMemo(() => seriesConfig(key, events), [key, events]);
  const { data: figureData } = useApi(cfg.figures?.length ? `/api/metrics?key=${cfg.figures.join(',')}` : null);

  const upcoming = useMemo(() => events.filter((e) => e.status !== 'past').sort(byDate), [events]);
  const past = useMemo(() => events.filter((e) => e.status === 'past').sort(pastSort), [events]);
  const next = useMemo(() => localizeEvent(nextEdition(upcoming, key), lang), [upcoming, key, lang]);
  const brand = cfg.brand && BRANDS[cfg.brand] ? cfg.brand : null;
  const brandName = brand ? BRANDS[brand].name : 'StartNet';
  const registerHref = next ? snxLink(`/events/${next.slug}/register`, { src: 'events-series', brand: brand || undefined, lang }) : null;

  // No open edition: publish nothing, so the bar keeps its default CTA (a same-page link would be dropped by the bar).
  usePageCta(next ? { label: x.register(next), href: registerHref, brand: brand || undefined } : null);

  if (!known && !loading && (error || events.length === 0)) return <NotFound />;

  const about = cfg.about === 'connect' ? CONNECT_ABOUT : cfg.about || [];
  const pillars = cfg.pillars === 'connect' ? CONNECT_PILLARS : cfg.pillars || [];
  const kind = KIND_LABEL[cfg.kind] || KIND_LABEL.series;
  const status = cfg.status ? STATUS[cfg.status] || null : null;
  const kwText = SERIES_SEO[key] ? t(SERIES_SEO[key][0], SERIES_SEO[key][1]) : null;
  // Series figures (M12) that are not already shown against a past edition in the Night band.
  const shownIds = new Set(past.flatMap((e) => (Array.isArray(e.outcomes) ? e.outcomes : []).map((m) => m.id || m.key)));
  // Figures with no value yet are dropped here too (FactBand hides them), so an all-placeholder set leaves no empty band.
  const figures = (Array.isArray(figureData) ? figureData : []).filter((m) => !shownIds.has(m.id || m.key) && !isPlaceholderMetric(m)).slice(0, 4);
  const tiers = Array.isArray(next?.sponsorTiers) ? next.sponsorTiers : [];
  const others = Object.keys(SERIES).filter((k) => k !== key);
  const waText = `${cfg.name.toUpperCase()} updates`;

  const heroActions = (
    <>
      {next ? (
        <Button variant={brand ? 'brand' : 'primary'} size="lg" href={registerHref}>
          {x.register(next)}
        </Button>
      ) : (
        <Button size="lg" to={`/events/${key}#series-interest`}>
          {t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
        </Button>
      )}
      {cfg.evergreen ? (
        <Button variant="secondary" size="lg" to={cfg.evergreen}>
          {cfg.evergreenLabel ? t(cfg.evergreenLabel[0], cfg.evergreenLabel[1]) : t(`About ${cfg.name}`, `${cfg.name} பற்றி`)}
        </Button>
      ) : (
        <Button variant="secondary" size="lg" to="/events">
          {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
        </Button>
      )}
    </>
  );

  return (
    <div className="series-page" data-brand={brand || undefined}>
      {/* SEO: "<Series> editions: <series phrase> in Tamil Nadu" (the editions archive; the brand page owns the
          evergreen "what is it" intent, Book 1 Part B §7.4). SEO-TA: pending native review. */}
      <Seo
        title={
          lang === 'ta'
            ? fitTitle(kwText && `${cfg.name} பதிப்புகள்: தமிழ்நாட்டில் ${kwText}`, kwText && `${cfg.name} பதிப்புகள்: ${kwText}`, `${cfg.name}: அனைத்துப் பதிப்புகளும்`, `${cfg.name} பதிப்புகள்`)
            : fitTitle(kwText && `${cfg.name} editions: ${kwText} in Tamil Nadu`, kwText && `${cfg.name} editions: ${kwText}`, `${cfg.name}: all editions and dates`, `${cfg.name}: all editions`)
        }
        description={fitDescription(
          t(`Every ${cfg.name} edition in one place, with what happened next.`, `ஒவ்வொரு ${cfg.name} பதிப்பும் ஒரே இடத்தில், அதன் பின் நடந்தவையுடன்.`),
          t(cfg.lede[0], cfg.lede[1]),
          [
            next
              ? t(`Register for the next edition on StartNet X or WhatsApp.`, 'அடுத்த பதிப்புக்கு StartNet X அல்லது WhatsApp-இல் பதிவு செய்யுங்கள்.')
              : t('Register interest to hear when dates open.', 'தேதிகள் அறிவிக்கப்படும்போது தெரிந்துகொள்ள ஆர்வத்தைப் பதிவு செய்யுங்கள்.'),
            next ? t('Register on StartNet X or WhatsApp.', 'StartNet X அல்லது WhatsApp-இல் பதிவு செய்யுங்கள்.') : t('Register interest.', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்.'),
          ]
        )}
        jsonLd={[
          webPageLd({ path: langPath(`/events/${key}`, lang), type: 'CollectionPage', lang, name: t(`${cfg.name}: all editions`, `${cfg.name}: அனைத்துப் பதிப்புகளும்`) }),
          itemListLd({
            name: t(`${cfg.name} editions`, `${cfg.name} பதிப்புகள்`),
            lang,
            items: [...upcoming, ...past].map((e) => ({ name: (lang === 'ta' && e.titleTa) || e.title, path: editionPath(e) })),
          }),
        ]}
      />

      <PageHero
        className="series-hero"
        eyebrow={`${t(kind[0], kind[1])} · ${brandName}`}
        title={`${cfg.name}.`}
        lede={
          <>
            {cfg.endorsement && <span className="series-hero__endorse">{t(cfg.endorsement[0], cfg.endorsement[1])}</span>}
            <span className="series-hero__lede">
              <InlineMarks text={t(cfg.lede[0], cfg.lede[1])} />
            </span>
          </>
        }
        breadcrumbs={[{ label: t('Events', 'நிகழ்வுகள்'), to: '/events' }, { label: cfg.name }]}
        actions={heroActions}
        art={{ variant: ART_FOR[brand] || 'dot', brand: brand || undefined, ratio: '4/5', seed: seedOf(key), alt: '', animate: true }}
        meta={
          <div className="cluster series-hero__meta">
            {brand && <Badge kind="brand" brand={brand} />}
            {status && (
              <Badge kind="status" status={status[0]}>
                {/* Start year from seriesData `since` (first edition on record); left out where it is not known. */}
                {cfg.since && cfg.status === 'running'
                  ? t(`${status[1]} since ${cfg.since}`, `${cfg.since} முதல் ${status[2]}`)
                  : t(status[1], status[2])}
              </Badge>
            )}
            <Badge kind="count">
              {loading ? '…' : `${events.length} ${events.length === 1 ? t('edition on record', 'பதிப்பு பதிவில்') : t('editions on record', 'பதிப்புகள் பதிவில்')}`}
            </Badge>
          </div>
        }
      />

      {/* About the series */}
      {(about.length > 0 || pillars.length > 0) && (
        <Section surface="paper" className="series-about" labelledBy="series-about-title">
          <div className="series-about__grid">
            <div className="series-about__text">
              <SectionHeader eyebrow={t('About the series', 'இந்தத் தொடர் பற்றி')} title={<span id="series-about-title">{t(`What ${cfg.name} is`, `${cfg.name} என்றால் என்ன`)}</span>} />
              <div className="prose series-about__prose">
                {about.map((p) => (
                  <p key={p[0]} className="body-lg">
                    <InlineMarks text={t(p[0], p[1])} />
                  </p>
                ))}
              </div>
            </div>
            {pillars.length > 0 && (
              <RevealGroup as="ol" className="series-about__pillars" data-count={pillars.length}>
                {pillars.map((p, i) => (
                  <li key={p.title[0]} className="series-about__pillar">
                    <span className="series-about__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="h4">{t(p.title[0], p.title[1])}</h3>
                    <p className="text-2">
                      <InlineMarks text={t(p.body[0], p.body[1])} />
                    </p>
                  </li>
                ))}
              </RevealGroup>
            )}
          </div>
        </Section>
      )}

      {/* Upcoming editions */}
      <Section surface="white" className="series-upcoming" id="editions" labelledBy="series-upcoming-title">
        <SectionHeader
          eyebrow={t('Upcoming editions', 'வரவிருக்கும் பதிப்புகள்')}
          title={<span id="series-upcoming-title">{next ? t('Next up.', 'அடுத்து வருவது.') : t('No dates yet.', 'இன்னும் தேதிகள் இல்லை.')}</span>}
          lede={next ? null : t('The next edition has not been announced. Register interest and we will tell you when it opens.', 'அடுத்த பதிப்பு இன்னும் அறிவிக்கப்படவில்லை. ஆர்வத்தைப் பதிவு செய்தால், பதிவு திறந்ததும் தெரிவிப்போம்.')}
          action={
            <Button variant="tertiary" to={brand ? `/events?brand=${brand}` : '/events'}>
              {t('See all events', 'அனைத்து நிகழ்வுகளையும் பாருங்கள்')}
            </Button>
          }
        />
        {loading ? (
          <div className="series-grid">
            <Skeleton height="22rem" count={2} />
          </div>
        ) : upcoming.length > 1 ? (
          // Two or more editions: a right-bleed snap Scroller (counter, ring buttons, progress hairline, drag).
          <Scroller label={t('Upcoming editions', 'வரவிருக்கும் பதிப்புகள்')} itemWidth="min(38rem, 85vw)" className="series-scroller">
            {upcoming.map((e) => (
              <EditionCard key={e.slug} event={e} />
            ))}
          </Scroller>
        ) : upcoming.length > 0 ? (
          <RevealGroup as="ul" className="series-grid">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <EditionCard event={e} />
              </li>
            ))}
          </RevealGroup>
        ) : (
          <EmptyState
            title={t('Nothing scheduled in this series right now.', 'இந்தத் தொடரில் தற்போது எதுவும் திட்டமிடப்படவில்லை.')}
            body={t('Get the next date on WhatsApp, or register interest below.', 'அடுத்த தேதியை WhatsApp-இல் பெறுங்கள், அல்லது கீழே ஆர்வத்தைப் பதிவு செய்யுங்கள்.')}
            action={
              <Button variant="whatsapp" href={waLink(waText, `series:${key}`)} icon={MessageCircle}>
                {t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')}
              </Button>
            }
          />
        )}
      </Section>

      {/* Past editions with outcomes — the page's one Night band (evidence). */}
      <Section surface="night" className="series-past" id="past-editions" labelledBy="series-past-title">
        <SectionHeader
          eyebrow={t('Past editions', 'முந்தைய பதிப்புகள்')}
          title={<span id="series-past-title">{t('What happened, edition by edition.', 'ஒவ்வொரு பதிப்பிலும் நடந்தது.')}</span>}
          lede={t(
            "We're rebuilding our event archive. Each entry will list the date, co-hosts, attendance and what happened next. Attendance that cannot be verified is tagged B or C, or left out.",
            'எங்கள் நிகழ்வுக் காப்பகத்தை மீண்டும் உருவாக்குகிறோம். ஒவ்வொரு பதிவிலும் தேதி, இணை நடத்துநர்கள், வருகை, அதன் பின் நடந்தவை இடம்பெறும். சரிபார்க்க முடியாத வருகை எண்கள் B அல்லது C எனக் குறிக்கப்படும், அல்லது விடப்படும்.'
          )}
          action={
            <Button variant="tertiary" to="/events/past">
              {t('All past events', 'அனைத்து முந்தைய நிகழ்வுகளும்')}
            </Button>
          }
        />
        {loading ? (
          <Skeleton height="10rem" count={2} />
        ) : past.length > 0 ? (
          <ol className="series-past__list">
            {past.map((e) => (
              <PastEdition key={e.slug} e={e} />
            ))}
          </ol>
        ) : (
          <p className="series-past__empty">
            {t('No past editions on record yet.', 'இதுவரை முந்தைய பதிப்புகள் எதுவும் பதிவில் இல்லை.')}
          </p>
        )}
        {/* Verified films of this series (data/videos.js); renders nothing when there are none */}
        <EventVideos series={key} headingLevel={3} className="series-past__films" />
      </Section>

      {/* Series figures (M12) */}
      {figures.length > 0 && (
        <Section surface="paper" className="series-figures" pad="sm">
          <FactBand
            metrics={figures}
            title={cfg.brand === 'connect' ? t('StartNet Connect, all sectors', 'StartNet Connect, அனைத்துத் துறைகளும்') : t(`${cfg.name} in figures`, `எண்களில் ${cfg.name}`)}
            footnote={t('Every figure carries a source and a confidence tag. Planning targets are tagged C.', 'ஒவ்வொரு எண்ணுக்கும் ஆதாரமும் நம்பகத்தன்மைக் குறியும் உண்டு. திட்ட இலக்குகள் C எனக் குறிக்கப்படுகின்றன.')}
            link={{ label: t('How we count', 'நாங்கள் எப்படிக் கணக்கிடுகிறோம்'), to: '/about/evidence-standard' }}
          />
        </Section>
      )}

      {/* Partnership tiers summary (M11) + host / co-host */}
      <Section surface="sunken" className="series-partner" id="sponsor" labelledBy="series-partner-title">
        <div className="series-partner__grid">
          <div className="series-partner__tiers">
            <SectionHeader
              eyebrow={t('Partner with this series', 'இந்தத் தொடருடன் கூட்டு சேருங்கள்')}
              title={<span id="series-partner-title">{t(`Sponsor ${cfg.name}.`, `${cfg.name}-க்கு ஸ்பான்சர் செய்யுங்கள்.`)}</span>}
              lede={t('Sponsors and co-hosts appear on this page only once an agreement is signed.', 'ஒப்பந்தம் கையெழுத்தான பிறகே ஸ்பான்சர்களும் இணை நடத்துநர்களும் இந்தப் பக்கத்தில் இடம்பெறுவார்கள்.')}
            />
            {tiers.length > 0 ? (
              <>
                <div className="series-tiers" role="region" aria-label={t('Sponsor tiers', 'ஸ்பான்சர் நிலைகள்')} tabIndex={0}>
                  {/* Explicit roles: below 640px the rows are restyled as stacked blocks (SeriesPage.css), which would
                      otherwise drop the table semantics in some browsers. */}
                  <table className="series-tiers__table" role="table">
                    <caption className="caption series-tiers__caption" lang={enIf(lang, next.sponsorTiersNote || '')}>
                      <InlineMarks text={next.sponsorTiersNote || ''} />
                    </caption>
                    <thead role="rowgroup">
                      <tr role="row">
                        <th scope="col" role="columnheader">{t('Tier', 'நிலை')}</th>
                        <th scope="col" role="columnheader">{t('What you get', 'உங்களுக்குக் கிடைப்பது')}</th>
                        <th scope="col" role="columnheader">
                          {t('Indicative', 'தோராயமாக')} <TagChip tag="C" />
                        </th>
                      </tr>
                    </thead>
                    <tbody role="rowgroup" lang={enIf(lang, tiers.map((tr) => tr.gets))}>
                      {tiers.map((tier) => (
                        <tr key={tier.tier} role="row">
                          <th scope="row" role="rowheader">{tier.tier}</th>
                          <td role="cell"><InlineMarks text={tier.gets} /></td>
                          <td role="cell" className="tnum series-tiers__price">{tier.indicative}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null /* No rate card yet: no tiers table and no placeholder line. */}
            <div className="cluster">
              <Button variant="secondary" to="/partner/sponsors" icon={Handshake}>
                {t('Sponsor an event', 'ஒரு நிகழ்வுக்கு ஸ்பான்சர் செய்யுங்கள்')}
              </Button>
              <Button variant="tertiary" to={`/partner/enquire?type=sponsor&ref=events-series-${key}`} icon={ArrowRight}>
                {t('Talk to the partnerships team', 'கூட்டாண்மைக் குழுவிடம் பேசுங்கள்')}
              </Button>
            </div>
          </div>
          <Reveal className="series-partner__host" delay={0.08}>
            <Building2 aria-hidden="true" size={28} className="series-partner__icon" />
            <h3 className="h4">
              {cfg.hostable
                ? t('Host an edition in your college or district.', 'உங்கள் கல்லூரியிலோ மாவட்டத்திலோ ஒரு பதிப்பை நடத்துங்கள்.')
                : t('Co-host with us.', 'எங்களுடன் இணைந்து நடத்துங்கள்.')}
            </h3>
            <p className="text-2">
              {t(
                "Tell us what you have in mind and we'll get back to you.",
                'உங்கள் யோசனையைச் சொல்லுங்கள்; நாங்கள் உங்களைத் தொடர்புகொள்வோம்.'
              )}
            </p>
            <Button variant="secondary" to={cfg.hostable ? '/events/host' : `/partner/enquire?ref=events-series-${key}`} full>
              {cfg.hostable ? t('Host an edition', 'ஒரு பதிப்பை நடத்துங்கள்') : t('Co-host an edition', 'ஒரு பதிப்பை இணைந்து நடத்துங்கள்')}
            </Button>
            {cfg.nominate && (
              <Button variant="tertiary" to={cfg.nominate} icon={ArrowRight}>
                {t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}
              </Button>
            )}
          </Reveal>
        </div>
      </Section>

      {/* Register interest: always available; the main path when no edition is open. */}
      <Section surface="paper" className="series-interest" id="series-interest" labelledBy="series-interest-title" width="narrow">
        <SectionHeader
          eyebrow={t('Get the next date', 'அடுத்த தேதியைப் பெறுங்கள்')}
          title={
            <span id="series-interest-title">
              {next
                ? t(`Get ${cfg.name} dates and reminders.`, `${cfg.name} தேதிகளையும் நினைவூட்டல்களையும் பெறுங்கள்.`)
                : t(`Tell me when ${cfg.name} opens.`, `${cfg.name} பதிவு திறந்ததும் எனக்குத் தெரிவியுங்கள்.`)}
            </span>
          }
          lede={t(
            "Leave an email or a mobile number and we'll tell you when registration opens and dates are confirmed. We only use it for this series unless you tick the newsletter box.",
            'மின்னஞ்சல் அல்லது கைபேசி எண்ணைத் தாருங்கள்; பதிவு திறக்கும்போதும் தேதிகள் உறுதியாகும்போதும் தெரிவிப்போம். செய்திமடல் பெட்டியைத் தேர்வு செய்யாவிட்டால், இந்தத் தொடருக்கு மட்டுமே பயன்படுத்துவோம்.'
          )}
        />
        <SmartForm
          type="interest"
          className="form-card series-interest__form"
          fields={[
            { name: 'name', label: t('Your name (optional)', 'உங்கள் பெயர் (விருப்பம்)'), autoComplete: 'name' },
            {
              name: 'email',
              label: t('Email', 'மின்னஞ்சல்'),
              type: 'email',
              autoComplete: 'email',
              hint: t('Email or mobile, one is enough.', 'மின்னஞ்சல் அல்லது கைபேசி, ஏதேனும் ஒன்று போதும்.'),
              // Server rule for `interest`: email or phone (Book 2 §13). Checked here too so the error shows before sending.
              validate: (v, all) =>
                !String(v || '').trim() && !String(all?.phone || '').trim()
                  ? t('Please add your email or mobile number so we can tell you when it opens.', 'பதிவு திறந்ததும் தெரிவிக்க, உங்கள் மின்னஞ்சல் அல்லது கைபேசி எண்ணைச் சேர்க்கவும்.')
                  : '',
            },
            { name: 'phone', label: t('Mobile (optional)', 'கைபேசி (விருப்பம்)'), type: 'tel', autoComplete: 'tel-national' },
            { name: 'district', label: t('District (optional)', 'மாவட்டம் (விருப்பம்)'), autoComplete: 'address-level2' },
          ]}
          consents={[
            {
              purpose: 'contact',
              label: t(`StartNet may contact me about ${cfg.name} dates and registration.`, `${cfg.name} தேதிகள், பதிவு குறித்து StartNet என்னைத் தொடர்புகொள்ளலாம்.`),
              required: true,
            },
            { purpose: 'newsletter', label: t('Also send me the StartNet newsletter.', 'StartNet செய்திமடலையும் அனுப்புங்கள்.') },
          ]}
          submitLabel={t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
          successTitle={t("Thanks. We'll let you know as soon as it opens.", 'நன்றி. பதிவு திறந்தவுடன் தெரிவிப்போம்.')}
          hidden={{ programme: key, source: `events-series:${key}`, lang }}
        />
      </Section>

      {/* Other series: internal links across the events family */}
      <Section surface="white" className="series-more" pad="sm" labelledBy="series-more-title">
        <h2 id="series-more-title" className="h5 series-more__title">{t('More event series', 'மேலும் நிகழ்வுத் தொடர்கள்')}</h2>
        <ul className="series-more__list">
          {others.map((k) => (
            <li key={k}>
              <Link className="series-more__link" to={localePath(`/events/${k}`)} data-brand={SERIES[k].brand || undefined}>
                <span className="series-more__dot" aria-hidden="true" />
                {SERIES[k].name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CTABand
        surface={brand ? 'accent' : 'paper'}
        brand={brand || undefined}
        eyebrow={next ? t('Next edition', 'அடுத்த பதிப்பு') : cfg.name}
        title={next ? <span lang={enIf(lang, next.title)}>{next.title}.</span> : t('Your first step is free.', 'உங்கள் முதல் படி இலவசம்.')}
        body={next ? <span lang={x.whenLang(next)}>{x.when(next)}</span> : t('Join StartNet and we will suggest a good first event near you.', 'StartNet-இல் இணையுங்கள்; உங்களுக்கு அருகிலுள்ள நல்ல முதல் நிகழ்வைப் பரிந்துரைப்போம்.')}
        actions={
          next ? (
            <>
              <Button variant="inverse" href={registerHref}>{x.register(next)}</Button>
              <Button variant="tertiary" to={editionPath(next)} icon={ArrowRight}>
                {t('See this edition', 'இந்தப் பதிப்பைப் பாருங்கள்')}
              </Button>
            </>
          ) : (
            <>
              <Button to="/join">{t('Join StartNet', 'StartNet-இல் இணையுங்கள்')}</Button>
              <Button variant="whatsapp" href={waLink(waText, `series:${key}`)}>
                {t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')}
              </Button>
            </>
          )
        }
      />
    </div>
  );
}
