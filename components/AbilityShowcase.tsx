"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import type { HeroAbility } from "@/types/overwatch";

export default function AbilityShowcase({ abilities }: { abilities: HeroAbility[] }) {
  const [selected, setSelected] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = abilities[selected];

  const select = useCallback((i: number) => {
    if (i === selected) return;
    setFading(true);
    setTimeout(() => {
      setSelected(i);
      setFading(false);
    }, 180);
  }, [selected]);

  useEffect(() => {
    if (!videoRef.current || fading) return;
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
  }, [selected, fading]);

  return (
    <div className="select-none">

      {/* ── Video area ── */}
      <div className="relative bg-black overflow-hidden"
        style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}>

        {/* Video / fallback */}
        <div
          className="relative w-full aspect-video transition-opacity duration-200"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {current.video ? (
            <video
              ref={videoRef}
              key={selected}
              className="w-full h-full object-cover"
              loop autoPlay playsInline muted
            >
              <source src={current.video.link.webm} type="video/webm" />
              <source src={current.video.link.mp4} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#06060e]">
              <Image src={current.icon} alt={current.name} width={80} height={80} unoptimized className="opacity-20" />
            </div>
          )}

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
          {/* Bottom gradient — bleeds into info panel */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
            style={{ background: "linear-gradient(to top, #000 0%, transparent 100%)" }} />
        </div>

        {/* ── Info panel overlaid at bottom ── */}
        <div
          className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-10 transition-opacity duration-200"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {/* Ability index */}
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#f4a029]/60 mb-1 font-medium">
            {String(selected + 1).padStart(2, "0")} / {String(abilities.length).padStart(2, "0")}
          </p>
          {/* Ability name */}
          <h3
            className="text-white font-bold leading-none mb-2"
            style={{
              fontFamily: '"Rajdhani", system-ui, sans-serif',
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              letterSpacing: "0.05em",
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            }}
          >
            {current.name}
          </h3>
          {/* Description */}
          <p
            className="text-zinc-300 text-sm leading-relaxed max-w-2xl"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
          >
            {current.description}
          </p>
        </div>
      </div>

      {/* ── Ability icon selector ── */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {abilities.map((ability, i) => {
          const active = selected === i;
          return (
            <button
              key={ability.name}
              type="button"
              onClick={() => select(i)}
              className="group relative flex flex-col items-center gap-2 transition-transform duration-150 hover:scale-105 active:scale-95"
              title={ability.name}
            >
              {/* Icon frame */}
              <div
                className="relative w-14 h-14 transition-all duration-200"
                style={{
                  clipPath: "polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)",
                  background: active
                    ? "linear-gradient(135deg, rgba(244,160,41,0.25), rgba(244,160,41,0.08))"
                    : "rgba(13,13,26,0.9)",
                  boxShadow: active
                    ? "0 0 0 1.5px #f4a029, 0 0 16px rgba(244,160,41,0.4)"
                    : "0 0 0 1px rgba(255,255,255,0.07)",
                }}
              >
                <Image
                  src={ability.icon}
                  alt={ability.name}
                  fill
                  unoptimized
                  className="object-contain p-1.5 transition-all duration-200"
                  style={{ opacity: active ? 1 : 0.4, filter: active ? "none" : "grayscale(40%)" }}
                />
              </div>

              {/* Active underline dot */}
              <span
                className="block w-1 h-1 rounded-full transition-all duration-200"
                style={{ background: active ? "#f4a029" : "transparent", boxShadow: active ? "0 0 6px #f4a029" : "none" }}
              />

              {/* Name label */}
              <span
                className="text-[9px] uppercase tracking-wider text-center max-w-[64px] line-clamp-2 leading-tight transition-colors duration-200"
                style={{
                  fontFamily: '"Rajdhani", system-ui, sans-serif',
                  color: active ? "#f4a029" : "rgba(161,161,170,0.6)",
                }}
              >
                {ability.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
