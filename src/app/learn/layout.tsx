import type { Metadata } from "next";
import { getResourcesBySection } from "@/lib/resources";
import ResourcesLayoutClient from "./layout-client";
import { siteConfig } from "../siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Learn Search Concepts";
  const description =
    "Deep dive into search concepts, and learn how to build powerful search features in Postgres.";
  const url = `${siteConfig.url}/learn`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@paradedb",
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resourceSections = await getResourcesBySection();

  // If no resources, just render children without the layout sidebar
  if (resourceSections.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <ResourcesLayoutClient resourceSections={resourceSections}>
      {children}
    </ResourcesLayoutClient>
  );
}
