import { getDictionary } from "@/lib/i18n";
import { getHeroes } from "@/lib/api";
import HeroRoster from "@/components/HeroRoster";
import { buildBreadcrumbList } from "@/lib/structured-data";
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
    alternates: {
      canonical: `https://owtracker.org/${lang}/heroes`,
      languages: {
        ja: "https://owtracker.org/ja/heroes",
        en: "https://owtracker.org/en/heroes",
        ko: "https://owtracker.org/ko/heroes",
        "x-default": "https://owtracker.org/ja/heroes",
      },
    },
  };
}

export default async function HeroesPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.heroes_page;

  const heroes = await getHeroes(lang).catch(() => []);

  const isEn = lang === "en";
  const breadcrumb = buildBreadcrumbList([
    { name: isEn ? "Home" : "ホーム", path: `/${lang}` },
    { name: dict.header.nav_heroes, path: `/${lang}/heroes` },
  ]);

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="animate-fade-up">
          <p className="ow-section-title mb-1">{t.title}</p>
          <p className="text-zinc-500 text-sm">{t.subtitle}</p>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <HeroRoster labels={t} lang={lang} heroes={heroes} />
        </div>
      </main>
    </div>
  );
}
