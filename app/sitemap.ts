import type { MetadataRoute } from "next";
import { getHeroes, getMaps } from "@/lib/api";
import { getMatchupPairs } from "@/lib/stats";
import { DIVISIONS } from "@/lib/stats-config";

const BASE = "https://owtracker.org";

export const dynamic = "force-static";


const LANGS = ["ja", "en", "ko"];

type Frequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC_PAGES: [string, number, Frequency][] = [
  ["", 1.0, "daily"],
  ["/tier-list", 0.9, "daily"],
  ["/meta", 0.9, "daily"],
  ["/heroes", 0.9, "weekly"],
  ["/maps", 0.8, "weekly"],
  ["/counters", 0.8, "weekly"],
  ["/stats/ranks", 0.8, "daily"],
  ["/stats/rank-distribution", 0.8, "weekly"],
  ["/compare", 0.7, "monthly"],
  ["/about", 0.5, "monthly"],
  ["/privacy", 0.3, "monthly"],
  ["/contact", 0.3, "monthly"],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [heroes, maps, pairs] = await Promise.all([getHeroes("en"), getMaps("en"), getMatchupPairs()]);

  const paths: [string, number, Frequency][] = [
    ...STATIC_PAGES,
    ...heroes.flatMap((hero): [string, number, Frequency][] => [
      [`/heroes/${hero.key}`, 0.8, "daily"],
      [`/counters/${hero.key}`, 0.7, "weekly"],
    ]),
    ...maps.map((map): [string, number, Frequency] => [`/maps/${map.key}`, 0.7, "daily"]),
    ...DIVISIONS.map((rank): [string, number, Frequency] => [`/stats/ranks/${rank}`, 0.7, "daily"]),
    ...pairs.map(([first, second]): [string, number, Frequency] => [`/heroes/${first}/vs/${second}`, 0.6, "weekly"]),
  ];

  return LANGS.flatMap((lang) =>
    paths.map(([path, priority, changeFrequency]) => ({
      url: `${BASE}/${lang}${path}`,
      priority,
      changeFrequency,
    }))
  );
}
