import { useLang } from '../lib/i18n.jsx';
import { RevealGroup } from './Reveal.jsx';
import { Scroller } from './Scroller.jsx';
import { cx, renderIcon } from './_utils.js';
import './Steps.css';

/** Numbered "how it works" steps (Book 3 C21). `engines` = six-card scroller (R4 pattern 12). */
export function Steps({ steps, variant = 'row', headingLevel = 3, label, className }) {
  const { t } = useLang();
  const list = (Array.isArray(steps) ? steps : []).filter(Boolean);
  if (!list.length) return null;
  const H = `h${Math.min(Math.max(Number(headingLevel) || 3, 2), 6)}`;

  const items = list.map((s, i) => (
    <div className="steps__step" key={s.id || s.title || i}>
      <div className="steps__top">
        <span className="steps__num" aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
        {s.icon && <span className="steps__icon">{renderIcon(s.icon, { size: 26, strokeWidth: 1.75, 'aria-hidden': true })}</span>}
      </div>
      <H className="steps__title">{s.title}</H>
      {s.body && <div className="steps__body">{s.body}</div>}
    </div>
  ));

  if (variant === 'engines') {
    return (
      <Scroller label={label || t('Steps', 'படிகள்')} ordered itemWidth="min(82%, 19rem)" className={cx('steps', 'steps--engines', className)}>
        {items}
      </Scroller>
    );
  }

  return (
    <RevealGroup as="ol" className={cx('steps', 'steps--row', `steps--n${Math.min(list.length, 5)}`, className)} aria-label={label}>
      {items}
    </RevealGroup>
  );
}

export default Steps;
