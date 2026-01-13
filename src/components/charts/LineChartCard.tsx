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
          fill: #374151 !important;
        }
        .dark .recharts-cartesian-axis-tick-value {
          fill: #d1d5db !important;
        }
        .recharts-cartesian-axis-line,
        .recharts-cartesian-axis-tick-line {
          stroke: #9ca3af !important;
        }
        .dark .recharts-cartesian-axis-line,
        .dark .recharts-cartesian-axis-tick-line {
          stroke: #6b7280 !important;
        }
        @media (max-width: 768px) {
          .recharts-cartesian-axis-tick-value {
            font-size: 10px !important;
          }
          .recharts-xAxis .recharts-cartesian-axis-tick-value {
            font-size: 9px !important;
          }
          .recharts-yAxis .recharts-cartesian-axis-tick-value {
            font-size: 10px !important;
          }
          .recharts-legend-wrapper {
            padding-top: 0.5rem !important;
            margin-top: 0.25rem !important;
          }
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

  const responsiveYAxisWidth = isMobile ? Math.min(yAxisWidth, 50) : yAxisWidth;
  const responsiveMinHeight = isMobile ? "280px" : "384px";

  return (
    <Card
      className={className || "relative text-center"}
      suppressHydrationWarning
    >
      <Subtitle>
        <Bold>{title}</Bold>
      </Subtitle>
      <div
        className="overflow-visible pb-4"
        style={{ minHeight: responsiveMinHeight }}
      >
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
            yAxisWidth={responsiveYAxisWidth}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            showXAxis={showXAxis}
          />
        )}
      </div>
    </Card>
  );
}
