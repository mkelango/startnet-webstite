import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { STORAGE_DIR } from '../common/paths';
import {
  CONSENT_PURPOSES,
  CONSENT_VERSION,
  ConsentPurpose,
  FORM_RULES,
  FieldErrorCode,
  FieldRule,
  MESSAGES,
} from './form-rules';
import { FrappeService } from './frappe.service';

type Payload = Record<string, unknown>;

const HONEYPOT = 'website';
const MAX_KEYS = 60;
const MAX_STRING = 5000;

const TRUE_VALUES = new Set(['true', 'on', 'yes', '1', 'y', 'checked']);
const isTruthy = (v: unknown) => v === true || v === 1 || (typeof v === 'string' && TRUE_VALUES.has(v.trim().toLowerCase()));
const isPurpose = (v: unknown): v is ConsentPurpose => typeof v === 'string' && (CONSENT_PURPOSES as readonly string[]).includes(v);

/** 10-digit Indian mobile. Tolerates spaces, dashes, a leading 0, 91 or +91. */
export function normalisePhone(raw: string): string | null {
  let d = raw.replace(/[^\d]/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

/**
 * An http(s) link with a dotted host. A bare "linkedin.com/in/x" gets https:// added.
 * Returns the normalised URL, or null.
 */
export function normaliseUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s || /\s/.test(s)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s.replace(/^\/+/, '')}`;
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    return null;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (u.username || u.password) return null;
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(u.hostname)) return null;
  return u.toString();
}

function clean(value: unknown): unknown {
  if (typeof value === 'string') return value.trim().slice(0, MAX_STRING);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) return value;
  if (Array.isArray(value)) {
    return value
      .slice(0, 50)
      .filter((v) => ['string', 'number', 'boolean'].includes(typeof v))
      .map((v) => (typeof v === 'string' ? v.trim().slice(0, 500) : v));
  }
  return undefined; // nested objects are not stored
}

@Injectable()
export class FormsService {
  private readonly logger = new Logger('FormsService');
  private readonly file = join(STORAGE_DIR, 'submissions.jsonl');

  constructor(private readonly frappe: FrappeService) {}

  /**
   * Accepts consents as: { consents: {contact: true} } · { consents: ['contact'] } ·
   * { consents: [{purpose:'contact', granted:true}] } · { consent: true } (type default) ·
   * { consent_contact: true } · { contactConsent: true } · { contact: true }.
   */
  private extractConsents(body: Payload, defaultPurpose: ConsentPurpose): { granted: Set<ConsentPurpose>; usedKeys: Set<string> } {
    const granted = new Set<ConsentPurpose>();
    const usedKeys = new Set<string>();

    const read = (v: unknown) => {
      if (v === undefined || v === null) return;
      if (typeof v === 'boolean' || typeof v === 'string' || typeof v === 'number') {
        if (isPurpose(v)) granted.add(v);
        else if (isTruthy(v)) granted.add(defaultPurpose);
        return;
      }
      if (Array.isArray(v)) {
        for (const item of v) {
          if (isPurpose(item)) granted.add(item);
          else if (item && typeof item === 'object') {
            const o = item as Record<string, unknown>;
            const p = o.purpose ?? o.id ?? o.name;
            const ok = o.granted ?? o.checked ?? o.value ?? o.accepted ?? true;
            if (isPurpose(p) && isTruthy(ok)) granted.add(p);
          }
        }
        return;
      }
      if (typeof v === 'object') {
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
          if (isPurpose(k) && isTruthy(val)) granted.add(k);
        }
      }
    };

    for (const key of ['consents', 'consent']) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        usedKeys.add(key);
        read(body[key]);
      }
    }
    for (const purpose of CONSENT_PURPOSES) {
      const camel = purpose.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
      const keys = [`consent_${purpose}`, `consent-${purpose}`, `${camel}Consent`, `consent${camel[0].toUpperCase()}${camel.slice(1)}`, purpose];
      for (const k of keys) {
        if (!Object.prototype.hasOwnProperty.call(body, k)) continue;
        const v = body[k];
        // A bare purpose key (e.g. "newsletter") only counts when it is a boolean-ish flag.
        if (k === purpose && typeof v !== 'boolean' && !(typeof v === 'string' && TRUE_VALUES.has(v.toLowerCase()))) continue;
        usedKeys.add(k);
        if (isTruthy(v)) granted.add(purpose);
      }
    }
    // The newsletter "also on WhatsApp" opt-in may arrive as a flat flag.
    if (Object.prototype.hasOwnProperty.call(body, 'whatsappOptIn')) {
      usedKeys.add('whatsappOptIn');
      if (isTruthy(body.whatsappOptIn)) granted.add('whatsapp_updates');
    }
    return { granted, usedKeys };
  }

  /**
   * First present key among the field's name and aliases. Booleans are treated as absent:
   * every field kind is free text, so a checkbox flag (e.g. `whatsapp: false`) is never a value.
   */
  private pickField(body: Payload, rule: FieldRule): { key: string | null; value: unknown } {
    for (const k of [rule.name, ...(rule.aliases ?? [])]) {
      if (!Object.prototype.hasOwnProperty.call(body, k)) continue;
      const v = body[k];
      if (v === undefined || v === null || v === '' || typeof v === 'boolean') continue;
      return { key: k, value: v };
    }
    return { key: null, value: undefined };
  }

  async submit(type: string, rawBody: unknown) {
    // Own keys only: "__proto__", "constructor", "toString"… are not form types.
    const rule = Object.prototype.hasOwnProperty.call(FORM_RULES, type) ? FORM_RULES[type] : undefined;
    if (!rule) throw new NotFoundException({ message: MESSAGES.unknownType(String(type).slice(0, 40)), fieldErrors: {} });
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      throw new BadRequestException({ message: MESSAGES.unreadable, fieldErrors: {}, fieldCodes: {} });
    }
    // Accept { payload: {...} } or a flat object.
    const outer = rawBody as Payload;
    const body: Payload =
      outer.payload && typeof outer.payload === 'object' && !Array.isArray(outer.payload)
        ? { ...(outer.payload as Payload), ...Object.fromEntries(Object.entries(outer).filter(([k]) => k !== 'payload')) }
        : { ...outer };

    const id = randomUUID();

    // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
    const trap = body[HONEYPOT];
    if (trap !== undefined && trap !== null && trap !== false && String(trap).trim() !== '') {
      return { ok: true, id, message: rule.success(typeof body.name === 'string' ? body.name : '') };
    }

    const fieldErrors: Record<string, string> = {};
    const fieldCodes: Record<string, FieldErrorCode> = {};
    const fail = (field: string, message: string, code: FieldErrorCode) => {
      fieldErrors[field] = message;
      fieldCodes[field] = code;
    };
    const payload: Payload = {};
    const consumed = new Set<string>([HONEYPOT]);

    for (const f of rule.fields) {
      const { key, value } = this.pickField(body, f);
      if (key) consumed.add(key);
      // Text, email and textarea take strings only; a phone may also arrive as a number.
      // Anything else (objects, arrays) would be stored as "[object Object]", so reject it.
      const accepted = typeof value === 'string' || (f.kind === 'phone' && typeof value === 'number' && Number.isFinite(value));
      if (value !== undefined && !accepted) {
        // Present but the wrong type (e.g. email: ['a@b.co']): say it is malformed, not missing.
        fail(f.name, f.kind === 'email' ? MESSAGES.email : f.kind === 'phone' ? MESSAGES.phone : MESSAGES.format(f.label), f.kind === 'email' ? 'email' : f.kind === 'phone' ? 'tel' : 'format');
        continue;
      }
      const str = value === undefined ? '' : String(value).trim();

      if (!str) {
        if (f.required) fail(f.name, MESSAGES.required(f.label), 'required');
        continue;
      }
      if (f.max && str.length > f.max) {
        fail(f.name, MESSAGES.tooLong(f.label, f.max), 'max');
        continue;
      }
      if (f.kind === 'email') {
        if (!isEmail(str)) fail(f.name, MESSAGES.email, 'email');
        else payload[f.name] = str.toLowerCase();
        continue;
      }
      if (f.kind === 'phone') {
        const phone = normalisePhone(str);
        if (!phone) fail(f.name, MESSAGES.phone, 'tel');
        else payload[f.name] = phone;
        continue;
      }
      if (f.kind === 'url') {
        const url = normaliseUrl(str);
        if (!url) fail(f.name, MESSAGES.url, 'format');
        else payload[f.name] = url;
        continue;
      }
      payload[f.name] = str;
    }

    if (rule.oneOf && !rule.oneOf.names.some((n) => payload[n] || fieldErrors[n])) {
      fail(rule.oneOf.errorField, rule.oneOf.error, 'required');
    }

    // Under-18 sign-ups need a parent or guardian (Book 2 §13.4).
    if (type === 'join' && isTruthy(body.under18 ?? body.isUnder18) && !payload.guardianPhone && !fieldErrors.guardianPhone) {
      fail('guardianPhone', MESSAGES.required("parent or guardian's mobile number"), 'required');
    }

    // Consents
    const { granted, usedKeys } = this.extractConsents(body, rule.defaultConsent);
    usedKeys.forEach((k) => consumed.add(k));
    if (!rule.requiredConsent.some((p) => granted.has(p))) {
      fail('consent', MESSAGES.consent, 'consent');
    }
    // WhatsApp updates are optional, and only valid with a phone number.
    if (granted.has('whatsapp_updates') && !payload.phone && !fieldErrors.phone) {
      fail('phone', MESSAGES.whatsappNeedsPhone, 'required');
    }

    if (Object.keys(fieldErrors).length) {
      throw new BadRequestException({ message: MESSAGES.summary, fieldErrors, fieldCodes });
    }

    // Keep any extra context fields the page sends (source page, brand, topics…), cleaned.
    let extras = 0;
    for (const [k, v] of Object.entries(body)) {
      if (consumed.has(k) || k in payload || extras >= MAX_KEYS) continue;
      if (!/^[A-Za-z][\w.-]{0,40}$/.test(k)) continue;
      const c = clean(v);
      if (c === undefined || c === '') continue;
      payload[k] = c;
      extras++;
    }

    const at = new Date().toISOString();
    const record = {
      id,
      type,
      receivedAt: at,
      payload,
      consents: [...granted].map((purpose) => ({ purpose, version: CONSENT_VERSION, at })),
    };

    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
      await fs.appendFile(this.file, `${JSON.stringify(record)}\n`, 'utf8');
    } catch (err) {
      this.logger.error(`Could not store submission ${id}: ${(err as Error).message}`);
      throw err; // → 500 "Internal server error"
    }
    // Copy to Frappe in the background; a Frappe outage never fails the visitor's form.
    void this.frappe.send(record);

    return { ok: true, id, message: rule.success(String(payload.name ?? '')) };
  }
}
