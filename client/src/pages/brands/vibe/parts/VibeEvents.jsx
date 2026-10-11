import { useApi } from '../../../../hooks/useApi.js';
import { useLang } from '../../../../lib/i18n.jsx';
import { waLink } from '../../../../lib/links.js';
import { EventCard, Scroller, EmptyState, Skeleton, Button } from '../../../../components';
import { tx } from '../vibeContent.js';
import './VibeEvents.css';

/**
 * Upcoming StartNet Vibe events from /api/events?brand=vibe&when=upcoming.
 * WhatsApp CTA uses Button variant="whatsapp" + waLink (React reserves the `ref` prop, so WhatsAppButton's `ref` cannot be passed).
 * @param {{ series?: string, waRef?: string, label?: string }} props
 */
export default function VibeEvents({ series, waRef = 'vibe-events', label }) {
  const { t, lang } = useLang();
  const qs = new URLSearchParams({ brand: 'vibe', when: 'upcoming', ...(series ? { series } : {}) });
  const { data, loading, error } = useApi(`/api/events?${qs.toString()}`);
  const events = Array.isArray(data) ? data : [];

  if (loading) return <div className="vibe-events"><Skeleton height="18rem" count={1} /></div>;

  if (error || events.length === 0) {
    return (
      <div className="vibe-events">
        <EmptyState
          title={t('No Vibe events are listed right now.', 'இப்போது Vibe நிகழ்வுகள் எதுவும் பட்டியலில் இல்லை.')}
          body={t('Get alerts on WhatsApp. Your district helps us send only nearby events.', 'WhatsApp-இல் அறிவிப்புகளைப் பெறுங்கள். உங்கள் மாவட்டத்தைக் கொண்டு அருகிலுள்ள நிகழ்வுகளை மட்டுமே அனுப்புவோம்.')}
          action={
            <div className="cluster">
              <Button variant="whatsapp" href={waLink('VIBATHON', `${waRef}, ${lang}`)}>{tx(t, 'Get updates on WhatsApp')}</Button>
              <Button variant="tertiary" to="/events">{tx(t, 'See upcoming events')}</Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="vibe-events">
      <Scroller label={label || t('Upcoming StartNet Vibe events', 'வரவிருக்கும் StartNet Vibe நிகழ்வுகள்')} itemWidth="min(22rem, 85vw)">
        {events.map((ev) => <EventCard key={ev.slug} event={ev} />)}
      </Scroller>
    </div>
  );
}
