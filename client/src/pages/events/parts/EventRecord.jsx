// Past-event record blocks (Oct 2026 archive enrichment, docs/research/*.md): "what happened" paragraphs, programme
// highlights, named people, sourced lists, sponsors/partners "as listed by the event", and the sources list.
// Shared by EditionPage (/events/<series>/<edition>) and EventDetail (/events/<slug>). Data: optional event fields
// recap[Ta], highlights[] (+ highlightsNote[Ta]), people[] groups, lists[], partners[] groups, sources[],
// sourcesCheckedAt, figures[] (inline Metric records). Every field has a <field>Ta sibling where Tamil exists
// (DRAFT, native review pending); values without Tamil carry lang="en" on /ta pages.
// Partners shown here are a historic record of one edition, never the signed-partner list (/partner/our-partners).
import { Link } from 'react-router-dom';
import { PersonCard, InlineMarks, RevealGroup } from '../../../components';
import { useLang, contentLangFor } from '../../../lib/i18n.jsx';
import { formatDate } from '../../../lib/format.js';
import { pickLang } from './eventMeta.js';
import './EventRecord.css';

const arr = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
const H = (level) => `h${Math.min(Math.max(Number(level) || 2, 2), 6)}`;

export const recapOf = (e, lang) => arr(pickLang(e, 'recap', lang));
export const hasRecap = (e) => arr(e?.recap).length > 0;
/** Inline, sourced figures of one edition (Metric shape, each with tag, asAt and source). */
export const recordFigures = (e) => arr(e?.figures).filter((m) => m && (m.id || m.key));
export const hasHighlights = (e) => arr(e?.highlights).length > 0;
export const peopleGroups = (e) => arr(e?.people).filter((g) => arr(g.items).length > 0);
export const hasPeople = (e) => peopleGroups(e).length > 0;
export const hasJuryGroup = (e) => peopleGroups(e).some((g) => g.kind === 'jury');
export const peopleNames = (e) => new Set(peopleGroups(e).flatMap((g) => arr(g.items).map((p) => p.name)));
const sourcesOf = (e) => arr(e?.sources).map((s) => (typeof s === 'string' ? { label: s.replace(/^https?:\/\//, ''), url: s } : s)).filter((s) => s && s.label);

function useL() {
  const { lang } = useLang();
  return (text) => contentLangFor(lang, typeof text === 'string' ? text : '');
}

/** "What happened": the edition's recap paragraphs. */
export function RecordRecap({ e }) {
  const { lang } = useLang();
  const L = useL();
  const paras = recapOf(e, lang);
  if (!paras.length) return null;
  return (
    <div className="event-record__recap">
      {paras.map((p) => (
        <p key={p} className="body-lg" lang={L(p)}>
          <InlineMarks text={p} />
        </p>
      ))}
    </div>
  );
}

/** Programme highlights: sessions as the sources describe them (day, title, who). */
export function RecordHighlights({ e, headingLevel = 3 }) {
  const { lang } = useLang();
  const L = useL();
  const items = arr(e?.highlights);
  if (!items.length) return null;
  const note = pickLang(e, 'highlightsNote', lang);
  const T = H(headingLevel);
  return (
    <>
      {note && <p className="caption event-record__note" lang={L(note)}><InlineMarks text={note} /></p>}
      <ol className="event-record__highlights">
        {items.map((h, i) => {
          const when = pickLang(h, 'when', lang);
          const title = pickLang(h, 'title', lang);
          const body = pickLang(h, 'body', lang);
          return (
            <li key={`${h.title}-${i}`} className="event-record__highlight">
              {when && <p className="caption event-record__when" lang={L(when)}>{when}</p>}
              <T className="h5 event-record__highlight-title" lang={L(title)}><InlineMarks text={title} /></T>
              {body && <p className="text-2" lang={L(body)}><InlineMarks text={body} /></p>}
            </li>
          );
        })}
      </ol>
    </>
  );
}

/** Named people in groups (speakers, guests of honour, jury), each with the role their source states. */
export function RecordPeople({ e, headingLevel = 3 }) {
  const { lang } = useLang();
  const L = useL();
  const groups = peopleGroups(e);
  if (!groups.length) return null;
  const T = H(headingLevel);
  return (
    <div className="event-record__groups">
      {groups.map((g) => {
        const heading = pickLang(g, 'heading', lang);
        const note = pickLang(g, 'note', lang);
        return (
          <section key={g.heading} className="event-record__group" aria-label={heading}>
            <T className="h4 event-record__group-title" lang={L(heading)}>{heading}</T>
            {note && <p className="caption event-record__note" lang={L(note)}>{note}</p>}
            <RevealGroup as="ul" className="event-record__people">
              {arr(g.items).map((p) => (
                <li key={`${p.name}-${p.role}`}>
                  {/* No brand badge: these people spoke at or judged one edition; they are not part of the brand. */}
                  <PersonCard compact headingLevel={Math.min(Number(headingLevel) + 1, 6)} person={{ name: p.name, role: p.role, roleTa: p.roleTa }} />
                </li>
              ))}
            </RevealGroup>
          </section>
        );
      })}
    </div>
  );
}

/** Sourced lists (who it was for, outcomes as a partner reported them, tools featured …), one block each. */
export function RecordLists({ e, blockClass = '' }) {
  const { lang } = useLang();
  const L = useL();
  const lists = arr(e?.lists).filter((l) => arr(l.items).length > 0);
  if (!lists.length) return null;
  return lists.map((l) => {
    const heading = pickLang(l, 'heading', lang);
    const note = pickLang(l, 'note', lang);
    const items = arr(pickLang(l, 'items', lang));
    return (
      <div key={l.heading} className={`event-record__block ${blockClass}`.trim()}>
        <h2 className="h3" lang={L(heading)}>{heading}</h2>
        {note && <p className="caption event-record__note" lang={L(note)}>{note}</p>}
        <ul className="event-record__list">
          {items.map((it) => (
            <li key={it} lang={L(it)}><InlineMarks text={it} /></li>
          ))}
        </ul>
      </div>
    );
  });
}

/**
 * Sponsors and partners as listed by the event for that edition (tier or role exactly as sourced). A historic record:
 * the signed-partners rule applies to /partner/our-partners, not to these lists.
 */
export function RecordPartners({ e, blockClass = '' }) {
  const { lang } = useLang();
  const L = useL();
  const groups = arr(e?.partners).filter((g) => arr(g.items).length > 0);
  if (!groups.length) return null;
  return groups.map((g) => {
    const heading = pickLang(g, 'heading', lang);
    const note = pickLang(g, 'note', lang);
    return (
      <div key={g.heading} className={`event-record__block ${blockClass}`.trim()}>
        <h2 className="h3" lang={L(heading)}>{heading}</h2>
        {note && <p className="caption event-record__note" lang={L(note)}>{note}</p>}
        <dl className="event-record__partners">
          {arr(g.items).map((p) => {
            const role = pickLang(p, 'role', lang);
            return (
              <div key={`${p.name}-${p.role}`} className="event-record__partner">
                <dt lang={L(p.name)}>{p.name}</dt>
                <dd lang={L(role)}>{role}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    );
  });
}

/** Where every fact on the page comes from, with the date the sources were checked. */
export function RecordSources({ e, blockClass = '' }) {
  const { t, lang, localePath } = useLang();
  const L = useL();
  const sources = sourcesOf(e);
  if (!sources.length) return null;
  const checked = typeof e.sourcesCheckedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.sourcesCheckedAt) ? formatDate(e.sourcesCheckedAt, undefined, lang) : null;
  return (
    <div className={`event-record__block ${blockClass}`.trim()}>
      <h2 className="h3">{t('Sources', 'ஆதாரங்கள்')}</h2>
      <p className="caption event-record__note">
        {checked
          ? t(`Public sources, checked on ${checked}. `, `பொது ஆதாரங்கள், ${checked} அன்று சரிபார்க்கப்பட்டவை. `)
          : t('Public sources. ', 'பொது ஆதாரங்கள். ')}
        {t('Spotted an error? ', 'பிழையைக் கண்டீர்களா? ')}
        <Link to={localePath('/contact')} className="event-record__link">{t('Report a correction', 'திருத்தத்தைத் தெரிவிக்க')}</Link>.
      </p>
      <ol className="event-record__sources">
        {sources.map((s) => (
          <li key={s.label} lang={L(s.label)}>
            {s.url ? (
              <a href={s.url} className="event-record__link" rel="noopener noreferrer">{s.label}</a>
            ) : (
              s.label
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
