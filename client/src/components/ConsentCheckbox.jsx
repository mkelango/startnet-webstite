import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { CheckboxControl } from './Field.jsx';
import { cx } from './_utils.js';
import './ConsentCheckbox.css';

/**
 * Consent per purpose (DPDP): unticked by default, links to the privacy notice.
 * Extra optional props: required, error, className.
 */
export function ConsentCheckbox({ id, purpose, checked = false, onChange, children, required, error, className }) {
  const { t, localePath } = useLang();
  const cid = id || `consent-${purpose}`;
  const errId = error ? `${cid}-error` : undefined;
  return (
    <div className={cx('consent-checkbox', error && 'consent-checkbox--error', className)} data-purpose={purpose}>
      <div className="consent-checkbox__row">
        <CheckboxControl
          id={cid}
          name={`consent_${purpose}`}
          checked={Boolean(checked)}
          onChange={(e) => onChange && onChange(e.target.checked)}
          required={required || undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errId}
        />
        <label htmlFor={cid} className="consent-checkbox__label">
          {children}
          {!required && <span className="consent-checkbox__optional"> {t('(optional)', '(விருப்பம்)')}</span>}
        </label>
      </div>
      <p className="consent-checkbox__notice">
        <Link to={localePath('/legal/privacy')}>{t('Privacy notice', 'தனியுரிமை அறிவிப்பு')}</Link>
      </p>
      {error && (
        <p id={errId} className="consent-checkbox__error field__error">
          <AlertCircle size={16} aria-hidden="true" className="field__error-icon" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default ConsentCheckbox;
