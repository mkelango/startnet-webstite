// Legal pages (T17). All text is a DRAFT placeholder pending review by legal counsel.
// Consent language is taken from Book 2 §13 (consent banner, newsletter, WhatsApp, sign-up, contact form)
// and Book 1 Part A §7.3 (consent per purpose, under-18s, DPDP Act 2023). Slugs: Book 1 Part B §2.2.
//
// Block types: 'string' paragraph · { list: [] } · { table: { head: [], rows: [[]] } } · { note } · { links: [{label,to}] }

export const LEGAL_VERSION = 'Draft 0.1';

// Entity, CIN and registered office: Ministry of Corporate Affairs master data (incorporated 4 July 2023, RoC
// Coimbatore), confirmed by StartNet, Oct 2026. The Grievance officer's email (nagaraj@startnet.in) was confirmed on 10 Oct 2026; the name is still to be supplied.
const REGISTERED_OFFICE = '112/2F4, Fairlands, 3rd Cross Street, Fairlands, Salem, Tamil Nadu 636016';
const GRIEVANCE = `Grievance officer: [placeholder — name]. Email: nagaraj@startnet.in. Address: StartNet Ventures Private Limited, ${REGISTERED_OFFICE}.`;
const ENTITY = `StartNet Ventures Private Limited (CIN U70200TZ2023PTC028823), registered office ${REGISTERED_OFFICE}.`;

export const LEGAL_ORDER = [
  'privacy', 'terms', 'cookies', 'data-rights', 'grievance', 'safeguarding', 'accessibility', 'refunds', 'code-of-conduct', 'sponsorship-terms',
];

/** Every valid /legal/:slug, in display order. The server's route allow-list (F-97) mirrors this list. */
export const LEGAL_SLUGS = LEGAL_ORDER;

/** The page for a slug, or null. Own keys only, so "constructor" or "__proto__" never resolve to Object.prototype. */
export const getLegal = (slug) =>
  typeof slug === 'string' && Object.prototype.hasOwnProperty.call(LEGAL, slug) ? LEGAL[slug] : null;

export const LEGAL = {
  privacy: {
    title: 'Privacy notice',
    description: 'How StartNet collects, uses and protects your personal data under the Digital Personal Data Protection Act, 2023, and how to withdraw consent.',
    intro: 'This notice explains what personal data StartNet collects, why, and the choices you have. This notice is available in English and Tamil.',
    sections: [
      { id: 'who', title: 'Who we are', blocks: [
        `StartNet is Tamil Nadu's founder-making network, operated by ${ENTITY} For the purposes of the Digital Personal Data Protection Act, 2023 (DPDP Act), StartNet is the data fiduciary for the data described here.`,
      ] },
      { id: 'what', title: 'What we collect', blocks: [
        'We keep forms short and ask only for what we need at each step.',
        { list: [
          'Registration: mobile number (verified by OTP), name, preferred language and your consent.',
          'Later, on StartNet X and only if you choose to add them: district, institution or employer, role and gender (optional).',
          'Enquiries and contact forms: your name, email, mobile (optional), organisation (optional) and your message.',
          'Newsletter: your email address, chosen topics and email language.',
          'WhatsApp updates: your WhatsApp number, chosen topics, district (optional) and language.',
          'This website: essential cookies, and analytics or marketing cookies only if you turn them on.',
        ] },
      ] },
      { id: 'purposes', title: 'Why we use it: consent per purpose', blocks: [
        'We ask for consent separately for each purpose, with boxes that are unticked by default. Each consent is logged with its purpose, version and time, and each can be withdrawn with one tap.',
        { table: { head: ['Purpose', 'What you agree to'], rows: [
          ['Your StartNet profile', 'I agree to StartNet creating a profile for me under the privacy notice. I can view, correct or delete it at any time.'],
          ['Sharing with partners (optional)', 'Show my profile to verified mentors, investors and partners when I opt in to a specific programme.'],
          ['Newsletter', 'Send me programme calls, event dates and Founder Ledger updates. I can unsubscribe at any time.'],
          ['WhatsApp updates', "I agree to receive messages from StartNet on WhatsApp about the topics I've chosen. No messages between 9 p.m. and 8 a.m. Reply STOP any time to opt out."],
          ['Contact and partner enquiries', 'StartNet may use these details to reply to this enquiry.'],
        ] } },
      ] },
      { id: 'sharing', title: 'Who we share it with', blocks: [
        'Talent profiles are shared only with people who opt in, and only for the specific programme you opted in to.',
        'We do not sell your data.',
        'Service providers who process data for us (for example hosting, messaging and payments) act on our instructions. [placeholder — list of processors and locations, to be confirmed by counsel]',
      ] },
      { id: 'children', title: 'Children under 18', blocks: [
        "If you are under 18, we need your parent or guardian's consent before a profile exists. We send them a link, and your registration completes once they agree.",
        'Minors are never shown on this website with their full name or photo.',
      ] },
      { id: 'retention', title: 'Where we store it and for how long', blocks: [
        'Storage location and retention periods: [placeholder — to be confirmed by counsel].',
      ] },
      { id: 'rights', title: 'Your rights', blocks: [
        'You can access, correct and erase your data, withdraw any consent, nominate someone to act for you, and raise a grievance.',
        { links: [{ label: 'Your data rights', to: '/legal/data-rights' }, { label: 'Grievance officer', to: '/legal/grievance' }] },
      ] },
      { id: 'contact', title: 'Questions', blocks: [
        `Questions? Contact our Grievance officer. ${GRIEVANCE}`,
      ] },
    ],
  },

  terms: {
    title: 'Terms of use',
    description: 'The terms that apply when you use startnet.in.',
    intro: 'These terms apply to startnet.in. StartNet X (x.startnet.in) has its own terms, which apply when you create a profile there.',
    sections: [
      { id: 'about', title: 'About these terms', blocks: [`startnet.in is operated by ${ENTITY}`, '[placeholder — full terms to be drafted by counsel]'] },
      { id: 'figures', title: 'Figures and corrections', blocks: [
        'Every figure we publish shows a source and an as-at date, or an A, B or C confidence tag. Targets and indicative prices are labelled as such. If you find an error, report it and we will log the correction publicly.',
        { links: [{ label: 'Evidence standard', to: '/about/evidence-standard' }, { label: 'Founder Ledger', to: '/insights/founder-ledger' }] },
      ] },
      { id: 'brand', title: 'Our name and marks', blocks: [
        "Please don't recolour the red full stop or combine brand accents. Write StartNet as one word, capital S and N.",
        { links: [{ label: 'Media centre and brand assets', to: '/media' }] },
      ] },
      { id: 'investment', title: 'No offer of securities', blocks: ['Nothing on this website is an offer of securities or investment advice.'] },
      { id: 'liability', title: 'Liability, governing law and disputes', blocks: ['[placeholder — to be drafted by counsel]'] },
    ],
  },

  cookies: {
    title: 'Cookie notice',
    description: 'Which cookies startnet.in uses, why, and how to change your choice at any time.',
    intro: 'We use essential cookies to run this site. With your permission, we\'d also use analytics to learn which pages help people, and marketing cookies to measure our campaigns. Non-essential cookies stay off unless you turn them on.',
    sections: [
      { id: 'categories', title: 'Cookie categories', blocks: [
        { table: { head: ['Category', 'Default', 'Description'], rows: [
          ['Essential', 'Always on', 'Keep the site secure, remember your language and your cookie choice.'],
          ['Analytics', 'Off', 'Help us see which pages work, using pseudonymous data. No personal details are sent.'],
          ['Marketing', 'Off', 'Measure whether our ads and campaigns reach people.'],
        ] } },
      ] },
      { id: 'banner', title: 'How the banner works', blocks: [
        { list: [
          'The banner appears on your first visit, in the current site language.',
          'Non-essential categories are off by default.',
          '"Accept all" and "Reject non-essential" have equal size and weight. The banner never blocks reading.',
          'Your choice is remembered for [placeholder] months.',
          'Withdrawing is as easy as giving.',
        ] },
      ] },
      { id: 'language', title: 'The language cookie', blocks: [
        'Your language choice (English or தமிழ்) is stored in a strictly necessary lang cookie for 12 months. It is not used for analytics.',
      ] },
      { id: 'change', title: 'Change your choice', blocks: [
        'You can change this any time from Cookie settings at the bottom of every page.',
      ] },
    ],
  },

  'data-rights': {
    title: 'Your data rights',
    description: 'How to access, correct, erase or withdraw consent for your personal data held by StartNet.',
    intro: 'Under the Digital Personal Data Protection Act, 2023, you have rights over the personal data StartNet holds about you. Here is how to use them.',
    sections: [
      { id: 'rights', title: 'Your rights', blocks: [
        { list: [
          'Access: ask what personal data we hold about you and how we use it.',
          'Correction and erasure: correct, complete, update or delete your data.',
          'Withdraw consent: for any purpose, at any time. Withdrawing is as easy as giving.',
          'Grievance redressal: complain to our Grievance officer, and escalate to the Data Protection Board of India if you are not satisfied.',
          'Nominate: name someone to exercise these rights on your behalf.',
        ] },
      ] },
      { id: 'how', title: 'How to exercise them', blocks: [
        { list: [
          'StartNet X profile: view, correct or delete it at any time from your profile.',
          'Newsletter: unsubscribe in one click from any email.',
          'WhatsApp: reply STOP any time to opt out.',
          'Cookies: use Cookie settings at the bottom of every page.',
          `Anything else: write to our Grievance officer. ${GRIEVANCE}`,
        ] },
        'We aim to respond within [placeholder] days.',
      ] },
    ],
  },

  grievance: {
    title: 'Grievance officer',
    description: 'Contact details of the StartNet Grievance officer for data protection complaints.',
    intro: 'If you have a concern about how StartNet handles your personal data, write to our Grievance officer.',
    sections: [
      { id: 'contact', title: 'Contact', blocks: [GRIEVANCE, 'Response time: [placeholder].'] },
      { id: 'escalate', title: 'If you are not satisfied', blocks: ['You may escalate your complaint to the Data Protection Board of India.'] },
      { id: 'related', title: 'Related', blocks: [{ links: [{ label: 'Your data rights', to: '/legal/data-rights' }, { label: 'Contact', to: '/contact' }] }] },
    ],
  },

  safeguarding: {
    title: 'Child safeguarding and parental consent',
    description: 'How StartNet protects participants under 18 and obtains parental consent.',
    intro: 'Some StartNet programmes, such as school and campus outreach, include people under 18. These rules apply to them.',
    sections: [
      { id: 'consent', title: 'Parental consent', blocks: [
        'At sign-up we ask: "Are you under 18?" If yes: "We\'ll need your parent or guardian\'s consent. Enter their mobile number and we\'ll send them a link."',
        "We've sent a link to your parent or guardian. Your registration completes once they agree.",
      ] },
      { id: 'publishing', title: 'What we never publish', blocks: ['Minors are never shown with their full name or photo.'] },
      { id: 'events', title: 'At events', blocks: ['[placeholder — safeguarding lead, event rules and reporting route, to be supplied by StartNet]'] },
    ],
  },

  accessibility: {
    title: 'Accessibility statement',
    description: 'StartNet’s accessibility commitment for startnet.in, known issues and how to report a barrier.',
    intro: 'We want startnet.in to work for everyone, on any phone, in English and Tamil.',
    sections: [
      { id: 'standard', title: 'Our standard', blocks: [
        'We aim to meet WCAG 2.2 Level AA and publish this statement yearly.',
        { list: [
          'An on-site motion switch, and respect for your device’s reduced-motion setting.',
          'Errors appear inline beneath the field, in text and colour (never colour alone), and are announced to screen readers.',
          'Every page works at 320 px wide, with touch targets of at least 44 px.',
          'English and Tamil versions, with a language switch that keeps your place.',
        ] },
      ] },
      { id: 'known', title: 'Known issues', blocks: ['[placeholder — results of the accessibility audit]'] },
      { id: 'report', title: 'Report a barrier', blocks: [{ links: [{ label: 'Contact us', to: '/contact' }] }] },
    ],
  },

  refunds: {
    title: 'Refunds and cancellations',
    description: 'How refunds and cancellations work for StartNet event tickets, programmes and StartNet X plans.',
    intro: 'Talent never hits a paywall first: most first steps are free. Where you do pay, these terms apply.',
    sections: [
      { id: 'events', title: 'Event tickets and programme fees', blocks: ['[placeholder — refund windows and conditions, to be confirmed by counsel]'] },
      { id: 'snx', title: 'StartNet X plans', blocks: ['Cancel any time; access runs to the end of the period.'] },
      { id: 'payments', title: 'If a payment fails or is pending', blocks: [
        { list: [
          "Your payment didn't go through and you haven't been charged.",
          "We're waiting for your bank to confirm. This can take a few minutes. Don't pay twice.",
        ] },
      ] },
    ],
  },

  'code-of-conduct': {
    title: 'Code of conduct',
    description: 'The code of conduct for StartNet events, programmes, Circles and online spaces.',
    intro: 'This code applies at StartNet events, in programmes and Circles, and in our online and WhatsApp communities.',
    sections: [
      { id: 'expect', title: 'What we expect', blocks: ['[placeholder — code of conduct text, to be supplied by StartNet]'] },
      { id: 'posh', title: 'Harassment', blocks: ['POSH policy and internal committee: [placeholder — link].'] },
      { id: 'report', title: 'Reporting', blocks: ['[placeholder — reporting route]', { links: [{ label: 'Contact', to: '/contact' }] }] },
    ],
  },

  'sponsorship-terms': {
    title: 'Sponsorship terms',
    description: 'Terms that apply to StartNet sponsors and CSR funders.',
    intro: 'These rules protect the independence of our evidence and the people in our programmes.',
    sections: [
      { id: 'rules', title: 'Our rules', blocks: [
        { list: [
          'Sponsors never appear next to ThinkTN content or Insights findings, and never see findings before publication.',
          'Partners appear only when signed, with a date. Logos appear only with written permission.',
          'Talent profiles are shared only with people who opt in.',
        ] },
      ] },
      { id: 'terms', title: 'Commercial terms', blocks: ['[placeholder — to be drafted by counsel; prices follow the published rate card]'] },
    ],
  },
};
