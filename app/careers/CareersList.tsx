"use client";

import { useState } from "react";
import FadeUp from "@/components/motion/FadeUp";
import { roles } from "@/lib/content/careers";
import { properties } from "@/lib/content/portfolio";

const filters = ["All", "StartNet (corporate)", ...properties.map((p) => p.name)];

export default function CareersList() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? roles : roles.filter((r) => r.property === active);

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

      <div className="mt-12">
        {visible.length > 0 ? (
          <div className="divide-y divide-paper-line border-y border-paper-line">
            {visible.map((role, i) => (
              <FadeUp key={role.title} delay={i * 0.05}>
                <div className="flex flex-col gap-2 py-7 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-display text-[1.15rem] text-ink">
                      {role.title}
                    </p>
                    <p className="mt-1 text-[0.85rem] text-ink-faint">
                      {role.property} · {role.location}
                    </p>
                  </div>
                  <span className="text-[0.9rem] font-medium text-accent">
                    View role
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        ) : (
          <FadeUp>
            <div className="rounded-2xl border border-dashed border-paper-line bg-paper-dim px-8 py-16 text-center">
              <p className="font-display text-[1.4rem] text-ink">
                Nothing open right now that fits?
              </p>
              <a
                href="mailto:careers@startnet.in"
                className="mt-4 inline-block font-medium text-accent underline underline-offset-4"
              >
                Send us a general application →
              </a>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
