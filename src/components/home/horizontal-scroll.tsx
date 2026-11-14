"use client";

import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { scrollToPosition } from "@/components/layout/smooth-scroll";

const PINNED_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Horizontal scroll section.
 * - Desktop (motion allowed): the section pins and vertical scrolling slides
 *   the track sideways, 1px for 1px.
 * - Phones/tablets: a plain vertical stack.
 * - Desktop with reduced motion (and before hydration): a native horizontal
 *   scroller with snap points — no hijacking.
 * Keyboard: focusing an item scrolls the page so that item is slid into view.
 */
export function HorizontalScroll({ label, children }: { label: string; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(PINNED_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned || !track.current || !viewport.current) return;
    const measure = () => {
      if (!track.current || !viewport.current) return;
      setTravel(Math.max(0, track.current.scrollWidth - viewport.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    ro.observe(viewport.current);
    return () => ro.disconnect();
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * travel);

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (!pinned || !outer.current || !track.current || travel === 0) return;
    const item = (e.target as HTMLElement).closest<HTMLElement>("[data-hitem]");
    if (!item) return;
    const target = Math.min(travel, Math.max(0, item.offsetLeft - track.current.offsetLeft - 32));
    const top = outer.current.getBoundingClientRect().top + window.scrollY + target;
    scrollToPosition(top);
  };

  return (
    <div
      ref={outer}
      role="region"
      aria-label={label}
      className="relative"
      style={pinned && travel > 0 ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div
        ref={viewport}
        className={cn(pinned ? "sticky top-0 flex h-svh items-center overflow-hidden" : "lg:overflow-x-auto lg:snap-x lg:snap-mandatory lg:pb-6")}
      >
        <motion.div
          ref={track}
          onFocusCapture={onFocus}
          style={pinned ? { x } : undefined}
          className={cn(
            "flex flex-col gap-6 px-[var(--spacing-gutter)] lg:w-max lg:flex-row lg:items-stretch",
            // Align the first item with the site container on wide screens.
            "lg:pl-[max(var(--spacing-gutter),calc((100vw-var(--container-site))/2+var(--spacing-gutter)))]",
            pinned && "will-change-transform",
          )}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/** One slide in a HorizontalScroll track. */
export function HorizontalItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-hitem className={cn("shrink-0 lg:w-[min(38vw,34rem)] lg:snap-start", className)}>
      {children}
    </div>
  );
}
