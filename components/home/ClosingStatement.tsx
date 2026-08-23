import { Fragment } from "react";
import RevealLines from "@/components/motion/RevealLines";

export default function ClosingStatement() {
  return (
    <section className="grain border-t border-paper-line bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
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
