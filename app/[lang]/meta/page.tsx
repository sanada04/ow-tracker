import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { getMapLeaders, getScoredHeroes, getStatsUpdatedAt, topHeroes } from "@/lib/stats";
import { defaultRegion } from "@/lib/stats-config";
import { formatDate, getHeroRefs } from "@/lib/hero-refs";
import { HeroCell, MapLeaderGrid, RankedList, SectionHeading, TierBadge } from "@/components/ui/Hero";

interface Props {
  params: Promise<{ lang: string }>;
}

const LIST_SIZE = 10;
const ROLE_SIZE = 5;
const MAP_COUNT = 9;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang).data;
  return {
    title: t.meta_h1,
    description: t.meta_intro,
    alternates: {
      canonical: `https://owtracker.org/${lang}/meta`,
      languages: {
        ja: "https://owtracker.org/ja/meta",
        en: "https://owtracker.org/en/meta",
        ko: "https://owtracker.org/ko/meta",
        "x-default": "https://owtracker.org/ja/meta",
      },
    },
  };
}

export default async function MetaPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.data;

  const [scored, refs, mapLeaders, updatedAt] = await Promise.all([
    getScoredHeroes(lang),
    getHeroRefs(lang),
    getMapLeaders(lang, MAP_COUNT),
    getStatsUpdatedAt(),
  ]);

  const scope = t.scope_default.replace("{region}", t.regions[defaultRegion(lang)]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t.meta_h1}</h1>
      <p className="text-[var(--ow-text-2)] max-w-2xl">{t.meta_intro}</p>
      <p className="text-sm text-[var(--ow-text-3)] mt-1 mb-6">
        {scope} / {t.updated.replace("{date}", formatDate(updatedAt, lang))}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

      <section className="mb-10">
        <SectionHeading aside={<Link href={`/${lang}/tier-list`} className="text-[var(--ow-accent)]">{t.see_tier}</Link>}>
          {t.by_role}
        </SectionHeading>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {(["tank", "damage", "support"] as const).map((role) => (
            <div key={role} className="ow-card p-4 overflow-x-auto">
              <h3 className="text-base font-bold mb-1" style={{ color: `var(--ow-${role})` }}>
                {dict.player.roles[role]}
              </h3>
              <table className="ow-table">
                <thead>
                  <tr>
                    <th scope="col">{t.col_hero}</th>
                    <th scope="col">{t.stat_tier}</th>
                    <th scope="col">{t.col_win}</th>
                  </tr>
                </thead>
                <tbody>
                  {scored.filter((hero) => hero.role === role).slice(0, ROLE_SIZE).map((hero) => (
                    <tr key={hero.hero}>
                      <td><HeroCell heroKey={hero.hero} hero={refs[hero.hero]} lang={lang} /></td>
                      <td><TierBadge tier={hero.tier} /></td>
                      <td>{hero.winrate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      {mapLeaders.length > 0 && (
        <section>
          <SectionHeading aside={<Link href={`/${lang}/maps`} className="text-[var(--ow-accent)]">{t.all_maps}</Link>}>
            {t.map_leaders}
          </SectionHeading>
          <MapLeaderGrid leaders={mapLeaders} heroes={refs} lang={lang} bestLabel={t.best_on_map} />
        </section>
      )}
    </main>
  );
}
