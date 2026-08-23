export const careersMeta = {
  title: "Careers at StartNet — Openings across the ecosystem",
  description:
    "Open roles across StartNet, AI Flywheel, Nooru.AI, Agentic AI Connect, Physical AI Connect, and SNX — one place to see everything.",
};

export type Role = {
  title: string;
  property: string;
  propertySlug: string;
  location: string;
  summary: string;
};

// Empty by design until real openings are confirmed — the careers page
// renders its "no open roles" fallback when this list is empty, rather than
// shipping placeholder job listings.
export const roles: Role[] = [];
