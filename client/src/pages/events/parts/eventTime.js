// Event dates and times are always shown in IST (Book 4 IX-22: "IST" is always shown).
const TZ = 'Asia/Kolkata';

export const hasTime = (iso) => typeof iso === 'string' && /T\d{2}:\d{2}/.test(iso);
const valid = (iso) => iso && !Number.isNaN(new Date(iso).getTime());

/** Locale for dates: Tamil month and weekday names with Latin digits on /ta pages (Book 3 §4.4). */
export const dateLocale = (lang) => (lang === 'ta' ? 'ta-IN-u-nu-latn' : 'en-IN');

/** "Sat, 12 Dec 2026" (pass lang 'ta' for Tamil names) */
export function eventDay(iso, opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }, lang) {
  if (!valid(iso)) return iso || '';
  // en-IN puts a comma before the year ("15 May, 2027"); house style is "15 May 2027".
  return new Date(iso).toLocaleDateString(dateLocale(lang), { ...opts, timeZone: TZ }).replace(/([A-Za-z\u0B80-\u0BFF.]{3,}),\s(\d{4})/, '$1 $2');
}

/** "10:00 am" */
export function eventClock(iso) {
  if (!valid(iso)) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ });
}

/** "10:00 am – 6:00 pm IST" (or "" for date-only events) */
export function eventTimeRange(start, end) {
  if (!hasTime(start)) return '';
  const a = eventClock(start);
  const sameDay = end && dayKey(end) === dayKey(start);
  const b = end && hasTime(end) ? (sameDay ? eventClock(end) : `${eventDay(end, { day: 'numeric', month: 'short' })}, ${eventClock(end)}`) : '';
  return `${a}${b ? ` – ${b}` : ''} IST`;
}

/** "12–13 Dec 2026" or "Sat, 12 Dec 2026" */
export function eventDateRange(start, end, lang) {
  const full = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  if (!end || dayKey(end) === dayKey(start)) return eventDay(start, full, lang);
  return `${eventDay(start, { day: 'numeric', month: 'short' }, lang)} – ${eventDay(end, full, lang)}`;
}

const partsFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });

/** "2026-12-12" in IST */
export function dayKey(iso) {
  if (!valid(iso)) return '';
  return partsFmt.format(new Date(iso));
}
/** "2026-12" in IST */
export const monthKey = (iso) => dayKey(iso).slice(0, 7);
export const yearOf = (iso) => dayKey(iso).slice(0, 4);

/** "December 2026" from "2026-12" */
export function monthLabel(key, lang) {
  const [y, m] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(dateLocale(lang), { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Days from now until the event (negative = past). */
export function daysUntil(iso, now = Date.now()) {
  if (!valid(iso)) return Infinity;
  return (new Date(iso).getTime() - now) / 86400000;
}

/** Date block parts: { day: '12', month: 'Dec', weekday: 'Sat' } */
export function dateBlock(iso, lang) {
  return {
    day: eventDay(iso, { day: 'numeric' }, lang),
    month: eventDay(iso, { month: 'short' }, lang),
    weekday: eventDay(iso, { weekday: 'short' }, lang),
  };
}
