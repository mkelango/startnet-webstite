// Page-local building blocks for the StartNet X extra pages (agents, developers, updates).
// Status rule (Book 2 §7): label features Live, In beta or Coming. Never show a coming feature as live,
// so these pages only ever render the "coming" and "planned" states.
import { useLang } from '../../../lib/i18n.jsx';
import './SnxxParts.css';

/** Status chip. `status`: 'coming' | 'planned' | 'beta'. `release` e.g. 'SNX v2' (Latin script). `short`: "Coming" only. */
export function XStatus({ status = 'coming', release, short = false, className }) {
  const { t } = useLang();
  const label =
    status === 'beta'
      ? t('In beta', 'சோதனைப் பதிப்பு')
      : status === 'planned'
        ? t('Planned', 'திட்டமிடப்பட்டது')
        : short
          ? t('Coming', 'வரவிருக்கிறது')
          : t('Coming in a later release', 'அடுத்த வெளியீடுகளில் வரும்');
  return (
    <span className={['snxx-status', `snxx-status--${status}`, className].filter(Boolean).join(' ')}>
      <span className="snxx-status__dot" aria-hidden="true" />
      <span className="snxx-status__text">
        {label}
        {release && (
          <>
            {' '}
            <span className="snxx-status__rel" lang="en">
              {'· '}
              {release}
            </span>
          </>
        )}
      </span>
    </span>
  );
}

/** "On this page" anchor chips (T19 in-page nav; wraps on phones, 44px targets). */
export function OnThisPage({ items }) {
  const { t } = useLang();
  const list = (Array.isArray(items) ? items : []).filter(Boolean);
  if (!list.length) return null;
  return (
    <nav className="snxx-otp" aria-label={t('On this page', 'இந்தப் பக்கத்தில்')}>
      <p className="snxx-otp__title">{t('On this page', 'இந்தப் பக்கத்தில்')}</p>
      <ol className="snxx-otp__list">
        {list.map((it, i) => (
          <li key={it.id}>
            <a className="snxx-otp__link" href={`#${it.id}`}>
              <span className="snxx-otp__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
