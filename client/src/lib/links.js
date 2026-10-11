// Deep links into StartNet X (x.startnet.in) and WhatsApp click-to-chat (Book 1 Part B §2.1, §3.4).
// The origin can be set at build time (VITE_SNX_ORIGIN, e.g. for staging) so a release check can test the same value
// the build uses; the default is the production origin. Launch dependency: x.startnet.in must resolve and serve the
// app before release (every Sign in, Create your free profile, Apply and Register link goes there).
export const SNX_ORIGIN = String(import.meta.env.VITE_SNX_ORIGIN || 'https://x.startnet.in').replace(/\/+$/, '');

// The real number must be supplied by StartNet (set VITE_WHATSAPP_NUMBER at build time).
export const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER || '910000000000').replace(/[^\d]/g, '');
export const WHATSAPP_IS_PLACEHOLDER = /^910+$/.test(WHATSAPP_NUMBER);

if (WHATSAPP_IS_PLACEHOLDER && import.meta.env.DEV && typeof console !== 'undefined') {
  // Fail loudly in development while the number is still the placeholder. (A production build must set
  // VITE_WHATSAPP_NUMBER; the guard that stops a release build without it belongs in vite.config.js.)
  console.warn('[StartNet] WhatsApp number is a placeholder (wa.me/910000000000). Set VITE_WHATSAPP_NUMBER.');
}

/**
 * Build a StartNet X URL. Any query already present on `path` is merged with the params,
 * so the result always has exactly one '?' and each key appears once.
 */
export function snxLink(path = '/signup', { src = 'web', brand, lang = 'en', ...rest } = {}) {
  const u = new URL(path || '/', SNX_ORIGIN);
  const params = { src, lang, ...(brand ? { brand } : {}), ...rest };
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined) u.searchParams.set(k, String(v));
  });
  return u.toString();
}

export function waLink(text = 'Hi StartNet', ref) {
  const msg = ref ? `${text} [ref: ${ref}]` : text;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
