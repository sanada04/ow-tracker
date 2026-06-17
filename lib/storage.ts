"use client";

const SEARCH_HISTORY_KEY = "ow_search_history";
const FAVORITES_KEY = "ow_favorites";
const MAX_HISTORY = 10;

export interface SearchHistoryEntry {
  playerId: string;
  username: string;
  avatar: string | null;
  timestamp: number;
}

export interface FavoriteEntry {
  playerId: string;
  username: string;
  avatar: string | null;
  addedAt: number;
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ── Search History ──────────────────────────────────────────────────────
export function getSearchHistory(): SearchHistoryEntry[] {
  return safeRead<SearchHistoryEntry[]>(SEARCH_HISTORY_KEY, []);
}

export function addSearchHistory(entry: Omit<SearchHistoryEntry, "timestamp">): void {
  const history = getSearchHistory().filter((e) => e.playerId !== entry.playerId);
  history.unshift({ ...entry, timestamp: Date.now() });
  safeWrite(SEARCH_HISTORY_KEY, history.slice(0, MAX_HISTORY));
}

export function removeSearchHistory(playerId: string): void {
  const history = getSearchHistory().filter((e) => e.playerId !== playerId);
  safeWrite(SEARCH_HISTORY_KEY, history);
}

export function clearSearchHistory(): void {
  safeWrite(SEARCH_HISTORY_KEY, []);
}

// ── Favorites ──────────────────────────────────────────────────────────
export function getFavorites(): FavoriteEntry[] {
  return safeRead<FavoriteEntry[]>(FAVORITES_KEY, []);
}

export function isFavorite(playerId: string): boolean {
  return getFavorites().some((f) => f.playerId === playerId);
}

export function addFavorite(entry: Omit<FavoriteEntry, "addedAt">): void {
  const favorites = getFavorites().filter((f) => f.playerId !== entry.playerId);
  favorites.unshift({ ...entry, addedAt: Date.now() });
  safeWrite(FAVORITES_KEY, favorites);
}

export function removeFavorite(playerId: string): void {
  const favorites = getFavorites().filter((f) => f.playerId !== playerId);
  safeWrite(FAVORITES_KEY, favorites);
}

export function toggleFavorite(entry: Omit<FavoriteEntry, "addedAt">): boolean {
  if (isFavorite(entry.playerId)) {
    removeFavorite(entry.playerId);
    return false;
  } else {
    addFavorite(entry);
    return true;
  }
}
