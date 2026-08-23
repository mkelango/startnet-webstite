import Link from "next/link";
import { Logo } from "./Logo";
import { properties } from "@/lib/content/portfolio";
import { footerColumns, site } from "@/lib/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-paper-line bg-paper-dim">
      <div className="mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1.8fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[24ch] text-[0.95rem] leading-relaxed text-ink-soft">
              {site.oneBreath}
            </p>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
              Portfolio
            </p>
            <ul className="mt-4 space-y-4">
              {properties.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="text-[0.95rem] font-medium text-ink group-hover:text-accent">
                      {p.name}
                    </span>
                    <span className="mt-0.5 block text-[0.82rem] text-ink-faint">
                      {p.kicker}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
              Company
            </p>
            <ul className="mt-4 space-y-3">
              {footerColumns.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] text-ink-soft hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
              Connect
            </p>
            <ul className="mt-4 space-y-3">
              {footerColumns.connect.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] text-ink-soft hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.95rem] text-ink-soft hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper-line pt-8 text-[0.82rem] text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} StartNet. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
