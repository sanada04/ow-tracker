import { Suspense } from "react";
import { getHeroes } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import HeroVsView from "@/components/HeroVsView";
import PageLoader from "@/components/PageLoader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string; heroId: string; vsId: string }>;
}

export const dynamicParams = false;

// One shell per language. The server rewrites every matchup URL to it.
export function generateStaticParams() {
  return [{ heroId: "_", vsId: "_" }];
}

export const metadata: Metadata = {
  title: "Hero Matchup",
  robots: { index: false, follow: true },
};

export default async function HeroVsPage({ params }: Props) {
  const { lang } = await params;
  const heroes = await getHeroes(lang);
  return (
    <Suspense fallback={<PageLoader />}>
      <HeroVsView lang={lang} dict={getDictionary(lang)} heroes={heroes} />
    </Suspense>
  );
}
