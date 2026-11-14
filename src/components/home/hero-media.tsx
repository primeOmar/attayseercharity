"use client";

import { Photo } from "@/components/ui/photo";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import type { BrandTone, ImageAsset } from "@/types/content";
import { cn, pad2 } from "@/lib/utils";
import { gsap, motionQueries, useGSAP } from "@/lib/animation/gsap";

interface Slide {
  id: string;
  label: string;
  caption: string;
  image: ImageAsset;
  tone: BrandTone;
}

const DURATION = 7000;
const noopSubscribe = () => () => {};
const wipe = [0.76, 0, 0.24, 1] as const;

/**
 * Hero background slider — a full-bleed photo frame on every screen size.
 * Advancing wipes the new image in from the right.
 * Pauses on hover/focus, has a visible pause control (WCAG 2.2.2) and starts
 * paused for reduced-motion users.
 */
export function HeroMedia({ slides }: { slides: readonly Slide[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  // null = no explicit choice yet → autoplay unless the user prefers reduced motion.
  const [playPref, setPlayPref] = useState<boolean | null>(null);
  const reduceMotion = useReducedMotion();
  const playing = playPref ?? !reduceMotion;
  const setPlaying = (fn: (p: boolean) => boolean) => setPlayPref(fn(playing));
  const [hovering, setHovering] = useState(false);
  // false during SSR + hydration, true afterwards: defers non-LCP slide images.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const count = slides.length;

  const go = useCallback(
    (to: number) => {
      setPrev(index);
      setIndex(((to % count) + count) % count);
    },
    [index, count],
  );

  // Paused once the hero is mostly scrolled away (no slide changes off-screen).
  const [scrolledAway, setScrolledAway] = useState(false);
  const running = playing && !hovering && !scrolledAway;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(t);
  }, [running, index, go]);

  /*
   * Motion (none for reduced motion):
   *  load   — CSS `hero-open`: the frame unveils from a rounded inner card to
   *           full bleed while the photo eases out of a zoom (see globals.css).
   *  scroll — scrubbed, never pinned, so it feels native on every device:
   *           the frame settles back into a floating rounded card that trails
   *           the page; the photo parallaxes inside it; the headline lines
   *           split apart in opposite directions; the copy and controls lift
   *           away. Mission then opens from its own rounded card over it
   *           (SectionTransitions).
   * The load animation uses clip-path, the scroll one uses transforms, so the
   * two never fight even if the visitor scrolls during the intro.
   */
  useGSAP(
    () => {
      const frame = root.current;
      const section = frame?.closest<HTMLElement>("[data-hero]");
      if (!frame || !section) return;
      const q = gsap.utils.selector(section);
      const lines = q("[data-hero-line]");
      const fades = q("[data-hero-fade]");
      const controls = frame.querySelector("[data-hero-controls]");
      const layer = frame.querySelector("[data-hero-layer]");
      const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 1024px)", motion: motionQueries.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;

        // Tuned per breakpoint: phones get a gentler settle and a shorter split.
        const v = desktop
          ? { scale: 0.84, trail: 0.32, radius: 2.5, split: 26, parallax: 6.5, lift: 72 }
          : { scale: 0.9, trail: 0.2, radius: 1.5, split: 16, parallax: 5, lift: 44 };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            // A touch of smoothing on desktop wheels; 1:1 on touch for direct feel.
            scrub: desktop ? 0.6 : true,
            invalidateOnRefresh: true,
            onUpdate: (self) => setScrolledAway(self.progress > 0.3),
          },
        });

        // 1 — Frame: full bleed → floating rounded card, trailing the page.
        tl.fromTo(
          frame,
          { scale: 1, y: 0, borderRadius: 0 },
          {
            scale: v.scale,
            y: () => section.offsetHeight * v.trail,
            borderRadius: () => rem() * v.radius,
            duration: 1,
            ease: "power1.inOut",
          },
          0,
        )
          // 2 — Photo parallax inside the card (the layer is pre-scaled in CSS
          //     so this never exposes an edge).
          .fromTo(layer, { yPercent: 0 }, { yPercent: v.parallax, duration: 1 }, 0)
          // 3 — Headline lines split apart, alternating directions.
          .to(
            lines,
            {
              xPercent: (i: number) => (i % 2 ? 1 : -1) * v.split,
              opacity: 0,
              duration: 0.6,
              ease: "power2.in",
            },
            0,
          )
          // 4 — Copy and controls lift away.
          .to(fades, { y: -v.lift, opacity: 0, stagger: 0.05, duration: 0.45, ease: "power2.in" }, 0)
          .to(controls, { y: 20, opacity: 0, duration: 0.3, ease: "power1.in" }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const current = slides[index];

  return (
    <div
      ref={root}
      data-hero-frame
      className="absolute inset-0 origin-center overflow-hidden shadow-[0_50px_100px_-40px_rgb(11_10_8/0.6)] will-change-transform motion-safe:animate-hero-open"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      {/* Image stack */}
      <div className="absolute inset-0 overflow-hidden bg-green-900">
        {/* Pre-scaled so the scroll parallax (≤6.5%) never reveals an edge. */}
        <div data-hero-layer className="absolute inset-0 will-change-transform motion-safe:scale-[1.15]">
          {slides.map((slide, i) => {
            if (i !== 0 && !mounted) return null;
            const isActive = i === index;
            const isPrev = i === prev;
            return (
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                style={{ zIndex: isActive ? 2 : isPrev ? 1 : 0 }}
                initial={false}
                animate={{
                  clipPath: isActive || isPrev ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
                }}
                transition={{ duration: isActive ? 1.3 : 0, ease: wipe }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: isActive ? 1 : 1.12 }}
                  transition={{ duration: isActive ? 2.4 : 0, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Photo
                    image={slide.image}
                    alt={i === 0 ? slide.image.alt : ""}
                    fill
                    sizes="100vw"
                    quality={75}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    className={cn("object-cover", i === 0 && "motion-safe:animate-hero-zoom")}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        {/* Legibility scrims */}
        {/* Kept light: just enough for the white headline to pass contrast. */}
        <div aria-hidden="true" className="absolute inset-0 z-[3] bg-gradient-to-r from-ink-950/70 via-ink-950/30 to-transparent lg:from-ink-950/80 lg:via-ink-950/45" />
        <div aria-hidden="true" className="absolute inset-0 z-[3] bg-gradient-to-t from-ink-950/75 via-transparent to-ink-950/35" />
      </div>

      {/* Controls */}
      <div data-hero-controls className="absolute inset-x-0 bottom-0 z-[5]">
        <div className="container-site flex items-end justify-between gap-6 pb-6 sm:pb-8">
          <div className="min-w-0 flex-1" aria-live={playing ? "off" : "polite"}>
            <div className="flex items-center gap-4">
              <span className="eyebrow text-ivory-50 tabular-nums">
                {pad2(index + 1)} <span className="text-ink-400">/ {pad2(count)}</span>
              </span>
              <span className="eyebrow truncate text-gold-400">{current.label}</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="mt-2 hidden max-w-sm text-sm text-ivory-100/75 sm:block"
              >
                {current.caption}
              </motion.p>
            </AnimatePresence>
            {/* Progress segments */}
            <div className="mt-4 flex max-w-xs gap-2" aria-hidden="true">
              {slides.map((s, i) => (
                <span key={s.id} className="relative h-0.5 flex-1 overflow-hidden bg-ivory-100/20">
                  <span
                    key={`${s.id}-${index}-${running}`}
                    className={cn(
                      "absolute inset-0 origin-left bg-gold-400",
                      i < index && "scale-x-100",
                      i > index && "scale-x-0",
                      i === index && (running ? "animate-[grow_linear_forwards]" : "scale-x-100 opacity-60"),
                    )}
                    style={i === index && running ? { animationDuration: `${DURATION}ms` } : undefined}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ControlButton label={playing ? "Pause slideshow" : "Play slideshow"} onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </ControlButton>
            <ControlButton label="Previous slide" onClick={() => go(index - 1)}>
              <ArrowLeft className="size-4" />
            </ControlButton>
            <ControlButton label="Next slide" onClick={() => go(index + 1)}>
              <ArrowRight className="size-4" />
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-ivory-100/30 text-ivory-50 transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-ink-950 [&_svg]:pointer-events-none"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
