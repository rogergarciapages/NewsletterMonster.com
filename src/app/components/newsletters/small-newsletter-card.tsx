"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardTitle } from "@/components/ui/card";
import { Newsletter } from "@/types/newsletter";
import { slugify } from "@/utils/slugify";

interface SmallNewsletterCardProps {
  newsletter: Newsletter;
  priority?: boolean;
}

export function SmallNewsletterCard({ newsletter, priority = false }: SmallNewsletterCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const defaultImage = "/images/newsletter-placeholder.jpg";

  return (
    <Card
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-all duration-300 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-torch-900 to-torch-800 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.995]" />

      <div className="relative w-full pt-[132.35%]">
        <div className="absolute inset-0 overflow-hidden">
          {!imageError ? (
            <Image
              src={newsletter.top_screenshot_url || defaultImage}
              alt={newsletter.subject || "Newsletter preview"}
              fill
              className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-5"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={75}
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-gray-800/90 to-gray-900/90 group-hover:from-gray-800/30 group-hover:to-gray-900/30" />
          )}
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-between">
          <div className="space-y-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <CardTitle className="line-clamp-3 text-lg leading-tight tracking-tight text-white">
              {newsletter.subject || "No Subject"}
            </CardTitle>

            {newsletter.created_at && (
              <div className="text-xs text-gray-300/90 group-hover:text-gray-200/60">
                {formatDate(newsletter.created_at)}
              </div>
            )}
          </div>

          <div className="space-y-3 bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-transparent">
            <div className="flex items-center space-x-2">
              {typeof newsletter.likes_count === "number" && (
                <div className="flex items-center space-x-1 rounded-full bg-black/70 px-2 py-1 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                  <HeartFullIcon className="h-3 w-3" />
                  <span className="text-xs font-medium">{newsletter.likes_count}</span>
                </div>
              )}
              {typeof newsletter.you_rocks_count === "number" && (
                <div className="flex items-center space-x-1 rounded-full bg-black/70 px-2 py-1 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                  <YouRockIcon className="h-3 w-3" />
                  <span className="text-xs font-medium">{newsletter.you_rocks_count}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleBrandClick}
                className="transform-gpu transition-all duration-300 hover:scale-105"
              >
                <span className="inline-block overflow-hidden truncate rounded-full bg-aquamarine-600/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-aquamarine-500/90 group-hover:bg-aquamarine-600/60 group-hover:hover:bg-aquamarine-500/60">
                  {newsletter.sender || "Unknown Sender"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
