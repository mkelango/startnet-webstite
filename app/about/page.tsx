import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";
import ArrowLink from "@/components/ArrowLink";
import { about } from "@/lib/content/about";

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About StartNet" lines={[about.hero]} />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-16 px-6 md:grid-cols-[1.4fr_1fr] md:px-10">
          <div>
            <FadeUp>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
                Our story
              </p>
              <p className="mt-5 max-w-[68ch] text-[1.1rem] leading-relaxed text-ink-soft">
                {about.story}
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mt-16 border-t border-paper-line pt-10">
                <h2 className="font-display text-[1.6rem] tracking-[-0.01em] text-ink">
                  {about.relationship.heading}
                </h2>
                <p className="mt-4 max-w-[68ch] text-[1.02rem] leading-relaxed text-ink-soft">
                  {about.relationship.body}
                </p>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.15}>
            <div className="rounded-2xl border border-paper-line bg-paper-dim p-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
                What we believe
              </p>
              <ul className="mt-5 space-y-5">
                {about.beliefs.map((belief) => (
                  <li
                    key={belief}
                    className="border-l-2 border-accent/40 pl-4 text-[0.95rem] leading-relaxed text-ink-soft"
                  >
                    {belief}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="border-t border-paper-line py-20 md:py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <FadeUp>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
              Leadership
            </p>
            <div className="mt-6 flex flex-wrap gap-8">
              {about.leadership.map((person) => (
                <div key={person.name}>
                  <p className="font-display text-[1.2rem] text-ink">
                    {person.name}
                  </p>
                  <p className="mt-1 text-[0.9rem] text-ink-faint">
                    {person.title}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="mt-14 border-t border-paper-line pt-10">
              <p className="text-[1.05rem] text-ink-soft">
                Want to know more about a specific part of the ecosystem?{" "}
                <ArrowLink href="/portfolio" className="inline-flex">
                  See the full portfolio
                </ArrowLink>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
