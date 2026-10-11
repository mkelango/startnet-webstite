import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useLang } from '../../../lib/i18n.jsx';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { SECTORS, SECTOR_FILTERS, eventPlace, eventWhen, eventsForSector } from './connectData.js';
import './SeriesGrid.css';

export function SectorStatus({ status, since }) {
  const { t } = useLang();
  // Start year comes from connectData `since` (first edition on record); where it is not known it is left out.
  // "[proposed]" notes are not shown until StartNet confirms them.
  if (status === 'running') {
    return (
      <span className="connect-series__status connect-series__status--running">
        {since ? t(`Running since ${since}`, `${since} முதல் நடைபெறுகிறது`) : t('Running', 'நடைபெறுகிறது')}
      </span>
    );
  }
  if (status === 'new-2027') return <span className="connect-series__status">{t('New · 2027', 'புதியது · 2027')}</span>;
  return <span className="connect-series__status">{t('New', 'புதியது')}</span>;
}

/** Deterministic network glyph: a few lit nodes joined by one line (Book 3 network motif); no background dot grid. */
function SectorGlyph({ seed }) {
  const cols = 6, rows = 3, gap = 16;
  let x = (seed * 9301 + 49297) % 233280;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const lit = [];
  let c = 0, r = Math.floor(rnd() * rows);
  while (c < cols) { lit.push([c, r]); c += 1 + Math.floor(rnd() * 2); r = Math.max(0, Math.min(rows - 1, r + (rnd() > 0.5 ? 1 : -1))); }
  const pts = lit.map(([cc, rr]) => `${8 + cc * gap},${8 + rr * gap}`).join(' ');
  return (
    <svg className="connect-series__glyph" viewBox={`0 0 ${cols * gap} ${rows * gap}`} aria-hidden="true" focusable="false">
      <polyline points={pts} className="connect-series__glyph-line" />
      {lit.map(([cc, rr], i) => <circle key={`l${i}`} cx={8 + cc * gap} cy={8 + rr * gap} r="3.2" className="connect-series__glyph-lit" />)}
    </svg>
  );
}

export default function SeriesGrid({ events = [], headingLevel = 'h3', param = 'sectors' }) {
  const { localePath, t, lang } = useLang();
  const reduced = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const active = SECTOR_FILTERS.some((f) => f.id === params.get(param)) ? params.get(param) : 'all';
  const Title = headingLevel;

  const counts = useMemo(() => Object.fromEntries(SECTOR_FILTERS.map((f) => [f.id, f.id === 'all' ? SECTORS.length : SECTORS.filter((s) => s.status === f.id).length])), []);
  const shown = active === 'all' ? SECTORS : SECTORS.filter((s) => s.status === active);

  const choose = (id) => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete(param); else next.set(param, id);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const soon = t('Dates soon', 'தேதிகள் விரைவில்');
  const transition = reduced ? { duration: 0 } : { duration: 0.32, ease: [0.2, 0, 0.38, 0.9] };

  return (
    <div className="connect-series">
      <div className="connect-series__bar">
        <div className="connect-series__chips" role="group" aria-label={t('Filter sector Connects by status', 'நிலையின்படி துறை Connect-களை வடிகட்டுங்கள்')}>
          {SECTOR_FILTERS.map((f) => (
            <button key={f.id} type="button" className="chip connect-series__chip" aria-pressed={active === f.id} onClick={() => choose(f.id)}>
              {t(f.label, f.labelTa)}<span className="chip__count connect-series__chip-count tnum">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <p className="connect-series__count small muted" aria-live="polite">
          {lang === 'ta'
            ? <><span className="tnum">{SECTORS.length}</span> துறை Connect-களில் <span className="tnum">{shown.length}</span> காட்டப்படுகின்றன</>
            : <>Showing <span className="tnum">{shown.length}</span> of <span className="tnum">{SECTORS.length}</span> sector Connects</>}
        </p>
      </div>

      <LayoutGroup>
        <motion.ul className="connect-series__grid" layout={!reduced} transition={transition}>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((s) => {
              const idx = SECTORS.indexOf(s);
              const next = eventsForSector(events, s)[0];
              return (
                <motion.li
                  key={s.slug}
                  layout={!reduced}
                  className={`connect-series__item connect-series__item--${s.status}`}
                  initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}
                  transition={transition}
                >
                  <article className="connect-series__card">
                    <div className="connect-series__top">
                      <span className="connect-series__index tnum" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
                      <SectorGlyph seed={idx + 3} />
                    </div>
                    <Title className="connect-series__name h4">
                      <Link className="connect-series__link" to={localePath(`/connect/${s.slug}`)}>{s.name}</Link>
                    </Title>
                    <p className="connect-series__summary">{t(s.summary, s.summaryTa)}</p>
                    <div className="connect-series__foot">
                      <SectorStatus status={s.status} since={s.since} />
                      <p className="connect-series__next small">
                        <CalendarDays size={16} aria-hidden="true" />
                        {next ? <span>{t('Next:', 'அடுத்து:')} <span className="tnum">{eventWhen(next, { short: true, dates: soon, lang })}</span>{eventPlace(next, lang) ? ` · ${eventPlace(next, lang)}` : ''}</span> : <span>{soon}</span>}
                      </p>
                    </div>
                    <span className="connect-series__arrow" aria-hidden="true"><ArrowRight size={20} /></span>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </div>
  );
}
