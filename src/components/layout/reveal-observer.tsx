"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for every `[data-reveal]` element on the page.
 * Sections stay Server Components; they just add `data-reveal` (and optionally
 * `data-reveal-delay="120"`). Styles live in globals.css and only apply once
 * the `js` class is on <html>, so content is always visible without JS.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    // Bars start at scaleX(0) — a zero-size box that IntersectionObserver may
    // never report as visible — so we watch the bar's track (its parent) instead.
    const targets = new Map<Element, HTMLElement[]>();
    els.forEach((el) => {
      const target = el.dataset.reveal === "bar" && el.parentElement ? el.parentElement : el;
      targets.set(target, [...(targets.get(target) ?? []), el]);
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const el of targets.get(entry.target) ?? []) {
            const delay = Number(el.dataset.revealDelay ?? 0);
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.setAttribute("data-revealed", "");
          }
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    targets.forEach((_, target) => io.observe(target));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
