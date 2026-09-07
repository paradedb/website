import Code from "@/components/Code";
import { paradedbSqlLight, paradedbSqlDark } from "./paradedbSqlTheme";
import PerformanceScroller, { type QueryPanels } from "./PerformanceScroller";

// Text/filters/aggregates queries and timings from the runs behind
// https://www.paradedb.com/vs/postgresql (Hacker News benchmark, 28.7M rows);
// aggregates uses the score-histogram facet with solve_mvcc = false. Joins:
// the join_groupby shape from the benchmarker stackoverflow dataset (1M
// posts, grouped aggregate over posts JOIN comments). Vector: 1%-filtered
// top-10 query from
// https://paradedb.github.io/paradedb/benchmarks/vectors.html (Cohere 10M).
const QUERIES: Record<
  string,
  { paradedb: string; postgres: string; elasticsearch?: string } | null
> = {
  text: {
    paradedb: `SELECT id, title, by, score
FROM hn_items
WHERE text ||| 'rust'
ORDER BY pdb.score(id) DESC
LIMIT 10`,
    postgres: `SELECT id, title, by, score
FROM hn_items
WHERE text_tsv @@
      websearch_to_tsquery('english', 'rust')
ORDER BY ts_rank_cd(text_tsv,
      websearch_to_tsquery('english', 'rust')) DESC
LIMIT 10`,
    elasticsearch: `POST /hn_items/_search
{
  "query": { "match": { "text": "rust" } },
  "_source": ["id", "title", "by", "score"],
  "size": 10
}`,
  },
  vector: {
    paradedb: `SELECT _id, title
FROM cohere_wiki
WHERE text ||| 'battle'
ORDER BY emb <=> '[0.12, -0.31, ...]'::vector(1024)
LIMIT 10`,
    postgres: `SELECT _id, title
FROM cohere_wiki
WHERE to_tsvector('english', text) @@
      websearch_to_tsquery('english', 'battle')
ORDER BY emb <=> '[0.12, -0.31, ...]'::vector(1024)
LIMIT 10`,
  },
  filters: {
    paradedb: `SELECT id, title, by, score
FROM hn_items
WHERE text ||| 'rust'
  AND type = 'story'
ORDER BY pdb.score(id) DESC
LIMIT 10`,
    postgres: `SELECT id, title, by, score
FROM hn_items
WHERE text_tsv @@
      websearch_to_tsquery('english', 'rust')
  AND type = 'story'
ORDER BY ts_rank_cd(text_tsv,
      websearch_to_tsquery('english', 'rust')) DESC
LIMIT 10`,
    elasticsearch: `POST /hn_items/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "text": "rust" } }
      ],
      "filter": [
        { "term": { "type": "story" } }
      ]
    }
  },
  "_source": ["id", "title", "by", "score"],
  "size": 10
}`,
  },
  aggregates: {
    paradedb: `SELECT id,
  pdb.agg('{"histogram":
    {"field": "score", "interval": 50}}',
    false) OVER ()
FROM hn_items
WHERE text ||| 'rust'
ORDER BY pdb.score(id) DESC
LIMIT 10`,
    postgres: `WITH hits AS (
  SELECT id, score,
    ts_rank_cd(text_tsv, q) r
  FROM hn_items,
    websearch_to_tsquery('english', 'rust') q
  WHERE text_tsv @@ q
)
SELECT
  (SELECT jsonb_object_agg(bucket, c)
   FROM (SELECT (score / 50) * 50 bucket,
         count(*) c FROM hits
         GROUP BY 1) t),
  (SELECT jsonb_agg(h)
   FROM (SELECT * FROM hits
         ORDER BY r DESC LIMIT 10) h)`,
    elasticsearch: `POST /hn_items/_search
{
  "query": { "match": { "text": "rust" } },
  "aggs": {
    "scores": {
      "histogram": {
        "field": "score", "interval": 50
      }
    }
  },
  "_source": ["id", "title", "by", "score"],
  "size": 10
}`,
  },
  joins: {
    paradedb: `SELECT p.post_type_id,
  COUNT(*), SUM(c.score)
FROM stackoverflow_posts p
JOIN comments c ON p.id = c.post_id
WHERE p.body ||| 'code'
GROUP BY p.post_type_id
ORDER BY SUM(c.score) DESC`,
    postgres: `SELECT p.post_type_id,
  COUNT(*), SUM(c.score)
FROM stackoverflow_posts p
JOIN comments c ON p.id = c.post_id
WHERE p.body_tsv @@
      websearch_to_tsquery('english', 'code')
GROUP BY p.post_type_id
ORDER BY SUM(c.score) DESC`,
    elasticsearch: `// No JOIN support.
//
// Searching across posts and comments
// requires denormalizing both tables
// into one index and keeping it in
// sync at ingest time.`,
  },
};

export default function PerformanceSection() {
  const panel = (code: string, lang: "sql" | "json") => (
    <Code
      code={code}
      lang={lang}
      themeLight={paradedbSqlLight}
      themeDark={paradedbSqlDark}
      className="[&_pre]:!bg-transparent [&>div]:text-xs sm:[&>div]:text-sm [&_pre]:!p-0 [&_pre]:overflow-x-auto"
      copy={false}
    />
  );

  const queryPanels: QueryPanels = Object.fromEntries(
    Object.entries(QUERIES).map(([key, queries]) => [
      key,
      queries === null
        ? null
        : {
            paradedb: panel(queries.paradedb, "sql"),
            postgres: panel(queries.postgres, "sql"),
            ...(queries.elasticsearch
              ? { elasticsearch: panel(queries.elasticsearch, "json") }
              : {}),
          },
    ]),
  );

  return <PerformanceScroller queryPanels={queryPanels} />;
}
