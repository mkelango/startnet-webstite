import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Reveal, RevealGroup } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import './FounderStory.css';

/*
 * "From first idea to first customer" (Book 2 §1.4): the identity's own story, a dot (one talent) → a grid (a
 * community) → a network (mentors, institutions, capital) → a full stop (a founder, an outcome).
 * Layout (5/7 at ≥1024): the section header and a StartNet X profile card sit sticky on the left; the four steps run
 * down a vertical rail on the right, each with its own pulli glyph (dot, grid, network, the red full stop). As a step
 * scrolls into the reading line, the profile card ticks it off: "one profile, so nobody has to start again".
 * Every step is in the markup at its final state (SSR, prerender, no JS); the profile card starts fully complete.
 */

// *Ta: DRAFT Tamil (Book 2 §14 status), native Tamil review pending. Programme names stay Latin.
const STEPS = [
  { n: 1, glyph: 'dot', title: 'Show up', titleTa: 'வந்து கலந்துகொள்ளுங்கள்',
    concept: 'A dot · one talent', conceptTa: 'ஒரு புள்ளி · ஒரு திறமை',
    body: 'Come to a Vibathon, a sector Connect, a campus build night or a Women Circle. Most first steps are free.',
    bodyTa: 'ஒரு Vibathon, துறைசார் Connect, கல்லூரி build night அல்லது Women Circle-க்கு வாருங்கள். பெரும்பாலான முதல் படிகள் இலவசம்.' },
  { n: 2, glyph: 'grid', title: 'Learn to build', titleTa: 'உருவாக்கக் கற்றுக்கொள்ளுங்கள்',
    concept: 'A grid · a community', conceptTa: 'ஒரு கட்டம் · ஒரு சமூகம்',
    body: 'Join a cohort: Vibe Academy, Founder Switch, Scholar Founders Fellowship or Rise Academy.',
    bodyTa: 'ஒரு குழுவில் சேருங்கள்: Vibe Academy, Founder Switch, Scholar Founders Fellowship அல்லது Rise Academy.' },
  { n: 3, glyph: 'network', title: 'Launch', titleTa: 'தொடங்குங்கள்',
    concept: 'A network · mentors, institutions, capital', conceptTa: 'ஒரு வலையமைப்பு · வழிகாட்டிகள், நிறுவனங்கள், மூலதனம்',
    body: 'Pre-incubation, co-founder matching and routes into partner incubators.',
    bodyTa: 'முன்-இன்குபேஷன், இணை நிறுவனர் பொருத்தம், கூட்டாளர் இன்குபேட்டர்களுக்கான வழிகள்.' },
  { n: 4, glyph: 'stop', title: 'Raise and sell', titleTa: 'நிதி திரட்டுங்கள், விற்பனை செய்யுங்கள்',
    concept: 'A full stop · a founder, an outcome', conceptTa: 'ஒரு முற்றுப்புள்ளி · ஒரு நிறுவனர், ஒரு விளைவு',
    body: 'Grant applications, angel introductions and pilots with GCCs, corporates and government.',
    bodyTa: 'மானிய விண்ணப்பங்கள், ஏஞ்சல் முதலீட்டாளர் அறிமுகங்கள், GCC-கள், பெருநிறுவனங்கள் மற்றும் அரசுடன் பைலட்கள்.' },
];

// The four pulli glyphs, drawn on a 48-unit grid in currentColor; only the full stop uses the red point.
const NETWORK = [[10, 14], [38, 10], [24, 26], [8, 38], [40, 38]];
function Glyph({ kind }) {
  return (
    <svg className="home-story__glyph-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {kind === 'dot' && <circle cx="24" cy="24" r="5" fill="currentColor" />}
      {kind === 'grid' && [12, 24, 36].flatMap((y) => [12, 24, 36].map((x) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="currentColor" />
      )))}
      {kind === 'network' && (
        <>
          {NETWORK.slice(0, 2).concat(NETWORK.slice(3)).map(([x, y]) => (
            <line key={`l${x}-${y}`} x1="24" y1="26" x2={x} y2={y} stroke="currentColor" strokeWidth="1.25" opacity=".45" />
          ))}
          <line x1="10" y1="14" x2="38" y2="10" stroke="currentColor" strokeWidth="1.25" opacity=".25" />
          <line x1="8" y1="38" x2="40" y2="38" stroke="currentColor" strokeWidth="1.25" opacity=".25" />
          {NETWORK.map(([x, y], i) => <circle key={`n${x}-${y}`} cx={x} cy={y} r={i === 2 ? 4.5 : 3} fill="currentColor" />)}
        </>
      )}
      {kind === 'stop' && <circle className="home-story__point" cx="24" cy="24" r="9" />}
    </svg>
  );
}

// Index of the step nearest the reading line (40% down the viewport); starts at the last step (final state).
function useCurrentStep(rootRef, count) {
  const [current, setCurrent] = useState(count - 1);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;
    const items = Array.from(root.querySelectorAll('.home-story__step'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setCurrent(items.indexOf(e.target));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef, count]);
  return current;
}

// The intro column is sticky only while it fits under the header: Tamil copy or a 1024×768 screen can make it taller
// than the viewport, and a sticky block that tall keeps its last lines (the StartNet X link) below the fold.
// The CSS sets `top` whether or not the block is sticky, so the measurement does not flip with the class.
function useIntroFits(introRef) {
  const [fits, setFits] = useState(true);
  useEffect(() => {
    const el = introRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = parseFloat(getComputedStyle(el).top) || 0;
        setFits(el.offsetHeight + top + 16 <= window.innerHeight);
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [introRef]);
  return fits;
}

export default function FounderStory() {
  const { t, localePath } = useLang();
  const root = useRef(null);
  const intro = useRef(null);
  const current = useCurrentStep(root, STEPS.length);
  const introFits = useIntroFits(intro);

  return (
    <section ref={root} className={`section section--paper home-story${introFits ? '' : ' home-story--unpinned'}`} id="how-it-works">
      <div className="container section__inner home-story__layout">
        <div ref={intro} className="home-story__intro">
          <SectionHeader
            eyebrow={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}
            title={t('From first idea to first customer', 'முதல் யோசனையிலிருந்து முதல் வாடிக்கையாளர் வரை')}
            lede={t(
              "Most people don't need everything at once. They need the right next step. We track each step on one profile, so nobody has to start again.",
              'பெரும்பாலானவர்களுக்கு எல்லாமே ஒரே நேரத்தில் தேவையில்லை; சரியான அடுத்த படிதான் தேவை. ஒவ்வொரு படியையும் ஒரே சுயவிவரத்தில் பதிவு செய்கிறோம், அதனால் யாரும் மீண்டும் முதலிலிருந்து தொடங்க வேண்டியதில்லை.'
            )}
          />

          <Reveal className="home-story__profile" delay={0.18}>
            <p className="home-story__profile-head">
              <span className="home-story__profile-badge" aria-hidden="true">X</span>
              {t('Your StartNet X profile', 'உங்கள் StartNet X சுயவிவரம்')}
            </p>
            <ol className="home-story__track" aria-hidden="true">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`home-story__track-row${i < current ? ' is-done' : ''}${i === current ? ' is-current' : ''}`}
                >
                  <span className="home-story__track-mark" />
                  <span className="home-story__track-num">{String(s.n).padStart(2, '0')}</span>
                  <span className="home-story__track-title">{t(s.title, s.titleTa)}</span>
                </li>
              ))}
            </ol>
            <p className="home-story__foot">
              {t('Every step is recorded on your StartNet X profile, which you control.', 'ஒவ்வொரு படியும் உங்கள் கட்டுப்பாட்டில் உள்ள StartNet X சுயவிவரத்தில் பதிவாகிறது.')}
            </p>
            <Link className="arrow-link home-story__link" to={localePath('/startnet-x')}>
              <span className="arrow-link__label">{t('How StartNet X works', 'StartNet X எப்படிச் செயல்படுகிறது')}</span> <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>

        <RevealGroup as="ol" className="home-story__steps" aria-label={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}>
          {STEPS.map((s, i) => (
            <li key={s.n} className={`home-story__step${i === current ? ' is-current' : ''}`}>
              <span className={`home-story__glyph home-story__glyph--${s.glyph}`} aria-hidden="true">
                <Glyph kind={s.glyph} />
              </span>
              <div className="home-story__content">
                <p className="home-story__meta">
                  <span className="home-story__num" aria-hidden="true">{String(s.n).padStart(2, '0')}</span>
                  <span className="home-story__concept">{t(s.concept, s.conceptTa)}</span>
                </p>
                <h3 className="home-story__title">
                  <span className="visually-hidden">{t(`Step ${s.n}: `, `படி ${s.n}: `)}</span>
                  {t(s.title, s.titleTa)}
                </h3>
                <p className="home-story__body">{t(s.body, s.bodyTa)}</p>
              </div>
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
