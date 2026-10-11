// Per-type form rules (Book 2 §13.2–13.6, Book 1 Part B §9.3).
// Validation is manual so the 400 body is exactly { message, fieldErrors }.

export const CONSENT_VERSION = '2026-10';

export const CONSENT_PURPOSES = [
  'newsletter',
  'whatsapp_updates',
  'contact',
  'partner',
  'profile',
  'profile_sharing',
] as const;
export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];

export type FieldKind = 'text' | 'email' | 'phone' | 'textarea' | 'url';

/**
 * Stable code per field error, sent beside the English copy in `fieldCodes` so the client can show
 * its own (Tamil) message: required · email · tel · consent · format · max.
 */
export type FieldErrorCode = 'required' | 'email' | 'tel' | 'consent' | 'format' | 'max';

export interface FieldRule {
  /** canonical name in the stored payload and in fieldErrors */
  name: string;
  /** used in "Please add your …" */
  label: string;
  kind?: FieldKind;
  required?: boolean;
  /** other payload keys accepted for this field */
  aliases?: string[];
  max?: number;
}

export interface FormRule {
  fields: FieldRule[];
  /** at least one of these must be present (by canonical name) */
  oneOf?: { names: string[]; error: string; errorField: string };
  /** at least one of these consents is required */
  requiredConsent: ConsentPurpose[];
  /** consent assumed when a client sends a bare `consent: true` */
  defaultConsent: ConsentPurpose;
  success: (name: string) => string;
}

const NAME: FieldRule = { name: 'name', label: 'name', required: true, aliases: ['fullName', 'full_name', 'yourName'], max: 120 };
const EMAIL: FieldRule = { name: 'email', label: 'email', kind: 'email', required: true, aliases: ['workEmail', 'work_email'], max: 254 };
const PHONE: FieldRule = { name: 'phone', label: 'mobile number', kind: 'phone', aliases: ['mobile', 'tel', 'whatsappNumber'], max: 20 };
const ORG: FieldRule = { name: 'organisation', label: 'organisation', aliases: ['organization', 'org', 'company', 'institution', 'employer'], max: 200 };
const MESSAGE: FieldRule = { name: 'message', label: 'message', kind: 'textarea', required: true, aliases: ['details', 'body', 'note'], max: 5000 };
const DISTRICT: FieldRule = { name: 'district', label: 'district', max: 80 };

const opt = (f: FieldRule): FieldRule => ({ ...f, required: false });
const req = (f: FieldRule): FieldRule => ({ ...f, required: true });

const firstName = (name: string) => (name || '').trim().split(/\s+/)[0] || '';
const thanks = (name: string) => (firstName(name) ? `Thanks, ${firstName(name)}.` : 'Thanks.');
const REPLY_TIME = 'Expect a reply within [placeholder — to be supplied by StartNet] working days.';

const ANY_CONSENT: ConsentPurpose[] = ['contact', 'partner', 'newsletter', 'profile'];

export const FORM_RULES: Record<string, FormRule> = {
  contact: {
    fields: [NAME, EMAIL, PHONE, opt(ORG), { name: 'topic', label: 'topic', aliases: ['about', 'subject', 'writingAbout'], max: 80 }, MESSAGE],
    requiredConsent: ['contact', 'partner'],
    defaultConsent: 'contact',
    success: (n) => `${thanks(n)} Your message has reached the right team. ${REPLY_TIME}`,
  },
  enquiry: {
    fields: [
      NAME,
      EMAIL,
      PHONE,
      req(ORG),
      { name: 'partnerType', label: 'organisation type', aliases: ['organisationType', 'organizationType', 'orgType', 'type'], max: 60 },
      { name: 'interest', label: 'interest', aliases: ['outcome', 'interests'], max: 500 },
      { name: 'budget', label: 'budget', max: 120 },
      { name: 'timeline', label: 'timeline', max: 120 },
      DISTRICT,
      MESSAGE,
    ],
    requiredConsent: ['contact', 'partner'],
    defaultConsent: 'partner',
    success: (n) => `${thanks(n)} We've routed your enquiry to the team that owns it. ${REPLY_TIME}`,
  },
  newsletter: {
    fields: [opt(NAME), EMAIL, PHONE, DISTRICT, { name: 'language', label: 'language', aliases: ['lang', 'emailLanguage'], max: 10 }],
    requiredConsent: ['newsletter'],
    defaultConsent: 'newsletter',
    success: () => "You're on the list. Programme calls, event dates and Founder Ledger updates, and you can unsubscribe at any time.",
  },
  join: {
    fields: [
      NAME,
      opt(EMAIL),
      PHONE,
      DISTRICT,
      { name: 'persona', label: 'who you are', aliases: ['iAm', 'role', 'pool'], max: 60 },
      opt(ORG),
      { name: 'language', label: 'preferred language', aliases: ['lang', 'preferredLanguage'], max: 10 },
      { name: 'guardianPhone', label: "parent or guardian's mobile number", kind: 'phone', aliases: ['parentPhone', 'guardianMobile'], max: 20 },
    ],
    oneOf: { names: ['phone', 'email'], error: 'Please add your mobile number or email.', errorField: 'phone' },
    requiredConsent: ['profile', 'contact'],
    defaultConsent: 'profile',
    success: (n) => `Welcome to StartNet${firstName(n) ? `, ${firstName(n)}` : ''}. We'll suggest a good first step for you.`,
  },
  interest: {
    fields: [
      opt(NAME),
      opt(EMAIL),
      PHONE,
      opt(ORG),
      DISTRICT,
      { name: 'programme', label: 'programme', aliases: ['event', 'lab', 'topic', 'context'], max: 120 },
      opt(MESSAGE),
    ],
    oneOf: { names: ['email', 'phone'], error: 'Please add your email or mobile number so we can tell you when it opens.', errorField: 'email' },
    requiredConsent: ANY_CONSENT,
    defaultConsent: 'contact',
    success: (n) => `${thanks(n)} We'll let you know as soon as it opens.`,
  },
  nomination: {
    fields: [
      NAME,
      EMAIL,
      PHONE,
      { name: 'nomineeName', label: "nominee's name", aliases: ['nominee', 'founderName'], max: 120 },
      { name: 'nomineeCompany', label: "nominee's company", aliases: ['company', 'nomineeOrganisation'], max: 200 },
      { name: 'category', label: 'category', max: 120 },
      DISTRICT,
      opt(MESSAGE),
    ],
    requiredConsent: ANY_CONSENT,
    defaultConsent: 'contact',
    success: (n) => `${thanks(n)} We've received your nomination. The independent jury reviews every nomination.`,
  },
  host: {
    fields: [NAME, EMAIL, PHONE, opt(ORG), DISTRICT, { name: 'format', label: 'format', aliases: ['eventType'], max: 120 }, opt(MESSAGE)],
    requiredConsent: ANY_CONSENT,
    defaultConsent: 'partner',
    success: (n) => `${thanks(n)} Our team will be in touch about hosting. ${REPLY_TIME}`,
  },
  speak: {
    fields: [
      NAME,
      EMAIL,
      PHONE,
      opt(ORG),
      { name: 'topic', label: 'topic', aliases: ['topics', 'expertise'], max: 300 },
      { name: 'link', label: 'profile link', kind: 'url', aliases: ['linkedin', 'url'], max: 300 },
      opt(MESSAGE),
    ],
    requiredConsent: ANY_CONSENT,
    defaultConsent: 'contact',
    success: (n) => `${thanks(n)} We'll be in touch about speaking or mentoring. ${REPLY_TIME}`,
  },
};

// Book 2 §13.6 error copy
export const MESSAGES = {
  required: (label: string) => `Please add your ${label}.`,
  email: "That email doesn't look right. Check for a missing @ or a typo.",
  phone: 'Enter a 10-digit Indian mobile number, without +91 or 0.',
  format: (label: string) => `That ${label} doesn't look right. Please check it and try again.`,
  url: 'Please paste the full web address, for example https://www.linkedin.com/in/yourname.',
  tooLong: (label: string, max: number) => `Please shorten your ${label} to ${max} characters or fewer.`,
  consent: 'Please tick the box to agree before we send this.',
  whatsappNeedsPhone: 'Add your WhatsApp number to get updates on WhatsApp.',
  summary: 'Please check the highlighted fields and try again.',
  unknownType: (t: string) => `There is no "${t}" form.`,
  unreadable: 'We could not read that form. Please try again.',
  badAddress: "We couldn't read that address. Check it and try again.",
  tooLarge: "That's too much text for this form. Please shorten your message and try again.",
  tooMany: 'Too many attempts. Please wait 10 minutes and try again.',
  serverError: "Something went wrong on our side and your form wasn't sent. Please try again in a minute.",
  notFound: "We couldn't find that. Check the address and try again.",
};
