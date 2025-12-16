import type { Metadata } from "next";
import { getResourcesBySection } from "@/lib/resources";
import BaseContentLayout from "@/components/BaseContentLayout";
import { generateSectionMetadata } from "@/lib/content-metadata";
import { siteConfig } from "../siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  return generateSectionMetadata(
    "Learn Search Concepts",
    "Deep dive into search concepts, and learn how to build powerful search features in Postgres.",
    `${siteConfig.url}/learn`,
  );
}

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resourceSections = await getResourcesBySection();

  return (
    <BaseContentLayout
      contentType="learn"
      sections={resourceSections}
      showCodeBlockEnhancer={true}
    >
      {children}
    </BaseContentLayout>
  );
}
