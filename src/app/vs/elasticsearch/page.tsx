import type { Metadata } from "next";
import type { ReactNode } from "react";
import VsPage, { type VsConfig } from "@/components/vs/VsPage";
import VsBenchmarkPanel, {
  type VsBenchData,
} from "@/components/vs/VsBenchmarkPanel";
import VsBenchSummary from "@/components/vs/VsBenchSummary";
import benchmarkData from "@/components/vs/elasticsearch-benchmark-data.json";

export const metadata: Metadata = {
  title: "Comparing ParadeDB and Elasticsearch",
  description:
    "An honest comparison of ParadeDB and Elasticsearch: what they share at the engine level, where they differ architecturally, and which workloads each is built for.",
  alternates: { canonical: "/vs/elasticsearch" },
};

/** Inline code chip for identifiers in prose and table cells. */
function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] dark:bg-slate-800/70">
      {children}
    </code>
  );
}

/** Quiet inline link for table cells and prose. */
function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="underline decoration-slate-300 underline-offset-2 hover:text-indigo-600 hover:decoration-indigo-500 dark:decoration-slate-600 dark:hover:text-indigo-400"
    >
      {children}
    </a>
  );
}

const ES = "https://www.elastic.co/docs";
const DOCS = "https://docs.paradedb.com";

const config: VsConfig = {
  competitor: {
    name: "Elasticsearch",
  },

  hero: {
    subhead: (
      <>
        Elasticsearch is a mature, dedicated search engine you run as a separate
        system and feed from your data. ParadeDB puts a{" "}
        <A href="/learn/tantivy/introduction">Lucene-class engine</A> inside
        Postgres, so search runs next to your transactional tables with no
        second system to keep in sync. At the engine level the two have a lot in
        common; the differences are architectural, and each owns workloads the
        other doesn&apos;t.
      </>
    ),
  },

  techTable: {
    subhead:
      "They share the core search machinery: a real inverted index, BM25, WAND early termination, and native hybrid ranking. The differences are where the index lives, how fresh it stays, and which workloads each is built for.",
    rows: [
      {
        feature: "Where it runs",
        us: "In Postgres, alongside your transactional tables: one system",
        them: "A separate cluster you operate and feed, usually from a system of record",
      },
      {
        feature: "Data freshness",
        us: "Search sees the latest committed row; no sync step, no lag window",
        them: (
          <>
            <A href={`${ES}/manage-data/data-store/near-real-time-search`}>
              Near-real-time
            </A>{" "}
            inside ES (refresh, ~1s); fed from a database, the sync pipeline adds
            lag and a window where the two disagree
          </>
        ),
      },
      {
        feature: "Search engine",
        us: (
          <>
            <A href="/learn/tantivy/introduction">Tantivy</A> inverted index
            embedded in Postgres, with columnar fast fields and vectors in the
            same index
          </>
        ),
        them: "Lucene segments in a dedicated store",
      },
      {
        feature: "Relevance scoring",
        us: (
          <>
            <A href="/learn/search-concepts/bm25">BM25</A> with corpus statistics
          </>
        ),
        them: "BM25 with corpus statistics (Lucene)",
      },
      {
        feature: "Top K execution",
        us: (
          <>
            <A href="/learn/search-concepts/block-wand">Block-max WAND</A> early
            termination
          </>
        ),
        them: "Block-max WAND / MaxScore (Lucene)",
      },
      {
        feature: "Vectors & hybrid",
        us: (
          <>
            Dense and sparse vectors in the same index as BM25, fused with{" "}
            <A href="/learn/search-concepts/reciprocal-rank-fusion">RRF</A> over
            live rows
          </>
        ),
        them: (
          <>
            kNN and BM25 fused natively with{" "}
            <A href={`${ES}/reference/elasticsearch/rest-apis/reciprocal-rank-fusion`}>
              RRF retrievers
            </A>{" "}
            in one query, over its own copy of the data
          </>
        ),
      },
      {
        feature: "Filters & joins",
        us: (
          <>
            Filter on any column and <C>JOIN</C> results to live relational
            tables in SQL
          </>
        ),
        them: "Filter context in the index; joins are limited (denormalize, nested, or parent/child)",
      },
      {
        feature: "Aggregations / faceting",
        us: (
          <>
            <A href={`${DOCS}/documentation/aggregates/overview`}>
              <C>pdb.agg</C>
            </A>{" "}
            over columnar fast fields, in the same query
          </>
        ),
        them: "A deep, battle-tested aggregation framework: one of its real strengths",
      },
      {
        feature: "Query language",
        us: "SQL plus search operators",
        them: "Query DSL (JSON), ES|QL, or SQL",
      },
      {
        feature: "Transactions",
        us: "MVCC; search runs inside your ACID transactions",
        them: "No multi-document ACID transactions; near-real-time visibility model",
      },
      {
        feature: "Horizontal scale",
        us: "Scales with Postgres (primary plus read replicas); built to sit alongside operational data, not for petabyte log analytics",
        them: "Scales out across many nodes and shards to petabytes: its home ground",
      },
      {
        feature: "Operational surface",
        us: "Your existing Postgres",
        them: "A separate cluster: JVM heap, shard and replica tuning, plus the pipeline that feeds it",
      },
      {
        feature: "Ecosystem & tooling",
        us: "Every Postgres driver, ORM, and BI tool",
        them: "Kibana and the broader Elastic observability and security stack",
      },
      {
        feature: "Maturity",
        us: "Younger project, growing OSS",
        them: "15+ years, vast ecosystem",
      },
    ],
  },

  benchmark: {
    title: "Latency and throughput",
    panel: (
      <div className="flex flex-col gap-6">
        <VsBenchmarkPanel data={benchmarkData as VsBenchData} />
        <VsBenchSummary data={benchmarkData as VsBenchData} />
      </div>
    ),
  },
};

export default function ElasticsearchVsPage() {
  return <VsPage config={config} />;
}
