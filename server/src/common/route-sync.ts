import { Logger } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { CLIENT_SRC } from './paths';
import { REDIRECTS, ROUTES, VANITY } from './routes';

const read = (file: string) => (existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n?/g, '\n') : null);

/** String items of the array literal that starts at `anchor` (e.g. /export const X_SLUGS = \[/). */
function arrayItems(src: string | null, anchor: RegExp): string[] | null {
  if (!src) return null;
  const m = anchor.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  const end = src.indexOf(']', start);
  return [...src.slice(start, end < 0 ? undefined : end).matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1]);
}

/** Keys of the object literal that starts at `anchor` (top-level keys only, by the indentation of the first key). */
function objectKeys(src: string | null, anchor: RegExp): string[] | null {
  if (!src) return null;
  const m = anchor.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  // Single-line object: { a: A, 'b-c': B }
  const lineEnd = src.indexOf('\n', start);
  const firstLine = src.slice(start, lineEnd < 0 ? undefined : lineEnd);
  if (firstLine.includes('}')) {
    return [...firstLine.matchAll(/(?:^|[{,])\s*'?([a-z0-9-]+)'?\s*:/gi)].map((x) => x[1]);
  }
  const keys: string[] = [];
  let indent: string | null = null;
  for (const line of src.slice(lineEnd + 1).split('\n')) {
    if (/^\};?\s*$/.test(line)) break;
    const km = /^(\s+)'?([a-z0-9-]+)'?\s*:/i.exec(line);
    if (!km) continue;
    if (indent === null) indent = km[1];
    if (km[1] === indent) keys.push(km[2]);
  }
  return keys;
}

/** `slug: 'x'` values between `anchor` and the next top-level `];` (arrays of records, e.g. DISTRICTS, LABS). */
function recordSlugs(src: string | null, anchor: RegExp): string[] | null {
  if (!src) return null;
  const m = anchor.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  const end = src.indexOf('\n];', start);
  return [...src.slice(start, end < 0 ? undefined : end).matchAll(/\bslug:\s*'([a-z0-9-]+)'/g)].map((x) => x[1]);
}

/** The literal `slugs: [...]` of one MEGA_ROUTES manifest entry (client/src/pages/mega/<group>/routes.js). */
function manifestSlugs(src: string | null, path: string): string[] | null {
  if (!src) return null;
  const at = src.indexOf(`path: '${path}'`);
  if (at < 0) return null;
  const next = src.indexOf('path:', at + 6);
  const entry = src.slice(at, next < 0 ? undefined : next);
  const m = /slugs:\s*\[([^\]]*)\]/.exec(entry);
  return m ? [...m[1].matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1]) : null;
}

/** alias → slug pairs of a flat object literal of string values (DISTRICT_ALIASES). */
function stringMap(src: string | null, anchor: RegExp): Record<string, string> | null {
  if (!src) return null;
  const m = anchor.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  const end = src.indexOf('};', start);
  const out: Record<string, string> = {};
  for (const x of src.slice(start, end < 0 ? undefined : end).matchAll(/^\s+'?([a-z0-9-]+)'?:\s*'([a-z0-9-]+)'/gm)) out[x[1]] = x[2];
  return out;
}

/** First extractor that finds its table wins (the client tables move between files). */
function firstOf(...tries: (() => string[] | null)[]): string[] | null {
  for (const t of tries) {
    const v = t();
    if (v && v.length) return v;
  }
  return null;
}

/** Route paths declared in routes() of App.jsx, as '/a/:/b' patterns (params collapsed to ':'). */
export function appRoutes(source: string): string[] {
  const src = source.replace(/\r\n?/g, '\n');
  const all = src.slice(src.indexOf('function routes()')).split('\n');
  const end = all.findIndex((l) => l === '}');
  const lines = end > 0 ? all.slice(0, end) : all;
  const stack: string[] = [];
  const out: string[] = [];
  const joinPath = (...parts: string[]) => `/${parts.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('</Route>')) {
      stack.pop();
      continue;
    }
    if (!t.startsWith('<Route')) continue;
    const pathM = /\bpath="([^"]*)"/.exec(t);
    const selfClosing = /\/>\s*$/.test(t);
    // The `index` attribute, not a path that happens to contain the word (path="insights/indices/:index").
    const isIndex = /\bindex\b/.test(t.split('element=')[0].replace(/"[^"]*"/g, '""'));
    const path = pathM?.[1] ?? '';
    if (!selfClosing) {
      stack.push(path);
      if (path) out.push(joinPath(...stack));
      continue;
    }
    if (path === '*' || /LocaleRedirect|Navigate/.test(t)) continue;
    if (isIndex) out.push(joinPath(...stack));
    else if (path) out.push(joinPath(...stack, path));
  }
  return [...new Set(out.map((p) => p.replace(/:[^/]+/g, ':')))];
}

/** The client's slug table per static family, read from client/src (null when it cannot be found). */
export function clientSlugTables(clientSrc: string): Record<string, string[] | null> {
  const src = (rel: string) => read(join(clientSrc, rel));
  return {
    research: firstOf(
      () => arrayItems(src('pages/brands/research/researchContent.js'), /export const RESEARCH_SUB_SLUGS = \[/),
      () => objectKeys(src('pages/brands/research/ResearchSub.jsx'), /const PAGES = \{/),
    ),
    vibe: (() => {
      const k = firstOf(
        () => arrayItems(src('pages/brands/vibe/vibeContent.js'), /export const VIBE_SUB_SLUGS = \[/),
        () => objectKeys(src('pages/brands/vibe/VibeSub.jsx'), /const BODIES = \{/),
      );
      return k ? [...new Set(['vibathon', ...k])] : null;
    })(),
    connect: (() => {
      const builders = objectKeys(src('pages/brands/connect/ConnectSub.jsx'), /const (?:builders|BUILDERS) = \{/);
      const data = src('pages/brands/connect/connectData.js');
      const sectors = data ? [...data.matchAll(/\{\s*slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]) : null;
      return builders?.length && sectors?.length ? [...builders, ...sectors] : null;
    })(),
    women: firstOf(
      () => arrayItems(src('pages/brands/women/womenContent.js'), /export const WOMEN_SUB_SLUGS = \[/),
      () => objectKeys(src('pages/brands/women/WomenSub.jsx'), /const PAGES = \{/),
    ),
    partner: objectKeys(src('pages/partner/partnerData.js'), /export const PARTNER_TYPES = \{/),
    legal: arrayItems(src('pages/utility/legalContent.js'), /export const LEGAL_ORDER = \[/),
    // Mega-menu pages (client/src/pages/mega/*): param pages with a fixed slug list
    lab: firstOf(
      () => manifestSlugs(src('pages/mega/brand-sub/routes.js'), 'research/labs/:lab'),
      () => recordSlugs(src('pages/mega/brand-sub/brandSubData.js'), /export const LABS = \[/),
    ),
    index: firstOf(
      () => objectKeys(src('pages/mega/insights-reports/shared.js'), /export const INDEX_ROUTES = \{/),
      () => manifestSlugs(src('pages/mega/insights-reports/routes.js'), 'insights/indices/:index'),
    ),
    district: recordSlugs(src('pages/mega/about-districts/districtsData.js'), /export const DISTRICTS = \[/),
    campaign: manifestSlugs(src('pages/mega/utility-campaign/routes.js'), 'go/:slug'),
    series: objectKeys(src('pages/mega/events-series/seriesData.js'), /export const SERIES = \{/),
  };
}

/**
 * Startup check: server route and slug tables against the client sources (only when client/src exists,
 * i.e. in a repo checkout). Logs every difference; STRICT_ROUTES=1 turns a difference into a startup error.
 */
export function checkRouteSync(
  staticSlugs: Record<string, string[]>,
  logger = new Logger('RouteSync'),
  districtAliases: Record<string, string> | null = null,
): string[] {
  if (!CLIENT_SRC) return [];
  const problems: string[] = [];

  const app = read(join(CLIENT_SRC, 'App.jsx'));
  if (app) {
    const client = new Set(appRoutes(app));
    const server = new Set<string>(ROUTES.map((r) => r.replace(/:[^/]+/g, ':')));
    for (const r of client) if (!server.has(r)) problems.push(`App.jsx route ${r} is missing from server ROUTES (served as 404)`);
    for (const r of server) if (!client.has(r)) problems.push(`server ROUTES has ${r}, which App.jsx does not render`);
    for (const v of Object.keys(VANITY)) if (!app.includes(`path="${v.slice(1)}"`)) problems.push(`vanity ${v} has no LocaleRedirect in App.jsx`);
  } else {
    problems.push('could not read client/src/App.jsx');
  }

  const redirectSlugs = Object.keys(REDIRECTS).map((p) => p.split('/').pop() as string);
  for (const [family, list] of Object.entries(clientSlugTables(CLIENT_SRC))) {
    if (!list) {
      problems.push(`could not read the ${family} slug table from client/src`);
      continue;
    }
    const want = new Set(list);
    const have = new Set(staticSlugs[family] ?? []);
    for (const s of want) if (!have.has(s)) problems.push(`static-slugs.json ${family} is missing "${s}" (served as 404)`);
    for (const s of have) {
      if (!want.has(s) && !(family === 'connect' && redirectSlugs.includes(s))) {
        problems.push(`static-slugs.json ${family} has "${s}", which the client does not render`);
      }
    }
  }

  if (districtAliases) {
    const client = stringMap(read(join(CLIENT_SRC, 'pages/mega/about-districts/districtsData.js')), /export const DISTRICT_ALIASES = {/);
    if (!client) problems.push('could not read DISTRICT_ALIASES from client/src');
    else {
      for (const [k, v] of Object.entries(client)) if (districtAliases[k] !== v) problems.push(`static-slugs.json districtAliases is missing "${k}" → "${v}"`);
      for (const k of Object.keys(districtAliases)) if (!(k in client)) problems.push(`static-slugs.json districtAliases has "${k}", which the client does not redirect`);
    }
  }

  for (const p of problems) logger.warn(p);
  if (!problems.length) logger.log('Server routes and slugs match client/src');
  if (problems.length && process.env.STRICT_ROUTES === '1') {
    throw new Error(`Route tables out of sync with client/src:\n- ${problems.join('\n- ')}`);
  }
  return problems;
}
