// /about/governance · Governance & evidence standard (T19, text-led on Paper).
// Copy: Book 2 §2.6 verbatim; evidence committee and review workflow from Book 1 Part A §8.4.
// Tamil copy: draft pending native review (Book 2 §14).
import { Link } from 'react-router-dom';
import { FileText, OctagonX, Users, Bot, Database, Landmark, ListChecks } from 'lucide-react';
import { Seo, PageHero, Section, Reveal, Button, CTABand } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { aboutCrumbs, InPageNav } from './shared.jsx';
import './Governance.css';
import { ORG_REF } from '../../lib/seo.js';
import { pageLd } from '../brands/seoBits.js';

// SEO: primary "StartNet governance"; title no longer repeats "evidence standard" (that is /about/evidence-standard).
// SEO-TA: pending native review
const SEO = {
  title: ['StartNet governance: stopping rules, AI and data', 'StartNet நிர்வாகம்: நிறுத்த விதிகள், AI, தரவு'],
  description: [
    'How StartNet is governed: confidence tags, stopping rules, a corrections log, AI guardrails, data protection under the DPDP Act and legal entities.',
    'StartNet நிர்வாகம்: நம்பகத்தன்மைக் குறிகள், நிறுத்த விதிகள், திருத்தப் பதிவேடு, AI பாதுகாப்பு வரம்புகள், DPDP சட்டத்தின் கீழ் தரவுப் பாதுகாப்பு.',
  ],
  path: '/about/governance',
};

const SECTIONS = [
  { id: 'evidence', label: ['Evidence standard', 'சான்றுத் தரநிலை'], icon: FileText },
  { id: 'stopping-rules', label: ['Stopping rules', 'நிறுத்த விதிகள்'], icon: OctagonX },
  { id: 'evidence-committee', label: ['Evidence committee', 'சான்றுக் குழு'], icon: Users },
  { id: 'ai-guardrails', label: ['AI guardrails', 'AI பாதுகாப்பு வரம்புகள்'], icon: Bot },
  { id: 'your-data', label: ['Your data', 'உங்கள் தரவு'], icon: Database },
  { id: 'structure', label: ['Structure', 'அமைப்பு'], icon: Landmark },
  { id: 'ethics', label: ['Conflicts and ethics', 'நலன் முரண்களும் அறநெறியும்'], icon: ListChecks },
];

const WORKFLOW = [
  { id: 'draft', label: ['Draft', 'வரைவு'] },
  { id: 'brand', label: ['Brand review', 'பிராண்ட் மறுஆய்வு'] },
  { id: 'evidence', label: ['Evidence review', 'சான்று மறுஆய்வு'], key: true },
  { id: 'tamil', label: ['Tamil review', 'தமிழ் மறுஆய்வு'] },
  { id: 'publish', label: ['Publish', 'வெளியீடு'] },
];

const entities = (t) => [
  {
    // MCA master data: incorporated 4 July 2023, RoC Coimbatore; registered office in Salem. SEO-TA: pending native review
    name: 'StartNet Ventures Private Limited',
    role: (
      <>
        {t('The operating company: brands, StartNet X, events and contracts.', 'செயல்பாட்டு நிறுவனம்: பிராண்டுகள், StartNet X, நிகழ்வுகள், ஒப்பந்தங்கள்.')}{' '}
        CIN <span className="tnum">U70200TZ2023PTC028823</span>.{' '}
        {t('Incorporated 4 July 2023. Registered office:', '4 ஜூலை 2023 அன்று பதிவுசெய்யப்பட்டது. பதிவு அலுவலகம்:')}{' '}
        <span translate="no">112/2F4, Fairlands, 3rd Cross Street, Fairlands, Salem, Tamil Nadu 636016</span>.
      </>
    ),
  },
  {
    name: 'StartNet Foundation',
    role: (
      <>
        <span className="gov-proposed">{t('[proposed]', '[முன்மொழியப்பட்டது]')}</span>{' '}
        {/* Status line ("Status: …"): add when StartNet supplies it. */}
        {t('A not-for-profit company for CSR-funded programmes.', 'CSR நிதியுதவி பெறும் திட்டங்களுக்கான இலாப நோக்கற்ற நிறுவனம்.')}
      </>
    ),
  },
  {
    name: 'StartNet Angels / StartNet Capital',
    role: (
      <>
        {/* Status line ("Status: …"): add when StartNet supplies it. */}
        {t('Run only through SEBI-compliant structures.', 'SEBI விதிகளுக்கு இணங்கும் அமைப்புகள் மூலம் மட்டுமே நடத்தப்படும்.')}
      </>
    ),
  },
  {
    name: 'ThinkTN Foundation',
    role: t('Separate and independent. A related party; dealings disclosed.', 'தனித்தது, சுதந்திரமானது. தொடர்புடைய தரப்பு; பரிவர்த்தனைகள் வெளிப்படுத்தப்படுகின்றன.'),
  },
];

function Block({ id, n, title, children }) {
  const Icon = SECTIONS.find((s) => s.id === id)?.icon;
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="gov-block">
      <Reveal className="gov-block__head">
        {Icon && <span className="gov-block__icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>}
        <p className="gov-block__n tnum" aria-hidden="true">{String(n).padStart(2, '0')}</p>
        <h2 id={`${id}-h`} className="h3 gov-block__title">{title}</h2>
      </Reveal>
      <div className="gov-block__body">{children}</div>
    </section>
  );
}

export default function Governance() {
  const { t, lang, localePath } = useLang();
  const seoLd = pageLd({ path: SEO.path, lang, type: 'AboutPage', name: t(...SEO.title), description: t(...SEO.description), about: ORG_REF });
  const sections = SECTIONS.map((s) => ({ id: s.id, label: t(...s.label), icon: s.icon }));
  const ents = entities(t);
  const evidenceStandard = t('Read the evidence standard', 'சான்றுத் தரநிலையைப் படியுங்கள்');
  const stoppingBody = t(
    "Every lab, programme and event series has a named owner and a written stopping condition. Example: a StartNet Lab that forms no company in 24 months closes or pivots, and we publish the decision. Each brand's advisory council reviews progress every quarter.",
    'ஒவ்வொரு ஆய்வகம், திட்டம், நிகழ்வுத் தொடருக்கும் பெயரிடப்பட்ட ஒரு பொறுப்பாளரும் எழுதப்பட்ட நிறுத்த நிபந்தனையும் உண்டு. உதாரணம்: 24 மாதங்களில் எந்த நிறுவனத்தையும் உருவாக்காத StartNet Lab மூடப்படும் அல்லது திசை மாற்றப்படும்; அந்த முடிவை வெளியிடுவோம். ஒவ்வொரு பிராண்டின் ஆலோசனைக் குழுவும் ஒவ்வொரு காலாண்டும் முன்னேற்றத்தை மறுஆய்வு செய்கிறது.'
  );

  return (
    <>
      <Seo
        title={t(...SEO.title)}
        description={t(...SEO.description)}
        titleTa={SEO.title[1]}
        descriptionTa={SEO.description[1]}
        jsonLd={seoLd}
      />
      <PageHero
        breadcrumbs={aboutCrumbs(t, t('Governance', 'நிர்வாகம்'))}
        eyebrow={t('Governance', 'நிர்வாகம்')}
        title={t('How we keep ourselves honest', 'நாங்கள் எப்படி நேர்மையாக இருக்கிறோம்')}
        lede={t(
          'The rules that sit behind every number, programme and decision at StartNet.',
          'StartNet-இன் ஒவ்வொரு எண், திட்டம், முடிவின் பின்னால் இருக்கும் விதிகள்.'
        )}
        actions={<Button to="/about/evidence-standard" size="lg">{evidenceStandard}</Button>}
      />

      <Section>
        <div className="about-layout-toc">
          <aside className="about-layout-toc__aside">
            <InPageNav items={sections} variant="aside" />
          </aside>

          <div className="about-layout-toc__main gov-main">
            <Block id="evidence" n={1} title={t('Evidence standard', 'சான்றுத் தரநிலை')}>
              <p className="body-lg">
                {t(
                  'Every figure shows its source and as-at date, or an A/B/C tag. Our own prices and targets are tagged C. Partners appear only once signed, with the date. Errors go in the public corrections log.',
                  'ஒவ்வொரு எண்ணும் அதன் மூலத்தையும் நிலவரத் தேதியையும், அல்லது A/B/C குறியைக் காட்டும். எங்கள் சொந்த விலைகளும் இலக்குகளும் C எனக் குறிக்கப்படும். கூட்டாளர்கள் கையெழுத்திட்ட பின்பே, தேதியுடன் இடம்பெறுவர். பிழைகள் பொதுத் திருத்தப் பதிவேட்டில் சேர்க்கப்படும்.'
                )}
              </p>
              <div className="gov-actions">
                <Button to="/insights/founder-ledger#corrections" variant="secondary">{t('View corrections log', 'திருத்தப் பதிவேட்டைப் பாருங்கள்')}</Button>
                <Button to="/about/evidence-standard" variant="tertiary">{evidenceStandard}</Button>
              </div>
            </Block>

            <Block id="stopping-rules" n={2} title={t('Programme stopping rules', 'திட்ட நிறுத்த விதிகள்')}>
              <p className="body-lg">{stoppingBody}</p>
              <ol className="gov-kill" aria-label={t('Example stopping rule', 'நிறுத்த விதிக்கு ஓர் உதாரணம்')}>
                <li className="gov-kill__step">
                  <span className="gov-kill__k">{t('Rule', 'விதி')}</span>
                  <span>{t('A StartNet Lab with a named owner', 'பெயரிடப்பட்ட பொறுப்பாளருடன் ஒரு StartNet Lab')}</span>
                </li>
                <li className="gov-kill__step">
                  <span className="gov-kill__k">{t('Condition', 'நிபந்தனை')}</span>
                  <span>{t('No company formed in 24 months', '24 மாதங்களில் எந்த நிறுவனமும் உருவாகவில்லை')}</span>
                </li>
                <li className="gov-kill__step">
                  <span className="gov-kill__k">{t('Decision', 'முடிவு')}</span>
                  <span>{t('Closes or pivots', 'மூடப்படும் அல்லது திசை மாறும்')}</span>
                </li>
                <li className="gov-kill__step gov-kill__step--end">
                  <span className="gov-kill__k">{t('Disclosure', 'வெளிப்படுத்தல்')}</span>
                  <span>{t('We publish the decision', 'முடிவை வெளியிடுகிறோம்')}</span>
                </li>
              </ol>
            </Block>

            <Block id="evidence-committee" n={3} title={t('Evidence committee', 'சான்றுக் குழு')}>
              <p className="body-lg">
                {t(
                  'The evidence committee signs off every figure, Ledger edition and correction.',
                  'ஒவ்வொரு எண், Ledger பதிப்பு, திருத்தத்துக்கும் சான்றுக் குழு ஒப்புதல் அளிக்கிறது.'
                )}
              </p>
              <p className="gov-sub">
                {t(
                  'Every page with a figure follows the same review path, and shows a “last reviewed” date.',
                  'எண்கள் உள்ள ஒவ்வொரு பக்கமும் இதே மறுஆய்வுப் பாதையைப் பின்பற்றி, “கடைசியாக மறுஆய்வு செய்யப்பட்ட” தேதியைக் காட்டும்.'
                )}
              </p>
              <ol className="gov-flow">
                {WORKFLOW.map((w) => (
                  <li key={w.id} className="gov-flow__item">
                    <span className={`gov-flow__step${w.key ? ' is-key' : ''}`}>
                      {t(...w.label)}
                      {w.key && <span className="gov-flow__note">{t('required for any figure', 'எந்த எண்ணுக்கும் கட்டாயம்')}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </Block>

            <Block id="ai-guardrails" n={4} title={t('AI guardrails', 'AI பாதுகாப்பு வரம்புகள்')}>
              <p className="body-lg">
                {t(
                  'StartNet X uses AI agents to help with coaching, matching, grant applications and operations. People make the decisions.',
                  'பயிற்சி, பொருத்தம், மானிய விண்ணப்பங்கள், செயல்பாடுகளுக்கு உதவ StartNet X AI முகவர்களைப் பயன்படுத்துகிறது. முடிவுகளை மனிதர்களே எடுக்கிறார்கள்.'
                )}
              </p>
              <ul className="about-checklist">
                <li>{t('No automated rejection. Every selection, funding or exclusion decision is made by a named person.', 'தானியங்கி நிராகரிப்பு இல்லை. ஒவ்வொரு தேர்வு, நிதியுதவி, விலக்கல் முடிவையும் பெயரிடப்பட்ட ஒருவரே எடுக்கிறார்.')}</li>
                <li>{t('Bias audits each quarter by gender, district, language and college tier, published in our self-diagnosis.', 'பாலினம், மாவட்டம், மொழி, கல்லூரி நிலை வாரியாக ஒவ்வொரு காலாண்டும் சார்புத் தணிக்கை; எங்கள் சுய ஆய்வில் வெளியிடப்படும்.')}</li>
                <li>{t('Every agent answer cites its source, and figures keep their tag.', 'முகவரின் ஒவ்வொரு பதிலும் அதன் மூலத்தைக் குறிப்பிடும்; எண்கள் தங்கள் குறியுடனே இருக்கும்.')}</li>
                <li>{t('Agents are tested in Tamil and English before they go live.', 'முகவர்கள் நேரலைக்கு வருவதற்கு முன் தமிழிலும் ஆங்கிலத்திலும் சோதிக்கப்படுகின்றன.')}</li>
              </ul>
            </Block>

            <Block id="your-data" n={5} title={t('Your data', 'உங்கள் தரவு')}>
              <ul className="about-checklist">
                <li>{t('We follow the Digital Personal Data Protection Act, 2023. You can access, correct or erase your data, and withdraw consent at any time.', 'எண்ணிம தனிநபர் தரவுப் பாதுகாப்புச் சட்டம், 2023-ஐப் பின்பற்றுகிறோம். உங்கள் தரவைப் பார்க்கலாம், திருத்தலாம், அழிக்கலாம்; எந்த நேரத்திலும் ஒப்புதலைத் திரும்பப் பெறலாம்.')}</li>
                <li>{t('Your data is stored in India, encrypted in transit and at rest.', 'உங்கள் தரவு இந்தியாவில் சேமிக்கப்படுகிறது; பரிமாற்றத்திலும் சேமிப்பிலும் மறையாக்கம் செய்யப்படுகிறது.')}</li>
                <li>{t('We never sell personal data. Your profile is shared with an investor, GCC or institution only if you opt in, and every share is logged.', 'தனிப்பட்ட தரவை நாங்கள் ஒருபோதும் விற்பதில்லை. நீங்கள் ஒப்புக்கொண்டால் மட்டுமே உங்கள் சுயவிவரம் ஒரு முதலீட்டாளர், GCC அல்லது கல்வி நிறுவனத்துடன் பகிரப்படும்; ஒவ்வொரு பகிர்வும் பதிவு செய்யப்படும்.')}</li>
                <li>{t('For anyone under 18, we ask for verifiable consent from a parent or guardian.', '18 வயதுக்குட்பட்டவர்களுக்கு, பெற்றோர் அல்லது பாதுகாவலரிடமிருந்து சரிபார்க்கக்கூடிய ஒப்புதலைக் கேட்கிறோம்.')}</li>
                <li>
                  {/* Grievance officer's name and email: add here when StartNet supplies them. SEO-TA: pending native review */}
                  {t('Grievance officer: nagaraj@startnet.in, or by post: StartNet Ventures Private Limited, 112/2F4, Fairlands, 3rd Cross Street, Fairlands, Salem, Tamil Nadu 636016.', 'குறைதீர் அலுவலர்: nagaraj@startnet.in, அல்லது அஞ்சல் முகவரி: StartNet Ventures Private Limited, 112/2F4, Fairlands, 3rd Cross Street, Fairlands, Salem, Tamil Nadu 636016.')}
                </li>
              </ul>
              <div className="gov-actions">
                <Button to="/legal/privacy" variant="tertiary">{t('Read our privacy notice', 'எங்கள் தனியுரிமை அறிவிப்பைப் படியுங்கள்')}</Button>
              </div>
            </Block>

            <Block id="structure" n={6} title={t('Structure', 'அமைப்பு')}>
              {/* Tablet and up: a two-column table. Phones: the same rows as a stacked list (the table cell was too narrow). */}
              <div className="gov-table-wrap">
                <table className="gov-table">
                  <caption className="visually-hidden">{t('StartNet legal entities and their roles', 'StartNet சட்ட அமைப்புகளும் அவற்றின் பங்குகளும்')}</caption>
                  <thead>
                    <tr><th scope="col">{t('Entity', 'அமைப்பு')}</th><th scope="col">{t('Role', 'பங்கு')}</th></tr>
                  </thead>
                  <tbody>
                    {ents.map((e, i) => (
                      <tr key={i}><th scope="row">{e.name}</th><td>{e.role}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <dl className="gov-entities" aria-label={t('StartNet legal entities and their roles', 'StartNet சட்ட அமைப்புகளும் அவற்றின் பங்குகளும்')}>
                {ents.map((e, i) => (
                  <div key={i} className="gov-entities__row">
                    <dt className="gov-entities__name">{e.name}</dt>
                    <dd className="gov-entities__role">{e.role}</dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block id="ethics" n={7} title={t('Conflicts and ethics', 'நலன் முரண்களும் அறநெறியும்')}>
              <p className="body-lg">
                {t('We keep a conflicts register for staff, advisers and council members.', 'பணியாளர்கள், ஆலோசகர்கள், குழு உறுப்பினர்களுக்கான நலன் முரண் பதிவேட்டைப் பராமரிக்கிறோம்.')}
              </p>
              <ul className="gov-policies">
                {/* Conflicts policy and POSH policy: add list items with their links when StartNet publishes them. */}
                <li>
                  <span>{t('ThinkTN related party', 'ThinkTN: தொடர்புடைய தரப்பு')}</span>{' '}
                  <Link to={localePath('/about/thinktn-alliance')} className="gov-textlink">{t('How we keep the firewall', 'தடுப்புச்சுவரை எப்படிக் காக்கிறோம்')}</Link>
                </li>
              </ul>
            </Block>
          </div>
        </div>
      </Section>

      <CTABand surface="night"
        title={t('The rules that sit behind every number.', 'ஒவ்வொரு எண்ணின் பின்னால் இருக்கும் விதிகள்.')}
        actions={
          <>
            <Button to="/about/evidence-standard" size="lg">{evidenceStandard}</Button>
            <Button to="/insights/founder-ledger" variant="secondary" size="lg">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}
