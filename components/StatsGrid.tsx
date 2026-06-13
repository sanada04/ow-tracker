"use client";

import type { RoleStats } from "@/types/overwatch";
import { formatTimePlayed } from "@/lib/api";
import AnimatedNumber from "./AnimatedNumber";

const WINRATE_COLOR = (v: number) =>
  v >= 60 ? "text-green-400 text-glow-green" : v >= 50 ? "text-[#f4a029] text-glow-orange" : "text-red-400 text-glow-red";

interface CardProps {
  label: string;
  children: React.ReactNode;
  sub?: string;
  delay?: number;
}

function StatCard({ label, children, sub, delay = 0 }: CardProps) {
  return (
    <div
      className="ow-card p-4 flex flex-col gap-1 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">{label}</span>
      <span className="ow-stat-value text-white">{children}</span>
      {sub && <span className="text-[11px] text-zinc-500 mt-0.5">{sub}</span>}
    </div>
  );
}

type StatsLabels = {
  games_played: string;
  winrate: string;
  time_played: string;
  kda: string;
  elim_per_10: string;
  deaths_per_10: string;
  won_suffix: string;
  lost_suffix: string;
};

const DEFAULT_LABELS: StatsLabels = {
  games_played: "ゲーム数",
  winrate: "勝率",
  time_played: "プレイ時間",
  kda: "KDA",
  elim_per_10: "エリミ / 10分",
  deaths_per_10: "デス / 10分",
  won_suffix: "勝",
  lost_suffix: "敗",
};

export default function StatsGrid({
  stats,
  title,
  labels = DEFAULT_LABELS,
}: {
  stats: RoleStats;
  title?: string;
  labels?: StatsLabels;
}) {
  return (
    <div>
      {title && <p className="ow-section-title mb-4">{title}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <StatCard label={labels.games_played} sub={`${stats.games_won}${labels.won_suffix} / ${stats.games_lost}${labels.lost_suffix}`} delay={0}>
          <AnimatedNumber value={stats.games_played} />
        </StatCard>
        <StatCard label={labels.winrate} delay={60}>
          <span className={WINRATE_COLOR(stats.winrate)}>
            <AnimatedNumber value={stats.winrate} decimals={1} suffix="%" />
          </span>
        </StatCard>
        <StatCard label={labels.time_played} delay={120}>
          {formatTimePlayed(stats.time_played)}
        </StatCard>
        <StatCard label={labels.kda} delay={180}>
          <AnimatedNumber value={stats.kda} decimals={2} />
        </StatCard>
        <StatCard label={labels.elim_per_10} delay={240}>
          <AnimatedNumber value={stats.average.eliminations} decimals={1} />
        </StatCard>
        <StatCard label={labels.deaths_per_10} delay={300}>
          <AnimatedNumber value={stats.average.deaths} decimals={1} />
        </StatCard>
      </div>
    </div>
  );
}
