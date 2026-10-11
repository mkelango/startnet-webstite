import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * Preload Inter latin from index.html (build only: the file name is hashed). Both languages need it, and
 * without a preload it is discovered only after the entry script has run and React has rendered.
 * The Tamil body font is preloaded on /ta from main.jsx instead (the production CSP allows no inline script).
 */
function preloadFonts() {
  let base = '/';
  return {
    name: 'startnet:preload-fonts',
    apply: 'build',
    configResolved(config) { base = config.base || '/'; },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle || {}).filter((f) => /(inter-latin-wght-normal|instrument-serif-latin-400-italic)-[\w-]+\.woff2$/.test(f));
        return files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: base + f, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head'
        }));
      }
    }
  };
}

/**
 * Write max-quality Brotli (q11) and gzip (level 9) copies next to each compressible hashed asset, so the
 * server (server/src/common/spa.ts) can send them as-is instead of compressing on the fly at a low level. Fonts and images are already
 * compressed and are skipped; a copy is kept only when it is actually smaller.
 */
function precompress() {
  let outDir = 'dist';
  return {
    name: 'startnet:precompress',
    apply: 'build',
    configResolved(config) { outDir = path.resolve(config.root, config.build.outDir); },
    closeBundle() {
      const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
      const assetsDir = path.join(outDir, 'assets');
      if (!fs.existsSync(assetsDir)) return;
      for (const file of walk(assetsDir)) {
        if (!/\.(js|mjs|css|html|svg|json|txt|xml|webmanifest|ico)$/.test(file)) continue;
        const src = fs.readFileSync(file);
        if (src.length < 1024) continue;
        const br = zlib.brotliCompressSync(src, {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            [zlib.constants.BROTLI_PARAM_SIZE_HINT]: src.length,
            [zlib.constants.BROTLI_PARAM_MODE]: /\.(js|mjs|css|html|svg|json|txt|xml)$/.test(file)
              ? zlib.constants.BROTLI_MODE_TEXT : zlib.constants.BROTLI_MODE_GENERIC
          }
        });
        const gz = zlib.gzipSync(src, { level: 9 });
        if (br.length < src.length) fs.writeFileSync(file + '.br', br);
        if (gz.length < src.length) fs.writeFileSync(file + '.gz', gz);
      }
    }
  };
}

/**
 * index.html is written against https://startnet.in (Organization / WebSite JSON-LD, og:image). When the build sets
 * VITE_SITE_ORIGIN to another origin (e.g. staging), rewrite those absolute URLs so they match Seo.jsx and lib/seo.js.
 */
function siteOrigin() {
  const DEFAULT = 'https://startnet.in';
  const origin = String(process.env.VITE_SITE_ORIGIN || DEFAULT).replace(/\/+$/, '');
  return {
    name: 'startnet:site-origin',
    transformIndexHtml(html) {
      return origin === DEFAULT ? html : html.split(DEFAULT).join(origin);
    }
  };
}

// The WhatsApp number comes from VITE_WHATSAPP_NUMBER (lib/links.js falls back to a placeholder 910000000000, which
// is not a real number). A build without it gets a loud warning; a release build (STARTNET_RELEASE=1) is stopped.
function requireWhatsappNumber() {
  return {
    name: 'startnet-require-whatsapp-number',
    apply: 'build',
    configResolved(config) {
      const n = String(config.env.VITE_WHATSAPP_NUMBER || '').replace(/[^\d]/g, '');
      if (n && !/^910+$/.test(n)) return;
      const msg = 'VITE_WHATSAPP_NUMBER is not set: every WhatsApp link will point to the placeholder 910000000000.';
      if (process.env.STARTNET_RELEASE === '1') throw new Error(msg);
      config.logger.warn('\n[startnet] WARNING: ' + msg + '\n');
    },
  };
}

export default defineConfig({
  plugins: [react(), siteOrigin(), preloadFonts(), precompress(), requireWhatsappNumber()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:4000' }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Fonts are never inlined as base64: an inlined font cannot be cached separately, cannot be preloaded,
    // and is downloaded with the CSS even on pages that never use it.
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf|eot)$/i.test(file) ? false : undefined),
    rollupOptions: {
      output: {
        // No manual chunks (F-33). Rollup places each lucide icon with the code that uses it: the shell's and
        // Home's icons go in the entry, and an icon used by one route goes in that route's chunk. The old forced
        // 'icons' chunk was imported by the entry, so every first load fetched all ~120 icons (10.6 KB br) and
        // a copy of React. Measured on a scratch build: 5-6 KB br less first-load JS on every route.
        // (A forced 'ui' chunk for src/components was also measured and rejected because it pulled lazily used
        // components and GSAP into the entry path, +~50 KB gzip on first load.)
        // Chunks under 2 KB that hold only declarations are merged into a chunk that loads under the same
        // conditions. This cuts the number of tiny icon chunks a route requests (Programmes 9 -> 6, Events 14 -> 10)
        // for under 1 KB br more per route.
        experimentalMinChunkSize: 2048
      }
    }
  }
});
