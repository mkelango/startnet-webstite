import { useLang } from '../lib/i18n.jsx';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { Stat } from './Stat.jsx';
import { cx, hashString, langList } from './_utils.js';
import './ReportCard.css';

const KIND = {
  ledger: ['Founder Ledger', 'Founder Ledger'],
  report: ['Report', 'அறிக்கை'],
  index: ['Index', 'குறியீடு'],
};
const ART = { ledger: 'grid', report: 'network', index: 'map' };

/** Report card (Book 3 C29): cover art, kind chip, title, year, 1–3 key findings, formats. */
export function ReportCard({ report, to, headingLevel = 3, className }) {
  const { t, lang, pick } = useLang();
  if (!report) return null;
  const r = report;
  const upcoming = r.status === 'upcoming';
  const findings = Array.isArray(r.keyFindings) ? r.keyFindings.slice(0, 3) : [];
  const formats = Array.isArray(r.formats) ? r.formats : [];
  const link = to || r.url || undefined;

  return (
    <Card
      to={link}
      className={cx('report-card', upcoming && 'report-card--upcoming', className)}
      headingLevel={headingLevel}
      art={{ variant: ART[r.kind] || 'grid', seed: hashString(r.slug || r.title || '') % 997, ratio: '3/2', night: r.kind === 'ledger' }}
      badges={
        <>
          {r.kind && <Badge kind="type">{KIND[r.kind] ? t(KIND[r.kind][0], KIND[r.kind][1]) : r.kind}</Badge>}
          {r.year && <Badge kind="lang">{r.year}</Badge>}
          {upcoming && <Badge kind="status" status="upcoming" />}
        </>
      }
      title={pick(r, 'title')}
      body={pick(r, 'summary')}
      meta={
        <>
          {findings.length > 0 && (
            <div className="report-card__findings">
              {findings.map((m, i) => (
                <Stat key={m.id || m.key || i} metric={m} variant="compact" />
              ))}
            </div>
          )}
          {formats.length > 0 && (
            <ul className="report-card__formats">
              {formats.map((f, i) => (
                <li key={`${f.lang}-${f.format}-${i}`}>
                  {[String(f.format || '').toUpperCase(), f.size, f.lang ? langList(f.lang, lang) : ''].filter(Boolean).join(', ')}
                </li>
              ))}
            </ul>
          )}
        </>
      }
      cta={link ? (upcoming ? t('Get notified', 'அறிவிப்பு பெறுங்கள்') : t('Read the report', 'அறிக்கையைப் படியுங்கள்')) : undefined}
    />
  );
}

export default ReportCard;
