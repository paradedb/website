import React from "react";

const LEVELS = [
  [1, 2, 0, 3, 1],
  [2, 1, 4, 1, 0],
  [0, 2, 1, 2, 1],
  [2, 1, 2, 0, 1],
  [1, 4, 1, 2, 1],
];

const LEVEL_CLASSES = [
  "fill-slate-200 dark:fill-slate-800",
  "fill-[#9be9a8] dark:fill-[#0e4429]",
  "fill-[#40c463] dark:fill-[#006d32]",
  "fill-[#30a14e] dark:fill-[#26a641]",
  "fill-[#216e39] dark:fill-[#39d353]",
];

const CELL = 6;
const GAP = 2;
const SIZE = 5 * CELL + 4 * GAP;

export default function ContributionHeatmap(
  props: React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {LEVELS.flatMap((row, y) =>
        row.map((level, x) => (
          <rect
            key={`${x}-${y}`}
            x={x * (CELL + GAP)}
            y={y * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={1.5}
            className={LEVEL_CLASSES[level]}
          />
        )),
      )}
    </svg>
  );
}
