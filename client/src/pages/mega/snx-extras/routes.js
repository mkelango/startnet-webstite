// Mega-menu pages for the StartNet X "The platform" and "Developers" columns (Book 1 Part B §2.2, §3.2).
// Paths are relative to the site root; all three render inside BrandLayout brand 'x' (/startnet-x/*).
export const MEGA_ROUTES = [
  {
    path: 'startnet-x/agents',
    file: './Agents.jsx',
    brand: 'x',
    navLabel: 'AI agents and guardrails',
    phase: 3,
    menu: { section: 'StartNet X', replaces: null },
    slugs: null,
    bottomCta: { label: 'Read guardrails', to: '/startnet-x/agents#guardrails' },
    notes:
      'nav.js already links /startnet-x/agents (phase 3, unpublished: true): drop `unpublished` when publishing. Status chip "Coming in a later release · SNX v2". In-page anchors: #what-agents-do #guardrails #human-in-the-loop #your-data #questions.',
  },
  {
    path: 'startnet-x/developers',
    file: './Developers.jsx',
    brand: 'x',
    navLabel: 'API & Ledger data',
    phase: 3,
    menu: { section: 'StartNet X', replaces: null },
    slugs: null,
    bottomCta: { label: 'Get an API key', to: '/startnet-x/developers#api-key' },
    notes:
      'Serves the whole "Developers" nav column: /startnet-x/developers, #webhooks and #status (ids exist). Drop `unpublished` on the column and its three links. API key form posts SmartForm type "interest" with hidden programme "snx-developers-api-key". Endpoints/code are illustrative and marked planned.',
  },
  {
    path: 'startnet-x/updates',
    file: './Updates.jsx',
    brand: 'x',
    navLabel: 'Updates',
    phase: 2,
    menu: { section: 'StartNet X', replaces: null },
    slugs: null,
    bottomCta: null,
    notes:
      'nav.js already links /startnet-x/updates (unpublished: true): drop `unpublished`. Roadmap entries only from the books; "Released" view is an empty state until a release ships. Newsletter via kit NewsletterForm (/api/forms/newsletter) in the #subscribe section. Book 1 §2.2 gives this page no CTA, so bottomCta is null (the hero links to #subscribe).',
  },
];

export default MEGA_ROUTES;
