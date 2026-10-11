import { Stat } from './Stat.jsx';
import { Button } from './Button.jsx';
import { Reveal } from './Reveal.jsx';
import { cx } from './_utils.js';
import { isPlaceholderMetric } from './_placeholders.js';
import './FactBand.css';

/**
 * Proof / fact band (Book 3 C14, DESIGN-v2 3.9). 1–4 Stats in a <dl>: a row with vertical hairlines at ≥1024,
 * 2×2 below. A link with no title ("How we count…") is shown as the band's hairline-topped footnote row.
 * C-tag figures are never summed with A/B figures; each Stat carries its own tag.
 * Figures with no value yet are left out, and a band with no real figure renders nothing (no heading-only band).
 */
export function FactBand({ metrics, surface = 'paper', title, footnote, link, variant, className }) {
  const list = (Array.isArray(metrics) ? metrics : []).filter((m) => m && !isPlaceholderMetric(m)).slice(0, 4);
  if (!list.length) return null;
  const night = surface === 'night';
  return (
    <div
      className={cx('fact-band', `fact-band--${surface}`, `fact-band--n${Math.max(list.length, 1)}`, className)}
      data-surface={night ? 'night' : undefined}
    >
      {(title || link) && (
        <div className={cx('fact-band__head', !title && 'fact-band__head--link-only')}>
          {title && <h2 className="fact-band__title h4">{title}</h2>}
          {link && link.to && (
            <Button variant="tertiary" to={link.to} className="fact-band__link">
              {link.label}
            </Button>
          )}
        </div>
      )}
      {list.length > 0 && (
        <Reveal as="dl" className="fact-band__grid" y={12}>
          {list.map((metric, i) => (
            <Stat key={metric.id || metric.key || i} metric={metric} dl variant={variant || 'default'} />
          ))}
        </Reveal>
      )}
      {footnote && <p className="fact-band__footnote">{footnote}</p>}
    </div>
  );
}

export default FactBand;
