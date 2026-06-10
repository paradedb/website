import Code from "../Code";
import SearchFeaturesClient from "./SearchFeaturesClient";
import {
  RiSearchEyeLine,
  RiTranslate2,
  RiCpuLine,
  RiSparklingLine,
  RiPieChartLine,
  RiListCheck2,
} from "@remixicon/react";

const fullTextCode = `-- one index over your text columns
CREATE INDEX ON articles
USING bm25 (id, (body::pdb.unicode_words('stemmer=english')));

-- BM25 scoring, phrase, fuzzy, proximity, more-like-this
SELECT id, pdb.score(id)
FROM articles
WHERE body @@@ pdb.match('body', 'asian elephant', fuzzy => 1)
ORDER BY pdb.score(id) DESC
LIMIT 10;`;

const vectorCode = `-- vector field lives in the same index as your BM25 fields
CREATE INDEX ON products
USING bm25 (id, name, (embedding::pdb.hnsw(dim=>768)));

-- hybrid: lexical and vector signals scored in a single query
SELECT id,
       pdb.score(id, mode => 'hybrid')
FROM products
WHERE name &&& 'asian elephant'
  AND embedding <#> $1 < 0.4
ORDER BY pdb.score(id, mode => 'hybrid') DESC
LIMIT 10;`;

const aggregationsCode = `-- aggregations alongside the search query, in the same scan
SELECT
  metadata->>'region' AS region,
  count(*)            AS hits,
  avg(price)          AS avg_price
FROM products
WHERE name &&& 'asian elephant'
  AND price BETWEEN 20 AND 500
GROUP BY region
ORDER BY hits DESC;`;

export default async function SearchFeatures() {
  const features = [
    {
      value: "full-text",
      label: "Full-text search",
      tagline: "BM25",
      bullets: [
        {
          title: "BM25 relevance",
          description:
            "State-of-the-art lexical ranking, with phrase, fuzzy, proximity, more-like-this, and regex queries.",
          icon: <RiSearchEyeLine className="size-5" />,
        },
        {
          title: "20+ languages, 12+ tokenizers",
          description:
            "Stemmers, n-grams, ICU, and dictionary tokenizers configurable per column. Pre-filter results with any Postgres type.",
          icon: <RiTranslate2 className="size-5" />,
        },
      ],
      code: (
        <Code
          code={fullTextCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "vector",
      label: "Vector retrieval",
      tagline: "Hybrid scoring",
      bullets: [
        {
          title: "Vectors in the same index",
          description:
            "HNSW lives next to your BM25 fields. No second store, no second sync. Embeddings stay where your rows live.",
          icon: <RiCpuLine className="size-5" />,
        },
        {
          title: "True hybrid queries",
          description:
            "Lexical and vector signals scored in a single query, in a single pass over the index. Not two queries fused after the fact.",
          icon: <RiSparklingLine className="size-5" />,
        },
      ],
      code: (
        <Code
          code={vectorCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "aggregations",
      label: "Search-side aggregations",
      tagline: "Facets & counts",
      bullets: [
        {
          title: "Aggregations alongside search",
          description:
            "Facets, filter counts, term distributions, time-bucketed counts, and top-N rendered from the same scan as the search itself.",
          icon: <RiPieChartLine className="size-5" />,
        },
        {
          title: "Pushed down into the index",
          description:
            "Columnar fields in the index serve count, sum, avg, min, max, and percentile aggregates without touching the heap.",
          icon: <RiListCheck2 className="size-5" />,
        },
      ],
      code: (
        <Code
          code={aggregationsCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
  ];

  return <SearchFeaturesClient features={features} />;
}
