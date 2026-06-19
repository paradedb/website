import type { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/blog-metadata";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogMetadata(__dirname);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ArticleJsonLd dirPath={__dirname} />
      {children}
    </>
  );
}
