// Shared helpers for the insights-reports group (report detail, indices, podcast).
// Data: GET /api/reports (server/data/reports.json). Copy: Book 2 §6.1, §6.3; Book 1 Part B §2.2, §6.2 (T07), §8 (Report).

import { statusTa } from '../../insights/ledgerUtils.js';

/** Route slug (/insights/indices/:index) → report slug in /api/reports. */
export const INDEX_ROUTES = {
  'campus-innovation-index': 'campus-innovation-index',
  'research-commercialisation-index': 'tn-research-commercialisation-index',
  'founder-readiness-index': 'founder-readiness-index',
};

export const INDEX_SLUGS = Object.keys(INDEX_ROUTES);

/**
 * A short API label (status, schedule) in the page language: the record's Tamil field when supplied, else a Tamil
 * rendering of the known English shapes (statusTa), else the English. `isEn` says when the English is shown on /ta
 * so the caller can mark it lang="en". Tamil case suffixes keep a non-breaking hyphen ("2027‑இல்").
 */
export function localLabel(text, textTa, lang) {
  const en = text == null ? '' : String(text);
  if (lang !== 'ta') return { text: en, isEn: false };
  const ta = textTa || statusTa(en);
  if (!ta) return { text: en, isEn: !!en };
  return { text: String(ta).replace(/([A-Za-z0-9])-(?=[஀-௿])/g, '$1‑'), isEn: false };
}

/** Report slug from the API → index route slug (or null when it is not one of the three indices). */
export function indexRouteFor(reportSlug) {
  const hit = Object.entries(INDEX_ROUTES).find(([, s]) => s === reportSlug);
  return hit ? hit[0] : null;
}

/** Canonical page for any report record: the Ledger, an index page or the report detail page. */
export function reportPath(r) {
  if (!r) return '/insights/reports';
  if (r.kind === 'ledger') return '/insights/founder-ledger';
  if (r.kind === 'index') {
    const idx = indexRouteFor(r.slug);
    if (idx) return `/insights/indices/${idx}`;
  }
  // A report with its own page outside the reports hub (self-diagnosis-2027 → /about/self-diagnosis).
  const url = typeof r.url === 'string' ? r.url : '';
  if (r.kind === 'report' && url.startsWith('/') && !url.includes('#') && !url.startsWith('/insights/reports')) return url;
  return `/insights/reports/${r.slug}`;
}

/** Strip inline "[placeholder …]" / "[… TBC]" notes from API labels; returns { text, note }. */
export function splitPlaceholder(label) {
  const s = String(label || '');
  const m = s.match(/\[[^\]]+\]/);
  if (!m) return { text: s.trim(), note: null };
  return { text: s.replace(m[0], '').replace(/\s{2,}/g, ' ').trim(), note: m[0] };
}

export const LANG_NAMES = {
  en: ['English', 'ஆங்கிலம்'],
  ta: ['Tamil', 'தமிழ்'],
};

export const KIND_NAMES = {
  ledger: ['Founder Ledger', 'Founder Ledger'],
  report: ['Report', 'அறிக்கை'],
  index: ['Index', 'குறியீடு'],
};

/** Tag legend, as worded in the Founder Ledger method (Book 2 §6.2). */
export const TAG_RULES = [
  { tag: 'A', en: 'Verified against a primary source.', ta: 'முதன்மை ஆதாரத்துடன் சரிபார்க்கப்பட்டது.' },
  { tag: 'B', en: 'Reported by the founder or organisation.', ta: 'நிறுவனர் அல்லது அமைப்பு தெரிவித்தது.' },
  { tag: 'C', en: 'Estimate.', ta: 'மதிப்பீடு.' },
];

export const PLACEHOLDER = '[placeholder — to be supplied by StartNet]';
