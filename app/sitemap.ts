import type { MetadataRoute } from "next";
import { seoPages } from "@/data/pages";
import { SITE_URL } from "@/lib/site";

const staticPages = ["/about", "/privacy-policy", "/terms", "/contact"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    ...staticPages.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7
    })),
    ...seoPages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.slug === "true-tdee-calculator" ? 0.95 : 0.8
    }))
  ];
}
