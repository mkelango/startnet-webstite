// Generates the 1200×630 share images (Book 3 §5.7: "OG images are generated at build from a Pulli template")
// and a 512×512 logo for the Organization JSON-LD, into client/public/og/ and client/public/logo.png.
// Usage: node tools/seo/og-images.mjs   (needs Chrome or Edge installed; re-run only when the brand changes)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(new URL('../audit/package.json', import.meta.url));
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PUBLIC = path.join(ROOT, 'client/public');
const FONT = path.join(ROOT, 'client/src/styles/fonts/inter-latin-wght-normal.woff2');
const fontUrl = `data:font/woff2;base64,${fs.readFileSync(FONT).toString('base64')}`;

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

// Copy from client/src/data/brands.js and Book 2 (no new claims).
const CARDS = [
  { file: 'startnet', name: 'StartNet', accent: '#E5322D', line: 'Every talent, a founder', sub: "Tamil Nadu's founder-making network" },
  { file: 'research', name: 'StartNet Research', accent: '#9894FF', line: 'Scholar → Founder', sub: 'Labs, fellowship and lab-to-market for researchers in Tamil Nadu' },
  { file: 'vibe', name: 'StartNet Vibe', accent: '#F37C52', line: 'Student → Founder', sub: 'Vibathon, Vibe Academy and campus build nights for college students' },
  { file: 'connect', name: 'StartNet Connect', accent: '#5DB88F', line: 'Professional → Founder', sub: 'Sector communities, founder circles and Founder Switch' },
  { file: 'women', name: 'StartNet Women', accent: '#F0749E', line: 'Woman → Founder', sub: 'Circles, Rise Academy and investment readiness for women founders' },
  { file: 'x', name: 'StartNet X', accent: '#FE6F62', line: 'One founder profile', sub: 'From first event to first funding, on one platform' },
];

const page = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(${fontUrl}) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0E0E10;color:#F6F5F2;font-family:Inter,sans-serif;position:relative;overflow:hidden}
.grid{position:absolute;right:-40px;top:-40px;width:560px;height:710px;
  background-image:radial-gradient(circle,rgba(246,245,242,.22) 3px,transparent 3.5px);background-size:36px 36px}
.grid:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0E0E10 0%,rgba(14,14,16,0) 55%)}
.dot-big{position:absolute;right:150px;top:215px;width:120px;height:120px;border-radius:50%;background:${c.accent}}
.wrap{position:absolute;left:80px;top:72px;right:80px;bottom:72px;display:flex;flex-direction:column}
.brand{font-weight:700;font-size:34px;letter-spacing:-.01em}
.brand b{color:#E5322D}
.line{margin-top:auto;font-weight:800;font-size:${c.line.length > 22 ? 76 : 88}px;line-height:1.02;letter-spacing:-.035em;max-width:820px}
.line i{font-style:normal;color:#E5322D}
.sub{margin-top:26px;font-size:30px;line-height:1.3;color:rgba(246,245,242,.78);max-width:800px}
.url{margin-top:34px;font-size:24px;font-weight:600;color:${c.accent};letter-spacing:.02em}
</style></head><body><div class="grid"></div><div class="dot-big"></div>
<div class="wrap"><div class="brand">${c.name}<b>.</b></div>
<div class="line">${c.line}<i>.</i></div><div class="sub">${c.sub}</div><div class="url">startnet.in</div></div></body></html>`;

const logo = `<!doctype html><html><body style="margin:0;background:transparent">
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64"><style>@font-face{font-family:Inter;src:url(${fontUrl}) format('woff2');font-weight:100 900}</style>
<rect width="64" height="64" rx="14" fill="#0E0E10"/><text x="12" y="46" font-family="Inter" font-weight="700" font-size="40" fill="#F6F5F2">S</text><circle cx="46" cy="42" r="6" fill="#E5322D"/></svg></body></html>`;

fs.mkdirSync(path.join(PUBLIC, 'og'), { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
try {
  const tab = await browser.newPage();
  await tab.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  for (const c of CARDS) {
    await tab.setContent(page(c), { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    const out = path.join(PUBLIC, 'og', `${c.file}.png`);
    await tab.screenshot({ path: out, type: 'png' });
    console.log('wrote', path.relative(ROOT, out));
  }
  await tab.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  await tab.setContent(logo, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(PUBLIC, 'logo.png'), type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('wrote client/public/logo.png');
} finally {
  await browser.close();
}
