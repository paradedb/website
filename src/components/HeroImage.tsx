import Image, { type StaticImageData } from "next/image";

type HeroImageSource = string | StaticImageData;

interface HeroImageProps {
  src?: HeroImageSource;
  alt?: string;
  className?: string;
  metadata?: {
    title?: string;
    hideHeroImage?: boolean;
  };
  heroImage?: HeroImageSource;
}

export function HeroImage({
  src,
  alt,
  className = "rounded-xl mt-3",
  metadata,
  heroImage,
}: HeroImageProps) {
  // Check if hero image is disabled in metadata
  if (metadata?.hideHeroImage) return null;

  // Use explicit src if provided, otherwise use heroImage from content loader
  const imageSrc = src || heroImage;

  if (!imageSrc) {
    return null;
  }

  // Use metadata title as alt text if no alt provided
  const imageAlt = alt || metadata?.title || "Hero image";

  return <Image src={imageSrc} alt={imageAlt} className={className} />;
}
