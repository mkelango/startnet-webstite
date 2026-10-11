// StartNet X marketing content. Copy: Book 2 §7 (overview, audience pages, pricing) and §2.6 (AI guardrails, your data).
// Module status is placeholder #11 in Book 2 Appendix A: never show a "Coming" feature as live.

export const SNX_STATUS_PLACEHOLDER = '[status — to be confirmed]';

export const MODULES = [
  { id: 'id', name: 'SNX ID', line: 'One sign-in and profile across all StartNet brands.', icon: 'Fingerprint' },
  { id: 'events', name: 'Events', line: 'Register, pay and get your QR ticket, even inside WhatsApp.', icon: 'CalendarCheck' },
  { id: 'learn', name: 'Learn', line: 'Courses and cohorts with verifiable certificates.', icon: 'GraduationCap' },
  { id: 'circles', name: 'Circles', line: 'Your chapter, attendance and introductions.', icon: 'Users' },
  { id: 'launch', name: 'Launch', line: 'Apply to programmes and track milestones.', icon: 'Rocket' },
  { id: 'capital', name: 'Capital', line: 'Data room, investor CRM and grant tracker.', icon: 'Landmark' },
  { id: 'access', name: 'Access', line: 'Apply to GCC and government problem statements.', icon: 'Briefcase' },
  { id: 'insights', name: 'Insights & Ledger', line: 'Dashboards and the public Founder Ledger.', icon: 'LineChart' },
  { id: 'agents', name: 'Agents', line: 'An AI Founder Coach, Matchmaker and Grant Navigator that suggest; people decide.', icon: 'Bot' },
];

export const TRUST_STRIP = 'Your data stays in India. You choose who sees your profile. No automated rejections, ever.';

export const AUDIENCES = [
  {
    id: 'founders',
    label: 'Founders & learners',
    title: 'Your founder journey, in one place.',
    sub: 'Free to start. Upgrade only when you need team tools, a data room or investor access.',
    blocks: [
      { title: 'What you get free', body: 'Profile, events, starter courses, Coach lite.' },
      { title: 'When to upgrade', body: 'Pro, Team, Scale.' },
      { title: 'Your data, your choice', body: 'You choose who sees your profile.' },
    ],
    cta: { label: 'Create your free profile', snx: '/signup' },
  },
  {
    id: 'institutions',
    label: 'Institutions',
    title: 'Run your innovation programme on StartNet X.',
    sub: 'A branded space for your students and faculty, with the reporting your IIC and accreditation teams need.',
    blocks: [
      { title: 'Branded tenant', body: 'At x.startnet.in/t/your-institution.' },
      { title: 'Cohorts and reporting', body: 'Cohorts, LMS and IIC/NAAC innovation reporting.' },
      { title: 'Student seats', body: 'Student Pro seats included.' },
    ],
    cta: { label: 'Book a demo', to: '/partner/enquire?topic=snx' },
  },
  {
    id: 'incubators',
    label: 'Incubators & TBIs',
    title: 'Incubators & TBIs',
    sub: 'Programme CRM, applications and judging, portfolio tracking, Ledger export, investor-day tools.',
    blocks: [
      { title: 'Programme CRM', body: 'Applications and judging.' },
      { title: 'Portfolio tracking', body: 'Ledger export.' },
      { title: 'Investor day', body: 'Investor-day tools.' },
    ],
    cta: { label: 'Request a demo', to: '/partner/enquire?topic=snx' },
  },
  {
    id: 'gccs',
    label: 'GCCs & corporates',
    title: 'Problems in. Pilots and talent out.',
    sub: 'A challenge board, pilot pipeline and talent access for Global Capability Centres and corporates.',
    blocks: [
      { title: 'Challenge board', body: 'Challenge board and pilot tracking.' },
      { title: 'Opted-in talent', body: 'Opted-in talent from Vibathon, Labs and Founder Switch.' },
      { title: 'Impact reporting', body: 'Quarterly innovation-impact report.' },
    ],
    cta: { label: 'Book a demo', to: '/partner/enquire?topic=snx' },
  },
  {
    id: 'government',
    label: 'Government & districts',
    title: 'See every founder programme in your district.',
    sub: 'Dashboards, scheme pipelines and programme operations for StartupTN, iTNT and district administrations.',
    blocks: [
      { title: 'Dashboards', body: 'District or state dashboards.' },
      { title: 'Operations', body: 'Scheme pipeline and programme operations.' },
      { title: 'Open data', body: 'Open-data feeds with A/B/C tags.' },
    ],
    cta: { label: 'Request a briefing', to: '/partner/enquire?topic=snx' },
  },
  {
    id: 'investors',
    label: 'Investors',
    title: 'Investors',
    sub: 'Curated deal flow, data rooms, syndicate tools, Ledger analytics.',
    blocks: [
      { title: 'Deal flow', body: 'Curated deal flow.' },
      { title: 'Data rooms', body: 'Data rooms and syndicate tools.' },
      { title: 'Ledger analytics', body: 'Ledger analytics.' },
    ],
    cta: { label: 'Request a demo', to: '/partner/enquire?topic=snx' },
  },
];

/* ---------------- Pricing (Book 2 §7.3; all prices indicative, ex-GST, tag C) ---------------- */
export const PLANS = [
  {
    id: 'free', name: 'SNX Free', monthly: 0, annual: 0, for: 'Anyone starting out',
    includes: ['SNX ID and profile', 'Event registration', 'Community and Circles directory', 'Starter Academy courses', 'Founder Coach (lite)'],
    button: 'Start free', snx: '/signup',
  },
  {
    id: 'pro', name: 'SNX Pro', monthly: 499, annual: 4999, for: 'Learners and solo founders',
    includes: ['Everything in Free', 'Full Academy library and certificates', 'Co-founder and mentor Matchmaker', 'Grant Navigator', 'Priority event seats'],
    button: 'Go Pro', snx: '/signup', notes: ['Students get 50% off Pro.', 'Connect and Women Circle members get Pro included.'],
  },
  {
    id: 'team', name: 'SNX Team', monthly: 2999, annual: null, for: 'Teams up to 5 seats',
    includes: ['Everything in Pro', 'Team workspace and data room', 'Investor CRM', 'GCC challenge applications', 'Scale Connect eligibility'],
    button: 'Start Team', snx: '/signup',
  },
  {
    id: 'scale', name: 'SNX Scale', monthly: 7999, annual: null, for: 'Growth-stage startups',
    includes: ['Everything in Team', 'Deal room and investor-day priority', 'Pilot pipeline analytics', 'Advisor hours', 'Export desk access'],
    button: 'Talk to us', to: '/partner/enquire?topic=snx',
  },
];

/** Comparison rows: each feature is included from the plan index `from` upward. */
export const FEATURES = [
  { group: 'Profile and community', rows: [
    { label: 'SNX ID and profile', from: 0 },
    { label: 'Event registration', from: 0 },
    { label: 'Community and Circles directory', from: 0 },
    { label: 'Founder Coach (lite)', from: 0 },
    { label: 'Priority event seats', from: 1 },
  ] },
  { group: 'Learning', rows: [
    { label: 'Starter Academy courses', from: 0 },
    { label: 'Full Academy library and certificates', from: 1 },
  ] },
  { group: 'Matching and capital', rows: [
    { label: 'Co-founder and mentor Matchmaker', from: 1 },
    { label: 'Grant Navigator', from: 1 },
    { label: 'Team workspace and data room', from: 2 },
    { label: 'Investor CRM', from: 2 },
    { label: 'Deal room and investor-day priority', from: 3 },
  ] },
  { group: 'Market access and scale', rows: [
    { label: 'GCC challenge applications', from: 2 },
    { label: 'Scale Connect eligibility', from: 2 },
    { label: 'Pilot pipeline analytics', from: 3 },
    { label: 'Advisor hours', from: 3 },
    { label: 'Export desk access', from: 3 },
  ] },
];

export const PLAN_MICROCOPY = [
  'Students get 50% off Pro.',
  'Connect and Women Circle members get Pro included.',
  'Prices exclude 18% GST [confirm rate]. Cancel any time; access runs to the end of the period.',
  'Pay by UPI Autopay, card or net banking.',
];

export const ORG_TIERS = [
  { tier: 'Institution', includes: 'Branded tenant, cohorts and LMS, IIC and NAAC innovation reporting, Campus or Research Index score, student Pro seats, Vibe Campus events', from: 300000, suffix: ' / year, by size' },
  { tier: 'Incubator / TBI', includes: 'Programme CRM, applications and judging, portfolio tracking, Ledger export, investor-day tools', from: 200000, suffix: ' / year' },
  { tier: 'GCC / corporate', includes: 'Challenge board, pilot pipeline, talent access, intrapreneur cohort, innovation-impact reports', from: 1000000, suffix: ' / year' },
  { tier: 'Government / ecosystem', includes: 'District or state dashboards, programme operations, scheme pipelines, open-data feeds', from: 2500000, suffix: ' / year' },
  { tier: 'Investor', includes: 'Curated deal flow, data rooms, syndicate tools, Ledger analytics', from: 50000, suffix: ' / year' },
];

export const PRICING_FAQ = [
  { id: 'free', question: 'Is Free really free?', answer: 'Yes, no card needed.' },
  { id: 'college', question: 'Can my college pay for me?', answer: 'Yes, through an institution licence.' },
  { id: 'csr', question: "What if I'm sponsored by CSR?", answer: 'Your seat is activated with a code.' },
  { id: 'data', question: 'Do you sell my data?', answer: 'No.' },
];

/* ---------------- Trust (Book 2 §2.6 sections 3 and 4) ---------------- */
export const AI_GUARDRAILS_INTRO = 'StartNet X uses AI agents to help with coaching, matching, grant applications and operations. People make the decisions.';
export const AI_GUARDRAILS = [
  'No automated rejection. Every selection, funding or exclusion decision is made by a named person.',
  'Bias audits each quarter by gender, district, language and college tier, published in our self-diagnosis.',
  'Every agent answer cites its source, and figures keep their tag.',
  'Agents are tested in Tamil and English before they go live.',
];
export const YOUR_DATA = [
  { icon: 'Scale', title: 'Your rights under the DPDP Act', body: 'We follow the Digital Personal Data Protection Act, 2023. You can access, correct or erase your data, and withdraw consent at any time.' },
  { icon: 'Server', title: 'Stored in India', body: 'Your data is stored in India, encrypted in transit and at rest.' },
  { icon: 'Eye', title: 'You choose who sees it', body: 'We never sell personal data. Your profile is shared with an investor, GCC or institution only if you opt in, and every share is logged.' },
  { icon: 'UserCheck', title: 'Under 18', body: 'For anyone under 18, we ask for verifiable consent from a parent or guardian.' },
];
export const DATA_RIGHTS = ['Access', 'Correct', 'Erase', 'Withdraw consent'];
