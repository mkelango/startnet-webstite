// T12 Pricing (StartNet X). Copy and prices: Book 2 §7.3 verbatim. All prices indicative, ex-GST, tag C.
// Tamil: drafts in snxTamil.js (native review pending); plan names stay Latin, prices keep Latin digits.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Minus, ChevronLeft, ChevronRight, ArrowRight, MoveHorizontal } from 'lucide-react';
import { Seo, BrandHero, Section, SectionHeader, Button, Stat, TagChip, Accordion, RevealGroup, CTABand } from '../../components';
import { snxLink } from '../../lib/links.js';
import { formatINR } from '../../lib/format.js';
import { PLANS, FEATURES, PLAN_MICROCOPY, ORG_TIERS, PRICING_FAQ } from './snxContent.js';
import { useSnxT } from './snxTamil.js';
import { snxPageLd } from './snxSeo.js';
import './Pricing.css';
import '../utility/restKit.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Pricing() {
  const { t, tx, lang } = useSnxT();
  const [billing, setBilling] = useState('monthly');

  // Plans without an annual price (Team, Scale) stay on monthly billing even with the Annual toggle on.
  const planBilling = (p) => (billing === 'annual' && p.annual != null ? 'annual' : 'monthly');
  const planHref = (p) => (p.snx ? snxLink(p.snx, { src: 'snx-pricing', brand: 'x', lang, plan: p.id, billing: planBilling(p) }) : undefined);
  const faq = PRICING_FAQ.map((f) => ({ ...f, question: tx(f.question), answer: tx(f.answer) }));

  return (
    <>
      <Seo
        // JSON-LD: the free plan only; paid prices are indicative (tag C). SEO-TA: pending native review.
        title={t('StartNet X pricing: free for talent', 'StartNet X கட்டணம்: திறமையாளர்களுக்கு இலவசம்')}
        jsonLd={snxPageLd({ path: '/startnet-x/pricing', lang, name: t('StartNet X pricing: free for talent', 'StartNet X கட்டணம்: திறமையாளர்களுக்கு இலவசம்') })}
        description={t(
          'Free for individuals. Pro ₹499/month, Team ₹2,999/month, Scale ₹7,999/month. Annual licences for institutions, GCCs and government.',
          'தனிநபர்களுக்கு இலவசம். Pro ₹499/மாதம், Team ₹2,999/மாதம், Scale ₹7,999/மாதம். கல்வி நிறுவனங்கள், GCC-கள், அரசுக்கான ஆண்டு உரிமங்கள்.'
        )}
      />
      <BrandHero
        brand="x"
        compact
        title={tx('Free for talent. Paid for organisations.')}
        lede={tx('Your first step is always free. Pay only when you need more, and organisations pay for the outcomes they want.')}
        meta={
          <p className="snx-price__hero-meta">
            {t('All prices are indicative and exclude GST', 'அனைத்து விலைகளும் தோராயமானவை, GST நீங்கலாக')} <TagChip tag="C" />
          </p>
        }
        actions={
          <>
            <Button variant="secondary" href="#plans">{t('Individuals', 'தனிநபர்கள்')}</Button>
            <Button variant="secondary" href="#organisations">{t('Organisations', 'நிறுவனங்கள்')}</Button>
          </>
        }
      />

      {/* Plans */}
      <Section surface="paper" id="plans" labelledBy="plans-title">
        <div className="snx-price__plans-head">
          <h2 id="plans-title" className="h2">{t('Plans for individuals', 'தனிநபர்களுக்கான திட்டங்கள்')}<span className="dot">.</span></h2>
          <BillingToggle value={billing} onChange={setBilling} />
        </div>
        <PlanScroller>
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} billing={billing} href={planHref(p)} />
          ))}
        </PlanScroller>
        <ul className="snx-price__micro">
          {PLAN_MICROCOPY.map((m) => <li key={m}>{tx(m)}</li>)}
        </ul>
      </Section>

      {/* Comparison table — sticky first column, header sticks to the page */}
      <Section surface="white" labelledBy="compare-title">
        <h2 id="compare-title" className="h3 snx-price__compare-title">{t('Compare plans', 'திட்டங்களை ஒப்பிடுங்கள்')}</h2>
        <CompareTable billing={billing} planHref={planHref} />
      </Section>

      {/* Organisations */}
      <Section surface="paper" id="organisations">
        <SectionHeader
          eyebrow={t('Organisations', 'நிறுவனங்கள்')}
          title={t('Annual licences', 'ஆண்டு உரிமங்கள்')}
          lede={t(
            'Indicative prices for institutions, incubators, GCCs, government and investors.',
            'கல்வி நிறுவனங்கள், இன்குபேட்டர்கள், GCC-கள், அரசு, முதலீட்டாளர்களுக்கான தோராய விலைகள்.'
          )}
          action={<Button to="/partner/enquire?topic=snx" icon={ArrowRight}>{t('Request a quote', 'விலைப்புள்ளி கோருங்கள்')}</Button>}
        />
        <RevealGroup className="snx-orgs">
          {ORG_TIERS.map((o) => (
            <article key={o.tier} className="snx-org">
              <h3 className="h5 snx-org__tier">{tx(o.tier)}</h3>
              <p className="snx-org__includes">{tx(o.includes)}</p>
              <p className="snx-org__from">
                <span className="snx-org__from-label">{t('From', 'தொடக்க விலை')}</span>
                <span className="snx-org__amount">
                  <span className="snx-org__price tnum">{formatINR(o.from)}</span>
                  <span className="snx-org__suffix">{tx(o.suffix.trim())}</span>
                </span>
                <TagChip tag="C" />
              </p>
            </article>
          ))}
        </RevealGroup>
        <p className="snx-price__org-note">
          {t(
            "Institutions can pay by purchase order. Multi-year terms get a discount; we don't negotiate case by case.",
            'கல்வி நிறுவனங்கள் கொள்முதல் ஆணை மூலம் செலுத்தலாம். பல ஆண்டு ஒப்பந்தங்களுக்குத் தள்ளுபடி உண்டு; ஒவ்வொருவருக்கும் தனியாகப் பேரம் பேசுவதில்லை.'
          )}
        </p>
      </Section>

      {/* FAQ */}
      <Section surface="white" className="rk-faq">
        <div className="rk-faq__grid">
          <SectionHeader eyebrow={t('Billing', 'கட்டணம் செலுத்துதல்')} title={t('Pricing FAQ', 'கட்டணம்: அடிக்கடி கேட்கப்படும் கேள்விகள்')} />
          <div className="snx-price__faq">
            <Accordion faq items={faq} />
          </div>
        </div>
      </Section>

      <CTABand
        surface="night"
        title={t('Your first step is always free.', 'உங்கள் முதல் அடி எப்போதும் இலவசம்.')}
        body={tx('Free for individuals. Works on your phone, on WhatsApp and in Tamil.')}
        actions={
          <>
            <Button href={snxLink('/signup', { src: 'snx-pricing', brand: 'x', lang, plan: 'free' })}>{t('Create your free profile', 'உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்')}</Button>
            <Button variant="inverse" to="/partner/enquire?topic=snx">{t('Talk to us', 'எங்களிடம் பேசுங்கள்')}</Button>
          </>
        }
      />
    </>
  );
}

function priceText(p, billing, tx) {
  if (p.monthly === 0) return '₹0';
  if (billing === 'annual' && p.annual) return `${formatINR(p.annual)}${tx('/year')}`;
  return `${formatINR(p.monthly)}${tx('/month')}`;
}

/**
 * Comparison table. Below 768px it scrolls sideways only (vertical swipes reach the page), with a right-edge
 * fade and a swipe hint; a copy of the header row (aria-hidden) sticks to the page under the shell and follows
 * the table's horizontal scroll. From 768px the table fits and its own header row is sticky.
 */
function CompareTable({ billing, planHref }) {
  const { t, tx } = useSnxT();
  const scrollRef = useRef(null);
  const headRef = useRef(null);
  const tableRef = useRef(null);
  const headTableRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Mirror column widths onto the sticky header copy and keep its horizontal offset in step.
  const sync = useCallback(() => {
    const sc = scrollRef.current;
    const head = headRef.current;
    const table = tableRef.current;
    const headTable = headTableRef.current;
    if (!sc || !table) return;
    if (head && headTable && head.offsetParent !== null) {
      const src = table.tHead?.rows[0]?.cells;
      const dst = headTable.tHead?.rows[0]?.cells;
      if (src && dst) {
        headTable.style.width = `${table.getBoundingClientRect().width}px`;
        for (let i = 0; i < src.length && i < dst.length; i += 1) dst[i].style.width = `${src[i].getBoundingClientRect().width}px`;
      }
      head.scrollLeft = sc.scrollLeft;
    }
    const start = sc.scrollLeft <= 4;
    const end = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4;
    setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
  }, []);

  useIsoLayoutEffect(() => {
    sync();
  }, [billing, sync]);

  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return undefined;
    const onScroll = () => {
      if (headRef.current) headRef.current.scrollLeft = sc.scrollLeft;
      sync();
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => sync());
      ro.observe(sc);
      if (tableRef.current) ro.observe(tableRef.current);
    } else {
      window.addEventListener('resize', sync);
    }
    // Fonts (Tamil webfont) can change column widths after first paint.
    document.fonts?.ready?.then(sync).catch(() => {});
    return () => {
      sc.removeEventListener('scroll', onScroll);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const headCells = (
    <tr>
      <th scope="col" className="snx-compare__corner"><span className="visually-hidden">{t('Feature', 'அம்சம்')}</span></th>
      {PLANS.map((p) => (
        <th scope="col" key={p.id}>
          <span className="snx-compare__plan">{p.name}</span>
          <span className="snx-compare__price">{priceText(p, billing, tx)}</span>
        </th>
      ))}
    </tr>
  );

  return (
    <div className="snx-compare-wrap" data-start={edges.start || undefined} data-end={edges.end || undefined}>
      <p className="snx-compare__hint" aria-hidden="true">
        <MoveHorizontal size={16} aria-hidden="true" />
        {t('Swipe for more plans', 'மேலும் திட்டங்களைப் பார்க்க நகர்த்துங்கள்')}
      </p>
      {/* Visual copy of the header row for phones: sticks to the page while the table scrolls sideways. */}
      <div className="snx-compare__sticky" ref={headRef} aria-hidden="true">
        <table className="snx-compare__table snx-compare__table--head" ref={headTableRef}>
          <thead>{headCells}</thead>
        </table>
      </div>
      <div className="snx-compare__frame">
        <div
          className="snx-compare"
          role="region"
          aria-label={t('Compare plans table', 'திட்ட ஒப்பீட்டு அட்டவணை')}
          tabIndex={0}
          ref={scrollRef}
        >
          <table className="snx-compare__table" ref={tableRef}>
            <thead className="snx-compare__thead">{headCells}</thead>
            <tbody>
              <tr>
                <th scope="row">{t('For', 'யாருக்கு')}</th>
                {PLANS.map((p) => <td key={p.id} className="snx-compare__text">{tx(p.for)}</td>)}
              </tr>
              {FEATURES.map((g) => (
                <FeatureGroup key={g.group} group={g} />
              ))}
              <tr className="snx-compare__actions">
                <th scope="row"><span className="visually-hidden">{t('Choose a plan', 'ஒரு திட்டத்தைத் தேர்ந்தெடுங்கள்')}</span></th>
                {PLANS.map((p) => (
                  <td key={p.id}>
                    {p.to ? (
                      <Button size="sm" variant="secondary" to={p.to}>{tx(p.button)}</Button>
                    ) : (
                      <Button size="sm" variant={p.id === 'free' ? 'brand' : 'secondary'} href={planHref(p)}>{tx(p.button)}</Button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <span className="snx-compare__fade" aria-hidden="true" />
      </div>
    </div>
  );
}

function BillingToggle({ value, onChange }) {
  const { t } = useSnxT();
  const hint = t('save about 17% on Pro', 'Pro-வில் சுமார் 17% சேமிப்பு');
  const opts = [
    { id: 'monthly', label: t('Monthly', 'மாதாந்திரம்') },
    { id: 'annual', label: t('Annual', 'ஆண்டுதோறும்'), hint },
  ];
  const onKey = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const next = value === 'monthly' ? 'annual' : 'monthly';
      onChange(next);
      e.currentTarget.parentElement.querySelector(`[data-id="${next}"]`)?.focus();
    }
  };
  return (
    <div className="snx-toggle-wrap">
      <div className="snx-toggle" role="radiogroup" aria-label={t('Billing period', 'கட்டணக் காலம்')}>
        {opts.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            data-id={o.id}
            aria-checked={value === o.id}
            tabIndex={value === o.id ? 0 : -1}
            className="snx-toggle__opt"
            onClick={() => onChange(o.id)}
            onKeyDown={onKey}
          >
            {o.label}
            {o.hint && <span className="snx-toggle__hint">{o.hint}</span>}
          </button>
        ))}
        <span className="snx-toggle__thumb" data-pos={value} aria-hidden="true" />
      </div>
      {/* Below 440px the hint moves out of the button (CSS swaps which one is displayed). */}
      <p className="snx-toggle__note">{t('Annual billing:', 'ஆண்டுக் கட்டணம்:')} {hint}</p>
    </div>
  );
}

function PlanCard({ plan: p, billing, href }) {
  const { t, tx, lang } = useSnxT();
  const annual = billing === 'annual';
  const showAnnual = annual && p.annual != null && p.monthly > 0;
  const value = p.monthly === 0 ? 0 : showAnnual ? p.annual : p.monthly;
  const billed = p.monthly === 0 ? '' : showAnnual ? t(', billed yearly', ', ஆண்டுதோறும் வசூலிக்கப்படும்') : t(', billed monthly', ', மாதந்தோறும் வசூலிக்கப்படும்');
  return (
    <article className={`snx-plan snx-plan--${p.id}`} aria-labelledby={`plan-${p.id}`}>
      <header className="snx-plan__head">
        <h3 id={`plan-${p.id}`} className="h4 snx-plan__name">{p.name}</h3>
        <p className="snx-plan__for">{tx(p.for)}</p>
      </header>
      <div className="snx-plan__price">
        <Stat
          key={`${p.id}-${billing}`}
          value={value}
          prefix="₹"
          unit={p.monthly === 0 ? ' ' : showAnnual ? tx('/year') : tx('/month')}
          label={`${p.name} ${t('price', 'விலை')}${billed}`}
          tag="C"
          source={t('StartNet X pricing, Book 2 §7.3 (indicative, ex-GST)', 'StartNet X கட்டணம், Book 2 §7.3 (தோராயமானது, GST நீங்கலாக)')}
          variant="default"
          countUp={false}
        />
        {p.id === 'pro' && !annual && <p className="snx-plan__alt">{t('or ₹4,999/year', 'அல்லது ₹4,999/ஆண்டு')}</p>}
        {p.id === 'pro' && annual && <p className="snx-plan__alt">{t('Save about 17% on Pro', 'Pro-வில் சுமார் 17% சேமியுங்கள்')}</p>}
        {/* "Annual price: [placeholder]" is hidden until StartNet supplies the annual price. */}
      </div>
      <ul className="snx-plan__list">
        {p.includes.map((f, i) => (
          <li key={f} className={i === 0 && f.startsWith('Everything') ? 'snx-plan__inherit' : undefined}>
            <Check size={16} aria-hidden="true" /> {tx(f)}
          </li>
        ))}
      </ul>
      {p.notes && (
        <ul className="snx-plan__notes">
          {p.notes.map((n) => <li key={n}>{tx(n)}</li>)}
        </ul>
      )}
      <div className="snx-plan__cta">
        {p.to ? (
          <Button full variant="secondary" to={p.to}>{tx(p.button)}</Button>
        ) : (
          <Button full variant={p.id === 'free' ? 'primary' : 'secondary'} href={href}>{tx(p.button)}</Button>
        )}
      </div>
    </article>
  );
}

function FeatureGroup({ group }) {
  const { t, tx } = useSnxT();
  return (
    <>
      <tr className="snx-compare__group">
        <th scope="rowgroup" colSpan={PLANS.length + 1}>
          <span className="snx-compare__group-label">{tx(group.group)}</span>
        </th>
      </tr>
      {group.rows.map((r) => (
        <tr key={r.label}>
          <th scope="row">{tx(r.label)}</th>
          {PLANS.map((p, i) => (
            <td key={p.id}>
              {i >= r.from ? (
                <><Check className="snx-compare__yes" size={18} aria-hidden="true" /><span className="visually-hidden">{t('Included', 'அடங்கும்')}</span></>
              ) : (
                <><Minus className="snx-compare__no" size={18} aria-hidden="true" /><span className="visually-hidden">{t('Not included', 'அடங்காது')}</span></>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Plans 4 (d) / 2 (t); snap scroller with prev/next buttons on mobile. */
function PlanScroller({ children }) {
  const { t } = useSnxT();
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const go = (dir) => {
    const el = ref.current;
    const card = el?.firstElementChild;
    if (!el || !card) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <div className="snx-plans">
      <div className="snx-plans__track" ref={ref}>{children}</div>
      <div className="snx-plans__nav">
        <button type="button" className="snx-plans__btn" onClick={() => go(-1)} disabled={edges.start} aria-label={t('Previous plan', 'முந்தைய திட்டம்')}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" className="snx-plans__btn" onClick={() => go(1)} disabled={edges.end} aria-label={t('Next plan', 'அடுத்த திட்டம்')}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
