"use client";

import { useState } from "react";
import { type BarMetric } from "@/components/vs/BenchmarkChart";
import {
  elasticsearchBenchmark,
  elasticsearchCdfByTerm,
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

// ── latency: dumbbell — ParadeDB vs Elasticsearch per percentile ───────────
// Two dots joined by the gap; each value sits just outside its own dot (left
// value left of the left dot, right value right of the right dot).
function LatencyBody() {
  const [active, setActive] = useState(0);
  const term = elasticsearchCdfByTerm[active];
  const at = (pts: number[][], pct: number) =>
    pts.find((p) => p[1] === pct)?.[0] ?? 0;
  const rows = [
    { label: "p50", us: at(term.us, 50), them: at(term.them, 50) },
    { label: "p90", us: at(term.us, 90), them: at(term.them, 90) },
    { label: "p95", us: at(term.us, 95), them: at(term.them, 95) },
  ];
  const dataMax = Math.max(...rows.flatMap((r) => [r.us, r.them]));
  // Leave headroom on the right so the right-hand value never runs off the end.
  const pc = (v: number) => (v / dataMax) * 70;
  const indigo = "text-indigo-600 dark:text-indigo-400";
  const slate = "text-slate-500 dark:text-slate-400";

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <TermTabs active={active} setActive={setActive} />
        <Legend />
      </div>

      <QueryChip value={term.example} quoted />
      <Caption text="Latency · ms · lower is better" />

      <div className="space-y-6">
        {rows.map((row) => {
          const usX = pc(row.us);
          const themX = pc(row.them);
          const leftX = Math.min(usX, themX);
          const rightX = Math.max(usX, themX);
          const usLeft = row.us <= row.them;
          const leftVal = usLeft ? row.us : row.them;
          const rightVal = usLeft ? row.them : row.us;
          return (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-9 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {row.label}
              </div>
              <div className="relative h-6 flex-1">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-200 dark:bg-slate-800" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-slate-300 dark:bg-slate-600"
                  style={{ left: `${leftX}%`, width: `${rightX - leftX}%` }}
                />
                <span
                  className="absolute top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900"
                  style={{ left: `${usX}%` }}
                />
                <span
                  className="absolute top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-400 dark:bg-slate-500 ring-2 ring-white dark:ring-slate-900"
                  style={{ left: `${themX}%` }}
                />
                {/* value just left of the left dot */}
                <span
                  className={`absolute top-1/2 -ml-2 -translate-x-full -translate-y-1/2 font-mono text-[11px] tabular-nums ${usLeft ? indigo : slate}`}
                  style={{ left: `${leftX}%` }}
                >
                  {leftVal.toFixed(2)} ms
                </span>
                {/* value just right of the right dot */}
                <span
                  className={`absolute top-1/2 ml-2 -translate-y-1/2 font-mono text-[11px] tabular-nums ${usLeft ? slate : indigo}`}
                  style={{ left: `${rightX}%` }}
                >
                  {rightVal.toFixed(2)} ms
                </span>
              </div>
            </div>
          );
        })}
      </div>
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
