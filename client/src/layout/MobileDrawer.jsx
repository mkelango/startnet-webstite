// C04 · Mobile drawer (Book 1 Part B §3.4, DESIGN-v2 3.3): a full-screen Ink sheet, modal dialog with focus trap and
// inert background. 7 hairline accordion rows (+/− morph, grid-rows height), columns as grouped lists, featured
// card → one text link; footer with utility links, language, Sign in and a WhatsApp row; "Join StartNet" pinned
// in a sticky bottom bar (Red-600, 52px, safe-area). Esc or the Close button closes it.
// Enter: opacity 240ms, content y 8 → 0 staggered 40ms. Reduced: opacity only, 120ms.
import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { snxLink } from '../lib/links.js';
import { PRIMARY_NAV, UTILITY_LINKS, SIGN_IN, JOIN, sectionFor, isPublished, publishedLinks } from '../data/nav.js';
import { Logo, WhatsAppButton } from '../components';
import LanguageSwitch from './LanguageSwitch.jsx';
import { useNextFlagship } from './MegaMenu.jsx';
import { useOpenRoles } from './UtilityBar.jsx';
import { useModal, useShell, signInHref, waRef, desktopNavQuery } from './shell.jsx';
import './MobileDrawer.css';

// The featured card collapses to one text link; its text is the CTA label so text and destination match.
function featuredLink(f, lang, t) {
  if (!f?.cta) return null;
  // The flagship card's "Register" targets one event; in the drawer the link goes to the events list.
  const label = f.kind === 'flagship' ? t('All upcoming events', 'வரவிருக்கும் நிகழ்வுகள்') : t(f.cta.label ?? f.title, f.cta.labelTa);
  if (f.cta.snx) return { label, href: snxLink(f.cta.snx, { src: 'menu', lang }) };
  if (f.cta.href) return { label, href: f.cta.href };
  return f.cta.to ? { label, to: f.cta.to } : null;
}

/** Events accordion: the desktop card's next flagship event as one link (fetched once the accordion opens). */
function FlagshipLink({ f, open, onNavigate }) {
  const { t, localePath } = useLang();
  const { ev, path } = useNextFlagship(open);
  if (!ev || !path) return null;
  return (
    <Link to={localePath(path)} className="mobile-drawer__featured" onClick={onNavigate}>
      <span>{t(f.title, f.titleTa)}: {t(ev.title, ev.titleTa)}</span> <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

/** Accordion panel: hidden when closed; opening animates grid-template-rows 0fr → 1fr (DESIGN-v2 3.10). */
function useGridOpen(open, reduced) {
  const [state, setState] = useState(open ? 'open' : 'closed');
  const ref = useRef(state);
  ref.current = state;
  useEffect(() => {
    const cur = ref.current;
    if (open && (cur === 'closed' || cur === 'exiting')) setState(reduced ? 'open' : 'pre');
    if (!open && cur !== 'closed') setState(reduced ? 'closed' : 'exiting');
  }, [open, reduced]);
  useEffect(() => {
    if (state === 'pre') {
      let r2 = 0;
      const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setState('entering')); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    if (state === 'entering' || state === 'exiting') {
      const id = setTimeout(() => setState((s) => (s === 'entering' ? 'open' : s === 'exiting' ? 'closed' : s)), 420);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [state]);
  return { hidden: state === 'closed', expanded: state === 'entering' || state === 'open' };
}

function Section({ item, open, onToggle, onNavigate, reduced, index }) {
  const { t, lang, localePath } = useLang();
  const panelId = useId();
  const { hidden, expanded } = useGridOpen(open, reduced);
  const fl = featuredLink(item.featured, lang, t);
  const columns = item.columns.filter((col) => isPublished(col) && publishedLinks(col).length > 0);
  return (
    <li className="mobile-drawer__section" style={{ '--i': index }}>
      <h2 className="mobile-drawer__section-h">
        <button type="button" className="mobile-drawer__toggle" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span>{t(item.label, item.labelTa)}</span>
          <span className="mobile-drawer__pm" aria-hidden="true">
            <span className="mobile-drawer__pm-h" />
            <span className="mobile-drawer__pm-v" />
          </span>
        </button>
      </h2>
      <div id={panelId} className="mobile-drawer__panel" hidden={hidden} data-expanded={expanded ? '' : undefined}>
      <div className="mobile-drawer__panel-inner">
        <p className="mobile-drawer__intro">{t(item.intro, item.introTa)}</p>
        <Link to={localePath(item.to)} className="mobile-drawer__hub" onClick={onNavigate}>
          {t(item.label, item.labelTa)}{t(': overview', ': கண்ணோட்டம்')} <ArrowRight size={16} aria-hidden="true" />
        </Link>
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
        {item.featured?.kind === 'flagship' && <FlagshipLink f={item.featured} open={open} onNavigate={onNavigate} />}
        {fl && (
          fl.href ? (
            <a href={fl.href} className="mobile-drawer__featured">
              {fl.label} <ArrowUpRight size={16} aria-hidden="true" />
              <span className="visually-hidden">{t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)')}</span>
            </a>
          ) : (
            <Link to={localePath(fl.to)} className="mobile-drawer__featured" onClick={onNavigate}>
              {fl.label} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )
        )}
      </div>
      </div>
    </li>
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
  const [openId, setOpenId] = useState(() => sectionFor(basePath));

  useModal(ref, drawerOpen, { onClose: closeDrawer, initialFocus: closeRef, returnTo: returnFocus });

  // Close on navigation; open the current section's accordion next time.
  useEffect(() => { closeDrawer(); setOpenId(sectionFor(basePath)); /* eslint-disable-next-line */ }, [pathname]);
  // Leaving the mobile breakpoint closes the drawer.
  useEffect(() => {
    const mq = window.matchMedia(desktopNavQuery(lang));
    const onChange = () => mq.matches && closeDrawer();
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [closeDrawer, lang]);

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: reduced ? 0.12 : 0.24, ease: [0.2, 0, 0, 1] } },
    exit: { opacity: 0, transition: { duration: reduced ? 0.1 : 0.16 } },
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="mobile-drawer" key="drawer">
          <m.div
            className="mobile-drawer__backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduced ? 0.1 : 0.24 } }}
            exit={{ opacity: 0, transition: { duration: 0.16 } }}
            onClick={closeDrawer}
          />
          <m.div
            ref={ref}
            id="mobile-drawer"
            className="mobile-drawer__sheet"
            data-surface="night"
            role="dialog"
            aria-modal="true"
            aria-label={t('Menu', 'பட்டியல்')}
            data-reduced={reduced ? '' : undefined}
            {...fade}
          >
            <div className="mobile-drawer__top">
              <Link to={localePath('/')} aria-label={t('StartNet home', 'StartNet முகப்பு')} className="mobile-drawer__logo" onClick={closeDrawer}>
                <Logo />
              </Link>
              <button ref={closeRef} type="button" className="mobile-drawer__close" onClick={closeDrawer}>
                <span>{t('Close', 'மூடு')}</span>
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label={t('Main', 'முதன்மை')} className="mobile-drawer__nav">
              <ul className="mobile-drawer__sections">
                {PRIMARY_NAV.map((item, index) => (
                  <Section
                    key={item.id}
                    index={index}
                    reduced={reduced}
                    item={item}
                    open={openId === item.id}
                    onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
                    onNavigate={closeDrawer}
                  />
                ))}
              </ul>
            </nav>

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
              </ul>
              <div className="mobile-drawer__row">
                <LanguageSwitch />
                <a href={signInHref(lang, 'drawer')} className="mobile-drawer__signin" title={t(SIGN_IN.tooltip, SIGN_IN.tooltipTa)}>
                  {t(SIGN_IN.label, SIGN_IN.labelTa)} <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="visually-hidden">{t(' (opens StartNet X)', ' (StartNet X-இல் திறக்கும்)')}</span>
                </a>
              </div>
              <div className="mobile-drawer__wa">
                <p className="mobile-drawer__wa-text">{t('Questions? Write to us in Tamil or English.', 'கேள்விகளா? தமிழிலோ ஆங்கிலத்திலோ எழுதுங்கள்.')}</p>
                <WhatsAppButton text={t('Hi StartNet', 'வணக்கம் StartNet')} refCode={waRef(basePath, lang)} label={t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')} />
              </div>
            </div>
            <div className="mobile-drawer__joinbar">
              <Link to={localePath(JOIN.to)} className="mobile-drawer__join" onClick={closeDrawer}>
                {t(JOIN.label, JOIN.labelTa)}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
