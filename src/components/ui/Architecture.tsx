import type { ReactNode } from "react";
import {
  RiBarChart2Line,
  RiBubbleChartLine,
  RiSearchLine,
} from "@remixicon/react";
import { Badge } from "./Badge";
import PixelShadow from "./PixelShadow";

const SHADOW_INDIGO = "#4f46e5";
const SHADOW_SLATE = "#64748b";

export default function Architecture() {
  const tableBox = (
    <div className="relative">
      <PixelShadow color={SHADOW_SLATE} />
      <div className="relative border-2 border-slate-500 dark:border-slate-500 bg-white dark:bg-slate-900 px-5 py-3 text-center">
        <span className="font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap text-sm sm:text-base">
          Table
        </span>
      </div>
    </div>
  );

  const indexBox = (
    <div className="relative">
      <PixelShadow color={SHADOW_INDIGO} />
      <div className="relative border-2 border-indigo-600 bg-indigo-600 px-5 py-3 text-center">
        <div
          aria-hidden="true"
          className="absolute inset-0.5 border border-white/60 dark:border-white/30 pointer-events-none"
        />
        <span className="relative flex items-center justify-center gap-2 font-mono font-bold text-white whitespace-nowrap text-sm sm:text-base">
          <img
            src="/brand/paradedb-logomark-white.svg"
            alt=""
            className="h-[0.8em] w-auto"
          />
          ParadeDB Index
        </span>
      </div>
    </div>
  );

  const workloads: { label: string; icon: ReactNode }[] = [
    { label: "Full-Text", icon: <RiSearchLine className="size-4 shrink-0" /> },
    {
      label: "Vectors",
      icon: <RiBubbleChartLine className="size-4 shrink-0" />,
    },
    {
      label: "Aggregates",
      icon: <RiBarChart2Line className="size-4 shrink-0" />,
    },
  ];
  const renderWorkloadBox = ({
    label,
    icon,
  }: {
    label: string;
    icon: ReactNode;
  }) => (
    <div key={label} className="relative">
      <PixelShadow color={SHADOW_INDIGO} />
      <div className="relative border-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-3 text-center">
        <span className="flex items-center justify-center gap-2 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap text-sm sm:text-base">
          {icon}
          {label}
        </span>
      </div>
    </div>
  );

  const downArrow = (
    <svg
      width="14"
      height="40"
      viewBox="0 0 14 40"
      fill="none"
      aria-hidden="true"
      className="h-9 lg:h-10 w-auto text-indigo-600 dark:text-indigo-400"
    >
      <line
        x1="7"
        y1="0"
        x2="7"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon points="2,30 12,30 7,40" fill="currentColor" />
    </svg>
  );

  const syncArrowHorizontal = (
    <svg
      width="56"
      height="14"
      viewBox="0 0 56 14"
      fill="none"
      aria-hidden="true"
      className="text-slate-500 dark:text-slate-400 mx-1"
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
      className="h-9 lg:h-10 w-auto text-slate-500 dark:text-slate-400"
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
          <div className="flex flex-col items-center text-center px-6 sm:px-12 mb-8 md:mb-10">
            <Badge className="mb-6">Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-5 max-w-4xl">
              One <span className="text-highlight-blink">database</span>, three
              workloads.
            </h2>
            <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-4xl leading-relaxed">
              Full-text search, vector retrieval, and aggregations are typically
              spread across separate indexes, engines, or even databases. A
              query is broken apart, executed in different places, and stitched
              back together. ParadeDB avoids this by unifying all three in a
              custom Postgres index.
            </p>
          </div>

          {/* Architecture diagram */}
          <div className="px-4">
            <div className="w-full max-w-[1128px] mx-auto">
              <div
                role="img"
                aria-label="ParadeDB architecture: a table heap in Postgres and a ParadeDB index that serves full-text, vector, and aggregate queries."
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
                    <div className="max-w-[820px] mx-auto">
                      {/* Mobile/tablet layout (< lg): vertical stack */}
                      <div className="lg:hidden flex flex-col items-stretch gap-3">
                        {tableBox}
                        <div className="flex justify-center mt-3">
                          {syncArrowVertical}
                        </div>
                        {indexBox}
                        <div className="flex justify-center mt-3">
                          {downArrow}
                        </div>
                        <div className="flex flex-col items-stretch gap-5">
                          {workloads.map(renderWorkloadBox)}
                        </div>
                      </div>

                      {/* Desktop layout (lg+): horizontal grid */}
                      <div className="hidden lg:grid gap-x-6 items-center grid-cols-[auto_auto_1fr]">
                        {tableBox}
                        {syncArrowHorizontal}
                        {indexBox}
                        <div />
                        <div />
                        <div className="grid grid-cols-3 gap-6 mt-[22px] mb-3 justify-items-center">
                          {[1, 2, 3].map((i) => (
                            <span key={i} className="inline-flex">
                              {downArrow}
                            </span>
                          ))}
                        </div>
                        <div />
                        <div />
                        <div className="grid grid-cols-3 gap-6">
                          {workloads.map(renderWorkloadBox)}
                        </div>
                      </div>
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
