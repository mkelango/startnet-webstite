import { useLang } from '../lib/i18n.jsx';
import { cx } from './_utils.js';
import './Section.css';

/** Page section with vertical rhythm (--space-section) and a container inside. */
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
      data-surface={surface === 'night' ? 'night' : undefined}
      data-brand={brand || undefined}
      aria-labelledby={labelledBy}
      lang={contentLang && contentLang !== lang ? contentLang : undefined}
      {...rest}
    >
      <div className={inner}>{children}</div>
    </section>
  );
}

export default Section;
