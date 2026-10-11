// StartNet X Trust & privacy (T19). Copy: Book 2 §7.1 trust strip and §2.6 sections 3–4 (AI guardrails, your data).
import { ArrowRight, ShieldCheck, Bot } from 'lucide-react';
import { Seo, BrandHero, Section, SectionHeader, Button, RevealGroup, Reveal, CTABand } from '../../components';
import { snxPageLd } from './snxSeo.js';
import { useSnxT } from './snxTamil.js';
import { snxLink } from '../../lib/links.js';
import { YOUR_DATA, DATA_RIGHTS, AI_GUARDRAILS, AI_GUARDRAILS_INTRO } from './snxContent.js';
import { SNX_ICONS } from './snxIcons.js';
import './Trust.css';

export default function Trust() {
  const { t, tx, lang } = useSnxT();
  return (
    <>
      <Seo
        jsonLd={snxPageLd({ path: '/startnet-x/trust', lang })}
        // SEO-TA: pending native review
        title={t('StartNet X trust: data in India, DPDP Act privacy', 'StartNet X நம்பிக்கை: இந்தியாவில் தரவு, DPDP தனியுரிமை')}
        description={t(
          'Your data stays in India. You choose who sees your profile. No automated rejections, ever. How StartNet X follows the DPDP Act, 2023.',
          'உங்கள் தரவு இந்தியாவிலேயே. உங்கள் சுயவிவரத்தை யார் பார்க்கலாம் என்பதை நீங்களே முடிவு செய்கிறீர்கள். தானியங்கி நிராகரிப்பு இல்லை. DPDP சட்டம், 2023.'
        )}
      />
      <BrandHero
        brand="x"
        compact
        title={tx('Your data stays in India.')}
        lede={tx('You choose who sees your profile. No automated rejections, ever.')}
        actions={
          <>
            <Button to="/legal/privacy">{t('Read our privacy notice', 'எங்கள் தனியுரிமை அறிவிப்பைப் படியுங்கள்')}</Button>
            <Button variant="tertiary" href="#rights">{t('Your data rights', 'உங்கள் தரவு உரிமைகள்')}</Button>
          </>
        }
        meta={
          <p className="snx-trust-page__meta">
            <ShieldCheck size={16} aria-hidden="true" />{' '}
            {t('Digital Personal Data Protection Act, 2023', 'டிஜிட்டல் தனிநபர் தரவுப் பாதுகாப்புச் சட்டம், 2023')}
          </p>
        }
      />

      {/* Your data */}
      <Section surface="paper">
        <SectionHeader
          eyebrow={t('Your data', 'உங்கள் தரவு')}
          title={t('How StartNet X handles your data', 'StartNet X உங்கள் தரவை எப்படிக் கையாளுகிறது')}
        />
        <RevealGroup className="snx-trust-page__grid">
          {YOUR_DATA.map((d) => {
            const Icon = SNX_ICONS[d.icon];
            return (
              <article key={d.title} className="snx-trust-card">
                <span className="snx-trust-card__icon" aria-hidden="true">{Icon && <Icon size={24} strokeWidth={1.5} />}</span>
                <h3 className="h5">{tx(d.title)}</h3>
                <p className="text-2">{tx(d.body)}</p>
              </article>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Data rights */}
      <Section surface="white" id="rights">
        <div className="snx-rights">
          <div className="snx-rights__intro">
            <p className="eyebrow">{t('Your data rights', 'உங்கள் தரவு உரிமைகள்')}</p>
            <h2 className="h2">{t('Access, correct, erase, withdraw', 'பார்க்க, திருத்த, அழிக்க, திரும்பப் பெற')}<span className="dot">.</span></h2>
            <p className="body-lg text-2">
              {t(
                'You can access, correct or erase your data, and withdraw consent at any time.',
                'உங்கள் தரவைப் பார்க்கலாம், திருத்தலாம், அழிக்கலாம்; எப்போது வேண்டுமானாலும் ஒப்புதலைத் திரும்பப் பெறலாம்.'
              )}
            </p>
            <div className="cluster">
              <Button to="/legal/data-rights" icon={ArrowRight}>{t('Use your data rights', 'உங்கள் தரவு உரிமைகளைப் பயன்படுத்துங்கள்')}</Button>
              <Button variant="tertiary" to="/legal/privacy" icon={ArrowRight}>{t('Read our privacy notice', 'எங்கள் தனியுரிமை அறிவிப்பைப் படியுங்கள்')}</Button>
            </div>
          </div>
          <ol className="snx-rights__list">
            {DATA_RIGHTS.map((r, i) => (
              <Reveal as="li" key={r} delay={i * 0.04} className="snx-rights__item">
                <span className="snx-rights__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="snx-rights__label">{tx(r)}</span>
              </Reveal>
            ))}
          </ol>
        </div>
        {/* "Grievance officer": hidden until the officer's name, email and postal address are supplied. */}
      </Section>

      {/* AI guardrails — the page's one Night band */}
      <Section surface="night" id="ai-guardrails">
        <div className="snx-guard">
          <div className="snx-guard__intro">
            <span className="snx-guard__icon" aria-hidden="true"><Bot size={20} strokeWidth={1.5} /></span>
            <p className="eyebrow">{t('AI guardrails', 'AI பாதுகாப்பு வரம்புகள்')}</p>
            <h2 className="h2">{t('People make the decisions', 'முடிவுகளை எடுப்பது மனிதர்களே')}<span className="dot">.</span></h2>
            <p className="body-lg snx-guard__lede">{tx(AI_GUARDRAILS_INTRO)}</p>
          </div>
          <RevealGroup as="ul" className="snx-guard__list">
            {AI_GUARDRAILS.map((g) => {
              const [head, ...rest] = tx(g).split('. ');
              return (
                <li key={g} className="snx-guard__item">
                  <strong>{head}{rest.length ? '.' : ''}</strong>
                  {rest.length > 0 && <span> {rest.join('. ')}</span>}
                </li>
              );
            })}
          </RevealGroup>
        </div>
      </Section>

      {/* Governance links */}
      <Section surface="paper" pad="sm">
        <div className="snx-trust-links">
          <div>
            <h2 className="h4">{t('The rules behind every number', 'ஒவ்வொரு எண்ணுக்கும் பின்னால் உள்ள விதிகள்')}</h2>
            <p className="text-2">
              {t(
                'Every figure shows its source and as-at date, or an A/B/C tag. Errors go in the public corrections log.',
                'ஒவ்வொரு எண்ணும் அதன் ஆதாரத்தையும் தேதியையும், அல்லது A/B/C குறிச்சொல்லையும் காட்டும். பிழைகள் பொதுத் திருத்தப் பதிவேட்டில் சேர்க்கப்படும்.'
              )}
            </p>
          </div>
          <div className="snx-trust-links__actions">
            <Button variant="secondary" to="/about/governance">{t('How we keep ourselves honest', 'நாங்கள் எப்படி நேர்மையாக இருக்கிறோம்')}</Button>
            <Button variant="tertiary" to="/about/evidence-standard" icon={ArrowRight}>{t('Evidence standard', 'ஆதாரத் தரநிலை')}</Button>
          </div>
        </div>
      </Section>

      <CTABand
        surface="paper"
        title={tx('One profile, from first event to first funding.')}
        body={tx('Free for individuals. Works on your phone, on WhatsApp and in Tamil.')}
        actions={
          <Button href={snxLink('/signup', { src: 'snx-trust', brand: 'x', lang })}>{t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}</Button>
        }
      />
    </>
  );
}
