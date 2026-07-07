import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { Badge } from "./Badge";
import BenchmarkPanel from "./BenchmarkPanel";

export default function Benchmark() {
  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <section className="relative py-10 md:py-16 border-b border-r border-l border-slate-200 dark:border-slate-900">
          {/* Shaded outer gutters (xl+) — the region between the section edges
              and the inner grid lines, tinted like the Architecture section. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[calc(50%-564px)] bg-indigo-50/40 xl:block dark:bg-indigo-950/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[calc(50%-564px)] bg-indigo-50/40 xl:block dark:bg-indigo-950/20"
          />
          {/* Top and bottom gutters — the py padding strips above/below the
              content cell, spanning only the content column so they don't
              double up with the full-height side shades. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[calc(50%-564px)] top-0 hidden h-16 bg-indigo-50/40 xl:block dark:bg-indigo-950/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[calc(50%-564px)] bottom-0 hidden h-16 bg-indigo-50/40 xl:block dark:bg-indigo-950/20"
          />

          {/* Inner grid lines — bound the 1128px content column, xl and up */}
          <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
          <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

          <div className="mx-auto w-full max-w-[1128px] px-6 xl:px-0">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
              {/* Header */}
              <div className="flex flex-col items-start text-left xl:pl-6">
                <Badge className="mb-5">Benchmark</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-4">
                  Elastic-quality{" "}
                  <span className="text-highlight-blink">performance</span>.
                </h2>
                <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 leading-relaxed">
                  Built on Tantivy, the Rust port of Lucene, ParadeDB keeps pace
                  with or pulls ahead of Elasticsearch on full text search.
                </p>

                <Link
                  href="/vs/elasticsearch"
                  className="group mt-8 inline-flex items-center gap-2 text-indigo-950 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  See the full comparison
                  <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Chart */}
              <div className="min-w-0">
                <BenchmarkPanel />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
