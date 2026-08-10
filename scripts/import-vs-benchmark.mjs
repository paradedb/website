#!/usr/bin/env node
// Convert a ParadeDB benchmarker dashboard export into the data module the
// /vs benchmark panel renders, plus a compact public summary JSON for the
// "download the data" link.
//
// Usage:
//   node scripts/import-vs-benchmark.mjs bench-data/pdb-vs-fts-closed-2026-08-05.json
//
// Scenario names are expected in pdb-vs-fts.js / pdb-vs-es.js form:
//   {backend}_{workload}[_{field}][_l{limit}][_{terms}]_{c|r}{load}
//   e.g. paradedb_topk_title_l10_one_c4, fts_count_text_one_c1
// The competitor (fts or es) is detected from the scenario names and picks
// the output paths and environment blurb.
//
// Cells the matrix expects but the export lacks (every query timed out, so
// no latency was recorded) are emitted with n=0 and timedOut=true.
//
// Percentiles are nearest-rank (percentile_disc semantics): the smallest
// observed value such that at least p% of samples are at or below it.

import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const SCENARIO_RE =
  /^(paradedb|fts|es)_(topk|filtered_range|filtered_literal|count)_(title|text)(?:_l(\d+))?(?:_(one|two|five|ten))?_(c|r)(\d+)$/;

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("usage: import-vs-benchmark.mjs <dashboard.json> [more.json...]");
  process.exit(1);
}

const COMPETITORS = {
  fts: {
    name: "Postgres FTS",
    outModule: "src/components/vs/postgres-benchmark-data.json",
    outPublic: "public/benchmarks/pdb-vs-fts.json",
    them: "Postgres 18, tsvector stored generated columns, GIN + btree",
    note: [
      "ParadeDB (pg_search 0.24.1 on Postgres 18) ran against stock Postgres 18 full-text search in its best case: stored generated tsvector columns, a GIN index on each, and btree indexes for the filters.",
      "Both engines ran on identical hardware, four pinned CPUs and 8 GB of memory each, over the full 28.7-million-row Hacker News dataset, queried through pgbouncer in transaction pooling mode.",
      "Every workload below ran for 30 seconds against a rotating pool of 40 query terms, after an identical 30-second warmup, and any query that took longer than 30 seconds was cancelled.",
    ],
  },
  es: {
    name: "Elasticsearch",
    outModule: "src/components/vs/elasticsearch-benchmark-data.json",
    outPublic: "public/benchmarks/pdb-vs-es.json",
    them: "Elasticsearch 8.17, one shard, force-merged to a single segment",
    note: [
      "ParadeDB (pg_search 0.24.1 on Postgres 18) ran against Elasticsearch 8.17, force-merged to a single segment for its ideal read-only layout.",
      "Both engines ran on identical hardware, four pinned CPUs and 8 GB of memory each, over the full 28.7-million-row Hacker News dataset. ParadeDB was queried through pgbouncer in transaction pooling mode and Elasticsearch over its native HTTP client.",
      "Every workload below ran for 30 seconds against a rotating pool of 40 query terms, after an identical 30-second warmup, and any query that took longer than 30 seconds was cancelled.",
    ],
  },
};

function pct(sorted, p) {
  const idx = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx];
}

const round1 = (v) => Math.round(v * 10) / 10;

// Shared percentile grid for the distribution (CDF) view. Denser through the
// body and near the tail so the curve reads smoothly; stored once, each cell
// keeps only the latency at each step.
const CDF_PCTS = [
  0, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 88,
  90, 92, 94, 95, 96, 97, 98, 99,
];

const cells = new Map(); // key -> cell
const sources = [];

for (const file of args) {
  const doc = JSON.parse(readFileSync(file, "utf8"));
  sources.push(basename(file));
  for (const run of Object.values(doc.runs ?? {})) {
    for (const [name, q] of Object.entries(run.queries ?? {})) {
      if (name.startsWith("warm_")) continue; // warmup pass, not a result
      const m = name.match(SCENARIO_RE);
      if (!m) {
        console.warn(`skipping unrecognized scenario: ${name}`);
        continue;
      }
      const [, backend, workload, field, limit, terms, modelChar, load] = m;
      const lat = (q.latencies ?? []).slice().sort((a, b) => a - b);
      // Iterative min/max: spreading 100k+ timestamps overflows the stack.
      let secs = 0;
      if (q.timestamps && q.timestamps.length > 1) {
        let lo = Infinity;
        let hi = -Infinity;
        for (const t of q.timestamps) {
          if (t < lo) lo = t;
          if (t > hi) hi = t;
        }
        secs = (hi - lo) / 1000;
      }
      const cell = {
        backend,
        workload,
        field,
        limit: limit ? Number(limit) : null,
        terms: terms ?? null,
        model: modelChar === "c" ? "closed" : "open",
        load: Number(load), // connections (closed) or offered rps (open)
        n: lat.length,
        qps: lat.length > 1 && secs > 0 ? round1(lat.length / secs) : null,
        p50: lat.length ? round1(pct(lat, 50)) : null,
        p95: lat.length ? round1(pct(lat, 95)) : null,
        p99: lat.length ? round1(pct(lat, 99)) : null,
        max: lat.length ? round1(lat[lat.length - 1]) : null,
        // Latency at each CDF_PCTS step; null when nothing completed.
        cdf: lat.length ? CDF_PCTS.map((p) => round1(pct(lat, p))) : null,
        // No samples at all, or the median pinned at the FTS server-side
        // statement_timeout (30s), means the workload did not complete.
        timedOut: lat.length === 0 || pct(lat, 50) >= 29000,
      };
      const key = [
        cell.backend,
        cell.workload,
        cell.field,
        cell.limit,
        cell.terms,
        cell.model,
        cell.load,
      ].join("|");
      cells.set(key, cell);
    }
  }
}

const competitorKey = [...cells.values()].find((c) => c.backend !== "paradedb")?.backend;
const competitor = COMPETITORS[competitorKey];
if (!competitor) {
  console.error(`could not detect competitor from scenario names (saw: ${competitorKey})`);
  process.exit(1);
}

// Fill in expected-but-missing cells as timeouts so the panel can render an
// explicit DNF state instead of silently dropping the comparison.
const seenModels = new Set([...cells.values()].map((c) => c.model));
const seenLoads = (model) =>
  [...new Set([...cells.values()].filter((c) => c.model === model).map((c) => c.load))].sort(
    (a, b) => a - b,
  );

const expected = [];
for (const model of seenModels) {
  for (const load of seenLoads(model)) {
    for (const field of ["title", "text"])
      for (const limit of [10, 100])
        for (const terms of ["one", "two", "five", "ten"])
          expected.push({ workload: "topk", field, limit, terms, model, load });
    for (const workload of ["filtered_range", "filtered_literal"])
      expected.push({ workload, field: "text", limit: 10, terms: "one", model, load });
    for (const field of ["title", "text"])
      expected.push({ workload: "count", field, limit: null, terms: "one", model, load });
  }
}

for (const backend of ["paradedb", competitorKey]) {
  for (const e of expected) {
    const key = [backend, e.workload, e.field, e.limit, e.terms, e.model, e.load].join("|");
    if (!cells.has(key)) {
      cells.set(key, {
        backend,
        ...e,
        n: 0,
        qps: null,
        p50: null,
        p95: null,
        p99: null,
        max: null,
        cdf: null,
        timedOut: true,
      });
    }
  }
}

const out = {
  generated: new Date().toISOString().slice(0, 10),
  sources,
  competitor: { key: competitorKey, name: competitor.name },
  percentiles: CDF_PCTS,
  environment: {
    paradedb: "ParadeDB (pg_search 0.24.1, Postgres 18)",
    them: competitor.them,
    note: competitor.note,
  },
  termExamples: {
    one: "rust",
    two: "rust arc",
    five: "rust arc clone memory safety",
    ten: "rust arc clone memory safety borrow checker ownership lifetime rules",
  },
  cells: [...cells.values()].sort((a, b) =>
    [a.model, a.workload, a.field, a.limit, a.terms, a.load, a.backend]
      .join("|")
      .localeCompare([b.model, b.workload, b.field, b.limit, b.terms, b.load, b.backend].join("|")),
  ),
};

writeFileSync(competitor.outModule, JSON.stringify(out, null, 2) + "\n");
writeFileSync(competitor.outPublic, JSON.stringify(out) + "\n");

const byModel = {};
for (const c of out.cells) byModel[c.model] = (byModel[c.model] ?? 0) + 1;
console.log(
  `wrote ${out.cells.length} cells (${Object.entries(byModel)
    .map(([m, n]) => `${m}: ${n}`)
    .join(", ")}) -> ${competitor.outModule}, ${competitor.outPublic}`,
);
console.log(
  `timeouts: ${out.cells.filter((c) => c.timedOut).length} (all ${
    out.cells.filter((c) => c.timedOut && c.backend === "paradedb").length
  } paradedb)`,
);
