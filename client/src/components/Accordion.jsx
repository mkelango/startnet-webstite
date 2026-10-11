import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx, safeId } from './_utils.js';
import { hasMark, isPlaceholderAnswer, isPlaceholderNode } from './_placeholders.js';
import { InlineMarks } from './InlineMarks.jsx';
import { faqLd } from '../lib/seo.js';
import './Accordion.css';

const OPEN_MS = 420; // grid-template-rows 0fr → 1fr over 400ms (+ a frame)

/**
 * Accordion panel (DESIGN-v2 3.10). Closed panels keep the `hidden` attribute (SSR, prerender, crawlers see the
 * text). Opening removes `hidden`, then animates grid-template-rows 0fr → 1fr (400ms) and the answer's opacity;
 * closing reverses, then sets `hidden` again. Reduced motion: instant.
 */
function AccordionPanel({ open, id, labelledBy, reduced, children }) {
  // closed (hidden) → pre (shown at 0fr) → entering (1fr) → open; open → exiting (0fr) → closed
  const [state, setState] = useState(open ? 'open' : 'closed');
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const cur = stateRef.current;
    if (open && (cur === 'closed' || cur === 'exiting')) setState(reduced ? 'open' : 'pre');
    if (!open && (cur === 'open' || cur === 'entering' || cur === 'pre')) setState(reduced ? 'closed' : 'exiting');
  }, [open, reduced]);
  useEffect(() => {
    if (state === 'pre') {
      let r2 = 0;
      const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setState('entering')); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    if (state === 'entering' || state === 'exiting') {
      const t = setTimeout(() => setState((s) => (s === 'entering' ? 'open' : s === 'exiting' ? 'closed' : s)), OPEN_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [state]);
  const shown = state !== 'closed';
  const expanded = state === 'entering' || state === 'open';
  return (
    <div
      id={id}
      role={shown ? 'region' : undefined}
      aria-labelledby={shown ? labelledBy : undefined}
      className="accordion__panel"
      data-expanded={expanded ? '' : undefined}
      hidden={!shown}
    >
      <div className="accordion__clip">{children}</div>
    </div>
  );
}

/** Disclosure accordion inside headings (Book 3 C34). `faq` emits FAQPage JSON-LD. */
export function Accordion({ items, faq = false, headingLevel = 3, defaultOpen, className }) {
  const reduced = useReducedMotion();
  const uid = safeId(useId());
  // A question whose answer is missing or still only a placeholder is not shown until the answer exists.
  const list = (Array.isArray(items) ? items : []).filter(
    (it) => it && !isPlaceholderNode(it.answer) && !isPlaceholderAnswer(it.answer)
  );
  const [open, setOpen] = useState(() => new Set(defaultOpen != null ? [].concat(defaultOpen) : []));
  if (!list.length) return null;
  const H = `h${Math.min(Math.max(Number(headingLevel) || 3, 2), 6)}`;

  const toggle = (key) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  // Plain-string Q&A only, and never an answer that still carries a placeholder or confidence mark (lib/seo.js).
  const jsonLd = faq ? faqLd(list) : null;

  return (
    <div className={cx('accordion', className)}>
      {list.map((it, i) => {
        const key = it.id || `${i}`;
        const isOpen = open.has(key);
        const btnId = `acc-b-${uid}-${i}`;
        const panelId = `acc-p-${uid}-${i}`;
        return (
          <div className={cx('accordion__item', isOpen && 'accordion__item--open')} key={key} id={it.id || undefined}>
            <H className="accordion__heading">
              <button
                type="button"
                id={btnId}
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(key)}
              >
                <span className="accordion__question">{it.question}</span>
                <span className="accordion__icon" aria-hidden="true">
                  <span className="accordion__bar accordion__bar--h" />
                  <span className="accordion__bar accordion__bar--v" />
                </span>
              </button>
            </H>
            <AccordionPanel open={isOpen} id={panelId} labelledBy={btnId} reduced={reduced}>
              <div className="accordion__answer">
                {typeof it.answer === 'string' ? <p>{hasMark(it.answer) ? <InlineMarks text={it.answer} /> : it.answer}</p> : it.answer}
              </div>
            </AccordionPanel>
          </div>
        );
      })}
      {jsonLd && jsonLd.mainEntity.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </div>
  );
}

export default Accordion;
