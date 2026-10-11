import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Badge, EmptyState, Button } from '../../../../components';
import { useLang } from '../../../../lib/i18n.jsx';
import { useReducedMotion } from '../../../../hooks/useReducedMotion';
import { PROBLEM_AREAS, SECTORS, PS_STATUSES, PS_INSTITUTIONS, tr } from '../researchContent';
import './ProblemList.css';

// Facets for /research/problem-statements (Book 1 Part B §10): sector · status · institution.
const FACETS = [
  { key: 'sector', param: 'sector', label: 'Sector', labelTa: 'துறை', options: SECTORS },
  { key: 'status', param: 'status', label: 'Status', labelTa: 'நிலை', options: PS_STATUSES },
  { key: 'institution', param: 'institution', label: 'Institution', labelTa: 'கல்வி நிறுவனம்', options: PS_INSTITUTIONS },
];
const VALID = Object.fromEntries(FACETS.map((f) => [f.key, new Set(f.options.map((o) => o.value))]));
const STATUS_LABEL = Object.fromEntries(PS_STATUSES.map((s) => [s.value, s]));

const parse = (v) => (v ? v.split(',').filter(Boolean) : []);

function useFilterState(syncUrl) {
  const [params, setParams] = useSearchParams();
  const [local, setLocal] = useState({ sector: [], status: [], institution: [] });

  // Only known option values count as filters: "?sector=bogus" must not silently empty the list.
  const state = Object.fromEntries(FACETS.map((f) => [f.key, [...new Set(parse(params.get(f.param)))].filter((v) => VALID[f.key].has(v))]));
  const dirty = syncUrl && FACETS.some((f) => {
    const raw = params.get(f.param);
    if (raw == null) return false;
    return raw !== state[f.key].join(',') || state[f.key].length === 0;
  });

  // Strip unknown values (and empty params) from the URL without adding a history entry.
  useEffect(() => {
    if (!dirty) return;
    const p = new URLSearchParams(params);
    FACETS.forEach((f) => (state[f.key].length ? p.set(f.param, state[f.key].join(',')) : p.delete(f.param)));
    setParams(p, { replace: true, preventScrollReset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, params]);

  if (!syncUrl) return [local, setLocal];
  const set = (next) => {
    const value = typeof next === 'function' ? next(state) : next;
    const p = new URLSearchParams(params);
    FACETS.forEach((f) => (value[f.key]?.length ? p.set(f.param, value[f.key].join(',')) : p.delete(f.param)));
    setParams(p, { replace: true, preventScrollReset: true });
  };
  return [state, set];
}

const matches = (item, filters, skip) =>
  FACETS.every((f) => f.key === skip || !filters[f.key].length || filters[f.key].includes(item[f.key]));

/** Filterable list of Lab problem areas. Sponsor-signed statements replace these once published. */
export default function ProblemList({ limit, syncUrl = false, ctaTo = '#register-interest', headingLevel = 'h3' }) {
  const { t, localePath } = useLang();
  const reduced = useReducedMotion();
  const [filters, setFilters] = useFilterState(syncUrl);
  const [showAll, setShowAll] = useState(false);

  const results = useMemo(() => PROBLEM_AREAS.filter((it) => matches(it, filters)), [filters]);
  const activeCount = FACETS.reduce((n, f) => n + filters[f.key].length, 0);
  const visible = limit && !showAll ? results.slice(0, limit) : results;
  const H = headingLevel;
  const n = visible.length;
  // Balance the last row: the grid reads these to avoid a lone orphan card (see ProblemList.css).
  const gridClass = ['problist__grid', n === 4 && 'is-n4', n % 2 === 1 && 'is-odd', n % 3 === 1 && 'is-mod3-1'].filter(Boolean).join(' ');

  const toggle = (key, value) =>
    setFilters((prev) => {
      const cur = prev[key];
      return { ...prev, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });
  const clear = () => setFilters({ sector: [], status: [], institution: [] });
  const clearLabel = t('Clear all', 'அனைத்தையும் அழி');
  const register = t('Register interest', 'ஆர்வத்தைப் பதிவு செய்யுங்கள்');

  return (
    <div className="problist">
      <div className="problist__filters" role="group" aria-label={t('Filter problem statements', 'சிக்கல் அறிக்கைகளை வடிகட்டுங்கள்')}>
        {FACETS.map((f) => (
          <fieldset key={f.key} className="problist__facet">
            <legend className="problist__legend">{tr(t, f, 'label')}</legend>
            <div className="problist__chips">
              {f.options.map((o) => {
                const count = PROBLEM_AREAS.filter((it) => it[f.key] === o.value && matches(it, filters, f.key)).length;
                const on = filters[f.key].includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    className="chip problist__chip"
                    aria-pressed={on}
                    disabled={!count && !on}
                    onClick={() => toggle(f.key, o.value)}
                  >
                    {tr(t, o, 'label')}
                    <span className="chip__count problist__count tnum" aria-label={t(`${count} results`, `${count} முடிவுகள்`)}>{count}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div className="problist__meta">
          <p className="problist__total small" aria-live="polite">
            <strong className="tnum">{results.length}</strong>{' '}
            {t(results.length === 1 ? 'problem area' : 'problem areas', 'சிக்கல் பகுதிகள்')}
          </p>
          <button type="button" className="problist__clear" onClick={clear} disabled={!activeCount}>
            <X size={16} aria-hidden="true" /> {clearLabel}
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          title={t('No problem areas match these filters.', 'இந்த வடிகட்டிகளுக்குப் பொருந்தும் சிக்கல் பகுதிகள் இல்லை.')}
          body={t(
            "Clear a filter to see every Lab's focus areas, or tell us about a problem your organisation wants solved.",
            'ஒவ்வோர் ஆய்வகத்தின் கவனப் பகுதிகளையும் பார்க்க ஒரு வடிகட்டியை அழியுங்கள், அல்லது உங்கள் நிறுவனம் தீர்க்க விரும்பும் சிக்கலைப் பற்றி எங்களிடம் சொல்லுங்கள்.'
          )}
          action={<Button variant="secondary" onClick={clear}>{clearLabel}</Button>}
        />
      ) : (
        <ul className={gridClass}>
          <AnimatePresence initial={false}>
            {visible.map((it) => (
              <motion.li
                key={it.id}
                layout={!reduced}
                className="problist__item"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.2, 0, 0.38, 0.9] }}
              >
                <div className="problist__top">
                  <span className="problist__lab">{it.lab}</span>
                  <Badge kind="status" status={it.status}>{tr(t, STATUS_LABEL[it.status], 'label')}</Badge>
                </div>
                <H className="problist__title h5">{tr(t, it, 'title')}</H>
                {/* Opening date, sponsor and host institution are hidden until StartNet supplies them. */}
                {ctaTo.startsWith('#') ? (
                  <a className="problist__cta" href={ctaTo}>
                    <span className="problist__cta-label">{register}</span> <ArrowRight className="problist__arrow" size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <Link className="problist__cta" to={localePath(ctaTo)}>
                    <span className="problist__cta-label">{register}</span> <ArrowRight className="problist__arrow" size={16} aria-hidden="true" />
                  </Link>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {limit && results.length > limit && (
        <div className="problist__more">
          <Button variant="secondary" onClick={() => setShowAll((s) => !s)}>
            {showAll ? t('Show fewer', 'குறைவாகக் காட்டு') : t(`Show all ${results.length}`, `அனைத்து ${results.length}-ஐயும் காட்டு`)}
          </Button>
        </div>
      )}
    </div>
  );
}
