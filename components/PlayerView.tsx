"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatBattleTag } from "@/lib/format";
import { fetchPlayer, type PlayerData } from "@/lib/client-api";
import { usePathSegment } from "@/lib/use-path-segment";
import type { Dictionary } from "@/lib/i18n";
import StatsGrid from "@/components/StatsGrid";
import HeroTable from "@/components/HeroTable";
import HeroChart from "@/components/HeroChart";
import AnimatedSection from "@/components/AnimatedSection";
import GamemodeTabs from "@/components/GamemodeTabs";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButtons from "@/components/ShareButtons";
import PlatformRankTabs from "@/components/PlatformRankTabs";
import PlayerHistoryRecorder from "@/components/PlayerHistoryRecorder";
import PageLoader from "@/components/PageLoader";

interface LoadResult {
  key: string;
  data: PlayerData | null;
}

/**
 * The shared shell's generic metadata replaces what player-page.php sent once
 * the page hydrates, so restore the player's values for rendering crawlers.
 */
function applyPlayerMeta(lang: string, playerId: string, username: string) {
  const tag = formatBattleTag(playerId);
  const display = tag ? `${username} (${tag})` : username;
  const title = `${display} — Overwatch Stats | OW Tracker`;
  const descriptions: Record<string, string> = {
    en: `View ${display}'s Overwatch stats: competitive rank, winrate, KDA, and hero statistics.`,
    ja: `${display} の Overwatch 戦績: コンペティティブランク・勝率・KDA・ヒーロー別スタッツを確認。`,
    ko: `${display}의 Overwatch 전적: 경쟁전 랭크, 승률, KDA, 영웅별 통계를 확인하세요.`,
  };
  const description = descriptions[lang] ?? descriptions.en;

  document.title = title;
  const setContent = (selector: string, value: string) =>
    document.querySelectorAll(selector).forEach((tagEl) => tagEl.setAttribute("content", value));
  setContent('meta[name="description"]', description);
  setContent('meta[property="og:title"]', title);
  setContent('meta[property="og:description"]', description);
}

export default function PlayerView({ lang, dict }: { lang: string; dict: Dictionary }) {
  const t = dict.player;
  const playerId = usePathSegment(2);
  const gamemode = useSearchParams().get("gamemode");
  const validGamemode =
    gamemode === "quickplay" || gamemode === "competitive" ? gamemode : undefined;

  const requestKey = `${playerId}|${validGamemode ?? ""}`;
  const [result, setResult] = useState<LoadResult | null>(null);

  useEffect(() => {
    if (!playerId) return;
    let active = true;
    fetchPlayer(playerId, validGamemode)
      .catch(() => null)
      .then((data) => {
        if (active) setResult({ key: requestKey, data });
      });
    return () => {
      active = false;
    };
  }, [playerId, validGamemode, requestKey]);

  const username = result?.key === requestKey ? result.data?.summary.username : undefined;

  useEffect(() => {
    if (username) applyPlayerMeta(lang, playerId, username);
  }, [lang, playerId, username]);

  if (result?.key !== requestKey) return <PageLoader />;

  if (!result.data) {
    return (
      <div className="min-h-screen bg-[var(--ow-bg)] text-white">
        <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
          <div className="inline-block text-5xl font-bold text-[var(--ow-accent)]/20 mb-2"
            style={{ fontFamily: "var(--font-heading)" }}>
            404
          </div>
          <h1 className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>
            {t.not_found}
          </h1>
          <div className="max-w-md mx-auto ow-card p-6 text-left space-y-4">
            <p className="text-xs tracking-normal text-[var(--ow-accent)]/70 mb-3">{t.causes_title}</p>
            <ul className="space-y-3 text-sm">
              {t.causes.map(({ head, body }) => (
                <li key={head} className="flex gap-2.5 text-zinc-400">
                  <span className="text-[var(--ow-accent)] mt-0.5 shrink-0">・</span>
                  <span>
                    <span className="text-white font-semibold">{head}</span>
                    <br /><span className="text-zinc-500 text-xs">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    );
  }

  const { summary, stats } = result.data;
  const pcRank = summary.competitive?.pc ?? null;
  const consoleRank = summary.competitive?.console ?? null;
  const battleTag = formatBattleTag(playerId);

  return (
    <div className="min-h-screen bg-[var(--ow-bg)] text-white">
      {/* Record this player in localStorage history */}
      <PlayerHistoryRecorder playerId={playerId} username={summary.username} avatar={summary.avatar} />

      {/* Player hero banner */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {summary.namecard ? (
          <>
            <Image src={summary.namecard} alt="namecard" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--ow-bg)]/30 via-[var(--ow-bg)]/50 to-[var(--ow-bg)]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--ow-surface)] to-[var(--ow-bg)]" />
        )}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{ backgroundImage: "repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(244,160,41,0.3) 40px, rgba(244,160,41,0.3) 41px)" }} />
        </div>
      </div>

      {/* Player info */}
      <div className="relative max-w-5xl mx-auto px-6 -mt-20 pb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="shrink-0 relative">
            {summary.avatar ? (
              <Image src={summary.avatar} alt={summary.username} width={96} height={96}
                className="rounded border border-zinc-700" unoptimized priority />
            ) : (
              <div className="w-24 h-24 border border-zinc-700 bg-[var(--ow-surface)] rounded flex items-center justify-center text-3xl font-bold text-zinc-300">
                {summary.username[0].toUpperCase()}
              </div>
            )}
            {summary.endorsement && (
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[var(--ow-bg)] border border-zinc-700 flex items-center justify-center">
                <Image src={summary.endorsement.frame} alt="endorsement" width={22} height={22} unoptimized />
              </div>
            )}
          </div>

          {/* Name + tag + title + actions */}
          <div className="flex-1 pt-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-none"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.03em" }}>
              {summary.username}
            </h1>
            {battleTag && <p className="text-[var(--ow-accent)]/70 text-sm mt-1 tracking-normal">{battleTag}</p>}
            {summary.title && <p className="text-zinc-400 text-sm mt-1 italic">&quot;{summary.title}&quot;</p>}
            {summary.privacy === "private" && (
              <span className="inline-block mt-2 text-xs tracking-normal px-2 py-0.5 border border-yellow-600/40 text-yellow-500 bg-yellow-900/10">
                {t.private_label}
              </span>
            )}
            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <FavoriteButton
                playerId={playerId}
                username={summary.username}
                avatar={summary.avatar}
                labels={dict.share}
              />
              <ShareButtons username={summary.username} labels={dict.share} />
            </div>
          </div>

          {/* Platform rank tabs */}
          <PlatformRankTabs
            pcRank={pcRank}
            consoleRank={consoleRank}
            roleLabels={t.roles}
            labels={dict.platform}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-gradient-to-r from-[var(--ow-accent)]/40 via-[var(--ow-accent)]/10 to-transparent mb-8" />
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 pb-16 space-y-10">
        <GamemodeTabs playerId={playerId} lang={lang} current={validGamemode} labels={dict.gamemode} />

        {stats && stats.general.games_played === 0 ? (
          <AnimatedSection>
            <div className="ow-card p-10 text-center text-zinc-500">
              <p className="text-sm">
                {validGamemode === "competitive" ? t.no_data.competitive
                  : validGamemode === "quickplay" ? t.no_data.quickplay
                  : t.no_data.general}
              </p>
            </div>
          </AnimatedSection>
        ) : stats ? (
          <>
            <AnimatedSection>
              <p className="ow-section-title mb-4">{t.overall_stats}</p>
              <StatsGrid stats={stats.general} labels={dict.stats} />
            </AnimatedSection>

            {(stats.roles.tank || stats.roles.damage || stats.roles.support) && (
              <AnimatedSection delay={60}>
                <p className="ow-section-title mb-6">{t.role_stats}</p>
                <div className="space-y-6">
                  {stats.roles.tank && <StatsGrid stats={stats.roles.tank} title={t.roles.tank} labels={dict.stats} />}
                  {stats.roles.damage && <StatsGrid stats={stats.roles.damage} title={t.roles.damage} labels={dict.stats} />}
                  {stats.roles.support && <StatsGrid stats={stats.roles.support} title={t.roles.support} labels={dict.stats} />}
                </div>
              </AnimatedSection>
            )}

            {Object.keys(stats.heroes).length > 0 && (
              <AnimatedSection delay={120}>
                <p className="ow-section-title mb-4">
                  {t.hero_stats}
                  <span className="ml-2 text-xs text-zinc-500 normal-case tracking-normal font-normal"
                    style={{ fontFamily: "inherit", letterSpacing: "0" }}>
                    {t.hero_stats_sub}
                  </span>
                </p>
                <div className="ow-card p-4">
                  <HeroChart
                    heroes={stats.heroes}
                    labels={dict.hero_chart}
                    tableNode={
                      <HeroTable heroes={stats.heroes} headers={dict.hero_table.headers} />
                    }
                  />
                </div>
              </AnimatedSection>
            )}
          </>
        ) : (
          <AnimatedSection>
            <div className="ow-card p-10 text-center text-zinc-500">
              <p className="text-sm">{t.stats_failed}</p>
              <p className="text-xs mt-1 text-zinc-500">{t.stats_failed_sub}</p>
            </div>
          </AnimatedSection>
        )}
      </main>
    </div>
  );
}
