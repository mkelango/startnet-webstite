# about-districts (mega menu group)

## Pages built
| Route | File | Template | Phase |
|---|---|---|---|
| `/about/self-diagnosis` | `SelfDiagnosis.jsx` (+ `.css`) | T07 Report: hero/cover → sticky chapter bar with reading progress → 8/4 summary + "What we measure" with an "At a glance" KeyFacts aside → kill-criteria scorecard (the page's one Night band) → where we fall short → method → funding disclosure (its own band, after the method) → download (light gate) → related reports | P3 |
| `/districts/:district` ×38 | `DistrictPage.jsx` (+ `.css`), `DistrictLocator.jsx` (+ `.css`), `districtsData.js` | T20 District: hero (EN + Tamil names, HQ, SVG dot-locator inset) → M05 local events → Circles & Clubs + online programmes → signed partners only → M12 district Ledger slice (Night) → M04 "Host in your district" form → nearby districts + district picker | P3 |

Breadcrumbs: `Home › Who we are › Self-diagnosis report` and `Home › Who we are › Districts › <District>`.

## Data used
- `/api/reports/self-diagnosis-2027` (summary, statusLabel, formats), `/api/reports` (related cards)
- `/api/metrics?key=…`: founders-nurtured, startups-launched, capital-raised, pilots-signed, women-share, districts-active (B, null → placeholder) and the C-tagged targets women-floor-target, nurtured-target-mar-2027, districts-target-fy27
- `/api/events?when=upcoming&district=<English name>,<slug>,<HQ>`, `/api/events?when=upcoming&format=online`, `/api/programmes?format=online`
- `/api/ledger` → `byDistrict` row (matched by district/name; fields nurtured, launched, tag). Today `byDistrict` is `[]`, so these show placeholders.
- `/api/metrics?key=tn-startups-outside-top-3` (44% [A], DPIIT) on non-metro district pages
- `districtsData.js`: the 38 districts with official English and Tamil names, HQ town and approximate HQ lat/lon (used for the locator and the "nearby" list only, not shown as figures)
- Copy: Book 2 §2.4 (40% floor, district promise, self-diagnosis), §2.6 (stopping rules, bias audits, evidence committee), §3.3/§3.4 (Connect Circles, Women Circles), §3.2 (Vibe Clubs), §14.3 (Tamil CTAs)

## Placeholders
- Self-diagnosis: first edition date, every scorecard result and status, "where we fall short" findings, funding/sponsor disclosure, PDF files (EN/TA)
- District: StartNet status per district, Circles meeting in the district, signed local partners, district Ledger figures (nurtured, launched, events run)

## Forms
- Self-diagnosis download: `SmartForm type="interest"`, hidden `{ programme: 'self-diagnosis-2027', source: 'about-self-diagnosis' }`, extra field `purpose`, consent `contact` (required)
- District host: `SmartForm type="host"`, hidden `{ district: <English name>, source: 'district-page:<slug>' }`, consent `partner` (required)

## Integration notes
- Register `districts/:district` alongside the existing static `districts` route. It is not under any BrandLayout.
- Valid slugs = `DISTRICT_SLUGS` (38, from `districtsData.js`). Unknown slug → page renders `NotFound`.
- Alternative spellings (`trichy`, `tuticorin`, `kanyakumari`, `ooty`, `the-nilgiris`, `villupuram`, `thiruvallur`, `tirupattur`, `sivagangai`, `tirupur`, …; see `DISTRICT_ALIASES`) redirect client-side to the canonical slug. The server should either 301 them or let them through to the SPA, not 404 them.
- nav.js already lists `/about/self-diagnosis` and `/districts/chennai|coimbatore|madurai|tiruchirappalli` with `phase: 3, unpublished: true`. Remove the `unpublished` flag when publishing. Book 1 Part B P3 says a district page goes live only once that district has active programmes. If you want to gate that, publish a subset in the sitemap; the route itself serves all 38.
- The existing `/districts` index (pages/new/Districts.jsx) still says "District pages are coming". Once these are live, point its cards to `/districts/<slug>` (slug = lower-case English name; "The Nilgiris" → `nilgiris`).
- Bottom CTA for districts: "See events here" → `/events?district=<English name>` (the Events page filter uses district names).
- Sticky elements use `top: var(--shell-offset, var(--header-h))`.

## Review fixes (reviewer pass)
- DistrictPage: mixed-case slugs now redirect to the canonical lower-case URL; the context metric's label is translated; the Ledger slice wrapper is a `<div>` (a `<dl>` holding `<div><Stat/></div>` was invalid markup).
- DistrictLocator: the label goes on whichever side of the dot fits it, and the inset clips overflow, so long Tamil names (திருச்சிராப்பள்ளி) can't cause horizontal scroll at 320px.
- SelfDiagnosis: every metric `<Stat>` label now goes through `t()` (the API labels are English only; the fallback labels were English or raw keys); the report status line shows Tamil on /ta; the measures stats wrapper is a `<div>` rather than an invalid `<dl>`; the unused `snx-profiles-target-mar-2027` metric fetch was removed.
