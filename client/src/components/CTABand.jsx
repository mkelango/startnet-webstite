import { Reveal } from './Reveal.jsx';
import { accentHeadline } from './_accent.jsx';
import { cx } from './_utils.js';
import './CTABand.css';

/**
 * CTA headband (docs/redesign/SPEC.md §3.6, the Plug and Play headband). Headline left, actions right (≥1024: 7fr / 5fr,
 * bottom-aligned); stacked below 1024 with full-width actions below 600. The title is `--text-h2` with one serif
 * `accentWord`; an existing trailing full stop becomes the red <Dot/> (the band's one red point) unless `dot={false}`
 * (use that when an action is `variant="point"`, so the band keeps a single red point).
 * Looks (the props are unchanged):
 *   surface="night"            Ink band, full bleed, static pulli dot grid on the right 40% (`pulli={false}` drops it)
 *   surface="paper" (default)  an inset Bone panel inside the container (mid-page, mid-article)
 *   brand="…" or surface="accent"  Ink band + a 3px accent rule on the top edge (never an accent ground)
 */
export function CTABand({ title, body, actions, surface = 'paper', brand, eyebrow, accentWord, dot = true, pulli = true, id, className }) {
  const look = brand || surface === 'accent' ? 'brand' : surface === 'night' ? 'night' : 'paper';
  const ink = look !== 'paper';
  return (
    <section
      id={id}
      className={cx('cta-band', `cta-band--${look}`, className)}
      data-surface={ink ? 'night' : undefined}
      data-brand={brand || undefined}
    >
      {ink && pulli && <div className="cta-band__pulli u-pulli" aria-hidden="true" />}
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
                {accentHeadline(title, { accentWord, dot })}
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
