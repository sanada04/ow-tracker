export const PLATFORMS = ["pc", "console"] as const;
export const REGIONS = ["asia", "americas", "europe"] as const;
export const DIVISIONS = [
  "bronze", "silver", "gold", "platinum", "emerald", "diamond", "master", "grandmaster",
] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Region = (typeof REGIONS)[number];
export type Division = (typeof DIVISIONS)[number] | "all";

export interface StatsFilter {
  platform: Platform;
  region: Region;
  division: Division;
}

export function statsFileName({ platform, region, division }: StatsFilter): string {
  return `${platform}-${region}-${division}.json`;
}

export function defaultRegion(lang: string): Region {
  return lang === "en" ? "americas" : "asia";
}
