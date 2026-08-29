import Code from "@/components/Code";
import { paradedbSqlLight, paradedbSqlDark } from "./paradedbSqlTheme";
import PerformanceScroller, { type QueryPanels } from "./PerformanceScroller";

// Queries and timings from https://www.paradedb.com/vs/postgresql
// (Hacker News benchmark, 28.7M rows).
const QUERIES: Record<string, { paradedb: string; postgres: string } | null> = {
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
  },
  vector: null,
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
  },
  aggregates: {
    paradedb: `SELECT id,
  pdb.agg('{"terms": {"field": "type"}}') OVER ()
FROM hn_items
WHERE text ||| 'rust'
ORDER BY pdb.score(id) DESC
LIMIT 10`,
    postgres: `WITH hits AS (
  SELECT id, type,
    ts_rank_cd(text_tsv, q) r
  FROM hn_items,
    websearch_to_tsquery('english', 'rust') q
  WHERE text_tsv @@ q
)
SELECT
  (SELECT jsonb_object_agg(k, c)
   FROM (SELECT type k, count(*) c FROM hits
         GROUP BY 1) t),
  (SELECT jsonb_agg(h)
   FROM (SELECT * FROM hits
         ORDER BY r DESC LIMIT 10) h)`,
  },
  joins: null,
};

export default function PerformanceSection() {
  const queryPanels: QueryPanels = Object.fromEntries(
    Object.entries(QUERIES).map(([key, queries]) => [
      key,
      queries === null
        ? null
        : {
        paradedb: (
          <Code
            code={queries.paradedb}
            lang="sql"
            themeLight={paradedbSqlLight}
            themeDark={paradedbSqlDark}
            className="[&_pre]:!bg-transparent [&>div]:text-xs sm:[&>div]:text-sm [&_pre]:!p-0 [&_pre]:overflow-x-auto"
            copy={false}
          />
        ),
        postgres: (
          <Code
            code={queries.postgres}
            lang="sql"
            themeLight={paradedbSqlLight}
            themeDark={paradedbSqlDark}
            className="[&_pre]:!bg-transparent [&>div]:text-xs sm:[&>div]:text-sm [&_pre]:!p-0 [&_pre]:overflow-x-auto"
            copy={false}
          />
        ),
      },
    ]),
  );

  return <PerformanceScroller queryPanels={queryPanels} />;
}
