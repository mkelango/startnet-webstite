import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n.jsx';
import { renderArt } from './renderArt.jsx';
import { cx, isHttp } from './_utils.js';
import { InlineMarks } from './InlineMarks.jsx';
import { hasMark, isPlaceholderText } from './_placeholders.js';
import './Card.css';

/**
 * Content card (DESIGN-v2 3.7). The whole card is one link via a pseudo-element on the title link,
 * so secondary actions (tag buttons, footer links) keep their own focus (Book 3 §3.5).
 * Two families:
 *  - `variant="framed"` (default): Card #FBFAF7 with a hairline ring and a top-rule hover (Card, ReportCard, ProgrammeCard).
 *  - `variant="media"`: unframed editorial card, 12px media at a fixed `ratio`, meta + title + 2-line text + CTA
 *    bottom-left, hover zoom 1.03 + title underline sweep + arrow nudge (EventCard, StoryCard).
 * Extra optional props: `badges` (node above the title), `kicker` (meta-style row above the title),
 * `headingLevel` (default 3), `cta` (visual cue text), `ratio` (media aspect, e.g. '4/3').
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
  className,
  children,
}) {
  const { localePath } = useLang();
  const H = `h${Math.min(Math.max(Number(headingLevel) || 3, 2), 6)}`;
  const internal = to && !isHttp(to) ? to : null;
  const external = href || (to && isHttp(to) ? to : null);
  const isLink = Boolean(internal || external);

  const media = variant === 'media';
  const titleText = isLink ? <span className="card__title-text u-sweep">{title}</span> : title;
  let titleNode = title;
  if (internal) titleNode = <Link className="card__link" to={localePath(internal)} draggable="false">{titleText}</Link>;
  else if (external) titleNode = <a className="card__link" href={external} draggable="false">{titleText}</a>;

  const artNode = art ? renderArt(ratio ? { ...art, ratio } : art, { ratio: ratio || '16/9', brand }) : null;
  return (
    <article
      className={cx('card', media ? 'card--media' : 'card--framed', isLink && 'card--link', brand && 'card--brand', className)}
      data-brand={brand || undefined}
    >
      {art && (
        <div className="card__media" style={ratio ? { aspectRatio: ratio.replace('/', ' / ') } : undefined}>
          {artNode}
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
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
