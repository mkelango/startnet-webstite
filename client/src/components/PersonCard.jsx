import { useLang } from '../lib/i18n.jsx';
import { ArtImage } from './ArtImage.jsx';
import { Badge } from './Badge.jsx';
import { cx, hashString, initialsOf } from './_utils.js';
import { photoFor, PHOTO_SIZES } from '../data/photos.js';
import './PersonCard.css';

/**
 * Person card (Book 3 C27). The portrait is generative art with initials, unless StartNet has supplied a consented
 * photo of that person (data/photos.js: person/<slug>). Placeholder people never get a photo.
 */
export function PersonCard({ person, headingLevel = 3, compact = false, className }) {
  const { lang, pick } = useLang();
  // Lists filter unnamed people out before rendering (_placeholders.js realPeople), so no wrapper is left empty.
  if (!person) return null;
  const p = person;
  const H = `h${Math.min(Math.max(Number(headingLevel) || 3, 2), 6)}`;
  const initials = p.initials || initialsOf(p.name);
  return (
    <article className={cx('person-card', compact && 'person-card--compact', className)} data-brand={p.brand || undefined}>
      <div className="person-card__portrait">
        <ArtImage
          variant="portrait"
          ratio="1/1"
          brand={p.brand}
          seed={hashString(p.slug || p.name || '') % 997}
          initials={initials}
          photo={p.slug && !/\[/.test(p.name || '') ? photoFor(`person/${p.slug}`) : null}
          sizes={PHOTO_SIZES.portrait}
        />
      </div>
      <div className="person-card__body">
        <H className="person-card__name">{lang === 'ta' && p.nameTa ? p.nameTa : p.name}</H>
        {p.nameTa && lang !== 'ta' && (
          <p className="person-card__name-ta" lang="ta">
            {p.nameTa}
          </p>
        )}
        {p.role && <p className="person-card__role">{pick(p, 'role')}</p>}
        {p.org && <p className="person-card__org">{pick(p, 'org')}</p>}
        {p.brand && (
          <div className="person-card__badges">
            <Badge kind="brand" brand={p.brand} />
          </div>
        )}
      </div>
    </article>
  );
}

export default PersonCard;
