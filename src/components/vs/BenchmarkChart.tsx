"use client";

import { useState } from "react";
import { Badge } from "../ui/Badge";

const pixelShadow = (color: string) => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5'%3E%3Crect width='2' height='2' fill='%23${color}' fill-opacity='0.5'/%3E%3C/svg%3E")`,
  backgroundSize: "5px 5px",
  backgroundPosition: "calc(100% + 3px) calc(100% + 3px)",
});

const indigoShadowStyle = pixelShadow("4f46e5");

/** Five-number summary for a box-and-whisker series */
export type BoxStats = {
  /** Low whisker (e.g. p5) */
  low: number;
  /** Box start (e.g. p25) */
  q1: number;
  /** Median line (e.g. p50) */
  med: number;
  /** Box end (e.g. p75) */
  q3: number;
  /** High whisker (e.g. p95) */
  high: number;
};

type BaseMetric = {
  /** Stable key, used for the active-tab state */
  key: string;
  /** Tab label, e.g. "Throughput" */
  label: string;
  /** Unit shown in the caption, e.g. "QPS" or "ms" */
  unit: string;
  /** Direction hint, e.g. "higher is better" */
  hint: string;
  /** Decimal places for the value labels (default 0) */
  decimals?: number;
  /** Set when a lower number is the better result (e.g. latency) */
  lowerIsBetter?: boolean;
};

/** Single-value grouped bars (e.g. throughput) */
export type BarMetric = BaseMetric & {
  kind?: "bar";
  /** One row per scenario. us = ParadeDB, them = competitor. */
  rows: { label: string; us: number; them: number }[];
};

/** Box-and-whisker per series (e.g. latency distribution) */
export type BoxMetric = BaseMetric & {
  kind: "box";
  /** Names the parts, e.g. { box: "p25–p75", line: "p50", whisker: "p5–p95" } */
  summary?: { box: string; line: string; whisker: string };
  rows: { label: string; us: BoxStats; them: BoxStats }[];
};

export type BenchmarkMetric = BarMetric | BoxMetric;

export type BenchmarkData = {
  /** Section subhead */
  subhead: string;
  /** One entry per toggleable metric (throughput, latency, …) */
  metrics: BenchmarkMetric[];
  /** Optional link to the full benchmark writeup */
  source?: { href: string; label: string };
  /** Small print under the bars */
  footnote?: string;
};

type Fmt = (n: number) => string;

function RowHeader({ label, ahead }: { label: string; ahead: boolean }) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {ahead && (
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">
          ParadeDB ahead
        </span>
      )}
    </div>
  );
}

function BarRows({ metric, fmt }: { metric: BarMetric; fmt: Fmt }) {
  const max = Math.max(...metric.rows.flatMap((r) => [r.us, r.them]));
  const usWins = (r: { us: number; them: number }) =>
    metric.lowerIsBetter ? r.us < r.them : r.us > r.them;

  const bar = (value: number, solid: string, valueClass: string) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800/50 relative">
        <div
          className={`absolute inset-y-0 left-0 ${solid}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span
        className={`w-14 shrink-0 text-right font-mono text-sm tabular-nums ${valueClass}`}
      >
        {fmt(value)}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      {metric.rows.map((row) => (
        <div key={row.label}>
          <RowHeader label={row.label} ahead={usWins(row)} />
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
  );
}

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

function BoxRows({ metric }: { metric: BoxMetric }) {
  const dataMax = Math.max(...metric.rows.flatMap((r) => [r.us.high, r.them.high]));
  const { ticks, niceMax } = axisTicks(dataMax);
  const usWins = (r: { us: BoxStats; them: BoxStats }) =>
    metric.lowerIsBetter ? r.us.med < r.them.med : r.us.med > r.them.med;
  const pc = (v: number) => (v / niceMax) * 100;

  const plot = (s: BoxStats, solid: string, border: string, soft: string) => (
    <div className="h-8 relative">
      {/* whisker line */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 h-px ${solid}`}
        style={{ left: `${pc(s.low)}%`, width: `${pc(s.high) - pc(s.low)}%` }}
      />
      {/* whisker caps */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 h-2.5 w-px ${solid}`}
        style={{ left: `${pc(s.low)}%` }}
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 h-2.5 w-px ${solid}`}
        style={{ left: `${pc(s.high)}%` }}
      />
      {/* interquartile box */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 h-5 border ${border} ${soft}`}
        style={{ left: `${pc(s.q1)}%`, width: `${pc(s.q3) - pc(s.q1)}%` }}
      />
      {/* median */}
      <div
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-0.5 ${solid}`}
        style={{ left: `${pc(s.med)}%` }}
      />
    </div>
  );

  return (
    <div>
      <div className="relative">
        {/* gridlines */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800/70"
              style={{ left: `${pc(t)}%` }}
            />
          ))}
        </div>
        <div className="relative space-y-6">
          {metric.rows.map((row) => (
            <div key={row.label}>
              <RowHeader label={row.label} ahead={usWins(row)} />
              <div className="space-y-1">
                {plot(
                  row.us,
                  "bg-indigo-500",
                  "border-indigo-400 dark:border-indigo-500",
                  "bg-indigo-500/15 dark:bg-indigo-500/20",
                )}
                {plot(
                  row.them,
                  "bg-slate-400 dark:bg-slate-500",
                  "border-slate-300 dark:border-slate-600",
                  "bg-slate-400/15 dark:bg-slate-500/15",
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* axis */}
      <div className="relative mt-3 h-4" aria-hidden="true">
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute top-0 font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500"
            style={{ left: `${pc(t)}%`, transform: "translateX(-50%)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BenchmarkChart({
  competitorName,
  benchmark,
}: {
  competitorName: string;
  benchmark: BenchmarkData;
}) {
  const [activeKey, setActiveKey] = useState(benchmark.metrics[0].key);
  const metric =
    benchmark.metrics.find((m) => m.key === activeKey) ?? benchmark.metrics[0];
  const fmt: Fmt = (n) => n.toFixed(metric.decimals ?? 0);

  return (
    <section>
      <div className="mb-8">
        <Badge className="mb-4">Benchmark</Badge>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-indigo-950 dark:text-white mb-3">
          TopK search, head to head.
        </h2>
        <p className="text-base text-gray-800 dark:text-slate-300 max-w-2xl leading-relaxed">
          {benchmark.subhead}
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute top-2.5 left-2.5 -right-2.5 -bottom-2.5"
          aria-hidden="true"
          style={indigoShadowStyle}
        />
        <div className="relative bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-500 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7">
            {benchmark.metrics.length > 1 && (
              <div className="inline-flex self-start border border-slate-200 dark:border-slate-700">
                {benchmark.metrics.map((m, i) => {
                  const active = m.key === metric.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setActiveKey(m.key)}
                      aria-pressed={active}
                      className={`px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                        i > 0
                          ? "border-l border-slate-200 dark:border-slate-700"
                          : ""
                      } ${
                        active
                          ? "bg-indigo-500 text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-3 bg-indigo-500"
                  aria-hidden="true"
                />
                ParadeDB
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-3 bg-slate-400 dark:bg-slate-500"
                  aria-hidden="true"
                />
                {competitorName}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {metric.label} · {metric.unit} · {metric.hint}
            </div>
            {metric.kind === "box" && metric.summary && (
              <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                box {metric.summary.box} · line {metric.summary.line} · whiskers{" "}
                {metric.summary.whisker}
              </div>
            )}
          </div>

          {metric.kind === "box" ? (
            <BoxRows metric={metric} />
          ) : (
            <BarRows metric={metric} fmt={fmt} />
          )}

          {(benchmark.footnote || benchmark.source) && (
            <p className="mt-10 pt-5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {benchmark.footnote}
              {benchmark.source && (
                <>
                  {benchmark.footnote ? " " : ""}
                  <a
                    href={benchmark.source.href}
                    className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500"
                  >
                    {benchmark.source.label}
                  </a>
                  .
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
