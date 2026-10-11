// T09 Story / article: centred 7-col measure, inline Stats, share row, person card, next step, related stories.
// Tamil strings are drafts pending native review (Book 2 §14). Story copy comes from the API: titleTa / excerptTa /
// bodyTa are used on /ta when supplied; otherwise the English seed copy is marked lang="en".
import { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Link2, Share2, Check, Clock, MapPin } from 'lucide-react';
import {
  Seo, Section, Breadcrumbs, Badge, ArtImage, Stat, PersonCard, StoryCard, Button, WhatsAppButton,
  RevealGroup, Reveal, KineticHeadline, Skeleton, EmptyState,
} from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { BRANDS } from '../../data/brands.js';
import NotFound from '../utility/LazyNotFound.jsx';
import { LEVELS, pickLang, isEnFallback, levelName, levelRule, fmtDate, localiseItem } from './ledgerUtils.js';
import { RichText } from './RichText.jsx';
import { isPlaceholderText, realStories } from '../../components/_placeholders.js';
import { articleLd } from '../../lib/seo.js';
import { fitTitle, fitDescription } from '../programmes/parts/seoFit.js';
import './StoryDetail.css';
import { photoFor, PHOTO_SIZES } from '../../data/photos.js';

const TYPE_LABEL = {
  founder: ['Founder story', 'நிறுவனர் கதை'],
  partner: ['Partner story', 'கூட்டாளர் கதை'],
  recap: ['Event recap', 'நிகழ்வுச் சுருக்கம்'],
};

/** Brand promises (data/brands.js carries English only). Tamil drafts pending native review. */
const PROMISE_TA = {
  research: 'உங்கள் ஆய்வை, உங்கள் கல்வி நிறுவனம் கையெழுத்திடக்கூடிய நிலையான விதிமுறைகளில், நீங்களும் இணை உரிமையாளராக உள்ள ஒரு நிறுவனமாக மாற்றுங்கள்.',
  vibe: 'கல்லூரியிலேயே தமிழிலோ ஆங்கிலத்திலோ AI உடன் உருவாக்குங்கள்; ஒரு தயாரிப்பு, ஒரு குழு, அடுத்த அடியுடன் வெளியேறுங்கள்.',
  connect: 'உங்கள் துறையில், தொடங்க, மாற அல்லது விரிவாக்க உதவக்கூடியவர்களை, அதற்கென அமைக்கப்பட்ட அரங்குகளில் சந்தியுங்கள்.',
  women: 'தொழில் உரிமையாளரிலிருந்து முதலீட்டுக்குத் தகுதியான நிறுவனர் வரை: முதலில் சந்தை அணுகல், அடுத்து மூலதனம்.',
};

/** Placeholder-register story copy (seed data) shown on /ta when the API has no Tamil. Drafts pending native review. */
const PLACEHOLDER_STORY_TA = {
  title: '[placeholder — நிறுவனர் கதையை StartNet வழங்கும்]',
  excerpt: 'எழுத்துப்பூர்வ ஒப்புதலுடன் உண்மையான நிறுவனர் கதைகள். நிறுவனர் எழுத்துப்பூர்வமாக ஒப்புதல் அளிக்கும் வரை மேற்கோள்களை வெளியிட வேண்டாம்.',
  person: '[placeholder — பெயர், எழுத்துப்பூர்வ ஒப்புதலுடன்]',
  body: ['[placeholder — StartNet வழங்கும்: எழுத்துப்பூர்வ ஒப்புதலுடன் உண்மையான நிறுவனர் கதைகள். நிறுவனர் எழுத்துப்பூர்வமாக ஒப்புதல் அளிக்கும் வரை மேற்கோள்களை வெளியிட வேண்டாம்.]'],
};

/** Seed copy that is still a placeholder-register item must never become the page, breadcrumb or share title. */
const isPlaceholder = (text) => /^\s*\[placeholder/i.test(String(text || ''));

export default function StoryDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { data: story, loading, error } = useApi(`/api/stories/${encodeURIComponent(slug)}`);
  const related = useApi(story?.brand && BRANDS[story.brand] ? `/api/stories?brand=${story.brand}` : story ? '/api/stories' : null);

  if (error && /^404/.test(error.message || '')) return <NotFound />;

  if (loading || (!story && !error)) {
    return (
      <Section surface="paper" width="narrow">
        <div className="story__loading" aria-busy="true">
          <Skeleton height="2rem" />
          <Skeleton height="4rem" count={2} />
          <Skeleton height="20rem" />
        </div>
      </Section>
    );
  }

  if (error || !story) {
    return (
      <Section surface="paper" width="narrow">
        <Seo title={t('Story', 'கதை')} />
        <h1 className="h2">{t("We couldn't load this story", 'இந்தக் கதையை இப்போது ஏற்ற முடியவில்லை')}<span className="dot">.</span></h1>
        <EmptyState
          title={t('Please try again in a moment.', 'சிறிது நேரம் கழித்து மீண்டும் முயலவும்.')}
          action={<Button variant="secondary" to="/insights/stories">{t('All stories', 'அனைத்துக் கதைகள்')}</Button>}
        />
      </Section>
    );
  }

  const brand = BRANDS[story.brand];
  const body = Array.isArray(story.body) ? story.body : story.body ? [story.body] : [];
  const placeholder = !!story.placeholder || isPlaceholder(story.title);
  const phTa = lang === 'ta' && placeholder ? PLACEHOLDER_STORY_TA : null;
  const bodyTa = lang === 'ta' && Array.isArray(story.bodyTa) && story.bodyTa.length
    ? story.bodyTa
    : phTa && body.every(isPlaceholder) ? phTa.body : null;
  const paras = bodyTa || body;
  const person = story.person && typeof story.person === 'object' ? story.person : null;
  const personName = person?.name || (typeof story.person === 'string' ? story.person : null);
  const from = LEVELS.find((l) => l.code === story.ladderFrom);
  const to = LEVELS.find((l) => l.code === story.ladderTo);
  const relatedList = realStories(related.data)
    .filter((s) => s.slug !== story.slug)
    .slice(0, 3)
    .map((s) => localiseItem(s, lang));
  const statAfter = Math.min(1, Math.max(0, paras.length - 1));

  const title = (phTa && !story.titleTa && phTa.title) || pickLang(story, 'title', lang);
  const excerpt = (phTa && !story.excerptTa && story.excerpt && phTa.excerpt) || pickLang(story, 'excerpt', lang);
  // English seed copy on a Tamil page is marked lang="en" so screen readers switch voice (WCAG 3.1.2).
  const enLang = (field) => (isEnFallback(story, field, lang) && !(phTa && phTa[field]) ? 'en' : undefined);
  const brandName = brand ? brand.name : 'StartNet';
  const pageTitle = placeholder
    ? brand
      ? t(`Founder story: ${brand.name}`, `நிறுவனர் கதை: ${brand.name}`)
      : t('A founder story from StartNet', 'StartNet-இன் ஒரு நிறுவனர் கதை')
    : title;
  const pageDescription = placeholder
    ? t(
      `A ${brandName} founder story is on its way. Every StartNet story is published with the founder's written consent.`,
      `${brandName} நிறுவனர் கதை விரைவில் வரும். ஒவ்வொரு StartNet கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடப்படும்.`,
    )
    : excerpt;
  const typeLabel = TYPE_LABEL[story.type] ? t(...TYPE_LABEL[story.type]) : t('Story', 'கதை');

  // SEO: real stories get "<Title>: <story type>" when the title has no colon of its own (trimmed to 60) and an
  // Article node via articleLd(); placeholder stories (placeholder: true, or a "[placeholder" title) are noindex,
  // follow and carry no Article, because there is no story yet (thin page; left out of sitemap.xml too).
  // SEO-TA: pending native review.
  const seoTitle = placeholder || /:/.test(pageTitle) ? pageTitle : fitTitle(`${pageTitle}: ${typeLabel.toLowerCase()}`, pageTitle);
  const seoDescription = fitDescription(pageDescription, [
    t('Every outcome carries its source or a confidence tag.', 'ஒவ்வொரு விளைவுக்கும் ஆதாரம் அல்லது நம்பகத்தன்மைக் குறி உண்டு.'),
    t('Every outcome carries a source or tag.', 'ஒவ்வொரு விளைவுக்கும் ஆதாரக் குறி உண்டு.'),
  ]);
  const storyLd = articleLd({
    headline: pageTitle,
    description: seoDescription,
    path: `/insights/stories/${story.slug}`,
    lang,
    datePublished: story.date,
    dateModified: story.updated || story.dateModified,
    placeholder,
    type: 'Article',
  });

  /* Next step (M04) */
  const nextStep = (
    <Section surface="white" pad="sm">
      <div className="story__measure story__next">
        <div>
          <p className="eyebrow">{t('Your next step', 'உங்கள் அடுத்த அடி')}</p>
          <h2 className="h3">
            {brand ? t(brand.journey, brand.journeyTa) : t('Every talent, a founder', 'ஒவ்வொரு திறமையும், ஒரு நிறுவனர்')}
            <span className="dot">.</span>
          </h2>
          {brand && <p className="text-2">{t(brand.promise, brand.promiseTa || PROMISE_TA[story.brand])}</p>}
        </div>
        <div className="cluster">
          {story.programme && (
            <Button to={`/programmes/${story.programme}`} icon={ArrowRight}>{t('See the programme', 'திட்டத்தைப் பாருங்கள்')}</Button>
          )}
          {brand?.cta?.to && (
            <Button variant={story.programme ? 'secondary' : 'primary'} to={brand.cta.to}>{t(brand.cta.label, brand.cta.labelTa)}</Button>
          )}
          {!brand && <Button to="/programmes">{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>}
        </div>
      </div>
    </Section>
  );

  // Placeholder story (no consented story yet): the route stays (server/client route-sync), noindex, but the page shows
  // an honest "on its way" state instead of placeholder title, byline and body text.
  if (placeholder) {
    return (
      <article className="story" data-brand={brand ? story.brand : undefined}>
        <Seo title={seoTitle} description={seoDescription} type="website" noindex jsonLd={storyLd} />
        <Section surface="night" pad="sm" className="story__head-section">
          <div className="story__measure">
            <Breadcrumbs
              items={[
                { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
                { label: t('Stories', 'கதைகள்'), to: '/insights/stories' },
                { label: pageTitle },
              ]}
            />
            <div className="cluster story__chips">
              <Badge kind="type">{typeLabel}</Badge>
              {brand && <Badge kind="brand" brand={story.brand}>{brand.name}</Badge>}
            </div>
            <h1 className="story__title h1">{pageTitle}</h1>
            <EmptyState
              title={t(`A ${brandName} founder story is on its way.`, `${brandName} நிறுவனர் கதை விரைவில் வரும்.`)}
              body={t(
                "Every StartNet story is published with the founder's written consent.",
                'ஒவ்வொரு StartNet கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடப்படும்.',
              )}
              action={<Button variant="secondary" to="/insights/stories">{t('All stories', 'அனைத்துக் கதைகள்')}</Button>}
              headingLevel={2}
            />
          </div>
        </Section>
        {nextStep}
      </article>
    );
  }

  return (
    <article className="story" data-brand={brand ? story.brand : undefined}>
      <Seo title={seoTitle} description={seoDescription} type={placeholder ? 'website' : 'article'} noindex={placeholder} jsonLd={storyLd} />

      <Section surface="night" pad="sm" className="story__head-section">
        <div className="story__measure">
          <Breadcrumbs
            items={[
              { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
              { label: t('Stories', 'கதைகள்'), to: '/insights/stories' },
              { label: pageTitle },
            ]}
          />
          <div className="cluster story__chips">
            <Badge kind="type">{typeLabel}</Badge>
            {brand && <Badge kind="brand" brand={story.brand}>{brand.name}</Badge>}
            {from && to && <Badge kind="level">{from.code} → {to.code}</Badge>}
          </div>
          {placeholder ? (
            <h1 className="story__title h1" lang={enLang('title')}><RichText text={title} /></h1>
          ) : (
            <div lang={enLang('title')}><KineticHeadline text={title} as="h1" className="story__title h1" /></div>
          )}
          {excerpt && (
            <Reveal as="p" className="story__standfirst body-lg" lang={enLang('excerpt')}>
              <RichText text={excerpt} />
            </Reveal>
          )}
          <p className="story__byline">
            {personName && !isPlaceholder(personName) && (
              <span className="story__by" lang={lang === 'ta' && !person?.nameTa && !(phTa && isPlaceholder(personName)) ? 'en' : undefined}>
                <RichText text={(lang === 'ta' && person?.nameTa) || (phTa && isPlaceholder(personName) ? phTa.person : personName)} />
              </span>
            )}
            {story.district && !isPlaceholderText(story.district) && (
              <span>
                <MapPin size={14} aria-hidden="true" />{' '}
                <span lang={enLang('district')}><RichText text={pickLang(story, 'district', lang)} /></span>
              </span>
            )}
            {story.date && <span><time dateTime={story.date}>{fmtDate(story.date, lang)}</time></span>}
            {story.readingMinutes && (
              <span>
                <Clock size={14} aria-hidden="true" />{' '}
                {t(`${story.readingMinutes} min read`, `${story.readingMinutes} நிமிட வாசிப்பு`)}
              </span>
            )}
          </p>
        </div>
      </Section>

      {/* The media frame straddles the ink head band and the paper body (Oct 2026). */}
      <div className="story__media-band">
      <div className="container story__media">
        <ArtImage
          variant={story.type === 'recap' ? 'network' : 'portrait'}
          brand={brand ? story.brand : undefined}
          ratio="3/2"
          seed={hash(story.slug)}
          photo={story.placeholder ? null : photoFor(`story/${story.slug}`) ?? null}
          priority
          sizes={PHOTO_SIZES.wide}
          label={[story.programme && prettify(story.programme), isPlaceholder(story.district) ? null : story.district].filter(Boolean).join(', ') || undefined}
          alt=""
          animate
        />
      </div>
      </div>

      <Section surface="paper" pad="sm">
        <div className="story__measure story__body" lang={lang === 'ta' && !bodyTa && paras.length ? 'en' : undefined}>
          {paras.map((para, i) => (
            <Fragment key={i}>
              <p><RichText text={para} /></p>
              {i === statAfter && story.outcome && (
                <aside className="story__inline-stat" aria-label={t('Outcome', 'விளைவு')} lang={lang === 'ta' ? 'ta' : undefined}>
                  <Stat metric={story.outcome} variant="default" />
                </aside>
              )}
            </Fragment>
          ))}

          {from && to && (
            <aside className="story__ladder" aria-label={t('Founder ladder movement', 'நிறுவனர் ஏணியில் முன்னேற்றம்')} lang={lang === 'ta' ? 'ta' : undefined}>
              <p className="eyebrow">{t('On the founder ladder', 'நிறுவனர் ஏணியில்')}</p>
              <ol className="story__ladder-steps">
                <li><span className="story__ladder-code">{from.code}</span> {levelName(from, lang)}</li>
                <li aria-hidden="true" className="story__ladder-arrow"><ArrowRight size={18} /></li>
                <li><span className="story__ladder-code story__ladder-code--to">{to.code}</span> {levelName(to, lang)}</li>
              </ol>
              <p className="caption">{to.code} {levelName(to, lang)}: {levelRule(to, lang)}</p>
            </aside>
          )}

          <div lang={lang === 'ta' ? 'ta' : undefined}>
            <ShareRow title={pageTitle} />
          </div>
        </div>
      </Section>

      {person?.name && !isPlaceholderText(person.name) && (
        <Section surface="paper" pad="sm">
          <div className="story__measure story__person">
            <PersonCard person={{ ...person, brand: person.brand || story.brand }} />
          </div>
        </Section>
      )}

      {nextStep}

      {relatedList.length > 0 && (
        <Section surface="paper">
          <div className="story__related-head">
            <h2 className="h3">{t('More stories', 'மேலும் கதைகள்')}</h2>
            <Button variant="tertiary" to="/insights/stories" icon={ArrowRight}>{t('All stories', 'அனைத்துக் கதைகள்')}</Button>
          </div>
          <RevealGroup className="grid grid-3">
            {relatedList.map((s) => <StoryCard key={s.slug} story={s} />)}
          </RevealGroup>
        </Section>
      )}
    </article>
  );
}

function ShareRow({ title }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <div className="story__share" role="group" aria-label={t('Share this story', 'இந்தக் கதையைப் பகிருங்கள்')}>
      <span className="story__share-label">{t('Share', 'பகிருங்கள்')}</span>
      <WhatsAppButton text={`${title} ${url}`} label={t('Share on WhatsApp', 'WhatsApp‑இல் பகிருங்கள்')} />
      <button type="button" className="story__share-btn" onClick={copy}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        <span aria-live="polite">{copied ? t('Link copied', 'இணைப்பு நகலெடுக்கப்பட்டது') : t('Copy link', 'இணைப்பை நகலெடுக்கவும்')}</span>
      </button>
      {canShare && (
        <button type="button" className="story__share-btn" onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <Share2 size={16} aria-hidden="true" /> {t('Share', 'பகிருங்கள்')}
        </button>
      )}
    </div>
  );
}

const prettify = (slug) => String(slug).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
function hash(s = '') {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 97;
}
