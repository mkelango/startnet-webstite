"use client";

import { useState } from "react";
import FadeUp from "@/components/motion/FadeUp";
import { articles } from "@/lib/content/newsroom";
import { properties } from "@/lib/content/portfolio";

const filters = ["All", ...properties.map((p) => p.name)];

export default function NewsroomList() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? articles
      : articles.filter((a) => a.property === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-1.5 text-[0.85rem] transition-colors ${
              active === f
                ? "border-ink bg-ink text-paper"
                : "border-paper-line text-ink-soft hover:border-ink-faint"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-12 divide-y divide-paper-line border-y border-paper-line">
        {visible.map((article, i) => {
          const property = properties.find(
            (p) => p.slug === article.propertySlug
          )!;
          return (
            <FadeUp key={article.slug} delay={i * 0.04}>
              <a
                href={property.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 py-8 md:flex-row md:items-baseline md:gap-8"
              >
                <div className="flex shrink-0 items-center gap-3 md:w-48">
                  <span
                    className="rounded-full px-2.5 py-1 text-[0.72rem] font-medium"
                    style={{ background: property.accentSoft, color: property.accent }}
                  >
                    {property.name}
                  </span>
                  <span className="font-mono text-[0.75rem] text-ink-faint">
                    {new Date(article.date).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-[1.2rem] tracking-[-0.01em] text-ink group-hover:text-accent">
                    {article.headline}
                  </h3>
                  <p className="mt-1.5 text-[0.92rem] text-ink-soft">
                    {article.summary}
                  </p>
                </div>
              </a>
            </FadeUp>
          );
        })}
        {visible.length === 0 && (
          <p className="py-12 text-center text-ink-faint">
            No announcements for this property yet.
          </p>
        )}
      </div>
    </div>
  );
}
