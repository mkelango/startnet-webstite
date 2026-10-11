// Mega-menu build manifest for the media-careers group. Read by the integration step (App.jsx routes,
// nav.js wiring, server status/sitemap). Paths are relative, without a leading slash.
export const MEGA_ROUTES = [
  {
    path: 'media/kit',
    file: './MediaKit.jsx',
    brand: null,
    navLabel: 'Media kit',
    navLabelTa: 'ஊடகத் தொகுப்பு',
    phase: 1,
    menu: { section: null, replaces: null },
    slugs: null,
    bottomCta: { label: 'Downloads', to: '/media/kit#mkit-downloads' },
    notes:
      'T19 standard page (Book 1 Part B §2.2). Not in the mega menu and no nav.js entry points at it today (nav.js only has /media in the utility bar and footer), so nothing is replaced. Add it to the footer "Media" column; the /media page "Brand assets" section (#media-kit) should add a "Full media kit" link. Static route: register before any media/:x param route.',
  },
  {
    path: 'media/releases/:slug',
    file: './PressRelease.jsx',
    brand: null,
    navLabel: 'Press release',
    navLabelTa: 'செய்திக் குறிப்பு',
    phase: 1,
    menu: { section: null, replaces: null },
    slugs: 'api:/api/press?kind=release',
    bottomCta: { label: 'Download assets', to: '/media/kit' },
    notes:
      'T09 article. Data GET /api/press; only kind "release" items resolve, coverage items and unknown slugs render NotFound. press.json is currently [] so every slug 404s until releases are added. /media list should link internal releases to /media/releases/<slug> (set PressItem.url to that path, or link by slug when kind === "release").',
  },
  {
    path: 'careers/:slug',
    file: './JobDetail.jsx',
    brand: null,
    navLabel: 'Job',
    navLabelTa: 'பணி வாய்ப்பு',
    phase: 1,
    menu: { section: null, replaces: null },
    slugs: 'api:/api/careers',
    bottomCta: { label: 'Apply now', href: 'mailto:careers@startnet.in' },
    notes:
      'T09 article with sticky KeyFacts aside. Data GET /api/careers; unknown slug renders NotFound. careers.json is currently [] so every slug 404s until roles are added. /careers role rows should link the title to /careers/<slug>. Apply uses Role.applyUrl (http) else mailto careers@startnet.in.',
  },
];

export default MEGA_ROUTES;
