import { createMcpHandler } from "mcp-handler";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getPage,
  getProductInfo,
  listContent,
  searchContent,
} from "@/lib/content-search";

export const runtime = "nodejs";
export const maxDuration = 60;

const sectionEnum = z.enum(["blog", "customers", "learn"]);

// All tools are read-only lookups over static content (no side effects, safe to
// retry, closed world). Declared as hints per MCP best practices.
const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const searchResultShape = {
  results: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      path: z.string(),
      section: z.string(),
      description: z.string(),
      snippet: z.string(),
      score: z.number(),
    }),
  ),
};

const listItemShape = {
  items: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      path: z.string(),
      section: z.string(),
      description: z.string(),
      date: z.string(),
    }),
  ),
};

const productInfoShape = {
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  summary: z.string(),
  install: z.string(),
  links: z.object({
    website: z.string(),
    docs: z.string(),
    github: z.string(),
    blog: z.string(),
    llmsTxt: z.string(),
  }),
  contentCounts: z.object({
    blog: z.number(),
    customers: z.number(),
    learn: z.number(),
  }),
};

function text(value: string, isError = false) {
  return { content: [{ type: "text" as const, text: value }], isError };
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "search_content",
      {
        title: "Search ParadeDB content",
        description:
          "Search ParadeDB's blog posts, customer stories, and learn articles by keyword. Returns ranked results with title, URL, and a snippet. Use get_page to fetch a result's full Markdown.",
        inputSchema: {
          query: z
            .string()
            .describe(
              "Keywords to search for, e.g. 'BM25 ranking' or 'replace Elasticsearch'.",
            ),
          section: sectionEnum
            .optional()
            .describe("Restrict to one content section."),
          limit: z
            .number()
            .int()
            .min(1)
            .max(20)
            .optional()
            .describe("Max results (default 8)."),
        },
        outputSchema: searchResultShape,
        annotations: { title: "Search ParadeDB content", ...READ_ONLY },
      },
      async ({ query, section, limit }) => {
        const results = searchContent(query, section, limit ?? 8);
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(results, null, 2) },
          ],
          structuredContent: { results },
        };
      },
    );

    server.registerTool(
      "get_page",
      {
        title: "Get a ParadeDB page",
        description:
          "Fetch the full Markdown of a ParadeDB page by its path (e.g. '/blog/elasticsearch-was-never-a-database') or slug. Use search_content or list_content to discover paths.",
        inputSchema: {
          path: z
            .string()
            .describe(
              "Page path or slug, e.g. '/learn/search-concepts/bm25' or 'bm25'.",
            ),
        },
        annotations: { title: "Get a ParadeDB page", ...READ_ONLY },
      },
      async ({ path }) => {
        const page = getPage(path);
        if (!page) return text(`No page found for "${path}".`, true);
        return text(page.markdown);
      },
    );

    server.registerTool(
      "list_content",
      {
        title: "List ParadeDB content",
        description:
          "List all available ParadeDB blog posts, customer stories, and learn articles with their titles and URLs. Optionally filter by section.",
        inputSchema: {
          section: sectionEnum
            .optional()
            .describe("Restrict to one content section."),
        },
        outputSchema: listItemShape,
        annotations: { title: "List ParadeDB content", ...READ_ONLY },
      },
      async ({ section }) => {
        const items = listContent(section);
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(items, null, 2) },
          ],
          structuredContent: { items },
        };
      },
    );

    server.registerTool(
      "get_product_info",
      {
        title: "Get ParadeDB product info",
        description:
          "Get a structured overview of ParadeDB: what it is, how to install it, and key links (docs, GitHub, blog). Useful for grounding before answering questions.",
        outputSchema: productInfoShape,
        annotations: { title: "Get ParadeDB product info", ...READ_ONLY },
      },
      async () => {
        const info = getProductInfo();
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(info, null, 2) },
          ],
          structuredContent: info,
        };
      },
    );

    // Expose every page as an addressable MCP resource (paradedb://content/<path>).
    server.registerResource(
      "content",
      new ResourceTemplate("paradedb://content{+path}", {
        list: () => ({
          resources: listContent().map((entry) => ({
            uri: `paradedb://content${entry.path}`,
            name: entry.title,
            description: entry.description,
            mimeType: "text/markdown",
          })),
        }),
      }),
      {
        title: "ParadeDB content",
        description:
          "ParadeDB blog posts, customer stories, and learn articles as Markdown.",
        mimeType: "text/markdown",
      },
      (uri, variables) => {
        const raw = variables.path;
        const path = Array.isArray(raw) ? raw.join("") : (raw ?? "");
        const page = getPage(String(path));
        if (!page) return { contents: [] };
        return {
          contents: [
            { uri: uri.href, mimeType: "text/markdown", text: page.markdown },
          ],
        };
      },
    );

    // A ready-made prompt that grounds answers in ParadeDB's own content.
    server.registerPrompt(
      "answer_about_paradedb",
      {
        title: "Answer a question about ParadeDB",
        description:
          "Builds a prompt instructing the assistant to answer a question using the ParadeDB MCP tools and cite source URLs.",
        argsSchema: {
          question: z
            .string()
            .describe("The question about ParadeDB to answer."),
        },
      },
      ({ question }) => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text:
                "Answer the following question about ParadeDB. Use the search_content and get_page tools to ground your answer in ParadeDB's official blog, customer stories, and learn articles, and cite the source URLs.\n\n" +
                `Question: ${question}`,
            },
          },
        ],
      }),
    );
  },
  {
    serverInfo: { name: "paradedb", version: "1.0.0" },
    instructions:
      "This MCP server exposes ParadeDB's content (blog posts, customer stories, and learn articles) about full-text search and analytics in Postgres. Use search_content to find relevant pages, get_page to read a page's full Markdown, list_content to browse, and get_product_info for an overview. The same pages are available as resources under paradedb://content/. When answering questions about ParadeDB, ground answers in this content and cite source URLs.",
  },
  {
    // Route lives at app/mcp/route.ts, so the streamable HTTP endpoint is /mcp.
    basePath: "",
    maxDuration: 60,
    disableSse: true,
    verboseLogs: false,
  },
);

export { handler as GET, handler as POST, handler as DELETE };
