// StartNet site audit crawler (puppeteer-core + installed Chrome).
// Usage:
//   node crawl.mjs links                 -> BFS every internal link from "/" (+ /ta), report broken links (404 page rendered), console/page errors
//   node crawl.mjs layout [vp,...]       -> for every discovered route, at each viewport: overflow, tiny tap targets, invisible text, h1 count, errors
//   node crawl.mjs page <path> [vp]      -> deep single-page dump (JSON) incl. screenshot at out/shots/
// Env: BASE (default http://localhost:4000), MAX (max pages, default 400), ROUTES (path to JSON array to skip BFS)
// Output: out/links.json, out/layout-<vp>.json, out/page-*.json
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const IS_CLI = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

const BASE = process.env.BASE || 'http://localhost:4000';
const MAX = +(process.env.MAX || 400);
const OUT = path.resolve('out');
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));

export const VIEWPORTS = {
  'mobile-sm': { width: 320, height: 640, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  mobile: { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  'mobile-lg': { width: 430, height: 932, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  tablet: { width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  'tablet-land': { width: 1024, height: 768, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  laptop: { width: 1280, height: 800 },
  desktop: { width: 1440, height: 900 },
};

export async function launch() {
  return puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'] });
}

export async function openPage(browser, vpName = 'desktop') {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS[vpName]);
  if (VIEWPORTS[vpName].isMobile) await page.setUserAgent('Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36');
  // Skip the consent banner so it does not cover content (it is audited separately)
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('sn-consent', JSON.stringify({ version: '2026-10', essential: true, analytics: false, marketing: false, ts: Date.now() })); } catch {} });
  const log = { console: [], pageErrors: [], failed: [] };
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.console.push(`${m.type()}: ${m.text()}`.slice(0, 300)); });
  page.on('pageerror', (e) => log.pageErrors.push(String(e.message || e).slice(0, 300)));
  page.on('requestfailed', (r) => log.failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) log.failed.push(`${r.status()} ${r.url()}`); });
  return { page, log };
}

export async function visit(page, p) {
  const res = await page.goto(BASE + p, { waitUntil: 'networkidle0', timeout: 30000 }).catch((e) => ({ err: e.message }));
  // Scroll through to trigger in-view reveals / lazy content, then back to top
  await page.evaluate(async () => {
    const step = Math.max(300, innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 900));
  }).catch(() => {});
  return res;
}

export async function inspect(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const sel = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.'); return s; };
    const overflow = [];
    if (document.documentElement.scrollWidth > vw + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && r.width > 0 && vis(el)) {
          // skip descendants of horizontal scrollers
          let p = el.parentElement, inScroller = false;
          while (p) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') { inScroller = true; break; } p = p.parentElement; }
          if (!inScroller) overflow.push(`${sel(el)} right=${Math.round(r.right)}`);
        }
        if (overflow.length > 12) break;
      }
    }
    const small = [];
    for (const el of document.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [role="tab"]')) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p, li, dd, td');
      if (!inline && (r.height < 32 || r.width < 32)) small.push(`${sel(el)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
    const invisible = [];
    for (const el of document.querySelectorAll('h1,h2,h3,p,li,a,button,span')) {
      if (!el.textContent.trim() || el.children.length > 3) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width && r.height && (+cs.opacity < 0.05) && !el.closest('[aria-hidden="true"], .visually-hidden, [hidden]')) invisible.push(`${sel(el)} "${el.textContent.trim().slice(0, 40)}"`);
      if (invisible.length > 10) break;
    }
    const clipped = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,button,a.btn, .btn')) {
      if (!vis(el)) continue;
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') clipped.push(`${sel(el)} "${el.textContent.trim().slice(0, 40)}"`);
    }
    const imgsNoAlt = [...document.querySelectorAll('img:not([alt])')].length;
    const btnNoName = [...document.querySelectorAll('button, a[href]')].filter((b) => vis(b) && !(b.textContent.trim() || b.getAttribute('aria-label') || b.getAttribute('title') || b.querySelector('[aria-label], img[alt]'))).map(sel).slice(0, 10);
    const links = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 50) }));
    const emptyHrefs = links.filter((l) => !l.href || l.href === '#' || l.href.startsWith('javascript')).map((l) => l.text);
    return {
      title: document.title,
      notFound: !!document.getElementById('notfound-title'),
      h1: document.querySelectorAll('h1').length,
      scrollWidth: document.documentElement.scrollWidth, vw,
      height: document.body.scrollHeight,
      overflow, small: small.slice(0, 25), smallCount: small.length, invisible, clipped: clipped.slice(0, 15), imgsNoAlt, btnNoName, emptyHrefs, links,
    };
  });
}

function norm(href, from) {
  if (!href) return null;
  if (/^(mailto:|tel:|javascript:|#)/.test(href)) return null;
  let u;
  try { u = new URL(href, BASE + from); } catch { return null; }
  if (u.origin !== new URL(BASE).origin) return null;
  if (u.pathname.startsWith('/api/') || /\.(pdf|csv|ics|svg|png|jpg|xml)$/.test(u.pathname)) return null;
  return u.pathname + (u.search || '');
}

async function bfs(browser) {
  if (process.env.ROUTES) return JSON.parse(fs.readFileSync(process.env.ROUTES, 'utf8')).map((p) => ({ path: p, from: [] }));
  const { page, log } = await openPage(browser, 'desktop');
  const seen = new Map(); // path -> {from:Set}
  const queue = ['/', '/ta', '/sitemap'];
  queue.forEach((p) => seen.set(p, new Set(['(seed)'])));
  const results = [];
  while (queue.length && results.length < MAX) {
    const p = queue.shift();
    log.console.length = 0; log.pageErrors.length = 0; log.failed.length = 0;
    const res = await page.goto(BASE + p, { waitUntil: 'networkidle0', timeout: 30000 }).catch((e) => ({ err: e.message }));
    await new Promise((r) => setTimeout(r, 250));
    const info = await inspect(page).catch((e) => ({ error: e.message, links: [] }));
    results.push({ path: p, from: [...seen.get(p)].slice(0, 5), notFound: info.notFound, title: info.title, h1: info.h1, err: res?.err, console: [...log.console], pageErrors: [...log.pageErrors], failed: [...log.failed], emptyHrefs: info.emptyHrefs, btnNoName: info.btnNoName, externalLinks: (info.links || []).filter((l) => /^https?:/.test(l.href) && !l.href.startsWith(BASE)).map((l) => l.href) });
    for (const l of info.links || []) {
      const n = norm(l.href, p);
      if (!n) continue;
      if (!seen.has(n)) { seen.set(n, new Set()); queue.push(n); }
      seen.get(n).add(`${p} ["${l.text}"]`);
    }
    if (results.length % 25 === 0) console.error(`crawled ${results.length}, queue ${queue.length}`);
  }
  // re-attach full 'from' lists
  results.forEach((r) => { r.from = [...(seen.get(r.path) || [])].slice(0, 8); });
  await page.close();
  return results;
}

const [, , mode = 'links', arg1, arg2] = process.argv;
const browser = IS_CLI ? await launch() : null;
if (IS_CLI) try {
  if (mode === 'links') {
    const results = await bfs(browser);
    const broken = results.filter((r) => r.notFound && !r.path.includes('this-page-does-not-exist'));
    const errs = results.filter((r) => r.pageErrors.length || r.console.length || r.failed.length || r.err);
    const ext = [...new Set(results.flatMap((r) => r.externalLinks))].sort();
    fs.writeFileSync(path.join(OUT, 'links.json'), JSON.stringify({ base: BASE, pages: results.length, broken, withErrors: errs, h1Problems: results.filter((r) => r.h1 !== 1).map((r) => `${r.path} h1=${r.h1}`), emptyHrefs: results.filter((r) => r.emptyHrefs?.length).map((r) => ({ path: r.path, emptyHrefs: r.emptyHrefs })), externalLinks: ext, routes: results.map((r) => r.path) }, null, 2));
    fs.writeFileSync(path.join(OUT, 'routes.json'), JSON.stringify(results.map((r) => r.path), null, 0));
    console.log(`pages=${results.length} broken=${broken.length} withErrors=${errs.length} externalUnique=${ext.length} -> out/links.json, out/routes.json`);
  } else if (mode === 'layout') {
    const vps = (arg1 || 'mobile-sm,mobile,tablet,desktop').split(',');
    const routes = JSON.parse(fs.readFileSync(process.env.ROUTES || path.join(OUT, 'routes.json'), 'utf8')).filter((p) => !p.includes('?'));
    for (const vp of vps) {
      const { page, log } = await openPage(browser, vp);
      const rows = [];
      for (const p of routes) {
        log.console.length = 0; log.pageErrors.length = 0; log.failed.length = 0;
        await visit(page, p);
        const i = await inspect(page).catch((e) => ({ error: e.message }));
        delete i.links;
        const issues = (i.overflow?.length || 0) + (i.invisible?.length || 0) + (i.clipped?.length || 0) + (i.h1 !== 1 ? 1 : 0) + log.pageErrors.length;
        rows.push({ path: p, ...i, console: [...log.console], pageErrors: [...log.pageErrors], failed: [...log.failed], issues });
      }
      fs.writeFileSync(path.join(OUT, `layout-${vp}.json`), JSON.stringify(rows.filter((r) => r.issues || r.smallCount || r.console.length || r.failed.length), null, 2));
      console.log(`${vp}: ${rows.length} pages, ${rows.filter((r) => r.overflow?.length).length} with horizontal overflow, ${rows.filter((r) => r.smallCount).length} with small tap targets, ${rows.filter((r) => r.invisible?.length).length} with invisible text -> out/layout-${vp}.json`);
      await page.close();
    }
  } else if (mode === 'page') {
    const vp = arg2 || 'mobile';
    const { page, log } = await openPage(browser, vp);
    await visit(page, arg1);
    const i = await inspect(page);
    const file = `${vp}-${arg1.replace(/[^a-z0-9]+/gi, '_') || 'home'}`;
    await page.screenshot({ path: path.join(OUT, 'shots', file + '.png'), fullPage: true });
    fs.writeFileSync(path.join(OUT, `page-${file}.json`), JSON.stringify({ ...i, ...log }, null, 2));
    console.log(`screenshot out/shots/${file}.png, data out/page-${file}.json`);
  }
} finally {
  await browser.close();
}
