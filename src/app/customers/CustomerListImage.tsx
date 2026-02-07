"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface CustomerListImageProps {
  slug: string;
  title: string;
}

export default function CustomerListImage({
  slug,
  title,
}: CustomerListImageProps) {
  const [heroImage, setHeroImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const pngImage = await import(`./${slug}/images/hero.png`);
        setHeroImage(pngImage.default);
      } catch {
        try {
          const svgImage = await import(`./${slug}/images/hero.svg`);
          setHeroImage(svgImage.default);
        } catch {
          try {
            const ogImage = await import(
              `./${slug}/images/opengraph-image.png`
            );
            setHeroImage(ogImage.default);
          } catch {
            setHeroImage(null);
          }
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
    <Image
      src={heroImage}
      alt={title}
      fill
      className="object-cover object-top rounded-t-lg"
    />
  );
}
