import { hero } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/primitives";
import { HeroMedia } from "./hero-media";

/**
 * Hero. Headline + CTAs are server-rendered and animated with pure CSS so they
 * paint immediately (good LCP, crawlable, no hydration dependency).
 *
 * Motion (see HeroMedia):
 *  - on load, the photo frame opens from a rounded card to full bleed;
 *  - on scroll, it settles back into a floating rounded card on the light page
 *    while the headline lines slide apart and the copy lifts away.
 */
export function Hero() {
  return (
    <section
      data-hero
      data-surface="dark"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-ivory-50"
    >
      <HeroMedia slides={hero.slides} />

      <div
        data-hero-content
        className="relative z-[6] container-site flex flex-col justify-end pt-32 pb-44 sm:pb-48 lg:pr-[calc(min(19vw,320px)+var(--spacing-gutter))]"
      >
        <p
          data-hero-fade
          className="eyebrow flex items-center gap-3 text-gold-300 motion-safe:animate-fade-up"
          style={{ animationDelay: "650ms" }}
        >
          <Sparkle className="size-4" />
          {hero.eyebrow}
        </p>

        <h1 id="hero-title" className="mt-6 font-display text-display-xl text-ivory-50 [text-shadow:0_2px_30px_rgb(11_10_8/0.35)]">
          {hero.title.map((line, i) => (
            <span key={line} className="line-mask">
              <span
                data-hero-line={i}
                className={
                  i === 1
                    ? "inline-block pr-[0.08em] italic text-gold-metal [text-shadow:none] motion-safe:animate-line-up"
                    : "block motion-safe:animate-line-up"
                }
                style={{ animationDelay: `${750 + i * 120}ms` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero-fade
          className="mt-8 max-w-xl text-base leading-relaxed text-ivory-50/90 motion-safe:animate-fade-up sm:text-lg"
          style={{ animationDelay: "1000ms" }}
        >
          {hero.lede}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-fade-up" style={{ animationDelay: "1150ms" }}>
          <ButtonLink href="/donate" size="lg">
            Donate now
          </ButtonLink>
          <ButtonLink href="#impact" variant="outline" size="lg" arrow={false}>
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
    </section>
  );
}
