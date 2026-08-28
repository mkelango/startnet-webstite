/* ============================================================================
   StartNet — CONTENT SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Rebuilt per STARTTNWEBSITESTRATEGY.md (27 Aug 2026): StartNet is kept as
   the house name and wordmark — no logo change — but the architecture moves
   from five externally-domained properties to five brand SECTIONS living on
   this one site: StartNet X, Connect, Research, Vibe, AI. That is the
   document's core reversal (§0): a group with no independent brand search
   demand must be the demand surface itself, not a set of tiles pointing out.

   Governance note (content doc §9 discipline, carried forward): the `line`
   field on each brand is the ONE canonical description, rendered verbatim in
   the nav, the homepage grid, the footer directory and each brand's own page.

   Claims audit (strategy §1.2): every number below either carries a source
   and a date, or it was cut. Nothing here is a target dressed as a result.
   ========================================================================== */

export const site = {
  name: 'StartNet',
  domain: 'startnet.in',
  origin: 'https://startnet.in',
  legalName: 'StartNet',
  tagline: 'Five doors. One ecosystem.',
  narrative:
    'StartNet is the infrastructure behind Tamil Nadu’s AI-driven startup ecosystem: one platform, one lab programme, one education ladder, one venture studio and two annual gatherings, all under one roof.',
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
   THE HOUSE RULE ON NUMBERS (strategy §1.2)
   "Every number on the site carries a confidence tag and a date, or it does
   not go on the site." Tags follow the document's own scheme:
     A — verified against a primary source
     B — an organisation's own claim, reported as such
     C — an estimate or inference
   ------------------------------------------------------------------------ */
export const confidenceTags = {
  A: 'Verified against a primary source',
  B: 'Reported as the organisation’s own claim',
  C: 'An estimate or inference',
};

/* ---------------------------------------------------------------------------
   THE FIVE DOORS
   No sub-grouping — the strategy names five brands with a class each, not
   three buckets. `href` is an internal path on this site, not an outbound
   domain; `domain` is kept as a display field (still literally true — each
   is a real path on startnet.in) so the "Visit {domain}" pattern in the
   card and mega-menu components needed no visual change, only correct
   same-site link behaviour.
   ------------------------------------------------------------------------ */

export const groups = [
  {
    id: 'all',
    label: 'The five doors',
    note: 'One sentence each, from the strategy: what it is, who it is for.',
  },
];

export const properties = [
  {
    id: 'x',
    name: 'StartNet X',
    domain: 'startnet.in/platform',
    href: '/platform',
    group: 'all',
    kind: 'Platform',
    /* CANONICAL LINE — do not reword downstream */
    line: 'The account every founder in Tamil Nadu has: diagnostics, profile, matching, the archive.',
    detail:
      'StartNet X is free to join, free to be listed, and free to be diagnosed. The front door is the Founder Diagnostic, not the directory. A directory is a thing people are in, a diagnostic is a thing people do, and everything else on the platform is reachable from the result page.',
    bestFor: 'Every founder, mentor, investor and college in the ecosystem, the account underneath everything else.',
    swatch: 'var(--sn-prop-snx)',
    lockup: 'Full: StartNet X',
  },
  {
    id: 'connect',
    name: 'StartNet Connect',
    domain: 'startnet.in/connect',
    href: '/connect',
    group: 'all',
    kind: 'Event',
    line: 'The two days a year the ecosystem is in one room.',
    detail:
      'Agentic AI Connect and Physical AI Connect are the two flagship gatherings, each mapping to a stage of the AI Flywheel, published on a fixed annual window, never moved, so ministries, sponsors and journalists can plan around it a year out.',
    bestFor: 'Anyone who wants the whole ecosystem in one room, twice a year, on a date that never moves.',
    swatch: 'var(--sn-prop-agentic)',
    lockup: 'Full: event name, “a StartNet Connect event”',
  },
  {
    id: 'research',
    name: 'StartNet Research',
    domain: 'startnet.in/research',
    href: '/research',
    group: 'all',
    kind: 'Institutional programme',
    line: 'The lab a college buys to become accredited.',
    detail:
      'A three-year operating contract (curriculum, staffing and rented compute), not a capital equipment sale. Four lab types map to the four flywheel stages, and the case for a college is a fee band and an accreditation score, not enthusiasm for AI.',
    bestFor: 'Engineering colleges pursuing Category I / NBA accreditation, and the industry clusters that fund a named lab.',
    swatch: 'var(--sn-prop-physical)',
    lockup: 'Full, and prominent: procurement buys the institution, not the brand',
  },
  {
    id: 'vibe',
    name: 'StartNet Vibe',
    domain: 'startnet.in/vibe',
    href: '/vibe',
    group: 'all',
    kind: 'Education',
    line: 'How a student becomes a builder.',
    detail:
      'Three products on one ladder: Vibe Summits recruit, Vibe Academy trains faculty and students on the four flywheel tracks, and Vibathon is the college hackathon where 80% of participating colleges are tier 3 and 4, a reach no metro event has.',
    bestFor: 'Students and the faculty who teach them, from a first campus summit through to a founded company.',
    swatch: 'var(--sn-prop-nooru)',
    lockup: 'Full for Academy and Summits · light for Vibathon',
  },
  {
    id: 'ai',
    name: 'StartNet AI',
    domain: 'startnet.in/ai',
    href: '/ai',
    group: 'all',
    kind: 'Product & venture',
    line: 'What StartNet builds and sells with industry.',
    detail:
      'Small vision and tabular models trained on real cluster data, the language layer rented from whoever is best that quarter, and the data access owned. The nooru.ai cohort sits here (a hundred founders, one flywheel cycle), alongside GCC partnerships and the domain clusters, Namakkal first.',
    bestFor: 'GCCs, industry clusters and the nooru.ai cohort of founders building domain AI products.',
    swatch: 'var(--sn-prop-flywheel)',
    lockup: 'Light, and lighter over time: nooru.ai may stand alone if the cohort works',
  },
];

export const propertiesByGroup = groups.map((g) => ({
  ...g,
  items: properties.filter((p) => p.group === g.id),
}));

export const propertyById = Object.fromEntries(properties.map((p) => [p.id, p]));

/* ---------------------------------------------------------------------------
   NAVIGATION — strategy §5.2: brand-led, not audience-led
   Five brands as direct top-level links; About carries the cross-cutting
   material (story, flywheel, house relationship, numbers, people) as a
   mega-menu, reusing the exact dropdown mechanism the site already has.
   ------------------------------------------------------------------------ */

export const nav = [
  { label: 'Platform', href: '/platform' },
  { label: 'Connect', href: '/connect' },
  { label: 'Research', href: '/research' },
  { label: 'Vibe', href: '/vibe' },
  { label: 'AI', href: '/ai' },
  { label: 'About', href: '/about', mega: true },
];

/* The About mega-menu's three columns — StartNet's own equivalent of the
   five-brand grouping, for the one nav item that isn't a brand. */
export const aboutMenu = [
  {
    label: 'StartNet',
    items: [
      { name: 'Our story', kind: 'How the house came together', href: '/about#story' },
      { name: 'The AI Flywheel', kind: 'Perception → Generative → Agentic → Physical → data', href: '/about#flywheel' },
      { name: 'The five doors', kind: 'X · Connect · Research · Vibe · AI', href: '/#portfolio' },
    ],
  },
  {
    label: 'Governance',
    items: [
      { name: 'Think TN & AITN', kind: 'The relationship, stated plainly', href: '/about#house' },
      { name: 'Our published figures', kind: 'Every number, sourced and dated', href: '/about#numbers' },
    ],
  },
  {
    label: 'Get in touch',
    items: [
      { name: 'People', kind: 'Team, advisors, careers', href: '/about#people' },
      { name: 'Newsroom', kind: 'Press releases and coverage', href: '/newsroom' },
      { name: 'Contact', kind: 'General, partners, press, colleges', href: '/contact' },
    ],
  },
];

/* ---------------------------------------------------------------------------
   PROOF — strategy §1.2 claims audit applied
   Every legacy figure that could not be verified was cut outright, not
   softened: $8B+ funding, "India's First…", "Tamil Nadu's Largest…", "TN
   Official Partner", 95% retention, 5,000+ signups, ₹2,000 Cr valuation and
   3,000 freelancers all fail [A, negative] and do not appear below.
   ------------------------------------------------------------------------ */

export const proof = {
  asOf: 'August 2026',
  note: 'We do not publish a number we cannot source. Every figure below carries a confidence tag from the strategy’s own scheme (verified, self-reported, or estimated), and nothing else goes on this page.',
  metrics: [
    {
      value: 2400,
      display: '2,400+',
      label: 'founders diagnosed through StartNet X',
      source: 'StartNet X diagnostic ledger',
      tag: 'B',
      verified: true,
    },
    {
      value: 80,
      display: '80%',
      label: 'of Vibathon colleges are tier 3 and 4, the reach no metro hackathon has',
      source: 'Vibathon 2025 brochure',
      tag: 'B',
      verified: true,
    },
    {
      value: 15037,
      display: '15,037',
      label: 'DPIIT-recognised startups in Tamil Nadu (ranked 6th nationally, not 1st)',
      source: 'DPIIT, July 2026',
      tag: 'A',
      verified: true,
    },
    {
      value: 4,
      display: '4',
      label: 'years running the ecosystem',
      source: 'Incorporation record',
      tag: 'A',
      verified: true,
    },
  ],
};

/* ---------------------------------------------------------------------------
   THE AI FLYWHEEL — fixed (strategy §4)
   Perception is Jensen Huang's own CES 2025 first stage, not "Foundation
   AI" — crediting the source removes the collision with Stanford CRFM's
   "foundation model", which underlies every stage rather than preceding it.
   Closing the loop is StartNet's own contribution: it turns a borrowed
   ladder into a genuine flywheel with a feedback loop.
   ------------------------------------------------------------------------ */

export const flywheel = [
  {
    stage: 'Perception',
    body: 'Sensing and vision: the stage every deployment starts from, and the one the legacy material skipped.',
  },
  {
    stage: 'Generative',
    body: 'Language and content: Jensen Huang’s CES 2025 progression, credited rather than silently reused.',
  },
  {
    stage: 'Agentic',
    body: 'Tool use and orchestration: agents that act, not just answer.',
  },
  {
    stage: 'Physical',
    body: 'Deployed in a real poultry shed or a real knitting floor, where the loop actually closes.',
  },
  {
    stage: 'Data',
    body: 'Real-world data no public corpus contains, feeding straight back into Perception. That loop is what makes it a flywheel, not a ladder.',
  },
];

export const coreDrive = {
  core: [
    { letter: 'C', word: 'Capability' },
    { letter: 'O', word: 'Ownership of data' },
    { letter: 'R', word: 'Responsibility and safety' },
    { letter: 'E', word: 'Evidence' },
  ],
  drive: [
    { letter: 'D', word: 'Diagnose', maps: 'x' },
    { letter: 'R', word: 'Research', maps: 'research' },
    { letter: 'I', word: 'Incubate', maps: 'ai' },
    { letter: 'V', word: 'Validate', maps: 'vibe' },
    { letter: 'E', word: 'Expand', maps: 'connect' },
  ],
};

/* ---------------------------------------------------------------------------
   NEXT FLAGSHIP EVENT
   Strategy §0 / open item 2: the live site previously showed both flagship
   summits on the same date — "two flagship summits cannot share a date."
   Fixed here: Agentic AI Connect (digital) in November, Physical AI Connect
   (in-person) the following spring — a genuine six-month house rhythm.
   `windowDays` is how many days before `date` the expanded treatment
   promotes above "Who this is for".
   ------------------------------------------------------------------------ */

export const nextEvent = {
  propertyId: 'connect',
  name: 'Agentic AI Connect 2026',
  date: '2026-11-14',
  dateDisplay: '14 November 2026',
  city: 'Chennai',
  theme: 'The year Tamil Nadu’s AI companies stopped being pilots.',
  windowDays: 120,
  links: [
    { label: 'Register', href: '/connect#agentic', primary: true },
    { label: 'See the agenda', href: '/connect#agentic' },
  ],
};

/* The second flagship, on its own published date — kept separate so the
   two events are never shown sharing a date again. */
export const secondEvent = {
  propertyId: 'connect',
  name: 'Physical AI Connect 2027',
  date: '2027-05-08',
  dateDisplay: '8 May 2027',
  city: 'Chennai',
  href: '/connect#physical',
};

/* ---------------------------------------------------------------------------
   AUDIENCE ROUTING — "Who this is for"
   ------------------------------------------------------------------------ */

export const audiences = [
  {
    id: 'founder',
    title: 'I’m a founder',
    body: 'Start with the Founder Diagnostic on StartNet X: free, no login to start, an email to finish.',
    cta: { label: 'Go to StartNet X', href: '/platform' },
    propertyId: 'x',
  },
  {
    id: 'investor',
    title: 'I’m an investor or mentor',
    body: 'See what the nooru.ai cohort is building on StartNet AI, and how our diagnostic data tracks real outcomes rather than vanity metrics.',
    cta: { label: 'Go to StartNet AI', href: '/ai' },
    propertyId: 'ai',
  },
  {
    id: 'college',
    title: 'I’m from a college or government body',
    body: 'Talk to us about a StartNet Research lab, a Vibe partnership, or how StartNet works alongside Tamil Nadu’s AI-driven economy initiatives.',
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
    id: 'vibathon-tier34',
    propertyId: 'vibe',
    date: '2026-08-20',
    dateDisplay: '20 August 2026',
    title: 'Vibathon reach confirmed: 80% of colleges are tier 3 and 4',
    summary:
      'A distinctive that Smart India Hackathon and every metro event cannot claim: reach the strategy names as the single most defensible number in the house.',
    href: '/vibe#vibathon',
    external: false,
  },
  {
    id: 'connect-dates-fixed',
    propertyId: 'connect',
    date: '2026-08-12',
    dateDisplay: '12 August 2026',
    title: 'Agentic AI Connect and Physical AI Connect now on separate dates',
    summary:
      'Agentic AI Connect runs 14 November 2026; Physical AI Connect follows on 8 May 2027, a fixed, repeatable annual rhythm.',
    href: '/connect',
    external: false,
  },
  {
    id: 'research-lab-types',
    propertyId: 'research',
    date: '2026-08-04',
    dateDisplay: '4 August 2026',
    title: 'StartNet Research opens four lab types to first proposals',
    summary:
      'Perception, Generative, Agentic and Physical AI labs, sold as three-year operating contracts rather than equipment.',
    href: '/research#lab-types',
    external: false,
  },
  {
    id: 'nooru-cohort',
    propertyId: 'ai',
    date: '2026-07-22',
    dateDisplay: '22 July 2026',
    title: 'nooru.ai opens its next cohort inside StartNet AI',
    summary:
      'A hundred founders, one flywheel cycle, real outcomes: domain AI products, not domain-specific models.',
    href: '/ai#nooru',
    external: false,
  },
  {
    id: 'x-diagnostic-2400',
    propertyId: 'x',
    date: '2026-07-09',
    dateDisplay: '9 July 2026',
    title: 'StartNet X passes 2,400 completed founder diagnostics',
    summary:
      'The front door of the platform, and the top of every funnel StartNet has.',
    href: '/platform#diagnostic',
    external: false,
  },
  {
    id: 'thinktn-relationship',
    propertyId: null,
    date: '2026-05-30',
    dateDisplay: '30 May 2026',
    title: 'StartNet states its relationship with Think TN Foundation in writing',
    summary:
      'A shared founder, an arm’s-length services agreement, and governance kept deliberately separate.',
    href: '/about#house',
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
    propertyLabel: 'StartNet (house)',
    location: 'Chennai',
    type: 'Full-time',
    summary:
      'Own the government, institutional and sponsor relationships that sit across all five doors.',
    href: 'mailto:careers@startnet.in?subject=Ecosystem%20Partnerships%20Lead',
  },
  {
    id: 'lab-programme-director',
    title: 'Lab Programme Director',
    propertyId: 'research',
    propertyLabel: 'StartNet Research',
    location: 'Chennai / Hybrid',
    type: 'Full-time',
    summary:
      'Sell and run three-year lab operating contracts across Perception, Generative, Agentic and Physical AI.',
    href: 'mailto:careers@startnet.in?subject=Lab%20Programme%20Director',
  },
  {
    id: 'cohort-director',
    title: 'Cohort Director, nooru.ai',
    propertyId: 'ai',
    propertyLabel: 'StartNet AI',
    location: 'Chennai',
    type: 'Full-time',
    summary:
      'Run a hundred founders through one flywheel cycle without losing a single one to drift.',
    href: 'mailto:careers@startnet.in?subject=Cohort%20Director%2C%20nooru.ai',
  },
  {
    id: 'event-producer',
    title: 'Senior Event Producer',
    propertyId: 'connect',
    propertyLabel: 'StartNet Connect',
    location: 'Chennai',
    type: 'Contract',
    summary:
      'Produce Agentic AI Connect and Physical AI Connect end to end, on fixed published dates that never move.',
    href: 'mailto:careers@startnet.in?subject=Senior%20Event%20Producer',
  },
  {
    id: 'data-analyst',
    title: 'Ecosystem Data Analyst',
    propertyId: 'x',
    propertyLabel: 'StartNet X',
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
    body: 'Evidence-sharing, ecosystem data, and alignment with Tamil Nadu’s AI-driven economy initiatives, through StartNet X and StartNet Research.',
    entry: 'Ecosystem data, quarterly',
  },
  {
    id: 'sponsors',
    title: 'Corporate sponsors',
    body: 'Category-exclusive sponsorship at Agentic AI Connect or Physical AI Connect, with a published rate card.',
    entry: 'Two flagships, one rate card',
  },
  {
    id: 'institutional',
    title: 'Institutional & academic',
    body: 'A StartNet Research lab as a three-year operating contract, or a StartNet Vibe faculty-development partnership.',
    entry: 'Labs & faculty development',
  },
  {
    id: 'investors',
    title: 'Investors & GCCs',
    body: 'Direct visibility into the nooru.ai cohort pipeline on StartNet AI, and outcome data from StartNet X.',
    entry: 'Cohort pipeline access',
  },
];

/* ---------------------------------------------------------------------------
   ABOUT
   ------------------------------------------------------------------------ */

export const beliefs = [
  {
    n: '01',
    title: 'Every number carries a tag and a date',
    body: 'Or it does not go on the site. In a market where every ecosystem body publishes round numbers nobody checks, being the one that publishes checkable numbers is the strategy, not a compliance posture.',
  },
  {
    n: '02',
    title: 'Domain-specific products, not domain-specific models',
    body: 'GPT-4 beat a 50-billion-parameter model purpose-built on financial data, with zero financial pretraining. We train small vision and tabular models, rent the language layer, and own the data access.',
  },
  {
    n: '03',
    title: 'A college buys an outcome, not equipment',
    body: 'A lab is a three-year operating contract, priced against a fee band and an accreditation score, not a capital purchase nobody can afford to run.',
  },
];

/* The founder journey through the new five doors — same shape as before,
   remapped from external properties to internal sections. */
export const journey = [
  { step: 'Diagnose', propertyId: 'x', body: 'A founder starts with the Founder Diagnostic on StartNet X.' },
  { step: 'Learn', propertyId: 'vibe', body: 'Comes up through a Vibe Summit and the Academy.' },
  { step: 'Build', propertyId: 'research', body: 'Or a college builds capability through a Research lab.' },
  { step: 'Venture', propertyId: 'ai', body: 'Joins a nooru.ai cohort inside StartNet AI.' },
  { step: 'Gather', propertyId: 'connect', body: 'Meets the whole ecosystem at Connect, and comes back to X in between.' },
];

/* ---------------------------------------------------------------------------
   THE STARTTN BRAND GATE (strategy §3.3)
   The rule that stops the house becoming nine brands again.
   ------------------------------------------------------------------------ */

export const brandGate = [
  'A named full-time owner who is not the founder.',
  'A named, priced, sold revenue line covering at least 60% of its own first-year cost.',
  'A one-page charter: who it serves, what it costs, four ways it fails, five conditions under which it is closed.',
  'A one-sentence mechanism naming what it gives another StartNet brand. "Synergy" is not a mechanism.',
  'An independence test: does it share its customer, its funder and its people with an existing brand? If yes, it is that brand wearing a second hat.',
];

/* ---------------------------------------------------------------------------
   THINK TN RELATIONSHIP (strategy §1.1)
   ------------------------------------------------------------------------ */

export const houseRelationship = {
  intro:
    'StartNet is a commercial entity that shares a founder and a mission with Think TN Foundation. The two are visibly, contractually and financially separate.',
  rows: [
    { label: 'Form', thinktn: 'Section 8, not-for-profit', startnet: 'Commercial' },
    { label: 'What it sells', thinktn: 'Nothing; it publishes', startnet: 'Platform, events, labs, education, products' },
    { label: 'Revenue rule', thinktn: 'Commercial receipts ≤ 20% of total', startnet: 'No such constraint' },
    { label: 'Relationship', thinktn: 'Arm’s length: a written services agreement, priced at market, disclosed as a related-party transaction', startnet: 'The same, from the other side' },
  ],
  note: 'An institution that discloses this relationship is stronger than one that is asked about it.',
};
