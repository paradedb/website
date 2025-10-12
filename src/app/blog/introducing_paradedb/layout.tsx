import type { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/blog-metadata";
import path from "path";

export async function generateMetadata(): Promise<Metadata> {
  const slug = path.basename(__dirname);
  return generateBlogMetadata(slug);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}