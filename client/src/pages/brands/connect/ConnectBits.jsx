import {
  EmptyState, EventCard, Placeholder, RevealGroup, Scroller, Skeleton, Stat, TagChip, WhatsAppButton,
} from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import './ConnectBits.css';

// Small Connect building blocks shared by ConnectHome and ConnectSub. Tamil strings are drafts pending native review.

/**
 * Button label with a shorter phone version (< 480px; < 640px for Tamil). Both are real text, and only
 * the visible one is exposed to assistive technology (display: none).
 */
export function FitLabel({ long, short }) {
  if (!short || short === long) return long;
  return (
    <>
      <span className="connect-fit__long">{long}</span>
      <span className="connect-fit__short">{short}</span>
    </>
  );
}

export function CircleMembership({ variant = 'compact' }) {
  const { t } = useLang();
  return (
    <Stat
      value={30000}
      prefix="₹"
      unit={t('a year', 'ஆண்டுக்கு')}
      label={t('Circle membership from (includes StartNet X Pro)', 'Circle உறுப்பினர் கட்டணம், இதிலிருந்து (StartNet X Pro உட்பட)')}
      tag="C"
      note={t('Indicative price, shown before the published rate card.', 'உத்தேச விலை; அதிகாரபூர்வ கட்டண அட்டை வெளியாகும் முன் காட்டப்படுகிறது.')}
      source={t('StartNet indicative pricing (rate card to be published)', 'StartNet உத்தேச விலை (கட்டண அட்டை வெளியிடப்பட உள்ளது)')}
      variant={variant}
    />
  );
}

export function SwitchFacts() {
  const { t } = useLang();
  return (
    <dl className="connect-home__facts">
      <div><dt>{t('Length', 'காலம்')}</dt><dd>{t('12 weeks, evenings and weekends', '12 வாரங்கள், மாலை நேரங்களும் வார இறுதிகளும்')}</dd></div>
      <div><dt>{t('Fee', 'கட்டணம்')}</dt><dd><Placeholder>[placeholder — rate card; indicative ₹35,000–75,000]</Placeholder> <TagChip tag="C" /></dd></div>
      {/* Next cohort date: hidden until StartNet supplies it. */}
      <div><dt>{t('Format', 'வடிவம்')}</dt><dd>{t('Chennai in person + online', 'சென்னையில் நேரடியாக + இணையவழி')}</dd></div>
    </dl>
  );
}

export function UpcomingConnect({ events, loading, error }) {
  const { t } = useLang();
  if (loading) return <Skeleton height="22rem" count={3} />;
  if (error || !events?.length) {
    return (
      <EmptyState
        title={t('Dates soon', 'தேதிகள் விரைவில்')}
        body={t('New Connect dates are announced first to the Connect community on WhatsApp.', 'புதிய Connect தேதிகள் முதலில் WhatsApp-இல் Connect சமூகத்துக்கு அறிவிக்கப்படும்.')}
        action={<WhatsAppButton text="CONNECT" label={t('Get updates on WhatsApp', 'WhatsApp-இல் தகவல்களைப் பெறுங்கள்')} />}
      />
    );
  }
  if (events.length > 3) {
    return (
      <Scroller label={t('Upcoming Connect events', 'வரவிருக்கும் Connect நிகழ்வுகள்')} itemWidth="min(85vw, 24rem)">
        {events.map((e) => <EventCard key={e.slug} event={e} />)}
      </Scroller>
    );
  }
  return (
    <RevealGroup className="grid grid-3">
      {events.map((e) => <EventCard key={e.slug} event={e} />)}
    </RevealGroup>
  );
}
