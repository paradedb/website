"use client";

import { Card, Subtitle, Bold } from "@tremor/react";
import { LineChart } from "@/components/LineChart";
import { AvailableChartColorsKeys } from "@/lib/chartUtils";
import { useEffect } from "react";

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
}: LineChartCardProps) {
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

  return (
    <Card className={className || "relative text-center"}>
      <Subtitle>
        <Bold>{title}</Bold>
      </Subtitle>
      <div className="overflow-visible pb-4">
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
      </div>
    </Card>
  );
}
