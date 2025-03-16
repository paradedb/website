import { blog } from "@/lib/links";
import RSS from "rss";
import { siteConfig } from "../siteConfig";

const feed = new RSS({
  title: siteConfig.name,
  description: siteConfig.description,
  site_url: siteConfig.url,
  feed_url: `${siteConfig.url}/feed.xml`,
  copyright: `${new Date().getFullYear()} ParadeDB`,
  language: "en",
  pubDate: new Date(),
});

export async function GET() {
  blog.map((post: any) => {
    feed.item({
      title: post.name,
      url: `${siteConfig.url}/blog/${post.href}`,
      date: post.date,
      author: post.author,
      description: post.description,
      categories: post.categories || [],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
