import type { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/blog-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogMetadata(__dirname);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
