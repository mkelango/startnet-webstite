// Tamil Nadu's 38 districts (Book 1 Part B §2.2: /districts/<district>, T20).
// English names follow the Government of Tamil Nadu's official spellings; Tamil names are the official
// Tamil forms. Slugs are the lower-case English name (nav.js already links /districts/chennai, /coimbatore,
// /madurai, /tiruchirappalli). lat/lon are the approximate district headquarters, used only to place a dot
// on the locator inset and to list nearby districts. They are not boundaries and carry no figures.

export const DISTRICTS = [
  { slug: 'ariyalur', en: 'Ariyalur', ta: 'அரியலூர்', hq: 'Ariyalur', lat: 11.14, lon: 79.08 },
  { slug: 'chengalpattu', en: 'Chengalpattu', ta: 'செங்கல்பட்டு', hq: 'Chengalpattu', lat: 12.69, lon: 79.98 },
  { slug: 'chennai', en: 'Chennai', ta: 'சென்னை', hq: 'Chennai', lat: 13.08, lon: 80.27, metro: true },
  { slug: 'coimbatore', en: 'Coimbatore', ta: 'கோயம்புத்தூர்', hq: 'Coimbatore', lat: 11.02, lon: 76.96, metro: true },
  { slug: 'cuddalore', en: 'Cuddalore', ta: 'கடலூர்', hq: 'Cuddalore', lat: 11.75, lon: 79.75 },
  { slug: 'dharmapuri', en: 'Dharmapuri', ta: 'தருமபுரி', hq: 'Dharmapuri', lat: 12.13, lon: 78.16 },
  { slug: 'dindigul', en: 'Dindigul', ta: 'திண்டுக்கல்', hq: 'Dindigul', lat: 10.36, lon: 77.98 },
  { slug: 'erode', en: 'Erode', ta: 'ஈரோடு', hq: 'Erode', lat: 11.34, lon: 77.72 },
  { slug: 'kallakurichi', en: 'Kallakurichi', ta: 'கள்ளக்குறிச்சி', hq: 'Kallakurichi', lat: 11.74, lon: 78.96 },
  { slug: 'kancheepuram', en: 'Kancheepuram', ta: 'காஞ்சிபுரம்', hq: 'Kancheepuram', lat: 12.83, lon: 79.7, metro: true },
  { slug: 'kanniyakumari', en: 'Kanniyakumari', ta: 'கன்னியாகுமரி', hq: 'Nagercoil', lat: 8.18, lon: 77.41 },
  { slug: 'karur', en: 'Karur', ta: 'கரூர்', hq: 'Karur', lat: 10.96, lon: 78.08 },
  { slug: 'krishnagiri', en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி', hq: 'Krishnagiri', lat: 12.52, lon: 78.21 },
  { slug: 'madurai', en: 'Madurai', ta: 'மதுரை', hq: 'Madurai', lat: 9.93, lon: 78.12 },
  { slug: 'mayiladuthurai', en: 'Mayiladuthurai', ta: 'மயிலாடுதுறை', hq: 'Mayiladuthurai', lat: 11.1, lon: 79.65 },
  { slug: 'nagapattinam', en: 'Nagapattinam', ta: 'நாகப்பட்டினம்', hq: 'Nagapattinam', lat: 10.77, lon: 79.84 },
  { slug: 'namakkal', en: 'Namakkal', ta: 'நாமக்கல்', hq: 'Namakkal', lat: 11.22, lon: 78.17 },
  { slug: 'nilgiris', en: 'The Nilgiris', ta: 'நீலகிரி', hq: 'Udhagamandalam', lat: 11.41, lon: 76.7 },
  { slug: 'perambalur', en: 'Perambalur', ta: 'பெரம்பலூர்', hq: 'Perambalur', lat: 11.23, lon: 78.88 },
  { slug: 'pudukkottai', en: 'Pudukkottai', ta: 'புதுக்கோட்டை', hq: 'Pudukkottai', lat: 10.38, lon: 78.82 },
  { slug: 'ramanathapuram', en: 'Ramanathapuram', ta: 'இராமநாதபுரம்', hq: 'Ramanathapuram', lat: 9.37, lon: 78.83 },
  { slug: 'ranipet', en: 'Ranipet', ta: 'இராணிப்பேட்டை', hq: 'Ranipet', lat: 12.93, lon: 79.33 },
  { slug: 'salem', en: 'Salem', ta: 'சேலம்', hq: 'Salem', lat: 11.66, lon: 78.15 },
  { slug: 'sivaganga', en: 'Sivaganga', ta: 'சிவகங்கை', hq: 'Sivaganga', lat: 9.85, lon: 78.48 },
  { slug: 'tenkasi', en: 'Tenkasi', ta: 'தென்காசி', hq: 'Tenkasi', lat: 8.96, lon: 77.3 },
  { slug: 'thanjavur', en: 'Thanjavur', ta: 'தஞ்சாவூர்', hq: 'Thanjavur', lat: 10.79, lon: 79.14 },
  { slug: 'theni', en: 'Theni', ta: 'தேனி', hq: 'Theni', lat: 10.01, lon: 77.48 },
  { slug: 'thoothukudi', en: 'Thoothukudi', ta: 'தூத்துக்குடி', hq: 'Thoothukudi', lat: 8.76, lon: 78.13 },
  { slug: 'tiruchirappalli', en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி', hq: 'Tiruchirappalli', lat: 10.79, lon: 78.7 },
  { slug: 'tirunelveli', en: 'Tirunelveli', ta: 'திருநெல்வேலி', hq: 'Tirunelveli', lat: 8.71, lon: 77.76 },
  { slug: 'tirupathur', en: 'Tirupathur', ta: 'திருப்பத்தூர்', hq: 'Tirupathur', lat: 12.5, lon: 78.57 },
  { slug: 'tiruppur', en: 'Tiruppur', ta: 'திருப்பூர்', hq: 'Tiruppur', lat: 11.11, lon: 77.34 },
  { slug: 'tiruvallur', en: 'Tiruvallur', ta: 'திருவள்ளூர்', hq: 'Tiruvallur', lat: 13.14, lon: 79.91 },
  { slug: 'tiruvannamalai', en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை', hq: 'Tiruvannamalai', lat: 12.23, lon: 79.07 },
  { slug: 'tiruvarur', en: 'Tiruvarur', ta: 'திருவாரூர்', hq: 'Tiruvarur', lat: 10.77, lon: 79.64 },
  { slug: 'vellore', en: 'Vellore', ta: 'வேலூர்', hq: 'Vellore', lat: 12.92, lon: 79.13 },
  { slug: 'viluppuram', en: 'Viluppuram', ta: 'விழுப்புரம்', hq: 'Viluppuram', lat: 11.94, lon: 79.49 },
  { slug: 'virudhunagar', en: 'Virudhunagar', ta: 'விருதுநகர்', hq: 'Virudhunagar', lat: 9.58, lon: 77.96 },
];

/** The 38 canonical slugs (used by routes.js and the server's 404 check). */
export const DISTRICT_SLUGS = DISTRICTS.map((d) => d.slug);

/**
 * Common alternative spellings → canonical slug. The page redirects these client-side;
 * the server may also 301 them (see README).
 */
export const DISTRICT_ALIASES = {
  'the-nilgiris': 'nilgiris',
  ooty: 'nilgiris',
  kanyakumari: 'kanniyakumari',
  kanchipuram: 'kancheepuram',
  trichy: 'tiruchirappalli',
  tiruchi: 'tiruchirappalli',
  tuticorin: 'thoothukudi',
  villupuram: 'viluppuram',
  thiruvallur: 'tiruvallur',
  thiruvarur: 'tiruvarur',
  thiruvannamalai: 'tiruvannamalai',
  tirupattur: 'tirupathur',
  sivagangai: 'sivaganga',
  tirupur: 'tiruppur',
  kallakurichchi: 'kallakurichi',
};

const BY_SLUG = new Map(DISTRICTS.map((d) => [d.slug, d]));

/** Canonical district for a slug, or null. */
export function findDistrict(slug) {
  if (!slug) return null;
  return BY_SLUG.get(String(slug).toLowerCase()) || null;
}

/** Canonical slug for an alias, or null. */
export function aliasTarget(slug) {
  if (!slug) return null;
  return DISTRICT_ALIASES[String(slug).toLowerCase()] || null;
}

/** Approximate great-circle distance in km between two district headquarters. */
export function distanceKm(a, b) {
  const R = 6371;
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The n nearest districts by headquarters distance. */
export function nearestDistricts(d, n = 4) {
  return DISTRICTS.filter((x) => x.slug !== d.slug)
    .map((x) => ({ ...x, km: distanceKm(d, x) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n);
}

/** Metro districts named in the "district promise" (Book 2 §2.4): Chennai, Coimbatore, Kancheepuram. */
export const METRO_SLUGS = DISTRICTS.filter((d) => d.metro).map((d) => d.slug);

/**
 * Real, verifiable local activity that is not an event (Book 1 §9.3): a Women or Connect Circle meeting in the
 * district, or a signed local partner institution. StartNet adds a district here only once that is true, e.g.
 * `chennai: { circle: true }` or `madurai: { partner: 'Signed with … on 2027-01-10' }`. Events are read from the
 * events API, so they need no entry. Empty until StartNet supplies it.
 */
export const DISTRICT_ACTIVITY = {};

/** True when the district has a Circle or a signed partner on record (events are checked by the page). */
export const hasRecordedActivity = (slug) => {
  const a = Object.prototype.hasOwnProperty.call(DISTRICT_ACTIVITY, slug) ? DISTRICT_ACTIVITY[slug] : null;
  return !!(a && (a.circle || a.partner));
};
