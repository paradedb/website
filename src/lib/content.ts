import fs from "fs";
import path from "path";

export type ContentType = "blog" | "learn";

export interface BaseContentMetadata {
  title: string;
  date: string;
  author: string | string[];
  description: string;
  categories?: string[];
  image?: string;
  canonical?: string;
  order?: number;
  hideHeroImage?: boolean;
  hideAuthor?: boolean;
}

export interface BlogContentMetadata extends BaseContentMetadata {
  type?: never;
  section?: never;
}

export interface LearnContentMetadata extends BaseContentMetadata {
  type?: string;
  section?: string;
}

export type ContentMetadata = BlogContentMetadata | LearnContentMetadata;

export interface BaseContent {
  slug: string;
  metadata: ContentMetadata;
  content: string;
}

export interface ContentLink {
  name: string;
  href: string;
  date: string;
  author: string | string[];
  description: string;
  categories?: string[];
  type?: string;
  section?: string;
  order?: number;
}

export interface ContentConfig {
  type: ContentType;
  basePath: string;
  baseUrl: string;
  sectionDisplayNames?: Record<string, string>;
  sectionOrder?: Record<string, number>;
  formatSectionName?: (sectionName: string) => string;
}

const SECTION_DISPLAY_NAMES: Record<string, string> = {
  "search-concepts": "Search Concepts",
  "search-in-postgresql": "Search In PostgreSQL",
  tantivy: "Tantivy",
};

function defaultFormatSectionName(sectionName: string): string {
  if (Object.hasOwn(SECTION_DISPLAY_NAMES, sectionName)) {
    return SECTION_DISPLAY_NAMES[sectionName];
  }

  const specialCases: Record<string, string> = {
    postgresql: "PostgreSQL",
  };

  return sectionName
    .split("-")
    .map((word) => {
      const lowerWord = word.toLowerCase();
      return (
        specialCases[lowerWord] ?? word.charAt(0).toUpperCase() + word.slice(1)
      );
    })
    .join(" ");
}

export async function getAllContent(
  config: ContentConfig,
): Promise<ContentLink[]> {
  const contentDirectory = path.join(process.cwd(), config.basePath);
  const items: ContentLink[] = [];

  if (!fs.existsSync(contentDirectory)) {
    return items;
  }

  if (config.type === "blog") {
    const postDirectories = fs
      .readdirSync(contentDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const slug of postDirectories) {
      const metadataPath = path.join(contentDirectory, slug, "metadata.json");
      const mdxPath = path.join(contentDirectory, slug, "index.mdx");

      if (fs.existsSync(metadataPath) && fs.existsSync(mdxPath)) {
        const metadataContents = fs.readFileSync(metadataPath, "utf8");
        const metadata = JSON.parse(metadataContents) as BlogContentMetadata;

        items.push({
          name: metadata.title,
          href: slug,
          date: metadata.date,
          author: metadata.author,
          description: metadata.description,
          categories: metadata.categories,
          order: metadata.order,
        });
      }
    }
  } else {
    const sectionDirectories = fs
      .readdirSync(contentDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const sectionName of sectionDirectories) {
      const sectionPath = path.join(contentDirectory, sectionName);

      const resourceDirectories = fs
        .readdirSync(sectionPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      for (const resourceSlug of resourceDirectories) {
        const resourcePath = path.join(sectionPath, resourceSlug);
        const metadataPath = path.join(resourcePath, "metadata.json");
        const mdxPath = path.join(resourcePath, "index.mdx");

        if (fs.existsSync(metadataPath) && fs.existsSync(mdxPath)) {
          const metadataContents = fs.readFileSync(metadataPath, "utf8");
          const metadata = JSON.parse(metadataContents) as LearnContentMetadata;

          const formatSection =
            config.formatSectionName || defaultFormatSectionName;
          const sectionDisplay = formatSection(sectionName);

          items.push({
            name: metadata.title,
            href: `${sectionName}/${resourceSlug}`,
            date: metadata.date,
            author: metadata.author,
            description: metadata.description,
            categories: metadata.categories,
            type: metadata.type || "guide",
            section: sectionDisplay,
            order: metadata.order,
          });
        }
      }
    }
  }

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getContentBySlug(
  slug: string,
  config: ContentConfig,
): Promise<BaseContent | null> {
  const contentDirectory = path.join(process.cwd(), config.basePath);
  const contentPath = path.join(contentDirectory, slug);
  const metadataPath = path.join(contentPath, "metadata.json");
  const mdxPath = path.join(contentPath, "index.mdx");

  if (!fs.existsSync(metadataPath) || !fs.existsSync(mdxPath)) {
    return null;
  }

  const metadataContents = fs.readFileSync(metadataPath, "utf8");
  const metadata = JSON.parse(metadataContents) as ContentMetadata;
  const content = fs.readFileSync(mdxPath, "utf8");

  if (config.type === "learn" && !metadata.section) {
    const sectionName = slug.split("/")[0];
    const formatSection = config.formatSectionName || defaultFormatSectionName;
    (metadata as LearnContentMetadata).section = formatSection(sectionName);
  }

  return {
    slug,
    metadata,
    content,
  };
}

export interface ContentSection {
  name: string;
  items: ContentLink[];
}

export async function getContentBySection(
  config: ContentConfig,
): Promise<ContentSection[]> {
  const items = await getAllContent(config);
  const sectionMap = new Map<string, ContentLink[]>();

  items.forEach((item) => {
    const section = item.section || "Uncategorized";
    if (!sectionMap.has(section)) {
      sectionMap.set(section, []);
    }
    sectionMap.get(section)!.push(item);
  });

  const sectionOrder = config.sectionOrder || {};

  return Array.from(sectionMap.entries())
    .map(([name, sectionItems]) => ({
      name,
      items: sectionItems.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }),
    }))
    .sort((a, b) => {
      const orderA = sectionOrder[a.name] ?? 999;
      const orderB = sectionOrder[b.name] ?? 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.name.localeCompare(b.name);
    });
}
