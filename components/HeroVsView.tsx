"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchHero, fetchTierVotes } from "@/lib/client-api";
import { getWinningTier } from "@/lib/tiers";
import type { TierVotes } from "@/lib/tiers";
import type { Dictionary } from "@/lib/i18n";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import { usePathSegment } from "@/lib/use-path-segment";
import type { HeroDetail, HeroListItem } from "@/types/overwatch";
import PageLoader from "@/components/PageLoader";

interface LoadResult {
  key: string;
  heroA: HeroDetail | null;
  heroB: HeroDetail | null;
  tierVotes: Record<string, TierVotes>;
}

const TIER_COLORS: Record<string, string> = {
  S: "#f4a029",
  A: "#84cc16",
  B: "#3b82f6",
  C: "#71717a",
  D: "#ef4444",
};

function StatRow({
  label,
  valA,
  valB,
  highlight,
}: {
  label: string;
  valA: string | number | null;
  valB: string | number | null;
  highlight?: boolean;
}) {
  const numA = typeof valA === "number" ? valA : null;
  const numB = typeof valB === "number" ? valB : null;
  const aWins = numA !== null && numB !== null && numA > numB;
  const bWins = numA !== null && numB !== null && numB > numA;
  return (
    <div className={`grid grid-cols-3 items-center py-3 border-b border-zinc-800/50 last:border-0 ${highlight ? "bg-zinc-800/10" : ""}`}>
      <span className={`text-sm text-right pr-4 tabular-nums ${aWins ? "text-[#00ccff] font-semibold" : "text-zinc-300"}`}>
        {valA ?? "—"}
      </span>
      <span className="text-xs text-center text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className={`text-sm text-left pl-4 tabular-nums ${bWins ? "text-[#00ccff] font-semibold" : "text-zinc-300"}`}>
        {valB ?? "—"}
      </span>
    </div>
  );
}


export default function HeroVsView({
  lang,
  dict,
  heroes,
}: {
  lang: string;
  dict: Dictionary;
  heroes: HeroListItem[];
}) {
  const t = dict.hero_vs;
  const heroId = usePathSegment(2);
  const vsId = usePathSegment(4);

  const requestKey = `${heroId}|${vsId}`;
  const [loaded, setLoaded] = useState<LoadResult | null>(null);

  useEffect(() => {
    if (!heroId || !vsId) return;
    let active = true;
    Promise.all([
      fetchHero(heroId, lang).catch(() => null),
      fetchHero(vsId, lang).catch(() => null),
      fetchTierVotes().catch(() => ({})),
    ]).then(([heroA, heroB, tierVotes]) => {
      if (active) setLoaded({ key: requestKey, heroA, heroB, tierVotes });
    });
    return () => {
      active = false;
    };
  }, [heroId, vsId, lang, requestKey]);

  if (loaded?.key !== requestKey) return <PageLoader />;

  const { heroA, heroB, tierVotes } = loaded;
  const noVotes = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  const nameA = getHeroDisplayName(heroId);
  const nameB = getHeroDisplayName(vsId);
  const portraitA = HERO_PORTRAITS[heroId] ?? heroA?.portrait ?? "";
  const portraitB = HERO_PORTRAITS[vsId] ?? heroB?.portrait ?? "";
  const tierA = getWinningTier(tierVotes[heroId] ?? noVotes);
  const tierB = getWinningTier(tierVotes[vsId] ?? noVotes);

  // Other heroes for "more matchups"
  const otherHeroes = heroes.filter((h) => h.key !== heroId && h.key !== vsId).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          href={`/${lang}/heroes/${heroId}`}
          className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
        >
          {t.back_to_hero.replace("{hero}", nameA)}
        </Link>

        {/* Hero A vs B header */}
        <div className="ow-card p-6 mb-8">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Hero A */}
            <div className="flex flex-col items-center gap-3">
              {portraitA && (
                <Image src={portraitA} alt={nameA} width={96} height={96} className="rounded" unoptimized />
              )}
              <Link
                href={`/${lang}/heroes/${heroId}`}
                className="text-xl font-bold text-white hover:text-[#00ccff] transition-colors text-center"
                style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
              >
                {nameA}
              </Link>
              {heroA && (
                <span className="text-xs text-zinc-500 uppercase tracking-wider border border-zinc-700/50 px-2 py-0.5 rounded">
                  {dict.player.roles[heroA.role as "tank" | "damage" | "support"] ?? heroA.role}
                </span>
              )}
            </div>

            {/* VS */}
            <div className="text-center">
              <span
                className="text-3xl font-black text-zinc-600"
                style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
              >
                VS
              </span>
            </div>

            {/* Hero B */}
            <div className="flex flex-col items-center gap-3">
              {portraitB && (
                <Image src={portraitB} alt={nameB} width={96} height={96} className="rounded" unoptimized />
              )}
              <Link
                href={`/${lang}/heroes/${vsId}`}
                className="text-xl font-bold text-white hover:text-[#00ccff] transition-colors text-center"
                style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
              >
                {nameB}
              </Link>
              {heroB && (
                <span className="text-xs text-zinc-500 uppercase tracking-wider border border-zinc-700/50 px-2 py-0.5 rounded">
                  {dict.player.roles[heroB.role as "tank" | "damage" | "support"] ?? heroB.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hero descriptions */}
        {(heroA?.description || heroB?.description) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {heroA?.description && (
              <div className="ow-card p-4">
                <p className="text-[11px] uppercase tracking-widest text-[#505070] mb-2">{nameA}</p>
                <p className="text-[#9090b0] text-sm leading-relaxed">{heroA.description}</p>
              </div>
            )}
            {heroB?.description && (
              <div className="ow-card p-4">
                <p className="text-[11px] uppercase tracking-widest text-[#505070] mb-2">{nameB}</p>
                <p className="text-[#9090b0] text-sm leading-relaxed">{heroB.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Stats comparison */}
        <section className="mb-8">
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              {t.stats_compare}
            </span>
          </div>
          <div className="ow-card">
            {/* Column headers */}
            <div className="grid grid-cols-3 items-center pb-2 border-b border-zinc-800 mb-1 px-4 pt-4">
              <span className="text-xs text-zinc-600 text-right pr-4">{nameA}</span>
              <span className="text-xs text-zinc-600 text-center">Stat</span>
              <span className="text-xs text-zinc-600 text-left pl-4">{nameB}</span>
            </div>
            <div className="px-4 pb-2">
              <StatRow
                label={t.hp_total}
                valA={heroA?.hitpoints?.total ?? null}
                valB={heroB?.hitpoints?.total ?? null}
                highlight
              />
              <StatRow
                label={t.hp_health}
                valA={heroA?.hitpoints?.health ?? null}
                valB={heroB?.hitpoints?.health ?? null}
              />
              <StatRow
                label={t.hp_armor}
                valA={heroA?.hitpoints?.armor ?? null}
                valB={heroB?.hitpoints?.armor ?? null}
              />
              <StatRow
                label={t.hp_shields}
                valA={heroA?.hitpoints?.shields ?? null}
                valB={heroB?.hitpoints?.shields ?? null}
              />
              <StatRow
                label={t.abilities}
                valA={heroA ? heroA.abilities.length : null}
                valB={heroB ? heroB.abilities.length : null}
              />
              <StatRow
                label={t.perks}
                valA={heroA?.perks ? (heroA.perks.minor.length + heroA.perks.major.length) : null}
                valB={heroB?.perks ? (heroB.perks.minor.length + heroB.perks.major.length) : null}
              />
              <StatRow
                label={t.community_tier}
                valA={tierA ?? t.no_tier}
                valB={tierB ?? t.no_tier}
              />
            </div>
          </div>
        </section>

        {/* Community Tiers */}
        {(tierA || tierB) && (
          <section className="mb-8">
            <div className="mb-4 pb-2 border-b border-zinc-800">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                {t.community_tier}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: heroId, name: nameA, tier: tierA },
                { key: vsId, name: nameB, tier: tierB },
              ].map(({ key, name, tier }) => (
                <div key={key} className="ow-card p-4 text-center">
                  <p className="text-xs text-zinc-500 mb-2">{name}</p>
                  {tier ? (
                    <span
                      className="text-4xl font-black"
                      style={{
                        fontFamily: '"Rajdhani", system-ui, sans-serif',
                        color: TIER_COLORS[tier] ?? "#fff",
                      }}
                    >
                      {tier}
                    </span>
                  ) : (
                    <span className="text-zinc-600 text-sm">{t.no_tier}</span>
                  )}
                  <p className="text-xs text-zinc-600 mt-1">{t.community_tier}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Counter links */}
        <section className="mb-8">
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              {t.counters}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/${lang}/counters/${heroId}`}
              className="ow-card p-4 flex items-center gap-3 hover:border-[#00ccff]/35 transition-colors"
            >
              {portraitA && (
                <Image src={portraitA} alt={nameA} width={36} height={36} className="rounded shrink-0" unoptimized />
              )}
              <span className="text-sm text-zinc-300">
                {t.counter_a.replace("{a}", nameA)}
              </span>
              <span className="ml-auto text-zinc-600">›</span>
            </Link>
            <Link
              href={`/${lang}/counters/${vsId}`}
              className="ow-card p-4 flex items-center gap-3 hover:border-[#00ccff]/35 transition-colors"
            >
              {portraitB && (
                <Image src={portraitB} alt={nameB} width={36} height={36} className="rounded shrink-0" unoptimized />
              )}
              <span className="text-sm text-zinc-300">
                {t.counter_b.replace("{b}", nameB)}
              </span>
              <span className="ml-auto text-zinc-600">›</span>
            </Link>
          </div>
        </section>

        {/* More matchups */}
        <section>
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              {t.more_matchups}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {otherHeroes.map((hero) => (
              <Link
                key={hero.key}
                href={`/${lang}/heroes/${heroId}/vs/${hero.key}`}
                className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
              >
                {nameA} vs {getHeroDisplayName(hero.key)}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
