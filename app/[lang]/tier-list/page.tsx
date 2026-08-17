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

  const isJa = lang === "ja";

  const tierDescriptions = isJa
    ? [
        { tier: "S", color: "#f4a029", label: "最強ピック", desc: "現在のメタで突出して強力。高い勝率・汎用性を持ち、あらゆる状況で活躍できるヒーロー。" },
        { tier: "A", color: "#84cc16", label: "強力ピック", desc: "メタに十分適応しており、使いこなせれば高い成果が期待できる。ほぼすべての状況で有効。" },
        { tier: "B", color: "#3b82f6", label: "標準ピック", desc: "特定の状況やマップで輝くヒーロー。得意な場面を選べば十分に機能する。" },
        { tier: "C", color: "#71717a", label: "状況次第", desc: "強力な場面が限られる。使いこなすには高い習熟度が必要、または特定の構成との相性が求められる。" },
        { tier: "D", color: "#ef4444", label: "オフメタ", desc: "現在のメタでは厳しい立場。独自性はあるが、他の選択肢に比べて不利な状況が多い。" },
      ]
    : [
        { tier: "S", color: "#f4a029", label: "Top Picks", desc: "Dominant in the current meta. These heroes offer high win rates, strong utility, and perform well in almost any situation." },
        { tier: "A", color: "#84cc16", label: "Strong Picks", desc: "Solid choices that fit well into the meta. Reliable in most scenarios and effective when played competently." },
        { tier: "B", color: "#3b82f6", label: "Average Picks", desc: "Heroes that shine in specific situations or maps. Viable but require the right circumstances or team composition." },
        { tier: "C", color: "#71717a", label: "Situational", desc: "Limited impact in general play. Can work with high mastery or in niche compositions, but are otherwise outclassed." },
        { tier: "D", color: "#ef4444", label: "Off-Meta", desc: "Struggling in the current meta. May have unique strengths but face significant disadvantages compared to other options." },
      ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest text-[#505070] mb-2">
          {isJa ? "コミュニティ投票" : "Community Vote"}
        </p>
        <h1
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.06em" }}
        >
          {isJa ? "みんなで作る TIER LIST" : "COMMUNITY TIER LIST"}
        </h1>
        <p className="text-[#9090b0] text-sm max-w-2xl">
          {isJa
            ? "OW Trackerコミュニティの投票で決まる、Overwatch 2 ヒーローのTierリストです。各ヒーローをS〜Dで評価してください。投票結果がリアルタイムで集計されます。"
            : "A community-voted tier list for Overwatch 2 heroes. Rate each hero S–D and see the aggregated result from all OW Tracker users in real time."}
        </p>
      </div>

      {/* Tier explanation */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-5 gap-2">
        {tierDescriptions.map(({ tier, color, label, desc }) => (
          <div key={tier} className="ow-card-sm p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl font-black" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', color }}>{tier}</span>
              <span className="text-xs text-white font-medium">{label}</span>
            </div>
            <p className="text-[#9090b0] text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <TierList heroes={heroes} initialVotes={votes} lang={lang} dict={dict} />

      {/* How it works */}
      <div className="mt-12 ow-card p-6">
        <h2 className="text-white font-bold text-sm mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          {isJa ? "このTierListについて" : "How This Tier List Works"}
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed mb-3">
          {isJa
            ? "このTierListはOW Trackerのユーザー投票によって決定されます。各ヒーローに対して1人1票投票でき、集計された投票の最多ティアがそのヒーローのコミュニティTierとして表示されます。特定のパッチやシーズンの傾向を反映したリアルタイムデータです。"
            : "This tier list is determined entirely by OW Tracker user votes. Each user can vote once per hero. The tier with the most votes becomes the community tier for that hero. It reflects real-time community sentiment about the current patch and meta."}
        </p>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          {isJa
            ? "Tierはランク帯・プレイスタイル・チーム構成によって異なる場合があります。このデータはあくまでコミュニティの総意であり、絶対的な評価ではありません。"
            : "Tiers may vary depending on your rank, playstyle, and team composition. This reflects community consensus, not an absolute ranking."}
        </p>
      </div>
    </main>
  );
}
