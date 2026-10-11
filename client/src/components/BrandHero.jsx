import { ArrowRight } from 'lucide-react';
import { useLang, contentLangFor } from '../lib/i18n.jsx';
import { BRANDS } from '../data/brands.js';
import { BrandLockup } from './BrandLockup.jsx';
import { KineticHeadline } from './KineticHeadline.jsx';
import { renderArt } from './renderArt.jsx';
import { cx } from './_utils.js';
import './BrandHero.css';
import { heroPhoto, PHOTO_SIZES } from '../data/photos.js';

const ART_FOR = { research: 'network', vibe: 'grid', connect: 'network', women: 'ladder', x: 'dot' };

/** Journey line "Scholar → Founder": the arrow is read as "to". */
export function JourneyLine({ text, className }) {
  const { t } = useLang();
  const toWord = t(' to ', ' முதல் ');
  if (!text) return null;
  const parts = String(text).split('→').map((s) => s.trim());
  if (parts.length < 2) return <span className={cx('journey-line', className)}>{text}</span>;
  return (
    <span className={cx('journey-line', className)}>
      {parts.map((p, i) => (
        <span key={`${p}-${i}`} className="journey-line__part">
          {i > 0 && (
            <>
              <ArrowRight className="journey-line__arrow" size="1em" aria-hidden="true" />
              <span className="visually-hidden">{toWord}</span>
            </>
          )}
          {p}
        </span>
      ))}
    </span>
  );
}

/**
 * Brand hero (Book 3 C11, DESIGN-v2 3.5, AIWO blueprint P2): lock-up, journey dot label (the brand accent), H1,
 * lede, CTAs and the media. `layout="split"` (default): at ≥1024 the copy sits in cols 1–6 and the media runs edge to
 * edge in cols 7–12 (right viewport edge, top and bottom of the band); below 1024 a photograph leads full bleed and a
 * motion visual follows the copy. `layout="contained"`: the older 5/7 grid with a 16/10 media bleeding right.
 * `meta` sits in normal flow under the lede as a hairline-topped row. `accentWord`: one Latin word in the serif accent.
 */
export function BrandHero({ brand, title, lede, actions, art, meta, endorsement, compact = false, className, contentLang, sweep = true, accentWord, layout = 'split' }) {
  const { t, lang, basePath } = useLang();
  // Real photo for this page's hero, when StartNet has supplied one (data/photos.js: hero/<page path>).
  const heroDefaults = { ratio: '16/10', animate: true, photo: heroPhoto(basePath || '/'), priority: true, sizes: PHOTO_SIZES.hero };
  // Extra optional prop `contentLang`: lang of the hero copy. When omitted, English-only string
  // title/lede on /ta pages are marked lang="en" automatically (WCAG 3.1.2).
  // Extra optional prop `sweep` (default true): false hides the accent sweep. It is also hidden
  // automatically when the hero sits under the brand sub-nav, whose own rule already carries the accent.
  const rootLang = contentLang && contentLang !== lang ? contentLang : undefined;
  const b = BRANDS[brand] || null;
  const journey = b ? t(b.journey, b.journeyTa) : null;
  const artNode =
    art === undefined && b ? renderArt({ ...heroDefaults, variant: ART_FOR[brand] || 'grid', seed: 3 }) : renderArt(art, heroDefaults);

  return (
    <header
      className={cx(
        'brand-hero',
        compact && 'brand-hero--compact',
        artNode && 'brand-hero--with-art',
        artNode && !compact && layout === 'split' && 'brand-hero--split',
        !sweep && 'brand-hero--no-sweep',
        className
      )}
      data-brand={brand || undefined}
      data-surface="night"
      lang={rootLang}
    >
      <span className="brand-hero__sweep" aria-hidden="true" />
      <div className="container brand-hero__inner">
        <div className="brand-hero__text">
          <div className="brand-hero__id">
            {b && <BrandLockup brand={brand} size={compact ? 'sm' : 'md'} />}
            {journey && <JourneyLine text={journey} className="brand-hero__journey" />}
          </div>
          <KineticHeadline
            text={title}
            as="h1"
            className={cx('brand-hero__title', compact ? 'h1' : 'display-xl')}
            accentFirst={!accentWord}
            accentWord={accentWord}
            lang={rootLang ? undefined : contentLangFor(lang, title)}
          />
          {endorsement && (
            <p className="brand-hero__endorsement" lang={rootLang ? undefined : contentLangFor(lang, endorsement)}>
              {endorsement}
            </p>
          )}
          {/* LCP: lede and primary CTA paint on first render (transform-only entrance, no fade). */}
          {lede && (
            <div
              className="brand-hero__lede body-lg hero-rise"
              style={{ '--rise-delay': '0.2s' }}
              lang={rootLang ? undefined : contentLangFor(lang, lede)}
            >
              {lede}
            </div>
          )}
          {actions && (
            <div className="brand-hero__actions cluster hero-rise" style={{ '--rise-delay': '0.28s' }} data-primary-cta="">
              {actions}
            </div>
          )}
          {meta && (
            <div className="brand-hero__meta hero-rise" style={{ '--rise-delay': '0.34s' }}>
              {meta}
            </div>
          )}
        </div>
        {artNode && !compact && <div className="brand-hero__art">{artNode}</div>}
      </div>
    </header>
  );
}

export default BrandHero;
