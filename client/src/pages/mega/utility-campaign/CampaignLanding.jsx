// /go/:slug — T16 Campaign landing (Book 1 Part B §2.2 + §6.2 T16; Book 3 Part B §4 T16, C13 campaign hero).
// Order: M01 campaign hero (countdown, one CTA) → 3 benefits → tracks → key dates → what comes next →
// M12 proof → M17 FAQ → M04 single CTA + WhatsApp. noindex by default. No breadcrumbs (Book 1 Part B §3.7:
// "every template except Home, Campaign landing and 404"). The minimal header variant (C02 `minimal`) is
// applied by the integrator's layout, not here. Unknown slug → NotFound.
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, CalendarClock, Code2, MessageCircle, Rocket, Trophy } from 'lucide-react';
import {
  Seo, Section, SectionHeader, KineticHeadline, Badge, Button, ArtImage, FactBand, Stat, Accordion, CTABand,
  Reveal, RevealGroup, InlineMarks, Dot,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { waLink } from '../../../lib/links.js';
import { formatDate } from '../../../lib/format.js';
import NotFound from '../../utility/LazyNotFound.jsx';
import { getCampaign, campaignCtaHref, utmFrom } from './campaigns.js';
import { isPlaceholderText } from '../../../components/_placeholders.js';
import './CampaignLanding.css';
import '../../utility/restKit.css';

const BENEFIT_ICONS = { build: Code2, compete: Trophy, continue: Rocket };

/* ------------------------------------------------------------------ countdown */

// C13 countdown (Book 3): days only, absolute date always shown, aria-live="off", no ticking seconds.
// Updates at IST midnight. With no date it shows the placeholder, never a number.
const IST_OFFSET_MIN = 330;
const istDay = (ms) => Math.floor((ms + IST_OFFSET_MIN * 60000) / 86400000);
const msToNextIstMidnight = (now) => Math.max(1000, (istDay(now) + 1) * 86400000 - IST_OFFSET_MIN * 60000 - now + 500);

function useDeadlineState(deadline) {
  const closes = deadline?.closes || null;
  const opens = deadline?.opens || null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!closes) return undefined;
    let timer;
    const schedule = () => {
      timer = setTimeout(() => { setNow(Date.now()); schedule(); }, msToNextIstMidnight(Date.now()));
    };
    schedule();
    return () => clearTimeout(timer);
  }, [closes]);

  const closeMs = closes ? new Date(closes).getTime() : NaN;
  const opensMs = opens ? new Date(opens).getTime() : NaN;
  if (Number.isNaN(closeMs)) return { state: 'tbc', days: null, opens, closes };
  if (now > closeMs) return { state: 'closed', days: null, opens, closes };
  if (!Number.isNaN(opensMs) && now < opensMs) return { state: 'soon', days: null, opens, closes };
  const days = istDay(closeMs) - istDay(now);
  return { state: days <= 0 ? 'today' : 'open', days, opens, closes };
}

function CampaignCountdown({ info }) {
  const { t } = useLang();
  const { state, days, opens, closes } = info;
  const dateText = closes ? `${formatDate(closes)}, 23:59 IST` : '';

  // No confirmed dates yet: show nothing rather than a placeholder date.
  if (state === 'tbc') return null;
  let text;
  if (state === 'closed') {
    text = t('Registration has closed.', 'பதிவு நிறைவடைந்தது.');
  } else if (state === 'soon') {
    text = t(`Registration opens ${formatDate(opens)} · closes ${dateText}`, `பதிவு ${formatDate(opens)} அன்று தொடங்கும் · ${dateText} அன்று நிறைவடையும்`);
  } else if (state === 'today') {
    text = t('Closes today at 23:59 IST', 'இன்று 23:59 IST-க்கு நிறைவடையும்');
  } else {
    text = t(
      `Registration closes in ${days} ${days === 1 ? 'day' : 'days'} · ${dateText}`,
      `பதிவு நிறைவடைய இன்னும் ${days} நாள் · ${dateText}`
    );
  }

  return (
    <div className={`campaign-countdown campaign-countdown--${state}`} aria-live="off">
      {state === 'open' ? (
        <span className="campaign-countdown__days tnum" aria-hidden="true">
          <span className="campaign-countdown__num">{days}</span>
          <span className="campaign-countdown__unit">{t(days === 1 ? 'day' : 'days', 'நாள்')}</span>
        </span>
      ) : (
        <CalendarClock className="campaign-countdown__icon" size={22} aria-hidden="true" />
      )}
      <p className="campaign-countdown__text">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ metrics */

// /api/metrics labels and notes are English only; the campaign record carries Tamil overrides per key.
function localiseMetric(m, text, lang) {
  if (lang !== 'ta' || !text) return m;
  const out = { ...m };
  if (text.label) out.label = text.label[1] || m.label;
  if (text.note && m.note) out.note = text.note[1] || m.note;
  if (text.asAtLabel && m.asAt === text.asAtLabel[0]) out.asAt = text.asAtLabel[1];
  return out;
}

function useCampaignMetrics(c, lang) {
  const keys = useMemo(() => {
    const extra = (c.next?.items || []).map((i) => i.metricKey).filter(Boolean);
    return Array.from(new Set([...(c.proof?.keys || []), ...extra]));
  }, [c]);
  const { data } = useApi(keys.length ? `/api/metrics?key=${keys.map(encodeURIComponent).join(',')}` : null);

  return useMemo(() => {
    const byKey = {};
    (c.proof?.fallback || []).forEach((m) => { byKey[m.key] = m; });
    if (Array.isArray(data)) {
      data.forEach((m) => {
        if (m && m.key) byKey[m.key] = { ...m, asAt: m.asAt || m.asAtLabel || null };
      });
    }
    const text = c.proof?.text || {};
    Object.keys(byKey).forEach((k) => { byKey[k] = localiseMetric(byKey[k], text[k], lang); });
    return byKey;
  }, [data, c, lang]);
}

/* ------------------------------------------------------------------ page */

function Campaign({ c }) {
  const { t, lang, localePath } = useLang();
  const L = (pair) => (Array.isArray(pair) ? t(pair[0], pair[1]) : pair);
  const { search } = useLocation();
  const utm = useMemo(() => utmFrom(search), [search]);
  const href = campaignCtaHref(c, lang, utm);
  const wa = waLink(c.whatsapp?.text || 'Hi StartNet', `${c.cta.src}, ${lang}`);
  const deadline = useDeadlineState(c.deadline);
  const metrics = useCampaignMetrics(c, lang);

  const proofList = (c.proof?.keys || []).map((k) => metrics[k]).filter(Boolean).slice(0, 4);
  const status = { tbc: 'upcoming', soon: 'upcoming', open: 'open', today: 'closing', closed: 'closed' }[deadline.state];
  const statusLabel = {
    tbc: t('Registration opens soon', 'பதிவு விரைவில் தொடங்கும்'),
    soon: t('Registration opens soon', 'பதிவு விரைவில் தொடங்கும்'),
    open: t('Registration open', 'பதிவு திறந்துள்ளது'),
    today: t('Closing today', 'இன்று நிறைவடைகிறது'),
    closed: t('Registration closed', 'பதிவு நிறைவடைந்தது'),
  }[deadline.state];
  const closingTitle = L(c.closing?.title) || L(c.cta.label);
  const closingHasStop = /[^.]\.$/.test(closingTitle);

  return (
    <div className="campaign" data-brand={c.brand || undefined}>
      {/* noindex, follow: campaign landings are thin, time-boxed duplicates of the evergreen brand page (here
          /vibe/vibathon), Book 1 Part B §6.2 T16. Seo writes the robots tag. */}
      <Seo noindex title={L(c.seoTitle)} description={L(c.seoDescription)} />

      {/* ---------- C13 campaign hero: Night + accent (the page's one Night band) ---------- */}
      <Section surface="night" brand={c.brand || undefined} pad="none" className="campaign-hero" labelledBy="campaign-title">
        <div className="campaign-hero__grid">
          <div className="campaign-hero__copy">
            <div className="cluster campaign-hero__chips">
              <Badge kind="status" status={status}>{statusLabel}</Badge>
              <Badge kind="lang">English · தமிழ்</Badge>
            </div>
            <KineticHeadline as="h1" id="campaign-title" text={c.h1} className="campaign-hero__title" />
            {c.eyebrow && <p className="campaign-hero__endorse">{L(c.eyebrow)}</p>}
            <p className="body-lg campaign-hero__lede">{L(c.lede)}</p>
            <CampaignCountdown info={deadline} />
            <div className="campaign-hero__actions" data-primary-cta="">
              <Button variant="brand" size="lg" href={href} icon={ArrowRight}>
                {L(c.cta.label)}
              </Button>
            </div>
            {c.microcopy && (
              <p className="campaign-hero__micro">
                <InlineMarks text={L(c.microcopy)} />
              </p>
            )}
          </div>
          <div className="campaign-hero__art" aria-hidden="true">
            <ArtImage variant="network" brand={c.brand || undefined} night ratio="4/5" seed={27} animate alt="" />
          </div>
        </div>
      </Section>

      {/* ---------- 3 benefits ---------- */}
      {c.benefits?.length > 0 && (
        <Section surface="paper" className="campaign-benefits" labelledBy="campaign-benefits-title">
          <SectionHeader id="campaign-benefits-title" title={t('What it is', 'இது என்ன')} />
          <RevealGroup as="ol" className="campaign-benefits__grid" role="list">
            {c.benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[b.id] || Rocket;
              return (
                <li key={b.id} className="campaign-benefits__item">
                  <span className="campaign-benefits__icon" aria-hidden="true"><Icon size={24} strokeWidth={1.75} /></span>
                  <span className="campaign-benefits__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="h4 campaign-benefits__title">{L(b.title)}</h3>
                  <p className="campaign-benefits__body"><InlineMarks text={L(b.body)} /></p>
                </li>
              );
            })}
          </RevealGroup>
        </Section>
      )}

      {/* ---------- Tracks ---------- */}
      {c.tracks?.items?.length > 0 && (
        <Section surface="white" className="campaign-tracks" labelledBy="campaign-tracks-title">
          <SectionHeader
            id="campaign-tracks-title"
            title={L(c.tracks.title)}
            lede={c.tracks.note && !isPlaceholderText(L(c.tracks.note)) ? <InlineMarks text={L(c.tracks.note)} /> : undefined}
          />
          <RevealGroup as="ul" className="campaign-tracks__grid" role="list">
            {c.tracks.items.map((tr, i) => (
              <li key={tr.id} className="campaign-tracks__item">
                <span className="campaign-tracks__num tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h5 campaign-tracks__title">{L(tr.title)}</h3>
                <p className="campaign-tracks__body"><InlineMarks text={L(tr.body)} /></p>
              </li>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* ---------- Key dates ---------- */}
      {c.dates?.items?.length > 0 && (
        <Section surface="paper" className="campaign-dates" labelledBy="campaign-dates-title">
          <SectionHeader
            id="campaign-dates-title"
            title={L(c.dates.title)}
            lede={c.dates.note && !isPlaceholderText(L(c.dates.note)) ? <InlineMarks text={L(c.dates.note)} /> : undefined}
          />
          <Reveal as="ol" className="campaign-dates__list" role="list">
            {c.dates.items.map((d) => (
              <li key={d.id} className="campaign-dates__item">
                <span className="campaign-dates__marker" aria-hidden="true" />
                {/* A stage date that is not supplied yet is left out (no placeholder). */}
                {d.when && <p className="campaign-dates__when tnum">{formatDate(d.when)}</p>}
                <h3 className="h5 campaign-dates__stage">{L(d.stage)}</h3>
                <p className="campaign-dates__what"><InlineMarks text={L(d.what)} /></p>
              </li>
            ))}
          </Reveal>
        </Section>
      )}

      {/* ---------- Prizes and what comes next ---------- */}
      {c.next?.items?.length > 0 && (
        <Section surface="sunken" className="campaign-next" labelledBy="campaign-next-title">
          <SectionHeader id="campaign-next-title" title={L(c.next.title)} />
          <RevealGroup as="ul" className="campaign-next__grid" role="list">
            {/* An item whose only content is a placeholder is hidden; a placeholder body next to a real figure is left out. */}
            {c.next.items.map((n) => {
              const m = n.metricKey ? metrics[n.metricKey] : null;
              const phBody = isPlaceholderText(L(n.body));
              if (phBody && !m) return null;
              return (
                <li key={n.id} className="campaign-next__item">
                  <h3 className="h5 campaign-next__title">{L(n.title)}</h3>
                  {!phBody && <p className="campaign-next__body"><InlineMarks text={L(n.body)} /></p>}
                  {m && (
                    <div className="campaign-next__ref">
                      {n.metricLead && <p className="campaign-next__lead">{L(n.metricLead)}</p>}
                      <Stat metric={m} variant="compact" />
                    </div>
                  )}
                </li>
              );
            })}
          </RevealGroup>
        </Section>
      )}

      {/* ---------- M12 proof ---------- */}
      {proofList.length > 0 && (
        <Section surface="paper" className="campaign-proof">
          <FactBand metrics={proofList} title={L(c.proof.title)} footnote={c.proof.footnote ? L(c.proof.footnote) : undefined} />
        </Section>
      )}

      {/* ---------- M17 FAQ ---------- */}
      {c.faq?.length > 0 && (
        <Section surface="white" className="campaign-faq rk-faq" labelledBy="campaign-faq-title">
          <div className="rk-faq__grid">
            <SectionHeader id="campaign-faq-title" title={t('Questions', 'கேள்விகள்')} />
            <div className="rk-faq__body">
              <Accordion
                items={c.faq.map((f) => ({ id: `campaign-faq-${f.id}`, question: L(f.q), answer: <InlineMarks text={L(f.a)} /> }))}
              />
              {c.related?.to && (
                <p className="campaign-faq__more">
                  <Link to={localePath(c.related.to)} className="campaign-faq__link">
                    {L(c.related.label)} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </p>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* ---------- M04 single CTA + WhatsApp ---------- */}
      <CTABand
        surface="paper"
        brand={c.brand || undefined}
        className="campaign-close"
        title={
          closingHasStop ? (
            <>
              {closingTitle.slice(0, -1)}
              <Dot />
            </>
          ) : (
            closingTitle
          )
        }
        body={c.closing?.body ? L(c.closing.body) : undefined}
        actions={
          <>
            <Button variant="brand" size="lg" href={href} icon={ArrowRight}>
              {L(c.cta.label)}
            </Button>
            {c.whatsapp && (
              <Button variant="whatsapp" size="lg" icon={MessageCircle} href={wa}>
                {L(c.whatsapp.label)}
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}

export default function CampaignLanding() {
  const { slug } = useParams();
  const campaign = getCampaign(slug);
  if (!campaign) return <NotFound />;
  return <Campaign key={slug} c={campaign} />;
}
