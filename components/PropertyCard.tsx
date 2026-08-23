"use client";

import { useRef, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import ArrowLink from "@/components/ArrowLink";
import type { Property } from "@/lib/content/portfolio";

export default function PropertyCard({
  property,
  detailed = false,
}: {
  property: Property;
  detailed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    gsap.to(el, {
      rotateX: rx,
      rotateY: ry,
      duration: 0.5,
      ease: "power3.out",
      transformPerspective: 800,
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative flex h-full flex-col rounded-2xl border border-paper-line bg-paper p-7 transition-shadow duration-300 will-change-transform hover:shadow-[0_30px_60px_-24px_rgba(20,22,27,0.18)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-[0.72rem] font-medium"
          style={{ background: property.accentSoft, color: property.accent }}
        >
          {property.mark}
        </span>
        <span className="font-mono text-[0.72rem] text-ink-faint">
          {property.domain}
        </span>
      </div>

      <h3 className="mt-6 font-display text-[1.5rem] tracking-[-0.01em] text-ink">
        {property.name}
      </h3>
      <p className="mt-1 text-[0.85rem] font-medium" style={{ color: property.accent }}>
        {property.kicker}
      </p>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
        {property.oneLiner}
      </p>

      {detailed && (
        <>
          <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-soft">
            {property.extended}
          </p>
          <p className="mt-4 text-[0.85rem] text-ink-faint">
            <span className="font-medium text-ink">Best for — </span>
            {property.bestFor}
          </p>
        </>
      )}

      <div className="mt-auto pt-6">
        <ArrowLink href={property.href} external>
          Visit {property.domain}
        </ArrowLink>
      </div>
    </div>
  );
}
