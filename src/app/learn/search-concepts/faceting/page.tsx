"use client";

import MarkdownWrapper from "@/components/MarkdownWrapper";

// Import the MDX content directly
import ResourceContent from "./index.mdx";

export default function Resource() {
  return (
    <MarkdownWrapper>
      <ResourceContent />
    </MarkdownWrapper>
  );
}
