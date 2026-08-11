import type { VsBenchData, VsBenchCell } from "./VsBenchmarkPanel";

/**
 * Server-rendered static results table. The interactive panel is great for
 * humans but its tabbed, stateful content is invisible to non-JS crawlers and
 * AI fetchers, which only ever see each card's default view. This table is
 * plain HTML, always in the DOM: every workload at every tested concurrency,
 * both engines, p50/p99 latency and throughput.
 *
 * Design notes for machine readability: one self-describing header row (no
 * colspan grouping, which is lost when a table is flattened to text), and
 * every dimension repeated on every row (no rowspan) so each row stands alone
 * when read out of context. Every metric in a row is measured at that row's
 * client count, so there is no hidden mixing of loads.
 */

type Row = {
  type: string; // workload family, e.g. "Top K"
  detail: string; // the distinguishing knob, e.g. "10 terms · top 10"
  workload: VsBenchCell["workload"];
  field: "title" | "text";
  limit: number | null;
  terms: string;
};

const ROWS: Row[] = [
  { type: "Top K", detail: "1 term · top 10", workload: "topk", field: "title", limit: 10, terms: "one" },
  { type: "Top K", detail: "1 term · top 10", workload: "topk", field: "text", limit: 10, terms: "one" },
  { type: "Top K", detail: "10 terms · top 10", workload: "topk", field: "text", limit: 10, terms: "ten" },
  { type: "Filtered", detail: "score > 10", workload: "filtered_range", field: "text", limit: 10, terms: "one" },
  { type: "Filtered", detail: "type = 'story'", workload: "filtered_literal", field: "text", limit: 10, terms: "one" },
  { type: "Count", detail: "—", workload: "count", field: "title", limit: null, terms: "one" },
  { type: "Count", detail: "—", workload: "count", field: "text", limit: null, terms: "one" },
  { type: "Faceting", detail: "terms", workload: "facet_terms", field: "text", limit: null, terms: "one" },
  { type: "Faceting", detail: "histogram", workload: "facet_histogram", field: "text", limit: null, terms: "one" },
  { type: "Highlighting", detail: "—", workload: "highlight", field: "title", limit: null, terms: "one" },
  { type: "Highlighting", detail: "—", workload: "highlight", field: "text", limit: null, terms: "one" },
];

const LOADS = [1, 4, 8];

function fmtMs(v: number | null | undefined): string {
  if (v == null) return "—";
  if (v >= 1000) return `${(v / 1000).toFixed(1)} s`;
  if (v >= 100) return `${Math.round(v)} ms`;
  return `${v.toFixed(1)} ms`;
}
function fmtQps(v: number | null | undefined): string {
  return v == null ? "—" : `${Math.round(v)}`;
}

const TH =
  "border-b border-slate-200 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:border-slate-800 dark:text-slate-400";
const TD = "border-t border-slate-200 px-3 py-2.5 dark:border-slate-800";

export default function VsBenchSummary({ data }: { data: VsBenchData }) {
  const cell = (
    r: Row,
    backend: "paradedb" | VsBenchData["competitor"]["key"],
    load: number,
  ) =>
    data.cells.find(
      (c) =>
        c.model === "closed" &&
        c.load === load &&
        c.backend === backend &&
        c.workload === r.workload &&
        c.field === r.field &&
        c.limit === r.limit &&
        c.terms === r.terms,
    );

  const key = data.competitor.key;
  const them = data.competitor.name;

  // Long/tidy format: one row per (workload, client-count, metric), so every
  // row reduces to a clean ParadeDB-vs-competitor comparison. Skip workloads
  // this matchup didn't run.
  const METRICS: {
    metric: string;
    fmt: (c: VsBenchCell | undefined) => string;
    dnf: string;
  }[] = [
    { metric: "p50 latency", fmt: (c) => fmtMs(c?.p50), dnf: ">30 s" },
    { metric: "p99 latency", fmt: (c) => fmtMs(c?.p99), dnf: ">30 s" },
    { metric: "throughput (QPS)", fmt: (c) => fmtQps(c?.qps), dnf: "0" },
  ];

  const rows = ROWS.filter((r) => cell(r, "paradedb", 1)).flatMap((r) =>
    LOADS.flatMap((load) => METRICS.map((m) => ({ r, load, m }))),
  );

  const usClass = "text-right font-mono text-[13px] tabular-nums text-indigo-700 dark:text-indigo-300";
  const themClass = "text-right font-mono text-[13px] tabular-nums text-slate-600 dark:text-slate-400";

  return (
    <details className="group border border-slate-200 dark:border-slate-800">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
        <span className="inline-block transition-transform group-open:rotate-90" aria-hidden>
          ▸
        </span>
        Full results table · all workloads at every concurrency
      </summary>
      <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <caption className="border-b border-slate-200 px-4 py-3 text-left text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            One row per workload, concurrency, and metric. Latency is in
            milliseconds; throughput is completed queries per second. All figures
            come from the downloadable data.
          </caption>
          <thead>
            <tr>
              <th className={`${TH} text-left`}>Workload</th>
              <th className={`${TH} text-left`}>Field</th>
              <th className={`${TH} text-left`}>Detail</th>
              <th className={`${TH} text-right`}>Clients</th>
              <th className={`${TH} border-l text-left`}>Metric</th>
              <th className={`${TH} border-l text-right`}>ParadeDB</th>
              <th className={`${TH} text-right`}>{them}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ r, load, m }, i) => {
              const u = cell(r, "paradedb", load);
              const t = cell(r, key, load);
              const dnf = !t || t.timedOut;
              const zebra =
                i % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50/40 dark:bg-slate-900/30";
              return (
                <tr key={`${r.type}-${r.field}-${r.detail}-${load}-${m.metric}`} className={zebra}>
                  <td className={`${TD} font-medium text-slate-900 dark:text-white`}>{r.type}</td>
                  <td className={`${TD} font-mono text-[13px] text-slate-700 dark:text-slate-300`}>
                    {r.field}
                  </td>
                  <td className={`${TD} font-mono text-[13px] text-slate-600 dark:text-slate-400`}>
                    {r.detail}
                  </td>
                  <td className={`${TD} text-right font-mono text-[13px] tabular-nums text-slate-700 dark:text-slate-300`}>
                    {load}
                  </td>
                  <td className={`${TD} border-l font-mono text-[13px] text-slate-700 dark:text-slate-300`}>
                    {m.metric}
                  </td>
                  <td className={`${TD} border-l ${usClass}`}>{m.fmt(u)}</td>
                  <td className={`${TD} ${themClass}`}>{dnf ? m.dnf : m.fmt(t)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
