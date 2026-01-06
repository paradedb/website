import Code from "../Code";
import SearchFeaturesClient from "./SearchFeaturesClient";
import {
  RiScissorsCutLine,
  RiTranslate2,
  RiSearchEyeLine,
  RiGlobalLine,
  RiBracesLine,
  RiSpeedLine,
  RiSortAsc,
  RiEqualizerLine,
  RiListCheck2,
  RiPieChartLine,
  RiCheckDoubleLine,
} from "@remixicon/react";

const textProcessingCode = `CREATE INDEX ON animals
USING bm25 (
    id,
    (name::pdb.ngram(3,3)),
    (description::pdb.unicode_words('stemmer=english'))
);`;

const textSearchCode = `SELECT * FROM animals
WHERE name &&& 'asian elephant'
OR id @@@ pdb.more_like_this(1)
LIMIT 5;`;

const booleanCode = `SELECT * FROM animals
WHERE name &&& 'asian elephant'
AND metadata->>'region' === 'Asia'
AND weight >= 4000
LIMIT 5;`;

const topNCode = `SELECT * FROM animals
WHERE name &&& 'asian elephant'
ORDER BY weight DESC
LIMIT 5;`;

const facetedCode = `SELECT metadata->>'region', count(*)
FROM animals
WHERE name &&& 'asian elephant'
GROUP BY metadata->>'region'
ORDER BY 1;`;

const hybridSearchCode = `SELECT id, pdb.score(id)
FROM animals
WHERE name &&& 'asian elephant'
ORDER BY pdb.score(id) DESC
LIMIT 5;

SELECT id, embedding <=> '[1,2,3]'
FROM animals
ORDER BY embedding <=> '[1,2,3]' DESC
LIMIT 5;`;

export default async function SearchFeatures() {
  const features = [
    {
      value: "processing",
      label: "Text Processing",
      bullets: [
        {
          title: "Advanced tokenization",
          description:
            "12+ different tokenizers to break apart text into searchable tokens.",
          icon: <RiScissorsCutLine className="size-5" />,
        },
        {
          title: "Multi-language support",
          description:
            "Support for 20+ languages, including dictionary-based tokenizers.",
          icon: <RiTranslate2 className="size-5" />,
        },
      ],
      code: (
        <Code
          code={textProcessingCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "text",
      label: "Text Search",
      bullets: [
        {
          title: "Full text search",
          description:
            "Support for standard match, phrase, term, and fuzzy queries.",
          icon: <RiSearchEyeLine className="size-5" />,
        },
        {
          title: "Advanced search queries",
          description:
            "And many more advanced queries like proximity, more-like-this, regex, etc.",
          icon: <RiGlobalLine className="size-5" />,
        },
      ],
      code: (
        <Code
          code={textSearchCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "hybrid",
      label: "Hybrid Search",
      bullets: [
        {
          title: "Fully compatible with pgvector",
          description:
            "ParadeDB can be combined with pgvector to deliver a hybrid search solution.",
          icon: <RiCheckDoubleLine className="size-5" />,
        },
      ],
      code: (
        <Code
          code={hybridSearchCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "boolean",
      label: "Boolean Queries",
      bullets: [
        {
          title: "Boolean conditions",
          description:
            "Multiple boolean conditions are efficiently handled as a single index scan.",
          icon: <RiBracesLine className="size-5" />,
        },
        {
          title: "Metadata filtering",
          description:
            "Most Postgres types (numeric, datetime, JSON, etc.) can be used to pre-filter search results.",
          icon: <RiSpeedLine className="size-5" />,
        },
      ],
      code: (
        <Code
          code={booleanCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "top-n",
      label: "Top N",
      bullets: [
        {
          title: "Efficient Top N",
          description:
            "Optimized execution paths for quickly retrieving the Top N most relevant results.",
          icon: <RiSortAsc className="size-5" />,
        },
        {
          title: "BM25 Ranking",
          description:
            "Tunable relevance scores with BM25, the state-of-the-art algorithm for relevance ranking.",
          icon: <RiEqualizerLine className="size-5" />,
        },
      ],
      code: (
        <Code
          code={topNCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
    {
      value: "faceted",
      label: "Aggregates",
      bullets: [
        {
          title: "Bucket and metric aggregates",
          description:
            "Quickly executes common aggregates (count, bucket, average, etc.) with a columnar index.",
          icon: <RiPieChartLine className="size-5" />,
        },
        {
          title: "Search faceting",
          description:
            "Return aggregates alongside your search results in a single query.",
          icon: <RiListCheck2 className="size-5" />,
        },
      ],
      code: (
        <Code
          code={facetedCode}
          lang="sql"
          className="[&_pre]:!bg-transparent"
          copy={false}
        />
      ),
    },
  ];

  return <SearchFeaturesClient features={features} />;
}
