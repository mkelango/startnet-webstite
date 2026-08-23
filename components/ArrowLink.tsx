import Link from "next/link";
import type { ReactNode } from "react";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
};

export default function ArrowLink({
  href,
  children,
  external,
  className,
}: ArrowLinkProps) {
  const isExternal = external ?? href.startsWith("http");
  const classes = `group/arrow inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-ink transition-colors hover:text-accent ${className ?? ""}`;

  const content = (
    <>
      <span className="border-b border-current/40 pb-0.5">{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="shrink-0 transition-transform duration-300 ease-out group-hover/arrow:translate-x-1"
      >
        <path
          d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
