import type {
  HeroDetail,
  PlayerStatsSummary,
  PlayerSummary,
  SearchResult,
} from "@/types/overwatch";
import type { CounterVotes, Tier, TierVotes } from "@/lib/upstash";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";

export interface PlayerData {
  summary: PlayerSummary;
  stats: PlayerStatsSummary | null;
}

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function postVote(body: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${API_BASE}/votes.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Vote failed: ${res.status}`);
}

export async function fetchPlayer(playerId: string, gamemode?: string): Promise<PlayerData | null> {
  const params = new URLSearchParams({ id: playerId });
  if (gamemode) params.set("gamemode", gamemode);
  const res = await fetch(`${API_BASE}/player.php?${params}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function searchPlayers(name: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ name });
  const data = await getJson<{ results?: SearchResult[] }>(`/search.php?${params}`);
  return data.results ?? [];
}

export async function fetchHero(heroKey: string, lang: string): Promise<HeroDetail> {
  const params = new URLSearchParams({ key: heroKey, lang });
  return getJson<HeroDetail>(`/hero.php?${params}`);
}

export async function fetchTierVotes(): Promise<Record<string, TierVotes>> {
  const data = await getJson<{ votes: Record<string, TierVotes> }>("/votes.php?type=tier");
  return data.votes;
}

export async function fetchCounterVotes(heroKey: string): Promise<CounterVotes> {
  const params = new URLSearchParams({ type: "counter", hero: heroKey });
  const data = await getJson<{ votes: CounterVotes }>(`/votes.php?${params}`);
  return data.votes;
}

export function castTierVote(hero: string, tier: Tier, prevTier: Tier | null): Promise<void> {
  return postVote({ type: "tier", action: "cast", hero, tier, prevTier });
}

export function removeTierVote(hero: string, tier: Tier): Promise<void> {
  return postVote({ type: "tier", action: "remove", hero, tier });
}

export function castCounterVote(hero: string, counter: string): Promise<void> {
  return postVote({ type: "counter", action: "cast", hero, counter });
}

export function removeCounterVote(hero: string, counter: string): Promise<void> {
  return postVote({ type: "counter", action: "remove", hero, counter });
}

export async function sendContact(formData: FormData): Promise<ContactState> {
  try {
    const res = await fetch(`${API_BASE}/contact.php`, { method: "POST", body: formData });
    return await res.json();
  } catch {
    return { status: "error", message: "Failed to send the message." };
  }
}
