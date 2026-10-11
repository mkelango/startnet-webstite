import { useLang, contentLangFor } from '../lib/i18n.jsx';
import { KineticHeadline } from './KineticHeadline.jsx';
import { Breadcrumbs } from './Breadcrumbs.jsx';
import { renderArt } from './renderArt.jsx';
import { Reveal } from './Reveal.jsx';
import { cx } from './_utils.js';
import './PageHero.css';
import { heroPhoto, PHOTO_SIZES } from '../data/photos.js';

/**
 * Statement hero (Book 3 C10, DESIGN-v2 3.5, AIWO blueprint P2): the Ink band.
 * `layout="split"` (the default when there is art): copy top-aligned in cols 1–6, the media runs edge to edge in
 * cols 7–12 (right viewport edge, top and bottom of the band; the Paper sheet rises over its foot). Below 1024 a
 * photograph comes first, full bleed (16/10 tablets, 4/5 phones); a motion visual stays under the copy as a 16/10 band.
 * `layout="contained"`: the older 7/5 grid with a 4/3 framed media (max 560px).
 * The media clips in on first paint with CSS only (static under reduced motion / in the prerender).
 * `accentWord`: one Latin word of the h1 set in the serif accent (falls back to the first word).
 * Extra optional prop `contentLang`: lang of the hero copy (e.g. 'en' for untranslated copy on /ta pages).
 * When omitted, English-only string title/lede on /ta pages are marked lang="en" automatically.
 */
export function PageHero({ eyebrow, title, lede, actions, art, surface = 'paper', breadcrumbs, meta, className, titleClass, contentLang, accentWord, layout = 'split' }) {
  const { lang, basePath } = useLang();
  const rootLang = contentLang && contentLang !== lang ? contentLang : undefined;
  // Redesign (Oct 2026): every page hero is the dark ink band the content sheets slide over (AngelList pattern).
  const night = true;
  const hasArt = Boolean(art);
  return (
    <header
      className={cx('page-hero', `page-hero--${surface}`, hasArt && 'page-hero--with-art', hasArt && layout === 'split' && 'page-hero--split', className)}
      data-surface={night ? 'night' : undefined}
      lang={rootLang}
    >
      <div className="container page-hero__inner">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="page-hero__crumbs" />}
        <div className="page-hero__grid">
          <div className="page-hero__text">
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
              className={cx('page-hero__title', titleClass || (hasArt ? 'display-xl' : 'display-2xl'))}
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
          {hasArt && (
            <div className="page-hero__art">
              {renderArt(art, { ratio: '4/3', animate: true, night, photo: heroPhoto(basePath || '/'), priority: true, sizes: PHOTO_SIZES.hero })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageHero;
