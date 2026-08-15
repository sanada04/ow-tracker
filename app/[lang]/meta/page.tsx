import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getHeroes } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import { getAllTierVotes, getWinningTier, getTotalVotes, TIERS } from "@/lib/upstash";
import type { Tier, TierVotes } from "@/lib/upstash";
import type { HeroListItem } from "@/types/overwatch";

export const revalidate = 30;

const TIER_STYLE: Record<Tier, { border: string; label: string; bg: string; text: string }> = {
  S: { border: "#f4a029", label: "#f4a029", bg: "rgba(244,160,41,0.10)", text: "#f4a029" },
  A: { border: "#84cc16", label: "#a3e635", bg: "rgba(132,204,22,0.08)", text: "#a3e635" },
  B: { border: "#3b82f6", label: "#60a5fa", bg: "rgba(59,130,246,0.08)", text: "#60a5fa" },
  C: { border: "#52525b", label: "#a1a1aa", bg: "rgba(113,113,122,0.08)", text: "#a1a1aa" },
  D: { border: "#ef4444", label: "#f87171", bg: "rgba(239,68,68,0.08)", text: "#f87171" },
};

const ROLE_COLORS = {
  tank:    { accent: "#60a5fa", border: "border-blue-500/30",  bg: "bg-blue-950/20"  },
  damage:  { accent: "#f87171", border: "border-red-500/30",   bg: "bg-red-950/20"   },
  support: { accent: "#4ade80", border: "border-green-500/30", bg: "bg-green-950/20" },
};

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.meta_page;
  return {
    title: `${t.title} — OW Tracker`,
    description: t.subtitle,
    alternates: {
      canonical: `https://owtracker.org/${lang}/meta`,
      languages: { ja: "https://owtracker.org/ja/meta", en: "https://owtracker.org/en/meta" },
    },
  };
}

function HeroPortrait({
  hero,
  votes,
  lang,
}: {
  hero: HeroListItem;
  votes: TierVotes;
  lang: string;
}) {
  const winning = getWinningTier(votes);
  const total = getTotalVotes(votes);
  const style = winning ? TIER_STYLE[winning] : null;

  return (
    <Link
      href={`/${lang}/heroes/${hero.key}`}
      className="group flex flex-col items-center gap-1.5 p-2 rounded hover:bg-white/5 transition-colors"
    >
      <div className="relative w-14 h-14 rounded overflow-hidden bg-zinc-800">
        <Image
          src={hero.portrait}
          alt={hero.name}
          fill
          unoptimized
          className="object-cover object-top"
        />
        {winning && (
          <div
            className="absolute inset-0 border-2 rounded"
            style={{ borderColor: style!.border }}
          />
        )}
      </div>
      <span
        className="text-[9px] uppercase tracking-wide text-center leading-tight w-full truncate"
        style={{ color: style?.label ?? "#52525b" }}
      >
        {hero.name}
      </span>
      {total > 0 && (
        <span className="text-[9px] text-zinc-700">{total}</span>
      )}
    </Link>
  );
}

export default async function MetaPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.meta_page;
  const isJa = lang === "ja";

  const heroes = await getHeroes(lang).catch(() => [] as HeroListItem[]);
  const votes = await getAllTierVotes(heroes.map((h) => h.key)).catch(
    () => ({}) as Record<string, TierVotes>
  );

  const totalVotes = heroes.reduce((sum, h) => {
    const v = votes[h.key];
    return sum + (v ? getTotalVotes(v) : 0);
  }, 0);

  // Group heroes by their community-winning tier
  const grouped: Record<Tier | "unranked", HeroListItem[]> = {
    S: [], A: [], B: [], C: [], D: [], unranked: [],
  };
  for (const hero of heroes) {
    const w = getWinningTier(votes[hero.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 });
    (w ? grouped[w] : grouped.unranked).push(hero);
  }

  // Top heroes by role (from S+A tiers)
  const topByRole = (["tank", "damage", "support"] as const).map((role) => {
    const roleHeroes = heroes
      .filter((h) => h.role === role)
      .sort((a, b) => {
        const wa = getWinningTier(votes[a.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 });
        const wb = getWinningTier(votes[b.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 });
        const tierOrder: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, D: 4, unranked: 5 };
        return (tierOrder[wa ?? "unranked"] ?? 5) - (tierOrder[wb ?? "unranked"] ?? 5);
      })
      .slice(0, 5);
    return { role, heroes: roleHeroes };
  });

  const roleLabels = {
    tank: dict.player.roles.tank,
    damage: dict.player.roles.damage,
    support: dict.player.roles.support,
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="ow-section-title mb-1">{t.title}</p>
          <p className="text-zinc-500 text-sm mb-3">{t.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[11px] text-zinc-600">
              {t.based_on_votes.replace("{n}", totalVotes.toLocaleString())}
            </span>
            <Link
              href={`/${lang}/tier-list`}
              className="text-[11px] text-[#f4a029]/80 hover:text-[#f4a029] transition-colors tracking-wide"
            >
              {t.vote_cta}
            </Link>
          </div>
        </div>

        {totalVotes === 0 ? (
          /* No votes yet */
          <div className="text-center py-20 border border-zinc-800/40 rounded">
            <p className="text-zinc-500 text-sm mb-4">{t.no_votes}</p>
            <Link
              href={`/${lang}/tier-list`}
              className="inline-block px-6 py-2.5 text-[11px] uppercase tracking-widest font-medium rounded transition-colors"
              style={{ background: "#f4a029", color: "#000" }}
            >
              {t.vote_cta}
            </Link>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-up" style={{ animationDelay: "60ms" }}>

            {/* ── Tier Overview ── */}
            <section>
              <div className="mb-5 pb-2 border-b border-zinc-800">
                <span className="text-xs uppercase tracking-widest text-zinc-500">{t.by_tier}</span>
              </div>

              <div className="space-y-2">
                {TIERS.map((tier) => {
                  const tierHeroes = grouped[tier];
                  if (tierHeroes.length === 0) return null;
                  const style = TIER_STYLE[tier];
                  return (
                    <div
                      key={tier}
                      className="flex gap-3 rounded"
                      style={{ background: style.bg, border: `1px solid ${style.border}` }}
                    >
                      {/* Tier label */}
                      <div
                        className="flex items-center justify-center shrink-0 w-10 sm:w-14 rounded-l font-bold text-xl sm:text-2xl select-none"
                        style={{
                          fontFamily: '"Rajdhani", system-ui, sans-serif',
                          color: style.label,
                          borderRight: `1px solid ${style.border}`,
                          background: `${style.border}18`,
                          minHeight: "80px",
                        }}
                      >
                        {tier}
                      </div>
                      {/* Heroes */}
                      <div className="flex flex-wrap gap-1 py-2 pr-2 flex-1">
                        {tierHeroes.map((h) => (
                          <HeroPortrait
                            key={h.key}
                            hero={h}
                            votes={votes[h.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 }}
                            lang={lang}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Top by Role ── */}
            <section>
              <div className="mb-5 pb-2 border-b border-zinc-800">
                <span className="text-xs uppercase tracking-widest text-zinc-500">{t.role_top}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topByRole.map(({ role, heroes: rHeroes }) => {
                  const rc = ROLE_COLORS[role];
                  return (
                    <div
                      key={role}
                      className={`p-4 border rounded ${rc.border} ${rc.bg}`}
                    >
                      <p
                        className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
                        style={{ color: rc.accent }}
                      >
                        {roleLabels[role]}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rHeroes.map((h) => {
                          const w = getWinningTier(
                            votes[h.key] ?? { S: 0, A: 0, B: 0, C: 0, D: 0 }
                          );
                          return (
                            <Link
                              key={h.key}
                              href={`/${lang}/heroes/${h.key}`}
                              className="group flex flex-col items-center gap-1 p-1.5 rounded hover:bg-white/5 transition-colors"
                              title={h.name}
                            >
                              <div className="relative w-12 h-12 rounded overflow-hidden bg-zinc-800">
                                <Image
                                  src={h.portrait}
                                  alt={h.name}
                                  fill
                                  unoptimized
                                  className="object-cover object-top"
                                />
                                {w && (
                                  <div
                                    className="absolute top-0 right-0 text-[9px] font-bold w-4 h-4 flex items-center justify-center"
                                    style={{
                                      background: TIER_STYLE[w].border,
                                      color: "#000",
                                    }}
                                  >
                                    {w}
                                  </div>
                                )}
                              </div>
                              <span className="text-[9px] uppercase tracking-wide text-center text-zinc-500 group-hover:text-zinc-300 transition-colors w-12 truncate">
                                {h.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Unranked */}
            {grouped.unranked.length > 0 && (
              <section>
                <div className="mb-4 pb-2 border-b border-zinc-800/50">
                  <span className="text-xs uppercase tracking-widest text-zinc-700">{t.unranked}</span>
                </div>
                <div className="flex flex-wrap gap-1 p-3 border border-zinc-800/30 rounded">
                  {grouped.unranked.map((h) => (
                    <Link
                      key={h.key}
                      href={`/${lang}/heroes/${h.key}`}
                      title={h.name}
                      className="group relative w-12 h-12 rounded overflow-hidden bg-zinc-900 hover:border hover:border-zinc-600 transition-all"
                    >
                      <Image
                        src={h.portrait}
                        alt={h.name}
                        fill
                        unoptimized
                        className="object-cover object-top opacity-40 group-hover:opacity-70 transition-opacity"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="text-center pt-4">
              <Link
                href={`/${lang}/tier-list`}
                className="inline-block px-8 py-3 text-[11px] uppercase tracking-widest font-medium rounded transition-colors hover:opacity-90"
                style={{ background: "#f4a029", color: "#000" }}
              >
                {t.vote_cta}
              </Link>
              <p className="text-[11px] text-zinc-700 mt-3">
                {isJa
                  ? "ティアリストはコミュニティ投票に基づいています。30秒ごとに更新。"
                  : "Tier rankings are based on community votes. Updated every 30 seconds."}
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
