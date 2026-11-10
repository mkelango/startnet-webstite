// Deep links into StartNet X and WhatsApp click-to-chat (Book 1 Part B §2.1, §3.4).
// The origin can be set at build time (VITE_SNX_ORIGIN, e.g. for staging or once x.startnet.in resolves) so a release
// check can test the same value the build uses. x.startnet.in does not resolve yet (Nov 2026), so the default is the
// live StartNet X app, the same place the header "Sign in" goes.
export const SNX_ORIGIN = String(import.meta.env.VITE_SNX_ORIGIN || 'https://startnet-platform.vercel.app').replace(/\/+$/, '');

// Pages the StartNet X app serves today (its router, 10 Nov 2026). Every other deep link the site uses (/signup,
// /login, event registration, programme applications, circles, learning) opens its sign-in, which creates the free
// profile; the query still carries src, brand, lang and the rest. Add a path here once the app serves it.
const SNX_LIVE_PATHS = new Set(['/', '/sign-in', '/onboarding']);

// Where the header "Sign in" (utility bar, mobile drawer, mega menu) and the /signin vanity route go (18 Oct 2026).
// VITE_SIGNIN_URL at build time overrides it.
export const SIGNIN_URL = String(import.meta.env.VITE_SIGNIN_URL || 'https://startnet-platform.vercel.app/');

// StartNet's WhatsApp number (+91 98848 98206, set 14 Oct 2026). VITE_WHATSAPP_NUMBER at build time overrides it
// (country code first, digits only, e.g. 919884898206).
export const WHATSAPP_DEFAULT = '919884898206';
export const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER || WHATSAPP_DEFAULT).replace(/[^\d]/g, '');
export const WHATSAPP_IS_PLACEHOLDER = /^910+$/.test(WHATSAPP_NUMBER);

if (WHATSAPP_IS_PLACEHOLDER && import.meta.env.DEV && typeof console !== 'undefined') {
  // Fail loudly in development if VITE_WHATSAPP_NUMBER sets the old placeholder (vite.config.js stops a release build).
  console.warn('[StartNet] WhatsApp number is a placeholder (wa.me/910000000000). Fix VITE_WHATSAPP_NUMBER.');
}

/**
 * Build a StartNet X URL. Any query already present on `path` is merged with the params,
 * so the result always has exactly one '?' and each key appears once.
 */
export function snxLink(path = '/signup', { src = 'web', brand, lang = 'en', ...rest } = {}) {
  const u = new URL(path || '/', SNX_ORIGIN);
  // Only when the origin is the live app: a custom VITE_SNX_ORIGIN (x.startnet.in, staging) keeps the full deep path.
  if (!import.meta.env.VITE_SNX_ORIGIN && !SNX_LIVE_PATHS.has(u.pathname)) u.pathname = '/sign-in';
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
