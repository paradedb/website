import { existsSync, readFileSync } from "fs";
import { join, sep } from "path";
import { siteConfig } from "@/app/siteConfig";
import { email, github, social } from "@/lib/links";

/** Strip the `mailto:` prefix from a links.ts email entry. */
function mailto(value: string) {
  return value.replace(/^mailto:/, "");
}

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
    email: mailto(email.HELLO),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: mailto(email.SUPPORT),
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: mailto(email.SALES),
      },
    ],
    sameAs: [github.ORG, social.TWITTER, social.LINKEDIN],
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

/**
 * A `SoftwareApplication` schema previously lived here and was emitted on every
 * page via the root layout. It was removed because Google requires the type to
 * carry `name`, `offers.price`, AND one of `aggregateRating` or `review`
 * (https://developers.google.com/search/docs/appearance/structured-data/software-app).
 * We had no genuine rating/review data, so it was invalid on every page and
 * SEMrush flagged it across the whole site.
 *
 * To bring it back:
 *   1. Obtain REAL aggregate ratings or a real review — never fabricate them, as
 *      invented ratings violate Google's guidelines and risk a manual action.
 *   2. Add a `softwareApplicationSchema()` builder returning at minimum:
 *        name, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
 *        and aggregateRating: { "@type": "AggregateRating", ratingValue, ratingCount }
 *        (or a `review`). author/publisher can reference ORG_ID as before.
 *   3. Emit it ONLY on the product/homepage — not site-wide — since the schema
 *      makes no semantic sense on blog posts, which is what caused 55 errors.
 *   4. Validate with the Rich Results Test before shipping.
 */

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
