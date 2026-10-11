import { Scroller, Section, Skeleton, StoryCard } from '../../../components';
import { realStories } from '../../../components/_placeholders.js';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import './Women.css';

/**
 * Stories section: /api/stories?brand=women, real (consented, published) stories only. `children` is the section
 * header. Seeded placeholder stories are never listed, and the whole section (header included) renders nothing
 * until at least one real story exists.
 */
export default function WomenStories({ limit = 8, surface = 'sunken', children }) {
  const { t } = useLang();
  const { data, loading } = useApi('/api/stories?brand=women');
  const stories = realStories(data).slice(0, limit);

  if (!loading && !stories.length) return null;

  return (
    <Section surface={surface}>
      {children}
      {loading ? (
        <Skeleton height="16rem" count={1} />
      ) : (
        <Scroller label={t('StartNet Women founder stories', 'StartNet Women நிறுவனர் கதைகள்')} itemWidth="min(85vw, 22rem)">
          {stories.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </Scroller>
      )}
    </Section>
  );
}
