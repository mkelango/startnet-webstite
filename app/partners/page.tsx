import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";
import { partnersContent, partnersMeta } from "@/lib/content/partners";

export const metadata: Metadata = {
  title: partnersMeta.title,
  description: partnersMeta.description,
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        lines={["One conversation,", "five ways to plug in."]}
        subhead={partnersContent.subhead}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line sm:grid-cols-2">
            {partnersContent.ways.map((way, i) => (
              <FadeUp key={way.title} delay={i * 0.08}>
                <div className="h-full bg-paper p-8">
                  <p className="font-mono text-[0.72rem] text-ink-faint">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 font-display text-[1.3rem] tracking-[-0.01em] text-ink">
                    {way.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    {way.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div className="mt-16 flex flex-col items-start gap-6 rounded-2xl bg-ink p-10 text-paper md:flex-row md:items-center md:justify-between md:p-14">
              <h3 className="max-w-[24ch] font-display text-[1.8rem] tracking-[-0.01em]">
                Start a conversation.
              </h3>
              <Link
                href="/contact?reason=partnership"
                className="rounded-full bg-paper px-6 py-3 text-[0.95rem] font-medium text-ink transition-colors hover:bg-accent hover:text-paper"
              >
                Get in touch
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
