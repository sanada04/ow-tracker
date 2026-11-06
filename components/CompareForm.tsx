"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPlayerId } from "@/lib/format";

interface Labels {
  player_a: string;
  player_b: string;
  enter_tag: string;
  compare_btn: string;
}

export default function CompareForm({
  lang,
  initialA = "",
  initialB = "",
  labels,
}: {
  lang: string;
  initialA?: string;
  initialB?: string;
  labels: Labels;
}) {
  const [a, setA] = useState(initialA.replace(/-(\d+)$/, "#$1"));
  const [b, setB] = useState(initialB.replace(/-(\d+)$/, "#$1"));
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pa = a.trim();
    const pb = b.trim();
    if (!pa || !pb) return;
    const idA = pa.includes("#") ? formatPlayerId(pa) : pa;
    const idB = pb.includes("#") ? formatPlayerId(pb) : pb;
    router.push(`/${lang}/compare?a=${encodeURIComponent(idA)}&b=${encodeURIComponent(idB)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1 flex flex-col gap-1.5">
        <label className="text-xs tracking-normal text-[var(--ow-accent)]/70">{labels.player_a}</label>
        <input
          type="text"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder={labels.enter_tag}
          className="h-10 px-4 bg-[var(--ow-surface)] border border-zinc-700/60 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--ow-accent)]/60 transition-colors text-sm rounded"
        />
      </div>
      <div className="hidden sm:flex items-end pb-2">
        <span className="text-zinc-500 font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>VS</span>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <label className="text-xs tracking-normal text-[var(--ow-accent)]/70">{labels.player_b}</label>
        <input
          type="text"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder={labels.enter_tag}
          className="h-10 px-4 bg-[var(--ow-surface)] border border-zinc-700/60 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--ow-accent)]/60 transition-colors text-sm rounded"
        />
      </div>
      <button
        type="submit"
        disabled={!a.trim() || !b.trim()}
        className="h-10 px-6 bg-[var(--ow-accent)] hover:bg-[var(--ow-accent-strong)] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm tracking-normal transition-colors shrink-0 rounded"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {labels.compare_btn}
      </button>
    </form>
  );
}
