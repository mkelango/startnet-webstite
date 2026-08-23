export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-logo text-[1.45rem] font-extrabold leading-none tracking-[-0.01em] text-ink ${className ?? ""}`}
    >
      StartNet
      <span
        aria-hidden="true"
        className="ml-[0.06em] inline-block h-[0.2em] w-[0.2em] translate-y-[0.03em] rounded-full bg-brand-dot"
      />
    </span>
  );
}
