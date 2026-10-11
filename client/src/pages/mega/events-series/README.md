# events-series: event series and edition pages

Book 1 Part B §2.2, Events rows: "Event series" (T04, P1), "Event edition" (T05, P1), "Agenda / speakers" (T05 tabs, P2).

## Files
| File | What it is |
|---|---|
| `EventsSlugDispatcher.jsx` | Element for the **existing** `events/:slug` route. A known series slug renders `SeriesPage`. Anything else renders the existing `../../events/EventDetail.jsx`. If the event lookup 404s but `/api/events?series=<slug>` has editions, it renders `SeriesPage`. |
| `SeriesPage.jsx/.css` | `/events/<series>` (T04). Contains: hero with endorsement line, about the series and its pillars, upcoming editions, past editions with tagged outcomes (the page's one Night band), series figures (FactBand), sponsor tiers summary plus host/co-host, a register-interest form (SmartForm `interest`), links to other series, and a next-edition CTA. |
| `EditionPage.jsx/.css` | `/events/<series>/<edition>`, `/agenda` and `/speakers` (T05). One component serves all three routes; the tab comes from the path suffix. Contains: hero (date, venue, district, format, price), Overview/Agenda/Speakers tabs as links, a sticky Key facts aside with Register (SNX), ICS or "Get the date on WhatsApp", sibling editions and a Night CTA. It also sets the bottom CTA through `usePageCta` and emits Event JSON-LD when the date is confirmed. |
| `seriesData.js` | Series content map (EN from Book 2, TA draft), edition-key helpers (`editionKeyOf`, `editionPath`, `findEdition`), `SERIES_SLUGS`. |
| `seriesParts.jsx/.css` | `useEventText()` (bilingual facet labels) and `EditionCard`, which links to the canonical edition URL. |
| `routes.js` | `MEGA_ROUTES` manifest. |

## Series slugs
`vibathon, vibe-campus, vibe-summit, genai-connect, saas-connect, d2c-connect, lab-to-market-summit, women-founders-summit, research-days, investors-summit, founders-day`, plus any `event.series` value found in `/api/events`.

## Edition keys
The edition key is the event slug with the `<series>-` prefix removed:
- `vibathon/2027` → `vibathon-2027`
- `vibathon/2027-district-qualifiers`
- `vibe-campus/build-nights-2026`
- `genai-connect/2024`, `d2c-connect/2024`, `saas-connect/2025` (the server 301s the old `genai-connect/archive`, `d2c-connect/archive`, `saas-connect/archive` URLs and their `-archive` forms to these), `investors-summit/archive`
- `lab-to-market-summit/2027`, `women-founders-summit/2027`, `vibe-summit/2027`, `genai-connect/2027`, `saas-connect/2027`, `d2c-connect/2027`

An unknown series/edition pair renders NotFound.

## Data used
- `GET /api/events?series=<key>` provides the editions. Outcomes come from the server's expansion of `outcomeIds`. The page also reads `sponsorTiers`, `timeline`, `tracks`, `prizes`, `faq` and `recapSlug`.
- `GET /api/metrics?key=…` provides series figures. Figures already shown against a past edition are not repeated.
- Shared helpers (imported, not edited): `pages/events/parts/eventMeta.js`, `eventTime.js` and `ics.js`, plus `layout/shell.jsx` (`usePageCta`).

## Placeholders shown
All placeholders render through the kit `Placeholder` component or `InlineMarks`:
- Research Days series description
- Connect "since [year placeholder]"
- Recap/outcomes for past editions
- Signed sponsors
- Directions/accessibility
- Joining details for online events
- Named speakers
- Session agenda (the Vibathon timeline is shown instead)
- Sponsor tiers for every series except Vibathon, which uses the planning rate card tagged C

## Integration notes
1. **Route collision:** point `events/:slug` (both `/` and `/ta` trees) at `EventsSlugDispatcher.jsx` instead of `EventDetail`. Keep the static `events/past`, `events/speak`, `events/host` and `events/founders-day` routes registered (the last two come from the `events-extra` group); static routes win over `:slug`. `founders-day` stays in `SERIES` only so the "More event series" strip can link to it; if the static route were missing, the dispatcher would render it as a "proposed" series.
2. Register `events/:series/:edition`, `events/:series/:edition/agenda` and `events/:series/:edition/speakers`, all pointing at `EditionPage.jsx`. They are not brand routes (`brand: null`), so they stay outside BrandLayout; the page sets `data-brand` itself.
3. **Canonical URLs (Book 1 §7.4):** `/events/<series>/<edition>` is canonical. Done here: `EventsSlugDispatcher` sends a flat `/events/<series>-<edition>` (any event with `series` set; all 14 today) to the nested URL with a client `<Navigate replace>`, keeping `/ta`, `?query` and `#hash`; `EditionPage` points canonical, `og:url` and the hreflang alternates of `/agenda` and `/speakers` at the edition URL, and the Event JSON-LD `url` is the edition URL. Done by the final verifier (2026-10-06): the server 301s the flat form (`RouteTable.redirectFor` in `server/src/common/routes.ts`, used by `spa.ts`), sitemap.xml leaves out the flat URLs and the `/agenda` and `/speakers` tabs, and `EventCard` plus every other internal event link use `eventPath(e)` (`components/_utils.js`). Optional: give `Seo.jsx` a `canonical` prop to replace the override effect. EditionPage, EditionCard and the series page read the `<field>Ta` event fields on /ta (`localizeEvent` in `seriesData.js`).
4. **Menu (Events ④):** the "replaces" values in `routes.js` (`menuOnly: true`) move the Events menu's Flagships/Series items to `/events/<series>`. Brand menus keep their evergreen links (`/vibe/vibathon` and others).
5. **Server 404s/sitemap:** valid `/events/:slug` = event slugs ∪ `SERIES_SLUGS` ∪ distinct `event.series`. Valid `/events/:series/:edition` = pairs derived from the events data as above.
6. Tab links append `#edition-tabs`, so ScrollManager keeps the reader at the tabs instead of jumping to the top.

## Review fixes (reviewer pass)
- Removed claims not in the books (Vibe Campus "most students meet StartNet first", "in Tamil or English", Vibe Summit "for students and sponsors", host-card and speak-card claims, the "prices exclude GST" fallback line); Research Days and unknown series show no status badge (status not given in the books).
- `lang` attributes now mark only English data values on /ta pages (dates, venues, price notes); translated labels are no longer tagged `lang="en"`.
- Register-interest form checks "email or mobile" on the client, matching the server's `interest` rule.
- Series page publishes no bottom CTA when there is no open edition (a same-page link is dropped by the bar), so the default CTA shows.
- Host button goes to `/events/host` (events-extra) for hostable series, otherwise to `/partner/enquire?ref=events-series-<key>`.
- Event JSON-LD never uses placeholder venue text; edition error state has breadcrumbs; WhatsApp prefill and the "TBC" date block are bilingual.
- Manifest: dropped the `events/founders-day` menu entry (owned by events-extra).
