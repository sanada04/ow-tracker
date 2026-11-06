import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { getHeroes } from "@/lib/api";
import { getAllTierVotes } from "@/lib/upstash";
import { getRoleMap, getStats, getStatsUpdatedAt } from "@/lib/stats";
import { defaultRegion, type StatsFilter } from "@/lib/stats-config";
import { formatDate, getHeroRefs } from "@/lib/hero-refs";
import { buildBreadcrumbList } from "@/lib/structured-data";
import DataTierList from "@/components/DataTierList";
import TierList from "@/components/TierList";
import { SectionHeading } from "@/components/ui/Hero";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang).data;
  return {
    title: t.tier_h1,
    description: t.tier_intro,
    alternates: {
      canonical: `https://owtracker.org/${lang}/tier-list`,
      languages: {
        ja: "https://owtracker.org/ja/tier-list",
        en: "https://owtracker.org/en/tier-list",
        ko: "https://owtracker.org/ko/tier-list",
        "x-default": "https://owtracker.org/ja/tier-list",
      },
    },
  };
}

export default async function TierListPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.data;
  const filter: StatsFilter = { platform: "pc", region: defaultRegion(lang), division: "all" };

  const heroes = await getHeroes(lang);
  const [rows, roles, refs, votes, updatedAt] = await Promise.all([
    getStats(filter),
    getRoleMap(),
    getHeroRefs(lang),
    getAllTierVotes(heroes.map((hero) => hero.key)),
    getStatsUpdatedAt(),
  ]);

  const breadcrumb = buildBreadcrumbList([
    { name: "OW Tracker", path: `/${lang}` },
    { name: t.tier_h1, path: `/${lang}/tier-list` },
  ]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1 className="text-3xl font-bold mb-2">{t.tier_h1}</h1>
      <p className="text-[var(--ow-text-2)] max-w-2xl">{t.tier_intro}</p>
      <p className="text-sm text-[var(--ow-text-3)] mt-1 mb-6">
        {t.updated.replace("{date}", formatDate(updatedAt, lang))}
      </p>

      <DataTierList
        initialRows={rows}
        initialFilter={filter}
        roles={roles}
        heroes={refs}
        lang={lang}
        labels={t}
        roleLabels={dict.player.roles}
      />

      <section className="ow-card p-5 mt-10">
        <h2 className="text-lg font-bold mb-2">{t.how_title}</h2>
        <div className="space-y-2 text-[var(--ow-text-2)] text-sm max-w-3xl">
          <p>{t.how_body}</p>
          <p>{t.how_tiers}</p>
          <p>{t.how_limits}</p>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading>{t.community_h2}</SectionHeading>
        <p className="text-[var(--ow-text-2)] mb-5">{t.community_intro}</p>
        <TierList heroes={heroes} initialVotes={votes} lang={lang} dict={dict} />
      </section>
    </main>
  );
}
