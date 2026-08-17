import type { MetadataRoute } from "next";
import { getHeroes } from "@/lib/api";

const BASE = "https://owtracker.org";

export const revalidate = 86400; // 1 day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const heroes = await getHeroes("en").catch(() => []);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/ja`,                             priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE}/en`,                             priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE}/ja/heroes`,                      priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/en/heroes`,                      priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/ja/tier-list`,                   priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/en/tier-list`,                   priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/ja/meta`,                        priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/en/meta`,                        priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/ja/counters`,                    priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/en/counters`,                    priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/ja/maps`,                        priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/en/maps`,                        priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/ja/stats/rank-distribution`,     priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/en/stats/rank-distribution`,     priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/ja/compare`,                     priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/en/compare`,                     priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/ja/about`,                       priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/en/about`,                       priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/ja/privacy`,                     priority: 0.3, changeFrequency: "monthly" },
    { url: `${BASE}/en/privacy`,                     priority: 0.3, changeFrequency: "monthly" },
    { url: `${BASE}/ja/contact`,                     priority: 0.3, changeFrequency: "monthly" },
    { url: `${BASE}/en/contact`,                     priority: 0.3, changeFrequency: "monthly" },
  ];

  const heroUrls: MetadataRoute.Sitemap = heroes.flatMap((h) => [
    { url: `${BASE}/ja/heroes/${h.key}`,   priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/en/heroes/${h.key}`,   priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/ja/counters/${h.key}`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${BASE}/en/counters/${h.key}`, priority: 0.7, changeFrequency: "weekly" as const },
  ]);

  return [...staticUrls, ...heroUrls];
}
