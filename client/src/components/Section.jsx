import { useLang } from '../lib/i18n.jsx';
import { cx } from './_utils.js';
import './Section.css';

/**
 * Page section with vertical rhythm and a container inside (docs/redesign/SPEC.md §4.4).
 * `pad`: default (--space-section 80→128) · tight (--space-section-tight 48→64) · sm (--space-band 24→32) · none.
 * `surface`: paper (default) · white / sunken (Bone) · night (Ink band) · accent (Ink with a 3px accent top rule;
 * the accent is never a ground) · inset (NEW: PnP's rounded Ink panel inside a 12px Paper margin, drawn by theme.css;
 * full bleed below 768). night, accent and inset count as Ink bands and carry data-surface="night".
 */
export function Section({
  surface = 'paper',
  brand,
  id,
  className,
  width = 'default',
  pad = 'default',
  children,
  labelledBy,
  contentLang,
  ...rest
}) {
  // Extra optional prop `contentLang`: lang of the section's copy (e.g. 'en' for untranslated copy on /ta pages).
  const { lang } = useLang();
  const inner =
    width === 'full' ? 'section__inner' : cx('container', width === 'narrow' && 'container--narrow', 'section__inner');
  return (
    <section
      id={id}
      className={cx('section', `section--${surface}`, `section--pad-${pad}`, className)}
      data-surface={NIGHT.has(surface) ? 'night' : undefined}
      data-brand={brand || undefined}
      aria-labelledby={labelledBy}
      lang={contentLang && contentLang !== lang ? contentLang : undefined}
      {...rest}
    >
      <div className={inner}>{children}</div>
    </section>
  );
}

const NIGHT = new Set(['night', 'inset', 'accent']);

export default Section;
