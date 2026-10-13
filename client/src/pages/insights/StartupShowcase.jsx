// "Companies our founders are building": the community startups on /insights/stories (data/startups.js).
// Every card has the same shape: a fixed 16:9 logo tile, then sector and place, name, one-liner, description,
// founder, and StartNet's part in the journey pinned to the foot. All rows are equal height. The whole card links to
// the company's site in a new tab (stretched link on the name).
import { ArrowUpRight } from 'lucide-react';
import { RevealGroup, SectionHeader, TagChip } from '../../components';
import { useLang } from '../../lib/i18n.jsx';
import { STARTUPS, logoWidth, domainOf } from '../../data/startups.js';
import './StartupShowcase.css';

export default function StartupShowcase() {
  const { t } = useLang();
  const tr = (pair) => (Array.isArray(pair) ? t(pair[0], pair[1]) : pair);

  return (
    <div className="startups">
      <SectionHeader
        eyebrow={t('From the StartNet community', 'StartNet சமூகத்திலிருந்து')}
        title={t('Companies our founders are building', 'எங்கள் நிறுவனர்கள் உருவாக்கும் நிறுவனங்கள்')}
        id="startups-title"
        lede={t(
          `${STARTUPS.length} companies whose founders have grown with StartNet, through awards, Connect summits, Vibathon and our monthly network meetings. Here is what each one makes and who leads it.`,
          `விருதுகள், Connect உச்சி மாநாடுகள், Vibathon, மாதாந்திர வலையமைப்புக் கூட்டங்கள் வழியாக StartNet-உடன் வளர்ந்த நிறுவனர்களின் ${STARTUPS.length} நிறுவனங்கள். ஒவ்வொன்றும் என்ன உருவாக்குகிறது, யார் வழிநடத்துகிறார்கள் என்பது இங்கே.`,
        )}
      />

      <RevealGroup as="ul" className="startups-grid" aria-labelledby="startups-title">
        {STARTUPS.map((s) => (
          <li key={s.slug} className="startup-card">
            <div className="startup-card__logo">
              <img
                src={s.logo}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ '--logo-w': `${logoWidth(s.ratio, s.scale).toFixed(1)}%` }}
              />
            </div>

            <div className="startup-card__body">
              <p className="startup-card__meta">
                <span>{tr(s.sector)}</span>
                <span className="startup-card__place">{tr(s.place)}</span>
              </p>
              <h3 className="startup-card__name">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="startup-card__link">
                  {s.name}
                  <span className="visually-hidden">{t(' (opens in a new tab)', ' (புதிய தாவலில் திறக்கும்)')}</span>
                </a>
              </h3>
              <p className="startup-card__line">{tr(s.oneLiner)}</p>
              <p className="startup-card__desc">{tr(s.description)}</p>

              <dl className="startup-card__facts">
                <div>
                  <dt>{s.founders.length > 1 ? t('Founders', 'நிறுவனர்கள்') : t('Founder', 'நிறுவனர்')}</dt>
                  <dd>
                    {s.founders.map((f) => (
                      <span key={f.name} className="startup-card__founder">
                        {f.name}
                        {f.role && f.role[0] !== 'Founder' && <span className="startup-card__role">{tr(f.role)}</span>}
                      </span>
                    ))}
                  </dd>
                </div>
                {s.founded && (
                  <div>
                    <dt>{t('Founded', 'தொடக்கம்')}</dt>
                    <dd className="tnum">{s.founded}</dd>
                  </div>
                )}
              </dl>

              <div className="startup-card__foot">
                <p className="startup-card__tie">
                  <span className="startup-card__tie-dot" aria-hidden="true" />
                  {tr(s.tie)}
                </p>
                <span className="startup-card__domain" aria-hidden="true">
                  {domainOf(s.url)}
                  <ArrowUpRight size={16} strokeWidth={1.75} />
                </span>
              </div>
            </div>
          </li>
        ))}
      </RevealGroup>

      <p className="startups-note">
        <TagChip tag="B" />
        <span>
          {t(
            "Company details come from each company's website and public profiles, read in October 2026. StartNet's part in each journey is as StartNet reports it. Logos belong to their companies.",
            'நிறுவன விவரங்கள் ஒவ்வொரு நிறுவனத்தின் இணையதளம், பொதுச் சுயவிவரங்களிலிருந்து அக்டோபர் 2026-இல் எடுக்கப்பட்டவை. ஒவ்வொரு பயணத்திலும் StartNet-இன் பங்கு StartNet தெரிவிப்பதன்படி. சின்னங்கள் அந்தந்த நிறுவனங்களுக்கு உரியவை.',
          )}
        </span>
      </p>
    </div>
  );
}
