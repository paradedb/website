"use client";

import { useState } from "react";
import { type BarMetric } from "@/components/vs/BenchmarkChart";
import {
  elasticsearchBenchmark,
  elasticsearchCdfByTerm,
  elasticsearchRidgeByTerm,
  type RidgeSeries,
} from "@/components/vs/elasticsearch-benchmark";

const pixelShadow = (color: string) => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5'%3E%3Crect width='2' height='2' fill='%23${color}' fill-opacity='0.5'/%3E%3C/svg%3E")`,
  backgroundSize: "5px 5px",
  backgroundPosition: "calc(100% + 3px) calc(100% + 3px)",
});
const indigoShadowStyle = pixelShadow("4f46e5");

const throughputMetric = elasticsearchBenchmark.metrics.find(
  (m): m is BarMetric => m.key === "throughput",
);
// Just 1/2/3 terms — drop the "Multi-term" row.
const THROUGHPUT_ROWS = (throughputMetric?.rows ?? []).slice(0, 3);

// Chart geometry (responsive via viewBox).
const CW = 660;
const CH = 300;
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

function QueryChip({ value, quoted }: { value: string; quoted: boolean }) {
  const q = quoted ? "'" : "";
  return (
    <div className="mb-4 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5">
      <span className="text-indigo-500 dark:text-indigo-400 mr-1.5">›</span>
      WHERE text ||| {q}
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

/** Segmented sub-toggle (term shapes) styled like the site's small tab boxes. */
function TermTabs({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  return (
    <div className="inline-flex self-start border border-slate-200 dark:border-slate-700">
      {elasticsearchCdfByTerm.map((t, i) => {
        const on = i === active;
        return (
          <button
            key={t.term}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={on}
            className={`px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
              i > 0 ? "border-l border-slate-200 dark:border-slate-700" : ""
            } ${
              on
                ? "bg-indigo-500 text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {t.term}
          </button>
        );
      })}
    </div>
  );
}

// ── latency: log-density ridgeline, value on each percentile marker ────────
function LatencyBody() {
  const [active, setActive] = useState(0);
  const term = elasticsearchRidgeByTerm[active];
  const N = term.us.density.length;
  const slotH = CPH / 2;
  const ridgeH = slotH * 0.82;
  const binX = (j: number) => CM.left + ((j + 0.5) / N) * CPW;
  const xOf = (v: number) =>
    CM.left + ((Math.log10(v) - term.lxmin) / (term.lxmax - term.lxmin)) * CPW;

  const ridge = (s: RidgeSeries, i: number) => {
    const baseY = CM.top + (i + 1) * slotH;
    const yOf = (d: number) => baseY - d * ridgeH;
    let area = `M${binX(0).toFixed(1)},${baseY.toFixed(1)}`;
    let line = "";
    for (let j = 0; j < N; j++) {
      const x = binX(j).toFixed(1);
      const y = yOf(s.density[j]).toFixed(1);
      area += ` L${x},${y}`;
      line += `${j === 0 ? "M" : "L"}${x},${y}`;
    }
    area += ` L${binX(N - 1).toFixed(1)},${baseY.toFixed(1)} Z`;
    return { baseY, top: baseY - ridgeH, area, line };
  };

  const series = [
    {
      s: term.us,
      fill: "fill-indigo-500",
      line: "stroke-indigo-500",
      text: "fill-indigo-600 dark:fill-indigo-400",
    },
    {
      s: term.them,
      fill: "fill-slate-400 dark:fill-slate-500",
      line: "stroke-slate-400 dark:stroke-slate-500",
      text: "fill-slate-500 dark:fill-slate-400",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <TermTabs active={active} setActive={setActive} />
        <Legend />
      </div>

      <QueryChip value={term.example} quoted />
      <Caption text="Latency distribution · log ms · solid p50 · dashed p90 · dotted p99" />

      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Latency distribution for ${term.term} queries: ParadeDB versus Elasticsearch`}
      >
        {term.ticks.map((tk) => (
          <line
            key={`g${tk}`}
            x1={xOf(tk)}
            x2={xOf(tk)}
            y1={CM.top}
            y2={CM.top + CPH}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth={1}
          />
        ))}

        {series.map((sr, i) => {
          const r = ridge(sr.s, i);
          const marks: [number, string | undefined][] = [
            [sr.s.p50, undefined],
            [sr.s.p90, "3,2"],
            [sr.s.p99, "1.5,2.5"],
          ];
          return (
            <g key={i}>
              <line
                x1={CM.left}
                x2={CM.left + CPW}
                y1={r.baseY}
                y2={r.baseY}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth={1}
              />
              <path d={r.area} className={sr.fill} fillOpacity={0.16} />
              <path
                d={r.line}
                fill="none"
                className={sr.line}
                strokeWidth={1.75}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {marks.map(([v, dash], k) => (
                <line
                  key={k}
                  x1={xOf(v)}
                  x2={xOf(v)}
                  y1={r.top}
                  y2={r.baseY}
                  className={sr.line}
                  strokeWidth={1.5}
                  strokeDasharray={dash}
                />
              ))}
              {/* value label on each marker */}
              {marks.map(([v], k) => (
                <text
                  key={`v${k}`}
                  x={xOf(v)}
                  y={r.top - 4}
                  textAnchor="middle"
                  className={`font-mono text-[9px] tabular-nums ${sr.text}`}
                >
                  {v.toFixed(1)}
                </text>
              ))}
            </g>
          );
        })}

        {term.ticks.map((tk) => (
          <text
            key={`t${tk}`}
            x={xOf(tk)}
            y={CM.top + CPH + 16}
            textAnchor="middle"
            className="font-mono text-[10px] tabular-nums fill-slate-400 dark:fill-slate-500"
          >
            {tk}
          </text>
        ))}

        {/* axis titles */}
        <text
          x={CM.left + CPW / 2}
          y={CH - 2}
          textAnchor="middle"
          className="font-mono text-[9px] uppercase tracking-[0.1em] fill-slate-400 dark:fill-slate-500"
        >
          latency (ms) · log scale
        </text>
        <text
          transform={`translate(10 ${CM.top + CPH / 2}) rotate(-90)`}
          textAnchor="middle"
          className="font-mono text-[9px] uppercase tracking-[0.1em] fill-slate-400 dark:fill-slate-500"
        >
          share of queries
        </text>
      </svg>
    </>
  );
}

// ── throughput: grouped bars across terms ─────────────────────────────────
function ThroughputBody() {
  const rows = THROUGHPUT_ROWS.map((r, i) => ({
    label: elasticsearchCdfByTerm[i]?.term ?? r.label,
    us: r.us,
    them: r.them,
  }));
  const max = Math.max(...rows.flatMap((r) => [r.us, r.them]));

  const bar = (value: number, solid: string, valueClass: string) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0 h-7 bg-slate-100 dark:bg-slate-800/50 relative">
        <div
          className={`absolute inset-y-0 left-0 ${solid}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span
        className={`w-14 shrink-0 text-right font-mono text-sm tabular-nums ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <>
      <div className="flex justify-end mb-4">
        <Legend />
      </div>

      <QueryChip value="$1" quoted={false} />
      <Caption text="Throughput · QPS · higher is better" />

      <div className="space-y-6">
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
    </>
  );
}

// ── reproduce: the commands to run it yourself ────────────────────────────
const REPRODUCE_LINES = [
  "git clone https://github.com/paradedb/benchmarker.git",
  "cd benchmarker && make",
  "",
  "# Pull the Hacker News dataset",
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
  { key: "latency", label: "Latency" },
  { key: "throughput", label: "Throughput" },
  { key: "reproduce", label: "Reproduce" },
] as const;

export default function BenchmarkPanel() {
  const [metric, setMetric] =
    useState<(typeof METRICS)[number]["key"]>("latency");

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
              className={`-mb-0.5 flex-1 sm:flex-none text-center border-2 px-2 sm:px-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.18em] whitespace-nowrap transition-colors ${
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
      <div className="relative">
        <div
          className="absolute top-2.5 left-2.5 -right-2.5 -bottom-2.5"
          aria-hidden="true"
          style={indigoShadowStyle}
        />
        <div className="relative bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-500 p-4 sm:p-6">
          {/* Both bodies share one grid cell, so the box always reserves the
              tallest and never changes height on toggle. min-w-0 keeps long
              lines (query chip, code) from stretching the box on mobile. */}
          <div className="grid min-w-0">
            <div
              className={`col-start-1 row-start-1 min-w-0 ${
                metric === "latency" ? "" : "invisible pointer-events-none"
              }`}
              aria-hidden={metric !== "latency"}
            >
              <LatencyBody />
            </div>
            <div
              className={`col-start-1 row-start-1 min-w-0 ${
                metric === "throughput" ? "" : "invisible pointer-events-none"
              }`}
              aria-hidden={metric !== "throughput"}
            >
              <ThroughputBody />
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

          {/* Footnote + source */}
          <p className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {elasticsearchBenchmark.footnote}
            {elasticsearchBenchmark.source && (
              <>
                {" "}
                <a
                  href={elasticsearchBenchmark.source.href}
                  className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500"
                >
                  {elasticsearchBenchmark.source.label}
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
