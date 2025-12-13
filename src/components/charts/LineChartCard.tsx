"use client";

import { Card, Subtitle, Bold } from "@tremor/react";
import { LineChart } from "@/components/LineChart";
import { AvailableChartColorsKeys } from "@/lib/chartUtils";
import { useEffect, useState } from "react";

interface LineChartCardProps {
  title: string;
  data: Record<string, any>[];
  index: string;
  categories: string[];
  showLegend?: boolean;
  colors?: AvailableChartColorsKeys[];
  yAxisWidth?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxis?: boolean;
  className?: string;
  alt: string;
  fallbackSrc?: string;
}

let lineChartStyleAdded = false;

export function LineChartCard({
  title,
  data,
  index,
  categories,
  showLegend = true,
  colors = ["amber", "blue"],
  yAxisWidth = 80,
  xAxisLabel,
  yAxisLabel,
  showXAxis = true,
  className,
  alt,
  fallbackSrc,
}: LineChartCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!lineChartStyleAdded) {
      const style = document.createElement("style");
      style.id = "line-chart-overlap-style";
      style.textContent = `
        .recharts-wrapper {
          overflow: visible !important;
        }
        .recharts-legend-wrapper {
          padding-top: 1rem !important;
          margin-top: 0.5rem !important;
        }
        .recharts-cartesian-axis {
          overflow: visible !important;
        }
        .recharts-tooltip-wrapper {
          z-index: 1000 !important;
        }
        .recharts-cartesian-axis-tick-value {
          text-overflow: ellipsis !important;
          overflow: visible !important;
          white-space: nowrap !important;
        }
      `;
      document.head.appendChild(style);
      lineChartStyleAdded = true;
    }
  }, []);

  const imageSrc =
    fallbackSrc ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23f9fafb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='16' fill='%236b7280'%3E" +
      encodeURIComponent(title) +
      "%3C/text%3E%3C/svg%3E";

  return (
    <Card
      className={className || "relative text-center"}
      suppressHydrationWarning
    >
      <Subtitle>
        <Bold>{title}</Bold>
      </Subtitle>
      <div className="overflow-visible pb-4" style={{ minHeight: "384px" }}>
        {!isMounted ? (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-96 object-contain"
            style={{ display: "block", width: "100%" }}
            aria-hidden="false"
            role="img"
          />
        ) : (
          <LineChart
            data={data}
            index={index}
            categories={categories}
            showLegend={showLegend}
            colors={colors}
            yAxisWidth={yAxisWidth}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            showXAxis={showXAxis}
          />
        )}
      </div>
    </Card>
  );
}
