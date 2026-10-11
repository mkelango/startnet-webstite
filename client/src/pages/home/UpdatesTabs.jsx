import { Link } from 'react-router-dom';
import { Tabs, Stat, Skeleton, Button, EmptyState } from '../../components';
import { isPlaceholderText, realMetrics } from '../../components/_placeholders.js';
import { useApi } from '../../hooks/useApi.js';
import { useLang, contentLangFor } from '../../lib/i18n.jsx';
import { formatDate } from '../../lib/format.js';
import { localizeMetric, pickLang } from './homeI18n.js';
import './UpdatesTabs.css';
import { eventPath } from '../../components/_utils.js';

/* News · Events · Founder Ledger (Book 4 IX-17; Informa News / Calendar / Results, R1 §2 #5).
   DESIGN-v2 6.1: a pill segmented control with the shared sliding indicator; dated hairline rows; EmptyState. */

function DatedList({ items, empty }) {
  const { lang } = useLang();
  // Empty list: the shared EmptyState (a Card-framed block with the mono pulli mini-art) and the existing sentence.
  if (!items.length) return <EmptyState className="home-updates__empty" body={empty} />;
  return (
    <ul className="home-updates__list">
      {items.map((it) => {
        // API titles may only exist in English: mark them so screen readers switch voice on /ta.
        const titleLang = contentLangFor(lang, it.title);
        return (
          <li key={it.key} className="home-updates__item">
            <time className="home-updates__date small tnum" dateTime={it.date}>{formatDate(it.date, lang)}</time>
            <div className="home-updates__body">
              {it.href ? (
                <a className="home-updates__title" href={it.href} lang={titleLang}>{it.title}</a>
              ) : (
                <Link className="home-updates__title" to={it.to} lang={titleLang}>{it.title}</Link>
              )}
              {it.meta && <p className="home-updates__meta small muted">{it.meta}</p>}
            </div>
            <span className="home-updates__arrow" aria-hidden="true">→</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function UpdatesTabs({ events, eventsLoading }) {
  const { lang, t, localePath } = useLang();
  const press = useApi('/api/press');
  const ledger = useApi('/api/ledger');

  const news = (Array.isArray(press.data) ? press.data : [])
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 6)
    .map((p) => ({
      key: p.slug, date: p.date, title: pickLang(p, 'title', lang),
      ...(p.url ? { href: p.url } : { to: localePath('/media') }),
      meta: [p.kind === 'release' ? t('Press release', 'செய்திக் குறிப்பு') : t('Coverage', 'ஊடகச் செய்தி'), p.outlet].filter(Boolean).join(' · '),
    }));

  const formatLabel = (f) => (f === 'online' ? t('Online', 'இணையவழி') : f === 'hybrid' ? t('Hybrid', 'கலப்பு முறை') : t('In person', 'நேரில்'));
  const evts = (Array.isArray(events) ? events : []).slice(0, 6).map((e) => ({
    key: e.slug, date: e.date, title: pickLang(e, 'title', lang), to: localePath(eventPath(e)),
    meta: [pickLang(e, 'district', lang) || pickLang(e, 'city', lang), formatLabel(e.format), e.price === 'free' ? t('Free', 'இலவசம்') : null].filter(Boolean).join(' · '),
  }));

  const L = ledger.data;
  const kpis = realMetrics(L?.kpis).slice(0, 4);

  const tabs = [
    {
      id: 'news',
      label: t('News', 'செய்திகள்'),
      content: press.loading ? <Skeleton height="3.5rem" count={3} /> : (
        <>
          <DatedList
            items={news}
            empty={t('No news yet. Releases and coverage will be listed here with their dates.', 'இன்னும் செய்திகள் இல்லை. செய்திக் குறிப்புகளும் ஊடகச் செய்திகளும் அவற்றின் தேதிகளுடன் இங்கே பட்டியலிடப்படும்.')}
          />
          <div className="home-updates__more"><Button variant="tertiary" to="/media">{t('Go to Media', 'ஊடகப் பக்கத்துக்குச் செல்லுங்கள்')}</Button></div>
        </>
      ),
    },
    {
      id: 'events',
      label: t('Events', 'நிகழ்வுகள்'),
      content: eventsLoading ? <Skeleton height="3.5rem" count={3} /> : (
        <>
          <DatedList
            items={evts}
            empty={t('New dates are being confirmed. Get them first on WhatsApp or by email.', 'புதிய தேதிகள் உறுதி செய்யப்பட்டு வருகின்றன. WhatsApp அல்லது மின்னஞ்சல் வழியாக முதலில் பெறுங்கள்.')}
          />
          <div className="home-updates__more"><Button variant="tertiary" to="/events">{t('See all events', 'அனைத்து நிகழ்வுகளையும் பாருங்கள்')}</Button></div>
        </>
      ),
    },
    {
      id: 'ledger',
      label: 'Founder Ledger',
      content: ledger.loading ? <Skeleton height="6rem" count={1} /> : (
        <div className="home-updates__ledger">
          <p className="home-updates__ledger-head">
            {L?.period && !isPlaceholderText(L.period) ? <strong>{L.period}</strong> : (
              // First-edition date not supplied yet: the clause is left out rather than shown as a placeholder.
              <span>{t('Founder Ledger, quarterly.', 'Founder Ledger, காலாண்டுதோறும்.')}</span>
            )}
            {L?.asAt && (
              <span className="muted small">
                {' · '}{t(`as at ${formatDate(L.asAt, lang)}`, `${formatDate(L.asAt, lang)} நிலவரப்படி`)}
              </span>
            )}
          </p>
          {kpis.length > 0 && (
            <div className="home-updates__kpis">
              {kpis.map((m) => <Stat key={m.id || m.key} metric={localizeMetric(m, lang)} variant="compact" />)}
            </div>
          )}
          <p className="small muted">
            {t(
              'How we count, and what we got wrong. Every figure carries an A/B/C tag; C-tagged figures are never summed into A or B.',
              'நாங்கள் எப்படி எண்ணுகிறோம், எங்கே தவறினோம். ஒவ்வொரு எண்ணுக்கும் A/B/C குறிச்சொல் உண்டு; C குறிச்சொல் உள்ள எண்கள் ஒருபோதும் A அல்லது B உடன் கூட்டப்படுவதில்லை.'
            )}
          </p>
          <div className="home-updates__more">
            <Button variant="tertiary" to="/insights/founder-ledger">{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Button>
          </div>
        </div>
      ),
    },
  ];

  return <Tabs variant="pill" className="home-updates__tabs" tabs={tabs} defaultTab="news" label={t('Updates: news, events and the Founder Ledger', 'புதிய தகவல்கள்: செய்திகள், நிகழ்வுகள் மற்றும் Founder Ledger')} />;
}
