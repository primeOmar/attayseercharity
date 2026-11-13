"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

let instance: Lenis | null = null;

/** Lock / unlock page scrolling (used by the menu overlay). Works with or without Lenis. */
export function setScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) instance?.stop();
  else instance?.start();
}

/** Glide to a document scroll position (Lenis when active, native otherwise). */
export function scrollToPosition(top: number) {
  if (instance) {
    instance.scrollTo(top, { duration: 1.2, force: true });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/** Glide to an element (Lenis when active, native smooth scroll otherwise). */
export function scrollToElement(el: HTMLElement, offset = 0) {
  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.2, force: true });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduce ? "auto" : "smooth" });
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Skipped entirely for reduced-motion users and coarse pointers (touch devices
 * already have excellent native momentum scrolling) — and the libraries are
 * code-split, so phones never download Lenis or GSAP from the shared layout.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    Promise.all([import("lenis"), import("@/lib/animation/gsap"), import("@/lib/animation/section-snap")]).then(
      ([{ default: LenisCtor }, { gsap, ScrollTrigger }, { attachSectionSnap }]) => {
        if (cancelled) return;
        cleanup = start(LenisCtor, gsap, ScrollTrigger, attachSectionSnap);
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}

type Gsap = typeof import("@/lib/animation/gsap");

function start(
  LenisCtor: typeof Lenis,
  gsap: Gsap["gsap"],
  ScrollTrigger: Gsap["ScrollTrigger"],
  attachSectionSnap: typeof import("@/lib/animation/section-snap").attachSectionSnap,
) {
  const lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1 });
  instance = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  // Wheel gestures glide section-to-section on pages that mark [data-snap].
  const detachSnap = attachSectionSnap(lenis);

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // In-page anchor links should glide too.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector<HTMLElement>(id);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -80 });
    el.focus({ preventScroll: true });
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    detachSnap();
    gsap.ticker.remove(tick);
    lenis.destroy();
    instance = null;
  };
}
