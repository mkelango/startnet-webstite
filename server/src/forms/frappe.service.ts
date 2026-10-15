import { Injectable, Logger } from '@nestjs/common';

/** Website form type → Frappe `form` key (startnet.api.submit_form). */
const FRAPPE_FORM: Record<string, string> = {
  contact: 'contact',
  enquiry: 'partner',
  newsletter: 'newsletter',
  join: 'join',
  interest: 'interest',
  nomination: 'nomination',
  host: 'host_event',
  speak: 'speaker_mentor',
};

/** Website keys whose Frappe name is not plain snake_case. `name` is reserved in Frappe. */
const RENAME: Record<string, string> = { name: 'full_name', under18: 'under_18', isUnder18: 'under_18' };

/** Sent by the client but already stored as consent_version / consent_* columns. */
const SKIP = new Set(['consentVersion']);

const snake = (k: string) => RENAME[k] ?? k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`).replace(/[.-]/g, '_');

/** Frappe Datetime ("YYYY-MM-DD HH:mm:ss") in IST. */
const frappeDatetime = (iso: string) =>
  new Date(iso).toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata', hour12: false }).replace('T', ' ');

export interface StoredSubmission {
  id: string;
  type: string;
  receivedAt: string;
  payload: Record<string, unknown>;
  consents: { purpose: string; version: string; at: string }[];
}

/**
 * Forwards each stored submission to Frappe. Config (env): FRAPPE_BASE_URL, FRAPPE_API_KEY, FRAPPE_API_SECRET.
 * Without them it does nothing. submission_id is Frappe's idempotency key, so a resend never duplicates.
 */
@Injectable()
export class FrappeService {
  private readonly logger = new Logger('FrappeService');
  private readonly base = (process.env.FRAPPE_BASE_URL ?? '').trim().replace(/\/+$/, '');
  private readonly key = (process.env.FRAPPE_API_KEY ?? '').trim();
  private readonly secret = (process.env.FRAPPE_API_SECRET ?? '').trim();

  get enabled() {
    return Boolean(this.base && this.key && this.secret);
  }

  toFrappe(rec: StoredSubmission) {
    const data: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rec.payload)) {
      if (SKIP.has(k)) continue;
      data[snake(k)] = Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 1 : 0) : v;
    }
    for (const c of rec.consents) data[`consent_${c.purpose}`] = 1;
    if (rec.type === 'newsletter') data.whatsapp_opt_in = rec.consents.some((c) => c.purpose === 'whatsapp_updates') ? 1 : 0;
    data.consent_version = rec.consents[0]?.version;
    data.submission_id = rec.id;
    data.received_at = frappeDatetime(rec.receivedAt);
    return { form: FRAPPE_FORM[rec.type] ?? rec.type, data };
  }

  /** For GET /api/forms/frappe-status: is the sync configured, and can this server reach Frappe? No secrets. */
  async status() {
    const configured = { baseUrl: Boolean(this.base), apiKey: Boolean(this.key), apiSecret: Boolean(this.secret) };
    if (!this.base) return { enabled: false, configured, reachable: false };
    try {
      const res = await fetch(`${this.base}/api/method/ping`, { signal: AbortSignal.timeout(8000) });
      return { enabled: this.enabled, configured, host: new URL(this.base).host, reachable: res.ok, httpStatus: res.status };
    } catch (err) {
      const e = err as Error & { cause?: { code?: string } };
      return { enabled: this.enabled, configured, host: new URL(this.base).host, reachable: false, error: e.cause?.code ?? e.name };
    }
  }

  /** Never throws: the submission is already safe in submissions.jsonl. */
  async send(rec: StoredSubmission): Promise<void> {
    if (!this.enabled) return;
    try {
      const res = await fetch(`${this.base}/api/method/startnet.api.submit_form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `token ${this.key}:${this.secret}`,
        },
        body: JSON.stringify(this.toFrappe(rec)),
        signal: AbortSignal.timeout(15000),
      });
      const out = (await res.json().catch(() => ({}))) as { message?: { ok?: boolean; name?: string } };
      if (!res.ok || !out.message?.ok) {
        this.logger.error(`Frappe rejected ${rec.type} ${rec.id} (HTTP ${res.status}): ${JSON.stringify(out).slice(0, 500)}`);
        return;
      }
      this.logger.log(`${rec.type} ${rec.id} → ${out.message.name}`);
    } catch (err) {
      this.logger.error(`Could not reach Frappe for ${rec.type} ${rec.id}: ${(err as Error).message}`);
    }
  }
}
