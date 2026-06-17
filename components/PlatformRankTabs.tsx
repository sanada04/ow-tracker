"use client";

import { useState } from "react";
import type { PlatformRanks } from "@/types/overwatch";
import RankBadge from "./RankBadge";

type Tab = "pc" | "console";

export default function PlatformRankTabs({
  pcRank,
  consoleRank,
  roleLabels,
  labels,
}: {
  pcRank: PlatformRanks | null;
  consoleRank: PlatformRanks | null;
  roleLabels: Record<string, string>;
  labels: { pc: string; console: string };
}) {
  const hasBoth = pcRank && consoleRank;
  const [tab, setTab] = useState<Tab>(pcRank ? "pc" : "console");

  if (!pcRank && !consoleRank) return null;

  if (!hasBoth) {
    return (
      <div className="flex flex-col gap-4 shrink-0">
        {pcRank && <RankBadge ranks={pcRank} platform={labels.pc} roleLabels={roleLabels} />}
        {consoleRank && <RankBadge ranks={consoleRank} platform={labels.console} roleLabels={roleLabels} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 shrink-0">
      {/* Tabs */}
      <div className="flex gap-1">
        {(["pc", "console"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 text-[11px] uppercase tracking-widest font-medium transition-colors border ${
              tab === t
                ? "border-[#f4a029]/60 text-[#f4a029] bg-[#f4a029]/10"
                : "border-zinc-700/40 text-zinc-500 hover:text-zinc-300"
            }`}
            style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
          >
            {t === "pc" ? labels.pc : labels.console}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "pc" && pcRank && (
        <RankBadge ranks={pcRank} platform={labels.pc} roleLabels={roleLabels} />
      )}
      {tab === "console" && consoleRank && (
        <RankBadge ranks={consoleRank} platform={labels.console} roleLabels={roleLabels} />
      )}
    </div>
  );
}
