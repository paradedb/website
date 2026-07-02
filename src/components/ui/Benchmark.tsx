import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { Badge } from "./Badge";
import BenchmarkPanel from "./BenchmarkPanel";

export default function Benchmark() {
  return (
    <div className="w-full relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <section className="relative py-8 md:py-12 border-r border-l border-slate-200 dark:border-slate-900">
          {/* Header */}
          <div className="flex flex-col items-center text-center px-6 sm:px-12 mb-8 md:mb-10">
            <Badge className="mb-5">Benchmark</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-5xl mb-4 max-w-4xl">
              Elasticsearch speed, inside{" "}
              <span className="text-highlight-blink">Postgres</span>.
            </h2>
            <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-2xl leading-relaxed">
              A LIMIT 10 TopK relevance search over the Hacker News archive,
              ordered by BM25 score, on identical hardware. Across latency and
              throughput, ParadeDB runs level with a dedicated search engine on a
              single term, and pulls ahead as queries grow to two and three
              terms.
            </p>
          </div>

          {/* Chart */}
          <div className="px-4 md:px-12">
            <div className="max-w-3xl mx-auto">
              <BenchmarkPanel />
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/vs/elasticsearch"
                className="group inline-flex items-center gap-2 text-indigo-950 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                See the full ParadeDB vs Elasticsearch comparison
                <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
