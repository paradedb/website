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
              One <span className="text-highlight-blink">database</span>, three workloads.
            </h2>
            <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-4xl leading-relaxed">
	      Full-text search, vector retrieval, and aggregations are typically spread across separate indexes, engines, or even databases. ParadeDB is a single custom Postgres
  index that unifies all three.
            </p>
          </div>

          {/* Architecture diagram (text) */}
          <div className="px-4 sm:px-8 md:px-12 flex justify-center">
            <div className="overflow-x-auto">
              <div
                role="img"
                aria-label="ParadeDB architecture: a table heap in Postgres and a wide ParadeDB search index that serves full-text, vector, and aggregate queries."
                className="font-mono text-[10px] sm:text-[12px] md:text-[13px] leading-[1.5] text-slate-800 dark:text-slate-200 whitespace-pre inline-block text-left"
              >
{`         `}<span className="text-emerald-600 dark:text-emerald-400">┏━━ </span><span className="text-emerald-600 dark:text-emerald-400 font-semibold">PostgreSQL</span><span className="text-emerald-600 dark:text-emerald-400"> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓</span>{`
                                     `}<span className="text-indigo-600 dark:text-indigo-400">┏━━ </span><span className="text-indigo-600 dark:text-indigo-400 font-semibold">ParadeDB</span><span className="text-indigo-600 dark:text-indigo-400"> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓</span>{`


         `}<span className="text-emerald-600 dark:text-emerald-400">┏━━━━━━━━━━━━━━━━━━━┓</span>{`       `}<span className="text-indigo-600 dark:text-indigo-400">┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓</span>{`
         `}<span className="text-emerald-600 dark:text-emerald-400">┃</span>{`   `}<span className="font-semibold text-indigo-950 dark:text-white">Table (Heap)</span>{`    `}<span className="text-emerald-600 dark:text-emerald-400">┃</span><span className="text-slate-300 dark:text-slate-700">░</span>{`◄───► `}<span className="text-indigo-600 dark:text-indigo-400">┃</span>{`                     `}<span className="font-semibold text-indigo-950 dark:text-white">Wide Search Index</span>{`                    `}<span className="text-indigo-600 dark:text-indigo-400">┃</span><span className="text-slate-300 dark:text-slate-700">░</span>{`
         `}<span className="text-emerald-600 dark:text-emerald-400">┗━━━━━━━━━━━━━━━━━━━┛</span><span className="text-slate-300 dark:text-slate-700">░</span>{`      `}<span className="text-indigo-600 dark:text-indigo-400">┗━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┛</span><span className="text-slate-300 dark:text-slate-700">░</span>{`
          `}<span className="text-slate-300 dark:text-slate-700">░░░░░░░░░░░░░░░░░░░░░</span>{`                  ┃                 ┃                 ┃
                                                 ▼                 ▼                 ▼
                                         `}<span className="text-amber-600 dark:text-amber-400">┏━━━━━━━━━━━━━━┓</span>{`  `}<span className="text-amber-600 dark:text-amber-400">┏━━━━━━━━━━━━━━┓</span>{`  `}<span className="text-amber-600 dark:text-amber-400">┏━━━━━━━━━━━━━━┓</span>{`
                                         `}<span className="text-amber-600 dark:text-amber-400">┃</span>{`  `}<span className="font-semibold text-indigo-950 dark:text-white">Full-Text</span>{`   `}<span className="text-amber-600 dark:text-amber-400">┃</span><span className="text-slate-300 dark:text-slate-700">░</span>{` `}<span className="text-amber-600 dark:text-amber-400">┃</span>{`   `}<span className="font-semibold text-indigo-950 dark:text-white">Vectors</span>{`    `}<span className="text-amber-600 dark:text-amber-400">┃</span><span className="text-slate-300 dark:text-slate-700">░</span>{` `}<span className="text-amber-600 dark:text-amber-400">┃</span>{`  `}<span className="font-semibold text-indigo-950 dark:text-white">Aggregates</span>{`  `}<span className="text-amber-600 dark:text-amber-400">┃</span><span className="text-slate-300 dark:text-slate-700">░</span>{`
                                         `}<span className="text-amber-600 dark:text-amber-400">┗━━━━━━━━━━━━━━┛</span><span className="text-slate-300 dark:text-slate-700">░</span>{` `}<span className="text-amber-600 dark:text-amber-400">┗━━━━━━━━━━━━━━┛</span><span className="text-slate-300 dark:text-slate-700">░</span>{` `}<span className="text-amber-600 dark:text-amber-400">┗━━━━━━━━━━━━━━┛</span><span className="text-slate-300 dark:text-slate-700">░</span>{`
                                          `}<span className="text-slate-300 dark:text-slate-700">░░░░░░░░░░░░░░░░</span>{`  `}<span className="text-slate-300 dark:text-slate-700">░░░░░░░░░░░░░░░░</span>{`  `}<span className="text-slate-300 dark:text-slate-700">░░░░░░░░░░░░░░░░</span>
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
