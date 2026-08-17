"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroDisplayName } from "@/lib/heroes";
import type { HeroListItem } from "@/types/overwatch";

type Role = "tank" | "damage" | "support";

const ROLE_ACCENT: Record<Role, { color: string; glow: string; label: string }> = {
  tank:    { color: "#60a5fa", glow: "rgba(96,165,250,0.2)",   label: "text-blue-400" },
  damage:  { color: "#f87171", glow: "rgba(248,113,113,0.2)",  label: "text-red-400" },
  support: { color: "#4ade80", glow: "rgba(74,222,128,0.2)",   label: "text-green-400" },
};

interface Labels {
  search_placeholder: string;
  role_all: string;
  role_tank: string;
  role_damage: string;
  role_support: string;
}

export default function HeroRoster({
  labels,
  lang,
  heroes,
}: {
  labels: Labels;
  lang: string;
  heroes: HeroListItem[];
}) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "all">("all");
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const allHeroes = useMemo(
    () =>
      heroes
        .map((h) => ({
          key: h.key,
          name: h.name || getHeroDisplayName(h.key),
          role: h.role,
          portrait: h.portrait,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [heroes]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allHeroes.filter((h) => {
      const matchRole = role === "all" || h.role === role;
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.key.includes(q);
      return matchRole && matchSearch;
    });
  }, [allHeroes, search, role]);

  const tabs: { value: Role | "all"; label: string }[] = [
    { value: "all",     label: labels.role_all },
    { value: "tank",    label: labels.role_tank },
    { value: "damage",  label: labels.role_damage },
    { value: "support", label: labels.role_support },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.search_placeholder}
          className="flex-1 h-10 px-4 bg-[#141418] border border-white/[0.08] text-white placeholder-zinc-600 focus:outline-none focus:border-[#f4a029]/50 transition-colors text-sm rounded"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.03em" }}
        />
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setRole(t.value)}
              className="relative px-4 py-2 text-[11px] uppercase tracking-widest font-bold transition-all duration-200 rounded"
              style={{
                fontFamily: '"Rajdhani", system-ui, sans-serif',
                color: role === t.value ? "#f4a029" : "#52525b",
                background: role === t.value ? "rgba(244,160,41,0.08)" : "transparent",
                border: `1px solid ${role === t.value ? "rgba(244,160,41,0.4)" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((hero, i) => {
          const portrait = imgErrors.has(hero.key) ? null : hero.portrait;
          const accent = ROLE_ACCENT[hero.role as Role] ?? ROLE_ACCENT.damage;

          return (
            <Link
              key={hero.key}
              href={`/${lang}/heroes/${hero.key}`}
              className="ow-hero-card group animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 25, 500)}ms` }}
            >
              {/* Role color bar at top */}
              <div style={{ height: "2px", background: accent.color }} />

              {/* Portrait */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "1 / 1.1" }}>
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={hero.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.08]"
                    unoptimized
                    onError={() => setImgErrors((prev) => new Set([...prev, hero.key]))}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-4xl font-black text-zinc-800"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                  >
                    {hero.name[0]}
                  </div>
                )}

                {/* Bottom gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom, transparent 40%, rgba(8,8,16,0.95) 100%)",
                  }}
                />

                {/* Hero name overlaid on portrait */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                  <p
                    className="text-white font-bold leading-tight truncate"
                    style={{
                      fontFamily: '"Rajdhani", system-ui, sans-serif',
                      fontSize: "0.95rem",
                      letterSpacing: "0.06em",
                      textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                    }}
                  >
                    {hero.name}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-widest font-semibold mt-0.5"
                    style={{ color: accent.color }}
                  >
                    {hero.role}
                  </p>
                </div>

                {/* Orange corner accent on hover */}
                <div
                  className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    background: `linear-gradient(225deg, ${accent.color} 0%, transparent 70%)`,
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
