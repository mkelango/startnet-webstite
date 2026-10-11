// /about/thinktn-alliance (T19). Copy: Book 2 §2.5 verbatim.
// Design note (Book 2): no sponsor logos, no event promotions, no partner carousel; the ThinkTN wordmark appears only as a
// text link; ThinkTN's side of the diagram is neutral ink, never StartNet Red. ThinkTN is never co-branded (Book 1 Part B §3.8).
// Tamil copy: draft pending native review (Book 2 §14).
import { m as motion } from 'framer-motion'; // light m inside the shell's LazyMotion
import { ArrowUpRight } from 'lucide-react';
import { Seo, PageHero, Section, SectionHeader, Reveal, RevealGroup, Button, CTABand } from '../../components';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useLang } from '../../lib/i18n.jsx';
import { aboutCrumbs, Num } from './shared.jsx';
import './ThinkTN.css';
import { ORG_REF } from '../../lib/seo.js';
import { pageLd } from '../brands/seoBits.js';

const THINKTN_URL = 'https://thinktn.in';

// SEO: primary "StartNet ThinkTN" (Book 2 §2.5, verbatim).
// SEO-TA: pending native review
const SEO = {
  title: ['StartNet and ThinkTN: one standard of evidence', 'StartNet-உம் ThinkTN-உம்: ஒரே சான்றுத் தரநிலை'],
  description: [
    "ThinkTN is an independent non-profit. StartNet adopts its evidence standard and keeps a firewall so commercial work never touches ThinkTN's findings.",
    'ThinkTN ஒரு சுதந்திரமான இலாப நோக்கற்ற அமைப்பு. StartNet அதன் சான்றுத் தரநிலையை ஏற்று, வணிகப் பணிகள் அதன் கண்டறிதல்களைத் தொடாதபடி பார்த்துக்கொள்கிறது.',
  ],
  path: '/about/thinktn-alliance',
};

const ADOPT = [
  { k: ['Confidence tags:', 'நம்பகத்தன்மைக் குறிகள்:'], v: ['A, B or C on every figure we publish.', 'நாங்கள் வெளியிடும் ஒவ்வொரு எண்ணிலும் A, B அல்லது C.'] },
  {
    k: ['Stopping rules:', 'நிறுத்த விதிகள்:'],
    v: [
      'a named owner and written conditions for closing or changing every programme, set before launch.',
      'ஒவ்வொரு திட்டத்துக்கும் பெயரிடப்பட்ட பொறுப்பாளரும், அதை மூடுவதற்கோ மாற்றுவதற்கோ உரிய எழுதப்பட்ட நிபந்தனைகளும், தொடங்குவதற்கு முன்பே.',
    ],
  },
  {
    k: ['A public corrections log,', 'பொதுத் திருத்தப் பதிவேடு:'],
    v: [
      'dated and graded by severity, and an annual self-diagnosis of where we are failing.',
      'தேதியிட்டது, தீவிர நிலை வாரியாகத் தரப்படுத்தப்பட்டது; நாங்கள் எங்கே தவறுகிறோம் என்பதற்கான ஆண்டு சுய ஆய்வும்.',
    ],
  },
  {
    k: ['Three horizons', 'மூன்று கட்டங்கள்:'],
    v: [
      'for our roadmap (Milk, Mountain, Moonshot) and closed roundtables under the Chatham House Rule, with a published note.',
      'எங்கள் செயல்திட்டத்துக்கு (Milk, Mountain, Moonshot); Chatham House விதியின் கீழ் மூடிய வட்டமேசைக் கூட்டங்கள், வெளியிடப்படும் குறிப்புடன்.',
    ],
  },
];

const FIREWALL = [
  ['No StartNet sponsor, logo or client appears beside a ThinkTN finding.', 'ThinkTN கண்டறிதலின் அருகில் எந்த StartNet நிதியளிப்பவரோ, இலச்சினையோ, வாடிக்கையாளரோ இடம்பெறாது.'],
  ['StartNet never sees ThinkTN findings before they are published.', 'ThinkTN கண்டறிதல்கள் வெளியிடப்படுவதற்கு முன் StartNet அவற்றை ஒருபோதும் பார்ப்பதில்லை.'],
  [
    'Any StartNet funding of ThinkTN is disclosed by ThinkTN and stays within its limits on any one funder.',
    'ThinkTN-க்கு StartNet அளிக்கும் எந்த நிதியையும் ThinkTN வெளிப்படுத்தும்; அது ஒரே நிதியளிப்பவருக்கான அதன் வரம்புகளுக்குள் இருக்கும்.',
  ],
  [
    'Separate boards, brands, websites and bank accounts. ThinkTN is never presented as part of StartNet.',
    'தனித்தனி இயக்குநர் குழுக்கள், பிராண்டுகள், இணையதளங்கள், வங்கிக் கணக்குகள். ThinkTN ஒருபோதும் StartNet-இன் பகுதியாகக் காட்டப்படாது.',
  ],
  [
    'If StartNet commissions research, it pays market rates, and ThinkTN may decline.',
    'StartNet ஆய்வை ஒப்படைத்தால், சந்தை விலையைச் செலுத்தும்; ThinkTN அதை மறுக்கலாம்.',
  ],
];

function VisitThinkTN({ size = 'lg' }) {
  const { t } = useLang();
  return (
    <a className={`ttn-ext ttn-ext--${size}`} href={THINKTN_URL} target="_blank" rel="noopener noreferrer">
      {t('Visit ThinkTN', 'ThinkTN தளத்துக்குச் செல்லுங்கள்')}
      <ArrowUpRight size={18} aria-hidden="true" />
      <span className="visually-hidden">{t('(opens in a new tab)', '(புதிய தாவலில் திறக்கும்)')}</span>
    </a>
  );
}

function FirewallDiagram() {
  const reduced = useReducedMotion();
  const { t } = useLang();
  const ownBoard = t('Its own board, brand, website and bank account', 'தனக்கென இயக்குநர் குழு, பிராண்ட், இணையதளம், வங்கிக் கணக்கு');
  return (
    <figure className="ttn-diagram" aria-labelledby="ttn-diagram-cap">
      <div className="ttn-diagram__side ttn-diagram__side--thinktn">
        <p className="ttn-diagram__label">{t('Evidence', 'சான்று')}</p>
        <p className="ttn-diagram__name">ThinkTN</p>
        <ul>
          <li>{t('An independent, non-profit policy institution', 'சுதந்திரமான, இலாப நோக்கற்ற கொள்கை ஆய்வு நிறுவனம்')}</li>
          <li>{t('Publishes evidence about Tamil Nadu', 'தமிழ்நாடு பற்றிய சான்றுகளை வெளியிடுகிறது')}</li>
          <li>{ownBoard}</li>
        </ul>
      </div>
      <div className="ttn-diagram__wall" aria-hidden="true">
        {reduced ? (
          <span className="ttn-diagram__line" />
        ) : (
          <motion.span
            className="ttn-diagram__line"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.4, 0.14, 0.3, 1] }}
          />
        )}
        <span className="ttn-diagram__walllabel">{t('Firewall', 'தடுப்புச்சுவர்')}</span>
      </div>
      <div className="ttn-diagram__side ttn-diagram__side--startnet">
        <p className="ttn-diagram__label">{t('Founders', 'நிறுவனர்கள்')}</p>
        <p className="ttn-diagram__name">StartNet<span className="dot">.</span></p>
        <ul>
          <li>{t('A company', 'ஒரு நிறுவனம்')}</li>
          <li>{t("Tamil Nadu's founder-making network", 'தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு')}</li>
          <li>{ownBoard}</li>
        </ul>
      </div>
      <div className="ttn-diagram__shared">
        <span>{t('Shared: one standard for numbers', 'பகிரப்படுவது: எண்களுக்கான ஒரே தரநிலை')}</span>
      </div>
      <figcaption id="ttn-diagram-cap" className="visually-hidden">
        {t(
          'ThinkTN (evidence) and StartNet (founders) sit on either side of a firewall. They share one standard for numbers and nothing else.',
          'ThinkTN (சான்று), StartNet (நிறுவனர்கள்) இரண்டும் ஒரு தடுப்புச்சுவரின் இருபுறமும் உள்ளன. எண்களுக்கான ஒரே தரநிலையைத் தவிர வேறு எதையும் அவை பகிர்ந்துகொள்வதில்லை.'
        )}
      </figcaption>
    </figure>
  );
}

export default function ThinkTN() {
  const { t, lang } = useLang();
  const seoLd = pageLd({ path: SEO.path, lang, type: 'AboutPage', name: t(...SEO.title), description: t(...SEO.description), about: ORG_REF });
  const readStandard = t('Read our evidence standard', 'எங்கள் சான்றுத் தரநிலையைப் படியுங்கள்');
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
        breadcrumbs={aboutCrumbs(t, t('ThinkTN alliance', 'ThinkTN கூட்டணி'))}
        eyebrow={t('ThinkTN alliance', 'ThinkTN கூட்டணி')}
        title={t('Two organisations. One standard of evidence.', 'இரண்டு அமைப்புகள். ஒரே சான்றுத் தரநிலை.')}
        lede={t(
          'ThinkTN is an independent, non-profit policy institution that publishes evidence about Tamil Nadu. StartNet is a company. We share a standard for numbers, and we keep a firewall between us.',
          'ThinkTN தமிழ்நாடு பற்றிய சான்றுகளை வெளியிடும் சுதந்திரமான, இலாப நோக்கற்ற கொள்கை ஆய்வு நிறுவனம். StartNet ஒரு நிறுவனம். எண்களுக்கான ஒரு தரநிலையைப் பகிர்ந்துகொள்கிறோம்; எங்களுக்கிடையே ஒரு தடுப்புச்சுவரைப் பேணுகிறோம்.'
        )}
        actions={
          <>
            <VisitThinkTN />
            <Button to="/about/evidence-standard" variant="tertiary" size="lg">{readStandard}</Button>
          </>
        }
      />

      <Section pad="sm">
        <Reveal>
          <FirewallDiagram />
        </Reveal>
      </Section>

      <Section surface="white">
        <div className="about-two-col">
          <Reveal>
            <p className="eyebrow"><Num n={1} /> · {t('What we adopt', 'நாங்கள் ஏற்பவை')}</p>
            <h2 className="h2">{t('What we adopt from ThinkTN', 'ThinkTN-இடமிருந்து நாங்கள் ஏற்பவை')}</h2>
          </Reveal>
          <RevealGroup as="ul" className="ttn-adopt">
            {ADOPT.map((a) => (
              <li key={a.k[0]} className="ttn-adopt__item">
                <strong>{t(...a.k)}</strong> {t(...a.v)}
              </li>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={`02 · ${t('The firewall', 'தடுப்புச்சுவர்')}`}
          title={t('The firewall', 'தடுப்புச்சுவர்')}
          lede={t('These rules are not negotiable:', 'இந்த விதிகளில் சமரசம் இல்லை:')}
        />
        <RevealGroup as="ol" className="ttn-rules">
          {FIREWALL.map((r, i) => (
            <li key={r[0]} className="ttn-rules__item">
              <span className="ttn-rules__n tnum" aria-hidden="true">{i + 1}</span>
              <p>{t(...r)}</p>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* White sheet: the paper CTA band below would otherwise merge with a sunken section. */}
      <Section surface="white" pad="sm">
        <div className="about-two-col">
          <Reveal>
            <p className="eyebrow"><Num n={3} /> · {t('Related party', 'தொடர்புடைய தரப்பு')}</p>
            <h2 className="h2">{t('Related party', 'தொடர்புடைய தரப்பு')}</h2>
          </Reveal>
          <Reveal delay={0.08} className="ttn-related">
            <p className="body-lg">
              {t(
                "ThinkTN is a related party of StartNet. Any dealings between the two are at arm's length and disclosed.",
                'ThinkTN, StartNet-இன் தொடர்புடைய தரப்பு. இரண்டுக்கும் இடையிலான எந்தப் பரிவர்த்தனையும் சம தூர அடிப்படையில் நடைபெறும்; வெளிப்படுத்தப்படும்.'
              )}
            </p>
            {/* Link to the disclosure statement: add here when StartNet publishes it. */}
          </Reveal>
        </div>
      </Section>

      <CTABand surface="night"
        title={t('One standard for numbers. A firewall for everything else.', 'எண்களுக்கு ஒரே தரநிலை. மற்ற அனைத்துக்கும் ஒரு தடுப்புச்சுவர்.')}
        actions={
          <>
            <VisitThinkTN />
            <Button to="/about/evidence-standard" variant="secondary" size="lg">{readStandard}</Button>
          </>
        }
      />
    </>
  );
}
