import Image from "next/image";
import { Badge } from "./Badge";

export default function Architecture() {
  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Top hatched border */}
        <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />

        <section className="relative py-14 md:py-20 border-r border-l border-slate-200 dark:border-slate-900 bg-indigo-50/40 dark:bg-indigo-950/20">
          {/* Header */}
          <div className="flex flex-col items-center text-center px-6 sm:px-12 mb-10 md:mb-14">
            <Badge className="mb-6">Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-5 max-w-4xl">
              One <span className="text-highlight-blink">index</span>, three workloads.
            </h2>
            <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-4xl leading-relaxed">
              Most systems spread full-text search, vector retrieval, and aggregations
              across separate indexes, engines, or even databases. ParadeDB plans and executes all three together against a single wide Postgres index, allowing them to be optimized as a single operation.
            </p>
          </div>

          {/* Architecture diagram */}
          <div className="px-4 sm:px-8 md:px-12 flex justify-center">
            <div className="w-full max-w-3xl">
              <Image
                src="/architecture-v2.png"
                alt="ParadeDB architecture: a table heap in Postgres paired with a wide ParadeDB search index that serves full-text, vector, and aggregate queries."
                width={2400}
                height={1260}
                className="w-full h-auto rounded-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Bottom hatched border */}
        <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
      </div>
    </div>
  );
}
