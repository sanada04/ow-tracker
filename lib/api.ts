import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dataFileName } from "@/lib/build-data-path.mjs";
import type { HeroListItem, HeroDetail, MapSummary } from "@/types/overwatch";

function localeParam(lang: string): string {
  if (lang === "ja") return "?locale=ja-jp";
  if (lang === "ko") return "?locale=ko-kr";
  return "";
}

/**
 * Reads data saved by scripts/fetch-data.mjs. A missing file fails the build,
 * which keeps the current site online instead of publishing empty pages.
 */
async function readBuildData<T>(path: string): Promise<T> {
  const file = join(process.cwd(), ".build-data", dataFileName(path));
  return JSON.parse(await readFile(file, "utf8"));
}

export async function getHeroes(lang = "en"): Promise<HeroListItem[]> {
  return readBuildData<HeroListItem[]>(`/heroes${localeParam(lang)}`);
}

export async function getHeroDetail(heroKey: string, lang = "en"): Promise<HeroDetail> {
  return readBuildData<HeroDetail>(`/heroes/${encodeURIComponent(heroKey)}${localeParam(lang)}`);
}

export async function getMaps(lang = "en"): Promise<MapSummary[]> {
  return readBuildData<MapSummary[]>(`/maps${localeParam(lang)}`);
}
