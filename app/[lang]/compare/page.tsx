import { localeAlternates } from "@/lib/seo";
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
  const t = getDictionary(lang).compare;
  return {
    title: t.title,
    description: t.meta_description,
    alternates: localeAlternates(lang, "/compare"),
  };
}

export default async function ComparePage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return (
    <div className="bg-[var(--ow-bg)] text-white">
      {/* Outside Suspense: CompareView reads the URL, so it only renders in the browser. */}
      <h1 className="ow-section-title max-w-4xl mx-auto px-6 pt-12">{dict.compare.title}</h1>
      <Suspense fallback={<PageLoader />}>
        <CompareView lang={lang} dict={dict} />
      </Suspense>
    </div>
  );
}
