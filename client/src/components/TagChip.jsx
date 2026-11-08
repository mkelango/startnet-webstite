import { useLang } from '../lib/i18n.jsx';
import { TAG_META, cx } from './_utils.js';
import './TagChip.css';

/**
 * Confidence tag chip (A / B / C): one pill style, the grade carried by its letter and word, so it works without
 * colour. Optional `size`: 'sm' (default, 24px, sits in running text and stat meta) or 'lg' (NEW, SPEC §4.13: 40px,
 * padding 0 20, 16px, for tag clouds; Paper ring and text inside Ink panels).
 */
export function TagChip({ tag = 'C', short = false, size = 'sm', className }) {
  const { t } = useLang();
  const key = String(tag || 'C').toUpperCase();
  const meta = TAG_META[key] || TAG_META.C;
  return (
    <span className={cx('tag-chip', `tag-chip--${key.toLowerCase()}`, short && 'tag-chip--short', size === 'lg' && 'tag-chip--lg', className)}>
      <span className="tag-chip__letter">{key}</span>
      {/* The space is ignored by the flex layout but keeps the accessible text "B Claimed" (WCAG 2.5.3). */}
      {!short && ' '}
      {!short && <span className="tag-chip__word">{t(meta.word, meta.wordTa)}</span>}
    </span>
  );
}

export default TagChip;
