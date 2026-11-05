import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import PlayerView from "@/components/PlayerView";
import PageLoader from "@/components/PageLoader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string; playerId: string }>;
}

export const dynamicParams = false;

// One shell per language. The server rewrites every player URL to it and
// player-page.php adds the player's metadata.
export function generateStaticParams() {
  return [{ playerId: "_" }];
}

export const metadata: Metadata = {
  title: "Player Stats",
};

export default async function PlayerPage({ params }: Props) {
  const { lang } = await params;
  return (
    <Suspense fallback={<PageLoader />}>
      <PlayerView lang={lang} dict={getDictionary(lang)} />
    </Suspense>
  );
}
