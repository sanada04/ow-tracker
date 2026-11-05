import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import SearchView from "@/components/SearchView";
import PageLoader from "@/components/PageLoader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "Search — OW Tracker",
  robots: { index: false },
};

export default async function SearchResultsPage({ params }: Props) {
  const { lang } = await params;
  return (
    <Suspense fallback={<PageLoader />}>
      <SearchView lang={lang} dict={getDictionary(lang)} />
    </Suspense>
  );
}
