import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { routes } from "@/content/routes";
import { causes } from "@/content/home";
import { about } from "@/content/pages";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { ProgrammeHighlights } from "@/components/programmes/programme-highlights";
import { cn, pad2 } from "@/lib/utils";

const route = routes.causes;
export const metadata = routeMetadata(route);

export default function ProgrammesPage() {
  const active = causes.filter((c) => c.active);

  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection
        eyebrow="Supporting people, strengthening communities"
        intro="Our areas of focus address educational, social and economic challenges. Five development priorities guide everything we do."
        tone="light"
      >
        <ol className="space-y-20 lg:space-y-28">
          {active.map((cause, i) => (
            <li key={cause.slug} id={cause.slug} className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
              <div
                data-reveal="image"
                className={cn(
                  "relative isolate aspect-[4/3] overflow-hidden rounded-photo lg:col-span-6",
                  i % 2 === 1 && "lg:order-2",
                )}
              >
                <Image src={cause.image.src} alt={cause.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <div data-reveal className="lg:col-span-6">
                <span className="eyebrow text-red-600 tabular-nums">Priority {pad2(i + 1)}</span>
                <h2 className="mt-4 font-display text-display-sm">{cause.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-ink-700">{cause.description}</p>
                <div className="mt-8">
                  <ProgrammeHighlights cause={cause} />
                </div>
                <Link
                  href={`/causes/${cause.slug}`}
                  className="mt-8 inline-flex items-center gap-2 font-medium underline-offset-4 hover:text-green-700 hover:underline"
                >
                  More about {cause.title.toLowerCase()}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection eyebrow="Our approach" title="How we work." tone="warm">
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {about.approach.map((a, i) => (
            <li key={a.title} data-reveal data-reveal-delay={i * 80} className="border-t border-ink-950/15 py-7">
              <h3 className="font-display text-2xl leading-tight">{a.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-700">{a.body}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageCta title="Partner with us on a programme." />
    </>
  );
}
