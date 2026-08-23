"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import RevealLines from "@/components/motion/RevealLines";
import FadeUp from "@/components/motion/FadeUp";
import { ecosystemStory } from "@/lib/content/home";
import { properties } from "@/lib/content/portfolio";

const journey = [
  { slug: "snx", verb: "Start with a diagnostic" },
  { slug: "ai-flywheel", verb: "Take a course" },
  { slug: "nooru-ai", verb: "Join a cohort" },
  { slug: "physical-ai-connect", verb: "Meet an investor" },
];

export default function EcosystemStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: prefersReduced ? 0 : length });

    if (prefersReduced) return;

    const anim = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.6,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-paper-line py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
          {ecosystemStory.eyebrow}
        </p>

        <RevealLines
          as="h2"
          lines={[ecosystemStory.heading]}
          className="mt-5 max-w-[22ch] font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.15] tracking-[-0.01em] text-ink-faint"
        />
        <RevealLines
          as="h2"
          lines={[ecosystemStory.subheading]}
          className="mt-2 font-display italic text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.15] tracking-[-0.01em] text-accent"
        />

        <FadeUp delay={0.2}>
          <p className="mt-8 max-w-[62ch] text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.15rem]">
            {ecosystemStory.body}
          </p>
        </FadeUp>

        <div className="mt-20">
          {/* Rail: connecting line + dots, aligned to the label grid below */}
          <div className="relative mb-5 hidden h-4 md:block">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper-line" />
            <svg
              className="absolute inset-x-0 top-1/2 h-[2px] w-full -translate-y-1/2"
              preserveAspectRatio="none"
              viewBox="0 0 1000 2"
            >
              <path
                ref={pathRef}
                d="M0 1 L1000 1"
                stroke="var(--color-accent)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 grid grid-cols-4">
              {journey.map((step) => {
                const property = properties.find((p) => p.slug === step.slug)!;
                return (
                  <div key={step.slug} className="relative">
                    <span
                      className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-paper"
                      style={{ background: property.accent }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {journey.map((step, i) => {
              const property = properties.find((p) => p.slug === step.slug)!;
              return (
                <FadeUp key={step.slug} delay={i * 0.1}>
                  <div>
                    <span
                      className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-[0.6rem] font-medium md:hidden"
                      style={{ background: property.accentSoft, color: property.accent }}
                    >
                      0{i + 1}
                    </span>
                    <p className="text-[0.95rem] font-medium text-ink">
                      {step.verb}
                    </p>
                    <p
                      className="mt-1 text-[0.85rem]"
                      style={{ color: property.accent }}
                    >
                      {property.name}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
