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
      <form onSubmit={handleSubmit} className="flex" suppressHydrationWarning>
        {/* Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setNoResults(false); }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(0,204,255,0.55)";
              if (suggestions.length > 0) setOpen(true);
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
            placeholder={placeholder}
            autoComplete="off"
            suppressHydrationWarning
            className="w-full px-5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm"
            style={{
              height: compact ? "40px" : "52px",
              background: "#101014",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRight: "none",
              borderRadius: "2px 0 0 2px",
              fontFamily: '"Rajdhani", system-ui, sans-serif',
              letterSpacing: "0.03em",
              fontSize: "0.9rem",
            }}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-[#00ccff] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!value.trim() || loading}
          suppressHydrationWarning
          className="shrink-0 font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
          style={{
            height: compact ? "40px" : "52px",
            padding: compact ? "0 1rem" : "0 1.5rem",
            background: "#f4a029",
            color: "#080810",
            border: "none",
            borderRadius: "0 2px 2px 0",
            fontFamily: '"Rajdhani", system-ui, sans-serif',
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
          }}
        >
          {buttonText}
        </button>
      </form>

      {/* No results notice */}
      {noResults && !loading && value.trim().length >= 2 && (
        <div
          className="absolute mt-1 w-full z-50 px-4 py-3 text-sm text-zinc-400"
          style={{
            background: "#141418",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "2px",
          }}
        >
          <span className="text-[#9090b0] text-sm">{noResultsText}</span>
        </div>
      )}

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full shadow-2xl overflow-hidden"
          style={{
            background: "#141418",
            border: "1px solid rgba(0,204,255,0.25)",
            borderRadius: "2px",
          }}
        >
          {suggestions.map((result, i) => (
            <li key={result.player_id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(result)}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(result)}
                className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer animate-fade-up"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  animationDelay: `${i * 30}ms`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,196,239,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {result.avatar ? (
                  <Image
                    src={result.avatar}
                    alt={result.name}
                    width={32}
                    height={32}
                    className="rounded shrink-0"
                    style={{ border: "1px solid rgba(0,196,239,0.15)" }}
                    unoptimized
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-zinc-800 shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
                    {result.name[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className="text-white text-sm font-semibold truncate"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                  >
                    {result.name}
                  </p>
                  {result.title && (
                    <p className="text-[11px] text-[#00ccff]/50 truncate">{result.title}</p>
                  )}
                </div>
                {!result.is_public && (
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 shrink-0">{notPublicText}</span>
                )}
                <span className="text-zinc-700 text-sm shrink-0">›</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
