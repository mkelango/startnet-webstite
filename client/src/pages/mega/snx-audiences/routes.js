// Route manifest for the StartNet X "Built for" audience pages (mega menu ⑥ StartNet X › Built for).
// Paths are relative to the site root (no leading slash). All render inside BrandLayout brand="x",
// i.e. as children of the existing <Route path="startnet-x" element={<BrandLayout brand="x" />}> block.

const demo = (type, audience) => `/partner/enquire?topic=snx&type=${type}&audience=${audience}&brand=x&ref=snx-${audience}`;

export const MEGA_ROUTES = [
  {
    path: 'startnet-x/founders',
    file: './Founders.jsx',
    brand: 'x',
    navLabel: 'For founders',
    phase: 1,
    menu: { section: 'StartNet X', replaces: '/startnet-x' /* "Founders & learners (free)" currently points at the overview */ },
    slugs: null,
    bottomCta: { label: 'Create your free profile', snx: '/signup', href: 'https://x.startnet.in/signup?src=snx-founders&lang=en&brand=x' },
    notes: 'Primary CTA snxLink("/signup", { src: "snx-founders", brand: "x", lang }). Only replace the "Founders & learners (free)" link in the Built for column, not "What SNX is".',
  },
  {
    path: 'startnet-x/institutions',
    file: './Institutions.jsx',
    brand: 'x',
    navLabel: 'For institutions',
    phase: 2,
    menu: { section: 'StartNet X', replaces: '/partner/institutions' },
    slugs: null,
    bottomCta: { label: 'Book a demo', to: demo('institution', 'institutions') },
    notes: 'Book 2 §7.2 button is "Book a demo". Replace only the StartNet X › Built for link; /partner/institutions stays in the Partner with us menu.',
  },
  {
    path: 'startnet-x/incubators',
    file: './Incubators.jsx',
    brand: 'x',
    navLabel: 'For incubators',
    phase: 2,
    menu: { section: 'StartNet X', replaces: '/partner/incubators' },
    slugs: null,
    bottomCta: { label: 'Request a demo', to: demo('incubator', 'incubators') },
    notes: 'Replace only the StartNet X › Built for link; /partner/incubators stays in the Partner with us menu.',
  },
  {
    path: 'startnet-x/gccs',
    file: './Gccs.jsx',
    brand: 'x',
    navLabel: 'For GCCs',
    phase: 2,
    menu: { section: 'StartNet X', replaces: '/partner/gccs' },
    slugs: null,
    bottomCta: { label: 'Book a demo', to: demo('gcc', 'gccs') },
    notes: 'Book 2 §7.2 button is "Book a demo". Replace only the StartNet X › Built for link; /partner/gccs stays in the Partner with us menu.',
  },
  {
    path: 'startnet-x/government',
    file: './Government.jsx',
    brand: 'x',
    navLabel: 'For government',
    phase: 2,
    menu: { section: 'StartNet X', replaces: '/partner/government' },
    slugs: null,
    bottomCta: { label: 'Request a briefing', to: demo('government', 'government') },
    notes: 'Book 2 §7.2 button for government is "Request a briefing". Replace only the StartNet X › Built for link.',
  },
  {
    path: 'startnet-x/investors',
    file: './Investors.jsx',
    brand: 'x',
    navLabel: 'For investors',
    phase: 2,
    menu: { section: 'StartNet X', replaces: '/partner/investors' },
    slugs: null,
    bottomCta: { label: 'Request a demo', to: demo('investor', 'investors') },
    notes: 'No investment material on the site (Book 1 Part A §3.2); page frames the investor tier as a software licence. Replace only the StartNet X › Built for link.',
  },
];

export default MEGA_ROUTES;
