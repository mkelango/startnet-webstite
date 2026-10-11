import { cx } from './_utils.js';
import './EmptyState.css';

/** Mini art: a soft rising line that stops at the full stop, drawn as an outline "paused" ring (Book 4 IX-35). */
function EmptyArt() {
  return (
    <svg className="empty-state__art" viewBox="0 0 128 72" aria-hidden="true" focusable="false">
      <path className="empty-state__base" d="M8 64 H120" />
      <path className="empty-state__line" d="M8 60 C 30 60, 40 40, 60 44 S 82 36, 86 36" />
      <circle className="empty-state__ring" cx="92" cy="36" r="6" />
    </svg>
  );
}

/** Extra optional prop: `headingLevel` (2–6, default 3) so the title fits the page outline. */
export function EmptyState({ title, body, action, className, headingLevel = 3 }) {
  const level = Math.min(6, Math.max(2, Number(headingLevel) || 3));
  const H = `h${level}`;
  return (
    <div className={cx('empty-state', className)}>
      <EmptyArt />
      {title && <H className="empty-state__title h4">{title}</H>}
      {body && <div className="empty-state__body">{body}</div>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
