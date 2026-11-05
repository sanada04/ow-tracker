import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import CompareView from "@/components/CompareView";
import PageLoader from "@/components/PageLoader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  return {
    title: isEn ? "Compare Players — OW Tracker" : "プレイヤー比較 — OW Tracker",
    description: isEn
      ? "Compare two Overwatch 2 players side by side: rank, win rate, KDA, play time, and hero pool."
      : "2人のOverwatch 2プレイヤーを比較。ランク・勝率・KDA・プレイ時間・使用ヒーローを並べて確認できます。",
    alternates: {
      canonical: `https://owtracker.org/${lang}/compare`,
      languages: {
        ja: "https://owtracker.org/ja/compare",
        en: "https://owtracker.org/en/compare",
        ko: "https://owtracker.org/ko/compare",
        "x-default": "https://owtracker.org/ja/compare",
      },
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { lang } = await params;
  return (
    <Suspense fallback={<PageLoader />}>
      <CompareView lang={lang} dict={getDictionary(lang)} />
    </Suspense>
  );
}
