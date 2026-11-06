import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import { HeroCell, MapLeaderGrid, RankedList, SectionHeading } from "@/components/ui/Hero";
import { getDictionary } from "@/lib/i18n";
import { getMapLeaders, getScoredHeroes, getStatsUpdatedAt, topHeroes } from "@/lib/stats";
import { defaultRegion } from "@/lib/stats-config";
import { formatDate, getHeroRefs } from "@/lib/hero-refs";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owtracker.org";
const LIST_SIZE = 5;
const POPULAR_COUNT = 12;
const MAP_COUNT = 6;

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang).data;
  const description = `${t.hero_sub} Overwatch 2 / OW2`;
  return {
    title: { absolute: `${t.hero_h1} | OW Tracker` },
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ja: "/ja", en: "/en", ko: "/ko", "x-default": "/ja" },
    },
    openGraph: { title: `${t.hero_h1} | OW Tracker`, description, url: `/${lang}` },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.data;

  const [scored, refs, featuredMaps, updatedAt] = await Promise.all([
    getScoredHeroes(lang),
    getHeroRefs(lang),
    getMapLeaders(lang, MAP_COUNT),
    getStatsUpdatedAt(),
  ]);

  const sTier = scored.filter((hero) => hero.tier === "S");
  const popular = [...scored].sort((a, b) => b.pickrate - a.pickrate).slice(0, POPULAR_COUNT);
  const scope = t.scope_default.replace("{region}", t.regions[defaultRegion(lang)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OW Tracker",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/${lang}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="max-w-6xl mx-auto px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-8 max-w-2xl relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.hero_h1}</h1>
        <p className="text-[var(--ow-text-2)] mb-4">{t.hero_sub}</p>
        <SearchBar
          placeholder={dict.search.placeholder}
          buttonText={dict.search.button}
          noResultsText={dict.search.no_results}
          notPublicText={dict.search.not_public}
          lang={lang}
        />
        <p className="text-sm text-[var(--ow-text-3)] mt-2">{t.private_note}</p>
        <SearchHistory lang={lang} labels={dict.home_extra} />
      </section>

      <section className="mb-10">
        <SectionHeading aside={<>{scope} / {t.updated.replace("{date}", formatDate(updatedAt, lang))}</>}>
          {t.meta_now}
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RankedList
            title={t.top_score}
            rows={scored.slice(0, LIST_SIZE).map((hero) => ({ hero: hero.hero, value: String(hero.score) }))}
            heroes={refs}
            lang={lang}
          />
          <RankedList title={t.top_win} rows={topHeroes(scored, "winrate", LIST_SIZE)} heroes={refs} lang={lang} />
          <RankedList title={t.top_pick} rows={topHeroes(scored, "pickrate", LIST_SIZE)} heroes={refs} lang={lang} />
          <RankedList title={t.top_ban} rows={topHeroes(scored, "banrate", LIST_SIZE)} heroes={refs} lang={lang} />
        </div>
        <p className="mt-3">
          <Link href={`/${lang}/meta`} className="text-[var(--ow-accent)]">{t.see_meta}</Link>
        </p>
      </section>

      {sTier.length > 0 && (
        <section className="mb-10">
          <SectionHeading aside={<Link href={`/${lang}/tier-list`} className="text-[var(--ow-accent)]">{t.see_tier}</Link>}>
            {t.s_tier}
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {sTier.map((hero) => (
              <div key={hero.hero} className="ow-card px-3 py-2 flex items-center justify-between gap-3">
                <HeroCell heroKey={hero.hero} hero={refs[hero.hero]} lang={lang} />
                <span className="tabular shrink-0 text-[var(--ow-text-2)]">{hero.score}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <SectionHeading aside={<Link href={`/${lang}/heroes`} className="text-[var(--ow-accent)]">{t.all_heroes}</Link>}>
          {t.popular}
        </SectionHeading>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {popular.map((hero) => (
            <Link key={hero.hero} href={`/${lang}/heroes/${hero.hero}`} className="ow-card overflow-hidden">
              {refs[hero.hero]?.portrait && (
                <div className="relative aspect-square">
                  <Image
                    src={refs[hero.hero].portrait}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 16vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>
              )}
              <div className="px-2 py-1.5 text-sm">
                <p className="truncate">{refs[hero.hero]?.name ?? hero.hero}</p>
                <p className="text-[var(--ow-text-3)] tabular">{hero.pickrate.toFixed(1)}%</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featuredMaps.length > 0 && (
        <section>
          <SectionHeading aside={<Link href={`/${lang}/maps`} className="text-[var(--ow-accent)]">{t.all_maps}</Link>}>
            {t.map_stats}
          </SectionHeading>
          <MapLeaderGrid leaders={featuredMaps} heroes={refs} lang={lang} bestLabel={t.best_on_map} />
        </section>
      )}
    </main>
  );
}
