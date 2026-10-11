// /about/mission-1-lakh · Mission 1 Lakh (T19, storytelling route with GSAP).
// Copy: Book 2 §2.4 (H1, sub-head, sections 1–4), §1.5 (mission statement), §2.2 (ladder + attribution rule), §6.2 (reality check).
// Structure: Book 4 R1 §9 #7 (FasterForward: statement → dated commitments → proof → Ledger), IX-14 meter, one pin per route.
import { Link } from 'react-router-dom';
import {
  Seo, PageHero, Section, SectionHeader, Reveal, RevealGroup, Stat, Button, CTABand, TagChip,
} from '../../components';
import { ScrubText } from '../../components/ScrubText.jsx';
import { useLang } from '../../lib/i18n.jsx';
import { useApi } from '../../hooks/useApi.js';
import { aboutCrumbs, Num, PendingFigure, TagLegend, findMetric, hasValue } from './shared.jsx';
import MissionMeter from './MissionMeter.jsx';
import LadderScroll from './LadderScroll.jsx';
import './Mission.css';
import { ORG_REF } from '../../lib/seo.js';
import { pageLd } from '../brands/seoBits.js';

const PLAN_SOURCE = ['StartNet plan · planning assumption', 'StartNet திட்டம் · திட்டமிடல் அனுமானம்'];
const OCT_2026 = ['Oct 2026', 'அக்டோபர் 2026'];

const ticksFor = (t) => [
  {
    id: 'mar-2027', when: t('Mar 2027', 'மார்ச் 2027'), short: t('3,000 nurtured (plan)', '3,000 பேர் வளர்ப்பு (திட்டம்)'), value: 3000,
    label: t('nurtured (L2+) by March 2027, planning case', 'மார்ச் 2027-க்குள் வளர்க்கப்பட்டவர்கள் (L2+), திட்டமிடல் கணிப்பு'),
    asAt: t(...OCT_2026), source: t('StartNet investment memorandum, planning case', 'StartNet முதலீட்டுக் குறிப்பாணை, திட்டமிடல் கணிப்பு'),
    pending: t('[placeholder — to be supplied by StartNet]', '[placeholder — StartNet வழங்கும்]'),
  },
  {
    id: 'review-2028', when: '2028', short: t('Public review', 'பொது மறுஆய்வு'),
    label: t('The Mission 1 Lakh checkpoint, reviewed in public.', 'Mission 1 Lakh சரிபார்ப்புப் புள்ளி, பொதுவெளியில் மறுஆய்வு செய்யப்படும்.'),
    pending: t('Review due in 2028', 'மறுஆய்வு 2028-இல்'),
  },
  {
    id: 'mar-2031', when: t('Mar 2031', 'மார்ச் 2031'), short: t('1,00,000 nurtured', '1,00,000 பேர் வளர்ப்பு'), value: 100000,
    label: t('founders and aspiring founders nurtured in Tamil Nadu by March 2031', 'மார்ச் 2031-க்குள் தமிழ்நாட்டில் வளர்க்கப்படும் நிறுவனர்களும் நிறுவனர் ஆக விரும்புபவர்களும்'),
    asAt: t(...OCT_2026), source: t(...PLAN_SOURCE),
    pending: t('Target date not yet reached', 'இலக்குத் தேதி இன்னும் வரவில்லை'),
  },
  {
    id: '2040', when: '2040', short: 'Mission 1 Million', value: 1000000,
    label: t('founders and aspiring founders nurtured by 2040', '2040-க்குள் வளர்க்கப்படும் நிறுவனர்களும் நிறுவனர் ஆக விரும்புபவர்களும்'),
    asAt: t(...OCT_2026), source: t(...PLAN_SOURCE),
    pending: t('Target date not yet reached', 'இலக்குத் தேதி இன்னும் வரவில்லை'),
  },
];

const HEADLINE = [
  { id: 'nurtured', re: /nurtur/i, label: ['Founders nurtured (L2+), cumulative', 'வளர்க்கப்பட்ட நிறுவனர்கள் (L2+), மொத்தம்'] },
  { id: 'launched', re: /launch/i, label: ['Startups launched (L5), cumulative', 'தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), மொத்தம்'] },
  { id: 'capital', re: /capital|raised/i, label: ['Capital raised by StartNet founders', 'StartNet நிறுவனர்கள் திரட்டிய மூலதனம்'] },
  { id: 'pilots', re: /pilot|contract/i, label: ['Pilots and contracts signed', 'கையெழுத்தான முன்னோட்டங்களும் ஒப்பந்தங்களும்'] },
  { id: 'women', re: /women/i, label: ['Share of participants who are women', 'பங்கேற்பாளர்களில் பெண்களின் பங்கு'] },
  { id: 'districts', re: /district/i, label: ['Districts with active programmes', 'செயலில் உள்ள திட்டங்களைக் கொண்ட மாவட்டங்கள்'] },
];

// SEO: primary "Mission 1 Lakh" (the goal as stated on this page: 1,00,000 by March 2031).
// SEO-TA: pending native review
const SEO = {
  title: ['Mission 1 Lakh: the goal and how we count it', 'Mission 1 Lakh: இலக்கும் கணக்கீடும்'],
  description: [
    'Our goal: nurture 1,00,000 founders and aspiring founders in Tamil Nadu by March 2031. See what StartNet counts, published quarterly with confidence tags.',
    'மார்ச் 2031-க்குள் தமிழ்நாட்டில் 1,00,000 நிறுவனர்களை வளர்ப்பதே எங்கள் இலக்கு. StartNet எதைக் கணக்கிடுகிறது என்பதைக் காலாண்டுதோறும் வெளியிடுகிறோம்.',
  ],
  path: '/about/mission-1-lakh',
};

const ATTRIBUTION = [
  'A startup counts on our Ledger only if a founder reached L3 in a StartNet programme before the company was registered. We count what we helped create, not every company we met.',
  'நிறுவனம் பதிவு செய்யப்படுவதற்கு முன்பே அதன் நிறுவனர் ஒருவர் StartNet திட்டத்தில் L3-ஐ எட்டியிருந்தால் மட்டுமே அந்த ஸ்டார்ட்அப் எங்கள் Ledger-இல் கணக்கிடப்படும். நாங்கள் சந்தித்த ஒவ்வொரு நிறுவனத்தையும் அல்ல, உருவாக்க உதவியவற்றை மட்டுமே கணக்கிடுகிறோம்.',
];

export default function Mission() {
  const { t, lang, localePath } = useLang();
  const seoLd = pageLd({ path: SEO.path, lang, type: 'AboutPage', name: t(...SEO.title), description: t(...SEO.description), about: ORG_REF });
  const { data: ledger } = useApi('/api/ledger');
  const kpis = ledger?.kpis || [];
  const nurtured = findMetric(kpis, /nurtur/i);
  const ticks = ticksFor(t).map((tk) =>
    tk.id === 'mar-2027' && hasValue(nurtured) && (nurtured.tag === 'A' || nurtured.tag === 'B') ? { ...tk, actual: nurtured } : tk
  );
  const planSource = t(...PLAN_SOURCE);
  const asAt = t(...OCT_2026);

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
        breadcrumbs={aboutCrumbs(t, 'Mission 1 Lakh')}
        eyebrow="Mission 1 Lakh"
        title={t('We count outcomes, not attendance.', 'நாங்கள் வருகையை அல்ல, விளைவுகளை எண்ணுகிறோம்.')}
        lede={t(
          'Every quarter we publish how many people moved up the founder ladder, what they built and what they raised, with a confidence tag on every figure.',
          'ஒவ்வொரு காலாண்டும், எத்தனை பேர் நிறுவனர் ஏணியில் மேலே சென்றார்கள், என்ன உருவாக்கினார்கள், எவ்வளவு திரட்டினார்கள் என்பதை, ஒவ்வொரு எண்ணுக்கும் நம்பகத்தன்மைக் குறியுடன் வெளியிடுகிறோம்.'
        )}
        actions={
          <>
            <Button to="/insights/founder-ledger" size="lg">{t('See the Ledger', 'Ledger-ஐப் பாருங்கள்')}</Button>
            <Button to="/about/evidence-standard" variant="tertiary" size="lg">{t('See how we count', 'நாங்கள் எப்படிக் கணக்கிடுகிறோம்')}</Button>
          </>
        }
        art={{ variant: 'ladder', ratio: '4/5', seed: 7, alt: '', animate: true }}
      />

      {/* The mission and its dated commitments */}
      <Section id="mission" labelledBy="mission-statement-h">
        <div className="mission-statement">
          <Reveal className="mission-statement__lead">
            <p className="eyebrow">{t('The mission', 'இலக்கு')}</p>
            {/* DESIGN-v2 6.4: the page's one scroll-scrubbed statement (plain text in SSR, reduced motion and Tamil). */}
            <ScrubText as="h2" id="mission-statement-h" className="mission-statement__text">
              {t(
                'Our goal is to nurture 1,00,000 founders and aspiring founders in Tamil Nadu by March 2031, and 10,00,000 by 2040.',
                'மார்ச் 2031-க்குள் தமிழ்நாட்டில் 1,00,000 நிறுவனர்களையும் நிறுவனர் ஆக விரும்புபவர்களையும், 2040-க்குள் 10,00,000 பேரையும் வளர்ப்பதே எங்கள் இலக்கு.'
              )}
            </ScrubText>
            <p className="body-lg mission-statement__body">
              {t(
                '“Nurtured” has a strict meaning: a StartNet X profile plus at least two meaningful programme touchpoints. We count it in public, every quarter.',
                '“வளர்க்கப்பட்டவர்” என்பதற்குக் கண்டிப்பான பொருள் உண்டு: ஒரு StartNet X சுயவிவரமும், குறைந்தது இரண்டு அர்த்தமுள்ள திட்டத் தொடர்புகளும். ஒவ்வொரு காலாண்டும் இதைப் பொதுவெளியில் கணக்கிடுகிறோம்.'
              )}
            </p>
            <p className="mission-statement__tag"><TagChip tag="C" /> {t('Target · planning assumption', 'இலக்கு · திட்டமிடல் அனுமானம்')}</p>
          </Reveal>
          <RevealGroup as="ol" className="mission-commit">
            <li className="mission-commit__item">
              <Num n={1} />
              <p className="mission-commit__when">{t('By March 2031', 'மார்ச் 2031-க்குள்')}</p>
              <Stat
                value={100000}
                label={t('founders and aspiring founders nurtured in Tamil Nadu', 'தமிழ்நாட்டில் வளர்க்கப்படும் நிறுவனர்களும் நிறுவனர் ஆக விரும்புபவர்களும்')}
                tag="C" asAt={asAt} source={planSource} countUp={false}
              />
            </li>
            <li className="mission-commit__item">
              <Num n={2} />
              <p className="mission-commit__when">{t('By 2040 · Mission 1 Million', '2040-க்குள் · Mission 1 Million')}</p>
              <Stat
                value={1000000}
                label={t('founders and aspiring founders nurtured', 'வளர்க்கப்படும் நிறுவனர்களும் நிறுவனர் ஆக விரும்புபவர்களும்')}
                tag="C" asAt={asAt} source={planSource} countUp={false}
              />
            </li>
            <li className="mission-commit__item">
              <Num n={3} />
              <p className="mission-commit__when">{t('2028 · Checkpoint', '2028 · சரிபார்ப்புப் புள்ளி')}</p>
              <p className="mission-commit__text">
                {t(
                  'Plan, not forecast. We review it in public; the Mission 1 Lakh checkpoint is in 2028.',
                  'இது திட்டம், முன்கணிப்பு அல்ல. இதைப் பொதுவெளியில் மறுஆய்வு செய்கிறோம்; Mission 1 Lakh சரிபார்ப்புப் புள்ளி 2028-இல்.'
                )}
              </p>
            </li>
          </RevealGroup>
        </div>
        <p className="mission-how">
          {t('How we get there: four talent brands, six shared engines and one platform.', 'அங்கு எப்படிச் செல்கிறோம்: நான்கு திறமை பிராண்டுகள், ஆறு பகிரப்பட்ட இயந்திரங்கள், ஒரே தளம்.')}{' '}
          <Link to={localePath('/about/how-we-work')}>{t('See our model', 'எங்கள் மாதிரியைப் பாருங்கள்')}</Link>
        </p>
      </Section>

      {/* Night band · the meter (the evidence room) */}
      <Section id="meter" surface="night" className="mission-meterband">
        <SectionHeader
          eyebrow={t('Progress', 'முன்னேற்றம்')}
          title="Mission 1 Lakh"
          lede={t(
            'Founders nurtured (L2+) toward 1,00,000 by March 2031. Only verified counts (tag A or B) fill the dial; targets stay tagged C and are never summed into them.',
            'மார்ச் 2031-க்குள் 1,00,000 என்ற இலக்கை நோக்கி வளர்க்கப்பட்ட நிறுவனர்கள் (L2+). சரிபார்க்கப்பட்ட எண்ணிக்கைகள் (குறி A அல்லது B) மட்டுமே வட்டத்தை நிரப்பும்; இலக்குகள் C குறியுடனே இருக்கும், அவற்றுடன் ஒருபோதும் கூட்டப்படாது.'
          )}
        />
        <div className="mission-meterband__meter">
          <MissionMeter current={hasValue(nurtured) ? nurtured : null} ticks={ticks} />
        </div>
        <p className="mission-meterband__check">
          {t(
            '“Mission 1 Lakh is ambitious. If our 2028 review shows it is out of reach, we will reset the goal in public rather than change what ‘nurtured’ means.”',
            '“Mission 1 Lakh ஒரு லட்சிய இலக்கு. 2028 மறுஆய்வில் அது எட்ட முடியாதது எனத் தெரிந்தால், ‘வளர்க்கப்பட்டவர்’ என்பதன் பொருளை மாற்றாமல், இலக்கையே பொதுவெளியில் மாற்றியமைப்போம்.”'
          )}
        </p>
      </Section>

      {/* The founder ladder · pinned scrub on desktop */}
      <section id="ladder" aria-labelledby="mission-ladder-h" className="mission-ladderwrap">
        <LadderScroll
          intro={
            <>
              <p className="eyebrow">{t('The founder ladder', 'நிறுவனர் ஏணி')}</p>
              <h2 id="mission-ladder-h" className="h2">{t('We track progress on seven levels.', 'முன்னேற்றத்தை ஏழு நிலைகளில் கண்காணிக்கிறோம்.')}</h2>
              <p className="body-lg mission-ladderwrap__lede">
                {t('Only Level 2 and above counts as “nurtured”.', 'நிலை 2 மற்றும் அதற்கு மேல் உள்ளவர்கள் மட்டுமே “வளர்க்கப்பட்டவர்” எனக் கணக்கிடப்படுவர்.')}
              </p>
            </>
          }
          footer={
            <div className="mission-attrib">
              <p className="mission-attrib__k">{t('Attribution rule', 'பங்களிப்பு விதி')}</p>
              <p className="mission-attrib__v">{t(...ATTRIBUTION)}</p>
            </div>
          }
        />
      </section>

      {/* Section 1 · Latest headline figures (shown once the Ledger has at least one real headline figure) */}
      {HEADLINE.some((h) => hasValue(findMetric(kpis, h.re))) && (
      <Section id="figures" surface="white">
        <SectionHeader
          eyebrow={t('From the current Ledger', 'தற்போதைய Ledger-இலிருந்து')}
          title={t('Latest headline figures', 'சமீபத்திய முக்கிய எண்ணிக்கைகள்')}
          action={<Button to="/insights/founder-ledger" variant="tertiary">{t('Read the full Founder Ledger', 'முழு Founder Ledger-ஐப் படியுங்கள்')}</Button>}
        />
        <dl className="mission-figures">
          {HEADLINE.map((h) => {
            const m = findMetric(kpis, h.re);
            const label = t(...h.label);
            return hasValue(m) ? (
              <div key={h.id} className="mission-figures__stat"><Stat metric={{ ...m, label: t(m.label || label, m.labelTa || label) }} /></div>
            ) : (
              <PendingFigure key={h.id} label={label} />
            );
          })}
        </dl>
        <p className="about-note mission-figures__asat">
          {ledger?.asAt && <>{t('As at:', 'நிலவரம்:')} {ledger.asAt} ·{' '}</>}
          <Link to={localePath('/insights/founder-ledger')}>{t('Read the full Founder Ledger', 'முழு Founder Ledger-ஐப் படியுங்கள்')}</Link>
        </p>
      </Section>
      )}

      {/* Section 2 · What the tags mean */}
      <Section id="tags" labelledBy="mission-tags-h">
        <div className="about-two-col">
          <Reveal>
            <p className="eyebrow">{t('Confidence tags', 'நம்பகத்தன்மைக் குறிகள்')}</p>
            <h2 id="mission-tags-h" className="h2">{t('What the tags mean', 'குறிகளின் பொருள்')}</h2>
          </Reveal>
          <Reveal delay={0.08} className="mission-tags">
            <TagLegend />
            <Button to="/about/evidence-standard" variant="tertiary">{t('Read our evidence standard', 'எங்கள் சான்றுத் தரநிலையைப் படியுங்கள்')}</Button>
          </Reveal>
        </div>
      </Section>

      {/* Section 3 · What we hold ourselves to · Section 4 · Self-diagnosis */}
      {/* White sheet: the paper CTA band below would otherwise merge with a sunken section. */}
      <Section id="standards" surface="white">
        <SectionHeader eyebrow={t('Commitments', 'உறுதிமொழிகள்')} title={t('What we hold ourselves to', 'நாங்கள் பின்பற்றும் கடப்பாடுகள்')} />
        <RevealGroup as="ul" className="mission-hold">
          <li className="mission-hold__item">
            <h3 className="h5">{t('A 40% floor', '40% குறைந்தபட்ச அளவு')}</h3>
            <p>{t('We aim for at least 40% women across all StartNet programmes.', 'அனைத்து StartNet திட்டங்களிலும் குறைந்தது 40% பெண்கள் இருப்பதை இலக்காகக் கொண்டுள்ளோம்.')}</p>
            <Stat
              variant="compact" value={40} unit="%"
              label={t('minimum share of women across programmes (target)', 'திட்டங்களில் பெண்களின் குறைந்தபட்சப் பங்கு (இலக்கு)')}
              tag="C" asAt={asAt} source={planSource}
            />
          </li>
          <li className="mission-hold__item">
            <h3 className="h5">{t('A district promise', 'மாவட்ட வாக்குறுதி')}</h3>
            <p>
              {t(
                'We report the share of launched founders from outside Chennai, Coimbatore and Kancheepuram.',
                'சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த பிற பகுதிகளிலிருந்து நிறுவனம் தொடங்கிய நிறுவனர்களின் பங்கை வெளியிடுகிறோம்.'
              )}
            </p>
          </li>
          <li className="mission-hold__item">
            <h3 className="h5">{t('Stopping rules', 'நிறுத்த விதிகள்')}</h3>
            <p>
              {t(
                'Every lab, programme and event series has a written condition under which it closes or changes. When we use it, we say so.',
                'ஒவ்வொரு ஆய்வகம், திட்டம், நிகழ்வுத் தொடருக்கும் அது மூடப்படும் அல்லது மாற்றப்படும் நிபந்தனை எழுத்தில் உள்ளது. அதைப் பயன்படுத்தும்போது வெளிப்படையாகச் சொல்கிறோம்.'
              )}
            </p>
            <Button to="/about/governance" variant="tertiary" size="sm">{t('Governance & kill criteria', 'நிர்வாகமும் நிறுத்த விதிகளும்')}</Button>
          </li>
          <li className="mission-hold__item mission-hold__item--diag">
            <h3 className="h5">{t('Self-diagnosis', 'சுய ஆய்வு')}</h3>
            <p>{t('Once a year we publish where StartNet is falling short.', 'ஆண்டுக்கு ஒருமுறை StartNet எங்கே பின்தங்குகிறது என்பதை வெளியிடுகிறோம்.')}</p>
          </li>
        </RevealGroup>
      </Section>

      <CTABand
        surface="night"
        accentWord="public"
        title={t('We count it in public, every quarter.', 'ஒவ்வொரு காலாண்டும், பொதுவெளியில் கணக்கிடுகிறோம்.')}
        actions={
          <>
            <Button to="/insights/founder-ledger" size="lg">{t('See the Ledger', 'Ledger-ஐப் பாருங்கள்')}</Button>
            <Button to="/join" variant="secondary" size="lg">{t('Join StartNet', 'StartNet-இல் இணையுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}
