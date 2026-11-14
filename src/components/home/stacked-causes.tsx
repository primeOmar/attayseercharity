import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BrandTone, Cause } from "@/types/content";
import { Photo } from "@/components/ui/photo";
import { cn, pad2 } from "@/lib/utils";

const wash: Record<BrandTone, string> = {
  gold: "bg-wash-gold",
  green: "bg-wash-green",
  red: "bg-wash-red",
};
const rule: Record<BrandTone, string> = {
  gold: "bg-gold-metal",
  green: "bg-green-metal",
  red: "bg-red-metal",
};

/**
 * Sticky-stacking programme cards: from md up, each card pins a little lower
 * than the one before and the next slides over it. Pure CSS (position: sticky),
 * so it needs no JS and keyboard/screen-reader order is just the list order.
 * Phones get a plain stack — a pinned card taller than the screen would hide
 * its own content.
 */
export function StackedCauses({ causes }: { causes: Cause[] }) {
  return (
    <ol className="relative">
      {causes.map((cause, i) => (
        <li
          key={cause.slug}
          className="mb-6 md:sticky md:mb-[12svh] md:last:mb-0"
          style={{ top: `calc(5.5rem + ${i} * 1.75rem)` }}
        >
          <article
            className={cn(
              "group relative grid overflow-hidden rounded-photo border border-ink-950/8 shadow-[0_-24px_60px_-34px_rgb(11_10_8/0.45)] md:min-h-[68svh] md:grid-cols-12",
              wash[cause.tone],
            )}
          >
            <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", rule[cause.tone])} />
            <div className="flex flex-col p-7 sm:p-10 md:col-span-6 lg:col-span-5 lg:p-12">
              <span className="eyebrow text-red-600 tabular-nums">
                Priority {pad2(i + 1)} <span className="text-ink-500">/ {pad2(causes.length)}</span>
              </span>
              <h3 className="mt-5 font-display text-[clamp(2.25rem,1.6rem+2.4vw,4rem)] leading-[1.02] text-ink-950">
                <Link href={`/causes/${cause.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {cause.title}
                </Link>
              </h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-700">{cause.summary}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-10 text-sm font-medium tracking-wide text-ink-950">
                Explore this programme
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
            <div className="relative aspect-[16/10] md:col-span-6 md:aspect-auto lg:col-span-7">
              <div className="absolute inset-0 overflow-hidden md:inset-4 md:rounded-photo-sm lg:inset-5">
                <Photo
                  image={cause.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105"
                />
              </div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
