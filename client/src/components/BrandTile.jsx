import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { BRANDS } from '../data/brands.js';
import { BrandLockup } from './BrandLockup.jsx';
import { ArtImage } from './ArtImage.jsx';
import { Stat } from './Stat.jsx';
import { JourneyLine } from './BrandHero.jsx';
import { cx } from './_utils.js';
import './BrandTile.css';
import { tilePhoto, PHOTO_SIZES } from '../data/photos.js';

const ART = { research: 'network', vibe: 'grid', connect: 'network', women: 'ladder', x: 'dot' };
const SEED = { research: 11, vibe: 23, connect: 37, women: 41, x: 5 };

/**
 * Brand door (Book 3 C22, DESIGN-v2 3.7 media card): unframed 4/5 media, accent only in the journey dot label;
 * hover zooms the media 1.03 and nudges the arrow. The stat sits outside the link.
 */
export function BrandTile({ brand, stat, headingLevel = 3, showArt = true, className }) {
  const { t, localePath, pick } = useLang();
  const b = BRANDS[brand];
  if (!b) return null;
  const H = `h${headingLevel}`;
  const journey = t(b.journey, b.journeyTa);
  const name = t(`Explore ${b.name}`, `${b.name}-ஐ ஆராயுங்கள்`);
  // The accessible name starts with the visible lock-up text ("StartNet Research"), WCAG 2.5.3.
  const journeyText = String(journey).replace(/→/g, t('to', 'முதல்'));
  const linkLabel = t(`Explore ${b.name}: ${journeyText}`, `${b.name}: ஆராயுங்கள். ${journeyText}`);

  return (
    <article className={cx('brand-tile', className)} data-brand={brand} id={`brand-${brand}`}>
      <span className="brand-tile__rule" aria-hidden="true" />
      {showArt && (
        <div className="brand-tile__art">
          <ArtImage variant={ART[brand] || 'grid'} seed={SEED[brand] || 1} ratio="4/5" brand={brand} photo={tilePhoto(brand, b.base)} sizes={PHOTO_SIZES.card} />
        </div>
      )}
      <div className="brand-tile__body">
        <H className="brand-tile__heading">
          <Link to={localePath(b.base)} className="brand-tile__link" aria-label={linkLabel}>
            <BrandLockup brand={brand} size="md" />
          </Link>
        </H>
        <JourneyLine text={journey} className="brand-tile__journey" />
        <p className="brand-tile__promise">{pick(b, 'promise')}</p>
        {stat && (
          <div className="brand-tile__stat">
            <Stat metric={stat} variant="compact" />
          </div>
        )}
        <span className="brand-tile__cta" aria-hidden="true">
          {name}
          <ArrowRight size={18} className="brand-tile__cta-arrow" />
        </span>
      </div>
    </article>
  );
}

export default BrandTile;
