// JSON-LD for the StartNet X pages (Book 1 §9.4; SEO brief Oct 2026): every /startnet-x page is a WebPage whose
// `about` is the product, a SoftwareApplication. The one Offer is the free plan for individuals, because the
// pricing copy states it as policy ("Free for talent. Paid for organisations.", Book 2 §7.3). Paid plan prices are
// indicative (tag C) and are left out until the published rate card replaces them.
import { ORG_REF, SITE_ORIGIN, absUrl, compact, webPageLd } from '../../lib/seo.js';

export const SNX_APP_ID = `${SITE_ORIGIN}/startnet-x#software`;

/** The StartNet X SoftwareApplication node (full by default; `full: false` gives an @id reference). */
export function snxAppLd({ full = true, lang = 'en' } = {}) {
  if (!full) return { '@id': SNX_APP_ID };
  return compact({
    '@type': 'SoftwareApplication',
    '@id': SNX_APP_ID,
    name: 'StartNet X',
    alternateName: 'SNX',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: absUrl(lang === 'ta' ? '/ta/startnet-x' : '/startnet-x'),
    description:
      lang === 'ta'
        ? 'ஒவ்வொரு StartNet நிகழ்வு, படிப்பு, Circle, திட்டத்துக்கும் ஒரே நிறுவனர் சுயவிவரம். தனிநபர்களுக்கு இலவசம்.'
        : 'One founder profile across every StartNet event, course, circle and programme. Free for individuals.',
    inLanguage: ['en-IN', 'ta-IN'],
    publisher: ORG_REF,
    offers: {
      '@type': 'Offer',
      name: 'SNX Free',
      price: 0,
      priceCurrency: 'INR',
      category: 'Free',
      description: lang === 'ta' ? 'தனிநபர்களுக்கு (திறமையாளர்களுக்கு) இலவசம்' : 'Free for individuals (talent)',
    },
  });
}

/** WebPage for a StartNet X page, `about` the product. `full` embeds the whole SoftwareApplication node. */
export function snxPageLd({ path, name, description, lang = 'en', full = true, type = 'WebPage' }) {
  const page = webPageLd({ path: lang === 'ta' ? `/ta${path}` : path, name, description, lang, type });
  return { ...page, about: snxAppLd({ full, lang }) };
}
