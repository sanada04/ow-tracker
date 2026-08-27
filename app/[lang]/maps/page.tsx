import type { Metadata } from "next";
import { getMaps } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import MapsGrid from "@/components/MapsGrid";

export const revalidate = 3600;

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.maps_page;
  return {
    title: `${t.title} — OW Tracker`,
    description: t.subtitle,
    alternates: {
      canonical: `https://owtracker.org/${lang}/maps`,
      languages: { ja: "https://owtracker.org/ja/maps", en: "https://owtracker.org/en/maps" },
    },
  };
}

export default async function MapsPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.maps_page;

  const maps = await getMaps(lang).catch(() => []);
  const isJa = lang === "ja";

  const modeDescriptions = isJa ? [
    { mode: "Control", icon: "◎", desc: "中央の拠点を一定時間保持したチームが勝利。攻守が入れ替わる接戦が多い。" },
    { mode: "Escort", icon: "◈", desc: "ペイロードを護衛してゴールまで届けるか、阻止するかを競うモード。" },
    { mode: "Hybrid", icon: "◆", desc: "まず拠点を制圧し、その後ペイロードを運ぶ2段階構成のモード。" },
    { mode: "Push", icon: "▶", desc: "ロボットを自陣から押し進め、相手陣地へより深く届けたチームが勝利。" },
    { mode: "Flashpoint", icon: "◉", desc: "マップ上に順番に現れる複数の拠点を取り合い、先に5拠点を確保したチームが勝利。" },
    { mode: "Clash", icon: "⬡", desc: "5か所の拠点を巡って攻防を繰り返す、攻守一体型のモード。" },
  ] : [
    { mode: "Control", icon: "◎", desc: "Hold a central objective until your team reaches 100%. Fights are often close and contested." },
    { mode: "Escort", icon: "◈", desc: "Push the payload to the goal before time runs out, or stop the enemy from doing so." },
    { mode: "Hybrid", icon: "◆", desc: "First capture a point, then escort the payload to the endpoint in a two-phase format." },
    { mode: "Push", icon: "▶", desc: "Both teams compete to push a robot further into the enemy base. Whoever pushes it furthest wins." },
    { mode: "Flashpoint", icon: "◉", desc: "Capture 5 of the rotating objectives scattered across the map to win." },
    { mode: "Clash", icon: "⬡", desc: "A 5-point tug-of-war mode where teams fight over sequential objectives across the map." },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-8 animate-fade-up">
          <p className="ow-section-title mb-1">{t.title}</p>
          <p className="text-zinc-500 text-sm">{t.subtitle}</p>
        </div>

        {/* Game mode guide — original editorial content */}
        <div className="mb-10 animate-fade-up" style={{ animationDelay: "40ms" }}>
          <p className="text-[11px] uppercase tracking-widest text-[#505070] mb-4">
            {isJa ? "ゲームモード解説" : "Game Mode Guide"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modeDescriptions.map(({ mode, icon, desc }) => (
              <div key={mode} className="ow-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: "#f4a029", fontSize: "0.75rem" }}>{icon}</span>
                  <span className="text-white text-sm font-bold" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.06em" }}>{mode}</span>
                </div>
                <p className="text-[#9090b0] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <MapsGrid maps={maps} dict={dict} lang={lang} />
        </div>

        {/* Map strategy note — original content */}
        <div className="mt-12 ow-card p-5 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <p className="text-[11px] uppercase tracking-widest text-[#505070] mb-3">
            {isJa ? "マップ攻略のポイント" : "Map Strategy Fundamentals"}
          </p>
          <p className="text-[#9090b0] text-sm leading-relaxed mb-3">
            {isJa
              ? "各マップにはそれぞれ独自の構造と戦略的なポイントがあります。高台を制する、フランクルートを把握する、チョークポイントを活用するといった基本戦略は、どのマップでも有効です。"
              : "Every map in Overwatch 2 has unique geometry that rewards specific hero compositions and positioning strategies. High ground control, flank route awareness, and choke point management are universal fundamentals that apply regardless of game mode."}
          </p>
          <p className="text-[#9090b0] text-sm leading-relaxed">
            {isJa
              ? "マップを熟知すると、高台・隠れ場所・フランクルートを把握できます。各マップの詳細ページでは、ゲームモードや地域情報を確認できます。"
              : "Learning each map's layout reveals power positions, health pack locations, and flanking paths that can decide the outcome of a fight. Click any map below to explore its game mode, region, and related hero matchups."}
          </p>
        </div>
      </main>
    </div>
  );
}
