import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { MotionFeatures } from '../lib/motionFeatures.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { Dot } from './Dot.jsx';
import { cx } from './_utils.js';
import './FormSuccess.css';

/** Success state: the check draws, then the full stop lands (R4 pattern 29). Focus moves here. */
export function FormSuccess({ title, body, children, headingLevel = 3, className }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: false });
  }, []);
  const H = `h${headingLevel}`;
  const text = typeof title === 'string' ? title.trim() : title;
  const endsWithStop = typeof text === 'string' && /[^.]\.$/.test(text);
  return (
    <MotionFeatures>
    <div className={cx('form-success', className)} role="status" aria-live="polite">
      <svg className="form-success__check" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle className="form-success__ring" cx="24" cy="24" r="22" />
        <m.path
          className="form-success__tick"
          d="M14 24.5l7 7 13-15"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.12 }}
        />
      </svg>
      <H ref={ref} tabIndex={-1} className="form-success__title">
        {endsWithStop ? (
          <>
            {text.slice(0, -1)}
            <Dot animate={!reduced} delay={0.55} />
          </>
        ) : (
          text
        )}
      </H>
      {body && <div className="form-success__body">{typeof body === 'string' ? <p>{body}</p> : body}</div>}
      {children}
    </div>
    </MotionFeatures>
  );
}

export default FormSuccess;
