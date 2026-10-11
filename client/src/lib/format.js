import { useMemo } from 'react';
import { useLang } from './i18n.jsx';

// Book 3 §4.4 rule 5: Latin digits and Indian grouping (1,00,000) in both languages;
// Tamil pages use the Tamil month names and the units கோடி / லட்சம்.
const localeFor = (lang) => (lang === 'ta' ? 'ta-IN' : 'en-IN');

// Intl formatters are costly to construct (toLocaleDateString builds one per call), so they are cached
// per locale + options. Pages with many stats and event cards otherwise build hundreds while rendering.
const numberFormats = new Map();
const dateFormats = new Map();
const numberFormat = (lang, opts) => {
  const loc = localeFor(lang);
  const key = opts ? `${loc}|${JSON.stringify(opts)}` : loc;
  let f = numberFormats.get(key);
  if (!f) numberFormats.set(key, (f = new Intl.NumberFormat(loc, { numberingSystem: 'latn', ...opts })));
  return f;
};

/** Cached Intl.DateTimeFormat for the page language; options as for toLocaleDateString. */
export const dateFormat = (lang, opts) => {
  const loc = lang === 'ta-IN' || lang === 'en-IN' ? lang : localeFor(lang);
  const key = `${loc}|${JSON.stringify(opts || {})}`;
  let f = dateFormats.get(key);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat(loc, opts);
    } catch {
      f = new Intl.DateTimeFormat(loc);
    }
    dateFormats.set(key, f);
  }
  return f;
};

/** Number in the page language; `opts` are Intl.NumberFormat options (e.g. fixed fraction digits). */
export const formatNumber = (n, lang = 'en', opts) => (typeof n === 'number' ? numberFormat(lang, opts).format(n) : n);

// "₹6 Cr" / "₹15 L" (English), "₹6 கோடி" / "₹15 லட்சம்" (Tamil)
export const formatINR = (rupees, lang = 'en') => {
  if (typeof rupees !== 'number') return rupees;
  const ta = lang === 'ta';
  if (rupees >= 1e7) return `₹${formatNumber(+(rupees / 1e7).toFixed(1), lang)} ${ta ? 'கோடி' : 'Cr'}`;
  if (rupees >= 1e5) return `₹${formatNumber(+(rupees / 1e5).toFixed(1), lang)} ${ta ? 'லட்சம்' : 'L'}`;
  return `₹${formatNumber(rupees, lang)}`;
};

const DEFAULT_DATE = { day: 'numeric', month: 'short', year: 'numeric' };

/**
 * "12 Jan 2027" (English) or "12 ஜன., 2027" (Tamil). Backward compatible: formatDate(iso),
 * formatDate(iso, opts), and now formatDate(iso, opts, lang) or formatDate(iso, lang).
 */
export const formatDate = (iso, opts = DEFAULT_DATE, lang = 'en') => {
  if (typeof opts === 'string') {
    lang = opts;
    opts = DEFAULT_DATE;
  }
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormat(lang, { ...(opts || DEFAULT_DATE), timeZone: 'Asia/Kolkata', numberingSystem: 'latn' }).format(d);
};

export const formatDateShort = (iso, lang = 'en') => formatDate(iso, { day: 'numeric', month: 'short' }, lang);

/** The formatters bound to the current page language: const { formatDate } = useFormat(). */
export function useFormat() {
  const { lang } = useLang();
  return useMemo(
    () => ({
      lang,
      formatNumber: (n) => formatNumber(n, lang),
      formatINR: (r) => formatINR(r, lang),
      formatDate: (iso, opts) => formatDate(iso, opts || DEFAULT_DATE, lang),
      formatDateShort: (iso) => formatDateShort(iso, lang),
    }),
    [lang]
  );
}
