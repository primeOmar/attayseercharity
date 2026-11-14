"use client";

/**
 * Single GSAP entry point. Import gsap/ScrollTrigger/useGSAP from here so the
 * plugins are registered exactly once and tree-shaking stays predictable.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
  // Mobile browsers resize the viewport as the address bar shows/hides; don't
  // recalculate (and jump) every scrubbed animation when that happens.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Media queries shared by every gsap.matchMedia() block. */
export const motionQueries = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktopMotion: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
