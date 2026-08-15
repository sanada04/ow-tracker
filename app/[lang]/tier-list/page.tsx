import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { getHeroes } from "@/lib/api";
import { getAllTierVotes } from "@/lib/upstash";
import TierList from "@/components/TierList";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isJa = lang === "ja";
  return {
    title: isJa
      ? "みんなで作る Tier List — Overwatch 2"
      : "Community Tier List — Overwatch 2",
    description: isJa
      ? "みんなの投票で決まる Overwatch 2 ヒーロー Tier List。ヒーローをS〜Dで評価して、コミュニティの意見を確認しよう。"
      : "Community-voted Overwatch 2 hero tier list. Rate heroes from S to D and see what the community thinks.",
    alternates: {
      languages: { ja: "/ja/tier-list", en: "/en/tier-list", "x-default": "/ja/tier-list" },
    },
  };
}

export default async function TierListPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const heroes = await getHeroes(lang).catch(() => []);
  const votes = await getAllTierVotes(heroes.map((h) => h.key));

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest text-[#f4a029]/70 mb-2">
          {lang === "ja" ? "コミュニティ投票" : "Community Vote"}
        </p>
        <h1
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.06em" }}
        >
          {lang === "ja" ? "みんなで作る TIER LIST" : "COMMUNITY TIER LIST"}
        </h1>
        <p className="text-zinc-500 text-sm">
          {lang === "ja"
            ? "ヒーローをタップしてS〜Dで評価。投票結果が集計されてTierが決まります。"
            : "Tap a hero to rate them S–D. Your vote is counted toward the community result."}
        </p>
      </div>

      <TierList heroes={heroes} initialVotes={votes} lang={lang} dict={dict} />
    </main>
  );
}
