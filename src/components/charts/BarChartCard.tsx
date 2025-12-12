"use client";

import { BarChart, Card, Subtitle, Bold } from "@tremor/react";
import { useEffect } from "react";

interface BarChartCardProps {
  title: string;
  data: Record<string, any>[];
  index: string;
  categories: string[];
  showLegend?: boolean;
  colors?: string[];
  layout?: "vertical" | "horizontal";
  yAxisWidth?: number;
  xAxisLabel?: string;
  className?: string;
}

let tooltipStyleAdded = false;

export function BarChartCard({
  title,
  data,
  index,
  categories,
  showLegend = false,
  colors = ["blue"],
  layout = "vertical",
  yAxisWidth = 100,
  xAxisLabel,
  className,
}: BarChartCardProps) {
  const hasHeight = className?.includes("h-");
  const heightClass =
    hasHeight && className ? className.match(/h-\d+/)?.[0] : undefined;
  const cardClassName =
    hasHeight && className
      ? className.replace(/h-\d+/, "").trim() || "text-center"
      : className || "text-center";

  useEffect(() => {
    if (!tooltipStyleAdded) {
      const style = document.createElement("style");
      style.id = "bar-chart-tooltip-style";
      style.textContent = `
        .recharts-tooltip-wrapper {
          background-color: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.375rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .recharts-tooltip-wrapper .recharts-tooltip-content {
          background-color: white !important;
        }
        .recharts-tooltip-wrapper .recharts-default-tooltip {
          background-color: white !important;
          border: none !important;
        }
        .recharts-cartesian-axis-tick-value {
          text-overflow: ellipsis !important;
          overflow: visible !important;
          white-space: nowrap !important;
        }
        .recharts-yAxis .recharts-cartesian-axis-tick-value {
          text-overflow: clip !important;
          overflow: visible !important;
          max-width: none !important;
        }
        .recharts-wrapper {
          overflow: visible !important;
        }
        .recharts-cartesian-axis {
          overflow: visible !important;
        }
      `;
      document.head.appendChild(style);
      tooltipStyleAdded = true;
    }
  }, []);

  return (
    <Card className={cardClassName}>
      <Subtitle>
        <Bold>{title}</Bold>
      </Subtitle>
      <div className="overflow-visible pl-1">
        <BarChart
          data={data}
          index={index}
          categories={categories}
          showLegend={showLegend}
          colors={colors}
          layout={layout}
          yAxisWidth={yAxisWidth}
          xAxisLabel={xAxisLabel}
          className={heightClass || "h-64"}
        />
      </div>
    </Card>
  );
}
