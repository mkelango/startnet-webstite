// Prints what search / answer engines see in <head> for each path, after the app has rendered.
// Usage: node tools/seo/check-head.mjs [--base http://localhost:5173] /vibe /ta/vibe /events …
// Flags: title > 60 chars, description outside 70–160 chars, missing canonical, missing h1, JSON-LD parse errors.
import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(new URL('../audit/package.json', import.meta.url));
const puppeteer = require('puppeteer-core');

const args = process.argv.slice(2);
let base = 'http://localhost:5173';
const paths = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--base') base = args[++i];
  else paths.push(args[i]);
}
if (!paths.length) paths.push('/');

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const p of paths) {
    await page.goto(base.replace(/\/$/, '') + p, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 400));
    const info = await page.evaluate(() => {
      const meta = (sel) => document.head.querySelector(sel)?.getAttribute('content') || '';
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          const j = JSON.parse(s.textContent);
          return [].concat(j).map((x) => x['@type']).join('+');
        } catch {
          return 'PARSE_ERROR';
        }
      });
      return {
        title: document.title,
        description: meta('meta[name="description"]'),
        robots: meta('meta[name="robots"]'),
        canonical: document.head.querySelector('link[rel="canonical"]')?.href || '',
        hreflang: [...document.head.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => l.hreflang).join(','),
        ogImage: meta('meta[property="og:image"]'),
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()).join(' | '),
        ld,
      };
    });
    const warn = [];
    if (info.title.length > 60) warn.push(`title ${info.title.length} chars`);
    if (info.description.length < 70 || info.description.length > 160) warn.push(`description ${info.description.length} chars`);
    if (!info.canonical) warn.push('no canonical');
    if (!info.h1) warn.push('no h1');
    if (info.ld.includes('PARSE_ERROR')) warn.push('JSON-LD parse error');
    console.log(`\n${p}${warn.length ? '   ⚠ ' + warn.join('; ') : ''}`);
    console.log(`  title (${info.title.length}): ${info.title}`);
    console.log(`  desc  (${info.description.length}): ${info.description}`);
    console.log(`  robots: ${info.robots} | canonical: ${info.canonical} | hreflang: ${info.hreflang}`);
    console.log(`  h1: ${info.h1}`);
    console.log(`  og:image: ${info.ogImage}`);
    console.log(`  JSON-LD: ${info.ld.join(', ') || '(none)'}`);
  }
} finally {
  await browser.close();
}
