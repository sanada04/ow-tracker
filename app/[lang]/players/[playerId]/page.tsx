import Image from "next/image";
import { getPlayerSummary, getPlayerStats, formatBattleTag } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import RankBadge from "@/components/RankBadge";
import StatsGrid from "@/components/StatsGrid";
import HeroTable from "@/components/HeroTable";
import AnimatedSection from "@/components/AnimatedSection";
import GamemodeTabs from "@/components/GamemodeTabs";

interface Props {
  params: Promise<{ lang: string; playerId: string }>;
  searchParams: Promise<{ gamemode?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { playerId, lang } = await params;
  const isEn = lang === "en";
  try {
    const summary = await getPlayerSummary(playerId);
    const tag = formatBattleTag(playerId);
    const display = tag ? `${summary.username} (${tag})` : summary.username;
    const description = isEn
      ? `View ${display}'s Overwatch 2 stats: competitive rank, winrate, KDA, and hero statistics.`
      : `${display} の Overwatch 2 戦績: コンペティティブランク・勝率・KDA・ヒーロー別スタッツを確認。`;
    return {
      title: `${display} — Overwatch 2 Stats`,
      description,
      alternates: { canonical: `/${lang}/players/${playerId}` },
      openGraph: {
        title: `${display} | OW Tracker`,
        description,
        images: summary.avatar
          ? [{ url: summary.avatar, width: 128, height: 128, alt: summary.username }]
          : [],
      },
      twitter: {
        card: "summary" as const,
        title: `${display} | OW Tracker`,
        description,
        images: summary.avatar ? [summary.avatar] : [],
      },
    };
  } catch {
    const tag = formatBattleTag(playerId);
    const name = tag ?? decodeURIComponent(playerId);
    return {
      title: `${name} — OW Tracker`,
      description: isEn
        ? `${name}'s Overwatch 2 stats on OW Tracker.`
        : `${name} の Overwatch 2 戦績 — OW Tracker`,
    };
  }
}

export default async function PlayerPage({ params, searchParams }: Props) {
  const { lang, playerId } = await params;
  const { gamemode } = await searchParams;
  const dict = getDictionary(lang);
  const t = dict.player;

  const validGamemode =
    gamemode === "quickplay" || gamemode === "competitive" ? gamemode : undefined;

  let summary;
  try {
    summary = await getPlayerSummary(playerId);
  } catch {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white">
        <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8 animate-fade-up">
          <div className="inline-block text-5xl font-bold text-[#f4a029]/20 mb-2"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
            404
          </div>
          <h1 className="text-2xl font-bold text-white"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.08em" }}>
            {t.not_found}
          </h1>
          <div className="max-w-md mx-auto ow-card p-6 text-left space-y-4">
            <p className="text-[11px] uppercase tracking-widest text-[#f4a029]/70 mb-3">{t.causes_title}</p>
            <ul className="space-y-3 text-sm">
              {t.causes.map(({ head, body }) => (
                <li key={head} className="flex gap-2.5 text-zinc-400">
                  <span className="text-[#f4a029] mt-0.5 shrink-0">▸</span>
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

  const stats = await getPlayerStats(playerId, validGamemode).catch(() => null);
  const pcRank = summary.competitive?.pc;
  const consoleRank = summary.competitive?.console;
  const battleTag = formatBattleTag(playerId);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      {/* Player hero banner */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {summary.namecard ? (
          <>
            <Image src={summary.namecard} alt="namecard" fill className="object-cover" unoptimized priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/30 via-[#0a0a12]/50 to-[#0a0a12]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#131320] to-[#0a0a12]" />
        )}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{ backgroundImage: "repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(244,160,41,0.3) 40px, rgba(244,160,41,0.3) 41px)" }} />
        </div>
      </div>

      {/* Player info */}
      <div className="relative max-w-5xl mx-auto px-6 -mt-20 pb-6 animate-fade-up">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="shrink-0 relative">
            {summary.avatar ? (
              <Image src={summary.avatar} alt={summary.username} width={96} height={96}
                className="rounded border-2 border-[#f4a029]" unoptimized priority
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }} />
            ) : (
              <div className="w-24 h-24 border-2 border-[#f4a029] bg-[#131320] flex items-center justify-center text-3xl font-bold text-[#f4a029]"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}>
                {summary.username[0].toUpperCase()}
              </div>
            )}
            {summary.endorsement && (
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#0a0a12] border border-zinc-700 flex items-center justify-center">
                <Image src={summary.endorsement.frame} alt="endorsement" width={22} height={22} unoptimized />
              </div>
            )}
          </div>

          {/* Name + tag + title */}
          <div className="flex-1 pt-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-none"
              style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.03em" }}>
              {summary.username}
            </h1>
            {battleTag && <p className="text-[#f4a029]/70 text-sm mt-1 tracking-wider">{battleTag}</p>}
            {summary.title && <p className="text-zinc-400 text-sm mt-1 italic">"{summary.title}"</p>}
            {summary.privacy === "private" && (
              <span className="inline-block mt-2 text-[11px] uppercase tracking-widest px-2 py-0.5 border border-yellow-600/40 text-yellow-500 bg-yellow-900/10">
                {t.private_label}
              </span>
            )}
          </div>

          {/* Ranks */}
          {(pcRank || consoleRank) && (
            <div className="flex flex-col gap-4 shrink-0">
              {pcRank && <RankBadge ranks={pcRank} platform="PC" roleLabels={t.roles} />}
              {consoleRank && <RankBadge ranks={consoleRank} platform="Console" roleLabels={t.roles} />}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-gradient-to-r from-[#f4a029]/40 via-[#f4a029]/10 to-transparent mb-8" />
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
                  <span className="ml-2 text-xs text-zinc-600 normal-case tracking-normal font-normal"
                    style={{ fontFamily: "inherit", letterSpacing: "0" }}>
                    {t.hero_stats_sub}
                  </span>
                </p>
                <div className="ow-card p-4">
                  <HeroTable heroes={stats.heroes} headers={dict.hero_table.headers} />
                </div>
              </AnimatedSection>
            )}
          </>
        ) : (
          <AnimatedSection>
            <div className="ow-card p-10 text-center text-zinc-500">
              <p className="text-sm">{t.stats_failed}</p>
              <p className="text-xs mt-1 text-zinc-600">{t.stats_failed_sub}</p>
            </div>
          </AnimatedSection>
        )}
      </main>
    </div>
  );
}
