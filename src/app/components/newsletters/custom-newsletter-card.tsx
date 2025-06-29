"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import type { Newsletter } from "@/types/newsletter";
import { slugify } from "@/utils/slugify";

interface CustomNewsletterCardProps {
  newsletter: Newsletter;
  priority?: boolean;
}

export function CustomNewsletterCard({ newsletter, priority = false }: CustomNewsletterCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative aspect-[3/4] w-full bg-gray-100 align-top dark:bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    router.push(`/brand/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`);
  };

  // Format date with null check
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  // Default image for newsletters without a screenshot
  const defaultImage = "/images/newsletter-placeholder.jpg";

  return (
    <div
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]"
      onClick={handleCardClick}
      style={{ padding: 0, border: "none" }}
    >
      {/* Direct image container with no gap */}
      <div className="relative w-full pt-[132.35%]">
        {/* Image container */}
        <div className="absolute inset-0 overflow-hidden">
          {!imageError ? (
            <Image
              src={newsletter.top_screenshot_url || defaultImage}
              alt={newsletter.subject || "Newsletter preview"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={75}
              priority={priority}
              onError={() => setImageError(true)}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-gray-800/90 to-gray-900/90" />
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-torch-900 to-torch-800 opacity-0 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between">
          {/* Title area */}
          <div className="space-y-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="line-clamp-4 text-xl font-semibold leading-tight tracking-tight text-white">
              {newsletter.subject || "No Subject"}
            </h3>

            {newsletter.created_at && (
              <div className="text-xs text-gray-300/90 group-hover:text-gray-200/60">
                {formatDate(newsletter.created_at)}
              </div>
            )}
          </div>

          {/* Footer with permanent glassy effect */}
          <div className="space-y-4 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 group-hover:bg-transparent">
            <div className="flex items-center space-x-4">
              {typeof newsletter.likes_count === "number" && (
                <div className="flex items-center space-x-2 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                  <HeartFullIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">{newsletter.likes_count}</span>
                </div>
              )}
              {typeof newsletter.you_rocks_count === "number" && (
                <div className="flex items-center space-x-2 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                  <YouRockIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">{newsletter.you_rocks_count}</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <span className="inline-block overflow-hidden truncate rounded-full bg-aquamarine-600/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                {newsletter.sender || "Unknown Sender"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
