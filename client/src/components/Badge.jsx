import { useLang } from '../lib/i18n.jsx';
import { BRANDS } from '../data/brands.js';
import { STATUS_LABEL, cx } from './_utils.js';
import './Badge.css';

/** Status, brand, type, level, language and count badges (Book 3 C40). Text is always present. */
export function Badge({ kind = 'type', brand, status, children, className }) {
  const { t } = useLang();
  let content = children;
  if (content == null || content === '') {
    if (kind === 'status' && status && STATUS_LABEL[status]) content = t(STATUS_LABEL[status][0], STATUS_LABEL[status][1]);
    else if (kind === 'brand' && brand && BRANDS[brand]) content = BRANDS[brand].name;
  }
  if (content == null || content === '') return null;
  return (
    <span
      className={cx('badge', `badge--${kind}`, status && `badge--${status}`, className)}
      data-brand={kind === 'brand' && brand ? brand : undefined}
    >
      {(kind === 'brand' || kind === 'status') && <span className="badge__dot" aria-hidden="true" />}
      <span className="badge__text">{content}</span>
    </span>
  );
}

export default Badge;
