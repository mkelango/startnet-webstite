// StartNet X · Developers (T19 standard page, P3). URL: /startnet-x/developers (brand 'x'); anchors #webhooks and #status.
// Facts: Book 1 Part B §2.1 (api.startnet.in = public Ledger and partner APIs, v3, read-only, aggregated or consented data;
// documented here; Ledger pages offer "Get this data" links), §2.2 (purpose "api.startnet.in, Ledger API, webhooks";
// audience partners and analysts; CTA "Get an API key"; P3 with SNX v3), §1 Insights row (licensed data, Phase 3),
// Book 2 §7.2/§7.3 (government open-data feeds with A/B/C tags, incubator Ledger export, investor Ledger analytics).
// Endpoints, event names and code below are ILLUSTRATIVE and marked planned: final paths are published with v3.
import { ArrowRight, Database, Lock, Tags, Eye, Building2, Landmark, LineChart } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, SectionHeader, Button, KeyFacts, Tabs, SmartForm,
  Reveal, RevealGroup, Placeholder, Dot, TagChip,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxPageLd } from '../../snx/snxSeo.js';
import { XStatus, OnThisPage } from './SnxxParts.jsx';
import './Developers.css';

const SAMPLE_RESPONSE = `{
  "period": "<quarter>",
  "asAt": "<YYYY-MM-DD>",
  "kpis": [
    {
      "key": "<metric key>",
      "label": "<label>",
      "value": "<number or null>",
      "tag": "<A | B | C>",
      "asAt": "<YYYY-MM-DD>",
      "source": "<source>"
    }
  ],
  "corrections": ["<entries from the public corrections log>"]
}`;

const SAMPLE_CURL = `curl https://api.startnet.in/v3/ledger \\
  -H "Authorization: Bearer $STARTNET_API_KEY"`;

const SAMPLE_JS = `const res = await fetch('https://api.startnet.in/v3/ledger', {
  headers: { Authorization: \`Bearer \${process.env.STARTNET_API_KEY}\` },
});
const ledger = await res.json();
// Keep each figure's tag, as-at date and source when you show it.`;

const SAMPLE_PY = `import os, requests

res = requests.get(
    "https://api.startnet.in/v3/ledger",
    headers={"Authorization": f"Bearer {os.environ['STARTNET_API_KEY']}"},
)
ledger = res.json()
# Keep each figure's tag, as-at date and source when you show it.`;

const SAMPLE_WEBHOOK = `{
  "event": "ledger.correction.logged",
  "occurredAt": "<ISO 8601 timestamp>",
  "data": {
    "metricKey": "<metric key>",
    "correctionUrl": "https://startnet.in/insights/founder-ledger/corrections"
  }
}`;

function Code({ code, label }) {
  return (
    <figure className="snx-dev__code">
      <figcaption className="snx-dev__code-cap">{label}</figcaption>
      <pre className="snx-dev__pre" tabIndex={0}>
        <code lang="en">{code}</code>
      </pre>
    </figure>
  );
}

export default function Developers() {
  const { t, lang } = useLang(); // Button `to` is localised by the kit (localePath).

  const toc = [
    { id: 'overview', label: t('Overview', 'கண்ணோட்டம்') },
    { id: 'ledger-api', label: t('Ledger API', 'Ledger API') },
    { id: 'webhooks', label: t('Webhooks', 'Webhooks') },
    { id: 'status', label: t('Status', 'நிலை') },
    { id: 'api-key', label: t('Get an API key', 'API key பெறுங்கள்') },
  ];

  const principles = [
    {
      icon: Eye,
      title: t('Read-only', 'படிக்க மட்டும்'),
      body: t('You can read data. Nothing on StartNet X can be changed through the API.', 'தரவைப் படிக்கலாம். API வழியாக StartNet X-இல் எதையும் மாற்ற முடியாது.'),
    },
    {
      icon: Lock,
      title: t('Aggregated or consented', 'தொகுக்கப்பட்டது அல்லது ஒப்புதல் பெற்றது'),
      body: t(
        'Data is aggregated, or shared only where the person has opted in, under the DPDP Act, 2023.',
        'DPDP சட்டம், 2023-இன் கீழ், தரவு தொகுக்கப்பட்ட வடிவில் இருக்கும், அல்லது அந்த நபர் ஒப்புக்கொண்டால் மட்டுமே பகிரப்படும்.'
      ),
    },
    {
      icon: Tags,
      title: t('Every figure keeps its tag', 'ஒவ்வொரு எண்ணும் தன் குறியீட்டுடன்'),
      body: t(
        'Each figure carries its A, B or C tag, as-at date and source, exactly as on the Founder Ledger.',
        'Founder Ledger-இல் உள்ளபடியே, ஒவ்வொரு எண்ணும் தன் A, B அல்லது C குறியீடு, நிலவரத் தேதி, மூலத்துடன் வரும்.'
      ),
    },
    {
      icon: Database,
      title: t('Licensed data', 'உரிமம் பெற்ற தரவு'),
      body: t('Access is licensed with an API key.', 'API key மூலம் உரிமத்துடன் அணுகல்.'),
    },
  ];

  const users = [
    {
      icon: Landmark,
      title: t('Government & districts', 'அரசு & மாவட்டங்கள்'),
      body: t('Open-data feeds with A/B/C tags.', 'A/B/C குறியீடுகளுடன் திறந்த தரவு ஓட்டங்கள்.'),
    },
    {
      icon: Building2,
      title: t('Incubators & TBIs', 'இன்குபேட்டர்கள் & TBI-கள்'),
      body: t('Portfolio tracking and Ledger export.', 'போர்ட்ஃபோலியோ கண்காணிப்பும் Ledger ஏற்றுமதியும்.'),
    },
    {
      icon: LineChart,
      title: t('Investors & analysts', 'முதலீட்டாளர்கள் & பகுப்பாய்வாளர்கள்'),
      body: t('Ledger analytics, built on the same tagged figures.', 'அதே குறியிடப்பட்ட எண்களின் மீது Ledger பகுப்பாய்வு.'),
    },
  ];

  const endpoints = [
    { path: 'GET /v3/ledger', what: t('The latest Ledger edition: period, as-at date and headline figures', 'சமீபத்திய Ledger பதிப்பு: காலம், நிலவரத் தேதி, முக்கிய எண்கள்') },
    { path: 'GET /v3/ledger/brands', what: t('Figures by brand', 'பிராண்டு வாரியான எண்கள்') },
    { path: 'GET /v3/ledger/districts', what: t('Aggregated figures by district', 'மாவட்ட வாரியான தொகுக்கப்பட்ட எண்கள்') },
    { path: 'GET /v3/ledger/corrections', what: t('The public corrections log', 'பொது திருத்தப் பதிவேடு') },
    { path: 'GET /v3/metrics', what: t('Individual tagged figures, filterable by brand', 'பிராண்டு வாரியாக வடிகட்டக்கூடிய தனித்தனி குறியிடப்பட்ட எண்கள்') },
  ];

  const hooks = [
    { name: 'ledger.edition.published', what: t('A new Founder Ledger edition is published', 'புதிய Founder Ledger பதிப்பு வெளியிடப்படுகிறது') },
    { name: 'ledger.correction.logged', what: t('A correction is added to the public corrections log', 'பொது திருத்தப் பதிவேட்டில் ஒரு திருத்தம் சேர்க்கப்படுகிறது') },
  ];

  const status = [
    { name: t('Ledger API', 'Ledger API'), host: 'api.startnet.in' },
    { name: t('Partner APIs', 'கூட்டாளர் API-கள்'), host: 'api.startnet.in' },
    { name: t('Webhooks', 'Webhooks'), host: 'api.startnet.in' },
  ];

  const facts = [
    { label: t('Base URL', 'அடிப்படை URL'), value: <code className="snx-dev__inline" lang="en">api.startnet.in</code> },
    { label: t('Version', 'பதிப்பு'), value: 'v3' },
    { label: t('Access', 'அணுகல்'), value: t('Read-only, with an API key', 'படிக்க மட்டும், API key உடன்') },
    { label: t('Data', 'தரவு'), value: t('Aggregated or consented', 'தொகுக்கப்பட்டது அல்லது ஒப்புதல் பெற்றது') },
    { label: t('Availability', 'கிடைக்கும் நிலை'), value: <XStatus status="coming" release="SNX v3" /> },
    { label: t('Rate limits and licence terms', 'வீத வரம்புகளும் உரிம விதிமுறைகளும்'), value: <Placeholder>{t('[placeholder — to be supplied by StartNet]', '[இடம் நிரப்புதல் — StartNet வழங்கும்]')}</Placeholder> },
  ];

  return (
    <div className="snx-dev">
      <Seo
        jsonLd={snxPageLd({ path: '/startnet-x/developers', lang })}
        // SEO-TA: pending native review
        title={t('StartNet X developers: Founder Ledger API', 'StartNet X டெவலப்பர்கள்: Founder Ledger API')}
        description={t(
          'api.startnet.in: read-only Founder Ledger and partner APIs (v3), with aggregated or consented data and A/B/C tags on every figure. Coming later.',
          'api.startnet.in: படிக்க மட்டுமான Founder Ledger, கூட்டாளர் API-கள் (v3); தொகுக்கப்பட்ட அல்லது ஒப்புதல் பெற்ற தரவு, A/B/C குறியுடன். பின்னர் வரும்.'
        )}
      />
      {/* Crumbs sit on the ink band, part of the header + hero (AngelList family). */}
      <div className="snx-dev__crumbs-band" data-surface="night">
        <div className="container snx-dev__crumbs">
          <Breadcrumbs items={[{ label: 'StartNet X', to: '/startnet-x' }, { label: t('Developers', 'டெவலப்பர்கள்') }]} />
        </div>
      </div>

      <BrandHero
        brand="x"
        compact
        title={t('Ledger data, with every tag attached.', 'ஒவ்வொரு குறியீட்டுடனும் Ledger தரவு.')}
        lede={t(
          'api.startnet.in will serve the public Founder Ledger and partner APIs: read-only, aggregated or consented data, documented on this page.',
          'api.startnet.in பொது Founder Ledger, கூட்டாளர் API-களை வழங்கும்: படிக்க மட்டும், தொகுக்கப்பட்ட அல்லது ஒப்புதல் பெற்ற தரவு, இந்தப் பக்கத்தில் ஆவணப்படுத்தப்படும்.'
        )}
        meta={<XStatus status="coming" release="SNX v3" />}
        actions={
          <>
            <Button href="#api-key">{t('Get an API key', 'API key பெறுங்கள்')}</Button>
            <Button variant="tertiary" to="/insights/founder-ledger">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Button>
          </>
        }
      />

      <Section surface="paper" pad="sm">
        <OnThisPage items={toc} />
      </Section>

      {/* Overview: 8/4 with key facts */}
      <Section surface="paper" id="overview" className="snx-dev__anchor">
        <div className="split split--8-4 snx-dev__layout">
          <div className="snx-dev__main">
            <SectionHeader
              eyebrow={t('Overview', 'கண்ணோட்டம்')}
              title={
                <>
                  {t('The same numbers, in your tools', 'அதே எண்கள், உங்கள் கருவிகளில்')}
                  <Dot />
                </>
              }
              lede={t(
                'The API gives partners and analysts the figures behind the Founder Ledger. Ledger pages will offer "Get this data" links into it.',
                'Founder Ledger-இன் பின்னால் உள்ள எண்களைக் கூட்டாளர்களுக்கும் பகுப்பாய்வாளர்களுக்கும் API வழங்கும். Ledger பக்கங்களில் "இந்தத் தரவைப் பெறுங்கள்" இணைப்புகள் இருக்கும்.'
              )}
            />
            <RevealGroup as="ul" className="snx-dev__principles">
              {principles.map(({ icon: Icon, title, body }) => (
                <li key={title} className="snx-dev__principle">
                  <span className="snx-dev__icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
                  <h3 className="h5">{title}</h3>
                  <p className="text-2">{body}</p>
                </li>
              ))}
            </RevealGroup>

            <div className="snx-dev__users">
              <h3 className="h4">{t('Who it is for', 'யாருக்காக')}</h3>
              <ul className="snx-dev__user-list">
                {users.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="snx-dev__user">
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <p className="snx-dev__user-title">{title}</p>
                      <p className="text-2">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button variant="tertiary" to="/about/evidence-standard" icon={ArrowRight}>
                {t('How we tag figures', 'எண்களை எப்படிக் குறிக்கிறோம்')}
              </Button>
            </div>
          </div>
          <div className="snx-dev__aside">
            <KeyFacts
              title={t('API at a glance', 'API சுருக்கமாக')}
              items={facts}
              action={<Button full href="#api-key">{t('Get an API key', 'API key பெறுங்கள்')}</Button>}
            />
          </div>
        </div>
      </Section>

      {/* Ledger API: the page's one Night band (data) */}
      <Section surface="night" brand="x" id="ledger-api" className="snx-dev__anchor">
        <SectionHeader
          eyebrow={t('Ledger API', 'Ledger API')}
          title={
            <>
              {t('Planned endpoints', 'திட்டமிடப்பட்ட endpoints')}
              <Dot />
            </>
          }
          lede={t(
            'Illustrative only. Final paths, parameters and fields are published here with SNX v3.',
            'எடுத்துக்காட்டு மட்டுமே. இறுதி பாதைகள், அளவுருக்கள், புலங்கள் SNX v3-உடன் இங்கே வெளியிடப்படும்.'
          )}
        />
        <div className="snx-dev__table-wrap" role="region" aria-label={t('Planned endpoints', 'திட்டமிடப்பட்ட endpoints')} tabIndex={0}>
          <table className="snx-dev__table" role="table">
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader">{t('Endpoint', 'Endpoint')}</th>
                <th scope="col" role="columnheader">{t('Returns', 'வழங்குவது')}</th>
                <th scope="col" role="columnheader">{t('Status', 'நிலை')}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {endpoints.map((e) => (
                <tr key={e.path} role="row">
                  <th scope="row" role="rowheader"><code lang="en">{e.path}</code></th>
                  <td role="cell">{e.what}</td>
                  <td role="cell"><XStatus status="planned" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="snx-dev__samples">
          <Reveal className="snx-dev__sample-col">
            <h3 className="h5">{t('Request', 'கோரிக்கை')}</h3>
            <Tabs
              label={t('Request examples', 'கோரிக்கை எடுத்துக்காட்டுகள்')}
              tabs={[
                { id: 'curl', label: 'curl', content: <Code code={SAMPLE_CURL} label={t('Illustrative request', 'எடுத்துக்காட்டுக் கோரிக்கை')} /> },
                { id: 'js', label: 'JavaScript', content: <Code code={SAMPLE_JS} label={t('Illustrative request', 'எடுத்துக்காட்டுக் கோரிக்கை')} /> },
                { id: 'py', label: 'Python', content: <Code code={SAMPLE_PY} label={t('Illustrative request', 'எடுத்துக்காட்டுக் கோரிக்கை')} /> },
              ]}
            />
          </Reveal>
          <Reveal className="snx-dev__sample-col" delay={0.08}>
            <h3 className="h5">{t('Response shape', 'பதிலின் வடிவம்')}</h3>
            <Code code={SAMPLE_RESPONSE} label={t('Illustrative response. No real figures are shown.', 'எடுத்துக்காட்டுப் பதில். உண்மையான எண்கள் காட்டப்படவில்லை.')} />
            <p className="snx-dev__tags">
              <TagChip tag="A" /> <TagChip tag="B" /> <TagChip tag="C" />
              <span>{t('Every figure keeps its confidence tag.', 'ஒவ்வொரு எண்ணும் தன் நம்பகத்தன்மைக் குறியீட்டுடன்.')}</span>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Webhooks */}
      <Section surface="paper" id="webhooks" className="snx-dev__anchor">
        <div className="snx-dev__two">
          <div className="snx-dev__two-text">
            <SectionHeader
              eyebrow={t('Webhooks', 'Webhooks')}
              title={t('Hear about changes as they happen', 'மாற்றங்களை உடனுக்குடன் அறியுங்கள்')}
              lede={t(
                'Planned: a notice to your endpoint when a new Ledger edition is published or a correction is logged, so your copy never drifts from ours.',
                'திட்டமிடப்பட்டது: புதிய Ledger பதிப்பு வெளியானாலோ திருத்தம் பதிவானாலோ உங்கள் endpoint-க்கு அறிவிப்பு; உங்கள் நகல் எங்களுடையதிலிருந்து விலகாது.'
              )}
            />
            <ul className="snx-dev__hooks">
              {hooks.map((h) => (
                <li key={h.name} className="snx-dev__hook">
                  <code lang="en">{h.name}</code>
                  <span className="text-2">{h.what}</span>
                  <XStatus status="planned" />
                </li>
              ))}
            </ul>
            {/* Signing, retries and delivery terms: hidden until StartNet supplies them. */}
          </div>
          <Reveal className="snx-dev__two-code">
            <Code code={SAMPLE_WEBHOOK} label={t('Illustrative webhook payload', 'எடுத்துக்காட்டு webhook தரவு')} />
          </Reveal>
        </div>
      </Section>

      {/* Status */}
      <Section surface="white" id="status" className="snx-dev__anchor">
        <SectionHeader
          eyebrow={t('Status', 'நிலை')}
          title={t('Service status', 'சேவை நிலை')}
          lede={t(
            'Nothing on api.startnet.in is live yet. This list changes only when a service actually launches.',
            'api.startnet.in-இல் இன்னும் எதுவும் நேரலையில் இல்லை. ஒரு சேவை உண்மையில் தொடங்கும்போது மட்டுமே இந்தப் பட்டியல் மாறும்.'
          )}
        />
        <ul className="snx-dev__status">
          {status.map((s) => (
            <li key={s.name} className="snx-dev__status-row">
              <span className="snx-dev__status-name">{s.name}</span>
              <code className="snx-dev__inline" lang="en">{s.host}</code>
              <XStatus status="coming" release="SNX v3" />
            </li>
          ))}
        </ul>
        {/* "Live status page and incident history: [placeholder]" is hidden until the URL is supplied. */}
        <p className="snx-dev__note">
          <Button variant="tertiary" to="/startnet-x/updates" icon={ArrowRight}>
            {t('See StartNet X updates', 'StartNet X புதுப்பிப்புகளைப் பாருங்கள்')}
          </Button>
        </p>
      </Section>

      {/* Get an API key */}
      <Section surface="paper" id="api-key" className="snx-dev__anchor">
        <div className="snx-dev__form-grid">
          <div className="snx-dev__form-intro">
            <p className="eyebrow">{t('Get an API key', 'API key பெறுங்கள்')}</p>
            <h2 className="h2">
              {t('Tell us what you will build', 'நீங்கள் என்ன உருவாக்கப் போகிறீர்கள் என்று சொல்லுங்கள்')}
              <Dot />
            </h2>
            <p className="body-lg text-2">
              {t(
                'Keys are issued when the API launches. Leave your details and we will write to you first.',
                'API தொடங்கும்போது keys வழங்கப்படும். உங்கள் விவரங்களைத் தாருங்கள்; முதலில் உங்களுக்கு எழுதுவோம்.'
              )}
            </p>
            <Button variant="tertiary" to="/partner/enquire?topic=snx" icon={ArrowRight}>
              {t('Partner enquiry instead', 'அதற்குப் பதிலாகக் கூட்டாண்மை விசாரணை')}
            </Button>
          </div>
          <SmartForm
            type="interest"
            className="snx-dev__form"
            hidden={{ programme: 'snx-developers-api-key', source: 'startnet-x/developers' }}
            fields={[
              { name: 'name', id: 'snxdev-name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
              { name: 'email', id: 'snxdev-email', label: t('Work email', 'பணி மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
              { name: 'organisation', id: 'snxdev-org', label: t('Organisation (optional)', 'நிறுவனம் (விருப்பம்)'), autoComplete: 'organization' },
              {
                name: 'message', id: 'snxdev-use', type: 'textarea', required: true,
                label: t('What would you like to build?', 'என்ன உருவாக்க விரும்புகிறீர்கள்?'),
                hint: t('For example: a district dashboard, a portfolio report, research on founder outcomes.', 'எ.கா.: மாவட்ட டாஷ்போர்டு, போர்ட்ஃபோலியோ அறிக்கை, நிறுவனர் விளைவுகள் பற்றிய ஆய்வு.'),
              },
            ]}
            consents={[
              {
                purpose: 'contact',
                required: true,
                label: t('StartNet may contact me about API access.', 'API அணுகல் பற்றி StartNet என்னைத் தொடர்பு கொள்ளலாம்.'),
              },
            ]}
            submitLabel={t('Request API access', 'API அணுகலைக் கோருங்கள்')}
            successTitle={t('You are on the list.', 'நீங்கள் பட்டியலில் இருக்கிறீர்கள்.')}
            successBody={t('We will write to you when API keys are issued.', 'API keys வழங்கப்படும்போது உங்களுக்கு எழுதுவோம்.')}
          />
        </div>
      </Section>
    </div>
  );
}
