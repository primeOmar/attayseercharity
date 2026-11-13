"use client";

import Image from "next/image";
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

const toneBg: Record<BrandTone, string> = {
  red: "bg-red-metal",
  green: "bg-green-metal",
  gold: "bg-gold-metal",
};

const DURATION = 7000;
const noopSubscribe = () => () => {};
const wipe = [0.76, 0, 0.24, 1] as const;

/**
 * Hero background slider.
 * Adapted from the Panerai reference: a solid brand-colour panel on the right
 * previews the next slide; advancing wipes the new image in from that edge.
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
  const next = (index + 1) % count;

  const go = useCallback(
    (to: number) => {
      setPrev(index);
      setIndex(((to % count) + count) % count);
    },
    [index, count],
  );

  useEffect(() => {
    if (!playing || hovering) return;
    const t = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(t);
  }, [playing, hovering, index, go]);

  // Scroll-out: the full-bleed frame settles into a floating rounded card on the
  // light page (image counter-zooms inside it for depth) while the headline
  // lines slide apart and the supporting copy lifts away.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries.motion, () => {
        const section = root.current?.closest<HTMLElement>("[data-hero]");
        const frame = root.current;
        if (!section || !frame) return;
        const scrub = { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 };

        gsap.fromTo(
          frame,
          { scale: 1, borderRadius: 0, yPercent: 0 },
          { scale: 0.84, borderRadius: 40, yPercent: 8, ease: "power1.in", scrollTrigger: scrub },
        );
        gsap.fromTo("[data-hero-layer]", { scale: 1 }, { scale: 1.22, ease: "none", scrollTrigger: scrub });

        const q = gsap.utils.selector(section);
        const early = { ...scrub, end: "55% top" };
        gsap.to(q("[data-hero-line='0']"), { xPercent: -14, opacity: 0, ease: "power1.in", scrollTrigger: early });
        gsap.to(q("[data-hero-line='1']"), { xPercent: 14, opacity: 0, ease: "power1.in", scrollTrigger: early });
        gsap.to(q("[data-hero-fade]"), { y: -60, opacity: 0, stagger: 0.04, ease: "power1.in", scrollTrigger: { ...scrub, end: "40% top" } });
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
      className="absolute inset-0 origin-[50%_0%] overflow-hidden shadow-[0_40px_80px_-30px_rgb(11_10_8/0.45)] will-change-transform motion-safe:animate-hero-open"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      {/* Image stack */}
      <div className="absolute inset-0 overflow-hidden bg-green-900">
        <div data-hero-layer className="absolute inset-0 will-change-transform">
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
                  <Image
                    src={slide.image.src}
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
        <div aria-hidden="true" className="absolute inset-0 z-[3] bg-gradient-to-r from-ink-950/70 via-ink-950/30 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 z-[3] bg-gradient-to-t from-ink-950/75 via-transparent to-ink-950/35" />
      </div>

      {/* Next-slide brand panel (Panerai reference) */}
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label={`Next slide: ${slides[next].label}`}
        className="group absolute top-0 right-0 bottom-0 z-[4] hidden w-[min(19vw,320px)] overflow-hidden lg:block"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={slides[next].id}
            className={cn("absolute inset-0 block", toneBg[slides[next].tone])}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%", opacity: 0.6 }}
            transition={{ duration: 1.1, ease: wipe }}
          >
            {mounted && (
              <span className="absolute inset-y-[22%] right-[-30%] left-[28%] block overflow-hidden shadow-lift transition-transform duration-700 ease-out-expo group-hover:-translate-x-4">
                <Image src={slides[next].image.src} alt="" fill sizes="320px" className="object-cover" />
              </span>
            )}
            <span className="absolute top-28 left-6 block text-left">
              <span className="eyebrow block text-ink-950/70">Next</span>
              <span className="mt-2 block font-display text-3xl leading-none text-ink-950">{slides[next].label}</span>
            </span>
            <span className="absolute bottom-28 left-6 grid size-12 place-items-center rounded-full border border-ink-950/40 text-ink-950 transition-colors group-hover:bg-ink-950 group-hover:text-ivory-50">
              <ArrowRight aria-hidden="true" className="size-4" />
            </span>
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 z-[5] lg:right-[min(19vw,320px)]">
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
                    key={`${s.id}-${index}-${playing && !hovering}`}
                    className={cn(
                      "absolute inset-0 origin-left bg-gold-400",
                      i < index && "scale-x-100",
                      i > index && "scale-x-0",
                      i === index && (playing && !hovering ? "animate-[grow_linear_forwards]" : "scale-x-100 opacity-60"),
                    )}
                    style={i === index && playing && !hovering ? { animationDuration: `${DURATION}ms` } : undefined}
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
