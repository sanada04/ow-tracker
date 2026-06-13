"use client";

import type { RoleStats } from "@/types/overwatch";
import { formatTimePlayed } from "@/lib/api";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import Image from "next/image";
import { useState } from "react";

function WinrateBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const color =
    value >= 60 ? "bg-green-500" : value >= 50 ? "bg-[#f4a029]" : "bg-red-500";
  const textColor =
    value >= 60 ? "text-green-400" : value >= 50 ? "text-[#f4a029]" : "text-red-400";

  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full winrate-bar ${color}`}
          style={{
            "--bar-target": `${Math.min(value, 100)}%`,
            animationDelay: `${delay}ms`,
          } as React.CSSProperties}
        />
      </div>
      <span className={`text-xs tabular-nums ${textColor}`}>{value.toFixed(1)}%</span>
    </div>
  );
}

interface HeroRow {
  key: string;
  stats: RoleStats;
}

const DEFAULT_HEADERS = ["ヒーロー", "プレイ時間", "ゲーム", "勝率", "KDA", "エリミ/10m", "デス/10m"];

export default function HeroTable({
  heroes,
  headers = DEFAULT_HEADERS,
}: {
  heroes: Record<string, RoleStats>;
  headers?: string[];
}) {
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const sorted: HeroRow[] = Object.entries(heroes)
    .map(([key, stats]) => ({ key, stats }))
    .sort((a, b) => b.stats.time_played - a.stats.time_played)
    .slice(0, 10);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-zinc-800/60">
            {headers.map((h) => (
              <th key={h} className="pb-3 pr-4 last:pr-0 text-[10px] uppercase tracking-widest text-zinc-500 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ key, stats }, i) => {
            const portrait = imgErrors.has(key) ? null : HERO_PORTRAITS[key];
            return (
              <tr
                key={key}
                className="border-b border-zinc-800/30 hover:bg-[#1a1a2a] transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Hero */}
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    {portrait ? (
                      <Image
                        src={portrait}
                        alt={key}
                        width={34}
                        height={34}
                        className="rounded object-cover shrink-0 border border-zinc-700/50"
                        unoptimized
                        onError={() => setImgErrors((prev) => new Set([...prev, key]))}
                      />
                    ) : (
                      <div className="w-[34px] h-[34px] rounded bg-zinc-800 border border-zinc-700/50 shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
                        {key[0].toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-white text-sm whitespace-nowrap">
                      {getHeroDisplayName(key)}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-zinc-300 tabular-nums">{formatTimePlayed(stats.time_played)}</td>
                <td className="py-2.5 pr-4 text-zinc-300 tabular-nums">{stats.games_played}</td>
                <td className="py-2.5 pr-4"><WinrateBar value={stats.winrate} delay={i * 40 + 300} /></td>
                <td className="py-2.5 pr-4 text-zinc-300 tabular-nums">{stats.kda.toFixed(2)}</td>
                <td className="py-2.5 pr-4 text-zinc-300 tabular-nums">{stats.average.eliminations.toFixed(1)}</td>
                <td className="py-2.5 text-zinc-300 tabular-nums">{stats.average.deaths.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
