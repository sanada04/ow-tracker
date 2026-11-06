import { Suspense } from "react";
import { getHeroDetail, getHeroes, getMaps } from "@/lib/api";
import { getHeroRefs } from "@/lib/hero-refs";
import { getDictionary } from "@/lib/i18n";
import { localeAlternates } from "@/lib/seo";
import { getHeroByDivision, getHeroByMap, getMatchupPairs, getScoredHeroes } from "@/lib/stats";
import { defaultRegion, matchupPath } from "@/lib/stats-config";
import { buildBreadcrumbList } from "@/lib/structured-data";
import HeroMatchup, { type MatchupSide } from "@/components/HeroMatchup";
import HeroVsView from "@/components/HeroVsView";
import PageLoader from "@/components/PageLoader";
import type { Metadata } from "next";

const SHELL = "_";
const RELATED_PER_HERO = 4;

interface Props {
  params: Promise<{ lang: string; heroId: string; vsId: string }>;
}

export const dynamicParams = false;

// Pairs with enough data are prebuilt. The server sends every other matchup URL
// to the shell page, which loads its data in the browser and is not indexed.
export async function generateStaticParams() {
  const pairs = await getMatchupPairs();
  return [{ heroId: SHELL, vsId: SHELL }, ...pairs.map(([heroId, vsId]) => ({ heroId, vsId }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, heroId, vsId } = await params;
  if (heroId === SHELL) return { title: "Hero Matchup", robots: { index: false, follow: true } };

  const t = getDictionary(lang).data;
  const [refs, scored] = await Promise.all([getHeroRefs(lang), getScoredHeroes(lang)]);
  const nameA = refs[heroId]?.name ?? heroId;
  const nameB = refs[vsId]?.name ?? vsId;
  const winrate = (key: string) => scored.find((hero) => hero.hero === key)?.winrate.toFixed(1) ?? "-";
  const title = t.vs_title.replace("{a}", nameA).replace("{b}", nameB);
  const description = t.vs_description
    .replace("{a}", nameA)
    .replace("{b}", nameB)
    .replace("{winA}", winrate(heroId))
    .replace("{winB}", winrate(vsId));
  return {
    title,
    description,
    alternates: localeAlternates(lang, `/heroes/${heroId}/vs/${vsId}`),
    openGraph: { title: `${title} | OW Tracker`, description, url: matchupPath(lang, heroId, vsId) },
  };
}

async function loadSide(lang: string, key: string, mapKeys: string[]): Promise<Omit<MatchupSide, "ref" | "stat">> {
  const [detail, divisions, maps] = await Promise.all([
    getHeroDetail(key, lang),
    getHeroByDivision(lang, key),
    getHeroByMap(lang, key, mapKeys),
  ]);
  return { key, hitpoints: detail.hitpoints?.total ?? null, divisions, maps };
}

export default async function HeroVsPage({ params }: Props) {
  const { lang, heroId, vsId } = await params;
  const dict = getDictionary(lang);

  if (heroId === SHELL) {
    const heroes = await getHeroes(lang);
    return (
      <Suspense fallback={<PageLoader />}>
        <HeroVsView lang={lang} dict={dict} heroes={heroes} />
      </Suspense>
    );
  }

  const t = dict.data;
  const [refs, scored, maps, pairs] = await Promise.all([
    getHeroRefs(lang),
    getScoredHeroes(lang),
    getMaps(lang),
    getMatchupPairs(),
  ]);
  const mapKeys = maps.map((map) => map.key);
  const [sideA, sideB] = await Promise.all([loadSide(lang, heroId, mapKeys), loadSide(lang, vsId, mapKeys)]);

  const statOf = (key: string) => {
    const stat = scored.find((hero) => hero.hero === key);
    if (!stat) throw new Error(`No stats for ${key}`);
    return stat;
  };
  const a: MatchupSide = { ...sideA, ref: refs[heroId], stat: statOf(heroId) };
  const b: MatchupSide = { ...sideB, ref: refs[vsId], stat: statOf(vsId) };

  const others = (key: string, excluded: string) =>
    pairs.filter((pair) => pair.includes(key) && !pair.includes(excluded)).slice(0, RELATED_PER_HERO);
  const scope = t.scope_default.replace("{region}", t.regions[defaultRegion(lang)]);
  const heading = t.vs_h1.replace("{a}", a.ref.name).replace("{b}", b.ref.name);
  const breadcrumb = buildBreadcrumbList([
    { name: t.home, path: `/${lang}` },
    { name: dict.header.nav_heroes, path: `/${lang}/heroes` },
    { name: a.ref.name, path: `/${lang}/heroes/${heroId}` },
    { name: heading, path: matchupPath(lang, heroId, vsId) },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <HeroMatchup
        a={a}
        b={b}
        related={[...others(heroId, vsId), ...others(vsId, heroId)]}
        refs={refs}
        mapNames={Object.fromEntries(maps.map((map) => [map.key, map.name]))}
        lang={lang}
        scope={scope}
        hpLabel={dict.hero_vs.hp_total}
        labels={t}
      />
    </>
  );
}
