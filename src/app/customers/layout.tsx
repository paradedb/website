import type { Metadata } from "next";
import { getCaseStudyLinks } from "@/lib/blog";
import { generateSectionMetadata } from "@/lib/blog-metadata";
import CustomersLayoutClient from "./layout-client";

export const metadata: Metadata = generateSectionMetadata({
  title: "Customers",
  description:
    "See how companies use ParadeDB to power search in Postgres. Read case studies from teams that replaced Elasticsearch with a single Postgres extension.",
  path: "/customers",
});

export default async function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const caseStudies = await getCaseStudyLinks();

  return (
    <CustomersLayoutClient caseStudies={caseStudies}>
      {children}
    </CustomersLayoutClient>
  );
}
