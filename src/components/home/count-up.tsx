"use client";

import { useEffect, useRef } from "react";
import { formatNumber } from "@/lib/utils";

/**
 * Odometer-style counter: each digit is a 0–9 reel (drawn in CSS, see
 * `.digit-reel` in globals.css) that flips to its value.
 *
 * - Server-rendered at the final value, so it is correct without JS.
 * - Screen readers and crawlers get the plain number; the reels are aria-hidden.
 * - If the number starts off-screen (and motion is allowed), the reels are
 *   reset to 0 and spin up — staggered right-to-left — when it scrolls into view.
 */
export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = formatNumber(value);

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (root.getBoundingClientRect().top < window.innerHeight) return; // already visible: leave as is

    const reels = Array.from(root.querySelectorAll<HTMLElement>(".digit-reel"));
    // Targets come from the value, never from the DOM: the DOM may already hold
    // the reset zeros (e.g. effects re-run in Strict Mode or after a cleanup).
    const finals = [...formatNumber(value)].filter((ch) => /\d/.test(ch));
    const restore = () =>
      reels.forEach((r, i) => {
        r.removeAttribute("data-spin");
        r.firstElementChild?.removeAttribute("style");
        r.style.setProperty("--d", finals[i] ?? "0");
      });
    reels.forEach((r) => r.style.setProperty("--d", "0"));
    let frame = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Next frame so the reset position is painted before the transition starts.
        frame = requestAnimationFrame(() => {
          reels.forEach((r, i) => {
            r.setAttribute("data-spin", "");
            r.firstElementChild?.setAttribute("style", `transition-delay:${(reels.length - 1 - i) * 90}ms`);
            r.style.setProperty("--d", finals[i]);
          });
        });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(root);
    // Always leave the real number showing if the effect is torn down mid-way.
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      restore();
    };
  }, [value]);

  return (
    <span ref={ref} className="inline-flex tabular-nums">
      <span className="sr-only">
        {prefix}
        {text}
        {suffix}
      </span>
      <span aria-hidden="true" className="inline-flex">
        {prefix}
        {[...text].map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="digit-reel" style={{ "--d": ch } as React.CSSProperties}>
              <span />
            </span>
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
        {suffix}
      </span>
    </span>
  );
}
