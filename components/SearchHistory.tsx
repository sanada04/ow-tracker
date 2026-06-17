"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getSearchHistory,
  getFavorites,
  removeSearchHistory,
  clearSearchHistory,
  removeFavorite,
  type SearchHistoryEntry,
  type FavoriteEntry,
} from "@/lib/storage";

interface Labels {
  recent_title: string;
  favorites_title: string;
  clear_history: string;
  remove: string;
  no_recent: string;
  no_favorites: string;
  compare_hint: string;
}

function PlayerRow({
  playerId,
  username,
  avatar,
  lang,
  onRemove,
  compareHint,
}: {
  playerId: string;
  username: string;
  avatar: string | null;
  lang: string;
  onRemove: () => void;
  compareHint: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1a1a2a] transition-colors group">
      <Link href={`/${lang}/players/${encodeURIComponent(playerId)}`} className="flex items-center gap-3 flex-1 min-w-0">
        {avatar ? (
          <Image src={avatar} alt={username} width={28} height={28}
            className="rounded border border-zinc-700/50 shrink-0" unoptimized />
        ) : (
          <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700/50 shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
            {username[0]?.toUpperCase()}
          </div>
        )}
        <span className="text-white text-sm font-semibold truncate"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          {username}
        </span>
      </Link>
      <Link
        href={`/${lang}/compare?a=${encodeURIComponent(playerId)}`}
        className="text-[10px] uppercase tracking-wider text-zinc-600 hover:text-[#f4a029] transition-colors shrink-0 opacity-0 group-hover:opacity-100"
      >
        {compareHint}
      </Link>
      <button
        onClick={onRemove}
        className="text-zinc-700 hover:text-zinc-400 shrink-0 opacity-0 group-hover:opacity-100 transition-all text-lg leading-none"
        aria-label="Remove"
      >
        ×
      </button>
    </div>
  );
}

export default function SearchHistory({
  lang,
  labels,
}: {
  lang: string;
  labels: Labels;
}) {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHistory(getSearchHistory());
    setFavorites(getFavorites());
    setMounted(true);
  }, []);

  if (!mounted || (history.length === 0 && favorites.length === 0)) return null;

  return (
    <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
      {/* Recent Searches */}
      {history.length > 0 && (
        <div className="ow-card overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-zinc-800/60">
            <span className="text-[10px] uppercase tracking-widest text-[#f4a029]/70">
              {labels.recent_title}
            </span>
            <button
              onClick={() => { clearSearchHistory(); setHistory([]); }}
              className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-wider transition-colors"
            >
              {labels.clear_history}
            </button>
          </div>
          <div className="divide-y divide-zinc-800/30">
            {history.slice(0, 5).map((entry) => (
              <PlayerRow
                key={entry.playerId}
                playerId={entry.playerId}
                username={entry.username}
                avatar={entry.avatar}
                lang={lang}
                compareHint={labels.compare_hint}
                onRemove={() => {
                  removeSearchHistory(entry.playerId);
                  setHistory(getSearchHistory());
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="ow-card overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-zinc-800/60">
            <span className="text-[10px] uppercase tracking-widest text-[#f4a029]/70">
              {labels.favorites_title}
            </span>
          </div>
          <div className="divide-y divide-zinc-800/30">
            {favorites.slice(0, 5).map((entry) => (
              <PlayerRow
                key={entry.playerId}
                playerId={entry.playerId}
                username={entry.username}
                avatar={entry.avatar}
                lang={lang}
                compareHint={labels.compare_hint}
                onRemove={() => {
                  removeFavorite(entry.playerId);
                  setFavorites(getFavorites());
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
