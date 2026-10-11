import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Dot } from '../../../components';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useLang } from '../../../lib/i18n.jsx';
import { SWITCH_STEPS } from './connectData.js';
import './SwitchStepper.css';

const EASE = [0.2, 0, 0.38, 0.9];

/** Founder Switch explainer: four stages across 12 weeks, ending in an interactive go / no-go. */
export default function SwitchStepper() {
  const uid = useId();
  const reduced = useReducedMotion();
  const { t: tr, lang } = useLang();
  const [step, setStep] = useState(0);
  const [checks, setChecks] = useState({});
  const titleRef = useRef(null);
  const focusTitle = useRef(false);
  const last = SWITCH_STEPS.length - 1;
  const current = SWITCH_STEPS[step];
  const evidence = SWITCH_STEPS.slice(0, last);
  const done = evidence.filter((s) => checks[s.id]).length;
  const go = done === evidence.length;
  const t = reduced ? { duration: 0 } : { duration: 0.32, ease: EASE };

  // The nav button the user pressed disables itself at either end; move focus to the new stage
  // heading so it never drops to <body>.
  useEffect(() => {
    if (!focusTitle.current) return;
    focusTitle.current = false;
    titleRef.current?.focus({ preventScroll: true });
  }, [step]);
  const goTo = (next) => {
    const n = Math.max(0, Math.min(last, next));
    if (n === last || n === 0) focusTitle.current = true;
    setStep(n);
  };

  return (
    <div className="connect-switch">
      <div className="connect-switch__rail" aria-hidden="true">
        <div className="connect-switch__track">
          <motion.div className="connect-switch__fill" initial={false} animate={{ scaleX: step / last }} transition={t} />
        </div>
        <div className="connect-switch__weeks">
          {Array.from({ length: 12 }, (_, i) => <span key={i} className="connect-switch__tick" />)}
        </div>
        <div className="connect-switch__weeklabels caption"><span>{tr('Week 1', 'வாரம் 1')}</span><span>{tr('Week 12', 'வாரம் 12')}</span></div>
      </div>

      <ol className="connect-switch__steps" aria-label={tr('Founder Switch stages', 'Founder Switch நிலைகள்')}>
        {SWITCH_STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="connect-switch__step"
              aria-current={i === step ? 'step' : undefined}
              aria-controls={`${uid}-panel`}
              data-state={i < step ? 'done' : i === step ? 'current' : 'todo'}
              onClick={() => setStep(i)}
            >
              <span className="connect-switch__num tnum" aria-hidden="true">{i < step ? <Check size={16} /> : i + 1}</span>
              <span className="connect-switch__label">{tr(s.label, s.labelTa)}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="connect-switch__panel" id={`${uid}-panel`} aria-live="polite">
        {/* Re-keyed per stage: content swaps at once, the entrance animates (no exit wait, never stuck). */}
          <motion.div
            key={current.id}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t}
          >
            <p className="caption connect-switch__count">
              {lang === 'ta'
                ? <>நிலை <span className="tnum">{step + 1}</span> / <span className="tnum">{SWITCH_STEPS.length}</span></>
                : <>Stage <span className="tnum">{step + 1}</span> of <span className="tnum">{SWITCH_STEPS.length}</span></>}
            </p>
            <h3 className="h3 connect-switch__title" ref={titleRef} tabIndex={-1}>{tr(current.title, current.titleTa)}</h3>

            {step < last ? (
              <p className="connect-switch__body">{tr(current.body, current.bodyTa)}</p>
            ) : (
              <div className="connect-switch__decide">
                <fieldset className="connect-switch__checks">
                  <legend className="connect-switch__legend small">{tr('Try it: which of these can you say today?', 'முயன்று பாருங்கள்: இவற்றில் எதை இன்று நீங்கள் சொல்ல முடியும்?')}</legend>
                  {evidence.map((s) => (
                    <label key={s.id} className="connect-switch__check">
                      <input type="checkbox" checked={!!checks[s.id]} onChange={(e) => setChecks((c) => ({ ...c, [s.id]: e.target.checked }))} />
                      <span className="connect-switch__box" aria-hidden="true"><Check size={14} /></span>
                      <span>{tr(s.check, s.checkTa)}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="connect-switch__meter">
                  <div className="connect-switch__ends caption" aria-hidden="true"><span>{tr('No-go', 'வேண்டாம்')}</span><span>{tr('Go', 'தொடரலாம்')}</span></div>
                  <div className="connect-switch__gauge" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => <span key={i} className="connect-switch__notch" style={{ left: `${(i / 3) * 100}%` }} />)}
                    <motion.div className="connect-switch__needle-wrap" initial={false} animate={{ x: `${(done / evidence.length) * 100}%` }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}>
                      <span className={`connect-switch__needle${go ? ' is-go' : ''}`} />
                    </motion.div>
                  </div>
                  <p className={`connect-switch__verdict h4${go ? ' is-go' : ''}`} role="status">
                    {go
                      ? <>{tr('Go. You can defend this decision', 'தொடரலாம். இந்த முடிவை நீங்கள் நியாயப்படுத்த முடியும்')}<Dot /></>
                      : <>{tr('No-go, for now. That is a decision you can defend too', 'இப்போதைக்கு வேண்டாம். இதுவும் நீங்கள் நியாயப்படுத்தக்கூடிய முடிவுதான்')}<Dot /></>}
                  </p>
                  <p className="caption connect-switch__note">{tr('An illustration of the decision Founder Switch ends with, not an assessment. You make the call with your own evidence.', 'இது Founder Switch நிறைவடையும் முடிவின் ஒரு விளக்கம் மட்டுமே, மதிப்பீடு அல்ல. உங்கள் சொந்தச் சான்றுகளைக் கொண்டு நீங்களே முடிவு செய்கிறீர்கள்.')}</p>
                </div>
              </div>
            )}
          </motion.div>
      </div>

      <div className="connect-switch__nav">
        <button type="button" className="connect-switch__navbtn" onClick={() => goTo(step - 1)} disabled={step === 0}>
          <ArrowLeft size={18} aria-hidden="true" /> {tr('Previous', 'முந்தையது')}
        </button>
        <button type="button" className="connect-switch__navbtn connect-switch__navbtn--next" onClick={() => goTo(step + 1)} disabled={step === last}>
          {step === last - 1 ? tr('Decide', 'முடிவு செய்யுங்கள்') : tr('Next stage', 'அடுத்த நிலை')} <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
