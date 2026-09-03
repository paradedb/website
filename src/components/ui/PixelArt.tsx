import { cx } from "@/lib/utils";

const COLS = 32;
const ROWS = 24;
const CELL = 14;
const DOT = 10;
const INSET = (CELL - DOT) / 2;
const W = COLS * CELL;
const H = ROWS * CELL;

const CHART_COLS = 24;
const CHART_ROWS = 8;

function hash(x: number, y: number, seed: number) {
  let h =
    (Math.imul(x, 374761393) +
      Math.imul(y, 668265263) +
      Math.imul(seed, 1274126177)) |
    0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

type Square = { x: number; y: number; opacity: number };

function centered(squares: Square[], cols: number, rows: number) {
  const ox = (COLS - cols) / 2;
  const oy = (ROWS - rows) / 2;
  return squares.map((s) => ({ ...s, x: s.x + ox, y: s.y + oy }));
}

function steps() {
  const squares: Square[] = [];
  let level = CHART_ROWS - 1;
  for (let x = 0; x < CHART_COLS; x++) {
    const t = x / (CHART_COLS - 1);
    const target = CHART_ROWS - 1 - Math.round((CHART_ROWS - 1) * t ** 1.3);
    if (target < level && (x === CHART_COLS - 1 || hash(x, 1, 9) > 0.35)) {
      level = target;
    }
    squares.push({ x, y: level, opacity: x === CHART_COLS - 1 ? 0.95 : 0.85 });
    if (level + 1 < CHART_ROWS) squares.push({ x, y: level + 1, opacity: 0.3 });
    if (level + 2 < CHART_ROWS)
      squares.push({ x, y: level + 2, opacity: 0.14 });
  }
  return centered(squares, CHART_COLS, CHART_ROWS);
}

function identicons() {
  const squares: Square[] = [];
  const size = 6;
  const gap = 2;
  const count = 3;
  for (let i = 0; i < count; i++) {
    const x0 = i * (size + gap);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const mirrored = c < size / 2 ? c : size - 1 - c;
        const filled = hash(mirrored, r, 30 + i) > 0.5;
        squares.push({ x: x0 + c, y: r, opacity: filled ? 0.92 : 0.14 });
      }
    }
  }
  return centered(squares, count * size + (count - 1) * gap, size);
}

const GRID_OPACITY = [0.14, 0.32, 0.55, 0.85];

function grid() {
  const squares: Square[] = [];
  for (let y = 0; y < CHART_ROWS; y++) {
    for (let x = 0; x < CHART_COLS; x++) {
      const v = 0.55 * hash(x, y, 3) + 0.55 * (x / CHART_COLS);
      const level = Math.min(3, Math.floor(v * 3.4));
      squares.push({ x, y, opacity: GRID_OPACITY[level] });
    }
  }
  return centered(squares, CHART_COLS, CHART_ROWS);
}

const CHARTS = { steps: steps(), identicons: identicons(), grid: grid() };

const GRAIN_STEP = CELL / 2;
const GRAIN_DOT = 2;
const GRAIN_COLS = W / GRAIN_STEP;
const GRAIN_ROWS = H / GRAIN_STEP;
const GRAIN_MARGIN = 2;

function grain(squares: Square[]) {
  const xs = squares.map((s) => s.x);
  const ys = squares.map((s) => s.y);
  const box = {
    x0: Math.min(...xs) * 2 - GRAIN_MARGIN,
    x1: (Math.max(...xs) + 1) * 2 + GRAIN_MARGIN,
    y0: Math.min(...ys) * 2 - GRAIN_MARGIN,
    y1: (Math.max(...ys) + 1) * 2 + GRAIN_MARGIN,
  };
  const reach = Math.hypot(box.x0, box.y0);
  const d: string[] = [];
  for (let y = 0; y < GRAIN_ROWS; y++) {
    for (let x = 0; x < GRAIN_COLS; x++) {
      const dx = Math.max(0, box.x0 - x, x - box.x1);
      const dy = Math.max(0, box.y0 - y, y - box.y1);
      const t = Math.min(1, Math.hypot(dx, dy) / reach);
      if (t > 0 && hash(x, y, 41) < 0.55 * t ** 1.4) {
        const px = x * GRAIN_STEP + (GRAIN_STEP - GRAIN_DOT) / 2;
        const py = y * GRAIN_STEP + (GRAIN_STEP - GRAIN_DOT) / 2;
        d.push(`M${px} ${py}h${GRAIN_DOT}v${GRAIN_DOT}h-${GRAIN_DOT}z`);
      }
    }
  }
  return d.join("");
}

const GRAINS = Object.fromEntries(
  Object.entries(CHARTS).map(([k, v]) => [k, grain(v)]),
) as Record<keyof typeof CHARTS, string>;

export function PixelChart({
  kind,
  className,
}: {
  kind: keyof typeof CHARTS;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cx("absolute inset-0 size-full", className)}
    >
      <path d={GRAINS[kind]} fill="#ffffff" fillOpacity={0.16} />
      {CHARTS[kind].map((s) => (
        <rect
          key={`${s.x}-${s.y}`}
          x={s.x * CELL + INSET}
          y={s.y * CELL + INSET}
          width={DOT}
          height={DOT}
          fill="#ffffff"
          fillOpacity={s.opacity}
        />
      ))}
    </svg>
  );
}
