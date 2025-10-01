import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import TableOfContents from "@/components/TableOfContents";
import fs from "fs";
import path from "path";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // Use custom canonical URL if provided, otherwise default to blog location
  const canonicalUrl = post.canonical || `https://paradedb.com/blog/${params.slug}`;
  const blogUrl = `https://paradedb.com/blog/${params.slug}`;

  // Check for post-specific OG and Twitter images
  const ogImagePath = path.join(process.cwd(), 'public', 'blog', params.slug, 'images', 'opengraph-image.png');
  const twitterImagePath = path.join(process.cwd(), 'public', 'blog', params.slug, 'images', 'twitter-image.png');
  
  const hasCustomOgImage = fs.existsSync(ogImagePath);
  const hasCustomTwitterImage = fs.existsSync(twitterImagePath);
  
  const ogImageUrl = hasCustomOgImage 
    ? `https://paradedb.com/blog/${params.slug}/images/opengraph-image.png`
    : "https://paradedb.com/opengraph-image.png";
    
  const twitterImageUrl = hasCustomTwitterImage
    ? `https://paradedb.com/blog/${params.slug}/images/twitter-image.png`
    : "https://paradedb.com/twitter-image.png";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: blogUrl,
      title: post.title,
      description: post.description,
      siteName: "ParadeDB",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [twitterImageUrl],
    },
  };
}

// Client component for blog content
const BlogContent = dynamic(() => import("./content"), { ssr: true });

export default async function BlogPost({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="prose w-full max-w-3xl">
        <BlogContent slug={params.slug} />
      </article>
      <TableOfContents />
    </>
  );
}