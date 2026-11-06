import type { Metadata } from "next";
import Link from "next/link";
import { HeroCell, SectionHeading } from "@/components/ui/Hero";
import { getHeroRefs } from "@/lib/hero-refs";
import { getDictionary } from "@/lib/i18n";
import { localeAlternates } from "@/lib/seo";
import { getRankHeroes } from "@/lib/stats";
import { defaultRegion, DIVISIONS } from "@/lib/stats-config";
import { buildBreadcrumbList } from "@/lib/structured-data";

const TOP_SIZE = 3;

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang).data;
  return {
    title: t.ranks_h1,
    description: t.ranks_intro,
    alternates: localeAlternates(lang, "/stats/ranks"),
  };
}

export default async function RanksPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.data;
  const scope = t.scope_default.replace("{region}", t.regions[defaultRegion(lang)]);

  const [refs, ranks] = await Promise.all([
    getHeroRefs(lang),
    Promise.all(DIVISIONS.map(async (division) => ({ division, heroes: await getRankHeroes(lang, division) }))),
  ]);

  const breadcrumb = buildBreadcrumbList([
    { name: t.home, path: `/${lang}` },
    { name: t.ranks_h1, path: `/${lang}/stats/ranks` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header>
        <h1 className="text-3xl font-bold mb-2">{t.ranks_h1}</h1>
        <p className="text-[var(--ow-text-2)]">{t.ranks_intro}</p>
      </header>

      <section>
        <SectionHeading aside={scope}>{t.top_score}</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ranks.map(({ division, heroes }) => (
            <div key={division} className="ow-card p-4">
              <h3 className="text-base font-bold mb-2">
                <Link href={`/${lang}/stats/ranks/${division}`} className="hover:text-[var(--ow-accent)]">
                  {t.ranks[division]}
                </Link>
              </h3>
              <ol>
                {heroes.filter((hero) => !hero.lowData).slice(0, TOP_SIZE).map((hero) => (
                  <li key={hero.hero} className="flex items-center justify-between gap-3 py-1.5 border-b border-[var(--ow-line)] last:border-0">
                    <HeroCell heroKey={hero.hero} hero={refs[hero.hero]} lang={lang} />
                    <span className="tabular shrink-0">{hero.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <p className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href={`/${lang}/stats/rank-distribution`} className="text-[var(--ow-accent)]">{dict.rank_page.title}</Link>
        <Link href={`/${lang}/tier-list`} className="text-[var(--ow-accent)]">{t.see_tier}</Link>
      </p>
    </main>
  );
}
