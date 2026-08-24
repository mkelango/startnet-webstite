export type BucketId = "learn" | "gather" | "home";

export type Bucket = {
  id: BucketId;
  label: string;
  description: string;
};

export const buckets: Bucket[] = [
  {
    id: "learn",
    label: "Learn & Build",
    description: "Training and acceleration for founders building AI capability.",
  },
  {
    id: "gather",
    label: "Gather",
    description: "The two annual gatherings that bring the ecosystem into one room.",
  },
  {
    id: "home",
    label: "Year-Round Home",
    description: "The continuity layer between the two flagship events.",
  },
];

export type Property = {
  slug: string;
  name: string;
  domain: string;
  href: string;
  bucket: BucketId;
  kicker: string;
  oneLiner: string;
  extended: string;
  bestFor: string;
  accent: string;
  accentSoft: string;
  mark: string;
};

// The one-line description of each property is the single source of truth
// (per content governance) — reused verbatim across nav, homepage, footer, and
// the portfolio page. Do not reword per section.
export const properties: Property[] = [
  {
    slug: "ai-flywheel",
    name: "AI Flywheel",
    domain: "aiflywheel.in",
    href: "https://aiflywheel.in",
    bucket: "learn",
    kicker: "Training & research",
    oneLiner:
      "Training and research. The framework for turning AI into compounding value, at any scale.",
    extended:
      "AI Flywheel is where founders and teams build real AI capability — structured curriculum, a free diagnostic to find your starting point, and a certification track for teams that want to formalize what they've learned.",
    bestFor: "Founders and teams early in their AI adoption journey.",
    accent: "#1F7A6C",
    accentSoft: "#E4F0EC",
    mark: "AF",
  },
  {
    slug: "nooru-ai",
    name: "Nooru.AI",
    domain: "nooru.ai",
    href: "https://nooru.ai",
    bucket: "learn",
    kicker: "Accelerator cohorts",
    oneLiner:
      "Accelerator cohorts. A hundred founders, one flywheel cycle, real outcomes.",
    extended:
      "Nooru (“hundred” in Tamil) runs a curated, diagnostic-gated cohort of 100 startups through a structured 90–120 day program — mentorship, curriculum, and direct access to StartNet's investor network.",
    bestFor: "Founders with a validated product ready to scale.",
    accent: "#B9862E",
    accentSoft: "#F5EDDC",
    mark: "N",
  },
  {
    slug: "agentic-ai-connect",
    name: "Agentic AI Connect",
    domain: "agenticaiconnect.in",
    href: "https://agenticaiconnect.in",
    bucket: "gather",
    kicker: "Digital summit, yearly",
    oneLiner:
      "Digital summit, yearly. Where Tamil Nadu's agentic AI builders gather once a year.",
    extended:
      "A single-day (or multi-day) digital-first summit bringing together the builders working on agentic AI — talks, demos, and the kind of density you don't get outside a dedicated gathering.",
    bestFor: "Anyone building with or around agentic AI, once a year.",
    accent: "#3241C9",
    accentSoft: "#E7E9F9",
    mark: "AC",
  },
  {
    slug: "physical-ai-connect",
    name: "Physical AI Connect",
    domain: "physicalaiconnect.in",
    href: "https://physicalaiconnect.in",
    bucket: "gather",
    kicker: "Physical summit, yearly",
    oneLiner:
      "Physical summit, yearly. The flagship gathering — in the room, once a year.",
    extended:
      "The in-person counterpart — where the ecosystem's founders, investors, mentors, and government partners are all in the same room at the same time.",
    bestFor: "Relationship-building, deal flow, and seeing the whole ecosystem at once.",
    accent: "#C1622D",
    accentSoft: "#F6E7DC",
    mark: "PC",
  },
  {
    slug: "snx",
    name: "SNX",
    domain: "startnetx.in",
    href: "https://startnetx.in",
    bucket: "home",
    kicker: "Diagnostics, community, archive",
    oneLiner:
      "Your year-round home. Diagnostics, community, and everything that happens between the two flagships.",
    extended:
      "SNX is where the ecosystem stays alive in the months between Agentic AI Connect and Physical AI Connect — a founder diagnostic, a community feed, and the archive of everything from past gatherings.",
    bestFor: "Anyone who wants to stay connected to the ecosystem year-round, not just at events.",
    accent: "#5B3A8E",
    accentSoft: "#EDE6F3",
    mark: "SNX",
  },
];

export const propertiesByBucket = (id: BucketId) =>
  properties.filter((p) => p.bucket === id);
