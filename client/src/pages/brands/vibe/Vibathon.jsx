import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Trophy, Rocket, MessageCircle, MapPin, School, Megaphone } from 'lucide-react';
import { useApi } from '../../../hooks/useApi.js';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { snapshotPending } from '../../../lib/handover.js';
import { useLang } from '../../../lib/i18n.jsx';
import { waLink } from '../../../lib/links.js';
import { formatDate } from '../../../lib/format.js';
import { usePageCta } from '../../../layout/shell.jsx';
import {
  Seo, Section, SectionHeader, Breadcrumbs, KineticHeadline, Badge, Button, ArtImage, FactBand, Stat, TagChip,
  KeyFacts, Accordion, CTABand, Reveal, RevealGroup, InlineMarks,
} from '../../../components';
import VibathonCountdown from './parts/VibathonCountdown.jsx';
import SeasonTimeline from './parts/SeasonTimeline.jsx';
import TrackExplorer from './parts/TrackExplorer.jsx';
import { ph } from './parts/ph.jsx';
import { isPlaceholderText } from '../../../components/_placeholders.js';
import {
  VIBATHON, VIBATHON_REGISTRATION, VIBATHON_TIMELINE, VIBATHON_TRACKS, VIBATHON_PRIZES, VIBATHON_SPONSOR_TIERS,
  VIBATHON_FAQ, VIBATHON_FACTS, VIBATHON_2025, vibathonRegisterLink, tx, tr, localiseMetric,
} from './vibeContent.js';
import '../brandPage.css';
import './Vibathon.css';
import { pageLd } from '../seoBits.js';
import { photoFor, seriesPhoto, PHOTO_SIZES } from '../../../data/photos.js';

const WHAT_ICONS = { build: Code2, compete: Trophy, continue: Rocket };
const WIPE = { hidden: { clipPath: 'inset(0 100% 0 0)' }, shown: { clipPath: 'inset(0 0% 0 0)' } };

/** The season in the current language; the 2027 edition record (if the server has it) supplies the finale date and venue. */
function useSeason(t) {
  const { data } = useApi('/api/events/vibathon-2027');
  const base = VIBATHON_TIMELINE.map((s) => ({ ...s, stage: tr(t, s, 'stage'), when: tr(t, s, 'when'), what: tr(t, s, 'what') }));
  if (!data || !data.date) return base;
  const place = [data.venue, data.city].filter(Boolean).join(', ');
  return base.map((s) =>
    s.id === 'finale'
      ? {
          ...s,
          when: formatDate(data.date),
          date: data.date,
          what: place
            ? t(`Finalists build and demo to the industry jury, at ${place}`, `இறுதிப் போட்டியாளர்கள் ${place}-இல் உருவாக்கி, தொழில்துறை நடுவர் குழு முன் செயல்விளக்கம் அளிப்பார்கள்`)
            : s.what,
        }
      : s
  );
}

/** Book 2 sentence-case fragments start lower-case ("district qualifiers, …"); show them capitalised in English only. */
const capFirst = (s) => (s && /^[a-z]/.test(s) ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function Vibathon() {
  const { t, lang, localePath } = useLang();
  const reduced = useReducedMotion();
  const stages = useSeason(t);
  const register = vibathonRegisterLink(lang);
  const registerLabel = tx(t, 'Register your team');
  const wa = (ctx) => waLink('VIBATHON', `vibe-vibathon${ctx ? `-${ctx}` : ''}, ${lang}`);
  const statusOpen = !!VIBATHON_REGISTRATION.closes && Date.now() < new Date(VIBATHON_REGISTRATION.closes).getTime();
  const partnersCta = '/partner/enquire?type=sponsor&topic=vibathon';

  // Bottom bar (< 1024px): register the team on StartNet X.
  usePageCta({ label: 'Register your team', labelTa: 'உங்கள் குழுவைப் பதிவு செய்யுங்கள்', shortLabel: 'Register', shortLabelTa: 'பதிவு செய்யுங்கள்', href: register, brand: 'vibe' });

  return (
    <>
      {/* Event markup lives on the canonical event page (/events/vibathon-2027), once its date is confirmed. */}
      <Seo
        title={tr(t, VIBATHON, 'seoTitle')}
        titleTa={VIBATHON.seoTitleTa}
        description={tr(t, VIBATHON, 'seoDescription')}
        descriptionTa={VIBATHON.seoDescriptionTa}
        jsonLd={pageLd({ path: '/vibe/vibathon', lang, name: tr(t, VIBATHON, 'seoTitle'), description: tr(t, VIBATHON, 'seoDescription') })}
      />

      {/* ---------- Campaign hero: Night + Vibe (the page's one Night band) ---------- */}
      <Section surface="night" brand="vibe" className="vibathon__hero" pad="none" labelledBy="vibathon-title">
        <div className="vibathon__hero-crumbs">
          <Breadcrumbs items={[{ label: 'StartNet Vibe', to: '/vibe' }, { label: 'Vibathon' }]} />
        </div>
        <div className="vibathon__hero-grid">
          <div className="vibathon__hero-copy">
            <div className="cluster vibathon__hero-chips">
              <Badge kind="status" status={statusOpen ? 'open' : 'upcoming'}>
                {statusOpen ? t('Registration open', 'பதிவு திறந்துள்ளது') : t('Registration opens soon', 'பதிவு விரைவில் தொடங்கும்')}
              </Badge>
              <Badge kind="lang">English · தமிழ்</Badge>
            </div>
            <KineticHeadline as="h1" id="vibathon-title" text={VIBATHON.h1} className="vibathon__title" />
            <motion.p
              className="vibathon__endorse"
              initial={reduced || snapshotPending() ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.5, ease: [0, 0, 0.3, 1] }}
            >
              {t(
                <>a <Link to={localePath('/vibe')}>StartNet Vibe</Link> programme</>,
                <><Link to={localePath('/vibe')}>StartNet Vibe</Link> திட்டம்</>
              )}
            </motion.p>
            <p className="vibathon__lede">{tr(t, VIBATHON, 'lede')}</p>
            <VibathonCountdown opens={VIBATHON_REGISTRATION.opens} closes={VIBATHON_REGISTRATION.closes} />
            <div className="cluster vibathon__hero-actions" data-primary-cta="">
              <Button variant="brand" size="lg" href={register}>{registerLabel}</Button>
              <Button variant="inverse" size="lg" href="#partners">{t('Become a sponsor', 'ஸ்பான்சர் ஆகுங்கள்')}</Button>
            </div>
            <p className="vibathon__micro">{ph(tr(t, VIBATHON, 'microcopy'))}</p>
          </div>
          <div className="vibathon__hero-art">
            <ArtImage
              variant="network"
              brand="vibe"
              ratio="4/5"
              night
              animate
              seed={2027}
              photo={photoFor('event/vibathon/2025') || seriesPhoto('vibathon')}
              priority
              sizes={PHOTO_SIZES.hero}
              alt=""
            />
          </div>
        </div>
      </Section>

      {/* ---------- Figures + the last edition ---------- */}
      <Section surface="paper" pad="sm">
        <FactBand
          className="bp-facts"
          metrics={VIBATHON_FACTS.map((m) => localiseMetric(t, m))}
          title={t('Vibathon in figures', 'எண்களில் Vibathon')}
          footnote={
            <InlineMarks
              text={t(
                'Vibathon 2025 figures: the college mix is from the Vibathon 2025 brochure [B]; the team count is from StartNet Vibe’s recap [B]. Vibathon 2027 figures are planning targets [C], not results.',
                'Vibathon 2025 எண்கள்: கல்லூரிகளின் விவரம் Vibathon 2025 கையேட்டிலிருந்து [B]; குழுக்களின் எண்ணிக்கை StartNet Vibe நிகழ்வுத் தொகுப்பிலிருந்து [B]. Vibathon 2027 எண்கள் திட்ட இலக்குகள் [C], முடிவுகள் அல்ல.'
              )}
            />
          }
          link={{ label: t('Past events archive', 'முந்தைய நிகழ்வுகளின் தொகுப்பு'), to: '/events/past' }}
        />

        {/* Vibathon 2025, as the sources record it (vibeContent.js VIBATHON_2025; docs/research/vibe-events.md §1).
            Winners are not named. Tamil: draft, pending native review. */}
        <section className="vibathon__last" id="last-edition" aria-labelledby="vibathon-last">
          <div className="vibathon__last-head">
            <p className="eyebrow">{t('The last edition', 'கடந்த பதிப்பு')}</p>
            <h2 id="vibathon-last" className="h3">{t('Vibathon 2025, Tiruchengode', 'Vibathon 2025, திருச்செங்கோடு')}</h2>
            <p className="body-lg text-2">{tr(t, VIBATHON_2025, 'lede')}</p>
            <p className="text-2">{tr(t, VIBATHON_2025, 'themes')}</p>
            <Button variant="tertiary" to={VIBATHON_2025.edition}>{t('See the 2025 edition', '2025 பதிப்பைப் பாருங்கள்')}</Button>
          </div>
          <dl className="vibathon__last-facts">
            <div><dt>{t('When', 'எப்போது')}</dt><dd>{tr(t, VIBATHON_2025, 'when')}</dd></div>
            <div><dt>{t('Where', 'எங்கே')}</dt><dd>{tr(t, VIBATHON_2025, 'where')}</dd></div>
            <div><dt>{t('In association with', 'இணைந்து நடத்தியவர்கள்')}</dt><dd>{tr(t, VIBATHON_2025, 'partners')}</dd></div>
            <div><dt>{t('Sponsors', 'ஸ்பான்சர்கள்')}</dt><dd>{tr(t, VIBATHON_2025, 'sponsors')}</dd></div>
            <div><dt>{t('Prizes', 'பரிசுகள்')}</dt><dd>{tr(t, VIBATHON_2025, 'prizes')}</dd></div>
          </dl>
          <p className="caption vibathon__last-src">{tr(t, VIBATHON_2025, 'sources')}</p>
        </section>
      </Section>

      {/* ---------- What it is ---------- */}
      <Section surface="white" labelledBy="vibathon-what">
        <SectionHeader as="h2" eyebrow={t('What it is', 'இது என்ன')} title={<span id="vibathon-what">{t('Build. Compete. Continue.', 'உருவாக்குங்கள். போட்டியிடுங்கள். தொடருங்கள்.')}</span>} />
        <RevealGroup as="ol" className="vibathon__what">
          {VIBATHON.whatItIs.map((w, i) => {
            const Icon = WHAT_ICONS[w.id];
            return (
              <li key={w.id} className="vibathon__what-item">
                <span className="vibathon__what-num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {reduced ? (
                  <span className="vibathon__what-icon-wrap" aria-hidden="true">
                    <span className="vibathon__what-icon"><Icon size={44} strokeWidth={1.5} /></span>
                  </span>
                ) : (
                  /* The observer sits on the unclipped wrapper: a fully clipped element never reports as in view. */
                  <motion.span
                    className="vibathon__what-icon-wrap"
                    aria-hidden="true"
                    initial="hidden"
                    whileInView="shown"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <motion.span
                      className="vibathon__what-icon"
                      variants={WIPE}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.4, 0.14, 0.3, 1] }}
                    >
                      <Icon size={44} strokeWidth={1.5} />
                    </motion.span>
                  </motion.span>
                )}
                <h3 className="h3">{tr(t, w, 'title')}</h3>
                <p className="text-2">{ph(capFirst(tr(t, w, 'body')))}</p>
              </li>
            );
          })}
        </RevealGroup>
      </Section>

      {/* ---------- Season timeline ---------- */}
      <Section surface="paper" labelledBy="vibathon-season" id="season">
        <SectionHeader
          as="h2"
          eyebrow={t('The season', 'போட்டிப் பருவம்')}
          title={<span id="vibathon-season">{t('From the call to the state finale', 'அழைப்பிலிருந்து மாநில இறுதிப் போட்டி வரை')}</span>}
          lede={t(
            // Exact dates not supplied yet: the "All dates [to be supplied]" sentence is left out.
            'Indicative planning calendar: the call in December 2026 and the finale in February 2027.',
            'தோராயத் திட்ட நாட்காட்டி: டிசம்பர் 2026-இல் அழைப்பு, பிப்ரவரி 2027-இல் இறுதிப் போட்டி.'
          )}
        />
        <div className="vibathon__timeline">
          <SeasonTimeline stages={stages} />
        </div>
        <Reveal className="vibathon__district">
          <MapPin size={28} strokeWidth={1.75} aria-hidden="true" className="vibathon__district-icon" />
          <div>
            <h3 className="h5">{t('Your district qualifier', 'உங்கள் மாவட்டத் தகுதிச் சுற்று')}</h3>
            <p className="small text-2">
              {/* District count not supplied yet: the "Qualifiers in [number] districts" sentence is left out. */}
              {t(
                "Tell us your district on WhatsApp and we'll send only nearby dates.",
                'WhatsApp-இல் உங்கள் மாவட்டத்தைச் சொல்லுங்கள்; அருகிலுள்ள தேதிகளை மட்டுமே அனுப்புவோம்.'
              )}
            </p>
          </div>
          <Button variant="whatsapp" href={wa('district')}>{tx(t, 'Get updates on WhatsApp')}</Button>
        </Reveal>
      </Section>

      {/* ---------- Tracks ---------- */}
      <Section surface="white" labelledBy="vibathon-tracks" id="tracks">
        <SectionHeader
          as="h2"
          eyebrow={t('Tracks', 'பிரிவுகள்')}
          title={<span id="vibathon-tracks">{t('Choose your track', 'உங்கள் பிரிவைத் தேர்ந்தெடுங்கள்')}</span>}
          lede={t(
            'Five tracks, from AI for Tamil Nadu to a business-plan track.',
            'தமிழ்நாட்டுக்கான AI முதல் வணிகத் திட்டப் பிரிவு வரை ஐந்து பிரிவுகள்.'
          )}
        />
        <div className="vibathon__tracks">
          <TrackExplorer tracks={VIBATHON_TRACKS} />
        </div>
      </Section>

      {/* ---------- Rules and eligibility ---------- */}
      <Section surface="paper" labelledBy="vibathon-rules" id="rules">
        <div className="split split--8-4 vibathon__rules">
          <div className="vibathon__rules-copy">
            <SectionHeader as="h2" eyebrow={t('Rules and eligibility', 'விதிகளும் தகுதியும்')} title={<span id="vibathon-rules">{t("Who can enter, and how it's judged", 'யார் பங்கேற்கலாம், எப்படி மதிப்பிடப்படும்')}</span>} />
            <ul className="vibathon__rules-list">
              <li>
                <strong>{t('Any college in Tamil Nadu.', 'தமிழ்நாட்டின் எந்தக் கல்லூரியும்.')}</strong>{' '}
                {ph(t(
                  'Students enrolled in any college or university in Tamil Nadu. [confirm whether recent graduates are eligible]',
                  'தமிழ்நாட்டில் உள்ள எந்தக் கல்லூரி அல்லது பல்கலைக்கழகத்திலும் பயிலும் மாணவர்கள். [சமீபத்தில் பட்டம் பெற்றவர்கள் தகுதியானவர்களா என்பது உறுதி செய்யப்பட உள்ளது]'
                ))}
              </li>
              <li>
                <strong>{t('No coding needed.', 'கோடிங் தேவையில்லை.')}</strong>{' '}
                {t(
                  'You need to build something that works. AI tools help, and the free starter course on Vibe Academy shows you how.',
                  'செயல்படும் ஒன்றை உருவாக்கினால் போதும். AI கருவிகள் உதவும்; Vibe Academy-இல் உள்ள இலவசத் தொடக்கப் பாடநெறி எப்படி என்று காட்டும்.'
                )}
              </li>
              <li>
                <strong>{t('Judged on what works, not on slides.', 'ஸ்லைடுகளை அல்ல, செயல்படுவதை வைத்து மதிப்பீடு.')}</strong>{' '}
                {ph(t('A [12-hour, confirm 2027 format] build sprint with AI tools.', 'AI கருவிகளுடன் [12 மணி நேரம், 2027 வடிவம் உறுதி செய்யப்பட உள்ளது] உருவாக்கப் போட்டி.'))}
              </li>
              <li><strong>{t('Tamil or English.', 'தமிழ் அல்லது ஆங்கிலம்.')}</strong> {t('You can present in Tamil or English.', 'தமிழிலோ ஆங்கிலத்திலோ முன்வைக்கலாம்.')}</li>
              <li>
                <strong>{t('Your work stays yours.', 'உங்கள் படைப்பு உங்களுடையதே.')}</strong>{' '}
                {t('Sponsors receive no rights to your work unless you agree separately in writing.', 'நீங்கள் தனியாக எழுத்துப்பூர்வமாக ஒப்புக்கொண்டால் தவிர, உங்கள் படைப்பின் மீது ஸ்பான்சர்களுக்கு எந்த உரிமையும் இல்லை.')}
              </li>
              <li>
                <strong>{t('Under 18?', '18 வயதுக்குக் குறைவா?')}</strong>{' '}
                {t(
                  "You can take part with verifiable consent from a parent or guardian. We'll send them a link when you register.",
                  'பெற்றோர் அல்லது பாதுகாவலரின் சரிபார்க்கக்கூடிய ஒப்புதலுடன் பங்கேற்கலாம். நீங்கள் பதிவு செய்யும்போது அவர்களுக்கு ஓர் இணைப்பை அனுப்புவோம்.'
                )}
              </li>
            </ul>
          </div>
          <KeyFacts
            items={[
              { label: t('Team', 'குழு'), value: ph(t("Teams of 2–4 [confirm]. Solo? We'll help you find teammates through StartNet X.", '2–4 பேர் கொண்ட குழுக்கள் [உறுதி செய்யப்பட உள்ளது]. தனியாக இருக்கிறீர்களா? StartNet X மூலம் குழு உறுப்பினர்களைக் கண்டறிய உதவுவோம்.')) },
              { label: t('Fee', 'கட்டணம்'), value: ph(t('Free to ₹499 per team [placeholder — final fee]. Fee waivers on request [confirm].', 'ஒரு குழுவுக்கு இலவசம் முதல் ₹499 வரை [விவரம் வர உள்ளது — இறுதிக் கட்டணம்]. கோரிக்கையின் பேரில் கட்டண விலக்கு [உறுதி செய்யப்பட உள்ளது].')) },
              { label: t('Format', 'வடிவம்'), value: t('District qualifiers, then a state finale', 'மாவட்டத் தகுதிச் சுற்றுகள், பின்னர் மாநில இறுதிப் போட்டி') },
              { label: t('Language', 'மொழி'), value: t('Tamil or English', 'தமிழ் அல்லது ஆங்கிலம்') },
              { label: t('Register on', 'பதிவு செய்யும் இடம்'), value: t('StartNet X or WhatsApp', 'StartNet X அல்லது WhatsApp') },
            ]}
            action={<Button variant="brand" full href={register}>{registerLabel}</Button>}
          />
        </div>
      </Section>

      {/* ---------- Prizes ---------- */}
      <Section surface="white" labelledBy="vibathon-prizes" id="prizes">
        <SectionHeader as="h2" eyebrow={t('Prizes', 'பரிசுகள்')} title={<span id="vibathon-prizes">{t('Prizes and what comes next', 'பரிசுகளும் அடுத்து வருவதும்')}</span>} />
        <RevealGroup className="vibathon__prizes">
          {/* A prize whose only content is a placeholder is hidden; a placeholder body next to a real figure is left out. */}
          {VIBATHON_PRIZES.filter((p) => p.metric || !isPlaceholderText(tr(t, p, 'body'))).map((p) => (
            <article key={p.id} className={`vibathon__prize vibathon__prize--${p.id}`}>
              <h3 className="h5">{tr(t, p, 'title')}</h3>
              {!isPlaceholderText(tr(t, p, 'body')) && <p className="small text-2">{ph(tr(t, p, 'body'))}</p>}
              {p.metric && (
                <div className="vibathon__prize-stat">
                  <p className="caption">{t('For reference', 'குறிப்புக்கு')}</p>
                  <Stat metric={localiseMetric(t, p.metric)} variant="compact" />
                </div>
              )}
            </article>
          ))}
        </RevealGroup>
        {/* Jury line hidden until named jurors (with consent) are supplied. */}
      </Section>

      {/* ---------- Host colleges + sponsors ---------- */}
      <Section surface="paper" labelledBy="vibathon-partners" id="partners">
        <SectionHeader
          as="h2"
          eyebrow={tx(t, 'Partner with us')}
          title={<span id="vibathon-partners">{t('Host a qualifier. Back a track.', 'ஒரு தகுதிச் சுற்றை நடத்துங்கள். ஒரு பிரிவுக்கு ஆதரவளியுங்கள்.')}</span>}
          lede={t(
            'Colleges host district qualifiers and a year of Vibe Campus events. Sponsors set real problems and meet finalists who opt in.',
            'கல்லூரிகள் மாவட்டத் தகுதிச் சுற்றுகளையும் ஓராண்டு Vibe Campus நிகழ்வுகளையும் நடத்துகின்றன. ஸ்பான்சர்கள் உண்மையான சிக்கல்களை அமைத்து, ஒப்புதல் அளித்த இறுதிப் போட்டியாளர்களைச் சந்திக்கிறார்கள்.'
          )}
        />
        <div className="vibathon__paths">
          <Reveal className="vibathon__path">
            <School size={32} strokeWidth={1.5} aria-hidden="true" className="vibathon__path-icon" />
            <h3 className="h4">{t('Become a host college', 'நடத்தும் கல்லூரியாகுங்கள்')}</h3>
            <p className="text-2">{t(
              'Host a qualifier plus a year of Vibe Campus events. Start with a Vibe Campus night or a district Vibathon, then join the Institution Partner Programme.',
              'ஒரு தகுதிச் சுற்றையும் ஓராண்டு Vibe Campus நிகழ்வுகளையும் நடத்துங்கள். ஒரு Vibe Campus இரவு அல்லது மாவட்ட Vibathon-உடன் தொடங்கி, பிறகு Institution Partner Programme-இல் சேருங்கள்.'
            )}</p>
            <div className="cluster">
              <Button variant="brand" to="/vibe/for-colleges">{t('Bring Vibe to your college', 'உங்கள் கல்லூரிக்கு Vibe-ஐக் கொண்டு வாருங்கள்')}</Button>
              <Button variant="tertiary" to="/vibe/campus">{t('Host Vibe Campus', 'Vibe Campus-ஐ நடத்துங்கள்')}</Button>
            </div>
          </Reveal>
          <Reveal className="vibathon__path" delay={0.06}>
            <Megaphone size={32} strokeWidth={1.5} aria-hidden="true" className="vibathon__path-icon" />
            <h3 className="h4">{t('Sponsor Vibathon 2027', 'Vibathon 2027-க்கு ஸ்பான்சர் செய்யுங்கள்')}</h3>
            <p className="text-2">{t(
              'Title, track, district and talent-pass packages. Your problem statement, your judges, and opted-in access to finalists.',
              'முதன்மை, பிரிவு, மாவட்ட, திறமையாளர் அனுமதித் தொகுப்புகள். உங்கள் சிக்கல் அறிக்கை, உங்கள் நடுவர்கள், ஒப்புதல் அளித்த இறுதிப் போட்டியாளர்களுக்கான அணுகல்.'
            )}</p>
            <div className="cluster">
              <Button variant="secondary" to={partnersCta}>{t('Request the sponsor deck', 'ஸ்பான்சர் விவரக்கோப்பைக் கோருங்கள்')}</Button>
              <Button variant="tertiary" to={partnersCta}>{t('Talk to the partnerships team', 'கூட்டாண்மைக் குழுவிடம் பேசுங்கள்')}</Button>
            </div>
          </Reveal>
        </div>

        <div className="vibathon__tiers">
          <div className="vibathon__tiers-head">
            <h3 className="h4">{t('Sponsor tiers', 'ஸ்பான்சர் நிலைகள்')}</h3>
            <p className="small text-2">
              {t('Indicative, from the planning rate card', 'திட்டக் கட்டண அட்டவணையிலிருந்து, தோராயமானவை')} <TagChip tag="C" />.{' '}
              {t('To be replaced with the published 2027 rate card.', 'வெளியிடப்படும் 2027 கட்டண அட்டவணை இதை மாற்றும்.')}
            </p>
            <p className="caption vibathon__tiers-hint" aria-hidden="true">{t('Swipe the table sideways to see the indicative price.', 'தோராய விலையைப் பார்க்க அட்டவணையைப் பக்கவாட்டில் நகர்த்துங்கள்.')}</p>
          </div>
          <div className="vibathon__tiers-scroll" role="region" aria-label={t('Sponsor tiers', 'ஸ்பான்சர் நிலைகள்')} tabIndex={0}>
            <table className="vibathon__tiers-table">
              <thead>
                <tr>
                  <th scope="col">{t('Tier', 'நிலை')}</th>
                  <th scope="col">{t('What you get', 'உங்களுக்குக் கிடைப்பவை')}</th>
                  <th scope="col">{t('Indicative', 'தோராயம்')}</th>
                </tr>
              </thead>
              <tbody>
                {VIBATHON_SPONSOR_TIERS.map((tier) => (
                  <tr key={tier.id}>
                    <th scope="row">{tr(t, tier, 'tier')}</th>
                    <td>{ph(tr(t, tier, 'gets'))}</td>
                    <td className="vibathon__tiers-price tnum">{tr(t, tier, 'price')} <TagChip tag="C" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption">{t('Prices exclude GST. Talent access is shared only with students who opt in.', 'விலைகள் GST நீங்கலாக. ஒப்புதல் அளிக்கும் மாணவர்களின் விவரங்கள் மட்டுமே பகிரப்படும்.')}</p>
          {/* Sponsors line hidden until a sponsor agreement is signed. */}
        </div>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section surface="white" className="bp-faq" labelledBy="vibathon-faq" id="faq">
        <SectionHeader as="h2" eyebrow={t('FAQ', 'அடிக்கடி கேட்கப்படும் கேள்விகள்')} title={<span id="vibathon-faq">{t('Questions, answered', 'கேள்விகளும் பதில்களும்')}</span>} />
        <div className="vibathon__faq">
          <Accordion
            faq
            items={VIBATHON_FAQ.map((f) => {
              const answer = tr(t, f, 'answer');
              // Plain answers stay strings (FAQPage JSON-LD); answers with [confirm]/[placeholder] marks are styled.
              return { id: f.id, question: tr(t, f, 'question'), answer: answer.includes('[') ? <p>{ph(answer)}</p> : answer };
            })}
          />
        </div>
      </Section>

      {/* ---------- Close ---------- */}
      <CTABand
        surface="paper"
        brand="vibe"
        className="brand-close"
        title={t('Build something people use, with AI, in a weekend.', 'மக்கள் பயன்படுத்தும் ஒன்றை AI கொண்டு ஒரு வார இறுதியில் உருவாக்குங்கள்.')}
        body={t('Start in your district, finish at the state finale.', 'உங்கள் மாவட்டத்தில் தொடங்குங்கள், மாநில இறுதிப் போட்டியில் முடியுங்கள்.')}
        actions={
          <>
            <Button variant="brand" size="lg" href={register}>{registerLabel}</Button>
            <Button variant="whatsapp" size="lg" icon={MessageCircle} href={wa()}>{t('Join the Vibathon WhatsApp channel', 'Vibathon WhatsApp சேனலில் இணையுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}
