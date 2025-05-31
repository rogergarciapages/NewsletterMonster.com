"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
  priority?: boolean;
};

export default function BlogImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
}: BlogImageProps) {
  // Only verify URL on the client side to avoid hydration mismatch
  // Initially use whatever source was passed in, even if it might be invalid
  const [fallbackSrc, setFallbackSrc] = useState<string>(src as string);

  // Update the image source on the client side after hydration
  useEffect(() => {
    // Validate URL only after component is mounted (client-side)
    if (!isValidUrl(src)) {
      setFallbackSrc(DEFAULT_COVER_IMAGE);
    }
  }, [src]);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setFallbackSrc(DEFAULT_COVER_IMAGE);
  };

  return (
    <Image
      src={fallbackSrc || DEFAULT_COVER_IMAGE} // Ensure we never pass undefined or null
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      style={{ objectFit: "cover" }}
      onError={handleError}
      priority={priority}
    />
  );
}
