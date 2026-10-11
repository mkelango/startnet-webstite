// Prerender: a crawlable HTML snapshot of every indexable page (EN + /ta), plus /llms.txt and /llms-full.txt.
// Book 1 §9.1: "Crawlable by default. Server-rendered HTML". Search and answer-engine crawlers that do not run
// JavaScript (GPTBot, ClaudeBot, PerplexityBot, most link-preview bots) otherwise see an empty <div id="root">.
//
// How it works
// 1. Starts the built server (server/dist) on a spare port with PRERENDER_BYPASS=1, so it serves the plain app shell.
// 2. Reads that server's /sitemap.xml (the indexable EN + TA URLs) and renders each one in headless Chrome
//    (reduced motion, so every reveal is at its final state), waiting for the data and the <h1>.
// 3. Saves the page as client/dist/prerender/<path>.html: the rendered <head> (title, description, canonical,
//    hreflang, og/twitter, JSON-LD) and the page markup inside <div id="sn-prerender">, next to an empty #root.
//    The server (server/src/common/spa.ts) sends the snapshot; main.jsx renders the live app into the hidden #root
//    and swaps it in once it has the same content, so visitors never see a blank or a loading flash.
// 4. Writes manifest.json with the hash of the index.html it was rendered against. The server ignores snapshots
//    whose hash does not match the current build, and `vite build` empties client/dist, so a stale snapshot can
//    never reference deleted asset files.
// 5. Writes llms.txt / llms-full.txt from the rendered titles, descriptions and main text, and prints an SEO lint
//    (title / description length, duplicates, missing h1) to tools/seo/out/seo-report.json.
//
// Usage: node tools/seo/prerender.mjs [--concurrency 6] [--only /vibe,/ta/vibe]
// Needs Chrome or Edge. If neither is installed it exits 0 with a warning (the site still works as a SPA).
import { createRequire } from 'module';
import { spawn } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(new URL('../audit/package.json', import.meta.url));
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'client/dist');
const OUT = path.join(DIST, 'prerender');
const SERVER_MAIN = path.join(ROOT, 'server/dist/main.js');
const ORIGIN = String(process.env.PUBLIC_ORIGIN || 'https://startnet.in').replace(/\/+$/, '');

const argv = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : dflt;
};
const CONCURRENCY = Math.max(1, Number(opt('concurrency', 6)) || 6);
const ONLY = opt('only', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && fs.existsSync(p));

function fail(msg) {
  console.warn(`[prerender] skipped: ${msg}`);
  process.exit(0);
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) fail('client/dist/index.html is missing (run the client build first)');
if (!fs.existsSync(SERVER_MAIN)) fail('server/dist/main.js is missing (run the server build first)');
if (!CHROME) fail('no Chrome / Chromium / Edge found (set CHROME_PATH)');
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch {
  fail('puppeteer-core is not installed (npm install --prefix tools/audit)');
}

const shellHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const shellHash = crypto.createHash('sha256').update(shellHtml).digest('hex').slice(0, 16);

const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.unref();
    s.on('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

async function startServer(port) {
  const child = spawn(process.execPath, [SERVER_MAIN], {
    cwd: path.join(ROOT, 'server'),
    env: { ...process.env, PORT: String(port), NODE_ENV: 'production', PRERENDER_BYPASS: '1', PUBLIC_ORIGIN: ORIGIN },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (d) => (log += d));
  child.stderr.on('data', (d) => (log += d));
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 120; i++) {
    if (child.exitCode != null) throw new Error(`server exited early:\n${log}`);
    try {
      const r = await fetch(`${base}/api/health`);
      if (r.ok) return { child, base };
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  child.kill();
  throw new Error(`server did not start on ${port}:\n${log}`);
}

/** Snapshot file for a path: "/" → index.html, "/ta" → ta.html, "/vibe/academy" → vibe/academy.html. */
const fileFor = (p) => path.join(OUT, p === '/' ? 'index.html' : `${p.replace(/^\/+/, '')}.html`);

async function renderOne(page, base, p) {
  const res = await page.goto(base + p, { waitUntil: 'networkidle0', timeout: 60000 });
  const status = res ? res.status() : 0;
  if (status !== 200 && status !== 304) return { path: p, status, skipped: true };
  await page.waitForSelector('main h1, h1', { timeout: 15000 }).catch(() => {});
  // Let effects (Seo, JSON-LD) and late data settle.
  // Scroll through the page so sections that load on view (Home's lower half, lazy lists) are in the snapshot too:
  // structured data such as FAQPage must match text that is on the page.
  await page.evaluate(async () => {
    const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
    for (let i = 0; i < 80; i++) {
      const before = document.documentElement.scrollHeight;
      window.scrollBy(0, step);
      await new Promise((r) => setTimeout(r, 120));
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 && document.documentElement.scrollHeight === before) break;
    }
    window.scrollTo(0, 0);
  });
  await page.waitForNetworkIdle({ idleTime: 300, timeout: 15000 }).catch(() => {});
  // Deferred sections and route loaders hold a placeholder until they have rendered (Home: .home-rest-pending).
  await page
    .waitForFunction(() => !document.querySelector('.home-rest-pending, .page-loader, [aria-busy="true"]'), { timeout: 12000, polling: 100 })
    .catch(() => {});
  // Then wait for the page height to settle (late lists, images with reserved space, second-level lazy sections).
  await page
    .evaluate(async () => {
      let last = -1;
      for (let i = 0; i < 20; i++) {
        const h = document.documentElement.scrollHeight;
        if (h === last) break;
        last = h;
        window.scrollTo(0, h);
        await new Promise((r) => setTimeout(r, 250));
      }
      window.scrollTo(0, 0);
    })
    .catch(() => {});
  await page.waitForNetworkIdle({ idleTime: 300, timeout: 10000 }).catch(() => {});
  // (A timer, not requestAnimationFrame: frames can stall in busy background tabs.)
  await new Promise((r) => setTimeout(r, 400));

  return page.evaluate(() => {
    const doc = document.documentElement.cloneNode(true);
    const body = doc.querySelector('body');
    const root = body.querySelector('#root');
    // Runtime-only UI that must not be baked in: consent banner, open overlays, toasts, skeletons.
    root
      .querySelectorAll('.cookie-banner, [data-no-prerender], .page-loader, [role="dialog"]')
      .forEach((n) => n.remove());
    const pre = document.createElement('div');
    pre.id = 'sn-prerender';
    while (root.firstChild) pre.appendChild(root.firstChild);
    // Only the app root and the snapshot stay in <body> (portals are closed at rest; scripts live in <head>).
    [...body.children].forEach((n) => {
      if (n !== root) n.remove();
    });
    root.after(pre);
    // Per-visit state the live app sets for itself.
    doc.removeAttribute('style');
    doc.removeAttribute('data-motion');
    doc.removeAttribute('data-pin-active');
    // Inline styles from motion libraries that would hide content in the static copy.
    pre.querySelectorAll('[style]').forEach((el) => {
      const s = el.getAttribute('style');
      if (/opacity:\s*0(?![.\d])|visibility:\s*hidden/.test(s)) el.setAttribute('style', s.replace(/opacity:\s*0(?![.\d]);?/g, '').replace(/visibility:\s*hidden;?/g, ''));
    });
    const head = doc.querySelector('head');
    const meta = (sel) => head.querySelector(sel)?.getAttribute('content') || '';
    const main = document.querySelector('main') || document.body;
    const text = (main.innerText || '').replace(/\n{3,}/g, '\n\n').trim();
    return {
      html: '<!doctype html>\n' + doc.outerHTML,
      title: document.title,
      description: meta('meta[name="description"]'),
      robots: meta('meta[name="robots"]'),
      canonical: head.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      lang: document.documentElement.lang,
      h1: [...document.querySelectorAll('main h1, h1')].map((h) => h.textContent.trim()).filter(Boolean),
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          return [].concat(JSON.parse(s.textContent)).map((x) => x['@type'] || (x['@graph'] ? 'Graph' : '?')).join('+');
        } catch {
          return 'PARSE_ERROR';
        }
      }),
      text,
    };
  });
}

function sitemapPaths(xml) {
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const set = new Set();
  for (const loc of locs) {
    const u = new URL(loc);
    set.add(u.pathname.replace(/\/+$/, '') || '/');
  }
  // The sitemap lists EN locs with TA alternates; make sure every TA mirror is rendered too.
  for (const p of [...set]) if (!/^\/ta(\/|$)/.test(p)) set.add(p === '/' ? '/ta' : `/ta${p}`);
  return [...set].sort();
}

// ---------- llms.txt ----------
const SECTION_ORDER = [
  ['/', 'StartNet'],
  ['/about', 'About StartNet'],
  ['/brands', 'Brands'],
  ['/research', 'StartNet Research (scholars and faculty → founders)'],
  ['/vibe', 'StartNet Vibe (college students → founders)'],
  ['/connect', 'StartNet Connect (professionals → founders)'],
  ['/women', 'StartNet Women (women founders)'],
  ['/programmes', 'Programmes'],
  ['/events', 'Events'],
  ['/districts', 'Districts'],
  ['/insights', 'Insights and data'],
  ['/startnet-x', 'StartNet X platform'],
  ['/partner', 'Partner with StartNet'],
  ['/media', 'Media'],
  ['/careers', 'Careers'],
  ['/contact', 'Contact'],
  ['/legal', 'Legal'],
];
const sectionOf = (p) => {
  if (p === '/' || p === '/join') return '/';
  const hit = SECTION_ORDER.filter(([s]) => s !== '/' && (p === s || p.startsWith(s + '/'))).sort((a, b) => b[0].length - a[0].length)[0];
  return hit ? hit[0] : '/';
};
const stripBrand = (t) => t.replace(/\s*·\s*StartNet$/, '');
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

function buildLlms(pages) {
  const en = pages.filter((r) => !/^\/ta(\/|$)/.test(r.path) && !/noindex/.test(r.robots));
  const home = en.find((r) => r.path === '/');
  const lines = [
    '# StartNet',
    '',
    `> ${clean(home?.description) || "StartNet is Tamil Nadu's founder-making network. Every talent, a founder."}`,
    '',
    "StartNet (startnet.in) is Tamil Nadu's founder-making network, headquartered in Salem. Its promise is \"Every talent, a founder.\" It goes to campuses, labs, workplaces and districts across Tamil Nadu and helps people with the talent to build turn it into companies. It works through four talent brands and one platform:",
    '',
    '- **StartNet Research**: for scholars, faculty and research labs moving from scholar to founder (labs, fellowship, Lab-to-Market Summit, institution partner programme).',
    '- **StartNet Vibe**: for college students moving from student to founder (Vibathon AI build hackathon, Vibe Academy, campus build nights, Launchpad, Vibe Clubs).',
    '- **StartNet Connect**: for working professionals moving from professional to founder, and startups moving to scale (sector Connects such as GenAI, SaaS and D2C, Founder Circles, Founder Switch, Scale Connect, Angels).',
    '- **StartNet Women**: for women founders (district Circles, Rise Academy, HerCapital investment readiness, Women Founders Summit).',
    '- **StartNet X**: one founder profile for every step, from first event to first funding.',
    '',
    'Figures on the site carry a confidence tag (A: system record, B: verified external source, C: planning target or estimate), an as-at date and a source; see the evidence standard. Values marked as placeholders have not been published yet and should not be quoted.',
    '',
    `Every page is available in English and in Tamil (Tamil mirror under ${ORIGIN}/ta). Contact: hello@startnet.in.`,
    '',
  ];
  const groups = new Map(SECTION_ORDER.map(([s]) => [s, []]));
  for (const r of en) groups.get(sectionOf(r.path))?.push(r);
  for (const [s, label] of SECTION_ORDER) {
    const list = groups.get(s);
    if (!list?.length) continue;
    lines.push(`## ${label}`, '');
    for (const r of list.sort((a, b) => a.path.length - b.path.length || a.path.localeCompare(b.path))) {
      lines.push(`- [${stripBrand(clean(r.title))}](${ORIGIN}${r.path === '/' ? '/' : r.path}): ${clean(r.description)}`);
    }
    lines.push('');
  }
  lines.push('## Optional', '', `- [Full text of the key pages](${ORIGIN}/llms-full.txt)`, `- [XML sitemap](${ORIGIN}/sitemap.xml)`, `- [Tamil home page](${ORIGIN}/ta)`, '');

  const KEY = /^\/(about(\/[^/]+)?|brands|research|vibe|vibe\/vibathon|connect|women|programmes|events|startnet-x|startnet-x\/pricing|partner|insights|insights\/founder-ledger|about\/evidence-standard|contact)?$/;
  const full = ['# StartNet: full text of key pages', '', `Source: ${ORIGIN}. Generated from the published pages. Text in [brackets] marks values StartNet has not published yet.`, ''];
  for (const r of en.filter((x) => KEY.test(x.path))) {
    full.push(`## ${stripBrand(clean(r.title))}`, '', `URL: ${ORIGIN}${r.path === '/' ? '/' : r.path}`, '', clean(r.description), '', r.text.slice(0, 12000), '', '---', '');
  }
  return { llms: lines.join('\n'), full: full.join('\n') };
}

// ---------- lint ----------
function lint(pages) {
  const issues = [];
  const byTitle = new Map();
  const byDesc = new Map();
  for (const r of pages) {
    if (/noindex/.test(r.robots)) continue;
    if (r.title.length > 60) issues.push({ path: r.path, issue: `title ${r.title.length} chars` });
    if (r.description.length < 70 || r.description.length > 160) issues.push({ path: r.path, issue: `description ${r.description.length} chars` });
    if (r.h1.length !== 1) issues.push({ path: r.path, issue: `${r.h1.length} h1` });
    if (r.ld.includes('PARSE_ERROR')) issues.push({ path: r.path, issue: 'JSON-LD parse error' });
    if (!r.canonical) issues.push({ path: r.path, issue: 'no canonical' });
    byTitle.set(r.title, [...(byTitle.get(r.title) || []), r.path]);
    byDesc.set(r.description, [...(byDesc.get(r.description) || []), r.path]);
  }
  const dupTitles = [...byTitle].filter(([, v]) => v.length > 1).map(([title, paths]) => ({ title, paths }));
  const dupDescs = [...byDesc].filter(([, v]) => v.length > 1).map(([description, paths]) => ({ description, paths }));
  return { issues, dupTitles, dupDescs };
}

// ---------- main ----------
const port = await freePort();
const { child, base } = await startServer(port);
let browser;
try {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  let paths = sitemapPaths(xml);
  if (ONLY.length) paths = paths.filter((p) => ONLY.includes(p));
  console.log(`[prerender] ${paths.length} pages, ${CONCURRENCY} at a time, against ${base}`);
  if (!ONLY.length) fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    protocolTimeout: 60000,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
  });
  const results = [];
  const queue = [...paths];
  const t0 = Date.now();
  let done = 0;
  async function worker(q = queue) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setCacheEnabled(false);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setUserAgent('Mozilla/5.0 (compatible; StartNetPrerender/1.0; +https://startnet.in)');
    if (process.env.PRERENDER_DEBUG) {
      page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && console.log(`[page ${page.url()}] ${m.type()}: ${m.text()}`));
      page.on('pageerror', (e) => console.log(`[page ${page.url()}] pageerror: ${e}`));
      page.on('requestfailed', (r) => console.log(`[page ${page.url()}] requestfailed: ${r.url()} ${r.failure()?.errorText}`));
    }
    while (q.length) {
      const p = q.shift();
      let r;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          r = await renderOne(page, base, p);
          break;
        } catch (err) {
          r = { path: p, error: String(err && err.message ? err.message : err) };
        }
      }
      if (r.html) {
        const file = fileFor(p);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, r.html);
        delete r.html;
      }
      r.path = p;
      results.push(r);
      done++;
      if (done % 25 === 0 || done === paths.length) console.log(`[prerender] ${done}/${paths.length} (${Math.round((Date.now() - t0) / 1000)}s)`);
    }
    await page.close();
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, paths.length) }, () => worker()));
  // Anything that failed under load gets one more try on its own.
  const retry = results.filter((r) => r.error).map((r) => r.path);
  if (retry.length) {
    console.log(`[prerender] retrying ${retry.length} one at a time: ${retry.join(', ')}`);
    for (const p of retry) results.splice(results.findIndex((r) => r.path === p), 1);
    done -= retry.length;
    await worker([...retry]);
  }

  const ok = results.filter((r) => !r.error && !r.skipped);
  const bad = results.filter((r) => r.error || r.skipped);
  const noindex = ok.filter((r) => /noindex/i.test(r.robots)).map((r) => r.path).sort();
  if (!ONLY.length) {
    fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ shellHash, generatedAt: new Date().toISOString(), origin: ORIGIN, pages: ok.length, noindex }, null, 2));
    const { llms, full } = buildLlms(ok);
    fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);
    fs.writeFileSync(path.join(DIST, 'llms-full.txt'), full);
  } else if (fs.existsSync(path.join(OUT, 'manifest.json'))) {
    const m = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));
    const keep = (m.noindex || []).filter((p) => !ONLY.includes(p));
    fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ ...m, shellHash, noindex: [...keep, ...noindex].sort() }, null, 2));
  } else {
    fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ shellHash, generatedAt: new Date().toISOString(), origin: ORIGIN, pages: ok.length, noindex }, null, 2));
  }

  const report = { generatedAt: new Date().toISOString(), rendered: ok.length, failed: bad, ...lint(ok), pages: ok.map(({ text, ...r }) => ({ ...r, words: text.split(/\s+/).filter(Boolean).length })) };
  fs.mkdirSync(path.join(ROOT, 'tools/seo/out'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'tools/seo/out/seo-report.json'), JSON.stringify(report, null, 2));
  console.log(`[prerender] rendered ${ok.length}, failed/skipped ${bad.length} in ${Math.round((Date.now() - t0) / 1000)}s`);
  console.log(`[prerender] lint: ${report.issues.length} issues, ${report.dupTitles.length} duplicate titles, ${report.dupDescs.length} duplicate descriptions (tools/seo/out/seo-report.json)`);
  if (bad.length) console.log('[prerender] not rendered:', bad.slice(0, 20).map((b) => `${b.path} (${b.error || b.status})`).join(', '));
} finally {
  if (browser) await browser.close().catch(() => {});
  child.kill();
}
