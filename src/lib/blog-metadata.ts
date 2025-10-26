import type { Metadata } from "next";
import { siteConfig } from "@/app/siteConfig";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  author: string | string[];
  categories: string[];
  canonical?: string;
  image?: string;
}

export function generateBlogMetadata(dirPath: string): Metadata {
  // Extract slug from directory path
  let slug: string;
  if (dirPath.includes("/blog/")) {
    slug = dirPath.split("/blog/")[1];
  } else if (dirPath.includes("/learn/")) {
    slug = dirPath.split("/learn/")[1];
  } else {
    // For paths like "search-concepts/full-text-search", use the full path as slug
    slug = dirPath;
  }

  // Determine if this is a blog or learn path
  const isLearnPath = slug.includes("/");
  const baseUrl = isLearnPath ? "/learn" : "/blog";

  // Always read from source directory (available in both dev and production)
  const sourceDir = join(process.cwd(), "src", "app", baseUrl.slice(1), slug);
  const metadataPath = join(sourceDir, "metadata.json");
  let metadata: BlogMetadata;

  try {
    const metadataContents = readFileSync(metadataPath, "utf8");
    metadata = JSON.parse(metadataContents);
  } catch (error) {
    // Fallback metadata if file doesn't exist
    metadata = {
      title: "Blog Post - ParadeDB",
      date: new Date().toISOString(),
      author: "ParadeDB Team",
      description: "A blog post from ParadeDB",
      categories: [],
    };
  }

  // Construct URLs
  const url = `${siteConfig.url}${baseUrl}/${slug}`;
  const canonicalUrl = metadata.canonical || url;

  // Find social sharing images
  let ogImageUrl: string | undefined;
  let twitterImageUrl: string | undefined;

  // Check for Next.js special files in images directory (automatically served by Next.js)
  const opengraphImagePath = join(sourceDir, "images/opengraph-image.png");
  const twitterImagePath = join(sourceDir, "images/twitter-image.png");

  // OpenGraph image
  if (existsSync(opengraphImagePath)) {
    ogImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/opengraph-image.png`;
  } else {
    // Fallback to site-wide OG image
    ogImageUrl = `${siteConfig.url}/opengraph-image.png`;
  }

  // Twitter image
  if (existsSync(twitterImagePath)) {
    twitterImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/twitter-image.png`;
  } else {
    // Fallback to site-wide Twitter image or OG image
    twitterImageUrl = `${siteConfig.url}/twitter-image.png`;
  }

  return {
    title: `${metadata.title} - ParadeDB`,
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
      authors: Array.isArray(metadata.author)
        ? metadata.author
        : [metadata.author],
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: metadata.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };
}
