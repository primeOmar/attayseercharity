import type { MetadataRoute } from "next";
import { routes } from "@/content/routes";
import { absoluteUrl } from "@/lib/seo";

/**
 * Only finished, indexable pages are listed. Routes flip in automatically as
 * their `ready` flag is set in content/routes.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ready = Object.values(routes).filter((r) => r.ready && r.path !== "/login");
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...ready.map((r) => ({ url: absoluteUrl(r.path), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
