import Image from "next/image";
import Link from "next/link";
import { getHeroes } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import { HERO_PORTRAITS, getHeroDisplayName } from "@/lib/heroes";
import type { Metadata } from "next";

export const revalidate = 3600;

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.counters_page;
  return {
    title: `${t.index_title} — OW Tracker`,
    description: t.index_subtitle,
    alternates: { canonical: `https://owtracker.org/${lang}/counters` },
  };
}

export default async function CountersIndexPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.counters_page;
  const heroes = await getHeroes(lang).catch(() => []);

  const byRole = {
    tank: heroes.filter((h) => h.role === "tank"),
    damage: heroes.filter((h) => h.role === "damage"),
    support: heroes.filter((h) => h.role === "support"),
  };

  const roleLabels: Record<string, string> = {
    tank: dict.player.roles.tank,
    damage: dict.player.roles.damage,
    support: dict.player.roles.support,
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
          >
            {t.index_title}
          </h1>
          <p className="text-zinc-500 text-sm">{t.index_subtitle}</p>
        </div>

        {(["tank", "damage", "support"] as const).map((role) => (
          <section key={role} className="mb-10">
            <div className="mb-4 pb-2 border-b border-zinc-800">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                {roleLabels[role]}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {byRole[role].map((hero) => (
                <Link
                  key={hero.key}
                  href={`/${lang}/counters/${hero.key}`}
                  className="ow-card p-3 flex flex-col items-center gap-2 text-center hover:border-[#f4a029]/40 transition-colors"
                >
                  <Image
                    src={HERO_PORTRAITS[hero.key] ?? hero.portrait}
                    alt={hero.name}
                    width={56}
                    height={56}
                    className="rounded"
                    unoptimized
                  />
                  <span
                    className="text-xs font-semibold text-zinc-300"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                  >
                    {getHeroDisplayName(hero.key)}
                  </span>
                  <span className="text-[10px] text-[#f4a029]/70 uppercase tracking-wider">
                    {t.see_counters}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
