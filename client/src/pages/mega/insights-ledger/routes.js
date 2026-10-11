// Route manifest for the insights-ledger group (read by the integration step; nothing here is wired yet).
// Static segments ("methodology", "corrections") outrank ":period" in React Router 6, so order is not critical,
// but register methodology before the :period route for clarity and for any server-side matcher.
export const MEGA_ROUTES = [
  {
    path: 'insights/founder-ledger/methodology',
    file: './Methodology.jsx',
    brand: null,
    navLabel: 'How we count',
    phase: 1,
    menu: { section: 'Insights', replaces: '/insights/founder-ledger#method' },
    slugs: null,
    bottomCta: { label: 'Read the Founder Ledger', to: '/insights/founder-ledger' },
    notes:
      'T19 standard page with sticky TOC aside (desktop) / collapsible TOC (mobile); one Night panel (#tags). Fetches /api/ledger for outcomes evidence types and first-edition label. Anchors: #what-we-count #ladder #attribution #tags #sources #editions #revisions #questions. The live Ledger "Method" block and Stat tag popovers can link here.',
  },
  {
    path: 'insights/founder-ledger/:period',
    file: './LedgerPeriod.jsx',
    brand: null,
    navLabel: 'Ledger edition',
    phase: 1,
    menu: { section: 'Insights', replaces: '/insights/founder-ledger#archive' },
    slugs: 'api:/api/ledger',
    bottomCta: { label: 'Download CSV', href: '#downloads' },
    notes:
      'Valid :period values = lower-cased <yyyy>-q<n> of /api/ledger `period` plus optional `periods[]` (today only "2026-q4"). Unknown or malformed → NotFound content; upper-case variant (2026-Q4) → client redirect to lower-case. Older periods are fetched with /api/ledger?period=<slug> and accepted only if the response echoes that period (server currently ignores the query). Must not shadow insights/founder-ledger/corrections or /methodology (static routes win). Book 1 Part B §2.2 CTA is "Download CSV": the CSV is generated client-side from /api/ledger by the edition bar (#downloads), so bottomCta is an in-page anchor; the CTABand also offers "Subscribe" → /insights/newsletter?topic=ledger. The "Past quarters" menu link (#archive, currently unpublished) can point to the latest edition slug or stay hidden until a second period exists. Sitemap: one URL per valid period.',
  },
  {
    path: 'insights/newsletter',
    file: './Newsletter.jsx',
    brand: null,
    navLabel: 'Newsletter',
    phase: 1,
    menu: { section: 'Insights', replaces: '/insights#insights-newsletter' },
    slugs: null,
    bottomCta: { label: 'Subscribe', to: '/insights/newsletter#newsletter-signup' },
    notes:
      'Reads ?topic=ledger|vibe|connect|women|research (comma-separated) to pre-select NewsletterForm topic chips. Point the Insights mega-menu featured card CTA "Get the quarterly Ledger" (nav.js line ~293, currently /insights#insights-newsletter) to /insights/newsletter?topic=ledger. Insights.jsx keeps its in-page #insights-newsletter strip; no change needed there. Uses /api/programmes, /api/events?when=upcoming and /api/ledger for the sample-issue outline. Form posts via kit NewsletterForm → /api/forms/newsletter.',
  },
];

export default MEGA_ROUTES;
