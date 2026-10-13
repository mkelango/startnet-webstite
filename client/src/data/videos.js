/**
 * StartNet event videos (YouTube). Only videos checked to show the named event, published by StartNet or by a
 * sponsor / media partner of that event, and embeddable (oEmbed 200, playableInEmbed true; checked Oct 2026).
 * Sources and the ones left out are listed in docs/VIDEOS.md. Nothing here is downloaded: the poster comes from
 * i.ytimg.com and the player from youtube-nocookie.com, only when the visitor presses play.
 *
 * Each: { id, series?, edition?, place?, title, titleTa?, caption?, captionTa?, chips?, chipsTa?, duration?, credit,
 *         aspect?, poster?, posterZoom?, feature?, start?, end? }. `start` / `end` (seconds) play only that part of the video.
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
    // StartNet-supplied clip (Oct 2026): AssistNow's film from SaaS Connect 2025 ("Founders Supporting Founders |
    // Startup Investments in Millions"), played from 0:12 to 5:50 (start / end in seconds) to skip the intro and outro.
    id: 'JtUGpwEs-mI',
    series: 'saas-connect',
    edition: '2025',
    title: 'SaaS Connect Summit & Expo 2025, PSG Convention Centre, Coimbatore',
    titleTa: 'SaaS Connect உச்சி மாநாடு & கண்காட்சி 2025, PSG கன்வென்ஷன் சென்டர், கோயம்புத்தூர்',
    caption: 'Founders supporting founders · 22–23 February 2025',
    captionTa: 'நிறுவனர்களுக்குத் துணை நிற்கும் நிறுவனர்கள் · 22–23 பிப்ரவரி 2025',
    start: 12,
    end: 350,
    duration: '5:38',
    credit: 'AssistNow on YouTube',
    feature: true,
  },
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
  // D2C Connect 2024 pre-event speaker announcements (vertical Shorts, uploaded 27–28 Nov 2024, before the 30 Nov event).
  // Two from the event's own D2C Connect channel, one from the SNX India channel (its only upload). Names and roles come
  // from each listing; oEmbed 200 and playableInEmbed true, re-checked 13 Oct 2026 (docs/research/connect-series.md §2).
  // They follow the edition's three films, so pages showing up to three (edition) or two (series, /connect/d2c) do not
  // show them until a page asks for more.
  {
    id: 'GMm4Z2hBVjE',
    series: 'd2c-connect',
    edition: '2024',
    aspect: '9:16',
    title: 'Logesh Velusamy, Founder, ProfitStory.AI, at D2C Connect 2024',
    titleTa: 'D2C Connect 2024-இல் Logesh Velusamy, நிறுவனர், ProfitStory.AI',
    caption: 'Speaker announcement · November 2024',
    captionTa: 'பேச்சாளர் அறிவிப்பு · நவம்பர் 2024',
    chips: ['Pre-event Short'],
    chipsTa: ['நிகழ்வுக்கு முந்தைய Short'],
    duration: '2:00',
    credit: 'D2C Connect on YouTube',
  },
  {
    id: '045DJcqp_UU',
    series: 'd2c-connect',
    edition: '2024',
    aspect: '9:16',
    title: 'Nivetha Muralidharan, Founder, Newgenmax, at D2C Connect 2024',
    titleTa: 'D2C Connect 2024-இல் Nivetha Muralidharan, நிறுவனர், Newgenmax',
    caption: 'Speaker announcement · November 2024',
    captionTa: 'பேச்சாளர் அறிவிப்பு · நவம்பர் 2024',
    chips: ['Pre-event Short'],
    chipsTa: ['நிகழ்வுக்கு முந்தைய Short'],
    duration: '1:28',
    credit: 'D2C Connect on YouTube',
  },
  {
    id: '2wgSBjcnKx4',
    series: 'd2c-connect',
    edition: '2024',
    aspect: '9:16',
    title: 'Shadhik, founder of Reen Naturals, at D2C Connect 2024',
    titleTa: 'D2C Connect 2024-இல் Shadhik, Reen Naturals நிறுவனர்',
    caption: 'Speaker announcement · November 2024',
    captionTa: 'பேச்சாளர் அறிவிப்பு · நவம்பர் 2024',
    chips: ['Pre-event Short'],
    chipsTa: ['நிகழ்வுக்கு முந்தைய Short'],
    duration: '1:44',
    credit: 'SNX India on YouTube',
  },
  {
    // NIRF Higher Ed Summit 2024 promo for the Salem edition (31 Aug 2024), uploaded 28 Aug 2024 (PT); the only video on
    // the StartNet Research channel. oEmbed 200 and playableInEmbed true, checked 13 Oct 2026. The channel's About is
    // empty, so StartNet's ownership is strongly indicated (the video links to the StartNet-copyrighted summit site) but
    // not stated: the credit names the handle (docs/research/nirf-and-other-events.md §1). Shown on /research (by id)
    // and on the Salem edition and series pages (events.json nirf-higher-ed-summit-2024-salem).
    id: 'O8nBgNH2d9M',
    series: 'nirf-higher-ed-summit',
    edition: '2024-salem',
    title: 'NIRF Higher Ed Summit 2024: the official promo',
    titleTa: 'NIRF Higher Ed Summit 2024: அதிகாரபூர்வ முன்னோட்டக் காணொளி',
    caption: 'Salem edition · 31 August 2024',
    captionTa: 'சேலம் பதிப்பு · 31 ஆகஸ்ட் 2024',
    chips: ['Promo'],
    chipsTa: ['முன்னோட்டம்'],
    duration: '0:43',
    credit: '@startnetresearch on YouTube',
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
    series: 'network-meetings', // events.json network-meetings-2023-09
    edition: '2023-09',
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
    series: 'network-meetings', // events.json network-meetings-2023-09
    edition: '2023-09',
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
    series: 'network-meetings', // events.json network-meetings-2023-09
    edition: '2023-09',
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
    series: 'network-meetings', // events.json network-meetings-2023-09
    edition: '2023-09',
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
