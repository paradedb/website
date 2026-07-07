import type { BenchmarkData } from "./BenchmarkChart";

/**
 * Head-to-head TopK benchmark numbers for ParadeDB vs Elasticsearch.
 *
 * A LIMIT 10 BM25 relevance search over the `text` (long comment/story body)
 * column of the Hacker News dataset (28M rows), from a single client in a
 * closed loop — the benchmarker exports of 2026-07-06, the same file served at
 * /benchmarks/topk_10_hn_text.json, so the raw download always matches these
 * figures. Percentiles are over the full latency sample; throughput is
 * completed queries / wall-clock duration (QPS).
 */

export type ThroughputRow = { label: string; us: number; them: number };

/** Queries per second (completed / wall-clock) per term shape. */
export const elasticsearchThroughput: ThroughputRow[] = [
  { label: "Single term", us: 331, them: 346 },
  { label: "Two terms", us: 134, them: 106 },
  { label: "Three terms", us: 130, them: 94 },
  { label: "Multi-term", us: 68, them: 59 },
];

/** A point on a latency CDF: [latency ms, cumulative % of queries ≤ it]. */
export type CdfPoint = [number, number];

/** Latency CDF per term shape, ParadeDB vs Elasticsearch. */
export type TermCdf = {
  /** Tab label, e.g. "2 terms" */
  term: string;
  /** Representative `$1` term bound into the query, e.g. "rust arc" */
  example: string;
  /** x-axis cap in ms (~p99), so tail outliers don't flatten the curve */
  axisMax: number;
  us: CdfPoint[];
  them: CdfPoint[];
};

/**
 * Empirical latency CDF per term shape, computed directly from the raw exports
 * in /public/benchmarks (single client, closed loop, 2026-07-06). Each point is
 * [latency ms, % of queries at or below]. ParadeDB's curve sitting left of
 * Elasticsearch's = more queries done sooner. The p90/p95 the bar view shows are
 * read straight off these points.
 */
export const elasticsearchCdf: TermCdf[] = [
  {
    term: "1 term",
    example: "privacy",
    axisMax: 13.28,
    us: [
      [1.89, 0],
      [2.01, 2],
      [2.05, 5],
      [2.09, 10],
      [2.13, 15],
      [2.18, 20],
      [2.24, 25],
      [2.3, 30],
      [2.38, 35],
      [2.45, 40],
      [2.51, 45],
      [2.56, 50],
      [2.6, 55],
      [2.65, 60],
      [2.7, 65],
      [2.76, 70],
      [2.85, 75],
      [2.97, 80],
      [3.12, 85],
      [3.3, 88],
      [4.33, 90],
      [4.65, 92],
      [5.39, 94],
      [6.09, 95],
      [6.3, 96],
      [6.46, 97],
      [11.37, 98],
      [11.53, 99],
    ],
    them: [
      [1.63, 0],
      [1.77, 2],
      [1.81, 5],
      [1.86, 10],
      [1.9, 15],
      [1.93, 20],
      [1.95, 25],
      [1.97, 30],
      [1.99, 35],
      [2.01, 40],
      [2.02, 45],
      [2.04, 50],
      [2.06, 55],
      [2.07, 60],
      [2.09, 65],
      [2.12, 70],
      [2.14, 75],
      [2.18, 80],
      [2.25, 85],
      [2.35, 88],
      [5.25, 90],
      [6.38, 92],
      [9.42, 94],
      [9.98, 95],
      [10.21, 96],
      [10.36, 97],
      [13.14, 98],
      [13.28, 99],
    ],
  },
  {
    term: "2 terms",
    example: "rust arc",
    axisMax: 32.97,
    us: [
      [2.68, 0],
      [2.88, 2],
      [3.02, 5],
      [3.21, 10],
      [3.33, 15],
      [3.47, 20],
      [4.36, 25],
      [4.72, 30],
      [4.87, 35],
      [5.19, 40],
      [5.64, 45],
      [6.05, 50],
      [6.41, 55],
      [6.64, 60],
      [6.93, 65],
      [8.23, 70],
      [9.17, 75],
      [9.86, 80],
      [10.44, 85],
      [11.38, 88],
      [11.54, 90],
      [11.78, 92],
      [13.65, 94],
      [16.96, 95],
      [20.06, 96],
      [20.35, 97],
      [32.7, 98],
      [32.97, 99],
    ],
    them: [
      [3.23, 0],
      [3.46, 2],
      [3.66, 5],
      [4.32, 10],
      [4.48, 15],
      [4.67, 20],
      [5.52, 25],
      [5.84, 30],
      [6.33, 35],
      [6.67, 40],
      [7.41, 45],
      [8.24, 50],
      [8.76, 55],
      [9.36, 60],
      [10.14, 65],
      [10.98, 70],
      [13.04, 75],
      [13.32, 80],
      [14.58, 85],
      [16.05, 88],
      [16.5, 90],
      [16.86, 92],
      [17.11, 94],
      [17.56, 95],
      [17.82, 96],
      [18.06, 97],
      [27.36, 98],
      [27.52, 99],
    ],
  },
  {
    term: "3 terms",
    example: "rust arc clone",
    axisMax: 23.25,
    us: [
      [3.58, 0],
      [3.73, 2],
      [3.85, 5],
      [4.24, 10],
      [4.43, 15],
      [4.79, 20],
      [4.94, 25],
      [5.15, 30],
      [5.48, 35],
      [6.25, 40],
      [6.78, 45],
      [6.99, 50],
      [7.6, 55],
      [7.98, 60],
      [8.5, 65],
      [9.04, 70],
      [9.28, 75],
      [9.67, 80],
      [10.77, 85],
      [11.43, 88],
      [12.45, 90],
      [12.93, 92],
      [14.3, 94],
      [14.67, 95],
      [14.8, 96],
      [14.97, 97],
      [16.66, 98],
      [16.76, 99],
    ],
    them: [
      [4.06, 0],
      [4.28, 2],
      [4.54, 5],
      [4.98, 10],
      [5.46, 15],
      [5.67, 20],
      [6.08, 25],
      [6.39, 30],
      [6.61, 35],
      [7.13, 40],
      [8.22, 45],
      [9.84, 50],
      [10.96, 55],
      [11.47, 60],
      [12.27, 65],
      [13.54, 70],
      [13.9, 75],
      [14.13, 80],
      [15.1, 85],
      [18.26, 88],
      [18.48, 90],
      [18.81, 92],
      [19.99, 94],
      [20.69, 95],
      [21.02, 96],
      [21.26, 97],
      [22.99, 98],
      [23.25, 99],
    ],
  },
];

/**
 * Full BenchmarkData for the /vs/elasticsearch comparison page — the `text`
 * column figures, including box (p5/p25/p50/p75/p95) latency stats.
 */
export const elasticsearchBenchmark: BenchmarkData = {
  subhead:
    "A LIMIT 10 TopK relevance search over a slice of the Hacker News archive, ordered by BM25 score and run from a single client in a closed loop. Everything is held constant except the term shape.",
  metrics: [
    {
      key: "throughput",
      label: "Throughput",
      unit: "QPS",
      hint: "higher is better",
      rows: elasticsearchThroughput,
    },
    {
      key: "latency",
      kind: "box",
      label: "Latency",
      unit: "ms",
      hint: "lower is better",
      lowerIsBetter: true,
      decimals: 2,
      summary: { box: "p25–p75", line: "p50", whisker: "p5–p95" },
      rows: [
        {
          label: "Single term",
          us: { low: 2.05, q1: 2.24, med: 2.56, q3: 2.85, high: 6.09 },
          them: { low: 1.81, q1: 1.95, med: 2.04, q3: 2.14, high: 9.98 },
        },
        {
          label: "Two terms",
          us: { low: 3.02, q1: 4.36, med: 6.05, q3: 9.17, high: 16.96 },
          them: { low: 3.66, q1: 5.52, med: 8.24, q3: 13.04, high: 17.56 },
        },
        {
          label: "Three terms",
          us: { low: 3.85, q1: 4.94, med: 6.99, q3: 9.28, high: 14.67 },
          them: { low: 4.54, q1: 6.08, med: 9.84, q3: 13.9, high: 20.69 },
        },
        {
          label: "Multi-term",
          us: { low: 4.7, q1: 5.9, med: 11.71, q3: 18.76, high: 37.7 },
          them: { low: 4.95, q1: 8, med: 19.08, q3: 23.9, high: 31.21 },
        },
      ],
    },
  ],
  source: {
    href: "/blog/paradedb-vs-elasticsearch",
    label: "Full methodology and benchmark detail",
  },
  footnote:
    "Measured on ParadeDB 0.24.1 and Elasticsearch 8.17 on identical hardware, taken from the second run after JVM warmup over a rotating pool of 50 queries.",
};
