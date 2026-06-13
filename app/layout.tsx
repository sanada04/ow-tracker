import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const rajdhani = Rajdhani({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ow-tracker.example.com";

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
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "OW Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OW Tracker — Overwatch 2 戦績確認",
    description: "Overwatch 2 プレイヤーのランク・スタッツ・ヒーロー統計をBattleTagで即座に確認。",
    images: ["/opengraph-image.png"],
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geist.variable} ${rajdhani.variable}`} suppressHydrationWarning>
      <body className="bg-[#0a0a12] text-[#e8e8f0] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
