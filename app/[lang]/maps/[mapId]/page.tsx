import MapStatsPanel from "@/components/MapStatsPanel";
import { getMapStats, getRoleMap } from "@/lib/stats";
import { defaultRegion } from "@/lib/stats-config";
import { getHeroRefs } from "@/lib/hero-refs";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaps } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import { getMapModeGuide } from "@/lib/map-guides";
import { buildBreadcrumbList } from "@/lib/structured-data";


interface Props {
  params: Promise<{ lang: string; mapId: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const maps = await getMaps("en");
  return maps.map((map) => ({ mapId: map.key }));
}

function getModeName(key: string, gamemodes: Record<string, string>): string {
  return gamemodes[key] ?? key;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, mapId } = await params;
  const dict = getDictionary(lang);
  const isEn = lang !== "ja";
  const maps = await getMaps(lang);
  const map = maps.find((m) => m.key === mapId);
  if (!map) return { title: "Map" };
  const gm = getModeName(
    map.gamemodes[0] ?? "",
    dict.maps_page.gamemodes as Record<string, string>
  );
  const location = map.location ? ` (${map.location})` : "";
  return {
    title: map.name,
    description: isEn
      ? `${map.name}${location} is an Overwatch ${gm} map. Explore map strategy, positioning tips, and related maps.`
      : `${map.name}${location} は Overwatch の ${gm} マップです。攻略ポイントや関連マップを確認できます。`,
    openGraph: {
      title: `${map.name} | OW Tracker`,
      images: [{ url: map.screenshot }],
    },
    alternates: {
      canonical: `https://owtracker.org/${lang}/maps/${mapId}`,
      languages: {
        ja: `https://owtracker.org/ja/maps/${mapId}`,
        en: `https://owtracker.org/en/maps/${mapId}`,
        ko: `https://owtracker.org/ko/maps/${mapId}`,
        "x-default": `https://owtracker.org/ja/maps/${mapId}`,
      },
    },
  };
}

export default async function MapDetailPage({ params }: Props) {
  const { lang, mapId } = await params;
  const dict = getDictionary(lang);
  const t = dict.map_detail;
  const tp = dict.maps_page;
  const gmLabels = tp.gamemodes as Record<string, string>;
  const isEn = lang !== "ja";

  const maps = await getMaps(lang);

  const map = maps.find((m) => m.key === mapId);
  if (!map) notFound();

  const [mapRows, roles, refs] = await Promise.all([
    getMapStats(lang, mapId),
    getRoleMap(),
    getHeroRefs(lang),
  ]);
  const scope = dict.data.scope_default.replace("{region}", dict.data.regions[defaultRegion(lang)]);

  const relatedMaps = maps.filter(
    (m) => m.key !== map.key && m.gamemodes.some((g) => map.gamemodes.includes(g))
  );

  // Get strategy guide for the first game mode this map has
  const primaryMode = map.gamemodes[0] ?? "";
  const guide = getMapModeGuide(primaryMode, lang);

  const breadcrumb = buildBreadcrumbList([
    { name: dict.data.home, path: `/${lang}` },
    { name: tp.nav, path: `/${lang}/maps` },
    { name: map.name, path: `/${lang}/maps/${mapId}` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--ow-bg)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {/* Banner — tall cinematic view */}
      <div className="relative h-72 sm:h-80 overflow-hidden">
        <Image
          src={map.screenshot}
          alt={map.name}
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(16,17,19,0.1) 0%, rgba(16,17,19,0.4) 45%, rgba(16,17,19,0.92) 80%, rgba(16,17,19,1) 100%)",
          }}
        />
        {/* Left side vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(16,17,19,0.75) 0%, transparent 55%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-10">
          <Link
            href={`/${lang}/maps`}
            className="inline-flex items-center gap-1.5 text-xs tracking-normal text-zinc-500 hover:text-[var(--ow-accent)] transition-colors mb-6"
          >
            {t.back}
          </Link>

          {/* Gamemode badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {map.gamemodes.map((mode) => (
              <span
                key={mode}
                className="text-xs tracking-normal px-2.5 py-1 border border-[var(--ow-accent)]/30 text-[var(--ow-accent)]/80 rounded"
              >
                {getModeName(mode, gmLabels)}
              </span>
            ))}
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.02em",
            }}
          >
            {map.name}
          </h1>

          {/* Location subtitle */}
          {map.location && (
            <p
              className="mt-2 text-zinc-400 text-sm"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}
            >
              {map.location}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {mapRows && (
          <MapStatsPanel
            mapName={map.name}
            rows={mapRows}
            roles={roles}
            refs={refs}
            lang={lang}
            scope={scope}
            labels={dict.data}
            roleLabels={dict.player.roles}
          />
        )}

        {/* Info strip */}
        <div className="flex flex-wrap gap-4">
          <div className="p-4 border border-zinc-800/40 bg-[var(--ow-surface)] rounded">
            <p className="text-xs tracking-normal text-zinc-500 mb-1">
              {t.gamemode_label}
            </p>
            <p className="text-white text-sm font-medium">
              {map.gamemodes.map((m) => getModeName(m, gmLabels)).join(" / ")}
            </p>
          </div>
          {map.location && (
            <div className="p-4 border border-zinc-800/40 bg-[var(--ow-surface)] rounded">
              <p className="text-xs tracking-normal text-zinc-500 mb-1">
                {isEn ? "Location" : "舞台"}
              </p>
              <p className="text-white text-sm font-medium">{map.location}</p>
            </div>
          )}
          {map.country_code && (
            <div className="p-4 border border-zinc-800/40 bg-[var(--ow-surface)] rounded">
              <p className="text-xs tracking-normal text-zinc-500 mb-1">
                {t.country_label}
              </p>
              <p className="text-white text-sm font-medium">{map.country_code.toUpperCase()}</p>
            </div>
          )}
        </div>

        {/* Map image section — labeled cinematic screenshot */}
        <div>
          <p className="text-xs tracking-normal text-[var(--ow-text-3)] mb-4">
            {isEn ? "Map Overview" : "マップ全景"}
          </p>
          <div className="relative w-full aspect-video rounded overflow-hidden border border-zinc-800/40">
            <Image
              src={map.screenshot}
              alt={isEn ? `${map.name} overview` : `${map.name} 全景`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {isEn
              ? `${map.name} — Overwatch ${map.gamemodes.map((m) => getModeName(m, gmLabels)).join(" / ")} map`
              : `${map.name} — Overwatch ${map.gamemodes.map((m) => getModeName(m, gmLabels)).join(" / ")} マップ`}
            {map.location ? (isEn ? ` set in ${map.location}` : `（${map.location}）`) : ""}
          </p>
        </div>

        {/* Strategy Guide — original editorial content */}
        {guide && (
          <div>
            <p className="text-xs tracking-normal text-[var(--ow-text-3)] mb-5">
              {isEn ? "Map Strategy Guide" : "攻略ポイント"}
            </p>

            {/* Mode overview */}
            <div className="ow-card p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: "var(--ow-accent)", fontSize: "0.7rem" }}>◎</span>
                <span
                  className="text-sm font-bold tracking-normal text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {map.gamemodes.map((m) => getModeName(m, gmLabels)).join(" / ")}
                  {isEn ? " — How It Works" : " とは"}
                </span>
              </div>
              <p className="text-[var(--ow-text-2)] text-sm leading-relaxed">{guide.overview}</p>
            </div>

            {/* Key positions */}
            <div className="ow-card p-5 mb-4">
              <p
                className="text-xs tracking-normal mb-2"
                style={{ color: "var(--ow-accent)" }}
              >
                {isEn ? "Key Positions" : "重要ポジション"}
              </p>
              <p className="text-[var(--ow-text-2)] text-sm leading-relaxed">{guide.key_positions}</p>
            </div>

            {/* Attacker & Defender tips grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="ow-card p-5">
                <p
                  className="text-xs tracking-normal mb-3"
                  style={{ color: "var(--ow-accent)" }}
                >
                  {isEn ? "Attacker Tips" : "攻撃側のポイント"}
                </p>
                <ul className="space-y-2">
                  {guide.attacker_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--ow-text-2)]">
                      <span style={{ color: "var(--ow-accent)", flexShrink: 0, marginTop: "2px" }}>・</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ow-card p-5">
                <p
                  className="text-xs tracking-normal mb-3"
                  style={{ color: "var(--ow-accent)" }}
                >
                  {isEn ? "Defender Tips" : "防衛側のポイント"}
                </p>
                <ul className="space-y-2">
                  {guide.defender_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--ow-text-2)]">
                      <span style={{ color: "var(--ow-accent)", flexShrink: 0, marginTop: "2px" }}>・</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* General tips */}
            <div className="ow-card p-5">
              <p
                className="text-xs tracking-normal mb-3"
                style={{ color: "#b060f0" }}
              >
                {isEn ? "General Tips" : "共通のポイント"}
              </p>
              <ul className="space-y-2">
                {guide.general_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--ow-text-2)]">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: "rgba(176,96,240,0.12)", color: "#b060f0" }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Related maps */}
        {relatedMaps.length > 0 && (
          <div>
            <div className="mb-5 pb-2 border-b border-zinc-800">
              <span className="text-xs tracking-normal text-zinc-500">{t.related}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {relatedMaps.slice(0, 8).map((m) => (
                <Link
                  key={m.key}
                  href={`/${lang}/maps/${m.key}`}
                  className="group relative block rounded overflow-hidden border border-zinc-800/40 hover:border-[var(--ow-accent)]/35 transition-all"
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
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {m.name}
                    </p>
                    <p className="text-[9px] tracking-normal text-[var(--ow-accent)]/70 mt-0.5">
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
