import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";

// Article routes that have a corresponding generated .md file in public/
// (see scripts/generate-markdown.js). Value is the exact path-segment count
// of a leaf article — listings and section indexes are excluded.
const ARTICLE_DEPTH: Record<string, number> = {
  blog: 2, // /blog/<slug>
  customers: 2, // /customers/<slug>
  learn: 3, // /learn/<section>/<slug>
};

function clientPrefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;

  // Only opt into Markdown when the client explicitly asks for it. This avoids
  // rewriting generic Accept headers such as */*.
  if (!accept.toLowerCase().includes("text/markdown")) return false;

  const preferredMediaType = new Negotiator({
    headers: { accept },
  }).mediaType(["text/markdown", "text/html"]);

  return preferredMediaType === "text/markdown";
}

function isLeafArticle(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  const depth = ARTICLE_DEPTH[parts[0]];
  return depth !== undefined && parts.length === depth;
}

function withAcceptVary(response: NextResponse): NextResponse {
  const values = new Set(
    (response.headers.get("Vary") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  values.add("Accept");
  response.headers.set("Vary", Array.from(values).join(", "));
  return response;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Give agents a concise representation at the canonical homepage URL while
  // keeping the browser experience unchanged. Vary keeps CDN variants apart.
  if (pathname === "/") {
    if (clientPrefersMarkdown(req.headers.get("accept"))) {
      const url = req.nextUrl.clone();
      url.pathname = "/llms.txt";
      const response = NextResponse.rewrite(url);
      response.headers.set("Content-Type", "text/markdown; charset=utf-8");
      return withAcceptVary(response);
    }

    return withAcceptVary(NextResponse.next());
  }

  if (pathname.endsWith(".md") || !isLeafArticle(pathname)) {
    return withAcceptVary(NextResponse.next());
  }

  if (clientPrefersMarkdown(req.headers.get("accept"))) {
    const url = req.nextUrl.clone();
    url.pathname = `${pathname.replace(/\/$/, "")}.md`;
    const response = NextResponse.rewrite(url);
    response.headers.set("Content-Type", "text/markdown; charset=utf-8");
    return withAcceptVary(response);
  }

  return withAcceptVary(NextResponse.next());
}

export const config = {
  matcher: ["/", "/blog/:path*", "/customers/:path*", "/learn/:path*"],
};
