"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { contactContent } from "@/lib/content/contact";

const reasonMap: Record<string, string> = {
  general: "General",
  partnership: "Partnership",
  press: "Press",
  careers: "Careers",
  property: "A specific property",
};

export default function ContactForm() {
  const searchParams = useSearchParams();
  const presetReason = reasonMap[searchParams.get("reason") ?? ""];
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // No backend is wired yet — this is a frontend-only placeholder that
    // confirms receipt locally. Wire to a real submission endpoint before launch.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="font-display text-[1.5rem] text-ink">
          Thanks — we&rsquo;ll be in touch.
        </p>
        <p className="mt-2 text-[0.95rem] text-ink-soft">
          We route your message to the right team within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-faint">
            Name
          </span>
          <input
            required
            type="text"
            name="name"
            className="mt-2 w-full rounded-lg border border-paper-line bg-white/[0.03] px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-faint">
            Email
          </span>
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-lg border border-paper-line bg-white/[0.03] px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-accent"
          />
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-faint">
          I&rsquo;m reaching out about
        </span>
        <select
          name="reason"
          defaultValue={presetReason ?? "General"}
          className="mt-2 w-full rounded-lg border border-paper-line bg-white/[0.03] px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-accent"
        >
          {contactContent.reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-faint">
          Message
        </span>
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full rounded-lg border border-paper-line bg-white/[0.03] px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-accent"
        />
      </label>

      <button
        type="submit"
        className="rounded-full bg-accent px-7 py-3.5 text-[0.95rem] font-medium text-ink transition-all duration-300 hover:bg-accent-ink hover:shadow-[0_0_28px_rgba(204,48,41,0.5)]"
      >
        Send message
      </button>
    </form>
  );
}
