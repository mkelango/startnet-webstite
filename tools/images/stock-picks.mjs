// Downloads the curated stock photos in photos/stock/picks.json (Unsplash License: free for commercial use, no
// attribution required; credited anyway) into photos/originals/<key>.jpg with a sidecar .json, and removes the pool
// photos listed under "retire". Every pick shows Indian people; the pipeline grades it to grayscale.
//   picks.json: { "retire": ["pool/events/01", …],
//                 "picks": [[key, unsplash slug, photo id, photographer, alt, focus?], …] }
// Run: node tools/images/stock-picks.mjs   (existing files are kept; delete one to re-download). Then npm run photos.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ORIG = path.join(ROOT, 'photos/originals');
const { retire = [], picks } = JSON.parse(fs.readFileSync(path.join(ROOT, 'photos/stock/picks.json'), 'utf8'));
const MIN_WIDTH = 2400;

let removed = 0;
for (const key of retire) {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp', '.json']) {
    const f = path.join(ORIG, key + ext);
    if (fs.existsSync(f)) {
      fs.rmSync(f);
      removed++;
    }
  }
}

const jpegWidth = (buf) => {
  // Walk the JPEG markers to the first SOF segment (baseline or progressive) and read its width.
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return 0;
    const m = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return buf.readUInt16BE(i + 7);
    i += 2 + len;
  }
  return 0;
};

let got = 0;
let bytes = 0;
const soft = [];
for (const [key, slug, pid, by, alt, focus] of picks) {
  const file = path.join(ORIG, `${key}.jpg`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) {
    const res = await fetch(`https://images.unsplash.com/${pid}?w=3200&q=88&fm=jpg`);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !/^image\/jpeg/.test(type)) {
      console.warn(`[stock] skip ${key}: HTTP ${res.status} ${type}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf[0] !== 0xff || buf[1] !== 0xd8) {
      console.warn(`[stock] skip ${key}: not a JPEG`);
      continue;
    }
    const w = jpegWidth(buf);
    if (w && w < MIN_WIDTH) soft.push(`${key} (${w}px)`);
    fs.writeFileSync(file, buf);
    bytes += buf.length;
    got++;
  }
  fs.writeFileSync(
    file.replace(/\.jpg$/, '.json'),
    JSON.stringify(
      {
        alt,
        credit: `Photo: ${by || 'Unsplash contributor'} on Unsplash`,
        source: `https://unsplash.com/photos/${slug}`,
        license: 'Unsplash License (https://unsplash.com/license)',
        stock: true,
        focus: focus || '50% 40%',
      },
      null,
      2
    ) + '\n'
  );
}
console.log(`[stock] retired ${removed} files; downloaded ${got} photos (${(bytes / 1048576).toFixed(1)} MB).`);
if (soft.length) console.warn(`[stock] under ${MIN_WIDTH}px: ${soft.join(', ')}`);
