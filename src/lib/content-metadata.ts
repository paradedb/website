import type { Metadata } from "next";
import { siteConfig } from "@/app/siteConfig";
import { readFileSync, existsSync } from "fs";
import { join, sep } from "path";
import { ContentType } from "./content";

interface BaseContentMetadata {
  title: string;
  description: string;
  date: string;
  author: string | string[];
  categories?: string[];
  canonical?: string;
  image?: string;
}

export function generateContentMetadata(
  dirPath: string,
  contentType: ContentType = "blog",
): Metadata {
  const baseUrl = contentType === "learn" ? "/learn" : "/blog";
  const slug =
    dirPath.split(`${sep}${contentType}${sep}`).slice(-1)[0] ||
    dirPath.split(sep).slice(-1)[0];

  const sourceDir = join(process.cwd(), "src", "app", contentType, slug);
  const metadataPath = join(sourceDir, "metadata.json");
  let metadata: BaseContentMetadata;

  try {
    const metadataContents = readFileSync(metadataPath, "utf8");
    metadata = JSON.parse(metadataContents);
  } catch {
    metadata = {
      title: contentType === "learn" ? "Learn Resource" : "Blog Post",
      date: new Date().toISOString(),
      author: "ParadeDB Team",
      description: `A ${contentType} from ParadeDB`,
      categories: [],
    };
  }

  const url = `${siteConfig.url}${baseUrl}/${slug}`;
  const canonicalUrl = metadata.canonical || url;

  let ogImageUrl: string | undefined;
  let twitterImageUrl: string | undefined;

  const opengraphImagePath = join(sourceDir, "images/opengraph-image.png");
  const twitterImagePath = join(sourceDir, "images/twitter-image.png");

  if (existsSync(opengraphImagePath)) {
    ogImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/opengraph-image.png`;
  } else {
    ogImageUrl = `${siteConfig.url}/opengraph-image.png`;
  }

  if (existsSync(twitterImagePath)) {
    twitterImageUrl = `${siteConfig.url}${baseUrl}/${slug}/images/twitter-image.png`;
  } else {
    twitterImageUrl = `${siteConfig.url}/twitter-image.png`;
  }

  return {
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

export function generateSectionMetadata(
  title: string,
  description: string,
  url: string,
): Metadata {
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
