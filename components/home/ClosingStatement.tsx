import { Fragment } from "react";
import RevealLines from "@/components/motion/RevealLines";

export default function ClosingStatement() {
  return (
    <section className="grain relative overflow-hidden border-t border-paper-line bg-ink py-28 md:py-36">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-accent md:h-96 md:w-96"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <RevealLines
          as="h2"
          lines={[
            "Five doors.",
            <Fragment key="line-2">
              One infrastructure
              <span className="text-brand-dot">.</span>
            </Fragment>,
          ]}
          className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] tracking-[-0.02em] text-paper"
        />
      </div>
    </section>
  );
}
