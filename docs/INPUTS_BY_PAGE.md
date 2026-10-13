# StartNet inputs, mapped to pages and files

Source: `docs/StartNet_Inputs_Needed_v2.pdf` (HTML source `docs/inputs/StartNet_Inputs_Needed_v2.html`, prepared
10 Oct 2026). Cross-checked against the code on 13 Oct 2026: `client/src/App.jsx` routes, `server/data/*.json`,
`client/src/data/*.js`, the page folders, `README.md` (Placeholder register), `docs/AUDIT_REPORT.md` (Needs StartNet),
`docs/PHOTOS.md`, `docs/IMAGE-PLAN.md` §4 and `docs/VIDEOS.md`.

Routes are shown without the `/ta` prefix; every route also exists under `/ta/...`. Marks used below:
**(hidden)** means the code hides the line until the value arrives, so nothing visible is wrong today.
**(?)** means the mapping is inferred and not confirmed in code.

## 1. What the PDF asks for

The PDF has 7 sections and 44 rows. The 10 photo rows cover 17 shots (G1 to G17).

| § | Section | Rows | Status in the PDF |
|---|---|---|---|
| 1 | Launch blockers | 8 | 2 DONE (WhatsApp number, the four main inboxes), 1 PART (grievance officer), 5 open at P1 |
| 2 | Content and data | 10 | P1: events, programmes. P2: metrics, stories, people, partners, ledger and reports, history. P3: press and jobs, childcare |
| 3 | Photographs to commission | 10 rows (17 shots) | P1: G1, G2, G14. P2: G3 to G12. P3: G13, G15 to G17 |
| 4 | Videos | 4 | P2: highlight reels. P3: the rest |
| 5 | Tamil | 3 | P1: native review, tagline. P2: body copy |
| 6 | Brand book | 4 | P2: Pantone/CMYK. P3: the rest |
| 7 | Decisions | 5 | Recommendations only, no priority |

Open P1 rows: 12 (blockers 2 to 6, events, programmes, G1, G2, G14, Tamil review, Tamil tagline), plus the partly
done grievance-officer row.

**Note on the headline counts.** The PDF summary says "5 launch blockers open (3 of 8 done)". It counts the PART row as
done. In the data files, events alone have 67 open marks or null fields; the PDF says 52, which presumably leaves out
the `dateConfirmed:false` flags. Programmes have 51 (PDF: 34), metrics 22 null values plus 6 missing `asAt` (matches
the PDF), people 13 (matches), stories 26 marks across 6 records (PDF: 20), and the ledger 55 null/placeholder fields.

## 2. Each input: category, priority, pages, and where the value goes

### §1 Launch blockers

| # | Input | Pri | Pages that show or depend on it | Where the value goes |
|---|---|---|---|---|
| 1.1 | WhatsApp number | DONE | Every `waLink()` link: header/drawer, bottom bar, Vibathon, events, brand pages | env `VITE_WHATSAPP_NUMBER`. Already set in `client/.env` (`919884898206`). Fallback `910000000000` in `client/src/lib/links.js`. The production build must also set it |
| 1.2 | DNS for x.startnet.in (StartNet X) | P1 | Every "Sign in / Join / Register / Apply" link (`snxLink()`): `/signin`, `/signup`, `/join`, `/startnet-x` and all subpages, `/vibe/vibathon`, `/events/:series/:edition`, `/programmes/:slug`, the brand homes, `/go/vibathon-2027`, the 404 page, header and mega menu | DNS, or env `VITE_SNX_ORIGIN` (default `https://x.startnet.in`, `client/src/lib/links.js`). Deep-link paths: `snxPath` in `server/data/programmes.json`, plus the hard-coded paths in `connectData.js`, `vibeContent.js`, `VibeSub.jsx` and others (see §4 gaps) |
| 1.3 | Hosting: domain, host, `TRUST_PROXY`, `CORS_ORIGINS` | P1 | No visible page. Affects every response (headers, caching, redirects, sitemap) | Server env `TRUST_PROXY`, `CORS_ORIGINS` (`server/src/main.ts`). Client env `VITE_SITE_ORIGIN` (canonical/hreflang/JSON-LD, default `https://startnet.in`, `client/src/lib/seo.js`) |
| 1.4 | Palette sign-off (#EF4444 / #0C1719 / #FBA62A / #117780) | P1 | Already live site-wide. Palette shown on `/media/kit` | `client/src/styles/tokens.css` (`--sn-red`, `--sn-ink`, `--marigold`, `--lagoon`). No change is needed if signed off. README still lists the old Red `#E5322D` (doc drift) |
| 1.5 | Logo vector files | P1 | Header, footer and drawer logo (all pages, `components/Logo.jsx`). `/media/kit` "Master vector logo files" line **(hidden)** | Replace the drawn `client/src/components/Logo.jsx`. Downloadable files for `/media/kit` (`pages/mega/media-careers/MediaKit.jsx`, about line 265) |
| 1.6 | Legal texts "[to be drafted by counsel]" and the disclosure-statement link | P1 | `/legal/terms` (about + liability sections), `/legal/sponsorship-terms` (commercial terms). Sections that are only placeholders are **(hidden)**. Disclosure link: `/about/thinktn-alliance` (link slot **(hidden)**, `ThinkTN.jsx` line 213) and possibly `/startnet-x/investors` (related-party card) **(?)** | `client/src/pages/utility/legalContent.js` (+ `legalContent.ta.js`), sections `terms` and `sponsorship-terms`. Disclosure URL goes in `pages/about/ThinkTN.jsx` |
| 1.7 | Grievance officer name and response time | PART | `/legal/grievance` (name + "Response time: [placeholder]"), `/legal/privacy` and `/legal/data-rights` (name inside the GRIEVANCE line). The email is live on `/contact`, `/about/governance`, `/startnet-x/agents` | `legalContent.js` const `GRIEVANCE` ("[placeholder — name]") and the `grievance.contact` block; Tamil copy in `legalContent.ta.js` |
| 1.8 | hello@, partners@, press@, careers@ inboxes | DONE | `/contact`, `/media`, `/careers`. **Still open:** research@, vibe@, connect@, women@ show `[confirm]` on `/contact` | `client/src/pages/utility/Contact.jsx` (`BRAND_MAILS` + `<Placeholder>[confirm]</Placeholder>`, line 96) |

### §2 Content and data

| # | Input | Pri | Pages | Where the value goes |
|---|---|---|---|---|
| 2.1 | Events: dates, venues, fees, sponsors, jury, registration; past attendance | P1 | `/events`, `/events/past`, all series pages `/events/<series>` and editions (list below), Home event cards, `/vibe/events`, `/connect/events`, `/research/events`, `/women/events`, `/connect/genai`, `/connect/saas`, `/connect/d2c`, `/vibe/campus`, `/vibe/summit`, `/research/lab-to-market-summit`, `/women/summit`, `/women/summit/awards`, `/districts/:district`, `/insights/newsletter`, `/vibe/vibathon` (finale date and venue only) | `server/data/events.json` per slug: `date`/`endDate`, `dateConfirmed`, `dateLabel`, `venue`, `city`, `district`, `price`/`priceNote`, `summary` (attendance + A/B tag), `coHost`, `jury`, `registrationCloses`, `timeline`, `tracks`, `prizes`, `sponsorTiers`, `faq`. **Also duplicated in client code:** `client/src/pages/brands/vibe/vibeContent.js` (`VIBATHON_REGISTRATION {opens, closes}`, `VIBATHON_TIMELINE`, prizes, fees, FAQ), `client/src/pages/mega/utility-campaign/campaigns.js` (`/go/vibathon-2027` copy), `client/src/pages/mega/events-series/seriesData.js` (series descriptions, "Date and venue: [placeholder]", "[placeholder — jury]") |
| 2.2 | Programmes: fees/rate cards, funding, eligibility, jury, terms, providers | P1 | `/programmes`, `/programmes/open-calls` (every `applyBy` is null), `/programmes/<slug>` for the 20 slugs, Home "open now" (HomeRest), brand sub-pages `/vibe/academy`, `/vibe/campus`, `/vibe/launchpad`, `/vibe/clubs`, `/vibe/summit`, `/research/fellowship`, `/research/labs`, `/research/lab-to-market-summit`, `/connect/series`, `/connect/founder-switch`, `/connect/circles`, `/connect/scale`, `/connect/angels`, `/women/circles`, `/women/rise-academy`, `/women/hercapital`, `/women/summit`, `/women` (fees in the FAQ) | `server/data/programmes.json`: `price`, `priceNote`, `applyBy`, `statusNote`, `formatNote`, `eligibility[]`, `summary` (startnet-angels partner, WFS jury), `sectors[].status` (connect-series `[proposed]`). **Hard-coded duplicates:** `pages/brands/connect/ConnectSub.jsx` and `ConnectBits.jsx` (Founder Switch rate card), `pages/brands/women/WomenHome.jsx`, `WomenSub.jsx` and `womenContent.js` (Rise Academy fee, Circles CSR places), `pages/brands/vibe/VibeSub.jsx` (Launchpad funding), `pages/brands/research/researchContent.js` (fellowship fee/date) |
| 2.3 | Metrics: 22 null values + 6 missing as-at dates | P2 | `/` (proof band: founders nurtured, events run, institutions), `/about/mission-1-lakh` (progress meter), `/about` (Vibathon 2025 figure), `/research`, `/vibe`, `/connect`, `/women` (brand proof bands), `/insights/founder-ledger` (headline KPIs), `/about/self-diagnosis`, `/events/host`, `/events/<series>` (series figures, e.g. `connect-attendees`), `/insights/indices/:index`, `/insights/reports/:slug`, `/go/vibathon-2027`, the mega menu | `server/data/metrics.json` `value`, `tag`, `asAt`, `source`. Null ids: founders-nurtured, events-run, institutions-worked-with, mission-1-lakh-progress, startups-launched, capital-raised, pilots-signed, women-share, districts-active, research-partner-institutions, research-fellows, research-companies-formed, vibe-colleges-active, vibathon-2025-participants, vibe-launchpad-teams, connect-events-run, connect-attendees, connect-circle-members, connect-capital-raised, women-circles-active, rise-academy-graduates, hercapital-capital-raised. Missing `asAt`: vibathon-2025-tier-3-4-colleges, tn-higher-education-ger, tn-phd-enrolments, vibathon-2025-prize-pool, tanseed-women-led, vetri-magalir-loans. Fallback copies: `pages/home/homeMetrics.js` |
| 2.4 | Founder stories (with written consent) | P2 | `/insights/stories`, `/insights/stories/founder-story-{research,vibe,connect,women}`, `/research/stories`, `/vibe/stories`, `/connect/stories`, `/women/stories`, `/insights`, Home story cards, `/vibe` and `/women` story sections. Also `/insights/stories/vibathon-2025-recap` and `five-years-of-rooms` (one placeholder paragraph each) | `server/data/stories.json`: replace the 4 `placeholder: true` records (`title`, `person`, `district`, `excerpt`, `body`, `date`), and fill `body[3]` / `body[2]` of the two recaps. Photo: `photos/originals/story/<slug>.jpg` |
| 2.5 | People: leadership bios, brand leads, advisory councils, speakers, jury | P2 | `/about/leadership` (all three groups), `/media` (leadership), `/events/:series/:edition/speakers` (names come from `agenda[].speaker`, plus `jury`), `/vibe/vibathon` (jury), `/research/labs/:lab` ("Lab Director", "Host institution", "Industry sponsors" show `[placeholder]`), `/women/summit/awards` | `server/data/people.json` (`fullBio`, `titleNote` for poonthamil, `name` for 5 brand leads and 4 advisory councils). Speakers: `server/data/events.json` `agenda[]` (no edition has one yet). Jury: `events.json` `jury`. Lab roles: `client/src/pages/mega/brand-sub/ResearchLab.jsx` lines 180 to 182 (hard-coded) |
| 2.6 | Signed partners and sponsors (SVG logos + agreements) | P2 | Logo walls (empty by design): `/`, `/about`, `/partner`, `/partner/:type`, `/partner/our-partners`. Tenant lists on `/startnet-x`, `/startnet-x/institutions`, `/startnet-x/incubators`, `/startnet-x/gccs` **(hidden)**. Lab sponsor on `/research/labs/:lab` **(hidden)**. Report sponsor on `/insights/reports/tn-founder-report-2027` | `server/data/partners.json` (empty array; needs `agreementStatus: "signed"` + logo permission). `reports.json` `sponsorLine` |
| 2.7 | Founder Ledger figures, report files and dates, index scores | P2 | `/insights/founder-ledger`, `/insights/founder-ledger/:period`, `/insights/founder-ledger/methodology` (3 lines **(hidden)**), `/insights/founder-ledger/corrections`, `/insights`, `/about/mission-1-lakh`, `/media`, `/partner` (LedgerProof), `/districts/:district` (by district), Home Updates tab, `/insights/reports`, `/insights/reports/:slug`, `/insights/indices`, `/insights/indices/:index`, `/about/self-diagnosis` | `server/data/ledger.json` (`asAt`, `published`, `nextEdition`, `mission.current`, `ladder[]`, `byBrand[]`, `byDistrict[]`, `outcomes[]`, `womenShare`). `server/data/reports.json` (`statusLabel`, `formats[]` = files, `url`, `sponsorLine`). Index definitions and scores: `client/src/pages/mega/insights-reports/indexContent.js` |
| 2.8 | Company history: first event, milestones with dates | P2 | `/about` timeline (the "first-events" note is **(hidden)**, and the Investors Summit entry has `date: null`), `/events/investors-summit/archive` | `client/src/pages/about/About.jsx` `milestones()` (lines 130 to 165). `server/data/events.json` `investors-summit-archive` (`date`, `city`, `district`, `summary`) |
| 2.9 | Press releases and job openings | P3 | `/media`, `/media/releases/:slug`, `/careers`, `/careers/:slug`, Home Updates tab | `server/data/press.json`, `server/data/careers.json` (both empty arrays) |
| 2.10 | Childcare at flagship events | P3 | `/women` ("Designed for you" card + FAQ; the FAQ answer is kept out of the JSON-LD) | `client/src/pages/brands/women/womenContent.js` (`DESIGN_FOR_YOU[0].placeholder`, `FAQ` answer at line 222 + Ta) |

Event pages that depend on 2.1:

| Edition route | events.json slug | Open fields |
|---|---|---|
| `/events/vibathon/2027` (+ `/agenda`, `/speakers`), `/vibe/vibathon`, `/go/vibathon-2027` | `vibathon-2027` | 24: date, registration close, venue, fee, 2027 format, timeline dates, district count, tracks, prizes, jury, sponsor tier |
| `/events/vibathon/2027-district-qualifiers` | `vibathon-2027-district-qualifiers` | date, district count, venue, fee |
| `/events/vibe-campus/build-nights-2026` | `vibe-campus-build-nights-2026` | dates, venue |
| `/events/vibe-summit/2027` | `vibe-summit-2027` | date, venue, fee |
| `/events/genai-connect/2027`, `/events/saas-connect/2027`, `/events/d2c-connect/2027` | `*-connect-2027` | date, venue, fee |
| `/events/lab-to-market-summit/2027` | `lab-to-market-summit-2027` | date, venue, co-host, fee |
| `/events/women-founders-summit/2027` | `women-founders-summit-2027` | date, venue, fee, jury |
| `/events/vibathon/2025` | `vibathon-2025` | fee note, summary (attendance) |
| `/events/vibe-marketing-summit-2025` (EventDetail; empty `series`) | `vibe-marketing-summit-2025` | language, fee, attendance |
| `/events/genai-connect/2024`, `/events/d2c-connect/2024`, `/events/saas-connect/2025` | same | attendance (A/B), fee note |
| `/events/investors-summit/archive` | `investors-summit-archive` | date, city, district, fee, summary |
| `/events/research-days`, `/events/founders-day` | (no events) | Series pages only; descriptions are placeholders in `seriesData.js` / `FoundersDay.jsx` |

### §3 Photographs (drop into `photos/originals/`, run `npm run photos`, then switch the `motion` entry in `client/src/data/imagePlan.js`)

| # | Shot | Pri | Pages | File(s) |
|---|---|---|---|---|
| G1 | Vibathon 2025 originals (now 572 px) | P1 | `/vibe/vibathon`, `/events/vibathon`, `/events/vibathon/2025`, `/vibe/events`, `/insights/stories/vibathon-2025-recap`, `/about` timeline, later the 2027 posters | `event/vibathon/2025.jpg`, `2025-2 … -6.jpg` |
| G2 | High-res stage stills (now 1280 px video frames) | P1 | `/about`, `/events`, `/partner`, `/partner/investors`, `/media`, `/insights/stories/five-years-of-rooms`, Connect tile on `/brands` and Home | `pool/stage/01, 05, 09, 11, 12.jpg` (replace) |
| G3 | GenAI Connect 2024 | P2 | `/events/genai-connect`, `/events/genai-connect/2024`, `/events/genai-connect/2027`, `/connect/events`, `/connect/genai` | `event/genai-connect/2024.jpg` (+ `-2 …`) |
| G4 | D2C Connect 2024 | P2 | `/events/d2c-connect`, `/2024`, `/2027`, `/connect/events`, `/connect/d2c` | `event/d2c-connect/2024.jpg` (+ `-2 …`) |
| G5 to G10 | VMS 2025, Vibe Campus, Lab-to-Market, Women Founders Summit + Awards, Vibe Summit, Investors Summit | P2 | `/events/vibe-marketing-summit-2025`, `/events/vibe-campus` (+ edition), `/vibe/campus`, `/vibe/events`, `/events/lab-to-market-summit` (+2027), `/research/events`, `/research/lab-to-market-summit`, `/events/women-founders-summit` (+2027), `/women/summit`, `/women/summit/awards`, `/women/events`, `/women/circles`, `/events/vibe-summit` (+2027), `/vibe/summit`, `/events/investors-summit` (+archive), `/about` timeline | `event/vibe-marketing-summit-2025.jpg`, `event/vibe-campus.jpg`, `event/lab-to-market-summit.jpg`, `event/women-founders-summit.jpg`, `event/vibe-summit.jpg`, `event/investors-summit/<year>.jpg` |
| G11 | Research labs at work | P2 | `/research/labs/agentic-ai`, `/ontology-knowledge`, `/physical-ai`, `/drug-discovery`, `/research/labs` | `hero/research/labs/<lab>.jpg` |
| G12 | Brand heroes: StartNet room, Women Circle, scholar | P2 | `/`, `/women`, `/research` (also `/vibe`, now 1152 px) | `hero/home.jpg`, `hero/women.jpg`, `hero/research.jpg`, `hero/vibe.jpg` |
| G13 | Salem office | P3 | `/contact` | `hero/contact.jpg` |
| G14 | Leadership portraits (consent) | P1 | `/about/leadership`, `/media` | `person/m-k-elango.jpg`, `person/v-nagaraj.jpg`, `person/poonthamil.jpg` + `.json` with `"consent": true` |
| G15 to G17 | Rise Academy on a phone; GCC pilot / partner-college grads; team at work | P3 | `/women` (Rise Academy block), `/women/rise-academy`, `/partner/gccs`, `/partner/institutions`, `/careers` | `hero/women/rise-academy.jpg`, `hero/partner/gccs.jpg`, `hero/partner/institutions.jpg`, `hero/careers.jpg` |

### §4 Videos (one entry per video in `client/src/data/videos.js`: `id`, `series`/`edition` or `place`)

| # | Input | Pri | Pages | Where |
|---|---|---|---|---|
| 4.1 | Highlight reels: Vibathon 2025, VMS 2025, Vibe at TNGSS 2025, SaaS Connect 2025, more GenAI Connect 2024 | P2 | `/vibe/vibathon`, `/events/vibathon/2025`, `/events/vibe-marketing-summit-2025`, `/events/saas-connect` + `/2025`, `/connect/saas`, `/events/genai-connect` + `/2024`, `/connect/genai`, `/events/past`. TNGSS 2025 has no page **(?)** | `videos.js` (`videosFor(series, edition)`), `docs/VIDEOS.md` |
| 4.2 | Titles and speakers for the Feb 2024 C00xx files and the July 2023 ChatGPT clip | P3 | None yet. `S44yEwSjd1E` is in `videos.js` with place `about-early-events` (not placed); Leadership was suggested for `tAbBIAYK_rs` | `videos.js` caption fields |
| 4.3 | Permission for the LocalKart keynote (`Qfoy5J8-iWA`) | P3 | `/about/leadership` (proposed) | `videos.js` new entry |
| 4.4 | Is @startnetresearch StartNet's channel? | P3 | None (NIRF promo not placed) | `videos.js` if yes |

### §5 Tamil

| # | Input | Pri | Pages | Where |
|---|---|---|---|---|
| 5.1 | Native review of all drafted Tamil | P1 | All `/ta/*` routes; the consent banner on every page; Vibathon labels on `/ta/vibe/vibathon` | Every `*Ta` field in `server/data/*.json` (status in `server/data/i18n-status.json`), `t('en','ta')` strings across `client/src/pages`, `layout/ConsentBanner.jsx`, `pages/home/homeI18n.js`, `pages/snx/snxTamil.js`, `pages/utility/legalContent.ta.js`. Search for `SEO-TA: pending native review` |
| 5.2 | Tagline "ஒவ்வொரு திறமையும் ஒரு நிறுவனர்." | P1 | `/ta` (Home), footer on every page, `/ta/about`, `/ta/media`, `/ta/media/kit`, story pages | 11 occurrences in `pages/Home.jsx`, `layout/Footer.jsx`, `pages/utility/Media.jsx`, `pages/about/About.jsx`, `pages/about/EngineMatrix.jsx`, `pages/mega/media-careers/shared.jsx`, `pages/insights/StoryDetail.jsx` |
| 5.3 | Tamil body copy and short Tamil event summaries | P2 | Most `/ta` brand and event pages (shown as `lang="en"`), especially `/ta/research` and `/ta/events/:series/:edition` heroes | `*Ta` siblings in `events.json` (`summaryTa`), `programmes.json` (eligibility, outcomes, forWhom are not translated), page copy files (`vibeContent.js`, `researchContent.js`, `connectData.js`, `womenContent.js`) |

### §6 Brand book

| # | Input | Pri | Pages | Where |
|---|---|---|---|---|
| 6.1 | Pantone and press CMYK | P2 | `/media/kit` (line **(hidden)**) | `pages/mega/media-careers/MediaKit.jsx` (around line 382) + brand book |
| 6.2 | Tamil specimen test on Android phones | P3 | None directly (affects all `/ta`) | Fonts in `client/src/styles/` (no page slot) |
| 6.3 | Vibathon wordmark artwork | P3 | `/vibe/vibathon` would use it **(?)** | No slot in code; the Vibathon heading is set in type |
| 6.4 | Certificate signatories and verification URL | P3 | None. No certificate page or verification route exists | StartNet X (outside this repo) |

### §7 Decisions

| # | Question | Pages affected | Where it is implemented |
|---|---|---|---|
| 7.1 | Hide placeholder founder stories? | `/insights/stories`, `/insights/stories/founder-story-*`, `/<brand>/stories`, Home | `server/data/stories.json` (`placeholder: true`), filter in `pages/insights/Stories.jsx` / `BrandStories.jsx`. Already out of the sitemap (`server/src/common/sitemap.ts`) |
| 7.2 | Index `/agenda` and `/speakers` tabs? | `/events/:series/:edition/agenda`, `/speakers` | `EditionPage.jsx` (canonicals to the edition today), `server/src/common/sitemap.ts` |
| 7.3 | True 404 for unknown slugs | `/vibe/foo` etc. | `server/src/common/spa.ts`. Audit follow-up (6 Oct) says this is already done: "unknown slugs return 404" |
| 7.4 | Shorter cookie banner at 320 px | Every page | `client/src/layout/ConsentBanner.jsx` / `.css` |
| 7.5 | Keep the 39 stock photos until shots arrive | All slots with `pool/research|students|professionals|women|platform|insights` | `client/src/data/imagePlan.js`, `client/src/data/photos.js` |

## 3. Reverse view: what each page is waiting on

Item numbers refer to section 2. Tamil review (5.1) and, where relevant, Tamil body copy (5.3) apply to every
`/ta` page and are not repeated below. 1.2 (StartNet X DNS) applies to every page with a Sign in, Join, Register or
Apply button, which includes the header.

**Site-wide (header, footer, drawer):** 1.2, 1.3, 1.4, 1.5 logo, 5.2 tagline in the footer, 7.4 cookie banner, social
handle for Instagram (gap G-1).

### Home
- `/`: 2.3 (founders nurtured, events run, institutions), 2.1 (event cards), 2.4 (story cards), 2.6 (logo wall),
  2.2 (open programmes), 2.7 and 2.9 (Updates tabs: ledger, press), G12 `hero/home`, G2 (Connect tile), 5.2 on `/ta`.
- `/join`: 1.2.

### About
- `/about`: 2.8 history and the Investors Summit year, 2.3 (Vibathon 2025 figure as-at), 2.6 logo wall, G1 and G10
  (timeline), G2 (hero).
- `/about/mission-1-lakh`: 2.3 `mission-1-lakh-progress`, 2.7 `ledger.mission.current`.
- `/about/leadership`: 2.5 (bios, Poonthamil's title note, 5 brand leads, 4 advisory councils), G14, 4.3.
- `/about/governance`: `[proposed]` mark on governance structure (gap G-6). Grievance email is already live.
- `/about/thinktn-alliance`: 1.6 disclosure link **(hidden)**.
- `/about/self-diagnosis`: 2.7 (`self-diagnosis-2027` first edition date), 2.3 (ledger KPIs).
- `/about/how-we-work`, `/about/evidence-standard`: no data placeholders found.

### Research
- `/research`: 2.3 (research proof band), 2.1 (upcoming L2M), 2.2 (fellowship fee/date in the FAQ, **(hidden)** when only a placeholder), G12 `hero/research`.
- `/research/fellowship`: 2.2 (`scholar-founders-fellowship` date, format, fee).
- `/research/lab-to-market-summit`: 2.1 / 2.2 (dates, venue, co-host **(hidden)**, fee), G7.
- `/research/labs`, `/research/labs/:lab` (4 labs): 2.5 (host institution, industry sponsors, Lab Director show `[placeholder]`), 2.6 (sponsor **(hidden)**), problem-statement dates **(hidden)**, G11.
- `/research/institution-partner-programme`, `/research/problem-statements`, `/research/terms`: 2.2 (`applyBy`).
- `/research/stories`: 2.4. `/research/events`: 2.1, G7.

### Vibe
- `/vibe`: 2.3 (vibe proof band), 2.2, 2.4, G12 `hero/vibe`.
- `/vibe/vibathon`: 2.1 (`VIBATHON_REGISTRATION` opens/closes, timeline dates, venue, fee, district count, 2027
  format, tracks, prizes, jury, sponsor tier), 2.2 (eligibility of recent graduates), 2.5 jury, G1, 4.1, 6.3 **(?)**.
- `/vibe/academy`, `/vibe/clubs`: 2.2 (`applyBy`).
- `/vibe/campus`: 2.1 (build-nights dates and venue), G6.
- `/vibe/launchpad`: 2.2 (funding, format).
- `/vibe/summit`: 2.1 / 2.2 (date, venue, fee; agenda **(hidden)**), G9.
- `/vibe/for-colleges`: no specific data placeholder found **(?)**.
- `/vibe/stories`: 2.4. `/vibe/events`: 2.1, G1, G6.

### Connect
- `/connect`: 2.3 (connect proof band), 2.1 (2027 editions).
- `/connect/genai`, `/connect/saas`, `/connect/d2c`: 2.1 (2027 edition), 4.1 (SaaS, GenAI), G3, G4.
- `/connect/series`: 2.2 (fee, six `[proposed]` sectors: the deeptech, fintech, industry-4-0, healthtech, agrifood and climate pages).
- `/connect/founder-switch`: 2.2 (rate card, date, format).
- `/connect/angels`: 2.2 (partner platform or fund, fee).
- `/connect/circles`, `/connect/scale`: 2.2 (`applyBy`).
- `/connect/stories`: 2.4. `/connect/events`: 2.1, G3, G4.

### Women
- `/women`: 2.3 (women proof band), 2.2 (Rise Academy fee, Circles CSR places), 2.10 childcare, G12 `hero/women`, G15.
- `/women/circles`: 2.2, G8. `/women/rise-academy`: 2.2 fee, G15. `/women/hercapital`: 2.2 rate card.
- `/women/summit`, `/women/summit/awards`: 2.1 (dates, venue, fee), 2.5 jury, final award categories **(hidden)**, G8.
- `/women/stories`: 2.4. `/women/events`: 2.1, G8.

### Programmes
- `/programmes`, `/programmes/open-calls`: 2.2 (every `applyBy` is null, so the open-calls list depends on status only).
- `/programmes/<slug>` (20 slugs): 2.2 fields per slug; 1.2 `snxPath`.

### Events
- `/events`, `/events/past`: 2.1, G2 (hero).
- `/events/<series>` (10 series): 2.1, 2.3 (series figures), series descriptions in `seriesData.js`, G1 and G3 to G10.
- Each edition (see the event table in section 2): 2.1, 2.5 (speakers via `agenda[]`, jury), 4.1, G photos, 7.2 for `/agenda` and `/speakers`.
- `/events/host`: 2.3 (`events-run`). `/events/founders-day`: date and venue **(hidden)**, description placeholder.
- `/events/speak`: no data placeholder found.

### Insights
- `/insights`: 2.7, 2.4.
- `/insights/founder-ledger` (+ `/:period`, `/methodology`, `/corrections`): 2.7, 2.3 (headline KPIs), district map
  boundary data **(hidden)** (gap G-5).
- `/insights/stories` (+ `/:slug`): 2.4, 7.1.
- `/insights/reports` (+ `/:slug`), `/insights/indices` (+ `/:index`): 2.7 (dates, files, sponsor, index scores), 2.6 sponsor.
- `/insights/newsletter`: 2.7, 2.1. `/insights/podcast`: no podcast stories in `stories.json` (gap G-9).

### StartNet X
- All `/startnet-x/*` pages: 1.2.
- `/startnet-x`, `/startnet-x/institutions`, `/startnet-x/incubators`, `/startnet-x/gccs`: 2.6 signed tenants **(hidden)**.
- `/startnet-x/investors`: 1.6 disclosure **(?)**.
- `/startnet-x/pricing`: annual price **(hidden)**, GST rate `[confirm rate]` (gap G-3).
- `/startnet-x/developers`: rate limits and licence terms `[placeholder]`, status page URL **(hidden)** (gap G-3).
- `/startnet-x/updates`: release dates **(hidden)**. `/startnet-x/agents`: grievance email already live.
- `/signin`, `/signup`, `/go/vibathon-2027`: 1.2; the campaign page also needs 2.1 and 2.3.

### Partner
- `/partner`: 2.6, 2.7 (LedgerProof), G2.
- `/partner/:type` (8 types): 2.6. `/partner/csr`: CSR receiving entity `[placeholder]` **(?)** (gap G-4). `/partner/investors`: investor relations email `[placeholder]` **(?)** (gap G-4), G2. `/partner/gccs`, `/partner/institutions`: G16.
- `/partner/our-partners`: 2.6. `/partner/enquire`: response SLA `[confirm]` (not shown).

### Media and Careers
- `/media`: 2.9 press, 2.5 leadership, 2.7, G2, G14, 5.2 on `/ta`.
- `/media/kit`: 1.4 palette, 1.5 logo files **(hidden)**, 6.1 Pantone/CMYK **(hidden)**, photo library **(hidden)**.
- `/media/releases/:slug`: 2.9 (no entries, so no pages yet).
- `/careers`, `/careers/:slug`: 2.9 jobs, G17, and two `[confirm]` marks (paid work sample for senior roles; a target note).

### Legal and utility
- `/legal/terms`, `/legal/sponsorship-terms`: 1.6.
- `/legal/grievance`, `/legal/privacy`, `/legal/data-rights`: 1.7. Privacy also needs the list of processors and the storage/retention terms; data-rights needs a response time in days (gap G-2).
- `/legal/cookies` (consent retention months), `/legal/safeguarding` (lead and reporting route), `/legal/accessibility` (audit results), `/legal/refunds` (refund windows), `/legal/code-of-conduct` (text, POSH link, reporting route): gap G-2.
- `/contact`: 1.8 (brand inboxes `[confirm]`), G13.
- `/districts`, `/districts/:district`: 2.7 (`byDistrict` is empty), 2.1 (past events per district).
- `/search`, `/sitemap`, 404: no inputs, apart from 7.3 (done).

## 4. Gaps

### In the code but not in the PDF

| Gap | What is missing | Pages | Where it goes |
|---|---|---|---|
| G-1 | Instagram URL (the entry has no `url`) | Footer (all pages) | `client/src/data/nav.js` `SOCIAL_CHANNELS` |
| G-2 | Legal details beyond the two counsel pages: processors list and retention (privacy), cookie retention months, data-rights response days, safeguarding lead and route, accessibility audit results, refund windows, code-of-conduct text, POSH link, reporting route | `/legal/privacy`, `/legal/cookies`, `/legal/data-rights`, `/legal/safeguarding`, `/legal/accessibility`, `/legal/refunds`, `/legal/code-of-conduct` | `client/src/pages/utility/legalContent.js` + `.ta.js`. The PDF's "legal texts" row names only the two "[to be drafted by counsel]" pages |
| G-3 | StartNet X commercial and developer facts: annual price, GST rate `[confirm rate]`, API rate limits and licence, status page URL, release dates | `/startnet-x/pricing`, `/startnet-x/developers`, `/startnet-x/updates` | `client/src/pages/snx/snxContent.js`, `snxTamil.js`, `Pricing.jsx`, `pages/mega/snx-extras/Developers.jsx`, `Updates.jsx` |
| G-4 | Investor relations email; CSR receiving entity (StartNet Foundation or an implementing partner) | `/partner/investors`, `/partner/csr` **(?)** | `client/src/pages/partner/partnerData.js` lines 476 and 530 |
| G-5 | District map boundary data, district count and Ledger quarter-month mapping, "meaningful touchpoint" definition, method change log | `/insights/founder-ledger`, `/insights/founder-ledger/methodology`, `/districts` | `ledger.json`, `pages/mega/insights-ledger/Methodology.jsx` (hidden lines) |
| G-6 | Governance: the `[proposed]` structure on `/about/governance` needs confirming | `/about/governance` | `client/src/pages/about/Governance.jsx` line 59 |
| G-7 | StartNet X deep-link paths are unchecked against the real app (README: "`snxLink(...)` need checking"). Examples: `/apply/founder-switch`, `/circles/apply`, `/interest/angels`, `/events/<slug>/register`, `/programmes/vibe-launchpad`, `/learn`, `/login` | Every Apply/Register button | `programmes.json` `snxPath`, `connectData.js`, `vibeContent.js`, `VibeSub.jsx`, `EventDetail.jsx`, `EditionPage.jsx`, `SeriesPage.jsx` |
| G-8 | Women Awards final categories; problem-statement open dates per lab; Founders Day date and venue; series descriptions for Research Days and the generic fallback | `/women/summit/awards`, `/research/labs/:lab`, `/events/founders-day`, `/events/research-days` | `WomenAwards.jsx`, `ResearchLab.jsx`, `FoundersDay.jsx`, `seriesData.js` (all hard-coded, not in `server/data`) |
| G-9 | Event agendas and speakers. The Speakers tab reads `agenda[].speaker`, and no event has an `agenda`. Podcast episodes (`stories.json` `type: "podcast"`) do not exist | `/events/:series/:edition/agenda`, `/speakers`, `/insights/podcast` | `events.json` `agenda[]`, `stories.json` |
| G-10 | Media kit photo library | `/media/kit` (hidden) | `MediaKit.jsx` line 422 |
| G-11 | Vibathon values are duplicated outside `events.json`, so supplying event data (2.1) means editing 3 to 4 places: `events.json`, `vibeContent.js` (`VIBATHON_REGISTRATION`, timeline, prizes, FAQ), `campaigns.js` (`/go/vibathon-2027`) and `seriesData.js`. The same applies to programme fees hard-coded in `ConnectSub.jsx`, `ConnectBits.jsx`, `WomenHome.jsx`, `WomenSub.jsx`, `womenContent.js`, `VibeSub.jsx` and `researchContent.js` | see 2.1 and 2.2 | The PDF tells StartNet that data goes into `server/data/*.json`, which is only partly true |
| G-12 | Copy review of agent-written copy (FAQ answers, the "Sponsor a Lab" block, the four new pages) | `/research` and others, `/programmes/open-calls`, `/events/speak`, `/insights/founder-ledger/corrections`, `/districts` | README "Copy review", audit §7 item 5 |
| G-13 | Production build env: `VITE_SNX_ORIGIN`, `VITE_SITE_ORIGIN`, and `VITE_WHATSAPP_NUMBER` in the release pipeline (only `client/.env` has the number) | All | Build/hosting config (pairs with 1.3) |

### PDF items that no page uses (or that need no code change)

- **1.3 Hosting:** server and deploy configuration only. No page slot.
- **1.4 Palette sign-off:** already live in `tokens.css`. No placeholder waits on it; only the brand book closes.
- **4.2 Feb 2024 / July 2023 recordings, 4.4 @startnetresearch:** no page uses them yet. `S44yEwSjd1E` sits in `videos.js` with no placement.
- **4.1 Vibe at TNGSS 2025:** no matching page or event in `events.json` **(?)**.
- **6.2 Tamil specimen test:** quality check, no slot.
- **6.3 Vibathon wordmark:** no wordmark slot in the code.
- **6.4 Certificate signatories and verification URL:** no certificate page in this repo; it belongs to StartNet X.
- **7.3 True 404:** reported as already done (audit follow-up, 6 Oct 2026).
- **1.1 and 1.8:** done. Only the brand-team inboxes `[confirm]` remain (`/contact`).
