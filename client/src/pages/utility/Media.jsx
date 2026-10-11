import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Copy, Check, Mail } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Button, Tabs, EmptyState, Stat, FactBand, BrandLockup, PersonCard,
  Reveal, RevealGroup, Skeleton,
} from '../../components';
import { realMetrics, realPeople } from '../../components/_placeholders.js';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { formatDate } from '../../lib/format.js';
import './Media.css';
import './restKit.css';

// Book 2 §9 Media; Book 1 Part A §3.3 (media needs) and Part B §2.2 (/media, /media/kit).
// Press enquiries go to press@startnet.in (confirmed by StartNet, Oct 2026).
const PRESS_EMAIL = 'press@startnet.in';

// The boilerplate is press copy in English; the Tamil version below is a draft pending native review (Book 2 §14).
const BOILERPLATE =
  "StartNet is Tamil Nadu's founder-making network. Its four brands, StartNet Research, StartNet Vibe, StartNet Connect and StartNet Women, help scholars, students, professionals and women become founders through events, learning, incubation, capital and market access, all run on one platform, StartNet X. StartNet's goal, Mission 1 Lakh, is to nurture 1,00,000 founders in Tamil Nadu by March 2031, counted in a public, quarterly Founder Ledger. StartNet is headquartered in Salem and works across Tamil Nadu. Every talent, a founder.";
const BOILERPLATE_TA =
  'StartNet தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு. அதன் நான்கு பிராண்டுகளான StartNet Research, StartNet Vibe, StartNet Connect, StartNet Women ஆகியவை, நிகழ்வுகள், கற்றல், இன்குபேஷன், மூலதனம், சந்தை அணுகல் மூலம் ஆய்வாளர்கள், மாணவர்கள், தொழில்முறையாளர்கள், பெண்கள் நிறுவனர்களாக உதவுகின்றன; இவை அனைத்தும் StartNet X என்ற ஒரே தளத்தில் இயங்குகின்றன. StartNet-இன் இலக்கான Mission 1 Lakh, மார்ச் 2031-க்குள் தமிழ்நாட்டில் 1,00,000 நிறுவனர்களை உருவாக்குவது; இது பொதுவில், காலாண்டுதோறும் வெளியாகும் Founder Ledger-இல் கணக்கிடப்படுகிறது. StartNet சேலத்தைத் தலைமையிடமாகக் கொண்டு தமிழ்நாடு முழுவதும் செயல்படுகிறது. ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.'; // SEO-TA: pending native review

// Colour values from Book 3 §9.3 (tokens.css). Swatches render from tokens; hex is shown as text for press use.
const COLOURS = [
  { name: 'Ink', nameTa: 'மை (Ink)', token: '--sn-ink', hex: '#0C1719' },
  { name: 'StartNet Red', nameTa: 'StartNet சிவப்பு', token: '--sn-red', hex: '#EF4444' },
  { name: 'Paper', nameTa: 'காகிதம் (Paper)', token: '--sn-paper', hex: '#F4F3EF' },
  { name: 'Research indigo', nameTa: 'Research கருநீலம்', token: '--sn-research', hex: '#4A3AA7' },
  { name: 'Vibe orange', nameTa: 'Vibe ஆரஞ்சு', token: '--sn-vibe', hex: '#E2581F' },
  { name: 'Connect green', nameTa: 'Connect பச்சை', token: '--sn-connect', hex: '#0E8F63' },
  { name: 'Women magenta', nameTa: 'Women மெஜந்தா', token: '--sn-women', hex: '#C2386F' },
];

export default function Media() {
  const { t, lang, localePath } = useLang();
  const boilerplate = lang === 'ta' ? BOILERPLATE_TA : BOILERPLATE;
  const press = useApi('/api/press');
  const ledger = useApi('/api/ledger');
  const people = useApi('/api/people?group=leadership');
  const [copied, setCopied] = useState(false);

  const items = Array.isArray(press.data) ? [...press.data].sort((a, b) => String(b.date).localeCompare(String(a.date))) : [];
  const releases = items.filter((p) => p.kind === 'release');
  const coverage = items.filter((p) => p.kind === 'coverage');
  // Real values / named people only: placeholder-only figures and people stay hidden until StartNet supplies them.
  const kpis = realMetrics(ledger.data?.kpis).slice(0, 4);
  const leaders = realPeople(people.data).slice(0, 4);

  const copyBoilerplate = async () => {
    try {
      await navigator.clipboard.writeText(boilerplate);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch { /* clipboard blocked: text remains selectable */ }
  };

  const pressList = (list, kind) => {
    if (press.loading) return <Skeleton height="4.5rem" count={3} />;
    if (!list.length) {
      return (
        <EmptyState
          title={kind === 'release'
            ? t('No press releases yet.', 'இன்னும் செய்தி வெளியீடுகள் இல்லை.')
            : t('No coverage listed yet.', 'இன்னும் ஊடகச் செய்திகள் பட்டியலிடப்படவில்லை.')}
          body={t('Releases will appear here with their date and a link to read them.', 'வெளியீடுகள் அவற்றின் தேதியுடனும் படிப்பதற்கான இணைப்புடனும் இங்கே தோன்றும்.')}
          action={<Button href={`mailto:${PRESS_EMAIL}`} variant="secondary">{t('Email the press team', 'ஊடகக் குழுவுக்கு மின்னஞ்சல்')}</Button>}
        />
      );
    }
    return (
      <ul className="media-list" role="list">
        {list.map((p) => {
          const external = p.url && /^https?:/i.test(p.url);
          const href = p.url ? (external ? p.url : localePath(p.url)) : null;
          return (
            <li key={p.slug} className="media-list__item">
              <time className="media-list__date tnum" dateTime={p.date}>{formatDate(p.date)}</time>
              <div className="media-list__main">
                <p className="media-list__title h5">{p.title}</p>
                {p.outlet && <p className="media-list__outlet">{p.outlet}</p>}
              </div>
              {href && (external ? (
                <a className="media-list__read" href={href} rel="noopener">
                  {t('Read', 'படிக்க')} <ArrowUpRight aria-hidden="true" size={16} />
                  <span className="visually-hidden"> {p.title} {t('(external site)', '(வெளித் தளம்)')}</span>
                </a>
              ) : (
                <Link className="media-list__read" to={href}>
                  {t('Read', 'படிக்க')} <ArrowRight aria-hidden="true" size={16} /><span className="visually-hidden"> {p.title}</span>
                </Link>
              ))}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {/* SEO-TA: pending native review */}
      <Seo
        title={t('StartNet media centre: press releases, fact sheet', 'StartNet ஊடக மையம்: செய்தி வெளியீடுகள்')}
        description={t(
          "Press releases, a fact sheet with sourced figures, spokespeople, brand assets and the media contact for StartNet, Tamil Nadu's founder-making network.",
          'StartNet-இன் செய்தி வெளியீடுகள், மூலங்களுடன் கூடிய தகவல் தாள், செய்தித் தொடர்பாளர்கள், பிராண்ட் கோப்புகள், ஊடகத் தொடர்பு.'
        )}
      />

      <PageHero
        className="rk-hero rk-page"
        eyebrow={t('Media', 'ஊடகம்')}
        title={t('Media centre', 'ஊடக மையம்')}
        lede={t(
          "Press releases, sourced facts, spokespeople and brand assets. If a figure isn't on our fact sheet with a source, please don't attribute it to us.",
          'செய்தி வெளியீடுகள், மூலங்களுடன் கூடிய தகவல்கள், செய்தித் தொடர்பாளர்கள், பிராண்ட் கோப்புகள். ஓர் எண் மூலத்துடன் எங்கள் தகவல் தாளில் இல்லையெனில், அதை எங்களுடையதாகக் குறிப்பிட வேண்டாம்.'
        )}
        breadcrumbs={[{ label: t('Media', 'ஊடகம்') }]}
        actions={
          <>
            <Button href={`mailto:${PRESS_EMAIL}`} size="lg" icon={Mail}>{t('Email the press team', 'ஊடகக் குழுவுக்கு மின்னஞ்சல்')}</Button>
            <Button href="#media-kit" variant="tertiary" size="lg">{t('Brand assets', 'பிராண்ட் கோப்புகள்')}</Button>
          </>
        }
        art={{ variant: 'dot', ratio: '4/5', seed: 9, alt: '' }}
      />

      {/* Updates + contact */}
      <Section surface="white">
        <div className="media-updates">
          <div className="media-updates__main">
            <SectionHeader eyebrow={t('Newsroom', 'செய்தி அறை')} title={t('Releases and coverage', 'வெளியீடுகளும் ஊடகச் செய்திகளும்')} as="h2" />
            <div className="media-updates__tabs">
              <Tabs
                label={t('Press releases and coverage', 'செய்தி வெளியீடுகளும் ஊடகச் செய்திகளும்')}
                tabs={[
                  { id: 'releases', label: `${t('Press releases', 'செய்தி வெளியீடுகள்')}${releases.length ? ` (${releases.length})` : ''}`, content: pressList(releases, 'release') },
                  { id: 'coverage', label: `${t('Coverage', 'ஊடகச் செய்திகள்')}${coverage.length ? ` (${coverage.length})` : ''}`, content: pressList(coverage, 'coverage') },
                ]}
              />
            </div>
          </div>

          <aside className="media-contact" aria-labelledby="media-contact-title">
            <p className="eyebrow">{t('Media contact', 'ஊடகத் தொடர்பு')}</p>
            <h2 id="media-contact-title" className="h4">{t('Talk to the press team', 'ஊடகக் குழுவிடம் பேசுங்கள்')}</h2>
            <ul role="list" className="media-contact__list">
              <li>
                <Mail aria-hidden="true" size={18} /> <a href={`mailto:${PRESS_EMAIL}`}>{PRESS_EMAIL}</a>
              </li>
            </ul>
            <p className="media-contact__sla">
              {/* Response time confirmed by StartNet, Oct 2026. SEO-TA: pending native review */}
              {t('We reply within two working days.', 'இரண்டு வேலை நாட்களுக்குள் பதிலளிக்கிறோம்.')}
            </p>
            <Button href={`mailto:${PRESS_EMAIL}`} full icon={Mail}>{t('Email the press team', 'ஊடகக் குழுவுக்கு மின்னஞ்சல்')}</Button>
          </aside>
        </div>
      </Section>

      {/* Fact sheet — the page's one Night band */}
      <Section surface="night" id="fact-sheet" className="media-factsheet">
        <SectionHeader
          eyebrow={t('Fact sheet', 'தகவல் தாள்')}
          title={t('Facts you can quote, with sources.', 'மூலங்களுடன், மேற்கோள் காட்டக்கூடிய தகவல்கள்.')}
          lede={t(
            'Every figure carries an A, B or C confidence tag and an as-at date. Targets are labelled as targets.',
            'ஒவ்வொரு எண்ணுக்கும் A, B அல்லது C நம்பகத்தன்மைக் குறியும் குறிப்பிட்ட தேதியும் உண்டு. இலக்குகள் இலக்குகளாகவே குறிக்கப்படுகின்றன.'
          )}
          as="h2"
        />
        {/* Fact sheet PDF: add a download link here when StartNet supplies the file. */}
        <div className="media-facts">
          <dl className="media-facts__list">
            <div>
              <dt>{t('Founded', 'தொடங்கப்பட்டது')}</dt>
              {/* MCA master data: StartNet Ventures Private Limited, incorporated 4 July 2023 (RoC Coimbatore).
                  SEO-TA: pending native review */}
              <dd>{t('2023 (incorporated 4 July 2023)', '2023 (4 ஜூலை 2023 அன்று பதிவுசெய்யப்பட்டது)')}</dd>
            </div>
            <div><dt>{t('Headquarters', 'தலைமையகம்')}</dt><dd>{t('Salem, Tamil Nadu', 'சேலம், தமிழ்நாடு')}</dd></div>
            <div>
              <dt>{t('Legal entity', 'சட்டப்பூர்வ நிறுவனம்')}</dt>
              <dd>StartNet Ventures Private Limited · CIN <span className="tnum">U70200TZ2023PTC028823</span></dd>
            </div>
            <div>
              <dt>{t('Structure', 'அமைப்பு')}</dt>
              <dd>{t(
                'Four talent brands, six shared engines and one platform, StartNet X',
                'நான்கு திறமை பிராண்டுகள், ஆறு பகிரப்பட்ட இயந்திரங்கள், ஒரே தளம் StartNet X'
              )}</dd>
            </div>
            <div><dt>{t('Brands', 'பிராண்டுகள்')}</dt><dd>StartNet Research · StartNet Vibe · StartNet Connect · StartNet Women</dd></div>
            <div>
              <dt>{t('Leadership', 'தலைமை')}</dt>
              <dd><Link to={localePath('/about/leadership')}>{t('Leadership & team', 'தலைமை & குழு')}</Link></dd>
            </div>
          </dl>
          <div className="media-facts__mission">
            <Stat
              variant="hero"
              value={100000}
              label={t(
                'founders nurtured in Tamil Nadu by March 2031: the Mission 1 Lakh target',
                'மார்ச் 2031-க்குள் தமிழ்நாட்டில் உருவாக்கப்படும் நிறுவனர்கள்: Mission 1 Lakh இலக்கு'
              )}
              tag="C"
              source={t('StartNet plan, Mission 1 Lakh', 'StartNet திட்டம், Mission 1 Lakh')}
              note={t(
                'A planning target, not an outcome. Progress is counted in the quarterly Founder Ledger.',
                'இது திட்டமிடல் இலக்கு, விளைவு அல்ல. முன்னேற்றம் காலாண்டு Founder Ledger-இல் கணக்கிடப்படுகிறது.'
              )}
            />
            <Link className="media-link" to={localePath('/about/mission-1-lakh')}>
              {t('Read the mission', 'இலக்கைப் படியுங்கள்')} <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        {(ledger.loading || kpis.length > 0) && (<div className="media-facts__ledger">
          {ledger.loading ? (
            <Skeleton height="8rem" />
          ) : kpis.length ? (
            <FactBand
              metrics={kpis}
              surface="night"
              title={t('Latest Founder Ledger figures', 'சமீபத்திய Founder Ledger எண்கள்')}
              link={{ label: t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்'), to: '/insights/founder-ledger' }}
            />
          ) : null}
        </div>)}
      </Section>

      {/* Boilerplate */}
      <Section surface="white">
        <div className="split split--8-4 media-boiler">
          <Reveal>
            <p className="eyebrow">{t('Boilerplate', 'நிலையான அறிமுக உரை')}</p>
            <h2 className="h3">{t('About StartNet, copy-ready', 'StartNet பற்றி, நகலெடுக்கத் தயார்')}</h2>
            <blockquote className="media-boiler__text body-lg" id="media-boilerplate">{boilerplate}</blockquote>
          </Reveal>
          <Reveal delay={0.08} className="media-boiler__actions">
            <Button onClick={copyBoilerplate} variant="secondary" icon={copied ? Check : Copy} aria-describedby="media-boilerplate">
              {copied ? t('Copied', 'நகலெடுக்கப்பட்டது') : t('Copy boilerplate', 'அறிமுக உரையை நகலெடு')}
            </Button>
            <p className="media-boiler__status" role="status" aria-live="polite">
              {copied ? t('Boilerplate copied to your clipboard.', 'அறிமுக உரை உங்கள் கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது.') : ''}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Spokespeople */}
      <Section>
        <SectionHeader
          eyebrow={t('Spokespeople', 'செய்தித் தொடர்பாளர்கள்')}
          title={t('Who can speak on what', 'யார் எதைப் பற்றிப் பேசலாம்')}
          lede={t('Founders and brand leads, and the topics each can speak on.', 'நிறுவனர்களும் பிராண்ட் தலைவர்களும், ஒவ்வொருவரும் பேசக்கூடிய தலைப்புகளும்.')}
          as="h2"
          action={<Button to="/about/leadership" variant="tertiary">{t('Leadership & team', 'தலைமை & குழு')}</Button>}
        />
        {people.loading ? (
          <Skeleton height="10rem" />
        ) : leaders.length ? (
          <RevealGroup className="grid grid-4 media-people">
            {leaders.map((p) => <PersonCard key={p.slug} person={p} />)}
          </RevealGroup>
        ) : null}
      </Section>

      {/* Brand assets */}
      <Section surface="white" id="media-kit">
        <SectionHeader
          eyebrow={t('Brand assets', 'பிராண்ட் கோப்புகள்')}
          title={t('Logos, colours and photos', 'சின்னங்கள், வண்ணங்கள், புகைப்படங்கள்')}
          lede={t(
            'Logo lock-ups for the masterbrand and four brands, light and dark; colour values; approved photos with captions and credits.',
            'முதன்மை பிராண்டுக்கும் நான்கு பிராண்டுகளுக்கும் வெளிர், அடர் பின்னணிச் சின்ன அமைப்புகள்; வண்ண மதிப்புகள்; தலைப்பும் நன்றிக்குறிப்பும் கொண்ட அங்கீகரிக்கப்பட்ட புகைப்படங்கள்.'
          )}
          as="h2"
        />
        {/* Media kit ZIP: add a download link here when StartNet supplies the file. */}

        <RevealGroup className="media-lockups">
          {[null, 'research', 'vibe', 'connect', 'women'].map((b) => (
            <div key={b || 'master'} className="media-lockup">
              <div className="media-lockup__tile media-lockup__tile--light"><BrandLockup brand={b} size="sm" /></div>
              <div className="media-lockup__tile media-lockup__tile--dark" data-surface="night"><BrandLockup brand={b} size="sm" reversed /></div>
            </div>
          ))}
        </RevealGroup>

        <ul className="media-colours" role="list" aria-label={t('Colour values', 'வண்ண மதிப்புகள்')}>
          {COLOURS.map((c) => (
            <li key={c.token} className="media-colour">
              <span className="media-colour__swatch" style={{ background: `var(${c.token})` }} aria-hidden="true" />
              <span className="media-colour__name">{t(c.name, c.nameTa)}</span>
              <code className="media-colour__hex">{c.hex}</code>
            </li>
          ))}
        </ul>

        <p className="media-usage">
          {t(
            "Please don't recolour the red full stop or combine brand accents. Write StartNet as one word, capital S and N.",
            'சிவப்பு முற்றுப்புள்ளியின் நிறத்தை மாற்றவோ பிராண்ட் வண்ணங்களைக் கலக்கவோ வேண்டாம். StartNet என்பதை ஒரே சொல்லாக, S, N பெரிய எழுத்துகளில் எழுதுங்கள்.'
          )}
        </p>
      </Section>
    </>
  );
}
