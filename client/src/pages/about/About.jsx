// /about · Our story (T19). Copy: Book 2 §2.1 verbatim. Structure: Book 1 Part B §2.2, Book 4 R1 §9 (#15, #16).
// Tamil copy: draft pending native review (Book 2 §14).
import {
  Seo, PageHero, Section, SectionHeader, Reveal, RevealGroup, ArtImage, FactBand, Button, CTABand, LogoWall, Dot, Accordion,
  EventVideos,
} from '../../components';
import { videosForPlace } from '../../data/videos.js';
import { useLang } from '../../lib/i18n.jsx';
import { useApi } from '../../hooks/useApi.js';
import { aboutCrumbs, InPageBar, Num } from './shared.jsx';
import ModelDiagram from './ModelDiagram.jsx';
import Timeline from './Timeline.jsx';
import './About.css';
import '../utility/restKit.css';
import { ORG_REF } from '../../lib/seo.js';
import { pageLd } from '../brands/seoBits.js';

// AEO FAQ: drafted from Book 2 §2.1 (sub-head, What we do, How we work, Who we work with, Our history) and §2.4
// (Mission 1 Lakh goal as stated on /about/mission-1-lakh) — StartNet review. No new facts.
// SEO-TA: pending native review
const ABOUT_FAQ = [
  {
    id: 'what',
    q: ['What does StartNet do?', 'StartNet என்ன செய்கிறது?'],
    a: [
      'We run four talent brands, each focused on one source of founders: StartNet Research (scholars and faculty), StartNet Vibe (students), StartNet Connect (professionals and existing startups) and StartNet Women. Behind them sit six shared engines (events, learning, insights, incubation, capital and market access) and one platform, StartNet X.',
      'ஒவ்வொன்றும் நிறுவனர்களின் ஒரு மூலத்தில் கவனம் செலுத்தும் நான்கு திறமை பிராண்டுகளை நடத்துகிறோம்: StartNet Research (ஆய்வாளர்கள், பேராசிரியர்கள்), StartNet Vibe (மாணவர்கள்), StartNet Connect (பணியில் உள்ளவர்கள், ஏற்கனவே இயங்கும் ஸ்டார்ட்அப்கள்), StartNet Women. அவற்றுக்குப் பின்னால் ஆறு பகிரப்பட்ட இயந்திரங்களும் (நிகழ்வுகள், கற்றல், நுண்ணறிவு, இன்குபேஷன், மூலதனம், சந்தை அணுகல்) ஒரே தளமான StartNet X-உம் உள்ளன.',
    ],
  },
  {
    id: 'where',
    q: ['Where does StartNet work?', 'StartNet எங்கே செயல்படுகிறது?'],
    a: [
      // Salem HQ: registered and operating offices are in Salem (MCA record; StartNet LinkedIn). SEO-TA: pending native review
      'StartNet is headquartered in Salem and works across Tamil Nadu. We go to districts and campuses, and we work in Tamil and English.',
      'StartNet சேலத்தைத் தலைமையிடமாகக் கொண்டு தமிழ்நாடு முழுவதும் செயல்படும் நிறுவனம். மாவட்டங்களுக்கும் கல்லூரிகளுக்கும் நேரில் செல்கிறோம்; தமிழிலும் ஆங்கிலத்திலும் பணியாற்றுகிறோம்.',
    ],
  },
  {
    id: 'rival',
    q: ['Does StartNet compete with incubators and state startup programmes?', 'StartNet இன்குபேட்டர்களுக்கும் மாநில ஸ்டார்ட்அப் திட்டங்களுக்கும் போட்டியா?'],
    a: [
      "No. We are a feeder and connector, not a rival to the institutions already doing this well. We send founders on to incubators, state programmes and investor networks, and we bring their programmes to campuses and districts they don't yet reach.",
      'இல்லை. இந்தப் பணியை ஏற்கெனவே சிறப்பாகச் செய்யும் அமைப்புகளுக்கு நாங்கள் போட்டியாளர் அல்ல; ஊட்டுபவரும் இணைப்பவரும். நிறுவனர்களை அடைகாப்பகங்கள், மாநிலத் திட்டங்கள், முதலீட்டாளர் வலையமைப்புகளுக்கு அனுப்புகிறோம்; அவை இன்னும் சென்றடையாத வளாகங்களுக்கும் மாவட்டங்களுக்கும் அவற்றின் திட்டங்களைக் கொண்டுசெல்கிறோம்.',
    ],
  },
  {
    id: 'mission',
    q: ['What is Mission 1 Lakh?', 'Mission 1 Lakh என்றால் என்ன?'],
    a: [
      'Our public goal: to nurture 1,00,000 founders and aspiring founders in Tamil Nadu by March 2031. We report against it every quarter. It is a plan, not a forecast, and we review it in public; the checkpoint is in 2028.',
      'எங்கள் பொது இலக்கு: மார்ச் 2031-க்குள் தமிழ்நாட்டில் 1,00,000 நிறுவனர்களையும் நிறுவனர் ஆக விரும்புபவர்களையும் வளர்ப்பது. ஒவ்வொரு காலாண்டும் இதற்கு எதிராக அறிக்கையிடுகிறோம். இது திட்டம், முன்கணிப்பு அல்ல; பொதுவெளியில் மறுஆய்வு செய்கிறோம்; சரிபார்ப்புப் புள்ளி 2028-இல்.',
    ],
  },
  {
    id: 'history',
    q: ['How long has StartNet been running events?', 'StartNet எவ்வளவு காலமாக நிகழ்வுகளை நடத்துகிறது?'],
    a: [
      // Public record starts in 2023 (launch post June 2023; incorporated 4 July 2023). Edition dates: server/data/events.json.
      // SEO-TA: pending native review
      'Since 2023. Our rooms include GenAI Connect (2024), D2C Connect (2024), SaaS Connect (2025), an Investors Summit and Vibathon 2025. In October 2026 we brought that work together under one promise: every talent, a founder.',
      '2023 முதல். GenAI Connect (2024), D2C Connect (2024), SaaS Connect (2025), ஒரு Investors Summit, Vibathon 2025 ஆகியவை எங்கள் நிகழ்வுகளில் அடங்கும். அக்டோபர் 2026-இல் அந்தப் பணிகள் அனைத்தையும் ஒரே வாக்குறுதியின் கீழ் கொண்டுவந்தோம்: ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.',
    ],
  },
];

// SEO: primary "about StartNet", secondary "startup ecosystem Tamil Nadu" (Book 2 §2.1 sub-head).
// SEO-TA: pending native review
const SEO = {
  title: ["About StartNet: Tamil Nadu's founder-making network", 'StartNet பற்றி: தமிழ்நாட்டு நிறுவனர் வலையமைப்பு'],
  description: [
    'StartNet is a Salem-headquartered company that helps scholars, students, professionals and women across Tamil Nadu start companies, and counts them in public.',
    'சேலத்தைத் தலைமையிடமாகக் கொண்ட StartNet, தமிழ்நாடு முழுவதும் ஆய்வாளர்கள், மாணவர்கள், பணியாளர்கள், பெண்கள் ஸ்டார்ட்அப் தொடங்க உதவுகிறது.',
  ],
  path: '/about',
};

const contextMetrics = (t) => [
  {
    id: 'tn-startups', key: 'tn_dpiit_startups', value: 15037, tag: 'A',
    label: t('DPIIT-recognised startups in Tamil Nadu', 'தமிழ்நாட்டில் DPIIT அங்கீகாரம் பெற்ற ஸ்டார்ட்அப்கள்'),
    asAt: t('July 2026', 'ஜூலை 2026'), source: t('DPIIT data via DT Next, July 2026', 'DPIIT தரவு, DT Next வழியாக, ஜூலை 2026'),
  },
  {
    id: 'tn-ger', key: 'tn_higher_ed_ger', value: 52.3, unit: '%', tag: 'A',
    label: t('higher-education GER, the highest in India', 'உயர்கல்வி GER, இந்தியாவிலேயே அதிகம்'),
    asAt: '2023-24', source: 'AISHE 2023-24',
  },
  {
    id: 'tn-gcc', key: 'tn_gccs', value: 250, unit: '+', tag: 'B',
    label: t('Global Capability Centres in the state', 'மாநிலத்தில் உள்ள உலகளாவிய திறன் மையங்கள் (GCC)'),
    asAt: t('Dec 2025', 'டிசம்பர் 2025'), source: t('ANAROCK–FICCI, Dec 2025', 'ANAROCK–FICCI, டிசம்பர் 2025'),
  },
  {
    id: 'tn-funding-pct', key: 'tn_dpiit_funding_percentile', value: t('50th', '50'), unit: t('', '-ஆவது'), tag: 'A', countUp: false,
    label: t(
      'percentile on funding in the DPIIT States’ Startup Ranking (100th on infrastructure)',
      'DPIIT மாநில ஸ்டார்ட்அப் தரவரிசையில் நிதியுதவியில் சதமானம் (உள்கட்டமைப்பில் 100-ஆவது)'
    ),
    asAt: t('Jan 2026', 'ஜனவரி 2026'), source: t('DPIIT States’ Startup Ranking, Jan 2026', 'DPIIT மாநில ஸ்டார்ட்அப் தரவரிசை, ஜனவரி 2026'),
  },
];

const PRINCIPLES = [
  {
    name: ['Grounded', 'மண் சார்ந்தது'],
    text: ['We go to districts and campuses, and we work in Tamil and English.', 'நாங்கள் மாவட்டங்களுக்கும் வளாகங்களுக்கும் செல்கிறோம்; தமிழிலும் ஆங்கிலத்திலும் செயல்படுகிறோம்.'],
  },
  {
    name: ['Generous', 'தாராளமானது'],
    text: ['Founders become mentors. Partners get the credit for what they helped build.', 'நிறுவனர்கள் வழிகாட்டிகளாகிறார்கள். கூட்டாளர்கள் உருவாக்க உதவியவற்றுக்கான பெருமை அவர்களுக்கே.'],
  },
  {
    name: ['Rigorous', 'கண்டிப்பானது'],
    text: [
      'Every figure carries a source or a confidence tag. Programmes have written stopping rules. Corrections are public.',
      'ஒவ்வொரு எண்ணுக்கும் ஒரு மூலம் அல்லது நம்பகத்தன்மைக் குறி உண்டு. திட்டங்களுக்கு எழுதப்பட்ட நிறுத்த விதிகள் உண்டு. திருத்தங்கள் பொதுவெளியில்.',
    ],
  },
  {
    name: ['Bold', 'துணிச்சலானது'],
    text: ['We set a public goal, Mission 1 Lakh, and report against it every quarter.', 'Mission 1 Lakh என்ற பொது இலக்கை வைத்து, ஒவ்வொரு காலாண்டும் அதற்கு எதிராக அறிக்கை தருகிறோம்.'],
  },
  {
    name: ['Tamil-proud, global', 'தமிழ்ப் பெருமை, உலகப் பார்வை'],
    text: ['Built for Tamil Nadu, connected to the Tamil diaspora and to world markets.', 'தமிழ்நாட்டுக்காக உருவானது; உலகத் தமிழர்களுடனும் உலகச் சந்தைகளுடனும் இணைந்தது.'],
  },
];

const milestones = (t) => [
  {
    id: 'first-events',
    // Launch post June 2023 (StartNet LinkedIn); incorporation 4 July 2023 (MCA, CIN U70200TZ2023PTC028823).
    // SEO-TA: pending native review
    date: '2023',
    title: t('StartNet starts, in Salem', 'StartNet சேலத்தில் தொடங்குகிறது'),
    body: t(
      'StartNet announced its launch in June 2023 and was incorporated as StartNet Ventures Private Limited on 4 July 2023.',
      'StartNet ஜூன் 2023-இல் தன் தொடக்கத்தை அறிவித்தது; 4 ஜூலை 2023 அன்று StartNet Ventures Private Limited ஆகப் பதிவுசெய்யப்பட்டது.'
    ),
    pending: t(
      '[placeholder — to be supplied by StartNet: first event and key milestones with dates]',
      '[placeholder — StartNet வழங்கும்: முதல் நிகழ்வு, தேதியுடன் முக்கிய மைல்கற்கள்]'
    ),
    art: { variant: 'grid', alt: '' },
  },
  {
    id: 'connect-series',
    // Edition dates and venues: server/data/events.json (sources cited there). SEO-TA: pending native review
    date: '2024–2025',
    title: 'GenAI Connect, D2C Connect, SaaS Connect',
    body: t(
      'Sector rooms for builders, operators and investors: GenAI Connect in Salem (April 2024), D2C Connect in Coimbatore (November 2024) and SaaS Connect in Coimbatore (February 2025).',
      'உருவாக்குபவர்கள், செயல்பாட்டாளர்கள், முதலீட்டாளர்களுக்கான துறைசார் அரங்குகள்: சேலத்தில் GenAI Connect (ஏப்ரல் 2024), கோயம்புத்தூரில் D2C Connect (நவம்பர் 2024), கோயம்புத்தூரில் SaaS Connect (பிப்ரவரி 2025).'
    ),
    art: { variant: 'network', brand: 'connect', alt: '' },
  },
  {
    id: 'investors-summit',
    date: null, // year to be supplied by StartNet (not in the public record yet); Timeline omits a missing date
    title: 'Investors Summit',
    art: { variant: 'dot', alt: '' },
  },
  {
    id: 'vibathon-2025',
    date: '2025',
    title: 'Vibathon 2025',
    // K.S.R. College of Engineering event notice (ksrce.ac.in). SEO-TA: pending native review
    body: t(
      'Held on 26 September 2025 at K.S.R. College of Engineering, Tiruchengode, with CubeAI Solutions.',
      '26 செப்டம்பர் 2025 அன்று திருச்செங்கோடு K.S.R. பொறியியல் கல்லூரியில், CubeAI Solutions உடன் இணைந்து நடைபெற்றது.'
    ),
    metric: {
      value: 80, unit: '%', tag: 'B', asAt: '2025',
      label: t('of colleges reached were Tier 3 or 4', 'சென்றடைந்த கல்லூரிகளில் Tier 3 அல்லது 4 கல்லூரிகள்'),
      source: t('Vibathon 2025 brochure', 'Vibathon 2025 கையேடு'),
    },
    art: { variant: 'kolam', brand: 'vibe', alt: '' },
  },
  {
    id: 'one-promise',
    date: t('Oct 2026', 'அக்டோபர் 2026'),
    now: true,
    title: t('One promise: every talent, a founder.', 'ஒரே வாக்குறுதி: ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.'),
    body: t(
      'In October 2026 we brought that work together under one promise: every talent, a founder.',
      'அக்டோபர் 2026-இல் அந்தப் பணிகள் அனைத்தையும் ஒரே வாக்குறுதியின் கீழ் கொண்டுவந்தோம்: ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.'
    ),
  },
  {
    id: 'checkpoint-2028',
    date: '2028',
    future: true,
    title: t('Mission 1 Lakh checkpoint', 'Mission 1 Lakh சரிபார்ப்புப் புள்ளி'),
    body: t(
      'We review the plan in public. If it is out of reach, we reset the goal rather than change what “nurtured” means.',
      'திட்டத்தைப் பொதுவெளியில் மறுஆய்வு செய்கிறோம். அது எட்ட முடியாததாக இருந்தால், “வளர்க்கப்பட்டவர்” என்பதன் பொருளை மாற்றாமல் இலக்கையே மாற்றியமைப்போம்.'
    ),
  },
  {
    id: 'mission-1-lakh',
    date: t('Mar 2031', 'மார்ச் 2031'),
    future: true,
    title: 'Mission 1 Lakh',
    metric: {
      value: 100000, tag: 'C', asAt: t('Oct 2026', 'அக்டோபர் 2026'), countUp: false,
      label: t('founders and aspiring founders nurtured in Tamil Nadu (target)', 'தமிழ்நாட்டில் வளர்க்கப்படும் நிறுவனர்களும் நிறுவனர் ஆக விரும்புபவர்களும் (இலக்கு)'),
      source: t('StartNet plan · planning assumption', 'StartNet திட்டம் · திட்டமிடல் அனுமானம்'),
    },
  },
  {
    id: 'mission-1-million',
    date: '2040',
    future: true,
    title: 'Mission 1 Million',
    metric: {
      value: 1000000, tag: 'C', asAt: t('Oct 2026', 'அக்டோபர் 2026'), countUp: false,
      label: t('founders and aspiring founders nurtured (target)', 'வளர்க்கப்படும் நிறுவனர்களும் நிறுவனர் ஆக விரும்புபவர்களும் (இலக்கு)'),
      source: t('StartNet plan · planning assumption', 'StartNet திட்டம் · திட்டமிடல் அனுமானம்'),
    },
  },
];

const SECTIONS = [
  { id: 'why', label: ['Why we exist', 'நாங்கள் ஏன் இருக்கிறோம்'] },
  { id: 'what', label: ['What we do', 'நாங்கள் என்ன செய்கிறோம்'] },
  { id: 'how', label: ['How we work', 'நாங்கள் எப்படிச் செயல்படுகிறோம்'] },
  { id: 'who', label: ['Who we work with', 'யாருடன் இணைந்து செயல்படுகிறோம்'] },
  { id: 'history', label: ['Our history', 'எங்கள் வரலாறு'] },
];

export default function About() {
  const { t, lang } = useLang();
  const seoLd = pageLd({ path: SEO.path, lang, type: 'AboutPage', name: t(...SEO.title), description: t(...SEO.description), about: ORG_REF });
  const { data: partners } = useApi('/api/partners');
  const signed = Array.isArray(partners) ? partners.filter((p) => p.agreementStatus === 'signed') : [];
  const sections = SECTIONS.map((s) => ({ id: s.id, label: t(...s.label) }));
  const L = (id) => t(...SECTIONS.find((s) => s.id === id).label);

  return (
    <>
      <Seo
        title={t(...SEO.title)}
        description={t(...SEO.description)}
        titleTa={SEO.title[1]}
        descriptionTa={SEO.description[1]}
        jsonLd={seoLd}
      />
      <PageHero
        className="rk-hero rk-page"
        breadcrumbs={aboutCrumbs(t)}
        eyebrow={t('Who we are', 'நாங்கள் யார்')}
        title={t('We turn talent into founders.', 'திறமைக்கு நிறுவனர் வடிவம் தருகிறோம்.')}
        accentWord="talent"
        lede={t(
          'StartNet is headquartered in Salem and works across Tamil Nadu. We help scholars, students, professionals and women start companies, and we publish what happens next.',
          'StartNet சேலத்தைத் தலைமையிடமாகக் கொண்டு தமிழ்நாடு முழுவதும் செயல்படும் நிறுவனம். ஆய்வாளர்கள், மாணவர்கள், தொழில்முறையாளர்கள், பெண்கள் நிறுவனங்களைத் தொடங்க உதவுகிறோம்; அடுத்து நடப்பதை வெளியிடுகிறோம்.' // SEO-TA: pending native review
        )}
        actions={
          <>
            <Button to="/about/mission-1-lakh" size="lg">{t('Read the mission', 'இலக்கைப் படியுங்கள்')}</Button>
            <Button to="/about/how-we-work" variant="tertiary" size="lg">{t('See our model', 'எங்கள் மாதிரியைப் பாருங்கள்')}</Button>
          </>
        }
        art={{ variant: 'network', ratio: '4/5', seed: 7, alt: '', animate: true }}
      />

      <InPageBar items={sections} label={t('Our story sections', 'எங்கள் கதை: பகுதிகள்')} />

      {/* Section 1 · Why we exist */}
      <Section id="why" labelledBy="about-why-h" className="about-story">
        <div className="about-story__grid">
          <Reveal className="about-story__text">
            <p className="eyebrow"><Num n={1} /> · {L('why')}</p>
            <h2 id="about-why-h" className="h2">
              {t("The talent is here. The bridge to capital isn't, yet", 'திறமை இங்கே இருக்கிறது. மூலதனத்துக்கான பாலம் இன்னும் இல்லை')}<Dot />
            </h2>
            <div className="prose about-story__prose">
              <p className="body-lg">
                {t(
                  "Tamil Nadu has more than 15,000 recognised startups, the highest higher-education enrolment rate in India and 250+ Global Capability Centres. Funding and the path from research to market lag behind. In the most recent DPIIT States' Startup Ranking, the state scored in the 100th percentile on infrastructure and the 50th on funding.",
                  'தமிழ்நாட்டில் 15,000-க்கும் மேற்பட்ட அங்கீகரிக்கப்பட்ட ஸ்டார்ட்அப்கள், இந்தியாவிலேயே அதிக உயர்கல்விச் சேர்க்கை விகிதம், 250+ உலகளாவிய திறன் மையங்கள் உள்ளன. ஆனால் நிதியுதவியும், ஆய்விலிருந்து சந்தைக்கான பாதையும் பின்தங்கியுள்ளன. சமீபத்திய DPIIT மாநில ஸ்டார்ட்அப் தரவரிசையில், மாநிலம் உள்கட்டமைப்பில் 100-ஆவது சதமானத்திலும் நிதியுதவியில் 50-ஆவது சதமானத்திலும் இருந்தது.'
                )}
              </p>
              <p className="about-note">
                <em>
                  {t(
                    "Sources: DPIIT via DT Next, July 2026 [A]; AISHE 2023-24 [A]; ANAROCK–FICCI, Dec 2025 [B]; DPIIT States' Startup Ranking, Jan 2026 [A].",
                    'மூலங்கள்: DPIIT, DT Next வழியாக, ஜூலை 2026 [A]; AISHE 2023-24 [A]; ANAROCK–FICCI, டிசம்பர் 2025 [B]; DPIIT மாநில ஸ்டார்ட்அப் தரவரிசை, ஜனவரி 2026 [A].'
                  )}
                </em>
              </p>
            </div>
          </Reveal>
          <Reveal className="about-story__art" delay={0.1}>
            <ArtImage
              variant="map" ratio="4/5" seed={38}
              alt={t("Abstract map of Tamil Nadu's 38 districts drawn as a dot grid", 'தமிழ்நாட்டின் 38 மாவட்டங்களைப் புள்ளிக் கட்டமாக வரைந்த கருத்தியல் வரைபடம்')}
            />
          </Reveal>
        </div>
        <div className="about-story__facts">
          <FactBand metrics={contextMetrics(t)} surface="paper" link={{ label: t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்'), to: '/insights/founder-ledger' }} />
        </div>
        <Reveal as="blockquote" className="about-story__pull">
          <p>
            {t(
              'The talent exists. What is thin is the layer between talent and capital: people who go to a campus in Tirunelveli or a lab in Coimbatore and help someone take the next step. That layer is our work.',
              'திறமை இருக்கிறது. மெலிதாக இருப்பது திறமைக்கும் மூலதனத்துக்கும் இடையிலான அடுக்குதான்: திருநெல்வேலியில் ஒரு வளாகத்துக்கோ கோயம்புத்தூரில் ஒரு ஆய்வகத்துக்கோ சென்று, ஒருவர் அடுத்த அடி எடுத்துவைக்க உதவும் மனிதர்கள். அந்த அடுக்கே எங்கள் பணி.'
            )}
          </p>
        </Reveal>
      </Section>

      {/* Section 2 · What we do */}
      <Section id="what" surface="white" labelledBy="about-what-h" className="about-story">
        <div className="about-story__grid about-story__grid--reverse">
          <Reveal className="about-story__text">
            <p className="eyebrow"><Num n={2} /> · {L('what')}</p>
            <h2 id="about-what-h" className="h2">
              {t('Four talent brands. Six shared engines. One platform', 'நான்கு திறமை பிராண்டுகள். ஆறு பகிரப்பட்ட இயந்திரங்கள். ஒரே தளம்')}<Dot />
            </h2>
            <div className="prose about-story__prose">
              <p className="body-lg">
                {t(
                  'We run four talent brands, each focused on one source of founders: StartNet Research (scholars and faculty), StartNet Vibe (students), StartNet Connect (professionals and existing startups) and StartNet Women. Behind them sit six shared engines (events, learning, insights, incubation, capital and market access) and one platform, StartNet X, which gives each person one profile across all of it.',
                  'நிறுவனர்கள் உருவாகும் ஒவ்வொரு மூலத்துக்கும் ஒன்றாக, நான்கு திறமை பிராண்டுகளை நடத்துகிறோம்: StartNet Research (ஆய்வாளர்களும் ஆசிரியர்களும்), StartNet Vibe (மாணவர்கள்), StartNet Connect (தொழில்முறையாளர்களும் ஏற்கெனவே உள்ள ஸ்டார்ட்அப்களும்), StartNet Women. அவற்றின் பின்னால் ஆறு பகிரப்பட்ட இயந்திரங்கள் (நிகழ்வுகள், கற்றல், நுண்ணறிவு, அடைகாப்பு, மூலதனம், சந்தை அணுகல்) மற்றும் ஒரே தளம் StartNet X உள்ளன; அது ஒவ்வொருவருக்கும் அனைத்திலும் ஒரே சுயவிவரத்தைத் தருகிறது.'
                )}
              </p>
            </div>
            <div className="about-story__actions">
              <Button to="/about/how-we-work" variant="tertiary">{t('See our model', 'எங்கள் மாதிரியைப் பாருங்கள்')}</Button>
            </div>
          </Reveal>
          <Reveal className="about-story__art" delay={0.1}>
            <ArtImage variant="grid" ratio="1/1" seed={4} alt="" />
          </Reveal>
        </div>
        <div className="about-story__model">
          <ModelDiagram />
        </div>
      </Section>

      {/* Section 3 · How we work */}
      <Section id="how">
        <SectionHeader
          eyebrow={`03 · ${L('how')}`}
          title={t('What each principle means in practice', 'ஒவ்வொரு கொள்கையும் நடைமுறையில் என்ன பொருள் தருகிறது')}
        />
        <RevealGroup as="ol" className="about-principles">
          {PRINCIPLES.map((p, i) => (
            <li key={p.name[0]} className="about-principles__item">
              <Num n={i + 1} />
              <h3 className="h4 about-principles__name">{t(...p.name)}</h3>
              <p className="about-principles__text">{t(...p.text)}</p>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Section 4 · Who we work with */}
      <Section id="who" surface="sunken" labelledBy="about-who-h" className="about-story">
        <div className="about-story__grid">
          <Reveal className="about-story__text">
            <p className="eyebrow"><Num n={4} /> · {L('who')}</p>
            <h2 id="about-who-h" className="h2">{t('A feeder and connector, not a rival', 'போட்டியாளர் அல்ல, ஊட்டுபவரும் இணைப்பவரும்')}<Dot /></h2>
            <div className="prose about-story__prose">
              <p className="body-lg">
                {t(
                  "We are a feeder and connector, not a rival to the institutions already doing this well. We send founders on to incubators, state programmes and investor networks, and we bring their programmes to campuses and districts they don't yet reach.",
                  'இந்தப் பணியை ஏற்கெனவே சிறப்பாகச் செய்யும் அமைப்புகளுக்கு நாங்கள் போட்டியாளர் அல்ல; ஊட்டுபவரும் இணைப்பவரும். நிறுவனர்களை அடைகாப்பகங்கள், மாநிலத் திட்டங்கள், முதலீட்டாளர் வலையமைப்புகளுக்கு அனுப்புகிறோம்; அவை இன்னும் சென்றடையாத வளாகங்களுக்கும் மாவட்டங்களுக்கும் அவற்றின் திட்டங்களைக் கொண்டுசெல்கிறோம்.'
                )}
              </p>
            </div>
            <div className="about-story__actions">
              <Button to="/partner" variant="tertiary">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</Button>
            </div>
          </Reveal>
          <Reveal className="about-story__art" delay={0.1}>
            <ArtImage variant="network" ratio="3/2" seed={21} alt="" />
          </Reveal>
        </div>
        {/* Signed and dated partners only; the row appears once the first agreement is recorded. */}
        {signed.length > 0 && (
          <div className="about-story__partners">
            <p className="about-story__partners-label">{t('Signed partners', 'கையெழுத்திட்ட கூட்டாளர்கள்')}</p>
            <LogoWall partners={signed} />
          </div>
        )}
      </Section>

      {/* Section 5 · Our history */}
      <Section id="history">
        <SectionHeader
          eyebrow={`05 · ${L('history')}`}
          // Public record starts in 2023 (launch post June 2023; incorporated July 2023). SEO-TA: pending native review
          title={t('Rooms since 2023.', '2023 முதல் அரங்குகள்.')}
          lede={t(
            'StartNet has run rooms in Tamil Nadu since 2023, including GenAI Connect, D2C Connect, SaaS Connect, an Investors Summit and Vibathon 2025. In October 2026 we brought that work together under one promise: every talent, a founder.',
            'GenAI Connect, D2C Connect, SaaS Connect, ஒரு Investors Summit, Vibathon 2025 உட்பட, StartNet 2023 முதல் தமிழ்நாட்டில் நிகழ்வுகளை நடத்தி வருகிறது. அக்டோபர் 2026-இல் அந்தப் பணிகள் அனைத்தையும் ஒரே வாக்குறுதியின் கீழ் கொண்டுவந்தோம்: ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.'
          )}
        />
        <Timeline
          items={milestones(t)}
          label={t('StartNet milestones, from the first events to Mission 1 Million', 'StartNet மைல்கற்கள், முதல் நிகழ்வுகளிலிருந்து Mission 1 Million வரை')}
        />
        <p className="about-note about-story__tl-note">
          {t(
            'Mission targets are a plan, not a forecast [C]. We review it in public; the Mission 1 Lakh checkpoint is in 2028.',
            'இலக்குகள் ஒரு திட்டம், முன்கணிப்பு அல்ல [C]. அதைப் பொதுவெளியில் மறுஆய்வு செய்கிறோம்; Mission 1 Lakh சரிபார்ப்புப் புள்ளி 2028-இல்.'
          )}
        </p>
        {/* The launch event film and an early ChatGPT-for-business session, July 2023
            (data/videos.js 'about-history' + 'about-early-events', docs/VIDEO-PLACEMENTS.md option A) */}
        <EventVideos
          videos={[...videosForPlace('about-history'), ...videosForPlace('about-early-events')]}
          max={2}
          layout="playlist"
          headingLevel={3}
          eyebrow={t('Where it started', 'தொடங்கிய இடம்')}
          title={t('The first rooms, July 2023', 'முதல் அரங்குகள், ஜூலை 2023')}
          className="about-history__film"
        />
        {/* StartNet monthly network meeting, 30 Sep 2023: testimonials (data/videos.js 'about-network', docs/VIDEOS.md) */}
        <EventVideos
          videos={videosForPlace('about-network')}
          max={3}
          layout="playlist"
          headingLevel={3}
          eyebrow={t('From the network meetings', 'நெட்வொர்க் சந்திப்புகளிலிருந்து')}
          title={t('September 2023, Hotel Windsor Castle', 'செப்டம்பர் 2023, Hotel Windsor Castle')}
          playlistLabel={t('Testimonials from the September 2023 network meeting', 'செப்டம்பர் 2023 நெட்வொர்க் சந்திப்பின் அனுபவப் பகிர்வுகள்')}
          className="about-history__film about-history__network"
        />
      </Section>

      {/* AEO FAQ: drafted from Book 2 §2.1 and §2.4 — StartNet review */}
      <Section id="questions" surface="white" labelledBy="about-faq-h" className="rk-faq">
        <div className="rk-faq__grid">
          <SectionHeader
            eyebrow={t('Common questions', 'பொதுவான கேள்விகள்')}
            title={<span id="about-faq-h">{t('About StartNet, briefly', 'StartNet பற்றிச் சுருக்கமாக')}</span>}
          />
          <Accordion faq items={ABOUT_FAQ.map((f) => ({ id: `about-faq-${f.id}`, question: t(...f.q), answer: t(...f.a) }))} />
        </div>
      </Section>

      <CTABand
        surface="night"
        accentWord="where"
        title={t('Start where you are.', 'நீங்கள் இருக்கும் இடத்திலிருந்தே தொடங்குங்கள்.')}
        actions={
          <>
            <Button to="/programmes" size="lg">{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>
            <Button to="/partner" variant="secondary" size="lg">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}
