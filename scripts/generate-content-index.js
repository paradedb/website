const fs = require("fs");
const path = require("path");
const { mdxToMarkdown } = require("./mdx-to-markdown");

// Builds src/lib/content-index.json: a bundled, machine-readable index of all
// blog/customer/learn content that the MCP server (src/app/api/[transport])
// imports at build time. Generated before `next build` so the route can import
// it; gitignored like the other content artifacts.

const ROOT_DIR = process.cwd();
const SITE_URL = "https://www.paradedb.com";
const OUTPUT_PATH = path.join(ROOT_DIR, "src/lib/content-index.json");

function readMetadata(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "metadata.json"), "utf8"));
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

function entryFrom(section, sourceDir, routePath, meta) {
  const mdxPath = path.join(sourceDir, "index.mdx");
  if (!meta?.title || !fs.existsSync(mdxPath)) return null;
  const url = `${SITE_URL}${routePath}`;
  const markdown = mdxToMarkdown(fs.readFileSync(mdxPath, "utf8"), meta, url);
  return {
    section,
    path: routePath,
    url,
    title: meta.title,
    description: meta.description || "",
    date: meta.date || "",
    categories: meta.categories || [],
    markdown,
  };
}

function collectFlat(section) {
  const dir = path.join(ROOT_DIR, "src/app", section);
  const entries = [];
  for (const slug of listDirs(dir)) {
    const entry = entryFrom(
      section,
      path.join(dir, slug),
      `/${section}/${slug}`,
      readMetadata(path.join(dir, slug)),
    );
    if (entry) entries.push(entry);
  }
  return entries;
}

function collectLearn() {
  const learnDir = path.join(ROOT_DIR, "src/app/learn");
  const entries = [];
  for (const sectionName of listDirs(learnDir)) {
    for (const slug of listDirs(path.join(learnDir, sectionName))) {
      const sourceDir = path.join(learnDir, sectionName, slug);
      const entry = entryFrom(
        "learn",
        sourceDir,
        `/learn/${sectionName}/${slug}`,
        readMetadata(sourceDir),
      );
      if (entry) entries.push(entry);
    }
  }
  return entries;
}

function main() {
  const entries = [
    ...collectFlat("blog"),
    ...collectFlat("customers"),
    ...collectLearn(),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries));
  console.log(
    `Generated ${path.relative(ROOT_DIR, OUTPUT_PATH)} (${entries.length} pages)`,
  );
}

main();
