import type { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/blog-metadata";
import { BlogPageClient } from "./page-client";

export async function generateStaticParams() {
  const fs = await import('fs');
  const path = await import('path');
  
  const blogDir = path.join(process.cwd(), 'src/app/blog');
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  
  return entries
    .filter(entry => {
      if (!entry.isDirectory() || entry.name === '[slug]') return false;
      
      // Only include directories that have an index.mdx file
      const mdxPath = path.join(blogDir, entry.name, 'index.mdx');
      return fs.existsSync(mdxPath);
    })
    .map(entry => ({ slug: entry.name }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return generateBlogMetadata(params.slug);
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  return <BlogPageClient slug={params.slug} />;
}