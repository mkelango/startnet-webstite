// Back to top (v2b interaction layer). A 48px Ink ring button, bottom-right, that appears once the visitor is more
// than two viewport heights down and glides the page back up (Lenis when running, instant under reduced motion).
// Focus then moves to the skip link's target (<main>), so keyboard and screen-reader users land at the top too.
// It sits above the mobile bottom CTA bar, steps aside while the consent card or a modal is open (CSS), and is
// client-only (it needs JS to work, so the prerendered page never shows it).
// Phones (< 768px): a floating button would sit over card text, FAQ toggles and form controls the whole way down, so
// there it shows only while the visitor scrolls back up (the moment they want it) and hides again on scroll down.
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { scrollToY } from '../lib/smoothScroll.js';

const SHOW_AFTER = 2; // viewport heights
const PHONE = '(max-width: 767.98px)';
const DIR_THRESHOLD = 24; // px of travel before a change of direction counts (ignores jitter and momentum wobble)

export default function BackToTop() {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    let anchorY = window.scrollY; // where the current scroll direction started
    let up = false;
    const phone = window.matchMedia?.(PHONE);
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      const far = y > window.innerHeight * SHOW_AFTER;
      if (!phone?.matches) { setShown(far); anchorY = y; return; }
      if (y < anchorY - DIR_THRESHOLD) { up = true; anchorY = y; }
      else if (y > anchorY + DIR_THRESHOLD) { up = false; anchorY = y; }
      else if (up ? y < anchorY : y > anchorY) anchorY = y; // keep the anchor at the furthest point in this direction
      setShown(far && up);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!mounted) return null;

  const onClick = () => {
    scrollToY(0, {
      onDone: () => {
        const main = document.getElementById('main');
        if (main) main.focus({ preventScroll: true });
      },
    });
  };

  return (
    <button
      type="button"
      className="back-to-top"
      data-shown={shown || undefined}
      aria-hidden={shown ? undefined : 'true'}
      tabIndex={shown ? undefined : -1}
      onClick={onClick}
      aria-label={t('Back to top', 'மேலே செல்லவும்')}
      title={t('Back to top', 'மேலே செல்லவும்')}
    >
      <ArrowUp size={20} strokeWidth={1.9} aria-hidden="true" className="back-to-top__icon" />
    </button>
  );
}
