// /women/summit/awards — Women Founders Awards, part of the Women Founders Summit & Awards (Book 1 Part B §2.2: T04, P2;
// sub-nav CTA "Nominate for the Awards", §4). Copy: Book 2 §3.4 (Summit & Awards: independent jury [placeholder — jury],
// TN Women Founders Report, date and venue [placeholder]); "Who it's for" groups used as PROPOSED categories; criteria
// restate Book 2 §3.4 counting rules and the evidence standard. Nothing here names a juror, partner, winner or date.
// Renders inside BrandLayout brand="women".
import { ArrowRight } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, SectionHeader, Button, Badge, Stat, CTABand, Accordion, Reveal, RevealGroup,
  SmartForm, Dot, InlineMarks,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink } from '../../../lib/links.js';
import { AWARD_CATEGORIES, AWARD_CRITERIA, AWARD_TIMELINE } from './brandSubData.js';
import { TN_DISTRICTS } from './districts.js';
import { useTp } from './BrandSubParts.jsx';
import { isPlaceholderText } from '../../../components/_placeholders.js';
import '../../brands/brandPage.css';
import './BrandSubParts.css';
import './WomenAwards.css';
import { pageLd } from '../../brands/seoBits.js';


// Same record as /api/metrics?key=tn-women-led-startups; used until the API answers.
const WOMEN_LED_FALLBACK = {
  id: 'tn-women-led-startups',
  value: 7572,
  label: 'of 15,037 DPIIT-recognised startups in Tamil Nadu are women-led',
  tag: 'A',
  asAt: '2026-07-01',
  source: 'DPIIT data via DT Next, July 2026',
  note: 'DPIIT counts a startup as women-led if it has at least one woman director. StartNet also reports "women-owned" as 51%+ equity held by women.',
};

export default function WomenAwards() {
  const { t, lang } = useLang();
  const tp = useTp();
  const metrics = useApi('/api/metrics?key=tn-women-led-startups');
  const metric = (Array.isArray(metrics.data) && metrics.data.find((m) => m && m.key === 'tn-women-led-startups')) || WOMEN_LED_FALLBACK;
  const summitApi = useApi('/api/events?brand=women&series=women-founders-summit');
  const summit = Array.isArray(summitApi.data) ? summitApi.data.find((e) => e && e.status !== 'past') : null;
  const summitWhen = summit?.dateLabel || summit?.date || null;

  const registerHref = snxLink('/signup', { src: 'women-awards', brand: 'women', lang, persona: 'woman-founder', intent: 'summit' });

  return (
    <div className="women-awards">
      <Seo
        // SEO: primary "women founders awards Tamil Nadu". SEO-TA: pending native review
        title={t('Women Founders Awards: nominate a founder', 'Women Founders Awards: பரிந்துரையுங்கள்')}
        jsonLd={pageLd({
          path: '/women/summit/awards',
          lang,
          name: 'Women Founders Awards',
          description: t(
            'Nominate a woman founder in Tamil Nadu. Awards are decided by an independent jury and presented at the Women Founders Summit.',
            'தமிழ்நாட்டில் ஒரு பெண் நிறுவனரைப் பரிந்துரையுங்கள். விருதுகளைச் சுயாதீன நடுவர் குழு முடிவு செய்து, Women Founders Summit-இல் வழங்கும்.'
          ),
        })}
        description={t(
          'Nominate a woman founder in Tamil Nadu. Awards are decided by an independent jury and presented at the Women Founders Summit.',
          'தமிழ்நாட்டில் ஒரு பெண் நிறுவனரைப் பரிந்துரையுங்கள். விருதுகளைச் சுயாதீன நடுவர் குழு முடிவு செய்து, Women Founders Summit-இல் வழங்கும்.'
        )}
      />

      <div className="bp-crumbs" data-surface="night">
        <div className="container bsub-crumbs">
          <Breadcrumbs
            items={[
              { label: 'StartNet Women', to: '/women' },
              { label: t('Summit & Awards', 'மாநாடு & விருதுகள்'), to: '/women/summit' },
              { label: t('Awards', 'விருதுகள்') },
            ]}
          />
        </div>
      </div>

      <BrandHero
        brand="women"
        compact
        title={t('Women Founders Awards.', 'Women Founders Awards.')}
        endorsement={t('at the Women Founders Summit', 'Women Founders Summit-இல்')}
        lede={t(
          'Women founders recognised by an independent jury, at the annual StartNet Women flagship where the TN Women Founders Report is launched.',
          'சுயாதீன நடுவர் குழுவால் அங்கீகரிக்கப்படும் பெண் நிறுவனர்கள், TN Women Founders Report வெளியிடப்படும் StartNet Women-இன் ஆண்டு முதன்மை நிகழ்வில்.'
        )}
        art={{ variant: 'dot', seed: 8, brand: 'women', ratio: '4/5', alt: '' }}
        meta={
          <div className="cluster women-awards__hero-meta">
            <Badge kind="status" status="upcoming">{t('Nominations: dates soon', 'பரிந்துரைகள்: தேதிகள் விரைவில்')}</Badge>
            {summitWhen && (
              <Badge kind="type"><span lang={lang === 'ta' ? 'en' : undefined}><InlineMarks text={summitWhen} /></span></Badge>
            )}
          </div>
        }
        actions={
          <>
            <Button variant="brand" href="#nominate">{t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}</Button>
            <Button variant="secondary" href={registerHref}>{t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்')}</Button>
          </>
        }
      />

      {/* Why: the context figure (tag A) and the counting rule */}
      <Section surface="paper" labelledBy="awards-why-title">
        <div className="women-awards__why">
          <Reveal className="women-awards__why-text">
            <p className="eyebrow">{t('Why these awards', 'ஏன் இந்த விருதுகள்')}</p>
            <h2 id="awards-why-title" className="h2">
              {t('A day for the founders, and the numbers behind them', 'நிறுவனர்களுக்கான ஒரு நாள், அவர்களுக்குப் பின்னால் உள்ள எண்களுக்கும்')}<Dot />
            </h2>
            <p className="body-lg text-2">
              {t(
                'Half of Tamil Nadu’s startups are women-led. The awards put founders on stage and the evidence beside them: every outcome a finalist claims carries a source or a confidence tag.',
                'தமிழ்நாட்டின் ஸ்டார்ட்அப்களில் பாதி பெண்கள் தலைமையிலானவை. விருதுகள் நிறுவனர்களை மேடையில் நிறுத்துகின்றன, அவர்களின் சான்றுகளையும் அருகில் வைக்கின்றன: இறுதிப் பட்டியலாளர் கூறும் ஒவ்வொரு விளைவுக்கும் ஆதாரம் அல்லது நம்பக அடையாளம் உண்டு.'
              )}
            </p>
            <Button variant="tertiary" to="/about/evidence-standard" icon={ArrowRight}>{t('Our evidence standard', 'எங்கள் சான்றுத் தரம்')}</Button>
          </Reveal>
          <div className="women-awards__why-stat">
            <Stat
              metric={metric}
              variant="hero"
              label={t(metric.label, 'தமிழ்நாட்டில் DPIIT அங்கீகாரம் பெற்ற 15,037 ஸ்டார்ட்அப்களில் பெண்கள் தலைமையிலானவை')}
              note={t(
                metric.note,
                'குறைந்தது ஒரு பெண் இயக்குநர் இருந்தால் DPIIT அதைப் பெண்கள் தலைமையிலான ஸ்டார்ட்அப் எனக் கணக்கிடுகிறது. 51%-க்கு மேற்பட்ட பங்குகள் பெண்களிடம் இருந்தால் StartNet அதைப் "பெண்களுக்குச் சொந்தமானது" எனத் தெரிவிக்கிறது.'
              )}
            />
          </div>
        </div>
      </Section>

      {/* Categories (proposed) */}
      <Section surface="white" labelledBy="awards-cat-title">
        <SectionHeader
          id="awards-cat-title"
          eyebrow={t('Categories · proposed', 'பிரிவுகள் · முன்மொழிவு')}
          title={t('Three routes to founding, three categories.', 'நிறுவனராகும் மூன்று வழிகள், மூன்று பிரிவுகள்.')}
          lede={t(
            'Proposed from the three groups StartNet Women serves. The final categories are confirmed with the jury before nominations open.',
            'StartNet Women சேவை செய்யும் மூன்று குழுக்களிலிருந்து முன்மொழியப்பட்டவை. பரிந்துரைகள் தொடங்கும் முன் இறுதிப் பிரிவுகள் நடுவர் குழுவுடன் உறுதி செய்யப்படும்.'
          )}
        />
        <RevealGroup as="ul" className="women-awards__cats" role="list">
          {AWARD_CATEGORIES.map((c, i) => (
            <li key={c.value} className="women-awards__cat">
              <span className="women-awards__cat-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h4">{tp(c.label)}</h3>
              <p className="text-2">{tp(c.body)}</p>
              <Badge kind="status" status="upcoming">{t('Proposed', 'முன்மொழிவு')}</Badge>
            </li>
          ))}
        </RevealGroup>
        {/* "Final categories: [placeholder]" hidden until StartNet and the jury confirm them. */}
      </Section>

      {/* Criteria + jury */}
      <Section surface="paper" labelledBy="awards-criteria-title">
        <div className="split women-awards__split">
          <div>
            <SectionHeader
              id="awards-criteria-title"
              eyebrow={t('Criteria · proposed', 'அளவுகோல்கள் · முன்மொழிவு')}
              title={t('What the jury looks for.', 'நடுவர் குழு எதைப் பார்க்கும்.')}
            />
            <ol className="women-awards__criteria">
              {AWARD_CRITERIA.map((c) => (
                <li key={c.title[0]} className="women-awards__criterion">
                  <h3 className="h5">{tp(c.title)}</h3>
                  <p className="text-2">{tp(c.body)}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside className="women-awards__jury" aria-labelledby="awards-jury-title">
            <p className="eyebrow">{t('Independent jury', 'சுயாதீன நடுவர் குழு')}</p>
            <h2 id="awards-jury-title" className="h3">{t('Decided by an independent jury', 'சுயாதீன நடுவர் குழுவின் முடிவு')}<Dot /></h2>
            <p className="text-2">
              {t(
                'Awards are decided by an independent jury. Jury members are named here once confirmed, with their consent.',
                'விருதுகளைச் சுயாதீன நடுவர் குழு முடிவு செய்யும். நடுவர் குழு உறுப்பினர்கள் உறுதியானதும், அவர்களின் ஒப்புதலுடன் இங்கே பெயரிடப்படுவார்கள்.'
              )}
            </p>
            {/* Jury members and the jury charter are hidden until supplied (named with consent). */}
          </aside>
        </div>
      </Section>

      {/* Timeline (all dates placeholders) */}
      <Section surface="white" labelledBy="awards-timeline-title">
        <SectionHeader
          id="awards-timeline-title"
          eyebrow={t('Timeline', 'காலவரிசை')}
          title={t('From nomination to the Summit stage.', 'பரிந்துரையிலிருந்து மாநாட்டு மேடை வரை.')}
        />
        <div className="women-awards__timeline-wrap">
          <ol className="women-awards__timeline">
            {AWARD_TIMELINE.map((s, i) => (
              <li key={s.id} className="women-awards__step">
                <span className="women-awards__step-dot" aria-hidden="true">{i + 1}</span>
                <div className="women-awards__step-body">
                  <h3 className="h5">{tp(s.title)}</h3>
                  {/* Steps without a confirmed date show no date line (rather than "[date placeholder]"). */}
                  {s.id === 'summit' && summitWhen && !isPlaceholderText(summitWhen) && (
                    <p className="small">
                      <span lang={lang === 'ta' ? 'en' : undefined}><InlineMarks text={summitWhen} /></span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Nominate (SmartForm type "nomination") */}
      <Section surface="paper" id="nominate" labelledBy="awards-nominate-title">
        <div className="women-awards__form-grid">
          <Reveal className="women-awards__form-intro">
            <p className="eyebrow">{t('Nominate', 'பரிந்துரை')}</p>
            <h2 id="awards-nominate-title" className="h2">{t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}<Dot /></h2>
            <p className="body-lg text-2">
              {t(
                'Tell us who she is, what she has built and the outcomes you can point to. The independent jury reviews every nomination.',
                'அவர் யார், என்ன உருவாக்கியிருக்கிறார், நீங்கள் சுட்டிக்காட்டக்கூடிய விளைவுகள் என்ன என்று சொல்லுங்கள். ஒவ்வொரு பரிந்துரையையும் சுயாதீன நடுவர் குழு மதிப்பாய்வு செய்யும்.'
              )}
            </p>
            <p className="small muted">
              {t(
                'If you are nominating someone else, please let her know first.',
                'வேறொருவரைப் பரிந்துரைத்தால், முதலில் அவருக்குத் தெரியப்படுத்துங்கள்.'
              )}
            </p>
          </Reveal>
          <div className="women-awards__form form-card">
            <SmartForm
              type="nomination"
              fields={[
                { id: 'wa-name', name: 'name', label: t('Your name', 'உங்கள் பெயர்'), type: 'text', required: true, autoComplete: 'name' },
                { id: 'wa-email', name: 'email', label: t('Your email', 'உங்கள் மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email', width: 'half' },
                { id: 'wa-phone', name: 'phone', label: t('Mobile (optional)', 'கைபேசி (விருப்பத்தேர்வு)'), type: 'tel', autoComplete: 'tel-national', hint: t('Only to confirm your nomination.', 'உங்கள் பரிந்துரையை உறுதிப்படுத்த மட்டும்.'), width: 'half' },
                { id: 'wa-nominee', name: 'nomineeName', label: t("Founder's name", 'நிறுவனரின் பெயர்'), type: 'text', required: true, width: 'half' },
                { id: 'wa-company', name: 'nomineeCompany', label: t('Her company', 'அவரது நிறுவனம்'), type: 'text', required: true, width: 'half' },
                {
                  id: 'wa-category', name: 'category', label: t('Category', 'பிரிவு'), type: 'select', required: true, width: 'half',
                  options: [
                    { value: '', label: t('Choose a category', 'ஒரு பிரிவைத் தேர்ந்தெடுக்கவும்') },
                    ...AWARD_CATEGORIES.map((c) => ({ value: c.value, label: tp(c.label) })),
                    { value: 'not-sure', label: t('Not sure: let the jury decide', 'தெரியவில்லை: நடுவர் குழு முடிவு செய்யட்டும்') },
                  ],
                },
                {
                  id: 'wa-district', name: 'district', label: t('District', 'மாவட்டம்'), type: 'select', required: true, width: 'half',
                  options: [
                    { value: '', label: t('Choose a district', 'ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்') },
                    ...TN_DISTRICTS.map((d) => ({ value: d.en, label: lang === 'ta' ? d.ta : d.en })),
                  ],
                },
                {
                  id: 'wa-message', name: 'message', label: t('Why this founder?', 'ஏன் இந்த நிறுவனர்?'), type: 'textarea', required: true,
                  hint: t('What she has built, and the outcomes you can point to.', 'அவர் உருவாக்கியது என்ன, நீங்கள் சுட்டிக்காட்டக்கூடிய விளைவுகள் என்ன.'),
                },
                { id: 'wa-aware', name: 'nomineeAware', label: t('The founder knows about this nomination.', 'இந்தப் பரிந்துரை பற்றி நிறுவனருக்குத் தெரியும்.'), type: 'checkbox' },
              ]}
              consents={[{ purpose: 'contact', label: t('StartNet may contact me about this nomination.', 'இந்தப் பரிந்துரை குறித்து StartNet என்னைத் தொடர்பு கொள்ளலாம்.'), required: true }]}
              submitLabel={t('Nominate a founder', 'ஒரு நிறுவனரைப் பரிந்துரையுங்கள்')}
              successTitle={t('Nomination received.', 'பரிந்துரை கிடைத்தது.')}
              successBody={t('Thank you. The independent jury reviews every nomination.', 'நன்றி. ஒவ்வொரு பரிந்துரையையும் சுயாதீன நடுவர் குழு மதிப்பாய்வு செய்யும்.')}
              hidden={{ brand: 'women', programme: 'women-founders-awards', src: 'women-summit-awards' }}
            />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section surface="white" className="bp-faq" labelledBy="awards-faq-title">
        <SectionHeader id="awards-faq-title" eyebrow={t('Questions', 'கேள்விகள்')} title={t('Before you nominate.', 'பரிந்துரைக்கும் முன்.')} />
        <Accordion
          faq
          items={[
            {
              id: 'who-decides',
              question: t('Who decides the awards?', 'விருதுகளை யார் முடிவு செய்வார்கள்?'),
              answer: t('An independent jury. Jury members are named on this page once confirmed, with their consent.', 'ஒரு சுயாதீன நடுவர் குழு. நடுவர் குழு உறுப்பினர்கள் உறுதியானதும், அவர்களின் ஒப்புதலுடன் இந்தப் பக்கத்தில் பெயரிடப்படுவார்கள்.'),
            },
            {
              id: 'women-led',
              question: t('How do you define a women-led startup?', 'பெண்கள் தலைமையிலான ஸ்டார்ட்அப் என்பதை எப்படி வரையறுக்கிறீர்கள்?'),
              answer: t(
                'DPIIT counts a startup as women-led if it has at least one woman director. We also report "women-owned" as 51%+ equity held by women, alongside the DPIIT definition.',
                'குறைந்தது ஒரு பெண் இயக்குநர் இருந்தால் DPIIT அதைப் பெண்கள் தலைமையிலானது எனக் கணக்கிடுகிறது. DPIIT வரையறையுடன், 51%-க்கு மேற்பட்ட பங்குகள் பெண்களிடம் இருந்தால் "பெண்களுக்குச் சொந்தமானது" என்றும் நாங்கள் தெரிவிக்கிறோம்.'
              ),
            },
            {
              id: 'after',
              question: t('What happens after I nominate?', 'பரிந்துரைத்த பிறகு என்ன நடக்கும்?'),
              answer: (
                <>
                  {/* The "Dates: [placeholder]" clause is left out until the dates are supplied. */}
                  {t(
                    'We confirm by email. The jury reviews every nomination, and finalists are told before the Summit.',
                    'மின்னஞ்சலில் உறுதிப்படுத்துவோம். ஒவ்வொரு பரிந்துரையையும் நடுவர் குழு மதிப்பாய்வு செய்யும்; மாநாட்டுக்கு முன் இறுதிப் பட்டியலாளர்களுக்குத் தெரிவிக்கப்படும்.'
                  )}
                </>
              ),
            },
            {
              id: 'report',
              question: t('What is the TN Women Founders Report?', 'TN Women Founders Report என்றால் என்ன?'),
              answer: t(
                'A report launched at the Women Founders Summit each year. It will appear under Insights → Reports when published.',
                'ஒவ்வோர் ஆண்டும் Women Founders Summit-இல் வெளியிடப்படும் அறிக்கை. வெளியானதும் நுண்ணறிவுகள் → அறிக்கைகள் பகுதியில் இடம்பெறும்.'
              ),
            },
          ]}
        />
      </Section>

      {/* The one Night band */}
      <CTABand
        surface="paper"
        className="brand-close"
        brand="women"
        title={t('Sponsor the Summit.', 'மாநாட்டுக்கு ஆதரவளியுங்கள்.')}
        body={t(
          'The annual StartNet Women flagship, where the TN Women Founders Report is launched and women founders are recognised.',
          'TN Women Founders Report வெளியிடப்பட்டு, பெண் நிறுவனர்கள் அங்கீகரிக்கப்படும் StartNet Women-இன் ஆண்டு முதன்மை நிகழ்வு.'
        )}
        actions={
          <>
            <Button variant="brand" to="/partner/sponsors">{t('Sponsor the Summit', 'மாநாட்டுக்கு ஆதரவளியுங்கள்')}</Button>
            <Button variant="tertiary" to="/women/summit" icon={ArrowRight}>{t('About the Summit', 'மாநாடு பற்றி')}</Button>
          </>
        }
      />
    </div>
  );
}
