"use client";

import { Card, Title, BarChart } from "@tremor/react";
import { useState, useEffect } from "react";

let facetingChartStyleAdded = false;

const tremorColorMap: Record<string, string> = {
  amber: "#f59e0b",
  violet: "#8b5cf6",
  blue: "#3b82f6",
};

function CompactTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 px-2 py-1 shadow-sm text-sm">
      <div className="font-medium text-gray-900 dark:text-gray-100">
        {String(label)}
      </div>
      {payload.map((item: any) => (
        <div
          key={item.dataKey}
          className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: tremorColorMap[item.color] || item.color,
            }}
          />
          <span>{item.name}:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {Intl.NumberFormat("us").format(item.value)} ms
          </span>
        </div>
      ))}
    </div>
  );
}

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

function formatNumberShort(value: number) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs < 1000) return `${sign}${Math.round(abs)}`;
  if (abs < 1_000_000) return `${sign}${Math.round(abs / 1000)}K`;
  if (abs < 1_000_000_000) {
    const m = abs / 1_000_000;
    const s = m < 10 ? m.toFixed(1) : Math.floor(m).toString();
    return `${sign}${s.replace(/\.0$/, "")}M`;
  }
  const b = abs / 1_000_000_000;
  const s = b < 10 ? b.toFixed(1) : Math.floor(b).toString();
  return `${sign}${s.replace(/\.0$/, "")}B`;
}

function formatDuration(ms: number) {
  if (!Number.isFinite(ms)) return "";
  if (Math.abs(ms) <= 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  const out = Math.abs(s) < 10 ? s.toFixed(1) : s.toFixed(0);
  return `${out.replace(/\.0$/, "")}s`;
}

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
  const [activeBar, setActiveBar] = useState<any>(null);
  const [activeBarKey, setActiveBarKey] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (facetingChartStyleAdded) return;
    const style = document.createElement("style");
    style.id = "faceting-chart-mobile-axis-style";
    style.textContent = `
      /* Dark mode support for axis labels */
      .dark .faceting-chart .recharts-cartesian-axis-tick-value {
        fill: #d1d5db !important;
      }
      .dark .faceting-chart .recharts-cartesian-grid line {
        stroke: #374151 !important;
      }
      @media (max-width: 768px) {
        .faceting-chart {
          overflow: visible !important;
        }
        .faceting-chart .recharts-wrapper {
          margin-left: -12px !important;
        }
        .faceting-chart .recharts-cartesian-axis-tick-value {
          font-size: 9px !important;
          line-height: 1.1 !important;
        }
        .faceting-chart .recharts-xAxis .recharts-cartesian-axis-tick-value {
          font-size: 9px !important;
          line-height: 1.1 !important;
        }
        .faceting-chart .recharts-yAxis .recharts-cartesian-axis-tick-value {
          font-size: 9px !important;
          line-height: 1.1 !important;
        }
      }
    `;
    document.head.appendChild(style);
    facetingChartStyleAdded = true;
  }, []);

  const imageSrc =
    fallbackSrc ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23f9fafb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='16' fill='%236b7280'%3E" +
      encodeURIComponent(alt) +
      "%3C/text%3E%3C/svg%3E";

  const chartData = rawData.map((d) => {
    const mobileQuery = d.query === "<all results>" ? "<all>" : d.query;
    return {
      ...d,
      queryLabel: isMobile
        ? `${mobileQuery} (${formatNumberShort(d.results)})`
        : `${d.query} (${Intl.NumberFormat("us").format(d.results)} results)`,
    };
  });

  const mobileSelectedCategory =
    (activeBar?.categoryClicked as string | undefined) ||
    (activeBar?.dataKey as string | undefined) ||
    (activeBar?.category as string | undefined);
  const mobileSelectedLabel =
    (activeBar?.query as string | undefined) ||
    (activeBar?.queryLabel as string | undefined) ||
    (activeBar?.label as string | undefined);
  const mobileSelectedValue =
    typeof mobileSelectedCategory === "string"
      ? ((activeBar?.[mobileSelectedCategory] as number | undefined) ??
        (activeBar?.value as number | undefined))
      : (activeBar?.value as number | undefined);

  const mobileCategoryColorClass =
    mobileSelectedCategory === "ParadeDB faceting (MVCC off)"
      ? "bg-amber-500"
      : mobileSelectedCategory === "ParadeDB faceting"
        ? "bg-violet-500"
        : "bg-blue-500";

  return (
    <Card className="p-4 sm:p-6">
      <Title className="text-base sm:text-lg leading-snug">
        ParadeDB Faceting vs Manual Faceting Query Time in Milliseconds
      </Title>
      <div className="mt-1 text-[11px] text-gray-600 dark:text-gray-400 md:hidden">
        Tap a bar to see details
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 min-w-0 faceting-chart">
          {isMounted && isMobile && activeBar && (
            <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {mobileSelectedLabel}
                  </div>
                  <div className="mt-0.5 text-gray-700 dark:text-gray-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {mobileSelectedCategory && (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${mobileCategoryColorClass}`}
                        />
                        <span className="font-medium">
                          {mobileSelectedCategory}
                        </span>
                      </span>
                    )}
                    {typeof mobileSelectedValue === "number" && (
                      <span className="tabular-nums">
                        {formatDuration(mobileSelectedValue)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  className="shrink-0 rounded-md px-2 py-1 text-gray-500 dark:text-gray-400 active:text-gray-700 dark:active:text-gray-200"
                  onClick={() => {
                    setActiveBar(null);
                    setActiveBarKey("");
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {!isMounted ? (
            <img
              src={imageSrc}
              alt={alt}
              className="w-full h-[340px] md:h-[500px] mt-4 md:mt-6 object-contain"
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
                isMobile
                  ? formatDuration(n)
                  : `${Intl.NumberFormat("us").format(n)} ms`
              }
              layout="vertical"
              yAxisWidth={isMobile ? 56 : 200}
              padding={isMobile ? { left: 0, right: 8 } : undefined}
              className="h-[340px] md:h-[500px] mt-4 md:mt-6"
              showTooltip={!isMobile}
              showLegend={false}
              customTooltip={isMobile ? undefined : CompactTooltip}
              onValueChange={(v: any) => {
                if (!isMobile) return;
                const nextKey =
                  v && typeof v === "object"
                    ? `${v.categoryClicked ?? v.dataKey ?? v.category ?? ""}::${v.query ?? v.queryLabel ?? v.label ?? ""}`
                    : "";
                if (!v || nextKey === activeBarKey) {
                  setActiveBar(null);
                  setActiveBarKey("");
                  return;
                }
                setActiveBar(v);
                setActiveBarKey(nextKey);
              }}
            />
          )}
        </div>

        {!isMobile && (
          <div className="hidden md:flex w-full md:w-32 flex-row md:flex-col justify-start md:justify-around pt-3 md:pt-5 pb-3 md:pb-7 text-[10px] md:text-xs overflow-x-auto md:overflow-visible gap-3 md:gap-0 md:ml-4">
            {chartData.map((data) => (
              <div
                key={data.query}
                className="flex flex-col gap-0.5 md:gap-0.5 text-left min-w-[110px] md:min-w-0 shrink-0 md:shrink leading-tight"
              >
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
                    {data["Manual faceting"] / data["ParadeDB faceting"] >=
                      1 && (
                      <span className="block md:inline md:ml-1">
                        {`(${(data["Manual faceting"] / data["ParadeDB faceting"]).toFixed(1)}x faster)`}
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-blue-600 font-medium md:font-medium">
                  <span className="whitespace-nowrap">
                    {data["Manual faceting"].toFixed(0)} ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:text-sm">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-sm bg-amber-500 shrink-0" />
          <span>ParadeDB faceting (MVCC off)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-sm bg-violet-500 shrink-0" />
          <span>ParadeDB faceting</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-sm bg-blue-500 shrink-0" />
          <span>Manual faceting</span>
        </div>
      </div>
    </Card>
  );
}
