"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * One IntersectionObserver for every `[data-reveal]` element on the page.
 * Sections stay Server Components; they just add `data-reveal` (and optionally
 * `data-reveal-delay="120"`).
 *
 * Fail-safe by design: the hiding styles in globals.css only apply under
 * `html.reveal-ready`, which is added here — after React has hydrated. If
 * JavaScript is slow, blocked or unsupported (older phones, in-app browsers),
 * the page simply renders fully visible. Anything already on screen when this
 * runs is revealed first, so nothing the visitor can see ever disappears.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    if (!("IntersectionObserver" in window) || !("MutationObserver" in window)) return;
    const root = document.documentElement;
    const reveal = (el: HTMLElement) => el.setAttribute("data-revealed", "");

    // Bars start at scaleX(0) — a zero-size box that IntersectionObserver may
    // never report as visible — so we watch the bar's track (its parent) instead.
    const groups = new Map<Element, HTMLElement[]>();
    const tracked = new WeakSet<HTMLElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const el of groups.get(entry.target) ?? []) {
            const delay = Number(el.dataset.revealDelay ?? 0);
            if (delay) el.style.transitionDelay = `${delay}ms`;
            reveal(el);
          }
          groups.delete(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const track = (el: HTMLElement) => {
      if (tracked.has(el) || el.hasAttribute("data-revealed")) return;
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
      scope.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])").forEach(track);
    };

    scan(document);
    root.classList.add("reveal-ready");

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
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
