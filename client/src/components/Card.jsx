import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n.jsx';
import { renderArt } from './renderArt.jsx';
import { cx, isHttp } from './_utils.js';
import { InlineMarks } from './InlineMarks.jsx';
import { hasMark, isPlaceholderText } from './_placeholders.js';
import './Card.css';

/**
 * Content card (docs/redesign/SPEC.md §4.6). The whole card is one link via a pseudo-element on the title link (the
 * stretched link), so the card is one tab stop; chips that are links of their own sit above it.
 * Variants:
 *  - `framed` (default): Card ground, 1px hairline, 12px radius; the media sits inset inside the padding at 8px radius.
 *    Hover: a stronger border + title underline (no top rule, no lift).
 *  - `media`: unframed editorial card, 16px media at a fixed `ratio`, then eyebrow / title / text / meta.
 *  - `place` (NEW): a district / location tile. A full 4/5 photo at the panel radius under a flat Ink scrim, the name
 *    centred in Paper; on hover the scrim deepens, the photo zooms and the `cta` appears 32px from the bottom.
 * Extra optional props: `badges` (node above the title), `kicker` (meta-style row above the title),
 * `headingLevel` (default 3), `cta` (visual cue text), `ratio` (media aspect, e.g. '4/3'),
 * `mediaOverlay` (NEW: node drawn on top of the media, e.g. a date chip), `surface` (NEW: 'night' makes an Ink card).
 */
export function Card({
  to,
  href,
  brand,
  eyebrow,
  title,
  body,
  meta,
  art,
  footer,
  badges,
  cta,
  kicker,
  variant = 'framed',
  ratio,
  headingLevel = 3,
  mediaOverlay,
  surface,
  className,
  children,
}) {
  const { localePath } = useLang();
  const H = `h${Math.min(Math.max(Number(headingLevel) || 3, 2), 6)}`;
  const internal = to && !isHttp(to) ? to : null;
  const external = href || (to && isHttp(to) ? to : null);
  const isLink = Boolean(internal || external);

  const kind = variant === 'media' || variant === 'place' ? variant : 'framed';
  const place = kind === 'place';
  const mediaRatio = ratio || (place ? '4/5' : undefined);
  const titleText = isLink ? <span className="card__title-text u-sweep">{title}</span> : title;
  let titleNode = title;
  if (internal) titleNode = <Link className="card__link" to={localePath(internal)} draggable="false">{titleText}</Link>;
  else if (external) titleNode = <a className="card__link" href={external} draggable="false">{titleText}</a>;

  const artNode = art ? renderArt(mediaRatio ? { ...art, ratio: mediaRatio } : art, { ratio: mediaRatio || '16/9', brand }) : null;
  return (
    <article
      className={cx(
        'card',
        `card--${kind}`,
        isLink && 'card--link',
        brand && 'card--brand',
        surface === 'night' && 'card--night',
        className
      )}
      data-brand={brand || undefined}
      data-surface={surface === 'night' ? 'night' : undefined}
    >
      {art && (
        <div className="card__media" style={mediaRatio && !place ? { aspectRatio: mediaRatio.replace('/', ' / ') } : undefined}>
          {artNode}
          {mediaOverlay}
        </div>
      )}
      <div className="card__body">
        {badges && <div className="card__badges">{badges}</div>}
        {eyebrow && <p className="card__eyebrow eyebrow">{eyebrow}</p>}
        {kicker && <div className="card__kicker">{kicker}</div>}
        {title && <H className="card__title">{titleNode}</H>}
        {/* Seeded copy: register marks the text reads correctly without are left out; a placeholder-only body is hidden. */}
        {body && !isPlaceholderText(body) && (
          <div className="card__text">{typeof body === 'string' && hasMark(body) ? <InlineMarks text={body} /> : body}</div>
        )}
        {children}
        {meta && <div className="card__meta">{meta}</div>}
        {(footer || cta) && (
          <div className="card__footer">
            {footer}
            {cta && (
              <span className="card__cta" aria-hidden={isLink ? 'true' : undefined}>
                <span className="card__cta-label">{cta}</span>
                <svg className="card__cta-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default Card;
