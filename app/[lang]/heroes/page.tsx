import { getDictionary } from "@/lib/i18n";
import HeroRoster from "@/components/HeroRoster";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  return {
    title: isEn ? "Hero Roster — OW Tracker" : "ヒーロー一覧 — OW Tracker",
    description: isEn
      ? "All playable heroes in Overwatch 2. Browse by role: Tank, Damage, Support."
      : "Overwatch 2 の全プレイアブルヒーロー一覧。タンク・ダメージ・サポートでフィルタリング可能。",
  };
}

export default async function HeroesPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.heroes_page;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="animate-fade-up">
          <p className="ow-section-title mb-1">{t.title}</p>
          <p className="text-zinc-500 text-sm">{t.subtitle}</p>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <HeroRoster labels={t} lang={lang} />
        </div>
      </main>
    </div>
  );
}
