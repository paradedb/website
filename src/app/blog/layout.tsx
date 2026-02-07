import type { Metadata } from "next";
import { getBlogLinksByCategory } from "@/lib/blog";
import { generateSectionMetadata } from "@/lib/blog-metadata";
import BlogLayoutClient from "./layout-client";

import "highlight.js/styles/github-dark.css";

export const metadata: Metadata = generateSectionMetadata({
  title: "Blog",
  description:
    "Engineering deep dives, product and company announcements, and guides from the ParadeDB team.",
  path: "/blog",
});

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogSections = await getBlogLinksByCategory();

  return (
    <BlogLayoutClient blogSections={blogSections}>{children}</BlogLayoutClient>
  );
}
