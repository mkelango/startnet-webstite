import { useLang, contentLangFor } from '../lib/i18n.jsx';
import { Reveal } from './Reveal.jsx';
import { cx } from './_utils.js';
import './SectionHeader.css';

const TITLE_CLASS = { h1: 'h1', h2: 'h2', h3: 'h3' };

/**
 * Dot label + title + lede, with an optional action (docs/redesign/SPEC.md §4.3).
 * Layout: ≥768 the text block (max --measure-head) and the action side by side, bottom-aligned; below 768 the action
 * sits under the lede.
 * Choreography: label, title and lede rise in at 0 / 60 / 120 ms, the action at 180 ms (the dot never moves);
 * the title uses the line-mask reveal (Reveal variant="mask").
 * `align="center"` (inset Ink panels): one centred column, the action under the lede.
 */
export function SectionHeader({ eyebrow, title, lede, action, as = 'h2', align = 'left', id, className, contentLang }) {
  const { lang } = useLang();
  const Tag = as;
  return (
    <div className={cx('section-header', `section-header--${align}`, action && 'section-header--has-action', className)}>
      <div className="section-header__text">
        {eyebrow && (
          <Reveal as="p" className="eyebrow section-header__eyebrow" lang={contentLangFor(lang, eyebrow, contentLang)}>
            {eyebrow}
          </Reveal>
        )}
        <Reveal as={Tag} id={id} delay={0.06} variant="mask" className={cx('section-header__title', TITLE_CLASS[as] || 'h2')} lang={contentLangFor(lang, title, contentLang)}>
          {title}
        </Reveal>
        {lede && (
          <Reveal delay={0.12} className="section-header__lede body-lg" lang={contentLangFor(lang, lede, contentLang)}>
            {lede}
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.18} className="section-header__action">
          {action}
        </Reveal>
      )}
    </div>
  );
}

export default SectionHeader;
