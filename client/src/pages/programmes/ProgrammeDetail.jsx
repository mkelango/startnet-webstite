// /programmes/:slug — Programme page (Book 1 Part B T03; Book 3 Part B §4: 8/4 with sticky key-facts aside + Apply).
// Apply hands off to StartNet X (Book 1 Part B §9.1). Brand-accented via data-brand.
// Tamil: template copy is t('English', 'தமிழ்') (Book 2 §14.3 CTAs; other lines are drafts, native review pending).
// Programme data uses `<field>Ta` from the API when present, then DATA_TA drafts for short seeded strings, and
// otherwise renders the English with lang="en". Programme names stay in Latin script.
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Check, ArrowRight, BellRing } from 'lucide-react';
import {
  Seo, Section, SectionHeader, BrandHero, PageHero, Breadcrumbs, KeyFacts, Badge, Button, Steps, Ladder,
  Accordion, ProgrammeCard, CTABand, Skeleton, RevealGroup,
} from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { snxLink, waLink } from '../../lib/links.js';
import { formatDate } from '../../lib/format.js';
import { useApi } from '../../hooks/useApi.js';
import { useShell } from '../../layout/shell.jsx';
import { BRANDS } from '../../data/brands.js';
import NotFound from '../utility/NotFound.jsx';
import RichText, { hasMarks } from './parts/RichText.jsx';
import { ScrubText } from '../../components/ScrubText.jsx';
import { FORMATS, PRICES, STATUS, isAccepting, levelCode, levelIndex, levelName, labelOf, programmeField } from './parts/programmeMeta.js';
import { courseLd } from '../../lib/seo.js';
import { fitTitle, fitDescription, realText } from './parts/seoFit.js';
import './ProgrammeDetail.css';

const LANG_NAMES = { en: ['English', 'ஆங்கிலம்'], ta: ['தமிழ் (Tamil)', 'தமிழ்'] };
const SHORT_DATE = { day: 'numeric', month: 'short' };

// SEO: what each programme is, as a search phrase (Book 1 §9.2 themes; every phrase restates Book 2 copy:
// §3.1–3.4 brand pages and the §4 programme index). [English, Tamil draft] — SEO-TA: pending native review.
// `course: true` marks the cohort / course programmes that get Course JSON-LD (Book 1 §9.4).
const SEO_KIND = {
  vibathon: { en: 'AI build hackathon', ta: 'AI ஹேக்கத்தான்' },
  'vibe-academy': { en: 'AI building course', ta: 'AI உருவாக்கப் பயிற்சி', course: true },
  'vibe-campus': { en: 'campus build nights', ta: 'கல்லூரி உருவாக்க இரவுகள்' },
  'vibe-launchpad': { en: '12-week pre-incubation', ta: '12 வார முன்-இன்குபேஷன்', course: true },
  'vibe-clubs': { en: 'student-run clubs', ta: 'மாணவர் கிளப்புகள்' },
  'vibe-summit': { en: 'Vibe Campus state finale', ta: 'Vibe Campus மாநில இறுதி நிகழ்வு' },
  'scholar-founders-fellowship': { en: '7-week founder sprint', ta: '7 வார நிறுவனர் பயிற்சி', course: true },
  'startnet-labs': { en: 'how to join a research lab', ta: 'ஆராய்ச்சி ஆய்வகத்தில் சேர' },
  'lab-to-market-summit': { en: 'research demo summit', ta: 'ஆராய்ச்சி உச்சி மாநாடு' },
  'institution-partner-programme': { en: 'apply as a college', ta: 'கல்லூரிகள் விண்ணப்பிக்க' },
  'connect-series': { en: 'sector communities', ta: 'துறைச் சமூகங்கள்' },
  'founder-switch': { en: '12-week founder programme', ta: '12 வார நிறுவனர் திட்டம்', course: true },
  'connect-circles': { en: 'founder circles', ta: 'நிறுவனர் வட்டங்கள்' },
  'scale-connect': { en: 'for startups past first revenue', ta: 'முதல் வருவாய்க்குப் பின் வளர' },
  'startnet-angels': { en: 'founder angel network', ta: 'நிறுவனர் ஏஞ்சல் வலையமைப்பு' },
  'women-circles': { en: 'women founder circles', ta: 'பெண் நிறுவனர் வட்டங்கள்' },
  'rise-academy': { en: 'course for women founders', ta: 'பெண் தொழில்முனைவோர் பயிற்சி', course: true },
  hercapital: { en: 'investment readiness for women', ta: 'பெண்களுக்கான முதலீட்டுத் தயார்நிலை' },
  'women-founders-summit': { en: 'annual summit', ta: 'ஆண்டு உச்சி மாநாடு' },
  'grant-desk': { en: 'startup grant navigation', ta: 'ஸ்டார்ட்அப் மானிய வழிகாட்டல்' },
};
const COURSE_MODE = { online: 'online', 'in-person': 'onsite', hybrid: 'blended' };
/** "7 weeks", "12 weeks, evenings and weekends" → ISO 8601 "P7W"; anything else → undefined. */
const weeksIso = (d) => {
  const m = /^(\d+)\s*weeks?\b/i.exec(typeof d === 'string' ? d.trim() : '');
  return m ? `P${m[1]}W` : undefined;
};

/** Programme copy for the current language; English fallbacks on /ta pages are marked lang="en". */
function Copy({ p, field, lang }) {
  const { text, en } = programmeField(p, field, lang);
  if (text == null || text === '') return null;
  return en ? <span lang="en"><RichText text={text} /></span> : <RichText text={text} />;
}

function buildFaq(p, t, lang) {
  const eligibility = programmeField(p, 'eligibility', lang);
  const priceNote = programmeField(p, 'priceNote', lang);
  const gst = p.price === 'paid' ? t(' Prices exclude GST.', ' விலைகள் GST நீங்கலாக.') : '';
  return [
    {
      id: 'pd-faq-who',
      question: t('Who can apply?', 'யார் விண்ணப்பிக்கலாம்?'),
      answer: eligibility.text?.length ? (
        <ul className="programme-detail__faq-list" lang={eligibility.en ? 'en' : undefined}>
          {eligibility.text.map((e) => <li key={e}><RichText text={e} /></li>)}
        </ul>
      ) : null, // no eligibility yet: Accordion hides a question whose answer is missing or only a placeholder
    },
    {
      id: 'pd-faq-cost',
      question: t('How much does it cost?', 'இதற்கு எவ்வளவு கட்டணம்?'),
      answer: priceNote.text ? (
        <>
          <Copy p={p} field="priceNote" lang={lang} />
          {gst}
        </>
      ) : (
        `${labelOf(PRICES, p.price, lang)}.${gst}`
      ),
    },
    {
      id: 'pd-faq-language',
      question: t('Can I take part in Tamil?', 'தமிழில் பங்கேற்க முடியுமா?'),
      answer: (Array.isArray(p.languages) ? p.languages : []).includes('ta')
        ? t('Yes. This programme runs in Tamil as well as English.', 'ஆம். இந்தத் திட்டம் ஆங்கிலத்துடன் தமிழிலும் நடைபெறுகிறது.')
        : t('This programme currently runs in English.', 'இந்தத் திட்டம் தற்போது ஆங்கிலத்தில் மட்டும் நடைபெறுகிறது.'),
    },
    {
      id: 'pd-faq-apply',
      question: t('How do I apply?', 'எப்படி விண்ணப்பிப்பது?'),
      answer: t(
        'You apply on StartNet X. Sign in with your phone number or WhatsApp; if you are new, you set up a free profile in three short steps. The application saves as you go.',
        'StartNet X-இல் விண்ணப்பிக்கலாம். உங்கள் கைபேசி எண் அல்லது WhatsApp மூலம் உள்நுழையுங்கள்; நீங்கள் புதியவர் என்றால், மூன்று எளிய படிகளில் இலவச சுயவிவரத்தை உருவாக்கலாம். நிரப்பும்போதே விண்ணப்பம் சேமிக்கப்படும்.'
      ),
    },
    {
      id: 'pd-faq-decision',
      question: t('When will I hear back?', 'எப்போது பதில் கிடைக்கும்?'),
      answer: t(
        'Two or more people review every application. You get a decision within 14 days of the call closing, on screen, on WhatsApp and by email.',
        'ஒவ்வொரு விண்ணப்பத்தையும் இருவர் அல்லது அதற்கு மேற்பட்டோர் மதிப்பாய்வு செய்வார்கள். அழைப்பு முடிந்த 14 நாட்களுக்குள் முடிவு தெரிவிக்கப்படும்: திரையில், WhatsApp-இல், மின்னஞ்சலில்.'
      ),
    },
    {
      id: 'pd-faq-under18',
      question: t("I'm under 18. Can I apply?", 'எனக்கு 18 வயதுக்குக் குறைவு. நான் விண்ணப்பிக்கலாமா?'),
      answer: t(
        'You can, with verifiable consent from a parent or guardian. We send them a link when you apply.',
        'விண்ணப்பிக்கலாம், பெற்றோர் அல்லது பாதுகாவலரின் சரிபார்க்கக்கூடிய ஒப்புதலுடன். நீங்கள் விண்ணப்பிக்கும்போது அவர்களுக்கு ஒரு இணைப்பை அனுப்புவோம்.'
      ),
    },
  ];
}

export default function ProgrammeDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { data: p, loading, error } = useApi(`/api/programmes/${encodeURIComponent(slug)}`);
  const { data: siblings } = useApi(p?.brand ? `/api/programmes?brand=${encodeURIComponent(p.brand)}` : null);

  const related = useMemo(
    () => (Array.isArray(siblings) ? siblings.filter((x) => x.slug !== slug && x.status !== 'closed').slice(0, 3) : []),
    [siblings, slug]
  );

  // Strings shared by the hero, the aside, the mobile bottom bar and the CTA band.
  const name = p ? programmeField(p, 'title', lang).text || p.title : '';
  const ctaLabel = p ? programmeField(p, 'ctaLabel', lang).text || t('Apply now', 'இப்போதே விண்ணப்பியுங்கள்') : '';
  const closesLabel = (label) => {
    if (!p?.applyBy) return label;
    const d = formatDate(p.applyBy, SHORT_DATE, lang);
    return t(`${label} · closes ${d}`, `${label} · ${d} அன்று முடிகிறது`);
  };
  const notifyLabel = t('Notify me', 'எனக்குத் தெரிவியுங்கள்');
  const notifyText = p ? t(`Notify me when ${p.title} opens`, `${p.title} திறக்கும்போது எனக்குத் தெரிவியுங்கள்`) : '';

  // Context CTA for the mobile bottom bar (Book 1 Part B §3.4): Programme -> "Apply · closes <date>" / "Notify me",
  // same label and target as the page's own primary action.
  const shell = useShell();
  const setPageCta = shell?.setPageCta;
  const pageCta = useMemo(() => {
    if (!p || !p.slug) return null;
    if (isAccepting(p)) {
      return {
        label: closesLabel(ctaLabel),
        href: snxLink(p.snxPath || `/apply/${p.slug}`, { src: 'programme', brand: p.brand, lang }),
        brand: p.brand || undefined,
      };
    }
    return { label: notifyLabel, href: waLink(notifyText, `programme:${p.slug}`), brand: p.brand || undefined };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, lang, ctaLabel, notifyLabel, notifyText]);
  // Flag the sticky aside while part of it is scrolled out of view (drives the fade above the pinned action).
  const stickyRef = useRef(null);
  const ready = !!p && !loading;
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return undefined;
    const check = () => {
      // Facts hidden under the pinned action (it is position: sticky at the scroller's foot).
      const list = el.querySelector('.key-facts__list');
      const act = el.querySelector('.key-facts__action');
      const more = !!list && !!act && el.scrollHeight > el.clientHeight + 1
        && list.getBoundingClientRect().bottom > act.getBoundingClientRect().top + 1;
      if (more) el.setAttribute('data-more', '');
      else el.removeAttribute('data-more');
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      ro?.disconnect();
    };
  }, [ready]);

  const pageCtaKey = pageCta ? JSON.stringify(pageCta) : '';
  useEffect(() => {
    if (!pageCta || typeof setPageCta !== 'function') return undefined;
    setPageCta(pageCta);
    return () => setPageCta(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCtaKey, setPageCta]);

  if (error && /^404/.test(error.message || '')) return <NotFound />;

  if (loading || (!p && !error)) {
    return (
      <div className="programme-detail" aria-busy="true">
        {/* No <Seo> while loading: the snapshot's (or previous route's) head stays until the data-backed <Seo> renders. */}
        <div className="container programme-detail__loading">
          <h1 className="visually-hidden">{t('Loading programme…', 'திட்டம் ஏற்றப்படுகிறது…')}</h1>
          <Skeleton height="3rem" />
          <Skeleton height="18rem" />
          <Skeleton height="8rem" count={3} />
        </div>
      </div>
    );
  }

  if (error || !p) {
    return (
      <div className="programme-detail">
        <Seo title={t('Programme', 'திட்டம்')} />
        <Section>
          <div className="programme-detail__error" role="alert">
            <h1 className="h2">{t("We couldn't load this programme.", 'இந்தத் திட்டத்தை ஏற்ற முடியவில்லை.')}</h1>
            <p className="text-2">
              {t(
                'Something went wrong on our side, not yours. Please try again in a minute.',
                'பிழை எங்கள் பக்கம், உங்கள் பக்கம் அல்ல. ஒரு நிமிடம் கழித்து மீண்டும் முயலுங்கள்.'
              )}
            </p>
            <div className="cluster">
              <Button onClick={() => window.location.reload()}>{t('Try again', 'மீண்டும் முயலுங்கள்')}</Button>
              <Button variant="secondary" to="/programmes">{t('See all programmes', 'எல்லாத் திட்டங்களையும் பாருங்கள்')}</Button>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  const brand = BRANDS[p.brand];
  const open = isAccepting(p);
  const applyHref = snxLink(p.snxPath || `/apply/${p.slug}`, { src: 'programme', brand: p.brand, lang });
  const moreUrl = p.url && p.url !== `/programmes/${p.slug}` ? p.url : null;
  const notifyHref = waLink(notifyText, `programme:${p.slug}`);
  const applyBy = p.applyBy ? formatDate(p.applyBy, undefined, lang) : null;
  const entry = levelIndex(p.stageEntry);
  const exit = levelIndex(p.stageExit);
  const statusLabel = labelOf(STATUS, p.status, lang);
  const summary = programmeField(p, 'summary', lang);
  const headline = programmeField(p, 'headline', lang);
  const showHeadline = !!headline.text && p.headline !== p.title;
  const eligibility = programmeField(p, 'eligibility', lang);
  const outcomes = programmeField(p, 'outcomes', lang);
  const langs = (Array.isArray(p.languages) ? p.languages : p.languages ? [p.languages] : [])
    .map((l) => (LANG_NAMES[l] ? t(LANG_NAMES[l][0], LANG_NAMES[l][1]) : l))
    .join(' · ') || '—';

  const primaryButton = (heroPrimary) =>
    open ? (
      <Button variant="brand" href={applyHref} icon={ArrowRight} data-primary-cta={heroPrimary ? '' : undefined}>
        {ctaLabel}
      </Button>
    ) : (
      <Button variant="brand" href={notifyHref} icon={BellRing} data-primary-cta={heroPrimary ? '' : undefined}>
        {notifyLabel}
      </Button>
    );
  const primaryAction = primaryButton(false);

  const heroActions = (
    <>
      {primaryButton(true)}
      {moreUrl && (
        <Button variant="tertiary" to={moreUrl}>
          {t(`More about ${name}`, `${name} பற்றி மேலும்`)}
        </Button>
      )}
    </>
  );

  const meta = (
    <div className="programme-detail__meta">
      <Badge kind="status" status={p.status}>{statusLabel}</Badge>
      {applyBy && open && (
        <span className="programme-detail__applyby">
          {t('Apply by', 'கடைசி நாள்')} <time dateTime={p.applyBy}>{applyBy}</time>
        </span>
      )}
      {entry > 0 && (
        <Badge kind="level">
          {levelCode(p.stageEntry)} → {levelCode(p.stageExit)}
        </Badge>
      )}
      {p.statusNote && (
        <p className="programme-detail__status-note">
          <Copy p={p} field="statusNote" lang={lang} />
        </p>
      )}
    </div>
  );

  const facts = [
    { label: t('Status', 'நிலை'), value: <Badge kind="status" status={p.status}>{statusLabel}</Badge> },
    applyBy && { label: t('Apply by', 'விண்ணப்பிக்கக் கடைசி நாள்'), value: <time dateTime={p.applyBy}>{applyBy}</time> },
    entry > 0 && {
      label: t('Ladder', 'ஏணி'),
      value: (
        <span className="tnum">
          {levelCode(p.stageEntry)} {levelName(entry, lang)} → {levelCode(p.stageExit)} {levelName(exit, lang)}
        </span>
      ),
    },
    p.forWhom && { label: t('For', 'யாருக்கு'), value: <Copy p={p} field="forWhom" lang={lang} /> },
    p.duration && { label: t('Length', 'காலம்'), value: <Copy p={p} field="duration" lang={lang} /> },
    { label: t('Format', 'வடிவம்'), value: labelOf(FORMATS, p.format, lang) },
    { label: t('Language', 'மொழி'), value: langs },
    { label: t('Cost', 'கட்டணம்'), value: p.priceNote ? <Copy p={p} field="priceNote" lang={lang} /> : labelOf(PRICES, p.price, lang) },
    brand && { label: t('Brand', 'பிராண்ட்'), value: brand.name },
  ].filter(Boolean);

  const crumbs = [{ label: t('Programmes', 'திட்டங்கள்'), to: '/programmes' }, { label: name }];
  // SEO: "<Programme>: <what it is> in Tamil Nadu", trimmed to fit 60 chars; description = the programme's own
  // summary plus who it is for, fitted to 120–155 chars. Placeholder text never reaches a tag.
  const kind = SEO_KIND[p.slug];
  const kindText = kind ? (lang === 'ta' ? kind.ta : kind.en) : null;
  const brandName = brand?.name;
  const seoTitle = lang === 'ta'
    ? fitTitle(
      kindText && `${name}: தமிழ்நாட்டில் ${kindText}`,
      kindText && `${name}: ${kindText}`,
      brandName && `${name}: ${brandName} திட்டம்`,
      name
    ) // SEO-TA: pending native review
    : fitTitle(
      kindText && `${name}: ${kindText} in Tamil Nadu`,
      kindText && `${name}: ${kindText}`,
      brandName && `${name}: ${brandName} programme`,
      name
    );
  // "For …" is added only when the summary does not already open with who it is for.
  const forWhomText = /^for\s/i.test(p.summary || '') ? undefined : realText(programmeField(p, 'forWhom', lang).text);
  const seoDescription = fitDescription(
    summary.text,
    forWhomText && t(`For ${forWhomText.replace(/^for\s+/i, '').replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase())}`, `யாருக்கு: ${forWhomText}`),
    [
      t('See who can apply, the cost and how to apply on StartNet X.', 'யார் விண்ணப்பிக்கலாம், கட்டணம், StartNet X-இல் விண்ணப்பிக்கும் முறை இங்கே.'),
      t('Apply on StartNet X.', 'StartNet X-இல் விண்ணப்பியுங்கள்.'),
    ]
  );
  const courseJsonLd = kind?.course
    ? courseLd({
      name,
      description: seoDescription,
      path: `/programmes/${p.slug}`,
      lang,
      inLanguage: Array.isArray(p.languages) && p.languages.length ? p.languages : undefined,
      price: p.price === 'free' ? 'free' : undefined,
      timeRequired: weeksIso(p.duration),
      courseMode: COURSE_MODE[p.format],
    })
    : null;
  const ladderFrom = levelCode(p.stageEntry);
  const ladderTo = levelCode(p.stageExit);

  return (
    <div className="programme-detail" data-brand={p.brand}>
      {/* Distinct from the brand landing page title (e.g. /women/summit), F-70 */}
      <Seo title={seoTitle} description={seoDescription} jsonLd={courseJsonLd} />

      {/* The breadcrumbs sit on the ink band, joined to the hero below (no light strip between header and hero). */}
      <div className="programme-detail__crumbs-band" data-surface="night">
        <div className="container programme-detail__crumbs">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      {brand ? (
        <BrandHero
          brand={p.brand}
          title={name}
          lede={<Copy p={p} field="summary" lang={lang} />}
          actions={heroActions}
          meta={meta}
          endorsement={p.endorsement ? <Copy p={p} field="endorsement" lang={lang} /> : undefined}
          // AIWO split hero: copy left (cols 1-5), the brand's media slot right, bleeding to the viewport edge.
          sweep={false}
        />
      ) : (
        <PageHero
          eyebrow={t('A StartNet programme', 'ஒரு StartNet திட்டம்')}
          title={name}
          lede={<Copy p={p} field="summary" lang={lang} />}
          actions={heroActions}
          meta={meta}
          titleClass="h1"
        />
      )}

      <Section surface="paper" className="programme-detail__body">
        <div className="programme-detail__layout">
          <div className="programme-detail__aside">
            <div className="programme-detail__sticky" ref={stickyRef}>
              <KeyFacts
                sticky={false}
                title={t('Key facts', 'முக்கிய விவரங்கள்')}
                items={facts}
                action={
                  <div className="programme-detail__aside-actions">
                    {open ? (
                      <Button variant="brand" href={applyHref} full icon={ArrowRight}>
                        {closesLabel(ctaLabel)}
                      </Button>
                    ) : (
                      <Button variant="brand" href={notifyHref} full icon={BellRing}>
                        {notifyLabel}
                      </Button>
                    )}
                    <Button
                      variant="whatsapp"
                      href={waLink(
                        t(`Hi StartNet, I have a question about ${p.title}`, `வணக்கம் StartNet, ${p.title} பற்றி எனக்கு ஒரு கேள்வி உள்ளது`),
                        `programme:${p.slug}`
                      )}
                      full
                    >
                      {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
                    </Button>
                    {!open && (
                      <p className="caption">
                        {p.status === 'upcoming'
                          ? t(
                            'This call opens soon. We will message you when it does, with no account needed.',
                            'இந்த அழைப்பு விரைவில் திறக்கிறது. திறந்ததும் உங்களுக்குச் செய்தி அனுப்புவோம்; கணக்கு எதுவும் தேவையில்லை.'
                          )
                          : t(
                            'This call is closed. We will message you when the next one opens.',
                            'இந்த அழைப்பு முடிந்துவிட்டது. அடுத்தது திறக்கும்போது உங்களுக்குச் செய்தி அனுப்புவோம்.'
                          )}
                      </p>
                    )}
                  </div>
                }
              />
            </div>
          </div>

          <div className="programme-detail__main">
            {/* Who it's for — opens with the programme's headline (the separate Overview band was near-empty and
                repeated "For:" from Key facts, F-70). */}
            {/* "Who it's for" needs a ladder, eligibility or a headline; otherwise it would be a heading on its own. */}
            {(entry > 0 || eligibility.text?.length > 0 || showHeadline) && (
            <section className="programme-detail__block" aria-labelledby="pd-who">
              {showHeadline && (
                // The programme's first lede: scroll-scrubbed word by word (one per page; plain text in SSR, reduced
                // motion and Tamil). Copy with register marks keeps the static RichText rendering.
                typeof headline.text === 'string' && !hasMarks(headline.text) ? (
                  <ScrubText className="programme-detail__statement-text" lang={headline.en ? 'en' : undefined}>
                    {headline.text}
                  </ScrubText>
                ) : (
                  <p className="programme-detail__statement-text" lang={headline.en ? 'en' : undefined}>
                    <RichText text={headline.text} />
                  </p>
                )
              )}
              <p className="eyebrow">{t("Who it's for", 'யாருக்கானது')}</p>
              <h2 id="pd-who" className="h2">
                {entry > 0
                  ? t(
                    `Start at ${ladderFrom} ${levelName(entry)}. Leave at ${ladderTo} ${levelName(exit)}.`,
                    `${ladderFrom} ${levelName(entry, 'ta')} நிலையில் தொடங்கி, ${ladderTo} ${levelName(exit, 'ta')} நிலையில் நிறைவு செய்யுங்கள்.`
                  )
                  : t('Who this programme is for.', 'இந்தத் திட்டம் யாருக்கானது.')}
              </h2>
              {entry > 0 && (
                <div className="programme-detail__ladder">
                  <Ladder
                    variant="compact"
                    from={ladderFrom}
                    to={ladderTo}
                    label={t(
                      `Founder ladder: this programme takes you from ${ladderFrom} to ${ladderTo}`,
                      `நிறுவனர் ஏணி: இந்தத் திட்டம் உங்களை ${ladderFrom}-இலிருந்து ${ladderTo}-க்கு அழைத்துச் செல்கிறது`
                    )}
                  />
                </div>
              )}
              {eligibility.text?.length ? (
                <RevealGroup as="ul" className="programme-detail__checks" lang={eligibility.en ? 'en' : undefined}>
                  {eligibility.text.map((e) => (
                    <li key={e}>
                      <Check size={20} aria-hidden="true" className="programme-detail__check" />
                      <span><RichText text={e} /></span>
                    </li>
                  ))}
                </RevealGroup>
              ) : null /* "Eligibility: [placeholder]" is hidden until StartNet supplies it. */}
            </section>
            )}

            {/* What you get (hidden until the outcomes are supplied) */}
            {outcomes.text?.length > 0 && (
            <section className="programme-detail__block" aria-labelledby="pd-get">
              <p className="eyebrow">{t('What you get', 'உங்களுக்குக் கிடைப்பவை')}</p>
              <h2 id="pd-get" className="h2">
                {t('What you leave with', 'நீங்கள் பெற்றுச் செல்வது')}
                <span className="dot">.</span>
              </h2>
              <RevealGroup as="ol" className="programme-detail__outcomes" lang={outcomes.en ? 'en' : undefined}>
                {outcomes.text.map((o, i) => (
                  <li key={o}>
                    <span className="programme-detail__outcome-num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="body-lg"><RichText text={o} /></span>
                  </li>
                ))}
              </RevealGroup>
            </section>
            )}

            {/* How applying works (Book 1 Part B §9.1) */}
            <section className="programme-detail__block" aria-labelledby="pd-how">
              <p className="eyebrow">{t('How applying works', 'விண்ணப்பிக்கும் முறை')}</p>
              <h2 id="pd-how" className="h2">{t('From application to decision', 'விண்ணப்பம் முதல் முடிவு வரை')}</h2>
              <Steps
                variant="row"
                steps={[
                  {
                    title: t('Apply on StartNet X', 'StartNet X-இல் விண்ணப்பியுங்கள்'),
                    body: t(
                      'Sign in with your phone number or WhatsApp. New here? A free profile takes three short steps.',
                      'உங்கள் கைபேசி எண் அல்லது WhatsApp மூலம் உள்நுழையுங்கள். புதியவரா? இலவச சுயவிவரத்துக்கு மூன்று எளிய படிகள் போதும்.'
                    ),
                  },
                  {
                    title: t('Fill in the application', 'விண்ணப்பத்தை நிரப்புங்கள்'),
                    body: t(
                      'It saves as you go, so a dropped connection does not lose your work.',
                      'நிரப்பும்போதே சேமிக்கப்படும்; இணைப்பு துண்டிக்கப்பட்டாலும் நீங்கள் நிரப்பியவை இழக்கப்படாது.'
                    ),
                  },
                  {
                    title: t('Two or more people review it', 'இருவர் அல்லது அதற்கு மேற்பட்டோர் மதிப்பாய்வு செய்வார்கள்'),
                    body: t(
                      'You hear back within 14 days of the call closing, on screen, on WhatsApp and by email.',
                      'அழைப்பு முடிந்த 14 நாட்களுக்குள் பதில் கிடைக்கும்: திரையில், WhatsApp-இல், மின்னஞ்சலில்.'
                    ),
                  },
                ]}
              />
            </section>

            {/* Mentors and faculty / past-cohort outcomes: hidden until StartNet supplies them (named with consent). */}

            {/* FAQ */}
            <section className="programme-detail__block" aria-labelledby="pd-faq">
              <p className="eyebrow">{t('FAQ', 'அடிக்கடி கேட்கப்படும் கேள்விகள்')}</p>
              <h2 id="pd-faq" className="h2">{t('Questions people ask', 'மக்கள் கேட்கும் கேள்விகள்')}</h2>
              <Accordion items={buildFaq(p, t, lang)} faq />
            </section>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section surface="white" className="programme-detail__related">
          <SectionHeader
            eyebrow={brand ? brand.name : 'StartNet'}
            title={t('Related programmes', 'தொடர்புடைய திட்டங்கள்')}
            action={
              <Button variant="tertiary" to={`/programmes?brand=${p.brand}`}>
                {brand
                  ? t(`See all ${brand.descriptor} programmes`, `எல்லா ${brand.descriptor} திட்டங்களையும் பாருங்கள்`)
                  : t('See all programmes', 'எல்லாத் திட்டங்களையும் பாருங்கள்')}
              </Button>
            }
          />
          <RevealGroup as="ul" className="programme-detail__related-grid">
            {related.map((r) => (
              <li key={r.slug}>
                <ProgrammeCard programme={r} />
              </li>
            ))}
          </RevealGroup>
        </Section>
      )}

      <CTABand
        surface="accent"
        brand={p.brand}
        title={
          open
            ? applyBy
              ? t(`Applications close ${applyBy}`, `விண்ணப்பங்கள் ${applyBy} அன்று முடிகின்றன`)
              : t('Applications are open', 'விண்ணப்பங்கள் திறந்துள்ளன')
            : t('Be first to hear when it opens', 'திறக்கும்போது முதலில் தெரிந்துகொள்ளுங்கள்')
        }
        body={showHeadline && !headline.en ? headline.text : showHeadline ? <span lang="en">{headline.text}</span> : undefined}
        actions={
          <>
            {primaryAction}
            <Button variant="secondary" to="/programmes">
              {t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}
            </Button>
          </>
        }
      />
    </div>
  );
}
