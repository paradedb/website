const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const SITE_URL = "https://www.paradedb.com";
const OUTPUT_PATH = path.join(ROOT_DIR, "public/llms.txt");

const HEADER = `# ParadeDB

> ParadeDB is a transactional alternative to Elasticsearch built on Postgres. It is a PostgreSQL-native search and analytics engine - a columnstore index for OLAP and a BM25 inverted index for full-text search, all inside Postgres as an extension. ParadeDB makes Postgres fast for both analytics and search without ETL or external systems.

## Website

- [Homepage](${SITE_URL})
- [Blog](${SITE_URL}/blog)
- [Learn](${SITE_URL}/learn)
- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS Feed](${SITE_URL}/feed.xml)
- [Content for LLMs (llms.txt)](${SITE_URL}/llms.txt)
- [Full content for LLMs (llms-full.txt)](${SITE_URL}/llms-full.txt)
- [MCP Server (streamable HTTP)](${SITE_URL}/mcp)

> Append \`.md\` to any blog, customer, or learn URL (e.g. \`${SITE_URL}/blog/<slug>.md\`) to fetch its Markdown source.
> An MCP server is available at \`${SITE_URL}/mcp\` (streamable HTTP) with tools to search and read this content.
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
