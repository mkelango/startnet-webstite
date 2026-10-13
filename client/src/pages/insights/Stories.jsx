// T15 listing: founder stories and event recaps (/insights/stories?brand=&type=). Filter state lives in the URL.
// All stories load once; filtering, chip counts and URL validation happen client-side so every chip shown has
// at least one story and unknown ?brand= / ?type= values are dropped. Tamil drafts pending native review (Book 2 §14).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo, PageHero, Section, StoryCard, RevealGroup, EmptyState, Skeleton, Button, CTABand } from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { webPageLd, itemListLd, langPath, ORG_REF, absUrl } from '../../lib/seo.js';
import { snxLink } from '../../lib/links.js';
import { BRANDS } from '../../data/brands.js';
import { localiseItem } from './ledgerUtils.js';
import { realStories } from '../../components/_placeholders.js';
import StartupShowcase from './StartupShowcase.jsx';
import './Stories.css';

const BRAND_FILTERS = [
  { value: '', label: ['All brands', 'அனைத்து பிராண்டுகளும்'] },
  ...['research', 'vibe', 'connect', 'women'].map((k) => ({ value: k, label: [BRANDS[k].descriptor, BRANDS[k].descriptor] })),
  // Stories filed under the parent brand (e.g. "StartNet rooms since 2023", slug five-years-of-rooms).
  { value: 'startnet', label: ['StartNet', 'StartNet'] },
];
const TYPE_FILTERS = [
  { value: '', label: ['All', 'அனைத்தும்'] },
  { value: 'founder', label: ['Founder stories', 'நிறுவனர் கதைகள்'] },
  { value: 'partner', label: ['Partner stories', 'கூட்டாளர் கதைகள்'] },
  { value: 'recap', label: ['Event recaps', 'நிகழ்வுச் சுருக்கங்கள்'] },
];
const BRAND_VALUES = BRAND_FILTERS.map((o) => o.value).filter(Boolean);
const TYPE_VALUES = TYPE_FILTERS.map((o) => o.value).filter(Boolean);
const PAGE = 24;

const norm = (v) => String(v || '').trim().toLowerCase();

export default function Stories() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const rawBrand = norm(params.get('brand'));
  const rawType = norm(params.get('type'));
  const brand = BRAND_VALUES.includes(rawBrand) ? rawBrand : '';
  const type = TYPE_VALUES.includes(rawType) ? rawType : '';
  const { data, loading, error } = useApi('/api/stories');
  const [shown, setShown] = useState(PAGE);
  const listRef = useRef(null);
  const prevShown = useRef(PAGE);

  // Drop unknown filter values from the URL (?brand=bogus) so the page and its chips agree.
  useEffect(() => {
    const badBrand = params.has('brand') && params.get('brand') !== brand;
    const badType = params.has('type') && params.get('type') !== type;
    if (!badBrand && !badType) return;
    const next = new URLSearchParams(params);
    if (badBrand) { if (brand) next.set('brand', brand); else next.delete('brand'); }
    if (badType) { if (type) next.set('type', type); else next.delete('type'); }
    setParams(next, { replace: true });
  }, [params, brand, type, setParams]);

  useEffect(() => { setShown(PAGE); }, [brand, type]);
  // Load more: focus the first new item (Book 3 C37).
  useEffect(() => {
    if (shown > prevShown.current && listRef.current) {
      const links = listRef.current.querySelectorAll('a[href]');
      const perCard = Math.max(1, Math.round(links.length / shown));
      links[prevShown.current * perCard]?.focus();
    }
    prevShown.current = shown;
  }, [shown]);

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const all = useMemo(() => realStories(data), [data]);
  const counts = useMemo(() => {
    const c = { brand: {}, type: {} };
    all.forEach((s) => {
      const b = norm(s.brand);
      const ty = norm(s.type);
      c.brand[b] = (c.brand[b] || 0) + 1;
      c.type[ty] = (c.type[ty] || 0) + 1;
    });
    return c;
  }, [all]);
  // Hide chips with nothing behind them once the list has loaded (keep the active one so it can be cleared).
  const visibleOptions = (options, key, value) =>
    data ? options.filter((o) => !o.value || o.value === value || (counts[key][o.value] || 0) > 0) : options;

  const list = all.filter((s) => (!brand || norm(s.brand) === brand) && (!type || norm(s.type) === type));
  const visible = list.slice(0, shown).map((s) => localiseItem(s, lang));
  const filtered = !!(brand || type);
  const countText = t(
    `Showing ${visible.length} of ${list.length} ${list.length === 1 ? 'story' : 'stories'}`,
    `${list.length} கதைகளில் ${visible.length} காட்டப்படுகின்றன`,
  );

  return (
    <>
      <Seo
        // SEO-TA: pending native review. ItemList: real stories only (placeholder stories are noindex).
        title={t('Founder stories and event recaps from Tamil Nadu', 'தமிழ்நாட்டு நிறுவனர் கதைகள்')}
        description={t(
          "Founder stories and event recaps from StartNet Research, Vibe, Connect and Women. Every outcome is tagged; every story has the founder's written consent.",
          'StartNet Research, Vibe, Connect, Women ஆகியவற்றின் நிறுவனர் கதைகளும் நிகழ்வுச் சுருக்கங்களும். ஒவ்வொரு கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன்.',
        )}
        jsonLd={[
          webPageLd({ path: langPath('/insights/stories', lang), type: 'CollectionPage', lang, name: t('Founder stories and event recaps', 'நிறுவனர் கதைகள்') }),
          itemListLd({
            name: t('StartNet founder stories', 'StartNet நிறுவனர் கதைகள்'),
            lang,
            items: all
              .filter((s) => !s.placeholder && !/^\s*\[placeholder/i.test(String(s.title || '')))
              .map((s) => ({ name: (lang === 'ta' && s.titleTa) || s.title, path: `/insights/stories/${s.slug}` })),
          }),
        ]}
      />
      <PageHero
        eyebrow={t('Insights', 'நுண்ணறிவுகள்')}
        title={t('Founders, in their own words.', 'நிறுவனர்கள், அவர்களின் சொந்த வார்த்தைகளில்.')}
        lede={t(
          "Founder stories and event recaps from across StartNet. Every outcome carries its source or a confidence tag, and every story is published with the founder's written consent.",
          'StartNet முழுவதிலுமிருந்து நிறுவனர் கதைகளும் நிகழ்வுச் சுருக்கங்களும். ஒவ்வொரு விளைவுக்கும் அதன் ஆதாரம் அல்லது நம்பகத்தன்மைக் குறி உண்டு; ஒவ்வொரு கதையும் நிறுவனரின் எழுத்துப்பூர்வ ஒப்புதலுடன் மட்டுமே வெளியிடப்படுகிறது.',
        )}
        breadcrumbs={[{ label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' }, { label: t('Stories', 'கதைகள்') }]}
      />

      <Section surface="paper" id="community-startups">
        <StartupShowcase />
      </Section>

      <Section surface="paper" pad="sm">
        <div className="stories-filters" role="group" aria-label={t('Filter stories', 'கதைகளை வடிகட்டு')}>
          <FilterRow
            id="brand"
            label={t('Brand', 'பிராண்டு')}
            options={visibleOptions(BRAND_FILTERS, 'brand', brand)}
            value={brand}
            onChange={(v) => set('brand', v)}
            brandDots
          />
          <FilterRow
            id="type"
            label={t('Type', 'வகை')}
            options={visibleOptions(TYPE_FILTERS, 'type', type)}
            value={type}
            onChange={(v) => set('type', v)}
          />
        </div>
        <p className="stories-count" aria-live="polite">
          {loading ? t('Loading stories…', 'கதைகள் ஏற்றப்படுகின்றன…') : error ? '' : countText}
          {filtered && !loading && (
            <button type="button" className="stories-clear" onClick={() => setParams({}, { replace: true })}>
              {t('Clear all', 'அனைத்தையும் அழி')}
            </button>
          )}
        </p>

        {loading ? (
          <div className="grid grid-3 stories-grid"><Skeleton height="22rem" count={3} /></div>
        ) : error ? (
          <EmptyState
            title={t("We couldn't load stories just now.", 'கதைகளை இப்போது ஏற்ற முடியவில்லை.')}
            body={t('Please try again in a moment.', 'சிறிது நேரம் கழித்து மீண்டும் முயலவும்.')}
            action={<Button variant="secondary" to="/insights">{t('Back to Insights', 'நுண்ணறிவுகளுக்குத் திரும்பு')}</Button>}
          />
        ) : list.length ? (
          <>
            <div ref={listRef}>
              <h2 className="visually-hidden">{t('All stories', 'அனைத்துக் கதைகள்')}</h2>
              <RevealGroup className="grid grid-3 stories-grid" key={`${brand}-${type}`}>
                {visible.map((s) => <StoryCard key={s.slug} story={s} />)}
              </RevealGroup>
            </div>
            {shown < list.length && (
              <div className="stories-more">
                <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>{t('Load more', 'மேலும் காட்டு')}</Button>
              </div>
            )}
          </>
        ) : filtered ? (
          <EmptyState
            title={t('No stories match these filters yet.', 'இந்த வடிகட்டிகளுக்குப் பொருந்தும் கதைகள் இன்னும் இல்லை.')}
            body={t('Try another brand or type, or see every story.', 'வேறு பிராண்டு அல்லது வகையை முயலுங்கள், அல்லது எல்லாக் கதைகளையும் பாருங்கள்.')}
            action={
              <Button variant="secondary" onClick={() => setParams({}, { replace: true })}>
                {t('Show all stories', 'அனைத்துக் கதைகளையும் காட்டு')}
              </Button>
            }
          />
        ) : (
          <EmptyState title={t('Stories are on their way.', 'கதைகள் விரைவில் வரும்.')} />
        )}
      </Section>

      <CTABand
        surface="night"
        accentWord="where"
        title={t('Start where you are.', 'நீங்கள் இருக்கும் இடத்திலிருந்தே தொடங்குங்கள்.')}
        body={t(
          "Make a free StartNet X profile and we'll show you the next step that fits you: an event, a course, a circle or a programme.",
          'இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள்; உங்களுக்குப் பொருந்தும் அடுத்த அடியை நாங்கள் காட்டுவோம்: ஒரு நிகழ்வு, ஒரு பாடநெறி, ஒரு வட்டம் அல்லது ஒரு திட்டம்.',
        )}
        actions={
          <>
            <Button href={snxLink('/signup', { src: 'stories', lang })}>{t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}</Button>
            <Button variant="tertiary" to="/programmes" icon={ArrowRight}>{t('Find your programme', 'உங்கள் திட்டத்தைக் கண்டறியுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}

function FilterRow({ id, label, options, value, onChange, brandDots = false }) {
  const { t } = useLang();
  return (
    <div className="stories-filters__row">
      <span className="stories-filters__label" id={`stories-f-${id}`}>{label}</span>
      <div className="stories-filters__chips" role="group" aria-labelledby={`stories-f-${id}`}>
        {options.map((o) => (
          <button
            key={o.value || 'all'}
            type="button"
            className={`stories-chip${o.value && brandDots ? ` stories-chip--${o.value}` : ''}`}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.value && brandDots && <span className="stories-chip__dot" aria-hidden="true" />}
            {t(o.label[0], o.label[1])}
          </button>
        ))}
      </div>
    </div>
  );
}
