// IMAGE PLAN: the curated photograph for every ArtImage slot on the site (rewritten 13 Oct 2026, when the animated
// Canvas visuals were retired: every slot now shows a photograph).
//
// Each slot names one photo from photos.manifest.json:
//   'event/…'   StartNet's own event photos (the StartNet Gallery, SaaS.Connect 2025, Vibathon 2025): first choice
//               wherever a real StartNet room fits the slot.
//   'pool/…'    StartNet's own themed photos (vibereal, stage, connectreal, team, investors, womenreal), then licensed
//               stock (students, research, professionals, women, events, places, insights, partner, platform,
//               community): Indian people only, from photographers in India (photos/stock/picks.json).
// Big heroes take high-resolution files (stock 3200 px, SaaS.Connect 4032 px); StartNet's 1280 px event photos fill
// cards, tiles and medium slots, where they stay sharp. Every photo is graded to grayscale by tools/images/photos.mjs.
// Slots the plan does not name: event cards and edition posters take their event's own photos, then the photos of the
// closest StartNet events (data/photos.js eventPool, each captioned with where it was taken); other slots take a
// themed library photo (data/photos.js allocateLibraryPhoto). A page never shows the same photo twice.
//
// HOW SLOTS ARE KEYED
//   Route key   the page path without the /ta prefix and without a trailing slash ('/', '/vibe', '/events/vibathon/2025').
//               A key with ':name' segments ('/research/labs/:lab') matches any value in that segment.
//               '*' holds site-wide entries for data-driven cards whose seed is derived from the record
//               (StoryCard, ReportCard: seed = hash(slug) % 997), so one story or report shows the same photo everywhere.
//   Slot key    `${variant}:${seed}` built from the props ArtImage already receives (variant defaults to 'grid',
//               seed to 1), e.g. 'network:7'. When one page has two slots with the same variant and seed but a
//               different ratio, the entry is qualified with the ratio: 'grid:23@1/1'. An explicit `slot` prop on
//               ArtImage is used as the key instead. The rendered slot carries data-slot / data-photo for audits
//               (tools/audit/agents/r7-images/slots.mjs).
//   Lookup      for the route: exact path, then ':param' patterns, then '*'; at each level the ratio-qualified key
//               ('variant:seed@ratio') first, then the plain key. The first hit wins.
//   Excluded    event galleries ("From the room": ArtImage `documentary` / `noCaption`) and people portraits keep
//               their own photos unless a route entry names the slot.
import manifest from './photos.manifest.json';

// One photo for a programme page hero, whichever art variant the page passes (network / grid / ladder, seed 3).
const programme = (key) => ({ 'network:3': key, 'grid:3': key, 'ladder:3': key });

export const IMAGE_PLAN = {
  // ---------- Site-wide: story and report cards (same photo wherever the card appears) ----------
  '*': {
    // StoryCard (4:5) and story-page hero (3:2)
    'grid:617': 'event/vibathon/2025-2', //        story: Vibathon 2025, students filling the KSRCE auditorium
    'network:74': 'event/vibathon/2025-2', //      its story page hero (never on the same page as the card)
    'grid:140': 'pool/team/01', //                 story: StartNet rooms since 2023 (first-anniversary community)
    'network:96': 'event/genai-connect/2024', //   its story page hero: founders and speakers on the GenAI Connect stage
    // ReportCard (3:2)
    'grid:241': 'pool/insights/01', //             Founder Ledger
    'network:728': 'pool/professionals/08', //     TN Founder Report 2027
    'map:283': 'pool/professionals/11', //         Founder Readiness Index
    'map:774': 'pool/students/08', //              Campus Innovation Index
    'map:14': 'pool/research/01', //               TN Research Commercialisation Index
    'network:317': 'pool/women/02', //             TN Women Founders Report
    'network:164': 'event/saas-connect/2025-8', // State of TN SaaS: the SaaS.Connect main stage
    'network:452': 'event/genai-connect/2024-3', // State of TN GenAI: the GenAI Connect stage
    'network:681': 'event/d2c-connect/2024-2', //  State of TN D2C: the D2C Connect expo
    'network:836': 'pool/team/10', //              Annual self-diagnosis: the StartNet team
  },

  // ---------- Home ----------
  '/': {
    'kolam:11': 'event/saas-connect/2025-4', //    hero: a real StartNet room, wide roundtable (4032 px)
    'network:11': 'pool/research/01', //           brand tile, Research: a researcher with a sample
    'grid:23': 'event/vibe-coding-summit/2025-coimbatore-2', // brand tile, Vibe: students and the Vibe team, Vibe Coding Summit 2025
    'network:37': 'pool/connectreal/03', //        brand tile, Connect: founders in a Connect session
    'ladder:41': 'pool/womenreal/01', //           brand tile, Women: a StartNet Women meet-up
    'map:38': 'event/vibathon/2025-2', //          Why Tamil Nadu: students filling the KSRCE auditorium (the user's pick)
    'network:4': 'pool/investors/03', //           partner band: investors and the StartNet team
  },

  // ---------- About ----------
  '/about': {
    'network:7': 'pool/team/01', //                hero "We turn talent into founders": the StartNet community
    'map:38': 'pool/students/01', //               "The talent is here": college builders planning a project
    'grid:4': 'pool/team/03', //                   four brands, six engines, one platform: the team on stage
    'network:21': 'pool/investors/02', //          feeder and connector: founders and investors meeting
    'grid:11': 'pool/stage/08', //                 timeline: StartNet starts (launch, July 2023)
    'network:12': 'event/genai-connect/2024-2', // timeline: the Connect series (GenAI Connect 2024 room)
    'grid:13': 'event/nirf-higher-ed-summit/2024-salem', // timeline: NIRF Higher Ed Summit 2024, Salem
    'dot:14': 'pool/investors/07', //              timeline: Investors Summit
    'kolam:15': 'event/vibathon/2025-3', //        timeline: Vibathon 2025
  },
  '/about/how-we-work': {
    'kolam:24': 'event/nirf-higher-ed-summit/2024-coimbatore-4', // door: Research (faculty at a round table)
    'kolam:12': 'pool/vibereal/17', //             door: Vibe (the Vibe Challenge on a tablet)
    'kolam:21': 'pool/connectreal/04', //          door: Connect (founders round a boardroom table)
    'kolam:15': 'pool/womenreal/03', //            door: Women
    'network:31': 'pool/platform/02', //           StartNet X
  },
  '/about/mission-1-lakh': { 'ladder:7': 'pool/team/05' }, // outcomes: founders holding their awards
  '/about/self-diagnosis': { 'dot:27': 'pool/team/10' }, //   StartNet scores itself: the team

  // ---------- Brands ----------
  '/brands': {
    'network:3': 'pool/research/02',
    'dot:8': 'event/vibe-coding-summit/2025-coimbatore-2',
    'grid:13': 'pool/connectreal/10',
    'kolam:21': 'pool/womenreal/02',
  },

  // ---------- Research ----------
  '/research': {
    'network:7': 'pool/research/01', //            hero: a researcher with a sample
    'network:11': 'pool/students/04', //           Agentic AI Lab: an engineer writing code
    'kolam:23': 'pool/research/04', //             Ontology & Knowledge Lab: a professor explaining
    'grid:37': 'pool/research/03', //              Physical AI Lab: a hardware prototype on the bench
    'dot:41': 'pool/research/02', //               Drug Discovery Lab: a researcher at the bench
    'ladder:19': 'pool/professionals/10', //       "100 conversations before a single rupee"
  },
  '/research/labs': {
    'network:11': 'pool/students/04',
    'kolam:23': 'pool/research/04',
    'grid:37': 'pool/research/03',
    'dot:41': 'pool/research/02',
  },
  '/research/labs/:lab': {
    'network:11': 'pool/students/04',
    'kolam:23': 'pool/research/04',
    'grid:37': 'pool/research/03',
    'dot:41': 'pool/research/02',
  },
  '/research/events': {
    'network:60': 'event/nirf-higher-ed-summit/2024-coimbatore-3', // research series: the NIRF summit keynote
    'grid:61': 'pool/research/06', //              StartNet Labs
  },

  // ---------- Vibe ----------
  '/vibe': {
    'network:7': 'pool/vibereal/05', //            hero: the Vibe team at TNGSS 2025
    'network:11': 'event/vibathon/2025-2', //      tab: Vibathon
    'grid:23@4/3': 'pool/students/09', //          tab: Vibe Academy (a mentor guiding students)
    'kolam:37': 'pool/students/08', //             tab: Vibe Campus (a college computer lab)
    'dot:41': 'pool/students/01', //               tab: Vibe Clubs (friends planning a project)
    'grid:23@1/1': 'pool/students/05', //          Academy: "Ship it, then get the certificate"
    'grid:617': 'event/vibathon/2025-3', //        story card here: the tab above already shows the auditorium
  },
  '/vibe/vibathon': { 'network:2027': 'event/vibathon/2025-2' },
  '/vibe/academy': { 'grid:23': 'pool/students/09' },
  '/vibe/clubs': { 'dot:41': 'pool/students/01' },
  '/vibe/campus': { 'kolam:37': 'pool/students/08' },
  '/vibe/launchpad': { 'ladder:53': 'pool/professionals/08' },
  '/vibe/summit': { 'network:67': 'event/vibe-coding-summit/2025-coimbatore-2' },
  '/vibe/events': {
    'network:60': 'event/vibathon/2025-2', //      Vibathon
    'grid:61': 'event/vibe-coding-summit/2025-coimbatore', // Vibe Campus
    'dot:62': 'event/vibe-coding-summit/2025-coimbatore-3', // Vibe Summit
  },

  // ---------- Connect ----------
  '/connect': {
    'network:7': 'event/saas-connect/2025-5', //   hero: a SaaS.Connect 2025 session (4032 px)
    'ladder:11': 'pool/connectreal/11', //         "Your next customer, investor or market": founders talking
  },
  '/connect/events': {
    'network:60': 'event/genai-connect/2024-3', // GenAI Connect
    'grid:61': 'event/saas-connect/2025', //       SaaS Connect
    'dot:62': 'event/d2c-connect/2024', //         D2C Connect
    'kolam:63': 'pool/connectreal/01', //          all sector Connects
  },

  // ---------- Women ----------
  '/women': {
    'kolam:38': 'pool/women/07', //                hero: a woman leader
    'ladder:12': 'pool/women/10', //               Rise Academy, on your phone
    'dot:8': 'pool/women/05', //                   TN Women Founders Report: women at a meeting
  },
  '/women/events': {
    'network:60': 'pool/womenreal/01', //          Women Founders Summit
    'grid:61': 'pool/women/09', //                 Women Founders Awards: a founder with her certificate
    'dot:62': 'pool/women/04', //                  Women Circles: a woman speaking at a women's meeting
  },
  '/women/summit': { 'dot:8': 'pool/women/04' },

  // ---------- Events ----------
  '/events': {
    'network:11': 'pool/events/01', //             hero: a speaker addressing an audience
    'grid:27': 'event/genai-connect/2024', //      "Rooms since 2023"
    'network:41': 'event/vibathon/2025-2', //      flagship: Vibathon
    'grid:42': 'event/nirf-higher-ed-summit/2024-coimbatore-3', // flagship: Lab-to-Market Summit (research rooms)
    'dot:43': 'pool/womenreal/01', //              flagship: Women Founders Summit & Awards
    'map:44': 'pool/team/02', //                   flagship: StartNet Founders Day
  },
  '/events/past': { 'grid:23': 'event/d2c-connect/2024' }, // "Rooms since 2023": a packed D2C Connect ballroom
  '/events/host': { 'map:38': 'event/vibathon/2025-4' }, //    "Host StartNet in your college": KSRCE hosting Vibathon
  '/events/founders-day': { 'dot:7': 'pool/team/04' },
  '/events/startnet-launch-2023': { 'dot:751': 'pool/stage/08' },
  '/events/network-meetings': { 'dot:160': 'pool/stage/11', 'dot:500': 'pool/stage/10', 'dot:501': 'pool/stage/09', 'dot:33': 'pool/stage/12' },
  // The 2023 network meetings: StartNet's own stage photos from those months (posters and the 'other editions' cards).
  '/events/network-meetings/:edition': { 'dot:500': 'pool/stage/10', 'dot:501': 'pool/stage/09', 'dot:33': 'pool/stage/12' },
  '/events/investors-summit': { 'dot:747': 'pool/investors/07' },
  '/events/investors-summit/archive': { 'dot:385': 'pool/investors/07' },
  '/events/vibathon': { 'network:24': 'event/vibathon/2025-2' },
  '/events/vibe-campus': { 'network:72': 'event/vibe-coding-summit/2025-coimbatore' },
  '/events/vibe-summit': { 'network:555': 'event/vibe-coding-summit/2025-coimbatore-2' },
  '/events/genai-connect': { 'network:97': 'event/genai-connect/2024' },
  '/events/saas-connect': { 'network:894': 'event/saas-connect/2025-3' },
  '/events/d2c-connect': { 'network:248': 'event/d2c-connect/2024' },
  '/events/lab-to-market-summit': { 'grid:2': 'event/nirf-higher-ed-summit/2024-coimbatore' },
  '/events/women-founders-summit': { 'kolam:604': 'pool/womenreal/01' },
  '/events/research-days': { 'grid:850': 'event/nirf-higher-ed-summit/2024-salem' },
  '/events/vibe-marketing-summit-2025': { 'network:481': 'event/vibe-marketing-summit-2025' },
  // Series not yet held: the closest StartNet event, captioned with where it was taken.
  '/events/agentic-ai-connect': { 'network:888': 'event/genai-connect/2024' },
  '/events/physical-ai-connect': { 'network:305': 'event/d2c-connect/2024' },
  '/events/nirf-higher-ed-summit': { 'grid:471': 'event/nirf-higher-ed-summit/2024-coimbatore' },
  '/events/vibe-coding-summit': { 'network:308': 'event/vibe-coding-summit/2025-coimbatore' },

  // ---------- Insights ----------
  '/insights': {
    'network:6': 'pool/insights/03', //            hero: a woman reviewing records at her computer
    'grid:12': 'pool/insights/01', //              featured: Founder Ledger
    'grid:3': 'pool/professionals/03', //          ledger, reports, indices and stories
    'map:4': 'pool/insights/04', //                Founder Ledger
    'ladder:5': 'pool/professionals/09', //        TN Founder Report
    'grid:6': 'pool/professionals/06', //          Founder Readiness Index
    'network:7': 'pool/students/06', //            Campus Innovation Index
    'dot:8': 'pool/research/02', //                TN Research Commercialisation Index
    'network:9': 'pool/women/05', //               TN Women Founders Report
    'portrait:10': 'pool/connectreal/06', //       Founder stories hub card
    'kolam:11': 'pool/team/05', //                 Founder stories
    'grid:241': 'pool/insights/02', //             latest reports (cards): not the photos above
    'network:728': 'pool/professionals/04',
    'map:283': 'pool/professionals/05',
  },
  '/insights/reports': { 'map:38': 'pool/connectreal/04' },
  '/insights/reports/:report': {
    'network:101': 'pool/students/04', //          State of TN GenAI
    'network:288': 'pool/women/05', //             TN Women Founders Report
    'network:289': 'pool/women/15', //             State of TN D2C: founders in their design studio
    'network:550': 'event/saas-connect/2025-5', // State of TN SaaS
    'network:423': 'pool/professionals/01', //     TN Founder Report 2027
  },
  '/insights/indices': {
    'map:29': 'pool/insights/02',
    'grid:41': 'pool/students/06', //              Campus Innovation Index
    'network:57': 'pool/research/02', //           TN Research Commercialisation Index
    'ladder:63': 'pool/professionals/06', //       Founder Readiness Index
  },
  '/insights/indices/:index': { 'grid:41': 'pool/students/06', 'network:57': 'pool/research/02', 'ladder:63': 'pool/professionals/06' },
  '/insights/podcast': { 'dot:17': 'pool/professionals/10' }, // founder conversations
  '/insights/newsletter': { 'dot:13': 'pool/women/11' },

  // ---------- StartNet X ----------
  '/startnet-x': { 'network:11': 'pool/platform/01' },
  '/startnet-x/founders': { 'ladder:21': 'pool/platform/03' },
  '/startnet-x/institutions': { 'grid:31': 'pool/students/09' },
  '/startnet-x/incubators': { 'network:41': 'pool/professionals/02' },
  '/startnet-x/gccs': { 'network:51': 'pool/professionals/04' },
  '/startnet-x/government': { 'map:61': 'pool/partner/06' },
  '/startnet-x/investors': { 'dot:71': 'pool/investors/04' },

  // ---------- Partner ----------
  '/partner': {
    'network:8': 'pool/team/06', //                "Back the founders": StartNet 2.0 agreements signed on stage
    'map:38': 'pool/places/10', //                 District Ecosystem Programme
  },
  '/partner/gccs': { 'network:28': 'pool/partner/02' },
  '/partner/institutions': { 'grid:84': 'event/nirf-higher-ed-summit/2024-coimbatore' },
  '/partner/government': { 'map:70': 'pool/connectreal/15' }, // StartNet at Umagine Chennai 2023 (the TN government's tech summit)
  '/partner/investors': { 'ladder:63': 'pool/investors/05' },
  '/partner/incubators': { 'network:70': 'pool/connectreal/08' },
  '/partner/district-programme': { 'map:126': 'event/vibathon/2025-3' }, // a district in practice: KSRCE (Namakkal) leaders with the StartNet team, Vibathon 2025
  '/partner/sponsors': { 'dot:56': 'event/d2c-connect/2024-5' }, // the audience a sponsor meets: D2C Connect 2024's packed expo corridor
  '/partner/csr': { 'kolam:21': 'pool/women/14' },

  // ---------- Programmes (one hero each) ----------
  '/programmes/connect-circles': programme('pool/connectreal/03'),
  '/programmes/connect-series': programme('event/saas-connect/2025-4'),
  '/programmes/founder-switch': programme('pool/professionals/05'),
  '/programmes/hercapital': programme('pool/women/02'),
  '/programmes/institution-partner-programme': programme('event/nirf-higher-ed-summit/2024-coimbatore'),
  '/programmes/lab-to-market-summit': programme('pool/research/02'),
  '/programmes/rise-academy': programme('pool/women/10'),
  '/programmes/scale-connect': programme('pool/professionals/01'),
  '/programmes/scholar-founders-fellowship': programme('pool/research/05'),
  '/programmes/startnet-angels': programme('pool/investors/05'),
  '/programmes/startnet-labs': programme('pool/research/03'),
  '/programmes/vibathon': programme('event/vibathon/2025-2'),
  '/programmes/vibe-academy': programme('pool/students/09'),
  '/programmes/vibe-campus': programme('pool/students/08'),
  '/programmes/vibe-clubs': programme('pool/students/01'),
  '/programmes/vibe-launchpad': programme('pool/professionals/08'),
  '/programmes/vibe-summit': programme('event/vibe-coding-summit/2025-coimbatore'),
  '/programmes/women-circles': programme('pool/women/04'),
  '/programmes/women-founders-summit': programme('pool/women/09'),

  // ---------- Company ----------
  '/media': { 'dot:9': 'pool/events/03' },
  '/careers': { 'ladder:10': 'pool/vibereal/10' },
  '/contact': { 'map:600': 'pool/team/11' },
};

const PATTERNS = Object.keys(IMAGE_PLAN)
  .filter((k) => k.includes('/:'))
  .map((k) => ({ key: k, parts: k.split('/') }));

/** '/ta/vibe/' → '/vibe'; '/ta' → '/'. */
export function planRoute(path = '/') {
  let p = String(path || '/').split(/[?#]/)[0];
  p = p.replace(/^\/ta(?=\/|$)/, '') || '/';
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

/** The slot key ArtImage's props produce: an explicit `slot`, else `${variant}:${seed}`. */
export function planSlotKey({ slot, variant = 'grid', seed = 1 } = {}) {
  if (typeof slot === 'string' && slot) return slot;
  return `${variant || 'grid'}:${Number(seed) || 1}`;
}

function levelsFor(route) {
  const levels = [];
  if (IMAGE_PLAN[route]) levels.push(IMAGE_PLAN[route]);
  const parts = route.split('/');
  for (const pt of PATTERNS) {
    if (pt.parts.length !== parts.length) continue;
    if (pt.parts.every((s, i) => s.startsWith(':') || s === parts[i])) levels.push(IMAGE_PLAN[pt.key]);
  }
  if (IMAGE_PLAN['*']) levels.push(IMAGE_PLAN['*']);
  return levels;
}

/**
 * The plan entry for one slot: 'pool/…' | 'event/…', or undefined when the plan does not name it.
 * Galleries and people portraits are only matched by an exact route entry (never by '*').
 */
export function planEntry(path, props = {}) {
  const route = planRoute(path);
  const key = planSlotKey(props);
  const ratio = props.ratio ? String(props.ratio).replace(/\s+/g, '') : '';
  const guarded = props.documentary || props.noCaption || props.variant === 'portrait';
  const levels = levelsFor(route);
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    if (guarded && level === IMAGE_PLAN['*']) break;
    if (guarded && !(level === IMAGE_PLAN[route])) continue;
    if (ratio && Object.prototype.hasOwnProperty.call(level, `${key}@${ratio}`)) return level[`${key}@${ratio}`];
    if (Object.prototype.hasOwnProperty.call(level, key)) return level[key];
  }
  return undefined;
}

/**
 * What ArtImage should show for one slot:
 *   undefined  no plan (or a planned photo missing from the manifest): the slot's own photo, pool or library
 *   object     the manifest photo { key, base, widths, jpgWidths, formats, width, height, alt, altTa, caption, … }
 */
export function planFor(path, props = {}) {
  const entry = planEntry(path, props);
  if (entry === undefined || !Object.prototype.hasOwnProperty.call(manifest, entry)) return undefined;
  return { key: entry, ...manifest[entry] };
}

export default IMAGE_PLAN;
