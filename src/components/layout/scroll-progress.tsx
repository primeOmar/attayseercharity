"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin gold reading-progress line pinned to the bottom edge (Forge reference). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[3px] origin-left bg-brand-stripe"
    />
  );
}
