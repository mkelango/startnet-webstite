// /research/stories · /vibe/stories · /connect/stories · /women/stories — brand filtered view of /insights/stories.
// Template: Book 1 Part B T15 (title + intro → filter bar → results grid → load more → empty state).
// §7.4: the view canonicalises to itself with unique intro copy; story pages stay canonical at /insights/stories/<slug>.
// Facets (§10, Insights): type · district · year — values derived from the brand's stories, counts on every value.
// Renders inside BrandLayout for the brand in the path (manifest: one route per brand).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import {
  Seo, BrandHero, Breadcrumbs, Section, StoryCard, RevealGroup, EmptyState, Skeleton, Button, CTABand,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { snxLink, waLink } from '../../../lib/links.js';
import { BRANDS } from '../../../data/brands.js';
import NotFound from '../../utility/NotFound.jsx';
import { BRAND_STORIES, STORY_TYPES } from './brandSubData.js';
import { FacetChips, useBrandKey, useTp, isPh, districtOption } from './BrandSubParts.jsx';
import '../../brands/brandPage.css';
import './BrandSubParts.css';
import './BrandStories.css';
import { itemListLd } from '../../../lib/seo.js';
import { pageLd } from '../../brands/seoBits.js';

const PAGE = 12;

export default function BrandStories({ brand: brandProp }) {
  const brand = useBrandKey(brandProp);
  if (!brand) return <NotFound />;
  return <StoriesView key={brand} brand={brand} />;
}

const yearOf = (s) => (s && s.date && /^\d{4}/.test(s.date) ? s.date.slice(0, 4) : '');

function StoriesView({ brand }) {
  const { t, lang } = useLang();
  const tp = useTp();
  const b = BRANDS[brand];
  const copy = BRAND_STORIES[brand];
  const [params, setParams] = useSearchParams();
  const type = params.get('type') || '';
  const year = params.get('year') || '';
  const district = params.get('district') || '';
  const [shown, setShown] = useState(PAGE);
  const listRef = useRef(null);
  const prevShown = useRef(PAGE);

  const { data, loading, error } = useApi(`/api/stories?brand=${brand}`);

  // Placeholder slots (seed records awaiting a consented story) are never listed as stories.
  const all = useMemo(
    () =>
      (Array.isArray(data) ? data : [])
        .filter((s) => s && s.brand === brand && !s.placeholder && !isPh(s.title))
        .sort((a, b2) => String(b2.date || '').localeCompare(String(a.date || ''))),
    [data, brand]
  );

  const preds = {
    type: (s, v) => s.type === v,
    year: (s, v) => yearOf(s) === v,
    district: (s, v) => s.district === v,
  };
  const values = { type, year, district };
  const matches = (s, skip) => Object.entries(values).every(([k, v]) => k === skip || !v || preds[k](s, v));
  const count = (key) => (v) => all.filter((s) => matches(s, key) && preds[key](s, v)).length;
  const results = all.filter((s) => matches(s));
  const visible = results.slice(0, shown);
  const filtered = !!(type || year || district);

  const years = [...new Set(all.map(yearOf).filter(Boolean))].sort().reverse().map((y) => ({ value: y, label: [y, y] }));
  const districts = [...new Set(all.map((s) => s.district).filter((d) => d && !isPh(d)))].sort().map(districtOption);

  useEffect(() => { setShown(PAGE); }, [type, year, district]);
  // Load more: focus the first new card (Book 3 C37).
  useEffect(() => {
    if (shown > prevShown.current && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      items[prevShown.current]?.querySelector('a[href]')?.focus();
    }
    prevShown.current = shown;
  }, [shown]);

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams({}, { replace: true });

  const brandName = b.name;
  const countLine = loading
    ? t('Loading stories…', 'கதைகள் ஏற்றப்படுகின்றன…')
    : error
      ? ''
      : t(
        `Showing ${visible.length} of ${results.length} ${results.length === 1 ? 'story' : 'stories'}`,
        `${results.length} கதைகளில் ${visible.length} காட்டப்படுகின்றன`
      );

  return (
    <div className="brand-stories">
      {/* Noindex while there is no consented story to list (placeholder slots are never listed): an empty
          listing is a thin page. It becomes indexable as soon as the first real story is published. */}
      <Seo
        title={t(copy.seo, copy.seoTa || `${b.descriptor} கதைகள் · ${b.name}`)}
        titleTa={copy.seoTa}
        description={t(copy.meta, copy.metaTa)}
        descriptionTa={copy.metaTa}
        noindex={loading || !!error || all.length === 0}
        jsonLd={[
          pageLd({ path: `${b.base}/stories`, lang, type: 'CollectionPage', name: t(copy.seo, copy.seoTa), description: t(copy.meta, copy.metaTa) }),
          itemListLd({ name: t(copy.seo, copy.seoTa), items: all.map((s) => ({ name: t(s.title, s.titleTa), path: `/insights/stories/${s.slug}` })), lang }),
        ]}
      />

      <div className="bp-crumbs" data-surface="night">
        <div className="container bsub-crumbs">
          <Breadcrumbs items={[{ label: brandName, to: b.base }, { label: t('Stories', 'கதைகள்') }]} />
        </div>
      </div>

      <BrandHero
        brand={brand}
        compact
        title={tp(copy.title)}
        lede={tp(copy.lede)}
        actions={
          <>
            <Button variant="brand" to={copy.next.to}>{tp(copy.next.label)}</Button>
            <Button variant="tertiary" to={`/insights/stories?brand=${brand}`} icon={ArrowRight}>
              {t('All StartNet stories', 'அனைத்து StartNet கதைகள்')}
            </Button>
          </>
        }
      />

      <Section surface="paper" pad="sm" labelledBy="brand-stories-results">
        <h2 id="brand-stories-results" className="visually-hidden">{t(`${brandName} stories`, `${brandName} கதைகள்`)}</h2>

        {all.length > 0 && (
          <div className="brand-stories__filters" role="group" aria-label={t('Filter stories', 'கதைகளை வடிகட்டு')}>
            <FacetChips id="bst-type" label={t('Type', 'வகை')} options={STORY_TYPES} value={type} onChange={(v) => set('type', v)} counts={count('type')} />
            {districts.length > 1 && (
              <FacetChips id="bst-district" label={t('District', 'மாவட்டம்')} options={districts} value={district} onChange={(v) => set('district', v)} counts={count('district')} />
            )}
            {years.length > 1 && (
              <FacetChips id="bst-year" label={t('Year', 'ஆண்டு')} options={years} value={year} onChange={(v) => set('year', v)} counts={count('year')} />
            )}
          </div>
        )}

        {all.length > 0 && (
          <p className="brand-stories__count" aria-live="polite">
            <span>{countLine}</span>
            {filtered && (
              <button type="button" className="brand-stories__clear" onClick={clearAll}>{t('Clear all', 'அனைத்தையும் அழி')}</button>
            )}
          </p>
        )}

        {loading ? (
          <div className="brand-stories__grid" aria-hidden="true"><Skeleton height="22rem" count={3} /></div>
        ) : error ? (
          <EmptyState
            headingLevel={3}
            title={t("We couldn't load stories just now.", 'இப்போது கதைகளை ஏற்ற முடியவில்லை.')}
            body={t('Check your connection and try again.', 'இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும்.')}
            action={
              <div className="cluster brand-stories__actions">
                <Button variant="secondary" onClick={() => window.location.reload()}>{t('Try again', 'மீண்டும் முயலவும்')}</Button>
                <Button variant="tertiary" to="/insights/stories">{t('All stories', 'அனைத்துக் கதைகள்')}</Button>
              </div>
            }
          />
        ) : results.length ? (
          <>
            <div ref={listRef}>
              <RevealGroup as="ul" className="brand-stories__grid" role="list" key={`${type}-${year}-${district}`}>
                {visible.map((s) => (
                  <li key={s.slug} className="brand-stories__item"><StoryCard story={s} /></li>
                ))}
              </RevealGroup>
            </div>
            {shown < results.length && (
              <div className="brand-stories__more">
                <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>{t('Load more', 'மேலும் காட்டு')}</Button>
              </div>
            )}
          </>
        ) : filtered ? (
          <EmptyState
            title={t('No stories match these filters yet.', 'இந்த வடிகட்டிகளுக்குப் பொருந்தும் கதைகள் இன்னும் இல்லை.')}
            body={t(`${all.length} ${brandName} ${all.length === 1 ? 'story is' : 'stories are'} published. Clear the filters to see them.`, `${brandName}-இல் ${all.length} கதைகள் வெளியிடப்பட்டுள்ளன. அவற்றைப் பார்க்க வடிகட்டிகளை அழிக்கவும்.`)}
            action={<Button variant="secondary" onClick={clearAll}>{t('Show all stories', 'அனைத்துக் கதைகளையும் காட்டு')}</Button>}
          />
        ) : (
          <EmptyState
            title={t(`${brandName} stories are on their way.`, `${brandName} கதைகள் விரைவில் வரும்.`)}
            body={
              <>
                <p>
                  {t(
                    'We publish a story only with the founder’s written consent and a tagged outcome.',
                    'நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலும் அடையாளமிட்ட விளைவும் இருந்தால் மட்டுமே ஒரு கதையை வெளியிடுவோம்.'
                  )}
                </p>
              </>
            }
            action={
              <div className="cluster brand-stories__actions">
                <Button variant="secondary" to="/insights/stories">{t('Read all StartNet stories', 'அனைத்து StartNet கதைகளையும் படியுங்கள்')}</Button>
                <Button variant="tertiary" to={b.base} icon={ArrowRight}>{t(`Back to ${brandName}`, `${brandName}-க்குத் திரும்பு`)}</Button>
              </div>
            }
          />
        )}
      </Section>

      {/* Share a story: consent-first, via WhatsApp or the contact form */}
      <Section surface="white" pad="sm" labelledBy="brand-stories-share">
        <div className="brand-stories__share">
          <div className="brand-stories__share-text">
            <h2 id="brand-stories-share" className="h4">{t('Have a story to tell?', 'சொல்ல ஒரு கதை இருக்கிறதா?')}</h2>
            <p className="text-2">
              {t(
                'If a StartNet programme helped you take a step, tell us. We only publish with your written consent, and you see the final text first.',
                'ஒரு StartNet திட்டம் உங்களுக்கு ஒரு படி முன்னேற உதவியிருந்தால், எங்களிடம் சொல்லுங்கள். உங்கள் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடுவோம்; இறுதி உரையை முதலில் நீங்கள் பார்ப்பீர்கள்.'
              )}
            </p>
          </div>
          <div className="cluster brand-stories__actions">
            <Button variant="whatsapp" icon={MessageCircle} href={waLink(t(`Hi StartNet ${b.descriptor}, I'd like to share my story.`, `வணக்கம் StartNet ${b.descriptor}, என் கதையைப் பகிர விரும்புகிறேன்.`), `${brand}-stories, ${lang}`)}>
              {t('Chat on WhatsApp', 'WhatsApp-இல் பேசுங்கள்')}
            </Button>
            <Button variant="tertiary" to="/contact" icon={ArrowRight}>{t('Talk to us', 'எங்களிடம் பேசுங்கள்')}</Button>
          </div>
        </div>
      </Section>

      <CTABand
        surface="paper"
        className="brand-close"
        brand={brand}
        title={t('Start where you are.', 'நீங்கள் இருக்கும் இடத்திலிருந்தே தொடங்குங்கள்.')}
        body={t(
          'Make a free StartNet X profile and we’ll show you the next step that fits you.',
          'இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள்; உங்களுக்குப் பொருந்தும் அடுத்த படியைக் காட்டுவோம்.'
        )}
        actions={
          <>
            <Button variant="brand" href={snxLink('/signup', { src: `${brand}-stories`, brand, lang })}>
              {t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}
            </Button>
            <Button variant="tertiary" to={`/${brand}/events`} icon={ArrowRight}>
              {t(`${b.descriptor} events`, `${b.descriptor} நிகழ்வுகள்`)}
            </Button>
          </>
        }
      />
    </div>
  );
}
