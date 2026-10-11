import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Steps, Button, Reveal, RevealGroup, ArtImage, CTABand, Dot, Accordion,
} from '../../components';
import { ScrubText } from '../../components/ScrubText.jsx';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import {
  HUB_CARDS, PARTNER_TYPES, SOLUTIONS, WA_TEXT, WA_TEXT_TA, DISTRICT_ONE_LINE_TA,
  enquirePath, localiseSteps, tf, ALL_TYPES,
} from './partnerData.js';
import { webPageLd, itemListLd, langPath } from '../../lib/seo.js';
import { LedgerProof, SignedPartners } from './PartnerProof.jsx';
import './Partner.css';
import '../utility/restKit.css';

// /partner — Partner hub (Book 2 §8.0; Book 1 Part B §3.2 ⑦ for solutions + proof columns).
export default function Partner() {
  const { t, localePath, lang } = useLang();
  const f = (obj, key) => tf(t, obj, key);
  const enquire = t('Start an enquiry', 'விசாரணையைத் தொடங்குங்கள்');
  const ourPartners = t('Our partners', 'எங்கள் கூட்டாளர்கள்');

  return (
    <>
      <Seo
        // Primary keyword: "startup partnerships Tamil Nadu" (CSR / GCC / college intents). SEO-TA: pending native review.
        title={t('Startup partnerships in Tamil Nadu: partner with StartNet', 'StartNet உடன் கூட்டு: தமிழ்நாட்டு நிறுவனர்கள்')}
        description={t(
          'For institutions, GCCs, government, sponsors, CSR funders and investors in Tamil Nadu: programmes built around your outcomes, reported in public.',
          'கல்வி நிறுவனங்கள், GCC-கள், அரசு, ஸ்பான்சர்கள், CSR நிதியளிப்பாளர்கள், முதலீட்டாளர்களுக்கு: விரும்பும் விளைவுகளுக்கான திட்டங்கள், பொதுவில் அறிக்கை.'
        )}
        jsonLd={[
          webPageLd({ path: langPath('/partner', lang), type: 'CollectionPage', lang, name: t('Startup partnerships in Tamil Nadu', 'StartNet உடன் கூட்டு') }),
          itemListLd({
            name: t('Ways to partner with StartNet', 'StartNet உடன் கூட்டு சேரும் வழிகள்'),
            lang,
            items: [...ALL_TYPES, 'district-programme'].map((k) => PARTNER_TYPES[k]).filter(Boolean).map((p) => ({ name: f(p, 'menuLabel') || f(p, 'label'), path: `/partner/${p.slug}` })),
          }),
        ]}
      />

      <PageHero
        className="rk-hero rk-page partner-hero"
        eyebrow={t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}
        title={t('Back the founders. See what it produced.', 'நிறுவனர்களுக்கு ஆதரவளியுங்கள். அது என்ன உருவாக்கியது என்று பாருங்கள்.')}
        lede={t(
          "We design programmes around the outcome you're paying for (spinouts, pilots, talent, reach or deal flow) and report against it on the Founder Ledger.",
          'நீங்கள் செலவிடும் விளைவைச் சுற்றி (ஸ்பின்அவுட்கள், முன்னோட்டங்கள், திறமையாளர்கள், பார்வையாளர் அணுகல் அல்லது முதலீட்டு வாய்ப்புகள்) திட்டங்களை வடிவமைத்து, Founder Ledger-இல் அதன் அடிப்படையில் அறிக்கையிடுகிறோம்.'
        )}
        breadcrumbs={[{ label: t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்') }]}
        actions={
          <>
            <Button to="/partner/enquire" size="lg">{enquire}</Button>
            <Button to="/insights/founder-ledger" variant="tertiary" size="lg">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Button>
          </>
        }
        art={{ variant: 'network', ratio: '4/5', seed: 8, alt: '' }}
      />

      {/* Partner by type — five doors */}
      <Section surface="white">
        <SectionHeader
          eyebrow={t('Partner by type', 'வகை வாரியாகக் கூட்டு சேருங்கள்')}
          title={t('Start with who you are.', 'நீங்கள் யார் என்பதிலிருந்து தொடங்குங்கள்.')}
          lede={(
            // DESIGN-v2 6.4: the page's one scroll-scrubbed statement (plain text in SSR, reduced motion and Tamil).
            <ScrubText as="span">
              {t(
                'Each page sets out what you get, what you can report and the proof you can check before you sign.',
                'உங்களுக்குக் கிடைப்பவை, நீங்கள் அறிக்கையிடக்கூடியவை, கையெழுத்திடும் முன் நீங்கள் சரிபார்க்கக்கூடிய சான்றுகள் ஆகியவற்றை ஒவ்வொரு பக்கமும் விளக்குகிறது.'
              )}
            </ScrubText>
          )}
          as="h2"
        />
        <RevealGroup as="ul" className="partner-doors" stagger={0.05}>
          {HUB_CARDS.map((card, i) => {
            const Icon = card.icon;
            const outcome = card.outcome ? f(card, 'outcome') : f(PARTNER_TYPES[card.key], 'hubOutcome');
            return (
              <li key={card.key} className="partner-door">
                <span className="partner-door__index tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <Icon className="partner-door__icon" aria-hidden="true" size={28} strokeWidth={1.5} />
                <h3 className="partner-door__title h4">
                  <Link to={localePath(card.to)} className="partner-door__link">{f(card, 'label')}</Link>
                </h3>
                <p className="partner-door__body">{outcome}</p>
                <span className="partner-door__more" aria-hidden="true">
                  {t('Learn more', 'மேலும் அறிக')} <ArrowRight size={16} />
                </span>
              </li>
            );
          })}
        </RevealGroup>
        <p className="partner-also">
          <span className="partner-also__label">{t('Also:', 'மேலும்:')}</span>
          <Link to={localePath('/partner/csr')}>{f(PARTNER_TYPES.csr, 'menuLabel')}</Link>
          <Link to={localePath('/partner/incubators')}>{f(PARTNER_TYPES.incubators, 'menuLabel')}</Link>
          <Link to={localePath('/partner/district-programme')}>District Ecosystem Programme</Link>
          <Link to={localePath('/partner/our-partners')}>{ourPartners}</Link>
        </p>
      </Section>

      {/* How partnering works */}
      <Section id="how" labelledBy="partner-how-title">
        <div className="partner-how">
          <div className="partner-how__intro">
            <p className="eyebrow">{t('How partnering works', 'கூட்டாண்மை எப்படிச் செயல்படுகிறது')}</p>
            <h2 id="partner-how-title" className="h2">{t('Three steps, reported in public', 'மூன்று படிகள், பொதுவில் அறிக்கையுடன்')}<Dot /></h2>
            <p className="body-lg text-2">
              {t(
                'Every partnership is measured against the outcome you chose, on the same Founder Ledger everyone else can read.',
                'ஒவ்வொரு கூட்டாண்மையும், நீங்கள் தேர்ந்தெடுத்த விளைவின் அடிப்படையில், அனைவரும் படிக்கக்கூடிய அதே Founder Ledger-இல் அளவிடப்படுகிறது.'
              )}
            </p>
          </div>
          <Steps steps={localiseSteps(t)} variant="row" />
        </div>
      </Section>

      {/* Highest-leverage offer — the page's one Night band */}
      <Section surface="night" labelledBy="partner-district-title" className="partner-district">
        <div className="split">
          <Reveal>
            <p className="eyebrow">{t('Our highest-leverage offer', 'அதிகத் தாக்கம் தரும் எங்கள் வாய்ப்பு')}</p>
            <h2 id="partner-district-title" className="display-xl partner-district__title">
              District Ecosystem Programme
            </h2>
            <p className="body-lg partner-district__body">
              {t(
                'All four StartNet brands in one district for a year, run with the district administration, StartupTN or a CSR funder. Scoped and priced per district.',
                DISTRICT_ONE_LINE_TA
              )}
            </p>
            <div className="cluster partner-district__actions">
              <Button to={enquirePath('government', 'district-programme')} variant="inverse" size="lg">
                {t('Discuss a district programme', 'மாவட்டத் திட்டம் பற்றிப் பேசுங்கள்')}
              </Button>
              <Button to="/partner/district-programme" variant="tertiary">{t('How it works', 'இது எப்படிச் செயல்படுகிறது')}</Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="partner-district__art">
            <ArtImage variant="map" ratio="1/1" night seed={38} alt="" label={t('Tamil Nadu · 38 districts', 'தமிழ்நாடு · 38 மாவட்டங்கள்')} />
          </Reveal>
        </div>
      </Section>

      {/* Ready-made solutions */}
      <Section surface="white">
        <SectionHeader
          eyebrow={t('Ready-made solutions', 'தயார்நிலைத் தீர்வுகள்')}
          title={t('Programmes you can start this year.', 'இந்த ஆண்டே தொடங்கக்கூடிய திட்டங்கள்.')}
          as="h2"
          action={<Button to="/partner/enquire" variant="tertiary">{t('Ask about something else', 'வேறு எதைப் பற்றியாவது கேளுங்கள்')}</Button>}
        />
        <RevealGroup as="ul" className="partner-solutions" stagger={0.04}>
          {SOLUTIONS.map((s) => (
            <li key={s.title} className="partner-solution">
              <Link to={localePath(s.to)} className="partner-solution__link">
                <span className="partner-solution__title h5">{f(s, 'title')}</span>
                <span className="partner-solution__body">{f(s, 'body')}</span>
                <ArrowRight className="partner-solution__arrow" aria-hidden="true" size={20} />
              </Link>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Proof */}
      <Section>
        <SectionHeader
          eyebrow={t('Proof', 'சான்று')}
          title={t('See what it produced.', 'அது என்ன உருவாக்கியது என்று பாருங்கள்.')}
          lede={t(
            'Figures come from the Founder Ledger, each with a source, an as-at date and an A, B or C confidence tag. Partners appear only once signed, with dates.',
            'எண்கள் Founder Ledger-இலிருந்து வருகின்றன; ஒவ்வொன்றுக்கும் ஒரு மூலம், நிலவரத் தேதி, A, B அல்லது C நம்பக அடையாளம் உண்டு. கூட்டாளர்கள் கையெழுத்திட்ட பின்னரே, தேதிகளுடன் இடம்பெறுவார்கள்.'
          )}
          as="h2"
        />
        <div className="partner-proof">
          <LedgerProof />
          <div className="partner-proof__row">
            <div>
              <h3 className="h5 partner-proof__subhead">{ourPartners}</h3>
              <SignedPartners />
            </div>
            <ul role="list" className="partner-proof__links">
              <li>
                <Link className="partner-link" to={localePath('/partner/our-partners')}>
                  {t('Our partners (signed, dated)', 'எங்கள் கூட்டாளர்கள் (கையெழுத்திட்டவை, தேதியுடன்)')} <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </li>
              {/* F-88: /insights/stories?type=partner has no stories yet; outcome reporting lives under Reports. */}
              <li>
                <Link className="partner-link" to={localePath('/insights/reports')}>
                  {t('Partner outcomes', 'கூட்டாண்மை விளைவுகள்')} <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </li>
              <li>
                <Link className="partner-link" to={localePath('/insights/founder-ledger')}>
                  {t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')} <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </li>
              <li>
                <Link className="partner-link" to={localePath('/about/evidence-standard')}>
                  {t('Our evidence standard', 'எங்கள் சான்றுத் தரநிலை')} <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* AEO FAQ: drafted from Book 2 §8.0–8.1 (hub, audience pages, enquiry routing, signed-partner rule) — StartNet review */}
      <Section surface="white" labelledBy="partner-faq-title" className="partner-faq rk-faq">
        <div className="partner-faq__grid">
          <SectionHeader id="partner-faq-title" eyebrow={t('Questions', 'கேள்விகள்')} title={t('Common questions', 'பொதுவான கேள்விகள்')} as="h2" />
          <Accordion
            faq
            items={[
              {
                id: 'partner-faq-how',
                question: t('How do I partner with StartNet?', 'StartNet உடன் எப்படிக் கூட்டு சேர்வது?'),
                answer: t(
                  'Start a partner enquiry. One form works for every kind of partner: choose your organisation type and it is routed to the right team, with a reference number and a named owner.',
                  'கூட்டாண்மை விசாரணையைத் தொடங்குங்கள். எல்லா வகைக் கூட்டாளர்களுக்கும் ஒரே படிவம்: உங்கள் நிறுவன வகையைத் தேர்ந்தெடுத்தால், அது குறிப்பு எண்ணுடனும் பெயரிடப்பட்ட பொறுப்பாளருடனும் சரியான குழுவுக்கு அனுப்பப்படும்.'
                ),
              },
              {
                id: 'partner-faq-who',
                question: t('Who can partner with StartNet?', 'StartNet உடன் யார் கூட்டு சேரலாம்?'),
                answer: t(
                  'Universities and colleges, GCCs and corporates, government and districts, sponsors, CSR funders, investors, and incubators and TBIs. Each has its own page with the programmes that fit the outcome it needs.',
                  'பல்கலைக்கழகங்கள், கல்லூரிகள், GCC-கள், பெரு நிறுவனங்கள், அரசு, மாவட்டங்கள், ஸ்பான்சர்கள், CSR நிதியளிப்பாளர்கள், முதலீட்டாளர்கள், இன்குபேட்டர்கள், TBI-கள். ஒவ்வொருவருக்கும் தேவையான விளைவுக்கேற்ற திட்டங்களுடன் தனிப் பக்கம் உண்டு.'
                ),
              },
              {
                id: 'partner-faq-measure',
                question: t('How is a partnership measured?', 'கூட்டாண்மை எப்படி அளவிடப்படுகிறது?'),
                answer: t(
                  "We design programmes around the outcome you're paying for (spinouts, pilots, talent, reach or deal flow) and report against it on the Founder Ledger, with a source and an A, B or C confidence tag on every figure.",
                  'நீங்கள் செலுத்தும் விளைவைச் சுற்றி (spinouts, பைலட்கள், திறமையாளர்கள், சென்றடைதல், முதலீட்டு வாய்ப்புகள்) திட்டங்களை வடிவமைத்து, Founder Ledger-இல் அதற்கு எதிராக அறிக்கையிடுகிறோம்; ஒவ்வொரு எண்ணுக்கும் மூலமும் A, B அல்லது C நம்பகக் குறியும் உண்டு.'
                ),
              },
              {
                id: 'partner-faq-csr',
                question: t('Can CSR funds support StartNet programmes?', 'CSR நிதி StartNet திட்டங்களுக்கு உதவ முடியுமா?'),
                answer: t(
                  'Yes. StartNet runs student-founder, women-founder and district programmes aligned to Schedule VII of the Companies Act, with quarterly outcome reports.',
                  'ஆம். நிறுவனங்கள் சட்டத்தின் அட்டவணை VII-க்கு இணங்கிய மாணவ நிறுவனர், பெண் நிறுவனர், மாவட்டத் திட்டங்களை StartNet காலாண்டு விளைவு அறிக்கைகளுடன் நடத்துகிறது.'
                ),
              },
              {
                id: 'partner-faq-listed',
                question: t('Which partners are listed on the site?', 'தளத்தில் எந்தக் கூட்டாளர்கள் பட்டியலிடப்படுகிறார்கள்?'),
                answer: t(
                  'Only organisations with a signed agreement, each with the date it was signed. We never list partners in the pipeline.',
                  'கையெழுத்திட்ட ஒப்பந்தம் உள்ள நிறுவனங்கள் மட்டுமே, ஒவ்வொன்றும் கையெழுத்திட்ட தேதியுடன். பேச்சுவார்த்தையில் உள்ள கூட்டாளர்களை நாங்கள் ஒருபோதும் பட்டியலிடுவதில்லை.'
                ),
              },
            ]}
          />
        </div>
      </Section>

      <CTABand
        surface="night"
        accentWord="need"
        title={t(
          'Tell us what you need. We reply within two working days.',
          'உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள். இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.'
        )}
        body={
          <>
            {t(
              'Every enquiry gets a reference number and a named owner.',
              'ஒவ்வொரு விசாரணைக்கும் ஒரு குறிப்பு எண்ணும் பெயரிடப்பட்ட பொறுப்பாளரும் உண்டு.'
            )}
          </>
        }
        actions={
          <>
            <Button to="/partner/enquire" size="lg">{enquire}</Button>
            <Button variant="whatsapp" href={waLink(t(WA_TEXT, WA_TEXT_TA), `partner, ${lang}`)} icon={MessageCircle}>
              {t('WhatsApp our partnerships team', 'எங்கள் கூட்டாண்மைக் குழுவுடன் WhatsApp-இல் பேசுங்கள்')}
            </Button>
          </>
        }
      />
    </>
  );
}
