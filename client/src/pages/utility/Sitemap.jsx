import { Link } from 'react-router-dom';
import { Seo, PageHero, Section } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { BRANDS } from '../../data/brands.js';
import { PARTNER_TYPES, ALL_TYPES } from '../partner/partnerData.js';
import { SECTORS } from '../brands/connect/connectData.js';
import { LEGAL, LEGAL_ORDER } from './legalContent.js';
import { useApi } from '../../hooks/useApi.js';
import { DISTRICTS } from '../mega/about-districts/districtsData.js';
import { legalTitle } from './legalContent.ta.js';
import './Sitemap.css';

// HTML sitemap of every route in App.jsx (Book 1 Part B §2.2, T17). Tamil mirrors live under /ta/.
// Links: { label, labelTa?, to }. Brand and programme names stay in Latin script on /ta.
const brandLinks = (key) =>
  (BRANDS[key]?.subNav || [])
    .filter((l) => !l.to.includes('?'))
    .map((l) => ({ label: l.label, labelTa: l.labelTa, to: l.to }));

/** Vibe Summit lives at /vibe/summit; keep it listed even if the brand sub-nav does not carry it. */
const withPage = (links, page) => (links.some((l) => l.to === page.to) ? links : [...links, page]);

const SECTOR_LINKS = SECTORS.map((s) => ({ label: s.name, to: `/connect/${s.slug}` }));

const X_LABELS_TA = { '/startnet-x': 'StartNet X என்றால் என்ன' };

/** Brand filtered views (Book 1 Part B §2.2, T15) that a brand sub-nav may not carry. */
const STORIES = (b) => ({ label: 'Stories', labelTa: 'கதைகள்', to: `/${b}/stories` });
const EVENTS = (b) => ({ label: 'Events', labelTa: 'நிகழ்வுகள்', to: `/${b}/events` });
const withPages = (links, pages) => pages.reduce(withPage, links);

const LAB_LINKS = [
  { label: 'Agentic AI Lab', to: '/research/labs/agentic-ai' },
  { label: 'Ontology & Knowledge Lab', to: '/research/labs/ontology-knowledge' },
  { label: 'Physical AI Lab', to: '/research/labs/physical-ai' },
  { label: 'Drug Discovery Lab', to: '/research/labs/drug-discovery' },
];

/** Event series pages (/events/<series>); StartNet Founders Day has its own page and is listed above. */
const SERIES_LINKS = [
  ['vibathon', 'Vibathon'], ['vibe-campus', 'Vibe Campus'], ['vibe-summit', 'Vibe Summit'],
  ['genai-connect', 'GenAI Connect'], ['saas-connect', 'SaaS Connect'], ['d2c-connect', 'D2C Connect'],
  ['lab-to-market-summit', 'Lab-to-Market Summit'], ['women-founders-summit', 'Women Founders Summit & Awards'],
  ['research-days', 'Research Days'], ['investors-summit', 'Investors Summit'],
].map(([slug, label]) => ({ label, to: `/events/${slug}` }));

const INDEX_LINKS = [
  { label: 'Campus Innovation Index', to: '/insights/indices/campus-innovation-index' },
  { label: 'TN Research Commercialisation Index', to: '/insights/indices/research-commercialisation-index' },
  { label: 'Founder Readiness Index', to: '/insights/indices/founder-readiness-index' },
];

const SNX_AUDIENCE_LINKS = [
  { label: 'For founders', labelTa: 'நிறுவனர்களுக்கு', to: '/startnet-x/founders' },
  { label: 'For institutions', labelTa: 'கல்வி நிறுவனங்களுக்கு', to: '/startnet-x/institutions' },
  { label: 'For incubators', labelTa: 'இன்குபேட்டர்களுக்கு', to: '/startnet-x/incubators' },
  { label: 'For GCCs', labelTa: 'GCC-களுக்கு', to: '/startnet-x/gccs' },
  { label: 'For government', labelTa: 'அரசுக்கு', to: '/startnet-x/government' },
  { label: 'For investors', labelTa: 'முதலீட்டாளர்களுக்கு', to: '/startnet-x/investors' },
];

const DISTRICT_LINKS = DISTRICTS.map((d) => ({ label: d.en, labelTa: d.ta, to: `/districts/${d.slug}` }));

/** Edition key inside /events/<series>/<edition> (same rule as pages/mega/events-series/seriesData.js). */
const editionKey = (e) => (e.slug.startsWith(`${e.series}-`) ? e.slug.slice(e.series.length + 1) : e.slug);
/** "2026-Q4" → "2026-q4" (Ledger edition slugs, Book 1 Part B §7.1 rule 4). */
const periodSlug = (p) => (/^\d{4}-q[1-4]$/i.test(String(p || '').trim()) ? String(p).trim().toLowerCase() : null);

const GROUPS = [
  { id: 'start', title: 'StartNet', links: [
    { label: 'Home', labelTa: 'முகப்பு', to: '/' },
    { label: 'Join StartNet', labelTa: 'StartNet-இல் இணையுங்கள்', to: '/join' },
    { label: 'Search', labelTa: 'தேடல்', to: '/search' },
    { label: 'Sitemap', labelTa: 'தள வரைபடம்', to: '/sitemap' },
  ] },
  { id: 'about', title: 'Who we are', titleTa: 'நாங்கள் யார்', links: [
    { label: 'Our story', labelTa: 'எங்கள் கதை', to: '/about' },
    { label: 'Mission 1 Lakh', to: '/about/mission-1-lakh' },
    { label: 'How we work', labelTa: 'நாங்கள் செயல்படும் விதம்', to: '/about/how-we-work' },
    { label: 'Leadership & team', labelTa: 'தலைமை & குழு', to: '/about/leadership' },
    { label: 'Evidence standard', labelTa: 'சான்றுத் தரநிலை', to: '/about/evidence-standard' },
    { label: 'Governance', labelTa: 'நிர்வாகம்', to: '/about/governance' },
    { label: 'Self-diagnosis report', labelTa: 'சுய மதிப்பீட்டு அறிக்கை', to: '/about/self-diagnosis' },
    { label: 'ThinkTN alliance', labelTa: 'ThinkTN கூட்டணி', to: '/about/thinktn-alliance' },
    { label: 'Districts', labelTa: 'மாவட்டங்கள்', to: '/districts' },
  ] },
  { id: 'programmes', title: 'Programmes', titleTa: 'திட்டங்கள்', links: [
    { label: 'Programme finder', labelTa: 'திட்டத் தேடி', to: '/programmes' },
    { label: 'Open calls', labelTa: 'திறந்த அழைப்புகள்', to: '/programmes/open-calls' },
  ] },
  { id: 'events', title: 'Events', titleTa: 'நிகழ்வுகள்', links: [
    { label: 'All events', labelTa: 'அனைத்து நிகழ்வுகள்', to: '/events' },
    { label: 'Past events & outcomes', labelTa: 'கடந்த நிகழ்வுகள் & விளைவுகள்', to: '/events/past' },
    { label: 'Speak or mentor', labelTa: 'பேசுங்கள் அல்லது வழிகாட்டுங்கள்', to: '/events/speak' },
    { label: 'Host an event', labelTa: 'நிகழ்வை நடத்துங்கள்', to: '/events/host' },
    { label: 'StartNet Founders Day', to: '/events/founders-day' },
    { label: 'Vibathon', to: '/vibe/vibathon' },
  ], nested: [
    { id: 'event-series', title: 'Event series', titleTa: 'நிகழ்வுத் தொடர்கள்', links: SERIES_LINKS },
    { id: 'event-editions', title: 'Editions', titleTa: 'பதிப்புகள்', dynamic: 'editions' },
  ] },
  { id: 'brands', title: 'Our brands', titleTa: 'எங்கள் பிராண்டுகள்', wide: true,
    links: [{ label: 'All brands', labelTa: 'அனைத்து பிராண்டுகள்', to: '/brands' }],
    sub: [
      {
        title: BRANDS.research.name, brand: 'research', links: withPages(brandLinks('research'), [STORIES('research'), EVENTS('research')]),
        nested: { id: 'research-labs', title: 'StartNet Labs', titleTa: 'StartNet Labs', links: LAB_LINKS },
      },
      {
        title: BRANDS.vibe.name, brand: 'vibe',
        links: withPages(brandLinks('vibe'), [{ label: 'Summit', labelTa: 'உச்சி மாநாடு', to: '/vibe/summit' }, STORIES('vibe'), EVENTS('vibe')]),
      },
      {
        title: BRANDS.connect.name, brand: 'connect', links: withPages(brandLinks('connect'), [STORIES('connect'), EVENTS('connect')]),
        nested: { id: 'sector-connects', title: 'Sector Connects', titleTa: 'துறைசார் Connect நிகழ்வுகள்', links: SECTOR_LINKS },
      },
      {
        title: BRANDS.women.name, brand: 'women',
        links: withPages(brandLinks('women'), [STORIES('women'), EVENTS('women'), { label: 'Awards', labelTa: 'விருதுகள்', to: '/women/summit/awards' }]),
      },
    ] },
  { id: 'insights', title: 'Insights', titleTa: 'நுண்ணறிவுகள்', links: [
    { label: 'Insights', labelTa: 'நுண்ணறிவுகள்', to: '/insights' },
    { label: 'Founder Ledger', to: '/insights/founder-ledger' },
    { label: 'How we count', labelTa: 'நாங்கள் கணக்கிடும் முறை', to: '/insights/founder-ledger/methodology' },
    { label: 'Corrections log', labelTa: 'திருத்தப் பதிவேடு', to: '/insights/founder-ledger/corrections' },
    { label: 'Founder stories', labelTa: 'நிறுவனர் கதைகள்', to: '/insights/stories' },
    { label: 'Reports', labelTa: 'அறிக்கைகள்', to: '/insights/reports' },
    { label: 'Indices', labelTa: 'குறியீடுகள்', to: '/insights/indices' },
    { label: 'Podcast', labelTa: 'பாட்காஸ்ட்', to: '/insights/podcast' },
    { label: 'Newsletter', labelTa: 'செய்திமடல்', to: '/insights/newsletter' },
  ], nested: [
    { id: 'ledger-editions', title: 'Ledger editions', titleTa: 'Ledger பதிப்புகள்', dynamic: 'ledger' },
    { id: 'reports-list', title: 'Reports & indices', titleTa: 'அறிக்கைகள் & குறியீடுகள்', links: INDEX_LINKS, dynamic: 'reports' },
  ] },
  // The sub-nav's "For organisations" item opens /startnet-x/institutions, which "Built for" below already lists.
  { id: 'snx', title: 'StartNet X', links: withPages((BRANDS.x?.subNav || []).filter((l) => !SNX_AUDIENCE_LINKS.some((a) => a.to === l.to)).map((l) => ({
    label: l.label === 'Overview' ? 'What StartNet X is' : l.label,
    labelTa: X_LABELS_TA[l.to] || l.labelTa,
    to: l.to,
  })), [
    { label: 'AI agents and guardrails', labelTa: 'AI முகவர்களும் பாதுகாப்பு வரம்புகளும்', to: '/startnet-x/agents' },
    { label: 'Updates', labelTa: 'புதுப்பிப்புகள்', to: '/startnet-x/updates' },
  ]), nested: [{ id: 'snx-built-for', title: 'Built for', titleTa: 'யாருக்காக', links: SNX_AUDIENCE_LINKS }] },
  { id: 'partner', title: 'Partner with us', titleTa: 'எங்களுடன் கூட்டு சேருங்கள்', links: [
    { label: 'Partner hub', labelTa: 'கூட்டாண்மை மையம்', to: '/partner' },
    ...ALL_TYPES.map((k) => ({ label: PARTNER_TYPES[k].menuLabel, labelTa: PARTNER_TYPES[k].menuLabelTa, to: `/partner/${k}` })),
    { label: 'District Ecosystem Programme', to: '/partner/district-programme' },
    { label: 'Our partners', labelTa: 'எங்கள் கூட்டாளர்கள்', to: '/partner/our-partners' },
    { label: 'Start an enquiry', labelTa: 'விசாரணையைத் தொடங்குங்கள்', to: '/partner/enquire' },
  ] },
  { id: 'company', title: 'Company', titleTa: 'நிறுவனம்', links: [
    { label: 'Media centre', labelTa: 'ஊடக மையம்', to: '/media' },
    { label: 'Media kit', labelTa: 'ஊடகத் தொகுப்பு', to: '/media/kit' },
    { label: 'Careers', labelTa: 'பணி வாய்ப்புகள்', to: '/careers' },
    { label: 'Contact', labelTa: 'தொடர்புக்கு', to: '/contact' },
  ] },
  { id: 'districts', title: 'Districts', titleTa: 'மாவட்டங்கள்', wide: true, cols: true, links: DISTRICT_LINKS },
  { id: 'legal', title: 'Legal', titleTa: 'சட்டம்', wide: true, cols: true, links: LEGAL_ORDER.map((k) => ({
    label: LEGAL[k].title,
    labelTa: legalTitle(k, LEGAL[k], 'ta'),
    to: `/legal/${k}`,
  })) },
];

function LinkList({ links, cols }) {
  const { t, localePath } = useLang();
  return (
    <ul role="list" className={`sitemap-links${cols ? ' sitemap-links--cols' : ''}`}>
      {links.map((l) => (
        <li key={l.to}><Link to={localePath(l.to)}>{t(l.label, l.labelTa)}</Link></li>
      ))}
    </ul>
  );
}

/** Data-driven pages (event editions, Ledger editions, reports), so new records appear without a code change. */
function useDynamicLinks() {
  const events = useApi('/api/events');
  const ledger = useApi('/api/ledger');
  const reports = useApi('/api/reports');
  const editions = (Array.isArray(events.data) ? events.data : [])
    .filter((e) => e && e.slug && e.series)
    .map((e) => ({ label: e.title, labelTa: e.titleTa, to: `/events/${e.series}/${editionKey(e)}` }));
  const periods = [ledger.data?.period, ...(Array.isArray(ledger.data?.periods) ? ledger.data.periods : [])]
    .map(periodSlug)
    .filter((p, i, all) => p && all.indexOf(p) === i)
    .map((p) => ({ label: `Founder Ledger ${p.replace('-q', ' Q')}`, to: `/insights/founder-ledger/${p}` }));
  const reportLinks = (Array.isArray(reports.data) ? reports.data : [])
    .filter((r) => r && r.slug && r.kind === 'report')
    // A report whose page lives elsewhere (self-diagnosis-2027 → /about/self-diagnosis) is listed at that page only.
    .filter((r) => !(typeof r.url === 'string' && r.url.startsWith('/') && !r.url.includes('#') && !r.url.startsWith('/insights/reports')))
    .map((r) => ({ label: r.title, labelTa: r.titleTa, to: `/insights/reports/${r.slug}` }));
  return { editions, ledger: periods, reports: reportLinks };
}

function NestedList({ block, dynamic }) {
  const { t } = useLang();
  const links = [...(block.links || []), ...(block.dynamic ? dynamic[block.dynamic] || [] : [])];
  if (!links.length) return null;
  return (
    <div className="sitemap-nested" id={block.id}>
      <h3 className="sitemap-nested__title">{t(block.title, block.titleTa)}</h3>
      <LinkList links={links} />
    </div>
  );
}

export default function Sitemap() {
  const { t, switchPath, lang } = useLang();
  const dynamic = useDynamicLinks();

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Sitemap: every StartNet page', 'தள வரைபடம்: எல்லா StartNet பக்கங்களும்')}
        description={t(
          'Every page on startnet.in in one list: brands, programmes, events, insights, StartNet X, partner pages and legal notices. Each is also in Tamil under /ta/.',
          'startnet.in-இன் ஒவ்வொரு பக்கமும் ஒரே பட்டியலில்: பிராண்டுகள், திட்டங்கள், நிகழ்வுகள், நுண்ணறிவுகள், StartNet X, கூட்டாண்மை, சட்டப் பக்கங்கள்.'
        )}
      />
      <PageHero
        eyebrow={t('Sitemap', 'தள வரைபடம்')}
        title={t('Every page, in one place.', 'ஒவ்வொரு பக்கமும், ஒரே இடத்தில்.')}
        lede={t(
          'Every page is also available in Tamil under /ta/, with the same address after it.',
          'ஒவ்வொரு பக்கமும் /ta/ என்பதன் கீழ், அதே முகவரியுடன் தமிழிலும் கிடைக்கிறது.'
        )}
        breadcrumbs={[{ label: t('Sitemap', 'தள வரைபடம்') }]}
      />
      <Section surface="white">
        <p className="sitemap-lang">
          {lang === 'ta' ? (
            <Link to={switchPath} hrefLang="en" lang="en">View this sitemap in English</Link>
          ) : (
            <Link to={switchPath} hrefLang="ta" lang="ta">இந்தப் பக்கம் தமிழில்</Link>
          )}
        </p>
        <div className="sitemap-grid">
          {GROUPS.map((g) => (
            <section
              key={g.id}
              id={g.id}
              className={`sitemap-group${g.wide ? ' sitemap-group--wide' : ''}`}
              aria-labelledby={`sitemap-${g.id}`}
            >
              <h2 id={`sitemap-${g.id}`} className="h5 sitemap-group__title">{t(g.title, g.titleTa)}</h2>
              <LinkList links={g.links} cols={g.cols} />
              {g.nested?.map((block) => <NestedList key={block.id} block={block} dynamic={dynamic} />)}
              {g.sub && (
                <div className="sitemap-sub">
                  {g.sub.map((s) => (
                    <div key={s.title} data-brand={s.brand} className="sitemap-sub__group">
                      <h3 className="sitemap-sub__title">{s.title}</h3>
                      <LinkList links={s.links} />
                      {s.nested && (
                        <div className="sitemap-nested" id={s.nested.id}>
                          <h4 className="sitemap-nested__title">{t(s.nested.title, s.nested.titleTa)}</h4>
                          <LinkList links={s.nested.links} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
