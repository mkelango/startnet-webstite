// "1 + 4 + 6 + 1" architecture (Book 2 §2.2 image direction): masterbrand → four brand columns in their accents →
// six engine rows → StartNet X base. Interactive: pick an engine (row) or a brand (column) to read what it is.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, BarChart3, Rocket, IndianRupee, Handshake } from 'lucide-react';
import { useLang } from '../../lib/i18n.jsx';
import { TALENT_BRANDS } from '../../data/brands.js';
import { subLabel, brandPromise } from './brandCopy.js';
import './EngineMatrix.css';

export const ENGINES = [
  {
    key: 'convene', name: 'Convene', nameTa: 'கூடுகை', icon: Users,
    body: 'Summits, sector Connects, campus events, circles, demo days and district editions',
    bodyTa: 'உச்சி மாநாடுகள், துறைசார் Connect நிகழ்வுகள், வளாக நிகழ்வுகள், வட்டங்கள், டெமோ நாட்கள், மாவட்டப் பதிப்புகள்',
  },
  {
    key: 'learn', name: 'Learn', nameTa: 'கற்றல்', icon: GraduationCap,
    body: 'Cohorts, self-paced courses, sprints and certificates in Tamil and English',
    bodyTa: 'குழுக் கற்றல், சுய வேகப் படிப்புகள், குறுகிய பயிற்சிகள், சான்றிதழ்கள்: தமிழிலும் ஆங்கிலத்திலும்',
  },
  {
    key: 'insights', name: 'Insights', nameTa: 'நுண்ணறிவு', icon: BarChart3,
    body: 'Indices, reports, data and the Founder Ledger',
    bodyTa: 'குறியீடுகள், அறிக்கைகள், தரவு, Founder Ledger',
  },
  {
    key: 'launch', name: 'Launch', nameTa: 'தொடக்கம்', icon: Rocket,
    body: 'Pre-incubation, a lab venture studio and co-founder matching, with routes into partner incubators',
    bodyTa: 'முன் அடைகாப்பு, ஆய்வக வென்ச்சர் ஸ்டுடியோ, இணை நிறுவனர் பொருத்தம், கூட்டாளர் அடைகாப்பகங்களுக்கான வழிகள்',
  },
  {
    key: 'capital', name: 'Capital', nameTa: 'மூலதனம்', icon: IndianRupee,
    body: 'Grant navigation, angel introductions and investor matching',
    bodyTa: 'மானிய வழிகாட்டல், ஏஞ்சல் முதலீட்டாளர் அறிமுகங்கள், முதலீட்டாளர் பொருத்தம்',
  },
  {
    key: 'access', name: 'Access', nameTa: 'அணுகல்', icon: Handshake,
    body: 'Problem statements, pilots, procurement readiness and export desks with GCCs, corporates and government',
    bodyTa: 'GCC-கள், பெருநிறுவனங்கள், அரசுடன்: சிக்கல் அறிக்கைகள், முன்னோட்டங்கள், கொள்முதல் தயார்நிலை, ஏற்றுமதி மையங்கள்',
  },
];

/** ENGINES in the current language: { key, name, body, icon }. */
export function useEngines() {
  const { t } = useLang();
  return ENGINES.map((e) => ({ key: e.key, icon: e.icon, name: t(e.name, e.nameTa), body: t(e.body, e.bodyTa) }));
}

export default function EngineMatrix() {
  const { t, lang, localePath } = useLang();
  const engines = useEngines();
  const [sel, setSel] = useState({ type: 'engine', key: 'convene' });

  const isRow = (k) => sel.type === 'engine' && sel.key === k;
  const isCol = (k) => sel.type === 'brand' && sel.key === k;
  const engine = sel.type === 'engine' ? engines.find((e) => e.key === sel.key) : null;
  const brand = sel.type === 'brand' ? TALENT_BRANDS.find((b) => b.key === sel.key) : null;

  return (
    <div className="hww-matrix">
      <div className="hww-matrix__board">
        <div className="hww-matrix__master">
          <span className="hww-matrix__tier tnum">1</span>
          <span className="hww-matrix__mastername">StartNet<span className="dot">.</span></span>
          <span className="hww-matrix__masterline">{t('Every talent, a founder.', 'ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.')}</span>
        </div>

        <table className="hww-matrix__table">
          <caption className="visually-hidden">
            {t(
              'Every StartNet brand draws on the same six engines. Choose a brand or an engine to read more.',
              'ஒவ்வொரு StartNet பிராண்டும் அதே ஆறு இயந்திரங்களைப் பயன்படுத்துகிறது. மேலும் படிக்க ஒரு பிராண்டையோ இயந்திரத்தையோ தேர்வு செய்யுங்கள்.'
            )}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="hww-matrix__corner">
                <span className="hww-matrix__tier tnum">4 × 6</span>
              </th>
              {TALENT_BRANDS.map((b) => (
                <th key={b.key} scope="col" data-brand={b.key} className={`hww-matrix__colhead${isCol(b.key) ? ' is-on' : ''}`}>
                  <button
                    type="button"
                    className="hww-matrix__brandbtn"
                    aria-pressed={isCol(b.key)}
                    aria-label={b.name}
                    onClick={() => setSel({ type: 'brand', key: b.key })}
                  >
                    <span className="hww-matrix__swatch" aria-hidden="true" />
                    <span className="hww-matrix__brandshort" aria-hidden="true">{b.descriptor.charAt(0)}</span>
                    <span className="hww-matrix__brandname" aria-hidden="true">{b.descriptor}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {engines.map((e) => {
              const Icon = e.icon;
              return (
                <tr key={e.key} className={isRow(e.key) ? 'is-on' : undefined}>
                  <th scope="row" className="hww-matrix__rowhead">
                    <button type="button" className="hww-matrix__enginebtn" aria-pressed={isRow(e.key)} onClick={() => setSel({ type: 'engine', key: e.key })}>
                      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                      <span>{e.name}</span>
                    </button>
                  </th>
                  {TALENT_BRANDS.map((b) => (
                    <td key={b.key} data-brand={b.key} className={`hww-matrix__cell${isCol(b.key) ? ' is-col' : ''}`}>
                      <span className="hww-matrix__pip" aria-hidden="true" />
                      <span className="visually-hidden">{t(`${b.name} uses ${e.name}`, `${b.name} ${e.name} இயந்திரத்தைப் பயன்படுத்துகிறது`)}</span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <Link to={localePath('/startnet-x')} className="hww-matrix__base">
          <span className="hww-matrix__tier tnum">1</span>
          <span className="hww-matrix__basename">StartNet X</span>
          <span className="hww-matrix__baseline">{t('One profile per person, across all of it', 'அனைத்திலும், ஒருவருக்கு ஒரே சுயவிவரம்')}</span>
        </Link>
      </div>

      <div className="hww-matrix__detail" aria-live="polite">
        {engine && (
          <div key={`${engine.key}-${lang}`} className="hww-matrix__panel">
            <p className="eyebrow">{t('Engine', 'இயந்திரம்')}</p>
            <h3 className="h3 hww-matrix__ptitle">{engine.name}</h3>
            <p className="hww-matrix__pk">{t('What it delivers', 'இது வழங்குவது')}</p>
            <p className="body-lg hww-matrix__pbody">{engine.body}</p>
            <p className="hww-matrix__pnote">
              {t(
                'Built once and configured per brand: Research, Vibe, Connect and Women all draw on it.',
                'ஒருமுறை உருவாக்கி, ஒவ்வொரு பிராண்டுக்கும் ஏற்ப அமைக்கப்படுகிறது: Research, Vibe, Connect, Women அனைத்தும் இதைப் பயன்படுத்துகின்றன.'
              )}
            </p>
          </div>
        )}
        {brand && (
          <div key={`${brand.key}-${lang}`} className="hww-matrix__panel" data-brand={brand.key}>
            <p className="eyebrow">{t('Brand', 'பிராண்ட்')}</p>
            <h3 className="h3 hww-matrix__ptitle">{brand.name}</h3>
            <p className="hww-matrix__journey">{t(brand.journey, brand.journeyTa)}</p>
            <p className="body-lg hww-matrix__pbody">{brandPromise(brand, t)}</p>
            <ul className="hww-matrix__subs" aria-label={t(`${brand.name} programmes`, `${brand.name} திட்டங்கள்`)}>
              {brand.subNav.filter((s) => s.label !== 'Overview').map((s) => (
                <li key={s.to}><Link to={localePath(s.to)}>{subLabel(s, t)}</Link></li>
              ))}
            </ul>
            <Link to={localePath(brand.base)} className="hww-matrix__plink">
              {t(`Explore ${brand.name} →`, `${brand.name}-ஐப் பாருங்கள் →`)}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
