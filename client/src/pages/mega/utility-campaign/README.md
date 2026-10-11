# mega / utility-campaign

## Pages
| Route | File | Template | Notes |
|---|---|---|---|
| `/signin` | `SignIn.jsx` → `SnxHandoff.jsx` | redirect | `window.location.replace(snxLink('/login', {src, lang, return, …}))` + fallback button, "Taking you to StartNet X…" and a 4 s "still here?" hint |
| `/signup` | `SignUp.jsx` → `SnxHandoff.jsx` | redirect | Same, to `/signup`; passes `persona`, `intent`, `brand`, `utm_*` from the query (Book 1 §9.4) |
| `/go/:slug` | `CampaignLanding.jsx` | T16 | Night campaign hero (C13: countdown, one CTA, microcopy) → 3 benefits → tracks → key dates → prizes/what next → M12 proof (FactBand) → FAQ → M04 CTA band (CTA + WhatsApp) |

Support files: `campaigns.js` (content map + `getCampaign`, `campaignCtaHref`, `campaignBottomCta`, `utmFrom`, `CAMPAIGN_SLUGS`), `useNoindex.js`, `routes.js` (manifest).

## Data and copy
- Campaign `vibathon-2027`: Book 2 §5.2 (Vibathon 2027: sub-head, microcopy, What it is, tracks, timeline, prizes, FAQ). Closing headline reuses the §5.2 sub-head's first clause ("Build something people use, with AI."); §3.2's "Your first step is free." was dropped because registration may cost up to ₹499 per team. Closing-band body and the "Vibathon so far" proof title are our own copy (needs StartNet sign-off). Tamil CTAs from Book 2 §14.3; other Tamil lines (incl. Tamil overrides for the English-only `/api/metrics` labels in `proof.text`) are drafts pending native review.
- Metrics: `GET /api/metrics?key=vibathon-2025-tier-3-4-colleges,vibathon-2025-participants,vibathon-2027-host-colleges-target,vibathon-2027-participants-target,vibathon-2025-prize-pool`, with Book 2 fallbacks (80% Tier 3/4 [B]; 2025 participants placeholder) if the API fails.
- CTA: `x.startnet.in/events/vibathon-2027/register?src=go-vibathon-2027&brand=vibe&lang=…` + forwarded `utm_*` (same SNX path as `/vibe/vibathon`). WhatsApp: `waLink('VIBATHON', 'go-vibathon-2027, <lang>')`.

## Placeholders (to be supplied by StartNet)
Registration open/close dates (`deadline` in `campaigns.js`; countdown shows a placeholder until set), all timeline dates, team size [confirm], final fee, sprint format, number of districts, finale venue, 2027 track list/partners, GCC sponsors, prize pool, seed-support terms, graduate eligibility, fee waivers. No sponsor/jury section is rendered (signed-only rule; no campaign sponsor data exists).

## Integration notes
- `/signin`, `/signup`, `/go` are reserved roots (Book 1 Part B §6.4). Register them outside BrandLayout; mirror under `/ta`.
- `/go/:slug`: use the minimal header variant and no breadcrumbs (Book 1 §3.7). Server: 404 unknown slugs (`CAMPAIGN_SLUGS`), send `X-Robots-Tag: noindex` for `/go/*`, `/signin`, `/signup`, and keep them out of the sitemap.
- Bottom CTA bar on `/go/:slug`: `campaignBottomCta(slug, lang, search)` returns `{ label, href }` with the same `utm_*` as the hero CTA. Pass `useLocation().search` as `search` (if omitted, `window.location.search` is read).
- To add a campaign, add a record to `CAMPAIGNS` (shape documented at the top of `campaigns.js`) **and** add its slug to `slugs` in `routes.js` (a literal there, so the manifest loads in Node without Vite's `import.meta.env`).
