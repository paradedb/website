"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    engine: "ParadeDB TopK",
    timeMs: 300,
    label: "300 ms",
  },
  {
    engine: "Postgres GIN TopK",
    timeMs: 33000,
    label: "33,000 ms",
  },
];

export default function TopKComparisonChart() {
  return (
    <div className="topk-comparison-chart my-6 p-2 sm:p-4 bg-transparent">
      <h3 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-100">
        Top K Query Time: ParadeDB vs Postgres GIN
      </h3>
      <div className="mt-4 h-72 w-full select-none pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 24, right: 8, left: 8, bottom: 8 }}
            accessibilityLayer={false}
          >
            <CartesianGrid
              stroke="var(--topk-grid)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="engine"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--topk-tick)", fontSize: 14 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                `${value.toLocaleString("en-US")} ms`
              }
              tick={{ fill: "var(--topk-tick)", fontSize: 12 }}
              width={90}
            />
            <Bar
              dataKey="timeMs"
              fill="var(--topk-bar)"
              radius={[0, 0, 0, 0]}
              isAnimationActive={false}
              activeBar={false}
            >
              <LabelList
                dataKey="label"
                position="top"
                fill="var(--topk-label)"
                fontSize={12}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <style jsx global>{`
        .topk-comparison-chart {
          --topk-grid: #cbd5e1;
          --topk-tick: #475569;
          --topk-bar: #4f46e5;
          --topk-label: #4338ca;
        }
        .dark .topk-comparison-chart {
          --topk-grid: #334155;
          --topk-tick: #cbd5e1;
          --topk-bar: #6366f1;
          --topk-label: #a5b4fc;
        }
        .topk-comparison-chart .recharts-wrapper:focus,
        .topk-comparison-chart .recharts-wrapper:focus-visible,
        .topk-comparison-chart .recharts-surface:focus,
        .topk-comparison-chart .recharts-surface:focus-visible,
        .topk-comparison-chart .recharts-layer:focus,
        .topk-comparison-chart .recharts-layer:focus-visible,
        .topk-comparison-chart .recharts-rectangle:focus,
        .topk-comparison-chart .recharts-rectangle:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .topk-comparison-chart .recharts-wrapper,
        .topk-comparison-chart .recharts-surface {
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
