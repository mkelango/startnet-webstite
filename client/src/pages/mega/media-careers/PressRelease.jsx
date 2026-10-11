// /media/releases/:slug — Press release, T09 Story/article variant (Book 1 Part B §2.2: release with tagged figures; CTA Download assets).
// Data: GET /api/press → PressItem { slug, title, outlet?, date, kind: 'release'|'coverage', url? }.
// Optional fields rendered when the CMS supplies them: summary|standfirst, city|dateline, body (string[] or string),
// figures (Metric[]), quote { quote, name, role }, notes (string[]), assetsUrl, pdfUrl. Unknown slug or a coverage item → NotFound.
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Download, FileText, Mail } from 'lucide-react';
import {
  Seo, Section, Breadcrumbs, Badge, Button, Stat, Quote, InlineMarks, KineticHeadline, Reveal, Skeleton, EmptyState,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang, contentLangFor } from '../../../lib/i18n.jsx';
import NotFound from '../../utility/LazyNotFound.jsx';
import { articleLd } from '../../../lib/seo.js';
import { fitTitle, fitDescription, realText } from '../../programmes/parts/seoFit.js';
import { BOILERPLATE, CopyButton, PRESS_EMAIL, ShareRow, fmtDate, isMark, paragraphs, strings } from './shared.jsx';
import './PressRelease.css';

export default function PressRelease() {
  const { slug } = useParams();
  const { t, lang, localePath } = useLang();
  const { data, loading, error } = useApi('/api/press');

  if (loading) {
    return (
      <Section surface="paper" width="narrow">
        {/* No <Seo> while loading: keeps the prerendered title during hydration. */}
        <div className="release__loading" aria-busy="true">
          <Skeleton height="1.5rem" />
          <Skeleton height="4rem" count={2} />
          <Skeleton height="12rem" />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section surface="paper" width="narrow">
        <Seo title={t('Press release', 'செய்திக் குறிப்பு')} />
        <h1 className="h2">{t("We couldn't load this press release", 'இந்தச் செய்திக் குறிப்பை ஏற்ற முடியவில்லை')}<span className="dot">.</span></h1>
        <EmptyState
          title={t('Please try again in a moment.', 'சிறிது நேரத்தில் மீண்டும் முயலுங்கள்.')}
          action={<Button variant="secondary" to="/media">{t('Media centre', 'ஊடக மையம்')}</Button>}
        />
      </Section>
    );
  }

  const all = Array.isArray(data) ? data : [];
  const release = all.find((p) => p && p.slug === slug && p.kind === 'release');
  if (!release) return <NotFound />;

  const others = all
    .filter((p) => p && p.kind === 'release' && p.slug !== release.slug)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 3);
  const standfirst = release.summary || release.standfirst || '';
  const city = release.city || release.dateline || '';
  const body = paragraphs(release.body);
  const figures = Array.isArray(release.figures) ? release.figures.filter((m) => m && (m.label || m.value != null)) : [];
  const notes = strings(release.notes);
  const quote = release.quote && typeof release.quote === 'object' && release.quote.quote ? release.quote : null;
  const pdf = release.pdfUrl && /^(https?:)?\//.test(release.pdfUrl) ? release.pdfUrl : null;
  const titleIsMark = isMark(release.title);
  const dateText = fmtDate(release.date, lang, { day: 'numeric', month: 'long', year: 'numeric' });

  // NewsArticle via articleLd (author/publisher = the site Organization @id). A placeholder title or an embargoed
  // release is noindex and carries no NewsArticle: there is nothing publishable to describe yet.
  const unpublishable = titleIsMark || !!release.embargo;
  const jsonLd = articleLd({
    headline: release.title,
    description: realText(standfirst),
    path: `/media/releases/${release.slug}`,
    lang,
    datePublished: release.date,
    type: 'NewsArticle',
    placeholder: unpublishable,
  });

  return (
    <article className="release">
      <Seo
        title={titleIsMark ? t('Press release', 'செய்திக் குறிப்பு') : fitTitle(`${release.title}: press release`, release.title)}
        description={fitDescription(standfirst, [
          t('A press release from StartNet, Tamil Nadu’s founder-making network.', 'தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பான StartNet-இன் செய்திக் குறிப்பு.'),
          t('A StartNet press release.', 'StartNet செய்திக் குறிப்பு.'),
        ])}
        type="article"
        noindex={unpublishable}
        jsonLd={jsonLd}
      />

      {/* Head: centred 7-col measure (Book 3 Part B §4, T09), on the ink band; the body sheet slides over it. */}
      <Section surface="night" pad="sm" className="release__head-section">
        <div className="release__measure">
          <Breadcrumbs items={[{ label: t('Media', 'ஊடகம்'), to: '/media' }, { label: titleIsMark ? t('Press release', 'செய்திக் குறிப்பு') : release.title }]} />
          <div className="cluster release__chips">
            <Badge kind="type">{t('Press release', 'செய்திக் குறிப்பு')}</Badge>
            {release.embargo && <Badge kind="status" status="upcoming">{t('Embargoed', 'வெளியீட்டுத் தடை')}</Badge>}
          </div>
          {titleIsMark ? (
            <h1 className="release__title h1"><InlineMarks text={release.title} /></h1>
          ) : (
            <KineticHeadline text={release.title} as="h1" className="release__title h1" lang={contentLangFor(lang, release.title)} />
          )}
          {standfirst && (
            <Reveal as="p" className="release__standfirst body-lg" lang={contentLangFor(lang, standfirst)}><InlineMarks text={standfirst} /></Reveal>
          )}
          <p className="release__byline">
            <span className="release__by">StartNet</span>
            {release.date && <span><time dateTime={release.date}>{dateText}</time></span>}
            <span>{t('For immediate release', 'உடனடி வெளியீட்டுக்கு')}</span>
          </p>
          <div className="release__actions">
            <Button to="/media/kit" icon={Download}>{t('Download assets', 'கோப்புகளைப் பதிவிறக்கவும்')}</Button>
            {pdf ? (
              <Button href={pdf} variant="secondary" icon={FileText}>{t('Release (PDF)', 'செய்திக் குறிப்பு (PDF)')}</Button>
            ) : (
              <Button disabled variant="secondary" icon={FileText}>{t('Release (PDF)', 'செய்திக் குறிப்பு (PDF)')}</Button>
            )}
          </div>
        </div>
      </Section>

      {/* Body */}
      <Section surface="paper" pad="sm">
        <div className="release__measure release__body">
          {body.length ? (
            body.map((para, i) => (
              <p key={i}>
                {i === 0 && (
                  <span className="release__dateline">
                    {city ? `${String(city).toUpperCase()}, ` : ''}
                    {dateText}
                    {' — '}
                  </span>
                )}
                <InlineMarks text={para} />
              </p>
            ))
          ) : null /* No release text yet: no placeholder paragraph. */}

          {figures.length > 0 && (
            <aside className="release__figures" aria-labelledby="release-figures-h">
              <h2 id="release-figures-h" className="release__aside-title">{t('Figures in this release', 'இந்தக் குறிப்பில் உள்ள எண்கள்')}</h2>
              <div className="release__figures-grid">
                {figures.map((m, i) => <Stat key={m.id || i} metric={m} variant="compact" />)}
              </div>
              <p className="caption">
                {t('Every figure carries an A, B or C tag and an as-at date.', 'ஒவ்வொரு எண்ணுக்கும் A, B அல்லது C குறிச்சொல்லும் தேதியும் உண்டு.')}{' '}
                <Link to={localePath('/about/evidence-standard')}>{t('How we tag figures', 'எண்களை நாங்கள் எப்படிக் குறியிடுகிறோம்')}</Link>
              </p>
            </aside>
          )}

          {quote && <Quote quote={quote.quote} name={quote.name} role={quote.role} size="md" />}

          <p className="release__ends"><span aria-hidden="true">— </span>{t('Ends', 'முடிவு')}<span aria-hidden="true"> —</span></p>

          <ShareRow title={titleIsMark ? t('A press release from StartNet', 'StartNet செய்திக் குறிப்பு') : release.title} refCode={`press-${release.slug}`} />
        </div>
      </Section>

      {/* Notes to editors: boilerplate + media contact */}
      <Section surface="white" pad="sm" labelledBy="release-notes-h">
        <div className="release__measure release__notes">
          <h2 id="release-notes-h" className="h4">{t('Notes to editors', 'ஆசிரியர்களுக்கான குறிப்புகள்')}</h2>
          {notes.length > 0 && (
            <ol className="release__notes-list">
              {notes.map((n, i) => <li key={i}><InlineMarks text={n} /></li>)}
            </ol>
          )}
          <div className="release__boiler">
            <h3 className="h6">{t('About StartNet', 'StartNet பற்றி')}</h3>
            <p id="release-boilerplate" lang={lang === 'ta' ? 'ta' : 'en'}>{lang === 'ta' ? BOILERPLATE.ta : BOILERPLATE.en}</p>
            <CopyButton
              text={lang === 'ta' ? BOILERPLATE.ta : BOILERPLATE.en}
              label={t('Copy boilerplate', 'நகலெடுக்கவும்')}
              describedBy="release-boilerplate"
            />
          </div>
          <div className="release__contact">
            <h3 className="h6">{t('Media contact', 'ஊடகத் தொடர்பு')}</h3>
            <ul role="list" className="release__contact-list">
              {/* Contact name and phone are hidden until supplied; the "[confirm]" note is not shown. */}
              <li><Mail size={18} aria-hidden="true" /> <a href={`mailto:${PRESS_EMAIL}?subject=${encodeURIComponent(`Press release: ${release.title}`)}`}>{PRESS_EMAIL}</a></li>
            </ul>
          </div>
        </div>
      </Section>

      {/* More releases */}
      <Section surface="paper" pad="sm" labelledBy="release-more-h">
        <div className="release__measure">
          <div className="release__more-head">
            <h2 id="release-more-h" className="h4">{t('More press releases', 'மேலும் செய்திக் குறிப்புகள்')}</h2>
            <Button variant="tertiary" to="/media">{t('Media centre', 'ஊடக மையம்')}</Button>
          </div>
          {others.length ? (
            <ul className="release__more" role="list">
              {others.map((p) => (
                <li key={p.slug} className="release__more-item">
                  <time className="release__more-date tnum" dateTime={p.date}>{fmtDate(p.date, lang)}</time>
                  <Link className="release__more-link" to={localePath(`/media/releases/${p.slug}`)}>
                    <span lang={contentLangFor(lang, p.title)}>{isMark(p.title) ? <InlineMarks text={p.title} /> : p.title}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="release__more-empty">{t('No other releases yet.', 'வேறு செய்திக் குறிப்புகள் இதுவரை இல்லை.')}</p>
          )}
        </div>
      </Section>
    </article>
  );
}
