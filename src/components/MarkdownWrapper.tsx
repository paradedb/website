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
    <div className="flex items-start gap-12 w-full lg:px-8 xl:px-12 pt-0">
      <article className="prose dark:prose-invert w-full max-w-5xl pt-0">{children}</article>
      {contentLoaded && (
        <aside className="hidden 2xl:block w-64 shrink-0 sticky top-8">
          <TableOfContents />
        </aside>
      )}
    </div>
  );
}

