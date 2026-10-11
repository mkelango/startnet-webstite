import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Clock, MessageCircle } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Steps, Button, Reveal, RevealGroup, Stat, Dot, InlineMarks,
} from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import { webPageLd, langPath } from '../../lib/seo.js';
import { fitTitle, fitDescription } from '../programmes/parts/seoFit.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { TALENT_BRANDS } from '../../data/brands.js';
import NotFound from '../utility/LazyNotFound.jsx';
import {
  PARTNER_TYPES, ALL_TYPES, ROUTING, SLA_LINE, SLA_LINE_TA,
  WA_TEXT, WA_TEXT_TA, PROOF_TA, BRAND_PROMISE_TA, enquirePath, getPartnerType, localiseSteps, tf,
} from './partnerData.js';
import { LedgerProof, SignedPartners, ProofNeeded } from './PartnerProof.jsx';
import { hasMark } from '../../components/_placeholders.js';
import EnquiryForm from './EnquiryForm.jsx';
import './Partner.css';

const ART = {
  institutions: 'grid', gccs: 'network', government: 'map', sponsors: 'dot', csr: 'kolam',
  investors: 'ladder', incubators: 'network', 'district-programme': 'map',
};
const ROUTE_INDEX = { institution: 0, gcc: 1, government: 2, sponsor: 3, csr: 4, investor: 5, incubator: 6 };
// SEO titles [English, Tamil draft] per partner type (Book 1 §9.2-style intents: CSR, GCC, college, sponsor).
const PARTNER_SEO_TITLE = {
  institutions: ['College incubation partnership in Tamil Nadu', 'கல்லூரிகளுடன் StartNet கூட்டாண்மை'],
  gccs: ['GCC innovation partnership: pilots and talent', 'GCC-களுடன் StartNet: பைலட்கள், திறமையாளர்கள்'],
  government: ['District startup programmes for government', 'அரசு, மாவட்டங்களுடன் StartNet கூட்டாண்மை'],
  sponsors: ['Sponsor StartNet programmes and events in Tamil Nadu', 'StartNet திட்டங்கள், நிகழ்வுகளுக்கு ஸ்பான்சர் செய்யுங்கள்'],
  csr: ['CSR partnership for startups in Tamil Nadu', 'ஸ்டார்ட்அப்களுக்கான CSR கூட்டாண்மை (அட்டவணை VII)'],
  investors: ['Startup deal flow in Tamil Nadu for investors', 'முதலீட்டாளர்களுக்கு: StartNet நிறுவனர் வாய்ப்புகள்'],
  incubators: ['Incubator and TBI partnership with StartNet', 'இன்குபேட்டர்கள், TBI-களுடன் StartNet கூட்டாண்மை'],
  'district-programme': ['District Ecosystem Programme for Tamil Nadu', 'District Ecosystem Programme: மாவட்டத் திட்டம்'],
};

const TIER_SOURCE = ['StartNet X organisation tiers, indicative, ex-GST', 'StartNet X நிறுவன அடுக்குகள், தோராயமானவை, GST நீங்கலாக'];

// /partner/:type — T11 partner-type template (district-programme follows T03 with the same grammar).
export default function PartnerType() {
  const { type } = useParams();
  // Own-key lookup: /partner/constructor, /partner/valueOf etc. are 404s, not crashes (F-86).
  const page = getPartnerType(type);
  if (!page) return <NotFound />;
  return <PartnerTypePage key={type} page={page} />;
}

function PartnerTypePage({ page }) {
  const { t, localePath, lang } = useLang();
  const reduced = useReducedMotion();
  const [topic, setTopic] = useState(page.ctas.find((c) => c.enquire)?.topic || '');
  const route = ROUTING[ROUTE_INDEX[page.enquiryType]];
  const f = (obj, key) => tf(t, obj, key);
  const report = lang === 'ta' && page.reportTa ? page.reportTa : page.report;

  const goToForm = (nextTopic) => (e) => {
    e.preventDefault();
    if (nextTopic !== undefined) setTopic(nextTopic || '');
    const el = document.getElementById('enquire');
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => el.querySelector('input, select, textarea')?.focus({ preventScroll: true }), reduced ? 0 : 450);
  };

  // AIWO 1.5: one filled button per hero; any further action is an arrow link (the ring style is kept for CTA bands).
  const heroVariant = (c, i) => (i === 0 ? c.variant || 'primary' : 'tertiary');
  const ctaButtons = (size = 'lg') =>
    page.ctas.map((c, i) =>
      c.enquire ? (
        <Button key={c.label} href="#enquire" onClick={goToForm(c.topic)} size={size} variant={heroVariant(c, i)}>
          {f(c, 'label')}
        </Button>
      ) : (
        <Button key={c.label} to={c.to} size={size} variant={heroVariant(c, i)}>
          {f(c, 'label')}
        </Button>
      )
    );

  const others = ALL_TYPES.filter((k) => k !== page.slug).map((k) => PARTNER_TYPES[k]);
  const slaLine = t(SLA_LINE, SLA_LINE_TA);
  // The "[SLA to be confirmed]" / "[confirm]" notes are editorial marks and are not shown next to the SLA.

  return (
    <>
      {/* SEO: keyword-first titles (CSR / GCC / college / sponsor intents); descriptions are the page's own copy fitted
          to 120–155 chars. SEO-TA: pending native review. */}
      <Seo
        title={fitTitle(PARTNER_SEO_TITLE[page.slug] ? t(...PARTNER_SEO_TITLE[page.slug]) : null, f(page, 'seoTitle'))}
        description={fitDescription(f(page, 'description'), [
          t('Start a partner enquiry; it goes to a named owner.', 'கூட்டாண்மை விசாரணையைத் தொடங்குங்கள்; பெயரிடப்பட்ட பொறுப்பாளருக்குச் செல்லும்.'),
          t('Start a partner enquiry.', 'விசாரணையைத் தொடங்குங்கள்.'),
        ])}
        jsonLd={webPageLd({ path: langPath(`/partner/${page.slug}`, lang), lang, name: f(page, 'seoTitle'), description: f(page, 'description') })}
      />

      <PageHero
        eyebrow={f(page, 'eyebrow')}
        title={f(page, 'title')}
        lede={f(page, 'lede')}
        breadcrumbs={[{ label: t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்'), to: '/partner' }, { label: f(page, 'menuLabel') }]}
        actions={<>{ctaButtons('lg')}</>}
        art={{ variant: ART[page.slug] || 'network', ratio: '4/5', seed: page.slug.length * 7, alt: '' }}
        meta={
          <p className="partner-hero-sla">
            <Clock aria-hidden="true" size={16} /> {slaLine}
          </p>
        }
      />

      {/* Offers */}
      <Section surface="white">
        <SectionHeader eyebrow={t('What we offer', 'நாங்கள் வழங்குவது')} title={f(page, 'offersTitle')} as="h2" />
        {page.fourBrands ? (
          <RevealGroup as="ul" className="partner-offers partner-offers--brands">
            {TALENT_BRANDS.map((b) => (
              <li key={b.key} className="partner-offer partner-offer--brand" data-brand={b.key}>
                <p className="partner-offer__journey">{t(b.journey, b.journeyTa)}</p>
                <h3 className="h4 partner-offer__title">{b.name}</h3>
                <div className="partner-offer__text">
                  <p className="partner-offer__body">{t(b.promise, BRAND_PROMISE_TA[b.key])}</p>
                  <Link className="partner-link" to={localePath(b.base)}>
                    {t(`Visit ${b.name}`, `${b.name} பக்கத்துக்குச் செல்லுங்கள்`)} <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </li>
            ))}
          </RevealGroup>
        ) : (
          <RevealGroup as="ol" className={`partner-offers partner-offers--n${page.offers.length}`}>
            {page.offers.map((o, i) => (
              <li key={o.title} id={o.id} className="partner-offer">
                <span className="partner-offer__index tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h4 partner-offer__title">{f(o, 'title')}</h3>
                <div className="partner-offer__text">
                  <p className="partner-offer__body">{f(o, 'body')}</p>
                  {o.priceStat && (
                    <div className="partner-offer__stat">
                      <Stat
                        variant="compact"
                        value={o.priceStat.value}
                        prefix={o.priceStat.prefix}
                        label={f(o.priceStat, 'label')}
                        tag="C"
                        source={t(...TIER_SOURCE)}
                        note={t('Indicative until the published rate card replaces it.', 'வெளியிடப்பட்ட கட்டண அட்டவணை வரும் வரை இது தோராயமானது.')}
                        countUp={false}
                      />
                    </div>
                  )}
                  {o.to && (
                    <Link className="partner-link partner-offer__link" to={localePath(o.to)}>
                      {f(o, 'linkLabel') || t('Learn more', 'மேலும் அறிக')} <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </RevealGroup>
        )}
        {page.crossLink && (
          <p className="partner-crosslink">
            <Link className="partner-link" to={localePath(page.crossLink.to)}>
              {f(page.crossLink, 'label')} <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </p>
        )}
      </Section>

      {/* What you can report / what you get + indicative tier + rules */}
      {(page.report || page.tier || page.howWeWork || page.rule || page.entityNote || page.legal || page.rateCard) && (
        <Section>
          <div className="partner-detail">
            <Reveal className="partner-detail__main">
              {report && (
                <>
                  <p className="eyebrow">{f(page, 'reportTitle')}</p>
                  <ul role="list" className="partner-checklist">
                    {report.map((r) => (
                      <li key={r}>
                        <Check aria-hidden="true" size={20} className="partner-checklist__icon" />
                        <span className="h5">{r}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {page.howWeWork && (
                <div className="partner-detail__how">
                  <p className="eyebrow">{t('How we work with you', 'உங்களுடன் நாங்கள் எப்படிச் செயல்படுகிறோம்')}</p>
                  <p className="body-lg">{f(page, 'howWeWork')}</p>
                </div>
              )}
              {page.microcopy && <p className="partner-note">{f(page, 'microcopy')}</p>}
              {page.trustLink && (
                <p>
                  <Link className="partner-link" to={localePath(page.trustLink.to)}>
                    {f(page.trustLink, 'label')} <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </p>
              )}
              {page.entityNote && <p className="partner-note"><InlineMarks text={f(page, 'entityNote')} /></p>}
              {page.rule && (
                <p className="partner-rule">
                  <strong>{t('Our rule: ', 'எங்கள் விதி: ')}</strong>
                  {f(page, 'rule')}
                </p>
              )}
            </Reveal>
            <Reveal className="partner-detail__aside" delay={0.08}>
              {page.tier && (
                <div className="partner-tier">
                  <Stat
                    value={page.tier.value}
                    prefix={page.tier.prefix}
                    label={f(page.tier, 'label')}
                    tag="C"
                    source={t(...TIER_SOURCE)}
                    note={
                      <InlineMarks
                        text={t(
                          'Indicative. The published rate card replaces every [C] price.',
                          'தோராயமானது. வெளியிடப்பட்ட கட்டண அட்டவணை ஒவ்வொரு [C] விலையையும் மாற்றும்.'
                        )}
                      />
                    }
                    countUp={false}
                  />
                  <p className="partner-tier__note">{f(page.tier, 'note')}</p>
                  <Link className="partner-link" to={localePath('/startnet-x/pricing')}>
                    {t('StartNet X pricing', 'StartNet X கட்டணங்கள்')} <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              )}
              {page.rateCard && (
                <div className="partner-tier" id="rate-card">
                  <p className="eyebrow">{t('Rate card', 'கட்டண அட்டவணை')}</p>
                  <p className="h4">{t('Available on request.', 'கோரிக்கையின் பேரில் கிடைக்கும்.')}</p>
                  <p className="partner-tier__note">
                    {t(
                      'Packages by audience and by format, with annual all-brand packages. We send the rate card once it is published.',
                      'பார்வையாளர் வாரியாகவும் வடிவம் வாரியாகவும் தொகுப்புகள், ஆண்டு முழுவதற்குமான அனைத்து-பிராண்ட் தொகுப்புகளுடன். கட்டண அட்டவணை வெளியானதும் அனுப்புகிறோம்.'
                    )}
                  </p>
                  <Button href="#enquire" onClick={goToForm('reach')} variant="secondary">
                    {t('Request the rate card', 'கட்டண அட்டவணையைக் கோருங்கள்')}
                  </Button>
                </div>
              )}
              {page.legal && (
                <div className="partner-legal" role="note">
                  <p><strong>{f(page, 'legal')}</strong></p>
                  {/* The investor-relations line shows once its email is supplied (no placeholder address). */}
                  {page.irLine && !hasMark(f(page, 'irLine')) && <p><InlineMarks text={f(page, 'irLine')} /></p>}
                </div>
              )}
            </Reveal>
          </div>
        </Section>
      )}

      {/* How it works */}
      <Section surface="white">
        <div className="partner-how">
          <div className="partner-how__intro">
            <p className="eyebrow">{t('How it works', 'இது எப்படிச் செயல்படுகிறது')}</p>
            <h2 className="h2">{t('Three steps', 'மூன்று படிகள்')}<Dot /></h2>
            <p className="body-lg text-2">
              {t(
                'You name the outcome. We propose, run and report against it.',
                'நீங்கள் விளைவைச் சொல்கிறீர்கள். நாங்கள் முன்மொழிந்து, நடத்தி, அதன் அடிப்படையில் அறிக்கையிடுகிறோம்.'
              )}
            </p>
          </div>
          <Steps steps={localiseSteps(t)} variant="row" />
        </div>
      </Section>

      {/* Proof — the page's one Night band */}
      <Section surface="night" className="partner-proofband">
        <SectionHeader
          eyebrow={t('Proof', 'சான்று')}
          title={t('Check it before you sign.', 'கையெழுத்திடும் முன் சரிபாருங்கள்.')}
          lede={t(
            'Every figure carries a source, an as-at date and an A, B or C tag. Partners are listed only once signed, with dates.',
            'ஒவ்வொரு எண்ணுக்கும் ஒரு மூலம், நிலவரத் தேதி, A, B அல்லது C அடையாளம் உண்டு. கூட்டாளர்கள் கையெழுத்திட்ட பின்னரே, தேதிகளுடன் பட்டியலிடப்படுவார்கள்.'
          )}
          as="h2"
        />
        <div className="partner-proofband__grid">
          <ProofNeeded items={page.proof} labels={lang === 'ta' ? PROOF_TA : undefined} objection={f(page, 'objection')} />
          <div className="partner-proofband__partners">
            <h3 className="h5">{t('Signed partners', 'கையெழுத்திட்ட கூட்டாளர்கள்')}</h3>
            <SignedPartners types={page.partnerTypes} />
          </div>
        </div>
        <div className="partner-proofband__ledger">
          <LedgerProof surface="night" title={t('Founder Ledger, latest quarter', 'Founder Ledger, சமீபத்திய காலாண்டு')} />
        </div>
      </Section>

      {/* Enquiry panel */}
      <Section id="enquire" className="partner-enquire-panel">
        <div className="partner-enquire">
          <div className="partner-enquire__intro">
            <p className="eyebrow">{t('Start an enquiry', 'விசாரணையைத் தொடங்குங்கள்')}</p>
            <h2 className="h2">{t('Tell us what you need', 'உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்')}<Dot /></h2>
            <p className="body-lg text-2">
              {slaLine}
            </p>
            {route && (
              <dl className="partner-route">
                <div>
                  <dt>{t('Who reads it', 'யார் படிப்பார்கள்')}</dt>
                  <dd>{f(route, 'owner')}</dd>
                </div>
                <div>
                  <dt>{t('Reply within', 'பதில் அளிக்கும் காலம்')}</dt>
                  <dd>{f(route, 'sla')}</dd>
                </div>
                <div>
                  <dt>{t('What happens next', 'அடுத்து என்ன நடக்கும்')}</dt>
                  <dd>
                    {t(
                      'An auto-reply with a reference number and a named owner, then a discovery call.',
                      'குறிப்பு எண்ணும் பொறுப்பாளரின் பெயரும் கொண்ட தானியங்கிப் பதில், பிறகு ஓர் அறிமுக அழைப்பு.'
                    )}
                  </dd>
                </div>
              </dl>
            )}
            <div className="cluster">
              <Button variant="whatsapp" href={waLink(t(WA_TEXT, WA_TEXT_TA), `${page.waRef}, ${lang}`)} icon={MessageCircle}>
                {t('WhatsApp our partnerships team', 'எங்கள் கூட்டாண்மைக் குழுவுடன் WhatsApp-இல் பேசுங்கள்')}
              </Button>
            </div>
            <p className="partner-enquire__alt">
              {t('Prefer the full form?', 'முழுப் படிவம் வேண்டுமா?')}{' '}
              <Link to={localePath(enquirePath(page.enquiryType))}>{t('Open the enquiry page', 'விசாரணைப் பக்கத்தைத் திறங்கள்')}</Link>.
            </p>
          </div>
          <div className="partner-enquire__form">
            <EnquiryForm key={topic} defaultType={page.enquiryType} defaultTopic={topic} source={`partner-${page.slug}`} />
          </div>
        </div>
      </Section>

      {/* Other ways to partner */}
      <Section surface="white" pad="sm">
        <nav aria-label={t('Other ways to partner', 'கூட்டு சேர மற்ற வழிகள்')} className="partner-others">
          <p className="eyebrow">{t('Other ways to partner', 'கூட்டு சேர மற்ற வழிகள்')}</p>
          <ul role="list">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={localePath(`/partner/${o.slug}`)}>{f(o, 'menuLabel')} <ArrowRight aria-hidden="true" size={16} /></Link>
              </li>
            ))}
            <li><Link to={localePath('/partner')}>{t('All partner options', 'அனைத்துக் கூட்டாண்மை வாய்ப்புகள்')} <ArrowRight aria-hidden="true" size={16} /></Link></li>
          </ul>
        </nav>
      </Section>
    </>
  );
}
