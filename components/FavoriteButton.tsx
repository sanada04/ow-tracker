"use client";

import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "@/lib/storage";

export default function FavoriteButton({
  playerId,
  username,
  avatar,
  labels,
}: {
  playerId: string;
  username: string;
  avatar: string | null;
  labels: { favorite: string; unfavorite: string };
}) {
  const [faved, setFaved] = useState(false);

  useEffect(() => {
    Promise.resolve(isFavorite(playerId)).then(setFaved);
  }, [playerId]);

  function handleClick() {
    const next = toggleFavorite({ playerId, username, avatar });
    setFaved(next);
  }

  return (
    <button
      onClick={handleClick}
      title={faved ? labels.unfavorite : labels.favorite}
      className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs tracking-normal font-medium transition-colors ${
        faved
          ? "border-[var(--ow-accent)]/60 text-[var(--ow-accent)] bg-[var(--ow-accent)]/10 hover:bg-[var(--ow-accent)]/20"
          : "border-zinc-700/60 text-zinc-500 hover:border-[var(--ow-accent)]/40 hover:text-[var(--ow-accent)]"
      }`}
    >
      <span className="text-base leading-none">{faved ? "★" : "☆"}</span>
      <span>{faved ? labels.unfavorite : labels.favorite}</span>
    </button>
  );
}
