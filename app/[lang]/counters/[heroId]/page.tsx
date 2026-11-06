import { localeAlternates } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { getHeroes, getHeroDetail, getMaps } from "@/lib/api";
import { getHeroCounterVotes } from "@/lib/upstash";
import { getDictionary } from "@/lib/i18n";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import CounterList from "@/components/CounterList";
import { HeroSummary, MapList, RankTable } from "@/components/HeroStatsPanel";
import { SectionHeading } from "@/components/ui/Hero";
import { getHeroByDivision, getHeroByMap, getMatchupPairs, getScoredHeroes } from "@/lib/stats";
import { defaultRegion, matchupPath } from "@/lib/stats-config";
import { buildBreadcrumbList } from "@/lib/structured-data";
import type { Metadata } from "next";


const WEAK_MAP_SIZE = 5;
const MATCHUP_LINKS = 8;

interface Props { params: Promise<{ lang: string; heroId: string }> }

export const dynamicParams = false;

export async function generateStaticParams() {
  const heroes = await getHeroes("en");
  return heroes.map((hero) => ({ heroId: hero.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, heroId } = await params;
  const dict = getDictionary(lang);
  const t = dict.counters_page;
  const heroes = await getHeroes(lang);
  const displayName = heroes.find((hero) => hero.key === heroId)?.name ?? getHeroDisplayName(heroId);
  const title = t.page_title.replace("{hero}", displayName);
  const desc = t.page_subtitle.replace("{hero}", displayName);
  return {
    title,
    description: desc,
    alternates: localeAlternates(lang, `/counters/${heroId}`),
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

  const [heroes, heroDetail, counterVotes, scored, divisions, maps, pairs] = await Promise.all([
    getHeroes(lang),
    getHeroDetail(heroId, lang),
    getHeroCounterVotes(heroId),
    getScoredHeroes(lang),
    getHeroByDivision(lang, heroId),
    getMaps(lang),
    getMatchupPairs(),
  ]);

  const names = Object.fromEntries(heroes.map((hero) => [hero.key, hero.name]));
  const displayName = names[heroId] ?? getHeroDisplayName(heroId);
  const data = dict.data;
  const self = scored.find((hero) => hero.hero === heroId);
  const mapStats = await getHeroByMap(lang, heroId, maps.map((map) => map.key));
  const mapNames = { ...Object.fromEntries(maps.map((map) => [map.key, map.name])), __label: data.col_map };
  const weakMaps = mapStats.slice(-WEAK_MAP_SIZE).reverse();
  const matchups = pairs.filter((pair) => pair.includes(heroId)).slice(0, MATCHUP_LINKS);
  const scope = data.scope_default.replace("{region}", data.regions[defaultRegion(lang)]);
  const portrait = HERO_PORTRAITS[heroId] ?? heroDetail?.portrait ?? "";

  const roleLabel = heroDetail?.role
    ? dict.player.roles[heroDetail.role as "tank" | "damage" | "support"]
    : "";

  // Other heroes with same role for "heroes this hero counters" section
  const sameRoleOpponents = heroes.filter(
    (h) => h.key !== heroId && h.role !== heroDetail?.role
  ).slice(0, 8);

  const breadcrumb = buildBreadcrumbList([
    { name: dict.data.home, path: `/${lang}` },
    { name: t.nav, path: `/${lang}/counters` },
    { name: displayName, path: `/${lang}/counters/${heroId}` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--ow-bg)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
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
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}
            >
              {t.page_title.replace("{hero}", displayName)}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {t.page_subtitle.replace("{hero}", displayName)}
            </p>
            {roleLabel && (
              <span className="inline-block mt-2 text-xs tracking-normal text-zinc-400 border border-zinc-700/50 px-2 py-0.5 rounded">
                {roleLabel}
              </span>
            )}
          </div>
        </div>

        {/* Hero description — adds content for SEO/AdSense */}
        {heroDetail?.description && (
          <div className="mb-8 ow-card p-5">
            <p className="text-xs tracking-normal text-[var(--ow-text-3)] mb-3">
              {lang === "ja" ? "ヒーロー紹介" : "About this Hero"}
            </p>
            <p className="text-[var(--ow-text-2)] text-sm leading-relaxed">{heroDetail.description}</p>
          </div>
        )}

        {/* Counter voting */}
        <CounterList
          heroKey={heroId}
          heroes={heroes}
          initialVotes={counterVotes}
          t={t}
          lang={lang}
        />

        {self && (
          <section className="mt-10 space-y-4">
            <SectionHeading aside={scope}>{data.counter_data_h2.replace("{hero}", displayName)}</SectionHeading>
            <p className="text-sm text-[var(--ow-text-3)]">{data.counter_basis}</p>
            <HeroSummary hero={self} labels={data} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RankTable divisions={divisions} lang={lang} labels={data} />
              {weakMaps.length > 0 && (
                <MapList title={data.worst_maps} rows={weakMaps} mapNames={mapNames} lang={lang} winLabel={data.col_win} />
              )}
            </div>
          </section>
        )}

        {/* Hero stats + abilities — core content for counter analysis */}
        {heroDetail && (
          <section className="mt-10 space-y-6">
            {/* HP stats */}
            <div>
              <div className="mb-4 pb-2 border-b border-zinc-800">
                <span className="text-xs tracking-normal text-zinc-500 font-medium">
                  {t.hero_info}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroDetail.hitpoints && (
                  <>
                    <div className="ow-card p-4 text-center">
                      <p className="text-xs text-zinc-500 tracking-normal mb-1">
                        {dict.hero_detail.hp_total}
                      </p>
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                        {heroDetail.hitpoints.total}
                      </p>
                    </div>
                    {heroDetail.hitpoints.armor > 0 && (
                      <div className="ow-card p-4 text-center">
                        <p className="text-xs text-zinc-500 tracking-normal mb-1">
                          {dict.hero_detail.hp_armor}
                        </p>
                        <p className="text-2xl font-bold text-[var(--ow-accent)]" style={{ fontFamily: "var(--font-heading)" }}>
                          {heroDetail.hitpoints.armor}
                        </p>
                      </div>
                    )}
                    {heroDetail.hitpoints.shields > 0 && (
                      <div className="ow-card p-4 text-center">
                        <p className="text-xs text-zinc-500 tracking-normal mb-1">
                          {dict.hero_detail.hp_shields}
                        </p>
                        <p className="text-2xl font-bold text-blue-400" style={{ fontFamily: "var(--font-heading)" }}>
                          {heroDetail.hitpoints.shields}
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div className="ow-card p-4 text-center">
                  <p className="text-xs text-zinc-500 tracking-normal mb-1">
                    {dict.hero_detail.abilities_label}
                  </p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                    {heroDetail.abilities.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Abilities — crucial for understanding how to counter this hero */}
            {heroDetail.abilities.length > 0 && (
              <div>
                <div className="mb-4 pb-2 border-b border-zinc-800">
                  <span className="text-xs tracking-normal text-zinc-500 font-medium">
                    {lang === "ja" ? `${displayName} のアビリティ` : `${displayName} Abilities`}
                  </span>
                </div>
                <div className="space-y-3">
                  {heroDetail.abilities.map((ability) => (
                    <div key={ability.name} className="ow-card-sm p-4 flex gap-4">
                      {ability.icon && (
                        <div className="w-10 h-10 shrink-0 rounded border border-zinc-700/40 overflow-hidden bg-zinc-800/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ability.icon} alt={ability.name} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                          {ability.name}
                        </p>
                        <p className="text-[var(--ow-text-2)] text-xs leading-relaxed">{ability.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--ow-text-3)] mt-3">
                  {lang === "ja"
                    ? `${displayName} のアビリティを理解することが、効果的なカウンターピックの第一歩です。`
                    : `Understanding ${displayName}'s abilities is the first step to picking an effective counter.`}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Related links */}
        <section className="mt-10">
          <div className="mb-4 pb-2 border-b border-zinc-800">
            <span className="text-xs tracking-normal text-zinc-500 font-medium">
              {t.related_heroes}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${lang}/heroes/${heroId}`}
              className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
            >
              {data.hero_page_link.replace("{hero}", displayName)}
            </Link>
            <Link
              href={`/${lang}/tier-list`}
              className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
            >
              {data.see_tier}
            </Link>
            {matchups.map(([first, second]) => (
              <Link
                key={`${first}-${second}`}
                href={matchupPath(lang, first, second)}
                className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
              >
                {data.vs_h1.replace("{a}", names[first] ?? first).replace("{b}", names[second] ?? second)}
              </Link>
            ))}
            {sameRoleOpponents.slice(0, 5).map((hero) => (
              <Link
                key={hero.key}
                href={`/${lang}/counters/${hero.key}`}
                className="text-sm text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-3 py-1.5 rounded transition-colors"
              >
                {data.counters_link.replace("{hero}", hero.name)}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
