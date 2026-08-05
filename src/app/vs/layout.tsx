import type { Metadata } from "next";
import { generateSectionMetadata } from "@/lib/blog-metadata";
import VsLayoutClient from "./layout-client";

export const metadata: Metadata = generateSectionMetadata({
  title: "Compare ParadeDB",
  description:
    "Side-by-side comparisons between ParadeDB and other databases and search engines.",
  path: "/vs",
});

export default function VsLayout({ children }: { children: React.ReactNode }) {
  return <VsLayoutClient>{children}</VsLayoutClient>;
}
