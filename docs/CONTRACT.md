# StartNet website — build contract

All agents build against this file. If you need something not listed, build it **inside your own files** (page-local component) rather than editing another agent's files.

Source books (read the sections relevant to your task; they are long — use grep / line ranges):
- `C:\Users\rhaml\Downloads\StartNet_Website_Book1_Strategy_Architecture_Menus.md` — strategy, sitemap, mega menus (Part B §3), brand sub-nav (§4), templates (§6), content model (§8), flows (§9), filters (§10)
- `C:\Users\rhaml\Downloads\StartNet_Website_Book2_Website_Content.md` — **page-by-page copy. Use this copy verbatim where it exists.** §1 Home, §2 Who we are, §3 Our brands (Research/Vibe/Connect/Women + sub-pages), §4 Programmes, §5 Events, §6 Insights, §7 StartNet X, §8 Partner, §9 Media, §10 Careers, §11 Contact, §12 404, §13 Forms/consent/errors, §14 Tamil versions
- `C:\Users\rhaml\Downloads\StartNet_Website_Book3_Brand_Identity_and_UI_Design_System.md` — identity, colour, type, components C01–C46 (Part B §3), templates layout (Part B §4)
- `C:\Users\rhaml\Downloads\StartNet_Website_Book4_Interaction_Animation_Imagery_Benchmarks.md` — interaction system (Part B), imagery (Part C), storyboards (Part E), **Informa.com teardown (Appendix R1)**, 30 motion patterns (R4 §5)

## Stack
- `client/` — React 18 + Vite 5 + React Router 6 (JS/JSX, no TypeScript). Motion: `framer-motion` (component motion, Tier 1) and `gsap` + `gsap/ScrollTrigger` (only on storytelling pages: Home hero sequence, Mission 1 Lakh, Our story, Vibathon). Icons: `lucide-react`. Fonts are self-hosted (`@fontsource-variable/*`), already imported in `main.jsx`.
- `server/` — **NestJS 10 (TypeScript)**, port 4000, global prefix `/api`. Vite dev server proxies `/api` → `http://localhost:4000`. In production Nest serves `client/dist` (ServeStatic) with SPA fallback.
- **No CSS framework.** Plain CSS. Tokens in `client/src/styles/tokens.css` (from Book 3 §9.3 + Book 4 R4 §4 — read it), base + utilities in `client/src/styles/base.css` (read it: `.container`, `.grid-2/3/4`, `.split`, `.stack`, `.cluster`, `.eyebrow`, `.display-2xl`, `.h1`–`.h5`, `.body-lg`, `.prose`, `.dot`, `.placeholder`, `.sd-reveal`, `.visually-hidden`).
- Each component/page has a sibling CSS file imported at the top (`import './Home.css'`). **Prefix every class with the component or page name** (`.home-hero__title`, `.vibe-tracks`) to avoid collisions. Use only token variables for colour, space, radius, shadow, durations and easing — never raw hex in components (the brand `--accent*` vars switch automatically under `[data-brand]`).

## Design rules that matter most
- Calm page, decisive point: Paper (`--color-bg`) day surfaces, **one Night band** per page max on day pages (`data-surface="night"` on the section), one red full stop per view.
- Headlines end with the red full stop where Book 2 copy has it ("Every talent, a founder."): render via `<Dot />`.
- Buttons are pills. Primary = red-600 with white. Brand buttons use `--accent-fill` / `--accent-on-fill`.
- **Every number goes through `<Stat>`** with tag A/B/C, as-at date and source. Unknown figures use the Book 2 placeholder text styled with `.placeholder` (e.g. `[placeholder — to be supplied by StartNet]`). Never invent outcomes, partner names or people. Use figures that appear in the books (tag them as the books do; planning targets are tag C).
- Partners appear only when signed: logo walls render nothing when the list is empty.
- Phone-first: single column < 768px, 44px touch targets, no horizontal page scroll at 320px.
- Motion: animate only transform/opacity/clip-path; respect `useReducedMotion()`; content is visible at rest (never leave things at opacity 0 if JS/observers fail — use framer-motion `whileInView` with `viewport={{ once: true }}` which is fine, or `.sd-reveal`).
- Informa-inspired patterns to use (Book 4 R1 §4, §9 and R4 §5): statement hero with kinetic headline (word-by-word reveal), mega menus with featured card, fact band with count-up, stacked statement sections alternating text/image, brand doors with hover lift + duotone→colour, horizontal scrollers with buttons, tabbed "updates" module, sticky sub-nav, CTA bands, hover arrow nudges, smart hide/show header.
- Imagery: there are **no photographs**. Use `<ArtImage>` (generative brand art based on the pulli dot grid / network / full stop concept, Book 3 §1, §7) wherever an image slot exists.
- Tamil: wrap user-visible strings that have a Tamil version in Book 2 §14 with `t('English', 'தமிழ்')` from `useLang()`. Internal links: use `localePath('/vibe')` for `<Link to>` so Tamil users stay under `/ta`. Everything else may be English-only.

## Shared libs (already written — import, don't edit)
- `src/lib/i18n.jsx` → `useLang()` → `{ lang, t(en, ta), localePath(path), switchPath, basePath }`
- `src/lib/format.js` → `formatNumber(n, lang)`, `formatINR(rupees)`, `formatDate(iso)`, `formatDateShort(iso)`
- `src/lib/links.js` → `snxLink(path, { src, brand, lang, ...params })`, `waLink(text, ref)`, `SNX_ORIGIN`, `WHATSAPP_NUMBER`
- `src/hooks/useApi.js` → `useApi('/api/events?status=upcoming')` → `{ data, loading, error }`; `postForm(type, payload)` → Promise
- `src/hooks/useReducedMotion.js` → `useReducedMotion()` → boolean
- `src/data/brands.js` → `BRANDS.research|vibe|connect|women|x` (`key, name, descriptor, journey, journeyTa, promise, base, subNav[], cta`) and `TALENT_BRANDS`

## Shared components — `client/src/components/` (owned by the KIT agent)
Import as `import { Button, Section, Stat } from '../components'` (adjust depth). `components/index.js` re-exports all of them. Props marked `?` are optional.

| Component | Props | Notes |
|---|---|---|
| `Button` | `variant?: 'primary'\|'secondary'\|'tertiary'\|'brand'\|'whatsapp'\|'inverse'` (default primary), `size?: 'sm'\|'md'\|'lg'`, `to?` (internal, auto-localised), `href?` (external, opens same tab, shows ↗ for SNX/external), `onClick?`, `type?`, `icon?` (lucide component, placed after label), `full?`, `disabled?`, `loading?`, `children` | Renders `<Link>`, `<a>` or `<button>`. Tertiary = text + arrow that nudges on hover. |
| `Section` | `surface?: 'paper'\|'white'\|'sunken'\|'night'`, `brand?` (sets `data-brand`), `id?`, `className?`, `width?: 'default'\|'narrow'\|'full'`, `pad?: 'default'\|'sm'\|'none'`, `children`, `labelledBy?` | `<section>` with vertical `--space-section` padding and `.container` inside. |
| `SectionHeader` | `eyebrow?`, `title`, `lede?`, `action?` (node, right-aligned on desktop), `as?: 'h2'\|'h1'\|'h3'`, `align?: 'left'\|'center'` | Animated reveal. |
| `Dot` | `animate?: boolean` | The red full stop `<span class="dot">.</span>`; when `animate`, drops in with `--ease-dot` once. |
| `KineticHeadline` | `text` (string; may end in '.' — the final full stop is rendered red), `as?` (default h1), `className?`, `delay?` | Word-by-word masked rise (Book 4 R4 pattern 2), reduced-motion = static. |
| `Reveal` | `as?`, `delay?`, `y?`, `className?`, `children` | Fade/rise on enter (once). |
| `RevealGroup` | `as?`, `className?`, `stagger?` (default 0.04), `children` | Children stagger in (cap 6). Wrap grid items. |
| `Stat` | `value` (number or string), `unit?`, `prefix?` (e.g. '₹'), `label`, `tag: 'A'\|'B'\|'C'`, `asAt?` (ISO or text), `source?`, `note?`, `variant?: 'hero'\|'default'\|'compact'`, `countUp?` (default true for numbers) | Tabular figures, Indian grouping, count-up once in view from 80%. Tag button opens a popover with source / as-at / method / link to `/about/evidence-standard`. Also accepts `metric` prop: an object from `/api/metrics` (fields below). |
| `TagChip` | `tag: 'A'\|'B'\|'C'` | A solid, B outline, C dashed. |
| `FactBand` | `metrics` (array of metric objects), `surface?: 'paper'\|'night'`, `title?`, `footnote?`, `link?: {label,to}` | 1–4 Stats in a `<dl>` grid. |
| `Badge` | `kind?: 'status'\|'brand'\|'type'\|'level'\|'lang'\|'count'`, `brand?`, `status?: 'open'\|'closing'\|'upcoming'\|'closed'\|'rolling'`, `children` | Brand badge shows accent dot. |
| `PageHero` | `eyebrow?`, `title` (string → KineticHeadline), `lede?`, `actions?` (node), `art?` (ArtImage props object or node), `surface?: 'paper'\|'night'`, `breadcrumbs?` (array), `meta?` (node, e.g. badges/key facts) | Statement hero, 6/6 split on desktop when art present. |
| `BrandHero` | `brand` (key), `title`, `lede?`, `actions?`, `art?`, `meta?`, `endorsement?` (e.g. "a StartNet Vibe programme"), `compact?` | Lock-up + journey line + accent sweep. Must be inside a `data-brand` scope (BrandLayout provides it). |
| `BrandLockup` | `brand` (key or null for masterbrand), `size?: 'sm'\|'md'\|'lg'`, `reversed?` | "StartNet." with red dot + descriptor in accent. |
| `Logo` | `reversed?`, `size?` | Masterbrand "StartNet." wordmark. |
| `Breadcrumbs` | `items: [{label, to?}]` | Home is prepended automatically. Mobile shows back link only. |
| `ArtImage` | `variant?: 'grid'\|'network'\|'dot'\|'kolam'\|'ladder'\|'portrait'\|'map'`, `brand?` (accent), `ratio?: '16/9'\|'4/5'\|'3/2'\|'1/1'\|'21/9'`, `label?` (visible caption in corner, e.g. "Vibathon 2025, Madurai"), `alt?`, `night?`, `seed?` (number, varies composition), `animate?` | Generative SVG/CSS art, lightweight, deterministic by seed. Used for all image slots. |
| `Card` | `to?`, `href?`, `brand?`, `eyebrow?`, `title`, `body?`, `meta?` (node), `art?` (ArtImage props), `footer?`, `className?` | Whole card is one link (pseudo-element). Hover lift 4px + shadow-2. |
| `BrandTile` | `brand` (key), `stat?` (metric object) | Brand door for home/brands hub: accent top rule, lock-up, journey, promise, CTA "Explore …". |
| `ProgrammeCard` | `programme` (object from API) | Brand chip, status chip, title, `L2 → L3`, format, language, price, apply-by, CTA. |
| `EventCard` | `event` (object from API) | 16:9 art, date block, title, district, format, price, brand chip. |
| `StoryCard` | `story` (object from API) | Type chip, title, outcome stat, ladder level, reading time. |
| `PersonCard` | `person: {name, nameTa?, role, org?, brand?, initials?}` | Portrait = ArtImage `portrait` with initials. |
| `ReportCard` | `report` (object from API) | |
| `Accordion` | `items: [{id?, question, answer (node or string)}]`, `faq?` (emit FAQPage JSON-LD) | Disclosure pattern. |
| `Tabs` | `tabs: [{id, label, content (node)}]`, `defaultTab?`, `label` (aria) | WAI-ARIA tabs, sliding indicator. |
| `Steps` | `steps: [{title, body, icon?}]`, `variant?: 'row'\|'engines'` | `<ol>` numbered. |
| `Ladder` | `levels?` (defaults to L1–L7 from Book 1/2), `variant?: 'vertical'\|'horizontal'\|'compact'`, `current?` | Founder ladder L1–L7. |
| `Quote` | `quote`, `name`, `role?`, `place?`, `date?` | |
| `CTABand` | `title`, `body?`, `actions` (node), `surface?: 'paper'\|'night'\|'accent'`, `brand?` | Full-width call-to-action band. |
| `Scroller` | `label` (aria), `children` (items), `itemWidth?` (css) | Horizontal snap scroller with prev/next buttons (no auto-advance). |
| `Marquee` | `items` (nodes), `speed?` | Pauses on hover/focus, has pause button; grid under reduced motion. |
| `LogoWall` | `partners` (array) | Renders `null` when empty. |
| `KeyFacts` | `items: [{label, value (node)}]`, `title?`, `action?` | `<dl>` aside for programme/event pages (sticky on desktop). |
| `Field` | `id`, `label`, `hint?`, `error?`, `type?: 'text'\|'email'\|'tel'\|'textarea'\|'select'\|'checkbox'`, `options?` ([{value,label}]), `required?`, `value`, `onChange(value)`, `autoComplete?` | Labelled input with inline error. `tel` shows +91 prefix. |
| `ConsentCheckbox` | `id`, `purpose` ('newsletter'\|'whatsapp_updates'\|'contact'\|'partner'), `checked`, `onChange(bool)`, `children` (label text) | Unticked by default, links to `/legal/privacy`. |
| `SmartForm` | `type` (form type for `postForm`), `fields` (array of Field props without value/onChange, + `name`), `consents?` ([{purpose, label, required?}]), `submitLabel`, `successTitle`, `successBody?`, `hidden?` (object merged into payload), `className?` | Full form with validation on blur, error summary, loading state, success state with check draw + full stop landing. Posts to `/api/forms/:type`. |
| `NewsletterForm` | `compact?`, `night?`, `defaultTopics?` | Email + topic chips (Ledger, Vibe, Connect, Women, Research) + separate unticked WhatsApp box. |
| `WhatsAppButton` | `text`, `refCode?` (context ref; alias `contextRef` — React reserves `ref`), `label?`, `iconOnly?`, `size?` | Uses `waLink`. Pages may also use `Button variant="whatsapp" href={waLink(text, ref)}`. |
| `Placeholder` | `children` | `<span class="placeholder">`. |
| `InlineMarks` | `text` | Renders seed copy with inline `[A]/[B]/[C]` as `TagChip` and other `[…]` as `Placeholder` (used by ProgrammeCard/EventCard for `priceNote`, `dateLabel`). |
| `Seo` | `title`, `description?` | Sets `document.title` to `${title} · StartNet` and meta description. |
| `PageLoader` | — | Suspense fallback (minimal pulsing full stop). |
| `EmptyState` | `title`, `body?`, `action?` | Dot-grid illustration. |
| `Skeleton` | `height?`, `count?` | |

## Layout — `client/src/layout/` (owned by the SHELL agent)
- `SiteLayout.jsx` — skip link, `UtilityBar`, `Header` (main bar + 7 mega menus + search trigger), `<main id="main"><Outlet/></main>`, `Footer`, `MobileDrawer`, `BottomCtaBar`, `SearchOverlay`, `ConsentBanner`, `ScrollManager` (scroll to top + focus `<h1>` on route change), reduced-motion switch.
- `BrandLayout.jsx` — props `brand`; renders `<div data-brand={brand}>` + sticky `BrandSubNav` + `<Outlet/>`.
- `src/data/nav.js` — mega menu data (Book 1 Part B §3.2), footer columns (§3.8).
- Pages render **only** their own content (no header/footer).

## Pages — `client/src/pages/` (owned per agent; file paths fixed by `App.jsx`)
Each page file default-exports a component, starts with `<Seo title=… />`, and has exactly one `<h1>`. Brand sub-pages (`ResearchSub`, `VibeSub`, `ConnectSub`, `WomenSub`) read `useParams().slug` and render the matching sub-page from a local content map; unknown slug → render `NotFound` content (import `../../utility/NotFound.jsx`).
Programme/event/story detail pages read `slug` and fetch `/api/programmes/:slug` etc.

## API — NestJS (`server/`), owned by the SERVER agent
All responses are JSON. Data lives in `server/data/*.json` (seeded from the books). Forms are appended to `server/storage/submissions.jsonl` (gitignored).

| Method & path | Returns |
|---|---|
| `GET /api/health` | `{ ok: true, time }` |
| `GET /api/metrics?brand=&key=` | `Metric[]` |
| `GET /api/programmes?brand=&status=&stage=&format=&language=&price=` | `Programme[]` |
| `GET /api/programmes/:slug` | `Programme` (404 `{message}`) |
| `GET /api/events?brand=&when=upcoming\|past&district=&format=&series=` | `Event[]` sorted by date |
| `GET /api/events/:slug` | `Event` |
| `GET /api/stories?brand=&type=` · `GET /api/stories/:slug` | `Story[]` / `Story` |
| `GET /api/reports` | `Report[]` |
| `GET /api/people?group=leadership\|brand-leads\|advisory` | `Person[]` |
| `GET /api/partners` | `Partner[]` — **only** `agreementStatus: 'signed'` records (may be `[]`) |
| `GET /api/careers` | `Role[]` |
| `GET /api/press` | `PressItem[]` |
| `GET /api/ledger` | `{ period, asAt, kpis: Metric[], byBrand: [...], byDistrict: [...], corrections: [...] }` |
| `GET /api/search?q=` | `{ results: [{type, title, url, brand?, snippet}] }` across programmes, events, stories, reports, pages |
| `POST /api/forms/:type` (`contact`, `enquiry`, `newsletter`, `join`, `interest`, `nomination`, `host`, `speak`) | `201 { ok: true, id, message }` or `400 { message, fieldErrors: {field: msg} }`. Validates email/phone; rejects if a required consent is missing; logs consent purpose + version + timestamp. |

### Data shapes
```
Metric    { id, key, value: number|null, unit?, prefix?, label, tag: 'A'|'B'|'C', asAt: 'YYYY-MM-DD', source, sourceType?, note?, brand? }
Programme { slug, title, brand, summary, status: 'open'|'closing'|'upcoming'|'closed'|'rolling', applyBy?: ISO, stageEntry: 'L1', stageExit: 'L2', format: 'online'|'in-person'|'hybrid', languages: ['en','ta'], price: 'free'|'paid'|'sponsored', priceNote?, duration?, need: 'learn'|'start'|'raise'|'customers', eligibility?: string[], outcomes?: string[], ctaLabel, snxPath }
Event     { slug, title, series?, brand, date: ISO, endDate?, city, district, venue?, format, language, price: 'free'|'paid', priceNote?, seats?: 'available'|'few'|'full', status: 'upcoming'|'past', summary, agenda?: [{time, title, speaker?}], outcomes?: Metric[] }
Story     { slug, title, brand, type: 'founder'|'partner'|'recap', person?, district?, ladderFrom?, ladderTo?, programme?, readingMinutes, excerpt, body: string[] (paragraphs), outcome?: Metric, date }
Report    { slug, title, kind: 'ledger'|'report'|'index', year, status: 'published'|'upcoming', summary, keyFindings?: Metric[], formats?: [{lang, format, size}] }
Person    { slug, name, nameTa?, role, org?, brand?, group, bio? }
Partner   { slug, name, type, since, agreementStatus, logoPermission }
Role      { slug, title, team, location, type, summary, applyUrl? }
PressItem { slug, title, outlet?, date, kind: 'release'|'coverage', url? }
```

## Brand page agents — the four talent brands
Brand pages live under `BrandLayout` (sub-nav + `data-brand`). Use `BrandHero`, accent tokens, Book 2 §3 copy for the brand home and every sub-page listed in `BRANDS[x].subNav`. Each brand home should feel distinct (own signature interaction) while using the shared grammar:
- Research — lab bench / problem statements; term-sheet split visual (founders 78%, ESOP 10%, institution 7%, StartNet 5%, subject to legal review).
- Vibe — energetic, campaign louder accent; Vibathon page uses Night + Vibe accent, countdown, tracks, endorsement line "a StartNet Vibe programme".
- Connect — sector series grid (GenAI, SaaS, D2C…), Founder Switch go/no-go, Circles.
- Women — Circles, Rise Academy, HerCapital, schemes (TANSEED women-led ₹15 L, Vetri Magalir), weekend formats, Tamil-first copy where available.

## Definition of done for every agent
- Files only in your owned paths.
- `npm run build` in `client/` must compile your files (imports resolve, valid JSX). If the KIT is not yet written when you start, still code to this contract exactly.
- No `console.log`, no lorem ipsum, no invented names/figures.

## Kit additions (fix round 1) — all optional and backward compatible
- `lib/i18n.jsx`: `useLang()` now also returns `pick(obj, field)` → `obj[field + 'Ta']` on /ta when present, else `obj[field]`. Standalone: `pickLang(obj, field, lang)`, `tFor(lang)`, `joinTamilSuffix(s)`. `t()` and `<T>` turn "StartNet-இல்" / "StartNet X-இல்" / "WhatsApp-இல்" into a non-breaking hyphen (U+2011) so the Tamil suffix never wraps alone. Kit cards use `pick` for `title`, `summary`/`excerpt`, `dateLabel`, `city`, `district`, `priceNote`, `duration`, `role`, `org`; Stat for `label`, `note`, `source`; BrandTile for `promise`.
- `lib/format.js`: `formatNumber(n, lang)`, `formatINR(rupees, lang)` (Tamil: "₹6 கோடி", "₹15 லட்சம்"), `formatDate(iso, opts, lang)` (also `formatDate(iso, lang)`), `formatDateShort(iso, lang)`; Latin digits always. Hook: `useFormat()` → `{ lang, formatNumber, formatINR, formatDate, formatDateShort }` bound to the page language.
- `lib/motionFeatures.js`: default export `domAnimation` (for an app-level `<LazyMotion features={() => import('./lib/motionFeatures.js').then((r) => r.default)}>`, no `strict`) and `MotionFeatures` (kit-local provider). Kit components use `m.*`, not `motion.*`.
- `Seo`: `titleTa?`, `descriptionTa?` (used on /ta). Also sets `<link rel=canonical>` (origin + path, no query), hreflang `en`/`ta`/`x-default`, `og:url`, `og:locale` (`en_IN`/`ta_IN`), and restores the default description when a page passes none. Origin: `VITE_SITE_ORIGIN` (default `https://startnet.in`).
- `components/formUtils.js`: `messagesFor(lang)`, `validateField(f, value, values, lang)`, `messageForCode(code, label, lang)`, `readServerFieldError(entry, code)`. Tamil messages never wrap the label in an English sentence. SmartForm/NewsletterForm show the localised client text for a server `fieldErrors` code (value `{ code, message }`, or a parallel `fieldErrorCodes`/`codes` map).
- `SmartForm`: `brand?` (submit uses `variant="brand"`; auto-detected from an enclosing `[data-brand]` when omitted). A field's `id` is used for its input and error-summary link.
- `Field`: the built-in empty "Choose…" option is rendered only when `options` has no `value: ''` entry.
- `Button`: `shortLabel?` (shown instead of the label below 400px). `WhatsAppButton` puts its icon after the label.
- `BrandHero`: `sweep?` (default true). The sweep is hidden automatically under the brand sub-nav.
- `Stat`: `asAt` is shown as "as at <date>" only when it is a date (ISO, "Oct 2026", "2026", "FY 2025-26", "Q3 2026"); other text ("Planning assumption") renders as a plain qualifier. Tag button name starts with its visible text ("B Claimed: confidence, …").
- `_utils.js` exports `formatLabel(key, lang)`, `priceLabel(key, lang)`, `langList(langs, lang)`, `ctaLabelFor(label, labelTa, lang, fallback)` (+ `CTA_TA` dictionary of the API CTA labels), `dateLike(s)`, `PLACEHOLDER_TEXT_TA`; `TAG_META` and `LADDER_LEVELS` carry `*Ta` fields.

## Kit additions (fix round 2) — all optional and backward compatible
- `Placeholder.jsx` exports `localiseMarkParts(text, lang)` → `{ mark }` or `{ prefix, note, suffix }`. On /ta the recurring English notes inside `[placeholder — …]` (incl. `…; indicative ₹X–Y`, `X to be supplied by StartNet`) are translated by a kit note map; a note with no Tamil form renders inside `<span lang="en">`. Data may keep English notes in `*Ta` strings. `localiseMark()` still returns a string.
- `lib/format.js` exports `dateFormat(lang, opts)`: a cached `Intl.DateTimeFormat` (lang `'en'|'ta'` or a locale). `formatNumber`/`formatDate` now reuse cached formatters (same output).
- Mounting kit components never forces a synchronous layout: `ArtImage` (IntersectionObserver only), `Tabs` (static indicator until ResizeObserver's first report), `Scroller` and `Marquee` (ResizeObserver's first report) — F-14.
- `.tag-pop__button` is at least 24×24 px (WCAG 2.5.8) with a 44px-tall transparent hit area; the 22px chip keeps its visual size. Tamil `.tag-chip` has no letter-spacing.
