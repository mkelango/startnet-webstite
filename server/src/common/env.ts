import { existsSync } from 'fs';
import { resolve } from 'path';

// Local secrets (FRAPPE_API_KEY…) live in a gitignored .env; in Coolify they are set as env vars.
// Imported first in main.ts so every module sees them. Existing env vars are never overridden.
for (const file of [resolve(process.cwd(), '.env'), resolve(process.cwd(), '..', '.env'), resolve(__dirname, '..', '..', '.env')]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
    break;
  }
}
