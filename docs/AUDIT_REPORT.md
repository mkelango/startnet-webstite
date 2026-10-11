# StartNet website: end-to-end audit report

Date: 5 October 2026
Build verified: client `vite build` and server `nest build` from the current source tree (both pass).
Verification server: a second production instance (`NODE_ENV=production`, port 4100) running the new server code. It served the same `client/dist`, and it was stopped after the checks. The :4000 server was left running and was not restarted. It serves the new client build from disk but **still runs the old server code**, so the server fixes (M-96 to M-102) need `npm run build` in `server/` (already done) and a restart of :4000 before they go live.

---

## 1. Scope

| Area | What was covered |
|---|---|
| Routes | 126 English routes (`tools/audit/out/routes-verify.json`), including the 4 new pages. 20 Tamil (`/ta`) routes (`out/shard-ta.json`). A BFS link crawl from `/`, `/ta` and `/sitemap` reached **402 pages**. |
| Viewports | mobile-sm 320×640, mobile 375×812, mobile-lg 430×932, tablet 768×1024, tablet-land 1024×768 (touch), laptop 1280×800, desktop 1440×900 |
| Static checks per page × viewport | Horizontal overflow, tap targets under 32px, invisible text (opacity < 0.05), clipped headings and buttons, h1 count, console errors, page errors, failed requests, "not found" render, unnamed buttons and links |
| Controls exercised (headless Chrome) | Mega menu: hover open, close on leaving, Esc returns focus. Mobile drawer: open, section toggle, Esc. Skip link and Tab focus ring. Confidence-tag popovers: open, position, Esc. Network-graph legend: tap and click. Filter sheet: open, focus trap, inert page, Esc, "Show N" hit test. Facet dropdowns: every facet on /events and /programmes at 1024 and 1280. Term-sheet Table view. Event tabs and Back. Back-button scroll restore. `/events#host` from another page. Newsletter submit (request intercepted, nothing stored). Search page in English and Tamil. Vanity redirects. Bottom CTA bar on 16 routes. Tamil consent banner on first visit. Pinned home story header state. |
| Server/API | `/api/search` (English, Tamil, `q[a]=1`), forms (bad JSON, `__proto__`, newsletter opt-out), unknown API path, missing asset, unknown deep route, vanity 301s, `robots.txt`, CSP and cache headers |
| Performance | LCP and CLS on 7 key routes, throttled to 4G with a 4× CPU slowdown on a mobile viewport (same script as the original audit) |

## 2. Method

1. **Initial audit.** Parallel agents for mobile, tablet, desktop, Tamil, links, click-through, performance/accessibility and a general bug hunt. Their findings were triaged into 106 tasks (M-01 to M-106) across 11 fix buckets.
2. **Fix.** One fixer per bucket, each tested on its own throwaway dev or preview server.
3. **Verify.** A fresh production build, a link crawl and layout crawl over every route and viewport, and targeted functional probes for each high and medium task. Screenshots were reviewed by eye for the pages with the most findings. Any remaining gaps were fixed, rebuilt and checked again.

Scripts and raw results:
- `tools/audit/agents/verifier/`: `probe.mjs` → `probe.json`, `layout.mjs` → `out/en-*.json` and `out/ta-*.json`, `perf.mjs` → `perf.json`, `extra.mjs`, `elshot.mjs` → `out/shots/`
- `tools/audit/out/links.json`: the link crawl (the pre-fix crawl is kept in `out/before/`)

## 3. Before and after metrics

| Metric | Before | After |
|---|---|---|
| Pages reached by link crawl | 330 | 402 |
| Broken internal links (route renders "not found") | 8 routes (4 pages plus their `/ta` mirrors), from 29 dead menu, footer, search and bottom-bar links including missing anchors | **0** |
| Pages with console errors or failed requests (link crawl) | 4 (404 on `/api/programmes/open-calls` and `/api/events/speak`) | **0** |
| Pages with h1 ≠ 1 | 0 | 0 |
| Malformed external URLs (two `?`) | StartNet X links on 3 programme pages | **0** of 674 unique external URLs |
| Static horizontal overflow, 126 EN routes × 7 viewports | 0 | **0** |
| Static horizontal overflow, 20 `/ta` routes × 4 viewports (320, 375, 1024, 1440) | n/a | **0** |
| Overflow caused by interaction (popover, Table view, facet dropdown, Tamil consent) | 4 cases (M-01, M-63, M-77, M-29) | **0** |
| Page errors, all layout runs | 0 | 0 |
| Invisible text | Vibathon icons, Vibe Academy art, Women arc, L1 ladder label, home story steps | 1 flag only: the focus-revealed "Skip the animation" link (intended) |
| Real tap targets under 24px on touch viewports | Footer, breadcrumbs, sub-nav chips, legal TOC, index links, contact links and more | **0** (the remaining flags are stretched-link cards, `::after` hit areas, visually hidden inputs and the honeypot field) |
| LCP, throttled mobile: `/` | 12.5 s | **1.6 s** |
| LCP: `/vibe` · `/vibe/vibathon` · `/programmes` | 6.8 · 5.8 · 6.9 s | **2.0 · 1.9 · 1.6 s** |
| LCP: `/insights/founder-ledger` · `/women` · `/ta` | 5.9 · 8.2 · 9.1 s | **1.8 · 1.9 · 1.8 s** |
| CLS on first load (same 7 routes) | 0.27–0.35 (the footer jumped under the page loader) | **0.000–0.021** |
| Brand web fonts actually used | No (the token names did not match) | Yes: Inter, Noto Sans Tamil and Anek Tamil load |

Bytes transferred went **up** from about 200–370 KB to 395–445 KB per first page view. That is because the brand fonts now load (182 KB of woff2 on English pages). See the recommendations in section 7.

## 4. Summary by severity and category

| Severity | Tasks | Verified fixed | Partly fixed / open |
|---|---|---|---|
| High | 19 | 19 | 0 |
| Medium | 44 | 42 | 2 (M-37, M-83) |
| Low | 43 | 41 | 2 (M-47 by decision, M-102 metrics part needs data) |
| **Total** | **106** | **102** | **4** |

| Category | Tasks |
|---|---|
| Navigation, links and shell (menus, drawer, sub-nav, bottom bar, consent, scroll) | M-28 – M-41, M-42 |
| Responsive layout and grids | M-04, M-06, M-19 – M-22, M-24, M-46, M-50, M-52, M-54, M-59, M-60, M-63, M-66, M-67, M-69, M-75, M-79, M-83, M-84, M-87 – M-89, M-91, M-93, M-95 |
| Interaction bugs and glitches (animations, popovers, filters, tabs, history) | M-01, M-17, M-18, M-55, M-62, M-65, M-70, M-71, M-73, M-74, M-76, M-77, M-80 – M-82 |
| Forms and API | M-03, M-10, M-14, M-15, M-92, M-96, M-98 – M-100 |
| Accessibility (targets, focus, contrast, language, semantics) | M-09, M-12, M-16, M-23, M-26, M-40, M-45, M-51, M-53, M-58, M-61, M-86, M-90, M-94 |
| Performance | M-11, M-13, M-43, M-47, M-56, M-69 (part) |
| Tamil | M-07, M-12, M-29, M-34, M-45, M-97 |
| Content and data | M-02, M-27, M-57, M-68, M-72, M-85, M-90, M-102 |
| Missing pages and routes | M-42, M-103 – M-106 |
| Server hardening | M-49, M-99, M-101 |

## 5. Every finding and its status

"Verified" means the verifier re-checked it on the production build. "Fixer-verified" means it was checked by the fixer on their own server, and the verifier's checks on the final build found no regression.

### Kit (shared components)

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-01 | high | Confidence-tag popover overflowed 320px, got clipped or overpainted, and stayed open | **Fixed (verified).** Portalled with fixed positioning. At 320 on /insights, /careers and /women the panel stays inside 16–304px, is the topmost element and leaves no page overflow. Esc closes it and returns focus to the tag. |
| M-02 | high | `snxLink()` built URLs with two `?` | **Fixed (verified).** 0 bad URLs on the 3 pages; 0 of 674 site-wide. |
| M-03 | high | Newsletter sent `whatsapp:false`, which was read as the phone field | **Fixed (verified).** The payload now carries `whatsappOptIn:false`. The server returns 201 for an opt-out sign-up. |
| M-04 | medium | Compact ladder labels collided | Fixed (fixer-verified at 320/375/430) |
| M-05 | medium | Stat unit at 7.9px | Fixed (fixer-verified, now 12.1px) |
| M-06 | medium | Event facts separator dots dangled | Fixed (fixer-verified) |
| M-07 | medium | Tamil CTA buttons wrapped to 3–4 lines | **Fixed (verified).** The kit fixed it globally. The verifier fixed the 2 remaining /ta/vibe/vibathon buttons (narrower card padding at ≤400px, full-width rounded buttons for Tamil). 0 buttons over 2 lines on 8 Tamil pages at 320. |
| M-08 | medium | No `[data-primary-cta]`, so the CTA showed twice | **Fixed (verified).** The bar is hidden while the hero CTA is in view on /vibe, /women, /startnet-x/modules, event detail and corrections, and appears after scrolling. |
| M-09 | medium | Ticked checkbox invisible on night surfaces | Fixed (fixer-verified) |
| M-10 | medium | SmartForm duplicate offline sends, missing honeypot, wrong 429 text | Fixed (fixer-verified with mocked API). The honeypot is rendered off-screen with `tabIndex=-1`. |
| M-11 | medium | Hero lede hidden behind Reveal, LCP 5.8–12.5 s | **Fixed (verified).** The kit fixed it for BrandHero and PageHero. The verifier fixed the /programmes hero lede and the event-detail lede and actions (transform-only entrance). LCP is now 1.6–2.0 s on all 7 measured routes. |
| M-12 | medium | English content on /ta pages not marked `lang="en"` | **Fixed (verified).** The kit marks its own components. The verifier added `layout/AutoContentLang.jsx`, which on /ta marks text blocks in `<main>` and the footer that contain Latin words and no Tamil script. Unmarked English headings went from 39/40 (/ta/research) and 42/43 (/ta/connect) to 0, and to 0 on /ta and /ta/vibe as well. The real gap is translation; see section 7. |
| M-13 | medium | Footer flashed under the loader (CLS 0.23–0.35) | **Fixed (verified).** CLS 0.000–0.021. |
| M-14 | low | useApi stale record and duplicate requests | Fixed (fixer-verified) |
| M-15 | low | Ungrammatical validation messages | Fixed (fixer-verified) |
| M-16 | low | `.button--sm` 36px on touch; WhatsApp buttons opened in the same tab | Fixed (fixer-verified, 44px on coarse pointers, `target=_blank rel=noopener`) |
| M-17 | low | Selected tab under the edge fade | Fixed (fixer-verified) |
| M-18 | low | Reveal content stayed hidden after an anchor landing | Fixed (fixer-verified) |
| M-19 | low | Steps rendered 2+1 at 640–1023 | Fixed (fixer-verified) |
| M-20 | low | Scroller cards cut mid-word on desktop | Fixed (fixer-verified) |
| M-21 | low | CTA band title larger than the H1 | Fixed (fixer-verified) |
| M-22 | low | Card header misalignment; "Lab-to- / Market" break | Fixed (fixer-verified) |
| M-23 | low | Breadcrumb links 22px | **Fixed (verified).** No longer flagged at any viewport. |
| M-24 | low | /about/leadership 10.9k px tall on phones | Fixed (fixer-verified, 6,816px) |
| M-25 | low | Badge icon wrapped above its text | Fixed in CSS. Not testable in the browser: the only instance, in the Circle finder, is not shown because there are no Circle events in the data. |
| M-26 | low | EmptyState hard-coded h3; Accordion `aria-controls` pointed at unmounted panels | Fixed (fixer-verified) |
| M-27 | low | WhatsApp number is a placeholder | **Code fixed; needs StartNet.** The number is read from `VITE_WHATSAPP_NUMBER`; the real number must be supplied. |

### Shell (header, menus, drawer, footer, bars)

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-28 | high | 29 dead links in menus, drawer, footer, search and bottom bar | **Fixed (verified).** The link crawl over 402 pages found 0 broken links. |
| M-29 | high | Tamil consent banner overflowed sideways | **Fixed (verified).** At 320 and 375 the page width equals the screen; buttons span 16–304px. Screenshot reviewed. |
| M-30 | medium | Bottom bar linked to the current page, showed on form pages and overlapped modals | **Fixed (verified).** No bar on /join, /ta/join, /contact, /partner/enquire or /events/speak (the verifier added `/events/speak` to the form-page list). The bar shows context CTAs on programme and event pages and is hidden under modals. On the corrections page the verifier changed its target from the page itself to `/contact?topic=correction`. |
| M-31 | medium | Bottom bar 73–76px when the label wrapped | **Fixed (verified).** 65px (64 plus a 1px border) on every page checked. |
| M-32 | medium | Sub-nav chips 32px; single-link "More"; Connect sector pages had no active chip | Fixed (fixer-verified) |
| M-33 | medium | Sub-nav at 1024–1279 hid the current link | Fixed (fixer-verified) |
| M-34 | medium | Tamil header squashed hamburger and chevrons | Fixed (fixer-verified). Remaining cosmetic issue: at exactly 1280 the Tamil nav labels wrap to 2 lines inside the 72px bar, with nothing squashed. |
| M-35 | medium | Mega menu never closed on leaving; diagonal swaps; focus lost | **Fixed (verified).** Hover opens. Moving onto the page closes it after 500ms. Esc returns focus to the trigger. |
| M-36 | medium | Back always landed at the top | **Fixed (verified).** /events at y=1800 → event → Back lands at y=1800. |
| M-37 | medium | Consent banner covered 41–55% of small phones; Esc did nothing; focus was lost | **Partly fixed.** Esc, focus return, `--consent-h` scroll padding and the 70vh cap on preferences are fixed. On a 320×640 first visit it still covers about 50% of the screen, because the buttons are stacked (required by M-29). Accepted trade-off; see section 7. |
| M-38 | low | StartNet X CTAs skipped lang, brand and src | **Fixed (verified).** e.g. `x.startnet.in/signup?src=subnav-x&lang=en&brand=x` |
| M-39 | low | Header reappeared during pinned snap-back | **Fixed (verified).** While `data-pin-active` is set, the header stays in one state through a full down-and-up scroll at 1440×900. |
| M-40 | low | Small shell targets | **Fixed (verified).** The verifier also made the footer ThinkTN link 44px on any coarse pointer (it was still 23px on 1024px touch tablets) and 32px on desktop. |
| M-41 | low | Drawer link text mismatches, untranslated Tamil strings, mega panels too tall | Fixed (fixer-verified) |

### Global CSS, routes and build

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-42 | high | New routes and vanity redirects | **Fixed (verified).** All 4 pages render with h1=1 in English and Tamil. `/mission`, `/ledger`, `/vibathon`, `/apply` and `/snx` redirect on the client and with a 301 from the server. |
| M-43 | high | Brand web fonts never loaded | **Fixed (verified).** `document.fonts.check` passes for Inter Variable and Noto Sans Tamil Variable. |
| M-44 | high | A failed lazy chunk blanked the site | Fixed (fixer-verified with a forced chunk 404: one reload, then an in-page error panel) |
| M-45 | low | Negative tracking on Tamil headings | Fixed (fixer-verified) |
| M-46 | low | `.grid-3` gave 4 columns at 1440 | Fixed (fixer-verified) |
| M-47 | low | Router warnings, LCP waterfall, tiny icon chunks | **Partly fixed by decision.** The flags, eager Home and a single icons chunk are done. The forced `ui` chunk was measured to add about 50 KB gzip to first load, so it was not adopted. 0 console warnings in all runs. |
| M-48 | low | `scroll-padding-bottom` ignored the consent banner | Fixed (fixer-verified) |
| M-49 | low | `/robots.txt` served as index.html | **Fixed (verified on the new server).** 200 `text/plain`. No sitemap.xml exists yet. |

### Home and About

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-50 | medium | About in-page bar gap, stale active chip | Fixed (fixer-verified) |
| M-51 | medium | Join flow dropped focus to body | Fixed (fixer-verified) |
| M-52 | medium | Engine matrix headers broke mid-word | Fixed (fixer-verified). Column buttons are 29–31px wide at 320: above the 24px minimum but below 44px. |
| M-53 | medium | "Four doors" sub-links 28px | Fixed (fixer-verified, 44px) |
| M-54 | medium | L1 bar solid black; "Launched" clipped | Fixed (fixer-verified) |
| M-55 | medium | Pinned FounderStory too tall at 1024×768, low contrast, eager GSAP | Fixed (fixer-verified). The verifier confirmed `data-pin-active` toggles. |
| M-56 | low | Hero art a full screen on phones; lede hidden | **Fixed (verified).** `/` LCP is now the hero lede at 1.6 s. |
| M-57 | low | Duplicate newsletter band; footnote looked like a link | Fixed (fixer-verified). The Tamil text needs review. |
| M-58 | low | Nested `<li>` on Leadership | Fixed (fixer-verified, no validateDOMNesting warning; 0 console warnings in all runs) |
| M-59 | low | Evidence-standard headings overflowed; numeral contrast 4.35:1 | Fixed (fixer-verified) |
| M-60 | low | About grid orphans, timeline card cut | Fixed (fixer-verified) |
| M-61 | low | Governance arrows; 25px link; untranslated string | Fixed (fixer-verified) |

### Brands: Research and Vibe

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-62 | high | Vibathon icons and Academy art clip-path reveal never fired | **Fixed (verified).** Final clip-path is `inset(0 0% 0 0)` at 375 and 1440. |
| M-63 | high | Term-sheet Table view caused page scroll on phones | **Fixed (verified).** After clicking Table, scrollWidth is 320 on /research and /research/terms. |
| M-64 | medium | Sticky aside taller than the viewport; `#sponsor` anchor missing | Fixed (fixer-verified). The new "Sponsor a Lab" copy needs content review. |
| M-65 | medium | Track brief opened below the fold; Tamil button 4 lines | Fixed (fixer-verified) |
| M-66 | medium | Statement heading overflowed its box | Fixed (fixer-verified) |
| M-67 | medium | Research proof 4th stat misaligned | Fixed (fixer-verified) |
| M-68 | low | Sponsor table had no scroll cue; deck CTA opened a blank form | Fixed (fixer-verified). The Tamil label needs review. |
| M-69 | low | Grid orphans, eager GSAP, Anek on English pages | Fixed (fixer-verified) |

### Brands: Connect and Women

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-70 | high | Women rising-path arc invisible | **Fixed (verified).** clip-path `inset(0 0% 0 0)` at 1440 |
| M-71 | high | Network-graph legend could not be selected | **Fixed (verified).** Tap (375) and click (1440) both give `aria-pressed=true`; "Show all" resets it. |
| M-72 | medium | Unconfirmed dates shown as exact; Summit listed as a Circle | Fixed (fixer-verified). The Circle finder now shows its empty state, because no Circle events are in the data. |
| M-73 | medium | Scheme picker arrow keys | Fixed (fixer-verified) |
| M-74 | low | Stepper wrap and focus loss | Fixed (fixer-verified) |
| M-75 | low | Duplicate id, 3+1 grid, untranslated string | Fixed (fixer-verified) |

### Programmes and Events

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-76 | high | Filter sheet under the bottom bar; no focus trap | **Fixed (verified).** At 320, 375 and 768 the hit test on "Show N" lands on the button. 30 Tabs stay in the sheet, the page is inert and the bar is hidden. Esc closes the sheet and returns focus to "Filter". |
| M-77 | high | Facet popover ran past the right edge | **Fixed (verified).** All 11 facets at 1024 and 1280 stay inside the viewport with no page scroll. Below 1024 the sheet is used instead. |
| M-78 | medium | Detail pages needed a context bottom-bar CTA | **Fixed (verified).** Event pages show "Register your team" to `x.startnet.in/.../register?...`. |
| M-79 | medium | Sticky filter bars too tall | Fixed (fixer-verified, 53–63px) |
| M-80 | medium | Sticky aside taller than the viewport at 1024×768 and 1280×800 | Fixed (fixer-verified) |
| M-81 | medium | `/events#host` landed mid-list | **Fixed (verified).** Lands with the host form top at 136px. |
| M-82 | medium | Event tabs replaced history | **Fixed (verified).** Tab → Back returns to the previous tab state. |
| M-83 | medium | Event hero 1450–1740px on phones; facts shown twice | **Partly fixed.** Facts are de-duplicated, the poster is capped, the caption fixed and past posters show "RECAP". The hero is still 1150–1520px tall on phones because of title, lede, two actions and long placeholder fact values. Screenshot reviewed: readable, no layout faults. |
| M-84 | low | Grid orphans on related, past and month groups | Fixed (fixer-verified) |
| M-85 | low | Events copy and labels | Fixed (fixer-verified) |
| M-86 | low | Index links 22px; Clear all 32px | Fixed (fixer-verified; not flagged in the final crawl) |

### Insights and StartNet X

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-87 | medium | Pricing table sticky header, first column 59% | Fixed (fixer-verified). The breakpoint moved to 768. |
| M-88 | medium | Plan card alignment and grid orphans | Fixed (fixer-verified). The trust statement is capped at the h1 size, not h2 (see the fixer note). |
| M-89 | medium | Founder Ledger chart tables, empty district table, sticky offsets | Fixed (fixer-verified) |
| M-90 | low | Report cards linked to their own page, and others | **Fixed (verified).** 0 self-links on /insights/reports. |

### Partner and utility

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-91 | medium | Legal TOC and list before the body on phones; tables forced wide | **Fixed (verified).** The TOC is a closed `<details>` and there is no overflow at 375. |
| M-92 | medium | Deep links did not preselect topics | Fixed (fixer-verified; ref and brand attribution checked by reading the code) |
| M-93 | low | Search input 120px on phones; Open-calls link had 0 results | **Fixed (verified).** The input is 214px at 320; "open calls" returns 4 results. |
| M-94 | low | Small targets and contrast on utility and partner pages | Fixed (fixer-verified) |
| M-95 | low | Routing table forced wide; empty-state heading level; success copy | Fixed (fixer-verified; `headingLevel` now supported by the kit, M-26) |

### Server

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-96 | high | Newsletter 400 for anyone not ticking WhatsApp | **Fixed (verified on :4100).** An opt-out sign-up returns 201. The test row was deleted, and `submissions.jsonl` is empty. |
| M-97 | high | Tamil search returned zero results | **Fixed (verified).** `q=நிகழ்வுகள்&lang=ta` returns 6 results. The verifier also made `/search` send `&lang=` (the gap the server fixer noted), so /ta/search shows Tamil titles where `titleTa` exists. |
| M-98 | medium | 500 errors on `q[a]=1` and `/api/forms/__proto__` | **Fixed (verified).** These now return 200 and 404 respectively, each as JSON with `{message, fieldErrors}`. |
| M-99 | medium | Rate-limit bypass via X-Forwarded-For | Fixed (fixer-verified). `TRUST_PROXY` env, default `loopback`. |
| M-100 | low | Unfriendly error bodies | **Fixed (verified).** Bad JSON returns "We could not read that form. Please try again."; an unknown API path gets a 404 JSON body. |
| M-101 | low | Asset caching, soft 404s, CSP, CORS | **Fixed (verified).** `index.html` is `no-cache`. A missing `.js` file returns 404 JSON. `/vibe/a/b` returns 404 with the app shell. CSP is on in production with no violations in any run. Decision for StartNet: unknown one-segment slugs such as `/vibe/foo` still return 200. |
| M-102 | low | Report URLs pointed at the page itself; 6 metrics lack `asAt` | **Partly fixed.** Report anchors are fixed. `asAt` is left empty because the source dates aren't in the Books (needs StartNet data). |

### New pages

| ID | Sev | Finding | Status |
|---|---|---|---|
| M-103 | high | Corrections log page | **Fixed (verified).** Renders in English and Tamil with h1=1 and the empty state. |
| M-104 | high | Open calls page | **Fixed (verified).** 4 programmes listed. |
| M-105 | high | Speak or mentor page | **Fixed (verified).** The fixer reported it partly fixed, because the bottom bar came back below the form. The verifier added the page to the shell's form-page list, and the bar is now absent. |
| M-106 | medium | Districts index | **Fixed (verified).** All 38 districts are listed, and the page renders at all viewports without overflow. |

## 6. Rejected findings

| Flag | Why it was rejected |
|---|---|
| Small tap targets: `.tag-pop__button` (22px) | The visible chip is 22px, but an `::after` hit area extends it to 44px tall. |
| Small tap targets: `.card__link`, `.brand-tile__link`, `.snx-module__link` | These are stretched links: `::after` covers the whole card. |
| Small tap targets: `.field__checkbox` 24×24 | 24px meets WCAG 2.5.8. Each one sits in a 44px label row (`.field--checkbox .field__check-row`). |
| Small tap targets: 1×1 inputs (`home-persona`, Women scheme picker) | Visually hidden radio inputs; the visible card is their label. |
| Small tap target: unnamed `input` 223×31 on form pages | The SmartForm honeypot: off-screen, `tabIndex=-1`, hidden from assistive tech. |
| Small tap targets: utility bar and language switch at 1280/1440 (24px) | Fine pointer only; meets the 24px minimum. On touch tablets at 1024+ the bar grows to 40px (M-40). |
| Clipped text: `.visually-hidden` h2s | Clipped by design (screen-reader-only headings). |
| Invisible text: "Skip the animation" on `/` at 1440 | A skip link that appears on focus, only while the story is pinned. |
| Console 404 on `/ta/this-page-does-not-exist` | Intended: the server now returns a real 404 status for unknown routes (M-101). |
| M-47 forced `ui` chunk | Rejected after measurement: it adds about 50 KB gzip to the first load. |

The triage stage merged and de-duplicated the raw findings from the initial audit agents into M-01 to M-106; candidates it dropped at that stage are not listed in the verifier's inputs.

## 7. Remaining recommendations that need StartNet input

1. **Restart the :4000 server** so the new server build takes effect (M-96 to M-101: newsletter fix, Tamil search, 404 status, CSP, caching, redirects). Set `TRUST_PROXY` and `CORS_ORIGINS` for the real hosting.
2. **WhatsApp number** (M-27): supply it as `VITE_WHATSAPP_NUMBER` at build time. All wa.me links currently use the placeholder `910000000000`.
3. **Tamil translation.** Most body copy on /ta pages is still English (for example 32 of 34 headings on /ta, all 40 on /ta/research). It is now correctly marked `lang="en"`, but it needs translating. The consent banner title and body ("Your choice, your data…", "Choose") are English on /ta. Tamil strings drafted by fixers need a translator's review: the home fact-band footnote (M-57), the sponsor-deck button (M-68) and the Vibathon labels.
4. **Placeholders**: event dates, venues, fees, the district count and the 6 metrics without a source date (`asAt`, M-102). The site shows them as visible placeholders by design.
5. **Content review** of new copy: "Sponsor a Lab" block (M-64), the four new pages (M-103 to M-106).
6. **Soft 404 for unknown slugs** (M-101): decide whether the server should check slugs against the data files so `/vibe/foo` returns 404.
7. **Font weight on English pages**: Inter latin-ext (84 KB) and Noto Sans Tamil (50 KB) download on English pages, triggered by characters such as ₹ and the "த" language toggle. Consider subsetting, or a system font for the toggle glyph. LCP is not affected (1.6–2.0 s), but data use on 3G/4G is.
8. **Consent banner on 320px phones** (M-37): it covers about 50% of the first screen. A shorter body text, or a compact one-line first view, would bring it under 40%.
9. **Event hero length on phones** (M-83): shorter ledes and real (shorter) fact values will cut the 1150–1520px hero.
10. Add a `sitemap.xml` and the Sitemap line in `robots.txt` once the URL set is final. Keep `server/src/common/spa.ts` in sync with `App.jsx` routes.

## 8. Files changed by the verifier

- `client/src/layout/AutoContentLang.jsx` (new): lang="en" marking for English blocks on /ta (M-12)
- `client/src/layout/SiteLayout.jsx`: mounts AutoContentLang
- `client/src/layout/BottomCtaBar.jsx`: `/events/speak` added as a form page (M-105/M-30); corrections-page CTA now goes to `/contact?topic=correction`
- `client/src/layout/Footer.css`: ThinkTN link 44px on coarse pointers and 32px otherwise (M-40)
- `client/src/pages/utility/Search.jsx`: sends `&lang=` (M-97)
- `client/src/pages/programmes/Programmes.jsx`: hero lede paints at first render (M-11)
- `client/src/pages/events/EventDetail.jsx`: hero lede and actions paint at first render (M-11)
- `client/src/pages/brands/vibe/Vibathon.css`: Tamil buttons ≤2 lines at 320 (M-07)
- `client/dist/` and `server/dist/`: rebuilt

## Post-verification follow-up (2026-10-05)

- **M-37 (cookie banner on small phones): improved.** Under 400px the banner now uses a smaller title and body, tighter padding, and the two English buttons sit side by side (Tamil buttons stay stacked so no Tamil word is split). Measured at 320×640: 226px (35% of the screen, down from about 45%); Tamil 289px. Touch targets stay at 44px.
- The :4000 server was restarted on a fresh build, so the server fixes (M-96 to M-101) are now live: unknown `/api` paths return a JSON 404, the newsletter accepts sign-ups without WhatsApp, and Tamil search returns results.

---

## Round 2 and 3 (2026-10-06)

Builds verified: client `vite build` and server `nest build` from the current source tree (both pass; server `tsc --noEmit` passes). At startup the server logs "Server routes and slugs match client/src". The final checks ran on a separate production server on port 4150, which has since been stopped. The preview server on :4000 (pid 37748) was never stopped or restarted. It serves the new `client/dist` from disk but still runs the old server code and data (see "Still open"). The full page list is in `docs/PAGE_INVENTORY.md`.

### Round 2: regression audit and triage (F-1 to F-103)

11 auditors filed 161 raw findings. Triage merged them into 103 tasks in 14 buckets and rejected 20: measurement artefacts, data that StartNet must supply, and items already decided in round 1. After the round-2 fixers and verifier, 100 tasks were fixed and verified and 3 were partly fixed (F-14, F-33, F-99). The examples below are the tasks the round-2 verifier named; the other tasks are in the fixer folders under `tools/audit/agents/*-r2/`.

| Bucket | Tasks | What changed (examples) |
|---|---|---|
| Kit (shared components) | 19 | Placeholder chips sized and wrapped for Tamil (F-9). Stats render their "as at" date correctly (F-5). Tag and badge touch targets. Stat count-up no longer uses framer-motion. |
| Shell (header, menus, drawer, bars) | 12 | Tamil menu, search and close buttons all have accessible names, and no `aria-controls` points at a missing element (F-21, F-25). The bottom bar no longer forces a layout on mount. |
| Global CSS, routes and build | 8 | Tamil SEO: title, description, canonical, en/ta/x-default hreflang and `og:locale ta_IN` (F-1). English pages no longer download Tamil or latin-ext fonts (F-33, part). A malformed `#hash` no longer breaks a page (F-20). `VITE_WHATSAPP_NUMBER` is documented (F-38). |
| Home and Join | 6 | Less work in Home's first render (F-14, part). |
| About | 5 | Tamil tag names wrap as whole words on the evidence-standard page. |
| Brands: Research and Vibe | 9 | Vibathon's Tamil content is wired in. |
| Brands: Connect and Women | 6 | The series register link no longer sends `series=all-connect` (F-61). |
| Programmes | 6 | Ladder labels read L4–L7, as in Book 1 (F-66). The Tamil index table breaks only between words. |
| Events | 5 | Shorter event hero on phones (F-72). |
| Insights | 5 | Tamil placeholder prefix (இடநிரப்பி) and Ledger labels. |
| StartNet X | 4 | Tamil status chip. |
| Partner | 4 | Partner pages. |
| Utility and new pages | 7 | Search shows suggestions when nothing matches, `/ta` result links stay under `/ta` (F-90), and a one-letter query returns no results (F-102). |
| Server | 7 | `sitemap.xml` with hreflang (F-98). Tamil fields in the event and story data (F-99). F-97, F-103. |

### The 6 items left after round 2 (all closed in round 3)

| Item | Result |
|---|---|
| F-33: first-load JS + CSS over 200 KB | **Fixed.** framer-motion's feature bundle moved out of the entry chunk. Reveal and the kinetic headline now use CSS. Home's lower half loads as it nears the screen. The entry chunk went from 168.6 KB to 141.3 KB gzip (117 KB brotli). Final figures are in the metrics table below. |
| F-14: Home's first-render long task | **Fixed for script.** The first render now runs in slices of about 50 ms or less. The one long task left is the browser's first style and layout pass. On `/ta` that pass comes from the first use of the Tamil fonts, not from JavaScript. |
| F-72-ta320: Tamil event hero at 320 | **Fixed for the old event page** (945 → 859px). Flat event URLs now redirect to the edition pages, so the final verifier also shortened the edition hero on phones (below). |
| V2-K1: "விரைவில்" (soon) on past events with no date | **Fixed.** The card reads "2025 / Held" and "2025 / நடந்தது". |
| V2-R1: English sponsor naming string inside Tamil text | **Fixed** in `vibeContent.js`. The final verifier made the same change in `server/data/events.json`, which the series page reads. |
| V2-K2: reveal items left hidden after a fast scroll | **Fixed.** Under 6× CPU throttling, items still hidden 2.75 s after a fast scroll went from 166 (in 38 of 72 runs) to 1, and that one is never seen hidden. |

### Round 3: new pages

132 English pages (264 with Tamil) in 10 mega-menu groups were built under `client/src/pages/mega/`. They were wired into `App.jsx` and `server/src/common/routes.ts`, then audited for mobile, tablet and desktop layout, interactions and links. That audit raised 27 findings, all fixed:

| Group | Findings | Fixes |
|---|---|---|
| insights-ledger | 3 (1 high, 2 low) | Tamil tables keep whole words and their captions are no longer cut off. The bottom bar no longer shows a second "Download CSV". "How we count" no longer stretches across its column. |
| brand-sub | 1 | Below 576px the lab role table becomes stacked cards, so no column is cut off. |
| snx-extras | 2 (medium) | Status pills wrap tidily. The planned-endpoints table stacks on phones. |
| about-districts | 2 (low) | The self-diagnosis scorecard stacks on phones. The metro district note no longer lists a district as being "with" itself. |
| shared shell | 8 | Bottom bar label not truncated. Tamil mega panels fit the screen. One active brand sub-nav item. No join bar on `/signin` and `/signup`. Correct district name on the events filter. Featured event in the drawer. One canonical self-diagnosis URL. Unknown slugs settle quickly. |
| media-careers | 2 | Brand lock-ups no longer clip at 430. The phone page is about 8% shorter. |
| events-series | 4 (2 medium, 2 low) | No orphaned facts or pillars. Heading order fixed. Flat edition URLs redirect. Tab canonicals point at the edition. |
| insights-reports | 2 (low) | Tertiary links sit at their natural width. Scroll-spy returns to 01 at the top. |
| snx-audiences | 1 (low) | The Founders modules grid is 3 + 2 at desktop widths. |
| utility-campaign | 2 (1 medium, 1 low) | The campaign CTA goes to the registration path. `utm_*` parameters are forwarded. |

### Fixed by the final verifier

- **Flat event URLs.** The server now returns a 301 from `/events/<series>-<edition>` to `/events/<series>/<edition>`, keeping `/ta` and the query. sitemap.xml leaves out the flat URLs and the 28 `/agenda` and `/speakers` tabs (`server/src/common/routes.ts`).
- **Internal links that went through a redirect.** These now use `eventPath()` or the canonical URL:
  - Events flagship cards, home updates tabs and the events calendar.
  - Founders Day, the newsletter, the Women circle finder and the Connect sector pages.
  - The event page's "next edition" link.
  - The HTML sitemap's self-diagnosis link, and the `programmes.json` url for Vibe Summit.

  The final crawl reached 0 URLs that redirect.
- **Tamil on edition pages (regression).** Every event now opens on its edition page, but that page ignored the `<field>Ta` event data that round 2 had wired into the old event page. Only 41% of the letters on `/ta/events/vibathon/2027` were Tamil script.
  - EditionPage, EditionCard and the series page now read the Tamil fields (`localizeEvent` in `seriesData.js`).
  - `lang="en"` is set only on values that fall back to English.
  - All 28 `/ta/events` pages are now 79–85% Tamil script.
- **Edition hero on phones.** Below 480px the decorative poster is hidden and the facts become compact label | value rows. No copy is removed. At 320, English went from 1390 to 938px and Tamil from 1601 to 1295px. Tamil is longer because it now shows the Tamil copy.
- **Tamil words split mid-syllable on new pages.** Fixed in:
  - the lab, sponsor-tier, index, media kit and naming tables (whole words; the tables scroll);
  - the series and edition pillar headings;
  - the host-event steps at 1280 and the indices card titles;
  - KeyFacts labels at 1280 and wider;
  - media kit asset titles at 320.

  A check of all 242 `/ta` pages at 320 and 1280 now flags only 2 false positives: the visually hidden `/ta/programmes` table header, and a placeholder chip caught mid-animation.
- **Items the fixers left over.** Wrapped badges now have a 13px radius (a rounded rectangle, not a blob). The scroll-spy marks the last section at the bottom of the page. `App.jsx` passes `search` to `campaignBottomCta`. Out-of-date integration notes were updated.

### Before and after metrics

| Metric | Before (round-2 verify or earlier) | Final (round 3) |
|---|---|---|
| Unique English pages / Tamil mirrors / total | 126 / 126 / 252 | **244 / 244 / 488** |
| Crawlable URLs (link crawl) / filtered query views | 400 / 148 | **918 / 436** |
| Route templates in `App.jsx` | 47 | **86** (plus 5 vanity redirects and 1 catch-all 404) |
| `sitemap.xml` URLs | 242 | **416** (208 EN + 208 TA) |
| Broken internal links / internal links through a redirect | 0 / not measured | **0 / 0** |
| Pages with h1 ≠ 1 / empty hrefs / malformed external URLs | 0 / 0 / 0 | **0 / 0 / 0** (1,322 unique external URLs) |
| Page errors and console errors (link crawl and every layout run) | 0 | **0** |
| Horizontal overflow: 242 EN routes at 320, 375, 768, 1024 and 1440; 242 TA routes at 320 and 1440 | 0 (126 EN routes) | **0** |
| Unknown slugs return HTTP 404 with the 404 page (all 20 parameter routes, EN and TA) | 17 spot checks | **46 of 46**, each settling in under 0.8 s |
| Mega menus at 1280×800 and 1440×900, EN and TA | Tamil panels taller than the screen (round-3 audit) | **28 of 28 panels fit**. Per language: 162 menu links and 141 drawer links, all 200, or 301 then 200 |
| Consent banner height at 320×640 | EN 21%, TA 32% | **EN 21% (136px), TA 32% (205px)**; the limit is 33% |
| Entry chunk (gzip) | 168.5 KB | **141.3 KB** (117 KB brotli) |
| First-load JS + CSS payload (brotli; mobile, cache off) | `/` 173.8, `/events` 199.1, `/research` 200.2, `/partner` 196.0 KB | See the next table. **All 13 English pages measured are under Book 1's 200 KB budget.** |
| Total first-load transfer, all types (payload) | `/` 223, `/events` 245 KB | `/` 226, `/events` 243, `/ta` 325 KB (148 KB of it Tamil fonts) |
| LCP (4G, 4× CPU, mobile) | 1.6–2.0 s (round 1, same profile) | 1.4–2.0 s on English pages, 1.9 s on `/ta`. FCP 1.15–1.4 s. CLS 0–0.0005 |
| Longest main-thread task (4× CPU) | 580–675 ms of script on `/` | 276–431 ms on English pages, all style and layout. 907 ms on `/ta`, the first layout with the Tamil fonts |

Final first-load JS + CSS payload per English page (brotli; mobile, cache off):

| Page | KB |
|---|---|
| `/` | 162.7 |
| `/about` | 179.7 |
| `/startnet-x` | 182.3 |
| `/programmes` | 184.6 |
| `/districts/chennai` | 185.6 |
| `/vibe` | 185.7 |
| `/media/kit` | 185.9 |
| `/insights/founder-ledger` | 186.1 |
| `/events` | 188.0 |
| `/events/vibathon/2027` | 189.9 |
| `/research` | 190.7 |
| `/partner` | 191.4 |
| `/startnet-x/founders` | 192.8 |

How these were measured:
- Wire bytes are about 0.75 KB per response higher than payload because of the Nest security headers.
- Timings are a single run per page on an otherwise idle machine.
- The final link crawl logged 18 navigation timeouts while another check was running in parallel. Re-run alone, all 18 reached network idle in 0.6–0.9 s.

### Tamil coverage (final build, all 242 `/ta` routes)

- **Language tags:** every page has `html lang="ta"`, a Tamil title and description, and hreflang alternates.
- **Share of Tamil script:** 85.1% of the letters in `<main>` are Tamil. 207 of the 242 pages are at 80% or more, and none is below 60%.
  - The lowest are `/ta/search` and `/ta/sitemap` (their link labels are proper names), the Connect sector pages (sector names) and `/ta/brands`.
  - Event pages moved from 41–63% to 79–85% after the edition fix above.
- **Mostly-Latin blocks:** 1,178 of 10,957 text blocks are mostly Latin script. These are brand and programme names, email addresses, ₹ figures, and `[confirm]` marks inside the Tamil data. 62 of them are not marked `lang="en"`.
- **Review needed:** the Tamil written by agents in rounds 1–3 still needs a native Tamil editor. That covers the `*Ta` fields in `server/data/*.json`, the `t()` strings on all 132 new pages, the sponsor naming line and the placeholder wording.

### Still open

1. **Restart :4000.** Run the current server build: `cd server && node dist/main.js` with `PORT=4000` and `NODE_ENV=production`. Until it restarts, :4000 runs the old server code and data:
   - routes added in round 3 render, but with a 404 status (checked: `/startnet-x/founders`, `/events/vibathon/2027`, `/districts/chennai`, `/media/kit`);
   - flat event URLs are not 301ed;
   - `/sitemap.xml` returns 404;
   - the round-2 Tamil event data (F-99) and this round's data edits are missing (`events.json` sponsor naming, `programmes.json` Vibe Summit URL).
2. **The Tamil edition hero at 320 is 1295px.** The target is 900px or less, and English is 938px. The difference is the Tamil copy itself: a 7-line lede and buttons that take two lines. It needs either a shorter `summaryTa` in `events.json` or a "Read more" clamp like the one on the old event page.
3. **The media kit is 25.6 screens long at 320.** That is the length of the content; nothing on the page is broken.

### Needs StartNet

- **WhatsApp number:** every wa.me link uses the placeholder `910000000000`. Supply the real number as `VITE_WHATSAPP_NUMBER` at build time.
- **Real data:**
  - event dates, venues and fees;
  - people: speakers, jury and leadership;
  - signed partners and sponsors (logo walls stay empty until there are some);
  - Ledger figures, report files and index scores;
  - press releases and job openings. The `/media/releases/:slug` and `/careers/:slug` templates exist, but with no entries there are no pages yet.

  Until then the site shows visible placeholders, by design.
- **`asAt` dates:** 6 metrics have no source date (M-102). They cannot be made up.
- **Native Tamil review:** of all agent-drafted Tamil (see Tamil coverage above).
- **Decisions:**
  - Should the edition `/agenda` and `/speakers` tabs be indexed? Today their canonical is the edition page.
  - Should the 4 placeholder founder stories stay live? They are left out of the sitemap.

### Files changed by the final verifier

- Server: `server/src/common/routes.ts`, `server/data/events.json`, `server/data/programmes.json`
- Shell and kit: `client/src/App.jsx`, `client/src/components/Badge.css`, `client/src/components/KeyFacts.css`
- Links (all under `client/src/`):
  - `pages/events/Events.jsx`, `pages/events/EventDetail.jsx`, `pages/events/parts/EventCalendar.jsx`
  - `pages/home/UpdatesTabs.jsx`, `pages/brands/women/CircleFinder.jsx`, `pages/brands/connect/ConnectSub.jsx`
  - `pages/utility/Sitemap.jsx`, `pages/mega/events-extra/FoundersDay.jsx`, `pages/mega/insights-ledger/Newsletter.jsx`
- Events series (in `client/src/pages/mega/events-series/`): `EditionPage.jsx`, `EditionPage.css`, `SeriesPage.jsx`, `SeriesPage.css`, `seriesParts.jsx`, `seriesData.js`, `EventsSlugDispatcher.jsx`, `README.md`
- Other new pages (in `client/src/pages/mega/`):
  - `insights-reports/`: `ChapterNav.jsx`, `IndexDetail.css`, `Indices.css`, `routes.js`
  - `media-careers/MediaKit.css`, `brand-sub/ResearchLab.css`, `events-extra/HostEvent.css`
- Rebuilt: `client/dist/` and `server/dist/`

Scripts and raw results are in `tools/audit/agents/final-verifier/`:
- Link crawl: `out/links.json`, `out/routes.json` (the two earlier crawls are in `links1/`)
- Layout crawls: `layout-en/out/`, `layout-ta/out/`
- Re-checks of the fixer findings: `findings.mjs` → `findings.json`
- Menus, consent banner and unknown slugs: `extra.mjs` → `extra.json`
- HTTP and sitemap: `http.mjs` → `http.json`
- Tamil coverage: `tamil.mjs` → `tamil.json`
- Tamil mid-word splits: `splits.mjs` → `splits-*.json`
- Performance: `perf.mjs` → `perf.json`
- Page inventory: `inventory.mjs` → `inventory.json`
- Screenshots: `shots/`

### Post-round-3 follow-up (2026-10-06, after restarting :4000)

- **:4000 restarted** on the final build. All new routes return 200 (EN and /ta), flat event URLs 301 to `/events/<series>/<edition>`, unknown slugs return 404, and `/sitemap.xml` (416 URLs) and `/robots.txt` are served.
- **Edition hero on phones (open item):** below 480px the eligibility/fee note, which repeats the Fee fact, now folds behind a 44px "Who can enter and fees" toggle (`aria-expanded`, opens in place). On Tamil pages the lede uses body size and fact values have tighter line spacing. Measured at 320: `/ta/events/vibathon/2027` 1295 → 1161px, `/ta/events/saas-connect/2027` 903px, `/events/vibathon/2027` 921px. The rest of the height comes from placeholder chips in the facts ("[final fee]", "[to be confirmed]"); real values will shorten it. Stacking Tamil labels above values was tried and reverted, because it made other editions taller.
