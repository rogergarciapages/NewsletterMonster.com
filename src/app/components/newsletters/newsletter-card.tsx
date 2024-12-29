"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge as BadgeType } from "@prisma/client";

import { Badge } from "@/app/components/newsletters/badge";
import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardTitle } from "@/components/ui/card";
import { Newsletter } from "@/types/newsletter";
import { slugify } from "@/utils/slugify";

interface NewsletterCardProps {
  newsletter: Newsletter;
  priority?: boolean;
  showBadges?: boolean;
}

export function NewsletterCard({
  newsletter,
  priority = false,
  showBadges = true,
}: NewsletterCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [badges, setBadges] = useState<BadgeType[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showBadges) {
      const fetchBadges = async () => {
        try {
          const response = await fetch(`/api/badges/newsletter/${newsletter.newsletter_id}`);
          if (response.ok) {
            const data = await response.json();
            setBadges(data);
          }
        } catch (error) {
          console.error("Error fetching badges:", error);
        }
      };

      fetchBadges();
    }
  }, [newsletter.newsletter_id, showBadges]);

  if (!mounted) {
    // Return a placeholder with the same dimensions
    return (
      <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      </div>
    );
  }

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/brand/${slugify(newsletter.sender || "")}`);
  };

  const handleCardClick = () => {
    router.push(`/brand/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`);
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
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-all duration-300 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-torch-900 to-torch-800 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.995]" />

      {/* Aspect ratio container */}
      <div className="relative w-full pt-[132.35%]">
        <div className="absolute inset-0 overflow-hidden">
          {!imageError ? (
            <Image
              src={newsletter.top_screenshot_url || defaultImage}
              alt={newsletter.subject || "Newsletter preview"}
              fill
              className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-5"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-gray-800/90 to-gray-900/90 group-hover:from-gray-800/30 group-hover:to-gray-900/30" />
          )}
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between">
          {/* Title area */}
          <div className="space-y-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <CardTitle className="line-clamp-4 text-xl leading-tight tracking-tight text-white">
              {newsletter.subject || "No Subject"}
            </CardTitle>

            {newsletter.created_at && (
              <div className="text-xs text-gray-200/90 group-hover:text-gray-200/60">
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

            <button
              onClick={handleBrandClick}
              className="transform-gpu transition-all duration-300 hover:scale-105"
            >
              <span className="inline-block overflow-hidden truncate rounded-full bg-aquamarine-600/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-aquamarine-500/90 group-hover:bg-aquamarine-600/60 group-hover:hover:bg-aquamarine-500/60">
                {newsletter.sender || "Unknown Sender"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showBadges && badges.length > 0 && (
        <div className="absolute right-3 top-3 z-20 flex flex-wrap gap-2">
          {badges.map(badge => (
            <Badge key={badge.id} badge={badge} size="sm" />
          ))}
        </div>
      )}
    </Card>
  );
}
