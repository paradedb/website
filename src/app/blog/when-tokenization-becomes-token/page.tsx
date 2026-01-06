"use client";

import TableOfContents from "@/components/TableOfContents";

// Import the MDX content directly
import BlogContent from "./index.mdx";

export default function BlogPost() {
  return (
    <>
      <article className="prose dark:prose-invert w-full max-w-3xl">
        <BlogContent />
      </article>
      <TableOfContents />
    </>
  );
}
