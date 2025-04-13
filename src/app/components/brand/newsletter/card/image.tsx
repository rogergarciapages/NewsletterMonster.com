// src/app/components/brand/newsletter/card/image.tsx
"use client";

import Link from "next/dist/client/link";
import { memo } from "react";

import { IconMailOpened } from "@tabler/icons-react";

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

// src/app/components/brand/newsletter/card/image.tsx

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

    const imageTitle = `${subject || "Newsletter"} by ${brandname} | NewsletterMonster`;
    const imageAlt = `${subject || "Newsletter"} by ${brandname}`;

    const imageContent = (
      <div className="group relative">
        <div className="relative w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            title={imageTitle}
            className={`h-auto w-full ${
              showHoverEffect ? "transition-transform duration-300 group-hover:scale-105" : ""
            }`}
          />
          {showHoverEffect && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-torch-600/0 opacity-0 transition-all duration-300 group-hover:bg-torch-600/90 group-hover:opacity-100">
              <div className="flex translate-y-4 transform flex-col items-center gap-3 transition-transform duration-300 group-hover:translate-y-0">
                <IconMailOpened
                  className="h-16 w-16 text-white"
                  strokeWidth={2}
                  aria-hidden="true"
                  title="Open newsletter"
                />
                <span className="text-xl font-bold tracking-tighter text-white">Open It!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );

    return showHoverEffect ? (
      <Link
        href={`/brand/${brandname}/${newsletterId}`}
        title={`Read ${subject || "Newsletter"} by ${brandname}`}
        aria-label={`Read ${subject || "Newsletter"} by ${brandname}`}
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
