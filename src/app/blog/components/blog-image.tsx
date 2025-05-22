"use client";

import Image from "next/image";
import { useState } from "react";

// Default cover image that's guaranteed to exist
const DEFAULT_COVER_IMAGE = "/images/blog/default-cover.jpg";

// Function to check if a URL is valid
function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("/") || url.startsWith("http");
}

type BlogImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

export default function BlogImage({ src, alt, className, fill, width, height }: BlogImageProps) {
  // Start with validated source or default image
  const initialSrc = isValidUrl(src) ? (src as string) : DEFAULT_COVER_IMAGE;
  const [fallbackSrc, setFallbackSrc] = useState(initialSrc);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setFallbackSrc(DEFAULT_COVER_IMAGE);
  };

  return (
    <Image
      src={fallbackSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={handleError}
    />
  );
}
