# StartNet website: page inventory

Date: 6 October 2026 (final verification of round 3).
Source of the counts: the final BFS link crawl of the production build (`tools/audit/agents/final-verifier/out/links.json`, started from `/`, `/ta` and `/sitemap`, MAX=1500, queue drained), plus `client/src/App.jsx` and `server/src/common/routes.ts` for the pages no link reaches.

## 1. Totals

| Measure | Count | Notes |
|---|---|---|
| Unique English pages | **244** | 241 reached by the link crawl + 3 reserved pages that nothing links to by design (`/signin`, `/signup`, `/go/vibathon-2027`) |
| Tamil mirrors (`/ta/...`) | **244** | Every English page has a `/ta` mirror; the crawl found no page in one language only |
| **Total pages** | **488** | 244 + 244 |
| Filtered query views | **436** | 218 English + 218 Tamil (`?district=`, `?brand=`, `?topic=`, `?type=` and similar on 10 listing pages, see section 4) |
| Total crawlable URLs | **918** | 482 crawled pages + 436 query views (the 6 reserved pages are reached only by typing the URL or from a QR code) |
| Route templates in `App.jsx` | **86** | 66 static paths + 20 with a parameter, each mounted under `/` and `/ta`. In addition: 5 vanity redirects (`/mission`, `/ledger`, `/vibathon`, `/apply`, `/snx`) and 1 catch-all 404 route |
| Pages newly built in this round | **132 English + 132 Tamil = 264** | 39 new route templates, 10 mega-menu groups (section 3) |
| `sitemap.xml` URLs | 416 | 208 English + 208 Tamil, each with en/ta/x-default alternates |

What is left out of `sitemap.xml`, by design: `/search`, the 28 edition `/agenda` and `/speakers` tabs (their canonical is the edition page), the 4 placeholder founder stories, and the 3 noindex reserved pages (`/signin`, `/signup`, `/go/*`). 244 − 1 − 28 − 4 − 3 = 208.

URLs that answer with a 301 and are not counted as pages: the 5 vanity URLs, the 14 flat event URLs `/events/<series>-<edition>` (for example `/events/vibathon-2027` → `/events/vibathon/2027`), `/insights/reports/self-diagnosis-2027` → `/about/self-diagnosis`, the Ledger and index report slugs under `/insights/reports/`, district alias spellings (`/districts/trichy`), and upper-case paths. No internal link points at a redirect any more.

Unknown slugs: every one of the 20 parameter routes returns HTTP 404 with the 404 page for an unknown value, in English and Tamil (46 URLs checked, including `/events/vibathon/<unknown edition>`).

Update, 8 October 2026 (after the crawl above, counts not yet re-run): the three Connect archive editions now carry
their real years (`genai-connect/archive` → `genai-connect/2024`, `d2c-connect/archive` → `d2c-connect/2024`,
`saas-connect/archive` → `saas-connect/2025`), and one past StartNet Vibe event without a series was added,
`/events/vibe-marketing-summit-2025` (+1 English, +1 Tamil page). `investors-summit/archive` is unchanged.

## 2. Pages by section (English URLs; each has a `/ta` mirror)

| Section | Pages | English URLs |
|---|---|---|
| Home | 1 | `/` |
| Join | 1 | `/join` |
| About | 8 | `/about`, `/about/mission-1-lakh`, `/about/how-we-work`, `/about/leadership`, `/about/evidence-standard`, `/about/governance`, `/about/thinktn-alliance`, `/about/self-diagnosis` |
| Districts | 39 | `/districts` + 38 district pages `/districts/<district>`: ariyalur, chengalpattu, chennai, coimbatore, cuddalore, dharmapuri, dindigul, erode, kallakurichi, kancheepuram, kanniyakumari, karur, krishnagiri, madurai, mayiladuthurai, nagapattinam, namakkal, nilgiris, perambalur, pudukkottai, ramanathapuram, ranipet, salem, sivaganga, tenkasi, thanjavur, theni, thoothukudi, tiruchirappalli, tirunelveli, tirupathur, tiruppur, tiruvallur, tiruvannamalai, tiruvarur, vellore, viluppuram, virudhunagar |
| Our brands hub | 1 | `/brands` |
| Research | 13 | `/research`, `/research/labs`, `/research/labs/{agentic-ai, ontology-knowledge, physical-ai, drug-discovery}`, `/research/fellowship`, `/research/lab-to-market-summit`, `/research/institution-partner-programme`, `/research/problem-statements`, `/research/terms`, `/research/stories`, `/research/events` |
| Vibe | 10 | `/vibe`, `/vibe/vibathon`, `/vibe/academy`, `/vibe/campus`, `/vibe/clubs`, `/vibe/launchpad`, `/vibe/summit`, `/vibe/for-colleges`, `/vibe/stories`, `/vibe/events` |
| Connect | 17 | `/connect`, `/connect/series`, `/connect/circles`, `/connect/angels`, `/connect/founder-switch`, `/connect/scale`, 9 sector pages `/connect/{genai, saas, d2c, fintech, healthtech, agrifood, climate, deeptech, industry-4-0}`, `/connect/stories`, `/connect/events` |
| Women | 8 | `/women`, `/women/circles`, `/women/rise-academy`, `/women/hercapital`, `/women/summit`, `/women/summit/awards`, `/women/stories`, `/women/events` |
| Programmes | 22 | `/programmes`, `/programmes/open-calls` + 20 programme pages `/programmes/<slug>`: connect-circles, connect-series, founder-switch, grant-desk, hercapital, institution-partner-programme, lab-to-market-summit, rise-academy, scale-connect, scholar-founders-fellowship, startnet-angels, startnet-labs, vibathon, vibe-academy, vibe-campus, vibe-clubs, vibe-launchpad, vibe-summit, women-circles, women-founders-summit |
| Events | 57 | `/events`, `/events/past`, `/events/speak`, `/events/host`, `/events/founders-day`; 10 series pages `/events/{vibathon, vibe-campus, vibe-summit, genai-connect, saas-connect, d2c-connect, lab-to-market-summit, women-founders-summit, research-days, investors-summit}`; 14 edition pages `/events/<series>/<edition>` (vibathon/2027, vibathon/2027-district-qualifiers, vibathon/2025, vibe-campus/build-nights-2026, vibe-summit/2027, genai-connect/2027, genai-connect/2024, saas-connect/2027, saas-connect/2025, d2c-connect/2027, d2c-connect/2024, lab-to-market-summit/2027, women-founders-summit/2027, investors-summit/archive), each with `/agenda` and `/speakers` tabs (28) |
| Insights | 24 | `/insights`, `/insights/founder-ledger`, `/insights/founder-ledger/methodology`, `/insights/founder-ledger/corrections`, `/insights/founder-ledger/2026-q4`, `/insights/stories` + 6 stories `/insights/stories/{five-years-of-rooms, vibathon-2025-recap, founder-story-research, founder-story-vibe, founder-story-connect, founder-story-women}`, `/insights/reports` + 5 reports `/insights/reports/{tn-founder-report-2027, tn-women-founders-report, state-of-tn-saas, state-of-tn-genai, state-of-tn-d2c}`, `/insights/indices` + 3 indices `/insights/indices/{campus-innovation-index, research-commercialisation-index, founder-readiness-index}`, `/insights/podcast`, `/insights/newsletter` |
| StartNet X | 13 | `/startnet-x`, `/startnet-x/modules`, `/startnet-x/pricing`, `/startnet-x/trust`, `/startnet-x/agents`, `/startnet-x/updates`, `/startnet-x/developers`, `/startnet-x/{founders, institutions, incubators, gccs, government, investors}` |
| Partner | 11 | `/partner`, `/partner/enquire`, `/partner/our-partners`, `/partner/{institutions, gccs, government, investors, incubators, sponsors, csr, district-programme}` |
| Media | 2 | `/media`, `/media/kit` (the `/media/releases/:slug` template has no press releases in the data yet) |
| Careers | 1 | `/careers` (the `/careers/:slug` template has no open roles in the data yet) |
| Contact | 1 | `/contact` |
| Search | 1 | `/search` |
| Legal | 10 | `/legal/{privacy, terms, cookies, accessibility, code-of-conduct, data-rights, grievance, refunds, safeguarding, sponsorship-terms}` |
| Sitemap | 1 | `/sitemap` |
| Utility / Campaign | 3 | `/signin`, `/signup` (hand-offs to StartNet X, minimal header, noindex), `/go/vibathon-2027` (campaign landing, noindex) |
| 404 | 0 | One template: any unknown path or slug renders the 404 page with HTTP 404 |
| **Total** | **244** | |

## 3. Pages newly built in this round (by mega-menu group)

All pages live in `client/src/pages/mega/<group>/`; each group's `routes.js` is its manifest. Counts are English pages; each has a Tamil mirror.

| Group | New route templates | New pages | Pages |
|---|---|---|---|
| snx-audiences | 6 | 6 | `/startnet-x/{founders, institutions, incubators, gccs, government, investors}` |
| snx-extras | 3 | 3 | `/startnet-x/{agents, developers, updates}` |
| insights-ledger | 3 | 3 | `/insights/founder-ledger/methodology`, `/insights/founder-ledger/2026-q4`, `/insights/newsletter` |
| insights-reports | 4 | 10 | `/insights/indices`, 3 index pages, 5 report pages, `/insights/podcast` |
| events-series | 3 (plus the existing `/events/:slug`, now a dispatcher) | 52 | 10 series pages, 14 edition pages, 14 agenda tabs, 14 speakers tabs |
| events-extra | 2 | 2 | `/events/host`, `/events/founders-day` |
| brand-sub | 10 | 13 | 4 lab pages, `/research\|vibe\|connect\|women/stories` and `/events` (8), `/women/summit/awards` |
| about-districts | 2 | 39 | `/about/self-diagnosis`, 38 district pages |
| media-careers | 3 | 1 | `/media/kit` (press release and job templates wait for data) |
| utility-campaign | 3 | 3 | `/signin`, `/signup`, `/go/vibathon-2027` |
| **Total** | **39** | **132** | |

Before this round the site had 126 English pages. 126 − 14 (the old flat event pages, now 301s to their edition pages) + 132 = 244.

## 4. Filtered query views (per language)

| Listing page | Query views | Parameters |
|---|---|---|
| `/events` | 43 | `district` (39), `brand` (4) |
| `/partner/enquire` | 40 | form pre-fill: `type`, `topic`, `ref`, `brand`, `audience` |
| `/events/past` | 38 | `district` |
| `/connect/circles` | 38 | `district` |
| `/women/circles` | 38 | `district` |
| `/programmes` | 8 | `brand` (4), `pool` (4) |
| `/insights/stories` | 5 | `brand` (4), `type` (1) |
| `/research/problem-statements` | 4 | `sector` |
| `/contact` | 3 | `topic` |
| `/insights/newsletter` | 1 | `topic` |
| **Total** | **218** | ×2 languages = 436 |
