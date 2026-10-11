import { Injectable } from '@nestjs/common';
import { ContentService } from './content.service';

export interface SearchResult {
  type: 'programme' | 'event' | 'story' | 'report' | 'page';
  title: string;
  url: string;
  brand?: string;
  snippet: string;
  score: number;
}

interface Doc {
  type: SearchResult['type'];
  title: string;
  /** Tamil title (Book 2 §14), returned instead of `title` when lang=ta */
  titleTa?: string;
  url: string;
  brand?: string;
  snippet: string;
  /** Tamil snippet, returned instead of `snippet` when lang=ta */
  snippetTa?: string;
  text: string; // extra searchable text (summary, keywords…)
}

const TAMIL_RUN = /[஀-௿]+/g;
const NON_TAMIL_RUN = /[^஀-௿]+/g;

/**
 * Lower-case and fold Latin diacritics (café → cafe). Tamil runs are only NFC-normalised:
 * NFKD + mark stripping would delete Tamil vowel signs and change the word.
 */
const norm = (s: unknown) =>
  String(s ?? '')
    .toLowerCase()
    .replace(NON_TAMIL_RUN, (run) => run.normalize('NFKD').replace(/[̀-ͯ]/g, ''))
    .replace(TAMIL_RUN, (run) => run.normalize('NFC'));

/** Letters, combining marks (Tamil vowel signs, virama) and digits form words. */
const tokens = (s: string) => norm(s).split(/[^\p{L}\p{M}\p{N}]+/u).filter((t) => t.length > 0);

const HAS_TAMIL = /[஀-௿]/;
/** Query terms: single Latin letters or digits ("a", "b") match almost everything, so they are dropped; Tamil runs are kept. */
const queryTokens = (s: string) => [...new Set(tokens(s).filter((t) => t.length >= 2 || HAS_TAMIL.test(t)))];

const strs = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? [v] : [];

const clip = (s: string, n = 180) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/** Small, dependency-free scorer over programmes, events, stories, reports and key pages. */
@Injectable()
export class SearchService {
  private docs: Doc[] | null = null;

  constructor(private readonly content: ContentService) {}

  private index(): Doc[] {
    if (this.docs) return this.docs;
    const c = this.content;
    const docs: Doc[] = [];

    for (const p of c.programmes) {
      docs.push({
        type: 'programme',
        title: p.title,
        url: (p.url as string) || `/programmes/${p.slug}`,
        brand: p.brand,
        titleTa: strs(p.titleTa)[0],
        snippet: p.summary,
        snippetTa: strs(p.summaryTa)[0],
        text: [
          p.summary,
          ...strs(p.summaryTa),
          ...strs(p.headlineTa),
          p.headline,
          p.duration,
          p.priceNote,
          ...(p.pools ?? []),
          ...strs(p.keywords),
          ...strs(p.titleTa),
          ...strs(p.keywordsTa),
        ].join(' '),
      });
    }
    for (const e of c.events) {
      docs.push({
        type: 'event',
        title: e.title,
        url: `/events/${e.slug}`,
        brand: e.brand,
        titleTa: strs(e.titleTa)[0],
        snippet: [e.dateLabel, e.summary].filter(Boolean).join(' · '),
        snippetTa: e.summaryTa ? [strs(e.dateLabelTa)[0] ?? e.dateLabel, strs(e.summaryTa)[0]].filter(Boolean).join(' · ') : undefined,
        text: [
          e.summary,
          e.series,
          e.city,
          e.district,
          e.dateLabel,
          ...strs(e.titleTa),
          ...strs(e.summaryTa),
          ...strs(e.cityTa),
          ...strs(e.dateLabelTa),
          ...strs(e.keywordsTa),
        ].join(' '),
      });
    }
    for (const s of c.stories) {
      if (s.placeholder) continue; // never surface placeholder stories in search
      docs.push({
        type: 'story',
        title: s.title,
        url: `/insights/stories/${s.slug}`,
        brand: s.brand,
        titleTa: strs(s.titleTa)[0],
        snippet: s.excerpt,
        snippetTa: strs(s.excerptTa)[0],
        text: [s.excerpt, s.district, s.programme, ...(s.body ?? []), ...strs(s.titleTa), ...strs(s.excerptTa)].join(' '),
      });
    }
    for (const r of c.reports) {
      docs.push({
        type: 'report',
        title: r.title,
        url: (r.url as string) || '/insights/reports',
        titleTa: strs(r.titleTa)[0],
        snippet: r.summary,
        snippetTa: strs(r.summaryTa)[0],
        text: [r.summary, r.kind, String(r.year), ...strs(r.titleTa), ...strs(r.summaryTa), ...strs(r.keywordsTa)].join(' '),
      });
    }
    for (const pg of c.pages) {
      docs.push({
        type: 'page',
        title: pg.title,
        url: pg.url,
        brand: pg.brand,
        titleTa: pg.titleTa,
        snippet: pg.snippet,
        snippetTa: pg.descriptionTa,
        text: [pg.snippet, ...(pg.keywords ?? []), ...strs(pg.titleTa), ...strs(pg.descriptionTa), ...strs(pg.keywordsTa)].join(' '),
      });
    }
    this.docs = docs;
    return docs;
  }

  search(q: string, limit = 30, lang: 'en' | 'ta' = 'en'): SearchResult[] {
    const query = norm(q).trim();
    if (query.length < 2) return [];
    const terms = queryTokens(query);
    if (!terms.length) return [];
    const max = Math.min(Math.max(Math.floor(limit) || 30, 1), 100);

    const results: SearchResult[] = [];
    for (const d of this.index()) {
      const titleText = d.titleTa ? `${d.title} ${d.titleTa}` : d.title;
      const title = norm(titleText);
      const titleTokens = tokens(titleText);
      const bodyText = `${d.snippet} ${d.snippetTa ?? ''} ${d.text}`;
      const body = norm(bodyText);
      const bodyTokens = new Set(tokens(bodyText));

      let score = 0;
      let matchedAll = true;
      for (const t of terms) {
        let s = 0;
        if (titleTokens.includes(t)) s += 10;
        else if (titleTokens.some((w) => w.startsWith(t))) s += 7;
        else if (title.includes(t)) s += 5;
        if (bodyTokens.has(t)) s += 3;
        else if (body.includes(t)) s += 1;
        if (s === 0) matchedAll = false;
        score += s;
      }
      if (score === 0) continue;
      // "vibe" should land on "StartNet Vibe" before "Vibe Clubs".
      const core = norm(d.title).replace(/^startnet\s+/, '');
      const ta = d.titleTa ? norm(d.titleTa) : '';
      if (norm(d.title) === query || core === query || (ta && ta === query)) score += 25;
      else if (ta && ta.startsWith(query)) score += 6;
      else if (core.startsWith(query)) score += 6;
      else if (terms.length > 1 && title.includes(query)) score += 8;
      if (matchedAll && terms.length > 1) score += 5;
      if (d.type === 'page') score += 1; // gentle nudge toward section hubs on ties

      results.push({
        type: d.type,
        title: lang === 'ta' && d.titleTa ? d.titleTa : d.title,
        url: d.url,
        ...(d.brand ? { brand: d.brand } : {}),
        snippet: clip(lang === 'ta' && d.snippetTa ? d.snippetTa : d.snippet),
        score,
      });
    }

    // De-duplicate by URL (a programme and a page can share one), keep the best.
    const best = new Map<string, SearchResult>();
    for (const r of results) {
      const prev = best.get(r.url);
      if (!prev || r.score > prev.score) best.set(r.url, r);
    }
    return [...best.values()].sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, max);
  }
}
