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
  backend: "paradedb" | "fts" | "es";
  workload:
    | "topk"
    | "filtered_range"
    | "filtered_literal"
    | "count"
    | "facet_terms"
    | "facet_histogram"
    | "highlight";
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
  /** Latency (ms) at each of data.percentiles; null if nothing completed. */
  cdf: number[] | null;
  timedOut: boolean;
};

export type VsBenchData = {
  generated: string;
  sources: string[];
  competitor: { key: "fts" | "es"; name: string };
  /** Percentile grid the cdf arrays index into. */
  percentiles: number[];
  environment: { paradedb: string; them: string; note: string[] };
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
  /('[^']*')|(\b(?:SELECT|FROM|WHERE|ORDER BY|AND|DESC|LIMIT|CREATE|TABLE|INDEX|USING|GENERATED|ALWAYS|AS|STORED|PRIMARY KEY|ON)\b)|(\b(?:websearch_to_tsquery|ts_rank_cd|to_tsvector|ts_headline|count)\b|pdb\.(?:score|snippet|agg))|(\b\d+\b)/g;

function sqlLine(line: string, key: number): ReactNode {
  if (/^\s*--/.test(line)) {
    return (
      <div
        key={key}
        className="whitespace-pre-wrap break-words text-slate-400 dark:text-slate-500"
      >
        {line}
      </div>
    );
  }
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
    <div key={key} className="whitespace-pre-wrap break-words">
      {out.length ? out : " "}
    </div>
  );
}

// JSON (ES query DSL) highlighting: keys sky, strings emerald, literals amber.
const JSON_TOKEN =
  /("[^"]*")(?=\s*:)|("[^"]*")|(\btrue\b|\bfalse\b|\b\d+\b)|(^POST\s+\S+)/g;

function jsonLine(line: string, key: number): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  JSON_TOKEN.lastIndex = 0;
  while ((m = JSON_TOKEN.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1]
      ? "text-sky-600 dark:text-sky-400"
      : m[2]
        ? "text-emerald-600 dark:text-emerald-400"
        : m[3]
          ? "text-amber-600 dark:text-amber-500"
          : "text-indigo-600 dark:text-indigo-400";
    out.push(
      <span key={`${key}-${m.index}`} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return (
    <div key={key} className="whitespace-pre-wrap break-words">
      {out.length ? out : " "}
    </div>
  );
}

function QueryBlock({
  label,
  lines,
  lang = "sql",
}: {
  label: string;
  lines: string[];
  lang?: "sql" | "json";
}) {
  const render = lang === "json" ? jsonLine : sqlLine;
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className="font-mono text-[12px] leading-[1.7] text-slate-700 dark:text-slate-300">
        {lines.map((l, i) => render(l, i))}
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
    return [
      "SELECT count(*) FROM hn_items",
      `WHERE ${sel.field} ||| '${example}'`,
    ];
  }
  if (sel.workload === "highlight") {
    return [
      `SELECT id, title, pdb.snippet(${sel.field})`,
      "FROM hn_items",
      `WHERE ${sel.field} ||| '${example}'`,
      "ORDER BY pdb.score(id) DESC",
      "LIMIT 10",
    ];
  }
  if (sel.workload === "facet_terms" || sel.workload === "facet_histogram") {
    const agg =
      sel.workload === "facet_terms"
        ? `'{"terms": {"field": "type"}}'`
        : `'{"histogram": {"field": "score", "interval": 50}}'`;
    return [
      "SELECT id,",
      `  pdb.agg(${agg}) OVER ()`,
      "FROM hn_items",
      `WHERE text ||| '${example}'`,
      "ORDER BY pdb.score(id) DESC",
      "LIMIT 10",
    ];
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
  if (sel.workload === "highlight") {
    return [
      "SELECT id, title,",
      `  ts_headline('english', ${sel.field},`,
      `    ${tsq})`,
      `FROM hn_items`,
      `WHERE ${sel.field}_tsv @@ ${tsq}`,
      `ORDER BY ts_rank_cd(${sel.field}_tsv,`,
      `      ${tsq}) DESC`,
      "LIMIT 10",
    ];
  }
  if (sel.workload === "facet_terms" || sel.workload === "facet_histogram") {
    const groupExpr = sel.workload === "facet_terms" ? "type" : "(score/50)*50";
    const col = sel.workload === "facet_terms" ? "type" : "score";
    return [
      "WITH hits AS (",
      `  SELECT id, ${col},`,
      "    ts_rank_cd(text_tsv, q) r",
      "  FROM hn_items,",
      "    websearch_to_tsquery(",
      `      'english', '${or}') q`,
      "  WHERE text_tsv @@ q",
      ")",
      "SELECT",
      "  -- pass 1: the facet buckets",
      "  (SELECT jsonb_object_agg(k, c)",
      `   FROM (SELECT ${groupExpr} k,`,
      "           count(*) c FROM hits",
      "         GROUP BY 1) t),",
      "  -- pass 2: the top 10 hits",
      "  (SELECT jsonb_agg(h)",
      "   FROM (SELECT * FROM hits",
      "         ORDER BY r DESC LIMIT 10) h)",
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

function esLines(sel: Sel, example: string): string[] {
  const match = `{ "match": { "${sel.field}": "${example}" } }`;
  if (sel.workload === "count") {
    return [
      "POST /hn_items/_search",
      "{",
      `  "query": ${match},`,
      '  "size": 0,',
      '  "track_total_hits": true',
      "}",
    ];
  }
  if (
    sel.workload === "filtered_range" ||
    sel.workload === "filtered_literal"
  ) {
    const filter =
      sel.workload === "filtered_range"
        ? '{ "range": { "score": { "gt": 10 } } }'
        : '{ "term": { "type": "story" } }';
    return [
      "POST /hn_items/_search",
      "{",
      '  "query": { "bool": {',
      `    "must": [${match}],`,
      `    "filter": [${filter}] } },`,
      '  "_source": ["id", "title", "by", "score"],',
      '  "size": 10',
      "}",
    ];
  }
  return [
    "POST /hn_items/_search",
    "{",
    `  "query": ${match},`,
    '  "_source": ["id", "title", "by", "score"],',
    `  "size": ${sel.limit}`,
    "}",
  ];
}

function themLines(key: "fts" | "es", sel: Sel, example: string): string[] {
  return key === "es" ? esLines(sel, example) : ftsLines(sel, example);
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

// ── distribution (CDF) ─────────────────────────────────────────────────────
// Chart geometry (responsive via viewBox).
const CW = 660;
const CH = 210;
const CM = { top: 12, right: 14, bottom: 30, left: 40 };
const CPW = CW - CM.left - CM.right;
const CPH = CH - CM.top - CM.bottom;

/** ~4 evenly spaced "nice" axis ticks from 0 past maxVal. */
function axisTicks(maxVal: number) {
  const rawStep = maxVal / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
  const norm = rawStep / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const ticks: number[] = [];
  const niceMax = Math.ceil(maxVal / step) * step;
  for (let v = 0; v <= niceMax + step / 1000; v += step)
    ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

function CdfChart({
  pcts,
  us,
  them,
  themDnf,
  competitorName,
  animate,
}: {
  pcts: number[];
  us: number[] | null;
  them: number[] | null;
  themDnf: boolean;
  competitorName: string;
  animate: boolean;
}) {
  const [grown, setGrown] = useState(false);
  const key = `${us?.[0]}-${them?.[0]}-${us?.length}`;
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
  }, [animate, key]);
  const drawStyle = (delayMs: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: grown ? 0 : 1,
    transition: grown
      ? `stroke-dashoffset 900ms ease-out ${delayMs}ms`
      : "none",
  });

  // Share one x-axis: the larger of the two p99s so both curves fit.
  const lastUs = us ? us[us.length - 1] : 0;
  const lastThem = !themDnf && them ? them[them.length - 1] : 0;
  const ticks = axisTicks(Math.max(lastUs, lastThem, 1));
  const xMax = ticks[ticks.length - 1];
  const xOf = (lat: number) => CM.left + (Math.min(lat, xMax) / xMax) * CPW;
  const yOf = (p: number) => CM.top + CPH - (p / 100) * CPH;
  const path = (vals: number[]) =>
    vals
      .map(
        (lat, i) =>
          `${i === 0 ? "M" : "L"}${xOf(lat).toFixed(1)},${yOf(pcts[i]).toFixed(1)}`,
      )
      .join(" ");
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg
      viewBox={`0 0 ${CW} ${CH}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Latency distribution: ParadeDB versus ${competitorName}`}
    >
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
            className="fill-slate-400 font-mono text-[10px] tabular-nums dark:fill-slate-500"
          >
            {p}%
          </text>
        </g>
      ))}
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
            className="fill-slate-400 font-mono text-[10px] tabular-nums dark:fill-slate-500"
          >
            {tk}
          </text>
        </g>
      ))}

      {!themDnf && them && (
        <path
          d={path(them)}
          fill="none"
          pathLength={1}
          className="stroke-slate-300 dark:stroke-slate-600"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={drawStyle(0)}
        />
      )}
      {us && (
        <path
          d={path(us)}
          fill="none"
          pathLength={1}
          className="stroke-indigo-500"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={drawStyle(120)}
        />
      )}

      <text
        x={CM.left + CPW / 2}
        y={CH - 2}
        textAnchor="middle"
        className="fill-slate-400 font-mono text-[9px] uppercase tracking-[0.1em] dark:fill-slate-500"
      >
        latency (ms)
      </text>
      {themDnf && (
        <text
          x={CM.left + CPW / 2}
          y={CM.top + CPH / 2}
          textAnchor="middle"
          className="fill-slate-400 font-mono text-[10px] uppercase tracking-[0.12em] dark:fill-slate-500"
        >
          {competitorName}: no result within 30s
        </text>
      )}
    </svg>
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
  competitor,
  sel,
  example,
  pcts,
  view,
  animate,
}: {
  us: VsBenchCell | undefined;
  them: VsBenchCell | undefined;
  competitor: VsBenchData["competitor"];
  sel: Sel;
  example: string;
  pcts: number[];
  view: "bars" | "cdf";
  animate: boolean;
}) {
  const competitorName = competitor.name;
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

  const bar = (
    value: number | null,
    dnf: boolean,
    solid: string,
    valueClass: string,
    ratio: string,
  ) => (
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
        {ratio && (
          <span
            className={`absolute inset-y-0 right-2 flex items-center whitespace-nowrap font-mono text-[11px] font-semibold tabular-nums ${valueClass}`}
          >
            {ratio}
          </span>
        )}
      </div>
      <span
        className={`w-16 shrink-0 whitespace-nowrap text-right font-mono text-[11px] tabular-nums sm:w-20 ${valueClass}`}
      >
        {dnf ? ">30 s" : fmtMs(value)}
      </span>
    </div>
  );

  // Ratio of the slower engine's latency to the faster one, shown next to the
  // winner. e.g. ParadeDB 3ms vs FTS 739ms -> "224× faster" on ParadeDB.
  const fmtRatio = (slow: number, fast: number) => {
    const r = slow / fast;
    return `${r >= 10 ? Math.round(r) : Math.round(r * 10) / 10}×`;
  };
  const ratios = (usVal: number | null, themVal: number | null) => {
    if (
      themDnf ||
      usVal == null ||
      themVal == null ||
      usVal <= 0 ||
      themVal <= 0
    )
      return { us: "", them: "" };
    return usVal <= themVal
      ? { us: fmtRatio(themVal, usVal), them: "" }
      : { us: "", them: fmtRatio(usVal, themVal) };
  };

  return (
    <div className="flex flex-1 flex-col border border-slate-200 dark:border-slate-800">
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Queries (left) */}
        <div className="flex shrink-0 flex-col gap-4 overflow-x-auto border-b border-slate-200 bg-slate-50 p-3 sm:w-[26rem] sm:border-b-0 sm:border-r dark:border-slate-800 dark:bg-slate-900/60">
          <QueryBlock label="ParadeDB" lines={pdbLines(sel, example)} />
          <QueryBlock
            label={competitorName}
            lines={themLines(competitor.key, sel, example)}
            lang={competitor.key === "es" ? "json" : "sql"}
          />
        </div>
        {/* Numbers (right) */}
        <div className="min-w-0 flex-1 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:text-[11px] sm:tracking-[0.18em] dark:text-slate-400">
              {view === "cdf"
                ? "% ≤ latency · left is faster"
                : "Latency · lower is better"}
            </span>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:gap-4 sm:text-[11px] dark:text-slate-400">
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
                {competitorName}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {view === "cdf" ? (
              <CdfChart
                pcts={pcts}
                us={us?.cdf ?? null}
                them={them?.cdf ?? null}
                themDnf={themDnf}
                competitorName={competitorName}
                animate={animate}
              />
            ) : (
              rows.map((row) => {
                const r = ratios(row.us, row.them);
                return (
                  <div key={row.label}>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {row.label}
                    </div>
                    <div className="space-y-1.5">
                      {bar(
                        row.us,
                        false,
                        "bg-indigo-500",
                        "text-indigo-600 dark:text-indigo-400",
                        r.us,
                      )}
                      {bar(
                        row.them,
                        themDnf,
                        "bg-slate-300 dark:bg-slate-600",
                        "text-slate-400 dark:text-slate-500",
                        r.them,
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Throughput
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[11px] tabular-nums">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span
                    className="inline-block size-3 rounded-full bg-indigo-500"
                    aria-hidden
                  />
                  {us?.qps != null ? `${us.qps} QPS` : "n/a"}
                </span>
                <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <span
                    className="inline-block size-3 rounded-full bg-slate-300 dark:bg-slate-500"
                    aria-hidden
                  />
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
// Each box reproduces only its own workload via -e WORKLOADS=<kind>.
const WORKLOAD_ENV: Record<string, string> = {
  topk: "topk",
  filtered: "filtered",
  count: "count",
  facet: "facet",
  highlight: "highlight",
};

function reproduceLines(competitorKey: "fts" | "es", kind: string): string[] {
  const setup =
    competitorKey === "es"
      ? [
          "# Load both engines; ES is force-merged to one segment by post.json",
          "./bin/loader load --backend paradedb      ./datasets/hn",
          "./bin/loader load --backend elasticsearch ./datasets/hn",
        ]
      : [
          "# Load both engines; postgres gets stored tsvectors + GIN + btree",
          "./bin/loader load --backend paradedb ./datasets/hn",
          "./bin/loader load --backend postgres ./datasets/hn",
          "",
          "# Cap runaway FTS queries so a stalled scenario can't wedge the run",
          "docker exec postgres psql -U postgres -c \\",
          "    \"ALTER ROLE postgres IN DATABASE benchmark SET statement_timeout='30s'\"",
        ];
  const script = competitorKey === "es" ? "pdb-vs-es.js" : "pdb-vs-fts.js";
  const workload = WORKLOAD_ENV[kind] ?? kind;
  const profiles =
    competitorKey === "es"
      ? "--profile paradedb --profile elasticsearch"
      : "--profile paradedb --profile postgres";
  return [
    "git clone https://github.com/paradedb/benchmarker.git",
    "cd benchmarker && make",
    "",
    "# Pull the Hacker News dataset (28M rows)",
    "./bin/loader pull --dataset hn --anonymous \\",
    "    --source s3://paradedb-benchmarker/datasets/hn-benchmarker.tar.gz",
    "",
    "# Stop everything first: postgres and elasticsearch share cores 4-7, so",
    "# only the two engines for this comparison should ever be running.",
    "docker compose -f datasets/hn/docker-compose.yml --profile all stop",
    "",
    "# Start the engines and their pgbouncers via compose profiles. CPU pins",
    "# keep them isolated: paradedb 0-3, postgres/elasticsearch 4-7, bouncers",
    "# 8-11, and the k6 runner on 12-15, so no engine shares cores.",
    `docker compose -f datasets/hn/docker-compose.yml ${profiles} \\`,
    "    up -d --wait",
    "",
    ...setup,
    "",
    "# This workload only, closed loop at 1/4/8 connections. Each scenario",
    "# warms before it measures; run the command twice and take the second",
    "# for fully hot, steady-state numbers.",
    `taskset -c 12-15 ./k6 run --out dashboard=json,html -e MODE=closed \\`,
    `    -e WORKLOADS=${workload} datasets/hn/k6/${script}`,
  ];
}

function ReproduceBody({
  competitorKey,
  kind,
}: {
  competitorKey: "fts" | "es";
  kind: string;
}) {
  const lines = reproduceLines(competitorKey, kind);
  return (
    <div className="overflow-x-auto border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-[1.9] dark:border-slate-800 dark:bg-slate-900/60">
      {lines.map((line, i) => (
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

// ── schema ─────────────────────────────────────────────────────────────────
// The DDL each engine was loaded with, matching the benchmarker dataset dirs.
const PDB_SCHEMA = [
  "CREATE TABLE hn_items (",
  "  id BIGINT PRIMARY KEY,",
  "  title TEXT, text TEXT, by TEXT,",
  "  type TEXT, url TEXT,",
  "  score INTEGER, time TIMESTAMPTZ",
  ");",
  "",
  "CREATE INDEX hn_items_idx ON hn_items",
  "USING paradedb (",
  "  id, title, text, score, time,",
  "  (by::pdb.literal),",
  "  (type::pdb.literal),",
  "  (url::pdb.literal)",
  ") WITH (key_field='id');",
];

const FTS_SCHEMA = [
  "CREATE TABLE hn_items (",
  "  id BIGINT PRIMARY KEY,",
  "  title TEXT, text TEXT, by TEXT,",
  "  type TEXT, score INTEGER, time TIMESTAMPTZ,",
  "  title_tsv tsvector GENERATED ALWAYS AS",
  "    (to_tsvector('english', title)) STORED,",
  "  text_tsv tsvector GENERATED ALWAYS AS",
  "    (to_tsvector('english', text)) STORED",
  ");",
  "",
  "CREATE INDEX ON hn_items USING gin (title_tsv);",
  "CREATE INDEX ON hn_items USING gin (text_tsv);",
  "CREATE INDEX ON hn_items USING btree (score);",
  "CREATE INDEX ON hn_items USING btree (type);",
];

const ES_SCHEMA = [
  "PUT /hn_items",
  "{",
  '  "mappings": { "properties": {',
  '    "title": { "type": "text", "analyzer": "english" },',
  '    "text":  { "type": "text", "analyzer": "english" },',
  '    "by":    { "type": "keyword" },',
  '    "type":  { "type": "keyword" },',
  '    "url":   { "type": "keyword" },',
  '    "score": { "type": "integer" },',
  '    "time":  { "type": "date" }',
  "  } }",
  "}",
  "",
  "// force-merged to one segment after load",
  "POST /hn_items/_forcemerge?max_num_segments=1",
];

const THEM_SCHEMA: Record<"fts" | "es", string[]> = {
  fts: FTS_SCHEMA,
  es: ES_SCHEMA,
};

function SchemaBody({
  competitorKey,
  competitorName,
}: {
  competitorKey: "fts" | "es";
  competitorName: string;
}) {
  const box =
    "overflow-x-auto border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={box}>
        <QueryBlock label="ParadeDB" lines={PDB_SCHEMA} />
      </div>
      <div className={box}>
        <QueryBlock
          label={competitorName}
          lines={THEM_SCHEMA[competitorKey]}
          lang={competitorKey === "es" ? "json" : "sql"}
        />
      </div>
    </div>
  );
}

// ── one box per workload family ────────────────────────────────────────────
type WorkloadKind = "topk" | "filtered" | "count" | "facet" | "highlight";

function WorkloadCard({
  index,
  title,
  kind,
  data,
}: {
  index: number;
  title: string;
  kind: WorkloadKind;
  data: VsBenchData;
}) {
  const [view, setView] = useState<
    "latency" | "distribution" | "schema" | "reproduce"
  >("latency");
  const [field, setField] = useState<"title" | "text">("title");
  const [limit, setLimit] = useState<10 | 100>(10);
  const [terms, setTerms] = useState("one");
  const [conns, setConns] = useState(1);
  const [variant, setVariant] = useState<"filtered_range" | "filtered_literal">(
    "filtered_range",
  );
  const [facet, setFacet] = useState<"facet_terms" | "facet_histogram">(
    "facet_terms",
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
        : kind === "facet"
          ? { workload: facet, field: "text", limit: null, terms: "one" }
          : kind === "highlight"
            ? { workload: "highlight", field, limit: null, terms: "one" }
            : { workload: "topk", field, limit, terms };

  const find = (backend: "paradedb" | "fts" | "es") =>
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
          {(["latency", "distribution", "schema", "reproduce"] as const).map(
            (v) => {
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
            },
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {view === "reproduce" ? (
          <ReproduceBody competitorKey={data.competitor.key} kind={kind} />
        ) : view === "schema" ? (
          <SchemaBody
            competitorKey={data.competitor.key}
            competitorName={data.competitor.name}
          />
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
                    {
                      value: "filtered_literal" as const,
                      label: "type = 'story'",
                    },
                  ]}
                  value={variant}
                  onChange={setVariant}
                />
              )}
              {(kind === "count" || kind === "highlight") && (
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
              {kind === "facet" && (
                <Seg
                  label="Facet"
                  options={[
                    { value: "facet_terms" as const, label: "terms" },
                    { value: "facet_histogram" as const, label: "histogram" },
                  ]}
                  value={facet}
                  onChange={setFacet}
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
              them={find(data.competitor.key)}
              competitor={data.competitor}
              sel={sel}
              example={example}
              pcts={data.percentiles}
              view={view === "distribution" ? "cdf" : "bars"}
              animate={inView}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── coming-soon placeholder box (vector / hybrid workloads) ────────────────
const VECTOR_QUERY = [
  "SELECT id, title",
  "FROM hn_items",
  "ORDER BY embedding <=> $query_vec",
  "LIMIT 10",
];

function ComingSoonCard({ index, title }: { index: number; title: string }) {
  return (
    <div className="border border-slate-200 bg-white dark:border-slate-900 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6 dark:border-slate-900">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-slate-900 sm:text-sm dark:text-white">
            {title}
          </span>
        </div>
        <span className="rounded-full border border-slate-300 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Coming soon
        </span>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid items-center gap-4 sm:grid-cols-2">
          <div className="overflow-x-auto border border-slate-200 bg-slate-50 p-4 opacity-60 dark:border-slate-800 dark:bg-slate-900/60">
            <QueryBlock label="ParadeDB" lines={VECTOR_QUERY} />
          </div>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Dense and sparse vector search, plus hybrid BM25 and vector ranking,
            all served from the same index. We&apos;re adding these workloads to
            the benchmark next.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── panel: methodology note, then stacked workload boxes ───────────────────
export default function VsBenchmarkPanel({ data }: { data: VsBenchData }) {
  const has = (wl: VsBenchCell["workload"]) =>
    data.cells.some((c) => c.workload === wl && !c.timedOut);

  // Only render a box when the run actually covered its workload, so a
  // matchup without facet/highlight data doesn't show empty boxes.
  const boxes: { title: string; kind: WorkloadKind }[] = [
    { title: "Top K search", kind: "topk" },
    { title: "Filtered search", kind: "filtered" },
    { title: "Count over search", kind: "count" },
    ...(has("facet_terms")
      ? [{ title: "Faceting", kind: "facet" as const }]
      : []),
    ...(has("highlight")
      ? [{ title: "Highlighting", kind: "highlight" as const }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 text-base leading-relaxed text-gray-800 dark:text-slate-300">
        {data.environment.note.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {boxes.map((b, i) => (
        <WorkloadCard
          key={b.kind}
          index={i + 1}
          title={b.title}
          kind={b.kind}
          data={data}
        />
      ))}
      <ComingSoonCard index={boxes.length + 1} title="Vector search" />

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <a
          href={`/benchmarks/pdb-vs-${data.competitor.key}.json`}
          download
          rel="nofollow"
          className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
        >
          Download the result data
        </a>
        <a
          href="https://github.com/paradedb/benchmarker"
          className="inline-flex items-center gap-1 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
        >
          <RiGithubFill size={14} className="shrink-0" aria-hidden />
          <span className="underline underline-offset-2">
            paradedb/benchmarker
          </span>
        </a>
      </p>
    </div>
  );
}
