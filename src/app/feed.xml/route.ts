import { getBlogLinks } from "@/lib/blog";
import RSS from "rss";
import { siteConfig } from "../siteConfig";

export async function GET() {
  const blogLinks = await getBlogLinks();

  const feed = new RSS({
    title: siteConfig.name,
    description: siteConfig.description,
    site_url: siteConfig.url,
    feed_url: new URL("/feed.xml", siteConfig.url).toString(), // canonical
    copyright: `${new Date().getFullYear()} ParadeDB`,
    language: "en",
    pubDate: new Date(),
  });

  blogLinks.forEach((post) => {
    // normalize any leading slashes
    const slug = String(post.href).replace(/^\/+/, "");
    feed.item({
      title: post.name,
      url: new URL(`/blog/${slug}`, siteConfig.url).toString(), // canonical
      date: post.date,
      author: post.author,
      description: post.description,
      categories: post.categories || [],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
