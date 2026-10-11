import { motion } from 'framer-motion';
import { Briefcase, Store, GraduationCap, Sun, Languages, TrendingUp, Scale, Smartphone, Award } from 'lucide-react';
import {
  Accordion,
  ArtImage,
  BrandHero,
  Button,
  CTABand,
  Placeholder,
  ProgrammeCard,
  Reveal,
  RevealGroup,
  Section,
  SectionHeader,
  Seo,
  Stat,
  TagChip,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import { BRANDS } from '../../../data/brands.js';
import CircleFinder from './CircleFinder.jsx';
import SchemeExplorer from './SchemeExplorer.jsx';
import RisingPath from './RisingPath.jsx';
import WomenStories from './WomenStories.jsx';
import WomenProof from './WomenProof.jsx';
import NominationForm from './NominationForm.jsx';
import { DESIGN_FOR_YOU, FAQ, INCLUSION_FLOOR_METRIC, SNX, TA, WHO_FOR, WOMEN_LED_METRIC, localMetric } from './womenContent.js';
import { itemListLd } from '../../../lib/seo.js';
import { cleanFaqLd, pageLd } from '../seoBits.js';
import { ScrubText } from '../../../components/ScrubText.jsx';
import '../brandPage.css';
import './Women.css';

/** Programmes listed on this brand home (ItemList JSON-LD). */
const WOMEN_PROGRAMMES = [
  { name: 'Women Circles', path: '/women/circles' },
  { name: 'Rise Academy', path: '/women/rise-academy' },
  { name: 'HerCapital', path: '/women/hercapital' },
  { name: 'Women Founders Summit & Awards', path: '/women/summit' },
];

// SEO: primary "women entrepreneurs Tamil Nadu", secondary "women founder programmes" (Book 1 §9.2).
// SEO-TA: pending native review ("பெண் தொழில்முனைவோர்")
const SEO = {
  title: ['StartNet Women: for women entrepreneurs in Tamil Nadu', 'StartNet Women: தமிழ்நாட்டுப் பெண் தொழில்முனைவோருக்கு'],
  description: [
    'For women entrepreneurs in Tamil Nadu: monthly district Circles, Rise Academy with a 1:1 mentor, HerCapital investment readiness and the Women Founders Summit.',
    'தமிழ்நாட்டுப் பெண் தொழில்முனைவோருக்கு: மாதாந்திர மாவட்ட வட்டங்கள், 1:1 வழிகாட்டியுடன் Rise Academy, HerCapital முதலீட்டுத் தயார்நிலை, Women Founders Summit.',
  ],
};

const ICONS = { briefcase: Briefcase, store: Store, grad: GraduationCap, sun: Sun, languages: Languages, trending: TrendingUp, scale: Scale };
const RISE_MODULES = [
  ['Business models', 'வணிக மாதிரிகள்'],
  ['Finance', 'நிதி'],
  ['Digital and ONDC selling', 'டிஜிட்டல் மற்றும் ONDC விற்பனை'],
  ['Branding', 'பிராண்டிங்'],
  ['Compliance', 'சட்ட இணக்கம்'],
];

// Tamil strings are drafts (Book 2 §14: native Tamil review pending). Programme names stay in Latin script.
export default function WomenHome() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const brand = BRANDS.women;
  const programmes = useApi('/api/programmes?brand=women');
  const open = (Array.isArray(programmes.data) ? programmes.data : []).filter((p) => p.status !== 'closed').slice(0, 3);
  const snx = (key, src) => snxLink(SNX[key].path, { ...SNX[key].params, brand: 'women', lang, src });
  const womenLed = localMetric(WOMEN_LED_METRIC, t);
  const faq = FAQ.map((f) => ({ id: f.id, question: t(f.question, f.questionTa), answer: t(f.answer, f.answerTa) }));
  const juryLine = t('Awards are decided by an independent jury', 'விருதுகளைச் சுயாதீன நடுவர் குழு முடிவு செய்கிறது');


  return (
    <>
      <Seo
        title={t(...SEO.title)}
        titleTa={SEO.title[1]}
        description={t(...SEO.description)}
        descriptionTa={SEO.description[1]}
        jsonLd={[
          pageLd({ path: '/women', lang, name: t(...SEO.title), description: t(...SEO.description) }),
          itemListLd({ name: t('StartNet Women programmes', 'StartNet Women திட்டங்கள்'), items: WOMEN_PROGRAMMES, lang }),
          // FAQPage from the FAQ below, minus answers that still carry [placeholder] / [C] marks (childcare, fees).
          cleanFaqLd(faq),
        ]}
      />

      <BrandHero
        brand="women"
        className="brand-hero--portrait-art"
        title={t("Half of Tamil Nadu's startups are women-led. Now for the capital.", 'தமிழ்நாட்டின் ஸ்டார்ட்அப்களில் பாதி பெண்கள் தலைமையிலானவை. இனி முதலீட்டுக்கான நேரம்.')}
        lede={t(
          'StartNet Women helps women build product and service companies and get them ready for investment, with formats that fit around real lives.',
          'உண்மையான வாழ்க்கைக்கு ஏற்ற வடிவங்களுடன், பெண்கள் தயாரிப்பு மற்றும் சேவை நிறுவனங்களை உருவாக்கி, அவற்றை முதலீட்டுக்குத் தயார்படுத்த StartNet Women உதவுகிறது.'
        )}
        actions={
          <>
            <Button variant="brand" size="lg" to="/women/circles">{t('Join a Women Circle', 'ஒரு Women Circle-இல் இணையுங்கள்')}</Button>
            <Button variant="secondary" size="lg" to="/women/rise-academy">{t('Start Rise Academy', 'Rise Academy-ஐத் தொடங்குங்கள்')}</Button>
          </>
        }
        art={{ variant: 'kolam', brand: 'women', ratio: '4/5', seed: 38, label: t('Woman → Founder', TA.journey), alt: '', animate: true }}
        meta={
          <div className="women-hero__source">
            <Stat metric={womenLed} variant="compact" />
            <p className="caption">{womenLed.note}</p>
          </div>
        }
      />

      {/* Proof band (renders its own section; hidden until a Women figure is supplied) */}
      <WomenProof />

      {/* Statement + signature rising path */}
      <Section labelledBy="women-promise">
        <div className="women-statement">
          <p className="eyebrow">{t(brand.journey, brand.journeyTa || TA.journey)}</p>
          <Reveal as="h2" className="h1 women-statement__title">
            <span id="women-promise">
              {lang === 'ta' ? (
                <>தொழில் உரிமையாளரிலிருந்து முதலீட்டுக்குத் தகுதியான நிறுவனர் வரை: <em className="women-statement__em">முதலில் சந்தை அணுகல், அடுத்து முதலீடு</em></>
              ) : (
                <>From business owner to investable founder: <em className="women-statement__em">market access first, capital next</em></>
              )}
              <span className="dot">.</span>
            </span>
          </Reveal>
        </div>
        <RisingPath />
      </Section>

      {/* Who it's for + how we design for you */}
      <Section surface="sunken">
        <div className="women-who">
          <div>
            <SectionHeader eyebrow="StartNet Women" title={t("Who it's for.", 'யாருக்கானது.')} as="h2" />
            <RevealGroup as="ul" className="women-who__list">
              {WHO_FOR.map((w) => {
                const Icon = ICONS[w.icon];
                return (
                  <li key={w.title} className="women-who__item">
                    <span className="women-who__icon" aria-hidden="true"><Icon size={22} /></span>
                    <div>
                      <h3 className="h5">{t(w.title, w.titleTa)}</h3>
                      <p className="text-2">{t(w.body, w.bodyTa)}</p>
                    </div>
                  </li>
                );
              })}
            </RevealGroup>
          </div>
          <div className="women-design">
            <h2 className="h3">{t('How we design for you', 'உங்களுக்காக எப்படி வடிவமைக்கிறோம்')}<span className="dot">.</span></h2>
            <RevealGroup as="ul" className="women-design__list">
              {DESIGN_FOR_YOU.map((d) => {
                const Icon = ICONS[d.icon];
                return (
                  <li key={d.title} className="women-design__item">
                    <Icon aria-hidden="true" size={20} className="women-design__icon" />
                    <p>
                      <strong>{t(d.title, d.titleTa)}</strong>
                      {d.body && <> {t(d.body, d.bodyTa)}</>}
                      {/* d.placeholder is an editorial "confirm before publishing" note: not shown to visitors. */}
                    </p>
                  </li>
                );
              })}
            </RevealGroup>
            <div className="women-design__floor">
              <Stat metric={localMetric(INCLUSION_FLOOR_METRIC, t)} />
            </div>
          </div>
        </div>
      </Section>

      {/* Women Circles: finder */}
      <Section id="circles" labelledBy="women-circles-title">
        <div className="women-circles__head">
          <div>
            <p className="eyebrow">Women Circles</p>
            <h2 id="women-circles-title" className="h1">{t('Twenty founders in your district, every month', 'உங்கள் மாவட்டத்தில் இருபது நிறுவனர்கள், ஒவ்வொரு மாதமும்')}<span className="dot">.</span></h2>
          </div>
          <ScrubText className="body-lg text-2 women-circles__lede">
            {t(
              'A chapter of 20–30 women founders that meets monthly for accountability, problem-solving and introductions to buyers.',
              'பொறுப்புணர்வு, சிக்கல் தீர்வு மற்றும் வாங்குபவர் அறிமுகங்களுக்காக மாதந்தோறும் சந்திக்கும் 20–30 பெண் நிறுவனர்களின் குழு.'
            )}
          </ScrubText>
        </div>
        <CircleFinder src="women-home" />
      </Section>

      {/* Rise Academy: statement split */}
      <Section surface="white" labelledBy="women-rise-title">
        <div className="split women-rise">
          <Reveal className="women-rise__art">
            <ArtImage variant="ladder" brand="women" ratio="4/5" seed={12} label={t('Rise Academy, on your phone', 'Rise Academy, உங்கள் கைபேசியில்')} alt="" />
            <motion.div
              className="women-rise__phone"
              aria-hidden="true"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: 0.2 }}
            >
              <Smartphone size={18} />
              <span>{t('1:1 mentor', 'தனிப்பட்ட வழிகாட்டி')}</span>
            </motion.div>
          </Reveal>
          <div className="stack women-rise__copy">
            <p className="eyebrow">Rise Academy</p>
            <h2 id="women-rise-title" className="h1">{t('Learn the business side, with a mentor beside you', 'உங்களுடன் ஒரு வழிகாட்டி இருக்க, தொழிலின் வணிகப் பக்கத்தைக் கற்றுக்கொள்ளுங்கள்')}<span className="dot">.</span></h2>
            <p className="body-lg text-2">
              {t(
                'Business models, finance, digital and ONDC selling, branding and compliance, on your phone, in Tamil or English, paired with a 1:1 mentor.',
                'வணிக மாதிரிகள், நிதி, டிஜிட்டல் மற்றும் ONDC விற்பனை, பிராண்டிங், சட்ட இணக்கம்: உங்கள் கைபேசியில், தமிழில் அல்லது ஆங்கிலத்தில், தனிப்பட்ட (1:1) வழிகாட்டியுடன்.'
              )}
            </p>
            <ul className="women-rise__modules" aria-label={t('What Rise Academy covers', 'Rise Academy கற்பிப்பவை')}>
              {RISE_MODULES.map(([en, ta], i) => (
                <li key={en}><span className="tnum">{String(i + 1).padStart(2, '0')}</span>{t(en, ta)}</li>
              ))}
            </ul>
            <p className="small">
              {t('Fee:', 'கட்டணம்:')} <Placeholder>[placeholder — CSR-subsidised; indicative ₹5,000–15,000]</Placeholder> <TagChip tag="C" />
            </p>
            <div className="cluster">
              <Button variant="brand" href={snx('rise', 'women-home')}>{t('Start Rise Academy', 'Rise Academy-ஐத் தொடங்குங்கள்')}</Button>
              <Button variant="tertiary" to="/women/rise-academy">{t('How it works', 'இது எப்படிச் செயல்படுகிறது')}</Button>
            </div>
            <p className="caption">{t('Ask about sponsored seats.', 'நிதியுதவி பெற்ற இடங்கள் பற்றிக் கேளுங்கள்.')}</p>
          </div>
        </div>
      </Section>

      {/* HerCapital: scheme explorer */}
      <Section id="hercapital" labelledBy="women-hercapital-title">
        <div className="women-hc__head">
          <div>
            <p className="eyebrow">HerCapital</p>
            <h2 id="women-hercapital-title" className="h1">{t("Get ready for the money that's already there", 'ஏற்கெனவே உள்ள நிதிக்குத் தயாராகுங்கள்')}<span className="dot">.</span></h2>
          </div>
          <div className="stack">
            <p className="body-lg text-2">
              {t(
                "We help you prepare for investors and apply to schemes for women-led businesses, including StartupTN's TANSEED (up to ₹15 L for women-led startups), TIIC's Vetri Magalir loans (₹10 L to ₹5 Cr) and NITI Aayog's Women Entrepreneurship Platform.",
                'முதலீட்டாளர்களுக்குத் தயாராகவும், பெண்கள் தலைமையிலான தொழில்களுக்கான திட்டங்களுக்கு விண்ணப்பிக்கவும் உதவுகிறோம்: StartupTN-இன் TANSEED (பெண்கள் தலைமையிலான ஸ்டார்ட்அப்களுக்கு ₹15 லட்சம் வரை), TIIC-இன் Vetri Magalir கடன்கள் (₹10 லட்சம் முதல் ₹5 கோடி வரை), NITI Aayog-இன் Women Entrepreneurship Platform.'
              )}
            </p>
            <p className="small">{t('A women angel circle is planned', 'பெண் ஏஞ்சல் முதலீட்டாளர் குழு திட்டமிடப்பட்டுள்ளது')} <span className="women-proposed">{t('[proposed]', '[முன்மொழியப்பட்டது]')}</span>.</p>
          </div>
        </div>
        <SchemeExplorer src="women-home" />
      </Section>

      {/* Women Founders Summit & Awards: the page's one Night band */}
      <Section surface="night" brand="women" labelledBy="women-summit-title" className="women-summit">
        <div className="women-summit__grid">
          <div className="stack women-summit__copy">
            <p className="eyebrow"><Award aria-hidden="true" size={16} className="women-inline-icon" /> Women Founders Summit &amp; Awards</p>
            <h2 id="women-summit-title" className="h1">{t('A day for the founders, and the numbers behind them', 'நிறுவனர்களுக்கும், அவர்களின் பின்னால் உள்ள எண்களுக்குமான ஒரு நாள்')}<span className="dot">.</span></h2>
            <p className="body-lg">
              {lang === 'ta' ? (
                <>ஆண்டு முதன்மை நிகழ்வு: மேடையில் நிறுவனர்கள், சுயாதீன நடுவர் குழு முடிவு செய்யும் விருதுகள், TN Women Founders Report வெளியீடு.</>
              ) : (
                <>The annual flagship: founders on stage, awards decided by an independent jury, and the launch of the TN Women Founders Report.</>
              )}
            </p>
            {/* "Date and venue: [placeholder]" is hidden until StartNet supplies them. */}
            <div className="cluster">
              <Button variant="brand" href={snx('summit', 'women-home')}>{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</Button>
              <Button variant="secondary" to="/women/summit#nominate">{t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}</Button>
              <Button variant="tertiary" to="/partner/sponsors">{t('Sponsor the Summit', 'Summit-க்கு நிதியுதவி செய்யுங்கள்')}</Button>
            </div>
          </div>
          <div className="women-summit__art">
            <ArtImage variant="dot" brand="women" ratio="1/1" night seed={8} alt="" label="TN Women Founders Report" animate />
          </div>
        </div>
      </Section>

      {/* Nomination */}
      <Section surface="white" id="nominate" labelledBy="women-nominate-title">
        <div className="split split--8-4 women-nominate__wrap">
          <div className="stack">
            <p className="eyebrow">{t('Awards', 'விருதுகள்')}</p>
            <h2 id="women-nominate-title" className="h2">{t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}<span className="dot">.</span></h2>
            <p className="text-2">{t(
              'Founders on stage, awards decided by an independent jury. Tell us about a woman founder building a company in Tamil Nadu.',
              'மேடையில் நிறுவனர்கள், சுயாதீன நடுவர் குழு முடிவு செய்யும் விருதுகள். தமிழ்நாட்டில் நிறுவனம் உருவாக்கும் ஒரு பெண் நிறுவனரைப் பற்றிச் சொல்லுங்கள்.'
            )}</p>
            <NominationForm src="women-home" />
          </div>
          <aside className="women-nominate__aside stack">
            <p className="h5">{t('How the Awards are decided', 'விருதுகள் எப்படி முடிவு செய்யப்படுகின்றன')}</p>
            <p className="text-2 small">{juryLine}.</p>
          </aside>
        </div>
      </Section>

      {/* Programmes open now */}
      {open.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow={t('Open now', 'இப்போது திறந்துள்ளவை')}
            title={t('StartNet Women programmes', 'StartNet Women திட்டங்கள்')}
            action={<Button variant="tertiary" to="/programmes?brand=women">{t('Find your programme', TA.findProgramme)}</Button>}
          />
          <RevealGroup className="grid grid-3">
            {open.map((p) => <ProgrammeCard key={p.slug} programme={p} />)}
          </RevealGroup>
        </Section>
      )}

      {/* Stories (the whole section hides until a real Women story is published) */}
      <WomenStories surface="sunken">
        <SectionHeader
          eyebrow={t('Stories', 'கதைகள்')}
          title={t('Women founders, with outcomes.', 'பெண் நிறுவனர்கள், விளைவுகளுடன்.')}
          action={<Button variant="tertiary" to="/insights/stories?brand=women">{t('All Women stories', 'அனைத்து Women கதைகளும்')}</Button>}
        />
      </WomenStories>

      {/* FAQ */}
      <Section className="bp-faq">
        <SectionHeader eyebrow={t('Questions', 'கேள்விகள்')} title={t('Before you join.', 'இணையும் முன்.')} />
        <Accordion items={faq} />
      </Section>

      <CTABand
        surface="paper"
        brand="women"
        className="brand-close"
        title={t('Talk to StartNet Women on WhatsApp.', 'WhatsApp-இல் StartNet Women-உடன் பேசுங்கள்.')}
        body={t(
          'Send the keyword WOMEN and the chat opens in context. Opt-ins are logged before any message is sent.',
          'WOMEN என்ற சொல்லை அனுப்புங்கள்; உரையாடல் சரியான சூழலில் தொடங்கும். எந்தச் செய்தியும் அனுப்பப்படும் முன் உங்கள் ஒப்புதல் பதிவு செய்யப்படும்.'
        )}
        actions={
          <>
            <Button variant="whatsapp" href={waLink('WOMEN', 'women-home')}>{t('Chat on WhatsApp', TA.chatWhatsApp)}</Button>
            <Button variant="primary" href={snxLink('/signup', { brand: 'women', lang, src: 'women-home', persona: 'woman-founder' })}>
              {t('Create your free profile', TA.createProfile)}
            </Button>
          </>
        }
      />
    </>
  );
}
