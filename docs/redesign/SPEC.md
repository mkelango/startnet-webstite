# StartNet redesign spec: Plug and Play look, Techstars sizing, StartNet brand

Status: implementable spec for branch `redesign/pnp-ui`. Written 5 Nov 2026 from five research reports in this folder
(`ref-pnp-home.md`, `ref-pnp-inner.md`, `ref-techstars-sizing.md`, `ref-surge-antler.md`, `current-system.md`) and
the StartNet Brand Book v1.0 (`brand-book/pages/03-colour.html`, `04-type.html`, `05-apps.html` §05.8).

All paths are relative to `client/src/` unless they start with `client/`, `server/`, `tools/` or `docs/`.
Every number is a rendered CSS px value at a 16px root. PnP numbers have already been converted from its 18px root.

Where the references disagree, this order decides: **1. Brand book rules → 2. Techstars sizing → 3. Plug and Play
layout and components → 4. Surge and Antler details.** For example, PnP uses 8px button radii, but the brand book
(§05.8 pin 2: "Pill navigation, like the buttons and chips") and Techstars both use pills, so buttons are pills.

---

## 1. Direction in 5 lines

1. **Plug and Play (main look):** a floating light nav card over a dark band, click-open two-pane mega menus,
   full-screen drill-down mobile menu. Flat colour blocks instead of shadows. Big 32px-radius photo tiles, logo
   tiles on a grey ground with captions, Ink CTA headbands (headline left, button right), inset rounded Ink panels,
   chip-topped story cards. The same small hover set everywhere: image zoom 1.05, title underline, arrow nudge.
2. **Surge and Antler:** the sticky in-page pill sub-nav and section order for programme pages (Surge FFF). Fact bands
   for terms from one data source. Founder-story cards with a logo chip and district meta. A moving logo strip. The
   closing question CTA. The one-serif-word `<em>` mechanics with the em-dash lead-in. The district-page anatomy (Antler
   India).
3. **Techstars (sizing):** section heads 32→56px, page h1 36→60, card titles 16→22, body 16→17, stats 32→56. Section
   padding 80→128, head gap 32→56, grid gap 16→24, buttons 40/48px tall, image radius 16. Fluid tokens from 360→1440px.
4. **StartNet brand (unchanged):** Ink #0C1719 / Paper #F4F3EF / one SNX Red #EF4444 point per composition, Inter
   400–500 only, one Instrument Serif Italic word per English headline, sentence case, ranged left. The header and
   hero sit on Ink. Paper sheets rise over the band with a 32px top radius. Warm faded mono photos of Indian people.
   Pulli dot grid texture, Lucide stroke icons. Sub-brand accent only inside its own hub, and never as a ground.
5. **Container:** 1280px content (brand) with a fluid 20→80px page margin, so the content edge sits at x=80 at 1440,
   like PnP's x=90. It widens to 1440px content at ≥1680px, following Techstars' wide-screen rule. Grid column gaps
   are 24px from 768 and 32px from 1280.

---

## 2. Tokens

### 2.1 Decisions behind the numbers

| Concern | Value | Why |
|---|---|---|
| Home h1 | 40 → 88px, weight 500, −0.04em | Techstars 36→90, PnP 90/500; brand book 04.3 display at 500 |
| Page / brand hero h1 | 36 → 72px | unchanged (brand book) |
| Non-hero h1 (articles, listings) | 36 → 60px | Techstars article h1 60 |
| Section h2 (and CTA band title) | 32 → 56px, 500, −0.025em | Techstars section head; PnP mixed 32–42 standardised |
| Card titles h4 | 16 → 22px | Techstars news card |
| Stats | 32 → 56px, weight 400 | Techstars; stats no longer outsize section heads |
| Large stats (hero / gallery pairing) | 40 → 72px | Surge M at 64–72, capped |
| Section padding | 80 → 128px | Techstars 80/128 |
| CTA band padding | 48 → 72px | PnP headband 72 |
| Content width | 1280px (1440 at ≥1680) | brand book 1280, Techstars wide rule |
| Page margin (`--gutter`) | 20 → 80px fluid | PnP content edge x≈90 at 1440; 20px at 360 |
| Column gap (`--grid-gap`) | 16 / 24 / 32px at <768 / 768 / 1280 | brand 24–32 gutters |
| Buttons | pill, 32 / 40 / 48px tall | brand book pills; Techstars heights |
| Image cards | 16px radius | Techstars media 16 |
| Big photo tiles, inset panels, sheets | 32px radius (20px below 768) | PnP 36 rounded to the 4-pt grid; already `--sheet-radius` |
| Shadows | none on cards; overlay shadow only on menus and popovers | PnP depth comes from colour blocks |
| Media hover | `scale(1.05)` over 300ms | PnP |

### 2.2 Ready-to-paste `client/src/styles/tokens.css`

This file replaces the current one in full. Every token name that exists today still exists (see 2.3 for value
changes). Lines marked `NEW` are additions.

```css
/* StartNet design tokens v3 (redesign/pnp-ui · docs/redesign/SPEC.md §2). Single source of truth.
   Brand values live here only; theme.css holds skins, components hold their own CSS. No hex in component or page CSS.
   Contrast ratios in comments are measured on Paper #F4F3EF unless stated. Fluid values interpolate 360 → 1440 px. */
:root {
  /* ===== Layer 1 · shared core (StartNet + ThinkTN) ===== */
  --neutral-0: #FFFFFF; --neutral-50: #F4F3EF; --neutral-100: #EFEDE8; --neutral-200: #E3E1DC; --neutral-300: #CFCEC8; --neutral-400: #B9B8B2;
  --neutral-500: #8B8B93; --neutral-600: #6B6B73; --neutral-700: #4E4E55; --neutral-800: #3A3A40; --neutral-900: #2A2A2F; --neutral-950: #0C1719;
  --night-0: #0C1719; --night-1: #1B292C; --night-2: #2C3E41; --night-line: #263937; --night-line-strong: #39504D;
  --night-subtle: #82979A;        /* 5.94:1 on Ink: UI only */
  --night-text: #F4F3EF;          /* 16.41:1 on Ink */
  --night-text-2: #CFDADC;        /* 12.77:1 on Ink */
  --night-text-muted: #ABBBBE;    /* 9.19:1 on Ink · 5.5:1 on Slate */
  --amber-50: #FFF6E0; --amber-100: #FDEBB8; --amber-300: #F6C64A; --amber-500: #EDA100; --amber-700: #9A5B00; --amber-800: #7A4700;
  --ledger-50: #F0F6FF; --ledger-100: #DFEDFF; --ledger-200: #BEDAFF; --ledger-300: #92C1FE; --ledger-400: #63A5FA;
  --ledger-500: #3C8CEF; --ledger-600: #2A78D6; --ledger-700: #145CAE; --ledger-800: #0A4689; --ledger-900: #022F61;
  --dv-1: #2A78D6; --dv-2: #D0670F; --dv-3: #0F4C45; --dv-4: #B73C7C; --dv-5: #5B2A86; --dv-context: #ABBBBE;
  --dv-night-1: #4D97F5; --dv-night-2: #F5A04A; --dv-night-3: #7FE0C4; --dv-night-4: #E2589A; --dv-night-5: #B7A6FF; --dv-night-context: #39504D;

  /* ===== Layer 2 · StartNet brand (Brand Book 03) ===== */
  --sn-ink: #0C1719; --sn-red: #EF4444; --sn-paper: #F4F3EF; --sn-white: #FFFFFF;
  --sn-research: #4A3AA7; --sn-vibe: #E2581F; --sn-connect: #0E8F63; --sn-women: #C2386F;
  /* Button fill Red-600 (white 4.83:1). Red text: Red-700 on Paper 5.83 / Bone 5.37; Red-400 on Ink 6.59.
     SNX Red itself is the full stop (3.39:1 on Paper: large / decorative only; 4.84:1 on Ink). */
  --sn-red-50: #FEF2F2; --sn-red-100: #FEE2E2; --sn-red-200: #FECACA; --sn-red-300: #FCA5A5; --sn-red-400: #F87171;
  --sn-red-500: #EF4444; --sn-red-600: #DC2626; --sn-red-700: #B91C1C; --sn-red-800: #991B1B; --sn-red-900: #7F1D1D;
  --sn-research-50: #F4F5FF; --sn-research-100: #E8E9FF; --sn-research-200: #D2D3FF; --sn-research-300: #B5B5FE; --sn-research-400: #9894FF;
  --sn-research-500: #8174FD; --sn-research-600: #6B55EC; --sn-research-700: #5641C5; --sn-research-800: #4A3AA7; --sn-research-900: #2C1D70;
  --sn-vibe-50: #FFF3EF; --sn-vibe-100: #FEE5DC; --sn-vibe-200: #FECAB8; --sn-vibe-300: #FDA485; --sn-vibe-400: #F37C52;
  --sn-vibe-500: #E2581F; --sn-vibe-600: #C44407; --sn-vibe-700: #9F3605; --sn-vibe-800: #7C2700; --sn-vibe-900: #571900;
  --sn-connect-50: #EFF9F3; --sn-connect-100: #DDF1E6; --sn-connect-200: #BBE2CE; --sn-connect-300: #8FCEAF; --sn-connect-400: #5DB88F;
  --sn-connect-500: #2AA375; --sn-connect-600: #0E8F63; --sn-connect-700: #006F4B; --sn-connect-800: #025639; --sn-connect-900: #013A26;
  --sn-women-50: #FFF2F5; --sn-women-100: #FFE3EA; --sn-women-200: #FEC6D5; --sn-women-300: #FB9EBA; --sn-women-400: #F0749E;
  --sn-women-500: #E05086; --sn-women-600: #C2386F; --sn-women-700: #A12659; --sn-women-800: #7E1944; --sn-women-900: #590C2D;
  --ink-50: #F4F7F8; --ink-100: #E8EEEF; --ink-200: #CFDADC; --ink-300: #ABBBBE;
  --ink-400: #82979A;   /* 2.76:1 on Paper: decoration only */
  --ink-500: #5E7377;   /* captions: 4.51 Paper · 4.80 Card · 5.01 White · 4.16 Bone (fails: Graphite on Bone) */
  --ink-600: #42575A;   /* Graphite: 6.90 Paper · 6.36 Bone */
  --ink-700: #2C3E41;   /* Slate: raised dark panels */
  --ink-800: #1B292C;
  --ink-900: #0C1719;   /* Ink */
  --paper: #F4F3EF; --bone: #EBEAE5; --card: #FBFAF7; --white: #FFFFFF;
  --hairline: #DAD8D0; --line-strong: #B9B7AE;
  /* Tertiary: each ≤5% of a layout, never status, never replaces the red stop */
  --marigold: #FBA62A; --marigold-100: #FFEBD5; --marigold-300: #FFC580; --marigold-700: #A86B02; --marigold-800: #7E4F04;
  --lagoon: #117780; --lagoon-100: #D9F0F3; --lagoon-300: #88C7CE; --lagoon-700: #024C52;
}

/* ===== Layer 3 · semantic (day = Paper) ===== */
:root {
  --color-bg: var(--paper);
  --color-bg-raised: var(--card);
  --color-bg-sunken: var(--bone);
  --color-bg-form: var(--white);
  --color-bg-tile: var(--bone);                 /* NEW logo tiles, mega-menu right pane, filter bands (PnP #F5F5F7) */
  --color-bg-chrome: var(--card);               /* NEW floating nav card, mega-menu left pane */
  --color-text: var(--ink-900);
  --color-text-2: var(--ink-600);
  --color-text-muted: var(--ink-500);
  --color-border: var(--hairline);
  --color-border-strong: var(--line-strong);
  --color-border-control: var(--ink-500);
  --color-action: var(--sn-red-600);            /* the ONE red CTA (Button variant="point") */
  --color-action-hover: var(--sn-red-700);
  --color-action-active: var(--sn-red-800);
  --color-on-action: #FFFFFF;
  --color-cta: var(--ink-900);                  /* NEW every other primary button (Ink fill) */
  --color-cta-hover: var(--ink-700);            /* NEW Slate */
  --color-cta-active: var(--ink-800);           /* NEW */
  --color-on-cta: var(--paper);                 /* NEW */
  --color-link: var(--ink-900);
  --color-link-decoration: rgb(12 23 25 / .35);
  --color-link-standalone: var(--ink-900);
  --color-link-longread: var(--lagoon);
  --color-focus: var(--ink-900);
  --color-point: var(--sn-red);
  --color-point-text: var(--sn-red-700);        /* NEW small red text on Paper */
  --color-label-dot: var(--ink-900);
  --color-success: var(--sn-connect-700);  --color-success-bg: var(--sn-connect-50);
  --color-error: var(--sn-red-700);        --color-error-bg: var(--sn-red-50);
  --color-warning: var(--amber-800);       --color-warning-bg: var(--amber-50); --color-warning-icon: var(--amber-500);
  --color-info: var(--ledger-700);         --color-info-bg: var(--ledger-50);
  --scrim: rgb(12 23 25 / .25);                 /* NEW mega-menu / drawer page scrim */
  --overlay-photo: rgb(12 23 25 / .40);         /* NEW flat Ink scrim on photo tiles (no gradients) */
  --overlay-photo-strong: rgb(12 23 25 / .60);  /* NEW hover / long titles / photo heroes */
  --pulli-dot: rgb(12 23 25 / .10);             /* NEW pulli dot grid colour on Paper */
  --pulli-size: 24px;                           /* NEW pulli grid pitch */

  /* Brand accent slot: masterbrand = Ink */
  --accent: var(--ink-900); --accent-text: var(--ink-900); --accent-tint: var(--bone);
  --accent-fill: var(--ink-900); --accent-on-fill: var(--paper); --accent-night: var(--night-text);

  /* ---- Type ---- */
  --font-system-tamil: "Noto Sans Tamil Fallback", "Nirmala UI", "Tamil Sangam MN", "Tamil MN", "Latha", "Noto Sans Tamil UI";
  --font-sans: "Inter Variable", "Inter Fallback", system-ui, -apple-system, "Segoe UI", Roboto, var(--font-system-tamil), Arial, sans-serif;
  --font-display: var(--font-sans);
  --font-accent: 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif;   /* ONE word per English headline */
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --text-display-2xl: clamp(2.5rem, 1.5rem + 4.4444vw, 5.5rem);     /* 40→88 home h1 only */
  --text-display-xl:  clamp(2.25rem, 1.5rem + 3.3333vw, 4.5rem);    /* 36→72 page / brand hero h1 */
  --text-display: var(--text-display-xl);
  --text-h1:          clamp(2.25rem, 1.75rem + 2.2222vw, 3.75rem);  /* 36→60 non-hero h1 (article, listing) */
  --text-h2:          clamp(2rem, 1.5rem + 2.2222vw, 3.5rem);       /* 32→56 section heads, CTA band title */
  --text-h3:          clamp(1.25rem, 1.1667rem + 0.3704vw, 1.5rem); /* 20→24 feature / tile titles, sub-sections */
  --text-h4:          clamp(1rem, 0.875rem + 0.5556vw, 1.375rem);   /* 16→22 card titles */
  --text-h5:          clamp(1.125rem, 1.0833rem + 0.1852vw, 1.25rem); /* 18→20 small card titles, accordion */
  --text-h6:          clamp(1rem, 0.9583rem + 0.1852vw, 1.125rem);  /* 16→18 */
  --text-quote:       clamp(1.5rem, 1.1667rem + 1.4815vw, 2.5rem);  /* NEW 24→40 testimonial text */
  --text-lede:        clamp(1.125rem, 1.0833rem + 0.1852vw, 1.25rem); /* 18→20 */
  --text-body-lg: var(--text-lede);
  --text-body:        clamp(1rem, 0.9792rem + 0.0926vw, 1.0625rem); /* 16→17 */
  --text-small:       clamp(0.875rem, 0.8542rem + 0.0926vw, 0.9375rem); /* 14→15 */
  --text-meta:        0.875rem;   /* 14 */
  --text-caption:     0.8125rem;  /* 13 (14 below 768) */
  --text-label:       0.9375rem;  /* 15 dot labels */
  --text-eyebrow: var(--text-label);
  --text-nav:         0.9375rem;  /* NEW 15 header triggers */
  --text-button:      0.9375rem;  /* NEW 15 md buttons */
  --text-button-sm:   0.875rem;   /* NEW 14 */
  --text-button-lg:   1rem;       /* NEW 16 */
  --text-stat:        clamp(2rem, 1.5rem + 2.2222vw, 3.5rem);       /* 32→56 */
  --text-stat-lg:     clamp(2.5rem, 1.8333rem + 2.963vw, 4.5rem);   /* NEW 40→72 hero / gallery stats */
  --leading-display: 1.02; --leading-heading: 1.12; --leading-body: 1.5;
  --leading-h1: 1.08; --leading-h2: 1.12; --leading-h3: 1.3; --leading-h4: 1.25; /* NEW */
  --leading-lede: 1.4; --leading-stat: 1.05; --leading-quote: 1.25;              /* NEW */
  --tracking-display: -0.04em; --tracking-h1: -0.035em; --tracking-heading: -0.025em; --tracking-h3: -0.015em;
  --tracking-h2: -0.025em; --tracking-h4: -0.01em;                               /* NEW */
  --tracking-stat: -0.03em; --tracking-eyebrow: 0;
  --weight-display: 500; --weight-heading: 500; --weight-label: 500; --weight-body: 400;

  /* ---- Space (4-point) ---- */
  --space-0-5: 2px;
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem; --space-5: 1.25rem;
  --space-6: 1.5rem; --space-8: 2rem; --space-10: 2.5rem; --space-12: 3rem; --space-14: 3.5rem; --space-16: 4rem;
  --space-20: 5rem; --space-24: 6rem; --space-32: 8rem;
  --space-section:       clamp(5rem, 4rem + 4.4444vw, 8rem);          /* 80→128 standard section */
  --space-section-tight: clamp(3rem, 2.6667rem + 1.4815vw, 4rem);     /* 48→64 logo wall, listing blocks */
  --space-band:          clamp(1.5rem, 1.3333rem + 0.7407vw, 2rem);   /* NEW 24→32 stat / ticker strip */
  --space-cta-band:      clamp(3rem, 2.5rem + 2.2222vw, 4.5rem);      /* NEW 48→72 CTA headband, newsletter */
  --space-hero-top:      clamp(3rem, 1.5rem + 6.6667vw, 7.5rem);      /* NEW 48→120 below the shell */
  --space-hero-top-page: clamp(2.5rem, 1.6667rem + 3.7037vw, 5rem);   /* NEW 40→80 inner heroes */
  --space-hero-bottom:   clamp(3rem, 2rem + 4.4444vw, 6rem);          /* NEW 48→96 (+ sheet radius) */
  --space-head-gap:      clamp(2rem, 1.5rem + 2.2222vw, 3.5rem);      /* 32→56 section header → content */
  --space-label-gap:     clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem);   /* 16→24 eyebrow → title */
  --space-lede-gap:      clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem);   /* 16→24 title → lede */
  --space-grid-row:      clamp(2rem, 1.6667rem + 1.4815vw, 3rem);     /* 32→48 listing row gap */
  --space-block: 3rem;
  --gap-grid:            clamp(1rem, 0.8333rem + 0.7407vw, 1.5rem);   /* NEW 16→24 card grids, both axes */
  --gap-grid-loose: 2rem;                                              /* NEW 32 footer / link columns */
  --gap-split:           clamp(3rem, 2rem + 4.4444vw, 6rem);          /* NEW 48→96 two-column text + media */
  --grid-gap: 16px;                                                    /* NEW 12-col column gap: 16 / 24 / 32 */
  --pad-card:            clamp(1.25rem, 1.1667rem + 0.3704vw, 1.5rem);/* NEW 20→24 */
  --pad-card-lg:         clamp(1.5rem, 1rem + 2.2222vw, 3rem);        /* NEW 24→48 quote, informative, ticket */
  --measure: 68ch;
  --measure-head: 45rem;   /* 720 section header block */
  --measure-lede: 35rem;   /* 560 lede */
  --measure-article: 56.25rem; /* NEW 900 article column */
  --measure-hero: 37.5rem; /* NEW 600 hero text column */

  /* ---- Radius ---- */
  --radius-0: 0; --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 20px; --radius-full: 9999px;
  --radius-2xl: 24px;                /* NEW */
  --radius-card: 12px;               /* NEW framed cards, nav card, mega menu, ticket card */
  --radius-input: 8px;               /* NEW fields, selects, checkboxes 4px */
  --radius-media: 16px;              /* image cards (was 12) */
  --radius-panel: 32px;              /* NEW big photo tiles, brand tiles, inset Ink panels (20 below 768) */
  --radius-btn: 9999px;              /* pill (was 4px) */
  --radius-chip: 9999px;
  --media-radius: var(--radius-media); --btn-radius: var(--radius-btn);
  --sheet-radius: 32px;

  /* ---- Elevation: flat by default ---- */
  --shadow-1: 0 1px 2px rgb(12 23 25 / .06), 0 1px 1px rgb(12 23 25 / .04);
  --shadow-2: 0 4px 12px rgb(12 23 25 / .08), 0 2px 4px rgb(12 23 25 / .05);
  --shadow-3: 0 12px 32px rgb(12 23 25 / .14), 0 4px 8px rgb(12 23 25 / .06);
  --shadow-overlay: 0 16px 48px rgb(12 23 25 / .16), 0 2px 6px rgb(12 23 25 / .06);
  --shadow-header: 0 1px 0 var(--hairline), 0 8px 24px -12px rgb(12 23 25 / .18); /* NEW nav card once over Paper */
  --focus-ring: 0 0 0 2px var(--color-focus);
  --focus-offset: 2px;                                                  /* NEW outline-offset */
  --border-hair: 1px solid var(--color-border);

  /* ---- Layout ---- */
  --container-max: 80rem;            /* 1280 content; 90rem at ≥1680 */
  --gutter: clamp(1.25rem, 5.5556vw, 5rem);   /* page margin 20 → 80 (x=80 at 1440) */
  --page-margin: max(var(--gutter), calc((100vw - var(--sbw, 0px) - var(--container-max)) / 2));
  --sheet: var(--paper); --sheet-2: var(--bone);

  /* ---- Component sizes ---- */
  --btn-h-sm: 2rem; --btn-h-md: 2.5rem; --btn-h-lg: 3rem;              /* NEW 32 / 40 / 48 */
  --btn-px-sm: 0.875rem; --btn-px-md: 1.25rem; --btn-px-lg: 1.75rem;   /* NEW 14 / 20 / 28 */
  --btn-icon: 3rem; --btn-icon-sm: 2.5rem;                             /* NEW 48 carousel arrows, 40 header icons */
  --chip-h: 2rem; --chip-h-sm: 1.5rem; --chip-h-lg: 2.5rem;            /* NEW 32 / 24 / 40 (tag cloud) */
  --input-h: 3rem;                                                     /* NEW 48 */
  --ar-card: 3 / 2; --ar-wide: 16 / 10; --ar-video: 16 / 9; --ar-portrait: 4 / 5;
  --ar-square: 1 / 1; --ar-tile: 6 / 5; --ar-report: 3 / 4; --ar-hero: 4 / 3;  /* NEW aspect ratios */
  --media-zoom: 1.05;                                                  /* NEW hover zoom */
  --mega-pane-w: 18.75rem;                                             /* NEW 300 mega-menu left pane */
}
@media (min-width: 768px)  { :root { --grid-gap: 24px; } }
@media (min-width: 1280px) { :root { --grid-gap: 32px; } }
@media (min-width: 1680px) { :root { --container-max: 90rem; } }
@media (max-width: 767.98px) { :root { --sheet-radius: 20px; --radius-panel: 20px; --text-caption: 0.875rem; } }
@media (pointer: coarse) { :root { --btn-h-sm: 2.5rem; --btn-h-md: 2.75rem; } }  /* 40 / 44 touch minimum */

/* Brand pages: accents switch by token */
[data-brand="research"] { --accent: var(--sn-research); --accent-text: var(--sn-research-700); --accent-tint: var(--sn-research-50);
  --accent-fill: var(--sn-research); --accent-on-fill: #FFFFFF; --accent-night: var(--sn-research-400); --color-label-dot: var(--accent); }
[data-brand="vibe"]     { --accent: var(--sn-vibe); --accent-text: var(--sn-vibe-700); --accent-tint: var(--sn-vibe-50);
  --accent-fill: var(--sn-vibe); --accent-on-fill: var(--sn-ink); --accent-night: var(--sn-vibe-400); --color-label-dot: var(--accent); }
[data-brand="connect"]  { --accent: var(--sn-connect); --accent-text: var(--sn-connect-700); --accent-tint: var(--sn-connect-50);
  --accent-fill: var(--sn-connect-700); --accent-on-fill: #FFFFFF; --accent-night: var(--sn-connect-400); --color-label-dot: var(--accent); }
[data-brand="women"]    { --accent: var(--sn-women); --accent-text: var(--sn-women-700); --accent-tint: var(--sn-women-50);
  --accent-fill: var(--sn-women); --accent-on-fill: #FFFFFF; --accent-night: var(--sn-women-400); --color-label-dot: var(--accent); }
[data-brand="x"]        { --accent: var(--sn-red); --accent-text: var(--sn-red-700); --accent-tint: var(--sn-red-50);
  --accent-fill: var(--sn-red-600); --accent-on-fill: #FFFFFF; --accent-night: var(--sn-red-400); --color-label-dot: var(--accent); }

/* Bone grounds: muted text steps to Graphite */
.section--white, .section--sunken, [data-ground="bone"] { --color-text-muted: var(--ink-600); --color-link-longread: var(--lagoon-700);
  --color-bg-tile: var(--card); }

/* Night surface (Ink) */
[data-surface="night"] {
  --color-bg: var(--night-0); --color-bg-raised: var(--night-1); --color-bg-sunken: var(--night-0); --color-bg-form: var(--night-1);
  --color-bg-tile: var(--night-1); --color-bg-chrome: var(--card);
  --color-text: var(--night-text); --color-text-2: var(--night-text-2); --color-text-muted: var(--night-text-muted);
  --color-border: var(--night-line); --color-border-strong: var(--night-line-strong); --color-border-control: var(--ink-400);
  --color-link: var(--night-text); --color-link-decoration: rgb(244 243 239 / .4); --color-link-standalone: var(--paper);
  --color-link-longread: var(--lagoon-300);
  --color-focus: var(--paper); --color-label-dot: var(--paper);
  --color-cta: var(--paper); --color-cta-hover: #FFFFFF; --color-cta-active: var(--bone); --color-on-cta: var(--ink-900);
  --color-point-text: var(--sn-red-400);
  --pulli-dot: rgb(244 243 239 / .08);
  --accent-text: var(--accent-night);
  --color-success: var(--sn-connect-400); --color-error: var(--sn-red-400);
  --color-warning: var(--amber-300); --color-info: var(--ledger-300);
  background: var(--color-bg); color: var(--color-text);
}
/* NEW raised dark panel (Slate): newsletter band, ticket card on Ink, quote panel */
[data-surface="night"][data-tone="raised"] { --color-bg: var(--night-2); --color-bg-raised: var(--night-1);
  --color-border: var(--night-line-strong); --color-bg-tile: var(--night-1); background: var(--color-bg); }
[data-brand] [data-surface="night"], [data-surface="night"][data-brand] { --color-label-dot: var(--accent-night); }

/* Tamil */
:root:lang(ta) {
  --font-sans: "Inter Variable", "Noto Sans Tamil Variable", "Inter Fallback", "Noto Sans Tamil Fallback",
    system-ui, -apple-system, "Segoe UI", Roboto, var(--font-system-tamil), Arial, sans-serif;
  --font-display: "Inter Variable", "Anek Tamil Variable", "Noto Sans Tamil Variable", "Inter Fallback",
    "Noto Sans Tamil Fallback", system-ui, -apple-system, "Segoe UI", Roboto, var(--font-system-tamil), Arial, sans-serif;
}
html:not([lang="ta"]) [lang="ta"] {
  --font-sans: "Inter Variable", "Inter Fallback", var(--font-system-tamil), system-ui, sans-serif;
  --font-display: var(--font-sans);
  font-family: var(--font-sans);
}
/* Display and headings ×0.85 (each clamp term × 0.85); Home.css keeps its own ×0.82 for --text-display-2xl */
:lang(ta) {
  --text-display-2xl: clamp(2.125rem, 1.275rem + 3.7778vw, 4.675rem);
  --text-display-xl: clamp(1.9125rem, 1.275rem + 2.8333vw, 3.825rem);
  --text-display: var(--text-display-xl);
  --text-h1: clamp(1.9125rem, 1.4875rem + 1.8889vw, 3.1875rem);
  --text-h2: clamp(1.7rem, 1.275rem + 1.8889vw, 2.975rem);
  --text-quote: clamp(1.275rem, 0.9917rem + 1.2593vw, 2.125rem);
}
:lang(ta) {
  --tracking-display: 0; --tracking-heading: 0; --tracking-eyebrow: 0; --tracking-h1: 0; --tracking-h2: 0;
  --tracking-h3: 0; --tracking-h4: 0; --tracking-stat: 0;
  --leading-display: 1.25; --leading-heading: 1.35; --leading-h1: 1.3; --leading-h2: 1.35; --leading-h3: 1.4;
  --leading-h4: 1.4; --leading-lede: 1.7; --leading-quote: 1.45; --leading-body: 1.8;
  --text-body: clamp(1.0625rem, 1.0417rem + 0.0926vw, 1.125rem);   /* ×1.06: 17 → 18 */
  --text-lede: clamp(1.1875rem, 1.1458rem + 0.1852vw, 1.3125rem);  /* ×1.06: 19 → 21 */
  --text-caption: 0.875rem;                                          /* 14 minimum */
  --text-label: 0.875rem;
}
:lang(ta) .eyebrow { text-transform: none; font-size: 0.875rem; }
@media (max-width: 399.98px) {
  :lang(ta) {
    --text-display-2xl: clamp(1.5rem, 7.8vw, 2.125rem);
    --text-display-xl: clamp(1.4rem, 7.4vw, 1.9125rem);
    --text-display: var(--text-display-xl);
    --text-h1: clamp(1.375rem, 7.2vw, 1.9125rem);
    --text-h2: clamp(1.25rem, 6.6vw, 1.7rem);
    --text-h3: clamp(1.125rem, 5.9vw, 1.375rem);
  }
}

/* ===== Motion ===== */
:root {
  --dur-0: 0ms; --dur-1: 100ms; --dur-2: 200ms; --dur-3: 240ms; --dur-4: 320ms; --dur-5: 480ms; --dur-6: 800ms;
  --dur-reveal: 400ms;
  --dur-media: 300ms;        /* media hover zoom 1.05 (PnP 300ms; was 480) */
  --dur-count: 1000ms;
  --dur-header: 280ms;
  --dur-menu: 200ms;         /* NEW mega-menu panel fade + 8px drop */
  --dur-drawer: 320ms;       /* NEW mobile drill-down slide */
  --ease-standard:   cubic-bezier(0.2, 0, 0.38, 0.9);
  --ease-enter:      cubic-bezier(0, 0, 0.3, 1);
  --ease-exit:       cubic-bezier(0.2, 0, 1, 0.9);
  --ease-expressive: cubic-bezier(0.4, 0.14, 0.3, 1);
  --ease-snap:       cubic-bezier(0.2, 0, 0, 1);
  --ease-reveal:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-header-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-glide:      cubic-bezier(0.2, 0.8, 0.3, 0.97);
  --ease-media:      cubic-bezier(0.4, 0, 0.2, 1);    /* NEW image zoom (PnP ease-in-out) */
  --ease-dot:        cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-linear:     linear;
  --shift-1: 4px; --shift-2: 8px; --shift-3: 16px; --shift-4: 24px; --shift-reveal: 8px;
  --stagger: 60ms; --hover-intent: 150ms; --hover-exit: 300ms; --marquee-speed: 32;
}
@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="full"]) { --dur-2: 0ms; --dur-3: 0ms; --dur-4: 120ms; --dur-5: 0ms; --dur-6: 0ms; --dur-count: 0ms;
    --dur-reveal: 0ms; --dur-media: 0ms; --dur-header: 0ms; --dur-menu: 0ms; --dur-drawer: 120ms; --media-zoom: 1;
    --shift-1: 0px; --shift-2: 0px; --shift-3: 0px; --shift-4: 0px; --shift-reveal: 0px; }
}
:root[data-motion="reduced"] { --dur-2: 0ms; --dur-3: 0ms; --dur-4: 120ms; --dur-5: 0ms; --dur-6: 0ms; --dur-count: 0ms;
  --dur-reveal: 0ms; --dur-media: 0ms; --dur-header: 0ms; --dur-menu: 0ms; --dur-drawer: 120ms; --media-zoom: 1;
  --shift-1: 0px; --shift-2: 0px; --shift-3: 0px; --shift-4: 0px; --shift-reveal: 0px; }

/* ===== Chrome dimensions (Header.jsx L98-99 must mirror these) ===== */
:root {
  --wa-500: #25D366;
  --header-h: 72px;             /* nav card height ≥1024 */
  --header-h-compact: 56px;     /* nav card height <1024 */
  --header-inset: 8px;          /* NEW gap around the floating card (top on <1024, between tab and card ≥1024; sides 12) */
  --header-side: 12px;          /* NEW side inset of the card ≥1024 (8 below) */
  --utility-h: 32px;            /* utility tab ≥1024 (was 36) */
  --subnav-h: 48px;
  --shell-top: calc(var(--utility-h) + var(--header-inset) + var(--header-h));   /* NEW 112 at rest ≥1024 */
}
@media (max-width: 1023.98px) {
  :root { --header-h: 56px; --header-side: 8px; --shell-top: calc(var(--header-inset) + var(--header-h)); }  /* 64 */
}

/* ===== z-index ladder (NEW names; numbers match today) ===== */
:root {
  --z-raised: 1; --z-subnav: 20; --z-sticky: 30; --z-back-to-top: 54; --z-bottom-cta: 55;
  --z-scrim: 58; --z-header: 60; --z-mega: 61; --z-drawer: 70; --z-consent: 80; --z-search: 90; --z-skip: 1000;
}

/* ===== Breakpoints (reference only; media queries cannot read custom properties) =====
   sm 600  · card grids 1 → 2 columns
   md 768  · desktop section padding, 2-col splits, header rows, sheet radius 32
   lg 1024 · 12-col grid, desktop nav + utility tab (Tamil: desktop nav from 1280), sticky side rails
   xl 1280 · 3–5 column grids, 32px column gap
   2xl 1680 · 1440px content */
```

### 2.3 Migration map (name kept, value changed)

No token is renamed or removed in this pass. These values change, so G1 must check the pages that use them (use counts
come from `current-system.md`):

| Token | Old | New | Visible effect / who checks |
|---|---|---|---|
| `--text-display-2xl` | 40→80 effective | 40→88 | Home h1 a little bigger at 1440 (G6) |
| `--text-h1` | 32→56 | 36→60 | 21 uses / 17 files; CTA-band statements move to `--text-h2` (G3) |
| `--text-h2` | 26→40 | 32→56 | the biggest change. 29 uses / 25 files. Every page group checks section heads for wrapping at 375 |
| `--text-h4` | 19→24 | 16→22 | card titles (G5) |
| `--text-h5` / `--text-h6` | 17→20 / 15→17 | 18→20 / 16→18 | small titles |
| `--text-stat` | 48→84 | 32→56 | `Stat`, `FactBand` (G4). Use `--text-stat-lg` where the old big look is wanted (hero stats, Mission meter) |
| `--weight-display` | 400 | 500 | brand book 04.3 display at 500, PnP 500. `base.css` h1 400 → `var(--weight-display)` |
| `--tracking-heading` | −0.02em | −0.025em | h2 at 56px |
| `--space-section` | 64→128 | 80→128 | phones get 16px more |
| `--space-section-tight` | 48→80 | 48→64 | |
| `--space-head-gap` | 40→64 | 32→56 | |
| `--space-label-gap` / `--space-lede-gap` | 24 / 32 | 16→24 / 16→24 | |
| `--space-grid-row` | 56 (unused) | 32→48 | now used by listing grids |
| `--measure-head` / `--measure-lede` | 52rem / 44ch | 45rem / 35rem | |
| `--gutter` | 20 / 24 / 32 stepped | 20→80 fluid | 38 uses / 19 files. **Any file that uses `--gutter` as a column gap must switch to `--grid-gap`** (G1 greps and lists them in its PR) |
| `--radius-btn` (+ `--btn-radius`) | 4px | 9999px | 151 uses. Pills everywhere. Page CSS that sets `border-radius: var(--btn-radius)` on non-buttons (inputs, tiles) must switch to `--radius-input` / `--radius-card` |
| `--radius-media` (+ `--media-radius`) | 12px | 16px | 274 uses |
| `--utility-h` | 36 | 32 | Header.jsx `const utility = wide ? (coarse ? 40 : 36) : 0` becomes `wide ? 32 : 0` |
| `--dur-media` | 480ms | 300ms | |
| `--header-h` below 1024 | 56 (media 1023px) | 56 (media 1023.98px) | same value |

Deprecated (zero `var()` uses, kept for now, deleted by G10 after the sweep): all `--neutral-*` except `--neutral-0`,
all `--dv-night-*`, `--ledger-100/200/400/500/600/800/900`, `--marigold-100/300/700/800`, `--font-mono`, `--wa-500`.
Do **not** introduce the Techstars report's `--fs-*` names; `--text-*` stays canonical.

---

## 3. Global shell

### 3.1 Header (`layout/Header.*`, `UtilityBar.*`, `SiteLayout.*`)

**Structure ≥1024px** (Tamil: ≥1280px, `desktopNavQuery`):

```
fixed wrapper .site-header   top 0 · left 0 · right 0 · z var(--z-header) · padding 0 var(--header-side)
├─ utility tab .utility-bar   height 32 · right-aligned, margin-right 24 · Bone bg · radius 0 0 12px 12px
│                             padding 0 16 · links 13px/500 Ink, gap 20, separators none
│                             order: Media · Careers (count) · Contact · EN | தமிழ் · Sign in
└─ nav card .site-header__bar margin-top 8 · height 72 · Card #FBFAF7 bg · radius 12 · padding 0 12 0 24
                              no border, no shadow while it sits over the Ink spacer
   [Logo 120px wide, Ink wordmark + red stop] · gap 40 · [7 triggers] · flex 1 · [search 40] [Join StartNet]
```

- Triggers (`PRIMARY_NAV`, order unchanged: who, brands, programmes, events, insights, snx, partner): 15px/500 Ink,
  line-height 1, padding 0 12, height 40, radius pill. Trigger with a menu shows a Lucide `ChevronDown` 16px, stroke
  1.75, gap 4. It rotates 180° when open (240ms `--ease-snap`).
- Trigger states: hover = Bone pill bg (`--color-bg-tile`). Open = Bone pill bg + `aria-expanded="true"`. Current
  section = 2px Ink underline 6px below the label, 16px wide, centred (it replaces `.site-nav__glide`; keep
  `_indicator.js` to slide it between triggers). Focus = 2px Ink outline, offset 2.
- Search: 40px circle icon button, 1px `--color-border-control` ring, Lucide `Search` 18px. Hover = Ink fill, Paper
  icon. Opens `SearchOverlay` (shortcuts `/` and Ctrl/⌘+K stay).
- **Join StartNet** = `Button variant="point" size="md"` (Red-600 fill, white, 40px pill, 15px/500). It is the chrome's
  single red point (brand book §05.8 pin 4) and the only red fill in the header. "Sign in" moves to the utility tab as
  a text link (still `signInHref`).
- Over Paper (scrollY > hero bottom, or pages with no hero after 8px): the card gets `box-shadow: var(--shadow-header)`
  through `html[data-header-scrolled]`, set by Header.jsx.

**Scroll behaviour (PnP: fixed and static):**
- ≥1024: the card never hides. After scrollY > 120 the wrapper translates −40px (`--utility-h` + `--header-inset`),
  which hides the utility tab and docks the card 8px from the top (240ms `--ease-snap`). `--shell-offset` becomes
  8 + 72 = 80px. At scrollY ≤ 120 it is 112px.
- <1024: wrapper padding 8px 8px 0, card 56px tall, radius 12, padding 0 8 0 16. It holds the logo (96px) on the left,
  and on the right a 40px search button, then a 40px **menu** button (Ink fill, Paper Lucide `Menu` 20px). The card hides
  on scroll down after 160px (translateY −72px, 280ms `--ease-header-exit`) and shows after 40px of scroll up. It keeps
  broadcasting `sn:header` and `html[data-header-hidden]`, and writes `--shell-offset` = 64 or 0.
- `Header.jsx` constants: `const utility = wide ? 32 : 0; const gap = 8; const bar = wide ? 72 : 56;`
  `shellOffset = scrolled && wide ? gap + bar : utility + gap + bar` (hidden on mobile = 0).
- Remove the 2px red scroll-progress bar on long reads. It added a second red point. Use a 2px **Ink** bar on the
  bottom edge of the card instead, only on article templates.

**Spacer:** `SiteLayout` keeps the Ink spacer under the fixed header, with height `var(--shell-top)` (112 / 64). The
spacer, the hero band and the floating card read as one Ink field (brand book: "header and hero sit on Ink"). Pages
without a hero show an Ink strip of the spacer's height, then Paper content. Home only: `.home-hero` uses
`margin-top: calc(-1 * var(--shell-top))` and adds the same amount to its top padding, so its photo runs under the card
(PnP).

### 3.2 Mega menu (`layout/MegaMenu.*`)

- **Opens on click** (and Enter/Space), not hover. Clicking the same trigger closes it; clicking another switches with a
  120ms crossfade. Escape, an outside click or a route change closes it and returns focus to the trigger. Delete the
  hover-intent timers (`--hover-intent`/`--hover-exit` stay as tokens for other uses).
- Position: `position: fixed; top: calc(var(--shell-offset) + 8px); left/right: var(--header-side)`, the card's own width.
  z `--z-mega`. Radius 12, `overflow: hidden`, `box-shadow: var(--shadow-overlay)`. Max-height
  `calc(100svh - var(--shell-offset) - 24px)`, scroll inside. Enter: opacity 0→1 + translateY(−8px→0), 200ms
  `--ease-enter`. Page scrim `--scrim` below the header, z `--z-scrim`.
- **Two panes** (PnP "Innovation Services"):
  - Left pane: width `--mega-pane-w` (300px), `--color-bg-chrome` (Card), padding 40. Order: eyebrow dot label (the
    section name), the intro line 15px/400 Graphite (max 32ch, existing copy), then the 2–3 lead links of that menu as
    **20px/500 Ink** links, stacked 16px apart, each with a trailing `ArrowRight` 16px that nudges 4px on hover.
  - Right pane: `--color-bg-tile` (Bone), padding 40, `display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: 32px 40px`.
    Column head: 15px/500 Ink, margin-bottom 12. Links: 15px/400 Ink, line-height 1.4, 10px apart, hover = underline
    (offset 4, `--color-link-decoration` → Ink).
  - Featured slot (current live-data card: next flagship, open calls, ledger tiles, mission progress): it stays, as the
    last column of the right pane, width 280. Card bg, radius 12, padding 20. Optional 3/2 photo on top (radius 8),
    then a 13px caption, a 17px/500 title and a text link. No more than one photo per menu.
  - `variant="brands"`: the right pane becomes 4 columns, one per sub-brand. Each head has a 0.55em accent dot + the
    brand name. This is one of the accent's permitted uses: the dot only, no filled tiles.
- Keyboard: triggers are buttons with `aria-expanded` and `aria-controls`. Tab moves through the panel in DOM order.
  Shift+Tab from the first link returns to the trigger. Keep the 28ms link stagger only under `no-preference`.

### 3.3 Mobile drawer (`layout/MobileDrawer.*`)

- A full-screen dialog (`role="dialog" aria-modal="true"`), Ink bg, z `--z-drawer`, enter: slide from the right 320ms.
- Top row, 64px: Paper logo on the left, 40px close button (Slate fill `--night-2`, Paper Lucide `X` 20px) on the right.
- **Drill-down, not accordion** (PnP): level 1 lists the 7 primary items at 24px/500 Paper, 56px rows, a hairline
  `--night-line` between rows and Lucide `ChevronRight` 20px on the right. Tapping one slides level 2 in (translateX 100%
  → 0, `--dur-drawer`). Level 2 has a back row (`ChevronLeft` + parent label, 15px/500 `--night-text-muted`, 48px),
  then the lead links at 20px/500 Paper, then the column heads at 13px/500 `--night-text-muted` with their links
  at 17px/400 Paper, 44px rows.
- Under level 1: the utility links at 17px/400 `--night-text-2` (Media, Careers, Contact, Sign in), then the
  `LanguageSwitch`.
- A sticky bottom bar (padding 16, `--night-1` bg): a full-width `Button variant="point" size="lg"` "Join StartNet"
  (48px) and a WhatsApp secondary on night. Focus is trapped while open, Escape closes, focus returns to the menu button.

### 3.4 Brand sub-nav (`layout/BrandSubNav.*`)

48px Paper bar, sticky at `top: var(--shell-offset)`, docks under the card. It is full container width, not full bleed,
with radius 12 and a 1px hairline border, so it reads as a second floating card 8px under the header card. Lock-up at
the left (BrandLockup sm), links 15px/500 with an active 2px **accent** underline, and the brand CTA on the right
(`Button variant="brand" size="sm"`). The 3px accent rule runs along the bar's bottom edge, inside the radius. Below
768: a horizontal chip scroller (32px pills) + "More" sheet, as now.

### 3.5 Footer (`layout/Footer.*`)

Two blocks, top to bottom:

1. **Newsletter band**: `data-surface="night" data-tone="raised"` (Slate #2C3E41), padding `--space-cta-band`, inside
   `.container`. Grid ≥768: `7fr 5fr`, gap `--gap-split`, items centred. Left: eyebrow, then the title at `--text-h3`
   (20→24) Paper, then one line 15px `--night-text-2`. Right: `NewsletterForm compact night` (48px input, pill submit
   on the same row ≥600, stacked below that). Slate keeps it apart from an Ink `CTABand` directly above it.
2. **Footer body**: Bone `--bone` ground, Ink text, padding-top `--space-section-tight`, bottom 32.
   - Row 1 (≥1024: `5fr 7fr`): left has the large mono wordmark (`clamp(3.5rem, 2rem + 6.4vw, 7.5rem)`, Ink, red stop),
     the tagline 20px/400, and "Contact us →" as a 20px/500 Ink arrow link. Right has `FOOTER_COLUMNS` in a grid of
     1 / 2 (600) / 3 (768) / 6 (1280) columns, gap 32. Column heads are 15px/500 Ink with a 0.55em Ink dot. Links are
     14px/400 Graphite at line-height 1.43, 12px apart; hover = Ink + underline.
   - Row 2: socials as **48px rounded squares** (radius 12, Card bg, 1px hairline, Lucide 20px Ink, gap 8; hover Ink fill
     with a Paper icon), then partner logos (mono Ink, 28px tall).
   - Row 3: ThinkTN line (locked copy), hairline, then the legal row 13px Graphite: © {year rendered at build},
     LEGAL_LINKS, Cookie settings, `MotionSwitch`.
   - Mobile: all groups expanded and stacked (PnP has no accordions). Replace the current accordions with plain
     headings and lists.

### 3.6 CTA headband (`components/CTABand.*`)

The PnP headband. It closes 45 pages, so the API and props stay the same.

- `surface="night"` (closing default on Home, programmes and hubs): Ink band, full bleed, padding `--space-cta-band`.
  Optional pulli dot grid on the right 40% (`.u-pulli`). Inside `.container`: grid ≥1024 `7fr 5fr`, gap `--gap-split`,
  `align-items: end`. Left: eyebrow (optional), title at `--text-h2` Paper, max 16ch, one `<em>` accent word; the
  closing "." renders as `.dot` (the band's red point). Body: 18px `--night-text-2`, max 40ch, margin-top 16.
  Right column: actions right-aligned (`justify-content: flex-end`), gap 12. Primary = `Button size="lg"` (Paper fill on
  night). Secondary = secondary on night. If the action is the page's main conversion (Apply, Register), it may be
  `variant="point"`. In that case the title drops its red `.dot` (`dot={false}`), so the band keeps one red point.
- `surface="paper"`: the same layout as an **inset panel**: Bone bg, radius `--radius-panel`, padding `--pad-card-lg`,
  inside `.container`. Used mid-page and mid-article.
- `brand`: Ink band + a 3px accent rule on the top edge. The CTA uses `variant="brand"`.
- Below 1024: stacked, actions full width at <600 (`full`).
- Delete the hairline arc decoration.

### 3.7 Floating elements

- `BottomCtaBar` (<1024): 64px Card bar with a top hairline, padding 8 16, z 55. Context CTA `Button size="md" full`
  (Ink primary; `point` only when it is the page's main conversion) + a 44px WhatsApp icon button. Hides while
  `[data-primary-cta]` is in view.
- `BackToTop`: 48px circle, Card bg, 1px hairline, Lucide `ArrowUp` 20px Ink, bottom/right 16px (above `--bottom-cta-h`
  and `--consent-h`), z 54. Shown after 2 viewports.
- `ConsentBanner`: 380px Card panel, radius 16, `--shadow-overlay`, bottom-right 16px ≥768; full width sheet with radius
  16 16 0 0 below. Buttons: equal-weight secondary "Reject non-essential" + primary "Accept" (no red).

---

## 4. Component specs

Common rules for every component:
- Radius only from tokens. Borders 1px `--color-border` (decorative) or `--color-border-control` (controls).
  No shadows on cards.
- Hover vocabulary (PnP, the same everywhere):
  - media `transform: scale(var(--media-zoom))` 300ms `--ease-media` inside `overflow: hidden`
  - title underline (`text-decoration-thickness: 1px; text-underline-offset: 0.18em`)
  - trailing arrow `translateX(4px)` 200ms `--ease-snap`
  - no lift, no shadow, no tilt. Remove the `pointerFx` card tilt and spotlight; keep the ≤5px magnetic CTA only on
    `.button--point`.
- Focus: `outline: 2px solid var(--color-focus); outline-offset: var(--focus-offset)` on every interactive element,
  `:focus-visible` only. A whole-card link puts the outline on the card at radius + 2.
- Whole-card links: one `<a>` around the title with `::after { inset: 0 }` (the stretched link). No nested
  interactive elements other than chips that are themselves links (`position: relative; z-index: 1`).
- Icons: Lucide, stroke 1.75 (2 at ≤16px). Sizes 16 / 20 / 24.

### 4.1 Buttons (`components/Button.*`)

Anatomy: `[icon 16–20?] label [trailing icon?]`, inline-flex, gap 8, `white-space: nowrap`, 500 weight, sentence case,
pill radius. Tamil: `min-height` instead of `height`, `white-space: normal`, padding-block 8.

| Size | Height | Padding-inline | Font | Icon |
|---|---|---|---|---|
| `sm` | 32 (40 coarse) | 14 | 14/1 | 16 |
| `md` (default) | 40 (44 coarse) | 20 | 15/1 | 18 |
| `lg` | 48 | 28 | 16/1 | 20 |

| Variant | Rest | Hover | Active | On night |
|---|---|---|---|---|
| `primary` | `--color-cta` Ink fill, `--color-on-cta` Paper text | `--color-cta-hover` Slate | Ink-800 | Paper fill, Ink text, hover White |
| `point` **NEW** | Red-600 fill, white text | Red-700 | Red-800 | the same (white 4.83:1) |
| `secondary` | transparent, 1px inset ring `--color-border-control`, Ink text | Ink fill, Paper text (PnP outlined → fill) | Ink-800 | ring `rgb(244 243 239/.6)`, hover Paper fill Ink text |
| `tertiary` (text link) | no box, height auto, padding 0, Ink text, `ArrowRight` trailing | underline + arrow nudge | — | Paper text |
| `brand` | `--accent-fill` / `--accent-on-fill` | 8% Ink overlay (`box-shadow: inset 0 0 0 999px rgb(12 23 25/.08)`) | 16% | the same |
| `inverse` | Paper fill, Ink text (for photos) | White | Bone | — |
| `whatsapp` | as `secondary` + WhatsApp glyph | as secondary | | |

- **The primary hover no longer turns red** (today it hovers to Red-600). Red is `point` only.
- Use `point` once per page section at most, and never in the same section as a red `.dot`. The header Join button is
  outside this count.
- Disabled: 40% opacity, `cursor: not-allowed`, no hover change.
- Icon button (new `Button` prop `iconOnly`, or `.button--icon`): a circle of `--btn-icon` (48) or `--btn-icon-sm`
  (40), with the same variants. `aria-label` is required.
- The trailing arrow appears on `tertiary` and on any button with `arrow` (new boolean prop, default false). It replaces
  PnP's "→" glyph.

### 4.2 Eyebrow / dot label (`theme.css .eyebrow`, `components/Dot.*`)

15px/500, sentence case, line-height 1.4, colour `--color-text`. A 0.55em circle in `--color-label-dot`, gap 0.6em: Ink
on Paper, Paper on Ink, the accent on its hub, **never red**. Tamil 14px. Margin below = `--space-label-gap`. PnP's
uppercase grey eyebrows map to this label. Mega-menu column eyebrows use it at 13px with `--color-text-muted`.

The red full stop `.dot`: a 0.2em circle at the end of a headline (`accentHeadline(text, { dot: true })`). Red-500 on
display sizes, Red-700 next to headings below 24px, Red-400 on Ink.

### 4.3 Section header (`components/SectionHeader.*`)

```
grid ≥768: grid-template-columns: minmax(0, var(--measure-head)) auto; column-gap 32; align-items: end
[eyebrow]                                   [action: tertiary link "View all" | carousel arrows]
  ↕ --space-label-gap
[h2 .section-header__title  --text-h2 / 1.12 / -0.025em / 500, max 18ch for display rhythm]
  ↕ --space-lede-gap
[lede  --text-lede / 1.4, Graphite, max --measure-lede]
  ↕ --space-head-gap (margin-bottom of the whole header)
```

- `align="center"`: one column, centred text, action below the lede (used only in inset Ink panels).
- Below 768: the action drops under the lede, left-aligned, margin-top 16.
- One `<em>` accent word allowed in the title (English only).

### 4.4 Section (`components/Section.*`)

- `pad="default"` = `--space-section` top and bottom. `tight` = `--space-section-tight`. `sm` = `--space-band`.
  `none` = 0.
- `surface`: `paper` (default), `white`/`sunken` (both Bone), `night` (Ink band), `accent` (kept for compatibility;
  renders as Ink with a 3px top accent rule. The accent is never a ground).
- **NEW `surface="inset"`**: PnP's inset rounded Ink panel. The outer section has `padding-inline: var(--header-side)`
  (12px) and `padding-block: 12px`. The inner panel is Ink, `border-radius: var(--radius-panel)`, padding-block
  `--space-section`, holding a normal `.container`. Below 768 it runs full bleed with no radius. It counts as an Ink band.
- Ground rhythm: Paper → Bone → Paper, at most 2 Ink bands or inset panels between hero and footer, and never two Ink
  sections back to back. Same-ground neighbours keep the 1px hairline (theme.css).

### 4.5 Heroes (`components/PageHero.*`, `BrandHero.*`, Home custom)

**PageHero** (`layout="split"`, 40 pages): Ink band (theme.css), `padding-top: var(--space-hero-top-page)`,
`padding-bottom: calc(var(--space-hero-bottom) + var(--sheet-radius))`, min-height 520px ≥1024.
- ≥1024: `.grid-12`. Text in cols 1–7: breadcrumbs (13px `--night-text-muted`, Lucide `ChevronRight` 14px separators)
  → eyebrow → h1 at `--text-display-xl` (max 14ch) → lede `--text-lede` `--night-text-2`, max 35rem, margin-top 24 →
  actions (gap 12, margin-top 32: primary lg on night + secondary lg) → meta row (13px).
- Media in cols 8–12, bleeding to the viewport's right edge (`margin-right: calc(-1 * var(--page-margin))`), aspect
  `--ar-hero` (4/3), max-height 560px, `border-radius: var(--radius-panel) 0 0 var(--radius-panel)`, warm mono photo,
  no overlay.
- <1024: text first, then the media at full container width, aspect 3/2, radius `--radius-media`, margin-top 32.
- `layout="text"` (no art): one column, max 900, the same paddings.
- The sheet rise (the next sibling gets `margin-top: calc(-1 * var(--sheet-radius))` + top radius) stays. That is the
  brand book's "Paper sheets rise over the band".

**BrandHero** (21 pages): as PageHero, plus the brand lock-up in place of the eyebrow, media aspect 16/10 in cols 7–12,
and `endorsement` as a 13px line under the actions. `JourneyLine` sweep keeps its accent stroke (a permitted accent use).
No accent-coloured ground.

**Photo hero variant** (`PageHero layout="photo"`, NEW optional prop, default unchanged): the PnP industry/location
hero. A full-bleed warm mono photo with a flat `--overlay-photo-strong` scrim, min-height 560 (≥1024) / 480. Text
bottom-left in cols 1–7. Used by StartNet X home and district pages only.

### 4.6 Cards (`components/Card.*` family)

Common to all cards: the title is a stretched link; meta lines are 13–14px `--color-text-muted`; hover = media zoom +
title underline; images through `ArtImage` (warm mono grade, `sizes` set); radius on the media wrapper with
`overflow: hidden`.

| Card | Anatomy (top → bottom) | Size / ratio | Surface / radius | Notes |
|---|---|---|---|---|
| **Card `framed`** (generic) | optional media 3/2 → eyebrow/badges → title `--text-h4` → body 15px Graphite (3 lines) → footer meta / CTA | padding `--pad-card` | `--color-bg-raised` (Card), 1px hairline, radius `--radius-card` (12); media radius 8 inset inside the padding | Remove the 2px Ink top rule on hover. Hover = border `--line-strong` + title underline |
| **Card `media`** | media → (16px) eyebrow → title `--text-h4` → body → meta | media `--ar-card` | no frame, media radius `--radius-media` | PnP insight card without the tint |
| **ProgrammeCard** | media 3/2 (radius 16) → row: Badge status (Open / Closing in N days) + brand dot label → title `--text-h3` (20→24, 2 lines) → one-line 15px description → meta row (Lucide `MapPin` 16 district · `CalendarDays` 16 dates) → tertiary "View programme" | grid 1 / 2 (600) / 3 (1024) | unframed on Paper; `framed` on Bone grounds | PnP program card. Title 24 max (PnP's 40px is too big for our grid) |
| **EventCard** | media 3/2 (radius 16) with a **date chip** inset 12px top-left (Card bg, radius 8, padding 6 10: day 20px/500 over month 12px/500) and a format Badge top-right → title `--text-h4` 2-line clamp → meta (Lucide `Clock` 16 time · `MapPin` 16 venue) → status row: 6px Connect-700 dot + "Registration open" 13px, or "Past" in muted → tertiary "Register" | Scroller item `min(22rem, 82vw)` | unframed | PnP event card. Live dot uses success colour (semantic), never red |
| **StoryCard** (founder story / news) | **Ink card** (`data-surface="night"`), radius `--radius-card`, `overflow: hidden`: media 16/10 at the top (no radius of its own) with a chip row inset 16px top-left (sector chips: Paper bg, Ink 13px; type chip "Founder story": Slate bg, Paper) → body padding `--pad-card`: title `--text-h4` Paper, 2 lines → excerpt 15px `--night-text-2`, 3 lines → meta row 13px `--night-text-muted`: `MapPin` district · sector · date. Optional company logo chip (Paper, radius 8, padding 8, logo max-height 32) inset 16px bottom-right of the media (Antler) | min-height 440; grid 1 / 2 (768) / 3 (1280) | Ink, radius 12 | PnP success story card + Antler logo chip. **`variant="portrait"` NEW**: media 4/5 full card, flat `--overlay-photo` scrim, text at the bottom (for hero rails and Scroller) |
| **ReportCard** | cover 3/4 (radius 8, 1px hairline) → type Badge (Ink chip, Paper text) + sector chip → title `--text-h5` 3-line → date 13px muted → optional left-rule stat (2px Ink left border, padding-left 16: number 28px/400, label 13px) | grid 1 / 2 / 3 / 4 (1280) | framed, Card | PnP insight card + Antler left-rule stat |
| **PersonCard** | portrait 1/1 (radius 16) → name `--text-h5` → role 14px Graphite → optional tag Badge ("District lead") | grid 2 / 2 / 3 (768) / 4 (1280), gap `--gap-grid` | unframed | `compact`: 64px round avatar + name/role row |
| **BrandTile** | **Ink or Slate tile** (alternate by index), radius `--radius-panel`, aspect 4/5 (≥768) or 16/10 row (<768), padding `--pad-card-lg`: a 4px accent rule on the top edge inside the radius → BrandLockup reversed → title `--text-h3` Paper → one-line stat (`--text-stat`, Paper, label 13px) → tertiary "Visit {brand}" Paper. The photo (`showArt`) fills the lower 45% at `opacity: .55`, hover → full-bleed 1.0 + zoom 1.05 (PnP audience card swap) | Scroller item `min(24rem, 82vw)`; grid 1 / 2 / 4 | Ink / Slate | **No accent fill**: the accent appears as the top rule and the lock-up dot only |
| **Persona tile** (Home `PersonaSelector`, Join, Contact) | Ink / Slate / Bone tile by index, radius `--radius-panel`, min-height 220 (≥768) / 120: 2 lines of `--text-h3` (line 1 muted "I am", line 2 the persona) → `ArrowRight` 24 bottom-right. Hover = Ink fill for Bone tiles, Slate↔Ink swap for dark ones | grid 1 / 2 (600) / 3 (1024) | — | PnP "Who we work with" + contact persona picker |
| **District / location tile** (NEW `.place-tile`, in `Card` as `variant="place"`) | full photo 4/5, radius `--radius-panel`, flat `--overlay-photo` scrim → district name centred, `--text-h2` Paper → hover: scrim `--overlay-photo-strong`, zoom 1.05, and a "Discover" tertiary link appears 32px from the bottom | Scroller item `min(25rem, 82vw)` | — | PnP office locations. No 32→56 title jump (it reflows); the size stays fixed |
| **Partner / logo tile** (`LogoWall`) | tile `--color-bg-tile`, radius `--radius-card`, height 160 (176 ≥1024), padding 32 24, logo `object-fit: contain`, max-height 56, **mono Ink** (`filter: grayscale(1) contrast(1.1)` + `mix-blend-mode: multiply`) → optional caption under the tile 13px/500 Graphite, sentence case, centred | carousel item 280; grid 2 / 3 (768) / 5 (1280) | Bone tile | last tile = "View all partners" with a 1px Ink ring and a tertiary label |
| **Informative card** (programme "What you get", partner benefits) | optional Lucide icon 24 → title `--text-h3` → body 16px Graphite | padding `--pad-card-lg`, min-height 200 | Card bg on Bone, or Bone on Paper, radius `--radius-panel` | PnP `cardsInformative` |

### 4.7 Stat block (`components/Stat.*`, `FactBand.*`, `KeyFacts.*`)

- **Stat**: number `--text-stat` / 1.05 / −0.03em / **400**, `font-variant-numeric: tabular-nums`, then a label 14px/400
  Graphite at 1.43, margin-top 8, max 22ch. Optional source footnote 13px muted. Count-up keeps today's behaviour
  (end state in the prerender). The roller is optional (Surge K) and only under `no-preference`.
- **FactBand**: a row of 2 (mobile, 2×2) / 4 (≥768) stats. Each cell has `padding: 0 24px` and a 1px `--color-border`
  left rule (none on the first). The band has a top hairline and padding `--space-band`. `variant="lg"` uses
  `--text-stat-lg` (Mission meter, hub hero stats, gallery pairing).
- **KeyFacts**: a 2-column `<dl>` panel on Card, radius 12, padding `--pad-card`. `dt` 13px muted, `dd` 17px/500, row
  hairlines. Sticky in a right rail at `top: calc(var(--shell-offset) + var(--subnav-h) + 16px)` ≥1024.
- Numbers are always Ink (Paper on night), **never the accent and never red**.

### 4.8 Logo wall and marquee (`LogoWall.*`, `Marquee.*`)

- `LogoWall variant="carousel"` (NEW, the PnP partners section): `SectionHeader` with the arrows as its action, then a
  `Scroller` of logo tiles (4.6), gap 20, 4.5 tiles visible at 1440, last tile "View all".
- `variant="grid"` (default today): hairline cell grid, 2 / 3 (768) / 5 (1280), gap 0, each cell 120 tall, logo
  max-height 40, mono Ink at 80% opacity → 100% on hover.
- `Marquee` (Antler strip: hero proof, follow-on investors): 64px tall, logos mono at 60% opacity (Paper on night),
  max-height 32, gap 56, linear, `--marquee-speed` 32px/s, an 80px mask fade at each edge. It pauses on hover and focus.
  Under reduced motion it becomes a static wrapped row.

### 4.9 Tabs and pill nav (`Tabs.*`, `PillSubNav.*`, `events/parts/UrlTabs.*`)

| Variant | Spec | Use |
|---|---|---|
| `underline` (default) | 48px tall, 15px/500, inactive Graphite, active Ink + a 2px Ink indicator (slides, `_indicator.js`), hairline under the list | in-section tabs |
| `pill` | 40px pills, gap 8, inactive: transparent + 1px hairline ring, Ink text; hover Bone; active: Ink fill, Paper text | filters, agenda days, `.chip` |
| `folder` **NEW** | PnP listing tabs: full-width strip on Bone with padding-top 48 inside `.container`; each tab min-width 220, height 64, padding 0 32, `--text-h5`, radius 12 12 0 0; inactive Bone + Graphite text + 1px hairline; active Paper bg (merges with the Paper content below), Ink text. Below 1024: equal-width tabs, height 56, radius 0 | Events Upcoming/Past, Insights top-level types |
| `segmented` | 40px track Bone, radius pill, padding 4; active thumb Card + `--shadow-1` | view toggles (grid / calendar) |

**PillSubNav** (revived, Surge D): sticky at `top: var(--shell-offset)` (plus `--subnav-h` on brand pages). It is a
56px Paper bar inside `.container`, with a hairline bottom and `pill` items 36px tall. The active item follows scroll
(IntersectionObserver, `aria-current="true"`) and anchors use `scroll-margin-top`. Horizontal scroll with an edge fade
below 1024.

### 4.10 Carousel (`components/Scroller.*`)

- The header row is the `SectionHeader` action slot: a counter "01 / 08" (13px tabular, muted), then two **48px circle
  buttons** (`--btn-icon`): 1px `--color-border-control` ring, Lucide `ArrowLeft`/`ArrowRight` 20px Ink. Hover = Ink
  fill, Paper icon (PnP circle inversion, in Ink not purple). Disabled at the ends: 40% opacity. Labels: "Previous
  {item}" / "Next {item}".
- Track: `display: grid; grid-auto-flow: column; grid-auto-columns: var(--item-w); gap: var(--gap-grid)`,
  `scroll-snap-type: x mandatory`, items `scroll-snap-align: start`. It bleeds to the right viewport edge
  (`.bleed-right`, padding-right `--page-margin`). No autoplay. Keyboard: arrow keys move one item when the track has
  focus. Lenis `data-lenis-prevent-*` hooks stay.
- Below 768: no buttons; the counter stays; swipe.

### 4.11 Quote / testimonial (`components/Quote.*`)

- `size="lg"` (PnP quote module): a 2-column panel ≥1024 (`7fr 5fr`), Bone or `night raised` (Slate), radius
  `--radius-panel`, overflow hidden, min-height 480. Left, padding `--pad-card-lg`: Lucide `Quote` 32 (muted) →
  quote text `--text-quote` / 1.25 / −0.02em / 400 (no serif accent inside quotes) → author row margin-top 32: 48px
  round photo, name 15px/500, role · place 14px muted. Right: a warm mono portrait, full height `object-fit: cover`, no
  radius of its own.
- `size="md"`: text-only card, Card bg, radius 12, padding `--pad-card`. Quote 18px/1.5. A partner proof card puts the
  logo first (Surge Q): mono logo 32 tall, margin-bottom 24.
- Testimonial wall (Home/Women, Antler R): 2 rows of md cards (max-width 420) in `Marquee`, the second row offset
  −210px; static 3-column grid under reduced motion.

### 4.12 Form fields (`Field.*`, `SmartForm.*`, `ConsentCheckbox.*`, `NewsletterForm.*`)

- Form card: `--color-bg-form` (White), radius `--radius-card`, padding `--pad-card-lg`, 1px hairline. On night: night-1.
- Label 15px/500 Ink, margin-bottom 6. Hint 14px muted under the label. Required mark: "(required)" text in muted, not
  a red asterisk.
- Input / select / textarea: height `--input-h` (48), padding 0 16, 16px/400 Ink (16px prevents iOS zoom), White bg, 1px
  `--color-border-control`, radius `--radius-input` (8). Placeholder `--ink-500`. Hover: border Ink-600. Focus: border
  Ink + `box-shadow: 0 0 0 1px var(--ink-900)` + outline 2px offset 2. Textarea min-height 144, padding 12 16. Select:
  Lucide `ChevronDown` 18 at right 16, `appearance: none`.
- Error: border `--color-error` (Red-700), message 14px Red-700 with Lucide `AlertCircle` 16, `aria-describedby`.
  Error text is small red text, so it uses Red-700 on light and Red-400 on night, and never the SNX Red full stop.
- Checkbox / radio: 20px, radius 4 / 50%, 1px control border, checked = Ink fill + Paper check. Consent text 14px/1.5
  Graphite with underlined links.
- Field gap 20; two-column rows ≥768 for short fields (name / phone), gap 16.
- Submit: `Button size="lg"`, `primary` (Ink). Use `point` only when the form is the page's main conversion and no other
  red is in the section. Full width below 600.
- Step forms (Contact): numbered 32px circle steps (Bone; active Ink with Paper number), labels 14px/500, sentence case.

### 4.13 Badges and tags (`Badge.*`, `TagChip.*`)

| Kind | Size | Style |
|---|---|---|
| `Badge kind="type"` | height `--chip-h-sm` (24), padding 0 10, 13px/500, pill | Bone bg Ink text on Paper; Paper bg Ink text on photos; Slate bg Paper text on Ink |
| `Badge kind="status"` | same | Open: Connect-50 bg + Connect-700 text + 6px dot. Closing soon: Amber-50 + Amber-800. Closed/Past: Bone + Graphite. Never red |
| `Badge brand` | same | Card bg, 1px hairline, 0.5em accent dot + brand name (brand pages and cross-brand listings only) |
| `TagChip` | height `--chip-h` (32), padding 0 12, 14px/500, pill, 1px hairline ring, Ink text; hover Bone; selected Ink fill Paper text with a Lucide `Check` 14 | filters, sector chips, "View less" collapse |
| `TagChip size="lg"` NEW (tag cloud) | height 40, padding 0 20, 16px/500 | PnP verticals cloud: inside an inset Ink panel, Paper ring 40%, Paper text, hover Paper fill Ink text; wrap centred, gap 12 |

Sentence case everywhere (no uppercase chips, so Tamil chips need no special case).

### 4.14 Accordion (`Accordion.*`)

Rows separated by a 1px hairline. The summary is a 64px min-height button: question `--text-h5` 500, a 40px circle
toggle on the right (1px ring, `Plus` 20 morphing to `Minus`, 240ms). The answer is 16px/1.6 Graphite, max 68ch,
padding 0 56 24 0. The FAQ section layout is 2-column ≥1024: `SectionHeader` in cols 1–4 (sticky), list in cols 6–12
(PnP focus-areas layout, without the folder overlap).

### 4.15 Steps and timeline (`Steps.*`, `PulliTimeline.*`, `Ladder.*`)

- `Steps variant="row"`: 3–5 columns ≥1024, each with the number 13px/500 in a 32px Ink circle (Paper text) → hairline
  connector → title `--text-h5` → body 15px Graphite. Mobile: vertical, with the connector as a 1px left rule.
- Calendar list (Surge): rows of `grid-template-columns: 160px 1fr auto`, padding 20 0, hairline bottom: date 15px/500
  (exact date where known) | milestone 17px | status Badge.

### 4.16 Texture utility (`.u-pulli`, theme.css)

```css
.u-pulli { background-image: radial-gradient(circle, var(--pulli-dot) 1px, transparent 1.5px);
  background-size: var(--pulli-size) var(--pulli-size); background-position: 0 0; }
```

Static only. Used on the left 45% of the home hero (it replaces PnP's wave line art), the right 40% of an Ink CTA band,
and inset Ink panels. Never on photos or cards, and never animated.

---

## 5. Page templates

Rule from DESIGN-v2: copy, links, menu items and information order stay as they are in a visual redesign. Each
template below lists the **target section order**. Where a page already has these sections in a different order, the
page owner keeps the current order and notes the difference in the PR. A reorder needs the user's approval. Section
IDs in `#…` are today's anchors.

### 5.1 Home (`pages/Home.*`, `pages/home/**`; G6)

| # | Section (id) | Surface | Component / layout |
|---|---|---|---|
| 1 | Hero `.home-hero--v3` | Ink, runs under the header card; min-height `min(45rem, 100svh)` ≥1024 (720), auto below | `.grid-12`: text in cols 1–6 (max `--measure-hero`): `HeroPill` → `KineticHeadline` h1 `.display-2xl` "Every talent, a *founder*." (`accentWord="founder"`, red stop) → lede 18→20 `--night-text-2` → actions: "Find your programme" `primary lg` (Paper on Ink) + "See upcoming events" `secondary lg` → partner line (tertiary). `.u-pulli` on the text column. **Media**: `HeroShowcase` in cols 7–12, bleeding to the right and bottom edges, `border-radius: var(--radius-panel) 0 0 0`, warm mono photos, the crossfade stays (1.6s). `HeroProof` becomes a `Marquee` strip pinned to the hero's bottom (64px, Paper logos 60%). Mobile: photo first (aspect 4/5, full bleed), then text, height auto |
| 2 | `#i-am` persona band | Paper (sheet rise) | `SectionHeader` "I am a…" → persona tiles (4.6) grid 1 / 2 / 3 |
| 3 | `#where-things-stand` | Ink band #1 | `FactBand variant="lg"` with the `ScrubText` title |
| 4 | `#brands` "Four doors into founding" | Paper | `SectionHeader` + carousel arrows → `Scroller` of 4 `BrandTile` (Ink/Slate, 4/5) |
| 5 | `FounderStory` (How it works) | Bone | sticky profile card (Card, radius 12) + step rail with `Steps`-style numbers |
| 6 | `#mission` | Paper | Mission 1 Lakh: `--text-h2` + `MissionMeter` (`--text-stat-lg`) |
| 7 | `#why-tamil-nadu` | **inset Ink panel** (counts as band #2) | centred `SectionHeader` + tag cloud (`TagChip size="lg"`) of the existing reasons/sectors, and a tertiary Paper link. If the section's content is prose rather than a list, keep Paper and use a 2-col statement instead |
| 8 | `#on-film` | Paper (today night). Move to Paper with the video in a 16/9 radius-20 frame, because Ink bands are capped at 2 | `VideoFeature` |
| 9 | `#coming-up` | Bone | `SectionHeader` + arrows → `Scroller` of `EventCard` (max 8) |
| 10 | `#open-now` | Paper | 3 `ProgrammeCard` grid |
| 11 | `#updates` | Bone | `UpdatesTabs` → `Tabs variant="underline"` |
| 12 | `#stories` | Paper | 3-up `StoryCard` grid (Ink cards), "Read all stories" tertiary in the header (hidden when empty) |
| 13 | `#partner` | Paper, `pad="tight"` | `LogoWall variant="carousel"` |
| 14 | `#questions` | Bone | FAQ 2-column (4.14) |
| 15 | `ClosingCta` | Ink band (closing, allowed in addition: it sits directly above the Slate newsletter) | `CTABand surface="night"` "Start where you are." + Join (`point` lg, title `dot={false}`) + WhatsApp secondary |

Home is in the entry bundle: no new dependencies, +3 KB brotli max (G6 measures it).

### 5.2 Brand hub: Research / Vibe / Connect / Women (G7)

Files: `pages/brands/research/ResearchHome.*`, `vibe/VibeHome.*`, `connect/ConnectHome.*`, `women/WomenHome.*` +
`Women.css`, `pages/brands/brandPage.css`; parts under each folder.

Template order:
1. `BrandHero` (Ink, lock-up, h1 with one serif word, e.g. "Research —*on the record*.", primary + brand CTA,
   media 16/10 bleeding right).
2. `BrandSubNav` (sticky, accent rule).
3. Two-column statement (PnP `titleTextTwoColumns`): Bone, h2 in cols 1–5, lead 20px/1.5 + body in cols 7–12.
4. `FactBand` of 3–4 hub stats (Ink numbers, accent dot labels).
5. Hub programmes/offers: `ProgrammeCard` grid or informative cards.
6. Hub-specific interactive part (kept as is, restyled with kit tokens): Research `FourParty`/`ResearchJourney`/
   `TermSheet`; Vibe `SeasonTimeline`/`TrackExplorer`/`VibathonCountdown`; Connect `NetworkGraph`/`SeriesGrid`/`SeatRing`;
   Women `CircleFinder`/`SchemeExplorer`/`RisingPath`.
7. Events from the hub: `Scroller` of `EventCard` (Bone).
8. Stories: `StoryCard` 3-up (Vibe/Connect may use the Surge M stats + gallery pairing; Women uses the testimonial wall).
9. Proof/partners: `LogoWall variant="carousel"` (`*Proof.jsx`).
10. FAQ 2-column.
11. `CTABand brand`.

The accent is allowed for dot labels, the sub-nav rule, the JourneyLine, brand badges, the BrandTile top rule and the
`brand` button. Nothing else. `/brands` (`OurBrands.*`) uses `PageHero` + a 2×2 `BrandTile` grid (Ink/Slate).

Brand sub pages (`ResearchSub`, `VibeSub`, `ConnectSub`, `WomenSub`, `Vibathon`, `mega/brand-sub/*`): `BrandHero
compact` (min-height 400) → content in the programme template (5.3) or the listing template (5.4) as fits →
`CTABand brand`.

### 5.3 Programme page (`pages/programmes/ProgrammeDetail.*`; G8)

1. `PageHero` (or `BrandHero` for brand programmes): eyebrow = status Badge + programme family, h1, lede, actions
   ("Apply" = `point` lg, the page's one red CTA, plus "Download brochure" secondary), media 4/3.
2. `PillSubNav` sticky: Overview · Who it's for · What you get · How it works · Dates · FAQs (only sections that exist).
3. `#overview`: Paper, `.grid-12`: prose in cols 1–7 (`--measure`), `KeyFacts` sticky in cols 9–12 (duration, format,
   city, cost, seats).
4. `#who`: Bone, persona-style informative cards (eligibility), 3-up.
5. `#what-you-get`: Paper, `FactBand` of terms (from one data file, Antler E) + informative cards 3-up.
6. `#how`: `Steps variant="row"` (Apply → Shortlist → Conversations → Offer → Programme).
7. `#dates`: calendar list (4.15) or `PulliTimeline`.
8. Optional proof: `Quote size="lg"` or a follow-on investors `Marquee`.
9. `#faqs`: FAQ 2-column.
10. `CTABand surface="night"`: "Apply" as `variant="primary"` (Paper), because the hero already has the `point` CTA,
    and the title keeps its red stop.

Programmes index (`Programmes.*`, custom hero): `PageHero`-style Ink hero with a portrait `StoryCard` rail under the
text (Antler C, `Scroller` bleeding right) → current-cohort block (Surge F) → `FacetBar` (sticky filter bar: search 280
+ 2–3 selects + Clear, height 48, Bone band, padding 24) → `ProgrammeCard` grid 1 / 2 / 3, row gap `--space-grid-row` →
link to Open Calls → `CTABand`. Open Calls (`pages/new/OpenCalls.*`): `PageHero layout="text"` → calendar list
grouped by brand → `CTABand`.

### 5.4 Events listing (`pages/events/Events.*`, `PastEvents.*`, `events/parts/*`; G8)

1. `PageHero` compact (min-height 400, text only or with a 4/3 photo).
2. `UrlTabs` → `Tabs variant="folder"`: Upcoming / Past (routes `/events`, `/events/past`).
3. `FacetBar`: Paper strip under the tabs, padding 32 0, `flex-wrap gap-8`: search (Lucide `Search` 18 inset 16, width
   280 ≥768), selects (brand, district, format; width 220), segmented view toggle (List / Calendar), "Clear" tertiary.
   Selected filters show as `TagChip` with `X`.
4. Results: `EventCard` grid 1 / 2 (768) / 3 (1280), gap `--gap-grid`, row gap `--space-grid-row`. Calendar view =
   `EventCalendar` restyled (Card cells, radius 12). Empty state: Bone panel, radius 12, padding 32, title `--text-h5` +
   one line + Clear.
5. "Load more" `secondary lg`, centred, margin-top 64 (no numbered pagination).
6. FAQ 2-column.
7. `CTABand surface="paper"` (inset Bone): host an event (`/events/host`).

### 5.5 Event detail (`events/EventDetail.*`, `mega/events-series/SeriesPage.*`, `EditionPage.*`; G8)

1. Split hero (`.event-hero`, custom, keep the class names): Ink. Text in cols 1–7: back link "All events" (tertiary,
   `ArrowLeft`) → date chip (Paper, radius 8) + format Badge → h1 `--text-display-xl` → lede → meta row (`MapPin`,
   `Clock`). The poster in cols 8–12 bleeds right, 4/3, radius 32 0 0 32.
2. Body `.grid-12`, which pulls up over the sheet rise: main in cols 1–8, **ticket card** in cols 9–12 with
   `margin-top: -96px` ≥1024 (PnP overlap, reduced from −252). Ticket card: White form surface, radius 12, 1px hairline,
   padding `--pad-card-lg`, sticky at `top: calc(var(--shell-offset) + 16px)`: day `--text-stat` + month 15px muted →
   "Register" `point` lg full width (the page's one red CTA) → address, time, price rows (14px, hairlines) → "Add to
   calendar" tertiary (ics). Below 1024 it moves under the hero as a normal card; `BottomCtaBar` carries Register.
3. Main column: about (prose), agenda (`Tabs variant="pill"` per day; rows `grid 120px 1fr`: time pill Bone 14px |
   title 17px/500 + speaker 14px muted), speakers (`PersonCard` grid 2 / 3), gallery (`EventGallery`, radius 16
   tiles), videos (`EventVideos`).
4. Related events `Scroller` (Bone), then `CTABand` (Paper inset: "Speak or mentor" or partner). No red in the CTA band,
   because Register is the page's red point.

Series and edition pages use the same hero and the same grid. Series = listing of editions (`EventCard` grid) +
`FactBand`. Edition = the detail template with tabs for `/agenda` and `/speakers` (`Tabs variant="underline"`, routes).

### 5.6 Insights listing and detail (G9a)

**Insights hub** (`pages/insights/Insights.*`): `PageHero` → featured report half-image (Bone, 2-col: text with Badge +
`--text-h2` + lede + "Read the report" primary | cover 3/4 radius 16) → `Tabs variant="folder"`: All · Founder Ledger ·
Reports · Stories · Indices · Podcast (links) → filter band (Bone, padding 24: search 280 + sector + type selects +
Clear) → grid 1 / 2 / 3, gap-x 24, gap-y `--space-grid-row` of `ReportCard`/`StoryCard`/`Card media` by type. After every
6th item, an inline promo row (Bone, radius 12, padding 32: `--text-h3` copy in cols 1–8 + newsletter `primary` in
cols 9–12) → `CTABand`.

**Stories** (`Stories.*`, `StartupShowcase.*`): `PageHero` with a portrait StoryCard rail → `Tabs`: Current cohort /
All startups (Surge F) → sector chips with "View less" + district + programme selects → `StoryCard` grid.

**Report / story / article detail** (`mega/insights-reports/ReportDetail.*`, `StoryDetail.*`, `IndexDetail.*`,
`mega/media-careers/PressRelease.*`): PnP article. No dark hero; the Ink spacer strip is the only band.
1. Header on Paper, padding-top 64, inside `--measure-article` (900): breadcrumbs → type · date 13px/500 muted → h1
   `--text-h1` (36→60), max 22ch → dek `--text-lede` Graphite → author row: 40px avatar, name 15px/500 underlined, role
   14px muted, and on the right "Download PDF" `secondary` + share icon buttons (40px).
2. Lead image: full `.container` width, aspect 16/9, radius 20, margin-block 48.
3. Body `.grid-12`: `ChapterNav` sticky in cols 1–3 (≥1024; 14px links, active Ink + 2px left rule), prose in cols 4–10
   (`.prose`: 17px/1.7, h2 `--text-h3`, h3 `--text-h5`, blockquote `--text-quote` with a 2px Ink left rule, figures
   radius 16, tables hairline). The "What's inside" box at the top of the prose is Bone, radius 12, padding 24.
4. A mid-article `CTABand surface="paper"` after the 2nd section (inset Bone).
5. FAQ (when present) → related 3-up → newsletter band (footer).
6. Ink 2px reading-progress bar on the header card (3.1).

**Founder Ledger, methodology, period, indices** (`FounderLedger.*`, `mega/insights-ledger/*`): `PageHero` → `FactBand
lg` → charts in Card panels (radius 12, padding `--pad-card`, hairline) → listing / prose per the templates above.
Chart colours stay `--dv-*`.

### 5.7 Partner pages (`pages/partner/**`; G9b)

PnP audience landing (Template B):
1. `PageHero` with 2 actions ("Partner with us" `point` lg + "See our partners" secondary).
2. Two-audience split (Antler G): 2 Bone tiles, radius 32, padding `--pad-card-lg`: `--text-h3` + 2 lines + tertiary
   (Corporates / Government and institutions).
3. Two-column statement (Bone).
4. Service cards (PnP `findYourFit`): 2-column grid of informative cards, each with a type Badge, a `--text-h3` title,
   2 lines and an `ArrowRight` bottom-right.
5. `FactBand`.
6. `LogoWall variant="carousel"` (`OurPartners`).
7. `PartnerProof` → `Quote size="md"` logo-first, 2-column.
8. FAQ → `CTABand surface="night"` (primary Paper; the red is in the hero).

`/partner/:type` (`PartnerType.jsx`) = the same skeleton. `/partner/enquire` (`Enquire`, `EnquiryForm`) = the contact
template (5.8). `/partner/our-partners` = `PageHero layout="text"` + `LogoWall variant="grid"` + filter chips.

### 5.8 About and utility (G9b)

- **About long-reads** (`pages/about/*`, `shared.*`): `PageHero` → alternating Paper/Bone sections of 2-col statements
  (h2 cols 1–5, prose cols 7–12), `FactBand`, `PersonCard` grids (Leadership: 2 / 3 / 4, group heading `--text-h3`),
  timelines (`Timeline` with hairline rail, 13px years) → `CTABand`. GSAP parts (`LadderScroll`, `ModelDiagram`) keep
  their behaviour and take kit tokens only.
- **Districts** (`pages/new/Districts.*`, `mega/about-districts/DistrictPage.*`): index = `PageHero` + zone tabs
  (`Tabs pill`: Chennai and North / West (Kongu) / Central (Delta) / South) + a grid of `Card variant="place"` 1 / 2 / 3.
  District page (Antler S): `PageHero layout="photo"` → `FactBand` → founders from the district (`StoryCard`) → upcoming
  events (`EventCard` Scroller) → local leads (`PersonCard` with a "District lead" Badge) → local partners (`LogoWall`)
  → FAQ → `CTABand`.
- **Contact** (`utility/Contact.*`): Bone hero (no Ink band below the spacer; the sheet rise does not apply), min-height
  400, centred eyebrow + h1 `--text-h1` + 16px paragraph (max 36rem) → step indicator → persona tiles 1 / 2 / 4 (4.6) →
  `SmartForm` in a White card, max 768 → footer only (no CTABand, no newsletter band: `Footer` prop `newsletter={false}`).
- **Media / Careers / Job / Search / Legal / Sitemap / NotFound / Join / Sign-in / Campaign**: `PageHero layout="text"`
  (or none for Legal / Search / NotFound), content in `.container--narrow` (900) prose or `Card` lists with hairline
  rows, `CTABand surface="paper"` where one exists today. `restKit.css` stays the shared file; changes are additive.
  `/signin`, `/signup`, `/go/*` keep `MinimalHeader`: a 64px floating card with the logo only and the same inset.

### 5.9 StartNet X (`pages/snx/**`, `mega/snx-audiences/**`, `mega/snx-extras/**`; G7)

1. `BrandHero` with `layout="photo"`: a full-bleed warm mono photo (Surge A), `--overlay-photo-strong`, text bottom-left
   max 600, "Get StartNet X" `brand` (Red-600 = the `x` accent fill; it is the page's red point) + "See pricing"
   secondary on night.
2. `BrandSubNav` (x).
3. Modules: informative cards 3-up (Lucide icon, `--text-h3`, body).
4. `FactBand` of terms / proof.
5. Audience split: 6 audience links as persona tiles (founders, institutions, incubators, GCCs, government, investors),
   grid 2 / 3.
6. `Pricing`: 3 plan cards, Card bg, radius 12, padding `--pad-card-lg`. The recommended plan has a 2px Ink border, not
   red. Price `--text-stat`, feature list with Lucide `Check` 16, CTA `primary` full width.
7. Trust / developers / agents: 2-col statements + Card lists.
8. FAQ → `CTABand surface="night"` (primary Paper; the hero holds the red).

Audience pages (`SnxAudiencePage`) follow the partner template (5.7). Pricing, Modules and Trust follow 5.9 sections 3–8.

---

## 6. Implementation plan

### 6.1 Rules for every group

1. Exclusive write access only to the files listed for your group. Need a change elsewhere? Ask the owning group in
   writing, or put a `:root`-prefixed override in your own CSS and flag it for G10.
2. Do not rename or remove props, class names, `data-*` hooks (`data-surface`, `data-brand`, `data-primary-cta`,
   `data-lenis-prevent*`, `data-current`) or runtime variables (`--shell-offset`, `--sbw`, `--bottom-cta-h`,
   `--consent-h`). New props are optional and default to today's behaviour, unless this spec changes the default look.
3. Values only through tokens. Add no hex, no px font sizes outside tokens, no new `!important`. When you touch a page
   CSS file, delete its overrides of kit classes (`.button*`, `.card*`, `.page-hero*`, `.brand-hero*`, `.stat*`,
   `.art-image*`).
4. Keep: one `<h1>` per page, all strings, links and nav items, `Seo` usage, reduced-motion end states, Tamil twins,
   `localePath()` on internal links.
5. Prerender safety: no content only after interaction, initial hidden states only as inline `opacity:0` set on the
   client or CSS scoped to `prefers-reduced-motion: no-preference`. New hero animation classes go into `base.css`'s
   `html[data-from-snapshot]` list (send them to G1 before Phase 1 closes).
6. CSP: no external fonts, images or scripts. Lucide icons from `lucide-react` (already installed).

### 6.2 Acceptance checks (every group runs all of these before handing over)

| # | Check | How |
|---|---|---|
| A1 | `npm run build` passes (client + server + prerender) with 0 errors and no new warnings | in `client/`: `npm run build` |
| A2 | No horizontal scroll at 375, 768, 1024, 1440 | `document.documentElement.scrollWidth <= innerWidth` on every route you own, EN + `/ta` |
| A3 | Tamil: the `/ta` twin of each owned route renders with 0 tracking, no uppercase, no serif accent, no word split mid-glyph at 320 and 375 | visual + `overflow-wrap` check |
| A4 | Prerender-safe: `client/dist/prerender/<route>.html` has exactly one `<h1>` and the full text; no visible flash at the hand-over | open the prerendered HTML; reload with the network throttled |
| A5 | No console errors or warnings (React key, a11y, 404 assets) on owned routes | browser console, EN + TA |
| A6 | Focus: every interactive element shows the 2px focus outline with `:focus-visible`; tab order follows the visual order; menus, drawer and dialogs trap and return focus; Escape closes | keyboard-only pass |
| A7 | Reduced motion (`html[data-motion="reduced"]`) shows end states, no zoom, no marquee movement | footer MotionSwitch |
| A8 | One red point per section: count SNX Red/Red-600 elements per section (header Join excluded) | visual |
| A9 | Contrast: text ≥4.5:1, large text and control borders ≥3:1 (the tokens are pre-measured; check any new pairing) | axe / DevTools |
| A10 | Photos: only `ArtImage` / manifest photos, warm mono grade, Indian people, no new stock | `tools/audit/agents/r7-images/slots.mjs` |
| A11 | Grids at 768: no orphan card stretched full width unless intended | `tools/audit/agents/r6-tablet/grid3.mjs` |
| A12 | Entry chunk ≤ +3 KB brotli versus `c47f703` (G1, G2, G4, G6 only) | build stats |

### 6.3 Work groups (disjoint file ownership)

Phase 0: **G1** alone (target half a day). Phase 1: **G2, G3, G4, G5** in parallel. Phase 2: **G6, G7, G8, G9a, G9b**
in parallel (layout work can start once G1 lands; final QA waits for Phase 1). Phase 3: **G10** integration.

```
G1 ──┬── G2 header ─────────────┐
     ├── G3 footer / CTA band ──┤
     ├── G4 kit primitives ─────┼── G6 Home  ── G7 Brands+SNX ── G8 Events+Programmes ── G9a Insights ── G9b About/Partner/Utility ── G10
     └── G5 kit cards / media ──┘
```

#### G1 Foundation
- **Owns:** `client/src/styles/tokens.css`, `client/src/styles/base.css`, `client/src/styles/theme.css`,
  `client/src/styles/fonts.css`, `client/src/styles/fonts/*`, `client/src/styles/interactions.css`,
  `client/src/styles/pointerFx.css`, `client/src/lib/pointerFx.js`, `client/index.html` (meta only),
  `client/vite.config.js` (font preload only).
- **Does:**
  - Pastes §2.2. Updates `base.css`: h1 weight → `var(--weight-display)`; `.container` = `max-width: calc(var(--container-max) + 2 * var(--gutter))`; `.container--narrow` = 900 + 2×gutter; type classes read the new `--leading-*`/`--tracking-*`; `.grid-12` gap → `var(--grid-gap)`; `.grid*` gap → `--gap-grid`.
  - Deletes the base.css L119–152 rules that reach into `.card*` (G5 re-implements the tablet behaviour in Card.css).
  - `theme.css`: keeps the hero Ink band + sheet rise; hero padding-bottom → `calc(var(--space-hero-bottom) + var(--sheet-radius))`; adds `.u-pulli`; `.art-image--photo` radius → `--radius-media`; serif `em` gets `display:inline-block; margin-bottom:-0.1em`; adds the `Section surface="inset"` ground class `.section--inset`.
  - `pointerFx`: removes the card tilt and spotlight, keeps the magnetic CTA scoped to `.button--point`.
  - `interactions.css`: the mega-menu item stagger only under `no-preference`; leaves `.back-to-top` for G3 to override.
  - Publishes, in its PR, the list of files that use `--gutter` as a column gap.
- **Depends on:** nothing.
- **Accepts:** A1, A2 (on 5 sample routes: `/`, `/programmes`, `/events`, `/insights/reports/<any>`, `/ta`), A3, A4, A12. Every old token name still resolves (`grep -o "var(--[a-z0-9-]*" | sort -u` against the new file: 0 missing).

#### G2 Header chrome
- **Owns:** `client/src/layout/Header.jsx`, `Header.css`, `UtilityBar.jsx`, `UtilityBar.css`, `MegaMenu.jsx`,
  `MegaMenu.css`, `MobileDrawer.jsx`, `MobileDrawer.css`, `LanguageSwitch.jsx`, `LanguageSwitch.css`,
  `MinimalHeader.jsx`, `MinimalHeader.css`, `SearchOverlay.jsx`, `SearchOverlay.css`, `BrandSubNav.jsx`,
  `BrandSubNav.css`, `BrandLayout.jsx`, `SiteLayout.jsx`, `SiteLayout.css`, `shell.jsx`, `ScrollManager.jsx`,
  `AutoContentLang.jsx`, `motionFeatures.js` (all in `client/src/layout/`), `client/src/components/Logo.jsx`,
  `Logo.css`, `BrandLockup.jsx`, `BrandLockup.css`, `_indicator.js`.
- **Does:** §3.1–3.4. Floating card, utility tab, click-open two-pane mega menu, drill-down drawer, sticky behaviour,
  `--shell-offset` maths, spacer at `--shell-top`, Home hero under-card support (`html[data-hero-under]` set when
  `.home-hero` mounts, read by G6). Reads `data/nav.js`, `data/brands.js`, `layout/megaCtas.js` without changing them.
- **Depends on:** G1. Uses `Button variant="point"` from G4: until G4 lands, style Join locally with `--color-action`.
- **Accepts:** A1–A9. Plus: the mega menu works with keyboard only; the drawer traps focus; `--shell-offset` equals
  the visible header height at scrollY 0 / 200 / after scroll-up, at 1440 and 375; `BrandSubNav` docks with no gap or
  overlap; Tamil desktop nav only ≥1280 with no wrapping at 1280.

#### G3 Footer and closing chrome
- **Owns:** `client/src/layout/Footer.jsx`, `Footer.css`, `MotionSwitch.jsx`, `MotionSwitch.css`, `BottomCtaBar.jsx`,
  `BottomCtaBar.css`, `ConsentBanner.jsx`, `ConsentBanner.css`, `BackToTop.jsx`, new `client/src/layout/BackToTop.css`,
  `client/src/components/CTABand.jsx`, `CTABand.css`, `NewsletterForm.jsx`, `NewsletterForm.css`,
  `WhatsAppButton.jsx`, `WhatsAppButton.css`.
- **Does:** §3.5–3.7. Slate newsletter band + Bone footer body, CTABand headband (night / paper inset / brand, the
  `dot` prop honoured), `Footer newsletter` prop (default true), consent and bottom bar restyle, year rendered at build.
- **Depends on:** G1. Reads G4's `Button`.
- **Accepts:** A1–A9. Plus: CTABand at 375 stacks with full-width actions; the footer has no accordions on mobile;
  the consent banner never covers the BottomCtaBar (`--consent-h` respected).

#### G4 Kit: primitives, heroes, forms, motion
- **Owns:** `client/src/components/` `Button.*`, `Section.*`, `SectionHeader.*`, `PageHero.*`, `BrandHero.*`,
  `KineticHeadline.*`, `Dot.*`, `_accent.jsx`, `Breadcrumbs.*`, `Badge.*`, `TagChip.*`, `Tabs.*`, `Accordion.*`,
  `Steps.*`, `Ladder.*`, `Stat.*`, `FactBand.*`, `KeyFacts.*`, `Reveal.*`, `ScrubText.*`, `ClipReveal.*`,
  `FeatureTabs.*`, `PulliTimeline.*`, `Field.*`, `SmartForm.*`, `ConsentCheckbox.*`, `FormSuccess.*`, `formUtils.js`,
  `Placeholder.*`, `InlineMarks.jsx`, `Skeleton.*`, `EmptyState.*`, `PageLoader.*`, `Actions.*`, `PillSubNav.*`,
  `Seo.jsx`, `_inview.js`, `_utils.js`, `index.js`.
- **Does:** §4.1–4.5, 4.7, 4.9 (except the Scroller), 4.12–4.15. New optional props:
  - `Button variant="point"`, `iconOnly`, `arrow`
  - `Section surface="inset"`
  - `PageHero layout="photo"|"text"`, `BrandHero layout="photo"`
  - `Tabs variant="folder"|"segmented"`
  - `TagChip size="lg"`
  - `FactBand variant="lg"`
  - `PillSubNav` scroll-spy
  - `accentHeadline` / `CTABand` `dot` option.

  Page APIs stay the same (Button is used in 83 pages, Section 74, PageHero 40).
- **Depends on:** G1.
- **Accepts:** A1–A9, A12. Plus (no kit demo route is added): test each variant in place on `/`,
  `/programmes/<slug>`, `/events`, `/contact`, `/ta/contact`. Every Button variant passes contrast on Paper, Bone, Ink
  and Slate.

#### G5 Kit: cards and media
- **Owns:** `client/src/components/` `Card.*`, `EventCard.*`, `ProgrammeCard.*`, `StoryCard.*`, `PersonCard.*`,
  `ReportCard.*`, `BrandTile.*`, `ArtImage.*`, `renderArt.jsx`, `_placeholders.js`, `PhotoGradeFilter.jsx`,
  `Scroller.*`, `LogoWall.*`, `Marquee.*`, `Quote.*`, `VideoFeature.*`, `EventGallery.*`.
- **Does:** §4.6, 4.8, 4.10, 4.11. New optional props:
  - `Card variant="place"`
  - `StoryCard variant="portrait"` + `logo`
  - `LogoWall variant="carousel"`
  - `Quote size="md"` logo-first.

  Re-implements the tablet grid rules that G1 deletes from `base.css`. Reads `data/photos.js`, `data/imagePlan.js` and
  the manifest without changing them.
- **Depends on:** G1. Reads G4's Badge and Button.
- **Accepts:** A1–A11. Plus: every card is one tab stop (the stretched link); images have `sizes` and `alt`; hover
  zoom is clipped by the radius in Safari (`isolation: isolate`).

#### G6 Home and Join
- **Owns:** `client/src/pages/Home.jsx`, `Home.css`, `client/src/pages/home/**` (`HeroShowcase.jsx`, `HomeRest.jsx`,
  `FounderStory.*`, `PersonaSelector.*`, `UpdatesTabs.*`, `MissionMeter.*`, `homeFaq.js`, `homeI18n.js`,
  `homeMetrics.js`, `personas.js`), `client/src/pages/Join.jsx`, `Join.css`.
- **Does:** §5.1 and Join (`PageHero layout="text"` + persona tiles + SmartForm card). Adds `.home-hero` to the
  snapshot list via G1.
- **Depends on:** G1, G2 (hero under the card), G3 (CTABand), G4, G5.
- **Accepts:** A1–A12. Plus: the home hero LCP image keeps `priority`; first paint has no layout shift from the header
  (CLS < 0.05); at most 2 Ink bands between hero and footer.

#### G7 Brands and StartNet X
- **Owns:** `client/src/pages/brands/**` (incl. `brandPage.css`, `seoBits.js` without changing its exports),
  `client/src/pages/mega/brand-sub/**`, `client/src/pages/snx/**`, `client/src/pages/mega/snx-audiences/**`,
  `client/src/pages/mega/snx-extras/**`.
- **Does:** §5.2 and §5.9. Removes accent grounds where page CSS paints them.
- **Depends on:** G1, G2 (BrandSubNav), G4 (BrandHero), G5. Reads G9b's `restKit.css` without changing it.
- **Accepts:** A1–A11 on `/research`, `/vibe`, `/connect`, `/women`, `/brands`, one sub page each, `/vibe/vibathon`,
  `/startnet-x` + its 9 sub-routes, EN + TA. The accent appears only in the permitted places.

#### G8 Events and Programmes
- **Owns:** `client/src/pages/events/**`, `client/src/pages/programmes/**`, `client/src/pages/mega/events-series/**`,
  `client/src/pages/mega/events-extra/**`, `client/src/pages/new/OpenCalls.*`, `client/src/pages/new/SpeakMentor.*`,
  `client/src/pages/new/callsMeta.js`.
- **Does:** §5.3–5.5. Freeze the exports of `events/parts/eventMeta.js`, `programmes/parts/programmeMeta.js`,
  `programmes/parts/seoFit.js` and `new/callsMeta.js`.
- **Depends on:** G1, G4 (Tabs folder, PillSubNav, FactBand), G5 (EventCard, ProgrammeCard, Scroller).
- **Accepts:** A1–A11 on `/programmes`, two programme slugs, `/programmes/open-calls`, `/events`, `/events/past`, one
  series, one edition + `/agenda` + `/speakers`, `/events/host`, EN + TA. Plus: the ticket card is sticky and never
  overlaps the footer; `FacetBar` filters work with keyboard; the URL tabs keep their routes.

#### G9a Insights
- **Owns:** `client/src/pages/insights/**`, `client/src/pages/mega/insights-ledger/**`,
  `client/src/pages/mega/insights-reports/**`, `client/src/pages/new/Corrections.*`.
- **Does:** §5.6.
- **Depends on:** G1, G4, G5.
- **Accepts:** A1–A11 on `/insights`, `/insights/founder-ledger` (+ methodology, one period), `/insights/reports` + one
  report, `/insights/stories` + one story, `/insights/indices` + one index, `/insights/podcast`, `/insights/newsletter`,
  EN + TA. Plus: the article column is 900 max and the prose line length ≤ 75 characters; the chapter nav is sticky
  under `--shell-offset`.

#### G9b About, Partner, Utility
- **Owns:** `client/src/pages/about/**`, `client/src/pages/partner/**`, `client/src/pages/utility/**`
  (incl. `restKit.css`, `NotFound.jsx`), `client/src/pages/new/Districts.*`,
  `client/src/pages/mega/about-districts/**`, `client/src/pages/mega/media-careers/**`,
  `client/src/pages/mega/utility-campaign/**`.
- **Does:** §5.7 and §5.8. `restKit.css` changes are additive only (the SNX pages import it).
- **Depends on:** G1, G3 (`Footer newsletter={false}` for Contact), G4, G5.
- **Accepts:** A1–A11 on every About route, `/districts` + one district, `/partner` + one type + enquire + our-partners,
  `/contact`, `/media` + kit + one release, `/careers` + one job, `/search`, one legal page, `/sitemap`, a 404,
  `/signin`, one `/go/*`, EN + TA. After G9b, G7 re-checks the 4 SNX pages that import `restKit.css`.

#### G10 Integration (one agent, after all groups)
- **Owns:** nothing by default. It makes fixes in any file on behalf of its owner, logged in the PR.
- **Does:**
  - Full `npm run build`, `tools/audit/agents/r6-tablet/grid3.mjs`, `r7-images/slots.mjs`.
  - A sweep at 320 / 375 / 768 / 1024 / 1440 / 1680 + `/ta`.
  - Deletes the deprecated tokens (§2.3) and dead page-CSS overrides, and removes the now-duplicate `.back-to-top`
    block from `interactions.css`.
  - Updates `docs/DESIGN-v2.md` and `docs/HANDOFF.md` to point at this spec.
- **Depends on:** G1–G9b.
- **Accepts:** A1–A12 site-wide; 0 hex values added since `c47f703` (`git diff c47f703 -- client/src | grep -E "#[0-9a-fA-F]{3,6}"` only inside tokens.css); 0 new `!important`.

Not owned by anyone (read-only in this pass): `App.jsx`, `main.jsx`, `lib/i18n.jsx`, `lib/handover.js`,
`lib/smoothScroll*.js`, `lib/motionBoot.js`, `lib/seo.js`, `lib/links.js`, `hooks/*`, `data/*`, `server/**`, `tools/**`.
Nothing is pushed to `main` (push = live on startnet.in) until the user approves the integrated branch.

---

## 7. Explicit don'ts

1. **No purple, blue or yellow from PnP**, and no Surge purple/fire. Accent colours are SNX Red (one point) and the four
   sub-brand colours inside their own hub only.
2. **No red on every primary button and no red hover.** Primary = Ink. Red fill = `variant="point"`, at most once per
   section, never next to a red `.dot`. Dot labels, numbers, arrows, chips, live dots and focus rings are never red.
3. **No sub-brand accent as a ground**: no accent-filled tiles, heroes, bands or cards anywhere, the hubs included. No
   accent on Home except the BrandTile top rule and lock-up dot.
4. **No weights other than 400/500** (PnP's 600/700/800 map to 500). No Inter 300. No third typeface (no mono for tags).
5. **No more than one Instrument Serif Italic word per headline**, none in Tamil, none in card titles (`--text-h4` and
   smaller), none inside quotes or body copy.
6. **No uppercase** labels, links, chips, captions or headings (PnP's "VIEW ALL →" becomes sentence case "View all" +
   a Lucide arrow). No letter-spacing on Tamil.
7. **No gradients** (no PnP card gradients, no Antler radial hero, no gradient stat numbers). Photo overlays are flat Ink
   scrims. The only texture is the static pulli dot grid.
8. **No shadows on cards, no hover lift, no tilt or spotlight**, no coloured button glows. Shadows only on the header
   card (once over Paper), menus, popovers and the consent panel.
9. **No 8px-radius buttons or rectangular chips**: buttons and chips are pills (brand book §05.8). Inputs are 8px.
10. **No hover-open mega menus, no hide-on-scroll header on desktop**, and no full-width Ink header bar: the header is a
    floating card.
11. **No autoplay carousels, no character scramble, no parallax motifs, no animated art**, no scroll-jacking beyond
    what exists (GSAP pinned stories stay). Marquees pause on hover/focus and stop under reduced motion.
12. **No colour logos in logo walls** (mono Ink), no stock or non-Indian photos, no ungraded photos, no hot-linked images
    (CSP), no Google/CDN fonts.
13. **No more than 2 Ink bands or inset panels between hero and footer**, and never two Ink sections touching (the Slate
    newsletter band is the separator before the footer).
14. **No title size jumps on hover** (PnP's 32→56 reflows). No layout shift on hover at all.
15. **No changes to copy, links, nav items, routes or information order** without the user's approval. No new
    dependencies in the entry bundle. No hex outside `tokens.css`. No `--fs-*` token family.
16. **No content that exists only on the client or only after interaction** (prerender), and no second `<h1>`.
17. **No push to `main`** of the live repo until the integrated branch is approved.
