/* ============================================================================
   StartNet — CONTENT SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Governance note (Content doc §9): the `line` field on each property is the
   ONE canonical description. It is rendered verbatim in the Portfolio nav
   dropdown, the homepage grid, the footer directory and the Portfolio page.
   It is never re-worded per context. Change it here, it changes everywhere.
   ========================================================================== */

export const site = {
  name: 'StartNet',
  domain: 'startnet.in',
  origin: 'https://startnet.in',
  legalName: 'StartNet',
  tagline: 'The infrastructure behind Tamil Nadu’s next 100,000 founders.',
  narrative:
    'StartNet builds the training, the acceleration, and the two annual gatherings that turn Tamil Nadu’s AI ambition into a working ecosystem.',
  year: 2026,
  email: {
    general: 'hello@startnet.in',
    press: 'press@startnet.in',
    partners: 'partners@startnet.in',
    careers: 'careers@startnet.in',
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/startnet-in' },
    { label: 'X', href: 'https://x.com/startnet_in' },
    { label: 'YouTube', href: 'https://www.youtube.com/@startnet-in' },
  ],
};

/* ---------------------------------------------------------------------------
   THE FIVE PROPERTIES
   Grouped by FUNCTION, not by name or launch date — the grouping is what
   teaches a stranger the ecosystem logic before they click anything.
   ------------------------------------------------------------------------ */

export const groups = [
  {
    id: 'learn',
    label: 'Learn & Build',
    note: 'Capability first. Where a founder gets the skill and the structure.',
  },
  {
    id: 'gather',
    label: 'Gather',
    note: 'Two moments a year when the whole ecosystem is in one place.',
  },
  {
    id: 'home',
    label: 'Year-round Home',
    note: 'What keeps the ecosystem alive between the two flagships.',
  },
];

export const properties = [
  {
    id: 'flywheel',
    name: 'AI Flywheel',
    domain: 'aiflywheel.in',
    href: 'https://aiflywheel.in',
    group: 'learn',
    kind: 'Training & research',
    /* CANONICAL LINE — do not reword downstream */
    line: 'Training and research. The framework for turning AI into compounding value, at any scale.',
    detail:
      'AI Flywheel is where founders and teams build real AI capability — structured curriculum, a free diagnostic to find your starting point, and a certification track for teams that want to formalise what they have learned.',
    bestFor: 'Founders and teams early in their AI adoption journey.',
    swatch: 'var(--sn-prop-flywheel)',
  },
  {
    id: 'nooru',
    name: 'Nooru.AI',
    domain: 'nooru.ai',
    href: 'https://nooru.ai',
    group: 'learn',
    kind: 'Accelerator cohorts',
    line: 'Accelerator cohorts. A hundred founders, one flywheel cycle, real outcomes.',
    detail:
      'Nooru (“hundred” in Tamil) runs a curated, diagnostic-gated cohort of 100 startups through a structured 90–120 day programme — mentorship, curriculum, and direct access to StartNet’s investor network.',
    bestFor: 'Founders with a validated product ready to scale.',
    swatch: 'var(--sn-prop-nooru)',
  },
  {
    id: 'agentic',
    name: 'Agentic AI Connect',
    domain: 'agenticaiconnect.in',
    href: 'https://agenticaiconnect.in',
    group: 'gather',
    kind: 'Digital summit, yearly',
    line: 'Digital summit, yearly. Where Tamil Nadu’s agentic AI builders gather once a year.',
    detail:
      'A digital-first summit bringing together the builders working on agentic AI — talks, demos, and the kind of density you do not get outside a dedicated gathering.',
    bestFor: 'Anyone building with or around agentic AI, once a year.',
    swatch: 'var(--sn-prop-agentic)',
  },
  {
    id: 'physical',
    name: 'Physical AI Connect',
    domain: 'physicalaiconnect.in',
    href: 'https://physicalaiconnect.in',
    group: 'gather',
    kind: 'Physical summit, yearly',
    line: 'Physical summit, yearly. The flagship gathering — in the room, once a year.',
    detail:
      'The in-person counterpart — where the ecosystem’s founders, investors, mentors and government partners are all in the same room at the same time.',
    bestFor: 'Relationship-building, deal flow, and seeing the whole ecosystem at once.',
    swatch: 'var(--sn-prop-physical)',
  },
  {
    id: 'snx',
    name: 'SNX',
    domain: 'snx.in',
    href: 'https://snx.in',
    group: 'home',
    kind: 'Diagnostics, community, archive',
    line: 'Your year-round home. Diagnostics, community, and everything that happens between the two flagships.',
    detail:
      'SNX is where the ecosystem stays alive in the months between Agentic AI Connect and Physical AI Connect — a founder diagnostic, a community feed, and the archive of everything from past gatherings.',
    bestFor: 'Anyone who wants to stay connected to the ecosystem year-round, not just at events.',
    swatch: 'var(--sn-prop-snx)',
  },
];

export const propertiesByGroup = groups.map((g) => ({
  ...g,
  items: properties.filter((p) => p.group === g.id),
}));

export const propertyById = Object.fromEntries(properties.map((p) => [p.id, p]));

/* ---------------------------------------------------------------------------
   NAVIGATION
   ------------------------------------------------------------------------ */

export const nav = [
  { label: 'Portfolio', href: '/portfolio', mega: true },
  { label: 'About', href: '/about' },
  { label: 'Newsroom', href: '/newsroom' },
  { label: 'Partners', href: '/partners' },
  { label: 'Careers', href: '/careers' },
];

/* ---------------------------------------------------------------------------
   PROOF
   Strategy §3.2 / Content §2.4 — nothing publishes without a source.
   `verified: false` rows are withheld from render, not padded with estimates.
   ------------------------------------------------------------------------ */

export const proof = {
  asOf: 'August 2026',
  note: 'We do not publish a number we cannot source. Every figure below is reconciled against the reporting of the property that produced it.',
  metrics: [
    {
      value: 2400,
      display: '2,400+',
      label: 'founders diagnosed through SNX',
      source: 'SNX diagnostic ledger',
      verified: true,
    },
    {
      value: 100,
      display: '100',
      label: 'startups through Nooru.AI cohorts',
      source: 'Nooru cohort records',
      verified: true,
    },
    {
      value: 1800,
      display: '1,800+',
      label: 'attendees at the last Physical AI Connect',
      source: 'Event registration export',
      verified: true,
    },
    {
      value: 14000,
      display: '14,000+',
      label: 'training modules completed through AI Flywheel',
      source: 'AI Flywheel LMS',
      verified: true,
    },
    {
      value: 4,
      display: '4',
      label: 'years running the ecosystem',
      source: 'Incorporation record',
      verified: true,
    },
  ],
};

/* ---------------------------------------------------------------------------
   NEXT FLAGSHIP EVENT
   Content §9: this module changes state on a date range, not a manual edit.
   `window` is the number of days before `date` during which the expanded
   treatment is promoted above "Who this is for".
   ------------------------------------------------------------------------ */

export const nextEvent = {
  propertyId: 'agentic',
  name: 'Agentic AI Connect 2026',
  date: '2026-11-14',
  dateDisplay: '14 November 2026',
  city: 'Chennai',
  theme: 'The year Tamil Nadu’s AI companies stopped being pilots.',
  windowDays: 120,
  links: [
    { label: 'Register', href: 'https://agenticaiconnect.in/register', primary: true },
    { label: 'See the agenda', href: 'https://agenticaiconnect.in/agenda' },
  ],
};

/* ---------------------------------------------------------------------------
   AUDIENCE ROUTING — "Who this is for"
   ------------------------------------------------------------------------ */

export const audiences = [
  {
    id: 'founder',
    title: 'I’m a founder',
    body: 'Start with SNX — get diagnosed, find your next step, and join the community that stays active all year.',
    cta: { label: 'Go to snx.in', href: 'https://snx.in', external: true },
    propertyId: 'snx',
  },
  {
    id: 'investor',
    title: 'I’m an investor or mentor',
    body: 'See what Nooru.AI cohorts are building, and how our diagnostic data tracks real outcomes rather than vanity metrics.',
    cta: { label: 'Go to nooru.ai', href: 'https://nooru.ai', external: true },
    propertyId: 'nooru',
  },
  {
    id: 'government',
    title: 'I’m from government or an institution',
    body: 'Talk to our partnerships team about how StartNet works alongside Tamil Nadu’s AI-driven economy initiatives.',
    cta: { label: 'Go to Partners', href: '/partners' },
    propertyId: null,
  },
  {
    id: 'press',
    title: 'I’m press',
    body: 'Find our latest announcements, cohort results, and event coverage in one place.',
    cta: { label: 'Go to Newsroom', href: '/newsroom' },
    propertyId: null,
  },
];

/* ---------------------------------------------------------------------------
   NEWSROOM
   ------------------------------------------------------------------------ */

export const news = [
  {
    id: 'nooru-cohort-3',
    propertyId: 'nooru',
    date: '2026-08-12',
    dateDisplay: '12 August 2026',
    title: 'Nooru.AI opens applications for Cohort 03',
    summary:
      'One hundred places, diagnostic-gated, running 90 days from October. Applications close 20 September.',
    href: 'https://nooru.ai/cohorts/03',
    external: true,
  },
  {
    id: 'pac-2026-dates',
    propertyId: 'physical',
    date: '2026-08-04',
    dateDisplay: '4 August 2026',
    title: 'Physical AI Connect returns to Chennai on 14 November',
    summary:
      'The flagship gathering moves to a single-track format, with the cohort demo floor opening to public registration for the first time.',
    href: 'https://physicalaiconnect.in/2026',
    external: true,
  },
  {
    id: 'flywheel-certification',
    propertyId: 'flywheel',
    date: '2026-07-22',
    dateDisplay: '22 July 2026',
    title: 'AI Flywheel launches a team certification track',
    summary:
      'A formal assessment path for organisations that want their AI capability recognised, not just acquired.',
    href: 'https://aiflywheel.in/certification',
    external: true,
  },
  {
    id: 'snx-diagnostic-2400',
    propertyId: 'snx',
    date: '2026-07-09',
    dateDisplay: '9 July 2026',
    title: 'SNX passes 2,400 completed founder diagnostics',
    summary:
      'District-level data now covers 27 of Tamil Nadu’s 38 districts — the clearest picture yet of where capability actually sits.',
    href: 'https://snx.in/insights/2400',
    external: true,
  },
  {
    id: 'agentic-cfp',
    propertyId: 'agentic',
    date: '2026-06-18',
    dateDisplay: '18 June 2026',
    title: 'Agentic AI Connect opens its call for builders',
    summary:
      'Demo slots are reserved for teams shipping agentic systems in production, not prototypes.',
    href: 'https://agenticaiconnect.in/call',
    external: true,
  },
  {
    id: 'thinktn-mou',
    propertyId: null,
    date: '2026-05-30',
    dateDisplay: '30 May 2026',
    title: 'StartNet formalises its evidence-sharing arrangement with Think TN',
    summary:
      'Ecosystem diagnostic data will be contributed quarterly, with governance kept deliberately separate.',
    href: '/newsroom',
    external: false,
  },
];

/* ---------------------------------------------------------------------------
   CAREERS
   ------------------------------------------------------------------------ */

export const jobs = [
  {
    id: 'ecosystem-lead',
    title: 'Ecosystem Partnerships Lead',
    propertyId: null,
    propertyLabel: 'StartNet (corporate)',
    location: 'Chennai',
    type: 'Full-time',
    summary:
      'Own the government, institutional and sponsor relationships that sit across all five properties.',
    href: 'mailto:careers@startnet.in?subject=Ecosystem%20Partnerships%20Lead',
  },
  {
    id: 'curriculum-architect',
    title: 'Curriculum Architect',
    propertyId: 'flywheel',
    propertyLabel: 'AI Flywheel',
    location: 'Chennai / Hybrid',
    type: 'Full-time',
    summary:
      'Design the capability ladder that takes a founder from diagnostic to certification.',
    href: 'mailto:careers@startnet.in?subject=Curriculum%20Architect',
  },
  {
    id: 'cohort-director',
    title: 'Cohort Director',
    propertyId: 'nooru',
    propertyLabel: 'Nooru.AI',
    location: 'Chennai',
    type: 'Full-time',
    summary:
      'Run a hundred founders through ninety days without losing a single one to drift.',
    href: 'mailto:careers@startnet.in?subject=Cohort%20Director',
  },
  {
    id: 'event-producer',
    title: 'Senior Event Producer',
    propertyId: 'physical',
    propertyLabel: 'Physical AI Connect',
    location: 'Chennai',
    type: 'Contract',
    summary:
      'Produce the flagship gathering end to end — floor, programme, and the room itself.',
    href: 'mailto:careers@startnet.in?subject=Senior%20Event%20Producer',
  },
  {
    id: 'data-analyst',
    title: 'Ecosystem Data Analyst',
    propertyId: 'snx',
    propertyLabel: 'SNX',
    location: 'Remote (India)',
    type: 'Full-time',
    summary:
      'Turn diagnostic data into the evidence base every claim on this site has to stand on.',
    href: 'mailto:careers@startnet.in?subject=Ecosystem%20Data%20Analyst',
  },
];

/* ---------------------------------------------------------------------------
   PARTNERS
   ------------------------------------------------------------------------ */

export const partnerTracks = [
  {
    id: 'government',
    title: 'Government & policy',
    body: 'Evidence-sharing, ecosystem data, and alignment with Tamil Nadu’s broader AI-driven economy initiatives.',
    entry: 'Ecosystem data, quarterly',
  },
  {
    id: 'sponsors',
    title: 'Corporate sponsors',
    body: 'Presence at Agentic AI Connect or Physical AI Connect, or curriculum partnership through AI Flywheel.',
    entry: 'Two flagships, one curriculum',
  },
  {
    id: 'institutional',
    title: 'Institutional & academic',
    body: 'Talent pipelines into Nooru.AI cohorts, and research collaboration through AI Flywheel.',
    entry: 'Pipeline & research',
  },
  {
    id: 'investors',
    title: 'Investors',
    body: 'Direct visibility into Nooru.AI’s cohort pipeline and outcome data.',
    entry: 'Cohort pipeline access',
  },
];

/* ---------------------------------------------------------------------------
   ABOUT
   ------------------------------------------------------------------------ */

export const beliefs = [
  {
    n: '01',
    title: 'Ecosystems compound when the pieces are connected',
    body: 'Not when they are forced into one product. Five properties that each stand on their own will always beat one that tries to do everything badly.',
  },
  {
    n: '02',
    title: 'Every claim should be traceable to a number',
    body: 'If we cannot show our work on a figure, it does not go on the page. A masterbrand’s credibility is the most expensive thing it owns.',
  },
  {
    n: '03',
    title: 'Geography should not decide access',
    body: 'A founder in any district of Tamil Nadu should have the same training, capital pathways and peer density as a founder anywhere in the world.',
  },
];

export const journey = [
  { step: 'Diagnose', propertyId: 'snx', body: 'A founder starts with a diagnostic on SNX.' },
  { step: 'Build', propertyId: 'flywheel', body: 'Takes a course on the Flywheel.' },
  { step: 'Accelerate', propertyId: 'nooru', body: 'Gets into a Nooru cohort.' },
  { step: 'Meet', propertyId: 'physical', body: 'Meets their first investor at Physical AI Connect.' },
  { step: 'Stay', propertyId: 'snx', body: 'And comes back to SNX for the eleven months in between.' },
];
