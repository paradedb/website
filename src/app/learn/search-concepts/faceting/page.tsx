"use client";

import ContentWrapper from "@/components/ContentWrapper";

// Import the MDX content directly
import ResourceContent from "./index.mdx";

export default function Resource() {
  return (
    <>
      <ContentWrapper>
        <ResourceContent />
      </ContentWrapper>
    </>
  );
}
