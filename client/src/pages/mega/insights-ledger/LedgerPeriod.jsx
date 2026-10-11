// /insights/founder-ledger/:period — a frozen quarterly Ledger snapshot (T08, P1; Book 1 Part B §2.2 "Ledger period").
// Valid periods come from GET /api/ledger (period + optional periods[]); anything else renders NotFound.
// Layout mirrors the live Ledger (KPI band 4-up, ladder + brand charts 2-up, tagged tables, corrections): ink hero, paper sheets.
// Copy: Book 2 §6.2 (verbatim where it exists); Book 1 Part A §8.6 + Part B §9.5 (frozen snapshots, corrections).
import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Download, BookOpen, History, Lock } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Stat, TagChip, Button, Reveal, RevealGroup,
  InlineMarks, Badge, Skeleton, EmptyState, CTABand,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { formatDate } from '../../../lib/format.js';
import {
  periodInfo, normaliseLevels, normaliseBrands, normaliseDistricts, normaliseCorrections, ledgerCSV, hasLedgerValues, downloadText, WOMEN_FLOOR,
  ledgerDatasetLd, LEDGER_MEASURES,
} from '../../insights/ledgerUtils.js';
import { ORG_REF, absUrl } from '../../../lib/seo.js';
import { fitDescription } from '../../programmes/parts/seoFit.js';
import { ChartFigure, ColumnChart, BarChart, ChartLegend } from '../../insights/LedgerCharts.jsx';
import NotFound from '../../utility/LazyNotFound.jsx';
import { localLabel } from '../insights-reports/shared.js';
import { isPlaceholderText, realMetrics } from '../../../components/_placeholders.js';
import {
  LEVELS, REALITY_CHECK, SEVERITIES, EVIDENCE_LABEL, OUTCOME_TA, periodSlug, periodLabel, knownPeriods,
} from './ledgerShared.js';
import './LedgerPeriod.css';

const KPI_TA = {
  'founders-nurtured': 'வளர்க்கப்பட்ட நிறுவனர்கள் (L2+), இதுவரை',
  'startups-launched': 'தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), மொத்தம்',
  'capital-raised': 'StartNet நிறுவனர்கள் திரட்டிய முதலீடு',
  'pilots-signed': 'கையெழுத்தான பைலட்கள் மற்றும் ஒப்பந்தங்கள்',
  'women-share': 'பங்கேற்பாளர்களில் பெண்களின் பங்கு',
  'districts-active': 'திட்டங்கள் நடைபெறும் மாவட்டங்கள்',
};
/** Every number in a table cell still goes through Stat (value + tag popover); an unknown value is a plain dash. */
function Cell({ value, tag, unit }) {
  if (value == null || value === '') return '–';
  return <Stat value={value} tag={tag || undefined} unit={unit} variant="compact" countUp={false} className="ledger-period-cell" />;
}

export default function LedgerPeriod() {
  const { period: raw = '' } = useParams();
  const { t, lang, localePath } = useLang();
  const requested = periodSlug(raw);

  // 1) The live response tells us which periods exist.
  const base = useApi('/api/ledger');
  const valid = useMemo(() => knownPeriods(base.data), [base.data]);
  const current = periodSlug(base.data?.period);
  const isKnown = !!requested && valid.includes(requested);
  // 2) An older edition is fetched by period; the server must echo the same period back or we show placeholders.
  const needOther = isKnown && requested !== current;
  const other = useApi(needOther ? `/api/ledger?period=${encodeURIComponent(requested)}` : null);
  const d = needOther ? (periodSlug(other.data?.period) === requested ? other.data : null) : base.data;
  const loading = base.loading || (needOther && other.loading);

  const p = periodInfo(d || {});
  const kpis = d?.kpis || [];
  const levels = useMemo(() => normaliseLevels(d || {}), [d]);
  const brands = useMemo(() => normaliseBrands(d || {}), [d]);
  const districts = useMemo(() => normaliseDistricts(d || {}), [d]);
  const corrections = useMemo(() => normaliseCorrections(d || {}), [d]);

  // Invalid slug shape, or the API answered and does not know this period → 404 content.
  if (!requested) return <NotFound />;
  if (base.data && !isKnown) return <NotFound />;
  // Canonical slug is lower case: /insights/founder-ledger/2026-q4
  if (raw !== requested) return <Navigate replace to={localePath(`/insights/founder-ledger/${requested}`)} />;

  const label = periodLabel(requested);
  const asAt = p.asAt;
  const upcoming = !!d && p.upcoming;
  const isLatest = requested === current;
  const en = lang === 'ta' ? 'en' : undefined;
  const floor = typeof d?.womenShare?.floor === 'number' ? d.womenShare.floor : WOMEN_FLOOR;
  const women = kpis.find((k) => /women/.test(`${k.id} ${k.key}`));
  // Figures with no value yet are left out; blocks with no real figure are hidden (approved rule).
  const headline = realMetrics(kpis.filter((k) => k !== women)).slice(0, 4);
  const tr = (m) => ({ ...m, label: t(m.label, KPI_TA[m.id] || KPI_TA[m.key]) });
  const fileStem = `startnet-founder-ledger-${requested}`;
  const onCsv = () => d && downloadText(`${fileStem}.csv`, ledgerCSV(d));
  // No CSV control while the file would hold measure names only (as the empty charts are hidden).
  const csvReady = hasLedgerValues(d);
  const hasLevels = levels.some((l) => l.value != null);
  const hasBrands = brands.some((b) => b.nurtured != null);
  const hasDistricts = districts.some((r) => r.nurtured != null || r.launched != null);
  const outcomeRows = (d?.outcomes || []).filter((o) => o && o.value != null);
  // The planned-date label in the page language (publishedLabelTa when it belongs to this period).
  const publishedLbl = localLabel(p.publishedLabel, p.publishedLabel === d?.publishedLabel ? d?.publishedLabelTa : undefined, lang);
  const hasPublished = !!p.published || (!!p.publishedLabel && !isPlaceholderText(p.publishedLabel));
  const levelName = (code) => {
    const l = LEVELS.find((x) => x.code === code);
    return l ? t(l.name[0], l.name[1]) : code;
  };

  // Dataset node names the measures only (no figure is claimed: values are null/placeholder until published).
  const jsonLd = ledgerDatasetLd({
    id: requested,
    label,
    path: `/insights/founder-ledger/${requested}`,
    lang,
    description: `The StartNet Founder Ledger for ${label}: founders nurtured, companies launched, capital raised and pilots signed in Tamil Nadu, by level, brand and district, each with an A/B/C confidence tag.`,
    published: p.published,
    orgRef: ORG_REF,
    absUrl,
    measures: LEDGER_MEASURES,
  });
  // "Frozen as published" only once the edition is published; before that, its planned date from the data.
  const plannedLine = upcoming ? (lang === 'ta' && d?.publishedLabelTa) || d?.publishedLabel || p.publishedLabel : null;

  return (
    <div className="ledger-period">
      {/* SEO-TA: pending native review */}
      <Seo
        title={t(`Founder Ledger ${label}: Tamil Nadu founder count`, `Founder Ledger ${label}: காலாண்டு நிறுவனர் கணக்கு`)}
        description={fitDescription(
          t(
            `The Founder Ledger for ${label}: founders in Tamil Nadu by level, brand and district, each figure with an A/B/C confidence tag.`,
            `${label}-க்கான Founder Ledger: நிலை, பிராண்டு, மாவட்ட வாரியாகத் தமிழ்நாட்டு நிறுவனர்கள்; ஒவ்வொரு எண்ணுக்கும் A/B/C குறி.`
          ),
          upcoming
            ? plannedLine
            : t('Frozen as published; corrections are logged.', 'வெளியிட்டபடியே; திருத்தங்கள் பதிவு செய்யப்படுகின்றன.')
        )}
        jsonLd={jsonLd}
      />

      <PageHero
        surface="night"
        eyebrow={t('Founder Ledger edition', 'Founder Ledger பதிப்பு')}
        title={`Founder Ledger ${label}.`}
        lede={t(
          'A frozen snapshot of this quarter’s count. If a figure is corrected later, the correction is logged with its date and this page stays as it was published.',
          'இந்தக் காலாண்டு எண்ணிக்கையின் மாற்றப்படாத பதிவு. பின்னர் ஏதேனும் எண் திருத்தப்பட்டால், அந்தத் திருத்தம் தேதியுடன் பதிவு செய்யப்படும்; இந்தப் பக்கம் வெளியிட்டபடியே இருக்கும்.'
        )}
        breadcrumbs={[
          { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
          { label: 'Founder Ledger', to: '/insights/founder-ledger' },
          { label },
        ]}
        meta={
          <div className="ledger-period__meta">
            {upcoming ? (
              <Badge kind="status" status="upcoming">{t('Not yet published', 'இன்னும் வெளியிடப்படவில்லை')}</Badge>
            ) : (
              <Badge kind="type">{t('Frozen edition', 'மாற்றப்படாத பதிப்பு')}</Badge>
            )}
            {p.edition && <span className="ledger-period__edition" lang={en}>{p.edition}</span>}
            {/* Dates that are still placeholders are left out of the line. */}
            {hasPublished && (
              <span>
                {t('Published', 'வெளியீடு')}{' '}
                {p.published ? formatDate(p.published) : <span lang={publishedLbl.isEn ? 'en' : undefined}><InlineMarks text={publishedLbl.text} /></span>}
              </span>
            )}
            {asAt && (
              <span>
                {t('As at', 'நிலவரம்')} {formatDate(asAt)}
              </span>
            )}
          </div>
        }
      />

      {/* The first sheet carries the sticky edition bar and the data blocks (Oct 2026: paper sheets, blueprint frames). */}
      <div className="ledger-period__sheet">
      {/* Edition bar: other editions, downloads */}
      <div id="downloads" className="ledger-period__bar" role="region" aria-label={t('Editions and downloads', 'பதிப்புகளும் பதிவிறக்கங்களும்')}>
        <div className="container ledger-period__bar-inner">
          <nav className="ledger-period__editions" aria-label={t('Ledger editions', 'Ledger பதிப்புகள்')}>
            <span className="ledger-period__bar-label">{t('Edition', 'பதிப்பு')}</span>
            <ul role="list">
              {(valid.length ? valid : [requested]).map((s) => (
                <li key={s}>
                  <Link
                    to={localePath(`/insights/founder-ledger/${s}`)}
                    className={s === requested ? 'ledger-period__chip is-current' : 'ledger-period__chip'}
                    aria-current={s === requested ? 'page' : undefined}
                  >
                    {periodLabel(s)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <span className="ledger-period__bar-actions" data-primary-cta="">
            {csvReady && (
              <button type="button" className="ledger-period__dl" onClick={onCsv}>
                <Download size={16} aria-hidden="true" /> {t('Download CSV', 'CSV பதிவிறக்கம்')}
              </button>
            )}
            {/* The PDF control appears once StartNet supplies the PDF (no disabled placeholder control). */}
          </span>
        </div>
      </div>

      {upcoming && (
        <div className="container">
          <p className="ledger-period__notice" role="status">
            <Lock size={16} aria-hidden="true" />
            <span>
              {t(
                // The empty structure is no longer shown, so the "structure below" clause is left out.
                'This edition has not been published yet. Figures appear once the evidence committee signs them off.',
                'இந்தப் பதிப்பு இன்னும் வெளியிடப்படவில்லை. சான்றுக் குழு ஒப்புதல் அளித்த பின் எண்கள் தோன்றும்.'
              )}
            </span>
          </p>
        </div>
      )}
      {needOther && !other.loading && !d && (
        <div className="container">
          <p className="ledger-period__notice" role="status">
            {t('We couldn’t load the figures for this edition just now. Try again in a moment.', 'இந்தப் பதிப்பின் எண்களை இப்போது ஏற்ற முடியவில்லை. சிறிது நேரம் கழித்து முயலவும்.')}
          </p>
        </div>
      )}
      {base.error && !base.data && (
        <div className="container">
          <p className="ledger-period__notice" role="status">
            {t('We couldn’t load the Ledger just now. Try again in a moment.', 'Ledger-ஐ இப்போது ஏற்ற முடியவில்லை. சிறிது நேரம் கழித்து முயலவும்.')}
          </p>
        </div>
      )}

      <div className="ledger-period__frame" aria-busy={loading || undefined}>
        {/* KPI band 4-up: hidden until at least one headline figure is published */}
        {((loading && !d) || headline.length > 0) && (
        <Section pad="sm" labelledBy="ledger-period-kpis" className="ledger-period-sec">
          <h2 id="ledger-period-kpis" className="visually-hidden">{t('Headline figures', 'முக்கிய எண்கள்')}</h2>
          {loading && !d ? (
            <Skeleton height="8rem" count={1} />
          ) : (
            <RevealGroup className="ledger-period-kpis">
              {headline.map((k, i) => (
                <div className="ledger-period-kpis__item" key={k?.id || i}>
                  <Stat metric={tr(k)} variant="hero" />
                </div>
              ))}
            </RevealGroup>
          )}
          <p className="ledger-period-kpis__rule">
            <TagChip tag="A" /> {t('verified against a primary source', 'முதன்மை ஆதாரத்துடன் சரிபார்க்கப்பட்டது')} ·{' '}
            <TagChip tag="B" /> {t('reported by the founder or organisation', 'நிறுவனர் அல்லது அமைப்பு தெரிவித்தது')} ·{' '}
            <TagChip tag="C" /> {t('estimate. C-tagged figures are never summed into A or B.', 'மதிப்பீடு. C எண்கள் A அல்லது B உடன் ஒருபோதும் கூட்டப்படுவதில்லை.')}
          </p>
        </Section>
        )}

        {/* Ladder + brands, 2-up (hidden until ladder or brand figures are published) */}
        {(hasLevels || hasBrands) && (
        <Section surface="white" labelledBy="ledger-period-ladder" className="ledger-period-sec">
          <SectionHeader
            id="ledger-period-ladder"
            eyebrow={label}
            title={t('The ladder and the brands', 'ஏணியும் பிராண்டுகளும்')}
          />
          <div className="ledger-period-charts">
            <ChartFigure
              id="ledger-period-levels"
              title={t('People at each founder level', 'ஒவ்வொரு நிறுவனர் நிலையிலும் உள்ளவர்கள்')}
              subtitle={t('L1 is tracked but not counted as nurtured.', 'L1 பதிவு செய்யப்படும், ஆனால் “வளர்க்கப்பட்டவர்” எனக் கணக்கிடப்படாது.')}
              tag={levels.find((l) => l.tag)?.tag}
              asAt={asAt}
              empty={!hasLevels}
              csvName={`${fileStem}-ladder.csv`}
              table={{
                columns: [t('Level', 'நிலை'), t('People', 'நபர்கள்'), t('Change on last quarter', 'கடந்த காலாண்டை விட மாற்றம்'), t('Tag', 'குறி')],
                rows: levels.map((l) => [`${l.code} ${levelName(l.code)}`, l.value ?? '', l.change ?? '', l.tag || '']),
              }}
            >
              <ColumnChart
                label={t('Column chart: people at each founder level', 'நெடுவரிசை வரைபடம்: ஒவ்வொரு நிறுவனர் நிலையிலும் உள்ளவர்கள்')}
                data={levels.map((l) => ({ key: l.code, label: l.code, sublabel: levelName(l.code), value: l.value, tag: l.tag, tone: l.code === 'L1' ? 'context' : 'focus' }))}
              />
              <ChartLegend
                items={[
                  { tone: 'context', label: t('L1 Aware (tracked, not counted)', 'L1 (பதிவு மட்டும்)') },
                  { tone: 'focus', label: t('L2–L7 (counted as nurtured)', 'L2–L7 (வளர்க்கப்பட்டவர் கணக்கில்)') },
                ]}
              />
            </ChartFigure>
            <ChartFigure
              id="ledger-period-brands"
              title={t('Founders nurtured by brand', 'பிராண்டு வாரியாக வளர்க்கப்பட்ட நிறுவனர்கள்')}
              subtitle={t('People at L2 or above, by the StartNet brand they came through.', 'L2 அல்லது அதற்கு மேல் உள்ளவர்கள், அவர்கள் வந்த StartNet பிராண்டு வாரியாக.')}
              tag={brands.find((b) => b.tag)?.tag}
              asAt={asAt}
              empty={!hasBrands}
              csvName={`${fileStem}-brands.csv`}
              table={{
                columns: [t('Brand', 'பிராண்டு'), t('Nurtured', 'வளர்க்கப்பட்டவர்'), t('Launched', 'தொடங்கியவர்'), t('Funded', 'நிதி பெற்றவர்'), t('Tag', 'குறி')],
                rows: brands.map((b) => [b.name, b.nurtured ?? '', b.launched ?? '', b.funded ?? '', b.tag || '']),
              }}
            >
              <BarChart
                label={t('Bar chart: founders nurtured by brand', 'பட்டை வரைபடம்: பிராண்டு வாரியாக வளர்க்கப்பட்ட நிறுவனர்கள்')}
                data={brands.map((b) => ({ key: b.key, label: b.name, value: b.nurtured, tag: b.tag, tone: b.key }))}
              />
            </ChartFigure>
          </div>

          {hasLevels && (
          <Reveal className="ledger-period-tablebox">
            <p id="ledger-period-ladder-cap" className="ledger-period-table__cap">{t('The ladder this quarter', 'இந்தக் காலாண்டில் ஏணி')}</p>
            <div className="ledger-period-table-wrap" role="region" aria-labelledby="ledger-period-ladder-cap" tabIndex={0}>
              <table className="ledger-period-table" aria-labelledby="ledger-period-ladder-cap">
                <thead>
                  <tr>
                    <th scope="col">{t('Level', 'நிலை')}</th>
                    <th scope="col">{t('People', 'நபர்கள்')}</th>
                    <th scope="col">{t('Change on last quarter', 'கடந்த காலாண்டை விட மாற்றம்')}</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((l) => (
                    <tr key={l.code} className={l.code === 'L1' ? 'is-tracked' : undefined}>
                      <th scope="row"><span className="ledger-period-table__code">{l.code}</span> {levelName(l.code)}</th>
                      <td><Cell value={l.value} tag={l.tag} /></td>
                      <td><Cell value={l.change} tag={l.tag} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          )}

          {hasBrands && (
          <Reveal className="ledger-period-tablebox">
            <p id="ledger-period-brand-cap" className="ledger-period-table__cap">{t('By brand: nurtured, launched and funded', 'பிராண்டு வாரியாக: வளர்க்கப்பட்டவர், தொடங்கியவர், நிதி பெற்றவர்')}</p>
            <div className="ledger-period-table-wrap" role="region" aria-labelledby="ledger-period-brand-cap" tabIndex={0}>
              <table className="ledger-period-table" aria-labelledby="ledger-period-brand-cap">
                <thead>
                  <tr>
                    <th scope="col">{t('Brand', 'பிராண்டு')}</th>
                    <th scope="col">{t('Nurtured', 'வளர்க்கப்பட்டவர்')}</th>
                    <th scope="col">{t('Launched', 'தொடங்கியவர்')}</th>
                    <th scope="col">{t('Funded', 'நிதி பெற்றவர்')}</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((b) => (
                    <tr key={b.key}>
                      <th scope="row" data-brand={b.key}>
                        <span className="ledger-period-table__dot" aria-hidden="true" />
                        {b.name}
                      </th>
                      <td><Cell value={b.nurtured} tag={b.tag} /></td>
                      <td><Cell value={b.launched} tag={b.tag} /></td>
                      <td><Cell value={b.funded} tag={b.tag} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          )}
        </Section>
        )}

        {/* Districts (hidden until district figures are published) */}
        {hasDistricts && (
        <Section labelledBy="ledger-period-districts" className="ledger-period-sec">
          <SectionHeader
            id="ledger-period-districts"
            eyebrow={t('By district', 'மாவட்ட வாரியாக')}
            title={t('Where founders are coming from', 'நிறுவனர்கள் எங்கிருந்து வருகிறார்கள்')}
            lede={t(
              'We report the share of founders from outside Chennai, Coimbatore and Kancheepuram, so growth beyond the three metros is visible.',
              'சென்னை, கோயம்புத்தூர், காஞ்சிபுரம் தவிர்த்த பிற மாவட்டங்களிலிருந்து வரும் நிறுவனர்களின் பங்கைத் தெரிவிக்கிறோம்; அதனால் மூன்று பெருநகரங்களுக்கு அப்பாலான வளர்ச்சி தெரியும்.'
            )}
          />
          {hasDistricts ? (
            <div className="ledger-period-tablebox">
              <p id="ledger-period-district-cap" className="ledger-period-table__cap">{t('Founders by district', 'மாவட்ட வாரியாக நிறுவனர்கள்')}</p>
              <div className="ledger-period-table-wrap" role="region" aria-labelledby="ledger-period-district-cap" tabIndex={0}>
                <table className="ledger-period-table" aria-labelledby="ledger-period-district-cap">
                  <thead>
                    <tr>
                      <th scope="col">{t('District', 'மாவட்டம்')}</th>
                      <th scope="col">{t('Nurtured', 'வளர்க்கப்பட்டவர்')}</th>
                      <th scope="col">{t('Launched', 'தொடங்கியவர்')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...districts].sort((a, b) => (b.nurtured ?? -1) - (a.nurtured ?? -1)).map((r) => (
                      <tr key={r.name}>
                        <th scope="row">{lang === 'ta' && r.nameTa ? r.nameTa : r.name}</th>
                        <td><Cell value={r.nurtured} tag={r.tag} /></td>
                        <td><Cell value={r.launched} tag={r.tag} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </Section>
        )}

        {/* Outcomes + women share (outcomes listed only once they have a published figure) */}
        <Section surface="white" labelledBy={outcomeRows.length ? 'ledger-period-outcomes' : undefined} className="ledger-period-sec">
          <div className={`ledger-period-outcomes${outcomeRows.length ? '' : ' ledger-period-outcomes--solo'}`}>
            {outcomeRows.length > 0 && (
            <div className="ledger-period-outcomes__main">
              <SectionHeader id="ledger-period-outcomes" eyebrow={t('Outcomes', 'விளைவுகள்')} title={t('What founders built', 'நிறுவனர்கள் உருவாக்கியவை')} />
              <RevealGroup className="ledger-period-outcomes__grid">
                {outcomeRows.map((o) => {
                  const lbl = String(o.label || '');
                  const ev = EVIDENCE_LABEL[String(o.evidence || '').toLowerCase()];
                  return (
                    <div className="ledger-period-outcomes__item" key={lbl}>
                      <Stat
                        value={o.value}
                        unit={o.unit}
                        prefix={o.prefix}
                        label={t(lbl, OUTCOME_TA[lbl.toLowerCase()])}
                        tag={o.tag || undefined}
                        asAt={o.value != null ? asAt || undefined : undefined}
                        source={o.source}
                        variant="compact"
                      />
                      {(ev || o.evidence) && (
                        <p className="ledger-period-outcomes__ev">
                          {t('Evidence type', 'சான்று வகை')}: {ev ? t(ev[0], ev[1]) : o.evidence}
                        </p>
                      )}
                    </div>
                  );
                })}
              </RevealGroup>
            </div>
            )}
            <div className="ledger-period-outcomes__women">
              <SectionHeader eyebrow={t('Women share', 'பெண்களின் பங்கு')} title={t(`Against a ${floor}% floor`, `${floor}% குறைந்தபட்ச இலக்குக்கு எதிராக`)} as={outcomeRows.length ? 'h3' : 'h2'} />
              {women?.value != null ? (
                <Stat metric={tr(women)} />
              ) : d?.womenShare?.value != null ? (
                <Stat value={d.womenShare.value} unit="%" label={t('Share of participants who are women', 'பங்கேற்பாளர்களில் பெண்களின் பங்கு')} />
              ) : null}
              <Stat
                value={floor}
                unit="%"
                label={t('Floor across all StartNet programmes, target', 'அனைத்து StartNet திட்டங்களுக்குமான குறைந்தபட்ச இலக்கு')}
                tag={d?.womenShare?.floorTag || 'C'}
                source={t('StartNet plan', 'StartNet திட்டம்')}
                note={t('Planning assumption', 'திட்டமிடல் அனுமானம்')}
                variant="compact"
              />
            </div>
          </div>
        </Section>

        {/* Corrections for this edition */}
        <Section id="corrections" labelledBy="ledger-period-corr" className="ledger-period-sec">
          <SectionHeader
            id="ledger-period-corr"
            eyebrow={t('Corrections log', 'திருத்தங்கள் பதிவு')}
            title={t('Corrections to this edition', 'இந்தப் பதிப்புக்கான திருத்தங்கள்')}
            action={
              <Button variant="secondary" size="sm" to="/contact?topic=correction">
                {t('Report a correction', 'திருத்தத்தைத் தெரிவிக்கவும்')}
              </Button>
            }
          />
          {corrections.length ? (
            <div className="ledger-period-table-wrap" role="region" aria-labelledby="ledger-period-corr-cap" tabIndex={0}>
              <table className="ledger-period-table ledger-period-table--text">
                <caption id="ledger-period-corr-cap" className="visually-hidden">
                  {t('Corrections: date, what changed, severity and why', 'திருத்தங்கள்: தேதி, என்ன மாறியது, தீவிரம், காரணம்')}
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
                    const sev = SEVERITIES.find((x) => x.key === String(c.severity || '').toLowerCase())?.label;
                    return (
                      <tr key={c.id}>
                        <th scope="row">{c.date ? formatDate(c.date) : '–'}</th>
                        <td lang={en}>{c.what}</td>
                        <td>{sev ? t(sev[0], sev[1]) : c.severity || '–'}</td>
                        <td lang={en}>{c.why}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={t('No corrections this quarter.', 'இந்தக் காலாண்டில் திருத்தங்கள் இல்லை.')}
              action={
                <Button variant="tertiary" to="/insights/founder-ledger/corrections" icon={History}>
                  {t('Full corrections log', 'முழுத் திருத்தங்கள் பதிவு')}
                </Button>
              }
            />
          )}
          <blockquote className="ledger-period__reality">
            <p>{t(REALITY_CHECK[0], REALITY_CHECK[1])}</p>
          </blockquote>
        </Section>

        {/* Method + other editions */}
        <Section pad="sm" labelledBy="ledger-period-more" className="ledger-period-sec">
          <div className="ledger-period-more">
            <div className="ledger-period-more__method">
              <h2 id="ledger-period-more" className="h4">{t('How these figures were counted', 'இந்த எண்கள் எப்படி எண்ணப்பட்டன')}</h2>
              <p className="text-2">
                {t(
                  'L1–L7 definitions, the attribution rule (a startup counts only if a founder reached L3 in a StartNet programme before the company was registered) and what each tag means.',
                  'L1–L7 வரையறைகள், பங்களிப்பு விதி (நிறுவனம் பதிவு செய்யப்படுவதற்கு முன் நிறுவனர் ஒருவர் StartNet திட்டத்தில் L3-ஐ எட்டியிருந்தால் மட்டுமே ஸ்டார்ட்அப் கணக்கில் வரும்), ஒவ்வொரு குறியின் பொருள்.'
                )}
              </p>
              <Button variant="tertiary" to="/insights/founder-ledger/methodology" icon={BookOpen} className="ledger-period-more__cta">
                {t('How we count', 'நாங்கள் எப்படி எண்ணுகிறோம்')}
              </Button>
            </div>
            <div className="ledger-period-more__archive">
              <h2 className="h4">{t('Other editions', 'பிற பதிப்புகள்')}</h2>
              {valid.filter((s) => s !== requested).length ? (
                <ul className="ledger-period-more__list" role="list">
                  {valid.filter((s) => s !== requested).map((s) => (
                    <li key={s}>
                      <Link to={localePath(`/insights/founder-ledger/${s}`)}>
                        Founder Ledger {periodLabel(s)} <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-2">
                  {t('This is the first edition. Past quarters will be listed here as they are published.', 'இதுவே முதல் பதிப்பு. அடுத்தடுத்த காலாண்டுகள் வெளியானதும் இங்கே பட்டியலிடப்படும்.')}
                </p>
              )}
              {!isLatest && (
                <Button variant="tertiary" to="/insights/founder-ledger" icon={ArrowRight}>
                  {t('Latest edition', 'சமீபத்திய பதிப்பு')}
                </Button>
              )}
            </div>
          </div>
        </Section>
      </div>
      </div>

      <CTABand surface="night"
        title={t('Get the quarterly Ledger', 'காலாண்டு Ledger-ஐப் பெறுங்கள்')}
        body={t('New data, once a quarter.', 'புதிய தரவு, காலாண்டுக்கு ஒருமுறை.')}
        actions={
          <>
            <Button to="/insights/newsletter?topic=ledger">{t('Subscribe', 'செய்திமடலைப் பெறுங்கள்')}</Button>
            {csvReady && (
              <Button variant="secondary" onClick={onCsv} icon={Download}>
                {t('Download CSV', 'CSV பதிவிறக்கம்')}
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}
