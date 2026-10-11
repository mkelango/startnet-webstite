import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { DATA_DIR } from '../common/paths';
import {
  EventItem,
  LedgerFile,
  Metric,
  Partner,
  Person,
  PressItem,
  Programme,
  Report,
  Role,
  SitePage,
  Story,
} from './types';

type Query = Record<string, string | string[] | undefined>;

/** "a,b" or ["a","b"] → ['a','b'] (lower-cased, trimmed). Empty → null (no filter). */
function list(param: string | string[] | undefined): string[] | null {
  if (param === undefined || param === null) return null;
  const raw = Array.isArray(param) ? param.join(',') : String(param);
  const values = raw
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter((v) => v && v !== 'all' && v !== 'any');
  return values.length ? values : null;
}

const slugify = (s: string) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Does a scalar or array field match any of the wanted values? */
function matches(field: unknown, wanted: string[] | null): boolean {
  if (!wanted) return true;
  const values = (Array.isArray(field) ? field : [field])
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).toLowerCase());
  return values.some((v) => wanted.includes(v) || wanted.includes(slugify(v)));
}

const WHEN_VALUES = new Set(['upcoming', 'past', 'week', 'month', 'quarter']);

const LEVELS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'];
const levelIndex = (l: string) => LEVELS.indexOf(String(l ?? '').toLowerCase());

const STATUS_ORDER: Record<string, number> = { open: 0, closing: 1, rolling: 2, upcoming: 3, closed: 4 };
const PRICE_ORDER: Record<string, number> = { free: 0, sponsored: 1, paid: 2 };

const time = (iso: string | null | undefined) => {
  if (!iso) return Number.NaN;
  return new Date(iso).getTime();
};

@Injectable()
export class ContentService {
  private readonly logger = new Logger('ContentService');

  readonly metrics: Metric[];
  readonly programmes: Programme[];
  readonly events: EventItem[];
  readonly stories: Story[];
  readonly reports: Report[];
  readonly people: Person[];
  readonly partners: Partner[];
  readonly careers: Role[];
  readonly press: PressItem[];
  readonly pages: SitePage[];
  private readonly ledgerFile: LedgerFile | null;
  private readonly metricById = new Map<string, Metric>();

  constructor() {
    this.metrics = this.load<Metric[]>('metrics', []);
    for (const m of this.metrics) this.metricById.set(m.id, m);

    this.programmes = this.load<Programme[]>('programmes', []);
    this.events = this.load<EventItem[]>('events', []).map((e) => this.expandEvent(e));
    this.stories = this.load<Story[]>('stories', []).map((s) => this.expandStory(s));
    this.reports = this.load<Report[]>('reports', []).map((r) => this.expandReport(r));
    this.people = this.load<Person[]>('people', []);
    this.partners = this.load<Partner[]>('partners', []);
    this.careers = this.load<Role[]>('careers', []);
    this.press = this.load<PressItem[]>('press', []);
    this.pages = this.load<SitePage[]>('pages', []);
    this.ledgerFile = this.load<LedgerFile | null>('ledger', null);

    this.logger.log(
      `Loaded from ${DATA_DIR}: ${this.metrics.length} metrics, ${this.programmes.length} programmes, ` +
        `${this.events.length} events, ${this.stories.length} stories, ${this.reports.length} reports, ` +
        `${this.people.length} people, ${this.signedPartners().length} signed partners, ${this.pages.length} pages`,
    );
  }

  private load<T>(name: string, fallback: T): T {
    const file = join(DATA_DIR, `${name}.json`);
    if (!existsSync(file)) {
      this.logger.warn(`Missing data file ${file}; using an empty default`);
      return fallback;
    }
    try {
      return JSON.parse(readFileSync(file, 'utf8')) as T;
    } catch (err) {
      this.logger.error(`Could not parse ${file}: ${(err as Error).message}`);
      return fallback;
    }
  }

  private metricsFor(ids: string[] | undefined): Metric[] {
    return (ids ?? []).map((id) => this.metricById.get(id)).filter((m): m is Metric => !!m);
  }

  private expandEvent(e: EventItem): EventItem {
    const { outcomeIds, ...rest } = e;
    return outcomeIds ? { ...rest, outcomes: this.metricsFor(outcomeIds) } : rest;
  }

  private expandStory(s: Story): Story {
    const { outcomeId, ...rest } = s;
    return outcomeId ? { ...rest, outcome: this.metricById.get(outcomeId) ?? null } : rest;
  }

  private expandReport(r: Report): Report {
    const { keyFindingIds, ...rest } = r;
    return keyFindingIds ? { ...rest, keyFindings: this.metricsFor(keyFindingIds) } : rest;
  }

  private notFound(what: string, slug: string): never {
    throw new NotFoundException({ message: `No ${what} found for "${slug}".` });
  }

  // ---- Metrics ---------------------------------------------------------------

  findMetrics(q: Query): Metric[] {
    const brand = list(q.brand);
    const key = list(q.key);
    const group = list(q.group);
    const tag = list(q.tag);
    let out = this.metrics.filter(
      (m) =>
        (matches(m.brand, brand) || (!!brand && brand.some((b) => (m.groups ?? []).includes(`${b}-proof`)))) &&
        (!key || key.includes(m.key.toLowerCase()) || key.includes(m.id.toLowerCase())) &&
        matches(m.groups ?? [], group) &&
        matches(m.tag, tag),
    );
    // When specific keys are asked for, return them in the order asked.
    if (key) out = [...out].sort((a, b) => indexOfKey(key, a) - indexOfKey(key, b));
    return out;
  }

  // ---- Programmes ------------------------------------------------------------

  findProgrammes(q: Query): Programme[] {
    const brand = list(q.brand);
    const status = list(q.status);
    const stage = list(q.stage);
    const format = list(q.format);
    const language = list(q.language ?? q.lang);
    const price = list(q.price);
    const need = list(q.need);
    const pool = list(q.pool);

    return this.programmes
      .filter((p) => matches(p.brand, brand))
      .filter((p) => matches(p.status, status))
      .filter((p) => matches(p.format, format))
      .filter((p) => matches(p.price, price))
      .filter((p) => matches(p.need, need))
      .filter((p) => matches(p.pools ?? [], pool))
      .filter((p) => {
        if (!language) return true;
        const langs = (p.languages ?? []).map((l) => l.toLowerCase());
        return language.some((l) => (l === 'bilingual' ? langs.includes('en') && langs.includes('ta') : langs.includes(l)));
      })
      .filter((p) => {
        if (!stage) return true;
        const from = levelIndex(p.stageEntry);
        const to = levelIndex(p.stageExit);
        return stage.some((s) => {
          // accepts "l2" or a range "l1-l2"
          const [a, b = a] = s.split('-').map(levelIndex);
          if (a < 0) return false;
          return a <= to && b >= from;
        });
      })
      .sort(
        (a, b) =>
          (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) ||
          (PRICE_ORDER[a.price] ?? 9) - (PRICE_ORDER[b.price] ?? 9),
      );
  }

  getProgramme(slug: string): Programme {
    return this.programmes.find((p) => p.slug === slug) ?? this.notFound('programme', slug);
  }

  // ---- Events ----------------------------------------------------------------

  findEvents(q: Query): EventItem[] {
    const brand = list(q.brand);
    const district = list(q.district);
    const format = list(q.format);
    const series = list(q.series);
    const language = list(q.language ?? q.lang);
    const price = list(q.price);
    // Only the documented values filter; anything else (when=bogus) is ignored, i.e. all events.
    const whenParam = list(q.when ?? q.status);
    const when = whenParam?.find((w) => WHEN_VALUES.has(w)) ?? null;
    const now = Date.now();
    const horizonDays: Record<string, number> = { week: 7, month: 31, quarter: 92 };

    let out = this.events
      .filter((e) => matches(e.brand, brand))
      .filter((e) => matches(e.district, district) || matches(e.city, district))
      .filter((e) => matches(e.format, format))
      .filter((e) => matches(e.series, series))
      .filter((e) => matches(e.price, price))
      .filter((e) => !language || matches(e.language, language) || e.language === 'bilingual')
      .filter((e) => {
        if (!when) return true;
        if (when === 'past') return e.status === 'past';
        if (e.status !== 'upcoming') return false;
        if (when in horizonDays) {
          const t = time(e.date);
          return !Number.isNaN(t) && t - now <= horizonDays[when] * 86400000;
        }
        return true; // upcoming
      });

    const dir = when === 'past' ? -1 : 1;
    out = [...out].sort((a, b) => {
      const ta = time(a.date);
      const tb = time(b.date);
      if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
      if (Number.isNaN(ta)) return 1; // undated last
      if (Number.isNaN(tb)) return -1;
      return (ta - tb) * dir;
    });

    const limit = Math.floor(Number(Array.isArray(q.limit) ? q.limit[0] : q.limit));
    return limit > 0 ? out.slice(0, Math.min(limit, 200)) : out;
  }

  getEvent(slug: string): EventItem {
    return this.events.find((e) => e.slug === slug) ?? this.notFound('event', slug);
  }

  // ---- Stories ---------------------------------------------------------------

  findStories(q: Query): Story[] {
    const brand = list(q.brand);
    const type = list(q.type);
    const district = list(q.district);
    return this.stories
      .filter((s) => matches(s.brand, brand) && matches(s.type, type) && matches(s.district, district))
      .sort((a, b) => {
        // real stories first, then newest first
        if (!!a.placeholder !== !!b.placeholder) return a.placeholder ? 1 : -1;
        return (time(b.date) || 0) - (time(a.date) || 0);
      });
  }

  getStory(slug: string): Story {
    return this.stories.find((s) => s.slug === slug) ?? this.notFound('story', slug);
  }

  // ---- Reports, people, partners, careers, press ------------------------------

  findReports(q: Query): Report[] {
    const kind = list(q.kind);
    const status = list(q.status);
    return this.reports.filter((r) => matches(r.kind, kind) && matches(r.status, status));
  }

  getReport(slug: string): Report {
    return this.reports.find((r) => r.slug === slug) ?? this.notFound('report', slug);
  }

  findPeople(q: Query): Person[] {
    const group = list(q.group);
    const brand = list(q.brand);
    return this.people.filter((p) => matches(p.group, group) && matches(p.brand, brand));
  }

  /** Partners appear only when signed, with logo permission (Book 1 Part B §8). */
  signedPartners(): Partner[] {
    return this.partners.filter((p) => p.agreementStatus === 'signed' && !!p.since);
  }

  findCareers(q: Query): Role[] {
    const team = list(q.team);
    const type = list(q.type);
    return this.careers.filter((r) => matches(r.team, team) && matches(r.type, type));
  }

  findPress(q: Query): PressItem[] {
    const kind = list(q.kind);
    return this.press.filter((p) => matches(p.kind, kind)).sort((a, b) => (time(b.date) || 0) - (time(a.date) || 0));
  }

  // ---- Ledger ----------------------------------------------------------------

  ledger() {
    const file = this.ledgerFile ?? ({ period: '', asAt: null, kpiIds: [], byBrand: [], byDistrict: [], corrections: [] } as LedgerFile);
    const { kpiIds, ...rest } = file;
    return {
      ...rest,
      period: file.period,
      asAt: file.asAt,
      kpis: this.metricsFor(kpiIds),
      byBrand: file.byBrand ?? [],
      byDistrict: file.byDistrict ?? [],
      corrections: file.corrections ?? [],
    };
  }
}

function indexOfKey(keys: string[], m: Metric): number {
  const i = keys.indexOf(m.key.toLowerCase());
  return i >= 0 ? i : keys.indexOf(m.id.toLowerCase());
}
