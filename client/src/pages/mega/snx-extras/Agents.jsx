// StartNet X · AI agents and guardrails (T19 standard page, P3). URL: /startnet-x/agents (brand 'x').
// Copy: Book 1 Part B §2.2 ("Seven agents, humans decide", CTA "Read guardrails"), Book 2 §7.1 (Agents module line,
// status rule), §7.3 (plan rows), §2.6 sections 3–4 (AI guardrails, your data). Agents ship with SNX v2 (Book 1 §2.2/§12).
import { ArrowRight, Bot, Compass, Users, Landmark, ShieldCheck, MessagesSquare } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, SectionHeader, Button, Badge, Stat, Steps, Accordion,
  Reveal, RevealGroup, CTABand, Dot,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxPageLd } from '../../snx/snxSeo.js';
import { snxLink } from '../../../lib/links.js';
import { XStatus, OnThisPage } from './SnxxParts.jsx';
import './Agents.css';
import '../../utility/restKit.css';

export default function Agents() {
  const { t, lang } = useLang(); // Button `to` is localised by the kit (localePath).

  const agents = [
    {
      id: 'coach',
      icon: Compass,
      name: 'Founder Coach',
      body: t(
        'Suggests what to do next on your founder journey, from the profile that remembers what you have done.',
        'நீங்கள் செய்தவற்றை நினைவில் வைத்திருக்கும் உங்கள் சுயவிவரத்திலிருந்து, நிறுவனர் பயணத்தில் அடுத்து என்ன செய்யலாம் என்று பரிந்துரைக்கிறது.'
      ),
      plan: t('Founder Coach (lite) in SNX Free', 'SNX Free-இல் Founder Coach (lite)'),
    },
    {
      id: 'matchmaker',
      icon: Users,
      name: 'Matchmaker',
      body: t(
        'Suggests co-founders and mentors to talk to. You choose whom to meet.',
        'பேசக்கூடிய இணை நிறுவனர்களையும் வழிகாட்டிகளையும் பரிந்துரைக்கிறது. யாரைச் சந்திப்பது என்பதை நீங்களே தேர்வு செய்கிறீர்கள்.'
      ),
      plan: t('Co-founder and mentor Matchmaker in SNX Pro', 'SNX Pro-இல் இணை நிறுவனர், வழிகாட்டி Matchmaker'),
    },
    {
      id: 'grants',
      icon: Landmark,
      name: 'Grant Navigator',
      body: t(
        'Helps with grant applications: which schemes may fit and what to prepare. The grant body still decides.',
        'மானிய விண்ணப்பங்களுக்கு உதவுகிறது: எந்தத் திட்டங்கள் பொருந்தலாம், என்ன தயார் செய்ய வேண்டும். முடிவை மானியம் வழங்கும் அமைப்பே எடுக்கும்.'
      ),
      plan: t('Grant Navigator in SNX Pro', 'SNX Pro-இல் Grant Navigator'),
    },
  ];

  const guardrails = [
    {
      head: t('No automated rejection.', 'தானியங்கி நிராகரிப்பு இல்லை.'),
      body: t(
        'Every selection, funding or exclusion decision is made by a named person.',
        'தேர்வு, நிதி அல்லது விலக்கு தொடர்பான ஒவ்வொரு முடிவையும் பெயர் குறிப்பிடப்பட்ட ஒருவரே எடுக்கிறார்.'
      ),
    },
    {
      head: t('Bias audits each quarter', 'ஒவ்வொரு காலாண்டும் சார்பு தணிக்கை'),
      body: t(
        'by gender, district, language and college tier, published in our self-diagnosis.',
        'பாலினம், மாவட்டம், மொழி, கல்லூரி நிலை வாரியாக; முடிவுகள் எங்கள் சுய மதிப்பீட்டு அறிக்கையில் வெளியிடப்படும்.'
      ),
    },
    {
      head: t('Every agent answer cites its source,', 'ஒவ்வொரு முகவர் பதிலும் அதன் மூலத்தைக் குறிப்பிடும்;'),
      body: t('and figures keep their tag.', 'எண்கள் தங்கள் A/B/C குறியீட்டுடனே இருக்கும்.'),
    },
    {
      head: t('Agents are tested in Tamil and English', 'முகவர்கள் தமிழிலும் ஆங்கிலத்திலும் சோதிக்கப்படுகின்றன'),
      body: t('before they go live.', 'நேரலைக்கு வருவதற்கு முன்பே.'),
    },
  ];

  const loop = [
    {
      title: t('The agent suggests', 'முகவர் பரிந்துரைக்கிறது'),
      body: t(
        'It points to a next step, a person to meet or a scheme to look at. It does not decide for you.',
        'அடுத்த படி, சந்திக்க வேண்டிய நபர் அல்லது பார்க்க வேண்டிய திட்டத்தைச் சுட்டிக்காட்டுகிறது. உங்களுக்காக அது முடிவு செய்யாது.'
      ),
      icon: Bot,
    },
    {
      title: t('It shows its source', 'அது மூலத்தைக் காட்டுகிறது'),
      body: t(
        'Every answer cites where it came from, and any figure keeps its A, B or C tag.',
        'ஒவ்வொரு பதிலும் எங்கிருந்து வந்தது என்று குறிப்பிடும்; எந்த எண்ணும் தன் A, B அல்லது C குறியீட்டுடன் இருக்கும்.'
      ),
      icon: MessagesSquare,
    },
    {
      title: t('A person decides', 'ஒரு மனிதர் முடிவு செய்கிறார்'),
      body: t(
        'You decide what to act on. Any selection, funding or exclusion decision is made by a named person.',
        'எதைச் செயல்படுத்துவது என்பதை நீங்கள் முடிவு செய்கிறீர்கள். தேர்வு, நிதி அல்லது விலக்கு முடிவுகளைப் பெயர் குறிப்பிடப்பட்ட ஒருவரே எடுக்கிறார்.'
      ),
      icon: Users,
    },
    {
      title: t('Every share is logged', 'ஒவ்வொரு பகிர்வும் பதிவு செய்யப்படுகிறது'),
      body: t(
        'Your profile goes to an investor, GCC or institution only if you opt in, and every share is logged.',
        'நீங்கள் ஒப்புக்கொண்டால் மட்டுமே உங்கள் சுயவிவரம் முதலீட்டாளர், GCC அல்லது கல்வி நிறுவனத்துடன் பகிரப்படும்; ஒவ்வொரு பகிர்வும் பதிவு செய்யப்படும்.'
      ),
      icon: ShieldCheck,
    },
  ];

  const data = [
    {
      title: t('Your rights under the DPDP Act', 'DPDP சட்டத்தின் கீழ் உங்கள் உரிமைகள்'),
      body: t(
        'We follow the Digital Personal Data Protection Act, 2023. You can access, correct or erase your data, and withdraw consent at any time.',
        'டிஜிட்டல் தனிநபர் தரவுப் பாதுகாப்புச் சட்டம், 2023-ஐ நாங்கள் பின்பற்றுகிறோம். உங்கள் தரவைப் பார்க்கலாம், திருத்தலாம், அழிக்கலாம்; எப்போது வேண்டுமானாலும் ஒப்புதலைத் திரும்பப் பெறலாம்.'
      ),
    },
    {
      title: t('Stored in India', 'இந்தியாவில் சேமிப்பு'),
      body: t(
        'Your data is stored in India, encrypted in transit and at rest.',
        'உங்கள் தரவு இந்தியாவில் சேமிக்கப்படுகிறது; பரிமாற்றத்திலும் சேமிப்பிலும் மறையாக்கம் செய்யப்படுகிறது.'
      ),
    },
    {
      title: t('Never sold', 'ஒருபோதும் விற்கப்படாது'),
      body: t(
        'We never sell personal data. Sharing happens only if you opt in.',
        'தனிநபர் தரவை நாங்கள் ஒருபோதும் விற்பதில்லை. நீங்கள் ஒப்புக்கொண்டால் மட்டுமே பகிர்வு.'
      ),
    },
    {
      title: t('Under 18', '18 வயதுக்குக் கீழ்'),
      body: t(
        'For anyone under 18, we ask for verifiable consent from a parent or guardian.',
        '18 வயதுக்குக் குறைவானவர்களுக்கு, பெற்றோர் அல்லது பாதுகாவலரின் சரிபார்க்கக்கூடிய ஒப்புதலைக் கேட்கிறோம்.'
      ),
    },
  ];

  const faq = [
    {
      id: 'reject',
      question: t('Can an agent reject my application?', 'ஒரு முகவர் என் விண்ணப்பத்தை நிராகரிக்க முடியுமா?'),
      answer: t(
        'No. There is no automated rejection. Every selection, funding or exclusion decision is made by a named person.',
        'இல்லை. தானியங்கி நிராகரிப்பு இல்லை. தேர்வு, நிதி அல்லது விலக்கு தொடர்பான ஒவ்வொரு முடிவையும் பெயர் குறிப்பிடப்பட்ட ஒருவரே எடுக்கிறார்.'
      ),
    },
    {
      id: 'when',
      question: t('When can I use the agents?', 'முகவர்களை எப்போது பயன்படுத்தலாம்?'),
      answer: t(
        'Agents arrive with SNX v2, a later release of StartNet X. Until then this page shows them as coming, never as live. Release dates will be posted on the updates page.',
        'முகவர்கள் StartNet X-இன் அடுத்த வெளியீடான SNX v2-உடன் வரும். அதுவரை இந்தப் பக்கம் அவற்றை "வரும்" என்றே காட்டும், ஒருபோதும் "நேரலையில்" என்று காட்டாது. வெளியீட்டுத் தேதிகள் புதுப்பிப்புகள் பக்கத்தில் வெளியிடப்படும்.'
      ),
    },
    {
      id: 'tamil',
      question: t('Will the agents work in Tamil?', 'முகவர்கள் தமிழில் செயல்படுமா?'),
      answer: t(
        'Agents are tested in Tamil and English before they go live.',
        'நேரலைக்கு வருவதற்கு முன் முகவர்கள் தமிழிலும் ஆங்கிலத்திலும் சோதிக்கப்படுகின்றன.'
      ),
    },
    {
      id: 'sell',
      question: t('Do you sell my data?', 'என் தரவை விற்கிறீர்களா?'),
      answer: t('No.', 'இல்லை.'),
    },
  ];

  const toc = [
    { id: 'what-agents-do', label: t('What agents do', 'முகவர்கள் என்ன செய்கின்றன') },
    { id: 'guardrails', label: t('Guardrails', 'பாதுகாப்பு வரம்புகள்') },
    { id: 'human-in-the-loop', label: t('People decide', 'மனிதர்களே முடிவு செய்கிறார்கள்') },
    { id: 'your-data', label: t('Your data', 'உங்கள் தரவு') },
    { id: 'questions', label: t('Questions', 'கேள்விகள்') },
  ];

  return (
    <div className="snx-agents">
      <Seo
        jsonLd={snxPageLd({ path: '/startnet-x/agents', lang })}
        // SEO-TA: pending native review
        title={t('StartNet X AI agents: Founder Coach, Grant Navigator', 'StartNet X AI முகவர்கள்: Founder Coach, Grant Navigator')}
        description={t(
          'StartNet X agents suggest; people decide. A Founder Coach, Matchmaker and Grant Navigator, with sources on every answer and your data kept in India.',
          'StartNet X முகவர்கள் பரிந்துரைக்கின்றன; மனிதர்கள் முடிவு செய்கிறார்கள். தானியங்கி நிராகரிப்பு இல்லை, ஒவ்வொரு பதிலிலும் மூலம், உங்கள் தரவு இந்தியாவிலேயே.'
        )}
      />
      {/* Crumbs sit on the ink band, part of the header + hero (AngelList family). */}
      <div className="snx-agents__crumbs-band" data-surface="night">
        <div className="container snx-agents__crumbs">
          <Breadcrumbs items={[{ label: 'StartNet X', to: '/startnet-x' }, { label: t('AI agents', 'AI முகவர்கள்') }]} />
        </div>
      </div>

      <BrandHero
        brand="x"
        compact
        title={t('Agents suggest. People decide.', 'முகவர்கள் பரிந்துரைக்கின்றன. மனிதர்கள் முடிவு செய்கிறார்கள்.')}
        lede={t(
          'StartNet X uses AI agents to help with coaching, matching, grant applications and operations. People make the decisions.',
          'பயிற்சி, பொருத்தம் காணுதல், மானிய விண்ணப்பங்கள், செயல்பாடுகள் ஆகியவற்றில் உதவ StartNet X, AI முகவர்களைப் பயன்படுத்துகிறது. முடிவுகளை மனிதர்களே எடுக்கிறார்கள்.'
        )}
        meta={<XStatus status="coming" release="SNX v2" />}
        actions={
          <>
            <Button href="#guardrails">{t('Read the guardrails', 'பாதுகாப்பு வரம்புகளைப் படியுங்கள்')}</Button>
            <Button variant="tertiary" to="/startnet-x/trust">{t('Trust, privacy & security', 'நம்பிக்கை, தனியுரிமை, பாதுகாப்பு')}</Button>
          </>
        }
      />

      <Section surface="paper" pad="sm">
        <OnThisPage items={toc} />
      </Section>

      {/* What agents do */}
      <Section surface="paper" id="what-agents-do" className="snx-agents__anchor">
        <div className="snx-agents__intro">
          <SectionHeader
            eyebrow={t('What agents do', 'முகவர்கள் என்ன செய்கின்றன')}
            title={
              <>
                {t('Help that suggests, never decides', 'முடிவெடுக்காமல், பரிந்துரைக்கும் உதவி')}
                <Dot />
              </>
            }
            lede={t(
              'An AI Founder Coach, Matchmaker and Grant Navigator that suggest; people decide.',
              'பரிந்துரைக்கும் AI Founder Coach, Matchmaker, Grant Navigator; முடிவை மனிதர்கள் எடுக்கிறார்கள்.'
            )}
          />
          <div className="snx-agents__count">
            <Stat
              value={7}
              label={t('AI agents planned for StartNet X', 'StartNet X-க்குத் திட்டமிடப்பட்ட AI முகவர்கள்')}
              tag="C"
              source={t('StartNet website plan, page inventory (StartNet X)', 'StartNet இணையதளத் திட்டம், பக்கப் பட்டியல் (StartNet X)')}
              note={t('Planning figure. Agents ship with SNX v2.', 'திட்டமிடல் எண்ணிக்கை. முகவர்கள் SNX v2-உடன் வரும்.')}
            />
          </div>
        </div>

        <RevealGroup className="snx-agents__grid">
          {agents.map(({ id, icon: Icon, name, body, plan }) => (
            <article key={id} className="snx-agents__card">
              <div className="snx-agents__card-top">
                <span className="snx-agents__icon" aria-hidden="true"><Icon size={24} strokeWidth={1.5} /></span>
                <XStatus status="coming" release="SNX v2" />
              </div>
              <h3 className="h4 snx-agents__name" lang="en">{name}</h3>
              <p className="text-2">{body}</p>
              <div className="snx-agents__plan">
                <Badge kind="type">{plan}</Badge>
              </div>
            </article>
          ))}
          <article className="snx-agents__card snx-agents__card--more">
            <div className="snx-agents__card-top">
              <span className="snx-agents__icon" aria-hidden="true"><Bot size={24} strokeWidth={1.5} /></span>
              <XStatus status="coming" release="SNX v2" />
            </div>
            <h3 className="h4 snx-agents__name">{t('The other agents', 'மற்ற முகவர்கள்')}</h3>
            <p className="text-2">
              {t(
                'Further agents help the StartNet team with operations, under the same guardrails.',
                'அதே பாதுகாப்பு வரம்புகளின் கீழ், கூடுதல் முகவர்கள் StartNet குழுவுக்குச் செயல்பாடுகளில் உதவுகின்றன.'
              )}
            </p>
            {/* Names and scope of the remaining agents: hidden until StartNet supplies them. */}
          </article>
        </RevealGroup>

        <p className="snx-agents__plans-link">
          <Button variant="tertiary" to="/startnet-x/pricing" icon={ArrowRight}>
            {t('See which plan includes which agent', 'எந்தத் திட்டத்தில் எந்த முகவர் என்று பாருங்கள்')}
          </Button>
        </p>
      </Section>

      {/* Guardrails: the page's one Night band */}
      <Section surface="night" brand="x" id="guardrails" className="snx-agents__anchor">
        <div className="snx-agents__guard">
          <Reveal className="snx-agents__guard-intro">
            <span className="snx-agents__guard-icon" aria-hidden="true"><ShieldCheck size={20} strokeWidth={1.5} /></span>
            <p className="eyebrow">{t('AI guardrails', 'AI பாதுகாப்பு வரம்புகள்')}</p>
            <h2 className="h2">
              {t('People make the decisions', 'முடிவுகளை மனிதர்களே எடுக்கிறார்கள்')}
              <Dot />
            </h2>
            <p className="body-lg snx-agents__guard-lede">
              {t(
                'These four rules apply to every StartNet X agent, before and after it goes live.',
                'இந்த நான்கு விதிகள் ஒவ்வொரு StartNet X முகவருக்கும், நேரலைக்கு முன்னும் பின்னும் பொருந்தும்.'
              )}
            </p>
            <Button variant="inverse" to="/about/governance" icon={ArrowRight}>
              {t('How we keep ourselves honest', 'நாங்கள் எப்படி நேர்மையாக இருக்கிறோம்')}
            </Button>
          </Reveal>
          <RevealGroup as="ol" className="snx-agents__guard-list">
            {guardrails.map((g, i) => (
              <li key={i} className="snx-agents__guard-item">
                <span className="snx-agents__guard-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <p>
                  <strong>{g.head}</strong> {g.body}
                </p>
              </li>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Human in the loop */}
      <Section surface="white" id="human-in-the-loop" className="snx-agents__anchor">
        <SectionHeader
          eyebrow={t('Human in the loop', 'மனிதக் கண்காணிப்பு')}
          title={
            <>
              {t('How a suggestion becomes a decision', 'ஒரு பரிந்துரை எப்படி முடிவாகிறது')}
              <Dot />
            </>
          }
          lede={t(
            'Agents work inside your SNX profile. Each step below stays in your control.',
            'முகவர்கள் உங்கள் SNX சுயவிவரத்துக்குள் செயல்படுகின்றன. கீழே உள்ள ஒவ்வொரு படியும் உங்கள் கட்டுப்பாட்டில்.'
          )}
        />
        <div className="snx-agents__steps">
          <Steps steps={loop} label={t('From suggestion to decision', 'பரிந்துரையிலிருந்து முடிவு வரை')} />
        </div>
      </Section>

      {/* DPDP posture */}
      <Section surface="paper" id="your-data" className="snx-agents__anchor">
        <div className="snx-agents__data">
          <div className="snx-agents__data-intro">
            <p className="eyebrow">{t('Your data', 'உங்கள் தரவு')}</p>
            <h2 className="h2">
              {t('Your data stays in India', 'உங்கள் தரவு இந்தியாவிலேயே இருக்கும்')}
              <Dot />
            </h2>
            <p className="body-lg text-2">
              {t(
                'You choose who sees your profile. No automated rejections, ever.',
                'உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே தேர்வு செய்கிறீர்கள். தானியங்கி நிராகரிப்பு ஒருபோதும் இல்லை.'
              )}
            </p>
            <div className="cluster">
              <Button to="/legal/data-rights" icon={ArrowRight}>{t('Use your data rights', 'உங்கள் தரவு உரிமைகளைப் பயன்படுத்துங்கள்')}</Button>
              <Button variant="tertiary" to="/legal/privacy" icon={ArrowRight}>{t('Read our privacy notice', 'எங்கள் தனியுரிமை அறிவிப்பைப் படியுங்கள்')}</Button>
            </div>
          </div>
          <RevealGroup as="ul" className="snx-agents__data-list">
            {data.map((d) => (
              <li key={d.title} className="snx-agents__data-item">
                <h3 className="h5">{d.title}</h3>
                <p className="text-2">{d.body}</p>
              </li>
            ))}
          </RevealGroup>
        </div>
        <div className="snx-agents__grievance">
          <h3 className="h5">{t('Grievance officer', 'குறைதீர் அலுவலர்')}</h3>
          <p><a href="mailto:nagaraj@startnet.in">nagaraj@startnet.in</a></p>
          <p>
            <Button variant="tertiary" to="/legal/grievance" icon={ArrowRight}>
              {t('How to raise a grievance', 'குறையை எப்படித் தெரிவிப்பது')}
            </Button>
          </p>
        </div>
      </Section>

      {/* Questions */}
      <Section surface="white" id="questions" className="snx-agents__anchor rk-faq">
        <div className="rk-faq__grid">
          <SectionHeader
            eyebrow={t('Questions', 'கேள்விகள்')}
            title={t('About the agents', 'முகவர்கள் பற்றி')}
          />
          <div className="rk-faq__body">
            <div className="snx-agents__faq">
              <Accordion items={faq} faq />
            </div>
            <p className="snx-agents__updates">
              <Button variant="tertiary" to="/startnet-x/updates" icon={ArrowRight}>
                {t('Follow StartNet X updates', 'StartNet X புதுப்பிப்புகளைப் பின்தொடருங்கள்')}
              </Button>
            </p>
          </div>
        </div>
      </Section>

      <CTABand
        surface="paper"
        brand="x"
        title={t('One profile, from first event to first funding.', 'முதல் நிகழ்விலிருந்து முதல் நிதி வரை, ஒரே சுயவிவரம்.')}
        body={t(
          'Free for individuals. Works on your phone, on WhatsApp and in Tamil.',
          'தனிநபர்களுக்கு இலவசம். உங்கள் கைபேசியிலும், WhatsApp-இலும், தமிழிலும் செயல்படும்.'
        )}
        actions={
          <>
            <Button href={snxLink('/signup', { src: 'snx-agents', brand: 'x', lang })}>
              {t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}
            </Button>
            <Button variant="secondary" to="/startnet-x/modules">{t('See all modules', 'அனைத்து தொகுதிகளையும் பாருங்கள்')}</Button>
          </>
        }
      />
    </div>
  );
}
