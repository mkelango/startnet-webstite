# AIWO blueprint: pattern library for StartNet

Status: reference analysis, 2026-10-09. Source: https://aiwo-website-new-v1.vercel.app/ studied with puppeteer at
1440×900 and 390×844. Routes covered: `/`, `/cations`, `/cations/healthcation`, `/about`, `/events`, `/journal`, plus the
desktop mega menu (all 8 panels) and the mobile drawer. Values are read from computed styles and from the site's own CSS
(`_next/static/.../3o5_q_pbmzg40.css`).

**How to use this file.** Each pattern gives (a) what AIWO does, with exact values, and (b) **Apply to StartNet**,
which says where the pattern goes, using StartNet's existing content and the brand-book colours. Nothing here
copies AIWO's text, brand colours (umber, bronze, terracotta, forest) or fonts (Source Serif, IBM Plex Mono).
Where AIWO conflicts with `DESIGN-v2.md` or the brand book, **the brand book wins**, and the conflict is named.

**Hard rules still apply:** no change to copy, data, numbers, links, order of information, menus or nav items. All
content is in the prerendered HTML at its final state. Reduced motion turns every effect off. Tamil keeps working.
No new npm dependencies. No kolam, diamond or dot-grid feature graphics (the user dislikes them).

---

## 0. The single biggest difference

AIWO is **photography-led and typographically quiet**. On the home page, 9 of 16 bands carry a real photograph
(candid people, real rooms, never illustrations), and the type is light and large. The rest is hairlines, whitespace
and one flat ground per band.

StartNet's home page today (measured on localhost:5173 at 1440) has **one** photograph in 16 bands: the video
thumbnail in `#on-film`. The hero is the pulli/diamond-grid art, which is the graphic the user dislikes. Moving
StartNet's existing photo system (`ArtImage` + `data/photos.js` HERO_PICKS / TILE_PICKS + the 64-photo licensed pool,
see `docs/PHOTOS.md`) into the hero, brand tiles, programme cards, places and story slots is the change that most
closes the gap. The rules in PHOTOS.md stay: no stock photo may pass for a real StartNet person or event.

---

## 1. System values (AIWO, measured)

### 1.1 Surfaces

AIWO uses a `data-surface` attribute that swaps a set of CSS variables per band:

| surface | bg | ink | muted | rule (accent hairline) | line (hairline) | button bg / ink / hover |
|---|---|---|---|---|---|---|
| white | #FFFFFF | #0A0A0A | #4A4A4A | #7B4F36 | #E2DFDA | #0A0A0A / #FFF / #4A4A4A |
| stone | #F2F0ED | #0A0A0A | #4A4A4A | #7B4F36 | #E2DFDA | #0A0A0A / #FFF / #4A4A4A |
| black | #0A0A0A | #FFFFFF | #C4D1D7 | #4A4A4A | #2A2A2A | #FFF / #0A0A0A / #E2DFDA |
| umber (CTA) | #442723 | #FFFFFF | #C4D1D7 | #BE8F6B | #5B3A35 | #FFF / #0A0A0A / #F2F0ED |

Home band order: stone hero → white → **black** → white → stone → white → stone (photo band on top) → white → stone →
white → stone → white → stone → white → stone → **umber CTA** → black footer. That is strict two-ground alternation,
one dark mid-page band and one coloured closing band. Edges are straight. No shadows, no radii, no gradients on grounds.

**Apply to StartNet:** this is already the DESIGN-v2 plan (Paper ↔ Bone alternation, Ink bands ≤ 2 mid-page). Map
white → Paper `#F4F3EF`, stone → Bone `#EBEAE5`, black → Ink `#0C1719`. For the closing CTA band, AIWO uses a
brand colour instead of black. StartNet's equivalent is **Ink with a Lagoon-700 `#024C52` wash** or plain Ink. Do not
use red as a ground. On brand hubs the closing band may use the brand accent at full strength only if text contrast
passes AA (computed: Research `#4A3AA7` 7.7:1 and Women `#C2386F` 4.7:1 pass with Paper text; Vibe `#E2581F` 3.4:1
and Connect `#0E8F63` 3.7:1 fail with Paper text, so they need Ink text (Vibe on Ink-text 4.9:1) or a darker shade). Keep the `--s-*` idea: StartNet's `[data-surface="night"]` swap already does this.

### 1.2 Type scale

| role | AIWO token | value at 1440 | at 390 | weight | leading | tracking |
|---|---|---|---|---|---|---|
| display (home h1, CTA h2, photo-band h2) | `clamp(2.5rem, 1.692rem+3.59vw, 6rem)`; hero override `clamp(2.75rem,1.4rem+3.6vw,5.75rem)` | 78.8 px (hero 74.2) | 41 px | 200 (300 below 768) | 1.02 | −0.025em |
| page title (inner hero h1) | `clamp(2rem,1.654rem+1.538vw,3.5rem)` | 60.2 px | 32.5 | 200 → 300 | 1.08 | −0.02em |
| section h2 | `clamp(1.5rem,1.356rem+.641vw,2.125rem)` ×1.43 | 48.6 px | 32.5 | 200 | 1.08 | −0.02em |
| card / row h3 | — | 30.9 px (row) / 24 px (card) | 24 | 400 | 1.2 | −0.015em |
| lead | `clamp(1.25rem,1.106rem+.641vw,1.875rem)` | 26.9 px (hero 22.2) | 20 | 400 serif | 1.4 | 0 |
| body | `clamp(1.0625rem,.9904rem+.3205vw,1.375rem)` | 20.5 px | 17.1 | 300 | 1.6 | 0 |
| caption | `clamp(1rem,.9567rem+.1923vw,1.1875rem)` | 18.1 px | 16 | 300 | 1.5 | 0 |
| label (eyebrow) | 1rem | 16 px | 16 | 500 | 1.4 | **0.24em, UPPERCASE** |
| stat | display size, mono | 192–213 px | — | 300 | 1.0 | −0.03 to −0.05em |
| meta / data | mono | 14–16 px | 14 | 300 | 1.6 | 0, tabular |

The serif accent: `h1 em, h2 em { font-family: serif; font-style: italic; font-weight: 400; font-size: 1.04em; letter-spacing: 0 }`.
Exactly one word per headline, full stop outside the `em`. Body text is weight 300 and large (20.5 px at 1440).

**Apply to StartNet:** keep the DESIGN-v2 / brand-book weights (display 400, h2 500). AIWO's 200 weight is not a
brand weight. What to take is the **size relationships**, not the weights:
- Section h2 at 1440 should read about 2.4× body. StartNet's h2 is 40 px over 17 px body (2.35×), so it is right.
- The **body and lede are where StartNet looks smaller and denser**. AIWO's body is 20.5 px at 300; StartNet's is
  17 px at 400. Move section ledes (`.section-header__lede`) to `--text-lede` 20 px with `--color-text-2` and
  `max-width: 40ch`, and give running copy under section headers 1.6 leading.
- The serif accent rule is the same (Instrument Serif replaces Source Serif). Already in DESIGN-v2 2.4.
- **Conflict:** AIWO's labels are UPPERCASE with 0.24em tracking. The brand book uses sentence-case dot labels.
  Keep StartNet's dot labels. Borrow only their placement: label 24 px above the h2 (AIWO `mt-6`).
- No mono font. AIWO uses IBM Plex Mono for every number, date and meta line. StartNet uses Inter
  `tabular-nums` (DESIGN-v2 0.3). The effect AIWO gets (dates that read as data) comes from tabular figures + muted
  colour + a smaller size, which Inter tabular gives.

### 1.3 Space, container and grid

| item | AIWO value |
|---|---|
| container | `max-width: 1760px; padding-inline: max(20px, min(8vw, 8svh))` → **72 px at 1440×900, 31 px at 390** |
| gutter | 16 px → 24 px (≥768) → 32 px (≥1280) |
| grid | 12 columns at ≥1024 (78.66 px columns + 32 px gaps inside a 1296 px content box at 1440) |
| band padding | `clamp(80px, 3.385rem + 7.18vw, 192px)` → **157.6 px at 1440, 82 px at 390** |
| tight band | `clamp(48px, 2.308rem + 3.077vw, 96px)` → 81 px at 1440 |
| header block | label → h2 24 px; h2 → lede 32 px; header → content 56–64 px (`mt-14`/`mt-16`) |
| header max-width | `max-w-[52rem]` (832 px); lede `max-width: 66ch` |
| card grid gaps | 32 px column, 56 px row (`gap-y-14`) |

**Apply to StartNet:** keep the 1280 container from the brand book. Raise the section padding a little and make it
fluid: StartNet is at 128 px fixed at 1440, which is fine; the gap that shows is **inside** sections. Use
`--space-head-gap` at its 64 px top value at 1440 and a **56 px row gap** in card grids (StartNet uses 48). Cap
section-header text at 832 px (`max-width: 52rem`) and ledes at 66ch.

### 1.4 Shape, borders and depth

- **Radius: zero** on media, cards, fields and bands. Pills (9999 px) only on buttons and chips. The one exception is
  the phone mock-up (44 px).
- **Borders:** 1 px hairlines only (`#E2DFDA` on light, `#2A2A2A` on black). Framed cards use
  `box-shadow: inset 0 0 0 1px var(--s-line)` (no layout shift, no border-box maths). List rows use `border-bottom`.
  Step columns sit under a 1 px **Ink** top rule (`border-top: 1px solid var(--s-ink)`), not a grey one.
- **Shadows:** none on content. The header has none either; its edge is the 1 px bottom hairline.
- **Gradients:** none on grounds. Only scrims under text on photos: `bg-gradient-to-t from-black/60 via-black/15 to-transparent`
  (alphas used: 60/65/70/75 → 10/15/25 → transparent).
- **Media:** `object-fit: cover`, placeholder ground `#E2DFDA` behind every image (no CLS, no flash).

**Apply to StartNet:** brand book says 12 px media radius, 4 px buttons, pill chips. Keep those. Take AIWO's
**restraint**: no shadows on cards, inset 1 px framed cards, Ink top rule for step/feature columns, and Bone `#EBEAE5`
as the placeholder behind every photo. Scrims on photo-with-text use Ink: `linear-gradient(to top, rgb(12 23 25 / .65), rgb(12 23 25 / .15) 45%, transparent)`.

### 1.5 Buttons and links

| element | AIWO value |
|---|---|
| `.btn` | `min-height: 48px; padding: 0 24px; border-radius: 9999px; font: 500 16px/1 Inter; gap: 10px` |
| `.btn-lg` | `min-height: 56px; padding: 0 32px` |
| primary | bg `--s-btn-bg` (Ink on light, White on dark) → hover `#4A4A4A` / `#E2DFDA`, `transition: background-color .24s cubic-bezier(.2,0,0,1)` |
| secondary | transparent, `box-shadow: inset 0 0 0 1px currentColor`, hover fills `--s-chip-hover` |
| arrow link | `inline-flex; gap: 10px; font-weight: 500; size = body (20.5 px)`; arrow `translateX(4px)` on hover over 240 ms `cubic-bezier(.2,0,0,1)`; label gains underline on hover |
| inline link | underline 1 px, offset .2em; hover thickness 2 px (240 ms) |
| chip | `min-height: 44px; padding: 0 18px; radius 9999px; inset 0 0 0 1px #B4B4B4`; pressed = Ink fill, bg-coloured text |

A hero has **one** filled button. The second action is always an **arrow link** below it (24 px gap), never a second
box. The CTA band is the only place with filled + ring side by side.

**Apply to StartNet:** brand book radius (4 px) stays. Take the **hierarchy**: in heroes and section heads, one filled
button and the rest as arrow links. Raise heroes and CTA bands to the 56 px `lg` size with 32 px padding. Hover is a
**tone shift** (Ink → Ink-700 `#2C3E41`, Paper → Bone), not a lift or shadow. The header "Join StartNet" stays red
(the one red point).

---

## 2. Pattern library

### P1. Navigation: three-tier header

**AIWO**
- Tier 1, announcement bar: 56 px, black, 15–16 px white text, one underlined link, dismiss ✕ (remembered).
- Tier 2, utility bar: 36 px, stone, 16 px links right-aligned (locale · Search · Log in · Book · Contact).
- Tier 3, main bar: 72 px (56 px below 1024), **white**, 1 px `#E2DFDA` bottom hairline. Wordmark left (112×23),
  8 nav triggers 16 px/400 `#4A4A4A` with 16 px side padding and full 72 px hit height, one filled pill CTA right
  (44 px high).
- **Hide on scroll down, show on scroll up**: `transform: translateY(-100%)`, `transition: transform 280ms cubic-bezier(.4,0,1,1)`.
  Measured: 1 200 px of scroll down → header top −73; 300 px back up → top 0.
- Active/hovered trigger: text goes to Ink and a **2 px Ink underline** sits flush with the bar's bottom edge.

**Mega menu**
- Full-bleed white panel (`absolute inset-x-0 top-full`), 1 px bottom hairline, no shadow, height 400–580 px,
  `max-height: 64vh` scrollable.
- Inside: the 12-col grid, `padding-block: 48px`. Columns 1–7 hold link groups (`grid-cols-[1.4fr_1fr]` or
  `grid-cols-3`); each group has an uppercase label, then items of **title (20 px/400) + one-line description
  (16 px/300 muted)**. Columns 8–12 hold a **feature card: a 4:5 photo + a display line with the serif word + a
  one-line lede**.
- The page behind gets a dim scrim (about 25% black), so the panel reads as a sheet.
- Enter: `opacity 0 → 1` and `translateY(8px) → 0`, about 280 ms, `cubic-bezier(.2,0,0,1)`; hover intent ~120 ms.

**Mobile drawer (390)**
- Full-screen stone sheet (`fixed inset-0`). Wordmark + "Close" text button top. Search field first (white, 1 px
  border, square). Then the 8 sections as **56 px accordion rows, 20 px/400, with a + on the right and 1 px
  hairlines**. Then utility links as plain 17 px rows. Sticky footer: full-width filled CTA + "Close" ring button.

**Apply to StartNet:** the header stays Ink and the menu items, order and labels stay exactly as they are
(DESIGN-v2 0.3). Take:
1. **Hide-on-scroll-down / show-on-scroll-up** with the exact 280 ms `--ease-header-exit` already in the tokens. The
   header and utility bar move together. Reduced motion: header stays pinned and visible.
2. The **2 px underline flush with the bar bottom** for the open/current item (Paper on Ink). This can replace or
   sit under the sliding pill; pick one, not both.
3. **Mega panels as a full-width sheet** on Paper with the 12-col grid: existing link groups in cols 1–7 with their
   existing descriptions styled title + muted line; the existing `megaCtas.js` card in cols 8–12 shown as a
   **photo card** (4:5 photo from the brand's pool slot, the existing CTA text as the display line). A 25% Ink scrim
   behind it. No new copy.
4. Mobile drawer: StartNet's existing items as 56 px hairline accordion rows with +/−, Search first, and the existing
   "Join StartNet" as the sticky bottom button.
5. No announcement bar unless one already exists in content. If StartNet already has a site notice, style it as
   AIWO's 56 px Ink bar with one underlined link and a remembered dismiss.

### P2. Hero, split photo (home and inner pages)

**AIWO**
- 12-col grid, full bleed, `min-height: max(640px, calc(100svh - 7.5rem))` at ≥1024 (86svh on inner pages).
- Text in cols 1–6 on the band colour: `padding: 72px 48px 18vh 72px`, content **top-aligned**, not centred.
  Label → (32 px) h1 at `max-width: 11ch` → (28 px) serif lede at `max-width: 36ch`, muted → (40 px) one filled
  `btn-lg` → (24 px) arrow link → (24 px) a 15 px/300 muted reassurance line.
- Photo in cols 7–12, **edge to edge** (right edge and top/bottom of the band), no radius, `object-fit: cover`,
  `bg #E2DFDA` behind. Photo is people mid-action, candid, natural light.
- Inner pages use the same split with a coloured band behind the text (terracotta, umber, black) and the photo right.
  Two buttons (filled white + ring) are allowed there.
- Mobile: **photo first** (390×487, about 4:5), text below with the same order. h1 41 px.
- Entrance: words of the h1 fade in one by one (opacity only, no movement): 900 ms each, `cubic-bezier(.2,0,0,1)`,
  60 ms stagger starting at 80 ms. Lede and actions follow as blocks at 280 ms, delays 400 and 480 ms.

**Apply to StartNet (home):** replace the pulli/diamond art in the home hero with a **split photo hero on Ink**:
eyebrow "Tamil Nadu's founder-making network", h1 "Every talent, a *founder*." (red stop stays the one red point),
lede, "Find your programme" filled (Paper on Ink), "See upcoming events" as the secondary, and "Partner with us" as
the arrow link: same strings, same order. Photo: the home `HERO_PICKS` slot (students or young founders working
together, Tamil Nadu setting), cols 7–12 edge to edge at ≥1024, 4:5 on top at <768. This also satisfies the sheet
rise: the first Paper section rises over the Ink band (DESIGN-v2 2.1).
- Keep `fetchpriority="high"` on the photo and an explicit aspect box so there is no CLS.
- The h1 word fade must be enhancement only: the words are visible in the prerendered HTML; JS adds the class that
  hides them just before animating. Reduced motion: no fade.
- **Apply to inner pages:** PageHero/BrandHero become the same split. Brand hubs put the brand accent on the
  **eyebrow dot and the 2 px rule only**, with the band in Ink and the photo from that brand's pool theme
  (Research → labs, Vibe → students, Connect → professionals, Women → women founders).

### P3. Statement band with scroll-scrubbed words

**AIWO** (`The idea` and `The mission` bands)
- White/stone band, text offset to cols 2–9 (`padding-left` ≈ 1 col), uppercase label, h2 display at
  `max-width: 13ch`, then a **large statement paragraph**: 37.8 px/300, leading 1.3, tracking −0.015em,
  `max-width: 36ch` (Inter) or 50.9 px/300 serif (mission).
- Each word is a `<span>` whose opacity runs **0.18 → 1** as the paragraph moves up the viewport (scroll-linked,
  no transition). Measured: paragraph top at 1 060 px → all 0.18; at 760 → first word 0.5; at 460 → first two
  thirds at 1; the rest follow.
- Two arrow links below (56 px gap).

**Apply to StartNet:** this is the DESIGN-v2 **ScrubText** (one per page). On home, use it on the
`#where-things-stand` statement sentence (already specified) or on `#mission`'s existing statement. Set the
statement at `--text-h1`-ish size (36–40 px at 1440), weight 400, leading 1.3, `max-width: 36ch`, Ink on Paper.
Floor opacity **0.25** (not 0.18) so unscrubbed words still pass a 3:1 large-text check while scrubbing; the
prerendered state is full opacity. Reduced motion: no scrub.

### P4. Dark feature: product card + key points (the "score card")

**AIWO** (`#score`, black band)
- 12-col split: an **inset-framed card** in cols 1–7 (`box-shadow: inset 0 0 0 1px #2A2A2A`, padding ~48 px) holding a
  huge mono numeral (192 px/300, the one coloured element on the page in amber `#A8703F`), a "next step" note under a
  hairline, and a 6-row data table with hairlines and right-aligned tabular values. Under it: a caption label and a
  ring button.
- Cols 9–12: label, h2 (48.6 px/200) with serif word, muted lede, then three **label + text** points separated by
  hairlines (28 px padding each), then filled button + arrow link.

**Apply to StartNet:** the Ink band `#where-things-stand` (FactBand) maps onto this. Cols 1–7: a framed Ink-800
card holding the **existing** headline figure as a `--text-stat` numeral (count-up), with the existing supporting
stats as **hairline rows: label left, tabular value right**. Cols 9–12: the existing heading, lede and "How we
count…" link. The single colour accent here is **Marigold `#FBA62A`** on the numeral (≤5% of the layout; Marigold on
Ink is about 9.2:1), or keep it Paper and let the header button be the only colour. No red here: the stop in the hero is
the page's red point.

### P5. Horizontal card scroller (the "'cations" rail)

**AIWO**
- Header row: `flex justify-between items-end`: h2 + lede left (`max-w-[52rem]`), controls right: a tabular counter
  "01 / 08" (16 px muted) and two **48 px circular** ring buttons (← disabled at 30% opacity).
- Track: `display:flex; gap: 32px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--margin); padding-inline: var(--margin)`,
  bleeding to the viewport's right edge (cards cut off at the edge, which signals "more"). No scrollbar.
- Card (388 px wide at 1440, 278 px at 390): **4:5 photo** (388×485), then 28 px → uppercase label → 24 px/400 h3 →
  15 px mono meta → arrow link "See X →".
- Last tile is a **type-only tile** (51 px/200 text, no photo) for "coming soon" items, and a final "Not sure which?"
  chooser tile.
- Desktop: a custom **"Drag" cursor chip** (Ink pill, 14 px/500 white) follows the pointer over the track.
- Hover: the card's arrow link underlines; images do not zoom on the rail (they zoom 1.02 on `.card` grids).

**Apply to StartNet:** `#brands` on mobile, `#coming-up` and `#stories` (DESIGN-v2 already names Scroller). Use the
AIWO header row (counter + two 48 px circular ring buttons, which matches "circles for icon-only buttons" in the
brand book) and the **right-edge bleed**. Brand tiles: 4:5 photo from TILE_PICKS, brand-accent dot label (existing
brand name), existing h3 and arrow link. Coming-up event cards: the event's own photo only (PHOTOS.md "event pages
are strict"); where none exists, a **type-only tile** in the AIWO style (large date + title on Bone) instead of
pulli art. The "Drag" chip is optional polish; if added it must be `pointer: fine` only and `aria-hidden`.

### P6. Big-number stat band

**AIWO** (`Measured, not guessed`, stone band)
- The label is the h2 (uppercase 16 px). One giant numeral `180+` (213 px mono/300, −0.05em) with its unit word next
  to it at 62 px/200, a footnote marker, then a 27 px serif lede at `max-width: 44ch`, then a hairline row:
  footnote caption (18 px/300 muted, 62ch) left and arrow link right (`grid-cols-[1fr_auto] items-end`).
- Count-up on view: `--dur-count: 1s`.

**Apply to StartNet:** `#mission` ("Mission 1 Lakh"). Show the existing target number as one `--text-stat` numeral
(count-up, tabular, Indian grouping) with its existing unit, the existing lede beneath, and the existing
footnote/link in the **hairline footnote row**. The MissionMeter's current value stays the red point only if the hero
stop is not in the same viewport (it is not, so DESIGN-v2's red meter dot is fine).

### P7. Process / steps in four columns

**AIWO** (`#how`)
- Header (`max-w-[52rem]`), then a 4-col grid under a **1 px Ink top rule**, `padding-top: 40px`, `gap: 56px 32px`.
- Each column: mono number "01" (16 px muted) → 32 px → h3 31 px/400 → serif italic one-liner (20 px) → 16 px →
  body 17 px/300 muted → a hairline → uppercase mini-label (13 px) + one example line.
- Below: a **chip row** ("Example: [chip][chip]…") that switches the example lines in all four columns at once
  (pressed chip = Ink fill). Then a closing serif sentence (27 px) left and an arrow link right.

**Apply to StartNet:** `#how-it-works` ("From first idea to first customer"). Existing steps in a 4-up grid (2-up at
≥640, 1-up below) under a 1 px Ink rule, with tabular step numbers, h3, and existing text. If the section already
has per-persona or per-brand variants, the chip row is the switcher; otherwise skip it (no new content). On brand
pages, the rule colour is the brand accent.

### P8. Full-bleed photo band with overlaid headline, then a timeline

**AIWO** (`#ninety-days`)
- A 1440×738 photo (≈ 1.95:1; 390×692 on mobile, i.e. near-portrait) with an Ink-to-transparent bottom scrim and the
  label + display h2 (white) sitting at the bottom left inside the container, `padding-bottom: 81px`.
- The section continues on stone: serif lede (27 px, 38ch), then a **horizontal milestone timeline**: a 2 px grey
  track with an Ink progress segment and a ringed current node, 7 stops with 16 px labels and 14 px mono sub-labels.
  Selecting a stop updates a "What happens / Who" panel below (5/7 split under a hairline).

**Apply to StartNet:** this is the pattern for **FounderStory / PulliTimeline** on home: a full-bleed photo band
(home pool, "a founder's journey" theme, no identifiable invented people) with the existing section heading on a
scrim, then the existing four steps ("A dot · A grid · A network · A full stop") on a horizontal 2 px track with
the current node as a ringed Ink dot, and the step text panel below. Same steps, same labels, same text. This
replaces the decorative pulli graphic with a photo + a plain line diagram.

### P9. Framed cards (results / programme cards)

**AIWO** (`#outcomes`)
- 3-up grid, `gap: 32px`. Card: `padding: 32px`, `box-shadow: inset 0 0 0 1px var(--s-line)`, no radius, no
  shadow. Uppercase label → a large mono value line (56 px) → muted caption → a 4-row `dl` with hairlines (15 px muted
  label left, value right) → a "+ Show the method" disclosure.
- Header is a 7/5 split: h2 + lede left, a 27 px serif "note" right.

**Apply to StartNet:** `#open-now` ProgrammeCards. Card on Card `#FBFAF7`, inset 1 px hairline, 12 px radius (brand),
**a 3:2 photo at the top** (programme or brand pool), then the existing title, existing key facts as hairline `dl`
rows (deadline, format, eligibility, whatever the card already shows), and the existing CTA as an arrow link. Hover:
hairline turns `--line-strong`, photo scales 1.03 over 480 ms (DESIGN-v2 motion grammar), title underlines.

### P10. Split feature with device or media (the LifeOS block)

**AIWO** (`#lifeos`)
- 12-col, `items-center`, text cols 1–5 (label, h2, lede, a list of **title (20 px/500) + muted line** features,
  then filled button + arrow link), and a phone mock-up in cols 7–12 (300 px wide, 44 px radius, Ink bezel)
  with in-app chips that switch screens.

**Apply to StartNet:** StartNet X pages (`pages/snx/**`) where a platform screenshot exists, and `#why-tamil-nadu`
(DESIGN-v2: 7/5 with stats left, map art right). For StartNet X, show the existing product screen in a simple
browser/device frame (Ink-800, 12 px radius) on the right with the existing module list as title + muted line rows
on the left. No invented UI.

### P11. Two big media cards + hairline link rows (the Places block)

**AIWO** (`#places`)
- 2-up grid of **4:3 photos** (632×474), each with h3 31 px/400, a 17 px/300 muted line at 48ch, and an arrow link.
- Below: full-width **hairline link rows**, each a 12-col grid: title (20 px/500) in cols 1–3, muted description
  in cols 4–9, arrow link right-aligned in cols 10–12; `padding-block: 28px`, `border-bottom: 1px solid var(--s-line)`;
  the row is one link; hover turns the hairline Ink (240 ms).

**Apply to StartNet:** `#partner` and `/districts`. Two 4:3 photos for the two primary partner types or the two
featured districts that already exist (district photos from the "places of Tamil Nadu" pool theme), then the
remaining existing items as hairline link rows. Also the right pattern for **About** sub-sections and the footer of
long pages ("Go deeper").

### P12. Event rows (list and calendar)

**AIWO** (`#events` home, `/events` calendar)
- Home: rows of `grid-cols-12` with **date in mono 30 px/300** (cols 1–3), h3 31 px/400 + 17 px muted 2-line
  description (cols 4–9), venue (20 px muted) and arrow link right-aligned (cols 10–12). `padding-block: 48px`,
  hairline bottom, hover hairline → Ink.
- Calendar page: a 12-month axis (mono month labels over a 1 px Ink line) with short Ink bars under each event's
  month, then month filter chips (pressed = Ink), then compact rows (date | title | city | audience | →), 18 px
  padding.

**Apply to StartNet:** exactly DESIGN-v2 6.3 "AIWO hairline event rows", with Inter tabular dates (32 px/400) instead
of mono. On home `#coming-up` at ≥1024 this can replace the scroller if there are 3–5 items; keep the scroller
otherwise. The **year-at-a-glance axis** is a good fit for the Events hub if the data has month values; draw it with
Ink lines, no dots.

### P13. Editorial / journal block

**AIWO** (`#journal`)
- 12-col: a featured story in cols 1–7 (**16:10 photo**, 742×464, label + h3 31 px + meta) and a list of 3 stories in
  cols 9–12 as hairline rows (20 px/300 title, 15 px meta + mono read time). Cards: image `scale(1.02)` over 320 ms on
  hover, title underlines.

**Apply to StartNet:** `#stories` and the Insights hub. Featured story with its own image (or the insights pool)
at 16:10, then the other existing stories as hairline rows with tabular dates. Same items, same order (the first
item is the featured one).

### P14. Three-up "work with us" columns

**AIWO** (`#work-with-us`)
- 3-up grid, each column a whole-card link with a **1 px Ink top rule**, `padding-top: 28px`: h3 31 px/400 with a
  full stop, a 17 px/300 muted line at 38ch, arrow link at the bottom (`flex-col h-full` so links align).

**Apply to StartNet:** `/partner` PartnerType columns (DESIGN-v2 says "top-rule columns"), the home `#i-am` persona
entry points if they render as links, and the four brand doors on `OurBrands` when shown without photos.

### P15. CTA band (closing)

**AIWO**
- Full-bleed brand-colour band (umber `#442723`; black on some pages), band padding 158 px. Left-aligned: display h2
  (78.8 px/200, `max-width: 14ch`) with one serif word, serif lede at 36ch in the muted colour, then a filled white
  `btn-lg` + a white ring `btn-lg`, 12 px apart.
- The only decoration is **one 1 px circle outline** (900×900 SVG, line colour ≈ 20% white) partly off-canvas at the
  bottom right. It reads as calm, not as a pattern.

**Apply to StartNet:** `.cta-band` ("Start where you are."). **Conflict:** DESIGN-v2 3.15 says "centred quiet
statement plus pulli grid". Replace the pulli grid (a dot-grid graphic the user dislikes) with AIWO's single
hairline arc in `--night-line-strong`, or nothing. Left-align the statement on the 12-col grid (cols 1–8), lede
below, existing buttons left: Paper filled + Paper ring. Ground: Ink. Make it visually different from the footer that
follows by a 1 px `--night-line` hairline and a bigger type size (`--text-display-xl`).

### P16. FAQ / accordion

**AIWO** (`/cations/healthcation`)
- 12-col split: cols 1–5 hold uppercase label, h2 (with serif word) and an arrow link to a human ("Ask a concierge");
  cols 7–12 hold the accordion. Rows: 20 px/400 question, a + at the right, `padding-block: 28px`, hairline
  separators top and bottom of the list. Open state swaps + for −.

**Apply to StartNet:** `#questions` on home and every FAQ. DESIGN-v2 already has the 4/8 sticky split; use AIWO's
row spec (20 px question, 28 px padding, + / − in Ink, 1 px hairlines) and put the existing contact link under the
heading on the left.

### P17. Sticky section sub-nav and sticky booking bar (detail pages)

**AIWO** (`/cations/healthcation`)
- Under the header, a white strip with **pill chips** for each in-page section (Outcome, How it works, …), 44 px,
  the current one Ink-filled (scroll-spy), sticky at `top: var(--header-h)` and hiding with the header.
- A **sticky bottom bar** (white, hairline top, 72 px): item name, a format `<select>`, venue, tabular price, a filled
  "Plan my …" button and a ring "WhatsApp" button.

**Apply to StartNet:** the About in-page nav and Brand sub-nav (DESIGN-v2 3.4 and 6.4) as this chip strip with
scroll-spy. For ProgrammeDetail and EventDetail, the existing `BottomCtaBar` (3.17) can take this layout:
programme/event name, the existing key fact (deadline or date), and the existing apply/register CTA. No new prices or
data.

### P18. Footer

**AIWO**
- Black. Top block, 12-col: a **large wordmark** (240 px wide) in cols 1–6, newsletter in cols 7–12 (h2 31 px/400 with
  serif word, 20 px/300 muted lede, a square 1 px field with a label above, white pill Subscribe, 15 px privacy line).
- `margin-top: 80px`, hairline (`#4A4A4A`), then **6 link columns** (`grid-cols-6`, 189 px each): uppercase 16 px
  muted heading, links 16 px/300 white at 90%, about 44 px apart.
- Hairline, then a disclaimer (left, 8 cols) and social links (right). Hairline, then legal links in a row and the
  © line (15 px muted). A final tiny uppercase "AIWO · HOME" breadcrumb.
- Mobile: columns collapse to 2-up, newsletter stacks above.

**Apply to StartNet:** the footer already has the newsletter ("One email. What opened, what happened, what's next").
Take the **layout**: wordmark large on the left and newsletter on the right in one row, a hairline, then the existing
link columns as equal columns (`--night-text-2` links, 500-weight 14 px muted heads per brand book, sentence case),
then disclaimer/social, then legal + © row. Keep all links and their order.

---

## 3. Motion (AIWO, measured) and the StartNet mapping

| effect | AIWO value | StartNet mapping |
|---|---|---|
| Durations | 240 ms (hover, colour), 280 ms (header, panels, block reveal), 320 ms (media), 900 ms (hero word fade), 1 s (count) | `--dur-3`, `--dur-header`, `--dur-4`, `--dur-reveal` 600, `--dur-count` |
| Easing | enter `cubic-bezier(.2,0,0,1)`; move `cubic-bezier(.4,0,.2,1)`; header exit `cubic-bezier(.4,0,1,1)` | `--ease-snap`, `--ease-standard`, `--ease-header-exit` (all exist) |
| Block reveal | `opacity:0; transform: translateY(8px)` → visible, 280 ms, on enter (Framer style inline) | DESIGN-v2 12 px / 600 ms. AIWO's is faster and smaller; it feels calmer. **Recommend 8 px / 400 ms** for blocks, 600 ms only for media. |
| Hero h1 | word-by-word opacity, 900 ms, stagger 60 ms from 80 ms; no movement | KineticHeadline: opacity-only words, letters never move |
| Scroll scrub | word opacity 0.18 → 1, linked to the paragraph's position | ScrubText, floor 0.25, once per page |
| Header | hide on down, show on up, 280 ms | same |
| Mega menu | opacity + 8 px, ~280 ms, scrim behind | same, with `--hover-intent` 150 ms |
| Hover: button | bg tone shift 240 ms | same, tone shift only |
| Hover: arrow | arrow `translateX(4px)` 240 ms + label underline | `.arrow-link` (exists in DESIGN-v2 2.5) |
| Hover: media card | img `scale(1.02)` 320 ms + title underline | 1.03 / 480 ms per DESIGN-v2; either is fine, keep one |
| Hover: list row | hairline → Ink, 240 ms | same, plus Bone row tint on events only |
| Carousel | native scroll-snap, "Drag" cursor chip, counter | Scroller + optional chip |
| Smooth scroll | **Lenis** on `<html class="lenis">` | **Do not add** (no new dependencies; native scroll is fine) |
| Page transitions | `@view-transition { navigation: auto }` (cross-document) | SPA already has its own; optional `document.startViewTransition` crossfade 200 ms where supported |
| Reduced motion | all `--dur-*` → 0 (colour 120 ms), `--rise: 0` | same, plus `data-motion="reduced"` |

What AIWO **does not** do, and that is part of why it feels expensive: no parallax, no pinned sections, no bouncing,
no letter animation, no hover lifts or shadows, no gradient blobs, no glass blur, no autoplaying carousels, no
cursor trails. Every motion is short, small and the same.

---

## 4. Mobile (390) specifics

- Margin 31 px (≈ 8vw), band padding 82 px. h1 41 px, h2 32.5 px at 300, body 17 px, labels stay 16 px.
- Split heroes stack **photo first** (4:5), then text. Full-bleed photo bands become near-portrait (390×692).
- Scrollers keep the right-edge bleed with 278 px cards (71% of the viewport, so the next card peeks).
- Places/journal media become full content width (327 px) at 4:3 / 16:10.
- Header 56 px with a text "Menu" button (86×44); drawer per P1.
- Hit targets ≥ 44 px everywhere (chips 44, buttons 48/56, accordion rows 56).

**Apply to StartNet:** same order of stacking; StartNet's 16 px side gutter rule stays (brand), but use 20 px at
390 if the layout allows, which is closer to AIWO's breathing room. Never centre paragraphs on mobile.

---

## 5. Photography direction (from AIWO, for StartNet's own slots)

AIWO's photos share five traits; use them to pick from StartNet's pool and to brief the photographer:
1. **Real people doing the thing**, mid-action, often from behind or in profile (no posed handshakes, no laptops
   facing camera, no smiling-at-lens stock).
2. **Natural light, warm-neutral grade**, low contrast, no filters, no duotone.
3. **One subject, simple background**, lots of negative space where text can sit.
4. **Fixed ratios by role:** hero 4:5 (half-bleed) · rail cards 4:5 · places 4:3 · featured story 16:10 · full-bleed
   band ≈ 2:1 desktop / 9:16 mobile · mega-menu feature 4:5.
5. **Never decorative**: every photo is tied to the card it sits on (each 'cation has its own scene).

For StartNet: Research → people in labs and at whiteboards; Vibe → students building together; Connect → small
rooms of professionals in conversation; Women → women founders at work; districts → recognisable places of Tamil
Nadu; events → only that event's own photos (PHOTOS.md). Each slot must show a **different** photo (no repeats on a
page; the photo system already fixes one per slot). Use `focus`/`focusMobile` so faces survive the 4:5 and 16:9 crops.

---

## 6. What makes it feel premium (checklist)

- [ ] **Photography carries the page**; graphics never do. No pattern art in heroes.
- [ ] **One ground per band**, alternating two light grounds, ≤ 1–2 dark bands, one coloured closing band.
- [ ] **Huge, light headlines with one serif italic word**, and lots of air around them (label 24 px above, lede 32 px
      below, content 56–64 px below).
- [ ] **Big, readable body** (20 px at desktop, 1.6 leading, 300–400 weight) at a narrow measure (36–66ch).
- [ ] **Left-aligned on a visible 12-col grid**, text blocks offset by one column where the content is a statement.
- [ ] **Hairlines, not boxes.** 1 px rules for rows, an Ink rule over step columns, inset 1 px frames for cards.
- [ ] **No shadows, no gradients, no blur, no glass** on content.
- [ ] **One filled button per composition**; everything else is an arrow link.
- [ ] **Numbers as data**: tabular, muted, smaller, aligned right in rows; one giant numeral per stat band.
- [ ] **Full-bleed media** that runs to the viewport edge (hero right half, photo bands, scroller tracks).
- [ ] **Short, identical motion**: one reveal, one hover grammar, the header that gets out of the way.
- [ ] **Generous band padding** (≈ 158 px at 1440) and consistent internal gaps.
- [ ] **Tight colour discipline**: one accent colour point per page (AIWO's amber numeral; StartNet's red stop).

---

## 7. Top 15 changes for StartNet, prioritised

| # | priority | change | where | owner |
|---|---|---|---|---|
| 1 | P0 | Replace the home hero's diamond/pulli art with a **split photo hero** (P2): text cols 1–6 on Ink, HERO_PICKS photo cols 7–12 edge to edge, 4:5 photo first on mobile | `pages/Home.jsx/.css`, `pages/home/*` | Home agent |
| 2 | P0 | **Put photographs in every card family** that has a pool theme: brand tiles 4:5, programme cards 3:2, story feature 16:10, partner/district 4:3 (P5, P9, P11, P13). One unique photo per slot | home, brands, programmes, insights, partner | page agents (ArtImage already supports it) |
| 3 | P0 | **CTA band**: drop the pulli grid; left-aligned display statement + lede + Paper filled and ring buttons; optional single hairline arc (P15) | `CTABand` usage per page | Foundation owner later; page agents for placement |
| 4 | P0 | **One filled button per composition**; second actions become arrow links with the 4 px arrow nudge (1.5) | all heroes and section heads | page agents |
| 5 | P1 | **Header hides on scroll down / returns on scroll up** (280 ms, `--ease-header-exit`), 2 px Paper underline on the open item (P1) | `layout/Header.*` | layout owner (after the current workflow) |
| 6 | P1 | **Mega menu as a full-width Paper sheet** on the 12-col grid with a photo feature card in cols 8–12 and a 25% Ink scrim (P1) | `layout/MegaMenu.*` | layout owner |
| 7 | P1 | **FactBand as the dark framed "card + key points" split** with one giant count-up numeral (Marigold or Paper) and hairline data rows (P4) | `#where-things-stand` | Home agent |
| 8 | P1 | **FounderStory as a full-bleed photo band + horizontal 2 px timeline** with a ringed Ink node (P8), replacing pulli art | FounderStory / PulliTimeline section | Home agent |
| 9 | P1 | **Event rows** (date | title + 2-line description | venue + arrow) with hairlines at ≥1024 (P12) | `/events`, home `#coming-up` | Events agent |
| 10 | P1 | **Scroller header row**: tabular "01 / 08" counter + two 48 px circular ring buttons; track bleeds to the right edge (P5) | Scroller usages | page agents |
| 11 | P2 | **Section header rhythm**: label → h2 24 px, h2 → lede 32 px (lede 20 px, `--color-text-2`, 40–66ch), header → content 64 px; header block max 832 px | all sections | page agents (via SectionHeader props/classes in page CSS) |
| 12 | P2 | **Step columns under a 1 px Ink top rule** with tabular numbers (P7) and **top-rule link columns** (P14) | `#how-it-works`, `/partner`, `#i-am` | Home, Partner agents |
| 13 | P2 | **FAQ rows**: 20 px question, 28 px padding, +/− Ink, hairlines; heading + contact link sticky on the left (P16) | `#questions`, all FAQs | page agents |
| 14 | P2 | **Sticky pill sub-nav with scroll-spy** under the header on About, brand hubs and detail pages (P17) | about, brands, programme/event detail | page agents |
| 15 | P3 | **Footer layout**: large wordmark + newsletter in one row, hairline, equal link columns, legal row (P18); faster block reveal (8 px / 400 ms) | `layout/Footer.*`, motion tokens | layout/foundation owner (after the current workflow) |

Items 5, 6, 15 and the CTA band component touch `layout/**`, `components/**` or `styles/**`, which another workflow
is editing right now. Schedule them after it lands. Items 1, 2, 4, 7–14 are page-file work.

---

## Appendix A. Raw measurements (home, 1440×900)

| band | y | height | ground | notes |
|---|---|---|---|---|
| announcement | 0 | 56 | #0A0A0A | 15–16 px, dismiss |
| utility | 56 | 36 | #F2F0ED | right-aligned links |
| header | 92 | 73 | #FFF | 1 px #E2DFDA bottom; sticky; hide on scroll |
| hero | 165 | 891 | #F2F0ED | 6/6 split, photo 840×891 |
| idea (scrub) | 1055 | 1045 | white | pad 157.6 |
| score | 2100 | 1229 | black | card 742×759 + points |
| 'cations rail | 3330 | 1286 | white | cards 388×485 (4:5), gap 32 |
| stat | 4615 | 833 | stone | numeral 213 px |
| how (4 steps) | 5448 | 1333 | white | 4×300 px, Ink top rule |
| ninety days | 6781 | 1900 | stone | photo 1440×738 + timeline |
| outcomes | 8682 | 1155 | white | 3 framed cards 410 wide |
| LifeOS | 9837 | 1253 | stone | phone 300×650, r44 |
| places | 11090 | 1542 | white | 2×632×474 (4:3) + rows |
| events | 12633 | 1226 | stone | rows 201 px tall |
| governance | 13860 | 1130 | white | 5/7: photo 521×390 + 2×2 points |
| mission | 14990 | 853 | stone | serif statement 51 px, scrub |
| journal | 15844 | 1144 | white | 742×464 (16:10) + rows |
| work with us | 16988 | 662 | stone | 3 top-rule columns |
| CTA | 17651 | 960 | umber #442723 | 1 px circle 900×900 |
| footer | 18612 | 1444 | black | wordmark 240×78, 6 link cols |

Inner pages repeat the same kit: split hero (coloured band + photo right), 3-up 4:5 card grids (410×513), event 4:3
grids (410×307), hairline price/format rows (`li` 12-col, 32 px padding), FAQ 5/7, a dark or umber CTA band, the same
footer. Detail pages add the sticky chip sub-nav and the sticky booking bar.
