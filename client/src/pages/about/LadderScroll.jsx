// The founder ladder L1–L7 as a storytelling sequence (Mission 1 Lakh, one pin per route — Book 4 R4).
// Desktop (≥ 1024 px, motion allowed): GSAP ScrollTrigger pins the section and scrubs through the seven levels;
// the red full stop climbs the stair. Phones / reduced motion: a plain vertical stepper with every definition visible.
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useLang } from '../../lib/i18n.jsx';
import './LadderScroll.css';

export const LEVELS = [
  {
    code: 'L1', name: 'Aware', nameTa: 'அறிந்தவர்',
    def: 'Attended an event or joined the community. Tracked, not counted as nurtured.',
    defTa: 'ஒரு நிகழ்வில் கலந்துகொண்டவர் அல்லது சமூகத்தில் இணைந்தவர். கண்காணிக்கப்படுவார்; வளர்க்கப்பட்டவராகக் கணக்கிடப்படமாட்டார்.',
  },
  {
    code: 'L2', name: 'Nurtured', nameTa: 'வளர்க்கப்பட்டவர்',
    def: 'A StartNet X profile plus at least two meaningful touchpoints.',
    defTa: 'ஒரு StartNet X சுயவிவரமும், குறைந்தது இரண்டு அர்த்தமுள்ள தொடர்புகளும்.',
  },
  { code: 'L3', name: 'Skilled', nameTa: 'திறன் பெற்றவர்', def: 'Completed a structured programme.', defTa: 'கட்டமைக்கப்பட்ட ஒரு திட்டத்தை நிறைவு செய்தவர்.' },
  { code: 'L4', name: 'Building', nameTa: 'உருவாக்குபவர்', def: 'A team with a prototype or MVP in progress.', defTa: 'முன்மாதிரி அல்லது MVP உருவாக்கத்தில் இருக்கும் ஒரு குழு.' },
  { code: 'L5', name: 'Launched', nameTa: 'தொடங்கியவர்', def: 'A registered company.', defTa: 'பதிவுசெய்யப்பட்ட ஒரு நிறுவனம்.' },
  { code: 'L6', name: 'Funded', nameTa: 'நிதி பெற்றவர்', def: 'First external capital, or ₹10 L+ revenue.', defTa: 'முதல் வெளி மூலதனம், அல்லது ₹10 லட்சம்+ வருவாய்.' },
  { code: 'L7', name: 'Scaling', nameTa: 'விரிவடைபவர்', def: '₹1 Cr+ revenue, Series A, or 25+ jobs.', defTa: '₹1 கோடி+ வருவாய், Series A, அல்லது 25+ வேலைகள்.' },
];

/** The seven levels in the current language: { code, name, def, definition }. */
export function useLevels() {
  const { t } = useLang();
  return LEVELS.map((l) => {
    const def = t(l.def, l.defTa);
    return { code: l.code, name: t(l.name, l.nameTa), def, definition: def };
  });
}

const DESKTOP = '(min-width: 1024px)';

function usePinMode() {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(DESKTOP).matches);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const on = () => setWide(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return wide && !reduced;
}

export default function LadderScroll({ intro, footer }) {
  const pinMode = usePinMode();
  return pinMode ? <PinnedLadder intro={intro} footer={footer} /> : <StepperLadder intro={intro} footer={footer} />;
}

function StepperLadder({ intro, footer }) {
  const levels = useLevels();
  return (
    <div className="container mission-ladder mission-ladder--stepper">
      <div className="mission-ladder__intro">{intro}</div>
      <ol className="mission-ladder__steps">
        {levels.map((l, i) => (
          <li key={l.code} className={`mission-ladder__step${i === 0 ? ' is-tracked' : ''}`}>
            <span className="mission-ladder__badge tnum">{l.code}</span>
            <div>
              <h3 className="h5 mission-ladder__name">{l.name}</h3>
              <p className="mission-ladder__def">{l.def}</p>
            </div>
          </li>
        ))}
      </ol>
      {footer && <div className="mission-ladder__footer">{footer}</div>}
    </div>
  );
}

function PinnedLadder({ intro, footer }) {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const stRef = useRef(null);
  const [active, setActive] = useState(0);
  const { t } = useLang();
  const levels = useLevels();

  useEffect(() => {
    let ctx;
    let ro;
    let timer;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled || !pinRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h-compact'), 10) || 56;
      ctx = gsap.context(() => {
        stRef.current = ScrollTrigger.create({
          trigger: pinRef.current,
          start: `top top+=${headerH}`,
          // DESIGN-v2 section 4: the pin is capped at 1.2 viewports (no pin below 1024px or under reduced motion).
          end: () => `+=${Math.round(window.innerHeight * 1.2)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(LEVELS.length - 1, Math.floor(self.progress * LEVELS.length));
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
      }, rootRef);
      // Content above the pin (API-fed figures, fonts) can change height after mount: re-measure, debounced.
      if (typeof ResizeObserver !== 'undefined') {
        let lastH = document.body.scrollHeight;
        ro = new ResizeObserver(() => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            const h = document.body.scrollHeight;
            if (Math.abs(h - lastH) > 2) { lastH = h; ScrollTrigger.refresh(); }
          }, 200);
        });
        ro.observe(document.body);
      }
    })().catch(() => {});
    return () => { cancelled = true; clearTimeout(timer); ro?.disconnect(); stRef.current = null; ctx?.revert(); };
  }, []);

  const goTo = (i) => {
    const st = stRef.current;
    if (!st) { setActive(i); return; }
    const y = st.start + ((i + 0.5) / LEVELS.length) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const level = levels[active];

  return (
    <div className="mission-ladder mission-ladder--pinned" ref={rootRef}>
      <div className="mission-ladder__pin" ref={pinRef}>
        <div className="container mission-ladder__frame">
          <div className="mission-ladder__copy">
            <div className="mission-ladder__intro">{intro}</div>
            <div className="mission-ladder__now" aria-hidden="true" key={level.code}>
              <p className="mission-ladder__now-code tnum">{level.code} <span className="mission-ladder__now-of">/ 7</span></p>
              <p className="mission-ladder__now-name">{level.name}</p>
              <p className="mission-ladder__now-def">{level.def}</p>
            </div>
            {/* full ladder for assistive tech, independent of scroll position */}
            <ol className="visually-hidden">
              {levels.map((l) => <li key={l.code}>{`${l.code} ${l.name}: ${l.def}`}</li>)}
            </ol>
          </div>

          <div className="mission-ladder__chart" style={{ '--i': active }} aria-hidden="true">
            <div className="mission-ladder__bars">
              {levels.map((l, i) => (
                <button
                  key={l.code}
                  type="button"
                  tabIndex={-1}
                  className={`mission-ladder__bar${i <= active ? ' is-reached' : ''}${i === active ? ' is-active' : ''}${i === 0 ? ' is-tracked' : ''}`}
                  style={{ '--h': (i + 1) / LEVELS.length }}
                  onClick={() => goTo(i)}
                >
                  <span className="mission-ladder__barfill" />
                  <span className="mission-ladder__barlabel">
                    <span className="tnum">{l.code}</span>
                    <span>{l.name}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mission-ladder__nurtured-line">
              <span>{t('Counted as nurtured from L2', 'L2 முதல் வளர்க்கப்பட்டவராகக் கணக்கிடப்படும்')}</span>
            </div>
            <div className="mission-ladder__dotlayer">
              <span className="mission-ladder__dot" />
            </div>
          </div>
        </div>
      </div>
      {/* The footer sits after the pinned frame so the frame always fits one viewport (Tamil copy is ~40% taller). */}
      {footer && <div className="container mission-ladder__footer">{footer}</div>}
    </div>
  );
}
