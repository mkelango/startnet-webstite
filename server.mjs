// StartNet — zero-dependency static preview server
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.SN_ROOT
  ? normalize(process.env.SN_ROOT)
  : fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  if (clean.includes('..')) return null;
  let p = join(ROOT, clean);
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = join(p, 'index.html');
  } catch {
    if (!extname(p)) p += '.html';
  }
  try {
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolve(req.url || '/');
  if (!file) {
    const nf = join(ROOT, '404.html');
    try {
      const body = await readFile(nf);
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      return res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('404');
    }
  }
  const body = await readFile(file);
  res.writeHead(200, {
    'content-type': TYPES[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-cache',
  });
  res.end(body);
}).listen(PORT, () => console.log(`StartNet preview → http://localhost:${PORT}`));
