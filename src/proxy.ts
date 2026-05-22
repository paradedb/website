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

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.endsWith(".md") || !isLeafArticle(pathname)) {
    return NextResponse.next();
  }

  if (clientPrefersMarkdown(req.headers.get("accept"))) {
    const url = req.nextUrl.clone();
    url.pathname = `${pathname.replace(/\/$/, "")}.md`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/customers/:path*", "/learn/:path*"],
};
