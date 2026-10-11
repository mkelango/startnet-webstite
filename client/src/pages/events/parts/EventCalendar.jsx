// Month view for /events (Book 2 §5.1 view toggle; Book 4 IX-22: "the month grid is a table", List is the default on mobile).
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../../../lib/i18n.jsx';
import { dayKey, monthKey, monthLabel, eventClock, hasTime } from './eventTime.js';
import { isConfirmed, pickLang, nbDots } from './eventMeta.js';
import RichText from '../../programmes/parts/RichText.jsx';
import './EventCalendar.css';
import { eventPath } from '../../../components/_utils.js';

const WEEKDAYS = [
  ['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday'], ['Sun', 'Sunday'],
];
// Tamil weekday names (short form and full name) for /ta pages, Monday first.
const WEEKDAYS_TA = [
  ['திங்', 'திங்கள்'], ['செவ்', 'செவ்வாய்'], ['புத', 'புதன்'], ['வியா', 'வியாழன்'], ['வெள்', 'வெள்ளி'], ['சனி', 'சனி'], ['ஞாயி', 'ஞாயிறு'],
];
const pad = (n) => String(n).padStart(2, '0');
const shiftMonth = (key, by) => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};

export default function EventCalendar({ events }) {
  const { localePath, t, lang } = useLang();
  const days = lang === 'ta' ? WEEKDAYS_TA : WEEKDAYS;
  const firstDated = events.find((e) => e.date && monthKey(e.date));
  const first = firstDated ? monthKey(firstDated.date) : monthKey(new Date().toISOString());
  const [month, setMonth] = useState(first);
  // A filter change can move the first match to another month: follow it (the user's own paging is kept until then).
  useEffect(() => { setMonth(first); }, [first]);

  const byDay = useMemo(() => {
    const map = new Map();
    events.filter(isConfirmed).forEach((e) => {
      const k = dayKey(e.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e);
    });
    return map;
  }, [events]);

  const weeks = useMemo(() => {
    const [y, m] = month.split('-').map(Number);
    const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // Monday first
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < lead; i += 1) cells.push(null);
    for (let d = 1; d <= days; d += 1) cells.push(`${month}-${pad(d)}`);
    while (cells.length % 7) cells.push(null);
    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [month]);

  const inMonth = events.filter((e) => e.date && monthKey(e.date) === month).length;
  const tbc = events.filter((e) => !isConfirmed(e) && e.date && monthKey(e.date) === month);
  const dated = inMonth - tbc.length;
  const label = monthLabel(month, lang);
  // "2 events" / "1 event, date to be confirmed" / "3 events, 1 date to be confirmed"
  const countText = (() => {
    const evs = (k) => t(`${k} ${k === 1 ? 'event' : 'events'}`, `${k} ${k === 1 ? 'நிகழ்வு' : 'நிகழ்வுகள்'}`);
    if (!tbc.length) return evs(inMonth);
    if (!dated) return t(`${evs(inMonth)}, ${inMonth === 1 ? 'date' : 'dates'} to be confirmed`, `${evs(inMonth)}, தேதிகள் உறுதியாகவில்லை`);
    return t(`${evs(inMonth)}, ${tbc.length} ${tbc.length === 1 ? 'date' : 'dates'} to be confirmed`, `${evs(inMonth)}, ${tbc.length} தேதிகள் உறுதியாகவில்லை`);
  })();
  const today = dayKey(new Date().toISOString());

  return (
    <div className="events-cal">
      <div className="events-cal__head">
        <button type="button" className="events-cal__nav" onClick={() => setMonth((k) => shiftMonth(k, -1))} aria-label={t('Previous month', 'முந்தைய மாதம்')}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p className="events-cal__title h4" aria-live="polite">
          <span className="events-cal__month">{label}</span>{' '}
          <span className="events-cal__count caption tnum">{countText}</span>
        </p>
        <button type="button" className="events-cal__nav" onClick={() => setMonth((k) => shiftMonth(k, 1))} aria-label={t('Next month', 'அடுத்த மாதம்')}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      {/* TBC editions sit above the grid, so a month with only unconfirmed dates never looks empty. */}
      {tbc.length > 0 && (
        <div className="events-cal__tbc">
          <p className="events-cal__tbc-title h6">{t('Dates to be confirmed', 'தேதிகள் உறுதியாகவில்லை')}</p>
          <ul className="events-cal__tbc-list" role="list">
            {tbc.map((e) => (
              <li key={e.slug} data-brand={e.brand}>
                <Link to={localePath(eventPath(e))} className="events-cal__event">
                  <span className="events-cal__dot" aria-hidden="true" />
                  <span className="events-cal__event-title">{pickLang(e, 'title', lang)}</span>
                  <span className="events-cal__time">
                    <RichText text={nbDots(pickLang(e, 'dateLabel', lang)) || t('Dates soon', 'தேதிகள் விரைவில்')} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="events-cal__frame" key={month}>
      <table className="events-cal__table">
        <caption className="visually-hidden">{t(`Events in ${label}, times in IST`, `${label} நிகழ்வுகள், நேரங்கள் IST-இல்`)}</caption>
        <thead>
          <tr>
            {days.map(([short, long]) => (
              <th key={short} scope="col">
                <abbr title={long}>{short}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((row, i) => (
            <tr key={i}>
              {row.map((k, j) => {
                if (!k) return <td key={`x${j}`} className="events-cal__cell is-blank" aria-hidden="true" />;
                const list = byDay.get(k) || [];
                const d = Number(k.slice(8));
                return (
                  <td key={k} className={`events-cal__cell${list.length ? ' has-events' : ' is-empty'}${k === today ? ' is-today' : ''}`}>
                    <span className="events-cal__date">
                      <span className="events-cal__wd" aria-hidden="true">{days[j][0]} </span>
                      {d}
                    </span>
                    {list.length > 0 && (
                      <ul className="events-cal__list" role="list">
                        {list.map((e) => (
                          <li key={e.slug} data-brand={e.brand}>
                            <Link to={localePath(eventPath(e))} className="events-cal__event">
                              <span className="events-cal__dot" aria-hidden="true" />
                              <span className="events-cal__event-title">{pickLang(e, 'title', lang)}</span>
                              {hasTime(e.date) && <span className="events-cal__time tnum">{eventClock(e.date)} IST</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {inMonth === 0 && (
        <p className="events-cal__none text-2">
          {t(`No events match in ${label}. Try the next month.`, `${label}-இல் பொருந்தும் நிகழ்வுகள் இல்லை. அடுத்த மாதத்தைப் பாருங்கள்.`)}
        </p>
      )}
    </div>
  );
}
