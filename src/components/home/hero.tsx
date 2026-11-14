import { Fragment } from "react";
import { hero } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { HeroMedia } from "./hero-media";

/** Delay (ms) before the first headline word rises, as the frame finishes unveiling. */
const WORD_START = 900;
const WORD_STEP = 85;

/**
 * Hero. Headline + CTAs are server-rendered and animated with pure CSS so they
 * paint immediately (good LCP, crawlable, no hydration dependency).
 *
 * Layout — asymmetric 12-col: copy holds cols 1–7 over a full-bleed photo.
 *
 * Motion:
 *  - load: the photo unveils from a rounded inner card to full bleed, then
 *    every headline word rises out of its own mask, staggered;
 *  - scroll: the photo settles back into a floating card, the headline lines
 *    split apart in opposite directions and the copy lifts away (HeroMedia).
 */
export function Hero() {
  let wordIndex = 0;

  return (
    <section
      data-hero
      data-surface="dark"
      aria-labelledby="hero-title"
      // overflow-x only: the floating card may trail below the fold (under Mission
      // as it opens), while the split headline lines stay clipped sideways.
      className="relative isolate flex min-h-[100svh] overflow-x-clip bg-green-950 bg-green-deep"
    >
      <HeroMedia slides={hero.slides} />

      <div data-hero-content className="relative z-[6] container-site grid grid-cols-1 pt-32 pb-44 sm:pb-48 lg:grid-cols-12 lg:pb-32">
        <div data-hero-column className="flex flex-col justify-end lg:col-span-7 lg:pr-10">
          <p
            data-hero-fade
            className="eyebrow flex items-center gap-3 text-gold-300 motion-safe:animate-fade-up"
            style={{ animationDelay: "450ms" }}
          >
            <Sparkle className="size-4" />
            {hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(3rem,1.4rem+6.6vw,8rem)] leading-[0.95] text-ivory-50 [text-shadow:0_2px_30px_rgb(11_10_8/0.35)] lg:text-[clamp(3.5rem,0.8rem+4.6vw,7rem)]"
          >
            {hero.title.map((line, li) => {
              const accent = li === hero.title.length - 1;
              const words = line.split(" ");
              return (
                // One block per line so the scroll can split the lines apart.
                // The space between lines keeps the accessible name "…opportunities, transforming…".
                <Fragment key={line}>
                {li > 0 && " "}
                <span data-hero-line={li} className="block">
                  {words.map((word, wi) => {
                    const delay = WORD_START + wordIndex++ * WORD_STEP;
                    return (
                      <Fragment key={`${word}-${wi}`}>
                        {/* Each word rises out of its own mask. */}
                        <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                          <span
                            data-hero-word
                            className={cn(
                              "inline-block motion-safe:animate-line-up",
                              accent && "pr-[0.06em] italic text-gold-metal [text-shadow:none]",
                            )}
                            style={{ animationDelay: `${delay}ms` }}
                          >
                            {word}
                          </span>
                        </span>
                        {wi < words.length - 1 && " "}
                      </Fragment>
                    );
                  })}
                </span>
                </Fragment>
              );
            })}
          </h1>

          <p
            data-hero-fade
            className="mt-8 max-w-xl text-base leading-relaxed text-ivory-50/90 motion-safe:animate-fade-up sm:text-lg"
            style={{ animationDelay: `${WORD_START + wordIndex * WORD_STEP + 100}ms` }}
          >
            {hero.lede}
          </p>

          <div
            data-hero-fade
            className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-fade-up"
            style={{ animationDelay: `${WORD_START + wordIndex * WORD_STEP + 250}ms` }}
          >
            <ButtonLink href="/donate" size="lg" magnetic>
              Donate now
            </ButtonLink>
            <ButtonLink href="#impact" variant="outline" size="lg" arrow={false} magnetic>
              Explore our impact
            </ButtonLink>
            <a
              href="#mission"
              className="group ml-2 hidden items-center gap-3 text-[0.75rem] font-medium tracking-[0.2em] text-ivory-50/85 uppercase transition-colors hover:text-gold-300 md:inline-flex"
            >
              <span aria-hidden="true" className="relative block h-9 w-px overflow-hidden bg-ivory-50/25">
                <span className="absolute inset-0 block bg-gold-300 motion-safe:animate-scroll-cue" />
              </span>
              Scroll to explore
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
