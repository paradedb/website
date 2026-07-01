"use client";

import { useEffect, useRef } from "react";

// A slowly drifting, dithered ASCII field, in the spirit of the pixel-dither
// table shadows on the homepage (see PixelShadow).
//
// The cloud is negative space: the dither FILLS everything outside the
// silhouette and leaves the interior clean for the text. The silhouette is a
// signed-distance union of a rounded-rectangle base (the flat bottom) and three
// circles for the humps: a big dome on the left, a medium hump, and a small
// bump on the right, inset so the top "pulls in" like a classic cloud icon.

const FONT_PX = 14;
const CELL_H = 16; // vertical spacing between character rows
const RAMP = [".", ":", "+", "*", "#"];
const MAX_ALPHA = 0.45;
// Density of the fill far from the cloud (0..1); it rises toward 1 near the
// edge. LEVEL_CUTOFF keeps the fill sparse/scattered rather than solid.
const FILL_FLOOR = 0.42;
const EDGE_FALLOFF_FRAC = 0.16; // edge-emphasis distance, fraction of cloud width
const LEVEL_CUTOFF = 0.26;
// A brighter, near-solid line hugging the cloud edge (outer side).
const LINE_ALPHA = 0.85;
const LINE_WIDTH_FRAC = 0.013; // line thickness, fraction of cloud width
const FRAME_MS = 40; // ~25fps; the drift is slow, so this stays smooth

// Cloud size: fraction of the container width, clamped.
const CLOUD_W_FRAC = 0.76;
const CLOUD_W_MIN = 820;
const CLOUD_W_MAX = 1120;
const ASPECT = 0.6; // cloud height / cloud width

// Below this viewport width, skip the cloud shape and just fill the hero with
// an even dither (a wide-short cloud reads badly on tall, narrow phones).
const MOBILE_BP = 640;
const MOBILE_FILL = 0.62;

// Signup ripple: an expanding bright ring that sweeps outward on success.
const BURST_MS = 1100;
const BURST_STRENGTH = 1.1;
const RING_WIDTH = 70; // px thickness of the ripple ring

// Load-in reveal: each symbol fades in independently at its own random moment,
// so the cloud accretes symbol-by-symbol rather than appearing all at once.
const INTRO_MS = 2600;
const INTRO_FADE = 0.22; // per-symbol fade duration, fraction of the timeline

type Cell = {
  x: number;
  y: number;
  c: number;
  r: number;
  density: number;
  line: number;
  hash: number;
  dc: number; // distance from the cloud centre, for the ripple
};

type Glow = { cx: number; cy: number; top: number; cw: number; ch: number };

const sdCircle = (
  px: number,
  py: number,
  cx: number,
  cy: number,
  rad: number,
) => Math.hypot(px - cx, py - cy) - rad;

// Signed distance to a rounded rectangle centred at (cx, cy).
const sdRoundedBox = (
  px: number,
  py: number,
  cx: number,
  cy: number,
  hx: number,
  hy: number,
  rad: number,
) => {
  const dx = Math.abs(px - cx) - (hx - rad);
  const dy = Math.abs(py - cy) - (hy - rad);
  return (
    Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) +
    Math.min(Math.max(dx, dy), 0) -
    rad
  );
};

export default function AsciiCloud({ color = "#c7d2fe" }: { color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cells: Cell[] = [];
    let glow: Glow | null = null;
    let w = 0;
    let h = 0;
    let timer: number | null = null;

    // Timestamp of the last successful-signup ripple (-1 = inactive).
    let burstT0 = -1;
    // Timestamp of the load-in reveal (-1 = not started / already complete).
    let introT0 = -1;

    const smoothstep = (t: number) => t * t * (3 - 2 * t);

    // Cheap deterministic per-cell noise, for a static shimmer phase.
    const hash = (c: number, r: number) => {
      const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_PX}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const charW = ctx.measureText("M").width || FONT_PX * 0.6;
      const cols = Math.max(1, Math.floor(w / charW));
      const rows = Math.max(1, Math.floor(h / CELL_H));

      // Cap by the viewport so the whole cloud stays on screen on phones
      // (the min would otherwise force it much wider than a mobile screen).
      const cw = Math.min(
        w * 0.94,
        CLOUD_W_MAX,
        Math.max(CLOUD_W_MIN, w * CLOUD_W_FRAC),
      );
      const ch = cw * ASPECT;
      const left = w / 2 - cw / 2;
      const top = h / 2 - ch / 2;
      // Local fractions -> screen px (x and y both scaled by cw so circles stay
      // round; y fractions run 0..ASPECT).
      const lx = (f: number) => left + f * cw;
      const ly = (f: number) => top + f * cw;
      glow = { cx: w / 2, cy: h / 2, top, cw, ch };

      // Silhouette pieces, in cloud-width fractions.
      const base = { cx: lx(0.5), cy: ly(0.42), hx: 0.47 * cw, hy: 0.17 * cw, rad: 0.17 * cw };
      const big = { cx: lx(0.35), cy: ly(0.25), rad: 0.26 * cw };
      const med = { cx: lx(0.62), cy: ly(0.27), rad: 0.18 * cw };
      const small = { cx: lx(0.82), cy: ly(0.33), rad: 0.12 * cw };

      const falloff = EDGE_FALLOFF_FRAC * cw;
      const lineW = LINE_WIDTH_FRAC * cw;
      const narrow = w < MOBILE_BP;

      cells = [];
      for (let rr = 0; rr < rows; rr++) {
        const py = rr * CELL_H + CELL_H / 2;
        for (let cc = 0; cc < cols; cc++) {
          const px = cc * charW + charW / 2;

          // Fade the fill out toward the left/right screen edges so it gets
          // lighter to the sides instead of cutting off.
          const sideT = Math.abs(px - w / 2) / (w / 2);
          const st = Math.min(1, Math.max(0, (sideT - 0.45) / 0.55));
          const sideFade = 1 - st * st * (3 - 2 * st);

          if (narrow) {
            // Mobile: no cloud shape, just an even dither across the hero.
            cells.push({
              x: px,
              y: py,
              c: cc,
              r: rr,
              density: MOBILE_FILL * sideFade,
              line: 0,
              hash: hash(cc, rr),
              dc: Math.hypot(px - w / 2, py - h / 2),
            });
            continue;
          }

          // Union of the pieces: negative inside, 0 on the outline.
          const sdf = Math.min(
            sdRoundedBox(px, py, base.cx, base.cy, base.hx, base.hy, base.rad),
            sdCircle(px, py, big.cx, big.cy, big.rad),
            sdCircle(px, py, med.cx, med.cy, med.rad),
            sdCircle(px, py, small.cx, small.cy, small.rad),
          );

          if (sdf < 0) continue; // inside the cloud: keep it clean

          // Fill everything outside; denser near the edge, floor far away.
          const edge = Math.exp(-sdf / falloff);
          const density = (FILL_FLOOR + (1 - FILL_FLOOR) * edge) * sideFade;
          // Bright line: 1 right on the edge, fading out over lineW.
          const line = Math.max(0, 1 - sdf / lineW);

          cells.push({
            x: px,
            y: py,
            c: cc,
            r: rr,
            density,
            line,
            hash: hash(cc, rr),
            dc: Math.hypot(px - w / 2, py - h / 2),
          });
        }
      }
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // Soft light centred on the cloud, fading outward.
      if (glow) {
        const g = ctx.createRadialGradient(
          glow.cx,
          glow.top + glow.ch * 0.12,
          0,
          glow.cx,
          glow.cy,
          glow.cw * 0.6,
        );
        g.addColorStop(0, "rgba(255,255,255,0.14)");
        g.addColorStop(0.5, "rgba(255,255,255,0.05)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Load-in reveal progress (linear). 1 = fully revealed.
      let introP = 1;
      if (introT0 >= 0) {
        const it = (now - introT0) / INTRO_MS;
        if (it >= 1) introT0 = -1;
        else introP = Math.max(0, it);
      }

      // Expanding ripple ring after a successful signup.
      let ringR = -1;
      let ringFade = 0;
      if (burstT0 >= 0) {
        const bt = (now - burstT0) / BURST_MS;
        if (bt >= 1) burstT0 = -1;
        else {
          ringR = bt * Math.hypot(w, h) * 0.6;
          ringFade = 1 - bt;
        }
      }

      ctx.fillStyle = color;
      for (const cell of cells) {
        // Load-in: each symbol fades in independently, starting at its own
        // random moment (from the per-cell hash) so the cloud accretes
        // symbol-by-symbol rather than appearing all at once.
        let reveal = 1;
        if (introP < 1) {
          const start = cell.hash * (1 - INTRO_FADE);
          reveal = smoothstep(
            Math.min(1, Math.max(0, (introP - start) / INTRO_FADE)),
          );
          if (reveal <= 0) continue;
        }

        // Two drifting sine waves give an organic, moving dither; the second
        // term (- now * 0.0009 on the column) slides the pattern sideways.
        const wobble =
          0.6 *
            Math.sin(
              now * 0.0015 + cell.c * 0.4 - now * 0.0009 + cell.hash * 6.283,
            ) +
          0.4 * Math.sin(now * 0.0008 - cell.r * 0.3 + cell.c * 0.12);

        // The signup ripple briefly densifies/brightens the dither.
        let boost = 0;
        if (ringR >= 0) {
          const dd = cell.dc - ringR;
          boost +=
            Math.exp(-(dd * dd) / (2 * RING_WIDTH * RING_WIDTH)) *
            ringFade *
            BURST_STRENGTH;
        }

        const fillLevel = (cell.density + boost) * (0.5 + 0.5 * wobble);
        // The edge line stays mostly steady (only a touch of shimmer) so it
        // reads as a continuous bright outline rather than scattered dither.
        const lineLevel = cell.line * (0.8 + 0.2 * wobble);
        const level = Math.max(fillLevel, lineLevel);
        if (level < LEVEL_CUTOFF) continue;
        const idx = Math.min(RAMP.length - 1, Math.floor(level * RAMP.length));
        ctx.globalAlpha =
          Math.min(1, Math.max(MAX_ALPHA * fillLevel, LINE_ALPHA * lineLevel)) *
          reveal;
        ctx.fillText(RAMP[idx], cell.x, cell.y);
      }
      ctx.globalAlpha = 1;
    };

    sync();

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      render(0);
    } else {
      introT0 = performance.now();
      timer = window.setInterval(() => render(performance.now()), FRAME_MS);
    }

    const ro = new ResizeObserver(() => {
      sync();
      render(performance.now());
    });
    ro.observe(canvas);

    const onBurst = () => {
      burstT0 = performance.now();
    };
    if (!reduce) {
      window.addEventListener("cloud-waitlist:success", onBurst);
    }

    return () => {
      if (timer) clearInterval(timer);
      ro.disconnect();
      window.removeEventListener("cloud-waitlist:success", onBurst);
    };
  }, [color]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
