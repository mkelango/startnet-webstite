import RevealLines from "@/components/motion/RevealLines";
import FadeUp from "@/components/motion/FadeUp";
import ArrowLink from "@/components/ArrowLink";
import { whoThisIsFor } from "@/lib/content/home";

export default function WhoThisIsFor() {
  return (
    <section className="border-t border-paper-line py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <RevealLines
          as="h2"
          lines={["Who this is for."]}
          className="font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] tracking-[-0.01em] text-ink"
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line sm:grid-cols-2">
          {whoThisIsFor.map((path, i) => (
            <FadeUp key={path.audience} delay={i * 0.08}>
              <div className="flex h-full flex-col bg-paper p-8 transition-colors hover:bg-paper-dim">
                <p className="font-display text-[1.35rem] tracking-[-0.01em] text-ink">
                  {path.audience}
                </p>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                  {path.body}
                </p>
                <div className="mt-6">
                  <ArrowLink href={path.href}>{path.cta}</ArrowLink>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
