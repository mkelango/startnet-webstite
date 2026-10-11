import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, MapPin, Languages, ShieldCheck, Users } from 'lucide-react';
import { Badge, Button, Skeleton, TagChip } from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import { dateText, isConfirmed } from '../../events/parts/eventMeta.js';
import { DISTRICTS, SNX, districtMatch } from './womenContent.js';
import { FitLabel } from './WomenBits.jsx';
import './Women.css';
import { eventPath } from '../../../components/_utils.js';

const FORMAT_LABEL = { 'in-person': 'In person', online: 'Online', hybrid: 'Hybrid' };
const FORMAT_LABEL_TA = { 'in-person': 'நேரடியாக', online: 'இணையவழி', hybrid: 'நேரடி + இணையவழி' };
const isPlaceholder = (v) => typeof v === 'string' && /placeholder|to be confirmed|^\[.*\]$/i.test(v.trim());
/** Only Circle meetings belong in the Circle finder (the Summit and other flagships have their own pages). */
const isCircle = (e) => /circle/i.test(e.series || '') || /circle/i.test(e.title || '');
const dayParts = (iso, lang = 'en') => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: d.toLocaleDateString('en-IN', { day: 'numeric', timeZone: 'Asia/Kolkata' }),
    month: d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { month: 'short', timeZone: 'Asia/Kolkata' }),
  };
};

/**
 * IX-21 Circles finder (Book 4): list-first, by district. Results come from
 * /api/events?brand=women; online programmes are shown as open to every district.
 * Forming Circles offer "Join the founding list" (WhatsApp) instead of a visit.
 */
export default function CircleFinder({ src = 'women-circles' }) {
  const { t, lang } = useLang();
  const LANG_LABEL = {
    en: 'English',
    ta: 'தமிழ்',
    bilingual: t('Tamil and English', 'தமிழ் மற்றும் ஆங்கிலம்'),
    both: t('Tamil and English', 'தமிழ் மற்றும் ஆங்கிலம்'),
  };
  const reduced = useReducedMotion();
  const [district, setDistrict] = useState('');
  const [format, setFormat] = useState('all');
  const events = useApi('/api/events?brand=women&when=upcoming');
  const programmes = useApi('/api/programmes?brand=women');

  const eventList = useMemo(() => (Array.isArray(events.data) ? events.data.filter(isCircle) : []), [events.data]);
  const activeDistricts = useMemo(
    () => new Set(eventList.map((e) => String(e.district || '').toLowerCase()).filter((d) => d && !isPlaceholder(d))),
    [eventList]
  );

  const current = DISTRICTS.find((d) => d.value === district);
  const results = useMemo(
    () =>
      eventList
        .filter((e) => (district ? districtMatch(e.district, district) : true))
        .filter((e) => (format === 'all' ? true : e.format === format)),
    [eventList, district, format]
  );
  const statewide = (Array.isArray(programmes.data) ? programmes.data : []).filter(
    (p) => p.format === 'online' && p.status !== 'closed'
  );

  const loading = events.loading;
  const districtName = current ? t(current.en, current.ta) : '';
  const formatLabel = (f) => t(FORMAT_LABEL[f] || f, FORMAT_LABEL_TA[f]);
  const n = results.length;
  const countText = loading
    ? t('Looking for Circles…', 'Circles-ஐத் தேடுகிறோம்…')
    : n
      ? (lang === 'ta'
        ? `${district ? `${districtName}-இல்` : 'தமிழ்நாடு முழுவதும்'} ${n} சந்திப்பு${n === 1 ? '' : 'கள்'}`
        : `${n} ${n === 1 ? 'meeting' : 'meetings'}${district ? ` in ${current?.en}` : ' across Tamil Nadu'}`)
      : district
        ? t(`No Women Circle meets in ${current?.en} yet.`, `${districtName}-இல் இன்னும் Women Circle சந்திப்பு இல்லை.`)
        : t('No Women Circle meetings are listed yet.', 'இன்னும் Women Circle சந்திப்புகள் பட்டியலிடப்படவில்லை.');
  const snx = (key, extra = {}) => snxLink(SNX[key].path, { ...SNX[key].params, brand: 'women', lang, src, ...extra });

  return (
    <div className="women-finder">
      <form className="women-finder__controls" role="search" aria-label={t('Find a Women Circle', 'ஒரு Women Circle-ஐக் கண்டறியுங்கள்')} onSubmit={(e) => e.preventDefault()}>
        <div className="women-finder__field">
          <label htmlFor="women-finder-district" className="women-finder__label">{t('District', 'மாவட்டம்')}</label>
          <div className="women-finder__select-wrap">
            <MapPin aria-hidden="true" size={18} className="women-finder__select-icon" />
            <select
              id="women-finder-district"
              className="women-finder__select"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">{t('All districts', 'அனைத்து மாவட்டங்களும்')}</option>
              {DISTRICTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {lang === 'ta' ? `${d.ta} · ${d.en}` : `${d.en} · ${d.ta}`}{activeDistricts.has(d.value) ? '  ●' : ''}
                </option>
              ))}
            </select>
          </div>
          <p className="women-finder__hint">{t('● marks districts with a Women Circle or event listed.', '● Women Circle அல்லது நிகழ்வு பட்டியலிடப்பட்ட மாவட்டங்களைக் குறிக்கிறது.')}</p>
        </div>
        <fieldset className="women-finder__formats">
          <legend className="women-finder__label">{t('Format', 'வடிவம்')}</legend>
          <div className="women-finder__chips">
            {['all', 'in-person', 'online', 'hybrid'].map((f) => (
              <label key={f} className="women-finder__chip">
                <input type="radio" name="women-finder-format" value={f} checked={format === f} onChange={() => setFormat(f)} />
                <span>{f === 'all' ? t('Any', 'எதுவும்') : formatLabel(f)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <p className="women-finder__count" role="status" aria-live="polite">
        {countText}
      </p>

      {loading ? (
        <Skeleton height="9rem" count={2} />
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          {results.length ? (
            <motion.ul
              key={`list-${district}-${format}`}
              className="women-finder__results"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.24, ease: [0, 0, 0.3, 1] }}
            >
              {results.map((e) => {
                const dp = isConfirmed(e) ? dayParts(e.date, lang) : null;
                const place = [e.venue, e.city || e.district].filter((v) => v && !isPlaceholder(v)).join(', ');
                return (
                <li key={e.slug} className={`women-finder__card${dp ? '' : ' women-finder__card--tbc'}`}>
                  {dp && (
                    <div className="women-finder__date" aria-hidden="true">
                      <span className="women-finder__day tnum">{dp.day}</span>
                      <span className="women-finder__month">{dp.month}</span>
                    </div>
                  )}
                  <div className="women-finder__body">
                    <div className="cluster women-finder__badges">
                      <Badge kind="type"><ShieldCheck aria-hidden="true" size={14} /> {t('Women only', 'பெண்களுக்கு மட்டும்')}</Badge>
                      <Badge kind="type">{t('Code of conduct', 'நடத்தை நெறிமுறை')}</Badge>
                      {e.seats && (
                        <Badge kind="status" status={e.seats === 'full' ? 'closed' : e.seats === 'few' ? 'closing' : 'open'}>
                          {e.seats === 'full' ? t('Full', 'நிரம்பியது') : e.seats === 'few' ? t('Few seats', 'சில இடங்களே') : t('Seats open', 'இடங்கள் உள்ளன')}
                        </Badge>
                      )}
                    </div>
                    <h3 className="h5 women-finder__title">{e.title}</h3>
                    <ul className="women-finder__meta">
                      <li><CalendarDays aria-hidden="true" size={16} /> {isConfirmed(e) ? dateText(e) : e.dateLabel && !/placeholder|^\[/i.test(e.dateLabel) ? e.dateLabel : t('Dates soon', 'தேதிகள் விரைவில்')}</li>
                      {place && <li><MapPin aria-hidden="true" size={16} /> {place}</li>}
                      {e.format && <li><Users aria-hidden="true" size={16} /> {formatLabel(e.format)}</li>}
                      {e.language && <li><Languages aria-hidden="true" size={16} /> {LANG_LABEL[e.language] || e.language}</li>}
                    </ul>
                  </div>
                  <div className="women-finder__actions">
                    <Button variant="brand" size="md" href={snx('circle', { event: e.slug })}>{t('Visit as a guest', 'விருந்தினராக வாருங்கள்')}</Button>
                    <Button variant="tertiary" size="md" to={eventPath(e)}>{t('Details', 'விவரங்கள்')}</Button>
                  </div>
                </li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.div
              key={`empty-${district}`}
              className="women-finder__empty"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
            >
              <div className="women-finder__forming" aria-hidden="true">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="women-finder__seat" style={{ '--i': i }} />
                ))}
              </div>
              <div className="stack">
                <h3 className="h4">
                  {district
                    ? t(`A Circle is forming in ${districtName}`, `${districtName}-இல் ஒரு Circle உருவாகி வருகிறது`)
                    : t('Circles are forming across Tamil Nadu', 'தமிழ்நாடு முழுவதும் Circles உருவாகி வருகின்றன')}<span className="dot">.</span>
                </h3>
                <p className="text-2">
                  {t(
                    'A chapter of 20–30 women founders that meets monthly for accountability, problem-solving and introductions to buyers. Join the founding list and we will confirm on WhatsApp.',
                    'பொறுப்புணர்வு, சிக்கல் தீர்வு மற்றும் வாங்குபவர் அறிமுகங்களுக்காக மாதந்தோறும் சந்திக்கும் 20–30 பெண் நிறுவனர்களின் குழு. தொடக்கப் பட்டியலில் இணையுங்கள்; WhatsApp-இல் உறுதிப்படுத்துவோம்.'
                  )}
                </p>
                <div className="cluster">
                  <Button
                    variant="whatsapp"
                    href={waLink(`WOMEN CIRCLE ${current ? current.en.toUpperCase() : ''}`.trim(), src)}
                  >
                    <FitLabel long={t('Join the founding list', 'தொடக்கப் பட்டியலில் இணையுங்கள்')} short={t('Join the list', 'பட்டியலில் இணையுங்கள்')} />
                  </Button>
                  <Button variant="secondary" href={snx('startCircle', district ? { district } : {})}>
                    <FitLabel long={t('Start a Circle in your district', 'உங்கள் மாவட்டத்தில் ஒரு Circle தொடங்குங்கள்')} short={t('Start a Circle', 'Circle தொடங்குங்கள்')} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {events.error && (
        <p className="women-finder__note caption">{t(
          'We could not load the Circle list just now. Chat with us on WhatsApp and we will find your nearest Circle.',
          'Circle பட்டியலை இப்போது ஏற்ற முடியவில்லை. WhatsApp-இல் எங்களிடம் பேசுங்கள்; உங்கள் அருகிலுள்ள Circle-ஐக் கண்டறிந்து தருவோம்.'
        )}</p>
      )}

      {statewide.length > 0 && (
        <div className="women-finder__statewide">
          <p className="eyebrow">{t('Open to every district · online', 'அனைத்து மாவட்டங்களுக்கும் திறந்தது · இணையவழி')}</p>
          <ul className="women-finder__statewide-list">
            {statewide.map((p) => (
              <li key={p.slug}>
                <Button variant="tertiary" to={`/programmes/${p.slug}`}>{p.title}</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="caption women-finder__note">
        {t('Membership: from ₹10,000 a year', 'உறுப்பினர் கட்டணம்: ஆண்டுக்கு ₹10,000 முதல்')} <TagChip tag="C" />;{' '}
        {t('CSR-funded places available', 'CSR நிதியுதவி பெற்ற இடங்கள் உள்ளன')}.
      </p>
    </div>
  );
}
