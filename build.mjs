/* ============================================================================
   StartNet — static build
   Renders every page template to real HTML on disk. No framework, no runtime
   hydration: the markup a visitor gets is the markup a crawler gets, which is
   what the SEO/GEO section of the strategy actually requires.

     node startnet/build.mjs
   ========================================================================== */

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { page } from './src/lib/layout.js';
import { site, properties } from './src/data/site.js';

import { homePage } from './src/pages/home.js';
import { aboutPage } from './src/pages/about.js';
import { portfolioPage } from './src/pages/portfolio.js';
import { newsroomPage } from './src/pages/newsroom.js';
import { partnersPage } from './src/pages/partners.js';
import { careersPage } from './src/pages/careers.js';
import { contactPage } from './src/pages/contact.js';
import { designSystemPage } from './src/pages/design-system.js';
import { privacyPage, termsPage } from './src/pages/legal.js';
import { notFoundPage } from './src/pages/not-found.js';

const ROOT = dirname(fileURLToPath(import.meta.url));

const PAGES = [
  homePage,
  aboutPage,
  portfolioPage,
  newsroomPage,
  partnersPage,
  careersPage,
  contactPage,
  designSystemPage,
  privacyPage,
  termsPage,
  notFoundPage,
];

const fileFor = (path) => (path === '/' ? 'index.html' : `${path.replace(/^\//, '')}.html`);

async function build() {
  const written = [];

  for (const make of PAGES) {
    const def = make();
    const html = page(def);
    const out = join(ROOT, fileFor(def.path));
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html, 'utf8');
    written.push({ path: def.path, out: fileFor(def.path), bytes: html.length });
  }

  /* --- sitemap ---------------------------------------------------------- */
  const today = new Date().toISOString().slice(0, 10);
  const urls = written
    .filter((w) => w.path !== '/404')
    .map(
      (w) => `  <url>
    <loc>${site.origin}${w.path === '/' ? '/' : w.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${w.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${w.path === '/' ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('\n');
  await writeFile(
    join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    'utf8'
  );

  /* --- robots ----------------------------------------------------------- */
  await writeFile(
    join(ROOT, 'robots.txt'),
    `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`,
    'utf8'
  );

  /* --- machine-readable portfolio ---------------------------------------
     One canonical description per property, served as JSON. Useful for the
     sub-brand sites and for anything that needs the same wording we publish. */
  await writeFile(
    join(ROOT, 'portfolio.json'),
    JSON.stringify(
      {
        organisation: site.name,
        url: site.origin,
        updated: today,
        properties: properties.map((p) => ({
          id: p.id,
          name: p.name,
          url: p.href,
          kind: p.kind,
          description: p.line,
        })),
      },
      null,
      2
    ),
    'utf8'
  );

  const total = written.reduce((n, w) => n + w.bytes, 0);
  console.log(`StartNet build — ${written.length} pages, ${(total / 1024).toFixed(1)} KB`);
  written.forEach((w) =>
    console.log(`  ${w.out.padEnd(22)} ${(w.bytes / 1024).toFixed(1)} KB   ${w.path}`)
  );
  console.log('  sitemap.xml, robots.txt, portfolio.json');
}

build().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
