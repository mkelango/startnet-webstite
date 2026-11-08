// C04 · Mobile drawer (docs/redesign/SPEC.md §3.3, Plug and Play): a full-screen Ink dialog (focus trapped, page
// inert) that slides in from the right. Drill-down, not accordion: level 1 lists the 7 primary items (24px/500,
// 56px rows, chevron), then the utility links and the language switch; tapping an item slides its level 2 in (a back
// row, the lead links at 20px/500, then the column heads with their links). A sticky bottom bar holds the red
// "Join StartNet" (Button point lg) and a WhatsApp secondary. Esc or Close closes it; focus returns to the menu button.
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { snxLink } from '../lib/links.js';
import { PRIMARY_NAV, UTILITY_LINKS, SIGN_IN, JOIN, isPublished, publishedLinks } from '../data/nav.js';
import { Button, Logo, WhatsAppButton } from '../components';
import LanguageSwitch from './LanguageSwitch.jsx';
import { useNextFlagship } from './MegaMenu.jsx';
import { useOpenRoles } from './UtilityBar.jsx';
import { useModal, useShell, signInHref, waRef, desktopNavQuery } from './shell.jsx';
import './MobileDrawer.css';

// The featured card collapses to one link; its text is the CTA label so text and destination match.
function featuredLink(f, lang, t) {
  if (!f?.cta) return null;
  // The flagship card's "Register" targets one event; in the drawer the link goes to the events list.
  const label = f.kind === 'flagship' ? t('All upcoming events', 'வரவிருக்கும் நிகழ்வுகள்') : t(f.cta.label ?? f.title, f.cta.labelTa);
  if (f.cta.snx) return { label, href: snxLink(f.cta.snx, { src: 'menu', lang }) };
  if (f.cta.href) return { label, href: f.cta.href };
  return f.cta.to ? { label, to: f.cta.to } : null;
}

/** Events level 2: the desktop card's next flagship event as one lead link. */
function FlagshipLink({ f, onNavigate }) {
  const { t, localePath } = useLang();
  const { ev, path } = useNextFlagship(true);
  if (!ev || !path) return null;
  return (
    <li>
      <Link to={localePath(path)} className="mobile-drawer__lead" onClick={onNavigate}>
        <span>{t(f.title, f.titleTa)}: {t(ev.title, ev.titleTa)}</span> <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </li>
  );
}

/** Level 2: one primary item's links. */
function Level2({ item, onBack, onNavigate, backRef }) {
  const { t, lang, localePath } = useLang();
  const fl = featuredLink(item.featured, lang, t);
  const columns = item.columns.filter((col) => isPublished(col) && publishedLinks(col).length > 0);
  return (
    <div className="mobile-drawer__level2">
      <button ref={backRef} type="button" className="mobile-drawer__back" onClick={onBack}>
        <ChevronLeft size={20} strokeWidth={1.75} aria-hidden="true" />
        <span>{t(item.label, item.labelTa)}</span>
      </button>
      <h2 className="visually-hidden">{t(item.label, item.labelTa)}</h2>
      <p className="mobile-drawer__intro">{t(item.intro, item.introTa)}</p>
      <ul className="mobile-drawer__leads">
        <li>
          <Link to={localePath(item.to)} className="mobile-drawer__lead" onClick={onNavigate}>
            <span>{t(item.label, item.labelTa)}{t(': overview', ': கண்ணோட்டம்')}</span> <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </li>
        {item.featured?.kind === 'flagship' && <FlagshipLink f={item.featured} onNavigate={onNavigate} />}
        {fl && (
          <li>
            {fl.href ? (
              <a href={fl.href} className="mobile-drawer__lead">
                <span>{fl.label}</span> <ArrowUpRight size={20} strokeWidth={1.75} aria-hidden="true" />
                <span className="visually-hidden">{t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)')}</span>
              </a>
            ) : (
              <Link to={localePath(fl.to)} className="mobile-drawer__lead" onClick={onNavigate}>
                <span>{fl.label}</span> <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            )}
          </li>
        )}
      </ul>
      {columns.map((col) => (
        <div key={col.heading} className="mobile-drawer__group" data-brand={col.brand}>
          <h3 className="mobile-drawer__group-h">
            {t(col.heading, col.headingTa)}
            {col.journey && <span className="mobile-drawer__journey">{t(col.journey, col.journeyTa)}</span>}
            {col.meta && <span className="mobile-drawer__meta">{col.meta}</span>}
          </h3>
          <ul className="mobile-drawer__list">
            {publishedLinks(col).map((l) => (
              <li key={l.to + l.label}>
                <Link to={localePath(l.to)} className="mobile-drawer__link" onClick={onNavigate}>{t(l.label, l.labelTa)}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function MobileDrawer() {
  const { drawerOpen, closeDrawer, returnFocus } = useShell();
  const { t, lang, localePath, basePath } = useLang();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const roles = useOpenRoles();
  const ref = useRef(null);
  const closeRef = useRef(null);
  const backRef = useRef(null);
  const rowRefs = useRef({});
  const bodyRef = useRef(null);
  // Drill-down: null = level 1, else the id of the open item. `dir` picks the slide (in from the right / back).
  const [view, setView] = useState({ id: null, dir: 'none' });

  useModal(ref, drawerOpen, { onClose: closeDrawer, initialFocus: closeRef, returnTo: returnFocus });

  // Close on navigation; the next open starts at level 1.
  useEffect(() => { closeDrawer(); /* eslint-disable-next-line */ }, [pathname]);
  useEffect(() => { if (!drawerOpen) setView({ id: null, dir: 'none' }); }, [drawerOpen]);
  // Leaving the mobile breakpoint closes the drawer.
  useEffect(() => {
    const mq = window.matchMedia(desktopNavQuery(lang));
    const onChange = () => mq.matches && closeDrawer();
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [closeDrawer, lang]);

  // Focus follows the drill: into level 2 → its back row; back → the row that opened it.
  const lastId = useRef(null);
  useEffect(() => {
    if (view.dir === 'none') return;
    bodyRef.current?.scrollTo?.({ top: 0 });
    if (view.id) {
      lastId.current = view.id;
      backRef.current?.focus({ preventScroll: true });
    } else if (lastId.current) {
      rowRefs.current[lastId.current]?.focus({ preventScroll: true });
    }
  }, [view]);

  const open = (id) => setView({ id, dir: 'in' });
  const back = () => setView({ id: null, dir: 'back' });
  const item = PRIMARY_NAV.find((n) => n.id === view.id);

  const sheet = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.12 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0, transition: { duration: 0.32, ease: [0.2, 0, 0, 1] } },
        exit: { x: '100%', transition: { duration: 0.24, ease: [0.4, 0, 1, 1] } },
      };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="mobile-drawer" key="drawer">
          <m.div
            ref={ref}
            id="mobile-drawer"
            className="mobile-drawer__sheet"
            data-surface="night"
            role="dialog"
            aria-modal="true"
            aria-label={t('Menu', 'பட்டியல்')}
            data-reduced={reduced ? '' : undefined}
            {...sheet}
          >
            <div className="mobile-drawer__top">
              <Link to={localePath('/')} aria-label={t('StartNet home', 'StartNet முகப்பு')} className="mobile-drawer__logo" onClick={closeDrawer}>
                <Logo />
              </Link>
              <button ref={closeRef} type="button" className="mobile-drawer__close" onClick={closeDrawer}>
                <span className="visually-hidden">{t('Close', 'மூடு')}</span>
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <div className="mobile-drawer__body" ref={bodyRef}>
              <nav aria-label={t('Main', 'முதன்மை')} className="mobile-drawer__nav">
                <div key={view.id || 'root'} className="mobile-drawer__view" data-dir={view.dir}>
                  {item ? (
                    <Level2 item={item} onBack={back} onNavigate={closeDrawer} backRef={backRef} />
                  ) : (
                    <>
                      <ul className="mobile-drawer__sections">
                        {PRIMARY_NAV.map((n) => (
                          <li key={n.id} className="mobile-drawer__section">
                            <button
                              type="button"
                              ref={(el) => { rowRefs.current[n.id] = el; }}
                              className="mobile-drawer__toggle"
                              onClick={() => open(n.id)}
                            >
                              <span>{t(n.label, n.labelTa)}</span>
                              <ChevronRight size={20} strokeWidth={1.75} aria-hidden="true" className="mobile-drawer__chev" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="mobile-drawer__footer">
                        <ul className="mobile-drawer__utility" aria-label={t('Utility', 'பயன்பாட்டு இணைப்புகள்')}>
                          {UTILITY_LINKS.map((l) => (
                            <li key={l.id}>
                              <Link to={localePath(l.to)} onClick={closeDrawer} className="mobile-drawer__utility-link">
                                {t(l.label, l.labelTa)}
                                {l.id === 'careers' && roles > 0 && <span className="mobile-drawer__count">{roles}<span className="visually-hidden">{t(' open roles', ' திறந்த பணியிடங்கள்')}</span></span>}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <a href={signInHref(lang, 'drawer')} className="mobile-drawer__utility-link mobile-drawer__signin" title={t(SIGN_IN.tooltip, SIGN_IN.tooltipTa)}>
                              {t(SIGN_IN.label, SIGN_IN.labelTa)} <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                              <span className="visually-hidden">{t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)')}</span>
                            </a>
                          </li>
                        </ul>
                        <div className="mobile-drawer__row">
                          <LanguageSwitch />
                        </div>
                        <p className="mobile-drawer__wa-text">{t('Questions? Write to us in Tamil or English.', 'கேள்விகளா? தமிழிலோ ஆங்கிலத்திலோ எழுதுங்கள்.')}</p>
                      </div>
                    </>
                  )}
                </div>
              </nav>
            </div>

            <div className="mobile-drawer__joinbar">
              <Button to={JOIN.to} variant="point" size="lg" full className="mobile-drawer__join" onClick={closeDrawer}>
                {t(JOIN.label, JOIN.labelTa)}
              </Button>
              <WhatsAppButton
                text={t('Hi StartNet', 'வணக்கம் StartNet')}
                refCode={waRef(basePath, lang)}
                label={t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                iconOnly
                size="lg"
                className="mobile-drawer__wa"
              />
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
