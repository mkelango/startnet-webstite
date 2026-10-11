// /insights/founder-ledger/corrections — T15 list (Book 1 Part B §2 sitemap, P1; flow §9.5).
// Data: GET /api/ledger → corrections[] and correctionsEmpty. Copy: Book 2 §6.2 (corrections table + empty state).
import { Link } from 'react-router-dom';
import { ArrowRight, FileWarning, ShieldCheck, Clock } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Badge, Button, EmptyState, Skeleton, Steps,
} from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { formatDate } from '../../lib/format.js';
import './Corrections.css';

const SEVERITY = {
  minor: ['Minor', 'சிறியது'],
  material: ['Material', 'முக்கியமானது'],
};

/** Accepts the field spellings the Ledger API and editors use (Book 1 Part B §8 Correction record). */
function normalise(list) {
  return (Array.isArray(list) ? list : []).map((c, i) => {
    const date = c.date || c.correctedAt || null;
    const href = c.url || c.link || c.href || null;
    return {
      id: c.id || `${date || 'c'}-${i}`,
      date,
      what: c.what || c.change || c.summary || c.title || '',
      why: c.why || c.reason || '',
      severity: (c.severity || '').toLowerCase() || null,
      figure: c.metricLabel || c.figure || c.metric || c.report || null,
      href: typeof href === 'string' && href ? href : null,
    };
  }).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

function FigureLink({ href, children }) {
  const { localePath } = useLang();
  if (/^https?:/i.test(href)) return <a className="corrections-item__link" href={href}>{children}</a>;
  return <Link className="corrections-item__link" to={localePath(href)}>{children}</Link>;
}

export default function Corrections() {
  const { t, localePath } = useLang();
  const { data, loading, error } = useApi('/api/ledger');
  const corrections = normalise(data?.corrections);
  // The API copy is English-only; Tamil readers get the Tamil line.
  const emptyText = t(data?.correctionsEmpty || 'No corrections this quarter.', 'இந்தக் காலாண்டில் திருத்தங்கள் இல்லை.');

  const reportCta = (
    <Button to="/contact?topic=correction" size="lg" icon={FileWarning} data-primary-cta="">
      {t('Report a correction', 'திருத்தத்தைத் தெரிவிக்கவும்')}
    </Button>
  );

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Founder Ledger corrections log', 'Founder Ledger திருத்தங்கள் பதிவு')}
        description={t(
          'Every correction to a published Founder Ledger figure, dated and graded by severity, kept in public. Report a figure you think is wrong.',
          'வெளியிடப்பட்ட Founder Ledger எண்களுக்கான ஒவ்வொரு திருத்தமும், தேதியுடனும் தீவிர நிலையுடனும். தவறு என்று நீங்கள் கருதும் எண்ணைத் தெரிவியுங்கள்.'
        )}
      />

      <PageHero
        eyebrow="Founder Ledger"
        title={t('Corrections log', 'திருத்தங்கள் பதிவு')}
        lede={t(
          'Every correction to a published figure, dated and graded by severity. Past editions stay frozen, and a corrected figure says so.',
          'வெளியிடப்பட்ட ஒவ்வொரு எண்ணுக்கான திருத்தமும், தேதியுடனும் தீவிரத் தரத்துடனும். பழைய பதிப்புகள் மாற்றப்படுவதில்லை; திருத்தப்பட்ட எண் அதைக் குறிப்பிடும்.'
        )}
        breadcrumbs={[
          { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
          { label: 'Founder Ledger', to: '/insights/founder-ledger' },
          { label: t('Corrections log', 'திருத்தங்கள் பதிவு') },
        ]}
        actions={
          <>
            {reportCta}
            <Button variant="tertiary" to="/insights/founder-ledger#corrections" className="corrections-back">
              {t('Back to the Founder Ledger', 'Founder Ledger-க்குத் திரும்புங்கள்')}
            </Button>
          </>
        }
      />

      <Section surface="white" labelledBy="corrections-list-title">
        <SectionHeader
          eyebrow={data?.period ? `${t('Edition', 'பதிப்பு')} ${data.period}` : t('All editions', 'அனைத்துப் பதிப்புகள்')}
          id="corrections-list-title"
          title={t('Published corrections', 'வெளியிடப்பட்ட திருத்தங்கள்')}
        />

        <div className="corrections-body" aria-live="polite" aria-busy={loading ? 'true' : undefined}>
          {loading && !data ? (
            <Skeleton height="5.5rem" count={3} />
          ) : error ? (
            <EmptyState
              title={t('We could not load the corrections log.', 'திருத்தங்கள் பதிவை ஏற்ற முடியவில்லை.')}
              body={t('Check your connection and try again.', 'இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும்.')}
              action={
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  {t('Try again', 'மீண்டும் முயலவும்')}
                </Button>
              }
            />
          ) : corrections.length ? (
            <ol className="corrections-list" role="list">
              {corrections.map((c) => {
                const sev = SEVERITY[c.severity];
                return (
                  <li key={c.id} className="corrections-item">
                    <div className="corrections-item__meta">
                      {c.date ? <time dateTime={c.date} className="corrections-item__date tnum">{formatDate(c.date)}</time> : <span className="corrections-item__date">–</span>}
                      {(sev || c.severity) && (
                        <Badge kind="level" className={`corrections-sev corrections-sev--${c.severity}`}>
                          {sev ? t(sev[0], sev[1]) : c.severity}
                        </Badge>
                      )}
                    </div>
                    <div className="corrections-item__main">
                      <p className="corrections-item__what">{c.what}</p>
                      {c.why && <p className="corrections-item__why"><span className="corrections-item__label">{t('Why', 'காரணம்')}:</span> {c.why}</p>}
                      {c.href ? (
                        <FigureLink href={c.href}>
                          {c.figure || t('See the figure', 'எண்ணைப் பார்க்க')} <ArrowRight aria-hidden="true" size={16} />
                        </FigureLink>
                      ) : c.figure ? (
                        <p className="corrections-item__figure">{c.figure}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState
              title={emptyText}
              body={t(
                'When a published figure changes, the date, what changed, its severity and why will appear here.',
                'வெளியிடப்பட்ட எண் மாறும்போது, தேதி, என்ன மாறியது, அதன் தீவிரம் மற்றும் காரணம் இங்கே தோன்றும்.'
              )}
              action={
                <Button variant="tertiary" to="/insights/founder-ledger">
                  {t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}
                </Button>
              }
            />
          )}
        </div>
      </Section>

      <Section labelledBy="corrections-how-title">
        <SectionHeader
          eyebrow={t('How corrections work', 'திருத்தங்கள் எப்படி')}
          id="corrections-how-title"
          title={t('Found a figure that looks wrong?', 'தவறாகத் தோன்றும் எண்ணைக் கண்டீர்களா?')}
          lede={t(
            'Tell us which figure, what is wrong and any evidence you have. Every report is reviewed.',
            'எந்த எண், என்ன தவறு, உங்களிடம் உள்ள ஆதாரம் ஆகியவற்றைச் சொல்லுங்கள். ஒவ்வொரு புகாரும் பரிசீலிக்கப்படும்.'
          )}
        />
        <Steps
          className="corrections-steps"
          steps={[
            {
              icon: FileWarning,
              title: t('Report it', 'தெரிவிக்கவும்'),
              body: t('Which figure, what is wrong, an evidence link, and a contact if you want a reply.', 'எந்த எண், என்ன தவறு, ஆதார இணைப்பு, பதில் வேண்டுமெனில் தொடர்பு விவரம்.'),
            },
            {
              icon: ShieldCheck,
              title: t('We check it', 'நாங்கள் சரிபார்க்கிறோம்'),
              body: t('The evidence committee reviews it. If it is not valid, we reply with the reason.', 'சான்றுக் குழு பரிசீலிக்கும். செல்லாது எனில், காரணத்துடன் பதில் அளிப்போம்.'),
            },
            {
              icon: Clock,
              title: t('We publish it', 'வெளியிடுகிறோம்'),
              body: t('Valid corrections appear here within 14 days, with the date, severity and what changed.', 'செல்லுபடியான திருத்தங்கள் 14 நாட்களுக்குள் தேதி, தீவிரம், மாற்றத்துடன் இங்கே தோன்றும்.'),
            },
          ]}
        />
        <div className="corrections-ctas cluster">
          <Button to="/contact?topic=correction" icon={ArrowRight}>
            {t('Report a correction', 'திருத்தத்தைத் தெரிவிக்கவும்')}
          </Button>
          <Link className="corrections-textlink" to={localePath('/about/evidence-standard')}>
            {t('Read our evidence standard', 'எங்கள் சான்றுத் தரத்தைப் படிக்கவும்')} <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </Section>
    </>
  );
}
