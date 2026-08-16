import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaps } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ lang: string; mapId: string }>;
}

function getModeName(key: string, gamemodes: Record<string, string>): string {
  return gamemodes[key] ?? key;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, mapId } = await params;
  const dict = getDictionary(lang);
  const isEn = lang === "en";
  try {
    const maps = await getMaps(lang);
    const map = maps.find((m) => m.key === mapId);
    if (!map) return { title: "Map — OW Tracker" };
    const gm = getModeName(
      map.gamemodes[0] ?? "",
      dict.maps_page.gamemodes as Record<string, string>
    );
    return {
      title: `${map.name} — OW Tracker`,
      description: isEn
        ? `${map.name} is an Overwatch 2 ${gm} map. Explore map details and related maps.`
        : `${map.name} は Overwatch 2 の ${gm} マップです。`,
      openGraph: {
        title: `${map.name} | OW Tracker`,
        images: [{ url: map.screenshot }],
      },
      alternates: {
        canonical: `https://owtracker.org/${lang}/maps/${mapId}`,
        languages: {
          ja: `https://owtracker.org/ja/maps/${mapId}`,
          en: `https://owtracker.org/en/maps/${mapId}`,
        },
      },
    };
  } catch {
    return { title: "Map — OW Tracker" };
  }
}

export default async function MapDetailPage({ params }: Props) {
  const { lang, mapId } = await params;
  const dict = getDictionary(lang);
  const t = dict.map_detail;
  const tp = dict.maps_page;
  const gmLabels = tp.gamemodes as Record<string, string>;

  let maps: Awaited<ReturnType<typeof getMaps>>;
  try {
    maps = await getMaps(lang);
  } catch {
    notFound();
  }

  const map = maps.find((m) => m.key === mapId);
  if (!map) notFound();

  const relatedMaps = maps.filter(
    (m) => m.key !== map.key && m.gamemodes.some((g) => map.gamemodes.includes(g))
  );

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      {/* Banner */}
      <div className="relative h-[50vh] min-h-64 overflow-hidden">
        <Image
          src={map.screenshot}
          alt={map.name}
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,18,0.15) 0%, rgba(10,10,18,0.55) 55%, rgba(10,10,18,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,18,0.7) 0%, transparent 60%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-8">
          <Link
            href={`/${lang}/maps`}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#00c4ef] transition-colors mb-5"
          >
            <span className="text-xs">←</span> {t.back}
          </Link>

          {/* Gamemode badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {map.gamemodes.map((mode) => (
              <span
                key={mode}
                className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border border-[#f4a029]/30 text-[#f4a029]/80 rounded"
              >
                {getModeName(mode, gmLabels)}
              </span>
            ))}
          </div>

          <h1
            className="text-5xl sm:text-6xl font-bold text-white leading-none"
            style={{
              fontFamily: '"Rajdhani", system-ui, sans-serif',
              letterSpacing: "0.02em",
            }}
          >
            {map.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Info strip */}
        <div className="flex flex-wrap gap-4">
          <div className="p-4 border border-zinc-800/40 bg-[#0a0a18] rounded">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
              {t.gamemode_label}
            </p>
            <p className="text-white text-sm font-medium">
              {map.gamemodes.map((m) => getModeName(m, gmLabels)).join(" / ")}
            </p>
          </div>
          {map.country_code && (
            <div className="p-4 border border-zinc-800/40 bg-[#0a0a18] rounded">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
                {t.country_label}
              </p>
              <p className="text-white text-sm font-medium">{map.country_code}</p>
            </div>
          )}
        </div>

        {/* Related maps */}
        {relatedMaps.length > 0 && (
          <div>
            <div className="mb-5 pb-2 border-b border-zinc-800">
              <span className="text-xs uppercase tracking-widest text-zinc-500">{t.related}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {relatedMaps.slice(0, 8).map((m) => (
                <Link
                  key={m.key}
                  href={`/${lang}/maps/${m.key}`}
                  className="group relative block rounded overflow-hidden border border-zinc-800/40 hover:border-[#00c4ef]/35 transition-all"
                >
                  <div className="relative aspect-video bg-zinc-900">
                    <Image
                      src={m.screenshot}
                      alt={m.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p
                      className="text-white text-xs font-semibold truncate"
                      style={{
                        fontFamily: '"Rajdhani", system-ui, sans-serif',
                        letterSpacing: "0.05em",
                      }}
                    >
                      {m.name}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-[#f4a029]/70 mt-0.5">
                      {m.gamemodes
                        .map((g) => getModeName(g, gmLabels))
                        .join(" / ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
