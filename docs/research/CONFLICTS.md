# Event facts: conflicts and items for StartNet to confirm

Compiled 13 Oct 2026 from `connect-series.md`, `vibe-events.md` and `nirf-and-other-events.md` (same folder), while the
event archive was enriched (`server/data/events.json`, `client/src/pages/mega/events-series/`).

**Rule applied on the site.** Where sources give different figures, the site shows the **lowest** sourced figure, tagged
**B**, with its source and as-at date; the other figures are named in that figure's note. Facts that only an
unreliable copy supports (search-engine copies flagged as jumbled, scrambled or snippet-only) are **not published**
and are listed under "Not published" below. Please confirm or correct each row; the site changes with the data.

## 1. Figure conflicts (site shows the lowest, tag B)

| # | Edition | Figure | Sources and values | On the site |
|---|---|---|---|---|
| F1 | D2C Connect 2024 | Attendance | M.K. Elango's LinkedIn profile: "650+ participants" (self-reported). D2C Connect YouTube, 8 Jan 2025: "Over 1,000 attendees". Pre-event site header: "1000+ Attendees". | **650+** [B], as at 13 Oct 2026 (profile read) |
| F2 | D2C Connect 2024 | Speakers | Pre-event site body text: "45+ speakers". Site header and post-event YouTube description: "50+". | **45+** [B], as at Nov 2024 |
| F3 | D2C Connect 2024 | Startups | Pre-event site body text: "200+ D2C startups". Header: "600+ D2C Startups". Post-event YouTube: "600+ innovative startups". | **200+** [B], as at Nov 2024 |
| F4 | Vibathon 2025 | Prize pool | Vibathon 2025 brochure: ₹2.5 L. StartNet Vibe announcement (9 Aug 2025): "₹50,000 worth of exciting cash prizes" (1st ₹20,000, 2nd ₹10,000, 3rd ₹5,000, five consolation prizes of ₹3,000). Search-engine copy of vibathon.in: "₹75,000+". | **₹50,000** [B], as at 9 Aug 2025. ₹2.5 L removed from `events.json` (Vibathon 2027 prize line), `stories.json` (recap) and the Vibathon series figures. **Still ₹2.5 L:** `server/data/metrics.json` `vibathon-2025-prize-pool` (value 2.5), which `client/src/pages/mega/utility-campaign/campaigns.js` (`/go/vibathon-2027`) reads from the API. The Vibe brand pages override that key client-side (`vibeContent.js`). |
| F5 | SaaS Connect 2025 | Expected attendance (pre-event) | Brochure (Scribd) and StartupTN on X: "2500+ attendees". TicketPrix page also says "3,00,000+ Expected attendees". | **2,500+** [B], labelled "expected (pre-event)". No post-event figure exists. |

Not published (conflicting and index-only): D2C stalls (40+) and sponsors (15+ vs 12+); GenAI Connect 2024 header
"800+ attendees, 45+ speakers, 100+ AI startups, 25+ stalls, 20+ sponsors" against the page text "over 20 speakers,
25 technology stalls, and 45 startups".

## 2. Fact conflicts

| # | Edition | Conflict | On the site |
|---|---|---|---|
| C1 | D2C Connect 2024 | Organiser: events.json / StartNet's X post say an SNX (StartNet X) initiative; 10times says "organised by TealOrca Web Agency"; the pre-event Short came from an "SNX India" channel. | Keeps "an initiative by SNX (StartNet X)". TealOrca is not listed for 2024. **Confirm the credit.** |
| C2 | SaaS Connect 2025 | Venue address: "PSG Convention Centre, PSG iTech, Neelambur" (Business Wire) vs "PSG Foundry, Neelambur" (TicketPrix) vs "PSG CAS, Civil Aerodrome Post" (Coimbatore Junction); one summary mentioned Le Meridien (likely template text). | "PSG Convention Centre, Neelambur" (unchanged). |
| C3 | SaaS Connect 2025 | "AI in SaaS Sales & Marketing" is Day 1 (22 Feb) in Entrans' recap; SmartBear's release puts its "AI-Powered SaaS Sales and Marketing Panel" on 23 Feb, 10:15–11:00. May be two sessions. | Both listed, each with its source; the programme note says they may be the same session. |
| C4 | SaaS Connect 2025 | Coimbatore Junction lists "M.K. Elango, Founder & CEO, Starbett" (typo). | Not used for any role. |
| C5 | Vibathon 2025 | Date: announced for 29 Aug 2025 (deadline 20 Aug); held 26 Sep 2025 (recap, KSRCE). | 26 Sep 2025. |
| C6 | Vibathon 2025 | KSRCE credits "Startnet Net Vibes and CubeAI Solutions" (college typo). | Not copied. |
| C7 | Vibe Marketing Summit 2025 | Price: the site said "free"; posts mention a student pass, a "20% OFF" promo and a Razorpay link. | Changed to paid: "Ticketed, with a student pass and a 20% discount promoted. Prices: [placeholder]". **Confirm prices.** |
| C8 | Vibe Coding Summit 2025 | Organiser: TicketPrix names "Computer Society of India – Coimbatore Chapter" and not StartNet; StartNet Vibe promoted it "in association with" CSI Coimbatore Chapter. | "Promoted by StartNet Vibe in association with the Computer Society of India, Coimbatore Chapter, which the ticket listing names as organiser". **Confirm the credit.** |
| C9 | Vibe Coding Summit 2025 | Venue name: "Dr. G.R. Damodaran College of Science" (TicketPrix address, Instagram) vs "Dr. G.R.Damodaran College of Arts and Science" (TicketPrix second section). TicketPrix spells "Avnashi Road". | "IT Block, Dr. G.R. Damodaran College of Science, Avinashi Road". |
| C10 | NIRF Higher Ed Summit | Speaker roles: Dr. R. Sethuraman is "Professor, Sathyabama" (NIRF site), "CTO" (startnet.in 2024 team page) and "HEI Strategy Advisor" (startnetresearch.in). Dr. V. Nagaraj is "MD & Chairman, Trueline Research" (NIRF site) and "Co-Founder & CIO" (startnet.in); startnetresearch.in lists "Nagaraj Varatharaj, Co-Founder & CIO". | Roles as printed on the NIRF Salem site (the role stated for that event). |
| C11 | NIRF Higher Ed Summit | StartupTN Vice-President: Sivakumar Palanisamy (Salem list) vs B.L. Rajan (Amrita, Coimbatore). Possibly both. | Each listed for its own edition. |
| C12 | NIRF Coimbatore | Amrita spells "Satyabama University". | Normalised to "Sathyabama Institute of Science & Technology", as printed on the Salem page. |
| C13 | NIRF Higher Ed Summit | Brand: the Salem site shows the StartNet masterbrand; Amrita credits "StartNet Research" for Coimbatore; the promo is on @startnetresearch (ownership not stated on the channel). | Both editions under StartNet Research (StartNet decision). Salem co-host line reads "Organised by StartNet (Startnet Ventures Private Limited)". |
| C14 | StartNet launch | Date: X post (ID-derived, snippet only) reports the launch on or before 25 Jun 2023; video uploaded 7 Jul 2023; press post 18 Jul 2023; site said "July 2023"; a code comment said "launch post June 2023; incorporated July 2023". | "July 2023 · exact date to be confirmed" (sorting date 15 Jul 2023, not shown). City and venue are placeholders (the X snippet's #Salem is unconfirmed). **Confirm date and venue.** |
| C15 | 2023 network meetings | The September 2023 monthly meeting (Hotel Windsor Castle, 30 Sep) and StartConnect's MegaPitching (Salem, 30 Sep) share a date; no source says they were one event. The Windsor Castle meeting's city is not stated. | Two separate records; the meeting's city is "[city to be confirmed]". |
| C16 | Connect line-up | The live startnet.in lists Agentic AI Connect 2026 (14 Nov 2026, Chennai) and Physical AI Connect 2027 (8 May 2027, Chennai) as the two flagships; the repo had GenAI, SaaS and D2C Connect 2027 entries. | The three 2027 entries are removed; their URLs 301 to the series page. The two flagships are added. |
| C17 | Agentic / Physical AI Connect | startnet.in/connect calls them a "Digital summit, yearly" and a "Physical summit, yearly". The site reads these as topic labels and lists both as in-person in Chennai. | Format "in person" (inferred from the city), language, venue and fees as placeholders. **Confirm the format.** |
| C18 | Vibe Summit | Live startnet.in describes "Vibe Summits" as cheap, high-frequency campus summits; the repo says "one Vibe Summit each year is the state finale". | Not changed here (Vibe brand pages belong to another agent). |

## 3. Not published, waiting for StartNet

- **GenAI Connect 2024:** the 15-name speaker roster (index text jumbled; pairings unconfirmed): M.K. Elango, Sivarajah
  Ramanathan, M.V. Subramanian, Karthik Sathuragiri, Senthil Nathan, Vishnu Subramanian, Srikrishna Swaminathan,
  Dr. Tamizh Inian, Ramesh Kumar, Pradeep Soundararajan, ThangaVel Puhal, Sunandha ThamaraiSelvan, Maria Subi Rajan,
  Hariharan Murugesan, Sasi Varna Kumar. Also: what "AITN Launch" was; Pitch Showdown finalists, results and the
  "seed funding of up to ₹2.5 crore" (pre-event); mini-hackathon winners; final attendance; sponsor names; pass prices
  (labels scrambled in the index).
- **D2C Connect 2024:** agenda times and panel line-ups (index scrambled); roles that only the index gives (Nitin Nair
  "Senior Vice President, ONDC"; Kumar Vembu "Founder & CEO, GoFrugal Technologies"); speakers only the index lists
  (Anshuman Agarwal, Pritesh Asher, John Jim, Jagan Praveen); sponsor names by tier; ClickPost's talk subject
  (search summary only).
- **SaaS Connect 2025:** Guest of Honour "Shri Suresh P Prabhu" (announced; attendance unconfirmed); speakers only an
  aggregator lists (Dr. Harrick Vin, TCS; Siddharth Sharma, YellowKyte; Naman Bajaj, Keka HR; Dharma Atluri); pitch
  winners; funding announced; post-event attendance.
- **Vibathon 2025:** winners' names (decision: not published; the site says the 1st and 3rd prizes went to KSRCE student
  teams); 2nd-prize team; total participants and colleges; problem statements.
- **Vibe Marketing Summit 2025:** roles of organisations tagged in Sona's post without a stated role (Sona College of
  Technology, Multipreneur Academy, Thedico, REAINMAKER AI, Cubeaisolutions, Dot Com Infoway, Teal Orca); language; prices.
- **Vibe Coding Summit:** edition 1 (Salem) date and venue (the series page says only that it was held in Salem);
  edition 2 speakers and attendance; the "₹1,499 early-bird" price (unverified).
- **NIRF Higher Ed Summit:** associate partners and sponsors shown as logos only (file names `StartupTN`, `iTNT`,
  `Vinayaga`, `Shanmuga`, `Trueline`, `Deecodes-1`); Dr. Raja Sambandam's keynote (snippet only); actual Salem
  attendance; whether TNHEIN and the Tamilnadu NIRF Analysis Report 2024 were launched (the site says only "announced on
  the summit agenda"); Coimbatore agenda, partners and price; any later editions.
- **2023:** dates and venues of the other monthly meetings; MegaPitching jury, pitches and winners; attendance.
- **Digital Politics Conclave** (Salem, 2 Feb 2024, CJ Pallazzio, "Forum of Digital Politics in association with
  StartNet"): **not listed**. Political content; needs a StartNet decision.
- **Investors Summit:** no public record of a StartNet event of that name in any year; the archive entry stays a
  placeholder until StartNet supplies date, venue and evidence, or asks for it to be removed.
- **Smaller 2023 sessions** (Prompt Engineering masterclass, Idea2IPO AMA, OKR webinar): not listed; StartNet to decide.

## 4. Brand pages and media

Written by the brand-pages agent, 13 Oct 2026. Covers `client/src/pages/brands/**`, `client/src/pages/about/About.jsx`,
`client/src/data/videos.js`, `imagePlan.js` and the photo and video docs. Sources: `docs/research/vibe-events.md` (VE),
`connect-series.md` (CS), `nirf-and-other-events.md` (NE). Rows that overlap the sections above say so (F1, F4, C10, C13).

| # | Conflict | Sources | Handled on the brand pages | Still open / needed |
|---|---|---|---|---|
| B1 | **Vibathon 2025 prize pool**: ₹2.5 L vs ₹50,000 vs ₹75,000+ | ₹2.5 L: "Vibathon 2025 brochure" (site seed: `vibeContent.js`, `server/data/metrics.json`). ₹50,000: StartNet Vibe announcement, LinkedIn, 9 Aug 2025 ("₹50,000 worth of exciting cash prizes": 1st ₹20,000, 2nd ₹10,000, 3rd ₹5,000, 5 × ₹3,000 consolation). ₹75,000+: search snippet of vibathon.in (dead, unverifiable). VE §1 | Lowest sourced figure, as announced: ₹50,000, tag B, as at 9 Aug 2025, source the announcement (`VIBATHON_2025_POOL`). The brochure figure stays only in a code comment. The `/vibe` proof band replaces the API record with the same key (`CURATED_METRICS`, `VibeProof.jsx`). Same as F4. `vibeContent.js` no longer carries ₹2.5 L. `server/data/metrics.json` `vibathon-2025-prize-pool` was set to ₹50,000 / B / 9 Aug 2025 / the announcement by the coordinator, so every page now agrees. StartNet to confirm one figure. |
| B2 | Vibathon 2025 date: announced 29 Aug 2025 (deadline 20 Aug), held 26 Sep 2025 | Announcement (9 Aug 2025) vs recap (4 Oct 2025) and the KSRCE page. VE §1 | 26 Sep 2025 everywhere. | none |
| B3 | Vibathon 2025 partners: the site named only CubeAI Solutions | Announcement: "in association with Cubeaisolutions Tech Pvt Ltd, KSR Educational Institutions and STEP"; the recap thanks the same three; sponsors sashainfinity, ConcertIDC, Argit Solutions, AI Tamilar Startup, Start Insights. VE §1 | The Vibathon page "The last edition" names all three partners and the five sponsors; the `/about` timeline adds STEP and the Emerald Hall. KSRCE's typo "Startnet Net Vibes" is not copied. Resolved: `events.json` `vibathon-2025.coHost` now names all three. |
| B4 | Vibathon 2025 winners | The KSRCE achievements list names the 1st- and 3rd-prize students; the 2nd prize was not found. VE §1 | Not named (StartNet decision): "1st and 3rd prizes went to KSRCE student teams." | 2nd prize unknown. |
| B5 | **Vibe Marketing Summit 2025 "free"** | `events.json` `price: "free"` vs a student pass, a "20% OFF" promo and Razorpay passes (attendee post; StartNet Vibe post). VE §3 | `/vibe/summit` says entry was by paid pass, with a student pass. No "free" claim on the brand pages. Resolved: `events.json` now has `price: "paid"`. |
| B6 | Vibe Marketing Summit organiser | Sona Incubation Foundation (29 Jul 2025): "Organized by StartNet Ventures Private Limited in collaboration with Sona Incubation Foundation"; a speaker: "organised by StartNet Vibe". VE §3 | Sona's wording. Attendance 150+ shown as the partner's own figure (B, Sona post, 29 Jul 2025). "India's first" billing left out. | none |
| B7 | Vibe Coding Summit venue | Ticketprix: "Dr. G.R. Damodaran College of Science" and, in a second section, "… College of Arts and Science"; Instagram: "… College of Science". VE §2 | "IT Block, Dr. G.R. Damodaran College of Science, Coimbatore" (two of three). | StartNet to confirm. |
| B8 | Vibe Coding Summit organiser | Ticketprix names the Computer Society of India, Coimbatore Chapter, not StartNet; @startnetvibe promoted it. VE §2 | "Promoted by StartNet Vibe; ticketing listed by the Computer Society of India, Coimbatore Chapter." `/vibe/summit` links the `vibe-coding-summit-2025-coimbatore` record once `/api/events` serves it. The unverified "₹1,499 early bird" is not used. | Edition 1 (Salem): date and venue unknown. |
| B9 | What "Vibe Summit" is | Repo and Book 2: "One Vibe Summit each year is the state finale"; live startnet.in: "Vibe Summits", cheap, high-frequency campus summits; public record: the vibesummits.in coding and marketing summits. VE §5 | Book copy unchanged; `/vibe/summit` adds "Summits so far" with the two 2025 summits. | StartNet to reconcile the definition. |
| B10 | **D2C Connect 2024 attendance** | Event channel, after the event (YouTube `hjdl0ChhIGY` description): "Over 1,000 attendees … 600+ innovative startups"; M.K. Elango's LinkedIn profile: "650+ participants"; pre-event header "1000+". CS §2 | 650+, tag B, source Elango's profile (StartNet decision), in "The last edition" on `/connect/d2c`. The 1,000 figure is not shown. | Same as F1. StartNet to confirm. |
| B11 | D2C Connect 2024 organiser | `events.json`: an SNX (StartNet X) initiative; 10times: "organised by TealOrca Web Agency"; the official site names M.K. Elango of StartNet; one promo Short is on the SNX India channel. CS §2 | `/connect/d2c` names no organiser. TealOrca's preview `rNqzKb4CjxA` stays out of `videos.js`; the SNX India Short `2wgSBjcnKx4` is in, credited "SNX India on YouTube". | StartNet to confirm SNX or TealOrca. |
| B12 | GenAI Connect 2024 numbers | Header "800+ attendees, 45+ speakers, 100+ AI startups" vs body "over 20 speakers … 45 startups" (both pre-event). CS §1 | No GenAI 2024 figure shown; the facts stay general (tracks; Pitch Showdown with Native Angels Network). | Post-event numbers, Pitch Showdown results. |
| B13 | SaaS Connect 2025 address and numbers | "PSG Convention Centre, Neelambur" vs "PSG Foundry, Neelambur" vs "PSG CAS, Civil Aerodrome Post"; pre-event "2500+" vs "3,00,000+ expected" on one page; no post-event figure. CS §3 | Venue as in `events.json` (PSG Convention Centre, Neelambur); no attendance figure. | Post-event attendance. |
| B14 | **Upcoming Connect events** | `events.json` lists GenAI, SaaS and D2C Connect 2027; live startnet.in lists Agentic AI Connect 2026 (14 Nov 2026, Chennai) and Physical AI Connect 2027 (8 May 2027, Chennai). CS §4 | The brand pages name the two flagships (`CONNECT_FLAGSHIPS`): `/connect` FAQ, `/connect/series` key facts, a sector page's "Next event" when it has none, and `/connect` when no upcoming event is listed. A flagship links to its event page only once `/api/events` lists it, so no link points at a missing page. No 2027 sector edition is named in the brand files. | Resolved in `events.json` (2027 records removed; `agentic-ai-connect-2026`, `physical-ai-connect-2027` added). The 2027 card entries were taken out of `imagePlan.js`, and the new records' slots set to motion. The flagship links appear once the API on :4000 is restarted and serves the new data. |
| B15 | Sector Connect status "Running since 2024/2025" | Book 2 "Running now: GenAI, SaaS, D2C" vs no GenAI or D2C edition after 2024, no SaaS edition after Feb 2025 and, once the 2027 records go, no upcoming sector edition. CS §4 | Unchanged (Book copy). | StartNet to decide whether these stay "running". |
| B16 | Owner of the @startnetresearch YouTube channel | The channel's About section is empty; its only video links to the StartNet-copyrighted summit site; Amrita credits "StartNet Research". NE §1 | `O8nBgNH2d9M` is credited "@startnetresearch on YouTube", with a "Promo" chip. | Same as C13. StartNet to confirm; the credit can then read "StartNet Research on YouTube". |
| B17 | NIRF Higher Ed Summit speaker roles | Dr. R. Sethuraman and Dr. V. Nagaraj have different roles on the NIRF site, startnet.in and startnetresearch.in; the StartupTN VP is Sivakumar Palanisamy (Salem) or B.L. Rajan (Coimbatore). NE §1 | No speakers named on `/research` or `/about`. Sponsor and partner names that exist only as logo file names are not published; the planned TNHEIN and "NIRF Analysis Report 2024" launches are not claimed. | Same as C10. StartNet to confirm roles, the launches and the actual Salem attendance. |
| B18 | NIRF series key | Added during this work: series `nirf-higher-ed-summit`, editions `…-2024-salem`, `…-2024-coimbatore`. | `videos.js` uses `series: 'nirf-higher-ed-summit'`, `edition: '2024-salem'`. `/research` shows the film by id and links an edition only when `/api/events` lists it (matched by date and "nirf"). The Lab-to-Market page now lists only Lab-to-Market editions, so a NIRF record cannot appear there. | none |
| B19 | Investors Summit | No public record of a StartNet Investors Summit in any year. NE §2 | Not changed on `/about` (Book 2 copy, and a timeline entry without a date). | StartNet to supply the date and venue, or remove it. |
| B20 | Photos | Only StartNet- or Elango-owned images may now be downloaded and published, and none was reachable. `CYTI-12.jpg` (KSRCE) is the LLM Security workshop, not Vibathon. `pool/vibereal/21` (StartNet-owned) shows a Vibathon session with no event or date stated. VE §1 | No photo added; `CYTI-12.jpg` not used; `vibereal/21` not captioned as Vibathon 2025. Existing third-party event photos (KSRCE, Entrans, Gokul Kannan) kept as they are. Gaps per event: `docs/IMAGE-PLAN.md` §4a. | StartNet's own photos per event. |
