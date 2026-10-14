# Hand-off: work in progress (13 October 2026)

Read this first in a new Claude session. Everything below is saved in this folder and is **not committed** (about 80 changed or new files; see `git status`).

## Done

1. **Home page sections**
   - "How it works" redesigned: sticky StartNet X profile card plus a step rail (`client/src/pages/home/FounderStory.*`).
   - "Why Tamil Nadu" photo: the Vibathon auditorium shot, `photos/originals/pool/vibereal/21.jpg`.
   - "On film" now shows the SaaS Connect 2025 video, playing 0:12–5:50 (`client/src/data/videos.js`; `VideoFeature` supports `end`).
2. **Site audit and fixes**
   - Smooth scrolling (Lenis) tuned and anchor links glide.
   - Fade-in "pop-in" glitch fixed on all pages (`client/src/components/Reveal.jsx`).
   - Link crawl: 0 broken links.
   - Server crash on malformed query strings fixed.
   - Layout fixes on `/women/hercapital`, `/insights` and `/startnet-x/pricing`.
   - Test scripts are in `tools/audit/agents/r4-*` and `r5-glitch`.
3. **StartNet inputs**: `docs/INPUTS_BY_PAGE.md` maps every item in `StartNet_Inputs_Needed_v2.pdf` to pages and files.
4. **Event content**
   - Research is in `docs/research/` (Connect series, Vibe events, NIRF and others).
   - Conflicting facts for StartNet to confirm are in `docs/research/CONFLICTS.md`.
   - Past editions enriched: GenAI Connect 2024, D2C Connect 2024, SaaS Connect 2025, Vibathon 2025, Vibe Marketing Summit 2025.
   - New pages: NIRF Higher Ed Summit 2024 (Salem and Coimbatore), Vibe Coding Summit 2025, 2023 network meetings and MegaPitching, StartNet launch 2023.
   - Upcoming events: Agentic AI Connect 2026 and Physical AI Connect 2027 replace the GenAI, SaaS and D2C Connect 2027 placeholders. The old URLs 301 to the series pages.
   - Vibe, Connect, Research and About pages updated to match. NIRF promo video added.
   - Checked: 91 event and brand pages in English and Tamil, 0 errors, 0 broken links.

## User decisions already made (keep them)

- Conflicting figures: show the lowest sourced figure, tag B, with source and date. Examples: D2C Connect 2024 650+, Vibathon 2025 prize pool ₹50,000.
- Vibathon 2025 winners are not named, only "KSRCE student teams".
- Photos may be downloaded only from posts by M K Elango or StartNet's own pages. Reposted images are linked, not copied. Flag group shots for consent.
- The Digital Politics Conclave is not listed until StartNet decides.

## Still to do

1. **LinkedIn pass (blocked until Claude in Chrome is connected).**
   - Read `linkedin.com/in/elangomk/recent-activity/all/` read-only in the user's signed-in Chrome.
   - Collect event posts (text, date, link, images) for GenAI, D2C and SaaS Connect, NIRF Summit, Vibe Coding Summit, Vibathon and Vibe Marketing Summit.
   - Add photos through the pipeline: `photos/originals/event/<series>/<edition>.jpg` plus a `.json` (alt, credit, source, owner), then `npm run photos`.
   - Update `docs/PHOTO_CREDITS.md` and `client/src/data/imagePlan.js`, and add any new sourced facts to `server/data/events.json`.
2. **Rebuild.** The prerender finished (440 pages), but the CSS fix below came after it. Run `npm run build` (client, server and prerender) before any production preview or deploy. Needs Chrome on the machine. Stop the dev servers first so the server build doesn't collide with `startnet-api`'s watch.
3. **Commit** when the user asks.

## Done in the second session (13 October 2026)

- Tablet fix in `client/src/styles/base.css`. At 768–1023px a set of exactly three cards runs as one row, and its third card is no longer turned horizontal. At 640–767px that set is still 2 + 1 with the wide third card.
- `/insights`: the 2 + 1 override is removed. The three report cards run 3-up, and their badges wrap at 768–1023px instead of clipping "Upcoming".
- Sweep: `tools/audit/agents/r6-tablet/grid3.mjs` ran every prerendered route at 700, 768, 900 and 1000px against Vite with 0 issues (page overflow, squeezed wide card, card content spilling). Re-injecting the old CSS showed the check catches the original bug.
- Claude in Chrome was still not connected, so the LinkedIn pass is still open.

## Done in the third session (13 October 2026): photographs everywhere

- The animated Canvas visuals are gone (`lib/motion-visuals/`, `MotionVisual.*` deleted). Every image slot shows a photo.
- 99 photos from the user's `StartNet Gallery` folder imported (`tools/images/gallery-import.mjs`, map in
  `photos/stock/gallery-map.json`): GenAI, D2C and SaaS Connect, NIRF Summit (Salem, Coimbatore), Vibe Coding Summit,
  Vibathon 2025, Vibe Marketing Summit, TNGSS booth, Connect meet-ups, core team, investors, Women.
- The 64 old stock photos (many not Indian) are replaced by 80 Unsplash photos of Indian people, by photographers in India
  (`photos/stock/picks.json`, `tools/images/stock-picks.mjs`).
- All photos are true grayscale (`INK` in `tools/images/photos.mjs`, video posters in `VideoFeature.css`).
- `imagePlan.js` rewritten (photo per slot); upcoming events show their closest past StartNet event, captioned with
  where it was taken (`SERIES_FAMILY` in `data/photos.js`). Women "Rising path" timeline and mega-menu use photos.
- Checked: 175 routes, 345 photos, 0 errors, no photo repeated on a page (`tools/audit/agents/r7-images/slots.mjs`).
- Credits regenerated: `docs/PHOTO_CREDITS.md` (`node tools/images/credits.mjs`).
- Open: group shots from the StartNet Gallery need StartNet's consent confirmation; photographer credits for the
  gallery are taken from the watermarks (Carnival Studios, Mesmerics Photography) or "StartNet". Rebuild before deploy.

## Done in the fourth session (14 October 2026)

- **Scroll after header/footer links fixed** (`layout/ScrollManager.jsx`, `lib/smoothScroll.js` `jumpTo` / `syncSmoothScroll`).
  Lenis kept the old page's position as its target, so the first wheel tick after a footer link ran the new page to its
  end; the top reset also ran after paint. Every jump now goes through Lenis, before paint. Checked: 41 footer + 129
  header links land at the top, a wheel moves 120 px, Back restores exactly, #section links dock.
- **Pricing compare table aligned** (`pages/snx/Pricing.css`): labels inset from the sheet, feature column not sticky
  on wide screens (its row lines drew a pixel off), ticks centred on the label line.
- **Careers: 7 open roles** in `server/data/careers.json` (Vibe campus, Connect events, partnerships, data/Ledger,
  StartNet X engineer, Women programme, Tamil/English content). StartNet must confirm each before launch: they publish
  Google JobPosting data and apply by email to careers@startnet.in. Restart the API to load them.
- **Founding team portraits live** (14 Oct 2026): `photos/originals/person/` `m-k-elango.png` (1254 px),
  `v-nagaraj.jpg` (335 px), `poonthamil.png` (1091 px), square crops in the sidecars, checked on /about/leadership.
  Still open: ask StartNet for a higher-resolution original of Nagaraj (his crop is 226 px, soft on large cards);
  replace the file, keep the name, run `npm run photos`.

- **Community startups on /insights/stories** (14 Oct 2026): "Companies our founders are building", 9 equal cards
  (16:9 logo tile, sector · place, one-liner, description, founder, founded, StartNet's part, site link), data in
  `client/src/data/startups.js`, component `pages/insights/StartupShowcase.*`. Logos: web copies in
  `client/public/logos/startups/`, originals and sources/open questions in `docs/research/startups/`. Before launch:
  StartNet to confirm each company agrees to be listed with its logo, and settle the open questions (KWIC founder,
  Dotzza's StartNet link, Divine Foods founder name).
- **Four-party model redesigned** (`pages/brands/research/components/FourParty.*`, /research): one panel split into
  four quadrants, the company on the crossing (≥1024), a "Holds" line per party (`holds` in `researchContent.js`).

- **Home hero v3** (14 Oct 2026, `pages/Home.jsx` HomeHero + `pages/Home.css`): live "Next" event pill (soonest
  confirmed upcoming event), headline, fixed lede typo ("help people with talent turn it into companies"), photo
  mosaic of three StartNet photos with caption chips (`HERO_TILES`), faint static pulli dot grid, and a proof strip of
  the community companies' logos (static row ≥1024, marquee below). Phones: copy first, then mosaic. Checked: 1440,
  820, 390, Tamil, no repeated photos on the page, no horizontal scroll.
- **Partner enquiry routing table** (`pages/partner/Partner.css`): even inner padding on the card, right-aligned
  "Reply within", rows vertically centred.

- **Partner hero photos swapped to StartNet's own** (14 Oct 2026, `client/src/data/imagePlan.js`): /partner/government →
  Umagine Chennai 2023 (`pool/connectreal/15`, caption corrected from "Imagine"), /partner/sponsors → D2C Connect 2024
  expo corridor (`event/d2c-connect/2024-5`), /partner/district-programme → KSRCE leaders with the StartNet team,
  Vibathon 2025 (`event/vibathon/2025-3`).

- **Home hero photo showcase** (14 Oct 2026, `pages/home/HeroShowcase.jsx`, styles in `pages/Home.css`): five
  categories (Summits, Campuses, Women, Research, Community), five StartNet photos each with short EN/TA captions.
  One tile crossfades every `TICK_MS` (1.6 s); after the set, the category moves on (~4.8 s each). Tabs with brand
  dot + progress line, pause button, pauses on hover/focus/off-screen/hidden tab; reduced motion = still. All 25
  photos are marked as taken on the page (hintFixedPhoto).

## Photo grade changed (14 October 2026)

- Every photo now uses a warm, faded monochrome fitted to four reference photos the user supplied (shadows neutral
  `#0A0A09`, mid-tones warm grey `#8B8781`, highlights cream `#F8F4E9`, 11% of the original colour kept). Table in
  `tools/images/photo-grade.json`, applied per pixel by `npm run photos` (all 209 photos regenerated). YouTube posters
  and thumbnails use the same grade as an SVG filter (`components/PhotoGradeFilter.jsx`, mounted in SiteLayout). The
  CSS grayscale on team portraits and How-we-work doors is removed (it cancelled the warmth). Logos stay grayscale.
  Checked against the references: mean difference 1.7–2.0 levels of 255. Not pushed: push `website main` to go live.

## WhatsApp number (14 October 2026)

- Every WhatsApp button and link now opens chat with +91 98848 98206 (`WHATSAPP_DEFAULT` = 919884898206 in
  `client/src/lib/links.js`; `VITE_WHATSAPP_NUMBER` still overrides it). The build warning now fires only if the
  variable is set to the old placeholder. Checked: 0 placeholder numbers in the build; /, /vibe/vibathon,
  /research/fellowship, /contact and /connect/saas all link to wa.me/919884898206. Not pushed yet.

## Running it

- `.claude/launch.json` has three entries: `startnet-api` (Nest watch, :4000), `startnet-vite` (:5173) and `startnet-start` (production build, :4000).
- Use `startnet-api` together with `startnet-vite` for development.
- `server/data/*.json` is read at startup, so restart the API after editing it.
