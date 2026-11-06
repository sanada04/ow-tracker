import type { Metadata } from "next";
import Link from "next/link";
import { HeroCell, RankedList, SectionHeading, TierBadge } from "@/components/ui/Hero";
import { getHeroRefs } from "@/lib/hero-refs";
import { getDictionary } from "@/lib/i18n";
import { localeAlternates } from "@/lib/seo";
import { getRankHeroes, topHeroes, type RankHero } from "@/lib/stats";
import { defaultRegion, DIVISIONS } from "@/lib/stats-config";
import { buildBreadcrumbList } from "@/lib/structured-data";

const LIST_SIZE = 5;

type Rank = (typeof DIVISIONS)[number];

interface Props {
  params: Promise<{ lang: string; rank: Rank }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DIVISIONS.map((rank) => ({ rank }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, rank } = await params;
  const t = getDictionary(lang).data;
  const name = t.ranks[rank];
  return {
    title: t.rank_h1.replace("{rank}", name),
    description: t.rank_intro.replace("{rank}", name),
    alternates: localeAlternates(lang, `/stats/ranks/${rank}`),
  };
}

function diffRows(heroes: RankHero[]) {
  return heroes.slice(0, LIST_SIZE).map((hero) => ({
    hero: hero.hero,
    value: `${hero.winDiff > 0 ? "+" : ""}${hero.winDiff.toFixed(1)}`,
  }));
}

export default async function RankPage({ params }: Props) {
  const { lang, rank } = await params;
  const t = getDictionary(lang).data;
  const name = t.ranks[rank];
  const scope = t.scope_default.replace("{region}", t.regions[defaultRegion(lang)]);

  const [refs, heroes] = await Promise.all([getHeroRefs(lang), getRankHeroes(lang, rank)]);
  const reliable = heroes.filter((hero) => !hero.lowData);
  const byDiff = [...reliable].sort((a, b) => b.winDiff - a.winDiff);

  const breadcrumb = buildBreadcrumbList([
    { name: t.home, path: `/${lang}` },
    { name: t.ranks_h1, path: `/${lang}/stats/ranks` },
    { name, path: `/${lang}/stats/ranks/${rank}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header>
        <Link href={`/${lang}/stats/ranks`} className="text-sm text-[var(--ow-text-3)] hover:text-[var(--ow-text)]">
          {t.ranks_h1}
        </Link>
        <h1 className="text-3xl font-bold mt-2 mb-2">{t.rank_h1.replace("{rank}", name)}</h1>
        <p className="text-[var(--ow-text-2)]">{t.rank_intro.replace("{rank}", name)}</p>
      </header>

      <section>
        <SectionHeading aside={scope}>{t.rank_leaders}</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RankedList title={t.top_win} rows={topHeroes(heroes, "winrate", LIST_SIZE)} heroes={refs} lang={lang} />
          <RankedList title={t.top_pick} rows={topHeroes(heroes, "pickrate", LIST_SIZE)} heroes={refs} lang={lang} />
          <RankedList title={t.top_ban} rows={topHeroes(heroes, "banrate", LIST_SIZE)} heroes={refs} lang={lang} />
        </div>
      </section>

      <section>
        <SectionHeading>{t.rank_diff_h2.replace("{rank}", name)}</SectionHeading>
        <p className="text-sm text-[var(--ow-text-3)] mb-3">{t.rank_diff_note}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RankedList title={t.rank_diff_up} rows={diffRows(byDiff)} heroes={refs} lang={lang} />
          <RankedList title={t.rank_diff_down} rows={diffRows([...byDiff].reverse())} heroes={refs} lang={lang} />
        </div>
      </section>

      <section>
        <SectionHeading aside={scope}>{t.rank_all_heroes}</SectionHeading>
        <div className="ow-card p-4 overflow-x-auto">
          <table className="ow-table">
            <thead>
              <tr>
                <th scope="col">{t.col_hero}</th>
                <th scope="col">{t.stat_tier}</th>
                <th scope="col">{t.col_score}</th>
                <th scope="col">{t.col_win}</th>
                <th scope="col">{t.col_pick}</th>
                <th scope="col">{t.col_ban}</th>
              </tr>
            </thead>
            <tbody>
              {heroes.map((hero) => (
                <tr key={hero.hero}>
                  <td>
                    <HeroCell heroKey={hero.hero} hero={refs[hero.hero]} lang={lang} note={hero.lowData ? t.low_data : undefined} />
                  </td>
                  <td><TierBadge tier={hero.tier} /></td>
                  <td>{hero.score}</td>
                  <td>{hero.winrate.toFixed(1)}%</td>
                  <td>{hero.pickrate.toFixed(1)}%</td>
                  <td>{hero.banrate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[var(--ow-text-3)] mt-3">{t.how_limits}</p>
      </section>

      <nav aria-label={t.rank_others}>
        <h2 className="text-xl font-bold mb-3">{t.rank_others}</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {DIVISIONS.filter((division) => division !== rank).map((division) => (
            <li key={division}>
              <Link href={`/${lang}/stats/ranks/${division}`} className="text-[var(--ow-accent)]">
                {t.ranks[division]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
