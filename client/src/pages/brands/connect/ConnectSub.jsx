import { Navigate, useParams } from 'react-router-dom';
import { CalendarDays, FileText, MessageCircle, Repeat, Users } from 'lucide-react';
import {
  Badge, BrandHero, Button, CTABand, EmptyState, EventCard, KeyFacts, Placeholder, Reveal, RevealGroup,
  Section, Seo, Skeleton, TagChip, WhatsAppButton,
} from '../../../components';
import NotFound from '../../utility/NotFound.jsx';
import { useLang } from '../../../lib/i18n.jsx';
import { waLink } from '../../../lib/links.js';
import { useApi } from '../../../hooks/useApi.js';
import { usePageCta } from '../../../layout/shell.jsx';
import ConnectHeading from './ConnectHeading.jsx';
import SeriesGrid, { SectorStatus } from './SeriesGrid.jsx';
import SwitchStepper from './SwitchStepper.jsx';
import SeatRing from './SeatRing.jsx';
import { CircleMembership, FitLabel } from './ConnectBits.jsx';
import {
  ANGELS_LEGAL, ANGELS_LEGAL_TA, CONNECT_REDIRECTS, SCALE_OFFERS, SECTORS, SPONSOR_EMAIL,
  connectLinks, eventPlace, eventWhen, eventsForSector, own, sectorBySlug,
} from './connectData.js';
import '../brandPage.css';
import './ConnectSub.css';
import { eventPath } from '../../../components/_utils.js';
import { courseLd } from '../../../lib/seo.js';
import { pageLd } from '../seoBits.js';
import { EventGallery } from '../../../components/EventGallery.jsx';
import { EventVideos } from '../../../components/VideoFeature.jsx';
import { eventSeriesForPath } from '../../../data/photos.js';

// Tamil strings are drafts pending native review (Book 2 §14).
const HAPPENS = [
  { icon: CalendarDays, title: 'Flagship event', titleTa: 'முதன்மை நிகழ்வு', body: 'The sector’s big day of the year.', bodyTa: 'அந்தத் துறையின் ஆண்டின் பெரிய நாள்.' },
  { icon: Repeat, title: 'Monthly meet-up', titleTa: 'மாதாந்திரச் சந்திப்பு', body: 'The community meets between flagships.', bodyTa: 'முதன்மை நிகழ்வுகளுக்கு இடையே சமூகம் சந்திக்கிறது.' },
  { icon: Users, title: 'Sector Circle', titleTa: 'துறை Circle', body: 'A closed chapter for founders in the sector.', bodyTa: 'அந்தத் துறை நிறுவனர்களுக்கான மூடிய குழு.' },
  { icon: FileText, title: 'Sector report', titleTa: 'துறை அறிக்கை', body: 'What the sector learned, published.', bodyTa: 'துறை கற்றுக்கொண்டவை, வெளியிடப்படும்.' },
];

function HappensList() {
  const { t } = useLang();
  return (
    <RevealGroup as="ul" className="connect-sub__happens">
      {HAPPENS.map(({ icon: Icon, title, titleTa, body, bodyTa }) => (
        <li key={title} className="connect-sub__happen">
          <span className="connect-sub__happenicon" aria-hidden="true"><Icon size={22} /></span>
          <div><h3 className="h5">{t(title, titleTa)}</h3><p className="small text-2">{t(body, bodyTa)}</p></div>
        </li>
      ))}
    </RevealGroup>
  );
}

function Block({ id, title, children }) {
  return (
    <section className="connect-sub__block" id={id}>
      <Reveal>
        <h2 className="h3 connect-sub__blocktitle">{title}</h2>
        <div className="connect-sub__blockbody">{children}</div>
      </Reveal>
    </section>
  );
}

/* ---------------- page builders ---------------- */

function seriesPage({ links, events, t }) {
  return {
    seo: {
      // SEO-TA: pending native review
      title: t('Connect Series: GenAI, SaaS and D2C communities', 'Connect Series: GenAI, SaaS, D2C துறைச் சமூகங்கள்'),
      description: t(
        'GenAI, SaaS, D2C, DeepTech, FinTech, Industry 4.0, HealthTech, AgriFood and Climate Connect: year-round sector communities with events.',
        'GenAI, SaaS, D2C, DeepTech, FinTech, Industry 4.0, HealthTech, AgriFood, Climate Connect: நிகழ்வுகளுடன் ஆண்டு முழுவதும் இயங்கும் துறைச் சமூகங்கள்.'
      ),
    },
    title: t('Nine sectors. One community each, all year.', 'ஒன்பது துறைகள். ஒவ்வொன்றுக்கும் ஒரு சமூகம், ஆண்டு முழுவதும்.'),
    lede: t(
      'Each Connect is a community, not a single date: a flagship event, monthly meet-ups, a sector report and a Circle. We co-host with sector bodies wherever we can, rather than duplicate them.',
      'ஒவ்வொரு Connect-உம் ஒரு நாள் நிகழ்வு அல்ல, ஒரு சமூகம்: ஒரு முதன்மை நிகழ்வு, மாதாந்திரச் சந்திப்புகள், ஒரு துறை அறிக்கை மற்றும் ஒரு Circle. துறை அமைப்புகளின் பணியை மீண்டும் செய்வதற்குப் பதிலாக, முடிந்தவரை அவற்றுடன் இணைந்து நடத்துகிறோம்.'
    ),
    actions: <Button variant="brand" size="lg" to="/events?brand=connect">{t('See next Connect', 'அடுத்த Connect-ஐப் பாருங்கள்')}</Button>,
    pageCta: { label: 'See next Connect', labelTa: 'அடுத்த Connect-ஐப் பாருங்கள்', shortLabel: 'Next Connect', shortLabelTa: 'அடுத்த Connect', to: '/events?brand=connect', brand: 'connect' },
    main: (
      <>
        <Block title={t('What every Connect includes', 'ஒவ்வொரு Connect-இலும் உள்ளவை')}><HappensList /></Block>
        <Block title={t('Co-hosts', 'இணை நடத்துநர்கள்')}>
          <p>{t(
            'We co-host with sector bodies wherever we can, rather than duplicate them. Co-hosts are listed only once an agreement is signed.',
            'துறை அமைப்புகளின் பணியை மீண்டும் செய்வதற்குப் பதிலாக, முடிந்தவரை அவற்றுடன் இணைந்து நடத்துகிறோம். ஒப்பந்தம் கையெழுத்தான பின்னரே இணை நடத்துநர்கள் பட்டியலிடப்படுவார்கள்.'
          )}</p>
        </Block>
      </>
    ),
    facts: [
      { label: t('Sectors', 'துறைகள்'), value: t('Nine', 'ஒன்பது') },
      { label: t('Running now', 'இப்போது நடப்பவை'), value: 'GenAI, SaaS, D2C' },
      { label: t('New in 2027', '2027-இல் புதியவை'), value: 'DeepTech, FinTech, Industry 4.0' },
      { label: t('Next', 'அடுத்து'), value: 'HealthTech, AgriFood, Climate' },
    ],
    factsAction: <Button variant="brand" full href={links.sectorRegister('all')}>{t('Register for the next event', 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள்')}</Button>,
    extra: (
      <Section surface="white" labelledBy="connect-sub-allseries">
        <ConnectHeading id="connect-sub-allseries" eyebrow="Connect Series" title={t('Find your sector', 'உங்கள் துறையைக் கண்டறியுங்கள்')} />
        <SeriesGrid events={events} />
      </Section>
    ),
    cta: {
      title: t('Find your sector Connect.', 'உங்கள் துறை Connect-ஐக் கண்டறியுங்கள்.'),
      body: t('Register for the next event, or put your brand in front of a sector community.', 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள், அல்லது உங்கள் பிராண்டை ஒரு துறைச் சமூகத்தின் முன் கொண்டு செல்லுங்கள்.'),
      actions: (
        <>
          <Button variant="brand" href={links.sectorRegister('all')}>
            <FitLabel long={t('Register for the next event', 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள்')} short={t('Register for next event', 'அடுத்த நிகழ்வுக்குப் பதிவு')} />
          </Button>
          <Button variant="secondary" to="/partner/enquire?type=sponsor&brand=connect">{t('Sponsor a Connect', 'ஒரு Connect-க்கு நிதியுதவி செய்யுங்கள்')}</Button>
        </>
      ),
    },
  };
}

function circlesPage({ links, t }) {
  return {
    seo: {
      title: t('Connect Circles: founder peer chapters', 'Connect Circles: நிறுவனர் குழுக்கள்'),
      description: t(
        'Closed chapters of 25–40 founders, one seat per sector, meeting monthly. Introductions tracked. Membership includes StartNet X Pro.',
        'ஒரு துறைக்கு ஓர் இடம் கொண்ட 25–40 நிறுவனர்களின் மூடிய குழுக்கள்; மாதந்தோறும் சந்திப்பு, அறிமுகங்கள் பதிவு, StartNet X Pro உடன்.'
      ),
    },
    title: t('Twenty-five to forty founders. One seat per sector. Every month.', 'இருபத்தைந்து முதல் நாற்பது நிறுவனர்கள். ஒரு துறைக்கு ஓர் இடம். ஒவ்வொரு மாதமும்.'),
    lede: t(
      'A Connect Circle is a closed chapter that meets monthly. Each sector has one seat, so members refer business instead of competing for it.',
      'Connect Circle என்பது மாதந்தோறும் சந்திக்கும் ஒரு மூடிய குழு. ஒவ்வொரு துறைக்கும் ஓர் இடம் மட்டுமே; அதனால் உறுப்பினர்கள் போட்டியிடுவதற்குப் பதிலாக ஒருவருக்கொருவர் வணிகத்தைப் பரிந்துரைக்கிறார்கள்.'
    ),
    actions: (
      <>
        <Button variant="brand" size="lg" href={links.applyCircle}>{t('Apply to a Circle', 'ஒரு Circle-க்கு விண்ணப்பியுங்கள்')}</Button>
        <Button variant="secondary" size="lg" href={links.findCircle}>{t('Find a Circle near you', 'அருகிலுள்ள Circle-ஐக் கண்டறியுங்கள்')}</Button>
      </>
    ),
    pageCta: { label: 'Apply to a Circle', labelTa: 'ஒரு Circle-க்கு விண்ணப்பியுங்கள்', shortLabel: 'Apply now', shortLabelTa: 'இப்போதே விண்ணப்பியுங்கள்', href: links.applyCircle, brand: 'connect' },
    main: (
      <>
        <Block title={t('How a Circle works', 'Circle எப்படிச் செயல்படுகிறது')}>
          <div className="connect-sub__circle">
            <SeatRing />
            <ul className="connect-sub__ticks">
              <li>{t('A closed chapter that meets monthly.', 'மாதந்தோறும் சந்திக்கும் ஒரு மூடிய குழு.')}</li>
              <li>{t('Each sector has one seat, so members refer business instead of competing for it.', 'ஒவ்வொரு துறைக்கும் ஓர் இடம்; அதனால் உறுப்பினர்கள் போட்டியிடுவதற்குப் பதிலாக வணிகத்தைப் பரிந்துரைக்கிறார்கள்.')}</li>
              <li>{t('Introductions and referrals are logged on StartNet X and reported back to members.', 'அறிமுகங்களும் பரிந்துரைகளும் StartNet X-இல் பதிவு செய்யப்பட்டு உறுப்பினர்களுக்குத் தெரிவிக்கப்படுகின்றன.')}</li>
              <li>{t('Volunteer chairs, StartNet operations.', 'தன்னார்வத் தலைவர்கள், StartNet செயல்பாடுகள்.')}</li>
            </ul>
          </div>
        </Block>
        <Block title={t('Membership', 'உறுப்பினர் சேர்க்கை')}>
          <CircleMembership variant="default" />
          <p className="small muted">{t("Membership is by application. We'll check your sector seat is free before you pay.", 'உறுப்பினர் சேர்க்கை விண்ணப்பத்தின் மூலம். நீங்கள் கட்டணம் செலுத்தும் முன் உங்கள் துறை இடம் காலியாக உள்ளதா என்று சரிபார்ப்போம்.')}</p>
        </Block>
      </>
    ),
    facts: [
      { label: t('Size', 'அளவு'), value: t('25 to 40 founders', '25 முதல் 40 நிறுவனர்கள்') },
      { label: t('Meets', 'சந்திப்பு'), value: t('Monthly', 'மாதந்தோறும்') },
      { label: t('Seats', 'இடங்கள்'), value: t('One per sector', 'ஒரு துறைக்கு ஒன்று') },
      { label: t('Membership', 'உறுப்பினர் கட்டணம்'), value: <>{t('From ₹30,000 a year', 'ஆண்டுக்கு ₹30,000 முதல்')} <TagChip tag="C" /></> },
      { label: t('Includes', 'உள்ளடக்கம்'), value: 'StartNet X Pro' },
    ],
    factsAction: <Button variant="brand" full href={links.applyCircle}>{t('Apply to a Circle', 'ஒரு Circle-க்கு விண்ணப்பியுங்கள்')}</Button>,
    cta: {
      title: t('Your sector seat may still be free.', 'உங்கள் துறை இடம் இன்னும் காலியாக இருக்கலாம்.'),
      body: t('Membership is by application. We check the seat before you pay.', 'உறுப்பினர் சேர்க்கை விண்ணப்பத்தின் மூலம். நீங்கள் கட்டணம் செலுத்தும் முன் இடத்தைச் சரிபார்க்கிறோம்.'),
      actions: (
        <>
          <Button variant="brand" href={links.applyCircle}>{t('Apply to a Circle', 'ஒரு Circle-க்கு விண்ணப்பியுங்கள்')}</Button>
          <Button variant="secondary" href={links.findCircle}>{t('Find a Circle near you', 'அருகிலுள்ள Circle-ஐக் கண்டறியுங்கள்')}</Button>
        </>
      ),
    },
  };
}

function switchPage({ links, t }) {
  const sponsor = t('Ask your employer to sponsor a seat', 'உங்கள் இடத்துக்கு நிதியுதவி செய்ய உங்கள் நிறுவனத்திடம் கேளுங்கள்');
  const sponsorShort = t('Ask your employer', 'நிறுவனத்திடம் கேளுங்கள்');
  const apply = t('Apply for the next cohort', 'அடுத்த குழுவுக்கு விண்ணப்பியுங்கள்');
  return {
    seo: {
      // SEO: primary "leave your job to start a startup" / co-founder. SEO-TA: pending native review
      title: t('Founder Switch: from job to startup in 12 weeks', 'Founder Switch: வேலையிலிருந்து ஸ்டார்ட்அப்புக்கு'),
      description: t(
        'A 12-week evening and weekend programme for working professionals: validate an idea with customers, find a co-founder, plan your runway and decide go or no-go.',
        'பணியில் உள்ளவர்களுக்கான 12 வார மாலை, வார இறுதித் திட்டம்: யோசனைச் சரிபார்ப்பு, இணை நிறுவனர், நிதித் திட்டம், தொடர்வதா என்ற முடிவு.'
      ),
    },
    title: t('Twelve weeks to a clear go or no-go.', 'தொடர்வதா வேண்டாமா என்ற தெளிவான முடிவுக்குப் பன்னிரண்டு வாரங்கள்.'),
    lede: t(
      'For professionals with a day job and an idea. Evenings and weekends for 12 weeks: validate the idea with customers, find or test a co-founder, plan your financial runway, and finish with a decision you can defend.',
      'வேலையும் ஒரு யோசனையும் உள்ள தொழில் வல்லுநர்களுக்கு. 12 வாரங்கள், மாலை நேரங்களிலும் வார இறுதிகளிலும்: வாடிக்கையாளர்களுடன் யோசனையைச் சரிபாருங்கள், இணை நிறுவனரைக் கண்டறியுங்கள் அல்லது சோதியுங்கள், நிதி இருப்புக் காலத்தைத் திட்டமிடுங்கள், நியாயப்படுத்தக்கூடிய முடிவுடன் நிறைவு செய்யுங்கள்.'
    ),
    actions: (
      <>
        <Button variant="brand" size="lg" href={links.applySwitch}>{apply}</Button>
        <Button variant="secondary" size="lg" href={SPONSOR_EMAIL}><FitLabel long={sponsor} short={sponsorShort} /></Button>
      </>
    ),
    pageCta: { label: 'Apply for the next cohort', labelTa: 'அடுத்த குழுவுக்கு விண்ணப்பியுங்கள்', shortLabel: 'Apply now', shortLabelTa: 'இப்போதே விண்ணப்பியுங்கள்', href: links.applySwitch, brand: 'connect' },
    main: (
      <>
        <Block title={t('The twelve weeks', 'பன்னிரண்டு வாரங்கள்')}>
          <SwitchStepper />
        </Block>
        <Block id="matching" title={t('Co-founder matching', 'இணை நிறுவனர் பொருத்தம்')}>
          <p>{t(
            'Founder Switch is where you find or test a co-founder: you work on the same idea, with the same customers, before either of you makes the leap.',
            'Founder Switch-இல் நீங்கள் இணை நிறுவனரைக் கண்டறியலாம் அல்லது சோதிக்கலாம்: உங்களில் யாரும் முழுநேரமாக இறங்கும் முன்பே, ஒரே யோசனையில், ஒரே வாடிக்கையாளர்களுடன் சேர்ந்து பணியாற்றுகிறீர்கள்.'
          )}</p>
        </Block>
        <Block title={t('Sponsored seats', 'நிதியுதவி பெற்ற இடங்கள்')}>
          <p>{t("Some GCCs sponsor seats for their employees. Ask yours: we've written the email for you.", 'சில GCC-கள் தங்கள் ஊழியர்களுக்கான இடங்களுக்கு நிதியுதவி செய்கின்றன. உங்கள் நிறுவனத்திடம் கேளுங்கள்: மின்னஞ்சலை நாங்களே எழுதித் தந்துள்ளோம்.')}</p>
          <Button variant="tertiary" href={SPONSOR_EMAIL}>{sponsor}</Button>
        </Block>
      </>
    ),
    facts: [
      { label: t('Length', 'காலம்'), value: t('12 weeks, evenings and weekends', '12 வாரங்கள், மாலை நேரங்களும் வார இறுதிகளும்') },
      { label: t('Fee', 'கட்டணம்'), value: <><Placeholder>[placeholder — rate card; indicative ₹35,000–75,000]</Placeholder> <TagChip tag="C" /></> },
      // Next cohort date: hidden until StartNet supplies it.
      { label: t('Format', 'வடிவம்'), value: t('Chennai in person + online', 'சென்னையில் நேரடியாக + இணையவழி') },
    ],
    factsAction: <Button variant="brand" full href={links.applySwitch}>{apply}</Button>,
    cta: {
      title: t('Keep your job while you test your company.', 'உங்கள் நிறுவனத்தைச் சோதிக்கும்போதே உங்கள் வேலையைத் தொடருங்கள்.'),
      body: t('Apply for the next cohort, or ask your employer to sponsor a seat.', 'அடுத்த குழுவுக்கு விண்ணப்பியுங்கள், அல்லது உங்கள் இடத்துக்கு நிதியுதவி செய்ய உங்கள் நிறுவனத்திடம் கேளுங்கள்.'),
      actions: (
        <>
          <Button variant="brand" href={links.applySwitch}>{apply}</Button>
          <Button variant="secondary" href={SPONSOR_EMAIL}><FitLabel long={sponsor} short={sponsorShort} /></Button>
        </>
      ),
    },
  };
}

function scalePage({ links, t }) {
  const apply = t('Apply to Scale Connect', 'Scale Connect-க்கு விண்ணப்பியுங்கள்');
  const included = t('Included with StartNet X Scale.', 'StartNet X Scale-உடன் சேர்ந்தே கிடைக்கும்.');
  const title = t('Your next customer, investor or market.', 'உங்கள் அடுத்த வாடிக்கையாளர், முதலீட்டாளர் அல்லது சந்தை.');
  return {
    seo: {
      title: t('Scale Connect: investors and pilots for startups', 'Scale Connect: வளரும் ஸ்டார்ட்அப்களுக்கு'),
      description: t(
        'Investor days, GCC and corporate pilot matchmaking, government procurement readiness and export desks for growing startups.',
        'வளரும் ஸ்டார்ட்அப்களுக்கு முதலீட்டாளர் நாட்கள், GCC மற்றும் பெருநிறுவனப் பைலட் பொருத்தம், அரசுக் கொள்முதல் தயார்நிலை மற்றும் ஏற்றுமதி மையங்கள்.'
      ),
    },
    title,
    lede: t(
      'For startups past first revenue. Curated investor days, pilot matchmaking with GCCs and corporates, readiness for government procurement, and export desks connected to Tamil diaspora networks.',
      'முதல் வருவாயைக் கடந்த ஸ்டார்ட்அப்களுக்கு. தேர்ந்தெடுக்கப்பட்ட முதலீட்டாளர் நாட்கள், GCC-கள் மற்றும் பெருநிறுவனங்களுடன் பைலட் பொருத்தம், அரசுக் கொள்முதலுக்கான தயார்நிலை, உலகத் தமிழர் வலையமைப்புகளுடன் இணைந்த ஏற்றுமதி மையங்கள்.'
    ),
    actions: <Button variant="brand" size="lg" href={links.applyScale}>{apply}</Button>,
    pageCta: { label: 'Apply to Scale Connect', labelTa: 'Scale Connect-க்கு விண்ணப்பியுங்கள்', shortLabel: 'Apply now', shortLabelTa: 'இப்போதே விண்ணப்பியுங்கள்', href: links.applyScale, brand: 'connect' },
    meta: <span className="small">{included}</span>,
    main: (
      <ol className="connect-sub__offers">
        {SCALE_OFFERS.map((o, i) => (
          <li key={o.id} id={o.id} className="connect-sub__offer">
            <Reveal className="connect-sub__offerinner">
              <span className="connect-sub__offernum tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="h3">{t(o.title, o.titleTa)}</h2>
                <p className="body-lg text-2">{t(o.body, o.bodyTa)}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    ),
    facts: [
      { label: t('For', 'யாருக்கு'), value: t('Startups past first revenue', 'முதல் வருவாயைக் கடந்த ஸ்டார்ட்அப்கள்') },
      { label: t('Includes', 'உள்ளடக்கம்'), value: t('Investor days, pilot days, procurement readiness, export desks', 'முதலீட்டாளர் நாட்கள், பைலட் நாட்கள், கொள்முதல் தயார்நிலை, ஏற்றுமதி மையங்கள்') },
      { label: t('Duration', 'காலம்'), value: t('Ongoing', 'தொடர்ச்சியானது') },
      { label: t('Access', 'அணுகல்'), value: t('Included with StartNet X Scale', 'StartNet X Scale-உடன் சேர்ந்தே கிடைக்கும்') },
    ],
    factsAction: <Button variant="brand" full href={links.applyScale}>{apply}</Button>,
    cta: {
      title,
      body: included,
      actions: <Button variant="brand" href={links.applyScale}>{apply}</Button>,
    },
  };
}

function angelsPage({ links, t }) {
  const register = t('Register interest as an angel', 'ஏஞ்சல் முதலீட்டாளராக ஆர்வத்தைப் பதிவு செய்யுங்கள்');
  const registerShort = t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்');
  const title = t('Founders backing the next founders.', 'அடுத்த நிறுவனர்களுக்குத் துணை நிற்கும் நிறுவனர்கள்.');
  return {
    seo: {
      // The description says "planned" and "not yet open", as the page's required legal microcopy does.
      // SEO-TA: pending native review
      title: t('StartNet Angels: an angel network of founders', 'StartNet Angels: நிறுவனர்களின் ஏஞ்சல் வலையமைப்பு'),
      description: t(
        'StartNet Angels is a planned angel network of founders and Circle alumni, investing through a SEBI-compliant structure. Not yet open; register interest.',
        'நிறுவனர்கள், Circle முன்னாள் உறுப்பினர்களின் திட்டமிடப்பட்ட ஏஞ்சல் வலையமைப்பு StartNet Angels; SEBI விதிகளுக்கு இணங்கிய கட்டமைப்பு. இன்னும் திறக்கப்படவில்லை.'
      ),
    },
    title,
    lede: t(
      'An angel network for Circle alumni, successful founders and experienced professionals who want to invest in companies from StartNet programmes.',
      'StartNet திட்டங்களிலிருந்து வரும் நிறுவனங்களில் முதலீடு செய்ய விரும்பும் Circle முன்னாள் உறுப்பினர்கள், வெற்றிகரமான நிறுவனர்கள் மற்றும் அனுபவமிக்க தொழில் வல்லுநர்களுக்கான ஏஞ்சல் வலையமைப்பு.'
    ),
    actions: <Button variant="brand" size="lg" href={links.angelsInterest}><FitLabel long={register} short={registerShort} /></Button>,
    pageCta: { label: 'Register interest as an angel', labelTa: 'ஏஞ்சல் முதலீட்டாளராக ஆர்வத்தைப் பதிவு செய்யுங்கள்', shortLabel: 'Register interest', shortLabelTa: 'ஆர்வத்தைப் பதிவு செய்யுங்கள்', href: links.angelsInterest, brand: 'connect' },
    meta: <Badge kind="status" status="upcoming">{t('Coming · not yet open', 'விரைவில் · திறக்கப்படவில்லை')}</Badge>,
    main: (
      <>
        <Block title={t('How investments will be made', 'முதலீடுகள் எப்படிச் செய்யப்படும்')}>
          <p>
            {t('Investments are made only through a SEBI-compliant structure', 'SEBI விதிகளுக்கு இணங்கிய கட்டமைப்பின் மூலம் மட்டுமே முதலீடுகள் செய்யப்படும்')}.
          </p>
        </Block>
        <div className="connect-sub__legal" role="note" aria-label={t('Important information', 'முக்கியத் தகவல்')}>
          <p className="h5">{t('Important', 'முக்கியம்')}</p>
          <p>{t(ANGELS_LEGAL, ANGELS_LEGAL_TA)}</p>
        </div>
      </>
    ),
    facts: [
      { label: t('Status', 'நிலை'), value: t('Not yet open for investment', 'இன்னும் முதலீட்டுக்குத் திறக்கப்படவில்லை') },
      { label: t('For', 'யாருக்கு'), value: t('Circle alumni, successful founders and experienced professionals', 'Circle முன்னாள் உறுப்பினர்கள், வெற்றிகரமான நிறுவனர்கள், அனுபவமிக்க தொழில் வல்லுநர்கள்') },
      { label: t('Invests in', 'முதலீடு செய்வது'), value: t('Companies from StartNet programmes', 'StartNet திட்டங்களிலிருந்து வரும் நிறுவனங்கள்') },
      { label: t('Structure', 'கட்டமைப்பு'), value: t('SEBI-compliant', 'SEBI விதிகளுக்கு இணங்கியது') },
    ],
    factsAction: <Button variant="secondary" full href={links.angelsInterest}>{register}</Button>,
    cta: {
      title,
      body: t('Register your interest and we will write when StartNet Angels opens.', 'உங்கள் ஆர்வத்தைப் பதிவு செய்யுங்கள்; StartNet Angels திறக்கப்படும்போது உங்களுக்கு எழுதுவோம்.'),
      actions: <Button variant="brand" href={links.angelsInterest}><FitLabel long={register} short={registerShort} /></Button>,
    },
  };
}

/*
 * Sector page head. Title "<Sector> Connect: <short> founder community"; the description is the Book 2 card line
 * plus the sector's status, so the nine template pages never share a description (EN or TA).
 * Noindex rule (thin templated pages, Book 1 §9.3 spirit): a sector page is indexed when the community is running
 * or has a listed upcoming event; "New · 2027" and "proposed" sectors with nothing scheduled stay noindex, follow.
 * SEO-TA: pending native review
 */
const STATUS_LINE = {
  running: [' Year-round: a flagship event, monthly meet-ups and a Circle.', ' ஆண்டு முழுவதும்: முதன்மை நிகழ்வு, மாதாந்திரச் சந்திப்புகள், ஒரு Circle.'],
  'new-2027': [' A StartNet Connect sector community planned for 2027. Get updates.', ' 2027-க்குத் திட்டமிடப்பட்ட StartNet Connect துறைச் சமூகம்.'],
  proposed: [' A proposed StartNet Connect sector community. Get updates on WhatsApp.', ' முன்மொழியப்பட்ட StartNet Connect துறைச் சமூகம்.'],
};
function sectorSeo(sector, next, t) {
  const fit = (full, short, max) => (full.length <= max ? full : short);
  const titleFull = t(`${sector.name}: ${sector.short} founder community`, `${sector.name}: ${sector.short} நிறுவனர் சமூகம்`);
  const titleShort = t(`${sector.name}: founder community`, `${sector.name}: நிறுவனர் சமூகம்`);
  const summary = t(sector.summary, sector.summaryTa);
  const line = t(...(STATUS_LINE[sector.status] || STATUS_LINE.proposed));
  return {
    title: fit(titleFull, titleShort, 49), // + " · StartNet" stays within 60
    description: fit(`${summary}${line}`, summary, 158),
    noindex: sector.status !== 'running' && !next,
  };
}

function sectorPage(sector, { links, events, loading, t, lang }) {
  const next = eventsForSector(events, sector)[0];
  const register = next ? { to: eventPath(next) } : { href: links.sectorRegister(sector.slug) };
  const registerLong = t('Register for the next event', 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள்');
  const registerShort = t('Register for next event', 'அடுத்த நிகழ்வுக்குப் பதிவு');
  const keyword = `CONNECT ${sector.short.toUpperCase()}`;
  const datesSoon = t('Dates soon', 'தேதிகள் விரைவில்');
  const summary = t(sector.summary, sector.summaryTa);
  return {
    seo: sectorSeo(sector, next, t),
    title: sector.name,
    lede: summary,
    actions: (
      <>
        <Button variant="brand" size="lg" {...register}><FitLabel long={registerLong} short={registerShort} /></Button>
        {/* Outline secondary with a trailing icon, so the WhatsApp button does not compete with the primary. */}
        <Button variant="secondary" size="lg" href={waLink(keyword)} icon={MessageCircle}>
          <FitLabel
            long={t(`Join the ${sector.short} community on WhatsApp`, `WhatsApp-இல் ${sector.short} சமூகத்தில் இணையுங்கள்`)}
            short={t('Join on WhatsApp', 'WhatsApp-இல் இணையுங்கள்')}
          />
        </Button>
      </>
    ),
    pageCta: {
      label: 'Register for the next event', labelTa: 'அடுத்த நிகழ்வுக்குப் பதிவு செய்யுங்கள்',
      shortLabel: 'Register', shortLabelTa: 'பதிவு செய்யுங்கள்',
      ...register, brand: 'connect',
    },
    meta: <SectorStatus status={sector.status} since={sector.since} />,
    main: (
      <>
        <Block title={t('Next event', 'அடுத்த நிகழ்வு')}>
          {loading ? <Skeleton height="20rem" /> : next ? (
            <div className="connect-sub__nextevent"><EventCard event={next} /></div>
          ) : (
            <EmptyState
              title={datesSoon}
              body={t(
                `The next ${sector.name} date is announced first to the community on WhatsApp.`,
                `அடுத்த ${sector.name} தேதி முதலில் WhatsApp-இல் சமூகத்துக்கு அறிவிக்கப்படும்.`
              )}
              action={<WhatsAppButton text={keyword} label={t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')} />}
            />
          )}
        </Block>
        <EventGallery series={eventSeriesForPath(`/connect/${sector.slug}`)} />
        {/* Event films of this series, when verified ones exist (data/videos.js); renders nothing otherwise */}
        <EventVideos series={eventSeriesForPath(`/connect/${sector.slug}`)} headingLevel={3} className="connect-sub__films" />
        <Block title={t('What happens here', 'இங்கே என்ன நடக்கும்')}><HappensList /></Block>
        {/* "Co-hosts and sponsors" block hidden until a co-host or sponsor agreement is signed. */}
      </>
    ),
    facts: [
      { label: t('Status', 'நிலை'), value: <SectorStatus status={sector.status} since={sector.since} /> },
      { label: t('Next event', 'அடுத்த நிகழ்வு'), value: next ? <><span className="tnum">{eventWhen(next, { dates: datesSoon, lang })}</span>{eventPlace(next, lang) ? ` · ${eventPlace(next, lang)}` : ''}</> : datesSoon },
      { label: t('Format', 'வடிவம்'), value: t('Flagship event, monthly meet-ups, a sector report and a Circle', 'முதன்மை நிகழ்வு, மாதாந்திரச் சந்திப்புகள், ஒரு துறை அறிக்கை மற்றும் ஒரு Circle') },
    ],
    factsAction: <Button variant="brand" full {...register}>{registerLong}</Button>,
    cta: {
      title: t(`Sponsor ${sector.name}.`, `${sector.name}-க்கு நிதியுதவி செய்யுங்கள்.`),
      body: t('Put your brand in front of this sector community, all year.', 'ஆண்டு முழுவதும் இந்தத் துறைச் சமூகத்தின் முன் உங்கள் பிராண்டைக் கொண்டு செல்லுங்கள்.'),
      actions: (
        <>
          <Button variant="brand" to="/partner/enquire?type=sponsor&brand=connect">{t(`Sponsor ${sector.name}`, `${sector.name}-க்கு நிதியுதவி செய்யுங்கள்`)}</Button>
          <Button variant="tertiary" to="/connect/series">{t('All sector Connects', 'அனைத்துத் துறை Connect-கள்')}</Button>
        </>
      ),
    },
  };
}

const BUILDERS = { series: seriesPage, circles: circlesPage, 'founder-switch': switchPage, scale: scalePage, angels: angelsPage };

export default function ConnectSub() {
  const { slug } = useParams();
  const { lang, t, localePath } = useLang();
  // Own-property lookups only: "/connect/constructor" or "/connect/__proto__" must not resolve an inherited member (F-60).
  const sector = sectorBySlug(slug);
  const redirect = own(CONNECT_REDIRECTS, slug);
  const builder = own(BUILDERS, slug);
  const needsEvents = slug === 'series' || !!sector;
  const { data, loading } = useApi(needsEvents ? '/api/events?brand=connect&when=upcoming' : null);

  const ctx = { links: connectLinks(lang), events: Array.isArray(data) ? data : [], loading, t, lang };
  const page = redirect ? null : sector ? sectorPage(sector, ctx) : typeof builder === 'function' ? builder(ctx) : null;
  // The bottom bar mirrors this page's primary action (hooks run before any early return).
  usePageCta(page?.pageCta || null);

  if (typeof redirect === 'string') return <Navigate to={localePath(redirect)} replace />;
  if (!page) return <NotFound />;

  return (
    <>
      <Seo
        title={page.seo.title}
        description={page.seo.description}
        noindex={!!page.seo.noindex}
        jsonLd={[
          pageLd({ path: `/connect/${slug}`, lang, name: page.seo.title, description: page.seo.description }),
          // Founder Switch is a 12-week programme (Course, Book 1 §9.4). Fee and cohort dates are placeholders: not published.
          slug === 'founder-switch'
            ? {
                ...courseLd({ name: 'Founder Switch', description: page.seo.description, path: '/connect/founder-switch', lang, timeRequired: 'P12W' }),
                inLanguage: undefined,
              }
            : null,
        ]}
      />
      <BrandHero brand="connect" compact title={page.title} lede={page.lede} actions={page.actions} meta={page.meta} />

      <Section surface="paper">
        <div className="split split--8-4 connect-sub__layout">
          <div className="connect-sub__main">{page.main}</div>
          <aside className="connect-sub__aside">
            <KeyFacts title={t('At a glance', 'ஒரே பார்வையில்')} items={page.facts} action={page.factsAction} />
          </aside>
        </div>
      </Section>

      {page.extra}

      {sector && (
        <Section surface="white" labelledBy="connect-sub-more">
          <ConnectHeading id="connect-sub-more" eyebrow="Connect Series" title={t('Other sector Connects', 'பிற துறை Connect-கள்')} />
          <ul className="connect-sub__others">
            {SECTORS.filter((s) => s.slug !== sector.slug).map((s) => (
              <li key={s.slug}><Button variant="tertiary" to={`/connect/${s.slug}`}>{s.name}</Button></li>
            ))}
          </ul>
        </Section>
      )}

      <CTABand surface="paper" brand="connect" className="brand-close" title={page.cta.title} body={page.cta.body} actions={page.cta.actions} />
    </>
  );
}
