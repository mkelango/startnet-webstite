import { AlertCircle } from 'lucide-react';
import { useLang } from '../lib/i18n.jsx';
import { cx } from './_utils.js';
import './Field.css';

/** Native checkbox with a drawn tick (no pseudo-elements on <input>, so it works in every engine). */
export function CheckboxControl(props) {
  return (
    <span className="checkbox-control">
      <input type="checkbox" className="field__checkbox" {...props} />
      <svg className="checkbox-control__tick" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
  );
}

/**
 * Labelled input with hint and inline error (Book 3 C39). Native controls only.
 * `tel` shows a fixed +91 prefix and a numeric keypad. onChange receives the value (or boolean).
 * Extra optional props: name, onBlur, placeholder, inputMode, rows, disabled, maxLength, className.
 */
export function Field({
  id,
  name,
  label,
  hint,
  error,
  type = 'text',
  options,
  required,
  value,
  onChange,
  onBlur,
  autoComplete,
  placeholder,
  inputMode,
  rows = 5,
  disabled,
  maxLength,
  className,
}) {
  const { t } = useLang();
  const fid = id || name;
  const hintId = hint ? `${fid}-hint` : null;
  const errId = error ? `${fid}-error` : null;
  const prefixId = type === 'tel' ? `${fid}-prefix` : null;
  const describedBy = [prefixId, hintId, errId].filter(Boolean).join(' ') || undefined;
  const handle = (e) => onChange && onChange(type === 'checkbox' ? e.target.checked : e.target.value);
  const common = {
    id: fid,
    name: name || fid,
    required: required || undefined,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    onBlur,
    disabled,
  };

  const errorNode = error ? (
    <p id={errId} className="field__error">
      <AlertCircle size={16} aria-hidden="true" className="field__error-icon" />
      <span>{error}</span>
    </p>
  ) : null;
  const hintNode = hint ? (
    <p id={hintId} className="field__hint">
      {hint}
    </p>
  ) : null;

  if (type === 'checkbox') {
    return (
      <div className={cx('field', 'field--checkbox', error && 'field--error', className)}>
        <div className="field__check-row">
          <CheckboxControl checked={Boolean(value)} onChange={handle} {...common} />
          <label htmlFor={fid} className="field__check-label">
            {label}
          </label>
        </div>
        {hintNode}
        {errorNode}
      </div>
    );
  }

  const opts = (Array.isArray(options) ? options : []).map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  let control;
  if (type === 'textarea') {
    control = (
      <textarea
        className="field__control field__control--textarea"
        rows={rows}
        value={value ?? ''}
        onChange={handle}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        {...common}
      />
    );
  } else if (type === 'select') {
    control = (
      <div className="field__select-wrap">
        <select className="field__control field__control--select" value={value ?? ''} onChange={handle} autoComplete={autoComplete} {...common}>
          {/* Built-in empty option only when the caller did not pass one (no "Choose…" + "Choose one"). */}
          {!opts.some((o) => o.value === '' || o.value == null) && (
            <option value="">{placeholder || t('Choose…', 'தேர்ந்தெடுக்கவும்…')}</option>
          )}
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (type === 'tel') {
    control = (
      <div className="field__tel">
        <span id={prefixId} className="field__prefix">
          +91
        </span>
        <input
          type="tel"
          className="field__control field__control--tel"
          inputMode={inputMode || 'numeric'}
          autoComplete={autoComplete || 'tel-national'}
          value={value ?? ''}
          onChange={handle}
          placeholder={placeholder}
          maxLength={maxLength || 14}
          {...common}
        />
      </div>
    );
  } else {
    control = (
      <input
        type={type}
        className="field__control"
        value={value ?? ''}
        onChange={handle}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        spellCheck={type === 'email' ? false : undefined}
        autoCapitalize={type === 'email' ? 'none' : undefined}
        {...common}
      />
    );
  }

  return (
    <div className={cx('field', `field--${type}`, error && 'field--error', className)}>
      <label htmlFor={fid} className="field__label">
        {label}
      </label>
      {hintNode}
      {control}
      {errorNode}
    </div>
  );
}

export default Field;
