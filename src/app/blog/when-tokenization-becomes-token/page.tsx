"use client";

import BlogContent from "./index.mdx";
import ContentWrapper from "@/components/ContentWrapper";

export default function BlogPost() {
  return (
    <ContentWrapper>
      <BlogContent />
    </ContentWrapper>
  );
}
