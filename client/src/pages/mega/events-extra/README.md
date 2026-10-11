# events-extra

## Pages
- `/events/host` → `HostEvent.jsx` (T19 standard page with a sticky in-page nav on desktop, plus a T13 form, P2). Covers who can host, formats (Vibe Campus, Vibathon district qualifier, sector Connect meet-up, Research Day, Women Circle, district edition), what StartNet provides and what the host brings, the target figures (FactBand), 5 steps, the enquiry form (`SmartForm type="host"`), FAQ, and a Night CTA band.
- `/events/founders-day` → `FoundersDay.jsx` (T04 event series, P3, status "Planned"). Has a Night campaign hero (the page's one Night band), about section and KeyFacts with placeholders, four brand "rooms", editions from the API, the register-interest form (`SmartForm type="interest"`, hidden `programme: 'founders-day'`), a sponsor summary, FAQ and a CTA to /events.
- `districts.js`: the 38 TN districts (EN/TA) plus `districtOptions(t)` for the select fields.

## Data
- `GET /api/metrics`: `vibathon-2027-host-colleges-target` (20, C), `districts-target-fy27` (5, C) and `events-run` (null, so it renders as a placeholder). Labels are re-localised on the page.
- `GET /api/events?series=founders-day` returns no editions yet, so the page shows the "Dates soon" empty state.
- Copy comes from Book 2 §5.1 (host band, hub sub-head), §3 Vibe Campus/Clubs, Connect series, §8 Institutions/Government/Sponsors, and Book 1 §2.2, the co-host kit, the co-host credit rule and the §9.3 routing. Tamil strings are drafts and need native review (Book 2 §14).

## Placeholders
- Host page: reply-time SLA, the host/partner rate card, and the `events-run` count.
- Founders Day: date, venue, entry/pricing, language, the day's programme, the first-edition city/venue, and signed sponsors.

## Integration notes
- Register `events/host` and `events/founders-day` **before** `events/:slug` in App.jsx. Neither page needs BrandLayout.
- nav.js: replace the `/events#host` target with `/events/host`. Founders Day is already `/events/founders-day` (phase 3, `unpublished: true`), so integration decides whether to publish it.
- Events.jsx has its own inline `#host` form. Optionally point its "Host an event" buttons at `/events/host`. `FLAGSHIPS` in `pages/events/parts/eventMeta.js` could also get `to: '/events/founders-day'`.
- Anchors: `#host-form` (host enquiry) and `#fday-interest` (Founders Day interest).

## Review fixes
- Host form: `message` is now required, because the server's `host` rule requires it. Before this, a submission without a message got a 400 error. The reply-time success line uses a `<Placeholder>` chip instead of plain bracket text.
- Founders Day form: email or mobile is enough, which matches the server's `interest` oneOf rule. The page intro already said so, but the form had forced email.
- WhatsApp consent labels tell people to add a mobile number. Without one, the server rejects `whatsapp_updates`.
- Removed copy about Women Circles meeting "online, often on weekends", which no source supports. The format card is now "Women Circle".
- The WhatsApp prefill message is localised. Metrics are fetched with `?key=` for only the three figures the page uses.
- Removed `scroll-margin-top`, which doubled the anchor offset already set by `html { scroll-padding-top }`. Founders Day brand cards no longer lift on hover, because the card itself is not a link.
