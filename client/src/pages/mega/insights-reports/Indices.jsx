// /insights/indices — indices hub (Book 1 Part B §2.2 "Indices · T07 · Named, quotable frameworks · Institutions, media ·
// See your institution · P3"; §3.2 Insights mega menu "Reports & indices"). Paper page with one Night band (the method rules).
// Data: GET /api/reports (kind 'index' status labels). Copy: Book 2 §6.1 microcopy for planned items.
import { ArrowRight, Bell, BookOpenCheck, FileSearch, ShieldCheck, Tags } from 'lucide-react';
import {
  Seo, PageHero, Section, SectionHeader, Card, Badge, Button, Reveal, RevealGroup, TagChip,
} from '../../../components';
import { useApi } from '../../../hooks/useApi.js';
import { useLang } from '../../../lib/i18n.jsx';
import { webPageLd, itemListLd, langPath, articleLd } from '../../../lib/seo.js';
import NotifyForm from './NotifyForm.jsx';
import { INDEX_CONTENT } from './indexContent.js';
import { INDEX_ROUTES, INDEX_SLUGS, TAG_RULES, splitPlaceholder, localLabel } from './shared.js';
import './Indices.css';

const RULES = [
  {
    icon: BookOpenCheck,
    title: ['Method first', 'முதலில் முறையியல்'],
    body: ["We'll publish the method before the first edition.", 'முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.'],
  },
  {
    icon: Tags,
    title: ['A tag on every figure', 'ஒவ்வொரு எண்ணுக்கும் ஒரு குறி'],
    body: [
      'Every figure carries a source or an A/B/C confidence tag. C-tagged estimates are never summed into A or B.',
      'ஒவ்வொரு எண்ணுக்கும் ஆதாரம் அல்லது A/B/C நம்பகத்தன்மைக் குறி உண்டு. C மதிப்பீடுகள் A அல்லது B உடன் ஒருபோதும் கூட்டப்படுவதில்லை.',
    ],
  },
  {
    icon: FileSearch,
    title: ['Corrections in public', 'திருத்தங்கள் வெளிப்படையாக'],
    body: [
      'Past editions stay frozen, and a corrected figure says so in the corrections log.',
      'பழைய பதிப்புகள் மாற்றப்படுவதில்லை; திருத்தப்பட்ட எண் திருத்தங்கள் பதிவில் அதைக் குறிப்பிடும்.',
    ],
  },
  {
    icon: ShieldCheck,
    title: ['Sponsors have no say', 'நிதியளிப்பாளர்களுக்குக் கருத்துரிமை இல்லை'],
    body: [
      'Sponsors do not see findings before publication and have no say in them.',
      'வெளியீட்டுக்கு முன் நிதியளிப்பாளர்கள் கண்டறிதல்களைப் பார்ப்பதில்லை; அவற்றில் அவர்களுக்கு எந்தக் கருத்துரிமையும் இல்லை.',
    ],
  },
];

export default function Indices() {
  const { t, lang } = useLang();
  const { data } = useApi('/api/reports');
  const records = Array.isArray(data) ? data : [];

  return (
    <>
      <Seo
        // SEO-TA: pending native review
        title={t('Startup indices for Tamil Nadu: method first', 'தமிழ்நாடு ஸ்டார்ட்அப் குறியீடுகள்')}
        description={t(
          'Campus Innovation Index, TN Research Commercialisation Index and Founder Readiness Index: named frameworks for Tamil Nadu, method published first.',
          'Campus Innovation Index, TN Research Commercialisation Index, Founder Readiness Index: தமிழ்நாட்டுக்கான கட்டமைப்புகள்; முறையியல் முதலில் வெளியிடப்படும்.',
        )}
        jsonLd={[
          webPageLd({ path: langPath('/insights/indices', lang), type: 'CollectionPage', lang, name: t('Startup indices for Tamil Nadu', 'தமிழ்நாடு ஸ்டார்ட்அப் குறியீடுகள்') }),
          itemListLd({
            name: t('StartNet indices', 'StartNet குறியீடுகள்'),
            lang,
            items: [
              { name: 'Campus Innovation Index', path: '/insights/indices/campus-innovation-index' },
              { name: 'TN Research Commercialisation Index', path: '/insights/indices/research-commercialisation-index' },
              { name: 'Founder Readiness Index', path: '/insights/indices/founder-readiness-index' },
            ],
          }),
        ]}
      />

      <PageHero
        eyebrow={t('Insights · Indices', 'நுண்ணறிவுகள் · குறியீடுகள்')}
        titleClass="display-xl indices-hero__title"
        title={t('Named, quotable frameworks.', 'பெயரிடப்பட்ட, மேற்கோள் காட்டக்கூடிய கட்டமைப்புகள்.')}
        lede={t(
          'Three indices on how Tamil Nadu makes founders: in its institutions, in its research and among founders themselves. Each publishes its method before its first edition.',
          'தமிழ்நாடு நிறுவனர்களை எப்படி உருவாக்குகிறது என்பதைப் பற்றிய மூன்று குறியீடுகள்: கல்வி நிறுவனங்களில், ஆராய்ச்சியில், நிறுவனர்களிடையே. ஒவ்வொன்றும் தன் முதல் பதிப்புக்கு முன் முறையியலை வெளியிடும்.',
        )}
        breadcrumbs={[{ label: t('Insights', 'நுண்ணறிவுகள்'), to: '/insights' }, { label: t('Indices', 'குறியீடுகள்') }]}
        art={{ variant: 'map', ratio: '4/5', seed: 29, alt: '', animate: true }}
        actions={
          <>
            <Button to="/insights/indices/campus-innovation-index" icon={ArrowRight}>{t('See your institution', 'உங்கள் நிறுவனத்தைப் பாருங்கள்')}</Button>
            <Button variant="tertiary" href="#indices-notify" icon={Bell}>{t('Notify me', 'எனக்கு அறிவியுங்கள்')}</Button>
          </>
        }
      />

      <Section surface="paper" labelledBy="indices-list-h">
        <SectionHeader
          id="indices-list-h"
          eyebrow={t('Three indices', 'மூன்று குறியீடுகள்')}
          title={t('What each index scores', 'ஒவ்வொரு குறியீடும் எதை மதிப்பிடுகிறது')}
          lede={t("Planned. We'll publish the method before the first edition.", 'திட்டமிடப்பட்டுள்ளது. முதல் பதிப்புக்கு முன் முறையியலை வெளியிடுவோம்.')}
        />
        <RevealGroup className="indices-grid">
          {INDEX_SLUGS.map((slug) => {
            const c = INDEX_CONTENT[slug];
            const rec = records.find((r) => r.slug === INDEX_ROUTES[slug]);
            const lbl = localLabel(rec?.statusLabel || '', rec?.statusLabelTa, lang);
            const st = splitPlaceholder(lbl.text);
            // The badge already says "Planned"; only show the API label when it adds something (a date, a launch moment).
            const stText = /^planned$/i.test(splitPlaceholder(rec?.statusLabel || '').text) ? '' : st.text;
            const live = rec?.status === 'published';
            return (
              <div key={slug} className="indices-grid__item">
                <Card
                  to={`/insights/indices/${slug}`}
                  eyebrow={t(c.short[0], c.short[1])}
                  title={c.name}
                  body={t(c.lede[0], c.lede[1])}
                  art={{ variant: c.art, seed: c.seed, ratio: '3/2', alt: '' }}
                  meta={
                    <div className="indices-card__meta">
                      <Badge kind="status" status={live ? 'open' : 'upcoming'}>
                        {live ? t('Published', 'வெளியிடப்பட்டது') : t('Planned', 'திட்டமிடப்பட்டது')}
                      </Badge>
                      {/* The inline note ("[date TBC]") is an editorial mark: only the real label shows. */}
                      {stText && (
                        <span className="indices-card__status">
                          <span lang={lbl.isEn ? 'en' : undefined}>{stText}</span>
                        </span>
                      )}
                    </div>
                  }
                  cta={t('Read about the index', 'குறியீட்டைப் பற்றிப் படியுங்கள்')}
                />
              </div>
            );
          })}
        </RevealGroup>
      </Section>

      {/* The page's one Night band: the rules every index follows. */}
      <Section surface="night" labelledBy="indices-rules-h">
        <SectionHeader
          id="indices-rules-h"
          eyebrow={t('How every index works', 'ஒவ்வொரு குறியீடும் செயல்படும் விதம்')}
          title={t('Same rules as the Founder Ledger', 'Founder Ledger-இன் அதே விதிகள்')}
          action={<Button variant="secondary" to="/about/evidence-standard" icon={ArrowRight}>{t('Our evidence standard', 'எங்கள் ஆதாரத் தரநிலை')}</Button>}
        />
        <RevealGroup className="indices-rules">
          {RULES.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title[0]} className="indices-rules__item">
                <Icon size={24} aria-hidden="true" className="indices-rules__icon" />
                <h3 className="h5">{t(r.title[0], r.title[1])}</h3>
                <p>{t(r.body[0], r.body[1])}</p>
              </div>
            );
          })}
        </RevealGroup>
        <dl className="indices-tags">
          {TAG_RULES.map((r) => (
            <div key={r.tag} className="indices-tags__row">
              <dt><TagChip tag={r.tag} /></dt>
              <dd>{t(r.en, r.ta)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section surface="paper" id="indices-notify" labelledBy="indices-notify-h">
        <div className="indices-notify">
          <Reveal className="indices-notify__copy">
            <p className="eyebrow">{t('Reports & indices', 'அறிக்கைகள் & குறியீடுகள்')}</p>
            <h2 id="indices-notify-h" className="h2">
              {t('Get each method and first edition', 'ஒவ்வொரு முறையியலையும் முதல் பதிப்பையும் பெறுங்கள்')}<span className="dot">.</span>
            </h2>
            <p className="indices-notify__body">
              {t(
                "We'll email you when a method is published and when an index goes live.",
                'ஒரு முறையியல் வெளியாகும்போதும், ஒரு குறியீடு வெளியாகும்போதும் உங்களுக்கு மின்னஞ்சல் அனுப்புவோம்.',
              )}
            </p>
            <Button variant="tertiary" to="/insights/reports" icon={ArrowRight}>{t('Reports library', 'அறிக்கைகள் நூலகம்')}</Button>
          </Reveal>
          <NotifyForm context="indices" what={t('an index', 'ஒரு குறியீடு')} />
        </div>
      </Section>
    </>
  );
}
