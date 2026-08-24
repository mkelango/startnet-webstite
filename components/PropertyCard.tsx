"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import ArrowLink from "@/components/ArrowLink";
import type { Property } from "@/lib/content/portfolio";

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function PropertyCard({
  property,
  detailed = false,
}: {
  property: Property;
  detailed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glow = hexToRgba(property.accent, 0.35);

  const handleEnter = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      y: -6,
      boxShadow: `0 30px 70px -24px rgba(0,0,0,0.6), 0 0 0 1px ${hexToRgba(
        property.accent,
        0.3
      )}, 0 0 48px -8px ${glow}`,
      borderColor: hexToRgba(property.accent, 0.4),
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      y: 0,
      boxShadow: "0 0px 0px rgba(0,0,0,0)",
      borderColor: "rgba(255,255,255,0.1)",
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="glass group relative flex h-full flex-col rounded-2xl p-7 will-change-transform"
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

      <h3 className="mt-6 font-display text-[1.5rem] font-medium tracking-[-0.01em] text-ink">
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
