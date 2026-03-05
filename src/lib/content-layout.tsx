import type { Metadata } from "next";
import { ReactNode } from "react";
import { generateBlogMetadata } from "@/lib/blog-metadata";

export function createContentMetadataGenerator(dirPath: string) {
  return async function generateMetadata(): Promise<Metadata> {
    return generateBlogMetadata(dirPath);
  };
}

export function ContentLayout({ children }: { children: ReactNode }) {
  return children;
}
