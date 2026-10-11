// /media/kit — Media kit, T19 standard content page (Book 1 Part B §2.2: logos, lock-ups, photos, boilerplate; CTA Download).
// Copy: Book 2 §9 (boilerplate, usage microcopy, contact). Rules: Book 3 §2 logo system, §3.2 colour, §7.4–7.5 imagery, §8.2 naming.
// Layout (Book 3 Part B §4): 8-col prose + in-page nav aside on desktop; the nav collapses on phones.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Check, Download, FileText, Image as ImageIcon, Mail, Palette, Shapes, X as XIcon } from 'lucide-react';
import {
  Seo, PageHero, Section, Button, BrandLockup, Logo, Stat, Reveal, RevealGroup, SmartForm, CTABand, Badge,
} from '../../../components';
import { useLang, contentLangFor } from '../../../lib/i18n.jsx';
import { BOILERPLATE, CopyButton, PRESS_EMAIL } from './shared.jsx';
import './MediaKit.css';

// Book 3 §3.2 core and brand colours; Ink, Red and Paper as revised in the brand book (00-front: Book 3 red #E5322D
// retired for SNX Red #EF4444, Ink #0C1719) and styles/tokens.css, so the printed values match the swatches. Swatches render from tokens (`swatch` when the
// published token name has no CSS variable of its own in styles/tokens.css).
const COLOURS = [
  { name: 'Ink', token: '--sn-ink', hex: '#0C1719', rgb: '12, 23, 25', role: ['Wordmark, text', 'சொல்வடிவம், உரை'] },
  { name: 'StartNet Red', token: '--sn-red', hex: '#EF4444', rgb: '239, 68, 68', role: ['The full stop, primary actions', 'முற்றுப்புள்ளி, முதன்மைச் செயல்கள்'] },
  { name: 'Paper', token: '--sn-paper', hex: '#F4F3EF', rgb: '244, 243, 239', role: ['Day surfaces', 'பகல் பின்புலங்கள்'] },
  { name: 'White', token: '--sn-white', hex: '#FFFFFF', rgb: '255, 255, 255', role: ['Cards, raised surfaces', 'அட்டைகள், உயர்த்திய பரப்புகள்'] },
  { name: 'Research', token: '--sn-research', hex: '#4A3AA7', rgb: '74, 58, 167', role: ['StartNet Research accent', 'StartNet Research நிறம்'], brand: 'research' },
  { name: 'Vibe', token: '--sn-vibe', hex: '#E2581F', rgb: '226, 88, 31', role: ['StartNet Vibe accent', 'StartNet Vibe நிறம்'], brand: 'vibe' },
  { name: 'Connect', token: '--sn-connect', hex: '#0E8F63', rgb: '14, 143, 99', role: ['StartNet Connect accent', 'StartNet Connect நிறம்'], brand: 'connect' },
  { name: 'Women', token: '--sn-women', hex: '#C2386F', rgb: '194, 56, 111', role: ['StartNet Women accent', 'StartNet Women நிறம்'], brand: 'women' },
  { name: 'Ledger Blue', token: '--sn-ledger', swatch: '--ledger-600', hex: '#2A78D6', rgb: '42, 120, 214', role: ['Data and info states only, never in a logo', 'தரவு, தகவல் நிலைகளுக்கு மட்டும்; லோகோவில் ஒருபோதும் இல்லை'] },
];

// Book 3 §8.2 naming hygiene.
const NAMING = [
  { rule: ['Masterbrand', 'தலைமைப் பிராண்ட்'], right: 'StartNet · StartNet. (logo)', wrong: 'Startnet, STARTNET, Start Net' },
  { rule: ['Talent brands', 'திறமைப் பிராண்டுகள்'], right: 'StartNet Research · StartNet Vibe · StartNet Connect · StartNet Women', wrong: 'SN Vibe, StartNetVibe' },
  { rule: ['Products', 'தயாரிப்புகள்'], right: 'Vibe Academy · Connect Circles · Women Circles · StartNet Labs', wrong: 'Vibe Academy by StartNet Vibe' },
  { rule: ['Sector events, labs, flagships', 'துறை நிகழ்வுகள், ஆய்வகங்கள், முதன்மை நிகழ்வுகள்'], right: 'GenAI Connect · Agentic AI Lab · Vibe Summit', wrong: 'Connect GenAI, AI Labs Summit' },
  { rule: ['Endorsed flagship', 'அங்கீகரிக்கப்பட்ட முதன்மை நிகழ்வு'], right: 'Vibathon, a StartNet Vibe programme', wrong: 'Vibethon, StartNet Vibathon' },
  { rule: ['Platform', 'தளம்'], right: 'StartNet X (prose) · SNX (app mark) · SNX Events, SNX Learn', wrong: 'SNX.One, SNXOne, snx.one' },
  { rule: ['Engines', 'சேவை இயந்திரங்கள்'], right: 'Convene · Learn · Insights · Launch · Capital · Access', wrong: '"Research engine"' },
  { rule: ['Spelling', 'எழுத்துக்கூட்டல்'], right: 'Tamil Nadu (two words) · brochure · GCC spelled out on first use', wrong: 'Tamilnadu, broucher' },
  { rule: ['In Tamil text', 'தமிழ் உரையில்'], right: ['Brand and programme names stay in Latin script; descriptors are translated', 'பிராண்ட், திட்டப் பெயர்கள் லத்தீன் எழுத்தில்; விளக்கச் சொற்கள் மட்டும் மொழிபெயர்க்கப்படும்'], wrong: ['Transliterated brand names in headings', 'தலைப்புகளில் ஒலிபெயர்த்த பிராண்ட் பெயர்கள்'] },
];

export default function MediaKit() {
  const { t, lang, localePath } = useLang();
  const boilerplate = lang === 'ta' ? BOILERPLATE.ta : BOILERPLATE.en;

  const sections = useMemo(
    () => [
      { id: 'mkit-boilerplate', label: t('Boilerplate', 'நிறுவன அறிமுகம்') },
      { id: 'mkit-logo', label: t('Logo versions', 'லோகோ வடிவங்கள்') },
      { id: 'mkit-lockups', label: t('Brand lock-ups', 'பிராண்ட் இணைவடிவங்கள்') },
      { id: 'mkit-space', label: t('Clear space and sizes', 'இடைவெளி, அளவுகள்') },
      { id: 'mkit-donts', label: t("Logo don'ts", 'லோகோ தவிர்ப்புகள்') },
      { id: 'mkit-colour', label: t('Colour values', 'வண்ண மதிப்புகள்') },
      { id: 'mkit-naming', label: t('Naming rules', 'பெயரிடல் விதிகள்') },
      { id: 'mkit-photos', label: t('Photos and imagery', 'புகைப்படங்கள், படங்கள்') },
      { id: 'mkit-downloads', label: t('Downloads', 'பதிவிறக்கங்கள்') },
      { id: 'mkit-contact', label: t('Media contact', 'ஊடகத் தொடர்பு') },
    ],
    [t]
  );
  const active = useActiveSection(sections.map((s) => s.id));
  // Collapsed on phones, always open beside the content on desktop (Book 3 Part B §4, T19).
  const tocRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia || !tocRef.current) return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => { if (tocRef.current && mq.matches) tocRef.current.open = true; };
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);
  // Naming rules: a closed disclosure on phones (the table needs a 40rem sideways scroll there), open from 768px.
  const namingRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia || !namingRef.current) return undefined;
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => { if (namingRef.current && mq.matches) namingRef.current.open = true; };
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);
  // Phones and tablets: a way back to the collapsed contents list at the end of every chapter (hidden from 1024px,
  // where the list is a sticky aside). Opens the list and moves focus to it.
  const backToContents = (
    <p className="mkit-top">
      <a
        href="#mkit-toc"
        className="mkit-top__link"
        onClick={(e) => {
          const nav = document.getElementById('mkit-toc');
          if (!nav || !tocRef.current) return;
          e.preventDefault();
          tocRef.current.open = true;
          nav.scrollIntoView({ block: 'start' });
          tocRef.current.querySelector('summary')?.focus({ preventScroll: true });
        }}
      >
        <ArrowUp size={16} aria-hidden="true" /> <span>{t('Back to contents', 'உள்ளடக்கப் பட்டியலுக்குத் திரும்பு')}</span>
      </a>
    </p>
  );

  const donts = [
    t("Don't recolour the full stop in an accent colour, or the wordmark in red.", 'முற்றுப்புள்ளியை பிராண்ட் நிறத்திலோ, சொல்வடிவத்தைச் சிவப்பிலோ மாற்ற வேண்டாம்.'),
    t("Don't put the colour logo on an accent, red or mid-tone photo. Use mono.", 'பிராண்ட் நிறம், சிவப்பு அல்லது நடுத்தொனிப் புகைப்படத்தின் மேல் வண்ண லோகோ வேண்டாம். ஒற்றை நிற லோகோவைப் பயன்படுத்துங்கள்.'),
    t("Don't add a second dot, an outline, a glow, a gradient or a shadow.", 'இரண்டாவது புள்ளி, வெளிக்கோடு, ஒளிவட்டம், சாய்வு நிறம் அல்லது நிழல் சேர்க்க வேண்டாம்.'),
    t('Don\'t type the logo in a live font, or set "StartNet" with a space or as "Startnet"/"STARTNET".', 'லோகோவைச் சாதாரண எழுத்துருவில் தட்டச்சு செய்யவோ, "StartNet"-ஐ இடைவெளியுடனோ "Startnet"/"STARTNET" என்றோ எழுதவோ வேண்டாம்.'),
    t('Don\'t write "SN Vibe", "StartNetVibe" or "StartNet-Vibe".', '"SN Vibe", "StartNetVibe", "StartNet-Vibe" என எழுத வேண்டாம்.'),
    t('Don\'t stack more than one descriptor: write "Vibe Academy" as a label under "StartNet. Vibe".', 'ஒன்றுக்கு மேற்பட்ட விளக்கச் சொல்லை அடுக்க வேண்டாம்: "Vibe Academy"-ஐ "StartNet. Vibe"-க்குக் கீழ் ஒரு குறிப்பாக எழுதுங்கள்.'),
    t("Don't animate the wordmark letters. Only the full stop moves.", 'சொல்வடிவ எழுத்துகளை அசைவூட்ட வேண்டாம். முற்றுப்புள்ளி மட்டுமே அசையும்.'),
    t("Don't place the logo next to a ThinkTN finding, chart or report.", 'ThinkTN கண்டுபிடிப்பு, வரைபடம் அல்லது அறிக்கையின் அருகில் லோகோவை வைக்க வேண்டாம்.'),
    t("Don't use a partner's logo larger than StartNet's on StartNet-owned material, unless the partner is the host.", 'StartNet-இன் சொந்தப் பொருள்களில், கூட்டாளர் நடத்துநராக இல்லாவிட்டால், அவரது லோகோவை StartNet லோகோவைவிடப் பெரிதாகப் பயன்படுத்த வேண்டாம்.'),
    t("Don't use the retired marks (SNX.One, SNXOne, snx.one, the old StartNetVibe marks).", 'ஓய்வுபெற்ற குறிகளை (SNX.One, SNXOne, snx.one, பழைய StartNetVibe குறிகள்) பயன்படுத்த வேண்டாம்.'),
  ];

  const versions = [
    { key: 'primary', name: t('Primary', 'முதன்மை'), spec: t('Ink wordmark, red full stop', 'Ink சொல்வடிவம், சிவப்பு முற்றுப்புள்ளி'), use: t('Paper, white and light photography', 'Paper, வெள்ளை, வெளிர் புகைப்படங்கள்') },
    { key: 'reversed', name: t('Reversed', 'தலைகீழ்'), spec: t('Paper wordmark, red full stop', 'Paper சொல்வடிவம், சிவப்பு முற்றுப்புள்ளி'), use: t('Ink, night surfaces and dark photography', 'Ink, இரவுப் பின்புலங்கள், அடர் புகைப்படங்கள்') },
    { key: 'mono-ink', name: t('Mono Ink', 'ஒற்றை நிறம்: Ink'), spec: t('Ink wordmark and full stop', 'Ink சொல்வடிவம், முற்றுப்புள்ளி'), use: t('Single-colour print, embossing, Vibe or Connect fills', 'ஒற்றை நிற அச்சு, புடைப்பு, Vibe அல்லது Connect பின்னணிகள்') },
    { key: 'mono-white', name: t('Mono White', 'ஒற்றை நிறம்: வெள்ளை'), spec: t('White wordmark and full stop', 'வெள்ளைச் சொல்வடிவம், முற்றுப்புள்ளி'), use: t('Research, Women or Red fills, busy dark photos', 'Research, Women அல்லது சிவப்புப் பின்னணிகள், அடர் புகைப்படங்கள்') },
  ];

  const sizes = [
    [t('Clear space, all lock-ups', 'எல்லா இணைவடிவங்களுக்கும் இடைவெளி'), t('3d on all sides. No text, edge or other logo may enter it.', 'எல்லாப் பக்கங்களிலும் 3d. அதற்குள் உரை, ஓரம், வேறு லோகோ எதுவும் வரக்கூடாது.')],
    [t('Clear space from a page or screen edge', 'பக்கம் அல்லது திரையின் ஓரத்திலிருந்து இடைவெளி'), t('At least 3d or the layout margin, whichever is larger', 'குறைந்தது 3d அல்லது வடிவமைப்பு ஓர இடைவெளி, எது பெரிதோ அது')],
    [t('Minimum width: masterbrand, digital', 'குறைந்தபட்ச அகலம்: தலைமைப் பிராண்ட், டிஜிட்டல்'), '88 px'],
    [t('Minimum width: masterbrand, print', 'குறைந்தபட்ச அகலம்: தலைமைப் பிராண்ட், அச்சு'), '22 mm'],
    [t('Minimum width: brand lock-up, digital', 'குறைந்தபட்ச அகலம்: பிராண்ட் இணைவடிவம், டிஜிட்டல்'), '132 px'],
    [t('Minimum width: brand lock-up, print', 'குறைந்தபட்ச அகலம்: பிராண்ட் இணைவடிவம், அச்சு'), '32 mm'],
    [t('Below minimum', 'குறைந்தபட்சத்துக்குக் கீழ்'), t('Use the monogram "S.", or set the brand name as text', '"S." ஒற்றைக்குறியைப் பயன்படுத்துங்கள், அல்லது பிராண்ட் பெயரை உரையாக எழுதுங்கள்')],
  ];

  const downloadBoilerplate = () =>
    saveFile(
      'startnet-boilerplate.txt',
      `About StartNet\n\n${BOILERPLATE.en}\n\nStartNet பற்றி (தமிழ் வரைவு, தாய்மொழி ஆசிரியர் மதிப்பாய்வுக்கு உட்பட்டது)\n\n${BOILERPLATE.ta}\n\nMedia contact: ${PRESS_EMAIL}\n`,
      'text/plain;charset=utf-8'
    );
  const downloadColours = () =>
    saveFile(
      'startnet-colours.json',
      JSON.stringify(
        {
          source: 'StartNet brand guidelines, colour specification',
          note: 'Screen values. Pantone and press CMYK to be confirmed after proofing by StartNet print partner.',
          colours: COLOURS.map(({ name, token, hex, rgb }) => ({ name, token, hex, rgb })),
        },
        null,
        2
      ),
      'application/json'
    );

  const assets = [
    { icon: Shapes, title: t('Masterbrand logo', 'தலைமைப் பிராண்ட் லோகோ'), body: t('Primary, reversed and mono, as vector and PNG.', 'முதன்மை, தலைகீழ், ஒற்றை நிறம்; vector, PNG வடிவங்களில்.'), file: 'SVG · PNG' },
    { icon: Shapes, title: t('Brand lock-ups', 'பிராண்ட் இணைவடிவங்கள்'), body: t('StartNet. Research, Vibe, Connect, Women and X, light and dark.', 'StartNet. Research, Vibe, Connect, Women, X; வெளிர், அடர் வடிவங்களில்.'), file: 'SVG · PNG' },
    { icon: Shapes, title: t('Monogram and icons', 'ஒற்றைக்குறி, ஐகான்கள்'), body: t('"S." monogram for avatars and small spaces.', 'சுயவிவரப் படங்கள், சிறிய இடங்களுக்கான "S." ஒற்றைக்குறி.'), file: 'SVG · PNG' },
    { icon: ImageIcon, title: t('Approved photos', 'அங்கீகரிக்கப்பட்ட புகைப்படங்கள்'), body: t('Captioned, credited, with consent recorded.', 'தலைப்பு, புகைப்படக் கலைஞர் பெயர், பதிவுசெய்த ஒப்புதலுடன்.'), file: 'JPG' },
    { icon: FileText, title: t('Fact sheet', 'உண்மைத் தாள்'), body: t('Sourced, tagged figures you can quote.', 'மேற்கோள் காட்டக்கூடிய, ஆதாரமும் குறிச்சொல்லும் உள்ள எண்ணிக்கைகள்.'), file: 'PDF' },
  ];

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('StartNet media kit: logos, brand rules, boilerplate', 'StartNet ஊடகத் தொகுப்பு: லோகோக்கள், விதிகள்')}
        description={t(
          'StartNet logos, brand lock-ups, colour values, naming rules, boilerplate and the media contact, with the rules for using them.',
          'StartNet லோகோக்கள், பிராண்ட் இணைவடிவங்கள், வண்ண மதிப்புகள், பெயரிடல் விதிகள், நிறுவன அறிமுகம், ஊடகத் தொடர்பு, பயன்படுத்தும் விதிகளுடன்.'
        )}
      />

      <PageHero
        eyebrow={t('Media', 'ஊடகம்')}
        title={t('Media kit.', 'ஊடகத் தொகுப்பு.')}
        lede={t(
          'Logos, lock-ups, colours, naming rules and copy-ready boilerplate. Use them as they are: the rules below keep StartNet looking like one organisation everywhere.',
          'லோகோக்கள், இணைவடிவங்கள், வண்ணங்கள், பெயரிடல் விதிகள், நகலெடுக்கத் தயாரான நிறுவன அறிமுகம். இவற்றை உள்ளபடியே பயன்படுத்துங்கள்: கீழுள்ள விதிகள் StartNet எங்கும் ஒரே அமைப்பாகத் தோன்ற உதவுகின்றன.'
        )}
        breadcrumbs={[{ label: t('Media', 'ஊடகம்'), to: '/media' }, { label: t('Media kit', 'ஊடகத் தொகுப்பு') }]}
        actions={
          <>
            <Button href="#mkit-downloads" size="lg" icon={Download}>{t('Downloads', 'பதிவிறக்கங்கள்')}</Button>
            <Button href={`mailto:${PRESS_EMAIL}`} variant="tertiary" size="lg" icon={Mail}>{t('Email the press team', 'ஊடகக் குழுவுக்கு மின்னஞ்சல்')}</Button>
          </>
        }
      />

      <Section surface="paper" pad="sm" className="mkit">
        <div className="mkit__layout">
          {/* In-page nav: sticky aside on desktop, collapsible on phones (Book 3 Part B §4, T19) */}
          <nav className="mkit-toc" id="mkit-toc" aria-label={t('On this page', 'இந்தப் பக்கத்தில்')}>
            <details className="mkit-toc__details" ref={tocRef}>
              <summary className="mkit-toc__summary">{t('On this page', 'இந்தப் பக்கத்தில்')}</summary>
              <ol className="mkit-toc__list">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="mkit-toc__link" aria-current={active === s.id ? 'true' : undefined}>{s.label}</a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>

          <div className="mkit__main">
            {/* Boilerplate */}
            <section id="mkit-boilerplate" className="mkit-block" aria-labelledby="mkit-boilerplate-h">
              <Reveal>
                <p className="eyebrow">{t('Boilerplate', 'நிறுவன அறிமுகம்')}</p>
                <h2 id="mkit-boilerplate-h" className="h3">{t('About StartNet, copy-ready', 'StartNet பற்றி, நகலெடுக்கத் தயார்')}</h2>
                <blockquote className="mkit-boiler body-lg" id="mkit-boilerplate-text" lang={lang === 'ta' ? 'ta' : 'en'}>
                  {boilerplate}
                </blockquote>
                {/* The "[Tamil draft — subject to native editor review]" register note is not shown to visitors. */}
                <div className="mkit-boiler__actions">
                  <CopyButton
                    text={boilerplate}
                    label={t('Copy boilerplate', 'நகலெடுக்கவும்')}
                    doneLabel={t('Boilerplate copied', 'நகலெடுக்கப்பட்டது')}
                    describedBy="mkit-boilerplate-text"
                  />
                  <CopyButton text="Every talent, a founder." label={t('Copy tagline', 'முழக்கத்தை நகலெடுக்கவும்')} />
                </div>
                <div className="mkit-boiler__stat">
                  <Stat
                    variant="compact"
                    value={100000}
                    label={t(
                      'founders nurtured in Tamil Nadu by March 2031, as quoted in the boilerplate: a planning target',
                      'மார்ச் 2031-க்குள் தமிழ்நாட்டில் உருவாக்கப்படும் நிறுவனர்கள் (நிறுவன அறிமுகத்தில் உள்ளபடி): ஒரு திட்ட இலக்கு'
                    )}
                    tag="C"
                    source={t('StartNet plan, Mission 1 Lakh', 'StartNet திட்டம், Mission 1 Lakh')}
                    note={t('Please report it as a target, not an outcome.', 'இதை ஒரு இலக்காகவே குறிப்பிடுங்கள், விளைவாக அல்ல.')}
                  />
                </div>
              </Reveal>
              {backToContents}
            </section>

            {/* Logo versions */}
            <section id="mkit-logo" className="mkit-block" aria-labelledby="mkit-logo-h">
              <p className="eyebrow">{t('Logo', 'லோகோ')}</p>
              <h2 id="mkit-logo-h" className="h3">{t('Four versions of one mark', 'ஒரே குறியின் நான்கு வடிவங்கள்')}</h2>
              <p className="mkit-lede">
                {t(
                  '"StartNet" is one word with a capital S and N, ending in a red full stop. On any brand-colour background, use the mono logo: the red full stop disappears against the accents.',
                  '"StartNet" என்பது பெரிய S, N கொண்ட ஒரே சொல்; சிவப்பு முற்றுப்புள்ளியில் முடிகிறது. பிராண்ட் நிறப் பின்னணியில் ஒற்றை நிற லோகோவைப் பயன்படுத்துங்கள்: அந்த நிறங்களில் சிவப்புப் புள்ளி தெரியாது.'
                )}
              </p>
              <RevealGroup as="ul" className="mkit-versions">
                {versions.map((v) => (
                  <li key={v.key} className="mkit-version">
                    <div className={`mkit-version__tile mkit-version__tile--${v.key}`} data-surface={v.key === 'reversed' ? 'night' : undefined}>
                      <Logo size="lg" reversed={v.key === 'reversed'} mono={v.key.startsWith('mono')} />
                    </div>
                    <div className="mkit-version__text">
                      <h3 className="h5">{v.name}</h3>
                      <p className="mkit-version__spec">{v.spec}</p>
                      <p className="mkit-version__use"><span className="mkit-k">{t('Use on', 'பயன்பாடு')}</span> {v.use}</p>
                    </div>
                  </li>
                ))}
              </RevealGroup>
              {/* "Master vector logo files [placeholder]" is hidden until the files are supplied. */}
              {backToContents}
            </section>

            {/* Lock-ups */}
            <section id="mkit-lockups" className="mkit-block" aria-labelledby="mkit-lockups-h">
              <p className="eyebrow">{t('Brand lock-ups', 'பிராண்ட் இணைவடிவங்கள்')}</p>
              <h2 id="mkit-lockups-h" className="h3">{t('Wordmark, full stop, descriptor', 'சொல்வடிவம், முற்றுப்புள்ளி, விளக்கச் சொல்')}</h2>
              <p className="mkit-lede">
                {t(
                  'The descriptor follows the full stop with no separator, slash or second dot. Programmes such as Vibe Academy or Women Circles have no logo: set them as text labels. Vibathon is the only programme with its own wordmark, always with the line "a StartNet Vibe programme".',
                  'விளக்கச் சொல் முற்றுப்புள்ளிக்குப் பின் பிரிகோடு, சாய்கோடு, இரண்டாவது புள்ளி இன்றி வருகிறது. Vibe Academy, Women Circles போன்ற திட்டங்களுக்கு லோகோ இல்லை: அவற்றை உரைக் குறிப்புகளாக எழுதுங்கள். தனிச் சொல்வடிவம் உள்ள ஒரே திட்டம் Vibathon; அதனுடன் எப்போதும் "a StartNet Vibe programme" என்ற வரி இருக்கும்.'
                )}
              </p>
              <RevealGroup className="mkit-lockups">
                {[null, 'research', 'vibe', 'connect', 'women', 'x'].map((b) => (
                  <div key={b || 'master'} className="mkit-lockup">
                    <div className="mkit-lockup__tile"><BrandLockup brand={b} size="sm" /></div>
                    <div className="mkit-lockup__tile mkit-lockup__tile--dark" data-surface="night"><BrandLockup brand={b} size="sm" reversed /></div>
                  </div>
                ))}
              </RevealGroup>
              <p className="mkit-note">
                {t(
                  'The logo stays in Latin script on Tamil pages and materials, so the mark is the same everywhere.',
                  'தமிழ்ப் பக்கங்களிலும் பொருள்களிலும் லோகோ லத்தீன் எழுத்திலேயே இருக்கும்; அதனால் குறி எங்கும் ஒன்றாக இருக்கும்.'
                )}
              </p>
              {backToContents}
            </section>

            {/* Clear space and sizes */}
            <section id="mkit-space" className="mkit-block" aria-labelledby="mkit-space-h">
              <p className="eyebrow">{t('Clear space and sizes', 'இடைவெளி, அளவுகள்')}</p>
              <h2 id="mkit-space-h" className="h3">{t('Give the mark room to land', 'குறிக்குப் போதுமான இடம் கொடுங்கள்')}</h2>
              <div className="mkit-space">
                <figure className="mkit-space__figure">
                  <div className="mkit-space__demo" aria-hidden="true">
                    <span className="mkit-space__zone"><Logo size="lg" /></span>
                  </div>
                  <figcaption className="caption">
                    {t(
                      'd is the diameter of the full stop. Keep 3d clear on every side.',
                      'd என்பது முற்றுப்புள்ளியின் விட்டம். எல்லாப் பக்கங்களிலும் 3d இடைவெளி விடுங்கள்.'
                    )}
                  </figcaption>
                </figure>
                <div className="mkit-table-wrap" role="region" aria-labelledby="mkit-space-h" tabIndex={0}>
                  <table className="mkit-table">
                    <thead>
                      <tr><th scope="col">{t('Item', 'உருப்படி')}</th><th scope="col">{t('Rule', 'விதி')}</th></tr>
                    </thead>
                    <tbody>
                      {sizes.map(([item, rule]) => (
                        <tr key={item}><th scope="row">{item}</th><td className="tnum">{rule}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {backToContents}
            </section>

            {/* Don'ts */}
            <section id="mkit-donts" className="mkit-block" aria-labelledby="mkit-donts-h">
              <p className="eyebrow">{t("Logo don'ts", 'லோகோ தவிர்ப்புகள்')}</p>
              <h2 id="mkit-donts-h" className="h3">{t('Ten things to avoid', 'தவிர்க்க வேண்டிய பத்து')}</h2>
              <p className="mkit-lede">
                {t(
                  "Please don't recolour the red full stop or combine brand accents. Write StartNet as one word, capital S and N.",
                  'சிவப்பு முற்றுப்புள்ளியின் நிறத்தை மாற்றவோ, பிராண்ட் நிறங்களைக் கலக்கவோ வேண்டாம். StartNet-ஐ பெரிய S, N உடன் ஒரே சொல்லாக எழுதுங்கள்.'
                )}
              </p>
              <ol className="mkit-donts">
                {donts.map((d, i) => (
                  <li key={i} className="mkit-dont">
                    <XIcon size={18} aria-hidden="true" className="mkit-dont__icon" />
                    <span>{d}</span>
                  </li>
                ))}
              </ol>
              <p className="mkit-note">
                {t('Co-branding with a partner or government department?', 'கூட்டாளர் அல்லது அரசுத் துறையுடன் இணைந்த பிராண்டிங்கா?')}{' '}
                {t(
                  'Partner logos appear only when the agreement is signed, and government marks follow the department’s own guidelines. Ask the press team before you set a joint lock-up.',
                  'ஒப்பந்தம் கையெழுத்தான பிறகே கூட்டாளர் லோகோக்கள் இடம்பெறும்; அரசுக் குறிகள் அந்தத் துறையின் வழிகாட்டுதல்களைப் பின்பற்றும். இணை வடிவமைப்புக்கு முன் ஊடகக் குழுவிடம் கேளுங்கள்.'
                )}
              </p>
              {backToContents}
            </section>

            {/* Colour */}
            <section id="mkit-colour" className="mkit-block" aria-labelledby="mkit-colour-h">
              <p className="eyebrow">{t('Colour values', 'வண்ண மதிப்புகள்')}</p>
              <h2 id="mkit-colour-h" className="h3">{t('One red, four accents', 'ஒரு சிவப்பு, நான்கு பிராண்ட் நிறங்கள்')}</h2>
              <p className="mkit-lede">
                {t(
                  'Ink, Red, Paper and White carry most of every surface. Each talent brand has one accent; use one accent per asset and never combine them.',
                  'Ink, Red, Paper, White ஆகியவை ஒவ்வொரு பரப்பின் பெரும்பகுதியை நிரப்புகின்றன. ஒவ்வொரு திறமைப் பிராண்டுக்கும் ஒரு நிறம்; ஒரு வடிவமைப்பில் ஒரே நிறத்தைப் பயன்படுத்துங்கள், அவற்றைக் கலக்க வேண்டாம்.'
                )}
              </p>
              <ul className="mkit-colours" role="list">
                {COLOURS.map((c) => (
                  <li key={c.token} className="mkit-colour" data-brand={c.brand}>
                    <span className="mkit-colour__swatch" style={{ background: `var(${c.swatch || c.token}, ${c.hex})` }} aria-hidden="true" />
                    <div className="mkit-colour__body">
                      <p className="mkit-colour__name">{c.name}</p>
                      <p className="mkit-colour__role">{t(c.role[0], c.role[1])}</p>
                      <dl className="mkit-colour__values">
                        <div><dt>HEX</dt><dd><code>{c.hex}</code></dd></div>
                        <div><dt>RGB</dt><dd><code>{c.rgb}</code></dd></div>
                      </dl>
                      <CopyButton text={c.hex} label={t(`Copy ${c.hex}`, `${c.hex} நகலெடுக்கவும்`)} className="mkit-colour__copy" />
                    </div>
                  </li>
                ))}
              </ul>
              {/* "Pantone and press CMYK values [placeholder]" is hidden until confirmed after proofing. */}
              {backToContents}
            </section>

            {/* Naming */}
            <section id="mkit-naming" className="mkit-block" aria-labelledby="mkit-naming-h">
              <p className="eyebrow">{t('Naming rules', 'பெயரிடல் விதிகள்')}</p>
              <h2 id="mkit-naming-h" className="h3">{t('Write our names the way we do', 'எங்கள் பெயர்களை நாங்கள் எழுதுவது போலவே எழுதுங்கள்')}</h2>
              <details className="mkit-naming__details" ref={namingRef}>
                <summary className="mkit-naming__summary">
                  {t(`${NAMING.length} rules, with the correct and wrong forms`, `சரியான, தவறான வடிவங்களுடன் ${NAMING.length} விதிகள்`)}
                </summary>
              <div className="mkit-table-wrap" role="region" aria-labelledby="mkit-naming-h" tabIndex={0}>
                <table className="mkit-table mkit-table--naming">
                  <thead>
                    <tr>
                      <th scope="col">{t('Rule', 'விதி')}</th>
                      <th scope="col"><Check size={14} aria-hidden="true" /> {t('Correct', 'சரி')}</th>
                      <th scope="col"><XIcon size={14} aria-hidden="true" /> {t('Wrong', 'தவறு')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NAMING.map((n) => (
                      <tr key={n.rule[0]}>
                        <th scope="row">{t(n.rule[0], n.rule[1])}</th>
                        <td className="mkit-table__right" lang={Array.isArray(n.right) ? undefined : contentLangFor(lang, n.right)}>{Array.isArray(n.right) ? t(n.right[0], n.right[1]) : n.right}</td>
                        <td className="mkit-table__wrong" lang={Array.isArray(n.wrong) ? undefined : contentLangFor(lang, n.wrong)}>{Array.isArray(n.wrong) ? t(n.wrong[0], n.wrong[1]) : n.wrong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </details>
              {backToContents}
            </section>

            {/* Photos and imagery */}
            <section id="mkit-photos" className="mkit-block" aria-labelledby="mkit-photos-h">
              <p className="eyebrow">{t('Photos and imagery', 'புகைப்படங்கள், படங்கள்')}</p>
              <h2 id="mkit-photos-h" className="h3">{t('Real people, recorded consent', 'உண்மையான மனிதர்கள், பதிவுசெய்த ஒப்புதல்')}</h2>
              {/* "Approved photos … [placeholder — photo library]" is hidden until the photo library is supplied. */}
              <ul className="mkit-rules" role="list">
                <li><Check size={18} aria-hidden="true" /> {t('Use each photo with its caption and credit, as supplied.', 'ஒவ்வொரு புகைப்படத்தையும் வழங்கப்பட்ட தலைப்பு, பெயருடன் பயன்படுத்துங்கள்.')}</li>
                <li><Check size={18} aria-hidden="true" /> {t('Every identifiable person in an approved photo has given consent for that use.', 'அங்கீகரிக்கப்பட்ட புகைப்படத்தில் அடையாளம் காணக்கூடிய ஒவ்வொருவரும் அந்தப் பயன்பாட்டுக்கு ஒப்புதல் அளித்துள்ளனர்.')}</li>
                <li><XIcon size={18} aria-hidden="true" /> {t('Never caption a minor with their full name, school and district together.', 'சிறார்களின் முழுப் பெயர், பள்ளி, மாவட்டம் மூன்றையும் சேர்த்து ஒருபோதும் தலைப்பிட வேண்டாம்.')}</li>
                <li><XIcon size={18} aria-hidden="true" /> {t('No AI-generated or AI-altered images of real people, places or events, and nothing generated used as evidence.', 'உண்மையான மனிதர்கள், இடங்கள், நிகழ்வுகளின் AI உருவாக்கிய அல்லது AI மாற்றிய படங்கள் வேண்டாம்; உருவாக்கப்பட்ட எதையும் ஆதாரமாகப் பயன்படுத்த வேண்டாம்.')}</li>
              </ul>
              <div className="mkit-takedown">
                <Stat
                  variant="compact"
                  value={5}
                  unit={t(' working days', ' வேலை நாள்கள்')}
                  label={t('target to act on a request to remove an image', 'ஒரு படத்தை நீக்கும் கோரிக்கையின் மீது நடவடிக்கை எடுக்கும் இலக்கு')}
                  tag="C"
                  source={t('StartNet brand guidelines, consent and rights', 'StartNet பிராண்ட் வழிகாட்டுதல்கள், ஒப்புதல், உரிமைகள்')}
                  note={t('A target, not a reported figure.', 'இது ஓர் இலக்கு, அறிக்கையிடப்பட்ட எண் அல்ல.')}
                />
                <p className="mkit-takedown__text">
                  {t('Want your image removed?', 'உங்கள் படம் நீக்கப்பட வேண்டுமா?')}{' '}
                  <Link to={localePath('/contact')}>{t('Ask through the Contact page', 'தொடர்புப் பக்கம் வழியாகக் கேளுங்கள்')}</Link>.
                </p>
              </div>
              {backToContents}
            </section>

            {/* Downloads */}
            <section id="mkit-downloads" className="mkit-block" aria-labelledby="mkit-downloads-h">
              <p className="eyebrow">{t('Downloads', 'பதிவிறக்கங்கள்')}</p>
              <h2 id="mkit-downloads-h" className="h3">{t('Files for press use', 'ஊடகப் பயன்பாட்டுக்கான கோப்புகள்')}</h2>
              <div className="mkit-dl-now">
                <button type="button" className="mkit-dl" onClick={downloadBoilerplate}>
                  <FileText size={22} aria-hidden="true" className="mkit-dl__icon" />
                  <span className="mkit-dl__text">
                    <span className="mkit-dl__title">{t('Boilerplate', 'நிறுவன அறிமுகம்')}</span>
                    <span className="mkit-dl__meta">TXT · {t('English and Tamil draft', 'ஆங்கிலம், தமிழ் வரைவு')}</span>
                  </span>
                  <Download size={18} aria-hidden="true" className="mkit-dl__arrow" />
                </button>
                <button type="button" className="mkit-dl" onClick={downloadColours}>
                  <Palette size={22} aria-hidden="true" className="mkit-dl__icon" />
                  <span className="mkit-dl__text">
                    <span className="mkit-dl__title">{t('Colour values', 'வண்ண மதிப்புகள்')}</span>
                    <span className="mkit-dl__meta">JSON · HEX, RGB</span>
                  </span>
                  <Download size={18} aria-hidden="true" className="mkit-dl__arrow" />
                </button>
              </div>
              <RevealGroup as="ul" className="mkit-assets">
                {assets.map((a) => {
                  const Icon = a.icon;
                  return (
                    <li key={a.title} className="mkit-asset">
                      <Icon size={22} aria-hidden="true" className="mkit-asset__icon" />
                      <div className="mkit-asset__body">
                        <h3 className="h6 mkit-asset__title">{a.title}</h3>
                        <p className="mkit-asset__desc">{a.body}</p>
                        <p className="mkit-asset__meta">
                          <Badge kind="type">{a.file}</Badge>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </RevealGroup>
              <div className="mkit-dl-all">
                <Button disabled icon={Download}>{t('Download media kit (ZIP)', 'ஊடகத் தொகுப்பைப் பதிவிறக்கவும் (ZIP)')}</Button>
                <Button to="/media#fact-sheet" variant="tertiary">{t('See the fact sheet', 'உண்மைத் தாளைப் பாருங்கள்')}</Button>
              </div>
              {backToContents}
            </section>
          </div>
        </div>
      </Section>

      {/* Media contact + enquiry form */}
      <Section surface="white" id="mkit-contact" labelledBy="mkit-contact-h">
        <div className="mkit-contact">
          <div className="mkit-contact__card">
            <p className="eyebrow">{t('Media contact', 'ஊடகத் தொடர்பு')}</p>
            <h2 id="mkit-contact-h" className="h3">{t('Talk to the press team', 'ஊடகக் குழுவிடம் பேசுங்கள்')}</h2>
            <ul role="list" className="mkit-contact__list">
              {/* Contact name and phone are hidden until supplied. press@startnet.in is confirmed. */}
              <li>
                <Mail size={18} aria-hidden="true" /> <a href={`mailto:${PRESS_EMAIL}`}>{PRESS_EMAIL}</a>
              </li>
            </ul>
            <p className="mkit-contact__note">
              {t(
                "If a figure isn't on our fact sheet with a source, please don't attribute it to us.",
                'எங்கள் உண்மைத் தாளில் ஆதாரத்துடன் இல்லாத எண்ணை எங்களுடையதாகக் குறிப்பிட வேண்டாம்.'
              )}{' '}
              <Link to={localePath('/about/evidence-standard')} className="mkit-inline-link">
                {t('How we tag figures', 'எண்களை நாங்கள் எப்படிக் குறியிடுகிறோம்')} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </p>
            <Button href={`mailto:${PRESS_EMAIL}`} icon={Mail}>{t('Email the press team', 'ஊடகக் குழுவுக்கு மின்னஞ்சல்')}</Button>
          </div>
          <div className="mkit-contact__form">
            <h3 className="h4">{t('Ask for an asset or an interview', 'கோப்பு அல்லது நேர்காணல் கேளுங்கள்')}</h3>
            <SmartForm
              type="contact"
              hidden={{ topic: 'Media kit request', source: 'media-kit' }}
              fields={[
                { name: 'name', label: t('Your name', 'உங்கள் பெயர்'), required: true, autoComplete: 'name' },
                { name: 'email', label: t('Work email', 'பணி மின்னஞ்சல்'), type: 'email', required: true, autoComplete: 'email' },
                { name: 'organisation', label: t('Publication or organisation', 'இதழ் அல்லது அமைப்பு'), autoComplete: 'organization' },
                {
                  name: 'message',
                  label: t('What do you need, and by when?', 'உங்களுக்கு என்ன தேவை, எப்போதுக்குள்?'),
                  type: 'textarea',
                  required: true,
                },
              ]}
              consents={[
                {
                  purpose: 'contact',
                  label: t('StartNet may contact me about this request.', 'இந்தக் கோரிக்கை குறித்து StartNet என்னைத் தொடர்புகொள்ளலாம்.'),
                  required: true,
                },
              ]}
              submitLabel={t('Send request', 'கோரிக்கையை அனுப்பவும்')}
              successTitle={t('Request sent.', 'கோரிக்கை அனுப்பப்பட்டது.')}
              successBody={t('The press team will reply by email.', 'ஊடகக் குழு மின்னஞ்சலில் பதிலளிக்கும்.')}
            />
          </div>
        </div>
      </Section>

      <CTABand surface="night"
        title={t('Looking for the latest news?', 'சமீபத்திய செய்திகளைத் தேடுகிறீர்களா?')}
        body={t('Press releases, coverage and sourced facts are in the media centre.', 'செய்திக் குறிப்புகள், ஊடகச் செய்திகள், ஆதாரமுள்ள தகவல்கள் ஊடக மையத்தில் உள்ளன.')}
        actions={
          <>
            <Button to="/media">{t('Media centre', 'ஊடக மையம்')}</Button>
            <Button to="/insights/founder-ledger" variant="secondary">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}

/** Highlights the in-page nav entry for the section nearest the top of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}

/** Client-side file save for text the page already holds (no network). */
function saveFile(name, text, type) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { /* downloads blocked: content stays on the page */ }
}
