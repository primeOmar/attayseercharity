import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { stories } from "@/content/home";
import { Eyebrow, SampleBadge, SplitLines } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

export function ImpactStories() {
  const [feature, ...rest] = stories;
  const unverified = stories.some((s) => !s.verified);

  return (
    <section aria-labelledby="stories-title" className="bg-ivory-50 py-[var(--spacing-section)] text-ink-950">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow tone="green">Activities & impact</Eyebrow>
            <h2 id="stories-title" data-reveal="lines" className="mt-6 font-display text-display-md">
              <SplitLines lines={["Recent work", "in the field."]} italicLast accent="green" />
            </h2>
          </div>
          <div data-reveal className="flex flex-col items-start gap-5 lg:items-end">
            {unverified && <SampleBadge tone="light">Illustrative stories — to be replaced with verified reporting</SampleBadge>}
            <ButtonLink href="/news" variant="ghost-dark" size="sm">
              All stories
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Feature story */}
          <article className="group relative lg:col-span-7">
            <div data-reveal="image" className="relative isolate aspect-[4/3] overflow-hidden rounded-photo">
              <Image
                src={feature.image.src}
                alt={feature.image.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105"
              />
            </div>
            <div data-reveal className="mt-7 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="eyebrow text-green-700">{feature.category}</p>
                <h3 className="mt-3 font-display text-[clamp(2rem,1.5rem+1.8vw,3.25rem)] leading-[1.02]">
                  <Link href="/news" className="after:absolute after:inset-0 after:content-['']">
                    {feature.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-xl leading-relaxed text-ink-700">{feature.excerpt}</p>
              </div>
              <span className="flex items-center gap-2 text-sm text-ink-500">
                {feature.date ? (
                  <>
                    <CalendarDays aria-hidden="true" className="size-4" /> {feature.date}
                  </>
                ) : (
                  <>
                    <Clock aria-hidden="true" className="size-4" /> {feature.readingMinutes} min read
                  </>
                )}
              </span>
            </div>
          </article>

          {/* Secondary stories */}
          <ol className="flex flex-col divide-y divide-ink-950/10 border-y border-ink-950/10 lg:col-span-5">
            {rest.map((story, i) => (
              <li key={story.slug} data-reveal data-reveal-delay={i * 90}>
                <article className="group relative grid grid-cols-[7.5rem_1fr] gap-5 py-6 sm:grid-cols-[10rem_1fr]">
                  <div className="relative isolate aspect-[4/5] overflow-hidden rounded-photo-sm">
                    <Image
                      src={story.image.src}
                      alt={story.image.alt}
                      fill
                      sizes="10rem"
                      className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="eyebrow text-green-700">{story.category}</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight sm:text-[1.75rem]">
                      <Link href="/news" className="after:absolute after:inset-0 after:content-['']">
                        {story.title}
                      </Link>
                    </h3>
                    <p className="mt-2 hidden text-sm leading-relaxed text-ink-700 sm:block">{story.excerpt}</p>
                    <span className="mt-auto flex items-center gap-2 pt-3 text-sm font-medium text-ink-950">
                      Read story
                      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
