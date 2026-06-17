"use client";

import { useState } from "react";

export default function ShareButtons({
  username,
  labels,
}: {
  username: string;
  labels: { copy_url: string; copied: string; tweet: string; share_title: string };
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleTweet() {
    const text = encodeURIComponent(`${username} の Overwatch 2 戦績 — OW Tracker`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs uppercase tracking-widest font-medium transition-colors ${
          copied
            ? "border-green-600/60 text-green-400 bg-green-900/20"
            : "border-zinc-700/60 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
        }`}
        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
      >
        <span className="text-sm leading-none">{copied ? "✓" : "⎘"}</span>
        <span>{copied ? labels.copied : labels.copy_url}</span>
      </button>
      <button
        onClick={handleTweet}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700/60 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 text-xs uppercase tracking-widest font-medium transition-colors"
        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
      >
        <span className="font-bold leading-none text-sm">𝕏</span>
        <span>{labels.tweet}</span>
      </button>
    </div>
  );
}
