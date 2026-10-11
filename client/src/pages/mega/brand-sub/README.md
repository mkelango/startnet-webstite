# Mega-menu group: brand-sub

Brand sub-pages that render inside `BrandLayout`. See `routes.js` (`MEGA_ROUTES`) for paths, brands and integration notes.

## Pages

| Path | File | Template | Notes |
|---|---|---|---|
| `/research/labs/:lab` (`agentic-ai`, `ontology-knowledge`, `physical-ai`, `drug-discovery`) | `ResearchLab.jsx` | T03 / T18 Lab detail | Charter table, focus areas with "Problem statements open [date placeholder]", who should apply, what you get, Night band of yearly Lab targets [C] with the stopping rule, interest form, sponsor block, other Labs, Wave 2 (proposed). Unknown `:lab` renders NotFound. |
| `/research\|vibe\|connect\|women/stories` | `BrandStories.jsx` | T15 | One shared template. The brand comes from the path (or a `brand` prop). Facets: type, plus district and year when there is more than one value. Load more, empty and error states. |
| `/research\|vibe\|connect\|women/events` | `BrandEvents.jsx` | T15 | One shared template. Series strip, Upcoming/Past toggle (`?when=past`), facets for district, format, language and price, a closest-match empty state (open events across StartNet) and a host band. |
| `/women/summit/awards` | `WomenAwards.jsx` | T04 | Context figure (tag A), categories and criteria (both marked proposed), the independent jury (placeholder), a timeline with placeholder dates, the nomination form, FAQ and a Night "Sponsor the Summit" band. |

Shared: `brandSubData.js` (all copy as `[en, ta]` pairs), `BrandSubParts.jsx/.css` (`useTp`, `useBrandKey`, `isPh`, `FacetChips`), `districts.js` (the 38 TN districts in English and Tamil).

## Data used
- `/api/stories?brand=<b>`: records with `placeholder: true` are never listed. When only placeholder slots exist, the empty state shows the placeholder.
- `/api/events?brand=<b>`: split into upcoming and past on the client. When a brand has nothing upcoming, the page also calls `/api/events?when=upcoming` to show the closest match.
- `/api/metrics?key=tn-women-led-startups`: the Awards context Stat, with the same record held locally as a fallback.
- `/api/events?brand=women&series=women-founders-summit`: the Summit `dateLabel` on the Awards page.
- Forms: `interest` (Lab: `lab`, `programme`, `source` hidden) and `nomination` (`category`, `district`, `message`, `nomineeName`, `nomineeCompany`).

## Sources
- Book 2 §3.1.1: Lab sub-heads, the individual Lab template, commitments, the stopping rule and Wave 2. All used verbatim.
- Book 2 §3.4: Summit & Awards copy, plus the "Who it's for" groups, which are used as the proposed categories.
- Book 2 §5.1: event microcopy, the archive line and the host band.
- Book 2 §14: Tamil CTAs.
- Book 1 Part B §2.2, §3.7, §7.4 and §10.

## Placeholders
- Lab host institution, spoke institutions, sponsors, Lab Director and venture lead.
- Problem statement open dates.
- Brand founder stories.
- The past-event archive.
- The final award categories.
- Jury members and the jury charter.
- All award timeline dates.
- The nomination and award dates in the FAQ.

## Integration
- Register each path as a **static child of its brand's BrandLayout** (`labs/:lab`, `stories`, `events`, `summit/awards`) so it is not caught by `:slug`.
- Remove `ConnectSub` `REDIRECTS` for `events` and `stories`.
- In `brands.js`, point `connect.subNav` "Events" to `/connect/events` and `women.subNav` "Stories" to `/women/stories`.
- In `nav.js`, Events › Series "Research Days" should point to `/research/events`.
- On `/research/labs`, link the Lab cards to `/research/labs/<slug>`.
- For the server sitemap and status: list the 4 Lab slugs plus the 9 static paths, all P2.
