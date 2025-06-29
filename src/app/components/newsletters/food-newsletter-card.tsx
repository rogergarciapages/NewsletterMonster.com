"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Newsletter } from "@/types/newsletter";
import { slugify } from "@/utils/slugify";

interface FoodNewsletterCardProps {
  newsletter: Newsletter;
  priority?: boolean;
}

export function FoodNewsletterCard({ newsletter, priority = false }: FoodNewsletterCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-[400px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    );
  }

  const handleCardClick = () => {
    router.push(`/brand/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`);
  };

  // Default image for newsletters without a screenshot
  const defaultImage = "/images/newsletter-placeholder.jpg";

  // Get tag color based on sender name
  const getTagColor = () => {
    const sender = newsletter.sender?.toLowerCase() || "";

    if (sender.includes("timberland")) return "bg-[#36A18B]";
    if (sender.includes("twin") || sender.includes("peak")) return "bg-[#00A3C7]";
    if (sender.includes("essence")) return "bg-[#00B897]";
    if (sender.includes("vs") || sender.includes("pink")) return "bg-[#00B897]";
    if (sender.includes("joma")) return "bg-[#00A3C7]";
    if (sender.includes("holiday") || sender.includes("celebration")) return "bg-[#36A18B]";

    // Default
    return "bg-[#36A18B]";
  };

  return (
    <div className="overflow-hidden rounded-lg bg-zinc-900 shadow-md">
      {/* Image container - directly matching the screenshots */}
      <div className="aspect-square relative w-full cursor-pointer" onClick={handleCardClick}>
        <Image
          src={newsletter.top_screenshot_url || defaultImage}
          alt={newsletter.subject || "Newsletter preview"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          onError={() => setImageError(true)}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center p-2">
        <div className="flex items-center space-x-3">
          {/* Heart icon */}
          <div className="flex items-center space-x-1 rounded-full bg-gray-800 px-2 py-1">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-xs text-white">{newsletter.likes_count || 0}</span>
          </div>

          {/* Share icon */}
          <div className="flex items-center space-x-1 rounded-full bg-gray-800 px-2 py-1">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
            </svg>
            <span className="text-xs text-white">{newsletter.you_rocks_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Sender tag */}
      <div className="px-2 pb-3">
        <div className={`inline-block rounded-full ${getTagColor()} px-4 py-1.5`}>
          <span className="text-sm font-medium text-white">{newsletter.sender || "Unknown"}</span>
        </div>
      </div>
    </div>
  );
}
