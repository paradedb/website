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

        <section className="relative py-14 md:py-20 border-r border-l border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
          {/* Header */}
          <div className="flex flex-col items-center text-center px-6 sm:px-12 mb-10 md:mb-14">
            <Badge className="mb-6">Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-5 max-w-4xl">
              One <span className="text-highlight-blink">index</span>, three search workloads.
            </h2>
            <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-4xl leading-relaxed">
              We give you a single Postgres index containing the lexical,
              vector, and columnar data needed for search, retrieval, and
              aggregations.
              Queries are planned and executed efficently against
              the index, not stitched together across multiple systems.
            </p>
            <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-4xl leading-relaxed">
            </p>
          </div>

          {/* ASCII diagram */}
          <div className="px-4 sm:px-8 md:px-12 flex justify-center">
            <div className="overflow-x-auto">
              <div
                role="img"
                aria-label="ParadeDB architecture diagram"
                className="font-mono text-[11px] sm:text-[13px] md:text-[14px] leading-[1.5] text-slate-800 dark:text-slate-200 whitespace-pre inline-block text-left"
              >
{`                 `}<span className="text-indigo-700 dark:text-indigo-300 font-semibold">Your Application</span>{`
                         │
                         ▼  `}<span className="text-slate-500 dark:text-slate-500">SQL</span>{`
     ┌── `}<span className="text-indigo-700 dark:text-indigo-300 font-semibold">postgres</span>{` ──────────────────────────┐
     │                                      `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    ┌── `}<span className="text-indigo-950 dark:text-white font-semibold">heap</span>{` ────────────────────┐    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    │    table rows `}<span className="text-slate-500 dark:text-slate-500">[vanilla]</span>{`    │    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    └─────────────┬──────────────┘    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │                  │                   `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │                  ▼                   `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    ┌── `}<span className="text-indigo-950 dark:text-white font-semibold">single wide index</span>{` ───────┐    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    │  ◆ `}<span className="text-emerald-600 dark:text-emerald-400 font-semibold">BM25</span>{` `}<span className="text-slate-500 dark:text-slate-500">[full-text search]</span>{` │    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    │  ◆ `}<span className="text-amber-600 dark:text-amber-400 font-semibold">Vector</span>{` `}<span className="text-slate-500 dark:text-slate-500">[retrieval]</span>{`      │    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    │  ◆ `}<span className="text-sky-600 dark:text-sky-400 font-semibold">Columnar</span>{` `}<span className="text-slate-500 dark:text-slate-500">[aggregates]</span>{`   │    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │    └────────────────────────────┘    `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     │                                      `}<span className="text-slate-300 dark:text-slate-700">│░</span>{`
     └──────────────────────────────────────┘`}<span className="text-slate-300 dark:text-slate-700">░</span>{`
      `}<span className="text-slate-300 dark:text-slate-700">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span>
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
