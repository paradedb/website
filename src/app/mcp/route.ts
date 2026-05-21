import { createMcpHandler } from "mcp-handler";
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

function json(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "search_content",
      "Search ParadeDB's blog posts, customer stories, and learn articles by keyword. Returns ranked results with title, URL, and a snippet. Use get_page to fetch a result's full Markdown.",
      {
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
      async ({ query, section, limit }) =>
        json(searchContent(query, section, limit ?? 8)),
    );

    server.tool(
      "get_page",
      "Fetch the full Markdown of a ParadeDB page by its path (e.g. '/blog/elasticsearch-was-never-a-database') or slug. Use search_content or list_content to discover paths.",
      {
        path: z
          .string()
          .describe(
            "Page path or slug, e.g. '/learn/search-concepts/bm25' or 'bm25'.",
          ),
      },
      async ({ path }) => {
        const page = getPage(path);
        if (!page) {
          return {
            content: [
              { type: "text" as const, text: `No page found for "${path}".` },
            ],
            isError: true,
          };
        }
        return { content: [{ type: "text" as const, text: page.markdown }] };
      },
    );

    server.tool(
      "list_content",
      "List all available ParadeDB blog posts, customer stories, and learn articles with their titles and URLs. Optionally filter by section.",
      {
        section: sectionEnum
          .optional()
          .describe("Restrict to one content section."),
      },
      async ({ section }) => json(listContent(section)),
    );

    server.tool(
      "get_product_info",
      "Get a structured overview of ParadeDB: what it is, how to install it, and key links (docs, GitHub, blog). Useful for grounding before answering questions.",
      {},
      async () => json(getProductInfo()),
    );
  },
  {
    serverInfo: { name: "paradedb", version: "1.0.0" },
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
