"use client";

import { useEffect, useState } from "react";
import TableOfContents from "@/components/TableOfContents";

interface ContentWrapperProps {
  children: React.ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <article className="prose w-full max-w-3xl">{children}</article>
      {contentLoaded && <TableOfContents />}
    </>
  );
}
