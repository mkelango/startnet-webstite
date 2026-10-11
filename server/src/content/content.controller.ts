import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { SearchService } from './search.service';

type Q = Record<string, string | string[] | undefined>;

/** Read-only content endpoints (docs/CONTRACT.md, API table). All mounted under /api. */
@Controller()
export class ContentController {
  constructor(
    private readonly content: ContentService,
    private readonly searchService: SearchService,
  ) {}

  @Get('health')
  health() {
    return { ok: true, time: new Date().toISOString() };
  }

  /** ?brand=&key= (comma-separated) · extras: group=, tag= */
  @Get('metrics')
  metrics(@Query() q: Q) {
    return this.content.findMetrics(q);
  }

  /** ?brand=&status=&stage=&format=&language=&price= · extras: need=, pool= */
  @Get('programmes')
  programmes(@Query() q: Q) {
    return this.content.findProgrammes(q);
  }

  @Get('programmes/:slug')
  programme(@Param('slug') slug: string) {
    return this.content.getProgramme(slug);
  }

  /** ?brand=&when=upcoming|past|week|month|quarter&district=&format=&series= · status= is an alias of when · extras: language=, price=, limit= */
  @Get('events')
  events(@Query() q: Q) {
    return this.content.findEvents(q);
  }

  @Get('events/:slug')
  event(@Param('slug') slug: string) {
    return this.content.getEvent(slug);
  }

  /** ?brand=&type=founder|partner|recap */
  @Get('stories')
  stories(@Query() q: Q) {
    return this.content.findStories(q);
  }

  @Get('stories/:slug')
  story(@Param('slug') slug: string) {
    return this.content.getStory(slug);
  }

  @Get('reports')
  reports(@Query() q: Q) {
    return this.content.findReports(q);
  }

  @Get('reports/:slug')
  report(@Param('slug') slug: string) {
    return this.content.getReport(slug);
  }

  /** ?group=leadership|brand-leads|advisory */
  @Get('people')
  people(@Query() q: Q) {
    return this.content.findPeople(q);
  }

  /** Signed partners only; [] until agreements are signed. */
  @Get('partners')
  partners() {
    return this.content.signedPartners();
  }

  @Get('careers')
  careers(@Query() q: Q) {
    return this.content.findCareers(q);
  }

  @Get('press')
  press(@Query() q: Q) {
    return this.content.findPress(q);
  }

  @Get('ledger')
  ledger() {
    return this.content.ledger();
  }

  /** ?q=&limit=(1-100)&lang=en|ta · lang=ta returns Tamil titles and snippets where they exist; one-letter Latin terms are ignored */
  @Get('search')
  search(@Query('q') q?: unknown, @Query('limit') limit?: unknown, @Query('lang') lang?: unknown) {
    // q may arrive as a string, an array (?q=a&q=b) or an object (?q[a]=1); only strings count.
    const query = Array.isArray(q)
      ? q.filter((x): x is string => typeof x === 'string').join(' ')
      : typeof q === 'string'
        ? q
        : '';
    const n = Math.min(Math.max(Number(typeof limit === 'string' ? limit : undefined) || 30, 1), 100);
    const language = lang === 'ta' ? 'ta' : 'en';
    const results = this.searchService.search(query.slice(0, 200), n, language);
    return { query, total: results.length, results };
  }
}
