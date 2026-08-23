"use client";

import { useEffect, useRef, type Ref, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type RevealLinesProps = {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  trigger?: "load" | "scroll";
  delay?: number;
  stagger?: number;
};

export default function RevealLines({
  lines,
  as = "h2",
  className,
  lineClassName,
  trigger = "scroll",
  delay = 0,
  stagger = 0.09,
}: RevealLinesProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const Tag = as;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const inners = el.querySelectorAll<HTMLElement>("[data-reveal-inner]");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(inners, { y: 0, opacity: 1 });
      return;
    }

    gsap.set(inners, { y: "115%", opacity: 0 });

    const anim = gsap.to(inners, {
      y: "0%",
      opacity: 1,
      duration: 1,
      ease: "expo.out",
      stagger,
      delay,
      scrollTrigger:
        trigger === "scroll"
          ? {
              trigger: el,
              start: "top 85%",
              once: true,
            }
          : undefined,
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [trigger, delay, stagger]);

  return (
    <Tag
      ref={containerRef as Ref<HTMLHeadingElement>}
      className={className}
    >
      {lines.map((line, i) => (
        <span className="reveal-line" key={i}>
          <span data-reveal-inner className={lineClassName}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
