"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { formatNumber } from "@/lib/utils";

/**
 * Server renders the final value (crawlable, correct without JS).
 * On the client, if the number hasn't been seen yet, it resets to 0 and counts
 * up when it scrolls into view. Reduced-motion users just see the value.
 */
export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const armed = useRef(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = el.getBoundingClientRect();
    const offscreen = rect.top > window.innerHeight;
    if (!reduce && offscreen) {
      el.textContent = `${prefix}0${suffix}`;
      armed.current = true;
    }
  }, [prefix, suffix]);

  useEffect(() => {
    if (!inView || !armed.current || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${formatNumber(Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatNumber(value)}
      {suffix}
    </span>
  );
}
