# Image plan: what fills every image slot

Status: curation plan, 2026-10-09. Data file: [`client/src/data/imagePlan.js`](../client/src/data/imagePlan.js)
(`IMAGE_PLAN`, `planFor`). Photo library: `client/src/data/photos.manifest.json` (see [PHOTOS.md](PHOTOS.md) and
[PHOTO_CREDITS.md](PHOTO_CREDITS.md)). Nothing was downloaded or added to the library for this plan.

**The plan is data only.** It changes nothing on screen until `components/ArtImage.jsx` calls `planFor()` (proposal
below). That folder belongs to the motion/interaction workflow, so wiring it in is their step.

## 1. Rules used

1. **A photograph only where it shows the slot's own subject.** A page hero, a brand tile or door, a programme tab,
   a lab card or a section about people doing the work gets a photo. Real StartNet photos come first:
   `pool/vibereal` (StartNet Vibe at TNGSS 2025), `pool/stage` (StartNet stages 2023–24) and `event/*`.
2. **Motion where a photo would mean nothing**, so the slot shows the animated abstract visual:
   - data artefacts: report and index covers, the Founder Ledger, the 38-district maps;
   - platform and process concepts: StartNet X audience pages, the model diagram, the ladders;
   - events with no photograph of their own yet. These are never filled with a stock or other-event photo.
3. **Event pages show only their own event's photos.** This covers every `/events/<series>[/<edition>]` page,
   `/vibe/vibathon`, `/vibe/summit` and `/connect/<sector>`. Licensed stock never appears on an event page or an
   event card.
4. **No photo appears twice on one page.** FeatureTabs renders each tab twice (a desktop panel and a phone
   accordion, and only one is visible), so the two copies share one entry.
5. **No photo appears on more than one of the most-visited pages** (`/`, `/vibe`, `/research`, `/connect`, `/women`,
   `/events`, `/programmes`, `/about`). The validator finds no repeats.
6. **Sharp enough for the slot.** Each photo's cropped width is checked against the slot's rendered width at
   1440 px. A photo under 1× is not used: the 572 px Vibathon photo is kept off 4:5 posters, 21:9 bands and
   story heroes. The slots that sit between 1.0× and 1.2× are listed in gap G2.
7. **Brand book (Book 3 §04.7):**
   - real Tamil Nadu, people doing the work, a caption that proves the photo (StartNet photos carry theirs);
   - no stock towers or handshakes;
   - no kolam or temple photos as decoration. The About hero's kolam photo (`pool/places/07`) is replaced, and no
     `pool/places` photo is used;
   - no stock that could pass for a real StartNet event or person. `pool/events/*` and `pool/community/*` stay
     unused;
   - no photos showing another state's script or setting (`pool/women/10`, `pool/partner/02`).
8. **Excluded from the plan:**
   - event galleries ("From the room", `documentary` / `noCaption`);
   - people portraits (`PersonCard`, which uses `person/<slug>` with consent);
   - the mega-menu event thumbnails (site chrome).

   These keep their own logic.

## 2. How slots are keyed, and the lookup ArtImage should call

- **Route key.** The path without `/ta` and without a trailing slash. `':param'` segments are wildcards
  (`/research/labs/:lab`, `/insights/reports/:report`, `/insights/indices/:index`). `'*'` holds site-wide entries.
- **Slot key.** `variant:seed` comes from the props ArtImage already gets (defaults `grid` and `1`),
  e.g. `network:7`. If one page has two slots with the same variant and seed but different ratios, the entry
  carries the ratio: `grid:23@1/1` (only `/vibe` needs this). An explicit `slot="…"` prop on ArtImage overrides the
  key, for pages that want a named slot later.
- **Site-wide cards.** EventCard, EditionCard and the edition-page poster, StoryCard and ReportCard take their seed
  from `hash(slug) % 997`, so the key is stable per record. Their entries live in `'*'`, so one event, story or
  report gets the same decision on every page. A route entry overrides `'*'` where that page would otherwise
  repeat a photo.
- **Lookup order.** Exact route, then `:param` patterns, then `'*'`. At each level the ratio-qualified key is tried
  before the plain key.

```js
// components/ArtImage.jsx (proposal; path = basePath || '/')
import { planFor } from '../data/imagePlan.js';
const planned = planFor(path, { slot, variant, seed, ratio, documentary, noCaption });
// undefined → no plan: current behaviour (DECORATIVE_PHOTOS, photo / photoPool props)
// null      → 'motion': BrandVisual, no photo, no library pick
// object    → manifest photo { key, base, widths, … }: shown even with DECORATIVE_PHOTOS off
const photo = planned !== undefined ? planned : photoAllowed ? photoProp : null;
const photoPool = planned !== undefined ? undefined : photoAllowed ? photoPoolProp : undefined;
```

`planFor` is pure and synchronous, so the prerender and the browser make the same choice (SSR-safe). ArtImage keeps
its aspect-ratio box either way, so there is no layout shift. The photo's own `alt` / `altTa` and caption from the
manifest replace the artwork alt, which ArtImage already does for photos, so no copy changes. The page-level
`markPhotoUsed` / `hintFixedPhoto` bookkeeping keeps working because a planned photo goes through the same `photo`
path.

## 3. Coverage

Crawled: all 213 EN routes from the route table (`server/dist/common/routes.js`, the same list as sitemap.xml), on
the Vite dev server at 1440×900. The API server was down, so `/api/*` was answered from
`server/data` through the server's own `ContentService`. Slots were read from React props (variant, seed, ratio,
brand, photo).

| | Count |
|---|---|
| Routes crawled | 213 (95 with at least one image slot; the other 118 have none: all 22 `/programmes/*`, 39 `/districts/*`, 10 `/legal/*`, most `/connect/<sector>` and `/women/*` sub-pages, `/join`, `/sitemap` …) |
| Slot instances (FeatureTabs twins counted once) | 272 |
| **Photo** (planned) | **76**: 37 StartNet (vibereal / stage / event), 39 licensed stock |
| **Motion** (planned) | **181**: data covers, maps, platform and process slots, and events without photos |
| Own photos, unchanged | 9 event-gallery photos (SaaS Connect 2025) + 6 people portraits (initials until consented portraits arrive) |
| Unplanned slots | 0 |
| Distinct photos used | 46 of the 102 in the library (19 StartNet, 27 stock) |
| Repeats on one page | 0 |
| Repeats across the top pages | 0 |

Most-visited pages:

| Page | Slots | Photo | Motion |
|---|---|---|---|
| `/` | 15 | 7 (hero, 4 brand tiles, SaaS Connect card, partner band) | 8 (district map, 7 event cards with no own photo) |
| `/vibe` | 11 | 6 (hero, 4 programme tabs, Academy section) | 5 (event cards) |
| `/research` | 7 | 4 (hero, Physical AI and Drug Discovery labs, "100 conversations") | 3 (Agentic AI and Ontology labs, Lab-to-Market card) |
| `/connect` | 5 | 3 (hero, section, SaaS Connect card) | 2 (GenAI and D2C cards) |
| `/women` | 3 | 2 (hero, Rise Academy) | 1 (Women Founders Report cover) |
| `/events` | 2 | 2 (hero, "Rooms since 2023") | 0 |
| `/about` | 8 | 3 (hero, two timeline entries) | 5 (two maps, model, connector, Investors Summit and Vibathon timeline entries) |
| `/programmes` | 0 | none (no image slots on the page) | none |

Library photos left unused on purpose:
- `pool/events/*` and `pool/community/*`: these read as StartNet events or people.
- `pool/places/*`: kolam, temple and city postcards.
- `pool/insights/02–06`: desk still-lifes.
- `pool/partner/*`, `pool/research/09–10`: not Tamil Nadu.
- `pool/women/10`: Devanagari script in the shot.
- Spare `vibereal` and `stage` frames, kept for galleries.

## 4. Gaps: photos StartNet should commission (Book 3 rules)

Every shot below follows Book 3 §04.7:
- real Tamil Nadu, people doing the work rather than posing, a balanced mix of gender, district and institution
  type, accurate skin tones, no lightening;
- no AI imagery, no logos or text burned in, no red tints;
- landscape originals of at least 2400 px with room around the subject. Mark `focus` / `focusMobile` in the sidecar
  so 4:5, 16:9 and 21:9 crops all work;
- a caption naming the event or organisation, the place and the month.

Each photo goes in `photos/originals/<key>.jpg` and is added with `npm run photos` (PHOTOS.md). Then the matching
`motion` entry in `imagePlan.js` is switched to the new key.

| Gap | Key(s) to supply | Slots it fills (now motion or low-res) | The shot |
|---|---|---|---|
| G1 | `event/vibathon/2025-2 … -6` (originals at full size; the current file is 572 px) | `/vibe/vibathon` hero, `/events/vibathon` hero, the `/vibe/events` 21:9 band, the Vibathon 2025 edition poster and card, the story card and story hero "Vibathon 2025: where the colleges were", the `/about` timeline entry, and later the 2027 posters | K.S.R. College of Engineering hall, 26 Sept 2025. A wide shot of teams building at their laptops, with mentors bending over a table. Then a 4:5-friendly mid shot of one mixed team mid-build, screens not readable, and the demo moment on stage. |
| G2 | High-res originals for `pool/stage/01, 05, 09, 11, 12` (now 1280 px video frames) | `/about` hero, `/events` hero, `/partner` hero, `/media`, `/partner/investors`, the "StartNet rooms since 2023" story hero, the Connect brand tile (all between 1.0× and 1.2× today) | The same moments from the original stills: speakers mid-sentence, the Mega Pitching jury in discussion, young founders presenting. Shoot at least 4000 px wide so the 4:5 crops stay sharp. |
| G3 | `event/genai-connect/2024` (+ `-2 …`) | GenAI Connect series hero, 2024 and 2027 posters and cards, `/connect/events` | GenAI Connect Summit & Expo, Salem, 27 April 2024. The expo floor with a live demo, and a panel mid-discussion with the audience in frame. |
| G4 | `event/d2c-connect/2024` (+ `-2 …`) | D2C Connect series hero, 2024 and 2027 posters and cards, `/connect/events` | D2C Connect, Coimbatore, November 2024 (the old gallery files listed in PHOTOS.md). Founders at product tables, and a brand founder on stage. |
| G5 | `event/vibe-marketing-summit-2025` | `/events/vibe-marketing-summit-2025` poster | The summit in Salem: students presenting marketing work, with the room listening. |
| G6 | `event/vibe-campus` | Vibe Campus build nights card and poster, `/events/vibe-campus` hero, the `/vibe/events` card | A Tier-2/3 college hall at night: student teams coding, a StartNet mentor walking between tables. Warm practical light, no posed group photo. |
| G7 | `event/lab-to-market-summit` and the StartNet Labs story | Lab-to-Market Summit hero, card and posters, `/research/events` | Researchers demonstrating prototypes to industry visitors, and a scholar pitching to a panel. |
| G8 | `event/women-founders-summit`; a real Women Circle | WFS hero, card and poster, `/women/events` (Summit, Awards), and replacing stock `pool/women/09` on Women Circles | Women founders on stage and at the awards (named in the caption), and a district Women Circle meeting around a table in Tamil Nadu. |
| G9 | `event/vibe-summit` | `/vibe/summit` hero, `/events/vibe-summit`, the Vibe Summit card and poster | Students showcasing builds to an audience of peers and founders. |
| G10 | `event/investors-summit/<year>` | Investors Summit hero and archive poster, the `/about` timeline entry | An investor panel and founder one-to-ones, with the year in the caption. |
| G11 | `hero/research/labs/*` or `story/…` per lab | Agentic AI Lab and Ontology & Knowledge Lab (now motion). Replaces stock on Physical AI (`pool/research/08`) and Drug Discovery (`pool/research/02`) | Agentic AI: researchers at workstations reviewing agent runs, screens unreadable. Ontology: a team mapping concepts on a whiteboard. Physical AI: a robotics bench with hands on hardware. Drug Discovery: wet-lab work at a partner institution in Tamil Nadu. |
| G12 | `hero/home`, `hero/vibe`, `hero/women`, `hero/research` | The home hero (now a SaaS Connect roundtable), `/vibe` hero (1152 px), `/women` hero (stock), `/research` hero (stock) | Home: one wide StartNet room with students, researchers, professionals and women founders building together. Women: women founders in a Circle meeting. Research: a Tamil Nadu scholar with a prototype. |
| G13 | `hero/contact` (optional) | `/contact` Salem map (kept as motion until then) | The StartNet office in Salem: the entrance or the team at work, daylight. |
| G14 | `person/m-k-elango`, `person/v-nagaraj`, `person/poonthamil` | `/about/leadership`, `/media` portraits | Head-and-shoulders, plain background, consistent light, `"consent": true`. |
| G15 | `hero/women/rise-academy` | `/women` "Rise Academy, on your phone" (now stock `pool/women/01`, a tablet) | A woman founder in a district town learning on her phone: the label says "on your phone". |
| G16 | `hero/partner/gccs`, `hero/partner/institutions` | `/partner/gccs` (stock `professionals/10`), `/partner/institutions` (stock `students/07`) | A GCC team reviewing a student pilot. Graduates of a partner college presenting their company. |
| G17 | `hero/careers` | `/careers` (now `vibereal/10`) | The StartNet team at work in the office: candid, mid-task. |

Licensed stock still in the plan, to be replaced slot by slot as these arrive:
- research: 01, 02, 03, 04, 06, 07, 08;
- students: 03, 07, 08, 09, 10;
- professionals: 02, 03, 04, 08, 10;
- women: 01, 03, 04, 06, 07, 08, 09;
- platform: 02, 04;
- insights: 01.

## 5. Plan per route

Columns:
- **Slot key**: the key in `IMAGE_PLAN`.
- **Component**: the nearest owner component.
- **Slot content**: the heading or card title next to the slot.
- **Plan**: what `planFor` returns.

Routes are listed most-visited first, then alphabetically.

#### `/`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:11` | 21/9 | section | Every talent, a founder. (hero) | `event/saas-connect/2025-4` | Industry leaders in a roundtable session at SaaS.Connect 2025 *(StartNet)* |
| 2 | `network:11` | 4/5 | BrandTile | StartNetResearch | `pool/research/06` | A researcher in a lab coat at a microscope *(licensed stock)* |
| 3 | `grid:23` | 4/5 | BrandTile | StartNetVibe | `pool/vibereal/10` | At the StartNet booth, TNGSS 2025 *(StartNet)* |
| 4 | `network:37` | 4/5 | BrandTile | StartNetConnect | `pool/stage/09` | A member speaking at a StartNet network meeting, September 2023 *(StartNet)* |
| 5 | `ladder:41` | 4/5 | BrandTile | StartNetWomen | `pool/women/03` | A woman entrepreneur with her textile business *(licensed stock)* |
| 6 | `map:38` | 4/5 | section | The talent is here. The bridge to capital isn't, yet. | motion | animated abstract visual |
| 7 | `dot:150` | 4/3 | EventCard | Vibe Campus build nights | motion | animated abstract visual |
| 8 | `network:379` | 4/3 | EventCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 9 | `grid:435` | 4/3 | EventCard | Vibathon 2027 | motion | animated abstract visual |
| 10 | `map:743` | 4/3 | EventCard | GenAI Connect 2027 | motion | animated abstract visual |
| 11 | `dot:373` | 4/3 | EventCard | SaaS Connect 2027 | `event/saas-connect/2025` | An attendee asks a question from the audience at SaaS.Connect 2025 *(StartNet)* |
| 12 | `dot:394` | 4/3 | EventCard | D2C Connect 2027 | motion | animated abstract visual |
| 13 | `map:836` | 4/3 | EventCard | Lab-to-Market Summit 2027 | motion | animated abstract visual |
| 14 | `network:956` | 4/3 | EventCard | Women Founders Summit & Awards 2027 | motion | animated abstract visual |
| 15 | `network:4` | 3/2 | section | Organisations that need founders pay for founders | `pool/professionals/02` | Colleagues collaborating around a table with laptops *(licensed stock)* |

#### `/vibe`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:7` | 16/10 | BrandHero | Build something real before you graduate. (hero) | `pool/vibereal/05` | StartNet Vibe team on the expo floor at TNGSS 2025 *(StartNet)* |
| 2 | `network:11` | 4/3 | FeatureTabs | Vibathon tab | motion | animated abstract visual (the only Vibathon photo is 572 px and was upscaled 1.45x in the 832 px panel; GAP G1) |
| 3 | `grid:23@4/3` | 4/3 | FeatureTabs | Vibe Academy tab | `pool/students/10` | A student building on a laptop *(licensed stock)* |
| 4 | `kolam:37` | 4/3 | FeatureTabs | Vibe Campus tab | `pool/students/03` | Students at their desks in a college classroom *(licensed stock)* |
| 5 | `dot:41` | 4/3 | FeatureTabs | Vibe Clubs tab | `pool/students/09` | Young builders around a table with laptops *(licensed stock)* |
| 6 | `grid:23@1/1` | 1/1 | section | Ship it, then get the certificate. | `pool/students/08` | A student coding on a computer in a workspace *(licensed stock)* |
| 7 | `dot:150` | 4/3 | EventCard | Vibe Campus build nights | motion | animated abstract visual |
| 8 | `network:379` | 4/3 | EventCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 9 | `grid:435` | 4/3 | EventCard | Vibathon 2027 | `event/vibathon/2025` (series photo, no override) | Students in the hall at Vibathon 2025, K.S.R. College of Engineering *(StartNet)*; sharp at the ~390 px card width |
| 10 | `kolam:675` | 4/3 | EventCard | Vibe Summit 2027 | motion | animated abstract visual |
| 11 | `grid:617` | 4/5 | StoryCard | Vibathon 2025: where the colleges were | motion | animated abstract visual |

#### `/research`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:7` | 4/5 | BrandHero | Your research, a company you co-own. (hero) | `pool/research/03` | A researcher looking through a microscope *(licensed stock)* |
| 2 | `network:11` | 3/2 | Card | Agentic AI Lab | motion | animated abstract visual |
| 3 | `kolam:23` | 3/2 | Card | Ontology & Knowledge Lab | motion | animated abstract visual |
| 4 | `grid:37` | 3/2 | Card | Physical AI Lab | `pool/research/08` | An engineer working at a lab bench *(licensed stock)* |
| 5 | `dot:41` | 3/2 | Card | Drug Discovery Lab | `pool/research/02` | A researcher in a lab coat with a sample *(licensed stock)* |
| 6 | `ladder:19` | 4/5 | section | 100 conversations before a single rupee. | `pool/professionals/04` | A founder in conversation at a laptop *(licensed stock)* |
| 7 | `map:836` | 4/3 | EventCard | Lab-to-Market Summit 2027 | motion | animated abstract visual |

#### `/connect`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:7` | 4/5 | BrandHero | Keep your job while you test your company. (hero) | `event/saas-connect/2025-5` | Attendees in a session room at SaaS.Connect 2025 *(StartNet)* |
| 2 | `map:743` | 4/3 | EventCard | GenAI Connect 2027 | motion | animated abstract visual |
| 3 | `dot:373` | 4/3 | EventCard | SaaS Connect 2027 | `event/saas-connect/2025-2` | The "Founder Stories – 0 to $1M ARR" panel on stage at SaaS.Connect 2025 *(StartNet)* |
| 4 | `dot:394` | 4/3 | EventCard | D2C Connect 2027 | motion | animated abstract visual |
| 5 | `ladder:11` | 4/5 | section | Your next customer, investor or market. | `pool/professionals/08` | Two co-founders discussing work at a laptop *(licensed stock)* |

#### `/women`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:38` | 4/5 | BrandHero | Half of Tamil Nadu's startups are women-led. Now for the cap (hero) | `pool/women/06` | A woman founder working at her desk *(licensed stock)* |
| 2 | `ladder:12` | 4/5 | section | Learn the business side, with a mentor beside you. | `pool/women/01` | A woman entrepreneur with a tablet *(licensed stock)* |
| 3 | `dot:8` | 1/1 | section | A day for the founders, and the numbers behind them. | motion | animated abstract visual |

#### `/events`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:11` | 4/5 | PageHero | Find a room full of builders near you. (hero) | `pool/stage/01` | A speaker on stage at a StartNet event, February 2024 *(StartNet)* |
| 2 | `grid:27` | 3/2 | section | Rooms since 2023. | `pool/stage/12` | The jury at the StartNet Mega Pitching event, 2023 *(StartNet)* |

#### `/about`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:7` | 4/5 | PageHero | We turn talent into founders. (hero) | `pool/stage/11` | Young founders speaking at a StartNet network meeting, September 2023 *(StartNet)* |
| 2 | `map:38` | 4/5 | section | The talent is here. The bridge to capital isn't, yet. | motion | animated abstract visual |
| 3 | `grid:4` | 1/1 | section | Four talent brands. Six shared engines. One platform. | motion | animated abstract visual |
| 4 | `network:21` | 3/2 | section | A feeder and connector, not a rival. | motion | animated abstract visual |
| 5 | `grid:11` | 4/3 | Timeline | StartNet starts, in Salem | `pool/stage/08` | On stage at the StartNet launch, July 2023 *(StartNet)* |
| 6 | `network:12` | 4/3 | Timeline | GenAI Connect, D2C Connect, SaaS Connect | `event/saas-connect/2025-3` | The illuminated SaaSConnect letters at the venue *(StartNet)* |
| 7 | `dot:13` | 4/3 | Timeline | Investors Summit | motion | animated abstract visual |
| 8 | `kolam:14` | 4/3 | Timeline | Vibathon 2025 | motion | animated abstract visual |

#### `/about/how-we-work`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:24` | 3/2 | section | StartNet Research | `pool/research/04` | A researcher at a microscope *(licensed stock)* |
| 2 | `kolam:12` | 3/2 | section | StartNet Vibe | `pool/vibereal/17` | A visitor trying the Vibe Challenge on a tablet at the StartNet booth *(StartNet)* |
| 3 | `kolam:21` | 3/2 | section | StartNet Connect | `pool/stage/04` | A speaker addressing the room, StartNet event, February 2024 *(StartNet)* |
| 4 | `kolam:15` | 3/2 | section | StartNet Women | `pool/women/08` | A woman working at a desk, smiling *(licensed stock)* |
| 5 | `network:31` | 3/2 | section | StartNet X. | motion | animated abstract visual |

#### `/about/leadership`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `portrait:197` | 1/1 | PersonCard | M K Elango | own (person/…) | consented portrait when supplied, else initials |
| 2 | `portrait:573` | 1/1 | PersonCard | Dr V. Nagaraj | own (person/…) | consented portrait when supplied, else initials |
| 3 | `portrait:366` | 1/1 | PersonCard | Poonthamil | own (person/…) | consented portrait when supplied, else initials |

#### `/about/mission-1-lakh`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `ladder:7` | 4/5 | PageHero | We count outcomes, not attendance. (hero) | motion | animated abstract visual |

#### `/about/self-diagnosis`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:27` | 4/5 | PageHero | StartNet scores itself. (hero) | motion | animated abstract visual |
| 2 | `grid:241` | 3/2 | ReportCard | Founder Ledger | motion | animated abstract visual |
| 3 | `network:728` | 3/2 | ReportCard | TN Founder Report 2027 | motion | animated abstract visual |
| 4 | `map:283` | 3/2 | ReportCard | Founder Readiness Index | motion | animated abstract visual |

#### `/brands`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:3` | 16/10 | BrandDoor | StartNetResearch | `pool/research/07` | A researcher examining a sample under a microscope *(licensed stock)* |
| 2 | `dot:8` | 16/10 | BrandDoor | StartNetVibe | `pool/vibereal/03` | StartNet Vibe team and Vibe Challenge winners at the booth, TNGSS 2025 *(StartNet)* |
| 3 | `grid:13` | 16/10 | BrandDoor | StartNetConnect | `pool/stage/10` | A speaker at a StartNet network meeting, September 2023 *(StartNet)* |
| 4 | `kolam:21` | 16/10 | BrandDoor | StartNetWomen | `pool/women/07` | A woman working at a table with a laptop *(licensed stock)* |

#### `/careers`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `ladder:10` | 4/5 | PageHero | Help Tamil Nadu's next founders get started. (hero) | `pool/vibereal/10` | At the StartNet booth, TNGSS 2025 *(StartNet)* |

#### `/connect/d2c`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:394` | 4/3 | EventCard | D2C Connect 2027 | motion | animated abstract visual |

#### `/connect/events`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:60` | 21/9 | Card | GenAI Connect | motion | animated abstract visual |
| 2 | `grid:61` | 21/9 | Card | SaaS Connect | `event/saas-connect/2025` | An attendee asks a question from the audience at SaaS.Connect 2025 *(StartNet)* |
| 3 | `dot:62` | 21/9 | Card | D2C Connect | motion | animated abstract visual |
| 4 | `kolam:63` | 21/9 | Card | All sector Connects | motion | animated abstract visual |
| 5 | `map:743` | 4/3 | EventCard | GenAI Connect 2027 | motion | animated abstract visual |
| 6 | `dot:373` | 4/3 | EventCard | SaaS Connect 2027 | `event/saas-connect/2025-2` | The "Founder Stories – 0 to $1M ARR" panel on stage at SaaS.Connect 2025 *(StartNet)* |
| 7 | `dot:394` | 4/3 | EventCard | D2C Connect 2027 | motion | animated abstract visual |

#### `/connect/genai`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:743` | 4/3 | EventCard | GenAI Connect 2027 | motion | animated abstract visual |

#### `/connect/saas`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:373` | 4/3 | EventCard | SaaS Connect 2027 | motion | animated abstract visual |
| 2 | `grid:1` | 4/3 | EventGallery | From the room | own (event/saas-connect/2025) | An attendee asks a question from the audience at SaaS.Connect 2025 |
| 3 | `grid:1` | 3/2 | EventGallery | From the room | own (event/saas-connect/2025-2) | The "Founder Stories – 0 to $1M ARR" panel on stage at SaaS.Connect 2025 |
| 4 | `grid:1` | 3/2 | EventGallery | From the room | own (event/saas-connect/2025-3) | The illuminated SaaSConnect letters at the venue |
| 5 | `grid:1` | 3/2 | EventGallery | From the room | own (event/saas-connect/2025-4) | Industry leaders in a roundtable session at SaaS.Connect 2025 |
| 6 | `grid:1` | 3/2 | EventGallery | From the room | own (event/saas-connect/2025-5) | Attendees in a session room at SaaS.Connect 2025 |

#### `/contact`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:600` | 3/2 | section | Salem, Tamil Nadu | motion | animated abstract visual |

#### `/events/d2c-connect`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:248` | 4/5 | PageHero | D2C Connect. (hero) | motion | animated abstract visual |
| 2 | `network:33` | 16/9 | EditionCard | D2C Connect 2027 | motion | animated abstract visual |

#### `/events/d2c-connect/2024`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:30` | 4/5 | EditionPage | D2C Connect Summit & Expo 2024 (poster) | motion | animated abstract visual |
| 2 | `network:33` | 16/9 | EditionCard | D2C Connect 2027 | motion | animated abstract visual |

#### `/events/d2c-connect/2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:33` | 4/5 | EditionPage | D2C Connect 2027 (poster) | motion | animated abstract visual |
| 2 | `network:30` | 16/9 | EditionCard | D2C Connect Summit & Expo 2024 | motion | animated abstract visual |

#### `/events/founders-day`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:7` | 4/5 | PageHero | StartNet Founders Day. (hero) | motion | animated abstract visual |

#### `/events/genai-connect`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:97` | 4/5 | PageHero | GenAI Connect. (hero) | motion | animated abstract visual |
| 2 | `network:202` | 16/9 | EditionCard | GenAI Connect 2027 | motion | animated abstract visual |

#### `/events/genai-connect/2024`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:199` | 4/5 | EditionPage | GenAI Connect Summit & Expo 2024 (poster) | motion | animated abstract visual |
| 2 | `network:202` | 16/9 | EditionCard | GenAI Connect 2027 | motion | animated abstract visual |

#### `/events/genai-connect/2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:202` | 4/5 | EditionPage | GenAI Connect 2027 (poster) | motion | animated abstract visual |
| 2 | `network:199` | 16/9 | EditionCard | GenAI Connect Summit & Expo 2024 | motion | animated abstract visual |

#### `/events/host`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:38` | 4/5 | PageHero | Host StartNet in your college or district. (hero) | `pool/students/03` | Students at their desks in a college classroom *(licensed stock)* |

#### `/events/investors-summit`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:747` | 4/5 | PageHero | Investors Summit. (hero) | motion | animated abstract visual |

#### `/events/investors-summit/archive`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:385` | 4/5 | EditionPage | Investors Summit (past edition) (poster) | motion | animated abstract visual |

#### `/events/lab-to-market-summit`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:2` | 4/5 | PageHero | Lab-to-Market Summit. (hero) | motion | animated abstract visual |
| 2 | `grid:995` | 16/9 | EditionCard | Lab-to-Market Summit 2027 | motion | animated abstract visual |

#### `/events/lab-to-market-summit/2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:995` | 4/5 | EditionPage | Lab-to-Market Summit 2027 (poster) | motion | animated abstract visual |

#### `/events/research-days`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:850` | 4/5 | PageHero | Research Days. (hero) | motion | animated abstract visual |

#### `/events/saas-connect`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:894` | 4/5 | PageHero | SaaS Connect. (hero) | `event/saas-connect/2025-3` | The illuminated SaaSConnect letters at the venue *(StartNet)* |
| 2 | `network:822` | 16/9 | EditionCard | SaaS Connect 2027 | `event/saas-connect/2025-5` | Attendees in a session room at SaaS.Connect 2025 *(StartNet)* |

#### `/events/saas-connect/2025`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:820` | 4/5 | EditionPage | SaaS Connect Summit & Expo 2025 (poster) | `event/saas-connect/2025-3` | The illuminated SaaSConnect letters at the venue *(StartNet)* |
| 2 | `grid:1` | 4/3 | EventGallery | From the room | own (event/saas-connect/2025) | An attendee asks a question from the audience at SaaS.Connect 2025 |
| 3 | `grid:1` | 3/2 | EventGallery | From the room | own (event/saas-connect/2025-2) | The "Founder Stories – 0 to $1M ARR" panel on stage at SaaS.Connect 2025 |
| 4 | `grid:1` | 3/2 | EventGallery | From the room | own (event/saas-connect/2025-4) | Industry leaders in a roundtable session at SaaS.Connect 2025 |
| 5 | `grid:1` | 3/2 | EventGallery | From the room | own (event/saas-connect/2025-5) | Attendees in a session room at SaaS.Connect 2025 |
| 6 | `network:822` | 16/9 | EditionCard | SaaS Connect 2027 | motion | animated abstract visual |

#### `/events/saas-connect/2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:822` | 4/5 | EditionPage | SaaS Connect 2027 (poster) | `event/saas-connect/2025-5` | Attendees in a session room at SaaS.Connect 2025 *(StartNet)* |
| 2 | `network:820` | 16/9 | EditionCard | SaaS Connect Summit & Expo 2025 | `event/saas-connect/2025-3` | The illuminated SaaSConnect letters at the venue *(StartNet)* |

#### `/events/vibathon`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:24` | 4/5 | PageHero | Vibathon. (hero) | motion | animated abstract visual |
| 2 | `network:283` | 16/9 | EditionCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 3 | `network:528` | 16/9 | EditionCard | Vibathon 2027 | motion | animated abstract visual |

#### `/events/vibathon/2025`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:526` | 4/5 | EditionPage | Vibathon 2025 (poster) | motion | animated abstract visual |
| 2 | `network:283` | 16/9 | EditionCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 3 | `network:528` | 16/9 | EditionCard | Vibathon 2027 | motion | animated abstract visual |

#### `/events/vibathon/2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:528` | 4/5 | EditionPage | Vibathon 2027 (poster) | motion | animated abstract visual |
| 2 | `network:283` | 16/9 | EditionCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 3 | `network:526` | 16/9 | EditionCard | Vibathon 2025 | motion | animated abstract visual |

#### `/events/vibathon/2027-district-qualifiers`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:283` | 4/5 | EditionPage | Vibathon 2027 · District qualifiers (poster) | motion | animated abstract visual |
| 2 | `network:528` | 16/9 | EditionCard | Vibathon 2027 | motion | animated abstract visual |
| 3 | `network:526` | 16/9 | EditionCard | Vibathon 2025 | motion | animated abstract visual |

#### `/events/vibe-campus`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:72` | 4/5 | PageHero | Vibe Campus. (hero) | motion | animated abstract visual |
| 2 | `network:650` | 16/9 | EditionCard | Vibe Campus build nights | motion | animated abstract visual |

#### `/events/vibe-campus/build-nights-2026`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:650` | 4/5 | EditionPage | Vibe Campus build nights (poster) | motion | animated abstract visual |

#### `/events/vibe-marketing-summit-2025`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:481` | 4/5 | EventDetail | Vibe Marketing Summit 2025 (hero) (poster) | motion | animated abstract visual |
| 2 | `dot:150` | 4/3 | EventCard | Vibe Campus build nights | motion | animated abstract visual |
| 3 | `network:379` | 4/3 | EventCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 4 | `grid:435` | 4/3 | EventCard | Vibathon 2027 | `event/vibathon/2025` | Students in the hall at Vibathon 2025, K.S.R. College of Engineering *(StartNet)* |

#### `/events/vibe-summit`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:555` | 4/5 | PageHero | Vibe Summit. (hero) | motion | animated abstract visual |
| 2 | `network:178` | 16/9 | EditionCard | Vibe Summit 2027 | motion | animated abstract visual |

#### `/events/vibe-summit/2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:178` | 4/5 | EditionPage | Vibe Summit 2027 (poster) | motion | animated abstract visual |

#### `/events/women-founders-summit`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:604` | 4/5 | PageHero | Women Founders Summit & Awards. (hero) | motion | animated abstract visual |
| 2 | `kolam:724` | 16/9 | EditionCard | Women Founders Summit & Awards 2027 | motion | animated abstract visual |

#### `/events/women-founders-summit/2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:724` | 4/5 | EditionPage | Women Founders Summit & Awards 2027 (poster) | motion | animated abstract visual |

#### `/insights`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:6` | 4/5 | PageHero | What we count, and how we count it. (hero) | `pool/insights/01` | Reviewing a data dashboard on a laptop *(licensed stock)* |
| 2 | `grid:3` | 21/9 | Card | Founder Ledger | motion | animated abstract visual |
| 3 | `map:4` | 21/9 | Card | TN Founder Report | motion | animated abstract visual |
| 4 | `ladder:5` | 21/9 | Card | Founder Readiness Index | motion | animated abstract visual |
| 5 | `grid:6` | 21/9 | Card | Campus Innovation Index | motion | animated abstract visual |
| 6 | `network:7` | 21/9 | Card | TN Research Commercialisation Index | motion | animated abstract visual |
| 7 | `dot:8` | 21/9 | Card | TN Women Founders Report | motion | animated abstract visual |
| 8 | `network:9` | 21/9 | Card | Sector reports: State of TN SaaS, GenAI and D2C | motion | animated abstract visual |
| 9 | `portrait:10` | 21/9 | Card | Founder stories | `pool/stage/11` | Young founders speaking at a StartNet network meeting, September 2023 *(StartNet)* |
| 10 | `kolam:11` | 21/9 | Card | Corrections log | motion | animated abstract visual |
| 11 | `grid:241` | 3/2 | ReportCard | Founder Ledger | motion | animated abstract visual |
| 12 | `network:728` | 3/2 | ReportCard | TN Founder Report 2027 | motion | animated abstract visual |
| 13 | `map:283` | 3/2 | ReportCard | Founder Readiness Index | motion | animated abstract visual |
| 14 | `grid:617` | 4/5 | StoryCard | Vibathon 2025: where the colleges were | motion | animated abstract visual |
| 15 | `grid:140` | 4/5 | StoryCard | StartNet rooms since 2023 | `pool/stage/12` | The jury at the StartNet Mega Pitching event, 2023 *(StartNet)* |

#### `/insights/indices`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:29` | 4/5 | PageHero | Named, quotable frameworks. (hero) | motion | animated abstract visual |
| 2 | `grid:41` | 3/2 | Card | Campus Innovation Index | motion | animated abstract visual |
| 3 | `network:57` | 3/2 | Card | TN Research Commercialisation Index | motion | animated abstract visual |
| 4 | `ladder:63` | 3/2 | Card | Founder Readiness Index | motion | animated abstract visual |

#### `/insights/indices/campus-innovation-index`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:41` | 4/5 | PageHero | Campus Innovation Index (hero) | motion | animated abstract visual |
| 2 | `network:57` | 16/9 | Card | TN Research Commercialisation Index | motion | animated abstract visual |
| 3 | `ladder:63` | 16/9 | Card | Founder Readiness Index | motion | animated abstract visual |

#### `/insights/indices/founder-readiness-index`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `ladder:63` | 4/5 | PageHero | Founder Readiness Index (hero) | motion | animated abstract visual |
| 2 | `grid:41` | 16/9 | Card | Campus Innovation Index | motion | animated abstract visual |
| 3 | `network:57` | 16/9 | Card | TN Research Commercialisation Index | motion | animated abstract visual |

#### `/insights/indices/research-commercialisation-index`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:57` | 4/5 | PageHero | TN Research Commercialisation Index (hero) | motion | animated abstract visual |
| 2 | `grid:41` | 16/9 | Card | Campus Innovation Index | motion | animated abstract visual |
| 3 | `ladder:63` | 16/9 | Card | Founder Readiness Index | motion | animated abstract visual |

#### `/insights/newsletter`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:13` | 4/3 | PageHero | One email. What opened, what happened, what’s next. (hero) | motion | animated abstract visual |

#### `/insights/podcast`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:17` | 1/1 | PageHero | Founder conversations, in Tamil and English. (hero) | `pool/stage/02` | A fireside chat on stage at a StartNet event, February 2024 *(StartNet)* |

#### `/insights/reports`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:241` | 3/2 | ReportCard | Founder Ledger | motion | animated abstract visual |
| 2 | `network:728` | 3/2 | ReportCard | TN Founder Report 2027 | motion | animated abstract visual |
| 3 | `map:283` | 3/2 | ReportCard | Founder Readiness Index | motion | animated abstract visual |
| 4 | `map:774` | 3/2 | ReportCard | Campus Innovation Index | motion | animated abstract visual |
| 5 | `map:14` | 3/2 | ReportCard | TN Research Commercialisation Index | motion | animated abstract visual |
| 6 | `network:317` | 3/2 | ReportCard | TN Women Founders Report | motion | animated abstract visual |
| 7 | `network:164` | 3/2 | ReportCard | State of TN SaaS | motion | animated abstract visual |
| 8 | `network:452` | 3/2 | ReportCard | State of TN GenAI | motion | animated abstract visual |
| 9 | `network:681` | 3/2 | ReportCard | State of TN D2C | motion | animated abstract visual |
| 10 | `network:836` | 3/2 | ReportCard | Annual self-diagnosis | motion | animated abstract visual |
| 11 | `map:38` | 4/5 | section | TN Founder Report 2027 | motion | animated abstract visual |

#### `/insights/reports/state-of-tn-d2c`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:289` | 4/5 | PageHero | State of TN D2C (hero) | motion | animated abstract visual |
| 2 | `network:728` | 3/2 | ReportCard | TN Founder Report 2027 | motion | animated abstract visual |
| 3 | `network:317` | 3/2 | ReportCard | TN Women Founders Report | motion | animated abstract visual |
| 4 | `network:164` | 3/2 | ReportCard | State of TN SaaS | motion | animated abstract visual |

#### `/insights/reports/state-of-tn-genai`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:101` | 4/5 | PageHero | State of TN GenAI (hero) | motion | animated abstract visual |
| 2 | `network:728` | 3/2 | ReportCard | TN Founder Report 2027 | motion | animated abstract visual |
| 3 | `network:317` | 3/2 | ReportCard | TN Women Founders Report | motion | animated abstract visual |
| 4 | `network:164` | 3/2 | ReportCard | State of TN SaaS | motion | animated abstract visual |

#### `/insights/reports/state-of-tn-saas`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:550` | 4/5 | PageHero | State of TN SaaS (hero) | motion | animated abstract visual |
| 2 | `network:728` | 3/2 | ReportCard | TN Founder Report 2027 | motion | animated abstract visual |
| 3 | `network:317` | 3/2 | ReportCard | TN Women Founders Report | motion | animated abstract visual |
| 4 | `network:452` | 3/2 | ReportCard | State of TN GenAI | motion | animated abstract visual |

#### `/insights/reports/tn-founder-report-2027`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:423` | 4/5 | PageHero | TN Founder Report 2027 (hero) | motion | animated abstract visual |
| 2 | `network:317` | 3/2 | ReportCard | TN Women Founders Report | motion | animated abstract visual |
| 3 | `network:164` | 3/2 | ReportCard | State of TN SaaS | motion | animated abstract visual |
| 4 | `network:452` | 3/2 | ReportCard | State of TN GenAI | motion | animated abstract visual |

#### `/insights/reports/tn-women-founders-report`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:288` | 4/5 | PageHero | TN Women Founders Report (hero) | motion | animated abstract visual |
| 2 | `network:728` | 3/2 | ReportCard | TN Founder Report 2027 | motion | animated abstract visual |
| 3 | `network:164` | 3/2 | ReportCard | State of TN SaaS | motion | animated abstract visual |
| 4 | `network:452` | 3/2 | ReportCard | State of TN GenAI | motion | animated abstract visual |

#### `/insights/stories`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:617` | 4/5 | StoryCard | Vibathon 2025: where the colleges were | motion | animated abstract visual |
| 2 | `grid:140` | 4/5 | StoryCard | StartNet rooms since 2023 | `pool/stage/12` | The jury at the StartNet Mega Pitching event, 2023 *(StartNet)* |

#### `/insights/stories/five-years-of-rooms`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:96` | 3/2 | StoryDetail | StartNet rooms since 2023 (hero) (poster) | `pool/stage/09` | A member speaking at a StartNet network meeting, September 2023 *(StartNet)* |
| 2 | `grid:617` | 4/5 | StoryCard | Vibathon 2025: where the colleges were | motion | animated abstract visual |

#### `/insights/stories/vibathon-2025-recap`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:74` | 3/2 | StoryDetail | Vibathon 2025: where the colleges were (hero) (poster) | motion | animated abstract visual |

#### `/media`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:9` | 4/5 | PageHero | Media centre (hero) | `pool/stage/05` | A speaker on stage, StartNet event, February 2024 *(StartNet)* |
| 2 | `portrait:197` | 1/1 | PersonCard | M K Elango | own (person/…) | consented portrait when supplied, else initials |
| 3 | `portrait:573` | 1/1 | PersonCard | Dr V. Nagaraj | own (person/…) | consented portrait when supplied, else initials |
| 4 | `portrait:366` | 1/1 | PersonCard | Poonthamil | own (person/…) | consented portrait when supplied, else initials |

#### `/partner`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:8` | 4/5 | PageHero | Back the founders. See what it produced. (hero) | `pool/stage/11` | Young founders speaking at a StartNet network meeting, September 2023 *(StartNet)*; the 939 px `pool/stage/12` was upscaled 1.08x EN / 1.55x TA here |
| 2 | `map:38` | 1/1 | section | District Ecosystem Programme | motion | animated abstract visual |

#### `/partner/csr`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:21` | 4/5 | PageHero | Fund founders, and see the outcomes. (hero) | `pool/women/04` | A smiling young woman in her shop *(licensed stock)* |

#### `/partner/district-programme`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:126` | 4/5 | PageHero | Four brands. One district. One year. (hero) | motion | animated abstract visual |

#### `/partner/gccs`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:28` | 4/5 | PageHero | Your problems, solved by Tamil Nadu's next founders. (hero) | `pool/professionals/10` | A professional working by a window above the city *(licensed stock)* |

#### `/partner/government`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:70` | 4/5 | PageHero | Founder programmes your district can measure. (hero) | motion | animated abstract visual |

#### `/partner/incubators`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:70` | 4/5 | PageHero | We send founders on to you, with their record attached. (hero) | motion | animated abstract visual |

#### `/partner/institutions`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:84` | 4/5 | PageHero | Count your graduates who build companies, not just the ones (hero) | `pool/students/07` | A group of smiling young students *(licensed stock)* |

#### `/partner/investors`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `ladder:63` | 4/5 | PageHero | Meet founders before they're on everyone's list. (hero) | `pool/stage/11` | Young founders speaking at a StartNet network meeting, September 2023 *(StartNet)* |

#### `/partner/sponsors`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:56` | 4/5 | PageHero | Meet the audience before everyone else does. (hero) | `event/saas-connect/2025-5` | Attendees in a session room at SaaS.Connect 2025 *(StartNet)* |

#### `/research/events`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:60` | 21/9 | Card | Lab-to-Market Summit | motion | animated abstract visual |
| 2 | `grid:61` | 21/9 | Card | StartNet Labs | `pool/research/01` | A researcher at work in a laboratory *(licensed stock)* |
| 3 | `map:836` | 4/3 | EventCard | Lab-to-Market Summit 2027 | motion | animated abstract visual |

#### `/research/lab-to-market-summit`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:836` | 4/3 | EventCard | Lab-to-Market Summit 2027 | motion | animated abstract visual |

#### `/research/labs`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:11` | 1/1 | section | Agentic AI Lab | motion | animated abstract visual |
| 2 | `kolam:23` | 1/1 | section | Ontology & Knowledge Lab | motion | animated abstract visual |
| 3 | `grid:37` | 1/1 | section | Physical AI Lab | `pool/research/08` | An engineer working at a lab bench *(licensed stock)* |
| 4 | `dot:41` | 1/1 | section | Drug Discovery Lab | `pool/research/02` | A researcher in a lab coat with a sample *(licensed stock)* |

#### `/research/labs/agentic-ai`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:23` | 16/9 | Card | Ontology & Knowledge Lab | motion | animated abstract visual |
| 2 | `grid:37` | 16/9 | Card | Physical AI Lab | `pool/research/08` | An engineer working at a lab bench *(licensed stock)* |
| 3 | `dot:41` | 16/9 | Card | Drug Discovery Lab | `pool/research/02` | A researcher in a lab coat with a sample *(licensed stock)* |

#### `/research/labs/drug-discovery`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:11` | 16/9 | Card | Agentic AI Lab | motion | animated abstract visual |
| 2 | `kolam:23` | 16/9 | Card | Ontology & Knowledge Lab | motion | animated abstract visual |
| 3 | `grid:37` | 16/9 | Card | Physical AI Lab | `pool/research/08` | An engineer working at a lab bench *(licensed stock)* |

#### `/research/labs/ontology-knowledge`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:11` | 16/9 | Card | Agentic AI Lab | motion | animated abstract visual |
| 2 | `grid:37` | 16/9 | Card | Physical AI Lab | `pool/research/08` | An engineer working at a lab bench *(licensed stock)* |
| 3 | `dot:41` | 16/9 | Card | Drug Discovery Lab | `pool/research/02` | A researcher in a lab coat with a sample *(licensed stock)* |

#### `/research/labs/physical-ai`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:11` | 16/9 | Card | Agentic AI Lab | motion | animated abstract visual |
| 2 | `kolam:23` | 16/9 | Card | Ontology & Knowledge Lab | motion | animated abstract visual |
| 3 | `dot:41` | 16/9 | Card | Drug Discovery Lab | `pool/research/02` | A researcher in a lab coat with a sample *(licensed stock)* |

#### `/startnet-x`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:11` | 4/5 | BrandHero | One profile, from first event to first funding. (hero) | `pool/platform/04` | A man with a laptop and phone *(licensed stock)* |

#### `/startnet-x/founders`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `ladder:21` | 4/5 | BrandHero | Your founder journey, in one place. (hero) | `pool/platform/02` | A young man working on a laptop *(licensed stock)* |

#### `/startnet-x/gccs`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:51` | 4/5 | BrandHero | Problems in. Pilots and talent out. (hero) | motion | animated abstract visual |

#### `/startnet-x/government`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `map:61` | 4/5 | BrandHero | See every founder programme in your district. (hero) | motion | animated abstract visual |

#### `/startnet-x/incubators`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:41` | 4/5 | BrandHero | Run every cohort on one platform. (hero) | motion | animated abstract visual |

#### `/startnet-x/institutions`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:31` | 4/5 | BrandHero | Run your innovation programme on StartNet X. (hero) | motion | animated abstract visual |

#### `/startnet-x/investors`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:71` | 4/5 | BrandHero | Meet founders with the evidence attached. (hero) | motion | animated abstract visual |

#### `/vibe/academy`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:23` | 4/5 | BrandHero | Ship it, then get the certificate. (hero) | `pool/students/08` | A student coding on a computer in a workspace *(licensed stock)* |

#### `/vibe/campus`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `kolam:37` | 4/5 | BrandHero | Bring builders to your campus. (hero) | `pool/students/03` | Students at their desks in a college classroom *(licensed stock)* |
| 2 | `dot:150` | 4/3 | EventCard | Vibe Campus build nights | motion | animated abstract visual |
| 3 | `network:379` | 4/3 | EventCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 4 | `grid:435` | 4/3 | EventCard | Vibathon 2027 | `event/vibathon/2025` | Students in the hall at Vibathon 2025, K.S.R. College of Engineering *(StartNet)* |
| 5 | `kolam:675` | 4/3 | EventCard | Vibe Summit 2027 | motion | animated abstract visual |

#### `/vibe/clubs`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:41` | 4/5 | BrandHero | Start the club your campus is missing. (hero) | `pool/students/09` | Young builders around a table with laptops *(licensed stock)* |

#### `/vibe/events`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:60` | 21/9 | Card | Vibathon | motion | animated abstract visual |
| 2 | `grid:61` | 21/9 | Card | Vibe Campus | motion | animated abstract visual |
| 3 | `dot:62` | 21/9 | Card | Vibe Summit | motion | animated abstract visual |
| 4 | `dot:150` | 4/3 | EventCard | Vibe Campus build nights | motion | animated abstract visual |
| 5 | `network:379` | 4/3 | EventCard | Vibathon 2027 · District qualifiers | motion | animated abstract visual |
| 6 | `grid:435` | 4/3 | EventCard | Vibathon 2027 | `event/vibathon/2025` | Students in the hall at Vibathon 2025, K.S.R. College of Engineering *(StartNet)* |
| 7 | `kolam:675` | 4/3 | EventCard | Vibe Summit 2027 | motion | animated abstract visual |

#### `/vibe/launchpad`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `ladder:53` | 4/5 | BrandHero | Twelve weeks from team to company. (hero) | `pool/professionals/03` | A startup team working together in a modern office *(licensed stock)* |

#### `/vibe/stories`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `grid:617` | 4/5 | StoryCard | Vibathon 2025: where the colleges were | motion | animated abstract visual |

#### `/vibe/summit`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:67` | 4/5 | BrandHero | Vibe Summit (hero) | motion | animated abstract visual |
| 2 | `kolam:675` | 4/3 | EventCard | Vibe Summit 2027 | motion | animated abstract visual |

#### `/vibe/vibathon`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:2027` | 4/5 | section | Vibathon 2027 (hero) | motion | animated abstract visual |

#### `/women/events`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `network:60` | 21/9 | Card | Women Founders Summit | motion | animated abstract visual |
| 2 | `grid:61` | 21/9 | Card | Women Founders Awards | motion | animated abstract visual |
| 3 | `dot:62` | 21/9 | Card | Women Circles | `pool/women/09` | A group of women meeting together *(licensed stock)* |
| 4 | `network:956` | 4/3 | EventCard | Women Founders Summit & Awards 2027 | motion | animated abstract visual |

#### `/women/summit`

| # | Slot key | Ratio | Component | Slot content | Plan | What it shows |
|---|---|---|---|---|---|---|
| 1 | `dot:8` | 21/9 | section | At the Summit. | motion | animated abstract visual |
| 2 | `network:956` | 4/3 | EventCard | Women Founders Summit & Awards 2027 | motion | animated abstract visual |
