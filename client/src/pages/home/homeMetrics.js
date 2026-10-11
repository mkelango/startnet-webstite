// Home figures (Book 2 §1.2 proof band, §1.5 Mission 1 Lakh, §1.6 Why Tamil Nadu).
// Live values come from GET /api/metrics; these book-sourced records are the fallback so the
// page never shows an unsourced number. value: null → rendered as the Book 2 placeholder.

const FALLBACK = {
  nurtured: { id: 'home-nurtured', key: 'founders_nurtured', value: null, label: 'founders nurtured (L2+) to date', tag: 'B', source: 'Founder Ledger', note: 'Figure and as-at date to be supplied by StartNet.' },
  events: { id: 'home-events', key: 'events_run', value: null, label: 'events run since 2023', tag: 'B', source: 'StartNet event archive', note: 'Figure and as-at date to be supplied by StartNet.' },
  tier34: { id: 'home-tier34', key: 'vibathon_2025_tier34', value: 80, unit: '%', label: 'of colleges reached by Vibathon 2025 were Tier 3 or 4', tag: 'B', asAt: 'Vibathon 2025', source: 'Vibathon 2025 brochure' },
  institutions: { id: 'home-institutions', key: 'institutions', value: null, label: "colleges and institutions we've worked with", tag: 'B', source: 'StartNet records', note: 'Figure and as-at date to be supplied by StartNet.' },

  tnStartups: { id: 'tn-startups', key: 'tn_dpiit_startups', value: 15037, label: 'DPIIT-recognised startups in Tamil Nadu', tag: 'A', asAt: 'July 2026', source: 'DPIIT data via DT Next, July 2026' },
  tnWomen: { id: 'tn-women-led', key: 'tn_women_led_share', value: 50, unit: '%', label: 'of them are women-led (7,572)', tag: 'A', asAt: 'July 2026', source: 'DPIIT data via DT Next, July 2026' },
  tnGcc: { id: 'tn-gccs', key: 'tn_gccs', value: 250, unit: '+', label: 'Global Capability Centres in the state', tag: 'B', asAt: 'Dec 2025', source: 'ANAROCK–FICCI, Dec 2025' },
  tnGer: { id: 'tn-ger', key: 'tn_ger', value: 52.3, unit: '%', label: 'higher-education GER, the highest in India', tag: 'A', asAt: '2023-24', source: 'AISHE 2023-24' },
  tnOutside: { id: 'tn-outside', key: 'tn_outside_top3_share', value: 44, unit: '%', label: "of TN's startups are outside Chennai, Coimbatore and Kancheepuram", tag: 'A', asAt: 'July 2026', source: 'DPIIT district data, July 2026' },

  target2031: { id: 'm1l-target', key: 'mission_target_2031', value: 100000, label: 'founders and aspiring founders nurtured in Tamil Nadu by March 2031', tag: 'C', source: 'Mission 1 Lakh, StartNet planning assumption', note: 'Target, not an outcome.' },
  target2040: { id: 'm1l-target-2040', key: 'mission_target_2040', value: 1000000, label: 'by 2040', tag: 'C', source: 'Mission 1 Lakh, StartNet planning assumption', note: 'Target, not an outcome.' },
};

// How to recognise each figure in the API list (key or label), without guessing at exact keys.
const MATCH = {
  nurtured: [/nurtur/i, /target|mission|2031|2040/i],
  events: [/events?[\s_-]*(run|held)/i],
  tier34: [/tier[\s_-]*3/i],
  institutions: [/institution|colleges[\s_-]*and/i, /tier/i],
  tnStartups: [/dpiit[\s_-]*(recogni[sz]ed)?[\s_-]*startups|tn[\s_-]*startups|recogni[sz]ed startups/i, /women|outside|district/i],
  tnWomen: [/women[\s_-]*led/i],
  tnGcc: [/gcc|global capability/i],
  tnGer: [/\bger\b|_ger\b|enrol/i],
  tnOutside: [/outside/i],
  target2031: [/target.*2031|2031.*target|mission[\s_-]*target|1[\s_-]*lakh[\s_-]*target/i, /2040/],
  target2040: [/2040/i],
};

const text = (m) => `${m.key || ''} ${m.id || ''} ${m.label || ''}`;

/** Merge live metrics over the book fallbacks. Returns an object keyed like FALLBACK. */
export function pickHomeMetrics(list) {
  const arr = Array.isArray(list) ? list.filter((m) => m && !m.brand) : [];
  const out = {};
  for (const k of Object.keys(FALLBACK)) {
    const [yes, no] = MATCH[k] || [];
    const hit = yes && arr.find((m) => yes.test(text(m)) && !(no && no.test(text(m))));
    out[k] = hit || FALLBACK[k];
  }
  return out;
}

/** The four proof-band figures, applying the Book 2 §1.2 CMS rule: if the first two are still
 *  placeholders, swap them for the Tamil Nadu context figures. Returns { proof, context }. */
export function proofAndContext(m) {
  const ctx = [m.tnStartups, m.tnWomen, m.tnGcc, m.tnGer, m.tnOutside];
  const empty = (x) => x == null || x.value == null;
  if (empty(m.nurtured) && empty(m.events)) {
    return { proof: [m.tnStartups, m.tnWomen, m.tier34, m.institutions], context: ctx.slice(2), swapped: true };
  }
  return { proof: [m.nurtured, m.events, m.tier34, m.institutions], context: ctx, swapped: false };
}

/** First brand-level metric for a brand door, if the API has one. */
export function brandMetric(list, brand) {
  return Array.isArray(list) ? list.find((m) => m && m.brand === brand && m.value != null) : undefined;
}
