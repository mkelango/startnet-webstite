// T08 Ledger dashboard (Book 1 Part B §6.2, Book 3 Part B §4). Oct 2026 redesign: ink hero band, then the data on
// paper sheets drawn in the calm USVC "blueprint" manner (hairline frames, light numerals between vertical dividers).
// Copy: Book 2 §6.2 verbatim. Tamil: drafts pending native review (Book 2 §14); "Founder Ledger" and
// "Mission 1 Lakh" stay Latin. API labels use labelTa when supplied.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, History, BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import { Seo, PageHero, Section, SectionHeader, Stat, TagChip, Button, Reveal, RevealGroup } from '../../components';
import { isPlaceholderText, realMetrics } from '../../components/_placeholders.js';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { webPageLd, itemListLd, langPath, ORG_REF, absUrl } from '../../lib/seo.js';
import { formatNumber } from '../../lib/format.js';
import { LocalText } from './RichText.jsx';
import { ChartFigure, ColumnChart, BarChart, ChartLegend, MissionDial, ShareMeter } from './LedgerCharts.jsx';
import {
  LEVELS, MISSION_TARGET, WOMEN_FLOOR,
  periodInfo, periodOptions, findKpi, normaliseLevels, normaliseBrands, normaliseDistricts,
  normaliseCorrections, outsideMetroShare, ledgerCSV, hasLedgerValues, downloadText, fmtDate, levelName, levelRule, withKpiTa, ledgerDatasetLd, LEDGER_MEASURES,
} from './ledgerUtils.js';
import './FounderLedger.css';
import '../utility/restKit.css';


// `label` is also the match key against /api/ledger outcomes rows, so it stays English.
const OUTCOMES = [
  { re: /regist|compan|startups? launched|launched/, label: 'Companies registered', labelTa: 'பதிவு செய்யப்பட்ட நிறுவனங்கள்' },
  { re: /capital|raised|funding/, label: 'Capital raised', labelTa: 'திரட்டிய மூலதனம்' },
  { re: /pilot|contract/, label: 'Pilots signed', labelTa: 'கையெழுத்தான பைலட் ஒப்பந்தங்கள்' },
  { re: /job/, label: 'Jobs created', labelTa: 'உருவான வேலைவாய்ப்புகள்' },
];

const SEVERITY = { minor: ['Minor', 'சிறியது'], material: ['Material', 'முக்கியமானது'], critical: ['Critical', 'மிக முக்கியமானது'] };

/** Metric.sourceType values (Book 1 Part B §8). */
const EVIDENCE = {
  snx: ['StartNet X record', 'StartNet X பதிவு'],
  registry: ['Registry', 'அரசுப் பதிவேடு'],
  document: ['Document', 'ஆவணம்'],
  'self-reported': ['Self-reported', 'சுயமாகத் தெரிவித்தது'],
  'third-party': ['Third party', 'மூன்றாம் தரப்பு'],
};

function useFirstVisit(key) {
  const [first] = useState(() => {
    try { return !window.localStorage.getItem(key); } catch { return true; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, '1'); } catch { /* storage unavailable */ }
  }, [key]);
  return first;
}

export default function FounderLedger() {
  const { t, lang } = useLang();
  const [period, setPeriod] = useState('');
  const { data, loading, error } = useApi(period ? `/api/ledger?period=${encodeURIComponent(period)}` : '/api/ledger');
  // Refetch keeps the frame: hold the last good response while a new edition loads.
  const last = useRef(null);
  if (data) last.current = data;
  const d = data || last.current || {};
  const refetching = loading && !!last.current;
  const loc = withKpiTa;
  const date = (iso) => fmtDate(iso, lang);

  const p = periodInfo(d);
  const options = periodOptions(d);
  const kpis = d.kpis || [];
  const levels = useMemo(() => normaliseLevels(d), [d]);
  const brands = useMemo(() => normaliseBrands(d), [d]);
  const districts = useMemo(() => normaliseDistricts(d), [d]);
  const corrections = useMemo(() => normaliseCorrections(d), [d]);
  const metroShare = useMemo(() => outsideMetroShare(districts), [districts]);
  const nurtured = findKpi(kpis, /nurtur|l2\+/);
  const women = findKpi(kpis, /women/);
  const womenValue = women?.value ?? d.womenShare?.value ?? null;
  const womenFloor = d.womenShare?.floor ?? WOMEN_FLOOR;
  // Figures with no value yet are left out of every block; a block with no real figure is hidden (approved rule).
  const headline = realMetrics(kpis.filter((k) => k !== women)).slice(0, 4);
  const methodOpenFirst = useFirstVisit('sn-ledger-method-seen');
  const [methodOpen, setMethodOpen] = useState(methodOpenFirst);

  const asAt = p.asAt;
  const fileStem = `startnet-founder-ledger-${p.id || 'latest'}`;
  const onCsv = () => downloadText(`${fileStem}.csv`, ledgerCSV(d));
  // Like the charts (ChartFigure hides when empty): no CSV control while the file would hold measure names only.
  const csvReady = hasLedgerValues(d);

  const brandTag = brands.find((b) => b.tag)?.tag;
  const levelTag = levels.find((l) => l.tag)?.tag;
  const hasLevels = levels.some((l) => l.value != null);
  const hasBrands = brands.some((b) => b.nurtured != null);
  const districtRows = [...districts].filter((r) => r.nurtured != null).sort((a, b) => b.nurtured - a.nurtured).slice(0, 12);
  const districtName = (r) => (lang === 'ta' && r.nameTa) || r.name;
  const pending = !data && !last.current && loading;
  const hasPub = !!p.published || (!!p.publishedLabel && !isPlaceholderText(p.publishedLabel));
  const hasNext = !!p.next || (!!p.nextLabel && !isPlaceholderText(p.nextLabel));
  const outcomeItems = OUTCOMES.map((o) => {
    const row = (d.outcomes || []).find((r) => (r.label || '').toLowerCase() === o.label.toLowerCase()) || findKpi(d.outcomes, o.re);
    const kpi = findKpi(kpis, o.re);
    const metric = row?.value != null && row?.tag ? row : kpi?.value != null ? kpi : null;
    const evidence = metric?.sourceType || metric?.evidence || row?.evidence || kpi?.sourceType;
    const evidenceText = evidence ? (EVIDENCE[evidence] ? t(...EVIDENCE[evidence]) : evidence) : null;
    return { o, metric, evidenceText };
  }).filter((x) => x.metric);

  // Dataset node names the measures only; no figure (all null or placeholder until the first edition) is claimed.
  const jsonLd = ledgerDatasetLd({
    id: p.id,
    label: p.label,
    path: '/insights/founder-ledger',
    lang,
    description: 'Founders nurtured, companies launched, capital raised and pilots signed in Tamil Nadu, by level, brand and district, each with an A/B/C confidence tag.',
    published: p.published,
    orgRef: ORG_REF,
    absUrl,
    measures: LEDGER_MEASURES,
  });

  return (
    <div className="ledger">
      <Seo
        // Primary keyword: "startups by district" (Book 1 §9.2 Data). SEO-TA: pending native review.
        title={t('Founder Ledger: Tamil Nadu founders by district', 'Founder Ledger: மாவட்ட வாரியான நிறுவனர்கள்')}
        description={t(
          'Founders nurtured, companies launched, capital raised and pilots signed in Tamil Nadu, by level, brand and district, each with an A/B/C confidence tag.',
          'வளர்க்கப்பட்ட நிறுவனர்கள், தொடங்கிய நிறுவனங்கள், திரட்டிய மூலதனம், பைலட் ஒப்பந்தங்கள்: நிலை, பிராண்டு, மாவட்ட வாரியாக, A/B/C குறியுடன்.',
        )}
        jsonLd={jsonLd}
      />

      <PageHero
        className="rk-page"
        surface="night"
        eyebrow={t('Insights', 'நுண்ணறிவுகள்')}
        title="Founder Ledger"
        lede={t(
          'Every quarter we publish how many people moved up the founder ladder through StartNet, by brand and district, with a confidence tag on every figure and a log of what we corrected.',
          'StartNet வழியாக எத்தனை பேர் நிறுவனர் ஏணியில் முன்னேறினார்கள் என்பதை ஒவ்வொரு காலாண்டும் பிராண்டு, மாவட்டம் வாரியாக வெளியிடுகிறோம்; ஒவ்வொரு எண்ணுக்கும் நம்பகத்தன்மைக் குறியும், நாங்கள் திருத்தியவற்றின் பதிவும் உண்டு.',
        )}
        breadcrumbs={[{ label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' }, { label: 'Founder Ledger' }]}
        meta={
          // Reserved height (FounderLedger.css) so the line filling in from /api/ledger does not shift the page.
          <p className={`ledger__edition-meta${pending ? ' is-pending' : ''}`} aria-busy={pending || undefined}>
            {p.edition && <span className="ledger__edition-name">{p.edition}{hasPub || hasNext ? ' · ' : ''}</span>}
            {/* Dates that are still placeholders are left out of the line. */}
            {p.published ? (
              <>{t('Published', 'வெளியீடு')} {date(p.published)}</>
            ) : hasPub ? (
              <LocalText text={p.publishedLabel} textTa={d.publishedLabelTa} />
            ) : null}
            {hasNext && (
              <>
                {hasPub ? ' · ' : ''}{t('Next edition', 'அடுத்த பதிப்பு')}{' '}
                {p.next ? date(p.next) : <LocalText text={p.nextLabel} textTa={d.nextEditionLabelTa} />}
              </>
            )}
          </p>
        }
      />

      {/* The first sheet carries the sticky edition bar and every data block below it. */}
      <div className="ledger__sheet">
      {/* Period selector — sticky on desktop */}
      <div className="ledger__bar" role="region" aria-label={t('Edition and downloads', 'பதிப்பும் பதிவிறக்கங்களும்')}>
        <div className="container ledger__bar-inner">
          <label className="ledger__period">
            <span className="ledger__period-label">{t('Edition', 'பதிப்பு')}</span>
            <span className="ledger__select-wrap">
              <select
                value={period || p.id || ''}
                onChange={(e) => setPeriod(e.target.value)}
                disabled={options.length < 2}
                aria-describedby="ledger-period-note"
              >
                {options.length === 0 && <option value="">{t('Latest quarter', 'சமீபத்திய காலாண்டு')}</option>}
                {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </span>
          </label>
          <span id="ledger-period-note" className="ledger__bar-note" aria-live="polite">
            {/* No as-at date yet: nothing (rather than "As at [date]"). */}
            {refetching ? t('Loading edition…', 'பதிப்பு ஏற்றப்படுகிறது…') : asAt ? `${t('As at', 'நிலவரம்')} ${date(asAt)}` : ''}
          </span>
          <span className="ledger__bar-actions">
            {csvReady && (
              <button type="button" className="ledger__dl" onClick={onCsv} disabled={!data && !last.current}>
                <Download size={16} aria-hidden="true" /> {t('Download CSV', 'CSV பதிவிறக்கம்')}
              </button>
            )}
            {/* The PDF control appears once StartNet supplies the PDF (no disabled placeholder control). */}
          </span>
        </div>
      </div>

      {error && !last.current && (
        <div className="container">
          <p className="ledger__notice" role="status">
            {t(
              // Empty blocks are hidden now, so the "structure below" clause is left out.
              "We couldn't load this edition just now. Try again in a moment.",
              'இந்தப் பதிப்பை இப்போது ஏற்ற முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயலவும்.',
            )}
          </p>
        </div>
      )}

      <div className={refetching ? 'ledger__frame is-refetching' : 'ledger__frame'} aria-busy={loading}>
        {/* KPI band 4-up: hidden until at least one headline figure is published */}
        {headline.length > 0 && (
        <Section pad="sm" labelledBy="ledger-kpis-title" className="ledger-sec ledger-sec--kpis">
          <h2 id="ledger-kpis-title" className="visually-hidden">{t('Headline figures', 'முக்கிய எண்கள்')}</h2>
          <RevealGroup className="ledger-kpis" key={`k-${p.id}`}>
            {headline.map((k) => (
              <div className="ledger-kpis__item" key={k.id || k.key}>
                <Stat metric={loc(k)} variant="hero" />
              </div>
            ))}
          </RevealGroup>
          <p className="ledger-kpis__rule">
            <span className="ledger-kpis__rule-item">
              <TagChip tag="A" /> <span>{t('verified against a primary source', 'முதன்மை ஆதாரத்துடன் சரிபார்க்கப்பட்டது')}</span>
            </span>
            <span className="ledger-kpis__rule-item">
              <TagChip tag="B" /> <span>{t('reported by the founder or organisation', 'நிறுவனர் அல்லது அமைப்பு தெரிவித்தது')}</span>
            </span>
            <span className="ledger-kpis__rule-item">
              <TagChip tag="C" /> <span>{t('estimate.', 'மதிப்பீடு அல்லது திட்டமிடல் அனுமானம்.')}</span>
            </span>
            <span className="ledger-kpis__rule-note">
              {t('C-tagged figures are never summed into A or B.', 'C எண்கள் A அல்லது B உடன் ஒருபோதும் கூட்டப்படுவதில்லை.')}
            </span>
          </p>
        </Section>
        )}

        {/* Block 1: Mission 1 Lakh dial */}
        <Section labelledBy="ledger-mission-title" className="ledger-sec">
          <div className="ledger-mission">
            <Reveal className="ledger-mission__dial">
              <MissionDial
                value={nurtured?.value ?? null}
                target={MISSION_TARGET}
                label={
                  nurtured?.value != null
                    ? t(
                      `${formatNumber(nurtured.value)} of 1,00,000 founders nurtured (L2+), target March 2031`,
                      `1,00,000 நிறுவனர்களில் ${formatNumber(nurtured.value)} பேர் வளர்க்கப்பட்டனர் (L2+), இலக்கு மார்ச் 2031`,
                    )
                    : t(
                      'Figure to be supplied of 1,00,000 founders nurtured (L2+), target March 2031',
                      '1,00,000 வளர்க்கப்பட்ட நிறுவனர்கள் (L2+) இலக்கில் தற்போதைய எண் இனிமேல் வழங்கப்படும், இலக்கு மார்ச் 2031',
                    )
                }
              />
            </Reveal>
            <div className="ledger-mission__copy stack">
              <p className="eyebrow">Mission 1 Lakh</p>
              <h2 id="ledger-mission-title" className="h2">
                {t('Towards 1,00,000 founders nurtured', '1,00,000 வளர்க்கப்பட்ட நிறுவனர்களை நோக்கி')}<span className="dot">.</span>
              </h2>
              {/* The nurtured count shows once published (the dial's label already says it is to be supplied). */}
              {nurtured?.value != null && (
                <div className="ledger-mission__stat">
                  <Stat metric={loc(nurtured)} variant="default" />
                </div>
              )}
              <p className="ledger-mission__target">
                {t('Target March 2031', 'இலக்கு: மார்ச் 2031')} <TagChip tag="C" />
              </p>
              <blockquote className="ledger-mission__reality">
                <p>
                  {t(
                    "\"Mission 1 Lakh is ambitious. If our 2028 review shows it is out of reach, we will reset the goal in public rather than change what 'nurtured' means.\"",
                    '"Mission 1 Lakh ஒரு பெரிய இலக்கு. 2028 மதிப்பாய்வில் அது எட்ட முடியாதது எனத் தெரிந்தால், ‘வளர்க்கப்பட்டவர்’ என்பதன் பொருளை மாற்றாமல், இலக்கையே பொதுவெளியில் மாற்றி அமைப்போம்."',
                  )}
                </p>
              </blockquote>
            </div>
          </div>
        </Section>

        {/* Blocks 2 & 3: charts 2-up (hidden until the ladder or brand figures are published) */}
        {(hasLevels || hasBrands) && (
        <Section surface="white" className="ledger-sec">
          <SectionHeader eyebrow={t('This quarter', 'இந்தக் காலாண்டு')} title={t('The ladder and the brands', 'ஏணியும் பிராண்டுகளும்')} as="h2" />
          <div className="ledger-charts">
            <ChartFigure
              id="ledger-ladder"
              title={t('The ladder this quarter', 'இந்தக் காலாண்டில் ஏணி')}
              subtitle={t(
                'People at each founder level, L1–L7. L1 is tracked but not counted as nurtured.',
                'ஒவ்வொரு நிறுவனர் நிலையிலும் உள்ளவர்கள், L1–L7. L1 பதிவு செய்யப்படும், ஆனால் "வளர்க்கப்பட்டவர்" எனக் கணக்கிடப்படாது.',
              )}
              tag={levelTag}
              asAt={asAt}
              empty={!hasLevels}
              csvName={`${fileStem}-ladder.csv`}
              table={{
                columns: [t('Level', 'நிலை'), t('People', 'நபர்கள்'), t('Change on last quarter', 'கடந்த காலாண்டை விட மாற்றம்'), t('Tag', 'குறி')],
                rows: levels.map((l) => [
                  `${l.code} ${levelName(l, lang)}`,
                  l.value != null ? formatNumber(l.value) : '',
                  l.change != null ? `${l.change > 0 ? '+' : ''}${formatNumber(l.change)}` : '',
                  l.tag || '',
                ]),
              }}
            >
              <ColumnChart
                label={t('Column chart: people at each founder level', 'நெடுவரிசை வரைபடம்: ஒவ்வொரு நிறுவனர் நிலையிலும் உள்ளவர்கள்')}
                data={levels.map((l) => ({ key: l.code, label: l.code, sublabel: levelName(l, lang), value: l.value, tag: l.tag, tone: l.code === 'L1' ? 'context' : 'focus' }))}
              />
              <ChartLegend
                items={[
                  { tone: 'context', label: t('L1 Aware (tracked, not counted)', 'L1 அறிமுகம் (பதிவு மட்டும், கணக்கில் இல்லை)') },
                  { tone: 'focus', label: t('L2–L7 (counted as nurtured)', 'L2–L7 (“வளர்க்கப்பட்டவர்” கணக்கில்)') },
                ]}
              />
            </ChartFigure>

            <ChartFigure
              id="ledger-brands"
              title={t('Founders nurtured by brand', 'பிராண்டு வாரியாக வளர்க்கப்பட்ட நிறுவனர்கள்')}
              subtitle={t(
                'People at L2 or above, by the StartNet brand they came through.',
                'L2 அல்லது அதற்கு மேல் உள்ளவர்கள், அவர்கள் வந்த StartNet பிராண்டு வாரியாக.',
              )}
              tag={brandTag}
              asAt={asAt}
              empty={!hasBrands}
              csvName={`${fileStem}-brands.csv`}
              table={{
                columns: [t('Brand', 'பிராண்டு'), t('Nurtured', 'வளர்க்கப்பட்டவர்'), t('Launched', 'தொடங்கியவர்'), t('Funded', 'நிதி பெற்றவர்'), t('Tag', 'குறி')],
                rows: brands.map((b) => [b.name, b.nurtured != null ? formatNumber(b.nurtured) : '', b.launched != null ? formatNumber(b.launched) : '', b.funded != null ? formatNumber(b.funded) : '', b.tag || '']),
              }}
            >
              <BarChart
                label={t('Bar chart: founders nurtured by brand', 'பட்டை வரைபடம்: பிராண்டு வாரியாக வளர்க்கப்பட்ட நிறுவனர்கள்')}
                data={brands.map((b) => ({ key: b.key, label: b.name, value: b.nurtured, tag: b.tag, tone: b.key }))}
              />
            </ChartFigure>
          </div>

          {/* Block 3: brand table. The title sits outside the scroll box so it is never clipped. */}
          {hasBrands && (
          <>
          <h3 className="ledger-table__title" id="ledger-brand-table-title">
            {t('By brand: nurtured, launched and funded', 'பிராண்டு வாரியாக: வளர்க்கப்பட்டவர், தொடங்கியவர், நிதி பெற்றவர்')}
          </h3>
          <Reveal
            className="ledger-table-wrap ledger-table-wrap--fade"
            tabIndex={0}
            role="region"
            aria-labelledby="ledger-brand-table-title"
          >
            <table className="ledger-table ledger-table--brands">
              <caption className="visually-hidden">
                {t('By brand: nurtured, launched and funded', 'பிராண்டு வாரியாக: வளர்க்கப்பட்டவர், தொடங்கியவர், நிதி பெற்றவர்')}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t('Brand', 'பிராண்டு')}</th>
                  <th scope="col">{t('Nurtured', 'வளர்க்கப்பட்டவர்')}</th>
                  <th scope="col">{t('Launched', 'தொடங்கியவர்')}</th>
                  <th scope="col">{t('Funded', 'நிதி பெற்றவர்')}</th>
                  <th scope="col">{t('Tag', 'குறி')}</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.key}>
                    <th scope="row">
                      <span className="ledger-table__brand-name">
                        <span className={`ledger-table__brand ledger-table__brand--${b.key}`} aria-hidden="true" />
                        {b.name}
                      </span>
                    </th>
                    {['nurtured', 'launched', 'funded'].map((m) => (
                      <td key={m}>{b[m] != null ? formatNumber(b[m]) : '–'}</td>
                    ))}
                    <td>{b.tag ? <TagChip tag={b.tag} /> : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          </>
          )}
        </Section>
        )}

        {/* Block 4: by district (hidden until district figures are published) */}
        {(districtRows.length > 0 || !!metroShare) && (
        <Section className="ledger-sec">
          <SectionHeader
            eyebrow={t('By district', 'மாவட்ட வாரியாக')}
            title={t('Where founders are coming from', 'நிறுவனர்கள் எங்கிருந்து வருகிறார்கள்')}
            lede={t(
              'We report the share of founders from outside Chennai, Coimbatore and Kancheepuram, so growth beyond the three metros is visible.',
              'சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த பகுதிகளிலிருந்து வரும் நிறுவனர்களின் பங்கை வெளியிடுகிறோம்; இதனால் மூன்று பெருநகரங்களுக்கு அப்பாலான வளர்ச்சி தெரியும்.',
            )}
          />
          <div className="ledger-district">
            <ChartFigure
              id="ledger-districts"
              title={t('Founders nurtured, top districts', 'வளர்க்கப்பட்ட நிறுவனர்கள், முன்னணி மாவட்டங்கள்')}
              subtitle={t(
                'People at L2 or above, by home district. Up to 12 districts shown; the full list is in the table and the CSV.',
                'L2 அல்லது அதற்கு மேல் உள்ளவர்கள், சொந்த மாவட்ட வாரியாக. அதிகபட்சம் 12 மாவட்டங்கள் காட்டப்படும்; முழுப் பட்டியல் அட்டவணையிலும் CSV‑யிலும் உள்ளது.',
              )}
              tag={districtRows.find((r) => r.tag)?.tag}
              asAt={asAt}
              empty={!districtRows.length}
              csvName={`${fileStem}-districts.csv`}
              table={{
                columns: [t('District', 'மாவட்டம்'), t('Nurtured', 'வளர்க்கப்பட்டவர்'), t('Launched', 'தொடங்கியவர்'), t('Tag', 'குறி')],
                rows: districts.map((r) => [districtName(r), r.nurtured != null ? formatNumber(r.nurtured) : '', r.launched != null ? formatNumber(r.launched) : '', r.tag || '']),
              }}
            >
              <BarChart
                label={t('Bar chart: founders nurtured by district', 'பட்டை வரைபடம்: மாவட்ட வாரியாக வளர்க்கப்பட்ட நிறுவனர்கள்')}
                data={districtRows.map((r) => ({ key: r.name, label: districtName(r), value: r.nurtured, tag: r.tag, tone: r.metro ? 'context' : 'focus' }))}
              />
              <ChartLegend
                items={[
                  { tone: 'focus', label: t('Outside the three metros', 'மூன்று பெருநகரங்களுக்கு வெளியே') },
                  { tone: 'context', label: t('Chennai, Coimbatore, Kancheepuram', 'சென்னை, கோயம்புத்தூர், காஞ்சிபுரம்') },
                ]}
              />
            </ChartFigure>

            <aside className="ledger-district__aside stack">
              <div className="ledger-district__share">
                {metroShare && (
                  <Stat
                    value={metroShare.value}
                    unit="%"
                    label={
                      metroShare.field === 'launched'
                        ? t('Share of launched founders from outside Chennai, Coimbatore and Kancheepuram', 'சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த பகுதிகளிலிருந்து தொடங்கிய நிறுவனர்களின் பங்கு')
                        : t('Share of nurtured founders from outside Chennai, Coimbatore and Kancheepuram', 'சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த பகுதிகளிலிருந்து வளர்க்கப்பட்ட நிறுவனர்களின் பங்கு')
                    }
                    tag={metroShare.tag}
                    asAt={asAt}
                    source={t('StartNet Founder Ledger, district table (derived)', 'StartNet Founder Ledger, மாவட்ட அட்டவணை (கணக்கிடப்பட்டது)')}
                  />
                )}
              </div>
              <div className="ledger-district__map">
                {/* The "District map: [placeholder]" sentence is left out until the boundary data is confirmed. */}
                <p className="caption">
                  {t('The table below is the canonical view.', 'கீழே உள்ள அட்டவணையே அதிகாரப்பூர்வப் பார்வை.')}
                </p>
              </div>
            </aside>
          </div>
          <DistrictTable rows={districts} />
        </Section>
        )}

        {/* Blocks 5 & 6: outcomes + women share */}
        <Section surface="white" className="ledger-sec">
          <div className={`ledger-outcomes${outcomeItems.length ? '' : ' ledger-outcomes--solo'}`}>
            {/* "What founders built" shows only the outcomes that have a published figure; hidden when none has. */}
            {outcomeItems.length > 0 && (
            <div>
              <SectionHeader eyebrow={t('Outcomes', 'விளைவுகள்')} title={t('What founders built', 'நிறுவனர்கள் உருவாக்கியவை')} as="h2" />
              <RevealGroup className="ledger-outcomes__grid" key={`o-${p.id || 'ph'}-${kpis.length}`}>
                {outcomeItems.map(({ o, metric, evidenceText }) => (
                  <div className="ledger-outcomes__item" key={o.label}>
                    <Stat metric={loc(metric)} variant="compact" />
                    {evidenceText && (
                      <p className="ledger-outcomes__evidence">
                        {t('Evidence type', 'சான்று வகை')}: {evidenceText}
                      </p>
                    )}
                  </div>
                ))}
              </RevealGroup>
            </div>
            )}
            <div className="ledger-women">
              <SectionHeader eyebrow={t('Women share', 'பெண்களின் பங்கு')} title={t('Against a 40% floor', '40% குறைந்தபட்ச இலக்குக்கு எதிராக')} as={outcomeItems.length ? 'h3' : 'h2'} />
              {women?.value != null && <Stat metric={loc(women)} variant="default" />}
              <ShareMeter
                value={womenValue}
                floor={womenFloor}
                label={
                  womenValue != null
                    ? t(`Women share ${womenValue}% against a ${womenFloor}% floor`, `பெண்களின் பங்கு ${womenValue}%, குறைந்தபட்ச இலக்கு ${womenFloor}%`)
                    : t(`Women share to be supplied against a ${womenFloor}% floor`, `பெண்களின் பங்கு இனிமேல் வழங்கப்படும், குறைந்தபட்ச இலக்கு ${womenFloor}%`)
                }
              />
              <p className="caption">
                {t('The 40% floor is a target', '40% குறைந்தபட்சம் ஓர் இலக்கு')} <TagChip tag="C" />{' '}
                {t('across all StartNet programmes.', '(அனைத்து StartNet திட்டங்களிலும்).')}
              </p>
            </div>
          </div>
        </Section>

        {/* Method */}
        <Section id="method" labelledBy="ledger-method-title" className="ledger-sec">
          <details className="ledger-method" open={methodOpen} onToggle={(e) => setMethodOpen(e.currentTarget.open)}>
            <summary>
              <span className="ledger-method__eyebrow eyebrow"><BookOpen size={16} aria-hidden="true" /> {t('Method', 'முறையியல்')}</span>
              <h2 id="ledger-method-title" className="h3">{t('How we count', 'நாங்கள் எப்படி எண்ணுகிறோம்')}</h2>
              <ChevronDown className="ledger-method__chev" size={22} aria-hidden="true" />
            </summary>
            <div className="ledger-method__body">
              <ul className="ledger-method__list">
                {lang === 'ta' ? (
                  <>
                    <li>L1–L7 வரையறைகள் (<a href="#ledger-levels">கீழே</a> மற்றும் <ButtonLink to="/about/mission-1-lakh#ladder">எங்கள் மாதிரி</ButtonLink> பார்க்கவும்).</li>
                    <li><em>பங்களிப்பு விதி:</em> நிறுவனம் பதிவு செய்யப்படுவதற்கு முன் ஒரு நிறுவனர் StartNet திட்டத்தில் L3 நிலையை அடைந்திருந்தால் மட்டுமே அந்த ஸ்டார்ட்அப் கணக்கில் வரும்.</li>
                    <li>குறிகள்: A முதன்மை ஆதாரத்துடன் சரிபார்க்கப்பட்டது; B நிறுவனர் அல்லது அமைப்பு தெரிவித்தது; C மதிப்பீடு.</li>
                    <li>நிறுவனர்களின் ஒப்புதலுடன் StartNet X‑இலிருந்து தரவு பெறப்படுகிறது. அனுமதி இல்லாமல் எந்த நிறுவனரின் பெயரும் வெளியிடப்படாது.</li>
                  </>
                ) : (
                  <>
                    <li>Definitions of L1–L7 (see <a href="#ledger-levels">below</a> and <ButtonLink to="/about/mission-1-lakh#ladder">Our model</ButtonLink>).</li>
                    <li><em>Attribution rule:</em> a startup counts only if a founder reached L3 in a StartNet programme before the company was registered.</li>
                    <li>Tags: A verified against a primary source; B reported by the founder or organisation; C estimate.</li>
                    <li>Data comes from StartNet X with founders' consent. Individual founders are never named without their permission.</li>
                  </>
                )}
              </ul>
              <ol className="ledger-levels" id="ledger-levels">
                {LEVELS.map((l) => (
                  <li key={l.code}>
                    <span className="ledger-levels__code">{l.code}</span>
                    <span className="ledger-levels__name">{levelName(l, lang)}</span>
                    <span className="ledger-levels__rule">{levelRule(l, lang)}</span>
                  </li>
                ))}
              </ol>
              <Button variant="tertiary" to="/about/evidence-standard" icon={ArrowRight}>{t('Read our evidence standard', 'எங்கள் சான்றுத் தரத்தைப் படிக்கவும்')}</Button>
            </div>
          </details>
        </Section>

        {/* Corrections */}
        <Section id="corrections" className="ledger-sec">
          <SectionHeader
            eyebrow={t('Corrections log', 'திருத்தப் பதிவேடு')}
            title={t('Corrections this edition', 'இந்தப் பதிப்பின் திருத்தங்கள்')}
            action={<Button variant="secondary" size="sm" to="/contact?topic=correction">{t('Report a correction', 'திருத்தத்தைத் தெரிவிக்கவும்')}</Button>}
          />
          {corrections.length ? (
            <div
              className="ledger-table-wrap ledger-table-wrap--fade"
              tabIndex={0}
              role="region"
              aria-label={t('Corrections this edition', 'இந்தப் பதிப்பின் திருத்தங்கள்')}
            >
              <table className="ledger-table ledger-table--corrections">
                <caption className="visually-hidden">
                  {t('Corrections this edition: date, what changed, severity and why', 'இந்தப் பதிப்பின் திருத்தங்கள்: தேதி, என்ன மாறியது, தீவிரம், காரணம்')}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t('Date', 'தேதி')}</th>
                    <th scope="col">{t('What changed', 'என்ன மாறியது')}</th>
                    <th scope="col">{t('Severity', 'தீவிரம்')}</th>
                    <th scope="col">{t('Why', 'காரணம்')}</th>
                  </tr>
                </thead>
                <tbody>
                  {corrections.map((c) => {
                    const sev = (c.severity || '').toLowerCase();
                    return (
                      <tr key={c.id}>
                        <th scope="row">{c.date ? date(c.date) : '–'}</th>
                        <td lang={lang === 'ta' && !c.whatTa ? 'en' : undefined}>{(lang === 'ta' && c.whatTa) || c.what}</td>
                        <td><span className={`ledger-sev ledger-sev--${sev}`}>{SEVERITY[sev] ? t(...SEVERITY[sev]) : c.severity || '–'}</span></td>
                        <td lang={lang === 'ta' && !c.whyTa ? 'en' : undefined}>{(lang === 'ta' && c.whyTa) || c.why}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="ledger-empty">
              <History size={20} aria-hidden="true" />
              <p>{t('No corrections this quarter.', 'இந்தக் காலாண்டில் திருத்தங்கள் இல்லை.')}</p>
            </div>
          )}
        </Section>

        {/* Get this data: only once the CSV carries figures (an all-empty file is not data). */}
        {csvReady && (
        <Section pad="sm" labelledBy="ledger-data-title" className="ledger-sec">
          <div className="ledger-data">
            <div>
              <h2 id="ledger-data-title" className="h3">{t('Get this data', 'இந்தத் தரவைப் பெறுங்கள்')}<span className="dot">.</span></h2>
              <p className="text-2">
                {t(
                  'Every figure on this page in one CSV, with its tag, as-at date and source.',
                  'இந்தப் பக்கத்தின் ஒவ்வொரு எண்ணும் ஒரே CSV கோப்பில், அதன் குறி, நிலவரத் தேதி, ஆதாரத்துடன்.',
                )}
              </p>
            </div>
            <div className="cluster">
              <Button variant="primary" onClick={onCsv} icon={Download}>{t('Download CSV', 'CSV பதிவிறக்கம்')}</Button>
              <Button variant="tertiary" to="/insights" icon={ArrowRight}>{t('Insights', 'நுண்ணறிவுகள்')}</Button>
            </div>
          </div>
        </Section>
        )}
      </div>
      </div>
    </div>
  );
}

/** Small text link that stays inside the current language. */
function ButtonLink({ to, children }) {
  const { localePath } = useLang();
  return <Link to={localePath(to)}>{children}</Link>;
}

/** Sortable district table (canonical alternative to the map). */
function DistrictTable({ rows }) {
  const { t, lang } = useLang();
  const [sort, setSort] = useState({ key: 'nurtured', dir: 'desc' });
  const sorted = useMemo(() => {
    const out = [...rows];
    out.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (sort.key === 'name') return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return sort.dir === 'asc' ? av - bv : bv - av;
    });
    return out;
  }, [rows, sort]);
  const toggle = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : key === 'name' ? 'asc' : 'desc' }));
  const aria = (key) => (sort.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none');
  const head = (key, label) => (
    <th scope="col" aria-sort={aria(key)}>
      <button type="button" className="ledger-table__sort" onClick={() => toggle(key)}>
        {label}
        <span aria-hidden="true" className="ledger-table__sort-ind">{sort.key === key ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  );
  // No district rows yet: no table and no "District table: [placeholder]" line.
  if (!rows.length) return null;
  return (
    <div className="ledger-table-wrap ledger-table-wrap--scroll" tabIndex={0} role="region" aria-label={t('District table', 'மாவட்ட அட்டவணை')}>
      <table className="ledger-table">
        <caption className="visually-hidden">
          {t('Founders by district. Select a column heading to sort.', 'மாவட்ட வாரியாக நிறுவனர்கள். வரிசைப்படுத்த ஒரு நெடுவரிசைத் தலைப்பைத் தேர்ந்தெடுக்கவும்.')}
        </caption>
        <thead>
          <tr>
            {head('name', t('District', 'மாவட்டம்'))}
            {head('nurtured', t('Nurtured', 'வளர்க்கப்பட்டவர்'))}
            {head('launched', t('Launched', 'தொடங்கியவர்'))}
            <th scope="col">{t('Tag', 'குறி')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.name}>
              <th scope="row">
                {lang === 'ta' && r.nameTa ? (
                  <>
                    {r.nameTa}
                    <span className="ledger-table__ta" lang="en"> · {r.name}</span>
                  </>
                ) : (
                  <>
                    {r.name}
                    {r.nameTa && <span className="ledger-table__ta" lang="ta"> · {r.nameTa}</span>}
                  </>
                )}
              </th>
              <td>{r.nurtured != null ? formatNumber(r.nurtured) : '–'}</td>
              <td>{r.launched != null ? formatNumber(r.launched) : '–'}</td>
              <td>{r.tag ? <TagChip tag={r.tag} /> : '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
