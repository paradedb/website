"use client";

import { type ReactNode } from "react";
import {
  RiBubbleChartLine,
  RiDatabase2Line,
  RiFlashlightLine,
  RiLayoutVerticalLine,
  RiSearchLine,
} from "@remixicon/react";
import { SectionHeader } from "./SectionHeader";
import PixelShadow from "./PixelShadow";
import { cx } from "@/lib/utils";

const SHADOW_INDIGO = "#4f46e5";
const SHADOW_SLATE = "#64748b";

const CARDS: { number: string; title: string; body: ReactNode }[] = [
  {
    number: "01",
    title: "More than OLTP",
    body: "OLTP databases are built for reliable transactions, but not for search. The ParadeDB index brings search-optimized data structures and query execution paths to Postgres.",
  },
  {
    number: "02",
    title: "More than search",
    body: "Search engines operate on a denormalized copy of your data. ParadeDB keeps your application data in one place without any schema changes.",
  },
];

export default function Architecture() {
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

        <section className="relative z-40 py-10 md:py-16 border-r border-l border-slate-200 dark:border-slate-900">
          {/* Header */}
          <div className="mx-auto w-full max-w-[1128px] px-4 sm:px-12 xl:px-0 mb-10 md:mb-12">
            <SectionHeader
              eyebrow="Benefits"
              title="Zero ETL means zero headache."
              description="ParadeDB is a single index that stays in sync with your application data — so you can ship features and not infra complexity."
            />
          </div>

          <div className="relative">
            {/* Inner grid lines, below the header */}
            <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
            <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

            {/* Architecture diagram */}
            <div className="px-4">
              <div className="w-full max-w-[1128px] mx-auto">
                <div
                  role="img"
                  aria-label="ParadeDB architecture: a table heap in Postgres and a ParadeDB index with full-text, vector, and aggregate workloads."
                  className="font-mono"
                >
                  {/* PostgreSQL frame: label inside, border around the whole diagram */}
                  <div className="relative sm:border xl:border-x-0 border-slate-200 dark:border-slate-900 p-0 sm:p-5 md:p-6">
                    {/* Inner frame: PostgreSQL label straddling its top border */}
                    <div className="relative sm:border sm:border-t-0 border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-0 pt-12 pb-10 sm:px-8 sm:pt-14 sm:pb-12 md:px-10 md:pt-[4.5rem] md:pb-16">
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

                    {/* Content cards: attached to the white diagram box, sharing its border */}
                    <div className="sm:border sm:border-t-0 border-slate-200 dark:border-slate-900 bg-slate-200 dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-px">
                      {CARDS.map((card) => (
                        <div
                          key={card.title}
                          className="px-0 py-5 sm:px-6 sm:py-6 bg-white dark:bg-slate-950"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                              {card.number}
                            </span>
                            <h3 className="font-sans font-semibold text-base tracking-tight text-indigo-950 dark:text-white">
                              {card.title}
                            </h3>
                          </div>
                          <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {card.body}
                          </p>
                        </div>
                      ))}
                    </div>
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
        <PixelShadow color={SHADOW_INDIGO} />
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
        <PixelShadow color={SHADOW_INDIGO} />
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
      <PixelShadow color={SHADOW_SLATE} />
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
