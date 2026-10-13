import { useParams } from 'react-router-dom';
import { Check, Presentation, FileSignature, LineChart } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, Button, Badge, TagChip, Stat, KeyFacts, Steps, CTABand,
  ArtImage, Reveal, RevealGroup, ProgrammeCard, EventCard, Placeholder,
} from '../../../components';
import { useApi } from '../../../hooks/useApi';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links';
import { usePageCta } from '../../../layout/shell.jsx';
import NotFound from '../../utility/NotFound.jsx';
import TermSheet from './components/TermSheet';
import ProblemList from './components/ProblemList';
import InterestForm from './components/InterestForm';
import {
  LABS_PAGE, LABS, LABS_WAVE2, LABS_WAVE2_NOTE, LABS_WAVE2_NOTE_TA, LAB_COMMITMENTS, LAB_STOPPING_RULE, LAB_STOPPING_RULE_TA,
  LAB_WHO, LAB_WHO_TA, LAB_GET, LAB_GET_TA, FELLOWSHIP, SUMMIT, IPP, TERMS, PARTIES, PH_SHORT_TA, PH_DATE_TA, tr,
} from './researchContent';
import { courseLd, itemListLd } from '../../../lib/seo.js';
import { pageLd } from '../seoBits.js';
import '../brandPage.css';
import './ResearchSub.css';

const WA_TEXT = "Hi StartNet Research, I'd like to talk to the Research team.";
const IPP_ENQUIRE = '/partner/enquire?type=institution&ref=research-ipp';

/* ---------- Shared T03 shell: compact brand hero, 8/4 body with sticky key facts, closing CTA ---------- */
function SubShell({ seo, crumb, title, lede, heroMeta, actions, facts, factsTitle, factsAction, children, after }) {
  const { t } = useLang();
  return (
    <div className="research-sub">
      <Seo title={seo.title} titleTa={seo.titleTa} description={seo.description} descriptionTa={seo.descriptionTa} noindex={seo.noindex} jsonLd={seo.jsonLd} />
      <div className="bp-crumbs" data-surface="night">
        <div className="container research-sub__crumbs">
          <Breadcrumbs items={[{ label: 'StartNet Research', to: '/research' }, { label: crumb }]} />
        </div>
      </div>
      <BrandHero brand="research" compact title={title} lede={lede} meta={heroMeta} actions={actions} />
      <Section pad="default">
        <div className="split split--8-4 research-sub__layout">
          <div className="research-sub__main">{children}</div>
          {/* KeyFacts renders its own labelled <aside>; this wrapper only handles stickiness (no duplicate landmark). */}
          <div className="research-sub__aside">
            <KeyFacts title={factsTitle || t('Key facts', 'முக்கிய விவரங்கள்')} items={facts} action={factsAction} />
          </div>
        </div>
      </Section>
      {after}
    </div>
  );
}

/** Build the Seo props for the current language (title/description resolved, Tamil also passed through). */
function useSeo(obj, path, extraLd = []) {
  const { t, lang } = useLang();
  const title = t(obj.seoTitle, obj.seoTitleTa);
  const description = t(obj.meta, obj.metaTa);
  return {
    title,
    titleTa: obj.seoTitleTa,
    description,
    descriptionTa: obj.metaTa,
    jsonLd: [pageLd({ path, lang, name: title, description }), ...[].concat(extraLd)],
  };
}

function Block({ id, eyebrow, title, children }) {
  return (
    <section className="research-sub__block" aria-labelledby={id}>
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="h3 research-sub__block-title">{title}</h2>
      </Reveal>
      <div className="research-sub__block-body">{children}</div>
    </section>
  );
}

function Ticks({ items }) {
  return (
    <ul className="research-sub__ticks">
      {items.map((it, i) => (
        <li key={typeof it === 'string' ? it : i}>
          <Check size={18} aria-hidden="true" className="research-sub__tick" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function usePh() {
  const { t } = useLang();
  return {
    ph: (text) => <Placeholder>{text || t('[placeholder]', PH_SHORT_TA)}</Placeholder>,
    phDate: () => <Placeholder>{t('[date placeholder]', PH_DATE_TA)}</Placeholder>,
  };
}

function InterestSection({ title, body, source }) {
  return (
    <Section surface="white" labelledBy={`${source}-interest-title`}>
      <InterestForm title={<span id={`${source}-interest-title`}>{title}</span>} body={body} source={source} />
    </Section>
  );
}

/* ---------- /research/labs ---------- */
function Labs() {
  const { t } = useLang();
  const { lang } = useLang();
  const seo = useSeo(LABS_PAGE, '/research/labs', [
    itemListLd({ name: 'StartNet Labs', items: LABS.map((l) => ({ name: l.name, path: `/research/labs/${l.slug}` })), lang }),
  ]);
  const register = t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்');
  return (
    <SubShell
      seo={seo}
      crumb="StartNet Labs"
      title={tr(t, LABS_PAGE, 'h1')}
      lede={tr(t, LABS_PAGE, 'sub')}
      heroMeta={<Badge kind="status" status="upcoming">{t('Wave 1 launches 2027', 'முதல் அலை 2027-இல் தொடங்குகிறது')}</Badge>}
      actions={
        <>
          <Button variant="brand" href="#register-interest">{register}</Button>
          <Button variant="secondary" to="/partner/enquire?type=gcc&ref=research-labs">{t('Sponsor a Lab', 'ஓர் ஆய்வகத்துக்கு ஸ்பான்சர் செய்யுங்கள்')}</Button>
        </>
      }
      facts={[
        { label: t('Wave 1', 'முதல் அலை'), value: t('Four Labs, launching 2027', 'நான்கு ஆய்வகங்கள், 2027-இல் தொடக்கம்') },
        { label: t('Each Lab', 'ஒவ்வோர் ஆய்வகமும்'), value: t('A host institution and three to five partner institutions', 'ஒரு தலைமைக் கல்வி நிறுவனம், மூன்று முதல் ஐந்து கூட்டாளர் கல்வி நிறுவனங்கள்') },
        { label: t('Sponsors', 'ஸ்பான்சர்கள்'), value: t('One or two industry sponsors per Lab', 'ஒவ்வோர் ஆய்வகத்துக்கும் ஒன்று அல்லது இரண்டு தொழில்துறை ஸ்பான்சர்கள்') },
        { label: t('Leadership', 'தலைமை'), value: t('A faculty Lab Director and a StartNet venture lead', 'ஒரு பேராசிரியர் ஆய்வக இயக்குநர், ஒரு StartNet வென்ச்சர் பொறுப்பாளர்') },
        { label: t('Who should apply', 'யார் விண்ணப்பிக்கலாம்'), value: t(LAB_WHO, LAB_WHO_TA) },
        { label: t('Stopping rule', 'நிறுத்த விதி'), value: t('24 months without a company: the Lab closes or pivots', '24 மாதங்களில் நிறுவனம் இல்லையென்றால்: ஆய்வகம் மூடப்படும் அல்லது திசை மாறும்') },
      ]}
      factsAction={<Button variant="brand" full href="#register-interest">{register}</Button>}
      after={
        <InterestSection
          title={t('Register interest in a Lab.', 'ஓர் ஆய்வகத்தில் சேர ஆர்வத்தைப் பதிவு செய்யுங்கள்.')}
          body={t(
            'Tell us which Lab fits your research. We will reply with the host institution and problem statements as soon as they are confirmed.',
            'உங்கள் ஆய்வுக்குப் பொருந்தும் ஆய்வகம் எது என்று சொல்லுங்கள். தலைமைக் கல்வி நிறுவனமும் சிக்கல் அறிக்கைகளும் உறுதியானதும் உங்களுக்குப் பதில் அனுப்புவோம்.'
          )}
          source="research-labs"
        />
      }
    >
      <nav className="research-sub__jump" aria-label={t('Labs on this page', 'இந்தப் பக்கத்தில் உள்ள ஆய்வகங்கள்')}>
        {LABS.map((l) => <a key={l.slug} href={`#${l.slug}`} className="chip research-sub__jump-chip">{l.name}</a>)}
      </nav>

      <Block id="labs-commit" eyebrow={<>{t('Targets', 'இலக்குகள்')} <TagChip tag="C" short /></>} title={t('What every Lab commits to each year', 'ஒவ்வோர் ஆய்வகமும் ஆண்டுதோறும் உறுதியளிப்பவை')}>
        <div className="research-sub__stats">
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
        </div>
        <p className="research-sub__note"><strong>{t('Stopping rule.', 'நிறுத்த விதி.')}</strong> {t(LAB_STOPPING_RULE, LAB_STOPPING_RULE_TA)}</p>
      </Block>

      <Block id="labs-wave1" eyebrow={t('Wave 1 · 2027', 'முதல் அலை · 2027')} title={t('Four Labs, one standard', 'நான்கு ஆய்வகங்கள், ஒரே தரம்')}>
        <div className="research-sub__labs">
          {LABS.map((lab) => (
            <article key={lab.slug} id={lab.slug} className="research-sub__lab" aria-labelledby={`${lab.slug}-title`}>
              <div className="research-sub__lab-art">
                <ArtImage {...lab.art} brand="research" ratio="1/1" alt="" />
              </div>
              <div className="research-sub__lab-body">
                <Badge kind="status" status="upcoming">{t('Launching 2027', '2027-இல் தொடக்கம்')}</Badge>
                <h3 id={`${lab.slug}-title`} className="h4">{lab.name}</h3>
                <p className="text-2">{tr(t, lab, 'sub')}</p>
                {/* Host, spokes, sponsors, Lab Director and the problem-statement date are hidden until StartNet supplies them. */}
                <details className="research-sub__lab-more">
                  <summary>{t('Who should apply and what you get', 'யார் விண்ணப்பிக்கலாம், என்ன கிடைக்கும்')}</summary>
                  <p><strong>{t('Who should apply:', 'யார் விண்ணப்பிக்கலாம்:')}</strong> {t(LAB_WHO, LAB_WHO_TA)}.</p>
                  <p><strong>{t('What you get:', 'உங்களுக்குக் கிடைப்பவை:')}</strong> {t(LAB_GET, LAB_GET_TA)}.</p>
                </details>
                <div className="cluster research-sub__lab-actions">
                  <Button variant="brand" size="sm" href="#register-interest">{register}</Button>
                  <Button variant="secondary" size="sm" to={`/partner/enquire?type=gcc&ref=research-lab-${lab.slug}`}>{t('Sponsor this Lab', 'இந்த ஆய்வகத்துக்கு ஸ்பான்சர் செய்யுங்கள்')}</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Block>

      <section id="sponsor" className="research-sub__sponsor" aria-labelledby="labs-sponsor-title">
        <p className="eyebrow">{t('Lab sponsorship', 'ஆய்வக ஸ்பான்சர்ஷிப்')}</p>
        <h2 id="labs-sponsor-title" className="h4">{t('Sponsor a Lab', 'ஓர் ஆய்வகத்துக்கு ஸ்பான்சர் செய்யுங்கள்')}</h2>
        <p>{t(
          'Each Lab has one or two industry, Global Capability Centre (GCC) or government sponsors. The sponsor brings the problem, funds the proof of concept and can become the first customer.',
          'ஒவ்வோர் ஆய்வகத்துக்கும் ஒன்று அல்லது இரண்டு தொழில்துறை, உலகளாவிய திறன் மையம் (GCC) அல்லது அரசு ஸ்பான்சர்கள் உண்டு. ஸ்பான்சர் சிக்கலைக் கொண்டு வருகிறார், கருத்துச் சான்றுக்கு நிதியளிக்கிறார், முதல் வாடிக்கையாளராகவும் ஆகலாம்.'
        )}</p>
        <Button variant="secondary" to="/partner/enquire?type=gcc&ref=research-labs-sponsor">{t('Talk to us about sponsoring a Lab', 'ஆய்வக ஸ்பான்சர்ஷிப் பற்றி எங்களிடம் பேசுங்கள்')}</Button>
      </section>

      <Block id="labs-wave2" eyebrow={t('Wave 2 · 2028 · proposed', 'இரண்டாம் அலை · 2028 · முன்மொழிவு')} title={t('Proposed next', 'அடுத்து முன்மொழியப்பட்டவை')}>
        <ul className="research-sub__wave2">
          {LABS_WAVE2.map((name) => (
            <li key={name} className="research-sub__wave2-card" aria-disabled="true">
              <span className="research-sub__wave2-name">{name}</span>
              <span className="caption">{t('Proposed', 'முன்மொழியப்பட்டது')}</span>
            </li>
          ))}
        </ul>
        <p className="research-sub__note">{t(LABS_WAVE2_NOTE, LABS_WAVE2_NOTE_TA)}</p>
        <Button variant="tertiary" to="/partner/enquire?type=institution&ref=research-lab-host">{t('Suggest a host', 'தலைமை நிறுவனத்தைப் பரிந்துரையுங்கள்')}</Button>
      </Block>
    </SubShell>
  );
}

/* ---------- /research/fellowship ---------- */
function Fellowship() {
  const { t, lang } = useLang();
  const { ph, phDate } = usePh();
  // Course (Book 1 §9.4). Fee is a placeholder and the teaching language is not stated, so neither is published.
  const seo = useSeo(FELLOWSHIP, '/research/fellowship', [
    {
      ...courseLd({
        name: 'Scholar Founders Fellowship',
        description: t(FELLOWSHIP.body, FELLOWSHIP.bodyTa),
        path: '/research/fellowship',
        lang,
        timeRequired: 'P7W',
      }),
      inLanguage: undefined,
    },
  ]);
  const { data } = useApi('/api/programmes?brand=research');
  const prog = Array.isArray(data) ? data.find((p) => /fellowship/i.test(p.slug || '')) : null;
  const applyHref = snxLink(prog?.snxPath || '/apply/scholar-founders-fellowship', { src: 'research-fellowship', brand: 'research', lang });
  const status = prog?.status || 'upcoming';
  const statusLabel = {
    open: t('Applications open', 'விண்ணப்பங்கள் திறந்துள்ளன'),
    closing: t('Closing soon', 'விரைவில் முடிகிறது'),
    upcoming: t('Next cohort opening', 'அடுத்த குழு விரைவில்'),
    rolling: t('Rolling applications', 'தொடர் விண்ணப்பங்கள்'),
    closed: t('Applications closed', 'விண்ணப்பங்கள் முடிந்தன'),
  }[status];
  const cta = tr(t, FELLOWSHIP, 'cta');
  const micro = tr(t, FELLOWSHIP, 'micro');

  // Bottom bar (< 1024px): the Fellowship's own Apply link.
  usePageCta({ label: FELLOWSHIP.cta, labelTa: FELLOWSHIP.ctaTa, shortLabel: 'Apply', shortLabelTa: 'விண்ணப்பியுங்கள்', href: applyHref, brand: 'research' });

  return (
    <SubShell
      seo={seo}
      crumb="Scholar Founders Fellowship"
      title={tr(t, FELLOWSHIP, 'h1')}
      lede={tr(t, FELLOWSHIP, 'body')}
      heroMeta={<Badge kind="status" status={status}>{statusLabel}</Badge>}
      actions={
        <>
          <Button variant="brand" href={applyHref}>{cta}</Button>
          <Button variant="secondary" href="#register-interest">{t('Get notified', 'அறிவிப்பைப் பெறுங்கள்')}</Button>
        </>
      }
      facts={[
        { label: t('Length', 'காலம்'), value: t('7 weeks', '7 வாரங்கள்') },
        { label: t('Customer conversations', 'வாடிக்கையாளர் உரையாடல்கள்'), value: t('At least 100', 'குறைந்தது 100') },
        { label: t('For', 'யாருக்கு'), value: t('PhD scholars, post-docs and faculty', 'முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்கள்') },
        { label: t('Fee', 'கட்டணம்'), value: ph(tr(t, FELLOWSHIP, 'fee')) },
        { label: t('Next cohort', 'அடுத்த குழு'), value: phDate() },
        { label: t('You leave with', 'நீங்கள் பெறுவது'), value: t('Evidence and a go/no-go decision', 'சான்றுகளும் தொடரலாமா வேண்டாமா என்ற முடிவும்') },
      ]}
      factsAction={<Button variant="brand" full href={applyHref}>{cta}</Button>}
      after={
        <>
          <CTABand
            surface="paper"
            brand="research"
            className="brand-close"
            title={cta}
            body={micro}
            actions={
              <>
                <Button variant="brand" href={applyHref}>{cta}</Button>
                <Button variant="whatsapp" href={waLink(WA_TEXT, 'research-fellowship')}>{t('Talk to the Research team', 'Research குழுவிடம் பேசுங்கள்')}</Button>
              </>
            }
          />
          <InterestSection title={t('Get notified when the next cohort opens.', 'அடுத்த குழு தொடங்கும்போது அறிவிப்பைப் பெறுங்கள்.')} body={micro} source="research-fellowship" />
        </>
      }
    >
      <Block id="fellow-how" eyebrow={t('How it works', 'இது எப்படிச் செயல்படுகிறது')} title={t('Seven weeks of structured customer discovery', 'ஏழு வாரக் கட்டமைக்கப்பட்ட வாடிக்கையாளர் கண்டறிதல்')}>
        <Steps
          variant="row"
          steps={[
            { title: t('Talk to at least 100 potential customers', 'குறைந்தது 100 சாத்தியமான வாடிக்கையாளர்களிடம் பேசுங்கள்'), body: t('100 conversations before a single rupee.', 'ஒரு ரூபாய் செலவழிக்கும் முன் 100 உரையாடல்கள்.') },
            { title: t('Test the problem', 'சிக்கலைச் சோதியுங்கள்'), body: t('Find out whether your research solves a problem someone will pay for.', 'யாரோ பணம் கொடுத்துத் தீர்க்க விரும்பும் சிக்கலை உங்கள் ஆய்வு தீர்க்கிறதா என்று கண்டறியுங்கள்.') },
            { title: t('Decide', 'முடிவு செய்யுங்கள்'), body: t('Finish with evidence and a go/no-go decision.', 'சான்றுகளுடனும் தொடரலாமா வேண்டாமா என்ற முடிவுடனும் நிறைவு செய்யுங்கள்.') },
          ]}
        />
      </Block>

      <Block id="fellow-who" eyebrow={t("Who it's for", 'யாருக்கானது')} title={t('Who should apply', 'யார் விண்ணப்பிக்கலாம்')}>
        <p className="body-lg text-2">{t(LAB_WHO, LAB_WHO_TA)}.</p>
      </Block>

      <Block id="fellow-get" eyebrow={t('What you get', 'உங்களுக்குக் கிடைப்பவை')} title={t('What a Fellow gets', 'Fellowship உறுப்பினருக்குக் கிடைப்பவை')}>
        <Ticks
          items={[
            t('A place in the Scholar Founders Fellowship', 'Scholar Founders Fellowship-இல் ஓர் இடம்'),
            t('Mentors from industry', 'தொழில்துறை வழிகாட்டிகள்'),
            t('A funded proof of concept if selected', 'தேர்வானால் நிதியளிக்கப்பட்ட கருத்துச் சான்று'),
            t('Help with grants', 'மானியங்களுக்கான உதவி'),
            t('Standard terms if you form a company', 'நிறுவனம் தொடங்கினால் நிலையான விதிமுறைகள்'),
          ]}
        />
      </Block>

      {prog && (
        <Block id="fellow-call" eyebrow={t('Open call', 'திறந்த அழைப்பு')} title={t('This cohort', 'இந்தக் குழு')}>
          <ProgrammeCard programme={prog} />
        </Block>
      )}
    </SubShell>
  );
}

/* ---------- /research/lab-to-market-summit ---------- */
function Summit() {
  const { t } = useLang();
  const { ph } = usePh();
  const seo = useSeo(SUMMIT, '/research/lab-to-market-summit');
  const { data } = useApi('/api/events?brand=research');
  // Lab-to-Market editions only: other Research summits (e.g. the NIRF Higher Ed Summit 2024) are not editions of it.
  const editions = Array.isArray(data) ? data.filter((e) => /lab-to-market/i.test(`${e.series || ''} ${e.slug || ''}`)) : [];
  const register = t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்');
  return (
    <SubShell
      seo={seo}
      crumb="Lab-to-Market Summit"
      title={tr(t, SUMMIT, 'h1')}
      lede={tr(t, SUMMIT, 'body')}
      heroMeta={<Badge kind="status" status="upcoming">{t('Annual · date to be announced', 'ஆண்டுதோறும் · தேதி அறிவிக்கப்படும்')}</Badge>}
      actions={
        <>
          <Button variant="brand" href="#register-interest">{register}</Button>
          <Button variant="secondary" to="/partner/enquire?type=sponsor&ref=research-summit">{t('Sponsor the Summit', 'Summit-க்கு ஸ்பான்சர் செய்யுங்கள்')}</Button>
        </>
      }
      facts={[
        { label: t('Date', 'தேதி'), value: ph() },
        { label: t('Venue', 'இடம்'), value: ph() },
        { label: t('Co-host', 'இணை நடத்துநர்'), value: ph() },
        { label: t('Who is in the room', 'யார் பங்கேற்பார்கள்'), value: t('Lab teams, GCCs, investors and government', 'ஆய்வகக் குழுக்கள், GCC-கள், முதலீட்டாளர்கள், அரசு') },
        { label: t('Frequency', 'எத்தனை முறை'), value: t('Annual', 'ஆண்டுக்கு ஒருமுறை') },
      ]}
      factsAction={<Button variant="brand" full href="#register-interest">{register}</Button>}
      after={
        <InterestSection
          title={t('Register interest in the Lab-to-Market Summit.', 'Lab-to-Market Summit-இல் பங்கேற்க ஆர்வத்தைப் பதிவு செய்யுங்கள்.')}
          body={t('We will tell you as soon as the date, venue and co-host are confirmed.', 'தேதி, இடம், இணை நடத்துநர் உறுதியானதும் உங்களுக்குத் தெரிவிப்போம்.')}
          source="research-summit"
        />
      }
    >
      <Block id="summit-day" eyebrow={t('On the day', 'அன்றைய நாளில்')} title={t('What happens at the Summit', 'Summit-இல் என்ன நடக்கும்')}>
        <RevealGroup as="ul" className="research-sub__moments">
          {[
            { id: 'demo', icon: Presentation, text: t('Lab teams demo to GCCs, investors and government', 'ஆய்வகக் குழுக்கள் GCC-கள், முதலீட்டாளர்கள், அரசு முன் செயல்விளக்கம் அளிக்கின்றன') },
            { id: 'ps', icon: FileSignature, text: t('Sponsors post next year’s problem statements', 'ஸ்பான்சர்கள் அடுத்த ஆண்டின் சிக்கல் அறிக்கைகளை வெளியிடுகின்றனர்') },
            { id: 'index', icon: LineChart, text: t('We launch the TN Research Commercialisation Index', 'TN Research Commercialisation Index-ஐ நாங்கள் வெளியிடுகிறோம்') },
          ].map(({ id, icon: Icon, text }) => (
            <li key={id} className="research-sub__moment">
              <Icon size={28} aria-hidden="true" className="research-sub__moment-icon" />
              <p className="h5">{text}</p>
            </li>
          ))}
        </RevealGroup>
        {/* "Date, venue and co-host: [placeholder]" is hidden until StartNet supplies them. */}
      </Block>

      {editions.length > 0 && (
        <Block id="summit-editions" eyebrow={t('Editions', 'பதிப்புகள்')} title={t('Upcoming and past editions', 'வரவிருக்கும் மற்றும் முந்தைய பதிப்புகள்')}>
          <div className="grid grid-2">{editions.map((e) => <EventCard key={e.slug} event={e} />)}</div>
        </Block>
      )}
    </SubShell>
  );
}

/* ---------- /research/institution-partner-programme ---------- */
function Institutions() {
  const { t } = useLang();
  const seo = useSeo(IPP, '/research/institution-partner-programme');
  const inst = PARTIES.find((p) => p.id === 'institution');
  const cta = tr(t, IPP, 'cta');
  const talk = t('Talk to the Research team', 'Research குழுவிடம் பேசுங்கள்');

  // Bottom bar (< 1024px): book a consultation, not the generic Research CTA.
  usePageCta({ label: IPP.cta, labelTa: IPP.ctaTa, shortLabel: 'Book a consultation', shortLabelTa: 'ஆலோசனை பதிவு', to: IPP_ENQUIRE, brand: 'research' });

  return (
    <SubShell
      seo={seo}
      crumb="Institution Partner Programme"
      title={tr(t, IPP, 'h1')}
      lede={tr(t, IPP, 'body')}
      actions={
        <>
          <Button variant="brand" to={IPP_ENQUIRE}>{cta}</Button>
          <Button variant="whatsapp" href={waLink(WA_TEXT, 'research-ipp')}>{talk}</Button>
        </>
      }
      facts={[
        { label: t('For', 'யாருக்கு'), value: t('Universities and colleges', 'பல்கலைக்கழகங்களும் கல்லூரிகளும்') },
        { label: t('Term', 'காலம்'), value: t('Annual package', 'ஆண்டுத் தொகுப்பு') },
        {
          label: t('Indicative price', 'தோராயக் கட்டணம்'),
          value: (
            <Stat
              value={5}
              prefix="₹"
              unit={t('L a year', ' லட்சம் / ஆண்டு')}
              label={t('From, by size', 'அளவைப் பொறுத்து, இதிலிருந்து')}
              tag="C"
              source={t('StartNet rate card (indicative)', 'StartNet கட்டண அட்டவணை (தோராயம்)')}
              note={t('Ex-GST. Indicative until the published rate card replaces it.', 'GST நீங்கலாக. வெளியிடப்படும் கட்டண அட்டவணை வரும் வரை தோராயமானது.')}
              variant="compact"
              countUp={false}
            />
          ),
        },
        { label: t('Policy alignment', 'கொள்கை இணக்கம்'), value: t("AICTE's innovation and startup policy", 'AICTE-இன் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கை') },
      ]}
      factsAction={<Button variant="brand" full to={IPP_ENQUIRE}>{cta}</Button>}
      after={
        <CTABand
          surface="paper"
          brand="research"
          className="brand-close"
          title={t('Founder outcomes you can report, not workshops you have to justify.', 'நியாயப்படுத்த வேண்டிய பட்டறைகள் அல்ல, அறிக்கையிடக்கூடிய நிறுவனர் விளைவுகள்.')}
          actions={
            <>
              <Button variant="brand" to={IPP_ENQUIRE}>{cta}</Button>
              <Button variant="tertiary" to="/partner/institutions">{t('Partner with us as an institution', 'கல்வி நிறுவனமாக எங்களுடன் கூட்டு சேருங்கள்')}</Button>
            </>
          }
        />
      }
    >
      <Block id="ipp-package" eyebrow={t('One annual package', 'ஒரே ஆண்டுத் தொகுப்பு')} title={t('What the programme includes', 'இந்தத் திட்டத்தில் அடங்குபவை')}>
        <Ticks items={t(IPP.includes, IPP.includesTa)} />
      </Block>
      <Block id="ipp-role" eyebrow={t('In the four-party model', 'நான்கு தரப்பு மாதிரியில்')} title={t("The institution's role", 'கல்வி நிறுவனத்தின் பங்கு')}>
        <p className="body-lg text-2">{tr(t, inst, 'body')}</p>
        <p className="text-2">{t('Institutions get spinouts, patents and innovation metrics.', 'கல்வி நிறுவனங்களுக்கு ஆய்விலிருந்து பிறக்கும் நிறுவனங்கள், காப்புரிமைகள், புத்தாக்க அளவீடுகள் கிடைக்கின்றன.')}</p>
      </Block>
      <Block id="ipp-terms" eyebrow={t('Standard terms', 'நிலையான விதிமுறைகள்')} title={t('Agreed once, not company by company', 'ஒவ்வொரு நிறுவனத்துக்கும் அல்ல, ஒரு முறை ஒப்புதல்')}>
        <p className="text-2">
          {tr(t, TERMS, 'intro')} {t("Ranges for the institution's stake: 5–10%", 'கல்வி நிறுவனத்தின் பங்கு வரம்பு: 5–10%')} <TagChip tag="C" />.{' '}
          {t('Final terms follow each institution’s IP policy.', 'இறுதி விதிமுறைகள் ஒவ்வொரு கல்வி நிறுவனத்தின் IP கொள்கையைப் பின்பற்றும்.')}
        </p>
        <Button variant="tertiary" to="/research/terms">{t('Read the standard terms', 'நிலையான விதிமுறைகளைப் படியுங்கள்')}</Button>
      </Block>
    </SubShell>
  );
}

/* ---------- /research/problem-statements ---------- */
function Problems() {
  const { t } = useLang();
  const post = t('Post a problem statement', 'சிக்கல் அறிக்கையை வெளியிடுங்கள்');
  // SEO: primary "industry research problem statements". SEO-TA: pending native review
  const seo = useSeo(
    {
      seoTitle: 'Research problem statements from industry',
      seoTitleTa: 'தொழில்துறையின் ஆய்வுச் சிக்கல் அறிக்கைகள்',
      meta: 'Sponsor-co-signed problem statements from StartNet Labs by sector, status and institution. Form a team and build a proof of concept with the sponsor.',
      metaTa: 'StartNet Labs-இன் ஸ்பான்சர் இணைக் கையொப்பமிட்ட சிக்கல் அறிக்கைகள். குழு அமைத்து ஸ்பான்சருடன் கருத்துச் சான்றை உருவாக்குங்கள்.',
    },
    '/research/problem-statements'
  );
  return (
    <SubShell
      seo={seo}
      crumb={t('Problem statements', 'சிக்கல் அறிக்கைகள்')}
      title={t('Problem statements.', 'சிக்கல் அறிக்கைகள்.')}
      lede={t(
        'Each StartNet Lab works on problem statements co-signed by an industry, Global Capability Centre (GCC) or government sponsor. The sponsor brings the problem, funds the proof of concept and can become the first customer.',
        'ஒவ்வொரு StartNet ஆய்வகமும் தொழில்துறை, உலகளாவிய திறன் மையம் (GCC) அல்லது அரசு ஸ்பான்சர் இணைக் கையொப்பமிட்ட சிக்கல் அறிக்கைகளில் பணியாற்றுகிறது. ஸ்பான்சர் சிக்கலைக் கொண்டு வருகிறார், கருத்துச் சான்றுக்கு நிதியளிக்கிறார், முதல் வாடிக்கையாளராகவும் ஆகலாம்.'
      )}
      // "First statements open [date]": no badge until the date is supplied.
      heroMeta={null}
      actions={
        <>
          <Button variant="brand" href="#register-interest">{t('Get notified', 'அறிவிப்பைப் பெறுங்கள்')}</Button>
          <Button variant="secondary" to="/partner/enquire?type=gcc&ref=research-problems">{post}</Button>
        </>
      }
      factsTitle={t('About problem statements', 'சிக்கல் அறிக்கைகள் பற்றி')}
      facts={[
        { label: t('Co-signed by', 'இணைக் கையொப்பம்'), value: t('An industry, GCC or government sponsor', 'தொழில்துறை, GCC அல்லது அரசு ஸ்பான்சர்') },
        {
          label: t('Per Lab, per year', 'ஒவ்வோர் ஆய்வகத்துக்கும், ஆண்டுக்கு'),
          value: <Stat value={10} label={t('At least, target', 'குறைந்தபட்சம், இலக்கு')} tag="C" source={t('StartNet Research Lab charter (planning target)', 'StartNet Research ஆய்வக சாசனம் (திட்ட இலக்கு)')} variant="compact" countUp={false} />,
        },
        { label: t('Who can apply', 'யார் விண்ணப்பிக்கலாம்'), value: t('PhD scholars, post-docs and faculty', 'முனைவர் பட்ட ஆய்வாளர்கள், முனைவர் பட்டத்துக்குப் பிந்தைய ஆய்வாளர்கள், பேராசிரியர்கள்') },

      ]}
      factsAction={<Button variant="secondary" full to="/partner/enquire?type=gcc&ref=research-problems">{post}</Button>}
      after={
        <InterestSection
          title={t('Get notified when problem statements open.', 'சிக்கல் அறிக்கைகள் திறக்கும்போது அறிவிப்பைப் பெறுங்கள்.')}
          body={t(
            'Pick the Lab closest to your research. We will send you the sponsor-signed statements as soon as they are published.',
            'உங்கள் ஆய்வுக்கு நெருக்கமான ஆய்வகத்தைத் தேர்ந்தெடுங்கள். ஸ்பான்சர் கையொப்பமிட்ட அறிக்கைகள் வெளியானதும் உங்களுக்கு அனுப்புவோம்.'
          )}
          source="research-problems"
        />
      }
    >
      <p className="research-sub__note research-sub__note--lead">
        {t(
          'Until the first sponsor-signed statements are published, the list shows each Lab’s focus areas.',
          'ஸ்பான்சர் கையொப்பமிட்ட முதல் அறிக்கைகள் வெளியாகும் வரை, இந்தப் பட்டியல் ஒவ்வோர் ஆய்வகத்தின் கவனப் பகுதிகளைக் காட்டுகிறது.'
        )}
      </p>
      <ProblemList syncUrl headingLevel="h2" />
    </SubShell>
  );
}

/* ---------- /research/terms ---------- */
function Terms() {
  const { t } = useLang();
  const intro = tr(t, TERMS, 'intro');
  // SEO: primary "university spinout terms India" (Book 1 §9.2). SEO-TA: pending native review
  const seo = {
    ...useSeo(
      {
        seoTitle: 'University spinout terms (draft) · StartNet Research',
        seoTitleTa: 'ஸ்பின்அவுட் விதிமுறைகள் (வரைவு) · StartNet Research',
        meta: "Draft standard terms for university research spinouts, agreed once per institution and aligned with AICTE's National Innovation and Startup Policy.",
        metaTa: 'ஆய்விலிருந்து பிறக்கும் நிறுவனங்களுக்கான நிலையான விதிமுறைகளின் வரைவு; ஒவ்வொரு கல்வி நிறுவனத்துடனும் ஒரு முறை ஒப்புதல். சட்ட ஆய்வுக்கு உட்பட்டது.',
      },
      '/research/terms'
    ),
    // Noindex: Book 2 §3.1 marks the standard terms "[draft — publish only after legal review]". The page stays
    // reachable for institutions we share it with; remove this once legal review approves the terms.
    noindex: true,
  };
  return (
    <SubShell
      seo={seo}
      crumb={t('Standard terms', 'நிலையான விதிமுறைகள்')}
      title={t('One set of terms, agreed once per institution.', 'ஒரே தொகுப்பு விதிமுறைகள், ஒவ்வொரு கல்வி நிறுவனத்துடனும் ஒரு முறை ஒப்புதல்.')}
      lede={`${intro} ${t('Final terms follow each institution’s IP policy.', 'இறுதி விதிமுறைகள் ஒவ்வொரு கல்வி நிறுவனத்தின் IP கொள்கையைப் பின்பற்றும்.')}`}
      heroMeta={<><Badge kind="status" status="upcoming">{tr(t, TERMS, 'status')}</Badge> <TagChip tag="C" /></>}
      actions={
        <>
          <Button variant="brand" href="#register-interest">{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</Button>
          <Button variant="whatsapp" href={waLink(WA_TEXT, 'research-terms')}>{t('Talk to the Research team', 'Research குழுவிடம் பேசுங்கள்')}</Button>
        </>
      }
      facts={[
        { label: t('Status', 'நிலை'), value: t('Draft, subject to legal review', 'வரைவு, சட்ட ஆய்வுக்கு உட்பட்டது') },
        { label: t('Agreed', 'ஒப்புதல்'), value: t('Once per institution, not company by company', 'ஒவ்வொரு கல்வி நிறுவனத்துடனும் ஒரு முறை; ஒவ்வொரு நிறுவனத்துக்கும் தனியாக அல்ல') },
        { label: t('Institution range', 'கல்வி நிறுவன வரம்பு'), value: <>5–10% <TagChip tag="C" /></> },
        { label: t('StartNet range', 'StartNet வரம்பு'), value: <>3–7% <TagChip tag="C" /></> },
        { label: t('Policy alignment', 'கொள்கை இணக்கம்'), value: t("AICTE's National Innovation and Startup Policy, where the institution has adopted it", 'கல்வி நிறுவனம் ஏற்றிருந்தால், AICTE-இன் தேசியப் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கை') },
        { label: t('Draft term sheet', 'வரைவு விதிமுறைத் தாள்'), value: t('Available to download after legal review', 'சட்ட ஆய்வுக்குப் பிறகு பதிவிறக்கக் கிடைக்கும்') },
      ]}
      after={<InterestSection title={t("Have research that could solve someone's problem? Tell us about it.", 'உங்கள் ஆய்வு யாரோ ஒருவரின் சிக்கலைத் தீர்க்குமா? எங்களிடம் சொல்லுங்கள்.')} source="research-terms" />}
    >
      <Block id="terms-split" eyebrow={t('At formation', 'நிறுவனம் தொடங்கும்போது')} title={t('Illustrative split', 'விளக்கப் பங்கீடு')}>
        <TermSheet compact />
      </Block>

      <Block id="terms-parties" eyebrow={t('The four-party model', 'நான்கு தரப்பு மாதிரி')} title={t('Who does what', 'யார் என்ன செய்கிறார்கள்')}>
        <dl className="research-sub__parties">
          {PARTIES.map((p) => (
            <div key={p.id}>
              <dt className="h5">{tr(t, p, 'name')}</dt>
              <dd className="text-2">{tr(t, p, 'body')}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block id="terms-nisp" eyebrow={t('Faculty founders', 'பேராசிரியர் நிறுவனர்கள்')} title={t('Leave, sabbatical and the National Innovation and Startup Policy', 'விடுப்பு, சிறப்பு விடுப்பு, தேசியப் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கை')}>
        <p className="text-2">{t(
          'Faculty can use leave or sabbatical provisions under AICTE’s National Innovation and Startup Policy, where their institution has adopted it. The Institution Partner Programme includes a policy kit and IP committee set-up aligned with that policy.',
          'தங்கள் கல்வி நிறுவனம் AICTE-இன் தேசியப் புத்தாக்க மற்றும் ஸ்டார்ட்அப் கொள்கையை ஏற்றிருந்தால், பேராசிரியர்கள் அதன் கீழ் உள்ள விடுப்பு அல்லது சிறப்பு விடுப்பு வசதிகளைப் பயன்படுத்தலாம். Institution Partner Programme-இல் அந்தக் கொள்கைக்கு ஏற்ற கொள்கைத் தொகுப்பும் IP குழு அமைப்பும் அடங்கும்.'
        )}</p>
        <Button variant="tertiary" to="/research/institution-partner-programme">Institution Partner Programme</Button>
      </Block>
    </SubShell>
  );
}

const PAGES = {
  labs: Labs,
  fellowship: Fellowship,
  'lab-to-market-summit': Summit,
  'institution-partner-programme': Institutions,
  'problem-statements': Problems,
  terms: Terms,
};

/** Slugs served by /research/:slug (the server's route list mirrors this — F-97). */
export const RESEARCH_SLUGS = Object.keys(PAGES);

/** Own-property lookup: "constructor", "toString", "hasOwnProperty"… are not pages. */
const pageFor = (slug) => (typeof slug === 'string' && Object.prototype.hasOwnProperty.call(PAGES, slug) ? PAGES[slug] : undefined);

export default function ResearchSub() {
  const { slug } = useParams();
  const Page = pageFor(slug);
  if (!Page) return <NotFound />;
  return <Page key={slug} />;
}
