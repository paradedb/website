"use client";

import { useEffect, useState } from "react";
import TableOfContents from "@/components/TableOfContents";

interface MarkdownWrapperProps {
  children: React.ReactNode;
}

export default function MarkdownWrapper({ children }: MarkdownWrapperProps) {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Ensure content is fully loaded before showing TOC
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-start gap-8 w-full px-0 pt-0 opacity-0 animate-fade-in delay-500">
      <article className="prose dark:prose-invert flex-1 min-w-0 pt-0 max-w-none">
        {children}
      </article>
      {contentLoaded && (
        <aside className="hidden xl:block w-64 shrink-0 sticky top-8">
          <TableOfContents />
        </aside>
      )}
    </div>
  );
}
