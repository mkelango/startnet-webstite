// Build the StartNet Brand Book.
//   node build.mjs                 -> out/StartNet-Brand-Book-v1.0.pdf (+ out/book.html)
//   node build.mjs --png           -> also out/png/page-NN.png previews (960 px wide)
//   node build.mjs --only 03 --png -> only pages/03*.html, previews in out/preview-03/ (no PDF)
// Pages are <section class="page" ...> fragments in pages/*.html, concatenated in file-name order.
// Frame injection (unless data-frame="none"): header = data-section (left) + "StartNet Brand Book · V1.0" (right);
// footer = folio (left) + data-note (right). <x data-page-of="id"> is replaced with the page number of #id.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const require = createRequire('D:/Startet 2.0/tools/audit/package.json');
const puppeteer = require('puppeteer-core');

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const png = args.includes('--png');
const files = fs.readdirSync(path.join(here, 'pages')).filter((f) => f.endsWith('.html') && (!only || f.startsWith(only))).sort();
const body = files.map((f) => `<!-- ${f} -->\n` + fs.readFileSync(path.join(here, 'pages', f), 'utf8')).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>StartNet Brand Book v1.0</title>
<link rel="stylesheet" href="book.css"></head><body>${body}</body></html>`;
const htmlPath = path.join(here, only ? `out/book-${only}.html` : 'out/book.html');
// The HTML sits in out/, so relative URLs in book.css (../client/...) must resolve from the book root: use <base>.
fs.writeFileSync(htmlPath, html.replace('<head>', `<head><base href="${pathToFileURL(here + path.sep).href}">`));

const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'] });
const page = await b.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
page.on('requestfailed', (r) => errs.push('failed: ' + r.url()));
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await page.evaluate(async () => {
  await document.fonts.ready;
  const pages = [...document.querySelectorAll('section.page')];
  const num = new Map();
  pages.forEach((p, i) => { p.dataset.n = String(i + 1).padStart(2, '0'); if (p.id) num.set(p.id, p.dataset.n); });
  for (const p of pages) {
    if (p.dataset.frame === 'none') continue;
    const head = document.createElement('header');
    head.className = 'page__head';
    head.innerHTML = `<span>${p.dataset.section || ''}</span><span>StartNet Brand Book · V1.0</span>`;
    p.prepend(head);
    if (!p.querySelector('.page__foot')) {
      const foot = document.createElement('footer');
      foot.className = 'page__foot' + (p.dataset.footRule ? ' page__foot--rule' : '');
      foot.innerHTML = `<span class="folio">${p.dataset.n}</span><span>${p.dataset.note || ''}</span>`;
      p.append(foot);
    }
  }
  for (const el of document.querySelectorAll('[data-page-of]')) el.textContent = num.get(el.dataset.pageOf) || '??';
  for (const el of document.querySelectorAll('[data-folio]')) el.textContent = el.closest('section.page')?.dataset.n || '';
});
// Overflow check: content that spills past a page edge.
const overflow = await page.evaluate(() => [...document.querySelectorAll('section.page')].flatMap((p) => {
  const pr = p.getBoundingClientRect(); const bad = [];
  for (const el of p.querySelectorAll('.page__body > *, .page__body *')) {
    const r = el.getBoundingClientRect();
    if (r.width && (r.right > pr.right + 1 || r.bottom > pr.bottom - 0)) { bad.push(`${p.dataset.n}${p.id ? ' #' + p.id : ''}: <${el.tagName.toLowerCase()} class="${el.className}"> overflows`); break; }
  }
  const body = p.querySelector('.page__body'); const foot = p.querySelector('.page__foot');
  if (body && foot && body.scrollHeight > body.clientHeight + 2) bad.push(`${p.dataset.n}${p.id ? ' #' + p.id : ''}: body content taller than the page (${body.scrollHeight} > ${body.clientHeight})`);
  return bad;
}));
const count = await page.$$eval('section.page', (ps) => ps.length);
if (png) {
  const dir = path.join(here, only ? `out/preview-${only}` : 'out/png');
  fs.mkdirSync(dir, { recursive: true });
  const els = await page.$$('section.page');
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: path.join(dir, `page-${String(i + 1).padStart(2, '0')}.png`) });
  }
}
if (!only) {
  await page.emulateMediaType('print');
  await page.pdf({ path: path.join(here, 'out/StartNet-Brand-Book-v1.0.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
}
await b.close();
console.log(`${count} pages${only ? ' (preview ' + only + ')' : ''}`);
if (overflow.length) console.log('OVERFLOW:\n  ' + overflow.join('\n  '));
if (errs.length) console.log('ERRORS:\n  ' + [...new Set(errs)].join('\n  '));
