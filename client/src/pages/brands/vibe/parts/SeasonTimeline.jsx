import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../../hooks/useReducedMotion.js';
import { useLang } from '../../../../lib/i18n.jsx';
import { ph } from './ph.jsx';
import { isPlaceholderText } from '../../../../components/_placeholders.js';
import './SeasonTimeline.css';

const DESKTOP = '(min-width: 1024px)';
/* Tamil keeps the three-column, per-stage track until 1280 (SeasonTimeline.css, V-R1): the scroll-drawn rail starts there */
const DESKTOP_TA = '(min-width: 1280px)';
const REDUCE = '(prefers-reduced-motion: reduce)';

/**
 * Vibathon season timeline (Book 4 E3 F4, DESIGN-v2 6.2): an Ink track with the stages; the accent dot marks "now";
 * past stages solid, future ones outlined. The progress draws with scroll (GSAP ScrollTrigger, scrub, no pin) and the
 * dot settles once. Stages are visible from first paint. At rest (no JS / reduced motion / below 1024px) the track is fully drawn and the dot is in place.
 * GSAP + ScrollTrigger are loaded on demand, only on a desktop-width screen with motion allowed.
 * One plain matchMedia listener per mount (removed on unmount) starts the effect when the window reaches 1024px
 * and reverts it when it drops below; no gsap.matchMedia() instances are created.
 * Stage strings arrive already localised (Vibathon.jsx).
 * @param {{ stages: {id, stage, when, date?, what}[], now?: number }} props
 */
export default function SeasonTimeline({ stages, now = Date.now() }) {
  const { t, lang } = useLang();
  const root = useRef(null);
  const reduced = useReducedMotion();
  const n = stages.length;

  let nowIndex = -1;
  stages.forEach((s, i) => { if (s.date && new Date(s.date).getTime() <= now) nowIndex = i; });
  const nowLeft = nowIndex === -1 ? 0 : (nowIndex / n) * 100;

  useEffect(() => {
    if (reduced || !root.current || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const desktop = window.matchMedia(lang === 'ta' ? DESKTOP_TA : DESKTOP);
    let cancelled = false;
    let ctx = null;
    let loading = false;

    const stop = () => {
      ctx?.revert();
      ctx = null;
    };

    const start = async () => {
      if (ctx || loading || cancelled || !desktop.matches || window.matchMedia(REDUCE).matches) return;
      loading = true;
      let mods;
      try {
        mods = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      } catch {
        // Chunk failed to load (offline, deploy in flight): the timeline is already fully drawn at rest.
        return;
      } finally {
        loading = false;
      }
      const [{ default: gsap }, { ScrollTrigger }] = mods;
      // Re-check: the window may have narrowed or the component unmounted while the chunk loaded.
      if (cancelled || ctx || !root.current || !desktop.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          '.vibe-timeline__progress',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.4 },
          }
        );
        // DESIGN-v2 4: the first state is fully drawn at first paint (stages are never hidden), no pin, no bounce.
        if (root.current.querySelector('.vibe-timeline__now-dot')) gsap.from('.vibe-timeline__now-dot', {
          scale: 0, duration: 0.32, ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 65%', once: true },
        });
      }, root);
    };

    const onChange = () => (desktop.matches ? start().catch(() => {}) : stop());
    start().catch(() => {});
    desktop.addEventListener?.('change', onChange);
    return () => {
      cancelled = true;
      desktop.removeEventListener?.('change', onChange);
      stop();
    };
  }, [reduced, lang]);

  return (
    <div className="vibe-timeline" ref={root} style={{ '--vibe-timeline-n': n }}>
      {nowIndex === -1 && (
        <p className="vibe-timeline__now-label">
          <span className="vibe-timeline__now-mark" aria-hidden="true" />
          <span>
            <strong>{t('Now:', 'இப்போது:')}</strong>{' '}
            {t(
              'the 2027 season is being set up. Dates appear here as StartNet confirms them.',
              '2027 போட்டிப் பருவம் தயாராகி வருகிறது. StartNet உறுதி செய்யும்போது தேதிகள் இங்கே தோன்றும்.'
            )}
          </span>
        </p>
      )}
      <div className="vibe-timeline__body">
      <div className="vibe-timeline__rail" aria-hidden="true">
        <span className="vibe-timeline__track" />
        <span className="vibe-timeline__progress" />
        {nowIndex >= 0 && <span className="vibe-timeline__now-dot" style={{ left: `${nowLeft}%` }} />}
      </div>
      <ol className="vibe-timeline__list">
        {stages.map((s, i) => {
          const state = i < nowIndex ? 'past' : i === nowIndex ? 'now' : 'future';
          return (
            <li key={s.id} className={`vibe-timeline__stage vibe-timeline__stage--${state}`}>
              <span className="vibe-timeline__node" aria-hidden="true" />
              {/* A date that is still only a placeholder ("[date]") is left out; the stage stays. */}
              {(state === 'now' || (s.when && !isPlaceholderText(s.when))) && (
                <p className="vibe-timeline__when tnum">
                  {state === 'now' && <span className="vibe-timeline__now-chip">{t('Now', 'இப்போது')}</span>}
                  {s.when && !isPlaceholderText(s.when) ? (s.date ? s.when : ph(s.when)) : null}
                </p>
              )}
              <h3 className="vibe-timeline__title">{s.stage}</h3>
              <p className="vibe-timeline__what small text-2">{ph(s.what)}</p>
            </li>
          );
        })}
      </ol>
      </div>
    </div>
  );
}
