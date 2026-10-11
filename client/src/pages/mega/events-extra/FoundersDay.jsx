// /events/founders-day — StartNet Founders Day, the all-brand annual show (Book 1 Part B §2.2: T04 event series, audience All, CTA Register, P3).
// Status: Planned. Book 2 §5.1 lists it as "StartNet Founders Day (all-brand annual show) [proposed]" with "Dates soon" + Register interest.
// Book 3 §1 surface: Campaign (Night or Paper, one louder accent) — the hero is this page's one Night band.
// Editions come from GET /api/events?series=founders-day (none yet); register-interest posts to /api/forms/interest.
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, CalendarClock, MapPin, Ticket, Languages } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Badge, KeyFacts, EventCard, EmptyState, Skeleton, SmartForm, Accordion,
  CTABand, Button, Placeholder, Reveal, RevealGroup,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink } from '../../../lib/links.js';
import { useApi } from '../../../hooks/useApi.js';
import { BRANDS } from '../../../data/brands.js';
import { districtOptions } from './districts.js';
import './FoundersDay.css';
import { eventPath } from '../../../components/_utils.js';

const PH_EN = '[placeholder — to be supplied by StartNet]';
const PH_TA = '[இடைநிரப்பு — StartNet வழங்கும்]';

export default function FoundersDay() {
  const { t, lang, localePath } = useLang();
  const ph = <Placeholder>{t(PH_EN, PH_TA)}</Placeholder>;
  const { data: eventsData, loading: eventsLoading } = useApi('/api/events?series=founders-day');
  const all = Array.isArray(eventsData) ? eventsData : [];
  const upcoming = all.filter((e) => e.status !== 'past');
  const past = all.filter((e) => e.status === 'past');

  const brandRooms = [
    {
      brand: 'research',
      body: t('Lab teams, scholars and faculty, and the route from lab to market.', 'ஆய்வகக் குழுக்கள், ஆய்வாளர்கள், ஆசிரியர்கள் — ஆய்வகத்திலிருந்து சந்தைக்கான பாதை.'),
      flagship: 'Lab-to-Market Summit',
      to: '/research/lab-to-market-summit',
    },
    {
      brand: 'vibe',
      body: t('Students who build with AI, from campus build nights to the Vibathon finale.', 'கல்லூரி உருவாக்க இரவுகள் முதல் Vibathon இறுதிப் போட்டி வரை, AI கொண்டு உருவாக்கும் மாணவர்கள்.'),
      flagship: 'Vibathon',
      to: '/vibe/vibathon',
    },
    {
      brand: 'connect',
      body: t('Professionals becoming founders, and startups finding customers, across the sector Connects.', 'நிறுவனர்களாகும் தொழில்முறையாளர்களும் வாடிக்கையாளர்களைத் தேடும் ஸ்டார்ட்அப்களும் — துறை Connect-கள் முழுவதும்.'),
      flagship: t('Sector Connects', 'துறை Connect-கள்'),
      to: '/connect/series',
    },
    {
      brand: 'women',
      body: t('Women founders and women who want to start, from Circles to HerCapital.', 'Circles முதல் HerCapital வரை, பெண் நிறுவனர்களும் தொடங்க விரும்பும் பெண்களும்.'),
      flagship: 'Women Founders Summit & Awards',
      to: '/women/summit',
    },
  ];

  const faq = [
    {
      id: 'when',
      question: t('When and where is Founders Day?', 'Founders Day எப்போது, எங்கே?'),
      answer: (
        <p>
          {/* "Date and venue: [placeholder]" is left out until they are supplied. */}
          {t('Founders Day is planned.', 'Founders Day திட்டமிடப்பட்டுள்ளது.')}{' '}
          {t('Register interest and we will tell you as soon as they are confirmed.', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்; உறுதியானதும் உடனே தெரிவிப்போம்.')}
        </p>
      ),
    },
    {
      id: 'who',
      question: t('Who is it for?', 'இது யாருக்கானது?'),
      answer: t(
        'Everyone in the StartNet network: students, scholars, professionals, women founders, founders, and the institutions and partners who back them.',
        'StartNet வலையமைப்பில் உள்ள அனைவருக்கும்: மாணவர்கள், ஆய்வாளர்கள், தொழில்முறையாளர்கள், பெண் நிறுவனர்கள், நிறுவனர்கள், அவர்களுக்குத் துணைநிற்கும் நிறுவனங்களும் கூட்டாளர்களும்.'
      ),
    },
    // "Will it be free?" is hidden until entry and pricing are supplied (the answer is only a placeholder today).
    {
      id: 'speak',
      question: t('Can I speak, exhibit or sponsor?', 'நான் பேசலாமா, காட்சிப்படுத்தலாமா, நிதியளிக்கலாமா?'),
      answer: (
        <p>
          <Link className="fday-inline-link" to={localePath('/events/speak')}>{t('Apply to speak or mentor', 'பேச அல்லது வழிகாட்ட விண்ணப்பியுங்கள்')}</Link>
          {' · '}
          <Link className="fday-inline-link" to={localePath('/partner/sponsors')}>{t('Sponsorship packages', 'நிதியுதவித் தொகுப்புகள்')}</Link>
        </p>
      ),
    },
  ];

  const roleOptions = [
    { value: '', label: t('Choose one', 'ஒன்றைத் தேர்ந்தெடுக்கவும்') },
    { value: 'student', label: t('Student', 'மாணவர்') },
    { value: 'scholar', label: t('Scholar or faculty', 'ஆய்வாளர் அல்லது ஆசிரியர்') },
    { value: 'professional', label: t('Working professional', 'பணியாற்றும் தொழில்முறையாளர்') },
    { value: 'founder', label: t('Founder', 'நிறுவனர்') },
    { value: 'institution', label: t('College or institution', 'கல்லூரி அல்லது கல்வி நிறுவனம்') },
    { value: 'partner', label: t('Partner, sponsor or investor', 'கூட்டாளர், நிதியளிப்பவர் அல்லது முதலீட்டாளர்') },
    { value: 'media', label: t('Media', 'ஊடகம்') },
    { value: 'other', label: t('Other', 'மற்றவை') },
  ];

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('StartNet Founders Day: annual all-brand founder show', 'StartNet Founders Day: ஆண்டு நிறுவனர் நிகழ்வு')}
        description={t(
          'StartNet Founders Day is a planned annual show for all four brands: Research, Vibe, Connect and Women. Register interest to hear when dates open.',
          'StartNet Founders Day: நான்கு பிராண்டுகளும் இணையும் திட்டமிடப்பட்ட ஆண்டு நிகழ்வு. தேதிகள் அறிவிக்கப்படும்போது அறிய ஆர்வத்தைப் பதிவு செய்யுங்கள்.'
        )}
      />

      <PageHero
        surface="night"
        className="fday-hero"
        eyebrow={t('Events · Flagship', 'நிகழ்வுகள் · முதன்மை நிகழ்வு')}
        title={t('StartNet Founders Day.', 'StartNet Founders Day.')}
        lede={t(
          'Our all-brand annual show. StartNet Research, Vibe, Connect and Women in one place, with the founders they work with. Dates soon.',
          'எங்கள் அனைத்து பிராண்டுகளும் இணையும் ஆண்டு நிகழ்வு. StartNet Research, Vibe, Connect, Women — அவை உடன் பணியாற்றும் நிறுவனர்களுடன் — ஒரே இடத்தில். தேதிகள் விரைவில்.'
        )}
        breadcrumbs={[
          { label: t('Events', 'நிகழ்வுகள்'), to: '/events' },
          { label: 'StartNet Founders Day' },
        ]}
        meta={
          <div className="fday-hero__badges">
            <Badge kind="type">{t('Planned', 'திட்டமிடப்பட்டது')}</Badge>
            <Badge kind="type">{t('All-brand', 'அனைத்து பிராண்டுகளும்')}</Badge>
            <Badge kind="type">{t('Annual', 'ஆண்டுதோறும்')}</Badge>
          </div>
        }
        actions={
          <>
            <Button href="#fday-interest" size="lg" icon={ArrowDown}>
              {t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
            </Button>
            <Button variant="secondary" size="lg" href={snxLink('/signup', { src: 'founders-day', lang })}>
              {t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}
            </Button>
          </>
        }
        art={{ variant: 'dot', ratio: '4/5', night: true, seed: 7, animate: true, alt: t('Generative art: the StartNet full stop over a dot grid', 'வரைகலை: புள்ளிக் கட்டத்தின் மேல் StartNet முற்றுப்புள்ளி') }}
      />

      {/* Key facts + what it is */}
      <Section surface="paper" labelledBy="fday-about-title">
        <div className="fday-about">
          <div className="fday-about__text">
            <SectionHeader
              id="fday-about-title"
              eyebrow={t('About the day', 'நிகழ்வு பற்றி')}
              title={t('One day for the whole network', 'முழு வலையமைப்புக்கும் ஒரு நாள்')}
              lede={t(
                'Every StartNet brand runs its own flagship through the year. Founders Day is planned as the one day they share: one stage, every brand, and the founders moving up the ladder.',
                'ஒவ்வொரு StartNet பிராண்டும் ஆண்டு முழுவதும் தன் முதன்மை நிகழ்வை நடத்துகிறது. அவை அனைத்தும் பகிர்ந்துகொள்ளும் ஒரே நாளாக Founders Day திட்டமிடப்பட்டுள்ளது: ஒரே மேடை, அனைத்து பிராண்டுகள், ஏணியில் முன்னேறும் நிறுவனர்கள்.'
              )}
            />
            {/* "The programme" (sessions, speakers and format) is hidden until StartNet supplies it. */}
          </div>
          <KeyFacts
            className="fday-facts"
            sticky={false}
            title={t('Key facts', 'முக்கிய விவரங்கள்')}
            items={[
              { label: t('Status', 'நிலை'), value: t('Planned', 'திட்டமிடப்பட்டது') },
              { label: <span className="fday-facts__label"><CalendarClock aria-hidden="true" size={16} />{t('Date', 'தேதி')}</span>, value: ph },
              { label: <span className="fday-facts__label"><MapPin aria-hidden="true" size={16} />{t('Venue', 'இடம்')}</span>, value: ph },
              { label: <span className="fday-facts__label"><Ticket aria-hidden="true" size={16} />{t('Entry', 'நுழைவு')}</span>, value: ph },
              { label: <span className="fday-facts__label"><Languages aria-hidden="true" size={16} />{t('Language', 'மொழி')}</span>, value: ph },
            ]}
            action={
              <Button href="#fday-interest" full icon={ArrowDown}>
                {t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
              </Button>
            }
          />
        </div>
      </Section>

      {/* Brand rooms */}
      <Section surface="white" labelledBy="fday-brands-title">
        <SectionHeader
          id="fday-brands-title"
          eyebrow={t('Every brand, one stage', 'அனைத்து பிராண்டுகளும், ஒரே மேடை')}
          title={t('Four journeys to founder', 'நிறுவனராவதற்கான நான்கு பாதைகள்')}
          lede={t('Founders Day brings together the people each brand works with all year.', 'ஒவ்வொரு பிராண்டும் ஆண்டு முழுவதும் உடன் பணியாற்றும் மக்களை Founders Day ஒன்றிணைக்கிறது.')}
        />
        <RevealGroup as="ul" className="fday-brands" role="list">
          {brandRooms.map((r) => {
            const b = BRANDS[r.brand];
            return (
              <li key={r.brand} className="fday-brand" data-brand={r.brand}>
                <span className="fday-brand__rule" aria-hidden="true" />
                <p className="fday-brand__journey">{lang === 'ta' && b.journeyTa ? b.journeyTa : b.journey}</p>
                <h3 className="h4 fday-brand__name">{b.name}</h3>
                <p className="fday-brand__body">{r.body}</p>
                <p className="fday-brand__flagship">
                  <span className="fday-brand__flagship-label">{t('Flagship through the year', 'ஆண்டின் முதன்மை நிகழ்வு')}:</span>{' '}
                  <Link className="fday-brand__link" to={localePath(r.to)}>
                    {r.flagship} <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </p>
              </li>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Editions (T04 M05 + past editions) */}
      <Section surface="paper" labelledBy="fday-editions-title">
        <SectionHeader
          id="fday-editions-title"
          eyebrow={t('Editions', 'பதிப்புகள்')}
          title={t('Next edition', 'அடுத்த பதிப்பு')}
        />
        {eventsLoading ? (
          <Skeleton height="12rem" />
        ) : upcoming.length > 0 ? (
          <RevealGroup as="ul" className="fday-events" role="list">
            {upcoming.map((e) => (
              <li key={e.slug}><EventCard event={e} /></li>
            ))}
          </RevealGroup>
        ) : (
          <EmptyState
            title={t('Dates soon', 'தேதிகள் விரைவில்')}
            body={t('The first edition is being planned.', 'முதல் பதிப்பு திட்டமிடப்படுகிறது.')}
            action={
              <Button variant="secondary" href="#fday-interest" icon={ArrowDown}>
                {t('Tell me when it opens', 'திறக்கும்போது எனக்குத் தெரிவியுங்கள்')}
              </Button>
            }
          />
        )}
        <div className="fday-past">
          <h3 className="h5">{t('Past editions and outcomes', 'முந்தைய பதிப்புகளும் விளைவுகளும்')}</h3>
          {past.length > 0 ? (
            <ul role="list" className="fday-past__list">
              {past.map((e) => (
                <li key={e.slug}>
                  <Link className="fday-brand__link" to={localePath(eventPath(e))}>
                    <span lang={lang === 'ta' ? 'en' : undefined}>{e.title}</span> <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-2">
              {t(
                'After each edition we will list the date, co-hosts, tagged attendance and what happened next.',
                'ஒவ்வொரு பதிப்புக்குப் பிறகும் தேதி, இணை நடத்துநர்கள், குறிச்சொல் இட்ட வருகை எண்ணிக்கை, அடுத்து நடந்தவை ஆகியவற்றைப் பட்டியலிடுவோம்.'
              )}{' '}
              <Link className="fday-inline-link" to={localePath('/about/evidence-standard')}>
                {t('How we count', 'நாங்கள் எப்படி எண்ணுகிறோம்')}
              </Link>
            </p>
          )}
        </div>
      </Section>

      {/* Register interest (T13) */}
      <Section surface="white" id="fday-interest" width="narrow" labelledBy="fday-form-title">
        <div className="fday-form">
          <p className="eyebrow">{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</p>
          <h2 id="fday-form-title" className="h3">{t('Be the first to know', 'முதலில் தெரிந்துகொள்ளுங்கள்')}</h2>
          <p className="fday-form__intro">
            {t(
              'We will tell you when the date, venue and registration are confirmed. Add your email or your mobile number.',
              'தேதி, இடம், பதிவு உறுதியானதும் தெரிவிப்போம். உங்கள் மின்னஞ்சலையோ கைபேசி எண்ணையோ சேர்க்கவும்.'
            )}
          </p>
          <SmartForm
            type="interest"
            className="fday-form__form"
            fields={[
              { name: 'name', id: 'fday-name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
              {
                name: 'email', id: 'fday-email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', autoComplete: 'email', width: 'half',
                hint: t('Email or mobile: one is enough.', 'மின்னஞ்சல் அல்லது கைபேசி: ஒன்று போதும்.'),
                validate: (v, all) =>
                  !String(v || '').trim() && !String(all.phone || '').trim()
                    ? t('Please add your email or mobile number so we can tell you when it opens.', 'திறக்கும்போது தெரிவிக்க உங்கள் மின்னஞ்சலையோ கைபேசி எண்ணையோ சேர்க்கவும்.')
                    : '',
              },
              { name: 'phone', id: 'fday-phone', label: t('Mobile', 'கைபேசி'), type: 'tel', autoComplete: 'tel-national', width: 'half' },
              { name: 'role', id: 'fday-role', label: t('I am', 'நான்'), type: 'select', required: true, options: roleOptions, width: 'half' },
              {
                name: 'district', id: 'fday-district', label: t('District (optional)', 'மாவட்டம் (விருப்பம்)'), type: 'select',
                options: districtOptions(t, { emptyLabel: t('Choose a district', 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்') }), width: 'half',
              },
            ]}
            consents={[
              {
                purpose: 'contact',
                label: t('StartNet may contact me about Founders Day dates and registration.', 'Founders Day தேதிகள், பதிவு குறித்து StartNet என்னைத் தொடர்புகொள்ளலாம்.'),
                required: true,
              },
              {
                purpose: 'whatsapp_updates',
                label: t(
                  'Send me updates on WhatsApp (add your mobile number above). I can stop them any time.',
                  'WhatsApp-இல் தகவல்களை அனுப்புங்கள் (மேலே கைபேசி எண்ணைச் சேர்க்கவும்). எப்போது வேண்டுமானாலும் நிறுத்தலாம்.'
                ),
              },
            ]}
            submitLabel={t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
            successTitle={t('Thanks. We will let you know as soon as it opens.', 'நன்றி. திறந்ததும் உடனே தெரிவிப்போம்.')}
            successBody={t(
              'In the meantime, find an event near you on the StartNet calendar.',
              'அதுவரை, StartNet நாட்காட்டியில் உங்கள் அருகிலுள்ள நிகழ்வைக் கண்டறியுங்கள்.'
            )}
            hidden={{ programme: 'founders-day', source: 'events-founders-day', lang }}
          />
        </div>
      </Section>

      {/* Partnership summary (T04 M11) + FAQ */}
      <Section surface="paper" labelledBy="fday-faq-title">
        <div className="fday-bottom">
          <Reveal className="fday-sponsor">
            <p className="eyebrow">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</p>
            <h2 className="h4">{t('Sponsor Founders Day', 'Founders Day-க்கு நிதியளியுங்கள்')}</h2>
            <p className="text-2">
              {t('Annual all-brand packages available.', 'ஆண்டு முழுவதற்குமான அனைத்து பிராண்டுத் தொகுப்புகள் உள்ளன.')}
            </p>
            <Button variant="tertiary" to="/partner/sponsors">
              {t('Sponsorship packages', 'நிதியுதவித் தொகுப்புகள்')}
            </Button>
          </Reveal>
          <div className="fday-faq">
            <SectionHeader id="fday-faq-title" eyebrow={t('Questions', 'கேள்விகள்')} title={t('Founders Day questions', 'Founders Day கேள்விகள்')} as="h2" />
            <Accordion items={faq} faq />
          </div>
        </div>
      </Section>

      <CTABand
        surface="paper"
        title={t('Find a room full of builders near you.', 'உங்கள் அருகில் உருவாக்குபவர்கள் நிறைந்த அரங்கைக் கண்டறியுங்கள்.')}
        body={t(
          'Until Founders Day, there are summits, sector Connects, campus build nights and district editions across Tamil Nadu.',
          'Founders Day வரை, தமிழ்நாடு முழுவதும் உச்சி மாநாடுகள், துறை Connect-கள், கல்லூரி உருவாக்க இரவுகள், மாவட்டப் பதிப்புகள் உள்ளன.'
        )}
        actions={
          <Button to="/events" icon={ArrowRight}>
            {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
          </Button>
        }
      />
    </>
  );
}
