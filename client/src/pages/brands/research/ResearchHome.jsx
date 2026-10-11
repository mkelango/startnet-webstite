import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  Seo, BrandHero, Section, SectionHeader, Button, Card, Stat, Reveal, RevealGroup, ArtImage,
  ProgrammeCard, EventCard, EmptyState, Accordion, Skeleton, InlineMarks,
} from '../../../components';
import { useApi } from '../../../hooks/useApi';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink } from '../../../lib/links';
import ResearchProof from './components/ResearchProof';
import ResearchJourney from './components/ResearchJourney';
import FourParty from './components/FourParty';
import TermSheet from './components/TermSheet';
import ProblemList from './components/ProblemList';
import InterestForm from './components/InterestForm';
import {
  RESEARCH_HOME as C, LABS_PAGE, LABS, LAB_COMMITMENTS, LAB_STOPPING_RULE, LAB_STOPPING_RULE_TA, FELLOWSHIP, IPP, TERMS, WHO, FAQ_GROUPS,
  tr,
} from './researchContent';
import { itemListLd } from '../../../lib/seo.js';
import { isPlaceholderAnswer } from '../../../components/_placeholders.js';
import { ScrubText } from '../../../components/ScrubText.jsx';
import { cleanFaqLd, pageLd } from '../seoBits.js';
import '../brandPage.css';
import './ResearchHome.css';

/** Programmes listed on this brand home (ItemList JSON-LD). */
const RESEARCH_PROGRAMMES = [
  { name: 'StartNet Labs', path: '/research/labs' },
  { name: 'Scholar Founders Fellowship', path: '/research/fellowship' },
  { name: 'Lab-to-Market Summit', path: '/research/lab-to-market-summit' },
  { name: 'Institution Partner Programme', path: '/research/institution-partner-programme' },
];

/** Grid class for a list of n cards: never a lone orphan row (4 → 2x2/4-up, 2 → two, otherwise up to three). */
const gridFor = (n) => (n === 1 ? 'research-home__grid-1' : n === 2 ? 'grid grid-2' : n === 4 ? 'research-home__grid-4' : 'grid grid-3');

/** FAQ answers: strings stay strings (FAQPage JSON-LD); answers carrying [C]/[placeholder] marks render them as chips. */
const faqAnswer = (s) => (/\[[^\]]+\]/.test(s) ? <p><InlineMarks text={s} /></p> : s);

export default function ResearchHome() {
  const { lang, t, localePath } = useLang();
  const programmes = useApi('/api/programmes?brand=research');
  const events = useApi('/api/events?brand=research&when=upcoming');
  const progList = Array.isArray(programmes.data) ? programmes.data : [];
  const eventList = Array.isArray(events.data) ? events.data.slice(0, 3) : [];
  const fellowship = progList.find((p) => /fellowship/i.test(p.slug || ''));
  const applyHref = snxLink(fellowship?.snxPath || '/apply/scholar-founders-fellowship', { src: 'research-home', brand: 'research', lang });
  const commitHead = t('What every Lab commits to each year', 'ஒவ்வோர் ஆய்வகமும் ஆண்டுதோறும் உறுதியளிப்பவை');
  const commitSplit = commitHead.lastIndexOf(' ');

  return (
    <div className="research-home">
      <Seo
        title={tr(t, C, 'seoTitle')}
        titleTa={C.seoTitleTa}
        description={tr(t, C, 'meta')}
        descriptionTa={C.metaTa}
        jsonLd={[
          pageLd({ path: '/research', lang, name: tr(t, C, 'seoTitle'), description: tr(t, C, 'meta') }),
          itemListLd({ name: t('StartNet Research programmes', 'StartNet Research திட்டங்கள்'), items: RESEARCH_PROGRAMMES, lang }),
          // One FAQPage for the three groups below (three separate FAQPage blocks on one URL are flagged as
          // duplicates). Answers still carrying [placeholder] or [C] marks stay on the page but out of the markup.
          cleanFaqLd(FAQ_GROUPS.flatMap((g) => g.items.map((it) => ({ question: tr(t, it, 'question'), answer: tr(t, it, 'answer') })))),
        ]}
      />

      <BrandHero
        brand="research"
        title={tr(t, C, 'h1')}
        lede={tr(t, C, 'sub')}
        actions={
          <>
            <Button variant="brand" size="lg" href="#register-interest">{tr(t, C, 'ctaPrimary')}</Button>
            <Button variant="secondary" size="lg" to="/research/institution-partner-programme">{tr(t, C, 'ctaSecondary')}</Button>
          </>
        }
        art={{ variant: 'network', brand: 'research', ratio: '4/5', seed: 7, animate: true, alt: '' }}
      />

      {/* Proof band */}
      <Section surface="white" pad="sm" labelledBy="research-proof-title">
        <h2 id="research-proof-title" className="visually-hidden">{t('StartNet Research in figures', 'எண்களில் StartNet Research')}</h2>
        <ResearchProof />
      </Section>

      {/* How it works: the journey */}
      <Section labelledBy="research-journey">
        <SectionHeader
          eyebrow={t('How it works', 'இது எப்படிச் செயல்படுகிறது')}
          title={<span id="research-journey">{t('The journey', 'பயணம்')}</span>}
          lede={<ScrubText as="span">{t(
            'Six steps from a lab result to a company with customers. Tap a step to see where it happens.',
            'ஆய்வக முடிவிலிருந்து வாடிக்கையாளர்கள் உள்ள நிறுவனம் வரை ஆறு படிகள். ஒவ்வொரு படியும் எங்கே நடக்கிறது என்று பார்க்க அதைத் தொடுங்கள்.'
          )}</ScrubText>}
        />
        <div className="research-home__journey">
          <ResearchJourney />
        </div>
      </Section>

      {/* Labs venture studio */}
      <Section surface="white" labelledBy="research-labs">
        <SectionHeader
          eyebrow={t('StartNet Labs · venture studio', 'StartNet Labs · வென்ச்சர் ஸ்டுடியோ')}
          title={<span id="research-labs">{tr(t, LABS_PAGE, 'h1')}</span>}
          lede={tr(t, LABS_PAGE, 'sub')}
          action={<Button variant="tertiary" to="/research/labs">{t('Explore StartNet Labs', 'StartNet Labs-ஐப் பாருங்கள்')}</Button>}
        />
        <div className="research-home__commit">
          <p className="research-home__commit-head small">
            {/* The last word travels with "· targets" so the suffix never wraps onto a line of its own */}
            {commitSplit > 0 ? commitHead.slice(0, commitSplit + 1) : ''}
            <span className="research-home__nowrap">
              {commitSplit > 0 ? commitHead.slice(commitSplit + 1) : commitHead}{' '}
              <span className="muted">· {t('targets', 'இலக்குகள்')}</span>
            </span>
          </p>
          <RevealGroup className="research-home__commit-grid">
            {LAB_COMMITMENTS.map((m) => (
              <Stat
                key={m.id}
                value={m.value}
                label={tr(t, m, 'label')}
                tag="C"
                source={t('StartNet Research Lab charter (planning target)', 'StartNet Research ஆய்வக சாசனம் (திட்ட இலக்கு)')}
                note={t('Target per Lab per year', 'ஒவ்வோர் ஆய்வகத்துக்கும் ஆண்டு இலக்கு')}
                variant="compact"
              />
            ))}
          </RevealGroup>
          <p className="research-home__stop">
            <strong>{t('Stopping rule.', 'நிறுத்த விதி.')}</strong> {t(LAB_STOPPING_RULE, LAB_STOPPING_RULE_TA)}
          </p>
        </div>
        <RevealGroup className="research-home__labs">
          {LABS.map((lab) => (
            <Card
              key={lab.slug}
              to={`/research/labs#${lab.slug}`}
              brand="research"
              eyebrow={t('Wave 1 · Launching 2027', 'முதல் அலை · 2027-இல் தொடக்கம்')}
              title={lab.name}
              body={tr(t, lab, 'sub')}
              art={{ ...lab.art, brand: 'research', ratio: '3/2' }}
              cta={t('Lab details', 'ஆய்வக விவரங்கள்')}
            />
          ))}
        </RevealGroup>
      </Section>

      {/* Fellowship feature */}
      <Section labelledBy="research-fellowship">
        <div className="split research-home__fellow">
          <Reveal className="research-home__fellow-art">
            <ArtImage variant="ladder" brand="research" ratio="4/5" seed={19} alt="" />
          </Reveal>
          <Reveal className="research-home__fellow-copy">
            <p className="eyebrow">Scholar Founders Fellowship</p>
            <h2 id="research-fellowship" className="h1 research-home__fellow-title">{tr(t, FELLOWSHIP, 'h1')}</h2>
            <p className="body-lg text-2">{tr(t, FELLOWSHIP, 'body')}</p>
            <dl className="research-home__fellow-facts">
              <div><dt>{t('Length', 'காலம்')}</dt><dd>{t('7 weeks', '7 வாரங்கள்')}</dd></div>
              <div><dt>{t('Customer conversations', 'வாடிக்கையாளர் உரையாடல்கள்')}</dt><dd>{t('At least 100', 'குறைந்தது 100')}</dd></div>
              {/* Fee: hidden until StartNet publishes it (the seed text is a placeholder note). */}
            </dl>
            <div className="cluster research-home__actions">
              <Button variant="brand" href={applyHref}>{tr(t, FELLOWSHIP, 'cta')}</Button>
              <Button variant="tertiary" to="/research/fellowship">{t('About the Fellowship', 'Fellowship பற்றி')}</Button>
            </div>
            <p className="caption"><InlineMarks text={tr(t, FELLOWSHIP, 'micro')} /></p>
          </Reveal>
        </div>

        {programmes.loading && <div className="research-home__progs"><Skeleton height="16rem" count={2} /></div>}
        {progList.length > 0 && (
          <div className="research-home__progs">
            <h3 className="h4">{t('Open calls in StartNet Research', 'StartNet Research-இல் திறந்த அழைப்புகள்')}</h3>
            <RevealGroup className={gridFor(progList.length)}>
              {progList.map((p) => <ProgrammeCard key={p.slug} programme={p} />)}
            </RevealGroup>
          </div>
        )}
      </Section>

      {/* Four-party model + standard terms */}
      <Section surface="white" labelledBy="research-model">
        <SectionHeader
          eyebrow={t('The four-party model', 'நான்கு தரப்பு மாதிரி')}
          title={<span id="research-model">{t('Every company we help form has four parties with clear roles.', 'நாங்கள் உருவாக்க உதவும் ஒவ்வொரு நிறுவனத்திலும் தெளிவான பங்குகளுடன் நான்கு தரப்பினர்.')}</span>}
        />
        <FourParty />

        <div className="research-home__terms">
          <div className="research-home__terms-copy">
            <p className="eyebrow">{t('Standard terms', 'நிலையான விதிமுறைகள்')}</p>
            <h3 className="h2">{t('One set of terms, agreed once per institution.', 'ஒரே தொகுப்பு விதிமுறைகள், ஒவ்வொரு கல்வி நிறுவனத்துடனும் ஒரு முறை ஒப்புதல்.')}</h3>
            <p className="body-lg text-2">{tr(t, TERMS, 'intro')}</p>
            <Link className="research-home__more" to={localePath('/research/terms')}>
              {t('Read the standard terms', 'நிலையான விதிமுறைகளைப் படியுங்கள்')} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <TermSheet />
        </div>
      </Section>

      {/* Problem statements */}
      <Section labelledBy="research-problems">
        <SectionHeader
          eyebrow={t('Problem statements', 'சிக்கல் அறிக்கைகள்')}
          title={<span id="research-problems">{t('Start from a problem someone will pay to solve.', 'யாரோ பணம் கொடுத்துத் தீர்க்க விரும்பும் சிக்கலிலிருந்து தொடங்குங்கள்.')}</span>}
          lede={t(
            'Every Lab publishes problem statements co-signed by an industry, GCC or government sponsor. Until the first are signed, these are the areas each Lab works on.',
            'ஒவ்வோர் ஆய்வகமும் தொழில்துறை, GCC அல்லது அரசு ஸ்பான்சர் இணைக் கையொப்பமிட்ட சிக்கல் அறிக்கைகளை வெளியிடுகிறது. முதல் அறிக்கைகள் கையொப்பமாகும் வரை, ஒவ்வோர் ஆய்வகமும் பணியாற்றும் பகுதிகள் இவை.'
          )}
          action={<Button variant="tertiary" to="/research/problem-statements">{t('All problem statements', 'அனைத்துச் சிக்கல் அறிக்கைகளும்')}</Button>}
        />
        <ProblemList limit={6} />
      </Section>

      {/* Events */}
      <Section surface="white" labelledBy="research-events">
        <SectionHeader
          eyebrow={t('Events', 'நிகழ்வுகள்')}
          title={<span id="research-events">{t('Research events', 'Research நிகழ்வுகள்')}</span>}
          action={<Button variant="tertiary" to="/events?brand=research">{t('All Research events', 'அனைத்து Research நிகழ்வுகளும்')}</Button>}
        />
        {events.loading && <Skeleton height="18rem" count={1} />}
        {!events.loading && eventList.length === 1 && (
          /* One event: a full-width horizontal feature card, not a lone cell in a 3-column grid */
          <Reveal className="research-home__event-feature">
            <EventCard event={eventList[0]} />
          </Reveal>
        )}
        {!events.loading && eventList.length > 1 && (
          <RevealGroup className={`grid ${eventList.length === 2 ? 'grid-2' : 'grid-3'}`}>
            {eventList.map((e) => <EventCard key={e.slug} event={e} />)}
          </RevealGroup>
        )}
        {!events.loading && eventList.length === 0 && (
          <EmptyState
            title={t('No Research events are scheduled yet.', 'Research நிகழ்வுகள் எதுவும் இன்னும் திட்டமிடப்படவில்லை.')}
            action={<Button variant="secondary" to="/research/lab-to-market-summit">{t('About the Summit', 'Summit பற்றி')}</Button>}
          />
        )}
      </Section>

      {/* Who it's for / who pays */}
      <Section labelledBy="research-who">
        <SectionHeader
          eyebrow={t("Who it's for, who pays", 'யாருக்கானது, யார் செலுத்துகிறார்கள்')}
          title={<span id="research-who">{t('Every party gets something it needs.', 'ஒவ்வொரு தரப்புக்கும் தேவையானது கிடைக்கிறது.')}</span>}
        />
        <RevealGroup as="ul" className="research-home__who">
          {WHO.map((w) => (
            <li key={w.id} className="research-home__who-item">
              <h3 className="h5">{tr(t, w, 'who')}</h3>
              <p className="text-2">{tr(t, w, 'gets')}</p>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Institution CTA — the page's one Night band */}
      <Section surface="night" brand="research" labelledBy="research-ipp">
        <div className="split research-home__ipp">
          <Reveal>
            <p className="eyebrow">Institution Partner Programme</p>
            <h2 id="research-ipp" className="h1 research-home__ipp-title">{tr(t, IPP, 'h1')}</h2>
          </Reveal>
          <Reveal className="research-home__ipp-copy" delay={0.08}>
            <p className="body-lg">{tr(t, IPP, 'body')}</p>
            <div className="research-home__ipp-stat">
              <Stat
                value={5}
                prefix="₹"
                unit={t('L a year', ' லட்சம் / ஆண்டு')}
                label={t('Indicative price, from, by size', 'தோராயக் கட்டணம், அளவைப் பொறுத்து, இதிலிருந்து')}
                tag="C"
                source={t('StartNet rate card (indicative)', 'StartNet கட்டண அட்டவணை (தோராயம்)')}
                note={t('Ex-GST. Indicative until the published rate card replaces it.', 'GST நீங்கலாக. வெளியிடப்படும் கட்டண அட்டவணை வரும் வரை தோராயமானது.')}
                variant="compact"
                countUp={false}
              />
            </div>
            <div className="cluster research-home__actions">
              <Button variant="inverse" to="/partner/enquire?type=institution&ref=research-ipp">{tr(t, IPP, 'cta')}</Button>
              <Button variant="tertiary" to="/research/institution-partner-programme">{t('How the programme works', 'இந்தத் திட்டம் எப்படிச் செயல்படுகிறது')}</Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section labelledBy="research-faq">
        <SectionHeader eyebrow={t('FAQ', 'அடிக்கடி கேட்கப்படும் கேள்விகள்')} title={<span id="research-faq">{t('Before you start', 'தொடங்கும் முன்')}</span>} />
        <div className="research-home__faq">
          {/* A question whose answer is still only a placeholder ("Fee: [placeholder — …]") is hidden; so is an emptied group. */}
          {FAQ_GROUPS.map((g) => ({ g, items: g.items.filter((it) => !isPlaceholderAnswer(tr(t, it, 'answer'))) }))
            .filter(({ items }) => items.length > 0)
            .map(({ g, items }) => (
              <div key={g.id} className="research-home__faq-group">
                <h3 className="h5 research-home__faq-title">{tr(t, g, 'title')}</h3>
                <Accordion
                  items={items.map((it) => ({ id: it.id, question: tr(t, it, 'question'), answer: faqAnswer(tr(t, it, 'answer')) }))}
                  headingLevel={4}
                />
              </div>
            ))}
        </div>
      </Section>

      {/* Register interest */}
      <Section surface="white" labelledBy="register-interest-title">
        <InterestForm
          title={<span id="register-interest-title">{tr(t, C, 'closingTitle')}</span>}
          body={t(
            "Tell us what your research does. We will point you to the right Lab, the next Fellowship cohort or a sponsor's problem statement.",
            'உங்கள் ஆய்வு என்ன செய்கிறது என்று சொல்லுங்கள். சரியான ஆய்வகம், அடுத்த Fellowship குழு அல்லது ஒரு ஸ்பான்சரின் சிக்கல் அறிக்கையை நோக்கி உங்களை வழிநடத்துவோம்.'
          )}
          source="research-home"
        />
      </Section>
    </div>
  );
}
