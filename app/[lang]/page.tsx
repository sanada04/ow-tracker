import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import { getDictionary } from "@/lib/i18n";
import { getHeroes } from "@/lib/api";
import { getAllTierVotes, getWinningTier } from "@/lib/upstash";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import type { Metadata } from "next";

export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owtracker.org";

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  return {
    title: isEn ? "Overwatch 2 Stats Tracker" : "Overwatch 2 戦績トラッカー",
    description: isEn
      ? "Track Overwatch 2 player ranks, stats, and hero statistics. Search by BattleTag."
      : "Overwatch 2 プレイヤーのランク・勝率・KDA・ヒーロー別スタッツをBattleTagで確認。",
    alternates: { canonical: `/${lang}`, languages: { ja: "/ja", en: "/en", "x-default": "/ja" } },
    openGraph: {
      title: isEn ? "OW Tracker — Overwatch 2 Stats" : "OW Tracker — Overwatch 2 戦績",
      description: isEn
        ? "Track Overwatch 2 player stats, ranks, and hero statistics."
        : "BattleTagで検索するだけ。Overwatch 2 プレイヤー戦績を確認。",
      url: `/${lang}`,
    },
  };
}

const TIER_COLOR: Record<string, string> = {
  S: "#f4a029", A: "#84cc16", B: "#3b82f6", C: "#71717a", D: "#ef4444",
};

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.home;
  const isEn = lang === "en";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OW Tracker",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/${lang}/players/{search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  // Community top picks from Redis
  const heroes = await getHeroes(lang).catch(() => []);
  const heroKeys = heroes.map((h) => h.key);
  const tierVotes = heroKeys.length > 0
    ? await getAllTierVotes(heroKeys).catch(() => Object.fromEntries(heroKeys.map((k) => [k, { S: 0, A: 0, B: 0, C: 0, D: 0 }])))
    : {};

  const topHeroes = heroes
    .map((h) => ({ hero: h, tier: getWinningTier(tierVotes[h.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 }) }))
    .filter((x) => x.tier !== null)
    .sort((a, b) => {
      const order: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, D: 4 };
      return (order[a.tier!] ?? 9) - (order[b.tier!] ?? 9);
    })
    .slice(0, 12);

  const navLinks = [
    { href: `/${lang}/heroes`,                 label: dict.header.nav_heroes },
    { href: `/${lang}/tier-list`,              label: dict.tier_list.nav },
    { href: `/${lang}/meta`,                   label: dict.meta_page.nav },
    { href: `/${lang}/counters`,               label: dict.counters_page.nav },
    { href: `/${lang}/maps`,                   label: dict.maps_page.nav },
    { href: `/${lang}/stats/rank-distribution`, label: dict.rank_page.nav },
    { href: `/${lang}/compare`,                label: dict.header.nav_compare },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0c0c10", color: "#f0f0ff" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Split layout ── */}
      <div
        className="max-w-6xl mx-auto lg:grid lg:min-h-screen"
        style={{ gridTemplateColumns: "1fr 280px", paddingTop: "50px" }}
      >
        {/* ── Left: search panel ── */}
        <div
          className="px-8 py-14 lg:py-20 flex flex-col justify-center"
          style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}
        >
          {/* Page heading */}
          <div className="animate-fade-up" style={{ marginBottom: "2rem", animationDelay: "-40ms" }}>
            <h1
              style={{
                fontFamily: '"Rajdhani", system-ui, sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                lineHeight: 1.05,
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ color: "#f4a029", textShadow: "0 0 40px rgba(244,160,41,0.22)" }}>OW</span>
              <span style={{ color: "#f0f0ff" }}> TRACKER</span>
            </h1>
            <div
              style={{
                marginTop: "0.45rem",
                width: "52px",
                height: "2px",
                background: "linear-gradient(to right, #f4a029, transparent)",
                borderRadius: "1px",
              }}
            />
          </div>

          {/* Mono label */}
          <p
            className="mb-8 animate-fade-up"
            style={{
              fontFamily: "ui-monospace, 'Cascadia Code', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "#3f3f5a",
              animationDelay: "0ms",
            }}
          >
            {isEn ? "OVERWATCH TRACKER — RANK & STATS LOOKUP" : "PLAYER LOOKUP"}
          </p>

          <div className="max-w-xl w-full animate-fade-up" style={{ animationDelay: "60ms", position: "relative", zIndex: 10 }}>
            <SearchBar
              placeholder={dict.search.placeholder}
              buttonText={dict.search.button}
              noResultsText={dict.search.no_results}
              notPublicText={dict.search.not_public}
              lang={lang}
            />

            {/* Notice */}
            <div
              className="mt-3 flex items-start gap-2.5 px-4 py-3"
              style={{
                background: "rgba(202,138,4,0.05)",
                border: "1px solid rgba(202,138,4,0.12)",
                borderRadius: "2px",
              }}
            >
              <span className="shrink-0 mt-px" style={{ color: "#ca8a04", fontSize: "0.8rem" }}>⚠</span>
              <p style={{ fontSize: "0.7rem", lineHeight: 1.6, color: "rgba(254,243,199,0.5)" }}>
                {t.notice.pre}
                <span style={{ color: "rgba(253,224,71,0.8)", fontWeight: 600 }}>{t.notice.highlight}</span>
                {t.notice.post}
                <span style={{ color: "rgba(253,224,71,0.8)", fontWeight: 600 }}>「{t.notice.path}」</span>
              </p>
            </div>
          </div>

          <div className="mt-6 max-w-xl w-full animate-fade-up" style={{ animationDelay: "120ms" }}>
            <SearchHistory lang={lang} labels={dict.home_extra} />
          </div>

          {/* Brand mark — secondary, not hero */}
          <div
            className="mt-16 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <p
              style={{
                fontFamily: '"Rajdhani", system-ui, sans-serif',
                fontSize: "2rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                lineHeight: 1,
                color: "rgba(255,255,255,0.08)",
              }}
            >
              OW<span style={{ color: "rgba(244,160,41,0.12)" }}> TRACKER</span>
            </p>
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "#2a2a3a",
                marginTop: "4px",
              }}
            >
              {isEn ? "OVERWATCH 2 STATS TRACKER" : "OVERWATCH 2 戦績トラッカー"}
            </p>
          </div>
        </div>

        {/* ── Right: data sidebar ── */}
        <div className="hidden lg:block px-5 py-12 space-y-10 overflow-y-auto">
          {/* Nav list — functional, not cards */}
          <div>
            <p
              className="mb-3"
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                color: "#2a2a3a",
              }}
            >
              NAVIGATE
            </p>
            <ul>
              {navLinks.map(({ href, label }) => (
                <li key={href} className="sidebar-nav-item">
                  <Link href={href} className="sidebar-nav-link flex items-center justify-between px-2 py-2.5">
                    <span
                      style={{
                        fontFamily: '"Rajdhani", system-ui, sans-serif',
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {label}
                    </span>
                    <span className="sidebar-nav-arrow" style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.7rem" }}>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community top picks */}
          {topHeroes.length > 0 && (
            <div>
              <p
                className="mb-3"
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  color: "#2a2a3a",
                }}
              >
                COMMUNITY TOP PICKS
              </p>
              <div className="grid grid-cols-4 gap-1">
                {topHeroes.map(({ hero, tier }) => (
                  <Link
                    key={hero.key}
                    href={`/${lang}/heroes/${hero.key}`}
                    className="relative overflow-hidden group"
                    style={{ borderRadius: "2px", aspectRatio: "1" }}
                    title={getHeroDisplayName(hero.key)}
                  >
                    <Image
                      src={HERO_PORTRAITS[hero.key] ?? hero.portrait}
                      alt={hero.name}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-110"
                      unoptimized
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(8,8,16,0.85) 100%)" }}
                    />
                    {tier && (
                      <span
                        className="absolute bottom-1 right-1"
                        style={{
                          fontFamily: "ui-monospace, monospace",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: TIER_COLOR[tier],
                          textShadow: "0 0 6px rgba(0,0,0,0.8)",
                        }}
                      >
                        {tier}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <Link
                href={`/${lang}/tier-list`}
                className="tier-list-link"
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  display: "inline-block",
                  marginTop: "10px",
                }}
              >
                VOTE / FULL LIST →
              </Link>
            </div>
          )}

          {/* Hero count stat */}
          {heroes.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "1.5rem" }}>
              <p
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  color: "#2a2a3a",
                  marginBottom: "6px",
                }}
              >
                ROSTER
              </p>
              <p
                style={{
                  fontFamily: '"Rajdhani", system-ui, sans-serif',
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: "rgba(255,255,255,0.12)",
                  letterSpacing: "-0.02em",
                }}
              >
                {heroes.length}
              </p>
              <p style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.6rem", color: "#2a2a3a", letterSpacing: "0.2em" }}>
                HEROES
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── About section — content for AdSense/SEO ── */}
      <div
        className="max-w-6xl mx-auto px-8 py-12"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "#505070",
            marginBottom: "1rem",
          }}
        >
          {isEn ? "ABOUT" : "このサービスについて"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
          {(isEn ? [
            {
              title: "Player Stats",
              body: "OW Tracker is a free Overwatch tracker and Overwatch rank tracker. Search any Overwatch 2 player by BattleTag to view competitive ranks for Tank, Damage, and Support roles — plus win rate, KDA, and hero stats.",
            },
            {
              title: "Hero Database",
              body: "Detailed Overwatch stats on every OW2 hero: abilities, perks, HP breakdown, role info, and full lore. Updated from the official API.",
            },
            {
              title: "Meta & Counters",
              body: "As a complete Overwatch stats hub, OW Tracker offers a community-voted tier list, counter picks, rank distribution, and map data — all in one place.",
            },
          ] : [
            {
              title: "プレイヤー戦績",
              body: "BattleTagで検索するだけ。タンク・ダメージ・サポートのランク、勝率、KDA、ヒーロー別スタッツを即確認。",
            },
            {
              title: "ヒーロー情報",
              body: "Overwatch 2 の全ヒーローのアビリティ・パーク・HP・ロール・ストーリーを公式APIから最新データで提供。",
            },
            {
              title: "メタ・カウンター",
              body: "コミュニティ投票によるTierList・カウンター情報・ランク分布・マップデータを一か所で確認。",
            },
          ]).map((item) => (
            <div key={item.title}>
              <p
                style={{
                  fontFamily: '"Rajdhani", system-ui, sans-serif',
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "#d8d8f0",
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </p>
              <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "#686888" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile nav (only visible < lg) ── */}
      <div
        className="lg:hidden px-6 py-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p
          className="mb-4"
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "#2a2a3a",
          }}
        >
          NAVIGATE
        </p>
        <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="mobile-nav-link flex items-center justify-between px-4 py-3"
            >
              <span
                style={{
                  fontFamily: '"Rajdhani", system-ui, sans-serif',
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                }}
              >
                {label}
              </span>
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.65rem", color: "#2a2a3a" }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
