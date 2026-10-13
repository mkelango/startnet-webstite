// StartNet photo pipeline: originals → responsive WebP + JPEG → client/src/data/photos.manifest.json.
//
// 1. Put each original (JPEG, PNG or WebP, ideally 2000 px or wider) at photos/originals/<slot key>.<ext>, e.g.
//      photos/originals/hero/home.jpg               home hero
//      photos/originals/hero/vibe.jpg               StartNet Vibe hero (any page: hero/<page path>)
//      photos/originals/event/vibathon/2025.jpg     Vibathon 2025 (cards, edition page, Vibathon hero)
//      photos/originals/event/genai-connect.jpg     every GenAI Connect edition without its own photo
//      photos/originals/story/<slug>.jpg            a story card and its page
//      photos/originals/person/<people.json slug>.jpg   a portrait
//      photos/originals/pool/<theme>/<n>.jpg        themed library for slots without their own photo
//                                                   (students, research, professionals, women, events, places,
//                                                    insights, partner, platform, community)
// 2. Next to it, an optional <same name>.json:
//      { "alt": "Students building at Vibathon 2025 in Madurai", "altTa": "…",
//        "caption": "Vibathon 2025, Madurai", "captionTa": "…",
//        "focus": "50% 35%", "focusMobile": "60% 30%",      ← where the subject is (object-position), per layout
//        "crop": [x, y, width, height],                       ← optional, in original pixels
//        "square": [x, y, side],                              ← optional square crop, fractions of the image width (portraits)
//        "credit": "Photo: StartNet", "consent": true }       ← consent is REQUIRED for person/* and photos of people
// 3. npm run photos     (then npm run build, so the prerendered pages include the photos)
//
// Rules it enforces: no alt text → warning (decorative); person/* without "consent": true → skipped; originals under
// 1200 px wide → warning (they would look soft on large screens); widths are never upscaled.
// Encoding runs in the installed Chrome / Edge (canvas WebP + JPEG), so there is no image library to install.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(new URL('../audit/package.json', import.meta.url));
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.resolve(process.env.PHOTOS_SRC || path.join(ROOT, 'photos/originals'));
const OUT = path.join(ROOT, 'client/public/photos');
const MANIFEST = path.join(ROOT, 'client/src/data/photos.manifest.json');
const WIDTHS = [480, 800, 1200, 1600];
const QUALITY = { webp: 0.78, jpg: 0.8 };
// JPEG is only the fallback for browsers without WebP (rare), so it gets two sizes instead of every width.
const JPG_WIDTHS = [800, 1600];

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && fs.existsSync(p));

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const walk = (d) =>
  fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])) : [];
const KEY_RE = /^(hero\/[a-z0-9/-]+|event\/[a-z0-9-]+(\/[a-z0-9-]+)?|story\/[a-z0-9-]+|person\/[a-z0-9-]+|pool\/[a-z]+\/\d+)$/;
// Warm, slightly calmer grade so photos from different photographers read as one set ("grade": "warm").
// "ink": the site's photo tone (Oct 2026 redesign, after AngelList / USVC monochrome photography): near-monochrome
// with a warm paper tint, so every photo sits on Paper and Ink as one set. Applied to every photo ("warm" is the old
// name, kept as an alias). Originals are never changed; re-run npm run photos after editing this.
const INK = 'grayscale(1) contrast(1.08) brightness(1.02)';
const GRADES = { ink: INK, warm: INK, none: null };

const originals = walk(SRC).filter((f) => MIME[path.extname(f).toLowerCase()]);
if (!originals.length) {
  console.log(`[photos] no originals in ${path.relative(ROOT, SRC) || SRC}. Nothing to do; slots keep their generative art.`);
  if (!fs.existsSync(MANIFEST)) fs.writeFileSync(MANIFEST, '{}\n');
  process.exit(0);
}
if (!CHROME) {
  console.error('[photos] no Chrome / Chromium / Edge found (set CHROME_PATH).');
  process.exit(1);
}

const manifest = {};
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setContent('<!doctype html><canvas></canvas>');
  for (const file of originals.sort()) {
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const key = rel.replace(/\.[^.]+$/, '').toLowerCase();
    if (!KEY_RE.test(key)) {
      console.warn(`[photos] skip ${rel}: not a known slot key (see the header of tools/images/photos.mjs)`);
      continue;
    }
    const sidecar = file.replace(/\.[^.]+$/, '.json');
    let meta = {};
    if (fs.existsSync(sidecar)) {
      try {
        meta = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
      } catch (err) {
        console.warn(`[photos] skip ${rel}: ${path.basename(sidecar)} is not valid JSON (${err.message})`);
        continue;
      }
    }
    if (key.startsWith('person/') && meta.consent !== true) {
      console.warn(`[photos] skip ${rel}: portraits need "consent": true in ${path.basename(sidecar)}`);
      continue;
    }
    if (!meta.alt) console.warn(`[photos] ${rel}: no "alt" text; the photo will be treated as decorative`);

    const dataUrl = `data:${MIME[path.extname(file).toLowerCase()]};base64,${fs.readFileSync(file).toString('base64')}`;
    const result = await page.evaluate(
      async (src, widths, q, grade, jpgWidths, crop, square) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        // Square crop given as fractions of the image width [x, y, side] (portraits: the same head-and-shoulders
        // framing whatever the original's size), clamped to the image.
        if (!crop && square) {
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          const side = Math.min(Math.round(square[2] * nw), nw, nh);
          const x = Math.max(0, Math.min(nw - side, Math.round(square[0] * nw)));
          const y = Math.max(0, Math.min(nh - side, Math.round(square[1] * nw)));
          crop = [x, y, side, side];
        }
        // Optional crop [x, y, width, height] in original pixels (e.g. to remove a frame added by a publisher).
        const [cx, cy, cw, ch] = crop || [0, 0, img.naturalWidth, img.naturalHeight];
        const W = cw;
        const H = ch;
        const sizes = widths.filter((w) => w <= W);
        if (!sizes.length || sizes[sizes.length - 1] < Math.min(W, widths[widths.length - 1])) sizes.push(Math.min(W, widths[widths.length - 1]));
        const out = [];
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        for (const w of [...new Set(sizes)]) {
          const h = Math.round((H * w) / W);
          canvas.width = w;
          canvas.height = h;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.fillStyle = '#F6F5F2'; // Paper behind transparent PNGs (JPEG has no alpha)
          ctx.fillRect(0, 0, w, h);
          ctx.filter = grade || 'none';
          ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
          ctx.filter = 'none';
          out.push({ w, webp: canvas.toDataURL('image/webp', q.webp), jpg: jpgWidths.includes(w) || w === sizes[sizes.length - 1] ? canvas.toDataURL('image/jpeg', q.jpg) : null });
        }
        return { W, H, out };
      },
      dataUrl,
      WIDTHS,
      QUALITY,
      meta.grade === 'none' ? null : GRADES[meta.grade] || INK,
      JPG_WIDTHS,
      Array.isArray(meta.crop) && meta.crop.length === 4 ? meta.crop.map(Number) : null,
      Array.isArray(meta.square) && meta.square.length === 3 ? meta.square.map(Number) : null
    );
    if (result.W < 1200) console.warn(`[photos] ${rel}: only ${result.W}px wide; supply 2000px+ for sharp heroes`);

    const base = `/photos/${key}`;
    const dir = path.dirname(path.join(OUT, key));
    fs.mkdirSync(dir, { recursive: true });
    // Old sizes of this photo only: "2025-800.webp" for key …/2025, never the gallery's "2025-2-800.webp".
    const stem = `${path.basename(key)}-`;
    for (const f of fs.readdirSync(dir)) {
      if (f.startsWith(stem) && /^\d+\.(webp|jpg)$/.test(f.slice(stem.length))) fs.rmSync(path.join(dir, f));
    }
    let bytes = 0;
    for (const v of result.out) {
      for (const fmt of ['webp', 'jpg']) {
        if (!v[fmt]) continue;
        const buf = Buffer.from(v[fmt].split(',')[1], 'base64');
        bytes += buf.length;
        fs.writeFileSync(path.join(OUT, `${key}-${v.w}.${fmt}`), buf);
      }
    }
    manifest[key] = {
      base,
      widths: result.out.map((v) => v.w),
      jpgWidths: result.out.filter((v) => v.jpg).map((v) => v.w),
      formats: ['webp', 'jpg'],
      width: result.W,
      height: result.H,
      ...(meta.alt ? { alt: String(meta.alt) } : {}),
      ...(meta.altTa ? { altTa: String(meta.altTa) } : {}),
      ...(meta.caption ? { caption: String(meta.caption) } : {}),
      ...(meta.captionTa ? { captionTa: String(meta.captionTa) } : {}),
      ...(meta.focus ? { focus: String(meta.focus) } : {}),
      ...(meta.focusMobile ? { focusMobile: String(meta.focusMobile) } : {}),
      ...(meta.credit ? { credit: String(meta.credit) } : {}),
      ...(meta.stock ? { stock: true } : {}),
    };
    console.log(`[photos] ${key}: ${result.W}×${result.H} → ${manifest[key].widths.join('/')}px, ${Math.round(bytes / 1024)} KB total`);
  }
} finally {
  await browser.close();
}

// Drop generated files whose original is gone, then write the manifest (sorted, so diffs stay small).
for (const f of walk(OUT)) {
  const rel = path.relative(OUT, f).split(path.sep).join('/');
  const key = rel.replace(/-\d+\.(webp|jpg)$/, '');
  if (!manifest[key]) fs.rmSync(f);
}
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
console.log(`[photos] ${Object.keys(sorted).length} photos in client/src/data/photos.manifest.json. Run npm run build next.`);
