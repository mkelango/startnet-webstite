// Bottom CTA bar (C05) choices for the mega-menu pages (client/src/pages/mega/*/routes.js `bottomCta`).
// Used by BottomCtaBar after the page's own CTA (usePageCta) and before the section/brand CTA, so these pages get
// the CTA Book 1 Part B §2.2 lists for them. Pages whose CTA equals their brand CTA, or that publish their own
// (event series/edition pages, campaign landings), are not listed. Same-page anchors keep the path, so the
// bar's "never link to the page you are on" rule lets them through. Tamil CTAs match the pages' own labels.

import { findDistrict } from '../pages/mega/about-districts/districtsData.js';

const SNX_DEMO = (type, audience) =>
  `/partner/enquire?topic=snx&type=${type}&audience=${audience}&brand=x&ref=snx-${audience}`;

const BOOK_DEMO = { label: 'Book a demo', labelTa: 'டெமோவுக்கு முன்பதிவு செய்யுங்கள்', shortLabel: 'Book a demo', shortLabelTa: 'டெமோ' };
const REQUEST_DEMO = { label: 'Request a demo', labelTa: 'டெமோ கோருங்கள்', shortLabel: 'Request a demo', shortLabelTa: 'டெமோ' };
const REGISTER_INTEREST = { label: 'Register interest', labelTa: 'ஆர்வத்தைப் பதிவு செய்யுங்கள்', shortLabelTa: 'ஆர்வம் பதிவு' };
const NOTIFY = { label: 'Notify me', labelTa: 'எனக்கு அறிவியுங்கள்' };

/** Exact paths (language-stripped). */
const EXACT = {
  '/startnet-x/institutions': { ...BOOK_DEMO, to: SNX_DEMO('institution', 'institutions') },
  '/startnet-x/incubators': { ...REQUEST_DEMO, to: SNX_DEMO('incubator', 'incubators') },
  '/startnet-x/gccs': { ...BOOK_DEMO, to: SNX_DEMO('gcc', 'gccs') },
  '/startnet-x/government': {
    label: 'Request a briefing', labelTa: 'விளக்கக் கூட்டம் கோருங்கள்', shortLabel: 'Request a briefing', shortLabelTa: 'விளக்கம் கோருங்கள்',
    to: SNX_DEMO('government', 'government'),
  },
  '/startnet-x/investors': { ...REQUEST_DEMO, to: SNX_DEMO('investor', 'investors') },
  '/startnet-x/agents': { label: 'Read guardrails', labelTa: 'பாதுகாப்பு வரம்புகளைப் படியுங்கள்', shortLabelTa: 'பாதுகாப்பு வரம்புகள்', to: '/startnet-x/agents#guardrails' },
  '/startnet-x/developers': { label: 'Get an API key', labelTa: 'API key பெறுங்கள்', to: '/startnet-x/developers#api-key' },
  '/insights/founder-ledger/methodology': { label: 'Read the Founder Ledger', labelTa: 'Founder Ledger-ஐப் படியுங்கள்', shortLabel: 'Founder Ledger', shortLabelTa: 'Founder Ledger', to: '/insights/founder-ledger' },
  '/insights/newsletter': { label: 'Subscribe', labelTa: 'செய்திமடலைப் பெறுங்கள்', to: '/insights/newsletter#newsletter-signup' },
  '/insights/indices': { ...NOTIFY, to: '/insights/indices#indices-notify' },
  '/insights/podcast': { label: 'Tell me when it launches', labelTa: 'தொடங்கியதும் தெரிவியுங்கள்', shortLabel: 'Notify me', shortLabelTa: 'அறிவியுங்கள்', to: '/insights/podcast#podcast-notify' },
  '/events/host': { label: 'Enquire about hosting', labelTa: 'நடத்துவது குறித்து விசாரிக்க', shortLabel: 'Enquire', shortLabelTa: 'விசாரிக்க', to: '/events/host#host-form' },
  '/events/founders-day': { ...REGISTER_INTEREST, to: '/events/founders-day#fday-interest' },
  '/women/summit/awards': { label: 'Nominate a founder', labelTa: 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்', shortLabel: 'Nominate', shortLabelTa: 'பரிந்துரையுங்கள்', to: '/women/summit/awards#nominate', brand: 'women' },
  '/about/self-diagnosis': { label: 'Download', labelTa: 'பதிவிறக்குங்கள்', icon: 'download', to: '/about/self-diagnosis#sd-download' },
  '/media/kit': { label: 'Downloads', labelTa: 'பதிவிறக்கங்கள்', icon: 'download', to: '/media/kit#mkit-downloads' },
};

/** One-parameter pages: [prefix, build(path, param)]. */
const PARAM = [
  ['/insights/founder-ledger/', (p) => ({ label: 'Download CSV', labelTa: 'CSV பதிவிறக்கம்', icon: 'download', to: `${p}#downloads` })],
  ['/insights/indices/', (p) => ({ ...NOTIFY, to: `${p}#index-notify` })],
  ['/insights/reports/', (p) => ({ label: "Get the report when it's out", labelTa: 'அறிக்கை வெளியானதும் பெறுங்கள்', shortLabel: 'Get the report', shortLabelTa: 'அறிக்கையைப் பெறுங்கள்', to: `${p}#report-download` })],
  ['/research/labs/', (p) => ({ ...REGISTER_INTEREST, to: `${p}#register-interest`, brand: 'research' })],
  // The Events filter uses the official English district name (/events?district=The%20Nilgiris), not the slug.
  ['/districts/', (p, slug) => ({ label: 'See events here', labelTa: 'இங்குள்ள நிகழ்வுகளைப் பாருங்கள்', shortLabel: 'Events here', shortLabelTa: 'இங்குள்ள நிகழ்வுகள்', to: `/events?district=${encodeURIComponent(findDistrict(slug)?.en || slug)}` })],
  ['/media/releases/', () => ({ label: 'Download assets', labelTa: 'கோப்புகளைப் பதிவிறக்கவும்', icon: 'download', to: '/media/kit' })],
];

/** The mega-page CTA for a language-stripped path, or null. */
export function megaCtaFor(basePath = '') {
  if (Object.prototype.hasOwnProperty.call(EXACT, basePath)) return EXACT[basePath];
  for (const [prefix, build] of PARAM) {
    if (!basePath.startsWith(prefix)) continue;
    const rest = basePath.slice(prefix.length);
    // Exactly one more segment (static siblings such as /insights/founder-ledger/corrections keep their own CTA).
    if (!rest || rest.includes('/')) continue;
    if (prefix === '/insights/founder-ledger/' && !/^\d{4}-q[1-4]$/i.test(rest)) continue;
    return build(basePath, rest);
  }
  return null;
}
