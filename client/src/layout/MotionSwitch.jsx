// IX-08 · On-site "Reduce motion" switch (Book 4 Part B, Book 3 C09).
// On → html[data-motion="reduced"] · Off → html[data-motion="full"] · Use device setting → attribute removed.
import { useEffect, useId, useState } from 'react';
import { useLang } from '../lib/i18n.jsx';
import './MotionSwitch.css';

const KEY = 'sn-motion';
const OPTIONS = [
  { value: 'on', label: 'On', labelTa: 'ஆம்' },
  { value: 'off', label: 'Off', labelTa: 'இல்லை' },
  { value: 'system', label: 'Use device setting', labelTa: 'சாதன அமைப்பைப் பின்பற்று' },
];

export function applyMotion(value) {
  const html = document.documentElement;
  if (value === 'on') html.dataset.motion = 'reduced';
  else if (value === 'off') html.dataset.motion = 'full';
  else delete html.dataset.motion;
}

function readStored() {
  try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; }
}

// Apply the stored choice before first paint of React content.
if (typeof document !== 'undefined') applyMotion(readStored());

export default function MotionSwitch({ className = '' }) {
  const id = useId();
  const { t } = useLang();
  const [value, setValue] = useState(readStored);
  useEffect(() => { applyMotion(value); }, [value]);
  const choose = (v) => {
    setValue(v);
    try { if (v === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, v); } catch { /* storage blocked */ }
  };
  return (
    <fieldset className={`motion-switch ${className}`}>
      <legend className="motion-switch__legend">{t('Reduce motion', 'அசைவைக் குறை')}</legend>
      <div className="motion-switch__opts">
        {OPTIONS.map((o) => (
          <label key={o.value} className="motion-switch__opt">
            <input
              type="radio"
              name={`motion-${id}`}
              value={o.value}
              checked={value === o.value}
              onChange={() => choose(o.value)}
            />
            <span>{t(o.label, o.labelTa)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
