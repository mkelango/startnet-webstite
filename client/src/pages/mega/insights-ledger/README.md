# insights-ledger

New P1 Insights pages. Nothing is wired yet: `routes.js` (`MEGA_ROUTES`) is the manifest for the integration step.

## Pages
| Route | File | Template | Surface |
|---|---|---|---|
| `/insights/founder-ledger/methodology` | `Methodology.jsx` | T19 (TOC aside + prose) | Paper with one Night panel (`#tags`) |
| `/insights/founder-ledger/:period` | `LedgerPeriod.jsx` | T08 (frozen snapshot) | Night throughout, like the live Ledger |
| `/insights/newsletter` | `Newsletter.jsx` | T16 sign-up + archive | Paper/white/sunken, no Night |

`ledgerShared.js` holds the bilingual ladder (L1–L7), the A/B/C tag text, the source types, the severities, the reality-check copy and the period slug helpers.

## Data
- `GET /api/ledger`: period, edition, publishedLabel, kpis, ladder, byBrand, byDistrict (+ note), outcomes (+ evidence), womenShare, corrections.
- `GET /api/programmes` and `GET /api/events?when=upcoming`: Newsletter sample issue only.
- Reuses `pages/insights/ledgerUtils.js` (normalisers, CSV) and `pages/insights/LedgerCharts.jsx` (ChartFigure, ColumnChart, BarChart, ChartLegend). These are imported, not edited.

## Copy sources
Book 2 §2.2 (ladder, attribution rule, verbatim), §2.4 (measures, tag meanings), §6.1/§6.2 (Ledger copy, reality check), footer newsletter strip, §13.2/§13.3 (newsletter and WhatsApp microcopy), §14.3 (Tamil CTAs). Book 1 Part A §8.2, §8.6; Part B §2.2, §7.1 rule 4, §8 (Metric.sourceType), §9.5. Book 3 §3.7 (Verified/Claimed/Estimate). The Tamil is a draft and needs native review (Book 2 §14).

## Placeholders
Method version and effective date · method change log · the list of "meaningful touchpoints" · the quarter-to-month mapping (financial-year quarters) · the newsletter frequency · each issue's subject line · the Ledger PDF · every Ledger figure (all `null` in the seed) · the first-edition date (from the API label).

## Integration notes
- Register `insights/founder-ledger/methodology` and `insights/founder-ledger/:period` beside the existing `insights/founder-ledger/corrections`. Static segments win in RR6. Server/sitemap: valid periods = lower-cased `period` (+ `periods[]`) from `/api/ledger`, today only `2026-q4`. Everything else is a 404.
- `/insights/founder-ledger/2026-Q4` redirects client-side to `2026-q4`.
- nav.js: "How we count" `/insights/founder-ledger#method` → `/insights/founder-ledger/methodology`. "Newsletter" and the featured-card CTA `/insights#insights-newsletter` → `/insights/newsletter` (CTA with `?topic=ledger`). "Past quarters" stays unpublished until a second period exists, or points to the period page.
- Optional: the live Ledger's Method block, `Stat` tag popovers and `/about/evidence-standard` can link to the methodology page.
- `/legal/privacy` and `/contact?topic=correction` are used as existing routes.
- Server: add `/insights/founder-ledger/methodology`, `/insights/newsletter` and the valid `/insights/founder-ledger/<period>` paths to the SPA route list in `server/src/common/spa.ts` (it already lists `/insights/founder-ledger/corrections`), so they return 200 and unknown periods return 404.
- The period page's bottom CTA follows Book 1 Part B §2.2 ("Download CSV"). The CSV is built in the browser from `/api/ledger`, so `bottomCta` is the in-page anchor `#downloads` (the edition bar).

## Review fixes (reviewer pass)
- Methodology: the desktop TOC is now actually sticky (the aside stretches to the row height). The tag cards use auto-fit columns, so long Tamil words no longer squeeze three columns at 768–1023 px. The specimen figures read `mission.target` and `womenShare.floor` from `/api/ledger`, falling back to the `ledgerUtils` constants. Short `[placeholder]`/`[date]` chips now carry the full placeholder text.
- LedgerPeriod: evidence types show proper bilingual labels (they used to show the raw `registry`/`self-reported` keys). The severity labels come from `ledgerShared`. The women floor heading and figure use `womenShare.floor`. The PDF placeholder chip wraps at 320 px. The corrections table has a wider minimum width inside its scroll container. The edition bar has `id="downloads"`.
- Newsletter: `lang="en"` is set only on English-only programme and event titles, so translated link labels are no longer mislabelled. Programme links use the canonical `url` (e.g. `/vibe/vibathon`). "Most first events are free." now matches Book 2 wording. The archive empty-state placeholder is fixed.
