"use server";

import { revalidatePath } from "next/cache";
import { redis } from "@/lib/upstash";
import type { Tier } from "@/lib/upstash";

export async function castTierVote(
  heroKey: string,
  newTier: Tier,
  prevTier: Tier | null
): Promise<{ success: boolean }> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { success: false };

  try {
    const pipeline = redis.pipeline();
    const redisKey = `ow:tier:${heroKey}`;

    if (prevTier && prevTier !== newTier) {
      pipeline.hincrby(redisKey, prevTier, -1);
    }
    if (!prevTier || prevTier !== newTier) {
      pipeline.hincrby(redisKey, newTier, 1);
    }
    await pipeline.exec();

    revalidatePath("/ja/tier-list");
    revalidatePath("/en/tier-list");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function removeTierVote(
  heroKey: string,
  tier: Tier
): Promise<{ success: boolean }> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { success: false };

  try {
    await redis.hincrby(`ow:tier:${heroKey}`, tier, -1);
    revalidatePath("/ja/tier-list");
    revalidatePath("/en/tier-list");
    return { success: true };
  } catch {
    return { success: false };
  }
}
