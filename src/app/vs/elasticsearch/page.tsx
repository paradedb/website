import type { Metadata } from "next";
import VsPage, { type VsConfig } from "@/components/vs/VsPage";
import { elasticsearchBenchmark } from "@/components/vs/elasticsearch-benchmark";

export const metadata: Metadata = {
  title: "Comparing ParadeDB and Elasticsearch",
  description:
    "An honest comparison of ParadeDB and Elasticsearch — where the index lives, how fresh the data is, and how you query it.",
  alternates: { canonical: "/vs/elasticsearch" },
};

const config: VsConfig = {
  competitor: {
    name: "Elasticsearch",
  },

  hero: {
    subhead:
      "Both technologies offer the same search primitives, but with very different architectures. Elasticsearch is a self-contained search engine that can be fed from many sources; ParadeDB brings the search engine into Postgres, next to your transactional data.",
  },

  techTable: {
    subhead:
      "A row-by-row look at where ParadeDB and Elasticsearch differ in practice, from the storage layer up to the operational surface.",
    rows: [
      {
        feature: "Primary store",
        us: "Postgres heap",
        them: "Lucene segments, sync'd from elsewhere",
      },
      {
        feature: "Data freshness",
        us: "Transactional, current rows",
        them: "Eventually consistent, pipeline lag",
      },
      {
        feature: "Query language",
        us: "SQL + search operators",
        them: "Query DSL (JSON) or translated SQL",
      },
      {
        feature: "Hybrid (BM25 + vector)",
        us: "Scored together in one query",
        them: "Two queries, fused in app code",
      },
      {
        feature: "Drivers",
        us: "Any Postgres driver or ORM",
        them: "REST + Elastic clients",
      },
      {
        feature: "Operational surface",
        us: "Your existing Postgres",
        them: "Separate cluster, JVM, shard tuning",
      },
      {
        feature: "Analytics UI",
        us: "Existing Postgres dashboards / BI",
        them: "Kibana",
      },
      {
        feature: "Maturity",
        us: "Younger project, growing OSS",
        them: "15+ years, vast ecosystem",
      },
    ],
  },

  benchmark: elasticsearchBenchmark,

  fits: {
    subhead:
      "There's no universal answer. The right one usually falls out of where your data already lives and what you're actually trying to build.",
    us: [
      "Your data already lives in Postgres and you'd rather keep it there.",
      "You need search results to reflect the latest writes without a pipeline in the middle.",
      "You want BM25 and vector signals scored together in a single query.",
      "You'd rather operate one database than a database plus a search cluster plus CDC.",
      "You want every existing Postgres driver, ORM, and BI tool to keep working.",
    ],
    them: [
      "Your workload is petabyte-scale log analytics or observability.",
      "Your data doesn't naturally fit a relational schema and doesn't originate in Postgres.",
      "You depend on Kibana dashboards or the Elastic security and observability stack.",
      "Your team is already deep on the Elastic stack and the operational maturity is the win.",
    ],
  },
};

export default function ElasticsearchVsPage() {
  return <VsPage config={config} />;
}
