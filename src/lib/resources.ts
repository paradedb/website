import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/app/learn");

export interface Resource {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
  type: string; // e.g., "guide", "tutorial", "documentation", "video"
  section: string; // Inferred from directory structure
  order?: number; // Optional ordering within section
  image?: string;
  canonical?: string;
  content: string;
}

export interface ResourceMetadata {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
  type: string;
  section: string; // Inferred from directory structure
  order?: number; // Optional ordering within section
  image?: string;
  canonical?: string;
}

export async function getAllResources(): Promise<ResourceMetadata[]> {
  const resources: ResourceMetadata[] = [];

  // Get all section directories from content directory
  if (fs.existsSync(contentDirectory)) {
    const sectionDirectories = fs
      .readdirSync(contentDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const sectionName of sectionDirectories) {
      const sectionPath = path.join(contentDirectory, sectionName);

      // Get all resource directories within this section
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
          const metadata = JSON.parse(metadataContents);

          // Convert section directory name to readable format
          const sectionDisplay = sectionName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          resources.push({
            slug: `${sectionName}/${resourceSlug}`, // Include section in slug for unique identification
            title: metadata.title,
            date: metadata.date,
            author: metadata.author,
            description: metadata.description,
            categories: metadata.categories,
            type: metadata.type,
            section: sectionDisplay,
            order: metadata.order,
            image: metadata.image,
            canonical: metadata.canonical,
          });
        }
      }
    }
  }

  // Sort resources by date (newest first)
  return resources.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getResourceBySlug(
  slug: string,
): Promise<Resource | null> {
  // slug is now in format "section-name/resource-name"
  const resourcePath = path.join(contentDirectory, slug);
  const metadataPath = path.join(resourcePath, "metadata.json");
  const mdxPath = path.join(resourcePath, "index.mdx");

  if (!fs.existsSync(metadataPath) || !fs.existsSync(mdxPath)) {
    return null;
  }

  const metadataContents = fs.readFileSync(metadataPath, "utf8");
  const metadata = JSON.parse(metadataContents);
  const content = fs.readFileSync(mdxPath, "utf8");

  // Extract section name from slug
  const sectionName = slug.split("/")[0];
  const sectionDisplay = sectionName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    slug,
    title: metadata.title,
    date: metadata.date,
    author: metadata.author,
    description: metadata.description,
    categories: metadata.categories,
    type: metadata.type,
    section: sectionDisplay,
    order: metadata.order,
    image: metadata.image,
    canonical: metadata.canonical,
    content,
  };
}

export async function getAllResourceSlugs(): Promise<string[]> {
  const resources = await getAllResources();
  return resources.map((resource) => resource.slug);
}

export interface ResourceLink {
  name: string;
  href: string;
  date: string;
  author: string;
  description: string;
  type: string;
  section: string;
  order?: number;
  categories?: string[];
}

export async function getResourceLinks(): Promise<ResourceLink[]> {
  const resources = await getAllResources();
  return resources.map((resource) => ({
    name: resource.title,
    href: resource.slug,
    date: resource.date,
    author: resource.author,
    description: resource.description,
    type: resource.type,
    section: resource.section,
    order: resource.order,
    categories: resource.categories,
  }));
}

export interface ResourceSection {
  name: string;
  resources: ResourceLink[];
}

export async function getResourcesBySection(): Promise<ResourceSection[]> {
  const resources = await getResourceLinks();
  const sectionMap = new Map<string, ResourceLink[]>();

  resources.forEach((resource) => {
    const section = resource.section;
    if (!sectionMap.has(section)) {
      sectionMap.set(section, []);
    }
    sectionMap.get(section)!.push(resource);
  });

  return Array.from(sectionMap.entries()).map(([name, resources]) => ({
    name,
    resources: resources.sort((a, b) => {
      // Sort by order field if both have it
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // If only one has order, it comes first
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      // Fall back to date sorting (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }),
  }));
}
