import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";
import PropertyCard from "@/components/PropertyCard";
import { buckets, propertiesByBucket } from "@/lib/content/portfolio";

export const metadata: Metadata = {
  title: "The StartNet Portfolio — Five properties, one ecosystem",
  description:
    "A closer look at AI Flywheel, Nooru.AI, Agentic AI Connect, Physical AI Connect, and SNX — what each one does and who it's for.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="The Portfolio"
        lines={["Five doors. Here’s", "what’s behind each one."]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] space-y-20 px-6 md:px-10">
          {buckets.map((bucket, bIdx) => (
            <div key={bucket.id}>
              <FadeUp>
                <div className="mb-8 flex items-baseline gap-4">
                  <span className="font-mono text-[0.72rem] text-accent">
                    0{bIdx + 1}
                  </span>
                  <h2 className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink">
                    {bucket.label}
                  </h2>
                  <span className="h-px flex-1 bg-paper-line" />
                </div>
              </FadeUp>
              <div className="grid gap-6 md:grid-cols-2">
                {propertiesByBucket(bucket.id).map((property, i) => (
                  <FadeUp key={property.slug} delay={i * 0.08} y={36}>
                    <PropertyCard property={property} detailed />
                  </FadeUp>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
