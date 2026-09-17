const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const SITE_URL = "https://www.paradedb.com";
const OUTPUT_PATH = path.join(ROOT_DIR, "public/llms.txt");

const HEADER = `# ParadeDB

> Just use Postgres. ParadeDB makes text and vector search, filters, facets, and joins fast in Postgres. It accelerates these queries with a custom index that ships as pg_search, a standard Postgres extension. Search runs alongside your application data using SQL and Postgres transactions.

## Website

- [Homepage](${SITE_URL})
- [Documentation index for LLMs](${SITE_URL}/docs/llms.txt)
- [Documentation](https://www.paradedb.com/docs/start/introduction)
- [Installation guide](https://www.paradedb.com/docs/start/install)
- [AI agent guide](https://www.paradedb.com/docs/start/ai-agents)
- [GitHub repository](https://github.com/paradedb/paradedb)
- [Blog](${SITE_URL}/blog)
- [Learn](${SITE_URL}/learn)
- [Contact](${SITE_URL}/contact)
- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS Feed](${SITE_URL}/feed.xml)
- [Content for LLMs (llms.txt)](${SITE_URL}/llms.txt)
- [Full content for LLMs (llms-full.txt)](${SITE_URL}/llms-full.txt)
- [MCP Server (streamable HTTP)](${SITE_URL}/mcp)

> Append \`.md\` to any blog, customer, or learn URL (e.g. \`${SITE_URL}/blog/<slug>.md\`) to fetch its Markdown source.
> An MCP server is available at \`${SITE_URL}/mcp\` (streamable HTTP) with tools to search and read this content.

## When to use ParadeDB

ParadeDB is for teams combining transactional application data with full-text, vector, or hybrid search; teams that have outgrown Postgres full-text search or pgvector; and teams evaluating a separate search engine or vector store. Text search, vector retrieval, ranking, filters, facets, joins, and aggregations compose in SQL with your existing schema and tools. Index updates happen with your writes and preserve Postgres transactions and ACID guarantees.

ParadeDB is vanilla Postgres with the pg_search extension installed. For self-managed Postgres, [install the extension](https://www.paradedb.com/docs/operate/deploy/self-hosted/extension) in your existing database. For managed Postgres, run ParadeDB as a [logical replica](https://www.paradedb.com/docs/operate/deploy/logical-replication/getting-started). See the [deployment guide](https://www.paradedb.com/docs/operate/deploy/overview) for Kubernetes and cloud platform options, and [Connect Your App](https://www.paradedb.com/docs/start/connect-your-app) for SQL tools and application integrations.

ParadeDB Cloud is coming soon: a fully managed platform for running ParadeDB. Join the [Cloud waitlist](${SITE_URL}/cloud) for early access, or contact [support@paradedb.com](mailto:support@paradedb.com).

This website and its MCP server provide product information, blog posts, customer stories, and learn articles, not a hosted database API. For current installation steps, SQL syntax, features, and deployment guidance, use the [documentation index](${SITE_URL}/docs/llms.txt).

## Availability and pricing

- **Community (self-managed):** Free forever for a single node, with community support. [Get started](https://www.paradedb.com/docs/start/install).
- **Enterprise (self-managed):** Custom pricing for read replicas, high availability, dedicated support, and an SLA. [Contact sales](https://calendly.com/paradedb).
- **ParadeDB Cloud (fully managed):** Coming soon; pricing is not yet published. [Join the Cloud waitlist](${SITE_URL}/cloud).
`;

// Mirrors SECTION_DISPLAY_NAMES + formatSectionName in src/lib/resources.ts
const LEARN_SECTION_DISPLAY = {
  "search-concepts": "Search Concepts",
  "search-in-postgresql": "Search In PostgreSQL",
  postgresql: "PostgreSQL",
  tantivy: "Tantivy",
};

// Mirrors SECTION_ORDER in src/lib/resources.ts
const LEARN_SECTION_ORDER = {
  "Search Concepts": 1,
  "Search In PostgreSQL": 2,
  PostgreSQL: 3,
  Tantivy: 4,
};

function readMetadata(metadataPath) {
  try {
    return JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  } catch {
    return null;
  }
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function collectFlat(contentDir, urlPrefix) {
  const items = [];
  for (const slug of listDirs(contentDir)) {
    const metadata = readMetadata(path.join(contentDir, slug, "metadata.json"));
    if (!metadata?.title) continue;
    items.push({
      title: metadata.title,
      url: `${SITE_URL}${urlPrefix}/${slug}`,
      date: metadata.date,
    });
  }
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function collectLearn() {
  const learnDir = path.join(ROOT_DIR, "src/app/learn");
  const sections = new Map();

  for (const section of listDirs(learnDir)) {
    const display = LEARN_SECTION_DISPLAY[section] ?? section;
    for (const slug of listDirs(path.join(learnDir, section))) {
      const metadata = readMetadata(
        path.join(learnDir, section, slug, "metadata.json"),
      );
      if (!metadata?.title) continue;
      if (!sections.has(display)) sections.set(display, []);
      sections.get(display).push({
        title: metadata.title,
        url: `${SITE_URL}/learn/${section}/${slug}`,
        order: metadata.order,
        date: metadata.date,
      });
    }
  }

  for (const items of sections.values()) {
    items.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined)
        return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  return Array.from(sections.keys())
    .sort((a, b) => {
      const orderA = LEARN_SECTION_ORDER[a] ?? 999;
      const orderB = LEARN_SECTION_ORDER[b] ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    })
    .flatMap((name) => sections.get(name));
}

function renderSection(title, items) {
  const lines = items.map((item) => `- [${item.title}](${item.url})`);
  return `\n## ${title}\n\n${lines.join("\n")}\n`;
}

function main() {
  const blog = collectFlat(path.join(ROOT_DIR, "src/app/blog"), "/blog");
  const customers = collectFlat(
    path.join(ROOT_DIR, "src/app/customers"),
    "/customers",
  );
  const learn = collectLearn();

  const output =
    HEADER +
    renderSection("Blog", blog) +
    renderSection("Customers", customers) +
    renderSection("Learn", learn);

  fs.writeFileSync(OUTPUT_PATH, output);
  console.log(
    `Generated ${path.relative(ROOT_DIR, OUTPUT_PATH)} (${blog.length} blog, ${customers.length} customers, ${learn.length} learn)`,
  );
}

main();
