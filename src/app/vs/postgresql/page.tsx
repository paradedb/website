import type { Metadata } from "next";
import VsPage, { type VsConfig } from "@/components/vs/VsPage";
import VsBenchmarkPanel, {
  type VsBenchData,
} from "@/components/vs/VsBenchmarkPanel";
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
const DOCS = "https://docs.paradedb.com";

export const metadata: Metadata = {
  title: "Comparing ParadeDB and Postgres Full-Text Search",
  description:
    "An honest comparison of ParadeDB and Postgres full-text search: how each one ranks, executes TopK, filters, and counts, and where stock FTS stops scaling.",
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
        <A href={`${DOCS}/welcome/architecture`}>full inverted-index engine</A>{" "}
        living in the same database.
      </>
    ),
  },

  techTable: {
    subhead:
      "Stock FTS is real search: parsing, stemming, indexes. The gap opens at ranking quality, and at how each side executes TopK, filters, and counts once the corpus stops being small.",
    rows: [
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
        feature: "Index structure",
        us: (
          <>
            Segmented inverted index (
            <A href="/learn/tantivy/introduction">Tantivy</A>) with columnar
            fast fields
          </>
        ),
        them: (
          <>
            <A href={`${PG}/gin.html`}>GIN posting trees</A> over{" "}
            <C>tsvector</C>, plus a pending list
          </>
        ),
      },
      {
        feature: "TopK execution",
        us: (
          <>
            <A href="/learn/search-concepts/block-wand">
              Ordered by score inside the index
            </A>
            ; cost tracks k
          </>
        ),
        them: (
          <>
            Bitmap all matches, <C>ts_rank</C> each row, sort, then{" "}
            <C>LIMIT</C>; cost tracks match count
          </>
        ),
      },
      {
        feature: "Filtered search",
        us: "Numbers, dates, and literals are fast fields in the same index scan",
        them: "GIN AND btree via BitmapAnd, then rank whatever survives",
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
            MVCC; background{" "}
            <A href="/learn/database-concepts/lsm-trees">
              LSM-style segment merges
            </A>
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
        feature: "Hybrid (BM25 + vector)",
        us: (
          <>
            <A href="/learn/search-concepts/hybrid-search">
              Scored together in one query
            </A>
          </>
        ),
        them: "pgvector is a separate index; fused in application code",
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
    title: "The table above, measured.",
    subhead:
      "Every claim in the comparison, run head to head: 28.7M Hacker News documents, each engine on its own 4 pinned CPUs with 8GB, queried through pgbouncer in a closed loop at 1, 4, and 8 connections. FTS ran its best-case schema (stored tsvector columns, GIN, btree filters) with a 30s statement timeout; cells where no query returned are marked as such.",
    panel: <VsBenchmarkPanel data={benchmarkData as VsBenchData} />,
  },

  fits: {
    subhead:
      "Stock FTS earns its place through ubiquity: it is already installed everywhere Postgres runs. The question is how far it carries you.",
    us: [
      "Ranking quality matters: users expect BM25 ordering from a search box, not frequency-sorted matches.",
      "The corpus is in the millions of rows, where ranking every match before the LIMIT stops being viable.",
      "Search runs with filters, facets, or counts on the same query path.",
      "You need fuzzy matching, boosting, fast highlighting, or hybrid BM25 + vector scoring.",
      "You stood up Elasticsearch for exactly these gaps and want to delete it.",
    ],
    them: [
      "The corpus is small (hundreds of thousands of rows) and will stay that way.",
      "Matching is boolean: does the document contain these words, with no ranking pressure.",
      "You are on a managed Postgres that allows no third-party extensions, and migrating is off the table.",
      "A zero-dependency policy outweighs search quality; FTS is already in the box.",
    ],
  },
};

export default function PostgresVsPage() {
  return <VsPage config={config} />;
}
