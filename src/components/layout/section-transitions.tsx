"use client";

import { gsap, motionQueries, ScrollTrigger, useGSAP } from "@/lib/animation/gsap";

/**
 * Scroll-scrubbed hand-off between [data-snap] sections (all sizes, motion allowed):
 *  - the incoming section opens out from a rounded, inset "card" to full bleed;
 *  - the outgoing section fades back under a light veil as it leaves.
 * Phones get a tighter inset and radius so the card reads at small widths.
 * Uses clip-path and opacity only — never transforms on the wrappers — so
 * ScrollTrigger pins and CSS sticky stages inside them keep working.
 */
export function SectionTransitions() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({ desktop: "(min-width: 1024px)", motion: motionQueries.motion }, (ctx) => {
      const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;
      const card = desktop ? "inset(7% 4% 0% 4% round 2.5rem)" : "inset(4% 3% 0% 3% round 1.5rem)";
      const sections = gsap.utils.toArray<HTMLElement>("[data-snap]");

      sections.forEach((section, i) => {
        if (i > 0) {
          gsap.fromTo(
            section,
            { clipPath: card },
            {
              clipPath: "inset(0% 0% 0% 0% round 0rem)",
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: desktop ? "top 15%" : "top 25%", scrub: true },
            },
          );
        }

        const veil = section.querySelector<HTMLElement>(":scope > [data-snap-veil]");
        if (veil && i < sections.length - 1) {
          gsap.fromTo(
            veil,
            { opacity: 0 },
            {
              opacity: 0.55,
              ease: "none",
              scrollTrigger: { trigger: section, start: "bottom 30%", end: "bottom top", scrub: true },
            },
          );
        }
      });

      // Section heights change as images load; keep trigger positions honest.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("load", refresh);
        gsap.set(sections, { clearProps: "clipPath" });
      };
    });

    return () => mm.revert();
  });

  return null;
}
