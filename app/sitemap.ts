import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owtracker.org";

const staticRoutes = ["", "/heroes", "/compare", "/tier-list", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    const priority = route === "" ? 1 : route === "/heroes" ? 0.9 : 0.7;
    entries.push({
      url: `${siteUrl}/ja${route}`,
      changeFrequency: "weekly",
      priority,
      alternates: {
        languages: {
          en: `${siteUrl}/en${route}`,
          "x-default": `${siteUrl}/ja${route}`,
        },
      },
    });
    entries.push({
      url: `${siteUrl}/en${route}`,
      changeFrequency: "weekly",
      priority: priority * 0.9,
      alternates: {
        languages: {
          ja: `${siteUrl}/ja${route}`,
          "x-default": `${siteUrl}/ja${route}`,
        },
      },
    });
  }

  return entries;
}
