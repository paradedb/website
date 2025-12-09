"use client";

import { Card, Title, BarChart } from "@tremor/react";

// Your faceting data
const rawData = [
  {
    query: "paradedb",
    results: 187,
    "Manual faceting": 34.048,
    "ParadeDB faceting": 43.931,
    "ParadeDB faceting (MVCC off)": 38.381,
  },
  {
    query: "postgresql",
    results: 40555,
    "Manual faceting": 96.441,
    "ParadeDB faceting": 83.700,
    "ParadeDB faceting (MVCC off)": 56.054,
  },
  {
    query: "rust",
    results: 227782,
    "Manual faceting": 189.307,
    "ParadeDB faceting": 106.681,
    "ParadeDB faceting (MVCC off)": 68.976,
  },
  {
    query: "code",
    results: 1774202,
    "Manual faceting": 846.589,
    "ParadeDB faceting": 158.421,
    "ParadeDB faceting (MVCC off)": 84.897,
  },
  {
    query: "we",
    results: 4741006,
    "Manual faceting": 1743.676,
    "ParadeDB faceting": 227.372,
    "ParadeDB faceting (MVCC off)": 108.334,
  },
  {
    query: "the",
    results: 27747459,
    "Manual faceting": 9694.884,
    "ParadeDB faceting": 798.913,
    "ParadeDB faceting (MVCC off)": 362.079,
  },
  {
    query: "<all results>",
    results: 45890979,
    "Manual faceting": 15494.610,
    "ParadeDB faceting": 1053.589,
    "ParadeDB faceting (MVCC off)": 363.436,
  },
];

// Compact tooltip shown on hover
function CompactTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border bg-white px-2 py-1 shadow-sm text-sm">
      <div className="font-medium">{label}</div>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.name}:</span>
          <span className="font-medium">
            {Intl.NumberFormat("us").format(item.value)} ms
          </span>
        </div>
      ))}
    </div>
  );
}

const chartData = rawData.map((d) => ({
  ...d,
  queryLabel: `${d.query} (${Intl.NumberFormat("us").format(
    d.results,
  )} results)`,
}));

export default function FacetingChart() {
  return (
    <Card>
      <Title>ParadeDB Faceting vs Manual Faceting Query Time in Milliseconds</Title>

      <div className="flex">
        <div className="flex-1">
          <BarChart
            data={chartData}
            index="queryLabel" 
            categories={["ParadeDB faceting (MVCC off)", "ParadeDB faceting", "Manual faceting"]}
            colors={["orange", "purple", "blue"]}
            valueFormatter={(n: number) =>
              `${Intl.NumberFormat("us").format(n)} ms`
            }
            layout="vertical"
            yAxisWidth={200}
            className="h-[500px] mt-6"
    showTooltip={false}
            showLegend={false}
          />
        </div>
        
        {/* Numbers displayed to the right of each bar */}
        <div className="w-32 flex flex-col justify-around pt-5 pb-7 text-xs">
          {chartData.map((data, index) => (
            <div key={data.query} className="flex flex-col gap-0.5 text-left">
              <div className="text-orange-600 font-medium">
                <span>
                  {data["ParadeDB faceting (MVCC off)"].toFixed(0)} ms
                  {(data["Manual faceting"] / data["ParadeDB faceting (MVCC off)"]) >= 1 && 
                    ` (${(data["Manual faceting"] / data["ParadeDB faceting (MVCC off)"]).toFixed(1)}x faster)`
                  }
                </span>
              </div>
              <div className="text-purple-600 font-medium">
                <span>
                  {data["ParadeDB faceting"].toFixed(0)} ms
                  {(data["Manual faceting"] / data["ParadeDB faceting"]) >= 1 && 
                    ` (${(data["Manual faceting"] / data["ParadeDB faceting"]).toFixed(1)}x faster)`
                  }
                </span>
              </div>
              <div className="text-blue-600 font-medium">
                <span>{data["Manual faceting"].toFixed(0)} ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6 justify-center mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-orange-500" />
          ParadeDB faceting (MVCC off)
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-purple-500" />
          ParadeDB faceting
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-blue-500" />
          Manual faceting
        </div>
      </div>
    </Card>
  );
}
