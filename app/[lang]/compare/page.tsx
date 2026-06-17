import Image from "next/image";
import Link from "next/link";
import { getPlayerSummary, getPlayerStats, formatBattleTag, formatTimePlayed } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import RankBadge from "@/components/RankBadge";
import CompareForm from "@/components/CompareForm";
import type { PlayerSummary, PlayerStatsSummary } from "@/types/overwatch";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}

interface PlayerData {
  summary: PlayerSummary;
  stats: PlayerStatsSummary | null;
}

async function fetchPlayer(playerId: string): Promise<PlayerData | null> {
  try {
    const summary = await getPlayerSummary(playerId);
    const stats = await getPlayerStats(playerId).catch(() => null);
    return { summary, stats };
  } catch {
    return null;
  }
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

  function Cell({ val, side }: { val: number | null; side: "a" | "b" }) {
    const isWinner = winner === side;
    return (
      <div className={`flex-1 text-center py-2 tabular-nums text-sm transition-colors ${
        isWinner ? "text-[#f4a029] font-bold" : "text-zinc-400"
      }`}>
        {val !== null ? format(val) : "—"}
      </div>
    );
  }

  return (
    <div className="flex items-center border-b border-zinc-800/40 last:border-0">
      <Cell val={valA} side="a" />
      <div className="w-28 text-center text-[10px] uppercase tracking-widest text-zinc-600 shrink-0">{label}</div>
      <Cell val={valB} side="b" />
    </div>
  );
}

function PlayerCard({ data, label, lang }: { data: PlayerData | null; label: string; lang: string }) {
  if (!data) {
    return (
      <div className="ow-card p-6 text-center text-zinc-500 flex flex-col items-center gap-2">
        <span className="text-3xl">?</span>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-zinc-600">Not found</p>
      </div>
    );
  }
  const { summary } = data;
  const tag = formatBattleTag;
  const battleTag = formatBattleTag(
    // reconstruct the playerId from the summary — we don't have it here
    // but the display is fine with just username
    summary.username
  );

  return (
    <div className="ow-card overflow-hidden">
      {summary.namecard && (
        <div className="relative h-20 overflow-hidden">
          <Image src={summary.namecard} alt="namecard" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#131320]" />
        </div>
      )}
      <div className="p-4 flex flex-col items-center text-center gap-2 -mt-6 relative">
        {summary.avatar ? (
          <Image src={summary.avatar} alt={summary.username} width={64} height={64}
            className="rounded border-2 border-[#f4a029]" unoptimized
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }} />
        ) : (
          <div className="w-16 h-16 border-2 border-[#f4a029] bg-[#0a0a12] flex items-center justify-center text-2xl font-bold text-[#f4a029]"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}>
            {summary.username[0]?.toUpperCase()}
          </div>
        )}
        <h2 className="text-xl font-bold text-white leading-none"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          {summary.username}
        </h2>
        {summary.title && <p className="text-zinc-500 text-xs italic">"{summary.title}"</p>}
      </div>
    </div>
  );
}

export default async function ComparePage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { a: idA, b: idB } = await searchParams;
  const dict = getDictionary(lang);
  const t = dict.compare;

  const [dataA, dataB] = await Promise.all([
    idA ? fetchPlayer(idA) : Promise.resolve(null),
    idB ? fetchPlayer(idB) : Promise.resolve(null),
  ]);

  const statsA = dataA?.stats?.general ?? null;
  const statsB = dataB?.stats?.general ?? null;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Title */}
        <div className="animate-fade-up">
          <p className="ow-section-title mb-2">{t.title}</p>
        </div>

        {/* Form */}
        <div className="ow-card p-5 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <CompareForm lang={lang} initialA={idA ?? ""} initialB={idB ?? ""} labels={t} />
        </div>

        {/* Results */}
        {(dataA || dataB) && (
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: "120ms" }}>
            {/* Player cards side by side */}
            <div className="grid grid-cols-2 gap-4">
              <PlayerCard data={dataA} label={t.player_a} lang={lang} />
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold text-zinc-700"
                  style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                  {t.vs}
                </span>
              </div>
              <PlayerCard data={dataB} label={t.player_b} lang={lang} />
            </div>

            {/* Stats comparison */}
            {(statsA || statsB) && (
              <div className="ow-card overflow-hidden">
                <div className="flex border-b border-zinc-800/60">
                  <div className="flex-1 text-center py-3">
                    <span className="text-sm font-semibold text-white"
                      style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                      {dataA?.summary.username ?? t.player_a}
                    </span>
                  </div>
                  <div className="w-28 shrink-0" />
                  <div className="flex-1 text-center py-3">
                    <span className="text-sm font-semibold text-white"
                      style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
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
                    <p className="text-zinc-600 text-sm text-center">{t.no_data}</p>
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
                    <p className="text-zinc-600 text-sm text-center">{t.no_data}</p>
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
