// /districts/:district · T20 District page, P3 (Book 1 Part B §2.2, §6 T20; Book 3 Part B §4 T20).
// Order per T20: district hero (EN + Tamil names, map inset) → M05 local events → local Circles and Clubs
// → local partners (signed only) → M12 district Ledger slice (the one Night band) → M04 "Host in your district".
// Data: /api/events?district=, /api/events?format=online, /api/programmes?format=online, /api/ledger,
// /api/metrics?key=tn-startups-outside-top-3. Unknown district → NotFound; common alternative spellings redirect.
import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CalendarDays, MapPin, Handshake } from 'lucide-react';
import {
  Seo,
  PageHero,
  Section,
  SectionHeader,
  Button,
  Card,
  EventCard,
  ProgrammeCard,
  EmptyState,
  Skeleton,
  Stat,
  RevealGroup,
  Reveal,
  LogoWall,
  SmartForm,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { useApi } from '../../../hooks/useApi.js';
import NotFound from '../../utility/LazyNotFound.jsx';
import DistrictLocator from './DistrictLocator.jsx';
import { DISTRICTS, METRO_SLUGS, aliasTarget, findDistrict, nearestDistricts, hasRecordedActivity } from './districtsData.js';
import { fullTitle } from '../../../components/Seo.jsx';
import { isPlaceholder } from '../../../lib/seo.js';
import { pageLd } from '../../brands/seoBits.js';
import './DistrictPage.css';


/** Values the events API matches against district or city (it compares lower-case and slugified forms). */
const eventQuery = (d) => [d.en, d.slug, d.hq].filter((v, i, a) => a.indexOf(v) === i).map(encodeURIComponent).join(',');

/** Ledger row for this district, if the current edition has one (shape per ledgerUtils: district|name, nurtured, launched, tag). */
function ledgerRow(ledger, d) {
  const rows = ledger?.byDistrict || [];
  const want = [d.en, d.slug, d.hq, d.ta].map((s) => String(s).toLowerCase());
  return (
    rows.find((r) => {
      const name = String(r.district || r.name || r.label || '').toLowerCase().trim();
      return want.includes(name) || want.includes(name.replace(/\s+/g, '-'));
    }) || null
  );
}

const numOrNull = (v) => {
  if (v && typeof v === 'object' && 'value' in v) return v.value ?? null;
  return typeof v === 'number' ? v : null;
};

export default function DistrictPage() {
  const { district: param } = useParams();
  const { t, lang, localePath } = useLang();
  const navigate = useNavigate();
  const d = findDistrict(param);
  const alias = d ? null : aliasTarget(param);

  const nearby = useMemo(() => (d ? nearestDistricts(d, 4) : []), [d]);
  const [jump, setJump] = useState('');

  const { data: localEvents, loading: eventsLoading, error: eventsError } = useApi(
    d ? `/api/events?when=upcoming&district=${eventQuery(d)}` : null
  );
  const { data: pastLocal, loading: pastLoading } = useApi(d ? `/api/events?when=past&district=${eventQuery(d)}` : null);
  const { data: onlineEvents } = useApi(d ? '/api/events?when=upcoming&format=online' : null);
  const { data: onlineProgrammes, loading: progLoading } = useApi(d ? '/api/programmes?format=online' : null);
  const { data: ledger, loading: ledgerLoading } = useApi(d ? '/api/ledger' : null);
  const { data: contextMetrics } = useApi(d ? '/api/metrics?key=tn-startups-outside-top-3' : null);

  if (alias) return <Navigate to={localePath(`/districts/${alias}`)} replace />;
  if (!d) return <NotFound />;
  // One canonical URL per district: /districts/Chennai → /districts/chennai.
  if (param !== d.slug) return <Navigate to={localePath(`/districts/${d.slug}`)} replace />;

  const ta = lang === 'ta';
  // The metro note names the other two metros, never the district itself.
  const otherMetros = METRO_SLUGS.filter((slug) => slug !== d.slug).map((slug) => DISTRICTS.find((x) => x.slug === slug));
  const name = ta ? d.ta : d.en;
  const otherName = ta ? d.en : d.ta;
  const eventsHref = `/events?district=${encodeURIComponent(d.en)}`;

  const events = Array.isArray(localEvents) ? localEvents : [];

  // Doorway-page rule (Book 1 §9.3): a district page is indexed only where there is real local activity — a listed
  // event here (upcoming or past, with a real venue/city, not a placeholder), a Circle, or a signed partner
  // (DISTRICT_ACTIVITY in districtsData.js). Every other district page stays reachable and useful to visitors but
  // is noindex, follow. While the event lists load the page stays noindex, so a template never gets indexed.
  const realLocal = (list) =>
    (Array.isArray(list) ? list : []).filter((e) => e && !e.placeholder && (!isPlaceholder(e.city) || !isPlaceholder(e.venue)));
  const activityKnown = !eventsLoading && !pastLoading;
  const indexable = activityKnown && (realLocal(localEvents).length > 0 || realLocal(pastLocal).length > 0 || hasRecordedActivity(d.slug));
  const online = (Array.isArray(onlineEvents) ? onlineEvents : []).slice(0, 3);
  const programmes = (Array.isArray(onlineProgrammes) ? onlineProgrammes : [])
    .filter((p) => p.status !== 'closed')
    .slice(0, 3);

  const row = ledgerRow(ledger, d);
  const period = ledger?.period || null;
  const asAt = ledger?.asAt || null;
  const ledgerSource = period ? `Founder Ledger ${period}` : 'Founder Ledger';
  const rowTag = row?.tag || 'B';
  const contextMetric = Array.isArray(contextMetrics) ? contextMetrics.find((m) => m.key === 'tn-startups-outside-top-3') : null;

  // Keep the full title within 60 characters for the longest district names.
  const seoTitle = (() => {
    const long = t(`${d.en} startup events and Circles`, `${d.ta} ஸ்டார்ட்அப் நிகழ்வுகள், வட்டங்கள்`);
    return fullTitle(long).length <= 60 ? long : t(`${d.en} startup events`, `${d.ta}: ஸ்டார்ட்அப் நிகழ்வுகள்`);
  })();

  const crumbs = [
    { label: t('Who we are', 'நாங்கள் யார்'), to: '/about' },
    { label: t('Districts', 'மாவட்டங்கள்'), to: '/districts' },
    { label: name },
  ];

  const onJump = (e) => {
    e.preventDefault();
    if (jump && jump !== d.slug) navigate(localePath(`/districts/${jump}`));
  };

  const sorted = ta ? [...DISTRICTS].sort((a, b) => a.ta.localeCompare(b.ta, 'ta')) : DISTRICTS;

  return (
    <div className="district">
      {/* SEO: "<district> startup events" (Book 1 §9.2 Events theme, §9.3 local SEO). SEO-TA: pending native review */}
      <Seo
        title={seoTitle}
        description={t(
          `Startup events, founder Circles, Vibe Clubs and programmes you can join from ${d.en} district, Tamil Nadu, with StartNet's Founder Ledger count.`,
          `${d.ta} மாவட்டத்தில் ஸ்டார்ட்அப் நிகழ்வுகள், நிறுவனர் வட்டங்கள், Vibe Clubs, இங்கிருந்தே சேரக்கூடிய திட்டங்கள், StartNet Founder Ledger எண்கள்.`
        )}
        noindex={!indexable}
        jsonLd={pageLd({
          path: `/districts/${d.slug}`,
          lang,
          name: seoTitle,
          about: {
            '@type': 'AdministrativeArea',
            name: ta ? `${d.ta} மாவட்டம்` : `${d.en} district`,
            containedInPlace: { '@type': 'State', name: 'Tamil Nadu', address: { '@type': 'PostalAddress', addressRegion: 'Tamil Nadu', addressCountry: 'IN' } },
          },
        })}
      />

      <PageHero
        breadcrumbs={crumbs}
        eyebrow={t('District · Tamil Nadu', 'மாவட்டம் · தமிழ்நாடு')}
        title={`${name}.`}
        titleClass={`display-xl district-hero__title${name.length > (ta ? 8 : 11) ? ' district-hero__title--long' : ''}`}
        contentLang={ta ? 'ta' : 'en'}
        lede={t(
          `Events, Circles and programmes for people with the talent to build in ${d.en}, and what StartNet has counted here so far.`,
          `${d.ta} மாவட்டத்தில் தொழில் தொடங்கும் திறமை உள்ளவர்களுக்கான நிகழ்வுகள், வட்டங்கள், திட்டங்கள், இதுவரை StartNet இங்கு கணக்கிட்டவை.`
        )}
        actions={
          <>
            <Button to={eventsHref} size="lg" icon={CalendarDays}>
              {t('See events here', 'இங்குள்ள நிகழ்வுகளைப் பாருங்கள்')}
            </Button>
            <Button href="#district-host" variant="tertiary">
              {t('Host in your district', 'உங்கள் மாவட்டத்தில் நடத்துங்கள்')}
            </Button>
          </>
        }
        meta={
          <dl className="district-hero__meta">
            <div className="district-hero__fact">
              <dt>{ta ? t('In English', 'ஆங்கிலத்தில்') : t('In Tamil', 'தமிழில்')}</dt>
              <dd lang={ta ? 'en' : 'ta'}>{otherName}</dd>
            </div>
            <div className="district-hero__fact">
              <dt>{t('Headquarters', 'தலைமையகம்')}</dt>
              <dd lang="en">{d.hq}</dd>
            </div>
            {/* "StartNet status" is hidden until StartNet supplies it per district. */}
          </dl>
        }
        art={<DistrictLocator district={d} nearby={nearby} />}
      />

      {/* M05 · Local events */}
      <Section surface="white" id="district-events" labelledBy="district-events-title">
        <SectionHeader
          as="h2"
          eyebrow={t('Events', 'நிகழ்வுகள்')}
          id="district-events-title"
          title={t(`Coming up in ${d.en}`, `${d.ta} மாவட்டத்தில் வரவிருப்பவை`)}
          action={
            <Button to={eventsHref} variant="tertiary">
              {t('All events here', 'இங்குள்ள அனைத்து நிகழ்வுகளும்')}
            </Button>
          }
        />
        {eventsLoading ? (
          <Skeleton height="16rem" count={2} />
        ) : events.length > 0 ? (
          <RevealGroup className="district-grid">
            {events.slice(0, 6).map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </RevealGroup>
        ) : (
          <EmptyState
            title={
              eventsError
                ? t("We couldn't load events just now.", 'இப்போது நிகழ்வுகளை ஏற்ற முடியவில்லை.')
                : t(`No StartNet events are listed in ${d.en} yet.`, `${d.ta} மாவட்டத்தில் இன்னும் StartNet நிகழ்வுகள் பட்டியலிடப்படவில்லை.`)
            }
            body={
              online.length > 0
                ? t(
                    'District editions are added as each district activates. The online events below are open to you from anywhere in Tamil Nadu.',
                    'ஒவ்வொரு மாவட்டமும் செயல்படத் தொடங்கும்போது மாவட்டப் பதிப்புகள் சேர்க்கப்படும். கீழே உள்ள இணைய நிகழ்வுகளில் தமிழ்நாட்டின் எந்த இடத்திலிருந்தும் கலந்துகொள்ளலாம்.'
                  )
                : t(
                    'District editions are added as each district activates.',
                    'ஒவ்வொரு மாவட்டமும் செயல்படத் தொடங்கும்போது மாவட்டப் பதிப்புகள் சேர்க்கப்படும்.'
                  )
            }
            action={
              <Button href="#district-host" variant="secondary">
                {t('Host an event here', 'இங்கு ஒரு நிகழ்வை நடத்துங்கள்')}
              </Button>
            }
          />
        )}

        {online.length > 0 && (
          <div className="district-online">
            <h3 className="h4 district-online__title">
              {t(`Online, open to ${d.en}`, `இணையத்தில், ${d.ta} மாவட்டத்தினருக்கும்`)}
            </h3>
            <RevealGroup className="district-grid">
              {online.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </RevealGroup>
          </div>
        )}

        <p className="district-more">
          <Link className="district-link" to={`${localePath('/events/past')}?district=${encodeURIComponent(d.en)}`}>
            {t(`Past events in ${d.en}`, `${d.ta} மாவட்டத்தின் கடந்த நிகழ்வுகள்`)}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
      </Section>

      {/* Local Circles and Clubs */}
      <Section id="district-circles" labelledBy="district-circles-title">
        <SectionHeader
          as="h2"
          eyebrow={t('Circles and Clubs', 'வட்டங்களும் கிளப்புகளும்')}
          id="district-circles-title"
          title={t('Meet founders near you', 'உங்கள் அருகிலுள்ள நிறுவனர்களைச் சந்தியுங்கள்')}
          // "Circles meeting in <district>: [placeholder]" is left out until the list is supplied.
        />
        <RevealGroup className="district-grid district-grid--3">
          <Card
            brand="connect"
            to={`/connect/circles?district=${d.slug}`}
            eyebrow="StartNet Connect"
            title="Connect Circles"
            body={t(
              'Closed chapters of 25–40 founders, one seat per sector, meeting monthly. Introductions tracked.',
              '25–40 நிறுவனர்கள் கொண்ட மூடிய குழுக்கள்; ஒவ்வொரு துறைக்கும் ஓர் இடம்; மாதந்தோறும் சந்திப்பு. அறிமுகங்கள் கண்காணிக்கப்படுகின்றன.'
            )}
          />
          <Card
            brand="women"
            to={`/women/circles?district=${d.slug}`}
            eyebrow="StartNet Women"
            title="Women Circles"
            body={t(
              'Monthly chapters of 20–30 women founders in your district, with peer accountability and introductions to buyers.',
              'உங்கள் மாவட்டத்தில் 20–30 பெண் நிறுவனர்கள் கொண்ட மாதாந்திரக் குழுக்கள்; ஒருவருக்கொருவர் பொறுப்புணர்வும் வாங்குபவர்களுக்கான அறிமுகங்களும்.'
            )}
          />
          <Card
            brand="vibe"
            to="/vibe/clubs"
            eyebrow="StartNet Vibe"
            title="Vibe Clubs"
            body={t(
              'Start or join a student-run Vibe Club on your campus. Vibe Captains run monthly builds and bring StartNet to their district.',
              'உங்கள் கல்லூரியில் மாணவர்கள் நடத்தும் Vibe Club-ஐத் தொடங்குங்கள் அல்லது இணையுங்கள். Vibe Captains மாதந்தோறும் உருவாக்க அமர்வுகளை நடத்தி, StartNet-ஐத் தங்கள் மாவட்டத்துக்குக் கொண்டு வருகிறார்கள்.'
            )}
          />
        </RevealGroup>

        <div className="district-programmes">
          <h3 className="h4 district-programmes__title">
            {t(`Programmes you can join from ${d.en}`, `${d.ta} மாவட்டத்திலிருந்தே சேரக்கூடிய திட்டங்கள்`)}
          </h3>
          {progLoading ? (
            <Skeleton height="12rem" count={1} />
          ) : programmes.length > 0 ? (
            <RevealGroup className="district-grid district-grid--3">
              {programmes.map((p) => (
                <ProgrammeCard key={p.slug} programme={p} />
              ))}
            </RevealGroup>
          ) : (
            <p className="district-note">
              {t('Online programmes are listed on the programmes page.', 'இணையத் திட்டங்கள் திட்டங்கள் பக்கத்தில் உள்ளன.')}
            </p>
          )}
          <Button to="/programmes" variant="tertiary">
            {t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}
          </Button>
        </div>
      </Section>

      {/* Local partners (signed only) */}
      <Section surface="white" pad="sm" id="district-partners" labelledBy="district-partners-title">
        <div className="district-partners">
          <span className="district-partners__icon" aria-hidden="true">
            <Handshake size={22} strokeWidth={1.5} />
          </span>
          <div>
            <h2 id="district-partners-title" className="h4">
              {t(`Partners in ${d.en}`, `${d.ta} மாவட்டக் கூட்டாளிகள்`)}
            </h2>
            <p className="district-note">
              {t(
                'Colleges, district administrations and local organisations appear here only once an agreement is signed, with the date.',
                'ஒப்பந்தம் கையெழுத்தான பிறகே, தேதியுடன், கல்லூரிகள், மாவட்ட நிர்வாகங்கள், உள்ளூர் அமைப்புகள் இங்கு இடம்பெறும்.'
              )}
            </p>
            <LogoWall partners={[]} />
            <Link className="district-link" to={localePath('/partner/our-partners')}>
              {t('All signed partners', 'கையெழுத்தான அனைத்துக் கூட்டாளிகள்')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* M12 · District Ledger slice (the page's one Night band) */}
      <Section surface="night" id="district-ledger" labelledBy="district-ledger-title">
        <SectionHeader
          as="h2"
          eyebrow={t('Founder Ledger', 'Founder Ledger')}
          id="district-ledger-title"
          title={t(`What we have counted in ${d.en}`, `${d.ta} மாவட்டத்தில் நாங்கள் கணக்கிட்டவை`)}
          lede={t(
            'We count outcomes, not attendance. Figures for this district come from the latest Ledger edition, each with a confidence tag.',
            'வருகையை அல்ல, விளைவுகளையே எண்ணுகிறோம். இந்த மாவட்டத்தின் எண்கள் சமீபத்திய Ledger பதிப்பிலிருந்து, ஒவ்வொன்றும் நம்பகத்தன்மைக் குறியுடன்.'
          )}
        />
        {ledgerLoading ? (
          <Skeleton height="8rem" count={1} />
        ) : (
          <Reveal>
            <div className="district-ledger">
              <div className="district-ledger__cell">
                <Stat
                  value={numOrNull(row?.nurtured ?? row?.value ?? row?.count)}
                  label={t(`founders nurtured (L2+) from ${d.en}`, `${d.ta} மாவட்டத்தில் வளர்க்கப்பட்ட நிறுவனர்கள் (L2+)`)}
                  tag={rowTag}
                  asAt={asAt || undefined}
                  source={ledgerSource}
                />
              </div>
              <div className="district-ledger__cell">
                <Stat
                  value={numOrNull(row?.launched)}
                  label={t(`startups launched (L5) from ${d.en}`, `${d.ta} மாவட்டத்தில் தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5)`)}
                  tag={rowTag}
                  asAt={asAt || undefined}
                  source={ledgerSource}
                />
              </div>
              <div className="district-ledger__cell">
                {!d.metro && contextMetric ? (
                  <Stat
                    metric={contextMetric}
                    label={t(
                      contextMetric.label,
                      'தமிழ்நாட்டு ஸ்டார்ட்அப்களில் சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த மாவட்டங்களில் உள்ளவை'
                    )}
                  />
                ) : (
                  <Stat
                    value={null}
                    label={t(`events run in ${d.en}`, `${d.ta} மாவட்டத்தில் நடத்தப்பட்ட நிகழ்வுகள்`)}
                    tag="B"
                    source={ledgerSource}
                  />
                )}
              </div>
            </div>
          </Reveal>
        )}
        <p className="district-ledger__note">
          {d.metro
            ? t(
                `${d.en} is one of the three metro districts, with ${otherMetros.map((m) => m.en).join(' and ')}, that our district promise is measured against.`,
                `${otherMetros.map((m) => m.ta).join(', ')} ஆகியவற்றுடன், எங்கள் மாவட்ட வாக்குறுதி அளவிடப்படும் மூன்று பெருநகர மாவட்டங்களில் ${d.ta} ஒன்று.`
              )
            : t(
                'Our district promise: we report the share of launched founders from outside Chennai, Coimbatore and Kancheepuram.',
                'எங்கள் மாவட்ட வாக்குறுதி: சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த மாவட்டங்களிலிருந்து தொடங்கிய நிறுவனர்களின் பங்கை வெளியிடுகிறோம்.'
              )}
        </p>
        <div className="district-ledger__actions cluster">
          <Button to="/insights/founder-ledger" variant="inverse">
            {t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}
          </Button>
          <Button to="/about/evidence-standard" variant="tertiary">
            {t('How we count', 'நாங்கள் எப்படி எண்ணுகிறோம்')}
          </Button>
        </div>
      </Section>

      {/* M04 · Host in your district */}
      <Section id="district-host" labelledBy="district-host-title">
        <div className="district-host">
          <div className="district-host__intro">
            <p className="eyebrow">{t('Bring StartNet here', 'StartNet-ஐ இங்கு கொண்டு வாருங்கள்')}</p>
            <h2 id="district-host-title" className="h2">
              {t(`Host in ${d.en}`, `${d.ta} மாவட்டத்தில் நடத்துங்கள்`)}
              <span className="dot">.</span>
            </h2>
            <p className="body-lg district-host__lede">
              {t(
                'Colleges, district administrations and local partners can co-host events, Circles and programmes with us.',
                'கல்லூரிகள், மாவட்ட நிர்வாகங்கள், உள்ளூர் கூட்டாளிகள் எங்களுடன் நிகழ்வுகள், வட்டங்கள், திட்டங்களை இணைந்து நடத்தலாம்.'
              )}
            </p>
            <ul className="district-host__links" role="list">
              <li>
                <Link className="district-link" to={localePath('/partner/government')}>
                  {t('Government & districts', 'அரசு & மாவட்டங்கள்')}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link className="district-link" to={localePath('/vibe/for-colleges')}>
                  {t('For colleges', 'கல்லூரிகளுக்கு')}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="district-host__form">
            <SmartForm
              type="host"
              hidden={{ district: d.en, source: `district-page:${d.slug}`, lang }}
              fields={[
                { id: 'dh-name', name: 'name', label: t('Your name', 'உங்கள் பெயர்'), type: 'text', required: true, autoComplete: 'name' },
                { id: 'dh-email', name: 'email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
                { id: 'dh-phone', name: 'phone', label: t('Mobile number', 'கைபேசி எண்'), type: 'tel', autoComplete: 'tel-national' },
                { id: 'dh-org', name: 'organisation', label: t('College or organisation', 'கல்லூரி அல்லது அமைப்பு'), type: 'text', autoComplete: 'organization' },
                {
                  id: 'dh-format',
                  name: 'format',
                  label: t('What would you like to host?', 'எதை நடத்த விரும்புகிறீர்கள்?'),
                  type: 'select',
                  options: [
                    { value: 'event', label: t('An event or build night', 'ஒரு நிகழ்வு அல்லது உருவாக்க இரவு') },
                    { value: 'circle', label: t('A Circle', 'ஒரு வட்டம்') },
                    { value: 'club', label: t('A Vibe Club on campus', 'கல்லூரியில் ஒரு Vibe Club') },
                    { value: 'programme', label: t('A programme', 'ஒரு திட்டம்') },
                  ],
                },
                { id: 'dh-message', name: 'message', label: t('Anything else we should know', 'நாங்கள் அறிய வேண்டியவை'), type: 'textarea' },
              ]}
              consents={[
                {
                  purpose: 'partner',
                  label: t(
                    'StartNet may contact me about hosting in my district.',
                    'என் மாவட்டத்தில் நடத்துவது குறித்து StartNet என்னைத் தொடர்புகொள்ளலாம்.'
                  ),
                  required: true,
                },
              ]}
              submitLabel={t('Send', 'அனுப்புங்கள்')}
              successTitle={t('Thanks. We have your details.', 'நன்றி. உங்கள் விவரங்கள் கிடைத்தன.')}
              successBody={t(
                'Our team will be in touch about hosting.',
                'நடத்துவது குறித்து எங்கள் குழு உங்களைத் தொடர்புகொள்ளும்.'
              )}
            />
          </div>
        </div>
      </Section>

      {/* Nearby districts + jump to any district (accessible twin of the locator) */}
      <Section surface="sunken" pad="sm" id="district-nearby" labelledBy="district-nearby-title">
        <div className="district-nearby">
          <div>
            <h2 id="district-nearby-title" className="h4">
              {t('Nearby districts', 'அருகிலுள்ள மாவட்டங்கள்')}
            </h2>
            <ul className="district-nearby__list" role="list">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link className="district-nearby__chip" to={localePath(`/districts/${n.slug}`)}>
                    <MapPin size={16} aria-hidden="true" />
                    <span>{ta ? n.ta : n.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <form className="district-jump" onSubmit={onJump}>
            <label htmlFor="district-jump" className="district-jump__label">
              {t('Go to another district', 'வேறு மாவட்டத்துக்குச் செல்லுங்கள்')}
            </label>
            <div className="district-jump__row">
              <select
                id="district-jump"
                className="district-jump__select"
                value={jump}
                onChange={(e) => setJump(e.target.value)}
              >
                <option value="">{t('Choose a district', 'மாவட்டத்தைத் தேர்ந்தெடுங்கள்')}</option>
                {sorted.map((x) => (
                  <option key={x.slug} value={x.slug} disabled={x.slug === d.slug}>
                    {ta ? `${x.ta} (${x.en})` : x.en}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="secondary" disabled={!jump || jump === d.slug}>
                {t('Go', 'செல்')}
              </Button>
            </div>
            <Link className="district-link" to={localePath('/districts')}>
              {t('All districts', 'அனைத்து மாவட்டங்களும்')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </form>
        </div>
      </Section>
    </div>
  );
}
