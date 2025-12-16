import type { Metadata } from "next";
import { getBlogLinks } from "@/lib/blog";
import BaseContentLayout from "@/components/BaseContentLayout";
import { generateSectionMetadata } from "@/lib/content-metadata";
import { siteConfig } from "../siteConfig";

export const metadata: Metadata = generateSectionMetadata(
  "Blog",
  "Engineering deep dives, product and company announcements, and guides from the ParadeDB team.",
  `${siteConfig.url}/blog`,
);

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogLinks = await getBlogLinks();

  return (
    <BaseContentLayout contentType="blog" items={blogLinks}>
      {children}
    </BaseContentLayout>
  );
}
