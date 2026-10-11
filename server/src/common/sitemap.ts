import { editionKeyOf, type RouteTable } from './routes';

/** Public origin used in sitemap.xml and robots.txt. PUBLIC_ORIGIN="https://startnet.in" (no trailing slash). */
export function publicOrigin(): string {
  const raw = (process.env.PUBLIC_ORIGIN ?? '').trim().replace(/\/+$/, '');
  return /^https?:\/\/[^/\s]+$/i.test(raw) ? raw : 'https://startnet.in';
}

/** Dated items from server/data, used for <lastmod>. */
export interface LastmodSource {
  programmes: { slug: string; [k: string]: unknown }[];
  events: { slug: string; [k: string]: unknown }[];
  stories: { slug: string; placeholder?: boolean; [k: string]: unknown }[];
  reports: { slug: string; url?: unknown; [k: string]: unknown }[];
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** YYYY-MM-DD for a past or present date; null for missing, invalid or future dates (lastmod is never ahead of now). */
function day(v: unknown, now: number): string | null {
  if (typeof v !== 'string' || !v) return null;
  const t = new Date(v).getTime();
  if (Number.isNaN(t) || t > now) return null;
  return new Date(t).toISOString().slice(0, 10);
}

const firstDay = (item: Record<string, unknown>, keys: string[], now: number) => {
  for (const k of keys) {
    const d = day(item[k], now);
    if (d) return d;
  }
  return null;
};

/**
 * sitemap.xml: every EN URL and its /ta mirror, each with xhtml:link alternates (en, ta, x-default → EN).
 * Placeholder stories (no consented story yet) are left out, as they are from search.
 */
export function buildSitemap(
  table: RouteTable,
  data: LastmodSource | null,
  origin = publicOrigin(),
  noindex: Set<string> = new Set(),
): string {
  const now = Date.now();
  const lastmod = new Map<string, string>();
  const skip = new Set<string>();
  if (data) {
    const keys = ['updatedAt', 'updated', 'lastmod', 'publishedAt'];
    for (const p of data.programmes) {
      const d = firstDay(p, keys, now);
      if (d) lastmod.set(`/programmes/${p.slug}`, d);
    }
    for (const e of data.events) {
      const d = firstDay(e, keys, now);
      if (d) lastmod.set(`/events/${e.slug}`, d);
      if (d && typeof e.series === 'string' && e.series) lastmod.set(`/events/${e.series}/${editionKeyOf(e as { slug: string; series: string })}`, d);
    }
    for (const s of data.stories) {
      const path = `/insights/stories/${s.slug}`;
      if (s.placeholder) skip.add(path);
      const d = firstDay(s, [...keys, 'date'], now);
      if (d) lastmod.set(path, d);
    }
    // A report dates its own page (reports.json url), or the hub when the url is an anchor on it (/insights/reports#slug).
    for (const r of data.reports) {
      const url = typeof r.url === 'string' ? r.url.split('#')[0] : '';
      const d = firstDay(r, [...keys, 'published', 'date'], now);
      if (!url || !d) continue;
      const prev = lastmod.get(url);
      if (!prev || d > prev) lastmod.set(url, d);
    }
  }

  // Pages the rendered app marks noindex (thin district pages, empty templates …; from the prerender manifest) are
  // left out, and so is a pair whose Tamil mirror is noindex (hreflang pairs must both be indexable).
  const paths = table.allPaths().filter((p) => !skip.has(p) && !noindex.has(p) && !noindex.has(p === '/' ? '/ta' : `/ta${p}`));
  const loc = (p: string) => xmlEscape(`${origin}${p === '/' ? '/' : p}`);
  const ta = (p: string) => (p === '/' ? '/ta' : `/ta${p}`);

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];
  for (const p of paths) {
    const alternates = [
      `    <xhtml:link rel="alternate" hreflang="en-IN" href="${loc(p)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="ta-IN" href="${loc(ta(p))}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc(p)}"/>`,
    ];
    const mod = lastmod.get(p);
    for (const url of [p, ta(p)]) {
      lines.push('  <url>', `    <loc>${loc(url)}</loc>`);
      if (mod) lines.push(`    <lastmod>${mod}</lastmod>`);
      lines.push(...alternates, '  </url>');
    }
  }
  lines.push('</urlset>', '');
  return lines.join('\n');
}

/**
 * Search engines and AI answer engines (GEO) are explicitly welcome on every public page. /api stays crawlable because
 * Google renders pages with it (the JSON itself carries X-Robots-Tag: noindex). Internal search results are not
 * crawled. Remove an agent from AI_AGENTS to opt it out (e.g. model-training crawlers); it then falls back to "*".
 */
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'DuckAssistBot', 'meta-externalagent', 'CCBot', 'cohere-ai',
];

export function buildRobots(origin = publicOrigin()): string {
  const rules = ['Allow: /', 'Disallow: /search?', 'Disallow: /ta/search?'];
  return [
    "# startnet.in: StartNet, Tamil Nadu's founder-making network",
    `# A plain-text summary for language models: ${origin}/llms.txt`,
    '',
    'User-agent: *',
    ...rules,
    '',
    '# AI search and answer engines',
    ...AI_AGENTS.map((a) => `User-agent: ${a}`),
    ...rules,
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
}
