import { useLang } from '../lib/i18n.jsx';
import { eventGallery } from '../data/photos.js';
import { ArtImage } from './ArtImage.jsx';
import { cx } from './_utils.js';
import './EventGallery.css';

/**
 * "From the room": photographs of one StartNet event, and only that event (data/photos.js event/<series>/<edition>
 * and its -2, -3 … gallery). Renders nothing until the event has at least `min` photos, so a page never shows an
 * empty frame or a photo from a different event. One caption line and the photo credits sit under the heading.
 */
export function EventGallery({ series, edition, exclude, min = 2, max = 5, headingLevel = 2, className }) {
  const { t, lang } = useLang();
  const all = eventGallery(series);
  // `exclude`: keys already shown on the page (e.g. the edition poster), so the gallery never repeats them.
  const skip = new Set((exclude || []).filter(Boolean));
  const photos = (edition ? all.filter((p) => p.key === `event/${series}/${edition}` || p.key.startsWith(`event/${series}/${edition}-`)) : all)
    .filter((p) => !skip.has(p.key))
    .slice(0, max);
  if (photos.length < min) return null;
  const H = `h${Math.min(Math.max(Number(headingLevel) || 2, 2), 6)}`;
  const caption = (lang === 'ta' && photos[0].captionTa) || photos[0].caption;
  const credits = [...new Set(photos.map((p) => (p.credit || '').replace(/^Photo:\s*/, '')).filter(Boolean))];
  return (
    <section className={cx('event-gallery', className)} aria-label={t('Event photos', 'நிகழ்வுப் படங்கள்')}>
      <div className="event-gallery__head">
        <H className="event-gallery__title">{t('From the room', 'நிகழ்விலிருந்து')}</H>
        {caption && <p className="event-gallery__caption">{caption}</p>}
      </div>
      <ul className={cx('event-gallery__grid', `event-gallery__grid--${photos.length}`)}>
        {photos.map((p, i) => (
          <li key={p.key} className="event-gallery__item">
            <ArtImage photo={p} ratio={i === 0 ? '4/3' : '3/2'} noCaption sizes={i === 0 ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 28vw, 50vw'} />
          </li>
        ))}
      </ul>
      {credits.length > 0 && (
        <p className="event-gallery__credit">{t('Photos', 'படங்கள்')}: {credits.join(', ')}</p>
      )}
    </section>
  );
}

export default EventGallery;
