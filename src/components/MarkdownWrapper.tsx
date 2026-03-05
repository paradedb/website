"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TableOfContents from "@/components/TableOfContents";
import ArticleActions from "@/components/ArticleActions";

interface MarkdownWrapperProps {
  children: React.ReactNode;
}

export default function MarkdownWrapper({ children }: MarkdownWrapperProps) {
  const [contentLoaded, setContentLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Ensure content is fully loaded before showing TOC
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Extract basePath and slug from pathname
  // e.g. /blog/introducing-paradedb → basePath="blog", slug="introducing-paradedb"
  // e.g. /learn/search-concepts/hybrid-search → basePath="learn", slug="search-concepts/hybrid-search"
  const segments = pathname.replace(/^\//, "").split("/");
  const basePath = segments[0];
  const slug = segments.slice(1).join("/");

  return (
    <div className="flex items-start gap-8 w-full px-0 pt-0 opacity-0 animate-fade-in delay-500">
      <article className="prose dark:prose-invert flex-1 min-w-0 pt-0 max-w-none">
        {children}
      </article>
      {contentLoaded && (
        <aside className="hidden xl:block w-64 shrink-0 sticky top-8">
          <TableOfContents />
          {slug && (
            <>
              <div className="border-t border-slate-200 dark:border-slate-800 my-4" />
              <ArticleActions basePath={basePath} slug={slug} />
            </>
          )}
        </aside>
      )}
    </div>
  );
}
