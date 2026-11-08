import { Link, useSearchParams } from 'react-router-dom';
import { MessageCircle, Clock, Hash, UserCheck, CalendarCheck } from 'lucide-react';
import { Seo, Section, SectionHeader, Button, Reveal, Breadcrumbs, KineticHeadline } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import { useMediaQuery } from '../../layout/shell.jsx';
import {
  ROUTING, SLA_LINE, SLA_LINE_TA, WA_TEXT, WA_TEXT_TA,
  TENDER_NOTE, TENDER_NOTE_TA, PARTNER_TYPES, tf,
} from './partnerData.js';
import EnquiryForm from './EnquiryForm.jsx';
import '../utility/Contact.css';
import './Partner.css';

// Accept both enquiry values (?type=institution) and partner page slugs (?type=institutions).
const TYPE_ALIASES = Object.fromEntries(
  Object.values(PARTNER_TYPES).map((p) => [p.slug, p.enquiryType])
);

// /partner/enquire — T13 routed enquiry form (Book 1 Part A §7.4, Part B §9.3; Book 2 §13.5).
export default function Enquire() {
  const { t, localePath, lang } = useLang();
  const [params] = useSearchParams();
  // The routing table stacks into label/value rows (no sideways scroll, so no scroller tab stop) below 600px,
  // and below 1280px in Tamil, where the ~40% longer headers would otherwise split mid-word (V-P1).
  const stackedTable = useMediaQuery(lang === 'ta' ? '(max-width: 1279px)' : '(max-width: 599px)');
  const rawType = (params.get('type') || '').toLowerCase();
  const type = Object.prototype.hasOwnProperty.call(TYPE_ALIASES, rawType) ? TYPE_ALIASES[rawType] : rawType;
  const topic = (params.get('topic') || '').toLowerCase();
  // Attribution from deep links (e.g. ?ref=research-ipp, ?brand=connect), sanitised and length-capped.
  const clean = (v) => (v || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 80) || undefined;
  const ref = clean(params.get('ref'));
  const brand = clean(params.get('brand'));
  const slaLine = t(SLA_LINE, SLA_LINE_TA);
  // The "[SLA to be confirmed]" / "[confirm]" notes are editorial marks and are not shown next to the SLA.
  const colType = t('Organisation type', 'நிறுவன வகை');
  const colOwner = t('Routed to', 'அனுப்பப்படுவது');
  const colSla = t('Reply within', 'பதில் அளிக்கும் காலம்');

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Partner enquiry: CSR, GCC, college, government', 'கூட்டாண்மை விசாரணை: CSR, GCC, கல்லூரி, அரசு')}
        description={t(
          'Tell StartNet what outcome you need. Enquiries from institutions, GCCs, government, sponsors, CSR funders, investors and incubators go to a named owner.',
          'உங்களுக்குத் தேவையான விளைவை StartNet-இடம் சொல்லுங்கள். ஒவ்வொரு கூட்டாளர் விசாரணையும் பெயரிடப்பட்ட பொறுப்பாளருக்கு அனுப்பப்படும். எல்லா வகைக்கும் ஒரே படிவம்.'
        )}
      />

      {/* SPEC 5.7: /partner/enquire uses the contact template (5.8): a Bone centred hero (no Ink band, no sheet rise),
          the step indicator, then one centred column with the form in a White card (max 768). */}
      <header className="contact-hero partner-enquire-hero rk-page" data-ground="bone">
        <div className="container contact-hero__inner">
          <Breadcrumbs
            items={[{ label: t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்'), to: '/partner' }, { label: t('Enquire', 'விசாரணை') }]}
            className="contact-hero__crumbs"
          />
          <p className="eyebrow contact-hero__eyebrow">{t('Partner with us', 'எங்களுடன் கூட்டு சேருங்கள்')}</p>
          <KineticHeadline
            text={t('Tell us what you need.', 'உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்.')}
            as="h1"
            accentWord="need"
            className="contact-hero__title"
          />
          <p className="contact-hero__lede">
            {t(
              'One form for every kind of partner. Choose your organisation type and we route it to the right team.',
              'எல்லா வகைக் கூட்டாளர்களுக்கும் ஒரே படிவம். உங்கள் நிறுவன வகையைத் தேர்ந்தெடுங்கள்; சரியான குழுவுக்கு அனுப்புகிறோம்.'
            )}
          </p>
          <p className="partner-hero-sla partner-enquire-hero__sla">
            <Clock aria-hidden="true" size={16} /> {slaLine}
          </p>
          {/* Step indicator (SPEC 4.12): choose the type, it is routed to an owner, then what happens next. */}
          <ol className="contact-steps" role="list">
            <li className="contact-steps__item is-active" aria-current="step">
              <a href="#enquire-form"><span className="contact-steps__num" aria-hidden="true">1</span>{colType}</a>
            </li>
            <li className="contact-steps__item">
              <a href="#partner-routing"><span className="contact-steps__num" aria-hidden="true">2</span>{colOwner}</a>
            </li>
            <li className="contact-steps__item">
              <a href="#enquire-next"><span className="contact-steps__num" aria-hidden="true">3</span>{t('What happens next', 'அடுத்து என்ன நடக்கும்')}</a>
            </li>
          </ol>
        </div>
      </header>

      {/* One centred column: the form in a White card, then what happens after you send. */}
      <Section id="enquire-form">
        <div className="contact-formwrap partner-enquire-page">
          <div className="contact-formwrap__form">
            <EnquiryForm
              key={`${type}-${topic}-${ref || ''}-${brand || ''}`}
              defaultType={type}
              defaultTopic={topic}
              source="partner-enquire"
              hidden={{ ref, brand }}
            />
          </div>

          <aside id="enquire-next" className="partner-enquire__aside partner-enquire-page__next" aria-label={t('What happens after you send', 'அனுப்பிய பிறகு என்ன நடக்கும்')}>
            <Reveal>
              <h2 className="h4">{t('What happens next', 'அடுத்து என்ன நடக்கும்')}</h2>
              <ol className="partner-next" role="list">
                <li>
                  <Hash aria-hidden="true" size={20} />
                  <span>
                    {t(
                      'An auto-reply with a reference number and the name of the person who owns your enquiry.',
                      'குறிப்பு எண்ணும் உங்கள் விசாரணையின் பொறுப்பாளர் பெயரும் கொண்ட தானியங்கிப் பதில்.'
                    )}
                  </span>
                </li>
                <li>
                  <UserCheck aria-hidden="true" size={20} />
                  <span>{slaLine}</span>
                </li>
                <li>
                  <CalendarCheck aria-hidden="true" size={20} />
                  <span>
                    {t(
                      "A discovery call, then a proposal with a price from our rate card and the measures we'll report.",
                      'ஓர் அறிமுக அழைப்பு, பிறகு எங்கள் கட்டண அட்டவணையிலிருந்து ஒரு விலையும் நாங்கள் அறிக்கையிடும் அளவீடுகளும் கொண்ட முன்மொழிவு.'
                    )}
                  </span>
                </li>
              </ol>

              <p className="partner-note">{t(TENDER_NOTE, TENDER_NOTE_TA)}</p>

              <div className="partner-enquire__wa">
                <Button
                  variant="whatsapp"
                  href={waLink(t(WA_TEXT, WA_TEXT_TA), `partner-enquire, ${lang}`)}
                  icon={MessageCircle}
                >
                  {t('WhatsApp our partnerships team', 'எங்கள் கூட்டாண்மைக் குழுவுடன் WhatsApp-இல் பேசுங்கள்')}
                </Button>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      <Section id="partner-routing" surface="white" labelledBy="partner-routing-title">
        <div className="partner-routing">
          <SectionHeader
            id="partner-routing-title"
            eyebrow={t('Routing', 'அனுப்பும் முறை')}
            title={t('Who reads your enquiry', 'உங்கள் விசாரணையை யார் படிப்பார்கள்')}
            lede={t(
              'Each enquiry is recorded with its source page and assigned by organisation type. If we miss the reply time, it is escalated.',
              'ஒவ்வொரு விசாரணையும் அது வந்த பக்கத்துடன் பதிவுசெய்யப்பட்டு, நிறுவன வகைப்படி ஒதுக்கப்படுகிறது. பதில் நேரத்தைத் தவறவிட்டால், அது மேல்நிலைக்குக் கொண்டு செல்லப்படும்.'
            )}
            as="h2"
          />
          {/* Its own name, distinct from the section heading (F-88). */}
          <div
            className={`partner-routing__table${stackedTable ? ' partner-routing__table--stacked' : ''}`}
            role="region"
            aria-label={t('Enquiry routing table', 'விசாரணை அனுப்பும் அட்டவணை')}
            tabIndex={stackedTable ? undefined : 0}
          >
            {/* Explicit roles keep table semantics when the stacked phone layout sets display:block. */}
            <table role="table">
              <thead role="rowgroup">
                <tr role="row">
                  <th scope="col" role="columnheader">{colType}</th>
                  <th scope="col" role="columnheader">{colOwner}</th>
                  <th scope="col" role="columnheader">{colSla}</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {ROUTING.map((r) => (
                  <tr key={r.type} role="row">
                    <th scope="row" role="rowheader" data-label={colType}>{tf(t, r, 'type')}</th>
                    <td role="cell" data-label={colOwner}>{tf(t, r, 'owner')}</td>
                    <td role="cell" data-label={colSla} className="tnum">
                      {tf(t, r, 'sla')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="partner-routing__more">
            {lang === 'ta' ? (
              <>
                ஊடக விசாரணைகள் பத்திரிகைக் குழுவுக்குச் செல்லும்: <Link to={localePath('/media')}>ஊடக மையத்தைப்</Link> பாருங்கள்.
                மற்ற அனைத்துக்கும்: <Link to={localePath('/contact')}>தொடர்புக்கு</Link>.
              </>
            ) : (
              <>
                Media enquiries go to the press team: see the <Link to={localePath('/media')}>media centre</Link>. Everything else:{' '}
                <Link to={localePath('/contact')}>Contact</Link>.
              </>
            )}
          </p>
        </div>
      </Section>
    </>
  );
}
