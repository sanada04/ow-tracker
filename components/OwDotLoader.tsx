"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  delay: number;
  startedAt: number | null;
  settled: boolean;
  phase: number;
  color: string;
  radius: number;
}

interface Props {
  width?: number;
  height?: number;
  className?: string;
}

const ORANGE = "#f4a029";
const WHITE = "#ffffff";

function sampleTargets(width: number, height: number): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d");
  if (!ctx) return [];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const text = "OW TRACKER";
  const maxTextWidth = width * 0.94;

  // start from a size proportional to the canvas, then measure the actual
  // rendered width (with letter-spacing applied) and scale down once if it
  // would overflow, so it both fills the space and stays centered
  let fontSize = Math.floor(height * 0.68);
  let letterSpacing = Math.round(fontSize * 0.03);
  ctx.font = `800 ${fontSize}px "Rajdhani", system-ui, sans-serif`;
  ctx.letterSpacing = `${letterSpacing}px`;
  let textWidth = ctx.measureText(text).width;

  if (textWidth > maxTextWidth) {
    const scale = maxTextWidth / textWidth;
    fontSize = Math.floor(fontSize * scale);
    letterSpacing = Math.round(fontSize * 0.03);
    ctx.font = `800 ${fontSize}px "Rajdhani", system-ui, sans-serif`;
    ctx.letterSpacing = `${letterSpacing}px`;
    textWidth = ctx.measureText(text).width;
  }

  const startX = (width - textWidth) / 2;
  ctx.fillText(text, startX, height / 2 + fontSize * 0.03);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: { x: number; y: number }[] = [];
  const step = 3;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 128) points.push({ x, y });
    }
  }
  // shuffle so the fill-in order looks organic, not scanline-by-scanline
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }
  return points;
}

export default function OwDotLoader({ width = 580, height = 160, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext("2d");
    if (!rawCtx) return;
    const ctx = rawCtx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let dots: Dot[] = [];
    let raf = 0;
    let cancelled = false;

    function buildDots(targets: { x: number; y: number }[]) {
      const maxDots = 950;
      const picked =
        targets.length > maxDots
          ? targets.slice(0, maxDots)
          : targets;

      const diag = Math.hypot(width, height);
      dots = picked.map((t, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = diag * (0.9 + Math.random() * 0.6);
        return {
          x: width / 2 + Math.cos(angle) * dist,
          y: height / 2 + Math.sin(angle) * dist,
          sx: width / 2 + Math.cos(angle) * dist,
          sy: height / 2 + Math.sin(angle) * dist,
          tx: t.x,
          ty: t.y,
          delay: (i / picked.length) * 500 + Math.random() * 300,
          startedAt: null,
          settled: false,
          phase: Math.random() * Math.PI * 2,
          radius: 0.9 + Math.random() * 0.7,
          color: Math.random() < 0.35 ? ORANGE : WHITE,
        };
      });
    }

    let start = performance.now();
    const CONVERGE_MS = 1000;

    function tick(now: number) {
      if (cancelled) return;
      ctx.clearRect(0, 0, width, height);

      for (const d of dots) {
        if (d.startedAt === null) {
          if (now - start >= d.delay) d.startedAt = now;
        }

        if (d.startedAt !== null) {
          const t = Math.min(1, (now - d.startedAt) / CONVERGE_MS);
          const eased = 1 - Math.pow(1 - t, 3);
          d.x = d.sx + (d.tx - d.sx) * eased;
          d.y = d.sy + (d.ty - d.sy) * eased;
          if (t >= 1) d.settled = true;
        }

        let drawX = d.x;
        let drawY = d.y;
        let alpha = d.startedAt === null ? 0 : 1;

        if (d.settled) {
          const breathe = Math.sin(now / 900 + d.phase) * 0.6;
          drawX = d.x + breathe;
          drawY = d.y + Math.cos(now / 700 + d.phase) * 0.4;
          alpha = 0.75 + Math.sin(now / 900 + d.phase) * 0.25;
        }

        ctx.beginPath();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = d.color;
        ctx.arc(drawX, drawY, d.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    }

    // wait for the Rajdhani font so the text sampling is accurate; fall
    // back immediately if the FontFace API is unavailable
    const ready =
      "fonts" in document
        ? document.fonts.load('800 100px "Rajdhani"').then(() => document.fonts.ready)
        : Promise.resolve();

    ready.then(() => {
      if (cancelled) return;
      buildDots(sampleTargets(width, height));
      start = performance.now();
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
