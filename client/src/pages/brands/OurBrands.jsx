import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Button, BrandLockup, ArtImage, Reveal, RevealGroup, Accordion,
} from '../../components';
import { itemListLd } from '../../lib/seo.js';
import { pageLd } from './seoBits.js';
import { useLang } from '../../lib/i18n.jsx';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BRANDS, TALENT_BRANDS } from '../../data/brands';
import './brandPage.css';
import './OurBrands.css';

// Book 2 §3.0 (page copy) + §1.3 (card copy); Book 1 Part B §3.2 (sub-brands, platform strip), §4.3 (messaging hierarchy).
const DOORS = {
  research: {
    who: 'PhD scholars, post-docs and faculty',
    whoTa: 'முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்கள்',
    body: 'Turn your research into a product and the product into a company you co-own, with your institution and an industry partner beside you.',
    bodyTa: 'உங்கள் ஆய்வைத் தயாரிப்பாகவும், அந்தத் தயாரிப்பை நீங்களும் உரிமையாளராக இருக்கும் நிறுவனமாகவும் மாற்றுங்கள்; உங்கள் கல்வி நிறுவனமும் ஒரு தொழில்துறைக் கூட்டாளரும் உங்களுடன் இருப்பார்கள்.',
    subs: [
      { label: 'StartNet Labs', to: '/research/labs' },
      { label: 'Scholar Founders Fellowship', to: '/research/fellowship' },
      { label: 'Lab-to-Market Summit', to: '/research/lab-to-market-summit' },
      { label: 'Institution Partner Programme', to: '/research/institution-partner-programme' },
    ],
    art: { variant: 'network', seed: 3 },
  },
  vibe: {
    who: 'Students',
    whoTa: 'மாணவர்கள்',
    body: 'Hackathons, an AI-era building academy, campus build nights and a 12-week pre-incubation programme. Start with Vibathon.',
    bodyTa: 'ஹேக்கத்தான்கள், AI காலத்தில் உருவாக்கக் கற்றுத்தரும் அகாடமி, கல்லூரி உருவாக்க இரவுகள், 12 வார முன்-இன்குபேஷன் திட்டம். Vibathon-உடன் தொடங்குங்கள்.',
    subs: [
      { label: 'Vibathon', to: '/vibe/vibathon' },
      { label: 'Vibe Academy', to: '/vibe/academy' },
      { label: 'Vibe Campus', to: '/vibe/campus' },
      { label: 'Vibe Launchpad', to: '/vibe/launchpad' },
      { label: 'Vibe Clubs', to: '/vibe/clubs' },
    ],
    art: { variant: 'dot', seed: 8 },
  },
  connect: {
    who: 'Professionals and existing startups',
    whoTa: 'பணியில் உள்ளவர்களும் ஏற்கனவே இயங்கும் ஸ்டார்ட்அப்களும்',
    body: 'Sector communities, founder circles and a 12-week evening programme that ends with a clear go/no-go on your idea.',
    bodyTa: 'துறைசார் சமூகங்கள், நிறுவனர் வட்டங்கள், உங்கள் யோசனையைத் தொடரலாமா வேண்டாமா என்ற தெளிவான முடிவுடன் நிறைவடையும் 12 வார மாலை நேரத் திட்டம்.',
    subs: [
      { label: 'Connect Series', to: '/connect/series' },
      { label: 'Connect Circles', to: '/connect/circles' },
      { label: 'Founder Switch', to: '/connect/founder-switch' },
      { label: 'Scale Connect', to: '/connect/scale' },
    ],
    art: { variant: 'grid', seed: 13 },
  },
  women: {
    who: 'Women founders and business owners',
    whoTa: 'பெண் நிறுவனர்களும் தொழில் உரிமையாளர்களும்',
    body: 'District circles, an app-led academy with 1:1 mentors, and help getting investment-ready.',
    bodyTa: 'மாவட்ட வட்டங்கள், 1:1 வழிகாட்டிகளுடன் செயலி வழி அகாடமி, முதலீட்டுக்குத் தயாராக உதவி.',
    subs: [
      { label: 'Women Circles', to: '/women/circles' },
      { label: 'Rise Academy', to: '/women/rise-academy' },
      { label: 'HerCapital', to: '/women/hercapital' },
      { label: 'Women Founders Summit & Awards', to: '/women/summit' },
    ],
    art: { variant: 'kolam', seed: 21 },
  },
};

const PERSONAS = [
  { label: 'Student', labelTa: 'மாணவர்', pool: 'student', brand: 'vibe' },
  { label: 'PhD scholar or faculty', labelTa: 'முனைவர் பட்ட ஆய்வாளர் அல்லது பேராசிரியர்', pool: 'scholar', brand: 'research' },
  { label: 'Working professional', labelTa: 'பணியில் உள்ளவர்', pool: 'professional', brand: 'connect' },
  { label: 'Woman building a business', labelTa: 'தொழில் தொடங்கும் பெண்', pool: 'woman', brand: 'women' },
];

const ENGINES = [
  ['Events', 'நிகழ்வுகள்'],
  ['Learning', 'கற்றல்'],
  ['Insights', 'நுண்ணறிவுகள்'],
  ['Incubation', 'இன்குபேஷன்'],
  ['Capital', 'முதலீடு'],
  ['Market access', 'சந்தை அணுகல்'],
];

// Examples are brand names and stay in Latin script on the Tamil page (Book 2 §14).
const HIERARCHY = [
  { level: 'Masterbrand', levelTa: 'முதன்மை பிராண்ட்', role: 'Promise and proof', roleTa: 'வாக்குறுதியும் சான்றும்', example: 'StartNet. Every talent, a founder.', rule: 'StartNet is one word. The red full stop is the logo device, not punctuation in running text.', ruleTa: 'StartNet ஒரே சொல். சிவப்பு முற்றுப்புள்ளி லோகோ அடையாளம்; உரைநடையில் வரும் நிறுத்தக்குறி அல்ல.' },
  { level: 'Talent brand', levelTa: 'திறமை பிராண்ட்', role: 'Audience and path', roleTa: 'பார்வையாளர்களும் பாதையும்', example: 'StartNet Vibe: Student → Founder', rule: 'Always StartNet + audience. One accent colour each.', ruleTa: 'எப்போதும் StartNet + பார்வையாளர். ஒவ்வொன்றுக்கும் ஒரு தனி வண்ணம்.' },
  { level: 'Programme', levelTa: 'திட்டம்', role: 'Offer and next step', roleTa: 'சலுகையும் அடுத்த படியும்', example: 'Vibathon, a StartNet Vibe programme', rule: 'Short brand + plain format.', ruleTa: 'சுருக்கமான பிராண்ட் + எளிய வடிவம்.' },
  { level: 'Platform', levelTa: 'தளம்', role: 'Where you act', roleTa: 'நீங்கள் செயல்படும் இடம்', example: 'Continue on StartNet X', rule: 'StartNet X in prose, SNX as the app mark. Engines are not navigation labels.', ruleTa: 'உரைநடையில் StartNet X, செயலிக் குறியாக SNX. இயந்திரங்கள் (engines) வழிசெலுத்தல் பெயர்கள் அல்ல.' },
];

const RULES_DO = [
  ['StartNet: one word, capital S and N', 'StartNet: ஒரே சொல், S, N பெரிய எழுத்துகள்'],
  ['StartNet Research, StartNet Vibe, StartNet Connect and StartNet Women in full on first use', 'முதல் பயன்பாட்டில் StartNet Research, StartNet Vibe, StartNet Connect, StartNet Women என முழுமையாக'],
  ['StartNet X in prose; SNX as the app mark', 'உரைநடையில் StartNet X; செயலிக் குறியாக SNX'],
  ['Vibathon'],
  ['Tamil Nadu, as two words', 'Tamil Nadu, இரண்டு சொற்களாக'],
  ['Global Capability Centre written out on first use per page, then GCC', 'ஒவ்வொரு பக்கத்திலும் முதல் முறை Global Capability Centre என முழுமையாக, பிறகு GCC'],
];
const RULES_DONT = ['SN Vibe', 'StartNetVibe', 'StartNet-Vibe', 'Startnet', 'Vibethon', 'StartNet. Vibe Academy'];

function BrandDoor({ brand, index }) {
  const { t, localePath } = useLang();
  const d = DOORS[brand.key];
  return (
    <article className="ourbrands-door" data-brand={brand.key} aria-labelledby={`door-${brand.key}`}>
      <Link to={localePath(brand.base)} className="ourbrands-door__art" tabIndex={-1} aria-hidden="true" draggable="false">
        <ArtImage {...d.art} brand={brand.key} ratio="16/10" alt="" />
        <span className="ourbrands-door__index tnum">{String(index + 1).padStart(2, '0')}</span>
      </Link>
      <div className="ourbrands-door__body">
        <h3 id={`door-${brand.key}`} className="ourbrands-door__name">
          <BrandLockup brand={brand.key} size="md" />
        </h3>
        <p className="ourbrands-door__journey">{t(brand.journey, brand.journeyTa)}</p>
        <p className="ourbrands-door__who"><span className="ourbrands-door__who-label">{t('Who it’s for', 'யாருக்கானது')}</span> {t(d.who, d.whoTa)}</p>
        <p className="ourbrands-door__text">{t(d.body, d.bodyTa)}</p>
        <ul className="ourbrands-door__subs bp-linkrows" aria-label={t(`${brand.name} programmes`, `${brand.name} திட்டங்கள்`)}>
          {d.subs.map((s) => (
            <li key={s.to}>
              <Link to={localePath(s.to)} className="ourbrands-door__chip bp-linkrows__link">
                <span>{s.label}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to={localePath(brand.base)} className="ourbrands-door__cta arrow-link">
          <span className="arrow-link__label">{t(`Explore ${brand.name}`, `${brand.name}-ஐப் பாருங்கள்`)}</span>
          <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function PlatformVisual() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const ys = [30, 70, 110, 150];
  const keys = ['research', 'vibe', 'connect', 'women'];
  return (
    <motion.div
      className="ourbrands-platform__visual"
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.div
        className="ourbrands-platform__reveal"
        variants={{ hidden: { clipPath: 'inset(0% 100% 0% 0%)' }, show: { clipPath: 'inset(0% 0% 0% 0%)' } }}
        transition={{ duration: 0.8, ease: [0.4, 0.14, 0.3, 1] }}
      >
      <svg viewBox="0 0 400 180" role="img" aria-label={t('Four brand paths, Research, Vibe, Connect and Women, joining into one StartNet X profile.', 'Research, Vibe, Connect, Women ஆகிய நான்கு பிராண்ட் பாதைகள் ஒரே StartNet X சுயவிவரத்தில் இணைகின்றன.')}>
        {keys.map((k, i) => (
          <g key={k} className={`ourbrands-platform__path ourbrands-platform__path--${k}`}>
            <path d={`M 12 ${ys[i]} C 170 ${ys[i]}, 220 90, 330 90`} fill="none" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy={ys[i]} r="6" />
          </g>
        ))}
        <circle cx="352" cy="90" r="22" className="ourbrands-platform__profile" />
        <circle cx="352" cy="90" r="7" className="ourbrands-platform__point" />
        <text x="352" y="136" textAnchor="middle" className="ourbrands-platform__profile-label">{t('One profile', 'ஒரே சுயவிவரம்')}</text>
      </svg>
      </motion.div>
      <ul className="ourbrands-platform__labels" aria-hidden="true">
        {keys.map((k) => <li key={k} data-brand={k}>{BRANDS[k].descriptor}</li>)}
      </ul>
    </motion.div>
  );
}

// SEO: primary "StartNet brands", secondary "founder programmes Tamil Nadu" (Book 2 §3.0, Tamil Nadu added).
// SEO-TA: pending native review
const SEO_TITLE = 'StartNet brands: Research, Vibe, Connect and Women';
const SEO_TITLE_TA = 'StartNet பிராண்டுகள்: Research, Vibe, Connect, Women';
const SEO_DESC = 'Four StartNet brands, four doors into founding in Tamil Nadu: Research for scholars, Vibe for students, Connect for professionals, Women for women founders.';
const SEO_DESC_TA = 'தமிழ்நாட்டில் நிறுவனராவதற்கு நான்கு StartNet வாசல்கள்: ஆய்வாளர்களுக்கு Research, மாணவர்களுக்கு Vibe, பணியில் உள்ளவர்களுக்கு Connect, பெண்களுக்கு Women.';

// AEO FAQ: drafted from Book 2 §3.0 (sub-head, "Not sure which door?", StartNet X strip) and the §1.3 card copy on
// this page — StartNet review. No new facts.
// SEO-TA: pending native review
const BRANDS_FAQ = [
  {
    id: 'which-brands',
    q: ['What are the four StartNet brands?', 'நான்கு StartNet பிராண்டுகள் எவை?'],
    a: [
      'StartNet Research for PhD scholars, post-docs and faculty; StartNet Vibe for students; StartNet Connect for professionals and existing startups; and StartNet Women for women founders and business owners.',
      'முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்களுக்கு StartNet Research; மாணவர்களுக்கு StartNet Vibe; பணியில் உள்ளவர்களுக்கும் ஏற்கனவே இயங்கும் ஸ்டார்ட்அப்களுக்கும் StartNet Connect; பெண் நிறுவனர்களுக்கும் தொழில் உரிமையாளர்களுக்கும் StartNet Women.',
    ],
  },
  {
    id: 'which-door',
    q: ['Which StartNet brand is right for me?', 'எனக்கு எந்த StartNet பிராண்ட் பொருந்தும்?'],
    a: [
      'Students start with StartNet Vibe, PhD scholars and faculty with StartNet Research, working professionals with StartNet Connect, and women building a business with StartNet Women. Not sure? Answer two questions in the programme finder and we’ll point you to the right programme.',
      'மாணவர்கள் StartNet Vibe-இலும், முனைவர் பட்ட ஆய்வாளர்கள், பேராசிரியர்கள் StartNet Research-இலும், பணியில் உள்ளவர்கள் StartNet Connect-இலும், தொழில் தொடங்கும் பெண்கள் StartNet Women-இலும் தொடங்கலாம். தெரியவில்லையா? திட்டத் தேடலில் இரண்டு கேள்விகளுக்குப் பதில் சொல்லுங்கள்; சரியான திட்டத்தைக் காட்டுவோம்.',
    ],
  },
  {
    id: 'shared',
    q: ['What do the four brands share?', 'நான்கு பிராண்டுகளும் எதைப் பகிர்ந்துகொள்கின்றன?'],
    a: [
      'All four share the same events, learning, incubation, capital and market access, and the same founder profile on StartNet X.',
      'நான்கும் ஒரே நிகழ்வுகள், கற்றல், இன்குபேஷன், முதலீடு, சந்தை அணுகல், StartNet X-இல் ஒரே நிறுவனர் சுயவிவரம் ஆகியவற்றைப் பகிர்ந்துகொள்கின்றன.',
    ],
  },
  {
    id: 'profile',
    q: ['Do I need a separate profile for each brand?', 'ஒவ்வொரு பிராண்டுக்கும் தனிச் சுயவிவரம் தேவையா?'],
    a: [
      'No. One free SNX profile follows you from your first event to your first funding. Start in Vibe, grow in Connect, mentor in Women. You never start again.',
      'இல்லை. ஒரே இலவச SNX சுயவிவரம் உங்கள் முதல் நிகழ்விலிருந்து முதல் முதலீடு வரை உங்களுடன் வருகிறது. Vibe-இல் தொடங்குங்கள், Connect-இல் வளருங்கள், Women-இல் வழிகாட்டுங்கள். மீண்டும் புதிதாகத் தொடங்க வேண்டியதில்லை.',
    ],
  },
];

export default function OurBrands() {
  const { t, lang, localePath } = useLang();
  const exploreX = t('Explore StartNet X', 'StartNet X-ஐப் பாருங்கள்');
  return (
    <div className="ourbrands">
      <Seo
        title={t(SEO_TITLE, SEO_TITLE_TA)}
        titleTa={SEO_TITLE_TA}
        description={t(SEO_DESC, SEO_DESC_TA)}
        descriptionTa={SEO_DESC_TA}
        jsonLd={[
          pageLd({ path: '/brands', lang, type: 'CollectionPage', name: t(SEO_TITLE, SEO_TITLE_TA), description: t(SEO_DESC, SEO_DESC_TA) }),
          itemListLd({ name: t('The four StartNet brands', 'நான்கு StartNet பிராண்டுகள்'), items: TALENT_BRANDS.map((b) => ({ name: b.name, path: b.base })), lang }),
        ]}
      />

      <PageHero
        eyebrow={t('Our brands', 'எங்கள் பிராண்டுகள்')}
        title={t('Four doors. One network.', 'நான்கு கதவுகள். ஒரே வலையமைப்பு.')}
        lede={t(
          'Each StartNet brand serves one kind of talent. All four share the same events, learning, incubation, capital and market access, and the same founder profile.',
          'ஒவ்வொரு StartNet பிராண்டும் ஒரு வகைத் திறமையாளர்களுக்குச் சேவை செய்கிறது. நான்கும் ஒரே நிகழ்வுகள், கற்றல், இன்குபேஷன், முதலீடு, சந்தை அணுகல், ஒரே நிறுவனர் சுயவிவரம் ஆகியவற்றைப் பகிர்ந்துகொள்கின்றன.'
        )}
        breadcrumbs={[{ label: t('Our brands', 'எங்கள் பிராண்டுகள்') }]}
        actions={
          <>
            <Button variant="primary" to="/programmes">{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>
            <Button variant="secondary" to="/startnet-x">{exploreX}</Button>
          </>
        }
      />

      {/* Section 1 · Brand doors */}
      <Section pad="sm" labelledBy="ourbrands-doors-title">
        <h2 id="ourbrands-doors-title" className="visually-hidden">{t('The four StartNet brands', 'நான்கு StartNet பிராண்டுகள்')}</h2>
        <RevealGroup className="ourbrands-doors" stagger={0.08}>
          {TALENT_BRANDS.map((b, i) => <BrandDoor key={b.key} brand={b} index={i} />)}
        </RevealGroup>
      </Section>

      {/* Section 2 · Not sure which door? */}
      <Section surface="white" labelledBy="ourbrands-unsure">
        <div className="split ourbrands-unsure">
          <Reveal>
            <p className="eyebrow">{t('Programme finder', 'திட்டத் தேடல்')}</p>
            <h2 id="ourbrands-unsure" className="h1 ourbrands-unsure__title">{t('Not sure which door?', 'எந்தக் கதவு என்று தெரியவில்லையா?')}</h2>
            <p className="body-lg text-2">{t('Answer two questions and we’ll point you to the right programme.', 'இரண்டு கேள்விகளுக்குப் பதில் சொல்லுங்கள்; சரியான திட்டத்தைக் காட்டுவோம்.')}</p>
            <div className="ourbrands-unsure__cta">
              <Button variant="primary" size="lg" to="/programmes">{t('Use the programme finder', 'திட்டத் தேடலைப் பயன்படுத்துங்கள்')}</Button>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="ourbrands-unsure__personas">
            <p className="ourbrands-unsure__lead h5">{t('I’m a…', 'நான் ஒரு…')}</p>
            <ul className="ourbrands-unsure__list">
              {PERSONAS.map((p) => (
                <li key={p.pool} data-brand={p.brand}>
                  <Link to={localePath(`/programmes?pool=${p.pool}`)} className="ourbrands-unsure__persona">
                    <span className="ourbrands-unsure__swatch" aria-hidden="true" />
                    <span className="ourbrands-unsure__persona-label">{t(p.label, p.labelTa)}</span>
                    <span className="ourbrands-unsure__persona-brand">{BRANDS[p.brand].name}</span>
                    <ArrowRight size={18} aria-hidden="true" className="ourbrands-unsure__arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Section 3 · One platform (the page's one Night band) */}
      <Section surface="night" labelledBy="ourbrands-platform">
        <div className="split ourbrands-platform">
          <Reveal>
            <p className="eyebrow">StartNet X</p>
            <h2 id="ourbrands-platform" className="h1 ourbrands-platform__title">{t('All four brands run on one platform.', 'நான்கு பிராண்டுகளும் ஒரே தளத்தில் இயங்குகின்றன.')}</h2>
            <p className="body-lg ourbrands-platform__body">
              {t(
                'One free SNX profile follows you from your first event to your first funding. Start in Vibe, grow in Connect, mentor in Women. You never start again.',
                'ஒரே இலவச SNX சுயவிவரம் உங்கள் முதல் நிகழ்விலிருந்து முதல் முதலீடு வரை உங்களுடன் வருகிறது. Vibe-இல் தொடங்குங்கள், Connect-இல் வளருங்கள், Women-இல் வழிகாட்டுங்கள். மீண்டும் புதிதாகத் தொடங்க வேண்டியதில்லை.'
              )}
            </p>
            <div className="ourbrands-platform__engines">
              <p className="small ourbrands-platform__engines-label">{t('Six shared engines behind every brand', 'ஒவ்வொரு பிராண்டுக்கும் பின்னால் பகிரப்படும் ஆறு இயந்திரங்கள்')}</p>
              <ul className="ourbrands-platform__engine-list">
                {ENGINES.map(([en, ta]) => <li key={en}>{t(en, ta)}</li>)}
              </ul>
            </div>
            <div className="cluster ourbrands-platform__actions">
              <Button variant="inverse" to="/startnet-x">{exploreX}</Button>
            </div>
          </Reveal>
          <PlatformVisual />
        </div>
      </Section>

      {/* Section 4 · Naming rules */}
      <Section labelledBy="ourbrands-naming">
        <SectionHeader
          eyebrow={t('Brand architecture', 'பிராண்ட் கட்டமைப்பு')}
          title={<span id="ourbrands-naming">{t('How we name things', 'நாங்கள் பெயரிடும் முறை')}</span>}
          lede={t(
            'One masterbrand, four talent brands, the programmes inside them and one platform. Each level does one job.',
            'ஒரு முதன்மை பிராண்ட், நான்கு திறமை பிராண்டுகள், அவற்றுக்குள் உள்ள திட்டங்கள், ஒரே தளம். ஒவ்வொரு நிலையும் ஒரு வேலையைச் செய்கிறது.'
          )}
        />
        <RevealGroup as="ol" className="ourbrands-levels">
          {HIERARCHY.map((h, i) => (
            <li key={h.level} className="ourbrands-level">
              <span className="ourbrands-level__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="ourbrands-level__head">
                <h3 className="h5">{t(h.level, h.levelTa)}</h3>
                <p className="caption">{t(h.role, h.roleTa)}</p>
              </div>
              <p className="ourbrands-level__example" lang={lang === 'ta' ? 'en' : undefined}>&ldquo;{h.example}&rdquo;</p>
              <p className="ourbrands-level__rule small text-2">{t(h.rule, h.ruleTa)}</p>
            </li>
          ))}
        </RevealGroup>

        <div className="ourbrands-rules">
          <Reveal className="ourbrands-rules__col ourbrands-rules__col--do bp-rule">
            <h3 className="h5 ourbrands-rules__title"><Check size={20} aria-hidden="true" /> {t('We write', 'நாங்கள் எழுதுவது')}</h3>
            <ul>{RULES_DO.map(([en, ta]) => <li key={en}>{t(en, ta)}</li>)}</ul>
          </Reveal>
          <Reveal delay={0.06} className="ourbrands-rules__col ourbrands-rules__col--dont bp-rule">
            <h3 className="h5 ourbrands-rules__title"><X size={20} aria-hidden="true" /> {t('We never write', 'நாங்கள் ஒருபோதும் எழுதாதவை')}</h3>
            <ul>{RULES_DONT.map((r) => <li key={r} lang={lang === 'ta' ? 'en' : undefined}><s>{r}</s></li>)}</ul>
            <p className="caption ourbrands-rules__note">
              {t(
                'A programme sits under its brand as a label: “Vibe Academy” under StartNet Vibe, never a second descriptor in the lock-up.',
                'ஒரு திட்டம் அதன் பிராண்டின் கீழ் ஒரு பெயராக அமையும்: StartNet Vibe-இன் கீழ் “Vibe Academy”; லோகோ இணைப்பில் இரண்டாவது விளக்கச் சொல்லாக ஒருபோதும் அல்ல.'
              )}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* AEO FAQ: drafted from Book 2 §3.0 — StartNet review */}
      <Section surface="white" className="bp-faq" labelledBy="ourbrands-faq">
        <SectionHeader
          eyebrow={t('Common questions', 'பொதுவான கேள்விகள்')}
          title={<span id="ourbrands-faq">{t('Choosing a door', 'வாசலைத் தேர்ந்தெடுப்பது')}</span>}
        />
        <Accordion faq items={BRANDS_FAQ.map((f) => ({ id: `brands-faq-${f.id}`, question: t(...f.q), answer: t(...f.a) }))} />
      </Section>
    </div>
  );
}
