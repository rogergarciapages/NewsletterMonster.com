"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";

import { Newsletter } from "../../components/brand/newsletter/types";

// src/components/newsletters/newsletter-card.tsx

interface NewsletterCardProps {
  newsletter: Newsletter;
  priority?: boolean;
}

export function NewsletterCard({ newsletter, priority = false }: NewsletterCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions
    return (
      <div className="relative aspect-[3/4] w-full rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      </div>
    );
  }
  const handleSenderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${slugify(newsletter.sender || "")}`);
  };

  // Format date with null check
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  // Default image for newsletters without a screenshot
  const defaultImage = "/images/newsletter-placeholder.jpg"; // Make sure to create this placeholder image

  return (
    <Card
      className="group relative w-full cursor-pointer bg-gradient-to-b from-torch-900 to-gray-900 transition-transform duration-300 hover:scale-[1.02]"
      onClick={() =>
        router.push(`/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`)
      }
    >
      {/* Aspect ratio container */}
      <div className="relative w-full pt-[132.35%]">
        {" "}
        {/* 900/680 ≈ 1.3235 */}
        <div className="absolute inset-0 m-2 overflow-hidden rounded-lg">
          {!imageError ? (
            <Image
              src={newsletter.top_screenshot_url || defaultImage}
              alt={newsletter.subject || "Newsletter preview"}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-5"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-gray-800 to-gray-900" />
          )}
        </div>
        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between py-2">
          <CardContent>
            <CardTitle className="mb-2 line-clamp-4 pt-4 text-xl leading-[1em] tracking-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {newsletter.subject || "No Subject"}
            </CardTitle>

            {newsletter.created_at && (
              <div className="mb-2 text-xs text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {formatDate(newsletter.created_at)}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-2 px-4 py-1 align-bottom">
            <div className="flex items-center space-x-4">
              {typeof newsletter.likes_count === "number" && (
                <div className="flex items-center space-x-2 rounded-full bg-black/70 px-2 py-1 text-white backdrop-blur-sm">
                  <HeartFullIcon className="h-4 w-4" />
                  <span className="text-xs">{newsletter.likes_count}</span>
                </div>
              )}
              {typeof newsletter.you_rocks_count === "number" && (
                <div className="flex items-center space-x-2 rounded-full bg-black/70 px-3 py-1 text-white backdrop-blur-sm">
                  <YouRockIcon className="h-4 w-4" />
                  <span className="text-xs">{newsletter.you_rocks_count}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSenderClick}
              className="rounded-full transition-transform duration-300 hover:scale-105"
            >
              <CardDescription className="inline-block truncate rounded-full bg-aquamarine-700 px-3 py-1 text-xs text-white hover:bg-aquamarine-600">
                {newsletter.sender || "Unknown Sender"}
              </CardDescription>
            </button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
