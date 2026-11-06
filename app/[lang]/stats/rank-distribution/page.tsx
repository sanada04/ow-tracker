import Link from "next/link";
import { getHeroes } from "@/lib/api";
import { getAllTierVotes, getWinningTier } from "@/lib/upstash";
import { getDictionary } from "@/lib/i18n";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import Image from "next/image";
import type { Metadata } from "next";


interface Props { params: Promise<{ lang: string }> }

// Approximate rank distribution for OW2 (community estimates, Season 12+)
const RANK_DISTRIBUTION = [
  { key: "bronze",      pct: 7 },
  { key: "silver",      pct: 20 },
  { key: "gold",        pct: 28 },
  { key: "platinum",    pct: 16 },
  { key: "emerald",     pct: 13 },
  { key: "diamond",     pct: 10 },
  { key: "master",      pct: 4 },
  { key: "grandmaster", pct: 1.5 },
  { key: "champion",    pct: 0.5 },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.rank_page;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: {
      canonical: `https://owtracker.org/${lang}/stats/rank-distribution`,
      languages: {
        ja: "https://owtracker.org/ja/stats/rank-distribution",
        en: "https://owtracker.org/en/stats/rank-distribution",
        ko: "https://owtracker.org/ko/stats/rank-distribution",
        "x-default": "https://owtracker.org/ja/stats/rank-distribution",
      },
    },
  };
}

export default async function RankDistributionPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.rank_page;

  const heroes = await getHeroes(lang);
  const heroKeys = heroes.map((h) => h.key);
  const tierVotes = await getAllTierVotes(heroKeys).catch(() =>
    Object.fromEntries(heroKeys.map((k) => [k, { S: 0, A: 0, B: 0, C: 0, D: 0 }]))
  );

  // Top S/A tier heroes per role
  const topByRole = (["tank", "damage", "support"] as const).map((role) => {
    const roleHeroes = heroes
      .filter((h) => h.role === role)
      .map((h) => ({ hero: h, tier: getWinningTier(tierVotes[h.key]) }))
      .filter((x) => x.tier === "S" || x.tier === "A")
      .sort((a, b) => {
        const order = { S: 0, A: 1, B: 2, C: 3, D: 4 };
        return (order[a.tier!] ?? 9) - (order[b.tier!] ?? 9);
      })
      .slice(0, 5);
    return { role, heroes: roleHeroes };
  });

  const maxPct = Math.max(...RANK_DISTRIBUTION.map((r) => r.pct));

  return (
    <div className="min-h-screen bg-[var(--ow-bg)] text-white">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}
          >
            {t.title}
          </h1>
          <p className="text-zinc-500 text-sm">{t.subtitle}</p>
        </div>

        {/* Rank system explanation */}
        <section className="mb-10">
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs tracking-normal text-zinc-500 font-medium">
              {t.system_title}
            </span>
          </div>
          <p className="text-zinc-400 text-sm mb-6">{t.system_desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RANK_DISTRIBUTION.map(({ key }) => {
              const rankData = t.ranks[key as keyof typeof t.ranks];
              return (
                <div key={key} className="ow-card p-4 flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 mt-0.5"
                    style={{ background: rankData.color }}
                  />
                  <div>
                    <p
                      className="font-bold text-white text-sm"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {key === "champion" ? rankData.name : (
                        <Link href={`/${lang}/stats/ranks/${key}`} className="hover:text-[var(--ow-accent)]">
                          {rankData.name}
                        </Link>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{rankData.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rank distribution chart */}
        <section className="mb-10">
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs tracking-normal text-zinc-500 font-medium">
              {t.distribution_title}
            </span>
          </div>

          <div className="ow-card p-6 space-y-3">
            {RANK_DISTRIBUTION.map(({ key, pct }) => {
              const rankData = t.ranks[key as keyof typeof t.ranks];
              const barPct = (pct / maxPct) * 100;
              const cumulativePct = RANK_DISTRIBUTION
                .slice(RANK_DISTRIBUTION.findIndex((r) => r.key === key) + 1)
                .reduce((s, r) => s + r.pct, 0);

              return (
                <div key={key} className="flex items-center gap-4">
                  <span
                    className="w-28 shrink-0 text-right text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: rankData.color,
                    }}
                  >
                    {rankData.name}
                  </span>
                  <div className="flex-1 h-6 bg-zinc-800 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-700"
                      style={{
                        width: `${barPct}%`,
                        background: rankData.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <div className="w-32 shrink-0 flex flex-col items-start">
                    <span className="text-white text-sm tabular-nums font-medium">{pct}%</span>
                    <span className="text-zinc-500 text-xs">Top {(cumulativePct + pct).toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-500 mt-3">{t.distribution_note}</p>
        </section>

        {/* Your rank CTA */}
        <section className="mb-10">
          <div className="ow-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <h2
                className="text-lg font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.your_rank_title}
              </h2>
              <p className="text-zinc-500 text-sm">{t.your_rank_desc}</p>
            </div>
            <Link
              href={`/${lang}`}
              className="shrink-0 px-5 py-2.5 bg-[var(--ow-accent)] hover:bg-[var(--ow-accent)]/90 text-black font-bold text-sm rounded transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t.search_cta}
            </Link>
          </div>
        </section>

        {/* Top heroes by community tier */}
        <section>
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs tracking-normal text-zinc-500 font-medium">
              {t.top_heroes_title}
            </span>
          </div>
          <p className="text-zinc-500 text-sm mb-6">{t.top_heroes_desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topByRole.map(({ role, heroes: roleHeroes }) => (
              <div key={role} className="ow-card p-4">
                <p
                  className="text-xs tracking-normal text-zinc-500 mb-3 font-medium"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {dict.player.roles[role]}
                </p>
                {roleHeroes.length === 0 ? (
                  <p className="text-zinc-500 text-xs">{dict.meta_page.no_votes}</p>
                ) : (
                  <div className="space-y-2">
                    {roleHeroes.map(({ hero, tier }) => (
                      <Link
                        key={hero.key}
                        href={`/${lang}/heroes/${hero.key}`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={HERO_PORTRAITS[hero.key] ?? hero.portrait}
                          alt={hero.name}
                          width={28}
                          height={28}
                          className="rounded shrink-0"
                          unoptimized
                        />
                        <span
                          className="text-xs text-zinc-300 font-medium flex-1"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {getHeroDisplayName(hero.key)}
                        </span>
                        <span
                          className="text-xs font-bold shrink-0"
                          style={{ color: tier === "S" ? "var(--ow-accent)" : "#84cc16" }}
                        >
                          {tier}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
