"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { RiGithubFill } from "@remixicon/react";
import {
  elasticsearchCdf,
  type TermCdf,
} from "@/components/vs/elasticsearch-benchmark";

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
const CH = 205;
const CM = { top: 12, right: 14, bottom: 28, left: 40 };
const CPW = CW - CM.left - CM.right;
const CPH = CH - CM.top - CM.bottom;

// SQL syntax-highlight token colors.
const SQL_KW = "text-indigo-600 dark:text-indigo-400";
const SQL_STR = "text-emerald-600 dark:text-emerald-400";
const SQL_FN = "text-sky-600 dark:text-sky-400";
const SQL_NUM = "text-amber-600 dark:text-amber-500";
const SQL_PUNC = "text-slate-400 dark:text-slate-500";
const SQL_COMMENT = "text-slate-400 dark:text-slate-500";

// ── shared pieces ─────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:gap-4 sm:text-[11px] sm:tracking-[0.18em] dark:text-slate-400">
      <span className="flex items-center gap-2">
        <span
          className="inline-block size-3 rounded-full bg-indigo-500"
          aria-hidden
        />
        ParadeDB
      </span>
      <span className="flex items-center gap-2">
        <span
          className="inline-block size-3 rounded-full bg-slate-300 dark:bg-slate-500"
          aria-hidden
        />
        Elasticsearch
      </span>
    </div>
  );
}

/** A SQL "editor": the query on top, its chart output below in the same box,
    so it reads like running the query yields the graph. Spans the full card. */
function QueryEditor({
  value,
  caption,
  legend = true,
  children,
}: {
  value: string;
  caption: string;
  legend?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col border border-slate-200 dark:border-slate-800">
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Query (left) — editor with line-number gutter + syntax colors */}
        <div className="flex shrink-0 overflow-x-auto border-b border-slate-200 bg-slate-50 py-3 font-mono text-[13px] leading-6 sm:w-96 sm:border-b-0 sm:border-r dark:border-slate-800 dark:bg-slate-900/60">
          <div className="shrink-0 select-none border-r border-slate-200 px-3 text-right text-slate-400 dark:border-slate-800 dark:text-slate-600">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </div>
          <div className="px-3 text-slate-700 dark:text-slate-300">
            <div className="whitespace-nowrap">
              <span className={SQL_COMMENT}>-- TopK ordered by BM25 score</span>
            </div>
            <div className="whitespace-nowrap">
              <span className={SQL_KW}>SELECT</span>{" "}
              <span className={SQL_PUNC}>*</span>{" "}
              <span className={SQL_KW}>FROM</span> hackernews
            </div>
            <div className="whitespace-nowrap">
              <span className={SQL_KW}>WHERE</span> text{" "}
              <span className={SQL_PUNC}>|||</span>{" "}
              <span className={SQL_STR}>&apos;{value}&apos;</span>
            </div>
            <div className="whitespace-nowrap">
              <span className={SQL_KW}>ORDER BY</span>{" "}
              <span className={SQL_FN}>pdb.score</span>
              <span className={SQL_PUNC}>(</span>id
              <span className={SQL_PUNC}>)</span>{" "}
              <span className={SQL_KW}>DESC</span>
            </div>
            <div className="whitespace-nowrap">
              <span className={SQL_KW}>LIMIT</span>{" "}
              <span className={SQL_NUM}>10</span>
            </div>
          </div>
        </div>
        {/* Output (right) */}
        <div className="min-w-0 flex-1 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:text-[11px] sm:tracking-[0.18em] dark:text-slate-400">
              {caption}
            </span>
            {legend && <Legend />}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** GitHub-mark link to the benchmark harness repo. */
function RepoLink() {
  return (
    <a
      href="https://github.com/paradedb/benchmarker"
      className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
    >
      <RiGithubFill size={16} className="shrink-0" aria-hidden />
      <span className="underline underline-offset-2">paradedb/benchmarker</span>
    </a>
  );
}

/** Measurement + dataset facts + raw-data link, shown under the data tabs. */
function MeasurementNote() {
  return (
    <div className="mt-auto pt-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
      <p>
        Measured on ParadeDB 0.24.1 and Elasticsearch 8.17, each in an identical
        4-CPU, 16 GB Docker container queried by a single client, second run
        after JVM warmup over a rotating pool of 40 queries. Hacker News
        dataset, 28M rows.{" "}
        <a
          href="/benchmarks/topk_10_hn_text.json"
          download
          className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500"
        >
          Download raw result JSON
        </a>
        .
      </p>
      <RepoLink />
    </div>
  );
}

/** Term-shape tabs (1 / 2 / 3 terms) that sit flush on top of the query box,
    like tabs coming out of it. The active tab drops its bottom border so it
    reads as connected to the box; inactive tabs share the box's fill. */
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
    <div
      role="group"
      aria-label="Number of terms"
      className="relative z-10 -mb-px flex w-full sm:w-fit"
    >
      {terms.map((t, i) => {
        const on = i === active;
        return (
          <button
            key={t.term}
            type="button"
            aria-pressed={on}
            onClick={() => setActive(i)}
            className={`flex-1 whitespace-nowrap border-t border-r px-2 py-1.5 text-center font-mono text-[11px] uppercase tracking-[0.15em] transition-colors sm:flex-none sm:px-3.5 ${
              i === 0 ? "border-l" : ""
            } ${
              on
                ? "border-indigo-500 bg-indigo-500 text-white"
                : "border-b border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {t.term}
          </button>
        );
      })}
    </div>
  );
}

// ── latency: p50 / p95 bars ────────────────────────────────────────────────
function LatencyBarsBody({ animate }: { animate: boolean }) {
  const [active, setActive] = useState(0);
  const terms = elasticsearchCdf;
  const term = terms[active];
  // p50/p95 are exact sampled levels in the CDF points.
  const at = (pts: number[][], pct: number) =>
    pts.find((p) => p[1] === pct)?.[0] ?? 0;
  const rows = [
    { label: "p50", us: at(term.us, 50), them: at(term.them, 50) },
    { label: "p95", us: at(term.us, 95), them: at(term.them, 95) },
  ];
  const max = Math.max(...rows.flatMap((r) => [r.us, r.them]));

  // Bars grow in when the panel scrolls into view and replay on every tab or
  // term change. Collapse instantly (no transition), then grow with one.
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    if (!animate) {
      setGrown(false);
      return;
    }
    setGrown(false);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setGrown(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [animate, active]);

  const bar = (value: number, solid: string, valueClass: string) => (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex-1 min-w-0 h-6 bg-slate-100 dark:bg-slate-800/50 relative">
        <div
          className={`absolute inset-y-0 left-0 origin-left ${solid} ${
            grown
              ? "scale-x-100 transition-transform duration-700 ease-out"
              : "scale-x-0"
          }`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span
        className={`w-16 shrink-0 whitespace-nowrap text-right font-mono text-[11px] tabular-nums sm:w-20 ${valueClass}`}
      >
        {value.toFixed(2)} ms
      </span>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <TermTabs terms={terms} active={active} setActive={setActive} />
      <QueryEditor value={term.example} caption="Latency · lower is better">
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {row.label}
              </div>
              <div className="space-y-1.5">
                {bar(
                  row.us,
                  "bg-indigo-500",
                  "text-indigo-600 dark:text-indigo-400",
                )}
                {bar(
                  row.them,
                  "bg-slate-300 dark:bg-slate-600",
                  "text-slate-400 dark:text-slate-500",
                )}
              </div>
            </div>
          ))}
        </div>
      </QueryEditor>
      <MeasurementNote />
    </div>
  );
}

// ── latency: empirical CDF — % of queries completed by each latency ────────
function LatencyCdfBody({ animate }: { animate: boolean }) {
  const [active, setActive] = useState(0);
  const terms = elasticsearchCdf;
  const term = terms[active];

  // Lines draw in when the panel scrolls into view; replay on tab/term change.
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    if (!animate) {
      setGrown(false);
      return;
    }
    setGrown(false);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setGrown(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [animate, active]);
  const drawStyle = (delayMs: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: grown ? 0 : 1,
    transition: grown
      ? `stroke-dashoffset 900ms ease-out ${delayMs}ms`
      : "none",
  });

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
    <div className="flex h-full flex-col">
      <TermTabs terms={terms} active={active} setActive={setActive} />
      <QueryEditor value={term.example} caption="% ≤ latency · left is faster">
        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          className="h-auto w-full"
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
            pathLength={1}
            className="stroke-slate-300 dark:stroke-slate-600"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={drawStyle(0)}
          />
          {/* ParadeDB (on top) */}
          <path
            d={path(term.us)}
            fill="none"
            pathLength={1}
            className="stroke-indigo-500"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={drawStyle(120)}
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
      </QueryEditor>
      <MeasurementNote />
    </div>
  );
}

// ── reproduce: the commands to run it yourself ────────────────────────────
const REPRODUCE_LINES = [
  "git clone https://github.com/paradedb/benchmarker.git",
  "cd benchmarker && make",
  "",
  "# Pull the Hacker News dataset (28M rows, 5GB, could take a while)",
  "./bin/loader pull --dataset hn --anonymous \\",
  "    --source s3://paradedb-benchmarker/datasets/hn-elasticsearch-bm25.tar.gz",
  "",
  "# Start ParadeDB + Elasticsearch, load, restart for symmetric caches",
  "docker compose -f ./datasets/hn/docker-compose.yml --profile all up -d --wait",
  "./bin/loader load --backend paradedb      ./datasets/hn",
  "./bin/loader load --backend elasticsearch ./datasets/hn",
  "",
  "# Run the benchmark, running twice will eliminate warmup",
  "./k6 run --out dashboard=json,html,live ./datasets/hn/k6/elasticsearch-topk.js",
];

function ReproduceBody() {
  return (
    <>
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
      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <p>Dataset, loader, and k6 script live in the Benchmarker repo.</p>
        <RepoLink />
      </div>
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
  const [metric, setMetric] = useState<(typeof METRICS)[number]["key"]>("bars");

  // Fire the bar animation once the card scrolls into view.
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Card — the active view's body. The card spans the full content column,
    // so at xl both side borders fall on the section's inner grid lines and are
    // dropped to avoid doubling them.
    <div
      ref={cardRef}
      className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 xl:border-x-0 p-4 sm:p-6"
    >
      {/* View tabs — underline style matching the Architecture section, on a
          full-bleed bottom rule that divides them from the body. The tablist
          pulls down 1px so the active tab's underline covers the rule rather
          than doubling it. */}
      <div className="hidden -mx-4 -mt-4 mb-7 border-b border-slate-200 sm:block sm:-mx-6 sm:-mt-6 dark:border-slate-900">
        <div
          role="tablist"
          aria-label="Benchmark view"
          className="-mb-px flex w-full items-end"
        >
          {METRICS.map((m, i) => {
            const on = m.key === metric;
            return (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setMetric(m.key)}
                className={`group ${m.key === "bars" ? "flex" : "hidden sm:flex"} min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 px-2 py-3 outline-none transition-colors sm:gap-2.5 sm:px-4 ${
                  on
                    ? "border-indigo-600 bg-slate-50 text-indigo-900 dark:bg-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-300"
                }`}
              >
                <span
                  className={`hidden font-mono text-xs font-semibold sm:inline ${
                    on ? "text-indigo-600 dark:text-indigo-400" : "opacity-50"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] font-semibold tracking-tight sm:text-sm">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Every body shares one grid cell, so the box always reserves the
              tallest and never changes height on toggle. min-w-0 keeps long
              lines (query chip, code) from stretching the box on mobile. */}
      <div className="grid min-w-0">
        <div
          className={`col-start-1 row-start-1 min-w-0 ${
            metric === "bars" ? "" : "sm:invisible sm:pointer-events-none"
          }`}
          aria-hidden={metric !== "bars"}
        >
          <LatencyBarsBody animate={metric === "bars" && inView} />
        </div>
        <div
          className={`col-start-1 row-start-1 hidden min-w-0 sm:block ${
            metric === "cdf" ? "" : "sm:invisible sm:pointer-events-none"
          }`}
          aria-hidden={metric !== "cdf"}
        >
          <LatencyCdfBody animate={metric === "cdf" && inView} />
        </div>
        <div
          className={`col-start-1 row-start-1 hidden min-w-0 sm:block ${
            metric === "reproduce" ? "" : "sm:invisible sm:pointer-events-none"
          }`}
          aria-hidden={metric !== "reproduce"}
        >
          <ReproduceBody />
        </div>
      </div>
    </div>
  );
}
