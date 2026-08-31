"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
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
} from "@remixicon/react";
import { cx } from "@/lib/utils";

export const ENGINES = [
  { key: "paradedb", label: "ParadeDB" },
  { key: "postgres", label: "Vanilla Postgres" },
] as const;

export type EngineKey = (typeof ENGINES)[number]["key"];

// Timings (P95) from https://www.paradedb.com/vs/postgresql — Hacker News
// benchmark, 28.7M rows. Speedups quoted from the published page. Vector:
// Cohere 10M, 1%-filtered top-10 at 95% recall, pg_search vs pgvector HNSW,
// from https://paradedb.github.io/paradedb/benchmarks/vectors.html.
const BENCHMARKS: {
  key: string;
  label: string;
  tag?: string;
  paradedbMs: number | null;
  postgresMs: number | null;
  speedup: number | null;
  bullets: { lead?: string; text: string; icon?: ReactNode; badge?: string }[];
}[] = [
  {
    key: "text",
    label: "Text",
    paradedbMs: 3.6,
    postgresMs: 1900,
    speedup: 538,
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
    paradedbMs: 22.4,
    postgresMs: 846,
    speedup: 38,
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
    paradedbMs: 88.4,
    postgresMs: 3000,
    speedup: 34,
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
    paradedbMs: null,
    postgresMs: null,
    speedup: null,
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
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export type QueryPanels = Record<string, Record<EngineKey, ReactNode> | null>;

function BarChart({
  paradedbMs,
  postgresMs,
  speedup,
  postgresLabel = "Vanilla Postgres",
}: {
  paradedbMs: number;
  postgresMs: number;
  speedup: number;
  postgresLabel?: string;
}) {
  const rows = [
    {
      name: "ParadeDB",
      ms: paradedbMs,
      barClass: "bg-indigo-600",
      badge: `${speedup}x faster`,
    },
    {
      name: postgresLabel,
      ms: postgresMs,
      barClass: "bg-slate-300 dark:bg-slate-700",
    },
  ];
  const max = Math.max(...rows.map((r) => r.ms));

  return (
    <div className="flex flex-col gap-5">
      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
        P95 latency &middot; lower is better
      </p>
      {rows.map((row) => (
        <div key={row.name}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {row.name}
            </span>
            <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {row.badge && (
                <>
                  <span className="font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                    {row.badge}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mx-3 inline-block h-3 w-px translate-y-0.5 bg-slate-300 dark:bg-slate-700"
                  />
                </>
              )}
              {formatMs(row.ms)}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-900">
            <div
              className={cx("h-full transition-all duration-500", row.barClass)}
              style={{ width: `${Math.max((row.ms / max) * 100, 1.5)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PlaceholderChart() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
        Benchmarks coming soon
      </p>
      {[0, 1].map((row) => (
        <div key={row}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="h-[21px] w-28 bg-slate-100 dark:bg-slate-900" />
            <span className="h-[21px] w-14 bg-slate-100 dark:bg-slate-900" />
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-900" />
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
    const total = track.offsetHeight - window.innerHeight;
    const top = window.scrollY + track.getBoundingClientRect().top;
    window.scrollTo({
      top: top + (total * (index + 0.5)) / BENCHMARKS.length,
      behavior: "smooth",
    });
  };

  const tab = BENCHMARKS[active];

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
        <div ref={trackRef} className="relative h-[500vh]">
          <div className="sticky top-0 z-40 flex min-h-[96vh] flex-col justify-center px-6 sm:px-16 lg:px-24 py-10 md:py-16">
            <div className="mb-6 sm:mb-10 md:mb-14 relative z-40">
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
                Give ParadeDB the queries where your OLTP database fell short.{" "}
                {tab.key === "vector"
                  ? "Measured against the Cohere 10M dataset at 95% recall"
                  : "Measured against the 28M row Hacker News dataset"}
                , reproducible with{" "}
                <a
                  href="https://github.com/paradedb/benchmarker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 align-bottom text-slate-600 dark:text-slate-300 font-medium decoration-slate-300 dark:decoration-slate-600 hover:text-slate-900 dark:hover:text-white"
                >
                  <RiGithubFill aria-hidden="true" className="size-5" />
                  paradedb/benchmarker
                </a>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 lg:gap-20">
              <div
                key={tab.key}
                className="animate-[slide-up-fade_600ms_cubic-bezier(0.16,1,0.3,1)]"
              >
                <div className="sm:min-h-[220px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3 sm:p-5 mb-6 sm:mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
                      {tab.label}
                    </p>
                    {queryPanels[tab.key] && (
                      <div className="flex border border-slate-200 dark:border-slate-800">
                        {ENGINES.map((option) => (
                          <button
                            key={option.key}
                            onClick={() => setEngine(option.key)}
                            className={cx(
                              "cursor-pointer px-3 py-1 text-xs font-medium transition-colors",
                              engine === option.key
                                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {queryPanels[tab.key]?.[engine] ?? (
                    <p className="font-mono text-sm text-slate-400">
                      Benchmarks coming soon.
                    </p>
                  )}
                </div>

                {tab.paradedbMs !== null &&
                tab.postgresMs !== null &&
                tab.speedup !== null ? (
                  <BarChart
                    paradedbMs={tab.paradedbMs}
                    postgresMs={tab.postgresMs}
                    speedup={tab.speedup}
                    postgresLabel={
                      tab.key === "vector" ? "pgvector HNSW" : undefined
                    }
                  />
                ) : (
                  <PlaceholderChart />
                )}

                <ul className="mt-8 sm:mt-10 flex overflow-x-auto no-scrollbar sm:grid min-h-[104px] gap-5 sm:gap-6 sm:grid-cols-3">
                  {tab.bullets.map((bullet) => (
                    <li
                      key={bullet.text}
                      className="w-[78%] shrink-0 sm:w-auto sm:shrink"
                    >
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
                      <span className="text-sm text-slate-600 dark:text-slate-300">
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
