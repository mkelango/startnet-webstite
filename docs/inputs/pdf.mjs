import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const require = createRequire('D:/Startet 2.0/tools/audit/package.json'); const puppeteer = require('puppeteer-core');
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.goto(pathToFileURL('D:/Startet 2.0/docs/inputs/StartNet_Inputs_Needed_v2.html').href, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: 'D:/Startet 2.0/docs/StartNet_Inputs_Needed_v2.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true,
  displayHeaderFooter: true, headerTemplate: '<span></span>',
  footerTemplate: '<div style="font-size:7px;width:100%;padding:0 15mm;color:#6F7E80;display:flex;justify-content:space-between;font-family:sans-serif"><span>StartNet · Inputs needed · v2</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>' });
await b.close();
