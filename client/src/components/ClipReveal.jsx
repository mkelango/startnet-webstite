import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx } from './_utils.js';
import './ClipReveal.css';

/**
 * Scroll-linked media expand (DESIGN-v2 3.13): clip-path inset(7% 9% round 12px) → inset(0 round 12px) as the
 * block travels from 'start end' to 'start 0.25'. Only clip-path changes (no layout, no CLS).
 * SSR, prerender, before hydration and under reduced motion it renders a plain wrapper at the end state.
 * Usage: <ClipReveal><VideoFeature … /></ClipReveal>. Props: as (default 'div'), className, ...rest.
 */
export function ClipReveal({ as = 'div', children, className, ...rest }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const Tag = as;
  if (!mounted || reduced) {
    return (
      <Tag className={cx('clip-reveal', className)} {...rest}>
        {children}
      </Tag>
    );
  }
  return (
    <ClipRevealLive as={as} className={className} rest={rest}>
      {children}
    </ClipRevealLive>
  );
}

const lerp = (a, b, t) => a + (b - a) * t;

function ClipRevealLive({ as: Tag, className, rest, children }) {
  const ref = useRef(null);
  const done = useRef(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  const write = (v) => {
    const el = ref.current;
    if (!el || done.current) return;
    const t = Math.min(1, Math.max(0, v));
    el.style.clipPath = t >= 1 ? '' : `inset(${lerp(7, 0, t).toFixed(2)}% ${lerp(9, 0, t).toFixed(2)}% round 12px)`;
  };
  useMotionValueEvent(scrollYProgress, 'change', write);
  useEffect(() => write(scrollYProgress.get()), [scrollYProgress]); // eslint-disable-line react-hooks/exhaustive-deps
  // Keyboard focus inside ends the reveal at once: a partial clip would cut the focus ring of the link or button.
  const onFocus = (e) => {
    rest.onFocus?.(e);
    if (done.current) return;
    done.current = true;
    if (ref.current) ref.current.style.clipPath = '';
  };
  return (
    <Tag ref={ref} className={cx('clip-reveal', 'clip-reveal--live', className)} {...rest} onFocus={onFocus}>
      {children}
    </Tag>
  );
}

export default ClipReveal;
