"use client";

import { useEffect } from "react";

const PULL = 0.28; // fraction of the cursor offset the button follows
const MAX = 14; // px

/**
 * One delegated listener for every `[data-magnetic]` element: the button drifts
 * toward the cursor while hovered and springs back on leave. Only for fine
 * pointers with motion allowed; buttons stay plain everywhere else.
 */
export function MagneticButtons() {
  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!ok.matches) return;

    let active: HTMLElement | null = null;

    const settle = (el: HTMLElement) => {
      el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "";
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (active && active !== el) settle(active);
      active = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width / 2)) * PULL));
      const dy = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top + r.height / 2)) * PULL));
      el.style.transition = "transform 0.15s ease-out";
      el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    };

    const onLeave = () => {
      if (active) settle(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (active) settle(active);
    };
  }, []);

  return null;
}
