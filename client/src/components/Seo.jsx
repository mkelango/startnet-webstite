import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang, joinTamilSuffix } from '../lib/i18n.jsx';
import { SITE_ORIGIN, brandOfPath, isFilterState, ogImageFor, OG_IMAGE_SIZE, absUrl } from '../lib/seo.js';

export { SITE_ORIGIN };

// The default description ships in index.html; read it once so pages without their own
// description (404, loading and error states) restore it instead of keeping the previous page's.
const DEFAULT_DESCRIPTION =
  (typeof document !== 'undefined' && document.head.querySelector('meta[name="description"]')?.getAttribute('content')) ||
  "StartNet is Tamil Nadu's founder-making network. Every talent, a founder.";
// Book 2 §14.1 sub-head (draft Tamil).
const DEFAULT_DESCRIPTION_TA =
  'StartNet தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு. கல்லூரிகள், ஆய்வகங்கள், பணியிடங்கள், மாவட்டங்கள் என திறமை இருக்கும் இடத்திற்கே நாங்கள் சென்று, அந்தத் திறமையை நிறுவனங்களாக மாற்ற உதவுகிறோம்.';

const ROBOTS_DEFAULT = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function setMeta(attr, key, content) {
  if (typeof document === 'undefined' || content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href, hreflang) {
  if (typeof document === 'undefined') return;
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(sel);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    el.setAttribute('data-seo', '');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const textOf = (v) => (typeof v === 'string' ? v.trim() : '');

/** "<title> · StartNet", unless the title already names StartNet (Book 2 titles often do). */
export function fullTitle(title) {
  const clean = joinTamilSuffix(textOf(title));
  if (!clean || /^startnet\.?$/i.test(clean)) return 'StartNet';
  return /startnet/i.test(clean) ? clean : `${clean} · StartNet`;
}

/**
 * Page head for search and answer engines. Renders nothing.
 * - title / description (+ titleTa / descriptionTa on /ta pages; plain t() values also work)
 * - canonical, hreflang en-IN / ta-IN / x-default, og:* and twitter:* (per-brand 1200×630 share image)
 * - robots: `noindex` prop, or automatically "noindex, follow" on filter states (?brand=, ?district= …),
 *   which canonicalise to the unfiltered listing (Book 1 Part B §7.4); `robots` overrides the whole value
 *   (e.g. "noindex, nofollow" on the SNX hand-offs)
 * - canonical: a base path (no /ta) when the page is a view of another URL (edition tabs → the edition); the
 *   canonical, og:url and hreflang alternates then point there
 * - jsonLd: one object or an array of schema.org objects, written to <head> as application/ld+json
 *   (null entries are skipped, so builders that return null for unconfirmed facts can be passed directly)
 */
export function Seo({ title, titleTa, description, descriptionTa, image, type = 'website', noindex = false, robots: robotsOverride, canonical: canonicalPath, jsonLd }) {
  const { lang, basePath } = useLang();
  const { search } = useLocation();
  const ta = lang === 'ta';
  const pickedTitle = textOf(ta && titleTa ? titleTa : title);
  const pickedDesc = textOf(ta && descriptionTa ? descriptionTa : description);
  const filtered = isFilterState(search);
  const robots = robotsOverride || (noindex || filtered ? 'noindex, follow' : ROBOTS_DEFAULT);
  const shareImage = image ? absUrl(image) : ogImageFor(brandOfPath(basePath || '/'));
  const ldList = [].concat(jsonLd || []).filter(Boolean);
  const ldKey = ldList.length ? JSON.stringify(ldList) : '';

  useEffect(() => {
    const full = fullTitle(pickedTitle);
    document.title = full;
    const desc = pickedDesc || (ta ? DEFAULT_DESCRIPTION_TA : DEFAULT_DESCRIPTION);
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', desc);
    setMeta('name', 'twitter:title', full);
    setMeta('name', 'twitter:description', desc);
  }, [pickedTitle, pickedDesc, ta]);

  useEffect(() => {
    setMeta('name', 'robots', robots);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', shareImage);
    setMeta('property', 'og:image:width', String(OG_IMAGE_SIZE.width));
    setMeta('property', 'og:image:height', String(OG_IMAGE_SIZE.height));
    setMeta('property', 'og:image:alt', fullTitle(pickedTitle));
    setMeta('name', 'twitter:image', shareImage);
  }, [robots, type, shareImage, pickedTitle]);

  useEffect(() => {
    const path = canonicalPath || basePath || '/';
    const enUrl = `${SITE_ORIGIN}${path}`;
    const taUrl = `${SITE_ORIGIN}${path === '/' ? '/ta' : `/ta${path}`}`;
    const canonical = ta ? taUrl : enUrl;
    setLink('canonical', canonical);
    setLink('alternate', enUrl, 'en-IN');
    setLink('alternate', taUrl, 'ta-IN');
    setLink('alternate', enUrl, 'x-default');
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:locale', ta ? 'ta_IN' : 'en_IN');
    setMeta('property', 'og:locale:alternate', ta ? 'en_IN' : 'ta_IN');
  }, [basePath, canonicalPath, ta]);

  // Page-level JSON-LD in <head>. Replaced as a set whenever the data changes; removed on unmount.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.head.querySelectorAll('script[data-seo-ld]').forEach((el) => el.remove());
    if (!ldKey) return undefined;
    const nodes = JSON.parse(ldKey).map((obj) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-seo-ld', '');
      el.textContent = JSON.stringify(obj).replace(/</g, '\\u003c');
      document.head.appendChild(el);
      return el;
    });
    return () => nodes.forEach((el) => el.remove());
  }, [ldKey]);

  // On unmount, put the site defaults back so the next page never inherits this page's tags.
  useEffect(
    () => () => {
      if (typeof document === 'undefined') return;
      setMeta('name', 'description', DEFAULT_DESCRIPTION);
      setMeta('property', 'og:description', DEFAULT_DESCRIPTION);
      setMeta('name', 'robots', ROBOTS_DEFAULT);
      document.head.querySelectorAll('link[data-seo]').forEach((el) => el.remove());
    },
    []
  );
  return null;
}

export default Seo;
