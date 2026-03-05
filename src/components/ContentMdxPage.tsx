import MarkdownWrapper from "@/components/MarkdownWrapper";
import { ComponentType } from "react";

interface ContentMdxPageProps {
  Content: ComponentType;
}

export function ContentMdxPage({ Content }: ContentMdxPageProps) {
  return (
    <MarkdownWrapper>
      <Content />
    </MarkdownWrapper>
  );
}
