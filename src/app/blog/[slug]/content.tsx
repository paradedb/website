"use client";

import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "@/components/mdx";
import { AuthorSection } from "@/components/AuthorSection";
import { HeroImage } from "@/components/HeroImage";
import { Title } from "@/components/Title";
// If you use next/image, you can import type StaticImageData
// import type { StaticImageData } from "next/image";

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

// Optional: tighten this if you use next/image
type HeroImageSrc = string | /* StaticImageData | */ undefined;

export default function Content({ slug }: ContentProps) {
  const [BlogContent, setBlogContent] = useState<React.ComponentType | undefined>(undefined);
  const [metadata, setMetadata] = useState<BlogMetadata | undefined>(undefined);
  const [heroImage, setHeroImage] = useState<HeroImageSrc>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        setError(undefined);

        const [mdxModule, metadataModule] = await Promise.all([
          import(`@/content/blog/${slug}/index.mdx`),
          import(`@/content/blog/${slug}/metadata.json`),
        ]);

        // Try to load hero image (try .png first, then .svg)
        let heroImageModule: { default: HeroImageSrc } | undefined;
        try {
          heroImageModule = await import(`@/content/blog/${slug}/images/hero.png`);
        } catch {
          try {
            heroImageModule = await import(`@/content/blog/${slug}/images/hero.svg`);
          } catch {
            // no hero image — that's fine
          }
        }

        setMetadata(metadataModule?.default as BlogMetadata | undefined);
        setHeroImage(heroImageModule?.default);

        // Inject metadata into MDX default export
        setBlogContent(() => (props: any) =>
          mdxModule.default({ ...props, metadata: metadataModule?.default as BlogMetadata | undefined })
        );
      } catch (err) {
        console.error(`Failed to load MDX for slug: ${slug}`, err);
        setError(`Blog post "${slug}" not found`);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error || !BlogContent) return <div>{error || "Blog post not found"}</div>;

  // Components accept `metadata?: ...`, so passing `metadata` (possibly undefined) is OK now.
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
      <BlogContent />
    </MDXProvider>
  );
}
