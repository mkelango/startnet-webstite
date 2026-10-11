// Downloads the approved stock photos in photos/stock/selection.json (Unsplash License) into
// photos/originals/pool/<theme>/<n>.jpg, each with a sidecar .json (alt text, credit, warm grade, focal point).
// Run once; existing files are skipped. Then: npm run photos && npm run build.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const list = JSON.parse(fs.readFileSync(path.join(ROOT, 'photos/stock/selection.json'), 'utf8'));
const counters = {};
let got = 0;
let bytes = 0;
for (const [theme, id, pid, by, desc] of list) {
  counters[theme] = (counters[theme] || 0) + 1;
  const n = String(counters[theme]).padStart(2, '0');
  const dir = path.join(ROOT, 'photos/originals/pool', theme);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${n}.jpg`);
  if (!fs.existsSync(file)) {
    const res = await fetch(`https://images.unsplash.com/${pid}?w=2400&q=85&fm=jpg`);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !/^image\/jpeg/.test(type)) {
      console.warn(`[stock] skip ${theme}/${n}: HTTP ${res.status} ${type}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    // JPEG magic number check: never keep anything that is not an image.
    if (buf[0] !== 0xff || buf[1] !== 0xd8) {
      console.warn(`[stock] skip ${theme}/${n}: not a JPEG`);
      continue;
    }
    fs.writeFileSync(file, buf);
    bytes += buf.length;
    got++;
  }
  fs.writeFileSync(
    file.replace(/\.jpg$/, '.json'),
    JSON.stringify(
      {
        alt: desc,
        credit: `Photo: ${by || 'Unsplash contributor'} on Unsplash`,
        source: id ? `https://unsplash.com/photos/${id}` : `https://images.unsplash.com/${pid}`,
        license: 'Unsplash License (https://unsplash.com/license)',
        stock: true,
        grade: 'warm',
        focus: '50% 40%',
      },
      null,
      2
    ) + '\n'
  );
}
console.log(`[stock] downloaded ${got} files (${(bytes / 1048576).toFixed(1)} MB) into photos/originals/pool/`);
