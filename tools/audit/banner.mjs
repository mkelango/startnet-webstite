import { launch, VIEWPORTS } from './crawl.mjs';
const b = await launch();
for (const [vp, path] of [['mobile-sm','/'],['mobile','/'],['mobile-sm','/ta']]) {
  const p = await b.newPage(); await p.setViewport(VIEWPORTS[vp]);
  await p.goto('http://localhost:4000' + path, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  const h = await p.evaluate(() => { const el = document.querySelector('.cookie-banner'); return el ? Math.round(el.getBoundingClientRect().height) : null; });
  await p.screenshot({ path: `out/shots/banner-${vp}${path.replace('/','-')}.png` });
  console.log(vp, path, 'banner height', h, 'of', VIEWPORTS[vp].height);
  await p.close();
}
await b.close();
