"use client";

import { BarChart, Card, Subtitle, Bold } from "@tremor/react";
import { useEffect, useState } from "react";

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
  alt: string;
  fallbackSrc?: string;
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
  alt,
  fallbackSrc,
}: BarChartCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasHeight = className?.includes("h-");
  const heightClass =
    hasHeight && className ? className.match(/h-\d+/)?.[0] : undefined;
  const cardClassName =
    hasHeight && className
      ? className.replace(/h-\d+/, "").trim() || "text-center"
      : className || "text-center";

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
        }
      `;
      document.head.appendChild(style);
      tooltipStyleAdded = true;
    }
  }, []);

  const chartHeight = heightClass || "h-64";
  const responsiveYAxisWidth = isMobile ? Math.min(yAxisWidth, 60) : yAxisWidth;
  const imageSrc =
    fallbackSrc ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23f9fafb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='16' fill='%236b7280'%3E" +
      encodeURIComponent(title) +
      "%3C/text%3E%3C/svg%3E";

  return (
    <Card className={cardClassName} suppressHydrationWarning>
      <Subtitle>
        <Bold>{title}</Bold>
      </Subtitle>
      <div
        className={`overflow-visible pl-1 md:pl-1 ${chartHeight}`}
        style={{ position: "relative" }}
      >
        {!isMounted ? (
          <img
            src={imageSrc}
            alt={alt}
            className={`w-full ${chartHeight} object-contain`}
            style={{ display: "block", width: "100%" }}
            aria-hidden="false"
            role="img"
          />
        ) : (
          <BarChart
            data={data}
            index={index}
            categories={categories}
            showLegend={showLegend}
            colors={colors}
            layout={layout}
            yAxisWidth={responsiveYAxisWidth}
            xAxisLabel={xAxisLabel}
            className={chartHeight}
          />
        )}
      </div>
    </Card>
  );
}
