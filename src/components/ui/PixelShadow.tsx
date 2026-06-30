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
const GLOW_SPAWN_MS = 280; // highlight spawn cadence in glow (hover) mode
const HOVER_FADE_MS = 220; // base slate -> indigo crossfade on hover

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
// Fraction of the shadow's pixels that light up per spawn tick when glowing —
// keeps the highlight a sparse, random subset rather than the whole outline.
const GLOW_SPAWN_FRACTION = 0.13;

// Canvas pixel shadow: a static grid of pixels anchored to the bottom-right
// (matching the CSS pixel shadow), with a rotating random subset that smoothly
// fades up to solid indigo and back. When `glow` is set, the rotating subset is
// only spawned while `active` is true, so the shadow can light up on hover and
// settle back to its static grid when idle.
export default function PixelShadow({
  color,
  glow = false,
  active = true,
  baseAlpha = 1,
  activeColor,
  activeBaseAlpha,
}: {
  color: string;
  glow?: boolean;
  active?: boolean;
  baseAlpha?: number;
  activeColor?: string;
  activeBaseAlpha?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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
    // Grid indices that fall inside the visible shadow band — the pool the glow
    // highlight draws from so sparkles never appear away from the outline.
    const edgeCells: number[] = [];
    let lastSpawn = 0;
    // Eased 0..1 hover progress used to crossfade the static base from `color`
    // (slate) to `activeColor` (indigo) and up to `activeBaseAlpha`.
    let hoverT = 0;
    const baseRgb = hexToRgb(color);
    const activeRgb = activeColor ? hexToRgb(activeColor) : null;
    const hoverAlpha = activeBaseAlpha ?? baseAlpha;

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
      edgeCells.length = 0;
      for (let r = 0; r < rows; r++) {
        const y = Math.round(h + OFFSET - (r + 1) * GRID);
        if (y + PIX > h || y < 0) continue;
        for (let c = 0; c < cols; c++) {
          const x = Math.round(w + OFFSET - (c + 1) * GRID);
          if (x + PIX > w || x < 0) continue;
          if (alphaAt(x, y) > 0.001) edgeCells.push(r * cols + c);
        }
      }
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // Prune finished pixels before the base pass so a just-completed pixel is
      // redrawn at full base this frame (no one-frame gap / flicker).
      for (const [idx, a] of active) {
        if ((now - a.start) / a.dur >= 1) active.delete(idx);
      }

      if (activeRgb && hoverT > 0) {
        const br = Math.round(
          baseRgb[0] + (activeRgb[0] - baseRgb[0]) * hoverT,
        );
        const bg = Math.round(
          baseRgb[1] + (activeRgb[1] - baseRgb[1]) * hoverT,
        );
        const bb = Math.round(
          baseRgb[2] + (activeRgb[2] - baseRgb[2]) * hoverT,
        );
        ctx.fillStyle = `rgb(${br},${bg},${bb})`;
      } else {
        ctx.fillStyle = color;
      }
      const baseA = baseAlpha + (hoverAlpha - baseAlpha) * hoverT;
      for (let r = 0; r < rows; r++) {
        const y = Math.round(h + OFFSET - (r + 1) * GRID);
        if (y + PIX > h) continue;
        if (y < 0) break;
        for (let c = 0; c < cols; c++) {
          const x = Math.round(w + OFFSET - (c + 1) * GRID);
          if (x + PIX > w) continue;
          if (x < 0) break;
          if (!glow && active.has(r * cols + c)) continue;
          ctx.globalAlpha = alphaAt(x, y) * baseA;
          ctx.fillRect(x, y, PIX, PIX);
        }
      }

      ctx.fillStyle = glow ? (activeColor ?? HIGHLIGHT) : color;
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
          ? // fade up to solid indigo, hold, then fade out — kept inside the
            // shadow band by the distance-field alpha so sparkles trace the edge
            (t < 0.25 ? t / 0.25 : t > 0.75 ? (1 - t) / 0.25 : 1) *
            alphaAt(x, y)
          : // smoothly fade the pixel away and back
            alphaAt(x, y) * (1 - Math.sin(t * Math.PI));
        ctx.fillRect(x, y, PIX, PIX);
      }
      ctx.globalAlpha = 1;
    };

    const spawn = (now: number) => {
      const pool = glow ? edgeCells : null;
      const poolLen = pool ? pool.length : cols * rows;
      if (poolLen === 0) return;
      const n = Math.max(
        1,
        Math.round(poolLen * (glow ? GLOW_SPAWN_FRACTION : 0.045)),
      );
      for (let i = 0; i < n; i++) {
        const idx = pool
          ? pool[Math.floor(Math.random() * pool.length)]
          : Math.floor(Math.random() * poolLen);
        if (!active.has(idx))
          active.set(idx, {
            start: now,
            dur: glow
              ? 1200 + Math.random() * 1000
              : 1000 + Math.random() * 900,
          });
      }
    };

    sync();
    render(performance.now());

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let timer: number | null = null;
    let lastTick = performance.now();
    if (!reduce) {
      timer = window.setInterval(() => {
        const now = performance.now();
        const target = activeRef.current ? 1 : 0;
        if (hoverT !== target) {
          const step = (now - lastTick) / HOVER_FADE_MS;
          hoverT =
            target > hoverT
              ? Math.min(target, hoverT + step)
              : Math.max(target, hoverT - step);
        }
        lastTick = now;
        if (
          activeRef.current &&
          now - lastSpawn > (glow ? GLOW_SPAWN_MS : SPAWN_MS)
        ) {
          lastSpawn = now;
          spawn(now);
        }
        // Idle (settled, not active, base fully faded) frames need no redraw —
        // the static base from the last render stays on the canvas.
        if (activeRef.current || active.size > 0 || hoverT > 0.0001)
          render(now);
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
  }, [color, glow, baseAlpha, activeColor, activeBaseAlpha]);

  return (
    <div
      aria-hidden="true"
      className="absolute top-3 left-3 -right-3 -bottom-3"
    >
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
