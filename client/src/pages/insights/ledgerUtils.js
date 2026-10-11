// Page-local helpers for the Insights pages (Founder Ledger normalisers, CSV export, shared copy).
// The /api/ledger shape is defined in docs/CONTRACT.md; nested rows are normalised defensively so the
// pages keep working whether a figure arrives as a number or as a Metric object.
import { createElement } from 'react';
import { BRANDS } from '../../data/brands.js';

/** Founder ladder L1–L7 (Book 2 §2.3 / Book 1 §7). */
export const LEVELS = [
  { code: 'L1', name: 'Aware', rule: 'Attended an event or joined the community. Tracked, not counted as nurtured.',
    nameTa: 'அறிமுகம்', ruleTa: 'ஒரு நிகழ்வில் கலந்துகொண்டவர் அல்லது சமூகத்தில் இணைந்தவர். பதிவு செய்யப்படும், ஆனால் "வளர்க்கப்பட்டவர்" எனக் கணக்கிடப்படாது.' },
  { code: 'L2', name: 'Nurtured', rule: 'A StartNet X profile plus at least two meaningful touchpoints.',
    nameTa: 'வளர்க்கப்பட்டவர்', ruleTa: 'ஒரு StartNet X சுயவிவரமும், குறைந்தது இரண்டு அர்த்தமுள்ள தொடர்புகளும்.' },
  { code: 'L3', name: 'Skilled', rule: 'Completed a structured programme.',
    nameTa: 'திறன் பெற்றவர்', ruleTa: 'கட்டமைக்கப்பட்ட ஒரு திட்டத்தை நிறைவு செய்தவர்.' },
  { code: 'L4', name: 'Building', rule: 'A team with a prototype or MVP in progress.',
    nameTa: 'உருவாக்குபவர்', ruleTa: 'முன்மாதிரி அல்லது MVP உருவாக்கத்தில் உள்ள ஒரு குழு.' },
  { code: 'L5', name: 'Launched', rule: 'A registered company.',
    nameTa: 'தொடங்கியவர்', ruleTa: 'பதிவு செய்யப்பட்ட ஒரு நிறுவனம்.' },
  { code: 'L6', name: 'Funded', rule: 'First external capital, or ₹10 L+ revenue.',
    nameTa: 'நிதி பெற்றவர்', ruleTa: 'முதல் வெளி முதலீடு, அல்லது ₹10 L+ வருவாய்.' },
  { code: 'L7', name: 'Scaling', rule: '₹1 Cr+ revenue, Series A, or 25+ jobs.',
    nameTa: 'விரிவடைபவர்', ruleTa: '₹1 Cr+ வருவாய், Series A, அல்லது 25+ வேலைவாய்ப்புகள்.' },
];

export const BRAND_ORDER = ['research', 'vibe', 'connect', 'women'];
export const METRO_DISTRICTS = ['chennai', 'coimbatore', 'kancheepuram', 'kanchipuram'];
export const MISSION_TARGET = 100000;
export const WOMEN_FLOOR = 40;
export const PLACEHOLDER = '[placeholder — to be supplied by StartNet]';
export const PLACEHOLDER_TA = '[placeholder — StartNet வழங்கும்]';

/* ------------------------------------------------------------------ */
/* Language helpers for the Insights pages (Tamil drafts pending native review, Book 2 §14). */
/* ------------------------------------------------------------------ */

/** obj[field + 'Ta'] on /ta pages when the API supplies it, else obj[field]. */
export const pickLang = (obj, field, lang) => (lang === 'ta' && obj && obj[`${field}Ta`]) || (obj ? obj[field] : undefined);

/** True when a Tamil page shows English API copy for this field (mark it lang="en", WCAG 3.1.2). */
export const isEnFallback = (obj, field, lang) => lang === 'ta' && !!obj && !!obj[field] && !obj[`${field}Ta`];

/** Localised level name / rule. */
export const levelName = (l, lang) => (lang === 'ta' && l?.nameTa) || l?.name || '';
export const levelRule = (l, lang) => (lang === 'ta' && l?.ruleTa) || l?.rule || '';

/** "12 Jan 2027" / "12 ஜன., 2027" — Latin digits always (Book 3 §4.4 rule 5). */
export function fmtDate(iso, lang = 'en', opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { ...opts, timeZone: 'Asia/Kolkata', numberingSystem: 'latn' });
}

const CARD_FIELDS = ['title', 'excerpt', 'summary'];
/**
 * Seed copy is English; give story/report cards the Tamil fields when the API carries them. With the default
 * card fields, English left on a Tamil page is wrapped in <span lang="en"> (WCAG 3.1.2) — Card renders nodes.
 * Pass explicit `fields` (e.g. ['label'] for a Stat metric) to get plain strings only.
 */
export const localiseItem = (item, lang, fields) => {
  if (lang !== 'ta' || !item) return item;
  const out = { ...item };
  (fields || CARD_FIELDS).forEach((f) => {
    if (item[`${f}Ta`]) out[f] = item[`${f}Ta`];
    else if (!fields && typeof item[f] === 'string' && item[f] && !/[஀-௿]/.test(item[f])) {
      out[f] = createElement('span', { lang: 'en' }, item[f]);
    }
  });
  return out;
};

/** A number from a number or a Metric-like object; null when unknown. */
export const num = (x) => {
  if (typeof x === 'number' && Number.isFinite(x)) return x;
  if (x && typeof x === 'object' && typeof x.value === 'number' && Number.isFinite(x.value)) return x.value;
  return null;
};
const tagFrom = (...xs) => {
  for (const x of xs) {
    if (x && typeof x === 'object' && x.tag) return x.tag;
    if (typeof x === 'string' && /^[ABC]$/.test(x)) return x;
  }
  return null;
};
const TAG_RANK = { A: 1, B: 2, C: 3 };
/** The weakest tag among inputs (a derived figure is only as strong as its weakest input). */
export const weakestTag = (tags) => tags.filter(Boolean).sort((a, b) => TAG_RANK[b] - TAG_RANK[a])[0] || null;

export function periodInfo(data) {
  const p = data?.period;
  const id = typeof p === 'string' ? p : p?.id || p?.slug || null;
  const label = (typeof p === 'object' && p?.label) || (id ? id.replace(/-/g, ' ').replace(/q(\d)/i, 'Q$1') : null);
  return {
    id,
    label,
    published: data?.publishedAt || data?.published || (typeof p === 'object' ? p?.published : null) || null,
    next: data?.nextEdition || data?.next || (typeof p === 'object' ? p?.next : null) || null,
    publishedLabel: data?.publishedLabel || null,
    nextLabel: data?.nextEditionLabel || null,
    edition: data?.edition || null,
    upcoming: data?.status === 'upcoming',
    asAt: data?.asAt || null,
  };
}

/** Available editions for the period selector. */
export function periodOptions(data) {
  const list = Array.isArray(data?.periods) ? data.periods : [];
  const opts = list
    .map((p) => (typeof p === 'string' ? { id: p, label: p.replace(/-/g, ' ') } : { id: p.id || p.slug, label: p.label || p.id || p.slug }))
    .filter((o) => o.id);
  const cur = periodInfo(data);
  if (cur.id && !opts.some((o) => o.id === cur.id)) opts.unshift({ id: cur.id, label: cur.label });
  return opts;
}

export function findKpi(kpis, re) {
  return (kpis || []).find((k) => re.test(`${k.key || ''} ${k.id || ''} ${k.label || ''}`.toLowerCase())) || null;
}

export function normaliseLevels(data) {
  const raw = data?.byLevel || data?.ladder || data?.levels || [];
  return LEVELS.map((lvl) => {
    const row = raw.find((r) => (r.level || r.code || r.key || '').toString().toUpperCase() === lvl.code) || {};
    return {
      ...lvl,
      value: num(row.count ?? row.value ?? row.metric),
      change: num(row.change ?? row.delta),
      tag: tagFrom(row.metric, row.count, row.value, row.tag),
    };
  });
}

export function normaliseBrands(data) {
  const raw = data?.byBrand || [];
  return BRAND_ORDER.map((key) => {
    const row = raw.find((r) => (r.brand || r.key || '').toString().toLowerCase() === key) || {};
    return {
      key,
      name: BRANDS[key].name,
      nurtured: num(row.nurtured),
      launched: num(row.launched),
      funded: num(row.funded),
      tag: tagFrom(row.nurtured, row.launched, row.funded, row.tag),
      present: Object.keys(row).length > 0,
    };
  });
}

export function normaliseDistricts(data) {
  return (data?.byDistrict || []).map((r) => {
    const name = r.district || r.name || r.label || '';
    return {
      name,
      nameTa: r.districtTa || r.nameTa || null,
      nurtured: num(r.nurtured ?? r.value ?? r.count),
      launched: num(r.launched),
      tag: tagFrom(r.nurtured, r.value, r.count, r.tag),
      metro: METRO_DISTRICTS.includes(name.toLowerCase().trim()),
    };
  });
}

export function normaliseCorrections(data) {
  return (data?.corrections || []).map((c, i) => ({
    id: c.id || `${c.date || 'c'}-${i}`,
    date: c.date || c.correctedAt || null,
    what: c.what || c.change || c.summary || c.title || '',
    severity: c.severity || null,
    why: c.why || c.reason || '',
    whatTa: c.whatTa || c.changeTa || c.summaryTa || null,
    whyTa: c.whyTa || c.reasonTa || null,
  }));
}

/** Share of launched (or nurtured) founders outside Chennai, Coimbatore and Kancheepuram. Never sums C-tagged figures. */
export function outsideMetroShare(districts) {
  const field = districts.some((d) => d.launched != null) ? 'launched' : 'nurtured';
  const rows = districts.filter((d) => d[field] != null);
  if (!rows.length || rows.some((d) => d.tag === 'C')) return null;
  const total = rows.reduce((s, d) => s + d[field], 0);
  if (!total) return null;
  const outside = rows.filter((d) => !d.metro).reduce((s, d) => s + d[field], 0);
  return { value: Math.round((outside / total) * 1000) / 10, field, tag: weakestTag(rows.map((d) => d.tag)) };
}

/** "Nice" axis maximum and ticks for a linear scale from zero. */
export function niceScale(max, count = 4) {
  if (!max || max <= 0) return { max: 1, ticks: [0, 1] };
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || 10 * mag;
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return { max: top, ticks };
}

/** Build a CSV string. rows: array of arrays. */
export function toCSV(rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(esc).join(',')).join('\r\n');
}

/** Trigger a client-side file download from a string via Blob. */
export function downloadText(filename, text, type = 'text/csv;charset=utf-8') {
  const blob = new Blob(['﻿', text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Flatten a Ledger response into one tidy CSV (section, measure, dimension, value, unit, tag, as-at, source). */
/** True when the CSV would carry at least one published figure or correction (not just measure names). */
export function hasLedgerValues(data) {
  if (!data) return false;
  const has = (v) => v != null && v !== '' && !(typeof v === 'string' && /^\s*\[.*\]\s*$/.test(v));
  return (data.kpis || []).some((k) => has(k.value))
    || normaliseLevels(data).some((l) => has(l.value))
    || normaliseBrands(data).some((b) => ['nurtured', 'launched', 'funded'].some((m) => has(b[m])))
    || normaliseDistricts(data).some((d) => ['nurtured', 'launched'].some((m) => has(d[m])))
    || normaliseCorrections(data).length > 0;
}

export function ledgerCSV(data) {
  const p = periodInfo(data);
  const rows = [['period', 'section', 'measure', 'dimension', 'value', 'unit', 'tag', 'as_at', 'source']];
  (data?.kpis || []).forEach((k) =>
    rows.push([p.id, 'headline', k.label, '', k.value ?? '', k.unit || '', k.tag || '', k.asAt || p.asAt || '', k.source || ''])
  );
  normaliseLevels(data).forEach((l) =>
    rows.push([p.id, 'ladder', 'people at level', `${l.code} ${l.name}`, l.value ?? '', '', l.tag || '', p.asAt || '', 'StartNet Founder Ledger'])
  );
  normaliseBrands(data).forEach((b) =>
    ['nurtured', 'launched', 'funded'].forEach((m) =>
      rows.push([p.id, 'brand', m, b.name, b[m] ?? '', '', b.tag || '', p.asAt || '', 'StartNet Founder Ledger'])
    )
  );
  normaliseDistricts(data).forEach((d) =>
    ['nurtured', 'launched'].forEach((m) =>
      rows.push([p.id, 'district', m, d.name, d[m] ?? '', '', d.tag || '', p.asAt || '', 'StartNet Founder Ledger'])
    )
  );
  normaliseCorrections(data).forEach((c) =>
    rows.push([p.id, 'correction', c.what, c.severity || '', '', '', '', c.date || '', c.why])
  );
  return toCSV(rows);
}

/* ------------------------------------------------------------------ */
/* Tamil for the short status / schedule labels the API sends in English, e.g. "Planned · October 2027 [date TBC]".
   Known shapes only; anything else returns null and the caller shows the English with lang="en". */
/* ------------------------------------------------------------------ */
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const taMonthYear = (month, year) => {
  const i = MONTHS.indexOf(String(month).toLowerCase());
  if (i < 0) return `${month} ${year}`;
  return new Date(Date.UTC(Number(year), i, 15)).toLocaleDateString('ta-IN', { month: 'long', year: 'numeric', timeZone: 'UTC', numberingSystem: 'latn' });
};
const BRACKET_TA = {
  'first edition date placeholder': '[இடநிரப்பி — முதல் பதிப்புத் தேதி]',
  'placeholder — first edition date': '[இடநிரப்பி — முதல் பதிப்புத் தேதி]',
  'placeholder — date': '[placeholder — தேதி]',
  'placeholder — to be supplied by startnet': PLACEHOLDER_TA,
  'date tbc': '[தேதி உறுதிசெய்யப்பட வேண்டும்]',
  placeholder: '[placeholder]',
  date: '[தேதி]',
};
/** Tamil for a "[...]" placeholder-register marker; unknown markers stay as they are. */
export const bracketTa = (b) => BRACKET_TA[String(b).replace(/^\[|\]$/g, '').trim().toLowerCase()] || b;

export function statusTa(label) {
  if (label == null) return null;
  const s = String(label).trim();
  const phs = (s.match(/\[[^\]]+\]/g) || []).map(bracketTa);
  const core = s.replace(/\[[^\]]+\]/g, '').replace(/\s+/g, ' ').trim();
  const tail = phs.length ? ` ${phs.join(' ')}` : '';
  let m;
  if (!core) return phs.length ? phs.join(' ') : null;
  if (/^planned$/i.test(core)) return `திட்டமிடப்பட்டது${tail}`;
  if ((m = /^planned (\d{4})$/i.exec(core))) return `${m[1]}-இல் திட்டமிடப்பட்டுள்ளது${tail}`;
  if ((m = /^planned ([a-z]+) (\d{4})$/i.exec(core))) return `${taMonthYear(m[1], m[2])}-இல் திட்டமிடப்பட்டுள்ளது${tail}`;
  if ((m = /^planned ?· ?([a-z]+) (\d{4})$/i.exec(core))) return `திட்டமிடப்பட்டது · ${taMonthYear(m[1], m[2])}${tail}`;
  if ((m = /^planned ?· ?launch at the (.+)$/i.exec(core))) return `திட்டமிடப்பட்டது · ${m[1]}-இல் வெளியீடு${tail}`;
  if ((m = /^first edition \(([^)]+)\) planned for ([a-z]+) (\d{4})$/i.exec(core))) {
    return `முதல் பதிப்பு (${m[1]}) ${taMonthYear(m[2], m[3])}-இல் திட்டமிடப்பட்டுள்ளது${tail}`;
  }
  return null;
}

/* Tamil for the Ledger KPI metrics (/api/metrics ids). Stat reads labelTa / noteTa on /ta; the API's own Tamil wins. */
const KPI_TA = {
  'founders-nurtured': {
    labelTa: 'இதுவரை வளர்க்கப்பட்ட நிறுவனர்கள் (L2+)',
    noteTa: 'எண் வழங்கப்படும்போது சான்றுக் குழு A அல்லது B குறியை அமைக்கும். L2 = ஒரு StartNet X சுயவிவரமும், குறைந்தது இரண்டு அர்த்தமுள்ள தொடர்புகளும்.',
  },
  'startups-launched': { labelTa: 'தொடங்கப்பட்ட ஸ்டார்ட்அப்கள் (L5), மொத்தம்' },
  'capital-raised': { labelTa: 'StartNet நிறுவனர்கள் திரட்டிய மூலதனம்' },
  'pilots-signed': { labelTa: 'கையெழுத்தான பைலட், ஒப்பந்தங்கள்' },
  'women-share': { labelTa: 'பங்கேற்பாளர்களில் பெண்களின் பங்கு', noteTa: '40% குறைந்தபட்ச இலக்குக்கு எதிராக அறிவிக்கப்படுகிறது.' },
  'districts-active': { labelTa: 'செயல்பாட்டில் உள்ள திட்டங்களைக் கொண்ட மாவட்டங்கள்' },
};
/** A metric with the Insights Tamil label/note filled in where the API has none. */
export const withKpiTa = (m) => {
  const ta = m && KPI_TA[m.id || m.key];
  if (!ta) return m;
  return { ...m, labelTa: m.labelTa || ta.labelTa, ...(m.note && ta.noteTa ? { noteTa: m.noteTa || ta.noteTa } : {}) };
};

// ---------------------------------------------------------------------------------------------------------------
// SEO: Dataset JSON-LD for a Founder Ledger edition (Book 1 §9.4; Part B §7.4 "Dataset (Ledger periods, with
// temporalCoverage …)"). It names what is measured, never a value: figures that are null or placeholders stay out.
// `license` is omitted until StartNet publishes one.
const QUARTER_MONTHS = { 1: ['01', '03'], 2: ['04', '06'], 3: ['07', '09'], 4: ['10', '12'] };
const MONTH_END = { '03': '31', '06': '30', '09': '30', '12': '31' };
/** "2026-Q4" / "2026-q4" → ISO 8601 interval "2026-10-01/2026-12-31"; anything else → undefined. */
export function quarterInterval(id) {
  const m = /^(\d{4})-q([1-4])$/i.exec(String(id || ''));
  if (!m) return undefined;
  const [from, to] = QUARTER_MONTHS[m[2]];
  return `${m[1]}-${from}-01/${m[1]}-${to}-${MONTH_END[to]}`;
}

export function ledgerDatasetLd({ id, label, path, lang = 'en', description, published, orgRef, absUrl, measures = [] }) {
  const url = absUrl(lang === 'ta' ? `/ta${path}` : path);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${absUrl(path)}#dataset`,
    name: `StartNet Founder Ledger${label ? ` ${label}` : ''}`,
    description,
    url,
    inLanguage: lang === 'ta' ? 'ta-IN' : 'en-IN',
    creator: orgRef,
    publisher: orgRef,
    isAccessibleForFree: true,
    spatialCoverage: { '@type': 'Place', name: 'Tamil Nadu, India' },
    keywords: ['Tamil Nadu startup statistics', 'startups by district', 'founders', 'Founder Ledger'],
    variableMeasured: measures.filter((m) => typeof m === 'string' && m && !/\[/.test(m)),
  };
  const tc = quarterInterval(id);
  if (tc) ld.temporalCoverage = tc;
  if (typeof published === 'string' && /^\d{4}-\d{2}-\d{2}/.test(published)) ld.datePublished = published.slice(0, 10);
  if (!ld.variableMeasured.length) delete ld.variableMeasured;
  return ld;
}

/** What the Ledger measures (Book 2 §2.4 / §6.2 KPI names). */
export const LEDGER_MEASURES = ['Founders nurtured (L2+)', 'Startups launched', 'Capital raised', 'Pilots signed', 'Share of women founders', 'Districts active'];
