// StartNet X "Built for" audience page — shared T11 template (Book 1 Part B §2.2, §6.2 T11; Book 3 Part B §4 T11).
// Renders inside BrandLayout brand="x". Stack: crumbs → brand hero → problems (orgs) / ladder card (founders) →
// what SNX gives you → modules → how it works → pricing hint (tag C) → proof (the one Night band) → FAQ →
// other audiences → enquiry form panel (orgs) or closing CTA band (founders).
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Fingerprint, CalendarCheck, GraduationCap, Users, Rocket, Landmark, Briefcase, LineChart, Bot,
  Hash, CalendarClock, Clock,
} from 'lucide-react';
import {
  Seo, Breadcrumbs, BrandHero, Section, SectionHeader, Button, Reveal, RevealGroup, Stat, Steps, Ladder, Accordion,
  CTABand, SmartForm, WhatsAppButton, Dot,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink } from '../../../lib/links.js';
import { snxPageLd } from '../../snx/snxSeo.js';
import { fitTitle, fitDescription } from '../../programmes/parts/seoFit.js';
import { AUDIENCES, AUDIENCE_ORDER, MODULES, PRICE_SOURCE, PRICE_NOTE, DEFAULT_ORG_CTA } from './audienceContent.js';
import './SnxAudiencePage.css';
import '../../utility/restKit.css';

const ICONS = { Fingerprint, CalendarCheck, GraduationCap, Users, Rocket, Landmark, Briefcase, LineChart, Bot };

/** "Problems in. Pilots and talent out." → text with the final full stop rendered as the red <Dot />. */
function Headline({ text }) {
  if (typeof text !== 'string' || !text.endsWith('.')) return text;
  return <>{text.slice(0, -1)}<Dot /></>;
}

/** Enquiry deep link: Enquire reads ?type and ?topic; audience/ref/brand carry attribution. */
export function demoPath(a) {
  return `/partner/enquire?topic=snx&type=${a.enquiryType}&audience=${a.id}&brand=x&ref=snx-${a.id}`;
}

export default function SnxAudiencePage({ id }) {
  const { t, lang, localePath } = useLang();
  const a = AUDIENCES[id];
  const tx = (pair) => (Array.isArray(pair) ? t(pair[0], pair[1]) : pair);
  if (!a) return null;

  const isFounders = a.id === 'founders';
  const src = `snx-${a.id}`;
  const signup = snxLink('/signup', { src, brand: 'x', lang });
  const signin = snxLink('/login', { src, brand: 'x', lang });
  const ctaLabel = isFounders ? tx(a.cta.label) : tx(a.ctaLabel || DEFAULT_ORG_CTA);
  const primary = isFounders ? (
    <Button size="lg" href={signup}>{ctaLabel}</Button>
  ) : (
    <Button size="lg" to={demoPath(a)}>{ctaLabel}</Button>
  );

  return (
    <div className={`snx-aud-page snx-aud-page--${a.id}`}>
      {/* WebPage about the StartNet X SoftwareApplication (free Offer for individuals only, per the pricing copy). */}
      <Seo
        title={fitTitle(tx(a.seoTitle), `StartNet X: ${tx(a.navLabel)}`)}
        description={fitDescription(tx(a.seoDescription), [
          isFounders
            ? t('Free for individuals, in Tamil and English.', 'தனிநபர்களுக்கு இலவசம், தமிழிலும் ஆங்கிலத்திலும்.')
            : t('Free for talent. Paid for organisations.', 'திறமையாளர்களுக்கு இலவசம். நிறுவனங்களுக்குக் கட்டணம்.'),
          isFounders ? t('Free for individuals.', 'தனிநபர்களுக்கு இலவசம்.') : t('Request a demo.', 'டெமோ கோருங்கள்.'),
        ])}
        jsonLd={snxPageLd({ path: `/startnet-x/${a.id}`, name: tx(a.seoTitle), description: tx(a.seoDescription), lang })}
      />

      {/* Crumbs sit on the ink band, part of the header + hero (AngelList family). */}
      <div className="snx-aud-page__crumbs-band" data-surface="night">
        <div className="container snx-aud-page__crumbs">
          <Breadcrumbs items={[{ label: 'StartNet X', to: '/startnet-x' }, { label: tx(a.navLabel) }]} />
        </div>
      </div>

      <BrandHero
        brand="x"
        title={tx(a.title)}
        lede={tx(a.lede)}
        actions={
          <>
            {primary}
            {isFounders ? (
              <Button variant="tertiary" size="lg" href={signin}>{t('Sign in', 'உள்நுழைக')}</Button>
            ) : (
              <Button variant="tertiary" size="lg" to="/startnet-x/pricing#organisations">{t('See pricing', 'விலையைப் பாருங்கள்')}</Button>
            )}
          </>
        }
        meta={
          <div className="snx-aud-page__meta">
            <p className="eyebrow snx-aud-page__eyebrow">{tx(a.eyebrow)}</p>
            <p className="snx-aud-page__micro">{tx(a.micro)}</p>
          </div>
        }
        art={{ variant: a.art.variant, brand: 'x', ratio: '4/5', seed: a.art.seed, animate: true, alt: '' }}
      />

      {/* Problems we solve (organisations) or the ladder card (founders) */}
      {isFounders ? (
        <Section surface="white" labelledBy="snx-aud-ladder-title">
          <div className="snx-aud-page__split">
            <SectionHeader
              id="snx-aud-ladder-title"
              eyebrow={t('Your ladder card', 'உங்கள் ஏணி அட்டை')}
              title={<Headline text={t('One profile, seven steps.', 'ஒரே சுயவிவரம், ஏழு படிகள்.')} />}
              lede={t(
                'Your profile starts at L1, and the ladder is explained on the welcome screen. Every programme you finish moves you up, in every StartNet brand.',
                'உங்கள் சுயவிவரம் L1-இல் தொடங்கும்; வரவேற்புத் திரையிலேயே ஏணி விளக்கப்படும். நீங்கள் முடிக்கும் ஒவ்வொரு திட்டமும், எந்த StartNet பிராண்டிலும், உங்களை மேலே நகர்த்தும்.'
              )}
            />
            <Reveal className="snx-aud-page__ladder">
              <Ladder variant="vertical" current="L1" />
            </Reveal>
          </div>
        </Section>
      ) : (
        <Section surface="white" labelledBy="snx-aud-needs-title">
          <div className="snx-aud-page__split">
            <SectionHeader
              id="snx-aud-needs-title"
              eyebrow={t('What you need', 'உங்களுக்குத் தேவையானது')}
              title={t('The problems we solve', 'நாங்கள் தீர்க்கும் பிரச்சினைகள்')}
            />
            <RevealGroup as="ul" className="snx-aud-page__needs">
              {a.needs.map((n) => (
                <li key={n[0]} className="snx-aud-page__need">
                  <Check className="snx-aud-page__need-icon" size={20} strokeWidth={2} aria-hidden="true" />
                  <span>{tx(n)}</span>
                </li>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      {/* What StartNet X gives you — Book 2 §7.2 three blocks */}
      <Section surface="paper" labelledBy="snx-aud-gives-title">
        <SectionHeader
          id="snx-aud-gives-title"
          eyebrow={tx(a.navLabel)}
          title={t('What StartNet X gives you', 'StartNet X உங்களுக்குத் தருவது')}
        />
        <RevealGroup as="ol" className="snx-aud-page__gives">
          {a.gives.map((g, i) => (
            <li key={g.title[0]} className="snx-aud-page__give">
              <span className="snx-aud-page__give-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h4 snx-aud-page__give-title">{tx(g.title)}</h3>
              <p className="snx-aud-page__give-body">{tx(g.body)}</p>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Modules relevant to this audience; status stays a placeholder until confirmed (Book 2 Appendix A #11) */}
      <Section surface="white" labelledBy="snx-aud-modules-title">
        <SectionHeader
          id="snx-aud-modules-title"
          eyebrow={t('Modules', 'தொகுதிகள்')}
          title={t('The modules you will use', 'நீங்கள் பயன்படுத்தும் தொகுதிகள்')}
          lede={t(
            'Each module is labelled Live, In beta or Coming, in step with the build plan. We never show a coming feature as live.',
            'ஒவ்வொரு தொகுதியும் கட்டமைப்புத் திட்டத்துக்கு ஏற்ப Live, In beta அல்லது Coming எனக் குறிக்கப்படும். வரவிருக்கும் அம்சத்தை நேரடியாகச் செயல்படுவதாக ஒருபோதும் காட்டுவதில்லை.'
          )}
          action={<Button variant="tertiary" to="/startnet-x/modules" icon={ArrowRight}>{t('All modules', 'எல்லாத் தொகுதிகளும்')}</Button>}
        />
        <RevealGroup className={`snx-aud-page__modules${a.modules.length === 5 ? ' snx-aud-page__modules--five' : ''}`}>
          {a.modules.map((m) => {
            const mod = MODULES[m.id];
            const Icon = ICONS[mod.icon];
            return (
              <article key={m.id} className="snx-aud-page__module">
                <span className="snx-aud-page__module-icon" aria-hidden="true">{Icon && <Icon size={22} strokeWidth={1.5} />}</span>
                <h3 className="h5 snx-aud-page__module-name">
                  <Link className="snx-aud-page__module-link" to={localePath(`/startnet-x/modules#${m.id}`)}>{mod.name}</Link>
                </h3>
                <p className="snx-aud-page__module-why">{tx(m.why)}</p>
                <p className="snx-aud-page__module-line">{tx(mod.line)}</p>
                <div className="snx-aud-page__module-foot">
                  {/* Module status: not shown until confirmed (no placeholder chip). */}
                  <ArrowRight className="snx-aud-page__module-arrow" size={18} aria-hidden="true" />
                </div>
              </article>
            );
          })}
        </RevealGroup>
      </Section>

      {/* How it works */}
      <Section surface="paper" labelledBy="snx-aud-steps-title">
        <SectionHeader id="snx-aud-steps-title" eyebrow={t('How it works', 'இது எப்படிச் செயல்படுகிறது')} title={t('Three steps', 'மூன்று படிகள்')} />
        <div className="snx-aud-page__steps">
          <Steps steps={a.steps.map((s) => ({ title: tx(s.title), body: tx(s.body) }))} label={t('How it works', 'இது எப்படிச் செயல்படுகிறது')} />
        </div>
      </Section>

      {/* Pricing hint — Book 2 §7.3, indicative, ex-GST, tag C */}
      <Section surface="white" labelledBy="snx-aud-price-title">
        <div className="snx-aud-page__price">
          <div className="snx-aud-page__price-text">
            <p className="eyebrow">{t('Pricing', 'விலை')}</p>
            <h2 id="snx-aud-price-title" className="h2"><Headline text={tx(a.pricing.title)} /></h2>
            {a.pricing.includes && <p className="body-lg snx-aud-page__price-includes">{tx(a.pricing.includes)}</p>}
            <ul className="snx-aud-page__price-notes">
              {a.pricing.notes.map((n) => <li key={n[0]}>{tx(n)}</li>)}
            </ul>
            <Button variant="tertiary" to={a.pricing.link.to} icon={ArrowRight}>{tx(a.pricing.link.label)}</Button>
          </div>
          <div className="snx-aud-page__price-stats">
            {a.pricing.stats.map((s) => (
              <Stat
                key={s.label[0]}
                value={s.value}
                prefix={s.prefix}
                unit={s.unit ? (lang === 'ta' && s.unitTa ? s.unitTa : s.unit) : undefined}
                label={tx(s.label)}
                tag="C"
                source={tx(PRICE_SOURCE)}
                note={tx(PRICE_NOTE)}
                countUp={false}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Proof — the page's one Night band (evidence) */}
      <Section surface="night" labelledBy="snx-aud-proof-title">
        <div className="snx-aud-page__proof">
          <div className="snx-aud-page__proof-head">
            <p className="eyebrow">{t('Proof', 'சான்று')}</p>
            <h2 id="snx-aud-proof-title" className="h2"><Headline text={tx(a.proof.title)} /></h2>
            {a.proof.lede && <p className="body-lg snx-aud-page__proof-lede">{tx(a.proof.lede)}</p>}
          </div>
          <ul className="snx-aud-page__proof-list">
            {a.proof.items.map((p) => (
              <li key={p.title[0]} className="snx-aud-page__proof-item">
                <h3 className="h5">{tx(p.title)}</h3>
                <p className="snx-aud-page__proof-body">{tx(p.body)}</p>
                <div className="snx-aud-page__proof-action">
                  {p.link && <Button variant="tertiary" to={p.link.to} icon={ArrowRight}>{tx(p.link.label)}</Button>}
                  {/* p.placeholder marks proof still to be supplied: not shown as a placeholder chip. */}
                  {p.demo && <Button variant="tertiary" to={demoPath(a)} icon={ArrowRight}>{ctaLabel}</Button>}
                </div>
              </li>
            ))}
          </ul>
          {/* "Institutions using StartNet X: [placeholder]" is hidden until a tenant signs. */}
        </div>
      </Section>

      {/* FAQ — objections from Book 1 Part A §3 */}
      <Section surface="paper" labelledBy="snx-aud-faq-title" className="rk-faq">
        <div className="rk-faq__grid">
          <SectionHeader id="snx-aud-faq-title" eyebrow={t('Questions', 'கேள்விகள்')} title={t('What people ask us', 'எங்களிடம் கேட்கப்படுபவை')} />
          <div className="snx-aud-page__faq">
            <Accordion faq items={a.faq.map((f, i) => ({ id: `${a.id}-faq-${i}`, question: tx(f.q), answer: tx(f.a) }))} />
          </div>
        </div>
      </Section>

      {/* Other audiences — the "Built for" column as an in-page switcher */}
      <Section surface="white" pad="sm" labelledBy="snx-aud-others-title">
        <nav className="snx-aud-page__others" aria-labelledby="snx-aud-others-title">
          <h2 id="snx-aud-others-title" className="h5 snx-aud-page__others-title">{t('StartNet X is built for', 'StartNet X யாருக்காக')}</h2>
          <ul className="snx-aud-page__others-list">
            {AUDIENCE_ORDER.map((k) => {
              const o = AUDIENCES[k];
              const current = k === a.id;
              return (
                <li key={k}>
                  <Link
                    to={localePath(`/startnet-x/${k}`)}
                    className="snx-aud-page__other"
                    aria-current={current ? 'page' : undefined}
                  >
                    {tx(o.menuLabel)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Section>

      {isFounders ? (
        <CTABand
          surface="paper"
          brand="x"
          title={<Headline text={tx(a.closing.title)} />}
          body={tx(a.closing.body)}
          actions={
            <>
              <Button href={signup}>{ctaLabel}</Button>
              <WhatsAppButton text={tx(a.whatsapp)} refCode={src} />
            </>
          }
        />
      ) : (
        <DemoPanel a={a} ctaLabel={ctaLabel} tx={tx} />
      )}
    </div>
  );
}

/** Enquiry form in a 6-column panel (Book 3 T11), pre-routed to the StartNet X demo topic. */
function DemoPanel({ a, ctaLabel, tx }) {
  const { t, lang, localePath } = useLang();
  const fid = (f) => `snx-aud-${a.id}-${f}`;
  const fields = [
    { name: 'organisation', id: fid('organisation'), label: t('Organisation', 'நிறுவனம்'), required: true, autoComplete: 'organization' },
    { name: 'name', id: fid('name'), label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
    { name: 'role', id: fid('role'), label: t('Your role', 'உங்கள் பொறுப்பு'), autoComplete: 'organization-title' },
    { name: 'email', id: fid('email'), label: t('Email', 'மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', hint: t('A work email helps us route your enquiry.', 'பணி மின்னஞ்சல் உங்கள் கோரிக்கையைச் சரியான குழுவுக்கு அனுப்ப உதவும்.') },
    { name: 'phone', id: fid('phone'), label: t('Mobile (optional)', 'கைப்பேசி (விருப்பத்தேர்வு)'), type: 'tel', autoComplete: 'tel-national' },
    { name: 'message', id: fid('message'), label: t('What do you want to run on StartNet X?', 'StartNet X-இல் நீங்கள் எதை நடத்த விரும்புகிறீர்கள்?'), type: 'textarea', required: true },
  ];

  return (
    <Section surface="paper" id="snx-demo" labelledBy="snx-aud-demo-title">
      <div className="snx-aud-page__demo">
        <div className="snx-aud-page__demo-text">
          <p className="eyebrow">{t('StartNet X demo', 'StartNet X டெமோ')}</p>
          <h2 id="snx-aud-demo-title" className="h2"><Headline text={t('Tell us what you want to run.', 'நீங்கள் நடத்த விரும்புவதைச் சொல்லுங்கள்.')} /></h2>
          <ol className="snx-aud-page__next" role="list">
            <li><Hash size={20} aria-hidden="true" /><span>{t('An auto-reply with a reference number and the name of the person who owns your enquiry.', 'குறிப்பு எண்ணுடனும், உங்கள் கோரிக்கைக்குப் பொறுப்பானவரின் பெயருடனும் தானியங்கிப் பதில்.')}</span></li>
            <li><Clock size={20} aria-hidden="true" /><span>{t('A reply within two working days.', 'இரண்டு வேலை நாட்களுக்குள் பதில்.')}</span></li>
            <li><CalendarClock size={20} aria-hidden="true" /><span>{t('A demo on clearly marked sample data, then a quote from the published tiers.', 'தெளிவாகக் குறிக்கப்பட்ட மாதிரித் தரவில் டெமோ; பிறகு வெளியிடப்பட்ட நிலைகளின்படி விலைப்புள்ளி.')}</span></li>
          </ol>
          <p className="snx-aud-page__demo-alt">
            {t('Prefer the full partner form?', 'முழுமையான கூட்டாளர் படிவம் வேண்டுமா?')}{' '}
            <Link to={localePath(demoPath(a))}>{t('Start an enquiry', 'கோரிக்கையைத் தொடங்குங்கள்')}</Link>
          </p>
          <p className="snx-aud-page__demo-alt">
            {t('Want StartNet to run programmes with you, not only the platform?', 'தளம் மட்டுமல்ல, StartNet உங்களுடன் திட்டங்களையும் நடத்த வேண்டுமா?')}{' '}
            <Link to={localePath(a.partnerPage)}>{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</Link>
          </p>
        </div>
        <div className="snx-aud-page__demo-form">
          <SmartForm
            type="enquiry"
            fields={fields}
            consents={[{ purpose: 'partner', label: t('StartNet may use these details to reply to this enquiry.', 'இந்தக் கோரிக்கைக்குப் பதிலளிக்க StartNet இந்த விவரங்களைப் பயன்படுத்தலாம்.'), required: true }]}
            submitLabel={ctaLabel}
            successTitle={t("Thanks. We've received your message.", 'நன்றி. உங்கள் செய்தி எங்களுக்குக் கிடைத்தது.')}
            successBody={t(
              "You'll get a reference number and the name of the person who owns your enquiry.",
              'குறிப்பு எண்ணும், உங்கள் கோரிக்கைக்குப் பொறுப்பானவரின் பெயரும் உங்களுக்குக் கிடைக்கும்.'
            )}
            hidden={{
              source: `snx-${a.id}`,
              lang,
              brand: 'x',
              partnerType: a.enquiryType,
              topic: 'snx',
              interest: a.menuLabel[0], // routing value stays English
              audience: a.id,
              ref: `snx-${a.id}`,
            }}
          />
        </div>
      </div>
    </Section>
  );
}
