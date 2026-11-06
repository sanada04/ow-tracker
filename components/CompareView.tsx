"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatTimePlayed } from "@/lib/format";
import { fetchPlayer, type PlayerData } from "@/lib/client-api";
import type { Dictionary } from "@/lib/i18n";
import RankBadge from "@/components/RankBadge";
import CompareForm from "@/components/CompareForm";
import { buildBreadcrumbList } from "@/lib/structured-data";

interface LoadResult {
  key: string;
  a: PlayerData | null;
  b: PlayerData | null;
}

function loadPlayer(playerId: string | null): Promise<PlayerData | null> {
  return playerId ? fetchPlayer(playerId).catch(() => null) : Promise.resolve(null);
}

function StatCell({ text, isWinner }: { text: string; isWinner: boolean }) {
  return (
    <div className={`flex-1 text-center py-2 tabular-nums text-sm transition-colors ${
      isWinner ? "text-[var(--ow-accent)] font-bold" : "text-zinc-400"
    }`}>
      {text}
    </div>
  );
}

function StatRow({
  label,
  valA,
  valB,
  higherIsBetter = true,
  format = (v: number) => v.toFixed(2),
}: {
  label: string;
  valA: number | null;
  valB: number | null;
  higherIsBetter?: boolean;
  format?: (v: number) => string;
}) {
  const winner =
    valA !== null && valB !== null
      ? higherIsBetter
        ? valA > valB ? "a" : valA < valB ? "b" : "tie"
        : valA < valB ? "a" : valA > valB ? "b" : "tie"
      : "tie";

  return (
    <div className="flex items-center border-b border-zinc-800/40 last:border-0">
      <StatCell text={valA !== null ? format(valA) : "—"} isWinner={winner === "a"} />
      <div className="w-28 text-center text-xs tracking-normal text-zinc-500 shrink-0">{label}</div>
      <StatCell text={valB !== null ? format(valB) : "—"} isWinner={winner === "b"} />
    </div>
  );
}

function PlayerCard({ data, label }: { data: PlayerData | null; label: string }) {
  if (!data) {
    return (
      <div className="ow-card p-6 text-center text-zinc-500 flex flex-col items-center gap-2">
        <span className="text-3xl">?</span>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-zinc-500">Not found</p>
      </div>
    );
  }
  const { summary } = data;

  return (
    <div className="ow-card overflow-hidden">
      {summary.namecard && (
        <div className="relative h-20 overflow-hidden">
          <Image src={summary.namecard} alt="namecard" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ow-surface)]" />
        </div>
      )}
      <div className="p-4 flex flex-col items-center text-center gap-2 -mt-6 relative">
        {summary.avatar ? (
          <Image src={summary.avatar} alt={summary.username} width={64} height={64}
            className="rounded border border-zinc-700" unoptimized />
        ) : (
          <div className="w-16 h-16 border border-zinc-700 bg-[var(--ow-surface)] rounded flex items-center justify-center text-2xl font-bold text-zinc-300">
            {summary.username[0]?.toUpperCase()}
          </div>
        )}
        <h2 className="text-xl font-bold text-white leading-none"
          style={{ fontFamily: "var(--font-heading)" }}>
          {summary.username}
        </h2>
        {summary.title && <p className="text-zinc-500 text-xs italic">&quot;{summary.title}&quot;</p>}
      </div>
    </div>
  );
}

export default function CompareView({ lang, dict }: { lang: string; dict: Dictionary }) {
  const t = dict.compare;
  const searchParams = useSearchParams();
  const idA = searchParams.get("a");
  const idB = searchParams.get("b");

  const requestKey = `${idA ?? ""}|${idB ?? ""}`;
  const [loaded, setLoaded] = useState<LoadResult | null>(null);

  useEffect(() => {
    if (!idA && !idB) return;
    let active = true;
    Promise.all([loadPlayer(idA), loadPlayer(idB)]).then(([a, b]) => {
      if (active) setLoaded({ key: requestKey, a, b });
    });
    return () => {
      active = false;
    };
  }, [idA, idB, requestKey]);

  const current = loaded?.key === requestKey ? loaded : null;
  const dataA = current?.a ?? null;
  const dataB = current?.b ?? null;

  const statsA = dataA?.stats?.general ?? null;
  const statsB = dataB?.stats?.general ?? null;

  const isEn = lang === "en";
  const breadcrumb = buildBreadcrumbList([
    { name: isEn ? "Home" : "ホーム", path: `/${lang}` },
    { name: t.title, path: `/${lang}/compare` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--ow-bg)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Title */}
        <div className="">
          <p className="ow-section-title mb-2">{t.title}</p>
        </div>

        {/* Form */}
        <div className="ow-card p-5">
          <CompareForm lang={lang} initialA={idA ?? ""} initialB={idB ?? ""} labels={t} />
        </div>

        {/* Results */}
        {(dataA || dataB) && (
          <div className="space-y-6">
            {/* Player cards side by side */}
            <div className="grid grid-cols-2 gap-4">
              <PlayerCard data={dataA} label={t.player_a} />
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold text-zinc-500"
                  style={{ fontFamily: "var(--font-heading)" }}>
                  {t.vs}
                </span>
              </div>
              <PlayerCard data={dataB} label={t.player_b} />
            </div>

            {/* Stats comparison */}
            {(statsA || statsB) && (
              <div className="ow-card overflow-hidden">
                <div className="flex border-b border-zinc-800/60">
                  <div className="flex-1 text-center py-3">
                    <span className="text-sm font-semibold text-white"
                      style={{ fontFamily: "var(--font-heading)" }}>
                      {dataA?.summary.username ?? t.player_a}
                    </span>
                  </div>
                  <div className="w-28 shrink-0" />
                  <div className="flex-1 text-center py-3">
                    <span className="text-sm font-semibold text-white"
                      style={{ fontFamily: "var(--font-heading)" }}>
                      {dataB?.summary.username ?? t.player_b}
                    </span>
                  </div>
                </div>
                <StatRow
                  label={t.stats.games_played}
                  valA={statsA?.games_played ?? null}
                  valB={statsB?.games_played ?? null}
                  format={(v) => v.toFixed(0)}
                />
                <StatRow
                  label={t.stats.winrate}
                  valA={statsA?.winrate ?? null}
                  valB={statsB?.winrate ?? null}
                  format={(v) => `${v.toFixed(1)}%`}
                />
                <StatRow
                  label={t.stats.kda}
                  valA={statsA?.kda ?? null}
                  valB={statsB?.kda ?? null}
                  format={(v) => v.toFixed(2)}
                />
                <StatRow
                  label={t.stats.time_played}
                  valA={statsA?.time_played ?? null}
                  valB={statsB?.time_played ?? null}
                  format={(v) => formatTimePlayed(v)}
                />
                <StatRow
                  label={t.stats.elim_per_10}
                  valA={statsA?.average.eliminations ?? null}
                  valB={statsB?.average.eliminations ?? null}
                  format={(v) => v.toFixed(1)}
                />
                <StatRow
                  label={t.stats.deaths_per_10}
                  valA={statsA?.average.deaths ?? null}
                  valB={statsB?.average.deaths ?? null}
                  higherIsBetter={false}
                  format={(v) => v.toFixed(1)}
                />
              </div>
            )}

            {/* Rank comparison */}
            {(dataA?.summary.competitive || dataB?.summary.competitive) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="ow-card p-4 space-y-3">
                  {dataA?.summary.competitive?.pc && (
                    <RankBadge ranks={dataA.summary.competitive.pc} platform="PC" roleLabels={dict.player.roles} />
                  )}
                  {dataA?.summary.competitive?.console && (
                    <RankBadge ranks={dataA.summary.competitive.console} platform="Console" roleLabels={dict.player.roles} />
                  )}
                  {!dataA?.summary.competitive?.pc && !dataA?.summary.competitive?.console && (
                    <p className="text-zinc-500 text-sm text-center">{t.no_data}</p>
                  )}
                </div>
                <div className="ow-card p-4 space-y-3">
                  {dataB?.summary.competitive?.pc && (
                    <RankBadge ranks={dataB.summary.competitive.pc} platform="PC" roleLabels={dict.player.roles} />
                  )}
                  {dataB?.summary.competitive?.console && (
                    <RankBadge ranks={dataB.summary.competitive.console} platform="Console" roleLabels={dict.player.roles} />
                  )}
                  {!dataB?.summary.competitive?.pc && !dataB?.summary.competitive?.console && (
                    <p className="text-zinc-500 text-sm text-center">{t.no_data}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
