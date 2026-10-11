// /about/self-diagnosis · "StartNet scores itself" (T07 Report, P3).
// Book 1 Part B §2.2 (purpose, audience: investors and government, CTA: Download) and Part A §4.4
// ("Self-diagnosis … StartNet scores itself, including where it is falling short"); Book 2 §2.4 section 3–4
// and §2.6 (stopping rules, bias audits "published in our self-diagnosis"); Book 3 Part B §4 T07
// (8/4 with chapter nav + reading progress; sponsor disclosure in its own band after methodology).
// Data: /api/reports/self-diagnosis-2027, /api/metrics?key=…, /api/reports (related).
// The first edition is not published: every result is a placeholder; targets are tag C as in the books.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, Scale, ShieldCheck } from 'lucide-react';
import {
  Seo,
  PageHero,
  Section,
  SectionHeader,
  Button,
  Badge,
  Stat,
  TagChip,
  Placeholder,
  Reveal,
  RevealGroup,
  ReportCard,
  SmartForm,
  Skeleton,
  KeyFacts,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { useApi } from '../../../hooks/useApi.js';
import { usePillIndicator, useActiveSection } from '../../about/shared.jsx';
import './SelfDiagnosis.css';
import { ORG_REF } from '../../../lib/seo.js';
import { pageLd } from '../../brands/seoBits.js';

const REPORT_SLUG = 'self-diagnosis-2027';

const METRIC_KEYS = [
  'founders-nurtured',
  'nurtured-target-mar-2027',
  'startups-launched',
  'capital-raised',
  'pilots-signed',
  'women-share',
  'women-floor-target',
  'districts-active',
  'districts-target-fy27',
];

// Metric labels in both languages (the API's metric labels are English only).
const METRIC_LABELS = {
  'founders-nurtured': ['Founders nurtured (L2+) to date', 'இதுவரை வளர்க்கப்பட்ட நிறுவனர்கள் (L2+)'],
  'nurtured-target-mar-2027': ['Nurtured founders (L2+) by March 2027', 'மார்ச் 2027-க்குள் வளர்க்கப்பட்ட நிறுவனர்கள் (L2+)'],
  'startups-launched': ['Startups launched (L5), cumulative', 'தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), மொத்தம்'],
  'capital-raised': ['Capital raised by StartNet founders', 'StartNet நிறுவனர்கள் திரட்டிய முதலீடு'],
  'pilots-signed': ['Pilots and contracts signed', 'கையெழுத்தான முன்னோட்டங்களும் ஒப்பந்தங்களும்'],
  'women-share': ['Share of participants who are women', 'பங்கேற்பாளர்களில் பெண்களின் பங்கு'],
  'women-floor-target': ['Floor for women across all StartNet programmes', 'அனைத்து StartNet திட்டங்களிலும் பெண்களுக்கான குறைந்தபட்ச அளவு'],
  'districts-active': ['Districts with active programmes', 'செயல்பாட்டில் உள்ள திட்டங்களைக் கொண்ட மாவட்டங்கள்'],
  'districts-target-fy27': ['Districts in FY27', 'FY27-இல் மாவட்டங்கள்'],
};

const CHAPTERS = [
  { id: 'sd-measures', en: 'What we measure', ta: 'நாங்கள் அளவிடுபவை' },
  { id: 'sd-scorecard', en: 'Scorecard', ta: 'மதிப்பெண் அட்டை' },
  { id: 'sd-falling-short', en: 'Where we fall short', ta: 'நாங்கள் பின்தங்கும் இடங்கள்' },
  { id: 'sd-method', en: 'Method', ta: 'முறை' },
  { id: 'sd-sponsor', en: 'Funding disclosure', ta: 'நிதி வெளிப்படுத்தல்' },
  { id: 'sd-download', en: 'Download', ta: 'பதிவிறக்கம்' },
];

/** Reading progress through the report body (0–1), scroll-linked, rAF-throttled. */
function useReadingProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.5;
      const done = Math.min(Math.max(-r.top + window.innerHeight * 0.25, 0), Math.max(total, 1));
      setP(total > 0 ? done / total : 0);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
  return p;
}

function Chapter({ id, n, title, children, className }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`sd-chapter${className ? ` ${className}` : ''}`}>
      <Reveal className="sd-chapter__head">
        <p className="sd-chapter__n tnum" aria-hidden="true">{String(n).padStart(2, '0')}</p>
        <h2 id={`${id}-h`} className="h3 sd-chapter__title">{title}</h2>
      </Reveal>
      <div className="sd-chapter__body">{children}</div>
    </section>
  );
}

export default function SelfDiagnosis() {
  const { t, lang, localePath } = useLang();
  const bodyRef = useRef(null);
  // Robust scroll-spy (computed from every chapter, so jumping back to the top resets it).
  const active = useActiveSection(CHAPTERS.map((c) => c.id));
  const progress = useReadingProgress(bodyRef);
  const barListRef = useRef(null);
  usePillIndicator(barListRef, '[aria-current]', [active]);
  // Phones: the chapter row scrolls sideways; keep the active chapter in view (scrolls the row only, never the page).
  const barScrollRef = useRef(null);
  useEffect(() => {
    const row = barScrollRef.current;
    const link = row?.querySelector('[aria-current]');
    if (!row || !link || row.scrollWidth <= row.clientWidth) return;
    const rr = row.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    const left = row.scrollLeft + (r.left - rr.left) - (rr.width - r.width) / 2;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.dataset.motion === 'reduced';
    row.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
  }, [active]);

  const { data: report } = useApi(`/api/reports/${REPORT_SLUG}`);
  const { data: metricList, loading: metricsLoading } = useApi(`/api/metrics?key=${METRIC_KEYS.join(',')}`);
  const { data: allReports } = useApi('/api/reports');

  const M = {};
  (Array.isArray(metricList) ? metricList : []).forEach((m) => {
    M[m.key || m.id] = m;
  });
  const mLabel = (key) => (METRIC_LABELS[key] ? t(METRIC_LABELS[key][0], METRIC_LABELS[key][1]) : M[key]?.label);
  // Every number through <Stat>; a missing metric renders as a B-tagged placeholder, never a made-up value.
  const metricOr = (key) =>
    M[key] ? (
      <Stat metric={M[key]} label={mLabel(key)} variant="compact" />
    ) : (
      <Stat value={null} label={mLabel(key)} tag="B" variant="compact" />
    );
  // Missing figures are not shown as placeholders: an empty table cell is a dash, an empty stat is left out.
  const hasMetric = (key) => !!M[key] && M[key].value != null;
  const targetOr = (key) => (hasMetric(key) ? <Stat metric={M[key]} label={mLabel(key)} variant="compact" /> : '–');
  // Server status label is English ("Planned · October 2027 [placeholder …]"); show it in Tamil on /ta.
  const statusEn = report?.statusLabel ? report.statusLabel.replace(/\s*\[placeholder[^\]]*\]/, '').trim() : '';
  const STATUS_TA = { 'Planned · October 2027': 'திட்டமிடப்பட்டது · அக்டோபர் 2027' };

  const related = (Array.isArray(allReports) ? allReports : []).filter((r) => r.slug !== REPORT_SLUG).slice(0, 3);
  const formats = Array.isArray(report?.formats) ? report.formats : [];

  // Scorecard rows: commitment · target or rule · result · status. Results stay placeholders until the first edition.
  const ROWS = [
    {
      id: 'women',
      commitment: t('Women across all programmes', 'அனைத்துத் திட்டங்களிலும் பெண்கள்'),
      target: targetOr('women-floor-target'),
      result: hasMetric('women-share') ? metricOr('women-share') : null,
    },
    {
      id: 'nurtured',
      commitment: t('Founders nurtured (L2+)', 'வளர்க்கப்பட்ட நிறுவனர்கள் (L2+)'),
      target: targetOr('nurtured-target-mar-2027'),
      result: hasMetric('founders-nurtured') ? metricOr('founders-nurtured') : null,
    },
    {
      id: 'districts',
      commitment: t('Districts with active programmes', 'செயல்பாட்டில் உள்ள திட்டங்களைக் கொண்ட மாவட்டங்கள்'),
      target: targetOr('districts-target-fy27'),
      result: hasMetric('districts-active') ? metricOr('districts-active') : null,
    },
    {
      id: 'district-promise',
      commitment: t('District promise', 'மாவட்ட வாக்குறுதி'),
      target: t(
        'Report the share of launched founders from outside Chennai, Coimbatore and Kancheepuram.',
        'சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த மாவட்டங்களிலிருந்து தொடங்கிய நிறுவனர்களின் பங்கை வெளியிடுவது.'
      ),
      result: null,
    },
    {
      id: 'stopping',
      commitment: t('Stopping rules', 'நிறுத்த விதிகள்'),
      target: t(
        'Every lab, programme and event series has a named owner and a written stopping condition. When we use it, we say so.',
        'ஒவ்வொரு ஆய்வகம், திட்டம், நிகழ்வுத் தொடருக்கும் பெயரிடப்பட்ட பொறுப்பாளரும் எழுதப்பட்ட நிறுத்த நிபந்தனையும் உண்டு. அதைப் பயன்படுத்தும்போது வெளிப்படையாகச் சொல்கிறோம்.'
      ),
      result: null,
    },
    {
      id: 'labs',
      commitment: t('StartNet Labs', 'StartNet Labs'),
      target: t(
        'A Lab that forms no company in 24 months closes or pivots, and we publish the decision.',
        '24 மாதங்களில் எந்த நிறுவனத்தையும் உருவாக்காத Lab மூடப்படும் அல்லது திசை மாறும்; அந்த முடிவை வெளியிடுவோம்.'
      ),
      result: null,
    },
    {
      id: 'bias',
      commitment: t('AI bias audits', 'AI சார்புத் தணிக்கைகள்'),
      target: t(
        'Each quarter, by gender, district, language and college tier.',
        'ஒவ்வொரு காலாண்டும், பாலினம், மாவட்டம், மொழி, கல்லூரி நிலை வாரியாக.'
      ),
      result: null,
    },
    {
      id: 'corrections',
      commitment: t('Corrections', 'திருத்தங்கள்'),
      target: t(
        'Every error goes in the public corrections log, dated and graded by severity.',
        'ஒவ்வொரு பிழையும் தேதியுடனும் தீவிர நிலையுடனும் பொதுத் திருத்தப் பதிவேட்டில் சேர்க்கப்படும்.'
      ),
      result: null,
    },
  ];
  // The Result column shows once any result is published; the Status column (on track / falling short) is not
  // supplied yet, so it is hidden.
  const anyResult = ROWS.some((r) => r.result != null);

  const MEASURES = [
    {
      title: t('Outcomes, not attendance', 'வருகை அல்ல, விளைவுகள்'),
      body: t(
        'How many people moved up the founder ladder, what they built and what they raised: founders nurtured (L2+), startups launched (L5), capital raised, pilots and contracts signed.',
        'எத்தனை பேர் நிறுவனர் ஏணியில் மேலே சென்றார்கள், என்ன உருவாக்கினார்கள், எவ்வளவு திரட்டினார்கள்: வளர்க்கப்பட்ட நிறுவனர்கள் (L2+), தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), திரட்டிய முதலீடு, கையெழுத்தான முன்னோட்டங்களும் ஒப்பந்தங்களும்.'
      ),
      stats: ['founders-nurtured', 'startups-launched', 'capital-raised', 'pilots-signed'],
    },
    {
      title: t('Who we reach', 'யாரை அடைகிறோம்'),
      body: t(
        'Whether we hold the 40% floor for women, and how far we reach beyond Chennai, Coimbatore and Kancheepuram.',
        'பெண்களுக்கான 40% அடித்தளத்தைக் காக்கிறோமா, சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தாண்டி எவ்வளவு தூரம் சென்றடைகிறோம் என்பது.'
      ),
      stats: ['women-share', 'districts-active'],
    },
    {
      title: t('How we decide', 'எப்படி முடிவெடுக்கிறோம்'),
      body: t(
        'Which programmes met their stopping condition and what we did about it, and what the quarterly AI bias audits found.',
        'எந்தத் திட்டங்கள் தங்கள் நிறுத்த நிபந்தனையை எட்டின, அதற்கு என்ன செய்தோம், காலாண்டு AI சார்புத் தணிக்கைகள் என்ன கண்டறிந்தன என்பது.'
      ),
      stats: [],
    },
    {
      title: t('How honest our numbers are', 'எங்கள் எண்கள் எவ்வளவு நேர்மையானவை'),
      body: t(
        'How many figures we corrected and how serious each error was, and how our own planning targets (tag C) compare with what happened.',
        'எத்தனை எண்களைத் திருத்தினோம், ஒவ்வொரு பிழையும் எவ்வளவு தீவிரமானது, எங்கள் திட்ட இலக்குகள் (C குறி) நடந்தவற்றுடன் எப்படி ஒப்பிடுகின்றன என்பது.'
      ),
      stats: [],
    },
  ];

  return (
    <div className="sd">
      {/* SEO: primary "StartNet self-diagnosis report". SEO-TA: pending native review */}
      <Seo
        title={t('Self-diagnosis report: where StartNet falls short', 'சுய மதிப்பீட்டு அறிக்கை: StartNet எங்கே பின்தங்குகிறது')}
        description={t(
          'Once a year StartNet scores itself against its own commitments, including where it falls short: outcomes, the 40% floor for women and the district promise.',
          'ஆண்டுக்கு ஒருமுறை StartNet தன் வாக்குறுதிகளுக்கு எதிராகத் தன்னையே மதிப்பிடுகிறது: விளைவுகள், பெண்களுக்கான 40% அடித்தளம், மாவட்ட வாக்குறுதி.'
        )}
        jsonLd={pageLd({
          path: '/about/self-diagnosis',
          lang,
          type: 'AboutPage',
          name: t('Self-diagnosis report', 'சுய மதிப்பீட்டு அறிக்கை'),
          description: t(
            'Once a year StartNet scores itself against its own commitments, including where it falls short.',
            'ஆண்டுக்கு ஒருமுறை StartNet தன் வாக்குறுதிகளுக்கு எதிராகத் தன்னையே மதிப்பிடுகிறது.'
          ),
          about: ORG_REF,
        })}
      />

      <PageHero
        breadcrumbs={[
          { label: t('Who we are', 'நாங்கள் யார்'), to: '/about' },
          { label: t('Self-diagnosis report', 'சுய மதிப்பீட்டு அறிக்கை') },
        ]}
        eyebrow={t('Annual self-diagnosis', 'ஆண்டு சுய மதிப்பீடு')}
        title={t('StartNet scores itself.', 'StartNet தன்னைத் தானே மதிப்பிடுகிறது.')}
        titleClass="display-xl sd-hero__title"
        lede={t(
          'Once a year we publish where StartNet is falling short, against the same evidence standard we use for every other number.',
          'ஒவ்வொரு ஆண்டும், மற்ற எல்லா எண்களுக்கும் பயன்படுத்தும் அதே சான்றுத் தரத்தின்படி, StartNet எங்கே பின்தங்குகிறது என்பதை வெளியிடுகிறோம்.'
        )}
        actions={
          <>
            <Button href="#sd-download" size="lg" icon={Download}>
              {t('Download', 'பதிவிறக்குங்கள்')}
            </Button>
            <Button to="/about/governance" variant="tertiary">
              {t('Governance & kill criteria', 'நிர்வாகமும் நிறுத்த விதிகளும்')}
            </Button>
          </>
        }
        art={{ variant: 'dot', ratio: '4/5', seed: 27, label: t('Self-diagnosis · cover', 'சுய மதிப்பீடு · அட்டை') }}
      />

      {/* One sheet holds the sticky chapter bar and the report body, so the bar sticks without the sheet's top padding. */}
      <div className="sd-sheet">
        {/* Sticky chapter bar with reading progress (T07 "chapter nav + reading progress"). */}
        <nav className="sd-bar" aria-label={t('Chapters', 'அத்தியாயங்கள்')}>
          <div className="container sd-bar__inner" ref={barScrollRef}>
            <ol className="sd-bar__list segmented" ref={barListRef}>
              {CHAPTERS.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className={`sd-bar__link segmented__item${active === c.id ? ' is-active' : ''}`}
                    aria-current={active === c.id ? 'location' : undefined}
                  >
                    <span className="sd-bar__n tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span>{t(c.en, c.ta)}</span>
                  </a>
                </li>
              ))}
              <li className="about-pill__ind" aria-hidden="true" />
            </ol>
          </div>
          <span className="sd-bar__progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
        </nav>

        <div ref={bodyRef}>
        <Section width="default" className="sd-layout-section">
          <div className="sd-layout">
            <div className="sd-layout__side">
              <KeyFacts
                title={t('At a glance', 'சுருக்கமாக')}
                items={[
                  { label: t('Status', 'நிலை'), value: <Badge kind="status" status="upcoming" /> },
                  {
                    label: t('First edition', 'முதல் பதிப்பு'),
                    value: <Placeholder>{t('[placeholder — first edition date]', '[placeholder — முதல் பதிப்புத் தேதி]')}</Placeholder>,
                  },
                  { label: t('Frequency', 'கால இடைவெளி'), value: t('Once a year', 'ஆண்டுக்கு ஒருமுறை') },
                  { label: t('Languages', 'மொழிகள்'), value: t('English and Tamil', 'ஆங்கிலம், தமிழ்') },
                  { label: t('Figures signed off by', 'எண்களை அங்கீகரிப்பது'), value: t('The evidence committee', 'சான்றுக் குழு') },
                ]}
                action={
                  <Button href="#sd-download" variant="secondary" icon={Download} full>
                    {t('Download', 'பதிவிறக்குங்கள்')}
                  </Button>
                }
              />
            </div>
            <div className="sd-layout__main">
              {/* Summary */}
              <Reveal className="sd-summary">
                <p className="body-lg">
                  {report?.summary
                    ? t(report.summary, 'ஆண்டுக்கு ஒருமுறை StartNet எங்கே பின்தங்குகிறது என்பதை வெளியிடுகிறோம்; பாலினம், மாவட்டம், மொழி, கல்லூரி நிலை வாரியான காலாண்டு AI சார்புத் தணிக்கைகள் உட்பட.')
                    : t(
                        'Once a year we publish where StartNet is falling short, including quarterly AI bias audits by gender, district, language and college tier.',
                        'ஆண்டுக்கு ஒருமுறை StartNet எங்கே பின்தங்குகிறது என்பதை வெளியிடுகிறோம்; பாலினம், மாவட்டம், மொழி, கல்லூரி நிலை வாரியான காலாண்டு AI சார்புத் தணிக்கைகள் உட்பட.'
                      )}
                </p>
                {/* Status line without the "[first edition date]" chip; hidden when there is no status label. */}
                {statusEn ? (
                  <p className="sd-summary__status">
                    {t('Status: ', 'நிலை: ')}
                    {lang === 'ta' && STATUS_TA[statusEn] ? (
                      <span>{STATUS_TA[statusEn]}</span>
                    ) : (
                      <span lang={lang === 'ta' ? 'en' : undefined}>{statusEn}</span>
                    )}
                  </p>
                ) : null}
              </Reveal>

              <Chapter id="sd-measures" n={1} title={t('What we measure about ourselves', 'எங்களைப் பற்றி நாங்கள் அளவிடுபவை')}>
                <RevealGroup className="sd-measures">
                  {MEASURES.map((m) => (
                    <article key={m.title} className="sd-measure">
                      <h3 className="h5 sd-measure__title">{m.title}</h3>
                      <p className="sd-measure__body">{m.body}</p>
                      {/* Only figures that have a value are shown (no placeholder stats). */}
                      {(metricsLoading ? m.stats.length > 0 : m.stats.some(hasMetric)) && (
                        <div className="sd-measure__stats">
                          {metricsLoading ? (
                            <Skeleton height="3rem" />
                          ) : (
                            m.stats.filter(hasMetric).map((k) => (
                              <div key={k} className="sd-measure__stat">
                                {metricOr(k)}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </RevealGroup>
              </Chapter>
            </div>
          </div>
        </Section>

        {/* Scorecard: the page's one Night band (evidence) */}
        <Section surface="night" id="sd-scorecard" labelledBy="sd-scorecard-h">
          <div className="sd-scorecard">
            <SectionHeader
              id="sd-scorecard-h"
              eyebrow={t('Chapter 02 · Kill criteria scorecard', 'அத்தியாயம் 02 · நிறுத்த விதி மதிப்பெண் அட்டை')}
              title={t('Our commitments, and how we did', 'எங்கள் உறுதிமொழிகளும், எப்படிச் செய்தோம் என்பதும்')}
              lede={t(
                'Targets are our own planning assumptions, tagged C. Results come from the Founder Ledger and are filled in when the first edition is published.',
                'இலக்குகள் எங்கள் சொந்தத் திட்ட அனுமானங்கள், C எனக் குறிக்கப்பட்டவை. முடிவுகள் Founder Ledger-இலிருந்து, முதல் பதிப்பு வெளியானதும் நிரப்பப்படும்.'
              )}
            />
            <div className="sd-table-wrap" role="region" aria-labelledby="sd-scorecard-h" tabIndex={0}>
              <table className="sd-table">
                <caption className="visually-hidden">
                  {t('Self-diagnosis scorecard: commitment, target or rule, result and status', 'சுய மதிப்பீட்டு அட்டை: உறுதிமொழி, இலக்கு அல்லது விதி, முடிவு, நிலை')}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t('Commitment', 'உறுதிமொழி')}</th>
                    <th scope="col">{t('Target or rule', 'இலக்கு அல்லது விதி')}</th>
                    {anyResult && <th scope="col">{t('Result', 'முடிவு')}</th>}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id}>
                      <th scope="row">{r.commitment}</th>
                      <td data-label={t('Target or rule', 'இலக்கு அல்லது விதி')}>{r.target}</td>
                      {anyResult && <td data-label={t('Result', 'முடிவு')}>{r.result ?? '–'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sd-scorecard__legend">
              <TagChip tag="A" /> {t('verified against a primary source', 'முதன்மை ஆதாரத்துடன் சரிபார்க்கப்பட்டது')}
              <span className="sd-scorecard__sep" aria-hidden="true">·</span>
              <TagChip tag="B" /> {t('reported by the founder or organisation', 'நிறுவனர் அல்லது அமைப்பு தெரிவித்தது')}
              <span className="sd-scorecard__sep" aria-hidden="true">·</span>
              <TagChip tag="C" /> {t('an estimate or planning assumption', 'மதிப்பீடு அல்லது திட்ட அனுமானம்')}
            </p>
          </div>
        </Section>

        <Section>
          <div className="sd-layout sd-layout--tail">
            <div className="sd-layout__main">
              <Chapter id="sd-falling-short" n={3} title={t('Where we are falling short', 'நாங்கள் பின்தங்கும் இடங்கள்')}>
                <p className="body-lg">
                  {t(
                    'This chapter names the commitments we missed, why, and what we are changing.',
                    'தவறவிட்ட உறுதிமொழிகள், ஏன், என்ன மாற்றுகிறோம் என்பதை இந்த அத்தியாயம் பெயரிட்டுச் சொல்கிறது.'
                  )}
                </p>
                {/* Findings callout: hidden until the first edition supplies the findings. */}
              </Chapter>

              <Chapter id="sd-method" n={4} title={t('How we score ourselves', 'எங்களை எப்படி மதிப்பிடுகிறோம்')}>
                <ul className="sd-checklist">
                  <li>
                    {t(
                      'Every figure shows its source and as-at date, or an A/B/C tag. Our own prices and targets are tagged C.',
                      'ஒவ்வொரு எண்ணும் அதன் ஆதாரம், தேதி அல்லது A/B/C குறியைக் காட்டும். எங்கள் விலைகளும் இலக்குகளும் C எனக் குறிக்கப்படும்.'
                    )}
                  </li>
                  <li>
                    {t(
                      'C-tagged figures are shown separately and never summed with A or B. Past editions are frozen.',
                      'C குறி எண்கள் தனியாகக் காட்டப்படும்; A அல்லது B உடன் ஒருபோதும் கூட்டப்படாது. கடந்த பதிப்புகள் மாற்றப்படாது.'
                    )}
                  </li>
                  <li>
                    {t(
                      'The evidence committee signs off every figure, Ledger edition and correction.',
                      'ஒவ்வொரு எண், Ledger பதிப்பு, திருத்தத்தையும் சான்றுக் குழு அங்கீகரிக்கிறது.'
                    )}
                  </li>
                  <li>
                    {t(
                      'Errors go in the public corrections log, dated and graded by severity.',
                      'பிழைகள் தேதியுடனும் தீவிர நிலையுடனும் பொதுத் திருத்தப் பதிவேட்டில் சேர்க்கப்படும்.'
                    )}
                  </li>
                </ul>
                <div className="sd-links">
                  <Link className="sd-link" to={localePath('/about/evidence-standard')}>
                    <ShieldCheck size={18} aria-hidden="true" />
                    {t('Read the evidence standard', 'சான்றுத் தரத்தைப் படியுங்கள்')}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link className="sd-link" to={localePath('/about/governance')}>
                    <Scale size={18} aria-hidden="true" />
                    {t('Governance & kill criteria', 'நிர்வாகமும் நிறுத்த விதிகளும்')}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link className="sd-link" to={localePath('/insights/founder-ledger/corrections')}>
                    <FileText size={18} aria-hidden="true" />
                    {t('Corrections log', 'திருத்தப் பதிவேடு')}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </Chapter>
            </div>
          </div>
        </Section>

        {/* Sponsor / funding disclosure: its own band, after the method, never beside findings (T07). */}
        <Section surface="sunken" pad="sm" id="sd-sponsor" labelledBy="sd-sponsor-h">
          <div className="sd-layout sd-layout--tail">
            <div className="sd-layout__main sd-disclosure">
              <p className="sd-chapter__n tnum" aria-hidden="true">05</p>
              <h2 id="sd-sponsor-h" className="h4">{t('Funding disclosure', 'நிதி வெளிப்படுத்தல்')}</h2>
              <p>
                {t(
                  'Who paid for this report, and any sponsor, is disclosed here, away from the findings.',
                  'இந்த அறிக்கைக்கு யார் நிதியளித்தார்கள், ஏதேனும் ஆதரவாளர் இருந்தால், கண்டறிதல்களிலிருந்து தனியாக இங்கு வெளிப்படுத்தப்படும்.'
                )}
              </p>
            </div>
          </div>
        </Section>

        {/* Download (light gate) */}
        <Section id="sd-download" labelledBy="sd-download-h">
          <div className="sd-download">
            <div className="sd-download__intro">
              <p className="eyebrow">{t('Chapter 06 · Download', 'அத்தியாயம் 06 · பதிவிறக்கம்')}</p>
              <h2 id="sd-download-h" className="h2">
                {t('Get the report', 'அறிக்கையைப் பெறுங்கள்')}
              </h2>
              <p className="body-lg sd-download__lede">
                {t(
                  'The PDF will be open to all, in English and Tamil. Leave your details and we will send it the day it is published.',
                  'PDF ஆங்கிலத்திலும் தமிழிலும் அனைவருக்கும் திறந்திருக்கும். உங்கள் விவரங்களைக் கொடுங்கள்; வெளியான நாளில் அனுப்புவோம்.'
                )}
              </p>
              <ul className="sd-files" role="list">
                {formats.length > 0
                  ? formats.map((f) => (
                      <li key={`${f.lang}-${f.format}`} className="sd-file">
                        <FileText size={20} aria-hidden="true" />
                        <span>
                          {f.format?.toUpperCase()} · {f.lang === 'ta' ? 'தமிழ்' : 'English'}
                          {f.size ? ` · ${f.size}` : ''}
                        </span>
                      </li>
                    ))
                  : [
                      ['en', 'PDF · English'],
                      ['ta', 'PDF · தமிழ்'],
                    ].map(([k, label]) => (
                      <li key={k} className="sd-file sd-file--pending">
                        <FileText size={20} aria-hidden="true" />
                        <span>{label}</span>
                      </li>
                    ))}
              </ul>
            </div>
            <div className="sd-download__form">
              <SmartForm
                type="interest"
                hidden={{ programme: REPORT_SLUG, source: 'about-self-diagnosis', lang }}
                fields={[
                  { id: 'sd-name', name: 'name', label: t('Your name', 'உங்கள் பெயர்'), type: 'text', required: true, autoComplete: 'name' },
                  { id: 'sd-email', name: 'email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
                  { id: 'sd-org', name: 'organisation', label: t('Organisation', 'அமைப்பு'), type: 'text', autoComplete: 'organization' },
                  {
                    id: 'sd-purpose',
                    name: 'purpose',
                    label: t('What will you use it for?', 'இதை எதற்குப் பயன்படுத்துவீர்கள்?'),
                    type: 'select',
                    options: [
                      { value: 'investment', label: t('Investment or due diligence', 'முதலீடு அல்லது ஆய்வு') },
                      { value: 'government', label: t('Government or policy', 'அரசு அல்லது கொள்கை') },
                      { value: 'partnership', label: t('Partnership', 'கூட்டாண்மை') },
                      { value: 'media', label: t('Media or research', 'ஊடகம் அல்லது ஆய்வு') },
                      { value: 'other', label: t('Something else', 'வேறு ஏதாவது') },
                    ],
                  },
                ]}
                consents={[
                  {
                    purpose: 'contact',
                    label: t(
                      'StartNet may email me the self-diagnosis report when it is published.',
                      'சுய மதிப்பீட்டு அறிக்கை வெளியானதும் StartNet எனக்கு மின்னஞ்சல் அனுப்பலாம்.'
                    ),
                    required: true,
                  },
                ]}
                submitLabel={t('Send me the report', 'அறிக்கையை எனக்கு அனுப்புங்கள்')}
                successTitle={t("Thanks. You're on the list.", 'நன்றி. நீங்கள் பட்டியலில் உள்ளீர்கள்.')}
                successBody={t(
                  'We will email you the report the day it is published.',
                  'அறிக்கை வெளியாகும் நாளில் உங்களுக்கு மின்னஞ்சல் அனுப்புவோம்.'
                )}
              />
            </div>
          </div>
        </Section>

        </div>

        {related.length > 0 && (
          <Section surface="white" className="sd-related-section" id="sd-related" labelledBy="sd-related-h">
            <SectionHeader
              id="sd-related-h"
              eyebrow={t('Related', 'தொடர்புடையவை')}
              title={t('More from Insights', 'நுண்ணறிவுகளிலிருந்து மேலும்')}
              action={
                <Button to="/insights/reports" variant="tertiary">
                  {t('All reports', 'அனைத்து அறிக்கைகளும்')}
                </Button>
              }
            />
            <RevealGroup className="sd-related">
              {related.map((r) => (
                <ReportCard key={r.slug} report={r} />
              ))}
            </RevealGroup>
          </Section>
        )}
      </div>
    </div>
  );
}
