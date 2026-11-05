# Techstars content sizing: extracted values and the StartNet scale

Source: https://www.techstars.com/ (home), /accelerators, /portfolio, /the-line (blog index), and one article
(/blog/founder-advice/building-aligned-okrs-that-drive-team-execution). Fetched 2026-11-05 with curl.

How the values were taken: Techstars is a Next.js + MUI v6 site. Its two linked stylesheets
(`/_next/static/chunks/0n-4zgm7p7ou8.css`, `2jsr0zj6aggph.css`, 3 KB total) only hold `@font-face`.
Every layout and type rule lives in the server-rendered Emotion `<style data-emotion="mui ...">` block
(131 KB on home). I extracted that CSS from all five pages, parsed it by `@media` block, and joined every
`.mui-xxxx` class to the element that uses it in the HTML. Each value below comes from a real element on a
real page. Where an MUI default is overridden, only the final (winning) declaration is listed.

Fonts: Suisse Intl, loaded as four separate families (`suisseRegular` 400, `suisseMedium` 500,
`suisseSemibold` 600, `suisseBold` 700). JetBrains Mono is loaded but the one "phosphor" label that uses it
overrides it back to Suisse. Weight is set by switching family, so `font-weight:300` on a semibold heading
still renders as Semibold.

---

## 1. Techstars: what the site uses

### 1.1 Base

| Item | Value |
|---|---|
| `html` font-size | browser default 16px. Not set. `-webkit-text-size-adjust:100%` |
| `body` | 16px / 24px, letter-spacing 0.15px, suisseRegular 400, color `rgba(0,0,0,.87)`, bg `#f5f5f5` |
| Fluid range of every `clamp()` | 375px → 1440px. Checked by solving each clamp, e.g. h1 `1.062rem + 5.070vw` = 36px at 375 and 90px at 1440 |
| Breakpoints (MUI defaults) | xs 0, sm 600, md 900, lg 1200 (xl 1536 never used). Use counts: `min-width:900px` 119, `1200px` 42, `600px` 34, `max-width:899.95px` 20 |

### 1.2 Headings and display

| Role (element / MUI variant / page) | Desktop 1440 | Mobile 375 | Exact CSS | Line-height | Letter-spacing | Weight (family) |
|---|---|---|---|---|---|---|
| Home hero `<h1>` ("In a World of Noise…") | 90px | 36px | `clamp(2.250rem, 1.062rem + 5.070vw, 5.625rem)` | 1.16 | `clamp(-0.120rem, -0.017rem + -0.115vw, -0.044rem)` = -0.7px → -1.9px | Bold 700 |
| Inner hero `<h1>` (/accelerators, /portfolio) | 90px | 36px | same clamp | 1.1 | 0 | Bold 700 |
| Article / blog index `<h1>` (variant `display2`) | 60px | 60px (no media rule in the SSR CSS) | `60px` | 1.1 (article), 1.0 (/the-line) | -0.02em / -0.03em | Bold 700 |
| Section title `<h2>` (variant `h1`), used by all ~9 home sections and the CTA band | 56px | 32px | `clamp(2.000rem, 1.472rem + 2.254vw, 3.500rem)` | 1.15 | 0 | Semibold 600 (Bold 700 on /accelerators) |
| Sub-section `<h2>` (variant `h2`, "Your Advantage. Worldwide.") | 24px | 24px | `24px` | 32px (1.333) | -0.25px | Semibold |
| Feature card title `<p>` (portfolio story card) | 24px from 900 | 20px | 20px/28px → 24px/32px at 900 | 1.4 → 1.333 | 0 → -0.25px | Semibold |
| News/blog card title `<h3>` (variant `h5`) | 22px | 16px | `clamp(1.000rem, 0.868rem + 0.563vw, 1.375rem)` | 1.25 | 0 | Bold 700 |
| Vertical tile title `<span>` (variant `h6`) | 20px | 18px | 18px (0) / 19px (600) / 20px (900) | 1.25 | 0 | Bold 700 |
| Related-posts heading `<h2>` (variant `h4`) | 18px | 18px | `18px` | 24px | 0 | Semibold |
| MUI theme `h5` default (article related cards) | 24px | 24px | `1.5rem` | 1.334 | 0 | Regular |
| Logo-wall statement `<p>` ("Techstars Portfolio Companies") | 40px | 22px | `clamp(1.375rem, 0.979rem + 1.690vw, 2.500rem)` | 44px | 0 | Semibold |

### 1.3 Stats

| Role | Desktop | Mobile | CSS | LH | LS | Weight |
|---|---|---|---|---|---|---|
| Home stat number ("11,171", "$332B") | 56px | 30px | `clamp(1.875rem, 1.303rem + 2.441vw, 3.500rem)` | 1.05 | -0.02em | Bold |
| Portfolio stat number ("29") | 36px (≥900) | 28px | `1.75rem` → `2.25rem` at 900 | 1 | -0.02em | Bold |
| Stat label | 14px | 14px | body2 | 20px | 0.15px | Regular |

### 1.4 Body, lead, small, caption

| Role | Size | Line-height | Letter-spacing | Weight | Max-width / colour |
|---|---|---|---|---|---|
| Hero subhead `<p>` (home) | 20px from 900, 16px below | 28px / 24px | 0 / 0.15px | Semibold at 20px, Regular at 16px | — |
| Article dek (variant `h6`) | 20px | 1.6 (32px) | 0 | Regular | — |
| Section lede `<p>` (body1) | 16px | 24px | 0.15px | Regular | `rgba(0,0,0,.6)`, max-width 480px / 560px / 720px |
| Body (body1) | 16px | 24px | 0.15px | Regular | `.87` black |
| Article body (`.payload-richtext`) | 16px (inherits body1) | 24px | 0.15px | Regular | `p + p { margin-top: 8px }`, column 900px |
| Small (body2) | 14px | 20px | 0.15px | Regular, 600 on "Read More" | — |
| subtitle2 | 14px | 20px | 0.1px (0.12em on the "[REDACTED]" label) | Medium 500 | — |
| Caption | 12px (0.75rem) | 1.66 | 0 | Regular | dates, card meta |
| body3 / source note | 12px | 16px | 0.2px | Regular | — |
| Footer link | 14px | 20px | 0.15px | Regular | stacked with `+ margin-top:16px` |

### 1.5 Eyebrow / label

| Variant | Size | LH | Transform | Tracking | Weight | Spacing |
|---|---|---|---|---|---|---|
| `overline` ("ABOUT TECHSTARS", "ACCELERATORS") | 12px (0.75rem) | 2.66 (32px) | uppercase | 0.1em | Bold 700 | sits directly on the h2 (its 32px line-height is the gap) |
| `phosphor` ("29 UNICORNS & COUNTING") | 14px | inherit | uppercase | 0.08em | Bold | margin-bottom 16px (mobile) / 24px (≥900), colour `#39C463` |
| Tab (`MuiTab`) | 14px | 1.25 | uppercase | — | Medium 500 | min-height 48px, padding 12px 16px |

### 1.6 Buttons, chips, icon buttons

All buttons are pills (`border-radius: 9999px`), `text-transform: none`, suisseSemibold.

| Button (class, use) | Height | Padding-inline | Font | Border |
|---|---|---|---|---|
| Nav CTA "Apply Today" (text variant, green fill) | 40px | 24px (block 8px) | 14px / 24px, Bold, ls 0.15px | none |
| Hero primary "Apply Today" (contained, size large) | 48px | 22px | 16px / 24px | none |
| Outline "Learn more" (size medium) | 40px | 32px | 14px / 24px | 1px solid `#B9B9C2` or `#fff` on dark |
| Footer "Subscribe" (outlined large, on dark) | 48px | 32px | 16px / 24px | 1px `rgba(255,255,255,.6)` |
| Icon button (carousel arrows, play) | 48 × 48px | 8px | icon 24px | radius 50% |
| Chip medium | 32px | 12px | 13px MUI default | pill |
| Chip small (card tag "Newsroom", "Founder Advice") | 24px | 8px | 13px | pill, 1px `#bdbdbd` on outline chips |

Focus: `outline: 2px solid #000; outline-offset: 2px`. Hover on outline: bg `#F7F7F7`, border goes to `.87` black.

### 1.7 Header

| Part | Value |
|---|---|
| Utility bar (black) | min-height 40px |
| Main bar | height 56px below 900, 72px from 900. Sticky, `z-index:1100`, white |
| Nav content width | `--nav-content-max-width: 1440px`, padding-inline 24px (16px below 900) |
| Hero min-height | `calc(100svh - var(--nav-height, 4rem))` |

### 1.8 Containers and gutters

| Container | max-width | Side padding | Notes |
|---|---|---|---|
| Page container (all section content) | 1680px | `clamp(1.500rem, -0.613rem + 9.014vw, 7.500rem)` = 24px @375 → 59px @768 → 120px @1440 (stays 120px above) | the 16px/24px MUI defaults at 0/600 are overridden by the clamp. Content width = 1200px at 1440, 1440px at 1680+ |
| Nav | 1440px | 24px (16px <900) | — |
| Article column | 900px | 16px, 24px from 600 | padding-top 24px / 32px |
| Text blocks | 480px (lede), 560px (lede), 720px (header block), 760px (centred CTA block), 900px (wide header) | — | — |

### 1.9 Section vertical padding

| Section type | Mobile (<900) | Desktop (≥900) |
|---|---|---|
| Standard content section (`<section>`, ~10 per home page) | 80px top / 80px bottom | 128px / 128px |
| Home hero | top `clamp(6.000rem, 4.151rem + 7.887vw, 11.250rem)` = 96px → 180px; bottom `clamp(2.500rem, 1.268rem + 5.258vw, 6.000rem)` = 40px → 96px | same clamps, plus min-height 100svh minus nav |
| Stat / ticker band ("29 UNICORNS") | 24px | 32px |
| Logo wall | 32px | `clamp(2.750rem, 2.310rem + 1.878vw, 4.000rem)` = 44px → 64px |
| Compact listing blocks (portfolio, blog index) | 48px | 64px or 72px |
| Inner page hero (/the-line) | 48px | 72px |
| Footer | 48px top / 32px bottom | 64px / 40px |

Tablet (600–899) uses the mobile values. The only fluid values are the hero and the logo wall.

### 1.10 Grids and gaps

| Grid | Columns (0 / 600 / 900 / 1200) | Gap |
|---|---|---|
| Mentor/people grid | 2 / 2 / 4 / 4 | 16px, 24px from 600 |
| Vertical tiles (/accelerators) | 2 / 2 / 3 / 3 | 16px, 24px from 900 |
| Blog cards (/the-line) | 1 / 1 / 2 / 3 | 16px |
| Footer link columns | 1 / 2 / 3 / 5 | 32px |
| Logo grid (/portfolio) | 2 / 2 / 3 / 5 | 0 (hairline cells) |
| Two-column split (text + aside) | 1fr, then `minmax(0,1fr) auto` at 900 | 48px, 64px from 900 |
| Most common gap values | 24px (19 uses), 16px (15), 32px (9), 64px (7), 48px (7), 12px (5), 4px (8) | — |

### 1.11 Cards, radii, images

| Card | Padding | Radius | Aspect / size |
|---|---|---|---|
| Stat / vertical tile | 20px, 24px from 900; inner gap 4px | 12px | 6/5 from 900 |
| Label tile ("Health") | 16px, 20px from 900 | — | — |
| Quote / feature card ("None of this would have been possible…") | 24px, 48px from 900; gap 24px | 16px | — |
| Large media card | — | 16px | min-height 280px, 420px from 900 |
| News / blog card image | — | 16px (8px on small cards) | 3/2 (8 uses) |
| Video | — | 20px | 16/9 |
| Portrait feature image | — | 16px | 17/14 |
| Small list card | border 1px `rgba(0,0,0,.12)` | 8px | — |

Radius use counts: 9999px/999px (pills) 91, 4px 53, 50% 33, 16px 24, 8px 18, 12px 4, 20px 1.

### 1.12 Home section order (for rhythm reference)

1. Hero (h1 36→90, subhead, 48px pill CTA) · 2. Stat band "29 UNICORNS & COUNTING" (24/32 padding) ·
3. Network Highlights (3 news cards) · 4. About: "Backing Ambitious Founders Since 2006" plus stat tiles ·
5. "The Backbone of the Techstars Network" · 6. "Your Advantage. Worldwide." (tabbed: Accelerators / Mentors / Portfolio) ·
7. Highlighted Verticals (carousel, 48px arrows) · 8. Accelerators · 9. Mentors (4-column people grid) ·
10. Portfolio logo wall plus story card · 11. Newsroom (3 cards) · 12. Blog (6 cards) · 13. Book promo "Chasing Unicorns" ·
14. Footer (5-column links, Subscribe outline button).
Every section from 3 onward has the same structure: overline (12px caps) → h2 32→56 → lede 16px at 60% ink, max 480–720px → content.

---

## 2. Recommended StartNet scale

How I chose each value:
- Every fluid value runs from 360px to 1440px (the brand book range). Formula:
  `clamp(min, min − slope·360 + slope·100vw, max)` with `slope = (max − min) / 1080`.
- Where Techstars and the StartNet Brand Book (the current `client/src/styles/tokens.css`) differ by 2px or less,
  the brand book value stays. Where they differ in structure (section-head size, section padding, container width,
  gutter, button height, stat size), the Techstars value wins, because the user named Techstars as the sizing reference.
- Typeface stays Inter 400/500 with one Instrument Serif Italic accent word per English headline. Techstars uses 600/700.
  To keep the same visual weight at 500, StartNet headings take tighter tracking (-0.02 to -0.035em).
- Colour does not change: Ink #0C1719 text, Paper #F4F3EF ground, SNX Red #EF4444 as the single full stop.

### 2.1 Type tokens

| Token | px 360 → 1440 | CSS | LH | Tracking | Weight | Techstars source | Today in `tokens.css` |
|---|---|---|---|---|---|---|---|
| `--fs-display` | 40 → 88 | `clamp(2.5rem, 1.5rem + 4.444vw, 5.5rem)` | 1.02 | -0.04em | 400 | home h1 36→90 | `--text-display-2xl` same (kept) |
| `--fs-display-page` | 36 → 72 | `clamp(2.25rem, 1.5rem + 3.333vw, 4.5rem)` | 1.05 | -0.035em | 400 | inner h1 36→90. Capped at 72 because StartNet page titles run 3–5 words, Techstars 2 | `--text-display-xl` same (kept) |
| `--fs-h1` | 36 → 60 | `clamp(2.25rem, 1.75rem + 2.222vw, 3.75rem)` | 1.08 | -0.035em | 500 | article h1 60px | was 32→56: **change** |
| `--fs-h2` | 32 → 56 | `clamp(2rem, 1.5rem + 2.222vw, 3.5rem)` | 1.12 | -0.025em | 500 | section h2 32→56 (1.15) | was 26→40: **change**. This is the biggest visible shift |
| `--fs-h3` | 20 → 24 | `clamp(1.25rem, 1.167rem + 0.3704vw, 1.5rem)` | 1.3 | -0.015em | 500 | feature card 20→24, sub-section h2 24/32 | same (kept) |
| `--fs-h4` | 16 → 22 | `clamp(1rem, 0.875rem + 0.5556vw, 1.375rem)` | 1.25 | -0.01em | 500 | news/blog card h3 16→22 | was 19→24: **change** (card titles) |
| `--fs-h5` | 18 → 20 | `clamp(1.125rem, 1.083rem + 0.1852vw, 1.25rem)` | 1.25 | 0 | 500 | vertical tile 18/19/20 | was 17→20 (≈ kept) |
| `--fs-h6` | 16 → 18 | `clamp(1rem, 0.9583rem + 0.1852vw, 1.125rem)` | 1.33 | 0 | 500 | related heading 18/24 | was 15→17: **change** |
| `--fs-stat` | 32 → 56 | `clamp(2rem, 1.5rem + 2.222vw, 3.5rem)` | 1.05 | -0.03em | 400 | stat 30→56 (1.05, -0.02em) | was 48→84: **change** (stats were bigger than section heads) |
| `--fs-lead` | 18 → 20 | `clamp(1.125rem, 1.083rem + 0.1852vw, 1.25rem)` | 1.4 (28px at 20) | 0 | 400 | hero subhead 16→20/28, article dek 20/1.6 | same (kept) |
| `--fs-body` | 16 → 17 | `clamp(1rem, 0.9792rem + 0.09259vw, 1.0625rem)` | 1.5 | 0 | 400 | 16/24 | same (kept) |
| `--fs-small` | 14 → 15 | `clamp(0.875rem, 0.8542rem + 0.09259vw, 0.9375rem)` | 1.43 (20px) | 0 | 400 | body2 14/20 | same (kept) |
| `--fs-caption` | 13 (14 on <768) | `0.8125rem` | 1.5 | 0 | 400 | caption 12/1.66. StartNet floor is 13px, 14px on phones | same (kept) |
| `--fs-eyebrow` | 15 | `0.9375rem` | 1.2 | 0 | 500 | overline 12px caps, 0.1em, 700 | keep the brand dot label (15px, sentence case, Ink dot, never red). Take only the Techstars spacing (2.2) |
| `--fs-button` | 14 (md), 16 (lg) | `0.875rem` / `1rem` | 1.5 | 0 | 500 | 14/24 and 16/24 | new |

Accent word: `--font-accent` Instrument Serif Italic at the same `font-size` as its headline, `letter-spacing: 0`,
one word per English headline, never inside `--fs-h4` and below.

### 2.2 Space, layout and component tokens

| Token | Value | CSS | Techstars source | Today |
|---|---|---|---|---|
| `--container` | 1680px | `105rem` (box-sizing border-box, gutters inside) | page container 1680 | `--container-max: 80rem` (1280): **change** |
| `--gutter` | 24 → 120px | `clamp(1.5rem, -0.5rem + 8.889vw, 7.5rem)` | `clamp(1.5rem, -0.613rem + 9.014vw, 7.5rem)` | 20/24/32 stepped: **change** |
| `--container-content` | 1200px at 1440, 1440 at 1680+ | `min(100%, var(--container)) - 2 * var(--gutter)` | derived | `--page-margin` must become `max(var(--gutter), calc((100vw - var(--sbw,0px) - var(--container)) / 2 + var(--gutter)))` |
| `--container-nav` | 1440px, padding-inline 24px (16px <900) | `90rem` | nav 1440 | new |
| `--measure-article` | 900px column (868px text) | `56.25rem` | article 900 | `--measure: 68ch` (kept for body copy) |
| `--measure-head` | 720px | `45rem` | header block 720 / 760 | was 52rem (832): **change** |
| `--measure-lede` | 560px | `35rem` | lede 480–560 | was 44ch (≈ same) |
| `--space-section` | 80 → 128px | `clamp(5rem, 4rem + 4.444vw, 8rem)` | 80 / 128 stepped at 900 | was 64→128: **change** min |
| `--space-section-tight` | 48 → 64px | `clamp(3rem, 2.667rem + 1.481vw, 4rem)` | listing blocks 48/64, logo wall 44→64 | was 48→80 |
| `--space-band` | 24 → 32px | `clamp(1.5rem, 1.333rem + 0.7407vw, 2rem)` | stat/ticker band 24/32 | new |
| `--space-hero-top` | 96 → 180px | `clamp(6rem, 4.25rem + 7.778vw, 11.25rem)` | hero top clamp | new. Measure it below the sticky header, not under it |
| `--space-hero-bottom` | 40 → 96px | `clamp(2.5rem, 1.333rem + 5.185vw, 6rem)` | hero bottom clamp | new |
| `--hero-min-h` | `calc(100svh - var(--header-h))` | — | same | new |
| `--space-head-gap` (section header → content) | 32 → 56px | `clamp(2rem, 1.5rem + 2.222vw, 3.5rem)` | 48px gap between head and grid | was 40→64 |
| `--space-label-gap` (eyebrow → h2) | 16 → 24px | `clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem)` | phosphor mb 16/24 | was 24 fixed |
| `--space-lede-gap` (h2 → lede) | 16px (mobile) → 24px | `clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem)` | stack gap 24 | was 32 |
| `--gap-grid` | 16 → 24px | `clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem)` | 16 / 24 at 600–900 | `--space-grid-row: 3.5rem` (56) is too loose for card grids: use `--gap-grid` for both axes, and keep 56 only between stacked editorial rows |
| `--gap-grid-loose` | 32px | `2rem` | footer/link columns | new |
| `--gap-split` | 48 → 64px | `clamp(3rem, 2.667rem + 1.481vw, 4rem)` | 48 / 64 at 900 | new |
| `--pad-card` | 20 → 24px | `clamp(1.25rem, 1.167rem + 0.3704vw, 1.5rem)` | tile 20/24 | new |
| `--pad-card-lg` | 24 → 48px | `clamp(1.5rem, 1rem + 2.222vw, 3rem)` | quote card 24/48 | new |
| `--radius-card` | 12px | — | tiles 12 | `--radius-lg` 12 (kept) |
| `--radius-media` | 16px | — | image cards 16 | was 12: **change** |
| `--radius-video` | 20px | — | video 20 | `--radius-xl` 20 (kept) |
| `--radius-btn` | 9999px | — | all buttons pill | was 4px: **change**. Check this against the brand book's button page before shipping; if the book fixes 4px, keep 4px and adopt only the heights |
| `--btn-h-md` / `--btn-h-lg` | 40px / 48px | `2.5rem` / `3rem` | 40 / 48 | new |
| `--btn-px-md` / `--btn-px-lg` | 24px / 32px | `1.5rem` / `2rem` | 24–32 | new |
| `--btn-icon` | 48 × 48px, icon 24px | `3rem` | carousel arrows 48 | new |
| `--chip-h` / `--chip-h-sm` | 32px / 24px, padding-inline 12 / 8 | — | MUI chip | new |
| `--header-h` | 56px <900, 72px ≥900 | — | 56 / 72 | — |
| `--utility-bar-h` | 40px (only if a top strip is used) | — | 40 | — |
| Aspect ratios | `--ar-card: 3/2`, `--ar-tile: 6/5` (≥900 only), `--ar-video: 16/9`, `--ar-portrait: 17/14` | — | same | new |

Breakpoints: keep StartNet's 768 and 1280, and add 600 for the 1 → 2 column switch on card grids. Mapping from Techstars:
600 → 600, 900 → 768 (switch to desktop section padding and header 72px), 1200 → 1280 (switch to 3–5 columns).
Fluid tokens make most breakpoint switches unnecessary. Only column counts, header height and the 6/5 tile ratio need media queries.

Grid columns (StartNet components):
- Programme / sub-brand tiles: 1 / 2 (600) / 3 (768) / 4 (1280)
- News, Research, events cards: 1 / 2 (768) / 3 (1280), image 3/2, radius 16
- Founders / mentors: 2 / 2 / 3 (768) / 4 (1280)
- Partner logo wall: 2 / 3 (768) / 5 (1280), gap 0, hairline `1px solid rgb(12 23 25 / .12)`
- Footer: 1 / 2 (600) / 3 (768) / 5 (1280), gap 32

### 2.3 Drop-in CSS

```css
:root {
  /* Type, 360 → 1440 */
  --fs-display:      clamp(2.5rem, 1.5rem + 4.444vw, 5.5rem);        /* 40→88 home h1 */
  --fs-display-page: clamp(2.25rem, 1.5rem + 3.333vw, 4.5rem);       /* 36→72 inner hero h1 */
  --fs-h1:           clamp(2.25rem, 1.75rem + 2.222vw, 3.75rem);     /* 36→60 article / non-hero h1 */
  --fs-h2:           clamp(2rem, 1.5rem + 2.222vw, 3.5rem);          /* 32→56 section heads, CTA band */
  --fs-h3:           clamp(1.25rem, 1.167rem + 0.3704vw, 1.5rem);    /* 20→24 feature card, sub-section */
  --fs-h4:           clamp(1rem, 0.875rem + 0.5556vw, 1.375rem);     /* 16→22 news/blog card title */
  --fs-h5:           clamp(1.125rem, 1.083rem + 0.1852vw, 1.25rem);  /* 18→20 tile title */
  --fs-h6:           clamp(1rem, 0.9583rem + 0.1852vw, 1.125rem);    /* 16→18 */
  --fs-stat:         clamp(2rem, 1.5rem + 2.222vw, 3.5rem);          /* 32→56 */
  --fs-lead:         clamp(1.125rem, 1.083rem + 0.1852vw, 1.25rem);  /* 18→20 */
  --fs-body:         clamp(1rem, 0.9792rem + 0.09259vw, 1.0625rem);  /* 16→17 */
  --fs-small:        clamp(0.875rem, 0.8542rem + 0.09259vw, 0.9375rem); /* 14→15 */
  --fs-caption:      0.8125rem;                                      /* 13 (14 on phones) */
  --fs-eyebrow:      0.9375rem;                                      /* 15 dot label */
  --fs-button:       0.875rem;  --fs-button-lg: 1rem;

  --lh-display: 1.02; --lh-h1: 1.08; --lh-h2: 1.12; --lh-h3: 1.3; --lh-h4: 1.25;
  --lh-lead: 1.4; --lh-body: 1.5; --lh-small: 1.43; --lh-stat: 1.05;
  --ls-display: -0.04em; --ls-h1: -0.035em; --ls-h2: -0.025em; --ls-h3: -0.015em; --ls-h4: -0.01em; --ls-stat: -0.03em;

  /* Layout */
  --container: 105rem;                                               /* 1680, gutters inside */
  --gutter: clamp(1.5rem, -0.5rem + 8.889vw, 7.5rem);                /* 24→120 */
  --container-nav: 90rem;                                            /* 1440 */
  --measure-article: 56.25rem; --measure-head: 45rem; --measure-lede: 35rem;
  --header-h: 56px;

  /* Rhythm */
  --space-section:       clamp(5rem, 4rem + 4.444vw, 8rem);          /* 80→128 */
  --space-section-tight: clamp(3rem, 2.667rem + 1.481vw, 4rem);      /* 48→64 */
  --space-band:          clamp(1.5rem, 1.333rem + 0.7407vw, 2rem);   /* 24→32 */
  --space-hero-top:      clamp(6rem, 4.25rem + 7.778vw, 11.25rem);   /* 96→180 */
  --space-hero-bottom:   clamp(2.5rem, 1.333rem + 5.185vw, 6rem);    /* 40→96 */
  --space-head-gap:      clamp(2rem, 1.5rem + 2.222vw, 3.5rem);      /* 32→56 */
  --space-label-gap:     clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem);  /* 16→24 */
  --space-lede-gap:      clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem);  /* 16→24 */
  --gap-grid:            clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem);  /* 16→24 */
  --gap-grid-loose: 2rem;
  --gap-split:           clamp(3rem, 2.667rem + 1.481vw, 4rem);      /* 48→64 */
  --pad-card:            clamp(1.25rem, 1.167rem + 0.3704vw, 1.5rem);/* 20→24 */
  --pad-card-lg:         clamp(1.5rem, 1rem + 2.222vw, 3rem);        /* 24→48 */

  /* Components */
  --btn-h-md: 2.5rem; --btn-h-lg: 3rem; --btn-px-md: 1.5rem; --btn-px-lg: 2rem; --btn-icon: 3rem;
  --chip-h: 2rem; --chip-h-sm: 1.5rem;
  --radius-card: 12px; --radius-media: 16px; --radius-video: 20px; --radius-btn: 9999px; --radius-chip: 9999px;
  --ar-card: 3 / 2; --ar-tile: 6 / 5; --ar-video: 16 / 9; --ar-portrait: 17 / 14;
}
@media (min-width: 768px) { :root { --header-h: 72px; } }

.container { box-sizing: border-box; width: 100%; max-width: var(--container);
  margin-inline: auto; padding-inline: var(--gutter); }
.section { padding-block: var(--space-section); }
.section--tight { padding-block: var(--space-section-tight); }
.band { padding-block: var(--space-band); }
.hero { min-height: calc(100svh - var(--header-h));
  padding-top: var(--space-hero-top); padding-bottom: var(--space-hero-bottom); }
```

Compatibility aliases, so existing page CSS keeps working while it is migrated:
`--text-display-2xl: var(--fs-display)`, `--text-display-xl: var(--fs-display-page)`, `--text-h1: var(--fs-h1)`,
`--text-h2: var(--fs-h2)`, `--text-h3: var(--fs-h3)`, `--text-h4: var(--fs-h4)`, `--text-lede: var(--fs-lead)`,
`--text-body: var(--fs-body)`, `--text-small: var(--fs-small)`, `--text-caption: var(--fs-caption)`,
`--text-stat: var(--fs-stat)`, `--container-max: var(--container)`.

### 2.4 Tamil (`:lang(ta)`)

Rule: body and lead ×1.06, display and headings ×0.85 (inside the 0.82–0.9 band), `letter-spacing: 0` on every
token, looser leading. Instrument Serif accent words are English-only and do not appear in Tamil headlines.

| Token | English px | Tamil px | Tamil CSS |
|---|---|---|---|
| `--fs-display` | 40→88 | 34→75 (×0.85) | `clamp(2.125rem, 1.271rem + 3.796vw, 4.688rem)` |
| `--fs-display-page` | 36→72 | 31→61 | `clamp(1.938rem, 1.312rem + 2.778vw, 3.812rem)` |
| `--fs-h1` | 36→60 | 31→51 | `clamp(1.938rem, 1.521rem + 1.852vw, 3.188rem)` |
| `--fs-h2` | 32→56 | 27→48 | `clamp(1.688rem, 1.25rem + 1.944vw, 3rem)` |
| `--fs-stat` | 32→56 | 27→48 (numerals stay Latin, the ×0.85 is for the label line) | same as h2 |
| `--fs-h3`…`--fs-h6` | unchanged | unchanged (they are already close to body size) | — |
| `--fs-lead` | 18→20 | 19→21 (×1.06) | `clamp(1.188rem, 1.146rem + 0.1852vw, 1.312rem)` |
| `--fs-body` | 16→17 | 17→18 (×1.06) | `clamp(1.0625rem, 1.0417rem + 0.0926vw, 1.125rem)` (already in tokens.css) |
| `--fs-caption` | 13 | 14 floor | `0.875rem` |
| All `--ls-*` | negative | `0` | — |
| Line-heights | display 1.02 / heading 1.12 / body 1.5 | 1.25 / 1.35 / 1.8 | already in tokens.css |

Tamil buttons keep `--btn-h-md`/`--btn-h-lg` as `min-height`, not a fixed `height`, so two-line labels can wrap.

---

## 3. Changes from the current StartNet tokens, by visible effect

1. Section heads go from 26→40px to 32→56px (`--fs-h2`). This is the largest change and gives the Techstars/PnP feel.
2. Container goes from 1280px to 1680px with a 24→120px fluid gutter. Content stays 1200px wide at 1440 and grows to 1440px on wide screens.
3. Section padding minimum goes from 64px to 80px on phones. 128px on desktop is unchanged.
4. Stats come down from 48→84px to 32→56px, so they no longer outsize the section head.
5. Card titles go from 19→24px to 16→22px (`--fs-h4`), and card grid gaps come down to 16→24px.
6. Buttons become fixed-height 40px/48px. The pill radius depends on the brand book check in 2.2.
7. Image-card radius goes from 12px to 16px. Tiles stay 12px, video 20px.
