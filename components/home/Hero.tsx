"use client";

import { useEffect, useRef } from "react";
import RevealLines from "@/components/motion/RevealLines";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/content/site";

export default function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(
          [eyebrowRef.current, subheadRef.current, cueRef.current],
          { opacity: 1, y: 0 }
        );
        return;
      }

      gsap.set(eyebrowRef.current, { opacity: 0, y: 14 });
      gsap.set(subheadRef.current, { opacity: 0, y: 18 });
      gsap.set(cueRef.current, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "expo.out",
      })
        .to(
          subheadRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "-=0.35"
        )
        .to(cueRef.current, { opacity: 1, duration: 0.6 }, "-=0.3");

      if (networkRef.current) {
        const paths = networkRef.current.querySelectorAll("path");
        const dots = networkRef.current.querySelectorAll("circle");
        gsap.set(dots, { opacity: 0, scale: 0.4, transformOrigin: "center" });
        gsap.set(paths, {
          strokeDasharray: 200,
          strokeDashoffset: 200,
          opacity: 0.6,
        });
        gsap
          .timeline({ delay: 0.3 })
          .to(paths, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.inOut",
            stagger: 0.15,
          })
          .to(
            dots,
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(2)" },
            "-=1"
          );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16">
      <div
        className="glow-red-soft pointer-events-none absolute -right-[10%] top-[8%] h-[560px] w-[560px] animate-[pulse_8s_ease-in-out_infinite] rounded-full"
        aria-hidden="true"
      />
      <div
        className="glow-red pointer-events-none absolute -left-[15%] bottom-[5%] h-[420px] w-[420px] rounded-full opacity-40"
        aria-hidden="true"
      />

      <svg
        ref={networkRef}
        viewBox="0 0 1200 800"
        className="pointer-events-none absolute inset-0 h-full w-full text-accent/50"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M180 620 L520 260 L900 180" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M520 260 L980 560" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M180 620 L980 560" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M900 180 L1120 420" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="180" cy="620" r="4" fill="currentColor" style={{ filter: "drop-shadow(0 0 6px currentColor)" }} />
        <circle cx="520" cy="260" r="4" fill="currentColor" style={{ filter: "drop-shadow(0 0 6px currentColor)" }} />
        <circle cx="900" cy="180" r="4" fill="currentColor" style={{ filter: "drop-shadow(0 0 6px currentColor)" }} />
        <circle cx="980" cy="560" r="4" fill="currentColor" style={{ filter: "drop-shadow(0 0 6px currentColor)" }} />
        <circle cx="1120" cy="420" r="4" fill="currentColor" style={{ filter: "drop-shadow(0 0 6px currentColor)" }} />
      </svg>

      <div className="relative mx-auto w-full max-w-[1320px] px-6 md:px-10">
        <div
          ref={eyebrowRef}
          className="glass mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-dot" />
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
            Masterbrand · Tamil Nadu&rsquo;s AI startup ecosystem
          </span>
        </div>

        <RevealLines
          as="h1"
          trigger="load"
          delay={0.1}
          stagger={0.1}
          lines={[
            "The infrastructure behind",
            "Tamil Nadu’s next 100,000",
            "founders.",
          ]}
          className="max-w-[18ch] font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[1.03] tracking-[-0.02em] text-ink"
        />

        <p
          ref={subheadRef}
          className="mt-8 max-w-[46ch] text-[1.15rem] leading-relaxed text-ink-soft md:text-[1.3rem]"
        >
          {site.narrative}
        </p>
      </div>

      <div
        ref={cueRef}
        className="relative mx-auto mt-16 flex w-full max-w-[1320px] items-center gap-3 px-6 text-ink-faint md:px-10"
      >
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em]">
          Five doors, below
        </span>
        <span className="h-px flex-1 max-w-16 bg-paper-line" />
        <span className="animate-bounce text-lg">↓</span>
      </div>
    </section>
  );
}
