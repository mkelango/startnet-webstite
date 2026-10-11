// /research/labs/:lab — individual StartNet Lab (Wave 1: agentic-ai, ontology-knowledge, physical-ai, drug-discovery).
// Template: Book 1 Part B T03 Programme (T18 Lab-detail variant: charter table + problem-statement list).
// Copy: Book 2 §3.1.1 "Individual Lab page template" and the Lab sub-head table, used verbatim.
// Renders inside BrandLayout brand="research" (data-brand + sub-nav come from the layout).
import { useParams } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, SectionHeader, Button, Badge, Stat, KeyFacts, Card, CTABand,
  Reveal, RevealGroup, Placeholder, SmartForm, WhatsAppButton, Dot,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink } from '../../../lib/links.js';
import NotFound from '../../utility/NotFound.jsx';
import {
  LABS, LAB_STATUS, LAB_CHARTER, LAB_WHO, LAB_GET, LAB_COMMITMENTS, LAB_COMMIT_SOURCE, LAB_STOPPING_RULE,
  LABS_WAVE2, LABS_WAVE2_NOTE,
} from './brandSubData.js';
import { useTp } from './BrandSubParts.jsx';
import '../../brands/brandPage.css';
import './BrandSubParts.css';
import './ResearchLab.css';
import { pageLd } from '../../brands/seoBits.js';

const DATE_PH = '[date placeholder]';

export default function ResearchLab({ lab: labProp }) {
  const params = useParams();
  const slug = labProp || params.lab;
  const lab = LABS.find((l) => l.slug === slug);
  if (!lab) return <NotFound />;
  return <LabPage lab={lab} />;
}

function LabPage({ lab }) {
  const { t, lang } = useLang();
  const tp = useTp();
  const others = LABS.filter((l) => l.slug !== lab.slug);
  const sponsorTo = `/partner/enquire?type=gcc&ref=research-lab-${lab.slug}`;
  const formId = `lab-${lab.slug}-interest`;

  return (
    <div className="research-lab">
      <Seo
        title={t(lab.seo, lab.seoTa)}
        titleTa={lab.seoTa}
        description={t(lab.meta, lab.metaTa)}
        descriptionTa={lab.metaTa}
        jsonLd={pageLd({ path: `/research/labs/${lab.slug}`, lang, name: lab.name, description: t(lab.meta, lab.metaTa) })}
      />

      <div className="bp-crumbs" data-surface="night">
        <div className="container bsub-crumbs">
          <Breadcrumbs
            items={[
              { label: 'StartNet Research', to: '/research' },
              { label: 'StartNet Labs', to: '/research/labs' },
              { label: lab.name },
            ]}
          />
        </div>
      </div>

      <BrandHero
        brand="research"
        compact
        title={`${lab.name}.`}
        lede={tp(lab.sub)}
        art={{ ...lab.art, brand: 'research', ratio: '4/5', alt: '' }}
        meta={
          <div className="cluster research-lab__hero-meta">
            <Badge kind="status" status="upcoming">{tp(LAB_STATUS)}</Badge>
            <Badge kind="type">{t('Wave 1', 'அலை 1')}</Badge>
          </div>
        }
        actions={
          <>
            <Button variant="brand" href="#register-interest">{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</Button>
            <Button variant="secondary" to={sponsorTo}>{t('Sponsor this Lab', 'இந்த ஆய்வகத்திற்கு ஆதரவளியுங்கள்')}</Button>
          </>
        }
      />

      <Section pad="default">
        <div className="split split--8-4 research-lab__layout">
          <div className="research-lab__main">
            {/* Status / charter (Book 2: host, spokes, sponsors, director — all placeholders until confirmed) */}
            <section className="research-lab__block" aria-labelledby="lab-charter-title">
              <Reveal>
                <p className="eyebrow">{t('Lab charter', 'ஆய்வக சாசனம்')}</p>
                <h2 id="lab-charter-title" className="h3 research-lab__title">
                  {t('A network, not a building', 'ஒரு கட்டடம் அல்ல, ஒரு வலையமைப்பு')}<Dot />
                </h2>
              </Reveal>
              <p className="research-lab__lede">
                {t(
                  'Each Lab has a host institution, three to five partner institutions, one or two industry sponsors, a faculty Lab Director and a StartNet venture lead.',
                  'ஒவ்வொரு ஆய்வகத்திலும் ஒரு தலைமை நிறுவனம், மூன்று முதல் ஐந்து கூட்டாளர் நிறுவனங்கள், ஒன்று அல்லது இரண்டு தொழில்துறை ஆதரவாளர்கள், ஒரு பேராசிரிய ஆய்வக இயக்குநர், ஒரு StartNet முயற்சித் தலைவர் இருப்பார்கள்.'
                )}
              </p>
              <div className="research-lab__table-wrap" role="region" aria-labelledby="lab-charter-title" tabIndex={0}>
                <table className="research-lab__table">
                  <caption className="visually-hidden">{t(`${lab.name} charter`, `${lab.name} சாசனம்`)}</caption>
                  <thead>
                    <tr>
                      <th scope="col">{t('Role', 'பங்கு')}</th>
                      <th scope="col">{t('What it is', 'விவரம்')}</th>
                      {/* "Confirmed" column hidden while every row is still a placeholder. */}
                    </tr>
                  </thead>
                  <tbody>
                    {LAB_CHARTER.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">{tp(row.label)}</th>
                        <td data-label={t('What it is', 'விவரம்')}>{tp(row.note)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Problems we work on */}
            <section className="research-lab__block" aria-labelledby="lab-problems-title">
              <Reveal>
                <p className="eyebrow">{t('Problems we work on', 'நாங்கள் பணியாற்றும் சிக்கல்கள்')}</p>
                <h2 id="lab-problems-title" className="h3 research-lab__title">
                  {t('Focus areas, waiting for a sponsor', 'கவனப் பகுதிகள், ஆதரவாளருக்காகக் காத்திருக்கின்றன')}<Dot />
                </h2>
              </Reveal>
              <p className="research-lab__lede">
                {t(
                  'Each problem statement is co-signed by an industry, GCC or government sponsor. Until they are signed, these are the Lab’s focus areas.',
                  'ஒவ்வொரு சிக்கல் அறிக்கையும் தொழில்துறை, GCC அல்லது அரசு ஆதரவாளரால் இணைக் கையொப்பமிடப்படும். அவை கையொப்பமாகும் வரை, இவை இந்த ஆய்வகத்தின் கவனப் பகுதிகள்.'
                )}
              </p>
              <RevealGroup as="ul" className="research-lab__problems" role="list">
                {lab.focus.map((f, i) => (
                  <li key={f[0]} className="research-lab__problem">
                    <span className="research-lab__problem-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <div className="research-lab__problem-body">
                      <h3 className="h5">{tp(f)}</h3>
                      {/* "Sponsor: [placeholder]" hidden until a sponsor signs. */}
                    </div>
                    <Badge kind="status" status="upcoming">{t('Opening soon', 'விரைவில் திறக்கும்')}</Badge>
                  </li>
                ))}
              </RevealGroup>
              {/* "Problem statements open [date]" hidden until the date is supplied. */}
              <Button variant="tertiary" to={`/research/problem-statements?sector=${lab.slug}`} icon={ArrowRight}>
                {t('See all problem statements', 'அனைத்துச் சிக்கல் அறிக்கைகளையும் பாருங்கள்')}
              </Button>
            </section>

            {/* Who should apply / what you get */}
            <section className="research-lab__block" aria-labelledby="lab-who-title">
              <Reveal>
                <p className="eyebrow">{t('Who should apply', 'யார் விண்ணப்பிக்கலாம்')}</p>
                <h2 id="lab-who-title" className="h3 research-lab__title">
                  {t('Built for researchers who want a customer', 'வாடிக்கையாளரைத் தேடும் ஆய்வாளர்களுக்காக')}<Dot />
                </h2>
              </Reveal>
              <p className="body-lg research-lab__who">{tp(LAB_WHO)}.</p>
              <h3 className="h5 research-lab__sub">{t('What you get', 'உங்களுக்குக் கிடைப்பவை')}</h3>
              <ul className="research-lab__ticks">
                {LAB_GET.map((g) => (
                  <li key={g[0]}>
                    <Check size={18} aria-hidden="true" className="research-lab__tick" />
                    <span>{tp(g)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="research-lab__aside">
            <KeyFacts
              title={t('Key facts', 'முக்கிய விவரங்கள்')}
              items={[
                { label: t('Status', 'நிலை'), value: tp(LAB_STATUS) },
                { label: t('Host institution', 'தலைமை நிறுவனம்'), value: <Placeholder>[placeholder]</Placeholder> },
                { label: t('Industry sponsors', 'தொழில்துறை ஆதரவாளர்கள்'), value: <Placeholder>[placeholder]</Placeholder> },
                { label: t('Lab Director', 'ஆய்வக இயக்குநர்'), value: <Placeholder>[placeholder]</Placeholder> },
                { label: t('Problem statements', 'சிக்கல் அறிக்கைகள்'), value: <Placeholder>{DATE_PH}</Placeholder> },
                { label: t('Route in', 'சேரும் வழி'), value: 'Scholar Founders Fellowship' },
              ]}
              action={
                <div className="research-lab__aside-actions">
                  <Button variant="brand" full href="#register-interest">{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</Button>
                  <Button variant="tertiary" href={snxLink('/signup', { src: `research-lab-${lab.slug}`, brand: 'research', lang, intent: 'lab', lab: lab.slug })}>
                    {t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </Section>

      {/* The one Night band: the Lab's yearly commitments (targets, tag C) and the stopping rule. */}
      <Section surface="night" labelledBy="lab-commit-title">
        <SectionHeader
          eyebrow={t('Targets · per Lab, per year', 'இலக்குகள் · ஒவ்வொரு ஆய்வகமும், ஒவ்வோர் ஆண்டும்')}
          id="lab-commit-title"
          title={t('What every Lab commits to each year.', 'ஒவ்வோர் ஆய்வகமும் ஆண்டுதோறும் உறுதியளிப்பவை.')}
        />
        <dl className="research-lab__stats">
          {LAB_COMMITMENTS.map((m) => (
            <Stat
              key={m.id}
              dl
              value={m.value}
              label={tp(m.label)}
              tag="C"
              asAt="2026-10-01"
              source={t(LAB_COMMIT_SOURCE, 'StartNet Labs சாசனம் (இலக்குகள்)')}
              note={t('Target per Lab per year', 'ஒவ்வொரு ஆய்வகத்திற்கும் ஆண்டு இலக்கு')}
            />
          ))}
        </dl>
        <p className="research-lab__rule">
          <strong>{t('Stopping rule.', 'நிறுத்த விதி.')}</strong> {tp(LAB_STOPPING_RULE)}
        </p>
      </Section>

      {/* Register interest (SmartForm type "interest", lab carried in the payload) */}
      <Section surface="white" id="register-interest" labelledBy={`${formId}-title`}>
        <div className="research-lab__form-grid">
          <Reveal className="research-lab__form-intro">
            <p className="eyebrow">{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</p>
            <h2 id={`${formId}-title`} className="h2">
              {t(`Register interest in the ${lab.name}`, `${lab.name}-இல் ஆர்வத்தைப் பதிவு செய்யுங்கள்`)}<Dot />
            </h2>
            <p className="body-lg text-2">
              {t(
                'Tell us about your research. We will reply with the host institution and the problem statements as soon as they are confirmed.',
                'உங்கள் ஆய்வைப் பற்றிச் சொல்லுங்கள். தலைமை நிறுவனமும் சிக்கல் அறிக்கைகளும் உறுதியானவுடன் உங்களுக்குப் பதில் அனுப்புவோம்.'
              )}
            </p>
            <div className="research-lab__wa">
              <p className="small muted">{t('Prefer to talk first?', 'முதலில் பேச விரும்புகிறீர்களா?')}</p>
              <WhatsAppButton
                text={t(
                  `Hi StartNet Research, I'd like to talk about the ${lab.name}.`,
                  `வணக்கம் StartNet Research, ${lab.name} பற்றிப் பேச விரும்புகிறேன்.`
                )}
                refCode={`research-lab-${lab.slug}`}
                label={t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
              />
            </div>
          </Reveal>
          <div className="research-lab__form form-card">
            <SmartForm
              type="interest"
              fields={[
                { id: `${formId}-name`, name: 'name', label: t('Full name', 'முழுப் பெயர்'), type: 'text', required: true, autoComplete: 'name' },
                { id: `${formId}-email`, name: 'email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', width: 'half' },
                { id: `${formId}-phone`, name: 'phone', label: t('Mobile number', 'கைபேசி எண்'), type: 'tel', hint: t('Optional, unless you want WhatsApp updates. We only use it to reply.', 'WhatsApp தகவல்கள் வேண்டுமென்றால் மட்டும் தேவை. பதில் அளிக்க மட்டுமே பயன்படுத்துவோம்.'), autoComplete: 'tel-national', width: 'half' },
                {
                  id: `${formId}-role`, name: 'role', label: t('I am a', 'நான்'), type: 'select', required: true, width: 'half',
                  options: [
                    { value: '', label: t('Choose one', 'ஒன்றைத் தேர்ந்தெடுக்கவும்') },
                    { value: 'phd-scholar', label: t('PhD scholar', 'PhD ஆய்வாளர்') },
                    { value: 'post-doc', label: t('Post-doc', 'முதுமுனைவர் ஆய்வாளர்') },
                    { value: 'faculty', label: t('Faculty', 'பேராசிரியர்') },
                    { value: 'masters', label: t("Final-year master's student", 'இறுதியாண்டு முதுநிலை மாணவர்') },
                    { value: 'institution', label: t('Institution', 'கல்வி நிறுவனம்') },
                    { value: 'industry', label: t('GCC or industry', 'GCC அல்லது தொழில்துறை') },
                  ],
                },
                { id: `${formId}-org`, name: 'organisation', label: t('Institution or organisation', 'நிறுவனம் அல்லது அமைப்பு'), type: 'text', autoComplete: 'organization', width: 'half' },
                { id: `${formId}-message`, name: 'message', label: t('Your research, in a few lines', 'உங்கள் ஆய்வு, சில வரிகளில்'), type: 'textarea', hint: t('What does it do, and whose problem could it solve?', 'அது என்ன செய்கிறது, யாருடைய சிக்கலைத் தீர்க்கக்கூடும்?') },
              ]}
              consents={[
                { purpose: 'contact', label: t('StartNet may contact me about this Lab.', 'இந்த ஆய்வகம் குறித்து StartNet என்னைத் தொடர்பு கொள்ளலாம்.'), required: true },
                { purpose: 'whatsapp_updates', label: t('Send me StartNet Research updates on WhatsApp. I can stop them any time.', 'StartNet Research தகவல்களை WhatsApp-இல் அனுப்புங்கள். எப்போது வேண்டுமானாலும் நிறுத்தலாம்.') },
              ]}
              submitLabel={t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}
              successTitle={t('Thanks. We have your details.', 'நன்றி. உங்கள் விவரங்கள் கிடைத்தன.')}
              successBody={
                <p>
                  {/* The "Dates: [placeholder]" clause is left out until the dates are supplied. */}
                  {t(
                    `We will tell you when the ${lab.name} confirms its host institution and problem statements.`,
                    `${lab.name} தனது தலைமை நிறுவனத்தையும் சிக்கல் அறிக்கைகளையும் உறுதி செய்ததும் உங்களுக்குத் தெரிவிப்போம்.`
                  )}
                </p>
              }
              hidden={{ brand: 'research', lab: lab.slug, programme: `lab-${lab.slug}`, source: `research-lab-${lab.slug}` }}
            />
          </div>
        </div>
      </Section>

      {/* Sponsor this Lab */}
      <Section surface="paper" labelledBy="lab-sponsor-title">
        <div className="research-lab__sponsor" id="sponsor">
          <p className="eyebrow">{t('Lab sponsorship', 'ஆய்வக ஆதரவு')}</p>
          <h2 id="lab-sponsor-title" className="h3">{t('Sponsor this Lab', 'இந்த ஆய்வகத்திற்கு ஆதரவளியுங்கள்')}<Dot /></h2>
          <p>
            {t(
              'The sponsor brings the problem, funds the proof of concept and can become the first customer.',
              'ஆதரவாளர் சிக்கலைக் கொண்டு வருகிறார், proof of concept-க்கு நிதியளிக்கிறார், முதல் வாடிக்கையாளராகவும் ஆகலாம்.'
            )}
          </p>
          <div className="cluster">
            <Button variant="brand" to={sponsorTo}>{t('Talk to us about sponsoring', 'ஆதரவளிப்பது குறித்து எங்களிடம் பேசுங்கள்')}</Button>
            <Button variant="tertiary" to="/research/terms" icon={ArrowRight}>{t('See the standard terms', 'நிலையான விதிமுறைகளைப் பாருங்கள்')}</Button>
          </div>
        </div>
      </Section>

      {/* Other Wave 1 Labs + Wave 2 (proposed) */}
      <Section surface="paper" pad="sm" labelledBy="lab-others-title">
        <SectionHeader
          eyebrow={t('Wave 1 · 2027', 'அலை 1 · 2027')}
          id="lab-others-title"
          title={t('The other Labs', 'மற்ற ஆய்வகங்கள்')}
          action={<Button variant="tertiary" to="/research/labs" icon={ArrowRight}>{t('All StartNet Labs', 'அனைத்து StartNet Labs')}</Button>}
        />
        <RevealGroup as="ul" className="research-lab__others" role="list">
          {others.map((o) => (
            <li key={o.slug}>
              <Card
                to={`/research/labs/${o.slug}`}
                brand="research"
                eyebrow={tp(LAB_STATUS)}
                title={o.name}
                body={tp(o.sub)}
                art={{ ...o.art, brand: 'research', ratio: '16/9' }}
              />
            </li>
          ))}
        </RevealGroup>

        <div className="research-lab__wave2">
          <h3 className="h5">{t('Wave 2 · 2028 · proposed', 'அலை 2 · 2028 · முன்மொழிவு')}</h3>
          <ul className="research-lab__wave2-list" role="list">
            {LABS_WAVE2.map((w) => (
              <li key={w[0]} className="research-lab__wave2-card" aria-disabled="true">
                <span className="research-lab__wave2-name">{tp(w)}</span>
                <span className="caption">{t('Proposed', 'முன்மொழிவு')}</span>
              </li>
            ))}
          </ul>
          <p className="research-lab__note">{tp(LABS_WAVE2_NOTE)}</p>
          <Button variant="tertiary" to="/partner/enquire?type=institution&ref=research-lab-host" icon={ArrowRight}>
            {t('Suggest a host', 'ஒரு தலைமை நிறுவனத்தைப் பரிந்துரையுங்கள்')}
          </Button>
        </div>
      </Section>

      <CTABand
        surface="paper"
        className="brand-close"
        brand="research"
        title={t('Research pointed at a customer.', 'வாடிக்கையாளரை நோக்கிய ஆய்வு.')}
        body={t(
          'Start with the Scholar Founders Fellowship: a 7-week sprint and 100 customer interviews.',
          'Scholar Founders Fellowship-இலிருந்து தொடங்குங்கள்: 7 வார ஸ்பிரின்ட், 100 வாடிக்கையாளர் நேர்காணல்கள்.'
        )}
        actions={
          <>
            <Button variant="brand" to="/research/fellowship">{t('Apply to the Fellowship', 'Fellowship-க்கு விண்ணப்பியுங்கள்')}</Button>
            <Button variant="tertiary" to="/research" icon={ArrowRight}>{t('StartNet Research', 'StartNet Research')}</Button>
          </>
        }
      />
    </div>
  );
}
