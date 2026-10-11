// /about/how-we-work · Our model (T19, diagram-led). Copy: Book 2 §2.2 verbatim; brand cards as Home §1.3.
// Tamil copy: draft pending native review (Book 2 §14).
import { Link } from 'react-router-dom';
import {
  Seo, PageHero, Section, SectionHeader, Reveal, RevealGroup, Steps, Ladder, Button, CTABand, ArtImage, TagChip, Dot,
} from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { BRANDS } from '../../data/brands.js';
import { aboutCrumbs, InPageBar, Num } from './shared.jsx';
import EngineMatrix, { useEngines } from './EngineMatrix.jsx';
import { useLevels } from './LadderScroll.jsx';
import { subLabel } from './brandCopy.js';
import './HowWeWork.css';
import { ORG_REF } from '../../lib/seo.js';
import { pageLd } from '../brands/seoBits.js';

// SEO: primary "how StartNet works" (Book 2 §2.2).
// SEO-TA: pending native review
const SEO = {
  title: ['How StartNet works: four brands, six engines, one platform', 'StartNet எப்படி இயங்குகிறது: நான்கு பிராண்டுகள், ஒரே தளம்'],
  description: [
    'How StartNet turns talent into founders in Tamil Nadu: four brands, six shared engines, StartNet X and a seven-level founder ladder, counted in public.',
    'தமிழ்நாட்டில் திறமையை நிறுவனர்களாக StartNet மாற்றும் முறை: நான்கு பிராண்டுகள், ஆறு இயந்திரங்கள், StartNet X, ஏழு நிலை நிறுவனர் ஏணி.',
  ],
  path: '/about/how-we-work',
};

const DOORS = [
  {
    key: 'research',
    text: 'Turn your research into a product and the product into a company you co-own, with your institution and an industry partner beside you.',
    ta: 'உங்கள் கல்வி நிறுவனமும் ஒரு தொழில் கூட்டாளரும் துணை நிற்க, உங்கள் ஆய்வை ஒரு தயாரிப்பாகவும், அந்தத் தயாரிப்பை நீங்கள் இணை உரிமையாளராக இருக்கும் நிறுவனமாகவும் மாற்றுங்கள்.',
  },
  {
    key: 'vibe',
    text: 'Hackathons, an AI-era building academy, campus build nights and a 12-week pre-incubation programme. Start with Vibathon.',
    ta: 'ஹேக்கத்தான்கள், AI காலத்துக்கான உருவாக்கப் பயிற்சியகம், வளாக உருவாக்க இரவுகள், 12 வார முன் அடைகாப்புத் திட்டம். Vibathon-இலிருந்து தொடங்குங்கள்.',
  },
  {
    key: 'connect',
    text: 'Sector communities, founder circles and a 12-week evening programme that ends with a clear go/no-go on your idea.',
    ta: 'துறைசார் சமூகங்கள், நிறுவனர் வட்டங்கள், உங்கள் யோசனைக்குத் தெளிவான “தொடரலாம் / வேண்டாம்” முடிவுடன் நிறைவடையும் 12 வார மாலைத் திட்டம்.',
  },
  {
    key: 'women',
    text: 'District circles, an app-led academy with 1:1 mentors, and help getting investment-ready.',
    ta: 'மாவட்ட வட்டங்கள், 1:1 வழிகாட்டிகளுடன் செயலி வழிப் பயிற்சியகம், முதலீட்டுக்குத் தயாராவதற்கான உதவி.',
  },
];

const PAYERS = [
  { who: ['Institutions', 'கல்வி நிறுவனங்கள்'], what: ['pay for founder outcomes and innovation metrics.', 'நிறுவனர் விளைவுகளுக்கும் புத்தாக்க அளவீடுகளுக்கும் செலுத்துகின்றன.'] },
  { who: ['GCCs and corporates', 'GCC-களும் பெருநிறுவனங்களும்'], what: ['pay for pilots, problem-solving and talent.', 'முன்னோட்டங்கள், சிக்கல் தீர்வு, திறமையாளர்களுக்குச் செலுத்துகின்றன.'] },
  { who: ['Government', 'அரசு'], what: ['pays for reach and measured delivery.', 'சென்றடைதலுக்கும் அளவிடப்பட்ட செயல்பாட்டுக்கும் செலுத்துகிறது.'] },
  { who: ['Sponsors', 'நிதியளிப்பவர்கள்'], what: ['pay to meet the right audiences.', 'சரியான பார்வையாளர்களைச் சந்திக்கச் செலுத்துகின்றனர்.'] },
  { who: ['Founders', 'நிறுவனர்கள்'], what: ['pay for progress, never for entry.', 'முன்னேற்றத்துக்குச் செலுத்துகின்றனர்; நுழைவுக்கு ஒருபோதும் இல்லை.'] },
];

const HORIZONS = [
  { name: 'Milk', years: '2026–27', focus: ['Prove one flagship and one recurring product per brand', 'ஒவ்வொரு பிராண்டுக்கும் ஒரு முதன்மைத் தயாரிப்பையும் ஒரு தொடர் தயாரிப்பையும் நிரூபித்தல்'] },
  { name: 'Mountain', years: '2028–30', focus: ['All 38 districts, government co-hosts, Mission 1 Lakh', '38 மாவட்டங்களும், அரசு இணை ஏற்பாட்டாளர்கள், Mission 1 Lakh'] },
  { name: 'Moonshot', years: '2031–40', focus: ['Diaspora chapters and Mission 1 Million', 'புலம்பெயர் தமிழர் கிளைகளும் Mission 1 Million-உம்'] },
];

const SECTIONS = [
  { id: 'architecture', label: ['The model', 'மாதிரி'] },
  { id: 'doors', label: ['Four doors', 'நான்கு வாசல்கள்'] },
  { id: 'engines', label: ['Six engines', 'ஆறு இயந்திரங்கள்'] },
  { id: 'platform', label: ['One platform', 'ஒரே தளம்'] },
  { id: 'ladder', label: ['The founder ladder', 'நிறுவனர் ஏணி'] },
  { id: 'money', label: ['How the money works', 'பணம் எப்படி இயங்குகிறது'] },
  { id: 'horizons', label: ['Three horizons', 'மூன்று கட்டங்கள்'] },
];

const ATTRIBUTION = [
  'A startup counts on our Ledger only if a founder reached L3 in a StartNet programme before the company was registered. We count what we helped create, not every company we met.',
  'நிறுவனம் பதிவு செய்யப்படுவதற்கு முன்பே அதன் நிறுவனர் ஒருவர் StartNet திட்டத்தில் L3-ஐ எட்டியிருந்தால் மட்டுமே அந்த ஸ்டார்ட்அப் எங்கள் Ledger-இல் கணக்கிடப்படும். நாங்கள் சந்தித்த ஒவ்வொரு நிறுவனத்தையும் அல்ல, உருவாக்க உதவியவற்றை மட்டுமே கணக்கிடுகிறோம்.',
];

export default function HowWeWork() {
  const { t, lang, localePath } = useLang();
  const seoLd = pageLd({ path: SEO.path, lang, type: 'AboutPage', name: t(...SEO.title), description: t(...SEO.description), about: ORG_REF });
  const engines = useEngines();
  const levels = useLevels();
  const sections = SECTIONS.map((s) => ({ id: s.id, label: t(...s.label) }));

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
        breadcrumbs={aboutCrumbs(t, t('How we work', 'நாங்கள் எப்படிச் செயல்படுகிறோம்'))}
        eyebrow={t('How we work', 'நாங்கள் எப்படிச் செயல்படுகிறோம்')}
        title={t('One network. Four doors. Six engines. One platform.', 'ஒரே வலையமைப்பு. நான்கு வாசல்கள். ஆறு இயந்திரங்கள். ஒரே தளம்.')}
        lede={t(
          'Talent comes in free or at low cost. The organisations that need founders pay around them. Everything runs on one profile per person.',
          'திறமையாளர்கள் இலவசமாகவோ குறைந்த கட்டணத்திலோ இணைகிறார்கள். நிறுவனர்கள் தேவைப்படும் அமைப்புகள் அவர்களைச் சுற்றிச் செலவை ஏற்கின்றன. அனைத்தும் ஒருவருக்கு ஒரே சுயவிவரத்தில் இயங்குகிறது.'
        )}
        actions={
          <>
            <Button to="/partner" size="lg">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</Button>
            <Button to="/programmes" variant="tertiary" size="lg">{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>
          </>
        }
      />

      <InPageBar items={sections} label={t('Our model sections', 'எங்கள் மாதிரி: பகுதிகள்')} />

      {/* 1 + 4 + 6 + 1 architecture */}
      <Section id="architecture">
        <SectionHeader
          eyebrow="1 + 4 + 6 + 1"
          title={t('One masterbrand, four brands, six engines, one platform', 'ஒரு தாய் பிராண்ட், நான்கு பிராண்டுகள், ஆறு இயந்திரங்கள், ஒரே தளம்')}
          lede={t('Choose a brand or an engine to see how the pieces fit.', 'பகுதிகள் எப்படிப் பொருந்துகின்றன என்று பார்க்க ஒரு பிராண்டையோ இயந்திரத்தையோ தேர்வு செய்யுங்கள்.')}
        />
        <div className="hww-arch">
          <EngineMatrix />
        </div>
      </Section>

      {/* Section 1 · Four doors */}
      <Section id="doors" surface="white">
        <SectionHeader
          eyebrow={<><Num n={1} /> · {t('Four doors', 'நான்கு வாசல்கள்')}</>}
          title={t('Four doors into founding', 'நிறுவனர் ஆவதற்கு நான்கு வாசல்கள்')}
          lede={t(
            'Talent in Tamil Nadu sits in four places. Each StartNet brand goes to one of them.',
            'தமிழ்நாட்டில் திறமை நான்கு இடங்களில் இருக்கிறது. ஒவ்வொரு StartNet பிராண்டும் அவற்றில் ஒன்றுக்குச் செல்கிறது.'
          )}
        />
        <RevealGroup as="ul" className="hww-doors">
          {DOORS.map((d) => {
            const b = BRANDS[d.key];
            return (
              <li key={d.key} className="hww-door" data-brand={d.key}>
                <div className="hww-door__art">
                  <ArtImage variant="kolam" brand={d.key} ratio="3/2" seed={d.key.length * 3} alt="" />
                </div>
                <div className="hww-door__body">
                  <h3 className="h4 hww-door__name">{b.name}</h3>
                  <p className="hww-door__journey">{t(b.journey, b.journeyTa)}</p>
                  <p className="hww-door__text">{t(d.text, d.ta)}</p>
                  <ul className="hww-door__subs" aria-label={t(`${b.name} programmes`, `${b.name} திட்டங்கள்`)}>
                    {b.subNav.filter((s) => s.label !== 'Overview').map((s) => (
                      <li key={s.to}><Link to={localePath(s.to)}>{subLabel(s, t)}</Link></li>
                    ))}
                  </ul>
                  <Button to={b.base} variant="tertiary">{t(`Explore ${b.name}`, `${b.name}-ஐப் பாருங்கள்`)}</Button>
                </div>
              </li>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Section 2 · Six engines */}
      <Section id="engines">
        <SectionHeader
          eyebrow={<><Num n={2} /> · {t('Six engines', 'ஆறு இயந்திரங்கள்')}</>}
          title={t('Every brand draws on the same six engines.', 'ஒவ்வொரு பிராண்டும் அதே ஆறு இயந்திரங்களைப் பயன்படுத்துகிறது.')}
          lede={t('We build each one once and configure it per brand.', 'ஒவ்வொன்றையும் ஒருமுறை உருவாக்கி, ஒவ்வொரு பிராண்டுக்கும் ஏற்ப அமைக்கிறோம்.')}
        />
        <div className="hww-engines">
          <Steps variant="engines" steps={engines.map((e) => ({ title: e.name, body: e.body }))} />
        </div>
      </Section>

      {/* Section 3 · One platform */}
      <Section id="platform" surface="sunken" labelledBy="hww-platform-h">
        <div className="hww-split">
          <Reveal className="hww-split__text">
            <p className="eyebrow"><Num n={3} /> · {t('One platform', 'ஒரே தளம்')}</p>
            <h2 id="hww-platform-h" className="h2">StartNet X<Dot /></h2>
            <p className="body-lg">
              {t(
                'StartNet X gives each person one profile that follows them from their first event to their first funding round. It is also how we count outcomes for the Founder Ledger.',
                'StartNet X ஒவ்வொருவருக்கும் ஒரே சுயவிவரத்தைத் தருகிறது; அது அவர்களின் முதல் நிகழ்விலிருந்து முதல் நிதிச் சுற்று வரை தொடர்கிறது. Founder Ledger-க்கான விளைவுகளையும் இதன் மூலமே கணக்கிடுகிறோம்.'
              )}
            </p>
            <Button to="/startnet-x" variant="secondary">{t('Explore StartNet X', 'StartNet X-ஐப் பாருங்கள்')}</Button>
          </Reveal>
          <Reveal delay={0.1} className="hww-split__art">
            <ArtImage variant="network" ratio="3/2" seed={31} alt="" />
          </Reveal>
        </div>
      </Section>

      {/* Section 4 · The founder ladder (the page's one Night band) */}
      <Section id="ladder" surface="night">
        <SectionHeader
          eyebrow={<><Num n={4} /> · {t('The founder ladder', 'நிறுவனர் ஏணி')}</>}
          title={t('We track progress on seven levels.', 'முன்னேற்றத்தை ஏழு நிலைகளில் கண்காணிக்கிறோம்.')}
          lede={t('Only Level 2 and above counts as “nurtured”.', 'நிலை 2 மற்றும் அதற்கு மேல் உள்ளவர்கள் மட்டுமே “வளர்க்கப்பட்டவர்” எனக் கணக்கிடப்படுவர்.')}
          action={<Button to="/about/mission-1-lakh" variant="inverse">{t('See Mission 1 Lakh', 'Mission 1 Lakh-ஐப் பாருங்கள்')}</Button>}
        />
        <div className="hww-ladder">
          <Ladder variant="horizontal" levels={levels} />
        </div>
        <div className="hww-attrib">
          <p className="hww-attrib__k">{t('Attribution rule', 'பங்களிப்பு விதி')}</p>
          <p>{t(...ATTRIBUTION)}</p>
        </div>
      </Section>

      {/* Section 5 · How the money works */}
      <Section id="money" labelledBy="hww-money-h">
        <div className="about-two-col">
          <Reveal>
            <p className="eyebrow"><Num n={5} /> · {t('How the money works', 'பணம் எப்படி இயங்குகிறது')}</p>
            <h2 id="hww-money-h" className="h2 hww-money__title">{t('Talent is never the only payer.', 'செலவை ஏற்பது திறமையாளர்கள் மட்டுமல்ல.')}</h2>
          </Reveal>
          <RevealGroup as="ul" className="hww-money">
            {PAYERS.map((p) => (
              <li key={p.who[0]} className="hww-money__row">
                <span className="hww-money__who">{t(...p.who)}</span>
                <span className="hww-money__what">{t(...p.what)}</span>
              </li>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Section 6 · Three horizons */}
      <Section id="horizons" surface="white">
        <SectionHeader
          eyebrow={<><Num n={6} /> · {t('Three horizons', 'மூன்று கட்டங்கள்')}</>}
          title="Milk, Mountain, Moonshot"
        />
        <RevealGroup as="ol" className="hww-horizons">
          {HORIZONS.map((h, i) => (
            <li key={h.name} className="hww-horizon" style={{ '--n': i }}>
              <p className="hww-horizon__years tnum">{h.years}</p>
              <h3 className="h3 hww-horizon__name">{h.name}</h3>
              <p className="hww-horizon__focus">{t(...h.focus)}</p>
            </li>
          ))}
        </RevealGroup>
        <p className="hww-horizons__tag">
          <TagChip tag="C" />{' '}
          {t(
            'Plan, not forecast. We review it in public; the Mission 1 Lakh checkpoint is in 2028.',
            'இது திட்டம், முன்கணிப்பு அல்ல. இதைப் பொதுவெளியில் மறுஆய்வு செய்கிறோம்; Mission 1 Lakh சரிபார்ப்புப் புள்ளி 2028-இல்.'
          )}
        </p>
      </Section>

      <CTABand surface="night"
        title={t('Organisations that need founders pay for founders', 'நிறுவனர்கள் தேவைப்படும் அமைப்புகளே நிறுவனர்களுக்காகச் செலவிடுகின்றன')}
        body={t(
          'Universities want spinouts and innovation metrics. GCCs want problem-solvers, pilots and talent. Government wants reach and measured delivery. We design programmes around those outcomes and report on them in public.',
          'பல்கலைக்கழகங்களுக்கு ஸ்பின்அவுட் நிறுவனங்களும் புத்தாக்க அளவீடுகளும் தேவை. GCC-களுக்குச் சிக்கல் தீர்ப்பவர்கள், முன்னோட்டங்கள், திறமையாளர்கள் தேவை. அரசுக்குச் சென்றடைதலும் அளவிடப்பட்ட செயல்பாடும் தேவை. அந்த விளைவுகளைச் சுற்றித் திட்டங்களை வடிவமைத்து, அவற்றைப் பொதுவெளியில் அறிவிக்கிறோம்.'
        )}
        actions={
          <>
            <Button to="/partner" size="lg">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</Button>
            <Button to="/contact" variant="secondary" size="lg">{t('Talk to us', 'எங்களிடம் பேசுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}
