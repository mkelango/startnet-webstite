// Proof block for partner pages: live Founder Ledger figures + signed partners only (Book 1 Part B §3.8 row 4, Book 2 Appendix B).
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FactBand, LogoWall, Reveal, Skeleton } from '../../components';
import { useApi } from '../../hooks/useApi.js';
import { useLang } from '../../lib/i18n.jsx';
import { sinceLabel } from './partnerData.js';
// Read-only reuse of the Home bucket's Tamil metric labels (keyed by the API's English label).
import { localizeMetric, placeholderText } from '../home/homeI18n.js';

export function LedgerProof({ surface = 'paper', title }) {
  const { t, lang } = useLang();
  const { data, loading } = useApi('/api/ledger');
  const phEn = placeholderText((en) => en);
  const kpis = (Array.isArray(data?.kpis) ? data.kpis.filter((m) => m && m.value != null).slice(0, 4) : []).map((m) => {
    const lm = localizeMetric(m, lang);
    return lm && lm.placeholder === phEn ? { ...lm, placeholder: placeholderText(t) } : lm;
  });
  if (loading) return <Skeleton height="8rem" />;
  // No published Ledger figure yet: nothing (FactBand also leaves out figures without a value).
  if (!kpis.length) return null;
  return (
    <FactBand
      className="partner-ledger"
      metrics={kpis}
      surface={surface}
      title={title || t('From the Founder Ledger', 'Founder Ledger-இலிருந்து')}
      footnote={
        data?.asAt
          ? t(
              `Figures as at ${data.asAt}. Each carries an A, B or C tag; C-tag figures are never summed into A or B.`,
              `${data.asAt} நிலவரப்படி எண்கள். ஒவ்வொன்றுக்கும் A, B அல்லது C அடையாளம் உண்டு; C அடையாள எண்கள் A அல்லது B எண்களுடன் ஒருபோதும் கூட்டப்படுவதில்லை.`
            )
          : undefined
      }
      link={{ label: t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்'), to: '/insights/founder-ledger' }}
    />
  );
}

/** Signed partners only. When `types` is given, filter to those partner types. */
export function SignedPartners({ types, emptyText }) {
  const { t, lang, localePath } = useLang();
  const { data, loading } = useApi('/api/partners');
  const all = Array.isArray(data) ? data.filter((p) => p.agreementStatus === 'signed') : [];
  const list = types ? all.filter((p) => types.map((x) => x.toLowerCase()).includes(String(p.type).toLowerCase())) : all;
  if (loading) return <Skeleton height="4rem" />;
  if (!list.length) {
    return (
      <div className="partner-proof__none">
        <p>
          {emptyText ||
            t(
              'Partners appear here only once an agreement is signed, with the date it was signed. Nothing in the pipeline is ever shown.',
              'ஒப்பந்தம் கையெழுத்தான பின்னரே, கையெழுத்திட்ட தேதியுடன், கூட்டாளர்கள் இங்கே தோன்றுவார்கள். பேச்சுவார்த்தையில் உள்ள எதுவும் ஒருபோதும் காட்டப்படுவதில்லை.'
            )}
        </p>
        <Link className="partner-link" to={localePath('/partner/our-partners')}>
          {t('How we list partners', 'கூட்டாளர்களை எப்படிப் பட்டியலிடுகிறோம்')} <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    );
  }
  return (
    <div className="partner-proof__partners">
      <LogoWall partners={list.filter((p) => p.logoPermission)} />
      <ul className="partner-proof__names" role="list">
        {list.map((p) => (
          <li key={p.slug}>
            <span className="partner-proof__name">{p.name}</span>
            <span className="partner-proof__since">{sinceLabel(p.since, lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PROOF_LINKS = {
  'Founder Ledger': '/insights/founder-ledger',
  'District Ledger': '/insights/founder-ledger',
  'Corrections log': '/insights/founder-ledger',
  Team: '/about/leadership',
  'Lab charter and kill criteria': '/about/governance',
  'Feeder-and-connector stance': '/about/how-we-work',
  'Signed institutions': '/partner/our-partners',
  'Signed GCCs': '/partner/our-partners',
  'DPDP and security posture': '/startnet-x/trust',
  'Tenant demo': '/partner/enquire?topic=snx',
  'Co-host history': '/events/past',
  'Post-event reports': '/events/past',
  'ThinkTN related-party disclosure': '/about/thinktn-alliance',
  'Pilot outcomes': '/insights/stories',
};

/**
 * "Proof you can check" list from Book 1 Part A §3.2. `items` are the English keys (they pick the link);
 * `labels` optionally maps each key to the text shown (e.g. PROOF_TA on /ta pages).
 */
export function ProofNeeded({ items, objection, labels }) {
  const { t, localePath } = useLang();
  const label = (it) => (labels && labels[it]) || it;
  return (
    <Reveal className="partner-proofneeded">
      {objection && (
        <p className="partner-proofneeded__objection">
          <span className="partner-proofneeded__q">{t('The fair question', 'நியாயமான கேள்வி')}</span>
          <q>{objection}</q>
        </p>
      )}
      <p className="partner-proofneeded__lead">{t('What you can check before you sign:', 'கையெழுத்திடும் முன் நீங்கள் சரிபார்க்கக்கூடியவை:')}</p>
      <ul role="list" className="partner-proofneeded__list">
        {items.map((it) => (
          <li key={it}>
            {PROOF_LINKS[it] ? (
              <Link to={localePath(PROOF_LINKS[it])}>
                {label(it)} <ArrowRight aria-hidden="true" size={16} />
              </Link>
            ) : (
              <span>{label(it)}</span>
            )}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
