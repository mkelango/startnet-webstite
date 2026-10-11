// /districts — T15 district index, P2 (Book 1 Part B §2 sitemap: "Map of where StartNet is active").
// No district API yet, so this is a static index of Tamil Nadu's 38 districts. No figures are shown.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Layers, MapPin, Search } from 'lucide-react';
import { Seo, PageHero, Section, SectionHeader, Button, CTABand } from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import './Districts.css';
import '../utility/restKit.css';

// Tamil Nadu's 38 districts, alphabetical by English name.
const DISTRICTS = [
  ['Ariyalur', 'அரியலூர்'],
  ['Chengalpattu', 'செங்கல்பட்டு'],
  ['Chennai', 'சென்னை'],
  ['Coimbatore', 'கோயம்புத்தூர்'],
  ['Cuddalore', 'கடலூர்'],
  ['Dharmapuri', 'தர்மபுரி'],
  ['Dindigul', 'திண்டுக்கல்'],
  ['Erode', 'ஈரோடு'],
  ['Kallakurichi', 'கள்ளக்குறிச்சி'],
  ['Kancheepuram', 'காஞ்சிபுரம்'],
  ['Kanniyakumari', 'கன்னியாகுமரி'],
  ['Karur', 'கரூர்'],
  ['Krishnagiri', 'கிருஷ்ணகிரி'],
  ['Madurai', 'மதுரை'],
  ['Mayiladuthurai', 'மயிலாடுதுறை'],
  ['Nagapattinam', 'நாகப்பட்டினம்'],
  ['Namakkal', 'நாமக்கல்'],
  ['Nilgiris', 'நீலகிரி'],
  ['Perambalur', 'பெரம்பலூர்'],
  ['Pudukkottai', 'புதுக்கோட்டை'],
  ['Ramanathapuram', 'இராமநாதபுரம்'],
  ['Ranipet', 'இராணிப்பேட்டை'],
  ['Salem', 'சேலம்'],
  ['Sivaganga', 'சிவகங்கை'],
  ['Tenkasi', 'தென்காசி'],
  ['Thanjavur', 'தஞ்சாவூர்'],
  ['Theni', 'தேனி'],
  ['Thoothukudi', 'தூத்துக்குடி'],
  ['Tiruchirappalli', 'திருச்சிராப்பள்ளி'],
  ['Tirunelveli', 'திருநெல்வேலி'],
  ['Tirupathur', 'திருப்பத்தூர்'],
  ['Tiruppur', 'திருப்பூர்'],
  ['Tiruvallur', 'திருவள்ளூர்'],
  ['Tiruvannamalai', 'திருவண்ணாமலை'],
  ['Tiruvarur', 'திருவாரூர்'],
  ['Vellore', 'வேலூர்'],
  ['Viluppuram', 'விழுப்புரம்'],
  ['Virudhunagar', 'விருதுநகர்'],
];

export default function Districts() {
  const { t, lang, localePath } = useLang();
  const ta = lang === 'ta';
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return DISTRICTS;
    return DISTRICTS.filter(([en, tam]) => en.toLowerCase().includes(needle) || tam.includes(q.trim()));
  }, [q]);

  // Count upcoming events per district (events carry a free-text district/city). Until they do, every
  // district shows zero, so one note offers to host instead of 38 empty filtered lists.
  const events = useApi('/api/events');
  const counts = useMemo(() => {
    const m = new Map();
    const list = Array.isArray(events.data) ? events.data : [];
    list.forEach((e) => {
      if (!e || e.status === 'past') return;
      const where = `${e.district || ''} ${e.city || ''}`.toLowerCase();
      DISTRICTS.forEach(([en]) => {
        if (where.includes(en.toLowerCase())) m.set(en, (m.get(en) || 0) + 1);
      });
    });
    return m;
  }, [events.data]);
  const noneListed = !events.loading && counts.size === 0;

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Tamil Nadu districts: startup events near you', 'தமிழ்நாடு மாவட்டங்களில் StartNet')}
        description={t(
          "StartNet across Tamil Nadu's 38 districts: find startup events, Circles and programmes near you, or bring StartNet to your district.",
          '38 மாவட்டங்களிலும் StartNet: அருகிலுள்ள ஸ்டார்ட்அப் நிகழ்வுகள், திட்டங்களைக் கண்டறியுங்கள், அல்லது StartNet-ஐ உங்கள் மாவட்டத்துக்கு அழையுங்கள்.'
        )}
      />

      <PageHero
        className="rk-page"
        eyebrow={t('Where we work', 'நாங்கள் பணியாற்றும் இடங்கள்')}
        title={t('Districts', 'மாவட்டங்கள்')}
        lede={t(
          "StartNet works across Tamil Nadu's 38 districts, not just its metros. Find events and programmes near you.",
          'StartNet பெருநகரங்களில் மட்டுமல்ல, தமிழ்நாட்டின் 38 மாவட்டங்களிலும் பணியாற்றுகிறது. உங்கள் அருகிலுள்ள நிகழ்வுகளையும் திட்டங்களையும் கண்டறியுங்கள்.'
        )}
        breadcrumbs={[
          { label: t('Who we are', 'நாங்கள் யார்'), to: '/about' },
          { label: t('Districts', 'மாவட்டங்கள்') },
        ]}
        actions={
          <>
            <Button href="#districts-list" size="lg" icon={MapPin} data-primary-cta="">
              {t('Find your district', 'உங்கள் மாவட்டத்தைக் கண்டறியவும்')}
            </Button>
            <Button variant="tertiary" to="/events">
              {t('All events', 'அனைத்து நிகழ்வுகள்')}
            </Button>
          </>
        }
      />

      <Section surface="white" id="districts-list" labelledBy="districts-list-title">
        <SectionHeader
          id="districts-list-title"
          eyebrow={t('38 districts, A to Z', '38 மாவட்டங்கள், அகர வரிசையில்')}
          title={t('Find activity near you', 'உங்கள் அருகிலுள்ள செயல்பாடுகள்')}
        />
        <p className="districts-note" role="note">
          {t('District pages are coming.', 'மாவட்டப் பக்கங்கள் விரைவில் வரும்.')}
        </p>

        <div className="districts-filter" role="search">
          <label htmlFor="districts-q" className="districts-filter__label">
            {t('Filter districts', 'மாவட்டங்களை வடிகட்டவும்')}
          </label>
          <div className="districts-filter__box">
            <Search aria-hidden="true" size={18} className="districts-filter__icon" />
            <input
              id="districts-q"
              type="search"
              className="districts-filter__input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('Type a district name', 'மாவட்டப் பெயரைத் தட்டச்சு செய்யவும்')}
              autoComplete="off"
              aria-describedby="districts-count"
            />
          </div>
          <p id="districts-count" className="districts-filter__count" aria-live="polite">
            {t(`${shown.length} of 38 districts`, `38 இல் ${shown.length} மாவட்டங்கள்`)}
          </p>
        </div>

        {noneListed && (
          <p className="districts-hostnote">
            <CalendarDays aria-hidden="true" size={18} />
            <span>
              {t('No events are listed by district yet.', 'மாவட்ட வாரியாக இன்னும் நிகழ்வுகள் பட்டியலிடப்படவில்லை.')}{' '}
              <Link className="districts-hostnote__link" to={`${localePath('/events')}#host`}>
                {t('Host one in your district', 'உங்கள் மாவட்டத்தில் ஒன்றை நடத்துங்கள்')} <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </span>
          </p>
        )}

        {shown.length === 0 && (
          <p className="districts-none">
            {t('No district matches that name. Check the spelling, or clear the filter.', 'அந்தப் பெயரில் மாவட்டம் இல்லை. எழுத்துப்பிழையைச் சரிபார்க்கவும் அல்லது வடிகட்டியை அழிக்கவும்.')}
          </p>
        )}

        <ul className="districts-grid" role="list">
          {shown.map(([en, tam]) => {
            const n = counts.get(en) || 0;
            return (
            <li key={en} className="districts-card">
              <h3 className="districts-card__name h5">
                <span lang={ta ? 'ta' : 'en'}>{ta ? tam : en}</span>
                <span className="districts-card__alt" lang={ta ? 'en' : 'ta'}>{ta ? en : tam}</span>
              </h3>
              <div className="districts-card__links">
                <Link
                  className="districts-card__link"
                  to={`${localePath('/events')}?district=${encodeURIComponent(en)}`}
                  aria-label={n
                    ? t(`Events in ${en} (${n})`, `${tam} நிகழ்வுகள் (${n})`)
                    : t(`Events in ${en}`, `${tam} நிகழ்வுகள்`)}
                >
                  <CalendarDays aria-hidden="true" size={18} />
                  <span>{t('Events', 'நிகழ்வுகள்')}{n ? <span className="districts-card__count tnum"> ({n})</span> : null}</span>
                </Link>
                <Link
                  className="districts-card__link"
                  to={localePath('/programmes')}
                >
                  {/* Unfiltered programme list: the visible "Programmes" is its accurate name (no per-district label). */}
                  <Layers aria-hidden="true" size={18} />
                  <span>{t('Programmes', 'திட்டங்கள்')}</span>
                </Link>
              </div>
            </li>
            );
          })}
        </ul>
      </Section>

      <CTABand
        surface="night"
        title={t(
          'Bring StartNet to your district.',
          <>{/* Keep "StartNet-ஐ" on one line: the hyphen must not break before the case suffix. */}<span className="districts-nowrap">StartNet-ஐ</span> உங்கள் மாவட்டத்துக்குக் கொண்டு வாருங்கள்.</>
        )}
        body={t(
          'District administrations, colleges and local partners can co-host events, circles and programmes with us.',
          'மாவட்ட நிர்வாகங்கள், கல்லூரிகள், உள்ளூர் கூட்டாளிகள் எங்களுடன் நிகழ்வுகள், வட்டங்கள், திட்டங்களை இணைந்து நடத்தலாம்.'
        )}
        actions={
          <>
            <Button to="/partner/government" icon={ArrowRight}>
              {t('Partner as government', 'அரசாகக் கூட்டுசேருங்கள்')}
            </Button>
            <Button variant="inverse" to="/events#host">
              {t('Host an event', 'நிகழ்வை நடத்துங்கள்')}
            </Button>
          </>
        }
      />
    </>
  );
}
