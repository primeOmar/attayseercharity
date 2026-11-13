"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import type { Cause } from "@/types/content";
import { cn, pad2 } from "@/lib/utils";

const toneText = { red: "text-red-500", green: "text-green-400", gold: "text-gold-300" } as const;
const toneBg = { red: "bg-red-metal", green: "bg-green-metal", gold: "bg-gold-metal" } as const;
const INTERVAL = 4200;

/**
 * Interactive cause directory (Forge "services" split adapted).
 * Desktop: the list tours itself while on screen — each cause takes a turn in
 * the sticky preview, with a progress line under the active row — so every
 * focus area gets seen. Hover / focus takes over instantly; a visible control
 * pauses the tour (WCAG 2.2.2). Mobile: each row carries its own thumbnail.
 */
export function CausesIndex({ causes }: { causes: Cause[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [playPref, setPlayPref] = useState<boolean | null>(null);
  const reduceMotion = useReducedMotion();
  const playing = playPref ?? !reduceMotion;
  const running = playing && inView && !hovering;
  const current = causes[active];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % causes.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, active, causes.length]);

  return (
    <div ref={root} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <ol
        className="border-t border-ink-950/10 lg:col-span-7"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocusCapture={() => setHovering(true)}
        onBlurCapture={() => setHovering(false)}
      >
        {causes.map((cause, i) => {
          const isActive = i === active;
          return (
            <li key={cause.slug} className="relative border-b border-ink-950/10">
              <Link
                href={`/causes/${cause.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-4 py-6 sm:gap-x-8 lg:py-7"
              >
                <span className={cn("eyebrow w-7 tabular-nums transition-colors", isActive ? "lg:text-green-700" : "text-ink-500")}>
                  {pad2(i + 1)}
                </span>
                <span
                  className={cn(
                    "font-display text-[clamp(2rem,1.4rem+2.6vw,4rem)] leading-none text-ink-950 transition-[color,transform] duration-700 ease-out-expo",
                    isActive ? "lg:translate-x-3 lg:text-ink-950" : "lg:text-ink-950/35",
                  )}
                >
                  {cause.title}
                </span>
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-full border transition-all duration-500",
                    isActive
                      ? "lg:border-green-700 lg:bg-green-700 lg:text-ivory-50"
                      : "border-ink-950/20 text-ink-950 group-hover:border-green-700",
                  )}
                >
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </span>

                {/* Mobile detail */}
                <span className="col-span-3 grid grid-cols-[6rem_1fr] gap-4 lg:hidden">
                  <span className="relative block aspect-square overflow-hidden rounded-md">
                    <Image src={cause.image.src} alt="" fill sizes="6rem" className="object-cover" />
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ink-700">{cause.summary}</span>
                </span>
              </Link>
              {/* Tour progress (desktop) */}
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-px hidden h-0.5 overflow-hidden lg:block">
                {isActive && (
                  <span
                    key={`${active}-${running}`}
                    className={cn(
                      "absolute inset-0 origin-left bg-green-700",
                      running ? "animate-[grow_linear_forwards]" : "scale-x-100 opacity-40",
                    )}
                    style={running ? { animationDuration: `${INTERVAL}ms` } : undefined}
                  />
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Desktop sticky preview */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ivory-200 shadow-lift">
            {causes.map((cause, i) => (
              <Image
                key={cause.slug}
                src={cause.image.src}
                alt={cause.image.alt}
                fill
                sizes="(min-width: 1024px) 38vw, 0px"
                aria-hidden={i !== active}
                className={cn(
                  "object-cover transition-[opacity,transform] duration-1000 ease-out-expo",
                  i === active ? "scale-100 opacity-100" : "scale-110 opacity-0",
                )}
              />
            ))}
            <span
              aria-hidden="true"
              className={cn("absolute top-0 left-0 h-full w-1.5 transition-colors duration-700", toneBg[current.tone])}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 via-ink-950/50 to-transparent p-8 pt-24">
              <p className={cn("eyebrow", toneText[current.tone])}>
                {pad2(active + 1)} — {current.title}
              </p>
              <p className="mt-3 max-w-sm text-lg leading-snug text-ivory-50">{current.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => setPlayPref(!playing)}
              aria-label={playing ? "Pause causes tour" : "Play causes tour"}
              className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/85 text-ink-950 backdrop-blur-sm transition-colors hover:bg-green-700 hover:text-ivory-50"
            >
              {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
