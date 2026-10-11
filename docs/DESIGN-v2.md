# StartNet UI v2: brand book applied, reference-grade finish

Status: implementation spec, 2026-10-09. It supersedes `docs/DESIGN.md` wherever the two disagree.
Sources, in order of authority: (1) **StartNet Brand Book v1.0** (`brand-book/out/StartNet-Brand-Book-v1.0.pdf`,
readable sources in `brand-book/pages/*.html`), (2) the reference analyses of aiwo-website-new-v1.vercel.app,
meridian.angellist.com and openvc.app, (3) the current-site audit. Where a reference conflicts with the brand book,
the brand book wins. This spec lists every such conflict and how it is settled (section 0.3).

**Hard rule, repeated:** no change to copy, data, numbers, links, order of information, menus or nav items.
Everything below changes only presentation, layout, interaction and motion. Decorative UI may only reuse existing strings.

---

## 0. Principles

### 0.1 Seven principles

1. **Ink and Paper do the work.** About 95% of any viewport is Ink `#0C1719`, Paper `#F4F3EF`, Bone `#EBEAE5`
   and Card `#FBFAF7`. Hierarchy comes from size, weight and space, not from colour.
2. **One red point per composition.** In any one viewport-sized composition, at most one SNX Red element is the point.
   Allowed red: the headline full stop, the logo stop, the header "Join StartNet" button, and a red hover or pressed
   state (shown only while someone is interacting). Section dot labels, bullets, link underlines, menu arrows,
   progress bars and placeholder art are never red.
3. **Editorial grid.** Left-aligned headers on a 12-column grid. Use asymmetric 5/7, 4/8 and 6/6 splits.
   Paragraphs are never centred. A short headline may be centred only in the B "quiet statement" architecture
   (the CTA band).
4. **Straight bands, one rise.** Each page gets exactly one rounded "sheet rise", where the first Paper sheet slides
   over the Ink hero band (brand 05.8 item 5). Every other change of ground is a straight, full-bleed edge with no
   shadow. Depth comes from hairlines only.
5. **One motion grammar.** Every reveal is the same short rise. Every hover is 200 ms. Every media zoom is 1.03 over
   480 ms. Nothing bounces except the red full stop, which lands once per session (brand 04.4 rule 05). Letters do
   not move.
6. **A few signature moments, used sparingly.** Each page group gets at most three: the hero media clip-expand, a
   scroll-scrubbed statement, the pulli timeline, a spotlight or feature-tab element, and the count-up.
7. **Accessible and SSR-true by construction.** All content ships in the prerendered HTML at its final state.
   Animation only enhances what is already there. Contrast is AA throughout, focus is visible, and both
   `prefers-reduced-motion` and `data-motion="reduced"` turn everything off.

### 0.2 What "professional" means here (measurable)

- No more than 2 distinct section grounds per page plus Ink bands. Use Ink for no more than 2 mid-page bands
  plus the footer.
- At most 4 type styles per section: label, heading, lede or body, and meta.
- Headers, cards, scrollers and footers line up on the same left edge (the container edge).
- No element carries both a shadow and a hairline, except floating overlays (menus, dialogs, consent).
- Every card in a row has its CTA in the same place (bottom-left) and uses the same two text sizes.

### 0.3 Conflicts settled

| Topic | Reference says | Brand book says | **v2 decision** |
|---|---|---|---|
| Button radius | AIWO pills, Meridian 6 px | 4 px buttons and labels; pill nav and chips (05.8) | **4 px for buttons, tags and labels. Pills for nav items, filter chips and segmented toggles. Circles for icon-only buttons.** |
| Display weight | AIWO 200 | 400–500 | **Display and h1 at 400; h2, h3 and card titles at 500** |
| Band padding | AIWO 158 px | 4-pt scale, max 128 | **`--space-section` 64 → 128 px** |
| Container | AIWO 1760, Meridian 1440 | 1280 container, 12 cols ≥1024, gutters 24–32 | **1280 px container. Scrollers and full-bleed media break out to the viewport.** |
| Rounded sheets | AIWO none | "Paper sheets rise over the band with rounded tops" | **One rise per page (hero → first sheet), 32 px radius (20 px on mobile). All other edges straight.** |
| Header surface | AIWO white, Meridian theme flip | "The header and hero sit on Ink" | **The header stays Ink on every page. No theme flipping.** |
| Data font | AIWO IBM Plex Mono | Inter, tabular, Indian grouping | **Inter `tabular-nums`. No mono font.** |
| Mega-menu indicator | AIWO 2 px underline | Pill navigation | **A sliding pill highlight (transform only) behind the hovered or current item** |
| Reveal | AIWO 8 px / 280 ms, Meridian 100 px / 1 s | — | **12 px rise, 600 ms, `--ease-reveal`, 60 ms stagger** |
| Eyebrow animation | Meridian letter-spacing | No tracking in Tamil, transform only | **Not copied** |
| Serif lead (AIWO) | Source Serif leads | Instrument Serif for ONE word only | **Not copied.** Leads stay Inter. |
| Floating bottom nav (Meridian) | glass pill | menus unchanged | **Not copied** |

---

## 1. Token changes (exact values)

**Owner:** `client/src/styles/tokens.css`. All brand values move into tokens.css, which becomes the single source
of truth. The `:root` token block at the top of theme.css (lines 16–43) is deleted, and theme.css keeps only skins.

### 1.1 Replace in Layer 2

```css
--sn-ink: #0C1719; --sn-red: #EF4444; --sn-paper: #F4F3EF; --sn-white: #FFFFFF;
--sn-red-50:#FEF2F2; --sn-red-100:#FEE2E2; --sn-red-200:#FECACA; --sn-red-300:#FCA5A5; --sn-red-400:#F87171;
--sn-red-500:#EF4444; --sn-red-600:#DC2626; --sn-red-700:#B91C1C; --sn-red-800:#991B1B; --sn-red-900:#7F1D1D;
--neutral-50: #F4F3EF; --neutral-950: #0C1719;
```

### 1.2 Add to Layer 2

```css
/* Ink ramp (brand 03.5) */
--ink-50:#F4F7F8; --ink-100:#E8EEEF; --ink-200:#CFDADC; --ink-300:#ABBBBE; --ink-400:#82979A;
--ink-500:#5E7377; --ink-600:#42575A; /* Graphite */ --ink-700:#2C3E41; /* Slate */ --ink-800:#1B292C; --ink-900:#0C1719;
/* Grounds */
--paper:#F4F3EF; --bone:#EBEAE5; --card:#FBFAF7; --white:#FFFFFF;
--hairline:#DAD8D0; --line-strong:#B9B7AE;
/* Tertiary, each ≤5% of a layout, never status, never replaces the red stop */
--marigold:#FBA62A; --marigold-100:#FFEBD5; --marigold-300:#FFC580; --marigold-700:#A86B02; --marigold-800:#7E4F04;
--lagoon:#117780; --lagoon-100:#D9F0F3; --lagoon-300:#88C7CE; --lagoon-700:#024C52;
/* Night (Ink surfaces) */
--night-0:#0C1719; --night-1:#1B292C; --night-2:#2C3E41; --night-line:#263937; --night-line-strong:#39504D;
--night-subtle:#82979A; --night-text:#F4F3EF; --night-text-2:#CFDADC; --night-text-muted:#ABBBBE;
```

Measured contrast: Ink-500 on Paper 4.51, on Card 4.80, **on Bone 4.16 (fails)**. Graphite on Bone 6.36. Lagoon on
Paper 4.76, **on Bone 4.39 (fails)**. Ink-300 on Ink 9.19. Red-700 on Bone 5.37. Red-600 under white text 4.83.
Ink-400 on Paper is 2.76, so it **must not be used for field borders**.

### 1.3 Semantic aliases (Layer 3, day)

```css
--color-bg: var(--paper);  --color-bg-raised: var(--card);  --color-bg-sunken: var(--bone);  --color-bg-form: var(--white);
--color-text: var(--ink-900);  --color-text-2: var(--ink-600);  --color-text-muted: var(--ink-500);
--color-border: var(--hairline);  --color-border-strong: var(--line-strong);  --color-border-control: var(--ink-500); /* 4.51:1 */
--color-action: var(--sn-red-600);  --color-action-hover: var(--sn-red-700);  --color-action-active: var(--sn-red-800);
--color-link: var(--ink-900);  --color-link-decoration: rgb(12 23 25 / .35);  /* was red: red is not decoration */
--color-link-standalone: var(--ink-900);  --color-link-longread: var(--lagoon);
--color-focus: var(--ink-900);  /* 2px ring; Paper on Ink. Red is no longer the focus colour (one red point) */
--color-point: var(--sn-red);  --color-label-dot: var(--ink-900);
--color-error: var(--sn-red-700);  --color-error-bg: var(--sn-red-50);
--accent: var(--ink-900); --accent-text: var(--ink-900); --accent-tint: var(--bone);
--accent-fill: var(--ink-900); --accent-on-fill: var(--paper); --accent-night: var(--night-text);
```

Fix every contrast comment to the values in 1.2. `[data-brand="x"]` keeps `--accent: var(--sn-red)`,
`--accent-text: var(--sn-red-700)`, `--accent-fill: var(--sn-red-600)` and `--accent-night: var(--sn-red-400)`.
In each `[data-brand=…]` block, also set `--color-label-dot: var(--accent)`.

Bone-surface override (new):

```css
.section--white, .section--sunken, [data-ground="bone"] { --color-text-muted: var(--ink-600); --color-link-longread: var(--lagoon-700); }
```

Night (`[data-surface="night"]`) adds:

```css
--color-focus: var(--paper); --color-label-dot: var(--paper); --color-link-decoration: rgb(244 243 239 / .4);
--color-link-standalone: var(--paper); --color-link-longread: var(--lagoon-300); --color-border-control: var(--ink-400);
```

### 1.4 Type tokens (brand 04.3 web tokens, 360 → 1440 interpolation)

```css
--font-accent: 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif;
--text-display-2xl: clamp(2.5rem, 1.6667rem + 3.7037vw, 5.5rem);   /* 40→88, home h1 only */
--text-display-xl:  clamp(2.25rem, 1.5rem + 3.3333vw, 4.5rem);     /* 36→72, page/brand hero h1 */
--text-h1:          clamp(2rem, 1.5rem + 2.2222vw, 3.5rem);        /* 32→56, non-hero h1, CTA-band statement */
--text-h2:          clamp(1.625rem, 1.3333rem + 1.2963vw, 2.5rem); /* 26→40 section heads (unchanged) */
--text-h3:          clamp(1.25rem, 1.1667rem + 0.3704vw, 1.5rem);  /* 20→24 card / tab titles */
--text-lede:        clamp(1.125rem, 1.0833rem + 0.1852vw, 1.25rem);/* 18→20 = body-lg */
--text-body:        clamp(1rem, 0.9792rem + 0.0926vw, 1.0625rem);  /* 16→17 (unchanged) */
--text-meta:        0.875rem;   /* 14, dates, meta lines, captions on cards */
--text-caption:     0.8125rem;  /* 13 */
--text-label:       0.9375rem;  /* 15, web dot labels */
--text-stat:        clamp(3rem, 2.25rem + 3.3333vw, 5.25rem);      /* 48→84 */
--leading-display: 1.02; --leading-heading: 1.12; --leading-body: 1.5;
--tracking-display: -0.04em; --tracking-h1: -0.035em; --tracking-heading: -0.02em; --tracking-h3: -0.015em; --tracking-stat: -0.04em;
--weight-display: 400; --weight-heading: 500; --weight-label: 500; --weight-body: 400;
```

The Tamil block keeps its ×0.85 scale, tracking 0, no caps and the existing leading. Add `--tracking-h1: 0;`,
`--tracking-h3: 0;` and `--tracking-stat: 0;` to it. Tamil display weight stays 400–500 (never 300).

### 1.5 Space and layout tokens

```css
--container-max: 80rem;                    /* 1280 */
--gutter: 20px; (≥768: 24px; ≥1280: 32px)  /* brand 24–32 */
--page-margin: max(var(--gutter), calc((100vw - var(--container-max)) / 2 + var(--gutter)));  /* scroller bleed / scroll-padding */
--space-section: clamp(4rem, 2.6667rem + 5.9259vw, 8rem);   /* 64→128 */
--space-section-tight: clamp(3rem, 2.3333rem + 2.963vw, 5rem); /* 48→80 */
--space-head-gap: clamp(2.5rem, 2rem + 2.2222vw, 4rem);     /* section header → content, 40→64 */
--sheet-radius: 32px; (<768: 20px)
--radius-media: 12px; --radius-btn: 4px; --radius-chip: 9999px;
--header-h: 72px (≤1023: 56px); --utility-h: 36px; --subnav-h: 48px;
--shadow-overlay: 0 16px 48px rgb(12 23 25 / .16), 0 2px 6px rgb(12 23 25 / .06);   /* overlays only */
```

Rewrite `--shadow-1/2/3` with rgb(12 23 25 …). Keep `--shift-*`.

### 1.6 Motion tokens

```css
--dur-1: 100ms; --dur-2: 200ms; --dur-3: 240ms; --dur-4: 320ms; --dur-5: 480ms; --dur-6: 800ms;
--dur-reveal: 600ms; --dur-media: 480ms; --dur-count: 1000ms; --dur-header: 280ms;
--ease-standard: cubic-bezier(0.2, 0, 0.38, 0.9);
--ease-enter: cubic-bezier(0, 0, 0.3, 1);
--ease-snap: cubic-bezier(0.2, 0, 0, 1);          /* AIWO enter: hovers, arrows, panels */
--ease-reveal: cubic-bezier(0.22, 1, 0.36, 1);    /* long decelerating reveal (Meridian-like) */
--ease-header-exit: cubic-bezier(0.4, 0, 1, 1);
--ease-glide: cubic-bezier(0.2, 0.8, 0.3, 0.97);  /* carousel glide */
--ease-dot: cubic-bezier(0.34, 1.56, 0.64, 1);    /* ONLY the red full stop */
--shift-reveal: 12px; --stagger: 60ms;  /* cap 6 items */
--hover-intent: 150ms; --hover-exit: 300ms;
```

Reduced (both the media query block and `:root[data-motion="reduced"]`) adds `--dur-reveal: 0ms; --dur-media: 0ms;
--dur-header: 0ms; --shift-reveal: 0px; --dur-2: 0ms;` to the existing zeroing. Colour transitions may stay at 120 ms
or less.

### 1.7 Removals and fixes outside tokens.css

- `--wa-500` stays as a token, but `.button--whatsapp` becomes a neutral button with a 20 px WhatsApp glyph
  (section 3.6).
- `client/index.html` `<meta name="theme-color">` → `#0C1719` (owner: Foundation-A).
- `client/public/favicon.svg`: red → `#EF4444`, and the S. monogram ink → `#0C1719` (owner: Foundation-A).
- MediaKit.jsx and Media.jsx publish the old hex values as page data. **Do not edit.** They are flagged to the
  orchestrator as a content decision.

---

## 2. Global layout, spacing and type rules

**Owner:** `client/src/styles/theme.css` and `client/src/styles/base.css` (Foundation-A), plus `components/Section.css`
and `components/SectionHeader.*` (Foundation-B).

### 2.1 Grounds and surfaces

`Section surface` prop → ground:

| prop | ground | text | notes |
|---|---|---|---|
| `paper` | Paper #F4F3EF | Ink | default |
| `white` | **Bone #EBEAE5** | Ink, muted = Graphite | becomes the alternate ground (brand 03.5 rule 02) |
| `sunken` | Bone #EBEAE5 | same | |
| `night` | Ink #0C1719 | Paper | pulli dot texture allowed at ≤6% |
| `accent` | brand accent tint | Ink | unchanged |

- Cards sitting on Paper or Bone use Card #FBFAF7. Forms use White #FFFFFF cards (brand 03.5 rule 01).
- When two adjacent sections resolve to the same ground, the second gets a full-bleed `border-top: 1px solid var(--hairline)`
  (on Ink: `var(--night-line)`). Use `:root .section--white + .section--sunken, .section--sunken + .section--white,
  .section--paper + .section--paper, .section--night + .section--night`.
- **Sheet rise, once per page:** the first non-night section after a hero (`.page-hero + .section`,
  `.brand-hero + .section`, `.home-hero + .section` and `.site-main > .section:first-child` after an ink band) gets
  `margin-top: calc(-1 * var(--sheet-radius)); border-radius: var(--sheet-radius) var(--sheet-radius) 0 0; position: relative; z-index: 1;`
  and **no shadow**. Delete every other sheet rule: theme.css "Sheets" block (L198–213), the second block (L321–330)
  and the `.section + .cta-band` overlap. Delete the 0 −18px 40px shadows.
- Ink sections in mid-page have straight edges.

### 2.2 Grid

- `.container`: `max-width: calc(var(--container-max) + 2 * var(--gutter)); padding-inline: var(--gutter); margin-inline: auto`.
- New utility `.grid-12`: `display:grid; grid-template-columns: repeat(4, 1fr); column-gap: var(--gutter)`, and at
  ≥1024 `repeat(12, 1fr)` with `column-gap: 32px`. Column helpers: `.col-5`, `.col-7`, `.col-4`, `.col-8`, `.col-6`,
  `.col-start-8` (≥1024 only; full width below).
- Standard splits: section header ↔ action uses 8/4. Text ↔ media uses 5/7 (media on the right) or 6/6. Feature
  lists use 4/8.
- `.bleed-right`: `margin-right: calc(-1 * var(--page-margin)); padding-right: var(--page-margin)`, for scrollers.

### 2.3 Vertical rhythm (8 px baseline)

- Section padding-block: `var(--space-section)` everywhere. `pad="tight"` uses `--space-section-tight`.
  Remove the `calc(space-section * 0.8)` and sheet-radius fudges.
- Inside a section header: label → title **16 px**, title → lede **24 px**, header → content **`--space-head-gap`**
  (40→64).
- Between stacked blocks inside a section: 48 px. Between cards in a grid: 32 px column gap (24 below 768) and 48 px
  row gap.
- Anchor targets: `[id] { scroll-margin-top: calc(var(--header-h) + 32px); }` (base.css).

### 2.4 Type

| Role | Selector(s) | Size | Weight | Leading | Tracking |
|---|---|---|---|---|---|
| Home display | `.home-hero__title` | `--text-display-2xl` | 400 | 1.02 | −0.04em |
| Hero h1 | `.page-hero__title, .brand-hero__title, h1.display-xl` | `--text-display-xl` | 400 | 1.04 | −0.04em |
| Page h1 (non-hero) | `h1, .h1` | `--text-h1` | 400 | 1.08 | −0.035em |
| Section head | `h2, .h2, .section-header__title` | `--text-h2` | 500 | 1.12 | −0.02em |
| CTA statement | `.cta-band__title` | `--text-h1` | 400 | 1.08 | −0.035em |
| Card / tab title | `h3, .h3, .card__title` | `--text-h3` | 500 | 1.2 | −0.015em |
| Lede | `.section-header__lede, .body-lg, .lede` | `--text-lede` | 400 | 1.45 | −0.005em, `max-width: 40ch` (Tamil 36em) |
| Body | `body, p` | `--text-body` | 400 | 1.5 | 0, `max-width: 68ch` for running text |
| Dot label | `.eyebrow` | `--text-label` | 500 | 1.4 | 0, sentence case |
| Meta | `.meta, time, .card__meta` | `--text-meta` | 400 | 1.45 | 0, `tabular-nums`, colour muted |
| Stat numeral | `.stat__value, .stat__num` | `--text-stat` | **400** (was 300) | 1 | −0.04em |

- `base.css`: heading defaults drop to the weights above. `.h1`–`.h5` and `.display-*` lose 600/700.
  Remove every `font-weight: 450` (not a brand weight) in favour of 400 or 500.
- Bold (600) is allowed only in `<strong>`, form-error text and Tamil labels (Noto Sans Tamil 600). Foundation-B and
  layout owners replace the remaining 600/700 in their component CSS: Footer.css column heads, NewsletterForm
  `.newsletter__title`, CTABand.css, EventCard `__day`, Quote.css, FormSuccess, Ladder, Marquee, ArtImage.css L50,
  Accordion.css and Field label. Each becomes 500.
- **Serif accent:** `h1 em, h2 em, .kinetic__accent { font-family: var(--font-accent); font-style: italic; font-weight: 400; font-size: 1.04em; letter-spacing: 0; }`.
  Use exactly one word per English headline. The trailing full stop is never inside the `em`. Tamil: `font-family: inherit; font-style: normal; font-size: 1em`.
- **Dot labels:** `.eyebrow::before` background `var(--color-label-dot)`, which is Ink on Paper, Paper on Ink and the
  brand accent inside `[data-brand]`. The size stays at 0.55em. **Never red** (bullets stay grey or ink). Remove the
  uppercase and tracking rules in Footer.css L8, SearchOverlay.css L38, KeyFacts.css L18, MegaMenu.css L31/L61 and
  MobileDrawer.css L50. Each is then a dot label, or a plain 14 px muted 500 label where a dot would be clutter
  (menu column titles).
- **Figures:** `.stat, table, time, .meta, .tabular { font-variant-numeric: tabular-nums lining-nums; }`.
  Indian grouping already comes from lib/format.js.
- **Alignment:** remove `text-align: center` from every paragraph (home hero lede, CTA band lede and footnote,
  mobile home hero). Only `.cta-band__title` may be centred.

### 2.5 Links

```css
a { color: var(--color-link); text-decoration-line: underline; text-decoration-thickness: 1px;
    text-underline-offset: .2em; text-decoration-color: var(--color-link-decoration);
    transition: text-decoration-color var(--dur-2) var(--ease-snap), text-decoration-thickness var(--dur-2) var(--ease-snap); }
a:hover { text-decoration-color: currentColor; text-decoration-thickness: 2px; }
.prose a, .rich-text a { color: var(--color-link-longread); text-decoration-color: currentColor; } /* Lagoon in long reads */
```

**Arrow link utility** `.arrow-link` (used by `.button--tertiary` and card CTAs):
`display:inline-flex; gap:10px; align-items:center; font-weight:500; min-height:44px (coarse pointer)`. The arrow is a
`<span class="arrow" aria-hidden="true">→</span>`. Hover (under `@media (hover:hover)`): the arrow moves
`translateX(4px)` over `--dur-2 --ease-snap`, and the label gets a 1px underline at offset .2em that draws in with a
`background-size` sweep (`background: linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat` → `100% 1px`,
`--dur-3`). Button.jsx already renders the → glyph. It must wrap the glyph in `span.arrow[aria-hidden]` without
changing the label text.

---

## 3. Component specs

### 3.1 Header (Ink band) — `layout/Header.jsx/.css`, `layout/UtilityBar.*`, `layout/LanguageSwitch.*`

Items, order and labels stay exactly as they are.

- **Utility bar** (36 px, Ink, bottom hairline `--night-line`): links 13 → **14 px**, weight 400, colour
  `--night-text-2`, hover Paper. "Join StartNet" stays where it is and **stays red**: Red-600 fill, white text,
  4 px radius, **height 28 px, padding 0 14px, 14 px weight 500**, hover Red-700. It is the one red point in the
  chrome. The utility bar collapses on scroll, as it does now.
- **Main bar** (72 px, 56 px when compact): background `--night-0`. When scrolled it gets `background: rgb(12 23 25 / .92);
  backdrop-filter: saturate(1.2) blur(16px)` (opaque enough for ≥12:1 text contrast) and `border-bottom: 1px solid var(--night-line)`.
- **Nav items:** pill buttons with 40 px hit height, padding 0 14px, 15 px weight 400, `--night-text-2`, and Paper
  on hover or current. A **single sliding highlight** sits behind them: one absolutely positioned
  `span.site-nav__glide` (radius 9999px, background `rgb(244 243 239 / .08)`). On pointerenter or focus of an item,
  measure `offsetLeft/offsetWidth` once and set `transform: translateX(x) scaleX(w/100)` on a 100 px-wide element
  (no width animation), with transition `transform var(--dur-3) var(--ease-snap), opacity var(--dur-2)`. At rest it
  sits behind `[data-current]`; with no current item it fades out. The current item also gets a 4 px Paper dot under
  the label. Not red. Under reduced motion the glide jumps instantly (dur 0).
- **Hide on scroll:** keep the `useSmartHeader` logic, with an 8 px delta threshold and hiding only after
  `y > 120`. Hide uses `transform: translateY(-100%)` over `var(--dur-header) var(--ease-header-exit)`. Show uses
  `var(--dur-3) var(--ease-snap)`. Emit `window.dispatchEvent(new CustomEvent('sn:header', {detail:{hidden}}))` so
  BrandSubNav and the About in-page nav can follow. Reduced motion: never hide.
- **Scroll progress hairline** (new, decorative): a 1px `span.site-header__progress` at the bottom of the main bar,
  Paper at 40%, `transform: scaleX(progress)` with origin left. It is updated from the Lenis `scroll` event
  (`lenis.progress`), or from `scrollY / (scrollHeight − innerHeight)` in rAF when Lenis is off. Show it only on
  long-read routes (`/insights/stories/*`, `/insights/reports/*`, `/about`). `aria-hidden`. Hidden under reduced motion.
- Search and language controls: 40 px circle icon buttons with a 1px `--night-line-strong` ring and hover background
  `rgb(244 243 239 / .08)`.

### 3.2 Mega menu — `layout/MegaMenu.jsx/.css`, `layout/megaCtas.js` (read-only)

- Full-width **Paper** panel below the main bar, with a `--hairline` top border and no rounded corners. Content sits
  in the container on a 12-col grid: link columns span 8, and the existing feature / CTA slot from megaCtas spans 4
  (only if it already exists; no new copy).
- Column titles: 14 px weight 500, `--color-text-muted`, sentence case (no uppercase), 16 px above the first link.
- Links: title 17 px weight 500 in Ink. The existing description, if present, is 14 px muted, and items are 24 px
  apart. Hover: background Bone over the item (radius 4px, padding 8px 12px, negative margin so text stays aligned)
  and an arrow that fades in and nudges 4 px. **Arrows and the progress bar become Ink, not red.**
- **Scrim:** a fixed `div.mega-scrim` below the header with `background: rgb(12 23 25 / .4)` and opacity 0 → 1 over
  `--dur-3`. Clicking it closes the menu. `aria-hidden`.
- **Motion:** the panel goes from `{opacity:0, y:-8}` to `{opacity:1, y:0}` over 0.24 s with ease `[0.2,0,0,1]`.
  Columns stagger 40 ms (`staggerChildren: .04`), each `{opacity:0, y:6}` → `{1, 0}`. Exit: opacity only, 160 ms.
  Hover intent: `--hover-intent` 150 ms to open and `--hover-exit` 300 ms to close. Moving between triggers while
  open swaps content without re-animating the panel (crossfade of the inner content, 160 ms).
- Keyboard: Esc closes and returns focus to the trigger, Tab moves through the panel, and focus leaving the panel
  closes it (existing behaviour; keep it).

### 3.3 Mobile drawer — `layout/MobileDrawer.jsx/.css`

- A full-screen **Ink** sheet (it stays on the ink band language, brand 05.8) with `role="dialog"`, `aria-modal`, a
  focus trap and Esc to close. Enter: opacity 0 → 1 over 240 ms, with content `y: 8 → 0` staggered 40 ms. Reduced:
  opacity only, 120 ms.
- Top row: logo plus the existing close control, 56 px. Sections are hairline (`--night-line`) accordion rows, 20 px
  weight 400, with a 1.5px-stroke +/− icon. The vertical bar uses `scaleY(1→0)` and the wrapper rotates 90° over
  `--dur-3`. Children use the `grid-template-rows: 0fr→1fr` animation from 3.10.
- Existing utility items and "Join StartNet" pin to a sticky bottom bar: Join is full width, 52 px, Red-600, with a
  safe-area inset bottom padding.

### 3.4 Brand sub-nav — `layout/BrandSubNav.jsx/.css`

- A 48 px Ink bar with a `--night-line` bottom hairline, and the brand accent as a **2 px rule under the current
  item** (brand 05.8 item 6). The rule glides between items with the transform pattern from 3.1.
- Items scroll horizontally on mobile with `mask-image: linear-gradient(90deg, #000 85%, transparent)` as an edge
  fade and `scroll-snap-type: x proximity`. The current item is scrolled into view on mount.
- It follows the main header: on `sn:header` hidden, the sub-nav translates to `top: 0` (stays sticky) so total
  chrome while scrolling is 48 px. When the header shows, the sub-nav sits under it. Transition `--dur-header`.
- The brand CTA button stays as it is, using the brand accent fill. With the red Join in the utility bar it is
  allowed (brand 05.8 item 6). Give it height 36 px.

### 3.5 Heroes

**Owners:** `components/PageHero.*` and `components/BrandHero.*` (Foundation-B). The home hero belongs to the Home
agent.

**PageHero (inner pages):**
- Ink band with the pulli dot texture at 5% (existing night texture). Padding-block 64 px top (below the chrome) and
  `calc(64px + var(--sheet-radius))` bottom.
- Grid 7/5 at ≥1024. Copy is **top-aligned** (`align-items: start`), not vertically centred. Breadcrumbs → 24 px →
  dot label → 16 → h1 (`--text-display-xl`) → 24 → lede (40ch) → 32 → buttons.
- Media: 12 px radius, **aspect-ratio 4/3** (was 4/5), max-height 560 px, `object-fit: cover`. Below 1024 the copy
  stays first and the media follows at 16/10. The hero must end within 1.1 viewports at
  1440×900, so the first sheet edge is visible on load at 1440×900 when the copy is short.
- **Media entrance (CSS only, SSR-safe):** `.page-hero__media img` uses
  `@keyframes hero-media-in { from { clip-path: inset(6% 6% 6% 6% round 12px); transform: scale(1.04) } to { clip-path: inset(0 round 12px); transform: none } }`
  over 900 ms `var(--ease-reveal)` with a 120 ms delay. It is applied only under
  `@media (prefers-reduced-motion: no-preference)` and `:root:not([data-motion="reduced"])`. The prerender runs reduced,
  so the snapshot shows the final frame.
- Remove the pointerFx hero parallax (`data-parallax`) from heroes. The clip-in replaces it.

**BrandHero (brand hubs):** the same grid, but the media is **16/10 landscape** spanning cols 6–12 and bleeding to
the right viewport edge (`margin-right: calc(-1 * var(--page-margin))`, radius `12px 0 0 12px`). Remove the offset
orange outline frame and the floating "pulse" glass card overlap. The pulse card content moves into normal flow under
the lede as a hairline-topped meta row (same text). The brand accent appears only in the dot label and the sub-nav
rule.

### 3.6 Buttons — `components/Button.jsx/.css`

The theme.css button skin moves into Button.css; Foundation-A deletes it from theme.css.

| Variant | Rest | Hover | Pressed | On Ink |
|---|---|---|---|---|
| `primary` | Ink fill, Paper text | **Red-600 fill, white text** (Meridian accent-on-interaction) | Red-700, `scale(.98)` | Paper fill, Ink text → hover white |
| `secondary` | transparent, `box-shadow: inset 0 0 0 1px var(--line-strong)`, Ink text | inset ring Ink, background `rgb(12 23 25 / .04)` | `scale(.98)` | ring `rgb(244 243 239 / .32)` → Paper, background `rgb(244 243 239 / .08)` |
| `tertiary` | arrow link (2.5) | arrow +4px, underline sweep | — | Paper |
| `brand` | `--accent-fill` / `--accent-on-fill` | 8% darker via `color-mix(in oklab, var(--accent-fill), #000 8%)` | | |
| `whatsapp` | secondary styling plus the existing 20 px WhatsApp icon in Ink (Paper on Ink). No green fill. | as secondary | `scale(.98)` | as secondary on Ink |
| `inverse` | Paper fill, Ink text | white | | |

- Sizes: `md` min-height 44, padding 0 18px, 15 px. `lg` min-height 52, padding 0 24px, 16 px. Weight 500 and
  radius 4px for all.
- Transition: `background-color, color, box-shadow var(--dur-2) var(--ease-snap)`, and `transform var(--dur-1)` for
  press.
- Focus: `outline: 2px solid var(--color-focus); outline-offset: 3px` (Ink on Paper, Paper on Ink).
- Loading dots: Ink or Paper, never red.
- Tamil: same 4px radius, no tracking, `min-height` grows with content (`padding-block: 10px`).
- Magnetic pull (pointerFx): keep **only** on `.button--primary.button--lg`, max 4 px. Remove the card spotlight
  (3.7).

### 3.7 Cards — `components/Card.*, EventCard.*, ProgrammeCard.*, BrandTile.*, StoryCard.*, ReportCard.*, PersonCard.*, ArtImage.*, renderArt.jsx, _placeholders.js`

There are two families, and every card must belong to one of them.

**A. Media cards (editorial, unframed):** EventCard, StoryCard, BrandTile and PersonCard.
- Structure: `.card__media` (12 px radius, overflow hidden, fixed `aspect-ratio`: events 4/3, stories 4/5, brand
  tiles 4/5, people 1/1; background `--bone` as placeholder fill, so there is no CLS) → 20 px → meta line (14 px muted,
  tabular) → 8 px → title (`--text-h3`, 500) → 8 px → optional description (body, 2-line clamp via
  `-webkit-line-clamp: 2`, CSS only) → 16 px → CTA arrow link **bottom-left** (`margin-top: auto`).
- No background, no border, no shadow, no lift. The whole card is clickable via the existing link with a
  `::after { inset:0 }` overlay (if it is not already), so there is one tab stop per card.
- Hover (`@media (hover:hover) and (pointer:fine)`): the image goes `scale(1.03)` over `var(--dur-media) var(--ease-snap)`,
  the title underline draws in (1px, offset .18em, background-size sweep), and the arrow nudges 4px.
  `:focus-within` gets the same title underline plus a 2px focus outline on the card link.
- **EventCard text styles drop to two sizes:** meta (date and location on one line, joined by " · " only between
  present values, so stray trailing separators disappear) and title. The dashed "TBC" date chip becomes a plain meta
  item (same text). The brand badge becomes a dot label (accent dot) in the meta row. "Register →" moves bottom-left.
- **Caption chips on photos:** no ellipsis truncation. `white-space: normal`, max 2 lines, `max-width: calc(100% - 24px)`,
  background `rgb(12 23 25 / .72)` + `backdrop-filter: blur(8px)`, Paper 13 px, radius 4px, positioned 12px
  bottom-left.
- **Remove** `.card--brand::before` corner dots (theme.css) and the card spotlight (`pointerFx` card handler and
  `pointerFx.css` spotlight rules). Brand tiles show their accent only through the dot label.

**B. Framed cards (text-first):** Card (generic), ReportCard, ProgrammeCard, contact route cards, KeyFacts.
- Card #FBFAF7 on Paper, White on Bone. `box-shadow: inset 0 0 0 1px var(--hairline)`, radius 12px, padding
  28px (24 on mobile). With media, the media sits flush at the top with radius `12px 12px 0 0`.
- **Top-rule hover** (AIWO): `::before` is a 2px Ink bar across the top inside the radius,
  `transform: scaleX(0) → scaleX(1)`, origin left, `--dur-3 --ease-snap`, on hover and focus-within. The hairline
  becomes `--line-strong`. No lift.
- ProgrammeCard key/value table: a `dl` grid of 2 columns with hairline rows, 14 px, labels muted, values Ink 500,
  tabular. Amber `[placeholder]` chips: restyle as a neutral 4px chip with a dashed `--line-strong` border and muted
  text (same text). They do not use amber, because amber is reserved for warnings.

**Placeholder art (ArtImage/renderArt/_placeholders):** this becomes **mono**. Ground Bone (on Ink: `--night-1`),
pulli dots `--ink-200` at 8–16 px lattice (on Ink: `--night-line-strong`), network lines `--ink-300`, and "the point"
in **Ink** (on Ink: Paper). There is no red-50 tint and no red dot in card art. Seeded variety stays. ArtImage.css
L50 weight 700 → 500.

### 3.8 Section header — `components/SectionHeader.*`

- Layout: 8/4 grid at ≥1024, with the text block in cols 1–8 and `action` in cols 9–12, **aligned to the title's last
  baseline** (`align-self: end; padding-bottom: 6px`). Below 1024 the action goes under the lede, 24 px.
- `align="center"` is used only when the page passes it. It centres the label and title, while the lede stays
  left-aligned in a centred 40ch box. (Pages should drop `center` unless it is the CTA band.)
- **Choreography** (replaces the single Reveal): the label, title and lede each get their own Reveal with delays
  0 / 60 / 120 ms, `y = var(--shift-reveal)`. The action uses 180 ms. The dot does not animate (only the full stop
  moves).
- Spacing as in 2.3.

### 3.9 Stats and fact bands — `components/Stat.*, FactBand.*, KeyFacts.*`

- Numerals: `--text-stat`, weight 400, `--tracking-stat`, Ink (Paper on Ink), leading 1, tabular.
- **Units** (%, L, Cr, +) sit on the baseline at 0.5em, weight 400, colour `--color-text-2`, with a 0.08em gap. No
  superscript. The ₹ prefix uses the same 0.5em sizing, aligned to the cap height via `vertical-align: 0.42em`.
- Label: 15 px, muted, 12 px below, max 24ch. Source and confidence tags (A/B/C): **one style**, a 4px chip with a
  1px `--line-strong` ring, 12 px weight 500, 8 px below the label. The letter grade sits in its text. No filled or
  dashed variants (keep any `aria-label` or title).
- **FactBand on Ink:** straight edges, pulli texture ≤5%. The existing statement sentence is set at
  `clamp(1.375rem, 1.2rem + .8vw, 1.75rem)`, 400, −0.01em, Paper, max 36ch, left-aligned. The stats sit below in a
  row with `border-left: 1px solid var(--night-line)` on all but the first, with padding-inline 32px. **Mobile: a
  2×2 grid** (was 1 per row), with hairlines between rows.
- **Count-up:** keep Stat's rAF count-up. Duration `--dur-count` 1000 ms, easeOutCubic, starting when 40% visible,
  once. Reserve the final width with `min-width: <final-length>ch` from the formatted final value (no CLS). The final
  value is in the SSR markup. Under reduced motion or `data-motion=reduced` the final value appears at once.
- Orphan "How we tag evidence →" and "How we count…" links: style as the band's **footnote row**. Place them in a
  hairline-topped row under the stats, 14 px muted arrow link, left-aligned, 24px above. On brand hubs, where the link
  comes first in source order, render it there but style it as a dot-label row so the band no longer looks headless.
  (Order unchanged; presentation only.)

### 3.10 Accordion — `components/Accordion.*`

- Rows: padding-block 24px, hairlines top and bottom `--hairline` (on Ink `--night-line`). The question is 18 → 20 px
  weight 500, with a 24px icon at the right.
- Icon: two 1.5px strokes. When open, the vertical stroke goes `scaleY(1) → scaleY(0)` and the wrapper rotates 90°
  over `--dur-3 --ease-snap`. (This replaces the 45° rotate in theme.css.)
- Panel: keep the `hidden` attribute for the closed SSR state. On toggle, the client removes `hidden` and animates the
  wrapper `display:grid; grid-template-rows: 0fr → 1fr` over 400 ms `cubic-bezier(.25,1,.5,1)` (the one tolerated
  layout animation). The answer fades `opacity 0 → 1` over `--dur-3` with an 80 ms delay. Closing reverses, then sets
  `hidden` on `transitionend`. Reduced: instant.
- Answer: 16/1.6, max 68ch, `--color-text-2`.

### 3.11 Scroller (carousels) — `components/Scroller.*`

- The track bleeds right: `padding-inline: var(--page-margin); scroll-padding-inline: var(--page-margin);` and the
  section container is escaped by `.bleed`, so the first card aligns with the container edge and later cards run off
  the right viewport edge.
- Gap 32px (20 below 768). `scroll-snap-type: x mandatory`, with `scroll-snap-align: start` on items. Hide the
  scrollbar (`scrollbar-width: none`, `::-webkit-scrollbar{display:none}`). Add `data-lenis-prevent-wheel` on the track.
- **Header-right controls** move into the SectionHeader action slot when the page uses it. Otherwise the controls
  row sits right-aligned **on the same row as the section header's last baseline** (negative top margin equal to
  the controls height at ≥1024), which removes the extra 60 px row. Controls: the existing counter text (keep its
  current string format, set in 14 px tabular muted) plus two 48px circle buttons with a 1px `--line-strong` ring.
  Hover: ring Ink and background `rgb(12 23 25 / .04)`. Disabled: `opacity .35`, `cursor: default`. Same stroke
  weight for both arrows.
- **Progress hairline** under the track: a 1px `--hairline` track with an Ink fill
  `transform: scaleX(scrollLeft / (scrollWidth − clientWidth))`, origin left, updated in the existing scroll handler
  (rAF). `aria-hidden`.
- Desktop drag: `cursor: grab` / `grabbing` on fine pointers. Card links get `draggable="false"`. The existing
  scroll-linked nudge stays (it never autoplays).
- Prev and next buttons call `scrollBy({left: ±(itemWidth + gap), behavior: reduced ? 'auto' : 'smooth'})`.

### 3.12 Tabs, chips and segmented controls — `components/Tabs.*, TagChip.*`, `pages/events/parts/UrlTabs.*` (Events agent), `pages/home/UpdatesTabs.*` (Home agent)

- **Shared hook** `components/_indicator.js` (Foundation-B, new):
  `useSlidingIndicator(containerRef, activeSelector)` measures the active element (`offsetLeft`, `offsetWidth`,
  `offsetTop`, `offsetHeight`) on mount, resize (ResizeObserver) and activation, and writes CSS custom properties
  `--ind-x`, `--ind-w`. The indicator element uses `transform: translateX(var(--ind-x)) scaleX(calc(var(--ind-w) / 100))`
  on a 100px base width, transition `transform var(--dur-3) var(--ease-snap)`. Reduced: transition none. SSR: the
  indicator is hidden until it is measured (`opacity:0` inline, stripped in prerender), and the active tab also keeps
  a static `aria-selected` style (Ink text, 500) so the state is visible without JS.
- **Tabs (underline style):** 2px Ink indicator under the active tab on a 1px `--hairline` base line. Tab labels are
  16 px, 400 muted → Ink 500 when active.
- **Pill segmented** (List/Calendar, Updates tabs, About in-page nav): a container with a 1px `--hairline` ring,
  radius 9999px, padding 4px. The indicator is an Ink pill (Paper text on the active item via
  `color: var(--paper)` and `transition: color var(--dur-2)`). Items are 36px tall.
- **Filter chips** (TagChip, FacetBar, event filters): 36px pills, padding 0 14px, 14 px weight 500, 1px
  `--line-strong` ring. Hover: ring Ink. Pressed (`aria-pressed=true`): Ink fill and Paper text, with a 100ms
  `scale(.97)` press. Count badges are tabular.

### 3.13 Media and video — `components/VideoFeature.*, EventGallery.*, LogoWall.*, Marquee.*, Quote.*`

- All media frames: 12px radius, fixed `aspect-ratio`, `--bone` placeholder background (`--night-1` on Ink). Load
  with `loading="lazy"` below the fold and `decoding="async"`.
- **VideoFeature:** poster required. IntersectionObserver `rootMargin: '200px'` to start loading. Muted, playsinline,
  loop, paused under reduced motion. Overlay gradient in the bottom 35% (`linear-gradient(to top, rgb(12 23 25 / .7), transparent)`)
  carrying the existing caption. The play/pause control is a 48px circle with a Paper ring.
- **ClipReveal** (new, Foundation-B, `components/ClipReveal.jsx/.css`): this is the scroll-linked media expand.
  Usage: `<ClipReveal>{media}</ClipReveal>`. Implementation: framer `useScroll({ target, offset: ['start end', 'start 0.25'] })`
  and `useTransform(p, [0,1], ['inset(7% 9% round 12px)', 'inset(0% 0% round 12px)'])` applied to `m.div` `style.clipPath`.
  It renders a plain div (no transform or clip) when reduced, during SSR or before hydration (`useEffect` sets
  mounted). The end state is the CSS default. Only `clip-path` changes, so there is no layout or CLS.
- **LogoWall:** mono logos (`filter: grayscale(1)`, opacity .72 → 1 on hover over 200ms). Grid of 6 at ≥1024, 3 on
  mobile, separated by hairlines (`gap: 1px; background: var(--hairline)` with Paper cells).
- **Marquee:** speed 32 px/s. Pause on hover or focus-within and when `document.hidden`. Add a visible pause toggle
  (existing aria label if present; else an icon-only button with `aria-label` reusing the existing "Pause" string if
  one exists in i18n; **if none exists, make the marquee static instead of adding copy**). Edge fade mask 64px.
  Reduced: static wrapped row. Weight 600 → 500.
- **Quote:** 700 → 500. The quote text uses `--text-h3` at 400 with −0.015em tracking. The attribution is meta. No
  oversized quote glyph in red. If a glyph exists, it becomes Ink-300.

### 3.14 Forms — `components/Field.*, SmartForm.*, ConsentCheckbox.*, FormSuccess.*, NewsletterForm.*`

- The form container is a White card on Paper or Bone (`--color-bg-form`), 12px radius, 1px hairline ring, padding
  32px (24 mobile).
- Fields: height 48px, radius 4px, `border: 1px solid var(--color-border-control)` (Ink-500, 4.51:1) and background
  White. Hover border Ink. Focus border Ink plus `box-shadow: 0 0 0 1px var(--ink-900)`, with no outline offset
  inside fields. Error: border `--color-error` plus a 14px error message with an icon. Label 15 px weight 500
  (Field label 600 → 500). Help text 14 px muted.
- Checkbox and radio: 20px, 4px radius / circle, Ink checked fill, and a 100ms `scale(.9→1)` tick.
- Submit: `button--primary` (Ink, red on hover). On conversion forms (/join, newsletter, enquiry) the submit
  **stays Ink**. Red stays the header's.
- **FormSuccess:** title 500. The success icon is an Ink circle with a check. Entrance: opacity plus `y 8 → 0`, 320ms,
  and the check stroke draws (`stroke-dashoffset`) over 480ms. Reduced: static.
- On Ink (newsletter in the footer): fields have background `--night-1`, border `--ink-400`, Paper text, focus ring
  Paper.

### 3.15 CTA band — `components/CTABand.*`

- Ink band, straight edges (no overlap onto the previous section, no radius), padding-block `--space-section`.
- Layout (brand cover architecture B, "quiet statement on the dot grid"): the title is centred, at `--text-h1`, weight
  400, Paper, **one serif accent word** (via an `accentWord` prop) and a **red full stop** (via `<Dot/>`, the band's
  one red point). The lede goes **under it, left-aligned inside a centred 40ch box** (`text-align:left; margin-inline:auto`).
  Buttons are centred as a group: primary (Paper fill on Ink) and secondary (Paper ring). The WhatsApp button uses the
  secondary style from 3.6.
- Decoration: a cropped pulli dot grid SVG (10px lattice, dots `--night-line-strong`), anchored bottom-right,
  `width: min(60vw, 720px)`, overflow hidden, `aria-hidden`, **static**. 700 → 400/500 weights.
- Reveal: title, lede and buttons with 0/80/160ms delays.

### 3.16 Footer — `layout/Footer.*, layout/MotionSwitch.*, components/NewsletterForm.*`

Every link, label, column and the order stay the same.

- An Ink band with a `--night-line` top hairline. Padding-top 96px.
- **Row 1** (grid 5/7): left, the logo (`<Logo reversed />` 32px tall) plus the existing tagline at `--text-h3`, 400,
  Paper. Its full stop is the footer's **one red point**. Right, the newsletter: title 22px weight 500 (was 700), the
  existing sentence at 15 muted, then a field and button inline at ≥768 (field 48px, button Paper fill).
- Hairline, 64px.
- **Row 2:** the link grid with 6 columns at ≥1024, 3 at ≥768 and 2 on mobile, `column-gap: 32px`. Column headings
  are dot labels (Paper dot) at 15px weight 500 Paper, 20px gap to links. Links are 15px `--night-text-2` →
  Paper on hover, with an underline at 1px offset .2em fading in over 200ms. Row gap 12px. Ragged columns are
  acceptable. Use `align-items: start`.
- Hairline, 48px.
- **Row 3:** social icon buttons (40px circles, 1px `--night-line-strong` ring; hover background `rgb(244 243 239 / .08)`)
  on the left, with the existing "Follow StartNet" text as a dot label, not uppercase. The motion switch sits on the
  right, labelled with its existing label as a 14px muted text label, and its segmented style follows 3.12 on Ink.
- **Row 4** (legal): 13px `--night-text-muted`. Every item uses the same weight (Cookie settings 600 → 400). Items
  are separated by a 16px gap, not bullets.
- **Wordmark:** replace the retyped Inter "StartNet" with the drawn logo: `<Logo mono size="xl" />` scaled with
  `width: 100%` of the container, fill `--night-1` (a tonal watermark, mono per brand 04.4 rule 02), `aria-hidden`,
  cropped by `overflow:hidden` at 55% of its height. **Scroll-linked rise:** framer `useScroll({target: footer,
  offset:['start end','end end']})` → `y: ['12%','0%']` (transform only). Static under reduced motion. The prerender
  shows the final state. If `Logo` lacks an `xl` size, add one in Logo.css (Foundation-C owns Logo.* for this).

### 3.17 Consent banner and bottom CTA bar — `layout/ConsentBanner.*, layout/BottomCtaBar.*`

- **Consent:** at ≥768, a **floating card bottom-left**: `width: min(380px, calc(100vw - 32px))`, left and bottom
  24px, Card background, 12px radius, 1px hairline, `--shadow-overlay`, padding 20px. The text is 14px. Buttons are
  stacked side by side at equal size and equal prominence (both secondary style; "Accept" is not emphasised over
  "Reject non-essential"). Below 768, a full-width bottom sheet with 16px padding and radius `12px 12px 0 0`. Enter:
  `y 16 → 0` plus opacity, 320ms `--ease-reveal`, 600ms after load. Exit: opacity 160ms. It must not cover the hero
  h1 or primary CTA at 1440×900 or 390×844. Remove the theme.css sheet-radius styling.
- **BottomCtaBar** (mobile): Ink bar, 64px, safe-area padding. It shows after the hero leaves the viewport and hides
  while the footer is visible, with transform `translateY(100%) ↔ 0` over `--dur-header`.

### 3.18 Other shared components

- **Breadcrumbs:** 14px, `--night-text-2` on Ink and muted on Paper, with "/" separators in `--night-line-strong`.
  The current item has no link and uses Paper.
- **Badge and TagChip:** 4px radius, 12px weight 500, height 24px, padding 0 8px. Brand badges use `--accent-tint`
  with `--accent-text`. Neutral badges use Bone with Graphite.
- **Steps** (`components/Steps.*`): a hairline-separated vertical list. The index is "01–0N" tabular in 14px muted
  (the existing numbering source), the title is `--text-h3`, and the body is 16 muted. At ≥1024 the layout is a
  4-up row with a 1px Ink top rule that thickens via `::before scaleY` on hover. `.steps__num` weight 300 → 400.
- **Ladder:** the current level is the red point (brand 04.4 "Ladder L1–L7: current level filled red"). Other levels
  are Ink rings. 700 → 500.
- **EmptyState** (e.g. home Updates → News empty): a Card-framed block, min-height 240px, with a mono pulli mini-art
  (40px) and the existing sentence. Not a full-height empty section.
- **Skeleton:** shimmer only under `prefers-reduced-motion: no-preference` (translateX −100% → 100%, 1.6s); static
  Bone otherwise.
- **PageLoader:** Bone bar, Ink progress, no red.

### 3.19 KineticHeadline — `components/KineticHeadline.*, components/Dot.*`

- **Letters stay still.** Remove the per-word rise (`kinetic__word--rise`). Render the words as plain text, so the
  split markup is no longer needed for animation. Keep the visually-hidden full string only if it is still needed.
  Simplest: render the text directly plus `<Dot/>`.
- **The full stop lands once per session:** `kinetic__dot--land` (0.48s `--ease-dot`, from `translateY(-0.55em) scale(.6)`
  and opacity 0), with a 200ms delay after first paint. Gate it with
  `try { sessionStorage.getItem('sn-dot-landed') } catch {}`, and set the flag after the first landing. Later page
  views render the static dot. Reduced: static.
- **Accent word:** a new prop `accentWord` (string, matched case-sensitively against a whole word in `text`, Latin only).
  If it is given, wrap that word in `<em class="kinetic__accent">`. Keep `accentFirst` for backward compatibility, but
  page agents should switch each h1 to `accentWord` with a meaningful noun or verb from the existing headline (e.g.
  "founder", "talent"). Never on Tamil (`/[஀-௿]/` test).

### 3.20 Reveal / RevealGroup — `components/Reveal.*`

- Constants: `DURATION = 0.6`, `EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'`, default `y = 12`. RevealGroup stagger
  `0.06` capped at 6 children (the 7th and later use the 6th delay).
- Viewport: keep the V2-K2 fail-safe observer. Change the bottom margin from −2% to **−8%** so things reveal slightly
  after they enter.
- Add `variant="clip"` for media: phase 0 is `clip-path: inset(0 0 12% 0 round 12px); opacity: 0` → phase 1 is
  `clip-path: inset(0 round 12px); opacity 1` over 0.8s `--ease-reveal`. Phase 2 drops inline styles.
- SSR: unchanged. The prerender runs reduced and strips `opacity:0`. **New rule:** any new inline hidden state must
  use `opacity: 0` (stripped) and must not rely on `clip-path` alone. `variant="clip"` always pairs the clip with `opacity: 0`.
  Because the prerender runs under reduced motion, Reveal renders static there and no clip is ever captured. As
  belt-and-braces, `tools/seo/prerender.mjs` L174–177 should also strip inline `clip-path` from hidden states. That
  file is outside client/, so the change is **flagged to the orchestrator**.

### 3.21 New shared motion components (Foundation-B)

1. **`components/ScrubText.jsx/.css`:** the scroll-scrubbed word opacity. Props: `as` (default `p`), `children`
   (a string), `className`. SSR, before mount, under reduced motion or for Tamil text: render the plain string.
   After mount (motion allowed, Latin): split on spaces only into `span.scrub__w` (keeping the spaces), and use framer
   `useScroll({target, offset:['start 0.85','end 0.5']})`. For word i of n, opacity = `useTransform(p, [i/n, (i+1)/n], [0.18, 1])`.
   To avoid n hooks, use one `useMotionValueEvent(p, 'change')` that writes `style.opacity` on each span in rAF
   (or a CSS variable `--p` with `opacity: clamp(.18, (var(--p) * n - i), 1)` via a calc custom property on each
   span; `--i` is set inline). Text colour is unchanged and the effect is reversible. Use one per page at most.
   `aria-hidden` is not needed (the text stays real).
2. **`components/ClipReveal.jsx`:** see 3.13.
3. **`components/FeatureTabs.jsx/.css`:** the Meridian auto-advancing 4/8 list plus media. Props:
   `items=[{id,title,body,media}]` (existing content only), `interval=7500`. ARIA: `role=tablist`, `tab` and
   `tabpanel` with `aria-selected`. Arrow keys move the selection and Home/End jump to the ends. The active title
   expands its body (grid-rows 0fr→1fr, 400ms). The progress is a 1px Ink line under the active tab,
   `transform: scaleX(0→1)` with `transition: transform linear var(--interval)`, restarted by a key. Media crossfade
   is opacity over 400ms `--ease-standard`. All media panels stay in the DOM, stacked in one grid cell
   (`grid-area: 1/1`), with the inactive ones at `opacity:0` and `aria-hidden`. Every item's body text stays in the
   DOM inside its collapsed tab region (grid-rows 0fr, never `display:none`), so the prerender contains all of it. Autoplay pauses on hover, focus-within,
   `document.hidden` or when out of view (IO). There is a visible pause/play icon button (48px circle) with an
   `aria-label` from an existing i18n string; if none exists, **no autoplay** (manual tabs only). Reduced: no autoplay
   and no bar. Mobile <1024: an accordion with the media inline under the active item.
4. **`components/PulliTimeline.jsx/.css`:** the brand-device step timeline used by Home "How it works" (and About
   ladder if wanted). Props: `steps=[{id, label, title, body}]` and `art` (stage index → state). Desktop: a 4/8 split.
   On the left is a vertical tablist of steps with a 2px `--hairline` track on the left edge. The Ink progress fill
   is `scaleY(active/(n-1))`, origin top, over `--dur-4`. Ticks are 2×16px Ink for passed steps and `--hairline`
   ahead. **The active node is the red full stop** (a 10px circle with `--ease-dot` scale 0→1 over 240ms, the only
   red point in the band). On the right is an Ink panel (12px radius, aspect 1/1, max 560px) with one SVG pulli
   lattice (9×9 dots, 16px spacing). States: 0 dot (centre dot Paper, lattice at 0.12), 1 grid (lattice at 0.6),
   2 network (paths `stroke-dashoffset` draw, 800ms), 3 full stop (the network fades to 0.3 and the centre dot grows
   to 32px in SNX Red). Only opacity, transform and dashoffset are animated. **State 0 is fully drawn at first paint**
   (no empty frame). Interaction is click, arrow keys, and an optional scroll-sync (IO on each step's text block, at
   ≥1024 only, without pinning). Mobile: a stacked hairline list, each step with a 120px static mini-art of its
   state. Reduced: no transitions, and the panel shows the active state statically.

### 3.22 Page transitions — `layout/SiteLayout.jsx/.css`, `layout/ScrollManager.jsx`

- On route change (react-router `location.key`), `main` gets `data-route-enter`, which triggers
  `@keyframes route-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }` over
  240ms `--ease-snap`. The attribute is removed on `animationend`. Hash-only changes do not trigger it. Disabled
  under reduced motion. The prerender is unaffected (it runs reduced).
- Remove the dead `@view-transition` rule in base.css (SPA; it never fires).

---

## 4. Motion system (single reference)

| Pattern | Duration | Easing | Distance / values | Trigger | Where |
|---|---|---|---|---|---|
| Reveal (block) | 600ms | `--ease-reveal` | y 12→0, opacity 0→1 | IO, once, −8% bottom margin | all sections |
| Reveal stagger | +60ms each, max 6 | — | — | RevealGroup | card grids, stat rows, steps |
| Section header | 0 / 60 / 120 / 180ms | `--ease-reveal` | y 12 | IO | SectionHeader |
| Media clip-in (hero) | 900ms | `--ease-reveal` | inset 6%→0, scale 1.04→1 | first paint (CSS) | PageHero, BrandHero |
| Media clip-expand (scroll) | scroll-linked | linear | inset(7% 9%)→0 | `start end` → `start 0.25` | Home hero photo, Home film, brand-hub first media band |
| Word scrub | scroll-linked | linear | opacity .18→1 per word | `start 0.85` → `end 0.5` | one statement per page |
| Footer wordmark rise | scroll-linked | linear | y 12%→0 | footer enters | Footer |
| Full stop landing | 480ms | `--ease-dot` | y −0.55em, scale .6→1 | once per session | KineticHeadline |
| Hover: colour | 200ms | `--ease-snap` | — | hover | buttons, links |
| Hover: media zoom | 480ms | `--ease-snap` | scale 1.03 | hover (fine pointer) | media cards |
| Hover: arrow | 200ms | `--ease-snap` | x +4px | hover/focus | arrow links |
| Underline sweep | 240ms | `--ease-snap` | bg-size 0→100% | hover/focus | titles, arrow links |
| Top-rule | 240ms | `--ease-snap` | scaleX 0→1 | hover/focus-within | framed cards, steps |
| Press | 100ms | `--ease-standard` | scale .98 | :active | buttons, chips |
| Sliding indicator | 240ms | `--ease-snap` | translateX + scaleX | activation / hover | nav glide, tabs, segmented, sub-nav |
| Mega panel | 240ms in / 160ms out | `[0.2,0,0,1]` | y −8→0 | hover intent 150 / exit 300 | MegaMenu |
| Scrim | 240ms | linear | opacity | with panel | MegaMenu |
| Header hide / show | 280ms / 240ms | `--ease-header-exit` / `--ease-snap` | translateY −100% | scroll dir, 8px delta, y>120 | Header, BrandSubNav |
| Drawer | 240ms | `--ease-snap` | opacity + content y 8 | open | MobileDrawer |
| Accordion | 400ms (+ icon 240ms) | `cubic-bezier(.25,1,.5,1)` | grid-rows 0fr→1fr | click | Accordion, FeatureTabs mobile |
| Count-up | 1000ms | easeOutCubic | 0→value | IO 40%, once | Stat |
| Line / ring draw-in | 800ms | `--ease-reveal` | dashoffset / scaleX | IO, once | MissionMeter, LedgerCharts, SeatRing |
| Carousel glide (buttons) | native smooth | — | ±(card + gap) | click | Scroller |
| Feature-tab progress | 7500ms | linear | scaleX 0→1 | auto | FeatureTabs |
| Marquee | 32 px/s | linear | translateX | continuous, pausable | Marquee |
| Route enter | 240ms | `--ease-snap` | opacity, y 6 | route change | SiteLayout |
| Consent enter | 320ms | `--ease-reveal` | y 16 | 600ms after load | ConsentBanner |

Rules:
- Animate only `transform`, `opacity`, `clip-path`, `stroke-dashoffset` and colour. The single exception is the
  accordion grid-rows.
- Every hover transform is wrapped in `@media (hover:hover) and (pointer:fine)`. Every hover state has a
  `:focus-visible` equivalent.
- No cursor followers and no custom cursors ("cursor-less"). The pointer gets `grab` on scrollers only.
- At most **one autoplaying element per viewport**. Every autoplay has pause on hover and focus plus a visible
  control, or it does not autoplay.
- **GSAP:** the Home FounderStory pin is replaced by PulliTimeline (no GSAP). LadderScroll, ModelDiagram and
  SeasonTimeline may keep GSAP, but must (a) render the first state fully at first paint, (b) cap pin length at
  1.2 viewports, (c) skip pinning below 1024px and under reduced motion, and (d) be dynamically imported (they already
  are; keep it).
- Lenis: keep. Set `lerp: 0.1` and `wheelMultiplier: 1`. Honour `data-lenis-prevent` / `data-lenis-prevent-wheel`.
  Stop it under reduced motion (it already does).

---

## 5. Interactive features (the list to build)

1. Sliding nav glide (header), sub-nav accent rule glide, tabs and segmented indicators (`useSlidingIndicator`).
2. Mega menu with hover intent, scrim, column stagger and content crossfade between triggers.
3. Header hide on scroll down and show on scroll up, compact glass state, and a scroll-progress hairline on long reads.
4. Mobile full-screen drawer with accordion sections and a sticky Join bar.
5. Hero media clip-in (CSS) on PageHero and BrandHero. Scroll clip-expand (ClipReveal) on the home hero photo.
6. ScrubText statement (one per page group, listed in section 6).
7. PulliTimeline: Home "How it works" (dot → grid → network → full stop).
8. FeatureTabs: auto-advancing with a progress line, where a page already has a 3–5 item list with media (section 6).
9. Scroller: right-bleed snap carousel with counter, ring buttons, progress hairline and drag.
10. Count-up stats with tabular width reservation. Draw-in for MissionMeter, ledger charts and seat rings.
11. Accordion with grid-rows height and a +/− morph.
12. Card hover system: media zoom, title underline sweep, arrow nudge (media cards) and top-rule (framed cards).
13. Filter chips with a press state. List/Calendar segmented thumb.
14. Footer wordmark scroll rise. Consent card entrance.
15. Route-change fade. Full-stop landing once per session.
16. FormSuccess check draw.

---

## 6. Per-page-group notes

### 6.1 HOME (`pages/Home.jsx/.css`, `pages/home/*`)

Section order is unchanged. Ground plan, top to bottom: Ink hero → **sheet rise** → Paper (`#i-am`) → Ink
(`#where-things-stand`, FactBand) → Paper (`#brands`) → FounderStory (Ink panel inside a Paper section) → Bone
(`#mission`) → Paper (`#why-tamil-nadu`) → Ink (`#on-film`) → Bone (`#coming-up`) → Paper (`#open-now`) → Bone
(`#updates`) → Paper (`#stories`) → Bone (`#partner`) → Paper (`#questions`) → CTA band (Ink) → Footer (Ink).
Use the `surface` props to get strict Paper/Bone alternation. Where two Ink bands would touch (CTA band → footer),
separate them with the footer's hairline.

- **Hero:** Ink. Left-aligned on the 12-col grid. h1 in cols 1–10 at `--text-display-2xl`, 400, −0.04em, with
  `accentWord` set to the meaningful word of the existing h1 and the red stop landing once per session. Lede in
  cols 1–6 at `--text-lede` (left-aligned; centring removed). CTAs left. The "Partner with us" line becomes an arrow
  link in `--night-text-2` → Paper, 24px under the buttons. Primary is Paper fill and secondary is a Paper ring
  (fixes the weak pair contrast). The 21:9 photo sits below at full container width, 12px radius, wrapped in
  `ClipReveal` (inset 7%/9% → 0 as it scrolls). Keep `fetchpriority="high"` and do not lazy-load. Target hero height
  ≤ 1.1 viewports at 1440×900, with the photo top visible on load.
- **Persona selector:** a pill segmented / chip grid per 3.12. The disabled "Continue" button gets
  `opacity:1; background: var(--bone); color: var(--ink-500); box-shadow: inset 0 0 0 1px var(--hairline)` plus
  `aria-disabled`, so it reads as inactive rather than broken.
- **FactBand** (`#where-things-stand`): per 3.9. It is the page's **ScrubText** statement: wrap the existing
  statement sentence in `<ScrubText>`. Use a 2×2 stats grid on mobile and a count-up. The "How we count…" link goes
  in the footnote row.
- **Brands (`#brands`):** BrandTiles as media cards, 4-up at ≥1280, 2-up at ≥768, and a Scroller on mobile
  (presentation only; same items and order). Accent dot label per brand. No corner dots.
- **FounderStory → PulliTimeline:** keep the same steps, labels ("A dot · A grid · A network · A full stop") and text.
  Remove the GSAP pin and use PulliTimeline with click, keys and IO scroll-sync. Keep the skip link only if the
  section is still taller than one viewport. Its `nextId` behaviour stays.
- **Mission (`#mission`):** a 5/7 grid with copy top-aligned (fixes the 200px dead space). MissionMeter: the track is
  a 2px hairline, the fill is Ink drawing in over 800ms on view, and the **current value is the red point** (a 12px
  red dot at the fill end, brand 04.4 "Meter"). The number is a count-up.
- **Why Tamil Nadu:** a 7/5 grid with copy and stats on the left (stats 2×2 with vertical hairlines) and the map art
  on the right (mono art per 3.7), using Reveal `variant="clip"`.
- **On film:** VideoFeature full container width, 16/9, wrapped in ClipReveal, with an overlay caption.
- **Coming up / Stories:** Scroller per 3.11, with the controls in the SectionHeader action row.
- **Open now:** ProgrammeCards as framed cards in a 3-up grid.
- **Updates:** UpdatesTabs as a pill segmented control with a sliding indicator. The empty News state uses
  EmptyState (3.18) instead of a bare sentence.
- **Partner:** a 5/7 split with copy left and LogoWall right (mono, hairline cells).
- **Questions:** a 4/8 split with the SectionHeader in cols 1–4 (sticky `top: calc(var(--header-h) + 32px)` at
  ≥1024) and the Accordion in cols 5–12.
- **CTA band:** per 3.15. The h2 is `--text-h1` (no longer 88px). Centred quiet statement plus pulli grid. Lede
  left-aligned in a centred box.
- Home.css `.home-lazy { content-visibility: auto }` stays, with `contain-intrinsic-size: auto 900px`.

### 6.2 BRANDS (`pages/brands/**`, `pages/mega/brand-sub/**`)

/research, /vibe, /connect, /women and their sub-pages. Brand accents stay as they are. Each hub gets **one accent**:
the dot labels, the sub-nav rule, the brand button and data highlights. The red full stop stays only in h1 stops.
Never use Marigold on Vibe or Lagoon on Connect.

- **BrandHero** per 3.5 (16/10 media bleeding right, no outline frame, no floating glass card).
- **First sheet:** the stat row uses Stat per 3.9 in a 4-up row with hairlines between items. On mobile it is
  **2×2**. The "How we tag evidence →" link is styled as a dot-label row (3.9) so the band has a head.
- **ScrubText** on each hub: the lede of the first SectionHeader after the stats (one per hub).
- **FeatureTabs** where a list of 3–5 items with images already exists: Vibe "Four ways in" (`VibeHome.jsx` L138),
  Connect series (`SeriesGrid`) only if each item has media, Women "Rising path" steps (`RisingPath.jsx`) as
  PulliTimeline-style steps with **brand-accent** progress (no red node there; the accent dot is the active node
  because brand pages keep red to the h1 stop). Research: keep the lists, styled as hairline rows.
- Interactive widgets keep their logic. Restyle chips and filters per 3.12, buttons per 3.6 and charts with Ink data
  plus the accent for the current value: NetworkGraph, SeatRing, SwitchStepper, CircleFinder, SchemeExplorer,
  NominationForm, SeasonTimeline and the research components. SeatRing and NetworkGraph draw in once on view (800ms).
  SeasonTimeline (GSAP) follows the rules in section 4.
- Vibathon page: hero and countdown or date figures are tabular. Keep the Vibe orange as the accent, and use
  Ink text on the Vibe fill (existing `--accent-on-fill: ink`).
- Brand sub-pages (`ResearchSub`, `VibeSub`, `ConnectSub`, `WomenSub`, `brand-sub/*`): PageHero or BrandHero per
  3.5, plus standard sections, Paper/Bone alternation and card families per 3.7.
- `OurBrands.jsx`: a 2×2 grid of large media cards at ≥1024 (aspect 16/10), each with the accent dot label and an
  arrow link. Reveal stagger.

### 6.3 EVENTS + PROGRAMMES (`pages/events/**`, `pages/programmes/**`, `pages/mega/events-series/**`, `pages/mega/events-extra/**`)

- **/events list:** filter chips and FacetBar per 3.12. List/Calendar is a pill segmented control with a sliding
  thumb. UrlTabs use the sliding underline. **List view becomes AIWO hairline event rows at ≥1024**: a grid of
  `160px (date: day 32px tabular 400 + month/year meta) | 1fr (title h3 + 2-line description) | 240px (location meta
  + arrow link)`, rows padded 32px with hairlines top and bottom. Hover shows a Bone row background with a 200ms
  arrow nudge. Below 1024 they become EventCards (3.7). Same data and order.
- **EventCalendar:** a 7-col grid with hairlines. Day numbers are tabular. Today is an Ink ring and event days carry
  an Ink dot (not red). Month switch uses an opacity crossfade of 160ms.
- **EventDetail:** a PageHero variant with a sticky sidebar (`top: calc(var(--header-h) + 32px)`) holding the key
  facts as a framed card. The "See upcoming events" button uses the brand Ink (fixes the near-black #0E0E10). The
  agenda is hairline rows with tabular times. EventGallery is a masonry-free 3-col 4/3 grid with a lightbox fade of
  240ms.
- **PastEvents:** the same rows with muted dates.
- **Programmes:** FacetBar chips per 3.12. ProgrammeCards are framed (3.7) in a 3-up grid at ≥1024 and 2-up at ≥768.
  **ProgrammeDetail:** a 8/4 split with a sticky framed "key facts" card on the right. Eligibility and timeline are
  Steps (3.18). FAQ uses Accordion. Use ScrubText on the programme's first lede (one per page).
- **Series / Edition pages:** a hero with a BrandHero-like landscape bleed. Editions in a Scroller. Stats per 3.9.
- **FoundersDay / HostEvent:** standard heroes, Steps, and forms per 3.14.

### 6.4 REST

**About (`pages/about/**`):**
- The in-page section nav is a pill segmented control with a sliding indicator, sticky under the header (it follows
  `sn:header`). **Align its left edge to the container** (fixes x=72 vs 80, via `margin-left: -4px` on the pill inner
  padding, or by removing container padding offset).
- Mission, HowWeWork, Governance and Leadership: standard sections with Paper/Bone alternation and PersonCards as
  media cards (1/1). Timeline is a hairline vertical list with tabular years, and the current year uses the
  **Ink** dot. MissionMeter follows Home. ModelDiagram and EngineMatrix are drawn in Ink lines with the accent only
  on the active node, and draw in on view. LadderScroll (GSAP) follows the section 4 rules: the first state at first
  paint, ≤1.2 viewport pin, and the Ladder's current level is the red point. EvidenceStandard uses hairline rows.
- ScrubText: the Mission statement lede.

**Insights (`pages/insights/**`, `pages/mega/insights-*/**`):**
- The "Founder Ledger" h2 drops from 88px to `--text-h2`. If the ledger figure is a hero number, it uses
  `--text-stat`.
- **LedgerCharts:** grey data (`--ink-300` bars and lines) with the **current value as the red point** (brand 04.4
  "Ledger chart"). Axes are `--ink-400` (UI only) and labels 13px muted tabular. The second series uses Marigold
  (≤5%) or Lagoon. Draw-in is 800ms.
- **StoryDetail / ReportDetail / Methodology** (long reads): a 68ch column, links in Lagoon, the header progress
  hairline on, and ChapterNav as a sticky left rail at ≥1280 with the sliding indicator. Pull quotes follow Quote
  (3.13).
- Reports, Stories and Indices: card families per 3.7. Podcast episodes use hairline rows.
- Stock imagery is a content issue. **Flag it, do not change it.**

**Partner (`pages/partner/**`):** the PartnerType columns are top-rule columns (framed-card top rule, 3.7) in a 3-up
grid. PartnerProof stats per 3.9. LogoWall is mono. EnquiryForm is a White card per 3.14. Use ScrubText on the
partner intro lede.

**StartNet X (`pages/snx/**`, `pages/mega/snx-*/**`):** `[data-brand="x"]` uses red as its accent, so be strict
here. Only one red element per viewport: the h1 stop or the brand button, not both in the same composition. Make
the hero button Ink primary if the stop is visible. Modules: FeatureTabs if each module has an existing
illustration or icon. Pricing: framed cards with tabular prices, Indian grouping, and the recommended plan
marked with an Ink 2px top rule (not a red badge) using its existing label. Trust: hairline rows. Audience pages
(Founders, GCCs, Government, Incubators, Institutions, Investors): PageHero plus standard sections. Developers and
Agents: code blocks on `--night-1` with a 12px radius and a tabular mono **system** font
(`ui-monospace, SFMono-Regular, Menlo, Consolas`). No web font is added.

**Utility / Districts / Join / New** (`pages/utility/**`, `pages/mega/utility-campaign/**`,
`pages/mega/about-districts/**`, `pages/mega/media-careers/**`, `pages/new/**`, `pages/Join.*`):
- Contact: form on a White card (3.14). Route cards are framed cards. The `[confirm]` placeholder chips become neutral
  dashed 4px chips (same text).
- Districts: DistrictLocator map uses mono pulli dots, with the selected district in Ink plus a ring. The district
  page stats follow 3.9. SelfDiagnosis is a stepper with a pill progress and a sliding indicator.
- Join, SignIn, SignUp and campaign landing: MinimalHeader on Ink, with the form on a White card centred in a 6-col
  span. The persona or choice cards are chips/framed cards with an `aria-pressed` Ink fill. FormSuccess per 3.14.
- Media kit and careers: JobDetail uses a long-read column. **MediaKit/Media palette data: do not edit (flagged).**
- OpenCalls, SpeakMentor and Corrections: standard heroes and hairline rows. Corrections list dates are tabular.
- Legal and utility text pages: a non-hero h1 (`--text-h1`) with a 68ch column.

---

## 7. Accessibility, reduced motion and performance guardrails

**Accessibility**
- Contrast (verified in 1.2): body Ink 16.41:1. Muted Ink-500 is only allowed on Paper and Card; Bone uses Graphite.
  Field borders use Ink-500 (≥3:1). Red text only as Red-700 on Paper or Bone and Red-400 on Ink. White on Red-600
  only at ≥14px weight 500. Lagoon text only on Paper or Card (Lagoon-700 on Bone, Lagoon-300 on Ink). Marigold is
  never text on paper; use `#7E4F04`.
- Focus: `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }` on every interactive
  element, with no `outline: none` without a replacement. Cards use one link and an `::after` overlay; the outline goes
  on the link and `.card:has(a:focus-visible)` gets the top-rule or underline state.
- Exactly one `h1` per page. Labels stay `p.eyebrow`, not headings. Tablists use correct `role`, `aria-selected`,
  `aria-controls` and roving tabindex. Chips use `aria-pressed`. Accordions use `aria-expanded` and `aria-controls`.
  Dialogs (drawer, search, lightbox) use `aria-modal`, a focus trap, Esc to close and focus return.
- Targets: ≥44×44 on coarse pointers (chips go to 44px tall under `(pointer:coarse)`).
- Autoplay: pause control or no autoplay (WCAG 2.2.2). Nothing flashes.
- Tamil (`:lang(ta)`): no letter-spacing, no uppercase, no serif accent, no word splitting inside a word (ScrubText
  is disabled for Tamil), display ×0.85, body leading 1.8 and 36em measure. Buttons and chips grow in height rather
  than truncating. Test /ta at 320, 390 and 1440.

**Reduced motion** (both `@media (prefers-reduced-motion: reduce)` and `:root[data-motion="reduced"]`):
- Tokens zero durations and distances (1.6). Components also check `useReducedMotion()` and render final states:
  Reveal static, KineticHeadline dot static, ClipReveal / ScrubText / footer rise plain, count-up final, header never
  hides, FeatureTabs and Marquee not autoplaying, GSAP pins off, Lenis off, route fade off. Colour transitions
  ≤120ms are allowed.

**SSR / prerender**
- Every hidden initial state is client-only and inline `opacity:0` (stripped by `tools/seo/prerender.mjs`), or comes
  from a hook that renders the final state when reduced (the prerender runs reduced). CSS keyframe entrances (hero
  clip-in, dot landing, route fade) are scoped under `prefers-reduced-motion: no-preference` and
  `:root:not([data-motion="reduced"])`.
- No text is created only on the client. ScrubText, FeatureTabs and PulliTimeline render all their text in SSR.
- Verification agents must inject `*{content-visibility:visible!important}` before full-page screenshots.

**Performance**
- No new dependencies. Use framer-motion `LazyMotion` + `m` and its hooks (`useScroll`, `useTransform`,
  `useMotionValueEvent`) for scroll-linked effects. GSAP is not used on Home after this change.
- Only `transform`, `opacity`, `clip-path` and `stroke-dashoffset` are animated. `will-change` is set only during an
  active animation. Never animate `width`, `height`, `top`, `left` or `letter-spacing` (except accordion grid-rows).
- Scroll handlers run passive and rAF-throttled, or through Lenis's single scroll callback. There is one shared
  IntersectionObserver per pattern (Reveal already does this; follow the same approach for count-up and draw-in).
- Images: fixed `aspect-ratio` boxes, a Bone placeholder background, `loading="lazy"` below the fold, and the hero
  `fetchpriority="high"`. Video IO-loads with a 200px rootMargin and a poster.
- No CLS: count-ups reserve width, the sticky header uses transform (not height), indicators are absolutely
  positioned, and the consent card overlays without pushing content.
- Budget: the entry chunk must not grow by more than 3 KB brotli. New components are imported only by the routes
  that use them.

---

## 8. Ownership and order of work

Run Foundation-A first. All other groups then run in parallel. Nobody edits files owned by another group. Shared
needs go in a report.

| Group | Files (exclusive) |
|---|---|
| **Foundation-A (tokens and global)** | `styles/tokens.css`, `styles/theme.css`, `styles/base.css`, `styles/fonts.css`, `styles/pointerFx.css`, `lib/pointerFx.js`, `lib/smoothScroll.js`, `client/index.html`, `client/public/favicon.svg`, `docs/DESIGN.md` (pointer to v2) |
| **Foundation-B (shared components)** | `components/**` except `Logo.*` and `NewsletterForm.*`, plus new `components/{ScrubText,ClipReveal,FeatureTabs,PulliTimeline}.*` and `components/_indicator.js` |
| **Foundation-C (chrome)** | `layout/**`, `components/Logo.*`, `components/NewsletterForm.*` |
| **Home** | `pages/Home.*`, `pages/home/**` |
| **Brands** | `pages/brands/**`, `pages/mega/brand-sub/**` |
| **Events + Programmes** | `pages/events/**`, `pages/programmes/**`, `pages/mega/events-series/**`, `pages/mega/events-extra/**` |
| **Rest** | `pages/about/**`, `pages/insights/**`, `pages/partner/**`, `pages/snx/**`, `pages/new/**`, `pages/Join.*`, `pages/utility/**`, `pages/mega/{about-districts,insights-ledger,insights-reports,media-careers,snx-audiences,snx-extras,utility-campaign}/**` |

Foundation-A moves the chrome blocks out of theme.css (Header L121–162, Brand sub-nav L305–320, Mega menu L331–334,
Mobile drawer L335–364, Breadcrumbs L365–369, Consent and bottom bar L394–402, Footer L281–298). Each block is
appended **unchanged** to the end of its owner CSS file (`layout/Header.css`, `BrandSubNav.css`, `MegaMenu.css`,
`MobileDrawer.css`, `components/Breadcrumbs.css`, `ConsentBanner.css`/`BottomCtaBar.css`, `Footer.css`), so the
owners restyle them there. The button, card, number, accordion, form, badge, KeyFacts and section-header blocks also
move unchanged into their component CSS (Foundation-B owns those afterwards). theme.css keeps: headline type, the
dot-label base, surfaces and the sheet rise, media frames, links and utilities.

Flagged to the orchestrator (outside every group): `tools/seo/prerender.mjs` must also strip inline `clip-path` from
hidden states. MediaKit/Media palette data shows the old hex values. Stock imagery on /insights.

---

## Foundation API (implemented 2026-10-09, Foundation A + B + C)

Everything below is live in `client/src`. Page groups should build on it instead of restyling shared parts in page CSS.
New motion components are **not** in the `components/index.js` barrel (so their code and CSS stay out of the entry
chunk): import them directly, e.g. `import { ScrubText } from '../components/ScrubText.jsx'`.

### Tokens (`styles/tokens.css`, the single source of truth)

- Brand: `--sn-red` #EF4444 and `--sn-red-50…900` (600 #DC2626 = button fill, 700 #B91C1C = red text on Paper/Bone,
  400 #F87171 = red on Ink); `--sn-ink` #0C1719; `--sn-paper` #F4F3EF. Ink ramp `--ink-50…900` (600 Graphite,
  700 Slate). Grounds `--paper --bone --card --white --hairline --line-strong`. Tertiary `--marigold(-100/300/700/800)`
  and `--lagoon(-100/300/700)` (≤5% of a layout; Marigold as text = `--marigold-800`). Night `--night-0/1/2`,
  `--night-line(-strong)`, `--night-subtle`, `--night-text(-2/-muted)`. Brand accents unchanged.
- Semantic: `--color-bg/-raised/-sunken/-form`, `--color-text/-2/-muted`, `--color-border(-strong/-control)`,
  `--color-action(-hover/-active)`, `--color-link(-decoration/-standalone/-longread)`, `--color-focus`,
  `--color-point` (the full stop), `--color-label-dot` (Ink; Paper on Ink; the accent inside `[data-brand]`),
  `--accent*` (masterbrand = Ink). Bone grounds (`.section--white`, `.section--sunken`, `[data-ground="bone"]`)
  switch muted text to Graphite and long-read links to Lagoon-700 automatically.
- Type: `--text-display-2xl/-xl`, `--text-h1…h6`, `--text-lede` (= `--text-body-lg`), `--text-body`, `--text-small`,
  `--text-meta` 14, `--text-caption` 13, `--text-label` 15, `--text-stat` 48→84; `--leading-*`,
  `--tracking-display/-h1/-heading/-h3/-stat` (all 0 on Tamil), `--weight-display` 400, `--weight-heading` 500,
  `--weight-label` 500, `--font-accent`, `--font-mono` (system stack only).
- Layout: `--container-max` 1280, `--gutter` 20/24/32, `--page-margin` (the container edge measured from the viewport
  edge; uses `--sbw`, the scrollbar width published by SiteLayout), `--space-section` 64→128,
  `--space-section-tight` 48→80, `--space-head-gap` 40→64, `--space-block` 48, `--radius-media` 12, `--radius-btn` 4,
  `--radius-chip`, `--sheet-radius` 32/20, `--shadow-overlay` (floating overlays only). The v1 names `--sheet`,
  `--sheet-2`, `--media-radius` and `--btn-radius` still resolve.
- Motion: `--dur-1…6`, `--dur-reveal` 600, `--dur-media` 480, `--dur-count` 1000, `--dur-header` 280;
  `--ease-standard/-enter/-exit/-snap/-reveal/-header-exit/-glide/-dot`; `--shift-reveal` 12px, `--stagger` 60ms,
  `--hover-intent` 150, `--hover-exit` 300, `--marquee-speed` 32. Reduced motion (OS setting or
  `data-motion="reduced"`) zeroes durations and distances.

### Global classes (`styles/base.css`, `styles/theme.css`)

| Class | Use |
|---|---|
| `.display-2xl` `.display-xl` `.h1` `.h2` `.h3` `.h4` `.h5` | type scale at the v2 weights (400 display/h1, 500 h2–h5) |
| `.lede` / `.body-lg` | 18→20 lede (`p.lede` caps at 40ch; Tamil 36em) |
| `.eyebrow` | the "● dot label" (sentence case; dot = `--color-label-dot`, never red) |
| `.meta`, `.tnum` / `.tabular` | 14px muted meta line; tabular lining figures |
| `.arrow-link` + `.arrow-link__label` + `span.arrow[aria-hidden]` | arrow link: arrow +4px, underline sweep |
| `.u-sweep` | underline-sweep text (draws when an ancestor `.card--link` is hovered or has focus inside) |
| `.grid-12` + `.col-4/5/6/7/8/10`, `.col-start-5…9` | 12-col editorial grid at ≥1024 (4 cols with full-width items below) |
| `.bleed-right`, `.bleed` | escape the container to the viewport edge(s) (scrollers, full-bleed media) |
| `.form-card` | White form card (12px, hairline ring, 32/24 padding) |
| `.chip` (+ `aria-pressed`) | 36px filter chip; pressed = Ink fill (defined in `components/Tabs.css`) |
| `.segmented` + `.segmented__item` | pill segmented control; pair with `useSlidingIndicator` and `<span class="ind ind--pill">` |
| `.prose` / `.rich-text` | 68ch long read with Lagoon links |
| `.placeholder` | neutral dashed 4px chip (same text) |

Grounds and the sheet: `Section surface="paper|white|sunken|night|accent"` (white and sunken are both Bone); same-ground
neighbours get a full-bleed hairline; the **one** sheet rise is automatic for the element that follows `.home-hero`,
`.page-hero` or `.brand-hero` (no other section should round its top). `Section pad="tight"` uses
`--space-section-tight`.

### Motion toolkit

| API | What it does | SSR / reduced |
|---|---|---|
| `<Reveal as delay y={12} variant="rise" or "clip">` | one-shot 12px rise (0.6s, `--ease-reveal`) or media clip-in (inset 12% bottom → 0 + fade, 0.8s); −8% viewport margin | static in prerender/reduced; the hidden state is inline `opacity:0` |
| `<RevealGroup as stagger={0.06} y variant>` | staggered children (cap 6 steps) | same |
| `<ClipReveal as>` | scroll-linked media expand inset(7% 9%) → 0 between `start end` and `start 0.25` | plain wrapper before mount / reduced |
| `<ScrubText as="p">string</ScrubText>` | scroll-scrubbed word opacity .18 → 1 (`start 0.85` → `end 0.5`); one per page | plain text before mount, reduced, Tamil |
| `<FeatureTabs items={[{id,title,body,media}]} interval={7500} autoplay label>` | 4/8 auto-advancing tabs, progress line, 48px pause/play (existing "Pause"/"Play" strings), accordion below 1024 | all text in the DOM; no autoplay when reduced |
| `<PulliTimeline steps={[{id,label,title,body}]} node="point" or "accent" scrollSync art>` | dot → grid → network → full stop timeline, red active node (`accent` on brand pages); `PulliArt` is exported for a static mini-art | state 0 at first paint; stacked list on mobile/SSR |
| `<Stat>` count-up | 0 → value over 1000ms easeOutCubic once 40% visible; width reserved in `ch` | final value in SSR and when reduced |
| `useSlidingIndicator(ref, selector, deps)` + `glideTo(box, el)` (`components/_indicator.js`) | measures the active item and writes `--ind-x/-y/-w/-h/-r/-b` + `data-ind-ready`; draw with `<span class="ind ind--line">` (2px underline) or `ind--pill` (clip-path pill) | hidden until measured: give the active item a static style |
| `accentHeadline(text, { accentWord })` (`components/_accent.jsx`) | wraps one Latin word in `<em>` (serif accent) and renders an existing trailing "." as the red `<Dot/>`; never adds characters | no accent on Tamil |
| Magnetic pull | automatic on `.button--primary.button--lg` (and `[data-magnetic]`), max 4px, fine pointers only | off on touch / reduced |
| Media zoom | automatic 1.03 / 480ms on `.card--media.card--link` and `.brand-tile` hover | off when reduced |
| `<Marquee items speed={32} label>` | continuous row; pauses on hover, focus and a hidden tab; visible Pause/Play | static wrapped row when reduced |
| Header events | `window` receives `sn:header` `{ detail: { hidden } }`; `<html data-header-hidden>` while hidden | the header never hides when reduced |
| Route fade | `main[data-route-enter]`: 240ms opacity + 6px on a pathname change (not hash changes) | off when reduced / prerender |

### Component props added or changed

- `Button`: variants `primary` (Ink → Red-600 on hover; Paper on Ink), `secondary` (ring), `tertiary` (arrow link),
  `brand`, `whatsapp` (neutral secondary + glyph), `inverse`; sizes `sm` 36 / `md` 44 / `lg` 52; a string label ending
  in "→" renders the glyph as `span.arrow[aria-hidden]` (same visible text). Legacy `--button-border(-hover)` vars work.
- `Card`: `variant="framed"` (default: Card #FBFAF7, hairline ring, 2px Ink top-rule hover) or `variant="media"`
  (unframed, 12px media), `ratio` ('4/3', '4/5', '1/1', …), `kicker` (14px meta row above the title). Linked titles
  get the underline sweep; the CTA sits bottom-left. `EventCard` (4/3) and `StoryCard` (4/5) use `media`;
  `ReportCard` and `ProgrammeCard` use `framed`; `.card-facts` is a 2-col hairline `dl`.
- `BrandTile`: unframed, 4/5 media, journey line as the accent dot label. `PersonCard`: unframed, 1/1 portrait.
- `SectionHeader`: 8/4 with the action on the title row at ≥1024; label / title / lede / action reveal at
  0 / 60 / 120 / 180ms. `align="center"` centres label and title only (the lede stays left in a 40ch box).
- `FactBand`: a stats row with vertical hairlines (≥1024), 2×2 on mobile; a `link` without a `title` becomes the
  hairline-topped footnote row.
- `Accordion`: grid-rows 0fr → 1fr plus the +/− morph; closed answers keep `hidden` (SSR and crawlers keep the text).
- `Scroller`: bleeds to the viewport edges, snaps, 32px gap, hidden scrollbar, `data-lenis-prevent-wheel`, the existing
  "n of N" counter + 48px ring buttons (one card per press), a 1px progress hairline, grab cursor; directly after a
  `SectionHeader` without an action, the controls share the header's last row at ≥1024.
- `Tabs`: `variant="underline"` (default) or `"pill"` (segmented).
- `CTABand`: centred `--text-h1` title, `accentWord`, an existing trailing "." becomes the red `Dot`; lede in a
  centred 40ch box; static pulli grid; straight edges (`surface="night"` for the Ink band).
- `PageHero`: 7/5 top-aligned, 4/3 media (max 560px), CSS clip-in; `accentWord`.
- `BrandHero`: 16/10 media bleeding right on cols 6–12, no sweep, outline or floating card; `meta` in flow under the
  lede; `accentWord`.
- `KineticHeadline`: words static; `accentWord` (or the legacy `accentFirst`); the stop lands once per session.
- `Badge` / `TagChip`: 4px, 12px 500, one confidence-tag style. `Ladder`: current level = the red point, others Ink
  rings. `Steps`: 01–0N meta index, Ink top rule that thickens on hover (≥1024). `Quote`: h3-size 400 text, Ink-300
  mark. `LogoWall`: mono hairline cells 6/3. `EmptyState`: Card-framed, 240px, mono mini-art. `Skeleton`: shimmer only
  when motion is welcome. `FormSuccess`: Ink circle whose check draws. `Field`: 48px, Ink-500 border, Ink focus ring;
  Night-1 / Ink-400 / Paper focus on Ink.
- Chrome: Header (glide highlight behind the nav pills, 4px Paper current dot, 40px ring icon buttons, compact glass,
  hides after 120px with an 8px delta, `sn:header`, scroll-progress hairline on `/insights/stories/*`,
  `/insights/reports/*` and `/about`); Utility bar 36px with the red Join (Red-600, 28px); Mega menu (Paper panel, 8/4,
  17px links with Bone hover rows, Ink arrows, 40% Ink scrim, 150/300ms intent); Mobile drawer (full-screen Ink, +/−
  rows, sticky red Join bar); Brand sub-nav (Ink, gliding 2px accent rule, edge fade + snap, follows the header);
  Footer (dot-label column heads, 6/3/2 grid, ring social icons, segmented motion switch, mono logo watermark with a
  scroll-linked rise); Consent card (380px; bottom-RIGHT at ≥768 because bottom-left covered the hero CTA at
  1440×900; equal buttons); Bottom CTA bar (Ink, hides over the footer).

### Notes for page groups and the orchestrator (outside Foundation files)

- Page CSS that still draws its own rounded sheets or red dots overrides the foundation and should be removed by its
  owner: `pages/Home.css` (sheet rules near L180–190 and L326–335, `.home-proof .fact-band__title::before` red dot,
  centred `.home-close__inner`), `pages/brands/brandPage.css` (L49–53, L95–106), `pages/about/{Mission,Leadership,shared}.css`,
  `pages/events/EventDetail.css` (L13–17), `pages/brands/vibe/VibeHome.css` (`.vibe-home__hero-art::before/::after`
  outline frame and the `.vibe-home__hero-pulse` floating card, which spec 3.5 removes; it also recolours the hero
  journey line).
- `tools/seo/prerender.mjs` should also strip inline `clip-path` from hidden states (Reveal `variant="clip"` always
  pairs it with `opacity:0`, and the prerender runs reduced, so nothing is captured hidden today).
- `[id] { scroll-margin-top }` was not added: `<html>` already carries `scroll-padding-top` (header + sub-nav) and
  ScrollManager docks hash targets against it, so a margin as well would double the offset.
- MediaKit.jsx / Media.jsx still publish the old hex values as page data (content decision).
