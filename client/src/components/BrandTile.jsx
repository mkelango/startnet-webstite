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
 * Brand door (Book 3 C22, docs/redesign/SPEC.md §4.6): an Ink or Slate tile at the panel radius (Ink / Slate alternate
 * by position in the list; `tone="ink"|"slate"` fixes it). A 4px accent rule on the top edge, the reversed lock-up
 * (the whole-tile link), the journey dot label, the promise, a one-line stat and the CTA. The photo fills the lower
 * 45% at 55% opacity; on hover it runs full-bleed at full strength under a flat Ink scrim and zooms 1.05.
 * The accent never fills the tile: it is the top rule and the lock-up dot only. The stat sits outside the link.
 */
export function BrandTile({ brand, stat, headingLevel = 3, showArt = true, tone, className }) {
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
    <article
      className={cx('brand-tile', showArt && 'brand-tile--art', (tone === 'ink' || tone === 'slate') && `brand-tile--${tone}`, className)}
      data-brand={brand}
      data-surface="night"
      data-tone={tone === 'slate' ? 'raised' : undefined}
      id={`brand-${brand}`}
    >
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
          <ArrowRight size={18} strokeWidth={1.75} className="brand-tile__cta-arrow" />
        </span>
      </div>
    </article>
  );
}

export default BrandTile;
