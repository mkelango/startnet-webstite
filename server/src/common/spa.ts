import type { NextFunction, Request, Response } from 'express';
import { readFileSync, statSync } from 'fs';
import { extname, join, resolve, sep } from 'path';
import type { PrerenderStore } from './prerender';
import { isNoindex, REDIRECTS, RouteTable, VANITY } from './routes';
import { buildRobots, buildSitemap, LastmodSource, publicOrigin } from './sitemap';

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

/** "?a=1" from the original URL, or ''. */
const queryOf = (req: Request) => {
  const i = req.originalUrl.indexOf('?');
  return i >= 0 ? req.originalUrl.slice(i) : '';
};

/** Append the request's own query to a target that may already carry one. */
const withQuery = (target: string, qs: string) => {
  if (!qs || qs === '?') return target;
  return target.includes('?') ? `${target}&${qs.slice(1)}` : `${target}${qs}`;
};

/** Strip an optional /ta language prefix. */
function splitLang(path: string): { prefix: '' | '/ta'; rest: string } {
  if (path === '/ta' || path === '/ta/') return { prefix: '/ta', rest: '/' };
  if (path.startsWith('/ta/')) return { prefix: '/ta', rest: path.slice(3) };
  return { prefix: '', rest: path };
}

/** Query keys that only track (utm_*, click ids). Any other key makes the URL a filter state (Book 1 Part B §7.4). */
const TRACKING = /^(utm_[a-z]+|gclid|fbclid|msclkid|ref|src|mc_cid|mc_eid)$/i;
const isFilterState = (req: Request) => Object.keys(req.query ?? {}).some((k) => !TRACKING.test(k));

/** Drop trailing slashes (but keep "/"). */
const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') || '/' : p);

/**
 * Where a client path goes: a 301 target (vanity or old redirect, language kept), a known page, or unknown.
 * `path` is the full request path, including any /ta prefix.
 */
export function resolvePath(table: RouteTable, path: string): { redirect?: string; known: boolean } {
  const { prefix, rest } = splitLang(path);
  const clean = trimSlash(rest);
  if (own(VANITY, clean)) return { redirect: `${prefix}${VANITY[clean]}`, known: true };
  if (own(REDIRECTS, clean)) return { redirect: `${prefix}${REDIRECTS[clean]}`, known: true };
  const moved = table.redirectFor(clean);
  if (moved) return { redirect: `${prefix}${moved}`, known: true };
  return { known: table.isKnown(clean) };
}

const ONE_HOUR = 'public, max-age=3600';

/**
 * Mounted BEFORE the static files:
 * - /robots.txt and /sitemap.xml (generated, cached for an hour)
 * - /index.html and /ta/index.html → 301 to / and /ta (the static middleware would serve the shell as a 200 NotFound)
 * - /assets/* → a precompressed .br or .gz sibling when the client accepts it
 */
export function preStatic(
  clientDist: string,
  getTable: () => RouteTable,
  getData: () => LastmodSource | null,
  prerender?: PrerenderStore,
) {
  const assetsRoot = resolve(clientDist, 'assets');
  let sitemap: { at: number; xml: string } | null = null;

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const path = req.path;

    if (path === '/robots.txt') {
      res.status(200).set('Cache-Control', ONE_HOUR).type('text/plain').send(buildRobots(publicOrigin()));
      return;
    }
    if (path === '/sitemap.xml') {
      if (!sitemap || Date.now() - sitemap.at > 3600_000) {
        sitemap = { at: Date.now(), xml: buildSitemap(getTable(), getData(), publicOrigin(), prerender?.noindex()) };
      }
      res.status(200).set('Cache-Control', ONE_HOUR).type('application/xml').send(sitemap.xml);
      return;
    }
    const lower = path.toLowerCase();
    // Snapshots are served through the SPA fallback under their page URL, never as files.
    if (lower === '/prerender' || lower.startsWith('/prerender/')) {
      res.status(404).set('Cache-Control', 'no-cache').json({ statusCode: 404, message: 'File not found.', fieldErrors: {} });
      return;
    }
    if (lower === '/index.html' || lower === '/ta/index.html') {
      res.redirect(301, withQuery(lower === '/index.html' ? '/' : '/ta', queryOf(req)));
      return;
    }

    if (path.startsWith('/assets/')) {
      const accept = String(req.headers['accept-encoding'] ?? '');
      const encodings: [string, string][] = [];
      if (/\bbr\b/.test(accept)) encodings.push(['br', '.br']);
      if (/\bgzip\b/.test(accept)) encodings.push(['gzip', '.gz']);
      if (!encodings.length) return next();
      let rel: string;
      try {
        rel = decodeURIComponent(path.slice('/assets/'.length));
      } catch {
        return next();
      }
      const file = resolve(assetsRoot, rel);
      if (!file.startsWith(assetsRoot + sep) || rel.includes('\0')) return next();
      for (const [encoding, suffix] of encodings) {
        let ok = false;
        try {
          ok = statSync(file + suffix).isFile();
        } catch {
          ok = false;
        }
        if (!ok) continue;
        res.setHeader('Content-Encoding', encoding);
        res.setHeader('Vary', 'Accept-Encoding');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.type(extname(file) || 'application/octet-stream');
        res.sendFile(file + suffix, { cacheControl: false, lastModified: true, etag: true, dotfiles: 'deny' }, (err) => {
          if (err && !res.headersSent) {
            res.removeHeader('Content-Encoding');
            next();
          }
        });
        return;
      }
    }
    next();
  };
}

/**
 * SPA fallback, mounted after the static files. GET/HEAD only; /api is left to Nest.
 * - upper-case paths → 301 to the lower-case path when that is a page (query kept)
 * - vanity routes, old client redirects and moved pages (report slugs of the Ledger/indices, district aliases)
 *   → single-hop 301 (language kept)
 * - a missing file (last segment has an extension) → 404 JSON, never the app shell
 * - a known route with a known slug → its prerendered snapshot when there is one (tools/seo/prerender.mjs), else
 *   index.html (200, no-cache); anything else → index.html with 404
 * - filter states (?brand=, ?district= …) get the plain shell and X-Robots-Tag: noindex, follow; their canonical is
 *   the unfiltered listing
 */
export function spaFallback(clientDist: string, getTable: () => RouteTable, prerender?: PrerenderStore) {
  const indexFile = join(clientDist, 'index.html');
  let cached: { mtimeMs: number; html: string } | null = null;
  const indexHtml = () => {
    const { mtimeMs } = statSync(indexFile);
    if (!cached || cached.mtimeMs !== mtimeMs) cached = { mtimeMs, html: readFileSync(indexFile, 'utf8') };
    return cached.html;
  };

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const path = req.path;
    if (path === '/api' || path.startsWith('/api/')) return next();
    const table = getTable();
    const qs = queryOf(req);

    const lower = path.toLowerCase();
    if (lower !== path) {
      const target = resolvePath(table, lower);
      if (target.redirect) return res.redirect(301, withQuery(target.redirect, qs));
      if (target.known) return res.redirect(301, withQuery(trimSlash(lower), qs));
    }

    const target = resolvePath(table, path);
    if (target.redirect) return res.redirect(301, withQuery(target.redirect, qs));

    const last = path.slice(path.lastIndexOf('/') + 1);
    if (/\.[A-Za-z0-9]{1,8}$/.test(last)) {
      res.status(404).set('Cache-Control', 'no-cache').json({ statusCode: 404, message: 'File not found.', fieldErrors: {} });
      return;
    }

    let html: string;
    try {
      html = indexHtml();
    } catch (err) {
      return next(err);
    }
    const clean = trimSlash(path);
    const filtered = isFilterState(req);
    if (target.known && !filtered && prerender) {
      const snapshot = prerender.get(clean);
      if (snapshot) html = snapshot;
    }
    // Reserved roots (/signin, /signup, /go/*) are never indexed (Book 1 Part B §6.4).
    if (isNoindex(trimSlash(splitLang(path).rest))) res.set('X-Robots-Tag', 'noindex, nofollow');
    else if (filtered || prerender?.noindex().has(clean)) res.set('X-Robots-Tag', 'noindex, follow');
    res
      .status(target.known ? 200 : 404)
      .set('Cache-Control', 'no-cache')
      .type('html')
      .send(html);
  };
}

/** Cache headers for the built files: hashed /assets are immutable, the HTML shell is always revalidated. */
export function staticHeaders(clientDist: string) {
  const root = clientDist.replace(/\\/g, '/').replace(/\/+$/, '');
  return (res: Response, filePath: string) => {
    const p = filePath.replace(/\\/g, '/');
    const rel = p.startsWith(root) ? p.slice(root.length) : p;
    if (rel.startsWith('/assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    else if (rel === '/index.html') res.setHeader('Cache-Control', 'no-cache');
  };
}

/**
 * GET /api content lists and details may be cached briefly by browsers and CDNs (ETag still revalidates).
 * Forms and health are never cached; error responses are switched to no-store by ApiExceptionFilter.
 */
export function apiCacheHeaders() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const path = req.path;
    if (path !== '/api' && !path.startsWith('/api/')) return next();
    // JSON is data for the pages, not a search result. It stays crawlable (Google renders pages with it) but unindexed.
    res.setHeader('X-Robots-Tag', 'noindex');
    if (path.startsWith('/api/forms') || path === '/api/health') res.setHeader('Cache-Control', 'no-store');
    else res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    next();
  };
}
