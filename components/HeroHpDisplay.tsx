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
            boxShadow: `0 0 6px ${color}80`,
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
              className="flex-1 min-w-24 border border-zinc-800/60 bg-[#0d0d1a] px-4 py-3"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
                <span className="text-[10px] text-zinc-700">{pct}%</span>
              </div>
              <p
                className="text-2xl font-bold leading-none mb-3"
                style={{ color, fontFamily: '"Rajdhani", system-ui, sans-serif', textShadow: `0 0 12px ${glow}` }}
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
          className="shrink-0 border border-[#f4a029]/20 bg-[#f4a029]/5 px-5 py-3 flex flex-col justify-between"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
        >
          <span className="text-[10px] uppercase tracking-widest text-[#f4a029]/50">{labels.total}</span>
          <p
            className="text-4xl font-bold leading-none text-[#f4a029] mt-2"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', textShadow: "0 0 16px rgba(244,160,41,0.5)" }}
          >
            {total}
          </p>
        </div>
      </div>
    </div>
  );
}
