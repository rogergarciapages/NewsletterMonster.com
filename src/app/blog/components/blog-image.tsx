"use client";

import Image from "next/image";
import { useState } from "react";

type BlogImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

export default function BlogImage({ src, alt, className, fill, width, height }: BlogImageProps) {
  const [fallbackSrc, setFallbackSrc] = useState(src);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setFallbackSrc("/images/blog/default-cover.jpg");
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
