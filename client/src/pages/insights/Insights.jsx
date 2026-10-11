// T06 Insights hub (Book 1 Part B §6.2: Night hero → Ledger at a glance → reports → indices → stories → newsletter).
// Copy: Book 2 §6.1 verbatim. Tamil: drafts pending native review (Book 2 §14); report and index names stay Latin.
import { useEffect, useRef } from 'react';
import { ArrowRight, Bell } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Button, Stat, Card, Badge, ReportCard, StoryCard, Scroller,
  NewsletterForm, Reveal, RevealGroup, Skeleton, ArtImage,
} from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { webPageLd, itemListLd, langPath, ORG_REF, absUrl } from '../../lib/seo.js';
import { ColumnChart } from './LedgerCharts.jsx';
import { LocalText } from './RichText.jsx';
import { isPlaceholderMetric, isPlaceholderText, realStories } from '../../components/_placeholders.js';
import { normaliseLevels, periodInfo, findKpi, fmtDate, localiseItem, levelName, withKpiTa } from './ledgerUtils.js';
import './Insights.css';
import '../utility/restKit.css';

const PLANNED_NOTE = ["Planned. We'll publish the method before the first edition.", 'திட்டமிடப்பட்டுள்ளது. முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.'];

const COLLECTIONS = [
  { key: 'ledger', title: ['Founder Ledger', 'Founder Ledger'], cadence: ['Quarterly', 'காலாண்டுதோறும்'], to: '/insights/founder-ledger', status: 'ledger', art: 'grid' },
  { key: 'report', title: ['TN Founder Report', 'TN Founder Report'], cadence: ['Annual', 'ஆண்டுதோறும்'], to: '/insights/reports#tn-founder-report-2027', status: 'report', art: 'map' },
  { key: 'fri', title: ['Founder Readiness Index', 'Founder Readiness Index'], cadence: ['Index', 'குறியீடு'], planned: true, art: 'ladder' },
  { key: 'cii', title: ['Campus Innovation Index', 'Campus Innovation Index'], cadence: ['Index', 'குறியீடு'], planned: true, art: 'grid' },
  { key: 'rci', title: ['TN Research Commercialisation Index', 'TN Research Commercialisation Index'], cadence: ['Index', 'குறியீடு'], planned: true, art: 'network' },
  { key: 'wfr', title: ['TN Women Founders Report', 'TN Women Founders Report'], cadence: ['Report', 'அறிக்கை'], planned: true, art: 'dot' },
  {
    key: 'sector',
    title: ['Sector reports: State of TN SaaS, GenAI and D2C', 'துறை அறிக்கைகள்: State of TN SaaS, GenAI, D2C'],
    cadence: ['Sector reports', 'துறை அறிக்கைகள்'],
    planned: true,
    art: 'network',
  },
  { key: 'stories', title: ['Founder stories', 'நிறுவனர் கதைகள்'], cadence: ['Stories', 'கதைகள்'], to: '/insights/stories', art: 'portrait' },
  { key: 'corrections', title: ['Corrections log', 'திருத்தப் பதிவேடு'], cadence: ['Always visible', 'எப்போதும் பார்க்கலாம்'], to: '/insights/founder-ledger#corrections', art: 'kolam' },
];

export default function Insights() {
  const { t, lang } = useLang();
  const ledger = useApi('/api/ledger');
  const reports = useApi('/api/reports');
  const stories = useApi('/api/stories');
  const newsRef = useRef(null);

  // This page's newsletter needs its own landmark name: the kit form is always "The StartNet newsletter".
  const newsLabel = t('Insights newsletter sign-up', 'நுண்ணறிவுகள் செய்திமடல் பதிவு');
  useEffect(() => {
    newsRef.current?.querySelector('form')?.setAttribute('aria-label', newsLabel);
  });

  const L = ledger.data || {};
  const p = periodInfo(L);
  const levels = normaliseLevels(L);
  const hasLevels = levels.some((l) => l.value != null);
  const kpis = L.kpis || [];
  // Figures not supplied yet are left out; the panel hides when none is left.
  const glance = [
    findKpi(kpis, /nurtur|l2\+/),
    findKpi(kpis, /launch|l5/),
    findKpi(kpis, /capital|raised/),
  ].filter((m) => m && !isPlaceholderMetric(m));

  const reportList = [...(reports.data || [])]
    .sort((a, b) => (a.status === b.status ? (b.year || 0) - (a.year || 0) : a.status === 'published' ? -1 : 1))
    .slice(0, 3)
    .map((r) => localiseItem(Array.isArray(r.keyFindings) ? { ...r, keyFindings: r.keyFindings.map(withKpiTa) } : r, lang));
  // Seeded placeholder stories are never listed; the section hides until one is published.
  const storyList = realStories(stories.data).slice(0, 8).map((s) => localiseItem(s, lang));

  const heroArt = hasLevels ? (
    <figure className="ledger-chart insights-hero__chart">
      <figcaption className="insights-hero__chart-cap">
        <span className="eyebrow">{t('Latest Ledger', 'சமீபத்திய Ledger')}{p.label ? ` · ${p.label}` : ''}</span>
        <span className="insights-hero__chart-title">{t('People at each founder level, L1–L7', 'ஒவ்வொரு நிறுவனர் நிலையிலும் உள்ளவர்கள், L1–L7')}</span>
      </figcaption>
      <ColumnChart
        height={240}
        label={t(
          'Column chart from the latest Founder Ledger: people at each founder level',
          'சமீபத்திய Founder Ledger‑இலிருந்து நெடுவரிசை வரைபடம்: ஒவ்வொரு நிறுவனர் நிலையிலும் உள்ளவர்கள்',
        )}
        data={levels.map((l) => ({ key: l.code, label: l.code, sublabel: levelName(l, lang), value: l.value, tag: l.tag, tone: l.code === 'L1' ? 'context' : 'focus' }))}
      />
    </figure>
  ) : (
    { variant: 'network', night: true, ratio: '4/5', seed: 6, alt: '' }
  );

  const featuredEyebrow = p.upcoming
    ? t(`Featured · First edition${p.edition ? ` (${p.edition})` : ''}`, `சிறப்பு · முதல் பதிப்பு${p.edition ? ` (${p.edition})` : ''}`)
    : t('Featured · Latest edition', 'சிறப்பு · சமீபத்திய பதிப்பு');

  return (
    <>
      <Seo
        // Primary keyword: "Tamil Nadu startup data / statistics" (Book 1 §9.2 Data). SEO-TA: pending native review.
        title={t('Tamil Nadu startup data and founder reports', 'தமிழ்நாடு ஸ்டார்ட்அப் புள்ளிவிவரம், அறிக்கைகள்')}
        description={t(
          'Founder data for Tamil Nadu: the quarterly Founder Ledger by brand and district, the TN Founder Report, indices and founder stories. Every figure tagged.',
          'தமிழ்நாட்டு நிறுவனர் தரவு: பிராண்டு, மாவட்ட வாரியான காலாண்டு Founder Ledger, TN Founder Report, குறியீடுகள், நிறுவனர் கதைகள். ஒவ்வொரு எண்ணுக்கும் குறி.',
        )}
        jsonLd={[
          webPageLd({ path: langPath('/insights', lang), type: 'CollectionPage', lang, name: t('Tamil Nadu startup data and founder reports', 'தமிழ்நாடு ஸ்டார்ட்அப் புள்ளிவிவரம்') }),
          itemListLd({
            name: t('StartNet Insights', 'StartNet நுண்ணறிவுகள்'),
            lang,
            items: [
              { name: 'Founder Ledger', path: '/insights/founder-ledger' },
              { name: t('Reports and indices', 'அறிக்கைகளும் குறியீடுகளும்'), path: '/insights/reports' },
              { name: t('Indices', 'குறியீடுகள்'), path: '/insights/indices' },
              { name: t('Founder stories', 'நிறுவனர் கதைகள்'), path: '/insights/stories' },
              { name: t('Podcast', 'பாட்காஸ்ட்'), path: '/insights/podcast' },
              { name: t('Newsletter', 'செய்திமடல்'), path: '/insights/newsletter' },
            ],
          }),
        ]}
      />

      <PageHero
        className="insights-hero rk-hero rk-page"
        surface="night"
        eyebrow={t('Insights', 'நுண்ணறிவுகள்')}
        title={t('What we count, and how we count it.', 'நாங்கள் எதை எண்ணுகிறோம், எப்படி எண்ணுகிறோம்.')}
        lede={t(
          "Data on Tamil Nadu's founders: the quarterly Founder Ledger, an annual report, indices and stories. Every figure has a source or a confidence tag.",
          'தமிழ்நாட்டு நிறுவனர்கள் பற்றிய தரவு: காலாண்டு Founder Ledger, ஆண்டு அறிக்கை, குறியீடுகள், கதைகள். ஒவ்வொரு எண்ணுக்கும் ஆதாரம் அல்லது நம்பகத்தன்மைக் குறி உண்டு.',
        )}
        breadcrumbs={[{ label: t('Insights', 'நுண்ணறிவுகள்') }]}
        actions={
          <>
            <Button to="/insights/founder-ledger" icon={ArrowRight}>{t('Read the Founder Ledger', 'Founder Ledger‑ஐப் படியுங்கள்')}</Button>
            <Button variant="tertiary" href="#insights-newsletter">{t('Subscribe', 'செய்திமடலைப் பெறுங்கள்')}</Button>
          </>
        }
        art={heroArt}
      />

      {/* Featured: latest Ledger edition + at a glance */}
      <Section surface="paper" labelledBy="insights-glance">
        <div className={`insights-glance${!ledger.loading && !glance.length ? ' insights-glance--solo' : ''}`}>
          {/* AIWO P13: with no glance figures yet, the feature leads with its own 16:10 media slot. */}
          {!ledger.loading && !glance.length && (
            <Reveal className="insights-glance__media" variant="clip">
              <ArtImage variant="grid" ratio="16/10" seed={12} alt="" />
            </Reveal>
          )}
          <Reveal className="insights-glance__feature">
            <p className="eyebrow">{featuredEyebrow}</p>
            <h2 id="insights-glance" className="h2">
              Founder Ledger
              {!p.upcoming && p.label && !isPlaceholderText(p.label) ? ` ${p.label}` : null}
            </h2>
            <p className="body-lg text-2">
              {t(
                'Founders nurtured, companies launched, capital raised and pilots signed, by level, brand and district, each with an A/B/C confidence tag.',
                'வளர்க்கப்பட்ட நிறுவனர்கள், தொடங்கப்பட்ட நிறுவனங்கள், திரட்டிய மூலதனம், கையெழுத்தான முன்னோட்டங்கள்: நிலை, பிராண்டு, மாவட்டம் வாரியாக, ஒவ்வொன்றுக்கும் A/B/C நம்பகத்தன்மைக் குறியுடன்.',
              )}
            </p>
            {/* No as-at date yet: no caption (rather than "As at [date]"). */}
            {(p.upcoming && p.publishedLabel && !isPlaceholderText(p.publishedLabel)) || p.asAt ? (
              <p className="caption">
                {p.upcoming && p.publishedLabel && !isPlaceholderText(p.publishedLabel) ? (
                  <LocalText text={p.publishedLabel} textTa={L.publishedLabelTa} />
                ) : (
                  <>{t('As at', 'நிலவரம்')} {fmtDate(p.asAt, lang)}</>
                )}
              </p>
            ) : null}
            <Button variant="tertiary" to="/insights/founder-ledger" icon={ArrowRight}>{t('Read the Founder Ledger', 'Founder Ledger‑ஐப் படியுங்கள்')}</Button>
          </Reveal>
          {(ledger.loading || glance.length > 0) && (
            <div className="insights-glance__stats">
              <p className="insights-glance__label">{t('The Ledger at a glance', 'Ledger ஒரு பார்வையில்')}</p>
              {ledger.loading ? (
                <Skeleton height="6rem" count={3} />
              ) : (
                <RevealGroup className="insights-glance__grid">
                  {glance.map((m) => (
                    <div className="insights-glance__stat" key={m.id || m.key}>
                      <Stat metric={withKpiTa(m)} />
                    </div>
                  ))}
                </RevealGroup>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Collections */}
      <Section surface="white">
        <SectionHeader
          eyebrow={t('Collections', 'தொகுப்புகள்')}
          title={t('Ledger, reports, indices and stories', 'Ledger, அறிக்கைகள், குறியீடுகள், கதைகள்')}
          lede={t(
            'Every figure has a source or a confidence tag. Planned titles publish their method before the first edition.',
            'ஒவ்வொரு எண்ணுக்கும் ஆதாரம் அல்லது நம்பகத்தன்மைக் குறி உண்டு. திட்டமிடப்பட்ட வெளியீடுகள் முதல் பதிப்புக்கு முன் தங்கள் முறையியலை வெளியிடும்.',
          )}
        />
        <RevealGroup className="insights-collections">
          {COLLECTIONS.map((c, i) => {
            const title = t(...c.title);
            return (
              <Card
                key={c.key}
                className="insights-collections__card"
                to={c.to}
                eyebrow={t(...c.cadence)}
                title={title}
                art={{ variant: c.art, ratio: '16/10', seed: i + 3, alt: '' }}
                meta={<CollectionStatus c={c} period={p.upcoming ? null : p.label} report={findReport(reports.data, c.key)} />}
                body={c.planned ? t(...PLANNED_NOTE) : undefined}
                footer={
                  c.planned ? (
                    <a className="insights-notify" href="#insights-newsletter">
                      <Bell size={16} aria-hidden="true" /> {t('Notify me', 'எனக்குத் தெரிவிக்கவும்')}
                      <span className="visually-hidden">: {title}</span>
                    </a>
                  ) : undefined
                }
              />
            );
          })}
        </RevealGroup>
      </Section>

      {/* Latest reports (M22): hidden while there is no report record at all */}
      {(reports.loading || reportList.length > 0) && (
      <Section surface="paper">
        <SectionHeader
          eyebrow={t('Reports', 'அறிக்கைகள்')}
          title={t('Latest reports', 'சமீபத்திய அறிக்கைகள்')}
          action={<Button variant="tertiary" to="/insights/reports" icon={ArrowRight}>{t('All reports', 'அனைத்து அறிக்கைகளும்')}</Button>}
        />
        {reports.loading ? (
          <Skeleton height="18rem" count={1} />
        ) : (
          <RevealGroup className="grid grid-3 insights-reports">
            {reportList.map((r) => <ReportCard key={r.slug} report={r} />)}
          </RevealGroup>
        )}
      </Section>
      )}

      {/* Stories (M14): hidden until at least one real story is published */}
      {(stories.loading || storyList.length > 0) && (
      <Section surface="white">
        <SectionHeader
          eyebrow={t('Founder stories', 'நிறுவனர் கதைகள்')}
          title={t('Founders, in their own words', 'நிறுவனர்கள், அவர்களின் சொந்த வார்த்தைகளில்')}
          action={<Button variant="tertiary" to="/insights/stories" icon={ArrowRight}>{t('Read more stories', 'மேலும் கதைகளைப் படியுங்கள்')}</Button>}
        />
        {stories.loading ? (
          <Skeleton height="16rem" />
        ) : (
          <Scroller label={t('Founder stories', 'நிறுவனர் கதைகள்')} itemWidth="min(20rem, 82vw)">
            {storyList.map((s) => <StoryCard key={s.slug} story={s} />)}
          </Scroller>
        )}
      </Section>
      )}

      {/* Newsletter strip */}
      <Section surface="sunken" id="insights-newsletter" width="narrow" pad="sm">
        <div className="insights-news" ref={newsRef}>
          <div>
            <p className="eyebrow">{t('Insights newsletter', 'நுண்ணறிவுகள் செய்திமடல்')}</p>
            <h2 className="h2">{t('New data, once a quarter', 'புதிய தரவு, காலாண்டுக்கு ஒருமுறை')}<span className="dot">.</span></h2>
          </div>
          <NewsletterForm compact defaultTopics={['ledger']} />
        </div>
      </Section>
    </>
  );
}

const REPORT_MATCH = {
  ledger: /^founder-ledger/, report: /tn-founder-report/, fri: /founder-readiness/, cii: /campus-innovation/,
  rci: /research-commercialisation/, wfr: /women-founders/, sector: /sector|saas|genai|d2c/,
};
function findReport(list, key) {
  const re = REPORT_MATCH[key];
  return re ? (list || []).find((r) => re.test(r.slug || '')) : null;
}

function CollectionStatus({ c, report, period }) {
  const { t } = useLang();
  if (report?.status === 'published') return <Badge kind="type">{t('Published', 'வெளியிடப்பட்டது')} {report.year}</Badge>;
  if (report?.statusLabel && !(c.status === 'ledger' && period)) {
    return <span className="insights-status"><LocalText text={report.statusLabel} textTa={report.statusLabelTa} /></span>;
  }
  if (c.planned) return <Badge kind="type">{t('Planned', 'திட்டமிடப்பட்டது')}</Badge>;
  if (c.status === 'ledger') {
    return (
      <span className="insights-status">
        {period ? (
          <span className="insights-status__text">{t('Latest edition', 'சமீபத்திய பதிப்பு')}: {period}</span>
        ) : null}
      </span>
    );
  }
  if (c.status === 'report') {
    // No published edition and no status label yet: no status chip (rather than a placeholder).
    return report?.status === 'published' ? (
      <Badge kind="type">{t('Published', 'வெளியிடப்பட்டது')} {report.year}</Badge>
    ) : null;
  }
  return null;
}
