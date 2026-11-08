// PnP article header (docs/redesign/SPEC.md §5.6 "Report / story / article detail"): no dark hero. The Ink spacer
// strip under the floating header is the page's only band; the article starts on a Paper sheet (32px top corners)
// with the head inside the 900px article measure: breadcrumbs → type · date (13/500 muted) → h1 (--text-h1, max 22ch)
// → dek (--text-lede, Graphite) → byline row (author left, actions right).
import { useEffect, useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs.jsx';
import { Button } from '../../components/Button.jsx';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { useLang } from '../../lib/i18n.jsx';
import { KineticHeadline } from '../../components/KineticHeadline.jsx';
import { cx } from '../../components/_utils.js';
import './insightsKit.css';

/**
 * Props: `crumbs` (Breadcrumbs items), `meta` (array of nodes joined by " · "), `badges` (node), `title`,
 * `titleLang`, `accentFirst`, `dek` (node), `dekLang`, `byline` (node, left), `actions` (node, right),
 * `children` (extra head content, e.g. an empty state), `plainTitle` (render the h1 without the kinetic split).
 */
export function ArticleHead({
  crumbs, meta, badges, title, titleLang, accentFirst = false, plainTitle = false, dek, dekLang, byline, actions, children, className,
}) {
  const metaItems = (Array.isArray(meta) ? meta : [meta]).filter(Boolean);
  return (
    <header className={cx('article-head', className)}>
      <div className="container">
        <div className="article-head__inner">
          {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} className="article-head__crumbs" />}
          {metaItems.length > 0 && (
            <p className="article-head__meta">
              {metaItems.map((m, i) => (
                <span key={i} className="article-head__meta-item">{m}</span>
              ))}
            </p>
          )}
          {badges && <div className="article-head__badges">{badges}</div>}
          {plainTitle ? (
            <h1 className="article-head__title h1" lang={titleLang}>{title}</h1>
          ) : (
            <KineticHeadline text={title} as="h1" accentFirst={accentFirst} className="article-head__title h1" lang={titleLang} />
          )}
          {dek && <div className="article-head__dek" lang={dekLang}>{dek}</div>}
          {(byline || actions) && (
            <div className="article-head__row">
              {byline && <div className="article-head__by">{byline}</div>}
              {actions && <div className="article-head__actions" data-primary-cta="">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}

/** The head's share icon buttons (40px circles): WhatsApp and copy link. */
export function ShareIcons({ title }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  // Read after mount, so the prerendered markup and the first client render match.
  const [url, setUrl] = useState('');
  useEffect(() => { setUrl(window.location.href); }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <span className="article-head__share" role="group" aria-label={t('Share', 'பகிருங்கள்')}>
      <WhatsAppButton iconOnly size="sm" text={`${title} ${url}`} label={t('Share on WhatsApp', 'WhatsApp‑இல் பகிருங்கள்')} />
      <Button variant="secondary" iconOnly icon={copied ? Check : Link2} onClick={copy}>
        {copied ? t('Link copied', 'இணைப்பு நகலெடுக்கப்பட்டது') : t('Copy link', 'இணைப்பை நகலெடுக்கவும்')}
      </Button>
      <span className="visually-hidden" aria-live="polite">{copied ? t('Link copied', 'இணைப்பு நகலெடுக்கப்பட்டது') : ''}</span>
    </span>
  );
}

export default ArticleHead;
