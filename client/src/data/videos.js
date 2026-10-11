/**
 * StartNet event videos (YouTube). Only videos checked to show the named event, published by StartNet or by a
 * sponsor / media partner of that event, and embeddable (oEmbed 200, playableInEmbed true; checked Oct 2026).
 * Sources and the ones left out are listed in docs/VIDEOS.md. Nothing here is downloaded: the poster comes from
 * i.ytimg.com and the player from youtube-nocookie.com, only when the visitor presses play.
 *
 * Each: { id, series?, edition?, place?, title, titleTa?, caption?, captionTa?, chips?, chipsTa?, duration?, credit,
 *         aspect?, poster?, posterZoom?, feature? }.
 * `series` is the event-series slug of data/photos.js (eventSeriesForPath); `edition` is the edition year used in
 * the photo keys (event/<series>/<edition>). `place` marks a non-event spot (about-history, about-network,
 * about-early-events, leadership). `aspect` is '16:9' (default) or '9:16' for vertical Shorts / phone footage.
 * `poster` names the i.ytimg.com size to start from when maxresdefault is known to be missing ('hqdefault').
 * `posterZoom` only when the poster has letterbox bars burned in. `chips` are short fact labels shown under the
 * title (VideoFeature), each taken from the listing. Facts in captions come from server/data/events.json and the
 * video's own listing (title, description, upload date) and nothing else: no names read off the footage.
 */
export const VIDEOS = [
  {
    id: 'hjdl0ChhIGY',
    series: 'd2c-connect',
    edition: '2024',
    title: 'D2C Connect Summit & Expo 2024, Le Méridien Coimbatore',
    titleTa: 'D2C Connect உச்சி மாநாடு & கண்காட்சி 2024, லே மெரிடியன் கோயம்புத்தூர்',
    caption: 'The day in three minutes · 30 November 2024',
    captionTa: 'மூன்று நிமிடங்களில் அந்த நாள் · 30 நவம்பர் 2024',
    duration: '3:22',
    credit: 'D2C Connect on YouTube',
    posterZoom: 1.33, // the film is letterboxed (about 2.35:1)
    feature: true,
  },
  {
    id: 'iDsGfi83cJQ',
    series: 'd2c-connect',
    edition: '2024',
    title: 'ClickPost at D2C Connect Summit & Expo 2024',
    titleTa: 'D2C Connect உச்சி மாநாடு & கண்காட்சி 2024-இல் ClickPost',
    caption: 'A sponsor session on returns, tracking and RTO',
    captionTa: 'ரிட்டர்ன்ஸ், டிராக்கிங், RTO பற்றி ஒரு ஸ்பான்சர் அமர்வு',
    duration: '5:41',
    credit: 'ClickPost on YouTube',
  },
  {
    // Sponsor Short posted 3 Dec 2024; part ClickPost card, part footage of the D2C ShePower panel on the event stage.
    // The surname shows only on the poster card, not in the title or description, so the caption uses 'Juie'.
    id: 'W8of-AARf14',
    series: 'd2c-connect',
    edition: '2024',
    aspect: '9:16',
    title: 'Juie from Team ClickPost at D2C Connect 2024',
    titleTa: 'D2C Connect 2024-இல் ClickPost குழுவின் Juie',
    caption: 'On returns, refund visibility and exchanges',
    captionTa: 'ரிட்டர்ன்ஸ், ரீஃபண்ட் தெரிவுநிலை, பரிமாற்றங்கள் பற்றி',
    chips: ['Sponsor Short'],
    chipsTa: ['ஸ்பான்சர் Short'],
    duration: '1:00',
    credit: 'ClickPost on YouTube',
  },
  {
    id: 'uN2vFxMIScg',
    series: 'genai-connect',
    edition: '2024',
    title: 'GenAI Connect Summit & Expo 2024, Salem',
    titleTa: 'GenAI Connect உச்சி மாநாடு & கண்காட்சி 2024, சேலம்',
    caption: 'Event coverage · 27 April 2024, Radisson Salem',
    captionTa: 'நிகழ்வுப் பதிவு · 27 ஏப்ரல் 2024, ரேடிசன் சேலம்',
    duration: '23:12',
    credit: 'Iconxt Stories on YouTube',
    feature: true,
  },
  {
    id: '-HXs7af5K1k',
    place: 'about-history',
    title: 'The StartNet launch event',
    titleTa: 'StartNet தொடக்க நிகழ்வு',
    caption: 'July 2023',
    captionTa: 'ஜூலை 2023',
    duration: '1:52',
    credit: 'StartNet on YouTube',
    posterZoom: 1.32, // letterboxed poster
  },
  // StartNet monthly network meeting, Hotel Windsor Castle, 30 September 2023: four testimonials on StartNet's own
  // channel (uploaded 5 Oct 2023 PT). Name, role and company come from each description; nothing else is named.
  {
    id: 'GaT8mPIl9oA',
    place: 'about-network',
    title: 'S. Velayutham, Founder & CEO, TamiraBot Advanced Engineering Pvt Ltd',
    titleTa: 'S. Velayutham, நிறுவனர் & CEO, TamiraBot Advanced Engineering Pvt Ltd',
    caption: 'StartNet monthly network meeting · Hotel Windsor Castle · 30 September 2023',
    captionTa: 'StartNet மாதாந்திர நெட்வொர்க் சந்திப்பு · Hotel Windsor Castle · 30 செப்டம்பர் 2023',
    chips: ['Testimonial'],
    chipsTa: ['அனுபவப் பகிர்வு'],
    duration: '1:47',
    credit: 'StartNet on YouTube',
    poster: 'hqdefault', // no maxresdefault; the 4:3 hq poster's bars fall outside the 16:9 crop
  },
  {
    id: 'LhxZNFtJiP4',
    place: 'about-network',
    title: 'A. K. Gowtham, Founder & CEO, Nutz',
    titleTa: 'A. K. Gowtham, நிறுவனர் & CEO, Nutz',
    caption: 'StartNet monthly network meeting · Hotel Windsor Castle · 30 September 2023',
    captionTa: 'StartNet மாதாந்திர நெட்வொர்க் சந்திப்பு · Hotel Windsor Castle · 30 செப்டம்பர் 2023',
    chips: ['Testimonial'],
    chipsTa: ['அனுபவப் பகிர்வு'],
    duration: '1:44',
    credit: 'StartNet on YouTube',
  },
  {
    // Three people are on screen; the listing names only Sivanesh K S, so the others are not named or described.
    id: 'ixvgMC3JO8Y',
    place: 'about-network',
    title: 'Sivanesh K S, MTech student',
    titleTa: 'Sivanesh K S, MTech மாணவர்',
    caption: 'StartNet monthly network meeting · Hotel Windsor Castle · 30 September 2023',
    captionTa: 'StartNet மாதாந்திர நெட்வொர்க் சந்திப்பு · Hotel Windsor Castle · 30 செப்டம்பர் 2023',
    chips: ['Testimonial'],
    chipsTa: ['அனுபவப் பகிர்வு'],
    duration: '2:09',
    credit: 'StartNet on YouTube',
  },
  {
    // Spare (30 s). The listing's role line is left out; name and company only.
    id: 'WVlGpo4vUwk',
    place: 'about-network',
    title: 'K. Ilamurugu, La Choco Foods & Amusement Services',
    titleTa: 'K. Ilamurugu, La Choco Foods & Amusement Services',
    caption: 'StartNet monthly network meeting · Hotel Windsor Castle · 30 September 2023',
    captionTa: 'StartNet மாதாந்திர நெட்வொர்க் சந்திப்பு · Hotel Windsor Castle · 30 செப்டம்பர் 2023',
    chips: ['Testimonial'],
    chipsTa: ['அனுபவப் பகிர்வு'],
    duration: '0:30',
    credit: 'StartNet on YouTube',
  },
  {
    // Low priority. Vertical phone footage in front of the StartNet backdrop, uploaded 26 Jul 2023. The listing
    // (title: a raw file name) names no event, venue, date or speaker, so none is given here; 'July 2023' is the
    // upload month. Update the caption if StartNet names the event and the speaker.
    id: 'S44yEwSjd1E',
    place: 'about-early-events',
    aspect: '9:16',
    title: 'A StartNet startup event on ChatGPT for business',
    titleTa: 'வணிகத்துக்கான ChatGPT பற்றிய ஒரு StartNet ஸ்டார்ட்அப் நிகழ்வு',
    caption: 'Event highlights · July 2023',
    captionTa: 'நிகழ்வுச் சிறப்பம்சங்கள் · ஜூலை 2023',
    duration: '1:28',
    credit: 'StartNet on YouTube',
  },
  {
    id: 'hEgQYAesg9U',
    place: 'leadership',
    title: '“A brand is built around emotions”: M K Elango, Founder, StartNet',
    titleTa: '“உணர்வுகளைச் சுற்றியே ஒரு பிராண்ட் கட்டப்படுகிறது”: M K Elango, நிறுவனர், StartNet',
    caption: 'A StartupTN interview · July 2024',
    captionTa: 'StartupTN நேர்காணல் · ஜூலை 2024',
    duration: '2:16',
    credit: 'StartupTN on YouTube',
  },
];

export function videosFor(series, edition) {
  if (!series) return [];
  return VIDEOS.filter((v) => v.series === series && (!edition || !v.edition || v.edition === edition));
}

export const videosForPlace = (place) => VIDEOS.filter((v) => v.place === place);
export const videoById = (id) => VIDEOS.find((v) => v.id === id);
export const featuredVideos = () => VIDEOS.filter((v) => v.feature);
