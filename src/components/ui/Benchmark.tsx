// Link + arrow used by the commented-out "See the full comparison" CTA below.
// import Link from "next/link";
// import { RiArrowRightLine } from "@remixicon/react";
import { Badge } from "./Badge";
import BenchmarkPanel from "./BenchmarkPanel";

export default function Benchmark() {
  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Diagonal-hatch divider introducing the section */}
        <div className="relative z-20 h-8 md:h-12 w-full bg-diagonal-hatch border border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />

        <section className="relative py-10 md:py-14 border-b border-r border-l border-slate-200 dark:border-slate-900 bg-indigo-50/60 dark:bg-indigo-950/20">
          {/* Inner grid lines — bound the 1128px content column, xl and up */}
          <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
          <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

          <div className="mx-auto w-full max-w-[1128px] px-4 sm:px-12 xl:px-0">
            {/* Header, centered above the full-width card */}
            <div className="flex flex-col items-center text-center mb-8 md:mb-10">
              <Badge className="mb-5">Benchmark</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-4">
                Elastic-quality{" "}
                <span className="text-highlight-blink">performance</span>.
              </h2>
              <p className="max-w-2xl text-base sm:text-lg text-gray-800 dark:text-slate-300 leading-relaxed">
                Built on Tantivy, the Rust port of Lucene, ParadeDB goes
                toe-to-toe with Elasticsearch on full text search, often coming
                out on top.
              </p>
              {/* Hidden until the /vs/elasticsearch page ships
              <Link
                href="/vs/elasticsearch"
                className="group mt-8 inline-flex items-center gap-2 text-indigo-950 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                See the full comparison
                <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              */}
            </div>

            {/* Full-width benchmark card */}
            <BenchmarkPanel />
          </div>
        </section>
      </div>
    </div>
  );
}
