import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useLang } from '../../lib/i18n.jsx';
import { ArtImage } from '../../components/ArtImage.jsx';
import { PERSONAS, PERSONA_GROUPS, PERSONA_EXTRAS } from './personas.js';
import './PersonaSelector.css';

/**
 * "I am a…" selector (Book 1 Part B §5.1, Book 4 IX-10). Native radios styled as the SPEC §4.6 persona tiles:
 * one radio group (shared name) across both visual groups, so arrow keys move through all nine.
 * Props: value, onChange(id), name, legendId, legend (node), showExtras,
 *        invalid? (sets aria-invalid on the group), describedBy? (id of an error/hint for aria-describedby),
 *        size? 'md' (default, /join: 120px tiles) | 'lg' (Home: 220px tiles from 768).
 *        links? (NEW, default false) each tile is a direct link to its path instead of a radio (Home, the PnP "Who we
 *        work with" tiles): talent tiles carry a 3:2 warm mono photo of their brand, partner tiles are flat blocks.
 *        With no `legend`, `legendId` may point at a heading rendered outside the group (Home does this).
 */
/** id of the first radio, for moving focus there on an empty submit. */
export const firstPersonaInputId = (name = 'persona') => `${name}-${PERSONAS[0].id}`;

// Talent tiles' photos (links mode): drawn 3:2 at a quarter of the container from 1024, half on tablets.
const TILE_SIZES = '(min-width: 1024px) 320px, (min-width: 520px) 46vw, 92vw';

/** Links mode (Home): the same nine personas as tiles that link straight to their path. */
function PersonaLinks({ name, legendId, legend, showExtras }) {
  const { t, localePath } = useLang();
  const lid = legendId || `${name}-legend`;
  let n = 0;
  return (
    <div className="home-persona home-persona--tiles home-persona--links" role="group" aria-labelledby={lid}>
      {legend && <div id={lid} className="home-persona__legend">{legend}</div>}
      {PERSONA_GROUPS.map((g) => (
        <div key={g.id} className={`home-persona__group home-persona__group--${g.id}`} role="group" aria-labelledby={`${name}-${g.id}-label`}>
          <p className="home-persona__group-label eyebrow" id={`${name}-${g.id}-label`}>{t(g.label, g.labelTa)}</p>
          <ul className="home-persona__list" role="list">
            {PERSONAS.filter((p) => p.group === g.id).map((p, i) => {
              const Icon = p.icon;
              // Ink → Slate → Bone across all nine tiles, by position.
              const tone = ['ink', 'slate', 'bone'][n % 3];
              n += 1;
              const photo = g.id === 'build';
              return (
                <li key={p.id} className="home-persona__entry" data-tone={tone} data-brand={p.brand || undefined}>
                  <Link to={localePath(p.to)} className="home-persona__link" data-photo={photo || undefined}>
                    {photo ? (
                      <span className="home-persona__media" aria-hidden="true">
                        <ArtImage variant="grid" brand={p.brand} seed={i + 11} ratio="3/2" alt="" noCaption sizes={TILE_SIZES} />
                      </span>
                    ) : (
                      <span className="home-persona__glyph" aria-hidden="true"><Icon size={24} strokeWidth={1.75} /></span>
                    )}
                    <span className="home-persona__name">{t(p.label, p.labelTa)}</span>
                    <span className="home-persona__go" aria-hidden="true"><ArrowRight size={24} strokeWidth={1.75} /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {showExtras && <Extras />}
    </div>
  );
}

function Extras() {
  const { t, localePath } = useLang();
  return (
    <p className="home-persona__extras small">
      <span className="muted">{t('Something else?', 'வேறு ஏதாவதா?')} </span>
      {PERSONA_EXTRAS.map((x, i) => (
        <span key={x.id}>
          {i > 0 && <span className="home-persona__sep" aria-hidden="true"> · </span>}
          <Link to={localePath(x.to)}>{t(x.label, x.labelTa)}</Link>
        </span>
      ))}
    </p>
  );
}

export default function PersonaSelector({ value, onChange, name = 'persona', legendId, legend, showExtras = true, invalid = false, describedBy, size = 'md', links = false }) {
  const { t } = useLang();
  const lid = legendId || `${name}-legend`;
  if (links) return <PersonaLinks name={name} legendId={legendId} legend={legend} showExtras={showExtras} />;
  return (
    <div
      className={`home-persona home-persona--tiles home-persona--${size === 'lg' ? 'lg' : 'md'}`}
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
                    <span className="home-persona__icon" aria-hidden="true"><Icon size={24} strokeWidth={1.75} /></span>
                    <span className="home-persona__label">{t(p.label, p.labelTa)}</span>
                    <span className="home-persona__check" aria-hidden="true"><Check size={14} strokeWidth={2.5} /></span>
                    <span className="home-persona__arrow" aria-hidden="true"><ArrowRight size={24} strokeWidth={1.75} /></span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
      {showExtras && <Extras />}
    </div>
  );
}
