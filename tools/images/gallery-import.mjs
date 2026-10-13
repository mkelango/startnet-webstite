// Copies StartNet's own photos from "StartNet Gallery/" into photos/originals/<key>.jpg with a sidecar .json
// (alt, caption, credit, source, consent, optional crop and focus), as listed in photos/stock/gallery-map.json.
// Existing sidecar fields that are not in the map (e.g. a hand-tuned "focus") are kept. Then: npm run photos.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const GALLERY = path.join(ROOT, 'StartNet Gallery');
const { groups, photos } = JSON.parse(fs.readFileSync(path.join(ROOT, 'photos/stock/gallery-map.json'), 'utf8'));

let n = 0;
for (const [src, key, alt, group, crop, focus] of photos) {
  const g = groups[group];
  if (!g) throw new Error(`unknown caption group "${group}" for ${src}`);
  const from = path.join(GALLERY, src);
  if (!fs.existsSync(from)) {
    console.warn(`[gallery] missing ${src}`);
    continue;
  }
  const to = path.join(ROOT, 'photos/originals', `${key}.jpg`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  // One original per key: drop an older original of the same key in another format (.png/.webp).
  for (const ext of ['.png', '.webp', '.jpeg']) fs.rmSync(to.replace(/\.jpg$/, ext), { force: true });
  fs.copyFileSync(from, to);
  const sidecar = to.replace(/\.jpg$/, '.json');
  const old = fs.existsSync(sidecar) ? JSON.parse(fs.readFileSync(sidecar, 'utf8')) : {};
  const meta = {
    ...old,
    alt,
    caption: g.caption,
    captionTa: g.captionTa,
    credit: g.credit,
    source: `StartNet Gallery/${src}`,
    owner: 'StartNet',
    consent: true,
    ...(crop ? { crop } : {}),
    ...(focus ? { focus, focusMobile: focus } : {}),
  };
  if (!crop) delete meta.crop;
  delete meta.stock;
  delete meta.license;
  delete meta.usedWithPermission;
  delete meta.grade;
  fs.writeFileSync(sidecar, JSON.stringify(meta, null, 2) + '\n');
  n++;
}
console.log(`[gallery] ${n} photos copied into photos/originals/. Next: npm run photos`);
