// /events/host — "Host or co-host an event" (Book 1 Part B §2.2: T19, audience institutions & govt, CTA Enquire, P2).
// Copy sources: Book 2 §5.1 (host band, hub sub-head), §4/§3 Vibe Campus + Clubs, §8 Institutions / Government / Sponsors,
// Book 1 §4.x co-host kit + "co-hosts are credited once the event has taken place", §3.7 breadcrumbs, §9.3 routing.
// Form posts to /api/forms/host (server FORM_RULES.host: name, email, phone, organisation, district, format, message).
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, Building2, GraduationCap, Landmark, Users, Check, Languages, MessageCircle,
} from 'lucide-react';
import {
  Seo, PageHero, SectionHeader, Card, Badge, Steps, Accordion, CTABand, Button, SmartForm,
  FactBand, Reveal, RevealGroup, Skeleton,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { waLink } from '../../../lib/links.js';
import { useApi } from '../../../hooks/useApi.js';
import { districtOptions } from './districts.js';
import { useSlidingIndicator } from '../../../components/_indicator.js';
import './HostEvent.css';

const METRIC_KEYS = ['vibathon-2027-host-colleges-target', 'districts-target-fy27', 'events-run'];

export default function HostEvent() {
  const { t, lang, localePath } = useLang();
  const { data: metricsData, loading: metricsLoading } = useApi(`/api/metrics?key=${METRIC_KEYS.join(',')}`);

  const pickMetric = (key, label) => {
    const list = Array.isArray(metricsData) ? metricsData : [];
    const m = list.find((x) => x.key === key || x.id === key);
    return m ? { ...m, label } : null;
  };
  const metrics = [
    pickMetric('vibathon-2027-host-colleges-target', t('host colleges for Vibathon 2027 (target)', 'Vibathon 2027-க்கான நடத்துநர் கல்லூரிகள் (இலக்கு)')),
    pickMetric('districts-target-fy27', t('districts in FY27 (target)', 'FY27-இல் மாவட்டங்கள் (இலக்கு)')),
    pickMetric('events-run', t('events run so far', 'இதுவரை நடத்திய நிகழ்வுகள்')),
  ].filter(Boolean);

  const sections = [
    { id: 'who', label: t('Who can host', 'யார் நடத்தலாம்') },
    { id: 'formats', label: t('Formats', 'வடிவங்கள்') },
    { id: 'provide', label: t('What StartNet provides', 'StartNet தருவது') },
    { id: 'steps', label: t('How it works', 'எப்படிச் செயல்படுகிறது') },
    { id: 'host-form', label: t('Enquire', 'விசாரிக்க') },
    { id: 'faq', label: t('Questions', 'கேள்விகள்') },
  ];

  // In-page nav scroll-spy: the section in the reading band is marked aria-current and a 2px Ink rule glides to it.
  const [spy, setSpy] = useState(null);
  const tocRef = useRef(null);
  const sectionIds = sections.map((s) => s.id).join(',');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = sectionIds.split(',').map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => seen.set(en.target.id, en.isIntersecting));
        const hit = els.find((el) => seen.get(el.id));
        if (hit) setSpy(hit.id);
        else if (els[0].getBoundingClientRect().top > window.innerHeight * 0.3) setSpy(null); // above the first section
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectionIds]);
  useSlidingIndicator(tocRef, '[aria-current]', [spy]);

  const hosts = [
    {
      icon: GraduationCap,
      title: t('Colleges and universities', 'கல்லூரிகள், பல்கலைக்கழகங்கள்'),
      body: t(
        'Run events with your Institution’s Innovation Council: start with a Vibe Campus night or a district Vibathon, then become a Vibathon host college.',
        'உங்கள் நிறுவனத்தின் புத்தாக்கக் குழுவுடன் (IIC) நிகழ்வுகளை நடத்துங்கள்: Vibe Campus இரவு அல்லது மாவட்ட Vibathon-இல் தொடங்கி, Vibathon நடத்துநர் கல்லூரியாகுங்கள்.'
      ),
      to: '/partner/institutions',
      link: t('For institutions', 'கல்வி நிறுவனங்களுக்கு'),
    },
    {
      icon: Landmark,
      title: t('Districts and government', 'மாவட்டங்களும் அரசுத் துறைகளும்'),
      body: t(
        'Co-host a flagship or a district edition, and see the results reported with tagged data for your district.',
        'முதன்மை நிகழ்வையோ மாவட்டப் பதிப்பையோ இணைந்து நடத்துங்கள்; உங்கள் மாவட்டத்துக்கான முடிவுகள் குறிச்சொல் இட்ட தரவுகளுடன் அறிக்கையிடப்படும்.'
      ),
      to: '/partner/government',
      link: t('For government', 'அரசுக்கு'),
    },
    {
      icon: Building2,
      title: t('Sector bodies, GCCs and companies', 'துறை அமைப்புகள், GCC-கள், நிறுவனங்கள்'),
      body: t(
        'Co-host a sector Connect or a meet-up at your office. We co-host with sector bodies wherever we can, rather than duplicate them.',
        'துறை Connect நிகழ்வையோ உங்கள் அலுவலகத்தில் ஒரு சந்திப்பையோ இணைந்து நடத்துங்கள். துறை அமைப்புகளுடன் போட்டியிடாமல், இயன்றவரை இணைந்தே நடத்துகிறோம்.'
      ),
      to: '/partner/gccs',
      link: t('For GCCs and corporates', 'GCC-கள், நிறுவனங்களுக்கு'),
    },
    {
      icon: Users,
      title: t('Student clubs and communities', 'மாணவர் மன்றங்கள், சமூகக் குழுக்கள்'),
      body: t(
        'Vibe Clubs run a Vibe Campus night each term. Women Circles bring women founders in a district together.',
        'Vibe Clubs ஒவ்வொரு பருவத்திலும் ஒரு Vibe Campus இரவை நடத்துகின்றன. Women Circles ஒரு மாவட்டத்தின் பெண் நிறுவனர்களை ஒன்றிணைக்கின்றன.'
      ),
      to: '/vibe/clubs',
      link: t('Start a Vibe Club', 'Vibe Club தொடங்குங்கள்'),
    },
  ];

  const formats = [
    {
      key: 'vibe-campus',
      brand: 'vibe',
      title: 'Vibe Campus',
      who: t('Colleges', 'கல்லூரிகள்'),
      body: t(
        'Talks, build nights, founder fireside chats and idea pitches in your college, run with your Institution’s Innovation Council.',
        'உங்கள் கல்லூரியில் உரைகள், உருவாக்க இரவுகள், நிறுவனர் உரையாடல்கள், யோசனை முன்வைப்புகள் — உங்கள் நிறுவனத்தின் புத்தாக்கக் குழுவுடன் இணைந்து.'
      ),
      to: '/vibe/campus',
    },
    {
      key: 'vibathon-qualifier',
      brand: 'vibe',
      title: t('Vibathon district qualifier', 'Vibathon மாவட்டத் தகுதிச் சுற்று'),
      who: t('Host colleges', 'நடத்துநர் கல்லூரிகள்'),
      body: t(
        'Host a qualifier plus a year of Vibe Campus events. Teams build with AI in your district and the best go on to the state finale.',
        'ஒரு தகுதிச் சுற்றையும் ஓராண்டு Vibe Campus நிகழ்வுகளையும் நடத்துங்கள். உங்கள் மாவட்டத்தில் அணிகள் AI கொண்டு உருவாக்கும்; சிறந்தவை மாநில இறுதிப் போட்டிக்குச் செல்லும்.'
      ),
      to: '/vibe/for-colleges',
    },
    {
      key: 'connect-meetup',
      brand: 'connect',
      title: t('Sector Connect meet-up', 'துறை Connect சந்திப்பு'),
      who: t('Sector bodies, GCCs, companies', 'துறை அமைப்புகள், GCC-கள், நிறுவனங்கள்'),
      body: t(
        'Each Connect is a community, not a single date: a flagship event, monthly meet-ups, a sector report and a Circle. Host a meet-up in your city.',
        'ஒவ்வொரு Connect-உம் ஒரு நாள் நிகழ்வு அல்ல, ஒரு சமூகம்: முதன்மை நிகழ்வு, மாதாந்திரச் சந்திப்புகள், துறை அறிக்கை, ஒரு Circle. உங்கள் நகரில் ஒரு சந்திப்பை நடத்துங்கள்.'
      ),
      to: '/connect/series',
    },
    {
      key: 'research-day',
      brand: 'research',
      title: t('Research Day', 'Research Day'),
      who: t('Universities and research institutions', 'பல்கலைக்கழகங்கள், ஆய்வு நிறுவனங்கள்'),
      body: t(
        'A day for scholars and faculty to meet StartNet Research and explore the route from lab to market.',
        'ஆய்வாளர்களும் ஆசிரியர்களும் StartNet Research-ஐச் சந்தித்து, ஆய்வகத்திலிருந்து சந்தைக்கான பாதையை அறியும் ஒரு நாள்.'
      ),
      to: '/research',
    },
    {
      key: 'women-circle',
      brand: 'women',
      title: 'Women Circle',
      who: t('Colleges, communities, workplaces', 'கல்லூரிகள், சமூகக் குழுக்கள், பணியிடங்கள்'),
      body: t(
        'A district Circle for women founders and women who want to start, in Tamil or English.',
        'பெண் நிறுவனர்களுக்கும் தொடங்க விரும்பும் பெண்களுக்கும் ஒரு மாவட்ட Circle — தமிழிலோ ஆங்கிலத்திலோ.'
      ),
      to: '/women/circles',
    },
    {
      key: 'district-edition',
      brand: null,
      title: t('District edition', 'மாவட்டப் பதிப்பு'),
      who: t('District administrations, with local colleges', 'மாவட்ட நிர்வாகங்கள், உள்ளூர்க் கல்லூரிகளுடன்'),
      body: t(
        'An all-brand StartNet day in your district, part of a District Ecosystem Programme.',
        'உங்கள் மாவட்டத்தில் அனைத்து பிராண்டுகளும் இணையும் StartNet நாள் — மாவட்டச் சூழல் அமைப்புத் திட்டத்தின் ஒரு பகுதி.'
      ),
      to: '/partner/district-programme',
    },
  ];

  const provides = [
    t('A tested format and run-sheet for the event you choose.', 'நீங்கள் தேர்ந்தெடுக்கும் நிகழ்வுக்குச் சோதிக்கப்பட்ட வடிவமும் நடைமுறைத் திட்டமும்.'),
    t('Speakers and mentors from the StartNet network, briefed before the day.', 'StartNet வலையமைப்பிலிருந்து பேச்சாளர்களும் வழிகாட்டிகளும், முன்கூட்டியே விளக்கப்பட்டு.'),
    t('Registration on StartNet X or WhatsApp, with a QR ticket for every attendee.', 'StartNet X அல்லது WhatsApp வழியாகப் பதிவு; ஒவ்வொருவருக்கும் QR டிக்கெட்.'),
    t('A co-host kit: tagged links, an embeddable event card and a partner badge.', 'இணை நடத்துநர் தொகுப்பு: குறியிட்ட இணைப்புகள், உட்பொதிக்கக்கூடிய நிகழ்வு அட்டை, கூட்டாளர் பேட்ஜ்.'),
    t('A next step for every attendee: a StartNet X profile and a programme that fits.', 'ஒவ்வொருவருக்கும் அடுத்த படி: StartNet X சுயவிவரமும் பொருத்தமான திட்டமும்.'),
    t('Results shared back to you: tagged attendance and what happened next.', 'முடிவுகள் உங்களுக்கே: குறிச்சொல் இட்ட வருகை எண்ணிக்கையும் அடுத்து நடந்தவையும்.'),
  ];
  const brings = [
    t('A venue, or an online room, and a date window.', 'ஓர் அரங்கம் அல்லது இணைய அறை, ஒரு தேதி வரம்பு.'),
    t('A named coordinator who can work with our team.', 'எங்கள் குழுவுடன் இணைந்து பணியாற்றும் ஒரு பொறுப்பாளர்.'),
    t('Your audience: students, faculty, professionals or founders.', 'உங்கள் பார்வையாளர்கள்: மாணவர்கள், ஆசிரியர்கள், தொழில்முறையாளர்கள் அல்லது நிறுவனர்கள்.'),
    t('For colleges: your Institution’s Innovation Council.', 'கல்லூரிகளுக்கு: உங்கள் நிறுவனத்தின் புத்தாக்கக் குழு (IIC).'),
  ];

  const steps = [
    {
      title: t('Tell us', 'எங்களிடம் சொல்லுங்கள்'),
      body: t('Fill in the short form below: who you are, your district and the format you have in mind.', 'கீழே உள்ள சிறிய படிவத்தை நிரப்புங்கள்: நீங்கள் யார், உங்கள் மாவட்டம், நீங்கள் நினைக்கும் வடிவம்.'),
    },
    {
      title: t('Talk it through', 'கலந்து பேசுங்கள்'),
      body: t('The team that owns your format replies with a reference number and books a call.', 'உங்கள் வடிவத்துக்குப் பொறுப்பான குழு ஒரு குறிப்பு எண்ணுடன் பதிலளித்து அழைப்பை ஏற்பாடு செய்யும்.'),
    },
    {
      title: t('Agree the plan', 'திட்டத்தை உறுதிசெய்யுங்கள்'),
      body: t('Format, date, language and roles are agreed and signed before anything is announced.', 'எதையும் அறிவிப்பதற்கு முன் வடிவம், தேதி, மொழி, பொறுப்புகள் ஒப்புக்கொள்ளப்பட்டுக் கையெழுத்திடப்படும்.'),
    },
    {
      title: t('Publish and register', 'வெளியிட்டுப் பதிவு செய்யுங்கள்'),
      body: t('The event goes on the StartNet calendar and registration opens on StartNet X and WhatsApp.', 'நிகழ்வு StartNet நாட்காட்டியில் இடம்பெறும்; StartNet X, WhatsApp வழியாகப் பதிவு தொடங்கும்.'),
    },
    {
      title: t('Run it, then report', 'நடத்துங்கள், பின் அறிக்கை'),
      body: t('After the day you get the results, and co-hosts are credited by name on the event page.', 'நிகழ்வுக்குப் பிறகு முடிவுகள் உங்களுக்கு வரும்; இணை நடத்துநர்களின் பெயர் நிகழ்வுப் பக்கத்தில் இடம்பெறும்.'),
    },
  ];

  const faq = [
    {
      id: 'cost',
      question: t('Does it cost anything to host?', 'நடத்த ஏதேனும் செலவு உண்டா?'),
      answer: (
        <p>
          {/* The rate-card link is a placeholder today, so the sentence ends at "rate card". */}
          {t('Most first events are free for attendees. Host and partner packages follow the published rate card.', 'பெரும்பாலான முதல் நிகழ்வுகள் பங்கேற்பாளர்களுக்கு இலவசம். நடத்துநர், கூட்டாளர் தொகுப்புகள் வெளியிடப்படும் கட்டண அட்டவணைப்படி.')}
        </p>
      ),
    },
    {
      id: 'language',
      question: t('Can the event be in Tamil?', 'நிகழ்வைத் தமிழில் நடத்தலாமா?'),
      answer: t('Yes. Events can run in Tamil, English or both. Tell us which works for your audience.', 'ஆம். நிகழ்வுகளைத் தமிழ், ஆங்கிலம் அல்லது இரண்டிலும் நடத்தலாம். உங்கள் பார்வையாளர்களுக்கு எது பொருந்தும் என்று சொல்லுங்கள்.'),
    },
    {
      id: 'credit',
      question: t('Will our name and logo appear?', 'எங்கள் பெயரும் சின்னமும் இடம்பெறுமா?'),
      answer: t(
        'Co-hosts are credited by name once the event has taken place. A logo appears only under a signed agreement with written logo permission.',
        'நிகழ்வு நடந்த பிறகு இணை நடத்துநர்களின் பெயர் இடம்பெறும். கையெழுத்திட்ட ஒப்பந்தமும் எழுத்துபூர்வ சின்ன அனுமதியும் இருந்தால் மட்டுமே சின்னம் இடம்பெறும்.'
      ),
    },
    {
      id: 'data',
      question: t('Who sees attendee details?', 'பங்கேற்பாளர் விவரங்களை யார் பார்ப்பார்கள்?'),
      answer: t(
        'Attendees register on StartNet X. Talent profiles are shared only with people who opt in, and results come back to you as tagged totals.',
        'பங்கேற்பாளர்கள் StartNet X-இல் பதிவு செய்கிறார்கள். ஒப்புதல் அளித்தவர்களின் சுயவிவரங்கள் மட்டுமே பகிரப்படும்; முடிவுகள் குறிச்சொல் இட்ட மொத்த எண்ணிக்கைகளாக உங்களுக்கு வரும்.'
      ),
    },
    {
      id: 'more',
      question: t('We want more than one event. What next?', 'ஒன்றுக்கு மேற்பட்ட நிகழ்வுகள் வேண்டும். அடுத்து என்ன?'),
      answer: (
        <p>
          {t(
            'Colleges can move from a Vibe Campus night to a Vibathon host college and then the Institution Partner Programme. Districts can run a full District Ecosystem Programme.',
            'கல்லூரிகள் Vibe Campus இரவிலிருந்து Vibathon நடத்துநர் கல்லூரியாகி, பின் Institution Partner Programme-இல் இணையலாம். மாவட்டங்கள் முழு மாவட்டச் சூழல் அமைப்புத் திட்டத்தை நடத்தலாம்.'
          )}{' '}
          <Link className="hostev-inline-link" to={localePath('/partner/enquire')}>
            {t('Talk to the partnerships team', 'கூட்டாண்மைக் குழுவிடம் பேசுங்கள்')}
          </Link>
        </p>
      ),
    },
  ];

  const formatOptions = [
    { value: '', label: t('Choose a format', 'வடிவத்தைத் தேர்ந்தெடுக்கவும்') },
    ...formats.map((f) => ({ value: f.key, label: typeof f.title === 'string' ? f.title : f.key })),
    { value: 'not-sure', label: t('Not sure yet', 'இன்னும் உறுதியில்லை') },
  ];

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Host a startup event at your college or district', 'கல்லூரியில் ஸ்டார்ட்அப் நிகழ்வை நடத்துங்கள்')}
        description={t(
          'Host a StartNet event in your Tamil Nadu college or district: Vibe Campus nights, Vibathon qualifiers, sector Connects, Circles and district editions.',
          'உங்கள் கல்லூரியிலோ மாவட்டத்திலோ StartNet நிகழ்வை நடத்துங்கள்: Vibe Campus இரவுகள், Vibathon தகுதிச் சுற்றுகள், துறை Connect-கள், மாவட்டப் பதிப்புகள்.'
        )}
      />

      <PageHero
        eyebrow={t('Events · Take part', 'நிகழ்வுகள் · பங்கேற்க')}
        title={t('Host StartNet in your college or district.', 'உங்கள் கல்லூரியிலோ மாவட்டத்திலோ StartNet-ஐ நடத்துங்கள்.')}
        lede={t(
          'Summits, sector Connects, campus build nights and district editions across Tamil Nadu. You bring the room and the people. We bring the format, the speakers, registration and the follow-through.',
          'தமிழ்நாடு முழுவதும் உச்சி மாநாடுகள், துறை Connect-கள், கல்லூரி உருவாக்க இரவுகள், மாவட்டப் பதிப்புகள். நீங்கள் அரங்கையும் மக்களையும் தாருங்கள். வடிவம், பேச்சாளர்கள், பதிவு, தொடர் நடவடிக்கை ஆகியவற்றை நாங்கள் தருகிறோம்.'
        )}
        breadcrumbs={[
          { label: t('Events', 'நிகழ்வுகள்'), to: '/events' },
          { label: t('Host an event', 'நிகழ்வை நடத்துங்கள்') },
        ]}
        actions={
          <>
            <Button href="#host-form" size="lg" icon={ArrowDown}>
              {t('Enquire about hosting', 'நடத்துவது குறித்து விசாரிக்க')}
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              href={waLink(t('Hi StartNet, I would like to host an event in my college or district.', 'வணக்கம் StartNet, என் கல்லூரியிலோ மாவட்டத்திலோ ஒரு நிகழ்வை நடத்த விரும்புகிறேன்.'), 'events-host')}
              icon={MessageCircle}
            >
              {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
            </Button>
          </>
        }
        art={{ variant: 'map', ratio: '4/5', seed: 38, alt: t('Generative map of Tamil Nadu districts', 'தமிழ்நாட்டு மாவட்டங்களின் வரைகலை வரைபடம்') }}
      />

      {/* The content is one paper sheet sliding over the ink hero (theme.css styles the element after .page-hero). */}
      <div className="hostev-sheet">
      <div className="container hostev-layout">
        <nav className="hostev-toc" aria-label={t('On this page', 'இந்தப் பக்கத்தில்')}>
          <p className="hostev-toc__title eyebrow">{t('On this page', 'இந்தப் பக்கத்தில்')}</p>
          <ul role="list" className="hostev-toc__list" ref={tocRef}>
            {sections.map((s) => (
              <li key={s.id}>
                <a className="hostev-toc__link" href={`#${s.id}`} aria-current={spy === s.id ? 'location' : undefined}>{s.label}</a>
              </li>
            ))}
            <li className="hostev-toc__ind" role="presentation" aria-hidden="true" />
          </ul>
        </nav>

        <div className="hostev-main">
          {/* Who can host */}
          <section id="who" className="hostev-block" aria-labelledby="hostev-who-title">
            <SectionHeader
              eyebrow={t('Who can host', 'யார் நடத்தலாம்')}
              id="hostev-who-title"
              title={t('Any room with people who want to build.', 'உருவாக்க விரும்பும் மக்கள் இருக்கும் எந்த அரங்கமும்.')}
              lede={t('Colleges, districts and partners host StartNet editions.', 'கல்லூரிகள், மாவட்டங்கள், கூட்டாளர்கள் StartNet பதிப்புகளை நடத்துகின்றனர்.')}
            />
            <RevealGroup as="ul" className="hostev-who" role="list">
              {hosts.map((h) => {
                const Icon = h.icon;
                return (
                  <li key={h.to} className="hostev-who__item">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.75} className="hostev-who__icon" />
                    <h3 className="h5 hostev-who__title">{h.title}</h3>
                    <p className="hostev-who__body">{h.body}</p>
                    <Link className="hostev-arrow-link" to={localePath(h.to)}>
                      {h.link} <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  </li>
                );
              })}
            </RevealGroup>
          </section>

          {/* Formats */}
          <section id="formats" className="hostev-block" aria-labelledby="hostev-formats-title">
            <SectionHeader
              eyebrow={t('Formats', 'வடிவங்கள்')}
              id="hostev-formats-title"
              title={t('Pick a format that fits your room.', 'உங்கள் அரங்குக்குப் பொருந்தும் வடிவத்தைத் தேர்ந்தெடுங்கள்.')}
            />
            <RevealGroup className="hostev-formats">
              {formats.map((f) => (
                <Card
                  key={f.key}
                  to={f.to}
                  brand={f.brand || undefined}
                  className="hostev-format"
                  badges={
                    f.brand ? <Badge kind="brand" brand={f.brand} /> : <Badge kind="type">{t('All-brand', 'அனைத்து பிராண்டுகளும்')}</Badge>
                  }
                  title={f.title}
                  body={f.body}
                  meta={
                    <p className="hostev-format__who">
                      <span className="hostev-format__who-label">{t('Hosted by', 'நடத்துபவர்')}:</span> {f.who}
                    </p>
                  }
                />
              ))}
            </RevealGroup>
          </section>

          {/* What StartNet provides / what you bring */}
          <section id="provide" className="hostev-block" aria-labelledby="hostev-provide-title">
            <SectionHeader
              eyebrow={t('What StartNet provides', 'StartNet தருவது')}
              id="hostev-provide-title"
              title={t('You host. We run the format with you.', 'நீங்கள் நடத்துங்கள். வடிவத்தை உங்களுடன் சேர்ந்து நாங்கள் நடத்துகிறோம்.')}
            />
            <div className="hostev-provide">
              <Reveal className="hostev-provide__col hostev-provide__col--ours">
                <h3 className="h5">{t('From StartNet', 'StartNet-இடமிருந்து')}</h3>
                <ul role="list" className="hostev-checks">
                  {provides.map((p) => (
                    <li key={p} className="hostev-checks__item">
                      <Check aria-hidden="true" size={20} strokeWidth={2} className="hostev-checks__icon" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="hostev-provide__col" delay={0.08}>
                <h3 className="h5">{t('From you', 'உங்களிடமிருந்து')}</h3>
                <ul role="list" className="hostev-checks">
                  {brings.map((p) => (
                    <li key={p} className="hostev-checks__item">
                      <span className="hostev-checks__bullet" aria-hidden="true" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="hostev-figures">
              {metricsLoading ? (
                <Skeleton height="7rem" />
              ) : (
                <FactBand
                  metrics={metrics}
                  title={t('Where we are heading', 'நாங்கள் செல்லும் திசை')}
                  footnote={t(
                    'Targets are planning assumptions (tag C) and are never added to counted results (tags A and B).',
                    'இலக்குகள் திட்டமிடல் அனுமானங்கள் (குறி C); அவை எண்ணப்பட்ட முடிவுகளுடன் (குறி A, B) ஒருபோதும் கூட்டப்படுவதில்லை.'
                  )}
                  link={{ label: t('How we count', 'நாங்கள் எப்படி எண்ணுகிறோம்'), to: '/about/evidence-standard' }}
                />
              )}
            </div>
          </section>

          {/* Steps */}
          <section id="steps" className="hostev-block" aria-labelledby="hostev-steps-title">
            <SectionHeader
              eyebrow={t('How it works', 'எப்படிச் செயல்படுகிறது')}
              id="hostev-steps-title"
              title={t('From first message to results, in five steps.', 'முதல் செய்தியிலிருந்து முடிவுகள் வரை, ஐந்து படிகளில்.')}
            />
            <Steps steps={steps} label={t('Steps to host an event', 'நிகழ்வை நடத்துவதற்கான படிகள்')} />
          </section>

          {/* Enquiry form (T13) */}
          <section id="host-form" className="hostev-block hostev-form-wrap" aria-labelledby="hostev-form-title">
            <div className="hostev-form form-card">
              <p className="eyebrow">{t('Enquire', 'விசாரிக்க')}</p>
              <h2 id="hostev-form-title" className="h3">{t('Tell us about your college or district', 'உங்கள் கல்லூரி அல்லது மாவட்டம் பற்றிச் சொல்லுங்கள்')}</h2>
              <p className="hostev-form__intro">
                <Languages aria-hidden="true" size={18} />
                <span>{t('You can write in Tamil or English. Every field not marked optional is required.', 'தமிழிலோ ஆங்கிலத்திலோ எழுதலாம். "விருப்பம்" எனக் குறிக்கப்படாத புலங்கள் அனைத்தும் தேவை.')}</span>
              </p>
              <SmartForm
                type="host"
                className="hostev-form__form"
                fields={[
                  { name: 'name', id: 'hostev-name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
                  { name: 'email', id: 'hostev-email', label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', width: 'half' },
                  { name: 'phone', id: 'hostev-phone', label: t('Mobile (optional)', 'கைபேசி (விருப்பம்)'), type: 'tel', autoComplete: 'tel-national', width: 'half' },
                  {
                    name: 'organisation', id: 'hostev-org', label: t('College, office or organisation', 'கல்லூரி, அலுவலகம் அல்லது நிறுவனம்'),
                    required: true, autoComplete: 'organization',
                  },
                  { name: 'district', id: 'hostev-district', label: t('District', 'மாவட்டம்'), type: 'select', required: true, options: districtOptions(t), width: 'half' },
                  { name: 'format', id: 'hostev-format', label: t('Format', 'வடிவம்'), type: 'select', required: true, options: formatOptions, width: 'half' },
                  {
                    name: 'message', id: 'hostev-message', label: t('Tell us about the event', 'நிகழ்வைப் பற்றிச் சொல்லுங்கள்'), type: 'textarea', required: true,
                    hint: t('Roughly when, how many people, and in which language.', 'தோராயமாக எப்போது, எத்தனை பேர், எந்த மொழியில்.'),
                  },
                ]}
                consents={[
                  {
                    purpose: 'partner',
                    label: t('StartNet may use these details to contact me about hosting an event.', 'நிகழ்வை நடத்துவது குறித்து என்னைத் தொடர்புகொள்ள StartNet இந்த விவரங்களைப் பயன்படுத்தலாம்.'),
                    required: true,
                  },
                  {
                    purpose: 'whatsapp_updates',
                    label: t(
                      'Send me updates on WhatsApp (add your mobile number above). I can stop them any time.',
                      'WhatsApp-இல் தகவல்களை அனுப்புங்கள் (மேலே கைபேசி எண்ணைச் சேர்க்கவும்). எப்போது வேண்டுமானாலும் நிறுத்தலாம்.'
                    ),
                  },
                ]}
                submitLabel={t('Send my enquiry', 'என் விசாரணையை அனுப்பு')}
                successTitle={t('Thanks. Our team will be in touch about hosting.', 'நன்றி. நடத்துவது குறித்து எங்கள் குழு தொடர்புகொள்ளும்.')}
                successBody={t('Expect a reply within two working days.', 'இரண்டு வேலை நாட்களுக்குள் பதிலை எதிர்பார்க்கலாம்.')}
                hidden={{ source: 'events-host', lang }}
              />
            </div>
            <p className="hostev-alt">
              {t('Want to speak or mentor instead?', 'பேச அல்லது வழிகாட்ட விரும்புகிறீர்களா?')}{' '}
              <Link className="hostev-arrow-link" to={localePath('/events/speak')}>
                {t('Speak or mentor', 'பேசுங்கள் அல்லது வழிகாட்டுங்கள்')} <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <span className="hostev-alt__sep" aria-hidden="true">·</span>
              <Link className="hostev-arrow-link" to={localePath('/partner/sponsors')}>
                {t('Sponsor an event', 'நிகழ்வுக்கு நிதியளியுங்கள்')} <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="hostev-block" aria-labelledby="hostev-faq-title">
            <SectionHeader
              eyebrow={t('Questions', 'கேள்விகள்')}
              id="hostev-faq-title"
              title={t('Before you host', 'நடத்துவதற்கு முன்')}
            />
            <Accordion items={faq} faq />
          </section>
        </div>
      </div>
      </div>

      <CTABand
        surface="night"
        title={t('Want StartNet in your district or college?', 'உங்கள் மாவட்டத்திலோ கல்லூரியிலோ StartNet வேண்டுமா?')}
        body={t('Tell us where, and we will find the format that fits.', 'எங்கே என்று சொல்லுங்கள்; பொருந்தும் வடிவத்தை நாங்கள் கண்டறிவோம்.')}
        actions={
          <>
            <Button variant="inverse" href="#host-form" icon={ArrowDown}>
              {t('Host an event', 'நிகழ்வை நடத்துங்கள்')}
            </Button>
            <Button variant="tertiary" to="/events" className="hostev-cta-secondary">
              {t('See upcoming events', 'வரவிருக்கும் நிகழ்வுகளைப் பாருங்கள்')}
            </Button>
          </>
        }
      />
    </>
  );
}
