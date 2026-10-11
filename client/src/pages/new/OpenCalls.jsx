// /programmes/open-calls (and the /apply vanity route) — T15 list, P2 (Book 1 Part B §2 sitemap).
// "Accepting applications" = status open, closing or rolling. Cards: Book 3 C23 ProgrammeCard.
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, MessageCircle } from 'lucide-react';
import {
  Seo, PageHero, Section, ProgrammeCard, Button, EmptyState, Skeleton, RevealGroup,
} from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { waLink } from '../../lib/links.js';
import { webPageLd, itemListLd } from '../../lib/seo.js';
import { ACCEPTING_URL, acceptingCalls } from './callsMeta.js';
import './OpenCalls.css';

export default function OpenCalls() {
  const { t, lang, localePath } = useLang();
  const { data, loading, error } = useApi(ACCEPTING_URL);
  const list = acceptingCalls(data);
  const n = list.length;

  const countLine = loading && !data
    ? t('Loading programmes…', 'திட்டங்கள் ஏற்றப்படுகின்றன…')
    : t(
        `${n} ${n === 1 ? 'programme' : 'programmes'} open`,
        n === 1 ? '1 திட்டம் திறந்துள்ளது' : `${n} திட்டங்கள் திறந்துள்ளன`
      );

  const alertCta = (
    <Button
      variant="whatsapp"
      icon={MessageCircle}
      href={waLink('Hi StartNet, alert me when new programme calls open', `open-calls, ${lang}`)}
    >
      {t('Get call alerts on WhatsApp', 'WhatsApp-இல் அழைப்பு அறிவிப்புகள்')}
    </Button>
  );

  return (
    <>
      {/* SEO-TA: pending native review */}
      <Seo
        title={t('Open calls: programmes accepting applications', 'திறந்த அழைப்புகள்: இப்போது விண்ணப்பிக்கலாம்')}
        description={t(
          'StartNet programmes in Tamil Nadu accepting applications now, across Research, Vibe, Connect and Women. Closing soonest first, then rolling calls.',
          'தமிழ்நாட்டில் இப்போது விண்ணப்பங்களை ஏற்கும் StartNet திட்டங்கள்: Research, Vibe, Connect, Women. விரைவில் முடிபவை முதலில், பிறகு தொடர்ச்சியான அழைப்புகள்.'
        )}
        jsonLd={[
          webPageLd({
            path: lang === 'ta' ? '/ta/programmes/open-calls' : '/programmes/open-calls',
            type: 'CollectionPage',
            lang,
            name: t('Open calls: programmes accepting applications', 'திறந்த அழைப்புகள்'),
          }),
          itemListLd({
            name: t('Programmes accepting applications', 'விண்ணப்பங்களை ஏற்கும் திட்டங்கள்'),
            lang,
            items: list.map((p) => ({ name: lang === 'ta' && p.titleTa ? p.titleTa : p.title, path: `/programmes/${p.slug}` })),
          }),
        ]}
      />

      <PageHero
        eyebrow={t('Programmes', 'திட்டங்கள்')}
        title={t('Open calls', 'திறந்த அழைப்புகள்')}
        lede={t('Programmes accepting applications now', 'இப்போது விண்ணப்பங்களை ஏற்கும் திட்டங்கள்')}
        breadcrumbs={[
          { label: t('Programmes', 'திட்டங்கள்'), to: '/programmes' },
          { label: t('Open calls', 'திறந்த அழைப்புகள்') },
        ]}
        actions={
          <>
            <Button href="#open-calls-list" size="lg" icon={ArrowDown} data-primary-cta="">
              {t('See open calls', 'திறந்த அழைப்புகளைப் பார்க்க')}
            </Button>
            <Button variant="tertiary" to="/programmes">
              {t('All programmes', 'அனைத்துத் திட்டங்கள்')}
            </Button>
          </>
        }
      />

      <Section surface="white" id="open-calls-list" labelledBy="open-calls-count">
        <div className="open-calls-head">
          <h2 id="open-calls-count" className="h3 open-calls-count" aria-live="polite">{countLine}</h2>
          <p className="open-calls-note">
            {t('Closing soon first, then open, then rolling intake.', 'விரைவில் முடிபவை முதலில், பின்னர் திறந்தவை, பின்னர் தொடர் சேர்க்கை.')}
          </p>
        </div>

        {loading && !data ? (
          <div className="open-calls-grid" aria-hidden="true">
            {[0, 1, 2].map((i) => <Skeleton key={i} height="22rem" radius="var(--media-radius)" />)}
          </div>
        ) : error ? (
          <EmptyState
            title={t('We could not load programmes.', 'திட்டங்களை ஏற்ற முடியவில்லை.')}
            body={t('Check your connection and try again, or browse every programme.', 'இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும், அல்லது அனைத்துத் திட்டங்களையும் பார்க்கவும்.')}
            action={
              <div className="cluster open-calls-actions">
                <Button variant="secondary" onClick={() => window.location.reload()}>{t('Try again', 'மீண்டும் முயலவும்')}</Button>
                <Button variant="tertiary" to="/programmes">{t('All programmes', 'அனைத்துத் திட்டங்கள்')}</Button>
              </div>
            }
          />
        ) : n ? (
          <RevealGroup as="ul" className={`open-calls-grid${n === 4 ? ' open-calls-grid--four' : ''}`} role="list">
            {list.map((p) => (
              <li key={p.slug} className="open-calls-grid__item">
                <ProgrammeCard programme={p} />
              </li>
            ))}
          </RevealGroup>
        ) : (
          <EmptyState
            title={t('No calls are open right now.', 'இப்போது திறந்த அழைப்புகள் இல்லை.')}
            body={t(
              'New calls open through the year. Browse every programme, or get an alert on WhatsApp when one opens.',
              'ஆண்டு முழுவதும் புதிய அழைப்புகள் திறக்கும். அனைத்துத் திட்டங்களையும் பார்க்கவும், அல்லது திறக்கும்போது WhatsApp அறிவிப்பைப் பெறவும்.'
            )}
            action={
              <div className="cluster open-calls-actions">
                <Button to="/programmes" icon={ArrowRight}>{t('Find a programme', 'திட்டத்தைக் கண்டறியவும்')}</Button>
                {alertCta}
              </div>
            }
          />
        )}

        {n > 0 && (
          <div className="open-calls-foot">
            <p>
              {t('Not sure where to start?', 'எங்கே தொடங்குவது என்று தெரியவில்லையா?')}{' '}
              <Link className="open-calls-link" to={localePath('/join')}>
                {t('Answer two questions', 'இரண்டு கேள்விகளுக்குப் பதிலளிக்கவும்')} <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </p>
            {alertCta}
          </div>
        )}
      </Section>
    </>
  );
}
