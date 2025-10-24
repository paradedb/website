"use client";

import TableOfContents from "@/components/TableOfContents";

// Import the MDX content directly
import ResourceContent from "./index.mdx";

export default function Resource() {
  return (
    <>
      <article className="prose w-full max-w-3xl">
        <ResourceContent />
      </article>
      <TableOfContents />
    </>
  );
}
