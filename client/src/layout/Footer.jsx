// C09 · Footer (docs/redesign/SPEC.md §3.5): two blocks. 1 · the newsletter band on Slate (night, raised), which keeps
// the footer apart from an Ink CTABand directly above it. 2 · the footer body on Bone: the large Ink wordmark (its red
// stop is the body's one red point), tagline and "Contact us" beside the link columns; socials as 48px rounded squares
// and the partner names; the ThinkTN line (locked); the legal row with Cookie settings and the Reduce motion switch.
// Every link, label, column and their order are unchanged. Link groups are plain headed lists at every width.
// Pages that carry their own newsletter sign-up (FOOTER_NEWSLETTER_SKIP, or `newsletter={false}`) do not repeat it.
// Tamil strings are drafts pending native review (Book 2 §14).
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Linkedin, MessageCircle, Twitter, Youtube } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useApi } from '../hooks/useApi.js';
import { waLink } from '../lib/links.js';
import { FOOTER_COLUMNS, LEGAL_LINKS, SOCIAL_CHANNELS, THINKTN_LINE, THINKTN_LINE_TA, isPublished, publishedLinks } from '../data/nav.js';
import { Dot, Logo, NewsletterForm } from '../components';
import MotionSwitch from './MotionSwitch.jsx';
import { useShell } from './shell.jsx';
import './Footer.css';

const SOCIAL_ICONS = { linkedin: Linkedin, instagram: Instagram, youtube: Youtube, x: Twitter };
// Profile URLs live in data/nav.js SOCIAL_CHANNELS; a channel without a confirmed URL (Instagram, for now) is not shown.
// Legal entity (Ministry of Corporate Affairs record, RoC Coimbatore, incorporated 4 July 2023).
const LEGAL_ENTITY = 'StartNet Ventures Private Limited';
const LEGAL_CIN = 'U70200TZ2023PTC028823';
// SEO-TA: pending native review
const REGISTERED_OFFICE = [
  '112/2F4, Fairlands, 3rd Cross Street, Fairlands, Salem, Tamil Nadu 636016',
  '112/2F4, ஃபேர்லேண்ட்ஸ், 3-ஆவது குறுக்குத் தெரு, ஃபேர்லேண்ட்ஸ், சேலம், தமிழ்நாடு 636016',
];

/** Language-stripped paths whose page already has a newsletter sign-up of its own, or (Contact, SPEC §5.8) ends on its
 *  own form. The shell renders one Footer for every route, so this list is how a route opts out of the band. */
const FOOTER_NEWSLETTER_SKIP = ['/insights', '/insights/reports', '/contact'];

/** The copyright year, fixed into the HTML when the page is prerendered at build time. */
const YEAR = new Date().getFullYear();

const sinceText = (since, lang) => {
  if (!since) return '';
  const d = new Date(since);
  return Number.isNaN(d.getTime())
    ? String(since)
    : d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { month: 'short', year: 'numeric', numberingSystem: 'latn' });
};

function FooterColumn({ col }) {
  const { t, localePath } = useLang();
  // Every group is open at every width (PnP: no accordions); the head is a plain dot-label heading.
  return (
    <div className="site-footer__col">
      <h2 className="site-footer__col-h">{t(col.heading, col.headingTa)}</h2>
      <ul className="site-footer__list">
        {publishedLinks(col).map((l) => (
          <li key={l.to}>
            <Link to={localePath(l.to)} className="site-footer__link" data-brand={l.brand}>
              {l.brand && <span className="site-footer__brand-dot" aria-hidden="true" />}
              {t(l.label, l.labelTa)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DWELL_MS = 1200;

/** True once `ref` comes within `margin` of the viewport (stays true). Without IntersectionObserver: true at once. */
function useNearViewport(ref, margin = '600px') {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setNear(true); return undefined; }
    // While a lazy page is still loading, <main> is empty and the footer sits in view for a moment: only count
    // it as near once it has stayed near for DWELL_MS, so first loads never request the partner list.
    let timer = 0;
    const io = new IntersectionObserver((entries) => {
      const hit = entries.some((e) => e.isIntersecting);
      clearTimeout(timer);
      if (hit) timer = window.setTimeout(() => { setNear(true); io.disconnect(); }, DWELL_MS);
    }, { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, [ref, margin, near]);
  return near;
}

function PartnerRow({ enabled }) {
  const { t, lang, localePath } = useLang();
  // Fetched only when the footer nears the viewport, so first loads do not request /api/partners.
  const { data } = useApi(enabled ? '/api/partners' : null);
  const partners = Array.isArray(data)
    ? data.filter((p) => p.agreementStatus === 'signed' && p.logoPermission === true && p.showInFooter !== false)
    : [];
  if (partners.length === 0) return null; // omitted, never padded
  return (
    <div className="site-footer__partners">
      <h2 className="site-footer__row-h">{t('Our partners', 'எங்கள் கூட்டாளர்கள்')}</h2>
      <ul className="site-footer__partner-list">
        {partners.map((p) => {
          const since = sinceText(p.since, lang);
          return (
            <li key={p.slug}>
              <Link
                to={localePath('/partner/our-partners')}
                className="site-footer__partner"
                aria-label={t(`${p.name}, partner since ${since}`, `${p.name}, ${since} முதல் கூட்டாளர்`)}
                title={t(`${p.name}, since ${since}`, `${p.name}, ${since} முதல்`)}
              >
                <span aria-hidden="true">{p.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer({ newsletter = true }) {
  const { t, lang, localePath, basePath } = useLang();
  const { openConsent } = useShell();
  const footerRef = useRef(null);
  const near = useNearViewport(footerRef);
  const showNewsletter = newsletter && !FOOTER_NEWSLETTER_SKIP.includes(basePath);

  return (
    <footer ref={footerRef} className="site-footer" data-no-newsletter={showNewsletter ? undefined : ''}>
      {/* Block 1 · Newsletter band (Slate) */}
      {showNewsletter && (
        <div className="site-footer__nl" data-surface="night" data-tone="raised">
          <div className="container site-footer__nl-inner">
            <div className="site-footer__nl-text">
              <p className="eyebrow site-footer__nl-eyebrow">{t('The StartNet newsletter', 'StartNet செய்திமடல்')}</p>
              <h2 className="site-footer__nl-title">
                {t('One email. What opened, what happened, what’s next.', 'ஒரே மின்னஞ்சல். எது திறந்தது, என்ன நடந்தது, அடுத்து என்ன.')}
              </h2>
              <p className="site-footer__nl-body">
                {lang === 'ta' ? (
                  <>
                    திட்ட அழைப்புகள், நிகழ்வுத் தேதிகள், சமீபத்திய Founder Ledger எண்ணிக்கைகள். ஸ்பேம் இல்லை, ஒரே கிளிக்கில் விலகலாம்.
                  </>
                ) : (
                  <>
                    Programme calls, event dates and the latest Founder Ledger figures. No spam, unsubscribe in one click.
                  </>
                )}
              </p>
            </div>
            <div className="site-footer__newsletter">
              <NewsletterForm compact night />
              <p className="site-footer__dpdp">
                {lang === 'ta' ? (
                  <>
                    உங்கள் மின்னஞ்சலை இந்தச் செய்திமடலுக்கு மட்டுமே பயன்படுத்துவோம். எங்கள்{' '}
                    <Link to={localePath('/legal/privacy')}>தனியுரிமை அறிவிப்பு</Link> (DPDP சட்டம் 2023) மற்றும்{' '}
                    <Link to={localePath('/legal/data-rights')}>உங்கள் தரவு உரிமைகள்</Link> பக்கங்களைப் பாருங்கள்.
                  </>
                ) : (
                  <>
                    We’ll only use your email for this newsletter. See our{' '}
                    <Link to={localePath('/legal/privacy')}>privacy notice</Link> (DPDP Act 2023) and{' '}
                    <Link to={localePath('/legal/data-rights')}>your data rights</Link>.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Block 2 · Footer body (Bone) */}
      <div className="site-footer__body" data-ground="bone">
        <div className="container">
          {/* Row 1 · Brand + link columns */}
          <div className="site-footer__top">
            <div className="site-footer__brand">
              <Link to={localePath('/')} aria-label={t('StartNet home', 'StartNet முகப்பு')} className="site-footer__logo">
                <Logo size="xl" className="site-footer__wordmark-logo" />
              </Link>
              <p className="site-footer__tagline" lang={t('en', 'ta')}>
                {t('Every talent, a founder', 'ஒவ்வொரு திறமையும், ஒரு நிறுவனர்')}<Dot />
              </p>
              <p className="site-footer__positioning">
                {/* SEO-TA: pending native review */}
                {t('Tamil Nadu’s founder-making network. Headquartered in Salem, working across Tamil Nadu.', 'தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு. சேலத்தைத் தலைமையிடமாகக் கொண்டு, தமிழ்நாடு முழுவதும் செயல்படுகிறது.')}
              </p>
              <Link to={localePath('/contact')} className="site-footer__contact">
                <span>{t('Contact us', 'எங்களைத் தொடர்புகொள்ளுங்கள்')}</span>
                <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" className="site-footer__contact-arrow" />
              </Link>
            </div>
            <nav className="site-footer__cols" aria-label={t('Footer', 'அடிக்குறிப்பு இணைப்புகள்')}>
              {FOOTER_COLUMNS.filter((col) => publishedLinks(col).length > 0).map((col) => <FooterColumn key={col.id} col={col} />)}
            </nav>
          </div>

          {/* Row 2 · Social & channels, then partner names (conditional) */}
          <div className="site-footer__row site-footer__connect">
            <div className="site-footer__social">
              <h2 className="site-footer__row-h">{t('Follow StartNet', 'StartNet-ஐப் பின்தொடருங்கள்')}</h2>
              <ul className="site-footer__social-list">
                {SOCIAL_CHANNELS.filter((s) => s.url).map((s) => {
                  const Icon = SOCIAL_ICONS[s.id];
                  return (
                    <li key={s.id}>
                      <a className="site-footer__social-item site-footer__social-item--link" href={s.url} target="_blank" rel="noopener noreferrer me" title={s.label}>
                        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                        <span className="visually-hidden">{s.label}{t(' (opens in a new tab)', ' (புதிய தாவலில் திறக்கும்)')}</span>
                      </a>
                    </li>
                  );
                })}
                <li>
                  <a
                    className="site-footer__social-item site-footer__social-item--link"
                    href={waLink(t('Hi StartNet, please add me to the WhatsApp channel', 'வணக்கம் StartNet, என்னை WhatsApp சேனலில் சேர்க்கவும்'), 'footer')}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t('WhatsApp channel', 'WhatsApp சேனல்')}
                  >
                    <MessageCircle size={20} strokeWidth={1.75} aria-hidden="true" />
                    <span className="visually-hidden">{t('WhatsApp channel', 'WhatsApp சேனல்')}{t(' (opens WhatsApp)', ' (WhatsApp-இல் திறக்கும்)')}</span>
                  </a>
                </li>
              </ul>
              {/* SEO-TA: pending native review */}
              <p className="site-footer__handles">
                {t('@startnetindia on LinkedIn, X and YouTube.', 'LinkedIn, X, YouTube-இல் @startnetindia.')}
              </p>
            </div>
            <PartnerRow enabled={near} />
          </div>

          {/* Row 3 · ThinkTN line (text only, never beside a logo), a hairline, then the legal row */}
          <div className="site-footer__row site-footer__thinktn">
            <p>
              {t(THINKTN_LINE, THINKTN_LINE_TA)}{' '}
              <Link to={localePath('/about/thinktn-alliance')} className="site-footer__thinktn-link">
                {t('About the partnership', 'இந்தக் கூட்டணி பற்றி')} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </p>
          </div>

          <div className="site-footer__legal">
            <p className="site-footer__copy">
              © {YEAR} {LEGAL_ENTITY} · CIN <span className="tnum">{LEGAL_CIN}</span> · {t('Registered office', 'பதிவு அலுவலகம்')}:{' '}
              {t(...REGISTERED_OFFICE)}
            </p>
            <ul className="site-footer__legal-list" aria-label={t('Legal', 'சட்டத் தகவல்')}>
              {LEGAL_LINKS.filter(isPublished).map((l) => (
                <li key={l.label}>
                  {l.action === 'cookies' ? (
                    <button type="button" className="site-footer__legal-link site-footer__legal-btn" onClick={openConsent}>
                      {t(l.label, l.labelTa)}
                    </button>
                  ) : (
                    <Link to={localePath(l.to)} className="site-footer__legal-link">{t(l.label, l.labelTa)}</Link>
                  )}
                </li>
              ))}
            </ul>
            <MotionSwitch className="site-footer__motion" />
          </div>
        </div>
      </div>
    </footer>
  );
}
