import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Seo, Breadcrumbs, Dot, Button } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import NotFound from './LazyNotFound.jsx';
import { localiseMark } from '../../components/Placeholder.jsx';
import { cleanMarks, isPlaceholderAnswer } from '../../components/_placeholders.js';
import { useShell, useMediaQuery } from '../../layout/shell.jsx';
import { LEGAL, LEGAL_ORDER, LEGAL_VERSION, getLegal } from './legalContent.js';
import { TABLE_LABELS, legalTitle, localiseLegal } from './legalContent.ta.js';
import './Legal.css';

/** A block that is only a placeholder (string, or a list whose every item is one). Tables and links always count. */
const isPhBlock = (b) =>
  (typeof b === 'string' && isPlaceholderAnswer(b)) || (!!b && Array.isArray(b.list) && b.list.every((li) => isPlaceholderAnswer(li)));

// SEO per notice: [title EN, title TA, description EN, description TA]. Every description restates the notice's own
// summary and section headings (legalContent.js); nothing new. SEO-TA: pending native review.
const LEGAL_SEO = {
  privacy: [
    'Privacy notice: DPDP Act 2023',
    'தனியுரிமை அறிவிப்பு: DPDP சட்டம் 2023',
    'How StartNet collects, uses and protects your personal data under the Digital Personal Data Protection Act, 2023, and how to withdraw consent.',
    'DPDP சட்டம், 2023-இன் கீழ் StartNet உங்கள் தனிப்பட்ட தரவை எவ்வாறு சேகரிக்கிறது, பயன்படுத்துகிறது, பாதுகாக்கிறது; ஒப்புதலைத் திரும்பப் பெறுவது எப்படி.',
  ],
  terms: [
    'Terms of use for startnet.in',
    'startnet.in பயன்பாட்டு விதிமுறைகள்',
    'The terms that apply when you use startnet.in: figures and corrections, our name and marks, no offer of securities, liability, governing law and disputes.',
    'startnet.in-ஐப் பயன்படுத்தும்போது பொருந்தும் விதிமுறைகள்: எண்களும் திருத்தங்களும், எங்கள் பெயரும் முத்திரைகளும், பொறுப்பு, ஆளும் சட்டம், தகராறுகள்.',
  ],
  cookies: [
    'Cookie notice',
    'குக்கீ அறிவிப்பு',
    'Which cookies startnet.in uses and why: cookie categories, how the consent banner works, the language cookie, and how to change your choice at any time.',
    'startnet.in எந்தக் குக்கீகளைப் பயன்படுத்துகிறது, ஏன்: குக்கீ வகைகள், ஒப்புதல் பதாகை, மொழிக் குக்கீ, உங்கள் தேர்வை எப்போது வேண்டுமானாலும் மாற்றுவது.',
  ],
  'data-rights': [
    'Your data rights at StartNet',
    'StartNet-இல் உங்கள் தரவு உரிமைகள்',
    'How to access, correct, erase or withdraw consent for your personal data held by StartNet, and how to exercise each of these rights.',
    'StartNet வைத்திருக்கும் உங்கள் தனிப்பட்ட தரவை அணுகுவது, திருத்துவது, அழிப்பது அல்லது அதற்கான ஒப்புதலைத் திரும்பப் பெறுவது எப்படி.',
  ],
  grievance: [
    'Grievance officer for data protection',
    'தரவுப் பாதுகாப்புக் குறைதீர்ப்பு அலுவலர்',
    'Contact details of the StartNet Grievance officer for data protection complaints, and what to do if you are not satisfied with the reply.',
    'தரவுப் பாதுகாப்புப் புகார்களுக்கான StartNet குறைதீர்ப்பு அலுவலரின் தொடர்பு விவரங்கள், பதிலில் திருப்தி இல்லையெனில் என்ன செய்வது.',
  ],
  safeguarding: [
    'Child safeguarding and parental consent',
    'குழந்தைப் பாதுகாப்பும் பெற்றோர் ஒப்புதலும்',
    'How StartNet protects participants under 18: parental consent, what we never publish, and how young people are kept safe at events.',
    '18 வயதுக்குட்பட்ட பங்கேற்பாளர்களை StartNet எவ்வாறு பாதுகாக்கிறது: பெற்றோர் ஒப்புதல், நாங்கள் ஒருபோதும் வெளியிடாதவை, நிகழ்வுகளில் பாதுகாப்பு.',
  ],
  accessibility: [
    'Accessibility statement',
    'அணுகல்தன்மை அறிக்கை',
    'StartNet’s accessibility commitment for startnet.in: the standard we work to, known issues, and how to report a barrier you meet on the site.',
    'startnet.in-க்கான StartNet-இன் அணுகல்தன்மை உறுதிமொழி: நாங்கள் பின்பற்றும் தரநிலை, அறியப்பட்ட சிக்கல்கள், தடையைத் தெரிவிக்கும் வழி.',
  ],
  refunds: [
    'Refunds and cancellations',
    'பணத்திருப்பமும் ரத்தும்',
    'How refunds and cancellations work for StartNet event tickets, programme fees and StartNet X plans, and what happens if a payment fails or is pending.',
    'StartNet நிகழ்வு நுழைவுச்சீட்டுகள், திட்டக் கட்டணங்கள், StartNet X திட்டங்களுக்கான பணத்திருப்பமும் ரத்தும்; பணம் செலுத்துதல் தோல்வியுற்றால் என்ன ஆகும்.',
  ],
  'code-of-conduct': [
    'Code of conduct for StartNet events',
    'StartNet நிகழ்வுகளுக்கான நடத்தை விதிமுறை',
    'The code of conduct for StartNet events, programmes, Circles and online spaces: what we expect, how harassment is handled, and how to report it.',
    'StartNet நிகழ்வுகள், திட்டங்கள், Circles, இணைய வெளிகளுக்கான நடத்தை விதிமுறை: எதிர்பார்ப்புகள், துன்புறுத்தல், புகார் அளிக்கும் வழி.',
  ],
  'sponsorship-terms': [
    'Sponsorship and CSR funder terms',
    'ஸ்பான்சர், CSR நிதியளிப்பாளர் விதிமுறைகள்',
    'Terms that apply to StartNet sponsors and CSR funders: the rules every sponsorship follows, and the commercial terms that go with them.',
    'StartNet ஸ்பான்சர்களுக்கும் CSR நிதியளிப்பவர்களுக்கும் பொருந்தும் விதிமுறைகள்: ஒவ்வொரு ஸ்பான்சர்ஷிப்பும் பின்பற்றும் விதிகள், வணிக விதிமுறைகள்.',
  ],
};

// /legal/:slug — T17: title, effective date, version → contents → body → change log.
export default function Legal() {
  const { slug } = useParams();
  const { lang } = useLang();
  // Own keys only: /legal/constructor or /legal/__proto__ must 404, not crash on Object.prototype.
  const en = getLegal(slug);
  if (!en) return <NotFound />;
  const page = lang === 'ta' ? localiseLegal(slug, en) : en;
  return <LegalPage key={slug} slug={slug} page={page} />;
}

/**
 * Wrap "[placeholder …]" / "[confirm]" fragments in the visible placeholder marker. Marks the sentence reads
 * correctly without are left out (cleanMarks); marks that stand in for a word stay visible.
 */
function P({ text }) {
  const { lang } = useLang();
  const parts = cleanMarks(String(text)).split(/(\[[^\]]+\])/g);
  // On /ta the marks read in Tamil ("[placeholder]" -> "[இடநிரப்பி]"), as the kit Placeholder does elsewhere.
  return parts.map((p, i) => (p.startsWith('[') ? <span key={i} className="placeholder">{localiseMark(p, lang)}</span> : p));
}

function Block({ block, labelledBy, tableLabel }) {
  const { localePath } = useLang();
  // Below 600px the table is restyled as stacked label/value cards (no horizontal scroll), so it is no longer a scroller tab stop.
  const stacked = useMediaQuery('(max-width: 599px)');
  if (typeof block === 'string') return isPlaceholderAnswer(block) ? null : <p><P text={block} /></p>;
  if (block.list) {
    const items = block.list.filter((li) => !isPlaceholderAnswer(li));
    return items.length ? <ul>{items.map((li) => <li key={li}><P text={li} /></li>)}</ul> : null;
  }
  if (block.table) {
    const { head, rows } = block.table;
    return (
      <div
        className="legal-table"
        role="region"
        tabIndex={stacked ? undefined : 0}
        aria-label={tableLabel || undefined}
        aria-labelledby={tableLabel ? undefined : labelledBy}
      >
        {/* Explicit table roles keep semantics when the stacked mobile layout sets display:block. */}
        <table role="table">
          <thead role="rowgroup"><tr role="row">{head.map((h) => <th key={h} scope="col" role="columnheader">{h}</th>)}</tr></thead>
          <tbody role="rowgroup">
            {rows.map((row) => (
              <tr key={row[0]} role="row">
                {row.map((cell, i) => (i === 0
                  ? <th key={i} scope="row" role="rowheader" data-label={head[i]}>{cell}</th>
                  : <td key={i} role="cell" data-label={head[i]}><P text={cell} /></td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.links) {
    return (
      <p className="legal-links">
        {block.links.map((l) => (
          <Link key={l.to} to={localePath(l.to)} className="legal-link">{l.label} <ArrowRight aria-hidden="true" size={16} /></Link>
        ))}
      </p>
    );
  }
  return null;
}

function LegalPage({ slug, page }) {
  const { localePath, t, lang } = useLang();
  const { openConsent } = useShell() || {};
  // Book 3 T17: contents collapsible on mobile/tablet; the all-documents list follows the body there.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  // A section whose blocks are all still placeholders ("[placeholder — to be drafted by counsel]") is hidden, heading
  // and contents entry included, until the text is supplied.
  const sections = page.sections
    .map((s) => ({ ...s, blocks: s.blocks.filter((b) => !isPhBlock(b)) }))
    .filter((s) => s.blocks.length > 0);

  const tocList = (
    <ol>
      {sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}
      <li><a href="#changes">{t('Change log', 'மாற்றப் பதிவு')}</a></li>
    </ol>
  );

  const allDocs = (
    <nav aria-labelledby="legal-all-title" className="legal-all">
      <h2 id="legal-all-title" className="legal-aside__title">{t('Legal', 'சட்டம்')}</h2>
      <ul>
        {LEGAL_ORDER.map((k) => (
          <li key={k}>
            <Link to={localePath(`/legal/${k}`)} aria-current={k === slug ? 'page' : undefined}>{legalTitle(k, LEGAL[k], lang)}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* SEO: descriptions restate the notice's own summary plus its section headings (120–155 chars). SEO-TA: pending native review. */}
      <Seo
        title={LEGAL_SEO[slug] ? t(LEGAL_SEO[slug][0], LEGAL_SEO[slug][1]) : page.title}
        description={LEGAL_SEO[slug] ? t(LEGAL_SEO[slug][2], LEGAL_SEO[slug][3]) : page.description}
      />

      {/* Head on the ink band (AngelList family); the document sits on the sheet that slides over it. */}
      <header className="legal-head" data-surface="night">
        <div className="container">
          <Breadcrumbs items={[{ label: t('Legal', 'சட்டம்'), to: '/sitemap#legal' }, { label: page.title }]} />
          <p className="eyebrow legal-head__eyebrow">{t('Legal', 'சட்டம்')}</p>
          <h1 className="h1 legal-head__title">{page.title}<Dot /></h1>
          <dl className="legal-meta">
            {/* Effective date: shown once counsel approves (the draft note below already says it is not in force). */}
            <div><dt>{t('Version', 'பதிப்பு')}</dt><dd>{t(LEGAL_VERSION, LEGAL_VERSION.replace('Draft', 'வரைவு'))}</dd></div>
            <div><dt>{t('Language', 'மொழி')}</dt><dd><span lang="en">English</span> · <span lang="ta">தமிழ்</span></dd></div>
          </dl>
          <div className="legal-draft" role="note">
            <AlertTriangle aria-hidden="true" size={20} className="legal-draft__icon" />
            {lang === 'ta' ? (
              <p>
                <strong>வரைவு உரை, சட்ட ஆலோசகரின் மறுஆய்வுக்காகக் காத்திருக்கிறது.</strong> DPDP சட்டம், 2023-இன் கீழ் StartNet-இன்
                ஒப்புதல் மற்றும் தரவுப் பாதுகாப்புக் கொள்கைகளிலிருந்து உருவாக்கப்பட்ட செயல்முறை வரைவு இது. இது இன்னும் நடைமுறைக்கு வரவில்லை;
                இது சட்ட ஆலோசனையும் அல்ல.
              </p>
            ) : (
              <p>
                <strong>Placeholder text, pending review by legal counsel.</strong> This page is a working draft built from
                StartNet's consent and data-protection principles under the DPDP Act, 2023. It is not yet in force and is not legal advice.
              </p>
            )}
          </div>
          {slug === 'cookies' && openConsent && (
            <p className="legal-cookie-settings">
              <Button variant="secondary" onClick={openConsent}>{t('Cookie settings', 'குக்கீ அமைப்புகள்')}</Button>
            </p>
          )}
        </div>
      </header>

      <div className="legal-sheet">
      <div className="container legal-layout">
        <aside className="legal-aside" aria-label={t('Legal page navigation', 'சட்டப் பக்க வழிசெலுத்தல்')}>
          {isDesktop ? (
            <nav aria-labelledby="legal-toc-title" className="legal-toc">
              <h2 id="legal-toc-title" className="legal-aside__title">{t('On this page', 'இந்தப் பக்கத்தில்')}</h2>
              {tocList}
            </nav>
          ) : (
            <nav aria-label={t('On this page', 'இந்தப் பக்கத்தில்')} className="legal-toc legal-toc--collapsible">
              <details className="legal-toc__details">
                <summary className="legal-toc__summary">{t('On this page', 'இந்தப் பக்கத்தில்')}</summary>
                {tocList}
              </details>
            </nav>
          )}
          {isDesktop && allDocs}
        </aside>

        <article className="legal-body prose">
          <p className="body-lg legal-intro"><P text={page.intro} /></p>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="legal-section" aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`} className="h3">{s.title}</h2>
              {s.blocks.map((b, i) => {
                const tl = b && b.table ? TABLE_LABELS[`${slug}/${s.id}`] : null;
                return <Block key={i} block={b} labelledBy={`${s.id}-h`} tableLabel={tl ? t(tl[0], tl[1]) : undefined} />;
              })}
            </section>
          ))}
          <section id="changes" className="legal-section legal-changes" aria-labelledby="changes-h">
            <h2 id="changes-h" className="h4">{t('Change log', 'மாற்றப் பதிவு')}</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col" className="legal-changes__narrow">{t('Version', 'பதிப்பு')}</th>
                  <th scope="col" className="legal-changes__narrow">{t('Date', 'தேதி')}</th>
                  <th scope="col">{t('Change', 'மாற்றம்')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="legal-changes__narrow">{t(LEGAL_VERSION, LEGAL_VERSION.replace('Draft', 'வரைவு'))}</td>
                  <td className="legal-changes__narrow">–</td>
                  <td>{t('Working draft prepared for review by counsel.', 'சட்ட ஆலோசகரின் மறுஆய்வுக்காகத் தயாரிக்கப்பட்ட செயல்முறை வரைவு.')}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </article>

        {!isDesktop && <div className="legal-all-wrap">{allDocs}</div>}
      </div>
      </div>
    </>
  );
}
