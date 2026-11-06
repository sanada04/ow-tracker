"use client";

import { useEffect, useRef } from "react";

interface Props {
  health: number;
  armor: number;
  shields: number;
  total: number;
  labels: {
    health: string;
    armor: string;
    shields: string;
    total: string;
  };
}

const SEGMENT_SIZE = 25;

function Segments({ value, color, delay }: { value: number; color: string; delay: number }) {
  const count = Math.round(value / SEGMENT_SIZE);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1 min-w-0 rounded-[1px] opacity-0"
          style={{
            background: color,
            animation: `hp-block-in 0.25s ease both`,
            animationDelay: `${delay + i * 18}ms`,
          }}
        />
      ))}
    </>
  );
}

export default function HeroHpDisplay({ health, armor, shields, total, labels }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const types = [
    { val: health,  color: "#4ade80", label: labels.health,  glow: "rgba(74,222,128,0.4)"  },
    { val: armor,   color: "#facc15", label: labels.armor,   glow: "rgba(250,204,21,0.4)"  },
    { val: shields, color: "#60a5fa", label: labels.shields, glow: "rgba(96,165,250,0.4)"  },
  ].filter(t => t.val > 0);

  return (
    <div ref={containerRef}>
      <style>{`
        @keyframes hp-block-in {
          from { opacity: 0; transform: scaleY(0.3); }
          to   { opacity: 1; transform: scaleY(1); }
        }
      `}</style>

      {/* ── Stacked segment bar ── */}
      <div className="flex gap-[3px] h-5 mb-5">
        {types.map((t, gi) => {
          const delay = gi * (Math.round(t.val / SEGMENT_SIZE) * 18 + 40);
          return (
            <div
              key={t.label}
              className="flex gap-[2px] items-stretch"
              style={{ flex: t.val }}
            >
              <Segments value={t.val} color={t.color} delay={delay} />
            </div>
          );
        })}
      </div>

      {/* ── Type cards ── */}
      <div className="flex gap-3 flex-wrap">
        {types.map(({ val, color, label, glow }) => {
          const pct = Math.round((val / total) * 100);
          return (
            <div
              key={label}
              className="flex-1 min-w-24 border border-zinc-800/60 bg-[var(--ow-bg)] px-4 py-3 rounded"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs tracking-normal text-zinc-500">{label}</span>
                <span className="text-xs text-zinc-500">{pct}%</span>
              </div>
              <p
                className="text-2xl font-bold leading-none mb-3"
                style={{ color, fontFamily: "var(--font-heading)" }}
              >
                {val}
              </p>
              {/* Mini bar */}
              <div className="h-[2px] bg-zinc-800/80 overflow-hidden">
                <div
                  className="h-full winrate-bar"
                  style={{ "--bar-target": `${pct}%`, background: color } as React.CSSProperties}
                />
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div
          className="shrink-0 border border-[var(--ow-accent)]/20 bg-[var(--ow-accent)]/5 px-5 py-3 flex flex-col justify-between rounded"
        >
          <span className="text-xs tracking-normal text-[var(--ow-accent)]/50">{labels.total}</span>
          <p
            className="text-4xl font-bold leading-none text-[var(--ow-accent)] mt-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {total}
          </p>
        </div>
      </div>
    </div>
  );
}
