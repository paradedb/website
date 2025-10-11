import type { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/blog-metadata";
import metadata from "./metadata.json";
import heroImage from "./images/hero.svg";

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogMetadata(metadata, "elasticsearch-was-never-a-database", heroImage.src || heroImage);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}