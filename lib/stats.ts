import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getHeroes, getMaps } from "@/lib/api";
import { LOW_PICK_RATE, scoreHeroes, type HeroStat, type ScoredHero } from "@/lib/meta-score";
import { defaultRegion, DIVISIONS, statsFileName, type StatsFilter } from "@/lib/stats-config";

const jsonCache = new Map<string, Promise<unknown>>();

/** Prebuilt pages read the same files many times, so each is parsed once. */
function readJson<T>(...path: string[]): Promise<T> {
  const file = join(process.cwd(), ...path);
  if (!jsonCache.has(file)) {
    jsonCache.set(file, readFile(file, "utf8").then(JSON.parse));
  }
  return jsonCache.get(file) as Promise<T>;
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
      return stat && stat.pickrate >= LOW_PICK_RATE
        ? { mapKey, winrate: stat.winrate, pickrate: stat.pickrate }
        : null;
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

export interface RankHero extends ScoredHero {
  /** Win rate at this rank minus the hero's win rate across all ranks. */
  winDiff: number;
}

export async function getRankHeroes(lang: string, division: (typeof DIVISIONS)[number]): Promise<RankHero[]> {
  const region = defaultRegion(lang);
  const [rows, overall, roles] = await Promise.all([
    getStats({ platform: "pc", region, division }),
    getStats({ platform: "pc", region, division: "all" }),
    getRoleMap(),
  ]);
  const overallWin = new Map(overall.map((row) => [row.hero, row.winrate]));
  return scoreHeroes(rows, roles).map((hero) => ({
    ...hero,
    winDiff: hero.winrate - (overallWin.get(hero.hero) ?? hero.winrate),
  }));
}

/**
 * Same-role pairs worth a prebuilt page: both heroes must reach this pick rate in
 * both default regions. The API reports no sample sizes, so pick rate stands in.
 */
const MATCHUP_PICK_RATE = 5;

export async function getMatchupPairs(): Promise<[string, string][]> {
  const [asia, americas, roles] = await Promise.all([
    getStats({ platform: "pc", region: "asia", division: "all" }),
    getStats({ platform: "pc", region: "americas", division: "all" }),
    getRoleMap(),
  ]);
  const americasPick = new Map(americas.map((row) => [row.hero, row.pickrate]));
  const eligible = asia
    .filter((row) => row.pickrate >= MATCHUP_PICK_RATE && (americasPick.get(row.hero) ?? 0) >= MATCHUP_PICK_RATE)
    .map((row) => row.hero)
    .sort();
  return eligible.flatMap((first, index) =>
    eligible
      .slice(index + 1)
      .filter((second) => roles[first] === roles[second])
      .map((second): [string, string] => [first, second])
  );
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
