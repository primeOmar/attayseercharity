"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** How often (ms) and for how long (ms) to wait for React to hydrate an element. */
const HYDRATION_POLL = 50;
const HYDRATION_TIMEOUT = 4000;

/**
 * True once React has hydrated (or client-rendered) this DOM node. Until then
 * we must not touch its attributes: React compares them against its own props
 * during hydration and reports any extras as a mismatch. Parts of the page can
 * hydrate after this observer does (Suspense / selective hydration), so this is
 * checked per element.
 */
function isHydrated(el: Element) {
  return Object.keys(el).some((key) => key.startsWith("__reactFiber$"));
}

/**
 * One IntersectionObserver for every `[data-reveal]` element on the page.
 * Sections stay Server Components; they just add `data-reveal` (and optionally
 * `data-reveal-delay="120"`).
 *
 * Fail-safe by design: the hiding styles in globals.css only apply under
 * `html.reveal-ready`, which is added here — once the page's reveal elements
 * have hydrated. If JavaScript is slow, blocked or unsupported (older phones,
 * in-app browsers), the page simply renders fully visible. Anything already on
 * screen when this runs is revealed first, so nothing the visitor can see ever
 * disappears.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    if (!("IntersectionObserver" in window) || !("MutationObserver" in window)) return;
    const root = document.documentElement;
    const timers = new Set<number>();
    const later = (fn: () => void) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        fn();
      }, HYDRATION_POLL);
      timers.add(t);
    };

    const reveal = (el: HTMLElement) => {
      const delay = Number(el.dataset.revealDelay ?? 0);
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.setAttribute("data-revealed", "");
    };

    // Bars start at scaleX(0) — a zero-size box that IntersectionObserver may
    // never report as visible — so we watch the bar's track (its parent) instead.
    const groups = new Map<Element, HTMLElement[]>();
    const tracked = new WeakSet<HTMLElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const el of groups.get(entry.target) ?? []) reveal(el);
          groups.delete(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const track = (el: HTMLElement, waited = 0) => {
      if (tracked.has(el) || el.hasAttribute("data-revealed")) return;
      // Late-streamed server HTML: wait for React to hydrate it first.
      if (!isHydrated(el) && waited < HYDRATION_TIMEOUT) {
        later(() => track(el, waited + HYDRATION_POLL));
        return;
      }
      tracked.add(el);
      const target = el.dataset.reveal === "bar" && el.parentElement ? el.parentElement : el;
      // On screen or already scrolled past → show now; never hide what's visible.
      if (target.getBoundingClientRect().top < window.innerHeight) {
        reveal(el);
        return;
      }
      groups.set(target, [...(groups.get(target) ?? []), el]);
      io.observe(target);
    };

    const scan = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])").forEach((el) => track(el));
    };

    // Streamed / late-mounted content (Suspense, client navigation) gets tracked too,
    // so it can never be left hidden.
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal]")) track(node);
          scan(node);
        });
      }
    });

    // Arm only once the page's reveal elements are hydrated (or we give up
    // waiting); until then everything stays visible, so nothing can flash.
    const start = (waited = 0) => {
      const pending = Array.from(document.querySelectorAll("[data-reveal]")).some((el) => !isHydrated(el));
      if (pending && waited < HYDRATION_TIMEOUT) {
        later(() => start(waited + HYDRATION_POLL));
        return;
      }
      scan(document);
      root.classList.add("reveal-ready");
      mo.observe(document.body, { childList: true, subtree: true });
    };
    start();

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
