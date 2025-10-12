import { Metadata } from "next";
import { siteConfig } from "../app/siteConfig";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import path from "path";

export interface BlogMetadata {
  title: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
  image?: string;
  canonical?: string;
}

export function generateBlogMetadata(
  slugOrMetadataOrDir: string | BlogMetadata, 
  slug?: string, 
  imageSrc?: string
): Metadata {
  let blogMetadata: BlogMetadata;
  let actualSlug: string;

  // Handle cases: directory path, slug, or metadata object
  if (typeof slugOrMetadataOrDir === "string") {
    // Case 1: Directory path (from __dirname) or direct slug
    if (slugOrMetadataOrDir.includes('src/app/')) {
      // This is a directory path, extract the slug
      if (slugOrMetadataOrDir.includes('/blog/')) {
        actualSlug = slugOrMetadataOrDir.split('/blog/')[1].replace('/layout.tsx', '');
      } else if (slugOrMetadataOrDir.includes('/learn/')) {
        actualSlug = slugOrMetadataOrDir.split('/learn/')[1].replace('/layout.tsx', '');
      } else {
        actualSlug = path.basename(slugOrMetadataOrDir);
      }
    } else {
      // This is a direct slug
      actualSlug = slugOrMetadataOrDir;
    }
    
    // Determine if this is a blog or learn path for metadata loading
    const isLearnPath = actualSlug.includes('/');
    const contentDirectory = isLearnPath 
      ? join(process.cwd(), "src/app/learn")
      : join(process.cwd(), "src/app/blog");
    const metadataPath = join(contentDirectory, actualSlug, "metadata.json");
    
    try {
      const metadataContents = readFileSync(metadataPath, "utf8");
      blogMetadata = JSON.parse(metadataContents);
    } catch (error) {
      // Fallback metadata if file doesn't exist
      blogMetadata = {
        title: "Blog Post",
        date: new Date().toISOString(),
        author: "ParadeDB Team",
        description: "A blog post from ParadeDB",
        categories: [],
      };
    }
  } else {
    // Case 2: Metadata object (from existing layout.tsx files)
    blogMetadata = slugOrMetadataOrDir;
    actualSlug = slug || "unknown";
  }

  // Determine if this is a blog or learn path for URL construction
  const isLearnPath = actualSlug.includes('/');
  const url = isLearnPath 
    ? `${siteConfig.url}/learn/${actualSlug}`
    : `${siteConfig.url}/blog/${actualSlug}`;
  const canonical = blogMetadata.canonical || url;
  
  // Use provided imageSrc if it's a PNG, otherwise use metadata image
  let imageUrl = (imageSrc && imageSrc.endsWith('.png')) ? imageSrc : blogMetadata.image;
  
  // If no image specified, check for opengraph-image.png, then hero.png
  if (!imageUrl) {
    // Determine if this is a blog or learn path
    const isLearnPath = actualSlug.includes('/');
    const basePath = isLearnPath ? 'src/app/learn' : 'src/app/blog';
    const urlPath = isLearnPath ? '/learn' : '/blog';
    
    const ogImagePath = join(process.cwd(), `${basePath}/${actualSlug}/images/opengraph-image.png`);
    const heroImagePath = join(process.cwd(), `${basePath}/${actualSlug}/images/hero.png`);
    
    if (existsSync(ogImagePath)) {
      imageUrl = `${urlPath}/${actualSlug}/images/opengraph-image.png`;
    } else if (existsSync(heroImagePath)) {
      imageUrl = `${urlPath}/${actualSlug}/images/hero.png`;
    }
  }

  return {
    title: blogMetadata.title,
    description: blogMetadata.description,
    authors: [{ name: blogMetadata.author }],
    openGraph: {
      title: blogMetadata.title,
      description: blogMetadata.description,
      url: url,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: blogMetadata.date,
      authors: [blogMetadata.author],
      tags: blogMetadata.categories,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blogMetadata.title,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blogMetadata.title,
      description: blogMetadata.description,
      creator: "@paradedb",
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: canonical,
    },
    keywords: blogMetadata.categories,
  };
}