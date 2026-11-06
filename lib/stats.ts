import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getHeroes, getMaps } from "@/lib/api";
import { LOW_PICK_RATE, scoreHeroes, type HeroStat, type ScoredHero } from "@/lib/meta-score";
import { defaultRegion, DIVISIONS, statsFileName, type StatsFilter } from "@/lib/stats-config";

async function readJson<T>(...path: string[]): Promise<T> {
  return JSON.parse(await readFile(join(process.cwd(), ...path), "utf8"));
}

/** Stats saved by scripts/fetch-data.mjs. A missing file fails the build. */
export function getStats(filter: StatsFilter): Promise<HeroStat[]> {
  return readJson<HeroStat[]>("public", "data", "stats", statsFileName(filter));
}

export async function getRoleMap(): Promise<Record<string, string>> {
  const heroes = await getHeroes("en");
  return Object.fromEntries(heroes.map((hero) => [hero.key, hero.role]));
}

export async function getScoredHeroes(lang: string): Promise<ScoredHero[]> {
  const filter = { platform: "pc", region: defaultRegion(lang), division: "all" } as const;
  const [rows, roles] = await Promise.all([getStats(filter), getRoleMap()]);
  return scoreHeroes(rows, roles);
}

/** Maps without competitive data have no file, which is expected. */
export async function getMapStats(lang: string, mapKey: string): Promise<HeroStat[] | null> {
  try {
    return await readJson<HeroStat[]>(".build-data", `map-${defaultRegion(lang)}-${mapKey}.json`);
  } catch {
    return null;
  }
}

export interface DivisionStat {
  division: (typeof DIVISIONS)[number];
  stat: HeroStat | null;
}

export async function getHeroByDivision(lang: string, heroKey: string): Promise<DivisionStat[]> {
  const region = defaultRegion(lang);
  return Promise.all(
    DIVISIONS.map(async (division) => {
      const rows = await getStats({ platform: "pc", region, division });
      return { division, stat: rows.find((row) => row.hero === heroKey) ?? null };
    })
  );
}

export interface HeroMapStat {
  mapKey: string;
  winrate: number;
  pickrate: number;
}

export async function getHeroByMap(lang: string, heroKey: string, mapKeys: string[]): Promise<HeroMapStat[]> {
  const results = await Promise.all(
    mapKeys.map(async (mapKey) => {
      const stat = (await getMapStats(lang, mapKey))?.find((row) => row.hero === heroKey);
      return stat ? { mapKey, winrate: stat.winrate, pickrate: stat.pickrate } : null;
    })
  );
  return results.filter((result) => result !== null).sort((a, b) => b.winrate - a.winrate);
}

export function topHeroes(
  scored: ScoredHero[],
  field: "winrate" | "pickrate" | "banrate",
  count: number
): { hero: string; value: string }[] {
  return scored
    .filter((hero) => !hero.lowData)
    .sort((a, b) => b[field] - a[field])
    .slice(0, count)
    .map((hero) => ({ hero: hero.hero, value: `${hero[field].toFixed(1)}%` }));
}

export interface MapLeader {
  key: string;
  name: string;
  screenshot: string;
  hero: string;
  winrate: number;
}

/** The best hero on each map, leaving out heroes with too little data. */
export async function getMapLeaders(lang: string, count: number): Promise<MapLeader[]> {
  const maps = await getMaps(lang);
  const leaders = await Promise.all(
    maps.map(async (map) => {
      const rows = await getMapStats(lang, map.key);
      const best = rows
        ?.filter((row) => row.pickrate >= LOW_PICK_RATE)
        .sort((a, b) => b.winrate - a.winrate)[0];
      return best
        ? { key: map.key, name: map.name, screenshot: map.screenshot, hero: best.hero, winrate: best.winrate }
        : null;
    })
  );
  return leaders.filter((leader) => leader !== null).slice(0, count);
}

export async function getStatsUpdatedAt(): Promise<string> {
  const { updatedAt } = await readJson<{ updatedAt: string }>("public", "data", "updated.json");
  return updatedAt;
}
