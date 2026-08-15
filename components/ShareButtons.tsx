"use client";

import { useState, useEffect } from "react";

export default function ShareButtons({
  username,
  labels,
}: {
  username: string;
  labels: { copy_url: string; copied: string; tweet: string; share_title: string };
}) {
  const [copied, setCopied] = useState(false);
  const [tweetHref, setTweetHref] = useState("");

  useEffect(() => {
    const text = encodeURIComponent(`${username} の Overwatch 2 戦績 — OW Tracker`);
    const url = encodeURIComponent(window.location.href);
    setTweetHref(`https://x.com/intent/tweet?text=${text}&url=${url}`);
  }, [username]);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const baseClass =
    "flex items-center gap-1.5 px-3 py-1.5 border text-xs uppercase tracking-widest font-medium transition-colors";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className={`${baseClass} rounded ${
          copied
            ? "border-green-600/60 text-green-400 bg-green-900/20"
            : "border-zinc-700/60 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
        }`}
      >
        <span className="text-sm leading-none">{copied ? "✓" : "⎘"}</span>
        <span>{copied ? labels.copied : labels.copy_url}</span>
      </button>

      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} border-zinc-700/60 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 rounded`}
      >
        <span className="font-bold leading-none text-sm">𝕏</span>
        <span>{labels.tweet}</span>
      </a>
    </div>
  );
}
