// /about/evidence-standard (T19). Copy: Book 2 §2.6 sections 1–2 (also published here), §2.4 section 2 (tag meanings);
// rules: Book 1 Part A §4.4 proof architecture, §8.6 evidence and corrections policy, Part B §9.5 corrections flow.
// Tamil copy: draft pending native review (Book 2 §14).
import { Link } from 'react-router-dom';
import { Seo, PageHero, Section, Reveal, RevealGroup, Stat, TagChip, Button, CTABand } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { aboutCrumbs, InPageNav, Num } from './shared.jsx';
import './EvidenceStandard.css';
import { ORG_REF } from '../../lib/seo.js';
import { pageLd } from '../brands/seoBits.js';

// SEO: primary "evidence standard"; a plain, quotable fact page (Book 1 §9.6).
// SEO-TA: pending native review
const SEO = {
  title: ['Evidence standard: how StartNet tags every figure', 'சான்றுத் தரநிலை: StartNet ஒவ்வொரு எண்ணையும் குறிக்கும் முறை'],
  description: [
    'Every StartNet figure carries a source and as-at date, or an A, B or C confidence tag. See how we source startup numbers and correct them in public.',
    'ஒவ்வொரு StartNet எண்ணுக்கும் மூலமும் தேதியும், அல்லது A, B, C நம்பகத்தன்மைக் குறி உண்டு. எண்களை எப்படிப் பெற்று, பொதுவெளியில் திருத்துகிறோம்.',
  ],
  path: '/about/evidence-standard',
};

const tags = (t) => [
  {
    tag: 'A', name: t('Verified', 'சரிபார்க்கப்பட்டது'), short: t('Verified against a primary source.', 'முதன்மை மூலத்துடன் சரிபார்க்கப்பட்டது.'),
    long: t('Verified against a primary or system record.', 'முதன்மை அல்லது அமைப்புப் பதிவுடன் சரிபார்க்கப்பட்டது.'),
    example: {
      value: 15037, tag: 'A',
      label: t('DPIIT-recognised startups in Tamil Nadu', 'தமிழ்நாட்டில் DPIIT அங்கீகாரம் பெற்ற ஸ்டார்ட்அப்கள்'),
      asAt: t('July 2026', 'ஜூலை 2026'), source: t('DPIIT data via DT Next, July 2026', 'DPIIT தரவு, DT Next வழியாக, ஜூலை 2026'),
    },
  },
  {
    tag: 'B', name: t('Reported', 'தெரிவிக்கப்பட்டது'), short: t('Reported by the founder or organisation.', 'நிறுவனர் அல்லது நிறுவனம் தெரிவித்தது.'),
    long: t('An organisation’s own claim, checked by an editor.', 'ஒரு நிறுவனத்தின் சொந்தக் கூற்று; ஆசிரியர் ஒருவரால் சரிபார்க்கப்பட்டது.'),
    example: {
      value: 80, unit: '%', tag: 'B', asAt: '2025',
      label: t('of colleges reached by Vibathon 2025 were Tier 3 or 4', 'Vibathon 2025 சென்றடைந்த கல்லூரிகளில் Tier 3 அல்லது 4 கல்லூரிகள்'),
      source: t('Vibathon 2025 brochure', 'Vibathon 2025 கையேடு'),
    },
  },
  {
    tag: 'C', name: t('Estimate', 'மதிப்பீடு'), short: t('An estimate or planning assumption.', 'ஒரு மதிப்பீடு அல்லது திட்டமிடல் அனுமானம்.'),
    long: t(
      'Estimate or self-reported, not yet verified. Our own prices and targets are tagged C.',
      'மதிப்பீடு அல்லது சுயமாகத் தெரிவித்தது; இன்னும் சரிபார்க்கப்படவில்லை. எங்கள் சொந்த விலைகளும் இலக்குகளும் C எனக் குறிக்கப்படும்.'
    ),
    example: {
      value: 100000, tag: 'C', asAt: t('Oct 2026', 'அக்டோபர் 2026'), countUp: false,
      label: t('founders nurtured by March 2031 (Mission 1 Lakh target)', 'மார்ச் 2031-க்குள் வளர்க்கப்படும் நிறுவனர்கள் (Mission 1 Lakh இலக்கு)'),
      source: t('StartNet plan · planning assumption', 'StartNet திட்டம் · திட்டமிடல் அனுமானம்'),
    },
  },
];

const SOURCING = [
  [
    'No figure without a source and as-at date, or an A/B/C tag. StartNet targets are labelled “planning assumption (C)”.',
    'மூலமும் நிலவரத் தேதியும், அல்லது A/B/C குறியும் இல்லாமல் எந்த எண்ணும் இல்லை. StartNet இலக்குகள் “திட்டமிடல் அனுமானம் (C)” எனக் குறிக்கப்படும்.',
  ],
  [
    'External statistics name the publisher and date (for example “DPIIT via DT Next, July 2026”).',
    'வெளிப் புள்ளிவிவரங்கள் வெளியீட்டாளரையும் தேதியையும் குறிப்பிடும் (உதாரணமாக “DPIIT, DT Next வழியாக, ஜூலை 2026”).',
  ],
  [
    'Partners appear only when signed. Co-hosts are credited once the event has taken place.',
    'கையெழுத்திட்ட பின்பே கூட்டாளர்கள் இடம்பெறுவர். நிகழ்வு நடந்து முடிந்த பின்பே இணை ஏற்பாட்டாளர்களுக்குப் பெருமை சேர்க்கப்படும்.',
  ],
  [
    'Errors are corrected in place, with a dated note and a log entry (minor, material, critical).',
    'பிழைகள் அதே இடத்தில், தேதியிட்ட குறிப்புடனும் பதிவேட்டுப் பதிவுடனும் (சிறியது, முக்கியமானது, கடுமையானது) திருத்தப்படும்.',
  ],
  [
    'Founder stories need written consent. A and B tags require verification.',
    'நிறுவனர் கதைகளுக்கு எழுத்துப்பூர்வ ஒப்புதல் தேவை. A, B குறிகளுக்குச் சரிபார்ப்பு தேவை.',
  ],
  [
    'No forward-looking financials, valuations or fund performance on the public site. Investor material lives in the data room.',
    'எதிர்கால நிதிக் கணிப்புகள், மதிப்பீடுகள், நிதிச் செயல்திறன் எதுவும் பொதுத் தளத்தில் இல்லை. முதலீட்டாளர் ஆவணங்கள் தரவு அறையில் மட்டுமே.',
  ],
];

const FLOW = [
  {
    title: ['Tap a figure', 'ஒரு எண்ணைத் தட்டுங்கள்'],
    body: ['Every number opens a popover with its tag, as-at date, source and method link.', 'ஒவ்வொரு எண்ணும் அதன் குறி, நிலவரத் தேதி, மூலம், முறை இணைப்புடன் ஒரு சிறு சாளரத்தைத் திறக்கும்.'],
  },
  {
    title: ['Report a correction', 'திருத்தத்தைத் தெரிவியுங்கள்'],
    body: ['Tell us which figure, what is wrong and the evidence. Contact details are optional.', 'எந்த எண், என்ன தவறு, அதற்கான சான்று என்ன என்று சொல்லுங்கள். தொடர்பு விவரங்கள் விருப்பத்துக்குரியவை.'],
  },
  {
    title: ['Evidence committee review', 'சான்றுக் குழு மறுஆய்வு'],
    body: ['The evidence committee signs off every figure, Ledger edition and correction.', 'ஒவ்வொரு எண், Ledger பதிப்பு, திருத்தத்துக்கும் சான்றுக் குழு ஒப்புதல் அளிக்கிறது.'],
  },
  {
    title: ['Published within 14 days', '14 நாட்களுக்குள் வெளியீடு'],
    body: [
      'A dated correction row with its severity; the affected figure shows a corrected badge. Past snapshots stay frozen.',
      'தீவிர நிலையுடன் தேதியிட்ட திருத்த வரி; பாதிக்கப்பட்ட எண்ணில் “திருத்தப்பட்டது” என்ற அடையாளம். பழைய பதிப்புகள் மாற்றமின்றி இருக்கும்.',
    ],
  },
];

const SEVERITY = [
  { id: 'minor', label: ['Minor', 'சிறியது'] },
  { id: 'material', label: ['Material', 'முக்கியமானது'] },
  { id: 'critical', label: ['Critical', 'கடுமையானது'] },
];

const SECTIONS = [
  { id: 'tags', label: ['The three tags', 'மூன்று குறிகள்'] },
  { id: 'sourcing', label: ['Sourcing rules', 'மூல விதிகள்'] },
  { id: 'corrections', label: ['Corrections policy', 'திருத்தக் கொள்கை'] },
  { id: 'stopping-rules', label: ['Stopping rules', 'நிறுத்த விதிகள்'] },
  { id: 'origin', label: ['Where the standard comes from', 'தரநிலை எங்கிருந்து வருகிறது'] },
];

export default function EvidenceStandard() {
  const { t, lang, localePath } = useLang();
  const seoLd = pageLd({ path: SEO.path, lang, type: 'AboutPage', name: t(...SEO.title), description: t(...SEO.description), about: ORG_REF });
  const sections = SECTIONS.map((s) => ({ id: s.id, label: t(...s.label) }));
  const corrections = t('See corrections log', 'திருத்தப் பதிவேட்டைப் பாருங்கள்');

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
        breadcrumbs={aboutCrumbs(t, t('Evidence standard', 'சான்றுத் தரநிலை'))}
        eyebrow={t('How we keep score', 'நாங்கள் எப்படிக் கணக்கு வைக்கிறோம்')}
        title={t(
          'Every figure shows its source and as-at date, or an A/B/C tag.',
          'ஒவ்வொரு எண்ணும் அதன் மூலத்தையும் நிலவரத் தேதியையும், அல்லது A/B/C குறியைக் காட்டும்.'
        )}
        lede={t(
          'Our own prices and targets are tagged C. Partners appear only once signed, with the date. Errors go in the public corrections log.',
          'எங்கள் சொந்த விலைகளும் இலக்குகளும் C எனக் குறிக்கப்படும். கூட்டாளர்கள் கையெழுத்திட்ட பின்பே, தேதியுடன் இடம்பெறுவர். பிழைகள் பொதுத் திருத்தப் பதிவேட்டில் சேர்க்கப்படும்.'
        )}
        actions={
          <>
            <Button to="/insights/founder-ledger#corrections" size="lg">{corrections}</Button>
            <Button to="/about/governance" variant="tertiary" size="lg">{t('Governance', 'நிர்வாகம்')}</Button>
          </>
        }
      />

      <Section width="default">
        <div className="about-layout-toc">
          <aside className="about-layout-toc__aside">
            <InPageNav items={sections} variant="aside" />
          </aside>

          <div className="about-layout-toc__main evs-main">
            {/* The three tags */}
            <section id="tags" aria-labelledby="evs-tags-h" className="evs-block">
              <p className="eyebrow"><Num n={1} /> · {t('Confidence tags', 'நம்பகத்தன்மைக் குறிகள்')}</p>
              <h2 id="evs-tags-h" className="h2">{t('A, B or C on every figure we publish', 'நாங்கள் வெளியிடும் ஒவ்வொரு எண்ணிலும் A, B அல்லது C')}</h2>
              <p className="body-lg evs-lede">
                {t(
                  'The tag tells you how far to trust a number. Tap the tag on any figure below to see its source, as-at date and method.',
                  'ஒரு எண்ணை எந்த அளவுக்கு நம்பலாம் என்பதைக் குறி சொல்லும். கீழே உள்ள எந்த எண்ணின் குறியையும் தட்டி அதன் மூலம், நிலவரத் தேதி, முறையைப் பாருங்கள்.'
                )}
              </p>
              <RevealGroup as="ul" className="evs-tags">
                {tags(t).map((tg) => (
                  <li key={tg.tag} className={`evs-tag evs-tag--${tg.tag.toLowerCase()}`}>
                    <div className="evs-tag__head">
                      <TagChip tag={tg.tag} />
                      <h3 className="h4 evs-tag__name">{tg.name}</h3>
                    </div>
                    <p className="evs-tag__short">{tg.short}</p>
                    <p className="evs-tag__long">{tg.long}</p>
                    <div className="evs-tag__example">
                      <p className="evs-tag__k">{t('Live example', 'நேரடி உதாரணம்')}</p>
                      <Stat variant="compact" {...tg.example} />
                    </div>
                  </li>
                ))}
              </RevealGroup>
              <p className="evs-rule">
                <strong>{t('The C-tag rule:', 'C-குறி விதி:')}</strong>{' '}
                {t('C-tagged figures are shown separately and never summed into A or B.', 'C எனக் குறிக்கப்பட்ட எண்கள் தனியாகக் காட்டப்படும்; A அல்லது B உடன் ஒருபோதும் கூட்டப்படாது.')}
              </p>
            </section>

            {/* Sourcing rules */}
            <section id="sourcing" aria-labelledby="evs-sourcing-h" className="evs-block">
              <p className="eyebrow"><Num n={2} /> · {t('Sourcing', 'மூலங்கள்')}</p>
              <h2 id="evs-sourcing-h" className="h2">{t('Sourcing rules', 'மூல விதிகள்')}</h2>
              <ol className="evs-rules">
                {SOURCING.map((r, i) => (
                  <Reveal as="li" key={r[0]} className="evs-rules__item" delay={Math.min(i, 5) * 0.04}>
                    <Num n={i + 1} />
                    <p>{t(...r)}</p>
                  </Reveal>
                ))}
              </ol>
              <p className="about-note">
                {t('Drafts with missing data do not publish until the figure is supplied.', 'தரவு இல்லாத வரைவுகள் எண் வழங்கப்படும் வரை வெளியிடப்படாது.')}
              </p>
            </section>

            {/* Corrections policy */}
            <section id="corrections" aria-labelledby="evs-corr-h" className="evs-block">
              <p className="eyebrow"><Num n={3} /> · {t('Corrections', 'திருத்தங்கள்')}</p>
              <h2 id="evs-corr-h" className="h2">{t('Corrections policy', 'திருத்தக் கொள்கை')}</h2>
              <p className="body-lg evs-lede">
                {t(
                  'Errors are corrected in place, with a dated note and a log entry. The corrections log is public, dated and graded by severity, and it is linked from every Ledger edition and report.',
                  'பிழைகள் அதே இடத்தில், தேதியிட்ட குறிப்புடனும் பதிவேட்டுப் பதிவுடனும் திருத்தப்படும். திருத்தப் பதிவேடு பொதுவானது, தேதியிட்டது, தீவிர நிலை வாரியாகத் தரப்படுத்தப்பட்டது; ஒவ்வொரு Ledger பதிப்பிலிருந்தும் அறிக்கையிலிருந்தும் அதற்கு இணைப்பு உண்டு.'
                )}
              </p>
              <ol className="evs-flow">
                {FLOW.map((f, i) => (
                  <Reveal as="li" key={f.title[0]} className="evs-flow__step" delay={i * 0.04}>
                    <span className="evs-flow__n tnum" aria-hidden="true">{i + 1}</span>
                    <h3 className="h5">{t(...f.title)}</h3>
                    <p>{t(...f.body)}</p>
                  </Reveal>
                ))}
              </ol>
              <div className="evs-severity">
                <p className="evs-severity__k">{t('Severity grades', 'தீவிர நிலைகள்')}</p>
                <ul className="evs-severity__list">
                  {SEVERITY.map((s) => (
                    <li key={s.id} className={`evs-severity__chip evs-severity__chip--${s.id}`}>{t(...s.label)}</li>
                  ))}
                </ul>
              </div>
              <div className="evs-actions">
                <Button to="/insights/founder-ledger#corrections">{corrections}</Button>
              </div>
            </section>

            {/* Stopping rules (Book 2 §2.6 section 2) */}
            <section id="stopping-rules" aria-labelledby="evs-stop-h" className="evs-block">
              <p className="eyebrow"><Num n={4} /> · {t('Stopping rules', 'நிறுத்த விதிகள்')}</p>
              <h2 id="evs-stop-h" className="h2">{t('Programme stopping rules', 'திட்ட நிறுத்த விதிகள்')}</h2>
              <p className="body-lg evs-lede">
                {t(
                  "Every lab, programme and event series has a named owner and a written stopping condition. Example: a StartNet Lab that forms no company in 24 months closes or pivots, and we publish the decision. Each brand's advisory council reviews progress every quarter.",
                  'ஒவ்வொரு ஆய்வகம், திட்டம், நிகழ்வுத் தொடருக்கும் பெயரிடப்பட்ட ஒரு பொறுப்பாளரும் எழுதப்பட்ட நிறுத்த நிபந்தனையும் உண்டு. உதாரணம்: 24 மாதங்களில் எந்த நிறுவனத்தையும் உருவாக்காத StartNet Lab மூடப்படும் அல்லது திசை மாற்றப்படும்; அந்த முடிவை வெளியிடுவோம். ஒவ்வொரு பிராண்டின் ஆலோசனைக் குழுவும் ஒவ்வொரு காலாண்டும் முன்னேற்றத்தை மறுஆய்வு செய்கிறது.'
                )}
              </p>
            </section>

            {/* Origin · ThinkTN credit (text only, no logo) */}
            <section id="origin" aria-labelledby="evs-origin-h" className="evs-block">
              <p className="eyebrow"><Num n={5} /> · {t('Origin', 'தோற்றம்')}</p>
              <h2 id="evs-origin-h" className="h2">{t('Where the standard comes from', 'தரநிலை எங்கிருந்து வருகிறது')}</h2>
              <p className="body-lg evs-lede">
                {t(
                  'StartNet follows an evidence standard shared with ThinkTN Foundation, an independent non-profit. ThinkTN is not part of StartNet.',
                  'சுதந்திரமான இலாப நோக்கற்ற அமைப்பான ThinkTN Foundation-உடன் பகிர்ந்துகொள்ளும் சான்றுத் தரநிலையை StartNet பின்பற்றுகிறது. ThinkTN, StartNet-இன் ஒரு பகுதி அல்ல.'
                )}
              </p>
              <p className="evs-lede">
                {t(
                  'Once a year we publish where StartNet is falling short: StartNet scores itself.',
                  'ஆண்டுக்கு ஒருமுறை StartNet எங்கே பின்தங்குகிறது என்பதை வெளியிடுகிறோம்: StartNet தன்னைத்தானே மதிப்பிடுகிறது.'
                )}
              </p>
              <p>
                <Link to={localePath('/about/thinktn-alliance')} className="evs-textlink">
                  {t('Read about the ThinkTN alliance and its firewall', 'ThinkTN கூட்டணி பற்றியும் அதன் தடுப்புச்சுவர் பற்றியும் படியுங்கள்')}
                </Link>
              </p>
            </section>
          </div>
        </div>
      </Section>

      <CTABand surface="night"
        title={t('How we count, and what we got wrong.', 'நாங்கள் எப்படிக் கணக்கிடுகிறோம், எங்கே தவறினோம்.')}
        actions={
          <>
            <Button to="/insights/founder-ledger#corrections" size="lg">{corrections}</Button>
            <Button to="/insights/founder-ledger" variant="secondary" size="lg">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}
