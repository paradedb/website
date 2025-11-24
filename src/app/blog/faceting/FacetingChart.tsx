"use client";

import { Card, Title, BarChart } from "@tremor/react";

// Your faceting data
const rawData = [
  {
    query: "paradedb",
    results: 170,
    "Manual faceting": 15.558,
    "ParadeDB faceting": 30.885,
  },
  {
    query: "postgresql",
    results: 37877,
    "Manual faceting": 57.792,
    "ParadeDB faceting": 48.988,
  },
  {
    query: "rust",
    results: 224974,
    "Manual faceting": 124.811,
    "ParadeDB faceting": 65.828,
  },
  {
    query: "code",
    results: 1761136,
    "Manual faceting": 689.159,
    "ParadeDB faceting": 118.505,
  },
  {
    query: "we",
    results: 4597587,
    "Manual faceting": 1262.759,
    "ParadeDB faceting": 181.984,
  },
  {
    query: "the",
    results: 27733167,
    "Manual faceting": 7052.101,
    "ParadeDB faceting": 723.723,
  },
  {
    query: "<all results>",
    results: 45890978,
    "Manual faceting": 11849.004,
    "ParadeDB faceting": 1013.419,
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

      <BarChart
        data={chartData}
        index="queryLabel" 
        categories={["ParadeDB faceting", "Manual faceting"]}
        colors={["purple", "blue"]}
        valueFormatter={(n: number) =>
          `${Intl.NumberFormat("us").format(n)} ms`
        }
        marginTop="mt-6"
        layout="vertical"
        yAxisWidth={200}
        className="h-[500px]"
        customTooltip={CompactTooltip}
        showLegend={false} 
      />

      <div className="flex gap-6 justify-center mt-4 text-sm">
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
