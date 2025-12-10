"use client";

import { HeroImage } from "@/components/HeroImage";
import { useState, useEffect } from "react";

interface BlogListImageProps {
  slug: string;
  title: string;
}

export default function BlogListImage({ slug, title }: BlogListImageProps) {
  const [heroImage, setHeroImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        // Try to import the PNG first
        const pngImage = await import(`./${slug}/images/hero.png`);
        setHeroImage(pngImage.default);
      } catch {
        try {
          // Fallback to SVG
          const svgImage = await import(`./${slug}/images/hero.svg`);
          setHeroImage(svgImage.default);
        } catch {
          console.error(`Could not load hero image for ${slug}`);
        }
      }
      setLoading(false);
    };

    loadHeroImage();
  }, [slug]);

  if (loading || !heroImage) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <HeroImage
      src={heroImage}
      alt={title}
      className="w-full h-full object-cover object-top"
    />
  );
}
