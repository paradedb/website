"use client";

import { lazy, Suspense } from "react";
import BlogPostWrapper from "../BlogPostWrapper";

interface BlogPageClientProps {
  slug: string;
}

export function BlogPageClient({ slug }: BlogPageClientProps) {
  // Dynamically import based on slug
  const BlogContent = lazy(() => import(`../${slug}/index.mdx`));
  
  return (
    <BlogPostWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogContent />
      </Suspense>
    </BlogPostWrapper>
  );
}