// Screenshots of chosen Home sections from the running Vite dev server (headless Chrome via puppeteer-core).
// Usage: node tools/audit/shot-home-sections.mjs <outDir> [width] [path] [ids or CSS selectors...]
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const [outDir = '.', widthArg = '1440', route = '/', ...ids] = process.argv.slice(2);
const width = Number(widthArg);
const sections = ids.length ? ids : ['where-things-stand', 'why-tamil-nadu'];
const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => p && fs.existsSync(p));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
// Reduced motion: scroll-linked reveals and count-ups render at their end state, so shots show the settled page.
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(`http://localhost:5173${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('main h1', { timeout: 60000 });
await new Promise((r) => setTimeout(r, 3000));
// Dismiss the consent banner if present, then walk the page so lazy sections, reveals and count-ups settle.
await page.evaluate(async () => {
  const reject = [...document.querySelectorAll('button')].find((b) => /reject|நிராகரி/i.test(b.textContent || ''));
  reject?.click();
  document.querySelectorAll('.home-lazy').forEach((s) => { s.style.contentVisibility = 'visible'; });
  for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
});
await new Promise((r) => setTimeout(r, 2500));
for (const id of sections) {
  const sel = /^[.#[]/.test(id) ? id : `#${id}`;
  const el = await page.$(sel);
  if (!el) { console.log('missing', id); continue; }
  await el.evaluate((n) => n.scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 1800));
  const file = path.join(outDir, `${id}-${width}${route.replace(/\W+/g, '-')}.png`);
  await el.screenshot({ path: file });
  console.log(file);
}
await browser.close();
