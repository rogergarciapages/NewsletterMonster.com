// src/app/components/brand/newsletter/card/image.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

interface NewsletterImageProps {
  imageUrl: string | null;
  subject: string | null;
  brandname: string;
  newsletterId: number;
  priority?: boolean;
  showHoverEffect?: boolean;
}

const NewsletterImage = memo(
  ({
    imageUrl,
    subject,
    brandname,
    newsletterId,
    priority = false,
    showHoverEffect = true,
  }: NewsletterImageProps) => {
    if (!imageUrl) return null;

    const imageTitle = `${subject || "Newsletter"} by ${brandname} | NewsletterMonster.com`;
    const imageAlt = `${subject || "Newsletter"} by ${brandname}`;

    const imageContent = (
      <div className="group relative">
        <div className="aspect-[680/900] w-full">
          <div className="absolute inset-0 p-4">
            <div className="relative h-full w-full overflow-hidden rounded-md">
              <Image
                src={imageUrl}
                alt={imageAlt}
                title={imageTitle}
                fill
                className={`object-cover object-top ${
                  showHoverEffect ? "transition-transform duration-300 group-hover:scale-105" : ""
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                quality={85}
              />
              {/* ... rest of your component */}
            </div>
          </div>
        </div>
      </div>
    );

    return showHoverEffect ? (
      <Link
        href={`/${brandname}/${newsletterId}`}
        title={`View ${imageTitle}`}
        aria-label={`View ${imageAlt}`}
      >
        {imageContent}
      </Link>
    ) : (
      imageContent
    );
  }
);

NewsletterImage.displayName = "NewsletterImage";

export default NewsletterImage;
