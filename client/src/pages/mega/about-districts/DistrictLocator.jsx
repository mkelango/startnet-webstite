// Map inset for T20 (Book 3 Part B §4: "map inset"; Book 4 IX-20). A simple dot locator, not a
// boundary map: each pulli dot is a district headquarters, projected from approximate lat/lon.
// Decorative for assistive tech (the district name is in the <h1>); the nearby-districts list and
// the district <select> on the page are the accessible twins.
import { useLang } from '../../../lib/i18n.jsx';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { DISTRICTS } from './districtsData.js';
import './DistrictLocator.css';

const BOUNDS = { minLon: 76.2, maxLon: 80.6, minLat: 7.9, maxLat: 13.5 };
const W = 300;
const PAD = 22;
// Keep the aspect roughly true at ~11°N (cos 11° ≈ 0.98).
const H = Math.round(((BOUNDS.maxLat - BOUNDS.minLat) / ((BOUNDS.maxLon - BOUNDS.minLon) * 0.98)) * (W - PAD * 2) + PAD * 2);

const project = (d) => ({
  x: PAD + ((d.lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * (W - PAD * 2),
  y: PAD + ((BOUNDS.maxLat - d.lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * (H - PAD * 2),
});

export default function DistrictLocator({ district, nearby = [] }) {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const near = new Set(nearby.map((n) => n.slug));
  const here = project(district);
  const name = lang === 'ta' ? district.ta : district.en;
  // Put the label on whichever side fits it (long Tamil names such as திருச்சிராப்பள்ளி would otherwise
  // run past the inset and cause horizontal scroll at 320px). Width is a generous per-character estimate.
  const estW = name.length * (lang === 'ta' ? 8.5 : 8);
  const spaceRight = W - (here.x + 20);
  const spaceLeft = here.x - 20;
  const labelLeft = spaceRight < estW && spaceLeft > spaceRight;

  return (
    <figure className="dloc">
      <svg
        className="dloc__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={t(
          `Locator: ${district.en} among Tamil Nadu's 38 districts`,
          `இருப்பிடம்: தமிழ்நாட்டின் 38 மாவட்டங்களில் ${district.ta}`
        )}
        focusable="false"
      >
        {DISTRICTS.map((d) => {
          if (d.slug === district.slug) return null;
          const p = project(d);
          return (
            <circle
              key={d.slug}
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r={near.has(d.slug) ? 4.5 : 3.5}
              className={near.has(d.slug) ? 'dloc__dot dloc__dot--near' : 'dloc__dot'}
            />
          );
        })}
        {!reduced && <circle cx={here.x} cy={here.y} r="9" className="dloc__pulse" />}
        <circle cx={here.x} cy={here.y} r="14" className="dloc__ring" />
        <circle cx={here.x} cy={here.y} r="7" className="dloc__here" />
        <text
          x={labelLeft ? here.x - 20 : here.x + 20}
          y={here.y + 5}
          textAnchor={labelLeft ? 'end' : 'start'}
          className="dloc__label"
          lang={lang}
        >
          {name}
        </text>
      </svg>
      <figcaption className="dloc__cap">
        {t(
          'Each dot is a district headquarters. Approximate positions, not to scale.',
          'ஒவ்வொரு புள்ளியும் ஒரு மாவட்டத் தலைமையகம். தோராயமான இடங்கள்; அளவுக்கேற்ப அல்ல.'
        )}
      </figcaption>
    </figure>
  );
}
