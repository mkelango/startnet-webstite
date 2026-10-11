# StartNet: SEO, AEO and GEO

How startnet.in is built to be found and quoted by search engines (SEO), answer boxes and voice assistants (AEO),
and AI engines such as ChatGPT search, Perplexity, Gemini / AI Overviews, Copilot and Claude (GEO).

Sources: Book 1 §9 "SEO and discoverability" and Part B §7 (URLs, canonical, hreflang), Book 2 (SEO titles and meta
per page, the ≤ 60 / ≤ 155 character rule), Book 3 §5.7 (structured data, OG images).

The ground rule is the same as the rest of the site: **no invented facts.** Unconfirmed dates, venues, prices, figures,
partners and people are never published in titles, descriptions or structured data, and no copy claims to be the
"largest", "first", "best" or "leading" (Book 2 bans it for Vibathon; we apply it everywhere).

---

## 1. What the top sites do, and what we copied

| Pattern | Seen at | On startnet.in |
|---|---|---|
| Server-rendered HTML for every public URL | informa.com, gartner.com, hubspot.com, stripe.com | Prerendered snapshot per URL, English and Tamil (§2.1) |
| One entity graph: Organization → WebSite → WebPage | Google's own guidance; most Fortune 500 sites | `index.html` declares `Organization` and `WebSite` with stable `@id`s; every page-level node points to them |
| Answer-first descriptions and on-page Q&A | HubSpot, Atlassian, Gartner glossary pages | Descriptions are written as direct answers; FAQ blocks with FAQPage markup on the main hubs |
| Topic hubs with an ItemList of children | YourStory, Inc42, Gartner topics | Brand homes, Programmes, Events, Insights, Partner list their children in markup |
| Clear evidence and sourcing | Gartner, Forrester methodology pages | Confidence tags, as-at dates and the evidence standard page (already built); llms.txt tells models not to quote placeholders |
| Machine-readable summary for LLMs | Anthropic, Stripe, Cloudflare docs (`/llms.txt`) | `/llms.txt` and `/llms-full.txt`, generated from the published pages |
| Explicit AI-crawler policy | Most news and SaaS sites | `robots.txt` names the AI search and answer crawlers (§2.5) |
| Per-section share images | informa.com, stripe.com | 1200×630 Pulli-template image per brand (`client/public/og/`) |

## 2. What is built

### 2.1 Crawlable HTML (the biggest single fix)
Before this work, every URL returned the same empty shell: one title, one description and `<div id="root"></div>`.
Google could render it later, but AI crawlers that do not run JavaScript saw 488 blank pages.

Now `npm run build` ends with `tools/seo/prerender.mjs`, which:
- renders every sitemap URL in headless Chrome and saves it to `client/dist/prerender/`;
- is served by the NestJS fallback (`server/src/common/prerender.ts`, `spa.ts`) for the clean page URL;
- is replaced on load by the live app (`client/src/main.jsx`), invisibly and in typically 0.3–0.7 s, so visitors
  see the page at once and never see a loading flash;
- is tied to the build it was rendered for, so it can never serve stale asset links.

Filter states (`?brand=`, `?district=` …) get the plain shell and `X-Robots-Tag: noindex, follow`; they canonicalise
to the unfiltered listing (Book 1 Part B §7.4).

### 2.2 Head tags (`client/src/components/Seo.jsx`)
- Title ("… · StartNet" only when the title doesn't already name StartNet), meta description, `robots`
  (`max-snippet:-1, max-image-preview:large` so engines may quote and preview fully).
- Self-referencing canonical; hreflang `en-IN`, `ta-IN`, `x-default` → English (Book 1 Part B §7.4).
- Open Graph and Twitter cards with the brand's share image, locale `en_IN` / `ta_IN`.
- Page-level JSON-LD through the `jsonLd` prop.

### 2.3 Structured data (Book 1 §9.4, Book 3 §5.7)
| Type | Where | Guard |
|---|---|---|
| Organization, WebSite + SearchAction | Every page (`index.html`) | Legal name, registered office, office location, founding date and `sameAs` (LinkedIn, X, YouTube, StartNet Vibe LinkedIn) confirmed by StartNet, Oct 2026; no telephone or Instagram until supplied |
| BreadcrumbList | Every L2+ page (`Breadcrumbs`) | |
| FAQPage | Every `Accordion faq` | Plain-text answers only |
| Course | Academy, Fellowship, Launchpad, Founder Switch, Rise Academy, programme pages | Price only when "free" or a real number |
| Event | Event edition pages | Only when `dateConfirmed` and a real venue or city exist |
| Article / Report / NewsArticle | Stories, reports, press releases | Never for placeholder stories |
| ItemList / CollectionPage | Hubs and listings | |
| Dataset | Founder Ledger periods | No values that are still placeholders |
| JobPosting | Careers detail | Only for real roles |

Builders live in `client/src/lib/seo.js` (`courseLd`, `eventLd`, `articleLd`, `itemListLd`, `faqLd`, `webPageLd`).

### 2.4 Sitemap
`/sitemap.xml` lists every indexable English URL and its Tamil mirror with `xhtml:link` alternates (`en-IN`,
`ta-IN`, `x-default`) and `lastmod` from the data. Pages that the rendered app marks `noindex` (thin district pages,
placeholder-only templates) are left out automatically, from the prerender manifest.

### 2.5 AI engines (GEO)
- `robots.txt` allows all public pages for search engines and names these AI crawlers explicitly: GPTBot,
  OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User,
  Google-Extended, Applebot-Extended, Amazonbot, DuckAssistBot, meta-externalagent, CCBot and cohere-ai.
  **Decision for StartNet:** GPTBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent and cohere-ai also
  collect training data. Keeping them allowed maximises how often AI assistants know and cite StartNet. To opt out of
  training only, remove those names from `AI_AGENTS` in `server/src/common/sitemap.ts` and add a
  `Disallow: /` group for them.
- `/llms.txt`: what StartNet is, the four brands and StartNet X, the evidence rules, then every public page with its
  description. `/llms-full.txt`: the full text of the key pages. Both are regenerated by every prerender.
- Entity consistency: the same name ("StartNet"), slogan, description and brand list appear in the Organization
  markup, llms.txt, the home page and the About page, so engines resolve StartNet as one entity in Tamil Nadu (and do
  not confuse it with other organisations of the same name).

### 2.6 Keywords
Titles and descriptions were rewritten around the Book 1 §9.2 keyword themes. The page-by-page map is in §4.

## 3. Launch checklist (needs StartNet; cannot be done in code)

1. **Google Search Console and Bing Webmaster Tools**: verify `startnet.in` (DNS TXT), submit `/sitemap.xml`,
   and register the legacy domains listed in Book 1 Part B §7.3 so their 301s are credited. Bing also feeds ChatGPT
   search and Copilot, so Bing Webmaster matters for GEO too.
2. **Redirect map** (Book 1 §9.1, Part B §7.3): crawl the current startnet.in, startnetvibe.in and others, then
   map every legacy URL that has backlinks to its new page with a single 301. The paths are still placeholders in Book 1.
3. **Google Business Profile** for the Salem office (Book 1 §9.3) with the same name, address and phone as the site
   (office: 5, 1st Floor, Sri Devaki Complex, 131/5, Nagaramalai Main Road, NDS Nagar, New Fairlands, Salem 636016).
4. **Organization facts**: done for legal name (StartNet Ventures Private Limited, CIN U70200TZ2023PTC028823),
   registered address (Salem), founding date (4 July 2023) and the LinkedIn, X and YouTube profiles (Oct 2026).
   Still to come: phone, logo files and Instagram; add them to the Organization JSON-LD in `client/index.html`
   (`telephone`, `sameAs`). `sameAs` is one of the strongest signals for AI engines that a profile is
   really StartNet.
5. **Confirmed event dates and venues**: each one turns on Event rich results automatically (`dateConfirmed: true`
   in `server/data/events.json`, then re-run `npm run prerender`).
6. **The event archive** (Book 1 §9.5): past events since 2023 with names, dates, cities and permitted speakers.
   Dated so far: GenAI Connect 2024, D2C Connect 2024, SaaS Connect 2025, Vibe Marketing Summit 2025, Vibathon 2025.
   It is the largest content gap, and the cheapest to close.
7. **Real figures, stories, partners and people**: pages with placeholders rank and get cited far less. Founder
   stories with consent are the single best content for both search and AI answers.
8. **Wikidata / Wikipedia**: once StartNet has independent press coverage, a Wikidata item (official website,
   founding date, headquarters, logo) helps knowledge panels and AI engines.
9. **Digital PR and links**: listings on StartupTN, partner colleges, TiE chapters, government portals and the
   press. Mentions and links from these trusted Tamil Nadu sources are what lift rankings for "startup … Tamil Nadu"
   queries.
10. **Native Tamil review** of every Tamil title and description (marked `// SEO-TA: pending native review`), with
    Tamil search-volume checks, as Book 1 §9.2 requires.
11. **Monitoring**: Search Console (queries, Core Web Vitals, rich results), Bing Webmaster, and a monthly check of
    how ChatGPT, Perplexity and Gemini answer "startup programmes in Tamil Nadu", "AI hackathon for students in Tamil
    Nadu", "women entrepreneur programmes Tamil Nadu" and the other §4 queries.

## 4. Keyword map

Research: Book 1 §9.2 themes, checked against how StartupTN, TANSEED, IIT Madras Incubation Cell, TiE Chennai,
Smart India Hackathon, iTNT Hub and the state women's schemes (TWEES, TN-RISE, Vetri Magalir) title their pages.
Search volumes still need a proper tool (Google Keyword Planner, Ahrefs or Semrush), and the Tamil terms need native editors.

| Page | Title (EN) | Primary keyword |
|---|---|---|
| `/` | StartNet: Tamil Nadu's startup and founder-making network | startup network Tamil Nadu |
| `/about` | About StartNet: Tamil Nadu's founder-making network | startup ecosystem Tamil Nadu |
| `/brands` | StartNet brands: Research, Vibe, Connect and Women | StartNet brands |
| `/research` | StartNet Research: spinouts for PhD scholars and faculty | university spinout, faculty startup |
| `/research/fellowship` | Scholar Founders Fellowship for PhD scholars | fellowship for PhD scholars |
| `/research/terms` | University spinout terms (draft) | university spinout terms India (noindex until legal review) |
| `/vibe` | StartNet Vibe: AI hackathon and startups for students | AI hackathon for college students Tamil Nadu |
| `/vibe/vibathon` | Vibathon 2027: Tamil Nadu's AI build hackathon (Book 2) | AI hackathon Tamil Nadu |
| `/vibe/academy` | Vibe Academy: vibe coding course for students | vibe coding course |
| `/vibe/launchpad` | Vibe Launchpad: 12-week student pre-incubation | student pre-incubation |
| `/vibe/clubs` | Vibe Clubs: start a student startup club | student startup club |
| `/connect` | StartNet Connect: from professional to startup founder | professional to founder, co-founder matching Chennai |
| `/connect/founder-switch` | Founder Switch: from job to startup in 12 weeks | job to startup |
| `/connect/<sector>` | `<Sector>` Connect: `<sector>` founder community | GenAI / SaaS / D2C community Chennai |
| `/connect/angels` | StartNet Angels: an angel network of founders | angel network Tamil Nadu |
| `/women` | StartNet Women: for women entrepreneurs in Tamil Nadu | women entrepreneurs Tamil Nadu |
| `/women/hercapital` | HerCapital: funding schemes for women founders | women entrepreneur schemes Tamil Nadu |
| `/women/rise-academy` | Rise Academy: business course for women founders | business course for women |
| `/programmes` | Startup programmes in Tamil Nadu: find yours | startup programmes in Tamil Nadu |
| `/programmes/<slug>` | `<Name>`: `<what it is>` in Tamil Nadu | per programme |
| `/events` | Startup events in Tamil Nadu: find one near you | startup events Chennai / Coimbatore / Madurai |
| `/events/<series>` | `<Series>` editions: `<phrase>` in Tamil Nadu | e.g. AI hackathon Tamil Nadu |
| `/districts/<district>` | `<District>` startup events and Circles | startup events `<district>` (noindex until there is real local activity) |
| `/insights` | Tamil Nadu startup data and founder reports | Tamil Nadu startup statistics |
| `/insights/founder-ledger` | Founder Ledger: Tamil Nadu founders by district | startups by district Tamil Nadu |
| `/startnet-x` | StartNet X: one free founder profile for every step | founder profile platform |
| `/partner` | Startup partnerships in Tamil Nadu: partner with StartNet | startup partnership Tamil Nadu |
| `/partner/csr` | CSR partnership for startups in Tamil Nadu | CSR partnership startups |
| `/partner/institutions` | College incubation partnership in Tamil Nadu | college incubation partnership |
| `/contact` | Contact StartNet: programmes, events, partnerships | contact StartNet |

Each Tamil page has its own Tamil title and description using the Book 1 §9.2 Tamil themes (ஸ்டார்ட்அப்,
தொழில்முனைவோர், பெண் தொழில்முனைவோர், கல்லூரி மாணவர்களுக்கான ஹேக்கத்தான், ஆராய்ச்சியிலிருந்து நிறுவனம், AI பயிற்சி
தமிழில்). All of them are marked `// SEO-TA: pending native review`.

### Answer blocks (AEO)
"Common questions" FAQs (with FAQPage markup that matches the visible text) are on Home, /about, /brands, the four
brand homes, /programmes, /events, /startnet-x and /partner, and existing FAQs elsewhere now feed markup too.
Answers only restate facts already on the page or in Books 1–2, and are marked `// AEO FAQ: … StartNet review`.
Any answer still carrying a placeholder or `[C]` mark is shown on the page but left out of the markup.

### Indexing rules now in force (98 of 416 URLs noindex, all `noindex, follow`)
- District pages: indexed only with real local activity (an event with a real city or venue, or an entry in
  `DISTRICT_ACTIVITY` in `client/src/pages/mega/about-districts/districtsData.js`). Today all 38 are noindex.
- Connect sector pages: indexed only if the sector is running or has an upcoming event.
- Brand stories pages, placeholder founder stories, press releases and jobs with placeholder titles: noindex until
  there is real content.
- `/research/terms` (legal draft), `/vibe/summit` (all details placeholder), `/search`, `/signin`, `/signup`, `/go/*`.
- Every noindex page is left out of `/sitemap.xml` automatically.

## 5. Results at hand-over (2026-10-08)

| Check | Result |
|---|---|
| Pages prerendered (EN + TA) | 416 of 416 (2–4 min per full run) |
| Indexable pages in sitemap.xml | 318 |
| Titles over 60 characters, descriptions outside 70–160, pages without exactly one h1 | 0 |
| Duplicate titles or descriptions (including EN vs TA) | 0 |
| FAQPage blocks | 118 pages, 506 answers, every one present in the page HTML |
| JSON-LD types | Organization, WebSite, WebPage, AboutPage, CollectionPage, ContactPage, ItemList, BreadcrumbList, FAQPage, Course, Dataset, Article, Person |
| Snapshot → live app hand-over | 0.2–0.6 s on desktop and 375px phones, no console errors |
| Words per indexable page in the crawlable HTML | median 434 (Home 2,216) |
