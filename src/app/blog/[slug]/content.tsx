"use client";

import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "@/components/mdx";
import { AuthorSection } from "@/components/AuthorSection";
import { HeroImage } from "@/components/HeroImage";
import { Title } from "@/components/Title";

interface ContentProps {
  slug: string;
}

interface BlogMetadata {
  title: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
  heroImage?: string;
  hideTitle?: boolean;
  hideAuthor?: boolean;
  hideHeroImage?: boolean;
}

export default function Content({ slug }: ContentProps) {
  const [BlogContent, setBlogContent] = useState<React.ComponentType | null>(null);
  const [metadata, setMetadata] = useState<BlogMetadata | null>(null);
  const [heroImage, setHeroImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const [mdxModule, metadataModule] = await Promise.all([
          import(`@/content/blog/${slug}/index.mdx`),
          import(`@/content/blog/${slug}/metadata.json`)
        ]);
        
        // Try to load hero image (try .png first, then .svg)
        let heroImageModule = null;
        try {
          heroImageModule = await import(`@/content/blog/${slug}/images/hero.png`);
        } catch {
          try {
            heroImageModule = await import(`@/content/blog/${slug}/images/hero.svg`);
          } catch {
            console.log(`No hero image found for ${slug}`);
          }
        }
        
        
        setMetadata(metadataModule.default);
        setHeroImage(heroImageModule?.default);
        setBlogContent(() => (props: any) => mdxModule.default({ ...props, metadata: metadataModule.default }));
      } catch (err) {
        console.error(`Failed to load MDX for slug: ${slug}`, err);
        setError(`Blog post "${slug}" not found`);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !BlogContent) {
    return <div>{error || "Blog post not found"}</div>;
  }

  // Create enhanced components with metadata context
  const enhancedComponents = {
    ...mdxComponents,
    AuthorSection: (props: any) => <AuthorSection {...props} metadata={metadata} />,
    HeroImage: (props: any) => <HeroImage {...props} metadata={metadata} heroImage={heroImage} />,
    Title: (props: any) => <Title {...props} metadata={metadata} />,
  };

  return (
    <MDXProvider components={enhancedComponents}>
      <Title metadata={metadata} />
      <AuthorSection metadata={metadata} />
      <HeroImage metadata={metadata} heroImage={heroImage} />
      <BlogContent metadata={metadata} />
    </MDXProvider>
  );
}