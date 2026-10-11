// /insights/founder-ledger/methodology — "How we count" (T19 standard content page, P1).
// Book 1 Part B §2.2 (Methodology: definitions, ladder rules, attribution, tags), Part A §8.6 (evidence and
// corrections policy), Part B §7.1 rule 4 (period slugs), §8 Metric model, §9.5 corrections flow.
// Copy: Book 2 §2.2 (ladder table + attribution rule, verbatim), §2.4 (tag meanings), §2.6 (evidence standard),
// §6.2 (method bullets, reality check). Tag spec: Book 3 Part A §3.7, C15. Evidence room styling: one Night panel.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileWarning, ChevronDown, Check, X as XIcon, ShieldCheck, Clock } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Button, Reveal, RevealGroup, Stat, TagChip, Ladder,
  Accordion, Steps, CTABand, InlineMarks,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { MISSION_TARGET, WOMEN_FLOOR } from '../../insights/ledgerUtils.js';
import {
  LEVELS, TAGS, SOURCE_TYPES, SEVERITIES, REALITY_CHECK, EVIDENCE_LABEL, OUTCOME_TA,
} from './ledgerShared.js';
import { isPlaceholderText } from '../../../components/_placeholders.js';
import { localLabel } from '../insights-reports/shared.js';
import './Methodology.css';

const TOC = [
  { id: 'what-we-count', en: 'What the Ledger counts', ta: 'Ledger எதை எண்ணுகிறது' },
  { id: 'ladder', en: 'The founder ladder', ta: 'நிறுவனர் ஏணி' },
  { id: 'attribution', en: 'The attribution rule', ta: 'பங்களிப்பு விதி' },
  { id: 'tags', en: 'Confidence tags', ta: 'நம்பகத்தன்மைக் குறிகள்' },
  { id: 'sources', en: 'Where figures come from', ta: 'எண்கள் எங்கிருந்து வருகின்றன' },
  { id: 'editions', en: 'Editions and periods', ta: 'பதிப்புகளும் காலங்களும்' },
  { id: 'revisions', en: 'Revisions and corrections', ta: 'மாற்றங்களும் திருத்தங்களும்' },
  { id: 'questions', en: 'Questions', ta: 'கேள்விகள்' },
];

// Book 2 §2.4 Section 1: the measures the Ledger publishes (labels verbatim).
const MEASURES = [
  { en: 'Founders nurtured (L2+), cumulative', ta: 'வளர்க்கப்பட்ட நிறுவனர்கள் (L2+), மொத்தம்', level: 'L2+' },
  { en: 'Startups launched (L5), cumulative', ta: 'தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), மொத்தம்', level: 'L5' },
  { en: 'Capital raised by StartNet founders', ta: 'StartNet நிறுவனர்கள் திரட்டிய முதலீடு', level: 'L6' },
  { en: 'Pilots and contracts signed', ta: 'கையெழுத்தான பைலட்கள் மற்றும் ஒப்பந்தங்கள்', level: null },
  { en: 'Share of participants who are women', ta: 'பங்கேற்பாளர்களில் பெண்களின் பங்கு', level: null },
  { en: 'Districts with active programmes', ta: 'திட்டங்கள் நடைபெறும் மாவட்டங்கள்', level: null },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function TextLink({ to, children }) {
  const { localePath } = useLang();
  return (
    <Link className="method-link" to={localePath(to)}>
      {children} <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

export default function Methodology() {
  const { t, lang } = useLang();
  const { data } = useApi('/api/ledger');
  const ids = useMemo(() => TOC.map((s) => s.id), []);
  const active = useActiveSection(ids);
  const outcomes = Array.isArray(data?.outcomes) ? data.outcomes : [];
  const en = lang === 'ta' ? 'en' : undefined;
  const publishedLbl = localLabel(data?.publishedLabel, data?.publishedLabelTa, lang); // planned-date label in the page language

  const toc = (
    <ol className="method-toc__list">
      {TOC.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className={active === s.id ? 'method-toc__link is-active' : 'method-toc__link'}
            aria-current={active === s.id ? 'location' : undefined}
          >
            <span className="method-toc__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {t(s.en, s.ta)}
          </a>
        </li>
      ))}
    </ol>
  );

  const faq = [
    {
      id: 'faq-l1',
      question: t('Why doesn’t L1 count as nurtured?', 'L1 ஏன் “வளர்க்கப்பட்டவர்” எனக் கணக்கிடப்படுவதில்லை?'),
      answer: t(
        'Attending one event is a start, not support. We track L1 so we can see who comes back, but only Level 2 and above, a StartNet X profile plus at least two meaningful touchpoints, counts towards Mission 1 Lakh.',
        'ஒரு நிகழ்வில் கலந்துகொள்வது ஒரு தொடக்கம் மட்டுமே. யார் மீண்டும் வருகிறார்கள் என்று அறிய L1-ஐப் பதிவு செய்கிறோம்; ஆனால் Level 2 மற்றும் அதற்கு மேல் (StartNet X சுயவிவரமும் குறைந்தது இரண்டு அர்த்தமுள்ள தொடர்புகளும்) மட்டுமே Mission 1 Lakh-இல் கணக்கிடப்படும்.'
      ),
    },
    {
      id: 'faq-company',
      question: t('A founder came to one of your events. Does their company count?', 'ஒரு நிறுவனர் உங்கள் நிகழ்வுக்கு வந்தார். அவரது நிறுவனம் கணக்கில் வருமா?'),
      answer: t(
        'Only if the founder reached L3 in a StartNet programme before the company was registered. We count what we helped create, not every company we met.',
        'நிறுவனம் பதிவு செய்யப்படுவதற்கு முன்பே அந்த நிறுவனர் ஒரு StartNet திட்டத்தில் L3-ஐ எட்டியிருந்தால் மட்டுமே. நாங்கள் சந்தித்த எல்லா நிறுவனங்களையும் அல்ல; நாங்கள் உருவாக உதவியவற்றை மட்டுமே எண்ணுகிறோம்.'
      ),
    },
    {
      id: 'faq-c',
      question: t('Why are C-tagged figures kept apart?', 'C குறியுள்ள எண்கள் ஏன் தனியாக வைக்கப்படுகின்றன?'),
      answer: t(
        'A C figure is an estimate or a planning assumption. Adding it to verified or reported figures would make the total look stronger than the evidence behind it, so C-tagged figures are never summed into A or B.',
        'C எண் ஒரு மதிப்பீடு அல்லது திட்டமிடல் அனுமானம். அதைச் சரிபார்த்த அல்லது தெரிவிக்கப்பட்ட எண்களுடன் கூட்டினால், ஆதாரத்தைவிட மொத்தம் வலுவாகத் தோன்றும். அதனால் C எண்கள் A அல்லது B உடன் ஒருபோதும் கூட்டப்படுவதில்லை.'
      ),
    },
    {
      id: 'faq-names',
      question: t('Will my name appear on the Ledger?', 'என் பெயர் Ledger-இல் வருமா?'),
      answer: t(
        'No. The Ledger publishes counts. Data comes from StartNet X with founders’ consent, and individual founders are never named without their permission.',
        'இல்லை. Ledger எண்ணிக்கைகளை மட்டுமே வெளியிடுகிறது. நிறுவனர்களின் ஒப்புதலுடன் StartNet X-இலிருந்து தரவு வருகிறது; அனுமதியின்றி எந்த நிறுவனரின் பெயரும் வெளியிடப்படாது.'
      ),
    },
    {
      id: 'faq-frequency',
      question: t('How often is the Ledger published?', 'Ledger எவ்வளவு அடிக்கடி வெளியிடப்படுகிறது?'),
      answer: (
        <>
          {/* Without a first-edition label, the "The first edition:" clause is left out (no placeholder). */}
          {data?.publishedLabel && !isPlaceholderText(data.publishedLabel) ? (
            <>
              {t('Every quarter, in English with a Tamil summary. The first edition: ', 'ஒவ்வொரு காலாண்டும், ஆங்கிலத்தில், தமிழ்ச் சுருக்கத்துடன். முதல் பதிப்பு: ')}
              <span lang={publishedLbl.isEn ? 'en' : undefined}><InlineMarks text={publishedLbl.text} /></span>
            </>
          ) : (
            t('Every quarter, in English with a Tamil summary.', 'ஒவ்வொரு காலாண்டும், ஆங்கிலத்தில், தமிழ்ச் சுருக்கத்துடன்.')
          )}
        </>
      ),
    },
  ];

  return (
    <div className="method">
      <Seo
        // SEO-TA: pending native review
        title={t('Founder Ledger methodology: how we count founders', 'Founder Ledger முறை: நாங்கள் எப்படி எண்ணுகிறோம்')}
        description={t(
          'The rules behind every Founder Ledger figure: the L1–L7 founder ladder, the attribution rule, A/B/C confidence tags, sources and corrections.',
          'ஒவ்வொரு Founder Ledger எண்ணுக்கும் பின்னால் உள்ள விதிகள்: L1–L7 நிறுவனர் ஏணி, பங்களிப்பு விதி, A/B/C குறிகள், ஆதாரங்கள், திருத்தங்கள்.'
        )}
      />

      <PageHero
        eyebrow="Founder Ledger"
        title={t('How we count.', 'நாங்கள் எப்படி எண்ணுகிறோம்.')}
        lede={t(
          'The definitions and rules behind every figure in the Founder Ledger: who counts as nurtured, which companies we can claim, what each confidence tag means and how we correct mistakes.',
          'Founder Ledger-இன் ஒவ்வொரு எண்ணுக்கும் பின்னால் உள்ள வரையறைகளும் விதிகளும்: யார் “வளர்க்கப்பட்டவர்”, எந்த நிறுவனங்களை நாங்கள் கணக்கில் சேர்க்கலாம், ஒவ்வொரு நம்பகத்தன்மைக் குறியின் பொருள் என்ன, தவறுகளை எப்படித் திருத்துகிறோம்.'
        )}
        breadcrumbs={[
          { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
          { label: 'Founder Ledger', to: '/insights/founder-ledger' },
          { label: t('How we count', 'நாங்கள் எப்படி எண்ணுகிறோம்') },
        ]}
        actions={
          <>
            <Button to="/insights/founder-ledger" icon={ArrowRight}>
              {t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}
            </Button>
            <Button variant="tertiary" to="/about/evidence-standard">
              {t('Our evidence standard', 'எங்கள் சான்றுத் தரம்')}
            </Button>
          </>
        }
        // Method version and effective date are not supplied yet: the version line is hidden until they are.
        meta={null}
      />

      <Section surface="paper" className="method-body">
        <div className="method-layout">
          <aside className="method-toc" aria-label={t('On this page', 'இந்தப் பக்கத்தில்')}>
            <details className="method-toc__mobile">
              <summary>
                {t('On this page', 'இந்தப் பக்கத்தில்')} <ChevronDown size={18} aria-hidden="true" />
              </summary>
              {toc}
            </details>
            <div className="method-toc__desktop">
              <p className="eyebrow">{t('On this page', 'இந்தப் பக்கத்தில்')}</p>
              {toc}
            </div>
          </aside>

          <div className="method-main">
            {/* 1 · What we count */}
            <section id="what-we-count" className="method-block" aria-labelledby="method-what-title">
              <SectionHeader
                id="method-what-title"
                eyebrow="01"
                title={t('What the Ledger counts', 'Ledger எதை எண்ணுகிறது')}
                lede={t(
                  'Every quarter we publish how many people moved up the founder ladder through StartNet, by brand and district, with a confidence tag on every figure and a log of what we corrected.',
                  'StartNet மூலம் எத்தனை பேர் நிறுவனர் ஏணியில் மேலேறினார்கள் என்பதை, பிராண்டு மற்றும் மாவட்ட வாரியாக, ஒவ்வொரு எண்ணுக்கும் நம்பகத்தன்மைக் குறியுடனும், திருத்தங்களின் பதிவுடனும் ஒவ்வொரு காலாண்டும் வெளியிடுகிறோம்.'
                )}
              />
              <RevealGroup as="ul" className="method-measures" role="list">
                {MEASURES.map((m) => (
                  <li key={m.en} className="method-measures__item">
                    <span className="method-measures__label">{t(m.en, m.ta)}</span>
                    {m.level && <span className="method-measures__level tnum">{m.level}</span>}
                  </li>
                ))}
              </RevealGroup>
              <p className="method-note">
                {t(
                  'Each figure is published with its own A/B/C tag, as-at date and source. We also report the share of launched founders from outside Chennai, Coimbatore and Kancheepuram, and the women share against a 40% floor ',
                  'ஒவ்வொரு எண்ணும் அதன் A/B/C குறி, நிலவரத் தேதி, ஆதாரத்துடன் வெளியிடப்படும். சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த பிற மாவட்டங்களிலிருந்து தொடங்கிய நிறுவனர்களின் பங்கையும், 40% குறைந்தபட்ச இலக்குக்கு எதிராகப் பெண்களின் பங்கையும் தெரிவிக்கிறோம் '
                )}
                <TagChip tag="C" short />.
              </p>
            </section>

            {/* 2 · Ladder */}
            <section id="ladder" className="method-block" aria-labelledby="method-ladder-title">
              <SectionHeader
                id="method-ladder-title"
                eyebrow="02"
                title={t('The founder ladder, L1 to L7', 'நிறுவனர் ஏணி, L1 முதல் L7 வரை')}
                lede={t(
                  'We track progress on seven levels. Only Level 2 and above counts as “nurtured”. A person enters a level when the rule for that level is met.',
                  'ஏழு நிலைகளில் முன்னேற்றத்தைப் பதிவு செய்கிறோம். Level 2 மற்றும் அதற்கு மேல் மட்டுமே “வளர்க்கப்பட்டவர்” எனக் கணக்கிடப்படும். ஒரு நிலைக்கான விதி நிறைவேறும்போது ஒருவர் அந்த நிலைக்குள் நுழைகிறார்.'
                )}
              />
              <Ladder
                variant="vertical"
                className="method-ladder"
                levels={LEVELS.map((l) => ({ code: l.code, name: t(l.name[0], l.name[1]), definition: t(l.rule[0], l.rule[1]) }))}
              />
              <div className="method-table-card">
                <p id="method-ladder-caption" className="method-table__cap">{t('Entry rule for each level', 'ஒவ்வொரு நிலைக்குமான நுழைவு விதி')}</p>
                <div className="method-table-wrap" role="region" aria-labelledby="method-ladder-caption" tabIndex={0}>
                  <table className="method-table" role="table" aria-labelledby="method-ladder-caption">
                    <thead role="rowgroup">
                      <tr role="row">
                        <th scope="col" role="columnheader">{t('Level', 'நிலை')}</th>
                        <th scope="col" role="columnheader">{t('Entry rule', 'நுழைவு விதி')}</th>
                        <th scope="col" role="columnheader">{t('Counted as nurtured', '“வளர்க்கப்பட்டவர்” கணக்கில்')}</th>
                      </tr>
                    </thead>
                    <tbody role="rowgroup">
                      {LEVELS.map((l) => (
                        <tr role="row" key={l.code}>
                          <th scope="row" role="rowheader">
                            <span className="method-table__code tnum">{l.code}</span> {t(l.name[0], l.name[1])}
                          </th>
                          <td role="cell">{t(l.rule[0], l.rule[1])}</td>
                          <td role="cell" data-label={t('Counted as nurtured', '“வளர்க்கப்பட்டவர்” கணக்கில்')}>
                            {l.counted ? (
                              <span className="method-yes"><Check size={16} aria-hidden="true" /> {t('Yes', 'ஆம்')}</span>
                            ) : (
                              <span className="method-no"><XIcon size={16} aria-hidden="true" /> {t('No, tracked only', 'இல்லை, பதிவு மட்டும்')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* "What counts as a meaningful touchpoint: [placeholder]" is hidden until the list is supplied. */}
            </section>

            {/* 3 · Attribution */}
            <section id="attribution" className="method-block" aria-labelledby="method-attr-title">
              <SectionHeader
                id="method-attr-title"
                eyebrow="03"
                title={t('The attribution rule', 'பங்களிப்பு விதி')}
              />
              <Reveal as="blockquote" className="method-rule">
                <p>
                  {t(
                    'A startup counts on our Ledger only if a founder reached L3 in a StartNet programme before the company was registered. We count what we helped create, not every company we met.',
                    'நிறுவனம் பதிவு செய்யப்படுவதற்கு முன்பே, அதன் நிறுவனர் ஒருவர் StartNet திட்டத்தில் L3-ஐ எட்டியிருந்தால் மட்டுமே அந்த ஸ்டார்ட்அப் எங்கள் Ledger-இல் கணக்கிடப்படும். நாங்கள் சந்தித்த எல்லா நிறுவனங்களையும் அல்ல; நாங்கள் உருவாக உதவியவற்றை மட்டுமே எண்ணுகிறோம்.'
                  )}
                </p>
              </Reveal>
              <div className="method-attr">
                <Reveal className="method-attr__case method-attr__case--yes">
                  <p className="method-attr__verdict"><Check size={18} aria-hidden="true" /> {t('Counts', 'கணக்கில் வரும்')}</p>
                  <ol className="method-attr__steps">
                    <li><span className="tnum">L3</span> {t('Founder completes a StartNet programme', 'நிறுவனர் ஒரு StartNet திட்டத்தை நிறைவு செய்கிறார்')}</li>
                    <li><span className="tnum">L5</span> {t('Then the company is registered', 'அதன் பிறகு நிறுவனம் பதிவு செய்யப்படுகிறது')}</li>
                  </ol>
                </Reveal>
                <Reveal className="method-attr__case method-attr__case--no" delay={0.06}>
                  <p className="method-attr__verdict"><XIcon size={18} aria-hidden="true" /> {t('Does not count', 'கணக்கில் வராது')}</p>
                  <ol className="method-attr__steps">
                    <li><span className="tnum">L5</span> {t('The company is already registered', 'நிறுவனம் ஏற்கெனவே பதிவு செய்யப்பட்டுள்ளது')}</li>
                    <li><span className="tnum">L3</span> {t('Later, the founder joins a StartNet programme', 'பின்னர், நிறுவனர் ஒரு StartNet திட்டத்தில் சேர்கிறார்')}</li>
                  </ol>
                  <p className="method-attr__aside">
                    {t(
                      'The founder still appears on the ladder. The company is not claimed as launched through StartNet.',
                      'அந்த நிறுவனர் ஏணியில் இடம்பெறுவார். ஆனால் அந்த நிறுவனம் StartNet மூலம் தொடங்கப்பட்டதாகக் கோரப்படாது.'
                    )}
                  </p>
                </Reveal>
              </div>
            </section>

            {/* 4 · Tags — the one Night panel (evidence room) */}
            <section id="tags" className="method-block method-night" data-surface="night" aria-labelledby="method-tags-title">
              <SectionHeader
                id="method-tags-title"
                eyebrow="04"
                title={t('Confidence tags: A, B and C', 'நம்பகத்தன்மைக் குறிகள்: A, B, C')}
                lede={t(
                  'Every figure shows its source and as-at date, or an A/B/C tag. The tags are designed to work without colour, in print and on any page.',
                  'ஒவ்வொரு எண்ணும் அதன் ஆதாரத்தையும் நிலவரத் தேதியையும், அல்லது A/B/C குறியையும் காட்டும். நிறம் இல்லாமலும், அச்சிலும், எந்தப் பக்கத்திலும் புரியும்படி இக்குறிகள் வடிவமைக்கப்பட்டுள்ளன.'
                )}
              />
              <Reveal as="dl" className="method-tags">
                {TAGS.map((tg) => (
                  <div key={tg.tag} className="method-tags__item">
                    <dt>
                      <TagChip tag={tg.tag} />
                      <span className="method-tags__word">{t(tg.word[0], tg.word[1])}</span>
                    </dt>
                    <dd>
                      <p>{t(tg.meaning[0], tg.meaning[1])}</p>
                      <p className="method-tags__style">{t(tg.style[0], tg.style[1])}</p>
                    </dd>
                  </div>
                ))}
              </Reveal>
              <ul className="method-rules">
                <li>{t('C-tagged figures are never summed into A or B, and C series are never stacked with them in a chart.', 'C எண்கள் A அல்லது B உடன் ஒருபோதும் கூட்டப்படுவதில்லை; வரைபடங்களிலும் அவற்றுடன் அடுக்கப்படுவதில்லை.')}</li>
                <li>{t('StartNet’s own targets and prices are tagged C and labelled “planning assumption”.', 'StartNet-இன் சொந்த இலக்குகளும் விலைகளும் C எனக் குறிக்கப்பட்டு “திட்டமிடல் அனுமானம்” என்று பெயரிடப்படும்.')}</li>
                <li>{t('A and B tags require verification before publication. The evidence committee signs off every figure.', 'A, B குறிகளுக்கு வெளியீட்டுக்கு முன் சரிபார்ப்பு தேவை. ஒவ்வொரு எண்ணுக்கும் சான்றுக் குழு ஒப்புதல் அளிக்கிறது.')}</li>
                <li>{t('Select any tag on the site to see its source, as-at date and method note.', 'தளத்தில் எந்தக் குறியையும் தேர்ந்தெடுத்தால் அதன் ஆதாரம், நிலவரத் தேதி, முறைக் குறிப்பு தெரியும்.')}</li>
              </ul>
              <div className="method-specimens">
                <p className="eyebrow">{t('How a tagged figure looks', 'குறியுள்ள எண் எப்படித் தோன்றும்')}</p>
                <div className="method-specimens__grid">
                  <Stat
                    value={typeof data?.mission?.target === 'number' ? data.mission.target : MISSION_TARGET}
                    label={t('Founders nurtured (L2+) by March 2031, target', 'மார்ச் 2031-க்குள் வளர்க்கப்பட வேண்டிய நிறுவனர்கள் (L2+), இலக்கு')}
                    tag="C"
                    source={t('StartNet plan, Mission 1 Lakh', 'StartNet திட்டம், Mission 1 Lakh')}
                    note={t('Planning assumption', 'திட்டமிடல் அனுமானம்')}
                  />
                  <Stat
                    value={typeof data?.womenShare?.floor === 'number' ? data.womenShare.floor : WOMEN_FLOOR}
                    unit="%"
                    label={t('Floor for women across all StartNet programmes, target', 'அனைத்து StartNet திட்டங்களிலும் பெண்களுக்கான குறைந்தபட்சப் பங்கு, இலக்கு')}
                    tag="C"
                    source={t('StartNet plan', 'StartNet திட்டம்')}
                    note={t('Planning assumption', 'திட்டமிடல் அனுமானம்')}
                  />
                </div>
              </div>
            </section>

            {/* 5 · Sources */}
            <section id="sources" className="method-block" aria-labelledby="method-sources-title">
              <SectionHeader
                id="method-sources-title"
                eyebrow="05"
                title={t('Where the figures come from', 'எண்கள் எங்கிருந்து வருகின்றன')}
                lede={t(
                  'Data comes from StartNet X with founders’ consent. Individual founders are never named without their permission.',
                  'நிறுவனர்களின் ஒப்புதலுடன் StartNet X-இலிருந்து தரவு வருகிறது. அனுமதியின்றி எந்த நிறுவனரின் பெயரும் வெளியிடப்படாது.'
                )}
              />
              <Reveal as="dl" className="method-sources">
                {SOURCE_TYPES.map((s) => (
                  <div key={s.key} className="method-sources__item">
                    <dt>{t(s.label[0], s.label[1])}</dt>
                    <dd>{t(s.body[0], s.body[1])}</dd>
                  </div>
                ))}
              </Reveal>
              {outcomes.length > 0 && (
                <div className="method-table-card">
                  <p id="method-evidence-caption" className="method-table__cap">{t('Evidence type for each Ledger outcome', 'ஒவ்வொரு Ledger விளைவுக்குமான சான்று வகை')}</p>
                  <div className="method-table-wrap" role="region" aria-labelledby="method-evidence-caption" tabIndex={0}>
                    <table className="method-table" role="table" aria-labelledby="method-evidence-caption">
                      <thead role="rowgroup">
                        <tr role="row">
                          <th scope="col" role="columnheader">{t('Outcome', 'விளைவு')}</th>
                          <th scope="col" role="columnheader">{t('Evidence type', 'சான்று வகை')}</th>
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        {outcomes.map((o) => {
                          const label = String(o.label || '');
                          const ev = EVIDENCE_LABEL[String(o.evidence || '').toLowerCase()];
                          return (
                            <tr role="row" key={label}>
                              <th scope="row" role="rowheader">{t(label, OUTCOME_TA[label.toLowerCase()])}</th>
                              <td role="cell" data-label={t('Evidence type', 'சான்று வகை')}>{ev ? t(ev[0], ev[1]) : o.evidence || '–'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <p className="method-note">
                {t(
                  'Founder stories need written consent. Figures from other bodies always name the publisher and the date.',
                  'நிறுவனர் கதைகளுக்கு எழுத்துப்பூர்வ ஒப்புதல் தேவை. பிற அமைப்புகளின் எண்கள் எப்போதும் வெளியீட்டாளர் பெயரையும் தேதியையும் குறிப்பிடும்.'
                )}{' '}
                <TextLink to="/legal/privacy">{t('Read our privacy notice', 'எங்கள் தனியுரிமை அறிவிப்பைப் படியுங்கள்')}</TextLink>
              </p>
            </section>

            {/* 6 · Editions */}
            <section id="editions" className="method-block" aria-labelledby="method-editions-title">
              <SectionHeader
                id="method-editions-title"
                eyebrow="06"
                title={t('Editions and periods', 'பதிப்புகளும் காலங்களும்')}
              />
              <dl className="method-facts">
                <div>
                  <dt>{t('Cadence', 'கால இடைவெளி')}</dt>
                  <dd>{t('Quarterly, in English with a Tamil summary.', 'காலாண்டுக்கு ஒருமுறை, ஆங்கிலத்தில், தமிழ்ச் சுருக்கத்துடன்.')}</dd>
                </div>
                <div>
                  <dt>{t('Periods', 'காலங்கள்')}</dt>
                  <dd>
                    {/* The "Months in each quarter: [placeholder]" clause is left out until StartNet confirms the mapping. */}
                    {t(
                      'Financial-year quarters. Each edition has its own address, for example /insights/founder-ledger/2026-q4.',
                      'நிதியாண்டுக் காலாண்டுகள். ஒவ்வொரு பதிப்புக்கும் தனி முகவரி உண்டு; உதாரணமாக /insights/founder-ledger/2026-q4.'
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{t('As-at date', 'நிலவரத் தேதி')}</dt>
                  <dd>{t('Every edition and every figure states the date its count was taken.', 'ஒவ்வொரு பதிப்பும் ஒவ்வொரு எண்ணும், அந்த எண்ணிக்கை எடுக்கப்பட்ட தேதியைக் குறிப்பிடும்.')}</dd>
                </div>
                <div>
                  <dt>{t('Sign-off', 'ஒப்புதல்')}</dt>
                  <dd>{t('The evidence committee signs off every edition before it is published.', 'ஒவ்வொரு பதிப்பும் வெளியிடப்படும் முன் சான்றுக் குழு ஒப்புதல் அளிக்கிறது.')}</dd>
                </div>
                {/* First edition: shown with whatever is known (edition name, planned date); hidden when neither is. */}
                {(data?.edition || (data?.publishedLabel && !isPlaceholderText(data.publishedLabel))) && (
                  <div>
                    <dt>{t('First edition', 'முதல் பதிப்பு')}</dt>
                    <dd>
                      {data?.edition ? <span lang={en}>{data.edition}</span> : null}
                      {data?.edition && data?.publishedLabel && !isPlaceholderText(data.publishedLabel) ? ' · ' : ''}
                      {data?.publishedLabel && !isPlaceholderText(data.publishedLabel) ? (
                        <span lang={publishedLbl.isEn ? 'en' : undefined}><InlineMarks text={publishedLbl.text} /></span>
                      ) : null}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {/* 7 · Revisions */}
            <section id="revisions" className="method-block" aria-labelledby="method-rev-title">
              <SectionHeader
                id="method-rev-title"
                eyebrow="07"
                title={t('Revisions and corrections', 'மாற்றங்களும் திருத்தங்களும்')}
                lede={t(
                  'Past editions are frozen. When a published figure turns out to be wrong, we correct it with a dated note and a log entry, and the old snapshot stays as it was.',
                  'பழைய பதிப்புகள் மாற்றப்படுவதில்லை. வெளியிட்ட எண் தவறு எனத் தெரிந்தால், தேதியிட்ட குறிப்புடனும் பதிவேட்டுப் பதிவுடனும் திருத்துவோம்; பழைய பதிப்பு அப்படியே இருக்கும்.'
                )}
              />
              <Steps
                className="method-steps"
                steps={[
                  {
                    icon: FileWarning,
                    title: t('You report it', 'நீங்கள் தெரிவிக்கிறீர்கள்'),
                    body: t('Which figure, what is wrong, an evidence link or file, and a contact if you want a reply.', 'எந்த எண், என்ன தவறு, ஆதார இணைப்பு அல்லது கோப்பு, பதில் வேண்டுமெனில் தொடர்பு விவரம்.'),
                  },
                  {
                    icon: ShieldCheck,
                    title: t('The evidence committee checks it', 'சான்றுக் குழு சரிபார்க்கிறது'),
                    body: t('If it is not valid and you left a contact, we reply with the reason.', 'செல்லாது எனில், நீங்கள் தொடர்பு விவரம் அளித்திருந்தால், காரணத்துடன் பதில் அளிப்போம்.'),
                  },
                  {
                    icon: Clock,
                    title: t('We publish the correction', 'திருத்தத்தை வெளியிடுகிறோம்'),
                    body: t('Within 14 days on the corrections log: date, severity, what changed. The figure shows a “Corrected” badge.', '14 நாட்களுக்குள் திருத்தங்கள் பதிவில்: தேதி, தீவிரம், என்ன மாறியது. அந்த எண்ணில் “திருத்தப்பட்டது” என்ற குறி தோன்றும்.'),
                  },
                ]}
              />
              <div className="method-sev">
                <p className="method-sev__label">{t('Severity levels', 'தீவிர நிலைகள்')}</p>
                <ul className="method-sev__list" role="list">
                  {SEVERITIES.map((s) => (
                    <li key={s.key} className={`method-sev__item method-sev__item--${s.key}`}>{t(s.label[0], s.label[1])}</li>
                  ))}
                </ul>
              </div>
              <Reveal as="blockquote" className="method-reality">
                <p className="eyebrow">{t('Definitions do not move', 'வரையறைகள் மாறாது')}</p>
                <p>{t(REALITY_CHECK[0], REALITY_CHECK[1])}</p>
              </Reveal>
              {/* "Changes to this method: [placeholder]" is hidden until the change log is supplied. */}
              <div className="method-actions cluster">
                <Button to="/contact?topic=correction" icon={FileWarning}>
                  {t('Report a correction', 'திருத்தத்தைத் தெரிவிக்கவும்')}
                </Button>
                <TextLink to="/insights/founder-ledger/corrections">{t('Full corrections log', 'முழுத் திருத்தங்கள் பதிவு')}</TextLink>
              </div>
            </section>

            {/* 8 · FAQ */}
            <section id="questions" className="method-block" aria-labelledby="method-faq-title">
              <SectionHeader id="method-faq-title" eyebrow="08" title={t('Questions', 'கேள்விகள்')} />
              <Accordion items={faq} faq />
            </section>
          </div>
        </div>
      </Section>

      <CTABand
        surface="paper"
        title={t('See the method at work', 'இந்த முறை செயல்படுவதைப் பாருங்கள்')}
        body={t(
          'The Founder Ledger applies these rules to every figure, every quarter.',
          'Founder Ledger இந்த விதிகளை ஒவ்வொரு காலாண்டும், ஒவ்வொரு எண்ணுக்கும் பயன்படுத்துகிறது.'
        )}
        actions={
          <>
            <Button to="/insights/founder-ledger" icon={ArrowRight}>
              {t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}
            </Button>
            <Button variant="tertiary" to="/insights/newsletter?topic=ledger">
              {t('Get the quarterly Ledger', 'காலாண்டு Ledger-ஐப் பெறுங்கள்')}
            </Button>
          </>
        }
      />
    </div>
  );
}
