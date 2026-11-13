"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { mission } from "@/content/home";
import { collage } from "@/content/images";
import { cn } from "@/lib/utils";
import { gsap, motionQueries, useGSAP } from "@/lib/animation/gsap";

/** Final resting positions of the collage (percent of the stage). */
// `m*` = phone/tablet placement (only tiles 0–2 show there): kept clear of the
// centred headline — two above it, one below.
const positions: { left: string; top: string; mLeft?: string; mTop?: string; w: string; speed: number; desktopOnly?: boolean }[] = [
  { left: "6%", top: "10%", mLeft: "6%", mTop: "5%", w: "w-[24vw] md:w-[16vw] lg:w-[12vw]", speed: 1.2 },
  { left: "20%", top: "64%", mLeft: "58%", mTop: "76%", w: "w-[24vw] md:w-[14vw] lg:w-[10vw]", speed: 0.7 },
  { left: "68%", top: "8%", mLeft: "62%", mTop: "8%", w: "w-[28vw] md:w-[18vw] lg:w-[15vw]", speed: 1 },
  { left: "82%", top: "48%", w: "w-[11vw]", speed: 1.4, desktopOnly: true },
  { left: "3%", top: "44%", w: "w-[13vw]", speed: 0.9, desktopOnly: true },
  { left: "60%", top: "70%", w: "w-[9vw]", speed: 1.3, desktopOnly: true },
  { left: "32%", top: "4%", w: "w-[11vw]", speed: 0.8, desktopOnly: true },
  { left: "74%", top: "80%", w: "w-[12vw]", speed: 1.1, desktopOnly: true },
];

/**
 * Mission — Forge reference adaptations:
 *  1. Pinned stage: photos burst outward from behind the headline as you scroll.
 *  2. Mission statement whose words brighten from grey to ivory with scroll.
 * Without JS / with reduced motion everything renders in its final state.
 */
export function Mission() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionQueries.desktopMotion, () => {
        const stage = root.current!.querySelector<HTMLElement>("[data-stage]")!;
        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=130%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Headline rises as the stage enters, before the pin begins.
        gsap.from("[data-stage-line]", {
          yPercent: 110,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: stage, start: "top 70%", toggleActions: "play none none reverse" },
        });

        // One wheel gesture plays the whole collage burst (see section-snap).
        const section = root.current!;
        section.dataset.snapStops = "1.3";

        tiles.forEach((tile, i) => {
          // offset* ignores transforms, so values stay correct across refreshes.
          const fromCenter = () => ({
            x: stage.clientWidth / 2 - (tile.offsetLeft + tile.offsetWidth / 2),
            y: stage.clientHeight / 2 - (tile.offsetTop + tile.offsetHeight / 2),
          });
          tl.from(
            tile,
            {
              x: () => fromCenter().x,
              y: () => fromCenter().y,
              scale: 0.35,
              rotate: (i % 2 ? 1 : -1) * 8,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            0.05 + i * 0.03,
          );
          const speed = Number(tile.dataset.speed ?? 1);
          // Drift upward and recede so the headline stays legible.
          tl.to(tile, { y: `-=${120 * speed}`, opacity: 0.3, duration: 0.5 }, 0.75);
        });

        return () => {
          delete section.dataset.snapStops;
        };
      });

      mm.add(motionQueries.motion, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-word]");
        gsap.fromTo(
          words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-statement]",
              start: "top 80%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const words = mission.statement.split(" ");

  return (
    <section ref={root} id="mission" aria-labelledby="mission-title" className="relative bg-ivory-50 text-ink-950">
      {/* 1 — Collage stage */}
      <div data-stage className="relative flex h-[100svh] min-h-[38rem] items-center justify-center overflow-hidden">
        {collage.map((img, i) => {
          const p = positions[i];
          return (
            <div
              key={img.src}
              data-tile
              data-speed={p.speed}
              className={cn(
                "absolute z-0 overflow-hidden rounded-photo-sm shadow-lift will-change-transform",
                "top-[var(--mt)] left-[var(--ml)] lg:top-[var(--t)] lg:left-[var(--l)]",
                p.w,
                p.desktopOnly && "hidden lg:block",
              )}
              style={
                {
                  "--l": p.left,
                  "--t": p.top,
                  "--ml": p.mLeft ?? p.left,
                  "--mt": p.mTop ?? p.top,
                } as CSSProperties
              }
            >
              <Image
                src={img.src}
                alt=""
                width={img.width}
                height={img.height}
                sizes="(min-width: 768px) 15vw, 30vw"
                className="h-auto w-full object-cover"
              />
            </div>
          );
        })}

        <div className="pointer-events-none relative z-20 container-site text-center">
          <p className="eyebrow mb-6 inline-flex items-center gap-3 text-green-700">
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            {mission.eyebrow}
            <span aria-hidden="true" className="h-px w-8 bg-current" />
          </p>
          <h2 id="mission-title" className="font-display text-display-lg text-ink-950 [text-shadow:0_2px_30px_rgb(251_248_242/0.95)]">
            {mission.headline.map((line, i) => (
              <span key={line} className="line-mask">
                <span data-stage-line className={cn(i === 1 ? "inline-block pr-[0.08em] italic text-green-metal [text-shadow:none]" : "block")}>
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* 2 — Statement with scroll-scrubbed brightness */}
      <div className="container-site grid gap-12 pt-16 pb-[var(--spacing-section)] lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-3">
          <p className="eyebrow text-ink-500">What we believe</p>
        </div>
        <div className="lg:col-span-9">
          <p data-statement className="font-display text-display-sm text-ink-950">
            {words.map((w, i) => (
              <span key={`${w}-${i}`} data-word>
                {w}{" "}
              </span>
            ))}
          </p>
          <Link
            href="/about"
            className="group mt-12 inline-flex items-center gap-3 border-b border-ink-950/30 pb-2 text-sm font-medium tracking-wide text-ink-950 transition-colors hover:border-green-700 hover:text-green-700"
          >
            Read our story
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
