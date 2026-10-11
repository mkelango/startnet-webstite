import { useLang } from '../lib/i18n.jsx';
import { Stat } from './Stat.jsx';
import { RevealGroup } from './Reveal.jsx';
import { LADDER_LEVELS, cx } from './_utils.js';
import './Ladder.css';

/**
 * Founder ladder L1–L7 (Book 3 C17). Only L2+ counts as "nurtured".
 * Variants: vertical (default), horizontal (staircase ≥ 1024px, vertical on mobile), compact (dots row).
 * Extra optional props: `from`, `to` (highlight a range, e.g. a programme's entry → exit).
 */
export function Ladder({ levels, variant = 'vertical', current, from, to, className, label }) {
  const { t, pick } = useLang();
  const base = Array.isArray(levels) && levels.length ? levels : LADDER_LEVELS;
  // Tamil names and definitions when present (nameTa, definitionTa, exampleTa).
  const list = base.map((l) => ({ ...l, name: pick(l, 'name'), definition: pick(l, 'definition'), example: pick(l, 'example') }));
  const idx = (code) => list.findIndex((l) => l.code === code);
  const ci = current ? idx(current) : -1;
  const fi = from ? idx(from) : -1;
  const ti = to ? idx(to) : -1;
  const inRange = (i) => fi >= 0 && ti >= 0 && i >= fi && i <= ti;
  const aria = label || t('Founder ladder, levels 1 to 7', 'நிறுவனர் ஏணி, நிலைகள் 1 முதல் 7');

  if (variant === 'compact') {
    const fromL = fi >= 0 ? list[fi] : null;
    const toL = ti >= 0 ? list[ti] : null;
    let caption = '';
    if (fromL && toL) caption = fi === ti ? `${fromL.code} ${fromL.name}` : `${fromL.code} ${fromL.name} → ${toL.code} ${toL.name}`;
    else if (ci >= 0) caption = `${list[ci].code} ${list[ci].name}`;
    return (
      <div className={cx('ladder-compact', className)}>
        <ol className={cx('ladder', 'ladder--compact', caption && 'ladder--has-caption')} aria-label={aria}>
          {list.map((l, i) => (
            <li
              key={l.code}
              className={cx('ladder__c', i === ci && 'ladder__c--current', inRange(i) && 'ladder__c--range', i === fi && 'ladder__c--from', i === ti && 'ladder__c--to')}
              aria-current={i === ci ? 'step' : undefined}
            >
              <span className="ladder__c-dot" aria-hidden="true" />
              <span className="ladder__c-code">{l.code}</span>
              <span className="ladder__c-name">{l.name}</span>
            </li>
          ))}
        </ol>
        {caption && (
          <p className="ladder__range-caption" aria-hidden="true">
            {caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <RevealGroup
      as="ol"
      className={cx('ladder', `ladder--${variant}`, className)}
      aria-label={aria}
      style={{ '--ladder-cols': list.length }}
    >
      {list.map((l, i) => (
        <li
          key={l.code}
          className={cx(
            'ladder__level',
            i === 0 && 'ladder__level--tracked',
            i === ci && 'ladder__level--current',
            inRange(i) && 'ladder__level--range'
          )}
          aria-current={i === ci ? 'step' : undefined}
          style={{ '--ladder-i': i, '--ladder-n': list.length }}
        >
          <span className="ladder__marker" aria-hidden="true">
            <span className="ladder__dot" />
          </span>
          <div className="ladder__content">
            <p className="ladder__code">{l.code}</p>
            <p className="ladder__name">{l.name}</p>
            {l.definition && <p className="ladder__def">{l.definition}</p>}
            {l.example && <p className="ladder__example">{l.example}</p>}
            {l.metric && <Stat metric={l.metric} variant="compact" />}
          </div>
        </li>
      ))}
    </RevealGroup>
  );
}

export default Ladder;
