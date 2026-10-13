// /insights/reports/:slug — T07 Report (Book 1 Part B §2.2 row "Report", §6.2 T07, §8 Report; Book 3 Part B §4 T07: 8/4 with
// chapter nav + reading progress, sponsor disclosure in its own band after methodology; Book 3 C29 download "PDF, 2.4 MB, English").
// Copy: Book 2 §6.3 (TN Founder Report landing, pre-launch + published states) verbatim; other reports use their API summary.
// Data: GET /api/reports (slug lookup; unknown → NotFound), GET /api/metrics (public context figures only).
import { useMemo, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Bell, FileText, Lock, MessageSquare } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Stat, TagChip, Badge, Button, RevealGroup, ReportCard,
  Skeleton, EmptyState, KeyFacts, SmartForm, Breadcrumbs, PageLoader,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { webPageLd, itemListLd, langPath, articleLd } from '../../../lib/seo.js';
import NotFound from '../../utility/LazyNotFound.jsx';
import ChapterNav from './ChapterNav.jsx';
import NotifyForm from './NotifyForm.jsx';
import { KIND_NAMES, LANG_NAMES, TAG_RULES, reportPath, splitPlaceholder } from './shared.js';
import { fitTitle, fitDescription } from '../../programmes/parts/seoFit.js';
import './ReportDetail.css';

// Per-report extras from the books. Anything not in the books stays a placeholder.
const EXTRAS = {
  'tn-founder-report-2027': {
    seo: ["TN Founder Report: the state of Tamil Nadu's founders", 'TN Founder Report: தமிழ்நாட்டு நிறுவனர்களின் நிலை'],
    description: [
      'An annual report on who is starting companies in Tamil Nadu, where, with what support, and what holds them back. Sources and tags on every figure.',
      'தமிழ்நாட்டில் யார் நிறுவனங்களைத் தொடங்குகிறார்கள், எங்கே, என்ன ஆதரவுடன், அவர்களைத் தடுப்பது எது என்பது பற்றிய ஆண்டு அறிக்கை. ஒவ்வொரு எண்ணுக்கும் ஆதாரமும் குறியும் உண்டு.',
    ],
    // Book 2 §6.3 chapter list, keyed by the English title in /api/reports.
    chapters: {
      'Founders by district': 'மாவட்ட வாரியாக நிறுவனர்கள்',
      'Women-led and women-owned (51%+)': 'பெண்கள் தலைமையிலானவை, பெண்களுக்குச் சொந்தமானவை (51%+)',
      'Capital and grants': 'முதலீடும் மானியங்களும்',
      'Campus to company': 'கல்லூரியிலிருந்து நிறுவனம் வரை',
      'Research to market': 'ஆராய்ச்சியிலிருந்து சந்தை வரை',
      'Methods and limits': 'முறைகளும் வரம்புகளும்',
    },
    sub: [
      'An annual look at who is building companies in Tamil Nadu, in which districts, with what support, and what is holding them back.',
      'தமிழ்நாட்டில் யார் நிறுவனங்களை உருவாக்குகிறார்கள், எந்த மாவட்டங்களில், என்ன ஆதரவுடன், அவர்களைத் தடுத்து நிறுத்துவது எது என்பதைப் பற்றிய ஆண்டுப் பார்வை.',
    ],
    preLaunch: true,
    sources: [
      ['DPIIT', 'DPIIT'],
      ['AISHE', 'AISHE'],
      ['StartupTN', 'StartupTN'],
      ["StartNet's Founder Ledger", 'StartNet-இன் Founder Ledger'],
      ['A founder survey', 'நிறுவனர் கணக்கெடுப்பு'],
    ],
    context: ['tn-dpiit-startups', 'tn-startups-outside-top-3', 'tn-higher-education-ger'],
    survey: true,
    briefing: true,
  },
  'tn-women-founders-report': {
    // Meta description: the report is not out yet, so "Launches at" (as the page's launch line), not the data's "Launched at".
    seoDescription: [
      'Launches at the Women Founders Summit & Awards. Reports women-led startups (DPIIT definition) alongside women-owned (51%+ equity held by women).',
      'Women Founders Summit & Awards-இல் வெளியிடப்படும். பெண்கள் தலைமையிலான ஸ்டார்ட்அப்களையும் (DPIIT வரையறை) பெண்களுக்குச் சொந்தமானவற்றையும் (51%+ பங்கு) சேர்த்து அறிக்கையிடும்.',
    ],
    definitions: [
      [
        'Women-led: the DPIIT definition, a startup with at least one woman director.',
        'பெண்கள் தலைமையிலானது: DPIIT வரையறை, குறைந்தது ஒரு பெண் இயக்குநர் உள்ள ஸ்டார்ட்அப்.',
      ],
      [
        'Women-owned: 51% or more of the equity held by women.',
        'பெண்களுக்குச் சொந்தமானது: பங்குகளில் 51% அல்லது அதற்கு மேல் பெண்களிடம் இருப்பது.',
      ],
    ],
    context: ['tn-women-led-startups'],
    launch: { pre: ['Launches at the ', 'அறிமுகமாகும் நிகழ்வு: '], en: 'Women Founders Summit & Awards', ta: 'Women Founders Summit & Awards', to: '/women/summit' },
  },
  'state-of-tn-saas': { launch: { pre: ['Related community: ', 'தொடர்புடைய சமூகம்: '], en: 'SaaS Connect', ta: 'SaaS Connect', to: '/connect/saas' } },
  'state-of-tn-genai': { launch: { pre: ['Related community: ', 'தொடர்புடைய சமூகம்: '], en: 'GenAI Connect', ta: 'GenAI Connect', to: '/connect/genai' } },
  'state-of-tn-d2c': { launch: { pre: ['Related community: ', 'தொடர்புடைய சமூகம்: '], en: 'D2C Connect', ta: 'D2C Connect', to: '/connect/d2c' } },
};

// SEO titles [English, Tamil draft] (Book 1 §9.2 Data theme: "Tamil Nadu startup statistics").
const REPORT_SEO_TITLE = {
  'tn-founder-report-2027': ['TN Founder Report 2027: Tamil Nadu founders', 'TN Founder Report 2027: தமிழ்நாட்டு நிறுவனர்கள்'],
  'tn-women-founders-report': ['TN Women Founders Report: women-led startups', 'TN Women Founders Report: பெண் நிறுவனர்கள்'],
  'state-of-tn-saas': ['State of TN SaaS: Tamil Nadu SaaS sector report', 'State of TN SaaS: தமிழ்நாடு SaaS துறை அறிக்கை'],
  'state-of-tn-genai': ['State of TN GenAI: Tamil Nadu GenAI sector report', 'State of TN GenAI: தமிழ்நாடு GenAI துறை அறிக்கை'],
  'state-of-tn-d2c': ['State of TN D2C: Tamil Nadu D2C sector report', 'State of TN D2C: தமிழ்நாடு D2C துறை அறிக்கை'],
};

const NAV = [
  ['summary', 'Summary', 'சுருக்கம்'],
  ['findings', 'Key findings', 'முக்கியக் கண்டறிதல்கள்'],
  ['chapters', 'Chapters', 'அத்தியாயங்கள்'],
  ['method', 'Methodology', 'முறையியல்'],
  ['sponsors', 'Sponsor disclosure', 'நிதியளிப்பாளர் வெளிப்படுத்தல்'],
  ['download', 'Download', 'பதிவிறக்கம்'],
];

export default function ReportDetail() {
  const { slug } = useParams();
  const { t, localePath } = useLang();
  const { data, loading, error } = useApi('/api/reports');
  const all = Array.isArray(data) ? data : [];
  const report = all.find((r) => r.slug === slug);

  if (loading && !data) {
    return (
      <>
        {/* No <Seo> while loading: it would replace the prerendered title with a generic one during hydration. */}
        <Section surface="paper">
          <h1 className="visually-hidden">{t('Loading report', 'அறிக்கை ஏற்றப்படுகிறது')}</h1>
          <div className="report-detail__loading" aria-busy="true">
            <Skeleton height="3rem" />
            <Skeleton height="1.25rem" count={3} />
            <Skeleton height="18rem" />
          </div>
        </Section>
      </>
    );
  }

  if (error && !data) {
    return (
      <>
        <Seo title={t('Report', 'அறிக்கை')} />
        <Section surface="paper" width="narrow">
          <Breadcrumbs
            className="report-detail__crumbs"
            items={[
              { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
              { label: t('Reports', 'அறிக்கைகள்'), to: '/insights/reports' },
              { label: t('Report', 'அறிக்கை') },
            ]}
          />
          <h1 className="h2 report-detail__error-title">
            {t("We couldn't load this report just now", 'இந்த அறிக்கையை இப்போது ஏற்ற முடியவில்லை')}
            <span className="dot">.</span>
          </h1>
          <EmptyState
            title={t('Please try again in a moment.', 'சிறிது நேரம் கழித்து மீண்டும் முயலவும்.')}
            action={<Button variant="secondary" to="/insights/reports">{t('All reports', 'அனைத்து அறிக்கைகளும்')}</Button>}
          />
        </Section>
      </>
    );
  }

  if (!report) return <NotFound />;

  // The Ledger, the three indices and reports with a page elsewhere (/about/self-diagnosis) have their own canonical pages.
  if (reportPath(report) !== `/insights/reports/${report.slug}`) {
    // Keep the loader on screen for the redirect frame (an empty <main> lets the footer jump up: CLS).
    return <><Navigate to={localePath(reportPath(report))} replace /><PageLoader /></>;
  }

  return <ReportView key={report.slug} report={report} all={all} />;
}

function ReportView({ report: r, all }) {
  const { t, lang } = useLang();
  const bodyRef = useRef(null);
  const x = EXTRAS[r.slug] || {};
  const en = lang === 'ta' ? 'en' : undefined; // API copy is English-only
  const published = r.status === 'published';
  const year = r.year || '';
  const findings = Array.isArray(r.keyFindings) ? r.keyFindings : [];
  const chapters = Array.isArray(r.chapters) ? r.chapters : [];
  const formats = Array.isArray(r.formats) ? r.formats : [];
  const status = splitPlaceholder(r.statusLabel);
  const kindName = KIND_NAMES[r.kind] ? t(KIND_NAMES[r.kind][0], KIND_NAMES[r.kind][1]) : t('Report', 'அறிக்கை');
  const comingLabel = year ? t(`Coming ${year}`, `${year}-இல் வருகிறது`) : t('Coming soon', 'விரைவில் வருகிறது');
  // The API summary may already end with the Book 2 §6.1 "Planned…" microcopy, which this page prints on its own.
  const summary = String(r.summary || '').replace(/\s*Planned\. We'll publish the method before the first edition\.\s*$/, '').trim();
  const chapterName = (c) => (x.chapters && x.chapters[c] ? t(c, x.chapters[c]) : c);
  const chapterLang = (c) => (x.chapters && x.chapters[c] ? undefined : en);

  const { data: metrics } = useApi(x.context ? '/api/metrics' : null);
  const context = useMemo(
    () => (x.context && Array.isArray(metrics) ? x.context.map((id) => metrics.find((m) => m.id === id)).filter(Boolean) : []),
    [metrics, x.context],
  );

  const related = useMemo(() => {
    const others = all.filter((o) => o.slug !== r.slug && o.kind !== 'ledger');
    const same = others.filter((o) => o.kind === r.kind);
    const rest = others.filter((o) => o.kind !== r.kind);
    return [...same, ...rest].slice(0, 3);
  }, [all, r.slug, r.kind]);

  const navItems = NAV.map(([id, a, b]) => ({ id: `report-${id}`, label: t(a, b) }));
  const sub = x.sub ? t(x.sub[0], x.sub[1]) : summary;

  const facts = [
    { label: t('Type', 'வகை'), value: kindName },
    { label: t('Edition', 'பதிப்பு'), value: year ? String(year) : null },
    r.cadence && { label: t('Cadence', 'கால இடைவெளி'), value: r.cadence === 'Annual' ? t('Annual', 'ஆண்டுதோறும்') : r.cadence === 'Quarterly' ? t('Quarterly', 'காலாண்டுதோறும்') : r.cadence },
    {
      label: t('Status', 'நிலை'),
      value: published ? t('Published', 'வெளியிடப்பட்டது') : (
        <>
          {/* The inline status note ("[placeholder — date]") is an editorial mark: not shown. */}
          {status.text && !/^planned$/i.test(status.text) ? <span lang={en}>{status.text}</span> : <span>{comingLabel}</span>}
        </>
      ),
    },
    {
      label: t('Languages', 'மொழிகள்'),
      value: formats.length
        ? [...new Set(formats.map((f) => f.lang))].map((l) => (LANG_NAMES[l] ? t(LANG_NAMES[l][0], LANG_NAMES[l][1]) : l)).join(', ')
        : t('English, with a Tamil summary', 'ஆங்கிலம், தமிழ்ச் சுருக்கத்துடன்'),
    },
  ].filter(Boolean);

  return (
    <>
      {/* SEO: per-report titles with a Tamil phrase on /ta (EN/TA never identical); descriptions from the report's own
          summary + status line. Report JSON-LD only once a report is published (an unpublished report has no
          datePublished and no content to describe). SEO-TA: pending native review. */}
      <Seo
        title={fitTitle(
          REPORT_SEO_TITLE[r.slug] ? t(REPORT_SEO_TITLE[r.slug][0], REPORT_SEO_TITLE[r.slug][1]) : null,
          x.seo ? t(x.seo[0], x.seo[1]) : null,
          t(`${r.title}: Tamil Nadu ${kindName.toLowerCase()}`, `${(lang === 'ta' && r.titleTa) || r.title}: தமிழ்நாடு ${kindName}`),
          (lang === 'ta' && r.titleTa) || r.title
        )}
        description={fitDescription(
          x.seoDescription ? t(x.seoDescription[0], x.seoDescription[1]) : x.description ? t(x.description[0], x.description[1]) : (lang === 'ta' && r.summaryTa) || r.summary,
          [
            t('A StartNet report on Tamil Nadu, with sources and tags on every figure.', 'தமிழ்நாடு பற்றிய StartNet அறிக்கை; ஒவ்வொரு எண்ணுக்கும் ஆதாரமும் குறியும்.'),
            t('Sources and tags on every figure.', 'ஒவ்வொரு எண்ணுக்கும் ஆதாரமும் குறியும்.'),
          ],
          published ? null : [t('Get notified when it is published.', 'வெளியானதும் அறிவிப்பு பெறுங்கள்.')]
        )}
        type={published ? 'article' : 'website'}
        jsonLd={
          published
            ? articleLd({
              headline: (lang === 'ta' && r.titleTa) || r.title,
              description: (lang === 'ta' && r.summaryTa) || summary,
              path: `/insights/reports/${r.slug}`,
              lang,
              datePublished: r.published || r.publishedAt,
              type: 'Report',
            })
            : null
        }
      />

      <PageHero
        eyebrow={`${kindName}${r.cadence ? ` · ${r.cadence === 'Annual' ? t('Annual', 'ஆண்டுதோறும்') : r.cadence}` : ''}`}
        titleClass="display-xl report-detail__hero-title"
        title={r.title}
        lede={sub}
        breadcrumbs={[
          { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
          { label: t('Reports', 'அறிக்கைகள்'), to: '/insights/reports' },
          { label: r.title },
        ]}
        art={{ variant: r.kind === 'index' ? 'map' : 'network', ratio: '4/5', seed: hashSeed(r.slug), label: `${r.title}`, alt: '' }}
        meta={
          <div className="report-detail__badges">
            <Badge kind="type">{kindName}</Badge>
            {year && <Badge kind="lang">{year}</Badge>}
            {published ? <Badge kind="status" status="open">{t('Published', 'வெளியிடப்பட்டது')}</Badge> : <Badge kind="status" status="upcoming">{comingLabel}</Badge>}
          </div>
        }
        actions={
          published ? (
            <Button href="#report-download" icon={FileText}>{t('Download the report', 'அறிக்கையைப் பதிவிறக்குங்கள்')}</Button>
          ) : (
            <Button href="#report-download" icon={Bell}>{t("Get the report when it's out", 'அறிக்கை வெளியானதும் பெறுங்கள்')}</Button>
          )
        }
      />

      <Section surface="paper" className="report-detail">
        <div className="report-detail__layout">
          <div className="report-detail__aside">
            <div className="report-detail__sticky">
              <ChapterNav items={navItems} targetRef={bodyRef}>
                <KeyFacts sticky={false} title={t('About this report', 'இந்த அறிக்கை பற்றி')} items={facts} />
              </ChapterNav>
            </div>
          </div>

          <article className="report-detail__body" ref={bodyRef}>
            {/* 1 · Summary */}
            <section id="report-summary" className="report-detail__block" aria-labelledby="report-summary-h">
              <h2 id="report-summary-h" className="h3">{t('Summary', 'சுருக்கம்')}</h2>
              {x.sub && !(x.preLaunch && !published) && summary && <p className="body-lg report-detail__summary" lang={en}>{summary}</p>}
              {!published && x.preLaunch && (
                <p className="body-lg report-detail__prelaunch">
                  {/* The exact date is not supplied: the planned year from the record is used, or the clause is left out. */}
                  {year
                    ? t(`The first TN Founder Report is planned for ${year}`, `முதல் TN Founder Report வெளியாகத் திட்டமிடப்பட்டுள்ள ஆண்டு: ${year}`)
                    : null}
                  {t(
                    `${year ? '. ' : ''}It will combine public data (DPIIT, AISHE, StartupTN) with StartNet's Founder Ledger and a founder survey. We'll publish the method first.`,
                    `${year ? '. ' : ''}இது பொதுத் தரவுகளை (DPIIT, AISHE, StartupTN) StartNet-இன் Founder Ledger மற்றும் ஒரு நிறுவனர் கணக்கெடுப்புடன் இணைக்கும். முதலில் முறையியலை வெளியிடுவோம்.`,
                  )}
                </p>
              )}
              {!published && !x.preLaunch && (
                <p className="report-detail__prelaunch">
                  {t("Planned. We'll publish the method before the first edition.", 'திட்டமிடப்பட்டுள்ளது. முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.')}
                </p>
              )}
              {x.launch && (
                <p className="report-detail__launch">
                  {t(x.launch.pre[0], x.launch.pre[1])}
                  <Button variant="tertiary" to={x.launch.to} icon={ArrowRight}>{t(x.launch.en, x.launch.ta)}</Button>
                </p>
              )}
              {x.definitions && (
                <ul className="report-detail__defs">
                  {x.definitions.map(([a, b]) => <li key={a}>{t(a, b)}</li>)}
                </ul>
              )}
            </section>

            {/* 2 · Key findings (M12, each tagged) */}
            <section id="report-findings" className="report-detail__block" aria-labelledby="report-findings-h">
              <h2 id="report-findings-h" className="h3">{t('Key findings', 'முக்கியக் கண்டறிதல்கள்')}</h2>
              {published && findings.length > 0 ? (
                <RevealGroup className="report-detail__findings">
                  {findings.slice(0, 5).map((m, i) => (
                    <div key={m.id || m.key || i} className="report-detail__finding">
                      <Stat metric={m} />
                      {m.note && <p className="report-detail__meaning" lang={en}>{m.note}</p>}
                    </div>
                  ))}
                </RevealGroup>
              ) : (
                <div className="report-detail__pending">
                  <p>
                    {t(
                      'Findings appear here when the report is published: five headline figures, each with its meaning, source and confidence tag.',
                      'அறிக்கை வெளியானதும் கண்டறிதல்கள் இங்கே தோன்றும்: ஐந்து முக்கிய எண்கள், ஒவ்வொன்றுக்கும் பொருள், ஆதாரம், நம்பகத்தன்மைக் குறியுடன்.',
                    )}
                  </p>
                </div>
              )}
              {context.length > 0 && (
                <div className="report-detail__context">
                  <h3 className="h6 report-detail__context-title">
                    {t('Public data the report builds on', 'இந்த அறிக்கை அடிப்படையாகக் கொள்ளும் பொதுத் தரவு')}
                  </h3>
                  <div className="report-detail__context-grid">
                    {context.map((m) => <Stat key={m.id} metric={m} variant="compact" />)}
                  </div>
                  <p className="report-detail__context-note">
                    {t('Context figures, not findings of this report.', 'இவை பின்னணி எண்கள்; இந்த அறிக்கையின் கண்டறிதல்கள் அல்ல.')}
                  </p>
                </div>
              )}
            </section>

            {/* 3 · Chapters */}
            <section id="report-chapters" className="report-detail__block" aria-labelledby="report-chapters-h">
              <h2 id="report-chapters-h" className="h3">
                {published ? t('Chapters', 'அத்தியாயங்கள்') : t('Planned chapters', 'திட்டமிடப்பட்ட அத்தியாயங்கள்')}
              </h2>
              {chapters.length > 0 ? (
                <ol className="report-detail__chapters">
                  {chapters.map((c, i) => (
                    <li key={c}>
                      <span className="report-detail__num">{String(i + 1).padStart(2, '0')}</span>
                      <span lang={chapterLang(c)}>{chapterName(c)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="report-detail__muted">
                  {t('Chapters are listed when the method is published.', 'முறையியல் வெளியானதும் அத்தியாயங்கள் பட்டியலிடப்படும்.')}
                </p>
              )}
            </section>

            {/* 4 · Methodology summary */}
            <section id="report-method" className="report-detail__block" aria-labelledby="report-method-h">
              <h2 id="report-method-h" className="h3">{t('Methodology', 'முறையியல்')}</h2>
              {r.methodology ? (
                <p className="report-detail__prose" lang={en}>{r.methodology}</p>
              ) : (
                <p className="report-detail__prose">
                  {t(
                    "We'll publish the method before the first edition, so you can check how every figure is counted before you read the findings.",
                    'முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்; கண்டறிதல்களைப் படிக்கும் முன்பே ஒவ்வொரு எண்ணும் எப்படிக் கணக்கிடப்படுகிறது என்பதை நீங்கள் சரிபார்க்கலாம்.',
                  )}
                </p>
              )}
              {x.sources && (
                <div className="report-detail__sources">
                  <h3 className="h6">{t('Sources', 'ஆதாரங்கள்')}</h3>
                  <ul>{x.sources.map(([a, b]) => <li key={a}>{t(a, b)}</li>)}</ul>
                </div>
              )}
              <dl className="report-detail__tags">
                {TAG_RULES.map((rule) => (
                  <div key={rule.tag} className="report-detail__tag">
                    <dt><TagChip tag={rule.tag} /></dt>
                    <dd>{t(rule.en, rule.ta)}</dd>
                  </div>
                ))}
              </dl>
              <p className="report-detail__muted">
                {t('C-tagged estimates are never summed into A or B figures.', 'C குறியிட்ட மதிப்பீடுகள் A அல்லது B எண்களுடன் ஒருபோதும் கூட்டப்படுவதில்லை.')}
              </p>
              <div className="cluster report-detail__method-links">
                <Button variant="tertiary" to="/about/evidence-standard" icon={ArrowRight}>{t('Our evidence standard', 'எங்கள் ஆதாரத் தரநிலை')}</Button>
                <Button variant="tertiary" to="/insights/founder-ledger/corrections" icon={ArrowRight}>{t('Corrections log', 'திருத்தங்கள் பதிவு')}</Button>
              </div>
            </section>

            {/* 5 · Sponsor disclosure — its own band, after methodology, never adjacent to findings */}
            <section id="report-sponsors" className="report-detail__sponsor" aria-labelledby="report-sponsors-h">
              <h2 id="report-sponsors-h" className="h5">{t('Sponsor disclosure', 'நிதியளிப்பாளர் வெளிப்படுத்தல்')}</h2>
              <SponsorLine line={r.sponsorDisclosure || r.sponsorLine} />
            </section>

            {/* 6 · Download (light gate) or notify */}
            <section id="report-download" className="report-detail__block" aria-labelledby="report-download-h">
              <h2 id="report-download-h" className="h3">
                {published ? t('Download', 'பதிவிறக்கம்') : comingLabel}
              </h2>
              {published ? (
                <Downloads report={r} />
              ) : (
                <div className="report-detail__notify">
                  <p className="report-detail__prose">
                    {t(
                      `${r.title} is planned for ${year}. Leave your email and we'll tell you when it's out.`,
                      `${r.title} ${year}-இல் வெளியாகத் திட்டமிடப்பட்டுள்ளது. உங்கள் மின்னஞ்சலைத் தந்தால், வெளியானதும் தெரிவிப்போம்.`,
                    )}
                  </p>
                  <NotifyForm context={`report:${r.slug}`} what={r.title} submitLabel={t('Notify me', 'எனக்கு அறிவியுங்கள்')} />
                  {/* The founder-survey button appears once the survey link is supplied (no disabled placeholder control). */}
                </div>
              )}
              {(x.briefing || published) && (
                <div className="report-detail__briefing">
                  <p className="report-detail__muted">{t('For government, media and partners.', 'அரசு, ஊடகம், கூட்டாளர்களுக்கு.')}</p>
                  <Button variant="tertiary" to="/contact?topic=briefing" icon={MessageSquare}>{t('Request a briefing', 'விளக்கக் கூட்டம் கோருங்கள்')}</Button>
                </div>
              )}
            </section>
          </article>
        </div>
      </Section>

      {related.length > 0 && (
        <Section surface="white" labelledBy="report-related-h">
          <SectionHeader
            id="report-related-h"
            eyebrow={t('Reports & indices', 'அறிக்கைகள் & குறியீடுகள்')}
            title={t('Related reports', 'தொடர்புடைய அறிக்கைகள்')}
            action={<Button variant="tertiary" to="/insights/reports" icon={ArrowRight}>{t('All reports', 'அனைத்து அறிக்கைகளும்')}</Button>}
          />
          <RevealGroup className="report-detail__related">
            {related.map((o) => (
              <div key={o.slug} className="report-detail__related-item">
                <ReportCard report={o} to={reportPath(o)} />
              </div>
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  );
}

function SponsorLine({ line }) {
  const { t, lang } = useLang();
  const rule = t(
    'Sponsors do not see findings before publication and have no say in them.',
    'வெளியீட்டுக்கு முன் நிதியளிப்பாளர்கள் கண்டறிதல்களைப் பார்ப்பதில்லை; அவற்றில் அவர்களுக்கு எந்தக் கருத்துரிமையும் இல்லை.',
  );
  const { text, note } = splitPlaceholder(line || '');
  const named = !note && text && !/^supported by\s*\.?$/i.test(text);
  return (
    <div className="report-detail__sponsor-body">
      {/* "Supported by [placeholder]" is hidden until a sponsor is named. */}
      {named && <p lang={lang === 'ta' ? 'en' : undefined}>{text.replace(/\s*Sponsors do not see[^.]*\.?/i, '')}</p>}
      <p className="report-detail__sponsor-rule">{rule}</p>
      <p className="report-detail__muted">
        {t(
          'Sponsor logos never appear next to findings or charts.',
          'நிதியளிப்பாளர் லோகோக்கள் கண்டறிதல்கள் அல்லது வரைபடங்களுக்கு அருகில் ஒருபோதும் இடம்பெறாது.',
        )}
      </p>
    </div>
  );
}

const GATE_KEY = (slug) => `sn-report-gate-${slug}`;

function Downloads({ report: r }) {
  const { t } = useLang();
  const formats = Array.isArray(r.formats) ? r.formats : [];
  const gated = r.gate !== 'none';
  const [unlocked, setUnlocked] = useState(() => {
    try { return window.sessionStorage.getItem(GATE_KEY(r.slug)) === '1'; } catch { return false; }
  });

  if (!formats.length) {
    return (
      <p className="report-detail__muted">
        {t('Download links appear here when the files are ready.', 'கோப்புகள் தயாரானதும் பதிவிறக்க இணைப்புகள் இங்கே தோன்றும்.')}
      </p>
    );
  }

  const list = (
    <ul className="report-detail__files">
      {formats.map((f, i) => {
        const fmt = String(f.format || '').toUpperCase();
        const langName = LANG_NAMES[f.lang] ? t(LANG_NAMES[f.lang][0], LANG_NAMES[f.lang][1]) : f.lang;
        const label = fmt === 'CSV' ? t('Download the data (CSV)', 'தரவைப் பதிவிறக்குங்கள் (CSV)') : t('Download the full report', 'முழு அறிக்கையைப் பதிவிறக்குங்கள்');
        return (
          <li key={`${f.lang}-${fmt}-${i}`} className="report-detail__file">
            <FileText size={20} aria-hidden="true" />
            <div className="report-detail__file-text">
              {f.url ? <a href={f.url} download className="report-detail__file-link">{label}</a> : <span>{label}</span>}
              <span className="report-detail__file-meta">
                {[fmt, f.size || null, langName].filter(Boolean).join(', ')}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );

  if (!gated || unlocked) return list;

  return (
    <div className="report-detail__gate">
      <p className="report-detail__gate-intro">
        <Lock size={16} aria-hidden="true" />
        {t(
          'Tell us who you are and the download links open straight away. We use this only to understand who reads our reports.',
          'நீங்கள் யார் என்று தெரிவித்தால், பதிவிறக்க இணைப்புகள் உடனே திறக்கும். எங்கள் அறிக்கைகளை யார் படிக்கிறார்கள் என்பதைப் புரிந்துகொள்ள மட்டுமே இதைப் பயன்படுத்துகிறோம்.',
        )}
      </p>
      <SmartForm
        type="interest"
        fields={[
          { name: 'name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name', width: 'half' },
          { name: 'email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', width: 'half' },
          { name: 'organisation', label: t('Organisation', 'அமைப்பு'), autoComplete: 'organization' },
          {
            name: 'purpose',
            label: t('What will you use it for?', 'இதை எதற்குப் பயன்படுத்துவீர்கள்?'),
            type: 'select',
            options: [
              { value: '', label: t('Choose one', 'ஒன்றைத் தேர்ந்தெடுங்கள்') },
              { value: 'research', label: t('Research or teaching', 'ஆராய்ச்சி அல்லது கற்பித்தல்') },
              { value: 'media', label: t('Media', 'ஊடகம்') },
              { value: 'government', label: t('Government or policy', 'அரசு அல்லது கொள்கை') },
              { value: 'partner', label: t('Partner or sponsor', 'கூட்டாளர் அல்லது நிதியளிப்பாளர்') },
              { value: 'founder', label: t("I'm a founder", 'நான் ஒரு நிறுவனர்') },
              { value: 'other', label: t('Other', 'மற்றவை') },
            ],
          },
        ]}
        consents={[
          {
            purpose: 'contact',
            required: true,
            label: t('StartNet may store these details to record this download.', 'இந்தப் பதிவிறக்கத்தைப் பதிவுசெய்ய StartNet இந்த விவரங்களைச் சேமிக்கலாம்.'),
          },
        ]}
        hidden={{ programme: `report-download:${r.slug}`, source: 'report-gate' }}
        submitLabel={t('Open the downloads', 'பதிவிறக்கங்களைத் திறக்கவும்')}
        successTitle={t('Your downloads are ready.', 'உங்கள் பதிவிறக்கங்கள் தயார்.')}
        onSuccess={() => {
          try { window.sessionStorage.setItem(GATE_KEY(r.slug), '1'); } catch { /* storage unavailable */ }
          setUnlocked(true);
        }}
      />
    </div>
  );
}

function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < String(s).length; i++) h = (h * 31 + String(s).charCodeAt(i)) % 997;
  return h;
}
