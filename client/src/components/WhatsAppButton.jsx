import { MessageCircle } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { waLink } from '../lib/links.js';
import { cx } from './_utils.js';
import './Button.css';
import './WhatsAppButton.css';

/**
 * WhatsApp click-to-chat (wa.me) with a prefilled context ref.
 * NOTE: React reserves the `ref` prop, so the context ref is passed as `refCode` (alias `contextRef`).
 */
export function WhatsAppButton({ text, refCode, contextRef, label, iconOnly = false, size = 'md', className }) {
  const { t } = useLang();
  const href = waLink(text || 'Hi StartNet', refCode || contextRef);
  const name = label || t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்');
  const opens = t('(opens WhatsApp)', '(WhatsApp-இல் திறக்கும்)');
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx('button', 'button--whatsapp', `button--${size}`, 'whatsapp-button', iconOnly && 'whatsapp-button--icon', className)}
      aria-label={iconOnly ? `${name} ${opens}` : undefined}
    >
      {/* Icon after the label, like every other button (icon-only: the icon alone). */}
      {!iconOnly && <span className="button__label">{name}</span>}
      <MessageCircle size={size === 'sm' ? 16 : 20} aria-hidden="true" className="whatsapp-button__glyph" />
      {!iconOnly && <span className="visually-hidden"> {opens}</span>}
    </a>
  );
}

export default WhatsAppButton;
