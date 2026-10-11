import { Link } from 'react-router-dom';
import { Briefcase, Building2, Globe, Landmark, Presentation, Rocket, Lock } from 'lucide-react';
import {
  Accordion, ArtImage, Badge, BrandHero, Button, CTABand, Reveal, RevealGroup, Section, Seo, Steps, TagChip, WhatsAppButton,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { useApi } from '../../../hooks/useApi.js';
import ConnectHeading, { DotTitle } from './ConnectHeading.jsx';
import ConnectProof from './ConnectProof.jsx';
import { CircleMembership, FitLabel, SwitchFacts, UpcomingConnect } from './ConnectBits.jsx';
import SeriesGrid from './SeriesGrid.jsx';
import SwitchStepper from './SwitchStepper.jsx';
import NetworkGraph from './NetworkGraph.jsx';
import SeatRing from './SeatRing.jsx';
import { ANGELS_LEGAL, ANGELS_LEGAL_TA, PATH_STEPS, SCALE_OFFERS, SPONSOR_EMAIL, connectLinks } from './connectData.js';
import { itemListLd } from '../../../lib/seo.js';
import { pageLd } from '../seoBits.js';
import { ScrubText } from '../../../components/ScrubText.jsx';
import '../brandPage.css';
import './ConnectHome.css';

/** Programmes listed on this brand home (ItemList JSON-LD). */
const CONNECT_PROGRAMMES = [
  { name: 'Connect Series', path: '/connect/series' },
  { name: 'Connect Circles', path: '/connect/circles' },
  { name: 'Founder Switch', path: '/connect/founder-switch' },
  { name: 'Scale Connect', path: '/connect/scale' },
  { name: 'StartNet Angels', path: '/connect/angels' },
];

// SEO: primary "professional to startup founder", secondary "co-founder matching", "GenAI / SaaS / D2C community"
// (Book 1 §9.2 Professionals theme). SEO-TA: pending native review
const SEO = {
  title: ['StartNet Connect: from professional to startup founder', 'StartNet Connect: பணியிலிருந்து ஸ்டார்ட்அப் நிறுவனர் வரை'],
  description: [
    'For working professionals in Tamil Nadu, especially in GCCs and IT: sector Connects (GenAI, SaaS, D2C), founder circles, co-founder matching and Founder Switch.',
    'தமிழ்நாட்டில் பணியிலுள்ள தொழில் வல்லுநர்களுக்கு, குறிப்பாக GCC, IT துறையினருக்கு: துறை Connect-கள், நிறுவனர் குழுக்கள், இணை நிறுவனர் பொருத்தம், Founder Switch.',
  ],
};

const SCALE_ICONS = { 'investor-days': Presentation, 'pilot-days': Building2, procurement: Landmark, export: Globe };

// Tamil strings are drafts (Book 2 §14: native Tamil review pending). Brand and programme names stay Latin.
export default function ConnectHome() {
  const { lang, t, localePath } = useLang();
  const links = connectLinks(lang);
  const { data: events, loading, error } = useApi('/api/events?brand=connect&when=upcoming');
  const upcoming = Array.isArray(events) ? events : [];
  const legal = t(ANGELS_LEGAL, ANGELS_LEGAL_TA);
  const sponsor = t('Ask your employer to sponsor a seat', 'உங்கள் இடத்துக்கு நிதியுதவி செய்ய உங்கள் நிறுவனத்திடம் கேளுங்கள்');
  const sponsorShort = t('Ask your employer', 'நிறுவனத்திடம் கேளுங்கள்');
  const membershipNote = t("Membership is by application. We'll check your sector seat is free before you pay.", 'உறுப்பினர் சேர்க்கை விண்ணப்பத்தின் மூலம். நீங்கள் கட்டணம் செலுத்தும் முன் உங்கள் துறை இடம் காலியாக உள்ளதா என்று சரிபார்ப்போம்.');

  const faq = [
    // AEO FAQ: drafted from Book 2 §3.3 sub-head and professional-to-founder path — StartNet review.
    // SEO-TA: pending native review
    {
      id: 'what',
      question: t('What is StartNet Connect?', 'StartNet Connect என்றால் என்ன?'),
      answer: t(
        'StartNet Connect helps working professionals, especially in GCCs and IT, become founders, and helps existing startups find customers, capital and co-founders. The path: attend a sector Connect, explore Founder Switch, find a co-founder, then grow with Circles and Scale Connect.',
        'StartNet Connect பணியிலுள்ள தொழில் வல்லுநர்கள், குறிப்பாக GCC மற்றும் IT துறையினர், நிறுவனர்கள் ஆக உதவுகிறது; ஏற்கெனவே உள்ள ஸ்டார்ட்அப்கள் வாடிக்கையாளர்கள், முதலீடு, இணை நிறுவனர்களைக் கண்டறியவும் உதவுகிறது. பாதை: ஒரு துறை Connect-இல் பங்கேற்பு, Founder Switch, இணை நிறுவனர் பொருத்தம், பிறகு Circles, Scale Connect மூலம் வளர்ச்சி.'
      ),
    },
    {
      id: 'quit',
      question: t('Do I need to quit my job?', 'நான் என் வேலையை விட வேண்டுமா?'),
      answer: t(
        'No. Founder Switch runs on evenings and weekends for 12 weeks. You validate the idea with customers, find or test a co-founder and plan your financial runway before you decide anything.',
        'இல்லை. Founder Switch 12 வாரங்கள் மாலை நேரங்களிலும் வார இறுதிகளிலும் நடக்கிறது. எதையும் முடிவு செய்யும் முன் வாடிக்கையாளர்களுடன் யோசனையைச் சரிபார்த்து, இணை நிறுவனரைக் கண்டறிந்து அல்லது சோதித்து, உங்கள் நிதி இருப்புக் காலத்தைத் திட்டமிடுகிறீர்கள்.'
      ),
    },
    {
      id: 'employer',
      question: t('Can my employer pay for Founder Switch?', 'Founder Switch-க்கு என் நிறுவனம் கட்டணம் செலுத்த முடியுமா?'),
      answer: t(
        'Some GCCs sponsor seats for their employees. Use "Ask your employer to sponsor a seat" on the Founder Switch page and we will open a pre-written email you can send.',
        'சில GCC-கள் தங்கள் ஊழியர்களுக்கான இடங்களுக்கு நிதியுதவி செய்கின்றன. Founder Switch பக்கத்தில் "உங்கள் இடத்துக்கு நிதியுதவி செய்ய உங்கள் நிறுவனத்திடம் கேளுங்கள்" என்பதைப் பயன்படுத்துங்கள்; நீங்கள் அனுப்பக்கூடிய, முன்பே எழுதப்பட்ட மின்னஞ்சலைத் திறப்போம்.'
      ),
    },
    {
      id: 'outcomes',
      question: t('Is this just networking?', 'இது வெறும் அறிமுகக் கூட்டமா?'),
      answer: t(
        'Each Connect is a community, not a single date: a flagship event, monthly meet-ups, a sector report and a Circle. In Circles, introductions and referrals are logged on StartNet X and reported back to members. Outcomes are published, tagged and dated, in the Founder Ledger.',
        'ஒவ்வொரு Connect-உம் ஒரு நாள் நிகழ்வு அல்ல, ஒரு சமூகம்: ஒரு முதன்மை நிகழ்வு, மாதாந்திரச் சந்திப்புகள், ஒரு துறை அறிக்கை மற்றும் ஒரு Circle. Circles-இல் அறிமுகங்களும் பரிந்துரைகளும் StartNet X-இல் பதிவு செய்யப்பட்டு உறுப்பினர்களுக்குத் தெரிவிக்கப்படுகின்றன. விளைவுகள் குறியிடப்பட்டு, தேதியுடன் Founder Ledger-இல் வெளியிடப்படுகின்றன.'
      ),
    },
    {
      id: 'circle-cost',
      question: t('What does a Circle cost?', 'ஒரு Circle-க்கு என்ன கட்டணம்?'),
      answer: (
        <>
          {t('Membership is from ₹30,000 a year', 'உறுப்பினர் கட்டணம் ஆண்டுக்கு ₹30,000 முதல்')} <TagChip tag="C" />{' '}
          {t(
            "and includes StartNet X Pro. Membership is by application. We'll check your sector seat is free before you pay.",
            'இதில் StartNet X Pro அடங்கும். உறுப்பினர் சேர்க்கை விண்ணப்பத்தின் மூலம். நீங்கள் கட்டணம் செலுத்தும் முன் உங்கள் துறை இடம் காலியாக உள்ளதா என்று சரிபார்ப்போம்.'
          )}
        </>
      ),
    },
    {
      id: 'startup',
      question: t('My startup already has revenue. Is Connect for me?', 'என் ஸ்டார்ட்அப்புக்கு ஏற்கெனவே வருவாய் உள்ளது. Connect எனக்கானதா?'),
      answer: t(
        'Yes. Scale Connect is for startups past first revenue: curated investor days, pilot matchmaking with GCCs and corporates, readiness for government procurement, and export desks connected to Tamil diaspora networks. It is included with StartNet X Scale.',
        'ஆம். Scale Connect முதல் வருவாயைக் கடந்த ஸ்டார்ட்அப்களுக்கானது: தேர்ந்தெடுக்கப்பட்ட முதலீட்டாளர் நாட்கள், GCC-கள் மற்றும் பெருநிறுவனங்களுடன் பைலட் பொருத்தம், அரசுக் கொள்முதலுக்கான தயார்நிலை, உலகத் தமிழர் வலையமைப்புகளுடன் இணைந்த ஏற்றுமதி மையங்கள். இது StartNet X Scale-உடன் சேர்ந்தே கிடைக்கும்.'
      ),
    },
    {
      id: 'sectors',
      question: t('Which sectors have a Connect?', 'எந்தெந்தத் துறைகளுக்கு Connect உள்ளது?'),
      answer: t(
        'GenAI, SaaS and D2C Connect are running. DeepTech, FinTech and Industry 4.0 Connect are proposed for 2027, with HealthTech, AgriFood and Climate Connect proposed to follow. We co-host with sector bodies wherever we can, rather than duplicate them.',
        'GenAI, SaaS, D2C Connect இப்போது நடக்கின்றன. DeepTech, FinTech, Industry 4.0 Connect 2027-க்கு முன்மொழியப்பட்டுள்ளன; அதைத் தொடர்ந்து HealthTech, AgriFood, Climate Connect முன்மொழியப்பட்டுள்ளன. துறை அமைப்புகளின் பணியை மீண்டும் செய்வதற்குப் பதிலாக, முடிந்தவரை அவற்றுடன் இணைந்து நடத்துகிறோம்.'
      ),
    },
    { id: 'faq-angels', question: t('Can I invest through StartNet Angels?', 'StartNet Angels மூலம் நான் முதலீடு செய்யலாமா?'), answer: legal },
  ];

  const steps = PATH_STEPS.map((s) => ({ title: t(s.title, s.titleTa), body: t(s.body, s.bodyTa) }));

  return (
    <>
      <Seo
        title={t(...SEO.title)}
        titleTa={SEO.title[1]}
        description={t(...SEO.description)}
        descriptionTa={SEO.description[1]}
        jsonLd={[
          pageLd({ path: '/connect', lang, name: t(...SEO.title), description: t(...SEO.description) }),
          itemListLd({ name: t('StartNet Connect programmes', 'StartNet Connect திட்டங்கள்'), items: CONNECT_PROGRAMMES, lang }),
        ]}
      />

      <BrandHero
        brand="connect"
        title={t('Keep your job while you test your company.', 'உங்கள் நிறுவனத்தைச் சோதிக்கும்போதே உங்கள் வேலையைத் தொடருங்கள்.')}
        lede={t(
          'StartNet Connect helps working professionals, especially in GCCs and IT, become founders, and helps existing startups find customers, capital and co-founders.',
          'StartNet Connect பணியிலுள்ள தொழில் வல்லுநர்கள், குறிப்பாக GCC மற்றும் IT துறையினர், நிறுவனர்கள் ஆக உதவுகிறது; ஏற்கெனவே உள்ள ஸ்டார்ட்அப்கள் வாடிக்கையாளர்கள், முதலீடு மற்றும் இணை நிறுவனர்களைக் கண்டறியவும் உதவுகிறது.'
        )}
        actions={
          <>
            <Button variant="brand" size="lg" to="/events?brand=connect">{t('See Connect events', 'Connect நிகழ்வுகளைப் பாருங்கள்')}</Button>
            <Button variant="secondary" size="lg" href={links.applySwitch}>{t('Apply for Founder Switch', 'Founder Switch-க்கு விண்ணப்பியுங்கள்')}</Button>
          </>
        }
        art={{ variant: 'network', brand: 'connect', ratio: '4/5', seed: 7, animate: true, alt: '' }}
      />

      {/* Proof band (renders its own section; hidden until a Connect figure is supplied) */}
      <ConnectProof />

      {/* Network graph */}
      <Section surface="white" labelledBy="connect-network-title">
        <ConnectHeading
          id="connect-network-title"
          eyebrow={t('The network', 'வலையமைப்பு')}
          title={t('The people in your sector, in rooms built for it.', 'உங்கள் துறையின் மனிதர்கள், அவர்களுக்கென்றே அமைந்த அரங்குகளில்.')}
          lede={<ScrubText as="span">{t(
            'Meet the people in your sector who can help you start, switch or scale. Connect joins professionals and founders to mentors, GCCs and corporates, and investors.',
            'தொடங்க, மாற அல்லது வளர உங்களுக்கு உதவக்கூடிய உங்கள் துறையினரைச் சந்தியுங்கள். Connect தொழில் வல்லுநர்களையும் நிறுவனர்களையும் வழிகாட்டிகள், GCC-கள், பெருநிறுவனங்கள் மற்றும் முதலீட்டாளர்களுடன் இணைக்கிறது.'
          )}</ScrubText>}
        />
        <Reveal><NetworkGraph /></Reveal>
      </Section>

      {/* Path + who it's for */}
      <Section surface="paper" labelledBy="connect-path-title">
        <ConnectHeading
          id="connect-path-title"
          eyebrow={t('Professional → Founder · Startup → Scale', 'தொழில் வல்லுநர் → நிறுவனர் · ஸ்டார்ட்அப் → விரிவாக்கம்')}
          title={t('The professional-to-founder path', 'தொழில் வல்லுநரிலிருந்து நிறுவனருக்கான பாதை')}
        />
        <Steps variant="row" steps={steps} />
        <RevealGroup className="connect-home__who">
          <article className="connect-home__whocard">
            <Briefcase className="connect-home__whoicon" size={28} aria-hidden="true" />
            <h3 className="h4">{t('Professionals', 'தொழில் வல்லுநர்கள்')}</h3>
            <p className="text-2">{t(
              'Working professionals, especially in GCCs and IT, who want validation before quitting, a co-founder and investors.',
              'வேலையை விடும் முன் யோசனைக்கான உறுதிப்பாடு, ஒரு இணை நிறுவனர், முதலீட்டாளர்கள் தேவைப்படும், பணியிலுள்ள தொழில் வல்லுநர்கள், குறிப்பாக GCC மற்றும் IT துறையினர்.'
            )}</p>
            <ul className="connect-home__whotasks">
              <li><Link to={localePath('/connect/series')}>{t('Book a sector Connect', 'ஒரு துறை Connect-இல் இடம் பதிவு செய்யுங்கள்')}</Link></li>
              <li><Link to={localePath('/connect/founder-switch')}>{t('Apply to Founder Switch', 'Founder Switch-க்கு விண்ணப்பியுங்கள்')}</Link></li>
              <li><Link to={localePath('/connect/circles')}>{t('Ask about Circles', 'Circles பற்றிக் கேளுங்கள்')}</Link></li>
            </ul>
          </article>
          <article className="connect-home__whocard">
            <Rocket className="connect-home__whoicon" size={28} aria-hidden="true" />
            <h3 className="h4">{t('Startups', 'ஸ்டார்ட்அப்கள்')}</h3>
            <p className="text-2">{t(
              'Existing startups that need customers, capital and co-founders, and startups past first revenue ready to scale.',
              'வாடிக்கையாளர்கள், முதலீடு, இணை நிறுவனர்கள் தேவைப்படும் ஸ்டார்ட்அப்கள், மற்றும் வளரத் தயாராக உள்ள, முதல் வருவாயைக் கடந்த ஸ்டார்ட்அப்கள்.'
            )}</p>
            <ul className="connect-home__whotasks">
              <li><Link to={localePath('/connect/scale')}>{t('Apply to Scale Connect', 'Scale Connect-க்கு விண்ணப்பியுங்கள்')}</Link></li>
              <li><Link to={localePath('/connect/circles')}>{t('Join a Circle', 'ஒரு Circle-இல் இணையுங்கள்')}</Link></li>
            </ul>
          </article>
        </RevealGroup>
      </Section>

      {/* Connect Series */}
      <Section surface="white" id="series" labelledBy="connect-series-title">
        <ConnectHeading
          id="connect-series-title"
          eyebrow="Connect Series"
          title={t('Nine sectors. One community each, all year.', 'ஒன்பது துறைகள். ஒவ்வொன்றுக்கும் ஒரு சமூகம், ஆண்டு முழுவதும்.')}
          lede={t(
            'Each Connect is a community, not a single date: a flagship event, monthly meet-ups, a sector report and a Circle. We co-host with sector bodies wherever we can, rather than duplicate them.',
            'ஒவ்வொரு Connect-உம் ஒரு நாள் நிகழ்வு அல்ல, ஒரு சமூகம்: ஒரு முதன்மை நிகழ்வு, மாதாந்திரச் சந்திப்புகள், ஒரு துறை அறிக்கை மற்றும் ஒரு Circle. துறை அமைப்புகளின் பணியை மீண்டும் செய்வதற்குப் பதிலாக, முடிந்தவரை அவற்றுடன் இணைந்து நடத்துகிறோம்.'
          )}
          action={<Button variant="tertiary" to="/connect/series">{t('All sector Connects', 'அனைத்துத் துறை Connect-கள்')}</Button>}
        />
        <SeriesGrid events={upcoming} />
      </Section>

      {/* Next editions */}
      <Section surface="paper" labelledBy="connect-next-title">
        <ConnectHeading
          id="connect-next-title"
          eyebrow={t('Upcoming', 'வரவிருப்பவை')}
          title={t('Next Connect editions', 'அடுத்த Connect பதிப்புகள்')}
          action={<Button variant="tertiary" to="/events?brand=connect">{t('See all Connect events', 'அனைத்து Connect நிகழ்வுகளையும் பாருங்கள்')}</Button>}
        />
        <UpcomingConnect events={upcoming} loading={loading} error={error} />
      </Section>

      {/* Founder Switch — the page's one Night band */}
      <Section surface="night" brand="connect" id="founder-switch" labelledBy="connect-switch-title">
        <div className="connect-home__switchhead">
          <ConnectHeading
            id="connect-switch-title"
            eyebrow="Founder Switch"
            title={t('Twelve weeks to a clear go or no-go.', 'தொடர்வதா வேண்டாமா என்ற தெளிவான முடிவுக்குப் பன்னிரண்டு வாரங்கள்.')}
            lede={t(
              'For professionals with a day job and an idea. Evenings and weekends for 12 weeks: validate the idea with customers, find or test a co-founder, plan your financial runway, and finish with a decision you can defend. Some GCCs sponsor seats for their employees.',
              'வேலையும் ஒரு யோசனையும் உள்ள தொழில் வல்லுநர்களுக்கு. 12 வாரங்கள், மாலை நேரங்களிலும் வார இறுதிகளிலும்: வாடிக்கையாளர்களுடன் யோசனையைச் சரிபாருங்கள், இணை நிறுவனரைக் கண்டறியுங்கள் அல்லது சோதியுங்கள், நிதி இருப்புக் காலத்தைத் திட்டமிடுங்கள், நியாயப்படுத்தக்கூடிய முடிவுடன் நிறைவு செய்யுங்கள். சில GCC-கள் தங்கள் ஊழியர்களுக்கான இடங்களுக்கு நிதியுதவி செய்கின்றன.'
            )}
          />
          <Reveal className="connect-home__switchaside">
            <SwitchFacts />
            <div className="cluster">
              <Button variant="brand" href={links.applySwitch}>{t('Apply for the next cohort', 'அடுத்த குழுவுக்கு விண்ணப்பியுங்கள்')}</Button>
              <Button variant="secondary" href={SPONSOR_EMAIL}><FitLabel long={sponsor} short={sponsorShort} /></Button>
            </div>
          </Reveal>
        </div>
        <Reveal><SwitchStepper /></Reveal>
      </Section>

      {/* Circles */}
      <Section surface="paper" id="circles" labelledBy="connect-circles-title">
        <div className="split">
          <Reveal className="connect-home__circlesart"><SeatRing /></Reveal>
          <div>
            <ConnectHeading
              id="connect-circles-title"
              eyebrow="Connect Circles"
              title={t('Twenty-five to forty founders. One seat per sector. Every month.', 'இருபத்தைந்து முதல் நாற்பது நிறுவனர்கள். ஒரு துறைக்கு ஓர் இடம். ஒவ்வொரு மாதமும்.')}
              lede={t(
                'A Connect Circle is a closed chapter that meets monthly. Each sector has one seat, so members refer business instead of competing for it. Introductions and referrals are logged on StartNet X and reported back to members. Volunteer chairs, StartNet operations.',
                'Connect Circle என்பது மாதந்தோறும் சந்திக்கும் ஒரு மூடிய குழு. ஒவ்வொரு துறைக்கும் ஓர் இடம் மட்டுமே; அதனால் உறுப்பினர்கள் போட்டியிடுவதற்குப் பதிலாக ஒருவருக்கொருவர் வணிகத்தைப் பரிந்துரைக்கிறார்கள். அறிமுகங்களும் பரிந்துரைகளும் StartNet X-இல் பதிவு செய்யப்பட்டு உறுப்பினர்களுக்குத் தெரிவிக்கப்படுகின்றன. தன்னார்வத் தலைவர்கள், StartNet செயல்பாடுகள்.'
              )}
            />
            <Reveal className="connect-home__circlesmeta">
              <CircleMembership />
              <p className="small muted">{membershipNote}</p>
              <div className="cluster">
                <Button variant="brand" href={links.applyCircle}>{t('Apply to a Circle', 'ஒரு Circle-க்கு விண்ணப்பியுங்கள்')}</Button>
                <Button variant="secondary" href={links.findCircle}>{t('Find a Circle near you', 'அருகிலுள்ள Circle-ஐக் கண்டறியுங்கள்')}</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Scale Connect */}
      <Section surface="white" id="scale" labelledBy="connect-scale-title">
        <div className="split">
          <div>
            <ConnectHeading
              id="connect-scale-title"
              eyebrow={t('Scale Connect · Startup → Scale', 'Scale Connect · ஸ்டார்ட்அப் → விரிவாக்கம்')}
              title={t('Your next customer, investor or market.', 'உங்கள் அடுத்த வாடிக்கையாளர், முதலீட்டாளர் அல்லது சந்தை.')}
              lede={t(
                'For startups past first revenue. Curated investor days, pilot matchmaking with GCCs and corporates, readiness for government procurement, and export desks connected to Tamil diaspora networks.',
                'முதல் வருவாயைக் கடந்த ஸ்டார்ட்அப்களுக்கு. தேர்ந்தெடுக்கப்பட்ட முதலீட்டாளர் நாட்கள், GCC-கள் மற்றும் பெருநிறுவனங்களுடன் பைலட் பொருத்தம், அரசுக் கொள்முதலுக்கான தயார்நிலை, உலகத் தமிழர் வலையமைப்புகளுடன் இணைந்த ஏற்றுமதி மையங்கள்.'
              )}
            />
            <RevealGroup as="ul" className="connect-home__offers">
              {SCALE_OFFERS.map((o) => {
                const Icon = SCALE_ICONS[o.id];
                return (
                  <li key={o.id} className="connect-home__offer">
                    <span className="connect-home__offericon" aria-hidden="true"><Icon size={22} /></span>
                    <div>
                      <h3 className="h5">{t(o.title, o.titleTa)}</h3>
                      <p className="small text-2">{t(o.body, o.bodyTa)}</p>
                    </div>
                  </li>
                );
              })}
            </RevealGroup>
            <div className="cluster connect-home__scalecta">
              <Button variant="brand" href={links.applyScale}>{t('Apply to Scale Connect', 'Scale Connect-க்கு விண்ணப்பியுங்கள்')}</Button>
              <span className="small muted">{t('Included with StartNet X Scale.', 'StartNet X Scale-உடன் சேர்ந்தே கிடைக்கும்.')}</span>
            </div>
          </div>
          <Reveal className="connect-home__scaleart">
            <ArtImage variant="ladder" brand="connect" ratio="4/5" seed={11} alt="" />
          </Reveal>
        </div>
      </Section>

      {/* StartNet Angels — coming (P3) */}
      <Section surface="paper" id="angels" labelledBy="connect-angels-title">
        <Reveal className="connect-home__angels">
          <div className="connect-home__angelshead">
            <Badge kind="status" status="upcoming">{t('Coming · not yet open', 'விரைவில் · திறக்கப்படவில்லை')}</Badge>
            <Lock size={20} aria-hidden="true" className="connect-home__angelslock" />
          </div>
          <p className="eyebrow">StartNet Angels</p>
          <h2 id="connect-angels-title" className="h2 connect-home__angelstitle">
            <DotTitle text={t('Founders backing the next founders.', 'அடுத்த நிறுவனர்களுக்குத் துணை நிற்கும் நிறுவனர்கள்.')} />
          </h2>
          <p className="body-lg text-2 connect-home__angelsbody">
            {t(
              'An angel network for Circle alumni, successful founders and experienced professionals who want to invest in companies from StartNet programmes. Investments are made only through a SEBI-compliant structure',
              'StartNet திட்டங்களிலிருந்து வரும் நிறுவனங்களில் முதலீடு செய்ய விரும்பும் Circle முன்னாள் உறுப்பினர்கள், வெற்றிகரமான நிறுவனர்கள் மற்றும் அனுபவமிக்க தொழில் வல்லுநர்களுக்கான ஏஞ்சல் வலையமைப்பு. SEBI விதிகளுக்கு இணங்கிய கட்டமைப்பின் மூலம் மட்டுமே முதலீடுகள் செய்யப்படும்'
            )}.
          </p>
          <div className="cluster">
            <Button variant="secondary" href={links.angelsInterest}>
              <FitLabel long={t('Register interest as an angel', 'ஏஞ்சல் முதலீட்டாளராக ஆர்வத்தைப் பதிவு செய்யுங்கள்')} short={t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')} />
            </Button>
            <Button variant="tertiary" to="/connect/angels">{t('About StartNet Angels', 'StartNet Angels பற்றி')}</Button>
          </div>
          <p className="caption connect-home__legal">{legal}</p>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section surface="white" className="bp-faq" labelledBy="connect-faq-title">
        <ConnectHeading id="connect-faq-title" eyebrow={t('Questions', 'கேள்விகள்')} title={t('Before you come to a Connect', 'Connect-க்கு வரும் முன்')} />
        <Accordion items={faq} faq />
      </Section>

      <CTABand
        surface="paper"
        className="brand-close"
        brand="connect"
        title={t('Find your sector Connect.', 'உங்கள் துறை Connect-ஐக் கண்டறியுங்கள்.')}
        body={t('Register for the next edition in your sector, or ask us anything on WhatsApp.', 'உங்கள் துறையின் அடுத்த பதிப்புக்குப் பதிவு செய்யுங்கள், அல்லது WhatsApp-இல் எதையும் கேளுங்கள்.')}
        actions={
          <>
            <Button variant="brand" to="/connect/series">{t('See next Connect', 'அடுத்த Connect-ஐப் பாருங்கள்')}</Button>
            <WhatsAppButton text="CONNECT" label={t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')} />
          </>
        }
      />
    </>
  );
}
