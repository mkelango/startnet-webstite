import { Quote as QuoteGlyph } from 'lucide-react';
import { formatDate } from '../lib/format.js';
import { useLang } from '../lib/i18n.jsx';
import { ArtImage } from './ArtImage.jsx';
import { Reveal } from './Reveal.jsx';
import { cx, isoLike } from './_utils.js';
import './Quote.css';

/**
 * Pull quote (Book 3 C30, docs/redesign/SPEC.md §4.11): <figure><blockquote><figcaption>. Use only with written consent.
 * - `size="lg"` (default): the PnP quote panel on Bone (Slate on Ink, or `surface="night"`), radius --radius-panel.
 *   With `photo` (an ArtImage photo) it is 2 columns ≥1024 (7fr 5fr): text left, a warm mono portrait right.
 * - `size="md"`: a text-only card (Card ground, radius 12). With `logo` it is the partner proof card: the mono logo
 *   first (32 tall).
 * Extra optional props (NEW): `photo`, `avatar` (48px round author photo), `logo` (URL or `{ src, alt }`), `surface`.
 */
export function Quote({ quote, name, role, place, date, brand, size = 'lg', photo, avatar, logo, surface, className }) {
  const { lang } = useLang();
  if (!quote) return null;
  const details = [role, place, isoLike(date) ? formatDate(date, undefined, lang) : date].filter(Boolean).join(' · ');
  const withPhoto = size === 'lg' && Boolean(photo);
  const logoSrc = typeof logo === 'string' ? logo : logo && logo.src;
  const logoAlt = (logo && typeof logo === 'object' && logo.alt) || name || '';
  return (
    <Reveal
      as="figure"
      className={cx('quote', `quote--${size}`, withPhoto && 'quote--photo', logoSrc && 'quote--logo', className)}
      data-brand={brand || undefined}
      data-surface={surface === 'night' ? 'night' : undefined}
      data-tone={surface === 'night' ? 'raised' : undefined}
      y={12}
    >
      <div className="quote__body">
        {logoSrc && (
          <span className="quote__logo">
            <img src={logoSrc} alt={logoAlt} loading="lazy" decoding="async" />
          </span>
        )}
        <QuoteGlyph className="quote__mark" size={32} strokeWidth={1.75} aria-hidden="true" focusable="false" />
        <blockquote className="quote__text">
          {typeof quote === 'string' ? <p>{quote}</p> : quote}
        </blockquote>
        {(name || details) && (
          <figcaption className={cx('quote__cite', avatar && 'quote__cite--avatar')}>
            {avatar && (
              <span className="quote__avatar">
                <ArtImage photo={avatar} ratio="1/1" variant="portrait" noCaption sizes="48px" />
              </span>
            )}
            <span className="quote__who">
              {name && <span className="quote__name">{name}</span>}
              {details && <span className="quote__details">{details}</span>}
            </span>
          </figcaption>
        )}
      </div>
      {withPhoto && (
        <div className="quote__photo">
          <ArtImage photo={photo} ratio="4/5" noCaption sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      )}
    </Reveal>
  );
}

export default Quote;
