// URL-synced page tabs (Book 3 C33 `page` variant: WAI-ARIA tabs, manual activation, sliding indicator).
// Page-local because the shared Tabs component is uncontrolled; state lives in ?tab= so links can be shared.
// DESIGN-v2 3.12: one 2px Ink underline glides between tabs (useSlidingIndicator, transform only). Before it is
// measured (prerender, no JS) the selected tab draws its own static underline.
import { useEffect, useId, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSlidingIndicator } from '../../../components/_indicator.js';
import './UrlTabs.css';

export default function UrlTabs({ tabs, label, param = 'tab' }) {
  const [params, setParams] = useSearchParams();
  const base = useId().replace(/:/g, '');
  const refs = useRef([]);
  const listRef = useRef(null);
  const requested = params.get(param);
  const active = tabs.find((t) => t.id === requested)?.id || tabs[0]?.id;

  useSlidingIndicator(listRef, '[aria-selected="true"]', [active, tabs.length]);

  const select = (id) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id === tabs[0].id) next.delete(param);
        else next.set(param, id);
        return next;
      },
      // A user tab change is a history entry, so Back returns to the previous tab (not off the event).
      { replace: false, preventScrollReset: true }
    );

  // Normalise an unknown ?tab= value on load without adding a history entry.
  useEffect(() => {
    if (requested == null || tabs.some((t) => t.id === requested)) return;
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(param);
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requested]);

  const onKeyDown = (e, i) => {
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j != null) {
      e.preventDefault();
      refs.current[j]?.focus(); // manual activation: Enter/Space selects
    }
  };

  return (
    <div className="urltabs">
      <div className="urltabs__list-wrap">
        <div className="urltabs__list" role="tablist" aria-label={label} ref={listRef}>
          {tabs.map((t, i) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => (refs.current[i] = el)}
                type="button"
                role="tab"
                id={`${base}-tab-${t.id}`}
                aria-selected={on}
                aria-controls={`${base}-panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                className={`urltabs__tab${on ? ' is-active' : ''}`}
                onClick={() => select(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                {t.label}
              </button>
            );
          })}
          <span className="ind ind--line urltabs__indicator" aria-hidden="true" />
        </div>
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="urltabs__panel"
        >
          {t.id === active && <div className="urltabs__panel-in">{t.content}</div>}
        </div>
      ))}
    </div>
  );
}
