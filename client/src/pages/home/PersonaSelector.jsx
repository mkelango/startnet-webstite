import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useLang } from '../../lib/i18n.jsx';
import { PERSONAS, PERSONA_GROUPS, PERSONA_EXTRAS } from './personas.js';
import './PersonaSelector.css';

/**
 * "I am a…" selector (Book 1 Part B §5.1, Book 4 IX-10). Native radios styled as tiles:
 * one radio group (shared name) across both visual groups, so arrow keys move through all nine.
 * Props: value, onChange(id), name, legendId, legend (node), showExtras,
 *        invalid? (sets aria-invalid on the group), describedBy? (id of an error/hint for aria-describedby),
 *        variant? 'tiles' (default, /join) | 'list' (hairline rows) | 'chips' (Home, DESIGN-v2 3.12: a pill chip grid).
 *        With no `legend`, `legendId` may point at a heading rendered outside the group (Home does this).
 */
/** id of the first radio, for moving focus there on an empty submit. */
export const firstPersonaInputId = (name = 'persona') => `${name}-${PERSONAS[0].id}`;

export default function PersonaSelector({ value, onChange, name = 'persona', legendId, legend, showExtras = true, invalid = false, describedBy, variant = 'tiles' }) {
  const { t, localePath } = useLang();
  const lid = legendId || `${name}-legend`;
  return (
    <div
      className={`home-persona home-persona--${variant}`}
      role="radiogroup"
      aria-labelledby={lid}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy || undefined}
    >
      {legend && <div id={lid} className="home-persona__legend">{legend}</div>}
      {PERSONA_GROUPS.map((g) => (
        <fieldset key={g.id} className={`home-persona__group home-persona__group--${g.id}`}>
          <legend className="home-persona__group-label eyebrow">{t(g.label, g.labelTa)}</legend>
          <div className="home-persona__grid">
            {PERSONAS.filter((p) => p.group === g.id).map((p) => {
              const Icon = p.icon;
              const checked = value === p.id;
              const id = `${name}-${p.id}`;
              return (
                <div key={p.id} className="home-persona__item" data-brand={p.brand || undefined}>
                  <input
                    className="home-persona__input"
                    type="radio"
                    id={id}
                    name={name}
                    value={p.id}
                    checked={checked}
                    onChange={() => onChange?.(p.id)}
                  />
                  <label htmlFor={id} className="home-persona__tile">
                    <span className="home-persona__icon" aria-hidden="true"><Icon size={variant === 'tiles' ? 22 : variant === 'chips' ? 18 : 20} strokeWidth={1.5} /></span>
                    <span className="home-persona__label">{t(p.label, p.labelTa)}</span>
                    <span className="home-persona__check" aria-hidden="true"><Check size={variant === 'chips' ? 14 : 16} strokeWidth={2.5} /></span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
      {showExtras && (
        <p className="home-persona__extras small">
          <span className="muted">{t('Something else?', 'வேறு ஏதாவதா?')} </span>
          {PERSONA_EXTRAS.map((x, i) => (
            <span key={x.id}>
              {i > 0 && <span className="home-persona__sep" aria-hidden="true"> · </span>}
              <Link to={localePath(x.to)}>{t(x.label, x.labelTa)}</Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
