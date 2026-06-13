import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ow-tracker.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/ja`,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { en: `${siteUrl}/en`, "x-default": `${siteUrl}/ja` } },
    },
    {
      url: `${siteUrl}/en`,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: { ja: `${siteUrl}/ja`, "x-default": `${siteUrl}/ja` } },
    },
  ];
}
