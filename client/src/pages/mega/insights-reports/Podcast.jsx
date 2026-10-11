// /insights/podcast — Tamil and English podcast landing (Book 1 Part B §2.2 "Podcast · /insights/podcast (+ episodes) · T15 · T09 ·
// Tamil and English podcast · Talent · Listen · P3"; §8 content model: Story type `podcast`). Paper page, no Night band.
// Data: GET /api/stories?type=podcast (episodes, when published). Show name, subscribe links and episodes are placeholders until supplied.
import { useMemo, useState } from 'react';
import { ArrowRight, Bell, Headphones, Mic, Rss } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Badge, Button, Reveal, RevealGroup, StoryCard, EmptyState, Skeleton, CTABand,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import NotifyForm from './NotifyForm.jsx';
import './Podcast.css';
import { realStories } from '../../../components/_placeholders.js';

const LANGS = [
  { value: '', en: 'All', ta: 'அனைத்தும்' },
  { value: 'ta', en: 'Tamil', ta: 'தமிழ்' },
  { value: 'en', en: 'English', ta: 'ஆங்கிலம்' },
];

// Platform names only; links are placeholders until StartNet publishes the feed.
const PLATFORMS = [
  { key: 'spotify', label: 'Spotify', icon: Headphones },
  { key: 'apple', label: 'Apple Podcasts', icon: Mic },
  { key: 'youtube', label: 'YouTube', icon: Headphones },
  { key: 'rss', label: 'RSS', icon: Rss },
];

const episodeLang = (s) => String(s.language || s.lang || '').toLowerCase();

export default function Podcast() {
  const { t } = useLang();
  const { data, loading, error } = useApi('/api/stories?type=podcast');
  const [lang, setLang] = useState('');
  const episodes = useMemo(
    () => realStories(data).filter((s) => s.type === 'podcast').sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))),
    [data],
  );
  const shown = lang ? episodes.filter((e) => episodeLang(e) === lang || episodeLang(e) === 'both') : episodes;

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('StartNet podcast: Tamil Nadu founder conversations', 'StartNet பாட்காஸ்ட்: தமிழ்நாட்டு நிறுவனர் உரையாடல்கள்')}
        description={t(
          'The StartNet podcast: conversations with people building companies in Tamil Nadu, in Tamil and English. The first episodes are being planned.',
          'StartNet பாட்காஸ்ட்: தமிழ்நாட்டில் நிறுவனங்களை உருவாக்குபவர்களுடன் தமிழிலும் ஆங்கிலத்திலும் உரையாடல்கள். முதல் அத்தியாயங்கள் திட்டமிடப்பட்டு வருகின்றன.',
        )}
      />

      <PageHero
        eyebrow={t('Insights · Podcast', 'நுண்ணறிவுகள் · பாட்காஸ்ட்')}
        titleClass="display-xl podcast-hero__title"
        title={t('Founder conversations, in Tamil and English.', 'நிறுவனர் உரையாடல்கள், தமிழிலும் ஆங்கிலத்திலும்.')}
        lede={t(
          'Conversations with people building companies across Tamil Nadu, in the language they think in. The first episodes are being planned.',
          'தமிழ்நாடு முழுவதும் நிறுவனங்களை உருவாக்குபவர்களுடன், அவர்கள் சிந்திக்கும் மொழியிலேயே உரையாடல்கள். முதல் அத்தியாயங்கள் திட்டமிடப்பட்டு வருகின்றன.',
        )}
        breadcrumbs={[{ label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' }, { label: t('Podcast', 'பாட்காஸ்ட்') }]}
        art={{ variant: 'dot', ratio: '1/1', seed: 17, alt: '', animate: true, label: t('Tamil · English', 'தமிழ் · English') }}
        meta={
          <div className="podcast-hero__badges">
            <Badge kind="lang"><span lang="ta">தமிழ்</span></Badge>
            <Badge kind="lang"><span lang="en">English</span></Badge>
            <Badge kind="status" status="upcoming">{t('Planned', 'திட்டமிடப்பட்டது')}</Badge>
          </div>
        }
        actions={
          <>
            <Button href="#podcast-notify" icon={Bell}>{t('Tell me when it launches', 'தொடங்கியதும் தெரிவியுங்கள்')}</Button>
            <Button variant="tertiary" to="/insights/stories">{t('Read founder stories', 'நிறுவனர் கதைகளைப் படியுங்கள்')}</Button>
          </>
        }
      />

      {/* Subscribe links */}
      <Section surface="white" pad="sm" labelledBy="podcast-listen-h">
        <div className="podcast-listen">
          <div>
            <h2 id="podcast-listen-h" className="h4">{t('Listen on', 'இங்கே கேளுங்கள்')}</h2>
            <p className="podcast-muted">
              {t('Subscribe links go live with the first episode.', 'முதல் அத்தியாயத்துடன் சந்தா இணைப்புகள் செயல்படும்.')}
            </p>
          </div>
          <ul className="podcast-listen__list">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.key} className="podcast-listen__item">
                  <Icon size={20} aria-hidden="true" />
                  <span className="podcast-listen__name">{p.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Episodes */}
      <Section surface="paper" labelledBy="podcast-episodes-h">
        <SectionHeader
          id="podcast-episodes-h"
          eyebrow={t('Episodes', 'அத்தியாயங்கள்')}
          title={t('Latest episodes', 'சமீபத்திய அத்தியாயங்கள்')}
        />
        <div className="podcast-filter" role="group" aria-label={t('Filter by language', 'மொழி வாரியாக வடிகட்டு')}>
          {LANGS.map((l) => (
            <button
              key={l.value || 'all'}
              type="button"
              className="podcast-filter__chip"
              aria-pressed={lang === l.value}
              onClick={() => setLang(l.value)}
            >
              {t(l.en, l.ta)}
            </button>
          ))}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {loading ? t('Loading episodes', 'அத்தியாயங்கள் ஏற்றப்படுகின்றன') : t(`${shown.length} episodes`, `${shown.length} அத்தியாயங்கள்`)}
        </p>

        {loading ? (
          <div className="podcast-grid"><Skeleton height="16rem" count={3} /></div>
        ) : shown.length > 0 ? (
          <RevealGroup className="podcast-grid" key={lang || 'all'}>
            {shown.map((s) => (
              <div key={s.slug} className="podcast-grid__item"><StoryCard story={s} /></div>
            ))}
          </RevealGroup>
        ) : (
          <div className="podcast-empty">
            <EmptyState
              title={error ? t("We couldn't load episodes just now.", 'அத்தியாயங்களை இப்போது ஏற்ற முடியவில்லை.') : t('No episodes yet.', 'இன்னும் அத்தியாயங்கள் இல்லை.')}
              body={
                <>
                  {t(
                    'Episodes will be listed here, each with its language and length.',
                    'ஒவ்வொரு அத்தியாயமும் அதன் மொழி, நேரத்துடன் இங்கே பட்டியலிடப்படும்.',
                  )}
                </>
              }
              action={<Button variant="secondary" href="#podcast-notify" icon={Bell}>{t('Notify me', 'எனக்கு அறிவியுங்கள்')}</Button>}
            />
          </div>
        )}
      </Section>

      <CTABand
        className="podcast-cta"
        surface="paper"
        title={t('Building something we should hear about?', 'நாங்கள் கேட்க வேண்டிய ஒன்றை உருவாக்குகிறீர்களா?')}
        body={t(
          'Tell us about your company, your district and the language you would like to talk in.',
          'உங்கள் நிறுவனம், உங்கள் மாவட்டம், நீங்கள் பேச விரும்பும் மொழி பற்றிச் சொல்லுங்கள்.',
        )}
        actions={<Button variant="secondary" to="/contact?topic=media" icon={ArrowRight}>{t('Suggest a guest', 'விருந்தினரைப் பரிந்துரையுங்கள்')}</Button>}
      />

      <Section surface="white" id="podcast-notify" labelledBy="podcast-notify-h">
        <div className="podcast-notify">
          <Reveal className="podcast-notify__copy">
            <p className="eyebrow">{t('Podcast', 'பாட்காஸ்ட்')}</p>
            <h2 id="podcast-notify-h" className="h2">
              {t('Hear the first episode', 'முதல் அத்தியாயத்தைக் கேளுங்கள்')}<span className="dot">.</span>
            </h2>
            <p className="podcast-muted">
              {t("Leave your email and we'll tell you when the podcast launches.", 'உங்கள் மின்னஞ்சலைத் தந்தால், பாட்காஸ்ட் தொடங்கியதும் தெரிவிப்போம்.')}
            </p>
          </Reveal>
          <NotifyForm context="podcast" what={t('the podcast', 'பாட்காஸ்ட்')} withOrg={false} />
        </div>
      </Section>
    </>
  );
}
