// Real photographs for image slots (StartNet's own event, campus and team photos).
// Files are produced by `npm run photos` (tools/images/photos.mjs) from photos/originals/<key>.jpg and listed in
// photos.manifest.json. Every slot shows a photograph: its own, a curated pick, then the themed library (Oct 2026).
//
// Slot keys (the original's path under photos/originals/, without the extension):
//   hero/home, hero/research, hero/vibe, hero/connect, hero/women      page heroes (landscape or 4:5 originals)
//   event/<series>  and  event/<series>/<edition>                       e.g. event/vibathon, event/vibathon/2025
//   story/<slug>                                                         story cards and story pages
//   person/<slug>                                                        portraits (people.json slug; consent required)
import manifest from './photos.manifest.json';

/**
 * The first registered photo among `keys` (most specific first), or undefined. Undefined lets the slot fall back to
 * the themed library; pass `null` instead where a slot must keep its art (portraits, past events).
 */
export function photoFor(...keys) {
  for (const key of keys.flat()) {
    if (key && Object.prototype.hasOwnProperty.call(manifest, key)) return { key, ...manifest[key] };
  }
  return undefined;
}

/** Event slot keys for an event record and its URL: the edition first, then the series. */
export function eventPhotoKeys(e, path) {
  const rest = typeof path === 'string' ? path.replace(/^\/(ta\/)?events\/?/, '').replace(/\/+$/, '') : '';
  return [rest && `event/${rest}`, e && e.series && `event/${e.series}`, e && e.slug && `event/${e.slug}`];
}

/** `sizes` presets so the browser downloads the right width for each layout. */
export const PHOTO_SIZES = {
  hero: '(min-width: 1024px) 42vw, 100vw',
  // Generous on purpose: an odd last card spans the row with a full-height image (Events, Past events, related).
  card: '(min-width: 1024px) 40vw, (min-width: 640px) 80vw, 92vw',
  wide: '(min-width: 1280px) 1200px, 100vw',
  portrait: '(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw',
};

// ---------- Themed library (photos/originals/pool/<theme>/<n>) ----------
// Slots that have no photo of their own take one from a themed pool, chosen by the slot's brand, then the page
// section. People portraits and past-event recaps never use the library: a stock photo must not pass for a real
// StartNet person or a real StartNet event.
const POOL = {};
for (const key of Object.keys(manifest)) {
  const m = /^pool\/([a-z]+)\/\d+$/.exec(key);
  if (m) (POOL[m[1]] = POOL[m[1]] || []).push({ key, ...manifest[key] });
}
for (const list of Object.values(POOL)) list.sort((a, b) => a.key.localeCompare(b.key));

// Small pools borrow from related ones so neighbouring slots rarely repeat a photo.
const MIX = {
  partner: ['partner', 'professionals'],
  community: ['community', 'students', 'professionals', 'women'],
  platform: ['platform', 'students'],
  insights: ['insights'],
};
const poolOf = (theme) => (MIX[theme] || [theme]).flatMap((t) => POOL[t] || []);

const BRAND_THEME = { research: 'research', vibe: 'students', connect: 'professionals', women: 'women', x: 'platform' };
const ROUTE_THEME = [
  [/^\/research(\/|$)/, 'research'],
  [/^\/vibe(\/|$)/, 'students'],
  [/^\/connect(\/|$)/, 'professionals'],
  [/^\/women(\/|$)/, 'women'],
  [/^\/startnet-x(\/|$)/, 'platform'],
  [/^\/events(\/|$)/, 'events'],
  [/^\/insights(\/|$)/, 'insights'],
  [/^\/partner(\/|$)/, 'partner'],
  [/^\/districts(\/|$)/, 'places'],
  [/^\/contact(\/|$)/, 'places'],
  [/^\/careers(\/|$)/, 'professionals'],
  [/^\/media(\/|$)/, 'events'],
  [/^\/programmes(\/|$)/, 'students'],
];

/** The library theme for a slot: an explicit theme, the Tamil Nadu map art (places), the brand, then the page. */
export function themeFor({ theme, variant, brand, path = '/' }) {
  if (theme) return theme;
  if (variant === 'map') return 'places';
  if (brand && BRAND_THEME[brand]) return BRAND_THEME[brand];
  for (const [re, t] of ROUTE_THEME) if (re.test(path)) return t;
  return 'community';
}

/** A library photo for a slot, picked deterministically by seed (same choice in the prerender and the live app). */
export function libraryPhoto(theme, seed = 1) {
  const list = poolOf(theme);
  if (!list.length) return null;
  const n = Math.abs(Math.floor(Number(seed) || 0));
  return list[(n * 7 + theme.length) % list.length];
}

// ---------- Curated picks for the most visible slots ----------
// Page heroes by base path, and the four brand tiles. A real StartNet photo (hero/<path>) still wins over these.
const HERO_PICKS = {
  '/': 'event/saas-connect/2025-4',
  '/about': 'pool/team/01',
  '/brands': 'event/vibe-coding-summit/2025-coimbatore-2',
  '/research': 'pool/research/01',
  '/vibe': 'pool/vibereal/05',
  '/connect': 'event/saas-connect/2025-5',
  '/women': 'pool/women/07',
  '/startnet-x': 'pool/platform/01',
  '/events': 'pool/events/01',
  '/programmes': 'pool/students/09',
  '/insights': 'pool/insights/03',
  '/partner': 'pool/team/06',
  '/districts': 'pool/places/10',
  '/contact': 'pool/team/11',
  '/careers': 'pool/vibereal/10',
  '/media': 'pool/events/03',
  '/connect/saas': 'event/saas-connect/2025-3',
  '/connect/genai': 'event/genai-connect/2024',
  '/connect/d2c': 'event/d2c-connect/2024',
  '/events/saas-connect': 'event/saas-connect/2025-3',
  '/vibe/vibathon': 'event/vibathon/2025-2',
};
const TILE_PICKS = { research: 'pool/research/01', vibe: 'event/vibe-coding-summit/2025-coimbatore-2', connect: 'pool/connectreal/03', women: 'pool/womenreal/01', x: 'pool/platform/01' };

/** Hero photo for a page: StartNet's own (hero/<path>), else the curated pick, else undefined (themed library). */
export function heroPhoto(basePath = '/') {
  const own = photoFor(`hero${basePath === '/' ? '/home' : basePath}`);
  return own || photoFor(HERO_PICKS[basePath]);
}
/** Brand tile photo: StartNet's own (hero/<brand base>), else the curated pick. */
export function tilePhoto(brand, base) {
  return photoFor(base ? `hero${base}` : null) || photoFor(TILE_PICKS[brand]);
}

// ---------- One page, no repeats ----------
// Each image slot on a page gets a photo no other slot on that page uses. Slots reserve their photo when they
// are committed to the page (ArtImage's layout effect, before paint) and release it when they unmount, so render
// attempts React throws away (lazy chunks, data arriving) never use photos up.
// When a theme runs out, it borrows from the closest related themes before ever repeating.
const FALLBACK = {
  students: ['events', 'community', 'platform', 'professionals'],
  research: ['students', 'insights', 'professionals'],
  professionals: ['partner', 'platform', 'events', 'community'],
  women: ['community', 'professionals', 'events'],
  events: ['students', 'professionals', 'community'],
  places: ['community', 'events'],
  insights: ['professionals', 'platform', 'partner'],
  partner: ['professionals', 'events', 'community'],
  platform: ['students', 'professionals'],
  community: ['students', 'women', 'events', 'professionals'],
};
// Real StartNet photos first, where they fit the slot: the Vibe booth at TNGSS 2025 for students and Vibe,
// StartNet stage photos for events, Connect, partners and community. Captions say what each photo really shows.
// Since Oct 2026 (the StartNet Gallery): Connect meet-ups and SaaS Connect rooms (connectreal), the StartNet team
// (team), investor meetings (investors) and StartNet Women meet-ups (womenreal) lead their themes too.
const TIERS = {
  students: [['vibereal'], ['students']],
  events: [['stage', 'connectreal', 'vibereal'], ['events']],
  professionals: [['connectreal', 'stage'], ['professionals']],
  partner: [['investors', 'connectreal', 'stage'], ['partner', 'professionals']],
  community: [['team', 'connectreal', 'stage', 'vibereal'], ['community', 'students', 'professionals', 'women']],
  women: [['womenreal'], ['women']],
};
const page = { path: null, bySlot: new Map(), used: new Set(), fixed: new Set() };
const pageFor = (path) => {
  if (page.path !== path) {
    page.path = path;
    page.bySlot = new Map();
    page.used = new Set();
    page.fixed = new Set();
  }
  return page;
};

/**
 * A hint, recorded while a slot with a fixed `photo` renders: that photo is spoken for on this page, so pooled and
 * library slots (which choose later, in layout effects) leave it alone even when they come first in the page.
 * Only ever narrows other slots' choices, so a render React throws away costs nothing.
 */
export function hintFixedPhoto(path, key) {
  if (key) pageFor(path).fixed.add(key);
}

/** The first photo of `pool` not yet on this page (nor spoken for), reserved for this slot; null when none is left. */
export function claimPoolPhoto(path, slotId, pool) {
  const pg = pageFor(path);
  if (pg.bySlot.has(slotId)) return pg.bySlot.get(slotId);
  const free = (pool || []).find((c) => c && c.key && !pg.used.has(c.key) && !pg.fixed.has(c.key)) || null;
  if (free) {
    pg.used.add(free.key);
    pg.bySlot.set(slotId, free);
  }
  return free;
}

/** Record a photo a slot shows explicitly (StartNet's own or a curated pick), so library slots avoid it. */
export function markPhotoUsed(path, key) {
  if (key) pageFor(path).used.add(key);
}

/** Free a slot's photo when the slot unmounts (only on the page it was taken on). */
export function releasePhoto(path, slotId, key) {
  if (page.path !== path) return;
  const held = slotId != null ? page.bySlot.get(slotId) : null;
  const k = key || (held && held.key);
  if (slotId != null) page.bySlot.delete(slotId);
  if (k) page.used.delete(k);
}

// ---------- Event pages: only that event's own photos ----------
// Pages about one event (an edition, a series, the Vibathon / summit pages, the SaaS / D2C / GenAI Connect pages)
// show only photographs of that event: event/<series>.jpg, event/<series>/<edition>.jpg and a gallery
// event/<series>/<edition>-2.jpg, -3 … When there are none yet, the slots keep the brand art: never a random photo.
const SECTOR_SERIES = { saas: 'saas-connect', d2c: 'd2c-connect', genai: 'genai-connect' };
const NOT_SERIES = new Set(['past', 'host', 'speak', 'founders-day']);
export function eventSeriesForPath(p = '/') {
  let m = /^\/events\/([a-z0-9-]+)(\/|$)/.exec(p);
  if (m && !NOT_SERIES.has(m[1])) return m[1];
  if (/^\/(vibe\/vibathon|programmes\/vibathon)(\/|$)/.test(p)) return 'vibathon';
  if (/^\/(vibe\/summit|programmes\/vibe-summit)(\/|$)/.test(p)) return 'vibe-summit';
  if (/^\/(research\/lab-to-market-summit|programmes\/lab-to-market-summit)(\/|$)/.test(p)) return 'lab-to-market-summit';
  if (/^\/(women\/summit|programmes\/women-founders-summit)(\/|$)/.test(p)) return 'women-founders-summit';
  m = /^\/connect\/(saas|d2c|genai)(\/|$)/.exec(p);
  if (m) return SECTOR_SERIES[m[1]];
  return null;
}
/** Every photo of one event series (its editions and their galleries), in a stable order. */
export function eventGallery(series) {
  if (!series) return [];
  return Object.keys(manifest)
    .filter((k) => k === `event/${series}` || k.startsWith(`event/${series}/`))
    .sort()
    .map((key) => ({ key, ...manifest[key] }));
}

// ---------- Related StartNet photos for events without their own yet ----------
// An upcoming series (or one whose photos StartNet has not supplied) shows real photographs of the closest StartNet
// events instead of abstract art: the same brand and format, never stock. Each photo keeps its own caption, which
// names the event it was taken at ("GenAI Connect Summit & Expo 2024, Radisson, Salem"), so nothing passes for an
// edition that has not happened. 'pool:<theme>' entries are StartNet's own themed photos (team, investors, women…).
const SERIES_FAMILY = {
  'agentic-ai-connect': ['genai-connect', 'saas-connect', 'd2c-connect'],
  'physical-ai-connect': ['d2c-connect', 'saas-connect', 'genai-connect'],
  'genai-connect': ['saas-connect', 'd2c-connect'],
  'saas-connect': ['genai-connect', 'd2c-connect'],
  'd2c-connect': ['saas-connect', 'genai-connect'],
  vibathon: ['vibe-coding-summit', 'pool:vibereal'],
  'vibe-campus': ['vibe-coding-summit', 'vibathon', 'vibe-marketing-summit-2025'],
  'vibe-summit': ['vibe-coding-summit', 'vibe-marketing-summit-2025', 'vibathon'],
  'vibe-coding-summit': ['vibathon', 'vibe-marketing-summit-2025'],
  'vibe-marketing-summit-2025': ['vibe-coding-summit', 'vibathon'],
  'lab-to-market-summit': ['nirf-higher-ed-summit'],
  'research-days': ['nirf-higher-ed-summit'],
  'nirf-higher-ed-summit': ['vibe-coding-summit'],
  'women-founders-summit': ['pool:womenreal'],
  'investors-summit': ['pool:investors'],
  'network-meetings': ['pool:stage', 'pool:team'],
  'founders-day': ['pool:team', 'pool:connectreal'],
  'startnet-launch-2023': ['pool:stage', 'pool:team'],
};
const familyPart = (name) => (name.startsWith('pool:') ? POOL[name.slice(5)] || [] : eventGallery(name));

/** The series' own photos, else the photos of its closest StartNet events (SERIES_FAMILY), in a stable order. */
export function familyGallery(series) {
  if (!series) return [];
  const own = eventGallery(series);
  if (own.length) return own;
  return (SERIES_FAMILY[series] || []).flatMap(familyPart);
}

/**
 * Photos for a card about one event record, best first: the edition's own photos, then the rest of its series, then
 * related StartNet events, each in gallery order (the strongest photo first). The slot takes the first one not
 * already on the page (ArtImage photoPool).
 */
export function eventPool(e) {
  if (!e) return [];
  const series = e.series || e.slug;
  const all = eventGallery(series);
  const edition = e.series && e.slug && e.slug.startsWith(`${e.series}-`) ? e.slug.slice(e.series.length + 1) : e.edition;
  const own = edition ? all.filter((p) => p.key === `event/${series}/${edition}` || p.key.startsWith(`event/${series}/${edition}-`)) : [];
  const rest = all.filter((p) => !own.includes(p));
  const family = all.length ? (SERIES_FAMILY[series] || []).flatMap(familyPart) : familyGallery(series);
  return [...own, ...rest, ...family];
}

/** A library photo for one slot on one page: never one already shown on that page while any is left. */
export function allocateLibraryPhoto(path, slotId, theme, seed = 1) {
  const pg = pageFor(path);
  if (pg.bySlot.has(slotId)) return pg.bySlot.get(slotId);
  const n = Math.abs(Math.floor(Number(seed) || 0));
  const series = eventSeriesForPath(path);
  if (series) {
    // The event's own photos, then related StartNet events, then StartNet's own rooms: never a stock photo.
    const own = eventGallery(series);
    const list = [...own, ...[...(SERIES_FAMILY[series] || []), 'pool:stage', 'pool:connectreal', 'pool:team', 'pool:vibereal'].flatMap(familyPart)];
    const free = list.find((c) => !pg.used.has(c.key) && !pg.fixed.has(c.key)) || null;
    if (free) pg.used.add(free.key);
    pg.bySlot.set(slotId, free);
    return free;
  }
  let pick = null;
  for (const t of [theme, ...(FALLBACK[theme] || [])]) {
    // StartNet's own photos (tier 1) are used before the licensed library (tier 2).
    for (const tier of TIERS[t] || [MIX[t] || [t]]) {
      const list = tier.flatMap((name) => POOL[name] || []);
      if (!list.length) continue;
      const start = (n * 7 + t.length) % list.length;
      for (let i = 0; i < list.length && !pick; i++) {
        const c = list[(start + i) % list.length];
        if (!pg.used.has(c.key) && !pg.fixed.has(c.key)) pick = c;
      }
      if (pick) break;
    }
    if (pick) break;
  }
  if (!pick) pick = libraryPhoto(theme, seed); // every photo is already on this page
  if (pick) pg.used.add(pick.key);
  pg.bySlot.set(slotId, pick);
  return pick;
}

/**
 * The photo for a card about one event or series (a URL such as /events/vibathon or /connect/saas, or a series
 * key): that event's own first photo, or null so the card keeps its art. Never a library photo.
 */
export function seriesPhoto(pathOrSeries) {
  const series = typeof pathOrSeries === 'string' && pathOrSeries.startsWith('/') ? eventSeriesForPath(pathOrSeries) : pathOrSeries;
  return familyGallery(series)[0] || null;
}

/**
 * The sharpest photo of one edition (largest height), for tall 4:5 posters; falls back to the series, then to related
 * StartNet events. Without photos of its own, editions of one series take different photos (by edition name).
 */
export function posterPhoto(series, edition) {
  const all = eventGallery(series);
  const own = edition ? all.filter((p) => p.key === `event/${series}/${edition}` || p.key.startsWith(`event/${series}/${edition}-`)) : [];
  const pool = (own.length ? own : all.length ? all : familyGallery(series)).slice().sort((a, b) => (b.height || 0) - (a.height || 0) || a.key.localeCompare(b.key));
  if (own.length || !pool.length) return pool[0] || null;
  let h = 0;
  for (const ch of String(edition || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % Math.min(pool.length, 4)];
}
