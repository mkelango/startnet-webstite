// StartNet X overview (T02 brand home pattern, inside BrandLayout brand="x"). Copy: Book 2 §7.1, §7.2, §3.0, §1.10.
import { m as motion } from 'framer-motion'; // light m inside the shell's LazyMotion
import { ArrowRight, ShieldCheck, Smartphone, MessageCircle, Languages } from 'lucide-react';
import {
  Seo, BrandHero, Section, SectionHeader, Button, Tabs, RevealGroup, Reveal, Stat, CTABand, Dot, WhatsAppButton,
  Accordion,
} from '../../components';
import { useLocation } from 'react-router-dom';
import { useSnxT } from './snxTamil.js';
import { snxLink } from '../../lib/links.js';
import { BRANDS } from '../../data/brands.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { MODULES, AUDIENCES, TRUST_STRIP } from './snxContent.js';
import { SnxModuleCard } from './SnxParts.jsx';
import { snxPageLd } from './snxSeo.js';
import { SITE_ORIGIN } from '../../lib/seo.js';
import './StartNetX.css';
import '../utility/restKit.css';

const THREAD = ['research', 'vibe', 'connect', 'women'];

export default function StartNetX() {
  const { t, tx, lang } = useSnxT();
  const location = useLocation();
  const priceSource = t('StartNet X pricing (indicative, ex-GST)', 'StartNet X கட்டணம் (தோராயமானது, GST நீங்கலாக)');
  const signup = snxLink('/signup', { src: 'snx', brand: 'x', lang });
  // Sign-in returns to this page, as the utility bar's sign-in does (Book 1 Part B §3.3).
  const signin = snxLink('/login', {
    src: 'snx',
    lang,
    return: typeof window !== 'undefined' ? window.location.href : `${SITE_ORIGIN}${location.pathname}`,
  });

  return (
    <>
      <Seo
        // Primary keyword: "founder profile platform" (SEO brief). SEO-TA: pending native review.
        title={t('StartNet X: one free founder profile for every step', 'StartNet X: ஒவ்வொரு படிக்கும் ஒரே இலவச நிறுவனர் சுயவிவரம்')}
        description={t(
          'StartNet X (SNX) gives you one profile across every StartNet event, course, circle and programme. Free for individuals. Tamil and English.',
          'StartNet X (SNX) ஒவ்வொரு StartNet நிகழ்வு, படிப்பு, Circle, திட்டத்துக்கும் ஒரே சுயவிவரம் தருகிறது. தனிநபர்களுக்கு இலவசம். தமிழிலும் ஆங்கிலத்திலும்.'
        )}
        jsonLd={snxPageLd({
          path: '/startnet-x',
          lang,
          name: t('StartNet X: one free founder profile for every step', 'StartNet X: ஒவ்வொரு படிக்கும் ஒரே இலவச நிறுவனர் சுயவிவரம்'),
        })}
      />

      <BrandHero
        className="rk-page"
        brand="x"
        title={tx('One profile, from first event to first funding.')}
        lede={tx("StartNet X is the platform behind every StartNet programme. You get one profile that remembers what you've done, suggests what's next and stays in your control.")}
        actions={
          <>
            <Button size="lg" href={signup}>{t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}</Button>
            <Button variant="tertiary" size="lg" href={signin}>{t('Sign in', 'உள்நுழைக')}</Button>
          </>
        }
        meta={
          <p className="snx-hero__micro">
            <span className="snx-hero__icons" aria-hidden="true">
              <Smartphone size={16} /><MessageCircle size={16} /><Languages size={16} />
            </span>
            {tx('Free for individuals. Works on your phone, on WhatsApp and in Tamil.')}
          </p>
        }
        art={{ variant: 'network', brand: 'x', ratio: '4/5', seed: 11, animate: true, alt: '' }}
      />

      {/* Statement + profile thread across the four brands */}
      <Section surface="paper">
        <div className="snx-statement">
          <Reveal as="p" className="snx-statement__text display-xl">
            {t('Free for talent. One profile from first Vibathon to first funding', 'திறமையாளர்களுக்கு இலவசம். முதல் Vibathon-இலிருந்து முதல் நிதி வரை ஒரே சுயவிவரம்')}<Dot animate />
          </Reveal>
          <Reveal as="p" className="snx-statement__sub body-lg" delay={0.1}>
            {t(
              'One profile follows you across all four brands. Start in Vibe, grow in Connect, mentor in Women. You never start again.',
              'ஒரே சுயவிவரம் நான்கு பிராண்டுகளிலும் உங்களைத் தொடர்கிறது. Vibe-இல் தொடங்குங்கள், Connect-இல் வளருங்கள், Women-இல் வழிகாட்டுங்கள். மீண்டும் முதலிலிருந்து தொடங்க வேண்டியதில்லை.'
            )}
          </Reveal>
        </div>
        <ProfileThread />
      </Section>

      {/* What you can do */}
      <Section surface="white">
        <SectionHeader
          eyebrow={t('What you can do', 'நீங்கள் என்ன செய்யலாம்')}
          title={t('Nine modules, one profile', 'ஒன்பது தொகுதிகள், ஒரே சுயவிவரம்')}
          lede={t(
            'Each module is labelled Live, In beta or Coming, in step with the build plan. We never show a coming feature as live.',
            'ஒவ்வொரு தொகுதியும் உருவாக்கத் திட்டத்திற்கு ஏற்ப நேரலையில், பீட்டாவில் அல்லது விரைவில் எனக் குறிக்கப்படுகிறது. வரவிருக்கும் அம்சத்தை நேரலையில் உள்ளதாக நாங்கள் ஒருபோதும் காட்டுவதில்லை.'
          )}
          action={<Button variant="tertiary" to="/startnet-x/modules" icon={ArrowRight}>{t('All modules', 'அனைத்துத் தொகுதிகள்')}</Button>}
        />
        <RevealGroup className="snx-modules">
          {MODULES.map((m, i) => (
            <SnxModuleCard key={m.id} module={m} index={i} to={`/startnet-x/modules#${m.id}`} />
          ))}
        </RevealGroup>
      </Section>

      {/* Built for */}
      <Section surface="paper">
        <SectionHeader
          eyebrow="StartNet X"
          title={t('Built for', 'யாருக்காக')}
          lede={t(
            'Founders and learners use StartNet X free. Institutions, incubators, GCCs, government and investors run their programmes on it.',
            'நிறுவனர்களும் கற்பவர்களும் StartNet X-ஐ இலவசமாகப் பயன்படுத்துகிறார்கள். கல்வி நிறுவனங்கள், இன்குபேட்டர்கள், GCC-கள், அரசு, முதலீட்டாளர்கள் தங்கள் திட்டங்களை இதில் நடத்துகிறார்கள்.'
          )}
        />
        <div className="snx-audiences">
          <Tabs
            label={t('StartNet X audiences', 'StartNet X பயனர்கள்')}
            defaultTab="founders"
            tabs={AUDIENCES.map((a) => ({ id: a.id, label: tx(a.label), content: <AudiencePanel a={a} lang={lang} t={t} tx={tx} /> }))}
          />
        </div>
      </Section>

      {/* Trust strip — the page's one Night band */}
      <Section surface="night" labelledBy="snx-trust-title">
        <div className="snx-trust">
          <span className="snx-trust__icon" aria-hidden="true"><ShieldCheck size={20} strokeWidth={1.5} /></span>
          <h2 id="snx-trust-title" className="snx-trust__text display-xl">
            {tx(TRUST_STRIP).split('. ').map((s, i, arr) => (
              <span key={i} className="snx-trust__line">{s}{i < arr.length - 1 ? '.' : ''} </span>
            ))}
          </h2>
          <div className="snx-trust__foot">
            <Button variant="inverse" to="/startnet-x/trust" icon={ArrowRight}>{tx('How we handle your data')}</Button>
          </div>
        </div>
      </Section>

      {/* Pricing teaser */}
      <Section surface="paper">
        <div className="snx-price-teaser">
          <div>
            <p className="eyebrow">{t('Pricing', 'கட்டணம்')}</p>
            <h2 className="h2">{tx('Free for talent. Paid for organisations')}<span className="dot">.</span></h2>
            <p className="body-lg text-2 snx-price-teaser__sub">{tx('Your first step is always free. Pay only when you need more, and organisations pay for the outcomes they want.')}</p>
            <Button variant="tertiary" to="/startnet-x/pricing" icon={ArrowRight}>{tx('See pricing')}</Button>
          </div>
          <div className="snx-price-teaser__stats">
            <Stat value={0} prefix="₹" label={t('SNX Free, for anyone starting out', 'SNX Free, தொடங்கும் எவருக்கும்')} tag="C" source={priceSource} countUp={false} />
            <Stat value={499} prefix="₹" unit={tx('/month')} label={t('SNX Pro, for learners and solo founders', 'SNX Pro, கற்பவர்களுக்கும் தனி நிறுவனர்களுக்கும்')} tag="C" source={priceSource} />
          </div>
        </div>
      </Section>

      {/* AEO FAQ: drafted from Book 2 §7.1 (overview, trust strip, pricing teaser) and §7.3 (pricing) — StartNet review */}
      <Section surface="white" labelledBy="snx-faq-title" className="snx-faq rk-faq">
        <div className="rk-faq__grid">
        <SectionHeader id="snx-faq-title" eyebrow={t('Questions', 'கேள்விகள்')} title={t('Common questions', 'பொதுவான கேள்விகள்')} />
        <Accordion
          faq
          items={[
            {
              id: 'snx-faq-what',
              question: t('What is StartNet X?', 'StartNet X என்றால் என்ன?'),
              answer: t(
                'StartNet X (SNX) is the StartNet platform: one profile across every StartNet event, course, circle and programme, from first event to first funding. It works in Tamil and English.',
                'StartNet X (SNX) என்பது StartNet தளம்: முதல் நிகழ்விலிருந்து முதல் நிதி வரை, ஒவ்வொரு StartNet நிகழ்வு, படிப்பு, Circle, திட்டத்துக்கும் ஒரே சுயவிவரம். தமிழிலும் ஆங்கிலத்திலும் செயல்படுகிறது.'
              ),
            },
            {
              id: 'snx-faq-pay',
              question: t('Who pays for StartNet X?', 'StartNet X-க்கு யார் கட்டணம் செலுத்துகிறார்கள்?'),
              answer: t(
                'It is free for talent and paid for organisations. Your first step is always free; you pay only when you need more, such as SNX Pro for learners and solo founders (₹499 a month, indicative, ex-GST). Organisations pay for the outcomes they want.',
                'திறமையாளர்களுக்கு இலவசம், நிறுவனங்களுக்குக் கட்டணம். உங்கள் முதல் அடி எப்போதும் இலவசம்; மேலும் தேவைப்படும்போது மட்டும் கட்டணம், எ.கா. கற்பவர்களுக்கும் தனி நிறுவனர்களுக்கும் SNX Pro (மாதம் ₹499, தோராயமானது, GST நீங்கலாக). நிறுவனங்கள் தாங்கள் விரும்பும் விளைவுகளுக்குக் கட்டணம் செலுத்துகின்றன.'
              ),
            },
            {
              id: 'snx-faq-data',
              question: t('Where is my data kept, and who sees it?', 'என் தரவு எங்கே வைக்கப்படுகிறது, யார் பார்க்கலாம்?'),
              answer: t(
                'Your data stays in India. You choose who sees your profile, and there are no automated rejections, ever. The Trust page explains how StartNet X follows the DPDP Act, 2023.',
                'உங்கள் தரவு இந்தியாவிலேயே இருக்கும். உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே முடிவு செய்கிறீர்கள்; தானியங்கி நிராகரிப்பு ஒருபோதும் இல்லை. StartNet X எப்படி DPDP சட்டம், 2023-ஐப் பின்பற்றுகிறது என்பதை நம்பிக்கை பக்கம் விளக்குகிறது.'
              ),
            },
            {
              id: 'snx-faq-start',
              question: t('How do I start?', 'எப்படித் தொடங்குவது?'),
              answer: t(
                "Create your free StartNet X profile. We'll show you the next step that fits you: an event, a course, a circle or a programme.",
                'உங்கள் இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள். உங்களுக்குப் பொருத்தமான அடுத்த அடியை நாங்கள் காட்டுவோம்: ஒரு நிகழ்வு, ஒரு படிப்பு, ஒரு Circle அல்லது ஒரு திட்டம்.'
              ),
            },
          ]}
        />
        </div>
      </Section>

      {/* Closing CTA on paper: the red stays on the one conversion button (AngelList family: one accent). */}
      <CTABand
        surface="paper"
        brand="x"
        title={t('Start where you are.', 'நீங்கள் இருக்கும் இடத்திலிருந்தே தொடங்குங்கள்.')}
        body={t(
          "Make a free StartNet X profile and we'll show you the next step that fits you: an event, a course, a circle or a programme.",
          'இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள்; உங்களுக்குப் பொருத்தமான அடுத்த அடியை நாங்கள் காட்டுவோம்: ஒரு நிகழ்வு, ஒரு படிப்பு, ஒரு Circle அல்லது ஒரு திட்டம்.'
        )}
        actions={
          <>
            <Button href={signup}>{t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}</Button>
            <WhatsAppButton text={t("Hi StartNet, I'd like to know more about StartNet X", 'வணக்கம் StartNet, StartNet X பற்றி மேலும் அறிய விரும்புகிறேன்')} />
          </>
        }
      />
    </>
  );
}

function AudiencePanel({ a, lang, t, tx }) {
  return (
    <div className="snx-aud">
      <div className="snx-aud__intro">
        <h3 className="h3">{tx(a.title)}</h3>
        <p className="body-lg text-2">{tx(a.sub)}</p>
        {a.cta.snx ? (
          <Button href={snxLink(a.cta.snx, { src: `snx-${a.id}`, brand: 'x', lang })}>{t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}</Button>
        ) : (
          <Button variant="secondary" to={`${a.cta.to}-${a.id}`}>{tx(a.cta.label)}</Button>
        )}
      </div>
      <ol className="snx-aud__blocks">
        {a.blocks.map((b, i) => (
          <li key={b.title} className="snx-aud__block">
            <span className="snx-aud__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="h5">{tx(b.title)}</h4>
            <p className="text-2">{tx(b.body)}</p>
          </li>
        ))}
      </ol>
      {/* "Institutions using StartNet X: [placeholder]" is hidden until a tenant signs. */}
    </div>
  );
}

/** Signature interaction: the red full stop (your profile) travels across the four brand doors. */
function ProfileThread() {
  const reduced = useReducedMotion();
  const { t } = useSnxT();
  return (
    <div
      className="snx-thread"
      role="img"
      aria-label={t(
        'One StartNet X profile moving across StartNet Research, Vibe, Connect and Women',
        'StartNet Research, Vibe, Connect, Women முழுவதும் பயணிக்கும் ஒரே StartNet X சுயவிவரம்'
      )}
    >
      <div className="snx-thread__rail" aria-hidden="true">
        <motion.span
          className="snx-thread__line"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.4, 0.14, 0.3, 1] }}
        />
        <motion.span
          className="snx-thread__runner"
          initial={reduced ? false : { x: '0%' }}
          whileInView={reduced ? undefined : { x: ['0%', '0%', '33.333%', '33.333%', '66.667%', '66.667%', '100%'] }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 3.2, times: [0, 0.12, 0.3, 0.42, 0.6, 0.72, 0.9], ease: 'easeInOut', delay: 0.3 }}
          style={reduced ? { x: '100%' } : undefined}
        >
          <span className="snx-thread__dot" />
        </motion.span>
      </div>
      <ol className="snx-thread__nodes">
        {THREAD.map((k) => (
          <li key={k} className="snx-thread__node" data-brand={k}>
            <span className="snx-thread__pin" aria-hidden="true" />
            <span className="snx-thread__name">{BRANDS[k].name}</span>
            <span className="snx-thread__journey">{t(BRANDS[k].journey, BRANDS[k].journeyTa)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
