import { Children, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { cx } from './_utils.js';
import './ScrubText.css';

const TAMIL = /[\u0B80-\u0BFF]/;

/**
 * Scroll-scrubbed statement (DESIGN-v2 3.21.1): each word goes from opacity .18 to 1 as the block scrolls from
 * 'start 0.85' to 'end 0.5'. One per page at most.
 * SSR / prerender / before mount / reduced motion / Tamil / non-string children: the plain text, unchanged.
 * After mount the string is split on spaces only (spaces kept) into span.scrub__w; one scroll listener writes a
 * single --p custom property and CSS computes each word's opacity from --i / --n. The text stays real text.
 * Props: as (default 'p'), children (a string), className, ...rest.
 */
export function ScrubText({ as = 'p', children, className, ...rest }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const kids = Children.toArray(children);
  const text = kids.length === 1 && typeof kids[0] === 'string' ? kids[0] : null;
  const Tag = as;
  if (!mounted || reduced || !text || TAMIL.test(text)) {
    return (
      <Tag className={cx('scrub', className)} {...rest}>
        {children}
      </Tag>
    );
  }
  return <ScrubWords as={as} text={text} className={className} rest={rest} />;
}

function ScrubWords({ as: Tag, text, className, rest }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const write = (v) => ref.current?.style.setProperty('--p', String(Math.min(1, Math.max(0, v)).toFixed(4)));
  useMotionValueEvent(scrollYProgress, 'change', write);
  useEffect(() => write(scrollYProgress.get()), [scrollYProgress]); // eslint-disable-line react-hooks/exhaustive-deps
  const parts = text.split(/(\s+)/);
  const n = parts.filter((p) => p && !/^\s+$/.test(p)).length;
  let i = -1;
  return (
    <Tag ref={ref} className={cx('scrub', 'scrub--on', className)} style={{ '--n': n }} {...rest}>
      {parts.map((p, k) => {
        if (!p) return null;
        if (/^\s+$/.test(p)) return p;
        i += 1;
        return (
          <span key={k} className="scrub__w" style={{ '--i': i }}>
            {p}
          </span>
        );
      })}
    </Tag>
  );
}

export default ScrubText;
