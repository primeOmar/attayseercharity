import type { Metadata } from "next";
import { site } from "@/content/site";

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string };
  /** Keep work-in-progress or private screens out of the index. */
  noIndex?: boolean;
  type?: "website" | "article";
}

/** Consistent per-page metadata: canonical, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, image, noIndex, type = "website" }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: site.name,
      locale: site.locale,
      ...(image && { images: [{ url: image.src, alt: image.alt }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image.src] }),
    },
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}

/**
 * Organization / NGO structured data.
 * Only includes facts present in site config — empty fields are omitted so
 * we never publish claims that haven't been verified.
 */
export function organizationJsonLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${absoluteUrl("/")}#organization`,
    name: site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(site.logo.emblem.src),
    alternateName: site.nameArabic,
    description: site.description,
    areaServed: ["Kenya", "East Africa"],
    // Contact details are only published once confirmed (not placeholders).
    ...((site.isPlaceholder as boolean) ? {} : { email: site.contact.email }),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: site.name,
    url: absoluteUrl("/"),
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Serialise JSON-LD safely (escapes `<` to prevent script injection). */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
