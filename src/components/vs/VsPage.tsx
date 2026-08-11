import { ReactNode } from "react";
import { Badge } from "../ui/Badge";

export type VsConfig = {
  competitor: {
    /** Display name, e.g. "Elasticsearch" */
    name: string;
  };
  hero: {
    /** Subhead paragraph */
    subhead: ReactNode;
  };
  /** Side-by-side feature table */
  techTable: {
    /** Section subhead (optional) */
    subhead?: string;
    rows: { feature: ReactNode; us: ReactNode; them: ReactNode }[];
  };
  /** Optional head-to-head benchmark: a title, optional subhead, and the panel */
  benchmark?: { title?: string; subhead?: string; panel: ReactNode };
  /** Optional "which one fits when" — two columns */
  fits?: {
    /** Section subhead */
    subhead: string;
    us: string[];
    them: string[];
  };
};

const pixelShadow = (color: string) => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5'%3E%3Crect width='2' height='2' fill='%23${color}' fill-opacity='0.5'/%3E%3C/svg%3E")`,
  backgroundSize: "5px 5px",
  backgroundPosition: "calc(100% + 3px) calc(100% + 3px)",
});

const indigoShadowStyle = pixelShadow("4f46e5");
const slateShadowStyle = pixelShadow("64748b");

export default function VsPage({ config }: { config: VsConfig }) {
  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-12 md:pb-16 pr-4 md:pr-12">
      {/* ============ Header ============ */}
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          ParadeDB vs {config.competitor.name}
        </h1>
        {config.hero.subhead && (
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {config.hero.subhead}
          </p>
        )}
      </header>

      {/* ============ Benchmark (tabbed panel) ============ */}
      {config.benchmark && (
        <section>
          <div className="mb-8">
            <Badge className="mb-4">Benchmark</Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-indigo-950 dark:text-white mb-3">
              {config.benchmark.title ?? "Latency and throughput"}
            </h2>
            {config.benchmark.subhead && (
              <p className="text-base text-gray-800 dark:text-slate-300 leading-relaxed">
                {config.benchmark.subhead}
              </p>
            )}
          </div>
          {config.benchmark.panel}
        </section>
      )}

      {/* ============ Technical differences table ============ */}
      <section>
        <div className="mb-8">
          <Badge className="mb-4">Comparison</Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-indigo-950 dark:text-white mb-3">
            How they differ
          </h2>
          {config.techTable.subhead && (
            <p className="text-base text-gray-800 dark:text-slate-300 leading-relaxed">
              {config.techTable.subhead}
            </p>
          )}
        </div>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-4 sm:px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  &nbsp;
                </th>
                <th className="px-4 sm:px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 border-b border-l border-slate-200 dark:border-slate-800">
                  ParadeDB
                </th>
                <th className="px-4 sm:px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 border-b border-l border-slate-200 dark:border-slate-800">
                  {config.competitor.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {config.techTable.rows.map((row, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? "bg-white dark:bg-slate-950"
                      : "bg-slate-50/40 dark:bg-slate-900/30"
                  }
                >
                  <td className="px-4 sm:px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 align-top">
                    {row.feature}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300 border-t border-l border-slate-200 dark:border-slate-800 align-top">
                    {row.us}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-700 dark:text-slate-300 border-t border-l border-slate-200 dark:border-slate-800 align-top">
                    {row.them}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ Which fits when (two-column) ============ */}
      {config.fits && (
        <section>
          <div className="mb-8">
            <Badge className="mb-4">Which fits when</Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-indigo-950 dark:text-white mb-3">
              Pick by your workload.
            </h2>
            <p className="text-base text-gray-800 dark:text-slate-300 max-w-2xl leading-relaxed">
              {config.fits.subhead}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <div
                className="absolute top-2.5 left-2.5 -right-2.5 -bottom-2.5"
                aria-hidden="true"
                style={indigoShadowStyle}
              />
              <div className="relative bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-500 p-6 h-full">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">
                  Reach for ParadeDB when
                </div>
                <ul className="space-y-3">
                  {config.fits.us.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed flex gap-3"
                    >
                      <span className="font-mono text-slate-400 dark:text-slate-600 select-none">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute top-2.5 left-2.5 -right-2.5 -bottom-2.5"
                aria-hidden="true"
                style={slateShadowStyle}
              />
              <div className="relative bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 p-6 h-full">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 mb-3">
                  Reach for {config.competitor.name} when
                </div>
                <ul className="space-y-3">
                  {config.fits.them.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed flex gap-3"
                    >
                      <span className="font-mono text-slate-400 dark:text-slate-600 select-none">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
