export type ProofStat = {
  value: number;
  suffix?: string;
  label: string;
  verified: boolean;
};

// Governance rule (from the masterbrand strategy): a stat with no sourced
// number does not ship as a rounded placeholder — it ships flagged as
// pending verification, never silently invented. Flip `verified` to true
// once the underlying number is confirmed against each property's own
// reporting.
export const proofStats: ProofStat[] = [
  { value: 0, suffix: "", label: "Founders diagnosed through SNX", verified: false },
  { value: 0, suffix: "", label: "Startups through Nooru.AI cohorts", verified: false },
  { value: 0, suffix: "", label: "Attendees at the last Physical AI Connect", verified: false },
  { value: 0, suffix: "", label: "Training modules completed through AI Flywheel", verified: false },
  { value: 1, suffix: "", label: "Year running the ecosystem", verified: false },
];

export const ecosystemStory = {
  eyebrow: "The ecosystem story",
  heading: "Most ecosystems ask you to pick one door and stay there.",
  subheading: "This one doesn't work that way.",
  body: "A founder might start with a diagnostic on SNX, take a course on the Flywheel, get into a Nooru cohort, and meet their first investor at Physical AI Connect — all before their first year is out. Each property stands on its own. Together, they're the closest thing Tamil Nadu has to an operating system for building an AI company.",
};

export type WhoPath = {
  audience: string;
  body: string;
  cta: string;
  href: string;
};

export const whoThisIsFor: WhoPath[] = [
  {
    audience: "I'm a founder",
    body: "Start with SNX — get diagnosed, find your next step, join the community that stays active all year.",
    cta: "Go to snx.in",
    href: "https://snx.in",
  },
  {
    audience: "I'm an investor or mentor",
    body: "See what Nooru.AI cohorts are building, and how our diagnostic data tracks real outcomes, not vanity metrics.",
    cta: "Go to nooru.ai",
    href: "https://nooru.ai",
  },
  {
    audience: "I'm from government or an institution",
    body: "Talk to our partnerships team about how StartNet works alongside Tamil Nadu's AI-driven economy initiatives.",
    cta: "Go to Partners",
    href: "/partners",
  },
  {
    audience: "I'm press",
    body: "Find our latest announcements, cohort results, and event coverage in one place.",
    cta: "Go to Newsroom",
    href: "/newsroom",
  },
];

// Next flagship event — governed by a date window rather than a manual
// on/off edit each cycle. Outside [windowStart, date] it renders compact.
export const nextEvent = {
  property: "Physical AI Connect",
  href: "https://physicalaiconnect.in",
  date: "2027-02-18",
  windowStart: "2026-12-01",
  city: "Chennai",
  theme: "The flagship gathering — in the room, once a year.",
};

export function isInPreEventWindow(now = new Date()) {
  const start = new Date(nextEvent.windowStart);
  const end = new Date(nextEvent.date);
  return now >= start && now <= end;
}
