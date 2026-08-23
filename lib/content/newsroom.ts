export const newsroomMeta = {
  title: "StartNet Newsroom — Announcements across the ecosystem",
  description:
    "The latest news, cohort results, and event announcements from across AI Flywheel, Nooru.AI, Agentic AI Connect, Physical AI Connect, and SNX.",
};

export type Article = {
  slug: string;
  property: string;
  propertySlug: string;
  date: string;
  headline: string;
  summary: string;
};

export const articles: Article[] = [
  {
    slug: "nooru-cohort-two-opens",
    property: "Nooru.AI",
    propertySlug: "nooru-ai",
    date: "2026-07-14",
    headline: "Nooru.AI opens applications for its second cohort",
    summary:
      "A hundred slots, one flywheel cycle — applications for the next 90–120 day accelerator cycle are now open.",
  },
  {
    slug: "flywheel-certification-track",
    property: "AI Flywheel",
    propertySlug: "ai-flywheel",
    date: "2026-06-02",
    headline: "AI Flywheel launches a team certification track",
    summary:
      "Beyond the free diagnostic — a structured path for teams that want to formalize their AI capability.",
  },
  {
    slug: "physical-ai-connect-dates",
    property: "Physical AI Connect",
    propertySlug: "physical-ai-connect",
    date: "2026-05-20",
    headline: "Physical AI Connect confirms its next flagship gathering",
    summary:
      "The ecosystem's founders, investors, and government partners return to the same room for the annual flagship.",
  },
  {
    slug: "snx-diagnostic-v2",
    property: "SNX",
    propertySlug: "snx",
    date: "2026-04-11",
    headline: "SNX ships v2 of the founder diagnostic",
    summary:
      "A sharper starting point for founders navigating the ecosystem year-round.",
  },
  {
    slug: "agentic-ai-connect-recap",
    property: "Agentic AI Connect",
    propertySlug: "agentic-ai-connect",
    date: "2026-02-27",
    headline: "Agentic AI Connect wraps its digital summit",
    summary:
      "Talks, demos, and a look at what Tamil Nadu's agentic AI builders shipped this year.",
  },
];
