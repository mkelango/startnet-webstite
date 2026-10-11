// IMAGE PLAN: the curated choice of what fills every ArtImage slot on the site (October 2026 curation).
//
// Each slot gets exactly one of:
//   'pool/…' or 'event/…'  a photograph from photos.manifest.json (real StartNet photos first, licensed stock only
//                         where it shows the slot's own subject and cannot pass for a real StartNet event or person)
//   'motion'               the animated abstract BrandVisual: for data, platform, process and concept slots, and for
//                         events with no photograph of their own yet (never a mismatched stock photo)
// Slots the plan does not name keep ArtImage's current behaviour (see planFor below).
// The reasoning, the per-route tables, coverage and the shot list for the gaps are in docs/IMAGE-PLAN.md.
//
// ---------------------------------------------------------------------------------------------------------------
// HOW SLOTS ARE KEYED
//   Route key   the page path without the /ta prefix and without a trailing slash ('/', '/vibe', '/events/vibathon/2025').
//               A key with ':name' segments ('/research/labs/:lab') matches any value in that segment.
//               '*' holds site-wide entries for data-driven cards whose seed is derived from the record
//               (EventCard / EditionCard / edition poster, StoryCard, ReportCard: seed = hash(slug) % 997), so one
//               event, story or report shows the same choice on every page it appears on.
//   Slot key    `${variant}:${seed}` built from the props ArtImage already receives (variant defaults to 'grid',
//               seed to 1), e.g. 'network:7'. When one page has two slots with the same variant and seed but a
//               different ratio, the entry is qualified with the ratio: 'grid:23@1/1'. An explicit `slot` prop on
//               ArtImage (a string, e.g. slot="hero") is used as the key instead, for future pages that want one.
//   Lookup      for the route: exact path, then ':param' patterns, then '*'; at each level the ratio-qualified key
//               ('variant:seed@ratio') first, then the plain key. The first hit wins.
//   Twins       FeatureTabs renders each panel twice (desktop panel + phone accordion, only one visible), so the two
//               copies share one entry; that is not a repeat a visitor can see.
//   Excluded    event galleries ("From the room": ArtImage `documentary` / `noCaption`) and people portraits
//               (variant 'portrait' on PersonCard) keep their own photos; planFor never touches them unless a
//               route entry names the slot explicitly (the /insights "Founder stories" hub card is variant portrait).
//
// HOW ArtImage SHOULD USE IT (proposal for the components owner; components/ is not edited here):
//   import { planFor } from '../data/imagePlan.js';
//   const planned = planFor(path, { slot, variant, seed, ratio, documentary, noCaption });
//   //  undefined → no plan for this slot: current behaviour (DECORATIVE_PHOTOS switch, photo / photoPool props)
//   //  null      → 'motion': render the BrandVisual, no photo, no library pick
//   //  object    → the manifest photo { key, base, widths, … }: render it, overriding DECORATIVE_PHOTOS and the
//   //              photo / photoPool props (the plan already keeps event pages to their own event's photos)
//   const photo = planned !== undefined ? planned : photoAllowed ? photoProp : null;
//   const photoPool = planned !== undefined ? undefined : photoAllowed ? photoPoolProp : undefined;
//   The photo's own alt / caption (manifest) replace the artwork alt, exactly as ArtImage already does for photos.
//   planFor is pure and synchronous (same answer in the prerender and the browser): SSR-safe, no layout shift
//   (ArtImage keeps its aspect-ratio box either way).
// ---------------------------------------------------------------------------------------------------------------
import manifest from './photos.manifest.json';

const M = 'motion';

export const IMAGE_PLAN = {
  // ---------- Site-wide: cards built from data records (same choice wherever the card appears) ----------
  '*': {
    // EventCard (4:3) and EditionCard (16:9) / edition-page poster (4:5) share the event's seed.
    'dot:150': M, //                              Vibe Campus build nights: no photo yet (GAP G6)
    'network:650': M, //                          Vibe Campus build nights (edition card + poster)
    'network:379': M, //                          Vibathon 2027 · District qualifiers (EventCard): Vibathon 2027 card takes the one Vibathon photo
    'grid:435': 'event/vibathon/2025', //         Vibathon 2027 (EventCard): the series' own photo, captioned 2025
    'network:283': M, //                          Vibathon 2027 · District qualifiers (EditionCard + poster)
    'network:528': M, //                          Vibathon 2027 (EditionCard + poster): the only Vibathon photo is 572 px wide, too soft for a 4:5 poster
    'network:526': M, //                          Vibathon 2025 (EditionCard + edition poster): its only photo is 572 px, below 1x at these sizes (GAP G1)
    'map:743': M, //                              GenAI Connect 2027 (EventCard): no GenAI Connect photo (GAP G3)
    'network:202': M, //                          GenAI Connect 2027 (EditionCard + poster)
    'network:199': M, //                          GenAI Connect 2024 (EditionCard + poster) (GAP G3)
    'dot:373': 'event/saas-connect/2025-2', //    SaaS Connect 2027 (EventCard): SaaS Connect 2025 panel on stage
    'network:822': 'event/saas-connect/2025-5', // SaaS Connect 2027 (EditionCard + poster)
    'network:820': 'event/saas-connect/2025-3', // SaaS Connect 2025 (EditionCard + poster; its gallery excludes the poster)
    'dot:394': M, //                              D2C Connect 2027 (EventCard) (GAP G4)
    'network:33': M, //                           D2C Connect 2027 (EditionCard + poster)
    'network:30': M, //                           D2C Connect 2024 (EditionCard + poster) (GAP G4)
    'map:836': M, //                              Lab-to-Market Summit 2027 (EventCard) (GAP G7)
    'grid:995': M, //                             Lab-to-Market Summit 2027 (EditionCard + poster)
    'network:956': M, //                          Women Founders Summit & Awards 2027 (EventCard) (GAP G8)
    'kolam:724': M, //                            Women Founders Summit & Awards 2027 (EditionCard + poster)
    'kolam:675': M, //                            Vibe Summit 2027 (EventCard) (GAP G9)
    'network:178': M, //                          Vibe Summit 2027 (EditionCard + poster)
    'dot:385': M, //                              Investors Summit, past edition (poster) (GAP G10)
    // StoryCard (4:5) and story-page hero (3:2)
    'grid:617': M, //                             story: Vibathon 2025 (4:5 crop of the 572 px photo is 344 px wide: too soft, GAP G1)
    'network:74': M, //                           its story page hero (GAP G1)
    'grid:140': 'pool/stage/12', //               story: StartNet rooms since 2023 (Mega Pitching jury, 2023)
    'network:96': 'pool/stage/09', //             its story page hero (network meeting, Sept 2023; 1280 px for a 3:2 hero)
    // ReportCard (3:2): report and index covers are data artefacts
    'grid:241': M, // Founder Ledger
    'network:728': M, // TN Founder Report 2027
    'map:283': M, // Founder Readiness Index
    'map:774': M, // Campus Innovation Index
    'map:14': M, // TN Research Commercialisation Index
    'network:317': M, // TN Women Founders Report
    'network:164': M, // State of TN SaaS
    'network:452': M, // State of TN GenAI
    'network:681': M, // State of TN D2C
    'network:836': M, // Annual self-diagnosis
  },

  // ---------- Home ----------
  '/': {
    'kolam:11': 'event/saas-connect/2025-4', //   hero 21:9: a real StartNet room, wide roundtable, 4032 px
    'network:11': 'pool/research/06', //          brand tile, Research
    'grid:23': 'pool/vibereal/10', //             brand tile, Vibe (real: Vibe team at TNGSS 2025, 4:5 original)
    'network:37': 'pool/stage/09', //             brand tile, Connect (real: StartNet network meeting)
    'ladder:41': 'pool/women/03', //              brand tile, Women
    'map:38': M, //                               Why Tamil Nadu: 38-district map (data)
    'network:4': 'pool/professionals/02', //      partner band: organisations working with founders
    'grid:435': M, //                             Vibathon 2027 card: the Vibathon photo is kept for /vibe and /about
    'dot:373': 'event/saas-connect/2025', //      SaaS Connect 2027 card: 2025-2 is used on /connect
  },

  // ---------- About ----------
  '/about': {
    'network:7': 'pool/stage/11', //              hero "We turn talent into founders": young founders on a StartNet stage (replaces the kolam photo)
    'map:38': M, //                               38-district map
    'grid:4': M, //                               four brands, six engines, one platform (model)
    'network:21': M, //                           feeder and connector (concept)
    'grid:11': 'pool/stage/08', //                timeline: StartNet starts (launch, July 2023)
    'network:12': 'event/saas-connect/2025-3', // timeline: the Connect series (the SaaSConnect venue letters)
    'dot:13': M, //                               timeline: Investors Summit (no photo, GAP G10)
    'kolam:14': M, //                             timeline: Vibathon 2025 (its one photo is kept for the /vibe Vibathon tab: no repeat across top pages)
  },
  '/about/how-we-work': {
    'kolam:24': 'pool/research/04', //            door: StartNet Research
    'kolam:12': 'pool/vibereal/17', //            door: StartNet Vibe (Vibe Challenge on a tablet)
    'kolam:21': 'pool/stage/04', //               door: StartNet Connect
    'kolam:15': 'pool/women/08', //               door: StartNet Women
    'network:31': M, //                           StartNet X (platform)
  },
  '/about/mission-1-lakh': { 'ladder:7': M }, //    outcomes metric
  '/about/self-diagnosis': { 'dot:27': M }, //      self-scoring report

  // ---------- Brands ----------
  '/brands': {
    'network:3': 'pool/research/07',
    'dot:8': 'pool/vibereal/03',
    'grid:13': 'pool/stage/10',
    'kolam:21': 'pool/women/07',
  },

  // ---------- Research ----------
  '/research': {
    'network:7': 'pool/research/03', //           hero: researcher at a microscope
    'network:11': M, //                           Agentic AI Lab (software; no lab photo, GAP G11)
    'kolam:23': M, //                             Ontology & Knowledge Lab (abstract)
    'grid:37': 'pool/research/08', //             Physical AI Lab: engineer at a lab bench
    'dot:41': 'pool/research/02', //              Drug Discovery Lab: researcher with a sample
    'ladder:19': 'pool/professionals/04', //      "100 conversations before a single rupee": a founder in conversation
  },
  '/research/labs': {
    'network:11': M,
    'kolam:23': M,
    'grid:37': 'pool/research/08',
    'dot:41': 'pool/research/02',
  },
  '/research/labs/:lab': {
    'network:11': M,
    'kolam:23': M,
    'grid:37': 'pool/research/08',
    'dot:41': 'pool/research/02',
  },
  '/research/events': {
    'network:60': M, //                           Lab-to-Market Summit (no photo, GAP G7)
    'grid:61': 'pool/research/01', //             StartNet Labs
  },

  // ---------- Vibe ----------
  '/vibe': {
    'network:7': 'pool/vibereal/05', //           hero (real: Vibe team at TNGSS 2025, 4:5 original)
    'network:11': M, //                           tab: Vibathon: its only photo is 572 px, upscaled 1.45x in the 832 px desktop panel (GAP G1)
    'grid:23@4/3': 'pool/students/10', //         tab: Vibe Academy
    'kolam:37': 'pool/students/03', //            tab: Vibe Campus (college classroom)
    'dot:41': 'pool/students/09', //              tab: Vibe Clubs (builders round a table)
    'grid:23@1/1': 'pool/students/08', //         Academy section "Ship it, then get the certificate"
    // Vibathon 2027 card: no override, so it takes the series photo from '*' (card slot ~390 px, the 572 px photo is sharp there)
  },
  '/vibe/vibathon': { 'network:2027': M }, //      hero: the only Vibathon photo (572 px) is too soft for a 4:5 hero (GAP G1)
  '/vibe/academy': { 'grid:23': 'pool/students/08' },
  '/vibe/clubs': { 'dot:41': 'pool/students/09' },
  '/vibe/campus': { 'kolam:37': 'pool/students/03' },
  '/vibe/launchpad': { 'ladder:53': 'pool/professionals/03' }, // "Twelve weeks from team to company": a startup team at work
  '/vibe/summit': { 'network:67': M }, //           event page, no Vibe Summit photo (GAP G9)
  '/vibe/events': {
    'network:60': M, //                           Vibathon 21:9 band: the 572 px photo cannot fill it (GAP G1)
    'grid:61': M, //                              Vibe Campus (GAP G6)
    'dot:62': M, //                               Vibe Summit (GAP G9)
  },

  // ---------- Connect ----------
  '/connect': {
    'network:7': 'event/saas-connect/2025-5', //  hero: attendees in a SaaS Connect 2025 session (a Connect room, 4032 px)
    'ladder:11': 'pool/professionals/08', //      "Your next customer, investor or market": two co-founders at work
  },
  '/connect/events': {
    'network:60': M, //                           GenAI Connect (GAP G3)
    'grid:61': 'event/saas-connect/2025', //      SaaS Connect 21:9 (the original is 2.4:1)
    'dot:62': M, //                               D2C Connect (GAP G4)
    'kolam:63': M, //                             all sector Connects (index of series)
  },
  '/connect/saas': { 'dot:373': M }, //            its gallery already shows all five SaaS Connect photos

  // ---------- Women ----------
  '/women': {
    'kolam:38': 'pool/women/06', //               hero: a woman founder at her desk (4:7 original)
    'ladder:12': 'pool/women/01', //              Rise Academy, on your phone: a woman entrepreneur with a tablet
    'dot:8': M, //                                TN Women Founders Report cover
  },
  '/women/events': {
    'network:60': M, //                           Women Founders Summit (GAP G8)
    'grid:61': M, //                              Women Founders Awards (GAP G8)
    'dot:62': 'pool/women/09', //                 Women Circles: women meeting in a circle
  },
  '/women/summit': { 'dot:8': M },

  // ---------- Events ----------
  '/events': {
    'network:11': 'pool/stage/01', //             hero: a speaker on a StartNet stage, Feb 2024
    'grid:27': 'pool/stage/12', //                "Rooms since 2023": Mega Pitching jury, 2023
  },
  '/events/host': { 'map:38': 'pool/students/03' }, // "Host StartNet in your college": a college classroom
  '/events/founders-day': { 'dot:7': M },
  '/events/vibathon': { 'network:24': M }, //       series hero: Vibathon photo too soft for 4:5 (GAP G1)
  '/events/vibe-campus': { 'network:72': M },
  '/events/vibe-summit': { 'network:555': M },
  '/events/genai-connect': { 'network:97': M },
  '/events/saas-connect': { 'network:894': 'event/saas-connect/2025-3' },
  '/events/d2c-connect': { 'network:248': M },
  '/events/lab-to-market-summit': { 'grid:2': M },
  '/events/women-founders-summit': { 'kolam:604': M },
  '/events/research-days': { 'grid:850': M },
  '/events/investors-summit': { 'dot:747': M },
  '/events/vibe-marketing-summit-2025': { 'network:481': M }, // no Vibe Marketing Summit photo yet (GAP G5)
  '/events/saas-connect/2025': { 'network:822': M }, // the gallery on this page already shows 2025-5

  // ---------- Insights ----------
  '/insights': {
    'network:6': 'pool/insights/01', //           hero: reviewing a data dashboard
    'grid:3': M,
    'map:4': M,
    'ladder:5': M,
    'grid:6': M,
    'network:7': M,
    'dot:8': M,
    'network:9': M,
    'portrait:10': 'pool/stage/11', //            "Founder stories" hub card: young founders on a StartNet stage (captioned)
    'kolam:11': M,
  },
  '/insights/reports': { 'map:38': M },
  '/insights/reports/:report': {
    'network:101': M,
    'network:288': M,
    'network:289': M,
    'network:550': M,
    'network:423': M,
  },
  '/insights/indices': { 'map:29': M, 'grid:41': M, 'network:57': M, 'ladder:63': M },
  '/insights/indices/:index': { 'grid:41': M, 'network:57': M, 'ladder:63': M },
  '/insights/podcast': { 'dot:17': 'pool/stage/02' }, // founder conversations: a fireside chat on a StartNet stage
  '/insights/newsletter': { 'dot:13': M },

  // ---------- StartNet X (platform: abstract, except the hub and the founders page) ----------
  '/startnet-x': { 'network:11': 'pool/platform/04' },
  '/startnet-x/founders': { 'ladder:21': 'pool/platform/02' },
  '/startnet-x/institutions': { 'grid:31': M },
  '/startnet-x/incubators': { 'network:41': M },
  '/startnet-x/gccs': { 'network:51': M },
  '/startnet-x/government': { 'map:61': M },
  '/startnet-x/investors': { 'dot:71': M },

  // ---------- Partner ----------
  '/partner': {
    'network:8': 'pool/stage/11', //              "Back the founders": young founders on a StartNet stage (1280 px; the 939 px Mega Pitching jury photo was upscaled 1.1x EN / 1.55x TA in this hero)
    'map:38': M, //                               District Ecosystem Programme map
  },
  '/partner/gccs': { 'network:28': 'pool/professionals/10' },
  '/partner/institutions': { 'grid:84': 'pool/students/07' },
  '/partner/government': { 'map:70': M },
  '/partner/investors': { 'ladder:63': 'pool/stage/11' },
  '/partner/incubators': { 'network:70': M },
  '/partner/district-programme': { 'map:126': M },
  '/partner/sponsors': { 'dot:56': 'event/saas-connect/2025-5' }, // "Meet the audience": attendees in a StartNet session (captioned)
  '/partner/csr': { 'kolam:21': 'pool/women/04' },

  // ---------- Company ----------
  '/media': { 'dot:9': 'pool/stage/05' },
  '/careers': { 'ladder:10': 'pool/vibereal/10' }, // the StartNet team at its booth (4:5 original)
  '/contact': { 'map:600': M }, //                  Salem location map (GAP G13)
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
 * The plan entry for one slot: 'pool/…' | 'event/…' | 'motion', or undefined when the plan does not name it.
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
 *   undefined  no plan → keep the current behaviour
 *   null       'motion' (or a planned photo missing from the manifest) → the animated BrandVisual
 *   object     the manifest photo { key, base, widths, jpgWidths, formats, width, height, alt, altTa, caption, … }
 */
export function planFor(path, props = {}) {
  const entry = planEntry(path, props);
  if (entry === undefined) return undefined;
  if (entry === M) return null;
  return Object.prototype.hasOwnProperty.call(manifest, entry) ? { key: entry, ...manifest[entry] } : null;
}

export default IMAGE_PLAN;
