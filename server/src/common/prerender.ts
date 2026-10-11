import { createHash } from 'crypto';
import { readFileSync, statSync } from 'fs';
import { join, resolve, sep } from 'path';

/**
 * Prerendered HTML snapshots written by tools/seo/prerender.mjs into client/dist/prerender/.
 * Crawlers that do not run JavaScript get the real page (title, description, canonical, JSON-LD, text);
 * the live app replaces it on load (client/src/main.jsx).
 *
 * Safety: snapshots are used only when manifest.json was rendered against the current index.html (same hash), so
 * a client rebuild without a new prerender falls back to the plain shell instead of serving stale asset links.
 * PRERENDER_BYPASS=1 turns snapshots off (the prerender script itself runs the server that way).
 */
interface Manifest {
  shellHash: string;
  noindex?: string[];
}

const HASH_LEN = 16;

export class PrerenderStore {
  private readonly dir: string;
  private readonly indexFile: string;
  private shell: { mtimeMs: number; hash: string } | null = null;
  private manifest: { mtimeMs: number; value: Manifest | null } | null = null;
  private readonly files = new Map<string, { mtimeMs: number; html: string }>();
  private readonly disabled = process.env.PRERENDER_BYPASS === '1';

  constructor(clientDist: string) {
    this.dir = resolve(clientDist, 'prerender');
    this.indexFile = join(clientDist, 'index.html');
  }

  private shellHash(): string | null {
    try {
      const { mtimeMs } = statSync(this.indexFile);
      if (!this.shell || this.shell.mtimeMs !== mtimeMs) {
        const hash = createHash('sha256').update(readFileSync(this.indexFile, 'utf8')).digest('hex').slice(0, HASH_LEN);
        this.shell = { mtimeMs, hash };
      }
      return this.shell.hash;
    } catch {
      return null;
    }
  }

  /** The manifest, or null when there is none or it belongs to another build. */
  private valid(): Manifest | null {
    if (this.disabled) return null;
    const file = join(this.dir, 'manifest.json');
    let mtimeMs: number;
    try {
      mtimeMs = statSync(file).mtimeMs;
    } catch {
      return null;
    }
    if (!this.manifest || this.manifest.mtimeMs !== mtimeMs) {
      let value: Manifest | null = null;
      try {
        value = JSON.parse(readFileSync(file, 'utf8')) as Manifest;
      } catch {
        value = null;
      }
      this.manifest = { mtimeMs, value };
      this.files.clear();
    }
    const m = this.manifest.value;
    return m && m.shellHash === this.shellHash() ? m : null;
  }

  /** Paths (with any /ta prefix) the rendered page marked noindex. Empty without a valid manifest. */
  noindex(): Set<string> {
    return new Set(this.valid()?.noindex ?? []);
  }

  /** Snapshot HTML for a clean, lower-case path ("/", "/ta", "/vibe/academy"), or null. */
  get(path: string): string | null {
    if (!this.valid()) return null;
    const rel = path === '/' ? 'index.html' : `${path.replace(/^\/+/, '')}.html`;
    if (rel.includes('\0') || rel.includes('..')) return null;
    const file = resolve(this.dir, rel);
    if (!file.startsWith(this.dir + sep)) return null;
    let mtimeMs: number;
    try {
      const st = statSync(file);
      if (!st.isFile()) return null;
      mtimeMs = st.mtimeMs;
    } catch {
      return null;
    }
    const hit = this.files.get(file);
    if (hit && hit.mtimeMs === mtimeMs) return hit.html;
    try {
      const html = readFileSync(file, 'utf8');
      this.files.set(file, { mtimeMs, html });
      return html;
    } catch {
      return null;
    }
  }
}
