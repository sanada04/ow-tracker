/**
 * OW Tracker Meta Score.
 *
 * Each stat becomes a 0-100 percentile within the hero's role, because pick and
 * ban rates are not comparable across roles. The score is the weighted sum:
 *
 *   Meta Score = win rate x 0.5 + pick rate x 0.3 + ban rate x 0.2
 *
 * The API does not report sample sizes, so heroes under LOW_PICK_RATE are flagged
 * as low data instead of being hidden. The tier list page explains this formula.
 */

export type DataTier = "S" | "A" | "B" | "C" | "D";
export type Role = "tank" | "damage" | "support";

export interface HeroStat {
  hero: string;
  pickrate: number;
  winrate: number;
  banrate: number;
}

export interface ScoredHero extends HeroStat {
  role: Role;
  score: number;
  tier: DataTier;
  lowData: boolean;
}

export const SCORE_WEIGHTS = { winrate: 0.5, pickrate: 0.3, banrate: 0.2 };
export const TIER_MINIMUMS: [DataTier, number][] = [["S", 80], ["A", 65], ["B", 45], ["C", 25]];
export const LOW_PICK_RATE = 2;

function tierForScore(score: number): DataTier {
  return TIER_MINIMUMS.find(([, minimum]) => score >= minimum)?.[0] ?? "D";
}

function percentiles(rows: HeroStat[], field: keyof typeof SCORE_WEIGHTS): Map<string, number> {
  const sorted = [...rows].sort((a, b) => a[field] - b[field]);
  const span = Math.max(sorted.length - 1, 1);
  return new Map(sorted.map((row, index) => [row.hero, (index / span) * 100]));
}

export function scoreHeroes(rows: HeroStat[], roles: Record<string, string>): ScoredHero[] {
  const scored: ScoredHero[] = [];

  for (const role of ["tank", "damage", "support"] as const) {
    const roleRows = rows.filter((row) => roles[row.hero] === role);
    const win = percentiles(roleRows, "winrate");
    const pick = percentiles(roleRows, "pickrate");
    const ban = percentiles(roleRows, "banrate");

    for (const row of roleRows) {
      const score = Math.round(
        (win.get(row.hero) ?? 0) * SCORE_WEIGHTS.winrate +
        (pick.get(row.hero) ?? 0) * SCORE_WEIGHTS.pickrate +
        (ban.get(row.hero) ?? 0) * SCORE_WEIGHTS.banrate
      );
      scored.push({
        ...row,
        role,
        score,
        tier: tierForScore(score),
        lowData: row.pickrate < LOW_PICK_RATE,
      });
    }
  }

  return scored.sort((a, b) => b.score - a.score);
}
