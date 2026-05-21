const fs = require("fs");
const path = require("path");
const { mdxToMarkdown } = require("./mdx-to-markdown");

const ROOT_DIR = process.cwd();
const SITE_URL = "https://www.paradedb.com";
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const INTRO =
  "ParadeDB is a transactional alternative to Elasticsearch built on Postgres. It is a PostgreSQL-native search and analytics engine - a columnstore index for OLAP and a BM25 inverted index for full-text search, all inside Postgres as an extension.";

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

function byDateDesc(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/** Collect every post under a flat content dir (/blog, /customers). */
function collectFlat(section) {
  const dir = path.join(ROOT_DIR, "src/app", section);
  const posts = [];
  for (const slug of listDirs(dir)) {
    const sourceDir = path.join(dir, slug);
    const meta = readMetadata(sourceDir);
    const mdxPath = path.join(sourceDir, "index.mdx");
    if (!meta?.title || !fs.existsSync(mdxPath)) continue;
    posts.push({
      meta,
      mdxPath,
      route: `/${section}/${slug}`,
      outPath: path.join(PUBLIC_DIR, section, `${slug}.md`),
    });
  }
  return posts.sort(byDateDesc);
}

/** Collect learn posts (nested under section dirs). */
function collectLearn() {
  const learnDir = path.join(ROOT_DIR, "src/app/learn");
  const posts = [];
  for (const sectionName of listDirs(learnDir)) {
    for (const slug of listDirs(path.join(learnDir, sectionName))) {
      const sourceDir = path.join(learnDir, sectionName, slug);
      const meta = readMetadata(sourceDir);
      const mdxPath = path.join(sourceDir, "index.mdx");
      if (!meta?.title || !fs.existsSync(mdxPath)) continue;
      posts.push({
        meta,
        mdxPath,
        route: `/learn/${sectionName}/${slug}`,
        outPath: path.join(PUBLIC_DIR, "learn", sectionName, `${slug}.md`),
      });
    }
  }
  return posts.sort(byDateDesc);
}

function render(post) {
  const raw = fs.readFileSync(post.mdxPath, "utf8");
  return mdxToMarkdown(raw, post.meta, `${SITE_URL}${post.route}`);
}

function main() {
  const sections = [
    { title: "Blog", posts: collectFlat("blog") },
    { title: "Customers", posts: collectFlat("customers") },
    { title: "Learn", posts: collectLearn() },
  ];

  let pageCount = 0;
  const fullParts = [
    `# ParadeDB`,
    "",
    `> ${INTRO}`,
    "",
    "Full text of ParadeDB's blog, customer stories, and learn articles for LLM consumption. For a linked index, see " +
      `${SITE_URL}/llms.txt.`,
    "",
  ];

  for (const section of sections) {
    fullParts.push(`# ${section.title}`, "");
    for (const post of section.posts) {
      const markdown = render(post);

      // Per-page .md file (served at e.g. /blog/<slug>.md).
      fs.mkdirSync(path.dirname(post.outPath), { recursive: true });
      fs.writeFileSync(post.outPath, markdown);
      pageCount += 1;

      fullParts.push(markdown, "---", "");
    }
  }

  fs.writeFileSync(
    path.join(PUBLIC_DIR, "llms-full.txt"),
    fullParts.join("\n"),
  );

  console.log(
    `Generated ${pageCount} per-page .md files and public/llms-full.txt`,
  );
}

main();
