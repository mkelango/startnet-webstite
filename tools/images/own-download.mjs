// Downloads StartNet's own event photos listed in photos/stock/startnet-own.json (from StartNet's LinkedIn,
// YouTube and archived site) into photos/originals/pool/<vibereal|stage>/<n>.jpg with captions that say what each
// photo really shows. Run once; existing files are skipped. Then: npm run photos && npm run build.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const list = JSON.parse(fs.readFileSync(path.join(ROOT, 'photos/stock/startnet-own.json'), 'utf8'));

const GROUPS = {
  'startnet-vibe-tngss-2025': { pool: 'vibereal', caption: 'StartNet Vibe at TNGSS 2025, Coimbatore', captionTa: 'TNGSS 2025-இல் StartNet Vibe, கோயம்புத்தூர்' },
  'startnet-2024-summit': { pool: 'stage', caption: 'StartNet event, February 2024', captionTa: 'StartNet நிகழ்வு, பிப்ரவரி 2024' },
  'startnet-launch-2023': { pool: 'stage', caption: 'StartNet launch, July 2023', captionTa: 'StartNet தொடக்க விழா, ஜூலை 2023' },
  'startnet-network-meeting-2023': { pool: 'stage', caption: 'StartNet network meeting, September 2023', captionTa: 'StartNet வலையமைப்புச் சந்திப்பு, செப்டம்பர் 2023' },
  'startnet-mega-pitching-2023': { pool: 'stage', caption: 'StartNet Mega Pitching, 2023', captionTa: 'StartNet மெகா பிட்சிங், 2023' },
};
const counters = {};
let got = 0;
let bytes = 0;
for (const [key, url, page, desc] of list) {
  const group = GROUPS[key.split('/')[1]];
  if (!group) continue;
  counters[group.pool] = (counters[group.pool] || 0) + 1;
  const n = String(counters[group.pool]).padStart(2, '0');
  const dir = path.join(ROOT, 'photos/originals/pool', group.pool);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${n}.jpg`);
  if (!fs.existsSync(file)) {
    const res = await fetch(url);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !/^image\//.test(type)) {
      console.warn(`[own] skip ${key}: HTTP ${res.status} ${type}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
    const isPng = buf[0] === 0x89 && buf[1] === 0x50;
    const isWebp = buf.slice(8, 12).toString() === 'WEBP';
    if (!isJpeg && !isPng && !isWebp) {
      console.warn(`[own] skip ${key}: not an image file`);
      continue;
    }
    fs.writeFileSync(isJpeg ? file : file.replace(/\.jpg$/, isPng ? '.png' : '.webp'), buf);
    bytes += buf.length;
    got++;
  }
  fs.writeFileSync(
    file.replace(/\.jpg$/, '.json'),
    JSON.stringify(
      {
        alt: desc,
        caption: group.caption,
        captionTa: group.captionTa,
        credit: 'Photo: StartNet',
        source: page,
        owner: 'StartNet Ventures Private Limited',
        grade: 'warm',
        focus: '50% 40%',
      },
      null,
      2
    ) + '\n'
  );
}
console.log(`[own] downloaded ${got} files (${(bytes / 1048576).toFixed(1)} MB) into photos/originals/pool/{vibereal,stage}/`);
