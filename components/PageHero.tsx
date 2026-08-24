import RevealLines from "@/components/motion/RevealLines";
import FadeUp from "@/components/motion/FadeUp";
import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  lines,
  subhead,
  children,
}: {
  eyebrow?: string;
  lines: string[];
  subhead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-paper-line pt-40 pb-16 md:pt-48 md:pb-20">
      <div
        className="glow-red-soft pointer-events-none absolute -right-[10%] -top-[30%] h-[440px] w-[440px] rounded-full opacity-70"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        {eyebrow && (
          <FadeUp>
            <p className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
              {eyebrow}
            </p>
          </FadeUp>
        )}
        <RevealLines
          as="h1"
          trigger="load"
          lines={lines}
          className="max-w-[20ch] font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-ink"
        />
        {subhead && (
          <FadeUp delay={0.2}>
            <p className="mt-7 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.15rem]">
              {subhead}
            </p>
          </FadeUp>
        )}
        {children}
      </div>
    </section>
  );
}
