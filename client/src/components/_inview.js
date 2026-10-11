/*
 * Shared "first time in view" observer (F-33/F-14). One IntersectionObserver per viewport option set serves
 * every element on the page, instead of one observer (and one framer-motion feature bundle) per element.
 * Matches framer-motion's whileInView with `once: true, amount: 'some'`: the callback runs the first time any
 * part of the element intersects the (margin-adjusted) viewport, then the element is unobserved.
 */
const observers = new Map();

export function observeOnce(el, callback, { margin = '0px', amount = 0 } = {}) {
  if (!el) return () => {};
  if (typeof IntersectionObserver === 'undefined') {
    callback();
    return () => {};
  }
  const key = `${margin}|${amount}`;
  let entry = observers.get(key);
  if (!entry) {
    const callbacks = new Map();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          if (!r.isIntersecting) continue;
          const fn = callbacks.get(r.target);
          if (!fn) continue;
          callbacks.delete(r.target);
          io.unobserve(r.target);
          fn();
        }
      },
      { rootMargin: margin, threshold: amount }
    );
    entry = { io, callbacks };
    observers.set(key, entry);
  }
  const { io, callbacks } = entry;
  callbacks.set(el, callback);
  io.observe(el);
  return () => {
    if (callbacks.get(el) === callback) {
      callbacks.delete(el);
      io.unobserve(el);
    }
  };
}
