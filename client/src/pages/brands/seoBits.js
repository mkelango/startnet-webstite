// Page-level SEO helpers for Home, Who we are and the brand pages (SEO/AEO pass, Oct 2026).
// Candidates for lib/seo.js; kept here because lib/ is owned by the lead engineer.
import { faqLd, isPlaceholder, langPath, webPageLd } from '../../lib/seo.js';

/**
 * True when text is not a publishable fact: empty, a placeholder, or carrying any bracketed mark
 * ("[placeholder — …]", "[C]", "[confirm]", "[தேதி அறிவிக்கப்பட உள்ளது]" …). lib/seo.js isPlaceholder()
 * misses "[confirm]", "[C]" and spaced Tamil marks, so FAQ answers are checked with this stricter rule.
 */
export const hasMarks = (s) => isPlaceholder(s) || /\[[^\]]*\]/.test(s);

/**
 * FAQPage JSON-LD from [{ question, answer }], keeping only plain-string Q&A with no placeholder or
 * confidence marks: an answer that is still "[placeholder]" or an indicative "[C]" figure is shown on the
 * page with its chip but never handed to answer engines as a fact. Returns null when nothing is left.
 */
export function cleanFaqLd(items) {
  const list = (items || []).filter(
    (it) => it && typeof it.question === 'string' && typeof it.answer === 'string' && !hasMarks(it.question) && !hasMarks(it.answer)
  );
  return list.length ? faqLd(list) : null;
}

/** webPageLd for the page's own localised URL (matches the canonical, which is /ta/… on Tamil pages). */
export const pageLd = ({ path, lang, ...rest }) => webPageLd({ path: langPath(path, lang), lang, ...rest });
