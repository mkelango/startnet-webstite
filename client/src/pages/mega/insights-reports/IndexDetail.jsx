// /insights/indices/:index — T07 Report / index (Book 1 Part B §2.2 "Indices", §6.2 T07; Book 3 Part B §4 T07 chapter nav).
// Evidence page: ink hero band, then paper sheets in the calm "blueprint" manner (as the Ledger, T08; Oct 2026).
// Data: GET /api/reports (status label of the matching index record), GET /api/metrics (public context figures).
import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Stat, TagChip, Badge, Button, Reveal, RevealGroup, Card, KeyFacts,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { fitTitle, fitDescription } from '../../programmes/parts/seoFit.js';
import NotFound from '../../utility/LazyNotFound.jsx';
import ChapterNav from './ChapterNav.jsx';
import NotifyForm from './NotifyForm.jsx';
import { INDEX_CONTENT } from './indexContent.js';
import { INDEX_ROUTES, INDEX_SLUGS, TAG_RULES, splitPlaceholder, localLabel } from './shared.js';
import './IndexDetail.css';

// SEO titles per index [English, Tamil draft]; the Tamil names a Tamil phrase so EN/TA titles differ.
const INDEX_SEO_TITLE = {
  'campus-innovation-index': ['Campus Innovation Index for Tamil Nadu colleges', 'Campus Innovation Index: கல்லூரிகளுக்கான குறியீடு'],
  'research-commercialisation-index': ['TN Research Commercialisation Index', 'TN ஆராய்ச்சி வணிகமயமாக்கல் குறியீடு'],
  'founder-readiness-index': ['Founder Readiness Index: planned, method first', 'Founder Readiness Index: திட்டமிடப்பட்டது'],
};

const NAV = [
  ['about', 'What it is', 'இது என்ன'],
  ['measured', "What's measured", 'எதை அளவிடுகிறது'],
  ['method', 'Method', 'முறையியல்'],
  ['status', 'Publication status', 'வெளியீட்டு நிலை'],
  ['scores', 'Scores', 'மதிப்பெண்கள்'],
];

export default function IndexDetail() {
  const { index } = useParams();
  const c = INDEX_CONTENT[index];
  if (!c || !INDEX_ROUTES[index]) return <NotFound />;
  return <IndexView key={index} slug={index} c={c} />;
}

function IndexView({ slug, c }) {
  const { t, lang } = useLang();
  const bodyRef = useRef(null);
  const { data: reports } = useApi('/api/reports');
  const { data: metrics } = useApi(c.context.length ? '/api/metrics' : null);
  const record = Array.isArray(reports) ? reports.find((r) => r.slug === INDEX_ROUTES[slug]) : null;
  const published = record?.status === 'published';
  const plain = /^planned$/i.test(splitPlaceholder(record?.statusLabel || 'Planned').text);
  // The status in the page language (statusLabelTa when supplied); English only as a marked fallback.
  const statusLbl = localLabel(record?.statusLabel || 'Planned', record?.statusLabelTa, lang);
  const statusText = plain ? t('Planned', 'திட்டமிடப்பட்டது') : splitPlaceholder(statusLbl.text).text;
  const statusLang = plain || !statusLbl.isEn ? undefined : 'en';
  const year = record?.year || null;
  const context = useMemo(
    () => (Array.isArray(metrics) ? c.context.map((id) => metrics.find((m) => m.id === id)).filter(Boolean) : []),
    [metrics, c.context],
  );
  const findings = published && Array.isArray(record?.keyFindings) ? record.keyFindings : [];
  const others = INDEX_SLUGS.filter((s) => s !== slug);
  const navItems = NAV.map(([id, a, b]) => ({ id: `index-${id}`, label: t(a, b) }));

  return (
    <>
      {/* SEO-TA: pending native review */}
      <Seo
        title={fitTitle(t(...(INDEX_SEO_TITLE[slug] || [c.name, c.name])), c.name)}
        description={fitDescription(
          // Not yet published: "Launched at" in the lede is future ("Launches at") in the meta description.
          published ? t(c.lede[0], c.lede[1]) : t(c.lede[0].replace(/\bLaunched at\b/, 'Launches at'), c.lede[1]),
          c.hook ? t(c.hook[0], c.hook[1]) : null,
          [
            c.audience && t(`For ${c.audience[0].replace(/^[A-Z](?=[a-z])/, (m) => m.toLowerCase())}.`, `யாருக்கு: ${c.audience[1]}.`),
            t('Method published first.', 'முறையியல் முதலில் வெளியிடப்படும்.'),
          ],
          [
            t('A StartNet index for Tamil Nadu, with the method published before the first edition.', 'தமிழ்நாட்டுக்கான StartNet குறியீடு; முதல் பதிப்புக்கு முன் முறையியல் வெளியிடப்படும்.'),
            t('A StartNet index for Tamil Nadu.', 'தமிழ்நாட்டுக்கான StartNet குறியீடு.'),
          ]
        )}
      />

      <PageHero
        surface="night"
        eyebrow={t('Index', 'குறியீடு')}
        titleClass="display-xl index-detail__hero-title"
        title={c.name}
        lede={t(c.lede[0], c.lede[1])}
        breadcrumbs={[
          { label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' },
          { label: t('Indices', 'குறியீடுகள்'), to: '/insights/indices' },
          { label: c.name },
        ]}
        art={{ variant: c.art, ratio: '4/5', seed: c.seed, night: true, label: c.name, alt: '' }}
        meta={
          <div className="index-detail__badges">
            <Badge kind="type">{t(c.short[0], c.short[1])}</Badge>
            {year && <Badge kind="lang">{year}</Badge>}
            <Badge kind="status" status={published ? 'open' : 'upcoming'}>
              {published ? t('Published', 'வெளியிடப்பட்டது') : t('Planned', 'திட்டமிடப்பட்டது')}
            </Badge>
          </div>
        }
        actions={
          <>
            <Button href="#index-notify" icon={Bell}>{t('Notify me', 'எனக்கு அறிவியுங்கள்')}</Button>
            {c.primary && <Button variant="tertiary" to={c.primary.to}>{t(c.primary.en, c.primary.ta)}</Button>}
          </>
        }
      />

      <Section surface="paper" className="index-detail">
        <div className="index-detail__layout">
          <div className="index-detail__aside">
            <div className="index-detail__sticky">
              <ChapterNav items={navItems} targetRef={bodyRef}>
                <KeyFacts
                  sticky={false}
                  title={t('At a glance', 'சுருக்கமாக')}
                  items={[
                    { label: t('For', 'யாருக்கு'), value: t(c.audience[0], c.audience[1]) },
                    c.unit && { label: t('Scored unit', 'மதிப்பிடப்படும் அலகு'), value: t(c.unit[0], c.unit[1]) },
                    {
                      label: t('Status', 'நிலை'),
                      value: (
                        // The status note ("[date TBC]") is an editorial mark: not shown.
                        <span lang={statusLang}>{statusText}</span>
                      ),
                    },
                    { label: t('Method', 'முறையியல்'), value: t('Published before the first edition', 'முதல் பதிப்புக்கு முன் வெளியிடப்படும்') },
                  ].filter(Boolean)}
                />
              </ChapterNav>
            </div>
          </div>

          <article className="index-detail__body" ref={bodyRef}>
            <section id="index-about" className="index-detail__block" aria-labelledby="index-about-h">
              <h2 id="index-about-h" className="h3">{t('What it is', 'இது என்ன')}</h2>
              {c.hook && (
                <p className="index-detail__hook">
                  {t(c.hook[0], c.hook[1]).replace(/\.$/, '')}<span className="dot">.</span>
                </p>
              )}
              <p className="index-detail__prose">
                {t(
                  'A named, quotable framework: the same definitions every edition, published method, a source or confidence tag on every figure, and a public log of what we corrected.',
                  'பெயரிடப்பட்ட, மேற்கோள் காட்டக்கூடிய கட்டமைப்பு: ஒவ்வொரு பதிப்பிலும் அதே வரையறைகள், வெளியிடப்பட்ட முறையியல், ஒவ்வொரு எண்ணுக்கும் ஆதாரம் அல்லது நம்பகத்தன்மைக் குறி, நாங்கள் திருத்தியவற்றின் பொதுப் பதிவு.',
                )}
              </p>
              {c.related && (
                <Button variant="tertiary" to={c.related.to} icon={ArrowRight}>{t(c.related.en, c.related.ta)}</Button>
              )}
            </section>

            <section id="index-measured" className="index-detail__block" aria-labelledby="index-measured-h">
              <h2 id="index-measured-h" className="h3">{t("What's measured", 'எதை அளவிடுகிறது')}</h2>
              {c.scope ? (
                <>
                  <p className="index-detail__prose">
                    {t('The questions this index is set up to answer:', 'இந்தக் குறியீடு பதில் தர அமைக்கப்பட்ட கேள்விகள்:')}
                  </p>
                  <ol className="index-detail__scope">
                    {c.scope.map(([a, b], i) => (
                      <li key={a}>
                        <span className="index-detail__num">{String(i + 1).padStart(2, '0')}</span>
                        <span>{t(a, b)}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="index-detail__muted">
                    {t('Indicators and weights come with the published method.', 'குறிகாட்டிகளும் எடைகளும் வெளியிடப்படும் முறையியலுடன் வரும்.')}
                  </p>
                </>
              ) : (
                <p className="index-detail__prose">
                  {t('What this index measures will be set out in its method.', 'இந்தக் குறியீடு எதை அளவிடுகிறது என்பது அதன் முறையியலில் விளக்கப்படும்.')}
                </p>
              )}
              {context.length > 0 && (
                <div className="index-detail__context">
                  <h3 className="h6 index-detail__context-title">{t('Context', 'பின்னணி')}</h3>
                  <div className="index-detail__context-grid">
                    {context.map((m) => <Stat key={m.id} metric={m} variant="compact" />)}
                  </div>
                  <p className="index-detail__muted">
                    {t('Public context figures, not index scores.', 'இவை பொதுப் பின்னணி எண்கள்; குறியீட்டு மதிப்பெண்கள் அல்ல.')}
                  </p>
                </div>
              )}
            </section>

            <section id="index-method" className="index-detail__block" aria-labelledby="index-method-h">
              <h2 id="index-method-h" className="h3">{t('Method', 'முறையியல்')}</h2>
              <ul className="index-detail__rules">
                <li>{t("We'll publish the method before the first edition.", 'முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.')}</li>
                <li>{t('Data comes from StartNet X with founders’ consent, and from public sources named next to each figure.', 'நிறுவனர்களின் ஒப்புதலுடன் StartNet X-இலிருந்தும், ஒவ்வொரு எண்ணுக்கும் அருகில் குறிப்பிடப்படும் பொது ஆதாரங்களிலிருந்தும் தரவு பெறப்படுகிறது.')}</li>
                <li>{t('Individual founders are never named without their permission.', 'அனுமதி இல்லாமல் எந்த நிறுவனரின் பெயரும் வெளியிடப்படாது.')}</li>
                <li>{t('Sponsors do not see findings before publication and have no say in them.', 'வெளியீட்டுக்கு முன் நிதியளிப்பாளர்கள் கண்டறிதல்களைப் பார்ப்பதில்லை; அவற்றில் அவர்களுக்கு எந்தக் கருத்துரிமையும் இல்லை.')}</li>
              </ul>
              <dl className="index-detail__tags">
                {TAG_RULES.map((r) => (
                  <div key={r.tag} className="index-detail__tag">
                    <dt><TagChip tag={r.tag} /></dt>
                    <dd>{t(r.en, r.ta)}</dd>
                  </div>
                ))}
              </dl>
              <div className="cluster index-detail__links">
                <Button variant="tertiary" to="/about/evidence-standard" icon={ArrowRight}>{t('Our evidence standard', 'எங்கள் ஆதாரத் தரநிலை')}</Button>
                <Button variant="tertiary" to="/insights/founder-ledger/corrections" icon={ArrowRight}>{t('Corrections log', 'திருத்தங்கள் பதிவு')}</Button>
              </div>
            </section>

            <section id="index-status" className="index-detail__block" aria-labelledby="index-status-h">
              <h2 id="index-status-h" className="h3">{t('Publication status', 'வெளியீட்டு நிலை')}</h2>
              <ol className="index-detail__timeline">
                <li data-state="done">
                  <span className="index-detail__step">{t('Announced', 'அறிவிக்கப்பட்டது')}</span>
                  <span className="index-detail__step-note">{t('Named and planned.', 'பெயரிடப்பட்டு, திட்டமிடப்பட்டுள்ளது.')}</span>
                </li>
                <li data-state={published ? 'done' : 'next'}>
                  <span className="index-detail__step">{t('Method published', 'முறையியல் வெளியீடு')}</span>
                </li>
                <li data-state={published ? 'done' : 'later'}>
                  <span className="index-detail__step">{t('First edition', 'முதல் பதிப்பு')}</span>
                  <span className="index-detail__step-note">
                    <span lang={statusLang}>{statusText}</span>
                  </span>
                </li>
              </ol>
            </section>

            <section id="index-scores" className="index-detail__block" aria-labelledby="index-scores-h">
              <h2 id="index-scores-h" className="h3">{t('Scores', 'மதிப்பெண்கள்')}</h2>
              {findings.length > 0 && (
                <RevealGroup className="index-detail__findings">
                  {findings.map((m, i) => <div key={m.id || i} className="index-detail__finding"><Stat metric={m} /></div>)}
                </RevealGroup>
              )}
              {/* No scores yet: the placeholder score table is not shown (it returns with the first edition). */}
              <p className="index-detail__muted">
                {t(
                  'Scores are published with the first edition, after the method.',
                  'முறையியலுக்குப் பிறகு, முதல் பதிப்புடன் மதிப்பெண்கள் வெளியிடப்படும்.',
                )}
              </p>
              <span className="index-detail__see">
                <Button variant="secondary" disabled>{t('See your institution', 'உங்கள் நிறுவனத்தைப் பாருங்கள்')}</Button>
                <span className="index-detail__muted">{t('Opens with the first edition.', 'முதல் பதிப்புடன் திறக்கும்.')}</span>
              </span>
            </section>
          </article>
        </div>
      </Section>

      <Section surface="paper" id="index-notify" width="narrow" labelledBy="index-notify-h">
        <div className="index-detail__notify">
          <Reveal>
            <p className="eyebrow">{t('Planned', 'திட்டமிடப்பட்டது')}</p>
            <h2 id="index-notify-h" className="h2">
              {t('Get the method and the first edition', 'முறையியலையும் முதல் பதிப்பையும் பெறுங்கள்')}<span className="dot">.</span>
            </h2>
            <p className="index-detail__prose">
              {t("Planned. We'll publish the method before the first edition.", 'திட்டமிடப்பட்டுள்ளது. முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.')}
            </p>
          </Reveal>
          <NotifyForm context={`index:${slug}`} what={c.name} />
        </div>
      </Section>

      <Section surface="white" labelledBy="index-others-h">
        <SectionHeader
          id="index-others-h"
          eyebrow={t('Indices', 'குறியீடுகள்')}
          title={t('Other indices', 'பிற குறியீடுகள்')}
          action={<Button variant="tertiary" to="/insights/indices" icon={ArrowRight}>{t('All indices', 'அனைத்துக் குறியீடுகளும்')}</Button>}
        />
        <RevealGroup className="index-detail__others">
          {others.map((s) => {
            const o = INDEX_CONTENT[s];
            return (
              <Card
                key={s}
                to={`/insights/indices/${s}`}
                eyebrow={t(o.short[0], o.short[1])}
                title={o.name}
                body={t(o.lede[0], o.lede[1])}
                art={{ variant: o.art, seed: o.seed, ratio: '16/9', alt: '' }}
              />
            );
          })}
        </RevealGroup>
      </Section>
    </>
  );
}
