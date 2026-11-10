import { Check } from 'lucide-react';
import { useLang } from '../../lib/i18n.jsx';
import { PERSONAS, PERSONA_GROUPS } from './personas.js';
import './PersonaChips.css';

/**
 * Home "I am a…" chip picker: the look that was live before the Nov 2026 redesign, restored at the user's request
 * (Nov 2026). Native radios styled as 48px pills (one radio group across both visual groups, so arrow keys move
 * through all nine); checked = Ink fill with the tick drawn in over the icon. /join keeps PersonaSelector.
 * Classes are `home-chips__*` so they never meet PersonaSelector.css (/join) in the same document.
 * Props: value, onChange(id), name, legendId (id of the heading outside the group), invalid, describedBy.
 */
export const firstChipInputId = (name = 'persona') => `${name}-${PERSONAS[0].id}`;

export default function PersonaChips({ value, onChange, name = 'persona', legendId, invalid = false, describedBy }) {
  const { t } = useLang();
  return (
    <div
      className="home-chips"
      role="radiogroup"
      aria-labelledby={legendId}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy || undefined}
    >
      {PERSONA_GROUPS.map((g) => (
        <fieldset key={g.id} className={`home-chips__group home-chips__group--${g.id}`}>
          <legend className="home-chips__group-label eyebrow">{t(g.label, g.labelTa)}</legend>
          <div className="home-chips__grid">
            {PERSONAS.filter((p) => p.group === g.id).map((p) => {
              const Icon = p.icon;
              const id = `${name}-${p.id}`;
              return (
                <div key={p.id} className="home-chips__item">
                  <input
                    className="home-chips__input"
                    type="radio"
                    id={id}
                    name={name}
                    value={p.id}
                    checked={value === p.id}
                    onChange={() => onChange?.(p.id)}
                  />
                  <label htmlFor={id} className="home-chips__tile">
                    <span className="home-chips__icon" aria-hidden="true"><Icon size={18} strokeWidth={1.5} /></span>
                    <span className="home-chips__label">{t(p.label, p.labelTa)}</span>
                    <span className="home-chips__check" aria-hidden="true"><Check size={14} strokeWidth={2.5} /></span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
