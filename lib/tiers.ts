export type Tier = "S" | "A" | "B" | "C" | "D";
export const TIERS: Tier[] = ["S", "A", "B", "C", "D"];
export type TierVotes = Record<Tier, number>;

export function parseVotes(raw: Record<string, unknown> | null): TierVotes {
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
