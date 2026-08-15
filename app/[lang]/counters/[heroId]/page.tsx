import Image from "next/image";
import Link from "next/link";
import { getHeroes, getHeroDetail } from "@/lib/api";
import { getHeroCounterVotes } from "@/lib/upstash";
import { getDictionary } from "@/lib/i18n";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import CounterList from "@/components/CounterList";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props { params: Promise<{ lang: string; heroId: string }> }

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, heroId } = await params;
  const dict = getDictionary(lang);
  const t = dict.counters_page;
  const displayName = getHeroDisplayName(heroId);
  const title = t.page_title.replace("{hero}", displayName);
  const desc = t.page_subtitle.replace("{hero}", displayName);
  return {
    title: `${title} — OW Tracker`,
    description: desc,
    alternates: { canonical: `https://owtracker.org/${lang}/counters/${heroId}` },
    openGraph: {
      title: `${title} — OW Tracker`,
      description: desc,
      images: HERO_PORTRAITS[heroId] ? [{ url: HERO_PORTRAITS[heroId] }] : [],
    },
  };
}

export default async function CounterPage({ params }: Props) {
  const { lang, heroId } = await params;
  const dict = getDictionary(lang);
  const t = dict.counters_page;

  const [heroes, heroDetail, counterVotes] = await Promise.all([
    getHeroes(lang).catch(() => []),
    getHeroDetail(heroId, lang).catch(() => null),
    getHeroCounterVotes(heroId),
  ]);

  const displayName = getHeroDisplayName(heroId);
  const portrait = HERO_PORTRAITS[heroId] ?? heroDetail?.portrait ?? "";

  const roleLabel = heroDetail?.role
    ? dict.player.roles[heroDetail.role as "tank" | "damage" | "support"]
    : "";

  // Other heroes with same role for "heroes this hero counters" section
  const sameRoleOpponents = heroes.filter(
    (h) => h.key !== heroId && h.role !== heroDetail?.role
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          href={`/${lang}/counters`}
          className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
        >
          {t.back}
        </Link>

        {/* Hero header */}
        <div className="flex items-center gap-6 mb-10">
          {portrait && (
            <Image
              src={portrait}
              alt={displayName}
              width={80}
              height={80}
              className="rounded shrink-0"
              unoptimized
            />
          )}
          <div>
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
            >
              {t.page_title.replace("{hero}", displayName)}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {t.page_subtitle.replace("{hero}", displayName)}
            </p>
            {roleLabel && (
              <span className="inline-block mt-2 text-[11px] uppercase tracking-widest text-zinc-400 border border-zinc-700/50 px-2 py-0.5 rounded">
                {roleLabel}
              </span>
            )}
          </div>
        </div>

        {/* Counter voting */}
        <CounterList
          heroKey={heroId}
          heroes={heroes}
          initialVotes={counterVotes}
          t={t}
          lang={lang}
        />

        {/* Hero info from OverFast */}
        {heroDetail && (
          <section className="mt-10">
            <div className="mb-4 pb-2 border-b border-zinc-800">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                {t.hero_info}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {heroDetail.hitpoints && (
                <>
                  <div className="ow-card p-4 text-center">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      {dict.hero_detail.hp_total}
                    </p>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                      {heroDetail.hitpoints.total}
                    </p>
                  </div>
                  {heroDetail.hitpoints.armor > 0 && (
                    <div className="ow-card p-4 text-center">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                        {dict.hero_detail.hp_armor}
                      </p>
                      <p className="text-2xl font-bold text-[#f4a029]" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                        {heroDetail.hitpoints.armor}
                      </p>
                    </div>
                  )}
                  {heroDetail.hitpoints.shields > 0 && (
                    <div className="ow-card p-4 text-center">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                        {dict.hero_detail.hp_shields}
                      </p>
                      <p className="text-2xl font-bold text-blue-400" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                        {heroDetail.hitpoints.shields}
                      </p>
                    </div>
                  )}
                </>
              )}
              <div className="ow-card p-4 text-center">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  {dict.hero_detail.abilities_label}
                </p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                  {heroDetail.abilities.length}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Related links */}
        <section className="mt-10">
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              {t.related_heroes}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${lang}/heroes/${heroId}`}
              className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
            >
              {displayName} Hero Page
            </Link>
            <Link
              href={`/${lang}/tier-list`}
              className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
            >
              Tier List
            </Link>
            {sameRoleOpponents.slice(0, 5).map((hero) => (
              <Link
                key={hero.key}
                href={`/${lang}/counters/${hero.key}`}
                className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
              >
                {getHeroDisplayName(hero.key)} Counters
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
