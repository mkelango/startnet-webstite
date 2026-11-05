# StartNet front end: current design system map (pre-redesign baseline)

Status: inventory written 5 Nov 2026 on branch `redesign/pnp-ui` (clean tree at `c47f703`). Read-only survey: no project
file was changed. Purpose: let the Plug and Play / Techstars-sized redesign be split across parallel agents with
disjoint file ownership without breaking tokens, prerender, Tamil or the brand rules.

All paths below are relative to `D:\Startet 2.0 - 2026\client\src\` unless they start with `docs/`, `server/` or `tools/`.
Counts come from `grep` over `client/src` (`.css`, `.jsx`, `.js`); "uses" = occurrences of `var(--token)`, "files" =
files containing it. JSX usage counts match `<Name` followed by a space, `/`, `>` or a line end.

---

## 0. Size of the thing

| Area | Files | Lines |
|---|---:|---:|
| `styles/` (tokens, base, theme, fonts, interactions, pointerFx) | 6 CSS + 6 woff2 | 1,018 |
| `layout/` (chrome) | 33 | 5,893 |
| `components/` (UI kit) | 57 JSX + 52 CSS + 6 JS helpers | 6,138 JSX lines |
| `pages/` | 143 JSX + 116 CSS + ~45 data JS | 55,394 |
| `App.jsx` (routes) | 1 | 388 |
| `data/` (nav, brands, photos, imagePlan, startups, videos, photos.manifest.json) | 7 | nav 602, brands 183, imagePlan 350, photos 344, manifest 4,755 (206 photos) |

CSS load order (`main.jsx`): `fonts.css` → `tokens.css` → `base.css` → `pointerFx.css` → `theme.css` → `interactions.css`,
then each component/page CSS file loads with its JS chunk (route chunks load later, so later = wins at equal
specificity). That is why `theme.css` and several component selectors are prefixed with `:root` (one extra pseudo-class
of specificity) to beat page CSS from lazy chunks. A redesign must keep that convention or page CSS will silently win.

Dependencies (`client/package.json`): react 18.3.1, react-router-dom 6.28, framer-motion 11.11, gsap 3.12.5,
lenis 1.3.26, lucide-react 0.460, vite 5.4. Fonts are self-hosted woff2 in `styles/fonts/` (@fontsource copies).
No Tailwind, no CSS modules, no CSS-in-JS: plain BEM-ish global CSS (`.block__el--mod`).

---

## 1. Token inventory (`styles/tokens.css`, 289 lines, 287 custom properties)

Structure of `tokens.css`:

1. L4-56 `:root` Layer 1 (shared core: neutrals, night, amber, ledger blue, data-viz) + Layer 2 (StartNet brand: Ink,
   SNX Red ramp, four sub-brand ramps, Ink ramp, grounds, tertiary Marigold/Lagoon).
2. L58-153 `:root` Layer 3 semantic aliases (day), accent slot, type, space, radius, shadow, container.
3. L154-156 breakpoint overrides: `--gutter` 20 → 24 (≥768) → 32 (≥1280); `--sheet-radius` 32 → 20 and
   `--text-caption` 13 → 14 below 768.
4. L159-168 `[data-brand="research|vibe|connect|women|x"]` re-point `--accent*` and `--color-label-dot`.
5. L171 Bone grounds (`.section--white`, `.section--sunken`, `[data-ground="bone"]`) swap muted text to Graphite.
6. L174-187 `[data-surface="night"]` re-points every semantic colour to the Ink set.
7. L192-219 Tamil (`:root:lang(ta)` font stacks; `:lang(ta)` display ×0.85, zero tracking, leading 1.25/1.35/1.8).
8. L222-266 motion tokens + reduced-motion zeroing (`prefers-reduced-motion` unless `data-motion="full"`, and
   `:root[data-motion="reduced"]`).
9. L269-276 chrome dimensions (`--header-h` 72 → 56 below 1024, `--utility-h` 36, `--subnav-h` 48).
10. L281-289 Tamil < 400px viewport-scaled display tokens.

Key numbers a redesign will change most (current values):

| Concern | Token | Current value |
|---|---|---|
| Home h1 | `--text-display-2xl` | `clamp(2.5rem, 1.6667rem + 3.7037vw, 5.5rem)` 40 → 88px |
| Page/brand hero h1 | `--text-display-xl` | `clamp(2.25rem, 1.5rem + 3.3333vw, 4.5rem)` 36 → 72px |
| Non-hero h1, CTA statement | `--text-h1` | 32 → 56px |
| Section heads | `--text-h2` | 26 → 40px |
| Card / tab titles | `--text-h3` | 20 → 24px |
| Lede | `--text-lede` | 18 → 20px |
| Body | `--text-body` | 16 → 17px (Tamil 17 → 18) |
| Small / meta / caption / label | `--text-small` / `--text-meta` / `--text-caption` / `--text-label` | 14→15 / 14 / 13 / 15 |
| Stat numerals | `--text-stat` | 48 → 84px |
| Section padding | `--space-section` / `--space-section-tight` | 64 → 128 / 48 → 80px |
| Header → content | `--space-head-gap` | 40 → 64px |
| Container | `--container-max` + `--gutter` | 1280px + 20/24/32px (`.container` max-width = 1280 + 2×gutter) |
| Radii | `--radius-btn` / `--radius-media` / `--sheet-radius` | 4px / 12px / 32px (20 mobile) |
| Weights | `--weight-display` / `--weight-heading` | 400 / 500 (no 600/700 anywhere by rule) |
| Tracking | `--tracking-display` / `-h1` / `-heading` / `-h3` | -0.04 / -0.035 / -0.02 / -0.015em |
| Leading | `--leading-display` / `-heading` / `-body` | 1.02 / 1.12 / 1.5 |

Drift between docs and code (trust the code): DESIGN-v2 "Foundation API" says `--dur-reveal` 600ms and
`--shift-reveal` 12px, the code has 400ms / 8px (AIWO pass). DESIGN-v2 3.1 says a sliding pill behind nav items, the
code draws a 2px Paper underline (`.site-nav__glide`). DESIGN-v2 says a 40% scrim, code uses `rgb(12 23 25 / .25)`.

88 of 287 tokens have zero `var()` uses (mostly unused ramp steps, all `--neutral-*` except `--neutral-0`, all
`--dv-night-*`, `--ledger-100/200/400/500/600/800/900`, `--marigold-100/300/700/800`, `--stagger`, `--hover-intent`,
`--hover-exit`, `--marquee-speed` (JS constants are used instead), `--space-32`, `--space-block`, `--space-grid-row`,
`--text-display`, `--text-eyebrow`, `--tracking-eyebrow`, `--weight-body`, `--font-mono`, `--wa-500`, `--radius-0`,
`--color-on-action`, `--color-action-hover`, `--dur-0`, `--dur-count`, `--ease-exit`, `--ease-glide`, `--shift-4`).
These are safe to repurpose or delete.

Most-used tokens (the redesign's leverage points): `--color-border` 681 uses / 120 files, `--color-text` 680 / 145,
`--space-2` 613 / 136, `--space-6` 604 / 125, `--space-4` 576 / 129, `--space-3` 562 / 136, `--space-8` 425 / 109,
`--color-text-muted` 410 / 127, `--color-text-2` 394 / 128, `--dur-2` 382 / 106, `--text-small` 381 / 110,
`--ease-snap` 333 / 88, `--space-5` 313 / 96, `--space-10` 231 / 97, `--space-1` 232 / 94, `--ease-standard` 220 / 78,
`--paper` 176 / 58, `--media-radius` 176 / 62, `--space-12` 167 / 71, `--card` 143 / 61, `--text-caption` 137 / 64,
`--space-16` 137 / 63, `--text-meta` 133 / 68.

Other custom properties outside tokens.css: 82 locally defined in page/component/layout CSS (e.g. `--fx-glow`,
`--fx-tint`, `--fx-spot`, `--fade-l/r`, `--nav-pad`, `--ind-x/-w`, `--logo-size`), and runtime ones written by JS on
`<html>`: `--sbw` (scrollbar width, SiteLayout), `--shell-offset` (visible header height, Header.jsx; 70 uses in 37
files: every sticky sub-nav/sidebar docks with it), `--bottom-cta-h` (BottomCtaBar), `--consent-h` (ConsentBanner).
Hard-coded hex values outside tokens: 15 in `components/` CSS, 12 in `layout/` CSS, 35 in `pages/` CSS.

### 1.1 Full token table (value as declared in the first `:root` block; uses / files across client/src)

#### Neutrals (legacy) (12)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--neutral-0` | `#FFFFFF` | 1 | 1 |
| `--neutral-100` | `#EFEDE8` | 0 | 0 |
| `--neutral-200` | `#E3E1DC` | 0 | 0 |
| `--neutral-300` | `#CFCEC8` | 0 | 0 |
| `--neutral-400` | `#B9B8B2` | 0 | 0 |
| `--neutral-500` | `#8B8B93` | 0 | 0 |
| `--neutral-50` | `#F4F3EF` | 0 | 0 |
| `--neutral-600` | `#6B6B73` | 0 | 0 |
| `--neutral-700` | `#4E4E55` | 0 | 0 |
| `--neutral-800` | `#3A3A40` | 0 | 0 |
| `--neutral-900` | `#2A2A2F` | 0 | 0 |
| `--neutral-950` | `#0C1719` | 0 | 0 |

#### Night (Ink surfaces) (9)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--night-0` | `#0C1719` | 71 | 45 |
| `--night-1` | `#1B292C` | 48 | 37 |
| `--night-2` | `#2C3E41` | 16 | 13 |
| `--night-line-strong` | `#39504D` | 40 | 32 |
| `--night-line` | `#263937` | 60 | 39 |
| `--night-subtle` | `#82979A` | 0 | 0 |
| `--night-text-2` | `#CFDADC` | 70 | 33 |
| `--night-text-muted` | `#ABBBBE` | 30 | 13 |
| `--night-text` | `#F4F3EF` | 100 | 37 |

#### Amber / Ledger blue (16)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--amber-100` | `#FDEBB8` | 0 | 0 |
| `--amber-300` | `#F6C64A` | 1 | 1 |
| `--amber-500` | `#EDA100` | 1 | 1 |
| `--amber-50` | `#FFF6E0` | 1 | 1 |
| `--amber-700` | `#9A5B00` | 0 | 0 |
| `--amber-800` | `#7A4700` | 1 | 1 |
| `--ledger-100` | `#DFEDFF` | 0 | 0 |
| `--ledger-200` | `#BEDAFF` | 0 | 0 |
| `--ledger-300` | `#92C1FE` | 1 | 1 |
| `--ledger-400` | `#63A5FA` | 0 | 0 |
| `--ledger-500` | `#3C8CEF` | 0 | 0 |
| `--ledger-50` | `#F0F6FF` | 1 | 1 |
| `--ledger-600` | `#2A78D6` | 0 | 0 |
| `--ledger-700` | `#145CAE` | 1 | 1 |
| `--ledger-800` | `#0A4689` | 0 | 0 |
| `--ledger-900` | `#022F61` | 0 | 0 |

#### Data-viz (12)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--dv-1` | `#2A78D6` | 0 | 0 |
| `--dv-2` | `#D0670F` | 1 | 1 |
| `--dv-3` | `#0F4C45` | 0 | 0 |
| `--dv-4` | `#B73C7C` | 1 | 1 |
| `--dv-5` | `#5B2A86` | 0 | 0 |
| `--dv-context` | `#ABBBBE` | 0 | 0 |
| `--dv-night-1` | `#4D97F5` | 0 | 0 |
| `--dv-night-2` | `#F5A04A` | 0 | 0 |
| `--dv-night-3` | `#7FE0C4` | 0 | 0 |
| `--dv-night-4` | `#E2589A` | 0 | 0 |
| `--dv-night-5` | `#B7A6FF` | 0 | 0 |
| `--dv-night-context` | `#39504D` | 0 | 0 |

#### Brand core + Red ramp (14)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--sn-ink` | `#0C1719` | 106 | 35 |
| `--sn-paper` | `#F4F3EF` | 5 | 3 |
| `--sn-red-100` | `#FEE2E2` | 0 | 0 |
| `--sn-red-200` | `#FECACA` | 0 | 0 |
| `--sn-red-300` | `#FCA5A5` | 1 | 1 |
| `--sn-red-400` | `#F87171` | 3 | 2 |
| `--sn-red-500` | `#EF4444` | 0 | 0 |
| `--sn-red-50` | `#FEF2F2` | 3 | 2 |
| `--sn-red-600` | `#DC2626` | 8 | 6 |
| `--sn-red-700` | `#B91C1C` | 9 | 6 |
| `--sn-red-800` | `#991B1B` | 3 | 3 |
| `--sn-red-900` | `#7F1D1D` | 0 | 0 |
| `--sn-red` | `#EF4444` | 12 | 8 |
| `--sn-white` | `#FFFFFF` | 1 | 1 |

#### Sub-brand ramps (44)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--sn-connect-100` | `#DDF1E6` | 0 | 0 |
| `--sn-connect-200` | `#BBE2CE` | 0 | 0 |
| `--sn-connect-300` | `#8FCEAF` | 0 | 0 |
| `--sn-connect-400` | `#5DB88F` | 6 | 4 |
| `--sn-connect-500` | `#2AA375` | 1 | 1 |
| `--sn-connect-50` | `#EFF9F3` | 2 | 1 |
| `--sn-connect-600` | `#0E8F63` | 0 | 0 |
| `--sn-connect-700` | `#006F4B` | 3 | 1 |
| `--sn-connect-800` | `#025639` | 0 | 0 |
| `--sn-connect-900` | `#013A26` | 0 | 0 |
| `--sn-connect` | `#0E8F63` | 5 | 5 |
| `--sn-research-100` | `#E8E9FF` | 0 | 0 |
| `--sn-research-200` | `#D2D3FF` | 0 | 0 |
| `--sn-research-300` | `#B5B5FE` | 0 | 0 |
| `--sn-research-400` | `#9894FF` | 5 | 4 |
| `--sn-research-500` | `#8174FD` | 0 | 0 |
| `--sn-research-50` | `#F4F5FF` | 1 | 1 |
| `--sn-research-600` | `#6B55EC` | 1 | 1 |
| `--sn-research-700` | `#5641C5` | 1 | 1 |
| `--sn-research-800` | `#4A3AA7` | 0 | 0 |
| `--sn-research-900` | `#2C1D70` | 0 | 0 |
| `--sn-research` | `#4A3AA7` | 7 | 6 |
| `--sn-vibe-100` | `#FEE5DC` | 0 | 0 |
| `--sn-vibe-200` | `#FECAB8` | 0 | 0 |
| `--sn-vibe-300` | `#FDA485` | 1 | 1 |
| `--sn-vibe-400` | `#F37C52` | 5 | 4 |
| `--sn-vibe-500` | `#E2581F` | 0 | 0 |
| `--sn-vibe-50` | `#FFF3EF` | 1 | 1 |
| `--sn-vibe-600` | `#C44407` | 0 | 0 |
| `--sn-vibe-700` | `#9F3605` | 1 | 1 |
| `--sn-vibe-800` | `#7C2700` | 0 | 0 |
| `--sn-vibe-900` | `#571900` | 0 | 0 |
| `--sn-vibe` | `#E2581F` | 7 | 6 |
| `--sn-women-100` | `#FFE3EA` | 0 | 0 |
| `--sn-women-200` | `#FEC6D5` | 0 | 0 |
| `--sn-women-300` | `#FB9EBA` | 0 | 0 |
| `--sn-women-400` | `#F0749E` | 5 | 4 |
| `--sn-women-500` | `#E05086` | 0 | 0 |
| `--sn-women-50` | `#FFF2F5` | 1 | 1 |
| `--sn-women-600` | `#C2386F` | 0 | 0 |
| `--sn-women-700` | `#A12659` | 1 | 1 |
| `--sn-women-800` | `#7E1944` | 0 | 0 |
| `--sn-women-900` | `#590C2D` | 0 | 0 |
| `--sn-women` | `#C2386F` | 6 | 5 |

#### Ink ramp (10)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--ink-100` | `#E8EEEF` | 1 | 1 |
| `--ink-200` | `#CFDADC` | 1 | 1 |
| `--ink-300` | `#ABBBBE` | 6 | 6 |
| `--ink-400` | `#82979A` | 13 | 9 |
| `--ink-500` | `#5E7377` | 13 | 8 |
| `--ink-50` | `#F4F7F8` | 0 | 0 |
| `--ink-600` | `#42575A` | 17 | 10 |
| `--ink-700` | `#2C3E41` | 2 | 2 |
| `--ink-800` | `#1B292C` | 0 | 0 |
| `--ink-900` | `#0C1719` | 21 | 6 |

#### Grounds + tertiary (15)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--bone` | `#EBEAE5` | 57 | 36 |
| `--card` | `#FBFAF7` | 143 | 61 |
| `--hairline` | `#DAD8D0` | 113 | 51 |
| `--lagoon-100` | `#D9F0F3` | 0 | 0 |
| `--lagoon-300` | `#88C7CE` | 1 | 1 |
| `--lagoon-700` | `#024C52` | 1 | 1 |
| `--lagoon` | `#117780` | 3 | 2 |
| `--line-strong` | `#B9B7AE` | 75 | 52 |
| `--marigold-100` | `#FFEBD5` | 0 | 0 |
| `--marigold-300` | `#FFC580` | 0 | 0 |
| `--marigold-700` | `#A86B02` | 0 | 0 |
| `--marigold-800` | `#7E4F04` | 0 | 0 |
| `--marigold` | `#FBA62A` | 2 | 1 |
| `--paper` | `#F4F3EF` | 176 | 58 |
| `--white` | `#FFFFFF` | 38 | 29 |

#### Semantic colour (30)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--color-action-active` | `var(--sn-red-800)` | 1 | 1 |
| `--color-action-hover` | `var(--sn-red-700)` | 0 | 0 |
| `--color-action` | `var(--sn-red-600)` | 1 | 1 |
| `--color-bg-form` | `var(--white)` | 3 | 3 |
| `--color-bg-raised` | `var(--card)` | 32 | 14 |
| `--color-bg-sunken` | `var(--bone)` | 10 | 9 |
| `--color-bg` | `var(--paper)` | 62 | 36 |
| `--color-border-control` | `var(--ink-500)` | 64 | 39 |
| `--color-border-strong` | `var(--line-strong)` | 4 | 3 |
| `--color-border` | `var(--hairline)` | 681 | 120 |
| `--color-error-bg` | `var(--sn-red-50)` | 5 | 5 |
| `--color-error` | `var(--sn-red-700)` | 21 | 11 |
| `--color-focus` | `var(--ink-900)` | 53 | 44 |
| `--color-info-bg` | `var(--ledger-50)` | 3 | 3 |
| `--color-info` | `var(--ledger-700)` | 3 | 3 |
| `--color-label-dot` | `var(--ink-900)` | 10 | 9 |
| `--color-link-decoration` | `rgb(12 23 25 / .35)` | 25 | 20 |
| `--color-link-longread` | `var(--lagoon)` | 1 | 1 |
| `--color-link-standalone` | `var(--ink-900)` | 37 | 29 |
| `--color-link` | `var(--ink-900)` | 4 | 4 |
| `--color-on-action` | `#FFFFFF` | 0 | 0 |
| `--color-point` | `var(--sn-red)` | 32 | 19 |
| `--color-success-bg` | `var(--sn-connect-50)` | 2 | 2 |
| `--color-success` | `var(--sn-connect-700)` | 7 | 6 |
| `--color-text-2` | `var(--ink-600)` | 394 | 128 |
| `--color-text-muted` | `var(--ink-500)` | 410 | 127 |
| `--color-text` | `var(--ink-900)` | 680 | 145 |
| `--color-warning-bg` | `var(--amber-50)` | 7 | 7 |
| `--color-warning-icon` | `var(--amber-500)` | 3 | 3 |
| `--color-warning` | `var(--amber-800)` | 13 | 10 |

#### Accent slot (6)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--accent-fill` | `var(--ink-900)` | 38 | 23 |
| `--accent-night` | `var(--night-text)` | 37 | 26 |
| `--accent-on-fill` | `var(--paper)` | 21 | 7 |
| `--accent-text` | `var(--ink-900)` | 29 | 24 |
| `--accent-tint` | `var(--bone)` | 5 | 5 |
| `--accent` | `var(--ink-900)` | 73 | 39 |

#### Type (36)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--font-accent` | `'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif` | 2 | 2 |
| `--font-display` | `var(--font-sans)` | 19 | 16 |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | 0 | 0 |
| `--font-sans` | `"Inter Variable", "Inter Fallback", system-ui, -apple-system, "Segoe UI", Roboto, var(--fo` | 15 | 13 |
| `--font-system-tamil` | `"Noto Sans Tamil Fallback", "Nirmala UI", "Tamil Sangam MN", "Tamil MN", "Latha", "Noto Sa` | 4 | 1 |
| `--leading-body` | `1.5` | 1 | 1 |
| `--leading-display` | `1.02` | 3 | 3 |
| `--leading-heading` | `1.12` | 14 | 10 |
| `--text-body-lg` | `var(--text-lede)` | 24 | 21 |
| `--text-body` | `clamp(1rem, 0.9792rem + 0.0926vw, 1.0625rem)` | 61 | 45 |
| `--text-caption` | `0.8125rem` | 137 | 64 |
| `--text-display-2xl` | `clamp(2.5rem, 1.6667rem + 3.7037vw, 5.5rem)` | 4 | 3 |
| `--text-display-xl` | `clamp(2.25rem, 1.5rem + 3.3333vw, 4.5rem)` | 23 | 18 |
| `--text-display` | `var(--text-display-xl)` | 0 | 0 |
| `--text-eyebrow` | `var(--text-label)` | 0 | 0 |
| `--text-h1` | `clamp(2rem, 1.5rem + 2.2222vw, 3.5rem)` | 21 | 17 |
| `--text-h2` | `clamp(1.625rem, 1.3333rem + 1.2963vw, 2.5rem)` | 29 | 25 |
| `--text-h3` | `clamp(1.25rem, 1.1667rem + 0.3704vw, 1.5rem)` | 74 | 54 |
| `--text-h4` | `clamp(1.1875rem, 1.0833rem + 0.463vw, 1.5rem)` | 18 | 16 |
| `--text-h5` | `clamp(1.0625rem, 1rem + 0.2778vw, 1.25rem)` | 33 | 28 |
| `--text-h6` | `clamp(0.9375rem, 0.8958rem + 0.1852vw, 1.0625rem)` | 3 | 3 |
| `--text-label` | `0.9375rem` | 14 | 11 |
| `--text-lede` | `clamp(1.125rem, 1.0833rem + 0.1852vw, 1.25rem)` | 15 | 11 |
| `--text-meta` | `0.875rem` | 133 | 68 |
| `--text-small` | `clamp(0.875rem, 0.8542rem + 0.0926vw, 0.9375rem)` | 381 | 110 |
| `--text-stat` | `clamp(3rem, 2.25rem + 3.3333vw, 5.25rem)` | 5 | 4 |
| `--tracking-display` | `-0.04em` | 5 | 4 |
| `--tracking-eyebrow` | `0` | 0 | 0 |
| `--tracking-h1` | `-0.035em` | 4 | 3 |
| `--tracking-h3` | `-0.015em` | 42 | 35 |
| `--tracking-heading` | `-0.02em` | 9 | 8 |
| `--tracking-stat` | `-0.04em` | 4 | 4 |
| `--weight-body` | `400` | 0 | 0 |
| `--weight-display` | `400` | 2 | 2 |
| `--weight-heading` | `500` | 3 | 2 |
| `--weight-label` | `500` | 1 | 1 |

#### Space / measure (25)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--measure-head` | `52rem` | 2 | 1 |
| `--measure-lede` | `44ch` | 1 | 1 |
| `--measure` | `68ch` | 48 | 29 |
| `--space-0-5` | `2px` | 3 | 2 |
| `--space-10` | `2.5rem` | 231 | 97 |
| `--space-12` | `3rem` | 167 | 71 |
| `--space-14` | `3.5rem` | 6 | 5 |
| `--space-16` | `4rem` | 137 | 63 |
| `--space-1` | `0.25rem` | 232 | 94 |
| `--space-20` | `5rem` | 14 | 13 |
| `--space-24` | `6rem` | 5 | 5 |
| `--space-2` | `0.5rem` | 613 | 136 |
| `--space-32` | `8rem` | 0 | 0 |
| `--space-3` | `0.75rem` | 562 | 136 |
| `--space-4` | `1rem` | 576 | 129 |
| `--space-5` | `1.25rem` | 313 | 96 |
| `--space-6` | `1.5rem` | 604 | 125 |
| `--space-8` | `2rem` | 425 | 109 |
| `--space-block` | `3rem` | 0 | 0 |
| `--space-grid-row` | `3.5rem` | 0 | 0 |
| `--space-head-gap` | `clamp(2.5rem, 2rem + 2.2222vw, 4rem)` | 13 | 9 |
| `--space-label-gap` | `1.5rem` | 1 | 1 |
| `--space-lede-gap` | `2rem` | 1 | 1 |
| `--space-section-tight` | `clamp(3rem, 2.3333rem + 2.963vw, 5rem)` | 5 | 5 |
| `--space-section` | `clamp(4rem, 2.6667rem + 5.9259vw, 8rem)` | 20 | 15 |

#### Radius / shadow / layout (23)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--border-hair` | `1px solid var(--color-border)` | 39 | 12 |
| `--btn-radius` | `var(--radius-btn)` | 87 | 50 |
| `--container-max` | `80rem` | 2 | 2 |
| `--focus-ring` | `0 0 0 2px var(--color-focus)` | 30 | 19 |
| `--gutter` | `20px` | 38 | 19 |
| `--media-radius` | `var(--radius-media)` | 176 | 62 |
| `--page-margin` | `max(var(--gutter), calc((100vw - var(--sbw, 0px) - var(--container-max)) / 2))` | 16 | 9 |
| `--radius-0` | `0` | 0 | 0 |
| `--radius-btn` | `4px` | 64 | 43 |
| `--radius-chip` | `9999px` | 2 | 1 |
| `--radius-full` | `9999px` | 112 | 71 |
| `--radius-lg` | `12px` | 10 | 8 |
| `--radius-md` | `8px` | 5 | 4 |
| `--radius-media` | `12px` | 98 | 59 |
| `--radius-sm` | `4px` | 14 | 10 |
| `--radius-xl` | `20px` | 2 | 1 |
| `--shadow-1` | `0 1px 2px rgb(12 23 25 / .06), 0 1px 1px rgb(12 23 25 / .04)` | 2 | 2 |
| `--shadow-2` | `0 4px 12px rgb(12 23 25 / .08), 0 2px 4px rgb(12 23 25 / .05)` | 3 | 3 |
| `--shadow-3` | `0 12px 32px rgb(12 23 25 / .14), 0 4px 8px rgb(12 23 25 / .06)` | 1 | 1 |
| `--shadow-overlay` | `0 16px 48px rgb(12 23 25 / .16), 0 2px 6px rgb(12 23 25 / .06)` | 7 | 4 |
| `--sheet-2` | `var(--bone)` | 19 | 8 |
| `--sheet-radius` | `32px` | 64 | 21 |
| `--sheet` | `var(--paper)` | 7 | 5 |

#### Motion (30)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--dur-0` | `0ms` | 0 | 0 |
| `--dur-1` | `100ms` | 51 | 21 |
| `--dur-2` | `200ms` | 382 | 106 |
| `--dur-3` | `240ms` | 117 | 54 |
| `--dur-4` | `320ms` | 11 | 8 |
| `--dur-5` | `480ms` | 6 | 6 |
| `--dur-6` | `800ms` | 5 | 5 |
| `--dur-count` | `1000ms` | 0 | 0 |
| `--dur-header` | `280ms` | 8 | 8 |
| `--dur-media` | `480ms` | 8 | 6 |
| `--dur-reveal` | `400ms` | 1 | 1 |
| `--ease-dot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 5 | 5 |
| `--ease-enter` | `cubic-bezier(0, 0, 0.3, 1)` | 9 | 8 |
| `--ease-exit` | `cubic-bezier(0.2, 0, 1, 0.9)` | 0 | 0 |
| `--ease-expressive` | `cubic-bezier(0.4, 0.14, 0.3, 1)` | 2 | 2 |
| `--ease-glide` | `cubic-bezier(0.2, 0.8, 0.3, 0.97)` | 0 | 0 |
| `--ease-header-exit` | `cubic-bezier(0.4, 0, 1, 1)` | 7 | 7 |
| `--ease-linear` | `linear` | 2 | 2 |
| `--ease-reveal` | `cubic-bezier(0.22, 1, 0.36, 1)` | 25 | 12 |
| `--ease-snap` | `cubic-bezier(0.2, 0, 0, 1)` | 333 | 88 |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | 220 | 78 |
| `--hover-exit` | `300ms` | 0 | 0 |
| `--hover-intent` | `150ms` | 0 | 0 |
| `--marquee-speed` | `32` | 0 | 0 |
| `--shift-1` | `4px` | 42 | 23 |
| `--shift-2` | `8px` | 6 | 5 |
| `--shift-3` | `16px` | 1 | 1 |
| `--shift-4` | `24px` | 0 | 0 |
| `--shift-reveal` | `8px` | 2 | 2 |
| `--stagger` | `60ms` | 0 | 0 |

#### Chrome (5)

| Token | Value (:root) | var() uses | files |
|---|---|---:|---:|
| `--header-h-compact` | `56px` | 10 | 9 |
| `--header-h` | `72px` | 77 | 43 |
| `--subnav-h` | `48px` | 23 | 16 |
| `--utility-h` | `36px` | 6 | 6 |
| `--wa-500` | `#25D366` | 0 | 0 |

### 1.2 Global classes the redesign inherits (`styles/base.css` 222 lines, `styles/theme.css` 157 lines)

| Class / rule | File | What it does now |
|---|---|---|
| `body` | base.css | `--font-sans`, `--text-body`, `--leading-body`, `--color-bg` (Paper) |
| `h1…h6` | base.css L41-44 | weight 500 (h1 400), tracking `--tracking-heading`, `text-wrap: balance` |
| `.display-2xl` `.display-xl` `.h1`-`.h5` `.lede`/`.body-lg` `.small` `.caption` `.meta` | base.css L48-64 | type scale classes |
| `.eyebrow` | base.css + theme.css L47-70 | "● dot label": 15px/500 sentence case, 0.55em dot in `--color-label-dot` (never red) |
| `em` in h1/h2/`.section-header__title`/`.cta-band__title`, `.kinetic__accent` | theme.css L35-45 | Instrument Serif italic, 1.04em; disabled on `:lang(ta)` |
| `.dot` | base.css | the red full stop `--color-point`; Red-700 beside small headings, Red-400 on Ink (theme.css) |
| `.container` / `.container--narrow` | base.css | max 1280 + 2×gutter / 832 + 2×gutter |
| `.grid-12` + `.col-3…10` + `.col-start-2…9` | theme.css | 4 cols < 1024, 12 cols with 32px gap ≥ 1024 |
| `.grid`, `.grid-2/3/4`, `.split`, `.split--8-4`, `.stack`, `.cluster` | base.css | auto-fit grids (22/18/15rem min); tablet 2-up with wide odd card rules (base.css L123-152) |
| `.bleed-right`, `.bleed` | theme.css | escape container to viewport edge using `--page-margin` |
| `.arrow-link`, `.u-sweep` | base.css | arrow nudge 4px + underline sweep |
| `.prose`, `.rich-text` | base.css | 68ch, Lagoon links |
| `.section--white/.section--sunken` (Bone), `.section--paper`, `.section--night` | theme.css | grounds; same-ground neighbours get a 1px hairline (theme.css L93-99) |
| hero band | theme.css L72-81 | `.home-hero, .page-hero, .brand-hero` forced to `--night-0` with `padding-bottom: calc(64px + var(--sheet-radius))` |
| sheet rise | theme.css L101-110 | the element right after a hero gets `margin-top: -32px` + 32px top radius (one per page) |
| `.art-image--photo` frame | theme.css | 12px radius + inset 1px Ink 8% keyline |
| `.sd-reveal` | base.css | CSS scroll-driven reveal (`animation-timeline: view()`) |
| `#root.is-prerender-pending`, `html[data-from-snapshot]` | base.css L202-215 | prerender hand-over (see §4.7) |
| `html.lenis*` | base.css | Lenis smooth-scroll compatibility |
| `.back-to-top`, scroller edge fade, mega-menu item stagger | interactions.css | 48px Ink circle (z 54), 48px mask fade, 28ms link stagger |
| `.has-pointer-fx` magnetic CTA, card tilt + spotlight + 1.03 media zoom | pointerFx.css (87) + `lib/pointerFx.js` | fine pointer + motion only |

z-index ladder: back-to-top 54, bottom CTA bar 55, header 60, consent 80, skip link 1000, sticky sub-navs 20.

---

## 2. Shared components (`components/`, barrel `components/index.js`)

Import pattern: `import { Button, Section } from '../components'` (barrel). Not in the barrel (kept out of the entry
chunk; import by path): `ScrubText`, `ClipReveal`, `FeatureTabs`, `PulliTimeline`, `_accent.jsx` (`accentHeadline`),
`PhotoGradeFilter`, `_indicator.js` (`useSlidingIndicator`, `glideTo`), `_inview.js` (`observeOnce`), `_utils.js`
(`cx`, `eventPath`, `hashString`, `TAG_META`, `LADDER_LEVELS`), `_placeholders.js`, `formUtils.js`.

"pages" = page files rendering it, "layout" = layout files, "kit" = other component files, "JSX" = total `<Name` tags
in pages + layout + components. 143 page JSX files in total.

### 2.1 Primitives, layout and type

| Component | Props (defaults) | CSS (lines) | pages | layout | kit | JSX |
|---|---|---|---:|---:|---:|---:|
| `Button` (forwardRef) | `variant='primary'` (`primary`, `secondary`, `tertiary`, `brand`, `whatsapp`, `inverse`), `size='md'` (`sm` 36 / `md` 44 / `lg` 52px, 0 14/18/24px padding), `to`, `href`, `onClick`, `type`, `icon`, `full`, … | Button.css (186) | 83 | 3 | 5 | 595 |
| `Section` | `surface='paper'` (`paper`/`white`/`sunken`/`night`/`accent`), `brand`, `id`, `width='default'` (`narrow`/`full`), `pad='default'` (`tight`/`sm`/`none`), `labelledBy`, `contentLang` | Section.css (37) | 74 | 1 | 0 | 326 |
| `SectionHeader` | `eyebrow`, `title`, `lede`, `action`, `as='h2'`, `align='left'`, `id`, `contentLang` | SectionHeader.css (47) | 55 | 0 | 0 | 175 |
| `Reveal` / `RevealGroup` | `as='div'`, `delay=0`, `y=8`, `variant='rise'`/`'clip'` / `stagger=0.06` | Reveal.css | 60 / 64 | 0 | 5 / 2 | 147 / 125 |
| `Dot` | `animate=false`, `delay` | Dot.css | 21 | 1 | 3 | 45 |
| `KineticHeadline` | `text`, `as='h1'`, `delay=0`, `id`, `accentFirst`, `accentWord` | KineticHeadline.css | 10 | 0 | 2 | 12 |
| `accentHeadline(text,{accentWord,dot})` | function in `_accent.jsx` (40 lines): wraps one Latin word in `<em>`, turns a trailing "." into `<Dot/>` | (theme.css) | 3 files | | | |
| `Badge` | `kind='type'`, `brand`, `status` | Badge.css (59) | 39 | 1 | 4 | 98 |
| `TagChip` | `tag='C'`, `short` | TagChip.css | 31 | 0 | 2 | 63 |
| `Breadcrumbs` | `items` | Breadcrumbs.css | 23 | 0 | 1 | 26 |
| `Logo` | `reversed`, `size='md'`, `mono` | Logo.css | 1 | 4 | 1 | 8 |
| `BrandLockup` | `brand=null`, `size='md'`, `reversed` | BrandLockup.css | 5 | 2 | 2 | 11 |
| `Placeholder` | `children` | Placeholder.css | 14 | 1 | 3 | 26 |
| `InlineMarks` | `text` | (none) | 15 | 0 | 5 | 88 |
| `Seo` | `title`, `titleTa`, `description`, `descriptionTa`, `image`, `type`, `noindex`, `robots`, `canonical`, `jsonLd` | (none) | 74 | 0 | 0 | 91 |
| `PageLoader` / `Skeleton` / `EmptyState` | – / `height`, `count`, `radius` / `title`, `body`, `action`, `headingLevel` | own CSS | 3 / 39 / 31 | 2 / 0 / 0 | | 8 / 69 / 43 |
| `WhatsAppButton` | `text`, `refCode`, `contextRef`, `label`, `iconOnly`, `size` | WhatsAppButton.css | 9 | 2 | 1 | 12 |
| `Actions` | `children`, `as` | Actions.css | 0 | 0 | 0 | 1 (dead) |
| `PillSubNav` | `items`, `label`, `night` | PillSubNav.css | 0 | 0 | 0 | 1 (dead; class still targeted by theme.css sheet rule) |

### 2.2 Heroes and bands

| Component | Props | CSS (lines) | pages | JSX |
|---|---|---|---:|---:|
| `PageHero` | `eyebrow`, `title`, `lede`, `actions`, `art`, `surface='paper'`, `breadcrumbs`, `meta`, `titleClass`, `contentLang`, `accentWord`, `layout='split'` | PageHero.css (131): Ink band, 64px top, grid 7/5 ≥1024, media 4/3 max 560px | 40 | 40 |
| `BrandHero` / `JourneyLine` | `brand`, `title`, `lede`, `actions`, `art`, `meta`, `endorsement`, `compact`, `contentLang`, `sweep=true`, `accentWord`, `layout='split'` | BrandHero.css (138): Ink band, media 16/10 bleeding right on cols 6-12 | 21 | 21 |
| `CTABand` | `title`, `body`, `actions`, `surface='paper'`, `brand`, `eyebrow`, `accentWord`, `id` | CTABand.css (93): left statement at `--text-display-xl`, lede 40ch, hairline arc | 45 | 50 |
| `FactBand` | `metrics`, `surface='paper'`, `title`, `footnote`, `link`, `variant` | FactBand.css (81): stats row with vertical hairlines, 2×2 mobile | 11 | 11 |
| `Stat` (+ `TagPopover`) | `metric`, `variant` (`compact`…), `dl`, count-up | Stat.css (160), Stat.jsx 539 lines (framer-motion) | 51 | 97 |
| `KeyFacts` | `items`, `title`, `action`, `sticky=true` | KeyFacts.css | 15 | 17 |
| `Quote` | `quote`, `name`, `role`, `place`, `date`, `brand`, `size='lg'` | Quote.css | 1 | 1 |
| `LogoWall` | `partners`, `variant='grid'`, `title`, `showLink` | LogoWall.css | 5 | 5 |
| `Marquee` | `items`, `speed=32`, `label` | Marquee.css | 0 (used by kit) | 1 |

### 2.3 Cards and media

| Component | Props | Family / CSS | pages | JSX |
|---|---|---|---:|---:|
| `Card` | `to`, `href`, `brand`, `eyebrow`, `title`, `body`, `meta`, `art`, `footer`, `badges`, `cta`, `kicker`, `variant='framed'` (`media`), `ratio`, `headingLevel=3` | Card.css (172): framed = Card #FBFAF7 + hairline + 2px Ink top rule on hover; media = unframed 12px media | 9 | 15 |
| `EventCard` | `event`, `headingLevel` | media 4/3, EventCard.css (33) | 13 | 16 |
| `ProgrammeCard` | `programme`, `headingLevel`, `art`, `artRatio='3/2'` | framed, ProgrammeCard.css (15) | 11 | 13 |
| `StoryCard` | `story`, `headingLevel` | media 4/5 | 8 | 8 |
| `PersonCard` | `person`, `headingLevel`, `compact` | unframed 1/1 portrait | 6 | 7 |
| `ReportCard` | `report`, `to`, `headingLevel` | framed | 4 | 4 |
| `BrandTile` | `brand`, `stat`, `headingLevel`, `showArt=true` | media 4/5, BrandTile.css (65) | 1 | 1 |
| `ArtImage` | `variant='grid'` (`portrait`, …), `brand`, `ratio='16/9'`, `label`, `alt`, `night`, `seed`, `initials`, `photo`, `photoPool`, `theme`, `noCaption`, `documentary`, `plan`, `curated`, `sizes`, `priority` | ArtImage.css, ArtImage.jsx 245 lines | 20 | 34 |
| `Scroller` | `label`, `children`, `itemWidth`, `ordered` | Scroller.css (102): right-bleed snap rail, "01 / 08" counter + 48px ring buttons, Lenis-aware | 8 | 10 |
| `VideoFeature` / `VideoPlaylist` / `EventVideos` | `video`, `priority`, `variant='card'`, `autoPlay`, `onPlay`, `caption` / `videos`, `label` / `series`, `edition`, `max=2`, `layout='auto'` | VideoFeature.css | 1 / – / 7 | 4 / – / 8 |
| `EventGallery` | `series`, `edition`, `exclude`, `min=2`, `max=5`, `headingLevel=2` | EventGallery.css | 2 | 2 |

### 2.4 Disclosure, steps, forms, motion

| Component | Props | pages | JSX |
|---|---|---:|---:|
| `Accordion` | `items`, `faq`, `headingLevel=3`, `defaultOpen` (Accordion.css 100: 20px questions, 28px rows, +/− morph) | 24 | 25 |
| `Tabs` | `tabs`, `defaultTab`, `label`, `onChange`, `variant='underline'` (`pill`); also defines `.chip`, `.segmented` | 5 | 5 |
| `Steps` | `steps`, `variant='row'`, `headingLevel`, `label` | 15 | 15 |
| `Ladder` | `levels`, `variant='vertical'`, `current`, `from`, `to`, `label` | 4 | 4 |
| `SmartForm` | `type`, `fields`, `consents`, `submitLabel`, `successTitle`, `successBody`, `hidden`, `note`, `onSuccess`, `headingLevel`, `brand` (posts to `/api/forms`, synced to Frappe) | 19 | 20 |
| `Field` / `CheckboxControl` / `ConsentCheckbox` / `FormSuccess` | used inside SmartForm / NewsletterForm only | 0 | 3 / – / 3 / 2 |
| `NewsletterForm` | `compact`, `night`, `defaultTopics` (356 lines) | 4 (+Footer) | 5 |
| `ScrubText` (path import) | `as='p'` scroll-scrubbed word opacity | 8 | 8 |
| `ClipReveal` (path import) | `as` scroll-linked inset expand | 1 | 2 |
| `FeatureTabs` (path import) | `items`, `interval=7500`, `autoplay`, `label` | 1 | 1 |
| `PulliTimeline` / `PulliArt` (path import) | `steps`, `node='point'`, `scrollSync`, `photos` | 1 | 1 |

Page CSS that restyles kit classes (each must be re-checked when the kit changes): `.button*` 54 rules in 23 page CSS
files, `.card*` 60 / 16, `.section-header*` 37 / 11, `.page-hero*` 39 / 12, `.brand-hero*` 30 / 11, `.cta-band*` 15 / 4,
`.fact-band*` 41 / 4, `.stat*` 83 / 21, `.art-image*` 62 / 24, `.eyebrow` 20 / 17, `.accordion*` 12 / 4,
`.scroller*` 7 / 1. 56 `!important` in page CSS.

---

## 3. Page and route inventory, grouped by template

Routing: `App.jsx` mounts the same `routes()` tree twice, under `/` and `/ta` (Tamil mirror, same slugs), inside
`SiteLayout` → `RouteGuard` (error boundary). Everything is `lazy()` except `Home`. Vanity redirects: `/mission`,
`/ledger`, `/vibathon`, `/apply`, `/snx`. `pages/new/*` resolve through `import.meta.glob` (missing → NotFound).
Line counts are JSX / page CSS.

### T1 Home (custom hero, entry bundle)
| Route | Files |
|---|---|
| `/` | `pages/Home.jsx` 373 / `pages/Home.css` 697; `pages/home/HeroShowcase.jsx` 278, `HomeRest.jsx` 336 (lazy), `FounderStory.jsx` 175 / .css 198, `PersonaSelector.jsx` 73 / .css 179, `UpdatesTabs.jsx` 129 / .css 53, `MissionMeter.jsx` 73 / .css 25; data `homeFaq.js`, `homeI18n.js`, `homeMetrics.js`, `personas.js` |

Current home section order (ids):
1. `.home-hero.home-hero--v3` (`data-surface="night"`): `HeroPill` (next event) → `KineticHeadline` h1 "Every talent, a
   founder." (`accentWord="founder"`, `.display-2xl`) → lede → 2 lg buttons (Find your programme / See upcoming events)
   → partner line (tertiary) | right: `HeroShowcase` (5 categories × 5 photos, crossfade 1.6s) → `HeroProof` (startup
   logo row ≥1024, marquee below).
2. `#i-am` PersonaBand (persona chip grid, "I am a…").
3. `#where-things-stand` night `FactBand` with `ScrubText` title.
4. `#brands` "Four doors into founding" `SectionHeader` + `Scroller` of 4 brand tiles (`min(19rem, 80vw)`).
5. (HomeRest, lazy) `FounderStory` (M07 How it works, sticky profile card + step rail).
6. `#mission` sunken, Mission 1 Lakh + `MissionMeter`.
7. `#why-tamil-nadu` paper.
8. `#on-film` night, `VideoFeature` (SaaS Connect 2025).
9. `#coming-up` white, `Scroller` of `EventCard` (`min(20rem, 82vw)`, max 8).
10. `#open-now` open programme calls (3 `ProgrammeCard`).
11. `#updates` white, `UpdatesTabs`.
12. `#stories` `Scroller` of `StoryCard` (hidden when no real stories).
13. `#partner` `LogoWall`.
14. `#questions` FAQ `Accordion`.
15. `ClosingCta` = `CTABand surface="night"` "Start where you are." (`accentWord="Start"`), Join + WhatsApp.

### T2 Brand hub (BrandLayout `data-brand` + BrandSubNav + `BrandHero`)
| Route | Files |
|---|---|
| `/research` | `pages/brands/research/ResearchHome.jsx` 383 / .css 115; components `FourParty`, `ResearchJourney`, `ProblemList`, `TermSheet`, `InterestForm`, `ResearchProof`; `researchContent.js` 392 |
| `/vibe` | `pages/brands/vibe/VibeHome.jsx` 314 / .css 83; `parts/*` (SeasonTimeline [GSAP], TrackExplorer, VibathonCountdown, VibeEvents, VibeJourney, VibeProof, VibePulse); `vibeContent.js` 521 |
| `/connect` | `pages/brands/connect/ConnectHome.jsx` 368 / .css 81; NetworkGraph, SeatRing, SeriesGrid, SwitchStepper, ConnectBits, ConnectHeading, ConnectProof; `connectData.js` 247 |
| `/women` | `pages/brands/women/WomenHome.jsx` 354 / `Women.css` 326; CircleFinder, SchemeExplorer, RisingPath, NominationForm, WomenBits, WomenProof, WomenStories; `womenContent.js` 262 |
| shared | `pages/brands/brandPage.css` 191 (imported by every brand page and every brand-sub page), `pages/brands/seoBits.js` |
| `/brands` (not in BrandLayout) | `pages/brands/OurBrands.jsx` 369 / .css 140, uses `PageHero` + `BrandTile` |

### T3 Brand sub page (BrandLayout + `BrandHero`, content-driven by `:slug`)
| Route | Files |
|---|---|
| `/research/:slug` | `ResearchSub.jsx` 627 / .css 132 |
| `/vibe/:slug` | `VibeSub.jsx` 700 / .css 123 |
| `/vibe/vibathon` | `Vibathon.jsx` 428 / .css 215 (custom `.vibathon__hero`) |
| `/connect/:slug` | `ConnectSub.jsx` 522 / .css 70 |
| `/women/:slug` | `WomenSub.jsx` 390 (styles in Women.css) |
| `/research/labs/:lab` | `pages/mega/brand-sub/ResearchLab.jsx` 370 / .css 151 |
| `/{research,vibe,connect,women}/stories` | `mega/brand-sub/BrandStories.jsx` 263 / .css 38 |
| `/{research,vibe,connect,women}/events` | `mega/brand-sub/BrandEvents.jsx` 304 / .css 104 |
| `/women/summit/awards` | `mega/brand-sub/WomenAwards.jsx` 339 / .css 111 |
| shared | `mega/brand-sub/BrandSubParts.jsx` 81 / .css 17, `brandSubData.js` 356, `districts.js`, `routes.js` |

### T4 Programme
| Route | Files |
|---|---|
| `/programmes` | `pages/programmes/Programmes.jsx` 590 / .css 319 (custom hero), `parts/FacetBar.jsx` 361 / .css 198 (also used by Events), `facets.js`, `programmeMeta.js` 327, `seoFit.js` 109, `RichText.jsx` |
| `/programmes/:slug` | `ProgrammeDetail.jsx` 611 / .css 176 (PageHero or BrandHero by brand) |
| `/programmes/open-calls` | `pages/new/OpenCalls.jsx` 143 / .css 47, `new/callsMeta.js` |

### T5 Event listing
| Route | Files |
|---|---|
| `/events` | `pages/events/Events.jsx` 607 / .css 129 (PageHero + FacetBar) |
| `/events/past` | `PastEvents.jsx` 225 / .css 78 |
| shared parts | `events/parts/eventList.css` 138, `EventCalendar.jsx` 157 / .css 101, `EventRow.jsx` 146, `EventRecord.jsx` 197 / .css 54, `UrlTabs.jsx` 100 / .css 29, `eventMeta.js`, `eventTime.js`, `ics.js` |

### T6 Event detail / series / edition
| Route | Files |
|---|---|
| `/events/:slug` | `mega/events-series/EventsSlugDispatcher.jsx` 42 → `SeriesPage.jsx` 503 / .css 246 (PageHero) or `events/EventDetail.jsx` 971 / .css 337 (custom hero `.event-hero__poster`) |
| `/events/:series/:edition` (+ `/agenda`, `/speakers`) | `mega/events-series/EditionPage.jsx` 774 / .css 376 (custom `.edition-hero__poster`), `seriesParts.jsx` 110 / .css 19, `seriesData.js` 530 |
| `/events/host`, `/events/founders-day` | `mega/events-extra/HostEvent.jsx` 532 / .css 212, `FoundersDay.jsx` 354 / .css 135 (PageHero) |
| `/events/speak` | `pages/new/SpeakMentor.jsx` 173 / .css 51 |

### T7 Insights / report / ledger
| Route | Files |
|---|---|
| `/insights` | `pages/insights/Insights.jsx` 310 / .css 98 |
| `/insights/founder-ledger` | `FounderLedger.jsx` 692 / .css 319, `LedgerCharts.jsx` 407 / .css 180, `ledgerUtils.js` 357 |
| `/insights/founder-ledger/methodology`, `/:period`, `/corrections` | `mega/insights-ledger/Methodology.jsx` 555 / .css 225, `LedgerPeriod.jsx` 573 / .css 214, `pages/new/Corrections.jsx` 194 / .css 44 |
| `/insights/stories`, `/:slug` | `Stories.jsx` 237 / .css 44 (+ `StartupShowcase.jsx` 102 / .css 99), `StoryDetail.jsx` 357 / .css 89 |
| `/insights/reports`, `/:slug` | `Reports.jsx` 291 / .css 88, `mega/insights-reports/ReportDetail.jsx` 587 / .css 152 (+ `ChapterNav` 165 / 58) |
| `/insights/indices`, `/:index`, `/podcast`, `/newsletter` | `mega/insights-reports/Indices.jsx` 189 / 59, `IndexDetail.jsx` 297 / 124, `Podcast.jsx` 177 / 51; `mega/insights-ledger/Newsletter.jsx` 382 / 135 |

### T8 Partner
| Route | Files |
|---|---|
| `/partner` | `pages/partner/Partner.jsx` 294 / `Partner.css` 452 (shared by all partner pages) |
| `/partner/:type` | `PartnerType.jsx` 367, `partnerData.js` 658, `PartnerProof.jsx` 127 |
| `/partner/enquire` | `Enquire.jsx` 181 + `EnquiryForm.jsx` 75 |
| `/partner/our-partners` | `OurPartners.jsx` 156 |

### T9 About / districts (PageHero long-reads)
| Route | Files |
|---|---|
| `/about`, `/about/mission-1-lakh`, `/how-we-work`, `/leadership`, `/evidence-standard`, `/governance`, `/thinktn-alliance` | `pages/about/About.jsx` 474 / 76, `Mission.jsx` 302 / 84, `HowWeWork.jsx` 267 / 90, `Leadership.jsx` 280 / 83, `EvidenceStandard.jsx` 290 / 68, `Governance.jsx` 275 / 80, `ThinkTN.jsx` 229 / 108; parts `EngineMatrix`, `LadderScroll` [GSAP], `MissionMeter`, `ModelDiagram` [GSAP], `Timeline`; `shared.jsx` 265 / `shared.css` 156 |
| `/about/self-diagnosis` | `mega/about-districts/SelfDiagnosis.jsx` 639 / .css 230 |
| `/districts`, `/districts/:district` | `pages/new/Districts.jsx` 224 / 92, `mega/about-districts/DistrictPage.jsx` 545 / 185, `DistrictLocator`, `districtsData.js` |

### T10 Utility / legal / campaign
| Route | Files |
|---|---|
| `/media`, `/media/kit`, `/media/releases/:slug` | `pages/utility/Media.jsx` 313 / 137, `mega/media-careers/MediaKit.jsx` 597 / 311, `PressRelease.jsx` 218 / 90, `shared.jsx` 103 / `shared.css` 33 |
| `/careers`, `/careers/:slug` | `utility/Careers.jsx` 235 / 78, `mega/media-careers/JobDetail.jsx` 306 / 87 |
| `/contact`, `/search`, `/legal/:slug`, `/sitemap`, `*` | `utility/Contact.jsx` 286 / 105, `Search.jsx` 267 / 120, `Legal.jsx` 280 / 157 (+ `legalContent.js` 240, `.ta.js` 287), `Sitemap.jsx` 273 / 43, `NotFound.jsx` 163 / 96 |
| `/join` | `pages/Join.jsx` 260 / `Join.css` 139 (imports `home/PersonaSelector.jsx`) |
| `/signin`, `/signup` (minimal header, noindex) | `mega/utility-campaign/SignIn.jsx` 6, `SignUp.jsx` 7 → `SnxHandoff.jsx` 175 / .css 90 |
| `/go/:slug` (minimal header) | `mega/utility-campaign/CampaignLanding.jsx` 340 / .css 227, `campaigns.js` 339 |
| shared | `pages/utility/restKit.css` 103 (imported by 15 pages across About, Insights, Partner, SNX, Utility, Join, Campaign) |

### T11 StartNet X (BrandLayout `brand="x"`, BrandHero)
| Route | Files |
|---|---|
| `/startnet-x` | `pages/snx/StartNetX.jsx` 289 / .css 130, `SnxParts.jsx` 42 / .css 53, `snxContent.js` 184, `snxTamil.js` 225 |
| `/startnet-x/modules`, `/pricing`, `/trust` | `Modules.jsx` 163 / 62, `Pricing.jsx` 422 / 289, `Trust.jsx` 144 / 72 |
| `/startnet-x/agents`, `/developers`, `/updates` | `mega/snx-extras/Agents.jsx` 418 / 68, `Developers.jsx` 414 / 108, `Updates.jsx` 262 / 66, `SnxxParts` 57 / 44 |
| `/startnet-x/{founders,institutions,incubators,gccs,government,investors}` | 6-line wrappers → `mega/snx-audiences/SnxAudiencePage.jsx` 362 / .css 200, `audienceContent.js` 482 |

Hero type count: `PageHero` 40 pages, `BrandHero` 21 pages, custom hero 7 (Home, HeroShowcase, Programmes,
EventDetail, EditionPage, CampaignLanding, Vibathon), no hero (StoryDetail, JobDetail, PressRelease, Legal, Search,
NotFound, Join, SignIn/Up). `CTABand` closes 45 pages; `Breadcrumbs` on 23.

---

## 4. How the system works

### 4.1 Chrome (`layout/`)
| File | Lines (JSX/CSS) | Current spec |
|---|---|---|
| `SiteLayout.jsx` | 125 / 31 | `LazyMotion` + `MotionConfig` + `ShellProvider`; order: skip link → `ConsentBanner` → `Header` or `MinimalHeader` (`isMinimalPath`: `/go/*`, `/signin`, `/signup`) → spacer (`--header-h`, + `--utility-h` ≥1024, Ink) → `TamilSuggestBanner` → `<main id="main">` → `Footer` → `BottomCtaBar` → `BackToTop`; outside the inert page: `MobileDrawer`, `SearchMount`, `ScrollManager`, `PhotoGradeFilter`, `AutoContentLang`. Route-enter 240ms fade + 6px |
| `Header.jsx` | 423 / 158 | fixed, z 60; `UtilityBar` (≥1024) + 72px Ink bar (56 compact/below 1024); 7 `PRIMARY_NAV` disclosure triggers (15px/400, `--night-text-2` → Paper), 2px Paper glide underline, 40px ring icon buttons (search, menu); compact glass `rgb(12 23 25/.92)` + blur 16 after 120px; hides after 8px down, shows after 40px up; broadcasts `sn:header` + `html[data-header-hidden]`; writes `--shell-offset`; 2px red scroll-progress on long reads. **Hard-coded heights in JS**: `const utility = wide ? (coarse ? 40 : 36) : 0; const bar = wide ? (state.scrolled ? 56 : 72) : 56;` (L98-99): change these together with `--header-h*`/`--utility-h` |
| `UtilityBar.jsx` | 53 / 40 | 36px Ink strip (40 coarse): Media · Careers (count) · Contact · EN/தமிழ் · Sign in · red "Join StartNet" (Red-600, 28px, 4px radius, the chrome's one red point) |
| `MegaMenu.jsx` | 440 / 210 | Paper sheet under the bar, hairline top/bottom, no shadow; `.mega-menu__inner` 8fr/4fr: intro + 2-4 link columns + featured card (photo / live data: next flagship, open calls, ledger tiles, mission progress); variant `brands` = 4 accent-ruled columns; 17px/500 links with Bone hover rows; scrim Ink 25%; hover intent 150ms / exit 300ms / switch 120ms |
| `MobileDrawer.jsx` | 238 / 136 | full-screen Ink dialog, 7 accordion rows, sticky red Join bar 52px; nav < 1024 (Tamil < 1280) |
| `BrandSubNav.jsx` | 331 / 121 | 48px sticky bar under the header (docks via `--shell-offset`, follows `sn:header`): lock-up · 5-7 links (`data/brands.js` `subNav`) · brand CTA · 3px accent rule; chip scroller + "More" sheet on mobile |
| `Footer.jsx` | 263 / 123 | Ink, 96px top padding; row 1 large mono wordmark (`clamp(3.5rem, 2rem + 6.4vw, 7.5rem)`) + tagline 6/6 with newsletter; link columns 6 → 3 → accordions (`FOOTER_COLUMNS`); socials 40px rings; partner logos; ThinkTN line (locked copy); legal row + Cookie settings + `MotionSwitch` |
| `BottomCtaBar.jsx` | 336 / 33 | < 1024 only, z 55, context CTA (page `usePageCta` → `megaCtas.js` → brand CTA → Join) + WhatsApp; hides while `[data-primary-cta]` (23 marks) is in view; publishes `--bottom-cta-h` |
| `ConsentBanner.jsx` | 324 / 131 | DPDP card 380px bottom-right ≥768, z 80, publishes `--consent-h` |
| `SearchOverlay.jsx` | 332 / 106 | lazy dialog, `/` and Ctrl/⌘+K |
| `LanguageSwitch.jsx`, `MinimalHeader.jsx`, `MotionSwitch.jsx`, `BackToTop.jsx`, `ScrollManager.jsx`, `AutoContentLang.jsx`, `shell.jsx`, `megaCtas.js`, `motionFeatures.js` | 105, 35, 56, 74, 218, 61, 214, 63, 8 | language links with `hreflang`; minimal header; reduce-motion switch; back-to-top; scroll/focus/announce on route change; WCAG lang-of-parts pass; shell context (`useShell`, `usePageCta`, `isMinimalPath`, `signInHref` → startnet-platform.vercel.app, `desktopNavQuery`) |

Navigation content lives in `data/nav.js` (`PRIMARY_NAV` ids `who`, `brands`, `programmes`, `events`, `insights`, `snx`,
`partner`; `UTILITY_LINKS`, `SIGN_IN`, `JOIN`, `SEARCH_QUICK_LINKS`, `FOOTER_COLUMNS` ids `who`, `brands`, `take-part`,
`insights`, `partner`, `company`; `SOCIAL_CHANNELS`, `LEGAL_LINKS`, `THINKTN_LINE`). DESIGN-v2's hard rule: copy, links,
menu items and information order do not change in a visual redesign; changing them needs the user's say-so.

### 4.2 Surfaces
- Day ground is Paper (`body`), alternate ground Bone via `Section surface="white"` or `"sunken"` (both Bone).
- Night = `data-surface="night"` on any element: tokens.css L174-185 re-points `--color-bg/-raised/-text/-border/-link/
  -focus/-label-dot` and sets `background`/`color`. `Section surface="night"` adds it automatically; heroes, utility bar,
  header and footer are Ink by their own CSS. 42 JSX `data-surface` attributes.
- One sheet rise per page: theme.css L101-110 (the sibling after `.home-hero|.page-hero|.brand-hero`). A redesign that
  drops the dark hero must delete this rule and the hero `padding-bottom: calc(64px + var(--sheet-radius))`, and the
  62 page-CSS lines that mention `--sheet-radius` / `.section--white`.
- DESIGN-v2 decisions currently encoded: header Ink on every page, no theme flip; ≤ 2 mid-page Ink bands + footer.

### 4.3 Brand accents
- `BrandLayout.jsx` (16 lines) wraps brand routes in `<div data-brand={brand} className="brand-layout">` + `BrandSubNav`.
  Brands: `research`, `vibe`, `connect`, `women`, `x` (StartNet X).
- tokens.css L159-168 per brand: `--accent`, `--accent-text` (700 step), `--accent-tint` (50 step), `--accent-fill`,
  `--accent-on-fill`, `--accent-night` (400 step), `--color-label-dot: var(--accent)`; inside night surfaces the dot uses
  `--accent-night` (L187). Vibe fill takes Ink text; Connect fill is Connect-700 with white.
- Components also take a `brand` prop and set `data-brand` locally (`Section`, `Card`, `Badge`, `CTABand`, `Quote`, mega
  `mega-calls__item`, footer links); 77 files use `data-brand`.
- Rule: the accent appears only in dot labels, the sub-nav rule, journey line, badges and brand buttons; never as a ground.
- `components/_accent.jsx` is not the brand accent: it is `accentHeadline()`, the serif accent word + red stop helper.

### 4.4 Motion
| Library | Where | Notes |
|---|---|---|
| framer-motion 11 (`LazyMotion` + `m`, `domAnimation` chunk from `layout/motionFeatures.js`) | 42 files: layout Header, MegaMenu, MobileDrawer, BrandSubNav, BottomCtaBar, ConsentBanner, SearchOverlay, SiteLayout; kit Stat, Tabs, ScrubText, ClipReveal, FormSuccess, NewsletterForm; 25 page files (Home MissionMeter, OurBrands, Vibe/Women/Connect/Research parts, Events, Programmes, FacetBar, LedgerCharts, Join, StartNetX, NotFound, about MissionMeter/ThinkTN/Timeline) | `MotionConfig reducedMotion` from `useReducedMotion()` (52 files use the hook) |
| GSAP 3.12 (+ScrollTrigger) | `pages/about/LadderScroll.jsx`, `pages/about/ModelDiagram.jsx`, `pages/brands/vibe/parts/SeasonTimeline.jsx`, `lib/smoothScrollBoot.js` (ScrollTrigger sync) | pinned stories set `html[data-pin-active]`; header freezes while pinned |
| Lenis 1.3 | `lib/smoothScrollBoot.js` (instance), `lib/smoothScroll.js` (controls: `jumpTo`, `scrollToY`, `stopSmoothScroll`), `components/Scroller.jsx` (`data-lenis-prevent-*`) | booted lazily by `lib/motionBoot.js` after first paint, fine pointers + motion only |
| CSS only | `Reveal` (one shared IntersectionObserver, inline transition 8px/0.4s), `.sd-reveal`, route fade, `interactions.css`, `pointerFx.css` + `lib/pointerFx.js` (magnetic CTA ≤5px, card tilt ≤3deg, spotlight) | |
| Reduced motion | `prefers-reduced-motion` or `html[data-motion="reduced"]` (footer switch) zero `--dur-*`/`--shift-*`; every component renders its end state | prerender runs reduced |

### 4.5 i18n
- `lib/i18n.jsx` (87 lines): `LangProvider` derives `lang` from the path (`/ta` prefix). `useLang()` returns
  `{ lang, t(en, ta), pick(obj, field), localePath(path), switchPath, basePath }`. `t()` falls back to English;
  `joinTamilSuffix` keeps "StartNet-இல்" together. `T` component and `contentLangFor()` mark English fallbacks
  `lang="en"`; `AutoContentLang` does it shell-wide.
- Data objects carry `<field>Ta` twins (`labelTa`, `titleTa`, …). Every internal link must go through `localePath()`.
- Tamil CSS: `:lang(ta)` display ×0.85 (`--text-display-xl` etc.), zero tracking, leading 1.25/1.35/1.8, no serif accent,
  no uppercase, 14px minimum, `overflow-wrap: anywhere` on headings, desktop nav only ≥1280 (`desktopNavQuery`).
  Any new type scale needs its Tamil twin in tokens.css L204-219 and L281-289.

### 4.6 Photos
- `ArtImage` (every image slot). Resolution order: `data/imagePlan.js` `planFor(path, slot)` (curated per route/slot) →
  `photo` prop / `photoPool` → themed library `allocateLibraryPhoto` in `data/photos.js` (no repeat on a page:
  `markPhotoUsed`, `hintFixedPhoto`). Portraits never take library photos.
- `data/photos.manifest.json`: 206 entries keyed `event/<series>/<edition>`, `pool/<theme>/<n>`, `person/<slug>`, each
  `{ base, widths [480, 800, 1200, 1280], jpgWidths, formats [webp, jpg], width, height, alt, caption, captionTa, credit }`;
  files in `client/public/photos/`, produced by `npm run photos` (`tools/images/photos.mjs`) with the warm faded mono
  grade (`tools/images/photo-grade.json`). `PhotoGradeFilter` (`#sn-photo-grade` SVG filter) grades YouTube posters.
- User rules (memory): warm faded mono grade, Indian people only, StartNet Gallery photos first, no animated art.

### 4.7 Prerender, SEO and platform constraints
- `tools/seo/prerender.mjs` renders every sitemap URL (EN + TA, 440 pages last run) in headless Chrome **with reduced
  motion** and saves `client/dist/prerender/<path>.html`; `server/src/common/spa.ts` serves it inside
  `#sn-prerender`; `main.jsx` renders the live app invisibly (`#root.is-prerender-pending`) and swaps once it has an
  `<h1>` and ~90% of the text. Consequences: every page needs exactly one `<h1>`; no text may exist only after
  interaction or only on the client; hidden initial states must be inline `opacity:0` set on the client (stripped by
  the prerender) or CSS keyframes scoped to `no-preference`; `html[data-from-snapshot]` suppresses hero entrances on
  the first page (base.css L207-215 lists the hero animation classes; new hero animation classes must be added there).
- `Seo` component on 74 pages (title/description EN+TA, canonical, hreflang, JSON-LD). Site-wide JSON-LD and the
  default description are in `client/index.html` (`theme-color` `#0C1719`).
- Production CSP (`server/src/main.ts` L54-70): `script-src 'self'` (no inline script), `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:` (**no Google Fonts or CDN fonts: self-host woff2 in `styles/fonts/`**), `img-src 'self' data:
  https://i.ytimg.com` (no hot-linked images), `connect-src 'self'`, frames only youtube-nocookie and google maps.
- `vite.config.js` `preloadFonts()` plugin preloads Inter latin; any font change must update it and `fonts.css`.
- Build: `npm run build` = client + server + prerender (needs Chrome). Deploy: push to `main` of the live repo = live
  (Coolify). Budget rule from DESIGN-v2: entry chunk +3 KB brotli max; Home is in the entry bundle.

---

## 5. Redesign order and file ownership

### 5.1 Rules for every group
1. Do not rename or remove props, class names targeted by other groups, `data-*` hooks (`data-surface`, `data-brand`,
   `data-primary-cta`, `data-lenis-prevent*`, `data-current`), or runtime variables (`--shell-offset`, `--sbw`,
   `--bottom-cta-h`, `--consent-h`). New props must be optional with today's behaviour as the default.
2. Keep `:root`-prefixed selectors where a page CSS file could otherwise win; keep one `<h1>`; keep reduced-motion end
   states; keep Tamil twins; keep all strings, links and nav items unless the user approves changes.
3. Values only through tokens; no hex in component or page CSS (62 legacy hex values exist; do not add more).
4. Each group verifies at 375, 768, 1024, 1440, plus one `/ta` route, light and reduced motion.

### 5.2 Groups (disjoint)

| Group | Owns (exclusive write) | Reads / contract |
|---|---|---|
| **G1 Foundation** (runs first, alone) | `styles/tokens.css`, `styles/base.css`, `styles/theme.css`, `styles/fonts.css`, `styles/fonts/*`, `styles/interactions.css`, `styles/pointerFx.css`, `lib/pointerFx.js`, `client/index.html` (theme-color/meta only), `client/vite.config.js` (font preload only) | Publishes the new type scale (Techstars sizing), spacing, container, radii, ground rules (hero band + sheet rise keep/drop), Tamil twins; keeps every existing token name resolving (alias old names to new values) |
| **G2 Header chrome** | `layout/Header.*`, `layout/UtilityBar.*`, `layout/MegaMenu.*`, `layout/MobileDrawer.*`, `layout/LanguageSwitch.*`, `layout/MinimalHeader.*`, `layout/SearchOverlay.*`, `layout/BrandSubNav.*`, `layout/BrandLayout.jsx`, `layout/SiteLayout.*`, `layout/shell.jsx`, `layout/ScrollManager.jsx`, `layout/AutoContentLang.jsx`, `layout/motionFeatures.js`, `components/Logo.*`, `components/BrandLockup.*`, `components/_indicator.js` | `data/nav.js`, `data/brands.js`, `layout/megaCtas.js` read-only. Must keep `--shell-offset`, `sn:header`, the JS height constants in sync with `--header-h*`/`--utility-h` |
| **G3 Footer + closing chrome** | `layout/Footer.*`, `layout/MotionSwitch.*`, `layout/BottomCtaBar.*`, `layout/ConsentBanner.*`, `layout/BackToTop.jsx`, `components/CTABand.*`, `components/NewsletterForm.*`, `components/WhatsAppButton.*` | `.back-to-top` CSS lives in `styles/interactions.css` (G1): G3 sends changes to G1 or G1 moves the block into a new `layout/BackToTop.css` first |
| **G4 Kit: primitives, heroes, forms, motion** | `components/Button.*`, `Section.*`, `SectionHeader.*`, `PageHero.*`, `BrandHero.*`, `KineticHeadline.*`, `Dot.*`, `_accent.jsx`, `Breadcrumbs.*`, `Badge.*`, `TagChip.*`, `Tabs.*`, `Accordion.*`, `Steps.*`, `Ladder.*`, `Stat.*`, `FactBand.*`, `KeyFacts.*`, `Reveal.*`, `ScrubText.*`, `ClipReveal.*`, `FeatureTabs.*`, `PulliTimeline.*`, `Field.*`, `SmartForm.*`, `ConsentCheckbox.*`, `FormSuccess.*`, `formUtils.js`, `Placeholder.*`, `InlineMarks.jsx`, `Skeleton.*`, `EmptyState.*`, `PageLoader.*`, `Actions.*`, `PillSubNav.*`, `Seo.jsx`, `_inview.js`, `_utils.js`, `index.js` | Button/Section/SectionHeader/PageHero/BrandHero APIs are used by 40-83 pages each: style-only changes, no prop changes |
| **G5 Kit: cards and media** | `components/Card.*`, `EventCard.*`, `ProgrammeCard.*`, `StoryCard.*`, `PersonCard.*`, `ReportCard.*`, `BrandTile.*`, `ArtImage.*`, `renderArt.jsx`, `_placeholders.js`, `PhotoGradeFilter.jsx`, `Scroller.*`, `LogoWall.*`, `Marquee.*`, `Quote.*`, `VideoFeature.*`, `EventGallery.*` | `data/photos.js`, `data/imagePlan.js`, manifest read-only (photo rules) |
| **G6 Home + Join** | `pages/Home.*`, `pages/home/**`, `pages/Join.*` (Join imports `home/PersonaSelector.jsx`) | |
| **G7 Brands + StartNet X** | `pages/brands/**` (incl. `brandPage.css`, `seoBits.js`), `pages/mega/brand-sub/**`, `pages/snx/**`, `pages/mega/snx-audiences/**`, `pages/mega/snx-extras/**` | `seoBits.js` is imported (data only) by Home, About, Join, districts: G7 must not change its exports |
| **G8 Events + Programmes** | `pages/events/**`, `pages/programmes/**`, `pages/mega/events-series/**`, `pages/mega/events-extra/**`, `pages/new/OpenCalls.*`, `pages/new/SpeakMentor.*`, `pages/new/callsMeta.js` | exports `events/parts/eventMeta.js` (used by Connect, Women), `programmes/parts/programmeMeta.js` (Home), `programmes/parts/seoFit.js` (9 G7/G9 pages), `new/callsMeta.js` (Search): freeze those exports |
| **G9 Insights, About, Partner, Utility** | `pages/insights/**`, `pages/about/**`, `pages/partner/**`, `pages/utility/**` (incl. `restKit.css`, `NotFound.jsx`), `pages/new/Corrections.*`, `pages/new/Districts.*`, `pages/mega/{about-districts,insights-ledger,insights-reports,media-careers,utility-campaign}/**` | `utility/restKit.css` is visual and also imported by SNX pages (`snx/StartNetX.jsx`, `snx/Pricing.jsx`, `mega/snx-audiences/SnxAudiencePage.jsx`, `mega/snx-extras/Agents.jsx`): G9 owns it, changes there must be additive or G7 re-checks those 4 pages. `NotFound.jsx` is rendered as a fallback by 10 G7/G8 pages. Optional split: G9a Insights (insights, insights-ledger, insights-reports, Corrections) and G9b About/Partner/Utility (rest) |

Not owned by anyone in a visual pass (read-only): `App.jsx`, `main.jsx`, `lib/i18n.jsx`, `lib/handover.js`,
`lib/smoothScroll*.js`, `lib/motionBoot.js`, `lib/seo.js`, `lib/links.js`, `hooks/*`, `data/*`, `server/**`,
`tools/**`. If a route or nav change is approved, give `App.jsx` + `data/nav.js` to G2 only.

### 5.3 Dependencies and phases

```
Phase 0   G1 Foundation  (tokens, base, theme, fonts)            ── must land first
             │
Phase 1   G2 Header ── G3 Footer/CTA ── G4 Kit primitives ── G5 Kit cards     (parallel; depend on G1 only)
             │            │                 │                     │
Phase 2   G6 Home   G7 Brands+SNX   G8 Events+Programmes   G9 Insights/About/Partner/Utility   (parallel)
```

- G2, G3, G4, G5 depend on G1 only. G5 reads G4's `Button` and `Badge` look but not its files.
- G6-G9 depend on G1 + G4 + G5 (they restyle around kit output and must delete page CSS that overrides the kit:
  `.button*` 54 rules, `.card*` 60, `.page-hero*` 39, `.brand-hero*` 30, `.stat*` 83, `.art-image*` 62). They can start
  layout work once G1 lands, but final visual QA waits for Phase 1.
- G6 also depends on G3 (`CTABand` closes Home) and G5 (`Scroller`, `EventCard`, `StoryCard`, `BrandTile`, `LogoWall`).
- G7 depends on G2 (`BrandLayout`/`BrandSubNav`) and G4 (`BrandHero`).
- A final integration pass (one agent) runs `npm run build` (client + server + prerender), the existing audits in
  `tools/audit/agents/r6-tablet/grid3.mjs` and `r7-images/slots.mjs`, and a 320 / 390 / 768 / 1024 / 1440 + `/ta` sweep.

### 5.4 Gotchas found during the survey
- Header JS hard-codes bar heights (Header.jsx L98-99); `--header-h` is used by 72 page-CSS lines and
  `--shell-offset` by 37 files; `html { scroll-padding-top: calc(var(--header-h) + var(--subnav-h) + 16px) }`.
- `theme.css` forces Ink on `.home-hero`, `.page-hero`, `.brand-hero` and rounds the next sibling; a light-hero design
  (Plug and Play style) has to change those two rules in G1 and `PageHero.css`/`BrandHero.css` in G4 together.
- `base.css` L119-152 tablet grid rules reach into `.card`, `.card__media`, `.card--framed` (G5 classes) from G1 files.
- `interactions.css` styles `.mega-menu` items (G2) and `.back-to-top` (G3); `pointerFx.css` styles `.card--link`,
  `.brand-tile`, `.button--primary` (G4/G5). Keep class names stable or coordinate.
- `PillSubNav` and `Actions` are effectively dead, but theme.css still targets `.pill-subnav` in the sheet-rise rule.
- `docs/DESIGN-v2.md` §8 and its Foundation API section are out of date on a few values (see §1); this file reflects
  the code as of `c47f703`.
