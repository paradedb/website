"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
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
// Text: two-term title search. Filters: one-term text search.
// Both use Hacker News 28.7M rows, same runs as
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
    paradedbMs: 5.4,
    postgresMs: 642.2,
    speedup: 119,
    esMs: 5.6,
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
  category,
  paradedbMs,
  competitorMs,
  comparison,
  speedup,
  competitorLabel,
  note,
  unavailableNote,
}: {
  category: string;
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
      <div className="mb-1 flex items-start justify-between gap-3 sm:mb-2 sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2 lg:mb-0">
        <div>
          <div className="flex min-h-7 items-center gap-1.5">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
              {category} &middot;{" "}
              {paradedbMs === null ? (
                "Benchmarks coming soon"
              ) : (
                <>
                  P95 latency
                  <span className="hidden sm:inline lg:hidden">
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
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 sm:flex sm:gap-4 lg:grid lg:gap-x-3 lg:gap-y-1.5"
        >
          <span
            key={`${comparison}-${paradedbMs}`}
            className={cx(
              "min-w-0 sm:w-36 sm:shrink-0 lg:w-auto text-sm font-medium motion-safe:animate-[fade-in_180ms_ease-out]",
              row.ms === null
                ? "text-slate-400 dark:text-slate-600"
                : "text-slate-900 dark:text-white",
            )}
          >
            {row.name}
          </span>
          <div className="order-last col-span-2 h-2 bg-slate-100 dark:bg-slate-900 sm:order-none sm:h-3 sm:flex-1 lg:order-last lg:h-2 lg:flex-none">
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
              "flex shrink-0 items-center justify-end gap-1 text-right font-mono text-sm sm:w-16 lg:w-auto",
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
  const [queryEngine, setQueryEngine] = useState<EngineKey>("paradedb");

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
      // Below lg the section is a static block and tabs switch by tap.
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
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
    if (!window.matchMedia("(min-width: 1024px)").matches) {
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
  const selectedEngine = queryEngine === "paradedb" ? "paradedb" : comparison;
  const queryEngineOptions = ENGINES.filter(
    (engine) => engine.key === "paradedb" || engine.key === comparison,
  );
  const chart =
    tab.paradedbMs !== null &&
    !(comparison === "elasticsearch" && tab.key === "vector") ? (
      <BarChart
        category={tab.label}
        paradedbMs={tab.paradedbMs}
        competitorMs={
          comparison === "postgres" ? tab.postgresMs : (tab.esMs ?? null)
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
              : "Vanilla Postgres"
        }
      />
    ) : (
      <BarChart
        category={tab.label}
        paradedbMs={null}
        competitorMs={null}
        comparison={comparison}
        speedup={null}
        competitorLabel="Elasticsearch"
      />
    );

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
        <div
          ref={trackRef}
          className="relative lg:h-[406vh] [overflow-anchor:none]"
        >
          <div className="lg:sticky top-0 z-40 flex lg:min-h-[96vh] lg:max-h-dvh flex-col lg:overflow-y-auto [scrollbar-width:thin] px-6 sm:px-16 lg:px-24 py-10 sm:py-16">
            <div className="shrink-0">
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
                  When vanilla Postgres falls short, ParadeDB delivers speeds
                  that go toe to toe with Elasticsearch.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[128px_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col">
                  <TabGroup
                    id="benchmark-view"
                    selectedIndex={COMPARISONS.findIndex(
                      (option) => option.key === comparison,
                    )}
                    onChange={(index) => setComparison(COMPARISONS[index].key)}
                    className="-mx-6 border border-slate-200 bg-white sm:mx-0 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <TabList
                      aria-label="Compare ParadeDB against"
                      className="flex h-12 border-b border-slate-200 dark:border-slate-800"
                    >
                      {COMPARISONS.map((option) => (
                        <Tab
                          key={option.key}
                          className="min-w-0 flex-1 cursor-pointer border-b-2 border-transparent px-1 text-xs font-medium text-slate-500 outline-none transition-colors hover:text-slate-900 focus:ring-0 data-selected:border-indigo-600 data-selected:text-indigo-600 sm:flex-none sm:px-5 sm:text-sm dark:text-slate-400 dark:hover:text-white dark:data-selected:border-indigo-400 dark:data-selected:text-indigo-400"
                        >
                          {option.label}
                        </Tab>
                      ))}
                    </TabList>
                    <TabPanels>
                      {COMPARISONS.map((option) => (
                        <TabPanel
                          key={option.key}
                          className="grid grid-cols-1 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-600 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
                        >
                          <div className="flex min-h-48 min-w-0 p-[23px] pb-0 sm:p-4 sm:pb-0 lg:h-60 lg:pb-4 lg:pr-0">
                            <div
                              role="region"
                              aria-label="Benchmark results"
                              className="flex min-w-0 flex-1 flex-col border border-slate-200 bg-slate-50 p-3 px-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900/50"
                            >
                              {chart}
                            </div>
                          </div>
                          <div className="flex min-w-0 p-[23px] pt-0 sm:p-4 sm:pt-0 lg:h-60 lg:pl-0 lg:pt-4">
                            <div className="flex min-w-0 flex-1 flex-col border border-t-0 border-slate-200 bg-slate-50 p-3 px-3.5 sm:p-4 lg:border-l-0 lg:border-t dark:border-slate-800 dark:bg-slate-900/50">
                              <div
                                role="group"
                                aria-label="Switch benchmark query"
                                className="-mx-3.5 -mt-3 mb-3 flex h-10 shrink-0 overflow-x-auto border-b border-slate-200 sm:-mx-4 sm:-mt-4 dark:border-slate-800"
                              >
                                <span className="flex h-full shrink-0 items-center border-b-2 border-r border-transparent border-r-slate-200 px-3.5 text-xs font-medium text-slate-600 sm:px-4 dark:border-r-slate-800 dark:text-slate-300">
                                  Query:
                                </span>
                                {queryEngineOptions.map((option) => {
                                  const isSelected =
                                    option.key === selectedEngine;

                                  return (
                                    <button
                                      key={option.key}
                                      type="button"
                                      aria-pressed={isSelected}
                                      onClick={() => setQueryEngine(option.key)}
                                      className={cx(
                                        "min-w-0 shrink-0 cursor-pointer whitespace-nowrap border-b-2 border-transparent px-3 text-xs font-medium text-slate-500 outline-none transition-colors hover:text-slate-900 focus:ring-0 sm:px-4 dark:text-slate-400 dark:hover:text-white",
                                        isSelected &&
                                          "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400",
                                      )}
                                    >
                                      {option.label}
                                      {option.key === "elasticsearch" &&
                                        " JSON"}
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="min-h-0 lg:flex-1">
                                <div
                                  key={`${tab.key}-${selectedEngine}`}
                                  role="region"
                                  aria-label="Benchmark query"
                                  tabIndex={0}
                                  className="benchmark-query-scroll max-h-[14lh] overflow-auto text-xs leading-snug focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-600 sm:text-sm sm:leading-snug lg:max-h-[7lh]"
                                >
                                  {queryPanels[tab.key]?.[selectedEngine] ?? (
                                    <p className="font-mono text-sm text-slate-400">
                                      Benchmarks coming soon.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                      ))}
                    </TabPanels>
                    <div className="border-t border-slate-200 px-[23px] py-3 sm:px-4 dark:border-slate-800">
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
                  </TabGroup>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1 mb-6 sm:gap-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                        What ParadeDB adds to Postgres
                      </span>
                      <span className="flex-1 min-w-0 h-px bg-slate-200 sm:min-w-4 dark:bg-slate-800" />
                      <span className="hidden shrink-0 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 sm:block dark:text-slate-600">
                        03 / 03
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
                </div>

                <nav
                  ref={navRef}
                  aria-label="Benchmark categories"
                  className="-mx-6 order-first flex gap-px overflow-x-auto no-scrollbar sm:mx-0 sm:gap-1 lg:flex-col"
                >
                  {BENCHMARKS.map((benchmark, index) => (
                    <button
                      key={benchmark.key}
                      onClick={() => scrollToTab(index)}
                      className={cx(
                        "flex-1 cursor-pointer whitespace-nowrap border-b-2 px-2 py-2 text-center text-xs font-medium transition-colors sm:px-3 sm:text-sm lg:flex-none lg:border-b-0 lg:border-l-2 lg:text-left",
                        index === active
                          ? "border-indigo-600 text-slate-900 dark:text-white"
                          : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                      )}
                    >
                      {benchmark.label}
                      {benchmark.tag && (
                        <span
                          className={cx(
                            "ml-1 border px-1 py-0.5 align-middle font-mono text-[8px] uppercase tracking-widest sm:ml-2 sm:px-1.5 sm:text-[10px]",
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
      </div>
    </section>
  );
}
