import { stemmer } from "porter-stemmer";
import contentIndex from "@/lib/content-index.json";
import { siteConfig } from "@/app/siteConfig";
import { documentation, github } from "@/lib/links";

export interface ContentEntry {
  section: "blog" | "customers" | "learn";
  path: string;
  url: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  markdown: string;
}

export type ContentSection = ContentEntry["section"];

const entries = contentIndex as ContentEntry[];

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "for",
  "on",
  "with",
  "is",
  "are",
  "be",
  "as",
  "at",
  "by",
  "it",
  "its",
  "this",
  "that",
  "how",
  "what",
  "why",
  "when",
  "do",
  "does",
  "your",
  "you",
  "we",
  "i",
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) || [])
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .map((word) => stemmer(word));
}

function frequency(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const token of tokens) map.set(token, (map.get(token) ?? 0) + 1);
  return map;
}

// Precompute per-entry token frequencies once per server instance. Titles are
// weighted more heavily than body text during scoring.
const indexed = entries.map((entry) => ({
  entry,
  titleFreq: frequency(tokenize(entry.title)),
  bodyFreq: frequency(tokenize(`${entry.description} ${entry.markdown}`)),
}));

const TITLE_WEIGHT = 5;

export interface SearchResult {
  title: string;
  url: string;
  path: string;
  section: ContentSection;
  description: string;
  snippet: string;
  score: number;
}

/** Build a short snippet around the first raw query word found in the body. */
function buildSnippet(markdown: string, query: string): string {
  const body = markdown.replace(/\s+/g, " ").trim();
  const firstWord = (query.toLowerCase().match(/[a-z0-9]+/g) || [])[0];
  const at = firstWord ? body.toLowerCase().indexOf(firstWord) : -1;
  if (at === -1) return body.slice(0, 200).trim();
  const start = Math.max(0, at - 90);
  return `${start > 0 ? "…" : ""}${body.slice(start, start + 200).trim()}…`;
}

export function searchContent(
  query: string,
  section?: ContentSection,
  limit = 8,
): SearchResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  return indexed
    .filter(({ entry }) => !section || entry.section === section)
    .map(({ entry, titleFreq, bodyFreq }) => {
      let score = 0;
      for (const term of terms) {
        score += (titleFreq.get(term) ?? 0) * TITLE_WEIGHT;
        score += bodyFreq.get(term) ?? 0;
      }
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry, score }) => ({
      title: entry.title,
      url: entry.url,
      path: entry.path,
      section: entry.section,
      description: entry.description,
      snippet: buildSnippet(entry.markdown, query),
      score,
    }));
}

/** Resolve a page by exact path (`/blog/x`) or by slug (`x`). */
export function getPage(pathOrSlug: string): ContentEntry | null {
  const normalized = pathOrSlug.trim().replace(/\.md$/, "").replace(/\/$/, "");
  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return (
    entries.find((entry) => entry.path === withSlash) ??
    entries.find((entry) => entry.path.endsWith(`/${normalized}`)) ??
    null
  );
}

export function listContent(
  section?: ContentSection,
): Pick<
  ContentEntry,
  "title" | "url" | "path" | "section" | "description" | "date"
>[] {
  return entries
    .filter((entry) => !section || entry.section === section)
    .map(({ title, url, path, section, description, date }) => ({
      title,
      url,
      path,
      section,
      description,
      date,
    }));
}

export function getProductInfo() {
  return {
    name: siteConfig.name,
    tagline: "Search without a second system",
    description: siteConfig.description,
    summary:
      "ParadeDB is a PostgreSQL-native search and analytics engine, packaged as a Postgres extension (pg_search). It provides a BM25 inverted index for full-text search and a columnar index for analytics, offering a transactional alternative to Elasticsearch without ETL or external systems.",
    install:
      "docker run --name paradedb -e POSTGRES_PASSWORD=password paradedb/paradedb",
    links: {
      website: siteConfig.url,
      docs: documentation.BASE,
      github: github.REPO,
      blog: `${siteConfig.url}/blog`,
      llmsTxt: `${siteConfig.url}/llms.txt`,
    },
    contentCounts: {
      blog: entries.filter((e) => e.section === "blog").length,
      customers: entries.filter((e) => e.section === "customers").length,
      learn: entries.filter((e) => e.section === "learn").length,
    },
  };
}
