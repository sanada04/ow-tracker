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
    setFaved(isFavorite(playerId));
  }, [playerId]);

  function handleClick() {
    const next = toggleFavorite({ playerId, username, avatar });
    setFaved(next);
  }

  return (
    <button
      onClick={handleClick}
      title={faved ? labels.unfavorite : labels.favorite}
      className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs uppercase tracking-widest font-medium transition-colors ${
        faved
          ? "border-[#f4a029]/60 text-[#f4a029] bg-[#f4a029]/10 hover:bg-[#f4a029]/20"
          : "border-zinc-700/60 text-zinc-500 hover:border-[#f4a029]/40 hover:text-[#f4a029]"
      }`}
      style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
    >
      <span className="text-base leading-none">{faved ? "★" : "☆"}</span>
      <span>{faved ? labels.unfavorite : labels.favorite}</span>
    </button>
  );
}
