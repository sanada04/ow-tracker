import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import { getDictionary } from "@/lib/i18n";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owtracker.org";

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  return {
    title: isEn ? "Overwatch 2 Stats Tracker" : "Overwatch 2 戦績トラッカー",
    description: isEn
      ? "Track Overwatch 2 player ranks, stats, and hero statistics. Search by BattleTag to instantly view competitive ranks, winrates, KDA, and top heroes."
      : "Overwatch 2 プレイヤーのランク・勝率・KDA・ヒーロー別スタッツをBattleTagで即座に確認。コンペティティブランクも全ロール一覧表示。",
    alternates: {
      canonical: `/${lang}`,
      languages: { ja: "/ja", en: "/en", "x-default": "/ja" },
    },
    openGraph: {
      title: isEn ? "OW Tracker — Overwatch 2 Stats Tracker" : "OW Tracker — Overwatch 2 戦績トラッカー",
      description: isEn
        ? "Track Overwatch 2 player stats, ranks, and hero statistics. Search by BattleTag."
        : "BattleTagで検索するだけ。Overwatch 2 プレイヤーの戦績・ランク・ヒーロースタッツを確認。",
      url: `/${lang}`,
    },
  };
}

const NAV_CARDS = [
  { key: "heroes",    icon: "◆", href: (l: string) => `/${l}/heroes` },
  { key: "tier-list", icon: "◈", href: (l: string) => `/${l}/tier-list` },
  { key: "meta",      icon: "◉", href: (l: string) => `/${l}/meta` },
  { key: "counters",  icon: "⚔", href: (l: string) => `/${l}/counters` },
  { key: "maps",      icon: "◧", href: (l: string) => `/${l}/maps` },
  { key: "compare",   icon: "⇌", href: (l: string) => `/${l}/compare` },
];

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.home;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OW Tracker",
    url: siteUrl,
    description: t.tagline,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/${lang}/players/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const navLabels: Record<string, string> = {
    heroes:    dict.header.nav_heroes,
    "tier-list": dict.tier_list.nav,
    meta:      dict.meta_page.nav,
    counters:  dict.counters_page.nav,
    maps:      dict.maps_page.nav,
    compare:   dict.header.nav_compare,
  };
  const navDescs: Record<string, string> = {
    heroes:    dict.heroes_page.subtitle,
    "tier-list": lang === "en" ? "Community-voted hero tiers" : "コミュニティティアリスト",
    meta:      lang === "en" ? "What's strong right now" : "現在のメタ情報",
    counters:  lang === "en" ? "Counter picks for every hero" : "各ヒーローのカウンター",
    maps:      lang === "en" ? "All Overwatch 2 maps" : "全マップ一覧",
    compare:   lang === "en" ? "Compare two players" : "プレイヤー比較",
  };

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero section ─────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "calc(100vh - 60px)", paddingTop: "120px", paddingBottom: "80px" }}
      >
        {/* Background: dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(244,160,41,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 0%, transparent 30%, #080810 100%)",
          }}
        />
        {/* Orange glow behind title */}
        <div
          className="absolute top-1/3 left-1/2 pointer-events-none"
          style={{
            width: "600px",
            height: "300px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse, rgba(244,160,41,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-3 mb-8 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-bold"
              style={{ color: "rgba(244,160,41,0.6)" }}
            >
              {t.subtitle}
            </span>
          </div>

          {/* Main title */}
          <h1
            className="animate-fade-up mb-4"
            style={{
              fontFamily: '"Rajdhani", system-ui, sans-serif',
              fontWeight: 900,
              fontSize: "clamp(4rem, 12vw, 7.5rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.9,
              animationDelay: "60ms",
            }}
          >
            <span style={{ color: "#ffffff" }}>OW</span>
            <span style={{ color: "#f4a029" }}> TRACKER</span>
          </h1>

          {/* Orange accent line */}
          <div
            className="animate-fade-up mb-8"
            style={{ animationDelay: "100ms" }}
          >
            <div className="ow-divider" style={{ width: "120px", margin: "0 auto" }} />
          </div>

          <p
            className="text-zinc-400 text-sm mb-10 max-w-md animate-fade-up"
            style={{ letterSpacing: "0.02em", animationDelay: "120ms" }}
          >
            {t.tagline}
          </p>

          {/* Search */}
          <div className="w-full animate-fade-up" style={{ animationDelay: "160ms" }}>
            <SearchBar
              placeholder={dict.search.placeholder}
              buttonText={dict.search.button}
              noResultsText={dict.search.no_results}
              notPublicText={dict.search.not_public}
              lang={lang}
            />
            <div
              className="mt-3 flex items-start gap-2.5 px-4 py-3 animate-fade-up"
              style={{
                background: "rgba(202,138,4,0.06)",
                border: "1px solid rgba(202,138,4,0.15)",
                borderRadius: "2px",
                animationDelay: "200ms",
              }}
            >
              <span className="text-yellow-500 text-base leading-none mt-px shrink-0">⚠</span>
              <p className="text-xs text-yellow-200/60 leading-relaxed">
                {t.notice.pre}
                <span className="text-yellow-300/90 font-semibold">{t.notice.highlight}</span>
                {t.notice.post}
                <span className="text-yellow-300/90 font-semibold">「{t.notice.path}」</span>
              </p>
            </div>
          </div>

          {/* Search history */}
          <div className="w-full mt-6 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <SearchHistory lang={lang} labels={dict.home_extra} />
          </div>
        </div>
      </section>

      {/* ── Quick nav grid ──────────────────────────────────────────── */}
      <section
        className="relative"
        style={{ background: "linear-gradient(to bottom, #080810, #0c0c18, #080810)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-10">
            <span className="ow-section-title">Explore</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {NAV_CARDS.map(({ key, icon, href }, i) => (
              <Link
                key={key}
                href={href(lang)}
                className="ow-card-featured group flex flex-col items-center gap-3 p-5 text-center animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span
                  className="text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ color: "#f4a029" }}
                >
                  {icon}
                </span>
                <div>
                  <p
                    className="text-white text-xs font-bold mb-1 group-hover:text-[#f4a029] transition-colors"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.1em" }}
                  >
                    {navLabels[key]}
                  </p>
                  <p className="text-zinc-600 text-[10px] leading-tight">{navDescs[key]}</p>
                </div>
                <span
                  className="text-[10px] text-zinc-700 group-hover:text-[#f4a029] transition-colors"
                  style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features / Stats strip ──────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            {t.features.map(({ icon, label, desc }, i) => (
              <div
                key={label}
                className="flex items-start gap-4 p-8 animate-fade-up"
                style={{ background: "#080810", animationDelay: `${i * 80}ms` }}
              >
                <span className="text-[#f4a029] text-2xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p
                    className="text-white font-bold text-sm mb-1"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.08em" }}
                  >
                    {label}
                  </p>
                  <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
