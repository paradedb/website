import {
  getAllContent,
  getContentBySlug,
  ContentLink,
  ContentConfig,
} from "./content";

const blogConfig: ContentConfig = {
  type: "blog",
  basePath: "src/app/blog",
  baseUrl: "/blog",
};

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string | string[];
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
  author: string | string[];
  description: string;
  categories?: string[];
  image?: string;
  canonical?: string;
}

export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const items = await getAllContent(blogConfig);
  return items.map((item) => ({
    slug: item.href,
    title: item.name,
    date: item.date,
    author: item.author,
    description: item.description,
    categories: item.categories,
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const content = await getContentBySlug(slug, blogConfig);
  if (!content) return null;

  return {
    slug: content.slug,
    title: content.metadata.title,
    date: content.metadata.date,
    author: content.metadata.author,
    description: content.metadata.description,
    categories: content.metadata.categories,
    image: content.metadata.image,
    canonical: content.metadata.canonical,
    content: content.content,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const items = await getAllContent(blogConfig);
  return items.map((item) => item.href);
}

export type { ContentLink as BlogLink };

export async function getBlogLinks(): Promise<ContentLink[]> {
  return getAllContent(blogConfig);
}
