"use client";

import { useState } from "react";
import {
  BENCHMARK_COLUMNS,
  type BenchmarkColumnKey,
  elasticsearchCdfByColumn,
  elasticsearchThroughputByColumn,
  type TermCdf,
} from "@/components/vs/elasticsearch-benchmark";

const pixelShadow = (color: string) => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5'%3E%3Crect width='2' height='2' fill='%23${color}' fill-opacity='0.5'/%3E%3C/svg%3E")`,
  backgroundSize: "5px 5px",
  backgroundPosition: "calc(100% + 3px) calc(100% + 3px)",
});
const indigoShadowStyle = pixelShadow("4f46e5");

const fieldOf = (column: BenchmarkColumnKey) =>
  BENCHMARK_COLUMNS.find((c) => c.key === column)!.field;

/** Build ~4 evenly spaced "nice" axis ticks from 0 up past maxVal. */
function axisTicks(maxVal: number) {
  const rawStep = maxVal / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const niceMax = Math.ceil(maxVal / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= niceMax + step / 1000; v += step) {
    ticks.push(Math.round(v * 1000) / 1000);
  }
  return { ticks, niceMax };
}

// Chart geometry (responsive via viewBox).
const CW = 660;
const CH = 250;
const CM = { top: 12, right: 14, bottom: 28, left: 40 };
const CPW = CW - CM.left - CM.right;
const CPH = CH - CM.top - CM.bottom;

// ── shared pieces ─────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
      <span className="flex items-center gap-2">
        <span
          className="inline-block size-2.5 rounded-full bg-indigo-500"
          aria-hidden
        />
        ParadeDB
      </span>
      <span className="flex items-center gap-2">
        <span
          className="inline-block size-2.5 rounded-full bg-slate-400 dark:bg-slate-500"
          aria-hidden
        />
        Elasticsearch
      </span>
    </div>
  );
}

function QueryChip({
  field,
  value,
  quoted,
}: {
  field: string;
  value: string;
  quoted: boolean;
}) {
  const q = quoted ? "'" : "";
  return (
    <div className="mb-4 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5">
      <span className="text-indigo-500 dark:text-indigo-400 mr-1.5">›</span>
      WHERE {field} ||| {q}
      <span className="text-indigo-600 dark:text-indigo-400">{value}</span>
      {q} ORDER BY pdb.score(id) DESC LIMIT 10
    </div>
  );
}

function Caption({ text }: { text: string }) {
  return (
    <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
      {text}
    </div>
  );
}

/** Small segmented control styled like the site's tab boxes. */
function Segmented<T extends string>({
  options,
  active,
  setActive,
  ariaLabel,
}: {
  options: { key: T; label: string }[];
  active: T;
  setActive: (k: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-grid auto-cols-fr grid-flow-col self-start border border-slate-200 dark:border-slate-700"
    >
      {options.map((o, i) => {
        const on = o.key === active;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setActive(o.key)}
            aria-pressed={on}
            className={`px-3.5 py-1.5 text-center font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
              i > 0 ? "border-l border-slate-200 dark:border-slate-700" : ""
            } ${
              on
                ? "bg-indigo-500 text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Term-shape sub-toggle (1 / 2 / 3 terms). */
function TermTabs({
  terms,
  active,
  setActive,
}: {
  terms: TermCdf[];
  active: number;
  setActive: (i: number) => void;
}) {
  return (
    <Segmented
      ariaLabel="Number of terms"
      active={String(active)}
      setActive={(k) => setActive(Number(k))}
      options={terms.map((t, i) => ({ key: String(i), label: t.term }))}
    />
  );
}

// ── latency: p50 / p90 / p95 bars, with a throughput (QPS) summary below ──
function LatencyBarsBody({ column }: { column: BenchmarkColumnKey }) {
  const [active, setActive] = useState(0);
  const terms = elasticsearchCdfByColumn[column];
  const term = terms[active];
  const tp = elasticsearchThroughputByColumn[column][active];
  // p50/p90/p95 are exact sampled levels in the CDF points.
  const at = (pts: number[][], pct: number) =>
    pts.find((p) => p[1] === pct)?.[0] ?? 0;
  const rows = [
    { label: "p50", us: at(term.us, 50), them: at(term.them, 50) },
    { label: "p90", us: at(term.us, 90), them: at(term.them, 90) },
    { label: "p95", us: at(term.us, 95), them: at(term.them, 95) },
  ];
  const max = Math.max(...rows.flatMap((r) => [r.us, r.them]));

  const bar = (value: number, solid: string, valueClass: string) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0 h-6 bg-slate-100 dark:bg-slate-800/50 relative">
        <div
          className={`absolute inset-y-0 left-0 ${solid}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span
        className={`w-20 shrink-0 whitespace-nowrap text-right font-mono text-sm tabular-nums ${valueClass}`}
      >
        {value.toFixed(2)}
        <span className="text-slate-400 dark:text-slate-500"> ms</span>
      </span>
    </div>
  );

  return (
    <>
      <div className="mb-4">
        <TermTabs terms={terms} active={active} setActive={setActive} />
      </div>

      <QueryChip field={fieldOf(column)} value={term.example} quoted />
      <Caption text="Latency · ms · lower is better" />

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {row.label}
            </div>
            <div className="space-y-1.5">
              {bar(row.us, "bg-indigo-500", "text-slate-900 dark:text-white")}
              {bar(
                row.them,
                "bg-slate-400 dark:bg-slate-500",
                "text-slate-600 dark:text-slate-300",
              )}
            </div>
          </div>
        ))}
      </div>

      {tp && (
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Throughput · QPS · higher is better
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
                {tp.us}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ParadeDB
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                {tp.them}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Elasticsearch
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── latency: empirical CDF — % of queries completed by each latency ────────
function LatencyCdfBody({ column }: { column: BenchmarkColumnKey }) {
  const [active, setActive] = useState(0);
  const terms = elasticsearchCdfByColumn[column];
  const term = terms[active];
  const { ticks } = axisTicks(term.axisMax);
  const xMax = ticks[ticks.length - 1];
  const xOf = (lat: number) => CM.left + (Math.min(lat, xMax) / xMax) * CPW;
  const yOf = (pct: number) => CM.top + CPH - (pct / 100) * CPH;
  const path = (pts: number[][]) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${xOf(p[0]).toFixed(1)},${yOf(p[1]).toFixed(1)}`,
      )
      .join(" ");
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <>
      <div className="mb-4">
        <TermTabs terms={terms} active={active} setActive={setActive} />
      </div>

      <QueryChip field={fieldOf(column)} value={term.example} quoted />
      <Caption text="Latency CDF · % of queries ≤ latency (ms) · left is faster" />

      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Latency CDF for ${term.term} queries: ParadeDB versus Elasticsearch`}
      >
        {/* y gridlines + % labels */}
        {yTicks.map((p) => (
          <g key={`y${p}`}>
            <line
              x1={CM.left}
              x2={CW - CM.right}
              y1={yOf(p)}
              y2={yOf(p)}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth={1}
            />
            <text
              x={CM.left - 8}
              y={yOf(p)}
              textAnchor="end"
              dominantBaseline="middle"
              className="font-mono text-[10px] tabular-nums fill-slate-400 dark:fill-slate-500"
            >
              {p}%
            </text>
          </g>
        ))}

        {/* x gridlines + ms labels */}
        {ticks.map((tk) => (
          <g key={`x${tk}`}>
            <line
              x1={xOf(tk)}
              x2={xOf(tk)}
              y1={CM.top}
              y2={CM.top + CPH}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth={1}
            />
            <text
              x={xOf(tk)}
              y={CH - CM.bottom + 16}
              textAnchor="middle"
              className="font-mono text-[10px] tabular-nums fill-slate-400 dark:fill-slate-500"
            >
              {tk}
            </text>
          </g>
        ))}

        {/* Elasticsearch (behind) */}
        <path
          d={path(term.them)}
          fill="none"
          className="stroke-slate-400 dark:stroke-slate-500"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* ParadeDB (on top) */}
        <path
          d={path(term.us)}
          fill="none"
          className="stroke-indigo-500"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* axis titles */}
        <text
          x={CM.left + CPW / 2}
          y={CH - 2}
          textAnchor="middle"
          className="font-mono text-[9px] uppercase tracking-[0.1em] fill-slate-400 dark:fill-slate-500"
        >
          latency (ms)
        </text>
        <text
          transform={`translate(10 ${CM.top + CPH / 2}) rotate(-90)`}
          textAnchor="middle"
          className="font-mono text-[9px] uppercase tracking-[0.1em] fill-slate-400 dark:fill-slate-500"
        >
          % of queries ≤
        </text>
      </svg>
    </>
  );
}

// ── reproduce: the commands to run it yourself ────────────────────────────
const REPRODUCE_LINES = [
  "git clone https://github.com/paradedb/benchmarker.git",
  "cd benchmarker && make",
  "",
  "# Pull the Hacker News dataset (28M rows)",
  "./bin/loader pull --dataset hn --anonymous \\",
  "    --source s3://paradedb-benchmarker/datasets/hn",
  "",
  "# Start ParadeDB + Elasticsearch, load, restart for symmetric caches",
  "docker compose -f ./datasets/hn/docker-compose.yml --profile all up -d --wait",
  "./bin/loader load --backend paradedb      ./datasets/hn",
  "./bin/loader load --backend elasticsearch ./datasets/hn",
  "",
  "# Run the term-size benchmark",
  "./k6 run --out dashboard=json,html ./datasets/hn/k6/term_sizes.js",
];

function ReproduceBody() {
  return (
    <>
      <Caption text="Reproduce · on your own hardware" />
      <div className="overflow-x-auto bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 font-mono text-[11px] leading-[1.9]">
        {REPRODUCE_LINES.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre ${
              line.startsWith("#")
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {line || " "}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Dataset, loader, and k6 script live in the{" "}
        <a
          href="https://github.com/paradedb/benchmarker"
          className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500"
        >
          Benchmarker repo
        </a>
        .
      </p>
    </>
  );
}

// ── panel: three boxes, tab toggle drawn into the frame ────────────────────
const METRICS = [
  { key: "bars", label: "Latency" },
  { key: "cdf", label: "Distribution" },
  { key: "reproduce", label: "Reproduce" },
] as const;

export default function BenchmarkPanel() {
  const [metric, setMetric] =
    useState<(typeof METRICS)[number]["key"]>("bars");
  const [column, setColumn] = useState<BenchmarkColumnKey>("text");
  const columnNote = BENCHMARK_COLUMNS.find((c) => c.key === column)!.note;

  return (
    <div className="relative">
      {/* Tabs — the boxes' lids, sitting on the top edge of the frame */}
      <div className="relative z-10 flex items-end gap-1 sm:gap-1.5 pl-0 sm:pl-3">
        {METRICS.map((m) => {
          const on = m.key === metric;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m.key)}
              aria-pressed={on}
              className={`touch-manipulation -mb-0.5 flex-1 sm:flex-none text-center border-2 px-2 sm:px-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.18em] whitespace-nowrap transition-colors ${
                on
                  ? "relative z-10 py-2 border-indigo-500 bg-indigo-500 text-white"
                  : "py-1.5 border-indigo-400 dark:border-indigo-500 bg-slate-50 dark:bg-slate-800/40 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Content box — the active box's body */}
      <div className="relative z-0">
        <div
          className="absolute top-2.5 left-2.5 -right-2.5 -bottom-2.5 pointer-events-none"
          aria-hidden="true"
          style={indigoShadowStyle}
        />
        <div className="relative bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-500 p-4 sm:p-6">
          {/* Column toggle + legend — applies to every data tab */}
          {metric !== "reproduce" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Segmented
                  ariaLabel="Indexed column"
                  options={BENCHMARK_COLUMNS.map((c) => ({
                    key: c.key,
                    label: c.label,
                  }))}
                  active={column}
                  setActive={setColumn}
                />
                <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">
                  {columnNote}
                </span>
              </div>
              <Legend />
            </div>
          )}

          {/* Every body shares one grid cell, so the box always reserves the
              tallest and never changes height on toggle. min-w-0 keeps long
              lines (query chip, code) from stretching the box on mobile. */}
          <div className="grid min-w-0">
            <div
              className={`col-start-1 row-start-1 min-w-0 ${
                metric === "bars" ? "" : "invisible pointer-events-none"
              }`}
              aria-hidden={metric !== "bars"}
            >
              <LatencyBarsBody column={column} />
            </div>
            <div
              className={`col-start-1 row-start-1 min-w-0 ${
                metric === "cdf" ? "" : "invisible pointer-events-none"
              }`}
              aria-hidden={metric !== "cdf"}
            >
              <LatencyCdfBody column={column} />
            </div>
            <div
              className={`col-start-1 row-start-1 min-w-0 ${
                metric === "reproduce" ? "" : "invisible pointer-events-none"
              }`}
              aria-hidden={metric !== "reproduce"}
            >
              <ReproduceBody />
            </div>
          </div>

          {/* Measurement + dataset facts + raw data */}
          <p className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Measured on ParadeDB 0.24.1 and Elasticsearch 8.17, each in an
            identical 4-CPU, 16 GB Docker container queried by a single client,
            second run after JVM warmup over a rotating pool of 50 queries.
            Hacker News dataset, 28M rows.{" "}
            <a
              href={`/benchmarks/topk_10_hn_${column}.json`}
              download
              className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500"
            >
              Download raw result JSON
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
