import type { PlayerSummary, PlayerStatsSummary, SearchResult, HeroListItem, HeroDetail } from "@/types/overwatch";

const BASE_URL = "https://overfast-api.tekrop.fr";

/** BattleTag形式 (Name-12345) → Name#12345 */
export function formatPlayerId(battleTag: string): string {
  return battleTag.replace("#", "-");
}

/** プレイヤーIDの表示名を返す。内部IDの場合はnullを返す（summaryのusernameを使う） */
export function formatBattleTag(playerId: string): string | null {
  // 内部Blizzard ID (| が含まれる or 英数字のみの長いID)
  if (playerId.includes("|") || playerId.includes("%7C")) return null;
  // BattleTag形式: Name-12345
  const m = playerId.match(/^(.+)-(\d+)$/);
  if (m) return `${m[1]}#${m[2]}`;
  return null;
}

export function formatTimePlayed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function localeParam(lang: string): string {
  return lang === "ja" ? "?locale=ja-jp" : "";
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  return res.json();
}

export async function getPlayerSummary(playerId: string): Promise<PlayerSummary> {
  return fetchApi<PlayerSummary>(`/players/${encodeURIComponent(playerId)}/summary`);
}

export async function getPlayerStats(
  playerId: string,
  gamemode?: "quickplay" | "competitive"
): Promise<PlayerStatsSummary> {
  const qs = gamemode ? `?gamemode=${gamemode}` : "";
  return fetchApi<PlayerStatsSummary>(`/players/${encodeURIComponent(playerId)}/stats/summary${qs}`);
}

export async function searchPlayers(name: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ name });
  const data = await fetchApi<{ results: SearchResult[] }>(`/players?${params}`);
  return data.results ?? [];
}

export async function getHeroes(lang = "en"): Promise<HeroListItem[]> {
  return fetchApi<HeroListItem[]>(`/heroes${localeParam(lang)}`);
}

export async function getHeroDetail(heroKey: string, lang = "en"): Promise<HeroDetail> {
  return fetchApi<HeroDetail>(`/heroes/${encodeURIComponent(heroKey)}${localeParam(lang)}`);
}
