import { useLang } from '../lib/i18n.jsx';
import { TAG_META, cx } from './_utils.js';
import './TagChip.css';

/** Confidence tag chip: A solid, B outline, C dashed. Works without colour. */
export function TagChip({ tag = 'C', short = false, className }) {
  const { t } = useLang();
  const key = String(tag || 'C').toUpperCase();
  const meta = TAG_META[key] || TAG_META.C;
  return (
    <span className={cx('tag-chip', `tag-chip--${key.toLowerCase()}`, short && 'tag-chip--short', className)}>
      <span className="tag-chip__letter">{key}</span>
      {/* The space is ignored by the flex layout but keeps the accessible text "B Claimed" (WCAG 2.5.3). */}
      {!short && ' '}
      {!short && <span className="tag-chip__word">{t(meta.word, meta.wordTa)}</span>}
    </span>
  );
}

export default TagChip;
