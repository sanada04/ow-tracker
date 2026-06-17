"use client";

import { useState } from "react";
import Image from "next/image";
import type { RoleStats } from "@/types/overwatch";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import { formatTimePlayed } from "@/lib/api";

interface HeroRow {
  key: string;
  stats: RoleStats;
}

interface Labels {
  title: string;
  switch_table: string;
  switch_chart: string;
  winrate: string;
  kda: string;
  time_played: string;
  games: string;
}

function Bar({
  value,
  max,
  color,
  label,
  delay,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  delay?: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[10px] text-zinc-500 w-16 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full winrate-bar ${color}`}
          style={{
            "--bar-target": `${pct}%`,
            animationDelay: `${delay ?? 0}ms`,
          } as React.CSSProperties}
        />
      </div>
      <span className="text-[10px] text-zinc-400 w-12 shrink-0 tabular-nums">{label === "%" ? `${value.toFixed(1)}%` : value}</span>
    </div>
  );
}

function HeroCard({ row, maxWinrate, maxKda, delay }: { row: HeroRow; maxWinrate: number; maxKda: number; delay: number }) {
  const [imgError, setImgError] = useState(false);
  const portrait = imgError ? null : HERO_PORTRAITS[row.key];
  const winrateColor = row.stats.winrate >= 60 ? "bg-green-500" : row.stats.winrate >= 50 ? "bg-[#f4a029]" : "bg-red-500";

  return (
    <div className="ow-card-sm p-3 flex flex-col gap-2 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2.5">
        {portrait ? (
          <Image src={portrait} alt={row.key} width={36} height={36}
            className="rounded border border-zinc-700/50 shrink-0 object-cover" unoptimized
            onError={() => setImgError(true)} />
        ) : (
          <div className="w-9 h-9 rounded bg-zinc-800 border border-zinc-700/50 shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
            {row.key[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
            {getHeroDisplayName(row.key)}
          </p>
          <p className="text-zinc-500 text-[10px]">{formatTimePlayed(row.stats.time_played)} · {row.stats.games_played}G</p>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] text-zinc-500 w-16 shrink-0 text-right">勝率</span>
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full winrate-bar ${winrateColor}`}
              style={{
                "--bar-target": `${Math.min(row.stats.winrate, 100)}%`,
                animationDelay: `${delay + 200}ms`,
              } as React.CSSProperties}
            />
          </div>
          <span className="text-[10px] text-zinc-400 w-12 shrink-0 tabular-nums">{row.stats.winrate.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] text-zinc-500 w-16 shrink-0 text-right">KDA</span>
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full winrate-bar bg-blue-400"
              style={{
                "--bar-target": `${maxKda > 0 ? Math.round((row.stats.kda / maxKda) * 100) : 0}%`,
                animationDelay: `${delay + 300}ms`,
              } as React.CSSProperties}
            />
          </div>
          <span className="text-[10px] text-zinc-400 w-12 shrink-0 tabular-nums">{row.stats.kda.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroChart({
  heroes,
  labels,
  tableNode,
}: {
  heroes: Record<string, RoleStats>;
  labels: Labels;
  tableNode: React.ReactNode;
}) {
  const [mode, setMode] = useState<"table" | "chart">("table");

  const sorted: HeroRow[] = Object.entries(heroes)
    .map(([key, stats]) => ({ key, stats }))
    .sort((a, b) => b.stats.time_played - a.stats.time_played)
    .slice(0, 10);

  const maxWinrate = Math.max(...sorted.map((r) => r.stats.winrate));
  const maxKda = Math.max(...sorted.map((r) => r.stats.kda));

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-end gap-1 mb-3">
        {(["table", "chart"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-[11px] uppercase tracking-widest font-medium transition-colors border ${
              mode === m
                ? "border-[#f4a029]/60 text-[#f4a029] bg-[#f4a029]/10"
                : "border-zinc-700/40 text-zinc-500 hover:text-zinc-300"
            }`}
            style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
          >
            {m === "table" ? labels.switch_table : labels.switch_chart}
          </button>
        ))}
      </div>

      {mode === "table" ? (
        tableNode
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sorted.map((row, i) => (
            <HeroCard
              key={row.key}
              row={row}
              maxWinrate={maxWinrate}
              maxKda={maxKda}
              delay={i * 50}
            />
          ))}
        </div>
      )}
    </div>
  );
}
