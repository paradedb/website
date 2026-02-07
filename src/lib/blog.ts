import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/app/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
  image?: string;
  canonical?: string;
  content: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
  image?: string;
  canonical?: string;
}

export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const posts: BlogPostMetadata[] = [];

  // Get all posts from content directory
  if (fs.existsSync(contentDirectory)) {
    const postDirectories = fs
      .readdirSync(contentDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const slug of postDirectories) {
      const metadataPath = path.join(contentDirectory, slug, "metadata.json");
      const mdxPath = path.join(contentDirectory, slug, "index.mdx");

      if (fs.existsSync(metadataPath) && fs.existsSync(mdxPath)) {
        const metadataContents = fs.readFileSync(metadataPath, "utf8");
        const metadata = JSON.parse(metadataContents);

        posts.push({
          slug,
          title: metadata.title,
          date: metadata.date,
          author: metadata.author,
          description: metadata.description,
          categories: metadata.categories,
          image: metadata.image,
          canonical: metadata.canonical,
        });
      }
    }
  }

  // Sort posts by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const metadataPath = path.join(contentDirectory, slug, "metadata.json");
  const mdxPath = path.join(contentDirectory, slug, "index.mdx");

  if (!fs.existsSync(metadataPath) || !fs.existsSync(mdxPath)) {
    return null;
  }

  const metadataContents = fs.readFileSync(metadataPath, "utf8");
  const metadata = JSON.parse(metadataContents);
  const content = fs.readFileSync(mdxPath, "utf8");

  return {
    slug,
    title: metadata.title,
    date: metadata.date,
    author: metadata.author,
    description: metadata.description,
    categories: metadata.categories,
    image: metadata.image,
    canonical: metadata.canonical,
    content,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export interface BlogLink {
  name: string;
  href: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
}

export async function getCaseStudyLinks(): Promise<BlogLink[]> {
  const customersDir = path.join(process.cwd(), "src/app/customers");
  const links: BlogLink[] = [];

  if (fs.existsSync(customersDir)) {
    const dirs = fs
      .readdirSync(customersDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const slug of dirs) {
      const metadataPath = path.join(customersDir, slug, "metadata.json");
      const mdxPath = path.join(customersDir, slug, "index.mdx");

      if (fs.existsSync(metadataPath) && fs.existsSync(mdxPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
        links.push({
          name: metadata.title,
          href: slug,
          date: metadata.date,
          author: metadata.author,
          description: metadata.description,
          categories: metadata.categories,
        });
      }
    }
  }

  return links.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getBlogLinks(): Promise<BlogLink[]> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    name: post.title,
    href: post.slug,
    date: post.date,
    author: post.author,
    description: post.description,
    categories: post.categories,
  }));
}

export interface BlogSection {
  name: string;
  links: BlogLink[];
}

const BLOG_CATEGORY_MAP: Record<string, string> = {
  announcement: "Announcements",
  release: "Announcements",
};

const BLOG_SECTION_ORDER: Record<string, number> = {
  Engineering: 1,
  Announcements: 2,
};

export async function getBlogLinksByCategory(): Promise<BlogSection[]> {
  const links = await getBlogLinks();
  const sectionMap = new Map<string, BlogLink[]>();

  for (const link of links) {
    let sectionName = "Engineering";
    if (link.categories) {
      for (const category of link.categories) {
        if (BLOG_CATEGORY_MAP[category]) {
          sectionName = BLOG_CATEGORY_MAP[category];
          break;
        }
      }
    }
    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, []);
    }
    sectionMap.get(sectionName)!.push(link);
  }

  return Array.from(sectionMap.entries())
    .map(([name, links]) => ({ name, links }))
    .sort((a, b) => {
      const orderA = BLOG_SECTION_ORDER[a.name] ?? 999;
      const orderB = BLOG_SECTION_ORDER[b.name] ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });
}
