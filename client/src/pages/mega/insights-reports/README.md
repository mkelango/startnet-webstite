# insights-reports (mega menu group)

## Pages
| Path | File | Template | Phase |
|---|---|---|---|
| `/insights/reports/:slug` | `ReportDetail.jsx` | T07 report: hero with cover art, then an 8/4 layout with a sticky chapter nav and reading progress. Sections run Summary, Key findings, Chapters, Methodology, a separate sponsor-disclosure band, then Download or Notify, then Related reports | P2 |
| `/insights/indices` | `Indices.jsx` | Indices hub on Paper, with one Night band for the method rules | P3 |
| `/insights/indices/:index` | `IndexDetail.jsx` | T07 index on the Night evidence surface: chapter nav, what it measures, method, publication timeline, score table (placeholders), then a Paper sign-up | P3 |
| `/insights/podcast` | `Podcast.jsx` | Podcast landing: subscribe links, episodes filtered by language, suggest a guest, notify | P3 |

Files used only inside this folder: `ChapterNav.jsx/.css` (T07 chapter nav, mobile disclosure, scroll-spy, progress bar), `NotifyForm.jsx` (SmartForm `interest`), `shared.js` (index slug map, `reportPath()`, tag rules), `indexContent.js` (index copy).

## Data
- `GET /api/reports`: `ReportDetail` looks up the slug. An unknown slug renders `NotFound`. A report with `status: 'upcoming'` shows "Coming <year>" with a notify form. A published report shows key findings (`keyFindings` through `<Stat>`) and downloads with format, size and language. Downloads sit behind a light gate (name, email, organisation, purpose, consent) unless `gate: 'none'`; an unlocked gate is remembered in sessionStorage.
- `GET /api/metrics`: public context figures with A tags (DPIIT, AISHE), each labelled "not findings".
- `GET /api/stories?type=podcast`: podcast episodes. This is empty today, so the page shows an empty state.
- Forms: `POST /api/forms/interest` with `programme` set to `report:<slug>`, `report-download:<slug>`, `index:<slug>`, `indices` or `podcast`.

## Copy sources
- Book 2 §6.3: TN Founder Report text used verbatim (sub-head, pre-launch body, survey CTA, chapters, sponsor line, "Request a briefing").
- Book 2 §6.1: the "Planned. We'll publish the method before the first edition." microcopy.
- Book 2 §4: Institution Partner Programme and Lab-to-Market Summit lines for the indices.
- Book 2 §6.2: tag definitions.

All strings use `t(en, ta)`. API summaries are English only and are marked `lang="en"` on `/ta` pages.

## Placeholders
- Report dates, method text, file links and sizes, survey link, sponsor name.
- Index indicators and weights, method date, all scores.
- Podcast subscribe links and episodes.

The Founder Readiness Index has no scope in the books, so its "What's measured" section is a placeholder.

## Integration notes
- **Index slugs:** the route slug `research-commercialisation-index` maps to `tn-research-commercialisation-index` in `/api/reports`. The other two index slugs are the same in both places.
- **Redirects:** `ReportDetail` uses `<Navigate replace>` for the `founder-ledger` slug (to `/insights/founder-ledger`) and for the three index slugs (to `/insights/indices/<index>`). The server should send 301s for these too.
- **Report URLs:** in `reports.json`, the `url` of each kind-`report` record (currently `/insights/reports#<slug>`) should become `/insights/reports/<slug>`, and each index should become `/insights/indices/<index>`. The dynamic "Reports & indices" menu column then links correctly. ReportCards on these pages already use `reportPath()`.
- **Menu:** add "Indices" to the Insights mega menu "Reports & indices" column, and drop `unpublished: true` from `/insights/podcast` in nav.js.
- **Route order:** register `insights/indices` before `insights/indices/:index`. `insights/reports/:slug` does not clash with the existing static `insights/reports`.
- **Not built:** podcast episode pages (T09). StoryCard links go to `/insights/stories/<slug>`.
- **Self-diagnosis report:** `self-diagnosis-2027` in `reports.json` points to `/insights/reports#reports-newsletter`; it also resolves at `/insights/reports/self-diagnosis-2027`. Decide which URL is canonical.
- **StoryCard and podcast type:** the kit `StoryCard` has no label for `type: 'podcast'`, so podcast episodes would show the raw word "podcast" as the type chip. Add `podcast: ['Podcast', 'பாட்காஸ்ட்']` to its TYPE map when episodes ship.

## Review fixes (reviewer pass)
- Key facts moved out of the chapter-nav `<nav>` landmark, and the outer aside wrapper is now a `<div>`, so the page has no nested complementary landmarks.
- Report error state now has Breadcrumbs. The SEO title and description for the TN Founder Report, and the Indices and Podcast meta descriptions, now go through `t()`.
- TN Founder Report chapters (Book 2 §6.3) now have Tamil. "Planned" status labels are translated on `/ta`. The "Planned" label is no longer shown twice on index cards.
- Report pages no longer repeat the API summary under the hero lede, or print the §6.1 "Planned…" line twice.
- Sector reports: replaced "From the community: X Connect → /connect/series" (the books don't say who makes these reports) with "Related community" links to `/connect/saas`, `/connect/genai` and `/connect/d2c`.
- Podcast "Suggest a guest" now goes to `/contact?topic=media`, a topic the Contact page recognises. The Tamil/English badges carry `lang`.
