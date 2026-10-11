// "Funnel → platform → capital" model diagram (Book 1 Part A §1.1) for Our story.
// The red full stop travels along the rule as the section scrolls (GSAP scrub, desktop only).
// Static under reduced motion: the dot rests on the platform node.
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../lib/i18n.jsx';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { TALENT_BRANDS } from '../../data/brands.js';
import './ModelDiagram.css';

const DESKTOP = '(min-width: 1024px)';

export default function ModelDiagram() {
  const { t, localePath } = useLang();
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (reduced || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(DESKTOP);
    let ctx;
    let cancelled = false;
    let loading = false;
    let mods = null;

    const build = () => {
      if (cancelled || !mods || !rootRef.current || !dotRef.current) return;
      const { gsap, ScrollTrigger } = mods;
      ctx = gsap.context(() => {
        const rail = dotRef.current.parentElement;
        const fill = rail.querySelector('.about-model__fill');
        const st = { trigger: rootRef.current, start: 'top 75%', end: 'bottom 45%', scrub: 0.6, invalidateOnRefresh: true };
        gsap.fromTo(dotRef.current, { x: 0 }, { x: () => rail.clientWidth, ease: 'none', scrollTrigger: st });
        if (fill) gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...st } });
      }, rootRef);
      ScrollTrigger.refresh();
    };
    const teardown = () => { ctx?.revert(); ctx = undefined; };

    const sync = () => {
      if (!mq.matches) { teardown(); return; }
      if (ctx) return;
      if (mods) { build(); return; }
      if (loading) return;
      loading = true;
      Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
        .then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);
          mods = { gsap, ScrollTrigger };
          if (mq.matches) build();
        })
        .catch(() => {})
        .finally(() => { loading = false; });
    };

    sync();
    mq.addEventListener?.('change', sync);
    return () => {
      cancelled = true;
      mq.removeEventListener?.('change', sync);
      teardown();
    };
  }, [reduced]);

  return (
    <figure className={`about-model${reduced ? ' about-model--static' : ''}`} ref={rootRef} aria-labelledby="about-model-cap">
      <div className="about-model__rail" aria-hidden="true">
        <span className="about-model__fill" />
        <span className="about-model__dot" ref={dotRef} />
      </div>
      <ol className="about-model__stages">
        <li className="about-model__stage">
          <p className="about-model__step tnum">01 · {t('Funnel', 'நுழைவாயில்')}</p>
          <h3 className="h4">{t('Events and learning', 'நிகழ்வுகளும் கற்றலும்')}</h3>
          <p className="about-model__text">
            {t('Four talent brands bring people in through events and learning.', 'நான்கு திறமை பிராண்டுகள் நிகழ்வுகள், கற்றல் வழியாக மக்களை உள்ளே கொண்டுவருகின்றன.')}
          </p>
          <ul className="about-model__brands">
            {TALENT_BRANDS.map((b) => (
              <li key={b.key} data-brand={b.key}>
                <Link to={localePath(b.base)} className="about-model__brand" lang="en">
                  <span className="about-model__swatch" aria-hidden="true" />
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li className="about-model__stage about-model__stage--platform">
          <p className="about-model__step tnum">02 · {t('Platform', 'தளம்')}</p>
          <h3 className="h4">StartNet X</h3>
          <p className="about-model__text">
            {t('One profile per person, from first event to first funding round.', 'ஒருவருக்கு ஒரே சுயவிவரம், முதல் நிகழ்விலிருந்து முதல் நிதிச் சுற்று வரை.')}
          </p>
          <Link to={localePath('/startnet-x')} className="about-model__link">{t('Explore StartNet X', 'StartNet X-ஐப் பாருங்கள்')}</Link>
        </li>
        <li className="about-model__stage">
          <p className="about-model__step tnum">03 · {t('Capital', 'மூலதனம்')}</p>
          <h3 className="h4">StartNet Capital</h3>
          <p className="about-model__text">
            {t('Horizon 2. Run only through SEBI-compliant structures.', 'Horizon 2. SEBI விதிகளுக்கு இணங்கும் அமைப்புகள் மூலம் மட்டுமே நடத்தப்படும்.')}
          </p>
        </li>
      </ol>
      <figcaption id="about-model-cap" className="about-model__cap caption">
        {t(
          'The model runs funnel (events and learning) → platform (StartNet X) → capital (StartNet Capital, Horizon 2).',
          'மாதிரி இப்படி இயங்குகிறது: நுழைவாயில் (நிகழ்வுகள், கற்றல்) → தளம் (StartNet X) → மூலதனம் (StartNet Capital, Horizon 2).'
        )}
      </figcaption>
    </figure>
  );
}
