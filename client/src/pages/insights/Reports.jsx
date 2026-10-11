// Reports library (T15 listing of T29 report cards) + TN Founder Report landing (Book 2 §6.3, pre-launch state).
// Tamil: drafts pending native review (Book 2 §14); report and index names stay Latin.
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Bell, FileText } from 'lucide-react';
import {
  Seo, PageHero, Section, ReportCard, RevealGroup, Reveal, Button, Stat, ArtImage,
  Skeleton, EmptyState, NewsletterForm, TagChip,
} from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { webPageLd, itemListLd, langPath, ORG_REF, absUrl } from '../../lib/seo.js';
import { localiseItem, withKpiTa } from './ledgerUtils.js';

const withFindingsTa = (r) => (Array.isArray(r.keyFindings) ? { ...r, keyFindings: r.keyFindings.map(withKpiTa) } : r);
import './Reports.css';

const KINDS = [
  { value: '', label: ['All', 'அனைத்தும்'] },
  { value: 'ledger', label: ['Founder Ledger', 'Founder Ledger'] },
  { value: 'report', label: ['Reports', 'அறிக்கைகள்'] },
  { value: 'index', label: ['Indices', 'குறியீடுகள்'] },
];
const KIND_VALUES = KINDS.map((k) => k.value).filter(Boolean);

const CHAPTERS = [
  ['Founders by district', 'மாவட்ட வாரியாக நிறுவனர்கள்'],
  ['Women-led and women-owned (51%+)', 'பெண்கள் தலைமையிலான, பெண்களுக்குச் சொந்தமான (51%+) நிறுவனங்கள்'],
  ['Capital and grants', 'மூலதனமும் மானியங்களும்'],
  ['Campus to company', 'கல்லூரியிலிருந்து நிறுவனம் வரை'],
  ['Research to market', 'ஆய்விலிருந்து சந்தை வரை'],
  ['Methods and limits', 'முறைகளும் வரம்புகளும்'],
];

const PLANNED_NOTE = ["Planned. We'll publish the method before the first edition.", 'திட்டமிடப்பட்டுள்ளது. முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.'];

/** Grid modifier so a 3-up row never ends with one card alone (see Reports.css). */
const gridMod = (n) => (n % 3 === 1 && n > 3 ? ' reports-grid--r1' : n % 3 === 2 ? ' reports-grid--r2' : '');

export default function Reports() {
  const { t, lang } = useLang();
  const { data, loading, error } = useApi('/api/reports');
  // The kind filter lives in the URL (?kind=index) so a filtered view can be shared, bookmarked and survives reload.
  const [params, setParams] = useSearchParams();
  const rawKind = String(params.get('kind') || '').trim().toLowerCase();
  const kind = KIND_VALUES.includes(rawKind) ? rawKind : '';
  const setKind = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set('kind', value); else next.delete('kind');
    setParams(next, { replace: true, preventScrollReset: true });
  };
  // Drop unknown values (?kind=bogus) so the page and its chips agree.
  useEffect(() => {
    if (!params.has('kind') || params.get('kind') === kind) return;
    const next = new URLSearchParams(params);
    if (kind) next.set('kind', kind); else next.delete('kind');
    setParams(next, { replace: true, preventScrollReset: true });
  }, [params, kind, setParams]);
  const newsRef = useRef(null);
  const all = data || [];
  const list = kind ? all.filter((r) => r.kind === kind) : all;
  const published = list.filter((r) => r.status === 'published').sort((a, b) => (b.year || 0) - (a.year || 0));
  const upcoming = list.filter((r) => r.status !== 'published').sort((a, b) => (a.year || 0) - (b.year || 0));
  const tnfr = all.find((r) => /tn-founder-report/.test(r.slug || ''));
  const tnfrLive = tnfr?.status === 'published';
  const year = tnfr?.year || 2027;
  // API chapters are English: use chaptersTa, else the Tamil of a known chapter, else the English marked lang="en".
  const chapters = Array.isArray(tnfr?.chapters) && tnfr.chapters.length
    ? tnfr.chapters.map((c, i) => {
      if (lang !== 'ta') return c;
      const ta = (Array.isArray(tnfr.chaptersTa) && tnfr.chaptersTa[i]) || CHAPTERS.find((k) => k[0].toLowerCase() === String(c).toLowerCase())?.[1];
      return ta || <span lang="en">{c}</span>;
    })
    : CHAPTERS.map((c) => t(c[0], c[1]));

  // This page's newsletter needs its own landmark name: the kit form is always "The StartNet newsletter".
  const newsLabel = t('Reports newsletter sign-up', 'அறிக்கைகள் செய்திமடல் பதிவு');
  useEffect(() => {
    newsRef.current?.querySelector('form')?.setAttribute('aria-label', newsLabel);
  });

  const card = (r) => (
    <div id={cardId(r)} key={r.slug} className="reports-grid__item"><ReportCard report={withFindingsTa(localiseItem(onPageReport(r), lang))} /></div>
  );

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Tamil Nadu startup reports and indices', 'தமிழ்நாடு ஸ்டார்ட்அப் அறிக்கைகள், குறியீடுகள்')}
        description={t(
          "Reports on Tamil Nadu's founders: the TN Founder Report, Founder Ledger editions, indices and sector reports, with sources and tags on every figure.",
          'தமிழ்நாட்டு நிறுவனர் அறிக்கைகள்: TN Founder Report, Founder Ledger பதிப்புகள், குறியீடுகள், துறை அறிக்கைகள்; ஒவ்வொரு எண்ணுக்கும் ஆதாரமும் குறியும்.',
        )}
        jsonLd={[
          webPageLd({ path: langPath('/insights/reports', lang), type: 'CollectionPage', lang, name: t('Tamil Nadu startup reports and indices', 'தமிழ்நாடு ஸ்டார்ட்அப் அறிக்கைகள்') }),
          itemListLd({
            name: t('StartNet reports and indices', 'StartNet அறிக்கைகளும் குறியீடுகளும்'),
            lang,
            items: all.map((r) => ({ name: (lang === 'ta' && r.titleTa) || r.title, path: typeof r.url === 'string' && r.url.startsWith('/') ? r.url : null })),
          }),
        ]}
      />
      <PageHero
        eyebrow={t('Insights', 'நுண்ணறிவுகள்')}
        title={t('Reports and indices.', 'அறிக்கைகளும் குறியீடுகளும்.')}
        lede={t(
          "Data on Tamil Nadu's founders: the quarterly Founder Ledger, an annual report, indices and sector reports. Every figure has a source or a confidence tag.",
          'தமிழ்நாட்டு நிறுவனர்கள் பற்றிய தரவு: காலாண்டு Founder Ledger, ஆண்டு அறிக்கை, குறியீடுகள், துறை அறிக்கைகள். ஒவ்வொரு எண்ணுக்கும் ஆதாரம் அல்லது நம்பகத்தன்மைக் குறி உண்டு.',
        )}
        breadcrumbs={[{ label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' }, { label: t('Reports', 'அறிக்கைகள்') }]}
      />

      {/* Library */}
      <Section surface="paper" pad="sm">
        <div className="reports-filter" role="group" aria-label={t('Filter by kind', 'வகை வாரியாக வடிகட்டு')}>
          {KINDS.map((k) => (
            <button key={k.value || 'all'} type="button" className="reports-filter__chip" aria-pressed={kind === k.value} onClick={() => setKind(k.value)}>
              {t(k.label[0], k.label[1])}
              <span className="reports-filter__count">{k.value ? all.filter((r) => r.kind === k.value).length : all.length}</span>
            </button>
          ))}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {loading ? t('Loading reports', 'அறிக்கைகள் ஏற்றப்படுகின்றன') : t(`${list.length} reports`, `${list.length} அறிக்கைகள்`)}
        </p>

        {loading ? (
          <div className="grid grid-3 reports-grid"><Skeleton height="20rem" count={3} /></div>
        ) : error ? (
          <EmptyState
            title={t("We couldn't load reports just now.", 'அறிக்கைகளை இப்போது ஏற்ற முடியவில்லை.')}
            body={t('Please try again in a moment.', 'சிறிது நேரம் கழித்து மீண்டும் முயலவும்.')}
          />
        ) : (
          <>
            {published.length > 0 && (
              <div className="reports-group">
                <h2 className="reports-group__title h4">{t('Published', 'வெளியிடப்பட்டவை')}</h2>
                <RevealGroup className={`grid grid-3 reports-grid${gridMod(published.length)}`} key={kind || 'all'}>
                  {published.map(card)}
                </RevealGroup>
              </div>
            )}
            {upcoming.length > 0 && (
              <div className="reports-group">
                <h2 className="reports-group__title h4">{t('Planned', 'திட்டமிடப்பட்டவை')}</h2>
                <p className="reports-group__note">{t(...PLANNED_NOTE)}</p>
                <RevealGroup className={`grid grid-3 reports-grid${gridMod(upcoming.length)}`} key={kind || 'all'}>
                  {upcoming.map(card)}
                </RevealGroup>
              </div>
            )}
            {!published.length && !upcoming.length && (
              <EmptyState
                title={t('Nothing in this collection yet.', 'இந்தத் தொகுப்பில் இன்னும் எதுவும் இல்லை.')}
                body={t(...PLANNED_NOTE)}
                action={<Button variant="secondary" onClick={() => setKind('')}>{t('Show all', 'அனைத்தையும் காட்டு')}</Button>}
              />
            )}
          </>
        )}
      </Section>

      {/* TN Founder Report landing — the page's one Night band */}
      <Section surface="night" id="tn-founder-report-2027" labelledBy="tnfr-title">
        <div className="reports-tnfr">
          <Reveal className="reports-tnfr__cover">
            <ArtImage variant="map" night ratio="4/5" seed={38} label={`TN Founder Report ${year}`} alt="" animate />
          </Reveal>
          <div className="reports-tnfr__copy">
            <p className="eyebrow">{t('Annual report', 'ஆண்டு அறிக்கை')}</p>
            <h2 id="tnfr-title" className="display-xl reports-tnfr__title">
              TN Founder Report {year}
            </h2>
            <p className="body-lg reports-tnfr__sub">
              {t(
                'An annual look at who is building companies in Tamil Nadu, in which districts, with what support, and what is holding them back.',
                'தமிழ்நாட்டில் யார் நிறுவனங்களை உருவாக்குகிறார்கள், எந்த மாவட்டங்களில், என்ன ஆதரவுடன், அவர்களைத் தடுப்பது எது என்பது பற்றிய ஆண்டுப் பார்வை.',
              )}
            </p>

            {tnfrLive && Array.isArray(tnfr.keyFindings) && tnfr.keyFindings.length > 0 ? (
              <div className="reports-tnfr__findings">
                <h3 className="h5">{t('Headline findings', 'முக்கியக் கண்டறிதல்கள்')}</h3>
                <RevealGroup className="reports-tnfr__grid">
                  {tnfr.keyFindings.slice(0, 5).map((m) => (
                    <div key={m.id || m.key} className="reports-tnfr__finding"><Stat metric={withKpiTa(m)} variant="compact" /></div>
                  ))}
                </RevealGroup>
              </div>
            ) : (
              <p className="reports-tnfr__body">
                {/* The exact date is not supplied: the planned year from the record is used, or the clause is left out. */}
                {tnfr?.year
                  ? `${t(`The first TN Founder Report is planned for ${tnfr.year}`, `முதல் TN Founder Report வெளியாகத் திட்டமிடப்பட்டுள்ள ஆண்டு: ${tnfr.year}`)}. `
                  : null}
                {t(
                  "It will combine public data (DPIIT, AISHE, StartupTN) with StartNet's Founder Ledger and a founder survey. We'll publish the method first.",
                  'இது பொதுத் தரவையும் (DPIIT, AISHE, StartupTN) StartNet‑இன் Founder Ledger‑ஐயும் ஒரு நிறுவனர் கணக்கெடுப்பையும் இணைக்கும். முதலில் முறையியலை வெளியிடுவோம்.',
                )}
              </p>
            )}

            <div className="cluster reports-tnfr__actions">
              {tnfrLive ? (
                <ReportFormats report={tnfr} />
              ) : (
                <>
                  <Button href="#reports-newsletter" icon={Bell}>{t("Get the report when it's out", 'அறிக்கை வெளியானதும் பெறுங்கள்')}</Button>
                  {/* The founder-survey button appears once the survey link is supplied (no disabled placeholder control). */}
                </>
              )}
            </div>

            <div className="reports-tnfr__chapters">
              <h3 className="h6 reports-tnfr__chapters-title">{tnfrLive ? t('Chapters', 'அத்தியாயங்கள்') : t('Planned chapters', 'திட்டமிடப்பட்ட அத்தியாயங்கள்')}</h3>
              <ol>
                {chapters.map((c, i) => (
                  <li key={i}><span className="reports-tnfr__num">{String(i + 1).padStart(2, '0')}</span>{c}</li>
                ))}
              </ol>
            </div>

            <p className="reports-tnfr__rules">
              <span>{t('Sources and tags on every figure:', 'ஒவ்வொரு எண்ணுக்கும் ஆதாரமும் குறியும்:')}</span>
              <span className="reports-tnfr__chips"><TagChip tag="A" /> <TagChip tag="B" /> <TagChip tag="C" />.</span>
              <span>
                {t(
                  'Sponsors do not see findings before publication and have no say in them.',
                  'வெளியீட்டுக்கு முன் நிதியளிப்பாளர்கள் கண்டறிதல்களைப் பார்ப்பதில்லை; அவற்றில் அவர்களுக்கு எந்தக் கருத்துரிமையும் இல்லை.',
                )}
              </span>
            </p>
            <Button variant="tertiary" to="/contact?topic=briefing" icon={ArrowRight}>{t('Request a briefing', 'விளக்கக் கூட்டம் கோருங்கள்')}</Button>
          </div>
        </div>
      </Section>

      <Section surface="paper" id="reports-newsletter" width="narrow" pad="sm">
        <div className="reports-news" ref={newsRef}>
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

const SELF = '/insights/reports';
const TNFR_SECTION = 'tn-founder-report-2027';

/** The TN Founder Report already has its own section (#tn-founder-report-2027) on this page, so its card must not reuse that id. */
const cardId = (r) => (r.slug === TNFR_SECTION ? undefined : r.slug);

/**
 * Cards whose url is this very page would just reload it. Point them somewhere useful instead:
 * the TN Founder Report card goes to its section below, and other planned reports go to the
 * newsletter sign-up (the card's CTA already reads "Get notified" for upcoming reports).
 */
function onPageReport(r) {
  const url = String(r.url || '').replace(/\/+$/, '');
  if (url !== SELF) return r;
  if (r.slug === TNFR_SECTION) return { ...r, url: `${SELF}#${TNFR_SECTION}` };
  if (r.status === 'published') return { ...r, url: undefined }; // a published report has no other page yet: show it without a link
  return { ...r, url: `${SELF}#reports-newsletter` };
}

function ReportFormats({ report }) {
  const { t } = useLang();
  const formats = report.formats || [];
  // No files yet: no disabled "Download [placeholder]" control.
  if (!formats.length) return null;
  return formats.map((f) => {
    const langName = f.lang ? (f.lang === 'ta' ? t('Tamil', 'தமிழ்') : t('English', 'ஆங்கிலம்')) : '';
    const size = f.size || '';
    return (
      <Button key={`${f.lang}-${f.format}`} variant={f.format === 'PDF' ? 'primary' : 'inverse'} href={f.url || undefined} disabled={!f.url} icon={FileText}>
        {f.format === 'CSV'
          ? t('Download the data (CSV)', 'தரவைப் பதிவிறக்குங்கள் (CSV)')
          : t(
            `Download the full report (${[f.format, size, langName].filter(Boolean).join(', ')})`,
            `முழு அறிக்கையைப் பதிவிறக்குங்கள் (${[f.format, size, langName].filter(Boolean).join(', ')})`,
          )}
      </Button>
    );
  });
}
