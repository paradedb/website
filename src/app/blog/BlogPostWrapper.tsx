"use client";

import { useEffect, useState } from "react";
import TableOfContents from "@/components/TableOfContents";

interface BlogPostWrapperProps {
  children: React.ReactNode;
}

export default function BlogPostWrapper({ children }: BlogPostWrapperProps) {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Ensure content is fully loaded before showing TOC
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <article className="prose w-full max-w-3xl">
        {children}
      </article>
      {contentLoaded && <TableOfContents />}
    </>
  );
}