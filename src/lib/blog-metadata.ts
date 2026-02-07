import type { Metadata } from "next";
import { siteConfig } from "@/app/siteConfig";
import { readFileSync, existsSync } from "fs";
import { join, sep } from "path";

/**
 * Generate metadata for section index pages (/blog, /learn, /customers).
 */
export function generateSectionMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@paradedb",
    },
    alternates: {
      canonical: url,
    },
  };
}

interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  author: string | string[];
  categories: string[];
  canonical?: string;
  image?: string;
}

/**
 * Generate metadata for both /blog/* and /learn/* content.
 */
export function generateBlogMetadata(dirPath: string): Metadata {
  // Find the last occurrence of /blog/, /learn/, or /customers/ in the path
  const blogIndex = dirPath.lastIndexOf(`${sep}blog${sep}`);
  const learnIndex = dirPath.lastIndexOf(`${sep}learn${sep}`);
  const customersIndex = dirPath.lastIndexOf(`${sep}customers${sep}`);

  // Determine baseUrl and extract slug based on which pattern appears last
  let baseUrl: string;
  let slug: string;

  const maxIndex = Math.max(blogIndex, learnIndex, customersIndex);

  if (maxIndex === customersIndex && customersIndex >= 0) {
    baseUrl = "/customers";
    slug = dirPath.split(`${sep}customers${sep}`).slice(-1)[0];
  } else if (maxIndex === learnIndex && learnIndex >= 0) {
    baseUrl = "/learn";
    slug = dirPath.split(`${sep}learn${sep}`).slice(-1)[0];
  } else if (maxIndex === blogIndex && blogIndex >= 0) {
    baseUrl = "/blog";
    slug = dirPath.split(`${sep}blog${sep}`).slice(-1)[0];
  } else {
    // Neither pattern found, fallback to /blog
    baseUrl = "/blog";
    slug = dirPath.split(sep).slice(-1)[0];
  }

  // Always read from source directory (available in both dev and production)
  const sourceDir = join(process.cwd(), "src", "app", baseUrl.slice(1), slug);
  const metadataPath = join(sourceDir, "metadata.json");
  let metadata: BlogMetadata;

  try {
    const metadataContents = readFileSync(metadataPath, "utf8");
    metadata = JSON.parse(metadataContents);
  } catch {
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

  // Find social sharing images
  let ogImageUrl: string | undefined;
  let twitterImageUrl: string | undefined;

  const opengraphImagePath = join(sourceDir, "images/opengraph-image.png");
  const twitterImagePath = join(sourceDir, "images/twitter-image.png");

  // OpenGraph image
  if (existsSync(opengraphImagePath)) {
    ogImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/opengraph-image.png`;
  } else {
    ogImageUrl = `${siteConfig.url}/opengraph-image.png`;
  }

  // Twitter image
  if (existsSync(twitterImagePath)) {
    twitterImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/twitter-image.png`;
  } else {
    twitterImageUrl = `${siteConfig.url}/twitter-image.png`;
  }

  return {
    // Force the final, fully-branded title for posts
    // This bypasses any weirdness with nested templates
    title: {
      absolute: `${metadata.title} | ${siteConfig.name}`,
    },
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
