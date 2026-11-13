"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import type { ProcessStep } from "@/types/content";
import { cn, pad2 } from "@/lib/utils";
import { scrollToPosition } from "@/components/layout/smooth-scroll";

const ease = [0.16, 1, 0.3, 1] as const;
/** Scroll distance per step, in viewport heights. */
const STEP_VH = 90;

/**
 * DONATE → ALLOCATE → IMPLEMENT → VERIFY → REPORT
 *
 * Aurelia reference adaptation on a light stage: a tall scroll track with a
 * sticky scene — copy on the left, a framed photo that slowly pushes in, and a
 * vertical step rail. The track declares a guided stop per step
 * (data-snap-stops), so each wheel gesture glides exactly one step and no step
 * is skipped. Rail items are buttons that jump to a step.
 * Uses CSS `position: sticky` (no pinning JS). Below `lg` it becomes a list.
 */
export function DonationProcess({ steps }: { steps: ProcessStep[] }) {
  return (
    <section aria-labelledby="process-title" className="bg-ivory-100 text-ink-950">
      <h2 id="process-title" className="sr-only">
        How your support works
      </h2>
      <MobileSteps steps={steps} />
      <DesktopJourney steps={steps} />
    </section>
  );
}

function DesktopJourney({ steps }: { steps: ProcessStep[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const last = steps.length - 1;

  // Each step owns the stretch of scroll centred on its stop.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(last, Math.max(0, Math.round(p * last)));
    if (i !== active) setActive(i);
  });

  const jumpTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToPosition(top + (span * i) / last);
  };

  const stops = steps
    .slice(1)
    .map((_, i) => ((STEP_VH * (i + 1)) / 100).toFixed(2))
    .join(",");
  const step = steps[active];

  return (
    <div
      ref={track}
      data-snap-stops={stops}
      className="relative hidden lg:block"
      style={{ height: `${last * STEP_VH + 100}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-16">
        <div className="container-site grid w-full grid-cols-12 items-center gap-10">
          {/* Copy */}
          <div className="col-span-5">
            <p className="eyebrow flex items-center gap-3 text-green-700">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              How your support works
            </p>

            <div className="mt-8 flex items-baseline gap-5" aria-hidden="true">
              <span className="eyebrow text-ink-500">Step</span>
              <span className="relative block h-[clamp(5rem,8vw,8rem)] overflow-hidden font-display text-[clamp(5rem,8vw,8rem)] leading-none tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    className="block text-green-metal"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease }}
                  >
                    {pad2(active + 1)}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="eyebrow text-ink-500 tabular-nums">/ {pad2(steps.length)}</span>
            </div>

            <div className="relative mt-6 min-h-[15rem]">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "absolute inset-x-0 top-0 transition-[opacity,transform] duration-700 ease-out-expo",
                    i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
                  )}
                  aria-hidden={i !== active}
                >
                  <h3 className="font-display text-display-md">{s.title}</h3>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-700">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Framed photo */}
          <div className="col-span-4">
            <div className="relative mx-auto aspect-[4/5] max-h-[68svh] isolate overflow-hidden rounded-photo bg-ivory-200 shadow-lift">
              <motion.div style={{ scale: zoom }} className="absolute inset-0">
                {steps.map((s, i) => (
                  <Image
                    key={s.id}
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 0px"
                    aria-hidden={i !== active}
                    className={cn(
                      "object-cover transition-[opacity,transform,clip-path] duration-[1200ms] ease-out-expo",
                      i === active
                        ? "scale-100 opacity-100 [clip-path:inset(0_0_0_0)]"
                        : i < active
                          ? "scale-105 opacity-0 [clip-path:inset(0_0_100%_0)]"
                          : "scale-105 opacity-0 [clip-path:inset(100%_0_0_0)]",
                    )}
                  />
                ))}
              </motion.div>
              <span className="eyebrow absolute bottom-4 left-4 rounded-pill bg-white/90 px-3 py-1.5 text-ink-950 backdrop-blur-sm">
                {step.title}
              </span>
            </div>
          </div>

          {/* Rail */}
          <nav aria-label="Donation steps" className="col-span-3 justify-self-end">
            <ol className="relative flex flex-col gap-9 pl-8">
              <span aria-hidden="true" className="absolute top-1 bottom-1 left-[5px] w-px bg-ink-950/15" />
              <motion.span
                aria-hidden="true"
                style={{ scaleY: railScale }}
                className="absolute top-1 bottom-1 left-[5px] w-px origin-top bg-green-700"
              />
              {steps.map((s, i) => (
                <li key={s.id} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 -left-8 size-[11px] -translate-y-1/2 rounded-full border transition-colors duration-500",
                      i <= active ? "border-green-700 bg-green-700" : "border-ink-950/30 bg-ivory-100",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className={cn(
                      "flex items-baseline gap-3 text-left transition-colors",
                      i === active ? "text-ink-950" : "text-ink-500 hover:text-green-700",
                    )}
                  >
                    <span className="eyebrow tabular-nums">{pad2(i + 1)}</span>
                    <span className="text-sm font-medium tracking-[0.18em] uppercase">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Screen-reader announcement of the current step */}
        <p className="sr-only" aria-live="polite">
          Step {active + 1} of {steps.length}: {step.title}
        </p>
      </div>
    </div>
  );
}

function MobileSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="container-site py-[var(--spacing-section)] lg:hidden">
      <p className="eyebrow flex items-center gap-3 text-green-700">
        <span aria-hidden="true" className="h-px w-8 bg-current" />
        How your support works
      </p>
      <p className="mt-6 font-display text-display-md">{steps.map((s) => s.title).join(" → ")}</p>
      <ol className="mt-12 space-y-14">
        {steps.map((s, i) => (
          <li key={s.id} data-reveal>
            <div data-reveal="image" className="relative aspect-[16/10] overflow-hidden rounded-photo">
              <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" className="object-cover" />
            </div>
            <p className="eyebrow mt-6 text-green-700">Step {pad2(i + 1)}</p>
            <h3 className="mt-2 font-display text-4xl">{s.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-700">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
