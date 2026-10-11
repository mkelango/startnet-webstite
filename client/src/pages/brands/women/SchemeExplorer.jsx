import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Landmark, HandCoins, Users } from 'lucide-react';
import { Button, Stat } from '../../../components';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink } from '../../../lib/links.js';
import { READINESS, SCHEMES, SNX, TA } from './womenContent.js';
import './Women.css';

const ICONS = { tanseed: HandCoins, 'vetri-magalir': Landmark, wep: Users };

/**
 * Scheme explorer: pick a scheme (cards act as a single-select), read what it is with the amount
 * exactly as Book 2 states it (tag B), then run StartNet's readiness checklist.
 * hideAboutLink: drop the "About HerCapital" link when rendered on /women/hercapital itself (F-63).
 * Tamil: drafts pending native review.
 */
export default function SchemeExplorer({ src = 'women-hercapital', hideAboutLink = false }) {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const uid = useId();
  const [active, setActive] = useState(SCHEMES[0].id);
  const cardRefs = useRef([]);
  const [checked, setChecked] = useState({});
  const scheme = SCHEMES.find((s) => s.id === active) || SCHEMES[0];
  const done = READINESS.filter((r) => checked[r.id]).length;
  const ready = done >= READINESS.length - 1;
  const pct = Math.round((done / READINESS.length) * 100);

  // WAI-ARIA radio group: one tab stop (the checked card); arrows/Home/End select and focus.
  const onPickerKey = (e) => {
    const n = SCHEMES.length;
    const cur = SCHEMES.findIndex((s) => s.id === active);
    const next = {
      ArrowRight: (cur + 1) % n,
      ArrowDown: (cur + 1) % n,
      ArrowLeft: (cur - 1 + n) % n,
      ArrowUp: (cur - 1 + n) % n,
      Home: 0,
      End: n - 1,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(SCHEMES[next].id);
    cardRefs.current[next]?.focus();
  };

  return (
    <div className="women-schemes">
      <div className="women-schemes__head">
        <p className="eyebrow">{t('Schemes for women-led businesses', TA.womenSchemes)}</p>
      </div>

      <div className="women-schemes__picker" role="radiogroup" aria-label={t('Choose a scheme', 'ஒரு திட்டத்தைத் தேர்ந்தெடுக்கவும்')} onKeyDown={onPickerKey}>
        {SCHEMES.map((s, i) => {
          const Icon = ICONS[s.id] || Landmark;
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`women-schemes__card${on ? ' is-active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="women-schemes__icon" aria-hidden="true"><Icon size={22} /></span>
              <span className="women-schemes__owner">{s.owner} · {t(s.kind, s.kindTa)}</span>
              <span className="women-schemes__name">{s.name}</span>
              <span className="women-schemes__summary">{t(s.summary, s.summaryTa)}</span>
            </button>
          );
        })}
      </div>

      <div className="women-schemes__panel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={scheme.id}
            className="women-schemes__detail"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0, 0, 0.3, 1] }}
          >
            <p className="eyebrow">{scheme.owner}</p>
            <h3 className="h3">{scheme.name}</h3>
            {scheme.amount ? (
              <Stat
                value={t(scheme.amount.value, scheme.amount.valueTa)}
                prefix={scheme.amount.prefix}
                unit={scheme.amount.unit ? t(scheme.amount.unit, scheme.amount.unitTa) : undefined}
                label={t(scheme.amount.label, scheme.amount.labelTa)}
                tag={scheme.amount.tag}
                note={t(scheme.amount.note, scheme.amount.noteTa)}
                source={t(scheme.amount.source, scheme.amount.sourceTa)}
                countUp={scheme.amount.countUp}
              />
            ) : (
              <p className="text-2">{t('A national platform for women entrepreneurs. We help you use it alongside state schemes.', 'பெண் தொழில்முனைவோருக்கான தேசியத் தளம். மாநிலத் திட்டங்களுடன் சேர்த்து இதைப் பயன்படுத்த உதவுகிறோம்.')}</p>
            )}
            {/* The tag sits on the Stat only; repeating it here showed "B Claimed" three times (F-63). */}
            <p className="caption">{t('Sources: StartupTN; TIIC; scheme amounts as published, verify before launch.', 'ஆதாரங்கள்: StartupTN; TIIC; திட்டங்கள் வெளியிட்ட தொகைகள், வெளியீட்டுக்கு முன் சரிபார்க்கவும்.')}</p>
          </motion.div>
        </AnimatePresence>

        <fieldset className="women-schemes__check">
          <legend className="h5">{t('Readiness checklist', 'தயார்நிலைச் சரிபார்ப்புப் பட்டியல்')}</legend>
          <p className="caption">{t("StartNet's own checklist for a readiness review, not the scheme's official eligibility. Each scheme publishes its own criteria.", 'இது தயார்நிலை மதிப்பாய்வுக்கான StartNet-இன் சொந்தப் பட்டியல், திட்டத்தின் அதிகாரபூர்வத் தகுதி அளவுகோல் அல்ல. ஒவ்வொரு திட்டமும் தன் அளவுகோல்களைத் தானே வெளியிடுகிறது.')}</p>
          <ul className="women-schemes__list">
            {READINESS.map((r) => (
              <li key={r.id}>
                <label className="women-schemes__item" htmlFor={`${uid}-${r.id}`}>
                  <input
                    id={`${uid}-${r.id}`}
                    type="checkbox"
                    checked={!!checked[r.id]}
                    onChange={(e) => setChecked((c) => ({ ...c, [r.id]: e.target.checked }))}
                  />
                  <span className="women-schemes__box" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                  <span>{t(r.label, r.labelTa)}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="women-schemes__meter" aria-hidden="true">
            <span className="women-schemes__meter-fill" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <p className="women-schemes__result" role="status" aria-live="polite">
            <strong className="tnum">{lang === 'ta' ? `${READINESS.length}-இல் ${done}` : `${done} of ${READINESS.length}`}</strong>{' '}
            {ready
              ? t(`You look ready to prepare a ${scheme.name} application with us.`, `எங்களுடன் ${scheme.name} விண்ணப்பத்தைத் தயாரிக்க நீங்கள் தயாராக இருப்பதாகத் தெரிகிறது.`)
              : done === 0
                ? t('Tick what is true for you today.', 'இன்று உங்களுக்கு உண்மையானவற்றைக் குறியிடுங்கள்.')
                : t(
                  'Rise Academy covers the gaps: business models, finance, digital and ONDC selling, branding and compliance.',
                  'குறைகளை Rise Academy நிரப்புகிறது: வணிக மாதிரிகள், நிதி, டிஜிட்டல் மற்றும் ONDC விற்பனை, பிராண்டிங், சட்ட இணக்கம்.'
                )}
          </p>
          <div className="cluster">
            {ready ? (
              <Button variant="brand" href={snxLink(SNX.readiness.path, { ...SNX.readiness.params, scheme: scheme.id, brand: 'women', lang, src })}>
                {t('Book a readiness review', 'தயார்நிலை மதிப்பாய்வை முன்பதிவு செய்யுங்கள்')}
              </Button>
            ) : (
              <Button variant="brand" to="/women/rise-academy">{t('Start Rise Academy', 'Rise Academy-ஐத் தொடங்குங்கள்')}</Button>
            )}
            {!hideAboutLink && <Button variant="tertiary" to="/women/hercapital">{t('About HerCapital', 'HerCapital பற்றி')}</Button>}
          </div>
          <p className="caption women-schemes__micro">{t('We help you prepare and apply. Decisions on grants and loans are made by the scheme, not by StartNet.', 'நீங்கள் தயாராகவும் விண்ணப்பிக்கவும் உதவுகிறோம். மானியங்கள் மற்றும் கடன்கள் பற்றிய முடிவுகளை StartNet அல்ல, அந்தந்தத் திட்டமே எடுக்கிறது.')}</p>
        </fieldset>
      </div>
    </div>
  );
}
