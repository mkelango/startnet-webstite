import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Reveal, RevealGroup, ArtImage } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import './FounderStory.css';

/*
 * "From first idea to first customer" (Book 2 §1.4): the identity's own story, a dot (one talent) → a grid (a
 * community) → a network (mentors, institutions, capital) → a full stop (a founder, an outcome).
 * AIWO-BLUEPRINT P7 + P8: the section header, then a full-bleed image band (the slot's own visual; ArtImage), then the
 * four steps as columns under a 1px Ink rule with a node on the rule per step (4-up ≥1024, 2-up ≥640, stacked below).
 * Same steps, labels, titles and text, in the same order; every step is in the markup at its final state (SSR,
 * prerender, no JS). The skip link (to `nextId`) only renders while the section is taller than the screen.
 */

// *Ta: DRAFT Tamil (Book 2 §14 status), native Tamil review pending. Programme names stay Latin.
const STEPS = [
  { n: 1, title: 'Show up', titleTa: 'வந்து கலந்துகொள்ளுங்கள்',
    concept: 'A dot · one talent', conceptTa: 'ஒரு புள்ளி · ஒரு திறமை',
    body: 'Come to a Vibathon, a sector Connect, a campus build night or a Women Circle. Most first steps are free.',
    bodyTa: 'ஒரு Vibathon, துறைசார் Connect, கல்லூரி build night அல்லது Women Circle-க்கு வாருங்கள். பெரும்பாலான முதல் படிகள் இலவசம்.' },
  { n: 2, title: 'Learn to build', titleTa: 'உருவாக்கக் கற்றுக்கொள்ளுங்கள்',
    concept: 'A grid · a community', conceptTa: 'ஒரு கட்டம் · ஒரு சமூகம்',
    body: 'Join a cohort: Vibe Academy, Founder Switch, Scholar Founders Fellowship or Rise Academy.',
    bodyTa: 'ஒரு குழுவில் சேருங்கள்: Vibe Academy, Founder Switch, Scholar Founders Fellowship அல்லது Rise Academy.' },
  { n: 3, title: 'Launch', titleTa: 'தொடங்குங்கள்',
    concept: 'A network · mentors, institutions, capital', conceptTa: 'ஒரு வலையமைப்பு · வழிகாட்டிகள், நிறுவனங்கள், மூலதனம்',
    body: 'Pre-incubation, co-founder matching and routes into partner incubators.',
    bodyTa: 'முன்-இன்குபேஷன், இணை நிறுவனர் பொருத்தம், கூட்டாளர் இன்குபேட்டர்களுக்கான வழிகள்.' },
  { n: 4, title: 'Raise and sell', titleTa: 'நிதி திரட்டுங்கள், விற்பனை செய்யுங்கள்',
    concept: 'A full stop · a founder, an outcome', conceptTa: 'ஒரு முற்றுப்புள்ளி · ஒரு நிறுவனர், ஒரு விளைவு',
    body: 'Grant applications, angel introductions and pilots with GCCs, corporates and government.',
    bodyTa: 'மானிய விண்ணப்பங்கள், ஏஞ்சல் முதலீட்டாளர் அறிமுகங்கள், GCC-கள், பெருநிறுவனங்கள் மற்றும் அரசுடன் பைலட்கள்.' },
];

function useTallerThanScreen(ref) {
  const [tall, setTall] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      setTall(el.offsetHeight > window.innerHeight);
    };
    measure();
    const onResize = () => { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [ref]);
  return tall;
}

export default function FounderStory({ nextId }) {
  const root = useRef(null);
  const { t, localePath } = useLang();
  const tall = useTallerThanScreen(root);

  return (
    <section ref={root} className="section section--paper home-story" id="how-it-works">
      {nextId && tall && <a className="home-story__skip" href={`#${nextId}`}>{t('Skip the animation', 'அனிமேஷனைத் தவிர்க்கவும்')}</a>}
      <div className="container section__inner">
        <SectionHeader
          eyebrow={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}
          title={t('From first idea to first customer', 'முதல் யோசனையிலிருந்து முதல் வாடிக்கையாளர் வரை')}
          lede={t(
            "Most people don't need everything at once. They need the right next step. We track each step on one profile, so nobody has to start again.",
            'பெரும்பாலானவர்களுக்கு எல்லாமே ஒரே நேரத்தில் தேவையில்லை; சரியான அடுத்த படிதான் தேவை. ஒவ்வொரு படியையும் ஒரே சுயவிவரத்தில் பதிவு செய்கிறோம், அதனால் யாரும் மீண்டும் முதலிலிருந்து தொடங்க வேண்டியதில்லை.'
          )}
        />
      </div>
      <Reveal variant="clip" className="home-story__band">
        <ArtImage variant="network" ratio="21/9" seed={21} alt="" sizes="100vw" />
      </Reveal>
      <div className="container">
        <RevealGroup as="ol" className="home-story__steps" aria-label={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}>
          {STEPS.map((s) => (
            <li key={s.n} className="home-story__step">
              <span className="home-story__node" aria-hidden="true" />
              <span className="home-story__num" aria-hidden="true">{String(s.n).padStart(2, '0')}</span>
              <p className="home-story__concept">{t(s.concept, s.conceptTa)}</p>
              <h3 className="home-story__title">
                <span className="visually-hidden">{t(`Step ${s.n}: `, `படி ${s.n}: `)}</span>
                {t(s.title, s.titleTa)}
              </h3>
              <p className="home-story__body">{t(s.body, s.bodyTa)}</p>
            </li>
          ))}
        </RevealGroup>
        <Reveal as="p" className="home-story__foot">
          {t('Every step is recorded on your StartNet X profile, which you control.', 'ஒவ்வொரு படியும் உங்கள் கட்டுப்பாட்டில் உள்ள StartNet X சுயவிவரத்தில் பதிவாகிறது.')}{' '}
          <Link className="arrow-link home-story__link" to={localePath('/startnet-x')}>
            <span className="arrow-link__label">{t('How StartNet X works', 'StartNet X எப்படிச் செயல்படுகிறது')}</span> <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
