import Image from "next/image";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/** The approved emblem (transparent cut-out of the official logo). */
export function LogoMark({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={site.logo.emblem.src}
      width={site.logo.emblem.width}
      height={site.logo.emblem.height}
      alt=""
      sizes="64px"
      loading={priority ? "eager" : "lazy"}
      className={cn("h-11 w-auto shrink-0", className)}
    />
  );
}

/**
 * Header / footer lockup: emblem + live-text wordmark.
 * The original lockup uses dark green type designed for white backgrounds;
 * on dark surfaces we set the wordmark in ivory with the gold subline so it
 * stays legible (contrast-safe) while keeping the logo's structure.
 */
export function Logo({ className, tone = "light", priority = false }: { className?: string; tone?: "light" | "dark"; priority?: boolean }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5 sm:gap-3", className)}>
      <LogoMark priority={priority} className="h-10 sm:h-11" />
      {/* Very narrow phones (<360px) show the emblem alone; the subline joins from sm. */}
      <span className="hidden min-w-0 flex-col leading-none whitespace-nowrap min-[360px]:flex">
        <span
          className={cn(
            "font-display text-[1.15rem] tracking-[0.1em] uppercase sm:text-[1.35rem] sm:tracking-[0.12em]",
            tone === "light" ? "text-ivory-50" : "text-green-800",
          )}
        >
          {site.shortName}
        </span>
        <span
          className={cn(
            "mt-1 hidden text-[0.6rem] font-semibold tracking-[0.2em] uppercase sm:block",
            tone === "light" ? "text-gold-400" : "text-gold-800",
          )}
        >
          Development Foundation
        </span>
      </span>
    </span>
  );
}
