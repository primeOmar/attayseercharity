import { Photo } from "@/components/ui/photo";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { routes } from "@/content/routes";
import { stories } from "@/content/home";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";

const route = routes.news;
export const metadata = routeMetadata(route);

export default function NewsPage() {
  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection eyebrow="Latest updates" tone="light">
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <li key={s.slug} data-reveal data-reveal-delay={i * 90}>
              <article className="group relative flex h-full flex-col">
                <div className="relative isolate aspect-[4/3] overflow-hidden rounded-photo">
                  <Photo
                    image={s.image}
                    alt={s.image.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                  />
                </div>
                <p className="eyebrow mt-6 text-green-700">{s.category}</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">
                  <Link href={`/impact#${s.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {s.title}
                  </Link>
                </h2>
                <p className="mt-3 leading-relaxed text-ink-700">{s.excerpt}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
                  <span className="flex items-center gap-2 text-ink-500">
                    {s.date && (
                      <>
                        <CalendarDays aria-hidden="true" className="size-4" /> {s.date}
                      </>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    Full report
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageCta />
    </>
  );
}
