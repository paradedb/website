#!/usr/bin/env node
// Convert a ParadeDB benchmarker dashboard export into the data module the
// /vs benchmark panel renders, plus a compact public summary JSON for the
// "download the data" link.
//
// Usage:
//   node scripts/import-vs-benchmark.mjs bench-data/pdb-vs-fts-closed-2026-08-05.json
//
// Scenario names are expected in pdb-vs-fts.js form:
//   {backend}_{workload}[_{field}][_l{limit}][_{terms}]_{c|r}{load}
//   e.g. paradedb_topk_title_l10_one_c4, fts_count_text_one_c1
//
// Cells the matrix expects but the export lacks (every query timed out, so
// no latency was recorded) are emitted with n=0 and timedOut=true.
//
// Percentiles are nearest-rank (percentile_disc semantics): the smallest
// observed value such that at least p% of samples are at or below it.

import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const SCENARIO_RE =
  /^(paradedb|fts)_(topk|filtered_range|filtered_literal|count)_(title|text)(?:_l(\d+))?(?:_(one|two|five|ten))?_(c|r)(\d+)$/;

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("usage: import-vs-benchmark.mjs <dashboard.json> [more.json...]");
  process.exit(1);
}

const OUT_MODULE = "src/components/vs/postgres-benchmark-data.json";
const OUT_PUBLIC = "public/benchmarks/pdb-vs-fts.json";

function pct(sorted, p) {
  const idx = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx];
}

const round1 = (v) => Math.round(v * 10) / 10;

const cells = new Map(); // key -> cell
const sources = [];

for (const file of args) {
  const doc = JSON.parse(readFileSync(file, "utf8"));
  sources.push(basename(file));
  for (const run of Object.values(doc.runs ?? {})) {
    for (const [name, q] of Object.entries(run.queries ?? {})) {
      const m = name.match(SCENARIO_RE);
      if (!m) {
        console.warn(`skipping unrecognized scenario: ${name}`);
        continue;
      }
      const [, backend, workload, field, limit, terms, modelChar, load] = m;
      const lat = (q.latencies ?? []).slice().sort((a, b) => a - b);
      const secs =
        q.timestamps && q.timestamps.length > 1
          ? (Math.max(...q.timestamps) - Math.min(...q.timestamps)) / 1000
          : 0;
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

for (const backend of ["paradedb", "fts"]) {
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
        timedOut: true,
      });
    }
  }
}

const out = {
  generated: new Date().toISOString().slice(0, 10),
  sources,
  competitor: { key: "fts", name: "Postgres FTS" },
  environment: {
    paradedb: "ParadeDB (pg_search 0.24.1, Postgres 18)",
    fts: "Postgres 18, tsvector stored generated columns, GIN + btree",
    note: "4 pinned CPUs and 8GB per engine, pgbouncer transaction pooling, Hacker News dataset (28.7M rows), rotating pool of 40 query terms, 30s per scenario, engines restarted before the run. FTS queries were capped by a 30s statement_timeout.",
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

writeFileSync(OUT_MODULE, JSON.stringify(out, null, 2) + "\n");
writeFileSync(OUT_PUBLIC, JSON.stringify(out) + "\n");

const byModel = {};
for (const c of out.cells) byModel[c.model] = (byModel[c.model] ?? 0) + 1;
console.log(
  `wrote ${out.cells.length} cells (${Object.entries(byModel)
    .map(([m, n]) => `${m}: ${n}`)
    .join(", ")}) -> ${OUT_MODULE}, ${OUT_PUBLIC}`,
);
console.log(
  `timeouts: ${out.cells.filter((c) => c.timedOut).length} (all ${
    out.cells.filter((c) => c.timedOut && c.backend === "paradedb").length
  } paradedb)`,
);
