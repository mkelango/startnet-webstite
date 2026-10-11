import { useLang } from '../lib/i18n.jsx';
import { cx } from './_utils.js';
import { isPlaceholderNode } from './_placeholders.js';
import './KeyFacts.css';

/** Key facts aside for programme/event pages (<dl>, sticky on desktop). Placeholder-only rows are left out. */
export function KeyFacts({ items, title, action, sticky = true, className }) {
  const { t } = useLang();
  const list = (Array.isArray(items) ? items : []).filter(
    (it) => it && it.label && it.value != null && it.value !== '' && !isPlaceholderNode(it.value)
  );
  if (!list.length && !action) return null;
  const heading = title || t('Key facts', 'முக்கிய விவரங்கள்');
  return (
    <aside className={cx('key-facts', sticky && 'key-facts--sticky', className)} aria-label={heading}>
      <h2 className="key-facts__title">{heading}</h2>
      {list.length > 0 && (
        <dl className="key-facts__list">
          {list.map((it, i) => (
            <div className="key-facts__row" key={`${it.label}-${i}`}>
              <dt className="key-facts__label">{it.label}</dt>
              <dd className="key-facts__value">{it.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {action && (
        <div className="key-facts__action" data-primary-cta="">
          {action}
        </div>
      )}
    </aside>
  );
}

export default KeyFacts;
