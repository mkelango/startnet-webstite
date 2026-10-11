import { Reveal } from './Reveal.jsx';
import { accentHeadline } from './_accent.jsx';
import { cx } from './_utils.js';
import './CTABand.css';

/**
 * Call-to-action band (DESIGN-v2 3.15 as revised by the AIWO blueprint P15): a left-aligned statement on the 12-col
 * grid (cols 1–8) at --text-display-xl with one serif `accentWord` (an existing trailing full stop becomes the red
 * <Dot/>, the band's one red point), the lede below at 40ch in the muted colour, then the buttons left: the first
 * filled, the next as an outline ring, 56px tall. The only decoration is ONE thin hairline arc, partly off-canvas at
 * the bottom right (no dot grid, no glow). Straight edges. Surfaces: night, paper (default), accent (brand fill).
 */
export function CTABand({ title, body, actions, surface = 'paper', brand, eyebrow, accentWord, id, className }) {
  return (
    <section
      id={id}
      className={cx('cta-band', `cta-band--${surface}`, className)}
      data-surface={surface === 'night' ? 'night' : undefined}
      data-brand={brand || undefined}
    >
      <svg className="cta-band__arc" viewBox="0 0 900 900" aria-hidden="true" focusable="false">
        <circle cx="450" cy="450" r="449" />
      </svg>
      <div className="container">
        <div className="cta-band__inner">
          <div className="cta-band__text">
            {eyebrow && (
              <Reveal as="p" className="eyebrow cta-band__eyebrow">
                {eyebrow}
              </Reveal>
            )}
            {title && (
              <Reveal as="h2" className="cta-band__title">
                {accentHeadline(title, { accentWord })}
              </Reveal>
            )}
            {body && (
              <Reveal delay={0.08} className="cta-band__body body-lg">
                {body}
              </Reveal>
            )}
          </div>
          {actions && (
            <Reveal delay={0.16} className="cta-band__actions" data-primary-cta="">
              {actions}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

export default CTABand;
