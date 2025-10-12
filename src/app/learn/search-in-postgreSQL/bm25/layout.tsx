import type { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/blog-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const slug = "search-in-postgreSQL/bm25";
  return generateBlogMetadata(slug);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}