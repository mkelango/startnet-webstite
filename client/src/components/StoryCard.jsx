import { MapPin } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { formatDate } from '../lib/format.js';
import { Card } from './Card.jsx';
import { BRANDS } from '../data/brands.js';
import './EventCard.css';
import { Stat } from './Stat.jsx';
import { cx, hashString, isoLike } from './_utils.js';
import { isPlaceholderText } from './_placeholders.js';
import { InlineMarks } from './InlineMarks.jsx';
import './StoryCard.css';
import { photoFor, PHOTO_SIZES } from '../data/photos.js';

const TYPE = {
  founder: ['Founder story', 'நிறுவனர் கதை'],
  partner: ['Partner story', 'கூட்டாளர் கதை'],
  recap: ['Recap', 'சுருக்கம்'],
};
const ART = { founder: 'ladder', partner: 'network', recap: 'grid' };

/**
 * Story card (Book 3 C28, docs/redesign/SPEC.md §4.6): an Ink card (radius 12). The 16/10 media sits flush on top with
 * the type chip inset 16px top-left; then the brand dot label, title (2 lines), excerpt (3 lines), outcome stat and a
 * meta row (ladder · district · reading time · date).
 * Extra optional props:
 *  - `variant="portrait"` (NEW): the photo fills a 4/5 card under a flat Ink scrim, text at the bottom (hero rails,
 *    Scroller items).
 *  - `logo` (NEW): the company logo chip inset 16px bottom-right of the media (Paper, radius 8); a URL string or
 *    `{ src, alt }`.
 */
export function StoryCard({ story, headingLevel = 3, variant, logo, className }) {
  const { t, pick, lang } = useLang();
  // Lists filter seeded placeholder stories out before rendering (_placeholders.js realStories); a card rendered
  // here is always shown, so a grid never gets an empty cell.
  if (!story) return null;
  const s = story;
  const portrait = variant === 'portrait';
  const ratio = portrait ? '4/5' : '16/10';
  const h = hashString(s.slug || s.title || '');
  const ladder = s.ladderFrom && s.ladderTo ? `${s.ladderFrom} → ${s.ladderTo}` : s.ladderTo || s.ladderFrom;
  const typeLabel = TYPE[s.type] ? t(TYPE[s.type][0], TYPE[s.type][1]) : s.type;
  const district = pick(s, 'district');
  const logoSrc = typeof logo === 'string' ? logo : logo && logo.src;
  const logoAlt = (logo && typeof logo === 'object' && logo.alt) || '';
  const date = isoLike(s.date) ? formatDate(s.date, { month: 'short', year: 'numeric' }, lang) : null;

  const overlay = typeLabel || logoSrc ? (
    <>
      {typeLabel && (
        <span className="story-card__chips">
          <span className="story-card__chip story-card__chip--type">{typeLabel}</span>
        </span>
      )}
      {logoSrc && (
        <span className="story-card__logo">
          <img src={logoSrc} alt={logoAlt} loading="lazy" decoding="async" />
        </span>
      )}
    </>
  ) : null;

  return (
    <Card
      variant="media"
      surface="night"
      ratio={ratio}
      to={s.slug ? `/insights/stories/${s.slug}` : undefined}
      brand={s.brand}
      className={cx('story-card', portrait && 'story-card--portrait', className)}
      headingLevel={headingLevel}
      art={{ variant: ART[s.type] || 'grid', seed: h % 997, ratio, brand: s.brand, photo: s.placeholder ? null : photoFor(`story/${s.slug}`) ?? null, sizes: PHOTO_SIZES.card }}
      mediaOverlay={overlay}
      kicker={
        s.brand && BRANDS[s.brand] ? (
          <span className="story-card__kicker">
            <span className="event-card__brand" data-brand={s.brand}>
              {BRANDS[s.brand].name}
            </span>
          </span>
        ) : null
      }
      title={pick(s, 'title')}
      body={pick(s, 'excerpt') ? <p className="story-card__excerpt"><InlineMarks text={pick(s, 'excerpt')} /></p> : null}
      meta={
        <>
          {s.outcome && <Stat metric={s.outcome} variant="compact" />}
          <p className="story-card__facts">
            {ladder && (
              <span className="story-card__ladder" aria-label={`${t('Ladder', 'ஏணி')} ${ladder.replace('→', t('to', 'முதல்'))}`}>
                {ladder}
              </span>
            )}
            {district && !isPlaceholderText(district) && (
              <span className="story-card__district">
                <MapPin size={16} strokeWidth={1.75} aria-hidden="true" className="event-card__icon" />
                {district}
              </span>
            )}
            {s.readingMinutes ? <span>{t(`${s.readingMinutes} min read`, `${s.readingMinutes} நிமிட வாசிப்பு`)}</span> : null}
            {date && <time dateTime={s.date}>{date}</time>}
          </p>
        </>
      }
      cta={t('Read the story', 'கதையைப் படியுங்கள்')}
    />
  );
}

export default StoryCard;
