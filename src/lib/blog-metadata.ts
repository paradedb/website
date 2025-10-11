import type { Metadata } from "next";
import { siteConfig } from "@/app/siteConfig";

interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  author: string | string[];
  categories: string[];
}

export function generateBlogMetadata(
  metadata: BlogMetadata & { canonical?: string },
  slug: string,
  heroImageUrl: string | any
): Metadata {
  const url = `${siteConfig.url}/blog/${slug}`;
  const canonicalUrl = metadata.canonical || url;
  const imageUrl = typeof heroImageUrl === 'string' ? heroImageUrl : heroImageUrl?.src || heroImageUrl;
  const fullHeroImageUrl = imageUrl && imageUrl.startsWith('http') ? imageUrl : `${siteConfig.url}${imageUrl}`;
  
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: metadata.date,
      authors: Array.isArray(metadata.author) ? metadata.author : [metadata.author],
      images: [
        {
          url: fullHeroImageUrl,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [fullHeroImageUrl],
    },
  };
}