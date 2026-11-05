import { Redis } from "@upstash/redis";
import { parseVotes } from "@/lib/tiers";
import type { TierVotes } from "@/lib/tiers";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  // Static export rejects no-store fetches. Browsers refresh counts after load.
  cache: "default",
});

export * from "@/lib/tiers";

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
