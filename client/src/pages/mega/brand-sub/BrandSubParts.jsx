// Shared helpers for the brand-sub pages (this folder only).
import { useLang } from '../../../lib/i18n.jsx';
import { BRAND_KEYS } from './brandSubData.js';
import { TN_DISTRICTS } from './districts.js';
import './BrandSubParts.css';

/** t() for an [en, ta] pair. */
export function useTp() {
  const { t } = useLang();
  return (pair) => (Array.isArray(pair) ? t(pair[0], pair[1]) : pair);
}

/**
 * The talent brand for a brand filtered view. An explicit prop wins; otherwise the first path segment
 * (/research/stories → research, /ta/vibe/events → vibe). Returns null for anything else.
 */
export function useBrandKey(brandProp) {
  const { basePath } = useLang();
  if (brandProp && BRAND_KEYS.includes(brandProp)) return brandProp;
  const seg = String(basePath || '').split('/').filter(Boolean)[0];
  return BRAND_KEYS.includes(seg) ? seg : null;
}

/**
 * True for seed values that are placeholders rather than facts: anything carrying a "[…]" marker
 * ("[placeholder …]", "Qualifiers in [number] districts [placeholder]") or "To be confirmed".
 */
export const isPh = (s) => typeof s === 'string' && /\[[^\]]*\]|to be confirmed/i.test(s);

/** Facet option for a district value: Tamil label from the 38-district list when known. */
export const districtOption = (d) => {
  const hit = TN_DISTRICTS.find((x) => x.en.toLowerCase() === String(d).toLowerCase());
  return { value: d, label: [d, hit ? hit.ta : d] };
};

/**
 * One facet as a row of pill toggles (Book 1 Part B §10: counts on every value, zero-count values disabled,
 * never hidden). Single-select; "All" clears the facet.
 */
export function FacetChips({ id, label, options, value, onChange, counts, allLabel, allCount }) {
  const { t } = useLang();
  const tp = useTp();
  return (
    <div className="bsub-facet">
      <span className="bsub-facet__label" id={`${id}-label`}>{label}</span>
      <div className="bsub-facet__chips" role="group" aria-labelledby={`${id}-label`}>
        <button
          type="button"
          className="chip bsub-chip"
          aria-pressed={!value}
          onClick={() => onChange('')}
        >
          {allLabel || t('All', 'அனைத்தும்')}
          {typeof allCount === 'number' && <span className="chip__count bsub-chip__count">{allCount}</span>}
        </button>
        {options.map((o) => {
          const n = counts ? counts(o.value) : null;
          const disabled = n === 0 && value !== o.value;
          return (
            <button
              key={o.value}
              type="button"
              className="chip bsub-chip"
              aria-pressed={value === o.value}
              disabled={disabled}
              onClick={() => onChange(value === o.value ? '' : o.value)}
            >
              {tp(o.label)}
              {typeof n === 'number' && (
                <span className="chip__count bsub-chip__count">
                  {n}
                  <span className="visually-hidden">{t(n === 1 ? ' result' : ' results', ' முடிவுகள்')}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
