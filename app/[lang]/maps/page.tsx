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

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-8 animate-fade-up">
          <p className="ow-section-title mb-1">{t.title}</p>
          <p className="text-zinc-500 text-sm">{t.subtitle}</p>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <MapsGrid maps={maps} dict={dict} lang={lang} />
        </div>
      </main>
    </div>
  );
}
