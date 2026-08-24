import RevealLines from "@/components/motion/RevealLines";
import FadeUp from "@/components/motion/FadeUp";
import Counter from "@/components/motion/Counter";
import { proofStats } from "@/lib/content/home";

export default function ProofSection() {
  return (
    <section className="border-t border-paper-line bg-paper-dim py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="max-w-[54ch]">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
            The numbers we can show our work on
          </p>
          <RevealLines
            as="h2"
            lines={["We don’t publish a number", "we can’t source."]}
            className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.1] tracking-[-0.01em] text-ink"
          />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
          {proofStats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.06}>
              <div className="glass card-glow h-full rounded-2xl p-6">
                <p className="font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-none tracking-[-0.02em] text-ink">
                  {stat.verified ? (
                    <Counter value={stat.value} suffix={stat.suffix} />
                  ) : (
                    <span className="text-accent">—</span>
                  )}
                </p>
                <p className="mt-3 text-[0.88rem] leading-snug text-ink-soft">
                  {stat.label}
                </p>
                {!stat.verified && (
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-ink-faint/70">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brand-dot/70" />
                    Pending verification
                  </p>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
