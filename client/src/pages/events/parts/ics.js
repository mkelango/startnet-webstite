// Add to calendar: RFC 5545 .ics built in the browser and downloaded as a Blob (Book 1 Part B T05).
import { hasTime } from './eventTime.js';
import { labelize, isPlaceholderValue } from '../../programmes/parts/facets.js';

const pad = (n) => String(n).padStart(2, '0');
const utcStamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
const dateOnly = (iso) => iso.slice(0, 10).replace(/-/g, '');
const nextDay = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
};
const esc = (s) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

// Fold lines longer than 75 octets (RFC 5545 §3.1), measured in UTF-8 bytes. Continuation lines start with a
// space, which counts towards their 75. Code points are never split (for...of walks whole code points).
const utf8Len = (ch) => {
  const c = ch.codePointAt(0);
  return c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
};
function fold(line) {
  const out = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = utf8Len(ch);
    if (bytes + n > 75) {
      out.push(cur);
      cur = ' ';
      bytes = 1;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join(String.fromCharCode(13, 10)); // CRLF
}

export function buildIcs(event, pageUrl) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//StartNet//startnet.in//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT'];
  lines.push(`UID:${event.slug}@startnet.in`);
  lines.push(`DTSTAMP:${utcStamp(new Date())}`);
  if (hasTime(event.date)) {
    const start = new Date(event.date);
    const end = event.endDate && hasTime(event.endDate) ? new Date(event.endDate) : new Date(start.getTime() + 3 * 3600000);
    lines.push(`DTSTART:${utcStamp(start)}`);
    lines.push(`DTEND:${utcStamp(end)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${dateOnly(event.date)}`);
    lines.push(`DTEND;VALUE=DATE:${nextDay(event.endDate || event.date)}`);
  }
  lines.push(`SUMMARY:${esc(event.title)}`);
  const parts = [event.venue, event.city, labelize(event.district), 'Tamil Nadu'].filter((x) => x && !isPlaceholderValue(x));
  const where = event.format === 'online' ? 'Online' : parts.filter((x, i) => parts.findIndex((y) => y.toLowerCase() === x.toLowerCase()) === i).join(', ');
  if (where) lines.push(`LOCATION:${esc(where)}`);
  lines.push(`DESCRIPTION:${esc([event.summary, pageUrl].filter(Boolean).join('\n\n'))}`);
  if (pageUrl) lines.push(`URL:${pageUrl}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function downloadIcs(event) {
  const url = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const text = buildIcs(event, url);
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `${event.slug || 'startnet-event'}.ics`;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1500);
}
