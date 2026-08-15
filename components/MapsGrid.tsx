"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MapSummary } from "@/types/overwatch";
import type { Dictionary } from "@/lib/i18n";

function getModeName(key: string, gamemodes: Dictionary["maps_page"]["gamemodes"]): string {
  return (gamemodes as Record<string, string>)[key] ?? key;
}

export default function MapsGrid({
  maps,
  dict,
  lang,
}: {
  maps: MapSummary[];
  dict: Dictionary;
  lang: string;
}) {
  const t = dict.maps_page;
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const allModes = Array.from(new Set(maps.flatMap((m) => m.gamemodes))).sort();

  const filtered = maps.filter((m) => {
    const matchesMode = filter === "all" || m.gamemodes.includes(filter);
    const matchesSearch =
      search === "" || m.name.toLowerCase().includes(search.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={t.search_placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 bg-zinc-900 border border-zinc-700/40 rounded text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#f4a029]/50"
        />
      </div>

      {/* Gamemode filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className="px-3 py-1 text-[11px] uppercase tracking-widest rounded transition-colors"
          style={{
            background: filter === "all" ? "#f4a029" : "rgba(255,255,255,0.05)",
            color: filter === "all" ? "#000" : "#71717a",
          }}
        >
          {t.all}
        </button>
        {allModes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setFilter(mode)}
            className="px-3 py-1 text-[11px] uppercase tracking-widest rounded transition-colors"
            style={{
              background: filter === mode ? "#f4a029" : "rgba(255,255,255,0.05)",
              color: filter === mode ? "#000" : "#71717a",
            }}
          >
            {getModeName(mode, t.gamemodes)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-zinc-600 text-sm">No maps found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((map) => (
            <Link
              key={map.key}
              href={`/${lang}/maps/${map.key}`}
              className="group relative block rounded overflow-hidden border border-zinc-800/40 hover:border-[#f4a029]/40 transition-all"
            >
              <div className="relative aspect-video bg-zinc-900">
                <Image
                  src={map.screenshot}
                  alt={map.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p
                  className="text-white text-xs font-semibold leading-tight truncate"
                  style={{
                    fontFamily: '"Rajdhani", system-ui, sans-serif',
                    letterSpacing: "0.05em",
                  }}
                >
                  {map.name}
                </p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {map.gamemodes.slice(0, 2).map((mode) => (
                    <span
                      key={mode}
                      className="text-[9px] uppercase tracking-wider text-[#f4a029]/70"
                    >
                      {getModeName(mode, t.gamemodes)}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-6 text-[11px] text-zinc-700 text-right">
        {filtered.length} / {maps.length} maps
      </p>
    </div>
  );
}
