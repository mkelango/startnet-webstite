// /signin and /signup — stable vanity routes that hand off to StartNet X (Book 1 Part B §2.2:
// "/signin → x.startnet.in/login · /signup → x.startnet.in/signup", redirect, P1; §9.4 sign-up handoff).
// The page redirects at once with window.location.replace (no history entry), and renders a visible
// fallback link and message for slow connections or when the redirect is blocked.
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo, Breadcrumbs, BrandLockup, Button } from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink } from '../../../lib/links.js';
import './SnxHandoff.css';

const BRAND_KEYS = ['research', 'vibe', 'connect', 'women', 'x'];
const TOKEN = /^[a-z0-9][a-z0-9_-]{0,47}$/i;
const UTM = /^utm_(source|medium|campaign|term|content)$/;

const COPY = {
  signin: {
    seo: ['Sign in', 'உள்நுழைக'],
    crumb: ['Sign in', 'உள்நுழைக'],
    body: ['Sign in to StartNet X, your founder profile.', 'உங்கள் நிறுவனர் சுயவிவரமான StartNet X-இல் உள்நுழையுங்கள்.'],
    button: ['Continue to sign in', 'உள்நுழையத் தொடருங்கள்'],
    switchQ: ['New to StartNet?', 'StartNet-க்குப் புதியவரா?'],
    switchLink: ['Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்'],
    switchTo: '/signup',
    snxPath: '/login',
    seoDescription: [
      'Sign in to StartNet X, your founder profile for every StartNet event, course, circle and programme. Free for individuals.',
      'StartNet X-இல் உள்நுழையுங்கள்: ஒவ்வொரு StartNet நிகழ்வு, படிப்பு, Circle, திட்டத்துக்குமான உங்கள் நிறுவனர் சுயவிவரம். தனிநபர்களுக்கு இலவசம்.',
    ],
  },
  signup: {
    seo: ['Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்'],
    crumb: ['Join StartNet', 'StartNet-இல் இணையுங்கள்'],
    body: ['Free for individuals. One profile for every StartNet programme.', 'தனிநபர்களுக்கு இலவசம். ஒவ்வொரு StartNet திட்டத்துக்கும் ஒரே சுயவிவரம்.'],
    button: ['Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்'],
    switchQ: ['Already have a profile?', 'ஏற்கெனவே சுயவிவரம் உள்ளதா?'],
    switchLink: ['Sign in', 'உள்நுழைக'],
    switchTo: '/signin',
    snxPath: '/signup',
    seoDescription: [
      'Create your free StartNet X profile: one founder profile for every StartNet programme, event and course. Free for individuals, in Tamil and English.',
      'உங்கள் இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள்: ஒவ்வொரு StartNet திட்டம், நிகழ்வு, படிப்புக்கும் ஒரே சுயவிவரம். தனிநபர்களுக்கு இலவசம்.',
    ],
  },
};

/** Only same-origin or *.startnet.in http(s) URLs may be passed on as the return link (no open redirects). */
function safeReturn(raw) {
  if (!raw || typeof window === 'undefined') return null;
  try {
    const u = new URL(raw, window.location.origin);
    if (!/^https?:$/.test(u.protocol)) return null;
    const ok = u.origin === window.location.origin || /(^|\.)startnet\.in$/i.test(u.hostname);
    if (!ok) return null;
    // Never return to the hand-off pages themselves.
    if (u.origin === window.location.origin && /^(\/ta)?\/(signin|signup)\/?$/.test(u.pathname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Builds the StartNet X URL: src/lang always; return (where to come back to); persona, intent and brand
 * from the query (Book 1 §9.4: x.startnet.in/signup?persona&intent&brand&lang&src); utm_* passed through.
 */
function useHandoffHref(mode, lang, localePath, search) {
  return useMemo(() => {
    const q = new URLSearchParams(search || '');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://startnet.in';
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    const back = safeReturn(q.get('return')) || safeReturn(referrer) || `${origin}${localePath('/')}`;

    const params = { return: back };
    const src = q.get('src');
    const brand = q.get('brand');
    if (brand && BRAND_KEYS.includes(brand)) params.brand = brand;
    ['persona', 'intent'].forEach((k) => {
      const v = q.get(k);
      if (v && TOKEN.test(v)) params[k] = v;
    });
    q.forEach((v, k) => {
      if (UTM.test(k) && v && v.length <= 100) params[k] = v;
    });
    return snxLink(COPY[mode].snxPath, { src: src && TOKEN.test(src) ? src : 'web', lang, ...params });
  }, [mode, lang, localePath, search]);
}

/** Shared body of the /signin and /signup pages. */
export default function SnxHandoff({ mode = 'signin' }) {
  const c = COPY[mode] || COPY.signin;
  const { t, lang, localePath } = useLang();
  const { search } = useLocation();
  const href = useHandoffHref(mode, lang, localePath, search);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    try {
      window.location.replace(href);
    } catch {
      /* the fallback link below stays available */
    }
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [href]);

  return (
    <>
      {/* noindex: hand-off pages to x.startnet.in are never indexed (Book 1 Part B §7.4 "App routes are noindex");
          Seo's robots prop adds nofollow. */}
      <Seo robots="noindex, nofollow" title={t(...c.seo)} description={t(...c.seoDescription)} />
      {/* Ink band with the crumbs, then a paper sheet sliding over it: a calm two-column page
          (what is happening on the left, the one action and the fallbacks in a flat card on the right). */}
      <section className="snx-handoff" aria-labelledby="snx-handoff-title" data-brand="x">
        <div className="snx-handoff__band" data-surface="night">
          <div className="container snx-handoff__crumbs">
            <Breadcrumbs items={[{ label: t(...c.crumb) }]} />
          </div>
        </div>
        <div className="snx-handoff__sheet">
          <div className="container snx-handoff__inner">
            <div className="snx-handoff__intro">
              <div className="snx-handoff__brand">
                <BrandLockup brand="x" size="md" />
                <span className="snx-handoff__pulse" aria-hidden="true" />
              </div>
              <h1 id="snx-handoff-title" className="h2 snx-handoff__title">
                {t('Taking you to StartNet X…', 'StartNet X-க்கு அழைத்துச் செல்கிறோம்…')}
              </h1>
              <p className="body-lg snx-handoff__body">{t(...c.body)}</p>
            </div>

            <div className="snx-handoff__card">
              <div className="snx-handoff__action" data-primary-cta="">
                {/* The one red accent is kept for the conversion ("Create your free profile"); sign-in stays ink. */}
                <Button href={href} size="lg" full icon={ArrowRight} variant={mode === 'signup' ? 'brand' : 'primary'}>
                  {t(...c.button)}
                </Button>
              </div>

              <p className={`snx-handoff__hint${slow ? ' is-slow' : ''}`} role="status" aria-live="polite">
                {slow
                  ? t(
                      'Still here? Your browser may have blocked the redirect. Use the button above to continue to StartNet X.',
                      'இன்னும் இங்கேயே இருக்கிறீர்களா? உங்கள் உலாவி திசைதிருப்பலைத் தடுத்திருக்கலாம். StartNet X-க்குச் செல்ல மேலே உள்ள பொத்தானைப் பயன்படுத்துங்கள்.'
                    )
                  : t(
                      'If nothing happens in a few seconds, use the button above.',
                      'சில நொடிகளில் எதுவும் நடக்கவில்லை என்றால், மேலே உள்ள பொத்தானைப் பயன்படுத்துங்கள்.'
                    )}
              </p>

              <ul className="snx-handoff__links" role="list">
                <li>
                  <span>{t(...c.switchQ)}</span>{' '}
                  <Link to={localePath(c.switchTo)}>{t(...c.switchLink)}</Link>
                </li>
                <li>
                  <span>{t('Not sure where to start?', 'எங்கே தொடங்குவது என்று தெரியவில்லையா?')}</span>{' '}
                  <Link to={localePath('/join')}>{t('Join StartNet', 'StartNet-இல் இணையுங்கள்')}</Link>
                </li>
                <li>
                  <Link to={localePath('/')}>{t('Back to startnet.in', 'startnet.in-க்குத் திரும்புங்கள்')}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
