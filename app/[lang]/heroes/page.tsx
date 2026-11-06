import { localeAlternates } from "@/lib/seo";
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
  const t = getDictionary(lang).heroes_page;
  return {
    title: t.title,
    description: t.meta_description,
    alternates: localeAlternates(lang, "/heroes"),
  };
}

export default async function HeroesPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.heroes_page;

  const heroes = await getHeroes(lang);

  const breadcrumb = buildBreadcrumbList([
    { name: dict.data.home, path: `/${lang}` },
    { name: dict.header.nav_heroes, path: `/${lang}/heroes` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--ow-bg)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="">
          <h1 className="ow-section-title mb-1">{t.title}</h1>
          <p className="text-zinc-500 text-sm">{t.subtitle}</p>
        </div>
        <div className="">
          <HeroRoster labels={t} lang={lang} heroes={heroes} />
        </div>
      </main>
    </div>
  );
}
