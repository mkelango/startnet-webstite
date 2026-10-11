// Data shapes from docs/CONTRACT.md. Extra optional fields are additive
// (asAtLabel, url, dateConfirmed, placeholder…) and never replace a contract field.
//
// Tamil: every user-visible string may carry a `<field>Ta` sibling (titleTa, summaryTa, labelTa…).
// The API returns both; the client picks by language and falls back to English. All Tamil in
// server/data is a DRAFT pending native review (Book 2 §14, Appendix A #14): see data/i18n-status.json.

export type Tag = 'A' | 'B' | 'C';
export type BrandKey = 'research' | 'vibe' | 'connect' | 'women' | 'x' | 'startnet';

export interface Metric {
  id: string;
  key: string;
  value: number | string | null;
  unit?: string;
  prefix?: string;
  label: string;
  labelTa?: string;
  noteTa?: string;
  asAtLabelTa?: string;
  tag: Tag;
  asAt: string | null;
  asAtLabel?: string;
  source: string;
  sourceType?: string;
  note?: string;
  brand?: BrandKey;
  groups?: string[];
  placeholder?: string;
}

export interface Programme {
  slug: string;
  title: string;
  titleTa?: string;
  brand: BrandKey;
  summary: string;
  summaryTa?: string;
  headlineTa?: string;
  keywordsTa?: string[];
  status: 'open' | 'closing' | 'upcoming' | 'closed' | 'rolling';
  applyBy?: string | null;
  stageEntry: string;
  stageExit: string;
  format: 'online' | 'in-person' | 'hybrid';
  languages: string[];
  price: 'free' | 'paid' | 'sponsored';
  priceNote?: string;
  duration?: string;
  need: 'learn' | 'start' | 'raise' | 'customers';
  eligibility?: string[];
  outcomes?: string[];
  ctaLabel: string;
  snxPath: string;
  url?: string;
  pools?: string[];
  [extra: string]: unknown;
}

export interface EventItem {
  slug: string;
  title: string;
  titleTa?: string;
  series?: string;
  brand: BrandKey;
  date: string | null;
  dateLabelTa?: string;
  cityTa?: string;
  placeTa?: string;
  summaryTa?: string;
  endDate?: string | null;
  city: string;
  district: string;
  venue?: string;
  format: 'online' | 'in-person' | 'hybrid';
  language: string;
  price: 'free' | 'paid';
  priceNote?: string;
  seats?: 'available' | 'few' | 'full';
  status: 'upcoming' | 'past';
  summary: string;
  agenda?: { time: string; title: string; speaker?: string }[];
  outcomes?: Metric[];
  outcomeIds?: string[];
  [extra: string]: unknown;
}

export interface Story {
  slug: string;
  title: string;
  brand: BrandKey;
  titleTa?: string;
  excerptTa?: string;
  type: 'founder' | 'partner' | 'recap';
  person?: string;
  district?: string;
  ladderFrom?: string;
  ladderTo?: string;
  programme?: string;
  readingMinutes: number;
  excerpt: string;
  body: string[];
  outcome?: Metric | null;
  outcomeId?: string;
  date: string | null;
  placeholder?: boolean;
  [extra: string]: unknown;
}

export interface Report {
  slug: string;
  title: string;
  titleTa?: string;
  summaryTa?: string;
  statusLabelTa?: string;
  kind: 'ledger' | 'report' | 'index';
  year: number;
  status: 'published' | 'upcoming';
  summary: string;
  keyFindings?: Metric[];
  keyFindingIds?: string[];
  formats?: { lang: string; format: string; size: string }[];
  url?: string;
  [extra: string]: unknown;
}

export interface Person {
  slug: string;
  name: string;
  nameTa?: string;
  role: string;
  roleTa?: string;
  org?: string;
  brand?: BrandKey;
  group: 'leadership' | 'brand-leads' | 'advisory';
  bio?: string;
  [extra: string]: unknown;
}

export interface Partner {
  slug: string;
  name: string;
  type: string;
  since: string;
  agreementStatus: string;
  logoPermission: boolean;
  [extra: string]: unknown;
}

export interface Role {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  applyUrl?: string;
}

export interface PressItem {
  slug: string;
  title: string;
  outlet?: string;
  date: string;
  kind: 'release' | 'coverage';
  url?: string;
}

export interface LedgerFile {
  period: string;
  asAt: string | null;
  kpiIds: string[];
  byBrand: unknown[];
  byDistrict: unknown[];
  corrections: unknown[];
  [extra: string]: unknown;
}

export interface SitePage {
  title: string;
  url: string;
  brand?: BrandKey;
  snippet: string;
  keywords?: string[];
  /** Tamil title (Book 2 §14 terms), returned by /api/search when lang=ta */
  titleTa?: string;
  /** Tamil snippet / meta description, returned by /api/search when lang=ta */
  descriptionTa?: string;
  /** Tamil search terms, indexed but not displayed */
  keywordsTa?: string[];
}
