// Route manifest for the "about-districts" mega-menu group. Read by the integration step
// (App.jsx routes, nav.js wiring, server SPA/sitemap/404 lists). Paths are relative, no leading slash.
import { DISTRICT_SLUGS } from './districtsData.js';

export const MEGA_ROUTES = [
  {
    path: 'about/self-diagnosis',
    file: './SelfDiagnosis.jsx',
    brand: null,
    navLabel: 'Self-diagnosis report',
    phase: 3,
    menu: { section: 'Who we are', replaces: null },
    slugs: null,
    bottomCta: { label: 'Download', to: '/about/self-diagnosis#sd-download' },
    notes:
      'T07. nav.js already lists /about/self-diagnosis (phase 3, unpublished: true): drop the unpublished flag. ' +
      'Uses /api/reports/self-diagnosis-2027, /api/metrics?key=…, /api/reports. Download is a light-gate interest form (type "interest", programme=self-diagnosis-2027) until report.formats is populated.',
  },
  {
    path: 'districts/:district',
    file: './DistrictPage.jsx',
    brand: null,
    navLabel: 'District',
    phase: 3,
    menu: { section: 'Who we are', replaces: null },
    slugs: DISTRICT_SLUGS,
    bottomCta: { label: 'See events here', to: '/events?district=:district' },
    notes:
      'T20 ×38. nav.js already lists /districts/chennai, /coimbatore, /madurai, /tiruchirappalli (phase 3, unpublished: true): drop the flag. ' +
      'Register after the static "districts" route. Unknown slug renders NotFound; alias spellings (trichy, tuticorin, kanyakumari, ooty, the-nilgiris, villupuram, …; see DISTRICT_ALIASES in districtsData.js) redirect client-side, as do mixed-case slugs (/districts/Chennai → /districts/chennai) — the server should 301 them or let them through to the SPA rather than 404 (match slugs case-insensitively). ' +
      'bottomCta: substitute the district English name (or the slug; the events API slug-matches) for :district.',
  },
];

export default MEGA_ROUTES;
