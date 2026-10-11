// Route manifest for the "utility-campaign" group, read by the integration step (App.jsx, nav.js, server sitemap).
// Paths are relative (no leading slash); each is mirrored under /ta by the integrator.
// Slugs are a literal (not imported from ./campaigns.js) so this manifest can be read in Node by the integrator:
// campaigns.js → lib/links.js uses import.meta.env, which only exists under Vite. Keep in sync with CAMPAIGNS.

export const MEGA_ROUTES = [
  {
    path: 'signin',
    file: './SignIn.jsx',
    brand: null,
    navLabel: 'Sign in',
    phase: 1,
    menu: { section: null, replaces: null },
    slugs: null,
    bottomCta: null,
    notes:
      'Redirects at once (window.location.replace) to x.startnet.in/login?src=web&lang=…&return=… . Passes through a safe ?return= (same origin or *.startnet.in only; else same-origin referrer; else home), ?src=, ?brand=, ?persona=, ?intent= and utm_*. Renders a fallback button + message. noindex,nofollow. Exclude from sitemap. Reserved root (Book 1 Part B §6.4). Utility bar/drawer "Sign in" may keep linking straight to SNX via signInHref(); /signin is the stable vanity URL.',
  },
  {
    path: 'signup',
    file: './SignUp.jsx',
    brand: null,
    navLabel: 'Create your free profile',
    phase: 1,
    menu: { section: null, replaces: null },
    slugs: null,
    bottomCta: null,
    notes:
      'Redirects at once to x.startnet.in/signup?src=web&lang=…&return=… with persona/intent/brand/utm_* passed through (Book 1 Part B §9.4). noindex,nofollow. Exclude from sitemap. Reserved root. The StartNet X mega-menu featured CTA ("Create your free profile") can stay a direct SNX link; /signup is the vanity URL for print/QR/social.',
  },
  {
    path: 'go/:slug',
    file: './CampaignLanding.jsx',
    brand: null,
    navLabel: 'Campaign',
    phase: 1,
    menu: { section: null, replaces: null },
    slugs: ['vibathon-2027'],
    bottomCta: null,
    notes:
      'T16 campaign landing. Render with the minimal header (C02 `minimal`: logo only, no mega menu) and no breadcrumbs. Not BrandLayout: the page sets data-brand itself from the campaign record (vibathon-2027 → vibe). noindex (meta robots set by the page; server should also send X-Robots-Tag: noindex for /go/* and keep /go/* out of the sitemap). Unknown slug renders NotFound (server should 404 slugs not in `slugs`). Bottom CTA bar: per-campaign — use campaignBottomCta(slug, lang, search) exported from ./campaigns.js, or hide the global bar; the on-page CTA is marked data-primary-cta.',
  },
];

export default MEGA_ROUTES;
