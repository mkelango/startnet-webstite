import { useRef, useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion'; // light m inside the shell's LazyMotion
import { ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { Seo, Section, KineticHeadline, Button, BrandLockup, Badge } from '../components';
import { useLang } from '../lib/i18n.jsx';
import { snxLink, waLink } from '../lib/links.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { BRANDS } from '../data/brands.js';
import PersonaSelector, { firstPersonaInputId } from './home/PersonaSelector.jsx';
import { INTENTS, getPersona, isTalent } from './home/personas.js';
import { pageLd } from './brands/seoBits.js';
import './Join.css';
import './utility/restKit.css';

/*
 * /join (T13) — Book 1 Part B §5.1 persona selector + optional intent question, then one next
 * step (Book 1 Part B §9.4: redirect to x.startnet.in/signup?persona&intent&brand&lang&src).
 * Copy: Book 2 §13.4 (H1, sub-head), §1.10 microcopy, §14.3 Tamil CTAs.
 * Other Tamil strings are DRAFTS (Book 2 §14 status) — native Tamil review pending before launch.
 * Nothing is stored on startnet.in.
 */

const PERSONA_NAME = 'join-persona';
const ERROR_ID = 'join-persona-error';

const SEO = {
  title: 'Join StartNet',
  titleTa: 'StartNet-இல் இணையுங்கள்',
  description: 'Free for individuals. One profile for every StartNet programme.',
  descriptionTa: 'தனிநபர்களுக்கு இலவசம். ஒவ்வொரு StartNet திட்டத்துக்கும் ஒரே சுயவிவரம்.',
  // Search title/description only (the visible lede above stays as Book 2 wrote it). Primary keyword "join StartNet".
  seoTitle: 'Join StartNet free: one profile for every programme',
  // SEO-TA: pending native review
  seoTitleTa: 'StartNet-இல் இலவசமாக இணையுங்கள்: ஒரே சுயவிவரம்',
  meta: 'Join StartNet free as a student, scholar, working professional or woman founder in Tamil Nadu. Tell us who you are and we will show your next step.',
  // SEO-TA: pending native review
  metaTa: 'மாணவர், ஆய்வாளர், பணியில் உள்ளவர் அல்லது பெண் தொழில்முனைவோராக StartNet-இல் இலவசமாக இணையுங்கள். உங்கள் அடுத்த படியைக் காட்டுவோம்.',
};

export default function Join() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const [persona, setPersona] = useState('');
  const [intent, setIntent] = useState('');
  const [step, setStep] = useState('choose'); // 'choose' | 'summary'
  const [error, setError] = useState(false);
  // Which step heading should take focus once it mounts. AnimatePresence mode="wait" keeps the exiting
  // step on screen first, so the new heading only exists after the exit finishes — a callback ref catches it.
  const pendingFocus = useRef(null);

  const p = getPersona(persona);
  const talent = isTalent(p);
  const brand = p?.brand ? BRANDS[p.brand] : null;
  const intentObj = INTENTS.find((i) => i.id === intent);

  const goTo = (next) => {
    pendingFocus.current = next;
    setStep(next);
  };

  const focusOnMount = (which) => (el) => {
    if (!el || pendingFocus.current !== which) return;
    pendingFocus.current = null;
    requestAnimationFrame(() => el.focus());
  };

  const choose = (id) => {
    setPersona(id);
    setError(false);
    if (!isTalent(getPersona(id))) setIntent('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!p) {
      setError(true);
      // Move focus into the group so keyboard and screen-reader users land on the choice that is missing.
      document.getElementById(firstPersonaInputId(PERSONA_NAME))?.focus();
      return;
    }
    goTo('summary');
  };

  const signup = p && talent
    ? snxLink('/signup', { src: 'join', lang, persona: p.id, brand: p.brand, ...(intent ? { intent } : {}) })
    : null;

  const fade = reduced
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.24, ease: [0, 0, 0.3, 1] } };

  const stepLabel = p ? t(p.stepLabel, p.stepLabelTa) : '';
  const next = p ? t(p.next, p.nextTa) : '';

  return (
    <div className="join">
      <Seo
        title={t(SEO.seoTitle, SEO.seoTitleTa)}
        description={t(SEO.meta, SEO.metaTa)}
        titleTa={SEO.seoTitleTa}
        descriptionTa={SEO.metaTa}
        jsonLd={pageLd({ path: '/join', lang, name: t(SEO.seoTitle, SEO.seoTitleTa), description: t(SEO.meta, SEO.metaTa) })}
      />

      <Section className="join__section">
        <div className="join__inner">
          <header className="join__head rk-page">
            <p className="eyebrow join__progress" aria-live="polite">
              {step === 'choose'
                ? t('Step 1 of 2 · About you', 'படி 1 / 2 · உங்களைப் பற்றி')
                : t('Step 2 of 2 · Your next step', 'படி 2 / 2 · உங்கள் அடுத்த படி')}
            </p>
            <KineticHeadline as="h1" className="h1 join__title" text={t('Join StartNet', 'StartNet-இல் இணையுங்கள்')} />
            <p className="body-lg join__lede">{t(SEO.description, SEO.descriptionTa)}</p>
            <div className="join__bar" aria-hidden="true">
              <span className="join__bar-fill" data-step={step} />
            </div>
          </header>

          <AnimatePresence mode="wait" initial={false}>
            {step === 'choose' ? (
              <motion.form key="choose" className="join__form" onSubmit={onSubmit} noValidate {...fade}>
                <PersonaSelector
                  name={PERSONA_NAME}
                  value={persona}
                  onChange={choose}
                  legendId="join-persona-legend"
                  legend={<h2 className="h3" ref={focusOnMount('choose')} tabIndex={-1}>{t('I am a…', 'நான் ஒரு…')}</h2>}
                  invalid={error}
                  describedBy={error ? ERROR_ID : undefined}
                />
                {error && (
                  <p className="join__error" id={ERROR_ID} role="alert">
                    {t('Please choose the option closest to you.', 'உங்களுக்கு மிக நெருக்கமான தேர்வைத் தேர்ந்தெடுக்கவும்.')}
                  </p>
                )}

                <AnimatePresence initial={false}>
                  {talent && (
                    <motion.fieldset
                      key="intent"
                      className="join__intent"
                      initial={reduced ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: reduced ? 0 : 0.24, ease: [0, 0, 0.3, 1] }}
                    >
                      <legend className="join__intent-legend">
                        <span className="h5">{t('What do you want next?', 'அடுத்து உங்களுக்கு என்ன வேண்டும்?')}</span>{' '}
                        <span className="muted small">{t('Optional', 'விருப்பத்தேர்வு')}</span>
                      </legend>
                      <div className="join__chips">
                        {INTENTS.map((i) => (
                          <span key={i.id} className="join__chip">
                            <input
                              type="radio"
                              id={`join-intent-${i.id}`}
                              name="join-intent"
                              value={i.id}
                              checked={intent === i.id}
                              onChange={() => setIntent(i.id)}
                            />
                            <label htmlFor={`join-intent-${i.id}`}>{t(i.label, i.labelTa)}</label>
                          </span>
                        ))}
                        {intent && (
                          <button type="button" className="join__clear small" onClick={() => setIntent('')}>
                            {t('Clear', 'அழி')}
                          </button>
                        )}
                      </div>
                    </motion.fieldset>
                  )}
                </AnimatePresence>

                {/* Phones: once a persona is picked, Continue sticks to the bottom so it is never 1½ screens away. */}
                <div className="join__actions" data-sticky={p ? 'true' : undefined}>
                  <Button type="submit" size="lg" icon={ArrowRight}>{t('Continue', 'தொடருங்கள்')}</Button>
                  <p className="small muted join__note">
                    <ShieldCheck size={16} aria-hidden="true" />{' '}
                    {t('We don’t store your answers on this site.', 'உங்கள் பதில்களை இந்தத் தளத்தில் நாங்கள் சேமிப்பதில்லை.')}
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div key="summary" className="join__summary" {...fade}>
                <article className="join__card" data-brand={p?.brand || undefined}>
                  <p className="eyebrow join__card-eyebrow">{t('Your next step', 'உங்கள் அடுத்த படி')}</p>
                  {brand && <div className="join__lockup"><BrandLockup brand={brand.key} size="sm" /></div>}
                  <h2 className="h2 join__card-title" ref={focusOnMount('summary')} tabIndex={-1}>
                    {talent ? t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்') : stepLabel}
                  </h2>
                  <div className="join__answers">
                    <Badge kind="type">{p ? t(p.label, p.labelTa) : null}</Badge>
                    {intentObj && <Badge kind="type">{t('Next:', 'அடுத்து:')} {t(intentObj.label, intentObj.labelTa)}</Badge>}
                    {brand && <span className="join__journey small">{t(brand.journey, brand.journeyTa)}</span>}
                  </div>
                  <p className="body-lg join__card-body">
                    {talent
                      ? (
                        <>
                          {t(
                            'One StartNet X profile follows you from your first event to your first funding. We’ll open it with your answers filled in.',
                            'உங்கள் முதல் நிகழ்விலிருந்து முதல் நிதி வரை ஒரே StartNet X சுயவிவரம் உங்களுடன் வரும். உங்கள் பதில்கள் நிரப்பப்பட்ட நிலையில் அதைத் திறப்போம்.'
                          )}{' '}
                          {next}
                        </>
                      )
                      : next}
                  </p>

                  <div className="join__card-actions">
                    {talent ? (
                      <Button size="lg" variant={brand ? 'brand' : 'primary'} href={signup} icon={ArrowRight}>
                        {t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}
                      </Button>
                    ) : (
                      <Button size="lg" to={p?.to} icon={ArrowRight}>{stepLabel}</Button>
                    )}
                  </div>

                  {talent ? (
                    <p className="small muted join__micro">
                      {t('Free for individuals. Takes about two minutes. Tamil or English.', 'தனிநபர்களுக்கு இலவசம். சுமார் இரண்டு நிமிடங்கள் ஆகும். தமிழ் அல்லது ஆங்கிலம்.')}
                      {p.id === 'student' && (
                        <>
                          {' '}
                          {t(
                            'Under 18? We’ll need your parent or guardian’s consent, and we’ll send them a link.',
                            '18 வயதுக்குக் கீழா? உங்கள் பெற்றோர் அல்லது பாதுகாவலரின் ஒப்புதல் தேவை; அவர்களுக்கு ஓர் இணைப்பை அனுப்புவோம்.'
                          )}
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="small muted join__micro">
                      {t('Partner pages lead to an enquiry form routed to the right team.', 'கூட்டாளர் பக்கங்கள், சரியான குழுவுக்கு அனுப்பப்படும் விசாரணைப் படிவத்துக்கு அழைத்துச் செல்லும்.')}
                    </p>
                  )}

                  <div className="join__secondary">
                    {/* New tab, so following it never loses the answers on this page. */}
                    <a className="join__wa" href={waLink('Hi StartNet', p?.waRef)} target="_blank" rel="noopener noreferrer">
                      {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                      <span className="visually-hidden"> {t('(opens WhatsApp)', '(WhatsApp-இல் திறக்கும்)')}</span>
                    </a>
                    <span aria-hidden="true" className="join__sep">·</span>
                    <button type="button" className="join__back" onClick={() => goTo('choose')}>
                      <RotateCcw size={16} aria-hidden="true" /> {t('Change my answers', 'என் பதில்களை மாற்று')}
                    </button>
                  </div>
                </article>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
}
