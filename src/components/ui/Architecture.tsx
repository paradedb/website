"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  RiBubbleChartLine,
  RiDatabase2Line,
  RiSparklingLine,
  RiFlashlightLine,
  RiLayoutVerticalLine,
  RiRefreshLine,
  RiSearchLine,
  RiStackLine,
} from "@remixicon/react";
import { Badge } from "./Badge";
import { cx } from "@/lib/utils";

const SHADOW_INDIGO = "#4f46e5";
const SHADOW_SLATE = "#64748b";

type Tab = "search" | "oltp";

const TABS: { id: Tab; number: string; label: string }[] = [
  { id: "oltp", number: "01", label: "More than an OLTP database" },
  { id: "search", number: "02", label: "More than a search engine" },
];

const SUBHEAD: Record<Tab, ReactNode> = {
  search: (
    <>
      Search engines are built for relevant search, but they{" "}
      <Link
        href="/blog/elasticsearch-was-never-a-database"
        target="_blank"
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
      >
        aren&apos;t databases
      </Link>
      , so they copy your data. ParadeDB is both a search index and a Postgres
      database, keeping the data your application needs in one place.
    </>
  ),
  oltp: "OLTP databases are built for reliable transactions, but not for search or analytics. ParadeDB adds full-text, vector, and aggregates, all in one custom Postgres index.",
};

export default function Architecture() {
  const [activeTab, setActiveTab] = useState<Tab>("oltp");

  const tableBox = (
    <Box emphasis="slate">
      <div className="flex flex-col items-center gap-2.5">
        <span className="font-mono font-bold whitespace-nowrap text-sm sm:text-base">
          Table
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1.5 border border-current/25 bg-current/10 px-2 py-0.5 font-mono text-[11px] sm:text-xs font-semibold whitespace-nowrap">
            <RiFlashlightLine className="size-3.5 shrink-0 opacity-70" />
            OLTP
          </span>
          <span className="inline-flex items-center gap-1.5 border border-current/25 bg-current/10 px-2 py-0.5 font-mono text-[11px] sm:text-xs font-semibold whitespace-nowrap">
            <RiDatabase2Line className="size-3.5 shrink-0 opacity-70" />
            Application Data
          </span>
        </div>
      </div>
    </Box>
  );

  const workloads: { label: string; icon: ReactNode }[] = [
    {
      label: "Full-Text",
      icon: <RiSearchLine className="size-3.5 shrink-0 text-white/70" />,
    },
    {
      label: "Vector",
      icon: <RiBubbleChartLine className="size-3.5 shrink-0 text-white/70" />,
    },
    {
      label: "Aggregates",
      icon: (
        <RiLayoutVerticalLine className="size-3.5 shrink-0 text-white/70" />
      ),
    },
  ];

  const indexBox = (
    <Box emphasis="indigo-solid">
      <div className="flex flex-col items-center gap-2.5">
        <span className="flex items-center justify-center gap-2 font-mono font-bold whitespace-nowrap text-sm sm:text-base">
          <img
            src="/brand/paradedb-logomark-white.svg"
            alt=""
            className="h-[0.8em] w-auto"
          />
          ParadeDB Index
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {workloads.map(({ label, icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 border border-white/25 bg-white/10 px-2 py-0.5 font-mono text-[11px] sm:text-xs font-semibold text-white/90 whitespace-nowrap"
            >
              {icon}
              {label}
            </span>
          ))}
        </div>
      </div>
    </Box>
  );

  const benefits: { icon: ReactNode; title: string; body: string }[] =
    activeTab === "search"
      ? [
          {
            icon: <RiStackLine className="size-5 shrink-0" />,
            title: "One database to run",
            body: "No separate search system to deploy or keep in sync.",
          },
          {
            icon: <RiRefreshLine className="size-5 shrink-0" />,
            title: "Always in sync",
            body: "Search results reflect every write the moment it lands.",
          },
        ]
      : [
          {
            icon: <RiStackLine className="size-5 shrink-0" />,
            title: "One search index",
            body: "A single index covering all parts of search unlocks pre-filtering and query optimization.",
          },
          {
            icon: <RiSparklingLine className="size-5 shrink-0" />,
            title: "A full search engine in your database",
            body: "BM25 relevance, vector search, faceting, and hybrid ranking, all in standard SQL.",
          },
        ];

  const arrowColor = "text-slate-400 dark:text-slate-600";

  const syncArrowHorizontal = (
    <svg
      width="56"
      height="14"
      viewBox="0 0 56 14"
      fill="none"
      aria-hidden="true"
      className={cx(arrowColor, "mx-1")}
    >
      <polygon points="0,7 10,2 10,12" fill="currentColor" />
      <line
        x1="8"
        y1="7"
        x2="48"
        y2="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon points="56,7 46,2 46,12" fill="currentColor" />
    </svg>
  );

  const syncArrowVertical = (
    <svg
      width="14"
      height="40"
      viewBox="0 0 14 40"
      fill="none"
      aria-hidden="true"
      className={cx("h-9 lg:h-10 w-auto", arrowColor)}
    >
      <polygon points="7,0 2,10 12,10" fill="currentColor" />
      <line
        x1="7"
        y1="8"
        x2="7"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon points="7,40 2,30 12,30" fill="currentColor" />
    </svg>
  );

  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Top hatched border */}
        <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />

        <section className="relative py-10 md:py-14 border-r border-l border-slate-200 dark:border-slate-900 bg-indigo-50/40 dark:bg-indigo-950/20">
          {/* Inner grid lines */}
          <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
          <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

          {/* Header */}
          <div className="flex flex-col items-center text-center px-6 sm:px-12 mb-10 md:mb-12">
            <Badge className="mb-6">Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl max-w-4xl">
              <span className="text-highlight-blink">One database</span>, two
              workloads.
            </h2>
          </div>

          {/* Tab control: aligned to the diagram width, styled like the Workloads tabs */}
          <div className="px-4 mb-10 md:mb-12">
            <div className="mx-auto w-full max-w-[1128px] overflow-hidden border-t-1 border-slate-200 dark:border-slate-900">
              <div className="border-b-1 border-slate-200 dark:border-slate-900">
                <div
                  role="tablist"
                  aria-label="Architecture comparison"
                  className="flex w-full items-end"
                >
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTab(tab.id)}
                        className={cx(
                          "group relative flex-1 flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium transition-all outline-none border-b-2 whitespace-nowrap",
                          isActive
                            ? "border-indigo-600 text-indigo-900 dark:text-white"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                        )}
                      >
                        <span
                          className={cx(
                            "text-xs font-mono font-semibold",
                            isActive
                              ? "text-indigo-600 dark:text-indigo-400 opacity-100"
                              : "opacity-50",
                          )}
                        >
                          {tab.number}
                        </span>
                        <span className="text-sm sm:text-base font-semibold tracking-tight">
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Subhead */}
          <div className="flex flex-col items-center text-center px-6 sm:px-12 mb-10 md:mb-12">
            <div className="relative grid w-full max-w-4xl items-center">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <p
                    key={tab.id}
                    aria-hidden={!isActive}
                    className={cx(
                      "col-start-1 row-start-1 text-base sm:text-lg text-gray-800 dark:text-slate-300 leading-relaxed transition-opacity duration-300",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none",
                    )}
                  >
                    {SUBHEAD[tab.id]}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Architecture diagram */}
          <div className="px-4">
            <div className="w-full max-w-[1128px] mx-auto">
              <div
                role="img"
                aria-label="ParadeDB architecture: a table heap in Postgres and a ParadeDB index with full-text, vector, and aggregate workloads."
                className="font-mono"
              >
                {/* PostgreSQL frame: label inside, border around the whole diagram */}
                <div className="relative border xl:border-x-0 border-slate-200 dark:border-slate-900 p-4 sm:p-5 md:p-6">
                  {/* Inner frame: PostgreSQL label straddling its top border */}
                  <div className="relative border border-t-0 border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-5 pt-12 pb-10 sm:px-8 sm:pt-14 sm:pb-12 md:px-10 md:pt-[4.5rem] md:pb-16">
                    <div className="absolute inset-x-0 top-0 -translate-y-1/2 flex items-center gap-3 font-mono text-sm font-bold text-slate-900 dark:text-white">
                      <span
                        aria-hidden
                        className="h-px flex-1 bg-slate-200 dark:bg-slate-900"
                      />
                      PostgreSQL
                      <span
                        aria-hidden
                        className="h-px flex-1 bg-slate-200 dark:bg-slate-900"
                      />
                    </div>
                    <div className="max-w-[900px] mx-auto">
                      {/* Mobile/tablet layout (< xl): vertical stack */}
                      <div className="xl:hidden flex flex-col items-stretch gap-3">
                        {tableBox}
                        <div className="flex justify-center mt-3">
                          {syncArrowVertical}
                        </div>
                        {indexBox}
                      </div>

                      {/* Desktop layout (xl+): horizontal grid */}
                      <div className="hidden xl:grid gap-x-6 items-center grid-cols-[1fr_auto_1fr]">
                        {tableBox}
                        {syncArrowHorizontal}
                        {indexBox}
                      </div>
                    </div>
                  </div>

                  {/* Benefits band: attached to the white diagram box, sharing its border */}
                  <div className="border border-t-0 border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-900 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.title}
                        className="flex items-start gap-3 px-5 py-4 sm:px-6 sm:py-5"
                      >
                        <span className="mt-0.5 text-indigo-600 dark:text-indigo-400">
                          {benefit.icon}
                        </span>
                        <div>
                          <div className="font-sans text-sm font-semibold text-indigo-950 dark:text-white">
                            {benefit.title}
                          </div>
                          <div className="font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-400 min-h-[2lh]">
                            {benefit.body}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom hatched border */}
        <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
      </div>
    </div>
  );
}

type Emphasis = "indigo-solid" | "indigo-light" | "slate";

// Fixed (static) pixel-dot shadow, anchored bottom-right — the same look as the
// PostgresNative cards, just colored per box (no canvas animation).
function StaticPixelShadow({ color }: { color: string }) {
  const fill = color.replace("#", "%23");
  return (
    <div
      aria-hidden="true"
      className="absolute top-2.5 left-2.5 -right-2.5 -bottom-2.5 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5'%3E%3Crect width='2' height='2' fill='${fill}' fill-opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "5px 5px",
        backgroundPosition: "calc(100% + 3px) calc(100% + 3px)",
      }}
    />
  );
}

function Box({
  emphasis,
  children,
}: {
  emphasis: Emphasis;
  children: ReactNode;
}) {
  if (emphasis === "indigo-solid") {
    return (
      <div className="relative">
        <StaticPixelShadow color={SHADOW_INDIGO} />
        <div className="relative border-2 border-indigo-600 bg-indigo-600 px-5 py-3 text-center text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0.5 border border-white/60 dark:border-white/30 pointer-events-none"
          />
          <div className="relative">{children}</div>
        </div>
      </div>
    );
  }
  if (emphasis === "indigo-light") {
    return (
      <div className="relative">
        <StaticPixelShadow color={SHADOW_INDIGO} />
        <div className="relative border-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-3 text-center text-indigo-600 dark:text-indigo-400">
          <div
            aria-hidden="true"
            className="absolute inset-0.5 border border-indigo-300 dark:border-indigo-700 pointer-events-none"
          />
          <div className="relative">{children}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      <StaticPixelShadow color={SHADOW_SLATE} />
      <div className="relative border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-3 text-center text-slate-500 dark:text-slate-200">
        <div
          aria-hidden="true"
          className="absolute inset-0.5 border border-slate-200 dark:border-slate-700 pointer-events-none"
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
