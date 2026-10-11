import { useParams } from 'react-router-dom';
import { Award, CalendarDays, Languages, MapPin, Smartphone, Users } from 'lucide-react';
import {
  ArtImage,
  BrandHero,
  Button,
  CTABand,
  EventCard,
  KeyFacts,
  Placeholder,
  Reveal,
  RevealGroup,
  Section,
  SectionHeader,
  Seo,
  TagChip,
} from '../../../components';
import NotFound from '../../utility/NotFound.jsx';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import { usePageCta } from '../../../layout/shell.jsx';
import CircleFinder from './CircleFinder.jsx';
import SchemeExplorer from './SchemeExplorer.jsx';
import NominationForm from './NominationForm.jsx';
import WomenStories from './WomenStories.jsx';
import { FitLabel } from './WomenBits.jsx';
import { SNX, TA, WOMEN_SUB_SLUGS } from './womenContent.js';
import '../brandPage.css';
import './Women.css';
import { courseLd } from '../../../lib/seo.js';
import { pageLd } from '../seoBits.js';

/**
 * Sub-page content map. Copy: Book 2 §3.4 (SEO title, meta, H1, body, buttons, microcopy) verbatim.
 * Tamil: drafts pending native review (Book 2 §14). Programme names stay in Latin script.
 * Actions carry { label, labelTa, short?, shortTa? } so the bottom bar and phone labels can use them.
 */
const pagesFor = (t) => ({
  circles: {
    // SEO: primary "women entrepreneur groups / network by district". SEO-TA: pending native review
    seo: t('Women founder Circles in your district', 'உங்கள் மாவட்டத்தில் பெண் தொழில்முனைவோர் வட்டங்கள்'),
    description: t(
      'Monthly chapters of 20–30 women founders in your Tamil Nadu district, with peer accountability, problem-solving and introductions to buyers. Join a Circle.',
      'உங்கள் மாவட்டத்தில் 20–30 பெண் தொழில்முனைவோர் கொண்ட மாதாந்திரக் குழுக்கள்; சக நிறுவனர்களின் பொறுப்புணர்வு, சிக்கல் தீர்வு, வாங்குபவர் அறிமுகங்கள்.'
    ),
    eyebrow: 'Women Circles',
    title: t('Twenty founders in your district, every month.', 'உங்கள் மாவட்டத்தில் இருபது நிறுவனர்கள், ஒவ்வொரு மாதமும்.'),
    lede: t(
      'A chapter of 20–30 women founders that meets monthly for accountability, problem-solving and introductions to buyers.',
      'பொறுப்புணர்வு, சிக்கல் தீர்வு மற்றும் வாங்குபவர் அறிமுகங்களுக்காக மாதந்தோறும் சந்திக்கும் 20–30 பெண் நிறுவனர்களின் குழு.'
    ),
    art: { variant: 'map', seed: 21, label: t('Women Circles, by district', 'மாவட்ட வாரியாக Women Circles') },
    primary: { label: 'Join a Circle', labelTa: 'ஒரு Circle-இல் இணையுங்கள்', snx: 'circle' },
    secondary: { label: 'Start a Circle in your district', labelTa: 'உங்கள் மாவட்டத்தில் ஒரு Circle தொடங்குங்கள்', short: 'Start a Circle', shortTa: 'Circle தொடங்குங்கள்', snx: 'startCircle' },
    facts: [
      { label: t('Who', 'யார்'), value: t('20–30 women founders per chapter', 'ஒரு குழுவுக்கு 20–30 பெண் நிறுவனர்கள்') },
      { label: t('How often', 'எத்தனை முறை'), value: t('Monthly', 'மாதந்தோறும்') },
      { label: t('Where', 'எங்கே'), value: t('Your district', 'உங்கள் மாவட்டம்') },
      { label: t('Language', 'மொழி'), value: t('Tamil-first', 'தமிழுக்கு முன்னுரிமை') },
      { label: t('Membership', 'உறுப்பினர் கட்டணம்'), value: <>{t('From ₹10,000 a year', 'ஆண்டுக்கு ₹10,000 முதல்')} <TagChip tag="C" /></> },
      { label: t('CSR-funded places', 'CSR நிதியுதவி இடங்கள்'), value: t('Available', 'உள்ளன') },
    ],
    points: [
      { icon: Users, title: t('Accountability', 'பொறுப்புணர்வு'), body: t('The same chapter of founders meets every month.', 'அதே நிறுவனர் குழு ஒவ்வொரு மாதமும் சந்திக்கிறது.') },
      { icon: MapPin, title: t('Problem-solving', 'சிக்கல் தீர்வு'), body: t('Work through real business problems with founders from your district.', 'உங்கள் மாவட்ட நிறுவனர்களுடன் சேர்ந்து உண்மையான வணிகச் சிக்கல்களைத் தீர்த்திடுங்கள்.') },
      { icon: CalendarDays, title: t('Introductions to buyers', 'வாங்குபவர் அறிமுகங்கள்'), body: t('Market access before money, because revenue makes founders investable.', 'பணத்துக்கு முன் சந்தை அணுகல், ஏனெனில் வருவாயே நிறுவனர்களை முதலீட்டுக்குத் தகுதியானவர்களாக்குகிறது.') },
    ],
    cta: {
      title: t('Find your Circle.', 'உங்கள் Circle-ஐக் கண்டறியுங்கள்.'),
      body: t(
        'Monthly chapters of 20–30 women founders in your district, with peer accountability and introductions to buyers.',
        'உங்கள் மாவட்டத்தில் 20–30 பெண் நிறுவனர்கள் கொண்ட மாதாந்திரக் குழுக்கள்; சக நிறுவனர்களின் பொறுப்புணர்வும் வாங்குபவர் அறிமுகங்களும்.'
      ),
    },
  },
  'rise-academy': {
    // SEO: primary "business course for women entrepreneurs". SEO-TA: pending native review
    seo: t('Rise Academy: business course for women founders', 'Rise Academy: பெண்களுக்கான வணிகப் பயிற்சி'),
    description: t(
      'An app-led business course for women entrepreneurs: business models, finance, digital and ONDC selling, branding and compliance, with a 1:1 mentor.',
      'பெண் தொழில்முனைவோருக்கான செயலி வழி வணிகப் பயிற்சி: வணிக மாதிரி, நிதி, டிஜிட்டல் மற்றும் ONDC விற்பனை, பிராண்டிங், சட்ட இணக்கம்; 1:1 வழிகாட்டியுடன்.'
    ),
    eyebrow: 'Rise Academy',
    title: t('Learn the business side, with a mentor beside you.', 'உங்களுடன் ஒரு வழிகாட்டி இருக்க, தொழிலின் வணிகப் பக்கத்தைக் கற்றுக்கொள்ளுங்கள்.'),
    lede: t(
      'Business models, finance, digital and ONDC selling, branding and compliance, on your phone, in Tamil or English, paired with a 1:1 mentor.',
      'வணிக மாதிரிகள், நிதி, டிஜிட்டல் மற்றும் ONDC விற்பனை, பிராண்டிங், சட்ட இணக்கம்: உங்கள் கைபேசியில், தமிழில் அல்லது ஆங்கிலத்தில், தனிப்பட்ட (1:1) வழிகாட்டியுடன்.'
    ),
    art: { variant: 'ladder', seed: 12, label: 'Rise Academy' },
    primary: { label: 'Start Rise Academy', labelTa: 'Rise Academy-ஐத் தொடங்குங்கள்', snx: 'rise' },
    microcopy: t('Ask about sponsored seats.', 'நிதியுதவி பெற்ற இடங்கள் பற்றிக் கேளுங்கள்.'),
    facts: [
      { label: t('Format', 'வடிவம்'), value: t('App-led, on your phone', 'செயலி வழியாக, உங்கள் கைபேசியில்') },
      { label: t('Mentor', 'வழிகாட்டி'), value: '1:1' },
      { label: t('Language', 'மொழி'), value: t('Tamil or English', 'தமிழ் அல்லது ஆங்கிலம்') },
      { label: t('Fee', 'கட்டணம்'), value: <><Placeholder>[placeholder — CSR-subsidised; indicative ₹5,000–15,000]</Placeholder> <TagChip tag="C" /></> },
    ],
    modules: [
      t('Business models', 'வணிக மாதிரிகள்'),
      t('Finance', 'நிதி'),
      t('Digital and ONDC selling', 'டிஜிட்டல் மற்றும் ONDC விற்பனை'),
      t('Branding', 'பிராண்டிங்'),
      t('Compliance', 'சட்ட இணக்கம்'),
    ],
    cta: { title: t('Start Rise Academy.', 'Rise Academy-ஐத் தொடங்குங்கள்.'), body: t('Ask about sponsored seats.', 'நிதியுதவி பெற்ற இடங்கள் பற்றிக் கேளுங்கள்.') },
  },
  hercapital: {
    // SEO: primary "women entrepreneur schemes Tamil Nadu", secondary "Vetri Magalir loan" (Book 1 §9.2; schemes as named
    // on this page). SEO-TA: pending native review ("பெண் தொழில்முனைவோர் திட்டம்", "பெண்களுக்கான தொழில் கடன்")
    seo: t('HerCapital: funding schemes for women founders', 'HerCapital: பெண் தொழில்முனைவோர் நிதித் திட்டங்கள்'),
    description: t(
      "Get investment-ready and apply to women entrepreneur schemes such as StartupTN's TANSEED and TIIC's Vetri Magalir loans. Book a readiness review.",
      'முதலீட்டுக்குத் தயாராகி, TANSEED, TIIC Vetri Magalir கடன் போன்ற பெண் தொழில்முனைவோர் திட்டங்களுக்கும் பெண்களுக்கான தொழில் கடனுக்கும் விண்ணப்பிக்க உதவி.'
    ),
    eyebrow: 'HerCapital',
    title: t("Get ready for the money that's already there.", 'ஏற்கெனவே உள்ள நிதிக்குத் தயாராகுங்கள்.'),
    lede: t(
      "We help you prepare for investors and apply to schemes for women-led businesses, including StartupTN's TANSEED (up to ₹15 L for women-led startups), TIIC's Vetri Magalir loans (₹10 L to ₹5 Cr) and NITI Aayog's Women Entrepreneurship Platform.",
      'முதலீட்டாளர்களுக்குத் தயாராகவும், பெண்கள் தலைமையிலான தொழில்களுக்கான திட்டங்களுக்கு விண்ணப்பிக்கவும் உதவுகிறோம்: StartupTN-இன் TANSEED (பெண்கள் தலைமையிலான ஸ்டார்ட்அப்களுக்கு ₹15 லட்சம் வரை), TIIC-இன் Vetri Magalir கடன்கள் (₹10 லட்சம் முதல் ₹5 கோடி வரை), NITI Aayog-இன் Women Entrepreneurship Platform.'
    ),
    art: { variant: 'network', seed: 5, label: 'HerCapital' },
    primary: { label: 'Book a readiness review', labelTa: 'தயார்நிலை மதிப்பாய்வை முன்பதிவு செய்யுங்கள்', short: 'Book a review', shortTa: 'மதிப்பாய்வை முன்பதிவு செய்யுங்கள்', snx: 'readiness' },
    microcopy: t(
      'We help you prepare and apply. Decisions on grants and loans are made by the scheme, not by StartNet.',
      'நீங்கள் தயாராகவும் விண்ணப்பிக்கவும் உதவுகிறோம். மானியங்கள் மற்றும் கடன்கள் பற்றிய முடிவுகளை StartNet அல்ல, அந்தந்தத் திட்டமே எடுக்கிறது.'
    ),
    facts: [
      { label: t('What', 'என்ன'), value: t('Investment readiness and scheme applications', 'முதலீட்டுத் தயார்நிலையும் திட்ட விண்ணப்பங்களும்') },
      { label: t('Schemes', 'திட்டங்கள்'), value: 'TANSEED · Vetri Magalir · Women Entrepreneurship Platform' },
      { label: t('Amounts', 'தொகைகள்'), value: <>{t('As published by each scheme; verify before launch', 'ஒவ்வொரு திட்டமும் வெளியிட்டபடி; வெளியீட்டுக்கு முன் சரிபார்க்கவும்')} <TagChip tag="B" /></> },
      { label: t('Women angel circle', 'பெண் ஏஞ்சல் முதலீட்டாளர் குழு'), value: <>{t('Planned', 'திட்டமிடப்பட்டுள்ளது')} <span className="women-proposed">{t('[proposed]', '[முன்மொழியப்பட்டது]')}</span></> },
    ],
    cta: {
      title: t('Book a readiness review.', 'தயார்நிலை மதிப்பாய்வை முன்பதிவு செய்யுங்கள்.'),
      body: t(
        'We help you prepare and apply. Decisions on grants and loans are made by the scheme, not by StartNet.',
        'நீங்கள் தயாராகவும் விண்ணப்பிக்கவும் உதவுகிறோம். மானியங்கள் மற்றும் கடன்கள் பற்றிய முடிவுகளை StartNet அல்ல, அந்தந்தத் திட்டமே எடுக்கிறது.'
      ),
    },
  },
  summit: {
    // SEO: primary "women founders summit Tamil Nadu". SEO-TA: pending native review
    seo: t('Women Founders Summit & Awards, Tamil Nadu', 'பெண் நிறுவனர்கள் மாநாடு & விருதுகள்'),
    description: t(
      'The annual StartNet Women flagship for women entrepreneurs in Tamil Nadu: founders on stage, awards from an independent jury and the TN Women Founders Report.',
      'தமிழ்நாட்டுப் பெண் தொழில்முனைவோருக்கான StartNet Women ஆண்டு முதன்மை நிகழ்வு: மேடையில் நிறுவனர்கள், சுயாதீன நடுவர் விருதுகள், TN Women Founders Report.'
    ),
    eyebrow: 'Women Founders Summit & Awards',
    title: t('A day for the founders, and the numbers behind them.', 'நிறுவனர்களுக்கும், அவர்களின் பின்னால் உள்ள எண்களுக்குமான ஒரு நாள்.'),
    lede: t(
      'The annual flagship: founders on stage, awards decided by an independent jury, and the launch of the TN Women Founders Report.',
      'ஆண்டு முதன்மை நிகழ்வு: மேடையில் நிறுவனர்கள், சுயாதீன நடுவர் குழு முடிவு செய்யும் விருதுகள், TN Women Founders Report வெளியீடு.'
    ),
    art: { variant: 'dot', seed: 8, label: 'Women Founders Summit' },
    primary: { label: 'Register interest', labelTa: 'ஆர்வத்தைப் பதிவு செய்யுங்கள்', snx: 'summit' },
    secondary: { label: 'Nominate a founder', labelTa: 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்', to: '/women/summit#nominate' },
    tertiary: { label: 'Sponsor the Summit', labelTa: 'Summit-க்கு நிதியுதவி செய்யுங்கள்', to: '/partner/sponsors' },
    facts: [
      // Date and venue: hidden until StartNet supplies them.
      { label: t('Jury', 'நடுவர் குழு'), value: t('Independent', 'சுயாதீனமானது') },
      { label: t('Launch', 'வெளியீடு'), value: 'TN Women Founders Report' },
      { label: t('On stage', 'மேடையில்'), value: t('Women founders', 'பெண் நிறுவனர்கள்') },
    ],
    cta: {
      title: t('Sponsor the Summit.', 'Summit-க்கு நிதியுதவி செய்யுங்கள்.'),
      body: t(
        'The annual StartNet Women flagship, where the TN Women Founders Report is launched and women founders are recognised.',
        'TN Women Founders Report வெளியிடப்பட்டு, பெண் நிறுவனர்கள் கௌரவிக்கப்படும் StartNet Women-இன் ஆண்டு முதன்மை நிகழ்வு.'
      ),
    },
  },
});

export default function WomenSub() {
  const { slug } = useParams();
  // Known slugs only: "/women/constructor" or "/women/__proto__" must render NotFound, not an inherited member (F-60).
  if (typeof slug !== 'string' || !WOMEN_SUB_SLUGS.includes(slug)) return <NotFound />;
  return <WomenSubPage slug={slug} />;
}

function WomenSubPage({ slug }) {
  const { t, lang } = useLang();
  const page = pagesFor(t)[slug];
  const src = `women-${slug}`;
  const snx = (key) => snxLink(SNX[key].path, { ...SNX[key].params, brand: 'women', lang, src });
  const action = (a, variant, size) => {
    if (!a) return null;
    const label = t(a.label, a.labelTa);
    const inner = a.short ? <FitLabel long={label} short={t(a.short, a.shortTa)} /> : label;
    return a.snx ? (
      <Button key={a.label} variant={variant} size={size} href={snx(a.snx)}>{inner}</Button>
    ) : (
      <Button key={a.label} variant={variant} size={size} to={a.to}>{inner}</Button>
    );
  };
  // The bottom bar mirrors the page's primary action (the brand default would link to /women/circles itself).
  const p = page.primary;
  usePageCta({
    label: p.label, labelTa: p.labelTa,
    shortLabel: p.short || p.label, shortLabelTa: p.shortTa || p.labelTa,
    ...(p.snx ? { href: snx(p.snx) } : { to: p.to }),
    brand: 'women',
  });
  const summitEvents = useApi(slug === 'summit' ? '/api/events?brand=women&when=upcoming' : null);
  const summits = (Array.isArray(summitEvents.data) ? summitEvents.data : []).filter((e) => /summit/i.test(`${e.series || ''} ${e.title || ''}`));

  return (
    <>
      <Seo
        title={page.seo}
        description={page.description}
        jsonLd={[
          pageLd({ path: `/women/${slug}`, lang, name: page.seo, description: page.description }),
          // Rise Academy is a course (Book 1 §9.4): app-led, Tamil or English. Fee is a placeholder, so no price.
          slug === 'rise-academy'
            ? courseLd({ name: 'Rise Academy', description: page.description, path: '/women/rise-academy', lang, inLanguage: ['en', 'ta'], courseMode: 'online' })
            : null,
        ]}
      />

      <BrandHero
        brand="women"
        compact
        title={page.title}
        lede={page.lede}
        endorsement={t('a StartNet Women programme', 'ஒரு StartNet Women திட்டம்')}
        art={{ ...page.art, brand: 'women', ratio: '3/2', alt: '' }}
        actions={
          <>
            {action(page.primary, 'brand', 'lg')}
            {action(page.secondary, 'secondary', 'lg')}
            {action(page.tertiary, 'tertiary', 'lg')}
          </>
        }
        meta={page.microcopy ? <p className="caption">{page.microcopy}</p> : null}
      />

      <Section surface="white">
        <div className="split split--8-4 women-sub__layout">
          <div className="women-sub__main stack">
            {slug === 'circles' && <CirclesBody page={page} />}
            {slug === 'rise-academy' && <RiseBody page={page} />}
            {slug === 'hercapital' && <HerCapitalBody />}
            {slug === 'summit' && <SummitBody summits={summits} />}
          </div>
          <div className="women-sub__aside">
            <KeyFacts
              title={page.eyebrow}
              items={page.facts}
              action={action(page.primary, 'brand')}
            />
          </div>
        </div>
      </Section>

      {slug === 'summit' && (
        <Section id="nominate" labelledBy="women-sub-nominate">
          <div className="split split--8-4">
            <div className="stack">
              <p className="eyebrow"><Award aria-hidden="true" size={16} className="women-inline-icon" /> {t('Awards', 'விருதுகள்')}</p>
              <h2 id="women-sub-nominate" className="h2">{t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}<span className="dot">.</span></h2>
              <p className="text-2">
                {t('Founders on stage, awards decided by an independent jury', 'மேடையில் நிறுவனர்கள், சுயாதீன நடுவர் குழு முடிவு செய்யும் விருதுகள்')}.
              </p>
              <NominationForm src={src} />
            </div>
          </div>
        </Section>
      )}

      {slug !== 'summit' && (
        <WomenStories limit={6} surface="sunken">
          <SectionHeader
            eyebrow={t('Stories', 'கதைகள்')}
            title={t('Women founders, with outcomes.', 'பெண் நிறுவனர்கள், விளைவுகளுடன்.')}
            action={<Button variant="tertiary" to="/insights/stories?brand=women">{t('All Women stories', 'அனைத்து Women கதைகளும்')}</Button>}
          />
        </WomenStories>
      )}

      <CTABand
        surface="paper"
        brand="women"
        className="brand-close"
        title={page.cta.title}
        body={page.cta.body}
        actions={
          <>
            {slug === 'summit' ? action(page.tertiary, 'brand') : action(page.primary, 'brand')}
            <Button variant="whatsapp" href={waLink('WOMEN', src)}>{t('Chat on WhatsApp', TA.chatWhatsApp)}</Button>
          </>
        }
      />
    </>
  );
}

function CirclesBody({ page }) {
  const { t } = useLang();
  return (
    <>
      <RevealGroup as="ul" className="women-sub__points">
        {page.points.map((p) => (
          <li key={p.title} className="women-sub__point">
            <p.icon aria-hidden="true" size={22} className="women-sub__point-icon" />
            <h2 className="h5">{p.title}</h2>
            <p className="text-2 small">{p.body}</p>
          </li>
        ))}
      </RevealGroup>
      <div className="women-sub__finder" id="find">
        <h2 className="h2">{t('Find a Circle in your district', 'உங்கள் மாவட்டத்தில் ஒரு Circle-ஐக் கண்டறியுங்கள்')}<span className="dot">.</span></h2>
        <CircleFinder src="women-circles" />
      </div>
    </>
  );
}

function RiseBody({ page }) {
  const { t } = useLang();
  return (
    <>
      <h2 className="h2">{t('What you learn', 'நீங்கள் கற்பவை')}<span className="dot">.</span></h2>
      <ol className="women-sub__modules">
        {page.modules.map((m, i) => (
          <Reveal as="li" key={m} delay={i * 0.04} className="women-sub__module">
            <span className="women-sub__module-num tnum">{String(i + 1).padStart(2, '0')}</span>
            <span className="h4">{m}</span>
          </Reveal>
        ))}
      </ol>
      <div className="women-sub__how">
        <div className="women-sub__how-item"><Smartphone aria-hidden="true" size={22} /><p><strong>{t('On your phone.', 'உங்கள் கைபேசியில்.')}</strong> {t('App-led.', 'செயலி வழியாக.')}</p></div>
        <div className="women-sub__how-item"><Users aria-hidden="true" size={22} /><p><strong>{t('A 1:1 mentor.', 'தனிப்பட்ட (1:1) வழிகாட்டி.')}</strong> {t('Beside you as you learn.', 'நீங்கள் கற்கும்போது உங்களுடன்.')}</p></div>
        <div className="women-sub__how-item"><Languages aria-hidden="true" size={22} /><p><strong>{t('Tamil or English.', 'தமிழ் அல்லது ஆங்கிலம்.')}</strong></p></div>
      </div>
    </>
  );
}

function HerCapitalBody() {
  const { t } = useLang();
  return (
    <>
      <h2 className="h2">{t('Check your readiness for each scheme', 'ஒவ்வொரு திட்டத்துக்குமான உங்கள் தயார்நிலையைச் சரிபாருங்கள்')}<span className="dot">.</span></h2>
      {/* This page is HerCapital: no "About HerCapital" self-link (F-63). */}
      <SchemeExplorer src="women-hercapital" hideAboutLink />
      <div className="women-sub__note" id="launch">
        <p className="small text-2">
          {t('A women angel circle is planned', 'பெண் ஏஞ்சல் முதலீட்டாளர் குழு திட்டமிடப்பட்டுள்ளது')} <span className="women-proposed">{t('[proposed]', '[முன்மொழியப்பட்டது]')}</span>.
        </p>
      </div>
    </>
  );
}

function SummitBody({ summits }) {
  const { t } = useLang();
  return (
    <>
      <div className="women-sub__summit-art">
        <ArtImage variant="dot" brand="women" ratio="21/9" seed={8} alt="" label="TN Women Founders Report" />
      </div>
      <h2 className="h2">{t('At the Summit', 'Summit-இல்')}<span className="dot">.</span></h2>
      <ul className="women-sub__points">
        <li className="women-sub__point">
          <Users aria-hidden="true" size={22} className="women-sub__point-icon" />
          <h3 className="h5">{t('Founders on stage', 'மேடையில் நிறுவனர்கள்')}</h3>
          <p className="text-2 small">{t('The annual StartNet Women flagship.', 'StartNet Women-இன் ஆண்டு முதன்மை நிகழ்வு.')}</p>
        </li>
        <li className="women-sub__point">
          <Award aria-hidden="true" size={22} className="women-sub__point-icon" />
          <h3 className="h5">{t('Awards', 'விருதுகள்')}</h3>
          <p className="text-2 small">{t('Decided by an independent jury', 'சுயாதீன நடுவர் குழு முடிவு செய்யும்')}.</p>
        </li>
        <li className="women-sub__point">
          <CalendarDays aria-hidden="true" size={22} className="women-sub__point-icon" />
          <h3 className="h5">{t('The report', 'அறிக்கை')}</h3>
          <p className="text-2 small">{t('The launch of the TN Women Founders Report.', 'TN Women Founders Report வெளியீடு.')}</p>
        </li>
      </ul>
      {summits.length > 0 && (
        <div className="grid grid-2">
          {summits.map((e) => <EventCard key={e.slug} event={e} />)}
        </div>
      )}
    </>
  );
}
