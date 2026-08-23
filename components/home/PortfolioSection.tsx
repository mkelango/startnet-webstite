import RevealLines from "@/components/motion/RevealLines";
import FadeUp from "@/components/motion/FadeUp";
import PropertyCard from "@/components/PropertyCard";
import { buckets, propertiesByBucket } from "@/lib/content/portfolio";

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="border-t border-paper-line py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealLines
            as="h2"
            lines={["Five doors.", "One ecosystem."]}
            className="font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] tracking-[-0.01em] text-ink"
          />
          <FadeUp delay={0.15}>
            <p className="max-w-[36ch] text-[1.05rem] leading-relaxed text-ink-soft">
              Wherever you&rsquo;re starting from, there&rsquo;s a door that
              fits.
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 space-y-16">
          {buckets.map((bucket, bIdx) => (
            <div key={bucket.id}>
              <FadeUp delay={0.05}>
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="font-mono text-[0.72rem] text-ink-faint">
                    0{bIdx + 1}
                  </span>
                  <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink">
                    {bucket.label}
                  </h3>
                  <span className="h-px flex-1 bg-paper-line" />
                  <p className="hidden max-w-[32ch] text-right text-[0.85rem] text-ink-faint md:block">
                    {bucket.description}
                  </p>
                </div>
              </FadeUp>

              <div
                className={`grid gap-5 ${
                  propertiesByBucket(bucket.id).length === 1
                    ? "grid-cols-1 md:max-w-md"
                    : "sm:grid-cols-2"
                }`}
              >
                {propertiesByBucket(bucket.id).map((property, i) => (
                  <FadeUp key={property.slug} delay={i * 0.08} y={36}>
                    <PropertyCard property={property} />
                  </FadeUp>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
