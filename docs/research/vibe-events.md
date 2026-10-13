# StartNet Vibe events: web research

Research date: 13 Oct 2026. The research was read-only and did not use any logged-in pages. It covers public LinkedIn post pages, public Instagram post pages, college PDFs and pages, a ticketing page and government advisories.

**Baseline already on the site** (from `server/data/events.json`, `vibeContent.js`, `seriesData.js`, `docs/VIDEOS.md` and `docs/PHOTO_CREDITS.md`):
- **Vibathon 2025:** 26 Sep 2025, K.S.R. College of Engineering (KSRCE), with CubeAI Solutions. The site has "80% Tier 3/4" and a "₹2.5 L prize pool", both sourced to the brochure. Attendance and outcomes are placeholders.
- **Vibe Marketing Summit 2025:** 26 Jul 2025, Sona Incubation Foundation, Salem. Attendance is a placeholder.
- **TNGSS 2025:** booth photos from two StartNet Vibe LinkedIn posts.
- **Not on the site:** a Vibe Coding Summit, and any public video.

This file lists only additions and corrections to that baseline. Every row names its source. In the tables, "Post date" for LinkedIn is decoded from the activity ID: `id >> 22` gives a millisecond Unix time in UTC.

---

## 1. Vibathon 2025 (KSRCE, Tiruchengode)

### Facts

| Fact | Value (as stated by the source) | Source |
|---|---|---|
| Official name / billing | "VIBATHON 2025"; billed as "Tamil Nadu's Largest AI-Based Hackathon" | LinkedIn @startnetvibe recap post, published 4 Oct 2025: https://www.linkedin.com/posts/startnetvibe_vibathon2025-aihackathon-ksrce-activity-7380212890731122688-rs6z |
| Billing (announcement) | "Tamil Nadu's Largest Tech Hackathon"; "a groundbreaking initiative by StartNetVibe" | LinkedIn @startnetvibe announcement, published 9 Aug 2025: https://www.linkedin.com/posts/startnetvibe_vibathon-techhackathon-innovation-activity-7359923974471864320-BeeS |
| Billing (college) | "Tamilnadu's Largest AI Based Hackathon" | https://ksrce.ac.in/index.php/page?id=1082&item=315 (also id=1078) |
| Date held | "September 26th" (recap); "26.09.2025" (KSRCE) | recap post above; KSRCE page above |
| **CONFLICT: announced date** | The announcement gave "Date: August 29th, 2025" and "Application Deadline: August 20th, 2025". The event was held on 26 Sep 2025, so it was rescheduled. Use 26 Sep. | announcement post above |
| Venue (room) | "the Emerald Hall at K.S.R. College of Engineering" (**new**) | recap post |
| Partners ("in association with") | "Cubeaisolutions Tech Pvt Ltd, KSR EDUCATIONAL INSTITUTIONS, and Society for Technocracy Engineering Professionals (STEP)" (**STEP is new**) | announcement post |
| Special thanks | K.S.R. College of Engineering (Autonomous); Society for Technocracy Engineering Professionals (STEP); Cubeaisolutions Tech Pvt Ltd | recap post |
| Sponsors (as named) | sashainfinity, ConcertIDC, Argit Solutions Private Limited, AI Tamilar Startup, Start Insights (**new**) | recap post |
| KSRCE's credit line | "Startnet Net Vibes and CubeAI Solutions" (Resource Person column). The college's typo; do not copy it. | KSRCE page |
| Teams | "40 dynamic teams" (**new**) | recap post |
| Project themes shown | "Advanced Cybersecurity systems", "Smart Food Management solutions", "Accident Prediction models", "IoT-powered real-time data analytics through Lovable" | recap post |
| Format note | The jury "evaluated live implementations"; projects went "from concept to working prototype" | recap post |
| Guests of Honour | Dr. M. Venkatesan, Dean, KSRCE; Suresh Kuppuswamy, Co-Founder, Zepto Logic Technologies Private Limited, Coimbatore | recap post |
| Thanked | Dr. P. Meenakshi Devi, Principal, KSRCE | recap post |
| Jury / industry experts (no individual roles stated) | Dinesh Yuvaraj, Nagaraj Varatharaj, Palanivel Subramaniam, Srinivasan Ganesan, M.K. Elango, M V Prabakar, Hariprasad Sugunakumar, Eswaran Arumugam, Jayaprakash N | recap post |
| **Winners (new)** | 1st Prize: Bharanidharan S (IV Year) and Mithun S (IV Year), CSE-CS. 3rd Prize: Sanjay V N (III Year), Gowtham Balaji S (III Year), Nivetha R (II Year), Harini K (II Year), CSE-CS. Both rows are "Awarded by: StartNet Vibe and CubeAI Solutions". | KSRCE "Students Achievements List 2025-2026 Odd Sem": https://www.ksrce.ac.in/admin/uploads/departments/achievements/student/7/1777_Students_Achievements_2025_26.pdf |
| 2nd prize | Not found in any source | — |
| **CONFLICT: prize pool** | Announcement: "₹50,000 worth of exciting cash prizes". The breakdown is 1st ₹20,000, 2nd ₹10,000, 3rd ₹5,000, "Plus 5 Consolation Prizes of ₹3,000 each". It also lists internships, mentorship and swag. The site's **₹2.5 L** (brochure) does not match. A search-engine snippet of vibathon.in said "₹75,000+ in prizes", but that domain is now dead and could not be checked. StartNet should confirm one figure. | announcement post; vibathon.in snippet only |
| Audience (announcement) | Students, startup founders, academics and professionals. No formal eligibility is stated. | announcement post |
| Registration site | https://vibathon.in. It no longer resolves and has no Wayback snapshot. | announcement post |
| Contacts named | M K Elango; Dinesh Yuvaraj (phone numbers in the post; don't republish) | announcement post |
| Outcomes (college wording) | "Encouraged innovation, creativity, and rapid problem-solving among participants"; "Provided hands-on experience in building AI-powered solutions"; "Fostered teamwork, leadership, and project presentation skills"; "Connected students with industry mentors, improving exposure to real challenges" | KSRCE page |

### Media
- `CYTI-11.jpg` (https://ksrce.ac.in/admin/file_manager/source/New/IIIC/CoE/CYTIC/CYTI-11.jpg) is a hall full of students at laptops in front of two screens. It is the image the site already uses, it fits the Vibathon caption, and the owner is KSRCE.
- **Do not use `CYTI-12.jpg`.** I viewed it: its screen reads "Hacking & Securing LLM", so it belongs to the LLM Security workshop on 11 Oct 2025, not to Vibathon, even though it sits next to the Vibathon caption.
- The two LinkedIn posts (announcement and recap) carry images owned by StartNet Vibe. No direct image URLs could be pulled without logging in.
- No YouTube video was found, so there was nothing to test with oEmbed.

### Gaps
- Total participants and number of colleges (only "40 teams" is known).
- 2nd-prize team.
- Prize pool: three figures in circulation (₹2.5 L, ₹50,000, ₹75,000+).
- Problem statements or tracks.
- No coverage found in The Hindu, DT Next, TOI, YourStory or Dinamalar.
- No other editions or district rounds found for 2025 or 2026.

---

## 2. Vibe Coding Summit (the "Vibe Code Summit")

The public name is **"Vibe Coding Summit"**, also written "India's Premier Vibe Coding Summit". Nothing was found under the name "Vibe Code Summit". The @startnetvibe Instagram bio says: "Vibe Coding Summit is where AI meets code. Learn the fastest tools, boost productivity & connect with future-ready…" (https://www.instagram.com/startnetvibe/).

### Edition 2: Coimbatore, 14 June 2025

| Fact | Value | Source |
|---|---|---|
| Name | "India's Premier Vibe Coding Summit \| 2nd Edition" | Ticketprix: https://www.ticketprix.com/event/EVT20250514015212Uwz |
| Date / time | Saturday, 14 June 2025, 09:00 AM – 07:00 PM; status "Completed" | Ticketprix |
| Venue | "IT Block, Dr. G.R. Damodaran College of Science, Avnashi Road, Civil Aerodrome Post, Coimbatore 641014". A second section says "Dr. G.R.Damodaran College of Arts and Science" (**internal conflict**; Instagram uses "Dr. G.R.Damodaran College of Science") | Ticketprix; Instagram https://www.instagram.com/p/DK1F_IKzIkL/ |
| Organiser on ticket page | "Computer Society of India - Coimbatore Chapter". StartNet is not named on Ticketprix. | Ticketprix |
| StartNet link | Promoted by @startnetvibe with #StartNetVibe; caption: "back with its 2nd Edition … bringing the VIBE to Coimbatore" | https://www.instagram.com/reel/DKyjBQ_psJM/ ; https://www.instagram.com/p/DKynx4GT_NJ/ |
| Association | "In Association with" Computer Society of India, Coimbatore Chapter | https://www.instagram.com/p/DKyg_QZT3xQ/ ; https://www.instagram.com/p/DKykTq4TqVt/ |
| Bronze sponsor | GoodBooks ERP ("Measure. Manage. Maximise.") | https://www.instagram.com/p/DK1F_IKzIkL/ |
| Ticketing partner | Sporfy Technologies Private Limited | https://www.instagram.com/p/DKykTq4TqVt/ |
| Theme / tagline | "CODING AT THE SPEED OF THOUGHT!" | https://www.instagram.com/p/DKyg_QZT3xQ/ |
| Tools featured | Cursor, Replit, Windsurf, GitHub Copilot, Claude, Supabase (Ticketprix). The Instagram "Tools Spotlight" also lists Bolt and Lovable. | Ticketprix; https://www.instagram.com/p/DKzGlVnT2aq/ |
| Format | One day: conference, networking, hands-on workshops; "Up to 5X" productivity claim | Ticketprix |
| Registration site | https://cbe.vibesummits.in (dead now) | Instagram posts above |
| Price | Not on the live page. A search-engine summary quoted "early-bird tickets at ₹1,499", but this could not be verified on the page. Unverified. | — |
| Speakers / attendance | None named; no numbers | — |

### Edition 1: Salem (date and venue not found)
- The Instagram reel caption for edition 2 says the first summit was held in **Salem** (https://www.instagram.com/reel/DKyjBQ_psJM/). No date, venue or listing was found.
- The Vibe Marketing Summit is promoted as "from the creators of the Vibe Coding Summit" (https://www.instagram.com/p/DMFrKijzeYI/).

### Media
- Ticketprix banner: https://prodstrgsf.blob.core.windows.net/sporfyproddb/pictures/organization/ORG202505137163254751g5vjhjTw/events/EVT20250514015212Uwz/dxXMv4D9-desktop_icon.png. It loads (HTTP 200). The listed owner is CSI Coimbatore Chapter, and the image is a promotional banner, not an event photo.
- The official promo video is the Instagram reel DKyjBQ_psJM (owner @startnetvibe). It is not on YouTube.
- Instagram posts dated 11–12 Jun 2025 are promos, not event photos.

### Gaps
- Edition 1: date, venue, attendance.
- Edition 2: speakers, attendance, outcomes.
- No later editions found.
- vibesummits.in and its subdomains no longer resolve.

---

## 3. Vibe Marketing Summit 2025 (Salem)

| Fact | Value | Source |
|---|---|---|
| Billing | "India's first Vibe Marketing Summit"; "Vibe Marketing Summit - First Edition"; "Vibe Marketing Summit V1.0" | StartNet Vibe post, 25 Jul 2025: https://www.linkedin.com/posts/startnetvibe_vibemarketingsummit-aimarketing-startupecosystem-activity-7354530389341691904-bSU5 ; Sona post, 29 Jul 2025: https://www.linkedin.com/posts/sona-incubation-foundation_vibe-marketing-summit-activity-7355841168062009344-AIZL ; attendee post: https://www.linkedin.com/posts/prakash-eswar_vibe-marketing-summit-2025-ai-powered-marketing-activity-7354412690724827137-gf02 |
| Date / venue | "July 26, 2025"; "Sona Incubations Foundation, Salem". Matches the site. | StartNet Vibe post; Instagram https://www.instagram.com/p/DMcfd4bTdLj/ |
| Organiser (new wording) | "Organized by StartNet Ventures Private Limited in collaboration with Sona Incubation Foundation". A speaker's post says "organised by StartNet Vibe". | Sona post; https://www.linkedin.com/posts/crvenk_vibemarketingsummit-aimarketing-salem-activity-7355454508820320257-R_un |
| **Attendance (new)** | "150+ entrepreneurs, business leaders, and marketers" | Sona post. It is the partner's own figure; tag it accordingly. |
| Other organisations tagged | Sona College of Technology, Multipreneur Academy, Thedico, REAINMAKER AI, Cubeaisolutions Tech Pvt Ltd, Dot Com Infoway, Teal Orca. They are tagged, but no partner or sponsor role is stated. | Sona post |
| Speakers and sessions (as stated) | Rajesh Srinivasan: keynote "The AI Marketing Revolution". M.K. Elango: "AI & Content Automation in Marketing". Mani Maran Ramalingam (Thedico): "From Traditional to AI-Driven Digital Marketing". Arunkumar Nataraj (REAINMAKER AI, Malaysia): "AI-Powered Go-To-Market Strategies". Dinesh Yuvaraj (Cubeaisolutions) and Venkatesh C.R. (Dot Com Infoway): "Future-Ready Marketing Teams & Structures". Poonthamil Kumaran (Multipreneur Academy): panel discussion. Sasi Varna Kumar: "e-commerce expert". | Sona post |
| More speakers named (no roles) | Dr. Venkatesan Lakshminarasimhan, Eswaran Arumugam | Venkatesh C.R. post (crvenk link above) |
| Speaker's own session line | "AI in Marketing - exploring how artificial intelligence is transforming the way we connect with audiences" | crvenk post |
| Elango's stated titles (pre-event post) | "Founder & CEO of StartNet Ventures Private Limited, Chief Strategist at Publytics, and Executive Director at ThinkTN" | StartNet Vibe post |
| Pre-event framing | "CCI Framework": "Copy proven AI marketing strategies", "Customize them for unique audiences", "Innovate to stay ahead of the curve" | StartNet Vibe post |
| Format | Interactive workshops, live campaign demos, open discussions; "ready to scale across Tamil Nadu" | Sona post |
| Tickets | Student special pass; a "20% OFF" promo; site marketing.vibesummits.in (dead now); student bulk link via Razorpay | attendee post; StartNet Vibe post |
| Venue description (promo) | IIT Madras partner incubator, 15,000 sq ft deep-tech space, MSME-funded hub (as claimed in the promo) | https://www.instagram.com/p/DMFrKijzeYI/ |

**Media:** LinkedIn post images are owned by StartNet Vibe, Sona Incubation Foundation and Venkatesh C.R.; no direct URLs without logging in. No YouTube video found.
**Gaps:** final agenda; whether it was ticketed or free (the site says "free", but the posts mention passes and a discount, which is a **likely correction**); any second edition.

---

## 4. 10-Minute Vibe Challenge at TNGSS 2025 (Coimbatore)

| Fact | Value | Source |
|---|---|---|
| Host event | "Tamil Nadu Global Startup Summit (TNGSS) 2025", "9 & 10 October 2025", "Codissia Trade Fair Complex, Coimbatore", organiser "StartupTN" | https://www.eoibudapest.gov.in/section/public-advisories/conference-tamil-nadu-global-startup-summit-9-10-oct-2025-coimbatore/ |
| Challenge brief | "Create any one professional assets in 10 minutes with AI Tools." Outputs included landing pages, pitch decks, brand songs, social content and video ads. | StartNet Vibe post, 13 Oct 2025: https://www.linkedin.com/posts/startnetvibe_10minutevibechallenge-startnetvibe-tngss2025-activity-7383414108701908992-cbYG |
| Numbers | 100+ registered; top 3 received gifts (no values stated) | same |
| Booth recap | "two days at the Tamil Nadu Global Startup Summit 2025"; "Engaging discussions with 100+ startup enthusiasts and industry leaders" | StartNet Vibe post, 11 Oct 2025: https://www.linkedin.com/posts/startnetvibe_tngss2025-startnetvibe-startupecosystem-activity-7382709686883545088-j9Hy |

**Media:** already covered (`pool/vibereal/01–20`). **Gaps:** winners' names (none published); booth number.

---

## 5. Vibe Campus build nights / Vibe Academy / Vibe Summit (state finale)

No public, dated record was found for any of these. The live startnet.in/vibe page describes "Vibe Summits" as "Cheap, high-frequency" campus summits. It describes Vibe Academy as faculty development ("Faculty development is the product") with four tracks: Perception, Generative, Agentic, Physical. That is StartNet's own copy, not an event record. The Vibe Summits wording differs from the repo's "one Vibe Summit each year is the state finale", which is worth reconciling. The public record suggests "Vibe Summits" in practice meant the Vibe Coding and Vibe Marketing summits under the vibesummits.in banner.

---

## Channels checked
- **YouTube @startnetvibe** (channel ID `UChUMIWIgQFFMUNH1ML_yvSg`, created 7 May 2025): **no public videos** (RSS feed empty). YouTube searches found nothing for Vibathon, the Vibe Coding Summit, the Vibe Marketing Summit or the 10-Minute Challenge.
- **Instagram @startnetvibe:** about 12 visible posts (Jun–Jul 2025), mostly summit promos. Posts DK1HDdHzNLY and DKywZU7zNgm returned no caption.
- **GitHub @startnetvibe:** no public repos.
- **Domains no longer resolving:** startnetvibe.in, vibathon.in, vibesummits.in (incl. cbe. and marketing.). None of them have Wayback snapshots.
- **No news coverage** of any of these events was found in the search index.
