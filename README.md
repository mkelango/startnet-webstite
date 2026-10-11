# StartNet website — startnet.in

**Tamil Nadu's founder-making network. "Every talent, a founder."**

This is the public website for StartNet. It covers:
- the masterbrand
- the four talent brands: StartNet Research, Vibe, Connect and Women
- the StartNet X platform pages
- programmes, events, insights (Founder Ledger, stories, reports), partner and utility pages

It runs in English, with Tamil under `/ta`.

All copy, structure and design come from the four StartNet website books:

| Book | Covers |
|---|---|
| Book 1, Strategy & Architecture | Sitemap, mega menus, templates, content model, flows, filters |
| Book 2, Website Content | Page-by-page copy, used word for word where it exists; forms and consent; Tamil strings |
| Book 3, Brand Identity & UI Design System | Colour, type, components C01–C46, layouts |
| Book 4, Interaction, Animation, Imagery & Benchmarks | Interaction system, motion patterns, the informa.com teardown (Appendix R1) |

The build contract that every part of the code follows is in [`docs/CONTRACT.md`](docs/CONTRACT.md).

---

## Stack

| Layer | Technology |
|---|---|
| Front end (`client/`) | React 18 + Vite 5, React Router 6, plain CSS with design tokens (no CSS framework). Motion: `framer-motion` for components, `gsap` + ScrollTrigger only on storytelling pages. Icons: `lucide-react`. Fonts self-hosted from the `@fontsource-variable` woff2 subsets (Inter, Anek Tamil, Noto Sans Tamil), declared by hand in `src/styles/fonts.css` so English pages load only Inter latin. |
| API (`server/`) | **NestJS 10** (TypeScript) on Express, global prefix `/api`, `helmet`, `compression`, `@nestjs/throttler` (forms rate limit), `@nestjs/serve-static` (serves the built client with SPA fallback). |
| Content | JSON files in `server/data/`, seeded from the books. There is no database. |

## Structure

```
.
├── package.json            root scripts (dev / build / start), uses concurrently
├── docs/CONTRACT.md        component APIs, data shapes, endpoints, design rules
├── client/                 React + Vite app
│   ├── index.html
│   ├── vite.config.js      port 5173, proxies /api → http://localhost:4000
│   └── src/
│       ├── main.jsx, App.jsx        entry + route table (every page lazy-loaded)
│       ├── styles/fonts.css         @font-face rules + metric-matched fallbacks (woff2 files in styles/fonts/)
│       ├── styles/tokens.css        design tokens (Book 3 §9.3 + Book 4 R4 §4)
│       ├── styles/base.css          reset, type scale, layout utilities
│       ├── lib/                     i18n (useLang), format, links (snxLink, waLink)
│       ├── hooks/                   useApi / postForm, useReducedMotion
│       ├── data/                    brands.js (brand registry), nav.js (mega menus, footer)
│       ├── components/              UI kit (Button, Section, Stat, FactBand, cards, forms…) + index.js
│       ├── layout/                  SiteLayout, BrandLayout, Header, MegaMenu, MobileDrawer,
│       │                            Footer, SearchOverlay, ConsentBanner, BottomCtaBar…
│       └── pages/                   one folder per area (about, brands/*, programmes, events,
│                                    insights, snx, partner, utility) + Home, Join
└── server/                 NestJS API
    ├── src/
    │   ├── main.ts                  bootstrap: /api prefix, helmet, CORS for :5173, port 4000
    │   ├── app.module.ts            ServeStatic (client/dist, SPA fallback) + Throttler + modules
    │   ├── common/paths.ts          resolves data/, storage/, client/dist
    │   ├── content/                 read-only content endpoints + search
    │   └── forms/                   POST /api/forms/:type, validation, consent logging
    ├── data/*.json                  seeded content (see "Where content lives")
    └── storage/submissions.jsonl    form submissions (gitignored, created on first post)
```

## Install, run, build

You need Node.js 18 or newer (developed on Node 22).

```bash
# install everything (root, client, server)
npm run install:all

# development: Nest API on :4000 (watch mode) + Vite on :5173 (proxies /api)
npm run dev
#   open http://localhost:5173
#   or run them separately: npm run dev:server / npm run dev:client

# production build: client (vite build → client/dist), then server (nest build → server/dist)
npm run build

# production run: Nest serves the API and the built site on one port
npm start
#   open http://localhost:4000   (PORT env var overrides 4000)

# build + start in one go
npm run preview:full
```

How each command works:
- **`npm run dev`** runs `nest start --watch` in `server/` and `vite` in `client/`, side by side through `concurrently`.
- **`npm start`** runs `node dist/main.js` in `server/`.
  - If `client/dist/index.html` exists, Nest serves it with SPA fallback: any non-`/api` path returns `index.html`, and missing `/assets/*` files return 404.
  - If there is no client build, the server runs as an API only.

## Environment

None of these is required to run locally. Set them for production. Server variables are read when the
server starts; `VITE_*` variables are read by `vite build` and baked into the client bundle, so changing one
needs a client rebuild.

| Variable | Read in | Default | Example | Effect when unset |
|---|---|---|---|---|
| `PORT` | `server/src/main.ts` | `4000` | `8080` | The server listens on 4000. |
| `NODE_ENV` | `server/src/main.ts` | (unset) | `production` | The Content-Security-Policy header is **off** (it is only sent when `production`, because the Vite dev server needs inline scripts). Always set `production` in production. |
| `CORS_ORIGINS` | `server/src/main.ts` | `http://localhost:5173,http://127.0.0.1:5173` | `https://startnet.in,https://www.startnet.in` | Only the Vite dev origins may call `/api` cross-origin. Same-origin requests (the built site served by Nest) are not affected. Comma-separated list. |
| `TRUST_PROXY` | `server/src/main.ts` | `loopback` | `1` (one proxy hop), `true`, `false`, or `loopback, 10.0.0.0/8` | `X-Forwarded-For` is trusted only from a proxy on the same machine. Behind a load balancer or CDN on another host, every visitor then shares the proxy's IP, so the form rate limit (20 posts / 10 min / IP) applies to everyone together. Set it to the number of proxy hops or the proxy's subnet. |
| `PUBLIC_ORIGIN` | `server/src/common/sitemap.ts` | `https://startnet.in` | `https://www.startnet.in` | `/sitemap.xml` and the `Sitemap:` line in `/robots.txt` use `https://startnet.in`. No trailing slash. |
| `STRICT_ROUTES` | `server/src/common/route-sync.ts` | (unset) | `1` | Route/slug mismatches between `server/` and `client/src` are logged as warnings. With `1` the server refuses to start instead. |
| `PRERENDER_BYPASS` | `server/src/common/prerender.ts` | (unset) | `1` | Prerendered snapshots in `client/dist/prerender/` are served when present. With `1` the server always sends the plain app shell (the prerender script runs its own server this way). |
| `CHROME_PATH` | `tools/seo/prerender.mjs` (build time) | the usual Chrome / Edge / Chromium install paths | `/usr/bin/chromium` | The prerender step looks in the usual install paths. If it finds no browser, it is skipped with a warning. |
| `VITE_SITE_ORIGIN` | `client/src/components/Seo.jsx` (build time) | `https://startnet.in` | `https://www.startnet.in` | Canonical and hreflang URLs point at `https://startnet.in`. Keep it equal to `PUBLIC_ORIGIN`. |
| `VITE_WHATSAPP_NUMBER` | `client/src/lib/links.js` (build time) | `910000000000` (placeholder) | `919876543210` (country code + number, digits only) | Every WhatsApp button links to the placeholder `wa.me/910000000000`, and the dev console warns. **StartNet must supply the real number before launch.** |

Example production run:

```bash
VITE_SITE_ORIGIN=https://startnet.in VITE_WHATSAPP_NUMBER=91XXXXXXXXXX npm run build
NODE_ENV=production PORT=4000 PUBLIC_ORIGIN=https://startnet.in CORS_ORIGINS=https://startnet.in TRUST_PROXY=1 npm start
```

The client build also writes `.br` (Brotli q11) and `.gz` copies of the hashed files in `client/dist/assets`;
the server sends them when the browser accepts that encoding.

## Routes

Every route also exists under `/ta` (Tamil), e.g. `/ta/vibe`.

| Area | Routes |
|---|---|
| Home | `/`, `/join` |
| Who we are | `/about`, `/about/mission-1-lakh`, `/about/how-we-work`, `/about/leadership`, `/about/evidence-standard`, `/about/governance`, `/about/thinktn-alliance` |
| Brands hub | `/brands` |
| StartNet Research | `/research`, `/research/:slug`: `labs`, `fellowship`, `lab-to-market-summit`, `institution-partner-programme`, `problem-statements`, `terms` |
| StartNet Vibe | `/vibe`, `/vibe/vibathon`, `/vibe/:slug`: `academy`, `campus`, `launchpad`, `clubs`, `summit`, `for-colleges` |
| StartNet Connect | `/connect`, `/connect/:slug`: `series`, `circles`, `founder-switch`, `scale`, `angels`, and the nine sector pages (`genai`, `saas`, `d2c`, …) |
| StartNet Women | `/women`, `/women/:slug`: `circles`, `rise-academy`, `hercapital`, `summit` |
| Programmes | `/programmes` (finder + filters), `/programmes/:slug` |
| Events | `/events` (list + calendar), `/events/past`, `/events/:slug` |
| Insights | `/insights`, `/insights/founder-ledger`, `/insights/stories`, `/insights/stories/:slug`, `/insights/reports` |
| StartNet X | `/startnet-x`, `/startnet-x/modules`, `/startnet-x/pricing`, `/startnet-x/trust` |
| Partner | `/partner`, `/partner/:type` (`institutions`, `gccs`, `government`, `sponsors`, `csr`, `investors`, `incubators`, `district-programme`), `/partner/enquire`, `/partner/our-partners` |
| Utility | `/media`, `/careers`, `/contact`, `/search?q=`, `/legal/:slug` (`privacy`, `terms`, `cookies`, `data-rights`, `grievance`, `safeguarding`, `accessibility`, `refunds`, `code-of-conduct`, `sponsorship-terms`), `/sitemap`, and any other path → 404 page |

Brand pages, including StartNet X, render inside `BrandLayout`. It sets `data-brand`, so the `--accent*` tokens switch to that brand, and it adds the sticky brand sub-nav.

## API

All endpoints are under `/api` and return JSON. A record that doesn't exist returns `404 { message }`.

| Method & path | Returns |
|---|---|
| `GET /api/health` | `{ ok, time }` |
| `GET /api/metrics?brand=&key=&group=&tag=` | `Metric[]`, each with tag A/B/C, `asAt`, `asAtLabel`, `source`. Unknown values are `value: null` with `placeholder`. |
| `GET /api/programmes?brand=&status=&stage=&format=&language=&price=&need=&pool=` | `Programme[]` |
| `GET /api/programmes/:slug` | `Programme` |
| `GET /api/events?brand=&when=upcoming\|past&district=&format=&series=&language=&price=&limit=` | `Event[]`, sorted by date. `status=` is an alias for `when=`. |
| `GET /api/events/:slug` | `Event` |
| `GET /api/stories?brand=&type=` · `GET /api/stories/:slug` | `Story[]` / `Story` |
| `GET /api/reports` · `GET /api/reports/:slug` | `Report[]` / `Report` |
| `GET /api/people?group=leadership\|brand-leads\|advisory` | `Person[]` |
| `GET /api/partners` | `Partner[]`: **signed agreements only** (currently `[]`) |
| `GET /api/careers` | `Role[]` (currently `[]`) |
| `GET /api/press` | `PressItem[]` (currently `[]`) |
| `GET /api/ledger` | Founder Ledger: `{ period, asAt, kpis, ladder, byBrand, byDistrict, womenShare, corrections, … }` |
| `GET /api/search?q=` | `{ query, total, results: [{ type, title, url, brand?, snippet, score }] }` |
| `POST /api/forms/:type` | `201 { ok, id, message }` or `400 { message, fieldErrors }`. Types: `contact`, `enquiry`, `newsletter`, `join`, `interest`, `nomination`, `host`, `speak`. |

How forms are handled:
- **Validation:** email and phone are checked. Phone numbers are accepted with or without +91 and stored as 10 digits.
- **Consent:** the form is rejected unless the consent its type requires is ticked. Each consent is logged with its purpose, version and timestamp.
- **Spam protection:** the `website` field is a honeypot; posts that fill it get a success reply but are not saved.
- **Rate limit:** 20 posts per 10 minutes per IP.
- **Storage:** submissions are appended to `server/storage/submissions.jsonl`.

## Where content lives

| Content | Location |
|---|---|
| Programmes, events, stories, reports, people, partners, careers, press, metrics, Founder Ledger, search index of static pages | `server/data/*.json` |
| Page copy (Book 2, verbatim) | In each page's folder, e.g. `pages/brands/vibe/vibeContent.js`, `pages/brands/research/researchContent.js`, `pages/snx/snxContent.js`, `pages/partner/partnerData.js`, `pages/utility/legalContent.js` |
| Brand registry (names, descriptors, journey lines, sub-nav, CTAs) | `client/src/data/brands.js` |
| Mega menus, utility links, footer | `client/src/data/nav.js` |
| Tamil strings | Inline `t('English', 'தமிழ்')` calls (Book 2 §14), plus the `/ta` route prefix |

To change a figure, an event date or a programme status, edit the JSON in `server/data/` and restart the server. No client rebuild is needed.

## Search, answer and AI engines (SEO / AEO / GEO)

The full strategy, keyword map and launch checklist are in [`docs/SEO.md`](docs/SEO.md). In short:

- **Crawlable HTML.** `npm run build` ends with `npm run prerender` (`tools/seo/prerender.mjs`). It renders every
  sitemap URL (English and `/ta`) in headless Chrome and saves the finished HTML in `client/dist/prerender/`. The
  server sends that snapshot for the page URL, so crawlers that do not run JavaScript (GPTBot, ClaudeBot,
  PerplexityBot, link previews) get the real title, description, canonical, JSON-LD and text. `main.jsx` renders
  the live app invisibly over the snapshot and swaps it in once the content matches (typically 0.3–0.7 s; 4 s cap).
  - Needs Chrome, Chromium or Edge on the build machine (`CHROME_PATH` to override). Without one, the step is
    skipped with a warning and the site works as a plain SPA.
  - Snapshots are tied to the `index.html` they were rendered against, so a client rebuild without a new prerender
    falls back to the plain shell. Re-run `npm run prerender` after editing `server/data/*.json` too, since the
    snapshots contain the data.
  - Filter states (`?brand=`, `?district=` …) always get the plain shell plus `X-Robots-Tag: noindex, follow`.
- **Head tags.** `<Seo>` (`client/src/components/Seo.jsx`) sets the title, description, canonical, hreflang
  `en-IN` / `ta-IN` / `x-default`, robots, Open Graph and Twitter tags, the per-brand share image (`client/public/og/`,
  regenerate with `npm run seo:og`) and page-level JSON-LD (`jsonLd` prop; builders in `client/src/lib/seo.js`).
- **Structured data.** Organization and WebSite (with SearchAction) are site-wide in `index.html`. The templates add
  BreadcrumbList, FAQPage, Course, Event (only when the date is confirmed), Article / Report, ItemList and
  CollectionPage. Nothing is published as a fact while it is still a placeholder.
- **AI engines.** `/robots.txt` names the AI search and answer crawlers explicitly (see `AI_AGENTS` in
  `server/src/common/sitemap.ts`). The prerender also writes `/llms.txt` and `/llms-full.txt` from the published pages.
- **Checks.** `npm run seo:check -- /vibe /ta/vibe` prints what crawlers see for each path. The prerender writes
  a lint (title ≤ 60, description 70–160, one h1, duplicates, JSON-LD validity) to `tools/seo/out/seo-report.json`.

## Placeholder register

The books leave many facts open. The site never invents numbers, names, partners or outcomes:
- **Unknown values** show the Book 2 placeholder text, e.g. `[placeholder — to be supplied by StartNet]`. It is styled with `.placeholder` / `<Placeholder>` so it stays visible on the page.
- **Seed data marks:** inline `[A]`/`[B]`/`[C]` and `[…]` in seed copy are rendered as tag chips and placeholders (`<InlineMarks>` and page-local `RichText`).
- **Figures:** every figure goes through `<Stat>`, with a confidence tag:
  - **A**: system record
  - **B**: verified external or partner source
  - **C**: planning target or estimate

  Each figure also carries an as-at date and a source, and links to `/about/evidence-standard`.
- **Partners** appear only when `agreementStatus: "signed"` and logo permission are both present. Logo walls render nothing when the list is empty.

Open items still to be supplied by StartNet:
- **Programmes and events:** event dates and venues (events with `dateConfirmed: false` show their `dateLabel`, not a date), prices (`priceTBC`), and the Vibathon 2027 registration dates (`VIBATHON_REGISTRATION` in `vibeContent.js`).
- **Figures:** StartNet outcome figures (`value: null` metrics).
- **Stories and people:** founder stories (`placeholder: true`), brand leads and advisory councils.
- **Partners and media:** signed partners, careers and press.
- **Company and legal:** company CIN and registered office, social handles, legal texts (placeholders pending counsel), and the district map boundary data.
- **StartNet X:** the platform's deep-link paths (`snxLink(...)`) need checking against the real app routes.
- **Tamil copy:** all Tamil strings (Book 2 §14 where it exists, otherwise drafted for this build) are **pending native-speaker review** before launch.
- **Copy review:** the agents flagged the copy they wrote where the books had none (FAQ answers, some headings, the Tamil 404 lines). Search the page folders for that copy before launch.

## Design system notes

- **Tokens:** everything comes from `client/src/styles/tokens.css`. Do not hard-code colours, spacing, radii, shadows, durations or easing in components.
  - **Colour, type and space:** from Book 3 Part A §9.3.
  - **Motion:** durations and easing from Book 4 R4 §4.
  - **Brand accents:** `--accent`, `--accent-fill` and the related tokens switch under `[data-brand="research|vibe|connect|women|x"]`.
- **Identity:**
  - **Colours:** Ink `#0E0E10`, Paper `#F6F5F2`, StartNet Red `#E5322D`.
  - **Full stop:** the red full stop (`<Dot/>`) closes headlines, with one per view.
  - **Night bands:** each day page has at most one Night band (`data-surface="night"`).
  - **Buttons:** pills; primary is red with white text.
- **Imagery:** every image slot is an `<ArtImage>`. It shows a photograph (StartNet's own, a curated pick, or the themed library of 64 licensed photos) as responsive WebP/JPEG, and falls back to the generative pulli art. People without a consented portrait and past-event recaps keep the art on purpose. How to add photos: [`docs/PHOTOS.md`](docs/PHOTOS.md) (`npm run photos`). Credits: [`docs/PHOTO_CREDITS.md`](docs/PHOTO_CREDITS.md).
- **Motion (Book 4):**
  - **Patterns:** a kinetic word-by-word hero headline, reveal on enter (once), count-up fact bands, mega menus (300 ms hover intent, 500 ms close grace), a header that hides and shows on scroll, a sticky brand sub-nav, hover lift on cards and arrow nudges.
  - **GSAP scroll stories:** Home, Mission 1 Lakh, Our story and Vibathon only.
  - **What animates:** only `transform`, `opacity` and `clip-path`; content is visible at rest.
  - **Reduced motion:** `useReducedMotion()` follows the OS setting unless the footer "Reduce motion" switch overrides it (`html[data-motion="reduced"|"full"]`).
- **Accessibility and layout:** single column under 768px, 44px touch targets, no horizontal scroll at 320px, a skip link, focus moves to the `<h1>` on route change, and each page has one `<h1>`.
- **Consent (DPDP):** the cookie banner has equal-weight Reject and Accept buttons, with non-essential cookies off by default. It is stored versioned in `localStorage` (`sn-consent`) and reopened from "Cookie settings". Form consents are unticked and kept separate per purpose.
- **CSS naming:** every class is prefixed with its component or page name (`.vibe-journey__rail`, `.cookie-banner__btn`).
