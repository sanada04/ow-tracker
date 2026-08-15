import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import { getDictionary } from "@/lib/i18n";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ow-tracker.example.com";

interface Props {
  params: Promise<{ lang: string }>;
}

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

  return (
    <div className="bg-[#0a0a12] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex flex-col items-center px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-600 mb-3">{t.subtitle}</p>
          <h1
            className="text-6xl sm:text-7xl font-bold tracking-tight leading-none mb-4"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
          >
            <span className="text-white">OW</span>
            <span className="text-[#f4a029]"> TRACKER</span>
          </h1>
          <p className="text-zinc-500 text-sm">{t.tagline}</p>
        </div>

        {/* Search */}
        <div className="w-full max-w-2xl mb-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <SearchBar
            placeholder={dict.search.placeholder}
            buttonText={dict.search.button}
            noResultsText={dict.search.no_results}
            notPublicText={dict.search.not_public}
            lang={lang}
          />
          <div className="mt-3 flex items-start gap-2.5 px-4 py-3 bg-yellow-900/10 border border-yellow-600/20 rounded">
            <span className="text-yellow-500 text-base leading-none mt-px shrink-0">⚠</span>
            <p className="text-xs text-yellow-200/70 leading-relaxed">
              {t.notice.pre}
              <span className="text-yellow-300 font-semibold">{t.notice.highlight}</span>
              {t.notice.post}
              <span className="text-yellow-300 font-semibold">「{t.notice.path}」</span>
            </p>
          </div>
        </div>

        {/* Search history + favorites */}
        <SearchHistory lang={lang} labels={dict.home_extra} />

        {/* Quick nav cards */}
        <div className="w-full max-w-2xl grid grid-cols-2 gap-3 mt-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <Link
            href={`/${lang}/heroes`}
            className="ow-card-sm p-4 flex items-center gap-3 hover:border-[#f4a029]/40 transition-colors group"
          >
            <span className="text-[#f4a029] text-2xl leading-none">◆</span>
            <div>
              <p className="text-white text-xs font-semibold"
                style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}>
                {dict.header.nav_heroes}
              </p>
              <p className="text-zinc-600 text-[11px] leading-tight">{dict.heroes_page.subtitle}</p>
            </div>
            <span className="ml-auto text-zinc-700 group-hover:text-[#f4a029] transition-colors text-sm">→</span>
          </Link>
          <Link
            href={`/${lang}/compare`}
            className="ow-card-sm p-4 flex items-center gap-3 hover:border-[#f4a029]/40 transition-colors group"
          >
            <span className="text-[#f4a029] text-2xl leading-none">⇌</span>
            <div>
              <p className="text-white text-xs font-semibold"
                style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}>
                {dict.header.nav_compare}
              </p>
              <p className="text-zinc-600 text-[11px] leading-tight">{dict.compare.title}</p>
            </div>
            <span className="ml-auto text-zinc-700 group-hover:text-[#f4a029] transition-colors text-sm">→</span>
          </Link>
        </div>

        {/* Feature hints */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl w-full animate-fade-up" style={{ animationDelay: "280ms" }}>
          {t.features.map(({ icon, label, desc }) => (
            <div key={label} className="ow-card-sm p-4 text-center">
              <div className="text-[#f4a029] text-xl mb-1.5">{icon}</div>
              <p className="text-white text-xs font-semibold mb-1"
                style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}>
                {label}
              </p>
              <p className="text-zinc-600 text-[11px] leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
