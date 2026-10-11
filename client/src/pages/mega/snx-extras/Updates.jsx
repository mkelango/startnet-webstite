// StartNet X · Updates (T15 listing, P2). URL: /startnet-x/updates (brand 'x'). Release notes / changelog.
// Entries use only facts in the books: Book 1 Part B §2.1 (v2 tenant public pages), §8.3 editorial calendar
// (Dec 2026: first Connect on SNX v0), §12 phase scopes (P1 SNX v0 deep links for sign-up and event registration;
// P2 SNX Launch calls v1 and Circles module v1; P3 SNX v2 Access, Capital, agents and v3 APIs), §13.1 (Phase 1:
// SNX signed-in state), Part A Join flow (sign-up methods); Book 2 §7 status rule (v0 spine, v1 programmes,
// v2 marketplace and agents, v3 platform). Nothing has shipped yet, so the "Released" view is an empty state.
// Status chips follow the Book 2 §7 rule (Live / In beta / Coming): roadmap entries show "Coming", never "Planned" or "Live".
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarClock } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, SectionHeader, Button, Badge, EmptyState, NewsletterForm,
  RevealGroup, Dot,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxPageLd } from '../../snx/snxSeo.js';
import { snxLink } from '../../../lib/links.js';
import { XStatus } from './SnxxParts.jsx';
import './Updates.css';

const VIEWS = ['all', 'released', 'planned'];

export default function Updates() {
  const { t, lang } = useLang(); // Button `to` is localised by the kit (localePath).
  // The view lives in the URL (?view=planned) so it can be shared, bookmarked and survives reload; 'all' is the bare URL.
  const [params, setParams] = useSearchParams();
  const rawView = String(params.get('view') || '').trim().toLowerCase();
  const view = VIEWS.includes(rawView) ? rawView : 'all';
  const setView = (id) => {
    const next = new URLSearchParams(params);
    if (id && id !== 'all') next.set('view', id); else next.delete('view');
    setParams(next, { replace: true, preventScrollReset: true });
  };
  // Drop unknown values (?view=bogus, ?view=all) so the URL and the pressed chip agree.
  useEffect(() => {
    if (!params.has('view') || params.get('view') === (view === 'all' ? null : view)) return;
    const next = new URLSearchParams(params);
    if (view !== 'all') next.set('view', view); else next.delete('view');
    setParams(next, { replace: true, preventScrollReset: true });
  }, [params, view, setParams]);

  const entries = [
    {
      id: 'snx-v0',
      release: 'SNX v0',
      theme: t('The spine', 'அடித்தளம்'),
      when: t('December 2026 (indicative)', 'டிசம்பர் 2026 (தோராயமாக)'),
      status: 'coming',
      modules: ['SNX ID', 'Events'],
      items: [
        t(
          'Sign up on x.startnet.in with a phone or WhatsApp OTP, an email magic link or Google. Your profile starts at L1.',
          'x.startnet.in-இல் கைபேசி அல்லது WhatsApp OTP, மின்னஞ்சல் magic link அல்லது Google மூலம் பதிவு செய்யலாம். உங்கள் சுயவிவரம் L1-இல் தொடங்கும்.'
        ),
        t('Sign-up and event registration links from startnet.in go straight into StartNet X.', 'startnet.in-இலிருந்து பதிவு, நிகழ்வுப் பதிவு இணைப்புகள் நேரடியாக StartNet X-க்குச் செல்லும்.'),
        t('The first Connect event runs on SNX v0.', 'முதல் Connect நிகழ்வு SNX v0-இல் நடைபெறும்.'),
      ],
    },
    {
      id: 'signed-in',
      release: 'SNX v0',
      theme: t('Signed-in state on startnet.in', 'startnet.in-இல் உள்நுழைந்த நிலை'),
      when: t('Q1 2027 (indicative)', 'Q1 2027 (தோராயமாக)'),
      status: 'coming',
      modules: ['SNX ID'],
      items: [t('startnet.in recognises when you are signed in to StartNet X.', 'நீங்கள் StartNet X-இல் உள்நுழைந்திருப்பதை startnet.in அறிந்துகொள்ளும்.')],
    },
    {
      id: 'snx-v1',
      release: 'SNX v1',
      theme: t('Programmes', 'திட்டங்கள்'),
      when: t('H1 2027 (indicative)', 'H1 2027 (தோராயமாக)'),
      status: 'coming',
      modules: ['Launch', 'Circles'],
      items: [
        t('Launch calls power the Apply buttons on programme pages.', 'திட்டப் பக்கங்களில் உள்ள விண்ணப்பப் பொத்தான்கள் Launch அழைப்புகள் மூலம் செயல்படும்.'),
        t('The Circles module takes seat applications.', 'Circles தொகுதி இருக்கை விண்ணப்பங்களை ஏற்கும்.'),
      ],
    },
    {
      id: 'snx-v2',
      release: 'SNX v2',
      theme: t('Marketplace and agents', 'சந்தையும் முகவர்களும்'),
      when: t('H2 2027–2028 (indicative)', 'H2 2027–2028 (தோராயமாக)'),
      status: 'coming',
      modules: ['Access', 'Capital', 'Agents'],
      items: [
        t('Access: apply to GCC and government problem statements.', 'Access: GCC, அரசுப் பிரச்சினை அறிக்கைகளுக்கு விண்ணப்பிக்கலாம்.'),
        t('Capital: data room, investor CRM and grant tracker.', 'Capital: தரவு அறை, முதலீட்டாளர் CRM, மானியக் கண்காணிப்பு.'),
        t('AI agents that suggest; people decide.', 'பரிந்துரைக்கும் AI முகவர்கள்; முடிவை மனிதர்கள் எடுக்கிறார்கள்.'),
        t('Tenant public pages that a tenant opts to index.', 'ஒரு tenant தேர்வு செய்தால், தேடுபொறிகளில் தெரியும் பொதுப் பக்கங்கள்.'),
      ],
      link: { label: t('AI agents and guardrails', 'AI முகவர்களும் பாதுகாப்பு வரம்புகளும்'), to: '/startnet-x/agents' },
    },
    {
      id: 'snx-v3',
      release: 'SNX v3',
      theme: t('Platform', 'தளம்'),
      when: t('H2 2027–2028 (indicative)', 'H2 2027–2028 (தோராயமாக)'),
      status: 'coming',
      modules: ['Insights & Ledger'],
      items: [t('Read-only Ledger and partner APIs on api.startnet.in.', 'api.startnet.in-இல் படிக்க மட்டுமான Ledger, கூட்டாளர் API-கள்.')],
      link: { label: t('Developers', 'டெவலப்பர்கள்'), to: '/startnet-x/developers' },
    },
  ];

  const released = []; // Nothing has shipped yet; entries move here only when a release is actually live.
  const filters = [
    { id: 'all', label: t('All', 'அனைத்தும்'), count: released.length + entries.length },
    { id: 'released', label: t('Released', 'வெளியானவை'), count: released.length },
    { id: 'planned', label: t('Coming', 'வரவிருப்பவை'), count: entries.length },
  ];
  const showReleased = view === 'all' || view === 'released';
  const showPlanned = view === 'all' || view === 'planned';

  return (
    <div className="snx-updates">
      <Seo
        jsonLd={snxPageLd({ path: '/startnet-x/updates', lang })}
        title={t('StartNet X updates and release notes', 'StartNet X புதுப்பிப்புகளும் வெளியீட்டுக் குறிப்புகளும்')}
        description={t(
          'Release notes for StartNet X: what changed, which module it touches, and whether it is live, in beta or still coming.',
          'StartNet X வெளியீட்டுக் குறிப்புகள்: என்ன மாறியது, எந்தத் தொகுதி, அது நேரலையிலா, சோதனையிலா, இன்னும் வரவிருக்கிறதா.'
        )}
      />
      {/* Crumbs sit on the ink band, part of the header + hero (AngelList family). */}
      <div className="snx-updates__crumbs-band" data-surface="night">
        <div className="container snx-updates__crumbs">
          <Breadcrumbs items={[{ label: 'StartNet X', to: '/startnet-x' }, { label: t('Updates', 'புதுப்பிப்புகள்') }]} />
        </div>
      </div>

      <BrandHero
        brand="x"
        compact
        title={t('What is new on StartNet X.', 'StartNet X-இல் புதியவை.')}
        lede={t(
          'Release notes for the platform behind every StartNet programme. Each entry says what changed, which module it touches, and whether it is live, in beta or still coming.',
          'ஒவ்வொரு StartNet திட்டத்தின் பின்னணியில் உள்ள தளத்தின் வெளியீட்டுக் குறிப்புகள். ஒவ்வொரு பதிவும் என்ன மாறியது, எந்தத் தொகுதி, அது நேரலையிலா, சோதனையிலா, இன்னும் வரவிருக்கிறதா என்று சொல்லும்.'
        )}
        actions={
          <>
            <Button href="#subscribe">{t('Get updates by email', 'மின்னஞ்சலில் புதுப்பிப்புகளைப் பெறுங்கள்')}</Button>
            <Button variant="tertiary" to="/startnet-x/modules">{t('See all modules', 'அனைத்து தொகுதிகளையும் பாருங்கள்')}</Button>
          </>
        }
      />

      <Section surface="paper">
        <div className="snx-updates__bar">
          <p className="snx-updates__rule">
            {t(
              'We never show a coming feature as live. Dates are indicative until a release ships.',
              '"வரும்" அம்சத்தை ஒருபோதும் "நேரலையில்" என்று காட்டுவதில்லை. வெளியீடு வரும் வரை தேதிகள் தோராயமானவை.'
            )}
          </p>
          <div className="snx-updates__filters" role="group" aria-label={t('Filter updates', 'புதுப்பிப்புகளை வடிகட்டு')}>
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className="snx-updates__filter"
                aria-pressed={view === f.id}
                onClick={() => setView(f.id)}
              >
                {f.label}
                <span className="snx-updates__filter-count">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {showReleased && (
          <section className="snx-updates__group" aria-labelledby="snx-updates-released">
            <h2 id="snx-updates-released" className="h3 snx-updates__group-title">{t('Released', 'வெளியானவை')}</h2>
            {released.length === 0 && (
              <EmptyState
                headingLevel={3}
                title={t('No releases yet.', 'இன்னும் வெளியீடுகள் இல்லை.')}
                body={t(
                  'Release notes start when SNX v0 ships. Subscribe below and we will tell you when it does.',
                  'SNX v0 வெளியாகும்போது வெளியீட்டுக் குறிப்புகள் தொடங்கும். கீழே பதிவு செய்தால், அப்போது உங்களுக்குத் தெரிவிப்போம்.'
                )}
                action={<Button variant="secondary" href="#subscribe">{t('Get updates by email', 'மின்னஞ்சலில் புதுப்பிப்புகளைப் பெறுங்கள்')}</Button>}
              />
            )}
          </section>
        )}

        {showPlanned && (
          <section className="snx-updates__group" aria-labelledby="snx-updates-planned">
            <h2 id="snx-updates-planned" className="h3 snx-updates__group-title">
              {t('On the roadmap', 'திட்டப் பாதையில்')}
              <Dot />
            </h2>
            <RevealGroup as="ol" className="snx-updates__list">
              {entries.map((e) => (
                <li key={e.id} className="snx-updates__entry" id={e.id}>
                  <div className="snx-updates__when">
                    <CalendarClock size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span>{e.when}</span>
                  </div>
                  <article className="snx-updates__card">
                    <header className="snx-updates__head">
                      <Badge kind="type">{e.release}</Badge>
                      <XStatus status={e.status} short />
                    </header>
                    <h3 className="h4 snx-updates__title">{e.theme}</h3>
                    <ul className="snx-updates__items">
                      {e.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                    <footer className="snx-updates__foot">
                      <ul className="snx-updates__mods" aria-label={t('Modules', 'தொகுதிகள்')}>
                        {e.modules.map((m) => (
                          <li key={m} lang="en">{m}</li>
                        ))}
                      </ul>
                      {e.link && (
                        <Button variant="tertiary" size="sm" to={e.link.to} icon={ArrowRight}>
                          {e.link.label}
                        </Button>
                      )}
                    </footer>
                  </article>
                </li>
              ))}
            </RevealGroup>
            {/* "Exact release dates: [placeholder]" is hidden until the dates are supplied. */}
          </section>
        )}
      </Section>

      <Section surface="white" id="subscribe" className="snx-updates__anchor">
        <div className="snx-updates__sub">
          <div className="snx-updates__sub-text">
            <SectionHeader
              eyebrow={t('Stay in the loop', 'தொடர்ந்து அறிந்திருங்கள்')}
              title={
                <>
                  {t('Release notes in your inbox', 'வெளியீட்டுக் குறிப்புகள் உங்கள் மின்னஞ்சலில்')}
                  <Dot />
                </>
              }
              lede={t(
                'Programme calls, event dates and Founder Ledger updates, with StartNet X news. Unsubscribe at any time.',
                'திட்ட அழைப்புகள், நிகழ்வுத் தேதிகள், Founder Ledger புதுப்பிப்புகள், StartNet X செய்திகளுடன். எப்போது வேண்டுமானாலும் விலகலாம்.'
              )}
            />
            <Button variant="tertiary" href={snxLink('/signup', { src: 'snx-updates', brand: 'x', lang })} icon={ArrowRight}>
              {t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}
            </Button>
          </div>
          <div className="snx-updates__form">
            <NewsletterForm compact />
          </div>
        </div>
      </Section>
    </div>
  );
}
