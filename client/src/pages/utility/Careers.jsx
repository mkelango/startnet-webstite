import { useMemo, useState } from 'react';
import { ArrowUpRight, Target, MapPin, Eye, Mail } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Steps, Button, Badge, EmptyState, Stat, Reveal, RevealGroup, Skeleton, CTABand,
} from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { webPageLd, itemListLd, langPath, isPlaceholder } from '../../lib/seo.js';
import { useLang } from '../../lib/i18n.jsx';
import './Careers.css';
import './restKit.css';

// Book 2 §10 Careers. Tamil lines are drafts pending native Tamil review (Book 2 §14 status note).
const CAREERS_EMAIL = 'careers@startnet.in';

const VALUES = [
  {
    icon: Target,
    title: ['You own an outcome, not a task list.', 'நீங்கள் ஒரு விளைவுக்குப் பொறுப்பு, வேலைப் பட்டியலுக்கு அல்ல.'],
    body: ['Brand leads own audiences and results; engine owners own quality.', 'பிராண்ட் தலைவர்கள் பார்வையாளர்களுக்கும் முடிவுகளுக்கும் பொறுப்பு; இயந்திரப் பொறுப்பாளர்கள் தரத்துக்குப் பொறுப்பு.'],
  },
  {
    icon: MapPin,
    // Base: Salem headquarters (confirmed). SEO-TA: pending native review
    title: ["You'll work from Salem and in districts across Tamil Nadu.", 'சேலத்திலிருந்தும் தமிழ்நாடு முழுவதும் உள்ள மாவட்டங்களிலும் பணியாற்றுவீர்கள்.'],
    body: ['In Tamil and English.', 'தமிழிலும் ஆங்கிலத்திலும்.'],
  },
  {
    icon: Eye,
    title: ['Our numbers are public.', 'எங்கள் எண்கள் பொதுவில் உள்ளன.'],
    body: ['So your work is visible.', 'எனவே உங்கள் பணி வெளிப்படையாகத் தெரியும்.'],
  },
];

const HIRING = [
  { title: ['Apply', 'விண்ணப்பியுங்கள்'], body: ['CV or LinkedIn, plus three lines on why.', 'CV அல்லது LinkedIn, ஏன் என்பதற்கு மூன்று வரிகளுடன்.'] },
  { title: ['A conversation with the hiring lead', 'பணியமர்த்தல் தலைவருடன் ஓர் உரையாடல்'], body: ['About the outcome the role owns.', 'அந்தப் பணி பொறுப்பேற்கும் விளைவைப் பற்றி.'] },
  { title: ['A short, paid work sample', 'சுருக்கமான, ஊதியத்துடன் கூடிய பணி மாதிரி'], body: ['For senior roles [confirm].', 'மூத்த பணிகளுக்கு [confirm].'] },
  { title: ['Meet the team', 'குழுவைச் சந்தியுங்கள்'], body: ['The people you would work with.', 'நீங்கள் இணைந்து பணியாற்றப் போகும் நபர்கள்.'] },
];

export default function Careers() {
  const { t, lang } = useLang();
  const tt = (pair) => t(pair[0], pair[1]);
  const hiring = HIRING.map((h) => ({ title: tt(h.title), body: tt(h.body) }));
  const { data, loading } = useApi('/api/careers');
  const roles = Array.isArray(data) ? data : [];
  const [team, setTeam] = useState('all');
  const teams = useMemo(() => ['all', ...new Set(roles.map((r) => r.team).filter(Boolean))], [roles]);
  const shown = team === 'all' ? roles : roles.filter((r) => r.team === team);

  return (
    <>
      <Seo
        title={t('Careers at StartNet: help Tamil Nadu build', 'StartNet-இல் பணி வாய்ப்புகள்: தமிழ்நாடு உருவாக்க உதவுங்கள்')}
        description={t(
          'Work on programmes, events, data and StartNet X across Tamil Nadu. See open roles, how we hire and what we expect of each other.',
          'தமிழ்நாடு முழுவதும் திட்டங்கள், நிகழ்வுகள், தரவு, StartNet X-இல் பணியாற்றுங்கள். திறந்த பணியிடங்களும் நாங்கள் பணியமர்த்தும் விதமும்.' // SEO-TA: pending native review
        )}
        jsonLd={[
          webPageLd({ path: langPath('/careers', lang), type: 'CollectionPage', lang, name: t('Careers at StartNet', 'StartNet-இல் பணி வாய்ப்புகள்') }),
          // Only real roles from /api/careers (none yet → no ItemList).
          itemListLd({ name: t('Open roles at StartNet', 'StartNet திறந்த பணியிடங்கள்'), lang, items: roles.filter((r) => r.slug && !isPlaceholder(r.title)).map((r) => ({ name: r.title, path: `/careers/${r.slug}` })) }),
        ]}
      />

      <PageHero
        className="rk-hero rk-page"
        eyebrow={t('Careers', 'பணி வாய்ப்புகள்')}
        title={t("Help Tamil Nadu's next founders get started.", 'தமிழ்நாட்டின் அடுத்த நிறுவனர்கள் தொடங்க உதவுங்கள்.')}
        lede={t(
          "We're a small team with a large, public goal. We want people who would rather count outcomes than activities.",
          'நாங்கள் பெரிய, பொது இலக்கைக் கொண்ட சிறிய குழு. செயல்பாடுகளை விட விளைவுகளை எண்ண விரும்புபவர்கள் எங்களுக்குத் தேவை.'
        )}
        breadcrumbs={[{ label: t('Careers', 'பணி வாய்ப்புகள்') }]}
        actions={
          <>
            <Button href="#roles" size="lg">{t('See open roles', 'திறந்த பணியிடங்களைப் பாருங்கள்')}</Button>
            <Button href="#how-we-hire" variant="tertiary" size="lg">{t('How we hire', 'நாங்கள் பணியமர்த்தும் விதம்')}</Button>
          </>
        }
        art={{ variant: 'ladder', ratio: '4/5', seed: 10, alt: '' }}
      />

      {/* What working here is like */}
      <Section surface="white">
        <SectionHeader
          eyebrow={t('What working here is like', 'இங்கே பணியாற்றுவது எப்படி இருக்கும்')}
          title={t('Outcomes, districts and public numbers.', 'விளைவுகள், மாவட்டங்கள், பொது எண்கள்.')}
          as="h2"
        />
        <RevealGroup as="ul" className="careers-values">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <li key={v.title[0]} className="careers-value">
                <Icon aria-hidden="true" size={28} strokeWidth={1.5} className="careers-value__icon" />
                <h3 className="h4">{tt(v.title)}</h3>
                <p className="careers-value__body">{tt(v.body)}</p>
              </li>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Open roles */}
      <Section id="roles">
        <SectionHeader
          eyebrow={t('Open roles', 'திறந்த பணியிடங்கள்')}
          title={roles.length
            ? t(`${roles.length} open ${roles.length === 1 ? 'role' : 'roles'}`, `${roles.length} திறந்த பணியிடங்கள்`)
            : t('Open roles', 'திறந்த பணியிடங்கள்')}
          as="h2"
        />
        {loading && <Skeleton height="5rem" count={3} />}

        {!loading && roles.length === 0 && (
          <EmptyState
            title={t('No open roles right now.', 'இப்போது திறந்த பணியிடங்கள் இல்லை.')}
            body={t("Send us a note about what you'd do here.", 'இங்கே நீங்கள் என்ன செய்வீர்கள் என்று எங்களுக்கு எழுதுங்கள்.')}
            action={
              <Button href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('General application')}`} icon={Mail}>
                {t('Send a general application', 'பொது விண்ணப்பம் அனுப்புங்கள்')}
              </Button>
            }
          />
        )}

        {!loading && roles.length > 0 && (
          <>
            {teams.length > 2 && (
              <div className="careers-filter" role="group" aria-label={t('Filter roles by team', 'குழு வாரியாகப் பணியிடங்களை வடிகட்டவும்')}>
                {teams.map((tm) => (
                  <button
                    key={tm}
                    type="button"
                    className="careers-filter__chip"
                    aria-pressed={team === tm}
                    onClick={() => setTeam(tm)}
                  >
                    {tm === 'all' ? t('All teams', 'அனைத்துக் குழுக்கள்') : tm}
                  </button>
                ))}
              </div>
            )}
            <ul className="careers-roles" role="list">
              {shown.map((r) => {
                const href = r.applyUrl || `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${r.title}`)}`;
                return (
                  <li key={r.slug} className="careers-role">
                    <div className="careers-role__main">
                      <h3 className="h4 careers-role__title">{r.title}</h3>
                      {r.summary && <p className="careers-role__summary">{r.summary}</p>}
                    </div>
                    <dl className="careers-role__meta">
                      {r.team && <div><dt>{t('Team', 'குழு')}</dt><dd>{r.team}</dd></div>}
                      {r.location && <div><dt>{t('Location', 'இடம்')}</dt><dd>{r.location}</dd></div>}
                      {r.type && <div><dt>{t('Type', 'வகை')}</dt><dd><Badge kind="type">{r.type}</Badge></dd></div>}
                    </dl>
                    <Button href={href} variant="secondary" icon={/^https?:/i.test(href) ? ArrowUpRight : undefined} aria-label={`${t('Apply', 'விண்ணப்பியுங்கள்')}: ${r.title}`}>
                      {t('Apply', 'விண்ணப்பியுங்கள்')}
                    </Button>
                  </li>
                );
              })}
            </ul>
            <p className="careers-general">
              {t("Don't see your role?", 'உங்களுக்கான பணி இல்லையா?')}{' '}
              <a href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('General application')}`}>
                {t('Send a general application', 'பொது விண்ணப்பம் அனுப்புங்கள்')}
              </a>.
            </p>
          </>
        )}
      </Section>

      {/* How we hire */}
      <Section surface="white" id="how-we-hire">
        <div className="careers-hire">
          <div className="careers-hire__intro">
            <p className="eyebrow">{t('How we hire', 'நாங்கள் பணியமர்த்தும் விதம்')}</p>
            <h2 className="h2">{t('Four steps, no surprises.', 'நான்கு படிகள், எதிர்பாராதவை இல்லை.')}</h2>
            <p className="body-lg text-2">{t('We aim to reply within two working days.', 'இரண்டு வேலை நாட்களுக்குள் பதிலளிக்க முயல்கிறோம்.')}</p>
          </div>
          <Steps steps={hiring} variant="row" />
        </div>
      </Section>

      {/* Commitments */}
      <Section>
        <div className="split careers-commit">
          <Reveal>
            <p className="eyebrow">{t('Our commitments', 'எங்கள் உறுதிமொழிகள்')}</p>
            <h2 className="h3">{t('What you can hold us to', 'நீங்கள் எங்களிடம் எதிர்பார்க்கக்கூடியவை')}</h2>
            <ul role="list" className="careers-commit__list">
              <li>{t('Equal-opportunity employer.', 'சம வாய்ப்பு வழங்கும் பணியமர்த்துநர்.')}</li>
              <li>
                {t('POSH policy and internal committee.', 'POSH கொள்கையும் உள் குழுவும்.')}
              </li>
              <li>
                {t(
                  'We hold our own hiring to the same standard we set for our programmes.',
                  'எங்கள் திட்டங்களுக்கு வைக்கும் அதே தரத்தை எங்கள் சொந்தப் பணியமர்த்தலுக்கும் வைக்கிறோம்.'
                )}
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="careers-commit__stat">
            <Stat
              value={40}
              unit="%"
              label={t(
                'women across our programmes, at least: our aim, and the standard for our own hiring',
                'எங்கள் திட்டங்களில் குறைந்தது இத்தனை சதவீதம் பெண்கள்: எங்கள் நோக்கம், எங்கள் பணியமர்த்தலுக்கான தரமும் இதுவே'
              )}
              tag="C"
              source={t('StartNet target', 'StartNet இலக்கு')}
              note={t('A target, not a reported outcome. [confirm]', 'இது இலக்கு, அறிவிக்கப்பட்ட விளைவு அல்ல. [confirm]')}
            />
          </Reveal>
        </div>
      </Section>

      <CTABand surface="night"
        title={t('Not the right time? Stay close.', 'இது சரியான நேரம் இல்லையா? தொடர்பில் இருங்கள்.')}
        body={t('Our numbers are public. Read what the team is building towards.', 'எங்கள் எண்கள் பொதுவில் உள்ளன. குழு எதை நோக்கி உருவாக்குகிறது என்பதைப் படியுங்கள்.')}
        actions={
          <>
            <Button to="/about/mission-1-lakh">Mission 1 Lakh</Button>
            <Button to="/insights/founder-ledger" variant="secondary">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}
