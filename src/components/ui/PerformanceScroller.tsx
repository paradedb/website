"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  RiArrowDownSLine,
  RiBracesLine,
  RiBubbleChartLine,
  RiDatabase2Line,
  RiFilter3Line,
  RiFilterLine,
  RiGitBranchLine,
  RiGithubFill,
  RiGitMergeLine,
  RiCpuLine,
  RiLayoutVerticalLine,
  RiPieChartLine,
  RiRefreshLine,
  RiSearchEyeLine,
  RiStackLine,
  RiFlashlightLine,
  RiInformationLine,
} from "@remixicon/react";
import { cx } from "@/lib/utils";

export const ENGINES = [
  { key: "paradedb", label: "ParadeDB" },
  { key: "postgres", label: "Vanilla Postgres" },
  { key: "elasticsearch", label: "Elasticsearch" },
] as const;

export type EngineKey = (typeof ENGINES)[number]["key"];
type ComparisonKey = Exclude<EngineKey, "paradedb">;

const COMPARISONS = [
  { key: "postgres", label: "vs Vanilla Postgres" },
  { key: "elasticsearch", label: "vs Elasticsearch" },
] as const;

// Timings are p95 at one connection, pg_search 0.25.6 on Postgres 18.
// Text/Filters: Hacker News 28.7M rows, same runs as
// https://www.paradedb.com/vs/postgresql. Facets: same dataset and Postgres
// baseline, but the ParadeDB side is the score-histogram aggregate re-run
// with MVCC resolution off (solve_mvcc = false) — see the tab note. Joins:
// Stack Overflow 1M normalized (join_groupby: grouped aggregate over posts
// JOIN comments) from the paradedb/benchmarker stackoverflow dataset.
// Vector: Cohere 10M,
// 1%-filtered top-10 at 95% recall, pg_search vs pgvector HNSW, from
// https://paradedb.github.io/paradedb/benchmarks/vectors.html.
// Elasticsearch bars (where present): ES 8.17, one shard, force-merged to a
// single segment, same hardware and dataset, from the runs behind the
// ParadeDB vs Elasticsearch comparison. The Facets ES number comes from the
// same mvcc-off run as the ParadeDB number; Text/Filters ES numbers come
// from the ES matchup run. No ES bar for Joins (no single-query equivalent
// over normalized tables) or Vector (not benchmarked).
const BENCHMARKS: {
  key: string;
  label: string;
  tag?: string;
  paradedbMs: number | null;
  postgresMs: number | null;
  speedup: number | null;
  esMs?: number;
  dataset?: string;
  note?: string;
  bullets: { lead?: string; text: string; icon?: ReactNode; badge?: string }[];
}[] = [
  {
    key: "text",
    label: "Text",
    paradedbMs: 3.4,
    postgresMs: 2707,
    speedup: 796,
    esMs: 1.9,
    bullets: [
      {
        lead: "Powered by Tantivy,",
        text: "the Rust port of Lucene, for state-of-the-art full-text search performance.",
        icon: <RiFlashlightLine className="size-5" />,
      },
      {
        lead: "Tunable BM25 scoring,",
        text: "the same lexical ranking used by dedicated search engines.",
        icon: <RiSearchEyeLine className="size-5" />,
      },
      {
        lead: "Elastic-style search:",
        text: "typo tolerance, highlighting, phrase, fuzzy, proximity, and regex queries.",
        icon: <RiBracesLine className="size-5" />,
      },
    ],
  },
  {
    key: "vector",
    label: "Vector",
    tag: "Beta",
    paradedbMs: 30.1,
    postgresMs: 1122,
    speedup: 37,
    bullets: [
      {
        lead: "State-of-the-art vector index:",
        text: "hierarchical clustering built for larger-than-memory datasets.",
        icon: <RiBubbleChartLine className="size-5" />,
      },
      {
        lead: "Native filtering support:",
        text: "combine vector similarity with SQL predicates in one index scan.",
        icon: <RiFilterLine className="size-5" />,
      },
      {
        lead: "Incremental maintenance (SPFresh)",
        text: "keeps recall high as your data changes, without reindexing or retraining.",
        icon: <RiRefreshLine className="size-5" />,
        badge: "Coming soon",
      },
    ],
  },
  {
    key: "filters",
    label: "Filters",
    paradedbMs: 19,
    postgresMs: 820,
    speedup: 43,
    esMs: 26.1,
    bullets: [
      {
        lead: "Indexed alongside search:",
        text: "filter fields live in the same index as your search data, so filters are pushed down into the index itself.",
        icon: <RiFilterLine className="size-5" />,
      },
      {
        lead: "Filter any query,",
        text: "text, vector, aggregate, or join. Filtering is native to the index, so performance doesn't degrade.",
        icon: <RiFilter3Line className="size-5" />,
      },
      {
        lead: "Filters compose:",
        text: "booleans, ranges, and nested predicates stack without a performance cliff.",
        icon: <RiStackLine className="size-5" />,
      },
    ],
  },
  {
    key: "aggregates",
    label: "Facets",
    paradedbMs: 42.5,
    postgresMs: 2963,
    speedup: 70,
    esMs: 41,
    note: "The 42.5ms timing was measured with the same consistency guarantees as Elasticsearch: results aren't guaranteed to reflect one consistent snapshot of the database while data is changing. With extra checks to provide that guarantee, ParadeDB takes 90.6ms. Elasticsearch does not offer this stronger guarantee.",
    bullets: [
      {
        lead: "Columnar storage:",
        text: "the index keeps fields in a column-oriented format, the same way analytical databases read data efficiently.",
        icon: <RiLayoutVerticalLine className="size-5" />,
      },
      {
        lead: "Parallel execution:",
        text: "aggregates fan out across Postgres workers to keep large scans fast.",
        icon: <RiCpuLine className="size-5" />,
      },
      {
        lead: "Facets with results:",
        text: "return facet counts alongside search hits in a single query.",
        icon: <RiPieChartLine className="size-5" />,
      },
    ],
  },
  {
    key: "joins",
    label: "Joins",
    paradedbMs: 130,
    postgresMs: 486,
    speedup: 3.7,
    dataset: "Measured against the 1M post normalized Stack Overflow dataset",
    bullets: [
      {
        lead: "Efficient pushdown:",
        text: "search queries over joined tables are pushed down into the ParadeDB indexes instead of Postgres' row-based executor.",
        icon: <RiGitMergeLine className="size-5" />,
      },
      {
        lead: "Late materialization:",
        text: "rows are fetched only for the final results, after the index has answered the join and sort.",
        icon: <RiDatabase2Line className="size-5" />,
      },
      {
        lead: "All join shapes:",
        text: "INNER, LEFT, RIGHT, FULL, SEMI, and ANTI joins all can be accelerated.",
        icon: <RiGitBranchLine className="size-5" />,
      },
    ],
  },
];

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms.toFixed(1)}ms`;
}

export type QueryPanels = Record<
  string,
  Partial<Record<EngineKey, ReactNode>> | null
>;

function BenchmarkInfo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label={label}
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.preventDefault();
              setOpen(!open);
            }}
            className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center text-slate-400 transition-colors hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:text-indigo-400"
          >
            <RiInformationLine aria-hidden="true" className="size-4" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={8}
            collisionPadding={16}
            className="z-[100] max-w-[min(22rem,calc(100vw-2rem))] bg-slate-900 px-4 py-3 text-sm leading-relaxed text-slate-100 shadow-lg dark:bg-slate-100 dark:text-slate-900"
          >
            {children}
            <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-100" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function BarChart({
  paradedbMs,
  competitorMs,
  comparison,
  speedup,
  competitorLabel,
  note,
  unavailableNote,
}: {
  paradedbMs: number | null;
  competitorMs: number | null;
  comparison: ComparisonKey;
  speedup: number | null;
  competitorLabel: ReactNode;
  note?: string;
  unavailableNote?: string;
}) {
  const rows = [
    {
      name: "ParadeDB",
      ms: paradedbMs,
      barClass: "bg-indigo-600",
    },
    {
      name: competitorLabel,
      ms: competitorMs,
      barClass: comparison === "postgres" ? "bg-blue-600" : "bg-[#00bfb3]",
    },
  ];
  if (comparison === "postgres") {
    rows.sort((a, b) => (a.ms ?? Infinity) - (b.ms ?? Infinity));
  }
  const max = Math.max(...rows.map((r) => r.ms ?? 0));

  return (
    <div className="flex flex-col gap-5 sm:gap-3">
      <div className="mb-1 flex items-start justify-between gap-3 sm:mb-2 sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
        <div>
          <div className="flex min-h-7 items-center gap-1.5">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
              {paradedbMs === null ? (
                "Benchmarks coming soon"
              ) : (
                <>
                  P95 latency
                  <span className="hidden sm:inline">
                    {" "}
                    &middot; lower is better
                  </span>
                </>
              )}
            </p>
            {note && (
              <BenchmarkInfo label="Facets benchmark measurement details">
                {note}
              </BenchmarkInfo>
            )}
          </div>
        </div>
        {comparison === "postgres" && speedup !== null && (
          <span
            key={speedup}
            className="shrink-0 whitespace-nowrap text-sm font-semibold leading-7 tabular-nums text-indigo-600 dark:text-indigo-400 motion-safe:animate-[fade-in_180ms_ease-out]"
          >
            {speedup}× faster
          </span>
        )}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 sm:flex sm:gap-4"
        >
          <span
            key={`${comparison}-${paradedbMs}`}
            className={cx(
              "min-w-0 sm:w-52 sm:shrink-0 text-sm font-medium motion-safe:animate-[fade-in_180ms_ease-out]",
              row.ms === null
                ? "text-slate-400 dark:text-slate-600"
                : "text-slate-900 dark:text-white",
            )}
          >
            {row.name}
          </span>
          <div className="order-last col-span-2 h-2 bg-slate-100 dark:bg-slate-900 sm:order-none sm:h-3 sm:flex-1">
            <div
              className={cx(
                "h-full transition-all duration-500",
                row.ms === null
                  ? "bg-slate-200 dark:bg-slate-800"
                  : row.barClass,
              )}
              style={{
                width:
                  row.ms === null
                    ? "100%"
                    : `${Math.max((row.ms / max) * 100, 1.5)}%`,
              }}
            />
          </div>
          <span
            className={cx(
              "flex shrink-0 items-center justify-end gap-1 text-right font-mono text-sm sm:w-16",
              row.ms === null
                ? "text-slate-400 dark:text-slate-600"
                : "text-slate-500 dark:text-slate-400",
            )}
          >
            <span
              key={row.ms}
              className="motion-safe:animate-[fade-in_180ms_ease-out]"
            >
              {row.ms === null
                ? paradedbMs === null
                  ? "—"
                  : "n/a"
                : formatMs(row.ms)}
            </span>
            {row.ms === null && unavailableNote && (
              <BenchmarkInfo label="Why this benchmark is unavailable">
                {unavailableNote}
              </BenchmarkInfo>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceScroller({
  queryPanels,
}: {
  queryPanels: QueryPanels;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [comparison, setComparison] = useState<ComparisonKey>("postgres");
  const [engine, setEngine] = useState<EngineKey>("paradedb");

  useEffect(() => {
    const nav = navRef.current;
    const button = nav?.children[active] as HTMLElement | undefined;
    if (!nav || !button || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({
      left: button.offsetLeft - (nav.clientWidth - button.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      // Below md the section is a static block and tabs switch by tap.
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      const total = track.offsetHeight - window.innerHeight;
      const progress = Math.min(
        Math.max(-track.getBoundingClientRect().top / total, 0),
        0.999,
      );
      setActive(Math.floor(progress * BENCHMARKS.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTab = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    if (!window.matchMedia("(min-width: 768px)").matches) {
      setActive(index);
      return;
    }
    const total = track.offsetHeight - window.innerHeight;
    const top = window.scrollY + track.getBoundingClientRect().top;
    window.scrollTo({
      top: top + (total * (index + 0.5)) / BENCHMARKS.length,
      behavior: "smooth",
    });
  };

  const tab = BENCHMARKS[active];
  const visibleEngines = ENGINES.filter(
    (option) => option.key === "paradedb" || option.key === comparison,
  );
  const selectedEngine = engine === "paradedb" ? "paradedb" : comparison;

  return (
    <section
      aria-labelledby="performance-title"
      className="w-full bg-white dark:bg-slate-950"
    >
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="absolute top-0 bottom-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="border-y border-slate-200 dark:border-slate-900">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch opacity-60" />
        </div>
        <div ref={trackRef} className="relative md:h-[406vh]">
          <div className="md:sticky top-0 z-40 flex md:min-h-[96vh] flex-col justify-center px-6 sm:px-16 lg:px-24 py-10 md:py-8">
            <div className="mb-6 sm:mb-8 md:mb-6 relative z-40">
              <p className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                Performance
              </p>
              <h2
                id="performance-title"
                className="relative text-2xl sm:text-4xl font-semibold tracking-tight leading-[1.15] text-slate-900 dark:text-white"
              >
                <span
                  aria-hidden="true"
                  className="hidden sm:block absolute -left-16 lg:-left-24 translate-x-[calc(-50%+0.5px)] top-[0.15em] h-[0.9em] w-[3px] bg-indigo-600 z-40"
                />
                Ordinary SQL at extraordinary speeds.
              </h2>
              <p className="text-lg sm:text-xl font-normal leading-[1.4] text-slate-600 dark:text-slate-300 mt-4 max-w-4xl">
                When vanilla Postgres falls short, ParadeDB delivers speeds that
                go toe to toe with Elasticsearch.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 lg:gap-20">
              <div className="min-w-0">
                <div
                  role="group"
                  aria-label="Compare ParadeDB against"
                  className="grid grid-cols-2 border border-slate-200 dark:border-slate-800"
                >
                  {COMPARISONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      aria-pressed={comparison === option.key}
                      onClick={() => setComparison(option.key)}
                      className={cx(
                        "relative cursor-pointer border-b-2 px-3 py-3.5 text-sm font-semibold transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-base",
                        comparison === option.key
                          ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/5 dark:text-indigo-300"
                          : "border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="flex h-44 flex-col gap-3 md:gap-4 md:h-[clamp(11rem,calc(16dvh+5rem),14rem)] border-x border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3 sm:p-5 mb-6">
                  {queryPanels[tab.key] && (
                    <label className="relative order-last flex shrink-0 items-center gap-1 self-end">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Query:
                      </span>
                      <select
                        aria-label="Query engine"
                        value={selectedEngine}
                        onChange={(event) =>
                          setEngine(event.target.value as EngineKey)
                        }
                        className="cursor-pointer appearance-none rounded-none border-0 bg-transparent bg-none py-1 pl-1 pr-7 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 focus:border-transparent focus:outline-none focus:ring-0 focus-visible:underline focus-visible:underline-offset-4 dark:text-slate-300 dark:hover:text-white dark:[color-scheme:dark]"
                      >
                        {visibleEngines.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <RiArrowDownSLine
                        aria-hidden="true"
                        className="pointer-events-none absolute right-1 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      />
                    </label>
                  )}
                  <div
                    key={`${tab.key}-${selectedEngine}`}
                    role="region"
                    aria-label="Benchmark query"
                    tabIndex={0}
                    className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-2 [scrollbar-color:auto] [scrollbar-width:auto] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-0 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700"
                  >
                    <div className="motion-safe:animate-[fade-in_180ms_ease-out]">
                      {queryPanels[tab.key] ? (
                        (queryPanels[tab.key]?.[selectedEngine] ?? (
                          <p className="font-mono text-sm text-slate-400">
                            Elasticsearch vector benchmarks coming soon.
                          </p>
                        ))
                      ) : (
                        <p className="font-mono text-sm text-slate-400">
                          Benchmarks coming soon.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {tab.paradedbMs !== null &&
                !(comparison === "elasticsearch" && tab.key === "vector") ? (
                  <BarChart
                    paradedbMs={tab.paradedbMs}
                    competitorMs={
                      comparison === "postgres"
                        ? tab.postgresMs
                        : (tab.esMs ?? null)
                    }
                    comparison={comparison}
                    speedup={tab.speedup}
                    note={tab.note}
                    unavailableNote={
                      comparison === "elasticsearch" && tab.key === "joins"
                        ? "Elasticsearch has no equivalent query over normalized tables. Joining posts and comments requires denormalizing them at ingest."
                        : undefined
                    }
                    competitorLabel={
                      comparison === "elasticsearch"
                        ? "Elasticsearch"
                        : tab.key === "vector"
                          ? "pgvector HNSW"
                          : "Postgres"
                    }
                  />
                ) : (
                  <BarChart
                    paradedbMs={null}
                    competitorMs={null}
                    comparison={comparison}
                    speedup={null}
                    competitorLabel="Elasticsearch"
                  />
                )}

                <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
                  <p
                    key={`${tab.key}-${comparison}`}
                    className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 motion-safe:animate-[fade-in_180ms_ease-out]"
                  >
                    {tab.key !== "vector" && (
                      <>
                        ParadeDB 0.25.6 &middot;{" "}
                        {comparison === "postgres"
                          ? "Postgres 18"
                          : "Elasticsearch 8.17"}
                        .{" "}
                      </>
                    )}
                    {tab.dataset ??
                      (tab.key === "vector"
                        ? "Measured against the Cohere 10M dataset at 95% recall"
                        : "Measured against the 28M row Hacker News dataset")}{" "}
                    with{" "}
                    <a
                      href="https://github.com/paradedb/benchmarker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 align-bottom font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                    >
                      <RiGithubFill aria-hidden="true" className="size-4" />
                      paradedb/benchmarker
                    </a>
                    .
                  </p>
                </div>

                <ul className="mt-6 flex flex-col sm:grid min-h-[104px] gap-5 sm:gap-6 sm:grid-cols-3">
                  {tab.bullets.map((bullet) => (
                    <li key={bullet.text}>
                      <span className="mb-3 flex items-center gap-2">
                        {bullet.icon ? (
                          <span
                            aria-hidden="true"
                            className="text-indigo-600 dark:text-indigo-400"
                          >
                            {bullet.icon}
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="block h-[3px] w-6 bg-indigo-600"
                          />
                        )}
                        {bullet.badge && (
                          <span className="border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                            {bullet.badge}
                          </span>
                        )}
                      </span>
                      <span className="block text-sm text-slate-600 dark:text-slate-300 motion-safe:animate-[fade-in_180ms_ease-out]">
                        {bullet.lead && (
                          <>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {bullet.lead}
                            </span>{" "}
                          </>
                        )}
                        {bullet.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <nav
                ref={navRef}
                aria-label="Benchmark categories"
                className="order-first flex lg:flex-col gap-1 overflow-x-auto no-scrollbar"
              >
                {BENCHMARKS.map((benchmark, index) => (
                  <button
                    key={benchmark.key}
                    onClick={() => scrollToTab(index)}
                    className={cx(
                      "cursor-pointer whitespace-nowrap border-b-2 lg:border-b-0 lg:border-l-2 px-3 py-2 text-left text-sm font-medium transition-colors",
                      index === active
                        ? "border-indigo-600 text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                    )}
                  >
                    {benchmark.label}
                    {benchmark.tag && (
                      <span
                        className={cx(
                          "ml-2 border px-1.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-widest",
                          index === active
                            ? "border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-400",
                        )}
                      >
                        {benchmark.tag}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
