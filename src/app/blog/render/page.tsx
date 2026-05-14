"use client";

import MarkdownWrapper from "@/components/MarkdownWrapper";
import BlogContent from "./index.mdx";

export default function BlogPost() {
  return (
    <MarkdownWrapper>
      <BlogContent />
    </MarkdownWrapper>
  );
}
