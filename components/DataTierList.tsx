"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { scoreHeroes, type DataTier, type HeroStat, type ScoredHero } from "@/lib/meta-score";
import { DIVISIONS, PLATFORMS, REGIONS, statsFileName, type StatsFilter } from "@/lib/stats-config";
import type { Dictionary } from "@/lib/i18n";
import { HeroCell, TIER_COLORS, TierBadge, type HeroRef } from "@/components/ui/Hero";

type RoleFilter = "all" | "tank" | "damage" | "support";
type SortKey = "score" | "winrate" | "pickrate" | "banrate";

const TIERS: DataTier[] = ["S", "A", "B", "C", "D"];

interface LoadedStats {
  key: string;
  rows: HeroStat[] | null;
}

export default function DataTierList({
  initialRows,
  initialFilter,
  roles,
  heroes,
  lang,
  labels,
  roleLabels,
}: {
  initialRows: HeroStat[];
  initialFilter: StatsFilter;
  roles: Record<string, string>;
  heroes: Record<string, HeroRef>;
  lang: string;
  labels: Dictionary["data"];
  roleLabels: Dictionary["player"]["roles"];
}) {
  const [filter, setFilter] = useState(initialFilter);
  const [role, setRole] = useState<RoleFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [loaded, setLoaded] = useState<LoadedStats>({ key: statsFileName(initialFilter), rows: initialRows });

  const fileName = statsFileName(filter);

  useEffect(() => {
    if (loaded.key === fileName) return;
    let active = true;
    fetch(`/data/stats/${fileName}`)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((rows: HeroStat[] | null) => {
        if (active) setLoaded({ key: fileName, rows });
      });
    return () => {
      active = false;
    };
  }, [fileName, loaded.key]);

  const isLoading = loaded.key !== fileName;
  const scored = useMemo(() => {
    const all = loaded.rows ? scoreHeroes(loaded.rows, roles) : [];
    return role === "all" ? all : all.filter((hero) => hero.role === role);
  }, [loaded.rows, roles, role]);

  const sorted = useMemo(
    () => [...scored].sort((a, b) => b[sortKey] - a[sortKey]),
    [scored, sortKey]
  );

  function updateFilter(next: Partial<StatsFilter>) {
    setFilter((current) => ({ ...current, ...next }));
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "score", label: labels.col_score },
    { key: "winrate", label: labels.col_win },
    { key: "pickrate", label: labels.col_pick },
    { key: "banrate", label: labels.col_ban },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <label className="flex flex-col gap-1 text-sm text-[var(--ow-text-3)]">
          {labels.filter_role}
          <select className="ow-select" value={role} onChange={(e) => setRole(e.target.value as RoleFilter)}>
            <option value="all">{labels.all}</option>
            <option value="tank">{roleLabels.tank}</option>
            <option value="damage">{roleLabels.damage}</option>
            <option value="support">{roleLabels.support}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--ow-text-3)]">
          {labels.filter_rank}
          <select
            className="ow-select"
            value={filter.division}
            onChange={(e) => updateFilter({ division: e.target.value as StatsFilter["division"] })}
          >
            <option value="all">{labels.all_ranks}</option>
            {DIVISIONS.map((division) => (
              <option key={division} value={division}>{labels.ranks[division]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--ow-text-3)]">
          {labels.filter_region}
          <select
            className="ow-select"
            value={filter.region}
            onChange={(e) => updateFilter({ region: e.target.value as StatsFilter["region"] })}
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>{labels.regions[region]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--ow-text-3)]">
          {labels.filter_platform}
          <select
            className="ow-select"
            value={filter.platform}
            onChange={(e) => updateFilter({ platform: e.target.value as StatsFilter["platform"] })}
          >
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>{labels[platform]}</option>
            ))}
          </select>
        </label>
      </div>

      {!isLoading && loaded.rows === null ? (
        <p className="text-[var(--ow-text-2)]">{labels.load_failed}</p>
      ) : (
        <div className={isLoading ? "opacity-50" : undefined} aria-busy={isLoading}>
          <div className="space-y-2 mb-8">
            {TIERS.map((tier) => (
              <TierRow key={tier} tier={tier} heroes={scored.filter((hero) => hero.tier === tier)} refs={heroes} lang={lang} />
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="ow-table min-w-[560px]">
              <thead>
                <tr>
                  <th scope="col">{labels.col_hero}</th>
                  <th scope="col">{labels.stat_tier}</th>
                  {columns.map(({ key, label }) => (
                    <th key={key} scope="col" aria-sort={sortKey === key ? "descending" : "none"}>
                      <button
                        type="button"
                        onClick={() => setSortKey(key)}
                        className={sortKey === key ? "text-[var(--ow-accent)]" : "hover:text-[var(--ow-text)]"}
                      >
                        {label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((hero) => (
                  <tr key={hero.hero}>
                    <td>
                      <HeroCell
                        heroKey={hero.hero}
                        hero={heroes[hero.hero]}
                        lang={lang}
                        note={hero.lowData ? labels.low_data : undefined}
                      />
                    </td>
                    <td><TierBadge tier={hero.tier} /></td>
                    <td>{hero.score}</td>
                    <td>{hero.winrate.toFixed(1)}%</td>
                    <td>{hero.pickrate.toFixed(1)}%</td>
                    <td>{hero.banrate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TierRow({
  tier,
  heroes,
  refs,
  lang,
}: {
  tier: DataTier;
  heroes: ScoredHero[];
  refs: Record<string, HeroRef>;
  lang: string;
}) {
  return (
    <div className="flex items-stretch border border-[var(--ow-line)] rounded overflow-hidden">
      <div
        className="w-12 shrink-0 flex items-center justify-center text-2xl font-bold text-[#101113]"
        style={{ background: TIER_COLORS[tier], fontFamily: "var(--font-heading)" }}
      >
        {tier}
      </div>
      <div className="flex flex-wrap gap-1.5 p-1.5 min-h-14 bg-[var(--ow-surface)] flex-1">
        {heroes.map((hero) => (
          <Link
            key={hero.hero}
            href={`/${lang}/heroes/${hero.hero}`}
            title={`${refs[hero.hero]?.name ?? hero.hero} (${hero.score})`}
            className="relative block w-12 h-12 rounded-sm overflow-hidden"
          >
            {refs[hero.hero]?.portrait && (
              <Image src={refs[hero.hero].portrait} alt={refs[hero.hero].name} fill sizes="48px" className="object-cover object-top" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
