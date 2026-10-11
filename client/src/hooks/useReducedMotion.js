import { useSyncExternalStore } from 'react';

/*
 * One shared subscription (one matchMedia listener, one MutationObserver on <html data-motion>) for every caller.
 * The hook runs in each Reveal, Stat, Tabs… instance, and Home mounts dozens of them in its first render; a
 * listener + observer per instance added avoidable work to that first long task (F-14).
 */
const QUERY = '(prefers-reduced-motion: reduce)';

function read() {
  if (typeof window === 'undefined') return false;
  const pref = document.documentElement.dataset.motion;
  if (pref === 'reduced') return true;
  if (pref === 'full') return false;
  return !!window.matchMedia?.(QUERY).matches;
}

const listeners = new Set();
let teardown = null;

function subscribe(listener) {
  listeners.add(listener);
  if (!teardown && typeof window !== 'undefined') {
    const notify = () => listeners.forEach((l) => l());
    const mq = window.matchMedia?.(QUERY);
    mq?.addEventListener?.('change', notify);
    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(notify) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    teardown = () => { mq?.removeEventListener?.('change', notify); mo?.disconnect(); };
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && teardown) { teardown(); teardown = null; }
  };
}

/**
 * True when the on-site switch sets <html data-motion="reduced">, or when the OS asks for reduced
 * motion and the switch has not been set to "full" (data-motion="full" overrides the device).
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, read, () => false);
}
