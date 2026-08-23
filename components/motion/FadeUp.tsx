"use client";

import { useEffect, useRef, type ReactNode, type Ref } from "react";
import { gsap } from "@/lib/gsap";

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article";
};

export default function FadeUp({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: FadeUpProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y });

    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [delay, y]);

  const Element = Tag as "div";

  return (
    <Element ref={ref as Ref<HTMLDivElement>} className={className}>
      {children}
    </Element>
  );
}
