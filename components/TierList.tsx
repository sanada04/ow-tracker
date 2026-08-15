"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { castTierVote, removeTierVote } from "@/app/actions/tier-vote";
import type { HeroListItem } from "@/types/overwatch";
import { TIERS, getWinningTier, getTotalVotes } from "@/lib/upstash";
import type { Tier, TierVotes } from "@/lib/upstash";
import type { Dictionary } from "@/lib/i18n";

const STORAGE_KEY = "ow_tier_votes";

const TIER_STYLE: Record<Tier, { bg: string; border: string; label: string; text: string }> = {
  S: { bg: "rgba(244,160,41,0.12)", border: "#f4a029", label: "#f4a029", text: "#fff" },
  A: { bg: "rgba(132,204,22,0.10)",  border: "#84cc16", label: "#a3e635", text: "#fff" },
  B: { bg: "rgba(59,130,246,0.10)",  border: "#3b82f6", label: "#60a5fa", text: "#fff" },
  C: { bg: "rgba(113,113,122,0.10)", border: "#52525b", label: "#a1a1aa", text: "#d4d4d8" },
  D: { bg: "rgba(239,68,68,0.10)",   border: "#ef4444", label: "#f87171", text: "#fff" },
};

function loadUserVotes(): Record<string, Tier> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function saveUserVote(heroKey: string, tier: Tier | null) {
  const current = loadUserVotes();
  if (tier === null) delete current[heroKey];
  else current[heroKey] = tier;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

function VoteBar({ votes, myTier }: { votes: TierVotes; myTier: Tier | null }) {
  const total = getTotalVotes(votes);
  if (total === 0) return null;
  return (
    <div className="flex h-1 w-full rounded-full overflow-hidden gap-px mt-1">
      {TIERS.map((t) => {
        const pct = total > 0 ? (votes[t] / total) * 100 : 0;
        if (pct === 0) return null;
        return (
          <div
            key={t}
            style={{ width: `${pct}%`, background: TIER_STYLE[t].border, opacity: myTier === t ? 1 : 0.4 }}
          />
        );
      })}
    </div>
  );
}

function HeroCard({
  hero,
  votes,
  myTier,
  lang,
  onVote,
  pending,
}: {
  hero: HeroListItem;
  votes: TierVotes;
  myTier: Tier | null;
  lang: string;
  onVote: (heroKey: string, tier: Tier | null) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const winning = getWinningTier(votes);
  const total = getTotalVotes(votes);

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="w-full flex flex-col items-center gap-1 p-2 rounded transition-colors hover:bg-white/5 active:bg-white/10 disabled:opacity-50"
      >
        {/* Portrait */}
        <div className="relative w-14 h-14 rounded overflow-hidden bg-zinc-800 shrink-0">
          <Image src={hero.portrait} alt={hero.name} fill unoptimized className="object-cover object-top" />
          {/* My vote badge */}
          {myTier && (
            <div
              className="absolute top-0 right-0 text-[9px] font-bold w-4 h-4 flex items-center justify-center leading-none"
              style={{ background: TIER_STYLE[myTier].border, color: "#000" }}
            >
              {myTier}
            </div>
          )}
        </div>
        {/* Name */}
        <span
          className="text-[9px] uppercase tracking-wide text-center leading-tight w-full truncate"
          style={{ color: winning ? TIER_STYLE[winning].label : "#71717a" }}
        >
          {hero.name}
        </span>
        {/* Vote count */}
        {total > 0 && (
          <span className="text-[9px] text-zinc-600">{total}</span>
        )}
        {/* Vote bar */}
        <VoteBar votes={votes} myTier={myTier} />
      </button>

      {/* Tier picker popover */}
      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 flex gap-1 p-1.5 rounded border border-zinc-700/60 bg-[#0d0d1a] shadow-xl"
          style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
        >
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onVote(hero.key, myTier === t ? null : t);
                setOpen(false);
              }}
              className="w-8 h-8 text-xs font-bold rounded transition-all hover:scale-110"
              style={{
                background: myTier === t ? TIER_STYLE[t].border : "rgba(255,255,255,0.06)",
                color: myTier === t ? "#000" : TIER_STYLE[t].label,
                border: `1px solid ${myTier === t ? TIER_STYLE[t].border : "transparent"}`,
              }}
              title={`${t} Tier${myTier === t ? " (クリックで取り消し)" : ""}`}
            >
              {t}
            </button>
          ))}
          <Link
            href={`/${lang}/heroes/${hero.key}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 text-[10px] flex items-center justify-center rounded text-zinc-500 hover:text-zinc-300 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)" }}
            title={hero.name}
          >
            →
          </Link>
        </div>
      )}
    </div>
  );
}

function TierRow({
  tier,
  heroes,
  votes,
  userVotes,
  lang,
  onVote,
  pendingKeys,
}: {
  tier: Tier | "unranked";
  heroes: HeroListItem[];
  votes: Record<string, TierVotes>;
  userVotes: Record<string, Tier>;
  lang: string;
  onVote: (heroKey: string, tier: Tier | null) => void;
  pendingKeys: Set<string>;
}) {
  if (heroes.length === 0) return null;

  const isUnranked = tier === "unranked";
  const style = isUnranked
    ? { bg: "transparent", border: "#27272a", label: "#52525b" }
    : TIER_STYLE[tier];

  return (
    <div
      className="flex gap-3 rounded mb-2"
      style={{ background: isUnranked ? "transparent" : style.bg, border: `1px solid ${style.border}` }}
    >
      {/* Tier label */}
      <div
        className="flex items-center justify-center shrink-0 w-10 sm:w-14 rounded-l font-bold text-xl sm:text-2xl select-none"
        style={{
          fontFamily: '"Rajdhani", system-ui, sans-serif',
          color: style.label,
          borderRight: `1px solid ${style.border}`,
          background: isUnranked ? "transparent" : `${style.border}18`,
          minHeight: "80px",
        }}
      >
        {isUnranked ? "?" : tier}
      </div>
      {/* Heroes grid */}
      <div className="flex flex-wrap gap-1 py-2 pr-2 flex-1">
        {heroes.map((h) => (
          <HeroCard
            key={h.key}
            hero={h}
            votes={votes[h.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 }}
            myTier={userVotes[h.key] ?? null}
            lang={lang}
            onVote={onVote}
            pending={pendingKeys.has(h.key)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TierList({
  heroes,
  initialVotes,
  lang,
  dict,
}: {
  heroes: HeroListItem[];
  initialVotes: Record<string, TierVotes>;
  lang: string;
  dict: Dictionary;
}) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVotes, setUserVotes] = useState<Record<string, Tier>>({});
  const [roleFilter, setRoleFilter] = useState<"all" | "tank" | "damage" | "support">("all");
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  useEffect(() => {
    setUserVotes(loadUserVotes());
  }, []);

  const handleVote = useCallback(
    (heroKey: string, tier: Tier | null) => {
      const prevTier = userVotes[heroKey] ?? null;
      if (tier === prevTier) return;

      // Optimistic update
      setVotes((prev) => {
        const heroVotes = { ...(prev[heroKey] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 }) };
        if (prevTier) heroVotes[prevTier] = Math.max(0, heroVotes[prevTier] - 1);
        if (tier) heroVotes[tier] = heroVotes[tier] + 1;
        return { ...prev, [heroKey]: heroVotes };
      });
      setUserVotes((prev) => {
        const next = { ...prev };
        if (tier === null) delete next[heroKey];
        else next[heroKey] = tier;
        return next;
      });
      saveUserVote(heroKey, tier);

      setPendingKeys((s) => new Set(s).add(heroKey));
      startTransition(async () => {
        if (tier === null && prevTier) {
          await removeTierVote(heroKey, prevTier);
        } else if (tier) {
          await castTierVote(heroKey, tier, prevTier);
        }
        setPendingKeys((s) => {
          const next = new Set(s);
          next.delete(heroKey);
          return next;
        });
      });
    },
    [userVotes]
  );

  const filtered = roleFilter === "all" ? heroes : heroes.filter((h) => h.role === roleFilter);

  const grouped = (() => {
    const tiers: Record<string, HeroListItem[]> = { S: [], A: [], B: [], C: [], D: [], unranked: [] };
    for (const h of filtered) {
      const w = getWinningTier(votes[h.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 });
      (w ? tiers[w] : tiers.unranked).push(h);
    }
    return tiers;
  })();

  const totalVoters = heroes.reduce((s, h) => {
    const v = votes[h.key];
    return s + (v ? Math.max(v.S, v.A, v.B, v.C, v.D) : 0);
  }, 0);

  const isJa = lang === "ja";
  const roleLabels = { all: dict.heroes_page.role_all, tank: dict.heroes_page.role_tank, damage: dict.heroes_page.role_damage, support: dict.heroes_page.role_support };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Role filter */}
        <div className="flex gap-1">
          {(["all", "tank", "damage", "support"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className="px-3 py-1 text-[11px] uppercase tracking-widest rounded transition-colors"
              style={{
                background: roleFilter === r ? "#f4a029" : "rgba(255,255,255,0.05)",
                color: roleFilter === r ? "#000" : "#71717a",
              }}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>
        {/* Vote count */}
        <p className="text-[11px] text-zinc-600">
          {isJa ? `累計 ${totalVoters.toLocaleString()} 票` : `${totalVoters.toLocaleString()} total votes`}
        </p>
      </div>

      {/* Tier rows */}
      {(["S", "A", "B", "C", "D"] as Tier[]).map((t) => (
        <TierRow
          key={t}
          tier={t}
          heroes={grouped[t]}
          votes={votes}
          userVotes={userVotes}
          lang={lang}
          onVote={handleVote}
          pendingKeys={pendingKeys}
        />
      ))}

      {grouped.unranked.length > 0 && (
        <TierRow
          tier="unranked"
          heroes={grouped.unranked}
          votes={votes}
          userVotes={userVotes}
          lang={lang}
          onVote={handleVote}
          pendingKeys={pendingKeys}
        />
      )}

      {/* Legend */}
      <p className="mt-6 text-[11px] text-zinc-700 text-center">
        {isJa
          ? "ヒーローをタップ → S/A/B/C/D を選択して投票。同じ選択で投票を取り消せます。"
          : "Tap a hero → select S/A/B/C/D to vote. Tap the same tier again to remove your vote."}
      </p>
    </div>
  );
}
