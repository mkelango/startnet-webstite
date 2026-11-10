import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeader, RevealGroup } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import './FounderStory.css';

/*
 * "From first idea to first customer" (Book 2 §1.4): the identity's own story, a dot (one talent) → a grid (a
 * community) → a network (mentors, institutions, capital) → a full stop (a founder, an outcome).
 * Layout (≥1024): the section header in cols 1–4 (with the StartNet X link), the four steps as a 2×2 grid of cards in
 * cols 6–12, each led by its pulli glyph (dot, grid, network, the red full stop). Below 1024 the steps stack (2-up
 * from 640). Trimmed in Nov 2026: the sticky profile tracker (it repeated the four step titles) is gone.
 */

// *Ta: DRAFT Tamil (Book 2 §14 status), native Tamil review pending. Programme names stay Latin.
const STEPS = [
  { n: 1, glyph: 'dot', title: 'Show up', titleTa: 'வந்து கலந்துகொள்ளுங்கள்',
    body: 'Come to a Vibathon, a sector Connect, a campus build night or a Women Circle.',
    bodyTa: 'ஒரு Vibathon, துறைசார் Connect, கல்லூரி build night அல்லது Women Circle-க்கு வாருங்கள்.' },
  { n: 2, glyph: 'grid', title: 'Learn to build', titleTa: 'உருவாக்கக் கற்றுக்கொள்ளுங்கள்',
    body: 'Join a cohort: Vibe Academy, Founder Switch, Scholar Founders Fellowship or Rise Academy.',
    bodyTa: 'ஒரு குழுவில் சேருங்கள்: Vibe Academy, Founder Switch, Scholar Founders Fellowship அல்லது Rise Academy.' },
  { n: 3, glyph: 'network', title: 'Launch', titleTa: 'தொடங்குங்கள்',
    body: 'Pre-incubation, co-founder matching and routes into partner incubators.',
    bodyTa: 'முன்-இன்குபேஷன், இணை நிறுவனர் பொருத்தம், கூட்டாளர் இன்குபேட்டர்களுக்கான வழிகள்.' },
  { n: 4, glyph: 'stop', title: 'Raise and sell', titleTa: 'நிதி திரட்டுங்கள், விற்பனை செய்யுங்கள்',
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

export default function FounderStory() {
  const { t, localePath } = useLang();

  return (
    <section className="section section--sunken section--pad-default home-story" id="how-it-works">
      <div className="container section__inner home-story__layout">
        <div className="home-story__intro">
          <SectionHeader
            eyebrow={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}
            title={t('From first idea to first customer', 'முதல் யோசனையிலிருந்து முதல் வாடிக்கையாளர் வரை')}
            lede={t(
              'You need the right next step, not everything at once. One StartNet X profile records every step.',
              'உங்களுக்கு எல்லாமே ஒரே நேரத்தில் தேவையில்லை; சரியான அடுத்த படிதான் தேவை. ஒவ்வொரு படியும் ஒரே StartNet X சுயவிவரத்தில் பதிவாகிறது.'
            )}
          />
          <Link className="arrow-link home-story__link" to={localePath('/startnet-x')}>
            <span className="arrow-link__label">{t('How StartNet X works', 'StartNet X எப்படிச் செயல்படுகிறது')}</span> <span className="arrow" aria-hidden="true"><ArrowRight size={16} strokeWidth={1.75} /></span>
          </Link>
        </div>

        <RevealGroup as="ol" className="home-story__steps" aria-label={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}>
          {STEPS.map((s) => (
            <li key={s.n} className="home-story__step">
              <span className={`home-story__glyph home-story__glyph--${s.glyph}`} aria-hidden="true">
                <Glyph kind={s.glyph} />
              </span>
              <div className="home-story__content">
                <h3 className="home-story__title">
                  <span className="home-story__num" aria-hidden="true">{String(s.n).padStart(2, '0')}</span>
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
