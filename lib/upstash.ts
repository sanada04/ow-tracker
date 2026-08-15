import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export type Tier = "S" | "A" | "B" | "C" | "D";
export const TIERS: Tier[] = ["S", "A", "B", "C", "D"];
export type TierVotes = Record<Tier, number>;

function parseVotes(raw: Record<string, unknown> | null): TierVotes {
  return {
    S: Math.max(0, Number(raw?.S) || 0),
    A: Math.max(0, Number(raw?.A) || 0),
    B: Math.max(0, Number(raw?.B) || 0),
    C: Math.max(0, Number(raw?.C) || 0),
    D: Math.max(0, Number(raw?.D) || 0),
  };
}

export function getWinningTier(votes: TierVotes): Tier | null {
  const total = TIERS.reduce((s, t) => s + votes[t], 0);
  if (total === 0) return null;
  return TIERS.reduce((best, t) => (votes[t] > votes[best] ? t : best), TIERS[0]);
}

export function getTotalVotes(votes: TierVotes): number {
  return TIERS.reduce((s, t) => s + votes[t], 0);
}

export async function getAllTierVotes(
  heroKeys: string[]
): Promise<Record<string, TierVotes>> {
  if (!process.env.UPSTASH_REDIS_REST_URL || heroKeys.length === 0) {
    return Object.fromEntries(heroKeys.map((k) => [k, { S: 0, A: 0, B: 0, C: 0, D: 0 }]));
  }
  const pipeline = redis.pipeline();
  for (const key of heroKeys) {
    pipeline.hgetall(`ow:tier:${key}`);
  }
  const results = await pipeline.exec();
  return Object.fromEntries(
    heroKeys.map((key, i) => [key, parseVotes(results[i] as Record<string, unknown> | null)])
  );
}

// ── Counter votes ────────────────────────────────────────────────────────────

export type CounterVotes = Record<string, number>;

function parseCounterVotes(raw: Record<string, unknown> | null): CounterVotes {
  if (!raw) return {};
  return Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Math.max(0, Number(v) || 0)])
  );
}

export async function getHeroCounterVotes(heroKey: string): Promise<CounterVotes> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return {};
  const data = await redis.hgetall(`ow:counter:${heroKey}`);
  return parseCounterVotes(data as Record<string, unknown> | null);
}

export async function castCounterVote(heroKey: string, counterHeroKey: string): Promise<void> {
  await redis.hincrby(`ow:counter:${heroKey}`, counterHeroKey, 1);
}

export async function removeCounterVote(heroKey: string, counterHeroKey: string): Promise<void> {
  const current = await redis.hget(`ow:counter:${heroKey}`, counterHeroKey);
  const val = Math.max(0, Number(current) - 1);
  if (val === 0) {
    await redis.hdel(`ow:counter:${heroKey}`, counterHeroKey);
  } else {
    await redis.hset(`ow:counter:${heroKey}`, { [counterHeroKey]: val });
  }
}
