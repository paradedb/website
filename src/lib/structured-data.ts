import { existsSync, readFileSync } from "fs";
import { join, sep } from "path";
import { siteConfig } from "@/app/siteConfig";
import { github, social } from "@/lib/links";

/**
 * Stable @id values let separate schema.org nodes reference one another
 * (e.g. an Article's `publisher` points at the Organization node).
 */
const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

const ORG_LOGO = `${siteConfig.url}/brand/paradedb-logo-light.svg`;

/** schema.org Organization — the publisher behind every page. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    legalName: "ParadeDB, Inc.",
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: ORG_LOGO,
    },
    description: siteConfig.description,
    sameAs: [github.REPO, social.TWITTER, social.LINKEDIN],
  };
}

/** schema.org WebSite — the marketing site as a whole. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": ORG_ID },
  };
}

/** schema.org SoftwareApplication — ParadeDB the product. */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Database",
    operatingSystem: "Linux, macOS, Docker, Kubernetes",
    description: siteConfig.description,
    url: siteConfig.url,
    downloadUrl: github.REPO,
    softwareHelp: "https://docs.paradedb.com",
    license: "https://github.com/paradedb/paradedb/blob/main/LICENSE",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

interface PostMetadata {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string | string[];
  categories?: string[];
  canonical?: string;
}

const SECTION_NAMES: Record<string, string> = {
  blog: "Blog",
  learn: "Learn",
  customers: "Customers",
};

/**
 * Resolve a content directory (passed as `__dirname` from a post layout) into
 * its public URL and on-disk source path. Mirrors the logic in
 * `blog-metadata.ts` so structured data stays in sync with page metadata.
 */
function resolvePost(dirPath: string) {
  const blogIndex = dirPath.lastIndexOf(`${sep}blog${sep}`);
  const learnIndex = dirPath.lastIndexOf(`${sep}learn${sep}`);
  const customersIndex = dirPath.lastIndexOf(`${sep}customers${sep}`);
  const maxIndex = Math.max(blogIndex, learnIndex, customersIndex);

  let section: "blog" | "learn" | "customers";
  let slug: string;

  if (maxIndex === customersIndex && customersIndex >= 0) {
    section = "customers";
    slug = dirPath.split(`${sep}customers${sep}`).slice(-1)[0];
  } else if (maxIndex === learnIndex && learnIndex >= 0) {
    section = "learn";
    slug = dirPath.split(`${sep}learn${sep}`).slice(-1)[0];
  } else {
    section = "blog";
    slug = dirPath.split(`${sep}blog${sep}`).slice(-1)[0];
  }

  const url = `${siteConfig.url}/${section}/${slug}`;
  const sourceDir = join(process.cwd(), "src", "app", section, slug);
  return { section, slug, url, sourceDir };
}

/**
 * Build Article (or BlogPosting) + BreadcrumbList schema for a content page.
 * Returns `null` when no metadata.json is present so callers can render nothing.
 */
export function getArticleStructuredData(dirPath: string): object[] | null {
  const { section, url, sourceDir } = resolvePost(dirPath);

  let metadata: PostMetadata;
  try {
    metadata = JSON.parse(
      readFileSync(join(sourceDir, "metadata.json"), "utf8"),
    );
  } catch {
    return null;
  }

  const canonical = metadata.canonical || url;
  const authors = Array.isArray(metadata.author)
    ? metadata.author
    : [metadata.author];

  const ogImagePath = join(sourceDir, "images/opengraph-image.png");
  const image = existsSync(ogImagePath)
    ? `${url}/images/opengraph-image.png`
    : `${siteConfig.url}/opengraph-image.png`;

  const article = {
    "@context": "https://schema.org",
    "@type": section === "blog" ? "BlogPosting" : "Article",
    headline: metadata.title,
    description: metadata.description,
    datePublished: metadata.date,
    dateModified: metadata.updated || metadata.date,
    author: authors.map((name) => ({ "@type": "Person", name })),
    publisher: { "@id": ORG_ID },
    image,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    isPartOf: { "@id": WEBSITE_ID },
    ...(metadata.categories?.length
      ? { keywords: metadata.categories.join(", ") }
      : {}),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: SECTION_NAMES[section],
        item: `${siteConfig.url}/${section}`,
      },
      { "@type": "ListItem", position: 3, name: metadata.title, item: url },
    ],
  };

  return [article, breadcrumb];
}
