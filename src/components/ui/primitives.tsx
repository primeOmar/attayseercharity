import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  tone = "gold",
}: {
  children: ReactNode;
  className?: string;
  tone?: "gold" | "muted" | "dark" | "red" | "green";
}) {
  const tones = {
    gold: "text-gold-400",
    muted: "text-ink-300",
    dark: "text-ink-500",
    red: "text-red-600",
    green: "text-green-700",
  } as const;
  return (
    <p className={cn("eyebrow flex items-center gap-3", tones[tone], className)}>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}

/**
 * Visible disclosure for unverified figures and placeholder editorial.
 * Required by project rules: never present sample data as real.
 */
export function SampleBadge({
  children = "Sample data — awaiting verified figures",
  className,
  tone = "dark",
}: {
  children?: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-medium",
        tone === "dark"
          ? "border-gold-500/40 bg-gold-500/10 text-gold-300"
          : "border-red-600/30 bg-red-600/5 text-red-600",
        className,
      )}
    >
      <Info aria-hidden="true" className="size-3.5" />
      {children}
    </p>
  );
}

/** Masked multi-line display heading. Lines are revealed by CSS or GSAP. */
export function SplitLines({
  lines,
  className,
  lineClassName,
  italicLast = false,
  accent,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  italicLast?: boolean;
  /** Paint the last line with a logo gradient (gold on dark, green on light). */
  accent?: "gold" | "green";
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => {
        const last = i === lines.length - 1;
        const accented = last && accent;
        return (
          <span key={line} className="line-mask">
            <span
              data-line
              className={cn(
                accented ? "inline-block pr-[0.08em]" : "block",
                italicLast && last && "italic",
                accented && (accent === "gold" ? "text-gold-metal" : "text-green-metal"),
                lineClassName,
              )}
            >
              {line}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Four-point star from the logo crown — a small brand glyph. */
export function Sparkle({ className }: { className?: string }) {
  const id = "sparkle-gold";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#feef99" />
          <stop offset="0.5" stopColor="#f1b10f" />
          <stop offset="1" stopColor="#b06401" />
        </linearGradient>
      </defs>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={`url(#${id})`} />
    </svg>
  );
}
