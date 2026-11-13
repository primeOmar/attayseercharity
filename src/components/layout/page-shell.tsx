import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import type { ImageAsset } from "@/types/content";
import type { RouteEntry } from "@/content/routes";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

/** Metadata for a finished route registered in content/routes.ts. */
export function routeMetadata(route: RouteEntry): Metadata {
  return pageMetadata({
    title: route.eyebrow,
    description: route.description,
    path: route.path,
    image: route.image,
    noIndex: !route.ready,
  });
}

/** Dark, photo-backed page opener with breadcrumbs. */
export function PageHeader({
  eyebrow,
  title,
  description,
  path,
  image,
  crumbs,
  tall = false,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  path: string;
  image?: ImageAsset;
  /** Defaults to Home › eyebrow. */
  crumbs?: Crumb[];
  tall?: boolean;
  children?: ReactNode;
}) {
  const trail = crumbs ?? [
    { name: "Home", path: "/" },
    { name: eyebrow, path },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <section
        data-surface="dark"
        className={cn(
          "relative isolate flex items-end overflow-hidden bg-ink-950 pt-32 pb-16 sm:pb-20",
          tall ? "min-h-[78svh]" : "min-h-[60svh]",
        )}
      >
        {image && (
          <>
            <Image src={image.src} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="-z-10 object-cover opacity-45" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/40" />
          </>
        )}
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-300">
              {trail.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight aria-hidden="true" className="size-3.5" />}
                  {i < trail.length - 1 ? (
                    <Link href={c.path} className="hover:text-gold-400">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ivory-100">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-8 max-w-4xl font-display text-display-lg text-ivory-50 motion-safe:animate-fade-up">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory-100/85">{description}</p>}
          {children}
        </div>
      </section>
    </>
  );
}

const sectionTones = {
  light: "bg-ivory-50 text-ink-950",
  warm: "bg-ivory-100 text-ink-950",
  sand: "bg-ivory-200 text-ink-950",
  dark: "bg-ink-950 text-ivory-50",
} as const;

/** Standard content section with an optional eyebrow/title/intro header. */
export function PageSection({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  tone?: keyof typeof sectionTones;
  className?: string;
  children?: ReactNode;
}) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? titleId : undefined}
      data-surface={tone === "dark" ? "dark" : undefined}
      className={cn("scroll-mt-24 py-[calc(var(--spacing-section)*0.7)]", sectionTones[tone], className)}
    >
      <div className="container-site">
        {(eyebrow || title || intro) && (
          <header className="mb-12 max-w-3xl lg:mb-16">
            {eyebrow && <Eyebrow tone={tone === "dark" ? "gold" : "green"}>{eyebrow}</Eyebrow>}
            {title && (
              <h2 id={titleId} data-reveal className="mt-6 font-display text-display-md">
                {title}
              </h2>
            )}
            {intro && (
              <div data-reveal className={cn("mt-6 text-lg leading-relaxed", tone === "dark" ? "text-ivory-100/80" : "text-ink-700")}>
                {intro}
              </div>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

/** Closing call to action shared by inner pages. */
export function PageCta({
  title = "Want to be part of this work?",
  body = "Volunteer, partner with us, or contact the foundation about current needs and approved support arrangements.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section data-surface="dark" className="bg-ink-900 py-20">
      <div className="container-site flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-display-sm text-ivory-50">{title}</p>
          <p className="mt-4 leading-relaxed text-ivory-100/75">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/volunteer">Get involved</ButtonLink>
          <ButtonLink href="/contact" variant="outline" arrow={false}>
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
