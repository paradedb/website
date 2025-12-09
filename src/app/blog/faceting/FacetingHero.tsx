"use client";

import { Card, Title, BarChart } from "@tremor/react";

// Your faceting data
const rawData = [
  {
    query: "<all results>",
    results: 45890979,
    "Manual faceting": 15494.610,
    "ParadeDB faceting": 1053.589,
    "ParadeDB faceting (MVCC off)": 363.436,
  },
];

// Compact tooltip shown on hover
/*
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
*/

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
            className="h-[200px] mt-6"
    showTooltip={false}
            showLegend={false}
          />
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
