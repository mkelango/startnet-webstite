// Downloads the approved third-party photos of StartNet's own events (used with permission) into their exact
// event slots: photos/originals/event/<series>/<edition>[-n].<ext>, each with caption, credit and source.
// Run once; existing files are skipped. Then: npm run photos && npm run build.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SAAS = { caption: 'SaaS.Connect 2025, PSG Convention Centre, Coimbatore', captionTa: 'SaaS.Connect 2025, PSG மாநாட்டு மையம், கோயம்புத்தூர்' };
const VIBATHON = { caption: 'Vibathon 2025, K.S.R. College of Engineering, Tiruchengode', captionTa: 'Vibathon 2025, கே.எஸ்.ஆர். பொறியியல் கல்லூரி, திருச்செங்கோடு' };
const LIST = [
  ['event/saas-connect/2025', 'https://cdn.prod.website-files.com/68bda8ed1023b7fed633b3c0/68da8162c8a8f64f9efa1db4_67caaeace6832530cf43fd2a_saas-connect-event.webp', 'https://www.entrans.ai/blog/saas-connect-2025', 'Entrans', 'An attendee asks a question from the audience at SaaS.Connect 2025', SAAS],
  ['event/saas-connect/2025-2', 'https://cdn.prod.website-files.com/68bda8ed1023b7fed633b3c0/68e280d5e91a304b260b618e_saas-connect.webp', 'https://www.entrans.ai/blog/saas-connect-2025', 'Entrans', 'The "Founder Stories – 0 to $1M ARR" panel on stage at SaaS.Connect 2025', SAAS],
  ['event/saas-connect/2025-3', 'https://static.wixstatic.com/media/bd770d_72b2123be0924c27b98762d795bef4a7~mv2.png', 'https://ggokulkannan2006.wixsite.com/gokulsblog/post/saas-connect-2025', 'Gokul Kannan', 'The illuminated SaaSConnect letters at the venue', SAAS],
  ['event/saas-connect/2025-4', 'https://static.wixstatic.com/media/bd770d_fd9a83d77fe841ef8cb6dc5225600ce6~mv2.png', 'https://ggokulkannan2006.wixsite.com/gokulsblog/post/saas-connect-2025', 'Gokul Kannan', 'Industry leaders in a roundtable session at SaaS.Connect 2025', SAAS],
  ['event/saas-connect/2025-5', 'https://static.wixstatic.com/media/bd770d_630ab0085de74a329a0fa2086a43ea56~mv2.png', 'https://ggokulkannan2006.wixsite.com/gokulsblog/post/saas-connect-2025', 'Gokul Kannan', 'Attendees in a session room at SaaS.Connect 2025', SAAS],
  ['event/vibathon/2025', 'https://ksrce.ac.in/admin/file_manager/source/New/IIIC/CoE/CYTIC/CYTI-11.jpg', 'https://ksrce.ac.in/index.php/page?id=1078&item=315', 'K.S.R. College of Engineering', 'Students in the hall at Vibathon 2025, K.S.R. College of Engineering', VIBATHON],
];
let got = 0;
for (const [key, url, page, owner, alt, cap] of LIST) {
  const base = path.join(ROOT, 'photos/originals', key);
  fs.mkdirSync(path.dirname(base), { recursive: true });
  const existing = ['.jpg', '.png', '.webp'].map((e) => base + e).find((f) => fs.existsSync(f));
  if (!existing) {
    const res = await fetch(url);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !/^image\//.test(type)) {
      console.warn(`[event] skip ${key}: HTTP ${res.status} ${type}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = buf[0] === 0xff && buf[1] === 0xd8 ? '.jpg' : buf[0] === 0x89 && buf[1] === 0x50 ? '.png' : buf.slice(8, 12).toString() === 'WEBP' ? '.webp' : null;
    if (!ext) {
      console.warn(`[event] skip ${key}: not an image file`);
      continue;
    }
    fs.writeFileSync(base + ext, buf);
    got++;
    console.log(`[event] ${key}${ext} ${Math.round(buf.length / 1024)} KB`);
  }
  fs.writeFileSync(
    base + '.json',
    JSON.stringify({ alt, ...cap, credit: `Photo: ${owner}`, source: page, usedWithPermission: true, consent: true, grade: 'warm', focus: '50% 45%' }, null, 2) + '\n'
  );
}
console.log(`[event] downloaded ${got} files`);
