"use client";

import { useEffect, useRef } from "react";

const GRID = 4;
const PIX = 2;
// The offset strip is exactly 3 grid cells (12px) wide; this phase lands all
// three pixel columns/rows fully inside it with symmetric margins and no clip.
const OFFSET = 1;
const LAYERS = 3; // pixel columns/rows that fit in the offset strip
const STRIP = LAYERS * GRID; // width (px) of the offset shadow region
// Opacity from the box's distance field: pixels within FADE_START px of the box
// edge stay at MAX, then fade to 0 by FADE_END — tracing the box outline.
const MAX_ALPHA = 1;
const FADE_START = 3;
const FADE_END = 14;
const HIGHLIGHT = "#4f46e5"; // solid main indigo
const FRAME_MS = 33;
const SPAWN_MS = 220;

// Canvas pixel shadow: a static grid of pixels anchored to the bottom-right
// (matching the CSS pixel shadow), with a rotating random subset that smoothly
// fades up to solid indigo and back.
export default function PixelShadow({
  color,
  glow = false,
}: {
  color: string;
  glow?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let w = 0;
    let h = 0;
    const active = new Map<number, { start: number; dur: number }>();
    let lastSpawn = 0;

    // Opacity from the box's signed distance field: max near the edge, fading
    // outward by Euclidean distance so the shadow traces the box outline.
    const alphaAt = (x: number, y: number) => {
      const ddx = Math.max(0, x + PIX / 2 - (w - STRIP));
      const ddy = Math.max(0, y + PIX / 2 - (h - STRIP));
      const d = Math.sqrt(ddx * ddx + ddy * ddy);
      const f = (FADE_END - d) / (FADE_END - FADE_START);
      return MAX_ALPHA * Math.max(0, Math.min(1, f));
    };

    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GRID) + 1;
      rows = Math.ceil(h / GRID) + 1;
      active.clear();
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // Prune finished pixels before the base pass so a just-completed pixel is
      // redrawn at full base this frame (no one-frame gap / flicker).
      for (const [idx, a] of active) {
        if ((now - a.start) / a.dur >= 1) active.delete(idx);
      }

      ctx.fillStyle = color;
      for (let r = 0; r < rows; r++) {
        const y = Math.round(h + OFFSET - (r + 1) * GRID);
        if (y + PIX > h) continue;
        if (y < 0) break;
        for (let c = 0; c < cols; c++) {
          const x = Math.round(w + OFFSET - (c + 1) * GRID);
          if (x + PIX > w) continue;
          if (x < 0) break;
          if (!glow && active.has(r * cols + c)) continue;
          ctx.globalAlpha = alphaAt(x, y);
          ctx.fillRect(x, y, PIX, PIX);
        }
      }

      ctx.fillStyle = glow ? HIGHLIGHT : color;
      for (const [idx, a] of active) {
        const t = (now - a.start) / a.dur;
        if (t >= 1) {
          active.delete(idx);
          continue;
        }
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const x = Math.round(w + OFFSET - (c + 1) * GRID);
        const y = Math.round(h + OFFSET - (r + 1) * GRID);
        if (x < 0 || y < 0 || x + PIX > w || y + PIX > h) continue;
        ctx.globalAlpha = glow
          ? // fade up to solid indigo, hold, then fade out
            t < 0.25
            ? t / 0.25
            : t > 0.75
              ? (1 - t) / 0.25
              : 1
          : // smoothly fade the pixel away and back
            alphaAt(x, y) * (1 - Math.sin(t * Math.PI));
        ctx.fillRect(x, y, PIX, PIX);
      }
      ctx.globalAlpha = 1;
    };

    sync();

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let timer: number | null = null;
    if (reduce) {
      render(0);
    } else {
      timer = window.setInterval(() => {
        const now = performance.now();
        if (now - lastSpawn > SPAWN_MS) {
          lastSpawn = now;
          const total = cols * rows;
          const n = Math.max(1, Math.round(total * (glow ? 0.02 : 0.045)));
          for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * total);
            if (!active.has(idx))
              active.set(idx, { start: now, dur: 1000 + Math.random() * 900 });
          }
        }
        render(performance.now());
      }, FRAME_MS);
    }

    const ro = new ResizeObserver(() => {
      sync();
      render(performance.now());
    });
    ro.observe(canvas);

    return () => {
      if (timer) clearInterval(timer);
      ro.disconnect();
    };
  }, [color]);

  return (
    <div
      aria-hidden="true"
      className="absolute top-3 left-3 -right-3 -bottom-3"
    >
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
