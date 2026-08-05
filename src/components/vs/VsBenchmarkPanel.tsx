"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { RiGithubFill } from "@remixicon/react";

/**
 * Head-to-head benchmark panels for /vs pages, driven entirely by the data
 * module emitted by scripts/import-vs-benchmark.mjs. One box per workload
 * family, stacked; each box carries its own controls and (for now) its own
 * Reproduce view. Distinct from the homepage BenchmarkPanel, which stays
 * hand-tuned for the landing story.
 */

export type VsBenchCell = {
  backend: "paradedb" | "fts";
  workload: "topk" | "filtered_range" | "filtered_literal" | "count";
  field: "title" | "text";
  limit: number | null;
  terms: string | null;
  model: "closed" | "open";
  load: number;
  n: number;
  qps: number | null;
  p50: number | null;
  p95: number | null;
  p99: number | null;
  max: number | null;
  timedOut: boolean;
};

export type VsBenchData = {
  generated: string;
  sources: string[];
  competitor: { key: string; name: string };
  environment: { paradedb: string; fts: string; note: string };
  termExamples: Record<string, string>;
  cells: VsBenchCell[];
};

const TERM_LABEL: Record<string, string> = {
  one: "1",
  two: "2",
  five: "5",
  ten: "10",
};

// ── formatting ─────────────────────────────────────────────────────────────
function fmtMs(v: number | null): string {
  if (v == null) return "";
  if (v >= 1000) return `${(v / 1000).toFixed(1)} s`;
  if (v >= 100) return `${Math.round(v)} ms`;
  return `${v.toFixed(1)} ms`;
}

// ── minimal SQL highlighting ───────────────────────────────────────────────
const SQL_TOKEN =
  /('[^']*')|(\b(?:SELECT|FROM|WHERE|ORDER BY|AND|DESC|LIMIT)\b)|(\b(?:websearch_to_tsquery|ts_rank_cd|count)\b|pdb\.score)|(\b\d+\b)/g;

function sqlLine(line: string, key: number): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  SQL_TOKEN.lastIndex = 0;
  while ((m = SQL_TOKEN.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1]
      ? "text-emerald-600 dark:text-emerald-400"
      : m[2]
        ? "text-indigo-600 dark:text-indigo-400"
        : m[3]
          ? "text-sky-600 dark:text-sky-400"
          : "text-amber-600 dark:text-amber-500";
    out.push(
      <span key={`${key}-${m.index}`} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return (
    <div key={key} className="whitespace-pre">
      {out.length ? out : " "}
    </div>
  );
}

function QueryBlock({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className="font-mono text-[12px] leading-[1.7] text-slate-700 dark:text-slate-300">
        {lines.map((l, i) => sqlLine(l, i))}
      </div>
    </div>
  );
}

// ── query text per workload ────────────────────────────────────────────────
type Sel = {
  workload: VsBenchCell["workload"];
  field: "title" | "text";
  limit: number | null;
  terms: string;
};

function pdbLines(sel: Sel, example: string): string[] {
  const filter =
    sel.workload === "filtered_range"
      ? ["  AND score > 10"]
      : sel.workload === "filtered_literal"
        ? ["  AND type = 'story'"]
        : [];
  if (sel.workload === "count") {
    return ["SELECT count(*) FROM hn_items", `WHERE ${sel.field} ||| '${example}'`];
  }
  return [
    "SELECT id, title, by, score",
    "FROM hn_items",
    `WHERE ${sel.field} ||| '${example}'`,
    ...filter,
    "ORDER BY pdb.score(id) DESC",
    `LIMIT ${sel.limit}`,
  ];
}

function ftsLines(sel: Sel, example: string): string[] {
  const or = example.split(/\s+/).join(" or ");
  const tsq = `websearch_to_tsquery('english', '${or}')`;
  const filter =
    sel.workload === "filtered_range"
      ? ["  AND score > 10"]
      : sel.workload === "filtered_literal"
        ? ["  AND type = 'story'"]
        : [];
  if (sel.workload === "count") {
    return [
      "SELECT count(*) FROM hn_items",
      `WHERE ${sel.field}_tsv @@`,
      `      ${tsq}`,
    ];
  }
  return [
    "SELECT id, title, by, score",
    "FROM hn_items",
    `WHERE ${sel.field}_tsv @@`,
    `      ${tsq}`,
    ...filter,
    `ORDER BY ts_rank_cd(${sel.field}_tsv,`,
    `      ${tsq}) DESC`,
    `LIMIT ${sel.limit}`,
  ];
}

// ── segmented control ──────────────────────────────────────────────────────
function Seg<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <div className="flex">
        {options.map((o, i) => {
          const on = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`whitespace-nowrap border-t border-b border-r px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors ${
                i === 0 ? "border-l" : ""
              } ${
                on
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── bars ───────────────────────────────────────────────────────────────────
const STRIPES = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(100,116,139,0.35) 4px, rgba(100,116,139,0.35) 8px)",
};

function CompareBody({
  us,
  them,
  competitorName,
  sel,
  example,
  animate,
}: {
  us: VsBenchCell | undefined;
  them: VsBenchCell | undefined;
  competitorName: string;
  sel: Sel;
  example: string;
  animate: boolean;
}) {
  // Replay the grow-in whenever the selection changes.
  const [grown, setGrown] = useState(false);
  const selKey = JSON.stringify(sel);
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
  }, [animate, selKey]);

  const themDnf = !them || them.timedOut;
  // A timed-out cell is scored at the 30s statement_timeout, so the shared
  // scale shows ParadeDB's bar relative to the cap FTS blew through.
  const DNF_MS = 30000;
  const rows = [
    { label: "p50", us: us?.p50 ?? null, them: themDnf ? DNF_MS : them.p50 },
    { label: "p95", us: us?.p95 ?? null, them: themDnf ? DNF_MS : them.p95 },
  ];
  const max = Math.max(1, ...rows.flatMap((r) => [r.us ?? 0, r.them ?? 0]));

  const bar = (value: number | null, dnf: boolean, solid: string, valueClass: string) => (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="relative h-6 min-w-0 flex-1 bg-slate-100 dark:bg-slate-800/50">
        {dnf ? (
          <div
            className="absolute inset-y-0 left-0 flex items-center px-2"
            style={{ ...STRIPES, width: `${(DNF_MS / max) * 100}%` }}
          >
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              no result within 30s
            </span>
          </div>
        ) : (
          <div
            className={`absolute inset-y-0 left-0 origin-left ${solid} ${
              grown
                ? "scale-x-100 transition-transform duration-700 ease-out"
                : "scale-x-0"
            }`}
            style={{
              width: `${Math.max(((value ?? 0) / max) * 100, 0.4)}%`,
            }}
          />
        )}
      </div>
      <span
        className={`w-16 shrink-0 whitespace-nowrap text-right font-mono text-[11px] tabular-nums sm:w-20 ${valueClass}`}
      >
        {dnf ? ">30 s" : fmtMs(value)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col border border-slate-200 dark:border-slate-800">
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Queries (left) */}
        <div className="flex shrink-0 flex-col gap-4 overflow-x-auto border-b border-slate-200 bg-slate-50 p-3 sm:w-[26rem] sm:border-b-0 sm:border-r dark:border-slate-800 dark:bg-slate-900/60">
          <QueryBlock label="ParadeDB" lines={pdbLines(sel, example)} />
          <QueryBlock label={competitorName} lines={ftsLines(sel, example)} />
        </div>
        {/* Numbers (right) */}
        <div className="min-w-0 flex-1 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:text-[11px] sm:tracking-[0.18em] dark:text-slate-400">
              Latency · lower is better
            </span>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:gap-4 sm:text-[11px] dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-indigo-500" aria-hidden />
                ParadeDB
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-slate-300 dark:bg-slate-500" aria-hidden />
                {competitorName}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {row.label}
                </div>
                <div className="space-y-1.5">
                  {bar(row.us, false, "bg-indigo-500", "text-indigo-600 dark:text-indigo-400")}
                  {bar(row.them, themDnf, "bg-slate-300 dark:bg-slate-600", "text-slate-400 dark:text-slate-500")}
                </div>
              </div>
            ))}
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Throughput
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[11px] tabular-nums">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span className="inline-block size-3 rounded-full bg-indigo-500" aria-hidden />
                  {us?.qps != null ? `${us.qps} QPS` : "n/a"}
                </span>
                <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <span className="inline-block size-3 rounded-full bg-slate-300 dark:bg-slate-500" aria-hidden />
                  {themDnf
                    ? "0 QPS"
                    : them?.qps != null
                      ? `${them.qps} QPS`
                      : "n/a"}
                  {!themDnf && them && them.n > 0 && them.n < 30 && (
                    <span className="text-slate-400/70 dark:text-slate-500/70">
                      · {them.n} finished
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── reproduce ──────────────────────────────────────────────────────────────
const REPRODUCE_LINES = [
  "git clone https://github.com/paradedb/benchmarker.git",
  "cd benchmarker && make",
  "",
  "# Pull the Hacker News dataset (28M rows)",
  "./bin/loader pull --dataset hn --anonymous \\",
  "    --source s3://paradedb-benchmarker/datasets/hn-elasticsearch-bm25.tar.gz",
  "",
  "# Load both engines; postgres gets stored tsvectors + GIN + btree",
  "./bin/loader load --backend paradedb ./datasets/hn",
  "./bin/loader load --backend postgres --workers 4 ./datasets/hn",
  "",
  "# Cap runaway FTS queries so a stalled scenario can't wedge the run",
  "docker exec postgres psql -U postgres -c \\",
  "    \"ALTER ROLE postgres IN DATABASE benchmark SET statement_timeout='30s'\"",
  "",
  "# Closed-loop matrix at 1/4/8 connections",
  "./k6 run --out dashboard=json,html -e MODE=closed datasets/hn/k6/pdb-vs-fts.js",
];

function ReproduceBody() {
  return (
    <div className="overflow-x-auto border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-[1.9] dark:border-slate-800 dark:bg-slate-900/60">
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
  );
}

// ── one box per workload family ────────────────────────────────────────────
function WorkloadCard({
  index,
  title,
  kind,
  data,
}: {
  index: number;
  title: string;
  kind: "topk" | "filtered" | "count";
  data: VsBenchData;
}) {
  const [view, setView] = useState<"results" | "reproduce">("results");
  const [field, setField] = useState<"title" | "text">("title");
  const [limit, setLimit] = useState<10 | 100>(10);
  const [terms, setTerms] = useState("one");
  const [conns, setConns] = useState(1);
  const [variant, setVariant] = useState<"filtered_range" | "filtered_literal">(
    "filtered_range",
  );

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

  const sel: Sel =
    kind === "filtered"
      ? { workload: variant, field: "text", limit: 10, terms: "one" }
      : kind === "count"
        ? { workload: "count", field, limit: null, terms: "one" }
        : { workload: "topk", field, limit, terms };

  const find = (backend: "paradedb" | "fts") =>
    data.cells.find(
      (c) =>
        c.model === "closed" &&
        c.backend === backend &&
        c.workload === sel.workload &&
        c.field === sel.field &&
        c.limit === sel.limit &&
        c.terms === sel.terms &&
        c.load === conns,
    );

  const example = data.termExamples[sel.terms] ?? "rust";

  return (
    <div
      ref={cardRef}
      className="border border-slate-200 bg-white dark:border-slate-900 dark:bg-slate-950"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6 dark:border-slate-900">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-slate-900 sm:text-sm dark:text-white">
            {title}
          </span>
        </div>
        <div className="flex font-mono text-[10px] uppercase tracking-[0.15em]">
          {(["results", "reproduce"] as const).map((v) => {
            const on = view === v;
            return (
              <button
                key={v}
                type="button"
                aria-pressed={on}
                onClick={() => setView(v)}
                className={`px-2.5 py-1 transition-colors ${
                  on
                    ? "text-indigo-600 underline underline-offset-4 dark:text-indigo-400"
                    : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {view === "reproduce" ? (
          <ReproduceBody />
        ) : (
          <div className="flex flex-col gap-4">
            {/* Dimension controls */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
              {kind === "topk" && (
                <>
                  <Seg
                    label="Field"
                    options={[
                      { value: "title" as const, label: "title" },
                      { value: "text" as const, label: "text" },
                    ]}
                    value={field}
                    onChange={setField}
                  />
                  <Seg
                    label="Top K"
                    options={[
                      { value: 10 as const, label: "10" },
                      { value: 100 as const, label: "100" },
                    ]}
                    value={limit}
                    onChange={setLimit}
                  />
                  <Seg
                    label="Terms"
                    options={["one", "two", "five", "ten"].map((v) => ({
                      value: v,
                      label: TERM_LABEL[v],
                    }))}
                    value={terms}
                    onChange={setTerms}
                  />
                </>
              )}
              {kind === "filtered" && (
                <Seg
                  label="Filter"
                  options={[
                    { value: "filtered_range" as const, label: "score > 10" },
                    { value: "filtered_literal" as const, label: "type = 'story'" },
                  ]}
                  value={variant}
                  onChange={setVariant}
                />
              )}
              {kind === "count" && (
                <Seg
                  label="Field"
                  options={[
                    { value: "title" as const, label: "title" },
                    { value: "text" as const, label: "text" },
                  ]}
                  value={field}
                  onChange={setField}
                />
              )}
              <Seg
                label="Clients"
                options={[1, 4, 8].map((v) => ({ value: v, label: String(v) }))}
                value={conns}
                onChange={setConns}
              />
            </div>

            <CompareBody
              us={find("paradedb")}
              them={find("fts")}
              competitorName={data.competitor.name}
              sel={sel}
              example={example}
              animate={inView && view === "results"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── panel: stacked workload boxes + shared footer ──────────────────────────
export default function VsBenchmarkPanel({ data }: { data: VsBenchData }) {
  return (
    <div className="flex flex-col gap-6">
      <WorkloadCard index={1} title="TopK search" kind="topk" data={data} />
      <WorkloadCard index={2} title="Filtered search" kind="filtered" data={data} />
      <WorkloadCard index={3} title="Count over search" kind="count" data={data} />

      <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        <p>
          {data.environment.paradedb} vs {data.environment.fts}.{" "}
          {data.environment.note}{" "}
          <a
            href="/benchmarks/pdb-vs-fts.json"
            download
            rel="nofollow"
            className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
          >
            Download the result data
          </a>
          .
        </p>
        <a
          href="https://github.com/paradedb/benchmarker"
          className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
        >
          <RiGithubFill size={16} className="shrink-0" aria-hidden />
          <span className="underline underline-offset-2">paradedb/benchmarker</span>
        </a>
      </div>
    </div>
  );
}
