"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ImageAsset } from "@/types/content";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

/**
 * "Photography strip": rows of collage photos on a transparent ground that
 * drift in alternating directions as the strip passes through the viewport.
 * Decorative (aria-hidden, empty alt); static for reduced-motion users.
 */
export function PhotoStrip({ photos, rows = 2, className }: { photos: ImageAsset[]; rows?: 1 | 2; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["-4%", "-18%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-18%", "-4%"]);

  const half = Math.ceil(photos.length / 2);
  const lines = rows === 2 ? [photos.slice(0, half), photos.slice(half)] : [photos];

  return (
    <div ref={ref} aria-hidden="true" className={cn("overflow-x-clip py-10 sm:py-14", className)}>
      <div className="flex flex-col gap-4 sm:gap-6">
        {lines.map((line, r) => (
          <motion.ul
            key={r}
            style={reduce ? undefined : { x: r % 2 === 0 ? forward : backward }}
            className="flex w-max gap-4 sm:gap-6"
          >
            {/* Repeat so the row stays filled while it drifts. */}
            {[...line, ...line, ...line].map((img, i) => (
              <li
                key={`${img.src}-${i}`}
                className={cn(
                  "relative h-36 shrink-0 overflow-hidden rounded-photo-sm sm:h-48 lg:h-56",
                  i % 3 === 1 ? "w-48 sm:w-64 lg:w-80" : "w-32 sm:w-44 lg:w-52",
                )}
              >
                <Photo image={img} alt="" fill sizes="(min-width: 1024px) 20rem, 16rem" className="object-cover" />
              </li>
            ))}
          </motion.ul>
        ))}
      </div>
    </div>
  );
}
