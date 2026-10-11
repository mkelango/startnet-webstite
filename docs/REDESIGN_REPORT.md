# StartNet redesign: the AngelList family (8–9 Oct 2026)

**Brief (from the user):** restyle the StartNet site after angellist.com, usvc.com and meridian.angellist.com. Keep
the same content, tone the images to match the site, put the right image in each slot, and add event videos
(D2C Connect and others) where they fit.

## What changed

**The look.** Every page now follows one design language, documented in `docs/DESIGN.md` and implemented in
`client/src/styles/theme.css`:
- **Ink band:** the header, every hero, the brand sub-navigation, the phone menu and the footer are deep ink (#0C1719).
  The navigation is a centred pill group.
- **Sheets:** content sits on off-white sheets with large rounded tops that slide over the band and over each other.
- **Type:** headlines are Inter at regular weight with tight tracking. The first word of each hero headline is in
  Instrument Serif italic.
- **Labels:** "● Dot" labels replace the old uppercase eyebrows.
- **Buttons:** 4 px corners. Primary is ink (or paper on ink); secondary is a quiet fill; text links are ink with an
  arrow. Red is kept for "Join StartNet", the main call to action and the full stop.
- **Cards and lists:** flat cards with hairlines and a small brand dot; no coloured bars or heavy shadows. Numbers are
  big light numerals between thin dividers. FAQs, steps and ladders are hairline rows.
- **Footer:** ink, with a giant "StartNet." wordmark.

**Images.** All 102 photos are re-graded to one "paper-ink" tone (near black-and-white with a warm paper tint) so they
sit with the ink and paper palette. Event pages still show only photos of that exact event. Video posters use the same
grade.

**Videos (new).** Videos are YouTube embeds: nothing is downloaded, and nothing loads from YouTube until a visitor
presses play (privacy-enhanced player). Placement:

| Where | Video |
|---|---|
| Home ("Inside the room at D2C Connect 2024", on an ink band) | D2C Connect 2024 aftermovie (StartNet's D2C Connect channel) |
| /connect/d2c, /events/d2c-connect, /events/d2c-connect/2024 | the aftermovie + a ClickPost sponsor session filmed at the event |
| /connect/genai, /events/genai-connect, /events/genai-connect/2024 | GenAI Connect 2024 coverage (Iconxt Stories, media partner) |
| /events/past | both event films |
| /about (History) | StartNet launch event, July 2023 (StartNet's channel) |
| /about/leadership | M K Elango interview (StartupTN) |

There is no public video of SaaS Connect 2025, Vibathon 2025, Vibe Marketing Summit or Vibe at TNGSS. Those pages
keep their photos. See `docs/VIDEOS.md`.

**Pages.**
- **Home:** persona list, proof band, four doors, story, Mission, Why Tamil Nadu, Updates, Partner, FAQ and the closing
  band are all restyled.
- **Brand pages:** /brands, Research, Vibe and Vibathon, Connect, Women, and every brand sub-page.
- **Events and programmes:** the event index, calendar, past events, series and edition pages, host, Founders Day,
  the programmes finder and programme detail.
- **Everything else:** about, leadership, governance, insights, the Founder Ledger, reports, districts, join, StartNet
  X, partner, contact, media, careers, legal, search and 404.

Copy, data, links, the order of information and behaviour are unchanged everywhere.

## Decisions made without you (easy to reverse)

1. **Photo tone:** paper-ink monochrome. Colour comes from the accents, as on the reference sites.
2. **Heroes:** every page hero is ink; the closing call-to-action bands are paper sheets.
3. **Link colour:** text links are ink and red is reserved for conversion. On brand pages, links use the brand accent.
4. **Serif accent:** the first word of each hero headline is set in the serif italic. Tamil headlines stay in their
   own font.
5. **Brand textures:** the faint "pulli" dot texture on night bands is kept as a brand signature.
6. **Third-party videos:** the ClickPost, Iconxt Stories and StartupTN videos are used with a credit link to the
   channel, because each shows a StartNet event or the founder.
7. **Accessibility tweaks:** the red full stop beside small headings is one step darker. Form field borders are darker
   so they meet the 3:1 contrast rule.

## What StartNet can still send

- Highlight videos (any length) for SaaS Connect 2025, Vibathon 2025, Vibe Marketing Summit, and Vibe at TNGSS 2025.
  Upload them to YouTube and add one line each to `client/src/data/videos.js`.
- Speaker or session names for the February 2024 CJ Pallazzio talks on the startnet india channel. They could then go
  on an archive page.
- Whether @startnetresearch on YouTube is StartNet's channel (it has a NIRF Higher Ed Summit 2024 promo).
- The other open items in `docs/AUDIT_REPORT.md` ("Needs StartNet") are unchanged.

## How it was checked (9 Oct 2026, production build)

- **Builds:** the client build (`vite build`) and the server build (`nest build`) are clean.
- **Snapshots:** all 418 prerendered pages, 0 failures. The SEO lint found 0 issues, 0 duplicate titles and 0
  duplicate descriptions.
- **English pages (all 209), at 1440 and 375 px:** no horizontal overflow, one h1, no console or page errors, no broken
  images.
- **Repeated photos:** the check first found repeats on 8 pages (cards of one series sharing a photo, and a poster
  repeated in its gallery). This is fixed in shared code (`photoPool`, `EventGallery exclude`) and rechecked: 0 repeats.
- **Tamil pages at 375 px and a 60-page sample at 768 / 1024 px:** no overflow, no errors.
  - A few pages were flagged with "2 × h1" because the parallel check caught the snapshot-to-app hand-over mid-swap.
    Rechecked one at a time, each has exactly one h1.
- **Snapshot hand-over** (/, /about, /vibe, an edition page, the Ledger, /ta, /ta/events): it swaps cleanly with no
  errors, and the video posters are in the snapshots.
- **Video player:** no request goes to YouTube before play. Pressing play loads
  `youtube-nocookie.com/embed/<id>?autoplay=1`. In production the CSP allows exactly `i.ytimg.com` (posters) and
  `www.youtube-nocookie.com` (player); checked on a production-mode server.
- **Page agents' own checks:** each page agent also clicked through its interactive parts:
  - the persona selector;
  - filters, the calendar and tabs;
  - the Vibathon track picker and the Founder Switch;
  - the join steps and the self-diagnosis;
  - the pricing toggle and the forms.

Not changed (and why): D2C Connect and GenAI Connect still have no event *photos* in the library (none were found),
so their cards keep the brand art; their films now cover them on their pages. The `/districts` copy still says
"District pages are coming" (a copy change, left for StartNet).
