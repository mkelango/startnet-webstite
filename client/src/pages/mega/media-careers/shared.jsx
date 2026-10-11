// Shared helpers for the media and careers pages (page-local; not part of the kit).
import { useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';
import { Placeholder, WhatsAppButton } from '../../../components';
import { useLang } from '../../../lib/i18n.jsx';
import './shared.css';

// Book 2 §9 media contact and §10 careers address. Confirmed by StartNet, Oct 2026: press enquiries go to
// press@startnet.in (replaces media@), and careers@startnet.in is the public careers address.
export const PRESS_EMAIL = 'press@startnet.in';
export const CAREERS_EMAIL = 'careers@startnet.in';

// Book 2 §9 boilerplate (verbatim). The Tamil text is a draft for native editor review (Book 2 §14 status note).
export const BOILERPLATE = {
  en: "StartNet is Tamil Nadu's founder-making network. Its four brands, StartNet Research, StartNet Vibe, StartNet Connect and StartNet Women, help scholars, students, professionals and women become founders through events, learning, incubation, capital and market access, all run on one platform, StartNet X. StartNet's goal, Mission 1 Lakh, is to nurture 1,00,000 founders in Tamil Nadu by March 2031, counted in a public, quarterly Founder Ledger. StartNet is headquartered in Salem and works across Tamil Nadu. Every talent, a founder.",
  ta: 'StartNet தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு. அதன் நான்கு பிராண்டுகளான StartNet Research, StartNet Vibe, StartNet Connect, StartNet Women ஆகியவை, ஆய்வாளர்கள், மாணவர்கள், தொழில்முறையாளர்கள், பெண்கள் ஆகியோர் நிகழ்வுகள், கற்றல், இன்குபேஷன், முதலீடு, சந்தை அணுகல் வழியாக நிறுவனர்களாக மாற உதவுகின்றன. இவை அனைத்தும் StartNet X என்ற ஒரே தளத்தில் இயங்குகின்றன. StartNet-இன் இலக்கான Mission 1 Lakh, மார்ச் 2031-க்குள் தமிழ்நாட்டில் 1,00,000 நிறுவனர்களை உருவாக்குவது. இது பொதுவில் வெளியிடப்படும் காலாண்டு Founder Ledger-இல் கணக்கிடப்படுகிறது. StartNet சேலத்தைத் தலைமையிடமாகக் கொண்டு தமிழ்நாடு முழுவதும் செயல்படுகிறது. ஒவ்வொரு திறமையும், ஒரு நிறுவனர்.', // SEO-TA: pending native review
};

/** Placeholder register mark in the page language (Book 2 Appendix A). Pass en/ta, or nothing for the generic mark. */
export function Ph({ en = '[placeholder — to be supplied by StartNet]', ta = '[placeholder — StartNet வழங்கும்]' }) {
  const { t } = useLang();
  return <Placeholder>{t(en, ta)}</Placeholder>;
}

/** "6 Oct 2026" in either language, Latin digits always (Book 3 §4.4). */
export function fmtDate(iso, lang = 'en', opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  try {
    return d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { ...opts, timeZone: 'Asia/Kolkata', numberingSystem: 'latn' });
  } catch {
    return d.toLocaleDateString('en-IN', opts);
  }
}

/** Paragraphs from a string or string[] field; blank entries dropped. */
export function paragraphs(v) {
  if (Array.isArray(v)) return v.filter((p) => typeof p === 'string' && p.trim());
  if (typeof v === 'string' && v.trim()) return v.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return [];
}

/** String list from an array field (ignores non-strings). */
export const strings = (v) => (Array.isArray(v) ? v.filter((s) => typeof s === 'string' && s.trim()) : []);

/** True when a seeded value is itself a register mark like "[placeholder — …]". */
export const isMark = (s) => /^\s*\[[^\]]*\]\s*$/.test(String(s || ''));

export function hash(s = '') {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 97;
}

/** Copy-to-clipboard pill with a polite status. The text stays selectable if the clipboard is blocked. */
export function CopyButton({ text, label, doneLabel, describedBy, className = '' }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 2400);
    } catch { /* clipboard unavailable: text remains selectable */ }
  };
  return (
    <button type="button" className={`mc-copy ${className}`} onClick={copy} aria-describedby={describedBy}>
      {done ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span aria-live="polite">{done ? doneLabel || t('Copied', 'நகலெடுக்கப்பட்டது') : label}</span>
    </button>
  );
}

/** Share row for T09 pages: WhatsApp, copy link, native share. */
export function ShareRow({ title, refCode }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <div className="mc-share" role="group" aria-label={t('Share this page', 'இந்தப் பக்கத்தைப் பகிருங்கள்')}>
      <span className="mc-share__label">{t('Share', 'பகிருங்கள்')}</span>
      <WhatsAppButton text={`${title} ${url}`} refCode={refCode} label={t('Share on WhatsApp', 'WhatsApp-இல் பகிருங்கள்')} size="sm" />
      <button type="button" className="mc-copy" onClick={copy}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        <span aria-live="polite">{copied ? t('Link copied', 'இணைப்பு நகலெடுக்கப்பட்டது') : t('Copy link', 'இணைப்பை நகலெடுக்கவும்')}</span>
      </button>
      {canShare && (
        <button type="button" className="mc-copy" onClick={() => navigator.share({ title, url }).catch(() => {})}>
          {t('More options', 'மேலும் வழிகள்')}
        </button>
      )}
    </div>
  );
}
