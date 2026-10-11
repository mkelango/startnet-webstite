// StartNet X modules (T19 standard page: compact hero → sections with in-page nav → CTA). Copy: Book 2 §7.1, §7.3, §2.6.
import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Seo, BrandHero, Section, Button, Reveal, CTABand } from '../../components';
import { snxPageLd } from './snxSeo.js';
import { useSnxT } from './snxTamil.js';
import { snxLink } from '../../lib/links.js';
import { MODULES, PLANS, AI_GUARDRAILS, AI_GUARDRAILS_INTRO } from './snxContent.js';
import { SNX_ICONS } from './snxIcons.js';
import { SnxStatus } from './SnxParts.jsx';
import './Modules.css';

// Which plan rows (Book 2 §7.3 pricing table) belong to which module.
const MODULE_FEATURES = {
  id: [['SNX ID and profile', 0]],
  events: [['Event registration', 0], ['Priority event seats', 1]],
  learn: [['Starter Academy courses', 0], ['Full Academy library and certificates', 1]],
  circles: [['Community and Circles directory', 0]],
  launch: [],
  capital: [['Grant Navigator', 1], ['Team workspace and data room', 2], ['Investor CRM', 2], ['Deal room and investor-day priority', 3]],
  access: [['GCC challenge applications', 2], ['Pilot pipeline analytics', 3], ['Export desk access', 3]],
  insights: [],
  agents: [['Founder Coach (lite)', 0], ['Co-founder and mentor Matchmaker', 1], ['Grant Navigator', 1]],
};

const MODULE_LINKS = {
  id: { label: 'How we handle your data', to: '/startnet-x/trust' },
  events: { label: 'See upcoming events', to: '/events' },
  learn: { label: 'Find your programme', to: '/programmes' },
  launch: { label: 'Find your programme', to: '/programmes' },
  insights: { label: 'Read the Founder Ledger', to: '/insights/founder-ledger' },
  agents: { label: 'Read the guardrails', to: '#guardrails' },
};

export default function Modules() {
  const { t, tx, lang } = useSnxT();
  const active = useActiveSection(MODULES.map((m) => m.id));

  return (
    <>
      <Seo
        jsonLd={snxPageLd({ path: '/startnet-x/modules', lang })}
        // SEO-TA: pending native review
        title={t('StartNet X modules: events, learning, capital, agents', 'StartNet X தொகுதிகள்: நிகழ்வுகள், கற்றல், மூலதனம்')}
        description={t(
          'SNX ID, Events, Learn, Circles, Launch, Capital, Access, Insights & Ledger and Agents: the modules behind every StartNet programme.',
          'SNX ID, Events, Learn, Circles, Launch, Capital, Access, Insights & Ledger, Agents: ஒவ்வொரு StartNet திட்டத்தின் பின்னாலும் இருக்கும் தொகுதிகள்.'
        )}
      />
      <BrandHero
        brand="x"
        compact
        title={t('What you can do.', 'நீங்கள் என்ன செய்யலாம்.')}
        lede={tx("StartNet X is the platform behind every StartNet programme. You get one profile that remembers what you've done, suggests what's next and stays in your control.")}
        actions={
          <>
            <Button href={snxLink('/signup', { src: 'snx-modules', brand: 'x', lang })}>{t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}</Button>
            <Button variant="tertiary" to="/partner/enquire?topic=snx">{tx('Request a demo')}</Button>
          </>
        }
      />

      <Section surface="paper">
        <div className="snx-mods">
          <nav className="snx-mods__nav" aria-label={t('Modules on this page', 'இந்தப் பக்கத்தில் உள்ள தொகுதிகள்')}>
            <p className="snx-mods__nav-title">{t('Modules', 'தொகுதிகள்')}</p>
            <ol>
              {MODULES.map((m, i) => (
                <li key={m.id}>
                  <a href={`#${m.id}`} aria-current={active === m.id ? 'location' : undefined}>
                    <span className="snx-mods__nav-num">{String(i + 1).padStart(2, '0')}</span>
                    {m.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="snx-mods__list">
            {MODULES.map((m, i) => {
              const Icon = SNX_ICONS[m.icon];
              const feats = MODULE_FEATURES[m.id] || [];
              const link = MODULE_LINKS[m.id];
              return (
                <section key={m.id} id={m.id} className="snx-mod" aria-labelledby={`mod-${m.id}`}>
                  <Reveal className="snx-mod__inner">
                  <div className="snx-mod__head">
                    <span className="snx-mod__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="snx-mod__icon" aria-hidden="true">{Icon && <Icon size={26} strokeWidth={1.5} />}</span>
                    <h2 id={`mod-${m.id}`} className="h3 snx-mod__name">{m.name}</h2>
                    <SnxStatus status={m.status} phase={m.phase} />
                  </div>
                  <div className="snx-mod__body">
                    <p className="snx-mod__line">{tx(m.line)}</p>
                    {feats.length > 0 && (
                      <div className="snx-mod__plans">
                        <p className="snx-mod__plans-title">{t('In your plan', 'உங்கள் கட்டணத் திட்டத்தில்')}</p>
                        <ul>
                          {feats.map(([label, from]) => (
                            <li key={label}>
                              <Check size={16} aria-hidden="true" />
                              <span>{tx(label)}</span>
                              <span className="snx-mod__plan">
                                {from < 3 ? t(`${PLANS[from].name} and up`, `${PLANS[from].name} மற்றும் அதற்கு மேல்`) : PLANS[from].name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {m.id === 'agents' && (
                      <div className="snx-mod__guard" id="guardrails">
                        <p className="snx-mod__guard-intro">{tx(AI_GUARDRAILS_INTRO)}</p>
                        <ul>
                          {AI_GUARDRAILS.map((g) => <li key={g}>{tx(g)}</li>)}
                        </ul>
                      </div>
                    )}
                    {link && link.to.startsWith('/') && (
                      <Button variant="tertiary" to={link.to} icon={ArrowRight}>{tx(link.label)}</Button>
                    )}
                  </div>
                  </Reveal>
                </section>
              );
            })}
          </div>
        </div>
      </Section>

      <CTABand
        surface="night"
        title={tx('Run your innovation programme on StartNet X.')}
        body={tx('Annual licences for institutions, GCCs and government.')}
        actions={
          <>
            <Button variant="primary" to="/partner/enquire?topic=snx">{tx('Request a demo')}</Button>
            <Button variant="inverse" to="/startnet-x/pricing">{tx('See pricing')}</Button>
          </>
        }
      />
    </>
  );
}

/** Highlights the in-page nav entry for the section nearest the top of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}
