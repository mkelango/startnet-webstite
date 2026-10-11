// Route manifest for the "brand-sub" mega-menu group. Read by the integration step (App.jsx, nav.js, brands.js,
// server sitemap/status). Paths are relative, without a leading slash; the integration step mounts them under both
// "/" and "/ta". Every entry with a `brand` renders inside <BrandLayout brand={brand}> (child route of that brand).

const STORIES_NOTE =
  'T15 brand filtered view of /insights/stories (Book 1 Part B §2.2, §7.4: canonicalises to itself; story pages stay canonical at /insights/stories/<slug>). Brand is read from the path, or pass <BrandStories brand="…" />. Fetches /api/stories?brand=<brand>; placeholder seed records (placeholder: true) are never listed.';
const EVENTS_NOTE =
  'T15 brand filtered view of /events (Book 1 Part B §2.2, §7.4: canonicalises to itself; event pages stay canonical at /events/<slug>). Brand is read from the path, or pass <BrandEvents brand="…" />. Fetches /api/events?brand=<brand>; Upcoming/Past toggle is ?when=past; facets ?format= ?lang= ?price= ?district=.';
const STATIC_ROUTE_NOTE = 'Register as a static child of the brand layout so it wins over the brand ":slug" catch-all (React Router ranks static segments first).';

export const MEGA_ROUTES = [
  {
    path: 'research/labs/:lab',
    file: './ResearchLab.jsx',
    brand: 'research',
    navLabel: 'Lab',
    phase: 2,
    menu: { section: 'Our brands', replaces: null },
    slugs: ['agentic-ai', 'ontology-knowledge', 'physical-ai', 'drug-discovery'],
    bottomCta: { label: 'Register interest', href: '#register-interest' },
    notes:
      'T03 Lab detail (T18 variant). Book 2 §3.1.1 copy. Unknown :lab renders NotFound. Register as child "labs/:lab" of the research BrandLayout. ' +
      'Labs hub (/research/labs, owned by ResearchSub) should link each Wave 1 card title to /research/labs/<slug> instead of the #<slug> anchor; ' +
      'nav.js "StartNet Labs" stays on /research/labs. Breadcrumb: Home › StartNet Research › StartNet Labs › <Lab>.',
  },

  { path: 'research/stories', file: './BrandStories.jsx', brand: 'research', navLabel: 'Stories', phase: 2, menu: { section: null, replaces: null }, slugs: null, bottomCta: { label: 'Apply to the Fellowship', to: '/research/fellowship' }, notes: `${STORIES_NOTE} ${STATIC_ROUTE_NOTE} Currently caught by ResearchSub ":slug" (renders NotFound).` },
  { path: 'vibe/stories', file: './BrandStories.jsx', brand: 'vibe', navLabel: 'Stories', phase: 2, menu: { section: null, replaces: null }, slugs: null, bottomCta: { label: 'Register for Vibathon 2027', to: '/vibe/vibathon' }, notes: `${STORIES_NOTE} ${STATIC_ROUTE_NOTE} Currently caught by VibeSub ":slug".` },
  { path: 'connect/stories', file: './BrandStories.jsx', brand: 'connect', navLabel: 'Stories', phase: 2, menu: { section: null, replaces: null }, slugs: null, bottomCta: { label: 'Find your sector Connect', to: '/connect/series' }, notes: `${STORIES_NOTE} ${STATIC_ROUTE_NOTE} Replaces redirect: ConnectSub REDIRECTS.stories currently sends /connect/stories to /insights/stories?brand=connect; remove that entry once this route is registered.` },
  { path: 'women/stories', file: './BrandStories.jsx', brand: 'women', navLabel: 'Stories', phase: 2, menu: { section: null, replaces: '/insights/stories?brand=women' }, slugs: null, bottomCta: { label: 'Join a Women Circle', to: '/women/circles' }, notes: `${STORIES_NOTE} ${STATIC_ROUTE_NOTE} The replaced target is in brands.js BRANDS.women.subNav ("Stories"), not nav.js; WomenSub summit/home "All Women stories" links may also point here.` },

  { path: 'research/events', file: './BrandEvents.jsx', brand: 'research', navLabel: 'Events', phase: 2, menu: { section: 'Events', replaces: '/events?brand=research' }, slugs: null, bottomCta: null, notes: `${EVENTS_NOTE} ${STATIC_ROUTE_NOTE} Replaces the Events mega-menu "Series › Research Days" target (/events?brand=research).` },
  { path: 'vibe/events', file: './BrandEvents.jsx', brand: 'vibe', navLabel: 'Events', phase: 2, menu: { section: null, replaces: null }, slugs: null, bottomCta: null, notes: `${EVENTS_NOTE} ${STATIC_ROUTE_NOTE}` },
  { path: 'connect/events', file: './BrandEvents.jsx', brand: 'connect', navLabel: 'Events', phase: 2, menu: { section: null, replaces: '/events?brand=connect' }, slugs: null, bottomCta: null, notes: `${EVENTS_NOTE} ${STATIC_ROUTE_NOTE} Replaces redirect: ConnectSub REDIRECTS.events currently sends /connect/events to /events?brand=connect; remove that entry. The replaced target is brands.js BRANDS.connect.subNav ("Events") — point it to /connect/events.` },
  { path: 'women/events', file: './BrandEvents.jsx', brand: 'women', navLabel: 'Events', phase: 2, menu: { section: null, replaces: null }, slugs: null, bottomCta: null, notes: `${EVENTS_NOTE} ${STATIC_ROUTE_NOTE}` },

  {
    path: 'women/summit/awards',
    file: './WomenAwards.jsx',
    brand: 'women',
    navLabel: 'Awards',
    phase: 2,
    menu: { section: 'Our brands', replaces: null },
    slugs: null,
    bottomCta: { label: 'Nominate a founder', href: '#nominate' },
    notes:
      'T04 Women Founders Summit & Awards (awards view). Register as child "summit/awards" of the women BrandLayout (two static segments; does not clash with WomenSub ":slug"). ' +
      'Book 1 §4: women sub-nav CTA "Nominate for the Awards" can point here; WomenSub summit "Nominate a founder" (/women/summit#nominate) may link here. ' +
      'Optionally add "Women Founders Awards" under Events › Flagships after "Women Founders Summit & Awards". Form: SmartForm type "nomination" (fields name, email, phone, nomineeName, nomineeCompany, category, district, message, nomineeAware). ' +
      'Breadcrumb: Home › StartNet Women › Summit & Awards › Awards.',
  },
];

export default MEGA_ROUTES;
