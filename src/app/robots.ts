import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private / transactional areas never belong in search results.
      disallow: ["/dashboard", "/account", "/login", "/register", "/forgot-password", "/reset-password", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
