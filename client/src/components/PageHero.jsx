import { useLang, contentLangFor } from '../lib/i18n.jsx';
import { KineticHeadline } from './KineticHeadline.jsx';
import { Breadcrumbs } from './Breadcrumbs.jsx';
import { renderArt } from './renderArt.jsx';
import { Reveal } from './Reveal.jsx';
import { cx } from './_utils.js';
import './PageHero.css';
import { heroPhoto, PHOTO_SIZES } from '../data/photos.js';

/**
 * Page hero (docs/redesign/SPEC.md §4.5): the Ink band the first Paper sheet rises over (theme.css).
 * `layout`:
 * - "split" (default; "contained" is an alias kept for old callers): ≥1024 a 12-column grid, the copy in cols 1–7
 *   (breadcrumbs → dot label → h1 at --text-display-xl, max 14ch → lede → actions → meta), the media in cols 8–12,
 *   4/3, max 560px, bleeding to the right viewport edge with its left corners rounded (--radius-panel). Below 1024
 *   the copy comes first and the media follows at full container width, 3/2, --radius-media.
 * - "text": one column, max 900px, no media (also what any hero without `art` renders).
 * - "photo" (NEW): a full-bleed warm mono photo under a flat Ink scrim (--overlay-photo-strong), min-height 560
 *   (≥1024) / 480, the copy bottom-left in cols 1–7. StartNet X home and district pages.
 * The media clips in on first paint with CSS only (static under reduced motion / in the prerender).
 * `accentWord`: one Latin word of the h1 set in the serif accent (falls back to the first word).
 * Extra optional prop `contentLang`: lang of the hero copy (e.g. 'en' for untranslated copy on /ta pages).
 * When omitted, English-only string title/lede on /ta pages are marked lang="en" automatically.
 */
export function PageHero({ eyebrow, title, lede, actions, art, surface = 'paper', breadcrumbs, meta, className, titleClass, contentLang, accentWord, layout = 'split' }) {
  const { lang, basePath } = useLang();
  const rootLang = contentLang && contentLang !== lang ? contentLang : undefined;
  // Every page hero is the Ink band (SPEC §4.5); `surface` is kept for old callers and only names a class.
  const night = true;
  const kind = layout === 'photo' || layout === 'text' ? layout : 'split';
  const hasArt = Boolean(art) && kind !== 'text';
  const mode = hasArt ? kind : 'text';
  const artNode = hasArt
    ? renderArt(art, {
        ratio: mode === 'photo' ? '16/9' : '4/3',
        animate: true,
        night,
        photo: heroPhoto(basePath || '/'),
        priority: true,
        sizes: mode === 'photo' ? '100vw' : PHOTO_SIZES.hero,
      })
    : null;
  return (
    <header
      className={cx(
        'page-hero',
        `page-hero--${surface}`,
        `page-hero--${mode}`,
        hasArt && 'page-hero--with-art',
        className
      )}
      data-surface={night ? 'night' : undefined}
      lang={rootLang}
    >
      {mode === 'photo' && artNode && (
        <div className="page-hero__bg">
          {artNode}
        </div>
      )}
      <div className="container page-hero__inner">
        <div className="page-hero__grid">
          <div className="page-hero__text">
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="page-hero__crumbs" />}
            {eyebrow && (
              <p className="eyebrow page-hero__eyebrow" lang={rootLang ? undefined : contentLangFor(lang, eyebrow)}>
                {eyebrow}
              </p>
            )}
            <KineticHeadline
              text={title}
              as="h1"
              accentFirst={!accentWord}
              accentWord={accentWord}
              className={cx('page-hero__title', titleClass || 'display-xl')}
              lang={rootLang ? undefined : contentLangFor(lang, title)}
            />
            {/* LCP: lede and primary CTA paint on first render (transform-only entrance, no fade). */}
            {lede && (
              <div
                className="page-hero__lede body-lg hero-rise"
                style={{ '--rise-delay': '0.2s' }}
                lang={rootLang ? undefined : contentLangFor(lang, lede)}
              >
                {lede}
              </div>
            )}
            {actions && (
              <div className="page-hero__actions cluster hero-rise" style={{ '--rise-delay': '0.28s' }} data-primary-cta="">
                {actions}
              </div>
            )}
            {meta && (
              <Reveal className="page-hero__meta" delay={0.45} y={8}>
                {meta}
              </Reveal>
            )}
          </div>
          {mode === 'split' && artNode && <div className="page-hero__art">{artNode}</div>}
        </div>
      </div>
    </header>
  );
}

export default PageHero;
