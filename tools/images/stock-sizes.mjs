// Reports the download size of each selected stock photo (HEAD requests only; nothing is saved).
import fs from 'fs';
const list = JSON.parse(fs.readFileSync(new URL('../../photos/stock/selection.json', import.meta.url), 'utf8'));
let total = 0;
const sizes = [];
for (const r of list) {
  const res = await fetch(`https://images.unsplash.com/${r[2]}?w=2400&q=85&fm=jpg`, { method: 'HEAD' });
  const n = Number(res.headers.get('content-length')) || 0;
  sizes.push(n);
  total += n;
}
console.log(`files ${list.length} | total ${(total / 1048576).toFixed(1)} MB | min ${Math.round(Math.min(...sizes) / 1024)} KB | max ${Math.round(Math.max(...sizes) / 1024)} KB | unknown ${sizes.filter((x) => !x).length}`);
const byTheme = {};
list.forEach((r, i) => { byTheme[r[0]] = byTheme[r[0]] || [0, 0]; byTheme[r[0]][0]++; byTheme[r[0]][1] += sizes[i]; });
for (const [k, [n, b]] of Object.entries(byTheme)) console.log(`  ${k.padEnd(14)} ${n} files, ${(b / 1048576).toFixed(1)} MB`);
