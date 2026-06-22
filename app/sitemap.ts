import type { MetadataRoute } from "next";
import { seoPages } from "@/data/pages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://truetdee.com";
const staticPages = ["/about", "/privacy-policy", "/terms"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    ...staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7
    })),
    ...seoPages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.slug === "true-tdee-calculator" ? 0.95 : 0.8
    }))
  ];
}
