import {
  getAllContent,
  getContentBySlug,
  getContentBySection,
  ContentLink,
  ContentSection,
  ContentConfig,
} from "./content";

const SECTION_DISPLAY_NAMES: Record<string, string> = {
  "search-concepts": "Search Concepts",
  "search-in-postgresql": "Search In PostgreSQL",
  tantivy: "Tantivy",
};

function formatSectionName(sectionName: string): string {
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

const learnConfig: ContentConfig = {
  type: "learn",
  basePath: "src/app/learn",
  baseUrl: "/learn",
  sectionDisplayNames: SECTION_DISPLAY_NAMES,
  sectionOrder: {
    "Search Concepts": 1,
    "Search In PostgreSQL": 2,
    Tantivy: 3,
  },
  formatSectionName,
};

export interface Resource {
  slug: string;
  title: string;
  date: string;
  author: string | string[];
  description: string;
  categories?: string[];
  type: string;
  section: string;
  order?: number;
  image?: string;
  canonical?: string;
  content: string;
}

export interface ResourceMetadata {
  slug: string;
  title: string;
  date: string;
  author: string | string[];
  description: string;
  categories?: string[];
  type: string;
  section: string;
  order?: number;
  image?: string;
  canonical?: string;
}

export async function getAllResources(): Promise<ResourceMetadata[]> {
  const items = await getAllContent(learnConfig);
  return items.map((item) => ({
    slug: item.href,
    title: item.name,
    date: item.date,
    author: item.author,
    description: item.description,
    categories: item.categories,
    type: item.type || "guide",
    section: item.section || "",
    order: item.order,
    image: undefined,
    canonical: undefined,
  }));
}

export async function getResourceBySlug(
  slug: string,
): Promise<Resource | null> {
  const content = await getContentBySlug(slug, learnConfig);
  if (!content) return null;

  const metadata = content.metadata as any;

  const learnMetadata = metadata as any;
  return {
    slug: content.slug,
    title: learnMetadata.title,
    date: learnMetadata.date,
    author: learnMetadata.author,
    description: learnMetadata.description,
    categories: learnMetadata.categories,
    type: learnMetadata.type || "guide",
    section: learnMetadata.section || "",
    order: learnMetadata.order,
    image: learnMetadata.image,
    canonical: learnMetadata.canonical,
    content: content.content,
  };
}

export async function getAllResourceSlugs(): Promise<string[]> {
  const items = await getAllContent(learnConfig);
  return items.map((item) => item.href);
}

export type { ContentLink as ResourceLink };

export async function getResourceLinks(): Promise<ContentLink[]> {
  return getAllContent(learnConfig);
}

export type { ContentSection as ResourceSection };

export async function getResourcesBySection(): Promise<ContentSection[]> {
  return getContentBySection(learnConfig);
}
