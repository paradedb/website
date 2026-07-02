import type { BenchmarkData } from "./BenchmarkChart";

/**
 * Head-to-head TopK benchmark numbers for ParadeDB vs Elasticsearch.
 * Shared by the /vs/elasticsearch comparison page and the homepage benchmark
 * section so both surfaces render the exact same figures.
 */
export const elasticsearchBenchmark: BenchmarkData = {
  subhead:
    "A LIMIT 10 TopK relevance search over a slice of the Hacker News archive, ordered by BM25 score and run as a single virtual user in a closed loop. Everything is held constant except the term shape.",
  metrics: [
    {
      key: "throughput",
      label: "Throughput",
      unit: "QPS",
      hint: "higher is better",
      rows: [
        { label: "Single term", us: 277, them: 286 },
        { label: "Two terms", us: 129, them: 119 },
        { label: "Three terms", us: 115, them: 97 },
        { label: "Multi-term", us: 67, them: 59 },
      ],
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
          us: { low: 2.28, q1: 2.56, med: 2.99, q3: 3.32, high: 8.94 },
          them: { low: 1.98, q1: 2.19, med: 2.44, q3: 3.17, high: 9.6 },
        },
        {
          label: "Two terms",
          us: { low: 3.08, q1: 4.3, med: 6.2, q3: 9.33, high: 16.57 },
          them: { low: 3.4, q1: 4.91, med: 7.36, q3: 11.58, high: 15.44 },
        },
        {
          label: "Three terms",
          us: { low: 4.11, q1: 5.55, med: 8.28, q3: 10.22, high: 17.19 },
          them: { low: 4.35, q1: 5.94, med: 10.08, q3: 13.7, high: 20.25 },
        },
        {
          label: "Multi-term",
          us: { low: 4.89, q1: 6.41, med: 13.0, q3: 18.75, high: 39.74 },
          them: { low: 4.63, q1: 7.87, med: 18.36, q3: 24.63, high: 32.32 },
        },
      ],
    },
  ],
  source: {
    href: "/blog/paradedb-vs-elasticsearch",
    label: "Full methodology and benchmark detail",
  },
  footnote:
    "Measured on ParadeDB 0.24.0 and Elasticsearch 8.17 on identical hardware, taken from the second run after JVM warmup over a rotating pool of 50 queries.",
};

/** A point on a latency CDF: [latency ms, cumulative % of queries ≤ it]. */
export type CdfPoint = [number, number];

/** Latency CDF per term shape, ParadeDB 0.24.0 vs Elasticsearch. */
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
 * Empirical latency CDF per term shape, computed directly from the raw
 * benchmarker dashboard export (single-VU closed loop, HN TopK run of
 * 2026-06-10). Each point is [latency ms, % of queries completed at or below].
 * ParadeDB's curve sitting left of Elasticsearch's = more queries done sooner.
 */
export const elasticsearchCdfByTerm: TermCdf[] = [
  {
    term: "1 term",
    example: "privacy",
    axisMax: 16.0,
    us: [[2.17,0],[2.24,2],[2.28,5],[2.35,10],[2.43,15],[2.5,20],[2.56,25],[2.64,30],[2.77,35],[2.85,40],[2.92,45],[2.99,50],[3.04,55],[3.09,60],[3.14,65],[3.21,70],[3.32,75],[3.41,80],[3.51,85],[3.61,88],[5.84,90],[6.08,92],[7.23,94],[8.94,95],[9.1,96],[9.26,97],[15.86,98],[16.0,99]],
    them: [[1.74,0],[1.9,2],[1.98,5],[2.04,10],[2.1,15],[2.14,20],[2.19,25],[2.23,30],[2.28,35],[2.33,40],[2.38,45],[2.44,50],[2.51,55],[2.59,60],[2.7,65],[2.89,70],[3.17,75],[3.59,80],[4.67,85],[5.59,88],[6.19,90],[8.48,92],[9.26,94],[9.6,95],[9.94,96],[11.27,97],[12.17,98],[12.63,99]],
  },
  {
    term: "2 terms",
    example: "rust arc",
    axisMax: 32.59,
    us: [[2.88,0],[3.0,2],[3.08,5],[3.39,10],[3.57,15],[3.74,20],[4.3,25],[4.73,30],[4.96,35],[5.57,40],[5.97,45],[6.2,50],[6.47,55],[6.77,60],[7.87,65],[9.1,70],[9.34,75],[10.25,80],[10.67,85],[11.26,88],[13.23,90],[13.53,92],[16.19,94],[18.29,95],[19.92,96],[20.06,97],[32.44,98],[32.59,99]],
    them: [[2.96,0],[3.2,2],[3.4,5],[3.95,10],[4.11,15],[4.29,20],[4.94,25],[5.29,30],[5.73,35],[6.0,40],[6.63,45],[7.36,50],[7.75,55],[8.44,60],[9.1,65],[10.27,70],[11.58,75],[11.95,80],[12.92,85],[14.21,88],[14.58,90],[14.95,92],[15.2,94],[15.44,95],[15.66,96],[15.89,97],[24.53,98],[24.72,99]],
  },
  {
    term: "3 terms",
    example: "rust arc clone",
    axisMax: 22.4,
    us: [[3.5,0],[3.76,2],[4.11,5],[4.64,10],[4.94,15],[5.15,20],[5.56,25],[6.32,30],[6.68,35],[7.0,40],[7.81,45],[8.28,50],[8.59,55],[8.91,60],[9.37,65],[9.99,70],[10.22,75],[10.55,80],[12.15,85],[14.36,88],[15.06,90],[15.61,92],[16.38,94],[17.21,95],[17.73,96],[17.81,97],[18.12,98],[18.23,99]],
    them: [[3.85,0],[4.06,2],[4.35,5],[4.82,10],[5.2,15],[5.53,20],[5.94,25],[6.28,30],[6.44,35],[6.96,40],[8.35,45],[10.08,50],[10.63,55],[11.19,60],[12.06,65],[13.36,70],[13.7,75],[13.88,80],[17.23,85],[17.56,88],[18.03,90],[18.51,92],[19.91,94],[20.26,95],[20.45,96],[20.65,97],[22.24,98],[22.4,99]],
  },
];

/** A backend's smoothed log-density ridge (0..1 per bin) + percentile markers. */
export type RidgeSeries = {
  density: number[];
  p50: number;
  p90: number;
  p99: number;
};

/** Latency distribution ridgelines per term shape, ParadeDB vs Elasticsearch. */
export type TermRidge = {
  term: string;
  example: string;
  /** log10 x-domain bounds the density bins are spread across */
  lxmin: number;
  lxmax: number;
  /** ms tick values (nice 1/2/5 log ticks within the domain) */
  ticks: number[];
  us: RidgeSeries;
  them: RidgeSeries;
};

/**
 * Latency distributions as smoothed log-density ridgelines, computed from the
 * raw benchmarker samples (HN TopK run of 2026-06-10). Each `density` array is
 * a normalised histogram over log-spaced latency bins; markers are the real
 * p50/p90/p99. Mirrors the benchmarker dashboard's ridgeline view.
 */
export const elasticsearchRidgeByTerm: TermRidge[] = [
  { term: "1 term", example: "privacy", lxmin: 0.2228, lxmax: 1.2834, ticks: [2, 5, 10, 20],
    us: { density: [0.0,0.0,0.0,0.023,0.136,0.355,0.583,0.705,0.709,0.722,0.856,1.0,0.981,0.805,0.555,0.29,0.098,0.02,0.004,0.002,0.002,0.001,0.007,0.032,0.066,0.07,0.049,0.056,0.077,0.06,0.022,0.016,0.053,0.079,0.055,0.016,0.001,0.001,0.0,0.001,0.001,0.0,0.014,0.054,0.081,0.054,0.014,0.0], p50: 2.99, p90: 5.84, p99: 16.0 },
    them: { density: [0.034,0.125,0.314,0.588,0.847,0.984,0.971,0.842,0.65,0.462,0.327,0.257,0.219,0.186,0.153,0.122,0.091,0.072,0.071,0.082,0.087,0.077,0.069,0.071,0.078,0.077,0.061,0.04,0.024,0.017,0.02,0.043,0.078,0.101,0.097,0.069,0.041,0.04,0.061,0.068,0.048,0.023,0.011,0.007,0.004,0.002,0.001,0.0], p50: 2.44, p90: 6.19, p99: 12.63 } },
  { term: "2 terms", example: "rust arc", lxmin: 0.4417, lxmax: 1.5923, ticks: [5, 10, 20],
    us: { density: [0.261,0.499,0.616,0.703,0.779,0.664,0.462,0.426,0.517,0.595,0.598,0.548,0.599,0.807,1.0,0.945,0.646,0.384,0.316,0.367,0.489,0.618,0.678,0.731,0.724,0.498,0.218,0.139,0.163,0.125,0.101,0.141,0.136,0.092,0.118,0.161,0.112,0.032,0.002,0.0,0.0,0.0,0.027,0.107,0.162,0.11,0.03,0.002], p50: 6.2, p90: 13.23, p99: 32.59 },
    them: { density: [0.043,0.163,0.319,0.377,0.352,0.471,0.754,0.869,0.647,0.388,0.42,0.623,0.715,0.674,0.589,0.515,0.538,0.655,0.716,0.671,0.602,0.536,0.438,0.342,0.388,0.614,0.77,0.662,0.492,0.505,0.565,0.433,0.187,0.038,0.003,0.001,0.0,0.027,0.107,0.162,0.11,0.03,0.002,0.0,0.0,0.0,0.0,0.0], p50: 7.36, p90: 14.58, p99: 24.72 } },
  { term: "3 terms", example: "rust arc clone", lxmin: 0.5261, lxmax: 1.4295, ticks: [5, 10, 20],
    us: { density: [0.049,0.132,0.221,0.293,0.348,0.357,0.342,0.436,0.655,0.766,0.63,0.439,0.354,0.334,0.424,0.617,0.664,0.497,0.397,0.541,0.794,0.944,0.913,0.807,0.846,0.941,0.774,0.447,0.23,0.114,0.078,0.155,0.261,0.288,0.282,0.31,0.318,0.32,0.336,0.254,0.102,0.017,0.001,0.0,0.0,0.0,0.0,0.0], p50: 8.28, p90: 15.06, p99: 18.23 },
    them: { density: [0.0,0.015,0.075,0.174,0.295,0.412,0.436,0.378,0.394,0.503,0.572,0.579,0.654,0.818,0.867,0.708,0.512,0.38,0.234,0.112,0.146,0.272,0.281,0.18,0.201,0.409,0.629,0.706,0.63,0.5,0.508,0.796,1.0,0.692,0.219,0.041,0.12,0.307,0.438,0.426,0.383,0.354,0.295,0.218,0.125,0.038,0.003,0.0], p50: 10.08, p90: 18.03, p99: 22.4 } },
];
