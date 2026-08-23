import FadeUp from "@/components/motion/FadeUp";
import ArrowLink from "@/components/ArrowLink";
import { nextEvent, isInPreEventWindow } from "@/lib/content/home";

const formattedDate = new Date(nextEvent.date).toLocaleDateString("en-IN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function NextEventBanner() {
  const expanded = isInPreEventWindow();

  if (!expanded) {
    return (
      <section className="border-t border-paper-line py-10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-3 px-6 text-center md:px-10">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
            Next gathering
          </span>
          <span className="text-[0.95rem] text-ink">
            {nextEvent.property}, {formattedDate}
          </span>
          <ArrowLink href={nextEvent.href}>Learn more</ArrowLink>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-paper-line py-20 md:py-24">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <FadeUp>
          <div className="flex flex-col gap-8 rounded-3xl border border-paper-line bg-paper-dim p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div>
              <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-brand-dot">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-dot" />
                Next flagship event
              </p>
              <h3 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight tracking-[-0.01em] text-ink">
                {nextEvent.property} — {formattedDate}, {nextEvent.city}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
                {nextEvent.theme}
              </p>
            </div>
            <div className="flex shrink-0 gap-8">
              <ArrowLink href={nextEvent.href}>Register now</ArrowLink>
              <ArrowLink href={nextEvent.href}>See the agenda</ArrowLink>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
