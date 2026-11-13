import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ImageAsset } from "@/types/content";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
  image?: ImageAsset;
  /** Which development phase delivers the full page. */
  phase: string;
  children?: React.ReactNode;
}

/**
 * Interim page shell so navigation never dead-ends while later phases are
 * built. Pages using this are marked noindex via their metadata.
 */
export function PagePlaceholder({ eyebrow, title, description, path, image, phase, children }: Props) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: eyebrow, path },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section data-surface="dark" className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink-950 pt-32 pb-16 sm:pb-24">
        {image && (
          <>
            <Image src={image.src} alt={image.alt} fill sizes="100vw" loading="eager" fetchPriority="high" className="-z-10 object-cover opacity-50" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/40" />
          </>
        )}
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-ink-300">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight aria-hidden="true" className="size-3.5" />}
                  {i < crumbs.length - 1 ? (
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
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory-100/85">{description}</p>
          <p className="mt-8 inline-flex rounded-pill border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm text-gold-300">
            Full page arrives in {phase}.
          </p>
        </div>
      </section>
      {children}
      <section data-surface="dark" className="bg-ink-900 py-20">
        <div className="container-site flex flex-wrap items-center justify-between gap-6">
          <p className="font-display text-display-sm text-ivory-50">Ready to help today?</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/donate">Donate now</ButtonLink>
            <ButtonLink href="/" variant="outline" arrow={false}>
              Back to home
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
