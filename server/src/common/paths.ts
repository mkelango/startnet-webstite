import { existsSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Resolve folders so the server works whether it runs from `server/` (npm scripts),
 * from the repo root, or from compiled `dist/`.
 */
function firstExisting(candidates: string[], probe?: string): string | null {
  for (const dir of candidates) {
    if (existsSync(probe ? join(dir, probe) : dir)) return dir;
  }
  return null;
}

/** server/data — seeded JSON content. */
export const DATA_DIR: string =
  firstExisting([
    resolve(process.cwd(), 'data'),
    resolve(process.cwd(), 'server', 'data'),
    resolve(__dirname, '..', 'data'),
    resolve(__dirname, '..', '..', 'data'),
  ]) ?? resolve(__dirname, '..', '..', 'data');

/** server/storage — form submissions (gitignored). Sits next to data/. */
export const STORAGE_DIR: string = resolve(DATA_DIR, '..', 'storage');

/** client/dist — the built React app. null when it has not been built yet. */
export const CLIENT_DIST: string | null = firstExisting(
  [
    resolve(process.cwd(), '..', 'client', 'dist'),
    resolve(process.cwd(), 'client', 'dist'),
    resolve(__dirname, '..', '..', 'client', 'dist'),
    resolve(__dirname, '..', '..', '..', 'client', 'dist'),
  ],
  'index.html',
);

/** client/src — the React sources, present in a repo checkout only. Used for the route/slug sync check. */
export const CLIENT_SRC: string | null = firstExisting(
  [
    resolve(process.cwd(), '..', 'client', 'src'),
    resolve(process.cwd(), 'client', 'src'),
    resolve(__dirname, '..', '..', 'client', 'src'),
    resolve(__dirname, '..', '..', '..', 'client', 'src'),
  ],
  'App.jsx',
);
