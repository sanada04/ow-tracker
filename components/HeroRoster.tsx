"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroDisplayName } from "@/lib/heroes";
import type { HeroListItem } from "@/types/overwatch";

type Role = "tank" | "damage" | "support";

const ROLE_COLORS: Record<Role, string> = {
  tank: "text-blue-400 border-blue-500/30 bg-blue-900/10",
  damage: "text-red-400 border-red-500/30 bg-red-900/10",
  support: "text-green-400 border-green-500/30 bg-green-900/10",
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
    { value: "all", label: labels.role_all },
    { value: "tank", label: labels.role_tank },
    { value: "damage", label: labels.role_damage },
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
          className="flex-1 h-10 px-4 bg-[#131320] border border-zinc-700/60 text-white placeholder-zinc-600 focus:outline-none focus:border-[#f4a029]/60 transition-colors text-sm"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
        />
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setRole(t.value)}
              className={`px-3 py-2 text-[11px] uppercase tracking-widest font-medium transition-colors border ${
                role === t.value
                  ? "border-[#f4a029]/60 text-[#f4a029] bg-[#f4a029]/10"
                  : "border-zinc-700/40 text-zinc-500 hover:text-zinc-300"
              }`}
              style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((hero, i) => {
          const portrait = imgErrors.has(hero.key) ? null : hero.portrait;
          const roleColor = ROLE_COLORS[hero.role];
          return (
            <Link
              key={hero.key}
              href={`/${lang}/heroes/${hero.key}`}
              className="ow-card overflow-hidden group hover:border-[#f4a029]/30 transition-colors animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-[#0d0d1a]">
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={hero.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                    onError={() => setImgErrors((prev) => new Set([...prev, hero.key]))}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-700"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                  >
                    {hero.name[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131320] via-transparent to-transparent" />
              </div>
              <div className="px-3 py-2.5">
                <p
                  className="text-white text-sm font-semibold truncate"
                  style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                >
                  {hero.name}
                </p>
                <span className={`inline-block mt-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${roleColor}`}>
                  {hero.role}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
