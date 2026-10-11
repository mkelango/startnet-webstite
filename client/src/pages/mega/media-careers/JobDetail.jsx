// /careers/:slug — Job page, T09 article variant with a key-facts aside (Book 1 Part B §2.2: role detail; CTA Apply).
// Data: GET /api/careers → Role { slug, title, team, location, type, summary, applyUrl? }.
// Optional fields rendered when the CMS supplies them: outcome, about (string|string[]), responsibilities[], requirements[]
// (alias lookingFor[]), niceToHave[], applyBy (ISO), language. Unknown slug → NotFound.
// Copy: Book 2 §10 (how we hire, commitments, general application).
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Mail, Target } from 'lucide-react';
import {
  Seo, Section, Breadcrumbs, Badge, Button, KeyFacts, Steps, CTABand, Stat, InlineMarks, KineticHeadline, Reveal, Skeleton, EmptyState,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang, contentLangFor } from '../../../lib/i18n.jsx';
import NotFound from '../../utility/LazyNotFound.jsx';
import { ORG_REF, SITE_ORIGIN, absUrl, langPath } from '../../../lib/seo.js';
import { fitTitle, fitDescription, realText } from '../../programmes/parts/seoFit.js';
import { CAREERS_EMAIL, ShareRow, fmtDate, isMark, paragraphs, strings } from './shared.jsx';
import './JobDetail.css';

export default function JobDetail() {
  const { slug } = useParams();
  const { t, lang, localePath } = useLang();
  const { data, loading, error } = useApi('/api/careers');

  if (loading) {
    return (
      <Section surface="paper">
        {/* No <Seo> while loading: keeps the prerendered title during hydration. */}
        <div className="job__loading" aria-busy="true">
          <Skeleton height="1.5rem" />
          <Skeleton height="4rem" />
          <Skeleton height="14rem" />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section surface="paper" width="narrow">
        <Seo title={t('Careers', 'பணி வாய்ப்புகள்')} />
        <h1 className="h2">{t("We couldn't load this role", 'இந்தப் பணியை ஏற்ற முடியவில்லை')}<span className="dot">.</span></h1>
        <EmptyState
          title={t('Please try again in a moment.', 'சிறிது நேரத்தில் மீண்டும் முயலுங்கள்.')}
          action={<Button variant="secondary" to="/careers">{t('All open roles', 'எல்லாப் பணி வாய்ப்புகளும்')}</Button>}
        />
      </Section>
    );
  }

  const roles = Array.isArray(data) ? data : [];
  const role = roles.find((r) => r && r.slug === slug);
  if (!role) return <NotFound />;

  const others = roles.filter((r) => r && r.slug !== role.slug).slice(0, 3);
  const about = paragraphs(role.about || role.description);
  const responsibilities = strings(role.responsibilities);
  const requirements = strings(role.requirements || role.lookingFor);
  const niceToHave = strings(role.niceToHave);
  const titleIsMark = isMark(role.title);
  const plainTitle = titleIsMark ? t('this role', 'இந்தப் பணி') : role.title;
  const external = role.applyUrl && /^https?:/i.test(role.applyUrl);
  const applyHref = external
    ? role.applyUrl
    : `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${role.title}`)}`;
  const generalHref = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('General application')}`;

  const applyButton = (full) => (
    <Button href={applyHref} size="lg" full={full} icon={external ? ArrowUpRight : Mail} data-primary-cta="">
      {t('Apply now', 'இப்போதே விண்ணப்பியுங்கள்')}
    </Button>
  );

  const facts = [
    { label: t('Role', 'பணி'), value: titleIsMark ? <InlineMarks text={role.title} /> : role.title },
    { label: t('Team', 'குழு'), value: role.team ? <InlineMarks text={role.team} /> : null },
    { label: t('Location', 'இடம்'), value: role.location ? <InlineMarks text={role.location} /> : null },
    { label: t('Type', 'வகை'), value: role.type ? <InlineMarks text={role.type} /> : null },
    { label: t('Apply by', 'கடைசி நாள்'), value: role.applyBy ? <time dateTime={role.applyBy}>{fmtDate(role.applyBy, lang)}</time> : null },
    { label: t('Working languages', 'பணி மொழிகள்'), value: role.language ? <InlineMarks text={String(role.language)} /> : null },
  ];

  const hiring = [
    { title: t('Apply', 'விண்ணப்பியுங்கள்'), body: t('CV or LinkedIn, plus three lines on why.', 'CV அல்லது LinkedIn, ஏன் என்பதற்கு மூன்று வரிகள்.') },
    { title: t('A conversation with the hiring lead', 'பணியமர்த்தும் பொறுப்பாளருடன் உரையாடல்') },
    {
      title: t('A short, paid work sample', 'சுருக்கமான, ஊதியமுள்ள பணி மாதிரி'),
      body: t('For senior roles.', 'மூத்த பணிகளுக்கு.'),
    },
    { title: t('Meet the team', 'குழுவைச் சந்தியுங்கள்') },
  ];

  // JobPosting only for a real role (guard below: no placeholder title). datePosted / description are required by
  // Google; when the role has no real summary the posting is left out rather than padded.
  const jobDescription = realText(role.summary);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `${absUrl(`/careers/${role.slug}`)}#job`,
    url: absUrl(langPath(`/careers/${role.slug}`, lang)),
    title: role.title,
    ...(jobDescription ? { description: jobDescription } : {}),
    ...(role.posted || role.datePosted ? { datePosted: role.posted || role.datePosted } : {}),
    ...(role.applyBy ? { validThrough: role.applyBy } : {}),
    hiringOrganization: { ...ORG_REF, '@type': 'Organization', name: 'StartNet', sameAs: SITE_ORIGIN },
    ...(role.location
      ? { jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: role.location, addressRegion: 'Tamil Nadu', addressCountry: 'IN' } } }
      : {}),
    ...(role.type ? { employmentType: String(role.type).toUpperCase().replace(/[\s-]+/g, '_') } : {}),
  };

  const list = (items, fallback, icon) =>
    items.length ? (
      <ul className="job__list" role="list">
        {items.map((it, i) => (
          <li key={i} className="job__list-item">
            {icon}
            <span><InlineMarks text={it} /></span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="job__pending">{fallback}</p>
    );

  return (
    <article className="job">
      {/* A placeholder role is noindex (thin template); a real one is indexable with its JobPosting. */}
      <Seo
        title={titleIsMark ? t('Open role', 'பணி வாய்ப்பு') : fitTitle(`${role.title}: job at StartNet`, `${role.title} · ${t('Careers', 'பணி வாய்ப்புகள்')}`, role.title)}
        description={fitDescription(role.summary, [
          t('An open role at StartNet, Tamil Nadu’s founder-making network.', 'தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பான StartNet-இல் ஒரு பணி வாய்ப்பு.'),
          t('An open role at StartNet.', 'StartNet-இல் ஒரு பணி வாய்ப்பு.'),
        ])}
        noindex={titleIsMark}
        jsonLd={!titleIsMark && jobDescription ? jsonLd : null}
      />

      {/* Head on the ink band; the body sheet slides over it. */}
      <Section surface="night" pad="sm" className="job__head-section">
        <div className="job__head">
          <Breadcrumbs items={[{ label: t('Careers', 'பணி வாய்ப்புகள்'), to: '/careers' }, { label: titleIsMark ? t('Open role', 'பணி வாய்ப்பு') : role.title }]} />
          <div className="cluster job__chips">
            {role.team && <Badge kind="type"><InlineMarks text={role.team} /></Badge>}
            {role.type && <Badge kind="type"><InlineMarks text={role.type} /></Badge>}
            {role.location && <Badge kind="type"><InlineMarks text={role.location} /></Badge>}
          </div>
          {titleIsMark ? (
            <h1 className="job__title h1"><InlineMarks text={role.title} /></h1>
          ) : (
            <KineticHeadline text={role.title} as="h1" className="job__title h1" lang={contentLangFor(lang, role.title)} />
          )}
          {role.summary && <Reveal as="p" className="job__standfirst body-lg" lang={contentLangFor(lang, role.summary)}><InlineMarks text={role.summary} /></Reveal>}
          <div className="job__head-actions">
            {applyButton(false)}
            <Button href="#job-hire" variant="secondary" size="lg">{t('How we hire', 'நாங்கள் பணியமர்த்தும் முறை')}</Button>
          </div>
          <p className="job__hint">{t('CV or LinkedIn, plus three lines on why.', 'CV அல்லது LinkedIn, ஏன் என்பதற்கு மூன்று வரிகள்.')}</p>
        </div>
      </Section>

      {/* Body + key facts aside */}
      <Section surface="paper" pad="sm">
        <div className="job__layout">
          <div className="job__main">
            <section className="job__block" aria-labelledby="job-outcome-h">
              <h2 id="job-outcome-h" className="h4 job__block-title">
                <Target size={22} aria-hidden="true" /> {t("The outcome you'll own", 'நீங்கள் பொறுப்பேற்கும் விளைவு')}
              </h2>
              {role.outcome ? (
                <p className="job__outcome body-lg"><InlineMarks text={role.outcome} /></p>
              ) : (
                <p className="job__pending">
                  {t('You own an outcome, not a task list.', 'உங்களுக்கு ஒரு விளைவு பொறுப்பு, பணிப் பட்டியல் அல்ல.')}
                </p>
              )}
            </section>

            {about.length > 0 && (
              <section className="job__block job__prose" aria-labelledby="job-about-h">
                <h2 id="job-about-h" className="h4">{t('About the role', 'பணி பற்றி')}</h2>
                {about.map((p, i) => <p key={i}><InlineMarks text={p} /></p>)}
              </section>
            )}

            <section className="job__block" aria-labelledby="job-do-h">
              <h2 id="job-do-h" className="h4">{t("What you'll do", 'நீங்கள் செய்யப் போவது')}</h2>
              {list(responsibilities, t('Responsibilities', 'பொறுப்புகள்'), <ArrowRight size={18} aria-hidden="true" className="job__list-icon" />)}
            </section>

            <section className="job__block" aria-labelledby="job-bring-h">
              <h2 id="job-bring-h" className="h4">{t("What you'll bring", 'நீங்கள் கொண்டு வருவது')}</h2>
              {list(requirements, t('Skills and experience', 'திறன்கள், அனுபவம்'), <Check size={18} aria-hidden="true" className="job__list-icon job__list-icon--check" />)}
            </section>

            {niceToHave.length > 0 && (
              <section className="job__block" aria-labelledby="job-nice-h">
                <h2 id="job-nice-h" className="h4">{t('Good to have', 'இருந்தால் நல்லது')}</h2>
                {list(niceToHave, '', <Check size={18} aria-hidden="true" className="job__list-icon" />)}
              </section>
            )}

            <section className="job__block" aria-labelledby="job-work-h">
              <h2 id="job-work-h" className="h4">{t('What working here is like', 'இங்கு பணியாற்றுவது எப்படி இருக்கும்')}</h2>
              <ul className="job__list" role="list">
                <li className="job__list-item">
                  <Check size={18} aria-hidden="true" className="job__list-icon job__list-icon--check" />
                  <span>{t('You own an outcome, not a task list. Brand leads own audiences and results; engine owners own quality.', 'உங்களுக்கு ஒரு விளைவு பொறுப்பு, பணிப் பட்டியல் அல்ல. பிராண்ட் தலைவர்கள் பார்வையாளர்களுக்கும் முடிவுகளுக்கும் பொறுப்பு; சேவைப் பொறுப்பாளர்கள் தரத்துக்குப் பொறுப்பு.')}</span>
                </li>
                <li className="job__list-item">
                  <Check size={18} aria-hidden="true" className="job__list-icon job__list-icon--check" />
                  <span>{t("You'll work from Salem and in districts across Tamil Nadu, in Tamil and English.", 'சேலத்திலிருந்தும் தமிழ்நாடு முழுவதும் உள்ள மாவட்டங்களிலும், தமிழிலும் ஆங்கிலத்திலும் பணியாற்றுவீர்கள்.')}</span>
                </li>
                <li className="job__list-item">
                  <Check size={18} aria-hidden="true" className="job__list-icon job__list-icon--check" />
                  <span>
                    {t('Our numbers are public, so your work is visible.', 'எங்கள் எண்கள் பொதுவில் உள்ளன; அதனால் உங்கள் பணி வெளிப்படையாகத் தெரியும்.')}{' '}
                    <Link to={localePath('/insights/founder-ledger')}>{t('Read the Founder Ledger', 'Founder Ledger-ஐப் படியுங்கள்')}</Link>
                  </span>
                </li>
              </ul>
            </section>

            <section className="job__block job__commit" aria-labelledby="job-commit-h">
              <h2 id="job-commit-h" className="h4">{t('Our commitments', 'எங்கள் உறுதிமொழிகள்')}</h2>
              <p className="job__eo">
                {t('StartNet is an equal-opportunity employer.', 'StartNet சம வாய்ப்பு வழங்கும் நிறுவனம்.')}
              </p>
              {/* "POSH policy and internal committee [link]" is hidden until the policy link is supplied. */}
              <div className="job__commit-stat">
                <Stat
                  variant="compact"
                  value={40}
                  unit="%"
                  label={t(
                    'women across our programmes, at least: our aim, and the standard for our own hiring',
                    'எங்கள் திட்டங்களில் குறைந்தது பெண்களின் பங்கு: எங்கள் இலக்கு, எங்கள் சொந்தப் பணியமர்த்தலுக்கும் இதே அளவுகோல்'
                  )}
                  tag="C"
                  source={t('StartNet target', 'StartNet இலக்கு')}
                  note={t('A target, not a reported outcome. [confirm]', 'இது ஓர் இலக்கு, அறிக்கையிடப்பட்ட விளைவு அல்ல. [confirm]')}
                />
              </div>
            </section>

            <ShareRow title={titleIsMark ? t('An open role at StartNet', 'StartNet-இல் ஒரு பணி வாய்ப்பு') : `${role.title} · StartNet`} refCode={`job-${role.slug}`} />
          </div>

          <KeyFacts
            className="job__facts"
            title={t('Role at a glance', 'பணி ஒரு பார்வையில்')}
            items={facts}
            action={
              <>
                {applyButton(true)}
                <p className="job__facts-note">{t('We aim to reply within two working days.', 'இரண்டு வேலை நாட்களுக்குள் பதிலளிக்க முயல்கிறோம்.')}</p>
              </>
            }
          />
        </div>
      </Section>

      {/* How we hire */}
      <Section surface="white" id="job-hire" labelledBy="job-hire-h">
        <div className="job__hire">
          <div className="job__hire-intro">
            <p className="eyebrow">{t('How we hire', 'நாங்கள் பணியமர்த்தும் முறை')}</p>
            <h2 id="job-hire-h" className="h2">{t('Four steps, no surprises.', 'நான்கு படிகள், எதிர்பாராதது எதுவும் இல்லை.').replace(/\.$/, '')}<span className="dot">.</span></h2>
          </div>
          <Steps steps={hiring} variant="row" label={t('How we hire', 'நாங்கள் பணியமர்த்தும் முறை')} />
        </div>
      </Section>

      {/* Other roles */}
      {others.length > 0 && (
        <Section surface="paper" pad="sm" labelledBy="job-more-h">
          <div className="job__more-head">
            <h2 id="job-more-h" className="h4">{t('Other open roles', 'பிற பணி வாய்ப்புகள்')}</h2>
            <Button variant="tertiary" to="/careers">{t('All open roles', 'எல்லாப் பணி வாய்ப்புகளும்')}</Button>
          </div>
          <ul className="job__more" role="list">
            {others.map((r) => (
              <li key={r.slug}>
                <Link className="job__more-card" to={localePath(`/careers/${r.slug}`)}>
                  <span className="job__more-title" lang={contentLangFor(lang, r.title)}>{isMark(r.title) ? <InlineMarks text={r.title} /> : r.title}</span>
                  <span className="job__more-meta">{[r.team, r.location, r.type].filter(Boolean).join(' · ')}</span>
                  <ArrowRight size={18} aria-hidden="true" className="job__more-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CTABand surface="night"
        title={t(`Ready to apply for ${plainTitle}?`, `${plainTitle}-க்கு விண்ணப்பிக்கத் தயாரா?`)}
        body={t("Don't see your role? Send us a note about what you'd do here.", 'உங்களுக்கான பணி இல்லையா? இங்கு நீங்கள் என்ன செய்வீர்கள் என்று எங்களுக்கு எழுதுங்கள்.')}
        actions={
          <>
            <Button href={applyHref} icon={external ? ArrowUpRight : Mail}>{t('Apply now', 'இப்போதே விண்ணப்பியுங்கள்')}</Button>
            <Button href={generalHref} variant="secondary">{t('Send a general application', 'பொது விண்ணப்பம் அனுப்புங்கள்')}</Button>
          </>
        }
      />
    </article>
  );
}
