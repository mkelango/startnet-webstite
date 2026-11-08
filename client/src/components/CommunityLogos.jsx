import { useLang } from '../lib/i18n.jsx';
import { STARTUPS } from '../data/startups.js';
import { LogoWall } from './LogoWall.jsx';

/**
 * The PnP logo-tile carousel (SPEC §4.8 `LogoWall variant="carousel"`) for the companies built by founders in
 * StartNet's community: the same marks as the Home hero's proof strip, each captioned with its district, and a last
 * tile that opens the full list on /insights/stories. Shown where signed partners are not listed yet; it is labelled
 * as community companies, never as partners.
 */
export function CommunityLogos({ className }) {
  const { t } = useLang();
  const list = STARTUPS.filter((s) => s.logo).map((s) => ({
    slug: s.slug,
    name: s.name,
    logo: s.logo,
    caption: Array.isArray(s.place) ? t(s.place[0], s.place[1]) : undefined,
  }));
  return (
    <LogoWall
      className={className}
      partners={list}
      variant="carousel"
      title={t('Built by founders in our community', 'எங்கள் சமூக நிறுவனர்கள் உருவாக்கியவை')}
      allLink={{ label: t('View all', 'அனைத்தையும் பாருங்கள்'), to: '/insights/stories#community-startups' }}
    />
  );
}

export default CommunityLogos;
