import { Logger } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { DATA_DIR } from './paths';

/**
 * Client routes, mirroring routes() in client/src/App.jsx (every route also exists under /ta).
 * A `:family` segment matches exactly one path segment whose value is a known slug of that family:
 * - data families come from server/data (ContentService): programme, event (event slugs, series slugs and every
 *   event.series), edition, period (Ledger editions), report, release (press kind "release"), role (careers), story;
 * - static families come from server/data/static-slugs.json (research, vibe, connect, women, partner, legal, lab,
 *   index, district, campaign, series).
 * A pattern with two params (/events/:series/:edition) is checked as one joint value "series/edition" in the
 * family of its LAST param (edition).
 * Keep this list in step with App.jsx: checkRouteSync() (route-sync.ts) compares them at startup.
 */
export const ROUTES = [
  '/',
  '/join',
  '/about',
  '/about/mission-1-lakh',
  '/about/how-we-work',
  '/about/leadership',
  '/about/evidence-standard',
  '/about/governance',
  '/about/thinktn-alliance',
  '/about/self-diagnosis',
  '/brands',
  '/research',
  '/research/labs/:lab',
  '/research/stories',
  '/research/events',
  '/research/:research',
  '/vibe',
  '/vibe/vibathon',
  '/vibe/stories',
  '/vibe/events',
  '/vibe/:vibe',
  '/connect',
  '/connect/stories',
  '/connect/events',
  '/connect/:connect',
  '/women',
  '/women/stories',
  '/women/events',
  '/women/summit/awards',
  '/women/:women',
  '/programmes',
  '/programmes/open-calls',
  '/programmes/:programme',
  '/events',
  '/events/past',
  '/events/speak',
  '/events/host',
  '/events/founders-day',
  '/events/:event',
  '/events/:series/:edition',
  '/events/:series/:edition/agenda',
  '/events/:series/:edition/speakers',
  '/insights',
  '/insights/founder-ledger',
  '/insights/founder-ledger/corrections',
  '/insights/founder-ledger/methodology',
  '/insights/founder-ledger/:period',
  '/insights/stories',
  '/insights/stories/:story',
  '/insights/reports',
  '/insights/reports/:report',
  '/insights/indices',
  '/insights/indices/:index',
  '/insights/podcast',
  '/insights/newsletter',
  '/startnet-x',
  '/startnet-x/modules',
  '/startnet-x/pricing',
  '/startnet-x/trust',
  '/startnet-x/agents',
  '/startnet-x/updates',
  '/startnet-x/developers',
  '/startnet-x/founders',
  '/startnet-x/institutions',
  '/startnet-x/incubators',
  '/startnet-x/gccs',
  '/startnet-x/government',
  '/startnet-x/investors',
  '/partner',
  '/partner/enquire',
  '/partner/our-partners',
  '/partner/:partner',
  '/media',
  '/media/kit',
  '/media/releases/:release',
  '/careers',
  '/careers/:role',
  '/contact',
  '/search',
  '/legal/:legal',
  '/sitemap',
  '/districts',
  '/districts/:district',
  '/signin',
  '/signup',
  '/go/:campaign',
] as const;

/** Vanity routes for print and QR codes (Book 1 Part B §7.3): single-hop 301, language kept. */
export const VANITY: Record<string, string> = {
  '/mission': '/about/mission-1-lakh',
  '/ledger': '/insights/founder-ledger',
  '/vibathon': '/vibe/vibathon',
  '/apply': '/programmes/open-calls',
  '/snx': '/startnet-x',
};

/**
 * Editions withdrawn from the listings (Oct 2026: the live Connect line-up is Agentic AI Connect and Physical AI
 * Connect, docs/research/CONFLICTS.md). Every URL of a withdrawn edition (flat, nested, /agenda, /speakers) 301s to
 * its series page, which still lists the series' past editions. Mirrors RETIRED_EDITIONS in
 * client/src/pages/mega/events-series/seriesData.js (the client redirects the same URLs when the server is not in front).
 */
export const RETIRED_EDITIONS: Record<string, string[]> = {
  'genai-connect': ['2027'],
  'saas-connect': ['2027'],
  'd2c-connect': ['2027'],
};

function retiredRedirects(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [series, editions] of Object.entries(RETIRED_EDITIONS)) {
    for (const ed of editions) {
      const target = `/events/${series}`;
      for (const p of [`/events/${series}-${ed}`, `/events/${series}/${ed}`, `/events/${series}/${ed}/agenda`, `/events/${series}/${ed}/speakers`]) {
        out[p] = target;
      }
    }
  }
  return out;
}

/**
 * Old client-side redirects, served as real 301s. Targets may carry a query.
 * (/connect/events and /connect/stories used to redirect here; they are brand pages now.)
 */
export const REDIRECTS: Record<string, string> = {
  // The generic "past editions" records became real dated editions (Oct 2026); old URLs keep working.
  '/events/genai-connect-archive': '/events/genai-connect/2024',
  '/events/genai-connect/archive': '/events/genai-connect/2024',
  '/events/d2c-connect-archive': '/events/d2c-connect/2024',
  '/events/d2c-connect/archive': '/events/d2c-connect/2024',
  '/events/saas-connect-archive': '/events/saas-connect/2025',
  '/events/saas-connect/archive': '/events/saas-connect/2025',
  ...retiredRedirects(),
};

/** Static pages left out of sitemap.xml (no indexable content of their own). */
export const SITEMAP_EXCLUDE = new Set<string>(['/search']);

/**
 * noindex pages (Book 1 Part B §6.4 reserved roots): the SNX sign-in/sign-up hand-offs and campaign landings.
 * Served with X-Robots-Tag: noindex and kept out of sitemap.xml. `path` has no /ta prefix.
 */
export function isNoindex(path: string): boolean {
  return path === '/signin' || path === '/signup' || path.startsWith('/go/');
}

export const STATIC_FAMILIES = [
  'research', 'vibe', 'connect', 'women', 'partner', 'legal', 'lab', 'index', 'district', 'campaign', 'series',
] as const;
export const DATA_FAMILIES = ['programme', 'event', 'edition', 'period', 'report', 'release', 'role', 'story'] as const;
export type Family = (typeof STATIC_FAMILIES)[number] | (typeof DATA_FAMILIES)[number];

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

/** static-slugs.json: one slug list per static family, plus alternative district spellings (alias → slug). */
export type StaticSlugs = Record<string, string[]>;
export interface StaticTables {
  slugs: StaticSlugs;
  districtAliases: Record<string, string>;
}

/** server/data/static-slugs.json → { family: slug[] } and the district aliases. Missing or bad file → empty (and a warning). */
export function loadStaticTables(logger = new Logger('Routes')): StaticTables {
  const file = join(DATA_DIR, 'static-slugs.json');
  const slugs: StaticSlugs = {};
  const districtAliases: Record<string, string> = {};
  for (const f of STATIC_FAMILIES) slugs[f] = [];
  if (!existsSync(file)) {
    logger.warn(`Missing ${file}: every static sub-page will be served as 404`);
    return { slugs, districtAliases };
  }
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
    for (const f of STATIC_FAMILIES) {
      const v = own(raw, f) ? raw[f] : undefined;
      slugs[f] = Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string' && !!s) : [];
    }
    const aliases = raw.districtAliases;
    if (aliases && typeof aliases === 'object' && !Array.isArray(aliases)) {
      for (const [k, v] of Object.entries(aliases as Record<string, unknown>)) {
        if (typeof v === 'string' && v) districtAliases[k.toLowerCase()] = v;
      }
    }
  } catch (err) {
    logger.error(`Could not parse ${file}: ${(err as Error).message}`);
  }
  return { slugs, districtAliases };
}

/** Back-compatible: the slug lists only. */
export function loadStaticSlugs(logger = new Logger('Routes')): Record<string, string[]> {
  return loadStaticTables(logger).slugs;
}

/** Slug sources for the data families (ContentService). */
export interface DataSlugSource {
  programmes: { slug: string }[];
  events: { slug: string; series?: string; edition?: string }[];
  stories: { slug: string }[];
  reports?: { slug: string; kind?: string; url?: unknown }[];
  press?: { slug: string; kind?: string }[];
  careers?: { slug: string }[];
  ledger?: () => { period?: unknown; periods?: unknown };
}

/**
 * Edition key inside /events/<series>/<edition>: the event slug minus "<series>-" (vibathon-2027 → 2027,
 * genai-connect-archive → archive), else `edition`, else the slug. Same rule as client seriesData.js editionKeyOf().
 */
export function editionKeyOf(e: { slug: string; series?: string; edition?: string }): string {
  const prefix = `${e.series}-`;
  if (e.series && e.slug.startsWith(prefix) && e.slug.length > prefix.length) return e.slug.slice(prefix.length);
  return e.edition || e.slug;
}

/** "2026-Q4" → "2026-q4"; anything else → null (Book 1 Part B §7.1 rule 4). */
export function periodSlug(p: unknown): string | null {
  const m = /^(\d{4})-q([1-4])$/i.exec(String(p ?? '').trim());
  return m ? `${m[1]}-q${m[2]}` : null;
}

type Seg = { param: Family } | { lit: string };

/** Resolves a client path (no /ta prefix, no trailing slash, already lower-case where it matters). */
export class RouteTable {
  private readonly patterns: Seg[][];
  private readonly families = new Map<string, Set<string>>();
  /** Report slugs whose page lives elsewhere (the Ledger, the indices, a report with its own page such as /about/self-diagnosis) → that page. */
  private readonly reportRedirects = new Map<string, string>();
  /** Flat edition URLs (/events/vibathon-2027) → their canonical nested URL (/events/vibathon/2027), Book 1 §7.4. */
  private readonly eventRedirects = new Map<string, string>();
  readonly staticSlugs: Record<string, string[]>;
  private readonly districtAliases: Record<string, string>;

  constructor(
    statics: Record<string, string[]> | StaticTables,
    private readonly data: DataSlugSource | null,
  ) {
    const tables: StaticTables =
      'slugs' in statics && 'districtAliases' in statics
        ? (statics as StaticTables)
        : { slugs: statics as Record<string, string[]>, districtAliases: {} };
    this.staticSlugs = tables.slugs;
    this.districtAliases = tables.districtAliases;

    this.patterns = ROUTES.map((r) =>
      r === '/' ? [] : r.slice(1).split('/').map((part): Seg => (part.startsWith(':') ? { param: part.slice(1) as Family } : { lit: part })),
    );
    for (const f of STATIC_FAMILIES) this.families.set(f, new Set(this.staticSlugs[f] ?? []));
    if (data) {
      const series = new Set(this.staticSlugs.series ?? []);
      for (const e of data.events) if (e.series) series.add(e.series);
      this.families.set('programme', new Set(data.programmes.map((p) => p.slug)));
      this.families.set('event', new Set([...data.events.map((e) => e.slug), ...series]));
      this.families.set('edition', new Set(data.events.filter((e) => e.series).map((e) => `${e.series}/${editionKeyOf(e)}`)));
      // Same rule as the client EventsSlugDispatcher: an event in a series is an edition and its flat slug 301s.
      for (const e of data.events) {
        if (e.series && e.slug !== e.series && !series.has(e.slug)) this.eventRedirects.set(e.slug, `/events/${e.series}/${editionKeyOf(e)}`);
      }
      this.families.set('story', new Set(data.stories.map((s) => s.slug)));

      const reports = data.reports ?? [];
      const indexSet = this.families.get('index') ?? new Set<string>();
      const reportSlugs = new Set<string>();
      for (const r of reports) {
        const url = typeof r.url === 'string' ? r.url : '';
        if (r.kind === 'ledger') this.reportRedirects.set(r.slug, url.startsWith('/') && !url.includes('#') ? url : '/insights/founder-ledger');
        else if (r.kind === 'index') {
          const target = url.startsWith('/insights/indices/') ? url : indexSet.has(r.slug) ? `/insights/indices/${r.slug}` : '';
          if (target) this.reportRedirects.set(r.slug, target);
          else reportSlugs.add(r.slug);
        } else if (url.startsWith('/') && !url.includes('#') && !url.startsWith('/insights/reports')) {
          // A report whose page lives elsewhere (self-diagnosis-2027 → /about/self-diagnosis): one canonical URL.
          this.reportRedirects.set(r.slug, url.replace(/\/+$/, ''));
        } else reportSlugs.add(r.slug);
      }
      this.families.set('report', reportSlugs);
      this.families.set('release', new Set((data.press ?? []).filter((p) => p.kind === 'release').map((p) => p.slug)));
      this.families.set('role', new Set((data.careers ?? []).map((r) => r.slug)));

      const ledger = data.ledger ? data.ledger() : null;
      const periods = new Set<string>();
      const add = (p: unknown) => {
        const s = periodSlug(p);
        if (s) periods.add(s);
      };
      add(ledger?.period);
      if (Array.isArray(ledger?.periods)) ledger.periods.forEach(add);
      this.families.set('period', periods);
    }
  }

  /** Slugs of one family (empty when unknown). */
  slugs(family: Family): string[] {
    return [...(this.families.get(family) ?? [])];
  }

  hasSlug(family: Family, slug: string): boolean {
    return this.families.get(family)?.has(slug) ?? false;
  }

  /**
   * A 301 target for a path that has moved within the app (no /ta prefix): report slugs that are the Ledger or an
   * index, and alternative district spellings (/districts/trichy → /districts/tiruchirappalli). Null otherwise.
   */
  redirectFor(path: string): string | null {
    const segs = path.replace(/^\/+/, '').split('/');
    if (segs.length === 2 && segs[0] === 'events') {
      let slug = segs[1];
      try {
        slug = decodeURIComponent(slug);
      } catch {
        return null;
      }
      return this.eventRedirects.get(slug) ?? null;
    }
    if (segs.length === 3 && segs[0] === 'insights' && segs[1] === 'reports') {
      return this.reportRedirects.get(segs[2]) ?? null;
    }
    if (segs.length === 2 && segs[0] === 'districts') {
      const slug = segs[1].toLowerCase();
      if (!this.hasSlug('district', slug) && own(this.districtAliases, slug)) return `/districts/${this.districtAliases[slug]}`;
    }
    return null;
  }

  /** True when `path` is a page the client renders with content (not NotFound). */
  isKnown(path: string): boolean {
    const segs = path === '/' ? [] : path.replace(/^\/+/, '').split('/');
    return this.patterns.some((pat) => {
      if (pat.length !== segs.length) return false;
      const values: string[] = [];
      let last: Family | null = null;
      for (let i = 0; i < pat.length; i++) {
        const p = pat[i];
        if ('lit' in p) {
          if (p.lit !== segs[i]) return false;
          continue;
        }
        try {
          values.push(decodeURIComponent(segs[i]));
        } catch {
          return false;
        }
        last = p.param;
      }
      if (!last) return true;
      return this.hasSlug(last, values.join('/'));
    });
  }

  /**
   * Every concrete EN path (static routes + every slug), minus vanity, redirects (incl. flat edition URLs), noindex
   * pages, exclusions and the edition agenda/speakers tabs (their canonical is the edition page).
   */
  allPaths(): string[] {
    const out: string[] = [];
    for (const pat of this.patterns) {
      const params = pat.filter((p): p is { param: Family } => 'param' in p);
      if (!params.length) {
        out.push(`/${pat.map((p) => (p as { lit: string }).lit).join('/')}`);
        continue;
      }
      const family = params[params.length - 1].param;
      for (const value of this.slugs(family)) {
        const parts = params.length > 1 ? value.split('/') : [value];
        if (parts.length !== params.length) continue;
        let k = 0;
        const path = `/${pat.map((p) => ('lit' in p ? p.lit : encodeURIComponent(parts[k++]))).join('/')}`;
        if (!own(REDIRECTS, path) && !this.redirectFor(path) && !/^\/events\/[^/]+\/[^/]+\/(agenda|speakers)$/.test(path)) out.push(path);
      }
    }
    // Explicit literal routes (e.g. /vibe/vibathon) can also be in a slug family: keep one copy.
    return [...new Set(out)].filter((p) => !SITEMAP_EXCLUDE.has(p) && !own(VANITY, p) && !isNoindex(p));
  }
}
