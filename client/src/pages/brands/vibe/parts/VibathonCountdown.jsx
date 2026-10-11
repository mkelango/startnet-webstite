import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { formatDate } from '../../../../lib/format.js';
import { useLang } from '../../../../lib/i18n.jsx';
import './VibathonCountdown.css';

// IX-23 registration countdown (Book 4 B4): the deadline, in days only, with the absolute date always shown.
// Static text, aria-live="off", no ticking seconds. Updates at IST midnight. Identical under reduced motion.
// Urgency appears only with a real date: with no date we show the placeholder, never a number.

const IST_OFFSET_MIN = 330;
const istDayNumber = (ms) => Math.floor((ms + IST_OFFSET_MIN * 60000) / 86400000);

function msToNextIstMidnight(now) {
  const next = (istDayNumber(now) + 1) * 86400000 - IST_OFFSET_MIN * 60000;
  return Math.max(1000, next - now + 500);
}

/**
 * @param {{ opens?: string|null, closes?: string|null }} props
 */
export default function VibathonCountdown({ opens = null, closes = null }) {
  const { t } = useLang();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!closes) return undefined;
    let timer;
    const schedule = () => {
      timer = setTimeout(() => { setNow(Date.now()); schedule(); }, msToNextIstMidnight(Date.now()));
    };
    schedule();
    return () => clearTimeout(timer);
  }, [closes]);

  const closeMs = closes ? new Date(closes).getTime() : NaN;
  const opensMs = opens ? new Date(opens).getTime() : NaN;
  const dateText = closes ? `${formatDate(closes)}, 23:59 IST` : null;

  let state = 'tbc';
  let days = null;
  if (!Number.isNaN(closeMs)) {
    if (now > closeMs) state = 'closed';
    else if (!Number.isNaN(opensMs) && now < opensMs) state = 'soon';
    else {
      days = istDayNumber(closeMs) - istDayNumber(now);
      state = days <= 0 ? 'today' : 'open';
    }
  }

  const dayWord = days === 1 ? t('day', 'நாள்') : t('days', 'நாட்கள்');
  let text;
  if (state === 'closed') text = t('Registration has closed. Join the waitlist.', 'பதிவு முடிந்துவிட்டது. காத்திருப்புப் பட்டியலில் சேருங்கள்.');
  else if (state === 'soon') text = t(`Registration opens ${formatDate(opens)} · closes ${dateText}`, `பதிவு தொடக்கம் ${formatDate(opens)} · முடிவு ${dateText}`);
  else if (state === 'today') text = t('Closes today at 23:59 IST', 'இன்று இரவு 23:59 IST-க்கு முடிகிறது');
  else if (state === 'open') text = t(`Registration closes in ${days} ${dayWord} · ${dateText}`, `பதிவு முடிய இன்னும் ${days} ${dayWord} · ${dateText}`);

  // No confirmed registration dates yet: show nothing rather than a placeholder date.
  if (state === 'tbc') return null;

  return (
    <div className={`vibathon-countdown vibathon-countdown--${state}`} aria-live="off">
      {state === 'open' ? (
        <span className="vibathon-countdown__days tnum" aria-hidden="true">
          <span className="vibathon-countdown__num">{days}</span>
          <span className="vibathon-countdown__unit">{dayWord}</span>
        </span>
      ) : (
        <CalendarClock className="vibathon-countdown__icon" size={22} aria-hidden="true" />
      )}
      <p className="vibathon-countdown__text">{text}</p>
    </div>
  );
}
