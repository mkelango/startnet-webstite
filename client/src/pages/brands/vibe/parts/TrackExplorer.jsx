import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Languages, HeartPulse, Leaf, Building2, LineChart } from 'lucide-react';
import { useReducedMotion } from '../../../../hooks/useReducedMotion.js';
import { useLang } from '../../../../lib/i18n.jsx';
import { Button } from '../../../../components';
import { vibathonRegisterLink, tx, tr } from '../vibeContent.js';
import { ph } from './ph.jsx';
import './TrackExplorer.css';

const ICONS = { Languages, HeartPulse, Leaf, Building2, LineChart };
/**
 * Vibathon tracks explorer: five framed cards (DESIGN-v2 3.7, no tilt); choosing one opens its brief and a
 * track-specific Register link.
 * @param {{ tracks: {id, name, brief, icon}[] }} props
 */
export default function TrackExplorer({ tracks }) {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(tracks[0]?.id);
  const panelRef = useRef(null);
  const userPicked = useRef(false);
  const current = tracks.find((x) => x.id === selected) || tracks[0];
  const idx = tracks.indexOf(current);
  const Icon = ICONS[current.icon] || Languages;
  const tr_ = (track) => tr(t, track, 'name');

  // Below 1024px the brief sits under the cards: bring it into view after a choice (never on first render).
  useEffect(() => {
    if (!userPicked.current) return;
    userPicked.current = false;
    const panel = panelRef.current;
    if (!panel || !window.matchMedia?.('(max-width: 1023px)').matches) return;
    const r = panel.getBoundingClientRect();
    const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bottom-cta-h')) || 64;
    // Already fully on screen (above the bottom action bar): leave the page where it is.
    if (r.top >= 0 && r.bottom <= window.innerHeight - bar) return;
    // Otherwise bring the start of the brief up under the header (scroll-margin-top on the panel).
    panel.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
  }, [selected, reduced]);

  const pick = (id) => {
    userPicked.current = true;
    setSelected(id);
  };

  return (
    <div className="vibe-tracks">
      <p className="visually-hidden" id="vibe-tracks-help">{t('Choose a track to see its brief.', 'ஒரு பிரிவின் விவரத்தைப் பார்க்க அதைத் தேர்ந்தெடுங்கள்.')}</p>
      <ul className="vibe-tracks__grid" aria-describedby="vibe-tracks-help">
        {tracks.map((track, i) => {
          const I = ICONS[track.icon] || Languages;
          const on = track.id === current.id;
          return (
            <li key={track.id} className="vibe-tracks__item">
              <button
                type="button"
                className={`vibe-tracks__card${on ? ' is-selected' : ''}`}
                aria-pressed={on}
                aria-controls="vibe-tracks-panel"
                onClick={() => pick(track.id)}
              >
                <span className="vibe-tracks__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <I className="vibe-tracks__icon" size={28} strokeWidth={1.75} aria-hidden="true" />
                <span className="vibe-tracks__name">{tr_(track)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="vibe-tracks__panel" id="vibe-tracks-panel" aria-live="polite" ref={panelRef}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            className="vibe-tracks__panel-inner"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: [0, 0, 0.3, 1] }}
          >
            <div className="vibe-tracks__panel-head">
              <Icon size={40} strokeWidth={1.5} aria-hidden="true" className="vibe-tracks__panel-icon" />
              <div>
                <p className="eyebrow">{t(`Track ${idx + 1} of ${tracks.length}`, `பிரிவு ${idx + 1} / ${tracks.length}`)}</p>
                <h3 className="h3">{tr_(current)}</h3>
              </div>
            </div>
            <p className="body-lg vibe-tracks__brief">{ph(tr(t, current, 'brief'))}</p>
            {/* Track partner and problem statements are hidden until StartNet supplies them (both are placeholders today). */}
            <div className="vibe-tracks__cta">
              <p className="caption vibe-tracks__cta-cap" id="vibe-tracks-cta-cap">
                {t('Track:', 'பிரிவு:')} {tr_(current)}
              </p>
              <Button
                variant="brand"
                href={vibathonRegisterLink(lang, { track: current.id })}
                aria-describedby="vibe-tracks-cta-cap"
              >
                {tx(t, 'Register your team')}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
