import { Sparkle } from "@/components/ui/primitives";

/**
 * Footer marquee of the foundation's values and partners. CSS-only: the track
 * holds two identical runs (the second aria-hidden) and slides by one run.
 * Pauses on hover/focus; becomes a static wrapped list for reduced motion.
 */
export function ValuesMarquee({ items }: { items: readonly string[] }) {
  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-display text-[clamp(1.75rem,1.2rem+2vw,3.25rem)] leading-none whitespace-nowrap text-ivory-50 italic sm:px-10">
            {item}
          </span>
          <Sparkle className="size-4 shrink-0 text-gold-400" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee overflow-hidden border-y border-ivory-100/10 py-6 sm:py-8">
      <p className="sr-only">Our values and partners: {items.join(", ")}.</p>
      <div aria-hidden="true" className="marquee-track flex w-max" style={{ "--marquee-duration": `${items.length * 5}s` } as React.CSSProperties}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
