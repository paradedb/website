import type { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/blog-metadata";
import { LearnPageClient } from "./page-client";

export async function generateStaticParams() {
  // Hardcode for now to test
  return [
    { slug: ['search-concepts', 'bm25'] },
    { slug: ['search-concepts', 'full-text-search'] },
    { slug: ['search-concepts', 'vector-search'] },
    { slug: ['search-concepts', 'hybrid-search'] },
    { slug: ['search-concepts', 'tokenization'] },
    { slug: ['search-concepts', 'reciprocal-rank-fusion'] },
    { slug: ['search-in-postgreSQL', 'introduction'] },
    { slug: ['search-in-postgreSQL', 'bm25'] },
  ];
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slugPath = params.slug.join('/');
  return generateBlogMetadata(slugPath);
}

export default function LearnPage({ params }: { params: { slug: string[] } }) {
  const slugPath = params.slug.join('/');
  return <LearnPageClient slug={slugPath} />;
}