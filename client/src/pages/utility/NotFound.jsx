import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m as motion } from 'framer-motion'; // light m inside the shell's LazyMotion
import { ArrowRight, Search as SearchIcon, MessageCircle, Compass, CalendarDays, Rocket, BookOpenText } from 'lucide-react';
import { Seo, Button } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { snxLink, waLink } from '../../lib/links.js';
import './NotFound.css';

// Book 2 §12 copy; Book 1 Part B §6.2 T21 (message in EN and TA, search, four links, WhatsApp).
// Tamil lines are drafts pending native Tamil review (Book 2 §14 status note).
const COPY = {
  h1: ["This page hasn't been founded yet.", 'இந்தப் பக்கம் இன்னும் நிறுவப்படவில்லை.'],
  sub: [
    "The link may be old, or we may have moved things in our relaunch. Here's where most people were heading.",
    'இணைப்பு பழையதாக இருக்கலாம், அல்லது எங்கள் மறுதொடக்கத்தில் பக்கங்களை இடம் மாற்றியிருக்கலாம். பெரும்பாலானோர் செல்ல விரும்பிய இடங்கள் இதோ.',
  ],
};

const LINKS = [
  { to: '/programmes', en: 'Find a programme', ta: 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்', icon: Compass },
  { to: '/events', en: 'Upcoming events', ta: 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்', icon: CalendarDays },
  { to: '/vibe/vibathon', en: 'Vibathon 2027', ta: 'Vibathon 2027', icon: Rocket },
  { to: '/insights/founder-ledger', en: 'Founder Ledger', ta: 'Founder Ledger-ஐப் படியுங்கள்', icon: BookOpenText },
];

const LEGACY = /startnetvibe|startnet-?research|snx\.one/i;

/** 404 content. Default export, no props: other pages render it for unknown slugs. */
export default function NotFound() {
  const { lang, t, localePath } = useLang();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [q, setQ] = useState('');
  const [legacy, setLegacy] = useState(false);
  const other = lang === 'ta' ? 0 : 1;
  const here = lang === 'ta' ? 1 : 0;

  // noindex (Book 2 §12 meta) + legacy-domain helper.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    try { setLegacy(LEGACY.test(document.referrer || '')); } catch { /* ignore */ }
    return () => { meta.remove(); };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    navigate(localePath(query ? `/search?q=${encodeURIComponent(query)}` : '/search'));
  };

  return (
    <>
      {/* noindex: the 404 page (also served with HTTP 404) must never be indexed. */}
      <Seo
        noindex
        title={t('Page not found', 'பக்கம் கிடைக்கவில்லை')}
        description={t(COPY.sub[0], COPY.sub[1])}
      />
      {/* Ink band (title, both languages) → sheet (search, where people were heading), like every hero → sheet. */}
      <section className="notfound" aria-labelledby="notfound-title">
        <div className="notfound__band" data-surface="night">
          <div className="container notfound__head">
            <div className="notfound__mark" aria-hidden="true">
              <motion.span
                className="notfound__dot"
                initial={reduced ? false : { y: -120, opacity: 0, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
              />
              <span className="notfound__code tnum">404</span>
            </div>
            <h1 id="notfound-title" className="display-xl notfound__title">
              {COPY.h1[here].replace(/\.$/, '')}
              <span className="dot">.</span>
            </h1>
            <p className="body-lg notfound__sub">{COPY.sub[here]}</p>
            <div className="notfound__other" lang={other === 1 ? 'ta' : 'en'}>
              <p className="notfound__other-title">{COPY.h1[other]}</p>
              <p className="notfound__other-sub">{COPY.sub[other]}</p>
            </div>
          </div>
        </div>

        <div className="notfound__sheet">
          <div className="container notfound__inner">
            <div className="notfound__copy">
              {legacy && (
                <div className="notfound__legacy" role="note">
                  <p>{t(
                    'Looking for StartNetVibe, StartNet Research or SNX.One? They now live here:',
                    'StartNetVibe, StartNet Research அல்லது SNX.One-ஐத் தேடுகிறீர்களா? அவை இப்போது இங்கே உள்ளன:'
                  )}</p>
                  <div className="cluster">
                    <Button to="/vibe" variant="secondary" size="sm">StartNet Vibe</Button>
                    <Button to="/research" variant="secondary" size="sm">StartNet Research</Button>
                    <Button to="/startnet-x" variant="secondary" size="sm">StartNet X</Button>
                  </div>
                </div>
              )}

              <form className="notfound__search" role="search" onSubmit={onSubmit}>
                <label htmlFor="notfound-q" className="notfound__label">{t('Search startnet.in', 'startnet.in-இல் தேடுங்கள்')}</label>
                <div className="notfound__field">
                  <SearchIcon aria-hidden="true" size={20} className="notfound__field-icon" />
                  <input
                    id="notfound-q"
                    type="search"
                    name="q"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    autoComplete="off"
                    enterKeyHint="search"
                    placeholder={t('Programmes, events…', 'திட்டங்கள், நிகழ்வுகள்…')}
                  />
                  {/* Below 480px the submit collapses to a 44x44 icon button so the input keeps the width. */}
                  <Button type="submit" className="notfound__submit" aria-label={t('Search', 'தேடு')}>
                    <span className="notfound__submit-text">{t('Search', 'தேடு')}</span>
                    <SearchIcon aria-hidden="true" size={20} className="notfound__submit-icon" />
                  </Button>
                </div>
              </form>
            </div>

            <nav className="notfound__links" aria-label={t('Where most people were heading', 'பெரும்பாலானோர் செல்லும் இடங்கள்')}>
              <ul role="list">
                {LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <li key={l.to}>
                      <Link to={localePath(l.to)} className="notfound__link">
                        <Icon aria-hidden="true" size={22} strokeWidth={1.75} />
                        <span>{t(l.en, l.ta)}</span>
                        <ArrowRight aria-hidden="true" size={18} className="notfound__arrow" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="notfound__more">
                <a href={snxLink('/login', { src: '404', lang })}>{t('StartNet X sign-in', 'StartNet X உள்நுழைக')}</a>
                <Link to={localePath('/contact')}>{t('Contact', 'தொடர்புக்கு')}</Link>
                <a
                  className="notfound__wa"
                  href={waLink('Hi StartNet, I followed a link that did not work', `404, ${lang}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" size={18} /> {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                  <span className="visually-hidden">{t(' (opens in a new tab)', ' (புதிய தாவலில் திறக்கும்)')}</span>
                </a>
              </p>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
