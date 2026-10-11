import { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Seo, PageHero, Section, SectionHeader, Button, EmptyState, LogoWall, Reveal, RevealGroup, Skeleton } from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { sinceLabel } from './partnerData.js';
import './Partner.css';

// [English, Tamil] group headings by partner type.
const TYPE_LABELS = {
  institution: ['Universities & colleges', 'பல்கலைக்கழகங்கள் & கல்லூரிகள்'],
  gcc: ['GCCs & corporates', 'GCC-கள் & பெரு நிறுவனங்கள்'],
  corporate: ['GCCs & corporates', 'GCC-கள் & பெரு நிறுவனங்கள்'],
  government: ['Government & districts', 'அரசு & மாவட்டங்கள்'],
  sponsor: ['Sponsors', 'நிதி ஆதரவாளர்கள்'],
  csr: ['CSR foundations', 'CSR அறக்கட்டளைகள்'],
  investor: ['Investors', 'முதலீட்டாளர்கள்'],
  incubator: ['Incubators & TBIs', 'இன்குபேட்டர்கள் & TBI-கள்'],
  media: ['Media partners', 'ஊடகக் கூட்டாளர்கள்'],
  community: ['Community partners', 'சமூகக் கூட்டாளர்கள்'],
};
const OTHER_LABEL = ['Partners', 'கூட்டாளர்கள்'];

// Book 1 Part B §3.8 row 4 and §8 (Partner collection validation); Book 2 §0.3 rule 4.
const RULES = [
  ['A partner is listed only when an agreement is signed, with the date it was signed.',
    'ஒப்பந்தம் கையெழுத்தான பின்னரே, கையெழுத்திட்ட தேதியுடன், ஒரு கூட்டாளர் பட்டியலிடப்படுவார்.'],
  ['Logos appear only with written permission to use them.',
    'பயன்படுத்த எழுத்துப்பூர்வ அனுமதி இருந்தால் மட்டுமே லோகோக்கள் இடம்பெறும்.'],
  ['There is no "pipeline" list. Talks in progress are never shown.',
    '"பேச்சுவார்த்தையில் உள்ளவை" என்ற பட்டியல் கிடையாது. நடந்துகொண்டிருக்கும் பேச்சுகள் ஒருபோதும் காட்டப்படுவதில்லை.'],
  ['Government logos, including StartupTN and iTNT, appear only under a signed agreement with written logo permission.',
    'StartupTN, iTNT உட்பட அரசு லோகோக்கள், கையெழுத்திட்ட ஒப்பந்தமும் எழுத்துப்பூர்வ லோகோ அனுமதியும் இருந்தால் மட்டுமே இடம்பெறும்.'],
  ['When an agreement ends, the partner comes off this page.',
    'ஒப்பந்தம் முடிவடைந்தால், அந்தக் கூட்டாளர் இந்தப் பக்கத்திலிருந்து நீக்கப்படுவார்.'],
  ['ThinkTN is an independent non-profit we share an evidence standard with. It is never shown as a partner logo.',
    'ThinkTN, நாங்கள் சான்றுத் தரநிலையைப் பகிர்ந்துகொள்ளும் ஒரு சுயாதீன இலாப நோக்கற்ற அமைப்பு. அது ஒருபோதும் கூட்டாளர் லோகோவாகக் காட்டப்படுவதில்லை.'],
];

// /partner/our-partners — T15, signed partners only.
export default function OurPartners() {
  const { t, lang } = useLang();
  const { data, loading, error } = useApi('/api/partners');
  const partners = useMemo(
    () => (Array.isArray(data) ? data.filter((p) => p.agreementStatus === 'signed') : []),
    [data]
  );
  const groups = useMemo(() => {
    const m = new Map();
    partners.forEach((p) => {
      const type = String(p.type).toLowerCase();
      const key = t(...(Object.prototype.hasOwnProperty.call(TYPE_LABELS, type) ? TYPE_LABELS[type] : OTHER_LABEL));
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(p);
    });
    m.forEach((list) => list.sort((a, b) => String(a.since).localeCompare(String(b.since))));
    return [...m.entries()];
  }, [partners, t]);

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('StartNet partners: signed agreements, dated', 'StartNet கூட்டாளர்கள்: கையெழுத்திட்ட ஒப்பந்தங்கள்')}
        description={t(
          'Organisations with a signed agreement with StartNet, each listed with the date it was signed. We never list partners that are still in the pipeline.',
          'StartNet உடன் கையெழுத்திட்ட ஒப்பந்தம் உள்ள நிறுவனங்கள், ஒவ்வொன்றும் கையெழுத்திட்ட தேதியுடன். பேச்சுவார்த்தையில் உள்ளவற்றை நாங்கள் பட்டியலிடுவதில்லை.'
        )}
      />
      <PageHero
        eyebrow={t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}
        title={t('Our partners.', 'எங்கள் கூட்டாளர்கள்.')}
        lede={t(
          'Organisations with a signed agreement with StartNet, each listed with the date it was signed. Nothing in the pipeline is ever shown.',
          'StartNet உடன் கையெழுத்திட்ட ஒப்பந்தம் உள்ள நிறுவனங்கள், ஒவ்வொன்றும் கையெழுத்திட்ட தேதியுடன். பேச்சுவார்த்தையில் உள்ள எதுவும் ஒருபோதும் காட்டப்படுவதில்லை.'
        )}
        breadcrumbs={[{ label: t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்'), to: '/partner' }, { label: t('Our partners', 'எங்கள் கூட்டாளர்கள்') }]}
      />

      <Section surface="white">
        {loading && <Skeleton height="6rem" count={3} />}

        {!loading && (error || partners.length === 0) && (
          <EmptyState
            headingLevel={2}
            title={t('No signed partners to list yet.', 'பட்டியலிட இன்னும் கையெழுத்திட்ட கூட்டாளர்கள் இல்லை.')}
            body={t(
              'We list a partner here only once an agreement is signed and dated, and show a logo only with written permission. Until then this page stays empty rather than padded. When the first agreements are signed, they will appear here with their dates.',
              'ஒப்பந்தம் கையெழுத்தாகி தேதியிடப்பட்ட பின்னரே ஒரு கூட்டாளரை இங்கே பட்டியலிடுகிறோம்; எழுத்துப்பூர்வ அனுமதியுடன் மட்டுமே லோகோவைக் காட்டுகிறோம். அதுவரை இந்தப் பக்கத்தை நிரப்பாமல் காலியாகவே வைத்திருக்கிறோம். முதல் ஒப்பந்தங்கள் கையெழுத்தானதும், அவை தேதிகளுடன் இங்கே தோன்றும்.'
            )}
            action={<Button to="/partner/enquire">{t('Become a partner', 'கூட்டாளராகுங்கள்')}</Button>}
          />
        )}

        {!loading && partners.length > 0 && (
          <>
            <Reveal className="partner-ourwall">
              <LogoWall partners={partners.filter((p) => p.logoPermission)} showLink={false} />
            </Reveal>
            <div className="partner-groups">
              {groups.map(([label, list]) => (
                <section key={label} className="partner-group" aria-label={label}>
                  <h2 className="h5 partner-group__title">
                    {label} <span className="partner-group__count tnum">{list.length}</span>
                  </h2>
                  <RevealGroup as="ul" className="partner-group__list">
                    {list.map((p) => (
                      <li key={p.slug} className="partner-group__item">
                        <span className="partner-group__name">{p.name}</span>
                        <span className="partner-group__since">{sinceLabel(p.since, lang)}</span>
                      </li>
                    ))}
                  </RevealGroup>
                </section>
              ))}
            </div>
          </>
        )}
      </Section>

      <Section>
        <div className="split split--8-4">
          <div>
            <SectionHeader
              eyebrow={t('How we list partners', 'கூட்டாளர்களை எப்படிப் பட்டியலிடுகிறோம்')}
              title={t('Signed only, dated, with permission.', 'கையெழுத்திட்டவை மட்டும், தேதியுடன், அனுமதியுடன்.')}
              as="h2"
            />
            <RevealGroup as="ul" className="partner-rules">
              {RULES.map(([en, ta]) => (
                <li key={en}>
                  <ShieldCheck aria-hidden="true" size={20} className="partner-rules__icon" />
                  <span>{t(en, ta)}</span>
                </li>
              ))}
            </RevealGroup>
          </div>
          <Reveal className="partner-tier" delay={0.08}>
            <p className="eyebrow">{t('Work with us', 'எங்களுடன் பணியாற்றுங்கள்')}</p>
            <p className="h4">{t('Want your organisation here?', 'உங்கள் நிறுவனம் இங்கே இடம்பெற வேண்டுமா?')}</p>
            <p className="partner-tier__note">
              {t(
                "Tell us the outcome you need. We propose a programme, a price and the measures we'll report.",
                'உங்களுக்குத் தேவையான விளைவைச் சொல்லுங்கள். ஒரு திட்டம், ஒரு விலை, நாங்கள் அறிக்கையிடும் அளவீடுகள் ஆகியவற்றை முன்மொழிகிறோம்.'
              )}
            </p>
            <div className="cluster">
              <Button to="/partner/enquire">{t('Start an enquiry', 'விசாரணையைத் தொடங்குங்கள்')}</Button>
              <Button to="/partner" variant="tertiary">{t('Partner options', 'கூட்டாண்மை வாய்ப்புகள்')}</Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
