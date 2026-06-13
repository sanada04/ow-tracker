"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPlayerId, searchPlayers } from "@/lib/api";
import type { SearchResult } from "@/types/overwatch";

export default function SearchBar({
  defaultValue = "",
  placeholder = "名前 または BattleTag（例: Name / Name#12345）",
  buttonText = "検索",
  noResultsText = "プレイヤーが見つかりません。BattleTag（例: Name#12345）で試してください。",
  notPublicText = "非公開",
  lang = "ja",
  autoFocus = false,
  compact = false,
}: {
  defaultValue?: string;
  placeholder?: string;
  buttonText?: string;
  noResultsText?: string;
  notPublicText?: string;
  lang?: string;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNoResults(false);
    const raw = value.trim();
    const q = raw.includes("#") ? raw.split("#")[0].trim() : raw;
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchPlayers(q);
        setSuggestions(results.slice(0, 6));
        setOpen(results.length > 0);
        setNoResults(results.length === 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  function navigate(playerId: string) {
    setOpen(false);
    setNoResults(false);
    const normalized = playerId.replace(/%7C/gi, "|");
    router.push(`/${lang}/players/${encodeURIComponent(normalized)}`);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    setOpen(false);
    if (trimmed.includes("#")) {
      navigate(formatPlayerId(trimmed));
    } else {
      router.push(`/${lang}/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  function handleSelect(result: SearchResult) {
    setValue(result.name);
    navigate(result.player_id);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-2" suppressHydrationWarning>
        {/* Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setNoResults(false); }}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            suppressHydrationWarning
            className={`w-full ${compact ? "h-10" : "h-12"} px-4 bg-[#131320] border border-zinc-700/60 border-r-0 text-white placeholder-zinc-600 focus:outline-none focus:border-[#f4a029]/60 transition-colors text-sm`}
            style={{ clipPath: compact ? "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" : "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-[#f4a029] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!value.trim() || loading}
          suppressHydrationWarning
          className={`${compact ? "h-10 px-4" : "h-12 px-6"} bg-[#f4a029] hover:bg-[#ffbe55] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm uppercase tracking-widest transition-colors shrink-0`}
          style={{
            clipPath: compact ? "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))" : "polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            fontFamily: '"Rajdhani", system-ui, sans-serif',
          }}
        >
          {buttonText}
        </button>
      </form>

      {/* No results notice */}
      {noResults && !loading && value.trim().length >= 2 && (
        <div className="absolute mt-1 w-full z-50 bg-[#131320] border border-zinc-700/60 px-4 py-3 text-sm text-zinc-400">
          {noResultsText}
        </div>
      )}

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-[#131320] border border-zinc-700/60 shadow-2xl overflow-hidden">
          {suggestions.map((result, i) => (
            <li key={result.player_id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(result)}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(result)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a2a] border-b border-zinc-800/40 last:border-0 transition-colors cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {result.avatar ? (
                  <Image
                    src={result.avatar}
                    alt={result.name}
                    width={32}
                    height={32}
                    className="rounded shrink-0 border border-zinc-700/40"
                    unoptimized
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-zinc-800 shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
                    {result.name[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                  >
                    {result.name}
                  </p>
                  {result.title && (
                    <p className="text-[11px] text-[#f4a029]/70 truncate">{result.title}</p>
                  )}
                </div>
                {!result.is_public && (
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 shrink-0">{notPublicText}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
