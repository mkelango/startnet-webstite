// AEO FAQ: drafted from Book 2 §1 (Home hero, brand doors, partner band, closing CTA) and §3.0 — StartNet review.
// Every answer restates copy already on Home or /brands; no new facts. Shown in HomeRest (before the closing CTA);
// its FAQPage JSON-LD is emitted from Home.jsx so it is in <head> on first render, not only once the lazy chunk loads.
// SEO-TA: pending native review
export const HOME_FAQ = [
  {
    id: 'what',
    question: 'What is StartNet?',
    questionTa: 'StartNet என்றால் என்ன?',
    answer:
      'StartNet is Tamil Nadu’s founder-making network. We go to campuses, labs, workplaces and districts, and help people with the talent to build turn it into companies.',
    answerTa:
      'StartNet தமிழ்நாட்டின் நிறுவனர்களை உருவாக்கும் வலையமைப்பு. கல்லூரிகள், ஆய்வகங்கள், பணியிடங்கள், மாவட்டங்கள் என திறமை இருக்கும் இடத்திற்கே நாங்கள் சென்று, அந்தத் திறமையை நிறுவனங்களாக மாற்ற உதவுகிறோம்.',
  },
  {
    id: 'who',
    question: 'Who are StartNet’s programmes for?',
    questionTa: 'StartNet திட்டங்கள் யாருக்கானவை?',
    answer:
      'Four kinds of talent, each with its own brand: StartNet Research for PhD scholars and faculty, StartNet Vibe for students, StartNet Connect for working professionals and existing startups, and StartNet Women for women founders.',
    answerTa:
      'நான்கு வகைத் திறமையாளர்களுக்கு, ஒவ்வொருவருக்கும் ஒரு பிராண்ட்: முனைவர் பட்ட ஆய்வாளர்கள், பேராசிரியர்களுக்கு StartNet Research; மாணவர்களுக்கு StartNet Vibe; பணியில் உள்ளவர்களுக்கும் ஏற்கனவே இயங்கும் ஸ்டார்ட்அப்களுக்கும் StartNet Connect; பெண் தொழில்முனைவோருக்கு StartNet Women.',
  },
  {
    id: 'free',
    question: 'Is it free to join StartNet?',
    questionTa: 'StartNet-இல் சேர இலவசமா?',
    answer:
      'Yes, for individuals. Make a free StartNet X profile and we’ll show you the next step that fits you: an event, a course, a circle or a programme. It takes about two minutes, in Tamil or English.',
    answerTa:
      'ஆம், தனிநபர்களுக்கு இலவசம். இலவச StartNet X சுயவிவரத்தை உருவாக்குங்கள்; உங்களுக்குப் பொருந்தும் அடுத்த படியை நாங்கள் காட்டுவோம்: ஒரு நிகழ்வு, ஒரு பயிற்சி, ஒரு வட்டம் அல்லது ஒரு திட்டம். சுமார் இரண்டு நிமிடங்கள் ஆகும், தமிழ் அல்லது ஆங்கிலத்தில்.',
  },
  {
    id: 'find',
    question: 'How do I find the right StartNet programme?',
    questionTa: 'எனக்குப் பொருந்தும் StartNet திட்டத்தை எப்படிக் கண்டறிவது?',
    answer:
      'Pick the description closest to you (student, PhD scholar or faculty, working professional, or woman building a business) and we’ll take you to the right door. Or answer two questions in the programme finder.',
    answerTa:
      'உங்களுக்கு மிக நெருக்கமானதைத் தேர்ந்தெடுங்கள் (மாணவர், முனைவர் பட்ட ஆய்வாளர் அல்லது பேராசிரியர், பணியில் உள்ளவர், தொழில் தொடங்கும் பெண்); சரியான வாசலுக்கு உங்களை அழைத்துச் செல்கிறோம். அல்லது திட்டத் தேடலில் இரண்டு கேள்விகளுக்குப் பதில் சொல்லுங்கள்.',
  },
  {
    id: 'partner',
    question: 'Can institutions, GCCs and government partner with StartNet?',
    questionTa: 'கல்வி நிறுவனங்கள், GCC-கள், அரசு StartNet-உடன் கூட்டு சேர முடியுமா?',
    answer:
      'Yes. Universities want spinouts and innovation metrics, GCCs want problem-solvers, pilots and talent, and government wants reach and measured delivery. We design programmes around those outcomes and report on them in public.',
    answerTa:
      'ஆம். பல்கலைக்கழகங்களுக்கு ஸ்பின்அவுட்களும் புத்தாக்க அளவீடுகளும், GCC-களுக்குச் சிக்கல் தீர்ப்பவர்கள், பைலட்கள், திறமையாளர்களும், அரசுக்குப் பரவலான சென்றடைவும் அளவிடப்பட்ட செயலாக்கமும் தேவை. அந்த விளைவுகளைச் சுற்றியே நாங்கள் திட்டங்களை வடிவமைத்து, அவற்றைப் பொதுவில் அறிக்கையிடுகிறோம்.',
  },
];

/** The FAQ in the current language, as plain strings (Accordion items and FAQPage JSON-LD). */
export const homeFaqItems = (t) =>
  HOME_FAQ.map((f) => ({ id: `home-faq-${f.id}`, question: t(f.question, f.questionTa), answer: t(f.answer, f.answerTa) }));
