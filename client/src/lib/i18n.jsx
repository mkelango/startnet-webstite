import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// English at root, Tamil mirrored under /ta/ with the same slugs (Book 1 Part B §3.5, §7).

/**
 * Keep a Latin name and its Tamil case suffix together: "StartNet-இல்", "WhatsApp-இல்",
 * "Founder Ledger-ஐ". The hyphen becomes U+2011 (non-breaking hyphen) and the space inside
 * "StartNet X" becomes a no-break space, so the suffix is never stranded on the next line.
 */
export function joinTamilSuffix(s) {
  if (typeof s !== 'string' || !/-[\u0B80-\u0BFF]/.test(s)) return s;
  return s
    .replace(/StartNet X(?=-[\u0B80-\u0BFF])/g, 'StartNet\u00A0X')
    .replace(/([A-Za-z0-9.])-(?=[\u0B80-\u0BFF])/g, '$1\u2011');
}

/** t('English', 'தமிழ்') for a given language (usable outside React). */
export const tFor = (lang) => (en, ta) => (lang === 'ta' && ta ? joinTamilSuffix(ta) : en);

/**
 * Pick the Tamil variant of a data field when it exists: pickLang(event, 'title', 'ta') returns
 * event.titleTa || event.title. Works for titleTa, summaryTa, dateLabelTa, cityTa, placeTa,
 * labelTa, roleTa and any other `<field>Ta`.
 */
export function pickLang(obj, field, lang) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (lang === 'ta') {
    const ta = obj[`${field}Ta`];
    if (ta != null && ta !== '') return typeof ta === 'string' ? joinTamilSuffix(ta) : ta;
  }
  return obj[field];
}

const LangContext = createContext({ lang: 'en', t: (en) => en, localePath: (p) => p, switchPath: '/', pick: (o, f) => (o ? o[f] : undefined) });

export function LangProvider({ children }) {
  const { pathname } = useLocation();
  const lang = pathname === '/ta' || pathname.startsWith('/ta/') ? 'ta' : 'en';
  useEffect(() => {
    document.documentElement.lang = lang;
    try { document.cookie = `lang=${lang}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`; } catch {}
  }, [lang]);
  const value = useMemo(() => {
    const basePath = lang === 'ta' ? pathname.replace(/^\/ta(?=\/|$)/, '') || '/' : pathname;
    return {
      lang,
      /** t('English', 'தமிழ்') — falls back to English when no Tamil string is supplied */
      t: tFor(lang),
      /** pick(obj, 'title') → obj.titleTa on /ta pages when present, else obj.title */
      pick: (obj, field) => pickLang(obj, field, lang),
      /** Prefix an internal path for the current language */
      localePath: (p) => (lang === 'ta' && p.startsWith('/') ? (p === '/' ? '/ta' : `/ta${p}`) : p),
      /** Same page in the other language */
      switchPath: lang === 'ta' ? basePath : basePath === '/' ? '/ta' : `/ta${basePath}`,
      basePath,
    };
  }, [lang, pathname]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** True when the string contains Tamil script (U+0B80–U+0BFF). */
export const hasTamil = (s) => typeof s === 'string' && /[\u0B80-\u0BFF]/.test(s);

/**
 * The `lang` attribute an element should carry (WCAG 3.1.2). An explicit value wins (omitted when it
 * equals the page language); otherwise, on /ta pages, a plain string with Latin text and no Tamil
 * script is marked "en". Returns undefined when the element can inherit the page language.
 */
export function contentLangFor(pageLang, node, explicit) {
  if (explicit) return explicit === pageLang ? undefined : explicit;
  if (pageLang !== 'ta') return undefined;
  if (typeof node === 'string' && /[A-Za-z]/.test(node) && !hasTamil(node)) return 'en';
  return undefined;
}

/**
 * Inline bilingual text as a node. On /ta pages with no Tamil string supplied, the English
 * fallback is wrapped in <span lang="en"> so screen readers switch voice. Keep using t() for attributes.
 */
export function T({ en, ta }) {
  const { lang } = useLang();
  if (lang === 'ta') return ta ? joinTamilSuffix(ta) : <span lang="en">{en}</span>;
  return en ?? null;
}
