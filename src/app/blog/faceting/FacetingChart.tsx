"use client";

import { Card, Title, BarChart } from "@tremor/react";
import { useState, useEffect } from "react";

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
    "ParadeDB faceting": 83.7,
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
    "Manual faceting": 15494.61,
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

interface FacetingChartProps {
  alt?: string;
  fallbackSrc?: string;
}

export default function FacetingChart({
  alt = "ParadeDB Faceting vs Manual Faceting Query Time in Milliseconds",
  fallbackSrc,
}: FacetingChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imageSrc =
    fallbackSrc ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23f9fafb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='16' fill='%236b7280'%3E" +
      encodeURIComponent(alt) +
      "%3C/text%3E%3C/svg%3E";

  return (
    <Card>
      <Title>
        ParadeDB Faceting vs Manual Faceting Query Time in Milliseconds
      </Title>

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 min-w-0">
          {!isMounted ? (
            <img
              src={imageSrc}
              alt={alt}
              className="w-full h-[400px] md:h-[500px] mt-6 object-contain"
              style={{ display: "block", width: "100%" }}
              aria-hidden="false"
              role="img"
            />
          ) : (
            <BarChart
              data={chartData}
              index="queryLabel"
              categories={[
                "ParadeDB faceting (MVCC off)",
                "ParadeDB faceting",
                "Manual faceting",
              ]}
              colors={["amber", "violet", "blue"]}
              valueFormatter={(n: number) =>
                `${Intl.NumberFormat("us").format(n)} ms`
              }
              layout="vertical"
              yAxisWidth={isMobile ? 120 : 200}
              className="h-[400px] md:h-[500px] mt-6"
              showTooltip={false}
              showLegend={false}
            />
          )}
        </div>

        <div className="w-full md:w-32 flex flex-row md:flex-col justify-start md:justify-around pt-3 md:pt-5 pb-3 md:pb-7 text-[10px] md:text-xs overflow-x-auto md:overflow-visible gap-3 md:gap-0 md:ml-4">
          {chartData.map((data) => (
            <div key={data.query} className="flex flex-col gap-0.5 md:gap-0.5 text-left min-w-[110px] md:min-w-0 shrink-0 md:shrink leading-tight">
              <div className="text-amber-600 font-medium md:font-medium">
                <span className="whitespace-nowrap">
                  {data["ParadeDB faceting (MVCC off)"].toFixed(0)} ms
                  {data["Manual faceting"] /
                    data["ParadeDB faceting (MVCC off)"] >=
                    1 && (
                    <span className="block md:inline md:ml-1">
                      {`(${(data["Manual faceting"] / data["ParadeDB faceting (MVCC off)"]).toFixed(1)}x faster)`}
                    </span>
                  )}
                </span>
              </div>
              <div className="text-violet-600 font-medium md:font-medium">
                <span className="whitespace-nowrap">
                  {data["ParadeDB faceting"].toFixed(0)} ms
                  {data["Manual faceting"] / data["ParadeDB faceting"] >= 1 && (
                    <span className="block md:inline md:ml-1">
                      {`(${(data["Manual faceting"] / data["ParadeDB faceting"]).toFixed(1)}x faster)`}
                    </span>
                  )}
                </span>
              </div>
              <div className="text-blue-600 font-medium md:font-medium">
                <span className="whitespace-nowrap">{data["Manual faceting"].toFixed(0)} ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center mt-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm bg-amber-500 shrink-0" />
          <span className="text-[11px] sm:text-sm">ParadeDB faceting (MVCC off)</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm bg-violet-500 shrink-0" />
          <span className="text-[11px] sm:text-sm">ParadeDB faceting</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm bg-blue-500 shrink-0" />
          <span className="text-[11px] sm:text-sm">Manual faceting</span>
        </div>
      </div>
    </Card>
  );
}
