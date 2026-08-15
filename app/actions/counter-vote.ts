"use server";

import { revalidatePath } from "next/cache";
import { castCounterVote, removeCounterVote } from "@/lib/upstash";

export async function castCounterVoteAction(
  heroKey: string,
  counterHeroKey: string
): Promise<{ success: boolean }> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { success: false };
  try {
    await castCounterVote(heroKey, counterHeroKey);
    revalidatePath(`/ja/counters/${heroKey}`);
    revalidatePath(`/en/counters/${heroKey}`);
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function removeCounterVoteAction(
  heroKey: string,
  counterHeroKey: string
): Promise<{ success: boolean }> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { success: false };
  try {
    await removeCounterVote(heroKey, counterHeroKey);
    revalidatePath(`/ja/counters/${heroKey}`);
    revalidatePath(`/en/counters/${heroKey}`);
    return { success: true };
  } catch {
    return { success: false };
  }
}
