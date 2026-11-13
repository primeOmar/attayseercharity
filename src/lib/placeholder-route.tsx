import type { Metadata } from "next";
import type { RouteEntry } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

/** Builds metadata + page component for a not-yet-built route. */
export function placeholderRoute(route: RouteEntry) {
  const metadata: Metadata = pageMetadata({
    title: route.eyebrow,
    description: route.description,
    path: route.path,
    image: route.image,
    noIndex: !route.ready,
  });

  function Page() {
    return (
      <PagePlaceholder
        eyebrow={route.eyebrow}
        title={route.title}
        description={route.description}
        path={route.path}
        image={route.image}
        phase={route.phase}
      />
    );
  }

  return { metadata, Page };
}
