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
            className={`px-3 py-1 text-xs tracking-normal font-medium transition-colors border rounded ${
              tab === t
                ? "border-[var(--ow-accent)]/60 text-[var(--ow-accent)] bg-[var(--ow-accent)]/10"
                : "border-zinc-700/40 text-zinc-500 hover:text-zinc-300"
            }`}
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
