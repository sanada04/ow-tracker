import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owtracker.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OW Tracker — Overwatch 2 戦績確認",
    template: "%s | OW Tracker",
  },
  description:
    "Overwatch 2 プレイヤーの戦績・ランク・ヒーロースタッツを確認できるトラッカーサイト。BattleTagで検索するだけで、コンペティティブランク・勝率・KDA・ヒーロー別スタッツが一覧で確認できます。",
  keywords: [
    "Overwatch 2", "OW2", "オーバーウォッチ 2", "オーバーウォッチ",
    "戦績", "ランク", "スタッツ", "tracker", "BattleTag",
    "コンペティティブ", "competitive rank", "hero stats",
  ],
  openGraph: {
    type: "website",
    siteName: "OW Tracker",
    title: "OW Tracker — Overwatch 2 戦績確認",
    description:
      "Overwatch 2 プレイヤーの戦績・ランク・ヒーロースタッツを確認。BattleTagで検索するだけ。",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "OW Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OW Tracker — Overwatch 2 戦績確認",
    description: "Overwatch 2 プレイヤーのランク・スタッツ・ヒーロー統計をBattleTagで即座に確認。",
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
  verification: {
    google: "HHnyz3BlvzPc9vRUMuKQKyOFQNuKh6MtIksdSE2OKyM",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

