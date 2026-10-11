// /about/leadership · Leadership & team (T10 People). Copy: Book 2 §2.3 verbatim.
// People come from GET /api/people?group=…; the founding team falls back to the Book 2 copy if the API is empty.
// Tamil: roleTa / bioTa from the API win; the local drafts below are fallbacks (pending native review).
import { useRef, useState } from 'react';
import {
  Seo, PageHero, Section, SectionHeader, RevealGroup, PersonCard, Button, CTABand, TagChip, Skeleton, EventVideos,
} from '../../components';
import { videosForPlace } from '../../data/videos.js';
import { useLang } from '../../lib/i18n.jsx';
import { useApi } from '../../hooks/useApi.js';
import { BRANDS } from '../../data/brands.js';
import { aboutCrumbs, PH, PH_TA, usePillIndicator } from './shared.jsx';
import './Leadership.css';
import '../utility/restKit.css';
import { ORG_REF, compact } from '../../lib/seo.js';
import { hasMarks, pageLd } from '../brands/seoBits.js';
import { realPeople } from '../../components/_placeholders.js';

// SEO: primary "StartNet leadership" (Book 2 §2.3).
// SEO-TA: pending native review
const SEO = {
  title: ['StartNet leadership and team: who runs the network', 'StartNet தலைமையும் குழுவும்: நிறுவனத்தை நடத்துபவர்கள்'],
  description: [
    "Meet StartNet's founding team, brand leads and advisory councils: the people accountable for our Tamil Nadu founder programmes and the numbers we publish.",
    'StartNet நிறுவனர் குழு, பிராண்ட் தலைவர்கள், ஆலோசனைக் குழுக்களைச் சந்தியுங்கள்: தமிழ்நாட்டு நிறுவனர் திட்டங்களுக்கும் எண்களுக்கும் பொறுப்பானவர்கள்.',
  ],
  path: '/about/leadership',
};

const FOUNDERS = [
  {
    slug: 'm-k-elango', name: 'M K Elango', role: 'Founder & CEO', initials: 'ME', group: 'leadership',
    roleTa: 'நிறுவனர் & தலைமைச் செயல் அதிகாரி',
    bio: 'Entrepreneur and strategist. Leads strategy, government and anchor partnerships, and Mission 1 Lakh. Focused on how founders contribute to Tamil Nadu’s $1 trillion economy goal.',
    bioTa: 'தொழில்முனைவோர், உத்தி வகுப்பாளர். உத்தி, அரசு மற்றும் முதன்மைக் கூட்டாண்மைகள், Mission 1 Lakh ஆகியவற்றை வழிநடத்துகிறார். தமிழ்நாட்டின் $1 டிரில்லியன் பொருளாதார இலக்குக்கு நிறுவனர்கள் எப்படிப் பங்களிக்கிறார்கள் என்பதில் கவனம் செலுத்துகிறார்.',
  },
  {
    slug: 'v-nagaraj', name: 'Dr V. Nagaraj', role: 'Co-founder & Chief Innovation Officer', initials: 'VN', group: 'leadership',
    roleTa: 'இணை நிறுவனர் & தலைமைப் புத்தாக்க அதிகாரி',
    bio: 'PhD in Information & Communication Engineering, with 10+ years in teaching, research and AI. Leads StartNet X, Insights and StartNet Labs.',
    bioTa: 'தகவல் மற்றும் தொடர்பியல் பொறியியலில் முனைவர் பட்டம்; கற்பித்தல், ஆய்வு, AI துறைகளில் 10+ ஆண்டு அனுபவம். StartNet X, Insights, StartNet Labs ஆகியவற்றை வழிநடத்துகிறார்.',
  },
  {
    slug: 'poonthamil', name: 'Poonthamil', role: 'Co-founder & COO', initials: 'P', group: 'leadership',
    roleTa: 'இணை நிறுவனர் & தலைமைச் செயல்பாட்டு அதிகாரி',
    bio: 'Media leader who has scaled digital properties to more than 1 million monthly readers. Leads events, media, operations and district delivery.',
    bioTa: 'எண்ணிம ஊடகங்களை மாதம் 10 லட்சத்துக்கும் மேற்பட்ட வாசகர்களுக்கு வளர்த்த ஊடகத் தலைவர். நிகழ்வுகள், ஊடகம், செயல்பாடுகள், மாவட்டச் செயலாக்கத்தை வழிநடத்துகிறார்.',
  },
];

const LEAD_ROLES = [
  { key: 'research', role: ['StartNet Research lead', 'StartNet Research தலைவர்'] },
  { key: 'vibe', role: ['StartNet Vibe lead', 'StartNet Vibe தலைவர்'] },
  { key: 'connect', role: ['StartNet Connect lead', 'StartNet Connect தலைவர்'] },
  { key: 'women', role: ['StartNet Women lead', 'StartNet Women தலைவர்'] },
  { key: 'x', role: ['StartNet X product lead', 'StartNet X தயாரிப்புத் தலைவர்'] },
];

const COUNCILS = [
  { key: 'research', who: ['deans, scientists and GCC heads', 'டீன்கள், விஞ்ஞானிகள், GCC தலைவர்கள்'] },
  { key: 'vibe', who: ['faculty and student representatives', 'ஆசிரியர்கள், மாணவர் பிரதிநிதிகள்'] },
  { key: 'connect', who: ['founders and investors', 'நிறுவனர்கள், முதலீட்டாளர்கள்'] },
  { key: 'women', who: ['women founders and bankers', 'பெண் நிறுவனர்கள், வங்கியாளர்கள்'] },
];

const FILTERS = [
  { id: 'all', label: ['All', 'அனைத்தும்'] },
  { id: 'founders', label: ['Founding team', 'நிறுவனர் குழு'] },
  { id: 'leads', label: ['Brand leads', 'பிராண்ட் தலைவர்கள்'] },
  { id: 'councils', label: ['Advisory councils', 'ஆலோசனைக் குழுக்கள்'] },
];

/** Tamil for placeholder names the API sends in place of a person's name. */
const NAME_PH_TA = {
  [PH]: PH_TA,
  '[placeholder — members, with consent to be named]': '[placeholder — உறுப்பினர்கள், பெயரிட ஒப்புதல் பெற்ற பின்]',
};

/** Local Tamil drafts for the brand-lead and council records (the API's roleTa / bioTa win when present). */
const BRAND_TA = { research: 'Research', vibe: 'Vibe', connect: 'Connect', women: 'Women' };
const COUNCIL_WHO_TA = {
  research: 'டீன்கள், விஞ்ஞானிகள், GCC தலைவர்கள்.',
  vibe: 'ஆசிரியர்கள், மாணவர் பிரதிநிதிகள்.',
  connect: 'நிறுவனர்கள், முதலீட்டாளர்கள்.',
  women: 'பெண் நிறுவனர்கள், வங்கியாளர்கள்.',
};
function localTa(p) {
  const founder = FOUNDERS.find((f) => f.slug === p.slug);
  if (founder) return founder;
  if (p.group === 'brand-leads') {
    if (p.brand === 'x') return { roleTa: 'StartNet X தயாரிப்புத் தலைவர்', bioTa: 'StartNet X தயாரிப்புக்குப் பொறுப்பாளர்.' };
    const name = `StartNet ${BRAND_TA[p.brand] || ''}`.trim();
    return { roleTa: `${name} தலைவர்`, bioTa: `${name}-இன் பார்வையாளர்கள், சேவைகள், கூட்டாளர்கள், விளைவுகள் அனைத்துக்கும் பொறுப்பாளர்.` };
  }
  if (p.group === 'advisory' && BRAND_TA[p.brand]) {
    const b = BRAND_TA[p.brand];
    return {
      roleTa: `StartNet ${b} ஆலோசனைக் குழு`,
      bioTa: `${COUNCIL_WHO_TA[p.brand]} ${b} திட்டங்களை அவற்றின் எழுதப்பட்ட இலக்குகளுடன் ஒப்பிட்டு ஒவ்வொரு காலாண்டும் மறுஆய்வு செய்கிறது.`,
    };
  }
  return {};
}

const asList = (d) => (Array.isArray(d) ? d : []);

/** A person record in the current language (API Tamil fields first, then local drafts). */
function localise(p, t) {
  const local = localTa(p);
  return {
    ...p,
    name: typeof p.name === 'string' && p.name.startsWith('[') ? t(p.name, NAME_PH_TA[p.name]) : p.name,
    role: p.role ? t(p.role, p.roleTa || local.roleTa) : p.role,
    bio: p.bio ? t(p.bio, p.bioTa || local.bioTa) : p.bio,
  };
}

// Renders a <div>: RevealGroup (as="ul") supplies the <li> wrapper around each child.
function PersonWithBio({ person }) {
  return (
    <div className="lead-person">
      <PersonCard person={person} />
      {person.bio && <p className="lead-person__bio">{person.bio}</p>}
    </div>
  );
}

export default function Leadership() {
  const { t, lang } = useLang();
  const seoLd = pageLd({ path: SEO.path, lang, type: 'AboutPage', name: t(...SEO.title), description: t(...SEO.description), about: ORG_REF });
  const [filter, setFilter] = useState('all');
  const filterRef = useRef(null);
  usePillIndicator(filterRef, '[aria-pressed="true"]', [filter]);
  const founders = useApi('/api/people?group=leadership');
  const leads = useApi('/api/people?group=brand-leads');
  const advisory = useApi('/api/people?group=advisory');

  const apiFounders = asList(founders.data);
  const founderList = (apiFounders.length
    ? apiFounders.map((p) => ({ ...FOUNDERS.find((f) => f.slug === p.slug || f.name === p.name), ...p }))
    : FOUNDERS
  ).map((p) => localise(p, t));
  // Named people only: until StartNet supplies names, the brand leads show as open roles and the council members are not listed.
  const leadList = realPeople(leads.data).map((p) => localise(p, t));
  const advisoryList = realPeople(advisory.data).map((p) => localise(p, t));
  // Person nodes (Book 1 §9.4) for named, published people only: placeholder names are never marked up.
  const personLd = [...founderList, ...leadList]
    .filter((p) => !hasMarks(p.name))
    .map((p) => compact({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: p.name,
      jobTitle: hasMarks(p.role) ? undefined : p.role,
      worksFor: ORG_REF,
    }));
  const show = (id) => filter === 'all' || filter === id;
  const contact = t('Contact', 'தொடர்புக்கு');

  return (
    <>
      <Seo
        title={t(...SEO.title)}
        description={t(...SEO.description)}
        titleTa={SEO.title[1]}
        descriptionTa={SEO.description[1]}
        jsonLd={[seoLd, ...personLd]}
      />
      <PageHero
        className="rk-page"
        breadcrumbs={aboutCrumbs(t, t('Leadership & team', 'தலைமையும் குழுவும்'))}
        eyebrow={t('Leadership & team', 'தலைமையும் குழுவும்')}
        title={t('The people accountable for the numbers', 'எண்களுக்குப் பதில் சொல்லும் மனிதர்கள்')}
        lede={t(
          'A small team with complementary skills: strategy and policy, AI research, and media and operations.',
          'ஒன்றையொன்று நிறைவு செய்யும் திறன்களைக் கொண்ட சிறிய குழு: உத்தியும் கொள்கையும், AI ஆய்வு, ஊடகமும் செயல்பாடுகளும்.'
        )}
        actions={<Button to="/contact" size="lg">{contact}</Button>}
      />

      {/* Full-width band: it is the top of the first sheet (theme.css rounds "hero + *"). */}
      <div className="lead-filter-band">
        <div className="container lead-filter-wrap">
          <div className="lead-filter segmented" role="group" aria-label={t('Filter by role', 'பங்கு வாரியாக வடிகட்டு')} ref={filterRef}>
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className="lead-filter__btn segmented__item" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {t(...f.label)}
              </button>
            ))}
            <span className="about-pill__ind" aria-hidden="true" />
          </div>
        </div>
      </div>

      {show('founders') && (
        <Section id="founding-team" pad="sm">
          <SectionHeader title={t('Founding team', 'நிறுவனர் குழு')} />
          {founders.loading && !apiFounders.length ? (
            <Skeleton height="20rem" count={3} />
          ) : (
            <RevealGroup as="ul" className="lead-grid lead-grid--three">
              {founderList.map((p) => <PersonWithBio key={p.slug || p.name} person={p} />)}
            </RevealGroup>
          )}
          <p className="lead-tag"><TagChip tag="B" /> {t('Biographies are self-reported.', 'வாழ்க்கைக் குறிப்புகள் அவர்களே தெரிவித்தவை.')}</p>
          {/* The founder in his own words: StartupTN interview (data/videos.js, docs/VIDEOS.md) */}
          <EventVideos
            videos={videosForPlace('leadership')}
            max={1}
            headingLevel={3}
            eyebrow={t('In his own words', 'அவரது சொற்களில்')}
            title={t('M K Elango on building brands', 'பிராண்டுகளை உருவாக்குவது பற்றி M K Elango')}
            className="lead-film"
          />
        </Section>
      )}

      {show('leads') && (
        <Section id="brand-leads" surface="white" pad="sm">
          <SectionHeader
            title={t('Brand leads', 'பிராண்ட் தலைவர்கள்')}
            lede={t(
              'One lead per brand owns its audience, offers, partners and results.',
              'ஒவ்வொரு பிராண்டுக்கும் ஒரு தலைவர்: அதன் பார்வையாளர்கள், சேவைகள், கூட்டாளர்கள், விளைவுகளுக்கு அவரே பொறுப்பு.'
            )}
          />
          {leadList.length ? (
            <RevealGroup as="ul" className="lead-grid lead-grid--five">
              {leadList.map((p) => <PersonWithBio key={p.slug || p.name} person={p} />)}
            </RevealGroup>
          ) : (
            <RevealGroup as="ul" className="lead-grid lead-grid--five lead-grid--roles">
              {LEAD_ROLES.map((r) => (
                <li key={r.key} className="lead-vacant" data-brand={r.key}>
                  <span className="lead-vacant__rule" aria-hidden="true" />
                  <p className="lead-vacant__role">{t(...r.role)}</p>
                  <p className="lead-vacant__status">{t('Appointment in progress', 'நியமனம் நடைபெற்று வருகிறது')}</p>
                </li>
              ))}
            </RevealGroup>
          )}
        </Section>
      )}

      {show('councils') && (
        <Section id="advisory-councils" pad="sm">
          <SectionHeader
            title={t('Advisory councils', 'ஆலோசனைக் குழுக்கள்')}
            lede={t(
              'Each brand has a council that reviews its programmes against their written targets every quarter.',
              'ஒவ்வொரு பிராண்டுக்கும் ஒரு குழு உண்டு; அது பிராண்டின் திட்டங்களை அவற்றின் எழுதப்பட்ட இலக்குகளுடன் ஒப்பிட்டு ஒவ்வொரு காலாண்டும் மறுஆய்வு செய்கிறது.'
            )}
          />
          <RevealGroup as="ul" className="lead-councils">
            {COUNCILS.map((c) => (
              <li key={c.key} className="lead-council" data-brand={c.key}>
                <p className="lead-council__brand" lang="en">{BRANDS[c.key].descriptor}</p>
                <p className="lead-council__who">{t(...c.who)}</p>
              </li>
            ))}
          </RevealGroup>
          {advisoryList.length > 0 && (
            <RevealGroup as="ul" className="lead-grid lead-grid--four lead-grid--advisory">
              {advisoryList.map((p) => <li key={p.slug || p.name} className="lead-person"><PersonCard person={p} /></li>)}
            </RevealGroup>
          )}
        </Section>
      )}

      <CTABand surface="night"
        title={t("We're hiring people who would rather count outcomes than activities.", 'செயல்பாடுகளை அல்ல, விளைவுகளைக் கணக்கிட விரும்புபவர்களைப் பணியமர்த்துகிறோம்.')}
        actions={
          <>
            <Button to="/careers" size="lg">{t('See open roles', 'காலிப் பணியிடங்களைப் பாருங்கள்')}</Button>
            <Button to="/contact" variant="secondary" size="lg">{contact}</Button>
          </>
        }
      />
    </>
  );
}
