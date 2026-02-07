import type { Metadata } from "next";
import { getResourcesBySection } from "@/lib/resources";
import { generateSectionMetadata } from "@/lib/blog-metadata";
import ResourcesLayoutClient from "./layout-client";

import "highlight.js/styles/github-dark.css";

export const metadata: Metadata = generateSectionMetadata({
  title: "Learn Search Concepts",
  description:
    "Deep dive into search concepts, and learn how to build powerful search features in Postgres.",
  path: "/learn",
});

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resourceSections = await getResourcesBySection();

  if (resourceSections.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <ResourcesLayoutClient resourceSections={resourceSections}>
      {children}
    </ResourcesLayoutClient>
  );
}
