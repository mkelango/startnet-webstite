"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { nav } from "@/lib/content/site";
import { buckets, propertiesByBucket } from "@/lib/content/portfolio";

export default function Header() {
  const [condensed, setCondensed] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ease-out ${
          condensed ? "glass !border-x-0 !border-t-0" : "bg-paper/0"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1320px] items-center justify-between px-6 transition-all duration-500 ease-out md:px-10 ${
            condensed ? "py-3.5" : "py-6"
          }`}
        >
          <Link href="/" className="relative z-10" aria-label="StartNet home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-paper-line/70 bg-white/[0.03] p-1.5 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setPortfolioOpen(true)}
              onMouseLeave={() => setPortfolioOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9rem] text-ink-soft transition-colors hover:bg-white/[0.06] hover:text-ink"
                aria-expanded={portfolioOpen}
              >
                Portfolio
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  className={`transition-transform duration-300 ${
                    portfolioOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {portfolioOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-strong absolute left-1/2 top-full mt-3 w-[560px] -translate-x-1/2 rounded-2xl p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
                  >
                    <div className="grid grid-cols-3 gap-6">
                      {buckets.map((bucket) => (
                        <div key={bucket.id}>
                          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
                            {bucket.label}
                          </p>
                          <ul className="mt-3 space-y-3">
                            {propertiesByBucket(bucket.id).map((p) => (
                              <li key={p.slug}>
                                <a
                                  href={p.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block"
                                >
                                  <span className="block text-[0.92rem] font-medium text-ink">
                                    <span className="decoration-2 underline-offset-4 group-hover:underline">
                                      {p.name}
                                    </span>
                                  </span>
                                  <span className="mt-0.5 block text-[0.78rem] text-ink-faint">
                                    {p.kicker}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-[0.9rem] text-ink-soft transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-[0.9rem] font-medium text-ink transition-all duration-300 hover:bg-accent-ink hover:shadow-[0_0_28px_rgba(204,48,41,0.55)] lg:inline-block"
            >
              Contact
            </Link>
            <button
              className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <motion.span
                animate={
                  mobileOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }
                }
                className="h-[1.5px] w-6 bg-ink"
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }
                }
                className="h-[1.5px] w-6 bg-ink"
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-0 z-0 h-dvh overflow-y-auto bg-paper px-6 pb-10 pt-24 lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              <button
                className="flex items-center justify-between border-b border-paper-line py-4 text-left text-lg text-ink"
                onClick={() => setMobilePortfolioOpen((v) => !v)}
              >
                Portfolio
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 10 6"
                  fill="none"
                  className={`transition-transform duration-300 ${
                    mobilePortfolioOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {mobilePortfolioOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-5 py-4">
                      {buckets.map((bucket) => (
                        <div key={bucket.id}>
                          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
                            {bucket.label}
                          </p>
                          <ul className="mt-2 space-y-2.5">
                            {propertiesByBucket(bucket.id).map((p) => (
                              <li key={p.slug}>
                                <a
                                  href={p.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[0.95rem] text-ink-soft"
                                >
                                  {p.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-paper-line py-4 text-lg text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-6 rounded-full bg-accent px-5 py-3.5 text-center text-[0.95rem] font-medium text-ink"
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
