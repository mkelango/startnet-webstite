# Secondary references: Surge (Peak XV) and Antler

Status: research note for the StartNet redesign. Main look = Plug and Play. Sizing = Techstars. This file covers only what to borrow from **surge.peakxv.com** and **antler.co**, and what to leave behind.
Captured 2026-11-05 from the live HTML and the Webflow CSS bundles (`surge-peakxv.webflow.shared.93824f430.min.css`, `antler-lumos.shared.c762413d2.min.css`). 1rem = 16px throughout.

Pages studied:
- Surge: `/` (home), `/futurefoundersfellowship` (programme page), `/companies` (portfolio index)
- Antler: `/` (home), `/location/india` (city/country page), `/founder-stories` (story index)

---

## 1. What each site is, in one line

| | Surge (Peak XV) | Antler |
|---|---|---|
| Role for StartNet | Cohort-programme storytelling, stats, closing CTA | Location pages, founder-story cards, serif-italic accent word, residency terms |
| Fonts | "Cards Normal" (body), "Cards Compact" (headings), DM Mono (tags) | Satoshi 400/500 (primary), **Nib Pro Light italic** (accent word in `<em>`) |
| Palette | Navy #000033, off-white #FAF9F6, purple #8039FF accent, fire #FF6A45 | Dark #0C1F21, light #F9F7F5 / #F0EBE6, mint #BADED8, red #ED4746 |
| Container | 1440 / 1024 / 768px, 920px "content aligner", side padding 3% | 1440 (main) / 1200 / 960px, side margin clamp(16px → 40px) |
| Radius | 2px buttons, 4px / 8px cards | 3px buttons, 8px cards, pill 100vw for round icon buttons |
| Motion | GSAP 3.15 + ScrollTrigger + SplitText + ScrambleText, odometer counters, HLS hero video | Swiper 8 carousels, CSS marquees (160s linear), fade-in hero |

Important finding: **Antler's palette is almost StartNet's**. Antler dark #0C1F21 vs StartNet Ink #0C1719; Antler light #F9F7F5 vs Paper #F4F3EF; Antler red #ED4746 vs SNX Red #EF4444; Antler also uses one serif-italic word inside a sans headline. Antler is therefore the best proof of how StartNet's own tokens look on a VC/founder site, and also the clearest warning about overusing red (see section 4).

---

## 2. Measured values worth reusing

### 2.1 Surge (fixed rem, stepped at breakpoints)

| Token | Desktop | Tablet/mobile step | Used for |
|---|---|---|---|
| `heading-style-title1` | 72px / lh 1.0 / wt 300 | 76px at one step | Home hero H1 |
| `heading-style-title2` | clamp(0, 7vw, 96px) / 1.0 / 300 | 64px | Programme hero |
| `heading-style-title3` | 104px / 1.0 / 300 | 72px | Closing CTA "Are you one of the 0.4%?" |
| `heading-style-h1` | 64px / 1.0 / 300 | 56px | Page H1 |
| `heading-style-h2` | 56px / 1.1 / 300 | 44px, 48px | Section titles |
| `heading-style-h3` | 44px / 1.1 / 300 | — | |
| `heading-style-h4` | 40px / 1.05 / 400 | 32px | Card and sub-section titles |
| `heading-style-h5` | 24px / 1.2 / 700 | 20px | |
| Body | 16px / 1.4 / 400 | — | |
| `text-size-medium` | 18px / 1.3 | 16px | Section intros |
| `text-size-large` | 20px / 1.4 | 18px | Hero subline |
| `text-size-tiny` | 12px / 1.35 | — | Tags |
| `stats_number` | clamp(0, 6vw, 96px) / 1.0 / wt 900, accent colour | — | Stats band |
| `gallery-stats_number` | 96px / 1.0 / 700, label 24px / 400 | — | "170+ Companies / 400+ Founders" |
| Section padding | small 48px, medium 64px, regular 80px (56px mobile), large 112px (96px tablet) | — | Section rhythm |
| Page header padding | 160px top / 32px bottom (128px / 48px tablet, 112px mobile) | — | Inner-page hero |
| Nav | height 81.6px, logo height 50px, link gap 24px, link opacity 0.8 | — | |
| Button | 12px 24px padding, radius 2px, 1px border, transition all 0.32s cubic-bezier(.165,.84,.44,1) | — | Primary |
| Tertiary button | 0 horizontal padding, 4px vertical, 2px bottom border #E8E5E0, 18px | 16px | "See more" text links |

### 2.2 Antler (fluid clamp between 320px and 1440px viewport)

| Token | Min (320px) → Max (1440px) | Line-height |
|---|---|---|
| `home-hero-heading` | 48px → 88px | 1.0–1.15 |
| `display` | 32px → 72px | 1.15 |
| `h1` | 32px → 56px | 1.15 |
| `h2` | 26.4px → 48px | 1.15 |
| `h3` | 24px → 40px | 1.15 |
| `h4` | 24px → 32px | 1.3 |
| `h5` | 20px → 24px | 1.3 |
| `h6` / `text-large` | 16px → 17.84px | 1.4 |
| `text-main` | 16px | 1.4 |
| `text-small` | 14px | 1.4 |
| Letter-spacing on headings | −0.03em ("tight") | |
| Section space main / large / small | 48→64px / 64→100px / 32→48px | |
| Page-top space (inner hero) | 148→160px | |
| Spacing steps `space-1…8` | 6→8, 10→12, 14→16, 16→24, 24→32, 28→40, 32→48, 36→64px | |
| Site margin / gutter / columns | 16→40px / 16px / 12 | |
| Border width | 1.5px (0.094rem) | |
| Button | 14px 18px padding, radius 3px, transitions 0.2s on colour/border/background | |
| Round icon button (`button_arrow_wrap`) | 48px circle, icon 36% of width | |

Both sites agree with Techstars-style sizing on: 1440px max container, 16px body, H2 around 48–56px, 64–112px section padding. Use the Techstars file for the final numbers; use these only as a cross-check.

---

## 3. Ideas to borrow, and where they go on StartNet

Each idea lists the source, the exact pattern, and the StartNet page/component it maps to. Component names are the ones already in `client/src/components` and `client/src/pages`.

### 3.1 Hero treatments

**A. Full-bleed photo/video hero with bottom-left text block (Surge `section_home-header`)**
- Pattern: `min-height: 100svh; max-height: 960px`; content pinned bottom-left (`align-items: flex-end`), padding 100px top and bottom, text column max-width 576px; black overlay at 40% opacity over a looping HLS video; single "Apply" button.
- StartNet fit: **Home** `HeroShowcase.jsx` alternative frame, and **StartNet X** hero. Use a StartNet Gallery event photo or a short event clip in the warm faded mono grade (`PhotoGradeFilter.jsx`) instead of colour video. Overlay should be Ink #0C1719 at 40–50%, not pure black.
- Adjust: Plug and Play's hero is the master. Use this only if the Plug and Play pattern needs a video variant. Keep the text block at 576px wide max so the photo stays visible.

**B. Headline with one emphasised phrase (Surge "Where **audacious founders** find their **Surge**.") and Antler's em-dash plus serif-italic word ("Further —*Faster*")**
- Antler CSS: `em { font-family: "Nib Pro"; font-weight: 300; display: inline-block; margin-bottom: -.1em }`. The em dash sits before the italic word.
- StartNet fit: every hero via `KineticHeadline.jsx` and `_accent.jsx`. This is exactly StartNet's rule of one Instrument Serif Italic word. Borrow Antler's mechanics: the accent word is wrapped in `<em>`, styled globally, with a −0.1em bottom-margin correction so the serif baseline matches Inter. Borrow the em-dash lead-in for short two-word headlines, for example "Founders —*made here*." on Home or "Research —*on the record*." on the Research hub.
- Do not use two emphasised phrases like Surge does. Use one serif word per headline.

**C. Hero with a horizontal founder-card carousel underneath (Antler `hero_slider`)**
- Pattern: headline + CTA top-left, then a Swiper row of portrait cards: card width 352px (`22rem`), min-height 512px, image aspect-ratio 2 / 3.5, company logo absolutely placed top-left 16px inset at max-width 128px, overflow visible so cards bleed past the container edge; 48px round prev/next buttons.
- StartNet fit: **Programmes** index hero (each card = one programme cohort founder) and **Insights → Stories** hero. Build it on `Scroller.jsx` with `StoryCard.jsx` in a "portrait" variant. Photos must be real Tamil Nadu founders in the mono grade, with logos on a Paper chip.

### 3.2 Programmes and cohorts

**D. Programme page with an in-page sticky sub-nav (Surge Future Founders Fellowship)**
- Section order as observed: Hero ("Future Founders Fellowship" + tagline) → Charter (what it is, "Eight weeks embedded…") → Companies you could work with (logo grid) → What you get (4 benefits) → Who is this for (eligibility list) → Who we're looking for (traits) → How it works (5 steps: Apply, Shortlist, Conversations, Offer, The summer) → Calendar (month-by-month list) → FAQs (3) → Closing CTA "Find your Surge early".
- Sub-nav items: Program details, Companies, What you get, How it works, Calendar, FAQs.
- StartNet fit: **`ProgrammeDetail.jsx`**. Use `PillSubNav.jsx` as the sticky anchor bar (Overview, Who it's for, What you get, How it works, Dates, FAQs). Map the sections to the existing components: `KeyFacts.jsx` (duration, format, city, cost), `Steps.jsx` for the selection steps, `PulliTimeline.jsx` for the calendar, `Accordion.jsx` for FAQs, `CTABand.jsx` to close.
- Borrow the calendar format: month label in mono/uppercase small (12px) on the left, one-line event on the right, one row per milestone. StartNet should go further and give an exact date where it has one, because Surge shows only "AUG 2026: Applications close".

**E. Residency "terms sheet" block (Antler India)**
- Antler lists hard terms in one block: cheque size (INR 4Cr for 11%), follow-on (up to $30M), decision window (3 weeks), in-person weeks (2 in Bengaluru), stipend/grant (INR 2L), perks ($1M+), backing rate (60%+). Then the FAQ repeats the terms.
- StartNet fit: **ProgrammeDetail** "What you get" and **StartNet X** `Pricing.jsx` / `Modules.jsx`. Present as a `FactBand.jsx` row of 4–6 facts, each with a number (Inter 500, 40–48px) and a label of 14px or less.
- Warning: Antler's own page contradicts itself (INR 4Cr ≈ $470K in the body, about $425K in the FAQ; 60%+ vs 50–75%). Keep a single source of truth in `client/src/data` and render both the fact band and the FAQ from it.

**F. Featured-cohort block on the portfolio index (Surge "Surge 12, 18 startups, Meet Surge 12")**
- Pattern: before the full directory, one highlighted cohort with its count, a "Meet …" button and a card grid. Each card shows image, company name, founder names and sector tags. Stealth companies show sector only.
- StartNet fit: **Insights → `StartupShowcase.jsx`** and **Programmes** index. Top block: "Current cohort: Pulli 2026 · 24 startups" with `ProgrammeCard`-style cards. Below: the full directory.
- Borrow the toggle labels "Current cohort" / "All startups" as two `Tabs.jsx` tabs, and the sector chip list with "View less" collapse (`TagChip.jsx`). Add the two filters Surge lacks that matter for StartNet: **District** and **Programme/brand**.

**G. Two-audience split cards (Antler "AI founders" / "For investors"; "Pre-seed" / "Series A and beyond")**
- Pattern: two equal cards side by side, each with a heading, two lines of copy and an arrow link or "Pitch us" button.
- StartNet fit: **Home** below the hero, as a lighter version of `PersonaSelector.jsx`: "I'm building a startup" / "I want to back founders" (partner). Also on **Partner** (`Partner.jsx`): "Corporates" / "Government and institutions".

### 3.3 Portfolio and founder showcases

**H. Founder-story card (Antler `founder-story_card`)**
- Pattern: thumbnail aspect-ratio 3 / 2, radius 8px, overflow hidden; company logo on a white chip (padding 10–12px, radius 8px, max-width 112px, logo max-height 52px) placed bottom-right with 16px inset; below it the company name as H3 with a 48px round arrow button on the right; one or two lines of blurb. Grid uses `repeat(auto-fill, minmax(min(max(23rem, …), 100%), 1fr))`, column gap 24→32px, row gap 36→64px.
- StartNet fit: **Insights → `Stories.jsx`**, `StoryCard.jsx`, **Home → `FounderStory.jsx`** rail, and the "Founders from this district" strip on **Districts**. Logo chip in Paper #F4F3EF instead of white. The arrow button should be an Ink outline circle. Only the one CTA in the whole composition may use SNX Red.
- Add what Antler leaves out: district and sector as a 12px meta line ("Madurai · AgriTech"). Antler's index has no filters, and StartNet needs them.

**I. Portfolio card with one-sentence description + "Read more" (Surge home, 15 cards)**
- Pattern: logo (light and dark variants), one sentence, a text link. Grid of 15 with "See more" to the index.
- StartNet fit: **Home** "Startups from the network" section and **brand hubs** (each hub shows its own 6–9 companies). Use `LogoWall.jsx` for logos only, `Card.jsx` for logo + sentence.

**J. Continuous logo strip (Antler hero and logo band; Surge client logos)**
- StartNet fit: **Home** below the hero, **Partner → `OurPartners.jsx`**, and the "Our founders went on to raise from" strip on programme pages (copy Antler India's follow-on investor strip). Use `Marquee.jsx`. Logos in Ink mono at 60% opacity, 32–40px tall. No colour logos.

### 3.4 Stats

**K. Four-column stats band with dividers and counters (Surge `stats_list`)**
- Pattern: heading "Where early belief compounds." then a 4-column grid, margin-top 80px / bottom 64px, each item separated by a 1px right border (#E8E5E0), number then label, numbers counted up with an odometer-style roller (GSAP, triggered at `top 80%`).
- Stats shown: $1B+ revenue of top 10, $3B+ follow-on, 95 NPS, 17+ nationalities.
- StartNet fit: **Home** `MissionMeter.jsx` / `Stat.jsx` band, **About**, **brand hubs** (3–4 hub-specific numbers). Use Inter 500 at 56–64px for numbers, not Surge's weight 900. Use Ink for the numbers, not an accent colour. The 1px dividers should use an Ink tint at 12%.
- Borrow the **roller counter**, digits rolling vertically in masked slots, as a single reusable `Stat` behaviour. Respect `prefers-reduced-motion`.

**L. Left-rule stat (Antler `stat_wrap`)**
- Pattern: 2px left border in text colour, 16→24px left padding, number above label, 2,000+ / 12,000+ / 26.
- StartNet fit: small stats inside text sections (`KeyFacts.jsx`), on **Districts** pages and in **Insights → Reports** (`ReportCard.jsx`). It is quieter than the Surge band, so use it when the stats band would compete with the hero.

**M. Big-number + photo gallery pairing (Surge `gallery-stats`)**
- Pattern: six event photos, no captions; beside them 2 stats (170+ Companies, 400+ Founders) at 96px with 24px labels, 90px column gap, heading "A network that grows with you."
- StartNet fit: **Events** index (`Events.jsx` / `EventGallery.jsx`) and **Vibe** / **Connect** hubs: "120+ events · 9 districts" next to a StartNet Gallery grid. Numbers at 64–72px in Inter 500.

### 3.5 Application CTAs

**N. Oversized closing question CTA (Surge `section_cta-bold`)**
- Pattern: "Are you one *of the 0.4%?*" at 104px / lh 1.0; two buttons, "Apply" and "See our companies"; min-height 512px; content column 704px wide (max 70vw) offset 160px right; a cut-out image anchored to the left edge (800px wide, max 34vw, left −96px).
- StartNet fit: global `CTABand.jsx` final section on **Home**, **Programmes**, **StartNet X**. Copy pattern: a question that sets the bar, for example "Building the next one from *Tamil Nadu*?". Size it from the Techstars scale (about 64–80px), not 104px. The SNX Red full stop or the primary button carries the one red point, not both.

**O. Repeated, consistent CTA labels (Antler "Pitch Us" in nav, hero, cards and contact; Surge "Apply" everywhere)**
- StartNet fit: lock one verb per audience across the site: "Apply" (founders), "Partner with us" (partners), "Register" (events). The header CTA, hero CTA and closing CTA all use the same label. Antler also keeps a separate quiet utility link, "Founder Login", next to the CTA. Map this to StartNet's existing "Sign in" (header → startnet-platform.vercel.app).

**P. Cohort start dates as their own page (Antler `/cohort-start-dates`, linked from the Resources mega-menu)**
- StartNet fit: **New → `OpenCalls.jsx`**. One page listing every open call across Research / Vibe / Connect / Women / programmes with exact dates and status (Open / Closing in N days / Announced soon). Link it from the mega-menu and from every programme page.

### 3.6 Testimonials

**Q. Testimonial card with logo first (Surge `testimonial-compact`)**
- Pattern: 2-column list, gap 32px; company logo on top (36px tall, 30px bottom margin), quote, then name + title row with 16px gap.
- StartNet fit: **Programme detail** and **Partner → `PartnerProof.jsx`** using `Quote.jsx`. Logo first works for partner proof. Founder quotes should lead with the photo instead.

**R. Moving testimonial wall (Antler `moving-testimonials`)**
- Pattern: cards max 480px wide, padding 24→32px, radius 3px, background #F0EBE6; 32px round portrait + name/role row, logo max 112px; two rows scroll horizontally with a CSS animation (160s linear infinite), second row offset −445px.
- StartNet fit: **Home** "Founders on StartNet" and **Women** hub. Card background Paper #F4F3EF on an off-white section, or Ink with Paper text. Pause on hover/focus. Under `prefers-reduced-motion` show a static 3-column grid.

### 3.7 Location / city pages

**S. Country page anatomy (Antler `/location/india`)**
- Observed order: Hero ("THE FIRST BELIEVERS IN *OBSESSED OUTLIERS*", CTAs "Apply" + "Join an upcoming event") → Local portfolio (11 companies with one-liners) → Follow-on investors logo strip → Stats (#1 most active AI investor in India, 115+ India companies, 12,000+ founders, 27+ offices) → Residency details (terms, eligibility) → Local team (11 people with photo, name, title, "Spokesperson" tag, expandable bio) → Testimonials (5) → FAQs (9) → "Reach us directly" contact.
- StartNet fit: **New → `Districts.jsx`**, a template for each district (Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli…). Proposed order:
  1. `PageHero` with district name and one serif word, plus CTAs "Apply" and "Upcoming events in {district}"
  2. `FactBand`: startups, founders, events held, partner institutions
  3. Founders from this district (`StoryCard` grid, H)
  4. Upcoming events in the district (`EventCard`)
  5. Local leads/mentors (`PersonCard` with a "Spokesperson" style tag like "District lead")
  6. Local partners (`LogoWall`)
  7. `Accordion` FAQs and the closing `CTABand`
- Borrow the **mega-menu grouped by region** (Antler: Asia Pacific / Europe / Americas / Middle East and Africa). StartNet groups districts by zone: Chennai and North, West (Kongu), Central (Delta), South. One column per zone in the existing `layout` mega-menu.

### 3.8 Motion and micro-interactions

| Interaction | Source spec | StartNet use |
|---|---|---|
| Button fill sweep | Surge: `.button-overlay-element` slides from `translateX(-100%)` to 0 over 0.9s cubic-bezier(.165,.84,.44,1); button base transition 0.32s | `Button.jsx` primary hover. Ink fill sweeping over an Ink outline, or Paper over Ink. Not a red sweep. |
| Nav link underline | Surge: 2px line under each nav link, coloured bar `translateX(-100%)` → 0 on hover | Header links. Line in Ink, not a brand colour. |
| Scroll reveal | Surge: `data-scroll-animation="element/card/grid/image"`, ScrollTrigger `start: 'top 80%'`, `ease: power3.out`, opacity 0→1 + small y | Existing `Reveal.jsx` / `ClipReveal.jsx`. Settle on 24px rise, 0.6s, power3.out (`cubic-bezier(.215,.61,.355,1)`), 60ms stagger for card grids. |
| Headline split | Surge loads SplitText + ScrambleText for headings on page load (`data-pageload-animation="heading"`) | `KineticHeadline.jsx`: line-by-line rise only. No character scramble, which reads as tech-gimmick. |
| Number roller | Surge odometer slots (`data-number-counter`, `data-odometer-part="roller/mask"`) | `Stat.jsx` (K) |
| Carousel bleed | Antler Swiper with `overflow: visible`, negative side margins, 48px round arrows | `Scroller.jsx` |
| Marquee | Antler logo band and testimonial rows, CSS keyframes, 160s linear | `Marquee.jsx`. Pause on hover, honour reduced motion. |
| Arrow-in-circle link | Antler `button_arrow_wrap` 48px circle, icon at 36%, colour swap 0.2s | Card CTAs in `StoryCard`, `ProgrammeCard`, `BrandTile` |

### 3.9 Typography choices

- Antler confirms the StartNet pairing model: one sans family at 400 / 500 only (Satoshi), and the serif only inside `<em>`, at light weight. Copy the CSS approach: `em { font-family: 'Instrument Serif'; font-style: italic; font-weight: 400; display: inline-block; margin-bottom: -0.1em; }` scoped to headings.
- Antler uses heading letter-spacing −0.03em. Inter at 48px and up needs about −0.02 to −0.03em. Adopt −0.025em for H1/display and −0.015em for H2.
- Antler trims cap height and baseline (`trim-top .36em`, `trim-bottom .4em`) so headings align flush with the top of their column. StartNet could use the `text-box-trim` equivalent or negative margins on display headings in grid layouts.
- Surge uses a monospace face (DM Mono, 24px / 1.5) for service tags ("Hiring, Product, Policy, Comms & PR…"). StartNet should **not** add a third family. Use Inter 500 at 12–13px uppercase with +0.06em tracking for eyebrow tags instead.

### 3.10 Use of colour blocks

- Antler bento grid (`bento_item`, 3 columns, gap 16→24px, radius 3px, alternating light #F9F7F5 / #F0EBE6 / dark tiles): portfolio teaser, location finder with city photo, stats and logos in one grid. **StartNet fit: Home "One network, four brands" block**, using `BrandTile.jsx`. Each sub-brand tile may carry its own accent (Research #4A3AA7, Vibe #E2581F, Connect #0E8F63, Women #C2386F) as a **solid flat block**, with Paper text, inside an otherwise Ink/Paper grid. One tile per accent, no gradients.
- Surge alternates navy and off-white sections. StartNet should alternate Paper and Ink sections, with at most one Ink section between two Paper sections on long pages. Sub-brand hubs (`BrandHero.jsx`) may open with a full-bleed accent block in their own colour. That is the only place a sub-brand colour fills a whole section.

---

## 4. What NOT to copy

| Item | Source | Why not |
|---|---|---|
| Red as the universal hover colour (every primary button, toggle, arrow and close button hovers to #ED4746) | Antler `--_button-style---background-hover: var(--swatch--red)` | Breaks "one SNX Red point per composition". A card grid of 9 arrow buttons would light up 9 red points. Hover = Ink ↔ Paper inversion; red stays on the single primary CTA or the full stop. |
| Radial-gradient hero backgrounds (`radial-gradient(circle farthest-corner at 0% 0%, #1c454a 3%, #122e31 16%, …)`) | Antler `section_home-hero`, `_v2` | Brand rule: no gradients. Use flat Ink, or a mono-graded photo with a flat Ink overlay. |
| Rotated hero image (`transform: rotate(4deg) translateY(3%)`) | Antler `home_hero_img_wrap` | Fights Plug and Play's straight, grid-locked layout. |
| ALL-CAPS section headings ("PORTFOLIO.", "GET IN TOUCH.", "FOUNDER —STORIES") | Antler | StartNet uses sentence case in Inter 400–500. Caps are for 12–13px eyebrows only. |
| Weight-900 stat numerals in an accent colour | Surge `stats_number` (wt 900, purple) | StartNet's Inter range is 400–500, and accent colour on every number dilutes the red point. |
| Light 300-weight display headings | Surge titles and H1–H3 at weight 300 | Inter 300 is outside the brand range. Use 400 for display, 500 for H3 and below. |
| Purple / fire secondary accents spread across links, borders and numbers | Surge (`peak-purple` on nav underline, numbers, borders) | StartNet allows only one red accent, plus sub-brand colours inside their own hub. |
| Monospace third typeface | Surge DM Mono tags | Two families max: Inter + Instrument Serif Italic. |
| Two emphasised phrases in one headline | Surge "Where **audacious founders** find their **Surge**." | One Instrument Serif Italic word per headline. |
| Character-scramble / decoding text effects | Surge ScrambleTextPlugin | Reads as crypto/tech gimmick and clashes with Plug and Play's calm corporate motion. |
| Parallax "spiral" and "dot" decorative motifs | Surge `data-parallax-motion="spiral/dot1"` | Decorative animated art is ruled out (photo rules: no animated art). |
| Colour HLS video hero with a pure black 40% overlay | Surge home | Photography must be real Tamil Nadu people in the warm faded mono grade. If video is used, grade it the same and use an Ink overlay. |
| Stock/global founder photography and non-Indian faces | Both (global portfolios) | StartNet Gallery first, Indian people only. |
| Footer showing an unrendered template string ("© {{year}}") and carousel buttons both labelled "Back" | Antler home | QA lesson: render the year at build time and give prev/next real labels ("Previous story", "Next story"). |
| Conflicting numbers on one page (30 vs 26 locations; $470K vs $425K; 60%+ vs 50–75%) | Antler home and India page | Keep every stat in one data file and render it everywhere from there. |
| Directory without search or district filter | Surge `/companies` (sector only), Antler stories (no filters) | StartNet needs district + sector + programme filters and a search box on Startups and Stories. |
| Logo cards with light/dark logo swapping in colour | Surge | StartNet logo walls are mono Ink. |

---

## 5. Page-by-page summary of borrowings

| StartNet page / component | Borrow (section 3 IDs) |
|---|---|
| Home (`Home.jsx`, `HeroShowcase`, `HomeRest`) | B serif accent word with em-dash lead-in; G audience split; J logo marquee; K roller stats band; H founder-story rail; R testimonial wall; 3.10 bento of four brands; N closing question CTA |
| Programmes index (`Programmes.jsx`) | C hero founder carousel; F current-cohort block + tabs; P link to Open Calls |
| Programme detail (`ProgrammeDetail.jsx`) | D sticky `PillSubNav`, section order, `Steps` + calendar; E terms `FactBand` from one data source; J follow-on investors strip; Q logo-first quotes |
| Brand hubs Research / Vibe / Connect / Women (`BrandHero`, `OurBrands`) | 3.10 full-bleed accent block in hub colour; K 3–4 hub stats; I hub's own 6–9 companies; M stats + gallery (Vibe, Connect); R testimonial wall (Women) |
| Events (`Events.jsx`, `EventGallery`, `EventDetail`) | M number + photo gallery pairing; O one CTA verb "Register"; S per-district event lists |
| Insights (`Stories.jsx`, `StartupShowcase.jsx`, `Reports.jsx`) | H founder-story card + district/sector meta; F cohort toggle + sector chips with "View less"; L left-rule stats in reports |
| Partner (`Partner.jsx`, `OurPartners`, `PartnerProof`) | G two-audience split; J partner logo marquee; Q logo-first testimonial cards |
| StartNet X (`StartNetX.jsx`, `Pricing`, `Modules`) | A full-bleed graded hero; E fact band for pricing/terms; N closing CTA |
| Districts (`Districts.jsx`) | S full Antler location anatomy; zone-grouped mega-menu |
| Open Calls (`OpenCalls.jsx`) | P cohort start dates page with exact dates and status |
| Global (`Button`, header, `Reveal`, `KineticHeadline`, `Marquee`, `Scroller`) | 3.8 motion table; 3.9 em styling and tracking |
