# snx-extras: StartNet X mega-menu pages

| Page | File | Template | Phase | Brand |
|---|---|---|---|---|
| `/startnet-x/agents`: AI agents and guardrails | `Agents.jsx` + `.css` | T19 | P3 | `x` |
| `/startnet-x/developers`: API & Ledger data, `#webhooks`, `#status` | `Developers.jsx` + `.css` | T19 | P3 | `x` |
| `/startnet-x/updates`: release notes | `Updates.jsx` + `.css` | T15 | P2 | `x` |

Shared page-local parts: `SnxxParts.jsx/.css` (`XStatus` chip that only renders Coming, Planned or In beta, never Live; `OnThisPage` anchor chips).

## Content sources
- Book 1 Part B §2.1 (`api.startnet.in`: v3, read-only, aggregated or consented data, documented at /developers, Ledger "Get this data" links), §2.2 inventory (purpose, audience, CTA, phase), §8.3 (Dec 2026: first Connect on SNX v0), §12 phase scopes (v0 deep links, v1 Launch/Circles, v2 Access/Capital/agents, v3 APIs), §13.1 (SNX signed-in state, Q1 2027), §3.7 breadcrumbs.
- Book 2 §7.1 (Agents module line, status rule), §7.2/§7.3 (plan rows for Coach/Matchmaker/Grant Navigator; org-tier use cases), §2.6 sections 3–4 (AI guardrails and your data, used word for word), §14.3 (CTA Tamil).
- No API data is fetched. All three pages are static.

## Placeholders
- The four unnamed agents (Book 1 says "seven agents", but only three are named): names and scope.
- Grievance officer details.
- API rate limits and licence terms; webhook signing, retries and delivery terms; status page URL.
- Exact release dates (roadmap windows are labelled "indicative").
- The single number shown is `7` agents (`<Stat>`, tag C, planning figure).

## Integration notes
- Register all three routes as children of the existing `startnet-x` `BrandLayout brand="x"` route, alongside the Tamil mirror.
- nav.js: remove `unpublished: true` from `/startnet-x/agents`, `/startnet-x/updates` and the whole "Developers" column (`/startnet-x/developers`, `#webhooks`, `#status`). No targets need replacing.
- You could add `Updates` to `BRANDS.x.subNav`. That decision belongs to integration.
- Bottom CTAs: Agents "Read guardrails" (#guardrails), Developers "Get an API key" (#api-key). Updates has none (Book 1 §2.2 lists "–"); its hero links to #subscribe.
- Status chips follow Book 2 §7 (Live / In beta / Coming): roadmap entries on /updates show "Coming"; only illustrative endpoints and webhook events on /developers show "Planned".
- Forms: Developers uses `SmartForm type="interest"` (hidden `programme: snx-developers-api-key`, consent `contact`). Updates uses kit `NewsletterForm`.
- Endpoint paths, webhook event names and code samples on /developers are illustrative and marked "Planned". Replace them when v3 docs exist.
