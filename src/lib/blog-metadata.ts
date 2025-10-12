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

export function generateBlogMetadata(
  dirPath: string
): Metadata {
  // Extract slug from directory path
  let slug: string;
  if (dirPath.includes('/blog/')) {
    slug = dirPath.split('/blog/')[1];
  } else if (dirPath.includes('/learn/')) {
    slug = dirPath.split('/learn/')[1];
  } else {
    // For paths like "search-concepts/full-text-search", use the full path as slug
    slug = dirPath;
  }

  // Determine if this is a blog or learn path
  const isLearnPath = slug.includes('/');
  const baseUrl = isLearnPath ? '/learn' : '/blog';
  
  // Always read from source directory (available in both dev and production)
  const sourceDir = join(process.cwd(), 'src', 'app', baseUrl.slice(1), slug);
  const metadataPath = join(sourceDir, 'metadata.json');
  let metadata: BlogMetadata;
  
  try {
    const metadataContents = readFileSync(metadataPath, 'utf8');
    metadata = JSON.parse(metadataContents);
  } catch (error) {
    // Fallback metadata if file doesn't exist
    metadata = {
      title: "Blog Post",
      date: new Date().toISOString(),
      author: "ParadeDB Team",
      description: "A blog post from ParadeDB",
      categories: [],
    };
  }

  // Construct URLs
  const url = `${siteConfig.url}${baseUrl}/${slug}`;
  const canonicalUrl = metadata.canonical || url;
  
  // Find OG/Twitter social sharing image
  let socialImageUrl: string | undefined;
  
  // Check for opengraph-image.png first (using source directory)
  const ogImagePath = join(sourceDir, 'images/opengraph-image.png');
  const twitterImagePath = join(sourceDir, 'images/twitter-image.png');
  const heroPngPath = join(sourceDir, 'images/hero.png');
  
  if (existsSync(ogImagePath)) {
    socialImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/opengraph-image.png`;
  } else if (existsSync(twitterImagePath)) {
    socialImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/twitter-image.png`;
  } else if (metadata.image && metadata.image.endsWith('.png')) {
    // Only use metadata image if it's PNG
    socialImageUrl = metadata.image.startsWith('http') ? metadata.image : `${siteConfig.url}${metadata.image}`;
  } else if (existsSync(heroPngPath)) {
    socialImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/hero.png`;
  }
  // Otherwise no social image (SVG hero images don't work for social sharing)
  
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
      images: socialImageUrl ? [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: socialImageUrl ? [socialImageUrl] : undefined,
    },
  };
}
