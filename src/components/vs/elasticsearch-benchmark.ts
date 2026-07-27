/**
 * Head-to-head TopK benchmark numbers for ParadeDB vs Elasticsearch.
 *
 * A LIMIT 10 BM25 relevance search over the `text` (long comment/story body)
 * column of the Hacker News dataset (28M rows), fetching full documents
 * (`SELECT *` / `_source: ["*"]`), from a single client in a closed loop —
 * the benchmarker export of 2026-07-27, the same file served at
 * /benchmarks/topk_10_hn_text.json, so the raw download always matches these
 * figures.
 *
 * Percentiles are nearest-rank over the full latency sample: the smallest
 * observed value such that at least p% of queries are at or below it — the
 * same semantics as Postgres's percentile_disc and the benchmarker dashboard.
 * Every quoted latency was actually experienced by a query; nothing is
 * interpolated. Throughput is completed queries / (last - first request
 * timestamp), the same QPS convention as the rest of our published
 * benchmarks.
 */

export type ThroughputRow = { label: string; us: number; them: number };

/** Queries per second (completed / measured window) per term shape. */
export const elasticsearchThroughput: ThroughputRow[] = [
  { label: "Single term", us: 434, them: 488 },
  { label: "Two terms", us: 140, them: 113 },
  { label: "Three terms", us: 138, them: 103 },
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
 * Empirical latency CDF per term shape, computed directly from the raw export
 * in /public/benchmarks (single client, closed loop, 2026-07-27). Each point is
 * [latency ms, % of queries at or below]. Tabs are ordered 3 → 2 → 1 terms so
 * the multi-term shapes lead. ParadeDB's curve sitting left of Elasticsearch's
 * = more queries done sooner. The p50/p95 the bar view shows are read straight
 * off these points.
 */
export const elasticsearchCdf: TermCdf[] = [
  {
    term: "3 terms",
    example: "rust arc clone",
    axisMax: 21.39,
    us: [
      [3.31, 0],
      [3.43, 2],
      [3.72, 5],
      [3.99, 10],
      [4.23, 15],
      [4.49, 20],
      [4.64, 25],
      [4.82, 30],
      [5.02, 35],
      [5.37, 40],
      [6.01, 45],
      [6.34, 50],
      [6.9, 55],
      [7.43, 60],
      [7.95, 65],
      [8.33, 70],
      [8.69, 75],
      [9.48, 80],
      [11.62, 85],
      [12.22, 88],
      [12.67, 90],
      [13.07, 92],
      [14.15, 94],
      [14.22, 95],
      [14.35, 96],
      [14.46, 97],
      [14.59, 98],
      [14.73, 99],
    ],
    them: [
      [3.74, 0],
      [3.99, 2],
      [4.16, 5],
      [4.53, 10],
      [4.84, 15],
      [5.18, 20],
      [5.47, 25],
      [6.02, 30],
      [6.44, 35],
      [6.7, 40],
      [7.11, 45],
      [8.42, 50],
      [9.83, 55],
      [10.48, 60],
      [11.25, 65],
      [12.78, 70],
      [13.36, 75],
      [13.59, 80],
      [15.71, 85],
      [16.48, 88],
      [17.13, 90],
      [17.61, 92],
      [17.86, 94],
      [19.48, 95],
      [19.76, 96],
      [19.99, 97],
      [21.16, 98],
      [21.39, 99],
    ],
  },
  {
    term: "2 terms",
    example: "rust arc",
    axisMax: 31.82,
    us: [
      [2.43, 0],
      [2.64, 2],
      [2.77, 5],
      [2.9, 10],
      [3.0, 15],
      [3.12, 20],
      [3.99, 25],
      [4.39, 30],
      [4.54, 35],
      [4.99, 40],
      [5.31, 45],
      [5.65, 50],
      [6.03, 55],
      [6.23, 60],
      [6.57, 65],
      [8.04, 70],
      [8.88, 75],
      [9.43, 80],
      [9.88, 85],
      [10.94, 88],
      [11.94, 90],
      [13.08, 92],
      [14.22, 94],
      [19.01, 95],
      [19.36, 96],
      [19.55, 97],
      [31.59, 98],
      [31.82, 99],
    ],
    them: [
      [2.95, 0],
      [3.2, 2],
      [3.36, 5],
      [3.98, 10],
      [4.13, 15],
      [4.41, 20],
      [4.98, 25],
      [5.45, 30],
      [5.9, 35],
      [6.19, 40],
      [6.94, 45],
      [7.66, 50],
      [8.1, 55],
      [8.96, 60],
      [9.52, 65],
      [10.4, 70],
      [12.36, 75],
      [12.86, 80],
      [14.04, 85],
      [14.98, 88],
      [15.43, 90],
      [15.85, 92],
      [16.12, 94],
      [16.64, 95],
      [17.06, 96],
      [17.29, 97],
      [25.36, 98],
      [25.53, 99],
    ],
  },
  {
    term: "1 term",
    example: "rust",
    axisMax: 3.06,
    us: [
      [1.77, 0],
      [1.83, 2],
      [1.86, 5],
      [1.9, 10],
      [1.93, 15],
      [1.96, 20],
      [1.99, 25],
      [2.02, 30],
      [2.07, 35],
      [2.11, 40],
      [2.16, 45],
      [2.21, 50],
      [2.26, 55],
      [2.32, 60],
      [2.39, 65],
      [2.43, 70],
      [2.48, 75],
      [2.53, 80],
      [2.62, 85],
      [2.68, 88],
      [2.73, 90],
      [2.77, 92],
      [2.82, 94],
      [2.85, 95],
      [2.89, 96],
      [2.94, 97],
      [3.0, 98],
      [3.06, 99],
    ],
    them: [
      [1.63, 0],
      [1.71, 2],
      [1.77, 5],
      [1.82, 10],
      [1.85, 15],
      [1.87, 20],
      [1.89, 25],
      [1.91, 30],
      [1.93, 35],
      [1.95, 40],
      [1.96, 45],
      [1.98, 50],
      [1.99, 55],
      [2.01, 60],
      [2.03, 65],
      [2.04, 70],
      [2.06, 75],
      [2.08, 80],
      [2.11, 85],
      [2.13, 88],
      [2.14, 90],
      [2.16, 92],
      [2.19, 94],
      [2.21, 95],
      [2.23, 96],
      [2.27, 97],
      [2.33, 98],
      [2.44, 99],
    ],
  },
];
