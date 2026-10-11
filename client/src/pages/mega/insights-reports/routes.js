// Route manifest for the insights-reports group. Read by the integration step (App.jsx routes, nav.js, server sitemap/status).
// Paths are relative to the site root (no leading slash); the /ta mirror uses the same paths.

export const MEGA_ROUTES = [
  {
    path: 'insights/indices',
    file: './Indices.jsx',
    brand: null,
    navLabel: 'Indices',
    phase: 3,
    menu: { section: 'Insights', replaces: null },
    slugs: null,
    bottomCta: { label: 'Notify me', to: '/insights/indices#indices-notify' },
    notes:
      'Static path: register before insights/indices/:index. Add as a link in the Insights mega menu "Reports & indices" column (next to "Reports library").',
  },
  {
    path: 'insights/indices/:index',
    file: './IndexDetail.jsx',
    brand: null,
    navLabel: 'Index',
    phase: 3,
    menu: { section: 'Insights', replaces: '/insights/reports#campus-innovation-index' },
    slugs: ['campus-innovation-index', 'research-commercialisation-index', 'founder-readiness-index'],
    bottomCta: { label: 'Notify me', to: '#index-notify' },
    notes:
      'research-commercialisation-index maps to report slug tn-research-commercialisation-index in /api/reports. ' +
      'The dynamic "Reports & indices" menu column and reports.json urls (/insights/reports#<index-slug>) should point to /insights/indices/<index> ' +
      '(campus-innovation-index, research-commercialisation-index, founder-readiness-index). Unknown :index renders NotFound. ' +
      'The same replacement applies to /insights/reports#tn-research-commercialisation-index → /insights/indices/research-commercialisation-index and ' +
      '/insights/reports#founder-readiness-index → /insights/indices/founder-readiness-index. bottomCta is a same-page hash (#index-notify).',
  },
  {
    path: 'insights/reports/:slug',
    file: './ReportDetail.jsx',
    brand: null,
    navLabel: 'Report',
    phase: 2,
    menu: { section: 'Insights', replaces: '/insights/reports#tn-founder-report-2027' },
    slugs: 'api:/api/reports',
    bottomCta: { label: "Get the report when it's out", to: '#report-download' },
    notes:
      'Slugs come from GET /api/reports; unknown slug renders NotFound. kind "ledger" (founder-ledger) and the three index slugs redirect ' +
      '(<Navigate replace>) to /insights/founder-ledger and /insights/indices/<index>, so the server should 301 those too. ' +
      'reports.json "url" fields for kind "report" (/insights/reports#<slug>) should become /insights/reports/<slug> so ReportCard links land here. ' +
      'Register after insights/reports (static) — no conflict, different depth. ' +
      'Note: self-diagnosis-2027 now has url /about/self-diagnosis (its one canonical page); the server and ReportDetail 301 ' +
      '/insights/reports/self-diagnosis-2027 there. bottomCta is a same-page hash (#report-download).',
  },
  {
    path: 'insights/podcast',
    file: './Podcast.jsx',
    brand: null,
    navLabel: 'Podcast (Tamil & English)',
    phase: 3,
    menu: { section: 'Insights', replaces: '/insights/podcast' },
    slugs: null,
    bottomCta: { label: 'Tell me when it launches', to: '/insights/podcast#podcast-notify' },
    notes:
      'nav.js already lists /insights/podcast with unpublished: true — drop the unpublished flag once routed. ' +
      'Episodes read GET /api/stories?type=podcast (Story type "podcast", Book 1 Part B §8); empty today. Episode detail pages (T09) not built: StoryCard links to /insights/stories/<slug>.',
  },
];

export default MEGA_ROUTES;
