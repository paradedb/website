import type { Metadata } from "next";
import VsPage, { type VsConfig } from "@/components/vs/VsPage";
import VsBenchmarkPanel, {
  type VsBenchData,
} from "@/components/vs/VsBenchmarkPanel";
import VsBenchSummary from "@/components/vs/VsBenchSummary";
import benchmarkData from "@/components/vs/postgres-benchmark-data.json";
import type { ReactNode } from "react";

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

const PG = "https://www.postgresql.org/docs/current";
const DOCS = "https://paradedb.com/docs";

export const metadata: Metadata = {
  title: "Comparing ParadeDB and Postgres Full-Text Search",
  description:
    "An honest comparison of ParadeDB and Postgres full-text search: how each one ranks, executes Top K, filters, and counts, and where stock FTS stops scaling.",
  alternates: { canonical: "/vs/postgresql" },
};

const config: VsConfig = {
  competitor: {
    name: "Postgres FTS",
  },

  hero: {
    subhead: (
      <>
        ParadeDB is Postgres, so this comparison is really about the search
        machinery. Postgres ships{" "}
        <A href={`${PG}/textsearch.html`}>
          <C>tsvector</C> and GIN
        </A>
        , and that is exactly what every managed Postgres (RDS, Cloud SQL,
        Azure, Supabase, Neon) bundles as search. ParadeDB replaces that
        machinery with a{" "}
        <A href={`${DOCS}/welcome/architecture`}>dedicated search engine</A>{" "}
        living in the same database.
      </>
    ),
  },

  techTable: {
    subhead:
      "Stock FTS is real search: parsing, stemming, indexes. The gap opens at ranking quality, and at how each side executes Top K, filters, and counts once the corpus stops being small.",
    rows: [
      {
        feature: "Index structure",
        us: (
          <>
            One index: a segmented inverted index (
            <A href="/learn/tantivy/introduction">Tantivy</A>), columnar
            storage, and a SPANN-style IVF vector index
          </>
        ),
        them: (
          <>
            <A href={`${PG}/gin.html`}>GIN posting trees</A> over{" "}
            <C>tsvector</C>, plus a pending list; vectors need a separate{" "}
            <A href="/learn/postgresql/what-is-pgvector">pgvector</A> index
          </>
        ),
      },
      {
        feature: "Relevance scoring",
        us: (
          <>
            <A href="/learn/search-concepts/bm25">BM25</A>: corpus-wide IDF,
            term saturation, length normalization
          </>
        ),
        them: (
          <>
            <A href={`${PG}/textsearch-controls.html#TEXTSEARCH-RANKING`}>
              <C>ts_rank</C> / <C>ts_rank_cd</C>
            </A>
            : local frequency only, no corpus statistics
          </>
        ),
      },
      {
        feature: "Top K execution",
        us: (
          <>
            Score-ordered iterator with{" "}
            <A href="/learn/search-concepts/block-wand">block-max WAND</A>:
            skips matches that can&apos;t reach the top k, so work stays
            sublinear in match count
          </>
        ),
        them: (
          <>
            No score order, so bitmap every match, <C>ts_rank</C> each from the
            heap, sort, then <C>LIMIT</C>: cost tracks match count
          </>
        ),
      },
      {
        feature: (
          <>
            <A href="/learn/search-concepts/vector-search">Semantic</A> search
          </>
        ),
        us: (
          <>
            Dense and sparse vectors indexed and scored alongside BM25, on the
            same live rows
          </>
        ),
        them: (
          <>
            FTS is lexical only;{" "}
            <A href="/learn/postgresql/what-is-pgvector">pgvector</A> is a
            separate extension and index to add, sync, and tune
          </>
        ),
      },
      {
        feature: "Filtered search",
        us: "Numbers, dates, and literals are stored columnar and queried in the same index scan",
        them: "GIN and btree via BitmapAnd, then rank whatever survives",
      },
      {
        feature: (
          <>
            <A href="/learn/search-concepts/hybrid-search">Hybrid</A> ranking
          </>
        ),
        us: (
          <>
            Vector and BM25 scored in a single index pass, fused with{" "}
            <A href="/learn/search-concepts/reciprocal-rank-fusion">RRF</A>{" "}
            (native RRF coming soon)
          </>
        ),
        them: (
          <>
            <A href="/learn/postgresql/what-is-pgvector">pgvector</A> and GIN as
            two separate index scans, then{" "}
            <A href="/learn/search-concepts/reciprocal-rank-fusion">RRF</A>
            -fused
          </>
        ),
      },
      {
        feature: (
          <>
            <C>count(*)</C> over a match
          </>
        ),
        us: (
          <>
            <A href={`${DOCS}/documentation/aggregates/overview`}>
              Answered from the index
            </A>
          </>
        ),
        them: "No index-only scans on GIN: every counted row touches the heap",
      },
      {
        feature: "Tokenization",
        us: (
          <>
            <A href={`${DOCS}/documentation/tokenizers/overview`}>
              Per-field tokenizers
            </A>
            : ICU, ngram, CJK, stemmers, custom
          </>
        ),
        them: (
          <>
            One parser;{" "}
            <A href={`${PG}/textsearch-dictionaries.html`}>dictionaries</A> for
            stemming, stopwords, synonyms
          </>
        ),
      },
      {
        feature: "Query surface",
        us: (
          <>
            <A href={`${DOCS}/documentation/full-text/overview`}>
              Match, phrase, fuzzy, boost, regex, and range operators
            </A>{" "}
            in SQL
          </>
        ),
        them: (
          <>
            <A href={`${PG}/datatype-textsearch.html#DATATYPE-TSQUERY`}>
              <C>tsquery</C>
            </A>
            : <C>{"& | ! <->"}</C> plus four weight classes (A–D)
          </>
        ),
      },
      {
        feature: "Highlighting",
        us: (
          <>
            <C>pdb.snippet()</C> from indexed positions
          </>
        ),
        them: (
          <>
            <A href={`${PG}/textsearch-controls.html#TEXTSEARCH-HEADLINE`}>
              <C>ts_headline()</C>
            </A>{" "}
            re-parses each document at query time
          </>
        ),
      },
      {
        feature: "Document limits",
        us: "No practical caps",
        them: (
          <>
            <A href={`${PG}/textsearch-limitations.html`}>
              <C>tsvector</C>: 1MB per row, positions clamped at 16,383
            </A>
          </>
        ),
      },
      {
        feature: "Write path",
        us: (
          <>
            MVCC; segments merge in the background (
            <A href="/learn/database-concepts/lsm-trees">LSM-style</A>), with an
            optional in-memory mutable segment to absorb high write rates
          </>
        ),
        them: (
          <>
            MVCC; GIN{" "}
            <A href={`${PG}/gin-implementation.html#GIN-FAST-UPDATE`}>
              <C>fastupdate</C> pending list
            </A>
            , flushed on the unlucky write
          </>
        ),
      },
      {
        feature: "Where it runs",
        us: (
          <>
            <A href="/cloud">ParadeDB Cloud</A>, BYOC, or{" "}
            <A href={`${DOCS}/documentation/getting-started/install`}>
              self-hosted extension
            </A>
          </>
        ),
        them: "Everywhere: bundled in RDS, Cloud SQL, Azure, Supabase, Neon",
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

export default function PostgresVsPage() {
  return <VsPage config={config} />;
}
