import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { cx, isExternal, isSnx, isHttp, renderIcon } from './_utils.js';
import './Button.css';

/**
 * Button (DESIGN-v2 3.6): 4px rectangle, weight 500. Renders <Link> (to), <a> (href) or <button>.
 * Variants: primary (Ink → Red-600 on hover), secondary (ring), tertiary (arrow link), brand, whatsapp, inverse.
 * Tertiary = text + arrow that nudges on hover. A trailing "→" typed in a string label is wrapped in
 * span.arrow[aria-hidden] (same visible text) so it nudges like the icon.
 * Extra optional prop `shortLabel`: shown instead of the label below 400px (keep it a shortening of the label).
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

  let trailing = null;
  if (icon) trailing = renderIcon(icon, { size: size === 'sm' ? 16 : 18, 'aria-hidden': true, strokeWidth: 2 });
  else if (external) trailing = <ArrowUpRight size={size === 'sm' ? 15 : 17} aria-hidden="true" strokeWidth={2} />;
  else if (variant === 'tertiary') trailing = <ArrowRight size={size === 'sm' ? 16 : 18} aria-hidden="true" strokeWidth={2} />;

  const classes = cx(
    'button',
    `button--${variant}`,
    `button--${size}`,
    full && 'button--full',
    loading && 'button--loading',
    trailing && 'button--has-icon',
    shortLabel && 'button--has-short',
    className
  );

  const label = withArrow(children);
  const inner = (
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
