import { useLang } from '../lib/i18n.jsx';
import { Card } from './Card.jsx';
import { BRANDS } from '../data/brands.js';
import './EventCard.css';
import { Stat } from './Stat.jsx';
import { cx, hashString } from './_utils.js';
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

/** Story card (Book 3 C28): type chip, title, outcome stat, ladder level, reading time. */
export function StoryCard({ story, headingLevel = 3, className }) {
  const { t, pick } = useLang();
  // Lists filter seeded placeholder stories out before rendering (_placeholders.js realStories); a card rendered
  // here is always shown, so a grid never gets an empty cell.
  if (!story) return null;
  const s = story;
  const h = hashString(s.slug || s.title || '');
  const ladder = s.ladderFrom && s.ladderTo ? `${s.ladderFrom} → ${s.ladderTo}` : s.ladderTo || s.ladderFrom;
  const typeLabel = TYPE[s.type] ? t(TYPE[s.type][0], TYPE[s.type][1]) : s.type;

  return (
    <Card
      variant="media"
      ratio="4/5"
      to={s.slug ? `/insights/stories/${s.slug}` : undefined}
      brand={s.brand}
      className={cx('story-card', className)}
      headingLevel={headingLevel}
      art={{ variant: ART[s.type] || 'grid', seed: h % 997, ratio: '4/5', brand: s.brand, photo: s.placeholder ? null : photoFor(`story/${s.slug}`) ?? null, sizes: PHOTO_SIZES.card }}
      kicker={
        typeLabel || (s.brand && BRANDS[s.brand]) ? (
          <span className="story-card__kicker">
            {typeLabel && <span>{typeLabel}</span>}
            {s.brand && BRANDS[s.brand] && (
              <span className="event-card__brand" data-brand={s.brand}>
                {BRANDS[s.brand].name}
              </span>
            )}
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
            {pick(s, 'district') && !isPlaceholderText(pick(s, 'district')) && <span>{pick(s, 'district')}</span>}
            {s.readingMinutes ? <span>{t(`${s.readingMinutes} min read`, `${s.readingMinutes} நிமிட வாசிப்பு`)}</span> : null}
          </p>
        </>
      }
      cta={t('Read the story', 'கதையைப் படியுங்கள்')}
    />
  );
}

export default StoryCard;
