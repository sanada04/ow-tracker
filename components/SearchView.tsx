"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { searchPlayers } from "@/lib/client-api";
import type { Dictionary } from "@/lib/i18n";
import type { SearchResult } from "@/types/overwatch";
import SearchBar from "@/components/SearchBar";

interface LoadResult {
  query: string;
  results: SearchResult[];
}

export default function SearchView({ lang, dict }: { lang: string; dict: Dictionary }) {
  const t = dict.search_results;
  const q = useSearchParams().get("q");
  const raw = q?.trim() ?? "";

  const [loaded, setLoaded] = useState<LoadResult | null>(null);

  useEffect(() => {
    if (raw.length < 2) return;
    let active = true;
    searchPlayers(raw)
      .catch(() => [])
      .then((results) => {
        if (active) setLoaded({ query: raw, results });
      });
    return () => {
      active = false;
    };
  }, [raw]);

  const isLoading = raw.length >= 2 && loaded?.query !== raw;
  const apiResults = loaded?.query === raw ? loaded.results : [];

  const ql = raw.toLowerCase();
  const results = [...apiResults].sort((a, b) => {
    const al = a.name.toLowerCase();
    const bl = b.name.toLowerCase();
    const score = (n: string) => (n === ql ? 0 : n.startsWith(ql) ? 1 : n.includes(ql) ? 2 : 3);
    return score(al) - score(bl);
  });

  return (
    <div className="min-h-screen bg-[var(--ow-bg)] text-white">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Search bar */}
        <div className="mb-10">
          <SearchBar
            defaultValue={q ?? ""}
            placeholder={dict.search.placeholder}
            buttonText={dict.search.button}
            noResultsText={dict.search.no_results}
            notPublicText={t.private}
            lang={lang}
            autoFocus={false}
          />
        </div>

        {/* Heading */}
        {raw ? (
          <div className="mb-6">
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}
            >
              {t.title.replace("{query}", raw)}
            </h1>
            {results.length > 0 && (
              <p className="text-sm text-zinc-500 mt-1">
                {t.count.replace("{count}", String(results.length))}
              </p>
            )}
          </div>
        ) : null}

        {/* Results */}
        {!raw ? (
          <p className="text-zinc-500 text-sm">{t.no_query}</p>
        ) : isLoading ? (
          <p className="text-zinc-500 text-sm">Loading…</p>
        ) : results.length === 0 ? (
          <p className="text-zinc-500 text-sm">{t.no_results.replace("{query}", raw)}</p>
        ) : (
          <ul className="space-y-2">
            {results.map((result, i) => (
              <li key={result.player_id}>
                <Link
                  href={`/${lang}/players/${encodeURIComponent(result.player_id.replace(/%7C/gi, "|"))}`}
                  className="flex items-center gap-4 px-5 py-4 bg-[var(--ow-surface)] border border-zinc-800/60 hover:border-[var(--ow-accent)]/35 hover:bg-[var(--ow-surface-2)] transition-colors rounded"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {result.avatar ? (
                    <Image
                      src={result.avatar}
                      alt={result.name}
                      width={44}
                      height={44}
                      className="rounded shrink-0 border border-zinc-700/40"
                      unoptimized
                    />
                  ) : (
                    <div className="w-11 h-11 rounded bg-zinc-800 shrink-0 flex items-center justify-center text-base font-bold text-zinc-400">
                      {result.name[0].toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-white font-bold text-base truncate"
                      style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.03em" }}
                    >
                      {result.name}
                    </p>
                    {result.title && (
                      <p className="text-xs text-[var(--ow-accent)]/55 truncate">{result.title}</p>
                    )}
                  </div>

                  {!result.is_public && (
                    <span className="text-xs tracking-normal text-zinc-500 shrink-0 border border-zinc-700/40 px-2 py-0.5">
                      {t.private}
                    </span>
                  )}

                  <span className="text-zinc-500 text-sm shrink-0">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
