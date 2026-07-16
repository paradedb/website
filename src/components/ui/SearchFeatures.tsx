import Code from "../Code";
import SearchFeaturesClient from "./SearchFeaturesClient";
import { paradedbSqlLight, paradedbSqlDark } from "./paradedbSqlTheme";
import {
  RiSearchEyeLine,
  RiTranslate2,
  RiCpuLine,
  RiSparklingLine,
  RiPieChartLine,
  RiListCheck2,
  RiFilter3Line,
  RiSortDesc,
  RiScissorsCutLine,
  RiBracesLine,
} from "@remixicon/react";

const indexingCode = `CREATE INDEX ON posts
USING bm25 (
    id,
    title,
    (body::pdb.unicode_words('stemmer=english')),
    metadata,
    votes,
    published_at
);`;

const fullTextCode = `SELECT * FROM posts
WHERE body &&& 'postgres'
OR title &&& 'postgres'
ORDER BY pdb.score(id) DESC
LIMIT 5;`;

const filteringCode = `SELECT * FROM posts
WHERE body &&& 'postgres'
AND metadata->>'category' === 'databases'
AND votes >= 100
ORDER BY published_at DESC
LIMIT 5;`;

const vectorCode = `SELECT * FROM posts
WHERE body &&& 'postgres'
ORDER BY embedding <=> '[1,2,3]'
LIMIT 5;`;

const aggregationsCode = `SELECT metadata->>'category', count(*)
FROM posts
WHERE body &&& 'postgres'
GROUP BY metadata->>'category';`;

export default async function SearchFeatures() {
  const features = [
    {
      value: "indexing",
      label: "Indexing",
      tagline: "Tokenizers",
      bullets: [
        {
          title: "Advanced tokenization",
          description:
            "12+ tokenizers to break apart text into searchable tokens: ngrams, stemmers, ICU, dictionaries, more.",
          icon: <RiScissorsCutLine className="size-5" />,
        },
        {
          title: "Multi-language support",
          description:
            "20+ languages out of the box, including dictionary-based tokenizers configurable per column.",
          icon: <RiTranslate2 className="size-5" />,
        },
      ],
      code: (
        <Code
          code={indexingCode}
          lang="sql"
          themeLight={paradedbSqlLight}
          themeDark={paradedbSqlDark}
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "full-text",
      label: "Full-Text",
      tagline: "BM25",
      bullets: [
        {
          title: "BM25 relevance",
          description:
            "State-of-the-art lexical ranking, with phrase, fuzzy, proximity, more-like-this, and regex queries.",
          icon: <RiSearchEyeLine className="size-5" />,
        },
        {
          title: "Composable search syntax",
          description:
            "Mix match, term, and advanced queries with standard SQL operators on a single index.",
          icon: <RiBracesLine className="size-5" />,
        },
      ],
      code: (
        <Code
          code={fullTextCode}
          lang="sql"
          themeLight={paradedbSqlLight}
          themeDark={paradedbSqlDark}
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "vector",
      label: "Vector",
      tagline: "pgvector compatible",
      bullets: [
        {
          title: "Hybrid search",
          description:
            "Blend BM25 keyword relevance with vector similarity in a single SQL query, so lexical and semantic results rank together.",
          icon: <RiSparklingLine className="size-5" />,
        },
        {
          title: "pgvector today, custom tomorrow",
          description:
            "Runs on pgvector today, with a high-performance, pgvector-compatible version coming to the ParadeDB index.",
          icon: <RiCpuLine className="size-5" />,
        },
      ],
      code: (
        <Code
          code={vectorCode}
          lang="sql"
          themeLight={paradedbSqlLight}
          themeDark={paradedbSqlDark}
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "filtering",
      label: "Filtering",
      tagline: "Predicate pushdown",
      bullets: [
        {
          title: "Apply any predicate faster",
          description:
            "Standard Postgres WHERE clauses on indexed columns are evaluated alongside the search itself in a single index pass.",
          icon: <RiFilter3Line className="size-5" />,
        },
        {
          title: "Dynamic ordering",
          description:
            "ORDER BY relevance, recency, distance, popularity, or any custom expression, composed with the filter in a single plan.",
          icon: <RiSortDesc className="size-5" />,
        },
      ],
      code: (
        <Code
          code={filteringCode}
          lang="sql"
          themeLight={paradedbSqlLight}
          themeDark={paradedbSqlDark}
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "aggregations",
      label: "Aggregations",
      tagline: "Facets & counts",
      bullets: [
        {
          title: "Aggregations alongside search",
          description:
            "Facets, filter counts, term distributions, time-bucketed counts, and top-K rendered from the same scan as the search itself.",
          icon: <RiPieChartLine className="size-5" />,
        },
        {
          title: "Faceted search",
          description:
            "Facet counts come back in the same query as your top results, and stay fast even as the result set grows.",
          icon: <RiListCheck2 className="size-5" />,
        },
      ],
      code: (
        <Code
          code={aggregationsCode}
          lang="sql"
          themeLight={paradedbSqlLight}
          themeDark={paradedbSqlDark}
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
  ];

  return <SearchFeaturesClient features={features} />;
}
