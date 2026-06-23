import { Badge } from "./Badge";

export default function Architecture() {
  const dotShadowStyle = {
    backgroundImage: "radial-gradient(circle, #94a3b8 1.6px, transparent 2px)",
    backgroundSize: "5px 5px",
    opacity: 0.85,
  };

  const tableBox = (
    <div className="relative">
      <div
        className="absolute top-0 left-0 -right-2.5 -bottom-2.5"
        aria-hidden="true"
        style={dotShadowStyle}
      />
      <div className="relative border-2 border-slate-500 dark:border-slate-500 bg-white dark:bg-slate-900 px-5 py-3">
        <span className="font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap text-sm sm:text-base">
          Table (Heap)
        </span>
      </div>
    </div>
  );

  const indexBox = (
    <div className="relative">
      <div
        className="absolute top-0 left-0 -right-2.5 -bottom-2.5"
        aria-hidden="true"
        style={dotShadowStyle}
      />
      <div className="relative border-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-900 px-5 py-3 text-center">
        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap text-sm sm:text-base">
          ParadeDB Index
        </span>
      </div>
    </div>
  );

  const workloadLabels = ["Full-Text", "Vectors", "Aggregates"];
  const renderWorkloadBox = (label: string) => (
    <div key={label} className="relative">
      <div
        className="absolute top-0 left-0 -right-2.5 -bottom-2.5"
        aria-hidden="true"
        style={dotShadowStyle}
      />
      <div className="relative border-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-900 px-3 py-3 text-center">
        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap text-sm sm:text-base">
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
      className="text-indigo-600 dark:text-indigo-400"
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
      height="56"
      viewBox="0 0 14 56"
      fill="none"
      aria-hidden="true"
      className="text-slate-500 dark:text-slate-400"
    >
      <polygon points="7,0 2,10 12,10" fill="currentColor" />
      <line
        x1="7"
        y1="8"
        x2="7"
        y2="48"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon points="7,56 2,46 12,46" fill="currentColor" />
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
          <div className="px-4 sm:px-8 md:px-12 flex justify-center">
            <div className="w-full max-w-4xl pr-3 pb-3">
              <div
                role="img"
                aria-label="ParadeDB architecture: a table heap in Postgres and a ParadeDB index that serves full-text, vector, and aggregate queries."
                className="font-mono"
              >
                {/* PostgreSQL frame: label above, border around the whole diagram */}
                <span className="block font-mono text-sm font-bold text-slate-700 dark:text-slate-300 ml-6 mb-1">
                  PostgreSQL
                </span>
                <div className="border border-slate-400 dark:border-slate-600 p-5 sm:p-8 md:p-10">
                  {/* Mobile/tablet layout (< lg): vertical stack */}
                  <div className="lg:hidden flex flex-col items-stretch gap-3">
                    <div className="flex justify-center">{tableBox}</div>
                    <div className="flex justify-center">
                      {syncArrowVertical}
                    </div>
                    {indexBox}
                    <div className="flex justify-center">{downArrow}</div>
                    <div className="flex flex-col items-stretch gap-3">
                      {workloadLabels.map(renderWorkloadBox)}
                    </div>
                  </div>

                  {/* Desktop layout (lg+): horizontal grid */}
                  <div className="hidden lg:grid gap-x-6 items-center grid-cols-[auto_auto_1fr]">
                    {tableBox}
                    {syncArrowHorizontal}
                    {indexBox}
                    <div />
                    <div />
                    <div className="grid grid-cols-3 gap-6 mt-4 mb-1 justify-items-center">
                      {[1, 2, 3].map((i) => (
                        <span key={i} className="inline-flex">
                          {downArrow}
                        </span>
                      ))}
                    </div>
                    <div />
                    <div />
                    <div className="grid grid-cols-3 gap-6">
                      {workloadLabels.map(renderWorkloadBox)}
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
