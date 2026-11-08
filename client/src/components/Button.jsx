import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { cx, isExternal, isSnx, isHttp, renderIcon } from './_utils.js';
import './Button.css';

/**
 * Button (docs/redesign/SPEC.md §4.1): a pill, weight 500, sizes sm 32 / md 40 / lg 48 (40 / 44 on touch).
 * Renders <Link> (to), <a> (href) or <button>.
 * Variants: primary (Ink fill, Slate hover; Paper on Ink), point (the ONE red CTA: Red-600 → 700 → 800, at most once
 * per section, never beside a red .dot), secondary (control ring → Ink fill), tertiary (text + trailing arrow),
 * brand (accent fill), inverse (Paper on photos), whatsapp (as secondary).
 * A trailing "→" typed in a string label is wrapped in span.arrow[aria-hidden] (same visible text) so it nudges.
 * Optional props:
 * - `shortLabel`: shown instead of the label below 400px (keep it a shortening of the label).
 * - `arrow` (default false): a trailing Lucide ArrowRight that nudges 4px on hover (tertiary always has one).
 * - `iconOnly` (default false): a circle (40, or 48 at size="lg") holding only `icon`; a string child becomes the
 *   visually hidden label, otherwise pass `aria-label`.
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    to,
    href,
    onClick,
    type = 'button',
    icon,
    full,
    disabled,
    loading,
    children,
    shortLabel,
    arrow = false,
    iconOnly = false,
    className,
    ...rest
  },
  ref
) {
  const { localePath, t } = useLang();
  // A full URL passed as `to` behaves like `href`.
  const link = href || (to && isHttp(to) ? to : null);
  const internal = !link && to ? to : null;
  const external = link && isExternal(link) && !/^(mailto|tel):/i.test(link);
  const snx = link && isSnx(link);

  const iconSize = ICON_SIZE[size] || ICON_SIZE.md;
  let trailing = null;
  if (icon) trailing = renderIcon(icon, { size: iconSize, 'aria-hidden': true, strokeWidth: iconSize <= 16 ? 2 : 1.75 });
  else if (external && !iconOnly) trailing = <ArrowUpRight size={iconSize} aria-hidden="true" strokeWidth={iconSize <= 16 ? 2 : 1.75} />;
  else if ((variant === 'tertiary' || arrow) && !iconOnly) trailing = <ArrowRight size={iconSize} aria-hidden="true" strokeWidth={iconSize <= 16 ? 2 : 1.75} />;

  const classes = cx(
    'button',
    `button--${variant}`,
    `button--${size}`,
    full && 'button--full',
    iconOnly && 'button--icon',
    (arrow || variant === 'tertiary') && 'button--arrow',
    loading && 'button--loading',
    trailing && 'button--has-icon',
    shortLabel && 'button--has-short',
    className
  );

  const label = withArrow(children);
  const inner = iconOnly ? (
    <>
      {trailing && <span className="button__icon" aria-hidden="true">{trailing}</span>}
      {children != null && children !== '' && <span className="visually-hidden">{children}</span>}
      {external && (
        <span className="visually-hidden">
          {snx ? t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)') : t(' (external site)', ' (வெளி இணையதளம்)')}
        </span>
      )}
    </>
  ) : (
    <>
      <span className="button__label">
        {shortLabel ? (
          <>
            <span className="button__label-full">{label}</span>
            <span className="button__label-short">{withArrow(shortLabel)}</span>
          </>
        ) : (
          label
        )}
      </span>
      {trailing && <span className="button__icon" aria-hidden="true">{trailing}</span>}
      {external && (
        <span className="visually-hidden">
          {snx ? t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)') : t(' (external site)', ' (வெளி இணையதளம்)')}
        </span>
      )}
      {loading && (
        <span className="button__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </>
  );

  if ((internal || link) && disabled) {
    return (
      <a ref={ref} className={classes} aria-disabled="true" role="link" {...rest}>
        {inner}
      </a>
    );
  }

  if (internal) {
    return (
      <Link ref={ref} to={localePath(internal)} className={classes} onClick={onClick} {...rest}>
        {inner}
      </Link>
    );
  }

  if (link) {
    // WhatsApp click-to-chat opens in a new tab so web.whatsapp.com never replaces the StartNet tab.
    const wa = variant === 'whatsapp' || /^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(link);
    const newTab = wa && external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <a ref={ref} href={link} className={classes} onClick={onClick} {...newTab} {...rest}>
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      {...rest}
    >
      {inner}
    </button>
  );
});

/** Icon size per button size (SPEC §4.1: 16 / 18 / 20). */
const ICON_SIZE = { sm: 16, md: 18, lg: 20 };

/** "Register →" → "Register " + <span class="arrow" aria-hidden>→</span>: same visible text, the glyph can nudge. */
function withArrow(node) {
  if (typeof node !== 'string') return node;
  const m = node.match(/^([\s\S]*?)(\s*)(→|↗)$/);
  if (!m || !m[1]) return node;
  return (
    <>
      {m[1]}
      {m[2]}
      <span className="arrow" aria-hidden="true">{m[3]}</span>
    </>
  );
}

export default Button;
